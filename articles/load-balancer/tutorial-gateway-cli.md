---
title: 'Tutorial: Create a gateway load balancer - Azure CLI'
titlesuffix: Azure Load Balancer
description: Use this tutorial to learn how to create a gateway load balancer using the Azure CLI.
author: asudbring
ms.author: allensu
ms.service: load-balancer
ms.topic: tutorial
ms.date: 10/6/2021
ms.custom: template-tutorial #Required; leave this attribute/value as-is.
---

# Tutorial: Create a gateway load balancer using the Azure CLI

Azure Load Balancer consists of a standard, basic, and gateway SKU. The gateway SKU is used for Network Virtual Appliances (NVA). Use the gateway SKU for scenarios that require high performance and high scalability of NVAs.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Register preview feature.
> * Create virtual network.
> * Create network security group.
> * Create a gateway load balancer.

> [!IMPORTANT]
> Gateway Azure Load Balancer is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

- This tutorial requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

- An Azure account with an active subscription.[Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Register preview feature

As part of the public preview of gateway load balancer, the provider must be registered in your Azure subscription.

Use [az feature register](/cli/azure/feature#az_feature_register) to register the **AllowGatewayLoadBalancer** provider feature:

```azurecli-interactive
  az feature register \
    --name AllowGatewayLoadBalancer \
    --namespace Microsoft.Network
```

Use [az provider register](/cli/azure/provider#az_provider_register) to register the **Microsoft.Network** resource provider:

```azurecli-interactive
  az provider register \
    --namespace Microsoft.Network
```

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [az group create](/cli/azure/group#az_group_create):

```azurecli-interactive
  az group create \
    --name TutorGwLB-rg \
    --location eastus

```

## Configure virtual network

A virtual network is needed for the resources that are in the backend pool of the gateway load balancer.  

### Create virtual network

Use [az network vnet create](/cli/azure/network/vnet#az_network_vnet_create) to create the virtual network.

```azurecli-interactive
  az network vnet create \
    --resource-group TutorGwLB-rg \
    --location eastus \
    --name myVNet \
    --address-prefixes 10.1.0.0/16 \
    --subnet-name myBackendSubnet \
    --subnet-prefixes 10.1.0.0/24
```

### Create bastion public IP address

Use [az network public-ip create](/cli/azure/network/public-ip#az_network_public_ip_create) to create a public IP address for the Azure Bastion host

```azurecli-interactive
az network public-ip create \
    --resource-group TutorGwLB-rg \
    --name myBastionIP \
    --sku Standard \
    --zone 1 2 3
```

### Create bastion subnet

Use [az network vnet subnet create](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_create) to create the bastion subnet.

```azurecli-interactive
az network vnet subnet create \
    --resource-group TutorGwLB-rg \
    --name AzureBastionSubnet \
    --vnet-name myVNet \
    --address-prefixes 10.1.1.0/27
```

### Create bastion host

Use [az network bastion create](/cli/azure/network/bastion#az_network_bastion_create) to deploy a bastion host for secure management of resources in virtual network.

```azurecli-interactive
az network bastion create \
    --resource-group TutorGwLB-rg \
    --name myBastionHost \
    --public-ip-address myBastionIP \
    --vnet-name myVNet \
    --location eastus
```

It can take a few minutes for the Azure Bastion host to deploy.

## Configure NSG

Use the following example to create a network security group. You'll configure the NSG rules needed for network traffic in the virtual network created previously.

### Create NSG

Use [az network nsg create](/cli/azure/network/nsg#az_network_nsg_create) to create the NSG.

```azurecli-interactive
  az network nsg create \
    --resource-group TutorGwLB-rg \
    --name myNSG
```

### Create NSG Rules

Use [az network nsg rule create](/cli/azure/network/nsg/rule#az_network_nsg_rule_create) to create three rules for the NSG.

```azurecli-interactive
  az network nsg rule create \
    --resource-group TutorGwLB-rg \
    --nsg-name myNSG \
    --name myNSGRule-AllowAll \
    --protocol 'All' \
    --direction inbound \
    --source-address-prefix '0.0.0.0/0' \
    --source-port-range '*' \
    --destination-address-prefix '0.0.0.0/0' \
    --destination-port-range '*' \
    --access allow \
    --priority 100

  az network nsg rule create \
    --resource-group TutorGwLB-rg \
    --nsg-name myNSG \
    --name myNSGRule-AllowAll-TCP-Out \
    --protocol 'TCP' \
    --direction outbound \
    --source-address-prefix '0.0.0.0/0' \
    --source-port-range '*' \
    --destination-address-prefix '0.0.0.0/0' \
    --destination-port-range '*' \
    --access allow \
    --priority 100
```

## Configure gateway load balancer

In this section, you'll create the configuration and deploy the gateway load balancer.  

### Create load balancer

To create the load balancer, use [az network lb create](/cli/azure/network/lb#az_network_lb_create).

```azurecli-interactive
  az network lb create \
    --resource-group TutorGwLB-rg \
    --name myLoadBalancer-gw \
    --sku Gateway \
    --vnet-name myVNet \
    --subnet myBackendSubnet \
    --address-pool myBackendPool \
    --frontend-ip-name myFrontEnd
```

### Create tunnel interfaces

A internal interface is automatically created with Azure CLI with the **`--identifier`** of **800** and **`--port`** of **10800**.

You'll use [az network lb address-pool tunnel-interface add](/cli/azure/network/lb/address-pool/tunnel-interface#az_network_lb_address_pool_tunnel_interface_add) to create external tunnel interface for the load balancer. 

```azurecli-interactive
  az network lb address-pool tunnel-interface add \
    --address-pool myBackEndPool \
    --identifier '801' \
    --lb-name myLoadBalancer-gw \
    --protocol VXLAN \
    --resource-group TutorGwLB-rg \
    --type External \
    --port '10801'
```

### Create health probe
A health probe is required to monitor the health of the backend instances in the load balancer. Use [az network lb probe create](/cli/azure/network/lb/probe#az_network_lb_probe_create) to create the health probe.

```azurecli-interactive
  az network lb probe create \
    --resource-group TutorGwLB-rg \
    --lb-name myLoadBalancer-gw \
    --name myHealthProbe \
    --protocol http \
    --port 80 \
    --path '/' \
    --interval '360' \
    --threshold '5'
    
```

### Create tunnel interfaces
You'll use [az network lb address-pool tunnel-interface add](/cli/azure/network/lb/address-pool/tunnel-interface#az_network_lb_address_pool_tunnel_interface_add) to create two tunnel interfaces for the load balancer. 

```azurecli-interactive
  az network lb address-pool tunnel-interface add \
    --address-pool myBackEndPool \
    --identifier '800' \
    --lb-name myLoadBalancer-gw \
    --protocol Vxlan \
    --resource-group TutorGwLB-rg \
    --type Internal \
    --port '2000'

  az network lb address-pool tunnel-interface add \
    --address-pool myBackEndPool \
    --identifier '801' \
    --lb-name myLoadBalancer-gw \
    --protocol Vxlan \
    --resource-group TutorGwLB-rg \
    --type External \
    --port '2001'
```

### Create load-balancing rule

Traffic destined for the backend instances is routed with a load-balancing rule. Use [New-AzLoadBalancerRuleConfig](/powershell/module/az.network/new-azloadbalancerruleconfig)  to create the load-balancing rule.

```azurecli-interactive
  az network lb rule create \
    --resource-group TutorGwLB-rg \
    --lb-name myLoadBalancer-gw \
    --name myLBRule \
    --protocol All \
    --frontend-port 0 \
    --backend-port 0 \
    --frontend-ip-name myFrontEnd \
    --backend-pool-name myBackEndPool \
    --probe-name myHealthProbe
```

The load balancer is ready for NVAs in the backend pool.

## Clean up resources

When no longer needed, you can use the [az group delete](/cli/azure/group#az_group_delete) command to remove the resource group, load balancer, and the remaining resources.

```azurecli-interactive
  az group delete \
    --name TutorGwLB-rg
```

## Next steps

Create Network Virtual Appliances in Azure. 

When creating the NVAs, choose the resources created in this tutorial:

* Virtual network

* Subnet

* Network security group

* Gateway load balancer

Advance to the next article to learn how to create a cross-region Azure Load Balancer.
> [!div class="nextstepaction"]
> [Cross-region load balancer](tutorial-cross-region-powershell.md)
