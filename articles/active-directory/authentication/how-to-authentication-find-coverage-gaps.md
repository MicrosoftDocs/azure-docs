---
title: Find and address gaps in strong authentication coverage for your administrators in Azure Active Directory 
description: Learn how to find and address gaps in strong authentication coverage for your administrators in Azure Active Directory

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 06/28/2021

ms.author: inbarckms
author: justinha
manager: daveba
ms.reviewer: inbarc

ms.collection: M365-identity-device-management
---
# Find and address gaps in strong authentication coverage for your administrators

Requiring multi-factor authentication (MFA) for the administrators in your tenant is the first step you can take to increase the security of your tenant. In this article we will cover how you can ensure all your administrators are covered by multi-factor authentication.

## Detect current usage for Azure AD Built-in administrator roles

The [Azure AD Secure Score](../fundamentals/identity-secure-score.md) provides a score for **Require MFA for administrative roles** in your tenant. This improvement action tracks the MFA usage of Global administrator, Security administrator, Exchange administrator, and SharePoint administrator role holders.   

If you want a more detailed report, we have created a [PowerShell script](https://github.com/microsoft/AzureADToolkit/blob/main/src/Find-UnprotectedUsersWithAdminRoles.ps1) you can run on your tenant to detect users with an active administrators' roles (built-in and custom roles), and users who are eligible for admin role in Privileged Identity Management (built-in and custom roles). The script then checks the sign-ins of these users to make sure they are all prompted by an authentication requirement of multi-factor authentication.

If you need to troubleshoot why a specific administrator is not covered by multi-factor authentication for some of their sign-ins, you can use the sign-in logs. The sign-in logs let you filter **Authentication requirement** for specific users. Any sign-in where **Authentication requirement** is **Single-factor authentication** means there was no multi-factor authentication policy that was required for the sign-in.

![Screenshot of the sign-in log.](./media/how-to-authentication-find-coverage-gaps/auth-requirement.png)

Click **Authentication details** for [details about the MFA requirements](../reports-monitoring/concept-sign-ins.md#authentication-details).

![Screenshot of the authentication activity details.](./media/how-to-authentication-find-coverage-gaps/details.png)

## Enforce multi-factor authentication on your administrators

Based on gaps you found, require administrators to use multi-factor authentication in one of the following ways:

- If your administrators are licensed for Azure AD Premium, you can create a Conditional Access policy to enforce MFA for administrators. You can also update this policy to require MFA from users who are in custom roles.  
- Not sure which policy you should enable based on your user licenses? We have a new Multi-factor enablement wizard that will help you compare the [different multi-factor authentication policies](concept-mfa-licensing.md#compare-multi-factor-authentication-policies) and determine the right steps for your organization. 
- If you assign eligible custom or built-in admin roles in Privileged Identity Management, require multi-factor authentication on role activation.

## Use Passwordless and phishing resistant authentication methods for your administrators

After your admins are enforced for multi-factor authentication and have been using it for a while, it is time to raise the bar on strong authentication and use Passwordless and phishing resistant authentication method: 

- Phone Sign-in (with Microsoft Authenticator) 
- FIDO2 
- Windows Hello for Business 

You can read more about these authentication methods and their security considerations in [Azure AD authentication methods](concept-authentication-methods.md).


