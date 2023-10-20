---
title: Microsoft Entra recommendation - Migrate to Microsoft authenticator
description: Learn why you should migrate your users to the Microsoft authenticator app in Microsoft Entra ID.
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: reference
ms.workload: identity
ms.subservice: report-monitor
ms.date: 09/21/2023
ms.author: sarahlipsey
ms.reviewer: hafowler
---

# Microsoft Entra recommendation: Migrate to Microsoft Authenticator (preview)

[Microsoft Entra recommendations](overview-recommendations.md) is a feature that provides you with personalized insights and actionable guidance to align your tenant with recommended best practices.

This article covers the recommendation to migrate users to the Microsoft Authenticator app, which is currently a preview recommendation. This recommendation is called `useAuthenticatorApp` in the recommendations API in Microsoft Graph.

## Description

Multi-factor authentication (MFA) is a key component to improve the security posture of your Microsoft Entra tenant. While SMS text and voice calls were once commonly used for multi-factor authentication, they're becoming increasingly less secure. You also don't want to overwhelm your users with lots of MFA methods and messages.

One way to ease the burden on your users while also increasing the security of their authentication methods is to migrate anyone using SMS or voice call for MFA to use the Microsoft Authenticator app.

This recommendation appears if Microsoft Entra ID detects that your tenant has users authenticating using SMS or voice instead of the Microsoft Authenticator app in the past week.

## Value 

Push notifications through the Microsoft Authenticator app provide the least intrusive MFA experience for users. This method is the most reliable and secure option because it relies on a data connection rather than telephony.

The verification code option enables MFA even in isolated environments without data or cellular signals, where SMS and Voice calls may not work.

The Microsoft Authenticator app is available for Android and iOS. Microsoft Authenticator can serve as a traditional MFA factor (one-time passcodes, push notification) and when your organization is ready for Password-less, the Microsoft Authenticator app can be used to sign in to Microsoft Entra ID without a password.

## Action plan

1. Ensure that notification through mobile app and/or verification code from mobile app are available to users as authentication methods. How to Configure Verification Options

2. Educate users on how to add a work or school account. 

## Next steps

- [Review the Microsoft Entra recommendations overview](overview-recommendations.md)
- [Learn how to use Microsoft Entra recommendations](howto-use-recommendations.md)
- [Explore the Microsoft Graph API properties for recommendations](/graph/api/resources/recommendation)
