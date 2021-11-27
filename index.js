module.exports = {
  package: {
    name: 'identity-sdk-socket.io',
    version: '0.0.2'
  },
  Authentication: ({
    rootElement,
    socket,
    onAuth,
    onSignup,
    onLoad,
    paths = {}
  }) => {
    let auth, signup, login, create, register, email, username, password;

    const clientId = socket.id;

    const onShow = ({
      title = '',
      loginText = 'Login',
      signupText = 'Signup',
      createText = 'Create an account',
      usernamePlaceholder = 'Email',
      passwordPlaceholder = 'Password',
    }) => {
      rootElement.innerHTML = `
        <form id="signup" action="" class="hide">
          <input id="email" type="email" autocomplete="true" placeholder=${usernamePlaceholder} required />
          <button id="register">${signupText}</button>
        </form>
        <form id="auth" action="">
          <h1 id="branding">
            ${title}
          </h1>
          <input id="username" autocomplete="true" placeholder=${usernamePlaceholder} tabindex="1" />
          <input id="password" type="password" autocomplete="current-password" placeholder=${passwordPlaceholder} tabindex="2" />
          <button id="login" tabindex="3">${loginText}</button>
          <div>
            <button id="create">
              ${createText}
            </button>
          </div>
        </form>
        ${rootElement.innerHTML}
      `;

      requestAnimationFrame(() => {
        auth = document.getElementById('auth');
        signup = document.getElementById('signup');
        login = document.getElementById('login');
        create = document.getElementById('create');
        register = document.getElementById('register');
        email = document.getElementById('email');
        username = document.getElementById('username');
        password = document.getElementById('password');

        auth.onsubmit = event => {
          event.preventDefault();

          return false;
        };

        auth.onkeydown = event => {
          if (event.keyCode === 13) {
            onLogin(event);
          }
        };

        signup.onsubmit = event => {
          event.preventDefault();

          return false;
        };

        signup.onkeydown = event => {
          if (event.keyCode === 13) {
            onRegister(event);
          }
        };

        create.onclick = () => {
          auth.setAttribute('class', 'hide');
          signup.removeAttribute('class');
        };

        register.onclick = onRegister;
        login.onclick = onLogin;
      });
    };

    const onLogin = event => {
      const { body, method } = event;

      if (!method) {
        event.preventDefault();
      }

      const isValid = (
        method === 'auth' ||
        (username.value.length > 2 && password.value.length > 5)
      );

      if (!isValid) {
        auth.setAttribute('class', 'no');

        return;
      }

      socket.emit(paths.request, {
        method: 'auth',
        body: method
          ? body
          : {
            id: clientId,
            username: username.value,
            password: password.value
          }
      });

      if (username && username.value) {
        username.value = '';
        password.value = '';
      }

      if (auth) {
        rootElement.removeChild(auth);
      }
    };

    const onRegister = event => {
      event.preventDefault();

      const isValid = (
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ).test(email.value);

      if (!isValid) {
        signup.setAttribute('class', 'no');

        return;
      }

      socket.emit(request, {
        method: 'register',
        body: {
          id: clientId,
          username: email.value
        }
      });
    };

    socket.on(paths.auth, onAuth);
    socket.on(paths.register, onSignup);

    return {
      onShow,
      onLogin,
      onLoad
    }
  },
  Management: {},
  Authorizations: {}
};
