---
title: Manage user consent to an application - Azure Active Directory | Microsoft Docs
description: Learn ways an admin can consent to an application on behalf of all end users, or force users to consent upon authentication. These methods apply to all end users in your Azure Active Directory (Azure AD) tenant. 
services: active-directory
author: barbkess
manager: mtillman

ms.service: active-directory
ms.component: app-mgmt
ms.workload: identity
ms.topic: conceptual
ms.date: 10/22/2018
ms.author: barbkess
ms.reviewer: arvindh
---

# Manage the way end-users consent to an application in Azure Active Directory
This article shows you how to control whether users see the consent prompt when they access an application.  These methods apply to all end users in your Azure Active Directory (Azure AD) tenant. 

For more information on application consent, see [Azure Active Directory consent framework](consent-framework.md).

## Prerequisites

Granting admin consent requires you to sign in as global administrator, an application administrator, or a cloud application administrator.

You can grant admin consent to an application if:

- The application is registered in your tenant, or
- The application is registered in another Azure AD tenant, and at least one end user has accessed the application. Once an application has been accessed, Azure AD lists the application under **Enterprise apps** in the [Azure portal](https://portal.azure.com).

## Grant admin consent through the Azure portal

To grant admin consent to an application:

1. Sign in to the [Azure portal](https://portal.azure.com) as a global administrator, an application administrator, or a cloud application administrator.
2. Click **All services** at the top of the left-hand navigation menu. The **Azure Active Directory Extension** opens.
3. In the filter search box, type **"Azure Active Directory"** and select the **Azure Active Directory** item.
4. From the navigation menu, click **Enterprise applications**.
5. Click **Grant Admin Consent**. You'll be prompted to sign in to administrate the application.
6. Sign in with an account that has permissions to grant admin consent for the application. 
7. Consent to the application permissions.

Optionally, to grant admin consent when registering an app: 

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

To require end users to consent to an application each time they authenticate, append `&prompt=consent` to the authentication request URL.

## Next steps

[Consent and Integrating Apps to AzureAD](quickstart-v1-integrate-apps-with-azure-ad.md)

[Consent and Permissioning for AzureAD v2.0 converged Apps](active-directory-v2-scopes.md)

[AzureAD StackOverflow](http://stackoverflow.com/questions/tagged/azure-active-directory)
