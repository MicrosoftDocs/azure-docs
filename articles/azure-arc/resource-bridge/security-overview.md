---
title: Azure Arc resource bridge (preview) security overview 
description: Security information about Azure resource bridge (preview).
ms.topic: conceptual
ms.date: 03/23/2023
---

# Azure Arc resource bridge (preview) security overview

This article describes the security configuration and considerations you should evaluate before deploying Azure Arc resource bridge (preview) in your enterprise.

## Using a managed identity

By default, a Microsoft Entra system-assigned [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) is created and assigned to the Azure Arc resource bridge (preview). Azure Arc resource bridge currently supports only a system-assigned identity. The `clusteridentityoperator` identity initiates the first outbound communication and fetches the Managed Service Identity (MSI) certificate used by other agents for communication with Azure.

## Identity and access control

Azure Arc resource bridge (preview) is represented as a resource in a resource group inside an Azure subscription. Access to this resource is controlled by standard [Azure role-based access control](../../role-based-access-control/overview.md). From the [**Access Control (IAM)**](../../role-based-access-control/role-assignments-portal.md) page in the Azure portal, you can verify who has access to your Azure Arc resource bridge (preview).

Users and applications who are granted the [Contributor](../../role-based-access-control/built-in-roles.md#contributor) or Administrator role to the resource group can make changes to the resource bridge, including deploying or deleting cluster extensions.

## Data residency

Azure Arc resource bridge follows data residency regulations specific to each region. If applicable, data is backed up in a secondary pair region in accordance with data residency regulations. Otherwise, data resides only in that specific region. Data isn't stored or processed across different geographies.

## Data encryption at rest

Azure Arc resource bridge stores resource information in Azure Cosmos DB. As described in  [Encryption at rest in Azure Cosmos DB](../../cosmos-db/database-encryption-at-rest.md), all the data is encrypted at rest.

## Security audit logs

The [activity log](../../azure-monitor/essentials/activity-log.md) is an Azure platform log that provides insight into subscription-level events. This includes tracking when the Azure Arc resource bridge is modified, deleted, or added. You can [view the activity log](../../azure-monitor/essentials/activity-log.md#view-the-activity-log) in the Azure portal or retrieve entries with PowerShell and Azure CLI. By default, activity log events are [retained for 90 days](../../azure-monitor/essentials/activity-log.md#retention-period) and then deleted.

## Next steps

- Understand [system requirements](system-requirements.md) and [network requirements](network-requirements.md) for Azure Arc resource bridge (preview).
- Review the [Azure Arc resource bridge (preview) overview](overview.md) to understand more about features and benefits.
- Learn more about [Azure Arc](../overview.md).
