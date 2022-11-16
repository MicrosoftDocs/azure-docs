---
title: 'Tutorial: Create & manage a virtual machine scale set – Azure CLI'
description: Learn how to use the Azure CLI to create a virtual machine scale set, along with some common management tasks such as how to start and stop an instance, or change the scale set capacity.
author: ju-shim
ms.author: jushiman
ms.topic: tutorial
ms.service: virtual-machine-scale-sets
ms.date: 03/27/2018
ms.reviewer: mimckitt
ms.custom: mimckitt, devx-track-azurecli

---
# Tutorial: Create and manage a virtual machine scale set with the Azure CLI

A virtual machine scale set allows you to deploy and manage a set of virtual machines. Throughout the lifecycle of a virtual machine scale set, you may need to run one or more management tasks. In this tutorial you learn how to:

> [!div class="checklist"]
> * Create a resource group
> * Create a Virtual Machine Scale Set
> * Scale out and in
> * Stop, Start and restart VM instances

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0.29 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed. 


## Create a resource group
An Azure resource group is a logical container into which Azure resources are deployed and managed. A resource group must be created before a virtual machine scale set. Create a resource group with the [az group create](/cli/azure/group) command. In this example, a resource group named *myResourceGroup* is created in the *eastus* region. 

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

The resource group name is specified when you create or modify a scale set throughout this tutorial.


## Create a scale set
You create a virtual machine scale set with the [az vmss create](/cli/azure/vmss) command. The following example creates a scale set named *myScaleSet*, and generates SSH keys if they do not exist:

```azurecli-interactive
az vmss create \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --orchestration-mode flexible \
  --image UbuntuLTS \
  --admin-username azureuser \
  --generate-ssh-keys
```

It takes a few minutes to create and configure all the scale set resources and VM instances. To distribute traffic to the individual VM instances, a load balancer is also created.


## View information about the VM instances in your scale set
To view a list of VM instances in a scale set, use [az vm list](/cli/azure/vm) as follows:

```azurecli-interactive
az vm list --resource-group myResourceGroup \
  --output table
```

The following example output shows two VM instances in the scale set:

```output
Name                 ResourceGroup    Location    Zones
-------------------  ---------------  ----------  -------
myScaleSet_5331da35  myResourceGroup  eastus
myScaleSet_5522d515  myResourceGroup  eastus
```
To see additional information about each individual instance, use [az vm show](/cli/azure/vm) and specify the VM name.

```azurecli-interactive
az vm show --resource-group myResourceGroup --name myScaleSet_5331da35
```

```output
{
  "additionalCapabilities": null,
  "applicationProfile": null,
  "availabilitySet": null,
  "billingProfile": null,
  "capacityReservation": null,
  "diagnosticsProfile": null,
  "evictionPolicy": null,
  "extendedLocation": null,
  "extensionsTimeBudget": null,
  "hardwareProfile": {
    "vmSize": "Standard_DS1_v2",
    "vmSizeProperties": null
  },
  "host": null,
  "hostGroup": null,
  "id": "/subscriptions/XXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myScaleSet_5331da35",
  "identity": null,
  "instanceView": null,
  "licenseType": null,
  "location": "eastus",
  "name": "myScaleSet_5331da35",
  "networkProfile": {
    "networkApiVersion": null,
    "networkInterfaceConfigurations": null,
    "networkInterfaces": [
      {
        "deleteOption": "Delete",
        "id": "/subscriptions/XXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/mysca2215Nic-0396c71c",
        "primary": true,
        "resourceGroup": "myResourceGroup"
      }
    ]
  },
  "osProfile": {
    "adminPassword": null,
    "adminUsername": "azureuser",
    "allowExtensionOperations": true,
    "computerName": "myScaleSN30BP1",
    "customData": null,
    "linuxConfiguration": {
      "disablePasswordAuthentication": true,
      "enableVmAgentPlatformUpdates": false,
      "patchSettings": {
        "assessmentMode": "ImageDefault",
        "automaticByPlatformSettings": null,
        "patchMode": "ImageDefault"
      },
      "provisionVmAgent": true,
      "ssh": {
        "publicKeys": [
          {
            "keyData": "ssh-rsa XXXX-XXXX-XXXX-XXXX",
            "path": "/home/azureuser/.ssh/authorized_keys"
          }
        ]
      }
    },
    "requireGuestProvisionSignal": true,
    "secrets": [],
    "windowsConfiguration": null
  },
  "plan": null,
  "platformFaultDomain": null,
  "priority": null,
  "provisioningState": "Succeeded",
  "proximityPlacementGroup": null,
  "resourceGroup": "myResourceGroup",
  "resources": null,
  "scheduledEventsProfile": null,
  "securityProfile": null,
  "storageProfile": {
    "dataDisks": [],
    "diskControllerType": null,
    "imageReference": {
      "communityGalleryImageId": null,
      "exactVersion": "18.04.202210180",
      "id": null,
      "offer": "UbuntuServer",
      "publisher": "Canonical",
      "sharedGalleryImageId": null,
      "sku": "18.04-LTS",
      "version": "latest"
    },
    "osDisk": {
      "caching": "ReadWrite",
      "createOption": "FromImage",
      "deleteOption": "Delete",
      "diffDiskSettings": null,
      "diskSizeGb": 30,
      "encryptionSettings": null,
      "image": null,
      "managedDisk": {
        "diskEncryptionSet": null,
        "id": "/subscriptions/XXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/myResourceGroup/providers/Microsoft.Compute/disks/myScaleSet_5331da35_disk1_b2c5e9e123084e738f9f7f9b927d850e",
        "resourceGroup": "myResourceGroup",
        "securityProfile": null,
        "storageAccountType": "Premium_LRS"
      },
      "name": "myScaleSet_5331da35_disk1_b2c5e9e123084e738f9f7f9b927d850e",
      "osType": "Linux",
      "vhd": null,
      "writeAcceleratorEnabled": null
    }
  },
  "tags": {},
  "timeCreated": "2022-11-16T20:32:15.024581+00:00",
  "type": "Microsoft.Compute/virtualMachines",
  "userData": null,
  "virtualMachineScaleSet": {
    "id": "/subscriptions/XXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet",
    "resourceGroup": "myResourceGroup"
  },
  "vmId": "95121620-5d19-4133-89a0-731b5b448e40",
  "zones": null
}
```


