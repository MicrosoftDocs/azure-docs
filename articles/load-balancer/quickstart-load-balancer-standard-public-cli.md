---
title: "Quickstart: Create a public load balancer - Azure CLI"
titleSuffix: Azure Load Balancer
description: This quickstart shows how to create a public load balancer using the Azure CLI.
author: mbender-ms
ms.service: azure-load-balancer
ms.topic: quickstart
ms.date: 08/27/2026
ms.author: mbender
ms.custom:
  - mvc
  - devx-track-azurecli
  - mode-api
  - template-quickstart
  - engagement-fy23
  - sfi-image-nochange
#Customer intent: I want to create a load balancer so that I can load balance internet traffic to VMs.
# Customer intent: As a cloud administrator, I want to create a public load balancer using the Azure CLI, so that I can efficiently distribute internet traffic across multiple virtual machines.
---

# Quickstart: Create a public load balancer to load balance VMs by using Azure CLI

Get started with Azure Load Balancer by using Azure CLI to create a public load balancer and two virtual machines. Along with these resources, you deploy Azure Bastion, NAT Gateway, a virtual network, and the required subnets.

:::image type="content" source="media/quickstart-load-balancer-standard-public-portal/public-load-balancer-resources.png" alt-text="Diagram of resources deployed for a standard public load balancer." lightbox="media/quickstart-load-balancer-standard-public-portal/public-load-balancer-resources.png":::

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This quickstart requires version 2.0.28 or later of Azure CLI. If you're using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

An Azure resource group is a logical container into which you deploy and manage Azure resources.

