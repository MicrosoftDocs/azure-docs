---
title: Characteristics of multiple tenant interaction - Azure AD | Microsoft Docs
description: Understanding the data independence of your Azure Active Directory organizations
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
ms.service: active-directory
ms.topic: overview
ms.workload: identity
ms.subservice: users-groups-roles
ms.date: 04/29/2020
ms.author: curtand
ms.custom: it-pro
ms.reviewer: sumitp
ms.collection: M365-identity-device-management
---

# Understand how multiple Azure Active Directory organizations interact

In Azure Active Directory (Azure AD), each Azure AD organization is fully independent: a peer that is logically independent from the other Azure AD organizations that you manage. This independence between organizations includes resource independence, administrative independence, and synchronization independence. There is no parent-child relationship between organizations.

## Resource independence

* If you create or delete an Azure AD resource in one organization, it has no impact on any resource in another organization, with the partial exception of external users.
* If you register one of your domain names with one organization, it can't be used by any other organization.

## Administrative independence

If a non-administrative user of organization 'Contoso' creates a test organization 'Test,' then:

* By default, the user who creates a organization is added as an external user in that new organization, and assigned the global administrator role in that organization.
* The administrators of organization 'Contoso' have no direct administrative privileges to organization 'Test,' unless an administrator of 'Test' specifically grants them these privileges. However, administrators of 'Contoso' can control access to organization 'Test' if they control the user account that created 'Test.'
* If you add or remove an Azure AD role for a user in one organization, the change does not affect the roles that the user is assigned in any other Azure AD organization.

## Synchronization independence

You can configure each Azure AD organization independently to get data synchronized from a single instance of either:

* The Azure AD Connect tool, to synchronize data with a single AD forest.
* The Azure Active Directory Connector for Forefront Identity Manager, to synchronize data with one or more on-premises forests, and/or non-Azure AD data sources.

## Add an Azure AD organization

To add an Azure AD organization in the Azure portal, sign in to [the Azure portal](https://portal.azure.com) with an account that is an Azure AD global administrator, and select **New**.

> [!NOTE]
> Unlike other Azure resources, your Azure AD organizations are not child resources of an Azure subscription. If your Azure subscription is canceled or expired, you can still access your Azure AD organization's data using Azure PowerShell, the Microsoft Graph API, or the Microsoft 365 admin center. You can also [associate another subscription with the organization](../fundamentals/active-directory-how-subscriptions-associated-directory.md).
>

## Next steps

For Azure AD licensing considerations and best practices, see [What is Azure Active Directory licensing?](../fundamentals/active-directory-licensing-whatis-azure-portal.md).