## Create a scale set with a specific VM instance size
When you created a scale set at the start of the tutorial, a default VM SKU of *Standard_D1_v2* was provided for the VM instances. You can specify a different VM instance size based on the output from [az vm list-sizes](/cli/azure/vm). The following example would create a scale set with the `--vm-sku` parameter to specify a VM instance size of *Standard_F1*. As it takes a few minutes to create and configure all the scale set resources and VM instances, you don't have to deploy the following scale set:

```azurecli-interactive
az vmss create \
  --resource-group myResourceGroup \
  --name myScaleSetF1Sku \
  --image UbuntuLTS \
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

It takes a few minutes to update the capacity of your scale set. To see the number of instances you now have in the scale set, use [az vm list](/cli/azure/vmss) and query on *sku.capacity*:

```azurecli-interactive
az vm list --resource-group myResourceGroup \
  --output table
```

```output
Name                 ResourceGroup    Location    Zones
-------------------  ---------------  ----------  -------
myScaleSet_1121fd3c  myResourceGroup  eastus
myScaleSet_5331da35  myResourceGroup  eastus
myScaleSet_5522d515  myResourceGroup  eastus
```

## Stop and deallocate VM instances in a scale set
To stop all the VM instances in a scale set, use [az vmss stop](/cli/azure/vmss). 

```azurecli-interactive
az vmss stop \
  --resource-group myResourceGroup \
  --name myScaleSet 
```

To stop individual VM instances in a scale set, use [az vm stop](/cli/azure/vm) and the name of the individual instance. 

```azurecli-interactive
az vm stop \ 
  --resource-group myResourceGroup \
  --name myScaleSet_1121fd3c
```

Stopped VM instances remain allocated and continue to incur compute charges. If you instead wish the VM instances to be deallocated and only incur storage charges, use [az vmss deallocate](/cli/azure/vmss) to deallocate all the instance in your scale set.

```azurecli-interactive
az vmss deallocate \ 
  --resource-group myResourceGroup 
  --name myScaleSet
```

To deallocate individual VM instances in a scale set, use [az vm deallocate](/cli/azure/vm) and the name of the individual instance. 

```azurecli-interactive
az vm deallocate \
  --resource-group myResourceGroup
  --name myScaleSet_1121fd3c
```

## Start VM instances in a scale set
To start all the VM instances in a scale set, use [az vmss start](/cli/azure/vmss). 

```azurecli-interactive
az vmss start \
  --resource-group myResourceGroup 
  --name myScaleSet 
```

To start individual VM instances in a scale set, use [az vm start](/cli/azure/vm) and the name of the individual instance.

```azurecli-interactive
az vm start \
  --resource-group myResourceGroup
  --name myScaleSet_1121fd3c
```

## Restart VM instances in a scale set
To restart all the VM instances in a scale set, use [az vmss restart](/cli/azure/vmss). 

```azurecli-interactive
az vmss restart \
  --resource-group myResourceGroup 
  --name myScaleSet 
```

To restart individual VM instances in a scale set, use [az vm restart](/cli/azure/vm) and the name of the individual instance.

```azurecli-interactive
az vm restart \
  --resource-group myResourceGroup
  --name myScaleSet_1121fd3c
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
