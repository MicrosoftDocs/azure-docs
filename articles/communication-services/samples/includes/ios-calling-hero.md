---
title: include file
description: include file
services: azure-communication-services
author: RinaRish
manager: chpalm
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 06/30/2021
ms.topic: include
ms.custom: include file
ms.author: ektrishi
---

The Azure Communication Services **Group Calling Hero Sample for iOS** demonstrates how the Communication Services Calling iOS SDK can be used to build a group calling experience that includes voice and video. In this sample quickstart, you will learn how to set up and run the sample. An overview of the sample is provided for context.

## Download code

Find the project for this sample on [GitHub](https://github.com/Azure-Samples/communication-services-ios-calling-hero).

## Overview

The sample is a native iOS application that uses the Azure Communication Services iOS SDKs to build a calling experience that features both voice and video calling. The application uses a server-side component to provision access tokens that are then used to initialize the Azure Communication Services SDK. To configure this server-side component, feel free to follow the [Trusted Service with Azure Functions](../../tutorials/trusted-service-tutorial.md) tutorial.

Here's what the sample looks like:

:::image type="content" source="../media/calling/landing-page-ios.png" alt-text="Screenshot showing the landing page of the sample application.":::

When you press the "Start new call" button, the iOS application prompts you to enter your display 
name to use for the call.

:::image type="content" source="../media/calling/pre-call-ios.png" alt-text="Screenshot showing the pre-call screen of the sample application.":::

After tapping "Next" on the "Start Call" screen, you have the opportunity to share the group ID of
the call via the iOS share sheet.

:::image type="content" source="../media/calling/share-call-ios.png" alt-text="Screenshot showing the share group ID screen of the sample application.":::

The application also allows you to join an existing Azure Communication Services call by specifying the existing call's ID or teams ID link.

:::image type="content" source="../media/calling/join-call-ios.png" alt-text="Screenshot showing the join call screen of the sample application.":::

After joining a call, you'll be prompted to give the application permission to access your camera and microphone, if not already authorized. Keep in mind that, like all AVFoundation-based apps, true audio and video functionality is only available on real hardware.

Once you configure your display name and join the call, you'll see the main call canvas where the core calling experience lives.

:::image type="content" source="../media/calling/main-app-ios.png" alt-text="Screenshot showing the main screen of the sample application.":::

Components of the main calling screen:

- **Media Gallery**: The main stage where participants are shown. If a participant has their camera enabled, their video feed is shown here. Each participant has an individual tile which shows their display name and video stream (when there is one). The gallery supports multiple participants and is updated when participants are added or removed to the call.
- **Action Bar**: This is where the primary call controls are located. These controls let you turn your video and microphone on/off, share your screen, and leave the call.

Below you'll find more information on prerequisites and steps to set up the sample.

## Prerequisites

- An Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A Mac running [Xcode](https://go.microsoft.com/fwLink/p/?LinkID=266532), along with a valid developer certificate installed into your Keychain.
- An Azure Communication Services resource. For details, see [Create an Azure Communication Services resource](../../quickstarts/create-communication-resource.md).
- An Azure Function running the [Authentication Endpoint](../../tutorials/trusted-service-tutorial.md) to fetch access tokens.

## Running sample locally

The group calling sample can be run locally using XCode. Developers can either use their physical device or an emulator to test the application.

### Before running the sample for the first time

1. Install dependencies by running `pod install`.
2. Open `AzureCalling.xcworkspace` in XCode.
3. Create a text file at the root, called `AppSettings.xcconfig` and set the value:
   ```text
   communicationTokenFetchUrl = <your authentication endpoint, without the https:// component>
   ```

### Run sample

Build and run the sample in XCode, using the AzureCalling target on the simulator or device of your choice.

## (Optional) Securing an authentication endpoint

For demonstration purposes, this sample uses a publicly accessible endpoint by default to fetch an Azure Communication Services access token. For production scenarios, we recommend using your own secured endpoint to provision your own tokens.

With additional configuration, this sample supports connecting to an **Microsoft Entra ID** (Microsoft Entra ID) protected endpoint so that user login is required for the app to fetch an Azure Communication Services access token. See steps below:

1. Enable Microsoft Entra authentication in your app.  
   - [Register your app under Microsoft Entra ID (using iOS / macOS platform settings)](../../../active-directory/develop/tutorial-v2-ios.md) 
	- [Configure your App Service or Azure Functions app to use Microsoft Entra login](../../../app-service/configure-authentication-provider-aad.md)
2. Go to your registered app overview page under Microsoft Entra App Registrations. Take note of the `Application (client) ID`, `Directory (tenant) ID`, `Application ID URI`

:::image type="content" source="../media/calling/aad-overview.png" alt-text="Microsoft Entra configuration on Azure portal.":::

3. Create a `AppSettings.xcconfig` file at the root if not already present and add the values:
   ```text
   communicationTokenFetchUrl = <Application ID URI, without the https:// component>
   aadClientId = <Application (client) ID>
   aadTenantId = <Directory (tenant) ID>
   ```

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../../quickstarts/create-communication-resource.md#clean-up-resources).

## Next steps

>[!div class="nextstepaction"]
>[Download the sample from GitHub](https://github.com/Azure-Samples/communication-services-ios-calling-hero)

For more information, see the following articles:

- Familiarize yourself with [using the Calling SDK](../../quickstarts/voice-video-calling/getting-started-with-calling.md)
- Learn more about [how calling works](../../concepts/voice-video-calling/about-call-types.md)

### Additional reading

- [Azure Communication GitHub](https://github.com/Azure/communication) - Find more examples and information on the official GitHub page
- [Samples](./../overview.md) - Find more samples and examples on our samples overview page.
- [Azure Communication Calling Features](../../concepts/voice-video-calling/calling-sdk-features.md) - To learn more about the calling iOS sdk
-[Azure Communication iOS Calling SDK](https://github.com/Azure/Communication/releases/)
