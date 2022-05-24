---
title: 'Quickstart: Dice roller'
description: Quickly create a dice rolling app using the Azure Fluid Relay service
author: hickeys
ms.service: azure-fluid
ms.topic: quickstart
ms.date: 09/09/2021
ms.author: hickeys
ms.custom: mode-other
---

# Quickstart: Dice roller

> [!NOTE]
> This preview version is provided without a service-level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.

In this quickstart, we'll walk through through the process of creating a dice roller app that uses the Azure Fluid Relay service. The quickstart is broken into two parts. In part one, we'll create the app itself and run it against a local Fluid server. In part two, we'll reconfigure the app to run against the Azure Fluid Relay service instead of the local dev server.

The sample code used in this quickstart is available [here](https://github.com/microsoft/FluidHelloWorld/tree/main-azure).

## Set up your development environment

To follow along with this quickstart, you'll need an Azure account and [Azure Fluid Relay provisioned](../how-tos/provision-fluid-azure-portal.md). If you don't have an account, you can [try Azure for free](https://azure.com/free).

You'll also need the following software installed on your computer.

- A code editor -- We recommend [Visual Studio Code](https://code.visualstudio.com/).
- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download) version 12.17 or higher

## Getting Started Locally

First, you'll need to download the sample app from GitHub. Open a new command window and navigate to the folder where you'd like to download the code and use Git to clone the [FluidHelloWorld repo](https://github.com/microsoft/FluidHelloWorld). The cloning process will create a subfolder named FluidHelloWorld with the project files in it.

```cli
git clone -b main-azure https://github.com/microsoft/FluidHelloWorld.git
```

Navigate to the newly created folder, install dependencies, and start the app.

```cli
cd FluidHelloWorld
npm install
...
npm start
```


When you run the `npm start` command, two things will happen. First, a Fluid server will be launched in a local process. This server is intended for development only. You'll upgrade to an Azure-hosted production server later. Second, a new browser tab will open to a page that contains a new instance of the dice roller app. 
You can open new tabs with the same URL to create additional instances of the dice roller app. Each instance of the app is configured by default to use your local Fluid service. Click the **Roll** button in any instance of the app, and note that the state of the dice changes in every client.

## Upgrading to Azure Fluid Relay

To run against the Azure Fluid Relay service, you'll need to update your app's configuration to connect to your Azure service instead of your local server.

### Configure and create an Azure client

To configure the Azure client, replace the values in the `serviceConfig` object in `app.js` with your Azure Fluid Relay
service configuration values. These values can be found in the "Access Key" section of the Fluid Relay resource in the Azure portal.

```javascript
const serviceConfig = {
    connection: {
        type: "remote",
        tenantId: "", // REPLACE WITH YOUR TENANT ID
        tokenProvider: new InsecureTokenProvider("" /* REPLACE WITH YOUR PRIMARY KEY */, { id: "userId" }),
        endpoint: "", // REPLACE WITH YOUR DISCOVERY ENDPOINT URL
    }
};
```

> [!WARNING]
> During development, you can use `InsecureTokenProvider` to generate and sign authentication tokens that the Azure Fluid Relay service will accept. However, as the name implies, this is insecure and should not be used in production environments. The Azure Fluid Relay resource creation process provides you with a secret key which can be used to sign secure requests. **To ensure that this secret doesn't get exposed, this should be replaced with another implementation of ITokenProvider that fetches the token from a secure, developer-provided backend service prior to releasing to production.**

### Build and run the client only

Now that you've pointed your app to use Azure instead of a local server, you don't need to launch the local Fluid server along with your client app. You can launch the client without also launching the server with this command. 

```bash
npm run start:client
```

🥳**Congratulations**🎉 You have successfully taken the first step towards unlocking the world of Fluid collaboration.
