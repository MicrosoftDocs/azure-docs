---
title: Create a highly available app in Azure using Virtual Machine Scale Sets | Microsoft Docs
description: Create and deploy a highly available application on Linux VMs using a virtual machine scale set and the Azure CLI.
services: virtual-machine-scale-sets
documentationcenter: ''
author: Thraka
manager: timlt
editor: ''
tags: ''

ms.assetid: ''
ms.service: virtual-machine-scale-sets
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: azurecli
ms.topic: article
ms.date: 04/05/2017
ms.author: adegeo
---

# Create a highly available application on Linux with Virtual Machine Scale Sets
This tutorial shows you how to create a highly available application in a virtual machine scale set. You also learn how to automate the configuration of the virtual machines in the scale set. 


## Step 1 - Create a resource group
To complete this tutorial, make sure that you have installed the latest [Azure CLI 2.0](/cli/azure/install-azure-cli). If you are not already logged in to your Azure subscription, log in with [az login](/cli/azure/#login) and follow the on-screen directions.

Create a resource group with [az group create](/cli/azure/group#create). The following example creates a resource group named `myResourceGroupVMSS` in the `westus` location:

```azurecli
az group create --name myResourceGroupVMSS --location westus
```


## Step 2 - Define your app
You use the same **cloud-init** config from the tutorial where you created a highly available, load balanced app. For more information about using **cloud-init**, see [Use cloud-init to customize a Linux VM during creation](using-cloud-init.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

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


## Step 3 - Create scale set
A virtual machine scale set allows you to deploy and manage a set of identical, auto-scaling virtual machines. Scale sets use the same components as you learned about in the tutorial to [Build a highly available app on Azure](tutorial-load-balance-nodejs.md). These components include as availability sets, fault and update domains, and load balancers.

With a scale set, these resources are created and managed for you. The number of VMs in your scale set can automatically increase or decrease based on defined rules. You can [use a custom image](capture-image.md) as the source for your virtual machine, or configure the VMs during deployment with **cloud-init** as in this tutorial.

Create a virtual machine scale set with [az vmss create](/cli/azure/vmss#create). This command adds a data disk to each VM, and uses **cloud-init** to install and configure your app. The following example creates a scale set named `myScaleSet`:

```azurecli
az vmss create \
  --resource-group myResourceGroupVMSS \
  --name myScaleSet \
  --image Canonical:UbuntuServer:14.04.4-LTS:latest \
  --upgrade-policy-mode automatic \
  --custom-data cloud-init.txt \
  --admin-username azureuser \
  --generate-ssh-keys      
```

It takes a few minutes to create and configure all the scale set resources and VMs.


## Step 4 - Configure firewall
A load balancer was created automatically as part of the virtual machine scale set. The load balancer distributes traffic across a set of defined VMs using load balancer rules. To allow traffic to reach the web app, create a rule with [az network lb probe create](/cli/azure/network/lb/probe#create). The following example creates a rule named `myLoadBalancerRuleWeb`:

```azurecli
az network lb rule create \
  --resource-group myResourceGroupVMSS \
  --name myLoadBalancerRuleWeb \
  --lb-name myScaleSetLB \
  --backend-pool-name myScaleSetLBBEPool \
  --backend-port 80 \
  --frontend-ip-name loadBalancerFrontEnd \
  --frontend-port 80 \
  --protocol tcp
```

## Step 5 - Test your app
Obtain the public IP address of your load balancer with [az network public-ip show](/cli/azure/network/public-ip#show). The following example obtains the IP address for `myScaleSetLBPublicIP` created as part of the scale set:

```azurecli
az network public-ip show \
    --resource-group myResourceGroupVMSS \
    --name myScaleSetLBPublicIP \
    --query [ipAddress] \
    --output tsv
```

Enter the public IP address in to a web browser. The app is displayed, including the hostname of the VM that the load balancer distributed traffic to:

![Running Node.js app](./media/tutorial-load-balance-nodejs/running-nodejs-app.png)

Force-refresh your web browser to see the load balancer distribute traffic across all the VMs in the scale set running your app.


## Step 6 - Management tasks
Throughout the lifecycle of the scale set, you may need to run one or more management tasks. Additionally, you may want to create scripts that automate various lifecycle-tasks. The Azure CLI 2.0 provides a quick way to do those tasks. Here are a few common tasks.

### Increase or decrease VM instances
You can manually increase or decrease the number of virtual machines in the scale set with [az vmss scale](/cli/azure/vmss#scale). The following example increases the number of VMs in your scale set to `5`:

```azurecli
az vmss scale --resource-group myResourceGroupVMSS --name myScaleSet --new-capacity 5
```

Autoscale rules let you define how to scale up or down the number of VMs in your scale set in response to demand such as network traffic or CPU usage. Currently, these rules cannot be set in Azure CLI 2.0. Use the [Azure portal](https://portal.azure.com) to configure autoscale.

### Get connection info
To obtain connection information about the VMs in your scale sets, use [az vmss list-instance-connection-info](/cli/azure/vmss#list-instance-connection-info). This command outputs the public IP address and ports for each VM that allows you to connect with SSH:

```azurecli
az vmss list-instance-connection-info --resource-group myResourceGroupVMSS --name myScaleSet
```

### Delete resource group
Deleting a resource group also deletes all resources contained within.

```azurecli
az group delete --name myResourceGroupVMSS
```


## Next steps
In this tutorial, we defined the web app with **cloud-init** and configured each VM during deployment. For information on capturing a VM to use as the source image in your scale set, see [How to generalize and capture a Linux virtual machine](capture-image.md).

To learn more about some of the virtual machine scale set features introduced in this tutorial, see the following information:

- [Azure Virtual Machine Scale Sets overview](../../virtual-machine-scale-sets/virtual-machine-scale-sets-overview.md)
- [Azure Load Balancer overview](../../load-balancer/load-balancer-overview.md)
- [Control network traffic flow with network security groups](../../virtual-network/virtual-networks-nsg.md)