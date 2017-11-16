---
title: Create a Virtual Machine Scale Set with the Azure CLI 2.0 | Microsoft Docs
description: Learn how to quickly create a virtual machine scale with Azure PowerShell
services: virtual-machine-scale-sets
documentationcenter: ''
author: iainfoulds
manager: jeconnoc
editor: ''
tags: ''

ms.assetid: ''
ms.service: virtual-machine-scale-sets
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: azurecli
ms.topic: article
ms.date: 11/14/2017
ms.author: iainfou
---

# Create a Virtual Machine Scale Set with the Azure CLI 2.0
A virtual machine scale set allows you to deploy and manage a set of identical, auto-scaling virtual machines. You can scale the number of VMs in the scale set manually, or define rules to autoscale based on resource usage such as CPU, memory demand, or network traffic. In this getting started article, you create a virtual machine scale set with the Azure CLI 2.0. You can also create a scale set with [Azure PowerShell](virtual-machine-scale-sets-create-powershell.md) or the [Azure portal](virtual-machine-scale-sets-portal-create.md).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.20 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 


## Create a scale set
Before you can create a scale set, create a resource group with [az group create](/cli/azure/group#create). The following example creates a resource group named *myResourceGroup* in the *eastus* location:

```azurecli-interactive 
az group create --name myResourceGroup --location eastus
```

Now create a virtual machine scale set with [az vmss create](/cli/azure/vmss#create). The following example creates a scale set named *myScaleSet*, and generates SSH keys if they do not exist:

```azurecli-interactive 
az vmss create \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --image UbuntuLTS \
  --upgrade-policy-mode automatic \
  --admin-username azureuser \
  --generate-ssh-keys
```

It takes a few minutes to create and configure all the scale set resources and VMs.


## Install NGINX webserver
To test your scale set, use the Custom Script Extension to download and run a script that installs NGINX on the VM instances. This extension is useful for post deployment configuration, software installation, or any other configuration / management task. For more information, see the [Custom Script Extension overview](../virtual-machines/windows/extensions-customscript.md).

Apply the Custom Script Extension that installs NGINX as follows:

```azurecli-interactive
az vmss extension set \
  --publisher Microsoft.Azure.Extensions \
  --version 2.0 \
  --name CustomScript \
  --resource-group myResourceGroup \
  --vmss-name myScaleSet \
  --settings '{"fileUris":["https://raw.githubusercontent.com/iainfoulds/azure-samples/master/automate_nginx.sh"],"commandToExecute":"./automate_nginx.sh"}'
```


## Allow web traffic
To allow traffic to reach the web server, create a load balancer rule with [az network lb rule create](/cli/azure/network/lb/rule#create). The following example creates a rule named *myLoadBalancerRuleWeb*:

```azurecli-interactive 
az network lb rule create \
  --resource-group myResourceGroup \
  --name myLoadBalancerRuleWeb \
  --lb-name myScaleSetLB \
  --backend-pool-name myScaleSetLBBEPool \
  --backend-port 80 \
  --frontend-ip-name loadBalancerFrontEnd \
  --frontend-port 80 \
  --protocol tcp
```


## Test your web server
To see your web server in action, obtain the public IP address of your load balancer with [az network public-ip show](/cli/azure/network/public-ip#show). The following example obtains the IP address for *myScaleSetLBPublicIP* created as part of the scale set:

```azurecli-interactive 
az network public-ip show \
  --resource-group myResourceGroup \
  --name myScaleSetLBPublicIP \
  --query [ipAddress] \
  --output tsv
```

Enter the public IP address of the load balancer in to a web browser. The load balancer distributes traffic to one of your VM instances, as shown in the following example:

![Default web page in NGINX](media/virtual-machine-scale-sets-create-cli/running-nginx-site.png)


## Clean up resources
When no longer needed, you can use [az group delete](/cli/azure/group#delete) to remove the resource group, scale set, and all related resources as follows:

```azurecli-interactive 
az group delete --name myResourceGroup
```


## Next steps
In this getting started article, you created a basic scale set and manually installed a web server on one of the VM instances. For greater scalability and automation, expand your scale set with the following how-to articles:

- [Deploy your application on virtual machine scale sets](virtual-machine-scale-sets-deploy-app.md)
- Automatically scale with the [Azure CLI](virtual-machine-scale-sets-autoscale-cli.md), [Azure PowerShell](virtual-machine-scale-sets-autoscale-powershell.md), or the [Azure portal](virtual-machine-scale-sets-autoscale-portal.md)
- [Use automatic OS upgrades for your scale set VM instances](virtual-machine-scale-sets-automatic-upgrade.md)