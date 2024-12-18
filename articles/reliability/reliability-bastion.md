---
title: Reliability in Azure Bastion
description: Find out about reliability in Azure Bastion, including availability zones and multi-region deployments.
author: anaharris-ms 
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: azure-bastion
ms.date: 11/21/2024

---

# Reliability in Azure Bastion

This article describes reliability support in Azure Bastion. It covers intra-regional resiliency via [availability zones](#availability-zone-support). It also covers [multi-region deployments](#multi-region-support).

Because resiliency is a shared responsibility between you and Microsoft, this article also covers ways for you to create a resilient solution that meets your needs.

> [!IMPORTANT]
> Zone redundancy features for Azure Bastion resources are currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability.

Azure Bastion is a fully managed platform as a service (PaaS) that you provision to provide high-security connections to virtual machines via a private IP address. It provides seamless RDP/SSH connectivity to your virtual machines directly over TLS from the Azure portal, or via the native SSH or RDP client that's already installed on your local computer. When you connect via Azure Bastion, your virtual machines don't need a public IP address, an agent, or special client software.

## Production deployment recommendations

For production deployments, you should [enable zone redundancy](#availability-zone-support) if your Azure Bastion resources are in a supported region.

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

If transient faults affect your virtual machine or Azure Bastion host, clients using the secure sockets host (SSH) and Remote Desktop Protocol (RDP) protocols typically retry automatically.

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure Bastion supports availability zones in both zonal and zone-redundant configurations:

- *Zonal:* You can select a single availability zone for an Azure Bastion resource.

   > [!NOTE]
   > Pinning to a single zone doesn’t increase resiliency. To improve resiliency, you need to either use a zone-redundant configuration or explicitly deploy resources into multiple zones.

- *Zone-redundant:* Enabling zone redundancy for an Azure Bastion resource spreads your instances across multiple [availability zones](../reliability/availability-zones-overview.md). When you spread resources across availability zones, you can achieve resiliency and reliability for your production workloads.
    
    The following diagram shows a zone-redundant Azure Bastion resource, with its instances spread across three zones:
    
    <!-- Art Library Source# ConceptArt-0-000-015- -->
    :::image type="content" source="media/bastion/bastion-instances-zones.svg" alt-text="Diagram that shows Azure Bastion with three instances, each in a separate availability zone." border="false":::

    > [!NOTE]
    > If you specify more availability zones than you have instances, Azure Bastion spreads instances across as many zones as it can. If an availability zone is unavailable, the instance in the faulty zone is replaced with another instance in a healthy zone.

### Regions supported

Zonal and zone-redundant Azure Bastion resources can be deployed into the following regions:

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

- To configure Azure Bastion resources to be zonal or zone redundant, you must deploy with the Basic, Standard, or Premium SKUs.

- Azure Bastion requires a Standard SKU zone-redundant Public IP address.

### Cost

There's no additional cost to use zone redundancy for Azure Bastion.

### Configure availability zone support

**New resources:** When you deploy a new Azure Bastion resource in a [region that supports availability zones](#regions-supported), you select the specific zones that you want to deploy to. For zone redundancy, you must select multiple zones.

   >[!IMPORTANT]
   > You can't change the availability zone setting after you deploy your Azure Bastion resource.

[!INCLUDE [Availability zone numbering](./includes/reliability-availability-zone-numbering-include.md)]

**Migration:** It's not possible to change the availability zone configuration of an existing Azure Bastion resource. Instead, you need to create an Azure Bastion resource with the new configuration and delete the old one.

### Traffic routing between zones

When you initiate an SSH or RDP session, it can be routed to an Azure Bastion instance in any of the availability zones you selected.

If you configure zone redundancy on Azure Bastion, a session might be sent to an Azure Bastion instance in an availability zone that's different from the virtual machine you're connecting to. In the following diagram, a request from the user is sent to an Azure Bastion instance in zone 2, although the virtual machine is in zone 1:

<!-- Art Library Source# ConceptArt-0-000-015- -->
:::image type="content" source="./media/bastion/bastion-instance-zone-traffic.svg" alt-text="Diagram that shows Azure Bastion with three instances. A user request goes to an Azure Bastion instance in zone 2 and is sent to a VM in zone 1." border="false":::

In most scenarios, the small amount of cross-zone latency isn't significant. However, if you have unusually stringent latency requirements for your Azure Bastion workloads, you should deploy a dedicated single-zone Azure Bastion instance in the virtual machine's availability zone. This configuration doesn't provide zone redundancy, and we don't recommend it for most customers.

### Zone-down experience

**Detection and response:** When you use zone redundancy, Azure Bastion detects and responds to failures in an availability zone. You don't need to do anything to initiate an availability zone failover.

**Active requests:** When an availability zone is unavailable, any RDP or SSH connections in progress that use an Azure Bastion instance in the faulty availability zone are terminated and need to be retried.

If the virtual machine you're connecting to isn't in the affected availability zone, the virtual machine continues to be accessible. See [Reliability in virtual machines: Zone down experience](./reliability-virtual-machines.md#zone-down-experience) for more information on the VM zone down experience.

**Traffic rerouting:** When you use zone redundancy, new connections use Azure Bastion instances in the surviving availability zones. Overall, Azure Bastion remains operational.

### Failback

When the availability zone recovers, Azure Bastion:

- Automatically restores instances in the availability zone.
- Removes any temporary instances created in the other availability zones.
- Reroutes traffic between your instances as normal.

### Testing for zone failures

The Azure Bastion platform manages traffic routing, failover, and failback for zone-redundant Azure Bastion resources. Because this feature is fully managed, you don't need to initiate anything or validate availability zone failure processes.

## Multi-region support

Azure Bastion is deployed within virtual networks or peered virtual networks and is associated with an Azure region. Azure Bastion is a single-region service. If the region becomes unavailable, your Azure Bastion resource is also unavailable.

Azure Bastion supports reaching virtual machines in globally peered virtual networks, but if the region that hosts your Azure Bastion resource is unavailable, you won't be able to use your Azure Bastion resource. For higher resiliency, if you deploy your overall solution into multiple regions with separate virtual networks in each region, you should deploy Azure Bastion into each region.

If you have a disaster recovery site in another Azure region, be sure to deploy Azure Bastion into the virtual network in that region.

## Service-level agreement

The service-level agreement (SLA) for Azure Bastion describes the expected availability of the service and the conditions that must be met to achieve that availability expectation. To understand those conditions, it's important that you review the [SLA for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

## Related content

- [Reliability in Azure](./overview.md)
