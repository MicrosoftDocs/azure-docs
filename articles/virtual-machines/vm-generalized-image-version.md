---
title: Create a VM from a generalized image in a gallery
description: Create a VM from a generalized image in a gallery.
author: sandeepraichura
ms.service: virtual-machines
ms.subservice: gallery
ms.topic: how-to
ms.workload: infrastructure
ms.date: 07/18/2022
ms.author: saraic
ms.reviewer: cynthn 
ms.custom: devx-track-azurecli, devx-track-azurepowershell

---
# Create a VM from a generalized image version

Create a VM from a [generalized image version](./shared-image-galleries.md#generalized-and-specialized-images) stored in an Azure Compute Gallery (formerly known as Shared Image Gallery). If you want to create a VM using a specialized image, see [Create a VM from a specialized image](vm-specialized-image-version.md).

This article shows how to create a VM from a generalized image:
- [In your own gallery](#create-a-vm-from-your-gallery) 
- Shared to a [community gallery](#create-a-vm-from-a-community-gallery-image) 
- [Directly shared to your subscription or tenant](#create-a-vm-from-a-gallery-shared-with-your-subscription-or-tenant)


## Create a VM from your gallery
### [Portal](#tab/portal)

Now you can create one or more new VMs. This example creates a VM named *myVM*, in the *myResourceGroup*, in the *East US* datacenter.

1. Go to your image definition. You can use the resource filter to show all image definitions available.
1. On the page for your image definition, select **Create VM** from the menu at the top of the page.
1. For **Resource group**, select **Create new** and type *myResourceGroup* for the name.
1. In **Virtual machine name**, type *myVM*.
1. For **Region**, select *East US*.
1. For **Availability options**, leave the default of *No infrastructure redundancy required*.
1. The value for **Image** is automatically filled with the `latest` image version if you started from the page for the image definition.
1. For **Size**, choose a VM size from the list of available sizes and then choose **Select**.
1. Under **Administrator account**, you need to provide a username, such as *azureuser* and a password or SSH key. The password must be at least 12 characters long and meet the [defined complexity requirements](./windows/faq.yml#what-are-the-password-requirements-when-creating-a-vm-).
1. If you want to allow remote access to the VM, under **Public inbound ports**, choose **Allow selected ports** and then select **SSH (22)** or **RDP (3389)** from the drop-down. If you don't want to allow remote access to the VM, leave **None** selected for **Public inbound ports**.
1. When you are finished, select the **Review + create** button at the bottom of the page.
1. After the VM passes validation, select **Create** at the bottom of the page to start the deployment.

### [CLI](#tab/cli)


List the image definitions in a gallery using [az sig image-definition list](/cli/azure/sig/image-definition#az-sig-image-definition-list) to see the name and ID of the definitions.

```azurecli-interactive 
resourceGroup=myGalleryRG
gallery=myGallery
az sig image-definition list --resource-group $resourceGroup --gallery-name $gallery --query "[].[name, id]" --output tsv
```

Create a VM using [az vm create](/cli/azure/vm#az-vm-create). To use the latest version of the image, set `--image` to the ID of the image definition. 

The example below is for creating a Linux VM secured with SSH. For Windows or to secure a Linux VM with a password, remove `--generate-ssh-keys` to be prompted for a password. If you want to supply a password directly, replace `--generate-ssh-keys` with `--admin-password`. Replace resource names as needed in this example.

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
   -Access Deny
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
          "access": "Deny",
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
                    "storageAccountType": "StandardSSD_LRS"
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
                    "storageAccountType": "StandardSSD_LRS"
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


## Create a VM from a community gallery image

> [!IMPORTANT]
> Azure Compute Gallery – community galleries is currently in PREVIEW and subject to the [Preview Terms for Azure Compute Gallery - community gallery](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
>
> Microsoft does not provide support for images in the [community gallery](azure-compute-gallery.md#community).


### [CLI](#tab/cli2)

To create a VM using an image shared to a community gallery, use the unique ID of the image for the `--image` which will be in the following format:

```
/CommunityGalleries/<community gallery name, like: ContosoImages-1a2b3c4d-1234-abcd-1234-1a2b3c4d5e6f>/Images/<image name>/Versions/latest
```

As an end user, to get the public name of a community gallery, you need to use the portal. Go to **Virtual machines** > **Create** > **Azure virtual machine** > **Image** > **See all images** > **Community Images** > **Public gallery name**.

In this example, we are creating a VM from a Linux image and creating SSH keys for authentication.

```azurecli-interactive
imgDef="/CommunityGalleries/ContosoImages-1a2b3c4d-1234-abcd-1234-1a2b3c4d5e6f>/Images/myLinuxImage/Versions/latest"
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

When using a community image, you'll be prompted to accept the legal terms. The message will look like this: 

```output
To create the VM from community gallery image, you must accept the license agreement and privacy statement: http://contoso.com. (If you want to accept the legal terms by default, please use the option '--accept-term' when creating VM/VMSS) (Y/n): 
```

### [Portal](#tab/portal2)

1. Type **virtual machines** in the search.
1. Under **Services**, select **Virtual machines**.
1. In the **Virtual machines** page, select **Create** and then **Virtual machine**.  The **Create a virtual machine** page opens.
1. In the **Basics** tab, under **Project details**, make sure the correct subscription is selected and then choose to **Create new** resource group or select one from the drop-down. 
1. Under **Instance details**, type a name for the **Virtual machine name**.
1. For **Security type**, make sure *Standard* is selected.
1. For your **Image**, select **See all images**. The **Select an image** page will open.
   :::image type="content" source="media/shared-image-galleries/see-all-images.png" alt-text="Screenshot showing the link to select to see more image options.":::
1. In the left menu, under **Other Items**, select **Community images (PREVIEW)**. The **Other Items | Community Images (PREVIEW)** page will open.
   :::image type="content" source="media/shared-image-galleries/community.png" alt-text="Screenshot showing where to select community gallery images.":::
1. Select an image from the list. Make sure that the **OS state** is *Generalized*. If you want to use a specialized image, see [Create a VM using a specialized image version](vm-specialized-image-version.md). Depending on the image choose, the **Region** the VM will be created in will change to match the image.
1. Complete the rest of the options and then select the **Review + create** button at the bottom of the page.
1. On the **Create a virtual machine** page, you can see the details about the VM you are about to create. When you are ready, select **Create**.


### [REST](#tab/rest2)

Get the ID of the image version. The value will be used in the VM deployment request.

```rest
GET 
https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Compute/Locations/{location}/CommunityGalleries/{CommunityGalleryPublicName}/Images/{galleryImageName}/Versions/{1.0.0}?api-version=2021-07-01 

```

Response:

```json 
"location": "West US",
  "identifier": {
    "uniqueId": "/CommunityGalleries/{PublicGalleryName}/Images/{imageName}/Versions/{verionsName}"
  },
  "name": "1.0.0"
```
 


Now you can deploy the VM. The example requires API version 2021-07-01 or later.

```rest
PUT 
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{rg}/providers/Microsoft.Compute/virtualMachines/{VMName}?api-version=2021-03-01   
{ 
 	"location": "{location}", 
 	"properties": { 
 	 	"hardwareProfile": { 
 	 	 	"vmSize": "Standard_D1_v2" 
 	 	}, 
 	 	"storageProfile": { 
 	 	 	"imageReference": { 
 	 	 	 	"communityGalleryImageId":"/communityGalleries/{publicGalleryName}/images/{galleryImageName}/versions/1.0.0" 
 	 	 	}, 
 	 	 	"osDisk": { 
 	 	 	 	"caching": "ReadWrite", 
 	 	 	 	"managedDisk": { 
 	 	 	 	 	"storageAccountType": "Standard_LRS" 
 	 	 	 	}, 
 	 	 	 	"name": "myVMosdisk", 
 	 	 	 	"createOption": "FromImage" 
 	 	 	} 
   	}, 
 	 	"osProfile": { 
 	 	 	"adminUsername": "azureuser", 
 	 	 	"computerName": "myVM", 
 	 	 	"adminPassword": "{password}}" 
 	 	}, 
 	 	"networkProfile": { 
 	 	 	"networkInterfaces": [ 
 	 	 	 	{ 
 	 	 	 	 	"id": "/subscriptions/00000000-0000-0000-0000-
000000000000/resourceGroups/{rg}/providers/Microsoft.Network/networkInterfaces/{networkIntefaceName}", 
 	 	 	 	 	"properties": { 
 	 	 	 	 	 	"primary": true 
 	 	 	 	 	} 
 	 	 	 	} 
 	 	 	] 
 	 	} 
 	} 
} 

```

---

## Create a VM from a gallery shared with your subscription or tenant

> [!IMPORTANT]
> Azure Compute Gallery – direct shared gallery is currently in PREVIEW and subject to the [Preview Terms for Azure Compute Gallery](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
> 
> To publish images to a direct shared gallery during the preview, you need to register at [https://aka.ms/directsharedgallery-preview](https://aka.ms/directsharedgallery-preview). Creating VMs from a direct shared gallery is open to all Azure users.
>
> During the preview, you need to create a new gallery, with the property `sharingProfile.permissions` set to `Groups`. When using the CLI to create a gallery, use the `--permissions groups` parameter. You can't use an existing gallery, the property can't currently be updated.




### [CLI](#tab/cli2)

To create a VM using an image shared to your subscription or tenant, you need the unique ID of the image in the following format:

```
/SharedGalleries/<uniqueID>/Images/<image name>/Versions/latest
```

To find the `uniqueID` of a gallery that is shared with you, use [az sig list-shared](/cli/azure/sig/image-definition#az-sig-image-definition-list-shared). In this example, we are looking for galleries in the West US region.

```azurecli-interactive
region=westus
az sig list-shared --location $region --query "[].name" -o tsv
```

Use the gallery name to find the images that are available. In this example, we list all of the images in *West US* and by name, the unique ID that is needed to create a VM, OS and OS state.

```azurecli-interactive 
galleryName="1a2b3c4d-1234-abcd-1234-1a2b3c4d5e6f-myDirectShared"
 az sig image-definition list-shared \
   --gallery-unique-name $galleryName \
   --location $region \
   --query [*]."{Name:name,ID:uniqueId,OS:osType,State:osState}" -o table
```

Make sure the state of the image is `Generalized`. If you want to use an image with the `Specialized` state, see [Create a VM from a specialized image version](vm-specialized-image-version.md).

Use the `Id` from the output, appended with `/Versions/latest` to use the latest version, as the value for `--image`` to create a VM. In this example, we are creating a VM from a Linux image that is directly shared to us, and creating SSH keys for authentication.

```azurecli-interactive
imgDef="/SharedGalleries/1a2b3c4d-1234-abcd-1234-1a2b3c4d5e6f-MYDIRECTSHARED/Images/myDirectDefinition/Versions/latest"
vmResourceGroup=myResourceGroup
location=westus
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


### [Portal](#tab/portal2)

> [!NOTE]
> **Known issue**: In the Azure portal, if you you select a region, select an image, then change the region, you will get an error message: "You can only create VM in the replication regions of this image" even when the image is replicated to that region. To get rid of the error, select a different region, then switch back to the region you want. If the image is available, it should clear the error message.
>
> You can also use the Azure CLI to check what images are shared with you. For example, you can use `az sig list-shared --location westus" to see what images are shared with you in the West US region.

1. Type **virtual machines** in the search.
1. Under **Services**, select **Virtual machines**.
1. In the **Virtual machines** page, select **Create** and then **Virtual machine**.  The **Create a virtual machine** page opens.
1. In the **Basics** tab, under **Project details**, make sure the correct subscription is selected and then choose to **Create new** resource group or select one from the drop-down. 
1. Under **Instance details**, type a name for the **Virtual machine name**.
1. For **Security type**, make sure *Standard* is selected.
1. For your **Image**, select **See all images**. The **Select an image** page will open.
1. In the left menu, under **Other Items**, select **Direct Shared Images (PREVIEW)**. The **Other Items | Direct Shared Images (PREVIEW)** page will open.
1. Select an image from the list. Make sure that the **OS state** is *Generalized*. If you want to use a specialized image, see [Create a VM using a specialized image version](vm-specialized-image-version.md). Depending on the image you choose, the **Region** the VM will be created in will change to match the image.
1. Complete the rest of the options and then select the **Review + create** button at the bottom of the page.
1. On the **Create a virtual machine** page, you can see the details about the VM you are about to create. When you are ready, select **Create**.


### [REST](#tab/rest2)

Get the ID of the image version. The value will be used in the VM deployment request.

```rest
GET 
https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Compute/Locations/{location}/sharedGalleries/{galleryUniqueName}/Images/{galleryImageName}/Versions/{1.0.0}?api-version=2021-07-01 

```

Response:

```json 
"location": "West US",
  "identifier": {
    "uniqueId": "/sharedGalleries/{PublicGalleryName}/Images/{imageName}/Versions/{verionsName}"
  },
  "name": "1.0.0"
```
 


Now you can deploy the VM. The example requires API version 2021-07-01 or later.

```rest
PUT 
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{rg}/providers/Microsoft.Compute/virtualMachines/{VMName}?api-version=2021-03-01   
{ 
 	"location": "{location}", 
 	"properties": { 
 	 	"hardwareProfile": { 
 	 	 	"vmSize": "Standard_D1_v2" 
 	 	}, 
 	 	"storageProfile": { 
 	 	 	"imageReference": { 
 	 	 	 	"sharedGalleryImageId":"/sharedGalleries/{galleryUniqueName}/images/{galleryImageName}/versions/1.0.0" 
 	 	 	}, 
 	 	 	"osDisk": { 
 	 	 	 	"caching": "ReadWrite", 
 	 	 	 	"managedDisk": { 
 	 	 	 	 	"storageAccountType": "Standard_LRS" 
 	 	 	 	}, 
 	 	 	 	"name": "myVMosdisk", 
 	 	 	 	"createOption": "FromImage" 
 	 	 	} 
   	}, 
 	 	"osProfile": { 
 	 	 	"adminUsername": "azureuser", 
 	 	 	"computerName": "myVM", 
 	 	 	"adminPassword": "{password}}" 
 	 	}, 
 	 	"networkProfile": { 
 	 	 	"networkInterfaces": [ 
 	 	 	 	{ 
 	 	 	 	 	"id": "/subscriptions/00000000-0000-0000-0000-
000000000000/resourceGroups/{rg}/providers/Microsoft.Network/networkInterfaces/{networkIntefaceName}", 
 	 	 	 	 	"properties": { 
 	 	 	 	 	 	"primary": true 
 	 	 	 	 	} 
 	 	 	 	} 
 	 	 	] 
 	 	} 
 	} 
} 

```

---


**Next steps**

- [Create an Azure Compute Gallery](create-gallery.md)
- [Create an image in an Azure Compute Gallery](image-version.md)
