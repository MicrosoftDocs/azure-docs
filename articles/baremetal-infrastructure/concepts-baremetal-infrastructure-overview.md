---
title: What is BareMetal Infrastructure on Azure?
author: jjaygbay1
ms.author: jacobjaygbay
description: Provides an overview of the BareMetal Infrastructure on Azure.
ms.custom: references_regions
ms.topic: conceptual
ms.date: 07/01/2023
---

#  What is BareMetal Infrastructure on Azure?

Microsoft Azure offers a cloud infrastructure with a wide range of integrated cloud services to meet your business needs. In some cases, though, you may need to run services on bare metal servers without a virtualization layer. You may need root access and control over the operating system (OS). To meet this need, Azure offers BareMetal Infrastructure for several high-value, mission-critical applications.

BareMetal Infrastructure is made up of dedicated BareMetal instances (compute instances). It features:
- High-performance storage appropriate to the application (NFS, ISCSI, and Fiber Channel). Storage can also be shared across BareMetal instances to enable features like scale-out clusters or high availability pairs with failed-node-fencing capability.
- A set of function-specific virtual LANs (VLANs) in an isolated environment.

This environment also has special VLANs you can access if you're running virtual machines (VMs) on one or more Azure Virtual Networks (VNets) in your Azure subscription. The entire environment is represented as a resource group in your Azure subscription.

BareMetal Infrastructure is offered in over 30 SKUs from 2-socket to 24-socket servers and memory ranging from 1.5 TBs up to 24 TBs. A large set of SKUs is also available with Optane memory. Azure offers the largest range of bare metal instances in a hyperscale cloud.

## Why BareMetal Infrastructure?

Some workloads in the enterprise consist of technologies that just aren't designed to run in a typical virtualized cloud setting. They require special architecture, certified hardware, or extraordinarily large sizes. Although those technologies have the most sophisticated data protection and business continuity features, those features aren't built for the virtualized cloud. They're more sensitive to latencies and noisy neighbors and require more control over change management and maintenance activity.

BareMetal Infrastructure is built, certified, and tested for a select set of such applications. Azure was the first to offer such solutions, and has since led with the largest portfolio and most sophisticated systems.

### BareMetal benefits

BareMetal Infrastructure is intended for critical workloads that require certification to run your enterprise applications. The BareMetal instances are dedicated only to you, and you'll have full access (root access) to the operating system (OS). You manage OS and application installation according to your needs. For security, the instances are provisioned within your Azure Virtual Network (VNet) with no internet connectivity. Only services running on your virtual machines (VMs), and other Azure services in same Tier 2 network, can communicate with your BareMetal instances.

BareMetal Infrastructure offers these benefits:

