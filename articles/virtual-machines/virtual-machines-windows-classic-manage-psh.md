<properties
   pageTitle="Manage your virtual machines by using Azure PowerShell | Microsoft Azure"
   description="Learn commands that you can use to automate tasks in managing your virtual machines."
   services="virtual-machines-windows"
   documentationCenter="windows"
   authors="singhkay"
   manager="timlt"
   editor=""
   tags="azure-service-management"/>

   <tags
   ms.service="virtual-machines-windows"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-windows"
   ms.workload="infrastructure-services"
   ms.date="07/01/2016"
   ms.author="kasing"/>

# Manage your virtual machines by using Azure PowerShell

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)]


Many tasks you do each day to manage your VMs can be automated by using Azure PowerShell cmdlets. This article gives you example commands for simpler tasks, and links to articles that show the commands for more complex tasks.

>[AZURE.NOTE] If you haven't installed and configured Azure PowerShell yet, you can get instructions in the article [How to install and configure Azure PowerShell](../powershell-install-configure.md).

## How to use the example commands
You'll need to replace some of the text in the commands with text that's appropriate for your environment. The < and > symbols indicate text you need to replace. When you replace the text, remove the symbols but leave the quote marks in place.

## Get a VM
This is a basic task you'll use often. Use it to get information about a VM, perform tasks on a VM, or get output to store in a variable.

To get information about the VM, run this command, replacing everything in the quotes, including the < and > characters:

     Get-AzureVM -ServiceName "<cloud service name>" -Name "<virtual machine name>"

To store the output in a $vm variable, run:

    $vm = Get-AzureVM -ServiceName "<cloud service name>" -Name "<virtual machine name>"

## Log on to a Windows-based VM

Run these commands:

>[AZURE.NOTE] You can get the virtual machine and cloud service name from the display of the **Get-AzureVM** command.
>
	$svcName = "<cloud service name>"
	$vmName = "<virtual machine name>"
	$localPath = "<drive and folder location to store the downloaded RDP file, example: c:\temp >"
	$localFile = $localPath + "\" + $vmname + ".rdp"
	Get-AzureRemoteDesktopFile -ServiceName $svcName -Name $vmName -LocalPath $localFile -Launch

## Stop a VM

Run this command:

    Stop-AzureVM -ServiceName "<cloud service name>" -Name "<virtual machine name>"

>[AZURE.IMPORTANT] Use this parameter to keep the virtual IP (VIP) of the cloud service in case it's the last VM in that cloud service. <br><br> If you use the StayProvisioned parameter, you'll still be billed for the VM.

## Start a VM

Run this command:

    Start-AzureVM -ServiceName "<cloud service name>" -Name "<virtual machine name>"

## Attach a data disk
This task requires a few steps. First, you use the ****Add-AzureDataDisk**** cmdlet to add the disk to the $vm object. Then, you use **Update-AzureVM** cmdlet to update the configuration of the VM.

You'll also need to decide whether to attach a new disk or one that contains data. For a new disk, the command creates the .vhd file and attaches it.

To attach a new disk, run this command:

    Add-AzureDataDisk -CreateNew -DiskSizeInGB 128 -DiskLabel "<main>" -LUN <0> -VM $vm | Update-AzureVM

To attach an existing data disk, run this command:

    Add-AzureDataDisk -Import -DiskName "<MyExistingDisk>" -LUN <0> | Update-AzureVM

To attach data disks from an existing .vhd file in blob storage, run this command:

    Add-AzureDataDisk -ImportFrom -MediaLocation `
              "<https://mystorage.blob.core.windows.net/mycontainer/MyExistingDisk.vhd>" `
              -DiskLabel "<main>" -LUN <0> |
              Update-AzureVM

## Create a Windows-based VM

To create a new Windows-based virtual machine in Azure, use the instructions in
[Use Azure PowerShell to create and preconfigure Windows-based virtual machines](virtual-machines-windows-classic-create-powershell.md). This topic steps you through the creation of an Azure PowerShell command set that creates a Windows-based VM that can be preconfigured:

- With Active Directory domain membership.
- With additional disks.
- As a member of an existing load-balanced set.
- With a static IP address.
