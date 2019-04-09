---
title: Multi-factor authentication (MFA) and PIM - Azure Active Directory | Microsoft Docs
description: Learn how Azure AD Privileged Identity Management (PIM) validates multi-factor authentication (MFA).
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
editor: ''

ms.service: active-directory
ms.topic: conceptual
ms.workload: identity
ms.subservice: pim
ms.date: 08/31/2018
ms.author: rolyon
ms.custom: pim
ms.collection: M365-identity-device-management
---
# Multi-factor authentication (MFA) and PIM

We recommend that you require multi-factor authentication (MFA) for all your administrators. This reduces the risk of an attack due to a compromised password.

You can require that users complete an MFA challenge when they sign in. You can also require that users complete an MFA challenge when they activate a role in Azure Active Directory (Azure AD) Privileged Identity Management (PIM). This way, if the user didn't complete an MFA challenge when they signed in, they will be prompted to do so by PIM.

> [!IMPORTANT]
> Right now, Azure MFA only works with work or school accounts, not Microsoft accounts (usually a personal account that's used to sign in to Microsoft services like Skype, Xbox, Outlook.com, etc.). Because of this, anyone using a Microsoft account can't be an eligible administrator because they can't use MFA to activate their roles. If these users need to continue managing workloads using a Microsoft account, elevate them to permanent administrators for now.

## How PIM validates MFA

There are two options for validating MFA when a user activates a role.

The simplest option is to rely on Azure MFA for users who are activating a privileged role. To do this, first check that those users are licensed, if necessary, and have registered for Azure MFA. For more information about how to deploy Azure MFA, see [Deploy cloud-based Azure Multi-Factor Authentication](../authentication/howto-mfa-getstarted.md). It is recommended, but not required, that you configure Azure AD to enforce MFA for these users when they sign in. This is because the MFA checks will be made by PIM itself.

Alternatively, if users authenticate on-premises you can have your identity provider be responsible for MFA. For example, if you have configured AD Federation Services to require smartcard-based authentication before accessing Azure AD, [Securing cloud resources with Azure Multi-Factor Authentication and AD FS](../authentication/howto-mfa-adfs.md) includes instructions for configuring AD FS to send claims to Azure AD. When a user tries to activate a role, PIM will accept that MFA has already been validated for the user once it receives the appropriate claims.

## Next steps

- [Configure Azure AD role settings in PIM](pim-how-to-change-default-settings.md)
- [Configure Azure resource role settings in PIM](pim-resource-roles-configure-role-settings.md)
