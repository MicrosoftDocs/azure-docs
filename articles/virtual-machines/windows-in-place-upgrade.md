---
title: Windows in-place upgrade 
description: This article describes how to do an in-place upgrade for VMs running Windows Server in Azure.
services: virtual-machines
author: cynthn
ms.topic: how-to
ms.custom: devx-track-azurepowershell
ms.date: 07/05/2023
ms.author: cynthn
---

# In-place upgrade for VMs running Windows Server in Azure

An in-place upgrade allows you to go from an older operating system to a newer one while keeping your settings, server roles, and data intact. This article teaches you how to move your Azure VMs to a later version of Windows Server using an in-place upgrade. Currently, upgrading to Windows Server 2012, Windows Server 2016, Windows Server 2019 and Windows Server 2022 are supported.

Before you begin an in-place upgrade:

- Review the upgrade requirements for the target operating system:

   - Upgrade options for Windows Server 2012 from Windows Server 2008 (64-bit) or Windows Server 2008 R2

   - Upgrade options for Windows Server 2016 from Windows Server 2012 or Windows Server 2012 R2
   
   - Upgrade options for Windows Server 2019 from Windows Server 2012 R2 or Windows Server 2016

   - Upgrade options for Windows Server 2022 from Windows Server 2016 or Windows Server 2019

