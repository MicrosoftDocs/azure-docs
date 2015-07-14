<properties
   pageTitle="Manage your Azure VMs using the Azure CLI for Mac, Linux, and Windows | Microsoft Azure"
   description="Describes how to create, manage, and delete your Azure VMs using the Azure CLI for Mac, Linux, and Windows."
   services="virtual-machines"
   documentationCenter="virtual-machines"
   authors="dlepow"
   manager="timlt"
   editor=""/>

   <tags
   ms.service="virtual-machines"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="infrastructure-services"
   ms.date="06/09/2015"
   ms.author="danlep"/>

# Manage your Virtual Machines using the Azure CLI for Mac, Linux, and Windows

Many tasks you do each day to manage your VMs can by automated by using the Azure CLI. This article gives you example commands for simpler tasks, and links to articles that show the commands for more complex tasks.

>[AZURE.NOTE] If you haven't installed and configured the Azure CLI yet, you can get instructions [here](../xplat-cli-install.md). If you want a quickstart for the same tasks in PowerShell, see [Manage your VMs using Azure PowerShell](virtual-machines-manage-vms-powershell.md).

## How to Use the Example Commands
You'll need to replace some of the text in the commands with text that's appropriate for your environment. The < and > symbols indicate text you need to replace. When you replace the text, remove the symbols but leave the quote marks in place.

> [AZURE.NOTE] If you want to programmatically store and manipulate the output of your console commands, you may want to use a JSON parsing tool such as **[jq](https://github.com/stedolan/jq)**, **[jsawk](https://github.com/micha/jsawk)**, or language libraries good for the task.

## Show information about a VM

This is a basic task you'll use often. Use it to get information about a VM, perform tasks on a VM, or get output to store in a variable.

To get info about the VM, run this command, replacing everything in the quotes, including the < and > characters:

     azure vm show -g <group name> -n <virtual machine name>

To store the output in a $vm variable as a JSON document, run:

    vmInfo=$(azure vm show -g <group name> -n <virtual machine name> --json)

or you can pipe the stdout to a file.

## Log on to a Linux-based virtual machine

Typically Linux machines are connected to through SSH. For more information, see [How to Use SSH with Linux on Azure](virtual-machines-linux-use-ssh-key.md).
Azure Resource Manager Overview
## Stop a VM

Run this command:

    azure vm stop <group name> <virtual machine name>

>[AZURE.IMPORTANT] Use this parameter to keep the virtual IP (VIP) of the cloud service in case it's the last VM in that cloud service. <br><br> If you use the StayProvisioned parameter, you'll still be billed for the VM.

## Start a VM

Run this command:
Azure Resource Manager Overview
    azure vm start <group name> <virtual machine name>

## Attach a Data Disk

You'll also need to decide whether to attach a new disk or one that contains data. For a new disk, the command creates the .vhd file and attaches it in the same command.

To attach a new disk, run this command:

     azure vm disk attach-new <resource-group> <vm-name> <size-in-gb>

To attach an existing data disk, run this command:

    azure vm disk attach <resource-group> <vm-name> [vhd-url]

## Create a Linux VM

To create a new Linux-based VM, you're going to need to have several values on hand, including a resource group name, a location, an image name, a vm name, and a storage account to store the backing .vhd image. Once you have the information you want to use, the Azure CLI can create an interactive session to prompt you for those values by typing:

    azure vm create

Of course, if you already have those values you can find the proper switches to pass them directly by typing `azure help vm create`.

## Next steps

For far more examples of Azure CLI usage with the **arm** mode, see [Using the Microsoft Azure CLI for Mac, Linux, and Windows with Azure Resource Management](../xplat-cli-resource-manager.md). To learn more about Azure resources and their concepts, see [Azure Resource Manager Overview](../resource-group-overview.md).
 