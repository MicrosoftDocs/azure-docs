---
title: Architecture - Private clouds and clusters
description: Understand the key capabilities of Azure VMware Solution software-defined data centers and VMware vSphere clusters. 
ms.topic: conceptual
ms.service: azure-vmware
ms.date: 6/3/2024
ms.custom: engagement-fy23
---

# Azure VMware Solution private cloud and cluster concepts

Azure VMware Solution provides VMware-based private clouds in Azure. The private cloud hardware and software deployments are fully integrated and automated in Azure. Deploy and manage the private cloud through the Azure portal, CLI, or PowerShell.

A private cloud includes clusters with:

- Dedicated bare-metal server hosts provisioned with VMware ESXi hypervisor
- VMware vCenter Server for managing ESXi and vSAN
- VMware NSX software-defined networking for vSphere workload VMs
- VMware vSAN datastore for vSphere workload VMs
- VMware HCX for workload mobility
- Resources in the Azure underlay (required for connectivity and to operate the private cloud)

Private clouds are installed and managed within an Azure subscription. The number of private clouds within a subscription is scalable. Initially, there's a limit of one private cloud per subscription. There's a logical relationship between Azure subscriptions, Azure VMware Solution private clouds, vSAN clusters, and hosts.

The following diagram describes the architectural components of the Azure VMware Solution.

:::image type="content" source="media/concepts/hosts-clusters-private-clouds-final.png" alt-text="Diagram illustrating a single Azure subscription containing two private clouds for development and production environments." border="false"  lightbox="media/concepts/hosts-clusters-private-clouds-final.png":::

Each Azure VMware Solution architectural component has the following function:

- Azure Subscription: Provides controlled access, budget, and quota management for the Azure VMware Solution.
- Azure Region: Groups data centers into Availability Zones (AZs) and then groups AZs into regions.
- Azure Resource Group: Places Azure services and resources into logical groups.
- Azure VMware Solution Private Cloud: Offers compute, networking, and storage resources using VMware software, including vCenter Server, NSX software-defined networking, vSAN software-defined storage, and Azure bare-metal ESXi hosts. Azure NetApp Files, Azure Elastic SAN, and Pure Cloud Block Store are also supported.
- Azure VMware Solution Resource Cluster: Provides compute, networking, and storage resources for customer workloads by scaling out the Azure VMware Solution private cloud using VMware software, including vSAN software-defined storage and Azure bare-metal ESXi hosts. Azure NetApp Files, Azure Elastic SAN, and Pure Cloud Block Store are also supported.
- VMware HCX: Delivers mobility, migration, and network extension services.
- VMware Site Recovery: Automates disaster recovery and storage replication services with VMware vSphere Replication. Third-party disaster recovery solutions Zerto Disaster Recovery and JetStream Software Disaster Recovery are also supported.
- Dedicated Microsoft Enterprise Edge (D-MSEE): Router that connects Azure cloud and the Azure VMware Solution private cloud instance.
- Azure Virtual Network (VNet): Connects Azure services and resources together.
- Azure Route Server: Exchanges dynamic route information with Azure networks.
- Azure Virtual Network Gateway: Connects Azure services and resources to other private networks using IPSec VPN, ExpressRoute, and VNet to VNet.
- Azure ExpressRoute: Provides high-speed private connections between Azure data centers and on-premises or colocation infrastructure.
- Azure Virtual WAN (vWAN): Combines networking, security, and routing functions into a single unified Wide Area Network (WAN).

## Hosts

[!INCLUDE [disk-capabilities-of-the-host](includes/disk-capabilities-of-the-host.md)]

## Azure Region Availability Zone (AZ) to SKU mapping table

