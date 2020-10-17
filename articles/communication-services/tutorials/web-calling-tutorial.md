---
title: Web Calling Tutorial
titleSuffix: An Azure Communication Services tutorial
description: Learn how to use the Azure Communication Services Calling SDK for Javascript
author: chriswhilar
manager: mariusu-msft
services: azure-communication-services

ms.author: chriswhilar
ms.date: 10/15/2020
ms.topic: overview
ms.service: azure-communication-services
---

# Web Calling Tutorial for Azure Communication Services Calling SDK for Javascript
[!INCLUDE [Public Preview Notice](../includes/public-preview-include.md)]

[!IMPORTANT]
[The Web Calling Tutorial project can be found here in Github](https://github.com/Azure-Samples/communication-services-web-calling-tutorial/). Follow the README in the repo to set up and run the Web Calling Tutorial locally on your machine.

# Overview
The Web Calling Tutorial project is a front end application client which is a step-by-step walkthrough of the different major calling functionalities provided by the Azure Communication Services Calling SDK for Javascript. Each section has a "Show code" button which shows the code for the different functionalities.

Upon successfully setting up and running the [Web Calling Tutorial project](https://github.com/Azure-Samples/communication-services-web-calling-tutorial), the main landing web page of the tutorial will look like this:
![Page1](./media/web-calling-tutorial-page1.png)
![Page2](./media/web-calling-tutorial-page2.png)

## User provisioning and SDK Initialization 
- In order to initialize the Azure Communication Calling SDK for Javascript, a user token must be passed into the main entry point of the SDK.
- You can enter your own ACS User Identity in the input box, if nothing is provided then a random user identity will be generated. 
- Click on the "Provisiong user and initialize SDK" to get a token from the backend service (the backend service is in /project/webpack.config.js) and initialize the Azure Communication Calling SDK for Javascript. 
- Click on the "Show code" button to see the sample code to see how to do user provisioning and SDK initialization
- Upon successfull user provisioning and sdk initialization, you should see the following:
![UserProvisioning](./media/user-provisioning.png)

You are now ready to start making calls!

## Placing and Receiving calls
- The Azure Communication Services Calling SDK allows for 1:1, 1:N, and Group calling.
- For 1:1 or 1:N outgoing calls, you can specify multiple ACS User Identites to call using comma-separated values. You can can also specify PSTN phone numbers to call using comma-separated values. When calling PSTN phone numbers, you must specify your alterante caller Id. Click on the "Place call" button to place an outgoing all
![PlaceACall](./media/place-a-call.png)
- For joining a group call, enter a GUID format Id and click on the "Join group" button to joing the group call
![JoinAGroupCall](./media/join-a-group-call.png)
- Click on the "Show code" button to see the sample code for placing calls, receiving calls, and joining group calls.
- Example call:
![GroupCall](./media/group-call.png)
  - Click on the video icon to turn your video camera on/off
  - Click on the microphone icon to turn your microphone on/off
  - Click on the play icon to hold/unhold the call
  - Click on the screen icon to start/stop share your screen
  - Click on person icon to add a participant to the call
  - Click on "Remove participant" in the participant roster to remove a specific participant from the call

## Video, screen-sharing, and local video preview
- Click on the "Show code" button to see code examples for Video streaming, screen-shring, and local video device preview. 

## Mute / Unmute
- Click on the "Show code" button to see code examples for muting/unmuting microphone device during a call. 

## Hold / Unhold
- Click on the "Show code" button to see code examples for holding/unholding a call. 

## Device Manager
- Click on the "Show code" button to see code examples for managing media devices. 

## Resources
1. Documentation on how to use the ACS Calling SDK for Javascript can be found on https://docs.microsoft.com/en-gb/azure/communication-services/quickstarts/voice-video-calling/calling-client-samples?pivots=platform-web
2. ACS Calling SDK for Javascript API reference documentation can be found on https://docs.microsoft.com/en-us/javascript/api/azure-communication-services/@azure/communication-calling/?view=azure-communication-services-js