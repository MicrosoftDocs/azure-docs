[!INCLUDE [Private Preview Notice](../../includes/private-preview-include.md)]

The Azure Communication Services **Group Calling Hero Sample** demonstrates how the Communication Services Calling iOS client library can be used to build a group calling experience.

In this Sample quickstart, you will learn how to set up and run the sample. An overview of the sample is also provided for context.

## Download Code

Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-ios-calling-hero)

## Overview

The sample is a native iOS application which uses the Azure Communication Services iOS client SDKs to build a calling experience that features both voice and video calling. The application relies on using a server-side application that provides the necessary access tokens to initialize the Azure Communication Services SDK. To this end, the sample requires the following Azure Function to work properly: [Trusted Service with Azure Functions](../../tutorials/trusted-service-tutorial.md)

Here's what the sample looks like:

:::image type="content" source="./media/calling/landing-page-ios.png" alt-text="Screenshot showing the landing page of the sample application.":::

When you press the "Start new call" button, the iOS application creates a new call and joins the call created. Alternatively, the application supports a "Join a call" flow to join an existing call on Azure Communication Services. On this route, you will be prompted to enter the id for the call you want to join.

Once a call is joined, you'll be prompted to configure your client for the call including enabling/disabling the camera and microphone, and providing a display name. When enabling/disabling the camera and microphone you will be prompted to give permissions to the application to use your phone's microphone and camera. 

:::image type="content" source="./media/calling/pre-call-ios.png" alt-text="Screenshot showing the pre-call screen of the sample application.":::

Once you configure your display name and devices, you can join the call session. Now you will see the main call canvas where the core calling experience lives.

:::image type="content" source="./media/calling/main-app-ios.png" alt-text="Screenshot showing the main screen of the sample application.":::

Components of the main calling screen:

1. **Media Gallery**: The main stage where participants are shown. If a participant has their camera enabled, their video feed is shown here. Each participant has an individual tile which shows their display name and video stream (when there is one). The gallery supports multiple participants and changes as participants are added to the call.
2. **Action Bar**: This is where the primary call controls are located to turn video and mic on/off, share screen and leave the call.

Below you'll find more information on prerequisites and steps to set up the sample.

## Prerequisites

- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- A Mac running [Xcode](https://go.microsoft.com/fwLink/p/?LinkID=266532), along with a valid developer certificate installed into your Keychain.
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Resource](../quickstarts/create-communication-resource.md).
- Azure Function running [Trusted Service logic](../../tutorials/trusted-service-tutorial.md) to fetch access tokens

## Running sample locally

The group calling sample can be run locally using XCode. Developers can either use their physical device or emulator to test the application.

### Before running the sample for the first time

1. Install dependencies by running `pod install`
2. Open `CallingSampleApp.xcworkspace` in XCode
3. Update `AppSettings.plist`. Set the value for the `acsTokenFetchUrl` key to be the URL for your Authentication Endpoint.

### Run sample

1. Build and Run sample in XCode

## (Optional) Securing Authentication Endpoint

For simple demonstration purposes, this sample uses a publicly accessible endpoint by default to fetch an ACS token. For production scenarios, it is recommended that the ACS token is returned from a secured endpoint.  

With additional configuration, this sample supports connecting to an **Azure Active Directory** (AAD) protected endpoint so that user login is required for the app to fetch an ACS token. See steps below:

1. Enable Azure Active Directory authentication in your app.  
   - [Register your app under Azure Active Directory (using iOS / macOS platform settings)](https://docs.microsoft.com/en-us/azure/active-directory/develop/tutorial-v2-ios) 
	- [Configure your App Service or Azure Functions app to use Azure AD login](https://docs.microsoft.com/en-us/azure/app-service/configure-authentication-provider-aad)
2. Go to your registered app overview page under Azure Active Directory App Registrations. Take note of the `Application (client) ID`, `Directory (tenant) ID`, `Application ID URI`
![](./docs/images/aadOverview.png)
3. Open `AppSettings.plist` in Xcode, add the following key values:
   - `acsTokenFetchUrl`: the URL to request Azure Communication Services token 
   - `isAADAuthEnabled`: a boolean value to indicate if the Azure Communication Services token authentication is required or not
   - `aadClientId`: your Application (client) ID
   - `aadTenantId`: your Directory (tenant) ID
   - `aadRedirectURI`: the redirect URI should be in this format: `msauth.<app_bundle_id>://auth`
   - `aadScopes`: an array of permission scopes requested from users for authorization. Add `<Application ID URI>/user_impersonation` to the array to grant access to authentication endpoint

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../quickstarts/create-communication-resource.md#clean-up-resources).

## Next steps

>[!div class="nextstepaction"] 
>[Download the sample from GitHub](https://github.com/Azure-Samples/communication-services-ios-calling-hero)