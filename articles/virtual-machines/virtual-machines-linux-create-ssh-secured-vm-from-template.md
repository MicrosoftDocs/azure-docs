<properties
	pageTitle="Create a Secure Linux VM using a Azure template | Microsoft Azure"
	description="Create a Secure Linux VM on Azure using an Azure Resource Manager template."
	services="virtual-machines-linux"
	documentationCenter=""
	authors="vlivech"
	manager="timlt"
	editor=""
	tags="azure-service-management,azure-resource-manager" />

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="hero-article"
	ms.date="03/08/2016"
	ms.author="vlivech"/>

# Create a secured Linux VM using an Azure template

Templates allow you to create VMs on Azure with settings that you want to customize during the launch, things like usernames and hostnames. For this article we will focus on launching an Ubuntu VM using an Azure template that creates a network security group (NSG) with only one port open (22 for SSH) and which requires SSH keys for login.

Azure Resource Manager templates are JSON files that can be used for simple one-off tasks -- like launching an Ubuntu VM as done in this article -- or to construct complex Azure configurations of entire environments like a testing, dev or production deployment from the networking to the OS to application stack deployment.

## Goal

- Create an SSH-secured Linux VM in Azure using an Azure template

## Prerequisites

- An Azure account ([get a free trial!](https://azure.microsoft.com/pricing/free-trial/)), an [SSH public key file](virtual-machines-linux-mac-create-ssh-keys.md), the [Azure CLI](../xplat-cli-install.md), and then put the CLI in resource mode by typing `azure config mode arm`. Then log in to Azure with the CLI by typing `azure login`.

## Quick Command Summary

This deployment requires only one command, along with the selection of an option indicating where the Azure Resource Manager template resides. This topic uses a template directly from the Azure quickstart template Github repo as an example. Below, the various options merely indicate where the template -- and any parameters files -- are located.

1. `azure group create -n <exampleRGname> -l <exampleAzureRegion> [--template-uri <URL> | --template-file <path> | <template-file> -e <parameters.json file>]`

## Create the Linux VM

The following code example shows how to call `azure group create` to create a resource group and deploy an SSH-secured Linux VM at the same time using [this Azure Resource Manager template](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-vm-sshkey/azuredeploy.json). Remember that in your example you need to use names that are unique to your environment. This example uses `quicksecuretemplate` as the resource group name, `securelinux` as the VM name, and `quicksecurelinux` as a subdomain name.

```bash
azure group create -n quicksecuretemplate -l eastus --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-vm-sshkey/azuredeploy.json
info:    Executing command group create
+ Getting resource group quicksecuretemplate
+ Creating resource group quicksecuretemplate
info:    Created resource group quicksecuretemplate
info:    Supply values for the following parameters
adminUserName: ops
sshKeyData: ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDDRZ/XB8p8uXMqgI8EoN3dWQw... user@contoso.com
dnsLabelPrefix: quicksecurelinux
vmName: securelinux
+ Initializing template configurations and parameters
+ Creating a deployment
info:    Created template deployment "azuredeploy"
data:    Id:                  /subscriptions/<guid>/resourceGroups/quicksecuretemplate
data:    Name:                quicksecuretemplate
data:    Location:            eastus
data:    Provisioning State:  Succeeded
data:    Tags: null
data:
info:    group create command OK
```

## Detailed Walk Through

You can create a new resource group and deploy a VM using the `--template-uri` parameter, or you can download or create a template locally and pass the template using the `--template-file` parameter with a path to the template file as an argument. The Azure CLI prompts you for the parameters required by the template.

## Next steps

Once you create Linux VMs with templates, you'll want to see what other app frameworks are available to use with templates. Search the [templates gallery](https://azure.microsoft.com/documentation/templates/) to discover what app frameworks to deploy next.