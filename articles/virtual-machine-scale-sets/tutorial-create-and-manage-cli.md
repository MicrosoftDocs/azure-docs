---
title: 'Tutorial: Create & manage a Virtual Machine Scale Set – Azure CLI'
description: Learn how to use the Azure CLI to create a Virtual Machine Scale Set, along with some common management tasks such as how to start and stop an instance, or change the scale set capacity.
author: ju-shim
ms.author: jushiman
ms.topic: tutorial
ms.service: virtual-machine-scale-sets
ms.date: 12/16/2022
ms.reviewer: mimckitt
ms.custom: mimckitt, devx-track-azurecli, devx-track-linux
---
# Tutorial: Create and manage a Virtual Machine Scale Set with the Azure CLI
A Virtual Machine Scale Set allows you to deploy and manage a set of virtual machines. Throughout the lifecycle of a Virtual Machine Scale Set, you may need to run one or more management tasks. In this tutorial you learn how to:

> [!div class="checklist"]
> * Create a resource group
> * Create a Virtual Machine Scale Set
> * Scale out and in
> * Stop, Start and restart VM instances

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

This article requires version 2.0.29 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed. 

## Create a resource group
An Azure resource group is a logical container into which Azure resources are deployed and managed. A resource group must be created before a Virtual Machine Scale Set. Create a resource group with the [az group create](/cli/azure/group) command. In this example, a resource group named *myResourceGroup* is created in the *eastus* region. 

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

The resource group name is specified when you create or modify a scale set throughout this tutorial.

## Create a scale set
You create a Virtual Machine Scale Set with the [az vmss create](/cli/azure/vmss) command. The following example creates a scale set named *myScaleSet*, and generates SSH keys if they don't exist:

```azurecli-interactive
az vmss create \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --orchestration-mode flexible \
  --image <SKU image> \
  --admin-username azureuser \
  --generate-ssh-keys
```

It takes a few minutes to create and configure all the scale set resources and VM instances. To distribute traffic to the individual VM instances, a load balancer is also created.

## View information about the VM instances in your scale set
To view a list of VM instances in a scale set, use [az vm list](/cli/azure/vm) as follows:

```azurecli-interactive
az vm list --resource-group myResourceGroup --output table
```

The following example output shows two VM instances in the scale set:

```output
Name                 ResourceGroup    Location    Zones
-------------------  ---------------  ----------  -------
myScaleSet_instance1  myResourceGroup  eastus
myScaleSet_instance2  myResourceGroup  eastus
```
To see additional information about a specific VM instance, use [az vm show](/cli/azure/vm) and specify the VM name.

```azurecli-interactive
az vm show --resource-group myResourceGroup --name myScaleSet_instance1
```

```output
{
  "hardwareProfile": {
    "vmSize": "Standard_DS1_v2",
  },
  "id": "/subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myScaleSet_instance1",
  "location": "eastus",
  "name": "myScaleSet_instance1",
  "networkProfile": {
    "networkInterfaces": [
      {
        "deleteOption": "Delete",
        "id": "/subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/mysca2215Nic-0396c71c",
        "primary": true,
        "resourceGroup": "myResourceGroup"
      }
    ]
  },
  "osProfile": {
    "adminUsername": "azureuser",
    "allowExtensionOperations": true,
    "computerName": "myScaleSN30BP1",
    "linuxConfiguration": {
      "disablePasswordAuthentication": true,
      "enableVmAgentPlatformUpdates": false,
      "patchSettings": {
        "assessmentMode": "ImageDefault",
        "patchMode": "ImageDefault"
      },
      "provisionVmAgent": true,
      "ssh": {
        "publicKeys": [
          {
            "keyData": "ssh-rsa",
            "path": "/home/azureuser/.ssh/authorized_keys"
          }
        ]
      }
    },
    "requireGuestProvisionSignal": true,
    "secrets": [],
  },
  "provisioningState": "Succeeded",
  "resourceGroup": "myResourceGroup",
  "storageProfile": {
    "dataDisks": [],
    "imageReference": {
      "exactVersion": "XXXXX",
      "offer": "myOffer",
      "publisher": "myPublisher",
      "sku": "mySKU",
      "version": "latest"
    },
    "osDisk": {
      "caching": "ReadWrite",
      "createOption": "FromImage",
      "deleteOption": "Delete",
      "diskSizeGb": 30,
      "managedDisk": {
        "id": "/subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.Compute/disks/myScaleSet_instance1_disk1",
        "resourceGroup": "myResourceGroup",
        "storageAccountType": "Premium_LRS"
      },
      "name": "myScaleSet_instance1_disk1",
      "osType": "Linux",
    }
  },
  "tags": {},
  "timeCreated": "2022-11-16T20:32:15.024581+00:00",
  "type": "Microsoft.Compute/virtualMachines",
  "virtualMachineScaleSet": {
    "id": "/subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet",
    "resourceGroup": "myResourceGroup"
  },
}
```


