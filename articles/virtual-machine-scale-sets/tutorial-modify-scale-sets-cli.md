---
title: Modify an Azure Virtual Machine Scale Set using Azure CLI
description: Learn how to modify and update an Azure Virtual Machine Scale Set Azure CLI
author: ju-shim
ms.author: jushiman
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.date: 11/22/2022
ms.reviewer: mimckitt
ms.custom: mimckitt, devx-track-azurecli, devx-track-linux
---
# Tutorial: Modify a Virtual Machine Scale Set using Azure CLI
Throughout the lifecycle of your applications, you may need to modify or update your Virtual Machine Scale Set. These updates may include how to update the configuration of the scale set, or change the application configuration. This article describes how to modify an existing scale set using the Azure CLI.

## Update the scale set model
A scale set has a "scale set model" that captures the *desired* state of the scale set as a whole. To query the model for a scale set, you can use [az vmss show](/cli/azure/vmss#az-vmss-show):

```azurecli
az vmss show --resource-group myResourceGroup --name myScaleSet
```

The exact presentation of the output depends on the options you provide to the command. The following example shows condensed sample output from the Azure CLI:

```output
{
  "id": "/subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet",
  "location": "eastus",
  "name": "myScaleSet",
  "orchestrationMode": "Flexible",
  "platformFaultDomainCount": 1,
  "resourceGroup": "myResourceGroup",
  "sku": {
    "capacity": 2,
    "name": "Standard_DS1_v2",
    "tier": "Standard"
  },
  "timeCreated": "2022-11-29T22:16:43.250912+00:00",
  "type": "Microsoft.Compute/virtualMachineScaleSets",
    "networkProfile": {
      "networkApiVersion": "2020-11-01",
      "networkInterfaceConfigurations": [
        {
          "deleteOption": "Delete",
          "disableTcpStateTracking": false,
          "dnsSettings": {
            "dnsServers": []
          },
          "enableIpForwarding": false,
          "ipConfigurations": [
            {
              "applicationGatewayBackendAddressPools": [],
              "applicationSecurityGroups": [],
              "loadBalancerBackendAddressPools": [
                {
                  "id": "/subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.Network/loadBalancers/myScaleSetLB/backendAddressPools/myScaleSetLBBEPool",
                  "resourceGroup": "myResourceGroup"
                }
              ],
              "name": "mysca2215IPConfig",
              "privateIpAddressVersion": "IPv4",
              "subnet": {
                "id": "/subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myScaleSetVNET/subnets/myScaleSetSubnet",
                "resourceGroup": "myResourceGroup"
              }
            }
          ],
          "name": "mysca2215Nic",
          "networkSecurityGroup": {
            "id": "/subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/myScaleSetNSG",
            "resourceGroup": "myResourceGroup"
          },
          "primary": true
        }
      ]
    },
    "osProfile": {
      "allowExtensionOperations": true,
      "computerNamePrefix": "myScaleS",
      "linuxConfiguration": {
        "disablePasswordAuthentication": true,
        "enableVmAgentPlatformUpdates": false,
        "patchSettings": {
          "assessmentMode": "ImageDefault",
          "patchMode": "ImageDefault"
        },
        "provisionVmAgent": true,
      },
    },
    "storageProfile": {
      "imageReference": {
        "offer": "0001-com-ubuntu-server-jammy",
        "publisher": "Canonical",
        "sku": "22_04-lts",
        "version": "latest"
      },
      "osDisk": {
        "caching": "ReadWrite",
        "createOption": "FromImage",
        "deleteOption": "Delete",
        "diskSizeGb": 30,
        "managedDisk": {
          "storageAccountType": "Premium_LRS"
        },
        "osType": "Linux",
      }
    },
  },
}
```

You can use [az vmss update](/cli/azure/vmss#az-vmss-update) to update various properties of your scale set. For example, updating your license type or a VMs instance protection policy.

```azurecli-interactive
az vmss update --name MyScaleSet --resource-group MyResourceGroup --license-type windows_server
```

```azurecli-interactive
az vmss update --name MyScaleSet --resource-group MyResourceGroup --instance-id 4 --protect-from-scale-set-actions False --protect-from-scale-in
```

Additionally, if you previously deployed the scale set with the `az vmss create` command, you can run the `az vmss create` command again to update the scale set. Make sure that all properties in the `az vmss create` command are the same as before, except for the properties that you wish to modify. For example, below we're updating the upgrade policy and increasing the instance count to five.

```azurecli-interactive
az vmss create \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --orchestration-mode flexible \
  --image RHELRaw8LVMGen2 \
  --admin-username azureuser \
  --generate-ssh-keys \
  --upgrade-policy Rolling \
  --instance-count 5
```

## Updating individual VM instances in a scale set
Similar to how a scale set has a model view, each VM instance in the scale set has its own model view. To query the model view for a particular VM instance in a scale set, you can use [az vm show](/cli/azure/vm#az-vm-show).

```azurecli
az vm show --resource-group myResourceGroup --name myScaleSet_Instanace1
```

The exact presentation of the output depends on the options you provide to the command. The following example shows condensed sample output from the Azure CLI:

```output
{
  "hardwareProfile": {
    "vmSize": "Standard_DS1_v2",
  },
  "id": "/subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myScaleSet_Instance1",
  "location": "eastus",
  "name": "myScaleSet_Instance1",
  "networkProfile": {
    "networkInterfaces": [
      {
        "deleteOption": "Delete",
        "id": "/subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/mysca2215Nic-5cf164f7",
        "primary": true,
        "resourceGroup": "myResourceGroup"
      }
    ]
  },
  "osProfile": {
    "allowExtensionOperations": true,
    "computerName": "myScaleset_Computer1",
    "linuxConfiguration": {
      "disablePasswordAuthentication": true,
      "enableVmAgentPlatformUpdates": false,
      "patchSettings": {
        "assessmentMode": "ImageDefault",
        "patchMode": "ImageDefault"
      },
      "provisionVmAgent": true,
    },
  },
  "provisioningState": "Succeeded",
  "resourceGroup": "myResourceGroup",
  "storageProfile": {
    "dataDisks": [],
    "imageReference": {
      "exactVersion": "22.04.202204200",
      "offer": "0001-com-ubuntu-server-jammy",
      "publisher": "Canonical",
      "sku": "22_04-lts",
      "version": "latest"
    },
    "osDisk": {
      "caching": "ReadWrite",
      "createOption": "FromImage",
      "deleteOption": "Delete",
      "diskSizeGb": 30,
      "managedDisk": {
        "id": "/subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.Compute/disks/myScaleSet_Instance1_disk1_e1a6c46a6b5f44d695fc9e38727267c2",
        "resourceGroup": "myResourceGroup",
        "storageAccountType": "Premium_LRS"
      },
      "name": "myScaleSet_Instance1_disk1_e1a6c46a6b5f44d695fc9e38727267c2",
      "osType": "Linux",
    }
  },
  "timeCreated": "2022-11-29T22:16:44.500895+00:00",
  "type": "Microsoft.Compute/virtualMachines",
  "virtualMachineScaleSet": {
    "id": "/subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet",
    "resourceGroup": "myResourceGroup"
  },
}
```

These properties describe the configuration of a VM instance within a scale set, not the configuration of the scale set as a whole. 

You can perform updates to individual VM instances in a scale set just like you would a standalone VM. For example, attaching a new data disk to instance 1:

```azurecli-interactive
az vm disk attach --resource-group myResourceGroup --vm-name myScaleSet_Instance1 --name disk_name1 --new
```

Running [az vm show](/cli/azure/vm#az-vm-show) again, we now will see that the VM instance has the new disk attached.

```output
  "storageProfile": {
    "dataDisks": [
      {
        "caching": "None",
        "createOption": "Empty",
        "deleteOption": "Detach",
        "diskSizeGb": 1023,
        "lun": 0,
        "managedDisk": {
          "id": "/subscriptions/49d84582-7207-4a4f-824e-044e83c71887/resourceGroups/myResourceGroup/providers/Microsoft.Compute/disks/disk_name1",
          "resourceGroup": "myResourceGroup",
          "storageAccountType": "Premium_LRS"
        },
        "name": "disk_name1",
        "toBeDetached": false,
      }
    ],
    
```

## Add an Instance to your scale set

There are times where you might want to add a new VM to your scale set but want different configuration options than then listed in the scale set model. VMs can be added to a scale set during creation by using the [az vm create](/cli/azure/vmss#az-vmss-create) command and specifying the scale set name you want the instance added to. 

```azurecli-interactive
az vm create --name myNewInstance --resource-group myResourceGroup --vmss myScaleSet --image RHELRaw8LVMGen2
```

```output
{
  "fqdns": "",
  "id": "/subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myNewInstance",
  "location": "eastus",
  "macAddress": "60-45-BD-D7-13-DD",
  "powerState": "VM running",
  "privateIpAddress": "10.0.0.6",
  "publicIpAddress": "20.172.144.96",
  "resourceGroup": "myResourceGroup",
  "zones": ""
```

If we then check our scale set, we'll see the new instance added.

```azurecli-interactive
az vm list --resource-group myResourceGroup --output table
```

```output
Name                 ResourceGroup    Location    
-------------------  ---------------  ----------
myNewInstance         myResourceGroup  eastus
myScaleSet_Instance1  myResourceGroup  eastus
myScaleSet_Instance1  myResourceGroup  eastus
``` 

## Bring VMs up-to-date with the latest scale set model

> [!NOTE]
> Upgrade modes are not currently supported on Virtual Machine Scale Sets using Flexible orchestration mode. 

Scale sets have an "upgrade policy" that determine how VMs are brought up-to-date with the latest scale set model. The three modes for the upgrade policy are:

- **Automatic** - In this mode, the scale set makes no guarantees about the order of VMs being brought down. The scale set may take down all VMs at the same time. 
- **Rolling** - In this mode, the scale set rolls out the update in batches with an optional pause time between batches.
- **Manual** - In this mode, when you update the scale set model, nothing happens to existing VMs until a manual update is triggered.
 
If your scale set is set to manual upgrades, you can trigger a manual upgrade using [az vmss update](/cli/azure/vmss#az-vmss-update).

```azurecli
az vmss update --resource-group myResourceGroup --name myScaleSet 
```

>[!NOTE]
> Service Fabric clusters can only use *Automatic* mode, but the update is handled differently. For more information, see [Service Fabric application upgrades](../service-fabric/service-fabric-application-upgrade.md).


## Reimage a scale set

Virtual Machine Scale Sets will generate a unique name for each VM in the scale set. The naming convention differs by orchestration mode:

- Flexible orchestration Mode: `{scale-set-name}_{8-char-guid}`
- Uniform orchestration mode: `{scale-set-name}_{instance-id}`
 
In the cases where you need to reimage a specific instance, use [az vmss reimage](/cli/azure/vmss#az-vmss-reimage) and specify the instance names.

```azurecli
az vmss reimage --resource-group myResourceGroup --name myScaleSet --instance-id myScaleSet_Instance1
```

## Update the OS image for your scale set
You may have a scale set that runs an old version of Ubuntu. You want to update to a newer version of Ubuntu, such as version *22.04.202204200*. The image reference version property isn't part of a list, so you can directly modify these properties using [az vmss update](/cli/azure/vmss#az-vmss-update).

```azurecli
az vmss update --resource-group myResourceGroup --name myScaleSet --set virtualMachineProfile.storageProfile.imageReference.version=22.04.202204200
```

Alternatively, you may want to change the image your scale set uses. For example, you may want to update or change a custom image used by your scale set. You can change the image your scale set uses by updating the image reference ID property. The image reference ID property isn't part of a list, so you can directly modify this property using [az vmss update](/cli/azure/vmss#az-vmss-update).

```azurecli
az vmss update \
--resource-group myResourceGroup \
--name myScaleSet \
--set virtualMachineProfile.storageProfile.imageReference.id=/subscriptions/{subscriptionID}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/images/myNewImage
```

If you use Azure platform images, you can update the image by modifying the *imageReference* (more information, see the [REST API documentation](/rest/api/compute/virtualmachinescalesets/createorupdate)).

>[!NOTE]
> With platform images, it is common to specify "latest" for the image reference version. When you create, scale out, and reimage, VMs are created with the latest available version. However, it **does not** mean that the OS image is automatically updated over time as new image versions are released. A separate feature provides automatic OS upgrades. For more information, see the [Automatic OS Upgrades documentation](virtual-machine-scale-sets-automatic-upgrade.md).

If you use custom images, you can update the image by updating the *imageReference* ID (more information, see the [REST API documentation](/rest/api/compute/virtualmachinescalesets/createorupdate)).

## Update the load balancer for your scale set
Let's say you have a scale set with an Azure Load Balancer, and you want to replace the Azure Load Balancer with an Azure Application Gateway. The load balancer and Application Gateway properties for a scale set are part of a list, so you can use the commands to remove or add list elements instead of modifying the properties directly.

```azurecli-interactive
# Remove the load balancer backend pool from the scale set model
az vmss update --resource-group myResourceGroup --name myScaleSet --remove virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].ipConfigurations[0].loadBalancerBackendAddressPools 0
    
# Remove the load balancer backend pool from the scale set model; only necessary if you have NAT pools configured on the scale set
az vmss update --resource-group myResourceGroup --name myScaleSet --remove virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].ipConfigurations[0].loadBalancerInboundNatPools 0
    
# Add the application gateway backend pool to the scale set model
az vmss update --resource-group myResourceGroup --name myScaleSet --add virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].ipConfigurations[0].ApplicationGatewayBackendAddressPools '{"id": "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Network/applicationGateways/{applicationGatewayName}/backendAddressPools/{applicationGatewayBackendPoolName}"}'
```

>[!NOTE]
> These commands assume there is only one IP configuration and load balancer on the scale set. If there are multiple, you may need to use a list index other than *0*.


## Next steps
In this tutorial, you learned how to modify various aspects of your scale set and individual instances.

> [!div class="checklist"]
> * Update the scale set model
> * Update an individual VM instance in a scale set
> * Add an instance to your scale set
> * Bring VMs up-to-date with the latest scale set model
> * Reimage a scale set
> * Update the OS image for your scale set
> * Update the load balancer for your scale set


> [!div class="nextstepaction"]
> [Use data disks with scale sets](tutorial-use-disks-powershell.md)
