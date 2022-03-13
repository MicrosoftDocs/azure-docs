---
title: Azure Arc resource bridge (preview) security overview 
description: Security information about Azure resource bridge (preview).
ms.topic: conceptual
ms.date: 11/08/2021
---

# Azure Arc resource bridge (preview) security overview

This article describes the security configuration and considerations you should evaluate before deploying Azure Arc resource bridge (preview) in your enterprise.

> [!IMPORTANT]
> In the interest of ensuring new features are documented no later than their release, this page may include documentation for features that may not yet be publicly available.

## Using a managed identity

By default, an Azure Active Directory system-assigned [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) is created and assigned to the Azure Arc resource bridge (preview). Azure Arc resource bridge (preview) currently supports only a system-assigned identity. The `clusteridentityoperator` identity initiates the first outbound communication and fetches the Managed Service Identity (MSI) certificate used by other agents for communication with Azure.

## Identity and access control

Azure Arc resource bridge (preview) is represented as a resource in a resource group inside an Azure subscription. Access to this resource is controlled by standard [Azure role-based access control](../../role-based-access-control/overview.md). From the [**Access Control (IAM)**](../../role-based-access-control/role-assignments-portal.md) page in the Azure portal, you can verify who has access to your Azure Arc resource bridge (preview).

Users and applications granted [contributor](../../role-based-access-control/built-in-roles.md#contributor) or administrator role access to the resource can make changes to the resource, including deploying or deleting cluster extensions.

## Data encryption at rest

The Azure Arc resource bridge stores the resource information in the Cosmos DB, and as described in the [Encryption at rest in Azure Cosmos DB](../../cosmos-db/database-encryption-at-rest.md) article, all the data is encrypted at rest.

## Security audit logs

The Activity log is a platform log in Azure that provides insight into subscription-level events. This includes such information as when the Azure Arc resource bridge is modified, deleted, or added. You can view the Activity log in the Azure portal or retrieve entries with PowerShell and CLI. See [View the Activity log](../../azure-monitor/essentials/activity-log.md#view-the-activity-log) for details. See [retention of the Activity log](../../azure-monitor/essentials/activity-log.md#retention-period) for details.

## Next steps

Before evaluating or enabling Azure Arc-enabled vSphere or Azure Stack HCI, review the Azure Arc resource bridge (preview) [overview](overview.md) to understand requirements and technical details.