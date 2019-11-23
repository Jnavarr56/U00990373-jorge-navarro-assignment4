import { colors } from '@material-ui/core'

const white = '#FFFFFF'
const black = '#000000'

/*
  The app (src/App.js) is wrapped in a ThemeProvider component
  which is passed a custom theme object created in ./index.js.

  This palette is used in the creation of that theme object so 
  we set the color scheme for the app here.

  Matarial UI Color Palette Generator: 
  http://mcg.mbitson.com/#!?mcgpalette0=%235fb160
*/
const appColor = {
	primary: {
		50: '#fdf5e0',
		100: '#fbe5b3',
		200: '#f9d480',
		300: '#f6c34d',
		400: '#f4b626',
		500: '#f2a900',
		600: '#f0a200',
		700: '#ee9800',
		800: '#ec8f00',
		900: '#e87e00',
		A100: '#ffffff',
		A200: '#ffeddc',
		A400: '#ffd3a9',
		A700: '#ffc690'
	},
	secondary: {
		50: '#e8eaf6',
		100: '#c5cbe9',
		200: '#9fa8da',
		300: '#7985cb',
		400: '#5c6bc0',
		500: '#3f51b5',
		600: '#394aae',
		700: '#3140a5',
		800: '#29379d',
		900: '#1b278d',
		A100: '#c6cbff',
		A200: '#939dff',
		A400: '#606eff',
		A700: '#4757ff'
	}
}

export default {
	black,
	white,
	primary: {
		contrastText: white,
		dark: appColor.primary[900],
		main: appColor.primary[500],
		light: appColor.primary[100]
	},
	secondary: {
		contrastText: white,
		dark: appColor.secondary[900],
		main: appColor.secondary['A400'],
		light: appColor.secondary['A400']
	},
	error: {
		contrastText: white,
		dark: colors.red[900],
		main: colors.red[600],
		light: colors.red[400]
	},
	text: {
		primary: colors.blueGrey[900],
		secondary: colors.blueGrey[600],
		link: colors.blue[600]
	},
	link: colors.blue[800],
	icon: colors.blueGrey[600],
	background: {
		default: black,
		paper: white
	},
	divider: colors.grey[200]
}
