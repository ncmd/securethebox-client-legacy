const prodConfig = {
    apiKey           : "AIzaSyDFPL2k9xxcAxZnpCWs7Pl9jigfddEFfFI",
    authDomain       : "ncmd-stb-prod.firebaseapp.com",
    databaseURL      : "https://ncmd-stb-prod.firebaseio.com",
    projectId        : "ncmd-stb-prod",
    storageBucket    : "ncmd-stb-prod.appspot.com"
};

const devConfig = {
    apiKey           : "AIzaSyDFPL2k9xxcAxZnpCWs7Pl9jigfddEFfFI",
    authDomain       : "ncmd-stb-prod.firebaseapp.com",
    databaseURL      : "https://ncmd-stb-prod.firebaseio.com",
    projectId        : "ncmd-stb-prod",
    storageBucket    : "ncmd-stb-prod.appspot.com"
};

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

export default config;
