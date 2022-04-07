---
title: Enable or disable security defaults in Azure AD
description: Enable security defaults to protect organizations from common attacks in Azure AD

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 04/07/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: karenhoran
ms.reviewer: lvandenende

ms.collection: M365-identity-device-management

ms.custom: contperf-fy20q4
---
# How to: Enable security defaults in Azure AD

Security defaults make it easier to help protect organizations from common attacks with preconfigured security settings:

- Requiring all users to register for Azure AD Multi-Factor Authentication.
- Requiring administrators to do multi-factor authentication.
- Blocking legacy authentication protocols.
- Requiring users to do multi-factor authentication when necessary.
- Protecting privileged activities like access to the Azure portal.

For more information about these settings, see the article [Security defaults in Azure AD](concept-fundamentals-security-defaults.md).

Microsoft is making security defaults available to everyone. The goal is to ensure that all organizations have a basic level of security enabled at no extra cost. You turn on security defaults in the Azure portal. If your tenant was created on or after October 22, 2019, security defaults may be enabled in your tenant. To protect all of our users, security defaults are being rolled out to new tenants at creation.

## Backup administrator accounts

Every organization should have at least two backup administrator accounts configured. We call these emergency access accounts.

These accounts may be used in scenarios where your normal administrator accounts can't be used. For example: The person with the most recent Global Administrator access has left the organization. Azure AD prevents the last Global Administrator account from being deleted, but it doesn't prevent the account from being deleted or disabled on-premises. Either situation might make the organization unable to recover the account.

Emergency access accounts are:

- Assigned Global Administrator rights in Azure AD
- Aren't used on a daily basis
- Are protected with a long complex password
 
The credentials for these emergency access accounts should be stored offline in a secure location such as a fireproof safe. Only authorized individuals should have access to these credentials. 

To create an emergency access account: 

1. Sign in to the **Azure portal** as an existing Global Administrator.
1. Browse to **Azure Active Directory** > **Users**.
1. Select **New user**.
1. Select **Create user**.
1. Give the account a **User name**.
1. Give the account a **Name**.
1. Create a long and complex password for the account.
1. Under **Roles**, assign the **Global Administrator** role.
1. Under **Usage location**, select the appropriate location.
1. Select **Create**.

You may choose to [disable password expiration](../authentication/concept-sspr-policy.md#set-a-password-to-never-expire) for these accounts using Azure AD PowerShell.

For more detailed information about emergency access accounts, see the article [Manage emergency access accounts in Azure AD](../roles/security-emergency-access.md).

## Enabling security defaults

To enable security defaults in your directory:

1. Sign in to the [Azure portal](https://portal.azure.com) as a security administrator, Conditional Access administrator, or global administrator.
1. Browse to **Azure Active Directory** > **Properties**.
1. Select **Manage security defaults**.
1. Set the **Enable security defaults** toggle to **Yes**.
1. Select **Save**.

![Screenshot of the Azure portal with the toggle to enable security defaults](./media/concept-fundamentals-security-defaults/security-defaults-azure-ad-portal.png)

## Disabling security defaults

Organizations that choose to implement Conditional Access policies that replace security defaults must disable security defaults. 

![Warning message disable security defaults to enable Conditional Access](./media/concept-fundamentals-security-defaults/security-defaults-disable-before-conditional-access.png)

To disable security defaults in your directory:

1. Sign in to the [Azure portal](https://portal.azure.com) as a security administrator, Conditional Access administrator, or global administrator.
1. Browse to **Azure Active Directory** > **Properties**.
1. Select **Manage security defaults**.
1. Set the **Enable security defaults** toggle to **No**.
1. Select **Save**.

## Next steps

- [Security defaults in Azure AD](concept-fundamentals-security-defaults.md)
