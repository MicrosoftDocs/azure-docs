---
title: What’s new for Azure Active Directory in Microsoft 365 Government - Azure Active Directory | Microsoft Docs
description: Learn about some changes to Azure Active Directory (Azure AD) in the Microsoft 365 Government cloud instance, which might impact you.
services: active-directory
author: eross-msft
manager: daveba
ms.author: lizross
ms.reviewer: sumitp

ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: conceptual
ms.date: 05/07/2019
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# What's new for Azure Active Directory in Microsoft 365 Government

We've made some changes to Azure Active Directory (Azure AD) in the Microsoft 365 Government cloud instance, which is applicable to customers using the following services:

- Microsoft Azure Government

- Microsoft 365 Government – GCC High

- Microsoft 365 Government – DoD

This article doesn't apply to Microsoft 365 Government – GCC customers.

## Changes to the initial domain name

During your organization's initial sign-up for a Microsoft 365 Government online service, you were asked to choose your organization's domain name, `<your-domain-name>.onmicrosoft.com`. If you already have a domain name with the .com suffix, nothing will change.

However, if you're signing up for a new Microsoft 365 Government service, you'll be asked to choose a domain name using the `.us` suffix. So, it will be `<your-domain-name>.onmicrosoft.us`.

>[!Note]
>This change doesn't apply to any customers who are managed by cloud service providers (CSPs).

## Changes to portal access

We've updated the portal endpoints for Microsoft Azure Government, Microsoft 365 Government – GCC High, and Microsoft 365 Government – DoD, as shown in the [Endpoint mapping table](#endpoint-mapping).

Previously customers could sign in using the worldwide Azure (portal.azure.com) and Office 365 (portal.office.com) portals. With this update, customers must now sign in using the specific Microsoft Azure Government, Microsoft 365 Government - GCC High, and Microsoft 365 Government - DoD portals.

## Endpoint mapping

The following table shows the endpoints for all customers:

| Name | Endpoint details |
|------|------------------|
| Portals |Microsoft Azure Government: https://portal.azure.us<p>Microsoft 365 Government – GCC High: https://portal.office365.us<p>Microsoft 365 Government – DoD: https://portal.apps.mil |
| Azure Active Directory Authority Endpoint | https://login.microsoftonline.us |
| Azure Active Directory Graph API | https://graph.windows.net |
| Microsoft Graph API for Microsoft 365 Government - GCC High | https://graph.microsoft.us |
| Microsoft Graph API for Microsoft 365 Government - DoD | https://dod-graph.microsoft.us |
| Azure Government services endpoints | For details, see [Azure Government developer guide](https://docs.microsoft.com/azure/azure-government/documentation-government-developer-guide) |
| Microsoft 365 Government - GCC High endpoints | For details, see [Office 365 U.S. Government GCC High endpoints](https://docs.microsoft.com/office365/enterprise/office-365-u-s-government-gcc-high-endpoints) |
| Microsoft 365 Government - DoD | For details, see [Office 365 U.S. Government DoD endpoints](https://docs.microsoft.com/office365/enterprise/office-365-u-s-government-dod-endpoints) |

## Next steps

For more information, see these articles:

- [What is Azure Government?](https://docs.microsoft.com/azure/azure-government/documentation-government-welcome)

- [Azure Government AAD Authority Endpoint Update](https://devblogs.microsoft.com/azuregov/azure-government-aad-authority-endpoint-update/)

- [￼Microsoft Graph endpoints in US Government cloud](https://developer.microsoft.com/graph/blogs/new-microsoft-graph-endpoints-in-us-government-cloud/)

- [Office 365 US Government GCC High and DoD](https://docs.microsoft.com/office365/servicedescriptions/office-365-platform-service-description/office-365-us-government/gcc-high-and-dod)