---
title: What are Azure regions?
description: Learn about Azure regions, and how to use them to design resilient solutions.
author: anaharris-ms
ms.service: azure
ms.subservice: azure-reliability
ms.topic: conceptual
ms.date: 03/07/2025
ms.author: anaharris
ms.custom: subject-reliability, ai-video-concept
---

# What are Azure regions?

>[!VIDEO https://learn-video.azurefd.net/vod/player?id=d36b5b2d-8bd2-43df-a796-b0c77b2f82fc]

Azure provides over 60 regions globally. Regions are located across many different *geographies*. Each geography represents a data residency boundary, for example the United States, or Europe, and may contain one or more regions. Each region is a set of physical facilities that include datacenters and networking infrastructure.

Regions provide certain types of resiliency options. Many regions provide [availability zones](./availability-zones-overview.md), and some have a paired region while other regions are nonpaired. When you choose a region for your services, it's important to pay attention to the resiliency options that are available in that region. This article helps you understand Azure regions, and gives you an overview of the resiliency options that some Azure regions support, while offering links to more detailed information on each topic.

## Understand Azure regions and geographies

An Azure region consists of one or more datacenters, connected by a high-capacity, fault-tolerant, low-latency network connection. Azure datacenters are typically located within a large metropolitan area.

![Image depicting high availability via asynchronous replication of applications and data across other Azure regions for disaster recovery protection.](./media/cross-region-replication.png)

Every region is contained within a single *geography* that serves as a fixed data residency boundary. If you have data residency requirements, it's important that you select regions within the required geography. Each geography has at least one region equipped with availability zones. For a list of all Azure geographies, see [Azure geographies](https://azure.microsoft.com/explore/global-infrastructure/geographies).

> [!NOTE]
> Most regions are available to all Azure customers. However, some regions belong to *sovereign cloud* geographies, which are available to some customers in specific geographic areas with stringent data residency regulations. Sovereign cloud regions work the same way as other regions, however they're often limited in the services and features of services that they provide. For more examples of limited service availability in sovereign cloud regions, see [Compare Azure Government and global Azure](/azure/azure-government/compare-azure-government-global-azure)) or [Availability of services for Microsoft Azure operated by 21Vianet](/azure/reliability/sovereign-cloud-china).

## Select Azure regions

When you select Azure regions for your solution, consider the following factors:

- **Latency**. Select regions that are geographically close to your users to reduce latency. For example, if your users are in the United States, you might select a region in the United States or Canada.
- **Availability zones**. Select regions that support availability zones to provide redundancy and fault isolation. Make sure that you spread your resources across multiple availability zones in the region. 
- **Multi-region**. Multi-region may be required for your workload, based on your business continuity planning. Some Azure services use region pairs to support geo-replication and geo-redundancy, while others use availability zones as their primary means of redundancy. Furthermore, many Azure services support geo-redundancy whether the regions are paired or not, and you can design a highly resilient solution whether you use paired regions, nonpaired regions, or a combination of both. To learn more about the approach for each service see [Reliability guides by service](./overview-reliability-guidance.md).

For more detailed information on how to select regions, see [Select Azure regions](/azure/cloud-adoption-framework/ready/azure-setup-guide/regions).

## List of regions

For a list of Azure regions, see [List of Azure regions](./regions-list.md). If you want more details on regions, including data residency and regulatory compliance, see the [Microsoft Datacenters Map](https://datacenters.microsoft.com/globe/explore/).

## Regional resiliency options

While all Azure regions provide high-quality services such as data residency and latency optimization, they can differ in the types of resiliency options they support. 

This section summarizes the two resiliency options that may or may not be available in the regions you choose.

### Availability zones

Many Azure regions provide availability zones. Availability zones are independent sets of datacenters that contain isolated power, cooling, and network connections. Availability zones are physically located close enough together to provide a low-latency network, but far enough apart to provide fault isolation from such things as storms and isolated power outages. Most Azure services provide built-in support for availability zones and you can decide how to use them to meet your needs. When you design an Azure solution, you should use availability zones to provide redundancy and fault isolation.

To learn more about availability zones, see [What are availability zones?](./availability-zones-overview.md).

### Paired and nonpaired regions

Some Azure regions are *paired* with another Azure region in order to form *region pairs*. Region pairs are selected by Microsoft and can't be chosen by the customer. There are some Azure services that use region pairs to support geo-replication and geo-redundancy. Some also use region pairs to support aspects of disaster recovery, in the unlikely event that a region experiences a catastrophic and unrecoverable failure.

Many newer regions aren't paired, and instead use availability zones as their primary means of redundancy. Many Azure services support geo-redundancy whether the regions are paired or not, and you can design a highly resilient solution whether you use paired regions, nonpaired regions, or a combination of both.

To learn more about paired and nonpaired regions and how to use them, see [Azure region pairs and nonpaired regions](./regions-paired.md).

## Using multiple Azure regions

It's common to use multiple Azure regions, paired or nonpaired, when you design a solution. By using multiple regions, you can increase workload resilience to many types of failures, and you have many options for disaster recovery. Also, some Azure services are available in specific regions, so by designing a multi-region solution you can take advantage of the global and distributed nature of the cloud. 

If you're using multiple regions together, you need to consider tradeoffs between the following factors:

- **Physical isolation:** Consider whether you should use regions that are geographically distant from each other. The greater the distance, the greater the resiliency in the case of a major natural disaster in one of the regions. For information on the city or state that a region is located in, see [List of Azure regions](./regions-list.md) and [Microsoft Datacenters Map](https://datacenters.microsoft.com/globe/explore/).

- **Latency:** When you select physically isolated regions, the latency of network connections between those regions increases. Latency can affect how you design a multi-region solution, and it can restrict the types of geo-replication and geo-redundancy you can use. To learn more about latency between Azure regions, see [Azure network round-trip latency statistics](/azure/networking/azure-network-latency). For more information about how to select regions, see [Recommendations for using availability zones and regions](/azure/well-architected/reliability/regions-availability-zones).

- **Data residency:** Ensure that any regions you select are within a data residency boundary that your organization requires.

## Nonregional services

Most Azure services are deployed to a specific region. However, there are some services that aren't tied to a single Azure region. It's important to recognize how *nonregional* services operate in the case of a regional failure, and to take them into account when you design your solutions and business continuity plan.

Nonregional services are deployed by Microsoft across two or more regions. If there's a regional failure, the instance of the service in a healthy region can continues servicing requests. For example, [Azure DNS](https://azure.microsoft.com/products/dns) is a nonregional service.

Some Azure services allow you to specify a region or geography in which your data is stored. For example, with [Microsoft Entra ID](https://www.microsoft.com/security/business/identity-access/microsoft-entra-id/), you can select the geographic area for your data, such as Europe or North America. For more information about data residency, see [Data residency in Azure](https://azure.microsoft.com/explore/global-infrastructure/data-residency/).

With some nonregional services you can specify the region where certain components are deployed. For example, you can choose which region [Azure Virtual Desktop](https://azure.microsoft.com/products/virtual-desktop/) VMs are to reside.

## Related resources

For more information on the Azure services available in each region, see [Products available by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region).
