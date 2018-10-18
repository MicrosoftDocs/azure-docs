---
title: Tutorial - Load balance Linux virtual machines in Azure | Microsoft Docs
description: In this tutorial, you learn how to use the Azure CLI to create a load balancer for a highly available and secure application across three Linux virtual machines
services: virtual-machines-linux
documentationcenter: virtual-machines
author: cynthn
manager: jeconnoc
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: azurecli
ms.topic: tutorial
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 11/13/2017
ms.author: cynthn
ms.custom: mvc

#Customer intent: As an IT administrator, I want to learn how to load balance virtual machines in Azure so that I can deploy a redundant application with traffic automatically distributed to available VMs.
---

# Tutorial: Load balance Linux virtual machines in Azure to create a highly available application with the Azure CLI

Load balancing provides a higher level of availability by spreading incoming requests across multiple virtual machines. In this tutorial, you learn about the different components of the Azure load balancer that distribute traffic and provide high availability. You learn how to:

> [!div class="checklist"]
> * Create an Azure load balancer
> * Create a load balancer health probe
> * Create load balancer traffic rules
> * Use cloud-init to create a basic Node.js app
> * Create virtual machines and attach to a load balancer
> * View a load balancer in action
> * Add and remove VMs from a load balancer

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.30 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

## Azure load balancer overview
An Azure load balancer is a Layer-4 (TCP, UDP) load balancer that provides high availability by distributing incoming traffic among healthy VMs. A load balancer health probe monitors a given port on each VM and only distributes traffic to an operational VM.

You define a front-end IP configuration that contains one or more public IP addresses. This front-end IP configuration allows your load balancer and applications to be accessible over the Internet. 

Virtual machines connect to a load balancer using their virtual network interface card (NIC). To distribute traffic to the VMs, a back-end address pool contains the IP addresses of the virtual (NICs) connected to the load balancer.

To control the flow of traffic, you define load balancer rules for specific ports and protocols that map to your VMs.

If you followed the previous tutorial to [create a virtual machine scale set](tutorial-create-vmss.md), a load balancer was created for you. All these components were configured for you as part of the scale set.


