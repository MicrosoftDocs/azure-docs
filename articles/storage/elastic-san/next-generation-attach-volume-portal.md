---
title: Connect an Azure Elastic SAN Next Generation volume to a VM
description: Learn how to connect an Azure Elastic SAN Next Generation Direct Attach or iSCSI volume to a virtual machine.
author: normesta
ms.service: azure-elastic-san
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.topic: how-to
ms.date: 11/09/2026
ms.author: chenannie
# Customer intent: "As an Azure administrator, I want to connect an Elastic SAN Next Generation volume to a VM."
---

# Connect an Azure Elastic SAN Next Generation volume to a VM

This article explains how to connect an existing Azure Elastic SAN Next Generation volume to an existing Linux or Windows virtual machine (VM).

> [!IMPORTANT]
> Azure Elastic SAN Next Generation is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Direct Attach volumes

The procedures in this section apply to Business Critical volumes and General Purpose volumes configured for Direct Attach. You can use the Azure portal, Azure PowerShell, or Azure CLI to attach these volumes to or detach them from a VM as data disks.

### Prerequisites

Before you begin, make sure you have:

- An Azure subscription with permissions to register preview features and update the target VM.
- An existing Linux or Windows VM in the same region as the volume. For zonal resources, the VM and volume must also be in the same availability zone.
- A compatible VM size. The VM requirements and limitations for Ultra Disk apply to Business Critical volumes. The VM requirements and limitations for Premium SSD v2 apply to General Purpose Direct Attach volumes. VM size availability varies by region and availability zone. For more information, see [Deploy a Premium SSD v2](/azure/virtual-machines/disks-deploy-premium-v2) and [Configure Ultra Disks for Azure virtual machines](/azure/virtual-machines/disks-enable-ultra-ssd).
- A volume group with `protocolType` set to `DirectAttach`.
- A volume whose provisioning state is `Succeeded`.
- A free logical unit number (LUN) and sufficient VM data disk capacity.
- Elastic SAN Next Generation volumes can only be attached to a VM as data disks. You can't use them as operating system disks.

#### Azure PowerShell prerequisites

If you use Azure PowerShell, install the preview Az.Compute module provided for Elastic SAN Next Generation. Confirm that the `Add-AzVMDataDisk` cmdlet exposes the `ElasticSanVolumeId` parameter.

#### Azure CLI prerequisites

If you use Azure CLI, install the [latest Azure CLI](/cli/azure/install-azure-cli) and the Elastic SAN extension:

```azurecli
az extension add --name elastic-san
```

### Attach an existing volume

# [Portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Go to the VM that you want to use.
1. Under **Settings**, select **SAN volumes (preview)**.
1. Select **Attach volume**.
1. Select **Elastic SAN Next Generation**.
1. Select one or more existing volumes to attach.
1. Select **Attach**.
1. Wait for each volume to show an attached status before you continue.

# [PowerShell](#tab/azure-powershell)

Set the variables, get the existing volume and VM, and select an unused LUN:

```azurepowershell
$vmResourceGroupName = "<vm-resource-group-name>"
$vmName = "<vm-name>"
$elasticSanResourceGroupName = "<elastic-san-resource-group-name>"
$elasticSanName = "<elastic-san-name>"
$volumeGroupName = "<volume-group-name>"
$volumeName = "<volume-name>"
$lun = <unused-lun>

$volume = Get-AzElasticSanVolume `
    -ResourceGroupName $elasticSanResourceGroupName `
    -ElasticSanName $elasticSanName `
    -VolumeGroupName $volumeGroupName `
    -Name $volumeName

$vm = Get-AzVM `
    -ResourceGroupName $vmResourceGroupName `
    -Name $vmName
```

Add the existing volume to the VM configuration, and then update the VM:

```azurepowershell
$vm = Add-AzVMDataDisk `
    -VM $vm `
    -Name $volumeName `
    -CreateOption Attach `
    -ElasticSanVolumeId $volume.Id `
    -Lun $lun

Update-AzVM `
    -ResourceGroupName $vmResourceGroupName `
    -VM $vm
```

# [Azure CLI](#tab/azure-cli)

Set the variables for the existing VM and volume:

```azurecli
vmResourceGroupName="<vm-resource-group-name>"
vmName="<vm-name>"
elasticSanResourceGroupName="<elastic-san-resource-group-name>"
elasticSanName="<elastic-san-name>"
volumeGroupName="<volume-group-name>"
volumeName="<volume-name>"
```

Get the volume resource ID:

```azurecli
volumeId=$(az elastic-san volume show \
    --resource-group $elasticSanResourceGroupName \
    --elastic-san-name $elasticSanName \
    --volume-group-name $volumeGroupName \
    --name $volumeName \
    --query id \
    --output tsv)
