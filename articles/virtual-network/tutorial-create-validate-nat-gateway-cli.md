---
title: 'Tutorial: Create and test a NAT gateway - Azure CLI'
titlesuffix: Azure Virtual Network NAT
description: This tutorial shows how to create a NAT gateway using the Azure CLI and test the NAT service
services: virtual-network
documentationcenter: na
author: asudbring
manager: KumudD
Customer intent: I want to test a NAT gateway for outbound connectivity for my virtual network.
ms.service: virtual-network
ms.subservice: nat
ms.devlang: na
ms.topic: tutorial
ms.workload: infrastructure-services
ms.date: 06/11/2020
ms.author: allensu
---
# Tutorial: Create a NAT gateway using Azure CLI and test the NAT service

In this tutorial, you'll create a NAT gateway to provide outbound connectivity for virtual machines in Azure. To test the NAT gateway, you deploy a source and destination virtual machine. You'll test the NAT gateway by making outbound connections to a public IP address. These connections will come from the source to the destination virtual machine. This tutorial deploys source and destination in two different virtual networks in the same resource group for simplicity only.


[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

You can complete this tutorial using Azure Cloud Shell or run the respective commands locally.  If you haven't used Azure Cloud Shell, you should [sign in now](https://shell.azure.com).

If you choose to run these commands locally, you need to install CLI.  This tutorial requires that you're running a version of the Azure CLI version 2.0.71 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).


## Create a resource group

Create a resource group with [az group create](https://docs.microsoft.com/cli/azure/group). An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named **myResourceGroupNAT** in the **eastus2** location:

```azurecli-interactive
  az group create \
    --name myResourceGroupNAT \
    --location eastus2
    
```

## Create the NAT Gateway

### Create a public IP address

To access the public Internet, you need one or more public IP addresses for the NAT gateway. Use [az network public-ip create](https://docs.microsoft.com/cli/azure/network/public-ip) to create a public IP address resource named **myPublicIPsource** in **myResourceGroupNAT**.

```azurecli-interactive
  az network public-ip create \
  --resource-group myResourceGroupNAT \
  --name myPublicIPsource \
  --sku standard
  
```

### Create a public IP prefix

You can use one or more public IP address resources, public IP prefixes or both with NAT gateway. We'll add a public IP prefix resource to this scenario to demonstrate.   Use [az network public-ip prefix create](/cli/azure/network/public-ip/prefix?view=azure-cli-latest#az-network-public-ip-prefix-create) to create a public IP prefix resource named **myPublicIPprefixsource** in **myResourceGroupNAT**.

```azurecli-interactive
  az network public-ip prefix create \
  --resource-group myResourceGroupNAT \
  --name myPublicIPprefixsource \
  --length 31
  
```

### Create a NAT gateway resource

This section details how you can create and configure the following components of the NAT service using the NAT gateway resource:
  - A public IP pool and public IP prefix to use for outbound flows translated by the NAT gateway resource.
  - Change the idle timeout from the default of 4 minutes to 10 minutes.

Create a global Azure NAT gateway with [az network nat gateway create](https://docs.microsoft.com/cli/azure/network/nat?view=azure-cli-latest) named **myNATgateway**. The command uses both the public IP address **myPublicIP** and the public IP prefix **myPublicIPprefix**. The command also changes the idle timeout to 10 minutes.

```azurecli-interactive
  az network nat gateway create \
    --resource-group myResourceGroupNAT \
    --name myNATgateway \
    --public-ip-addresses myPublicIPsource \
    --public-ip-prefixes myPublicIPprefixsource \
    --idle-timeout 10       
    
  ```

At this point, the NAT gateway is functional and all that is missing is to configure which subnets of a virtual network should use it.

## Prepare the source for outbound traffic

We'll guide you through setup of a full test environment. You'll set up a test using open-source tools to verify the NAT gateway. We'll start with the source, which will use the NAT gateway we created previously.

### Configure virtual network for source

Before you deploy a VM and can test your NAT gateway, we need to create the virtual network.

Create a virtual network named **myVnetsource** with a subnet named **mySubnetsource** in the **myResourceGroupNAT** using [az network Microsoft Azure Virtual Network create](https://docs.microsoft.com/cli/azure/network/vnet).  The IP address space for the virtual network is **192.168.0.0/16**. The subnet within the virtual network is **192.168.0.0/24**.

```azurecli-interactive
  az network vnet create \
    --resource-group myResourceGroupNAT \
    --name myVnetsource \
    --address-prefix 192.168.0.0/16 \
    --subnet-name mySubnetsource \
    --subnet-prefix 192.168.0.0/24
    
```

### Configure NAT service for source subnet

Configure the source subnet **mySubnetsource** in virtual network **myVnetsource** to use a specific NAT gateway resource **myNATgateway** with [az network Microsoft Azure Virtual Network subnet update](https://docs.microsoft.com/cli/azure/network/vnet/subnet). This command will activate the NAT service on the specified subnet.

```azurecli-interactive
    az network vnet subnet update \
    --resource-group myResourceGroupNAT \
    --vnet-name myVnetsource \
    --name mySubnetsource \
    --nat-gateway myNATgateway
    
```

All outbound traffic to Internet destinations is now using the NAT service.  It's not necessary to configure a UDR.

Before we can test the NAT gateway, we need to create a source VM.  We'll assign a public IP address resource as an instance-level public IP to access this VM from the outside. This address is only used to access it for the test.  We'll demonstrate how the NAT service takes precedence over other outbound options.

You could also create this VM without a public IP and create another VM to use as a jumpbox without a public IP as an exercise.

### Create public IP for source VM

We create a public IP to be used to access the source VM. Use [az network public-ip create](https://docs.microsoft.com/cli/azure/network/public-ip) to create a public IP address resource named **myPublicIPsourceVM** in **myResourceGroupNAT**.

```azurecli-interactive
  az network public-ip create \
    --resource-group myResourceGroupNAT \
    --name myPublicIPsourceVM \
    --sku standard
    
```

### Create an NSG for source VM

Because Standard public IP addresses are 'secure by default', we need to create an NSG to allow inbound access for ssh access.  Azure NAT service is flow direction aware. This NSG won't be used for outbound once the NAT gateway is configured on the same subnet. Use [az network nsg create](https://docs.microsoft.com/cli/azure/network/nsg?view=azure-cli-latest#az-network-nsg-create) to create an NSG resource named **myNSGsource** in **myResourceGroupNAT**.

```azurecli-interactive
  az network nsg create \
    --resource-group myResourceGroupNAT \
    --name myNSGsource 
    
```

### Expose SSH endpoint on source VM

We create a rule in the NSG for SSH access to the source vm. Use [az network nsg rule create](https://docs.microsoft.com/cli/azure/network/nsg/rule?view=azure-cli-latest#az-network-nsg-rule-create) to create an NSG rule named **ssh**. This rule will be created in the NSG named **myNSGsource** in the resource group **myResourceGroupNAT**.

```azurecli-interactive
  az network nsg rule create \
    --resource-group myResourceGroupNAT \
    --nsg-name myNSGsource \
    --priority 100 \
    --name ssh \
    --description "SSH access" \
    --access allow \
    --protocol tcp \
    --direction inbound \
    --destination-port-ranges 22
    
```

### Create NIC for source VM

Create a network interface with [az network nic create](/cli/azure/network/nic#az-network-nic-create) and associate with the public IP address and the network security group. 

```azurecli-interactive
  az network nic create \
    --resource-group myResourceGroupNAT \
    --name myNicsource \
    --vnet-name myVnetsource \
    --subnet mySubnetsource \
    --public-ip-address myPublicIPSourceVM \
    --network-security-group myNSGsource
    
```

### Create a source VM

Create the virtual machine with [az vm create](/cli/azure/vm#az-vm-create).  We generate ssh keys for this VM and store the private key to use later.

```azurecli-interactive
  az vm create \
    --resource-group myResourceGroupNAT \
    --name myVMsource \
    --nics myNicsource \
    --image UbuntuLTS \
    --generate-ssh-keys \
    --no-wait
    
```

While the command will return immediately, it may take a few minutes for the VM to get deployed.

## Prepare destination for outbound traffic

We'll now create a destination for the outbound traffic translated by the NAT service to allow you to test it.

### Configure virtual network for destination

 We need to create a virtual network where the destination virtual machine will be.  These commands are the same steps as for the source VM with small changes to expose the destination endpoint.

Create a virtual network named **myVnetdestination** with a subnet named **mySubnetdestination** in the **myResourceGroupNAT** using [az network Microsoft Azure Virtual Network create](https://docs.microsoft.com/cli/azure/network/vnet).  The IP address space for the virtual network is **192.168.0.0/16**. The subnet within the virtual network is **192.168.0.0/24**.

```azurecli-interactive
  az network vnet create \
    --resource-group myResourceGroupNAT \
    --name myVnetdestination \
    --address-prefix 192.168.0.0/16 \
    --subnet-name mySubnetdestination \
    --subnet-prefix 192.168.0.0/24
    
```

### Create public IP for destination VM

We create a public IP to be used to access the source VM. Use [az network public-ip create](https://docs.microsoft.com/cli/azure/network/public-ip) to create a public IP address resource named **myPublicIPdestinationVM** in **myResourceGroupNAT**. 

```azurecli-interactive
  az network public-ip create \
  --resource-group myResourceGroupNAT \
  --name myPublicIPdestinationVM \
  --sku standard
  
```

### Create an NSG for destination VM

Standard Public IP addresses are 'secure by default', you'll need to create an NSG to allow inbound access for ssh. The Azure NAT service is flow direction aware. This NSG won't be used for outbound once the NAT gateway is configured on the same subnet. Use [az network nsg create](https://docs.microsoft.com/cli/azure/network/nsg?view=azure-cli-latest#az-network-nsg-create) to create an NSG resource named **myNSGdestination** in **myResourceGroupNAT**.

```azurecli-interactive
    az network nsg create \
    --resource-group myResourceGroupNAT \
    --name myNSGdestination
    
```

### Expose SSH endpoint on destination VM

We create a rule in the NSG for SSH access to the destination vm. Use [az network nsg rule create](https://docs.microsoft.com/cli/azure/network/nsg/rule?view=azure-cli-latest#az-network-nsg-rule-create) to create an NSG rule named **ssh**. This rule will be created in the NSG named **myNSGdestination** in the resource group **myResourceGroupNAT**.

```azurecli-interactive
    az network nsg rule create \
    --resource-group myResourceGroupNAT \
    --nsg-name myNSGdestination \
    --priority 100 \
    --name ssh \
    --description "SSH access" \
    --access allow \
    --protocol tcp \
    --direction inbound \
    --destination-port-ranges 22
    
```

### Expose HTTP endpoint on destination VM

We create a rule in the NSG for HTTP access to the destination vm. Use [az network nsg rule create](https://docs.microsoft.com/cli/azure/network/nsg/rule?view=azure-cli-latest#az-network-nsg-rule-create) to create an NSG rule named **http** in the NSG named **myNSGdestination** in **myResourceGroupNAT**.

```azurecli-interactive
    az network nsg rule create \
    --resource-group myResourceGroupNAT \
    --nsg-name myNSGdestination \
    --priority 101 \
    --name http \
    --description "HTTP access" \
    --access allow \
    --protocol tcp \
    --direction inbound \
    --destination-port-ranges 80
    
```

### Create NIC for destination VM

Create a network interface with [az network nic create](/cli/azure/network/nic#az-network-nic-create) and associate with the public IP address **myPublicIPdestinationVM** and the network security group **myNSGdestination**. 

```azurecli-interactive
    az network nic create \
    --resource-group myResourceGroupNAT \
    --name myNicdestination \
    --vnet-name myVnetdestination \
    --subnet mySubnetdestination \
    --public-ip-address myPublicIPdestinationVM \
    --network-security-group myNSGdestination
    
```

### Create a destination VM

Create the virtual machine with [az vm create](/cli/azure/vm#az-vm-create).  We generate ssh keys for this VM and store the private key to use later.

 ```azurecli-interactive
    az vm create \
    --resource-group myResourceGroupNAT \
    --name myVMdestination \
    --nics myNicdestination \
    --image UbuntuLTS \
    --generate-ssh-keys \
    --no-wait
    
```
While the command will return immediately, it may take a few minutes for the VM to get deployed.

## Prepare a web server and test payload on destination VM

First we need to discover the IP address of the destination VM.  To get the public IP address of the destination VM, use [az network public-ip show](/cli/azure/network/public-ip#az-network-public-ip-show). 

```azurecli-interactive
  az network public-ip show \
    --resource-group myResourceGroupNAT \
    --name myPublicIPdestinationVM \
    --query [ipAddress] \
    --output tsv
    
``` 

>[!IMPORTANT]
>Copy the public IP address, and then paste it into a notepad so you can use it in subsequent steps. Indicate this is the destination virtual machine.

### Sign in to destination VM

The SSH credentials should be stored in your Cloud Shell from the previous operation.  Open an [Azure Cloud Shell](https://shell.azure.com) in your browser. Use the IP address retrieved in the previous step to SSH to the virtual machine. 

```bash
ssh <ip-address-destination>
```

Copy and paste the following commands once you've signed in.  

```bash
sudo apt -y update && \
sudo apt -y upgrade && \
sudo apt -y install nginx && \
sudo ln -sf /dev/null /var/log/nginx/access.log && \
sudo touch /var/www/html/index.html && \
sudo rm /var/www/html/index.nginx-debian.html && \
sudo dd if=/dev/zero of=/var/www/html/100k bs=1024 count=100

```

These commands will update your virtual machine, install nginx, and create a 100-KBytes file. This file will be retrieved from the source VM using the NAT service.

Close the SSH session with the destination VM.

## Prepare test on source VM

First we need to discover the IP address of the source VM.  To get the public IP address of the source VM, use [az network public-ip show](/cli/azure/network/public-ip#az-network-public-ip-show). 

```azurecli-interactive
  az network public-ip show \
    --resource-group myResourceGroupNAT \
    --name myPublicIPsourceVM \
    --query [ipAddress] \
    --output tsv
    
``` 

>[!IMPORTANT]
>Copy the public IP address, and then paste it into a notepad so you can use it in subsequent steps. Indicate this is the source virtual machine.

### Sign in to source VM

Again, the SSH credentials are stored in Cloud Shell. Open a new tab for [Azure Cloud Shell](https://shell.azure.com) in your browser.  Use the IP address retrieved in the previous step to SSH to the virtual machine. 

```bash
ssh <ip-address-source>
```

Copy and paste the following commands to prepare for testing the NAT service.

```bash
sudo apt -y update && \
sudo apt -y upgrade && \
sudo apt install -y nload golang && \
echo 'export GOPATH=${HOME}/go' >> .bashrc && \
echo 'export PATH=${PATH}:${GOPATH}/bin' >> .bashrc && \
. ~/.bashrc &&
go get -u github.com/rakyll/hey

```

This command will update your virtual machine, install go, install [hey](https://github.com/rakyll/hey) from GitHub, and update your shell environment.

You're now ready to test the NAT service.

## Validate NAT service

While logged into the source VM, you can use **curl** and **hey** to generate requests to the destination IP address.

Use curl to retrieve the 100-KBytes file.  Replace **\<ip-address-destination>** in the example below with the destination IP address you have previously copied.  The **--output** parameter indicates that the retrieved file will be discarded.

```bash
curl http://<ip-address-destination>/100k --output /dev/null
```

You can also generate a series of requests using **hey**. Again, replace **\<ip-address-destination>** with the destination IP address you have previously copied.

```bash
hey -n 100 -c 10 -t 30 --disable-keepalive http://<ip-address-destination>/100k
```

This command will generate 100 requests, 10 concurrently, with a timeout of 30 seconds. The TCP connection won't be reused.  Each request will retrieve 100 Kbytes.  At the end of the run, **hey** will report some statistics about how well the NAT service did.

## Clean up resources

When no longer needed, you can use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group and all resources contained within.

```azurecli-interactive 
  az group delete --name myResourceGroupNAT
  
```

## Next steps
In this tutorial, you created a NAT gateway, created a source and destination VM, and then tested the NAT gateway.

Review metrics in Azure Monitor to see your NAT service operating. Diagnose issues such as resource exhaustion of available SNAT ports.  Resource exhaustion of SNAT ports is easily addressed by adding additional public IP address resources or public IP prefix resources or both.

- Learn about [Virtual Network NAT](./nat-overview.md)
- Learn about [NAT gateway resource](./nat-gateway-resource.md).
- Quickstart for deploying [NAT gateway resource using Azure CLI](./quickstart-create-nat-gateway-cli.md).
- Quickstart for deploying [NAT gateway resource using Azure PowerShell](./quickstart-create-nat-gateway-powershell.md).
- Quickstart for deploying [NAT gateway resource using Azure portal](./quickstart-create-nat-gateway-portal.md).

> [!div class="nextstepaction"]

