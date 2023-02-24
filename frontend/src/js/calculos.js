import { valoresOptimos, ponderaciones, valoresEstandarizacion } from "./actividades";

// Estructura de valores_caracteristicas
// {
//     "playa1": {
//         "viento": 10.0,
//         "temperatura": 20.0
//     },
//     "playa2": {
//         ...

// Devuelve
//[
//    { nombre: 'playa1', ecmPonderado: 24.910937600000004 },
//    { nombre: 'playa2', ecmPonderado: 30.3795776 }
//  ]
export const listaPlayasPorPreferencia = (valoresCaracteristicas, actividad) => {
    let listaPlayas = [];
    for (const nombre in valoresCaracteristicas) {
        listaPlayas.push({
            "nombre": nombre,
            "ecmPonderado": ecmPonderado(valoresCaracteristicas[nombre], actividad)
        });
    }

    listaPlayas.sort((a, b) => a.ecmPonderado - b.ecmPonderado);

    return listaPlayas;
}

// Valores estandarización es un objeto (JSON) con las claves de las características y valores
// objetos con las claves "media" y "desviacion_estandar"
const ecmPonderado = (valoresCaracteristicas, actividad) => {

    let valoresCaracteristicasEstandarizados = estandarizar(valoresCaracteristicas);
    let valoresOptimosEstandarizados = estandarizar(valoresOptimos[actividad]);

    let ecmPonderado = 0
    for (const caracteristica of ["temperatura", "viento", "coberturaNubes"]) {
        ecmPonderado += ponderaciones[actividad][caracteristica] * Math.pow(valoresCaracteristicasEstandarizados[caracteristica] - valoresOptimosEstandarizados[caracteristica], 2);
    }

    return ecmPonderado;
}

// Estandarización normal
const estandarizar = (valores) => {
    let valoresEstandarizados = {};
    if (valores === undefined) {
        console.log("UNDEFINED")
    }
    for (const caracteristica of ["temperatura", "viento", "coberturaNubes"]) {
        valoresEstandarizados[caracteristica] = (valores[caracteristica] - valoresEstandarizacion[caracteristica].media) / valoresEstandarizacion[caracteristica].desviacionEstandar;
    }

    return valoresEstandarizados;
}
