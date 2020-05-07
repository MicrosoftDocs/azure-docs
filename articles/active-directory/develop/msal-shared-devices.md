---
title: Shared device mode overview
titleSuffix: Microsoft identity platform | Azure
description: Learn about shared device mode to enable device sharing for your Firstline Workers.
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

# Overview of shared device mode

Shared device mode is a feature of Azure Active Directory that allows you to build applications that support Firstline Workers and enable shared device mode on the devices deployed to them.

> [!NOTE]
> This feature is in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## What are Firstline Workers?

Firstline Workers are retail employees, maintenance and field agents, medical personnel, and other users that don't sit in front of a computer or use corporate email for collaboration. The following sections introduce the aspects and challenges of supporting Firstline Workers, followed by an introduction to the features provided by Microsoft that enable your application for use by an organization's Firstline Workers.

### Challenges of supporting Firstline Workers

Enabling Firstline Worker workflows includes challenges not usually presented by typical information workers. Such challenges can include high turnover rate and less familiarity with an organization's core productivity tools. To empower their Firstline Workers, organizations are adopting different strategies. Some are adopting a bring-your-own-device (BYOD) strategy in which their employees use business apps on their personal phone, while others provide their employees with shared devices like iPads or Android tablets.

### Supporting multiple users on devices designed for one user

Because mobile devices running iOS or Android were designed for single users, most applications optimize their experience for use by a single user. Part of this optimized experience means enabling single sign-on across applications and keeping users signed in on their device. When a user removes their account from an application, the app typically doesn't consider it a security-related event. Many apps even keep a user's credentials around for quick sign-in. You may even have experienced this yourself when you've deleted an application from your mobile device and then reinstalled it, only to discover you're still signed in.

### Global sign-in and sign-out (SSO)

To allow an organization's employees to use its apps across a pool of devices shared by those employees, developers need to enable the opposite experience. Employees should be able to pick a device from the pool and perform a single gesture to "make it theirs" for the duration of their shift. At the end of their shift, they should be able to perform another gesture to sign out globally on the device, with all their personal and company information removed so they can return it to the device pool. Furthermore, if an employee forgets to sign out, the device should be automatically signed out at the end of their shift and/or after a period of inactivity.

Azure Active Directory enables these scenarios with a feature called **shared device mode**.

## Introducing shared device mode

As mentioned, shared device mode is a feature of Azure Active Directory that enables you to:

* Build applications that support Firstline Workers
* Deploy devices to Firstline Workers and turn on shared device mode

### Build applications that support Firstline Workers

You can support Firstline Workers in your applications by using the Microsoft Authentication Library (MSAL) and [Microsoft Authenticator app](../user-help/user-help-auth-app-overview.md) to enable a device state called *shared device mode*. When a device is in shared device mode, Microsoft provides your application with information to allow it to modify its behavior based on the state of the user on the device, protecting user data.

Supported features are:

* **Sign in a user device-wide** through any supported application.
* **Sign out a user device-wide** through any supported application.
* **Query the state of the device** to determine if your application is on a device that's in shared device mode.
* **Query the device state of the user** on the device to determine if anything has changed since the last time your application was used.

Supporting shared device mode should be considered both a security enhancement and feature upgrade for your application, and can help increase its adoption in highly regulated environments like healthcare and finance.

Your users depend on you to ensure their data isn't leaked to another user. Share Device Mode provides helpful signals to indicate to your application that a change you should manage has occurred. Your application is responsible for checking the state of the user on the device every time the app is used, clearing the previous user's data. This includes if it is reloaded from the background in multi-tasking. On a user change, you should ensure both the previous user's data is cleared and that any cached data being displayed in your application is removed. We recommend you always perform a thorough security review process after adding shared device mode capability to your app.

For details on how to modify your applications to support shared device mode, see the [Next steps](#next-steps) section at the end of this article.

### Deploy devices to Firstline Workers and turn on shared device mode

Once your applications support shared device mode and include the required data and security changes, you can advertise them as being usable by Firstline Workers.

An organization's device administrators are able to deploy their devices and your applications to their stores and workplaces through a mobile device management (MDM) solution like Microsoft Intune. Part of the provisioning process is marking the device as a *Shared Device*. Administrators configure shared device mode by deploying the [Microsoft Authenticator app](../user-help/user-help-auth-app-overview.md) and setting shared device mode through configuration parameters. After performing these steps, all applications that support shared device mode will use the Microsoft Authenticator application to manage its user state and provide security features for the device and organization.

## Next steps

We support iOS and Android platforms for shared device mode. Review the documentation below for your platform to begin supporting Firstline Workers in your applications.

* [Supporting shared device mode for iOS](msal-ios-shared-devices.md)
* [Supporting shared device mode for Android](msal-android-shared-devices.md)
