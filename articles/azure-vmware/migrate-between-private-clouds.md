---
title: Migrate workloads between Azure VMware Solution private clouds
description: Use VMware HCX to migrate workloads between Azure VMware Solution private clouds.
ms.topic: how-to
ms.service: azure-vmware
ms.custom: engagement-fy26
ms.date: 07/07/2025
---

# Migrate workloads between Azure VMware Solution private clouds

Azure VMware Solution customers often need to migrate workloads between private clouds in scenarios such as moving to a different Azure region, changing SKUs, or consolidating environments. You can use **VMware HCX** to perform these migrations seamlessly, using **similar steps to migrating workloads from on-premises environments to Azure VMware Solution**.

VMware HCX enables you to move workloads with minimal downtime, maintain consistent IP addressing if needed, and preserve operational continuity while modernizing or rebalancing your Azure VMware Solution environment.

This article teaches you how to:

- Plan migration between Azure VMware Solution private clouds.
- Configure VMware HCX for cloud-to-cloud migration.
- Perform workload migrations using HCX.

## Prerequisites

- Two Azure VMware Solution private clouds (source and destination) deployed within your Azure subscriptions.
- VMware HCX deployed in both private clouds with appropriate licensing.
- Established connectivity between the two private clouds. [AVS Interconnect](connect-multiple-private-clouds-same-region.md) if your private clouds reside in the same region, or [ExpressRoute Global Reach](../expressroute/expressroute-global-reach.md) if your private clouds reside in different Azure regions.

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

## Considerations when migrating to an Azure VMware Solution Generation 2 private cloud

Azure VMware Solution Generation 2 private clouds currently have functionality, networking, and integration limitations that may affect your migration plans. Review these limitations to ensure your deployment aligns with current capabilities. For details, see [Design considerations for Azure VMware Solution Generation 2 Private Clouds](native-network-design-consideration.md).
