---
title: Create a VM from a generalized image in a gallery
description: Create a VM from a generalized image in a gallery.
author: sandeepraichura
ms.service: virtual-machines
ms.subservice: gallery
ms.topic: how-to
ms.workload: infrastructure
ms.date: 08/15/2023
ms.author: saraic
ms.reviewer: cynthn, mattmcinnes 
ms.custom: devx-track-azurecli, devx-track-azurepowershell

---
# Create a VM from a generalized image version

Create a VM from a [generalized image version](./shared-image-galleries.md#generalized-and-specialized-images) stored in an Azure Compute Gallery (formerly known as Shared Image Gallery). If you want to create a VM using a specialized image, see [Create a VM from a specialized image](vm-specialized-image-version.md).

This article shows how to create a VM from a generalized image:
- [In your own gallery](#your-own-gallery) 
- [Shared within your organization using RBAC](#rbac---shared-within-your-organization)
- [Shared across tenants using RBAC](#rbac---shared-from-another-tenant)
- [Shared to everyone in a community gallery](#community-gallery) 
- [Directly shared to your subscription or tenant](#direct-shared-gallery)


## Your own gallery


### [CLI](#tab/cli)


List the image definitions in a gallery using [az sig image-definition list](/cli/azure/sig/image-definition#az-sig-image-definition-list) to see the name and ID of the definitions.

```azurecli-interactive 
resourceGroup=myGalleryRG
gallery=myGallery
az sig image-definition list --resource-group $resourceGroup --gallery-name $gallery --query "[].[name, id]" --output tsv
```

Create a VM using [az vm create](/cli/azure/vm#az-vm-create). To use the latest version of the image, set `--image` to the ID of the image definition. 

This example is for creating a Linux VM secured with SSH. For Windows or to secure a Linux VM with a password, remove `--generate-ssh-keys` to be prompted for a password. If you want to supply a password directly, replace `--generate-ssh-keys` with `--admin-password`. Replace resource names as needed in this example.

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

In this example, we're using the image definition ID to ensure your new VM will use the most recent version of an image. You can also use a specific version by using the image version ID for `Set-AzVMSourceImage -Id`. For example, to use image version *1.0.0* type: `Set-AzVMSourceImage -Id "/subscriptions/<subscription ID where the gallery is located>/resourceGroups/myGalleryRG/providers/Microsoft.Compute/galleries/myGallery/images/myImageDefinition/versions/1.0.0"`. 

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
1. When you're finished, select the **Review + create** button at the bottom of the page.
1. After the VM passes validation, select **Create** at the bottom of the page to start the deployment.

---

## RBAC - Shared within your organization

If the subscription where the gallery resides is within the same tenant, images shared through RBAC can be used to create VMs using the CLI and PowerShell.

You'll need to the `imageID` of the image you want to use and you need to make sure it's replicated to the region where you want to create the VM.
### [CLI](#tab/cli2)

Make sure the state of the image is `Generalized`. If you want to use an image with the `Specialized` state, see [Create a VM from a specialized image version](vm-specialized-image-version.md).


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

### [PowerShell](#tab/powershell2)


Create the VM. Replace the information in the example with your own. Before you create the VM, make sure that the image is replicated into the region where you want to create the VM.


```azurepowershell-interactive
$resourceGroup = "myResourceGroup"
$location = "South Central US"
$vmName = "myVMfromImage"

# Set a variable for the image version in Tenant 1 using the full image ID of the image version
$image = "/subscriptions/<Tenant 1 subscription>/resourceGroups/<Resource group>/providers/Microsoft.Compute/galleries/<Gallery>/images/<Image definition>/versions/<version>"

# Create user object
$cred = Get-Credential -Message "Enter a username and password for the virtual machine."

# Create a resource group
New-AzResourceGroup -Name $resourceGroup -Location $location

# Networking pieces
$subnetConfig = New-AzVirtualNetworkSubnetConfig -Name mySubnet -AddressPrefix 192.168.1.0/24
$vnet = New-AzVirtualNetwork -ResourceGroupName $resourceGroup -Location $location `
  -Name MYvNET -AddressPrefix 192.168.0.0/16 -Subnet $subnetConfig
$pip = New-AzPublicIpAddress -ResourceGroupName $resourceGroup -Location $location `
  -Name "mypublicdns$(Get-Random)" -AllocationMethod Static -IdleTimeoutInMinutes 4
$nsgRuleRDP = New-AzNetworkSecurityRuleConfig -Name myNetworkSecurityGroupRuleRDP  -Protocol Tcp `
  -Direction Inbound -Priority 1000 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * `
  -DestinationPortRange 3389 -Access Allow
$nsg = New-AzNetworkSecurityGroup -ResourceGroupName $resourceGroup -Location $location `
  -Name myNetworkSecurityGroup -SecurityRules $nsgRuleRDP
$nic = New-AzNetworkInterface -Name myNic -ResourceGroupName $resourceGroup -Location $location `
  -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id -NetworkSecurityGroupId $nsg.Id

# Create a virtual machine configuration using the $image variable to specify the image
$vmConfig = New-AzVMConfig -VMName $vmName -VMSize Standard_D1_v2 | `
Set-AzVMOperatingSystem -Windows -ComputerName $vmName -Credential $cred | `
Set-AzVMSourceImage -Id $image | `
Add-AzVMNetworkInterface -Id $nic.Id

# Create a virtual machine
New-AzVM -ResourceGroupName $resourceGroup -Location $location -VM $vmConfig
```
---
## RBAC - Shared from another tenant

If the image you want to use is stored in a gallery that isn't in the same tenant (directory) then you need to sign in to each tenant to verify you have access.

You also need the `imageID` of the image you want to use and you need to make sure it's replicated to the region where you want to create the VM. You'll also need the `tenantID` for the source gallery and the `tenantID` for where you want to create the VM.
### [CLI](#tab/cli2)

In this example, we're showing how to create a VM from a generalized image. If you're using a specialized image, see [Create a VM using a specialized image version](vm-specialized-image-version.md).

You need to sign in to the tenant where the image is stored, get an access token, then sign into the tenant where you want to create the VM. This is how Azure authenticates that you have access to the image.

```azurecli-interactive

tenant1='<ID for tenant 1>'
tenant2='<ID for tenant 2>'

az account clear
az login --tenant $tenant1
az account get-access-token 
az login --tenant $tenant2
az account get-access-token
az login --tenant $tenant1
az account get-access-token
```
 

Create the VM. Replace the information in the example with your own. Before you create the VM, make sure that the image is replicated into the region where you want to create the VM.

```azurecli-interactive
imageid="<ID of the image that you want to use>"
resourcegroup="<name for the resource group>"
location="<location where the image is replicated>"
user='<username for the VM>'
name='<name for the VM>'

az group create --location $location --resource-group $resourcegroup
az vm create \
  --resource-group $resourcegroup \
  --name $name \
  --image $imageid \
  --admin-username $user \
  --generate-ssh-keys
```


### [PowerShell](#tab/powershell2)

In this example, we're showing how to create a VM from a generalized image. If you're using a specialized image, see [Create a VM using a specialized image version](vm-specialized-image-version.md).

You need to sign in to the tenant where the image is stored, get an access token, then sign into the tenant where you want to create the VM. This is how Azure authenticates that you have access to the image.

```azurepowershell-interactive

$tenant1 = "<Tenant 1 ID>"
$tenant2 = "<Tenant 2 ID>"
Connect-AzAccount -Tenant "<Tenant 1 ID>" -UseDeviceAuthentication
Connect-AzAccount -Tenant "<Tenant 2 ID>" -UseDeviceAuthentication
Connect-AzAccount -Tenant "<Tenant 1 ID>" -UseDeviceAuthentication
```


Create the VM. Replace the information in the example with your own. Before you create the VM, make sure that the image is replicated into the region where you want to create the VM.


```azurepowershell-interactive
$resourceGroup = "myResourceGroup"
$location = "South Central US"
$vmName = "myVMfromImage"

# Set a variable for the image version in Tenant 1 using the full image ID of the image version
$image = "/subscriptions/<Tenant 1 subscription>/resourceGroups/<Resource group>/providers/Microsoft.Compute/galleries/<Gallery>/images/<Image definition>/versions/<version>"

# Create user object
$cred = Get-Credential -Message "Enter a username and password for the virtual machine."

# Create a resource group
New-AzResourceGroup -Name $resourceGroup -Location $location

# Networking pieces
$subnetConfig = New-AzVirtualNetworkSubnetConfig -Name mySubnet -AddressPrefix 192.168.1.0/24
$vnet = New-AzVirtualNetwork -ResourceGroupName $resourceGroup -Location $location `
  -Name MYvNET -AddressPrefix 192.168.0.0/16 -Subnet $subnetConfig
$pip = New-AzPublicIpAddress -ResourceGroupName $resourceGroup -Location $location `
  -Name "mypublicdns$(Get-Random)" -AllocationMethod Static -IdleTimeoutInMinutes 4
$nsgRuleRDP = New-AzNetworkSecurityRuleConfig -Name myNetworkSecurityGroupRuleRDP  -Protocol Tcp `
  -Direction Inbound -Priority 1000 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * `
  -DestinationPortRange 3389 -Access Allow
$nsg = New-AzNetworkSecurityGroup -ResourceGroupName $resourceGroup -Location $location `
  -Name myNetworkSecurityGroup -SecurityRules $nsgRuleRDP
$nic = New-AzNetworkInterface -Name myNic -ResourceGroupName $resourceGroup -Location $location `
  -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id -NetworkSecurityGroupId $nsg.Id

# Create a virtual machine configuration using the $image variable to specify the image
$vmConfig = New-AzVMConfig -VMName $vmName -VMSize Standard_D1_v2 | `
Set-AzVMOperatingSystem -Windows -ComputerName $vmName -Credential $cred | `
Set-AzVMSourceImage -Id $image | `
Add-AzVMNetworkInterface -Id $nic.Id

# Create a virtual machine
New-AzVM -ResourceGroupName $resourceGroup -Location $location -VM $vmConfig
```

---

<a name="community-gallery"></a>

## Community gallery

> [!IMPORTANT]
> Microsoft does not provide support for images in the [community gallery](azure-compute-gallery.md#community).

## Reporting issues with a community image 
Using community-submitted virtual machine images has several risks. Images could contain malware, security vulnerabilities, or violate someone's intellectual property. To help create a secure and reliable experience for the community, you can report images when you see these issues.

The easiest way to report issues with a community gallery is to use the portal, which will pre-fill information for the report:
- For issues with links or other information in the fields of an image definition, select **Report community image**.
- If an image version contains malicious code or there are other issues with a specific version of an image, select **Report** under the **Report version** column in the table of image versions.

You can also use the following links to report issues, but the forms won't be pre-filled:

- Malicious images: Contact [Abuse Report](https://msrc.microsoft.com/report/abuse).
- Intellectual Property violations: Contact [Infringement Report](https://msrc.microsoft.com/report/infringement).

### [CLI](#tab/cli3)

To create a VM using an image shared to a community gallery, use the unique ID of the image for the `--image` which will be in the following format:

```
/CommunityGalleries/<community gallery name, like: ContosoImages-1a2b3c4d-1234-abcd-1234-1a2b3c4d5e6f>/Images/<image name>/Versions/latest
```

Follow these instructions to get the list of Community images using CLI:
```
Step 1:  Show all 'Community images' in a specific location
az sig list-community --location westus2

Step 2: Once you have the public gallery name from Step 1, Get the Image definition (Name) of the image by running the following command
az sig image-definition list-community --public-gallery-name <<public gallery name>> --location westus2

Step 3: Finally, run the following command to list different image versions available for the specific image
az sig image-version list-community --public-gallery-name <<galleryname>> --gallery-image-definition <<image name>> --location westus2
```

To get the public name of a community gallery from portal. Go to **Virtual machines** > **Create** > **Azure virtual machine** > **Image** > **See all images** > **Community Images** > **Public gallery name**.

In this example, we're creating a VM from a Linux image and creating SSH keys for authentication.

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

When using a community image, you'll be prompted to accept the legal terms. The message looks like this: 

```output
To create the VM from community gallery image, you must accept the license agreement and privacy statement: http://contoso.com. (If you want to accept the legal terms by default, please use the option '--accept-term' when creating VM/VMSS) (Y/n): 
```



### [REST](#tab/rest3)

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

### [Portal](#tab/portal3)

1. Type **Community images** in the search.
1. Under **Services**, select **Community images**.
2. Select the image from the list of available images. You can use the filter to narrow the list as needed.
3. On the page for the image, select **Create VM**. The **Create a virtual machine** page opens with the **Image** value pre-selected.
5. In the **Basics** tab, under **Project details**, make sure the correct subscription is selected and then choose to **Create new** resource group or select one from the drop-down. 
6. Under **Instance details**, type a name for the **Virtual machine name**.
1. Complete the rest of the options and then select the **Review + create** button at the bottom of the page.
1. On the **Create a virtual machine** page, you can see the details about the VM you're about to create. When you're ready, select **Create**.

---

## Direct shared gallery

> [!IMPORTANT]
> Azure Compute Gallery – direct shared gallery is currently in PREVIEW and subject to the [Preview Terms for Azure Compute Gallery](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
> 
> To publish images to a direct shared gallery during the preview, you need to register at [https://aka.ms/directsharedgallery-preview](https://aka.ms/directsharedgallery-preview). Creating VMs from a direct shared gallery is open to all Azure users.
>
> During the preview, you need to create a new gallery, with the property `sharingProfile.permissions` set to `Groups`. When using the CLI to create a gallery, use the `--permissions groups` parameter. You can't use an existing gallery, the property can't currently be updated.




### [CLI](#tab/cli4)

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

Use the `Id` from the output, appended with `/Versions/latest` to use the latest version, as the value for `--image` to create a VM. In this example, we're creating a VM from a Linux image that is directly shared to us, and creating SSH keys for authentication.

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


### [REST](#tab/rest4)

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

### [Portal](#tab/portal4)

> [!NOTE]
> **Known issue**: In the Azure portal, if you you select a region, select an image, then change the region, you'll get an error message: "You can only create VM in the replication regions of this image" even when the image is replicated to that region. To get rid of the error, select a different region, then switch back to the region you want. If the image is available, it should clear the error message.
>
> You can also use the Azure CLI to check what images are shared with you. For example, you can use `az sig list-shared --location westus` to see what images are shared with you in the West US region.

1. Type **virtual machines** in the search.
1. Under **Services**, select **Virtual machines**.
1. In the **Virtual machines** page, select **Create** and then **Virtual machine**.  The **Create a virtual machine** page opens.
1. In the **Basics** tab, under **Project details**, make sure the correct subscription is selected and then choose to **Create new** resource group or select one from the drop-down. 
1. Under **Instance details**, type a name for the **Virtual machine name**.
1. For **Security type**, make sure *Standard* is selected.
1. For your **Image**, select **See all images**. The **Select an image** page opens.
1. In the left menu, under **Other Items**, select **Direct Shared Images (PREVIEW)**. The **Other Items | Direct Shared Images (PREVIEW)** page opens.
1. The scope in this section is set to 'Subscription' by default, change the scope to 'Tenant' if you don't see the images and click outside the box to see the list of images shared to the entire Tenant.
1. Select an image from the list. Make sure that the **OS state** is *Generalized*. If you want to use a specialized image, see [Create a VM using a specialized image version](vm-specialized-image-version.md). Depending on the image you choose, the **Region** the VM will be created in will change to match the image.
1. Complete the rest of the options and then select the **Review + create** button at the bottom of the page.
1. On the **Create a virtual machine** page, you can see the details about the VM you're about to create. When you're ready, select **Create**.

---


## Next steps

- [Create an Azure Compute Gallery](create-gallery.md)
- [Create an image in an Azure Compute Gallery](image-version.md)
