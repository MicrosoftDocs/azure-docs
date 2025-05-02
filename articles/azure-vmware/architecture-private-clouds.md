---
title: Architecture for Private Clouds and Clusters
description: Understand the key capabilities of Azure VMware Solution software-defined datacenters and VMware vSphere clusters. 
ms.topic: concept-article
ms.service: azure-vmware
ms.date: 4/4/2025
ms.custom: engagement-fy23, references_regions
---

# Azure VMware Solution private cloud and cluster concepts

Azure VMware Solution provides VMware-based private clouds in Azure. The private cloud hardware and software deployments are fully integrated and automated in Azure. Deploy and manage the private cloud through the Azure portal, the Azure CLI, or PowerShell.

A private cloud includes clusters with:

- Dedicated bare-metal server hosts provisioned with VMware vSphere Hypervisor (ESXi).
- VMware vCenter Server for managing ESXi and vSAN.
- VMware NSX software-defined networking for vSphere workload virtual machines (VMs).
- VMware vSAN datastore for vSphere workload VMs.
- VMware HCX for workload mobility.
- Resources in the Azure underlay (required for connectivity and to operate the private cloud).

Private clouds are installed and managed within an Azure subscription. The number of private clouds within a subscription is scalable. Initially, there's a limit of one private cloud per subscription. There's a logical relationship between Azure subscriptions, Azure VMware Solution private clouds, vSAN clusters, and hosts.

The following diagram describes the architectural components of Azure VMware Solution.

:::image type="content" source="media/concepts/hosts-clusters-private-clouds-final.png" alt-text="Diagram that shows a single Azure subscription that contains two private clouds for development and production environments." border="false"  lightbox="media/concepts/hosts-clusters-private-clouds-final.png":::

Each Azure VMware Solution architectural component has the following function:

- **Azure subscription**: Provides controlled access, budget, and quota management for Azure VMware Solution.
- **Azure region**: Groups datacenters into availability zones and then groups availability zones into regions.
- **Azure resource group**: Places Azure services and resources into logical groups.
- **Azure VMware Solution private cloud**: Offers compute, networking, and storage resources by using VMware software, including vCenter Server, NSX software-defined networking, vSAN software-defined storage, and Azure bare-metal ESXi hosts. Azure NetApp Files, Azure Elastic SAN, and Pure Cloud Block Store are also supported.
- **Azure VMware Solution resource cluster**: Provides compute, networking, and storage resources for customer workloads by scaling out the Azure VMware Solution private cloud by using VMware software, including vSAN software-defined storage and Azure bare-metal ESXi hosts. Azure NetApp Files, Elastic SAN, and Pure Cloud Block Store are also supported.
- **VMware HCX**: Delivers mobility, migration, and network extension services.
- **VMware Site Recovery**: Automates disaster recovery and storage replication services with VMware vSphere Replication. Non-Microsoft disaster recovery solutions Zerto disaster recovery and JetStream Software disaster recovery are also supported.
- **Dedicated Microsoft Enterprise Edge**: Router that connects Azure Cloud Services and the Azure VMware Solution private cloud instance.
- **Azure Virtual Network**: Connects Azure services and resources together.
- **Azure Route Server**: Exchanges dynamic route information with Azure networks.
- **Azure Virtual Network gateway**: Connects Azure services and resources to other private networks by using IPSec virtual private network, Azure ExpressRoute, and virtual network to virtual network.
- **Azure ExpressRoute**: Provides high-speed private connections between Azure datacenters and on-premises or colocation infrastructure.
- **Azure Virtual WAN**: Combines networking, security, and routing functions into a single unified wide area network (WAN).

## Hosts

[!INCLUDE [disk-capabilities-of-the-host](includes/disk-capabilities-of-the-host.md)]

## Azure region availability zone to host type mapping table

