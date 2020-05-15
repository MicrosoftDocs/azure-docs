---
title: Manage Virtual Machine Scale Sets with the Azure CLI
description: Common Azure CLI commands to manage Virtual Machine Scale Sets, such as how to start and stop an instance, or change the scale set capacity.
author: ju-shim
ms.author: jushiman
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.subservice: management
ms.date: 05/29/2018
ms.reviewer: mimckitt
ms.custom: mimckitt

---
# Manage a virtual machine scale set with the Azure CLI
Throughout the lifecycle of a virtual machine scale set, you may need to run one or more management tasks. Additionally, you may want to create scripts that automate various lifecycle-tasks. This article details some of the common Azure CLI commands that let you perform these tasks.

To complete these management tasks, you need the latest Azure CLI. For information, see [Install the Azure CLI](/cli/azure/install-azure-cli). If you need to create a virtual machine scale set, you can [create a scale set with the Azure CLI](quick-create-cli.md).


## View information about a scale set
To view the overall information about a scale set, use [az vmss show](/cli/azure/vmss). The following example gets information about the scale set named *myScaleSet* in the *myResourceGroup* resource group. Enter your own names as follows:

```azurecli
az vmss show --resource-group myResourceGroup --name myScaleSet
```


## View VMs in a scale set
To view a list of VM instance in a scale set, use [az vmss list-instances](/cli/azure/vmss). The following example lists all VM instances in the scale set named *myScaleSet* in the *myResourceGroup* resource group. Provide your own values for these names:

```azurecli
az vmss list-instances \
    --resource-group myResourceGroup \
    --name myScaleSet \
    --output table
```

To view additional information about a specific VM instance, add the `--instance-id` parameter to [az vmss get-instance-view](/cli/azure/vmss) and specify an instance to view. The following example views information about VM instance *0* in the scale set named *myScaleSet* and the *myResourceGroup* resource group. Enter your own names as follows:

```azurecli
az vmss get-instance-view \
    --resource-group myResourceGroup \
    --name myScaleSet \
    --instance-id 0
```


## List connection information for VMs
To connect to the VMs in a scale set, you SSH or RDP to an assigned public IP address and port number. By default, network address translation (NAT) rules are added to the Azure load balancer that forwards remote connection traffic to each VM. To list the address and ports to connect to VM instances in a scale set, use [az vmss list-instance-connection-info](/cli/azure/vmss). The following example lists connection information for VM instances in the scale set named *myScaleSet* and in the *myResourceGroup* resource group. Provide your own values for these names:

```azurecli
az vmss list-instance-connection-info \
    --resource-group myResourceGroup \
    --name myScaleSet
```


## Change the capacity of a scale set
The preceding commands showed information about your scale set and the VM instances. To increase or decrease the number of instances in the scale set, you can change the capacity. The scale set creates or removes the required number of VMs, then configures the VMs to receive application traffic.

To see the number of instances you currently have in a scale set, use [az vmss show](/cli/azure/vmss) and query on *sku.capacity*:

```azurecli
az vmss show \
    --resource-group myResourceGroup \
    --name myScaleSet \
    --query [sku.capacity] \
    --output table
```

You can then manually increase or decrease the number of virtual machines in the scale set with [az vmss scale](/cli/azure/vmss). The following example sets the number of VMs in your scale set to *5*:

```azurecli
az vmss scale \
    --resource-group myResourceGroup \
    --name myScaleSet \
    --new-capacity 5
```

If takes a few minutes to update the capacity of your scale set. If you decrease the capacity of a scale set, the VMs with the highest instance IDs are removed first.


## Stop and start VMs in a scale set
To stop one or more VMs in a scale set, use [az vmss stop](/cli/azure/vmss#az-vmss-stop). The `--instance-ids` parameter allows you to specify one or more VMs to stop. If you do not specify an instance ID, all VMs in the scale set are stopped. To stop multiple VMs, separate each instance ID with a space.

The following example stops instance *0* in the scale set named *myScaleSet* and the *myResourceGroup* resource group. Provide your own values as follows:

```azurecli
az vmss stop --resource-group myResourceGroup --name myScaleSet --instance-ids 0
```

Stopped VMs remain allocated and continue to incur compute charges. If you instead wish the VMs to be deallocated and only incur storage charges, use [az vmss deallocate](/cli/azure/vmss). To deallocate multiple VMs, separate each instance ID with a space. The following example stops and deallocates instance *0* in the scale set named *myScaleSet* and the *myResourceGroup* resource group. Provide your own values as follows:

```azurecli
az vmss deallocate --resource-group myResourceGroup --name myScaleSet --instance-ids 0
```


### Start VMs in a scale set
To start one or more VMs in a scale set, use [az vmss start](/cli/azure/vmss). The `--instance-ids` parameter allows you to specify one or more VMs to start. If you do not specify an instance ID, all VMs in the scale set are started. To start multiple VMs, separate each instance ID with a space.

The following example starts instance *0* in the scale set named *myScaleSet* and the *myResourceGroup* resource group. Provide your own values as follows:

```azurecli
az vmss start --resource-group myResourceGroup --name myScaleSet --instance-ids 0
```


## Restart VMs in a scale set
To restart one or more VMs in a scale set, use [az vmss restart](/cli/azure/vmss). The `--instance-ids` parameter allows you to specify one or more VMs to restart. If you do not specify an instance ID, all VMs in the scale set are restarted. To restart multiple VMs, separate each instance ID with a space.

The following example restarts instance *0* in the scale set named *myScaleSet* and the *myResourceGroup* resource group. Provide your own values as follows:

```azurecli
az vmss restart --resource-group myResourceGroup --name myScaleSet --instance-ids 0
```


## Remove VMs from a scale set
To remove one or more VMs in a scale set, use [az vmss delete-instances](/cli/azure/vmss). The `--instance-ids` parameter allows you to specify one or more VMs to remove. If you specify * for the instance ID, all VMs in the scale set are removed. To remove multiple VMs, separate each instance ID with a space.

The following example removes instance *0* in the scale set named *myScaleSet* and the *myResourceGroup* resource group. Provide your own values as follows:

```azurecli
az vmss delete-instances --resource-group myResourceGroup --name myScaleSet --instance-ids 0
```


## Next steps
Other common tasks for scale sets include how to [deploy an application](virtual-machine-scale-sets-deploy-app.md), and [upgrade VM instances](virtual-machine-scale-sets-upgrade-scale-set.md). You can also use Azure CLI to [configure auto-scale rules](virtual-machine-scale-sets-autoscale-overview.md).
