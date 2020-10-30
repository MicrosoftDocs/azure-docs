---
title: Group Chat Hero Sample
titleSuffix: An Azure Communication Services sample overview
description: Overview of chat hero sample using Azure Communication Services to enable developers to learn more about the inner workings of the sample and learn how to modify it.
author: ddematheu2
manager: nimag
services: azure-communication-services

ms.author: dademath
ms.date: 07/20/2020
ms.topic: overview
ms.service: azure-communication-services

---

# Get started with the group chat hero sample

[!INCLUDE [Public Preview Notice](../includes/public-preview-include.md)]

<!----
> [!WARNING]
> links to our Hero Sample repo need to be updated when the sample is publicly available.
---->

> [!IMPORTANT]
> [This sample is available on GitHub.](https://github.com/Azure-Samples/communication-services-web-chat-hero)


The Azure Communication Services **Group Chat Hero Sample** demonstrates how the Communication Services Chat Web client library can be used to build a group calling experience.

In this Sample quickstart, we'll learn how the sample works before we run the sample on your local machine. We'll then deploy the sample to Azure using your own Azure Communication Services resources.


## Overview

The sample has both a client-side application and a server-side application. The **client-side application** is a React/Redux web application that uses Microsoft's Fluent UI framework. This application sends requests to an ASP.NET Core **server-side application** that helps the client-side application connect to Azure. 

Here's what the sample looks like:

:::image type="content" source="./media/chat/landing-page.png" alt-text="Screenshot showing the sample application's landing page.":::

When you press the "Start a Chat" button, the web application fetches a user access token from the server-side application. This token is then used to connect the client app to Azure Communication Services. Once the token is retrieved, you'll be prompted to specify your name and emoji that will represent you in chat. 

:::image type="content" source="./media/chat/pre-chat.png" alt-text="Screenshot showing the application's pre-chat screen.":::

Once your configure your display name and emoji, you can join the chat session. Now you will see the main chat canvas where the core chat experience lives.

:::image type="content" source="./media/chat/main-app.png" alt-text="Screenshot showing showing the main screen of the sample application.":::

Components of the main chat screen:

- **Main Chat Area**: This is the core chat experience where users can send and receives messages. To send messages, you can use the input area and press enter (or use the send button). Chat messages received are categorized by the sender with the correct name and emoji. You will see two types of notifications in the chat area: 1) typing notifications when a user is typing and 2) sent and read notifications for messages.
- **Header**: This is where the user will see the title of the chat thread and the controls for toggling participant and settings side bars, and a leave button to exit the chat session.
- **Side Bar**: This is where participants and setting information are shown when toggled using the controls in the header. The participants side bar contains a list of participants in the chat and a link to invite participants to the chat session. The settings side bar allows you to configure the chat thread title. 

Below you'll find more information on prerequisites and steps to set up the sample.

## Prerequisites

- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js (8.11.2 and above)](https://nodejs.org/en/download/)
- [Visual Studio (2017 and above)](https://visualstudio.microsoft.com/vs/)
- [.NET Core 3.1](https://dotnet.microsoft.com/download/dotnet-core/3.1) (Make sure to install version that corresponds with your visual studio instance, 32 vs 64 bit)
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Resource](../quickstarts/create-communication-resource.md). You'll need to record your resource **connection string** for this quickstart.

## Locally deploying the service & client app

The single threaded chat sample is essentially two "applications" a client and server application.

Open up Visual Studio on the chat.csproj and run in Debug mode, this will start up the chat front end service. When the server app is visited
from the browser, it will redirect traffic towards the locally deployed chat front end service.

You can test the sample locally by opening multiple browser sessions with the URL of your chat to simulate a multi-user chat.

## Before running the sample for the first time

1. Open an instance of PowerShell, Windows Terminal, Command Prompt or equivalent and navigate to the directory that you'd like to clone the sample to.
2. `git clone https://github.com/Azure-Samples/communication-services-web-chat-hero.git`
3. Get the `Connection String` from the Azure portal. For more information on connection strings, see [Create an Azure Communication Resources](../quickstarts/create-communication-resource.md)
4. Once you get the `Connection String`, Add the connection string to the **Chat/appsettings.json** file found under the Chat folder. Input your connection string in the variable: `ResourceConnectionString`.

### Local run

1. Go to the Chat folder and open the `Chat.csproj` solution in Visual Studio
2. Run the project. The browser will open at localhost:5000.

#### Troubleshooting

- Solution doesn't build, it throws errors during NPM installation/build

   Clean/rebuild the C# solution

## Publish the sample to Azure

1. Right click on the `Chat` project and select Publish.
2. Create a new publish profile and select your Azure subscription.
3. Before publishing, add your connection string with `Edit App Service Settings`, and fill in `ResourceConnectionString` as the key and provide your connection string (copied from appsettings.json) as the value.

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../quickstarts/create-communication-resource.md#clean-up-resources).

## Next steps

>[!div class="nextstepaction"] 
>[Download the sample from GitHub](https://github.com/Azure-Samples/communication-services-web-chat-hero)

For more information, see the following articles:

- Learn about [chat concepts](../concepts/chat/concepts.md)
- Familiarize yourself with our [chat client library](../concepts/chat/sdk-features.md)

## Additional reading

- [Azure Communication GitHub](https://github.com/Azure/communication) - Find more examples and information on the official GitHub page
- [Redux](https://redux.js.org/) - Client-side state management
- [FluentUI](https://aka.ms/fluent-ui) - Microsoft powered UI library
- [React](https://reactjs.org/) - Library for building user interfaces
- [ASP.NET Core](https://docs.microsoft.com/aspnet/core/introduction-to-aspnet-core?view=aspnetcore-3.1&preserve-view=true) - Framework for building web applications
