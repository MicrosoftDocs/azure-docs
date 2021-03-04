---
title: Tutorial - Prepare a web app for Azure Communication Services (Node.js)
titleSuffix: An Azure Communication Services tutorial
description: Learn how to create a baseline web application that supports Azure Communication Services
author: nmurav
services: azure-communication-services
ms.author: nmurav
ms.date: 01/03/2012
ms.topic: overview
ms.service: azure-communication-services
---

# Tutorial: Prepare a web app for Azure Communication Services (Node.js)

[!INCLUDE [Public Preview Notice](../includes/public-preview-include.md)]

Azure Communication Services allows you to add real-time communications to your applications. In this tutorial, you'll learn how to set up a web application that supports Azure Communication Services. This is an introductory tutorial intended for new developers who want to get started with real-time communications.

By the end of this tutorial, you'll have a baseline web application configured with Azure Communication Services client libraries that you can use to begin building your real-time communications solution.

Feel free to visit the [Azure Communication Services GitHub](https://github.com/Azure/communication) page to provide feedback.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Configure your development environment
> * Set up a local webserver
> * Add the Azure Communication Services packages to your website
> * Publish your website to Azure Static Websites

## Prerequisites

- An Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). Note that the free account gives you $200 in Azure credits to try out any combination of services.
- [Visual Studio Code](https://code.visualstudio.com/): We'll use this to edit code in your local development environment.
- [webpack](https://webpack.js.org/): This will be used to bundle and locally host your code.
- [Node.js](https://nodejs.org/en/): This will be used to install and manage dependencies like Azure Communication Services client libraries and webpack.
- [nvm and npm](/windows/nodejs/setup-on-windows) to handle version control.
- The [Azure Storage extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage) for Visual Studio Code. This extension is needed to publish your application in Azure Storage. [Read more about hosting static web sites in Azure Storage](../../storage/blobs/storage-blob-static-website.md)
- The [Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice). The extension allows deploying websites (similar to the previous) but with the option to configure the fully managed  continuous integration and continuous delivery (CI/CD).
- The [Azure Function extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) to build your own serverless applications. For example, you can host your authentication application in Azure functions.
- An active Communication Services resource and connection string. [Create a Communication Services resource](../quickstarts/create-communication-resource.md).
- A user access token. See the [access tokens quickstart](../quickstarts/access-tokens.md?pivots=programming-language-javascript) or the [trusted service tutorial](./trusted-service-tutorial.md) for instructions.


## Configure your development environment

Your local development environment will be configured like this:

:::image type="content" source="./media/step-one-pic-one.png" alt-text="Developer environment architecture":::


### Install Node.js, nvm and npm

We'll use Node.js to download and install various dependencies we need for our client-side application. We'll use it to generate static files that we'll then host in Azure, so you don't need to worry about configuring it on your server.

Windows developers can follow [this NodeJS tutorial](/windows/nodejs/setup-on-windows) to configure Node, nvm, and npm. 

We tested this tutorial using the LTS 12.20.0 version. After you install nvm, use the following PowerShell command to deploy the version that you want to use:

```PowerShell
nvm list available
nvm install 12.20.0
nvm use 12.20.0
```

:::image type="content" source="./media/step-one-pic-two.png" alt-text="Working with nvm to deploy Node.js":::

### Configure Visual Studio Code

You can download [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).

### Create a workspace for your Azure Communication Services projects

Create a new folder to store your project files, like this: `C:\Users\Documents\ACS\CallingApp`. In Visual Studio Code, click "File", "Add Folder to Workspace" and add the folder to your workspace.

:::image type="content" source="./media/step-one-pic-three.png" alt-text="Creating new workplace":::

Go to "Explorer" in Visual Studio Code on the left pane, and you'll see your "CallingApp" folder in the "Untitled" workspace.

:::image type="content" source="./media/step-one-pic-four.png" alt-text="Explorer":::

Feel free to update the name of your workspace. You can validate your Node.js version by right-clicking on your "CallingApp" folder and selecting "Open in Integrated Terminal".

:::image type="content" source="./media/step-one-pic-five.png" alt-text="Opening a terminal":::

In the terminal, type the following command to validate the node.js version installed on the previous step:

```JavaScript
node --version
```

:::image type="content" source="./media/step-one-pic-six.png" alt-text="Validating Node.js version":::

### Install Azure Extensions for Visual Studio Code

Install the [Azure Storage extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage) either through the Visual Studio marketplace or with Visual Studio Code (View > Extensions > Azure Storage).

:::image type="content" source="./media/step-one-pic-seven.png" alt-text="Installing Azure Storage Extension 1":::

Follow the same steps for the [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) and [Azure App Service](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) extensions.


## Set up a local webserver

### Create a new npm package

In your terminal, from the path of your workspace folder, type:

``` console
npm init -y
```

This command initializes a new npm package and adds `package.json` into the root folder of your project.

:::image type="content" source="./media/step-one-pic-eight.png" alt-text="Package JSON":::

Additional documentation on the npm init command can be found [here](https://docs.npmjs.com/cli/v6/commands/npm-init)

### Install webpack

[webpack](https://webpack.js.org/) lets you bundle code into static files that you can deploy to Azure. It also has a development server, which we'll configure to use with the calling sample.

In your terminal type the following to install webpack:

``` Console
npm install webpack@4.42.0 webpack-cli@3.3.11 webpack-dev-server@3.10.3 --save-dev
```

This tutorial was tested using the above specified versions. Specifying `-dev` tells the package manager that this dependency is for development purposes and shouldn't be included in the code that we deploy to Azure.

You'll see two new packages added to your `package.json` file as "devDependencies". The packages will be installed into the `./CallingApp/node_modules/` directory.

:::image type="content" source="./media/step-one-pic-ten.png" alt-text="webpack configuration":::

### Configure the development server

Running a static application (like your `index.html` file) from your browser uses the `file://` protocol. For your npm modules to work properly, we'll need the HTTP protocol by using webpack as a local development server.

We'll create two configurations: one for development and the other for production. Files prepared for production will be minified, meaning that we'll remove unused whitespace and characters. This is appropriate for production scenarios where latency should be minimized or where code should be obfuscated.

We'll use the `webpack-merge` tool to work with [different configuration files for webpack](https://webpack.js.org/guides/production/)

Let's start with the development environment. First, we need to install `webpack merge`. In your terminal, run the following:

```Console
npm install --save-dev webpack-merge
```

In your `package.json` file, you can see one more dependency added to the "devDependencies."

In the next step, we need to create a new file `webpack.common.js` and add the following code:

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

We'll then add two more files, one for each configuration:

* webpack.dev.js
* webpack.prod.js

In the next step, we need to modify the `webpack.dev.js` file. Add the following code to that file:

```JavaScript
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
});
```
In this configuration, we import common parameters from `webpack.common.js`, merge the two files, set the mode to "development," and configure SourceMap as "inline-source-map'.

Development mode tells webpack not to minify the files and not produce optimized production files. Detailed documentation on webpack modes can be found [here](https://webpack.js.org/configuration/mode/).

Source map options are listed [here](https://webpack.js.org/configuration/devtool/#root). Setting the source map makes it easier for you to debug through your browser.

:::image type="content" source="./media/step-one-pic-11.png" alt-text="Configuring webpack":::

To run the development server, go to `package.json` and add the following code under scripts:

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
  "devDependencies": {
    "webpack": "^4.42.0",
    "webpack-cli": "^3.3.11",
    "webpack-dev-server": "^3.10.3"
  }
}
```

You added the command that can be used from npm. 

:::image type="content" source="./media/step-one-pic-12.png" alt-text="Modifying package.json":::

### Testing the development server

 In Visual Studio Code, create three files under your project:

* `index.html`
* `app.js`
* `app.css` (optional, this lets you style your app)

Paste this into `index.html`:

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
:::image type="content" source="./media/step-one-pic-13.png" alt-text="HTML file":::

Add the following code to `app.js`:

```JavaScript
alert('Hello world alert!');
console.log('Hello world console!');
```
Add the following code to `app.css`:

```CSS
html {
    font-family: sans-serif;
  }
```
Don't forget to save! The unsaved file is indicated by white dots next to file names in the file Explorer.

 :::image type="content" source="./media/step-one-pic-14.png" alt-text="App.js file with JS code":::

When you open this page, you should see your message displayed with an alert and within your browser's console.

:::image type="content" source="./media/step-one-pic-15.png" alt-text="App.css file":::

Use the following terminal command to test your development configuration:

```Console
npm run build:dev
```

The console will show you where the server is running. By default, it's `http://localhost:8080`. The build:dev command is the command we added to our `package.json` earlier.

 :::image type="content" source="./media/step-one-pic-16.png" alt-text="Starting a development server":::
 
 Navigate to the address in your browser and you should see the page and alert, configured on previous steps.
 
  :::image type="content" source="./media/step-one-pic-17.png" alt-text="Html page":::
  
 
While the server is running, you can change the code, and the server and the HTML page will automatically reload. 

Next, go to the `app.js` file in Visual Studio Code and delete `alert('Hello world alert!');`. Save your file and verify that the alert disappears from your browser.

To stop your server, you can run `Ctrl+C` in your terminal. To start your server, type `npm run build:dev` at any time.

## Add the Azure Communication Services packages

Use the `npm install` command to install the Azure Communication Services Calling client library for JavaScript.

```Console
npm install @azure/communication-common --save
npm install @azure/communication-calling --save
```

This action will add the Azure Communication Services common and calling packages as dependencies of your package. You'll see two new packages added to the `package.json` file. More information about the `npm install` command can be found [here](https://docs.npmjs.com/cli/v6/commands/npm-install).

:::image type="content" source="./media/step-one-pic-nine.png" alt-text="Installing Azure Communication Services packages":::

These packages are provided by the Azure Communication Services team and include the authentication and calling libraries. The "--save" command signals that our application depends on these packages for production use and will be included in the `dependencies` of our `package.json` file. When we build the application for production, the packages will be included in our production code.


## Publish your website to Azure Static Websites

### Create a configuration for production deployment

Add the following code to the `webpack.prod.js`:

```JavaScript
const { merge } = require('webpack-merge');
 const common = require('./webpack.common.js');

 module.exports = merge(common, {
   mode: 'production',
 });
 ```

Note this configuration will be merged with the webpack.common.js (where we specified the input file and where to store the results) and will set the mode to "production."
 
In `package.json`, add the following code:

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

 :::image type="content" source="./media/step-one-pic-20.png" alt-text="Configured files":::


In the terminal run:

```Console
npm run build:prod
```

The command will create a `dist` folder and production-ready `app.js` static file in it. 

 :::image type="content" source="./media/step-one-pic-21.png" alt-text="Production build":::
 
 
### Deploy your app to Azure Storage
 
Copy `index.html` and `app.css` to the `dist` folder.

In the `dist` folder, create a new file and name it `404.html`. Copy the following markup into that file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./app.css"/>
    <title>Document</title>
</head>
<body>
    <h1>The page does not exists.</h1>
</body>
</html>
```

Save the file (Ctrl + S).

Right-click and select deploy to Static Website via Azure Storage.

:::image type="content" source="./media/step-one-pic-22.png" alt-text="Start deploying to Azure":::
 
In the `Select subscription` field, select "Sign in to Azure (or "Create a Free Azure Account" if you haven't created a subscription before)
 
:::image type="content" source="./media/step-one-pic-23.png" alt-text="Sign in to Azure":::
 
Select `Create new Storage Account` > `Advanced`:

 :::image type="content" source="./media/step-one-pic-24.png" alt-text="Creating the Storage Account Group":::
 
 Provide the name of the storage group:
 
 :::image type="content" source="./media/step-one-pic-25.png" alt-text="Adding a name for the account":::
 
Create a new resource group if needed:
 
  :::image type="content" source="./media/step-one-pic-26.png" alt-text="Creating new group":::
  
  Answer "Yes" to Would you like to enable static website hosting?"
  
  :::image type="content" source="./media/step-one-pic-27.png" alt-text="Selecting option to enable static website hosting":::
  
Accept the default file name in "Enter the index document name," as we created the file `index.html`.

Type the `404.html` for "Enter the 404 error document path".  
  
Select the location of the application. The location you select will define which media processor will be used in your future calling application in group calls. 

Azure Communication Services selects the Media Processor based on the application location.

:::image type="content" source="./media/step-one-pic-28.png" alt-text="Select location":::
  
Wait until the resource and your website are created. 
 
Click "Browse to website":

:::image type="content" source="./media/step-one-pic-29.png" alt-text="Deployment completed":::
 
From your browser's development tools, you can inspect the source and see our file, prepared for production.
 
:::image type="content" source="./media/step-one-pic-30.png" alt-text="Website":::

Go to the [Azure portal](https://portal.azure.com/#home), select your resource group, select the application you created, and navigate to `Settings` > `Static website`. You can see that static websites are enabled and note the primary endpoint, Index document, and Error path document files.

:::image type="content" source="./media/step-one-pic-31.png" alt-text="Static website selection":::

Under "Blob service" select the "Containers" and you'll see two containers created, one for logs ($logs) and content of your website ($web)

:::image type="content" source="./media/step-one-pic-32.png" alt-text="Container configuration":::

If you go to `$web` you'll see your files you created in Visual Studio and deployed to Azure. 

:::image type="content" source="./media/step-one-pic-33.png" alt-text="Deployment":::

You can redeploy the application from Visual Studio Code at any time.

You're now ready to build your first Azure Communication Services web application.

## Next steps

> [!div class="nextstepaction"]
> [Add voice calling to your app](../quickstarts/voice-video-calling/getting-started-with-calling.md)

You may also want to:

- [Add chat to your app](../quickstarts/chat/get-started.md)
- [Creating user access tokens](../quickstarts/access-tokens.md)
- [Learn about client and server architecture](../concepts/client-and-server-architecture.md)
- [Learn about authentication](../concepts/authentication.md)