- Certified hardware for specialized workloads
    - SAP (Refer to [SAP Note #1928533](https://launchpad.support.sap.com/#/notes/1928533). You'll need an SAP account for access.)
- Non-hypervised BareMetal instance, single tenant ownership
- Low latency between Azure hosted application VMs to BareMetal instances (0.35 ms)
- All Flash SSD and NVMe
    - Up to 1 PB/tenant
    - IOPS up to 1.2 million/tenant
    - 40/100-GB network bandwidth
    - Accessible via NFS, ISCSI, and FC
- Redundant power, power supplies, NICs, TORs, ports, WANs, storage, and management
- Hot spares for replacement on a failure (without the need for reconfiguring)
- Customer coordinated maintenance windows
- Application aware snapshots, archive, mirroring, and cloning

## SKU availability in Azure regions

BareMetal Infrastructure offers multiple SKUs certified for specialized workloads. Use the workload-specific SKUs to meet your needs.

- Large instances – Ranging from two-socket to four-socket systems.
- Very Large instances – Ranging from 4-socket to 20-socket systems.

BareMetal Infrastructure for specialized workloads is available in the following Azure regions:
- West Europe
- North Europe
- Germany West Central *zones support
- East US 2 *zones support
- East US *zones support
- West US *zones support
- West US 2 *zones support
- South Central US

>[!NOTE]
>**Zones support** refers to availability zones within a region where BareMetal instances can be deployed across zones for high resiliency and availability. This capability enables support for multi-site active-active scaling.

## Managing BareMetal instances in Azure

Depending on your needs, the application topologies of BareMetal Infrastructure can be complex. You may deploy multiple instances in one or more locations. The instances can have shared or dedicated storage, and specialized LAN and WAN connections. So for BareMetal Infrastructure, Azure offers a consultation by a CSA/GBB in the field to work with you.

By the time your BareMetal Infrastructure is provisioned, the OS, networks, storage volumes, placements in zones and regions, and WAN connections between locations have already been configured. You're set to register your OS licenses (BYOL), configure the OS, and install the application layer.

You'll see all the BareMetal resources, and their state and attributes, in the Azure portal. You can also operate the instances and open service requests and support tickets from there.

## Operational model

BareMetal Infrastructure is ISO 27001, ISO 27017, SOC 1, and SOC 2 compliant. It also uses a bring-your-own-license (BYOL) model: OS, specialized workload, and third-party applications.

As soon as you receive root access and full control, you assume responsibility for:
- Designing and implementing backup and recovery solutions, high availability, and disaster recovery.
- Licensing, security, and support for the OS and third-party software.

Microsoft is responsible for:
- Providing the hardware for specialized workloads.
- Provisioning the OS.

:::image type="content" source="media/concepts-baremetal-infrastructure-overview/baremetal-support-model.png" alt-text="Diagram of BareMetal Infrastructure support model." border="false":::

## BareMetal instance stamp

The BareMetal instance stamp itself combines the following components:

- **Computing:** Servers based on the generation of Intel Xeon processors that provide the necessary computing capability and are certified for the specialized workload.

- **Network:** A unified high-speed network fabric interconnects computing, storage, and LAN components.

- **Storage:** An infrastructure accessed through a unified network fabric.

Within the multi-tenant infrastructure of the BareMetal stamp, customers are deployed in isolated tenants. When deploying a tenant, you name an Azure subscription within your Azure enrollment. This Azure subscription is the one billed for your BareMetal instances.

>[!NOTE]
>A customer deploying a BareMetal instance is isolated into a tenant. A tenant is isolated in the networking, storage, and compute layer from other tenants. Storage and compute units assigned to different tenants cannot see each other or communicate with each other on their BareMetal instances.

## Operating system

During the provisioning of the BareMetal instance, you can select the OS you want to install on the machines.

>[!NOTE]
>Remember, BareMetal Infrastructure is a BYOL model.

The available Linux OS versions are:
- Red Hat Enterprise Linux (RHEL)
- SUSE Linux Enterprise Server (SLES)

## Storage

BareMetal Infrastructure provides highly redundant NFS storage and Fiber Channel storage. The infrastructure offers deep integration for enterprise workloads like SAP, SQL, and more. It also provides application-consistent data protection and data-management capabilities. The self-service management tools offer space-efficient snapshot, cloning, and granular replication capabilities along with single pane of glass monitoring. The infrastructure enables zero RPO and RTO capabilities for data availability and business continuity needs.

The storage infrastructure offers:
- Up to 4 x 100-GB uplinks.
- Up to 32-GB Fiber channel uplinks.
- All flash SSD and NVMe drive.
- Ultra-low latency and high throughput.
- Scales up to 4 PB of raw storage.
- Up to 11 million IOPS.

These Data access protocols are supported:
- iSCSI
- NFS (v3 or v4)
- Fiber Channel
- NVMe over FC

## Networking

The architecture of Azure network services is a key component for a successful deployment of specialized workloads in BareMetal instances. It's likely that not all IT systems are located in Azure already. Azure offers you network technology to make Azure look like a virtual data center to your on-premises software deployments. The Azure network functionality required for BareMetal instances includes:

- Azure virtual networks connected to the Azure ExpressRoute circuit that connects to your on-premises network assets.
- The ExpressRoute circuit that connects on-premises to Azure should have a minimum bandwidth of 1 Gbps or higher.
- Extended Active Directory and DNS in Azure, or completely running in Azure.

ExpressRoute lets you extend your on-premises network into the Microsoft cloud over a private connection with a connectivity provider's help. You can use **ExpressRoute Local** for cost-effective data transfer between your on-premises location and the Azure region you want. To extend connectivity across geopolitical boundaries, you can enable **ExpressRoute Premium**.

BareMetal instances are provisioned within your Azure VNet server IP address range.

:::image type="content" source="media/concepts-baremetal-infrastructure-overview/baremetal-infrastructure-diagram.png" alt-text="Architectural diagram of Azure BareMetal Infrastructure diagram." lightbox="media/concepts-baremetal-infrastructure-overview/baremetal-infrastructure-diagram.png" border="false":::

The architecture shown is divided into three sections:
- **Left:** Shows the customer on-premises infrastructure that runs different applications, connecting through the partner or local edge router like Equinix. For more information, see [Connectivity providers and locations: Azure ExpressRoute](../expressroute/expressroute-locations.md).
- **Center:** Shows [ExpressRoute](../expressroute/expressroute-introduction.md) provisioned using your Azure subscription offering connectivity to Azure edge network.
- **Right:** Shows Azure IaaS, and in this case, use of VMs to host your applications, which are provisioned within your Azure virtual network.
- **Bottom:** Shows using your ExpressRoute Gateway enabled with [ExpressRoute FastPath](../expressroute/about-fastpath.md) for BareMetal connectivity offering low latency.
   >[!TIP]
   >To support this, your ExpressRoute Gateway should be UltraPerformance. For more information, see [About ExpressRoute virtual network gateways](../expressroute/expressroute-about-virtual-network-gateways.md).

## Next steps

Learn how to identify and interact with BareMetal instances through the Azure portal.

> [!div class="nextstepaction"]
> [Manage BareMetal instances through the Azure portal](connect-baremetal-infrastructure.md)
