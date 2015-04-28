<properties
   pageTitle="Common VM tasks using Resource Manager mode in Azure PowerShell"
   description="Gives you commands for common VM tasks using Resource Manager mode in Azure PowerShell"
   services="virtual-machines"
   documentationCenter="windows"
   authors="KBDAzure"
   manager="timlt"
   editor=""/>

   <tags
   ms.service="virtual-machines"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-windows"
   ms.workload="infrastructure-services"
   ms.date="04/22/2015"
   ms.author="kathydav;singhkay"/>

# Common VM tasks using Azure PowerShell in Resource Manager Mode

 > [AZURE.SELECTOR]
    - [Resource Manager](virtual-machines-manage-powershell-resource-management.md)
    - [Service Management](virtual-machines-manage-powershell-service-management.md)

Many tasks you do each day to manage your VMs can by automated by using Azure PowerShell cmdlets in Azure Resource Manager mode. This article gives you example commands for simpler tasks, and links to articles that show the commands for more complex tasks.

>[AZURE.NOTE] If you haven't installed and configured Azure PowerShell yet, you can get instructions [here](install-configure-powershell.md).

## How to Use the Example Commands
You'll need to replace some of the text in the commands with text that's appropriate for your environment. The < and > symbols indicate text you need to replace. When you replace the text, remove the symbols but leave the quote marks in place. 

## Get a VM
This is a basic task you'll use often. Use it to get information about a VM, perform tasks on a VM, or get output to store in a variable. 

To get info about the VM, run this command, replacing everything in the quotes, including the < and > characters:

     Get-AzureVM -ResourceGroupName "<resource group name>" -Name "<VM name>"

If you run the command with a resource group name of "MyRG" and VM name of "MyVM", you should see something like this:

<!-- need image-->  

To store the output in a $vm variable, run:

    $vm = Get-AzureVM -ResourceGroupName "<resource group name>" -Name "<VM name>"

<!--need this log-on syntax 
## Log on to a Windows-based virtual machine

Run these commands:

>[AZURE.NOTE] You can get the virtual machine and cloud service name from the display of the **Get-AzureVM** command.
>
	$svcName="<cloud service name>"
	$vmName="<virtual machine name>"
	$localPath="<drive and folder location to store the downloaded RDP file, example: c:\temp >"
	$localFile=$localPath + "\" + $vmname + ".rdp"
	Get-AzureRemoteDesktopFile -ServiceName $svcName -Name $vmName -LocalPath $localFile -Launch 
-->

## Start a VM

Run this command:

    Start-AzureVM -ResourceGroupName "<resource group name>" -Name "<virtual machine name>"

## Stop a VM

Run this command:

    Stop-AzureVM -ResourceGroupName "<resource group name>" -Name "<virtual machine name>"

>[AZURE.IMPORTANT] Use the **StayProvisioned** parameter to keep the virtual IP (VIP) of the cloud service in case it's the last VM in that cloud service. If you use this parameter, you'll still be billed for the VM.

## Restart a VM

	Restart-AzureVM -ResourceGroupName "<resource group name>" -Name "<virtual machine name>"

## Attach a Data Disk
This task requires a few steps. First, you use the ****Add-AzureDataDisk**** cmdlet to add the disk to the $vm object, then you use Update-AzureVM cmdlet to update the configuration of the VM.

You'll also need to decide whether to attach a new disk or one that contains data. For a new disk, the command creates the .vhd file and attaches it in the same command.

To attach a new disk, run this command:

    Add-AzureDataDisk -CreateNew -DiskSizeInGB 128 -DiskLabel "<main>" -LUN <0> -VM <$vm> `
              | Update-AzureVM

To attach an existing data disks, run this command:

    Add-AzureDataDisk -Import -DiskName "<MyExistingDisk>" -LUN <0> `
              | Update-AzureVM

To attach data disks from an existing .vhd file in blob storage, run this command:

    Add-AzureDataDisk -ImportFrom -MediaLocation `
              "<https://mystorage.blob.core.windows.net/mycontainer/MyExistingDisk.vhd>" `
              -DiskLabel "<main>" -LUN <0> `
              | Update-AzureVM

## Create a Windows VM

To create a new Windows-based virtual machine in Azure, use the instructions in 
[Use Azure PowerShell to create and preconfigure Windows-based Virtual Machines](virtual-machines-ps-create-preconfigure-windows-vms.md). This topic steps you through the creation of a PowerShell command set that creates a Windows virtual machine that can be pre-configured with:

- Active Directory domain membership
- Additional disks
- As a member of an existing load-balanced set
- A static IP address

