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

As Microsoft continues to expand Azure global infrastructure and launch new Azure regions worldwide, there's an increasing number of region relocation options for business-critical data and apps.  Region relocation options vary by service and by workload architecture.  To successfully migrate a workload to another region, you need to plan your relocation strategy with an understanding of what each service in your workload requires and supports.

The Azure region relocation documentation contains service-specific guides so that you can learn about the relocation options for each service that's in your workload. 

  

## Relocation methods

There are three main methods for relocating workloads. The relocation method you choose depends on the services in the workload and how critical the workload is to essential business functions.

- **Cold relocation**  is for workloads that can withstand downtime. Cold relocation is the most cost-effective approach to relocation because you don't duplicate any environments during relocation.

- **Hot relocation** is for workloads that need minimal to zero downtime. Hot relocation helps minimize the data delta after cutover. Hot relocation is only possible if the service supports synchronous data replication. Some services don't have this feature, and you'll need to use a warm relocation approach instead. 

- **Warm relocation** is for critical workloads that don't support hot relocation. Warm relocation uses asynchronous data replication and environment replication. For critical workloads, you should see if the service supports hot relocation before trying a warm approach.  |

For more information on all three methods and guidance for how to choose a method, see [Select a relocation method](/azure/cloud-adoption-framework/relocate/select#select-a-relocation-method).


## Relocation strategies

There are three possible relocation strategies that you can use to relocate your Azure services, depending on the nature of the service you are relocating:

- [Azure Resource Mover (ARM)](./relocation-strategy-resource-mover.md). Use Azure Resource Mover for moving resources across regions.

- [Service redeployment](). Use redeployment to relocate a stateless Azure service.

- [Redeployment with data migration](). Use redeployment with data migration to relocate a stateful Azure service.

To learn about what types of strategies are supported for the services in your workload, find the [relocation guidance page for your services](./relocation-guidance-overview.md).


## Relocation architectural patterns

There are three relocation architectural patterns that you can implement either in combination or all together. Knowing which relocation pattern to plan is key to creating the best relocation plan.

- **Azure Availability Zones** Azure availability zones are physically separate locations within each Azure region that are tolerant to local failures. To learn more about availability zones, see [Availability zones](../reliability/availability-zones-overview.md). For information on how to plan for a region move to availability zones, see [Azure availability zone migration baseline](../reliability/availability-zones-baseline.md).

- **Azure Landing Zone**
Azure landing zones are the output of a multi-subscription Azure environment that accounts for scale, security, governance, networking, and identity. Azure landing zones enable application migrations and greenfield development at enterprise-scale in Azure. These zones consider all platform resources that are required to support the customer’s application portfolio and don’t differentiate between infrastructure as a service or platform as a service.

    For information on how to plan for an Azure Landing Zone relocation, see [CONTENT]()

- **N-Tier Application Solutions**
Patterns and Practices to relocate n-Tier Application in new regions. For information on relocation patterns for n-tier applications, see [CONTENT]()




## Relocation strategies

There are three possible relocation strategies that you can use to relocate your Azure services, depending on the nature of the service you are relocating:

- [Azure Resource Mover (ARM)](./relocation-strategy-resource-mover.md). Use Azure Resource Mover for moving resources across regions.

- [Service redeployment](). Use redeployment to relocate a stateless Azure service.

- [Redeployment with data migration](). Use redeployment with data migration to relocate a stateful Azure service.

To learn about what types of strategies are supported for the services in your workload, find the [relocation guidance page for your services](./relocation-guidance-overview.md).


## Additional information

- [Cloud migration in the Cloud Adoption Framework](/azure/cloud-adoption-framework/migrate/).


