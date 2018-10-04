---
title: Create a public Load Balancer Standard with zonal Public IP address frontend using Azure CLI | Microsoft Docs
description: Learn how to create a public Load Balancer Standard with zonal Public IP address frontend using Azure CLI
services: load-balancer
documentationcenter: na
author: KumudD
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/26/2018
ms.author: kumud
---

#  Create a public Load Balancer Standard with zonal frontend using Azure CLI

This article steps through creating a public [Load Balancer Standard](https://aka.ms/azureloadbalancerstandard) with a zonal frontend using a Public IP Standard address. In this scenario, you specify a particular zone for your front-end and back-end instances, to align your data path and resources with a specific zone.

For more information about using Availability zones with Standard Load Balancer, see [Standard Load Balancer and Availability Zones](load-balancer-standard-availability-zones.md).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
 

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, make sure that you have installed the latest [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) and are logged in to an Azure account with [az login](https://docs.microsoft.com/cli/azure/reference-index?view=azure-cli-latest#az_login).

> [!NOTE]
 Support for Availability Zones is available for select Azure resources and regions, and VM size families. For more information on how to get started, and which Azure resources, regions, and VM size families you can try availability zones with, see [Overview of Availability Zones](https://docs.microsoft.com/azure/availability-zones/az-overview). For support, you can reach out on [StackOverflow](https://stackoverflow.com/questions/tagged/azure-availability-zones) or [open an Azure support ticket](../azure-supportability/how-to-create-azure-support-request.md?toc=%2fazure%2fvirtual-network%2ftoc.json).  

## Create a resource group

Create a resource group with [az group create](/cli/azure/group#az-group-create). An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named *myResourceGroupLB* in the *westeurope* location:

```azurecli-interactive
az group create \
--name myResourceGroupLB \
--location westeurope
```

## Create a zonal public IP Standard
To access your app on the Internet, you need a public IP address for the load balancer. A Public IP address that is created in a specific zone always exists only in that zone. It is not possible to change the zone of a Public IP address.

Create a public IP address with [New-AzureRmPublicIpAddress](/powershell/module/azurerm.network/new-azurermpublicipaddress). The following example creates a zonal public IP address named *myPublicIP* in the *myResourceGroupLoadBalancer* resource group in zone 1.

```azurecli-interactive
az network public-ip create \
--resource-group myResourceGroupLB \
--name myPublicIP \
--sku Standard \
--zone 1
```

## Create Azure Load Balancer Standard
This section details how you can create and configure the following components of the load balancer:
- a frontend IP pool that receives the incoming network traffic on the load balancer.
- a backend IP pool where the frontend pool sends the load balanced network traffic.
- a health probe that determines health of the backend VM instances.
- a load balancer rule that defines how traffic is distributed to the VMs.

### Create the load balancer
Create a Standard load balancer with [az network lb create](/cli/azure/network/lb#az-network-lb-create). The following example creates a load balancer named *myLoadBalancer* and assigns the *myPublicIP* address to the front-end IP configuration.

```azurecli-interactive
az network lb create \
--resource-group myResourceGroupLB \
--name myLoadBalancer \
--public-ip-address myPublicIP \
--frontend-ip-name myFrontEndPool \
--backend-pool-name myBackEndPool \
--sku Standard
```

## Create health probe on port 80

A health probe checks all virtual machine instances to make sure they can send network traffic. The virtual machine instance with failed probe checks is removed from the load balancer until it goes back online and a probe check determines that it's healthy. Create a health probe with az network lb probe create to monitor the health of the virtual machines. 
To create a TCP health probe, you use [az network lb probe create](/cli/azure/network/lb/probe#az-network-lb-probe-create). The following example creates a health probe named *myHealthProbe*:

```azurecli-interactive
az network lb probe create \
--resource-group myResourceGroupLB \
--lb-name myLoadBalancer \
--name myHealthProbe \
--protocol tcp \
--port 80
```

## Create load balancer rule for port 80
A load balancer rule defines the front-end IP configuration for the incoming traffic and the back-end IP pool to receive the traffic, along with the required source and destination port. 
Create a load balancer rule *myLoadBalancerRuleWeb* with [az network lb rule create](/cli/azure/network/lb/rule#az-network-lb-rule-create) for listening to port 80 in the frontend pool *myFrontEndPool* and sending load-balanced network traffic to the backend address pool *myBackEndPool* also using port 80.

```azurecli-interactive
az network lb rule create \
--resource-group myResourceGroupLB \
--lb-name myLoadBalancer \
--name myLoadBalancerRuleWeb \
--protocol tcp \
--frontend-port 80 \
--backend-port 80 \
--frontend-ip-name myFrontEndPool \
--backend-pool-name myBackEndPool \
--probe-name myHealthProbe
```

## Configure virtual network
Before you deploy some VMs and can test your load balancer, create the supporting virtual network resources.

### Create a virtual network

Create a virtual network named *myVnet* with a subnet named *mySubnet* in the myResourceGroup using [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create).


```azurecli-interactive
az network vnet create \
--resource-group myResourceGroupLB \
--location westeurope \
--name myVnet \
--subnet-name mySubnet
```

### Create a network security group

Create network security group named *myNetworkSecurityGroup* to define inbound connections to your virtual network  with [az network nsg create](/cli/azure/network/nsg#az-network-nsg-create).

```azurecli-interactive
az network nsg create \
--resource-group myResourceGroupLB \
--name myNetworkSecurityGroup
```

Create a network security group rule named *myNetworkSecurityGroupRule* for port 80 with [az network nsg rule create](/cli/azure/network/nsg/rule#az-network-nsg-rule-create).

```azurecli-interactive
az network nsg rule create \
--resource-group myResourceGroupLB \
--nsg-name myNetworkSecurityGroup \
--name myNetworkSecurityGroupRule \
--protocol tcp \
--direction inbound \
--source-address-prefix '*' \
--source-port-range '*' \
--destination-address-prefix '*' \
--destination-port-range 80 \
--access allow \
--priority 200
```
### Create NICs
Create three virtual NICs with [az network nic create](/cli/azure/network/nic#az-network-nic-create) and associate them with the Public IP address and the network security group. The following example creates three virtual NICs. (One virtual NIC for each VM you create for your app in the following steps). You can create additional virtual NICs and VMs at any time and add them to the load balancer:

```azurecli-interactive
for i in `seq 1 3`; do
    az network nic create \
        --resource-group myResourceGroupLB \
        --name myNic$i \
        --vnet-name myVnet \
        --subnet mySubnet \
        --network-security-group myNetworkSecurityGroup \
        --lb-name myLoadBalancer \
        --lb-address-pools myBackEndPool
done
```
## Create backend servers
In this example, you create three virtual machines located in zone 1 to be used as backend servers for the load balancer. You also install NGINX on the virtual machines to verify that the load balancer was successfully created.

### Create cloud-init config

You can use a cloud-init configuration file to install NGINX and run a 'Hello World' Node.js app on a Linux virtual machine. In your current shell, create a file named cloud-init.txt and copy and paste the following configuration into the shell. Make sure that you copy the whole cloud-init file correctly, especially the first line:

```yaml
#cloud-config
package_upgrade: true
packages:
  - nginx
  - nodejs
  - npm
write_files:
  - owner: www-data:www-data
  - path: /etc/nginx/sites-available/default
    content: |
      server {
        listen 80;
        location / {
          proxy_pass http://localhost:3000;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection keep-alive;
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;
        }
      }
  - owner: azureuser:azureuser
  - path: /home/azureuser/myapp/index.js
    content: |
      var express = require('express')
      var app = express()
      var os = require('os');
      app.get('/', function (req, res) {
        res.send('Hello World from host ' + os.hostname() + '!')
      })
      app.listen(3000, function () {
        console.log('Hello world app listening on port 3000!')
      })
runcmd:
  - service nginx restart
  - cd "/home/azureuser/myapp"
  - npm init
  - npm install express -y
  - nodejs index.js
```

### Create the zonal virtual machines
Create the VMs with [az vm create](/cli/azure/vm#az-vm-create). The following example creates three VMs in zone 1 and generates SSH keys if they do not already exist:

```azurecli-interactive
for i in `seq 1 3`; do
 az vm create \
--resource-group myResourceGroupLB \
--name myVM$i \
--nics myNic$i \
--image UbuntuLTS \
--generate-ssh-keys \
--zone 1 \
--custom-data cloud-init.txt
done
```

## Test the load balancer
Get the public IP address of the load balancer using [az network public-ip show](/cli/azure/network/public-ip#az-network-public-ip-show). 

```azurecli-interactive
  az network public-ip show \
    --resource-group myResourceGroupSLB \
    --name myPublicIP \
    --query [ipAddress] \
    --output tsv
``` 

You can then enter the public IP address in to a web browser. Remember - it takes a few minutes for the VMs to be ready before the load balancer starts to distribute traffic to them. The app is displayed, including the hostname of the VM that the load balancer distributed traffic to as in the following example:

![Running Node.js app](./media/load-balancer-standard-public-zonal-cli/running-nodejs-app.png)

To see the load balancer distribute traffic to VMs within zone 1 that are running your app, you can force-refresh your web browser.

## Next steps
- Learn more about [Standard Load Balancer](./load-balancer-standard-overview.md).



