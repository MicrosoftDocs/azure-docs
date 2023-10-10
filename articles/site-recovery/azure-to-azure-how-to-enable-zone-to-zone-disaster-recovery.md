---
title: Enable zone-to-zone disaster recovery for Azure virtual machines
description: This article describes when and how to use zone-to-zone disaster recovery for Azure virtual machines.
author: ankitaduttaMSFT
manager: aravindang
ms.service: site-recovery
ms.topic: article
ms.date: 10/09/2023
ms.author: ankitadutta
ms.custom: references_regions
---

# Enable Azure VM disaster recovery between availability zones

This article describes how to replicate, fail over, and fail back Azure virtual machines (VMs) from one availability zone to another within the same Azure region.

The Azure Site Recovery service can contribute to your strategy for business continuity and disaster recovery by keeping your business apps running during planned and unplanned outages. We recommend Site Recovery as the disaster recovery option to keep your applications running if there are regional outages.

Availability zones are unique physical locations within an Azure region. Each zone has one or more datacenters.

If you want to move VMs to an availability zone in a different region, review [this article](../resource-mover/move-region-availability-zone.md).

## Supported regions for zone-to-zone disaster recovery

Support for zone-to-zone disaster recovery is currently limited to the following regions:

| Americas | Europe | Middle East | Africa | APAC |
|--------|--------------|-------------|--------|--------------|
| Canada Central | UK South | Qatar Central | South Africa North | Southeast Asia |
| US Gov Virginia | West Europe | | | East Asia |
| Central US | North Europe | UAE North | | Japan East |
| South Central US | Germany West Central | | | Korea Central |
| East US | Norway East | | | Australia East |
| East US 2 | France Central | | | Central India |
| West US 2 | Switzerland North | | | China North 3 |
| West US 3 | Sweden Central (managed access) | | |  |
| Brazil South | Poland Central | | | |
| | Italy North | | | |

When you use zone-to-zone disaster recovery, Site Recovery doesn't move or store data out of the region in which it's deployed. You can select a Recovery Services vault from a different region if you want one. The Recovery Services vault contains metadata but no actual customer data.

> [!Note]
> Zone-to-zone disaster recovery isn't supported for VMs that have managed disks via zone-redundant storage (ZRS).

## Availability zones for disaster recovery

Typically, customers use availability zones to deploy VMs in a high-availability configuration. Those VMs might be too close to each other to serve as a disaster recovery solution in natural disaster.

However, in some scenarios, customers can use availability zones for disaster recovery:

- Customers who had a metro disaster recovery strategy while hosting applications on-premises sometimes want to mimic this strategy after they migrate applications to Azure. These customers acknowledge the fact that a metro disaster recovery strategy might not work in a large-scale physical disaster and accept this risk. Such customers can use zone-to-zone disaster recovery.
- Many customers have complicated networking infrastructure and don't want to re-create it in a secondary region because of the associated cost and complexity. Zone-to-zone disaster recovery reduces complexity. It uses redundant networking concepts across availability zones to make configuration simpler. Such customers prefer simplicity and can also use availability zones for disaster recovery.
- In some regions that don't have a paired region within the same legal jurisdiction (for example, Southeast Asia), zone-to-zone disaster recovery can serve as the disaster recovery solution. It helps ensure legal compliance, because applications and data don't move across national boundaries.
- Zone-to-zone disaster recovery implies replication of data across shorter distances when compared with Azure-to-Azure disaster recovery. It can reduce latency and therefore reduce RPO.

Although these are strong advantages, there's a possibility that zone-to-zone disaster recovery can fall short of resilience requirements in the event of a region-wide natural disaster.

## Networking for zone-to-zone disaster recovery

As mentioned before, zone-to-zone disaster recovery uses redundant networking concepts across availability zones to reduce complexity. The behavior of networking components in the zone-to-zone disaster recovery scenario is outlined as follows:

- **Virtual network**: You can use the same virtual network as the source network for actual failovers. For test failovers, use a virtual network that's different from the source virtual network.
- **Subnet**: Failover into the same subnet is supported.
- **Private IP address**: If you're using static IP addresses, you can use the same IP addresses in the target zone if you choose to configure them that way.

    When you use Azure Site Recovery, you must have a free IP address available in the subnet for each VM for which you want to use the same IP address in the target zone. During failover, Azure Site Recovery allocates this free IP address to the source VM to free up the target IP address. Azure Site Recovery then allocates the target IP address to the target VM.
- **Accelerated networking**: Similar to Azure-to-Azure disaster recovery, you can enable accelerated networking if the VM type supports it.
- **Public IP address**: You can attach a previously created standard public IP address in the same region to the target VM. Basic public IP addresses don't support scenarios related to availability zones.
- **Load balancer**: A standard load balancer is a regional resource, so the target VM can be attached to the back-end pool of the same load balancer. A new load balancer isn't required.
- **Network security group**: You can use the same network security groups that you applied to the source VM.

