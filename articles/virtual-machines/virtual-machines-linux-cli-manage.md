<properties 
   pageTitle="Basic Azure CLI Commands in Azure Resource Manager mode | Microsoft Azure"
   services="virtual-machines" 
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
   ms.date="03/29/2016"
   ms.author="rclaus" />

## Using Azure CLI with Azure Resource Manager

Before you can use the Azure CLI with Resource Manager commands and templates to deploy Azure resources and workloads using resource groups, you will need an account with Azure. If you do not have an account, you can get a [free Azure trial here](https://azure.microsoft.com/pricing/free-trial/).

### Step 1: Install the Azure CLI

  - The Azure CLI. 
    - [Mac OSX installer](http://go.microsoft.com/fwlink/?linkid=252249&clcid=0x409), [Linux installer](http://go.microsoft.com/fwlink/?linkid=253472&clcid=0x409), [Windows installer](http://go.microsoft.com/?linkid=9828653&clcid=0x409)
    
You can also install the Azure CLI using popular package managers and as a Linux container:

    - Mac via **Homebrew** `brew install azure-cli`
    - Mac & Linux via **npm** `npm install -g azure-cli`
    - Mac & Linux via **Docker** `docker run -it microsoft/azure-cli`

### Step 2: Verify the Azure CLI version

To use Azure CLI for imperative commands and Azure Resource Manager templates, you need to have at least version 0.9.16. To verify your version, type `azure --version`. You should see something like:

    $ azure --version
    0.9.16 (node: 5.2.0)

If you need to update your version of Azure CLI, see [Azure CLI](https://github.com/Azure/azure-xplat-cli) or run an update from the package manager you used to install Azure CLI.

### Step 2: Authenticate to your Azure Account

We've simplified logging into your Azure Account from your device by having an interactive login via the `azure login` experience. You should see something like the following:
    $ azure login
    info:    Executing command login
    \info:    To sign in, use a web browser to open the page https://aka.ms/devicelogin. Enter the code BNTXXXXXX to authenticate.

You will need to open a browser to https://aka.ms/devicelogin and enter the unique session code that was displayed in your terminal window.  Once the code has been entered, you will be able to interact with your account and subscriptions from Azure CLI.

### Step 3: Choose your Azure subscription

If you have only one subscription in your Azure account, Azure CLI associates itself with that subscription by default. If you have more than one subscription, you need to select the subscription you want to use by typing `azure account set <subscription id or name> true` where _subscription id or name_ is either the subscription id or the subscription name that you would like to work with in the current session.

You should see something like the following:

    $ azure account set "Azure Free Trial" true
    info:    Executing command account set
    info:    Setting subscription to "Azure Free Trial" with id "2lskd82-434-XXXX-XXXX-akd83lsk92sa".
    info:    Changes saved
    info:    account set command OK

### Step 4: Start to use Azure CLI to interact with your Subscription

The rest of this article will assume you are working in the Azure Resource Management mode. If for some reason you are in Service Manager mode, type 'azure config mode arm' to switch back to Azure Resource Manager mode.  This is the recommended mode of working with Azure going forward.  Should you need to work with previously created Azure Service Manager resources, you can change your mode to the legacy Azure Service Manager mode by typing `azure config mode asm`. 

### Basic Azure Resource Manager commands in Azure CLI

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
