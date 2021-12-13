# Technical Challenge

## Requirement

- Node.js version 8.9 or above (v10+ recommended)
- Visual Studio Code + Prettier, Vetur extensions
- Yarn, a package manager and project manager

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Lints and fixes files

```
yarn lint
```

## Structure of the application?

**.vscode:** The workspace settings for all developers.  
**node_modules:** This is the folder where all the dependencies and libraries which are required to build Vue are stored.  
**public:** In the public directory, you'll usually put files that you don't want to process through webpack. For example images.  
**src:** This is the folder where the application source code of your Vue Application resides.  
**src/assets:**: In this folder, you’ll store all the assets of your application, which includes fonts, images, etc.  
**src/components:** This folder should contain all the components or the building blocks of your application.  
**src/plugins:** Where to include the plugins used in the project.  
**src/router:** This is a configuration file for the Vue Router, which we will cover in upcoming sections.  
**src/services:** The place to include models, utilities and handling APIs used in the project.  
**src/store:** This is a configuration file for VueX, we will cover VueX in upcoming sections.  
**src/views:** The folder where we store the file for different views or pages of our application.  
**src/App.vue:** App.vue file is the root component, all other components are nested within this component.  
**src/main.js:** This is the file that renders our app and mounts it to the DOM.  
**.browserslistrc:** The config to share target browsers and Node.js versions between different front-end tools.  
**.eslintrc.js:** Config file for ESLint.  
**.gitignore:** This is a file for git version control, and contains a list of files which needs to be ignored by Git.  
**babel.config.js:** Config file for babel.  
**package.json:** This file helps npm to identify this project and handle its dependencies.  
**tsconfig.json:** Config file for TypeScript.

## Technology and Architecture of the application?

The project is built on top of Vue CLI, a full system for rapid Vue.js development.  
See [Vue CLI](https://cli.vuejs.org/guide/).

Overall, the core of the project is `Vue 3`, a progressive framework for building user interfaces. We use `Bootstrap 5` to build responsive sites, and use `io-ts fp-ts` for runtime type system for IO decoding/encoding.

## Which chart do you use and why did you choose it?

I have used line chart and bar chart for the application. Simply because of its popularity. People can easily understand the information I want to convey.

## Which information that user will acquire from your application?

Live statistics and coronavirus news tracking the number of confirmed cases, recovered patients, and death toll due to the COVID-19. The graph shows the correlation between the number of new cases and the number of people recovering daily. Search and view the epidemic situation in each country.

## Live Demo

[DEMO.FBVN.ORG](https://demo.fbvn.org/)
