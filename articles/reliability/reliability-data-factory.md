---
title: Reliability in Azure Data Factory
description: Learn about reliability in Azure Data Factory, including availability zones and multi-region deployments.
author: jonburchel
ms.author: jburchel
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: azure-data-factory
ms.date: 01/27/2025
#Customer intent: As an engineer responsible for business continuity, I want to understand how Azure Data Factory works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow in different situations.
---

# Reliability in Azure Data Factory

This article describes reliability support in [Azure Data Factory](/data-factory/introduction.md), covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

Resiliency is a shared responsibility between you and Microsoft, and so this article also covers ways for you to create a resilient solution that meets your needs.

Azure Data Factory helps you more easily integrate and orchestrate data between apps, cloud services, and on-premises systems by reducing how much code that you have to write. When you plan for resiliency, make sure that you consider not just your data factory, but also these Azure resources that you use with your data factory:

* [Connections](/data-factory/connector-overview.md) that you create from data factory to other apps, services, and systems. 

* [On-premises data gateways](/data-integration/gateway/service-gateway-onprem), which are Azure resources that you create and use in your data factory to access data in on-premises systems. Each gateway resource represents a separate [data gateway installation](/data-integration/gateway/service-gateway-install) on a local computer. You can configure an on-premises data gateway for high availability by using multiple computers. For more information, see [High availability support](/data-integration/gateway/plan-scale-maintain).

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

In Azure Data Factory, tumbling window triggers and execution activities support *retry policies*, which retry requests that fail due to transient faults. To learn how to change or disable retry policy for your data factory triggers and activities, refer to [Pipeline execution and triggers](/data-factory/concepts-pipeline-execution-triggers) and [Execution Activities](/data-factory/concepts-pipelines-activities?tabs=data-factory#execution-activities).

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure Data Factory supports *zone redundancy*, which spreads compute resources across multiple [availability zones](../reliability/availability-zones-overview.md). For more information about zone redundancy, including region exceptions see [Azure Data Factory data redundancy](/data-factory/concepts-data-redundancy).

## Multi-region support

Each data factory is deployed into a single Azure region. If the region becomes unavailable, your data factory is also unavailable.

> [!NOTE]
> If there's a disaster (loss of region), a new data factory can be provisioned manually or in an automated fashion. Once you create the new data factory, you can restore your pipelines, datasets, and linked services JSON from an existing Git repository if you have setup [source control in Azure Data Factory](/data-factory/source-control).

### Alternative multi-region approaches 

For higher resiliency, you can deploy a standby or backup data factory in a secondary region and failover to that other region if the primary region is unavailable. To enable this capability, complete the following tasks:

- Deploy your data factory in both primary and secondary regions.
- Reconfigure connections to resources as needed.
- Configure load balancing and failover policies. 
- Plan to monitor the primary instance health and initiate failover.

For more information on multi-region deployments for your data factory pipelines, see [Set up automated recovery](/analytics/pipelines-disaster-recovery#set-up-automated-recovery).


## Backup and restore

Azure Data Factory supports Continuous Integration and Delivery (CI/CD) through source control integration, which allows you to backup metadata associated with a data factory instance and deploy it into a new environment easily. Learn more about using CI/CD to manage your resources in the [Azure Data Factory CI/CD documentation](/data-factory/continuous-integration-delivery).

## Related content

[BCDR for Azure Data Factory](/architecture/example-scenario/analytics/pipelines-disaster-recovery)