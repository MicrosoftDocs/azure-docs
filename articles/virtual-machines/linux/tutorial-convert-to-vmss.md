---
title: Create and deploy an Azure VM scale set | Microsoft Docs
description: Create and deploy a Linux Azure virtual machine scale set with the Azure CLI.
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

# Learn how to create and deploy a virtual machine scale set
This tutorial shows you how to use Azure CLI 2.0 to create and manage a virtual machine scale set. You also learn how to automate the configuration of the virtual machines in the scale set. For more information on how to install Azure CLI 2.0, see [Getting Started with Azure CLI 2.0](/cli/azure/get-started-with-azure-cli.md). For more information about scale sets, see [Virtual Machine Scale Sets](../../virtual-machine-scale-sets/virtual-machine-scale-sets-overview.md).

## Step 1 - Create your scale set

The first thing you need to do is sign into your subscription.

```azurecli
az login
```

Next, create a resource group that the virtual machine scale set is associated with.

```azurecli
az group create --location westus2 --name vmss-test-1
```

With Azure CLI, you can create a virtual machine scale set with minimal effort, default values are provided for you. For example, if you don't specify any virtual network information, one is created for you. If omitted, the following parts are created for you: a load balancer, a VNET, and a public IP address.

When choosing the virtual machine image you want to use on the virtual machine scale set, you have a few choices:

- URN  
The identifier of a resource:  
**Canonical:UbuntuServer:16.04-LTS:latest**

- URN alias  
The friendly name of a URN:  
**UbuntuLTS**

- Custom resource id  
The path to an azure resource:  
**/subscriptions/subscription-guid/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/images/MyImage**

- Web resource  
The path to an HTTP URI:  
**http://contoso.blob.core.windows.net/vhds/osdiskimage.vhd**

To create a virtual machine scale set, specify the _resource group_, _name_, _operating system image_, and _authentication information_. The following example creates a basic virtual machine scale set (this step may take a few minutes).

In this example, we use **UbuntuLTS** and attach a 10gb data disk. Keep in mind that depending on the VM size chosen (we used **Standard_DS1_v2**), the number of data disks allowed is different. For more information, review the [virtual machine sizes](sizes.md).

```azurecli
az vmss create --resource-group vmss-test-1 --name MyScaleSet --image UbuntuLTS --upgrade-policy-mode automatic --vm-sku Standard_DS1_v2 --data-disk-sizes-gb 10 --authentication-type password --admin-username azureuser --admin-password P@ssw0rd!
```

Once the scale set finishes, connect to it. First, get the list of IP addresses and SSH ports.

```azurecli
az vmss list-instance-connection-info --resource-group vmss-test-1 --name MyScaleSet

[
  "52.183.00.000:50000",
  "52.183.00.000:50003"
]
```

Now you can connect to the virtual machine instance and move on to the next step.

```bash
ssh 52.183.00.000 -p 50001 -l azureuser
```

## Step 2 - Initialize the data disk

While connected to the virtual machine, partition the disk with `fdisk`.

```bash
(echo n; echo p; echo 1; echo  ; echo  ; echo w) | sudo fdisk /dev/sdc
```

Write a file system to the partition with the `mkfs` command.

```bash
sudo mkfs -t ext4 /dev/sdc1
```

Mount the new disk so that it is accessible in the operating system.

```bash
sudo mkdir /datadrive ; sudo mount /dev/sdc1 /datadrive
```

The disk can now be accesses through the datadrive mountpoint, which can be verified with `ls /datadrive/`.


## Step 3 - Install a web server

While connected to the virtual machine, install **nginx**.

```bash
sudo apt-get -y update
sudo apt-get -y install nginx
```

Now your virtual machine has a simple webserver installed, however, you cannot see the website from the outside.

## Step 4 - Configure firewall

You must punch a hole through the firewall to the webserver that was installed. When the scale set was created, a load balancer was also created, and you used it **SSH** to the individual virtual machines. To open a port, you need two pieces of information, which you can get using Azure CLI.

* **Frontend IP address pool**  
`az network lb show --resource-group vmss-test-1 --name MyScaleSetLB --output table --query frontendIpConfigurations[0].name`

* **Backend IP address pool**  
`az network lb show --resource-group vmss-test-1 --name MyScaleSetLB --output table --query backendAddressPools[0].name`

With those two names, you can open port **80**.

```azurecli
az network lb rule create --backend-pool-name MyScaleSetLBBEPool --backend-port 80 --frontend-ip-name loadBalancerFrontEnd --frontend-port 80 --name webserver --protocol tcp --resource-group vmss-test-1 --lb-name MyScaleSetLB
```


## Step 5 - Automate configuration

The previous steps (set up the data disk and install nginx) have to be performed on each virtual machine instance. To make this process easier and more flexible, you can automate the configuration of the virtual machine with the **CustomScript** extension.

First, create a *.sh* script that includes the disk format commands and then installs *nginx*.

```sh
#!/bin/bash

# Setup the data disk
(echo n; echo p; echo 1; echo  ; echo  ; echo w) | fdisk /dev/sdc
fdisk /dev/sdc
mkfs -t ext4 /dev/sdc1
mkdir /datadrive
mount /dev/sdc1 /datadrive

# Install nginx
apt-get -y update
apt-get -y install nginx

exit 0
```

Next, upload that script file to where the **CustomScript** extension can access it. A copy is available [here](https://gist.githubusercontent.com/Thraka/ab1d8b78ac4b23722f3d3c1c03ac5df4).

Create a local file named **settings.json** and put the following JSON block in it. The `flieUris` property should be set to where your script file was uploaded to.

```json
{
  "fileUris": ["https://gist.githubusercontent.com/Thraka/ab1d8b78ac4b23722f3d3c1c03ac5df4/raw/3ac6e385010ac675e23ce583ce27b1a752f1b482/prep-vmss.sh"],
  "commandToExecute": "bash prep-vmss.sh" 
}
```

Deploy this command to your scale set with the **CustomScript** extension, referencing the **settings.json** file we just created.

```azurecli
az vmss extension set --publisher Microsoft.Azure.Extensions --version 2.0 --name CustomScript --resource-group vmss-test-1 --vmss-name myscaleset --settings @settings.json
```

This extension will automatically run on all current instances, and any instances later created by scaling.

## Step 6 - Configure autoscale rules

Currently, autoscale rules cannot be set in Azure CLI. Use the [Azure portal](https://portal.azure.com) to configure autoscale.

## Step 7 - Management tasks

Throughout the lifecycle of the scale set, you may need to run one or more management tasks. Additionally, you may want to create scripts that automate various lifecycle-tasks, and the Azure CLI provides a quick way to do those tasks. Here are a few common tasks.

### Get connection info

```azurecli
az vmss list-instance-connection-info --resource-group vmss-test-1 --name MyScaleSet
```

### Set instance count (manual scale)

```azurecli
az vmss scale --resource-group vmss-test-1 --name myscaleset --new-capacity 4
```

### List virtual machine gallery images

```azurecli
az vm image list
```

### Delete resource group

Deleting a resource group also deletes all resources contained within.

```azurecli
az group delete --name vmss-test-1
```