## Prerequisites

Before you deploy zone-to-zone disaster recovery for your VMs, ensure that other features enabled on the VMs are interoperable with it.

|Feature  | Support statement  |
|---------|---------|
|VMs (classic)   |     Not supported.    |
|VMs (Azure Resource Manager)   |    Supported.    |
|Azure Disk Encryption v1 (dual pass, with Microsoft Entra ID)     |     Supported.    |
|Azure Disk Encryption v2 (single pass, without Microsoft Entra ID)    |    Supported.    |
|Unmanaged disks    |    Not supported.    |
|Managed disks    |    Supported.    |
|Customer-managed keys    |    Supported.    |
|Proximity placement groups    |    Supported.    |
|Backup interoperability    |    File-level backup and restore are supported. Disk and VM-level backup and restore aren't supported.    |
|Hot add/remove    |    You can add disks after you enable zone-to-zone replication. Removing disks after you enable zone-to-zone replication isn't supported.    |

## Set up Site Recovery zone-to-zone disaster recovery

### Sign in

Sign in to the Azure portal.

### Enable replication for the zonal Azure virtual machine

1. On the Azure portal menu, select **Virtual machines**, or search for and select **Virtual machines** on any page. Then select the VM that you want to replicate. For zone-to-zone disaster recovery, this VM must already be in an availability zone.
1. In **Operations**, select **Disaster recovery**.
1. On the **Basics** tab, for **Disaster recovery between availability zones?**, select **Yes**.

    :::image type="Basic Settings page" source="./media/azure-to-azure-how-to-enable-zone-to-zone-disaster-recovery/zonal-disaster-recovery-basic-settings.png" alt-text="Screenshot of the page for basic settings of disaster recovery.":::

1. If you accept all defaults, skip to the next step.

    If you want to make changes to the replication settings, select **Next: Advanced settings**. For users of Azure-to-Azure disaster recovery, this tab might seem familiar. For details about the options on this tab, see [Tutorial: Set up disaster recovery for Azure VMs](./azure-to-azure-tutorial-enable-replication.md).

    :::image type="Advanced Settings page" source="./media/azure-to-azure-how-to-enable-zone-to-zone-disaster-recovery/zonal-disaster-recovery-advanced-settings.png" alt-text="Screenshot of advanced settings for disaster recovery.":::

1. Select **Next: Review + Start replication**, and then select **Start replication**.

## FAQs

**How does pricing work for zone-to-zone disaster recovery?**
Pricing for zone-to-zone disaster recovery is identical to the pricing for Azure-to-Azure disaster recovery. You can find more details on the [Azure Site Recovery pricing page](https://azure.microsoft.com/pricing/details/site-recovery/) and in [this blog post](https://azure.microsoft.com/blog/know-exactly-how-much-it-will-cost-for-enabling-dr-to-your-azure-vm/).

The egress charges in zone-to-zone disaster recovery are lower than the egress charges in region-to-region disaster recovery. For information about data transfer charges between availability zones, see the [bandwidth pricing page](https://azure.microsoft.com/pricing/details/bandwidth/).

**What is the SLA for RTO and RPO?**
The service-level agreement (SLA) for recovery time objective (RTO) is the same as the SLA for Site Recovery overall. We promise an RTO of up to two hours. There's no defined SLA for recovery point objective (RPO).

**Is capacity guaranteed in the secondary zone?**
The Site Recovery team and the Azure capacity management team plan for sufficient infrastructure capacity. When you start a failover, the teams also help ensure that VM instances protected by Site Recovery deploy to the target zone. For more FAQs on capacity, check the [common questions about Azure-to-Azure disaster recovery](./azure-to-azure-common-questions.md#capacity).

**Which operating systems does zone-to-zone disaster recovery support?**
Zone-to-zone disaster recovery supports the same operating systems as Azure-to-Azure disaster recovery. For more information, see the [support matrix](./azure-to-azure-support-matrix.md).

**Can the source and target resource groups be the same?**
No. You must fail over to a different resource group.

## Next steps

The steps that you follow to run a disaster recovery drill, fail over, reprotect, and failback are the same as the steps in an Azure-to-Azure disaster recovery scenario.

To perform a disaster recovery drill, follow the steps outlined in [Tutorial: Run a disaster recovery drill for Azure VMs](./azure-to-azure-tutorial-dr-drill.md).

To perform a failover and reprotect VMs in the secondary zone, follow the steps outlined in [Tutorial: Fail over Azure VMs to a secondary region](./azure-to-azure-tutorial-failover-failback.md).

To fail back to the primary zone, follow the steps outlined [Tutorial: Fail back Azure VMs to the primary region](./azure-to-azure-tutorial-failback.md).
