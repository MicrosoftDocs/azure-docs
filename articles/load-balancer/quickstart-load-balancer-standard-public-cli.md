---
title: "Quickstart: Create a public load balancer - Azure CLI"
titleSuffix: Azure Load Balancer
description: This quickstart shows how to create a public load balancer using the Azure CLI
services: load-balancer
documentationcenter: na
author: asudbring
manager: KumudD
tags: azure-resource-manager
Customer intent: I want to create a load balancer so that I can load balance internet traffic to VMs.
ms.service: load-balancer
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/23/2020
ms.author: allensu
ms.custom: mvc, devx-track-js, devx-track-azurecli
---
# Quickstart: Create a public load balancer to load balance VMs using Azure CLI

Get started with Azure Load Balancer by using Azure CLI to create a public load balancer and three virtual machines.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

 - This quickstart requires version 2.0.28 or later of the Azure CLI. Run [az version](/cli/azure/reference-index#az_version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index#az_upgrade).

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [az group create](https://docs.microsoft.com/cli/azure/group?view=azure-cli-latest#az-group-create):

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

## Configure virtual network

Before you deploy VMs and test your load balancer, create the supporting virtual network resources.

### Create a virtual network

Create a virtual network using [az network vnet create](https://docs.microsoft.com/cli/azure/network/vnet?view=azure-cli-latest#az-network-vnet-createt):

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

### Create a network security group

For a standard load balancer, the VMs in the backend address for are required to have network interfaces that belong to a network security group. 

Create a network security group using [az network nsg create](https://docs.microsoft.com/cli/azure/network/nsg?view=azure-cli-latest#az-network-nsg-create):

* Named **myNSG**.
* In resource group **CreatePubLBQS-rg**.

```azurecli-interactive
  az network nsg create \
    --resource-group CreatePubLBQS-rg \
    --name myNSG
```

### Create a network security group rule

Create a network security group rule using [az network nsg rule create](https://docs.microsoft.com/cli/azure/network/nsg/rule?view=azure-cli-latest#az-network-nsg-rule-create):

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

### Create network interfaces for the virtual machines

Create three network interfaces with [az network nic create](https://docs.microsoft.com/cli/azure/network/nic?view=azure-cli-latest#az-network-nic-create):

#### VM1

* Named **myNicVM1**.
* In resource group **CreatePubLBQS-rg**.
* In virtual network **myVNet**.
* In subnet **myBackendSubnet**.
* In network security group **myNSG**.

```azurecli-interactive

  az network nic create \
    --resource-group CreatePubLBQS-rg \
    --name myNicVM1 \
    --vnet-name myVNet \
    --subnet myBackEndSubnet \
    --network-security-group myNSG
```
#### VM2

* Named **myNicVM2**.
* In resource group **CreatePubLBQS-rg**.
* In virtual network **myVNet**.
* In subnet **myBackendSubnet**.

```azurecli-interactive
  az network nic create \
    --resource-group CreatePubLBQS-rg \
    --name myNicVM2 \
    --vnet-name myVnet \
    --subnet myBackEndSubnet \
    --network-security-group myNSG
```
#### VM3

* Named **myNicVM3**.
* In resource group **CreatePubLBQS-rg**.
* In virtual network **myVNet**.
* In subnet **myBackendSubnet**.
* In network security group **myNSG**.

```azurecli-interactive
  az network nic create \
    --resource-group CreatePubLBQS-rg \
    --name myNicVM3 \
    --vnet-name myVnet \
    --subnet myBackEndSubnet \
    --network-security-group myNSG
```

## Create backend servers

In this section, you create:

* A cloud configuration file named **cloud-init.txt** for the server configuration.
* Three virtual machines to be used as backend servers for the load balancer.

### Create cloud-init configuration file

Use a cloud-init configuration file to install NGINX and run a 'Hello World' Node.js app on a Linux virtual machine. 

In your current shell, create a file named cloud-init.txt. Copy and paste the following configuration into the shell. Ensure that you copy the whole cloud-init file correctly, especially the first line:

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

Create the virtual machines with [az vm create](https://docs.microsoft.com/cli/azure/vm?view=azure-cli-latest#az-vm-create):

#### VM1
* Named **myVM1**.
* In resource group **CreatePubLBQS-rg**.
* Attached to network interface **myNicVM1**.
* Virtual machine image **UbuntuLTS**.
* Configuration file **cloud-init.txt** you created in step above.
* In **Zone 1**.

```azurecli-interactive
  az vm create \
    --resource-group CreatePubLBQS-rg \
    --name myVM1 \
    --nics myNicVM1 \
    --image UbuntuLTS \
    --generate-ssh-keys \
    --custom-data cloud-init.txt \
    --zone 1 \
    --no-wait
    
```
#### VM2
* Named **myVM2**.
* In resource group **CreatePubLBQS-rg**.
* Attached to network interface **myNicVM2**.
* Virtual machine image **UbuntuLTS**.
* Configuration file **cloud-init.txt** you created in step above.
* In **Zone 2**.

```azurecli-interactive
  az vm create \
    --resource-group CreatePubLBQS-rg \
    --name myVM2 \
    --nics myNicVM2 \
    --image UbuntuLTS \
    --generate-ssh-keys \
    --custom-data cloud-init.txt \
    --zone 2 \
    --no-wait
```

#### VM3
* Named **myVM3**.
* In resource group **CreatePubLBQS-rg**.
* Attached to network interface **myNicVM3**.
* Virtual machine image **UbuntuLTS**.
* Configuration file **cloud-init.txt** you created in step above.
* In **Zone 3**.

```azurecli-interactive
   az vm create \
    --resource-group CreatePubLBQS-rg \
    --name myVM3 \
    --nics myNicVM3 \
    --image UbuntuLTS \
    --generate-ssh-keys \
    --custom-data cloud-init.txt \
    --zone 3 \
    --no-wait
```
It may take a few minutes for the VMs to deploy.

## Create a public IP address

To access your web app on the Internet, you need a public IP address for the load balancer. 

Use [az network public-ip create](https://docs.microsoft.com/cli/azure/network/public-ip?view=azure-cli-latest#az-network-public-ip-create) to:

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

Create a public load balancer with [az network lb create](https://docs.microsoft.com/cli/azure/network/lb?view=azure-cli-latest#az-network-lb-create):

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

Create a health probe with [az network lb probe create](https://docs.microsoft.com/cli/azure/network/lb/probe?view=azure-cli-latest#az-network-lb-probe-create):

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

Create a load balancer rule with [az network lb rule create](https://docs.microsoft.com/cli/azure/network/lb/rule?view=azure-cli-latest#az-network-lb-rule-create):

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

Add the virtual machines to the backend pool with [az network nic ip-config address-pool add](https://docs.microsoft.com/cli/azure/network/nic/ip-config/address-pool?view=azure-cli-latest#az-network-nic-ip-config-address-pool-add):

#### VM1
* In backend address pool **myBackEndPool**.
* In resource group **CreatePubLBQS-rg**.
* Associated with network interface **myNicVM1** and **ipconfig1**.
* Associated with load balancer **myLoadBalancer**.

```azurecli-interactive
  az network nic ip-config address-pool add \
   --address-pool myBackendPool \
   --ip-config-name ipconfig1 \
   --nic-name myNicVM1 \
   --resource-group CreatePubLBQS-rg \
   --lb-name myLoadBalancer
```

#### VM2
* In backend address pool **myBackEndPool**.
* In resource group **CreatePubLBQS-rg**.
* Associated with network interface **myNicVM2** and **ipconfig1**.
* Associated with load balancer **myLoadBalancer**.

```azurecli-interactive
  az network nic ip-config address-pool add \
   --address-pool myBackendPool \
   --ip-config-name ipconfig1 \
   --nic-name myNicVM2 \
   --resource-group CreatePubLBQS-rg \
   --lb-name myLoadBalancer
```

#### VM3
* In backend address pool **myBackEndPool**.
* In resource group **CreatePubLBQS-rg**.
* Associated with network interface **myNicVM3** and **ipconfig1**.
* Associated with load balancer **myLoadBalancer**.

```azurecli-interactive
  az network nic ip-config address-pool add \
   --address-pool myBackendPool \
   --ip-config-name ipconfig1 \
   --nic-name myNicVM3 \
   --resource-group CreatePubLBQS-rg \
   --lb-name myLoadBalancer
```

## Create outbound rule configuration
Load balancer outbound rules configure outbound SNAT for VMs in the backend pool. 

For more information on outbound connections, see [Outbound connections in Azure](load-balancer-outbound-connections.md).

### Create outbound public IP address or public IP prefix.

Use [az network public-ip create](https://docs.microsoft.com/cli/azure/network/public-ip?view=azure-cli-latest#az-network-public-ip-create) to create a single IP for the outbound connectivity.  

Use [az network public-ip prefix create](https://docs.microsoft.com/cli/azure/network/public-ip/prefix?view=azure-cli-latest#az-network-public-ip-prefix-create) to create a public IP prefix for the outbound connectivity.

For more information on scaling outbound NAT and outbound connectivity, see [Scale outbound NAT with multiple IP addresses](https://docs.microsoft.com/azure/load-balancer/load-balancer-outbound-connections#scale).

#### Public IP

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
#### Public IP prefix

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

### Create outbound frontend IP configuration

Create a new frontend IP configuration with [az network lb frontend-ip create
](https://docs.microsoft.com/cli/azure/network/lb/frontend-ip?view=azure-cli-latest#az-network-lb-frontend-ip-create):

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

Create a new outbound pool with [az network lb address-pool create](https://docs.microsoft.com/cli/azure/network/lb/address-pool?view=azure-cli-latest#az-network-lb-address-pool-create):

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

Create a new outbound rule for the outbound backend pool with [az network lb outbound-rule create](https://docs.microsoft.com/cli/azure/network/lb/outbound-rule?view=azure-cli-latest#az-network-lb-outbound-rule-create):

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

Add the virtual machines to the outbound pool with [az network nic ip-config address-pool add](https://docs.microsoft.com/cli/azure/network/nic/ip-config/address-pool?view=azure-cli-latest#az-network-nic-ip-config-address-pool-add):


#### VM1
* In backend address pool **myBackEndPoolOutbound**.
* In resource group **CreatePubLBQS-rg**.
* Associated with network interface **myNicVM1** and **ipconfig1**.
* Associated with load balancer **myLoadBalancer**.

```azurecli-interactive
  az network nic ip-config address-pool add \
   --address-pool myBackendPoolOutbound \
   --ip-config-name ipconfig1 \
   --nic-name myNicVM1 \
   --resource-group CreatePubLBQS-rg \
   --lb-name myLoadBalancer
```

#### VM2
* In backend address pool **myBackEndPoolOutbound**.
* In resource group **CreatePubLBQS-rg**.
* Associated with network interface **myNicVM2** and **ipconfig1**.
* Associated with load balancer **myLoadBalancer**.

```azurecli-interactive
  az network nic ip-config address-pool add \
   --address-pool myBackendPoolOutbound \
   --ip-config-name ipconfig1 \
   --nic-name myNicVM2 \
   --resource-group CreatePubLBQS-rg \
   --lb-name myLoadBalancer
```

#### VM3
* In backend address pool **myBackEndPoolOutbound**.
* In resource group **CreatePubLBQS-rg**.
* Associated with network interface **myNicVM3** and **ipconfig1**.
* Associated with load balancer **myLoadBalancer**.

```azurecli-interactive
  az network nic ip-config address-pool add \
   --address-pool myBackendPoolOutbound \
   --ip-config-name ipconfig1 \
   --nic-name myNicVM3 \
   --resource-group CreatePubLBQS-rg \
   --lb-name myLoadBalancer
```

# [**Basic SKU**](#tab/option-1-create-load-balancer-basic)

>[!NOTE]
>Standard SKU load balancer is recommended for production workloads. For more information about skus, see **[Azure Load Balancer SKUs](skus.md)**.

## Configure virtual network

Before you deploy VMs and test your load balancer, create the supporting virtual network resources.

### Create a virtual network

Create a virtual network using [az network vnet create](https://docs.microsoft.com/cli/azure/network/vnet?view=azure-cli-latest#az-network-vnet-createt):

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

### Create a network security group

For a standard load balancer, the VMs in the backend address for are required to have network interfaces that belong to a network security group. 

Create a network security group using [az network nsg create](https://docs.microsoft.com/cli/azure/network/nsg?view=azure-cli-latest#az-network-nsg-create):

* Named **myNSG**.
* In resource group **CreatePubLBQS-rg**.

```azurecli-interactive
  az network nsg create \
    --resource-group CreatePubLBQS-rg \
    --name myNSG
```

### Create a network security group rule

Create a network security group rule using [az network nsg rule create](https://docs.microsoft.com/cli/azure/network/nsg/rule?view=azure-cli-latest#az-network-nsg-rule-create):

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

### Create network interfaces for the virtual machines

Create three network interfaces with [az network nic create](https://docs.microsoft.com/cli/azure/network/nic?view=azure-cli-latest#az-network-nic-create):

#### VM1

* Named **myNicVM1**.
* In resource group **CreatePubLBQS-rg**.
* In virtual network **myVNet**.
* In subnet **myBackendSubnet**.
* In network security group **myNSG**.

```azurecli-interactive

  az network nic create \
    --resource-group CreatePubLBQS-rg \
    --name myNicVM1 \
    --vnet-name myVNet \
    --subnet myBackEndSubnet \
    --network-security-group myNSG
```
#### VM2

* Named **myNicVM2**.
* In resource group **CreatePubLBQS-rg**.
* In virtual network **myVNet**.
* In subnet **myBackendSubnet**.
* In network security group **myNSG**.

```azurecli-interactive
  az network nic create \
    --resource-group CreatePubLBQS-rg \
    --name myNicVM2 \
    --vnet-name myVNet \
    --subnet myBackEndSubnet \
    --network-security-group myNSG
```
#### VM3

* Named **myNicVM3**.
* In resource group **CreatePubLBQS-rg**.
* In virtual network **myVNet**.
* In subnet **myBackendSubnet**.
* In network security group **myNSG**.

```azurecli-interactive
  az network nic create \
    --resource-group CreatePubLBQS-rg \
    --name myNicVM3 \
    --vnet-name myVNet \
    --subnet myBackEndSubnet \
    --network-security-group myNSG
```

## Create backend servers

In this section, you create:

* A cloud configuration file named **cloud-init.txt** for the server configuration. 
* Availability set for the virtual machines
* Three virtual machines to be used as backend servers for the load balancer.


To verify that the load balancer was successfully created, you install NGINX on the virtual machines.

### Create cloud-init configuration file

Use a cloud-init configuration file to install NGINX and run a 'Hello World' Node.js app on a Linux virtual machine. 

In your current shell, create a file named cloud-init.txt. Copy and paste the following configuration into the shell. Ensure that you copy the whole cloud-init file correctly, especially the first line:

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
### Create availability set for virtual machines

Create the availability set with [az vm availability-set create](https://docs.microsoft.com/cli/azure/vm/availability-set?view=azure-cli-latest#az-vm-availability-set-create):

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

Create the virtual machines with [az vm create](https://docs.microsoft.com/cli/azure/vm?view=azure-cli-latest#az-vm-create):

#### VM1
* Named **myVM1**.
* In resource group **CreatePubLBQS-rg**.
* Attached to network interface **myNicVM1**.
* Virtual machine image **UbuntuLTS**.
* Configuration file **cloud-init.txt** you created in step above.
* In availability set **myAvSet**.

```azurecli-interactive
  az vm create \
    --resource-group CreatePubLBQS-rg \
    --name myVM1 \
    --nics myNicVM1 \
    --image UbuntuLTS \
    --generate-ssh-keys \
    --custom-data cloud-init.txt \
    --availability-set myAvSet \
    --no-wait 
```
#### VM2
* Named **myVM2**.
* In resource group **CreatePubLBQS-rg**.
* Attached to network interface **myNicVM2**.
* Virtual machine image **UbuntuLTS**.
* Configuration file **cloud-init.txt** you created in step above.
* In **Zone 2**.

```azurecli-interactive
  az vm create \
    --resource-group CreatePubLBQS-rg \
    --name myVM2 \
    --nics myNicVM2 \
    --image UbuntuLTS \
    --generate-ssh-keys \
    --custom-data cloud-init.txt \
    --availability-set myAvSet  \
    --no-wait
```

#### VM3
* Named **myVM3**.
* In resource group **CreatePubLBQS-rg**.
* Attached to network interface **myNicVM3**.
* Virtual machine image **UbuntuLTS**.
* Configuration file **cloud-init.txt** you created in step above.
* In **Zone 3**.

```azurecli-interactive
   az vm create \
    --resource-group CreatePubLBQS-rg \
    --name myVM3 \
    --nics myNicVM3 \
    --image UbuntuLTS \
    --generate-ssh-keys \
    --custom-data cloud-init.txt \
    --availability-set myAvSet  \
    --no-wait
```
It may take a few minutes for the VMs to deploy.


## Create a public IP address

To access your web app on the Internet, you need a public IP address for the load balancer. 

Use [az network public-ip create](https://docs.microsoft.com/cli/azure/network/public-ip?view=azure-cli-latest#az-network-public-ip-create) to:

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

Create a public load balancer with [az network lb create](https://docs.microsoft.com/cli/azure/network/lb?view=azure-cli-latest#az-network-lb-create):

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

Create a health probe with [az network lb probe create](https://docs.microsoft.com/cli/azure/network/lb/probe?view=azure-cli-latest#az-network-lb-probe-create):

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

Create a load balancer rule with [az network lb rule create](https://docs.microsoft.com/cli/azure/network/lb/rule?view=azure-cli-latest#az-network-lb-rule-create):

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

Add the virtual machines to the backend pool with [az network nic ip-config address-pool add](https://docs.microsoft.com/cli/azure/network/nic/ip-config/address-pool?view=azure-cli-latest#az-network-nic-ip-config-address-pool-add):


#### VM1
* In backend address pool **myBackEndPool**.
* In resource group **CreatePubLBQS-rg**.
* Associated with network interface **myNicVM1** and **ipconfig1**.
* Associated with load balancer **myLoadBalancer**.

```azurecli-interactive
  az network nic ip-config address-pool add \
   --address-pool myBackendPool \
   --ip-config-name ipconfig1 \
   --nic-name myNicVM1 \
   --resource-group CreatePubLBQS-rg \
   --lb-name myLoadBalancer
```

#### VM2
* In backend address pool **myBackEndPool**.
* In resource group **CreatePubLBQS-rg**.
* Associated with network interface **myNicVM2** and **ipconfig1**.
* Associated with load balancer **myLoadBalancer**.

```azurecli-interactive
  az network nic ip-config address-pool add \
   --address-pool myBackendPool \
   --ip-config-name ipconfig1 \
   --nic-name myNicVM2 \
   --resource-group CreatePubLBQS-rg \
   --lb-name myLoadBalancer
```

#### VM3
* In backend address pool **myBackEndPool**.
* In resource group **CreatePubLBQS-rg**.
* Associated with network interface **myNicVM3** and **ipconfig1**.
* Associated with load balancer **myLoadBalancer**.

```azurecli-interactive
  az network nic ip-config address-pool add \
   --address-pool myBackendPool \
   --ip-config-name ipconfig1 \
   --nic-name myNicVM3 \
   --resource-group CreatePubLBQS-rg \
   --lb-name myLoadBalancer
```
---

## Test the load balancer

To get the public IP address of the load balancer, use [az network public-ip show](https://docs.microsoft.com/cli/azure/network/public-ip?view=azure-cli-latest#az-network-public-ip-show). 

Copy the public IP address, and then paste it into the address bar of your browser.

```azurecli-interactive
  az network public-ip show \
    --resource-group CreatePubLBQS-rg \
    --name myPublicIP \
    --query [ipAddress] \
    --output tsv
```
:::image type="content" source="./media/load-balancer-standard-public-cli/running-nodejs-app.png" alt-text="Test the load balancer" border="true":::

## Clean up resources

When no longer needed, use the [az group delete](https://docs.microsoft.com/cli/azure/group?view=azure-cli-latest#az-group-delete) command to remove the resource group, load balancer, and all related resources.

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

To learn more about Azure Load Balancer, continue to..
> [!div class="nextstepaction"]
> [What is Azure Load Balancer?](load-balancer-overview.md)
