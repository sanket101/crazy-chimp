// Material UI components
import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

import axios from 'axios';

const styles = (theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main
	},
	form: {
		width: '100%',
		marginTop: theme.spacing(1)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	},
	customError: {
		color: 'red',
		fontSize: '0.8rem',
		marginTop: 10
	},
	progess: {
		position: 'absolute'
	}
});

const Login = (props) => {
    const { classes } = props;
    const [localState, setLocalState] = useState({
        email: '',
        password: '',
        errors: [],
        loading: false
    });

    const handleSubmit = (event) => {
		event.preventDefault();
		setLocalState(prevState => {return {...prevState, loading: true }});
		const userData = {
			email: localState.email,
			password: localState.password
		};
		axios
			.post('/login', userData)
			.then((response) => {
				localStorage.setItem('AuthToken', `Bearer ${response.data.token}`);
				setLocalState(prevState => {return {...prevState, loading: false }});	
				props.history.push('/');
			})
			.catch((error) => {
                setLocalState(prevState => {return {...prevState, errors: error.response.data, loading: false }});				
			});
	};

    const handleChange = (event) => {
		setLocalState(prevState => {
			return {...prevState, [event.target.name]: event.target.value};
		});
	};

    return(
        <Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Login
					</Typography>
					<form className={classes.form} noValidate>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
							helperText={localState.errors.email}
							error={localState.errors.email ? true : false}
							onChange={handleChange}
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
							helperText={localState.errors.password}
							error={localState.errors.password ? true : false}
							onChange={handleChange}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							onClick={handleSubmit}
							disabled={localState.loading || !localState.email || !localState.password}
						>
							Sign In
							{localState.loading && <CircularProgress size={30} className={classes.progess} />}
						</Button>
						<Grid container>
							<Grid item>
								<Link href="signup" variant="body2">
									{"Don't have an account? Sign Up"}
								</Link>
							</Grid>
						</Grid>
						{localState.errors.general && (
							<Typography variant="body2" className={classes.customError}>
								{localState.errors.general}
							</Typography>
						)}
					</form>
				</div>
			</Container>
    );
};

export default withStyles(styles)(Login);