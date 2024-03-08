---
title: What is Azure Large Instances?
titleSuffix: Azure Large Instances
description: Provides an overview of Azure Large Instances.
author: jjaygbay1
ms.title: What is Azure Large Instances?
ms.author: jacobjaygbay
ms.service: azure-large-instances
ms.custom: references_regions
ms.topic: conceptual
ms.date: 06/01/2023
---

#  What is Azure Large Instances?

While Microsoft Azure offers a cloud infrastructure with a wide range of integrated cloud services to meet your business needs, in some cases, you may need to run services on Azure large servers without a virtualization layer. You may also require root access and control over the operating system (OS). To meet these needs, Azure offers Azure Large Instances for several high-value, mission-critical applications.

Azure Large Instances is comprised of dedicated large compute instances with the following key features:

- High-performance storage appropriate to the application (Fiber Channel).
    Storage can also be shared across Azure Large Instances to enable features like scale-out clusters or high availability pairs with failed-node-fencing capability. 

- A set of function-specific virtual LANs (VLANs) in an isolated environment. 
    This environment also has special VLANs you can access if you're running virtual machines (VMs) on one or more Azure Virtual Networks (VNets) in your Azure subscription.
    The entire environment is represented as a resource group in that subscription.

- A large set of Azure Large Instances SKUs is available with Optane memory.
    Azure offers the largest range of Azure Large Instances in a hyperscale cloud.

## Why Azure Large Instances?

Some workloads in the enterprise consist of technologies that just aren't designed to run in a typical virtualized cloud setting.
They require special architecture, certified hardware, or extraordinarily large servers. Although those technologies have the most sophisticated data protection and business continuity features, they aren't built for the virtualized cloud.
They're more sensitive to latencies and noisy neighbors and require more control over change management and maintenance activity.

Azure Large Instances is built, certified, and tested for a select set of such applications. Azure was the first to offer such solutions and has since led with the largest portfolio and most sophisticated systems.

## Azure Large Instances benefits

Azure Large Instances is intended for critical workloads that require certification to run your enterprise applications. 
Azure Large Instances implementations are dedicated only to you, and you'll have full access (root access) to the operating system (OS).
You manage OS and application installation according to your needs.
For security, the instances are provisioned within your Azure Virtual Network (VNet) with no internet connectivity. If you need access to the internet, you need to set up an internet proxy service.

Only services running on your virtual machines (VMs), and other Azure services in same Tier 2 network, can communicate with your implementation of Azure Large Instances.

Azure Large Instances offers the following benefits:

* Non-hypervised Azure Large Instances, single tenant ownership
* Low latency between Azure hosted application VMs to Azure Large Instances implementations (0.35 ms)
* All Flash SSD and NVMe
  * Up to 1 PB/tenant
  * IOPS up to 1.2 million/tenant
  * 40/100-GB network bandwidth
  * Accessible via FC
* Redundant power, power supplies, NICs, TORs, ports, WANs, storage, and management
* Hot spares for replacement on a failure (without the need for reconfiguring)
* Customer-coordinated maintenance windows
* Application-aware snapshots, archive, mirroring, and cloning

## SKU availability in Azure regions

Azure Large Instances for specialized workloads is available in the following Azure regions:

* West Europe
* North Europe
* Germany West Central zones support
* East US zones support
* East US 2 zones support
* West US zones support
* West US 2 zones support
* South Central US
* South Central US

> [!Note]
>Zones support refers to availability zones in which a region where Azure Large Instances can be deployed across zones for high resiliency and availability. This capability enables support for multi-site active-active scaling.

## Managing Azure Large Instances in Azure

Depending on your needs, the application topologies of Azure Large Instances can be complex. You may deploy multiple instances in one or more locations. The instances can have shared or dedicated storage, and specialized LAN and WAN connections
Therefore, for Azure Large Instances, Azure offers a consultation with a CSA/GBB in the field who can work with you.

By the time your Azure Large Instances implementation has been provisioned, the OS, networks, storage volumes, placements in zones and regions, and WAN connections between locations have already been configured.
You're set to register your OS licenses (BYOL), configure the OS, and install the application layer.

You'll see all the Azure Large Instances resources, and their state and attributes, in the Azure portal. You can also operate the instances, open service requests, and support tickets from there. 

Azure Large Instances is ISO 27001, ISO 27017, ISO 27018, SOC 1, and SOC 2 compliant. It also uses a bring-your-own-license (BYOL) model: OS, specialized workload, and third-party applications.

As soon as you receive root access and full control, you assume responsibility for the following tasks:

- Designing and implementing backup and recovery solutions, high availability, and disaster recovery.

