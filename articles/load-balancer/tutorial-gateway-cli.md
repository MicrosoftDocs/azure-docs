---
title: 'Tutorial: Create a gateway load balancer - Azure CLI'
titleSuffix: Azure Load Balancer
description: Use this tutorial to learn how to create a gateway load balancer using the Azure CLI.
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: tutorial
ms.date: 06/27/2023
ms.custom: template-tutorial, devx-track-azurecli, engagement-fy23
ms.devlang: azurecli
---

# Tutorial: Create a gateway load balancer using the Azure CLI

Azure Load Balancer consists of Standard, Basic, and Gateway SKUs. Gateway Load Balancer is used for transparent insertion of Network Virtual Appliances (NVA). Use Gateway Load Balancer for scenarios that require high performance and high scalability of NVAs.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create virtual network.
> * Create network security group.
> * Create a gateway load balancer.
> * Chain a load balancer frontend to gateway load balancer.

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This tutorial requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

- An Azure account with an active subscription.[Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An existing public standard SKU Azure Load Balancer. For more information on creating a load balancer, see **[Create a public load balancer using the Azure CLI](quickstart-load-balancer-standard-public-cli.md)**.
    - For the purposes of this tutorial, the existing load balancer in the examples is named **myLoadBalancer**.

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [az group create](/cli/azure/group#az-group-create):

```azurecli-interactive
  az group create \
    --name TutorGwLB-rg \
    --location eastus

```

## Configure virtual network

A virtual network is needed for the resources that are in the backend pool of the gateway load balancer.  

### Create virtual network

Use [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create) to create the virtual network.

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

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a public IP address for the Azure Bastion host

```azurecli-interactive
az network public-ip create \
    --resource-group TutorGwLB-rg \
    --name myBastionIP \
    --sku Standard \
    --zone 1 2 3
```

### Create bastion subnet

Use [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create) to create the bastion subnet.

```azurecli-interactive
az network vnet subnet create \
    --resource-group TutorGwLB-rg \
    --name AzureBastionSubnet \
    --vnet-name myVNet \
    --address-prefixes 10.1.1.0/27
```

### Create bastion host

Use [az network bastion create](/cli/azure/network/bastion#az-network-bastion-create) to deploy a bastion host for secure management of resources in virtual network.

```azurecli-interactive
az network bastion create \
    --resource-group TutorGwLB-rg \
    --name myBastionHost \
    --public-ip-address myBastionIP \
    --vnet-name myVNet \
    --location eastus
```

It can take a few minutes for the Azure Bastion host to deploy.

> [!IMPORTANT]

> [!INCLUDE [Pricing](../../includes/bastion-pricing.md)]

>

## Configure NSG

Use the following example to create a network security group. You'll configure the NSG rules needed for network traffic in the virtual network created previously.

### Create NSG

Use [az network nsg create](/cli/azure/network/nsg#az-network-nsg-create) to create the NSG.

```azurecli-interactive
  az network nsg create \
    --resource-group TutorGwLB-rg \
    --name myNSG
```

### Create NSG Rules

Use [az network nsg rule create](/cli/azure/network/nsg/rule#az-network-nsg-rule-create) to create rules for the NSG.

```azurecli-interactive
  az network nsg rule create \
    --resource-group TutorGwLB-rg \
    --nsg-name myNSG \
    --name myNSGRule-AllowAll \
    --protocol '*' \
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

## Configure Gateway Load Balancer

In this section, you'll create the configuration and deploy the gateway load balancer.  

### Create Gateway Load Balancer

To create the load balancer, use [az network lb create](/cli/azure/network/lb#az-network-lb-create).

```azurecli-interactive
  az network lb create \
    --resource-group TutorGwLB-rg \
    --name myLoadBalancer-gw \
    --sku Gateway \
    --vnet-name myVNet \
    --subnet myBackendSubnet \
    --backend-pool-name myBackendPool \
    --frontend-ip-name myFrontEnd
```

### Create tunnel interface

An internal interface is automatically created with Azure CLI with the **`--identifier`** of **900** and **`--port`** of **10800**.

You'll use [az network lb address-pool tunnel-interface add](/cli/azure/network/lb/address-pool/tunnel-interface#az-network-lb-address-pool-tunnel-interface-add) to create external tunnel interface for the load balancer. 

```azurecli-interactive
  az network lb address-pool tunnel-interface add \
    --address-pool myBackEndPool \
    --identifier '901' \
    --lb-name myLoadBalancer-gw \
    --protocol VXLAN \
    --resource-group TutorGwLB-rg \
    --type External \
    --port '10801'
```

### Create health probe
A health probe is required to monitor the health of the backend instances in the load balancer. Use [az network lb probe create](/cli/azure/network/lb/probe#az-network-lb-probe-create) to create the health probe.

```azurecli-interactive
  az network lb probe create \
    --resource-group TutorGwLB-rg \
    --lb-name myLoadBalancer-gw \
    --name myHealthProbe \
    --protocol http \
    --port 80 \
    --path '/' \
    --interval '5' \
    --threshold '2'
    
```

### Create load-balancing rule

Traffic destined for the backend instances is routed with a load-balancing rule. Use [az network lb rule create](/cli/azure/network/lb/probe#az-network-lb-rule-create)  to create the load-balancing rule.

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

## Add network virtual appliances to the Gateway Load Balancer backend pool
Deploy NVAs through the Azure Marketplace. Once deployed, add the virtual machines to the backend pool with [az network nic ip-config address-pool add](/cli/azure/network/nic/ip-config/address-pool#az-network-nic-ip-config-address-pool-add).

## Chain load balancer frontend to Gateway Load Balancer

In this example, you'll chain the frontend of a standard load balancer to the gateway load balancer. 

You'll add the frontend to the frontend IP of an existing load balancer in your subscription.

Use [az network lb frontend-ip show](/cli/azure/network/lb/frontend-ip#az-az-network-lb-frontend-ip-show) to place the resource ID of your gateway load balancer frontend into a variable.

Use [az network lb frontend-ip update](/cli/azure/network/lb/frontend-ip#az-network-lb-frontend-ip-update) to chain the gateway load balancer frontend to your existing load balancer.

```azurecli-interactive
  feid=$(az network lb frontend-ip show \
    --resource-group TutorGwLB-rg \
    --lb-name myLoadBalancer-gw \
    --name myFrontend \
    --query id \
    --output tsv)

  az network lb frontend-ip update \
    --resource-group CreatePubLBQS-rg \
    --name myFrontendIP \
    --lb-name myLoadBalancer \
    --public-ip-address myPublicIP \
    --gateway-lb $feid

```

## Chain virtual machine to Gateway Load Balancer

Alternatively, you can chain a VM's NIC IP configuration to the gateway load balancer. 

You'll add the gateway load balancer's frontend to an existing VM's NIC IP configuration.

Use [az network lb frontend-ip show](/cli/azure/network/lb/frontend-ip#az-az-network-lb-frontend-ip-show) to place the resource ID of your gateway load balancer frontend into a variable.

Use [az network lb frontend-ip update](/cli/azure/network/nic/ip-config#az-network-nic-ip-config-update) to chain the gateway load balancer frontend to your existing VM's NIC IP configuration.

```azurecli-interactive
 feid=$(az network lb frontend-ip show \
    --resource-group TutorGwLB-rg \
    --lb-name myLoadBalancer-gw \
    --name myFrontend \
    --query id \
    --output tsv)
    
  az network nic ip-config update \
    --resource-group MyResourceGroup
    --nic-name MyNIC 
    --name MyIPconfig 
    --gateway-lb $feid

```

## Clean up resources

When no longer needed, you can use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, load balancer, and the remaining resources.

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

* Gateway Load Balancer

Advance to the next article to learn how to create a cross-region Azure Load Balancer.
> [!div class="nextstepaction"]
> [Cross-region load balancer](tutorial-cross-region-powershell.md)
