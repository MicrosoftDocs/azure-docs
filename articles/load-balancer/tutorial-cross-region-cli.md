---
title: 'Tutorial: Create a cross-region load balancer - Azure CLI'
titleSuffix: Azure Load Balancer
description: Get started with this tutorial deploying a cross-region Azure Load Balancer using Azure CLI.
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: tutorial
ms.date: 06/27/2023
ms.custom: template-tutorial, devx-track-azurecli, engagement-fy23
ROBOTS: NOINDEX
#Customer intent: As a administrator, I want to deploy a cross-region load balancer for global high availability of my application or service.
---

# Tutorial: Create a cross-region Azure Load Balancer using Azure CLI

A cross-region load balancer ensures a service is available globally across multiple Azure regions. If one region fails, the traffic is routed to the next closest healthy regional load balancer.  

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create cross-region load balancer.
> * Create a load balancer rule.
> * Create a backend pool containing two regional load balancers.
> * Test the load balancer.

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- An Azure subscription.
- Two **standard** sku Azure Load Balancers with backend pools deployed in two different Azure regions.
    - For information on creating a regional standard load balancer and virtual machines for backend pools, see [Quickstart: Create a public load balancer to load balance VMs using Azure CLI](quickstart-load-balancer-standard-public-cli.md).
        - Append the name of the load balancers and virtual machines in each region with a **-R1** and **-R2**. 
- Azure CLI installed locally or Azure Cloud Shell.

If you choose to install and use the CLI locally, this quickstart requires Azure CLI version 2.0.28 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli).

## Sign in to Azure CLI

Sign in to Azure CLI:

```azurecli-interactive
az login
```
## Set resource variables

```azurecli-interactive

``````
## Create cross-region load balancer

In this section, you'll create a cross-region load balancer, public IP address, and load balancing rule.

### Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [az group create](/cli/azure/group#az-group-create):

* Named **myResourceGroupLB-CR**.
* In the **westus** location.

```azurecli-interactive
  az group create \
    --name myResourceGroupLB-CR \
    --location westus
```

### Create the load balancer resource

Create a cross-region load balancer with [az network cross-region-lb create](/cli/azure/network/cross-region-lb#az-network-cross-region-lb-create):

* Named **myLoadBalancer-CR**.
* A frontend pool named **myFrontEnd-CR**.
* A backend pool named **myBackEndPool-CR**.

```azurecli-interactive
  az network cross-region-lb create \
    --name myLoadBalancer-CR \
    --resource-group myResourceGroupLB-CR \
    --frontend-ip-name myFrontEnd-CR \
    --backend-pool-name myBackEndPool-CR     
```

### Create the load balancer rule

A load balancer rule defines:

* Frontend IP configuration for the incoming traffic.
* The backend IP pool to receive the traffic.
* The required source and destination port. 

Create a load balancer rule with [az network cross-region-lb rule create](/cli/azure/network/cross-region-lb/rule#az-network-cross-region-lb-rule-create):

* Named **myHTTPRule-CR**
* Listening on **Port 80** in the frontend pool **myFrontEnd-CR**.
* Sending load-balanced network traffic to the backend address pool **myBackEndPool-CR** using **Port 80**. 
* Protocol **TCP**.

```azurecli-interactive
  az network cross-region-lb rule create \
    --backend-port 80 \
    --frontend-port 80 \
    --lb-name myLoadBalancer-CR \
    --name myHTTPRule-CR \
    --protocol tcp \
    --resource-group myResourceGroupLB-CR \
    --backend-pool-name myBackEndPool-CR \
    --frontend-ip-name myFrontEnd-CR
```

## Create backend pool

In this section, you'll add two regional standard load balancers to the backend pool of the cross-region load balancer.

> [!IMPORTANT]
> To complete these steps, ensure that two regional load balancers with backend pools have been deployed in your subscription.  For more information, see, **[Quickstart: Create a public load balancer to load balance VMs using Azure CLI](quickstart-load-balancer-standard-public-cli.md)**.

### Add the regional frontends to load balancer

In this section, you'll place the resource IDs of two regional load balancers frontends into variables.  You'll then use the variables to add the frontends to the backend address pool of the cross-region load balancer.

Retrieve the resource IDs with [az network lb frontend-ip show](/cli/azure/network/lb/frontend-ip#az-network-lb-frontend-ip-show).

Use [az network cross-region-lb address-pool address add](/cli/azure/network/cross-region-lb/address-pool/address#az-network-cross-region-lb-address-pool-address-add) to add the frontends you placed in variables in the backend pool of the cross-region load balancer:

```azurecli-interactive
  region1id=$(az network lb frontend-ip show \
    --lb-name myLoadBalancer-R1 \
    --name myFrontEnd-R1 \
    --resource-group CreatePubLBQS-rg-r1 \
    --query id \
    --output tsv)

  az network cross-region-lb address-pool address add \
    --frontend-ip-address $region1id \
    --lb-name myLoadBalancer-CR \
    --name myFrontEnd-R1 \
    --pool-name myBackEndPool-CR \
    --resource-group myResourceGroupLB-CR

  region2id=$(az network lb frontend-ip show \
    --lb-name myLoadBalancer-R2 \
    --name myFrontEnd-R2 \
    --resource-group CreatePubLBQS-rg-r2 \
    --query id \
    --output tsv)
  
  az network cross-region-lb address-pool address add \
    --frontend-ip-address $region2id \
    --lb-name myLoadBalancer-CR \
    --name myFrontEnd-R2 \
    --pool-name myBackEndPool-CR \
    --resource-group myResourceGroupLB-CR
```

## Test the load balancer

In this section, you'll test the cross-region load balancer. You'll connect to the public IP address in a web browser.  You'll stop the virtual machines in one of the regional load balancer backend pools and observe the failover.

1. To get the public IP address of the load balancer, use [az network public-ip show](/cli/azure/network/public-ip#az-network-public-ip-show):

    ```azurecli-interactive
      az network public-ip show \
        --resource-group myResourceGroupLB-CR \
        --name PublicIPmyLoadBalancer-CR \
        --query ipAddress \
        --output tsv
    ```
2. Copy the public IP address, and then paste it into the address bar of your browser. The default page of IIS Web server is displayed on the browser.

3. Stop the virtual machines in the backend pool of one of the regional load balancers.

4. Refresh the web browser and observe the failover of the connection to the other regional load balancer.

## Clean up resources

When no longer needed, use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, load balancer, and all related resources.

```azurecli-interactive
  az group delete \
    --name myResourceGroupLB-CR
```

## Next steps

In this tutorial, you:

* Created a cross-region load balancer.
* Created a load-balancing rule.
* Added regional load balancers to the backend pool of the cross-region load balancer.
* Tested the load balancer.

Advance to the next article to learn how to...
> [!div class="nextstepaction"]
> [Load balance VMs across availability zones](./quickstart-load-balancer-standard-public-portal.md)