- Licensing, security, and support for the OS and third-party software.

Microsoft is responsible for:
- Providing the hardware for specialized workloads.
- Provisioning the OS.

    :::image type="content" source="media/what-is-azure-large-instances/azure-large-instances-support-model.png" alt-text="Screenshot of Azure Large Instances support model." lightbox="media/what-is-azure-large-instances/azure-large-instances-support-model.png" border="false":::


## Azure Large Instances stamp

The Azure Large instance stamp itself combines the following components:

* **Computing**
Servers based on the generation of Intel Xeon processors that provide the necessary computing capability and are certified for the specialized workload.

* **Network**
A unified high-speed network fabric interconnects computing, storage, and LAN components.

* **Storage**
An infrastructure accessed through a unified network fabric.

Within the multi-tenant infrastructure of the Azure Large instance stamp, customers are deployed in isolated tenants.
When deploying a tenant, you name an Azure subscription within your Azure enrollment. 
This Azure subscription is the one billed for your implementation of Azure Large Instances.

> [!Note]
> A customer implementing Azure Large Instances is isolated into a tenant.
A tenant is isolated in the networking, storage, and compute layer from other tenants.
Storage and compute units assigned to different tenants cannot see each other or communicate with each other on their implementations of Azure Large Instances.

## Operating system

The Linux OS version for Azure Large Instances is Red Hat Enterprise Linux (RHEL) 8.4.  

>[!Note]
> Remember, Azure Large Instances is a BYOL model. Microsoft loads base image with RHEL 8.4, but customers can choose to upgrade to newer versions in collaboration with Microsoft team.

## Storage

Azure Large Instances provide highly redundant Fiber Channel storage.
The infrastructure offers deep integration for enterprise workloads like SAP, SQL, and others.
It also provides application-consistent data protection and data-management capabilities.
The self-service management tools offer space-efficient snapshot, cloning, and granular replication capabilities along with single pane of glass monitoring. 
The infrastructure enables zero Recovery Point Objective (RPO) and Recovery Time Objective (RTO) capabilities for data availability and business continuity needs.

The storage infrastructure offers: 

* Up to 4 x 100-GB uplinks.
* Up to 32-GB Fiber channel uplinks.
* All flash SSD and NVMe drive.
* Ultra-low latency and high throughput.
* Scales up to 4 PB of raw storage.
* Up to 11 million IOPS.

Fiber Channel Protocol (FCP) is supported.

## Networking

The architecture of Azure network services is a key component for a successful deployment of specialized workloads in Azure Large Instances.
It's likely that not all IT systems are located in Azure already. Azure offers you network technology to make Azure look like a virtual data center to your on-premises software deployments.
The Azure network functionality required for Azure Large Instances includes: 

* Azure virtual networks connected to the Azure ExpressRoute circuit that connects to your on-premises network assets. 
* The ExpressRoute circuit that connects on-premises to Azure should have a minimum bandwidth of 1 Gbps or higher. 
* Extended Active Directory and DNS in Azure, or completely running in Azure. 
* ExpressRoute lets you extend your on-premises network into the Microsoft cloud over a private connection with a connectivity provider's help.
You can use ExpressRoute Local for cost-effective data transfer between your on-premises location and the Azure region you want.
To extend connectivity across geopolitical boundaries, you can enable ExpressRoute Premium.

Azure Large Instances is provisioned within your Azure VNet server IP address range.

:::image type="content" source="media/what-is-azure-large-instances/azure-large-instances-networking.png" alt-text="Screenshot of  Azure Large Instances network." lightbox="media/what-is-azure-large-instances/azure-large-instances-networking.png" border="false":::

The architecture shown is divided into three sections: 

### On-premises (left)
Shows the customer on-premises infrastructure that runs different applications, connecting through the partner or local edge router like Equinix. 
For more information, see [Connectivity providers and locations: Azure ExpressRoute](../expressroute/expressroute-locations-providers.md).

### ExpressRoute (center)
Shows ExpressRoute provisioned using your Azure subscription offering connectivity to Azure edge network.

### Azure IaaS with VMs (right)
Shows Azure IaaS, and in this case, use of VMs to host your applications, which are provisioned within your Azure virtual network.

### ExpressRoute Gateway (lower)
Shows using your ExpressRoute Gateway enabled with ExpressRoute FastPath for Azure Large Instances connectivity offering low latency.

> [!Note]
>To support this configuration, your ExpressRoute Gateway should be UltraPerformance. For more information, see [About ExpressRoute virtual network gateways](../expressroute/expressroute-about-virtual-network-gateways.md).



