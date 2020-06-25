const RegisterButton = document.getElementById('register');
const LoginButton = document.getElementById('login');
const app = document.getElementById('app');

RegisterButton.addEventListener('click', () => {
	app.classList.add("right-panel-active");
});

LoginButton.addEventListener('click', () => {
	app.classList.remove("right-panel-active");
});