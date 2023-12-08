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

## Relocation strategies

There are three possible relocation strategies that you can use to relocate your Azure services, depending on the nature of the service you are relocating:

- [Azure Resource Mover (ARM)](./relocation-strategy-resource-mover.md). Use Azure Resource Mover for moving resources across regions.

- [Service redeployment](). Use redeployment to relocate a stateless Azure service.

- [Redeployment with data migration](). Use redeployment with data migration to relocate a stateful Azure service.


## Relocation architectural patterns

An architectural pattern is a general, reusable solution to a commonly occurring problem in software architecture within a given context. Architectural patterns can help fast-track the assessment stage of the relocation execution workflow. Each one highlights some of the essential considerations, dependencies, and solutions for you to follow for Azure services relocation.

Based on the nature of the workload, relocation patterns can be the starting point for planning the individual workload or application relocation to a different region (or) the relocation execution flow can be the starting point when considering an extensive relocation program.

The following the following three relocation patterns are complimentary, and you can combine them for your relocation program strategy.

- **Azure Availability Zones**
Azure availability zones are physically separate locations within each Azure region that are tolerant to local failures. Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved because of redundancy and logical isolation of Azure services. To ensure resiliency, a minimum of three separate availability zones are present in all availability zone-enabled regions. For 3+0 regions their the recommended option to enable resiliency and high availability for your Azure Service. Be aware that 3+0 regions do not have a paired and the capabilities for resiliency and HA introduced by a paired datacenter are not available.

    For information on how to plan for a region move to availability zones, see [Azure availability zone migration baseline](../reliability/availability-zones-baseline.md).

- **Azure Landing Zone**
Azure landing zones are the output of a multi-subscription Azure environment that accounts for scale, security, governance, networking, and identity. Azure landing zones enable application migrations and greenfield development at enterprise-scale in Azure. These zones consider all platform resources that are required to support the customer’s application portfolio and don’t differentiate between infrastructure as a service or platform as a service.

    For information on how to plan for an Azure Landing Zone relocation, see [CONTENT]()

- **N-Tier Application Solutions**
Patterns and Practices to relocate n-Tier Application in new regions. For information on relocation patterns for n-tier applications, see [CONTENT]()

## Region relocation workload architectures

Relocation workload architectures are classified into three types:  

- **Multi-Site Active/Active.** Both regions are active at the same time, with one region ready to begin use immediately. This architecture is designed for workloads that needs near to zero downtime for the end-user perspective and near to zero data loss. This is a more suitable architecture when the relocation decision is associated with a change in region alone vs. a change in both region and subscription.
- **Warm Standby:** Primary region active, secondary region has critical resources such as deployed models ready to start. Non-critical resources need to be deployed manually in the secondary region.
- **Cold Standby:** Primary region active, secondary region has required Azure resources deployed, along with needed data. Resources such as models, model deployments, and pipelines need to be deployed manually in the secondary region.

The implemented architecture in a particular service helps you to understand the downtime introduced by the relocation of a workload that includes that service. For example, CosmosDB has a replication capability to enable Warm Standby or Multi-Site Active Active architectures.

For detailed information on relocation workload architectures, including how to choose one architecture over another, see [Azure region relocation workload architectures](./relocation-workload-architectures.md).