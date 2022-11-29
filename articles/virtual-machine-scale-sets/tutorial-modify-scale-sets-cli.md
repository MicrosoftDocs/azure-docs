---
title: Modify an Azure Virtual Machine Scale Set using Azure CLI
description: Learn how to modify and update an Azure Virtual Machine Scale Set Azure CLI
author: ju-shim
ms.author: jushiman
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.date: 11/22/2022
ms.reviewer: mimckitt
ms.custom: mimckitt, devx-track-azurecli, devx-track-azurepowershell

---
# Tutorial: Modify a Virtual Machine Scale Set using Azure CLI

Throughout the lifecycle of your applications, you may need to modify or update your Virtual Machine Scale Set. These updates may include how to update the configuration of the scale set, or change the application configuration. This article describes how to modify an existing scale set using the Azure CLI.

## Update the scale set model
A scale set has a "scale set model" that captures the *desired* state of the scale set as a whole. To query the model for a scale set, you can use [az vmss show](/cli/azure/vmss):

```azurecli
az vmss show --resource-group myResourceGroup --name myScaleSet
```

The exact presentation of the output depends on the options you provide to the command. The following example shows condensed sample output from the Azure CLI:

```azurecli
az vmss show --resource-group myResourceGroup --name myScaleSet
{
  "id": "/subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet",
  "location": "eastus",
  "name": "myScaleSet",
  "orchestrationMode": "Flexible",
  "platformFaultDomainCount": 1,
  "provisioningState": "Succeeded",
  "resourceGroup": "myResourceGroup",
  "singlePlacementGroup": false,
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
        "ssh": {
          "publicKeys": [
            {
              "keyData": "ssh-rsa ",
              "path": "/home/azureuser/.ssh/authorized_keys"
            }
          ]
        }
      },
      "requireGuestProvisionSignal": true,
      "secrets": [],
    },
    "storageProfile": {
      "imageReference": {
        "offer": "UbuntuServer",
        "publisher": "Canonical",
        "sku": "18.04-LTS",
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

These properties apply to the scale set as a whole. If you previously deployed the scale set with the `az vmss create` command, you can run the `az vmss create` command again to update the scale set. Make sure that all properties in the `az vmss create` command are the same as before, except for the properties that you wish to modify. For example, below we are updating the upgrade policy and increasing the instance count to five.

```azurecli-interactive
az vmss create \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --orchestration-mode flexible \
  --image UbuntuLTS \
  --admin-username azureuser \
  --generate-ssh-keys \
  --upgrade-policy Rolling \
  --instance-count 5
