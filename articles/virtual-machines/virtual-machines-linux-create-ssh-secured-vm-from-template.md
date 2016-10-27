<properties
	pageTitle="Create a Linux VM using an Azure template | Microsoft Azure"
	description="Create a Linux VM on Azure using an Azure Resource Manager template."
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
	ms.date="10/24/2016"
	ms.author="v-livech"/>

# Create a Linux VM using an Azure template

This article shows you how to quickly deploy a Linux Virtual Machine on Azure using an Azure Template.  The article requires:

- an Azure account ([get a free trial](https://azure.microsoft.com/pricing/free-trial/)).

- the [Azure CLI](../xplat-cli-install.md) logged in with `azure login`.

- the Azure CLI _must be in_ Azure Resource Manager mode `azure config mode arm`.

You can also quickly deploy a Linux VM template by using the [Azure portal](virtual-machines-linux-quick-create-portal.md).

## Quick Command Summary

```bash
azure group create \
-n myResourceGroup \
-l westus \
--template-uri https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-vm-sshkey/azuredeploy.json
```

## Detailed Walkthrough

Templates allow you to create VMs on Azure with settings that you want to customize during the launch, settings like usernames and hostnames. For this article, we are launching an Azure template utilizing an Ubuntu VM along with a network security group (NSG) with port 22 open for SSH.

Azure Resource Manager templates are JSON files that can be used for simple one-off tasks like launching an Ubuntu VM as done in this article.  Azure Templates can also be used to construct complex Azure configurations of entire environments like a testing, dev, or production deployment stack.

## Create the Linux VM

The following code example shows how to call `azure group create` to create a resource group and deploy an SSH-secured Linux VM at the same time using [this Azure Resource Manager template](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-vm-sshkey/azuredeploy.json). Remember that in your example you need to use names that are unique to your environment. This example uses `myResourceGroup` as the resource group name, and `myVM` as the VM name.

```bash
azure group create \
--name myResourceGroup \
--location westus \
--template-uri https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-vm-sshkey/azuredeploy.json
```

The output should look like the following output block:

```bash
info:    Executing command group create
+ Getting resource group myResourceGroup
+ Creating resource group myResourceGroup
info:    Created resource group myResourceGroup
info:    Supply values for the following parameters
sshKeyData: ssh-rsa AAAAB3Nza<..ssh public key text..>VQgwjNjQ== myAdminUser@myVM
+ Initializing template configurations and parameters
+ Creating a deployment
info:    Created template deployment "azuredeploy"
data:    Id:                  /subscriptions/<..subid text..>/resourceGroups/myResourceGroup
data:    Name:                myResourceGroup
data:    Location:            westus
data:    Provisioning State:  Succeeded
data:    Tags: null
data:
info:    group create command OK
```

That example deployed a VM using the `--template-uri` parameter.  You can also download or create a template locally and pass the template using the `--template-file` parameter with a path to the template file as an argument. The Azure CLI prompts you for the parameters required by the template.

## Next steps

Search the [templates gallery](https://azure.microsoft.com/documentation/templates/) to discover what app frameworks to deploy next.
