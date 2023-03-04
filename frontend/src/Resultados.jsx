import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { useLocation } from 'react-router';
import { listaPlayasPorPreferencia } from './js/calculos';
import { useEffect, useState } from 'react';
import { URL_BACKEND } from "../package.json";
import ClipLoader from 'react-spinners/ClipLoader';

import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export const Resultados = () => {
  const location = useLocation();
  const [playas, setPlayas] = useState();
  const [hora] = useState(location.state?.hora);
  const [dia] = useState(location.state?.dia);
  const [actividad] = useState(location.state?.actividad);
  const [latitud] = useState(location.state?.latitud);
  const [longitud] = useState(location.state?.longitud);
  const [playaActiva, setPlayaActiva] = useState(0);
  const [tiempo, setTiempo] = useState();
  const [distancia, setDistancia] = useState();

  useEffect(() => {
    const getBackendData = async () => {
      if (playas === undefined) {
        let response = await fetch(URL_BACKEND + `?latitud=${latitud}&longitud=${longitud}&dia=${dia}&hora=${hora}`);
        setPlayas(await response.json());
      }
    }
    getBackendData();
  });


  if ([hora, dia, actividad, latitud, longitud].includes(undefined)) {
    return (
      <div class="my-4">
        <Row className="px-5 justify-content-center">
          <Col sm={4}>
            <h3 class="text-center">Sentímolo moito, tivo lugar un erro cargando a páxina. </h3>
          </Col>
        </Row>

        <div class="d-flex justify-content-center mt-3">
          <Button size="lg" variant="primary" href='/'>
            Volver á páxina de inicio
          </Button>
        </div>

      </div>
    );
  }

  if (playas === undefined) {
    return (
      <div className="d-flex loader-container justify-content-center align-items-center vh-100">
        <ClipLoader color={'#000'} size={150} />
      </div>
    );
  }

  let rankingPlayas = listaPlayasPorPreferencia(playas, actividad);

  const destino = { lat: playas[rankingPlayas[playaActiva].nombre].lat, lng: playas[rankingPlayas[playaActiva].nombre].lon }
  const orixe = { lat: latitud, lng: longitud }

  const containerStyle = {
    width: '100 %',
    height: '350px'
  };
  const defaultCenter = {
    lat: 43.3322352,
    lng: -8.4106015,
  }

  return (
    <div class="d-flex flex-column">
      <Row className="mx-4 mt-4 mb-2">
        <Col sm={1}>
          <Button variant="outline-secondary" href="/" >Volver</Button>{' '}
        </Col>
      </Row>
      <Row className="mb-4">
        <Col sm={12}>
          <h2 class="text-center">Aquí tes as mellores praias para <strong>{actividad}</strong></h2>
        </Col>
      </Row>
      <Row className="px-5 justify-content-center pt-4">
        <Col sm={3} className="me-5">
          <h4 class="text-center">Ranking de praias</h4>
          <ListGroup as="ol" numbered>
            {rankingPlayas.slice(0, 5).map((playa, index) => {
              return (
                <ListGroup.Item style={{ cursor: "pointer" }} className={index === playaActiva ? 'text-white bg-primary' : ""}
                  onClick={() => { setPlayaActiva(index) }}
                  key={index}
                  checked={index === playaActiva}
                >
                  {playa.nombre}
                </ListGroup.Item>
              )
            })}
          </ListGroup>
        </Col>

        <Col sm={6} className="ms-5">
          < Row className="p-2 border border-secondary shadow border-2 rounded">
            <Col sm={5}>
              <h4 className="text-center"><u>{rankingPlayas[playaActiva].nombre}</u></h4>
              <p>{"Vento: " + playas[rankingPlayas[playaActiva].nombre].viento + " Km/h"}</p>
              <p>{"Temperatura: " + playas[rankingPlayas[playaActiva].nombre].temperatura + " ºC"}</p>
              <p>{"Cobertura de nubes: " + playas[rankingPlayas[playaActiva].nombre].coberturaNubes + " %"}</p>
              <p>{"Distancia en coche: " + distancia}</p>
              <p>{"Tempo estimado de traxecto: " + tiempo}</p>
            </Col>
            <Col>
              <div className="px-0 py-1 w-100 h-100">
              <MapContainer
                    center={destino}
                    zoom={10}
                    scrollWheelZoom={false}
                    style={containerStyle}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                  </MapContainer>

              </div>
            </Col>
          </Row>

        </Col>
      </Row >
    </div >
  );
}

