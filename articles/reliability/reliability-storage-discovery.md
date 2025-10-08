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
| **Storage Discovery workspace management**  | If the region where the Storage Discovery workspace is created experiences an outage, the workspace reports are unavailable during the time.              | If a zone is down, the Storage Discovery workspace remains available. You can continue to manage your workspace and access reports.|
| **Storage Discovery reports**     | If a region goes down, data from storage accounts in that region may be delayed until the region is restored. In the rare event of complete data loss during the outage period, the Discovery workspace can't recover data lost during that period.             | If the storage account is deployed to a failed zone, then the account becomes unavailable and the insights for the affected storage isn't available. If the storage account is zone redundant, then the Discovery workspace continues to provide account insights. |

## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

- Storage Discovery workspace management is zone-redundant. When a zone is down, your Storage Discovery workspace is still available. You can continue to manage your workspace and access reports.

- Storage Discovery reports are zone-redundant. However, outage affecting the storage resource may impact insights about that resource. If a storage resource is zone-redundant, then the flow of insights remains uninterrupted.

## Cross-region disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]

### Outage detection and notification

Storage Discovery doesn't provide outage notifications for every incident. The Storage Discovery service utilizes the same notification infrastructure used across Azure to inform customers about prolonged or severe outages.

> [!RECOMMENDATION]
> If you need uninterrupted access to Discovery reports, you can consider creating a second workspace, in a different region. This second workspace should be configured to observe the same storage resources. This approach protects you from a regional outage affecting your primary workspace. However, it doesn't safeguard against availability issues in the storage resources themselves across regions. Learn more about [Storage Discovery pricing](pricing.md) to evaluate additional costs.

## Data availability and freshness coverage

Key factors that influence data availability and freshness in your Storage Discovery reports:

- After creating a new Storage Discovery workspace, most insights appear in reports within 24 hours. 
- Most updates, such as adding or removing a storage account in a subscription or resource group that are linked to a Storage Discovery workspace will be reflected in the Storage Discovery reports within 24 hours.
- Changes related to adding a new [scope](../storage-discovery/management-components.md#scope) or editing an existing scope in your Discovery workspace are typically reflected in the reports within 24 hours.
- Effect of [changing pricing plan](../storage-discovery/pricing.md) on an existing Storage Discovery workspace is immediate.
- When a scope is deleted, you immediately lose the insights gathered for this scope. 
- When a Discovery workspace is deleted, you immediately lose the insights gathered for all the contained scopes. Exercise caution when deleting a workspace or a scope.

## Next steps

- [Plan your Storage Discovery deployment](../storage-discovery/deployment-planning.md)
- [Frequently asked questions](../storage-discovery/frequently-asked-questions.md)
