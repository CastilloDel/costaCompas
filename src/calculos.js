const ponderaciones = {
    "kite": {
        "viento": 1.0,
        "temperatura": 0.5
    }
}

const valores_optimos = {
    "kite": {
        "viento": 10.0,

    }
}

const valores_estandarizacion = {
    "viento": {
        "media": 10.0,
        "desviacion_estandar": 5.0
    }
}

const playas = ["playa1", "playa2"]


// Estrucutra de valores_caracteristicas
// {
//     "playa1": {
//         "viento": 10.0,
//         "temperatura": 20.0
//     },
//     "playa2": {
//         ...
function lista_playas_por_preferencia(valores_caracteristicas, actividad) {
    let lista_playas = [];
    for (var playa in playas) {
        lista_playas.push({
            "playa": playa,
            "ecm_ponderado": ecm_ponderado(valores_caracteristicas[playa],
                valores_optimos[actividad],
                valores_estandarizacion,
                ponderaciones[actividad])
        });
    }

    lista_playas.sort((a, b) => (a.ecm_ponderado > b.ecm_ponderado) ? 1 : ((b.ecm_ponderado > a.ecm_ponderado) ? -1 : 0));

    return lista_playas;
}

// Valores estandarización es un objeto (JSON) con las claves de las características y valores
// objetos con las claves "media" y "desviacion_estandar"
function ecm_ponderado(valores_caracteristicas, valores_optimos, ponderaciones) {
    valores_caracteristicas_estandarizados = estandarizar(valores_caracteristicas);
    valores_optimos_estandarizados = estandarizar(valores_optimos);

    let ecm_ponderado = 0
    for (i = 0; i < valores_caracteristicas_estandarizados.length; i++) {
        ecm_ponderado += Math.pow(valores_caracteristicas_ponderados[i] - valores_optimos[i], 2) * ponderaciones[i];
    }

    return ecm_ponderado;
}

// Estandarización normal
function estandarizar(valores) {
    let valores_estandarizados = {};

    for (var caracteristica in valores) {
        valores_estandarizados[caracteristica] = (valores[caracteristica] - valores_estandarizacion[caracteristica].media) / valores_estandarizacion[caracteristica].desviacion_estandar;
    }

    return valores_estandarizados;
}