import React from 'react'
import { Card, CardHeader, CardContent, Divider, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
	card: {
		height: '100%',
		maxHeight: '100%',
		display: 'flex',
		flexDirection: 'column'
	},
	columnArea: {
		flexGrow: 1,
		padding: 0,
		backgroundColor: 'white',
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'column',
		overflowY: 'auto'
	}
}))

const Column = ({ children, title, elevation, ...rest }) => {
	const classes = useStyles()

	return (
		<Grid
			item
			{...rest}
		/>
)
}

export default Column
