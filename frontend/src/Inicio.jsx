import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useMapEvent } from 'react-leaflet/hooks';
import 'leaflet/dist/leaflet.css';

const actividades = ["Voleibol", "Kite Surf", "Tomar o sol", "Natación", "Correr"];
const imagenesActividades = {
  "Kite Surf": "assets/kite.svg",
  "Voleibol": "assets/pelota.svg",
  "Tomar o sol": "assets/sun.svg",
  "Natación": "assets/swimming.svg",
  "Correr": "assets/running.svg"
};
const posiblesDias = {
  'Hoxe': 0,
  'Mañá': 1,
  'Pasado mañá': 2,
};

export const Inicio = () => {
  const navigate = useNavigate();
  const [actividadEscogida, setActividadEscogida] = useState(actividades[0]);
  const fechaActual = new Date();
  const horaActual = fechaActual.getHours();
  const [hora, setHora] = useState(0);
  const [dia, setDia] = useState(horaActual === 23 ? 1 : 0);
  const [latitud, setLatitud] = useState(undefined);
  const [longitud, setLongitud] = useState(undefined);
  const [indiceActividad, setIndiceActividad] = useState(0);
  const [usarGPS, setUsarGPS] = useState(false);
  const [localizacionError, setLocalizacionError] = useState(false);

  const posiblesDias = {
    'Hoxe': 0,
    'Mañá': 1,
    'Pasado mañá': 2,
  };

  const containerStyle = {
    width: '100 %',
    height: '250px'
  };
  const defaultCenter = {
    lat: 43.3322352,
    lng: -8.4106015,
  }

  function LocationMarker() {
    const map = useMapEvent('click', (e) => {
      setLatitud(e.latlng.lat);
      setLongitud(e.latlng.lng);
      setLocalizacionError(false);
      setUsarGPS(false);
    })

    return (latitud === undefined || longitud === undefined) ? undefined : (
      <Marker position={{lat: latitud, lng: longitud}}>
        <Popup>Punto de partida</Popup>
      </Marker>
    )
  }

  return (
    <div>
      <div className="py-4 px-5 justify-content-center align-items-center">
        <h1 className="text-center pb-3">Imos á praia?</h1>
        <Form>
          <Row className="align-items-center justify-content-center pb-4">
            <Col sm={3}>
              <Form.Label>Que día queres ir?</Form.Label>
              <div>
                <ButtonGroup>
                  {Object.entries(posiblesDias).map(([diaElegido, codigoDia]) => (
                    <ToggleButton
                      key={codigoDia}
                      disabled={codigoDia === 0 && horaActual === 23}
                      id={`dia-${codigoDia}`}
                      type="radio"
                      variant='outline-primary'
                      checked={codigoDia === dia}
                      onChange={() => {
                        setDia(codigoDia);
                        if (codigoDia == 0) {
                          setHora(horaActual + 1);
                        }
                      }}
                    >
                      {diaElegido}
                    </ToggleButton>
                  ))}
                </ButtonGroup>
              </div>


              <Form.Group className="pb-4">
                <Form.Label>A que hora vas chegar?</Form.Label>
                <Form.Select >
                  {[...Array(24).keys()].slice(dia === 0 ? horaActual + 1 : 0).map((posibleHora) => {
                    return (
                      <option key={posibleHora} onClick={() => {
                        setHora(dia === 0 ? posibleHora - horaActual - 1 : posibleHora);
                      }}>
                        {("0" + posibleHora).slice(-2) + ":00"}
                      </option>)
                  })}
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label >Usar a túa ubicación actual</Form.Label>
                <div>
                  <BootstrapSwitchButton
                    checked={usarGPS}
                    onChange={(checked) => {
                      if (checked) {
                        navigator.geolocation.getCurrentPosition((location) => {
                          setLatitud(location.coords.latitude);
                          setLongitud(location.coords.longitude);
                          setLocalizacionError(false);
                        });
                        setUsarGPS(true);
                      } else {
                        setLatitud(undefined);
                        setLongitud(undefined);
                        setUsarGPS(false);
                      }
                    }}
                  />
                </div>
                <Form.Label className="mb-1 mt-4">Alternativamente, podes seleccionar un punto de partida</Form.Label>
                <div class="bg-primary">
                  <MapContainer
                    center={defaultCenter}
                    zoom={10}
                    scrollWheelZoom={false}
                    style={containerStyle}
                    onClick={(e) => {
                      setPosition(e.latlng)
                    }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker />
                  </MapContainer>
                </div>
              </Form.Group>

            </Col>

            <Col sm={7}>
              <Row className="mb-5 justify-content-center align-items-top">
                <img style={{ cursor: "pointer" }} className="col-1" src="assets/leftArrow.svg" onClick={() => {
                  setIndiceActividad(indiceActividad === 0 ? actividades.length - 1 : indiceActividad - 1);
                }} />
                {[...Array(3).keys()].map((indice) => {
                  return actividades[(indice + indiceActividad) % actividades.length]
                }
                ).map((actividad) => {
                  return (<Card
                    className={"card col-3 me-1 ms-1 " + (actividadEscogida == actividad ? " border-primary border border-2 " : "")}
                    key={actividad}
                    onClick={() => {
                      setActividadEscogida(actividad);
                    }}>
                    <Card.Img variant="top" src={imagenesActividades[actividad]} />
                    <Card.Body>
                      <Card.Title className="text-center">{actividad}</Card.Title>
                    </Card.Body>
                  </Card>)
                })}
                <img style={{ cursor: "pointer" }} className="col-1" src="assets/rightArrow.svg" onClick={() => {
                  setIndiceActividad(indiceActividad + 1);
                }} />

              </Row>

              <Row className="justify-content-center pb-2">
                <h4 className="text-center">Así que {actividadEscogida}, non? </h4>
              </Row>

              <Row className="justify-content-center align-items-center">
                <Col className="d-flex align-items-center justify-content-center">
                  <Button variant="primary" size="lg" onClick={() => {
                    if (latitud !== undefined && longitud !== undefined) {
                      navigate("/resultados", {
                        state: { actividad: actividadEscogida, hora: hora, dia: dia, latitud: latitud, longitud: longitud }
                      })
                    } else {
                      setLocalizacionError(true);
                    }
                  }}>
                    Buscar
                  </Button>

                </Col>
              </Row >
              <Row className="justify-content-center align-items-center text-danger">
                {localizacionError && (<h6 className="text-center mt-4">Tes que poñer a túa localización primeiro!</h6>)}
              </Row>

            </Col>

          </Row>

        </Form>

      </div >
    </div >
  )
}

