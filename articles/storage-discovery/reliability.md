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

Once a new Storage Discovery workspace is created, it takes upto 24 hours for the insights to be shown on the reports. Updates such as adding or removing a storage account in a subscription or resource group linked to a Storage Discovery workspace will appear in the reports within 24 hours. Adding a new [scope](management-components.md#scope) or editing an existing scope with your Discovery workspace will take upto 24 hours to reflect the changes.

Effect of [changing pricing plan](pricing.md) on an exisiting Storage Discovery workspace is immediate.

When a scope is deleted, you will loose the insights gathered on the scope immediately. 

When a Discovery workspace is deleted, you will loose the insights gathered on all the scopes under the workspace immediately. So execise caution while deleting a workspace and/or a scope. 

## Availability zone support

[Availability zones](../reliability/availability-zones-overview.md) are physically separate groups of datacenters within each Azure region. When one zone fails, services can fail over to one of the remaining zones.

- **Control plane of the service is zone-redundant.** When a zone is down in one region, the control plane continues to be available. During a zone-down scenario,  you can continue to manage your Storage Discovery Workspace. 

- **Data plane of the service is zone-redundant.** If the storage account is deployed to a failed zone, then the account becomes unavailable and from customer’s perspective, the insights for the affected storage isn't available. If the storage account is zone redundant, then the account insights continues to be available in the Discovery workspace.

### Zone down experience

In a zone-down scenario, the Storage Discovery service continues to be available. The data freshness of the insights depends on the availability zone support of storage accounts included in the workspace. If the account is not affected by the downed zone, the insghts continue to be populated.

### Zone outage preparation and recovery

The Storage Discovery service is zone-redundant. If the storage account included in your workspace is affected by a zone outage, insights related to those storage accounts will be delayed. After the zone and storage account become available, metrics will continue to be populated in you Storage Discovery reports.

## Cross-region disaster recovery and business continuity

Disaster recovery (DR) refers to practices that organizations use to recover from high-impact events, such as natural disasters or failed deployments that result in downtime and data loss. Regardless of the cause, the best remedy for a disaster is a well-defined and tested DR plan and an application design that actively supports DR. Before you start creating your disaster recovery plan, see [Recommendations for designing a disaster recovery strategy](/azure/well-architected/reliability/disaster-recovery). 

For DR, Microsoft uses the [shared responsibility model](../concept-shared-responsibility.md). In this model, Microsoft ensures that the baseline infrastructure and platform services are available. However, many Azure services don't automatically replicate data or fall back from a failed region to cross-replicate to another enabled region. For those services, you're responsible for setting up a disaster recovery plan that works for your workload. Most services that run on Azure platform as a service (PaaS) offerings provide features and guidance to support DR. You can use [service-specific features to support fast recovery](../reliability-guidance-overview.md) to help develop your DR plan.

### Outage detection, notification, and management

Storage Discovery doesn't send any notifications when there is an outage in the service itself. Notifications on the Discovery reports will be published on the best-effort basis in case of any significant loss of insights due to outages.

## Next steps

- [Plan your Storage Discovery deployment](deployment-planning.md)
- [Frequently asked questions](frequently-asked-questions.md)
