---
title: Azure region relocation documentation
description:  Learn how to plan, execute, scale, and deliver the relocation of your Azure services into a new region. 
author: anaharris-ms
ms.topic: overview
ms.date: 11/28/2023
ms.author: anaharris
ms.service: reliability
ms.subservice: availability-zones
ms.custom: subject-reliability
---

# Azure region relocation documentation

As Microsoft continues to expand Azure global infrastructure and launch new Azure regions worldwide, Azure customers continue to have an increasing number of region relocation options for their business-critical data and apps.

Business drivers and requirements for relocating to a new Azure region include:

- **Respond to data residency and security requirements**. Move business-critical resources to an Azure region that's compliant with data residency and security requirements.

- **Align to a region launch**. Move resources to a newly introduced Azure region not previously available.

- **Align for services/features**. Move resources to take advantage of cloud services or features in a specific region.

- **Respond to business developments**. Move resources to a region in response to business changes, such as mergers or acquisitions.

- **Align for proximity**. Move resources to a region local to your business.

- **Respond to deployment requirements**. Move resources deployed in error or move in response to capacity needs.

- **Respond to decommissioning**. Move resources due to decommissioning of regions.

:::image type="content" source="media/relocation/azure-regions.png" alt-text="Picture of a world map that illustrates the many regions and availability zones within regions that are available.":::

The Azure region relocation documentation provides guidance to help you facilitate the relocation of your Azure services into a new region. Use this guide to help plan, execute, scale, and deliver your Azure cloud relocation project.

The Azure region relocation documentation provides a technical framework for assessing, preparing, and piloting Azure relocation for specific Azure services.

## Region relocation types

There are three main types of relocation that you can implement either in combination or all together. Knowing which relocation type to plan is to key to creating the best relocation strategy.

- **Azure Availability Zones** Azure availability zones are physically separate locations within each Azure region that are tolerant to local failures. To learn more about availability zones, see [Availability zones](../reliability/availability-zones-overview.md). For information on how to plan for a region move to availability zones, see [Azure availability zone migration baseline](../reliability/availability-zones-baseline.md).

- **Azure Landing Zone**
Azure landing zones are the output of a multi-subscription Azure environment that accounts for scale, security, governance, networking, and identity. Azure landing zones enable application migrations and greenfield development at enterprise-scale in Azure. These zones consider all platform resources that are required to support the customer’s application portfolio and don’t differentiate between infrastructure as a service or platform as a service.

    For information on how to plan for an Azure Landing Zone relocation, see [CONTENT]()

- **N-Tier Application Solutions**
Patterns and Practices to relocate n-Tier Application in new regions. For information on relocation patterns for n-tier applications, see [CONTENT]()

## Region relocation workload types

Relocation workload types are classified into three types:  

- **Multi-Site Active/Active.** Both regions are active at the same time, with one region ready to begin use immediately. This architecture is designed for workloads that needs near to zero downtime for the end-user perspective and near to zero data loss. This is a more suitable architecture when the relocation decision is associated with a change in region alone vs. a change in both region and subscription.
- **Warm Standby:** Primary region active, secondary region has critical resources such as deployed models ready to start. Non-critical resources need to be deployed manually in the secondary region.
- **Cold Standby:** Primary region active, secondary region has required Azure resources deployed, along with needed data. Resources such as models, model deployments, and pipelines need to be deployed manually in the secondary region.

The implemented architecture in a particular service helps you to understand the downtime introduced by the relocation of a workload that includes that service. For example, CosmosDB has a replication capability to enable Warm Standby or Multi-Site Active Active architectures.

For detailed information on relocation workload architectures, including how to choose one architecture over another, see [Azure region relocation workload architectures](./relocation-workload-architectures.md).

## Region relocation methods

There are three possible relocation methods that you can use to relocate your Azure services, depending on the nature of the service you are relocating:

- [Azure Resource Mover (ARM)](./relocation-strategy-resource-mover.md). Use Azure Resource Mover for moving resources across regions.

- [Service redeployment](). Use redeployment to relocate a stateless Azure service.

- [Redeployment with data migration](). Use redeployment with data migration to relocate a stateful Azure service.


