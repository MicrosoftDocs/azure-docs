---
title: How to grant permissions to a custom-developed application - Azure Active Directory | Microsoft Docs
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
ms.date: 10/17/2018
ms.author: celested

---

# How to grant permissions to a custom-developed application in Azure Active Directory

If you want to grant consent preemptively to an application registered to an Azure Active Directory (Azure AD) tenant, or are running into an error that you have not consented to an app, try these steps below.

## Perform admin consent to an application registered in your tenant

A global administrator can provide admin consent to specific applications on behalf of end-users. Admin consent to an application allows all end-users in your tenant to access the application without being prompted to provide user consent. 

To perform admin consent to an application registered in *your* tenant: 

1. User consent must be turned off in your tenant.
2. Sign in to the [Azure portal](https://portal.azure.com) as a global administrator.
2. Navigate to the **App Registrations** blade.
3. Select the application for the consent.
4. Select **Required Permissions**.
5. Click **Grant Permissions** at the top of the blade.

Alternatively, you can construct a request to *login.microsoftonline.com* with your app configs and append on *&prompt=admin\_consent*. After signing in with admin credentials, the app has been granted consent for all users.

## Perform admin consent to an application registered in a different tenant
A global administrator can provide admin consent to an application registered in a different tenant. This allows users in the global administrator's tenant to access an application in a different tenant without being prompted to provide user consent.

To perform admin consent to an application registered in a *different* tenant:

1. Sign in to the [Azure portal](https://portal.azure.com) as a global administrator, an application administrator, or a cloud application administrator.
2. Click **All services** at the top of the left-hand navigation menu. The **Azure Active Directory Extension** opens.
3. In the filter search box, type **"Azure Active Directory"** and select the **Azure Active Directory** item.
4. From the navigation menu, click **Enterprise applications**.
5. Click **Grand Admin Consent**. You will be prompted to sign in to administrate the application.
6. Sign in with an account that has permissions to consent on behalf of the entire organization. 
7. Consent to the application permissions.

## How to force User Consent for your application

* Append onto auth requests *&prompt=consent* which require end users to consent each time they authenticate.

## Next steps

[Consent and Integrating Apps to AzureAD](https://docs.microsoft.com/azure/active-directory/develop/active-directory-integrating-applications)

[Consent and Permissioning for AzureAD v2.0 converged Apps](https://docs.microsoft.com/azure/active-directory/develop/active-directory-v2-scopes)<br>

[AzureAD StackOverflow](http://stackoverflow.com/questions/tagged/azure-active-directory)
