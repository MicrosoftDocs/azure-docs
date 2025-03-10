---
title: 'Quickstart: Create an internal load balancer - Azure CLI'
titleSuffix: Azure Load Balancer
description: This quickstart shows how to create an internal load balancer using the Azure CLI.
author: mbender-ms
ms.service: azure-load-balancer
ms.topic: quickstart
ms.date: 09/30/2024
ms.author: mbender
ms.custom: mvc, devx-track-azurecli, mode-api, template-quickstart, engagement-fy23
#Customer intent: I want to create a load balancer so that I can load balance internal traffic to VMs.
---

# Quickstart: Create an internal load balancer to load balance VMs using the Azure CLI

Get started with Azure Load Balancer by using the Azure CLI to create an internal load balancer and two virtual machines. Additional resources include Azure Bastion, NAT Gateway, a virtual network, and the required subnets.

:::image type="content" source="media/quickstart-load-balancer-standard-internal-portal/internal-load-balancer-resources.png" alt-text="Diagram of resources deployed for internal load balancer." lightbox="media/quickstart-load-balancer-standard-internal-portal/internal-load-balancer-resources.png":::

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)] 

- This quickstart requires version 2.0.28 or later of the Azure CLI. If you're using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

An Azure resource group is a logical container into which you deploy and manage your Azure resources.

