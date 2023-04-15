# CostaCompas

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description :book:

CostaCompas is a project developed during the Hackathon HackUDC in A Coruña. It consists of a website that recommends the best beach for the user based on the activity they want to do. The available activities are sunbathing :sunny:, playing volleyball :soccer:, swimming :swimmer:, running :running:, and windsurfing :surfer:. The user can select the day (today, tomorrow, or the day after tomorrow) and the time they want to go to the beach. In addition, the user must select the location from which they want to go to the beach or let the system know their current location.

Once the user has selected the day, the activity, and the location, the system obtains the 20 closest beaches and ranks them based on the weather conditions (wind, temperature, and cloud area fraction) and the activity the user wants to do. We obtain weather conditions using [MeteoSIX's API](https://www.meteogalicia.gal/web/proxectos/meteosix.action), provided by MeteoGalicia.

Once the ranking is done, the system shows the 5 best beaches, indicating the temperature, wind, distance, and driving time, and shows a map with the driving route to each of the 5 best beaches.

## Usage :wrench:

### Backend

First of all, to run the backend you need to create a file called `secrets.json` including an API Key of MeteoSIX. You can request one on the [MeteoSIX's API](https://www.meteogalicia.gal/web/proxectos/meteosix.action) web site.

The file `secrets.json` must be like this:

```
{
  "API_KEY_METEO": "YOUR_API_KEY"
}
```

#### Linux

To run the backend on Linux:

```
pip install -r requirements.txt
export FLASK_APP="app.py"
flask run
```

#### Windows Powershell and venv

To run the backend on Windows it could be helpfull use virtual environments:

```
python -m venv myvenv
./myvenv/Scripts/Activate
pip install -r requirements.txt
```

Once the venv is created, you can modify `Activate.ps1` to run flask automatically, adding the following lines:

```
$env:FLASK_APP = "app.py"
flask --debug run
```

### Frontend

To run the frontend, you can use npm:

```
npm install
nom run dev
```

## Team :two_men_holding_hands:

- [Sergio Álvarez Perez](https://github.com/sergio-alv-per)
- [Daniel Pérez Vargas](https://github.com/DaniPVargas)
- [Daniel del Castillo de la Rosa](https://github.com/CastilloDel)
- [Antón Gómez López](https://github.com/antongomez)

## License :blue_book:

CostaCompas is under the MIT license. Please see the LICENSE file for more information.
