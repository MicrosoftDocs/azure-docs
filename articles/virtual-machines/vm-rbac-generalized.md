---
title: Create a VM from a generalized image shared to you using RBAC
description: Create a VM from a generalized image shared to you using role-based access control.
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


## Create a VM from a gallery shared to you using role-based access control (RBAC)



## RBAC - Shared within your organization

If the subscription where the gallery resides is within the same tenant, images shared through RBAC can be used to create VMs using the CLI and PowerShell.
### [CLI](#tab/cli)

Make sure the state of the image is `Generalized`. If you want to use an image with the `Specialized` state, see [Create a VM from a specialized image version](vm-specialized-image-version.md).

To use an image shared to you from another subscription or tenant, you need to make sure that you have authorized your account with both the source and destination. Authorizing your account creates a token that the CLI uses to verify you have permission to access and create the resources.

```azurecli-interactive
sourcetenant=<tenant ID>
destinationtenant=<tenant ID>

az login --tenant sourcetenant
az login --tenant destinationtenant

```



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


## RBAC - Shared from another tenant


### [CLI](#tab/cli)

In this example, we are showing how to create a VM from a generalized image. If you are using a specialized image, see [Create a VM using a specialized image version](vm-specialized-image-version.md).

You need to sign in to the tenant where the image is stored, get an access token, then sign into the tenant where you want to create the VM. This is how Azure authenticates that you have access to the image.

```azurecli-interactive

tenant1='<ID for tenant 1>'
tenant2='<ID for tenant 2>'

az account clear
az login --tenant $tenant1
az account get-access-token 
az login --tenant $tenant2
az account get-access-token

```
 

Create the VM. Replace the information in the example with your own. Before you create the VM, make sure that the image is replicated into the region where you want to create the VM.

```azurecli-interactive
imageid="<ID of the image that you want to use>"
resourcegroup="<name for the resource group>"
location="<location where the image is replicated>"
user='<username for the VM>'
name='<name for the VM>'

az group create --location --resource-group $resourcegroup
az vm create \
  --resource-group $resourcegroup \
  --name $name \
  --image $imageid \
  --admin-username $user \
  --generate-ssh-keys
```


### [PowerShell](#tab/powershell)

In this example, we are showing how to create a VM from a generalized image. If you are using a specialized image, see [Create a VM using a specialized image version](vm-specialized-image-version.md).

You need to sign in to the tenant where the image is stored, get an access token, then sign into the tenant where you want to create the VM. This is how Azure authenticates that you have access to the image.

```azurepowershell-interactive

$tenant1 = "<Tenant 1 ID>"
$tenant2 = "<Tenant 2 ID>"
Connect-AzAccount -Tenant "<Tenant 1 ID>" -UseDeviceAuthentication
Connect-AzAccount -Tenant "<Tenant 2 ID>" -UseDeviceAuthentication
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

### [CLI](#tab/cli2)


**Next steps**

- [Create an Azure Compute Gallery](create-gallery.md)
- [Create an image in an Azure Compute Gallery](image-version.md)
