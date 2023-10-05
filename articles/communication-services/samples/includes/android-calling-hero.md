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

The Azure Communication Services **Group Calling Hero Sample for Android** demonstrates how the Communication Services Calling Android SDK can be used to build a group calling experience that includes voice and video. In this sample quickstart, you will learn how to set up and run the sample. An overview of the sample is provided for context.

## Download code

Find the project for this sample on [GitHub](https://github.com/Azure-Samples/communication-services-android-calling-hero).

## Overview

The sample is a native Android application that uses the [Azure Communication Services Android UI client library](/azure/communication-services/quickstarts/ui-library/get-started-composites?tabs=kotlin&pivots=platform-android) to build a calling experience that features both voice and video calling. The application uses a server-side component to provision access tokens that are then used to initialize the Azure Communication Services SDK. To configure this server-side component, feel free to follow the [Trusted Service with Azure Functions](../../tutorials/trusted-service-tutorial.md) tutorial.

Here's what the sample looks like:

:::image type="content" source="../media/calling/landing-page-android.png" alt-text="Screenshot showing the landing page of the sample application.":::

When you press the "Start new call" button, the Android application prompts you to enter your display name to use for the call.

:::image type="content" source="../media/calling/pre-call-android.png" alt-text="Screenshot showing the pre-call screen of the sample application.":::

After tapping "Next" on the "Start A call" page, you have the opportunity to share the "Group Call ID". 

:::image type="content" source="../media/calling/share-call-android.png" alt-text="Screenshot showing the share Group Call ID screen of the sample application.":::

The application allows you to join an existing Azure Communication Services call by specifying the existing call's ID or teams meeting ID link and display name.

:::image type="content" source="../media/calling/join-call-android.png" alt-text="Screenshot showing the join call screen of the sample application.":::

After joining a call, you'll be prompted to give the application permission to access your camera and microphone, if not already authorized. You'll see the main call canvas where the core calling experience lives.

:::image type="content" source="../media/calling/main-app-android.png" alt-text="Screenshot showing the main screen of the sample application.":::

Components of the main calling screen:

- **Media Gallery**: The main stage where participants are shown. If a participant has their camera enabled, their video feed is shown here. Each participant has an individual tile which shows their display name and video stream (when there is one). The gallery supports multiple participants and is updated when participants are added or removed to the call.
- **Action Bar**: This is where the primary call controls are located. These controls let you turn your video and microphone on/off, share your screen, and leave the call.

Below you'll find more information on prerequisites and steps to set up the sample.

## Prerequisites

- An Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Android Studio](https://developer.android.com/studio) running on your computer
- An Azure Communication Services resource. For details, see [Create an Azure Communication Services resource](../../quickstarts/create-communication-resource.md).
- An Azure Function running the [Authentication Endpoint](../../tutorials/trusted-service-tutorial.md) to fetch access tokens.

## Running sample locally

The group calling sample can be run locally using Android Studio. Developers can either use their physical device or an emulator to test the application.

### Before running the sample for the first time

1. Open Android Studio and select `Open an Existing Project`
2. Open the `AzureCalling` folder inside downloaded release for the sample.
3. Expand app/assets to update `appSettings.properties`. Set the value for the key `communicationTokenFetchUrl` to be the URL for your Authentication Endpoint set up as a prerequisite.

### Run sample

Build and run the sample in Android Studio.

## (Optional) Securing an authentication endpoint

For demonstration purposes, this sample uses a publicly accessible endpoint by default to fetch an Azure Communication Services token. For production scenarios, we recommend using your own secured endpoint to provision your own tokens.

With additional configuration, this sample supports connecting to an **Azure Active Directory** (Azure AD) protected endpoint so that user login is required for the app to fetch an Azure Communication Services token. See steps below:

1. Enable Azure Active Directory authentication in your app.  
   - [Register your app under Azure Active Directory (using Android platform settings)](../../../active-directory/develop/tutorial-v2-android.md) 
	- [Configure your App Service or Azure Functions app to use Azure AD login](../../../app-service/configure-authentication-provider-aad.md)

2. Go to your registered app overview page under Azure Active Directory App Registrations. Take note of the `Package name`, `Signature hash`, `MSAL Configutaion`

:::image type="content" source="../media/calling/aad-overview-android.png" alt-text="Azure Active Directory configuration on Azure portal.":::

3. Edit `AzureCalling/app/src/main/res/raw/auth_config_single_account.json` and set `isAADAuthEnabled` to enable Azure Active Directory
4. Edit `AndroidManifest.xml` and set `android:path` to keystore signature hash. (Optional. The current value uses hash from bundled debug.keystore. If different keystore is used, this must be updated.)
   ```
   <activity android:name="com.microsoft.identity.client.BrowserTabActivity">
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data
                    android:host="com.azure.samples.communication.calling"
                    android:path="/Signature hash" <!-- do not remove /. The current hash in AndroidManifest.xml is for debug.keystore. -->
                    android:scheme="msauth" />
            </intent-filter>
        </activity>
   ```
5. Copy MSAL Android configuration from Azure portal and paste to `AzureCalling/app/src/main/res/raw/auth_config_single_account.json`. Include "account_mode": "SINGLE"
   ```
      {
         "client_id": "",
         "authorization_user_agent": "DEFAULT",
         "redirect_uri": "",
         "account_mode" : "SINGLE",
         "authorities": [
            {
               "type": "AAD",
               "audience": {
               "type": "AzureADMyOrg",
               "tenant_id": ""
               }
            }
         ]
      }
   ```

6. Edit `AzureCalling/app/src/main/res/raw/auth_config_single_account.json` and set the value for the key `communicationTokenFetchUrl` to be the URL for your secure Authentication Endpoint.
7. Edit `AzureCalling/app/src/main/res/raw/auth_config_single_account.json` and set the value for the key `aadScopes` from `Azure Active Directory` `Expose an API` scopes
8. Set value for `graphURL` in `AzureCalling/app/assets/appSettings.properties` as the Graph API endpoint to fetch user information. 
9. Edit `AzureCalling/app/src/main/assets/appSettings.properties` and set the value for the key `tenant` to enable silent login so that the user does not have to be authenticated again and again while restarting the application.

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../../quickstarts/create-communication-resource.md#clean-up-resources).

## Next steps

>[!div class="nextstepaction"]
>[Download the sample from GitHub](https://github.com/Azure-Samples/communication-services-android-calling-hero)

For more information, see the following articles:

- Familiarize yourself with [using the Calling SDK](../../quickstarts/voice-video-calling/getting-started-with-calling.md)
- Learn more about [how calling works](../../concepts/voice-video-calling/about-call-types.md)

### Additional reading

- [Azure Communication GitHub](https://github.com/Azure/communication) - Find more examples and information on the official GitHub page
- [Samples](./../overview.md) - Find more samples and examples on our samples overview page.
- [Azure Communication Calling Features](../../concepts/voice-video-calling/calling-sdk-features.md) - To learn more about the calling Android sdk
-[Azure Communication Android Calling SDK](https://search.maven.org/artifact/com.azure.android/azure-communication-calling)
