---
title: Configure outbound rules in Standard Load Balancer using Azure CLI | Microsoft Docs
description: This article shows how to configure outbound rules in a Standard Load Balancer using the Azure CLI.
services: load-balancer
documentationcenter: na
author: KumudD
manager: jpconnock
tags: azure-resource-manager
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/24/2018
ms.author: kumud

---
# Configure outbound rules in Standard Load Balancer using Azure CLI

This quickstart shows you how configure outbound rules in Standard Load Balancer using Azure CLI. 

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)] 

If you choose to install and use the CLI locally, this tutorial requires that you are running a version of the Azure CLI version 2.0.28 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

## Create a resource group

Create a resource group with [az group create](https://docs.microsoft.com/cli/azure/group#create). An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named *outbound* in the *eastus2* location:

```azurecli-interactive
  az group create \
    --name myresourcegroupoutbound \
    --location eastus2
```
## Create a virtual network
Create a virtual network named *myVnet* with a subnet named *mySubnet* in the *myResourceGroup* using [az network vnet create](https://docs.microsoft.com/cli/azure/network/vnet#create).

```azurecli-interactive
  az network vnet create \
    --resource-group myresourcegroupoutbound \
    --name myvnetoutbound \
    --address-prefix 192.168.0.0/16 \
    --subnet-name mysubnetoutbound
    --subnet-prefix 192.168.0.0/24
```

## Create a public Standard IP address for inbound Load Balancer frontend 

To access your web app on the Internet, you need a public IP address for the load balancer. A Standard Load Balancer only supports Standard Public IP addresses. Use [az network public-ip create](https://docs.microsoft.com/cli/azure/network/public-ip#create) to create a Standard Public IP address named *mypublicipinbound* in *myresourcegroupoutbound*.

```azurecli-interactive
  az network public-ip create --resource-group myresourcegroupoutbound --name mypublicipinbound --sku standard
```

## Create a public Standard IP address for outbound Load Balancer rule 

Create a Standard IP address for Load Balancer's frontend outbound configuration [az network public-ip create](https://docs.microsoft.com/cli/azure/network/public-ip#create) named *mypublicipoutbound* in *myresourcegroupoutbound*.

```azurecli-interactive
  az network public-ip create --resource-group myresourcegroupoutbound --name mypublicipoutbound --sku standard
```


## Create Azure Load Balancer

This section details how you can create and configure the following components of the load balancer:
  - a frontend IP pool that receives the incoming network traffic on the load balancer.
  - a backend IP pool where the frontend pool sends the load balanced network traffic.
  - a health probe that determines health of the backend VM instances.
  - a load balancer inbound rule that defines how traffic is distributed to the VMs.
  - a load balancer outbound rule that defines how traffic distributed from the VMs.

### Create the Load Balancer

Create a Load Balancer with the inbound IP address using [az network lb create](https://docs.microsoft.com/cli/azure/network/lb?view=azure-cli-latest#create) named *lb* that includes an inbound frontend ip configuration named *myfrontendinbound*, a backend pool named *bepool* that is associated with the public IP address *mypublicipinbound* that you created in the preceding step.

```azurecli-interactive
  az network lb create \
    --resource-group myresourcegroupoutbound \
    --name lb \
    --sku standard \
    --backend-pool-name bepool \
    --frontend-ip-name myfrontendinbound \
    --location eastus2 \
    --public-ip-address mypublicipinbound   
  ```

### Configure the outbound frontend IP address for the load balancer
Create the outbound frontend IP configuration for the Load Balancer with [az network lb frontend-ip create](https://docs.microsoft.com/cli/azure/network/lb?view=azure-cli-latest#create) that includes and outbound frontend IP configuration named *myfrontendoutbound* that is associated to the public IP address **mypublicipoutbound*

```azurecli-interactive
  az network lb frontend-ip create \
    --resource-group myresourcegroupoutbound \
    --name myfrontendoutbound \
    --lb-name lb \
    --public-ip-address mypublicipoutbound 
  ```

### Create the health probe

A health probe checks all virtual machine instances to make sure they can send network traffic. The virtual machine instance with failed probe checks is removed from the load balancer until it goes back online and a probe check determines that it's healthy. Create a health probe with [az network lb probe create](https://docs.microsoft.com/cli/azure/network/lb/probe?view=azure-cli-latest#create) to monitor the health of the virtual machines. 

```azurecli-interactive
  az network lb probe create \
    --resource-group myresourcegroupoutbound \
    --lb-name lb \
    --name http \
    --protocol http \
    --port 80 \
    --path /  
```

### Create the inbound load balancer rule

A load balancer rule defines the frontend IP configuration for the incoming traffic and the backend IP pool to receive the traffic, along with the required source and destination port. Create a load balancer rule *myinboundlbrule* with [az network lb rule create](https://docs.microsoft.com/cli/azure/network/lb/rule?view=azure-cli-latest#create) for listening to port 80 in the frontend pool *myfrontendinbound* and sending load-balanced network traffic to the backend address pool *bepool* also using port 80. 

```azurecli-interactive
az network lb rule create \
--resource-group myresourcegroupoutbound \
--lb-name lb \
--name inboundlbrule \
--protocol tcp \
--frontend-port 80 \
--backend-port 80 \
--probe http \
--frontend-ip-name myfrontendinbound \
--backend-pool-name bepool
```

## Clean up resources

When no longer needed, you can use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, load balancer, and all related resources.

```azurecli-interactive 
  az group delete --name outbound
```
## Next step
In this article, you created Standard Load Balancer, configured both inbound load balancer traffic rules and configured a health probe for the VMs in the backend pool. To learn more about Azure Load Balancer, continue to the tutorials for Azure Load Balancer.

> [!div class="nextstepaction"]
> [Azure Load Balancer tutorials](tutorial-load-balancer-standard-manage-portal.md)

