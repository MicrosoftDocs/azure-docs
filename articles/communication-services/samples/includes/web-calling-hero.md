---
title: include file
description: include file
services: azure-communication-services
author: probableprime
manager: mikben
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 09/13/2023
ms.topic: include
ms.custom: include file
ms.author: rifox
---

The Azure Communication Services **Group Calling Hero Sample** demonstrates how the Communication Services Calling Web SDK can be used to build a group calling experience.

In this Sample quickstart, we learn how the sample works before we run the sample on your local machine and then deploy the sample to Azure using your own Azure Communication Services resources.

## Download code

Find the project for this sample on [GitHub](https://github.com/Azure-Samples/communication-services-web-calling-hero). A version of the sample that includes features currently in public preview such as [Teams Interop](../../concepts/teams-interop.md) and [Call Recording](../../concepts/voice-video-calling/call-recording.md) can be found on a separate [branch](https://github.com/Azure-Samples/communication-services-web-calling-hero/tree/public-preview).

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fcommunication-services-web-calling-hero%2Fmain%2Fdeploy%2Fazuredeploy.json)

## Overview

The sample has both a client-side application and a server-side application. The **client-side application** is a React/Redux web application that uses Microsoft's Fluent UI framework. This application sends requests to an ASP.NET Core **server-side application** that helps the client-side application connect to Azure.

Here's what the sample looks like:

:::image type="content" source="../media/calling/landing-page.png" alt-text="Screenshot showing the landing page of the sample application.":::

When you press the "Start a call" button, the web application fetches a user access token from the server-side application. This token is then used to connect the client app to Azure Communication Services. Once the token is retrieved, you are prompted to specify the camera and microphone that you want to use. You are able to disable/enable your devices with toggle controls:

:::image type="content" source="../media/calling/pre-call.png" alt-text="Screenshot showing the pre-call screen of the sample application.":::

Once you configure your display name and devices, you can join the call session. You will see the main call canvas where the core calling experience lives.

:::image type="content" source="../media/calling/main-app.png" alt-text="Screenshot showing the main screen of the sample application.":::

Components of the main calling screen:

- **Media Gallery**: The main stage where participants are shown. If a participant has their camera enabled, their video feed is shown here. Each participant has an individual tile which shows their display name and video stream (when there is one)
- **Header**: This is where the primary call controls are located to toggle settings and participant side bar, turn video and mix on/off, share screen and leave the call.
- **Side Bar**: This is where participants and settings information are shown when toggled using the controls on the header. The component can be dismissed using the 'X' on the top right corner. Participants side bar shows a list of participants and a link to invite more users to chat. Settings side bar allows you to configure microphone and camera settings.

Below you can find more information on prerequisites and steps to set up the sample.

## Prerequisites

- An Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- [Node.js (12.18.4 and above)](https://nodejs.org/en/download/)
- [Visual Studio Code (Stable Build)](https://code.visualstudio.com/Download)
- An Azure Communication Services resource. For details, see [Create an Azure Communication Services resource](../../quickstarts/create-communication-resource.md). You need to record your resource **connection string** for this quickstart.

## Before running the sample for the first time

1. Open an instance of PowerShell, Windows Terminal, Command Prompt or equivalent and navigate to the directory that you'd like to clone the sample to.

   ```shell
   git clone https://github.com/Azure-Samples/communication-services-web-calling-hero.git
   ```
   
1. Get the `Connection String` from the Azure portal or by using the Azure CLI. 

    ```azurecli-interactive
    az communication list-key --name "<acsResourceName>" --resource-group "<resourceGroup>"
    ```

   For more information on connection strings, see [Create an Azure Communication Resources](../../quickstarts/create-communication-resource.md)
1. Once you get the `Connection String`, add the connection string to the **samples/Server/appsetting.json** file. Input your connection string in the variable: `ResourceConnectionString`.
1. Get the `Endpoint string` from the Azure portal or by using the Azure CLI. 

    ```azurecli-interactive
    az communication list-key --name "<acsResourceName>" --resource-group "<resourceGroup>"
    ```

   For more information on Endpoint strings, see [Create an Azure Communication Resources](../../quickstarts/create-communication-resource.md)
1. Once you get the `Endpoint String`, add the endpoint string to the **samples/Server/appsetting.json** file. Input your endpoint string in the variable `EndpointUrl`

## Local run

1. Install dependencies

    ```bash
    npm run setup
    ```

1. Start the calling app

    ```bash
    npm run start
    ```

    This opens a client server on port 3000 that serves the website files, and an api server on port 8080 that performs functionality like minting tokens for call participants.

### Troubleshooting

- The app shows an "Unsupported browser" screen but I am on a [supported browser](../../concepts/voice-video-calling/calling-sdk-features.md#javascript-calling-sdk-support-by-os-and-browser).

	If your app is being served over a hostname other than localhost, you must serve traffic over https and not http.

## Publish to Azure

1. `npm run setup`
2. `npm run build`
3. `npm run package`
4. Use the Azure extension and deploy the Calling/dist directory to your app service

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../../quickstarts/create-communication-resource.md#clean-up-resources).

## Next steps

>[!div class="nextstepaction"]
>[Download the sample from GitHub](https://github.com/Azure-Samples/communication-services-web-calling-hero)

For more information, see the following articles:

- Familiarize yourself with [using the Calling SDK](../../quickstarts/voice-video-calling/getting-started-with-calling.md)
- Learn more about [how calling works](../../concepts/voice-video-calling/about-call-types.md)

### Additional reading

- [Samples](./../overview.md) - Find more samples and examples on our samples overview page.
- [Redux](https://redux.js.org/) - Client-side state management
- [FluentUI](https://aka.ms/fluent-ui) - Microsoft powered UI library
- [React](https://reactjs.org/) - Library for building user interfaces
- [ASP.NET Core](/aspnet/core/introduction-to-aspnet-core?preserve-view=true&view=aspnetcore-3.1) - Framework for building web applications
