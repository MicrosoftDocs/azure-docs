---
title: Azure Active Directory recommendation - Migrate to Microsoft authenticator | Microsoft Docs
description: Learn why you should migrate your users to the Microsoft authenticator app in Azure AD.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''

ms.assetid: 9b88958d-94a2-4f4b-a18c-616f0617a24e
ms.service: active-directory
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: report-monitor
ms.date: 08/26/2022
ms.author: billmath
ms.reviewer: hafowler

ms.collection: M365-identity-device-management
---

# Azure AD recommendation: Migrate to Microsoft authenticator 

[Azure AD recommendations](overview-recommendations.md) is a feature that provides you with personalized insights and actionable guidance to align your tenant with recommended best practices.

This article covers the recommendation to migrate users to authenticator. 


## Description

Multi-factor authentication (MFA) is a key component to improve the security posture of your Azure AD tenant. However, while keeping your tenant safe is important, you should also keep an eye on keeping the security related overhead as little as possible on your users.

One possibility to accomplish this goal is to migrate users using SMS or voice call for MFA to use the Microsoft authenticator app.


## Logic 

If Azure AD detects that your tenant has users authenticating using SMS or voice in the past week instead of the authenticator app, this recommendation shows up.

## Value 

- Push notifications through the Microsoft authenticator app provide the least intrusive MFA experience for users. This is the most reliable and secure option because it relies on a data connection rather than telephony.
- Verification code option using Microsoft authenticator app enables MFA even in isolated environments without data or cellular signals where SMS and Voice calls would not work.
- The Microsoft authenticator app is available for Android and iOS.
- Pathway to passwordless: Authenticator can be a traditional MFA factor (one-time passcodes, push notification) and when your organization is ready for Password-less, the authenticator app can be used sign-into Azure AD without a password.

## Action plan

1.	Ensure that notification through mobile app and/or verification code from mobile app are available to users as authentication methods. How to Configure Verification Options

2.	Educate users on how to add a work or school account. 



 

## Next steps

- [Tutorials for integrating SaaS applications with Azure Active Directory](../saas-apps/tutorial-list.md)
- [Azure AD reports overview](overview-reports.md)