## Create a scale set with a specific VM instance size
When you created a scale set at the start of the tutorial, a default VM SKU of *Standard_D1_v2* was provided for the VM instances. You can specify a different VM instance size based on the output from [az vm list-sizes](/cli/azure/vm). The following example would create a scale set with the `--vm-sku` parameter to specify a VM instance size of *Standard_F1*. As it takes a few minutes to create and configure all the scale set resources and VM instances, you don't have to deploy the following scale set:

```azurecli-interactive
az vmss create \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --image <SKU image> \
  --orchestration-mode flexible \
  --vm-sku Standard_F1 \
  --admin-user azureuser \
  --generate-ssh-keys
```

## Change the capacity of a scale set
When you created a scale set at the start of the tutorial, two VM instances were deployed by default. You can specify the `--instance-count` parameter with [az vmss create](/cli/azure/vmss) to change the number of instances created with a scale set. To increase or decrease the number of VM instances in your existing scale set, you can manually change the capacity. The scale set creates or removes the required number of VM instances, then configures the load balancer to distribute traffic.

To manually increase or decrease the number of VM instances in the scale set, use [az vmss scale](/cli/azure/vmss). The following example sets the number of VM instances in your scale set to *3*:

```azurecli-interactive
az vmss scale \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --new-capacity 3
```

It takes a few minutes to update the capacity of your scale set. To see the number of instances you now have in the scale set, use [az vm list](/cli/azure/vmss) and query on the associated resource group.

```azurecli-interactive
az vm list --resource-group myResourceGroup --output table
```

```output
Name                 ResourceGroup    Location    Zones
-------------------  ---------------  ----------  -------
myScaleSet_instance1  myResourceGroup  eastus
myScaleSet_instance2  myResourceGroup  eastus
myScaleSet_instance3  myResourceGroup  eastus
```

## Stop and deallocate VM instances in a scale set
To stop all the VM instances in a scale set, use [az vmss stop](/cli/azure/vmss). 

```azurecli-interactive
az vmss stop \
  --resource-group myResourceGroup \
  --name myScaleSet 
```

To stop individual VM instances in a scale set, use [az vm stop](/cli/azure/vm) and specify the instance name. 

```azurecli-interactive
az vm stop \ 
  --resource-group myResourceGroup \
  --name myScaleSet_instance1
```

Stopped VM instances remain allocated and continue to incur compute charges. If you instead wish the VM instances to be deallocated and only incur storage charges, use [az vm deallocate](/cli/azure/vm) and specify the instance names you want deallocated. 

```azurecli-interactive
az vm deallocate \
  --resource-group myResourceGroup \
  --name myScaleSet_instance1
```

## Start VM instances in a scale set
To start all the VM instances in a scale set, use [az vmss start](/cli/azure/vmss). 

```azurecli-interactive
az vmss start \
  --resource-group myResourceGroup \
  --name myScaleSet 
```

To start individual VM instances in a scale set, use [az vm start](/cli/azure/vm) and specify the instance name. 

```azurecli-interactive
az vm start \
  --resource-group myResourceGroup \
  --name myScaleSet_instance1
```

## Restart VM instances in a scale set
To restart all the VM instances in a scale set, use [az vmss restart](/cli/azure/vmss). 

```azurecli-interactive
az vmss restart \
  --resource-group myResourceGroup \
  --name myScaleSet 
```

To restart individual VM instances in a scale set, use [az vm restart](/cli/azure/vm) and specify the instance name. 

```azurecli-interactive
az vm restart \
  --resource-group myResourceGroup \
  --name myScaleSet_instance1
```

## Clean up resources
When you delete a resource group, all resources contained within, such as the VM instances, virtual network, and disks, are also deleted. The `--no-wait` parameter returns control to the prompt without waiting for the operation to complete. The `--yes` parameter confirms that you wish to delete the resources without an extra prompt to do so.

```azurecli-interactive
az group delete --name myResourceGroup --no-wait --yes
```


## Next steps
In this tutorial, you learned how to perform some basic scale set creation and management tasks with the Azure CLI:

> [!div class="checklist"]
> * Create a resource group
> * Create a scale set
> * View and use specific VM sizes
> * Manually scale a scale set
> * Perform common scale set management tasks such as stopping, starting and restarting your scale set

Advance to the next tutorial to learn how to connect to your scale set instances.

> [!div class="nextstepaction"]
> [Use data disks with scale sets](tutorial-connect-to-instances-cli.md)
