---
title: Manage web traffic - Azure CLI
description: Learn how to create an application gateway with a Virtual Machine Scale Set to manage web traffic using the Azure CLI.
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: how-to
ms.date: 04/27/2023
ms.author: greglin 
ms.custom: devx-track-azurecli, devx-track-linux
---

# Manage web traffic with an application gateway using the Azure CLI

Application gateway is used to manage and secure web traffic to servers that you maintain. You can use the Azure CLI to create an [application gateway](overview.md) that uses a [Virtual Machine Scale Set](../virtual-machine-scale-sets/overview.md) for backend servers. In this example, the scale set contains two virtual machine instances. The scale set is added to the default backend pool of the application gateway.

In this article, you learn how to:

* Set up the network
* Create an application gateway
* Create a Virtual Machine Scale Set with the default backend pool

If you prefer, you can complete this procedure using [Azure PowerShell](tutorial-manage-web-traffic-powershell.md).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

 - This tutorial requires version 2.0.4 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed. Create a resource group using [az group create](/cli/azure/group#az-group-create).

The following example creates a resource group named *myResourceGroupAG* in the *eastus* location.

 ```azurecli-interactive 
 az group create --name myResourceGroupAG --location eastus
 ```

## Create network resources 

Create the virtual network named *myVNet* and the subnet named *myAGSubnet* using [az network vnet create](/cli/azure/network/vnet). You can then add the subnet named *myBackendSubnet* needed by the backend servers using [az network vnet subnet create](/cli/azure/network/vnet/subnet). Create the public IP address named *myAGPublicIPAddress* using [az network public-ip create](/cli/azure/network/public-ip).

 ```azurecli-interactive
 az network vnet create \
  --name myVNet \
  --resource-group myResourceGroupAG \
  --location eastus \
  --address-prefix 10.0.0.0/16 \
  --subnet-name myAGSubnet \
  --subnet-prefix 10.0.1.0/24

 az network vnet subnet create \
  --name myBackendSubnet \
  --resource-group myResourceGroupAG \
  --vnet-name myVNet \
  --address-prefix 10.0.2.0/24

 az network public-ip create \
  --resource-group myResourceGroupAG \
  --name myAGPublicIPAddress \
  --allocation-method Static \
  --sku Standard
 ```

## Create an application gateway

Use [az network application-gateway create](/cli/azure/network/application-gateway) to create the application gateway named *myAppGateway*. When you create an application gateway using the Azure CLI, you specify configuration information, such as capacity, sku, and HTTP settings. The application gateway is assigned to *myAGSubnet* and *myPublicIPAddress* that you previously created. 

 ```azurecli-interactive
 az network application-gateway create \
  --name myAppGateway \
  --location eastus \
  --resource-group myResourceGroupAG \
  --vnet-name myVNet \
  --subnet myAGsubnet \
  --capacity 2 \
  --sku Standard_v2 \
  --http-settings-cookie-based-affinity Disabled \
  --frontend-port 80 \
  --http-settings-port 80 \
  --http-settings-protocol Http \
  --public-ip-address myAGPublicIPAddress \
  --priority 100
 ```

It may take several minutes for the application gateway to be created. After the application gateway is created, you'll see these new features:

- *appGatewayBackendPool* - An application gateway must have at least one backend address pool.
- *appGatewayBackendHttpSettings* - Specifies that port 80 and an HTTP protocol is used for communication.
- *appGatewayHttpListener* - The default listener associated with *appGatewayBackendPool*.
- *appGatewayFrontendIP* - Assigns *myAGPublicIPAddress* to *appGatewayHttpListener*.
- *rule1* - The default routing rule that is associated with *appGatewayHttpListener*.

## Create a Virtual Machine Scale Set

In this example, you create a Virtual Machine Scale Set that provides servers for the backend pool in the application gateway. The virtual machines in the scale set are associated with *myBackendSubnet* and *appGatewayBackendPool*. To create the scale set, use [az vmss create](/cli/azure/vmss#az-vmss-create).

 ```azurecli-interactive
 az vmss create \
  --name myvmss \
  --resource-group myResourceGroupAG \
  --image Ubuntu2204 \
  --admin-username azureuser \
  --admin-password Azure123456! \
  --instance-count 2 \
  --vnet-name myVNet \
  --subnet myBackendSubnet \
  --vm-sku Standard_DS2 \
  --upgrade-policy-mode Automatic \
  --app-gateway myAppGateway \
  --backend-pool-name appGatewayBackendPool
 ```

### Install NGINX

Now you can install NGINX on the Virtual Machine Scale Set so you can test HTTP connectivity to the backend pool.

 ```azurecli-interactive
 az vmss extension set \
  --publisher Microsoft.Azure.Extensions \
  --version 2.0 \
  --name CustomScript \
  --resource-group myResourceGroupAG \
  --vmss-name myvmss \
  --settings '{ "fileUris": ["https://raw.githubusercontent.com/Azure/azure-docs-powershell-samples/master/application-gateway/iis/install_nginx.sh"], "commandToExecute": "./install_nginx.sh" }'
 ```

## Test the application gateway

To get the public IP address of the application gateway, use [az network public-ip show](/cli/azure/network/public-ip). Copy the public IP address, and then paste it into the address bar of your browser.

 ```azurecli-interactive
 az network public-ip show \
  --resource-group myResourceGroupAG \
  --name myAGPublicIPAddress \
  --query [ipAddress] \
  --output tsv
 ```

![Test base URL in application gateway](./media/tutorial-manage-web-traffic-cli/tutorial-nginxtest.png)

## Clean up resources

When no longer needed, remove the resource group, application gateway, and all related resources.

 ```azurecli-interactive
 az group delete --name myResourceGroupAG --location eastus
 ```

## Next steps

[Restrict web traffic with a web application firewall](../web-application-firewall/ag/tutorial-restrict-web-traffic-cli.md)
