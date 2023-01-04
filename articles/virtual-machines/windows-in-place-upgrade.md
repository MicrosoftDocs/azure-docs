 
---
title: Windows in-place upgrade 
description: This article describes how to do an in-place upgrade for VMs running Windows Server in Azure.
services: virtual-machines
author: cynthn
ms.topic: how-to
ms.date: 01/10/2023
ms.author: cynthn

---

# In-place upgrade for VMs running Windows Server in Azure 

Before you begin an in-place upgrade:

1. Review the upgrade requirements for the target operating system 

   - Upgrade options for Windows Server 2019 

   - Upgrade options for Windows Server 2022 

1. Verify the operating system disk has enough [free space to perform the in-place upgrade](/windows-server/get-started/hardware-requirements#storage-controller-and-disk-space-requirements). If additional space is needed [follow these steps](https://learn.microsoft.com/en-us/azure/virtual-machines/windows/expand-os-disk) to expand the operating system disk attached to the VM.  

1. Disable antivirus and anti-spyware software and firewalls. These types of software can conflict with the upgrade process. Re-enable antivirus and anti-spyware software and firewalls after the upgrade is completed. 

 

## Upgrade VM to volume license (KMS server activation) 

The upgrade media provided by Azure requires the VM to be configured for Windows Server volume licensing. This is the default behavior for any Windows Server VM that was installed from a generalized image in Azure. If the VM was imported into Azure, then it may need to be converted to volume licensing to use the upgrade media provided by Azure. To confirm the VM is configured for volume license activation follow these steps to [configure the appropriate KMS client setup key](/troubleshoot/azure/virtual-machines/troubleshoot-activation-problems#step-1-configure-the-appropriate-kms-client-setup-key). If the activation configuration was changed, then follow these steps to [verify connectivity to Azure KMS service](/troubleshoot/azure/virtual-machines/troubleshoot-activation-problems#step-2-verify-the-connectivity-between-the-vm-and-azure-kms-service). 

 

## Upgrade to Managed Disks 

The in-place upgrade process requires the use of Managed Disks on the VM to be upgraded. If the VM is currently using unmanaged disks, then follow these steps to [migrate to Managed Disks](/azure/virtual-machines/snapshot-copy-managed-disk).

 

## Create snapshot of the operating system disk 

We recommend that you create a snapshot of your operating system disk and any data disks before starting the in-place upgrade process. This will enable you to revert to the previous state of the VM if anything fails during the in-place upgrade process. To create a snapshot on each disk, follow these steps to [create a snapshot of a disk](/azure/virtual-machines/snapshot-copy-managed-disk). 

 

Create upgrade media disk 

To perform an in-place upgrade the upgrade media must be attached to the VM as a Managed Disk. To create the upgrade media, use the following PowerShell script with the specific variables configured for the desired upgrade media. The created upgrade media disk can be used to upgrade multiple VMs, but it can only be used to upgrade a single VM at a time. To upgrade multiple VMs simultaneously multiple upgrade disks must be created for each simultaneous upgrade. 

Script parameters 

Parameter 

Definition 

resourceGroup 

Name of the resource group where the upgrade media Managed Disk will be created. The named resource group will be created if it does not exist. 

location 

Azure region where the upgrade media Managed Disk will be created. This must be the same region as the VM to be upgraded. 

zone 

Azure zone in the selected region where the upgrade media Managed Disk will be created. This must be the same zone as the VM to be upgraded. For regional VMs (non-zonal) the zone parameter should be "". 

diskName 

Name of the Managed Disk that will contain the upgrade media 

sku 

Windows Server upgrade media version. This must be either: 

server2022Upgrade 

server2019Upgrade 

 

Script contents 

# 

# Customer specific parameters  

# 

$resourceGroup = "WindowsServerUpgrades" 

$location = "WestUS2" 

$diskName = "WindowsServer2022UpgradeDisk" 

$zone = ""  

 

 

# 

# Selection of upgrade target version 

# 

$sku = "server2022Upgrade" 

 

# 

# Common parameters 

# 

$publisher = "MicrosoftWindowsServer" 

$offer = "WindowsServerUpgrade" 

$sku = "server2022Upgrade" 

$managedDiskSKU = "Standard_LRS" 

 

# 

# Get the latest version of the image 

# 

$versions = Get-AzVMImage -PublisherName $publisher -Location $location -Offer $offer -Skus $sku | sort-object -Descending {[version] $_.Version} 

$latestString = $versions[0].Version 

 

 

# 

# Get Image 

# 

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

$diskConfig = New-AzDiskConfig -SkuName $managedDiskSKU -CreateOption FromImage -Location $location 

 

Set-AzDiskImageReference -Disk $diskConfig -Id $image.Id -Lun 0 

 

New-AzDisk -ResourceGroupName $resourceGroup ` 

           -DiskName $diskName ` 

           -Disk $diskConfig   

 

Attach upgrade media to VM 

Attach the upgrade media for the target Windows Server version to the VM which will be upgraded. This can be done while the VM is in the running or stopped state. 

Portal Instructions 

Sign in to the Azure portal. 

Search for and select Virtual machines. 

Select a virtual machine to perform the in-place upgrade from the list. 

On the Virtual machine pane, select Disks. 

On the Disks pane, select Attach existing disks. 

In the drop-down for Disk name select the name of the upgrade disk created in the previous step. 

Select Save to attach the upgrade disk to the VM. 

 

Perform in-place upgrade 

To initiate the in-place upgrade the VM must be in a running state. Once the VM is in a running state use the following steps to perform the upgrade. 

Connect to the VM using RDP or RDP-Bastion 

Determine the drive letter for the upgrade disk (typically E: or F: if there are no other data disks) 

Start Windows PowerShell 

Change directory to the only directory on the upgrade disk 

Execute the following command to start the upgrade 

 

.\setup.exe /auto upgrade /dynamicupdate disable 

 

Select the correct Upgrade To image based on the current version and configuration of the VM using the following table 

Upgrade From 

Upgrade To 

Windows Server 2012 R2 (Core) 

Windows Server 2016 Datacenter 

-or- 

Windows Server 2019 Datacenter 

Windows Server 2012 R2 (Desktop Experience) 

Windows Server 2016 Datacenter (Desktop Experience) 

-or- 

Windows Server 2019 Datacenter (Desktop Experience) 

Windows Server 2016 (Core) 

Windows Server 2019 Datacenter 

-or- 

Windows Server 2022 Datacenter 

Windows Server 2016 (Desktop Experience) 

Windows Server 2019 Datacenter (Desktop Experience) 

-or- 

Windows Server 2022 Datacenter (Desktop Experience) 

Windows Server 2019 (Core) 

Windows Server 2022 Datacenter 

Windows Server 2019 (Desktop Experience) 

Windows Server 2022 Datacenter (Desktop Experience) 

 

During the upgrade process the VM will automatically disconnect from the RDP session. After the VM is disconnected from the RDP session the progress of the upgrade can be monitored through the screenshot functionality available in the Azure portal. 

 

Post upgrade steps 

Once the upgrade process has completed successfully the following steps should be taken to clean up any artifacts which were created during the upgrade process: 

Delete the snapshots of the OS disk and data disk(s) if they were created. 

Delete the upgrade media Managed Disk 

Enable any antivirus, anti-spyware or firewall software that may have been disabled at the start of the upgrade process 

Recovery from failures 

If the in-place upgrade process failed to complete successfully you can return to the previous version of the VM if snapshots of the operating system disk and data disk(s) were created. To revert the VM to the previous state using snapshots complete the following steps: 

Create a new Managed Disk from the OS disk snapshot and each data disk snapshot following the steps in <Create Disk from Snapshot link> making sure to create the disks in the same Availability Zone (AZ) as the VM if the VM is in an AZ. 

Stop the VM in which the in-place upgrade failed 

Swap the OS disk of the VM following the steps in <Swap OS Disk link> 

Detach any data disks on the VM following the steps in detach a data disk using the portal. 

Attach data disks created from the snapshots in step 1 following the steps in <Add existing disk link> 

Restart VM 