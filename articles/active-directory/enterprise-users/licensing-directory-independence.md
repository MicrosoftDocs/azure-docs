---
title: Characteristics of multi-tenant interaction
description: Understanding the data independence of your Microsoft Entra organizations
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
ms.service: active-directory
ms.subservice: enterprise-users
ms.topic: overview
ms.workload: identity
ms.date: 09/08/2023
ms.author: barclayn
ms.custom: it-pro
ms.reviewer: sumitp
ms.collection: M365-identity-device-management
---

# Understand how multiple Microsoft Entra tenant organizations interact

In Microsoft Entra ID, part of Microsoft Entra, each Microsoft Entra organization is fully independent: a peer that is logically independent from the other Microsoft Entra organizations that you manage. This independence between organizations includes resource independence, administrative independence, and synchronization independence. There is no parent-child relationship between organizations.

## Resource independence

* If you create or delete a Microsoft Entra resource in one organization, it has no impact on any resource in another organization, with the partial exception of external users.
* If you register one of your domain names with one organization, it can't be used by any other organization.

## Administrative independence

If a non-administrative user of organization 'Contoso' creates a test organization 'Test,' then:

* By default, the user who creates a organization is added as an external user in that new organization, and assigned the Global Administrator role in that organization.
* The administrators of organization 'Contoso' have no direct administrative privileges to organization 'Test,' unless an administrator of 'Test' specifically grants them these privileges.
* If you add or remove a Microsoft Entra role for a user in one organization, the change does not affect the roles that the user is assigned in any other Microsoft Entra organization.

## Synchronization independence

You can configure each Microsoft Entra organization independently to get data synchronized from different AD forests, using the Microsoft Entra Connect tool.  See [topologies for Microsoft Entra Connect](../hybrid/connect/plan-connect-topologies.md) for more information on supported topologies when there are multiple Microsoft Entra tenants.

<a name='add-an-azure-ad-organization'></a>

## Add a Microsoft Entra organization

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Global Administrator](../roles/permissions-reference.md#global-administrator).
1. Select Microsoft Entra ID.
1. Select **Manage tenants**.
1. Choose **Create**.
1. Select **Workforce** and provide the requested information. The new organization is created and appears in the list of organizations.

> [!NOTE]
> Unlike other Azure resources, your Microsoft Entra organizations are not child resources of an Azure subscription. If your Azure subscription is canceled or expired, you can still access your Microsoft Entra organization's data using Azure PowerShell, the Microsoft Graph API, or the Microsoft 365 admin center. You can also [associate another subscription with the organization](../fundamentals/how-subscriptions-associated-directory.md).
>

## Next steps

For Microsoft Entra ID licensing considerations and best practices, see [What is Microsoft Entra ID licensing?](../fundamentals/concept-group-based-licensing.md).
