---
title: Shared device mode overview
description: Learn about shared device mode to enable device sharing for your frontline workers.
services: active-directory
author: henrymbuguakiarie
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 02/08/2023
ms.author: henrymbugua
ms.reviewer: brandwe
ms.custom: aaddev
---

# Overview of shared device mode

Shared device mode is a feature of Microsoft Entra ID that allows you to build and deploy applications that support frontline workers and educational scenarios that require shared Android and iOS devices.

> [!IMPORTANT]
> Shared device mode for iOS [!INCLUDE [PREVIEW BOILERPLATE](./includes/develop-preview.md)]

### Supporting multiple users on devices designed for one user

Because mobile devices running iOS or Android were designed for single users, most applications optimize their experience for use by a single user. Part of this optimized experience means enabling single sign-on (SSO) across applications and keeping users signed in on their device. When a user removes their account from an application, the app typically doesn't consider it a security-related event. Many apps even keep a user's credentials around for quick sign-in. You may even have experienced this yourself when you've deleted an application from your mobile device and then reinstalled it, only to discover you're still signed in.

### Automatic single sign-in and single sign-out

To allow an organization's employees to use its apps across a pool of devices shared by those employees, developers need to enable the opposite experience. Employees should be able to pick a device from the pool and perform a single gesture to "make it theirs" during their shift. At the end of their shift, they should be able to perform another gesture to sign out globally on the device, with all their personal and company information removed so they can return it to the device pool. Furthermore, if an employee forgets to sign out, the device should be automatically signed out at the end of their shift and/or after a period of inactivity.

Microsoft Entra ID enables these scenarios with a feature called **shared device mode**.

## Introducing shared device mode

As mentioned, shared device mode is a feature of Microsoft Entra ID that enables you to:

- Build applications that support frontline workers.
- Deploy devices to frontline workers with apps that support shared device mode.

### Build applications that support frontline workers

You can support frontline workers in your applications by using the Microsoft Authentication Library (MSAL) and [Microsoft Authenticator app](https://support.microsoft.com/account-billing/how-to-use-the-microsoft-authenticator-app-9783c865-0308-42fb-a519-8cf666fe0acc) to enable a device state called _shared device mode_. When a device is in shared device mode, Microsoft provides your application with information to allow it to modify its behavior based on the state of the user on the device, protecting user data.

Supported features are:

- **Sign in a user device-wide** through any supported application.
- **Sign out a user device-wide** through any supported application.
- **Query the state of the device** to determine if your application is on a device that's in shared device mode.
- **Query the device state of the user** on the device to determine if anything has changed since the last time your application was used.

Supporting shared device mode should be considered a feature upgrade for your application, and can help increase its adoption in environments where the same device is used among multiple users.

Your users depend on you to ensure their data isn't leaked to another user. Share Device Mode provides helpful signals to indicate to your application that a change you should manage has occurred. Your application is responsible for checking the state of the user on the device every time the app is used, clearing the previous user's data. This includes if it's reloaded from the background in multi-tasking. On a user change, you should ensure both the previous user's data is cleared and that any cached data being displayed in your application is removed.

To support all data loss prevention scenarios, we also recommend you integrate with the [Intune App SDK](/mem/intune/developer/app-sdk). By using the Intune App SDK, you can allow your application to support Intune [App Protection Policies](/mem/intune/apps/app-protection-policy). In particular, we recommend that you integrate with Intune's [selective wipe](/mem/intune/developer/app-sdk-android-phase5#selective-wipe) capabilities and [deregister the user on iOS](/mem/intune/developer/app-sdk-ios#deregister-user-accounts) during a sign-out.

Lastly, we recommend you always perform a thorough security review process after adding shared device mode capability to your app.

For details on how to modify your applications to support shared device mode, see the [Next steps](#next-steps) section at the end of this article.

### Deploy devices to frontline workers and turn on shared device mode

Once your applications support shared device mode and include the required data and security changes, you can advertise them as being usable by frontline workers.

An organization's device administrators are able to deploy their devices and your applications to their stores and workplaces through a mobile device management (MDM) solution like Microsoft Intune. Part of the provisioning process is marking the device as a _Shared Device_. Administrators configure shared device mode by deploying the [Microsoft Authenticator app](https://support.microsoft.com/account-billing/how-to-use-the-microsoft-authenticator-app-9783c865-0308-42fb-a519-8cf666fe0acc) and setting shared device mode through configuration parameters. After performing these steps, all applications that support shared device mode will use the Microsoft Authenticator application to manage its user state and provide security features for the device and organization.

### Use App Protection Policies to provide data loss prevention between users.

For data protection capabilities along with shared device mode, Microsoft’s supported data protection solution for Microsoft 365 applications on Android and iOS is Microsoft Intune Application Protection Policies. For more information about the policies, see [App protection policies overview - Microsoft Intune | Microsoft Learn](/mem/intune/apps/app-protection-policy).

When setting up App protection policies for shared devices, we recommend using [level 2 enterprise enhanced data protection](/mem/intune/apps/app-protection-framework#level-2-enterprise-enhanced-data-protection). With level 2 data protection, you can restrict data transfer scenarios that may cause data to move to parts of the device that aren't cleared with shared device mode.

## Next steps

We support iOS and Android platforms for shared device mode. For more information, see:

- [Supporting shared device mode for iOS](msal-ios-shared-devices.md)
- [Supporting shared device mode for Android](msal-android-shared-devices.md)
