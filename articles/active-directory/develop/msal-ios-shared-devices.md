---
title: Shared device mode for iOS devices
titleSuffix: Microsoft identity platform | Azure
description: Learn how to enable shared device mode to allow Firstline Workers to share an iOS device
services: active-directory
author: brandwe
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 03/31/2020
ms.author: brandwe
ms.reviewer: brandwe
ms.custom: aaddev
---

# Shared device mode for iOS devices

> [!NOTE]
> This feature is in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Firstline Workers such as retail associates, flight crew members, and field service workers often use a shared mobile device to perform their work. These shared devices can present security risks if your users share their passwords or PINs, intentionally or not, to access customer and business data on the shared device.

Shared device mode allows you to configure an iOS 13 or higher device to be more easily and securely shared by employees. Employees can sign in and access customer information quickly. When they're finished with their shift or task, they can sign out of the device and it's immediately ready for use by the next employee.

Shared device mode also provides Microsoft identity-backed management of the device.

This feature uses the [Microsoft Authenticator app](../user-help/user-help-auth-app-overview.md) to manage the users on the device and to distribute the [Microsoft Enterprise SSO plug-in for Apple devices](apple-sso-plugin.md).

## Create a shared device mode app

To create a shared device mode app, developers and cloud device admins work together:

1. **Application developers** write a single-account app (multiple-account apps are not supported in shared device mode) and write code to handle things like shared device sign-out.

1. **Device administrators** prepare the device to be shared by using a mobile device management (MDM) provider like Microsoft Intune to manage the devices in their organization. The MDM pushes the Microsoft Authenticator app to the devices and turns on "Shared Mode" for each device through a profile update to the device. This Shared Mode setting is what changes the behavior of the supported apps on the device. This configuration from the MDM provider sets the shared device mode for the device and enables the [Microsoft Enterprise SSO plug-in for Apple devices](apple-sso-plugin.md) which is required for shared device mode.

1. [**Required during Public Preview only**] A user with [Cloud Device Administrator](../users-groups-roles/directory-assign-admin-roles.md#cloud-device-administrator) role must then launch the [Microsoft Authenticator app](../user-help/user-help-auth-app-overview.md) and join their device to the organization.

    To configure the membership of your organizational roles in the Azure portal: **Azure Active Directory** > **Roles and Administrators** > **Cloud Device Administrator**

The following sections help you update your application to support shared device mode.

## Use Intune to enable shared device mode & SSO extension

> [!NOTE]
> The following step is required only during public preview.

Your device needs to be configured to support shared device mode. It must have iOS 13+ installed and be MDM-enrolled. MDM configuration also needs to enable [Microsoft Enterprise SSO plug-in for Apple devices](apple-sso-plugin.md). To learn more about SSO extensions, see the [Apple video](https://developer.apple.com/videos/play/tech-talks/301/).

1. In the Intune Configuration Portal, tell the device to enable the [Microsoft Enterprise SSO plug-in for Apple devices](apple-sso-plugin.md) with the following configuration:

    - **Type**: Redirect
    - **Extension ID**: com.microsoft.azureauthenticator.ssoextension
    - **Team ID**: SGGM6D27TK
    - **URLs**: https://login.microsoftonline.com
    - Additional Data to configure:
      - Key: sharedDeviceMode
      - Type: Boolean
      - Value: True

    For more information about configuring with Intune, see the [Intune configuration documentation](https://docs.microsoft.com/intune/configuration/ios-device-features-settings).

1. Next, configure your MDM to push the Microsoft Authenticator app to your device through an MDM profile.

    Set the following configuration options to turn on Shared Device mode:

    - Configuration 1:
      - Key: sharedDeviceMode
      - Type: Boolean
      - Value: True

## Modify your iOS application to support shared device mode

Your users depend on you to ensure their data isn't leaked to another user. The following sections provide helpful signals to indicate to your application that a change has occurred and should be handled.

You are responsible for checking the state of the user on the device every time your app is used, and then clearing the previous user's data. This includes if it is reloaded from the background in multi-tasking.

On a user change, you should ensure both the previous user's data is cleared and that any cached data being displayed in your application is removed. We highly recommend you and your company conduct a security review process after updating your app to support shared device mode.

### Detect shared device mode

Detecting shared device mode is important for your application. Many applications will require a change in their user experience (UX) when the application is used on a shared device. For example, your application might have a "Sign-Up" feature, which isn't appropriate for a Firstline Worker because they likely already have an account. You may also want to add extra security to your application's handling of data if it's in shared device mode.

Use the `getDeviceInformationWithParameters:completionBlock:` API in the `MSALPublicClientApplication` to determine if an app is running on a device in shared device mode.

The following code snippets show examples of using the `getDeviceInformationWithParameters:completionBlock:` API.

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

### Get the signed-in user and determine if a user has changed on the device

Another important part of supporting shared device mode is determining the state of the user on the device and clearing application data if a user has changed or if there is no user at all on the device. You are responsible for ensuring data isn't leaked to another user.

You can use `getCurrentAccountWithParameters:completionBlock:` API to query the currently signed-in account on the device.

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

### Globally sign in a user

When a device is configured as a shared device, your application can call the `acquireTokenWithParameters:completionBlock:` API to sign in the account. The account will be available globally for all eligible apps on the device after the first app signs in the account.

#### Objective-C

```objective-c
MSALInteractiveTokenParameters *parameters = [[MSALInteractiveTokenParameters alloc] initWithScopes:@[@"api://myapi/scope"] webviewParameters:[self msalTestWebViewParameters]];

parameters.loginHint = self.loginHintTextField.text;

[application acquireTokenWithParameters:parameters completionBlock:completionBlock];
```

### Globally sign out a user

The following code removes the signed-in account and clears cached tokens from not only the app, but also from the device that's in shared device mode. It does not, however, clear the *data* from your application. You must clear the data from your application, as well as clear any cached data your application may be displaying to the user.

#### Clear browser state

> [!NOTE]
> The following step is required only during public preview.

In this public preview version, the [Microsoft Enterprise SSO plug-in for Apple devices](apple-sso-plugin.md) clears state only for applications. It does not clear state on the Safari browser. We recommend you manually clear browser session to ensure no traces of user state are left behind. You can use the optional `signoutFromBrowser` property shown below to clear any cookies. This will cause the browser to briefly launch on the device.

#### Swift

```swift
let account = .... /* account retrieved above */

let signoutParameters = MSALSignoutParameters(webviewParameters: self.webViewParamaters!)
signoutParameters.signoutFromBrowser = true // Only needed for Public Preview.

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

## Next steps

To see shared device mode in action, the following code sample on GitHub includes an example of running a Firstline Worker app on an iOS device in shared device mode:

[MSAL iOS Swift Microsoft Graph API Sample](https://github.com/Azure-Samples/ms-identity-mobile-apple-swift-objc)
