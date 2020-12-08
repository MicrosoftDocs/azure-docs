---
title: Overview of BareMetal Infrastructure in Azure
description: Overview of how to deploy BareMetal Infrastructure in Azure.
ms.topic: conceptual
ms.date: 12/18/2020
---

#  What is BareMetal Infrastructure on Azure?

Azure BareMetal Infrastructure provides a secure solution for migrating enterprise custom workloads. The BareMetal instances are non-shared host/server hardware assigned to you. It unlocks porting your on-prem solution with specialized workloads requiring certified hardware, licensing, and support agreements. Azure handles infrastructure monitoring and maintenance for you, while in-guest operating system (OS) monitoring and application monitoring fall within your ownership.

BareMetal Infrastructure provides a path to modernize your infrastructure landscape while maintaining your existing investments and architecture. With BareMetal Infrastructure, you can bring specialized workloads to Azure, allowing you access and integration with Azure services with low latency.

## SKU availability in Azure regions
BareMetal Infrastructure for specialized and general-purpose workloads is available, starting with four regions based on Revision 4.2 (Rev 4.2) stamps:
- West Europe
- North Europe
- East US 2
- South Central US

By early Q2 2021, two Revision 4 (Rev 4) stamp regions will be converted to BareMetal Infrastructure regions:
- West US2
- East US2

>[!NOTE]
>**Rev 4.2** is the latest rebranded BareMetal Infrastructure using Rev 4 architecture.  Rev 4 provides closer proximity to the Azure virtual machine (VM) hosts and lowers the latency between Azure VMs and BareMetal Instance units. You can access and manage your BareMetal instances through the Azure portal. 

## Support
BareMetal Infrastructure is ISO 27001, ISO 27017, SOC 1, and SOC 2 compliant.  It also uses a bring-your-own-license (BYOL) model: OS, specialized workload, and third-party applications.  

As soon as you receive root access and full control, you assume responsibility for:
- Designing and implementing backup and recovery solutions, high availability, and disaster recovery
- Licensing, security, and support for OS and third-party software

Microsoft is responsible for:
- Providing certified hardware for specialized workloads 
- Provisioning the OS

:::image type="content" source="media/baremetal-support-model.png" alt-text="BareMetal Infrastructure support model" border="false":::

## Compute
BareMetal Infrastructure offers multiple SKUs certified for specialized workloads. Available SKUs available range from the smaller two-socket system to the 24-socket system. Use the workload-specific certified SKUs for your specialized workload.

The BareMetal instance stamp itself combines the following components:

- **Computing:** Servers based on a different generation of Intel Xeon processors that provide the necessary computing capability and are certified for the specialized workload.

- **Network:** A unified high-speed network fabric interconnects computing, storage, and LAN components.

- **Storage:** An infrastructure accessed through a unified network fabric.

Within the multi-tenant infrastructure of the BareMetal stamp, customers are deployed in isolated tenants. When deploying a tenant, you name an Azure subscription within your Azure enrollment. This Azure subscription is the one that BareMetal instances are billed.

>[!NOTE]
>A customer deployed in the BareMetal instance gets isolated into a tenant. A tenant is isolated in the networking, storage, and compute layer from other tenants. Storage and compute units assigned to the different tenants cannot see each other or communicate with each other on the BareMetal instances.

## OS
During the provisioning of the BareMetal instance, you can select the OS you want to install on the machines. 

>[!NOTE]
>Remember that BareMetal Infrastructure is a BYOL model.

The available Linux OS versions are:
- Red Hat Enterprise Linux (RHEL) 7.6
- SUSE Linux Enterprise Server (SLES)
   - SLES 12 SP2
   - SLES 12 SP3
   - SLES 12 SP4
   - SLES 12 SP5
   - SLES 15 SP1

## Storage
BareMetal instances based on specific SKU type come with predefined NFS storage based on specific workload type. When you provision BareMetal, you can provision additional storage based on your estimated growth by submitting a support request. All storage comes with an all-flash disk in Revision 4.2 with support for NFSv3 and NFSv4. The newer Revision 4.5 NVMe SSD will be available. For more information on storage sizing, see the [BareMetal workload type]() section.

>[!NOTE]
>The storage used for BareMetal meets FIPS 140-2 security requirements offering Encryption at Rest by default. The data is securely stored on the disks.

## Networking
The architecture of Azure network services is a key component for a successful deployment of specialized workloads in BareMetal instances. It is likely that not all IT systems are located in Azure already. Azure offers you network technology to make Azure look like a virtual data center to your on-premises software deployments. The Azure network functionality required for BareMetal instances is:

- Azure virtual networks are connected to the ExpressRoute circuit that connects to your on-premises network assets.
- An ExpressRoute circuit that connects on-premises to Azure should have a minimum bandwidth of 1 Gbps or higher.
- Extended Active directory and DNS in Azure or completely running in Azure.

Using ExpressRoute lets you extend your on-premises network into Microsoft cloud over a private connection with a connectivity provider's help. You can enable **ExpressRoute Premium** to extend connectivity across geopolitical boundaries or use **ExpressRoute Local** for cost-effective data transfer between the location near the Azure region you want.

BareMetal instances are provisioned within your Azure VNET server IP address range.

The architecture shown is divided into three sections:
- **Left:** Shows the customer on-premise infrastructure that runs different applications, connecting through the partner or local Edge router like Equinix. For more information, see [Connectivity providers and locations: Azure ExpressRoute](../../../expressroute/expressroute-locations.md).
- Center: Shows [ExpressRoute](../../../expressroute/expressroute-introduction.md) provisioned using your Azure subscription offering connectivity to Azure edge network.
- **Right:** Shows Azure IaaS, and in this case use of VMs to host your applications, which are provisioned within your Azure virtual network.
- **Bottom:** Shows using your ExpressRoute Gateway enabled with [ExpressRoute FastPath](../../../expressroute/about-fastpath.md) for BareMetal connectivity offering low latency.   
   >[!TIP]
   >To support this, your ExpressRoute Gateway should be Ultra Performance. 

