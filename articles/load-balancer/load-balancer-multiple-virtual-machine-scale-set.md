---
title: Add multiple Virtual Machine Scale Set instances behind one Azure Load Balancer 
description: learn how to configure multiple Virtual Machine Scale Set instances behind a single Azure load Balancer.
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: how-to 
ms.date: 12/15/2022
ms.custom: template-how-to
---

# Add multiple Virtual Machine Scale Set instances behind one Azure Load Balancer 

In this article, you’ll learn how to configure multiple Virtual Machine Scale Set instances behind a single Azure Load Balancer.

## Prerequisites

# [Azure portal](#tab/azureportal)

- Access to the Azure portal
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- Two or more [Virtual Machine Scale Sets](../virtual-machine-scale-sets/quick-create-portal.md)
  - Ensure the upgrade policy is set to automatic.
    - If manual upgrade policy is used, upgrade all virtual machine instances after attaching it to the load balancer.  
- An existing [standard SKU load balancer](quickstart-load-balancer-standard-internal-portal.md) in the same subscription and virtual network as the Virtual Machine Scale Sets.
  - The load balancer must also have a backend pool with health probes and load balancing rules attached.

# [Azure CLI](#tab/azurecli/)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- Two or more [Virtual Machine Scale Sets](../virtual-machine-scale-sets/quick-create-portal.md)
  - Ensure that the upgrade policy is set to automatic.
    - If manual upgrade policy is used, upgrade all virtual machine instances after attaching it to the load balancer.  
- An existing [standard SKU load balancer](quickstart-load-balancer-standard-internal-portal.md) in the same subscription and virtual network as the Virtual Machine Scale Sets.
  - The load balancer must also have a backend pool with health probes and load balancing rules attached.
- Access to the Azure portal CLI

> [!NOTE]
> If you choose to use Azure CLI, you have can run AZ CLI in Azure Cloud Shell or as a local install. Review the following to ensure you are ready to use Azure CLI in the environment you choose. 

- Use the Bash environment in [Azure Cloud Shell](../cloud-shell/quickstart.md)
  [![Launch Cloud Shell in a new window](../../includes/media/cloud-shell-try-it/hdi-launch-cloud-shell.png)](https://shell.azure.com)
- If you prefer to run CLI reference commands locally, [install](/cli/azure/install-azure-cli) the Azure CLI. If you're running on Windows or macOS, consider running Azure CLI in a Docker container. For more information, see [How to run the Azure CLI in a Docker container](/cli/azure/run-azure-cli-docker).

  - If you're using a local installation, sign in to the Azure CLI by using the [az sign-in](/cli/azure/reference-index#az-login) command. To finish the authentication process, follow the steps displayed in your terminal. For other sign-in options, see [Sign in with the Azure CLI](/cli/azure/authenticate-azure-cli).

  - When you're prompted, install the Azure CLI extension on first use. For more information about extensions, see [Use extensions with the Azure CLI](/cli/azure/azure-cli-extensions-overview).

  - Run [az version](/cli/azure/reference-index?#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index?#az-upgrade).

---

## Add Virtual Machine Scale Set to an Azure Load Balancer’s backend pool 

In this section, you’ll learn how to attach your Virtual Machine Scale Sets behind a single Azure Load Balancer.

> [!NOTE] 
> The following section assumes a virtual network named *myVnet* and an Azure Load Balancer named *myLoadBalancer* has been previously deployed. In addition, the following section assumes the backend pools are NIC based.  

# [Azure portal](#tab/azureportal)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.
1. Select your balancer from the list.
1. In your load balancer's page, select **Backend pools** under **Settings**.
1. Select your backend pool.
1. In your backend pool's page, select **+ Add** under **IP configurations**
1. Select the two Virtual Machine Scale Sets that you want to add to the backend pool.
1. Select **Add** and **Save**.

# [Azure CLI](#tab/azurecli/)

1. Connect to your Azure subscription with Azure CLI.
1. Add the first Virtual Machine Scale Set to a load balancer with [az vmss update](/cli/azure/vmss#az-vmss-update), and replace the values in brackets with the names of the resources in your configuration.

    ```azurecli
    
    az vmss update\
        --resource-group <resource-group> \
        --name <vmss-name> \
        --add  virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].ipConfigurations[0].loadBalancerBackendAddressPools "{'id':'/subscriptions/<SubscriptionID>/resourceGroups/<Resource Group> /providers/Microsoft.Network/loadBalancers/<Load Balancer Name>/backendAddressPools/<Backend address pool name >'}" 
    
    ```
This example deploys a Virtual Machine Scale Set with the following defined values:  

- Virtual Machine Scale Set named *myVMSS*
- Azure Load Balancer named *MyLB*
- Load Balancer backend pool named *mybackend*
- Resource group named *myResourceGroup*
- Subscription ID named *SubscriptionID* 
```azurecli

az vmss update \ 
    --resource-group myResourceGroup \
    --name myVMSS \
    --add virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].ipConfigurations[0].loadBalancerBackendAddressPools "{'id':'/subscriptions/SubscriptionID/resourceGroups/myResourceGroup /providers/Microsoft.Network/loadBalancers/MyLb/backendAddressPools/mybackend'}" 

```

3. Repeat the steps to attach your second Virtual Machine Scale Set to the backend pool of the Azure Load Balancer with `az vmss update`.

---
## Next steps

In this article, you attached multiple Virtual Machine Scale Sets behind a single Azure load balancer.

- [What is Azure Load Balancer?](load-balancer-overview.md)
- [What are Azure Virtual Machine Scale Sets?](../virtual-machine-scale-sets/overview.md)
