---
title: Migrate Azure Virtual Machines and Azure Virtual Machine Scale Sets to availability zone support 
description: Learn how to migrate your Azure Virtual Machines and Virtual Machine Scale Sets to availability zone support.
author: faister
ms.service: virtual-machines
ms.topic: conceptual
ms.date: 09/21/2023
ms.author: anaharris 
ms.reviewer: anaharris
ms.custom: references_regions, subject-reliability
---
 
# Migrate Virtual Machines and Virtual Machine Scale Sets to availability zone support

This guide describes how to migrate Virtual Machines (VMs) and Virtual Machine Scale Sets from non-availability zone support to availability zone support. We take you through the different options for migration, including how you can use availability zone support for Disaster Recovery solutions.

Virtual Machine (VM) and Virtual Machine Scale Sets are availability zone enabled services, which means that VM resources can be deployed by using one of the following methods:

- **Zonal**: VM resources are deployed to a specific, self-selected availability zone to achieve more stringent latency or performance requirements.

- **Zone-redundant**: VM resources are replicated to one or more zones within the region to improve the resiliency of the application and data in a High Availability (HA) architecture.

To ensure high-availability of your compute resources, we recommend that you select multiple zones for your new VMs and Virtual Machine Scale Sets when you migrate to availability zones.

For more information on availability zone support for VM services, see [Reliability in Virtual Machines](./reliability-virtual-machines.md). For availability zone support for Virtual Machine scale sets, see [Reliability in Virtual Machine Scale Sets](./reliability-virtual-machine-scale-sets.md).

## Prerequisites

To migrate to availability zone support, your VM SKUs must be available across the zones in for your region. To check for VM SKU availability, use one of the following methods:

