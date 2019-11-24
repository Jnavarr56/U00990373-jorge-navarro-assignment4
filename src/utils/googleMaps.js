const { maps } = window.google

export const getAddressFromCoords = (lat, lng) => {
	const { geocode } = new maps.Geocoder()
	const query = {
		location: { lat, lng }
	}

	return new Promise(resolve => {
		geocode(query, (result, status) => {
			resolve(status === 'OK' ? result : null)
		})
	})
}

export const isInNYC = reverseGeocodeResults => {
	return reverseGeocodeResults.find(result => {
		if (!result.types.includes('locality')) return false

		return result.address_components.find(({ types, long_name }) => {
			return types.includes('locality') ? long_name === 'New York' : false
		})
	})
		? true
		: false
}

export const getNearbyStations = (lat, lng) => {
	const query = {
		location: { lat, lng },
		rankBy: maps.places.RankBy.DISTANCE,
		type: [ 'subway_station' ]
	}

	if (!document.getElementById('dummy-map')) {
		const dummyMap = document.createElement('div')
		dummyMap.setAttribute('id', 'dummy-map')

		document.body.appendChild(dummyMap)
	}

	const places = new maps.places.PlacesService(
		document.getElementById('dummy-map')
	)

	return new Promise(resolve => {
		places.nearbySearch(query, (results, status) => {
			resolve(status === 'OK' ? results : null)
		})
	})
}

export const getWalkingDirections = (
	originLatLngLiteral,
	destinationLatLngLiteral
) => {
	const directions = new maps.DirectionsService()
	const query = {
		origin: originLatLngLiteral,
		destination: destinationLatLngLiteral,
		travelMode: 'WALKING'
	}

	return new Promise(resolve => {
		directions.route(query, (result, status) => {
			resolve(status === 'OK' ? result : null)
		})
	})
}

export const renderWalkingRoute = (id, directions) => {
	const directionsRenderer = new maps.DirectionsRenderer()
	const map = new maps.Map(document.getElementById(id), { zoom: 7 })

	directionsRenderer.setMap(map)
	directionsRenderer.setDirections(directions)
}
