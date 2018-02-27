---
title: Create a public load balancer - Azure CLI | Microsoft Docs
description: Learn how to create a public load balancer using the Azure CLI
services: load-balancer
documentationcenter: na
author: KumudD
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: a8bcdd88-f94c-4537-8143-c710eaa86818
ms.service: load-balancer
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/26/2017
ms.author: kumud
---
# Creating a public load balancer using the Azure CLI

The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This quickstart details using the Azure CLI to create and configure load balancer to load balance web apps between two VMs running Ubuntu server.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)] 

If you choose to install and use the CLI locally, this tutorial requires that you are running a version of the Azure CLI greater than version 2.0.17. To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

## Create a resource group

Create a resource group with [az group create](https://docs.microsoft.com/cli/azure/group#create). An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named *myResourceGroupLB* in the *easts* location:

```azurecli-interactive
       az group create --name myResourceGroupLB --location eastus
```

## Create a virtual network

Create a virtual network named *myVnet* with a subnet named *mySubnet* in the *myResourceGroup* using [az network vnet create](https://docs.microsoft.com/cli/azure/network/vnet#create).

```azurecli-interactive
   az network vnet create --resource-group myResourceGroupLB --location eastus --name myVnet --subnet-name mySubnet
```
## Create a public IP address

To access your web app on the Internet, you need a public IP address for the load balancer. Use [az network public-ip create](https://docs.microsoft.com/cli/azure/network/public-ip#create) to create a public IP address named *myPublicIP* in *myResourceGroup*.

```azurecli-interactive
   az network public-ip create --resource-group myResourceGroupLB --name myPublicIP
```

## Create a load balancer and configure settings

Create a public Azure Load Balancer with [az network lb create](https://docs.microsoft.com/cli/azure/network/lb?view=azure-cli-latest#create) named **myLoadBalancer** that includes a frontend pool named **myFrontEndPool**, a back-end pool named **myBackEndPool** and is associated with the public IP address **myPublicIP** that you created in the preceding step.

### Create the load balancer

Create load balancer, the frontend IP pool that receives the incoming network traffic on the load balancer, and the backend IP pool where the front-end pool sends the load balanced network traffic.

1. Create the load balancer.

    ```azurecli-interactive
      az network lb create --resource-group myResourceGroupLB --name myLoadBalancer
    ```

2. Create the frontend pool

    ```azurecli-interactive
       az network lb frontend-ip create \
       --name myFrontEndPool
       --resource-group myResourceGroupLB \
       --lb-name myLoadBalancer \       
       --public-ip-address myPublicIP \ 
       
    ```
3. Create the backend pool.

    ```azurecli-interactive
       az network lb address-pool create \
       --name myBackEndPool
       --resource-group myResourceGroupLB \
       --lb-name myLoadBalancer \       
          
    ```

### Create the health probe on port 80

A health probe checks all virtual machine instances to make sure they can send network traffic. The virtual machine instance with failed probe checks is removed from the load balancer until it goes back online and a probe check determines that it's healthy. Create a health probe with [az network lb probe create](https://docs.microsoft.com/cli/azure/network/lb/probe?view=azure-cli-latest#create) to monitor the health of the virtual machines. 

```azurecli-interactive
   az network lb probe create \
   --resource-group myResourceGroupLB \
   --lb-name myLoadBalancer \ 
   --name myHealthProbe \
   --protocol tcp --port 80     
```
### Create the load balancer rule

In this step, you create a load balancer rule myLoadBalancerRuleWeb with [az network lb rule create](https://docs.microsoft.com/cli/azure/network/lb/rule?view=azure-cli-latest#create) for listening to port 80 in the front-end pool myFrontEndPool and sending load-balanced network traffic to the back-end address pool myBackEndPool, also using port 80. 

```azurecli-interactive
   az network lb rule create \
   --resource-group myResourceGroupLB \
   --lb-name myLoadBalancer --name myHTTPRule \
   --protocol tcp --frontend-port 80 --backend-port 80 \
   --frontend-ip-name myFrontEndPool \ 
   --backend-pool-name myBackEndPool \
   --probe-name myHealthProbe   
  
```

### Create NAT rules

Inbound NAT rules are used to create endpoints in a load balancer that go to a specific virtual machine instance. Creates two NAT rules with [az network lb inbound-nat-rule](https://docs.microsoft.com/cli/azure/network/lb/inbound-nat-rule?view=azure-cli-latest#create) for remote desktop. 

```azurecli-interactive
    az network lb inbound-nat-rule create \ 
    --resource-group myResourceGroup --lb-name myLoadBalancer \ 
    -name NATrule1 --protocol tcp \ 
    --frontend-port 5432 --backend-port 3389 \ 
    --frontend-ip-name myFrontEndPool 
    
    az network lb inbound-nat-rule create \ 
    --resource-group myResourceGroup --lb-name myLoadBalancer \ 
    --name NATrule2 --protocol tcp \ 
    --frontend-port 5433 --backend-port 3389 \ 
    --frontend-ip-name myFrontEndPool 
 
```

## Create network resources
 
In this section, you create NICs, an availability set, and two VMs.

### Create NICs

```azurecli-interactive
    az network nic create \ 
    --resource-group myResourceGroup --name myNic1 \ 
    --vnet-name myVnet --subnet mySubnet \ 
    --lb-name myLoadBalancer \ 
    --lb-address-pools myBackEndPool --lb-inbound-nat-rules NATRule1 

    az network nic create \ 
    --resource-group myResourceGroup --name myNic2 \ 
    --vnet-name myVnet --subnet mySubnet \ 
    --lb-name myLoadBalancer \ 
    --lb-address-pools myBackEndPool \
    --lb-inbound-nat-rules NATRule2

```
## Create an availability set 

To improve the high availability of your app, place your VMs in an availability set. VMs in a load balancer need to be in the same availability set. Create an availability set named myAvailabilityset with [az vm availability-set create](https://docs.microsoft.com/cli/azure/vm/availability-set?view=azure-cli-latest#create). 

```azurecli-interactive
   az vm availability-set create \
   --resource-group myResourceGroup \
   --name myAvailabilitySet \
   --platform-fault-domain-count 3 \
   --platform-update-domain-count 3

```


### Create virtual machines 

Create two VMs with [az vm create](https://docs.microsoft.com/cli/azure/vm?view=azure-cli-latest#create) and add them to the Availability set named **myAvailabilitySet**.

1. Update for your admin password.  

   ```azurecli-interactive
       $AdminPassword=ChangeYourAdminPassword1 
   ```

2. Create a virtual machine named **myVM1**, and then associate it with the NIC named **myNic1**. 

  ```azurecli-interactive
       az vm create \
       --resource-group myResourceGroup \
       --name myVM1 \
       --availability-set myAvailabilitySet \
       --nics myNic1 \
       --image win2016datacenter \
       --admin-password $AdminPassword \
       --admin-username azureuser \ 
       --no-wait
  ```

## Delete a load balancer

To remove a load balancer with [az network lb delete](https://docs.microsoft.com/cli/azure/network/lb?view=azure-cli-latest#delete). 

```azurecli-interactive
az network lb delete --resource-group MyResourceGroup --name MyLoadBalancer
```

## Next steps
[Get started configuring an internal load balancer](load-balancer-get-started-ilb-arm-cli.md)

[Configure a load balancer distribution mode](load-balancer-distribution-mode.md)

[Configure idle TCP timeout settings for your load balancer](load-balancer-tcp-idle-timeout.md)
