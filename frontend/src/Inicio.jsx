import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import B from "bootstrap-switch-button-react";
// See https://github.com/vitejs/vite/issues/2139 for more information on this
const BootstrapSwitchButton = B.default || B;
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { useMapEvent } from "react-leaflet/hooks";
import "leaflet/dist/leaflet.css";
import kiteSVG from "../assets/kite.svg";
import pelotaSvg from "../assets/pelota.svg";
import sunSVG from "../assets/sun.svg";
import swimmingSVG from "../assets/swimming.svg";
import runningSVG from "../assets/running.svg";
import leftArrow from "../assets/leftArrow.svg";
import rightArrow from "../assets/rightArrow.svg";

const actividades = [
  "Voleibol",
  "Kite Surf",
  "Tomar o sol",
  "Natación",
  "Correr",
];
const imagenesActividades = {
  "Kite Surf": kiteSVG,
  Voleibol: pelotaSvg,
  "Tomar o sol": sunSVG,
  Natación: swimmingSVG,
  Correr: runningSVG,
};
const posiblesDias = {
  Hoxe: 0,
  Mañá: 1,
  "Pasado mañá": 2,
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
  const [localizationErrorCode, setLocalizationErrorCode] = useState(undefined);
  const [buscandoLoc, setBuscandoLoc] = useState(false);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  window.addEventListener("resize", () => {
    setWindowWidth(window.innerWidth);
  });

  /* Almacena o mapa de openmaps para depois poder usar un evento dende o swich button */
  let mapa = null;

  const containerStyle = {
    width: "100 %",
    height: "250px",
  };
  const defaultCenter = {
    lat: 43.3322352,
    lng: -8.4106015,
  };

  function LocationMarker() {
    /* Hook providing the Leaflet Map instance in any descendant of a MapContainer */
    const map = useMapEvent("click", (e) => {
      setLatitud(e.latlng.lat);
      setLongitud(e.latlng.lng);
      setLocalizacionError(false);
      setUsarGPS(false);
      setLocalizationErrorCode(undefined);
    });

    return latitud === undefined || longitud === undefined ? undefined : (
      <Marker position={{ lat: latitud, lng: longitud }}>
        <Popup>Punto de partida</Popup>
      </Marker>
    );
  }

  function LocationFound() {
    const map = useMapEvents({
      locationfound(location) {
        setBuscandoLoc(false);
        setLatitud(location.latlng.lat);
        setLongitud(location.latlng.lng);
        setLocalizacionError(false);
        map.flyTo(location.latlng, map.getZoom());
      },

      locationerror(error) {
        setBuscandoLoc(false);
        setLocalizationErrorCode(error.code);
        console.log("Codigo de erro " + error.code + ": " + error.message);
      },
    });

    return null;
  }

  function AttributionControl() {
    const map = useMap();

    map.attributionControl.setPrefix(
      '<a href="https://leafletjs.com/" title="A JavaScript library for interactive maps">Leaflet</a>'
    );

    /* Deste xeito podemos acceder aos metodos de map dende un componhente de fora de MapContainer */
    mapa = map;

    return null;
  }

  return (
    <div>
      <div className="py-4 px-5 justify-content-center align-items-center">
        <h1 className="text-center pb-3">Imos á praia?</h1>
        <Form>
          <Row className="align-items-center justify-content-center pb-4">
            <Col xl={3} className="mb-4">
              <Form.Label>Que día queres ir?</Form.Label>
              <div>
                <ButtonGroup>
                  {Object.entries(posiblesDias).map(
                    ([diaElegido, codigoDia]) => (
                      <ToggleButton
                        key={codigoDia}
                        disabled={codigoDia === 0 && horaActual === 23}
                        id={`dia-${codigoDia}`}
                        type="radio"
                        variant="outline-primary"
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
                    )
                  )}
                </ButtonGroup>
              </div>

              <Form.Group className="pb-4">
                <Form.Label>A que hora vas chegar?</Form.Label>
                <Form.Select>
                  {[...Array(24).keys()]
                    .slice(dia === 0 ? horaActual + 1 : 0)
                    .map((posibleHora) => {
                      return (
                        <option
                          key={posibleHora}
                          onClick={() => {
                            setHora(
                              dia === 0
                                ? posibleHora - horaActual - 1
                                : posibleHora
                            );
                          }}
                        >
                          {("0" + posibleHora).slice(-2) + ":00"}
                        </option>
                      );
                    })}
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label>Usar a túa ubicación actual</Form.Label>
                <div className="container px-0 mx-0">
                  <Row className="d-flex">
                    <Col className="flex-grow-0">
                      <BootstrapSwitchButton
                        checked={usarGPS}
                        onChange={(checked) => {
                          if (checked) {
                            /* Se en 10 segundos non se obten a localizacion salta un erro */
                            mapa.locate({ timeout: 10000 });
                            setUsarGPS(true);
                            setBuscandoLoc(true);
                          } else {
                            setLatitud(undefined);
                            setLongitud(undefined);
                            setUsarGPS(false);
                            setLocalizationErrorCode(undefined);
                          }
                        }}
                      />
                    </Col>
                    <Col className="d-flex align-items-center flex-grow-1 ps-1">
                      {buscandoLoc ? (
                        <p className="text-secondary my-0">Buscando...</p>
                      ) : null}
                    </Col>
                  </Row>
                  <Row className="justify-content-start align-items-center pt-2">
                    <p
                      className={
                        localizationErrorCode !== 3
                          ? "invisible"
                          : "text-danger visible"
                      }
                    >
                      Non se puido ober a túa localizacion
                    </p>
                  </Row>
                </div>
                <Form.Label className="mb-1">
                  Alternativamente, podes seleccionar un punto de partida
                </Form.Label>
                <div class="bg-primary">
                  <MapContainer
                    center={defaultCenter}
                    zoom={10}
                    scrollWheelZoom={true}
                    style={containerStyle}
                    onClick={(e) => {
                      setPosition(e.latlng);
                    }}
                  >
                    <AttributionControl />
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationFound />
                    <LocationMarker />
                  </MapContainer>
                </div>
              </Form.Group>
            </Col>

            <Col xl={7}>
              <Row className="mb-5 justify-content-center align-items-top">
                <img
                  style={{ cursor: "pointer" }}
                  className="col-md-1 col-2"
                  src={leftArrow}
                  onClick={() => {
                    setIndiceActividad(
                      indiceActividad === 0
                        ? actividades.length - 1
                        : indiceActividad - 1
                    );
                  }}
                />
                {[...Array(windowWidth >= 768 ? 3 : 1).keys()]
                  .map((indice) => {
                    return actividades[
                      (indice + indiceActividad) % actividades.length
                    ];
                  })
                  .map((actividad) => {
                    return (
                      <Card
                        className={
                          "card col-md-3 col-sm-5 col-6 me-1 ms-1 " +
                          (actividadEscogida == actividad
                            ? " border-primary border border-2 "
                            : "")
                        }
                        key={actividad}
                        onClick={() => {
                          setActividadEscogida(actividad);
                        }}
                      >
                        <Card.Img
                          variant="top"
                          src={imagenesActividades[actividad]}
                        />
                        <Card.Body>
                          <Card.Title className="text-center">
                            {actividad}
                          </Card.Title>
                        </Card.Body>
                      </Card>
                    );
                  })}
                <img
                  style={{ cursor: "pointer" }}
                  className="col-md-1 col-2"
                  src={rightArrow}
                  onClick={() => {
                    setIndiceActividad(indiceActividad + 1);
                  }}
                />
              </Row>

              <Row className="justify-content-center pb-2">
                <h4 className="text-center">
                  Así que {actividadEscogida}, non?{" "}
                </h4>
              </Row>

              <Row className="justify-content-center align-items-center">
                <Col className="d-flex align-items-center justify-content-center">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => {
                      if (latitud !== undefined && longitud !== undefined) {
                        navigate("/resultados", {
                          state: {
                            actividad: actividadEscogida,
                            hora: hora,
                            dia: dia,
                            latitud: latitud,
                            longitud: longitud,
                          },
                        });
                      } else {
                        setLocalizacionError(true);
                      }
                    }}
                  >
                    Buscar
                  </Button>
                </Col>
              </Row>
              <Row className="justify-content-center align-items-center text-danger">
                {localizacionError && (
                  <h6 className="text-center mt-4">
                    Tes que poñer a túa localización primeiro!
                  </h6>
                )}
              </Row>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};
