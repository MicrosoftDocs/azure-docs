---
title: Reliability in Azure Bastion
description: Learn about resiliency in Azure Bastion, including resilience to transient faults, availability zone failures, and region failures.
author: anaharris-ms 
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: azure-bastion
ms.date: 10/09/2025
ai-usage: ai-assisted
---

# Reliability in Azure Bastion

[Azure Bastion](/azure/bastion/bastion-overview) is a fully managed platform as a service (PaaS) that you provision to provide high-security connections to virtual machines via a private IP address. It provides seamless RDP/SSH connectivity to your virtual machines directly over TLS from the Azure portal, or via the native SSH or RDP client that's already installed on your local computer. When you connect via Azure Bastion, your virtual machines don't need a public IP address, an agent, or special client software.

[!INCLUDE [Shared responsibility](includes/reliability-shared-responsibility-include.md)]

This article describes how to make Azure Bastion resilient to a variety of potential outages and problems, including transient faults, availability zone outages, and region outages. It highlights some key information about the Azure Bastion service level agreement (SLA).

> [!IMPORTANT]
> Availability zone support for Azure Bastion is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability.

## Production deployment recommendations

For production workloads, we recommend that you:

> [!div class="checklist"]
> - Use the Basic SKU or higher.
> - [Enable zone redundancy](#resilience-to-availability-zone-failures) if your bastion host is in a supported region.

## Reliability architecture overview

When you use Azure Bastion, you must deploy a *bastion host* to a subnet that [meets Azure Bastion's requirements](/azure/bastion/configuration-settings#subnet).

A bastion host has a defined number of *instances*, which are also sometimes called *scale units*. Each instance represents a single dedicated VM that handles your Azure Bastion connections. The platform automatically manages instance creation, health monitoring, and replacement of unhealthy instances, so you don't see or manage the VMs directly. 

The Basic SKU supports exactly two instances. Standard and Premium SKUs support *host scaling*, where you can configure the number of instances, with a minimum of two instances. When you add more instances, your bastion host can accommodate additional concurrent client connections.

## Resilience to transient faults

[!INCLUDE [Resilience to transient faults](includes/reliability-transient-fault-description-include.md)]

If transient faults affect your virtual machine or bastion host, clients using the secure sockets host (SSH) and Remote Desktop Protocol (RDP) protocols typically retry automatically.

## Resilience to availability zone failures

[!INCLUDE [Resilience to availability zone failures](includes/reliability-availability-zone-description-include.md)]

Azure Bastion supports availability zones in both zone-redundant and zonal configurations:

- *Zone-redundant:* A zone-redundant bastion host achieves resiliency and reliability by spreading its instances across multiple [availability zones](../reliability/availability-zones-overview.md). You select which availability zones you want to use for your bastion host. 
    
    The following diagram shows a zone-redundant bastion host, with its instances spread across three zones:
   
    :::image type="content" source="media/reliability-bastion/zone-redundant.svg" alt-text="Diagram that shows Azure Bastion with three instances distributed across three availability zones to illustrate zone-redundant deployment." border="false":::

    If you specify more availability zones than you have instances, Azure Bastion spreads instances across as many zones as it can.

- *Zonal:* A zonal bastion host and all its instances are in a single availability zone that you select.

    [!INCLUDE [Zonal resource description](includes/reliability-availability-zone-zonal-include.md)]

### Requirements

- **Region support:** Zonal and zone-redundant bastion hosts can be deployed into the following regions:

    [!INCLUDE [Azure Bastion availability zone region support](../bastion/includes/availability-zone-regions-include.md)]

- **SKU:** To configure bastion hosts to be zonal or zone redundant, you must deploy with the Basic, Standard, or Premium SKUs.

- **Public IP address:** Azure Bastion requires a Standard SKU zone-redundant Public IP address.

### Cost

There's no additional cost to use availability zone support for Azure Bastion. Charges are based on your bastion host's SKU and the number of instances that it uses. For information, see [Azure Bastion pricing](https://azure.microsoft.com/pricing/details/azure-bastion/).

### Configure availability zone support

- **Deploy a new bastion host with availability zone support:** When you deploy a new bastion host in a [region that supports availability zones](#requirements), you select the specific zones that you want to deploy to.

    For zone redundancy, you must select multiple zones.

    [!INCLUDE [Availability zone numbering](./includes/reliability-availability-zone-numbering-include.md)]

- **Existing bastion hosts:** It's not possible to change the availability zone configuration of an existing bastion host. Instead, you need to create a bastion host with the new configuration and delete the old one.

### Behavior when all zones are healthy

This section describes what to expect when bastion hosts are configured for availability zone support and all availability zones are operational.

- **Traffic routing between zones:** When you initiate an SSH or RDP session, it can be routed to an Azure Bastion instance in any of the availability zones you selected.

    If you configure zone redundancy on your bastion host, a session might be sent to a bastion instance in an availability zone that's different from the virtual machine you're connecting to. In the following diagram, a request from the user is sent to an Azure Bastion instance in zone 2, although the virtual machine is in zone 1:

    <!-- Art Library Source# ConceptArt-0-000-015- -->
    :::image type="content" source="./media/reliability-bastion/instance-zone-traffic.svg" alt-text="Diagram that shows Azure Bastion with three instances. A user request goes to an Azure Bastion instance in zone 2 and is sent to a VM in zone 1." border="false":::

   > [!TIP]
   > In most scenarios, the amount of cross-zone latency isn't significant. However, if you have unusually stringent latency requirements for your workloads, you should deploy a dedicated single-zone bastion host in the virtual machine's availability zone. Keep in mind that this configuration doesn't provide zone redundancy, and we don't recommend it for most customers.

- **Data replication between zones:** Because Azure Bastion doesn't store state, there's no data to replicate between zones.

### Behavior during a zone failure

This section describes what to expect when bastion hosts are configured for availability zone support and there's an availability zone outage.

- **Detection and response:** When you use zone redundancy, Azure Bastion detects and responds to failures in an availability zone. You don't need to do anything to initiate an availability zone failover.

    For zone-redundant instances, Azure Bastion makes a best-effort attempt to replace any instances that are lost due to a zone outage. However, it isn't guaranteed that instances will be replaced.

[!INCLUDE [Availability zone down notification (Service Health and Resource Health)](./includes/reliability-availability-zone-down-notification-service-resource-include.md)]

- **Active requests:** When an availability zone is unavailable, any RDP or SSH connections in progress that use an Azure Bastion instance in the faulty availability zone are terminated and need to be retried.

    If the VM you're connecting to isn't in the affected availability zone, it continues to run.  For more information on the VM zone-down experience, see [Reliability in VMs - Behavior during a zone failure](./reliability-virtual-machines.md#behavior-during-a-zone-failure).

- **Expected downtime:** The expected downtime depends on the availability zone configuration that your bastion host uses.

    - *Zone-redundant:* A small amount of downtime might occur while the service recovers operations. This downtime is typically a few seconds.

    - *Zonal:* Your instance is unavailable until the availability zone recovers.

- **Expected data loss:** Because Azure Bastion doesn't store state, there's no data loss expected during a zone failure.

- **Traffic rerouting:** When you use zone redundancy, new connections use Azure Bastion instances in the healthy availability zones. Overall, Azure Bastion remains operational.

### Zone recovery

When the availability zone recovers, Azure Bastion automatically restores instances in the availability zone, and reroutes traffic between your instances as normal.

### Test for zone failures

The Azure Bastion platform manages traffic routing, failover, and failback for zone-redundant bastion hosts. Because this feature is fully managed, you don't need to initiate anything or validate availability zone failure processes.

## Resilience to region-wide failures

Azure Bastion is deployed within virtual networks or peered virtual networks and is associated with an Azure region. Azure Bastion is a single-region service. If the region becomes unavailable, your bastion host is also unavailable.

Azure Bastion supports reaching virtual machines in globally peered virtual networks, but if the region that hosts your bastion host is unavailable, you won't be able to use your bastion host. For higher resiliency, if you deploy your overall solution into multiple regions with separate virtual networks in each region, you should deploy Azure Bastion into each region.

If you have a disaster recovery site in another Azure region, be sure to deploy Azure Bastion into the virtual network in that region.

## Service-level agreement

[!INCLUDE [SLA description](includes/reliability-service-level-agreement-include.md)]

## Related content

- [Reliability in Azure](./overview.md)
