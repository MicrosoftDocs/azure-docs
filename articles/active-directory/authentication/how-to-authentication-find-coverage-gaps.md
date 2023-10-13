---
title: Find and address gaps in strong authentication coverage for your administrators in Microsoft Entra ID 
description: Learn how to find and address gaps in strong authentication coverage for your administrators in Microsoft Entra ID

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 02/22/2022

ms.author: justinha
author: inbarckMS 
manager: amycolannino
ms.reviewer: inbarc

ms.collection: M365-identity-device-management
---
# Find and address gaps in strong authentication coverage for your administrators

Requiring multifactor authentication (MFA) for the administrators in your tenant is one of the first steps you can take to increase the security of your tenant. In this article, we'll cover how to make sure all of your administrators are covered by multifactor authentication.

<a name='detect-current-usage-for-azure-ad-built-in-administrator-roles'></a>

## Detect current usage for Microsoft Entra Built-in administrator roles

The [Microsoft Entra ID Secure Score](../reports-monitoring/concept-identity-secure-score.md) provides a score for **Require MFA for administrative roles** in your tenant. This improvement action tracks the MFA usage of Global administrator, Security administrator, Exchange administrator, and SharePoint administrator. 

There are different ways to check if your admins are covered by an MFA policy. 

- To troubleshoot sign-in for a specific administrator, you can use the sign-in logs. The sign-in logs let you filter **Authentication requirement** for specific users. Any sign-in where **Authentication requirement** is **Single-factor authentication** means there was no multifactor authentication policy that was required for the sign-in.

  ![Screenshot of the sign-in log.](./media/how-to-authentication-find-coverage-gaps/auth-requirement.png)

  When viewing the details of a specific sign-in, select the **Authentication details** tab for details about the MFA requirements. For more information, see [Sign-in log activity details](../reports-monitoring/concept-sign-in-log-activity-details.md).
  
  ![Screenshot of the authentication activity details.](./media/how-to-authentication-find-coverage-gaps/details.png)

- To choose which policy to enable based on your user licenses, we have a new MFA enablement wizard to help you [compare MFA policies](concept-mfa-licensing.md#compare-multi-factor-authentication-policies) and see which steps are right for your organization. The wizard shows administrators who were protected by MFA in the last 30 days.

  ![Screenshot of the multifactor authentication enablement wizard.](./media/how-to-authentication-find-coverage-gaps/wizard.png)

- You can run [this script](https://github.com/microsoft/AzureADToolkit/blob/main/src/Find-AADToolkitUnprotectedUsersWithAdminRoles.ps1) to programmatically generate a report of all users with directory role assignments who have signed in with or without MFA in the last 30 days. This script will enumerate all active built-in and custom role assignments, all eligible built-in and custom role assignments, and groups with roles assigned.

## Enforce multifactor authentication on your administrators

If you find administrators who aren't protected by multifactor authentication, you can protect them in one of the following ways:

- If your administrators are licensed for Microsoft Entra ID P1 or P2, you can [create a Conditional Access policy](tutorial-enable-azure-mfa.md) to enforce MFA for administrators. You can also update this policy to require MFA from users who are in custom roles.  

- Run the [MFA enablement wizard](https://aka.ms/MFASetupGuide) to choose your MFA policy.

- If you assign custom or built-in admin roles in [Privileged Identity Management](../privileged-identity-management/pim-configure.md), require multifactor authentication upon role activation.

## Use Passwordless and phishing resistant authentication methods for your administrators

After your admins are enforced for multifactor authentication and have been using it for a while, it is time to raise the bar on strong authentication and use Passwordless and phishing resistant authentication method: 

- [Phone Sign-in (with Microsoft Authenticator)](concept-authentication-authenticator-app.md)
- [FIDO2](concept-authentication-passwordless.md#fido2-security-keys)
- [Windows Hello for Business](/windows/security/identity-protection/hello-for-business/)

You can read more about these authentication methods and their security considerations in [Microsoft Entra authentication methods](concept-authentication-methods.md).

## Next steps

[Enable passwordless sign-in with Microsoft Authenticator](howto-authentication-passwordless-phone.md)
