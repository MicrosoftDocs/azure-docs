---
title: Convert an Azure VM to a scale set | Microsoft Docs
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

# Convert an existing Azure virtual machine to a scale set

This tutorial shows you how to use Azure CLI 2.0 to convert a virtual machine to a virtual machine scale set. You also learn how to automate the configuration of the virtual machines in the scale set. For more information on how to install Azure CLI 2.0, see [Getting Started with Azure CLI 2.0](/cli/azure/get-started-with-azure-cli.md). For more information about scale sets, see [Virtual Machine Scale Sets](../../virtual-machine-scale-sets/virtual-machine-scale-sets-overview.md).

## Step 1 - Deprovision the VM

Use SSH to connect to the VM.

Deprovision the VM using the Azure VM agent to delete files and data. For a detailed overview of deprovisioning, see [Capture a Linux virtual machine](capture-image.md).

```bash
sudo waagent -deprovision+user -force
exit
```

## Step 2 - Capture an image of the VM

For a detailed overview of capturing, see [Capture a Linux virtual machine](capture-image.md).

Deallocate the VM with [az vm deallocate](/cli/azure/vm#deallocate):

```azurecli
az vm deallocate --resource-group myResourceGroup --name myVM
```

Generalize the VM with [az vm generalize](/cli/azure/vm#generalize):

```azurecli
az vm generalize --resource-group myResourceGroup --name myVM
```

Create an image from the VM resource with [az image create](/cli/azure/image#create):

```azurecli
az image create --resource-group myResourceGroup --name myImage --source myVM
```

## Step 3 - Create the scale set

Get the **id** of the image.

```azurecli
az image show --resource-group myResourceGroup --name myImage --query id
```

```json
"/subscriptions/afbdaf8b-9188-4651-bce1-9115dd57c98b/resourceGroups/vmtest/providers/Microsoft.Compute/images/myImage"
```

Create a VM from your image resource with [az vmss create](/cli/azure/vmss#create):

```azurecli
az vmss create --resource-group myResourceGroup --name myScaleSet --image /subscriptions/afbdaf8b-9188-4651-bce1-9115dd57c98b/resourceGroups/vmtest/providers/Microsoft.Compute/images/myImage --upgrade-policy-mode automatic --vm-sku Standard_DS1_v2 --data-disk-sizes-gb 10 --admin-username azureuser --generate-ssh-keys
```

This command also attached a 10gb data disk. Keep in mind that depending on the VM size chosen (we used **Standard_DS1_v2**), the number of data disks allowed is different. For more information, review the [virtual machine sizes](sizes.md).

Once the scale set finishes, connect to it. Get a list of IP addresses for the instances for SSH with [az vmss list-instance-connection-info](/cli/azure/vmss#list-instance-connection-info):

```azurecli
az vmss list-instance-connection-info --resource-group myResourceGroup --name myScaleSet
```

```json
[
  "52.183.00.000:50000",
  "52.183.00.000:50003"
]
```

Now you can connect to the virtual machine instance to initialize the data disk

```bash
ssh -i ~/.ssh/id_rsa.pub -p 50000 azureuser@52.183.00.000
```

## Step 4 - Initialize the data disk

While connected to the virtual machine, partition the disk with `fdisk`:

```bash
(echo n; echo p; echo 1; echo  ; echo  ; echo w) | sudo fdisk /dev/sdc
```

Write a file system to the partition with the `mkfs` command:

```bash
sudo mkfs -t ext4 /dev/sdc1
```

Mount the new disk so that it is accessible in the operating system:

```bash
sudo mkdir /datadrive ; sudo mount /dev/sdc1 /datadrive
```

The disk can now be accesses through the datadrive mountpoint, which can be verified with `ls /datadrive/`.

End the SSH session.


## Step 5 - Configure firewall

Punch a hole through the firewall to the webserver hosted by the scale set. When the scale set was created, a load balancer was also created, and you used it **SSH** to the individual virtual machines. To open a port, you need two pieces of information, which you can get using Azure CLI.

* **Frontend IP address pool**  
`az network lb show --resource-group myResourceGroup --name myScaleSetLB --output table --query frontendIpConfigurations[0].name`

* **Backend IP address pool**  
`az network lb show --resource-group myResourceGroup --name myScaleSetLB --output table --query backendAddressPools[0].name`

With those two names, you can open port **80**.

```azurecli
az network lb rule create --backend-pool-name myScaleSetLBBEPool --backend-port 80 --frontend-ip-name loadBalancerFrontEnd --frontend-port 80 --name webserver --protocol tcp --resource-group myResourceGroup --lb-name myScaleSetLB
```


## Step 6 - Automate configuration

The data disk needs to be configured on each virtual machine instance. We can automate the configuration of the virtual machine with the **CustomScript** extension.

First, create a *.sh* script that includes the disk format commands.

```sh
#!/bin/bash

# Setup the data disk
(echo n; echo p; echo 1; echo  ; echo  ; echo w) | fdisk /dev/sdc
fdisk /dev/sdc
mkfs -t ext4 /dev/sdc1
mkdir /datadrive
mount /dev/sdc1 /datadrive

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
az vmss extension set --publisher Microsoft.Azure.Extensions --version 2.0 --name CustomScript --resource-group myResourceGroup --vmss-name myScaleSet --settings @settings.json
```

This extension automatically runs on all current instances, and any instances later created by scaling.

## Step 7 - Configure autoscale rules

Currently, autoscale rules cannot be set in Azure CLI. Use the [Azure portal](https://portal.azure.com) to configure autoscale.

## Step 8 - Management tasks

Throughout the lifecycle of the scale set, you may need to run one or more management tasks. Additionally, you may want to create scripts that automate various lifecycle-tasks, and the Azure CLI provides a quick way to do those tasks. Here are a few common tasks.

### Get connection info

```azurecli
az vmss list-instance-connection-info --resource-group myResourceGroup --name myScaleSet
```

### Set instance count (manual scale)

```azurecli
az vmss scale --resource-group myResourceGroup --name myScaleSet --new-capacity 4
```

### Delete resource group

Deleting a resource group also deletes all resources contained within.

```azurecli
az group delete --name myResourceGroup
```

## Next steps
To learn more about some of the virtual machine scale set features introduced in this tutorial, see the following information:

- [Azure Virtual Machine Scale Sets overview](../../virtual-machine-scale-sets/virtual-machine-scale-sets-overview.md)
- [Azure Load Balancer overview](../../load-balancer/load-balancer-overview.md)
- [Control network traffic flow with network security groups](../../virtual-network/virtual-networks-nsg.md)