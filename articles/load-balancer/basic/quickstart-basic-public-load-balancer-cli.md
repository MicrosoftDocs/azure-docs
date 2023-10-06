---
title: 'Quickstart: Create a basic public load balancer - Azure CLI'
titleSuffix: Azure Load Balancer
description: Learn how to create a public basic SKU Azure Load Balancer in this quickstart using the Azure CLI.
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: quickstart
ms.date: 04/10/2023
ms.custom: template-quickstart, devx-track-azurecli
---

# Quickstart: Create a basic public load balancer using the Azure CLI

Get started with Azure Load Balancer by using the Azure portal to create a basic public load balancer and two virtual machines.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This quickstart requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

>[!NOTE]
>Standard SKU load balancer is recommended for production workloads. For more information about SKUs, see **[Azure Load Balancer SKUs](../skus.md)**.

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [az group create](/cli/azure/group#az-group-create):

```azurecli
  az group create \
    --name CreatePubLBQS-rg \
    --location eastus
```

## Create a virtual network 

Before you deploy VMs and test your load balancer, create the supporting virtual network and subnet.

Create a virtual network using [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create). The virtual network and subnet will contain the resources deployed later in this article.

```azurecli
  az network vnet create \
    --resource-group CreatePubLBQS-rg \
    --location eastus \
    --name myVNet \
    --address-prefixes 10.1.0.0/16 \
    --subnet-name myBackendSubnet \
    --subnet-prefixes 10.1.0.0/24
```

## Create a public IP address

To access your web app on the Internet, you need a public IP address for the load balancer. 

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create the public IP for the load balancer frontend.

```azurecli
  az network public-ip create \
    --resource-group CreatePubLBQS-rg \
    --name myPublicIP \
    --sku Basic
```

## Create a load balancer

This section details how you can create and configure the following components of the load balancer:

  * A frontend IP pool that receives the incoming network traffic on the load balancer

  * A backend IP pool where the frontend pool sends the load balanced network traffic

  * A health probe that determines health of the backend VM instances

  * A load balancer rule that defines how traffic is distributed to the VMs

### Create the load balancer resource

Create a public load balancer with [az network lb create](/cli/azure/network/lb#az-network-lb-create):

```azurecli
  az network lb create \
    --resource-group CreatePubLBQS-rg \
    --name myLoadBalancer \
    --sku Basic \
    --public-ip-address myPublicIP \
    --frontend-ip-name myFrontEnd \
    --backend-pool-name myBackEndPool
```

### Create the health probe

A health probe checks all virtual machine instances to ensure they can send network traffic. 

A virtual machine with a failed probe check is removed from the load balancer. The virtual machine is added back into the load balancer when the failure is resolved.

Create a health probe with [az network lb probe create](/cli/azure/network/lb/probe#az-network-lb-probe-create):

```azurecli
  az network lb probe create \
    --resource-group CreatePubLBQS-rg \
    --lb-name myLoadBalancer \
    --name myHealthProbe \
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
    --resource-group CreatePubLBQS-rg \
    --lb-name myLoadBalancer \
    --name myHTTPRule \
    --protocol tcp \
    --frontend-port 80 \
    --backend-port 80 \
    --frontend-ip-name myFrontEnd \
    --backend-pool-name myBackEndPool \
    --probe-name myHealthProbe \
    --idle-timeout 15
```

## Create a network security group

For a standard load balancer, the VMs in the backend address for are required to have network interfaces that belong to a network security group. 

Use [az network nsg create](/cli/azure/network/nsg#az-network-nsg-create) to create the network security group:

```azurecli
  az network nsg create \
    --resource-group CreatePubLBQS-rg \
    --name myNSG
```

### Create a network security group rule

Create a network security group rule using [az network nsg rule create](/cli/azure/network/nsg/rule#az-network-nsg-rule-create):

```azurecli
  az network nsg rule create \
    --resource-group CreatePubLBQS-rg \
    --nsg-name myNSG \
    --name myNSGRuleHTTP \
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

In this section, you'll create the resources for Azure Bastion. Azure Bastion is used to securely manage the virtual machines in the backend pool of the load balancer.

> [!IMPORTANT]

> [!INCLUDE [Pricing](../../../includes/bastion-pricing.md)]

>

### Create a public IP address

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a public IP address for the bastion host. The public IP is used by the bastion host for secure access to the virtual machine resources.

```azurecli
  az network public-ip create \
    --resource-group CreatePubLBQS-rg \
    --name myBastionIP \
    --sku Standard \
    --zone 1 2 3
```
### Create a bastion subnet

Use [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create) to create a bastion subnet. The bastion subnet is used by the bastion host to access the virtual network.

```azurecli
  az network vnet subnet create \
    --resource-group CreatePubLBQS-rg \
    --name AzureBastionSubnet \
    --vnet-name myVNet \
    --address-prefixes 10.1.1.0/26
```

### Create bastion host

Use [az network bastion create](/cli/azure/network/bastion#az-network-bastion-create) to create a bastion host. The bastion host is used to connect securely to the virtual machine resources created later in this article.

```azurecli
  az network bastion create \
    --resource-group CreatePubLBQS-rg \
    --name myBastionHost \
    --public-ip-address myBastionIP \
    --vnet-name myVNet \
    --location eastus
```

It can take a few minutes for the Azure Bastion host to deploy.

## Create backend servers

In this section, you create:

* Two network interfaces for the virtual machines

* Two virtual machines to be used as backend servers for the load balancer

### Create network interfaces for the virtual machines

Create two network interfaces with [az network nic create](/cli/azure/network/nic#az-network-nic-create):

```azurecli
  array=(myNicVM1 myNicVM2)
  for vmnic in "${array[@]}"
  do
    az network nic create \
        --resource-group CreatePubLBQS-rg \
        --name $vmnic \
        --vnet-name myVNet \
        --subnet myBackEndSubnet \
        --network-security-group myNSG
  done
```

### Create availability set for virtual machines

Create the availability set with [az vm availability-set create](/cli/azure/vm/availability-set#az-vm-availability-set-create):

```azurecli
  az vm availability-set create \
    --name myAvSet \
    --resource-group CreatePubLBQS-rg \
    --location eastus 
    
```

### Create virtual machines

Create the virtual machines with [az vm create](/cli/azure/vm#az-vm-create):

```azurecli
  az vm create \
    --resource-group CreatePubLBQS-rg \
    --name myVM1 \
    --nics myNicVM1 \
    --image win2019datacenter \
    --admin-username azureuser \
    --availability-set myAvSet \
    --no-wait
```

```azurecli
  az vm create \
    --resource-group CreatePubLBQS-rg \
    --name myVM2 \
    --nics myNicVM2 \
    --image win2019datacenter \
    --admin-username azureuser \
    --availability-set myAvSet \
    --no-wait
```

It may take a few minutes for the VMs to deploy. You can continue to the next steps while the VMs are creating.

[!INCLUDE [ephemeral-ip-note.md](../../../includes/ephemeral-ip-note.md)]

### Add virtual machines to load balancer backend pool

Add the virtual machines to the backend pool with [az network nic ip-config address-pool add](/cli/azure/network/nic/ip-config/address-pool#az-network-nic-ip-config-address-pool-add):

```azurecli
  array=(myNicVM1 myNicVM2)
  for vmnic in "${array[@]}"
  do
    az network nic ip-config address-pool add \
     --address-pool myBackendPool \
     --ip-config-name ipconfig1 \
     --nic-name $vmnic \
     --resource-group CreatePubLBQS-rg \
     --lb-name myLoadBalancer
  done
```

## Install IIS

Use [az vm extension set](/cli/azure/vm/extension#az-vm-extension-set) to install IIS on the virtual machines and set the default website to the computer name.

```azurecli
  array=(myVM1 myVM2)
    for vm in "${array[@]}"
    do
     az vm extension set \
       --publisher Microsoft.Compute \
       --version 1.8 \
       --name CustomScriptExtension \
       --vm-name $vm \
       --resource-group CreatePubLBQS-rg \
       --settings '{"commandToExecute":"powershell Add-WindowsFeature Web-Server; powershell Add-Content -Path \"C:\\inetpub\\wwwroot\\Default.htm\" -Value $($env:computername)"}'
  done
```

## Test the load balancer

To get the public IP address of the load balancer, use [az network public-ip show](/cli/azure/network/public-ip#az-network-public-ip-show). 

Copy the public IP address, and then paste it into the address bar of your browser.

```azurecli
  az network public-ip show \
    --resource-group CreatePubLBQS-rg \
    --name myPublicIP \
    --query ipAddress \
    --output tsv
```

## Clean up resources

When no longer needed, use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, load balancer, and all related resources.

```azurecli
  az group delete \
    --name CreatePubLBQS-rg
```

## Next steps

In this quickstart:

* You created a basic public load balancer

* Attached two virtual machines

* Configured the load balancer traffic rule and health probe

* Tested the load balancer

To learn more about Azure Load Balancer, continue to:
> [!div class="nextstepaction"]
> [What is Azure Load Balancer?](../load-balancer-overview.md)