- Verify the operating system disk has enough [free space to perform the in-place upgrade](/windows-server/get-started/hardware-requirements#storage-controller-and-disk-space-requirements). If more space is needed [follow these steps](./windows/expand-os-disk.md) to expand the operating system disk attached to the VM.  

- Disable antivirus and anti-spyware software and firewalls. These types of software can conflict with the upgrade process. Re-enable antivirus and anti-spyware software and firewalls after the upgrade is completed. 


## Upgrade VM to volume license (KMS server activation)

The upgrade media provided by Azure requires the VM to be configured for Windows Server volume licensing. This is the default behavior for any Windows Server VM that was installed from a generalized image in Azure. If the VM was imported into Azure, then it might need to be converted to volume licensing to use the upgrade media provided by Azure. To confirm the VM is configured for volume license activation follow these steps to [configure the appropriate KMS client setup key](/troubleshoot/azure/virtual-machines/troubleshoot-activation-problems#step-1-configure-the-appropriate-kms-client-setup-key). If the activation configuration was changed, then follow these steps to [verify connectivity to Azure KMS service](/troubleshoot/azure/virtual-machines/troubleshoot-activation-problems#step-2-verify-the-connectivity-between-the-vm-and-azure-kms-service). 

 

## Upgrade to Managed Disks

The in-place upgrade process requires the use of Managed Disks on the VM to be upgraded. Most VMs in Azure are using Managed Disks, and retirement for unmanaged disks support was announced in November of 2022. If the VM is currently using unmanaged disks, then follow these steps to [migrate to Managed Disks](./windows/migrate-to-managed-disks.md).

 ## Create snapshot of the operating system disk

We recommend that you create a snapshot of your operating system disk and any data disks before starting the in-place upgrade process. This enables you to revert to the previous state of the VM if anything fails during the in-place upgrade process. To create a snapshot on each disk, follow these steps to [create a snapshot of a disk](./snapshot-copy-managed-disk.md). 

 
## Create upgrade media disk

To start an in-place upgrade the upgrade media must be attached to the VM as a Managed Disk. To create the upgrade media, modify the variables in the following PowerShell script for Windows Server 2022. The upgrade media disk can be used to upgrade multiple VMs, but it can only be used to upgrade a single VM at a time. To upgrade multiple VMs simultaneously multiple upgrade disks must be created for each simultaneous upgrade.

| Parameter | Definition |
|---|---|
| resourceGroup | Name of the resource group where the upgrade media Managed Disk will be created. The named resource group is created if it doesn't exist. |
| location | Azure region where the upgrade media Managed Disk is created. This must be the same region as the VM to be upgraded. |
| zone | Azure zone in the selected region where the upgrade media Managed Disk will be created. This must be the same zone as the VM to be upgraded. For regional VMs (non-zonal) the zone parameter should be "". |
| diskName | Name of the Managed Disk that will contain the upgrade media |
| sku | Windows Server upgrade media version. This must be either:  `server2016Upgrade` or `server2019Upgrade` or `server2022Upgrade` or `server2012Upgrade` |

If you have more than one subscription, you should run `Set-AzsSubscription -SubscriptionId <String>` to specify which subscription to use.

### PowerShell script 

```azurepowershell-interactive
#
# Customer specific parameters


# Resource group of the source VM
$resourceGroup = "WindowsServerUpgrades"

# Location of the source VM
$location = "WestUS2"

# Zone of the source VM, if any
$zone = "" 

# Disk name for the that will be created
$diskName = "WindowsServer2022UpgradeDisk"

# Target version for the upgrade - must be either server2022Upgrade, server2019Upgrade, server2016Upgrade or server2012Upgrade
$sku = "server2022Upgrade"


# Common parameters

$publisher = "MicrosoftWindowsServer"
$offer = "WindowsServerUpgrade"
$managedDiskSKU = "Standard_LRS"

#
# Get the latest version of the special (hidden) VM Image from the Azure Marketplace

$versions = Get-AzVMImage -PublisherName $publisher -Location $location -Offer $offer -Skus $sku | sort-object -Descending {[version] $_.Version	}
$latestString = $versions[0].Version


# Get the special (hidden) VM Image from the Azure Marketplace by version - the image is used to create a disk to upgrade to the new version


$image = Get-AzVMImage -Location $location `
                       -PublisherName $publisher `
                       -Offer $offer `
                       -Skus $sku `
                       -Version $latestString

#
# Create Resource Group if it doesn't exist
#

if (-not (Get-AzResourceGroup -Name $resourceGroup -ErrorAction SilentlyContinue)) {
    New-AzResourceGroup -Name $resourceGroup -Location $location    
}

#
# Create Managed Disk from LUN 0
#

if ($zone){
    $diskConfig = New-AzDiskConfig -SkuName $managedDiskSKU `
                                   -CreateOption FromImage `
                                   -Zone $zone `
                                   -Location $location
} else {
    $diskConfig = New-AzDiskConfig -SkuName $managedDiskSKU `
                                   -CreateOption FromImage `
                                   -Location $location
} 

Set-AzDiskImageReference -Disk $diskConfig -Id $image.Id -Lun 0

New-AzDisk -ResourceGroupName $resourceGroup `
           -DiskName $diskName `
           -Disk $diskConfig  

```

## Attach upgrade media to the VM

Attach the upgrade media for the target Windows Server version to the VM which will be upgraded. This can be done while the VM is in the running or stopped state.

### Portal instructions

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Virtual machines**.

1. Select a virtual machine to perform the in-place upgrade from the list.

1. On the **Virtual machine** page, select **Disks**.

1. On the **Disks** page, select **Attach existing disks**.

1. In the drop-down for **Disk name**, select the name of the upgrade disk created in the previous step.

1. Select **Save** to attach the upgrade disk to the VM.

 

## Perform in-place upgrade to Windows Server 2016, 2019, or 2022

To initiate the in-place upgrade the VM must be in the `Running` state. Once the VM is in a running state use the following steps to perform the upgrade.

1. Connect to the VM using [RDP](./windows/connect-rdp.md#connect-to-the-virtual-machine) or [RDP-Bastion](../bastion/bastion-connect-vm-rdp-windows.md#rdp).

1. Determine the drive letter for the upgrade disk (typically E: or F: if there are no other data disks).

1. Start Windows PowerShell.

1. Change directory to the only directory on the upgrade disk.

1. Execute the following command to start the upgrade:
   
   ```powershell
   .\setup.exe /auto upgrade /dynamicupdate disable 
   ```

1. Select the correct "Upgrade to" image based on the current version and configuration of the VM using the [Windows Server upgrade matrix](/windows-server/get-started/upgrade-overview).

During the upgrade process the VM will automatically disconnect from the RDP session. After the VM is disconnected from the RDP session the progress of the upgrade can be monitored through the [screenshot functionality available in the Azure portal](/troubleshoot/azure/virtual-machines/boot-diagnostics#enable-boot-diagnostics-on-existing-virtual-machine).

## Perform in-place upgrade to Windows Server 2012 only

To initiate the in-place upgrade the VM must be in the `Running` state. Once the VM is in a running state use the following steps to perform the upgrade.

1. Connect to the VM using [RDP](./windows/connect-rdp.md#connect-to-the-virtual-machine) or [RDP-Bastion](../bastion/bastion-connect-vm-rdp-windows.md#rdp).

1. Determine the drive letter for the upgrade disk (typically E: or F: if there are no other data disks).

1. Start Windows PowerShell.

1. Change directory to the only directory on the upgrade disk.

1. Execute the following command to start the upgrade:
   
   ```powershell
   .\setup.exe 
   ```

1. When Windows Setup launches, select **Install now**.
1. For **Get important updates for Windows Setup**, select **No thanks**.
1. Select the correct Windows Server 2012 "Upgrade to" image based on the current version and configuration of the VM using the [Windows Server upgrade matrix](/windows-server/get-started/upgrade-overview).
1. On the **License terms** page, select **I accept the license terms** and then select **Next**.
1. For **What type of installation do you want?" select **Upgrade: Install Windows and keep files, settings, and applications**.
1. Setup will product a **Compatibility report**, you can ignore any warnings and select **Next**.
1. When complete, the machine will reboot and you will automatically be disconnected from the RDP session. After the VM is disconnected from the RDP session the progress of the upgrade can be monitored through the [screenshot functionality available in the Azure portal](/troubleshoot/azure/virtual-machines/boot-diagnostics#enable-boot-diagnostics-on-existing-virtual-machine).


## Post upgrade steps 

Once the upgrade process has completed successfully the following steps should be taken to clean up any artifacts which were created during the upgrade process: 

- Delete the snapshots of the OS disk and data disk(s) if they were created.

- Delete the upgrade media Managed Disk.

- Enable any antivirus, anti-spyware or firewall software that may have been disabled at the start of the upgrade process.


## Recover from failure
If the in-place upgrade process failed to complete successfully you can return to the previous version of the VM if snapshots of the operating system disk and data disk(s) were created. To revert the VM to the previous state using snapshots complete the following steps: 

1. Create a new Managed Disk from the OS disk snapshot and each data disk snapshot following the steps in [Create a disk from a snapshot](scripts/virtual-machines-powershell-sample-create-managed-disk-from-snapshot.md) making sure to create the disks in the same Availability Zone as the VM if the VM is in a zone.

1. Stop the VM.

1. [Swap the OS disk](scripts/virtual-machines-powershell-sample-create-managed-disk-from-snapshot.md) of the VM. 

1. [Detach any data disks](./windows/detach-disk.md) from the VM.

1. [Attach data disks](./windows/attach-managed-disk-portal.md) created from the snapshots in step 1.

1. Restart the VM.


## Next steps

- For more information, see [Perform an in-place upgrade of Windows Server](/windows-server/get-started/perform-in-place-upgrade)
- For information about using Azure Migrate to upgrade, see [Azure Migrate Windows Server upgrade](/azure/migrate/how-to-upgrade-windows)
