export function initGoogleLogin(onSuccess) {
  /* Espera a que Google cargue */
  window.onload = () => {
    google.accounts.id.initialize({
      client_id: "817313404932-6qf4jc2ghviph48plvac7k3ioud1mjb3.apps.googleusercontent.com",
      callback: onSuccess,
    });
  };
}
