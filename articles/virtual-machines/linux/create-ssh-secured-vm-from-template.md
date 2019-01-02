---
title: Create a Linux VM in Azure from a template | Microsoft Docs
description: How to use the Azure CLI to create a Linux VM from a Resource Manager template
services: virtual-machines-linux
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 721b8378-9e47-411e-842c-ec3276d3256a
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: azurecli
ms.topic: article
ms.date: 05/30/2018
ms.author: cynthn
ms.custom: H1Hack27Feb2017

---
# How to create a Linux virtual machine with Azure Resource Manager templates

This article shows you how to quickly deploy a Linux virtual machine (VM) with Azure Resource Manager templates and the Azure CLI. You can also perform these steps with the [Azure classic CLI](create-ssh-secured-vm-from-template-nodejs.md).


This article shows you how to quickly deploy a Linux virtual machine (VM) with Azure Resource Manager templates and the Azure CLI. 

## Templates overview
Azure Resource Manager templates are JSON files that define the infrastructure and configuration of your Azure solution. By using a template, you can repeatedly deploy your solution throughout its lifecycle and have confidence your resources are deployed in a consistent state. To learn more about the format of the template and how you construct it, see [Create your first Azure Resource Manager template](../../azure-resource-manager/resource-manager-create-first-template.md). To view the JSON syntax for resources types, see [Define resources in Azure Resource Manager templates](/azure/templates/).


## Create a resource group
An Azure resource group is a logical container into which Azure resources are deployed and managed. A resource group must be created before a virtual machine. The following example creates a resource group named *myResourceGroupVM* in the *eastus* region:

```azurecli
az group create --name myResourceGroup --location eastus
```

## Create a virtual machine
The following example creates a VM from [this Azure Resource Manager template](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-vm-sshkey/azuredeploy.json) with [az group deployment create](/cli/azure/group/deployment#az_group_deployment_create). Only SSH authentication is allowed. When prompted, provide the value of your own SSH public key, such as the contents of *~/.ssh/id_rsa.pub*. If you need to create an SSH key pair, see [How to create and use an SSH key pair for Linux VMs in Azure](mac-create-ssh-keys.md).

```azurecli
az group deployment create \
    --resource-group myResourceGroup \
    --template-uri https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-vm-sshkey/azuredeploy.json
```

In the previous example, you specified a template stored in GitHub. You can also download or create a template and specify the local path with the `--template-file` parameter.


## Connect to virtual machine
To SSH to your VM, obtain the public IP address with [az vm show](/cli/azure/vm#az-vm-show):

```azurecli
az vm show \
    --resource-group myResourceGroup \
    --name sshvm \
    --show-details \
    --query publicIps \
    --output tsv
```

You can then SSH to your VM as normal. Provide you own public IP address from the preceding command:

```bash
ssh azureuser@<ipAddress>
```

## Next steps
In this example, you created a basic Linux VM. For more Resource Manager templates that include application frameworks or create more complex environments, browse the [Azure quickstart templates gallery](https://azure.microsoft.com/documentation/templates/).
