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
ms.date: 10/05/2017
ms.author: skwan
---

# Manage access to Azure resources with Azure Active Directory

Identity and access management for cloud resources is a critical function for any organization that is using the cloud. Azure Active Directory (Azure AD) is the identity and access system for Microsoft Azure.  

Before exploring the supporting feature areas of Azure AD, check out the following video: "Locking down access to the Azure Cloud using SSO, Roles Based Access Control, and Conditional." In it, you learn about:

- Best practices for configuring single sign-on to the Azure portal, with on-premises Active Directory.
- Using Azure RBAC for fine-grained access control to resources in subscriptions.
- Enforcing strong authentication rules using Azure AD Conditional Access.
- The concept of Managed Service Identity, where Azure resources can automatically authenticate to Azure services, and developers don’t need to handle API keys or secrets.

> [!VIDEO https://www.youtube.com/embed/FKBoWWKRnvI]

## Feature areas
Azure AD provides the following capabilities for managing access to Azure resources:

|||
|---|---|
| [Relationship between Azure AD tenants and subscriptions](active-directory-understanding-resource-access.md) | Learn about how Azure AD is the trusted source of users and groups for an Azure subscription. |
| [Role-Based Access Control (RBAC)](role-based-access-control-what-is.md) | Offer fine-grained access management through roles assigned to users, groups, or service principals. |
| [Privileged Identity Management with RBAC](pim-azure-resource.md) | Control highly privileged access by assigning privileged roles just-in-time. |
| [Conditional Access for Azure management](conditional-access-azure-management.md) | Set up conditional access policies to allow or block access to Azure management endpoints. |
| [Managed Service Identity (MSI)](msi-overview.md) | Give Azure resources like Virtual Machines their own identity so that you don’t have to put credentials in your code. |

 