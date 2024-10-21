---
title: Reliability in Azure Bastion
description: Find out about reliability in Azure Bastion  
author: anaharris-ms 
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-bastion
ms.date: 06/24/2024
---

# Reliability in Azure Bastion

This article describes reliability support in Azure Bastion and covers both intra-regional resiliency with [availability zones](#availability-zone-support) and information on [multi-region deployments](#cross-region-disaster-recovery-and-business-continuity). For a more detailed overview of reliability principles in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview). <!-- TODO revise link to WAF? -->

Azure Bastion provides private, secure remote access to virtual machines hosted in your Azure virtual networks without exposing public IP addresses. You deploy Azure Bastion into a virtual network and can use it to access virtual machines within the virtual network or in peered virtual networks.

<!-- TODO I don't know if these recs are reasonable or not -->
> [!NOTE]
> For production deployments, you should:
> - Use standard or premium Azure Bastion resources.
> - [Enable zone redundancy](#availability-zone-support).

## Transient faults

Transient faults are short, intermittent failures in components. They occur frequently in a distributed environment like the cloud, and they're a normal part of operations. They correct themselves after a short period of time. It's important that your applications handle transient faults, usually by retrying affected requests.

The Azure Bastion service enables you to use the secure sockets host (SSH) and remote desktop connection (RDP) protocols. If transient faults affect your virtual machine or Azure Bastion host, clients using these protocols typically retry automatically.

## Availability zone support

Azure Bastion can be configured to be *zone-redundant*, which means your resources are spread across multiple [availability zones](../reliability/availability-zones-overview.md) to help you achieve resiliency and reliability for your production workloads.

You can specify which availability zone or zones an Azure Bastion resource should be deployed in. If you deploy into three availability zones but only configure two instances for your Bastion resource, the instances will be split across two availability zones, and if an availability zone is unavailable, the instance in the faulty zone will be replaced with another instance in a healthy zone.

> [!NOTE]
> Azure Bastion support for zone redundancy is currently in preview.

### Requirements

<!-- TODO check this -->
You can configure zone redundancy on Azure Bastion resources with the Basic, Standard, and Premium SKUs. The Developer SKU doesn't support zone redundancy.

### Regions supported

Azure Bastion support for availability zones is currently in preview. During preview, zone-redundant Azure Bastion reosurces can be deployed into the following regions:

| Americas | Europe | Middle East | Africa | Asia Pacific |
|---|---|---|---|---|
| Canada Central | North Europe | Qatar Central | South Africa North | Australia East |
| Central US | Sweden Central | | |
| East US | UK South
| East US 2 | West Europe | | |
| West US 2  | | | |

<!-- TODO what does this mean? -->
If you've previously deployed an Azure Bastion resource in one of the following regions, it might already be zone-redundant:

- Korea Central 
- Southeast Asia

### Cost

There's no additional cost to use zone redundancy for Azure Bastion.

### Configure availability zone support

**New resources:** When you deploy a new Bastion resource in a [region that supports availabiilty zones](#regions-supported), you select the specific zones you want to deploy to. Select multiple zones for zone redundancy. You can't change the availability zone setting after your Bastion resource is deployed.

**Migration:** Migration from non-availability zone support to availability zone support isn't possible. Instead, you need to create a Bastion resource in the new region and delete the old one.

### Traffic routing between zones

<!-- TODO waiting on PG -->

### Zone-down experience

**Detection and response:** Azure Bastion detects a failure in an availability zone and responding. You don't need to do anything to initiate a availability zone failover.

<!-- TODO any logs? -->

**Active requests:** When an availability zone is unavailable, any RDP or SSH connections in progress that use an Azure Bastion instance in the faulty availability zone are terminated and need to be retried.

If the VM you're connecting to isn't in the affected availability zone, the VM continues to be accessible. See [Reliability in Virtual Machines: Zone down experience](./reliability-virtual-machines.md#zone-down-experience) for more information on the VM zone down experience.

**Traffic rerouting:** New connections use Azure Bastion instances in the surviving availability zones. Overall, Azure Bastion continues to remain operational.

### Failback

When the availability zone recovers, Azure Bastion automatically restores instances in the availability zone, removes any temporary instances created in the other availability zones, and reroutes traffic between your instances as normal.

### Testing for zone failures

The Azure Bastion platform manages traffic routing, failover, and failback for zone-redundant Azure Bastion resources. You don't need to initiate anything. Because this feature is fully managed, you don't need to validate availability zone failure processes.

## Multi-region support

Azure Bastion is deployed within virtual networks or peered virtual networks, and is associated with an Azure region. Azure Bastion is a single-region service. If the region becomes unavailable, your Bastion resource is also unavailable.

Azure Bastion supports reaching VMs in globally peered virtual networks, but if the region that hosts your Azure Bastion resource is unavailable, you won't be able to use your Bastion resource. For higher resiliency, if you deploy your overall solution into multiple regions with separate virtual networks in each region, you should deploy Azure Bastion into each region.

If you have a disaster recovery (DR) site in another Azure region, ensure you deploy Azure Bastion into the virtual network in that region.

## Service-level agreement (SLA)

The service-level agreement (SLA) for Azure Bastion describes the expected availability of the service, and the conditions that must be met to achieve that availability expectation. To understand those conditions, it's important that you review the [Service Level Agreements (SLA) for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

## Related content

> [!div class="nextstepaction"]
> [Reliability in Azure](./overview.md)
