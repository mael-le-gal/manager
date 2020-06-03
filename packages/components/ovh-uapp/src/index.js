import Postmate from 'postmate';
import messages from './constants';

function bindOnce() {
  let { handshake } = window;

  if (!handshake) {
    handshake = new Postmate.Model({
      updateHash: (hash) => {
        if (window.location.hash !== hash) {
          window.location.hash = hash;
        }
      },
    });

    handshake.then((parent) => {
      window.addEventListener('hashchange', ({ newURL }) => {
        const url = new URL(newURL);
        if (/^#!?\/go/.test(url.hash)) {
          parent.emit(messages.switchApp, url.hash.match(/^#!?\/go(.*)/)[1]);
        } else {
          parent.emit(messages.hashChange, window.location.hash);
        }
      });
    });

    window.handshake = handshake;
  }

  return handshake;
}

const api = {
  init: () => bindOnce(),
  login: (url) =>
    bindOnce().then((parent) => {
      parent.emit(messages.login, url);
    }),
  logout: () =>
    bindOnce().then((parent) => {
      parent.emit(messages.logout);
    }),
  sessionSwitch: () =>
    bindOnce().then((parent) => {
      parent.emit(messages.sessionSwitch);
    }),
};

export { api, messages };
