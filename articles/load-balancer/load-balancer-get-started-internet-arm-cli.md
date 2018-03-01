---
title: Create a public load balancer - Azure CLI | Microsoft Docs
description: Learn how to create a public load balancer using the Azure CLI
services: load-balancer
documentationcenter: na
author: KumudD
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: a8bcdd88-f94c-4537-8143-c710eaa86818
ms.service: load-balancer
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/01/2017
ms.author: kumud
---
# Creating a public load balancer using the Azure CLI

The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This quickstart details using the Azure CLI to create and configure load balancer to load balance web apps between two VMs running Ubuntu server.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)] 

If you choose to install and use the CLI locally, this tutorial requires that you are running a version of the Azure CLI greater than version 2.0.17. To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

## Create a resource group

Create a resource group with [az group create](https://docs.microsoft.com/cli/azure/group#create). An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named *myResourceGroupLB* in the *easts* location:

```azurecli-interactive
  az group create --name myResourceGroupLB --location eastus
```

## Create a virtual network

Create a virtual network named *myVnet* with a subnet named *mySubnet* in the *myResourceGroup* using [az network vnet create](https://docs.microsoft.com/cli/azure/network/vnet#create).

```azurecli-interactive
  az network vnet create --resource-group myResourceGroupLB --location eastus --name myVnet --subnet-name mySubnet
```
## Create a public IP address

To access your web app on the Internet, you need a public IP address for the load balancer. Use [az network public-ip create](https://docs.microsoft.com/cli/azure/network/public-ip#create) to create a public IP address named *myPublicIP* in *myResourceGroup*.

```azurecli-interactive
  az network public-ip create --resource-group myResourceGroupLB --name myPublicIP
```

## Create the load balancer and configure its settings

Create a public Azure Load Balancer with [az network lb create](https://docs.microsoft.com/cli/azure/network/lb?view=azure-cli-latest#create) named **myLoadBalancer** that includes a frontend pool named **myFrontEndPool**, a back-end pool named **myBackEndPool** that is associated with the public IP address **myPublicIP** that you created in the preceding step.

### Create the load balancer

Create load balancer, the frontend IP pool that receives the incoming network traffic on the load balancer, and the backend IP pool where the front-end pool sends the load balanced network traffic.

```azurecli-interactive
  az network lb create \
  --resource-group myResourceGroupLB \
  --name myLoadBalancer \
  --public-ip-address myPublicIP \ 
  --frontend-ip-name myFrontEndPool \
  --backend-pool-name myBackEndPool
       
  ```

### Create the health probe

A health probe checks all virtual machine instances to make sure they can send network traffic. The virtual machine instance with failed probe checks is removed from the load balancer until it goes back online and a probe check determines that it's healthy. Create a health probe with [az network lb probe create](https://docs.microsoft.com/cli/azure/network/lb/probe?view=azure-cli-latest#create) to monitor the health of the virtual machines. 

```azurecli-interactive
  az network lb probe create \
  --resource-group myResourceGroupLB \
  --lb-name myLoadBalancer \ 
  --name myHealthProbe \
  --protocol tcp --port 80     
```
### Create the load balancer rule

In this step, you create a load balancer rule myLoadBalancerRuleWeb with [az network lb rule create](https://docs.microsoft.com/cli/azure/network/lb/rule?view=azure-cli-latest#create) for listening to port 80 in the front-end pool myFrontEndPool and sending load-balanced network traffic to the back-end address pool myBackEndPool, also using port 80. 

```azurecli-interactive
  az network lb rule create \
  --resource-group myResourceGroupLB \
  --lb-name myLoadBalancer --name myHTTPRule \
  --protocol tcp --frontend-port 80 --backend-port 80 \
  --frontend-ip-name myFrontEndPool \ 
  --backend-pool-name myBackEndPool \
  --probe-name myHealthProbe   
  
```
## Create backend servers

In this example, you create two virtual machines to be used as backend servers for the load balancer. You also install NGINX on the virtual machines to verify that the load balancer was successfully created.

###  Create a network security group
Create network security group to define inbound connections to your virtual network.

```azurecli-interactive
  az network nsg create --resource-group myResourceGroupLB --name myNetworkSecurityGroup
```

Create a network security group rule to allow for ssh connections through port 22 to the backend VMs.

```azurecli-interactive
  az network nsg rule create --resource-group myResourceGroupLB --nsg-name myNetworkSecurityGroup --name myNetworkSecurityGroupRuleSSH \
  --protocol tcp --direction inbound --source-address-prefix '*' --source-port-range '*'  \
  --destination-address-prefix '*' --destination-port-range 22 --access allow --priority 100

```
Create a network security group rule to allow inbound connections through port 80.

```azurecli-interactive
  az network nsg rule create --resource-group myResourceGroupLB --nsg-name myNetworkSecurityGroup --name myNetworkSecurityGroupRuleHTTP \
  --protocol tcp --direction inbound --priority 1001 --source-address-prefix '*' --source-port-range '*' \
  --destination-address-prefix '*' --destination-port-range 80 --access allow --priority 200

```

### Create two virtual machines

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

Create an availability set with [az vm availabilityset create](/cli/azure/network/nic#az_network_availabilityset_create)

 ```azurecli-interactive
    az vm availability-set create --resource-group myResourceGroupLB --name myAvailabilitySet

```

Create the network interfaces with [az network nic create](/cli/azure/network/nic#az_network_nic_create). 

```azurecli-interactive
for i in `seq 1 2`; do
  az network nic create \
    --resource-group myResourceGroupLBCLI \
    --name myNic$i \
    --vnet-name myVNet \
    --subnet mySubnet
    --lb-address-pools myBackEndPool
   done
```
  
Create the virtual machines with [az vm create](/cli/azure/vm#az_vm_create).

```azurecli-interactive
for i in `seq 1 2`; do
az vm create \
    --resource-group myResourceGroupLBCLI \
    --name myVM$i \
    --availabilityset myAvailabilitySet
    --nics myNic$i \
    --image UbuntuLTS \
    --admin-username azureuser \
    --generate-ssh-keys \
    --custom-data cloud-init.txt
done
```

## Test the load balancer

To get the public IP address of the load balancer, use [az network public-ip show](/cli/azure/network/public-ip#az_network_public_ip_show). Copy the public IP address, and then paste it into the address bar of your browser.

```azurepowershell-interactive
az network public-ip show \
  --resource-group myResourceGroupLBCLI \
  --name myPublicIP \
  --query [ipAddress] \
  --output tsv
``` 

## Clean up resources

When no longer needed, you can use the [az group delete](/cli/azure/group#az_group_delete) command to remove the resource group, load balancer, and all related resources.

```azurecli-interactive 
az group delete --name myResourceGroupLB
```


## Next steps
In this quickstart, you created a resource group, network resources, and backend servers. You then used those resources to create an application gateway. To learn more about application gateways and their associated resources, continue to the how-to articles.
