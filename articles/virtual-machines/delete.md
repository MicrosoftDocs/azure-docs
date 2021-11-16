---
title: Delete a VM and attached resources
description: Learn how to delete a VM and the resources attached to the VM.
author: cynthn
ms.service: virtual-machines
ms.subservice: 
ms.topic: how-to
ms.workload: infrastructure
ms.date: 11/04/2021
ms.author: cynthn
ms.custom: template-how-to 

---

# Delete a VM and attached resources

By default, when you delete a VM it only deletes the VM resource, not the networking and disk resources. You can change this default behavior when you create a VM, or update an existing VM, to delete specific resources along with the VM.


## Set delete options when creating a VM

### [Portal](#tab/portal2)


1. Open the [portal](https://portal.azure.com).
1. Select **+ Create a resource**.
1. On the **Create a resource** page, under **Virtual machines**, select **Create**.
1. Make your choices on the **Basics**, then select **Next : Disks >**. The **Disks** tab will open.
1. Under **Disk options**, select **Delete with VM** to delete the OS disk when you delete the VM.
1. Under **Data disks**, you can choose which data disks, if any, to delete when you delete the VM.
1. When you are done adding your disk information, select **Next : Networking >**. The **Networking** tab will open.
1. Towards the bottom of the page, select **Delete public IP and NIC when VM is deleted**.
1. When you are done making selections, select **Review + create**. The **Review + create** page will open.
1. You can verify which resources you have chosen to delete when you delete the VM.
1. When you are satisfied with your selections, and validation passes, select **Create** to deploy the VM. 


### [CLI](#tab/cli2)

To specify what happens to the attached resources when you delete a VM, use the `delete-option` parameters. Each can be set to either `Delete`, which permanently deletes the resource when you delete the VM, or `Detach` which only detaches the resource and leaves it in Azure so it can be reused later. Resources that you `Detach`, like disks, will continue to incur charges as applicable.

- `--os-disk-delete-option` - OS disk.
- `--data-disk-delete-option` - data disk.
- `--nic-delete-option` - NIC.

In this example, we create a VM and set the OS disk and NIC to be deleted when we delete the VM.

```azurecli-interactive
az vm create \
    --resource-group myResourceGroup \
    --name myVM \
    --image UbuntuLTS \
    --public-ip-sku Standard \
    --nic-delete-option delete \
    --os-disk-delete-option delete \
    --admin-username azureuser \
    --generate-ssh-keys
```

### [PowerShell](#tab/powershell2)

To specify what happens to the attached resources when you delete a VM, use the `DeleteOption` parameters. Each can be set to either `Delete`, which permanently deletes the resource when you delete the VM, or `Detach` which only detaches the resource and leaves it in Azure so it can be reused later. Resources that you `Detach`, like disks, will continue to incur charges as applicable.

The `DeleteOption` parameters are:
- `-OSDiskDeleteOption` - OS disk.
- `-DataDiskDeleteOption` - data disk.
- `-NetworkInterfaceDeleteOption` - NIC.

In this example, we create a VM and set the OS disk and NIC to be deleted when we delete the VM.

```azurepowershell
New-AzVm `
    -ResourceGroupName "myResourceGroup" `
    -Name "myVM" `
    -OSDiskDeleteOption Delete `
    -NetworkInterfaceDeleteOption Delete `
    -Location "East US" `
    -VirtualNetworkName "myVnet" `
    -SubnetName "mySubnet" `
    -SecurityGroupName "myNetworkSecurityGroup" `
    -PublicIpAddressName "myPublicIpAddress" 
```


### [REST](#tab/rest2)

This example shows how to set the data disk and NIC to be deleted when the VM is deleted.

```rest
PUT 
https://management.azure.com/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Compute/virtualMachines/myVM?api-version=xx  
{ 
"storageProfile": { 
    "dataDisks": [ 
        { "diskSizeGB": 1023, 
          "name": "myVMdatadisk", 
          "createOption": "Empty", 
          "lun": 0, 
          "deleteOption": “Delete” 
       }    ] 
},  
"networkProfile": { 
      "networkInterfaces": [ 
        { "id": "/subscriptions/.../Microsoft.Network/networkInterfaces/myNIC", 
          "properties": { 
            "primary": true, 
  	    "deleteOption": “Delete” 
          }        } 
      ]  
} 
```


You can also set this property for a Public IP associated with a NIC, so that the Public IP is automatically deleted when the NIC gets deleted.

```rest
PUT https://management.azure.com/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/networkInterfaces/test-nic?api-version=xx 
{ 

  "properties": { 

    "enableAcceleratedNetworking": true, 

    "ipConfigurations": [ 

      { 

        "name": "ipconfig1", 

        "properties": { 

          "publicIPAddress": { 

            "id": "/subscriptions/../publicIPAddresses/test-ip", 

          "properties": { 
            “deleteOption”: “Delete” 
            } 
          }, 

          "subnet": { 

            "id": "/subscriptions/../virtualNetworks/rg1-vnet/subnets/default" 

          } 

        } 

      } 

    ] 

  }, 

  "location": "eastus" 

}
```
---


## Update the default delete behavior on an existing VM

To specify what happens to the attached resources when you delete a VM, use the `deleteOption` parameters. Each can be set to either `delete`, which permanently deletes the resource when you delete the VM, or `detach` which only detaches the resource and leaves it in Azure so it can be reused later. Resources that you `detach`, like disks, will continue to incur charges as applicable.

The `DeleteOption` parameters are:
- `StorageProfile.dataDisks` - OS disk.
- `StorageProfile.dataDisks` - data disk.
- `-NetworkInterfaceDeleteOption` - NIC.

In this example, we create a VM and set the data disk and NIC to be deleted when we delete the VM.

```rest
PUT 
https://management.azure.com/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Compute/virtualMachines/myVM?api-version=xx  
{ 
"storageProfile": { 
    "dataDisks": [ 
        { "diskSizeGB": 1023, 
          "name": "myVMdatadisk", 
          "createOption": "Empty", 
          "lun": 0, 
          "deleteOption": “Delete” 
       }    ] 
},  
"networkProfile": { 
      "networkInterfaces": [ 
        { "id": "/subscriptions/.../Microsoft.Network/networkInterfaces/myNIC", 
          "properties": { 
            "primary": true, 
  	    "deleteOption": “Delete” 
          }        } 
      ]  
} 
```

You can also set the public IP address to be deleted when the NIC is deleted.

```rest
PUT https://management.azure.com/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/networkInterfaces/test-nic?api-version=xx 
{ 

  "properties": { 

    "enableAcceleratedNetworking": true, 

    "ipConfigurations": [ 

      { 

        "name": "ipconfig1", 

        "properties": { 

          "publicIPAddress": { 

            "id": "/subscriptions/../publicIPAddresses/test-ip", 

          "properties": { 
            “deleteOption”: “Delete” 
            } 
          }, 

          "subnet": { 

            "id": "/subscriptions/../virtualNetworks/rg1-vnet/subnets/default" 

          } 

        } 

      } 

    ] 

  }, 

  "location": "eastus" 

}
```
---

# FAQ



## Next steps
