# ERA Quiz app

To run locally you must do the following:

- This project uses firebase for storing user data, so you have to [create your firebase project](https://firebase.google.com/docs/web/setup) and connect it with this react js app.
  > Connecting with this app involves adding a `.env` file on the root of the project which contains your project's credentials provided by firebase.

```
// .env file
REACT_APP_FIREBASE_API_KEY=your api key
REACT_APP_FIREBASE_AUTH_DOMAIN=your auth domain
REACT_APP_FIREBASE_PROJECT_ID=your project id
REACT_APP_FIREBASE_STORAGE_BUCKET=your project's storage bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your project's messaging sender id
REACT_APP_FIREBASE_APP_ID=your firebase's app id
REACT_APP_FIREBASE_MEASUREMENT_ID=your measurement id (this is not necessary)

// these can be found on firebase dashboard: Project Settings/General
```

- Then run:

```bash
npm install
```

This will install all of the project's dependecies.

- After doing the above then you can run:

```bash
npm start
```

Then it runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.
