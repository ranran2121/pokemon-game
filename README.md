# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Implemented Functionalities

1. **Generate the map:**

In the Home page the user can choose the dimensions of the grid (small, medium or large) and the percentage (10-30%) of the cells containing grass or sea. The user can then generate the map by clicking on the generate map button. When the user is happy with the map can hit the save map button to save the map in the local storage. This will produce an alert message that the game is now ready. The game will be available in the Play page

2. **Find a pokemon:**

In the Play page the map will be automatically loaded in the page. If a map is not available in the local storage, a message will ask the user to generate a new map. Then the user has to play the Play button which will assign a random pokemon that represents the user on the map and will be placed in the middle of the map

2. **Play the game:**
   By clicking on the arrow keys, the user can move the pokemon inside the map. The pokemon cannot enter cells representing the sea (in blue) and when entering cells representing the grass (in green), the pokemon has 20% chances to catch another pokemon
