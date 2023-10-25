---
title: 'Quickstart - Create an Azure Private Link service - Azure CLI'
description: In this quickstart, learn how to create an Azure Private Link service using Azure CLI.
services: private-link
author: asudbring
ms.service: private-link
ms.topic: quickstart
ms.date: 02/03/2023
ms.author: allensu
ms.devlang: azurecli
ms.custom: mode-api, devx-track-azurecli, template-quickstart
#Customer intent: As someone with a basic network background, but is new to Azure, I want to create an Azure private link service using Azure CLI
---

# Quickstart: Create a Private Link service using Azure CLI

Get started creating a Private Link service that refers to your service.  Give Private Link access to your service or resource deployed behind an Azure Standard Load Balancer.  Users of your service have private access from their virtual network.

:::image type="content" source="./media/create-private-link-service-portal/private-link-service-qs-resources.png" alt-text="Diagram of resources created in private endpoint quickstart.":::

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)] 

- This quickstart requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [az group create](/cli/azure/group#az-group-create):

* Named **test-rg**. 

* In the **eastus2** location.

```azurecli-interactive
az group create \
    --name test-rg \
    --location eastus2

```

## Create an internal load balancer

In this section, you create a virtual network and an internal Azure Load Balancer.

### Virtual network

In this section, you create a virtual network and subnet to host the load balancer that accesses your Private Link service.

Create a virtual network using [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create):

* Named **vnet-1**.

* Address prefix of **10.0.0.0/16**.

* Subnet named **subnet-1**.

* Subnet prefix of **10.0.0.0/24**.

* In the **test-rg** resource group.

* Location of **eastus2**.

* Disable the network policy for private link service on the subnet.

```azurecli-interactive
az network vnet create \
    --resource-group test-rg \
    --location eastus2 \
    --name vnet-1 \
    --address-prefixes 10.0.0.0/16 \
    --subnet-name subnet-1 \
    --subnet-prefixes 10.0.0.0/24
```

### Create standard load balancer

This section details how you can create and configure the following components of the load balancer:

  * A frontend IP pool that receives the incoming network traffic on the load balancer.

  * A backend IP pool where the frontend pool sends the load balanced network traffic.

  * A health probe that determines health of the backend VM instances.

  * A load balancer rule that defines how traffic is distributed to the VMs.

### Create the load balancer resource

Create a public load balancer with [az network lb create](/cli/azure/network/lb#az-network-lb-create):

* Named **load-balancer**.

* A frontend pool named **frontend**.

* A backend pool named **backend-pool**.

* Associated with the virtual network **vnet-1**.

* Associated with the backend subnet **subnet-1**.

```azurecli-interactive
az network lb create \
    --resource-group test-rg \
    --name load-balancer \
    --sku Standard \
    --vnet-name vnet-1 \
    --subnet subnet-1 \
    --frontend-ip-name frontend \
    --backend-pool-name backend-pool
```

### Create the health probe

A health probe checks all virtual machine instances to ensure they can send network traffic. 

A virtual machine with a failed probe check is removed from the load balancer. The virtual machine is added back into the load balancer when the failure is resolved.

Create a health probe with [az network lb probe create](/cli/azure/network/lb/probe#az-network-lb-probe-create):

* Monitors the health of the virtual machines.

* Named **health-probe**.

* Protocol **TCP**.

* Monitoring **Port 80**.

```azurecli-interactive
az network lb probe create \
    --resource-group test-rg \
    --lb-name load-balancer \
    --name health-probe \
    --protocol tcp \
    --port 80
```

### Create the load balancer rule

A load balancer rule defines:

* Frontend IP configuration for the incoming traffic.

* The backend IP pool to receive the traffic.

* The required source and destination port. 

Create a load balancer rule with [az network lb rule create](/cli/azure/network/lb/rule#az-network-lb-rule-create):

* Named **http-rule**

* Listening on **Port 80** in the frontend pool **frontend**.

* Sending load-balanced network traffic to the backend address pool **backend-pool** using **Port 80**. 

* Using health probe **health-probe**.

* Protocol **TCP**.

* Idle timeout of **15 minutes**.

* Enable TCP reset.

```azurecli-interactive
az network lb rule create \
    --resource-group test-rg \
    --lb-name load-balancer \
    --name http-rule \
    --protocol tcp \
    --frontend-port 80 \
    --backend-port 80 \
    --frontend-ip-name frontend \
    --backend-pool-name backend-pool \
    --probe-name health-probe \
    --idle-timeout 15 \
    --enable-tcp-reset true
```

## Disable network policy

Before a private link service can be created in the virtual network, the setting `privateLinkServiceNetworkPolicies` must be disabled.

* Disable the network policy with [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update).

```azurecli-interactive
az network vnet subnet update \
    --name subnet-1 \
    --vnet-name vnet-1 \
    --resource-group test-rg \
    --disable-private-link-service-network-policies yes
```

## Create a private link service

In this section, create a private link service that uses the Azure Load Balancer created in the previous step.

Create a private link service using a standard load balancer frontend IP configuration with [az network private-link-service create](/cli/azure/network/private-link-service#az-network-private-link-service-create):

* Named **private-link-service**.

* In virtual network **vnet-1**.

* Associated with standard load balancer **load-balancer** and frontend configuration **frontend**.

* In the **eastus2** location.
 
```azurecli-interactive
az network private-link-service create \
    --resource-group test-rg \
    --name private-link-service \
    --vnet-name vnet-1 \
    --subnet subnet-1 \
    --lb-name load-balancer \
    --lb-frontend-ip-configs frontend \
    --location eastus2
```

Your private link service is created and can receive traffic. If you want to see traffic flows, configure your application behind your standard load balancer.

## Create private endpoint

In this section, you map the private link service to a private endpoint. A virtual network contains the private endpoint for the private link service. This virtual network contains the resources that access your private link service.

### Create private endpoint virtual network

Create a virtual network using [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create):

* Named **vnet-pe**.

* Address prefix of **10.1.0.0/16**.

* Subnet named **subnet-pe**.

* Subnet prefix of **10.1.0.0/24**.

* In the **test-rg** resource group.

* Location of **eastus2**.

```azurecli-interactive
az network vnet create \
    --resource-group test-rg \
    --location eastus2 \
    --name vnet-pe \
    --address-prefixes 10.1.0.0/16 \
    --subnet-name subnet-pe \
    --subnet-prefixes 10.1.0.0/24
```

### Create endpoint and connection

* Use [az network private-link-service show](/cli/azure/network/private-link-service#az-network-private-link-service-show) to get the resource ID of the private link service. The command places the resource ID into a variable for later use.

* Use [az network private-endpoint create](/cli/azure/network/private-endpoint#az-network-private-endpoint-create) to create the private endpoint in the virtual network you created previously.

* Named **private-endpoint**.

* In the **test-rg** resource group.

* Connection name **connection-1**.

* Location of **eastus2**.

* In virtual network **vnet-pe** and subnet **subnet-pe**.

```azurecli-interactive
export resourceid=$(az network private-link-service show \
    --name private-link-service \
    --resource-group test-rg \
    --query id \
    --output tsv)

az network private-endpoint create \
    --connection-name connection-1 \
    --name private-endpoint \
    --private-connection-resource-id $resourceid \
    --resource-group test-rg \
    --subnet subnet-pe \
    --manual-request false \
    --vnet-name vnet-pe 

```

## Clean up resources

When no longer needed, use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, private link service, load balancer, and all related resources.

```azurecli-interactive
az group delete \
    --name test-rg 
```

## Next steps

In this quickstart, you:

* Created a virtual network and internal Azure Load Balancer.

* Created a private link service

To learn more about Azure Private endpoint, continue to:
> [!div class="nextstepaction"]
> [Quickstart: Create a Private Endpoint using Azure CLI](create-private-endpoint-cli.md)
