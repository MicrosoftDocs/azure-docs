---
title: Reliability in Azure Storage Discovery
titleSuffix: Azure Storage Discovery
description: Find out about reliability in Azure Storage Discovery
author: pthippeswamy
ms.service: azure-storage-discovery
ms.author: fauhse
ms.topic: overview
ms.date: 10/02/2025
---

# Reliability in Azure Storage Discovery

This article describes reliability support in [Azure Storage Discovery](../storage-discovery/overview.md), and covers both intra-regional resiliency with [availability zones](#availability-zone-support) and [cross-region disaster recovery and business continuity](#cross-region-disaster-recovery-and-business-continuity). For a more detailed overview of reliability principles in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

Azure Storage Discovery is a fully managed service that provides enterprise-wide visibility into your Azure Blob Storage data estate. In a single pane of glass you can understand and analyze how your data estate evolved over time, optimize costs, enhance security, and drive operational efficiency. The service itself is regional, and supports zone-redundancy. 

## Data availability and freshness coverage

Once a new Storage Discovery workspace is created, it takes upto 24 hours for the insights to be shown on the reports. Updates such as adding or removing a storage account in a subscription or resource group linked to a Storage Discovery workspace appears in the reports within 24 hours. Adding a new [scope](../storage-discovery/management-components.md#scope) or editing an existing scope with your Discovery workspace takes upto 24 hours to reflect the changes.

Effect of [changing pricing plan](../storage-discovery/pricing.md) on an existing Storage Discovery workspace is immediate.

When a scope is deleted, you lose the insights gathered on the scope immediately. 

When a Discovery workspace is deleted, you lose the insights gathered on all the scopes under the workspace immediately. So exercise caution while deleting a workspace and/or a scope. 

## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

- **Control plane of the service is zone-redundant.** When a zone is down in one region, the control plane continues to be available. During a zone-down scenario,  you can continue to manage your Storage Discovery Workspace. 

- **Data plane of the service is zone-redundant.** If the storage account is deployed to a failed zone, then the account becomes unavailable and from customer’s perspective, the insights for the affected storage isn't available. If the storage account is zone redundant, then the Discovery workspace continues to provide account insights.

### Zone down experience

In a zone-down scenario, the Storage Discovery service continues to be available. The data freshness of the insights depends on the availability zone support of storage accounts included in the workspace. If the account is not affected by the downed zone, the insights continue to be populated.

### Zone outage preparation and recovery

The Storage Discovery service is zone-redundant. If the storage account included in your workspace is affected by a zone outage, the zone outage will delay insights related to those storage accounts. After the zone and storage account become available, metrics will continue to be populated in your Storage Discovery reports.

## Cross-region disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]

[!INCLUDE [Storage Actions continuity after a failover](../../includes/storage-actions-reliability.md)]

### Outage detection, notification, and management

Storage Discovery doesn't send any notifications when there's an outage in the service itself. Notifications on the Discovery reports are published on the best-effort basis if there is a significant loss of insights due to outages.

## Next steps

- [Plan your Storage Discovery deployment](../storage-discovery/deployment-planning.md)
- [Frequently asked questions](../storage-discovery/frequently-asked-questions.md)
