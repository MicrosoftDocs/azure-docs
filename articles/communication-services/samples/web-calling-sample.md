---
title: Azure Communication Services - Web calling sample
titleSuffix: An Azure Communication Services sample
description: Learn about the Communication Services web calling sample
author: mariusu-msft
manager: mariusu-msft
services: azure-communication-services

ms.author: mariusu
ms.date: 06/30/2021
ms.topic: overview
ms.service: azure-communication-services
ms.subservice: calling
---

# Get started with the web calling sample

The web calling sample is a web application that serves as a step-by-step walkthrough of the various capabilities provided by the Communication Services web Calling SDK.

This sample was built for developers and makes it very easy for you to get started with Communication Services. Its user interface is divided into multiple sections, each featuring a "Show code" button that allows you to copy code directly from your browser into your own Communication Services application.

## Get started with the web calling sample

> [!IMPORTANT]
> [This sample is available **on GitHub**.](https://github.com/Azure-Samples/communication-services-web-calling-tutorial/).

Follow the /Project/readme.md to set up the project and run it locally on your machine.
Once the [web calling sample](https://github.com/Azure-Samples/communication-services-web-calling-tutorial) is running on your machine, you'll see the following landing page:

:::image type="content" source="./media/web-calling-tutorial-page-1.png" alt-text="Web calling tutorial 1" lightbox="./media/web-calling-tutorial-page-1.png":::

:::image type="content" source="./media/web-calling-tutorial-page-2.png" alt-text="Web calling tutorial 2" lightbox="./media/web-calling-tutorial-page-2.png":::

## User provisioning and SDK initialization

Click on the "Provisioning user and initialize SDK" to initialize your SDK using a token provisioned by the backend token provisioning service. This backend service is in `/project/webpack.config.js`.

Click on the "Show code" button to see the sample code that you can use in your own solution.

You should see the following once your SDK is initialized:

:::image type="content" source="./media/user-provisioning.png" alt-text="User provisioning" lightbox="./media/user-provisioning.png":::

You're now ready to begin placing calls using your Communication Services resource!

## Placing and receiving calls

The Communication Services web Calling SDK allows for **1:1**, **1:N**, and **group** calling.

For 1:1 or 1:N outgoing calls, you can specify multiple Communication Services User Identities to call using comma-separated values. You can also specify traditional (PSTN) phone numbers to call using comma-separated values.

When calling PSTN phone numbers, specify your alternate caller ID. Click on the "Place call" button to place an outgoing call:

:::image type="content" source="./media/place-a-call.png" alt-text="Place a call" lightbox="./media/place-a-call.png":::

To join a group call, enter the GUID that identifies the call and click on the "Join group" button:

:::image type="content" source="./media/join-a-group-call.png" alt-text="Join a group call" lightbox="./media/join-a-group-call.png":::

Click on the "Show code" button to see the sample code for placing calls, receiving calls, and joining group calls.

An active call looks like this:

:::image type="content" source="./media/group-call.png" alt-text="Group call" lightbox="./media/group-call.png":::

This sample also provides code snippets for the following capabilities:

  - Clicking on the video icon to turn your video camera on/off
  - Clicking on the microphone icon to turn your microphone on/off
  - Clicking on the play icon to hold/unhold the call
  - Clicking on the screen icon to start/stop share your screen
  - Clicking on person icon to add a participant to the call
  - Clicking on "Remove participant" in the participant roster to remove a specific participant from the call


## Next steps

>[!div class="nextstepaction"]
>[Download the sample from GitHub](https://github.com/Azure-Samples/communication-services-web-calling-tutorial/)

For more information, see the following articles:

- Familiarize yourself with [using the Calling SDK](../quickstarts/voice-video-calling/getting-started-with-calling.md)
- Learn more about [how calling works](../concepts/voice-video-calling/about-call-types.md)
- Review the [API Reference docs](/javascript/api/azure-communication-services/@azure/communication-calling/)
- Review the [Contoso Med App](https://github.com/Azure-Samples/communication-services-contoso-med-app) sample

## Additional reading

- [Samples](./overview.md) - Find more samples and examples on our samples overview page.
- [Redux](https://redux.js.org/) - Client-side state management
- [FluentUI](https://aka.ms/fluent-ui) - Microsoft powered UI library
- [React](https://reactjs.org/) - Library for building user interfaces
- [ASP.NET Core](/aspnet/core/introduction-to-aspnet-core?preserve-view=true&view=aspnetcore-3.1) - Framework for building web applications