---
title: Moving Azure VMs to another region with Azure Site Recovery
description: Using Azure Site Recovery to move Azure VMs from one Azure region to another.
author: Jeronika-MS
ms.service: azure-site-recovery
ms.topic: tutorial
ms.date: 02/11/2026
ms.author: v-gajeronika
ms.reviewer: v-gajeronika
ms.custom: MVC, engagement-fy23
# Customer intent: "As a cloud administrator, I want to move Azure VMs to a different region using Azure Site Recovery, so that I can improve application performance and meet availability requirements through reduced latency and enhanced service level agreements."
---

# Moving Azure VMs to another Azure region

This article provides an overview of the reasons and steps involved in moving Azure VMs to another Azure region by using [Azure Site Recovery](site-recovery-overview.md). 


## Reasons to move Azure VMs

You might move VMs for the following reasons:

- You deployed VMs in one region, and a new region support was added that is closer to the end users of your application or service. In this scenario, you want to move your VMs as is to the new region to reduce latency. Use the same approach if you want to consolidate subscriptions or if governance or organization rules require you to move.
- You deployed your VM as a single-instance VM or as part of an availability set. If you want to increase the availability SLAs, you can move your VMs into an Availability Zone.

## Move VMs with Resource Mover

You can now move VMs to another region by using [Azure Resource Mover](../resource-mover/tutorial-move-region-virtual-machines.md). Resource Mover is in public preview and provides:
- A single hub for moving resources across regions.
- Reduced move time and complexity. Everything you need is in a single location.
- A simple and consistent experience for moving different types of Azure resources.
- An easy way to identify dependencies across resources you want to move. This helps you move related resources together, so that everything works as expected in the target region after the move.
- Automatic cleanup of resources in the source region, if you want to delete them after the move.
- Testing. You can try out a move, and then discard it if you don't want to do a full move.



## Move VMs by using Site Recovery

Moving VMs by using Site Recovery involves the following steps:

1. Verify prerequisites.
1. Prepare the source VMs.
1. Prepare the target region.
1. Copy data to the target region. Use Azure Site Recovery replication technology to copy data from the source VM to the target region.
1. Test the configuration. After the replication completes, test the configuration by performing a test failover to a non-production network.
1. Perform the move.
1. Discard the resources in the source region.

> [!NOTE]
> The following sections provide details about these steps.
> [!IMPORTANT]
> Currently, Azure Site Recovery supports moving VMs from one region to another but doesn't support moving VMs within a region.

## Typical architectures for a multi-tier deployment

This section describes the most common deployment architectures for a multi-tier application in Azure. The example is a three-tiered application with a public IP. Each tier (web, application, and database) has two VMs, and an Azure load balancer connects them to the other tiers. The database tier uses SQL Server Always On replication between the VMs for high availability.

* **Single-instance VMs deployed across various tiers**: You configure each VM in a tier as a single-instance VM and connect it by load balancers to the other tiers. This configuration is the simplest to adopt.

     :::image type="content" source="media/move-vm-overview/regular-deployment.png" alt-text="Selection to move single-instance VM deployment across tiers.":::

* **VMs in each tier deployed across availability sets**: You configure each VM in a tier in an availability set. [Availability sets](/azure/virtual-machines/windows/tutorial-availability-sets) ensure that the VMs you deploy on Azure are distributed across multiple isolated hardware nodes in a cluster. This distribution ensures that if a hardware or software failure within Azure happens, only a subset of your VMs are affected, and your overall solution remains available and operational.

     :::image type="content" source="media/move-vm-overview/avset.png" alt-text="VM deployment across availability sets.":::

* **VMs in each tier deployed across Availability Zones**: You configure each VM in a tier across [Availability Zones](/azure/reliability/availability-zones-overview). An Availability Zone in an Azure region is a combination of a fault domain and an update domain. For example, if you create three or more VMs across three zones in an Azure region, your VMs are effectively distributed across three fault domains and three update domains. The Azure platform recognizes this distribution across update domains to make sure that VMs in different zones aren't updated at the same time.

     :::image type="content" source="media/move-vm-overview/zone.png" alt-text="Availability Zone deployment.":::

## Move VMs as is to a target region

Based on the [architectures](#typical-architectures-for-a-multi-tier-deployment) mentioned earlier, here's what the deployments look like after you perform the move as is to the target region.

* **Single-instance VMs deployed across various tiers**
* **VMs in each tier deployed across availability sets**
* **VMs in each tier deployed across Availability Zones**

## Move VMs to increase availability

* **Single-instance VMs deployed across various tiers**

     :::image type="content" source="media/move-vm-overview/single-zone.png" alt-text="Single-instance VM deployment across tiers.":::

* **VMs in each tier deployed across availability sets**: You can configure your VMs in an availability set into separate Availability Zones when you enable replication for your VM by using Azure Site Recovery. The SLA for availability is 99.99% after you complete the move operation.

     :::image type="content" source="media/move-vm-overview/aset-azone.png" alt-text="VM deployment across availability sets and Availability Zones.":::

## Next steps

- [Move Azure VMs to another region](azure-to-azure-tutorial-migrate.md)
- [Move Azure VMs into Availability Zones](move-azure-vms-avset-azone.md)


