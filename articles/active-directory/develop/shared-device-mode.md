---
title: Shared device mode for Android devices | Azure
description: How a Firstline worker Android app can use shared device mode.
services: active-directory
documentationcenter: dev-center-name
author: tylermsft
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 1/15/2020
ms.author: twhitney
ms.reviwer: hahamil
ms.custom: aaddev, identityplatformtop40
ms.collection: M365-identity-device-management
---

# Shared device mode for Android devices

Shared device mode allows you to configure an Android device to be shared by multiple employees.

Firstline workers, such as retail associates, flight crew members, and field service workers, often use a shared mobile device to do their work. That becomes problematic when they start sharing passwords or pin numbers to access customer and business data on the shared device.

Shared device mode allows you to configure an Android device so that it can be easily shared by multiple employees. Employees can sign in and access customer information quickly. When they are finished with their shift or task, they can sign out of the device and it will be immediately ready for the next employee to use.

Shared device mode also provides Microsoft identity backed management of the device.

To create a shared device mode app, developers and cloud device admins work together:

- Developers write a single-account app (multiple-account apps are not supported in shared device mode), add `"shared_device_mode_supported": true` to the app's configuration, and write code to handle things like global sign-out.
- Device admins prepare the device to be shared by installing the authenticator app, and setting the device to shared mode using the authenticator app. Only users who are in the [Cloud Device Administrator](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles#cloud-device-administrator) role can put a device into shared mode by using the [Authenticator app](https://www.microsoft.com/account/authenticator). You can configure the membership of your organizational roles in the Azure Portal via:
**Azure Active Directory** > **Roles and Administrators** > **Cloud Device Administrator**.

 This article focuses primarily on issues developers should think about.

## Single vs multiple-account applications

Applications written using the Microsoft Authentication Library (MSAL) SDK can manage a single account or multiple accounts. This is known as [single-account mode or multiple-account mode](https://docs.microsoft.com/azure/active-directory/develop/single-multi-account). The Microsoft identity platform features available to the application vary depending on whether the application is running in single-account mode or multiple-account mode.

**Shared device mode apps only work in single-account mode**.

Applications that only support multiple-account mode can't run on a shared device. If an employee loads an app that doesn't support single-account mode, it won't run on the shared device.

> [!NOTE]
> Apps written before the MSAL SDK was released run in multiple-account mode and must be updated to run in single-account mode to run on a shared device.

**Supporting both single-account and multiple-account mode**

If your app supports multiple accounts, but you also need to support single account mode so that you can use shared device mode, you can use `ISingleAccountPublicClientApplication.isSharedDevice()` to determine when to run in single-account mode. You could also adapt the user interface accordingly.

You'll also need to perform a type check and cast to the appropriate interface when you get your public client application object, like this:

```java
private IPublicClientApplication mApplication;

        if (mApplication instanceOf IMultipleAccountPublicClientApplication) {
          IMultipleAccountPublicClientApplication multipleAccountApplication = (IMultipleAccountPublicClientApplication) mApplication;
          ...
        } else if (mApplication instanceOf    ISingleAccountPublicClientApplication) {
           ISingleAccountPublicClientApplication singleAccountApplication = (ISingleAccountPublicClientApplication) mApplication;
            ...
        }
```

## What happens when the device mode changes

If your application is running in multiple-account mode, and an administrator puts the device in shared device mode, all of the accounts on the device are cleared from the application and the application transitions to single-account mode.

## Why you may want to only support single-account mode

If you are writing an app that will only be used for firstline workers using a shared device, we recommend that you write your application to only support single-account mode. This includes most applications that are task focused such as medical records apps, invoice apps, and most line-of-business apps. Only supporting single-account mode simplifies development because you won't need to implement the additional features that are part of multiple-account apps.

## Global Sign out

When a user signs out, you will need to take action to protect the privacy and data of the user. For example, if you're building a medical records app, you'll want to make sure that when the user signs out that previously displayed patient records are cleared. Your application must be prepared for this and check every time it enters the foreground. To check whether the user has changed, since the last time the app was in the foreground, use the method described in the how-to topic: [How to Determine if a User has changed on the device](link).

Be aware that when your app uses MSAL to sign out the user in an app running on device that is in shared mode, as shown in the how-to topic [How to globally sign a user in and out](link), that the signed-in account and cached tokens are removed from both the app and the device:

## Next steps

Try the [shared device mode tutorial](link). You'll setup an Android device to run in shared device mode and get the [sample]() running on it.
