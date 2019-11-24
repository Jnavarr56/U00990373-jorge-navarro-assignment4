import axios from 'axios'


const getHEREUrl = (endpoint, queryParams) => {

    let base = `
        https://transit.api.here.com/v3${endpoint}.json?app_id=${process.env.REACT_APP_HERE_APP_ID}&app_code=${process.env.REACT_APP_HERE_APP_CODE}`

    queryParams.forEach(param => {

        const key = Object.keys(param)[0]

        base += `&${key}=${param[key]}`
    })

    return base
}


export const getAllNextNearbyDepartures = async (lat, lng) => {

    const url = getHEREUrl('/multiboard/by_geocoord', [
        { center: `${lat},${lng}` },
        { time: new Date().toISOString() },
        { modes: 'subway' },
    ])

    
    return await axios.get(url)
        .then(({ data }) => data.Res.MultiNextDepartures.MultiNextDeparture)
        .catch(() => null)
}

export const getNextDeparturesForStation = async stationId => {

    const url = getHEREUrl('/multiboard/by_stn_ids', [
        { time: new Date().toISOString() },
        { stnIds: stationId },
    ])


    return await axios.get(url)
        .then(({ data }) => data.Res.MultiNextDepartures.MultiNextDeparture[0].NextDepartures.Dep)
        .catch(err => null)
}