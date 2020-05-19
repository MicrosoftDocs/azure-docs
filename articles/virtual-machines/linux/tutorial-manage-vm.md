---
title: Tutorial - Create and manage Linux VMs with the Azure CLI 
description: In this tutorial, you learn how to use the Azure CLI to create and manage Linux VMs in Azure
services: virtual-machines-linux
documentationcenter: virtual-machines
author: cynthn
manager: gwallace

tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.topic: tutorial
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 03/23/2018
ms.author: cynthn
ms.custom: mvc

#Customer intent: As an IT administrator, I want to learn about common maintenance tasks so that I can create and manage Linux VMs in Azure
---

# Tutorial: Create and Manage Linux VMs with the Azure CLI

Azure virtual machines provide a fully configurable and flexible computing environment. This tutorial covers basic Azure virtual machine deployment items such as selecting a VM size, selecting a VM image, and deploying a VM. You learn how to:

> [!div class="checklist"]
> * Create and connect to a VM
> * Select and use VM images
> * View and use specific VM sizes
> * Resize a VM
> * View and understand VM state

This tutorial uses the CLI within the [Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview), which is constantly updated to the latest version. To open the Cloud Shell, select **Try it** from the top of any code block.

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.30 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

## Create resource group

Create a resource group with the [az group create](https://docs.microsoft.com/cli/azure/group) command. 

An Azure resource group is a logical container into which Azure resources are deployed and managed. A resource group must be created before a virtual machine. In this example, a resource group named *myResourceGroupVM* is created in the *eastus* region. 

```azurecli-interactive
az group create --name myResourceGroupVM --location eastus
```

The resource group is specified when creating or modifying a VM, which can be seen throughout this tutorial.

## Create virtual machine

Create a virtual machine with the [az vm create](https://docs.microsoft.com/cli/azure/vm) command. 

When you create a virtual machine, several options are available such as operating system image, disk sizing, and administrative credentials. The following example creates a VM named *myVM* that runs Ubuntu Server. A user account named *azureuser* is created on the VM, and SSH keys are generated if they do not exist in the default key location (*~/.ssh*):

```azurecli-interactive
az vm create \
    --resource-group myResourceGroupVM \
    --name myVM \
    --image UbuntuLTS \
    --admin-username azureuser \
    --generate-ssh-keys
```

It may take a few minutes to create the VM. Once the VM has been created, the Azure CLI outputs information about the VM. Take note of the `publicIpAddress`, this address can be used to access the virtual machine.. 

```output
{
  "fqdns": "",
  "id": "/subscriptions/d5b9d4b7-6fc1-0000-0000-000000000000/resourceGroups/myResourceGroupVM/providers/Microsoft.Compute/virtualMachines/myVM",
  "location": "eastus",
  "macAddress": "00-0D-3A-23-9A-49",
  "powerState": "VM running",
  "privateIpAddress": "10.0.0.4",
  "publicIpAddress": "52.174.34.95",
  "resourceGroup": "myResourceGroupVM"
}
```

## Connect to VM

You can now connect to the VM with SSH in the Azure Cloud Shell or from your local computer. Replace the example IP address with the `publicIpAddress` noted in the previous step.

```bash
ssh azureuser@52.174.34.95
```

Once logged in to the VM, you can install and configure applications. When you are finished, you close the SSH session as normal:

```bash
exit
```

## Understand VM images

The Azure marketplace includes many images that can be used to create VMs. In the previous steps, a virtual machine was created using an Ubuntu image. In this step, the Azure CLI is used to search the marketplace for a CentOS image, which is then used to deploy a second virtual machine. 

To see a list of the most commonly used images, use the [az vm image list](/cli/azure/vm/image) command.

```azurecli-interactive 
az vm image list --output table
```

The command output returns the most popular VM images on Azure.

```output
Offer          Publisher               Sku                 Urn                                                             UrnAlias             Version
-------------  ----------------------  ------------------  --------------------------------------------------------------  -------------------  ---------
WindowsServer  MicrosoftWindowsServer  2016-Datacenter     MicrosoftWindowsServer:WindowsServer:2016-Datacenter:latest     Win2016Datacenter    latest
WindowsServer  MicrosoftWindowsServer  2012-R2-Datacenter  MicrosoftWindowsServer:WindowsServer:2012-R2-Datacenter:latest  Win2012R2Datacenter  latest
WindowsServer  MicrosoftWindowsServer  2008-R2-SP1         MicrosoftWindowsServer:WindowsServer:2008-R2-SP1:latest         Win2008R2SP1         latest
WindowsServer  MicrosoftWindowsServer  2012-Datacenter     MicrosoftWindowsServer:WindowsServer:2012-Datacenter:latest     Win2012Datacenter    latest
UbuntuServer   Canonical               16.04-LTS           Canonical:UbuntuServer:16.04-LTS:latest                         UbuntuLTS            latest
CentOS         OpenLogic               7.3                 OpenLogic:CentOS:7.3:latest                                     CentOS               latest
openSUSE-Leap  SUSE                    42.2                SUSE:openSUSE-Leap:42.2:latest                                  openSUSE-Leap        latest
RHEL           RedHat                  7.3                 RedHat:RHEL:7.3:latest                                          RHEL                 latest
SLES           SUSE                    12-SP2              SUSE:SLES:12-SP2:latest                                         SLES                 latest
Debian         credativ                8                   credativ:Debian:8:latest                                        Debian               latest
CoreOS         CoreOS                  Stable              CoreOS:CoreOS:Stable:latest                                     CoreOS               latest
```

A full list can be seen by adding the `--all` argument. The image list can also be filtered by `--publisher` or `–-offer`. In this example, the list is filtered for all images with an offer that matches *CentOS*. 

```azurecli-interactive 
az vm image list --offer CentOS --all --output table
```

Partial output:

```output
Offer             Publisher         Sku   Urn                                     Version
----------------  ----------------  ----  --------------------------------------  -----------
CentOS            OpenLogic         6.5   OpenLogic:CentOS:6.5:6.5.201501         6.5.201501
CentOS            OpenLogic         6.5   OpenLogic:CentOS:6.5:6.5.201503         6.5.201503
CentOS            OpenLogic         6.5   OpenLogic:CentOS:6.5:6.5.201506         6.5.201506
CentOS            OpenLogic         6.5   OpenLogic:CentOS:6.5:6.5.20150904       6.5.20150904
CentOS            OpenLogic         6.5   OpenLogic:CentOS:6.5:6.5.20160309       6.5.20160309
CentOS            OpenLogic         6.5   OpenLogic:CentOS:6.5:6.5.20170207       6.5.20170207
```

To deploy a VM using a specific image, take note of the value in the *Urn* column, which consists of the publisher, offer, SKU, and optionally a version number to [identify](cli-ps-findimage.md#terminology) the image. When specifying the image, the image version number can be replaced with “latest”, which selects the latest version of the distribution. In this example, the `--image` argument is used to specify the latest version of a CentOS 6.5 image.  

```azurecli-interactive
az vm create --resource-group myResourceGroupVM --name myVM2 --image OpenLogic:CentOS:6.5:latest --generate-ssh-keys
```

## Understand VM sizes

A virtual machine size determines the amount of compute resources such as CPU, GPU, and memory that are made available to the virtual machine. Virtual machines need to be sized appropriately for the expected work load. If workload increases, an existing virtual machine can be resized.

### VM Sizes

The following table categorizes sizes into use cases.  

| Type                     | Common sizes           |    Description       |
|--------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------------------|
| [General purpose](sizes-general.md)         |B, Dsv3, Dv3, DSv2, Dv2, Av2, DC| Balanced CPU-to-memory. Ideal for dev / test and small to medium applications and data solutions.  |
| [Compute optimized](sizes-compute.md)   | Fsv2          | High CPU-to-memory. Good for medium traffic applications, network appliances, and batch processes.        |
| [Memory optimized](sizes-memory.md)    | Esv3, Ev3, M, DSv2, Dv2  | High memory-to-core. Great for relational databases, medium to large caches, and in-memory analytics.                 |
| [Storage optimized](sizes-storage.md)      | Lsv2, Ls              | High disk throughput and IO. Ideal for Big Data, SQL, and NoSQL databases.                                                         |
| [GPU](sizes-gpu.md)          | NV, NVv2, NC, NCv2, NCv3, ND            | Specialized VMs targeted for heavy graphic rendering and video editing.       |
| [High performance](sizes-hpc.md) | H        | Our most powerful CPU VMs with optional high-throughput network interfaces (RDMA). |


### Find available VM sizes

To see a list of VM sizes available in a particular region, use the [az vm list-sizes](/cli/azure/vm) command. 

```azurecli-interactive 
az vm list-sizes --location eastus --output table
```

Partial output:

```output
  MaxDataDiskCount    MemoryInMb  Name                      NumberOfCores    OsDiskSizeInMb    ResourceDiskSizeInMb
------------------  ------------  ----------------------  ---------------  ----------------  ----------------------
                 2          3584  Standard_DS1                          1           1047552                    7168
                 4          7168  Standard_DS2                          2           1047552                   14336
                 8         14336  Standard_DS3                          4           1047552                   28672
                16         28672  Standard_DS4                          8           1047552                   57344
                 4         14336  Standard_DS11                         2           1047552                   28672
                 8         28672  Standard_DS12                         4           1047552                   57344
                16         57344  Standard_DS13                         8           1047552                  114688
                32        114688  Standard_DS14                        16           1047552                  229376
                 1           768  Standard_A0                           1           1047552                   20480
                 2          1792  Standard_A1                           1           1047552                   71680
                 4          3584  Standard_A2                           2           1047552                  138240
                 8          7168  Standard_A3                           4           1047552                  291840
                 4         14336  Standard_A5                           2           1047552                  138240
                16         14336  Standard_A4                           8           1047552                  619520
                 8         28672  Standard_A6                           4           1047552                  291840
                16         57344  Standard_A7                           8           1047552                  619520
```

### Create VM with specific size

In the previous VM creation example, a size was not provided, which results in a default size. A VM size can be selected at creation time using [az vm create](/cli/azure/vm) and the `--size` argument. 

```azurecli-interactive
az vm create \
    --resource-group myResourceGroupVM \
    --name myVM3 \
    --image UbuntuLTS \
    --size Standard_F4s \
    --generate-ssh-keys
```

### Resize a VM

After a VM has been deployed, it can be resized to increase or decrease resource allocation. You can view the current of size of a VM with [az vm show](/cli/azure/vm):

```azurecli-interactive
az vm show --resource-group myResourceGroupVM --name myVM --query hardwareProfile.vmSize
```

Before resizing a VM, check if the desired size is available on the current Azure cluster. The [az vm list-vm-resize-options](/cli/azure/vm) command returns the list of sizes. 

```azurecli-interactive 
az vm list-vm-resize-options --resource-group myResourceGroupVM --name myVM --query [].name
```

If the desired size is available, the VM can be resized from a powered-on state, however it is rebooted during the operation. Use the [az vm resize]( /cli/azure/vm) command to perform the resize.

```azurecli-interactive 
az vm resize --resource-group myResourceGroupVM --name myVM --size Standard_DS4_v2
```

If the desired size is not on the current cluster, the VM needs to be deallocated before the resize operation can occur. Use the [az vm deallocate]( /cli/azure/vm) command to stop and deallocate the VM. Note, when the VM is powered back on, any data on the temp disk may be removed. The public IP address also changes unless a static IP address is being used. 

```azurecli-interactive
az vm deallocate --resource-group myResourceGroupVM --name myVM
```

Once deallocated, the resize can occur. 

```azurecli-interactive
az vm resize --resource-group myResourceGroupVM --name myVM --size Standard_GS1
```

After the resize, the VM can be started.

```azurecli-interactive
az vm start --resource-group myResourceGroupVM --name myVM
```

## VM power states

An Azure VM can have one of many power states. This state represents the current state of the VM from the standpoint of the hypervisor. 

### Power states

| Power State | Description
|----|----|
| Starting | Indicates the virtual machine is being started. |
| Running | Indicates that the virtual machine is running. |
| Stopping | Indicates that the virtual machine is being stopped. | 
| Stopped | Indicates that the virtual machine is stopped. Virtual machines in the stopped state still incur compute charges.  |
| Deallocating | Indicates that the virtual machine is being deallocated. |
| Deallocated | Indicates that the virtual machine is removed from the hypervisor but still available in the control plane. Virtual machines in the Deallocated state do not incur compute charges. |
| - | Indicates that the power state of the virtual machine is unknown. |

### Find the power state

To retrieve the state of a particular VM, use the [az vm get-instance-view](/cli/azure/vm) command. Be sure to specify a valid name for a virtual machine and resource group. 

```azurecli-interactive
az vm get-instance-view \
    --name myVM \
    --resource-group myResourceGroupVM \
    --query instanceView.statuses[1] --output table
```

Output:

```output
ode                DisplayStatus    Level
------------------  ---------------  -------
PowerState/running  VM running       Info
```

## Management tasks

During the life-cycle of a virtual machine, you may want to run management tasks such as starting, stopping, or deleting a virtual machine. Additionally, you may want to create scripts to automate repetitive or complex tasks. Using the Azure CLI, many common management tasks can be run from the command line or in scripts. 

### Get IP address

This command returns the private and public IP addresses of a virtual machine.  

```azurecli-interactive
az vm list-ip-addresses --resource-group myResourceGroupVM --name myVM --output table
```

### Stop virtual machine

```azurecli-interactive
az vm stop --resource-group myResourceGroupVM --name myVM
```

### Start virtual machine

```azurecli-interactive
az vm start --resource-group myResourceGroupVM --name myVM
```

### Delete resource group

Deleting a resource group also deletes all resources contained within, such as the VM, virtual network, and disk. The `--no-wait` parameter returns control to the prompt without waiting for the operation to complete. The `--yes` parameter confirms that you wish to delete the resources without an additional prompt to do so.

```azurecli-interactive
az group delete --name myResourceGroupVM --no-wait --yes
```

## Next steps

In this tutorial, you learned about basic VM creation and management such as how to:

> [!div class="checklist"]
> * Create and connect to a VM
> * Select and use VM images
> * View and use specific VM sizes
> * Resize a VM
> * View and understand VM state

Advance to the next tutorial to learn about VM disks.  

> [!div class="nextstepaction"]
> [Create and Manage VM disks](./tutorial-manage-disks.md)