- Use PowerShell to [Check VM SKU availability](../virtual-machines/windows/create-PowerShell-availability-zone.md#check-vm-sku-availability).
- Use the Azure CLI to [Check VM SKU availability](../virtual-machines/linux/create-cli-availability-zone.md#check-vm-sku-availability).
- Go to [Foundational Services](availability-zones-service-support.md#an-icon-that-signifies-this-service-is-foundational-foundational-services).

## Downtime requirements

Because zonal VMs are created across the availability zones, all migration options mentioned in this article require downtime during deployment.

## Migration Option 1: Redeployment

### When to use redeployment

Use the redeployment option if you have set up good Infrastructure as Code (IaC) practices to manage infrastructure. This redeployment option gives you more control and the ability to automate various processes within your deployment pipelines. 

### Redeployment considerations

- When you redeploy your VM and Virtual Machine Scale Sets resources, the underlying resources such as managed disk and IP address for the VM are created in the same availability zone. You must use a Standard SKU public IP address and load balancer to create zone-redundant network resources.  

- Existing managed disks without availability zone support can't be attached to a VM with availability zone support. To attach existing managed disks to a VM with availability zone support, you need to take a snapshot of the current disks, and then create your VM with the new managed disks attached.

- For zonal deployments that require reasonably low network latency and good performance between application tier and data tier, use [proximity placement groups](../virtual-machines/co-location.md). Proximity groups can force grouping of different VM resources under a single network spine. For an example of an SAP workload that uses proximity placement groups, see [Azure proximity placement groups for optimal network latency with SAP applications](../virtual-machines/workloads/sap/sap-proximity-placement-scenarios.md)


### How to redeploy

If you want to migrate the data on your current managed disks when creating a new VM, follow the directions in [Migrate your managed disks](#migrate-your-managed-disks).

If you only want to create new VM with new managed disks in an availability zone, see:

- [Create VM using Azure CLI](../virtual-machines/linux/create-cli-availability-zone.md)
- [Create VM using Azure PowerShell](../virtual-machines/windows/create-PowerShell-availability-zone.md)
- [Create VM using Azure portal](../virtual-machines/create-portal-availability-zone.md?tabs=standard)

To learn how to create Virtual Machine Scale Sets in an availability zone, see [Create a virtual machine scale set that uses Availability Zones](../virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones.md).

### Migrate your managed disks

In this section, you migrate the data from your current managed disks to either zone-redundant storage (ZRS) managed disks or zonal managed disks.

#### Step 1: Create your snapshot

The easiest and cleanest way to create a snapshot is to do so while the VM is offline. See [Snapshots](../virtual-machines/backup-and-disaster-recovery-for-azure-iaas-disks.md#snapshots). If you choose this approach, some downtime should be expected. To create a snapshot of your VM using the Azure portal, PowerShell, or Azure CLI, see [Create a snapshot of a virtual hard disk](../virtual-machines/snapshot-copy-managed-disk.md)

If you're taking a snapshot of a disk that's attached to a running VM, read the guidance in [Snapshots](../virtual-machines/backup-and-disaster-recovery-for-azure-iaas-disks.md#snapshots) before proceeding.

>[!NOTE]
> The source managed disks remain intact with their current configurations and you'll continue to be billed for them. To avoid this, you must manually delete the disks once you've finished your migration and confirmed the new disks are working. For more information, see [Find and delete unattached Azure managed and unmanaged disks](../virtual-machines/windows/find-unattached-disks.md).


#### Step 2: Migrate the data on your managed disks

Now that you have snapshots of your original disks, you can use them to create either ZRS managed disks or zonal managed disks.
##### Migrate your data to zonal managed disks

To migrate a non-zonal managed disk to zonal:

1. Create a zonal managed disk from the source disk snapshot. The zone parameter should match your zonal VM.  To create a zonal managed disk from the snapshot, you can use [Azure CLI](../virtual-machines/scripts/create-managed-disk-from-snapshot.md)(example below), [PowerShell](../virtual-machines/scripts/virtual-machines-powershell-sample-create-managed-disk-from-snapshot.md), or the Azure portal.

    ```azurecli
        az disk create --resource-group $resourceGroupName --name $diskName --location $location --zone $zone --sku $storageType --size-gb $diskSize --source $snapshotId
    ```



##### Migrate your data to ZRS managed disks

>[!IMPORTANT]
> Zone-redundant storage (ZRS) for managed disks has some restrictions. For more information, see [Limitations](../virtual-machines/disks-deploy-zrs.md?tabs=portal#limitations). 

1. Create a ZRS managed disk from the source disk snapshot by using the following Azure CLI snippet: 

    ```azurecli
    # Create a new ZRS Managed Disks using the snapshot Id and the SKU supported   
    storageType=Premium_ZRS 
    location=westus2 

    az disk create --resource-group $resourceGroupName --name $diskName --sku $storageType --size-gb $diskSize --source $snapshotId 
    
    ```

#### Step 3: Create a new VM with your new disks

Now that you have migrated your data to ZRS managed disks or zonal managed disks, create a new VM with these new disks set as the OS and data disks:

```azurecli

    az vm create -g MyResourceGroup -n MyVm --attach-os-disk newZonalOSDiskCopy --attach-data-disks newZonalDataDiskCopy --os-type linux

```

## Migration Option 2: VM regional to zonal move

This section details how to move single instance Azure virtual machines from a Regional configuration to a target [Availability Zone](../reliability/availability-zones-overview.md) within the same Azure region.


> [!IMPORTANT]
> Regional to zonal move of single instance VM(s) configuration is currently in *Public Preview*.

###  Key benefits of regional to zonal move

The benefits of a regional to zonal move are:

- **Enhanced user experience**- The new availability zones in the desired region lowers the latency and builds a good customer experience.
- **Reduced downtime**- The virtual machines are supported throughout, thereby improving the application resiliency and availability.
- **Network connectivity**– Leverages the existing infrastructure, such as virtual networks (VNETs), subnets, network security groups (NSGs), and load balancers (LBs), which can support the target Zonal configuration. 
- **High scalability**- Orchestrates the move at scale by reducing manual touch points and minimizes the overall migration time from days to hours or even minutes, depending on the volume of data.


### Components

The following components are used during a regional to zonal move:

| Component | Details |
| --- | --- |
| Move collection |	A move collection is an Azure Resource Manager object that is created during the regional to zonal move process. The collection is based on the VM's region and subscription parameters and contains metadata and configuration information about the resources you want to move. VMs added to a move collection must be in the same subscription and region/location but can be selected from different resource groups.|
| Move resource |	When you add VM(s) to a move collection, it's tracked as a move resource and this information is maintained in the move collection for each of the VM(s) that are currently in the move process. The move collection will be created in a temporary resource group in your subscription and can be deleted along with the resource group if desired. |
| Dependencies | When you add VMs to the move collection, validation checks are done to determine if the VMs have any dependencies that aren't in the move collection. For example, a network interface card (NIC) is a dependent resource for a VM and must be moved along with the VM. After identifying the dependencies for each of the VMs, you can either add dependencies to the move collection and move them as well, or you can select alternate existing resources in the target zonal configuration. You can select an existing VNET in the target zonal configuration or create a new VNET as applicable. |

### Support matrix
   
##### **Virtual Machines compute**

The following table describes the support matrix for moving virtual machines from a regional to zonal configuration:

| Scenario | Support | Details |
| --- | --- | --- |
| Single Instance VM | Supported | Regional to zonal move of single instance VM(s) is supported. |
| VMs within an Availability Set | Not supported | |
| VMs inside Virtual Machine Scale Sets with uniform orchestration | Not supported | |
| VMs inside Virtual Machine Scale Sets with flexible orchestration | Not supported | |
| Supported regions | Supported | Only availability zone supported regions are supported. Learn [more](../reliability/availability-zones-service-support.md) to learn about the region details. |
| VMs already located in an availability zone | Not supported | Cross-zone move isn't supported. Only VMs that are within the same region can be moved to another availability zone. |
| VM extensions | Not Supported | VM move is supported, but extensions aren't copied to target zonal VM. |
| VMs with trusted launch | Supported | Re-enable the **Integrity Monitoring** option in the portal and save the configuration after the move. |
| Confidential VMs | Supported | Re-enable the **Integrity Monitoring** option in the portal and save the configuration after the move. |
| Generation 2 VMs (UEFI boot) | Supported | |
| VMs in Proximity placement groups | Supported | Source proximity placement group (PPG) is not retained in the zonal configuration. |
| Spot VMs (Low priority VMs) | Supported | |
| VMs with dedicated hosts | Supported | Source VM dedicated host won't be preserved. |
| VMs with Host caching enabled | Supported | |
| VMs created from marketplace images | Supported | |
| VMs created from custom images | Supported | |
| VM with HUB (Hybrid Use Benefit) license | Supported | |
| VM RBAC policies | Not Supported | VM move is supported, but RBACs aren't copied to target zonal VM. |
| VMs using Accelerated Networking | Supported | |

#### **Virtual Machines storage settings**

The following table describes the support matrix for moving virtual machines storage settings:

| Scenario | Support | Details |
| --- | --- | --- |
| VMs with managed disk | Supported | Regional to zonal move of single instance VM(s) is supported. |
| VMs using unmanaged disks | Not supported | |
| VMs using Ultra Disks | Not supported | |
| VMs using Ephemeral OS Disks | Not supported | |
| VMs using shared disks | Not supported | |
| VMs with standard HDDs | Supported | |
| VMs with standard SSDs | Supported | |
| VMs with premium SSDs | Supported | |
| VMs with NVMe disks (Storage optimized - Lsv2-series) | Supported | |
| Temporary disk in VMs | Supported | Temporary disks will be created; however, they won't contain the data from the source temporary disks. |
| VMs with ZRS disks | Supported | |
| VMs with ADE (Azure Disk Encryption) | Supported | |
| VMs with server-side encryption using service-managed keys | Supported | |
| VMs with server-side encryption using customer-managed keys | Supported | |
| VMs with Host based encryption enabled with PM | Not Supported | |
| VMs with Host based encryption enabled with CMK | Not Supported | |
| VMs with Host based encryption enabled with Double encryption | Not Supported | |

#### **Virtual Machines networking settings**

The following table describes the support matrix for moving virtual machines networking settings:

| Scenario | Support | Details | 
| --- | --- | --|
| NIC | Supported | By default, a new resource is created, however, you can specify an existing resource in the target configuration. | 
| VNET | Supported| By default, the source virtual network (VNET) is used, or you can specify an existing resource in the target configuration. | 

### How to move a VM from regional to zonal configuration

Before moving a VM from regional to zonal configuration, see [FAQ - Move Azure single instance VM from regional to zonal](../virtual-machines/move-virtual-machines-regional-zonal-faq.md).

To learn how to move VMs from regional to zonal configuration within same region in the Azure portal, see [Move Azure single instance VMs from regional to zonal configuration](../virtual-machines/move-virtual-machines-regional-zonal-portal.md).

To learn how to do the same using Azure PowerShell and CLI, see [Move a VM in an availability zone using Azure PowerShell and CLI](../virtual-machines/move-virtual-machines-regional-zonal-powershell.md).

## Migration Option 3: Azure Resource Mover

### When to use Azure Resource Mover

Use Azure Resource Mover for an easy way to move VMs or encrypted VMs from one region without availability zones to another with availability zone support. If you want to learn more about the benefits of using Azure Resource Mover, see [Why use Azure Resource Mover?](../resource-mover/overview.md#why-use-resource-mover).

### Azure Resource Mover considerations

When you use Azure Resource mover, all keys and secrets are copied from the source key vault to the newly created destination key vault in your target region. All resources related to your customer-managed keys, such as Azure Key Vaults, disk encryption sets, VMs, disks, and snapshots, must be in the same subscription and region. Azure Key Vault’s default availability and redundancy feature can't be used as the destination key vault for the moved VM resources, even if the target region is a secondary region to which your source key vault is replicated.  

### How to use Azure Resource Mover

To learn how to move VMs to another region, see [Move Azure VMs to an availability zone in another region](../resource-mover/move-region-availability-zone.md)

To learn how to move encrypted VMs to another region, see [Tutorial: Move encrypted Azure VMs across regions](../resource-mover/tutorial-move-region-encrypted-virtual-machines.md)

## Disaster Recovery Considerations

Typically, availability zones are used to deploy VMs in a High Availability configuration. They may be too close to each other to serve as a Disaster Recovery solution during a natural disaster.  However, there are scenarios where availability zones can be used for Disaster Recovery. To learn more, see [Using Availability Zones for Disaster Recovery](../site-recovery/azure-to-azure-how-to-enable-zone-to-zone-disaster-recovery.md#using-availability-zones-for-disaster-recovery).

The following requirements should be part of a disaster recovery strategy that helps your organization run its workloads during planned or unplanned outages across zones:

- The source VM must already be a zonal VM, which means that it's placed in a logical zone.  
- You need to replicate your VM from one zone to another zone using Azure Site Recovery service.  
- Once your VM is replicated to another zone, you can follow steps to run a Disaster Recovery drill, fail over, reprotect, and failback.  
- To enable VM disaster recovery between availability zones, follow the instructions in [Enable Azure VM disaster recovery between availability zones](../site-recovery/azure-to-azure-how-to-enable-zone-to-zone-disaster-recovery.md) .  

## Next Steps

- [Azure services and regions that support availability zones](availability-zones-service-support.md)
- [Reliability in Virtual Machines](./reliability-virtual-machines.md)
- [Reliability in Virtual Machine Scale Sets](./reliability-virtual-machine-scale-sets.md)
- [Move single instance Azure VMs from regional to zonal configuration using PowerShell](../virtual-machines/move-virtual-machines-regional-zonal-powershell.md)
- [Move single instance Azure VMs from regional to zonal configuration via portal](../virtual-machines/move-virtual-machines-regional-zonal-portal.md)

