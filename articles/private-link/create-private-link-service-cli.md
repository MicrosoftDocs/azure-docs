---
title: 'Quickstart - Create an Azure Private Link service using Azure CLI'
description: In this quickstart, learn how to create an Azure Private Link service using Azure CLI
services: private-link
author: asudbring
# Customer intent: As someone with a basic network background, but is new to Azure, I want to create an Azure private link service using Azure CLI
ms.service: private-link
ms.topic: quickstart
ms.date: 01/22/2021
ms.author: allensu

---
# Quickstart: Create a Private Link service using Azure CLI

Get started creating a Private Link service that refers to your service.  Give Private Link access to your service or resource deployed behind an Azure Standard Load Balancer.  Users of your service have private access from their virtual network.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)] 

- This quickstart requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [az group create](/cli/azure/group#az_group_create):

* Named **CreatePrivLinkService-rg**. 
* In the **eastus** location.

```azurecli-interactive
  az group create \
    --name CreatePrivLinkService-rg \
    --location eastus2

```

## Create an internal load balancer

In this section, you'll create a virtual network and an internal Azure Load Balancer.

### Virtual network

In this section, you create a virtual network and subnet to host the load balancer that accesses your Private Link service.

Create a virtual network using [az network vnet create](/cli/azure/network/vnet#az_network_vnet_create):

* Named **myVNet**.
* Address prefix of **10.1.0.0/16**.
* Subnet named **mySubnet**.
* Subnet prefix of **10.1.0.0/24**.
* In the **CreatePrivLinkService-rg** resource group.
* Location of **eastus2**.
* Disable the network policy for private link service on the subnet.

```azurecli-interactive
  az network vnet create \
    --resource-group CreatePrivLinkService-rg \
    --location eastus2 \
    --name myVNet \
    --address-prefixes 10.1.0.0/16 \
    --subnet-name mySubnet \
    --subnet-prefixes 10.1.0.0/24

```

To update the subnet to disable private link service network policies, use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_update):

```azurecli-interactive
az network vnet subnet update \
    --name mySubnet \
    --resource-group CreatePrivLinkService-rg \
    --vnet-name myVNet \
    --disable-private-link-service-network-policies true
```

### Create standard load balancer

This section details how you can create and configure the following components of the load balancer:

  * A frontend IP pool that receives the incoming network traffic on the load balancer.
  * A backend IP pool where the frontend pool sends the load balanced network traffic.
  * A health probe that determines health of the backend VM instances.
  * A load balancer rule that defines how traffic is distributed to the VMs.

### Create the load balancer resource

Create a public load balancer with [az network lb create](/cli/azure/network/lb#az_network_lb_create):

* Named **myLoadBalancer**.
* A frontend pool named **myFrontEnd**.
* A backend pool named **myBackEndPool**.
* Associated with the virtual network **myVNet**.
* Associated with the backend subnet **mySubnet**.

```azurecli-interactive
  az network lb create \
    --resource-group CreatePrivLinkService-rg \
    --name myLoadBalancer \
    --sku Standard \
    --vnet-name myVnet \
    --subnet mySubnet \
    --frontend-ip-name myFrontEnd \
    --backend-pool-name myBackEndPool
```

### Create the health probe

A health probe checks all virtual machine instances to ensure they can send network traffic. 

A virtual machine with a failed probe check is removed from the load balancer. The virtual machine is added back into the load balancer when the failure is resolved.

Create a health probe with [az network lb probe create](/cli/azure/network/lb/probe#az_network_lb_probe_create):

* Monitors the health of the virtual machines.
* Named **myHealthProbe**.
* Protocol **TCP**.
* Monitoring **Port 80**.

```azurecli-interactive
  az network lb probe create \
    --resource-group CreatePrivLinkService-rg \
    --lb-name myLoadBalancer \
    --name myHealthProbe \
    --protocol tcp \
    --port 80
```

### Create the load balancer rule

A load balancer rule defines:

* Frontend IP configuration for the incoming traffic.
* The backend IP pool to receive the traffic.
* The required source and destination port. 

Create a load balancer rule with [az network lb rule create](/cli/azure/network/lb/rule#az_network_lb_rule_create):

* Named **myHTTPRule**
* Listening on **Port 80** in the frontend pool **myFrontEnd**.
* Sending load-balanced network traffic to the backend address pool **myBackEndPool** using **Port 80**. 
* Using health probe **myHealthProbe**.
* Protocol **TCP**.
* Idle timeout of **15 minutes**.
* Enable TCP reset.

```azurecli-interactive
  az network lb rule create \
    --resource-group CreatePrivLinkService-rg \
    --lb-name myLoadBalancer \
    --name myHTTPRule \
    --protocol tcp \
    --frontend-port 80 \
    --backend-port 80 \
    --frontend-ip-name myFrontEnd \
    --backend-pool-name myBackEndPool \
    --probe-name myHealthProbe \
    --idle-timeout 15 \
    --enable-tcp-reset true
```

## Create a private link service

In this section, create a private link service that uses the Azure Load Balancer created in the previous step.

Create a private link service using a standard load balancer frontend IP configuration with [az network private-link-service create](/cli/azure/network/private-link-service#az_network_private_link_service_create):

* Named **myPrivateLinkService**.
* In virtual network **myVNet**.
* Associated with standard load balancer **myLoadBalancer** and frontend configuration **myFrontEnd**.
* In the **eastus2** location.
 
```azurecli-interactive
az network private-link-service create \
    --resource-group CreatePrivLinkService-rg \
    --name myPrivateLinkService \
    --vnet-name myVNet \
    --subnet mySubnet \
    --lb-name myLoadBalancer \
    --lb-frontend-ip-configs myFrontEnd \
    --location eastus2
```

Your private link service is created and can receive traffic. If you want to see traffic flows, configure your application behind your standard load balancer.


## Create private endpoint

In this section, you'll map the private link service to a private endpoint. A virtual network contains the private endpoint for the private link service. This virtual network contains the resources that will access your private link service.

### Create private endpoint virtual network

Create a virtual network using [az network vnet create](/cli/azure/network/vnet#az_network_vnet_create):

* Named **myVNetPE**.
* Address prefix of **11.1.0.0/16**.
* Subnet named **mySubnetPE**.
* Subnet prefix of **11.1.0.0/24**.
* In the **CreatePrivLinkService-rg** resource group.
* Location of **eastus2**.

```azurecli-interactive
  az network vnet create \
    --resource-group CreatePrivLinkService-rg \
    --location eastus2 \
    --name myVNetPE \
    --address-prefixes 11.1.0.0/16 \
    --subnet-name mySubnetPE \
    --subnet-prefixes 11.1.0.0/24
```

To update the subnet to disable private endpoint network policies, use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_update):

```azurecli-interactive
az network vnet subnet update \
    --name mySubnetPE \
    --resource-group CreatePrivLinkService-rg \
    --vnet-name myVNetPE \
    --disable-private-endpoint-network-policies true
```

### Create endpoint and connection

* Use [az network private-link-service show](/cli/azure/network/private-link-service#az_network_private_link_service_show) to get the resource ID of the private link service. The command places the resource ID into a variable for later use.

* Use [az network private-endpoint create](/cli/azure/network/private-endpoint#az_network_private_endpoint_create) to create the private endpoint in the virtual network you created previously.

* Named **MyPrivateEndpoint**.
* In the **CreatePrivLinkService-rg** resource group.
* Connection name **myPEconnectiontoPLS**.
* Location of **eastus2**.
* In virtual network **myVNetPE** and subnet **mySubnetPE**.

```azurecli-interactive
  export resourceid=$(az network private-link-service show \
    --name myPrivateLinkService \
    --resource-group CreatePrivLinkService-rg \
    --query id \
    --output tsv)

  az network private-endpoint create \
    --connection-name myPEconnectiontoPLS \
    --name myPrivateEndpoint \
    --private-connection-resource-id $resourceid \
    --resource-group CreatePrivLinkService-rg \
    --subnet mySubnetPE \
    --manual-request false \
    --vnet-name myVNetPE 

```

## Clean up resources

When no longer needed, use the [az group delete](/cli/azure/group#az_group_delete) command to remove the resource group, private link service, load balancer, and all related resources.

```azurecli-interactive
  az group delete \
    --name CreatePrivLinkService-rg 
```

## Next steps

In this quickstart, you:

* Created a virtual network and internal Azure Load Balancer.
* Created a private link service

To learn more about Azure Private endpoint, continue to:
> [!div class="nextstepaction"]
> [Quickstart: Create a Private Endpoint using Azure CLI](create-private-endpoint-cli.md)
