---
title: Create a VM from a generalized image in a gallery
description: Create a VM from a generalized image in a gallery.
author: cynthn
ms.service: virtual-machines
ms.subservice: shared-image-gallery
ms.topic: how-to
ms.workload: infrastructure
ms.date: 08/05/2021
ms.author: cynthn 
ms.custom: devx-track-azurecli, devx-track-azurepowershell
#PMcontact: akjosh
---
# Create a VM from a generalized image version

Create a VM from a [generalized image version](./shared-image-galleries.md#generalized-and-specialized-images) stored in a Shared Image Gallery. If you want to create a VM using a specialized image, see [Create a VM from a specialized image](vm-specialized-image-version.md). 

### [CLI](#tab/cli)


List the image definitions in a gallery using [az sig image-definition list](/cli/azure/sig/image-definition#az_sig_image_definition_list) to see the name and ID of the definitions.

```azurecli-interactive 
resourceGroup=myGalleryRG
gallery=myGallery
az sig image-definition list --resource-group $resourceGroup --gallery-name $gallery --query "[].[name, id]" --output tsv
```

Create a VM using [az vm create](/cli/azure/vm#az_vm_create). To use the latest version of the image, set `--image` to the ID of the image definition. 

The example below is for creating a Linux VMsecured with SSH. For Windows or to secure a Linux VM with a password, remove `--generate-ssh-keys` to be prompted for a password. If you want to supply a password directly, replace `--generate-ssh-keys` with `--admin-password`. Replace resource names as needed in this example. 

```azurecli-interactive 
imgDef="/subscriptions/<subscription ID where the gallery is located>/resourceGroups/myGalleryRG/providers/Microsoft.Compute/galleries/myGallery/images/myImageDefinition"
vmResourceGroup=myResourceGroup
location=eastus
vmName=myVM
adminUsername=azureuser


az group create --name $vmResourceGroup --location $location

az vm create\
   --resource-group $vmResourceGroup \
   --name $vmName \
   --image $imgDef \
   --admin-username $adminUsername \
   --generate-ssh-keys
```

You can also use a specific version by using the image version ID for the `--image` parameter. For example, to use image version *1.0.0* type: `--image "/subscriptions/<subscription ID where the gallery is located>/resourceGroups/myGalleryRG/providers/Microsoft.Compute/galleries/myGallery/images/myImageDefinition/versions/1.0.0"`.

### [PowerShell](#tab/powershell)

Once you have a generalized image version, you can create one or more new VMs. Using the [New-AzVM](/powershell/module/az.compute/new-azvm) cmdlet. 

In this example, we are using the image definition ID to ensure your new VM will use the most recent version of an image. You can also use a specific version by using the image version ID for `Set-AzVMSourceImage -Id`. For example, to use image version *1.0.0* type: `Set-AzVMSourceImage -Id "/subscriptions/<subscription ID where the gallery is located>/resourceGroups/myGalleryRG/providers/Microsoft.Compute/galleries/myGallery/images/myImageDefinition/versions/1.0.0"`. 

Be aware that using a specific image version means automation could fail if that specific image version isn't available because it was deleted or removed from the region. We recommend using the image definition ID for creating your new VM, unless a specific image version is required.

Replace resource names as needed in these examples. 

**Simplified parameter set**

You can use the simplified parameter set to quickly create a VM from an image. The simplified parameter set uses the VM name to automatically create some of the required resources, like vNet and public IP address, for you. 

```azurepowershell-interactive
# Create some variables for the new VM 
$resourceGroup = "myResourceGroup"
$location = "South Central US"
$vmName = "myVMfromImage"

# Get the image. Replace the name of your resource group, gallery, and image definition. This will create the VM from the latest image version available.

$imageDefinition = Get-AzGalleryImageDefinition `
   -GalleryName myGallery `
   -ResourceGroupName myResourceGroup `
   -Name myImageDefinition

# Create user object
$cred = Get-Credential `
   -Message "Enter a username and password for the virtual machine."

# Create a resource group
New-AzResourceGroup `
   -Name $resourceGroup `
   -Location $location

New-AzVM `
   -ResourceGroupName $resourceGroup `
   -Location $location `
   -Name $vmName `
   -Image $imageDefinition.Id
   -Credential $cred
```



**Full parameter set**

You can create a VM using specific resources by using the full parameter set.

```azurepowershell-interactive
# Create some variables for the new VM 
$resourceGroup = "myResourceGroup"
$location = "South Central US"
$vmName = "myVMfromImage"

# Get the image. Replace the name of your resource group, gallery, and image definition. This will create the VM from the latest image version available.

$imageDefinition = Get-AzGalleryImageDefinition `
   -GalleryName myGallery `
   -ResourceGroupName myResourceGroup `
   -Name myImageDefinition

# Create user object
$cred = Get-Credential `
   -Message "Enter a username and password for the virtual machine."

# Create a resource group
New-AzResourceGroup `
   -Name $resourceGroup `
   -Location $location

# Network pieces
$subnetConfig = New-AzVirtualNetworkSubnetConfig `
   -Name mySubnet `
   -AddressPrefix 192.168.1.0/24
$vnet = New-AzVirtualNetwork `
   -ResourceGroupName $resourceGroup `
   -Location $location `
   -Name MYvNET `
   -AddressPrefix 192.168.0.0/16 `
   -Subnet $subnetConfig
$pip = New-AzPublicIpAddress `
   -ResourceGroupName $resourceGroup `
   -Location $location `
  -Name "mypublicdns$(Get-Random)" `
  -AllocationMethod Static `
  -IdleTimeoutInMinutes 4
$nsgRuleRDP = New-AzNetworkSecurityRuleConfig `
   -Name myNetworkSecurityGroupRuleRDP  `
   -Protocol Tcp `
  -Direction Inbound `
   -Priority 1000 `
   -SourceAddressPrefix * `
   -SourcePortRange * `
   -DestinationAddressPrefix * `
   -DestinationPortRange 3389 `
   -Access Allow
$nsg = New-AzNetworkSecurityGroup `
   -ResourceGroupName $resourceGroup `
   -Location $location `
  -Name myNetworkSecurityGroup `
  -SecurityRules $nsgRuleRDP
$nic = New-AzNetworkInterface `
   -Name myNic `
   -ResourceGroupName $resourceGroup `
   -Location $location `
  -SubnetId $vnet.Subnets[0].Id `
  -PublicIpAddressId $pip.Id `
  -NetworkSecurityGroupId $nsg.Id

# Create a virtual machine configuration using $imageDefinition.Id to use the latest image version.
$vmConfig = New-AzVMConfig `
   -VMName $vmName `
   -VMSize Standard_D1_v2 | `
   Set-AzVMOperatingSystem -Windows -ComputerName $vmName -Credential $cred | `
   Set-AzVMSourceImage -Id $imageDefinition.Id | `
   Add-AzVMNetworkInterface -Id $nic.Id

# Create a virtual machine
New-AzVM `
   -ResourceGroupName $resourceGroup `
   -Location $location `
   -VM $vmConfig
```

### [REST](#tab/rest)

Create a Virtual Network.

```rest
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/virtualNetworks/{vNetName}?api-version=2020-05-01

{
    "properties": {
        "addressSpace": {
            "addressPrefixes": [
                "10.0.0.0/16"
            ]
        }
    },
    "location": "eastus"
}
```

Create a subnet.

```rest
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/virtualNetworks/{vNetName}/subnets/{subnetName}?api-version=2020-05-01

{
    "properties": {
        "addressPrefix": "10.0.0.0/16"
    },
}
```

Create a public IP address.

```rest
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/publicIPAddresses/{pIPName}?api-version=2020-11-01

{
  "location": "eastus"
}

```

Create a network security group.

```rest
# @name vmNSG
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkSecurityGroups/{nsgName}?api-version=2020-11-01

{
  "properties": {
    "securityRules": [
      {
        "name": "AllowSSH",
        "properties": {
          "protocol": "Tcp",
          "sourceAddressPrefix": "*",
          "destinationAddressPrefix": "*",
          "access": "Allow",
          "destinationPortRange": "3389",
          "sourcePortRange": "*",
          "priority": 1000,
          "direction": "Inbound"
        }
      }
    ]
  },
  "location": "eastus"
}
```

Create a NIC.

```rest
# @name vmNIC
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkInterfaces/{nicName}?api-version=2020-05-01

{
    "properties": {
        "enableAcceleratedNetworking": true,
        "networkSecurityGroup": {
          "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkSecurityGroups/{nsgName}"
        },
        "ipConfigurations": [
            {
                "name": "ipconfig1",
                "properties": {
                    "subnet": {
                        "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/virtualNetworks/{vNetName}/subnets/{subNetName}",
                    },
                    "publicIPAddress": {
                        "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/publicIPAddresses/{pipName}"
          }
                }
            }
        ]
    },
    "location": "eastus",
}
```
Create a Linux VM. The `oSProfile` section contains some OS specific details. See the next code example for the Windows syntax.

```rest
# @name vm
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{vmName}?api-version=2020-06-01

{
    "location": "eastus",
    "properties": {
        "hardwareProfile": {
            "vmSize": "Standard_DS3_v2"
        },
        "storageProfile": {
            "imageReference": {
                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/galleries/{galleryName}/images/{galleryImageName}/versions/{versionNumber}"
            },
            "osDisk": {
                "caching": "ReadWrite",
                "managedDisk": {
                    "storageAccountType": "Standard_LRS"
                },
                "createOption": "FromImage"
            }
        },
        "osProfile": {
            "adminUsername": "{your-username}",
            "computerName": "myVM",
            "linuxConfiguration": {
                "ssh": {
                    "publicKeys": [
                        {
                            "path": "/home/{your-username}/.ssh/authorized_keys",
                            "keyData": "{sshKey}",
                        }
                    ]
                },
                "disablePasswordAuthentication": true
            }
        },
        "networkProfile": {
            "networkInterfaces": [
                {
                    "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkInterfaces/{nicName}",
                }
            ]
        }
    },
}

```

Create a Windows VM.

```rest
# @name vm
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{vmName}?api-version=2020-06-01

{
    "location": "eastus",
    "properties": {
        "hardwareProfile": {
            "vmSize": "Standard_DS3_v2"
        },
        "storageProfile": {
            "imageReference": {
                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/galleries/{galleryName}/images/{galleryImageName}/versions/{versionNumber}"
            },
            "osDisk": {
                "caching": "ReadWrite",
                "managedDisk": {
                    "storageAccountType": "Standard_LRS"
                },
                "createOption": "FromImage"
            }
        },
        "osProfile": {
            "adminUsername": "{your-username}",
            "computerName": "myVM",
            "adminPassword": "{your-password}"
        },
        "networkProfile": {
            "networkInterfaces": [
                {
                    "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkInterfaces/{nicName}",
                }
            ]
        }
    },
```

---

## Next steps

[Azure Image Builder (preview)](./image-builder-overview.md) can help automate image version creation, you can even use it to update and [create a new image version from an existing image version](./linux/image-builder-gallery-update-image-version.md).