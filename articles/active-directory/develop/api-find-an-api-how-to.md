---
title: How to find a specific API needed for a custom-developed application | Microsoft Docs
description: How to configure the permissions you need to access a particular API in your custom developed Azure AD application
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
ms.date: 09/11/2018
ms.author: celested

---

# How to find a specific API needed for a custom-developed application

Access to APIs require configuration of access scopes and roles. If you want to expose your resource application web APIs to client applications, you need to configure access scopes and roles for the API. If you want a client application to access a web API, you need to configure permissions to access the API in the app registration.

## Configuring a resource application to expose web APIs

When you expose your web API, the API be displayed in the **Select an API** list when adding permissions to an app registration. To add access scopes, follow the steps outlined in [adding access scopes to your resource application](https://docs.microsoft.com/azure/active-directory/develop/active-directory-integrating-applications#adding-access-scopes-to-your-resource-application).

## Configuring a client application to access web APIs

When you add permissions to your app registration, you can **add API access** to exposed web APIs. To access web APIs, follow the steps outlined in [add credentials or permissions to access web APIs](https://docs.microsoft.com/azure/active-directory/develop/active-directory-integrating-applications#to-add-credentials-or-permissions-to-access-web-apis).

## Next steps

-   [Integrating applications with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/active-directory-integrating-applications)

-   [Understanding the Azure Active Directory application manifest](https://docs.microsoft.com/azure/active-directory/develop/active-directory-application-manifest)


