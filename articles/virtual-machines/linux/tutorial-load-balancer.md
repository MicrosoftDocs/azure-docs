---
title: How to load balance virtual machines in Azure | Microsoft Docs
description: Learn how to use the Azure load balancer to create a highly available and secure application across three Linux VMs
services: virtual-machines-linux
documentationcenter: virtual-machines
author: iainfoulds
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 04/13/2017
ms.author: iainfou
---

# How to load balance virtual machines in Azure and create a highly available application
In this tutorial, you create a load balanced application running on three Linux virtual machines (VMs). You learn about the different components of the Azure load balancer that distribute traffic and provide high availability. To see the load balancer in action, you build a Node.js app that runs on all the VMs.

To complete this tutorial, make sure that you have installed the latest [Azure CLI 2.0](/cli/azure/install-azure-cli).


## Step 1 - Load balancer overview
An Azure load balancer is a Layer-4 (TCP, UDP) load balancer that provides high availability by distributing incoming traffic among healthy VMs. A load balancer health probe monitors a given port on each VM and only distributes traffic to an operational VM.

You define a front-end IP configuration that contains one or more public IP addresses. This front-end IP configuration allows your load balancer and applications to be accessible over the Internet. 

Virtual machines connect to a load balancer using their virtual network interface card (NIC). To distribute traffic to the VMs, a back-end address pool contains the IP addresses of the virtual (NICs) connected to the load balancer.

To control the flow of traffic, you define load balancer rules for specific ports and protocols that map to your VMs.


