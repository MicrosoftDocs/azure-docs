---
title: Supporting Shared Device Mode for iOS | Azure
description: Learn about shared device mode, which allows Firstline Workers to share an Android device 
services: active-directory
documentationcenter: dev-center-name
author: mmacy
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 3/24/2020
ms.author: brandwe
ms.reviwer: brandwe
ms.custom: aaddev, identityplatformtop40
---

# Supporting Shared Device Mode for iOS

## Overview

> [!NOTE]
> This feature is in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Firstline Workers, such as retail associates, flight crew members, and field service Workers, often use a shared mobile device to do their work. That becomes problematic when they start sharing passwords or pin numbers to access customer and business data on the shared device.

Shared device mode allows you to configure an iOS 13 or higher device so that it can be easily shared by multiple employees. Employees can sign in and access customer information quickly. When they are finished with their shift or task, they can sign out of the device and it will be immediately ready for the next employee to use.

Shared device mode also provides Microsoft identity backed management of the device.

This feature uses the [Microsoft Authenticator app](https://docs.microsoft.com/azure/active-directory/user-help/user-help-auth-app-overview) to manage the users on the device and to distribute the [Microsoft Enterprise SSO Plug-In for Apple Devices](apple-sso-plugin.md).

To create a shared device mode app, developers and cloud device admins work together:

- **Application Developers** write a single-account app (multiple-account apps are not supported in shared device mode) and write code to handle things like shared device sign-out.

- **Device Administrators** prepare the device to be shared by using an MDM provider like Intune to manage the devices that will be used by the organization. The MDM will push the Microsoft Authenticator app to the devices and turn on "Shared Mode" for each device through a profile update to the device. This Shared Mode setting is what will change the behavior of all the supported apps on the device.  This confiugration from the MDM provider both sets the Shared Device mode for the device and enables the [Microsoft Enterprise SSO Plug-In for Apple Devices](apple-sso-plugin.md) which is required for Shared Device mode. 

    > [!NOTE]
    > Step Required For Public Preview Only
    >
    > Once that is complete a user who are in the [Cloud Device Administrator](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles#cloud-device-administrator) role must then launch the [Microsoft Authenticator app](https://docs.microsoft.com/azure/active-directory/user-help/user-help-auth-app-overview) and join thier device to the organization. When this feature launches for production workloads, you will no longer need to do this additional step as Intune will be able to join the device to your organization as part of the initial setup. We are working to support other MDMs as well. You can configure the membership of your organizational roles in the Azure portal via:
**Azure Active Directory** > **Roles and Administrators** > **Cloud Device Administrator**.

 This article will help you update your application to support Shared Device Mode.

 ## Using Intune to Enable Shared Device Mode and the SSO Extension

 > [!NOTE]
    > Step Below Required For Public Preview Only
    >
    > Intune will soon ship the ability to turn on the Microsoft Enterprise SSO Plug-In for Apple Devices and enable Shared Device Mode through a UI update. The need to manually configure these options below is for Public Preview only.

 * Your device needs to be configured to support shared device mode. It needs to use iOS 13+ and be MDM enrolled. MDM configuration needs to also enable [Microsoft Enterprise SSO Plug-In for Apple Devices](apple-sso-plugin.md). See [Apple video](https://developer.apple.com/videos/play/tech-talks/301/) to learn more about SSO extensions. You may also wish to browse [Intune configuration documentation](https://docs.microsoft.com/intune/configuration/ios-device-features-settings) as you will be using this portal below to push the correct configuration to your Shared Devices.

 In the Intune Configuration Portal, set the following configuration:  
* Tell the device to enable the [Microsoft Enterprise SSO Plug-In for Apple Devices] using the following configuration:
  * **Type**: Redirect
  * **Extension ID**: com.microsoft.azureauthenticator.ssoextension
  * **Team ID**: SGGM6D27TK
  * **URLs**: https://login.microsoftonline.com (this list will be expanded for the private preview to include other Microsoft clouds)

* Next, configure your MDM to push Microsoft Authenticator app to your device through an MDM profile. You will need to set the following configuration options to turn on the Shared Device mode and tell the Authenticator to use the [Microsoft Enterprise SSO Plug-In for Apple Devices](apple-sso-plugin.md), which is required for the feature to work.
  * Configuration 1:
    - Key: sharedDeviceMode
    - Type: Boolean
    - Value: True
  * Configuration 2:
    - Key: useSSOExtensionOnly
    - Type: Boolean
    - Value: True



 ## Modifying Your iOS Application to Support Shared Device Mode

 > [!NOTE]
> This feature is in public preview. The API is subject to change

> [!IMPORTANT]
> Supporting Shared Device mode should be considered a secuirty upgrade for your application as well as a feature upgrade. Your users will be depending on you to ensure their data does not leak to another user. Below we will provide helpful signals to indicate to your application when a change has occurred you need to manage. You are responsible for checking on the state of the user on the device every time your app is used and clearing the previous user data. This includes if it is reloaded from the background in multi-tasking. On a user change, you should ensure both the previous user's data is cleared and that any cached data being displayed in your application is removed. We highly recommend if your company has a security review process to use it after updating your app to support Shared Device mode.

### Detect shared device mode:

Detecting Shared Device mode is important for your application. Most applications will need to change its User Experience when their application is on a Shared Device. As an example, your application may have a "Sign-Up" feature that would not make sense to expose to a Firstline Worker who will already have an account. You may also want to add extra security to your application's handling of data if it is shared device mode. 

Use `getDeviceInformationWithParameters:completionBlock:` API in the `MSALPublicClientApplication` to determine if an app is running on a device that is in shared-device mode. 

Here's a code snippet that shows how you could use this API. 

#### Swift

```swift
application.getDeviceInformation(with: nil, completionBlock: { (deviceInformation, error) in
                
	guard let deviceInfo = deviceInformation else {
		return
	}
                
	let isSharedDevice = deviceInfo.deviceMode == .shared
	// Change your app UX if needed
})
```

#### Objective-C

```objective-c
[application getDeviceInformationWithParameters:nil
                                completionBlock:^(MSALDeviceInformation * _Nullable deviceInformation, NSError * _Nullable error)
{
	if (!deviceInformation)
	{
		return;
	}
            
	BOOL isSharedDevice = deviceInformation.deviceMode == MSALDeviceModeShared;
	// Change your app UX if needed
}];
```

### Get the signed in user and determine if a user has changed on the device:

Another very important part of supporting Shared Device mode is determining the state of the user on the device and clearing application data if a user has changed or if there is no user at all on the device. You are responsible for ensuring data does not leak to another user. 

You can use `getCurrentAccountWithParameters:completionBlock:` API to query currently signed in account on the device. Here's an example.

#### Swift

```swift
let msalParameters = MSALParameters()
msalParameters.completionBlockQueue = DispatchQueue.main
                
application.getCurrentAccount(with: msalParameters, completionBlock: { (currentAccount, previousAccount, error) in
            
	// currentAccount is the currently signed in account
	// previousAccount is the previously signed in account if any
})
```

#### Objective-C

```objective-c
MSALParameters *parameters = [MSALParameters new];
parameters.completionBlockQueue = dispatch_get_main_queue();
        
[application getCurrentAccountWithParameters:parameters
                             completionBlock:^(MSALAccount * _Nullable account, MSALAccount * _Nullable previousAccount, NSError * _Nullable error)
{
	// currentAccount is the currently signed in account
	// previousAccount is the previously signed in account if any
}];
```

### Globally sign in a user:

When device is configured as a shared device, your application can call `acquireTokenWithParameters:completionBlock:` API to sign in the account. Account will be available globally for all eligible apps on the device after first app signs that account in. 

#### Objective-C

```objective-c
MSALInteractiveTokenParameters *parameters = [[MSALInteractiveTokenParameters alloc] initWithScopes:@[@"api://myapi/scope"] webviewParameters:[self msalTestWebViewParameters]];

parameters.loginHint = self.loginHintTextField.text;
    
[application acquireTokenWithParameters:parameters completionBlock:completionBlock];
```

### Globally sign out a user:

The following code removes the signed-in account and clears cached tokens from not only the app but also from the device that is in shared device mode. It does not clear the data out of your application. You will be required to do that step, as well as clear any cached data your application may be displaying to the user.

#### Clearning Browser State

The [Microsoft Enterprise SSO Plug-In for Apple Devices](apple-sso-plugin.md) automatically adds and removes credentials to the Safari browser on the Shared Device. We recommend you rely on this to clear your browser state.

> [!NOTE]
    > Step Below Required For Public Preview Only
    >
    > For the moment the Microsoft Enterprise SSO Plug-In for Apple Devices only clears state on applications. It does not clear state on the Safari browser. We recommend you manually clear browser session to ensure no traces of user state are left behind. You can use the optional `signoutFromBrowser` property shown below to clear any cookies. This will cause the browser to briefly launch on the device. We expect this to be fixed soon and will update documentation when browsers clear state on sign-out automatically.

### Swift

```swift
let account = .... /* account retrieved above */

let signoutParameters = MSALSignoutParameters(webviewParameters: self.webViewParamaters!)
signoutParameters.signoutFromBrowser = false
            
application.signout(with: account, signoutParameters: signoutParameters, completionBlock: {(success, error) in
                
	if let error = error {
		// Signout failed
		return
	}
                
	// Sign out completed successfully
})
```

#### Objective-C

```objective-c
MSALAccount *account = ... /* account retrieved above */;
        
MSALSignoutParameters *signoutParameters = [[MSALSignoutParameters alloc] initWithWebviewParameters:webViewParameters];
signoutParameters.signoutFromBrowser = YES; // Only needed for Public Preview.
        
[application signoutWithAccount:account signoutParameters:signoutParameters completionBlock:^(BOOL success, NSError * _Nullable error)
{
	if (!success)
	{
		// Signout failed
		return;
	}
            
	// Sign out completed successfully
}];
```

Next steps

To see this in action, look at our [iOS sample app](https://github.com/Azure-Samples/ms-identity-mobile-apple-swift-objc) that shows how to run a Firstline Worker app on a shared mode iOS device.