When planning your Azure VMware Solution design, use the following table to understand what SKUs are available in each physical Availability Zone of an [Azure region](https://azure.microsoft.com/explore/global-infrastructure/geographies/#geographies). 

>[!IMPORTANT]
> This mapping is important for placing your private clouds in close proximity to your Azure native workloads, including integrated services such as Azure NetApp Files and Pure Cloud Block Store (CBS). 

The Multi-AZ capability for Azure VMware Solution Stretched Clusters is also tagged in the following table. Customer quota for Azure VMware Solution is assigned by Azure region, and you are not able to specify the Availability Zone during private cloud provisioning. An auto selection algorithm is used to balance deployments across the Azure region. If you have a particular Availability Zone you want to deploy to, open a [Service Request](https://rc.portal.azure.com/#create/Microsoft.Support) with Microsoft requesting a "special placement policy" for your subscription, Azure region, Availability Zone, and SKU type. This policy remains in place until you request it be removed or changed.

**SKUs** marked in **bold** are of limited availability due to customer consumption and quota may not be available upon request. The AV64 SKU should be used instead when AV36, AV36P, or AV52 SKUs are limited.

AV64 SKUs are available per Availability Zone, the table below lists the Azure regions that support this SKU. For RAID-6 FTT2 and RAID-1 FTT3 storage policies, six and seven Fault Domains (FDs) are needed respectively, the FD count for each Azure region is listed in the "AV64 FDs Supported" column.

| Azure region | Availability Zone | SKU   | Multi-AZ SDDC | AV64 FDs Supported |
| :---         | :---:             | :---: | :---:         | :---:           |
| Australia East | AZ01 | AV36P, AV64 | Yes | 5 (7 Planned H2 2024) |
| Australia East | AZ02 | AV36 | No | N/A |
| Australia East | AZ03 | AV36P, AV64 | Yes | 5 (7 Planned H2 2024) |
| Australia South East | AZ01 | AV36 | No | N/A |
| Brazil South | AZ02 | **AV36** | No | N/A |
| Canada Central | AZ02 | AV36, **AV36P** | No | N/A |
| Canada East | N/A | AV36 | No | N/A |
| Central India | AZ03 | AV36P | No | N/A |
| Central US | AZ01 | AV36P | No | N/A |
| Central US | AZ02 | **AV36** | No | N/A |
| Central US | AZ03 | AV36P | No | N/A |
| East Asia | AZ01 | AV36 | No | N/A |
| East US | AZ01 | **AV36P** | Yes | N/A |
| East US | AZ02 | **AV36P**, AV64 | Yes | 7 |
| East US | AZ03 | **AV36**, **AV36P**, AV64 | Yes | 7 |
| East US 2 | AZ01 | **AV36**, AV64 | No | 5 (7 Planned H2 2024) |
| East US 2 | AZ02 | AV36P, **AV52**, AV64 | No | 5 (7 Planned H2 2024) |
| France Central | AZ01 | **AV36** | No | N/A |
| Germany West Central | AZ01 | AV36P | Yes | N/A |
| Germany West Central | AZ02 | **AV36** | Yes | N/A |
| Germany West Central | AZ03 | AV36, **AV36P** | Yes | N/A |
| Italy North | AZ03 | AV36P | No | N/A |
| Japan East | AZ02 | **AV36** | No | N/A |
| Japan West | AZ01 | **AV36** | No | N/A |
| North Central US | AZ01 | **AV36**, AV64 | No | 5 (7 Planned H2 2024) |
| North Central US | AZ02 | AV36P, AV64 | No | 5 (7 Planned H2 2024) |
| North Europe | AZ02 | AV36, AV64 | No | 5 (7 Planned H2 2024) |
| Qatar Central | AZ03 | AV36P | No | N/A |
| South Africa North | AZ03 | AV36 | No | N/A |
| South Central US | AZ01 | AV36, AV64 | No | 5 (7 Planned H2 2024) |
| South Central US | AZ02 | **AV36P**, AV52, AV64 | No | 5 (7 Planned H2 2024) |
| South East Asia | AZ02 | **AV36** | No | N/A |
| Sweden Central | AZ01 | AV36 | No | N/A |
| Switzerland North | AZ01 | **AV36**, AV64 | No | 7 |
| Switzerland North | AZ03 | AV36P | No | N/A |
| Switzerland West | AZ01 | **AV36**, AV64 | No | 7 |
| UAE North | AZ03 | AV36P | No | N/A |
| UK South | AZ01 | AV36, AV36P, AV52, AV64 | Yes | 7 |
| UK South | AZ02 | **AV36**, AV64 | Yes | 7 |
| UK South | AZ03 | AV36P, AV64 | Yes | 7 |
| UK West | AZ01 | AV36 | No | N/A |
| West Europe | AZ01 | **AV36**, AV36P, AV52, AV64 | Yes | 5 (7 Planned H2 2024) |
| West Europe | AZ02 | **AV36**, AV64 | Yes | 7 |
| West Europe | AZ03 | AV36P, AV64 | Yes | 5 (7 Planned H2 2024) |
| West US | AZ01 | AV36, AV36P | No | N/A |
| West US 2 | AZ01 | AV36 | No | N/A |
| West US 2 | AZ02 | AV36P | No | N/A |
| West US 3 | AZ01 | **AV36P** | No | N/A |
| US Gov Arizona | AZ02 | AV36P | No | N/A |
| US Gov Virginia | AZ03 | AV36 | No | N/A |

## Clusters

[!INCLUDE [hosts-minimum-initial-deployment-statement](includes/hosts-minimum-initial-deployment-statement.md)]

[!INCLUDE [azure-vmware-solutions-limits](includes/azure-vmware-solutions-limits.md)]

## VMware software versions

Microsoft is a member of the VMware Metal-as-a-Service (MaaS) program and uses the [VMware Cloud Provider Stack (VCPS)](https://docs.vmware.com/en/VMware-Cloud-Provider-Stack/1.1/com.vmware.vcps.gsg.doc/GUID-5D686FB2-9886-44D3-845B-FDEF650C7575.html) for Azure VMware Solution upgrade planning.

[!INCLUDE [vmware-software-versions](includes/vmware-software-versions.md)]

## Host maintenance and lifecycle management

[!INCLUDE [vmware-software-update-frequency](includes/vmware-software-update-frequency.md)]

## Host monitoring and remediation

Azure VMware Solution continuously monitors the health of both the VMware components and underlay. When Azure VMware Solution detects a failure, it takes action to repair the failed components. When Azure VMware Solution detects a degradation or failure on an Azure VMware Solution node, it triggers the host remediation process.

Host remediation involves replacing the faulty node with a new healthy node in the cluster. Then, when possible, the faulty host is placed in VMware vSphere maintenance mode. VMware vSphere vMotion moves the VMs off the faulty host to other available servers in the cluster, potentially allowing zero downtime for live migration of workloads. If the faulty host can't be placed in maintenance mode, the host is removed from the cluster. Before the faulty host is removed, the customer workloads are migrated to a newly added host.

> [!TIP]
> **Customer communication:** An email is sent to the customer's email address before the replacement is initiated and again after the replacement is successful. 
> 
> To receive emails related to host replacement, you need to be added to any of the following Azure RBAC roles in the subscription: 'ServiceAdmin', 'CoAdmin', 'Owner', 'Contributor'.

Azure VMware Solution monitors the following conditions on the host:

- Processor status
- Memory status
- Connection and power state
- Hardware fan status
- Network connectivity loss
- Hardware system board status
- Errors occurred on the disk(s) of a vSAN host
- Hardware voltage
- Hardware temperature status
- Hardware power status
- Storage status
- Connection failure

> [!NOTE]
> Azure VMware Solution tenant admins must not edit or delete the previously defined VMware vCenter Server alarms because they are managed by the Azure VMware Solution control plane on vCenter Server. These alarms are used by Azure VMware Solution monitoring to trigger the Azure VMware Solution host remediation process.

## Backup and restore

Azure VMware Solution private cloud vCenter Server and HCX Manager (if enabled) configurations are on a daily backup schedule and NSX configuration has an hourly backup schedule. The backups are retained for a minimum of three days. Open a [support request](https://rc.portal.azure.com/#create/Microsoft.Support) in the Azure portal to request restoration.

> [!NOTE]
> Restorations are intended for catastrophic situations only.

Azure VMware Solution continuously monitors the health of both the physical underlay and the VMware Solution components. When Azure VMware Solution detects a failure, it takes action to repair the failed components.

## Next steps

Now that you've covered Azure VMware Solution private cloud concepts, you might want to learn about:

- [Azure VMware Solution networking and interconnectivity concepts](architecture-networking.md)
- [Azure VMware Solution storage concepts](architecture-storage.md)
- [How to enable Azure VMware Solution resource](deploy-azure-vmware-solution.md#register-the-microsoftavs-resource-provider)

<!-- LINKS - internal -->
[concepts-networking]: ./concepts-networking.md

<!-- LINKS - external-->
[vCSA versions]: https://kb.vmware.com/s/article/2143838

[ESXi versions]: https://kb.vmware.com/s/article/2143832

[vSAN versions]: https://kb.vmware.com/s/article/2150753
