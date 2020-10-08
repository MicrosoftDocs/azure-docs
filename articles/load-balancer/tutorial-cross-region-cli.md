---
title: 'Tutorial: Create a cross-region load balancer using Azure CLI'
titleSuffix: Azure Load Balancer
description: Get started with this tutorial deploying a cross-region Azure Load Balancer using Azure CLI.
author: asudbring
ms.author: allensu
ms.service: load-balancer
ms.topic: tutorial
ms.date: 10/09/2020
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

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires Azure CLI version 2.0.28 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli).

## Sign in to Azure CLI

Sign in to Azure PowerShell:

```azurecli-interactive
az login
```

## Create cross-region load balancer

In this section, you'll create a cross-region load balancer, public IP address, and load balancing rule.

### Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [az group create](https://docs.microsoft.com/cli/azure/group?view=azure-cli-latest#az-group-create):

* Named **myResourceGroupLB-CR**.
* In the **westus** location.

```azurecli-interactive
  az group create \
    --name myResourceGroupLB-CR \
    --location westus
```

### Create a public IP address in the Standard SKU

Use [az network public-ip create](https://docs.microsoft.com/cli/azure/network/public-ip?view=azure-cli-latest#az-network-public-ip-create) to:

* Create a standard zone redundant public IP address named **myPublicIP-CR**.
* In **myResourceGroupLB-CR**.

```azurecli-interactive
  az network public-ip create \
    --resource-group myResourceGroupLB-CR \
    --name myPublicIP-CR \
    --sku Standard
    --tier Global
```

To create a zonal public IP address in zone 1, use the following command:

```azurecli-interactive
  az network public-ip create \
    --resource-group myResourceGroupLB-CR \
    --name myPublicIP-CR \
    --sku Standard \
    --zone 1
    --tier Global
```

### Create the load balancer resource

Create a public load balancer with [az network lb create](https://docs.microsoft.com/cli/azure/network/lb?view=azure-cli-latest#az-network-lb-create):

* Named **myLoadBalancer-CR**.
* A frontend pool named **myFrontEnd-CR**.
* A backend pool named **myBackEndPool-CR**.
* Associated with the public IP address **myPublicIP-CR** that you created in the preceding step. 

```azurecli-interactive
  az network lb create \
    --resource-group myResourceGroupLB-CR \
    --name myLoadBalancer-CR \
    --sku Standard \
    --public-ip-address myPublicIP-CR \
    --frontend-ip-name myFrontEnd-CR \
    --backend-pool-name myBackEndPool-CR \
    --tier Global       
```
### Create the load balancer rule

A load balancer rule defines:

* Frontend IP configuration for the incoming traffic.
* The backend IP pool to receive the traffic.
* The required source and destination port. 

Create a load balancer rule with [az network lb rule create](https://docs.microsoft.com/cli/azure/network/lb/rule?view=azure-cli-latest#az-network-lb-rule-create):

* Named **myHTTPRule-CR**
* Listening on **Port 80** in the frontend pool **myFrontEnd-CR**.
* Sending load-balanced network traffic to the backend address pool **myBackEndPool-CR** using **Port 80**. 
* Protocol **TCP**.

```azurecli-interactive
  az network lb rule create \
    --resource-group myResourceGroupLB-CR \
    --lb-name myLoadBalancer-CR \
    --name myHTTPRule-CR \
    --protocol tcp \
    --frontend-port 80 \
    --backend-port 80 \
    --frontend-ip-name myFrontEnd-CR \
    --backend-pool-name myBackEndPool-CR
```

## Create backend pool

In this section, you'll add two regional standard load balancers to the backend pool of the cross-region load balancer.

> [!IMPORTANT]
> To complete these steps, ensure that two regional load balancers with backend pools have been deployed in your subscription.  For more information, see, **[Quickstart: Create a public load balancer to load balance VMs using Azure PowerShell](quickstart-load-balancer-standard-public-powershell.md)**.

**FINISH INSTRUCTIONS HERE WHEN CLI IS DONE**

## Test the load balancer

In this section, you'll test the cross-region load balancer. You'll connect to the public IP address in a web browser.  You'll stop the virtual machines in one of the regional load balancer backend pools and observe the failover.

1. To get the public IP address of the load balancer, use [az network public-ip show](https://docs.microsoft.com/cli/azure/network/public-ip?view=azure-cli-latest#az-network-public-ip-show):

```azurecli-interactive
  az network public-ip show \
    --resource-group myResourceGroupLB-CR \
    --name myPublicIP-CR \
    --query [ipAddress] \
    --output tsv
```
2. Copy the public IP address, and then paste it into the address bar of your browser. The default page of IIS Web server is displayed on the browser.

3. Stop the virtual machines in the backend pool of one of the regional load balancers.

4. Refresh the web browser and observe the failover of the connection to the other regional load balancer.

## Clean up resources

When no longer needed, use the [az group delete](https://docs.microsoft.com/cli/azure/group?view=azure-cli-latest#az-group-delete) command to remove the resource group, load balancer, and all related resources.

```azurecli-interactive
  az group delete \
    --name myResourceGroupLB
```

## Next steps

In this tutorial, you:

* Created a cross-region load balancer.
* Added regional load balancers to the backend pool of the cross-region load balancer.
* Created a load-balancing rule.
* Tested the load balancer.


Advance to the next article to learn how to...
> [!div class="nextstepaction"]
> [Load balance VMs across availability zones](tutorial-load-balancer-standard-public-zone-redundant-portal.md)
