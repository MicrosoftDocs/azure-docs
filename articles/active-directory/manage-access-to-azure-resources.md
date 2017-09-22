---
title: Manage access to Azure resources with Azure Active Directory
description: Learn about the ways to manage access to Azure resources using different features of Azure Active Directory.
services: active-directory
documentationcenter: ''
author: skwan
manager: mbaldwin
editor: bryanla
ms.assetid: f66abf54-3809-436c-92b6-018e1179780e
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/25/2017
ms.author: skwan
---

# Manage access to Azure resources with Azure Active Directory

Identity and access management for cloud resources is a critical function for any organization that is using the cloud.  Azure Active Directory (Azure AD) is the identity and access system for Microsoft Azure.  

Azure AD provides the following capabilities for managing access to Azure resources:

|||
|---|---|
| [Relationship between Azure AD tenants and subscriptions](active-directory-understanding-resource-access) | Use Azure AD as the source of users and groups for an Azure subscription. |
| [Role-Based Access Control (RBAC)](role-based-access-control-what-is.md) | Offer fine-grained access management through roles assigned to users or groups. |
| [Privileged Identity Management with RBAC](pim-azure-resource.md) | Reduce the number of privileged roles with Just In Time access to Azure resouces. |
| [Conditional Access for Azure management](conditional-access-azure-management.md) | Set up conditional access policies to allow or block access Azure management endpoints. |
| [Managed Service Identity (MSI)](msi-overview.md) | Give Azure resources a service identity to simplify accessing them in your code.  |

 