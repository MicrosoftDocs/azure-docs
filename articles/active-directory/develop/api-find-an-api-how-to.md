---
title: How to find a specific API needed for a custom-developed application | Microsoft Docs
description: How to configure the permissions you need to access a particular API in your custom developed Azure AD application
services: active-directory
documentationcenter: ''
author: rwike77
manager: CelesteDG

ms.assetid: 
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 06/28/2019
ms.author: ryanwi

ms.collection: M365-identity-device-management
---

# How to find a specific API needed for a custom-developed application

Access to APIs require configuration of access scopes and roles. If you want to expose your resource application web APIs to client applications, you need to configure access scopes and roles for the API. If you want a client application to access a web API, you need to configure permissions to access the API in the app registration.

## Configuring a resource application to expose web APIs

When you expose your web API, the API be displayed in the **Select an API** list when adding permissions to an app registration. To add access scopes, follow the steps outlined in [Configure an application to expose web APIs](quickstart-configure-app-expose-web-apis.md).

## Configuring a client application to access web APIs

When you add permissions to your app registration, you can **add API access** to exposed web APIs. To access web APIs, follow the steps outlined in [Configure a client application to access web APIs](quickstart-configure-app-access-web-apis.md).

## Next steps

-   [Understanding the Azure Active Directory application manifest](https://docs.microsoft.com/azure/active-directory/develop/active-directory-application-manifest)


