---
title: Reliability in Azure Bastion
description: Find out about reliability in Azure Bastion, including availability zones and multi-region deployments.
author: anaharris-ms 
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: azure-bastion
ms.date: 08/27/2025
---

# Reliability in Azure Bastion

This article describes reliability support in Azure Bastion. It covers intra-regional resiliency via [availability zones](#availability-zone-support). It also covers [multi-region deployments](#multi-region-support).

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

> [!IMPORTANT]
> Availability zone support for Azure Bastion is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability.

Azure Bastion is a fully managed platform as a service (PaaS) that you provision to provide high-security connections to virtual machines via a private IP address. It provides seamless RDP/SSH connectivity to your virtual machines directly over TLS from the Azure portal, or via the native SSH or RDP client that's already installed on your local computer. When you connect via Azure Bastion, your virtual machines don't need a public IP address, an agent, or special client software.

## Production deployment recommendations

For production deployments, you should [enable zone redundancy](#availability-zone-support) if your bastion hosts are in a supported region.

## Reliability architecture overview

When you use Azure Bastion, you deploy a *bastion host*. You must deploy it to a subnet that [meets Azure Bastion's requirements](/azure/bastion/configuration-settings#subnet).

A bastion host has a defined number of *instances*, which are also sometimes called *scale units*. The Standard SKU supports *host scaling*, where you configure the number of instances. Adding more instances helps to accommodate additional concurrent client connections. The Basic SKU supports exactly two instances.

Each instance represents a dedicated VM that handles traffic. One instance is equal to one VM. You don't see or manage the VMs directly. The platform automatically manages instance creation, health monitoring, and replacement of unhealthy instances.

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

If transient faults affect your virtual machine or Azure Bastion host, clients using the secure sockets host (SSH) and Remote Desktop Protocol (RDP) protocols typically retry automatically.

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure Bastion supports availability zones in both zone-redundant and zonal configurations:

- *Zone-redundant:* Enabling zone redundancy for a bastion host spreads its instances across multiple [availability zones](../reliability/availability-zones-overview.md). By spreading instances across availability zones, you can achieve resiliency and reliability for your production workloads.
    
    The following diagram shows a zone-redundant bastion host, with its instances spread across three zones:
   
    :::image type="content" source="media/bastion/bastion-instances-zones.png" alt-text="Diagram that shows an Azure Bastion bastion host with three instances, each in a separate availability zone." border="false":::

    If you specify more availability zones than you have instances, Azure Bastion spreads instances across as many zones as it can.

- *Zonal:* You can select a single availability zone for a bastion host.

   > [!IMPORTANT]
   > Pinning to a single availability zone is only recommended when [cross-zone latency](./availability-zones-overview.md#inter-zone-latency) is too high for your needs and after you verify that the latency doesn't meet your requirements. By itself, a zonal bastion host doesn't provide resiliency to an availability zone outage. To improve the resiliency of a zonal bastion host, you need to explicitly deploy separate bastion hosts into multiple availability zones and configure traffic routing and failover.

### Regions supported

Zonal and zone-redundant bastion hosts can be deployed into the following regions:

| Americas | Europe | Middle East | Africa | Asia Pacific |
|---|---|---|---|---|
| Canada Central | North Europe | Qatar Central | South Africa North | Australia East |
| Central US | Sweden Central | Israel Central | | Korea Central |
| East US | UK South
| East US 2 | West Europe | | |
| West US 2  | Norway East | | |
| East US 2 EUAP | Italy North | | |
| Mexico Central| Spain Central | | |

### Requirements

- To configure bastion hosts to be zonal or zone redundant, you must deploy with the Basic, Standard, or Premium SKUs.

- Azure Bastion requires a Standard SKU zone-redundant Public IP address.

### Cost

There's no additional cost to use zone redundancy for Azure Bastion.

### Configure availability zone support

- **Deploy a new bastion host with availability zone support:** When you deploy a new bastion host in a [region that supports availability zones](#regions-supported), you select the specific zones that you want to deploy to.

    For zone redundancy, you must select multiple zones.

    [!INCLUDE [Availability zone numbering](./includes/reliability-availability-zone-numbering-include.md)]

- **Existing bastion hosts:** It's not possible to change the availability zone configuration of an existing bastion host. Instead, you need to create an bastion host with the new configuration and delete the old one.

### Normal operations

This section describes what to expect when bastion hosts are configured for availability zone support and all availability zones are operational.

- **Traffic routing between zones:** When you initiate an SSH or RDP session, it can be routed to an Azure Bastion instance in any of the availability zones you selected.

    If you configure zone redundancy on Azure Bastion, a session might be sent to an Azure Bastion instance in an availability zone that's different from the virtual machine you're connecting to. In the following diagram, a request from the user is sent to an Azure Bastion instance in zone 2, although the virtual machine is in zone 1:

    <!-- Art Library Source# ConceptArt-0-000-015- -->
    :::image type="content" source="./media/bastion/bastion-instance-zone-traffic.png" alt-text="Diagram that shows Azure Bastion with three instances. A user request goes to an Azure Bastion instance in zone 2 and is sent to a VM in zone 1." border="false":::

   > [!TIP]
   > In most scenarios, the amount of cross-zone latency isn't significant. However, if you have unusually stringent latency requirements your workloads, you should deploy a dedicated single-zone Azure Bastion instance in the virtual machine's availability zone. Keep in mind that this configuration doesn't provide zone redundancy, and we don't recommend it for most customers.

- **Data replication between zones:** Because Azure Bastion doesn't store state, there's no data to replicate between zones.

### Zone-down experience

This section describes what to expect when bastion hosts are configured for availability zone support and there's an availability zone outage.

- **Detection and response:** When you use zone redundancy, Azure Bastion detects and responds to failures in an availability zone. You don't need to do anything to initiate an availability zone failover.

    For zone-redundant instances, Azure Bastion makes a best-effort attempt to replace any instances that are lost due to a zone outage. However, it isn't guaranteed that instances will be replaced.

- **Notification**: Azure Bastion doesn't notify you when a zone is down. However, you can use [Azure Resource Health](/azure/service-health/resource-health-overview) to monitor for the health of your basion host. You can also use [Azure Service Health](/azure/service-health/overview) to understand the overall health of the Azure Bastion service, including any zone failures.

  Set up alerts on these services to receive notifications of zone-level problems. For more information, see [Create Service Health alerts in the Azure portal](/azure/service-health/alerts-activity-log-service-notifications-portal) and [Create and configure Resource Health alerts](/azure/service-health/resource-health-alert-arm-template-guide).

- **Active requests:** When an availability zone is unavailable, any RDP or SSH connections in progress that use an Azure Bastion instance in the faulty availability zone are terminated and need to be retried.

    If the virtual machine you're connecting to isn't in the affected availability zone, the virtual machine continues to run. See [Reliability in virtual machines: Zone down experience](./reliability-virtual-machines.md#zone-down-experience) for more information on the VM zone-down experience.

- **Expected downtime:** The expected downtime depends on the availability zone configuration that your Azure Bastion instance uses.

    - *Zone-redundant:* A small amount of downtime might occur while the service recovers operations. This downtime is typically a few seconds.

    - *Zonal:* Your instance is unavailable until the availability zone recovers.

- **Expected data loss:** Because Azure Bastion doesn't store state, there's no data loss expected during a zone failure.

- **Traffic rerouting:** When you use zone redundancy, new connections use Azure Bastion instances in the surviving availability zones. Overall, Azure Bastion remains operational.

### Zone recovery

When the availability zone recovers, Azure Bastion automatically restores instances in the availability zone, and reroutes traffic between your instances as normal.

### Testing for zone failures

The Azure Bastion platform manages traffic routing, failover, and failback for zone-redundant bastion hosts. Because this feature is fully managed, you don't need to initiate anything or validate availability zone failure processes.

## Multi-region support

Azure Bastion is deployed within virtual networks or peered virtual networks and is associated with an Azure region. Azure Bastion is a single-region service. If the region becomes unavailable, your bastion host is also unavailable.

Azure Bastion supports reaching virtual machines in globally peered virtual networks, but if the region that hosts your bastion host is unavailable, you won't be able to use your bastion host. For higher resiliency, if you deploy your overall solution into multiple regions with separate virtual networks in each region, you should deploy Azure Bastion into each region.

If you have a disaster recovery site in another Azure region, be sure to deploy Azure Bastion into the virtual network in that region.

## Service-level agreement

[!INCLUDE [SLA description](includes/reliability-service-level-agreement-include.md)]

## Related content

- [Reliability in Azure](./overview.md)
