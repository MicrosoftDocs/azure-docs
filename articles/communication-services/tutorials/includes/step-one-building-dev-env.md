# Building a development envirionment 

In this step we will walk you through building a development envirionment, which you can use to develop and publis the Azure Communication Services and other applications.

## Overview

We will use the Visual Studio Code for working with our JavaScript files. [Webpack](https://webpack.js.org/) for optimization and bundling the code. WebPack also contains a local web server, which we will use for development. 
We will also be using [Node.js](https://nodejs.org/en/) to download the dependencies, such as Azure Communication Services calling, chat, common modules, downloading and running the webpack. In the end we will be able to run code locally, using the webpack development server, or publish the application to Azure Static Websites via Azure Storage or in Azure AppService WebSites.

:::image type="content" source="../media/step-one-pic-one.png" alt-text="Developer envirionment architecture":::

By the end of this module, you will complete the configuration of the development environment. Create a basic "Hello World" static website, test the web site in a development server, and publish it in Azure.

Time to complete: 60 minutes.

## Prerequisites

- An Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). Free account gives you $200 in Azure credits to try out any combination of services.
- [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).
- Install [Node.js](https://nodejs.org/), nvm and npm.  Active LTS and Maintenance LTS versions of Node.js recommended (we tested this tutorial using version 12.20.0). We also highly recommend to deploy the nvm to have ability to switch between various Node.js version for testing. This article provides a good reference on [how to deploy Node.js, nvm and npm](https://docs.microsoft.com/en-us/windows/nodejs/setup-on-windows) on Windows
- The [Azure Storage extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage) for Visual Studio Code. This extension is needed to publish your application in Azure Storage. You can find more abut hosting static web sites in Azure Storage [here](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blob-static-website)
- The [Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice). The extension allows deploying websites (similar to the previous) but with the option to configure the fully managed  continuous integration and continuous delivery (CI/CD).
- The [Azure Function extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) to build your own serverless applications. For example, you can host your authentication application in Azure functions.
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

Follow the same steps as above for ["Azure Functions"](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) and [Azure App Service](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) extensions

## Obtaining the User Token

Get the user token, using either a [QuickStart here](https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/access-tokens?pivots=programming-language-javascript) or deploy an application in [Azure Functions](https://docs.microsoft.com/en-us/azure/communication-services/tutorials/trusted-service-tutorial)

## Initializing the application and adding the Azure Communication Services packages

### Creating new npm package

First, let create a package for our calling application. In your terminal, in the path, if your folder, run:
``` console
npm init -y
```
This command initializes a new npm package and  adds file package.json into the root folder of your project

:::image type="content" source="../media/step-one-pic-eight.png" alt-text="Installing Azure Storage Extension":::

By running the command with "-y," we omit steps to specify the package name, version, description, author, and license. You can run the command without "-y" and provide these parameters. Additional documentation on [npm init command](https://docs.npmjs.com/cli/v6/commands/npm-init)

Now we need to export the Azure Communication Services packages into our application. 

### Add the Azure Communication Services packages

Use the `npm install` command to install the Azure Communication Services Calling client library for JavaScript.

```Console
npm install @azure/communication-common --save
npm install @azure/communication-calling --save
```

This action will add the Azure Communication Services common and calling package as a dependency in your package. You will see two new packages added to the package.json file and the packages installed into "./CallingApp/node_modules/@azure/communication-calling" and "./CallingApp/node_modules/@azure/communication-common." Link on the [documentation on npm install command](https://docs.npmjs.com/cli/v6/commands/npm-install)


:::image type="content" source="../media/step-one-pic-nine.png" alt-text="Installing Azure Communication Services packages":::

These packages are provided by the Azure Communication Services team and include the authentication and calling libraries. "--save" command signals that our application depends on these packages for production use and will be included in the "dependencies" of our package-json.js file. When we build the application for production, the packages will be included in our production code.

## Installing webpack and configuring local development server

### Installing webpack

[Webpack](https://webpack.js.org/) is a tool for bundling the code from various packages and creating static files, which can be used in your server. Webpack also has a development server, which we will configure to use with the calling sample. Let install and configure webpack, webpack development server, and CLI.
To install webpack, type the following in your open terminal:

``` Console

npm install webpack@4.42.0 webpack-cli@3.3.11 webpack-dev-server@3.10.3 --save-dev

```
NOTE. Please use the version provided. The newer versions might not work correctly with this tutorial. We will update once the new version starts working correctly for this tutorial.
By specifying -dev, we signal that this dependency is only for development purposes and should not be included in our final code, which we will deploy in Azure. 
You will see two new packages added to the package.json file as "devDependencies" and the packages installed into "./CallingApp/node_modules/

:::image type="content" source="../media/step-one-pic-ten.png" alt-text="Webpack configuration":::

### Configuring the development server

Webpack also provides the development server, which we will use in this tutorial. As you use Azure Communication Services modules, just running a web page with third-party modules included will be prevented by Cross-Origin Resource Sharing Policy in your browser. The problem here is that running a static application (like index.html file) in a browser will use the file:// protocol. For modules to work properly, we will need HTTP protocol. Webpack contains a development server, which we can utilize. 

We will create two configurations for webpack, one for development and the other for production. Files prepared for production will be minified, meaning that we will remove unused whitespace and characters. Minification and optimization are great for production as it reduces the size of our files. Simultaneously, code prepared for production will not be easily readable, and modification will be difficult. To keep production code optimized while keeping our development version readable, we will need two environments.

Overall, we will create a common configuration file for webpack, add two files, one for the development server, the other for production (in next section), add pointers to run the server in our package.json file, and test it. We will use the webpack-merge tool to work with different configuration files for webpack as described [here](https://webpack.js.org/guides/production/)

Let start from the development environment.

First, we need to install webpack merge. In your terminal, run the following:

```Console
npm install --save-dev webpack-merge
```
In your package.json file, you can see one more dependency added to the "devDependencies."

In the next step, we need to create a new file "webpack.common.js" and add the following code:

```JavaScript
const path = require('path');
module.exports ={
    entry: './app.js',
    output: {
        filename:'app.js',
        path: path.resolve(__dirname, 'dist'),
    }     
}
```
Also, add two more files (we will need them later):
* webpack.dev.js
* webpack.prod.js

By creating this configuration, we tell webpack to import our code (module.exports, file app.js), analyze it, understand that modules our application depends on (Azure Communication Services modules), and prepare for either production or development server. Entry is app.js file, which we will create later. The file will contain our Azure Communication Services code.
In the output, we specify where we want to store the JS file when we run preparation for production. In this example, we will use CallingApp/dist folder. The path is specified via the "__ dirname", which points to the current directory and subfolder "dist." We don't need to create such a subfolder as webpack will make it once we run it for production.

:::image type="content" source="../media/step-one-pic-10_5.png" alt-text="Configuring webpack common":::

Note on the picture you also see additional files, which we create on later steps in this tutorial.

In the next step, we need to modify the webpack.dev.js file. Add to the webpack.dev.js the following code:

```JavaScript
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
});
```
In this configuration, we import common parameters from the webpack.common.js, merge two files, set mode "development," and configure SourceMap as "inline-source-map'.
Mode "development" tells webpack not to minify the files and not produce optimized production files.  Detailed documentation on [webpack modes](https://webpack.js.org/configuration/mode/)
Source map options are listed [here](https://webpack.js.org/configuration/devtool/#root). If we do not set the source map, a default map used for production is used, which makes the code not readable in the browser development tools and makes troubleshooting more difficult.

:::image type="content" source="../media/step-one-pic-11.png" alt-text="Configuring webpack":::


Now we have a basic webpack configuration for development. To run the development server, let go to the package.json.js and add the following code under scripts.

```JavaScript
    "build:dev": "webpack-dev-server --config webpack.dev.js"
```
Your file now should look like this:

```JavaScript

{
  "name": "CallingApp",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build:dev": "webpack-dev-server --config webpack.dev.js"
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

:::image type="content" source="../media/step-one-pic-12.png" alt-text="Modyfying package-json.js":::

### Testing the development server

Now let test the development server and see if everything works as expected. 
In Visual Studio Code, under your project, create three files:
* index.html
* app.js
* app.css (optional, allows to apply stypes to your application easily)

In index.html, type html:5 and hit enter. The Visual Studio will create a basic Html file for you.

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

The first line will instruct our Html page to download the app.js file, which we will use for our calling application, and the second line pints at the CSS file, where we will add different styles to our application as we proceed.

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

:::image type="content" source="../media/step-one-pic-13.png" alt-text="HTML file":::

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

Now upon the start of your page, you will see an alert "Hello world alert!" and message in console "Hello world console!" and the font of the header "Hello from ACS application" will be sans-serif

Note, don't forget to save your files before going to the next step. The white dots, highligted in red on the picture above, next to the file name indicate that the changes are not saved. You can click "Ctrl+S" (on Windows) to save an individual file, click "Ctrl + K S" to save all files, or you can select the Save option from the File menu. 

Once you saved, the white dots should disappear. 

 :::image type="content" source="../media/step-one-pic-15.png" alt-text="App.css file":::

With that, we are ready to test our development server. in the console type

```Console

npm run build:dev

```

The console will show you the address where the server is running. By default, it is http://localhost:8080. The build:dev is the command we added to our package-json.js file, and it will start webpack development server. You can run this simple file directly by going to your files and clicking on index.html. Once we start adding the Azure Communication Services modules to our code, just running the file will not work due to the browser's CORS policy. The goal of this exercise is to test the development server.

 :::image type="content" source="../media/step-one-pic-16.png" alt-text="Starting a development server":::
 
 Go to the address, provided os output of previous command and you should see the page and alert, configured on previous steps.
 
  :::image type="content" source="../media/step-one-pic-17.png" alt-text="Html page":::
  
 Now open the development tools of your browser. In most browsers, it is Ctrl +Shift + I (for Windows). If you on Microsoft Edge or Chrome you can also use '...' - "More tools" - "Developer Tools."  
 In the development tools, go to "Console," and you should see the "Hello world console!" message.
 
 :::image type="content" source="../media/step-one-pic-18.png" alt-text="Console":::
 
Congratulations, you deployed and tested your development server. While the server is running, you can change the code, and the server and the html page automatically reload. 
Let try it. Go to the app.js file in Visual Studio Code and delete "alert('Hello world alert!');". Click Ctrl +S, and you will see at the bottom of your terminal that the application reloaded and compiled. If you go to the http://localhost:8080 you will see the page also reloaded, and there is no more alert visible.
 The area in red on the picture below is automatic recompiling of our application after you saved the modified app.js file
 
 :::image type="content" source="../media/step-one-pic-19.png" alt-text="Recompiling":::
 
 You built the development server and environment. To stop your server, you can run Ctrl+C in your terminal and to start, type npm run build:dev at any time.
 
 Now let move on to create our envirionment to optimize the code for production when time comes and test it.
 
 ### Creating configuration for production deployment
 
Now let prepare our file for production deployment to publish it later in Azure. While preparation of the "Hello world" example is not necessary as we don't use modules, the tutorial's goal is to prepare the development environment to later work with the ACS modules such preparation is needed. 

We need to modify two files. First, add the configuration for production in webpack.prod.js file and add a new command in package.json file.

Add the following code to the webpack.prod.js

```JavaScript
const { merge } = require('webpack-merge');
 const common = require('./webpack.common.js');

 module.exports = merge(common, {
   mode: 'production',
 });
 ```
Note this configuration will be merged with the webpack.common.js (where we specified the input file and where to store the results) and set the mode "production." We don't need to set inline-source-map" as we did in webpack.dev.js as we are preparing the code for production use.
 
In the package.json, after the "build:dev," set comma and add the following code:

```JavaScript

"build:prod": "webpack --config webpack.prod.js" 

```

Your file should look like this:

```JavaScript
{
  "name": "CallingApp",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build:dev": "webpack-dev-server --config webpack.dev.js",
    "build:prod": "webpack --config webpack.prod.js" 
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
    "webpack-dev-server": "^3.10.3",
    "webpack-merge": "^5.7.3"
  }
}
```
 :::image type="content" source="../media/step-one-pic-20.png" alt-text="Configured files":::


Now time to test the creation of the production code. In the terminal run:

```Console
npm run build:prod
```
The command will create dist folder and production-ready app.js static file in it. 

 :::image type="content" source="../media/step-one-pic-21.png" alt-text="Production build":::
 
Great, now we have the development environment you can use to develop and create the production-ready code. Time to practice deploying in Azure.
 
 
 ## Deploying your Static WebSite in Azure Storage
 
In this step, we will deploy our static "Hello World!" site to Azure to practice. In the next steps, you will be building calling, chat SMS, PSTN applications, and use the same steps to deploy them.

You can deploy your web application in Azure Storage or Azure App Service. Both options allow easy deployment from the Visual Studio Code and host the static websites. The difference is that Azure Storage doesn't not allo building the managed  continuous integration and continuous delivery (CI/CD) and deplying own webservers. For the purpose of testing we will use the Azure Storage, but you can use similar steps to deploy in Azure App Service.

Copy indrx.html and app.css to the "dist" folder. 

On the dist folder, right click and select deploy to Static Website via Azure Storage

 :::image type="content" source="../media/step-one-pic-22.png" alt-text="Start deploying to Azure":::
 
 In Select subscription field select "Singn in to Azure (or "Create a Free Azure Account" if you haven't created a subscription before)
 
  :::image type="content" source="../media/step-one-pic-23.png" alt-text="Sign in to Azure":::
 
Create new Storage Account ... Advanced

 :::image type="content" source="../media/step-one-pic-24.png" alt-text="Creating the Stoirage Group":::
 
 Provide the name of the storage group
 
 :::image type="content" source="../media/step-one-pic-25.png" alt-text="Creating the Stoirage Group":::
 
 Select if you want to deploy in an existing group or create a new. We will create a new resource group "acsdemo"
 
  :::image type="content" source="../media/step-one-pic-26.png" alt-text="Creating the Stoirage Group":::
  
  Answer "Yes" to Would you like to enable static website hosting?"
  
  :::image type="content" source="../media/step-one-pic-27.png" alt-text="Creating the Stoirage Group":::
  
  Accpet default file name in "Enter the index document name", as we created the file index.html.
  Provide the 404.html for "Enter the 404 error document path". We didn't create this document, but you can add the file. 
  
Select location of the appplication. Note location will difine which media processor will be used in your future calling application. The Azure Communicaiton Serrvices selects the Media Processoir, based on the application location. I'll go with the "East US", meaning the mddia will flow via the Media Processor in US East or US West. If you selecct European Datacenter, the media will flow via Amsterdam or Dublin.

  :::image type="content" source="../media/step-one-pic-28.png" alt-text="Select location":::
  
  Wait until the resource and your website created. 
 
 Once your website created you wil lsee notification, click "Browse to website"
 
   :::image type="content" source="../media/step-one-pic-29.png" alt-text="Deployment completed":::
 
 Now you can see your webstite ready, in the browser development tools you can inspect source and see our file, prepeared for production.
 
:::image type="content" source="../media/step-one-pic-30.png" alt-text="Website":::

Go to [Azure portal](https://portal.azure.com/#home), select your resource group and select the application you created, navigate to "Settings -> "Static website" you can see that stsic websites enabled and note the primary endpoint, Index document and Error path document files.

:::image type="content" source="../media/step-one-pic-31.png" alt-text="Website settings":::

Under "Blob service" select the "Containers" and you will see two containers created, one for logs ($logs) and content of your website ($web)

:::image type="content" source="../media/step-one-pic-32.png" alt-text="Website settings":::

If you go to the $web you will see your files you created in Visual Studio and deployed to Azure. 

:::image type="content" source="../media/step-one-pic-33.png" alt-text="Website settings":::

You can redeploy the application from your Visual Studio Code at any time when you work with the application. In the future we will build a CI/CD pipeline using Azure App Services.

Now you are fully ready to try writing your firrst Azure Communication Services Application.

  
  
 
 
 
 
 


