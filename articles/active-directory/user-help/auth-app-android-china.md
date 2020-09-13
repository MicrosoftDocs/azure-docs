---
title: Microsoft Authenticator availability and limitations for Android in China | Microsoft Docs
description: Learn about how to get the Microsoft Authenticator app - availability in China
services: active-directory
author: curtand
manager: daveba
ms.reviewer: sahenry

ms.service: active-directory
ms.subservice: user-help
ms.workload: identity
ms.topic: end-user-help
ms.date: 05/20/2020
ms.author: curtand
---

# Microsoft Authenticator for Android in the public cloud in China

The Microsoft Authenticator app for Android is available for download in China. The Google Play Store isn't available in China, so the app must be downloaded from other Chinese app marketplaces. The Microsoft Authenticator app for Android is currently available in the following stores in China:

- [Baidu](https://shouji.baidu.com/software/26638379.html)
- [Lenovo](https://www.lenovomm.com/appdetail/com.azure.authenticator/20197724)
- [Huawei](https://appgallery.cloud.huawei.com/uowap/index.html#/detailApp/C100262999?source=appshare&subsource=C100262999&shareTo=weixin&locale=zh_CN)
- [Samsung Galaxy Store](http://apps.samsung.com/appquery/appDetail.as?appId=com.azure.authenticator)

The most current build of the app is in the Google Play Store, but we're updating the app on all other app stores as quickly as we can. Because there's no custom Android application package (APK) deployed to any app store, the app can be seamlessly updated from one of the following locations:

- The store it was downloaded from
- The Google Play Store if the user crosses regions

## Limitations

The Microsoft Authenticator app for Android uses Google’s Firebase Cloud Messaging system and Google Play Services to receive push notifications. Because neither service is available in China, there are some limitations in functionalities of the app:

- Registration of the Authenticator app as a multi-factor authentication (MFA) method using push notifications doesn't work.

- [Phone sign-in](../authentication/howto-authentication-sms-signin.md) can't be set up. It requires the user to set up the app as an MFA method using push notifications, which currently don't work.

If a user has previously managed to set up phone sign-in or multi-factor authentication using the app, they can perform a manual check for notifications requests in the app and use it for identity verification.

## Multi-factor authentication workaround

Instead of using push notifications for multi-factor authentication, users can [set up their Authenticator app to receive verification codes](multi-factor-authentication-setup-auth-app.md#set-up-the-microsoft-authenticator-app-to-use-verification-codes) on their device that they can use for MFA to verify their identity. These verification codes are valid for 30 seconds and to use them, admins must enable their tenant to perform verification using Time-based One-Time Password (TOTP) verification codes.

## Availability

Microsoft Authenticator Feature | Availability in China
------------------------------- | ---------------------
MFA registration using push notifications | No
Pre-Existing MFA account verifying identity using push notifications | No
Pre-Existing MFA account performing manual check for notifications | Yes
MFA registration/authentication using TOTP/verification codes only | Yes
Phone Sign-in Registration | No
Existing Phone Sign-in using push notifications | No
Existing Phone Sign-in verification by performing manual check for authentication requests | Yes

## Next steps

- [Download and install the Microsoft Authenticator app](user-help-auth-app-download-install.md)
