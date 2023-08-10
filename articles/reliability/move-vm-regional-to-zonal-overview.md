---
title: Move Azure Virtual Machines from regional to zonal availability zones
description: This article describes how to move single instance Azure virtual machines from a regional configuration to a target Availability Zone within the same Azure region.
author: ankitaduttaMSFT
ms.service: reliability
ms.subservice: availability-zones
ms.topic: article
ms.date: 08/10/2023
ms.author: ankitadutta
---

# Azure virtual machines - Regional to Zonal Move

This article describes how to move single instance Azure virtual machines from a Regional configuration to a target Availability Zone  within the same Azure region.

##  Key benefits of regional to zonal move

Following are the benefits of regional to zonal move:

- Enhanced user experience- The ability to take advantage of  The new availability zones in the desired region, which can reduce lowers the  latency and bring you closer to customers builds a good customer experience.
- Reduced downtime - Improved application resiliency and availability, as The virtual machines are supported by a 99.99% uptime SLA there by improving the application resiliency and availability.
- Network connectivity – Leverages the existing infrastructure, such as virtual networks (VNETs), subnets, network security groups (NSGs), and load balancers (LBs), which can support the target Zonal configuration. 
- High scalability - Orchestrate the move at scale by, reducing manual touch points and minimize the overall migration time from days to hours or even minutes, depending on the amount of data.


## Components

The following components are used during the regional to zonal move:

| Component | Details |
| --- | --- |
| Move collection |	A move collection is an Azure Resource Manager object that is created during the Regional to Zonal move process. The collection is based on the VMs' region and subscription parameters and contains metadata and configuration information about the resources you want to move. VMs added to a move collection must be in the same subscription and region/location but can be selected from different resource groups.|
| Move resource |	When you add VM(s) to a move collection, it's tracked as a move resource and this information is maintained in the move collection for each of the VM(s) that are currently in the move process. The move collection will be created in a temporary resource group in your subscription and can be deleted along with the resource group if desired. |
| Move resource | When you add VM(s) to a move collection, it's tracked as a move resource and this information is maintained in the move collection for each of the VM(s) that are currently in the move process. |
| Dependencies | When you add VMs to the move collection, validation checks are performed to determine if the VMs have any dependencies that are not in the move collection. For example, a network interface card (NIC) is a dependent resource for a VM and must be moved along with the VM. After identifying dependencies for each of the VMs, you can either add dependencies to the move collection and move them as well, or you can select alternate existing resources in the target zonal configuration. For example, yYou can select a new VNET that’s already existing in the target zonal configuration. |


## Support matrix
   
**Virtual Machines compute**

The following table describes the support matrix for moving virtual machines from regional to zonal configuration:

| Scenario | Support | Details |
| --- | --- | --- |
| Single Instance VM | Supported | Regional to Zonal Move of Single Instance VM(s) supported. |
| VMs within an Availability Set | Not supported | |
| VMs inside VMSS with uniform orchestration | Not supported | |
| VMs inside VMSS with flexible orchestration | Not supported | |
| Supported regions | Supported | Only Availability Zone supported regions are supported. Learn [more](https://docs.microsoft.com/azure/availability-zones/az-overview#regions) to learn about the region details. |
| VMs already located in an Availability Zone | Not supported | Currently, only VMs that are within the same region can be moved to another availability zone. Cross Zone Move is currently unsupported. |
| VM extensions | Not Supported | VM move is supported, but extensions are not copied to target zonal VM. |
| VMs with trusted launch | Supported | Re-enable the Integrity Monitoring option in the portal and save the configuration after the move. |
| Confidential VMs | Supported | Re-enable the Integrity Monitoring option in the portal and save the configuration after the move. |
| Generation 2 VMs (UEFI boot) | Supported | |
| VMs in Proximity placement groups | Supported | Source proximity placement group (PPG) is not retained in the zonal configuration. |
| Spot VMs (Low priority VMs) | Supported | |
| VMs with dedicated hosts | Supported | Source VM dedicated host will not be preserved. |
| VMs with Host caching enabled | Supported | |
| VMs created from marketplace images | Supported | |
| VMs created from custom images | Supported | |
| VM with HUB (Hybrid Use Benefit) license | Supported | |
| VM RBAC policies | Not Supported | VM move is supported, but RBACs are not copied to target zonal VM. |
| VMs using Accelerated Networking | Supported | |

**Virtual Machines storage settings**

The following table describes the support matrix for moving virtual machines storage settings:

| Scenario | Support | Details |
| --- | --- | --- |
| VMs with managed disk | Supported | |
| VMs using un-managed disks | Not supported | |
| VMs using Ultra Disks | Not supported | |
| VMs using Ephemeral OS Disks | Not supported | |
| VMs using shared disks | Not supported | |
| VMs with standard HDDs | Supported | |
| VMs with standard SSDs | Supported | |
| VMs with premium SSDs | Supported | |
| VMs with NVMe disks (Storage optimized - Lsv2-series) | Supported | |
| Temporary disk in VMs | Supported | Temporary disks will be created, however, they will not contain the data from the source temporary disks. |
| VMs with ZRS disks | Not Supported | |
| VMs with ADE (Azure Disk Encryption) | Not Supported | |
| VMs with server-side encryption using service-managed keys | Not Supported | |
| VMs with server-side encryption using customer-managed keys | Not Supported | |
| VMs with Host based encryption enabled with PM | Not Supported | |
| VMs with Host based encryption enabled with CMK | Not Supported | |
| VMs with Host based encryption enabled with Double encryption | Not Supported | |

**Virtual Machines networking settings**

The following table describes the support matrix for moving virtual machines networking settings:

| Scenario | Support | Details |
| --- | --- | --- |
| NIC | By default, a new resource is created, however, you can specify an existing resource in the target configuration. | |
| VNET | By default, the source virtual network (VNET) is used, or you can specify an existing resource in the target configuration. | |

## Next steps
