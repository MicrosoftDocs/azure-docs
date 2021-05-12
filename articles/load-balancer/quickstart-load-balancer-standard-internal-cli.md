---
title: 'Quickstart: Create an internal load balancer - Azure CLI'
titleSuffix: Azure Load Balancer
description: This quickstart shows how to create an internal load balancer by using the Azure CLI.
services: load-balancer
documentationcenter: na
author: asudbring
manager: KumudD
# Customer intent: I want to create a load balancer so that I can load balance internal traffic to VMs.
ms.service: load-balancer
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 12/19/2020
ms.author: allensu
ms.custom: mvc, devx-track-js, devx-track-azurecli
---
# Quickstart: Create an internal load balancer by using the Azure CLI

Get started with Azure Load Balancer by using the Azure CLI to create an internal load balancer and three virtual machines.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)] 

This quickstart requires version 2.0.28 or later of the Azure CLI. If you're using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

An Azure resource group is a logical container into which you deploy and manage your Azure resources.

Create a resource group with [az group create](/cli/azure/group#az_group_create). Name the resource group **CreateIntLBQS-rg**, and specify the location as **eastus**.

```azurecli-interactive
  az group create \
    --name CreateIntLBQS-rg \
    --location eastus

```

---
# [**Standard SKU**](#tab/option-1-create-load-balancer-standard)

>[!NOTE]
>Standard SKU load balancer is recommended for production workloads. For more information about skus, see **[Azure Load Balancer SKUs](skus.md)**.

In this section, you create a load balancer that load balances virtual machines. When you create an internal load balancer, a virtual network is configured as the network for the load balancer. The following diagram shows the resources created in this quickstart:

:::image type="content" source="./media/quickstart-load-balancer-standard-internal-portal/resources-diagram-internal.png" alt-text="Standard load balancer resources created for quickstart." border="false":::

### Configure the virtual network

Before you deploy VMs and deploy your load balancer, create the supporting virtual network resources.

#### Create a virtual network

Create a virtual network by using [az network vnet create](/cli/azure/network/vnet#az_network_vnet_create). Specify the following:

* Named **myVNet**
* Address prefix of **10.1.0.0/16**
* Subnet named **myBackendSubnet**
* Subnet prefix of **10.1.0.0/24**
* In the **CreateIntLBQS-rg** resource group
* Location of **eastus**

```azurecli-interactive
  az network vnet create \
    --resource-group CreateIntLBQS-rg \
    --location eastus \
    --name myVNet \
    --address-prefixes 10.1.0.0/16 \
    --subnet-name myBackendSubnet \
    --subnet-prefixes 10.1.0.0/24
```

#### Create a public IP address

Use [az network public-ip create](/cli/azure/network/public-ip#az_network_public_ip_create) to create a public IP address for the Azure Bastion host. Specify the following:

* Create a standard zone-redundant public IP address named **myBastionIP**
* In **CreateIntLBQS-rg**

```azurecli-interactive
az network public-ip create \
    --resource-group CreateIntLBQS-rg  \
    --name myBastionIP \
    --sku Standard
```
#### Create an Azure Bastion subnet

Use [az network vnet subnet create](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_create) to create a subnet. Specify the following:

* Named **AzureBastionSubnet**
* Address prefix of **10.1.1.0/24**
* In virtual network **myVNet**
* In resource group **CreateIntLBQS-rg**

```azurecli-interactive
az network vnet subnet create \
    --resource-group CreateIntLBQS-rg  \
    --name AzureBastionSubnet \
    --vnet-name myVNet \
    --address-prefixes 10.1.1.0/24
```

#### Create an Azure Bastion host

Use [az network bastion create](/cli/azure/network/bastion#az_network_bastion_create) to create a host. Specify the following:

* Named **myBastionHost**
* In **CreateIntLBQS-rg**
* Associated with public IP **myBastionIP**
* Associated with virtual network **myVNet**
* In **eastus** location

```azurecli-interactive
az network bastion create \
    --resource-group CreateIntLBQS-rg  \
    --name myBastionHost \
    --public-ip-address myBastionIP \
    --vnet-name myVNet \
    --location eastus
```

It can take a few minutes for the Azure Bastion host to deploy.

#### Create a network security group

For a standard load balancer, ensure that your VMs have network interfaces that belong to a network security group. Create a network security group by using [az network nsg create](/cli/azure/network/nsg#az_network_nsg_create). Specify the following:

* Named **myNSG**
* In resource group **CreateIntLBQS-rg**

```azurecli-interactive
  az network nsg create \
    --resource-group CreateIntLBQS-rg \
    --name myNSG
```

#### Create a network security group rule

Create a network security group rule by using [az network nsg rule create](/cli/azure/network/nsg/rule#az_network_nsg_rule_create). Specify the following:

* Named **myNSGRuleHTTP**
* In the network security group you created in the previous step, **myNSG**
* In resource group **CreateIntLBQS-rg**
* Protocol **(*)**
* Direction **Inbound**
* Source **(*)**
* Destination **(*)**
* Destination port **Port 80**
* Access **Allow**
* Priority **200**

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

### Create back-end servers

In this section, you create:

* Three network interfaces for the virtual machines.
* Three virtual machines to be used as servers for the load balancer.

#### Create network interfaces for the virtual machines

Create three network interfaces with [az network nic create](/cli/azure/network/nic#az_network_nic_create). Specify the following:

* Named **myNicVM1**, **myNicVM2**, and **myNicVM3**
* In resource group **CreateIntLBQS-rg**
* In virtual network **myVNet**
* In subnet **myBackendSubnet**
* In network security group **myNSG**

```azurecli-interactive
  array=(myNicVM1 myNicVM2 myNicVM3)
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

#### Create the virtual machines

Create the virtual machines with [az vm create](/cli/azure/vm#az_vm_create). Specify the following:

* Named **myVM1**, **myVM2**, and **myVM3**
* In resource group **CreateIntLBQS-rg**
* Attached to network interface **myNicVM1**, **myNicVM2**, and **myNicVM3**
* Virtual machine image **win2019datacenter**
* In **Zone 1**, **Zone 2**, and **Zone 3**

```azurecli-interactive
  array=(1 2 3)
  for n in "${array[@]}"
  do
    az vm create \
    --resource-group CreateIntLBQS-rg \
    --name myVM$n \
    --nics myNicVM$n \
    --image win2019datacenter \
    --admin-username azureuser \
    --zone $n \
    --no-wait
  done
```

It can take a few minutes for the VMs to deploy.

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]


### Create the load balancer

This section details how you can create and configure the following components of the load balancer:

* An IP pool that receives the incoming network traffic on the load balancer.
* A second IP pool, where the first pool sends the load-balanced network traffic.
* A health probe that determines health of the VM instances.
* A load balancer rule that defines how traffic is distributed to the VMs.

#### Create the load balancer resource

Create a public load balancer with [az network lb create](/cli/azure/network/lb#az_network_lb_create). Specify the following:

* Named **myLoadBalancer**
* A pool named **myFrontEnd**
* A pool named **myBackEndPool**
* Associated with the virtual network **myVNet**
* Associated with the subnet **myBackendSubnet**

```azurecli-interactive
  az network lb create \
    --resource-group CreateIntLBQS-rg \
    --name myLoadBalancer \
    --sku Standard \
    --vnet-name myVnet \
    --subnet myBackendSubnet \
    --frontend-ip-name myFrontEnd \
    --backend-pool-name myBackEndPool
```

#### Create the health probe

A health probe checks all virtual machine instances to ensure they can send network traffic. A virtual machine with a failed probe check is removed from the load balancer. The virtual machine is added back into the load balancer when the failure is resolved.

Create a health probe with [az network lb probe create](/cli/azure/network/lb/probe#az_network_lb_probe_create). Specify the following:

* Monitors the health of the virtual machines
* Named **myHealthProbe**
* Protocol **TCP**
* Monitoring **Port 80**

```azurecli-interactive
  az network lb probe create \
    --resource-group CreateIntLBQS-rg \
    --lb-name myLoadBalancer \
    --name myHealthProbe \
    --protocol tcp \
    --port 80
```

#### Create a load balancer rule

A load balancer rule defines:

* The IP configuration for the incoming traffic.
* The IP pool to receive the traffic.
* The required source and destination port. 

Create a load balancer rule with [az network lb rule create](/cli/azure/network/lb/rule#az_network_lb_rule_create). Specify the following:

* Named **myHTTPRule**
* Listening on **Port 80** in the pool **myFrontEnd**
* Sending load-balanced network traffic to the address pool **myBackEndPool** by using **Port 80** 
* Using health probe **myHealthProbe**
* Protocol **TCP**
* Idle timeout of **15 minutes**
* Enable TCP reset

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

#### Add VMs to the load balancer pool

Add the virtual machines to the back-end pool with [az network nic ip-config address-pool add](/cli/azure/network/nic/ip-config/address-pool#az_network_nic_ip_config_address_pool_add). Specify the following:

* In address pool **myBackEndPool**
* In resource group **CreateIntLBQS-rg**
* Associated with network interface **myNicVM1**, **myNicVM2**, and **myNicVM3**
* Associated with load balancer **myLoadBalancer**

```azurecli-interactive
  array=(VM1 VM2 VM3)
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

# [**Basic SKU**](#tab/option-1-create-load-balancer-basic)

>[!NOTE]
>Standard SKU load balancer is recommended for production workloads. For more information about skus, see **[Azure Load Balancer SKUs](skus.md)**.

In this section, you create a load balancer that load balances virtual machines. When you create an internal load balancer, a virtual network is configured as the network for the load balancer. The following diagram shows the resources created in this quickstart:

:::image type="content" source="./media/quickstart-load-balancer-standard-internal-portal/resources-diagram-internal-basic.png" alt-text="Basic load balancer resources created for quickstart." border="false":::

### Configure the virtual network

Before you deploy VMs and deploy your load balancer, create the supporting virtual network resources.

#### Create a virtual network

Create a virtual network by using [az network vnet create](/cli/azure/network/vnet#az_network_vnet_createt). Specify the following:

* Named **myVNet**
* Address prefix of **10.1.0.0/16**
* Subnet named **myBackendSubnet**
* Subnet prefix of **10.1.0.0/24**
* In the **CreateIntLBQS-rg** resource group
* Location of **eastus**

```azurecli-interactive
  az network vnet create \
    --resource-group CreateIntLBQS-rg \
    --location eastus \
    --name myVNet \
    --address-prefixes 10.1.0.0/16 \
    --subnet-name myBackendSubnet \
    --subnet-prefixes 10.1.0.0/24
```

#### Create a public IP address

Use [az network public-ip create](/cli/azure/network/public-ip#az_network_public_ip_create) to create a public IP address for the Azure Bastion host. Specify the following:

* Create a standard zone-redundant public IP address named **myBastionIP**
* In **CreateIntLBQS-rg**

```azurecli-interactive
az network public-ip create \
    --resource-group CreateIntLBQS-rg \
    --name myBastionIP \
    --sku Standard
```
#### Create an Azure Bastion subnet

Use [az network vnet subnet create](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_create) to create a subnet. Specify the following:

* Named **AzureBastionSubnet**
* Address prefix of **10.1.1.0/24**
* In virtual network **myVNet**
* In resource group **CreateIntLBQS-rg**

```azurecli-interactive
az network vnet subnet create \
    --resource-group CreateIntLBQS-rg \
    --name AzureBastionSubnet \
    --vnet-name myVNet \
    --address-prefixes 10.1.1.0/24
```

#### Create an Azure Bastion host

Use [az network bastion create](/cli/azure/network/bastion#az_network_bastion_create) to create a host. Specify the following:

* Named **myBastionHost**
* In **CreateIntLBQS-rg**
* Associated with public IP **myBastionIP**
* Associated with virtual network **myVNet**
* In **eastus** location

```azurecli-interactive
az network bastion create \
    --resource-group CreateIntLBQS-rg \
    --name myBastionHost \
    --public-ip-address myBastionIP \
    --vnet-name myVNet \
    --location eastus
```

It can take a few minutes for the Azure Bastion host to deploy.

#### Create a network security group

For a standard load balancer, ensure that your VMs have network interfaces that belong to a network security group. Create a network security group by using [az network nsg create](/cli/azure/network/nsg#az_network_nsg_create). Specify the following:

* Named **myNSG**
* In resource group **CreateIntLBQS-rg**

```azurecli-interactive
  az network nsg create \
    --resource-group CreateIntLBQS-rg \
    --name myNSG
```

#### Create a network security group rule

Create a network security group rule by using [az network nsg rule create](/cli/azure/network/nsg/rule#az_network_nsg_rule_create). Specify the following:

* Named **myNSGRuleHTTP**
* In the network security group you created in the previous step, **myNSG**
* In resource group **CreateIntLBQS-rg**
* Protocol **(*)**
* Direction **Inbound**
* Source **(*)**
* Destination **(*)**
* Destination port **Port 80**
* Access **Allow**
* Priority **200**

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

### Create back-end servers

In this section, you create:

* Three network interfaces for the virtual machines.
* The availability set for the virtual machines.
* Three virtual machines to be used as servers for the load balancer.

#### Create network interfaces for the virtual machines

Create three network interfaces with [az network nic create](/cli/azure/network/nic#az_network_nic_create). Specify the following:

* Named **myNicVM1**, **myNicVM2**, and **myNicVM3**
* In resource group **CreateIntLBQS-rg**
* In virtual network **myVNet**
* In subnet **myBackendSubnet**
* In network security group **myNSG**

```azurecli-interactive
  array=(myNicVM1 myNicVM2 myNicVM3)
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

#### Create the availability set for the virtual machines

Create the availability set with [az vm availability-set create](/cli/azure/vm/availability-set#az_vm_availability_set_create). Specify the following:

* Named **myAvailabilitySet**
* In resource group **CreateIntLBQS-rg**
* Location **eastus**

```azurecli-interactive
  az vm availability-set create \
    --name myAvailabilitySet \
    --resource-group CreateIntLBQS-rg \
    --location eastus 
    
```

#### Create the virtual machines

Create the virtual machines with [az vm create](/cli/azure/vm#az_vm_create). Specify the following:

* Named **myVM1**, **myVM2**, and **myVM3**
* In resource group **CreateIntLBQS-rg**
* Attached to network interface **myNicVM1**, **myNicVM2**, and **myNicVM3**
* Virtual machine image **win2019datacenter**
* In **myAvailabilitySet**


```azurecli-interactive
  array=(1 2 3)
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

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]


### Create the load balancer

This section details how you can create and configure the following components of the load balancer:

* An IP pool that receives the incoming network traffic on the load balancer.
* A second IP pool, where the first pool sends the load-balanced network traffic.
* A health probe that determines health of the VM instances.
* A load balancer rule that defines how traffic is distributed to the VMs.

#### Create the load balancer resource

Create a public load balancer with [az network lb create](/cli/azure/network/lb#az_network_lb_create). Specify the following:

* Named **myLoadBalancer**
* A pool named **myFrontEnd**
* A pool named **myBackEndPool**
* Associated with the virtual network **myVNet**
* Associated with the subnet **myBackendSubnet**

```azurecli-interactive
  az network lb create \
    --resource-group CreateIntLBQS-rg \
    --name myLoadBalancer \
    --sku Basic \
    --vnet-name myVNet \
    --subnet myBackendSubnet \
    --frontend-ip-name myFrontEnd \
    --backend-pool-name myBackEndPool
```

#### Create the health probe

A health probe checks all virtual machine instances to ensure they can send network traffic. A virtual machine with a failed probe check is removed from the load balancer. The virtual machine is added back into the load balancer when the failure is resolved.

Create a health probe with [az network lb probe create](/cli/azure/network/lb/probe#az_network_lb_probe_create). Specify the following:

* Monitors the health of the virtual machines
* Named **myHealthProbe**
* Protocol **TCP**
* Monitoring **Port 80**

```azurecli-interactive
  az network lb probe create \
    --resource-group CreateIntLBQS-rg \
    --lb-name myLoadBalancer \
    --name myHealthProbe \
    --protocol tcp \
    --port 80
```

#### Create a load balancer rule

A load balancer rule defines:

* The IP configuration for the incoming traffic.
* The IP pool to receive the traffic.
* The required source and destination port. 

Create a load balancer rule with [az network lb rule create](/cli/azure/network/lb/rule#az_network_lb_rule_create). Specify the following:

* Named **myHTTPRule**
* Listening on **Port 80** in the pool **myFrontEnd**
* Sending load-balanced network traffic to the address pool **myBackEndPool** by using **Port 80** 
* Using health probe **myHealthProbe**
* Protocol **TCP**
* Idle timeout of **15 minutes**

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
    --idle-timeout 15 
```
#### Add VMs to the load balancer pool

Add the virtual machines to the back-end pool with [az network nic ip-config address-pool add](/cli/azure/network/nic/ip-config/address-pool#az_network_nic_ip_config_address_pool_add). Specify the following:

* In address pool **myBackEndPool**
* In resource group **CreateIntLBQS-rg**
* Associated with network interface **myNicVM1**, **myNicVM2**, and **myNicVM3**
* Associated with load balancer **myLoadBalancer**

```azurecli-interactive
  array=(VM1 VM2 VM3)
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
---
## Test the load balancer

Create the network interface with [az network nic create](/cli/azure/network/nic#az_network_nic_create). Specify the following:

* Named **myNicTestVM**
* In resource group **CreateIntLBQS-rg**
* In virtual network **myVNet**
* In subnet **myBackendSubnet**
* In network security group **myNSG**

```azurecli-interactive
  az network nic create \
    --resource-group CreateIntLBQS-rg \
    --name myNicTestVM \
    --vnet-name myVNet \
    --subnet myBackEndSubnet \
    --network-security-group myNSG
```
Create the virtual machine with [az vm create](/cli/azure/vm#az_vm_create). Specify the following:

* Named **myTestVM**
* In resource group **CreateIntLBQS-rg**
* Attached to network interface **myNicTestVM**
* Virtual machine image **Win2019Datacenter**

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

Use [az vm extension set](/cli/azure/vm/extension#az_vm_extension_set) to install IIS on the virtual machines and set the default website to the computer name.

```azurecli-interactive
  array=(myVM1 myVM2 myVM3)
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

### Test

1. [Sign in](https://portal.azure.com) to the Azure portal.

2. On the **Overview** page, find the private IP address for the load balancer. In the menu on the left, select **All services** > **All resources** > **myLoadBalancer**.

3. In the overview of **myLoadBalancer**, copy the address next to **Private IP Address**.

4. In the menu on the left, select **All services** > **All resources**. From the resources list, in the **CreateIntLBQS-rg** resource group, select **myTestVM**.

5. On the **Overview** page, select **Connect** > **Bastion**.

6. Enter the username and password that you entered when you created the VM.

7. On **myTestVM**, open **Internet Explorer**.

8. Enter the IP address from the previous step into the address bar of the browser. The default page of the IIS web server is shown on the browser.

    :::image type="content" source="./media/quickstart-load-balancer-standard-internal-portal/load-balancer-test.png" alt-text="Screenshot of the IP address in the address bar of the browser." border="true":::
   
To see the load balancer distribute traffic across all three VMs, you can customize the default page of each VM's IIS web server. Then, manually refresh your web browser from the client machine.

## Clean up resources

When your resources are no longer needed, use the [az group delete](/cli/azure/group#az_group_delete) command to remove the resource group, load balancer, and all related resources.

```azurecli-interactive
  az group delete \
    --name CreateIntLBQS-rg
```

## Next steps

Get an overview of Azure Load Balancer.
> [!div class="nextstepaction"]
> [What is Azure Load Balancer?](load-balancer-overview.md)
