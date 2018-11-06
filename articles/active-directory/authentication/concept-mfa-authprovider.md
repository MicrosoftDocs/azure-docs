---
title: When and how to use an Azure Multi-Factor Auth Provider?
description: When should you use an Auth Provider with Azure MFA?

services: multi-factor-authentication
ms.service: active-directory
ms.component: authentication
ms.topic: conceptual
ms.date: 09/06/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: mtillman
ms.reviewer: michmcla

---
# When to use an Azure Multi-Factor Authentication Provider

Two-step verification is available by default for global administrators who have Azure Active Directory, and Office 365 users. However, if you wish to take advantage of [advanced features](howto-mfa-mfasettings.md) then you should purchase the full version of Azure Multi-Factor Authentication (MFA).

An Azure Multi-Factor Auth Provider is used to take advantage of features provided by Azure Multi-Factor Authentication for users who **do not have licenses**.

If you have licenses that cover all of the users in your organization, then you do not need an Azure Multi-Factor Auth Provider. Create an Azure Multi-Factor Authentication Provider only if you also need to provide two-step verification for some users that don't have licenses.

> [!NOTE]
> Effective September 1st, 2018 new auth providers may no longer be created. Existing auth providers may continue to be used and updated. Multi-factor authentication will continue to be an available feature in Azure AD Premium licenses.

## Caveats related to the Azure MFA SDK

An Azure Multi-Factor Auth provider is required to download the SDK. Note the SDK has been deprecated and is no longer supported for new customers and will only continue to work until November 14, 2018. After that time, calls to the SDK will fail.

To download the SDK, create an Azure Multi-Factor Auth Provider even if you have Azure MFA, AAD Premium, or other bundled licenses. If you create an Azure Multi-Factor Auth Provider for this purpose and already have licenses, be sure to create the Provider with the **Per Enabled User** model. Then, link the Provider to the directory that contains the Azure MFA, Azure AD Premium, or other bundled licenses. This configuration ensures that you are only billed if you have more unique users performing two-step verification than the number of licenses you own.

## What is an MFA Provider?

There are two types of Auth providers, and the distinction is around how your Azure subscription is charged. The per-authentication option calculates the number of authentications performed against your tenant in a month. This option is best if you have a number of users authenticating only occasionally. The per-user option calculates the number of individuals in your tenant who perform two-step verification in a month. This option is best if you have some users with licenses but need to extend MFA to more users beyond your licensing limits.

## Manage your MFA Provider

You cannot change the usage model (per enabled user or per authentication) after an MFA provider is created.

If you purchased enough licenses to cover all users that are enabled for MFA, you can delete the MFA provider altogether.

If your MFA provider is not linked to an Azure AD tenant, or you link the new MFA provider to a different Azure AD tenant, user settings and configuration options are not transferred. Also, existing Azure MFA Servers need to be reactivated using activation credentials generated through the MFA Provider. Reactivating the MFA Servers to link them to the MFA Provider doesn't impact phone call and text message authentication, but mobile app notifications stop working for all users until they reactivate the mobile app.

## Next steps

[Configure Multi-Factor Authentication settings](howto-mfa-mfasettings.md)
