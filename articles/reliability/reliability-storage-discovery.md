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

This article explains how [Azure Storage Discovery](../storage-discovery/overview.md) supports reliability, including intra-regional resiliency with [availability zones](#availability-zone-support) and [cross-region disaster recovery and business continuity](#cross-region-disaster-recovery-and-business-continuity). For general reliability principles in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

Azure Storage Discovery is a fully managed service that provides enterprise-wide visibility into your Azure Blob Storage data estate. From a single pane of glass, you can analyze trends, optimize costs, enhance security, and improve operational efficiency.

## Service behavior during outages

|                                | Region outage | Zone outage |
|--------------------------------|-------------------|-----------------------|
| **Control plane**  | If the region where the Storage Discovery workspace is created experiences an outage, the workspace reports will be unavailable during the time.              | If a zone is down, the control plane remains available. You can continue to manage your Storage Discovery Workspace.|
| **Data plane**     | If a region goes down, data from storage accounts in that region may be delayed until the region is restored. In the rare event of complete data loss during the outage period, the Discovery workspace cannot recover data lost during that period.             | If the storage account is deployed to a failed zone, then the account becomes unavailable and the insights for the affected storage isn't available. If the storage account is zone redundant, then the Discovery workspace continues to provide account insights. |

## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

- **Control plane of the service is zone-redundant.** When a zone is down in one region, the control plane continues to be available. During a zone-down scenario,  you can continue to manage your Storage Discovery Workspace. 

- **Data plane of the service is zone-redundant.** If the storage account is deployed to a failed zone, then the account becomes unavailable and from customer’s perspective, the insights for the affected storage isn't available. If the storage account is zone redundant, then the Discovery workspace continues to provide account insights.

## Cross-region disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]

### Outage detection and notification

Storage Discovery doesn't send any notifications when there's an outage in the service itself. Notifications on the Discovery reports are published on the best-effort basis if there is a significant loss of insights due to outages.

> [!RECOMMENDATION]
> If you need uninterrupted access to Discovery reports - even during regional outages - we recommend creating a secondary workspace with the same configuration as your primary one. This ensures that if the primary workspace becomes unavailable, you can continue using the secondary workspace with all necessary insights. Please note that each Discovery workspace incurs additional costs.

## Data availability and freshness coverage

Key factors that influence data availability and freshness in your Storage Discovery reports:

- Once a new Storage Discovery workspace is created, it takes upto 24 hours for the insights to be shown on the reports. 
- Updates such as adding or removing a storage account in a subscription or resource group linked to a Storage Discovery workspace appears in the reports within 24 hours. 
- Adding a new [scope](../storage-discovery/management-components.md#scope) or editing an existing scope with your Discovery workspace takes upto 24 hours to reflect the changes.
- Effect of [changing pricing plan](../storage-discovery/pricing.md) on an existing Storage Discovery workspace is immediate.
- When a scope is deleted, you lose the insights gathered on the scope immediately. 
- When a Discovery workspace is deleted, you lose the insights gathered on all the scopes under the workspace immediately. So exercise caution while deleting a workspace and/or a scope. 

## Next steps

- [Plan your Storage Discovery deployment](../storage-discovery/deployment-planning.md)
- [Frequently asked questions](../storage-discovery/frequently-asked-questions.md)
