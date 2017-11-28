---
title: Create an application gateway with a virtual machine scale set - Azure CLI | Microsoft Docs
description: Learn how to create an application gateway with a virtual machine scale set using the Azure CLI.
services: application-gateway
author: davidmu1
manager: timlt
editor: tysonn

ms.service: application-gateway
ms.topic: article
ms.workload: infrastructure-services
ms.date: 11/15/2017
ms.author: davidmu

---
# Create an application gateway with a virtual machine scale set using the Azure CLI

You can use the Azure CLI to create an [application gateway](application-gateway-introduction.md) that uses a [virtual machine scale set](../virtual-machine-scale-sets/virtual-machine-scale-sets-overview.md) for backend servers. In this example, the scale set contains two virtual machine instances that are added to the default backend pool of the application gateway.

In this article, you learn how to

> [!div class="checklist"]
> * Create a virtual machine scale set
> * Create an application gateway
> * Add servers to the default backend pool

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.4 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli).

## Create a resource group

Create a resource group using [az group create](/cli/azure/group#create). An Azure resource group is a logical container into which Azure resources are deployed and managed. 

The following example creates a resource group named *myResourceGroupAG* in the *eastus* location.

```azurecli-interactive 
az group create --name myResourceGroupAG --location eastus
```

## Create a virtual network, subnets, and public IP address 

You can create the virtual network and the backend subnet by using [az network vnet create](/cli/azure/network/vnet#az_net). You can add the subnet named *myAGSubnet* that's needed by the application gateway by using [az network vnet subnet create](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_create). Create the public IP address named *myAGPublicIPAddress* by using [az network public-ip create](/cli/azure/public-ip#az_network_public_ip_create).

```azurecli-interactive
az network vnet create \
  --name myVNet \
  --resource-group myResourceGroupAG \
  --location eastus \
  --address-prefix 10.0.0.0/16 \
  --subnet-name myBackendSubnet \
  --subnet-prefix 10.0.1.0/24
az network vnet subnet create \
  --name myAGSubnet \
  --resource-group myResourceGroupAG \
  --vnet-name myVNet \
  --address-prefix 10.0.2.0/24
az network public-ip create \
  --resource-group myResourceGroupAG \
  --name myAGPublicIPAddress
```

## Create a virtual machine scale set

In this example, you create a virtual machine scale set that provides servers for the default backend pool in the application gateway. The virtual machines in the scale set are associated with the *myBackendSubnet* subnet. You can use [az vmss create](/cli/azure/vmss#az_vmss_create) to create the scale set.

```azurecli-interactive
az vmss create \
  --name myvmss \
  --resource-group myResourceGroupAG \
  --image UbuntuLTS \
  --admin-username azureuser \
  --admin-password Azure123456! \
  --instance-count 2 \
  --vnet-name myVNet \
  --subnet myBackendSubnet \
  --vm-sku Standard_DS2 \
  --upgrade-policy-mode Automatic
```

### Install NGINX

In your current shell, create a file named customConfig.json and paste the following configuration. You can use any editor you wish to create the file in the Cloud Shell.  Enter `sensible-editor cloudConfig.json` to see a list of available editors to create the file.

```json
{
  "fileUris": ["https://raw.githubusercontent.com/davidmu1/samplescripts/master/install_nginx.sh"],
  "commandToExecute": "./install_nginx.sh"
}
```

Run this command in the shell window:

```azurecli-interactive
az vmss extension set \
  --publisher Microsoft.Azure.Extensions \
  --version 2.0 \
  --name CustomScript \
  --resource-group myResourceGroupAG \
  --vmss-name myvmss \
  --settings @cloudConfig.json
```

## Create an application gateway

### Get the IP addresses of the instances

Use [az vmss nic list](/cli/azure/vmss/nic#az_vmss_nic_list) to get the private IP address of each virtual machine in the scale set. After running the command, record the private IP addresses for each virtual machine.

```azurecli-interactive
az vmss nic list \
  --vmss-name myvmss \
  --resource-group myResourceGroupAG | grep "privateIpAddress"
```

### Create the application gateway

Now that you created the necessary supporting resources, use [az network application-gateway create](/cli/azure/application-gateway#create) to create the application gateway. When you create an application gateway using the Azure CLI, you specify configuration information, such as capacity, sku, and HTTP settings. Use the two IP addresses that you recorded for the value of the `--servers` parameter.

```azurecli-interactive
az network application-gateway create \
  --name myAppGateway \
  --location eastus \
  --resource-group myResourceGroupAG \
  --vnet-name myVNet \
  --subnet myAGsubnet \
  --capacity 2 \
  --sku Standard_Medium \
  --http-settings-cookie-based-affinity Disabled \
  --frontend-port 80 \
  --http-settings-port 80 \
  --http-settings-protocol Http \
  --servers 10.0.1.5 10.0.1.7 \
  --public-ip-address myAGPublicIPAddress
```

 It may take several minutes for the application gateway to be created. After the application gateway is created, you can see these new features of it:

- *appGatewayBackendPool* - An application gateway must have at least one backend address pool.
- *appGatewayBackendHttpSettings* - Specifies that port 80 and an HTTP protocol is used for communication.
- *appGatewayHttpListener* - The default listener associated with *appGatewayBackendPool*.
- *appGatewayFrontendIP* - Assigns *myAGPublicIPAddress* to *appGatewayHttpListener*.
- *rule1* - The default routing rule that is associated with *appGatewayHttpListener*.

## Test the application gateway

1. Use [az network public-ip show](/cli/azure/network/public-ip#az_network_public_ip_show) to get the public IP address of the application gateway.

    ```azurepowershell-interactive
    az network public-ip show \
    --resource-group myResourceGroupAG \
    --name myAGPublicIPAddress \
    --query [ipAddress] \
    --output tsv
    ```

2. Copy the public IP address, and then paste it into the address bar of your browser.

    ![Test base URL in application gateway](./media/tutorial-create-vmss-cli/tutorial-nginxtest.png)

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a virtual machine scale set
> * Create an application gateway
> * Add servers to the default backend pool


