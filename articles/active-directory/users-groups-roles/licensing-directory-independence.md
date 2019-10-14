---
title: Characteristics of multiple tenant interaction - Azure Active Directory | Microsoft Docs
description: Manage your Azure Active tenant tenants by understanding your tenants as fully independent resources
services: active-tenant
documentationcenter: ''
author: curtand
manager: mtillman
editor: ''

ms.service: active-directory
ms.topic: article
ms.workload: identity
ms.subservice: users-groups-roles
ms.date: 01/31/2019
ms.author: curtand

ms.custom: it-pro
ms.reviewer: sumitp
ms.collection: M365-identity-device-management
---

# Understand how multiple Azure Active Directory tenants interact

In Azure Active Directory (Azure AD), each tenant is a fully independent resource: a peer that is logically independent from the other tenants that you manage. There is no parent-child relationship between tenants. This independence between tenants includes resource independence, administrative independence, and synchronization independence.

## Resource independence
* If you create or delete a resource in one tenant, it has no impact on any resource in another tenant, with the partial exception of external users. 
* If you use one of your domain names with one tenant, it cannot be used with any other tenant.

## Administrative independence
If a non-administrative user of tenant 'Contoso' creates a test tenant 'Test,' then:

* By default, the user who creates a tenant is added as an external user in that new tenant, and assigned the global administrator role in that tenant.
* The administrators of tenant 'Contoso' have no direct administrative privileges to tenant 'Test,' unless an administrator of 'Test' specifically grants them these privileges. However, administrators of 'Contoso' can control access to tenant 'Test' if they control the user account that created 'Test.'
* If you add/remove an administrator role for a user in one tenant, the change does not affect the administrator roles that the user has in another tenant.

## Synchronization independence
You can configure each Azure AD tenant independently to get data synchronized from a single instance of either:

* The Azure AD Connect tool, to synchronize data with a single AD forest.
* The Azure Active tenant Connector for Forefront Identity Manager, to synchronize data with one or more on-premises forests, and/or non-Azure AD data sources.

## Add an Azure AD tenant
To add an Azure AD tenant in the Azure portal, sign in to [the Azure portal](https://portal.azure.com) with an account that is an Azure AD global administrator, and, on the left, select **New**.

> [!NOTE]
> Unlike other Azure resources, your tenants are not child resources of an Azure subscription. If your Azure subscription is canceled or expired, you can still access your tenant data using Azure PowerShell, the Azure Graph API, or the Microsoft 365 admin center. You can also [associate another subscription with the tenant](../fundamentals/active-directory-how-subscriptions-associated-directory.md).
>

## Next steps
For a broad overview of Azure AD licensing issues and best practices, see [What is Azure Active tenant licensing?](../fundamentals/active-directory-licensing-whatis-azure-portal.md).
