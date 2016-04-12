<properties 
   pageTitle="Basic Azure CLI Commands in Azure Resource Manager mode | Microsoft Azure"
   description="Basic Azure CLI commands to get you started managing your VMs in Azure Resource Manager mode"
   keywords="linux virtual machines, Azure Resource Manager, Azure CLI"
   services="virtual-machines-linux"
   documentationCenter=""
   authors="RicksterCDN" 
   manager="timlt" 
   editor="tysonn" 
   tags="azure-resource-manager"/>
   
<tags
   ms.service="virtual-machines-linux"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="infrastructure-services"
   ms.date="04/11/2016"
   ms.author="rclaus" />

# Using Azure CLI with Azure Resource Manager

Before you can use the Azure CLI with Resource Manager commands and templates to deploy Azure resources and workloads using resource groups, you will need an account with Azure. If you do not have an account, you can get a [free Azure trial here](https://azure.microsoft.com/pricing/free-trial/).

If you haven't already installed the Azure CLI and connected to your subscription, see [Install the Azure CLI and Connect to an Azure subscription from the Azure CLI](../xplat-cli-install.md). When you want to use the Resource Manager mode commands, be sure to connect with the `azure login` command.

The rest of this article will assume you are working in the Azure Resource Management mode. If for some reason you are in Service Management mode, type `azure config mode arm` to switch back to Azure Resource Manager mode.  This is the recommended mode of working with Azure going forward.  Should you need to work with previously created Azure Service Management resources, you can change your mode to the legacy Azure Service Manager mode by typing `azure config mode asm`. 

## Basic Azure Resource Manager commands in Azure CLI

This article covers basic commands you will want to use with Azure CLI to manage and interact with your ARM resources (primarily VMs) in your Azure subscription.  For more detailed help with specific command line switches and options, you can use the online command help and options by typing `azure <command> <subcommand> --help` or `azure help <command> <subcommand>`.

> [AZURE.NOTE] These examples don't include template-based operations which are generally recommended for VM deployments in Resource Manager. For information, see [Use the Azure CLI with Azure Resource Manager](../xplat-cli-azure-resource-manager.md) and [Deploy and manage virtual machines by using Azure Resource Manager templates and the Azure CLI](virtual-machines-linux-cli-deploy-templates.md).

Task | Resource Manager
-------------- | ----------- | -------------------------
Create the most basic VM | `azure vm quick-create [options] <resource-group> <name> <location> <os-type> <image-urn> <admin-username> <admin-password>`<br/><br/>(Obtain the `image-urn` from the `azure vm image list` command. See [this article](virtual-machines-linux-cli-ps-findimage.md) for examples.)
Create a Linux VM | `azure  vm create [options] <resource-group> <name> <location> -y "Linux"`
Create a Windows VM | `azure  vm create [options] <resource-group> <name> <location> -y "Windows"`
List VMs | `azure  vm list [options]`
Get information about a VM | `azure  vm show [options] <resource_group> <name>`
Start a VM | `azure vm start [options] <resource_group> <name>`
Stop a VM | `azure vm stop [options] <resource_group> <name>`
Deallocate a VM | `azure vm deallocate [options] <resource-group> <name>`
Restart a VM | `azure vm restart [options] <resource_group> <name>`
Delete a VM | `azure vm delete [options] <resource_group> <name>`
Capture a VM | `azure vm capture [options] <resource_group> <name>`
Create a VM from a user image | `azure  vm create [options] –q <image-name> <resource-group> <name> <location> <os-type>`
Create a VM from a specialized disk | `azue  vm create [options] –d <os-disk-vhd> <resource-group> <name> <location> <os-type>`
Add a data disk to a VM | `azure  vm disk attach-new [options] <resource-group> <vm-name> <size-in-gb> [vhd-name]`
Remove a data disk from a VM | `azure  vm disk detach [options] <resource-group> <vm-name> <lun>`
Add a generic extension to a VM |`azure  vm extension set [options] <resource-group> <vm-name> <name> <publisher-name> <version>`
Add VM Access extension to a VM | `azure vm reset-access [options] <resource-group> <name>`
Add Docker extension to a VM | `azure  vm docker create [options] <resource-group> <name> <location> <os-type>`
Remove a VM extension | `azure  vm extension set [options] –u <resource-group> <vm-name> <name> <publisher-name> <version>`
Get usage of VM resources | `azure vm list-usage [options] <location>`
Get all available VM sizes | `azure vm sizes [options]`


## Next steps

* For additional examples of the CLI commands going beyond basic VM management, see [Using the Azure CLI with Azure Resource Manager](azure-cli-arm-commands.md).