Create a resource group with [az group create](/cli/azure/group#az-group-create).

```azurecli-interactive
    az group create \
      --name CreateIntLBQS-rg \
      --location westus2
```

When you create an internal load balancer, a virtual network is configured as the network for the load balancer.

## Create the virtual network

Before you deploy VMs and test your load balancer, create the supporting virtual network and subnet. The virtual network and subnet contain the resources deployed later in this article.

Create a virtual network by using [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create).

```azurecli-interactive
  az network vnet create \
    --resource-group CreateIntLBQS-rg \
    --location westus2 \
    --name myVNet \
    --address-prefixes 10.1.0.0/16 \
    --subnet-name myBackendSubnet \
    --subnet-prefixes 10.1.0.0/24
```

## Create an Azure Bastion host

In this example, you create an Azure Bastion host. The Azure Bastion host is used later in this article to securely manage the virtual machines and test the load balancer deployment.

 > [!IMPORTANT]
 > [!INCLUDE [Pricing](~/reusable-content/ce-skilling/azure/includes/bastion-pricing.md)]

### Create a bastion public IP address

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a public IP address for the Azure Bastion host.

```azurecli-interactive
az network public-ip create \
    --resource-group CreateIntLBQS-rg  \
    --name myBastionIP \
    --sku Standard \
    --zone 1 2 3
```
### Create a bastion subnet

Use [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create) to create a subnet.

```azurecli-interactive
az network vnet subnet create \
    --resource-group CreateIntLBQS-rg  \
    --name AzureBastionSubnet \
    --vnet-name myVNet \
    --address-prefixes 10.1.1.0/27
```

### Create the bastion host

Use [az network bastion create](/cli/azure/network/bastion#az-network-bastion-create) to create a host.

```azurecli-interactive
az config set extension.use_dynamic_install=yes_without_prompt

az network bastion create \
    --resource-group CreateIntLBQS-rg  \
    --name myBastionHost \
    --public-ip-address myBastionIP \
    --vnet-name myVNet \
    --location westus2 \
    --only-show-errors \
    --no-wait
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

```azurecli-interactive
  az network lb create \
    --resource-group CreateIntLBQS-rg \
    --name myLoadBalancer \
    --sku Standard \
    --vnet-name myVNet \
    --subnet myBackendSubnet \
    --backend-pool-name myBackEndPool \
    --frontend-ip-name myFrontEnd
```

### Create the health probe

A health probe checks all virtual machine instances to ensure they can send network traffic. 

A virtual machine with a failed probe check is removed from the load balancer. The virtual machine is added back into the load balancer when the failure is resolved.

Create a health probe with [az network lb probe create](/cli/azure/network/lb/probe#az-network-lb-probe-create).

```azurecli-interactive
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

```azurecli-interactive
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
    --idle-timeout 15 \
    --enable-tcp-reset true
```

## Create a network security group

For a standard load balancer, the VMs in the backend pool are required to have network interfaces that belong to a network security group. 

To create a network security group, use [az network nsg create](/cli/azure/network/nsg#az-network-nsg-create).

```azurecli-interactive
  az network nsg create \
    --resource-group CreateIntLBQS-rg \
    --name myNSG
```

## Create a network security group rule

To create a network security group rule, use [az network nsg rule create](/cli/azure/network/nsg/rule#az-network-nsg-rule-create).

```azurecli-interactive
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

## Create backend servers

In this section, you create:

* Two network interfaces for the virtual machines

* Two virtual machines to be used as servers for the load balancer

### Create network interfaces for the virtual machines

Create two network interfaces with [az network nic create](/cli/azure/network/nic#az-network-nic-create).

```azurecli-interactive
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

### Create the virtual machines

Create the virtual machines with [az vm create](/cli/azure/vm#az-vm-create).

```azurecli-interactive
  array=(1 2)
  for n in "${array[@]}"
  do
    az vm create \
    --resource-group CreateIntLBQS-rg \
    --name myVM$n \
    --nics myNicVM$n \
    --image win2022datacenter \
    --admin-username azureuser \
    --zone $n \
    --no-wait
  done
```

It can take a few minutes for the VMs to deploy.

[!INCLUDE [ephemeral-ip-note.md](~/reusable-content/ce-skilling/azure/includes/ephemeral-ip-note.md)]

## Add virtual machines to the backend pool

Add the virtual machines to the backend pool with [az network nic ip-config address-pool add](/cli/azure/network/nic/ip-config/address-pool#az-network-nic-ip-config-address-pool-add).

```azurecli-interactive
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
## Create NAT gateway

To provide outbound internet access for resources in the backend pool, create a NAT gateway.  

### Create public IP

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a single IP for the outbound connectivity.  

```azurecli-interactive
  az network public-ip create \
    --resource-group CreateIntLBQS-rg \
    --name myNATgatewayIP \
    --sku Standard \
    --zone 1 2 3
```

### Create NAT gateway resource

Use [az network nat gateway create](/cli/azure/network/nat#az-network-nat-gateway-create) to create the NAT gateway resource. The public IP created in the previous step is associated with the NAT gateway.

```azurecli-interactive
  az network nat gateway create \
    --resource-group CreateIntLBQS-rg \
    --name myNATgateway \
    --public-ip-addresses myNATgatewayIP \
    --idle-timeout 10
```

### Associate NAT gateway with subnet

Configure the source subnet in virtual network to use a specific NAT gateway resource with [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update).

```azurecli-interactive
  az network vnet subnet update \
    --resource-group CreateIntLBQS-rg \
    --vnet-name myVNet \
    --name myBackendSubnet \
    --nat-gateway myNATgateway
```

## Create test virtual machine

Create the network interface with [az network nic create](/cli/azure/network/nic#az-network-nic-create).

```azurecli-interactive
  az network nic create \
    --resource-group CreateIntLBQS-rg \
    --name myNicTestVM \
    --vnet-name myVNet \
    --subnet myBackEndSubnet \
    --network-security-group myNSG
```
Create the virtual machine with [az vm create](/cli/azure/vm#az-vm-create).

```azurecli-interactive
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

```azurecli-interactive
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

8. Enter the IP address from the previous step into the address bar of the browser. The default page of the IIS web server is shown on the browser.

    :::image type="content" source="./media/quickstart-load-balancer-standard-internal-portal/load-balancer-test.png" alt-text="Screenshot of the IP address in the address bar of the browser." border="true":::

## Clean up resources

When your resources are no longer needed, use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, load balancer, and all related resources.

```azurecli-interactive
  az group delete \
    --name CreateIntLBQS-rg
```

## Next steps

In this quickstart:

* You created an internal load balancer

* Attached two virtual machines

* Configured the load balancer traffic rule and health probe

* Tested the load balancer

To learn more about Azure Load Balancer, continue to:
> [!div class="nextstepaction"]
> [What is Azure Load Balancer?](load-balancer-overview.md)
