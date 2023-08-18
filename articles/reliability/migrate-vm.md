---
title: Migrate Azure Virtual Machines and Azure Virtual Machine Scale Sets to availability zone support 
description: Learn how to migrate your Azure Virtual Machines and Virtual Machine Scale Sets to availability zone support.
author: faister
ms.service: virtual-machines
ms.topic: conceptual
ms.date: 04/21/2022
ms.author: anaharris 
ms.reviewer: anaharris
ms.custom: references_regions, subject-reliability
---
 
# Migrate Virtual Machines and Virtual Machine Scale Sets to availability zone support

This guide describes how to migrate Virtual Machines (VMs) and Virtual Machine Scale Sets from non-availability zone support to availability zone support. We take you through the different options for migration, including how you can use availability zone support for Disaster Recovery solutions.

Virtual Machine (VM) and Virtual Machine Scale Sets are zonal services, which means that VM resources can be deployed by using one of the following methods:

- VM resources are deployed to a specific, self-selected availability zone to achieve more stringent latency or performance requirements.

- VM resources are replicated to one or more zones within the region to improve the resiliency of the application and data in a High Availability (HA) architecture.

When you migrate resources to availability zone support, we recommend that you select multiple zones for your new VMs and Virtual Machine Scale Sets, to ensure high-availability of your compute resources.

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


## Migration Option 2: Azure Resource Mover

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

Learn more about:

> [!div class="nextstepaction"]
> [Azure services and regions that support availability zones](availability-zones-service-support.md)
