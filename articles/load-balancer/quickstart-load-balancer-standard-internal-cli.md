---
title: "Quickstart: Create an internal load balancer - Azure CLI"
titleSuffix: Azure Load Balancer
description: This quickstart shows how to create an internal load balancer using the Azure CLI
services: load-balancer
documentationcenter: na
author: asudbring
manager: KumudD
Customer intent: I want to create a load balancer so that I can load balance internal traffic to VMs.
ms.service: load-balancer
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 12/19/2020
ms.author: allensu
ms.custom: mvc, devx-track-js, devx-track-azurecli
---
# Quickstart: Create an internal load balancer to load balance VMs using Azure CLI

Get started with Azure Load Balancer by using Azure CLI to create an internal load balancer and three virtual machines.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)] 

- This quickstart requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [az group create](/cli/azure/group#az_group_create):

* Named **CreateIntLBQS-rg**. 
* In the **eastus** location.

```azurecli-interactive
  az group create \
    --name CreateIntLBQS-rg \
    --location eastus

```
---

# [**Standard SKU**](#tab/option-1-create-load-balancer-standard)

>[!NOTE]
>Standard SKU load balancer is recommended for production workloads. For more information about SKUs, see **[Azure Load Balancer SKUs](skus.md)**.

:::image type="content" source="./media/quickstart-load-balancer-standard-internal-portal/resources-diagram-internal.png" alt-text="Standard load balancer resources created for quickstart." border="false":::

## Configure virtual network - Standard

Before you deploy VMs and deploy your load balancer, create the supporting virtual network resources.

### Create a virtual network

Create a virtual network using [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create):

* Named **myVNet**.
* Address prefix of **10.1.0.0/16**.
* Subnet named **myBackendSubnet**.
* Subnet prefix of **10.1.0.0/24**.
* In the **CreateIntLBQS-rg** resource group.
* Location of **eastus**.

```azurecli-interactive
  az network vnet create \
    --resource-group CreateIntLBQS-rg \
    --location eastus \
    --name myVNet \
    --address-prefixes 10.1.0.0/16 \
    --subnet-name myBackendSubnet \
    --subnet-prefixes 10.1.0.0/24
```

### Create a public IP address

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a public ip address for the bastion host:

* Create a standard zone redundant public IP address named **myBastionIP**.
* In **CreateIntLBQS-rg**.

```azurecli-interactive
az network public-ip create \
    --resource-group CreateIntLBQS-rg  \
    --name myBastionIP \
    --sku Standard
```
### Create a bastion subnet

Use [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create) to create a bastion subnet:

* Named **AzureBastionSubnet**.
* Address prefix of **10.1.1.0/24**.
* In virtual network **myVNet**.
* In resource group **CreateIntLBQS-rg**.

```azurecli-interactive
az network vnet subnet create \
    --resource-group CreateIntLBQS-rg  \
    --name AzureBastionSubnet \
    --vnet-name myVNet \
    --address-prefixes 10.1.1.0/24
```

### Create bastion host

Use [az network bastion create](/cli/azure/network/bastion#az-network-bastion-create) to create a bastion host:

* Named **myBastionHost**.
* In **CreateIntLBQS-rg**.
* Associated with public IP **myBastionIP**.
* Associated with virtual network **myVNet**.
* In **eastus** location.

```azurecli-interactive
az network bastion create \
    --resource-group CreateIntLBQS-rg  \
    --name myBastionHost \
    --public-ip-address myBastionIP \
    --vnet-name myVNet \
    --location eastus
```

It can take a few minutes for the Azure Bastion host to deploy.


### Create a network security group

For a standard load balancer, the VMs in the backend address for are required to have network interfaces that belong to a network security group. 

Create a network security group using [az network nsg create](/cli/azure/network/nsg#az-network-nsg-create):

* Named **myNSG**.
* In resource group **CreateIntLBQS-rg**.

```azurecli-interactive
  az network nsg create \
    --resource-group CreateIntLBQS-rg \
    --name myNSG
```

### Create a network security group rule

Create a network security group rule using [az network nsg rule create](/cli/azure/network/nsg/rule#az-network-nsg-rule-create):

* Named **myNSGRuleHTTP**.
* In the network security group you created in the previous step, **myNSG**.
* In resource group **CreateIntLBQS-rg**.
* Protocol **(*)**.
* Direction **Inbound**.
* Source **(*)**.
* Destination **(*)**.
* Destination port **Port 80**.
* Access **Allow**.
* Priority **200**.

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

## Create backend servers - Standard

In this section, you create:

* Three network interfaces for the virtual machines.
* Three virtual machines to be used as backend servers for the load balancer.

### Create network interfaces for the virtual machines

Create three network interfaces with [az network nic create](/cli/azure/network/nic#az-network-nic-create):

* Named **myNicVM1**, **myNicVM2**, and **myNicVM3**.
* In resource group **CreateIntLBQS-rg**.
* In virtual network **myVNet**.
* In subnet **myBackendSubnet**.
* In network security group **myNSG**.

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

### Create virtual machines

Create the virtual machines with [az vm create](/cli/azure/vm#az-vm-create):

* Named **myVM1**, **myVM2**, and **myVM3**.
* In resource group **CreateIntLBQS-rg**.
* Attached to network interface **myNicVM1**, **myNicVM2**, and **myNicVM3**.
* Virtual machine image **win2019datacenter**.
* In **Zone 1**, **Zone 2**, and **Zone 3**.

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

It may take a few minutes for the VMs to deploy.

## Create standard load balancer

This section details how you can create and configure the following components of the load balancer:

  * A frontend IP pool that receives the incoming network traffic on the load balancer.
  * A backend IP pool where the frontend pool sends the load balanced network traffic.
  * A health probe that determines health of the backend VM instances.
  * A load balancer rule that defines how traffic is distributed to the VMs.

### Create the load balancer resource

Create a public load balancer with [az network lb create](/cli/azure/network/lb#az-network-lb-create):

* Named **myLoadBalancer**.
* A frontend pool named **myFrontEnd**.
* A backend pool named **myBackEndPool**.
* Associated with the virtual network **myVNet**.
* Associated with the backend subnet **myBackendSubnet**.

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

### Create the health probe

A health probe checks all virtual machine instances to ensure they can send network traffic. 

A virtual machine with a failed probe check is removed from the load balancer. The virtual machine is added back into the load balancer when the failure is resolved.

Create a health probe with [az network lb probe create](/cli/azure/network/lb/probe#az-network-lb-probe-create):

* Monitors the health of the virtual machines.
* Named **myHealthProbe**.
* Protocol **TCP**.
* Monitoring **Port 80**.

```azurecli-interactive
  az network lb probe create \
    --resource-group CreateIntLBQS-rg \
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

Create a load balancer rule with [az network lb rule create](/cli/azure/network/lb/rule#az-network-lb-rule-create):

* Named **myHTTPRule**
* Listening on **Port 80** in the frontend pool **myFrontEnd**.
* Sending load-balanced network traffic to the backend address pool **myBackEndPool** using **Port 80**. 
* Using health probe **myHealthProbe**.
* Protocol **TCP**.
* Idle timeout of **15 minutes**.
* Enable TCP reset.

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
    --disable-outbound-snat true \
    --idle-timeout 15 \
    --enable-tcp-reset true
```
>[!NOTE]
>The virtual machines in the backend pool will not have outbound internet connectivity with this configuration. </br> For more information on providing outbound connectivity, see: </br> **[Outbound connections in Azure](load-balancer-outbound-connections.md)**</br> Options for providing connectivity: </br> **[Outbound-only load balancer configuration](egress-only.md)** </br> **[What is Virtual Network NAT?](../virtual-network/nat-overview.md)**

### Add virtual machines to load balancer backend pool

Add the virtual machines to the backend pool with [az network nic ip-config address-pool add](/cli/azure/network/nic/ip-config/address-pool#az-network-nic-ip-config-address-pool-add):

* In backend address pool **myBackEndPool**.
* In resource group **CreateIntLBQS-rg**.
* Associated with network interface **myNicVM1**, **myNicVM2**, and **myNicVM3**.
* Associated with load balancer **myLoadBalancer**.

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
>Standard SKU load balancer is recommended for production workloads. For more information about SKUS, see **[Azure Load Balancer SKUs](skus.md)**.

:::image type="content" source="./media/quickstart-load-balancer-standard-internal-portal/resources-diagram-internal-basic.png" alt-text="Basic load balancer resources created in quickstart." border="false":::

## Configure virtual network - Basic

Before you deploy VMs and deploy your load balancer, create the supporting virtual network resources.

### Create a virtual network

Create a virtual network using [az network vnet create](/cli/azure/network/vnet#az-network-vnet-createt):

* Named **myVNet**.
* Address prefix of **10.1.0.0/16**.
* Subnet named **myBackendSubnet**.
* Subnet prefix of **10.1.0.0/24**.
* In the **CreateIntLBQS-rg** resource group.
* Location of **eastus**.

```azurecli-interactive
  az network vnet create \
    --resource-group CreateIntLBQS-rg \
    --location eastus \
    --name myVNet \
    --address-prefixes 10.1.0.0/16 \
    --subnet-name myBackendSubnet \
    --subnet-prefixes 10.1.0.0/24
```

### Create a public IP address

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a public ip address for the bastion host:

* Create a standard zone redundant public IP address named **myBastionIP**.
* In **CreateIntLBQS-rg**.

```azurecli-interactive
az network public-ip create \
    --resource-group CreateIntLBQS-rg \
    --name myBastionIP \
    --sku Standard
```
### Create a bastion subnet

Use [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create) to create a bastion subnet:

* Named **AzureBastionSubnet**.
* Address prefix of **10.1.1.0/24**.
* In virtual network **myVNet**.
* In resource group **CreateIntLBQS-rg**.

```azurecli-interactive
az network vnet subnet create \
    --resource-group CreateIntLBQS-rg \
    --name AzureBastionSubnet \
    --vnet-name myVNet \
    --address-prefixes 10.1.1.0/24
```

### Create bastion host

Use [az network bastion create](/cli/azure/network/bastion#az-network-bastion-create) to create a bastion host:

* Named **myBastionHost**.
* In **CreateIntLBQS-rg**.
* Associated with public IP **myBastionIP**.
* Associated with virtual network **myVNet**.
* In **eastus** location.

```azurecli-interactive
az network bastion create \
    --resource-group CreateIntLBQS-rg \
    --name myBastionHost \
    --public-ip-address myBastionIP \
    --vnet-name myVNet \
    --location eastus
```

It can take a few minutes for the Azure Bastion host to deploy.

### Create a network security group

For a standard load balancer, the VMs in the backend address for are required to have network interfaces that belong to a network security group. 

Create a network security group using [az network nsg create](/cli/azure/network/nsg#az-network-nsg-create):

* Named **myNSG**.
* In resource group **CreateIntLBQS-rg**.

```azurecli-interactive
  az network nsg create \
    --resource-group CreateIntLBQS-rg \
    --name myNSG
```

### Create a network security group rule

Create a network security group rule using [az network nsg rule create](/cli/azure/network/nsg/rule#az-network-nsg-rule-create):

* Named **myNSGRuleHTTP**.
* In the network security group you created in the previous step, **myNSG**.
* In resource group **CreateIntLBQS-rg**.
* Protocol **(*)**.
* Direction **Inbound**.
* Source **(*)**.
* Destination **(*)**.
* Destination port **Port 80**.
* Access **Allow**.
* Priority **200**.

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

## Create backend servers - Basic

In this section, you create:

* Three network interfaces for the virtual machines.
* Availability set for the virtual machines
* Three virtual machines to be used as backend servers for the load balancer.

### Create network interfaces for the virtual machines

Create three network interfaces with [az network nic create](/cli/azure/network/nic#az-network-nic-create):

* Named **myNicVM1**, **myNicVM2**, and **myNicVM3**.
* In resource group **CreateIntLBQS-rg**.
* In virtual network **myVNet**.
* In subnet **myBackendSubnet**.
* In network security group **myNSG**.

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

### Create availability set for virtual machines

Create the availability set with [az vm availability-set create](/cli/azure/vm/availability-set#az-vm-availability-set-create):

* Named **myAvailabilitySet**.
* In resource group **CreateIntLBQS-rg**.
* Location **eastus**.

```azurecli-interactive
  az vm availability-set create \
    --name myAvailabilitySet \
    --resource-group CreateIntLBQS-rg \
    --location eastus 
    
```

### Create virtual machines

Create the virtual machines with [az vm create](/cli/azure/vm#az-vm-create):

* Named **myVM1**, **myVM2**, and **myVM3**.
* In resource group **CreateIntLBQS-rg**.
* Attached to network interface **myNicVM1**, **myNicVM2**, and **myNicVM3**.
* Virtual machine image **win2019datacenter**.
* In **myAvailabilitySet**.


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
It may take a few minutes for the VMs to deploy.

## Create basic load balancer

This section details how you can create and configure the following components of the load balancer:

  * A frontend IP pool that receives the incoming network traffic on the load balancer.
  * A backend IP pool where the frontend pool sends the load balanced network traffic.
  * A health probe that determines health of the backend VM instances.
  * A load balancer rule that defines how traffic is distributed to the VMs.

### Create the load balancer resource

Create a public load balancer with [az network lb create](/cli/azure/network/lb#az-network-lb-create):

* Named **myLoadBalancer**.
* A frontend pool named **myFrontEnd**.
* A backend pool named **myBackEndPool**.
* Associated with the virtual network **myVNet**.
* Associated with the backend subnet **myBackendSubnet**.

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

### Create the health probe

A health probe checks all virtual machine instances to ensure they can send network traffic. 

A virtual machine with a failed probe check is removed from the load balancer. The virtual machine is added back into the load balancer when the failure is resolved.

Create a health probe with [az network lb probe create](/cli/azure/network/lb/probe#az-network-lb-probe-create):

* Monitors the health of the virtual machines.
* Named **myHealthProbe**.
* Protocol **TCP**.
* Monitoring **Port 80**.

```azurecli-interactive
  az network lb probe create \
    --resource-group CreateIntLBQS-rg \
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

Create a load balancer rule with [az network lb rule create](/cli/azure/network/lb/rule#az-network-lb-rule-create):

* Named **myHTTPRule**
* Listening on **Port 80** in the frontend pool **myFrontEnd**.
* Sending load-balanced network traffic to the backend address pool **myBackEndPool** using **Port 80**. 
* Using health probe **myHealthProbe**.
* Protocol **TCP**.
* Idle timeout of **15 minutes**.

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
### Add virtual machines to load balancer backend pool

Add the virtual machines to the backend pool with [az network nic ip-config address-pool add](/cli/azure/network/nic/ip-config/address-pool#az-network-nic-ip-config-address-pool-add):

* In backend address pool **myBackEndPool**.
* In resource group **CreateIntLBQS-rg**.
* Associated with network interface **myNicVM1**, **myNicVM2**, and **myNicVM3**.
* Associated with load balancer **myLoadBalancer**.

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

### Create test virtual machine

Create the network interface with [az network nic create](/cli/azure/network/nic#az-network-nic-create):

* Named **myNicTestVM**.
* In resource group **CreateIntLBQS-rg**.
* In virtual network **myVNet**.
* In subnet **myBackendSubnet**.
* In network security group **myNSG**.

```azurecli-interactive
  az network nic create \
    --resource-group CreateIntLBQS-rg \
    --name myNicTestVM \
    --vnet-name myVNet \
    --subnet myBackEndSubnet \
    --network-security-group myNSG
```
Create the virtual machine with [az vm create](/cli/azure/vm#az-vm-create):

* Named **myTestVM**.
* In resource group **CreateIntLBQS-rg**.
* Attached to network interface **myNicTestVM**.
* Virtual machine image **Win2019Datacenter**.

```azurecli-interactive
  az vm create \
    --resource-group CreateIntLBQS-rg \
    --name myTestVM \
    --nics myNicTestVM \
    --image Win2019Datacenter \
    --admin-username azureuser \
    --no-wait
```
Can take a few minutes for the virtual machine to deploy.

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

2. Find the private IP address for the load balancer on the **Overview** screen. Select **All services** in the left-hand menu, select **All resources**, and then select **myLoadBalancer**.

3. Make note or copy the address next to **Private IP Address** in the **Overview** of **myLoadBalancer**.

4. Select **All services** in the left-hand menu, select **All resources**, and then from the resources list, select **myTestVM** that is located in the **CreateIntLBQS-rg** resource group.

5. On the **Overview** page, select **Connect**, then **Bastion**.

6. Enter the username and password entered during VM creation.

7. Open **Internet Explorer** on **myTestVM**.

8. Enter the IP address from the previous step into the address bar of the browser. The default page of IIS Web server is displayed on the browser.

    :::image type="content" source="./media/quickstart-load-balancer-standard-internal-portal/load-balancer-test.png" alt-text="Create a standard internal load balancer" border="true":::
   
To see the load balancer distribute traffic across all three VMs, you can customize the default page of each VM's IIS Web server and then force-refresh your web browser from the client machine.

## Clean up resources

When no longer needed, use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, load balancer, and all related resources.

```azurecli-interactive
  az group delete \
    --name CreateIntLBQS-rg
```

## Next steps

In this quickstart:

* You created a standard or public load balancer
* Attached virtual machines. 
* Configured the load balancer traffic rule and health probe.
* Tested the load balancer.

To learn more about Azure Load Balancer, continue to:
> [!div class="nextstepaction"]
> [What is Azure Load Balancer?](load-balancer-overview.md)