When you plan your Azure VMware Solution design, use the following table to understand what host types are available in each physical availability zone of an [Azure region](https://azure.microsoft.com/explore/global-infrastructure/geographies/#geographies).

>[!IMPORTANT]
> This mapping is important for placing your private clouds in close proximity to your Azure native workloads, including integrated services such as Azure NetApp Files and Pure Cloud Block Store.

The capability for Azure VMware Solution stretched clusters to deploy resources in multiple availability zones (Multi-AZ) is also tagged in the following table. The customer quota for Azure VMware Solution is assigned by Azure region. You can't specify the availability zone during private cloud provisioning. An autoselection algorithm is used to balance deployments across the Azure region.

If you have a particular availability zone to which you want to deploy, open a [Service Request](https://rc.portal.azure.com/#create/Microsoft.Support) with Microsoft. Request a "special placement policy" for your subscription, Azure region, availability zone, and host type. This policy remains in place until you request it to be removed or changed.

Host types marked in bold type are of limited availability because of customer consumption and might not be available upon request. Use the AV64 host type when AV36, AV36P, or AV52 host types are limited.

AV64 host types are available per availability zone. The following table lists the Azure regions that support this host type. For RAID-6 FTT2 and RAID-1 FTT3 storage policies, six and seven fault domains are needed, respectively. The fault domain count for each Azure region is listed in the column labeled **AV64 fault domains supported**.

| Azure region | Availability zone | Host type   | Multi-AZ SDDC | AV64 fault domains supported |
| :---         | :---:             | :---: | :---:         | :---:           |
| Australia East | AZ01 | AV36P, AV64 | Yes | 7 |
| Australia East | AZ02 | AV36, AV64| Yes | 7 |
| Australia East | AZ03 | AV36P, AV64 | Yes | 7 |
| Australia Southeast | AZ01 | AV36 | No | N/A |
| Brazil South | AZ02 | **AV36** | No | N/A |
| Canada Central | AZ02 | **AV36, AV36P**, AV64 | No | 7 |
| Canada East | N/A | AV36 | No | N/A |
| Central India | AZ03 | AV36P, AV64 | No | 7 |
| Central US | AZ01 | **AV36P**, AV64 | No | 7 |
| Central US | AZ02 | **AV36**, AV64 | No | 7 |
| Central US | AZ03 | AV36P, AV64 | No | 7 |
| East Asia | AZ01 | AV36, AV64 | No | 7 |
| East Asia | AZ02 | AV36P | No | N/A |
| East US | AZ01 | AV36P, AV64 | Yes | 7 |
| East US | AZ02 | AV36P, AV64 | Yes | 7 |
| East US | AZ03 | AV36, **AV36P**, AV64 | Yes | 7 |
| East US 2 | AZ01 | **AV36**, AV64 | No | 7 |
| East US 2 | AZ02 | AV36P, **AV52**, AV64 | No | 7 |
| France Central | AZ01 | **AV36** (AV64 Planned Q1 2025) | No | N/A (7 Planned Q1 2025) |
| Germany West Central | AZ01 | AV36P, AV64 | Yes | 7 |
| Germany West Central | AZ02 | **AV36**, AV64 | Yes | 7 |
| Germany West Central | AZ03 | **AV36, AV36P**, AV64 | Yes | 7 |
| Italy North | AZ03 | AV36P, AV64 | No | 7 |
| Japan East | AZ02 | **AV36**, AV64 | No | 7 |
| Japan East | AZ03 | AV48 | No | N/A |
| Japan West | AZ01 | **AV36**, AV64 | No | 7 |
| North Central US | AZ01 | **AV36**, AV64 | No | 7 |
| North Central US | AZ02 | **AV36P**, AV64 | No | 7 |
| North Europe | AZ02 | **AV36**, AV64 | No | 7 |
| Qatar Central | AZ03 | **AV36P** (AV64 Planned Q1 2025) | No | N/A (7 Planned Q1 2025) |
| South Africa North | AZ03 | **AV36**, AV64 | No | 7 |
| South Central US | AZ01 | AV36, AV64 | No | 7 |
| South Central US | AZ02 | AV36, AV36P, AV52, AV64 | No | 7 |
| Southeast Asia | AZ02 | **AV36**, AV36P | No | N/A |
| Sweden Central | AZ01 | AV36, AV64 | No | 7 |
| Switzerland North | AZ01 | **AV36**, AV64 | No | 7 |
| Switzerland North | AZ03 | AV36P (AV64 Planned Q1 2025) | No |N/A (7 Planned Q1 2025) |
| Switzerland West | AZ01 | **AV36**, AV64 | No | 7 |
| UAE North | AZ03 | AV36P | No | N/A |
| UK South | AZ01 | **AV36**, AV36P, AV52, AV64 | Yes | 7 |
| UK South | AZ02 | **AV36**, AV64 | Yes | 7 |
| UK South | AZ03 | AV36P, AV64 | Yes | 7 |
| UK West | AZ01 | **AV36** | No | N/A |
| West Europe | AZ01 | **AV36**, AV36P, AV52, **AV64** | Yes | 7 |
| West Europe | AZ02 | **AV36**, AV64 | Yes | 7 |
| West Europe | AZ03 | AV36P, AV64 | Yes | 7 |
| West US | AZ01 | AV36, AV36P, AV64 | No | 7 |
| West US 2 | AZ01 | AV36, AV64 | No | 7 |
| West US 2 | AZ02 | **AV36P** | No | N/A |
| West US 3 | AZ01 | **AV36P** | No | N/A |
| US Gov Arizona | AZ02 | AV36P | No | N/A |
| US Gov Virginia | AZ03 | AV36 | No | N/A |

## Clusters

[!INCLUDE [hosts-minimum-initial-deployment-statement](includes/hosts-minimum-initial-deployment-statement.md)]

> [!CAUTION]
> Deleting a cluster terminates all running workloads and components and is an irreversible operation. Once you delete a cluster, you cannot recover the data.

[!INCLUDE [azure-vmware-solutions-limits](includes/azure-vmware-solutions-limits.md)]

## VMware software versions

Microsoft is a member of the VMware metal as a service (MaaS) program and uses the [VMware Cloud Provider Stack](https://docs.vmware.com/en/VMware-Cloud-Provider-Stack/1.1/com.vmware.vcps.gsg.doc/GUID-5D686FB2-9886-44D3-845B-FDEF650C7575.html) for Azure VMware Solution upgrade planning.

[!INCLUDE [vmware-software-versions](includes/vmware-software-versions.md)]

## Backup and restore

Azure VMware Solution private cloud vCenter Server and HCX Manager (if enabled) configurations are on a daily backup schedule. The NSX configuration has an hourly backup schedule. The backups are retained for a minimum of three days. Open a [support request](https://rc.portal.azure.com/#create/Microsoft.Support) in the Azure portal to request restoration.

> [!NOTE]
> Restorations are intended for catastrophic situations only.

Azure VMware Solution continuously monitors the health of both the physical underlay and the Azure VMware Solution components. When Azure VMware Solution detects a failure, it takes action to repair the failed components.

## Related content

Now that you learned about Azure VMware Solution private cloud concepts, you might want to read:

- [Azure VMware Solution networking and interconnectivity concepts](architecture-networking.md)
- [Azure VMware Solution private cloud maintenance best practices](azure-vmware-solution-host-remediation.md)
- [Azure VMware Solution storage concepts](architecture-storage.md)
- [Enable an Azure VMware Solution resource](deploy-azure-vmware-solution.md#register-the-microsoftavs-resource-provider)

<!-- LINKS - internal -->
[concepts-networking]: ./concepts-networking.md

<!-- LINKS - external-->
[vCSA versions]: https://kb.vmware.com/s/article/2143838

[ESXi versions]: https://kb.vmware.com/s/article/2143832

[vSAN versions]: https://kb.vmware.com/s/article/2150753
