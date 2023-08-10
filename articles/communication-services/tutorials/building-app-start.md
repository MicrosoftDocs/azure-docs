---
title: Tutorial - Prepare a web app for Azure Communication Services (Node.js)
titleSuffix: An Azure Communication Services tutorial
description: Learn how to create a baseline web application that supports Azure Communication Services
author: nmurav
services: azure-communication-services

ms.author: nmurav
ms.date: 06/30/2021
ms.topic: tutorial
ms.service: azure-communication-services
ms.custom: devx-track-js
---

# Tutorial: Prepare a web app for Azure Communication Services (Node.js)

You can use Azure Communication Services to add real-time communications to your applications. In this tutorial, you'll learn how to set up a web application that supports Azure Communication Services. This is an introductory tutorial for new developers who want to get started with real-time communications.

By the end of this tutorial, you'll have a baseline web application that's configured with Azure Communication Services SDKs. You can then use that application to begin building your real-time communications solution.

Feel free to visit the [Azure Communication Services GitHub page](https://github.com/Azure/communication) to provide feedback.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Configure your development environment.
> * Set up a local web server.
> * Add the Azure Communication Services packages to your website.
> * Publish your website to Azure static websites.

## Prerequisites

- An Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). The free account gives you $200 in Azure credits to try out any combination of services.
- [Visual Studio Code](https://code.visualstudio.com/) for editing code in your local development environment.
- [webpack](https://webpack.js.org/) to bundle and locally host your code.
- [Node.js](https://nodejs.org/en/) to install and manage dependencies like Azure Communication Services SDKs and webpack.
- [nvm and npm](/windows/nodejs/setup-on-windows) to handle version control.
- The [Azure Storage extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage) for Visual Studio Code. You need this extension to publish your application in Azure Storage. [Read more about hosting static websites in Azure Storage](../../storage/blobs/storage-blob-static-website.md).
- The [Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice). The extension allows deploying websites with the option to configure fully managed continuous integration and continuous delivery (CI/CD).
- The [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) to build your own serverless applications. For example, you can host your authentication application in Azure Functions.
- An active Communication Services resource and connection string. [Learn how to create a Communication Services resource](../quickstarts/create-communication-resource.md).
- A user access token. For instructions, see the [quickstart for creating and managing access tokens](../quickstarts/identity/access-tokens.md?pivots=programming-language-javascript) or the [tutorial for building a trusted authentication service](./trusted-service-tutorial.md).


## Configure your development environment

Your local development environment will be configured like this:

:::image type="content" source="./media/step-one-pic-one.png" alt-text="Diagram that illustrates the architecture of the development environment.":::


### Install Node.js, nvm, and npm

We'll use Node.js to download and install various dependencies that we need for our client-side application. We'll use it to generate static files that we'll then host in Azure, so you don't need to worry about configuring it on your server.

Windows developers can follow [this Node.js tutorial](/windows/nodejs/setup-on-windows) to configure Node, nvm, and npm. 

This tutorial is based on the LTS 12.20.0 version. After you install nvm, use the following PowerShell command to deploy the version that you want to use:

```PowerShell
nvm list available
nvm install 12.20.0
nvm use 12.20.0
```

:::image type="content" source="./media/step-one-pic-two.png" alt-text="Screenshot that shows the commands for deploying a Node version.":::

### Configure Visual Studio Code

You can download [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).

### Create a workspace for your Azure Communication Services projects

Create a folder to store your project files, like this: `C:\Users\Documents\ACS\CallingApp`. In Visual Studio Code, select **File** > **Add Folder to Workspace** and add the folder to your workspace.

:::image type="content" source="./media/step-one-pic-three.png" alt-text="Screenshot that shows selections for adding a file to a workspace.":::

Go to **EXPLORER** on the left pane, and you'll see your `CallingApp` folder in the **UNTITLED** workspace.

:::image type="content" source="./media/step-one-pic-four.png" alt-text="Screenshot that shows Explorer and the untitled workspace.":::

Feel free to update the name of your workspace. You can validate your Node.js version by right-clicking your `CallingApp` folder and selecting **Open in Integrated Terminal**.

:::image type="content" source="./media/step-one-pic-five.png" alt-text="Screenshot that shows the selection for opening a folder in an integrated terminal.":::

In the terminal, enter the following command to validate the Node.js version installed in the previous step:

```JavaScript
node --version
```

:::image type="content" source="./media/step-one-pic-six.png" alt-text="Screenshot that shows validating the Node version.":::

### Install Azure extensions for Visual Studio Code

Install the [Azure Storage extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage) either through the Visual Studio marketplace or through Visual Studio Code (**View** > **Extensions** > **Azure Storage**).

:::image type="content" source="./media/step-one-pic-seven.png" alt-text="Screenshot that shows the button to install the Azure Storage extension.":::

Follow the same steps for the [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) and [Azure App Service](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) extensions.


## Set up a local web server

### Create an npm package

In your terminal, from the path of your workspace folder, enter:

``` console
npm init -y
```

This command initializes a new npm package and adds `package.json` into the root folder of your project.

:::image type="content" source="./media/step-one-pic-eight.png" alt-text="Screenshot that shows the package J S O N.":::

For more documentation on the `npm init`, see the [npm Docs page for that command](https://docs.npmjs.com/cli/v6/commands/npm-init).

### Install webpack

You can use [webpack](https://webpack.js.org/) to bundle code into static files that you can deploy to Azure. It also has a development server, which you'll configure to use with the calling sample.

In your terminal, enter the following command to install webpack:

``` Console
npm install webpack@4.42.0 webpack-cli@3.3.11 webpack-dev-server@3.10.3 --save-dev
```

This tutorial was tested with the versions specified in the preceding command. Specifying `-dev` tells the package manager that this dependency is for development purposes and shouldn't be included in the code that you deploy to Azure.

You'll see two new packages added to your `package.json` file as `devDependencies`. The packages will be installed in the `./CallingApp/node_modules/` directory.

:::image type="content" source="./media/step-one-pic-ten.png" alt-text="Screenshot that shows the webpack configuration.":::

### Configure the development server

Running a static application (like your `index.html` file) from your browser uses the `file://` protocol. For your npm modules to work properly, you'll need the HTTP protocol by using webpack as a local development server.

You'll create two configurations: one for development and the other for production. Files prepared for production will be minified, meaning that you'll remove unused whitespace and characters. This configuration is appropriate for production scenarios where latency should be minimized or where code should be obfuscated.

You'll use the `webpack-merge` tool to work with [different configuration files for webpack](https://webpack.js.org/guides/production/).

Let's start with the development environment. First, you need to install `webpack merge`. In your terminal, run the following command:

```Console
npm install --save-dev webpack-merge
```

In your `package.json` file, you can see one more dependency added to `devDependencies`.

Next, create a file called `webpack.common.js` and add the following code:

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

Then add two more files, one for each configuration:

* `webpack.dev.js`
* `webpack.prod.js`

Now modify the `webpack.dev.js` file by adding the following code to it:

```JavaScript
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
});
```
In this configuration, you import common parameters from `webpack.common.js`, merge the two files, set the mode to `development`, and configure the source map as `inline-source-map`.

Development mode tells webpack not to minify the files and not produce optimized production files. You can find detailed documentation on webpack modes on the [webpack Mode webpage](https://webpack.js.org/configuration/mode/).

Source map options are listed on the [webpack Devtool webpage](https://webpack.js.org/configuration/devtool/#root). Setting the source map makes it easier for you to debug through your browser.

:::image type="content" source="./media/step-one-pic-11.png" alt-text="Screenshot that shows the code for configuring webpack.":::

To run the development server, go to `package.json` and add the following code under `scripts`:

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

:::image type="content" source="./media/step-one-pic-12.png" alt-text="Screenshot that shows the modification of package.json.":::

### Test the development server

 In Visual Studio Code, create three files under your project:

* `index.html`
* `app.js`
* `app.css` (optional, for styling your app)

Paste this code into `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My first Azure Communication Services application</title>
    <link rel="stylesheet" href="./app.css"/>
    <script src="./app.js" defer></script>
</head>
<body>
    <h1>Hello from Azure Communication Services!</h1>
</body>
</html>
```
:::image type="content" source="./media/step-one-pic-13.png" alt-text="Screenshot that shows the H T M L file.":::

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
Don't forget to save! The unsaved file is indicated by white dots next to file names in the Explorer.

:::image type="content" source="./media/step-one-pic-14.png" alt-text="Screenshot that shows the App.js file with JavaScript code.":::

When you open this page, you should see your message displayed with an alert in your browser's console.

:::image type="content" source="./media/step-one-pic-15.png" alt-text="Screenshot that shows the App.css file.":::

Use the following terminal command to test your development configuration:

```Console
npm run build:dev
```

The console shows you where the server is running. By default, it's `http://localhost:8080`. The `build:dev` command is the command that you  added to `package.json` earlier.

:::image type="content" source="./media/step-one-pic-16.png" alt-text="Screenshot that shows starting a development server.":::
 
Go to the address in your browser, and you should see the page and alert configured in previous steps.
 
:::image type="content" source="./media/step-one-pic-17.png" alt-text="Screenshot of the H T M L page.":::
  
 
While the server is running, you can change the code and the server. The HTML page will automatically reload. 

Next, go to the `app.js` file in Visual Studio Code and delete `alert('Hello world alert!');`. Save your file and verify that the alert disappears from your browser.

To stop your server, you can run `Ctrl+C` in your terminal. To start your server, enter `npm run build:dev` at any time.

## Add the Azure Communication Services packages

Use the `npm install` command to install the Azure Communication Services Calling SDK for JavaScript.

```Console
npm install @azure/communication-common --save
npm install @azure/communication-calling --save
```

This action adds the Azure Communication Services common and calling packages as dependencies of your package. You'll see two new packages added to the `package.json` file. You can find more information about `npm install` on the [npm Docs page for that command](https://docs.npmjs.com/cli/v6/commands/npm-install).

:::image type="content" source="./media/step-one-pic-nine.png" alt-text="Screenshot that shows code for installing Azure Communication Services packages.":::

These packages are provided by the Azure Communication Services team and include the authentication and calling libraries. The `--save` command signals that the application depends on these packages for production use and will be included in `devDependencies` within the `package.json` file. When you build the application for production, the packages will be included in your production code.


## Publish your website to Azure static websites

### Create a configuration for production deployment

Add the following code to `webpack.prod.js`:

```JavaScript
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
});
```

This configuration will be merged with `webpack.common.js` (where you specified the input file and where to store the results). The configuration will also set the mode to `production`.
 
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
    "@azure/communication-calling": "^1.0.0-beta.6",
    "@azure/communication-common": "^1.0.0"
  },
  "devDependencies": {
    "webpack": "^4.42.0",
    "webpack-cli": "^3.3.11",
    "webpack-dev-server": "^3.10.3",
    "webpack-merge": "^5.7.3"
  }
}
```

:::image type="content" source="./media/step-one-pic-20.png" alt-text="Screenshot that shows configured files.":::


In the terminal, run:

```Console
npm run build:prod
```

The command creates a `dist` folder and a production-ready `app.js` static file in it. 

:::image type="content" source="./media/step-one-pic-21.png" alt-text="Screenshot that shows the production build.":::
 
 
### Deploy your app to Azure Storage

Copy `index.html` and `app.css` to the `dist` folder.

In the `dist` folder, create a file and name it `404.html`. Copy the following markup into that file:

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

Save the file (Ctrl+S).

Right-click the `dist` folder and select **Deploy to Static Website via Azure Storage**.

:::image type="content" source="./media/step-one-pic-22.png" alt-text="Screenshot of the selections to start deploying to Azure.":::
 
Under **Select subscription**, select **Sign in to Azure** (or **Create a Free Azure Account** if you haven't created a subscription before).
 
:::image type="content" source="./media/step-one-pic-23.png" alt-text="Screenshot that shows selections for signing in to Azure.":::
 
Select **Create new Storage Account** > **Advanced**.

:::image type="content" source="./media/step-one-pic-24.png" alt-text="Screenshot that shows selections for creating the storage account group.":::
 
Provide the name of the storage group.
 
:::image type="content" source="./media/step-one-pic-25.png" alt-text="Screenshot that shows adding a name for the account.":::
 
Create a new resource group if needed.
 
:::image type="content" source="./media/step-one-pic-26.png" alt-text="Screenshot that shows the selection for creating a new resource group.":::
  
For **Would you like to enable static website hosting?**,
select **Yes**.

:::image type="content" source="./media/step-one-pic-27.png" alt-text="Screenshot that shows selecting the option to enable static website hosting.":::
  
For **Enter the index document name**, accept the default file name. You already created the file `index.html`.

For **Enter the 404 error document path**, enter **404.html**.  
  
Select the location of the application. The location that you select will define which media processor will be used in your future calling application in group calls. 

Azure Communication Services selects the media processor based on the application location.

:::image type="content" source="./media/step-one-pic-28.png" alt-text="Screenshot that shows a list of locations.":::
  
Wait until the resource and your website are created. 
 
Select **Browse to website**.

:::image type="content" source="./media/step-one-pic-29.png" alt-text="Screenshot that shows a message that deployment is complete, with the button for browsing to a website.":::
 
From your browser's development tools, you can inspect the source and see the file that's prepared for production.
 
:::image type="content" source="./media/step-one-pic-30.png" alt-text="Screenshot of the website source with file.":::

Go to the [Azure portal](https://portal.azure.com/#home), select your resource group, and select the application that you created. Then select **Settings** > **Static website**. You can see that static websites are enabled. Note the primary endpoint, index document name, and error document path.

:::image type="content" source="./media/step-one-pic-31.png" alt-text="Screenshot that shows static website selection.":::

Under **Blob service**, select **Containers**. The list shows two containers created, one for logs (`$logs`) and one for the content of your website (`$web`).

:::image type="content" source="./media/step-one-pic-32.png" alt-text="Screenshot that shows the container configuration.":::

If you open the `$web` container, you'll see the files that you created in Visual Studio and deployed to Azure. 

:::image type="content" source="./media/step-one-pic-33.png" alt-text="Screenshot that shows files deployed to Azure.":::

You can redeploy the application from Visual Studio Code at any time.

You're now ready to build your first Azure Communication Services web application.

## Next steps

> [!div class="nextstepaction"]
> [Add voice calling to your app](../quickstarts/voice-video-calling/getting-started-with-calling.md)

You might also want to:

- [Add chat to your app](../quickstarts/chat/get-started.md)
- [Create user access tokens](../quickstarts/identity/access-tokens.md)
- [Learn about client and server architecture](../concepts/client-and-server-architecture.md)
- [Learn about authentication](../concepts/authentication.md)
