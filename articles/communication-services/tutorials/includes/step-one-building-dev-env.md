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
After you installed the Visual Studio Code, create a new floder, for example 'C:\Users\Documents\ACS'. in Visual Studio Code, save the workplace to that folder. 

