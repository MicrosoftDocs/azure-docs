# Building a development envirionment

In this step we will walk you through building a development envirionment. 

## Overview

We will use the Visual Studio Code for working with our JavaScript files. [Webpack](https://webpack.js.org/) for optimization and bundling the code. WebPack also contains a local web server, which we will use for development. 
We will also be using [Node.js](https://nodejs.org/en/) to download the dependencies, such as Azure Communication Services calling, chat, common modules, downloading and running the webpack. In the end we will be able to run code locally, using the webpack development server, or publish the application to Azure Static Websites via Azure Storage or in Azure AppService Static WebSites.

:::image type="content" source="../media/step-one-pic-one.png" alt-text="Developer envirionment architecture":::

## Prerequisites

- An Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). Free account gives you $200 in Azure credits to try out any combination of services.
- [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).
- [Node.js](https://nodejs.org/), Active LTS and Maintenance LTS versions (we tested this tutorial using version 12.20.0).  
- The [Azure Storage extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage) for Visual Studio Code. This extension is needed to publish your application in Azure Storage. You can find more abut hosting static web sites in Azure Storage [here](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blob-static-website)
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token. You can use either [QuickStart here](https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/access-tokens?pivots=programming-language-javascript) or you can build own Azure Application, running in Azure Functions, using this [tutorial](https://docs.microsoft.com/en-us/azure/communication-services/tutorials/trusted-service-tutorial)

