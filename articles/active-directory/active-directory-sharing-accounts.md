<properties
	pageTitle="Sharing accounts using Azure AD |  Microsoft Azure"
	description="Describes how Azure Active Directory enables organizations to securely share accounts for on-premises apps and consumer cloud services."
	services="active-directory"
	documentationCenter=""
	authors="msStevenPo"
 	manager="stevenpo"
	editor=""/>

 <tags
	ms.service="active-directory"
 	ms.workload="identity"
 	ms.tgt_pltfrm="na"
 	ms.devlang="na"
 	ms.topic="article"
 	ms.date="02/09/2016"  
 	ms.author="stevenpo"/>

# Sharing accounts with Azure AD

## Overview
Sometimes organizations need to use a single username and password for multiple people. This typically happens in two cases:

- When accessing applications that require a unique login and password for each user, whether on-premises apps or consumer cloud services ( e.g. corporate social media accounts).
- When creating multi-user environments. You may have a single, local account that has elevated privileges and can be used to do core setup, administration, and recovery activities (e.g. the local "global administrator" account for Office 365 or the root account in Salesforce).

Traditionally, these accounts would be shared by distributing the credentials (username/password) to the right individuals or storing them in a shared location where multiple trusted agents can access them.

The traditional sharing model has several drawbacks:

- Enabling access to new applications requires you to distribute credentials to everyone that needs access.
- Each shared application may require its own unique set of shared credentials, requiring users to remember multiple sets of credentials. When users have to remember many credentials, the risk increases that they will resort to risky practices. (e.g. writing down passwords).
- You can't tell who has access to an application.
- You can't tell who has *accessed* an application.
- When you need to remove access to an application, you have to update the credentials and re-distribute them to everyone that needs access to that application.

## Azure Active Directory account sharing

Azure AD provides a new approach to using shared accounts that eliminates these drawbacks.

The Azure AD administrator configures which applications a user can access by using the Access Panel and choosing the type of single sign-on best suited for that application. One of those types, *password-based single-sign on*, lets Azure AD act as a kind of "broker" during the sign-on process for that app.

Users log in once with their organizational account. This is the same account that they regularly use to access their desktop or email. They can discover and access only those applications that they are assigned to. With shared accounts, this list of applications can include any number of shared credentials. The end user doesn't need to remember or write down the various accounts they may be using.

Shared accounts not only increase oversight and improve usability, they also enhance your security. Users with permissions to use the credentials don't see the shared password, but rather get permissions to use the password as part of an orchestrated authentication flow. Further, with some password SSO applications, you have the option to have Azure AD periodically rollover (update) the password using large, complex passwords, increasing the account security. The administrator can easily grant or revoke access to an application and also know who has access to the account and who accessed it in the past.

Azure AD supports shared accounts for any Enterprise Mobility Suite (EMS), Premium, or Basic licensed users, across all types of password single sign on applications. You can share accounts for any of thousands of pre-integrated applications in the application gallery and can add your own password-authenticating application with [custom SSO apps](active-directory-sso-integrate-saas-apps.md).

Azure AD features that enable account sharing include:

- [Password single sign-on](active-directory-appssoaccess-whatis.md#password-based-single-sign-on)
- Password single sign-on agent
- [Group assignment](active-directory-accessmanagement-self-service-group-management.md)
- Custom Password apps
- [App usage dashboard/reports](active-directory-passwords-get-insights.md)
- End user access portals
- [App proxy](active-directory-application-proxy-get-started.md)
- [Active Directory Marketplace](https://azure.microsoft.com/marketplace/active-directory/all/)

## Sharing an account
To use Azure AD to share an account you will need to:

- Add an application [app gallery](https://azure.microsoft.com/marketplace/active-directory/) or [custom application](http://blogs.technet.com/b/ad/archive/2015/06/17/bring-your-own-app-with-azure-ad-self-service-saml-configuration-gt-now-in-preview.aspx)
- Configure the application for password Single Sign-On (SSO)
- Use [group based assignment](active-directory-accessmanagement-group-saasapps.md) and select the option to enter a shared credential
- Optional: in some applications, such as Facebook, Twitter, or LinkedIn, you can enable the option for [Azure AD automated password roll-over](http://blogs.technet.com/b/ad/archive/2015/02/20/azure-ad-automated-password-roll-over-for-facebook-twitter-and-linkedin-now-in-preview.aspx)

You can also make your shared account more secure with Multi-Factor Authentication (MFA) (learn more about [securing applications with Azure AD](../multi-factor-authentication/multi-factor-authentication-get-started.md)) and you can delegate the ability to manage who has access to the application using [Azure AD Self-service](active-directory-accessmanagement-self-service-group-management.md) Group Management.

## Related articles

- [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
- [Protecting apps with conditional access](active-directory-conditional-access.md)
- [Self-service group management/SSAA](active-directory-accessmanagement-self-service-group-management.md)
