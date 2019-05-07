import config from './firebaseServiceConfig';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';

class firebaseService {

    init()
    {
        if ( firebase.apps.length )
        {
            return;
        }
        firebase.initializeApp(config);
        this.db = firebase.database();
        this.fs = firebase.firestore();
        this.auth = firebase.auth();
    }

    getUserData = (userId) => {
        if ( !firebase.apps.length )
        {
            return;
        }
        return new Promise((resolve, reject) => {
            this.db.ref(`users/${userId}`)
                .once('value')
                .then((snapshot) => {
                    const user = snapshot.val();
                    resolve(user);
                });
        });
    };

    updateUserData = (user) => {
        if ( !firebase.apps.length )
        {
            return;
        }
        return this.db.ref(`users/${user.uid}`)
            .set(user);
    };

    onAuthStateChanged = (callback) => {
        if ( !this.auth )
        {
            return;
        }
        this.auth.onAuthStateChanged(callback);
    };

    signOut = () => {
        if ( !this.auth )
        {
            return;
        }
        this.auth.signOut();
    }

    addSubmission = (data) => {
        console.log("Creating Submission")
        this.fs.collection("submissions").add(data)
          .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
          })
          .catch(function (error) {
            console.error("Error adding document: ", error);
          });
    }
}

const instance = new firebaseService();

export default instance;
