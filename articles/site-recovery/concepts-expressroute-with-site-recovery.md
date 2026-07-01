---
title: About using ExpressRoute with Azure Site Recovery
description: Describes how to use Azure ExpressRoute with the Azure Site Recovery service for disaster recovery and migration.
author: Jeronika-MS
ms.service: azure-site-recovery
ms.topic: concept-article
ms.date: 02/11/2026
ms.author: v-gajeronika
ms.reviewer: v-gajeronika

# Customer intent: As a cloud architect, I want to implement Azure ExpressRoute with Azure Site Recovery, so that I can ensure secure and efficient disaster recovery and migration of on-premises and Azure virtual machines to the cloud.
---
# Azure ExpressRoute with Azure Site Recovery

Microsoft Azure ExpressRoute extends your on-premises networks into the Microsoft cloud over a private connection through a connectivity provider. By using ExpressRoute, you can connect to Microsoft cloud services, such as Microsoft Azure, Microsoft 365, and Dynamics 365.

This article describes how you can use Azure ExpressRoute with Azure Site Recovery for disaster recovery and migration.

## ExpressRoute circuits

An ExpressRoute circuit represents a logical connection between your on-premises infrastructure and Microsoft cloud services through a connectivity provider. You can order multiple ExpressRoute circuits. Each circuit can be in the same or different regions and can connect to your premises through different connectivity providers. For more information, see [ExpressRoute circuits](../expressroute/expressroute-circuit-peerings.md).

An ExpressRoute circuit has multiple routing domains associated with it. For more information about and a comparison of ExpressRoute routing domains, see [ExpressRoute circuit peerings](../expressroute/expressroute-circuit-peerings.md#peeringcompare).

## On-premises to Azure replication with ExpressRoute

Azure Site Recovery enables disaster recovery and migration to Azure for on-premises [Hyper-V virtual machines](hyper-v-azure-architecture.md), [VMware virtual machines](vmware-azure-architecture.md), and [physical servers](physical-azure-architecture.md). For all on-premises to Azure scenarios, replication data is sent to and stored in an Azure Storage account. During replication, you don't pay any virtual machine charges. When you run a failover to Azure, Site Recovery automatically creates Azure IaaS virtual machines.

Site Recovery replicates data to an Azure Storage account or replica Managed Disk in the target Azure region over a public endpoint. To use ExpressRoute for Site Recovery replication traffic, you can utilize [Microsoft peering](../expressroute/expressroute-circuit-peerings.md#microsoftpeering). Note that replication is supported over private peering only when [private ends points are enabled for the vault](hybrid-how-to-enable-replication-private-endpoints.md).

Ensure that the [Networking Requirements](vmware-azure-configuration-server-requirements.md#network-requirements) for Configuration Server are also met. Configuration Server requires connectivity to specific URLs for orchestration of Site Recovery replication. You can't use ExpressRoute for this connectivity. 

If you use a proxy at on-premises and want to use ExpressRoute for replication traffic, you need to configure the Proxy bypass list on the Configuration Server and Process Servers. Follow the steps in the following section:

- Download PsExec tool from [here](/sysinternals/downloads/psexec) to access System user context.
- Open Internet Explorer in system user context by running the following command line
    psexec -s -i "%programfiles%\Internet Explorer\iexplore.exe"
- Add proxy settings in Internet Explorer
- In the bypass list, add the Azure storage URL `*.blob.core.windows.net`

This configuration ensures that only replication traffic flows through ExpressRoute while the communication can go through proxy.

After virtual machines or servers fail over to an Azure virtual network, you can access them by using [private peering](../expressroute/expressroute-circuit-peerings.md#privatepeering). 

The combined scenario is represented in the following diagram:
:::image type="content" source="./media/concepts-expressroute-with-site-recovery/site-recovery-with-expressroute.png" alt-text="On-premises-to-Azure with ExpressRoute.":::

## Azure to Azure replication with ExpressRoute

Azure Site Recovery enables disaster recovery of [Azure virtual machines](azure-to-azure-architecture.md). Depending on whether your Azure virtual machines use [Azure Managed Disks](/azure/virtual-machines/managed-disks-overview), replication data is sent to an Azure Storage account or replica Managed Disk on the target Azure region. Although the replication endpoints are public, replication traffic for Azure VM replication, by default, doesn't traverse the Internet, regardless of which Azure region the source virtual network exists in. You can override Azure's default system route for the 0.0.0.0/0 address prefix with a [custom route](../virtual-network/virtual-networks-udr-overview.md#custom-routes) and divert VM traffic to an on-premises network virtual appliance (NVA), but this configuration isn't recommended for Site Recovery replication. If you're using custom routes, you should [create a virtual network service endpoint](azure-to-azure-about-networking.md#create-network-service-endpoint-for-storage) in your virtual network for "Storage" so that the replication traffic doesn't leave the Azure boundary.

For Azure VM disaster recovery, by default, ExpressRoute isn't required for replication. After virtual machines fail over to the target Azure region, you can access them by using [private peering](../expressroute/expressroute-circuit-peerings.md#privatepeering). Data transfer prices apply irrespective of the mode of data replication across Azure regions.

If you already use ExpressRoute to connect from your on-premises datacenter to the Azure VMs on the source region, you can plan for re-establishing ExpressRoute connectivity at the failover target region. You can use the same ExpressRoute circuit to connect to the target region through a new virtual network connection or utilize a separate ExpressRoute circuit and connection for disaster recovery. The different possible scenarios are described [here](azure-vm-disaster-recovery-with-expressroute.md#fail-over-azure-virtual-machines-when-using-expressroute).

You can replicate Azure virtual machines to any Azure region within the same geographic cluster as detailed [here](../site-recovery/azure-to-azure-support-matrix.md#region-support). If the chosen target Azure region isn't within the same geopolitical region as the source, you might need to enable ExpressRoute Premium. For more details, check [ExpressRoute locations](../expressroute/expressroute-locations.md) and [ExpressRoute pricing](https://azure.microsoft.com/pricing/details/expressroute/).

## Next steps

- Learn more about [ExpressRoute circuits](../expressroute/expressroute-circuit-peerings.md).
- Learn more about [ExpressRoute routing domains](../expressroute/expressroute-circuit-peerings.md#peeringcompare).
- Learn more about [ExpressRoute locations](../expressroute/expressroute-locations.md).
- Learn more about disaster recovery of [Azure virtual machines with ExpressRoute](azure-vm-disaster-recovery-with-expressroute.md).