---
title: Find and address gaps in strong authentication coverage for your administrators in Azure Active Directory 
description: Learn how to find and address gaps in strong authentication coverage for your administrators in Azure Active Directory

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 10/25/2021

ms.author: justinha
author: inbarckMS 
manager: daveba
ms.reviewer: inbarc

ms.collection: M365-identity-device-management
---
# Find and address gaps in strong authentication coverage for your administrators

Requiring multi-factor authentication (MFA) for the administrators in your tenant is one of the first steps you can take to increase the security of your tenant. In this article, we will cover how you can ensure all your administrators are covered by multi-factor authentication.

## Detect current usage for Azure AD Built-in administrator roles

The [Azure AD Secure Score](../fundamentals/identity-secure-score.md) provides a score for **Require MFA for administrative roles** in your tenant. This improvement action tracks the MFA usage of Global administrator, Security administrator, Exchange administrator, and SharePoint administrator. 

There are different ways to check if your admins are covered by an MFA policies. 

- To troubleshoot sign-in for a specific administrator, you can use the sign-in logs. The sign-in logs let you filter **Authentication requirement** for specific users. Any sign-in where **Authentication requirement** is **Single-factor authentication** means there was no multi-factor authentication policy that was required for the sign-in.

  ![Screenshot of the sign-in log.](./media/how-to-authentication-find-coverage-gaps/auth-requirement.png)

  Click **Authentication details** for [details about the MFA requirements](../reports-monitoring/concept-sign-ins.md#authentication-details).
  
  ![Screenshot of the authentication activity details.](./media/how-to-authentication-find-coverage-gaps/details.png)

- To choose which policy to enable based on your user licenses, We have a new MFA enablement wizard to help you [compare MFA policies](concept-mfa-licensing.md#compare-multi-factor-authentication-policies) and see which steps are right for your organization. 

  ![Screenshot of the Multi-factor authentication enablement wizard.](./media/how-to-authentication-find-coverage-gaps/wizard.png)

- To programmatically report for your tenant, you can run a [PowerShell script](https://github.com/microsoft/AzureADToolkit/blob/main/src/Find-UnprotectedUsersWithAdminRoles.ps1) to find all users with an active built-in or custom administrator role, and who is eligible for built-in and custom roles in Privileged Identity Management. The script then checks the sign-ins of these users and reports and users who do not have **Multi-factor authentication** for **Authentication requirement**.

## Enforce multi-factor authentication on your administrators

Based on gaps you found, require administrators to use multi-factor authentication in one of the following ways:

- If your administrators are licensed for Azure AD Premium, you can create a Conditional Access policy to enforce MFA for administrators. You can also update this policy to require MFA from users who are in custom roles.  

- Run the MFA enablement wizard to choose your MFA policy.

- If you assign custom or built-in admin roles in Privileged Identity Management, require multi-factor authentication upon role activation.

## Use Passwordless and phishing resistant authentication methods for your administrators

After your admins are enforced for multi-factor authentication and have been using it for a while, it is time to raise the bar on strong authentication and use Passwordless and phishing resistant authentication method: 

- [Phone Sign-in (with Microsoft Authenticator)](concept-authentication-authenticator-app.md)
- [FIDO2](concept-authentication-passwordless.md#fido2-security-keys)
- [Windows Hello for Business](/windows/security/identity-protection/hello-for-business/hello-overview.md)

You can read more about these authentication methods and their security considerations in [Azure AD authentication methods](concept-authentication-methods.md).