Create a resource group by using [az group create](/cli/azure/group#az-group-create):

```azurecli
  az group create \
    --name load-balancer-cli-rg \
    --location eastus
```

## Create a virtual network 

Before you deploy VMs and test your load balancer, create the supporting virtual network and subnet.

Create a virtual network by using [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create). The virtual network and subnet contain the resources deployed later in this article.

```azurecli
  az network vnet create \
    --resource-group load-balancer-cli-rg \
    --location eastus \
    --name lb-vnet \
    --address-prefixes 10.1.0.0/16 \
    --subnet-name backend-subnet \
    --subnet-prefixes 10.1.0.0/24
```

## Create a public IP address

To access your web app on the Internet, you need a public IP address for the load balancer. 

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create the public IP for the load balancer frontend.

```azurecli
  az network public-ip create \
    --resource-group load-balancer-cli-rg \
    --name lb-frontend-ip \
    --sku Standard \
    --zone 1 2 3
```

To create a zonal public IP address in Zone 1 instead, use the following command:

```azurecli
  az network public-ip create \
    --resource-group load-balancer-cli-rg \
    --name lb-frontend-ip \
    --sku Standard \
    --zone 1
```

## Create a load balancer

This section explains how to create and configure the following components of the load balancer:

  * A frontend IP pool that receives the incoming network traffic on the load balancer

  * A backend IP pool where the frontend pool sends the load balanced network traffic

  * A health probe that determines the health of the backend VM instances

  * A load balancer rule that defines how traffic is distributed to the VMs

### Create the load balancer resource

Create a public load balancer with [az network lb create](/cli/azure/network/lb#az-network-lb-create):

```azurecli
  az network lb create \
    --resource-group load-balancer-cli-rg \
    --name load-balancer \
    --sku Standard \
    --public-ip-address lb-frontend-ip \
    --frontend-ip-name lb-frontend \
    --backend-pool-name lb-backend-pool
```

If you create a zonal public IP, specify the zone when creating the public load balancer.

```azurecli
  az network lb create \
    --resource-group load-balancer-cli-rg \
    --name load-balancer \
    --sku Standard \
    --public-ip-address lb-frontend-ip \
    --frontend-ip-name lb-frontend \
    --public-ip-zone 1 \
    --backend-pool-name lb-backend-pool
```

### Create the health probe

A health probe checks all virtual machine instances to ensure they can send network traffic. 

A virtual machine with a failed probe check is removed from the load balancer. The virtual machine is added back into the load balancer when the failure is resolved.

Create a health probe with [az network lb probe create](/cli/azure/network/lb/probe#az-network-lb-probe-create):

```azurecli
  az network lb probe create \
    --resource-group load-balancer-cli-rg \
    --lb-name load-balancer \
    --name lb-health-probe \
    --protocol tcp \
    --port 80
```

### Create the load balancer rule

A load balancer rule defines:

* Frontend IP configuration for the incoming traffic

* The backend IP pool to receive the traffic

* The required source and destination port

Create a load balancer rule with [az network lb rule create](/cli/azure/network/lb/rule#az-network-lb-rule-create):

```azurecli
  az network lb rule create \
    --resource-group load-balancer-cli-rg \
    --lb-name load-balancer \
    --name lb-HTTP-rule \
    --protocol tcp \
    --frontend-port 80 \
    --backend-port 80 \
    --frontend-ip-name lb-frontend \
    --backend-pool-name lb-backend-pool \
    --probe-name lb-health-probe \
    --disable-outbound-snat true \
    --idle-timeout 15 \
    --enable-tcp-reset true
```

## Create a network security group

For a standard load balancer, the VMs in the backend pool are required to have network interfaces that belong to a network security group. 

Use [az network nsg create](/cli/azure/network/nsg#az-network-nsg-create) to create the network security group:

```azurecli
  az network nsg create \
    --resource-group load-balancer-cli-rg \
    --name lb-nsg
```

### Create a network security group rule

Create a network security group rule by using [az network nsg rule create](/cli/azure/network/nsg/rule#az-network-nsg-rule-create).

```azurecli
  az network nsg rule create \
    --resource-group load-balancer-cli-rg \
    --nsg-name lb-nsg \
    --name lb-nsg-rule \
    --protocol '*' \
    --direction inbound \
    --source-address-prefix '*' \
    --source-port-range '*' \
    --destination-address-prefix '*' \
    --destination-port-range 80 \
    --access allow \
    --priority 200
```

## Create a bastion host

In this section, you create the resources for Azure Bastion. Use Azure Bastion to securely manage the virtual machines in the backend pool of the load balancer.

> [!IMPORTANT]
> [!INCLUDE [Pricing](~/reusable-content/ce-skilling/azure/includes/bastion-pricing.md)]

### Create a public IP address

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a public IP address for the bastion host. The bastion host uses the public IP for secure access to the virtual machine resources.

```azurecli
  az network public-ip create \
    --resource-group load-balancer-cli-rg \
    --name lb-vnet-bastion-ip \
    --sku Standard \
    --zone 1 2 3
```
### Create a bastion subnet

Use [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create) to create a bastion subnet. The bastion host uses the bastion subnet to access the virtual network.

```azurecli
  az network vnet subnet create \
    --resource-group load-balancer-cli-rg \
    --name AzureBastionSubnet \
    --vnet-name lb-vnet \
    --address-prefixes 10.1.1.0/26
```

### Create bastion host

Use [az network bastion create](/cli/azure/network/bastion#az-network-bastion-create) to create a bastion host. The bastion host connects securely to the virtual machine resources that you create later in this article.

```azurecli
  az network bastion create \
    --resource-group load-balancer-cli-rg \
    --name lb-vnet-bastion \
    --public-ip-address lb-vnet-bastion-ip \
    --vnet-name lb-vnet \
    --sku Basic \
    --location eastus
```

It can take a few minutes for the Azure Bastion host to deploy.

## Create backend servers

In this section, you create:

* Two network interfaces for the virtual machines

* Two virtual machines to use as backend servers for the load balancer

### Create network interfaces for the virtual machines

Create two network interfaces by using [az network nic create](/cli/azure/network/nic#az-network-nic-create):

```azurecli
  array=(lb-VM1-nic lb-VM2-nic)
  for vmnic in "${array[@]}"
  do
    az network nic create \
        --resource-group load-balancer-cli-rg \
        --name $vmnic \
        --vnet-name lb-vnet \
        --subnet backend-subnet \
        --network-security-group lb-nsg
  done
```

### Create virtual machines

Create the virtual machines by using [az vm create](/cli/azure/vm#az-vm-create):

```azurecli
  az vm create \
    --resource-group load-balancer-cli-rg \
    --name lb-VM1 \
    --nics lb-VM1-nic \
    --image Win2022AzureEditionCore \
    --size Standard_D2s_v3 \
    --admin-username azureuser \
    --zone 1 \
    --no-wait
```

```azurecli
  az vm create \
    --resource-group load-balancer-cli-rg \
    --name lb-VM2 \
    --nics lb-VM2-nic \
    --image Win2022AzureEditionCore \
    --size Standard_D2s_v3 \
    --admin-username azureuser \
    --zone 2 \
    --no-wait
```

It can take a few minutes for the VMs to deploy. You can continue to the next steps while the VMs are creating.

[!INCLUDE [ephemeral-ip-note.md](~/reusable-content/ce-skilling/azure/includes/ephemeral-ip-note.md)]

### Add virtual machines to load balancer backend pool

Add the virtual machines to the backend pool by using [az network nic ip-config address-pool add](/cli/azure/network/nic/ip-config/address-pool#az-network-nic-ip-config-address-pool-add):

```azurecli
  array=(lb-VM1-nic lb-VM2-nic)
  for vmnic in "${array[@]}"
  do
    az network nic ip-config address-pool add \
     --address-pool lb-backend-pool \
     --ip-config-name ipconfig1 \
     --nic-name $vmnic \
     --resource-group load-balancer-cli-rg \
     --lb-name load-balancer
  done
```

## Create NAT gateway

To provide outbound internet access for resources in the backend pool, create a NAT gateway.  

### Create public IP

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a single IP for the outbound connectivity.  

```azurecli
  az network public-ip create \
    --resource-group load-balancer-cli-rg \
    --name nat-gw-public-ip \
    --sku Standard \
    --zone 1 2 3
```

To create a zonal public IP address in Zone 1 instead, use the following command:

```azurecli
  az network public-ip create \
    --resource-group load-balancer-cli-rg \
    --name nat-gw-public-ip \
    --sku Standard \
    --zone 1
```

### Create NAT gateway resource

Use [az network nat gateway create](/cli/azure/network/nat#az-network-nat-gateway-create) to create the NAT gateway resource. The public IP created in the previous step is associated with the NAT gateway.

```azurecli
  az network nat gateway create \
    --resource-group load-balancer-cli-rg \
    --name lb-nat-gateway \
    --public-ip-addresses nat-gw-public-ip \
    --idle-timeout 10
```

### Associate NAT gateway with subnet

Configure the source subnet in virtual network to use a specific NAT gateway resource with [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update).

```azurecli
  az network vnet subnet update \
    --resource-group load-balancer-cli-rg \
    --vnet-name lb-vnet \
    --name backend-subnet \
    --nat-gateway lb-nat-gateway
```

## Install IIS

Use [az vm extension set](/cli/azure/vm/extension#az-vm-extension-set) to install IIS on the virtual machines and set the default website to the computer name.

```azurecli
  array=(lb-VM1 lb-VM2)
    for vm in "${array[@]}"
    do
     az vm extension set \
       --publisher Microsoft.Compute \
       --version 1.8 \
       --name CustomScriptExtension \
       --vm-name $vm \
       --resource-group load-balancer-cli-rg \
       --settings '{"commandToExecute":"powershell Add-WindowsFeature Web-Server; powershell Add-Content -Path \"C:\\inetpub\\wwwroot\\Default.htm\" -Value $($env:computername)"}'
  done
```

## Test the load balancer

To get the public IP address of the load balancer, use [az network public-ip show](/cli/azure/network/public-ip#az-network-public-ip-show). 

Copy the public IP address, and then paste it into the address bar of your browser.

```azurecli
  az network public-ip show \
    --resource-group load-balancer-cli-rg \
    --name lb-frontend-ip \
    --query ipAddress \
    --output tsv
```
:::image type="content" source="./media/load-balancer-standard-public-cli/running-nodejs-app.png" alt-text="Screenshot of browser window displaying the load balancer test page." border="true":::

## Clean up resources

When you no longer need the resources, use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, load balancer, and all related resources.

```azurecli
  az group delete \
    --name load-balancer-cli-rg
```

## Next steps

In this quickstart:

* You created a standard public load balancer.

* You attached two virtual machines.

* You configured the load balancer traffic rule and health probe.

* You tested the load balancer.

To learn more about Azure Load Balancer, continue to:
> [!div class="nextstepaction"]
> [What is Azure Load Balancer?](load-balancer-overview.md)