## Create Azure load balancer
This section details how you can create and configure each component of the load balancer. Before you can create your load balancer, create a resource group with [az group create](/cli/azure/group#az_group_create). The following example creates a resource group named *myResourceGroupLoadBalancer* in the *eastus* location:

```azurecli-interactive 
az group create --name myResourceGroupLoadBalancer --location eastus
```

### Create a public IP address
To access your app on the Internet, you need a public IP address for the load balancer. Create a public IP address with [az network public-ip create](/cli/azure/network/public-ip#az_network_public_ip_create). The following example creates a public IP address named *myPublicIP* in the *myResourceGroupLoadBalancer* resource group:

```azurecli-interactive 
az network public-ip create \
    --resource-group myResourceGroupLoadBalancer \
    --name myPublicIP
```

### Create a load balancer
Create a load balancer with [az network lb create](/cli/azure/network/lb#az_network_lb_create). The following example creates a load balancer named *myLoadBalancer* and assigns the *myPublicIP* address to the front-end IP configuration:

```azurecli-interactive 
az network lb create \
    --resource-group myResourceGroupLoadBalancer \
    --name myLoadBalancer \
    --frontend-ip-name myFrontEndPool \
    --backend-pool-name myBackEndPool \
    --public-ip-address myPublicIP
```

### Create a health probe
To allow the load balancer to monitor the status of your app, you use a health probe. The health probe dynamically adds or removes VMs from the load balancer rotation based on their response to health checks. By default, a VM is removed from the load balancer distribution after two consecutive failures at 15-second intervals. You create a health probe based on a protocol or a specific health check page for your app. 

The following example creates a TCP probe. You can also create custom HTTP probes for more fine grained health checks. When using a custom HTTP probe, you must create the health check page, such as *healthcheck.js*. The probe must return an **HTTP 200 OK** response for the load balancer to keep the host in rotation.

To create a TCP health probe, you use [az network lb probe create](/cli/azure/network/lb/probe#az_network_lb_probe_create). The following example creates a health probe named *myHealthProbe*:

```azurecli-interactive 
az network lb probe create \
    --resource-group myResourceGroupLoadBalancer \
    --lb-name myLoadBalancer \
    --name myHealthProbe \
    --protocol tcp \
    --port 80
```

### Create a load balancer rule
A load balancer rule is used to define how traffic is distributed to the VMs. You define the front-end IP configuration for the incoming traffic and the back-end IP pool to receive the traffic, along with the required source and destination port. To make sure only healthy VMs receive traffic, you also define the health probe to use.

Create a load balancer rule with [az network lb rule create](/cli/azure/network/lb/rule#az_network_lb_rule_create). The following example creates a rule named *myLoadBalancerRule*, uses the *myHealthProbe* health probe, and balances traffic on port *80*:

```azurecli-interactive 
az network lb rule create \
    --resource-group myResourceGroupLoadBalancer \
    --lb-name myLoadBalancer \
    --name myLoadBalancerRule \
    --protocol tcp \
    --frontend-port 80 \
    --backend-port 80 \
    --frontend-ip-name myFrontEndPool \
    --backend-pool-name myBackEndPool \
    --probe-name myHealthProbe
```


## Configure virtual network
Before you deploy some VMs and can test your balancer, create the supporting virtual network resources. For more information about virtual networks, see the [Manage Azure Virtual Networks](tutorial-virtual-network.md) tutorial.

### Create network resources
Create a virtual network with [az network vnet create](/cli/azure/network/vnet#az_network_vnet_create). The following example creates a virtual network named *myVnet* with a subnet named *mySubnet*:

```azurecli-interactive 
az network vnet create \
    --resource-group myResourceGroupLoadBalancer \
    --name myVnet \
    --subnet-name mySubnet
```

To add a network security group, you use [az network nsg create](/cli/azure/network/nsg#az_network_nsg_create). The following example creates a network security group named *myNetworkSecurityGroup*:

```azurecli-interactive 
az network nsg create \
    --resource-group myResourceGroupLoadBalancer \
    --name myNetworkSecurityGroup
```

Create a network security group rule with [az network nsg rule create](/cli/azure/network/nsg/rule#az_network_nsg_rule_create). The following example creates a network security group rule named *myNetworkSecurityGroupRule*:

```azurecli-interactive 
az network nsg rule create \
    --resource-group myResourceGroupLoadBalancer \
    --nsg-name myNetworkSecurityGroup \
    --name myNetworkSecurityGroupRule \
    --priority 1001 \
    --protocol tcp \
    --destination-port-range 80
```

Virtual NICs are created with [az network nic create](/cli/azure/network/nic#az_network_nic_create). The following example creates three virtual NICs. (One virtual NIC for each VM you create for your app in the following steps). You can create additional virtual NICs and VMs at any time and add them to the load balancer:

```bash
for i in `seq 1 3`; do
    az network nic create \
        --resource-group myResourceGroupLoadBalancer \
        --name myNic$i \
        --vnet-name myVnet \
        --subnet mySubnet \
        --network-security-group myNetworkSecurityGroup \
        --lb-name myLoadBalancer \
        --lb-address-pools myBackEndPool
done
```

When all three virtual NICs are created, continue on to the next step


## Create virtual machines

### Create cloud-init config
In a previous tutorial on [How to customize a Linux virtual machine on first boot](tutorial-automate-vm-deployment.md), you learned how to automate VM customization with cloud-init. You can use the same cloud-init configuration file to install NGINX and run a simple 'Hello World' Node.js app in the next step. To see the load balancer in action, at the end of the tutorial you access this simple app in a web browser.

In your current shell, create a file named *cloud-init.txt* and paste the following configuration. For example, create the file in the Cloud Shell not on your local machine. Enter `sensible-editor cloud-init.txt` to create the file and see a list of available editors. Make sure that the whole cloud-init file is copied correctly, especially the first line:

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
To improve the high availability of your app, place your VMs in an availability set. For more information about availability sets, see the previous [How to create highly available virtual machines](tutorial-availability-sets.md) tutorial.

Create an availability set with [az vm availability-set create](/cli/azure/vm/availability-set#az_vm_availability_set_create). The following example creates an availability set named *myAvailabilitySet*:

```azurecli-interactive 
az vm availability-set create \
    --resource-group myResourceGroupLoadBalancer \
    --name myAvailabilitySet
```

Now you can create the VMs with [az vm create](/cli/azure/vm#az_vm_create). The following example creates three VMs and generates SSH keys if they do not already exist:

```bash
for i in `seq 1 3`; do
    az vm create \
        --resource-group myResourceGroupLoadBalancer \
        --name myVM$i \
        --availability-set myAvailabilitySet \
        --nics myNic$i \
        --image UbuntuLTS \
        --admin-username azureuser \
        --generate-ssh-keys \
        --custom-data cloud-init.txt \
        --no-wait
done
```

There are background tasks that continue to run after the Azure CLI returns you to the prompt. The `--no-wait` parameter does not wait for all the tasks to complete. It may be another couple of minutes before you can access the app. The load balancer health probe automatically detects when the app is running on each VM. Once the app is running, the load balancer rule starts to distribute traffic.


## Test load balancer
Obtain the public IP address of your load balancer with [az network public-ip show](/cli/azure/network/public-ip#az_network_public_ip_show). The following example obtains the IP address for *myPublicIP* created earlier:

```azurecli-interactive 
az network public-ip show \
    --resource-group myResourceGroupLoadBalancer \
    --name myPublicIP \
    --query [ipAddress] \
    --output tsv
```

You can then enter the public IP address in to a web browser. Remember - it takes a few minutes for the VMs to be ready before the load balancer starts to distribute traffic to them. The app is displayed, including the hostname of the VM that the load balancer distributed traffic to as in the following example:

![Running Node.js app](./media/tutorial-load-balancer/running-nodejs-app.png)

To see the load balancer distribute traffic across all three VMs running your app, you can force-refresh your web browser.


## Add and remove VMs
You may need to perform maintenance on the VMs running your app, such as installing OS updates. To deal with increased traffic to your app, you may need to add additional VMs. This section shows you how to remove or add a VM from the load balancer.

### Remove a VM from the load balancer
You can remove a VM from the backend address pool with [az network nic ip-config address-pool remove](/cli/azure/network/nic/ip-config/address-pool#az_network_nic_ip_config_address_pool_remove). The following example removes the virtual NIC for **myVM2** from *myLoadBalancer*:

```azurecli-interactive 
az network nic ip-config address-pool remove \
    --resource-group myResourceGroupLoadBalancer \
    --nic-name myNic2 \
    --ip-config-name ipConfig1 \
    --lb-name myLoadBalancer \
    --address-pool myBackEndPool 
```

To see the load balancer distribute traffic across the remaining two VMs running your app you can force-refresh your web browser. You can now perform maintenance on the VM, such as installing OS updates or performing a VM reboot.

To view a list of VMs with virtual NICs connected to the load balancer, use [az network lb address-pool show](/cli/azure/network/lb/address-pool#az_network_lb_address_pool_show). Query and filter on the ID of the virtual NIC as follows:

```azurecli-interactive
az network lb address-pool show \
    --resource-group myResourceGroupLoadBalancer \
    --lb-name myLoadBalancer \
    --name myBackEndPool \
    --query backendIpConfigurations \
    --output tsv | cut -f4
```

The output is similar to the following example, which shows that the virtual NIC for VM 2 is no longer part of the backend address pool:

```bash
/subscriptions/<guid>/resourceGroups/myResourceGroupLoadBalancer/providers/Microsoft.Network/networkInterfaces/myNic1/ipConfigurations/ipconfig1
/subscriptions/<guid>/resourceGroups/myResourceGroupLoadBalancer/providers/Microsoft.Network/networkInterfaces/myNic3/ipConfigurations/ipconfig1
```

### Add a VM to the load balancer
After performing VM maintenance, or if you need to expand capacity, you can add a VM to the backend address pool with [az network nic ip-config address-pool add](/cli/azure/network/nic/ip-config/address-pool#az_network_nic_ip_config_address_pool_add). The following example adds the virtual NIC for **myVM2** to *myLoadBalancer*:

```azurecli-interactive 
az network nic ip-config address-pool add \
    --resource-group myResourceGroupLoadBalancer \
    --nic-name myNic2 \
    --ip-config-name ipConfig1 \
    --lb-name myLoadBalancer \
    --address-pool myBackEndPool
```

To verify that the virtual NIC is connected to the backend address pool, use [az network lb address-pool show](/cli/azure/network/lb/address-pool#az_network_lb_address_pool_show) again from the preceding step.


## Next steps
In this tutorial, you created a load balancer and attached VMs to it. You learned how to:

> [!div class="checklist"]
> * Create an Azure load balancer
> * Create a load balancer health probe
> * Create load balancer traffic rules
> * Use cloud-init to create a basic Node.js app
> * Create virtual machines and attach to a load balancer
> * View a load balancer in action
> * Add and remove VMs from a load balancer

Advance to the next tutorial to learn more about Azure virtual network components.

> [!div class="nextstepaction"]
> [Manage VMs and virtual networks](tutorial-virtual-network.md)
