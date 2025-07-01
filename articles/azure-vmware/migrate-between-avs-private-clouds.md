---
title: Migrate workloads between Azure VMware Solution private clouds
description: Use VMware HCX to migrate workloads between Azure VMware Solution private clouds.
ms.topic: how-to
ms.service: azure-vmware
ms.custom: engagement-fy26
ms.date: 07/01/2025
---

# Migrate workloads between Azure VMware Solution private clouds

> [!NOTE]
>  On June 30, 2025, Microsoft has announced the end of sale for 3-year Reserved Instances for AV36 nodes, with AV36 node retirement on June 25, 2028. If you are using AV36 nodes currently, see [Migrate workloads to a new SKU as AV36 nodes retire](#migrate-workloads-to-a-new-sku-as-av36-nodes-retire) for guidance on planning your migration to our different Azure VMware Solution SKU offerings.

Azure VMware Solution customers often need to migrate workloads between private clouds in scenarios such as moving to a different Azure region, changing SKUs, or consolidating environments. You can use **VMware HCX** to perform these migrations seamlessly, using **similar steps to migrating workloads from on-premises environments to Azure VMware Solution**.

VMware HCX enables you to move workloads with minimal downtime, maintain consistent IP addressing if needed, and preserve operational continuity while modernizing or rebalancing your Azure VMware Solution environment.

This article teaches you how to:

- Plan migration between Azure VMware Solution private clouds.
- Configure VMware HCX for cloud-to-cloud migration.
- Perform workload migrations using HCX.

## Prerequisites

- Two Azure VMware Solution private clouds (source and destination) deployed within your Azure subscriptions.
- VMware HCX deployed in both private clouds with appropriate licensing.
- [ExpressRoute Global Reach](../expressroute/expressroute-global-reach.md) if your private clouds reside in different Azure regions.

## Enable VMware HCX in both private clouds

If not yet installed, follow [Install VMware HCX in Azure VMware Solution](install-vmware-hcx.md) to install and activate HCX Cloud Manager on both the source and destination private clouds.

> [!NOTE]
> VMware HCX Enterprise is included with Azure VMware Solution and is recommended for advanced migration capabilities such as Replication Assisted vMotion (RAV) and Mobility Optimized Networking (MON).

## Configure site pairing between the private clouds

To enable migration, pair the source and destination Azure VMware Solution HCX instances.

The process to pair two Azure VMware Solution private clouds is **the same as pairing an on-premises private cloud with Azure VMware Solution**. You will use the source Azure VMware Solution HCX Manager to initiate the pairing using the destination Azure VMware Solution HCX Manager FQDN or IP address, validate connectivity, and accept the SSL thumbprint to complete the pairing.

For detailed, step-by-step instructions, see [Add a site pairing](configure-vmware-hcx.md#add-a-site-pairing).

## Extend networks between the private clouds (if needed)

If you need to retain IP addresses across the private clouds during migration, use **HCX Network Extension** to extend VLAN-backed networks to the destination Azure VMware Solution environment.

The process for extending networks between two Azure VMware Solution environments is **the same as extending networks from on-premises to Azure VMware Solution**. This includes selecting the required networks, extending them using HCX, and validating connectivity and routing.

For detailed instructions, see [Extend networks using VMware HCX in Azure VMware Solution](configure-hcx-network-extension.md).

# Migrate workloads to a new SKU as AV36 nodes retire

Microsoft has announced the end of sale for 3-year Reserved Instances for **AV36 nodes on June 30, 2025**, with **AV36 node retirement on June 25, 2028**. To prepare for this change, you will need to transition your workloads from AV36-based private clouds to a new Azure VMware Solution SKU before the retirement date. The instructions outlined above will work to help you migrate your VMware workloads to a different SKU offering on Azure VMware Solution. 

## What SKU is right for me?

[Fill this out].



