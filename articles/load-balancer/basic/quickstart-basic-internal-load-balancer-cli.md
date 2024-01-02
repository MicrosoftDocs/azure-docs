---
title: 'Quickstart: Create an internal basic load balancer - Azure CLI'
titleSuffix: Azure Load Balancer
description: This quickstart shows how to create an internal basic load balancer by using the Azure CLI.
author: mbender-ms
ms.service: load-balancer
ms.topic: quickstart
ms.date: 04/10/2023
ms.author: mbender
ms.custom: devx-track-azurecli, mode-api
#Customer intent: I want to create a load balancer so that I can load balance internal traffic to VMs.
---
# Quickstart: Create an internal basic load balancer to load balance VMs by using the Azure CLI

Get started with Azure Load Balancer by using the Azure CLI to create an internal load balancer and two virtual machines.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)] 

This quickstart requires version 2.0.28 or later of the Azure CLI. If you're using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

An Azure resource group is a logical container into which you deploy and manage your Azure resources.

Create a resource group with [az group create](/cli/azure/group#az-group-create).

```azurecli
  az group create \
    --name CreateIntLBQS-rg \
    --location westus3

```

When you create an internal load balancer, a virtual network is configured as the network for the load balancer.

## Create the virtual network

Before you deploy VMs and test your load balancer, create the supporting virtual network and subnet. The virtual network and subnet will contain the resources deployed later in this article.

Create a virtual network by using [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create).

```azurecli
  az network vnet create \
    --resource-group CreateIntLBQS-rg \
    --location westus3 \
    --name myVNet \
    --address-prefixes 10.1.0.0/16 \
    --subnet-name myBackendSubnet \
    --subnet-prefixes 10.1.0.0/24
```

## Create an Azure Bastion host

In this example, you'll create an Azure Bastion host. The Azure Bastion host is used later in this article to securely manage the virtual machines and test the load balancer deployment.

> [!IMPORTANT]

> [!INCLUDE [Pricing](../../../includes/bastion-pricing.md)]

>

### Create a bastion public IP address

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a public IP address for the Azure Bastion host.

```azurecli
az network public-ip create \
    --resource-group CreateIntLBQS-rg  \
    --name myBastionIP \
    --sku Standard \
    --zone 1 2 3
```
### Create a bastion subnet

Use [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create) to create a subnet.

```azurecli
az network vnet subnet create \
    --resource-group CreateIntLBQS-rg  \
    --name AzureBastionSubnet \
    --vnet-name myVNet \
    --address-prefixes 10.1.1.0/27
```

### Create the bastion host

Use [az network bastion create](/cli/azure/network/bastion#az-network-bastion-create) to create a host.

```azurecli
az network bastion create \
    --resource-group CreateIntLBQS-rg  \
    --name myBastionHost \
    --public-ip-address myBastionIP \
    --vnet-name myVNet \
    --location westus3
```

It can take a few minutes for the Azure Bastion host to deploy.

## Create the load balancer

This section details how you can create and configure the following components of the load balancer:
  
* A frontend IP pool that receives the incoming network traffic on the load balancer

* A backend IP pool where the frontend pool sends the load balanced network traffic

* A health probe that determines health of the backend VM instances

* A load balancer rule that defines how traffic is distributed to the VMs

### Create the load balancer resource

Create an internal load balancer with [az network lb create](/cli/azure/network/lb#az-network-lb-create).

```azurecli
  az network lb create \
    --resource-group CreateIntLBQS-rg \
    --name myLoadBalancer \
    --sku Basic \
    --vnet-name myVNet \
    --subnet myBackendSubnet \
    --frontend-ip-name myFrontEnd \
    --backend-pool-name myBackEndPool
```

### Create the health probe

A health probe checks all virtual machine instances to ensure they can send network traffic. 

A virtual machine with a failed probe check is removed from the load balancer. The virtual machine is added back into the load balancer when the failure is resolved.

Create a health probe with [az network lb probe create](/cli/azure/network/lb/probe#az-network-lb-probe-create).

```azurecli
  az network lb probe create \
    --resource-group CreateIntLBQS-rg \
    --lb-name myLoadBalancer \
    --name myHealthProbe \
    --protocol tcp \
    --port 80
```

### Create a load balancer rule

A load balancer rule defines:

* Frontend IP configuration for the incoming traffic

* The backend IP pool to receive the traffic

* The required source and destination port

Create a load balancer rule with [az network lb rule create](/cli/azure/network/lb/rule#az-network-lb-rule-create).

```azurecli
  az network lb rule create \
    --resource-group CreateIntLBQS-rg \
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

For a standard load balancer, the VMs in the backend pool are required to have network interfaces that belong to a network security group. 

To create a network security group, use [az network nsg create](/cli/azure/network/nsg#az-network-nsg-create).

```azurecli
  az network nsg create \
    --resource-group CreateIntLBQS-rg \
    --name myNSG
```

## Create a network security group rule

To create a network security group rule, use [az network nsg rule create](/cli/azure/network/nsg/rule#az-network-nsg-rule-create).

```azurecli
  az network nsg rule create \
    --resource-group CreateIntLBQS-rg \
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

## Create back-end servers

In this section, you create:

* Two network interfaces for the virtual machines

* Two virtual machines to be used as servers for the load balancer

### Create network interfaces for the virtual machines

Create two network interfaces with [az network nic create](/cli/azure/network/nic#az-network-nic-create).

```azurecli
  array=(myNicVM1 myNicVM2)
  for vmnic in "${array[@]}"
  do
    az network nic create \
        --resource-group CreateIntLBQS-rg \
        --name $vmnic \
        --vnet-name myVNet \
        --subnet myBackEndSubnet \
        --network-security-group myNSG
  done
```

### Create the availability set for the virtual machines

Create the availability set with [az vm availability-set create](/cli/azure/vm/availability-set#az-vm-availability-set-create).

```azurecli
  az vm availability-set create \
    --name myAvailabilitySet \
    --resource-group CreateIntLBQS-rg \
    --location westus3  
```

### Create the virtual machines

Create the virtual machines with [az vm create](/cli/azure/vm#az-vm-create).

```azurecli
  array=(1 2)
  for n in "${array[@]}"
  do
    az vm create \
    --resource-group CreateIntLBQS-rg \
    --name myVM$n \
    --nics myNicVM$n \
    --image win2019datacenter \
    --admin-username azureuser \
    --availability-set myAvailabilitySet \
    --no-wait
  done
```

It can take a few minutes for the VMs to deploy.

[!INCLUDE [ephemeral-ip-note.md](../../../includes/ephemeral-ip-note.md)]

## Add virtual machines to the backend pool

Add the virtual machines to the backend pool with [az network nic ip-config address-pool add](/cli/azure/network/nic/ip-config/address-pool#az-network-nic-ip-config-address-pool-add).

```azurecli
  array=(VM1 VM2)
  for vm in "${array[@]}"
  do
  az network nic ip-config address-pool add \
   --address-pool myBackendPool \
   --ip-config-name ipconfig1 \
   --nic-name myNic$vm \
   --resource-group CreateIntLBQS-rg \
   --lb-name myLoadBalancer
  done

```

## Create test virtual machine

Create the network interface with [az network nic create](/cli/azure/network/nic#az-network-nic-create).

```azurecli
  az network nic create \
    --resource-group CreateIntLBQS-rg \
    --name myNicTestVM \
    --vnet-name myVNet \
    --subnet myBackEndSubnet \
    --network-security-group myNSG
```
Create the virtual machine with [az vm create](/cli/azure/vm#az-vm-create).

```azurecli
  az vm create \
    --resource-group CreateIntLBQS-rg \
    --name myTestVM \
    --nics myNicTestVM \
    --image Win2019Datacenter \
    --admin-username azureuser \
    --no-wait
```
You might need to wait a few minutes for the virtual machine to deploy.

## Install IIS

Use [az vm extension set](/cli/azure/vm/extension#az-vm-extension-set) to install IIS on the backend virtual machines and set the default website to the computer name.

```azurecli
  array=(myVM1 myVM2)
    for vm in "${array[@]}"
    do
     az vm extension set \
       --publisher Microsoft.Compute \
       --version 1.8 \
       --name CustomScriptExtension \
       --vm-name $vm \
       --resource-group CreateIntLBQS-rg \
       --settings '{"commandToExecute":"powershell Add-WindowsFeature Web-Server; powershell Add-Content -Path \"C:\\inetpub\\wwwroot\\Default.htm\" -Value $($env:computername)"}'
  done

```

## Test the load balancer

1. [Sign in](https://portal.azure.com) to the Azure portal.

2. On the **Overview** page, find the private IP address for the load balancer. In the menu on the left, select **All services** > **All resources** > **myLoadBalancer**.

3. In the overview of **myLoadBalancer**, copy the address next to **Private IP Address**. If **Private IP address** isn't visible, select **See more**.

4. In the menu on the left, select **All services** > **All resources**. From the resources list, in the **CreateIntLBQS-rg** resource group, select **myTestVM**.

5. On the **Overview** page, select **Connect** > **Bastion**.

6. Enter the username and password that you entered when you created the VM.

7. On **myTestVM**, open **Internet Explorer**.

8. Enter the IP address from the previous step into the address bar of the browser. The default page of the IIS web server is shown in the browser.

## Clean up resources

When your resources are no longer needed, use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, load balancer, and all related resources.

```azurecli
  az group delete \
    --name CreateIntLBQS-rg
```

## Next steps

In this quickstart:

* You created an internal basic load balancer

* Attached two virtual machines

* Configured the load balancer traffic rule and health probe

* Tested the load balancer

To learn more about Azure Load Balancer, continue to:
> [!div class="nextstepaction"]
> [What is Azure Load Balancer?](../load-balancer-overview.md)
