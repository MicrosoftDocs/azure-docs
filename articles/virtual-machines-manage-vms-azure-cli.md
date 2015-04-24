<properties
   pageTitle="Manage your Azure VMs using the Azure CLI for Mac, Linux, and Windows"
   description="Describes how to create, manage, and delete your Azure VMs using the Azure CLI for Mac, Linux, and Windows."
   services="virtual-machines"
   documentationCenter="virtual-machines"
   authors="squillace"
   manager="timlt"
   editor=""/>

   <tags
   ms.service="virtual-machines"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="infrastructure-services"
   ms.date="04/23/2015"
   ms.author="rasquill"/>

# Manage your Virtual Machines using the Azure CLI for Mac, Linux, and Windows

Many tasks you do each day to manage your VMs can by automated by using the Azure CLI. This article gives you example commands for simpler tasks, and links to articles that show the commands for more complex tasks.

>[AZURE.NOTE] If you haven't installed and configured the Azure CLI yet, you can get instructions [here](xplat-cli-install.md).

## How to Use the Example Commands
You'll need to replace some of the text in the commands with text that's appropriate for your environment. The < and > symbols indicate text you need to replace. When you replace the text, remove the symbols but leave the quote marks in place. 

> [AZURE.NOTE] If you want to programmatically store and manipulate the output of your console commands, you may want to use a JSON parsing tool such as **[jq](https://github.com/stedolan/jq)**, **[jsawk](https://github.com/micha/jsawk)**, or language libraries good for the task. This topic contains small scripts using **jq**, which you can use on all platforms.

## Show information about a VM

This is a basic task you'll use often. Use it to get information about a VM, perform tasks on a VM, or get output to store in a variable. 

To get info about the VM, run this command, replacing everything in the quotes, including the < and > characters:

     azure vm show -g <group name> -n <virtual machine name>

To store the output in a $vm variable as a JSON document, run:

    vmInfo=$(azure vm show -g <group name> -n <virtual machine name> --json)
    
or you can pipe the stdout to a file.

## Log on to a Linux-based virtual machine

Typically Linux machines are connected to through SSH. For more information, see [How to Use SSH with Linux on Azure](virtual-machines-linux-use-ssh-key.md).

## Stop a VM

Run this command:

    azure vm stop <group name> <virtual machine name>

>[AZURE.IMPORTANT] Use this parameter to keep the virtual IP (VIP) of the cloud service in case it's the last VM in that cloud service. <br><br> If you use the StayProvisioned parameter, you'll still be billed for the VM.

## Start a VM

Run this command:

    azure vm start <group name> <virtual machine name>

## Attach a Data Disk

This task requires a few steps. First, you use the ****Add-AzureDataDisk**** cmdlet to add the disk to the $vm object, then you use Update-AzureVM cmdlet to update the configuration of the VM.

You'll also need to decide whether to attach a new disk or one that contains data. For a new disk, the command creates the .vhd file and attaches it in the same command.

To attach a new disk, run this command:

     azure vm disk attach-new <resource-group> <vm-name> <size-in-gb> 

To attach an existing data disk, run this command:

    azure vm disk attach <resource-group> <vm-name> [vhd-url]

## Create a Linux VM

To create a new Linux-based virtual machine in Azure, use the instructions in 
[Use Azure PowerShell to create and preconfigure Windows-based Virtual Machines](virtual-machines-ps-create-preconfigure-windows-vms.md). This topic steps you through the creation of a PowerShell command set that creates a Windows virtual machine that can be pre-configured with:

- Active Directory domain membership
- Additional disks
- As a member of an existing load-balanced set
- A static IP address

