---
title: Azure Active Directory for developers (v1.0) overview
description: This article provides an overview of signing in Microsoft work and school accounts by using the Azure Active Directory v1.0 endpoint and platform.
services: active-directory
author: rwike77
manager: CelesteDG
editor: ''

ms.assetid: 5c872c89-ef04-4f4c-98de-bc0c7460c7c2
ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 10/24/2018
ms.author: ryanwi
ms.reviewer: jmprieur
ms.custom: aaddev
ms.collection: M365-identity-device-management
---

# Azure Active Directory for developers (v1.0) overview

Azure Active Directory (Azure AD) is a cloud identity service that allows developers to build apps that securely sign in users with a Microsoft work or school account. Azure AD supports developers building both single-tenant, line-of-business (LOB) apps, as well as developers looking to develop multi-tenant apps. In addition to basic sign in, Azure AD also lets apps call both Microsoft APIs like [Microsoft Graph](https://docs.microsoft.com/graph/overview) and custom APIs that are built on the Azure AD platform. This documentation shows you how to add Azure AD support to your application by using industry standard protocols like OAuth2.0 and OpenID Connect.

> [!NOTE]
> Most of the content on this page focuses on the v1.0 endpoint and platform, which supports only Microsoft work or school accounts. If you want to sign in consumer or personal Microsoft accounts, see the information on the [v2.0 endpoint and platform](v2-overview.md). The v2.0 endpoint offers a unified developer experience for apps that want to sign in all Microsoft identities.

| | |
| --- | --- |
|[Authentication basics](authentication-scenarios.md) | An introduction to authentication with Azure AD. |
|[Types of applications](app-types.md) | An overview of the authentication scenarios that are supported by Azure AD. |
| | |

## Get started

The v1.0 quickstarts and tutorials walk you through building an app on your preferred platform using the Azure AD Authentication Library (ADAL) SDK. See the **v1.0 Quickstarts** and **v1.0 Tutorials** in [Microsoft identity platform (Azure Active Directory for developers)](index.yml) to get started.

## How-to guides

See the **v1.0 How-to guides** for detailed info and walkthroughs of the most common tasks in Azure AD.

## Reference topics

The following articles provide detailed information about APIs, protocol messages, and terms that are used in Azure AD.

|                                                                                   | |
| ----------------------------------------------------------------------------------| --- |
| [Authentication Libraries (ADAL)](active-directory-authentication-libraries.md)   | An overview of the libraries and SDKs that are provided by Azure AD. |
| [Code samples](sample-v1-code.md)                                  | A list of all of the Azure AD code samples. |
| [Glossary](developer-glossary.md)                                      | Terminology and definitions of words that are used throughout this documentation. |
|  |  |


[!INCLUDE [Help and support](../../../includes/active-directory-develop-help-support-include.md)]
