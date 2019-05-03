const proxy = require('http-proxy-middleware');

// Credentials to return
if (process.env.NODE_ENV === 'production'){
  module.exports = function(app) {
    app.use(proxy('/api', { target: 'https://stb-server.herokuapp.com' }));
  };

} else if (process.env.REACT_APP_HOST_ENV === 'local'){
  module.exports = function(app) {
    app.use(proxy('/api', { target: 'http://localhost:5000' }));
  };

} else {
  module.exports = function(app) {
    app.use(proxy('/api', { target: 'http://localhost:5000' }));
  };
}