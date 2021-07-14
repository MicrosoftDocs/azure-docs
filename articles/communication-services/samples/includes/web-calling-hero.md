---
title: include file
description: include file
services: azure-communication-services
author: mikben
manager: mikben
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 06/30/2021
ms.topic: include
ms.custom: include file
ms.author: mikben
---

The Azure Communication Services **Group Calling Hero Sample** demonstrates how the Communication Services Calling Web SDK can be used to build a group calling experience.

In this Sample quickstart, we'll learn how the sample works before we run the sample on your local machine. We'll then deploy the sample to Azure using your own Azure Communication Services resources.

## Download code

Find the project for this sample on [GitHub](https://github.com/Azure-Samples/communication-services-web-calling-hero). A version of the sample which includes features currently in public preview such as [Teams Interop](../../concepts/teams-interop.md) and [Call Recording](../../concepts/voice-video-calling/call-recording.md) can be found on a separate [branch](https://github.com/Azure-Samples/communication-services-web-calling-hero/tree/public-preview).

## Overview

The sample has both a client-side application and a server-side application. The **client-side application** is a React/Redux web application that uses Microsoft's Fluent UI framework. This application sends requests to an ASP.NET Core **server-side application** that helps the client-side application connect to Azure.

Here's what the sample looks like:

:::image type="content" source="../media/calling/landing-page.png" alt-text="Screenshot showing the landing page of the sample application.":::

When you press the "Start a call" button, the web application fetches a user access token from the server-side application. This token is then used to connect the client app to Azure Communication Services. Once the token is retrieved, you'll be prompted to specify the camera and microphone that you want to use. You'll be able to disable/enable your devices with toggle controls:

:::image type="content" source="../media/calling/pre-call.png" alt-text="Screenshot showing the pre-call screen of the sample application.":::

Once you configure your display name and devices, you can join the call session. You'll then see the main call canvas where the core calling experience lives.

:::image type="content" source="../media/calling/main-app.png" alt-text="Screenshot showing the main screen of the sample application.":::

Components of the main calling screen:

- **Media Gallery**: The main stage where participants are shown. If a participant has their camera enabled, their video feed is shown here. Each participant has an individual tile which shows their display name and video stream (when there is one)
- **Header**: This is where the primary call controls are located to toggle settings and participant side bar, turn video and mix on/off, share screen and leave the call.
- **Side Bar**: This is where participants and settings information are shown when toggled using the controls on the header. The component can be dismissed using the 'X' on the top right corner. Participants side bar will show a list of participants and a link to invite more users to chat. Settings side bar allows you to configure microphone and camera settings.

> [!NOTE]
> Based on limitations on the Web Calling SDK, only one remote video stream is rendered. For more information see, [Calling SDK Stream Support](../../concepts/voice-video-calling/calling-sdk-features.md#calling-sdk-streaming-support).

Below you'll find more information on prerequisites and steps to set up the sample.

## Prerequisites

- An Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- [Node.js (12.18.4 and above)](https://nodejs.org/en/download/)
- [Visual Studio (2019 and above)](https://visualstudio.microsoft.com/vs/)
- [.NET Core 3.1](https://dotnet.microsoft.com/download/dotnet-core/3.1) (Make sure to install version that corresponds with your visual studio instance, 32 vs 64 bit)
- An Azure Communication Services resource. For details, see [Create an Azure Communication Services resource](../../quickstarts/create-communication-resource.md). You'll need to record your resource **connection string** for this quickstart.

## Locally deploy the service & client applications

The group calling sample is essentially two applications: the ClientApp and the Service.NET app.

When we want to deploy locally we need to start up both applications. When the server app is visited from the browser, it will use the locally deployed ClientApp for the user experience.

You can test the sample locally by opening multiple browser sessions with the URL of your call to simulate a multi-user call.

### Before running the sample for the first time

1. Open an instance of PowerShell, Windows Terminal, Command Prompt or equivalent and navigate to the directory that you'd like to clone the sample to.
2. `git clone https://github.com/Azure-Samples/communication-services-web-calling-hero.git`
3. Get the `Connection String` from the Azure portal. For more information on connection strings, see [Create an Azure Communication Services resources](../../quickstarts/create-communication-resource.md).
4. Once you get the `Connection String`, add the connection string to the **Calling/appsetting.json** file found under the Service .NET folder. Input your connection string in the variable: `ResourceConnectionString`.

### Local run

1. Go to Calling folder and open `Calling.csproj` solution in Visual Studio.
2. Run `Calling` project. The browser will open at `localhost:5001`.

## Publish the sample to Azure

1. Right click on the `Calling` project and select Publish.
2. Create a new publish profile and select your Azure subscription.
3. Before publishing, add your connection string with `Edit App Service Settings`, and fill in `ResourceConnectionString` as the key and provide your connection string (copied from appsettings.json) as the value.

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../../quickstarts/create-communication-resource.md#clean-up-resources).

## Next steps

>[!div class="nextstepaction"]
>[Download the sample from GitHub](https://github.com/Azure-Samples/communication-services-web-calling-hero)

For more information, see the following articles:

- Familiarize yourself with [using the Calling SDK](../../quickstarts/voice-video-calling/calling-client-samples.md)
- Learn more about [how calling works](../../concepts/voice-video-calling/about-call-types.md)

### Additional reading

- [Samples](./../overview.md) - Find more samples and examples on our samples overview page.
- [Redux](https://redux.js.org/) - Client-side state management
- [FluentUI](https://aka.ms/fluent-ui) - Microsoft powered UI library
- [React](https://reactjs.org/) - Library for building user interfaces
- [ASP.NET Core](/aspnet/core/introduction-to-aspnet-core?preserve-view=true&view=aspnetcore-3.1) - Framework for building web applications