```

Pass the volume resource ID to [az vm disk attach](/cli/azure/vm/disk#az-vm-disk-attach):

```azurecli
az vm disk attach \
    --resource-group $vmResourceGroupName \
    --vm-name $vmName \
    --disk-ids $volumeId
```

---

### Make the volume available to the guest operating system

Attaching a volume doesn't initialize, format, mount, or otherwise change the volume in the guest operating system.

#### Linux

1. Connect to the VM by using SSH.
1. Identify the attached data disk and its LUN. VM sizes v6 and newer generally use NVMe, while v5 and older VM sizes generally use SCSI. For commands that identify both device types, see [Identifying disks](/azure/virtual-machines/linux/add-disk?tabs=lsblk#identifying-disks).
1. If the volume already contains data, don't repartition or format it. Mount its existing file system.
1. If the volume is empty, partition and format it, and then mount it. For detailed steps, see [Prepare a new empty data disk in Linux](/azure/virtual-machines/linux/attach-disk-portal?tabs=scsi#prepare-a-new-empty-data-disk-in-linux).
1. Use the file system UUID in `/etc/fstab` if you want the volume to mount automatically after a reboot. For details, see [Configure automatic mounting in /etc/fstab](/azure/virtual-machines/linux/attach-disk-portal?tabs=scsi#prepare-a-new-empty-data-disk-in-linux).

#### Windows

1. Connect to the VM.
1. Open **Disk Management**, and identify the attached data disk by its size and LUN.
1. If the volume already contains data, don't initialize or format it. Bring the disk online and assign a drive letter if necessary.
1. If the volume is empty, initialize it, create a simple volume, and format it. For detailed steps and data-loss precautions, see [Initialize a new data disk](/azure/virtual-machines/windows/attach-disk-ps#initialize-the-disk).

### Detach a volume

Before you detach a volume, make sure that nothing on the VM is actively using it. For Linux, stop applications that use the volume, remove its entry from `/etc/fstab`, and unmount its file systems. For Windows, stop applications and services that use the volume.

# [Portal](#tab/azure-portal)

1. In the Azure portal, go to the VM that has the volume attached.
1. Under **Settings**, select **SAN volumes (preview)**.
1. Select the volume that you want to detach.
1. Select **Detach** and confirm the operation.
1. Wait for the volume to no longer appear as attached.

# [PowerShell](#tab/azure-powershell)

Set the variables, get the VM, remove the volume from its data disk configuration, and update the VM:

```azurepowershell
$vmResourceGroupName = "<vm-resource-group-name>"
$vmName = "<vm-name>"
$volumeName = "<volume-name>"

$vm = Get-AzVM `
    -ResourceGroupName $vmResourceGroupName `
    -Name $vmName

$vm = Remove-AzVMDataDisk `
    -VM $vm `
    -Name $volumeName

Update-AzVM `
    -ResourceGroupName $vmResourceGroupName `
    -VM $vm
```

# [Azure CLI](#tab/azure-cli)

Set the variables for the existing VM and volume:

```azurecli
vmResourceGroupName="<vm-resource-group-name>"
vmName="<vm-name>"
elasticSanResourceGroupName="<elastic-san-resource-group-name>"
elasticSanName="<elastic-san-name>"
volumeGroupName="<volume-group-name>"
volumeName="<volume-name>"
```

Get the volume resource ID:

```azurecli
volumeId=$(az elastic-san volume show \
    --resource-group $elasticSanResourceGroupName \
    --elastic-san-name $elasticSanName \
    --volume-group-name $volumeGroupName \
    --name $volumeName \
    --query id \
    --output tsv)
```

Detach the volume from the VM:

```azurecli
az vm disk detach \
    --resource-group $vmResourceGroupName \
    --vm-name $vmName \
    --disk-ids $volumeId
```

---

Detaching a volume doesn't delete it. You can attach the volume to the same VM or another compatible VM later.

## General Purpose iSCSI volumes

General Purpose volume groups configured for iSCSI connect to a VM through the iSCSI protocol instead of attaching as data disks. Use the instructions for the VM's guest operating system:

- [Connect to an Azure Elastic SAN volume - Windows](elastic-san-connect-windows.md)
- [Connect to an Azure Elastic SAN volume - Linux](elastic-san-connect-linux.md)

## Next steps

- [Azure Elastic SAN Next Generation snapshots overview](next-generation-snapshots-overview.md)
- [Manage Azure Elastic SAN Next Generation snapshots](next-generation-manage-snapshots.md)
