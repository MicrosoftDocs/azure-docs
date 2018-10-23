---
title: Manage user consent to an application - Azure Active Directory | Microsoft Docs
description: How to grant permissions to your custom-developed application using the Azure Active Directory (Azure AD )portal or a URL parameter.
services: active-directory
documentationcenter: ''
author: CelesteDG
manager: mtillman

ms.assetid: 
ms.service: active-directory
ms.component: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 10/22/2018
ms.author: celested

---

# Manage the way users consent to an application in Azure Active Directory
Learn how to manage the way end-users consent to an application with Azure Active Directory (Azure Ad). 

## Concepts 

When a user accesses an application for the first time, the application prompts the user with the terms of use. The user consents to these terms. For an organization that is managing many applications, the administrators have already reviewed the terms of use as part of their process of approving the application. 

To simplify the end-user experience, an admin can consent to an application on behalf of all end-users. Admin consent allows end-users in your tenant to access the application without being prompted to provide user consent. This simplifies the end-user experience the first time users access the application.


## Prerequisites

Granting admin consent requires you to sign-in as global administrator, an application administrator, or a cloud application administrator.

You can grant admin consent to an application if:

- The application is registered in your tenant, or
- The application is registered in another Azure AD tenant, and at least one end-user has accessed the application. Once an application registered to another Azure AD tenant has been accessed, it appears in the list of enterprise apps. 

## Grant admin consent through the Azure portal

To grant admin consent to an application:

1. Sign in to the [Azure portal](https://portal.azure.com) as a global administrator, an application administrator, or a cloud application administrator.
2. Click **All services** at the top of the left-hand navigation menu. The **Azure Active Directory Extension** opens.
3. In the filter search box, type **"Azure Active Directory"** and select the **Azure Active Directory** item.
4. From the navigation menu, click **Enterprise applications**.
5. Click **Grant Admin Consent**. You will be prompted to sign in to administrate the application.
6. Sign in with an account that has permissions to consent on behalf of the entire organization. 
7. Consent to the application permissions.

Optionally, to perform admin consent when registering an app: 

1. Sign in to the [Azure portal](https://portal.azure.com) as a global administrator.
2. Navigate to the **App Registrations** blade.
3. Select the application for the consent.
4. Select **Required Permissions**.
5. Click **Grant Permissions** at the top of the blade.


## Grant admin consent through a URL request

To grant admin consent through a URL request:

1. Construct a request to *login.microsoftonline.com* with your app configs and append on *&prompt=admin\_consent*. 
2. After signing in with admin credentials, the app has been granted consent for all users.


## Force user consent through a URL request

* Append onto auth requests *&prompt=consent* which require end users to consent each time they authenticate.

## Next steps

[Consent and Integrating Apps to AzureAD](active-directory-integrating-applications.md)

[Consent and Permissioning for AzureAD v2.0 converged Apps](active-directory-v2-scopes.md)

[AzureAD StackOverflow](http://stackoverflow.com/questions/tagged/azure-active-directory)
