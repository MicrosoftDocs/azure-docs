---
title: Manage Linux virtual machines with the Azure CLI | Microsoft Docs
description: Tutorial - Manage Linux virtual machines with the Azure CLI
services: virtual-machines-linux
documentationcenter: virtual-machines
author: neilpeterson
manager: timlt
editor: tysonn
tags: azure-service-management

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 03/28/2017
ms.author: nepeters
---

# Manage Linux virtual machines with the Azure CLI

In this tutorial, you will create a virtual machine and perform common management tasks such as adding a disk, automating software installation, and creating a virtual machine snapshot. 

To complete this tutorial, make sure that you have installed the latest [Azure CLI 2.0](/cli/azure/install-azure-cli).

## Step 1 – Log in to Azure

First, open up a terminal and log in to your Azure subscription with the [az login](/cli/azure/#login) command.

```azurecli
az login
```

## Step 2 – Create resource group

Create a resource group with the [az group create](https://docs.microsoft.com/cli/azure/group#create) command. 

An Azure resource group is a logical container into which Azure resources are deployed and managed. A resource group must be created before a virtual machine. In this example, a resource group named `myResourceGroup` is created in the `westeurope` region. 

```azurecli
az group create --name myResourceGroup --location westeurope
```

## Step 3 - Prepare configuration

When deploying a virtual machine, **cloud-init** can be used to automate configurations such as installing packages, creating files, and running scripts. In this tutorial, the configurations of two items are automated:

- Installing an NGINX webserver
- Provisioning a second disk on the VM

Because the **cloud-init** configuration happens at VM deployment time, a **cloud-init** configuration needs to be defined before creating the virtual machine.

Create a file name `cloud-init.txt` and copy in the following content. This configuration installs the NGINX package and runs commands to formant and mount the second disk.

```yaml
#cloud-config
package_upgrade: true
packages:
  - nginx
runcmd:
  - (echo n; echo p; echo 1; echo ; echo ; echo w) | sudo fdisk /dev/sdc
  - sudo mkfs -t ext4 /dev/sdc1
  - sudo mkdir /datadrive
  - sudo mount /dev/sdc1 /datadrive
```

## Step 4 - Create virtual machine

Create a virtual machine with the [az vm create](https://docs.microsoft.com/cli/azure/vm#create) command. 

When creating a virtual machine, several options are available such as operating system image, disk sizing, and administrative credentials. In this example, a virtual machine is created with a name of `myVM` running Ubuntu. A 50-GB disk is created and attached to the VM using the `--data-disk-sizes-gb` argument. The `--custom-data` argument takes in the cloud-init configuration and stages it on the VM. Finally, SSH keys are also created if they do not exist.

```azurecli
az vm create \
  --resource-group myResourceGroup \
  --name myVM \
  --image Canonical:UbuntuServer:14.04.4-LTS:latest \
  --generate-ssh-keys \
  --data-disk-sizes-gb 50 \
  --custom-data cloud-init.txt
```

Once the VM has been created, the Azure CLI outputs the following information. Take note of the public IP address, this address is used when accessing the virtual machine. 

```azurecli
{
  "fqdns": "",
  "id": "/subscriptions/d5b9d4b7-6fc1-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM",
  "location": "westeurope",
  "macAddress": "00-0D-3A-23-9A-49",
  "powerState": "VM running",
  "privateIpAddress": "10.0.0.4",
  "publicIpAddress": "52.174.34.95",
  "resourceGroup": "myResourceGroup"
}
```

While the VM has been deployed, the **cloud-init** configuration may take a few minutes to complete. 

## Step 5 – Configure firewall

An Azure [network security group](../virtual-network/virtual-networks-nsg.md) (NSG) controls inbound and outbound traffic for one or many virtual machines. Network security group rules allow or deny network traffic on a specific port or port range. These rules can also include a source address prefix so that only traffic originating at a predefined source can communicate with a virtual machine.

In the previous section, the NGINX webserver was installed. Without a network security group rule to allow inbound traffic on port 80, the webserver cannot be accessed on the internet. This step walks you through creating the NSG rule to allow inbound connections on port 80.

### Create NSG rule

To create an inbound NSG rule, use the [az vm open-port](https://docs.microsoft.com/cli/azure/vm#open-port) command. The following example opens port `80` for the virtual machine.

```azurecli
az vm open-port --port 80 --resource-group myResourceGroup --name myVM 
```

Now browse to the public IP address of the virtual machine. With the NSG rule in place, the default NGINX website is displayed.

![NGINX default site](./media/virtual-machines-linux-tutorial-manage-vm/nginx.png)  

## Step 6 – Snapshot virtual machine

Taking a disk snapshot creates a read only, point-in-time copy of the disk. In this step, a snapshot is taken of the VMs operating system disk. With an OS disk snapshot, the virtual machine can be quickly restored to a specific state, or the snapshot can be used to create a new virtual machine with an identical state.

### Create snapshot

Before creating a snapshot, the Id or name of the disk is needed. Use the [az vm show](https://docs.microsoft.com/cli/azure/vm#show) command to get the disk id. In this example, the disk id is stored in a variable and is used in a later step.

```azurecli
osdiskid=$(az vm show -g myResourceGroup -n myVM --query "storageProfile.osDisk.managedDisk.id" -o tsv)
```

Now that you have the id of the disk, the following command creates the snapshot.

```azurcli
az snapshot create -g myResourceGroup --source "$osdiskid" --name osDisk-backup
```

### Create disk from snapshot

This snapshot can then be converted into a disk, which can be used to recreate the virtual machine.

```azurecli
az disk create --resource-group myResourceGroup --name mySnapshotDisk --source osDisk-backup
```

### Restore virtual machine from snapshot

To demonstrate virtual machine recovery, delete the existing virtual machine. 

```azurecli
az vm delete --resource-group myResourceGroup --name myVM
```

When re-creating the virtual machine, the existing network interface will be re-used. This ensures that network security configurations are retained.

Get the network interface name using the [az network nic list](https://docs.microsoft.com/cli/azure/network/nic#list) command. This example places the name in a variable named `nic`, which is used in the next step.

```azurecli
nic=$(az network nic list --resource-group myResourceGroup --query "[].[name]" -o tsv)
```

Create a new virtual machine from the snapshot disk.

```azurecli
az vm create --resource-group myResourceGroup --name myVM --attach-os-disk mySnapshotDisk --os-type linux --nics $nic
```

Take note of the new public ip address, and browser to this address with an internet browser. You will see that NGINX is running in the restored virtual machine. 

### Reconfigure data disk

The data disk can now be reattached to the virtual machine. 

First find the data disks name using the [az disk list](https://docs.microsoft.com/cli/azure/disk#list) command. This example places the name of the disk in a variable named `datadisk`, which is used in the next step.

```azurecli
datadisk=$(az disk list -g myResourceGroup --query "[?contains(name,'myVM')].[name]" -o tsv)
```

Use the [az vm disk attach](https://docs.microsoft.com/cli/azure/vm/disk#attach) command to attach the disk.

```azurecli
az vm disk attach –g myResourceGroup –-vm-name myVM –-disk $datadisk
```

The disk also needs to be mounted to the operating system. To mount the disk, connect to the virtual machine and run `sudo mount /dev/sdc1 /datadrive`, or your preferred disk mounting operation. 

## Step 7 – Management tasks

During the lifecycle of a virtual machine, you may want to run management tasks such as starting, stopping, or deleting a virtual machine. Additionally, you may want to create scripts to automate repetitive or complex tasks. Using the Azure CLI, many common management tasks can be run from the command line or in scripts. 

### Get IP address

This command returns the private and public IP addresses of a virtual machine.  

```azurecli
az vm list-ip-addresses --resource-group myResourceGroup --name myVM
```

### Resize virtual machine

To resize an Azure virtual machine, you need to know the name of the sizes available in the chosen Azure region. These sizes can be found with the [az vm list-sizes](https://docs.microsoft.com/cli/azure/vm#list-sizes) command.

```azurecli
az vm list-sizes --location westeurope --output table
```

The virtual machine can be resized using the [az vm resize](https://docs.microsoft.com/cli/azure/vm#resize) command. 

```azurecli
az vm resize -g myResourceGroup -n myVM --size Standard_F4s
```

### Stop virtual machine

```azurecli
az vm stop --resource-group myResourceGroup --name myVM
```

### Start virtual machine

```azurecli
az vm start --resource-group myResourceGroup --name myVM
```

### Delete resource group

Deleting a resource group also deletes all resources contained within.

```azurecli
az group delete --name myResourceGroup
```

## Next Steps

Tutorial – [Create load balanced virtual machines](./virtual-machines-linux-tutorial-load-balance-nodejs.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

Samples – [Azure CLI sample scripts](./virtual-machines-linux-cli-samples.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)