---
title: Create an internal Basic Load Balancer - Azure CLI
titlesuffix: Azure Load Balancer
description: Learn how to create an internal load balancer using the Azure CLI
services: load-balancer
documentationcenter: na
author: KumudD
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.custom: seodec18
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 06/27/2018
ms.author: kumud
---
# Create an internal load balancer to load balance VMs using Azure CLI

This article shows you how to create an internal load balancer to load balance VMs. To test the load balancer, you deploy two virtual machines (VMs) running Ubuntu server to load balance a web app.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)] 

If you choose to install and use the CLI locally, this tutorial requires that you are running a version of the Azure CLI version 2.0.28 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

## Create a resource group

Create a resource group with [az group create](https://docs.microsoft.com/cli/azure/group). An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named *myResourceGroupILB* in the *eastus* location:

```azurecli-interactive
  az group create \
    --name myResourceGroupILB \
    --location eastus
```
## Create a virtual network

Create a virtual network named *myVnet* with a subnet named *mySubnet* in the *myResourceGroup* using [az network vnet create](https://docs.microsoft.com/cli/azure/network/vnet).

```azurecli-interactive
  az network vnet create \
    --name myVnet \
    --resource-group myResourceGroupILB \
    --location eastus \
    --subnet-name mySubnet
```
## Create Basic Load Balancer

This section details how you can create and configure the following components of the load balancer:
  - a frontend IP configuration that receives the incoming network traffic on the load balancer.
  - a backend IP pool where the frontend pool sends the load balanced network traffic.
  - a health probe that determines health of the backend VM instances.
  - a load balancer rule that defines how traffic is distributed to the VMs.

### Create the load balancer

Create an internal Load Balancer with [az network lb create](https://docs.microsoft.com/cli/azure/network/lb?view=azure-cli-latest) named **myLoadBalancer** that includes a frontend IP configuration named **myFrontEnd**, a back-end pool named **myBackEndPool** that is associated with a private IP address **10.0.0.7.

```azurecli-interactive
  az network lb create \
    --resource-group myResourceGroupILB \
    --name myLoadBalancer \
    --frontend-ip-name myFrontEnd \
    --private-ip-address 10.0.0.7 \
    --backend-pool-name myBackEndPool \
    --vnet-name myVnet \
    --subnet mySubnet      
  ```
### Create the health probe

A health probe checks all virtual machine instances to make sure they can receive network traffic. The virtual machine instance with failed probe checks is removed from the load balancer until it goes back online and a probe check determines that it's healthy. Create a health probe with [az network lb probe create](https://docs.microsoft.com/cli/azure/network/lb/probe?view=azure-cli-latest) to monitor the health of the virtual machines. 

```azurecli-interactive
  az network lb probe create \
    --resource-group myResourceGroupILB \
    --lb-name myLoadBalancer \
    --name myHealthProbe \
    --protocol tcp \
    --port 80   
```

### Create the load balancer rule

A load balancer rule defines the front-end IP configuration for the incoming traffic and the back-end IP pool to receive the traffic, along with the required source and destination port. Create a load balancer rule *myHTTPRule* with [az network lb rule create](https://docs.microsoft.com/cli/azure/network/lb/rule?view=azure-cli-latest) for listening to port 80 in the frontend pool *myFrontEnd* and sending load-balanced network traffic to the backend address pool *myBackEndPool* also using port 80. 

```azurecli-interactive
  az network lb rule create \
    --resource-group myResourceGroupILB \
    --lb-name myLoadBalancer \
    --name myHTTPRule \
    --protocol tcp \
    --frontend-port 80 \
    --backend-port 80 \
    --frontend-ip-name myFrontEnd \
    --backend-pool-name myBackEndPool \
    --probe-name myHealthProbe  
```

## Create servers for the backend address pool

Before you deploy some VMs and can test your load balancer, create the supporting virtual network resources.

### Create NICs

Create two network interfaces with [az network nic create](/cli/azure/network/nic#az-network-nic-create) and associate them with the private IP address. 

```azurecli-interactive
for i in `seq 1 2`; do
  az network nic create \
    --resource-group myResourceGroupILB \
    --name myNic$i \
    --vnet-name myVnet \
    --subnet mySubnet \
    --lb-name myLoadBalancer \
    --lb-address-pools myBackEndPool
done
```

## Create backend servers

In this example, you create two virtual machines to be used as backend servers for the load balancer. To verify that the load balancer was successfully created, you also install NGINX on the virtual machines.

### Create an Availability set

Create an availability set with [az vm availabilityset create](/cli/azure/network/nic)

 ```azurecli-interactive
  az vm availability-set create \
    --resource-group myResourceGroupILB \
    --name myAvailabilitySet
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
 
Create the virtual machines with [az vm create](/cli/azure/vm#az-vm-create).

 ```azurecli-interactive
for i in `seq 1 2`; do
  az vm create \
    --resource-group myResourceGroupILB \
    --name myVM$i \
    --availability-set myAvailabilitySet \
    --nics myNic$i \
    --image UbuntuLTS \
    --generate-ssh-keys \
    --custom-data cloud-init.txt
    done
```
It may take a few minutes for the VMs to get deployed.

### Create a VM for testing the load balancer

To test the load balancer, create a virtual machine, *myVMTest*, and associate it to *myNic3*.

```azurecli-interactive
 az vm create \
    --resource-group myResourceGroupILB \
    --name myVMTest \
    --image win2016datacenter \
    --admin-username azureuser \
    --admin-password myPassword123456!
```

## Test the internal load balancer

To test the load balancer, you must first obtain the private IP address of the load balancer. Next, sign in to virtual machine myVMTest, and type the private IP address into the address bar of its web browser.

To get the private IP address of the load balancer, use [az network lb show](/cli/azure/network/public-ip). Copy the private IP address, and then paste it into the address bar of a web browser of your virtual machine - *myVMTest*.

```azurecli-interactive
  az network lb show \
    --name myLoadBalancer \
    --resource-group myResourceGroupILB
``` 
![Test load balancer](./media/load-balancer-get-started-ilb-arm-cli/load-balancer-test.png)

## Clean up resources

When no longer needed, you can use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, load balancer, and all related resources.

```azurecli-interactive 
  az group delete --name myResourceGroupILB
```


## Next steps
In this article, you created an internal Basic Load Balancer, attached VMs to it, configured the load balancer traffic rule, health probe, and then tested the load balancer. To learn more about load balancers and their associated resources, continue to the how-to articles.
