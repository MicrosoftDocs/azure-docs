---
title: Group calling hero sample
titleSuffix: An Azure Communication Services sample overview
description: Overview of calling hero sample using Azure Communication Services to enable developers to learn more about the inner workings of the sample.
author: ddematheu2
manager: nimag
services: azure-communication-services

ms.author: dademath
ms.date: 07/20/2020
ms.topic: overview
ms.service: azure-communication-services

---

# Get started with the group calling hero sample

[!INCLUDE [Public Preview Notice](../includes/public-preview-include.md)]

<!----
> [!WARNING]
> Add links to our Hero Sample repo when the sample is publicly available.
---->

The Azure Communication Services **Group Calling Hero Sample** demonstrates how the Communication Services Calling Web client library can be used to build a group calling experience.

In this Sample quickstart, we'll learn how the sample works before we run the sample on your local machine. We'll then deploy the sample to Azure using your own Azure Communication Services resources.

> [!IMPORTANT]
> [Download the sample from GitHub](https://github.com/Azure-Samples/communication-services-web-calling-hero)

## Overview

The sample has both a client-side application and a server-side application. The **client-side application** is a React/Redux web application that uses Microsoft's Fluent UI framework. This application sends requests to an ASP.NET Core **server-side application** that helps the client-side application connect to Azure. 

Here's what the sample looks like:

:::image type="content" source="./media/calling/landing-page.png" alt-text="Screenshot showing the landing page of the sample application.":::

When you press the "Start a call" button, the web application fetches a user access token from the server-side application. This token is then used to connect the client app to Azure Communication Services. Once the token is retrieved, you'll be prompted to specify the camera and microphone that you want to use. You'll be able to disable/enable your devices with toggle controls:

:::image type="content" source="./media/calling/pre-call.png" alt-text="Screenshot showing the pre-call screen of the sample application.":::

Once you configure your display name and devices, you can join the call session. Now you will see the main call canvas where the core calling experience lives.

:::image type="content" source="./media/calling/main-app.png" alt-text="Screenshot showing the main screen of the sample application.":::

Components of the main calling screen:

1. **Media Gallery**: The main stage where participants are shown. If a participant has their camera enabled, their video feed is shown here. Each participant has an individual tile which shows their display name and video stream (when there is one)
2. **Header**: This is where the primary call controls are located to toggle settings and participant side bar, turn video and mix on/off, share screen and leave the call.
3. **Side Bar**: This is where participants and settings information are shown when toggled using the controls on the header. The component can be dismissed using the 'X' on the top right corner. Participants side bar will show a list of participants and a link to invite more users to chat. Settings side bar allows you to configure microphone and camera settings.

Below you'll find more information on prerequisites and steps to set up the sample.

## Prerequisites

- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- [Node.js (12.18.4 and above)](https://nodejs.org/en/download/)
- [Visual Studio (2019 and above)](https://visualstudio.microsoft.com/vs/)
- [.NET Core 3.1](https://dotnet.microsoft.com/download/dotnet-core/3.1) (Make sure to install version that corresponds with your visual studio instance, 32 vs 64 bit)
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Resource](../quickstarts/create-communication-resource.md). You'll need to record your resource **connection string** for this quickstart.

## Locally deploy the service & client applications

The group calling sample is essentially two applications: the ClientApp and the Service.NET app.

When we want to deploy locally we need to start up both applications. When the server app is visited from the browser, it will use the locally deployed ClientApp for the user experience.

You can test the sample locally by opening multiple browser sessions with the URL of your call to simulate a multi-user call.

## Before running the sample for the first time

1. Open an instance of PowerShell, Windows Terminal, Command Prompt or equivalent and navigate to the directory that you'd like to clone the sample to.
2. `git clone https://github.com/Azure/Communication.git`
3. Get the `Connection String` from the Azure portal. For more information on connection strings, see [Create an Azure Communication Resources](../quickstarts/create-communication-resource.md)
4. Once you get the `Connection String`, add the connection string to the **Calling/appsetting.json** file found under the Service .NET folder. Input your connection string in the variable: `ResourceConnectionString`.

### Local Run

1. Go to Calling folder and open `Calling.csproj` solution in Visual Studio
2. Run `Calling` project. The browser will open at localhost:5001

#### Troubleshooting

- The solution doesn't build; it throws errors during NPM installation/build.

   Try to clean/rebuild the projects.

## Publish the sample to Azure

1. Right click on the `Calling` project and select Publish.
2. Create a new publish profile and select your Azure subscription.
3. Before publishing, add your connection string with `Edit App Service Settings`, and fill in `ResourceConnectionString` as the key and provide your connection string (copied from appsettings.json) as the value.

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../quickstarts/create-communication-resource.md#clean-up-resources).

## Next steps

>[!div class="nextstepaction"] 
>[Download the sample from GitHub](https://github.com/Azure-Samples/communication-services-web-calling-hero)

For more information, see the following articles:

- Familiarize yourself with [using the calling client library](../quickstarts/voice-video-calling/calling-client-samples.md)
- Learn about [calling client library capabilities](../quickstarts/voice-video-calling/calling-client-samples.md)
- Learn more about [how calling works](../concepts/voice-video-calling/about-call-types.md)

## Additional reading

- [Azure Communication GitHub](https://github.com/Azure/communication) - Find more examples and information on the official GitHub page
- [Redux](https://redux.js.org/) - Client-side state management
- [FluentUI](https://aka.ms/fluent-ui) - Microsoft powered UI library
- [React](https://reactjs.org/) - Library for building user interfaces
- [ASP.NET Core](https://docs.microsoft.com/aspnet/core/introduction-to-aspnet-core?view=aspnetcore-3.1&preserve-view=true) - Framework for building web applications
