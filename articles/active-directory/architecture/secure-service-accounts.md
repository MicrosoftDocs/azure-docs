---
title: Introduction to securing Microsoft Entra service accounts
description: Explanation of the types of service accounts available in Microsoft Entra ID.
services: active-directory
author: janicericketts
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 08/26/2022
ms.author: jricketts
ms.reviewer: ajburnle
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---
# Securing cloud-based service accounts

There are three types of service accounts native to Microsoft Entra ID: Managed identities, service principals, and user-based service accounts. Service accounts are a special type of account that is intended to represent a non-human entity such as an application, API, or other service. These entities operate within the security context provided by the service account. 

<a name='types-of-azure-active-directory-service-accounts'></a>

## Types of Microsoft Entra service accounts

For services hosted in Azure, we recommend using a managed identity if possible, and a service principal if not. Managed identities can't be used for services hosted outside of Azure. In that case, we recommend a service principal. If you can use a managed identity or a service principal, do so. We recommend that you not use a Microsoft Entra user account as a service account. See the following table for a summary.

| Service hosting| Managed identity| Service principal| Azure user account |
| - | - | - | - |
|Service is hosted in Azure.| Yes. <br>Recommended if the service <br>supports a Managed Identity.| Yes.| Not recommended. |
| Service is not hosted in Azure.| No| Yes. Recommended.| Not recommended. |
| Service is multi-tenant| No| Yes. Recommended.| No. |

## Managed identities

Managed identities are secure Microsoft Entra identities created to provide identities for Azure resources. There are [two types of managed identities](../managed-identities-azure-resources/overview.md#managed-identity-types): 
 
* System-assigned managed identities can be assigned directly to an instance of a service. 

* User-assigned managed identities can be created as a standalone resource. 

For more information, see [Securing managed identities](service-accounts-managed-identities.md). For general information about managed identities, see [What are managed identities for Azure resources?](../managed-identities-azure-resources/overview.md)

## Service principals

If you can't use a managed identity to represent your application, use a service principal. Service principals can be used with both single tenant and multi-tenant applications. 

A service principal is the local representation of an application object in a single Microsoft Entra tenant. It functions as the identity of the application instance, defines who can access the application, and what resources the application can access. A service principal is created in (local to) each tenant where the application is used and references the globally unique application object. The tenant secures the service principal's sign-in and access to resources.

There are two mechanisms for authentication using service principals—client certificates and client secrets. Certificates are more secure: use client certificates if possible. Unlike client secrets, client certificates cannot accidentally be embedded in code.

For information on securing service principals, see [Securing service principals](service-accounts-principal.md).
 
## Next steps

For more information on securing Azure service accounts, see:

[Securing managed identities](service-accounts-managed-identities.md)

[Securing service principals](service-accounts-principal.md)

[Governing Azure service accounts](govern-service-accounts.md)
