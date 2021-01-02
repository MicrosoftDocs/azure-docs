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

## Deploying a Calling application

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


:::image type="content" source="../media/step-one-pic-nine.png" alt-text="Installing Azure Storage Extension":::

These packages provided by the Azure Communication Services team and inculdes the authentication and calling libruaries. "--save" command signals that our application depends on these packages for production use and will be included in "dependencies" of our package-json.js file. When we build the application for production the packages will be included in our production code.


### Installing webpack

[Webpack](https://webpack.js.org/) is a tool for bundling the code from various packages and creting static files, which can be used in your server. Webpack also has a development server, which we will configure to use with the calling sample. Let install and configure webpack, wbpack development server and CLI.
To install webpack, type the following in your open terminal

``` Console

npm install webpack@4.42.0 webpack-cli@3.3.11 webpack-dev-server@3.10.3 --save-dev

```
NOTE. Please use the version provided, the newer versions don't work properly with this tutorial. We will update once the new version will start working properly for this tutorial.
By specifying -dev we signal that this dependency is only for development puroposes and should not be included in our final code, which we will deploy in Azure. 
You will see two new packages added to the package.json file as "devDependencies" and the packages installed into "./CallingApp/node_modules/

:::image type="content" source="../media/step-one-pic-ten.png" alt-text="Installing Azure Storage Extension":::
