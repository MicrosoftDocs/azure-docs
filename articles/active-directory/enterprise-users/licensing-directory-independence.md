---
title: Characteristics of multi-tenant interaction
description: Understanding the data independence of your Azure Active Directory organizations
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
ms.service: active-directory
ms.subservice: enterprise-users
ms.topic: overview
ms.workload: identity
ms.date: 06/24/2022
ms.author: barclayn
ms.custom: it-pro
ms.reviewer: sumitp
ms.collection: M365-identity-device-management
---

# Understand how multiple Azure Active Directory tenant organizations interact

In Azure Active Directory (Azure AD), part of Microsoft Entra, each Azure AD organization is fully independent: a peer that is logically independent from the other Azure AD organizations that you manage. This independence between organizations includes resource independence, administrative independence, and synchronization independence. There is no parent-child relationship between organizations.

## Resource independence

* If you create or delete an Azure AD resource in one organization, it has no impact on any resource in another organization, with the partial exception of external users.
* If you register one of your domain names with one organization, it can't be used by any other organization.

## Administrative independence

If a non-administrative user of organization 'Contoso' creates a test organization 'Test,' then:

* By default, the user who creates a organization is added as an external user in that new organization, and assigned the global administrator role in that organization.
* The administrators of organization 'Contoso' have no direct administrative privileges to organization 'Test,' unless an administrator of 'Test' specifically grants them these privileges. However, administrators of 'Contoso' can control access to organization 'Test' if they sign in to the user account that created 'Test.'
* If you add or remove an Azure AD role for a user in one organization, the change does not affect the roles that the user is assigned in any other Azure AD organization.

## Synchronization independence

You can configure each Azure AD organization independently to get data synchronized from different AD forests, using the Azure AD Connect tool.  See [topologies for Azure AD Connect](../hybrid/plan-connect-topologies.md) for more information on supported topologies when there are multiple Azure AD tenants.

## Add an Azure AD organization

To add an Azure AD organization in the Azure portal, sign in to the [Azure portal](https://portal.azure.com) with an account that is an Azure AD global administrator, and select **New**.

> [!NOTE]
> Unlike other Azure resources, your Azure AD organizations are not child resources of an Azure subscription. If your Azure subscription is canceled or expired, you can still access your Azure AD organization's data using Azure PowerShell, the Microsoft Graph API, or the Microsoft 365 admin center. You can also [associate another subscription with the organization](../fundamentals/active-directory-how-subscriptions-associated-directory.md).
>

## Next steps

For Azure AD licensing considerations and best practices, see [What is Azure Active Directory licensing?](../fundamentals/active-directory-licensing-whatis-azure-portal.md).
