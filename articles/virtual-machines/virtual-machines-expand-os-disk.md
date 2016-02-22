<properties
   pageTitle="How to expand the OS drive of a Virtual Machine in an Azure Resource Group"
   description="Default size of OS drive in an IaaS Virtual Machine is 127 GB that may be an obstacle in some customers scenarios. This article demonstrates an approach for expanding the OS drive using Azure Resource Manager Powershell."
   services="virtual-machines,storage,azure-resource-manager"
   documentationCenter="dev-center-name"
   authors="kirpasingh"
   manager="roshar"
   editor=""/>

<tags
   ms.service="virtual-machines"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-multiple"
   ms.workload="na"
   ms.date="02/22/2016"
   ms.author="kirpas"/>

# How to expand the OS drive of a Virtual Machine in an Azure Resource Group
## Overview
When you create a new VM in a Resource Group by deploying an image from [Azure Marketplace](https://azure.microsoft.com/marketplace/), the default OS drive is 127 GB. Even though it’s possible to add data disks to the VM (how many depending upon the SKU you’ve chosen) and moreover it’s recommended to install applications and CPU intensive workloads on these addendum disks, oftentimes customers need to expand the OS drive to support certain scenarios such as following:

1.  Support legacy applications that install components on OS drive.
2.  Migrate a physical PC or virtual machine from on-premises with a larger OS drive.

>[AZURE.IMPORTANT]Azure has two different deployment models for creating and working with resources: Resource Manager and Classic. This article covers using the Resource Manager model. Microsoft recommends that most new deployments use the Resource Manager model.

## Resize the OS drive
In this article we’ll accomplish the task of resizing the OS drive using resource manager modules of [Azure Powershell](../powershell-install-configure.md). Open your Powershell ISE or Powershell window in administrative mode and follow the steps below:

1.  Sign-in to your Microsoft Azure account in resource management mode and select your subscription as follows:
    ```Powershell
    Login-AzureRmAccount
    Select-AzureRmSubscription –SubscriptionName 'my-subscription-name'
    ```

2.  Set your resource group name and virtual machine name as follows:
    ```Powershell
    $rgName = 'my-resource-group-name'
    $vmName = 'my-vm-name'
    ```

3.  Obtain a reference to your virtual machine as follows:
    ```Powershell
    $vm = Get-AzureRmVM -ResourceGroupName $rgName -Name $vmName
    ```

4. Stop the virtual machine before resizing the disk as follows:
    ```Powershell
    Stop-AzureRmVM -ResourceGroupName $rgName -Name $vmName
    ```

5.  And here comes the moment we’ve been waiting for! Set the size of the OS disk to the desired value and update the virtual machine as follows:
    ```Powershell
    $vm.StorageProfile.OSDisk.DiskSizeGB = 1023
    Update-AzureRmVM -ResourceGroupName $rgName -VM $vm
    ```

    >[AZURE.WARNING]The new size should be greater than the existing disk size. The maximum allowed is 1023 GB.

6.  Updating the virtual machine may take a few seconds. Once the command finishes executing, restart the virtual machine as follows:
    ```Powershell
    Start-AzureRmVM -ResourceGroupName $rgName -Name $vmName
    ```

And that’s it! Now RDP into the VM, open Computer Management (or Disk Management) and expand the drive using the newly allocated space.

## Summary
In this article, we used Azure Resource Manager modules of Powershell to expand the OS drive of an IaaS virtual machine. Reproduced below is the complete script for your reference:

```Powershell
Login-AzureRmAccount
Select-AzureRmSubscription -SubscriptionName 'my-subscription-name'
$rgName = 'my-resource-group-name'
$vmName = 'my-vm-name'
$vm = Get-AzureRmVM -ResourceGroupName $rgName -Name $vmName
Stop-AzureRmVM -ResourceGroupName $rgName -Name $vmName
$vm.StorageProfile.OSDisk.DiskSizeGB = 1023
Update-AzureRmVM -ResourceGroupName $rgName -VM $vm
Start-AzureRmVM -ResourceGroupName $rgName -Name $vmName
```
