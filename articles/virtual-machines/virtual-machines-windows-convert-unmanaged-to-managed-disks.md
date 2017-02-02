---
title: Convert a Vm from unmanged to managed disks - Azure | Microsoft Docs
description: Convert a Vm from unmanaged disks to managed disks using PowerShell in the Resource Manager deployment model
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: afdae4a1-6dfb-47b4-902a-f327f9bfe5b4
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 02/01/2017
ms.author: cynthn

---
# Convert a VM from unmanaged disks to managed disks


Warning: During the conversion, you will be deallocating the VM. Deallocating the VM means that it will have a new IP address when it is started after the conversion. If you have a dependency on a fixed IP, you should use a reserved IP.

## Log in to Azure PowerShell
1. Open Azure PowerShell and sign in to your Azure account.
   
    ```powershell
    Login-AzureRmAccount
    ```
   
    A pop-up window opens for you to enter your Azure account credentials.
2. Get the subscription IDs for your available subscriptions.
   
    ```powershell
    Get-AzureRmSubscription
    ```
3. Set the correct subscription using the subscription ID.
   
    ```powershell
    Select-AzureRmSubscription -SubscriptionId "<subscriptionID>"
    ```

## Deallocate the VM 

Create variables and deallocate the VM. This example sets the resource group name to **myResourceGroup** and the VM name to **myVM**.

  
    ```powershell
	$rgName = "myResourceGroup"
	$vmName = "myVM"
    Stop-AzureRmVM -ResourceGroupName $rgName -Name $vmName -Force
    ```
   
    The *Status* for the VM in the Azure portal changes from **Stopped** to **Stopped (deallocated)**.
	
	
## Convert the disks

```powershell
ConvertTo-AzureRmVMManagedDisk -ResourceGroupName $rgName -VMName $vmName
```

## Start the VM 

```powershell
Start-AzureRmVM -ResourceGroupName $rgName -VMName $vmName
```


## Next steps