## Step 2 - Create load balancer
First, create a resource group with [az group create](/cli/azure/group#create). The following example creates a resource group named `myTutorial8` in the `westus` location:

```azurecli
az group create --name myTutorial8 --location westus
```

### Create a public IP address
To access your app on the Internet, you need a public IP address for the load balancer. Create a public IP address with [az network public-ip create](/cli/azure/public-ip#create). The following example creates a public IP address named `myPublicIP`:

```azurecli
az network public-ip create --resource-group myTutorial8 --name myPublicIP
```

### Create a load balancer
Create a load balancer with [az network lb create](/cli/azure/network/lb#create). The following example creates a load balancer named `myLoadBalancer`and assigns the `myPublicIP` address to the front-end IP configuration:

```azurecli
az network lb create \
    --resource-group myTutorial8 \
    --name myLoadBalancer \
    --frontend-ip-name myFrontEndPool \
    --backend-pool-name myBackEndPool \
    --public-ip-address myPublicIP
```

### Create a health probe
To allow the load balancer to monitor the status of your app, you use a health probe. The health probe dynamically adds or removes VMs from the load balancer rotation based on their response to health checks. By default, a VM is removed from the load balancer distribution after two consecutive failures at 15-second intervals. You create a health probe based on a protocol or a specific health check page for your app. 

The following example creates a TCP probe. You can also create custom HTTP probes for more fine grained health checks. When using a custom HTTP probe, you must create the health check page, such as `healthcheck.js`. The probe must return an **HTTP 200 OK** response for the load balancer to keep the host in rotation.

Create a TCP health probe with [az network lb probe create](/cli/azure/network/lb/probe#create). The following example creates a health probe named `myHealthProbe`:

```azurecli
az network lb probe create \
    --resource-group myTutorial8 \
    --lb-name myLoadBalancer \
    --name myHealthProbe \
    --protocol tcp \
    --port 80
```

### Create a load balancer rule
A load balancer rule is used to define how traffic is distributed to the VMs. You define the front-end IP configuration for the incoming traffic and the back-end IP pool to receive the traffic, along with the required source and destination port. To make sure only healthy VMs receive traffic, you also define the health probe to use.

Create a load balancer rule with [az network lb rule create](/cli/azure/network/lb/rule#create). The following example creates a rule named `myLoadBalancerRule`, uses the `myHealthProbe` health probe, and balances traffic on port `80`:

```azurecli
az network lb rule create \
    --resource-group myTutorial8 \
    --lb-name myLoadBalancer \
    --name myLoadBalancerRule \
    --protocol tcp \
    --frontend-port 80 \
    --backend-port 80 \
    --frontend-ip-name myFrontEndPool \
    --backend-pool-name myBackEndPool \
    --probe-name myHealthProbe
```


## Step 3 - Configure networking
Before you deploy some VMs and can test your balancer, create the supporting virtual network resources. For more information about virtual networks, see the earlier [Manage Azure Virtual Networks](tutorial-virtual-network.md) tutorial.

### Create network resources
Create a virtual network with [az network vnet create](/cli/azure/vnet#create). The following example creates a virtual network named `myVnet` with a subnet named `mySubnet`:

```azurecli
az network vnet create --resource-group myTutorial8 --name myVnet --subnet-name mySubnet
```

Create a network security group with [az network nsg create](/cli/azure/network/nsg#create). The following example creates a network security group named `myNetworkSecurityGroup`:

```azurecli
az network nsg create --resource-group myTutorial8 --name myNetworkSecurityGroup
```

Create a network security group rule with [az network nsg rule create](/cli/azure/network/nsg/rule#create). The following example creates a network security group rule named `myNetworkSecurityGroupRule`:

```azurecli
az network nsg rule create \
    --resource-group myTutorial8 \
    --nsg-name myNetworkSecurityGroup \
    --name myNetworkSecurityGroupRule \
    --priority 1001 \
    --protocol tcp \
    --destination-port-range 80
```

Create a virtual NIC with [az network nic create](/cli/azure/network/nic#create). The following example creates three virtual NICs. (One virtual NIC for each VM you create for your app in the following steps). You can create additional virtual NICs and VMs at any time and add them to the load balancer:

```bash
for i in `seq 1 3`; do
    az network nic create \
        --resource-group myTutorial8 \
        --name myNic$i \
        --vnet-name myVnet \
        --subnet mySubnet \
        --network-security-group myNetworkSecurityGroup \
        --lb-name myLoadBalancer \
        --lb-address-pools myBackEndPool
done
```


## Step 4 - Test load balancer

### Create cloud-init config
In a previous tutorial, you learned how to automate VM deployment with cloud-init. Let use the same cloud-init configuration file to install NGINX and run a simple 'Hello World' Node.js app.

Create a file named `cloud-init.txt` and paste the following configuration:

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

### Create virtual machines
To improve the high availability of your app, place your VMs in an availability set. For more information about availability sets, see the earlier [How to create highly available virtual machines](tutorial-availability-sets.md) tutorial.

Create an availability set with [az vm availability-set create](/cli/azure/vm/availability-set#create). The following example creates an availability set named `myAvailabilitySet`:

```azurecli
az vm availability-set create \
    --resource-group myTutorial8 \
    --name myAvailabilitySet \
    --platform-fault-domain-count 3 \
    --platform-update-domain-count 2
```

Create the VMs with [az vm create](/cli/azure/vm#create). The following example creates three VMs and generates SSH keys if they do not already exist:

```bash
for i in `seq 1 3`; do
    az vm create \
        --resource-group myTutorial8 \
        --name myVM$i \
        --availability-set myAvailabilitySet \
        --nics myNic$i \
        --image Canonical:UbuntuServer:14.04.4-LTS:latest \
        --admin-username azureuser \
        --generate-ssh-keys \
        --custom-data cloud-init.txt \
        --no-wait
done
```

It takes a few minutes to create and configure all three VMs. The load balancer health probe automatically detects when the app is running on each VM. Once the app is running, the load balancer rule starts to distribute traffic.

### Test your load balanced app
Obtain the public IP address of your load balancer with [az network public-ip show](/cli/azure/network/public-ip#show). The following example obtains the IP address for `myPublicIP` created earlier:

```azurecli
az network public-ip show \
    --resource-group myTutorial8 \
    --name myPublicIP \
    --query [ipAddress] \
    --output tsv
```

Enter the public IP address in to a web browser. The app is displayed, including the hostname of the VM that the load balancer distributed traffic to:

![Running Node.js app](./media/tutorial-load-balancer/running-nodejs-app.png)

Force-refresh your web browser to see the load balancer distribute traffic across all three VMs running your app.


## Step 5 - Add and remove VMs
You may need to perform maintenance on the VMs running your app, such as installing OS updates. To deal with increased traffic to your app, you may need to add additional VMs. This section shows you how to remove or add a VM from the load balancer.

### Remove a VM from the load balancer
Remove a VM from the backend address pool with [az network nic ip-config address-pool remove](/cli/azure/network/nic/ip-config/address-pool#remove). The following example removes the virtual NIC for **myVM2** from `myLoadBalancer`:

```azurecli
az network nic ip-config address-pool remove \
    --resource-group myTutorial8 \
    --nic-name myNic2 \
    --ip-config-name ipConfig1 \
    --lb-name myLoadBalancer \
    --address-pool myBackEndPool 
```

Force-refresh your web browser to see the load balancer distribute traffic across the remaining two VMs running your app. You can now perform maintenance on the VM, such as installing OS updates or performing a VM reboot.

### Add a VM to the load balancer
After performing VM maintenance, or if you need to expand capacity, add a VM to the backend address pool with [az network nic ip-config address-pool add](/cli/azure/network/nic/ip-config/address-pool#add). The following example adds the virtual NIC for **myVM2** to `myLoadBalancer`:

```azurecli
az network nic ip-config address-pool add \
    --resource-group myTutorial8 \
    --nic-name myNic2 \
    --ip-config-name ipConfig1 \
    --lb-name myLoadBalancer \
    --address-pool myBackEndPool
```


## Step 6 - Delete resource group
Delete the resource group, which deletes the virtual machines.

```azurecli
az group delete --name myTutorial8 --no-wait --yes
```


## Next steps
Tutorial - [Create a Point-to-site VPN connection](tutorial-p2s-vpn.md)

Further reading:

- [Manage the availability of Linux virtual machines](../windows/manage-availability.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
- [Azure Load Balancer overview](../../load-balancer/load-balancer-overview.md)
- [Control network traffic flow with network security groups](../../virtual-network/virtual-networks-nsg.md)
- [Azure CLI sample scripts](../windows/cli-samples.md)
