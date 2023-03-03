import json 
import requests
from datetime import datetime
import geopy.distance
from threading import Thread

with open('./playasAmpliado.json', 'r') as f1:
    playas = json.load(f1)

with open('./secrets.json', 'r') as f2:
    secrets = json.load(f2)

METEO_URL = "http://servizos.meteogalicia.es/apiv3_APPs/getNumericForecastInfo?"
VARIABLES = "temperature,wind,cloud_area_fraction"

# En la cache habrá objetos de la forma:
# id: {momento_peticion: timestamp, datos: ...}
CACHE = {}


def obtenerPlayasMasCercanas(lat, lon, n=20):
    playasConDistancia = []
    for playa in playas:
        coords1 = (lat, lon)
        coords2 = (playa['coord'][1], playa['coord'][0])
        distanciaPlaya = geopy.distance.distance(coords1, coords2).km
        playasConDistancia.append((playa, distanciaPlaya))

    return [playa[0] for playa in sorted(playasConDistancia, key=lambda x: x[1])[:n]]

def consultarPlaya(id, tiempoCacheSegundos=3600*24):
    if id in CACHE and datetime.now().timestamp() - CACHE[id]['momento_peticion'] < tiempoCacheSegundos:
        return CACHE[id]['datos']
    else:
        consulta = generarConsulta(id)
        res = requests.get(consulta)
        response = json.loads(res.text)
        CACHE[id] = {"momento_peticion": datetime.now().timestamp(), "datos": response}
        return response

# Estructura de valores_caracteristicas
# {
#     "playa1": {
#         "viento": 10.0,
#         "temperatura": 20.0,
#         ...
#     },
#     "playa2": {
#         ...
def conseguirPlaya(playa, dia, hora, playasConDatos):
    response = consultarPlaya(playa['id'])
    properties = response['features'][0]['properties']

    playasConDatos[properties['name']] = {
        'temperatura': properties['days'][dia]['variables'][0]['values'][hora]['value'],
        'viento': properties['days'][dia]['variables'][1]['values'][hora]['moduleValue'],
        'coberturaNubes': properties['days'][dia]['variables'][2]['values'][hora]['value'],
        'lon': playa['coord'][0],
        'lat': playa['coord'][1]
    }

def conseguirPlayas(lat, lon, dia, hora):
    playasConDatos = {}
    threads = []
    for playa in obtenerPlayasMasCercanas(lat, lon):
        thread = Thread(target=conseguirPlaya, args=(playa, dia, hora, playasConDatos))
        threads.append(thread)
        thread.start()
    for thread in threads:
        thread.join()
    return playasConDatos


def generarConsulta(id):
    key = secrets['API_KEY_METEO']
    return f"{METEO_URL}locationIds={id}&variables={VARIABLES}&API_KEY={key}"
