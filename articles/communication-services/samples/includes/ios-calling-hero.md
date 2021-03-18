---
title: include file
description: include file
services: azure-communication-services
author: mikben
manager: mikben
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 03/10/2021
ms.topic: include
ms.custom: include file
ms.author: mikben
---

[!INCLUDE [Private Preview Notice](../../includes/private-preview-include.md)]

The Azure Communication Services **Group Calling Hero Sample for iOS** demonstrates how the Communication Services Calling iOS client library can be used to build a group calling experience that includes voice and video. In this sample quickstart, you will learn how to set up and run the sample. An overview of the sample is provided for context.

## Overview

The sample is a native iOS application that uses the Azure Communication Services iOS client libraries to build a calling experience that features both voice and video calling. The application uses a server-side component to provision access tokens that are then used to initialize the Azure Communication Services client library. To configure this server-side component, feel free to follow the [Trusted Service with Azure Functions](../../tutorials/trusted-service-tutorial.md) tutorial.

Here's what the sample looks like:

:::image type="content" source="../media/calling/landing-page-ios.png" alt-text="Screenshot showing the landing page of the sample application.":::

When you press the "Start new call" button, the iOS application creates a new call and joins it. The application also allows you to join an existing Azure Communication Services call by specifying the existing call's ID.

After joining a call, you'll be prompted to give the application permission to access your camera and microphone. You'll also be asked to provide a display name.

:::image type="content" source="../media/calling/pre-call-ios.png" alt-text="Screenshot showing the pre-call screen of the sample application.":::

Once you configure your display name and devices, you can join the call. You'll see the main call canvas where the core calling experience lives.

:::image type="content" source="../media/calling/main-app-ios.png" alt-text="Screenshot showing the main screen of the sample application.":::

Components of the main calling screen:

- **Media Gallery**: The main stage where participants are shown. If a participant has their camera enabled, their video feed is shown here. Each participant has an individual tile which shows their display name and video stream (when there is one). The gallery supports multiple participants and is updated when participants are added or removed to the call.
- **Action Bar**: This is where the primary call controls are located. These controls let you turn your video and microphone on/off, share your screen, and leave the call.

Below you'll find more information on prerequisites and steps to set up the sample.

## Prerequisites

- An Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A Mac running [Xcode](https://go.microsoft.com/fwLink/p/?LinkID=266532), along with a valid developer certificate installed into your Keychain.
- An Azure Communication Services resource. For details, see [Create an Azure Communication Resource](../../quickstarts/create-communication-resource.md).
- An Azure Function running [Trusted Service logic](../../tutorials/trusted-service-tutorial.md) to fetch access tokens.

## Running sample locally

The group calling sample can be run locally using XCode. Developers can either use their physical device or an emulator to test the application.

### Before running the sample for the first time

1. Install dependencies by running `pod install`.
2. Open `ACSCall.xcworkspace` in XCode.
3. Update `AppSettings.plist`. Set the value for the `acsTokenFetchUrl` key to be the URL for your Authentication Endpoint.

### Run sample

Build and run the sample in XCode.

## (Optional) Securing an authentication endpoint

For demonstration purposes, this sample uses a publicly accessible endpoint by default to fetch an Azure Communication Services token. For production scenarios, we recommend using your own secured endpoint to provision your own tokens.

With additional configuration, this sample supports connecting to an **Azure Active Directory** (Azure AD) protected endpoint so that user login is required for the app to fetch an Azure Communication Services token. See steps below:

1. Enable Azure Active Directory authentication in your app.  
   - [Register your app under Azure Active Directory (using iOS / macOS platform settings)](../../../active-directory/develop/tutorial-v2-ios.md) 
	- [Configure your App Service or Azure Functions app to use Azure AD login](../../../app-service/configure-authentication-provider-aad.md)
2. Go to your registered app overview page under Azure Active Directory App Registrations. Take note of the `Application (client) ID`, `Directory (tenant) ID`, `Application ID URI`

:::image type="content" source="../media/calling/aad-overview.png" alt-text="Azure Active Directory configuration on Azure portal.":::

3. Open `AppSettings.plist` in Xcode, add the following key values:
   - `acsTokenFetchUrl`: The URL to request Azure Communication Services token 
   - `isAADAuthEnabled`: A boolean value to indicate if the Azure Communication Services token authentication is required or not
   - `aadClientId`: Your Application (client) ID
   - `aadTenantId`: Your Directory (tenant) ID
   - `aadRedirectURI`: The redirect URI should be in this format: `msauth.<app_bundle_id>://auth`
   - `aadScopes`: An array of permission scopes requested from users for authorization. Add `<Application ID URI>/user_impersonation` to the array to grant access to authentication endpoint

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../../quickstarts/create-communication-resource.md#clean-up-resources).

## Next steps

For more information, see the following articles:

- Familiarize yourself with [using the calling client library](../../quickstarts/voice-video-calling/calling-client-samples.md)
- Learn more about [how calling works](../../concepts/voice-video-calling/about-call-types.md)

### Additional reading

- [Samples](./../overview.md) - Find more samples and examples on our samples overview page.