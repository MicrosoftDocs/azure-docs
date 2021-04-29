---
title: "Quickstart: Create a public load balancer - Azure CLI"
titleSuffix: Azure Load Balancer
description: This quickstart shows how to create a public load balancer using the Azure CLI
services: load-balancer
documentationcenter: na
author: asudbring
manager: KumudD
tags: azure-resource-manager
# Customer intent: I want to create a load balancer so that I can load balance internet traffic to VMs.
ms.service: load-balancer
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/23/2020
ms.author: allensu
ms.custom: mvc, devx-track-js, devx-track-azurecli
---
# Quickstart: Create a public load balancer to load balance VMs using Azure CLI

Get started with Azure Load Balancer by using Azure CLI to create a public load balancer and three virtual machines.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

- This quickstart requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [az group create](/cli/azure/group#az_group_create):

* Named **CreatePubLBQS-rg**. 
* In the **eastus** location.

```azurecli-interactive
  az group create \
    --name CreatePubLBQS-rg \
    --location eastus
```
---

# [**Standard SKU**](#tab/option-1-create-load-balancer-standard)

>[!NOTE]
>Standard SKU load balancer is recommended for production workloads. For more information about skus, see **[Azure Load Balancer SKUs](skus.md)**.

:::image type="content" source="./media/quickstart-load-balancer-standard-public-portal/resources-diagram.png" alt-text="Standard load balancer resources created for quickstart." border="false":::

## Configure virtual network - Standard

Before you deploy VMs and test your load balancer, create the supporting virtual network resources.

### Create a virtual network

Create a virtual network using [az network vnet create](/cli/azure/network/vnet#az_network_vnet_createt):

* Named **myVNet**.
* Address prefix of **10.1.0.0/16**.
* Subnet named **myBackendSubnet**.
* Subnet prefix of **10.1.0.0/24**.
* In the **CreatePubLBQS-rg** resource group.
* Location of **eastus**.

```azurecli-interactive
  az network vnet create \
    --resource-group CreatePubLBQS-rg \
    --location eastus \
    --name myVNet \
    --address-prefixes 10.1.0.0/16 \
    --subnet-name myBackendSubnet \
    --subnet-prefixes 10.1.0.0/24
```
### Create a public IP address

Use [az network public-ip create](/cli/azure/network/public-ip#az_network_public_ip_create) to create a public ip address for the bastion host:

* Create a standard zone redundant public IP address named **myBastionIP**.
* In **CCreatePubLBQS-rg**.

```azurecli-interactive
az network public-ip create \
    --resource-group CreatePubLBQS-rg \
    --name myBastionIP \
    --sku Standard
```
### Create a bastion subnet

Use [az network vnet subnet create](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_create) to create a bastion subnet:

* Named **AzureBastionSubnet**.
* Address prefix of **10.1.1.0/24**.
* In virtual network **myVNet**.
* In resource group **CreatePubLBQS-rg**.

```azurecli-interactive
az network vnet subnet create \
    --resource-group CreatePubLBQS-rg \
    --name AzureBastionSubnet \
    --vnet-name myVNet \
    --address-prefixes 10.1.1.0/24
```

### Create bastion host

Use [az network bastion create](/cli/azure/network/bastion#az_network_bastion_create) to create a bastion host:

* Named **myBastionHost**.
* In **CreatePubLBQS-rg**.
* Associated with public IP **myBastionIP**.
* Associated with virtual network **myVNet**.
* In **eastus** location.

```azurecli-interactive
az network bastion create \
    --resource-group CreatePubLBQS-rg \
    --name myBastionHost \
    --public-ip-address myBastionIP \
    --vnet-name myVNet \
    --location eastus
```

It can take a few minutes for the Azure Bastion host to deploy.

### Create a network security group

For a standard load balancer, the VMs in the backend address for are required to have network interfaces that belong to a network security group. 

Create a network security group using [az network nsg create](/cli/azure/network/nsg#az_network_nsg_create):

* Named **myNSG**.
* In resource group **CreatePubLBQS-rg**.

```azurecli-interactive
  az network nsg create \
    --resource-group CreatePubLBQS-rg \
    --name myNSG
```

### Create a network security group rule

Create a network security group rule using [az network nsg rule create](/cli/azure/network/nsg/rule#az_network_nsg_rule_create):

* Named **myNSGRuleHTTP**.
* In the network security group you created in the previous step, **myNSG**.
* In resource group **CreatePubLBQS-rg**.
* Protocol **(*)**.
* Direction **Inbound**.
* Source **(*)**.
* Destination **(*)**.
* Destination port **Port 80**.
* Access **Allow**.
* Priority **200**.

```azurecli-interactive
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

## Create backend servers - Standard

In this section, you create:

* Three network interfaces for the virtual machines.
* Three virtual machines to be used as backend servers for the load balancer.

### Create network interfaces for the virtual machines

Create three network interfaces with [az network nic create](/cli/azure/network/nic#az_network_nic_create):

* Named **myNicVM1**, **myNicVM2**, and **myNicVM3**.
* In resource group **CreatePubLBQS-rg**.
* In virtual network **myVNet**.
* In subnet **myBackendSubnet**.
* In network security group **myNSG**.

```azurecli-interactive
  array=(myNicVM1 myNicVM2 myNicVM3)
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

### Create virtual machines

Create the virtual machines with [az vm create](/cli/azure/vm#az_vm_create):

### VM1
* Named **myVM1**.
* In resource group **CreatePubLBQS-rg**.
* Attached to network interface **myNicVM1**.
* Virtual machine image **win2019datacenter**.
* In **Zone 1**.

```azurecli-interactive
  az vm create \
    --resource-group CreatePubLBQS-rg \
    --name myVM1 \
    --nics myNicVM1 \
    --image win2019datacenter \
    --admin-username azureuser \
    --zone 1 \
    --no-wait
```
#### VM2
* Named **myVM2**.
* In resource group **CreatePubLBQS-rg**.
* Attached to network interface **myNicVM2**.
* Virtual machine image **win2019datacenter**.
* In **Zone 2**.

```azurecli-interactive
  az vm create \
    --resource-group CreatePubLBQS-rg \
    --name myVM2 \
    --nics myNicVM2 \
    --image win2019datacenter \
    --admin-username azureuser \
    --zone 2 \
    --no-wait
```

#### VM3
* Named **myVM3**.
* In resource group **CreatePubLBQS-rg**.
* Attached to network interface **myNicVM3**.
* Virtual machine image **win2019datacenter**.
* In **Zone 3**.

```azurecli-interactive
   az vm create \
    --resource-group CreatePubLBQS-rg \
    --name myVM3 \
    --nics myNicVM3 \
    --image win2019datacenter \
    --admin-username azureuser \
    --zone 3 \
    --no-wait
```
It may take a few minutes for the VMs to deploy.

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Create a public IP address - Standard

To access your web app on the Internet, you need a public IP address for the load balancer. 

Use [az network public-ip create](/cli/azure/network/public-ip#az_network_public_ip_create) to:

* Create a standard zone redundant public IP address named **myPublicIP**.
* In **CreatePubLBQS-rg**.

```azurecli-interactive
  az network public-ip create \
    --resource-group CreatePubLBQS-rg \
    --name myPublicIP \
    --sku Standard
```

To create a zonal redundant public IP address in Zone 1:

```azurecli-interactive
  az network public-ip create \
    --resource-group CreatePubLBQS-rg \
    --name myPublicIP \
    --sku Standard \
    --zone 1
```

## Create standard load balancer

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
* Associated with the public IP address **myPublicIP** that you created in the preceding step. 

```azurecli-interactive
  az network lb create \
    --resource-group CreatePubLBQS-rg \
    --name myLoadBalancer \
    --sku Standard \
    --public-ip-address myPublicIP \
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
    --resource-group CreatePubLBQS-rg \
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
    --resource-group CreatePubLBQS-rg \
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
### Add virtual machines to load balancer backend pool

Add the virtual machines to the backend pool with [az network nic ip-config address-pool add](/cli/azure/network/nic/ip-config/address-pool#az_network_nic_ip_config_address_pool_add):

* In backend address pool **myBackEndPool**.
* In resource group **CreatePubLBQS-rg**.
* Associated with load balancer **myLoadBalancer**.

```azurecli-interactive
  array=(myNicVM1 myNicVM2 myNicVM3)
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

## Create outbound rule configuration
Load balancer outbound rules configure outbound SNAT for VMs in the backend pool. 

For more information on outbound connections, see [Outbound connections in Azure](load-balancer-outbound-connections.md).

A public IP or prefix can be used for the outbound configuration.

### Public IP

Use [az network public-ip create](/cli/azure/network/public-ip#az_network_public_ip_create) to create a single IP for the outbound connectivity.  

* Named **myPublicIPOutbound**.
* In **CreatePubLBQS-rg**.

```azurecli-interactive
  az network public-ip create \
    --resource-group CreatePubLBQS-rg \
    --name myPublicIPOutbound \
    --sku Standard
```

To create a zonal redundant public IP address in Zone 1:

```azurecli-interactive
  az network public-ip create \
    --resource-group CreatePubLBQS-rg \
    --name myPublicIPOutbound \
    --sku Standard \
    --zone 1
```

### Public IP Prefix

Use [az network public-ip prefix create](/cli/azure/network/public-ip/prefix#az_network_public_ip_prefix_create) to create a public IP prefix for the outbound connectivity.

* Named **myPublicIPPrefixOutbound**.
* In **CreatePubLBQS-rg**.
* Prefix length of **28**.

```azurecli-interactive
  az network public-ip prefix create \
    --resource-group CreatePubLBQS-rg \
    --name myPublicIPPrefixOutbound \
    --length 28
```
To create a zonal redundant public IP prefix in Zone 1:

```azurecli-interactive
  az network public-ip prefix create \
    --resource-group CreatePubLBQS-rg \
    --name myPublicIPPrefixOutbound \
    --length 28 \
    --zone 1
```

For more information on scaling outbound NAT and outbound connectivity, see [Scale outbound NAT with multiple IP addresses](load-balancer-outbound-connections.md).

### Create outbound frontend IP configuration

Create a new frontend IP configuration with [az network lb frontend-ip create
](/cli/azure/network/lb/frontend-ip#az_network_lb_frontend_ip_create):

Select the public IP or public IP prefix commands based on decision in previous step.

#### Public IP

* Named **myFrontEndOutbound**.
* In resource group **CreatePubLBQS-rg**.
* Associated with public IP address **myPublicIPOutbound**.
* Associated with load balancer **myLoadBalancer**.

```azurecli-interactive
  az network lb frontend-ip create \
    --resource-group CreatePubLBQS-rg \
    --name myFrontEndOutbound \
    --lb-name myLoadBalancer \
    --public-ip-address myPublicIPOutbound 
```

#### Public IP prefix

* Named **myFrontEndOutbound**.
* In resource group **CreatePubLBQS-rg**.
* Associated with public IP prefix **myPublicIPPrefixOutbound**.
* Associated with load balancer **myLoadBalancer**.

```azurecli-interactive
  az network lb frontend-ip create \
    --resource-group CreatePubLBQS-rg \
    --name myFrontEndOutbound \
    --lb-name myLoadBalancer \
    --public-ip-prefix myPublicIPPrefixOutbound 
```

### Create outbound pool

Create a new outbound pool with [az network lb address-pool create](/cli/azure/network/lb/address-pool#az_network_lb_address_pool_create):

* Named **myBackEndPoolOutbound**.
* In resource group **CreatePubLBQS-rg**.
* Associated with load balancer **myLoadBalancer**.

```azurecli-interactive
  az network lb address-pool create \
    --resource-group CreatePubLBQS-rg \
    --lb-name myLoadBalancer \
    --name myBackendPoolOutbound
```
### Create outbound rule

Create a new outbound rule for the outbound backend pool with [az network lb outbound-rule create](/cli/azure/network/lb/outbound-rule#az_network_lb_outbound_rule_create):

* Named **myOutboundRule**.
* In resource group **CreatePubLBQS-rg**.
* Associated with load balancer **myLoadBalancer**
* Associated with frontend **myFrontEndOutbound**.
* Protocol **All**.
* Idle timeout of **15**.
* **10000** outbound ports.
* Associated with backend pool **myBackEndPoolOutbound**.

```azurecli-interactive
  az network lb outbound-rule create \
    --resource-group CreatePubLBQS-rg \
    --lb-name myLoadBalancer \
    --name myOutboundRule \
    --frontend-ip-configs myFrontEndOutbound \
    --protocol All \
    --idle-timeout 15 \
    --outbound-ports 10000 \
    --address-pool myBackEndPoolOutbound
```
### Add virtual machines to outbound pool

Add the virtual machines to the outbound pool with [az network nic ip-config address-pool add](/cli/azure/network/nic/ip-config/address-pool#az_network_nic_ip_config_address_pool_add):


* In backend address pool **myBackEndPoolOutbound**.
* In resource group **CreatePubLBQS-rg**.
* Associated with load balancer **myLoadBalancer**.

```azurecli-interactive
  array=(myNicVM1 myNicVM2 myNicVM3)
  for vmnic in "${array[@]}"
  do
    az network nic ip-config address-pool add \
     --address-pool myBackendPoolOutbound \
     --ip-config-name ipconfig1 \
     --nic-name $vmnic \
     --resource-group CreatePubLBQS-rg \
     --lb-name myLoadBalancer
  done
```

# [**Basic SKU**](#tab/option-1-create-load-balancer-basic)

>[!NOTE]
>Standard SKU load balancer is recommended for production workloads. For more information about skus, see **[Azure Load Balancer SKUs](skus.md)**.

:::image type="content" source="./media/quickstart-load-balancer-standard-public-portal/resources-diagram-basic.png" alt-text="Basic load balancer resources created in quickstart." border="false":::m

## Configure virtual network - Basic

Before you deploy VMs and test your load balancer, create the supporting virtual network resources.

### Create a virtual network

Create a virtual network using [az network vnet create](/cli/azure/network/vnet#az_network_vnet_create):

* Named **myVNet**.
* Address prefix of **10.1.0.0/16**.
* Subnet named **myBackendSubnet**.
* Subnet prefix of **10.1.0.0/24**.
* In the **CreatePubLBQS-rg** resource group.
* Location of **eastus**.

```azurecli-interactive
  az network vnet create \
    --resource-group CreatePubLBQS-rg \
    --location eastus \
    --name myVNet \
    --address-prefixes 10.1.0.0/16 \
    --subnet-name myBackendSubnet \
    --subnet-prefixes 10.1.0.0/24
```

### Create a public IP address

Use [az network public-ip create](/cli/azure/network/public-ip#az_network_public_ip_create) to create a public ip address for the bastion host:

* Create a standard zone redundant public IP address named **myBastionIP**.
* In **CreatePubLBQS-rg**.

```azurecli-interactive
az network public-ip create \
    --resource-group CreatePubLBQS-rg \
    --name myBastionIP \
    --sku Standard
```
### Create a bastion subnet

Use [az network vnet subnet create](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_create) to create a bastion subnet:

* Named **AzureBastionSubnet**.
* Address prefix of **10.1.1.0/24**.
* In virtual network **myVNet**.
* In resource group **CreatePubLBQS-rg**.

```azurecli-interactive
az network vnet subnet create \
    --resource-group CreatePubLBQS-rg \
    --name AzureBastionSubnet \
    --vnet-name myVNet \
    --address-prefixes 10.1.1.0/24
```

### Create bastion host

Use [az network bastion create](/cli/azure/network/bastion#az_network_bastion_create) to create a bastion host:

* Named **myBastionHost**.
* In **CreatePubLBQS-rg**.
* Associated with public IP **myBastionIP**.
* Associated with virtual network **myVNet**.
* In **eastus** location.

```azurecli-interactive
az network bastion create \
    --resource-group CreatePubLBQS-rg \
    --name myBastionHost \
    --public-ip-address myBastionIP \
    --vnet-name myVNet \
    --location eastus
```

It can take a few minutes for the Azure Bastion host to deploy.

### Create a network security group

For a standard load balancer, the VMs in the backend address for are required to have network interfaces that belong to a network security group. 

Create a network security group using [az network nsg create](/cli/azure/network/nsg#az_network_nsg_create):

* Named **myNSG**.
* In resource group **CreatePubLBQS-rg**.

```azurecli-interactive
  az network nsg create \
    --resource-group CreatePubLBQS-rg \
    --name myNSG
```

### Create a network security group rule

Create a network security group rule using [az network nsg rule create](/cli/azure/network/nsg/rule#az_network_nsg_rule_create):

* Named **myNSGRuleHTTP**.
* In the network security group you created in the previous step, **myNSG**.
* In resource group **CreatePubLBQS-rg**.
* Protocol **(*)**.
* Direction **Inbound**.
* Source **(*)**.
* Destination **(*)**.
* Destination port **Port 80**.
* Access **Allow**.
* Priority **200**.

```azurecli-interactive
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

## Create backend servers - Basic

In this section, you create:

* Three network interfaces for the virtual machines.
* Availability set for the virtual machines
* Three virtual machines to be used as backend servers for the load balancer.


### Create network interfaces for the virtual machines

Create three network interfaces with [az network nic create](/cli/azure/network/nic#az_network_nic_create):


* Named **myNicVM1**, **myNicVM2**, and **myNicVM3**.
* In resource group **CreatePubLBQS-rg**.
* In virtual network **myVNet**.
* In subnet **myBackendSubnet**.
* In network security group **myNSG**.

```azurecli-interactive
  array=(myNicVM1 myNicVM2 myNicVM3)
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

Create the availability set with [az vm availability-set create](/cli/azure/vm/availability-set#az_vm_availability_set_create):

* Named **myAvSet**.
* In resource group **CreatePubLBQS-rg**.
* Location **eastus**.

```azurecli-interactive
  az vm availability-set create \
    --name myAvSet \
    --resource-group CreatePubLBQS-rg \
    --location eastus 
    
```

### Create virtual machines

Create the virtual machines with [az vm create](/cli/azure/vm#az_vm_create):

### VM1
* Named **myVM1**.
* In resource group **CreatePubLBQS-rg**.
* Attached to network interface **myNicVM1**.
* Virtual machine image **win2019datacenter**.
* In **Zone 1**.

```azurecli-interactive
  az vm create \
    --resource-group CreatePubLBQS-rg \
    --name myVM1 \
    --nics myNicVM1 \
    --image win2019datacenter \
    --admin-username azureuser \
    --availability-set myAvSet \
    --no-wait
```
#### VM2
* Named **myVM2**.
* In resource group **CreatePubLBQS-rg**.
* Attached to network interface **myNicVM2**.
* Virtual machine image **win2019datacenter**.
* In **Zone 2**.

```azurecli-interactive
  az vm create \
    --resource-group CreatePubLBQS-rg \
    --name myVM2 \
    --nics myNicVM2 \
    --image win2019datacenter \
    --admin-username azureuser \
    --availability-set myAvSet \
    --no-wait
```

#### VM3
* Named **myVM3**.
* In resource group **CreatePubLBQS-rg**.
* Attached to network interface **myNicVM3**.
* Virtual machine image **win2019datacenter**.
* In **Zone 3**.

```azurecli-interactive
   az vm create \
    --resource-group CreatePubLBQS-rg \
    --name myVM3 \
    --nics myNicVM3 \
    --image win2019datacenter \
    --admin-username azureuser \
    --availability-set myAvSet \
    --no-wait
```
It may take a few minutes for the VMs to deploy.

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Create a public IP address - Basic

To access your web app on the Internet, you need a public IP address for the load balancer. 

Use [az network public-ip create](/cli/azure/network/public-ip#az_network_public_ip_create) to:

* Create a standard zone redundant public IP address named **myPublicIP**.
* In **CreatePubLBQS-rg**.

```azurecli-interactive
  az network public-ip create \
    --resource-group CreatePubLBQS-rg \
    --name myPublicIP \
    --sku Basic
```

## Create basic load balancer

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
* Associated with the public IP address **myPublicIP** that you created in the preceding step. 

```azurecli-interactive
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

Create a health probe with [az network lb probe create](/cli/azure/network/lb/probe#az_network_lb_probe_create):

* Monitors the health of the virtual machines.
* Named **myHealthProbe**.
* Protocol **TCP**.
* Monitoring **Port 80**.

```azurecli-interactive
  az network lb probe create \
    --resource-group CreatePubLBQS-rg \
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

```azurecli-interactive
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

### Add virtual machines to load balancer backend pool

Add the virtual machines to the backend pool with [az network nic ip-config address-pool add](/cli/azure/network/nic/ip-config/address-pool#az_network_nic_ip_config_address_pool_add):

* In backend address pool **myBackEndPool**.
* In resource group **CreatePubLBQS-rg**.
* Associated with load balancer **myLoadBalancer**.

```azurecli-interactive
  array=(myNicVM1 myNicVM2 myNicVM3)
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

---

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
       --resource-group CreatePubLBQS-rg \
       --settings '{"commandToExecute":"powershell Add-WindowsFeature Web-Server; powershell Add-Content -Path \"C:\\inetpub\\wwwroot\\Default.htm\" -Value $($env:computername)"}'
  done

```

## Test the load balancer

To get the public IP address of the load balancer, use [az network public-ip show](/cli/azure/network/public-ip#az_network_public_ip_show). 

Copy the public IP address, and then paste it into the address bar of your browser.

```azurecli-interactive
  az network public-ip show \
    --resource-group CreatePubLBQS-rg \
    --name myPublicIP \
    --query ipAddress \
    --output tsv
```
:::image type="content" source="./media/load-balancer-standard-public-cli/running-nodejs-app.png" alt-text="Test the load balancer" border="true":::

## Clean up resources

When no longer needed, use the [az group delete](/cli/azure/group#az_group_delete) command to remove the resource group, load balancer, and all related resources.

```azurecli-interactive
  az group delete \
    --name CreatePubLBQS-rg
```

## Next steps

In this quickstart

* You created a standard or public load balancer
* Attached virtual machines. 
* Configured the load balancer traffic rule and health probe.
* Tested the load balancer.

To learn more about Azure Load Balancer, continue to:
> [!div class="nextstepaction"]
> [What is Azure Load Balancer?](load-balancer-overview.md)