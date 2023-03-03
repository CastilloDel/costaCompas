from flask import Flask, request
from flask_cors import CORS

import peticiones

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/")
def datos_meteorologicos():
    lat = request.args.get("latitud", type=float)
    lon = request.args.get("longitud", type=float)
    dia = request.args.get("dia", type=int)
    hora = request.args.get("hora", type=int)

    return peticiones.conseguirPlayas(lat, lon, dia, hora)

