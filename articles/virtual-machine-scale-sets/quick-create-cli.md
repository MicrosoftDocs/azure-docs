---
title: Quickstart - Create a Virtual Machine Scale Set with Azure CLI
description: Get started with your deployments by learning how to quickly create a Virtual Machine Scale Set with Azure CLI.
author: ju-shim
ms.author: jushiman
ms.topic: quickstart
ms.service: virtual-machine-scale-sets
ms.date: 11/22/2022
ms.reviewer: mimckitt
ms.custom: mimckitt, devx-track-azurecli, mode-api, devx-track-linux
---

# Quickstart: Create a Virtual Machine Scale Set with the Azure CLI

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Uniform scale sets

> [!NOTE]
> The following article is for Uniform Virtual Machine Scale Sets. We recommend using Flexible Virtual Machine Scale Sets for new workloads. Learn more about this new orchestration mode in our [Flexible Virtual Machine Scale Sets overview](flexible-virtual-machine-scale-sets.md).

A Virtual Machine Scale Set allows you to deploy and manage a set of auto-scaling virtual machines. You can scale the number of VMs in the scale set manually, or define rules to autoscale based on resource usage like CPU, memory demand, or network traffic. An Azure load balancer then distributes traffic to the VM instances in the scale set. In this quickstart, you create a Virtual Machine Scale Set and deploy a sample application with the Azure CLI.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0.29 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed. 


## Create a scale set

> [!IMPORTANT]
>Starting November 2023, VM scale sets created using PowerShell and Azure CLI will default to Flexible Orchestration Mode if no orchestration mode is specified. For more information about this change and what actions you should take, go to [Breaking Change for VMSS PowerShell/CLI Customers - Microsoft Community Hub](
https://techcommunity.microsoft.com/t5/azure-compute-blog/breaking-change-for-vmss-powershell-cli-customers/ba-p/3818295)

Before you can create a scale set, create a resource group with [az group create](/cli/azure/group). The following example creates a resource group named *myResourceGroup* in the *eastus* location:

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

Now create a Virtual Machine Scale Set with [az vmss create](/cli/azure/vmss). The following example creates a scale set named *myScaleSet* that is set to automatically update as changes are applied, and generates SSH keys if they do not exist in *~/.ssh/id_rsa*. These SSH keys are used if you need to log in to the VM instances. To use an existing set of SSH keys, instead use the `--ssh-key-value` parameter and specify the location of your keys.

```azurecli-interactive
az vmss create \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --image <SKU image> \
  --upgrade-policy-mode automatic \
  --admin-username azureuser \
  --generate-ssh-keys
```

It takes a few minutes to create and configure all the scale set resources and VMs.


## Deploy sample application
To test your scale set, install a basic web application. The Azure Custom Script Extension is used to download and run a script that installs an application on the VM instances. This extension is useful for post deployment configuration, software installation, or any other configuration / management task. For more information, see the [Custom Script Extension overview](../virtual-machines/extensions/custom-script-linux.md).

Use the Custom Script Extension to install a basic NGINX web server. Apply the Custom Script Extension that installs NGINX with [az vmss extension set](/cli/azure/vmss/extension) as follows:

```azurecli-interactive
az vmss extension set \
  --publisher Microsoft.Azure.Extensions \
  --version 2.0 \
  --name CustomScript \
  --resource-group myResourceGroup \
  --vmss-name myScaleSet \
  --settings '{"fileUris":["https://raw.githubusercontent.com/Azure-Samples/compute-automation-configurations/master/automate_nginx.sh"],"commandToExecute":"./automate_nginx.sh"}'
```


## Allow traffic to application
When the scale set was created, an Azure load balancer was automatically deployed. The load balancer distributes traffic to the VM instances in the scale set. To allow traffic to reach the sample web application, create a load balancer rule with [az network lb rule create](/cli/azure/network/lb/rule). The following example creates a rule named *myLoadBalancerRuleWeb*:

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


## Test your scale set
To see your scale set in action, access the sample web application in a web browser. Obtain the public IP address of your load balancer with [az network public-ip show](/cli/azure/network/public-ip). The following example obtains the IP address for *myScaleSetLBPublicIP* created as part of the scale set:

```azurecli-interactive
az network public-ip show \
  --resource-group myResourceGroup \
  --name myScaleSetLBPublicIP \
  --query '[ipAddress]' \
  --output tsv
```

Enter the public IP address of the load balancer in to a web browser. The load balancer distributes traffic to one of your VM instances, as shown in the following example:

![Default web page in NGINX](media/virtual-machine-scale-sets-create-cli/running-nginx-site.png)


## Clean up resources
When no longer needed, you can use [az group delete](/cli/azure/group) to remove the resource group, scale set, and all related resources as follows. The `--no-wait` parameter returns control to the prompt without waiting for the operation to complete. The `--yes` parameter confirms that you wish to delete the resources without an additional prompt to do so.

```azurecli-interactive
az group delete --name myResourceGroup --yes --no-wait
```


## Next steps
In this quickstart, you created a basic scale set and used the Custom Script Extension to install a basic NGINX web server on the VM instances. To learn more, continue to the tutorial for how to create and manage Azure Virtual Machine Scale Sets.

> [!div class="nextstepaction"]
> [Create and manage Azure Virtual Machine Scale Sets](tutorial-create-and-manage-cli.md)
