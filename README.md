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

On the Home page, users can select the grid size (small, medium, or large) and set the percentage (10-30%) of cells that will contain grass or sea. After selecting these options, users can generate a map by clicking the "Generate Map" button. Once satisfied with the map, they can save it to local storage by clicking the "Save Map" button, which will display an alert confirming the game is ready. The game can then be accessed on the Play page.

2. **Find a pokemon:**

On the Play page, the map will be automatically loaded from local storage. If no map is found, a message will prompt the user to either generate a new map or upload a JSON file with the game data. Once the map is displayed, clicking the "Play" button will assign a random Pokémon to represent the user on the map, placing it in the center.

3. **Play the game:**

Using the arrow keys, the user can move their Pokémon around the map. The Pokémon cannot move into sea cells (marked in blue) and has a 20% chance of catching another Pokémon when moving into grass cells (marked in green). At the bottom of the page, users can view a log of their moves and any Pokémon they have caught. At the top of the page, users have the option to save or reset the game.
