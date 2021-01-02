# Building a development envirionment 

In this step we will walk you through building a development envirionment. 

## Overview

We will use the Visual Studio Code for working with our JavaScript files. [Webpack](https://webpack.js.org/) for optimization and bundling the code. WebPack also contains a local web server, which we will use for development. 
We will also be using [Node.js](https://nodejs.org/en/) to download the dependencies, such as Azure Communication Services calling, chat, common modules, downloading and running the webpack. In the end we will be able to run code locally, using the webpack development server, or publish the application to Azure Static Websites via Azure Storage or in Azure AppService WebSites.

:::image type="content" source="../media/step-one-pic-one.png" alt-text="Developer envirionment architecture":::

## Prerequisites

- An Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). Free account gives you $200 in Azure credits to try out any combination of services.
- [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).
- Install [Node.js](https://nodejs.org/), nvm and npm.  Active LTS and Maintenance LTS versions of Node.js recommended (we tested this tutorial using version 12.20.0). We also highly recommend to deploy the nvm to have ability to switch between various Node.js version for testing. This article provides a good reference on [how to deploy Node.js, nvm and npm](https://docs.microsoft.com/en-us/windows/nodejs/setup-on-windows) on Windows
- The [Azure Storage extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage) for Visual Studio Code. This extension is needed to publish your application in Azure Storage. You can find more abut hosting static web sites in Azure Storage [here](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blob-static-website)
- The [Azure Function extension] to build your own serverless applications. For example, you can host your authentication application in Azure functions.
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token. You can use either [QuickStart here](https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/access-tokens?pivots=programming-language-javascript) or you can build own Azure Application, running in Azure Functions, using this [tutorial](https://docs.microsoft.com/en-us/azure/communication-services/tutorials/trusted-service-tutorial)

### Installing Node.js, nvm and npm

Node.js is a JavaScript runtime. We will use Node.js to download and install various dependencies and orchestrate the project. In many projects, you can use Node.js for creating your backend or developing API. In this tutorial, though, we will have our client-side application working with the ACS API backend. You will need Node.js only for client development and orchestration purposes. We do not need Node.js on the production server as we will create static files that can be hosted in Azure Storage, Azure AppService, or any other hosting service capable of hosting static files. 

Node.js does not guarantee work with all modules on the latest version. The solution is to have a version manager, which allows you to switch between various Node.js versions and enables better troubleshooting in your environment.
Please follow the steps in this guide to install Node.js, using the nvm [version manager if you are on Widndows](https://docs.microsoft.com/en-us/windows/nodejs/setup-on-windows)


We tested this tutrial using the LTS 12.20.0 version. After you installed the nvm, list the availble versions, using the PowerShell command and deploy the version that you want to use

```PowerShell
nvm list available
nvm install 12.20.0
nvm use 12.20.0
```

:::image type="content" source="../media/step-one-pic-two.png" alt-text="Working with nvm to deploy Node.js":::

### Configuring Visual Studio Code

You can download the  [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).

#### Creating workspace for our Azure Communication Services projects
After you installed the Visual Studio Code, create a new folder, for example 'C:\Users\Documents\ACS\CallingApp'. In Visual Studio Code, click "File", "Add Folder to Workspace" and add the folder. 

:::image type="content" source="../media/step-one-pic-three.png" alt-text="Creating new workplace":::

Now go to "Explorer" in Visual Studio Code on the left and you will see your "CallingApp" folder in "Untitled" workspace.

:::image type="content" source="../media/step-one-pic-four.png" alt-text="Explorer":::

Now save the workspace using any name of your choice, we will use "ACS" in this tutorial in the "C:\Users\Documents\ACS".
Validate version of the Node.js by right click on your "CallingApp" folder and select "Open in Integrated Terminal"

:::image type="content" source="../media/step-one-pic-five.png" alt-text="Opening a terminal":::

In the terminal, type

```JavaScript
node --version
```
to validate the node.js version installed on the previous step. 

:::image type="content" source="../media/step-one-pic-six.png" alt-text="Validating Node.js version":::

#### Installing Azure Extensions for Visual Studio Code

Now let install the extensions, which we will use to publish our applications in Azure in this tutorial.
Let start from [Azure Storage extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage).
You can either open the link above and click "Install" or in Visual Studio Code, go to "View," select "Extensions," and type "Azure Storage."
Click "Install."

:::image type="content" source="../media/step-one-pic-seven.png" alt-text="Installing Azure Storage Extension":::

Follow the same steps as above for ["Azure Functions"](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) extensions

## Obtaining the User Token

Get the user token, using either a [QuickStart here](https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/access-tokens?pivots=programming-language-javascript) or deploy an application in [Azure Functions](https://docs.microsoft.com/en-us/azure/communication-services/tutorials/trusted-service-tutorial)

## Initializing the application and adding the Azure Communication Services packages

### Creating new npm package

First, let create a package for our calling application. In your terminal, in the path if your folder, run:
``` console
npm init -y
```
This command will initialize a new npm package and will add file package.json into the root folder

:::image type="content" source="../media/step-one-pic-eight.png" alt-text="Installing Azure Storage Extension":::

By running the command with "-y" we omit steps where you can specify the package name, version, description, author, license. You can run the command without "-y" and provide these parameters. Additional documentation on [npm init command](https://docs.npmjs.com/cli/v6/commands/npm-init)

Now we need to export the Azure Communication Services packages into our application. 

### Add the Azure Communication Services packages

Use the `npm install` command to install the Azure Communication Services Calling client library for JavaScript.

```console
npm install @azure/communication-common --save
npm install @azure/communication-calling --save
```

This action will add the Azure Communication Serivces common and calling package as a dependency in your package. You will see two new packages added to the package.json file and the packages installed into "./CallingApp/node_modules/@azure/communication-calling" and "./CallingApp/node_modules/@azure/communication-common". Link on the [documentation on npm install command](https://docs.npmjs.com/cli/v6/commands/npm-install)


:::image type="content" source="../media/step-one-pic-nine.png" alt-text="Installing Azure Communication Services packages":::

These packages provided by the Azure Communication Services team and inculdes the authentication and calling libruaries. "--save" command signals that our application depends on these packages for production use and will be included in "dependencies" of our package-json.js file. When we build the application for production the packages will be included in our production code.

## Installing webpack and configuring local development server

### Installing webpack

[Webpack](https://webpack.js.org/) is a tool for bundling the code from various packages and creting static files, which can be used in your server. Webpack also has a development server, which we will configure to use with the calling sample. Let install and configure webpack, wbpack development server and CLI.
To install webpack, type the following in your open terminal

``` Console

npm install webpack@4.42.0 webpack-cli@3.3.11 webpack-dev-server@3.10.3 --save-dev

```
NOTE. Please use the version provided, the newer versions don't work properly with this tutorial. We will update once the new version will start working properly for this tutorial.
By specifying -dev we signal that this dependency is only for development puroposes and should not be included in our final code, which we will deploy in Azure. 
You will see two new packages added to the package.json file as "devDependencies" and the packages installed into "./CallingApp/node_modules/

:::image type="content" source="../media/step-one-pic-ten.png" alt-text="Webpack configuration":::

### Configuring the development server

Webpack also provides the development server which we will use in this tutorial. As you use modules from Azure Communication Services, just running a webpage with with third-party modules included will be prevented by Cross-Origin Resource Sharing Policy in your browser. The problem here is that running a static application (like index.html file) in browser will use the file:// protocol. For mdules to work properly we will need http protocol. Webpack contains a development server, which we can utilize. 

We will create two configurations for webpack, one for development and the other for production. Files, prepeared for production will be minified, meaning that we will remove unused whitespace and characters. This is great for production as it reduces size of our files. But at the same time, code prepeared for production will not be easily readabale and modification will be difficult. To keep production code optimized but at the same time keep our development version readable we will need two envirionments.

Let start from development envirionment.

In your project folder, create a new file "webpack.config.js" and add the following code:

```JavaScript
module.exports ={
    mode: 'development',
    entry:'./app.js',
  }
};
```

By creting this configration we tell webpack to import our code (module.exports, file app.js), analize it, understnds that modules our application depends on (Azure Communication Services modules) and prepeare for either production or development server. Mode "development" tells webpoack not to minify the files and not to produce optimized files for production. Entry is app.js file, which we will create later and it will contain our code. Detailed documentation on [webpack modes](https://webpack.js.org/configuration/mode/)

:::image type="content" source="../media/step-one-pic-eleven.png" alt-text="Configuring webpack":::

Now we have basic webpack cofiguration for development. In order to run the development server, let go to the package.json.js and add the following code under srcripts.
```JavaScript
    "build:dev": "webpack-dev-server"
```
Your file now should look like:

```JavaScript

{
  "name": "CallingApp",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build:dev": "webpack-dev-server"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@azure/communication-calling": "^1.0.0-beta.3",
    "@azure/communication-common": "^1.0.0-beta.3"
  },
  "devDependencies": {
    "webpack": "^4.42.0",
    "webpack-cli": "^3.3.11",
    "webpack-dev-server": "^3.10.3"
  }
}

```
You added the command that can be used from the npm. 

:::image type="content" source="../media/step-one-pic-twelve.png" alt-text="Modyfying package-json.js":::

### Testing the development server

Now let test the development server and see of everything works as expected. 
In Visual Studio Code under your project create three files:
* index.html
* app.js
* app.css (optional, allows to apply stypes to your application easily)

In index.html, type html:5 and hit enter. The Visual Studio will  create a basic html file for you.

add the following between the body elements (<body></body>)

```html
<body>
    <h1>Hello from ACS!</h1>
</body>
```
Add the following code between <head></head> elements

```html
<link rel="stylesheet" href="./app.css"/>
<script src="./app.js" defer></script>

```

The forst line will instruct our html page to download the app.js file, which we will use for our calling application and the second line pints at the CSS file, where we will add different stulles to our application as we proceed.

The whole file should look like

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My first ACS application</title>
    <link rel="stylesheet" href="./app.css"/>
    <script src="./app.js" defer></script>
</head>
<body>
    <h1>Hello from ACS!</h1>
</body>
</html>
```
(Note I also modified the title of the document). 

:::image type="content" source="../media/step-one-pic-thirteen.png" alt-text="HTML file":::

To ensure everything works, let also add some JavaScript code in app.js and modify the font using the app.css

In app.js add the following code:

```JavaScript
alert('Hello world alert!');
console.log('Hello world console!');
```
In app.css

```CSS
html {
    font-family: sans-serif;
  }
 ```
 :::image type="content" source="../media/step-one-pic-14.png" alt-text="App.js file with JS code":::
 
 Now upon the start of your page, you will see an alert "Hello world alert!" and message in conole "Hello world console!" and the font of the header "Hello from ACS application" will be sans-serif
 
Note, don't forget to save your files, before going to next step. The white dots next to the file name indicate that the changes not saved. You can either click "Ctrl+S" (on Windows) to save inidividual file, or "Ctrl + K S" to save all files, or you can select Save option from File menu. 


Once you saved the white dots should disappear. 

 :::image type="content" source="../media/step-one-pic-15.png" alt-text="App.css file":::

With that we are ready to test our development server. in the console type

```Console

npm run build:dev

```

The console will show you the address where server is running. By default it is http://localhost:8080. The build:dev is the commad we added to our package-json.js file and it will start webpack development server. You can run this simple file directly by going to your files and clicking on index.html, however once we start adding the modules to our code just running the file will not work due to CORS policy in browser. The goal of this exersize is to test the development server.

 :::image type="content" source="../media/step-one-pic-16.png" alt-text="Starting a development server":::


