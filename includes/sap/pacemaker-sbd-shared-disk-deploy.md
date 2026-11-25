---
title: Pacemaker Cluster SBD Shared Disk Deployment Steps
description: Include File for Pacemaker Cluster SBD Shared Disk Deployment Steps
services: 
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: include
ms.date: 08/01/2026
author: zamasiel-msft
ms.author: zamasiel
manager: radeltch
---
## Deploy an Azure Shared Disk for SBD

To create and attach an Azure shared disk by using PowerShell, run the following commands. If you want to deploy resources by using the Azure CLI or the Azure portal, see [Deploy a ZRS disk][azdoc-vm-disk-deploy-zrs].

```azurepowershell-interactive
$ResourceGroup = "<ResourceGroupName>"
$DiskSizeInGB = 4
$DiskName = "<SBDDiskName>"
# Must be Equal to or greater than the Number of Nodes in the Cluster
$ShareNodes = 2 
# Options are "Premium_LRS" or "Premium_ZRS"
$SKUName = "<DiskSKU>"
# VMs to attach the disk to
$vmNames = @("sap-cl1", "sap-cl2")
# Lun to attach the disk to. You should use the same lun on all servers in the cluster.
$lunNumber = <lunNumber>

$diskConfig = New-AzDiskConfig -Location $Location -SkuName $SkuName -CreateOption Empty -DiskSizeGB $DiskSizeInGB -MaxSharesCount $ShareNodes

$dataDisk = New-AzDisk -ResourceGroupName $ResourceGroup -DiskName $DiskName -Disk $diskConfig

# Attach SBD disk to cluster VMs
foreach ($vmName in $vmNames) 
{
  $vm = Get-AzVM -ResourceGroupName $resourceGroup -Name $vmName
  Add-AzVMDataDisk -VM $vm -Name $diskName -CreateOption Attach -ManagedDiskId $dataDisk.Id -Lun $lunNumber
  Update-AzVM -VM $vm -ResourceGroupName $resourceGroup -Verbose
}

```

[azdoc-vm-disk-deploy-zrs]: /azure/virtual-machines/disks-deploy-zrs