---
title: Tutorial - Build a highly available application on Azure VMs | Microsoft Docs
description: Learn how to create a highly available and secure application across three Linux VMs with a load balancer in Azure
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
ms.date: 03/27/2017
ms.author: iainfou
---

# Build a load balanced, highly available application on Linux virtual machines in Azure
In this tutorial, you create a highly available application that is resilient to maintenance events. The app uses a load balancer, an availability set, and three Linux virtual machines (VMs). This tutorial builds a Node.js app, though you can use this tutorial to deploy a different application framework using the same high availability components and guidelines.

## Step 1 - Azure prerequisites
To complete this tutorial, open a terminal window and make sure that you have installed the latest [Azure CLI 2.0](/cli/azure/install-azure-cli). If you are not already logged in to your Azure subscription, log in with [az login](/cli/azure/#login) and follow the on-screen directions:

```azurecli
az login
```

An Azure resource group is a logical container into which Azure resources are deployed and managed. Before you can create any other Azure resources, you need to create a resource group with [az group create](/cli/azure/group#create). The following example creates a resource group named `myResourceGroup` in the `westus` location:

```azurecli
az group create --name myResourceGroup --location westus
```


## Step 2 - Create availability set
Virtual machines can be created across logical fault and update domains. Each logical domain represents a portion of hardware in the underlying Azure datacenter. When you create two or more VMs, your compute and storage resources are distributed across these domains. This distribution maintains the availability of your app should a hardware component undergo maintenance. Availability sets let you define these logical fault and update domains.

Create an availability set with [az vm availability-set create](/cli/azure/vm/availability-set#create). The following example creates an availability set named `myAvailabilitySet`:

```azurecli
az vm availability-set create \
    --resource-group myResourceGroup \
    --name myAvailabilitySet \
    --platform-fault-domain-count 3 \
    --platform-update-domain-count 2
```


## Step 3 - Create load balancer
An Azure load balancer distributes traffic across a set of defined VMs using load balancer rules. A health probe monitors a given port on each VM and only distributes traffic to an operational VM.

### Create a public IP address
To access your app on the Internet, assign a public IP address to the load balancer. Create a public IP address with [az network public-ip create](/cli/azure/public-ip#create). The following example creates a public IP address named `myPublicIP`:

```azurecli
az network public-ip create --resource-group myResourceGroup --name myPublicIP
```

### Create a load balancer
Create a load balancer with [az network lb create](/cli/azure/network/lb#create). The following example creates a load balancer named `myLoadBalancer` using the `myPublicIP` address:

```azurecli
az network lb create \
    --resource-group myResourceGroup \
    --name myLoadBalancer \
    --frontend-ip-name myFrontEndPool \
    --backend-pool-name myBackEndPool \
    --public-ip-address myPublicIP
```

### Create a health probe
To allow the load balancer to monitor the status of your app, you use a health probe. The health probe dynamically adds or removes VMs from the load balancer rotation based on their response to health checks. By default, a VM is removed from the load balancer distribution after two consecutive failures at 15-second intervals. You create a health probe based on a protocol or a specific health check page for your app. The following example creates a TCP probe, though you can expand on this example and add `--path healthcheck.js`, for example. The `healthcheck.js` must be created and return **HTTP 200 OK** response for the load balancer to keep the host in rotation.

Create a health probe with [az network lb probe create](/cli/azure/network/lb/probe#create). The following example creates a health probe named `myHealthProbe` that monitors each VM:

```azurecli
az network lb probe create \
    --resource-group myResourceGroup \
    --lb-name myLoadBalancer \
    --name myHealthProbe \
    --protocol tcp \
    --port 80
```

### Create a load balancer rule
A load balancer rule is used to define how traffic is distributed to the VMs.

Create a load balancer rule with [az network lb rule create](/cli/azure/network/lb/rule#create). The following example creates a rule named `myLoadBalancerRule`, uses the `myHealthProbe` health probe, and balances traffic on port `80`:

```azurecli
az network lb rule create \
    --resource-group myResourceGroup \
    --lb-name myLoadBalancer \
    --name myLoadBalancerRule \
    --protocol tcp \
    --frontend-port 80 \
    --backend-port 80 \
    --frontend-ip-name myFrontEndPool \
    --backend-pool-name myBackEndPool \
    --probe-name myHealthProbe
```


## Step 4 - Configure networking
Each VM has one or more virtual network interface cards (NICs) that connect to a virtual network. This virtual network is secured to filter traffic based on defined access rules.

### Create a virtual network
To provide network connectivity to your VMs, create a virtual network with [az network vnet create](/cli/azure/vnet#create). The following example creates a virtual network named `myVnet` with a subnet named `mySubnet`:

```azurecli
az network vnet create --resource-group myResourceGroup --name myVnet --subnet-name mySubnet
```

### Configure network security
Network security groups use rules to control the traffic flow to and from VMs. You define these rules, such as to allow traffic on port 80. While the load balancer distributes traffic across the VMs, the network security group rules make sure only permitted traffic is allowed.

Create a network security group with [az network nsg create](/cli/azure/network/nsg#create). The following example creates a network security group named `myNetworkSecurityGroup`:

```azurecli
az network nsg create --resource-group myResourceGroup --name myNetworkSecurityGroup
```

To allow web traffic to reach your app, create a network security group rule with [az network nsg rule create](/cli/azure/network/nsg/rule#create). The following example creates a network security group rule named `myNetworkSecurityGroupRule`:

```azurecli
az network nsg rule create \
    --resource-group myResourceGroup \
    --nsg-name myNetworkSecurityGroup \
    --name myNetworkSecurityGroupRule \
    --priority 1001 \
    --protocol tcp \
    --destination-port-range 80
```

### Create virtual network interface cards 
Load balancers function with the virtual NIC resource rather than the actual VM. The virtual NIC is connected to the load balancer, and then attached to a VM.

Create a virtual NIC with [az network nic create](/cli/azure/network/nic#create). The following example creates three virtual NICs. (One virtual NIC for each VM you create for your app in the following steps):

```bash
for i in `seq 1 3`; do
    az network nic create \
        --resource-group myResourceGroup \
        --name myNic$i \
        --vnet-name myVnet \
        --subnet mySubnet \
        --network-security-group myNetworkSecurityGroup \
        --lb-name myLoadBalancer \
        --lb-address-pools myBackEndPool
done
```


## Step 5 - Build your app
**cloud-init** is a widely used approach to customizing a VM. You can use **cloud-init** to install packages and write files. As **cloud-init** runs during the initial deployment, there are no additional steps to get your app running. The load balancer starts to distribute traffic once the VM has finished deploying and the app is running. For more information about using **cloud-init**, see [Use cloud-init to customize a Linux VM during creation](using-cloud-init.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

The following **cloud-init** configuration installs **nodejs** and **npm**, then installs and configures **nginx** as a web proxy for your app. The configuration also creates a simple 'Hello World' Node.js app, then initializes and starts the app with **Express**. If you want to use a different application framework, adjust the packages and deployed application accordingly.

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
  - nginx -s reload
  - cd "/home/azureuser/myapp"
  - npm init
  - npm install express -y
  - nodejs index.js
```


## Step 6 - Create virtual machines
With all the underlying components in place, you can now create highly available VMs to run your app.

### Create VMs
Create the VMs with [az vm create](/cli/azure/vm#create). The following example creates three VMs and generates SSH keys if they do not already exist:

```bash
for i in `seq 1 3`; do
    az vm create \
        --resource-group myResourceGroup \
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

### Test your app
Obtain the public IP address of your load balancer with [az network public-ip show](/cli/azure/network/public-ip#show). The following example obtains the IP address for `myPublicIP` created earlier:

```azurecli
az network public-ip show \
    --resource-group myResourceGroup \
    --name myPublicIP \
    --query [ipAddress] \
    --output tsv
```

Enter the public IP address in to a web browser. The app is displayed, including the hostname of the VM that the load balancer distributed traffic to:

![Running Node.js app](./media/tutorial-load-balance-nodejs/running-nodejs-app.png)

Force-refresh your web browser to see the load balancer distribute traffic across all three VMs running your app.


## Step 7 - Management tasks
You may need to perform maintenance on the VMs running your app, such as installing OS updates. To deal with increased traffic to your app, you may need to add additional VMs. This section shows you how to remove or add a VM from the load balancer.

### Remove a VM from the load balancer
Remove a VM from the backend address pool with [az network nic ip-config address-pool remove](/cli/azure/network/nic/ip-config/address-pool#remove). The following example removes the virtual NIC for **myVM2** from `myLoadBalancer`:

```azurecli
az network nic ip-config address-pool remove \
    --resource-group myResourceGroup \
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
    --resource-group myResourceGroup \
    --nic-name myNic2 \
    --ip-config-name ipConfig1 \
    --lb-name myLoadBalancer \
    --address-pool myBackEndPool
```


## Next steps
This tutorial builds out a highly available application infrastructure using the individual Azure resources. You can also use Virtual Machine Scale Sets to automatically scale up or down the number of VMs running your app. Continue on to the next tutorial - [Create a highly available application on Linux with Virtual Machine Scale Sets](tutorial-convert-to-vmss.md).

To learn more about some of the high availability features introduced in this tutorial, see the following information:

- [Manage the availability of Linux virtual machines](../windows/manage-availability.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
- [Azure Load Balancer overview](../../load-balancer/load-balancer-overview.md)
- [Control network traffic flow with network security groups](../../virtual-network/virtual-networks-nsg.md)
- [Azure CLI sample scripts](../windows/cli-samples.md)