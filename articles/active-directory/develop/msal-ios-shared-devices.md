---
title: Shared device mode for iOS devices
description: Learn how to enable shared device mode to allow frontline workers to share an iOS device
services: active-directory
author: henrymbuguakiarie
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 05/16/2023
ms.author: henrymbugua
ms.reviewer: brandwe, akgoel23
ms.custom: aaddev
---

# Shared device mode for iOS devices

> [!IMPORTANT]
> This feature [!INCLUDE [PREVIEW BOILERPLATE](./includes/develop-preview.md)]

Frontline workers such as retail associates, flight crew members, and field service workers often use a shared mobile device to perform their work. These shared devices can present security risks if your users share their passwords or PINs, intentionally or not, to access customer and business data on the shared device.

[Shared device mode](msal-shared-devices.md) allows you to configure an iOS 14 or higher device to be more easily and securely shared by employees. Employees can sign-in once and get single sign-on (SSO) to all apps that support this feature, giving them faster access to information. When they're finished with their shift or task, they can sign out of the device through any supported app that also signs them out from all apps supporting this feature, and the device is immediately ready for use by the next employee with no access to previous user's data.

To take advantage of shared device mode feature, app developers and cloud device admins work together:

1. **Device administrators** prepare the device to be shared by using a mobile device management (MDM) provider like Microsoft Intune. The MDM pushes the [Microsoft Authenticator app](https://support.microsoft.com/account-billing/how-to-use-the-microsoft-authenticator-app-9783c865-0308-42fb-a519-8cf666fe0acc) to the devices and turns on "Shared Mode" for each device through a profile update to the device. This Shared Mode setting is what changes the behavior of the supported apps on the device. This configuration from the MDM provider sets the shared device mode for the device and enables the [Microsoft Enterprise SSO plug-in for Apple devices](apple-sso-plugin.md) that is required for shared device mode. To learn more about SSO extensions, see the [Apple video](https://developer.apple.com/videos/play/tech-talks/301/).

2. **Application developers** write a single-account app (multiple-account apps aren't supported in shared device mode) to handle the following scenario:

   - Sign in a user device-wide through any supported application.
   - Sign out a user device-wide through any supported application.
   - Query the state of the device to determine if your application is on a device that's in shared device mode.
   - Query the device state of the user on the device to determine if anything has changed since the last time your application was used.

   Supporting shared device mode should be considered a feature upgrade for your application, and can help increase its adoption in environments where the same device is used among multiple users.

   > [!IMPORTANT]
   > [Microsoft applications](#microsoft-applications-that-support-shared-device-mode) that support shared device mode on iOS don't require any changes and just need to be installed on the device to get the benefits that come with shared device mode.

## Set up device in Shared Device Mode

Your device needs to be configured to support shared device mode. It must have iOS 14+ installed and be MDM-enrolled. MDM configuration also needs to enable [Microsoft Enterprise SSO plug-in for Apple devices](apple-sso-plugin.md).

Microsoft Intune supports zero-touch provisioning for devices in Microsoft Entra shared device mode, which means that the device can be set up and enrolled in Intune with minimal interaction from the frontline worker. To set up device in shared device mode when using Microsoft Intune as the MDM, see [Set up enrollment for devices in Microsoft Entra shared device mode](/mem/intune/enrollment/automated-device-enrollment-shared-device-mode/).

> [!IMPORTANT]
> We are working with third-party MDMs to support shared device mode. We will update the list of third-party MDMs as they start supporting the shared device mode.

## Modify your iOS application to support shared device mode

Your users depend on you to ensure their data isn't leaked to another user. The following sections provide helpful signals to indicate to your application that a change has occurred and should be handled.

You're responsible for checking the state of the user on the device every time your app is used, and then clearing the previous user's data. This includes if it's reloaded from the background in multi-tasking.

On a user change, you should ensure both the previous user's data is cleared and that any cached data being displayed in your application is removed. We highly recommend you and your company conduct a security review process after updating your app to support shared device mode.

### Detect shared device mode

Detecting shared device mode is important for your application. Many applications require a change in their user experience (UX) when the application is used on a shared device. For example, your application might have a "Sign-Up" feature, which isn't appropriate for a frontline worker because they likely already have an account. You may also want to add extra security to your application's handling of data if it's in shared device mode.

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

Another important part of supporting shared device mode is determining the state of the user on the device and clearing application data if a user has changed or if there's no user at all on the device. You're responsible for ensuring data isn't leaked to another user.

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

The following code removes the signed-in account and clears cached tokens from not only the app, but also from the device that's in shared device mode. It doesn't, however, clear the _data_ from your application. You must clear the data from your application, and clear any cached data your application may be displaying to the user.

#### Swift

```swift
let account = .... /* account retrieved above */

let signoutParameters = MSALSignoutParameters(webviewParameters: self.webViewParamaters!)
signoutParameters.signoutFromBrowser = true // To trigger a browser signout in Safari.

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

signoutParameters.signoutFromBrowser = YES; // To trigger a browser signout in Safari.

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

The [Microsoft Enterprise SSO plug-in for Apple devices](apple-sso-plugin.md) clears state only for applications. It doesn't clear state on the Safari browser. You can use the optional `signoutFromBrowser` property shown in code snippets to trigger a browser sign out in Safari. This causes the browser to briefly launch on the device.

### Receive broadcast to detect global sign out initiated from other applications

To receive the account change broadcast, you need to register a broadcast receiver. When an account change broadcast is received, immediately [get the signed in user and determine if a user has changed on the device](#get-the-signed-in-user-and-determine-if-a-user-has-changed-on-the-device). If a change is detected, initiate data cleanup for previously signed-in account. It's recommended to properly stop any operations and do data cleanup.

The following code snippet shows how you could register a broadcast receiver.

```objectivec
NSString *const MSAL_SHARED_MODE_CURRENT_ACCOUNT_CHANGED_NOTIFICATION_KEY = @"SHARED_MODE_CURRENT_ACCOUNT_CHANGED";

- (void) registerDarwinNotificationListener 

{ 

   CFNotificationCenterRef center =

   CFNotificationCenterGetDarwinNotifyCenter(); 

   CFNotificationCenterAddObserver(center, nil,

   sharedModeAccountChangedCallback,

   (CFStringRef)MSAL_SHARED_MODE_CURRENT_ACCOUNT_CHANGED_NOTIFICATION_KEY, 

   nil, CFNotificationSuspensionBehaviorDeliverImmediately); 

} 

// CFNotificationCallbacks used specifically for Darwin notifications leave userInfo unused 

void sharedModeAccountChangedCallback(CFNotificationCenterRef center, void * observer, CFStringRef name, void const * object, __unused CFDictionaryRef userInfo) 

{ 

    // Invoke account cleanup logic here 

} 
```

For more information about the available options for `CFNotificationAddObserver` or to see the corresponding method signatures in Swift, see:

- [CFNotificationAddObserver](https://developer.apple.com/documentation/corefoundation/1543316-cfnotificationcenteraddobserver?language=objc)
- [CFNotificationCallback](https://developer.apple.com/documentation/corefoundation/cfnotificationcallback?language=objc)

For iOS, your app requires a background permission to remain active in the background and listen to Darwin notifications. The background capability must be added to support a different background operation – your app may be subject to rejection from the Apple App Store if it has a background capability only to listen for Darwin notifications. If your app is already configured to complete background operations, you can add the listener as part of that operation. For more information about iOS background capabilities, see [Configuring background execution modes](https://developer.apple.com/documentation/xcode/configuring-background-execution-modes)

## Microsoft applications that support shared device mode

These Microsoft applications support Microsoft Entra shared device mode:

- [Microsoft Teams](/microsoftteams/platform/) (in Public Preview)
- [Microsoft Power BI Mobile](/power-bi/consumer/mobile/mobile-app-shared-device-mode) (in Public Preview)

> [!IMPORTANT]
> Public preview is provided without a service-level agreement and isn't recommended for production workloads. Some features might be unsupported or have constrained capabilities. For more information, see [Universal License Terms for Online Services](https://www.microsoft.com/licensing/terms/product/ForOnlineServices/all).

## Next steps

To see shared device mode in action, the following code sample on GitHub includes an example of running a frontline worker app on an iOS device in shared device mode:

[MSAL iOS Swift Microsoft Graph API Sample](https://github.com/Azure-Samples/ms-identity-mobile-apple-swift-objc)
