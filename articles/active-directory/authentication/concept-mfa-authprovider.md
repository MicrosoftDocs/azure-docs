---
title: When and how to use an Azure Multi-Factor Auth Provider? - Azure Active Directory
description: When should you use an Auth Provider with Azure MFA?

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 11/27/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: michmcla

ms.collection: M365-identity-device-management
---
# When to use an Azure Multi-Factor Authentication Provider

Two-step verification is available by default for global administrators who have Azure Active Directory, and Office 365 users. However, if you wish to take advantage of [advanced features](howto-mfa-mfasettings.md) then you should purchase the full version of Azure Multi-Factor Authentication (MFA).

An Azure Multi-Factor Auth Provider is used to take advantage of features provided by Azure Multi-Factor Authentication for users who **do not have licenses**.

> [!NOTE]
> Effective September 1st, 2018 new auth providers may no longer be created. Existing auth providers may continue to be used and updated, but migration is no longer possible. Multi-factor authentication will continue to be available as a feature in Azure AD Premium licenses.

## Caveats related to the Azure MFA SDK

Note the SDK has been deprecated and will only continue to work until November 14, 2018. After that time, calls to the SDK will fail.

## What is an MFA Provider?

There are two types of Auth providers, and the distinction is around how your Azure subscription is charged. The per-authentication option calculates the number of authentications performed against your tenant in a month. This option is best if you have a number of users authenticating only occasionally. The per-user option calculates the number of individuals in your tenant who perform two-step verification in a month. This option is best if you have some users with licenses but need to extend MFA to more users beyond your licensing limits.

## Manage your MFA Provider

You cannot change the usage model (per enabled user or per authentication) after an MFA provider is created.

If you purchased enough licenses to cover all users that are enabled for MFA, you can delete the MFA provider altogether.

If your MFA provider is not linked to an Azure AD tenant, or you link the new MFA provider to a different Azure AD tenant, user settings and configuration options are not transferred. Also, existing Azure MFA Servers need to be reactivated using activation credentials generated through the MFA Provider. Reactivating the MFA Servers to link them to the MFA Provider doesn't impact phone call and text message authentication, but mobile app notifications stop working for all users until they reactivate the mobile app.

## Next steps

[Configure Multi-Factor Authentication settings](howto-mfa-mfasettings.md)
