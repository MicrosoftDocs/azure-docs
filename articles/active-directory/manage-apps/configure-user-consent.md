---
title: Configure user consent to an application - Azure Active Directory | Microsoft Docs
description: Learn how to manage the way users consent to application permissions. You can simplify the user experience by granting admin consent. These methods apply to all end users in your Azure Active Directory (Azure AD) tenant. 
services: active-directory
author: msmimart
manager: CelesteDG

ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: conceptual
ms.date: 10/22/2018
ms.author: mimart
ms.reviewer: arvindh
ms.collection: M365-identity-device-management
---

# Configure the way end-users consent to an application in Azure Active Directory
Learn how to configure the way users consent to application permissions. You can simplify the user experience by granting admin consent. This article gives the different ways you can configure user consent. The methods apply to all end users in your Azure Active Directory (Azure AD) tenant. 

For more information on consenting to applications, see [Azure Active Directory consent framework](../develop/consent-framework.md).

## Prerequisites

Granting admin consent requires you to sign in as global administrator, an application administrator, or a cloud application administrator.

To restrict access to applications, you need to require user assignment and then assign users or groups to the application.  For more information, see [Methods for assigning users and groups](methods-for-assigning-users-and-groups.md).

## Grant admin consent to enterprise apps in the Azure portal

To grant admin consent to an enterprise app:

1. Sign in to the [Azure portal](https://portal.azure.com) as a global administrator, an application administrator, or a cloud application administrator.
2. Click **All services** at the top of the left-hand navigation menu. The **Azure Active Directory Extension** opens.
3. In the filter search box, type **"Azure Active Directory"** and select the **Azure Active Directory** item.
4. From the navigation menu, click **Enterprise applications**.
5. Select the app for consent.
6. Select **Permissions** and then click **Grant admin consent**. You'll be prompted to sign in to administrate the application.
7. Sign in with an account that has permissions to grant admin consent for the application. 
8. Consent to the application permissions.

This option only works if the application is: 

- Registered in your tenant, or
- Registered in another Azure AD tenant, and consented by at least one end user. Once an end user has consented to an application, Azure AD lists the application under **Enterprise apps** in the Azure portal.

## Grant admin consent when registering an app in the Azure portal

To grant admin consent when registering an app: 

1. Sign in to the [Azure portal](https://portal.azure.com) as a global administrator.
2. Navigate to the **App Registrations** blade.
3. Select the application for the consent.
4. Select **API permissions**.
5. Click **Grant admin consent**.


## Grant admin consent through a URL request

To grant admin consent through a URL request:

1. Construct a request to *login.microsoftonline.com* with your app configurations and append on `&prompt=admin_consent`. 
2. After signing in with admin credentials, the app has been granted consent for all users.


## Force user consent through a URL request

To require end users to consent to an application each time they authenticate, append `&prompt=consent` to the authentication request URL.

## Next steps

[Consent and Integrating Apps to AzureAD](../develop/quickstart-v1-integrate-apps-with-azure-ad.md)

[Consent and Permissioning for AzureAD v2.0 converged Apps](../develop/active-directory-v2-scopes.md)

[AzureAD StackOverflow](https://stackoverflow.com/questions/tagged/azure-active-directory)
