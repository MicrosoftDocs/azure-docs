---
title: MFA or 2FA and Privileged Identity Management - Azure AD | Microsoft Docs
description: Learn how Azure AD Privileged Identity Management (PIM) validates multi-factor authentication (MFA).
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman
editor: ''

ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.subservice: pim
ms.date: 11/08/2019
ms.author: curtand
ms.custom: pim
ms.collection: M365-identity-device-management
---
# Multi-factor authentication and Privileged Identity Management

We recommend that you require multi-factor authentication (MFA) for all your administrators. This reduces the risk of an attack due to a compromised password.

You can require that users complete a multi-factor authentication challenge when they sign in. You can also require that users complete a multi-factor authentication challenge when they activate a role in Azure Active Directory (Azure AD) Privileged Identity Management (PIM). This way, if the user didn't complete a multi-factor authentication challenge when they signed in, they will be prompted to do so by Privileged Identity Management.

> [!IMPORTANT]
> Right now, Azure Multi-Factor Authentication only works with work or school accounts, not Microsoft personal accounts (usually a personal account that's used to sign in to Microsoft services such as Skype, Xbox, or Outlook.com). Because of this, anyone using a personal account can't be an eligible administrator because they can't use multi-factor authentication to activate their roles. If these users need to continue managing workloads using a Microsoft account, elevate them to permanent administrators for now.

## How PIM validates MFA

There are two options for validating multi-factor authentication when a user activates a role.

The simplest option is to rely on Azure Multi-Factor Authentication for users who are activating a privileged role. To do this, first check that those users are licensed, if necessary, and have registered for Azure Multi-Factor Authentication. For more information about how to deploy Azure Multi-Factor Authentication, see [Deploy cloud-based Azure Multi-Factor Authentication](../authentication/howto-mfa-getstarted.md). It is recommended, but not required, that you configure Azure AD to enforce multi-factor authentication for these users when they sign in. This is because the multi-factor authentication checks will be made by Privileged Identity Management itself.

Alternatively, if users authenticate on-premises you can have your identity provider be responsible for multi-factor authentication. For example, if you have configured AD Federation Services to require smartcard-based authentication before accessing Azure AD, [Securing cloud resources with Azure Multi-Factor Authentication and AD FS](../authentication/howto-mfa-adfs.md) includes instructions for configuring AD FS to send claims to Azure AD. When a user tries to activate a role, Privileged Identity Management will accept that multi-factor authentication has already been validated for the user once it receives the appropriate claims.

## Next steps

- [Configure Azure AD role settings in Privileged Identity Management](pim-how-to-change-default-settings.md)
- [Configure Azure resource role settings in Privileged Identity Management](pim-resource-roles-configure-role-settings.md)
