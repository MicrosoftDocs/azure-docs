<properties
   pageTitle="manage-vms-azure-powershell"
   description="Manage your VMs using Azure PowerShell"
   services="virtual-machines"
   documentationCenter="windows"
   authors="singhkay"
   manager="timlt"
   editor=""/>

   <tags
   ms.service="virtual-machines"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-windows"
   ms.workload="infrastructure-services"
   ms.date="03/09/2015"
   ms.author="kasing"/>

# Manage your Virtual Machines using Azure PowerShell

Before getting started here are some starter articles that will help you get a VM setup

* [How to install and configure Azure PowerShell](install-configure-powershell.md)
* [Use Azure PowerShell to create and preconfigure Windows-based Virtual Machines](virtual-machines-ps-create-preconfigure-windows-vms.md)
* [Use Azure PowerShell to create and preconfigure Linux-based Virtual Machines](virtual-machines-ps-create-preconfigure-linux-vms.md)

## Stop a VM
You can stop a VM using the Stop-AzureVM cmdlet

    Stop-AzureVM -ServiceName "mytestserv" -Name "testvm"

>[AZURE.NOTE] **StayProvisioned** - Use this parameter to make sure you don't loose the VIP of the cloud service in case it is the last VM in that cloud service. <br><br>

> [AZURE.WARNING] If you use the **StayProvisioned** parameter, you'll still be billed for the VM.

## Start a VM
This can be done using the Start-AzureVM cmdlet

    Start-AzureVM -ServiceName "mytestserv" -Name "testvm"

## Get a VM
Now that you have created a VM on Azure, you'll definitely want to see how it's doing. You can do this using the **Get-AzureVM** cmdlet as shown below

        Get-AzureVM -ServiceName "mytestserv" -Name "testvm"

## Attach a Data Disk
Now that you have gotten a VM, store it in a local $vm variable. Here's how to do that

    $vm = Get-AzureVM -ServiceName "mytestserv" -Name "testvm"

For attaching a data disk to the VM, you'll need to use the Add-AzureDataDisk cmdlet to add your data disk to this local $vm object, then make the call to Azure with the Update-AzureVM cmdlet to update the state of the VM

    Add-AzureDataDisk -CreateNew -DiskSizeInGB 128 -DiskLabel "main" -LUN 0 -VM $vm `
              | Update-AzureVM

Add-AzureDataDisk cmdlet can also be used to attach existing data disks

    Add-AzureDataDisk -Import -DiskName "MyExistingDisk" -LUN 0 `
              | Update-AzureVM

Or create data disks from existing blobs

    Add-AzureDataDisk -ImportFrom -MediaLocation `
              "https://mystorage.blob.core.windows.net/mycontainer/MyExistingDisk.vhd" `
              -DiskLabel "main" -LUN 0 `
              | Update-AzureVM

## Next Steps
[Connect to an Azure virtual machine with RDP or SSH](https://msdn.microsoft.com/library/azure/dn535788.aspx)<br>
[Azure Virtual Machines FAQ](https://msdn.microsoft.com/library/azure/dn683781.aspx)
