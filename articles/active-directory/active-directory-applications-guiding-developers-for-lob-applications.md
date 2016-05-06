<properties
	pageTitle="Azure AD and Applications: Guiding Developers | Microsoft Azure"
	description="Written for the IT Pro, this article provides guidelines for integrating Azure applications with Active Directory."
	services="active-directory"
	documentationCenter=""
	authors="kgremban"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="02/09/2016"
	ms.author="kgremban"/>

# Azure AD and applications: Guiding developers

## Overview

This guide provides an overview of developing line of business (LoB) applications for Azure Active Directory (AD) and is specifically written for Active Directory/Office 365 global administrators.

Building applications integrated with Azure AD gives users in your organization single sign-on with Office 365. Having the application in Azure AD gives you control over the authentication policy set for the application. To learn more about conditional access and how to protect apps with multi-factor authentication (MFA) see the following document: [Configuring access rules](active-directory-conditional-access-azuread-connected-apps.md).

Your application needs to be registered in order to use Azure Active Directory. Registering the application allows developers in your organization to authenticate the members of your organization using Azure AD and request access to their user resources such as email, calendar, documents, etc.

Any member of your directory (not guests) can register an application, otherwise known as *creating an application object*.

Registering an application allows any user to do the following:

- Get an identity for their application that Azure AD recognizes
- Get one or more secrets/keys that the application can use to authenticate itself to AD
- Brand the application with a name, logo, etc. in the Azure portal
- Leverage Azure AD authorization features for their app
  - Application role based access control (RBAC)
  - Azure Active Directory as oAuth authorization server (secure an API exposed by the application)

- Declare required permissions necessary for the application to function as expected. They include:
	  - App permissions (global administrators only). For example:
	    - Role membership in another Azure AD application or role membership relative to an Azure Resource, Resource Group or Subscription
	  - Delegated permissions (any user). For example:
	    - (Azure AD) Sign-in and Read Profile
	    - (Exchange) Read Mail, Send Mail
	    - (SharePoint) Read

> [AZURE.NOTE]By default, any member can register an application. To learn how to restrict permissions for registering applications to specific members, please refer to the document [How applications are added to Azure AD](active-directory-how-applications-are-added.md#who-has-permission-to-add-applications-to-my-azure-ad-instance).

Here’s what you, the global administrator, will need to do to help developers make their application ready for production:

- Configure Access Rules (access policy/MFA)
- Configure the app to require user assignment and assign users
- Suppress the default user consent experience

## Configuring access rules

As we mentioned earlier please refer to the following article to learn more about configuring access rules for any application.

[Configuring access rules](active-directory-conditional-access-azuread-connected-apps.md).

## Configure the app to require user assignment and assign users

By default, user assignment is not required in order for them to access an application. However, if the application exposes roles or if you want the application to appear on a user’s access panel, you should require user assignment, and assign users and or groups.

[Requiring user assignment](active-directory-applications-guiding-developers-requiring-user-assignment.md)

If you’re an Azure AD Premium or Enterprise Mobility Suite (EMS) subscriber, we strongly recommend leveraging groups. Assigning groups to the application allows you to delegate ongoing access management to the owner of the group. You can create the group or ask the responsible party in your organization to create the group using your group management facility.

[Assigning users to an application](active-directory-applications-guiding-developers-assigning-users.md)  
[Assigning groups to an application](active-directory-applications-guiding-developers-assigning-groups.md)

## Suppressing user consent

By default, the user will need to consent to the permission that’s required in order to sign in. The consent experience, being asked to grant to permissions to an application, can be disconcerting for users who are unfamiliar with needing to make such a decision.

For applications that you trust, it’s possible for you to consent to application on behalf of all of the users in your organization.

For more information about user consent and the consent experience in Azure, see [Integrating Applications with Azure Active Directory](active-directory-integrating-applications.md).

##Related Articles

- [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
