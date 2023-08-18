---
title: Reliability and availability in Azure Deployment Environments
description: Learn how Azure Deployment Environments supports disaster recovery. Understand reliability and availability within a single region and across regions.
ms.service: deployment-environments
ms.topic: conceptual
ms.author: rosemalcolm
author: RoseHJM
ms.date: 08/18/2023
---

# Reliability in Azure Deployment Environments 

This article describes reliability support in Azure Deployment Environments, and covers intra-regional resiliency with availability zones and inter region resiliency with disaster recovery. For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/well-architected/resiliency/overview).

## Availability zone support 

Azure availability zones consist of at least three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. Availability zones are designed to ensure high availability if a local zone fails. When one zone experiences a failure, other zones support all regional services, capacity, and high availability. Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. 

Availability zone support for all resources in Azure Deployment Environments is enabled automatically. There's no action for you to take. 

Regions supported: Australia East, Canada Central, East US, East US 2, Japan East, South Central US, UK South, West Europe, West US 3. 

For more detailed information on availability zones in Azure, see [Regions and availability zones](/azure/site-recovery/azure-to-azure-architecture).

## Disaster recovery: cross-region failover 

Azure provides protection from regional or large geography disasters by making use of another region if there's a region-wide disaster.

If a cross-region failover occurs, the data for the following resources is lost:
- dev center
- project
- catalog
- catalog items
- dev center environment type
- project environment type
- environments

You can replicate your Deployment Environments resources in an alternate region to prevent data loss if a cross-region failover occurs. 

For more information on Azure disaster recovery architecture, see [Azure to Azure disaster recovery architecture](/azure/site-recovery/azure-to-azure-architecture). 

## Next steps 

- To learn more about how Azure supports reliability, see [Azure reliability](/azure/reliability). 
- To get started with Deployment Environments, see [Quickstart: Create and configure the Azure Deployment Environments dev center](./quickstart-create-and-configure-devcenter.md).
- To learn more about creating and configuring Deployment Environments resources, see [Azure Deployment Environments key concepts](./concept-environments-key-concepts.md).
