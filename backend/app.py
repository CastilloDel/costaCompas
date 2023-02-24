from flask import Flask, request
from flask_cors import CORS

from datetime import datetime, timedelta
import peticiones

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

"""
cache = None
fecha_cache = None

def obtenerPlayas():
    global cache
    global fecha_cache
    if cache is None or fecha_cache is None or fecha_cache + timedelta(hours=1) < datetime.now():
        cache = peticiones.conseguirPlayas()
        fecha_cache = datetime.now()
        app.logger.info("Se ha actualizado la cache")
    
    return cache
"""

# TODO la cache
@app.route("/")
def datos_meteorologicos():
    lat = request.args.get("latitud", type=float)
    lon = request.args.get("longitud", type=float)
    dia = request.args.get("dia", type=int)
    hora = request.args.get("hora", type=int)

    return peticiones.conseguirPlayas(lat, lon, dia, hora)

