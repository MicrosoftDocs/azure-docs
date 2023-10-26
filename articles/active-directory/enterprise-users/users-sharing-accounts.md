---
title: Sharing accounts and credentials
description: Describes how Microsoft Entra ID enables organizations to securely share accounts for on-premises apps and consumer cloud services.
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
editor: ''
ms.service: active-directory
ms.subservice: enterprise-users
ms.workload: identity
ms.topic: how-to
ms.date: 06/24/2022
ms.author: barclayn
ms.reviewer: krbain
ms.custom: it-pro

ms.collection: M365-identity-device-management
---
# Sharing accounts with Microsoft Entra ID

## Overview

In Microsoft Entra ID, part of Microsoft Entra, sometimes organizations need to use a single username and password for multiple people, which often happens in the following cases:

* When accessing applications that require a unique sign in and password for each user, whether on-premises apps or consumer cloud services (for example, corporate social media accounts).
* When creating multi-user environments. You might have a single, local account that has elevated privileges and is used to do core setup, administration, and recovery activities. For example, the local Global Administrator account for Microsoft 365 or the root account in Salesforce.

Traditionally, these accounts are shared by distributing the credentials (username and password) to the right individuals or storing them in a shared location where multiple trusted agents can access them.

The traditional sharing model has several drawbacks:

* Enabling access to new applications requires you to distribute credentials to everyone that needs access.
* Each shared application may require its own unique set of shared credentials, requiring users to remember multiple sets of credentials. When users have to remember many credentials, the risk increases that they resort to risky practices. (for example, writing down passwords).
* You can't tell who has access to an application.
* You can't tell who has *accessed* an application.
* When you want to remove access to an application, you have to update the credentials and redistribute them to everyone that needs access to that application.

<a name='azure-active-directory-account-sharing'></a>

## Microsoft Entra account sharing

Microsoft Entra ID provides a new approach to using shared accounts that eliminates these drawbacks.

The Microsoft Entra administrator configures which applications a user can access by using the Access Panel and choosing the type of single sign-on best suited for that application. One of those types, *password-based single-sign on*, lets Microsoft Entra ID act as a kind of "broker" during the sign-on process for that app.

Users sign in once with their organizational account. This account is the same one they regularly use to access their desktop or email. They can discover and access only those applications that they are assigned to. With shared accounts, this list of applications can include any number of shared credentials. The end-user doesn't need to remember or write down the various accounts they might be using.

Shared accounts not only increase oversight and improve usability, they also enhance your security. Users with permissions to use the credentials don't see the shared password, but rather get permissions to use the password as part of an orchestrated authentication flow. Further, some password SSO applications give you the option of using Microsoft Entra ID to periodically rollover (update) passwords. The system uses large, complex passwords, which increases account security. The administrator can easily grant or revoke access to an application, knows who has access to the account, and who has accessed it in the past.

Microsoft Entra ID supports shared accounts for any Enterprise Mobility Suite (EMS) or Microsoft Entra ID P1 or P2 license plan, across all types of password single sign-on applications. You can share accounts for any of thousands of pre-integrated applications in the application gallery and can add your own password-authenticating application with [custom SSO apps](../manage-apps/what-is-single-sign-on.md).

Microsoft Entra features that enable account sharing include:

* [Password single sign-on](../manage-apps/plan-sso-deployment.md#single-sign-on-options)
* Password single sign-on agent
* [Group assignment](groups-self-service-management.md)
* Custom Password apps
* [App usage dashboard/reports](../authentication/howto-sspr-reporting.md)
* End-user access portals
* [App proxy](../app-proxy/application-proxy.md)
* [Active Directory Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/Microsoft.AzureActiveDirectory)

## Sharing an account

To use Microsoft Entra ID to share an account, you need to:

* Add an application [app gallery](https://azuremarketplace.microsoft.com/marketplace/apps/Microsoft.AzureActiveDirectory) or [custom application](https://cloudblogs.microsoft.com/enterprisemobility/2015/06/17/bring-your-own-app-with-azure-ad-self-service-saml-configuration-now-in-preview/)
* Configure the application for password Single Sign-On (SSO)
* Use [group-based assignment](groups-saasapps.md) and select the option to enter a shared credential

You can also make your shared account more secure with Multi-Factor Authentication (MFA) (learn more about [securing applications with Microsoft Entra ID](../authentication/concept-mfa-howitworks.md)) and you can delegate the ability to manage who has access to the application using [Microsoft Entra self-service](groups-self-service-management.md) group management.

## Next steps

* [Application Management in Microsoft Entra ID](../manage-apps/what-is-application-management.md)
* [Protecting apps with Conditional Access](/azure/active-directory-b2c/overview)
* [Self-service group management/SSAA](groups-self-service-management.md)
