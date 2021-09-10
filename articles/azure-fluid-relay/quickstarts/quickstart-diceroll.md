---
title: 'Quickstart: Dice roller'
description: Quickly create a dice rolling app using the Azure Fluid Relay service
author: hickeys
ms.service: azure-fluid
ms.topic: quickstart
ms.date: 09/09/2021
ms.author: hickeys 
---

# Quickstart: Dice roller

In this quickstart, we'll walk through through the process of creating a dice roller app that uses the Azure Fluid Relay service. The quickstart is broken into two parts. In part one, we'll create the app itself and run it against a local Fluid server. In part two, we'll reconfigure the app to run against the Azure Fluid Relay service instead of the local dev server.

The sample code used in this quickstart is available [here](https://github.com/microsoft/FluidHelloWorld).

## Set up your development environment

To follow along with this quickstart, you need the following installed.

- A code editor -- We recommend [Visual Studio Code](https://code.visualstudio.com/).
- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download) version 12.17 or higher

## Getting Started Locally

First, you'll need to download the sample app from GitHub. Open a new command window and navigate to the folder where you'd like to download the code and use Git to clone the [FluidHelloWorld repo](https://github.com/microsoft/FluidHelloWorld) The cloning process will create a subfolder named FluidHelloWorld with the project files in it.

```cli
git clone https://github.com/microsoft/FluidHelloWorld.git
```

Navigate to the newly created folder, install Node.js, and start the app.

```cli
cd FluidHelloWorld
npm install
...
npm start
```


When you run the `npm start` command, two things will happen. First, a Fluid server will be launched in a local process using [Tinylicious](https://www.npmjs.com/package/tinylicious). This server is intended for development only. We'll upgrade to an Azure-hosted production server later. Second, a new browser tab will open to a page that contains a new instance of the dice roller app. 

You can open new tabs with the same URL to create additional instances of the dice roller app. Each instance of the app is configured by default to use your local Fluid service. Click the **Roll** button in any instance of the app, and note that the state of the dice changes in every client.

## Upgrading to Azure Fluid Relay

To run against the Azure Fluid Relay service, you'll need to create a new Azure Fluid Relay service on Azure, and then update your app's configuration to connect to your Azure service instead of your local Tinylicious server.



you'll make a code change to `app.ts`. The app is currently configured to use a local in-memory service called Tinylicious, which runs on port 7070 by default.



```typescript
import { AzureClient, InsecureTokenProvider } from "@fluidframework/azure-client";
```

### Create an Azure Fluid Relay service on your Azure account

???

### Remove the Tinylicious client from the app

Since we're not going to use the Tinylicious server anymore, we don't need to create a client in the app. Open `app.ts` and delete this line of code.

```typescript
const client = new TinyliciousClient();
```

### Install and import the Azure client package

To connect to your Azure service, first install Fluid Framework's Azure client.

```cli
npm i @fluidframework/azure-client
```

Next, import the Azure client and update your app's configuration with the required connection information. Open `app.ts` and import the client.

```typescript
import { AzureClient, InsecureTokenProvider } from "@fluidframework/azure-client";
```

### Configure and create an Azure Client

Finally, configure and create a new Azure client.

```typescript
const azureUser = {
  userId: "Test User",
    userName: "test-user"
}

// This configures the AzureClient to use a remote Azure Fluid Service instance.
const prodConfig = {
    tenantId: "[REPLACE WITH YOUR TENANT GUID]",
    tokenProvider: new InsecureTokenProvider("", azureUser),
    orderer: "[REPLACE WITH YOUR ORDERER URL]",
    storage: "[REPLACE WITH YOUR STORAGE URL]",
};

const client = new AzureClient(prodConfig);
```

> [!WARNING]
> During development, you can use `InsecureTokenProvider` to generate and sign authentication tokens that the Azure Fluid Relay service will accept. However, as the name implies, this is insecure and should not be used in production environments. The Azure Fluid Relay resource creation process provides you with a secret key which can be used to sign secure requests. **To ensure that this secret doesn't get exposed, this should be replaced with another implementation of ITokenProvider that fetches the token from a secure, developer-provided backend service prior to releasing to production.**

### Build and run the client only

Now that you've pointed your app to use Azure instead of Tinylicious, you don't need to launch the local Fluid server along with your client app. You can launch the client without also launching the server with this command. 

```bash
npm run start:client
```

🥳**Congratulations**🎉 You have successfully taken the first step towards unlocking the world of Fluid collaboration.