```


## Update the VM model
Similar to how a scale set has a model view, each VM instance in the scale set has its own model view. To query the model view for a particular VM instance in a scale set, you can use:

 Azure CLI with [az vm show](/cli/azure/vm):

```azurecli
az vm show --resource-group myResourceGroup --name myScaleSet_Instanace1
```

The exact presentation of the output depends on the options you provide to the command. The following example shows condensed sample output from the Azure CLI:

```azurecli
$ az vm show --resource-group myResourceGroup --name myScaleSet_Instance1
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
    "computerName": "myScaleSYGS9ZZ",
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
      "exactVersion": "18.04.202210180",
      "offer": "UbuntuServer",
      "publisher": "Canonical",
      "sku": "18.04-LTS",
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
  "tags": {},
  "timeCreated": "2022-11-29T22:16:44.500895+00:00",
  "type": "Microsoft.Compute/virtualMachines",
  "virtualMachineScaleSet": {
    "id": "/subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet",
    "resourceGroup": "myResourceGroup"
  },
  "vmId": "39afbef5-c942-495d-822b-19191c254921",
}
```

These properties describe the configuration of a VM instance within a scale set, not the configuration of the scale set as a whole. 

You can perform updates to individual VM instances in a scale set just like you would a standalone VM. For example, attaching a new data disk to instance 1:

```azurecli-interactive
az vm disk attach --resource-group myResourceGroup --vm-name myScaleSet_Instance1 --name disk_name1 --new
```

Running [az vm show](/cli) again, we now will see that the VM instance has the new disk attached.

```azurecli
  "storageProfile": {
    "dataDisks": [
      {
        "caching": "None",
        "createOption": "Empty",
        "deleteOption": "Detach",
        "diskSizeGb": 1023,
        "lun": 0,
        "managedDisk": {
          "id": "/subscriptions/49d84582-7207-4a4f-824e-044e83c71887/resourceGroups/MYRESOURCEGROUP/providers/Microsoft.Compute/disks/disk_name1",
          "resourceGroup": "MYRESOURCEGROUP",
          "storageAccountType": "Premium_LRS"
        },
        "name": "disk_name1",
        "toBeDetached": false,
      }
    ],
    
```

## Bring VMs up-to-date with the latest scale set model
Scale sets have an "upgrade policy" that determine how VMs are brought up-to-date with the latest scale set model. The three modes for the upgrade policy are:

- **Automatic** - In this mode, the scale set makes no guarantees about the order of VMs being brought down. The scale set may take down all VMs at the same time. 
- **Rolling** - In this mode, the scale set rolls out the update in batches with an optional pause time between batches.
- **Manual** - In this mode, when you update the scale set model, nothing happens to existing VMs.
 
You can do this manual upgrade using [az vmss update](/cli/azure/vmss)

    ```azurecli
    az vmss update --resource-group myResourceGroup --name myScaleSet 
    ```

>[!NOTE]
> Service Fabric clusters can only use *Automatic* mode, but the update is handled differently. For more information, see [Service Fabric application upgrades](../service-fabric/service-fabric-application-upgrade.md).


## Reimage a scale set

 
Azure CLI with [az vmss reimage](/cli/azure/vmss):

```azurecli
az vmss reimage --resource-group myResourceGroup --name myScaleSet --instance-id instanceId
```


## Properties with restrictions on modification

### Create-time properties
Some properties can only be set when you create the scale set. These properties include:

- Availability Zones
- Image reference publisher
- Image reference offer
- Managed OS disk storage account type

### Properties that can only be changed based on the current value
Some properties may be changed, with exceptions depending on the current value. These properties include:

- **singlePlacementGroup** - If singlePlacementGroup is true, it may be modified to false. However, if singlePlacementGroup is false, it **may not** be modified to true.
- **subnet** - The subnet of a scale set may be modified as long as the original subnet and the new subnet are in the same virtual network.
- **imageReferenceSku** - Image reference SKU can be updated for endorsed [Linux distros](../virtual-machines/linux/endorsed-distros.md), Windows server/client images, and images without [plan information](../virtual-machines/linux/cli-ps-findimage.md#check-the-purchase-plan-information). 

### Properties that require deallocation to change
Some properties may only be changed to certain values if the VMs in the scale set are deallocated. These properties include:

- **SKU Name**- If the new VM SKU is not supported on the hardware the scale set is currently on, you need to deallocate the VMs in the scale set before you modify the SKU name. For more information, see [how to resize an Azure VM](../virtual-machines/resize-vm.md). 

## VM-specific updates
Certain modifications may be applied to specific VMs instead of the global scale set properties. Currently, the only VM-specific update that is supported is to attach/detach data disks to/from VMs in the scale set. This feature is in preview. For more information, see the [preview documentation](https://github.com/Azure/vm-scale-sets/tree/master/z_deprecated/preview/disk).


## Scenarios

### Application updates
If an application is deployed to a scale set through extensions, an update to the extension configuration causes the application to update in accordance with the upgrade policy. For instance, if you have a new version of a script to run in a Custom Script Extension, you could update the *fileUris* property to point to the new script. In some cases, you may wish to force an update even though the extension configuration is unchanged (for example, you updated the script without a change to the URI of the script). In these cases, you can modify the *forceUpdateTag* to force an update. The Azure platform does not interpret this property. If you change the value, there is no effect on how the extension runs. A change simply forces the extension to rerun. For more information on the *forceUpdateTag*, see the [REST API documentation for extensions](/rest/api/compute/virtualmachineextensions/createorupdate). Note that the *forceUpdateTag* can be used with all extensions, not just the custom script extension.

It's also common for applications to be deployed through a custom image. This scenario is covered in the following section.

### OS Updates
If you use Azure platform images, you can update the image by modifying the *imageReference* (more information, see the [REST API documentation](/rest/api/compute/virtualmachinescalesets/createorupdate)).

>[!NOTE]
> With platform images, it is common to specify "latest" for the image reference version. When you create, scale out, and reimage, VMs are created with the latest available version. However, it **does not** mean that the OS image is automatically updated over time as new image versions are released. A separate feature provides automatic OS upgrades. For more information, see the [Automatic OS Upgrades documentation](virtual-machine-scale-sets-automatic-upgrade.md).

If you use custom images, you can update the image by updating the *imageReference* ID (more information, see the [REST API documentation](/rest/api/compute/virtualmachinescalesets/createorupdate)).

## Examples

### Update the OS image for your scale set
You may have a scale set that runs an old version of Ubuntu LTS 16.04. You want to update to a newer version of Ubuntu LTS 16.04, such as version *16.04.201801090*. The image reference version property is not part of a list, so you can directly modify these properties with one of the following commands:

- Azure PowerShell with [Update-AzVmss](/powershell/module/az.compute/update-azvmss) as follows:

    ```powershell
    Update-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -ImageReferenceVersion 16.04.201801090
    ```

- Azure CLI with [az vmss update](/cli/azure/vmss):

    ```azurecli
    az vmss update --resource-group myResourceGroup --name myScaleSet --set virtualMachineProfile.storageProfile.imageReference.version=16.04.201801090
    ```

Alternatively, you may want to change the image your scale set uses. For example, you may want to update or change a custom image used by your scale set. You can change the image your scale set uses by updating the image reference ID property. The image reference ID property is not part of a list, so you can directly modify this property with one of the following commands:

- Azure PowerShell with [Update-AzVmss](/powershell/module/az.compute/update-azvmss) as follows:

    ```powershell
    Update-AzVmss `
        -ResourceGroupName "myResourceGroup" `
        -VMScaleSetName "myScaleSet" `
        -ImageReferenceId /subscriptions/{subscriptionID}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/images/myNewImage
    ```

- Azure CLI with [az vmss update](/cli/azure/vmss):

    ```azurecli
    az vmss update \
        --resource-group myResourceGroup \
        --name myScaleSet \
        --set virtualMachineProfile.storageProfile.imageReference.id=/subscriptions/{subscriptionID}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/images/myNewImage
    ```


### Update the load balancer for your scale set
Let's say you have a scale set with an Azure Load Balancer, and you want to replace the Azure Load Balancer with an Azure Application Gateway. The load balancer and Application Gateway properties for a scale set are part of a list, so you can use the commands to remove or add list elements instead of modifying the properties directly:

- Azure PowerShell:

    ```powershell
    # Get the current model of the scale set and store it in a local PowerShell object named $vmss
    $vmss=Get-AzVmss -ResourceGroupName "myResourceGroup" -Name "myScaleSet"
    
    # Create a local PowerShell object for the new desired IP configuration, which includes the reference to the application gateway
    $ipconf = New-AzVmssIPConfig -ApplicationGatewayBackendAddressPoolsId /subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Network/applicationGateways/{applicationGatewayName}/backendAddressPools/{applicationGatewayBackendAddressPoolName} -SubnetId $vmss.VirtualMachineProfile.NetworkProfile.NetworkInterfaceConfigurations[0].IpConfigurations[0].Subnet.Id -Name $vmss.VirtualMachineProfile.NetworkProfile.NetworkInterfaceConfigurations[0].IpConfigurations[0].Name
    
    # Replace the existing IP configuration in the local PowerShell object (which contains the references to the current Azure Load Balancer) with the new IP configuration
    $vmss.VirtualMachineProfile.NetworkProfile.NetworkInterfaceConfigurations[0].IpConfigurations[0] = $ipconf
    
    # Update the model of the scale set with the new configuration in the local PowerShell object
    Update-AzVmss -ResourceGroupName "myResourceGroup" -Name "myScaleSet" -virtualMachineScaleSet $vmss
    ```

- Azure CLI:

    ```azurecli
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
You can also perform common management tasks on scale sets with the [Azure CLI](virtual-machine-scale-sets-manage-cli.md) or [Azure PowerShell](virtual-machine-scale-sets-manage-powershell.md).
