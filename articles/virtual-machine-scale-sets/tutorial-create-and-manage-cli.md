---
title: Tutorial - Create and manage an Azure virtual machine scale set | Microsoft Docs
description: Learn how to use the Azure CLI to create a virtual machine scale set, along with some common management tasks such as how to start and stop an instance, or change the scale set capacity.
services: virtual-machine-scale-sets
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 03/27/2018
ms.author: cynthn
ms.custom: mvc

---
# Tutorial: Create and manage a virtual machine scale set with the Azure CLI
A virtual machine scale set allows you to deploy and manage a set of identical, auto-scaling virtual machines. Throughout the lifecycle of a virtual machine scale set, you may need to run one or more management tasks. In this tutorial you learn how to:

> [!div class="checklist"]
> * Create and connect to a virtual machine scale set
> * Select and use VM images
> * View and use specific VM instance sizes
> * Manually scale a scale set
> * Perform common scale set management tasks

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.29 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli). 


## Create a resource group
An Azure resource group is a logical container into which Azure resources are deployed and managed. A resource group must be created before a virtual machine scale set. Create a resource group with the [az group create](/cli/azure/group#az_group_create) command. In this example, a resource group named *myResourceGroup* is created in the *eastus* region. 

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

The resource group name is specified when you create or modify a scale set throughout this tutorial.


## Create a scale set
You create a virtual machine scale set with the [az vmss create](/cli/azure/vmss#az_vmss_create) command. The following example creates a scale set named *myScaleSet*, and generates SSH keys if they do not exist:

```azurecli-interactive
az vmss create \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --image UbuntuLTS \
  --admin-username azureuser \
  --generate-ssh-keys
```

It takes a few minutes to create and configure all the scale set resources and VM instances. To distribute traffic to the individual VM instances, a load balancer is also created.


## View the VM instances in a scale set
To view a list of VM instances in a scale set, use [az vmss list-instances](/cli/azure/vmss#az_vmss_list_instances) as follows:

```azurecli-interactive
az vmss list-instances \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --output table
```

The following example output shows two VM instances in the scale set:

```bash
  InstanceId  LatestModelApplied    Location    Name          ProvisioningState    ResourceGroup    VmId
------------  --------------------  ----------  ------------  -------------------  ---------------  ------------------------------------
           1  True                  eastus      myScaleSet_1  Succeeded            MYRESOURCEGROUP  c059be0c-37a2-497a-b111-41272641533c
           3  True                  eastus      myScaleSet_3  Succeeded            MYRESOURCEGROUP  ec19e7a7-a4cd-4b24-9670-438f4876c1f9
```


The first column in the output shows an *InstanceId*. To view additional information about a specific VM instance, add the `--instance-id` parameter to [az vmss get-instance-view](/cli/azure/vmss#az_vmss_get_instance_view). The following example views information about VM instance *1*:

```azurecli-interactive
az vmss get-instance-view \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --instance-id 1
```


## List connection information
A public IP address is assigned to the load balancer that routes traffic to the individual VM instances. By default, Network Address Translation (NAT) rules are added to the Azure load balancer that forwards remote connection traffic to each VM on a given port. To connect to the VM instances in a scale set, you create a remote connection to an assigned public IP address and port number.

To list the address and ports to connect to VM instances in a scale set, use [az vmss list-instance-connection-info](/cli/azure/vmss#az_vmss_list_instance_connection_info):

```azurecli-interactive
az vmss list-instance-connection-info \
  --resource-group myResourceGroup \
  --name myScaleSet
```

The following example output shows the instance name, public IP address of the load balancer, and port number that the NAT rules forward traffic to:

```bash
{
  "instance 1": "13.92.224.66:50001",
  "instance 3": "13.92.224.66:50003"
}
```

SSH to your first VM instance. Specify your public IP address and port number with the `-p` parameter, as shown from the preceding command:

```azurecli-interactive
ssh azureuser@13.92.224.66 -p 50001
```

Once logged in to the VM instance, you could perform some manual configuration changes as needed. For now, close the SSH session as normal:

```bash
exit
```


## Understand VM instance images
When you created a scale set at the start of the tutorial, a `--image` of *UbuntuLTS* was specified for the VM instances. The Azure marketplace includes many images that can be used to create VM instances. To see a list of the most commonly used images, use the [az vm image list](/cli/azure/vm/image#az_vm_image_list) command.

```azurecli-interactive
az vm image list --output table
```

The following example output shows the most common VM images on Azure. The *UrnAlias* can be used to specify one of these common images when you create a scale set.

```bash
Offer          Publisher               Sku                 Urn                                                             UrnAlias             Version
-------------  ----------------------  ------------------  --------------------------------------------------------------  -------------------  ---------
CentOS         OpenLogic               7.3                 OpenLogic:CentOS:7.3:latest                                     CentOS               latest
CoreOS         CoreOS                  Stable              CoreOS:CoreOS:Stable:latest                                     CoreOS               latest
Debian         credativ                8                   credativ:Debian:8:latest                                        Debian               latest
openSUSE-Leap  SUSE                    42.2                SUSE:openSUSE-Leap:42.2:latest                                  openSUSE-Leap        latest
RHEL           RedHat                  7.3                 RedHat:RHEL:7.3:latest                                          RHEL                 latest
SLES           SUSE                    12-SP2              SUSE:SLES:12-SP2:latest                                         SLES                 latest
UbuntuServer   Canonical               16.04-LTS           Canonical:UbuntuServer:16.04-LTS:latest                         UbuntuLTS            latest
WindowsServer  MicrosoftWindowsServer  2016-Datacenter     MicrosoftWindowsServer:WindowsServer:2016-Datacenter:latest     Win2016Datacenter    latest
WindowsServer  MicrosoftWindowsServer  2012-R2-Datacenter  MicrosoftWindowsServer:WindowsServer:2012-R2-Datacenter:latest  Win2012R2Datacenter  latest
WindowsServer  MicrosoftWindowsServer  2012-Datacenter     MicrosoftWindowsServer:WindowsServer:2012-Datacenter:latest     Win2012Datacenter    latest
WindowsServer  MicrosoftWindowsServer  2008-R2-SP1         MicrosoftWindowsServer:WindowsServer:2008-R2-SP1:latest         Win2008R2SP1         latest
```

To view a full list, add the `--all` argument. The image list can also be filtered by `--publisher` or `–-offer`. In the following example, the list is filtered for all images with an offer that matches *CentOS*:

```azurecli-interactive
az vm image list --offer CentOS --all --output table
```

The following condensed output shows some of the CentOS 7.3 images available:

```azurecli-interactive 
Offer    Publisher   Sku   Urn                                 Version
-------  ----------  ----  ----------------------------------  -------------
CentOS   OpenLogic   7.3   OpenLogic:CentOS:7.3:7.3.20161221   7.3.20161221
CentOS   OpenLogic   7.3   OpenLogic:CentOS:7.3:7.3.20170421   7.3.20170421
CentOS   OpenLogic   7.3   OpenLogic:CentOS:7.3:7.3.20170517   7.3.20170517
CentOS   OpenLogic   7.3   OpenLogic:CentOS:7.3:7.3.20170612   7.3.20170612
CentOS   OpenLogic   7.3   OpenLogic:CentOS:7.3:7.3.20170707   7.3.20170707
CentOS   OpenLogic   7.3   OpenLogic:CentOS:7.3:7.3.20170925   7.3.20170925
```

To deploy a scale set that uses a specific image, use the value in the *Urn* column. When you specify the image, the image version number can be replaced with *latest*, which selects the latest version of the distribution. In the following example, the `--image` argument is used to specify the latest version of a CentOS 7.3 image.

As it takes a few minutes to create and configure all the scale set resources and VM instances, you don't have to deploy the following scale set:

```azurecli-interactive
az vmss create \
  --resource-group myResourceGroup \
  --name myScaleSetCentOS \
  --image OpenLogic:CentOS:7.3:latest \
  --admin-user azureuser \
  --generate-ssh-keys
```


## Understand VM instance sizes
A VM instance size, or *SKU*, determines the amount of compute resources such as CPU, GPU, and memory that are made available to the VM instance. VM instances in a scale set need to be sized appropriately for the expected work load.

### VM instance sizes
The following table categorizes common VM sizes into use cases.

| Type                     | Common sizes           |    Description       |
|--------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------------------|
| [General purpose](../virtual-machines/linux/sizes-general.md)         |Dsv3, Dv3, DSv2, Dv2, DS, D, Av2, A0-7| Balanced CPU-to-memory. Ideal for dev / test and small to medium applications and data solutions.  |
| [Compute optimized](../virtual-machines/linux/sizes-compute.md)   | Fs, F             | High CPU-to-memory. Good for medium traffic applications, network appliances, and batch processes.        |
| [Memory optimized](../virtual-machines/linux/sizes-memory.md)    | Esv3, Ev3, M, GS, G, DSv2, DS, Dv2, D   | High memory-to-core. Great for relational databases, medium to large caches, and in-memory analytics.                 |
| [Storage optimized](../virtual-machines/linux/sizes-storage.md)      | Ls                | High disk throughput and IO. Ideal for Big Data, SQL, and NoSQL databases.                                                         |
| [GPU](../virtual-machines/linux/sizes-gpu.md)          | NV, NC            | Specialized VMs targeted for heavy graphic rendering and video editing.       |
| [High performance](../virtual-machines/linux/sizes-hpc.md) | H, A8-11          | Our most powerful CPU VMs with optional high-throughput network interfaces (RDMA). 

### Find available VM instance sizes
To see a list of VM instance sizes available in a particular region, use the [az vm list-sizes](/cli/azure/vm#az_vm_list_sizes) command.

```azurecli-interactive
az vm list-sizes --location eastus --output table
```

The output is similar to the following condensed example, which shows the resources assigned to each VM size:

```azurecli-interactive
  MaxDataDiskCount    MemoryInMb  Name                      NumberOfCores    OsDiskSizeInMb    ResourceDiskSizeInMb
------------------  ------------  ----------------------  ---------------  ----------------  ----------------------
                 4          3584  Standard_DS1_v2                       1           1047552                    7168
                 8          7168  Standard_DS2_v2                       2           1047552                   14336
[...]
                 1           768  Standard_A0                           1           1047552                   20480
                 2          1792  Standard_A1                           1           1047552                   71680
[...]
                 4          2048  Standard_F1                           1           1047552                   16384
                 8          4096  Standard_F2                           2           1047552                   32768
[...]
                24         57344  Standard_NV6                          6           1047552                   38912
                48        114688  Standard_NV12                        12           1047552                  696320
```

### Create a scale set with a specific VM instance size
When you created a scale set at the start of the tutorial, a default VM SKU of *Standard_D1_v2* was provided for the VM instances. You can specify a different VM instance size based on the output from [az vm list-sizes](/cli/azure/vm#az_vm_list_sizes). The following example would create a scale set with the `--vm-sku` parameter to specify a VM instance size of *Standard_F1*. As it takes a few minutes to create and configure all the scale set resources and VM instances, you don't have to deploy the following scale set:

```azurecli-interactive
az vmss create \
  --resource-group myResourceGroup \
  --name myScaleSetF1Sku \
  --image UbuntuLTS \
  --vm-sku Standard_F1 \
  --admin-user azureuser \
  --generate-ssh-keys
```


## Change the capacity of a scale set
When you created a scale set at the start of the tutorial, two VM instances were deployed by default. You can specify the `--instance-count` parameter with [az vmss create](/cli/azure/vmss#az_vmss_create) to change the number of instances created with a scale set. To increase or decrease the number of VM instances in your existing scale set, you can manually change the capacity. The scale set creates or removes the required number of VM instances, then configures the load balancer to distribute traffic.

To manually increase or decrease the number of VM instances in the scale set, use [az vmss scale](/cli/azure/vmss#az_vmss_scale). The following example sets the number of VM instances in your scale set to *3*:

```azurecli-interactive
az vmss scale \
    --resource-group myResourceGroup \
    --name myScaleSet \
    --new-capacity 3
```

If takes a few minutes to update the capacity of your scale set. To see the number of instances you now have in the scale set, use [az vmss show](/cli/azure/vmss#az_vmss_show) and query on *sku.capacity*:

```azurecli-interactive
az vmss show \
    --resource-group myResourceGroup \
    --name myScaleSet \
    --query [sku.capacity] \
    --output table
```


## Common management tasks
You can now create a scale set, list connection information, and connect to VM instances. You learned how you could use a different OS image for your VM instances, select a different VM size, or manually scale the number of instances. As part of day to day management, you may need to stop, start, or restart the VM instances in your scale set.

### Stop and deallocate VM instances in a scale set
To stop one or more VM instances in a scale set, use [az vmss stop](/cli/azure/vmss#az_vmss_stop). The `--instance-ids` parameter allows you to specify one or more VM instances to stop. If you do not specify an instance ID, all VM instances in the scale set are stopped. The following example stops instance *1*:

```azurecli-interactive
az vmss stop --resource-group myResourceGroup --name myScaleSet --instance-ids 1
```

Stopped VM instances remain allocated and continue to incur compute charges. If you instead wish the VM instances to be deallocated and only incur storage charges, use [az vmss deallocate](/cli/azure/vmss#az_vmss_deallocate). The following example stops and deallocates instance *1*:

```azurecli-interactive
az vmss deallocate --resource-group myResourceGroup --name myScaleSet --instance-ids 1
```

### Start VM instances in a scale set
To start one or more VM instances in a scale set, use [az vmss start](/cli/azure/vmss#az_vmss_start). The `--instance-ids` parameter allows you to specify one or more VM instances to start. If you do not specify an instance ID, all VM instances in the scale set are started. The following example starts instance *1*:

```azurecli-interactive
az vmss start --resource-group myResourceGroup --name myScaleSet --instance-ids 1
```

### Restart VM instances in a scale set
To restart one or more VM instances in a scale set, use [az vmss restart](/cli/azure/vmss#az_vm_restart). The `--instance-ids` parameter allows you to specify one or more VM instances to restart. If you do not specify an instance ID, all VM instances in the scale set are restarted. The following example restarts instance *1*:

```azurecli-interactive
az vmss restart --resource-group myResourceGroup --name myScaleSet --instance-ids 1
```


## Clean up resources
When you delete a resource group, all resources contained within, such as the VM instances, virtual network, and disks, are also deleted. The `--no-wait` parameter returns control to the prompt without waiting for the operation to complete. The `--yes` parameter confirms that you wish to delete the resources without an additional prompt to do so.

```azurecli-interactive
az group delete --name myResourceGroup --no-wait --yes
```


## Next steps
In this tutorial, you learned how to perform some basic scale set creation and management tasks with the Azure CLI:

> [!div class="checklist"]
> * Create and connect to a virtual machine scale set
> * Select and use VM images
> * View and use specific VM sizes
> * Manually scale a scale set
> * Perform common scale set management tasks

Advance to the next tutorial to learn about scale set disks.

> [!div class="nextstepaction"]
> [Use data disks with scale sets](tutorial-use-disks-cli.md)
