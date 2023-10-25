---
title: Create a VM from a specialized image version
description: Create a VM using a specialized image version in an Azure Compute Gallery.
author: sandeepraichura
ms.service: virtual-machines
ms.subservice: gallery
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 08/15/2023
ms.author: saraic
ms.reviewer: cynthn, mattmcinnes
ms.custom: devx-track-azurecli, devx-track-azurepowershell
---

# Create a VM using a specialized image version

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs 

Create a VM from a [specialized image version](./shared-image-galleries.md#generalized-and-specialized-images) stored in an Azure Compute Gallery (formerly known as Shared Image Gallery). If you want to create a VM using a generalized image version, see [Create a VM from a generalized image version](vm-generalized-image-version.md).

This article shows how to create a VM from a specialized image:
- [In your own gallery](#create-a-vm-from-your-gallery)
- [Shared within your organization using RBAC](#rbac---within-your-organization)
- [Shared across tenants using RBAC](#rbac---from-another-tenant-or-organization)
- [Shared to everyone in a community gallery](#community-gallery)
- [Directly shared to your subscription or tenant](#direct-shared-gallery)

> [!IMPORTANT]
> 
> When you create a new VM from a specialized image, the new VM retains the computer name of the original VM. Other computer-specific information, like the CMID, is also kept. This duplicate information can cause issues. When copying a VM, be aware of what types of computer-specific information your applications rely on.  


## Create a VM from your gallery

Create a VM from an internal gallery.

### [CLI](#tab/cli)

List the image definitions in a gallery using [az sig image-definition list](/cli/azure/sig/image-definition#az-sig-image-definition-list) to see the name and ID of the definitions.

```azurecli-interactive 
resourceGroup=myGalleryRG
gallery=myGallery
az sig image-definition list \
   --resource-group $resourceGroup \
   --gallery-name $gallery \
   --query "[].[name, id]" \
   --output tsv
```

Create the VM using [az vm create](/cli/azure/vm#az-vm-create) using the `--specialized` parameter to indicate that the image is a specialized image. 

Use the image definition ID for `--image` to create the VM from the latest version of the image that is available. You can also create the VM from a specific version by supplying the image version ID for `--image`.

In this example, we're creating a VM from the latest version of the *myImageDefinition* image.

```azurecli
az group create --name myResourceGroup --location eastus
az vm create --resource-group myResourceGroup \
    --name myVM \
    --image "/subscriptions/<Subscription ID>/resourceGroups/myGalleryRG/providers/Microsoft.Compute/galleries/myGallery/images/myImageDefinition" \
    --specialized
```

### [PowerShell](#tab/powershell)

Once you have a specialized image version, you can create one or more new VMs using the [New-AzVM](/powershell/module/az.compute/new-azvm) cmdlet. 

In this example, we're using the image definition ID to ensure your new VM will use the most recent version of an image. You can also use a specific version by using the image version ID for `Set-AzVMSourceImage -Id`. For example, to use image version *1.0.0* type: `Set-AzVMSourceImage -Id "/subscriptions/<subscription ID where the gallery is located>/resourceGroups/myGalleryRG/providers/Microsoft.Compute/galleries/myGallery/images/myImageDefinition/versions/1.0.0"`. 

Using a specific image version means automation could fail if that specific image version isn't available because it was deleted or removed from the region. We recommend using the image definition ID for creating your new VM, unless a specific image version is required.

Replace resource names as needed in this example. 


```azurepowershell-interactive

# Create some variables for the new VM.

$resourceGroup = "mySIGSpecializedRG"
$location = "South Central US"
$vmName = "mySpecializedVM"

# Get the image. Replace the name of your resource group, gallery, and image definition. This will create the VM from the latest image version available.

$imageDefinition = Get-AzGalleryImageDefinition `
   -GalleryName myGallery `
   -ResourceGroupName myResourceGroup `
   -Name myImageDefinition


# Create a resource group
New-AzResourceGroup -Name $resourceGroup -Location $location

# Create the network resources.

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
   -DestinationPortRange 3389 -Access Deny
$nsg = New-AzNetworkSecurityGroup `
   -ResourceGroupName $resourceGroup `
   -Location $location `
   -Name myNetworkSecurityGroup `
   -SecurityRules $nsgRuleRDP
$nic = New-AzNetworkInterface `
   -Name $vmName `
   -ResourceGroupName $resourceGroup `
   -Location $location `
  -SubnetId $vnet.Subnets[0].Id `
  -PublicIpAddressId $pip.Id `
  -NetworkSecurityGroupId $nsg.Id

# Create a virtual machine configuration using Set-AzVMSourceImage -Id $imageDefinition.Id to use the latest available image version.

$vmConfig = New-AzVMConfig `
   -VMName $vmName `
   -VMSize Standard_D1_v2 | `
   Set-AzVMSourceImage -Id $imageDefinition.Id | `
   Add-AzVMNetworkInterface -Id $nic.Id

# Create a virtual machine
New-AzVM `
   -ResourceGroupName $resourceGroup `
   -Location $location `
   -VM $vmConfig

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
1. Under **Administrator account**, the username is grayed out because the username and credentials from the source VM are used.
1. If you want to allow remote access to the VM, under **Public inbound ports**, choose **Allow selected ports** and then select **SSH (22)** or **RDP (3389)** from the drop-down. If you don't want to allow remote access to the VM, leave **None** selected for **Public inbound ports**.
1. When you're finished, select the **Review + create** button at the bottom of the page.
1. After the VM passes validation, select **Create** at the bottom of the page to start the deployment.

---
## RBAC - within your organization

If the subscription where the gallery resides is within the same tenant, images shared through RBAC can be used to create VMs using the CLI and PowerShell.

You'll need the `imageID` of the image you want to use and make sure the image is replicated to the region where you want to create the VM.

### [CLI](#tab/cli2)


```azurecli-interactive

image="/subscriptions/<Subscription ID>/resourceGroups/myGalleryRG/providers/Microsoft.Compute/galleries/myGallery/images/myImageDefinition"
vmResourceGroup='myResourceGroup'
location='westus'
vmName='myVM'

az group create --name $vmResourceGroup --location $location

az vm create\
   --resource-group $vmResourceGroup \
   --name $vmName \
   --image $image \
   --specialized
```

### [PowerShell](#tab/powershell2)


```azurepowershell-interactive

# Create some variables for the new VM.

$resourceGroup = "myResourceGroup"
$location = "South Central US"
$vmName = "myVM"
$image = "/subscriptions/<Subscription ID>/resourceGroups/myGalleryRG/providers/Microsoft.Compute/galleries/myGallery/images/myImageDefinition"


# Create a resource group
New-AzResourceGroup -Name $resourceGroup -Location $location

# Create the network resources.

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
   -DestinationPortRange 3389 -Access Deny
$nsg = New-AzNetworkSecurityGroup `
   -ResourceGroupName $resourceGroup `
   -Location $location `
   -Name myNetworkSecurityGroup `
   -SecurityRules $nsgRuleRDP
$nic = New-AzNetworkInterface `
   -Name $vmName `
   -ResourceGroupName $resourceGroup `
   -Location $location `
  -SubnetId $vnet.Subnets[0].Id `
  -PublicIpAddressId $pip.Id `
  -NetworkSecurityGroupId $nsg.Id

# Create a virtual machine configuration using Set-AzVMSourceImage -Id $imageDefinition.Id to use the latest available image version.

$vmConfig = New-AzVMConfig `
   -VMName $vmName `
   -VMSize Standard_D1_v2 | `
   Set-AzVMSourceImage $image | `
   Add-AzVMNetworkInterface -Id $nic.Id

# Create a virtual machine
New-AzVM `
   -ResourceGroupName $resourceGroup `
   -Location $location `
   -VM $vmConfig

```

---
## RBAC - from another tenant or organization

If the image you want to use is stored in a gallery that isn't in the same tenant (directory) then you will need to sign in to each tenant to verify you have access.

You'll need the `imageID` of the image you want to use and make sure the image is replicated to the region where you want to create the VM. You'll also need the `tenantID` for the source gallery and the `tenantID` for where you want to create the VM.

### [CLI](#tab/cli3)

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

Create the VM using [az vm create](/cli/azure/vm#az-vm-create) using the `--specialized` parameter to indicate that the image is a specialized image.

```azurecli-interactive

imageid=""/subscriptions/<Subscription ID>/resourceGroups/myGalleryRG/providers/Microsoft.Compute/galleries/myGallery/images/myImageDefinition""
resourcegroup="myResourceGroup"
location="West US 3"
name='myVM'

az group create --name $resourcegroup --location $location
az vm create --resource-group $resourcegroup \
    --name $name \
    --image $image \
    --specialized
```

### [PowerShell](#tab/powershell3)


You need to sign in to the tenant where the image is stored, get an access token, then sign into the tenant where you want to create the VM. This is how Azure authenticates that you have access to the image.

```azurepowershell-interactive

$tenant1 = "<Tenant 1 ID>"
$tenant2 = "<Tenant 2 ID>"
Connect-AzAccount -Tenant "<Tenant 1 ID>" -UseDeviceAuthentication
Connect-AzAccount -Tenant "<Tenant 2 ID>" -UseDeviceAuthentication
```

Create the VM. Replace the information in the example with your own. Before you create the VM, make sure that the image is replicated into the region where you want to create the VM.

```azurepowershell-interactive

# Create some variables for the new VM.

$resourceGroup = "myResourceGroup"
$location = "South Central US"
$vmName = "myVM"

# Set a variable for the image version in Tenant 1 using the full image ID of the image version
$image = "/subscriptions/<Tenant 1 subscription>/resourceGroups/<Resource group>/providers/Microsoft.Compute/galleries/<Gallery>/images/<Image definition>/versions/<version>"


# Create a resource group
New-AzResourceGroup -Name $resourceGroup -Location $location

# Create the network resources.

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
   -DestinationPortRange 3389 -Access Deny
$nsg = New-AzNetworkSecurityGroup `
   -ResourceGroupName $resourceGroup `
   -Location $location `
   -Name myNetworkSecurityGroup `
   -SecurityRules $nsgRuleRDP
$nic = New-AzNetworkInterface `
   -Name $vmName `
   -ResourceGroupName $resourceGroup `
   -Location $location `
  -SubnetId $vnet.Subnets[0].Id `
  -PublicIpAddressId $pip.Id `
  -NetworkSecurityGroupId $nsg.Id

# Create a virtual machine configuration using Set-AzVMSourceImage -Id $imageDefinition.Id to use the latest available image version.

$vmConfig = New-AzVMConfig `
   -VMName $vmName `
   -VMSize Standard_D1_v2 | `
   Set-AzVMSourceImage -Id $image | `
   Add-AzVMNetworkInterface -Id $nic.Id

# Create a virtual machine
New-AzVM `
   -ResourceGroupName $resourceGroup `
   -Location $location `
   -VM $vmConfig

```

---

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


### [CLI](#tab/cli4)

To create a VM using an image shared to a community gallery, use the unique ID of the image for the `--image`, which will be in the following format:

```
/CommunityGalleries/<community gallery name, like: ContosoImages-1a2b3c4d-1234-abcd-1234-1a2b3c4d5e6f>/Images/<image name>/Versions/latest
```

As an end user, to get the public name of a community gallery, you need to use the portal. Go to **Virtual machines** > **Create** > **Azure virtual machine** > **Image** > **See all images** > **Community Images** > **Public gallery name**.


List all of the image definitions that are available in a community gallery using [az sig image-definition list-community](/cli/azure/sig/image-definition#az-sig-image-definition-list-community). In this example, we list all of the images in the *ContosoImage* gallery in *West US* and by name, the unique ID that is needed to create a VM, OS and OS state.

```azurecli-interactive 
 az sig image-definition list-community \
   --public-gallery-name "ContosoImages-1a2b3c4d-1234-abcd-1234-1a2b3c4d5e6f" \
   --location westus \
   --query [*]."{Name:name,ID:uniqueId,OS:osType,State:osState}" -o table
```

To create a VM from a generalized image in a community gallery, see [Create a VM from a generalized image version](vm-generalized-image-version.md).

Create the VM using [az vm create](/cli/azure/vm#az-vm-create) using the `--specialized` parameter to indicate that the image is a specialized image.

In this example, we're creating a VM from the latest version of the *myImageDefinition* image.

```azurecli
az group create --name myResourceGroup --location eastus
az vm create --resource-group myResourceGroup \
    --name myVM \
    --image "/CommunityGalleries/ContosoImages-f61bb1d9-3c5a-4ad2-99b5-744030225de6/Images/LinuxSpecializedVersions/latest" \
    --specialized
```

When using a community image, you'll be prompted to accept the legal terms. The message will look like this: 

```output
To create the VM from community gallery image, you must accept the license agreement and privacy statement: http://contoso.com. (If you want to accept the legal terms by default, please use the option '--accept-term' when creating VM/VMSS) (Y/n): 
```

### [Portal](#tab/portal4)

1. Type **virtual machines** in the search.
1. Under **Services**, select **Virtual machines**.
1. In the **Virtual machines** page, select **Create** and then **Virtual machine**.  The **Create a virtual machine** page opens.
1. In the **Basics** tab, under **Project details**, make sure the correct subscription is selected and then choose to **Create new** resource group or select one from the drop-down. 
1. Under **Instance details**, type a name for the **Virtual machine name**.
1. For **Security type**, make sure *Standard* is selected.
1. For your **Image**, select **See all images**. The **Select an image** page will open.
   :::image type="content" source="media/shared-image-galleries/see-all-images.png" alt-text="Screenshot showing the link to select to see more image options.":::
1. In the left menu, under **Other Items**, select **Community images**. The **Other Items | Community Images** page will open.
   :::image type="content" source="media/shared-image-galleries/community.png" alt-text="Screenshot showing where to select community gallery images.":::
1. Select an image from the list. Make sure that the **OS state** is *Specialized*. If you want to use a specialized image, see [Create a VM using a generalized image version](vm-generalized-image-version.md). Depending on the image choose, the **Region** the VM will be created in will change to match the image.
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



### [CLI](#tab/cli5)

To create a VM using the latest version of an image shared to your subscription or tenant, you need the ID of the image in the following format:

```
/SharedGalleries/<uniqueID>/Images/<image name>/Versions/latest
```

To find the `uniqueID` of a gallery that is shared with you, use [az sig list-shared](/cli/azure/sig/image-definition#az-sig-image-definition-list-shared). In this example, we're looking for galleries in the West US region.

```azurecli-interactive
region=westus
az sig list-shared --location $region --query "[].name" -o tsv
```

Use the gallery name to find all of the images that are available. In this example, we list all of the images in *West US* and by name, the unique ID that is needed to create a VM, OS and OS state.

```azurecli-interactive 
galleryName="1a2b3c4d-1234-abcd-1234-1a2b3c4d5e6f-myDirectShared"
 az sig image-definition list-shared \
   --gallery-unique-name $galleryName \
   --location $region \
   --query [*]."{Name:name,ID:uniqueId,OS:osType,State:osState}" -o table
```

Make sure the state of the image is `Specialized`. If you want to use an image with the `Generalized` state, see [Create a VM from a generalized image version](vm-generalized-image-version.md).

Create the VM using [az vm create](/cli/azure/vm#az-vm-create) using the `--specialized` parameter to indicate that the image is a specialized image.

Use the `Id`, appended with `/Versions/latest` to use the latest version, as the value for `--image`` to create a VM. 

In this example, we're creating a VM from the latest version of the *myImageDefinition* image.

```azurecli
imgDef="/SharedGalleries/1a2b3c4d-1234-abcd-1234-1a2b3c4d5e6f-MYDIRECTSHARED/Images/myDirectDefinition/Versions/latest"
vmResourceGroup=myResourceGroup
location=westus
vmName=myVM

az group create --name $vmResourceGroup --location $location

az vm create\
   --resource-group $vmResourceGroup \
   --name $vmName \
   --image $imgDef \
   --specialized
```

### [Portal](#tab/portal5)

> [!NOTE]
> **Known issue**: In the Azure portal, if you select a region, select an image, then change the region, you will get an error message: "You can only create VM in the replication regions of this image" even when the image is replicated to that region. To get rid of the error, select a different region, then switch back to the region you want. If the image is available, it should clear the error message.
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
1. Select an image from the list. Make sure that the **OS state** is *Specialized*. If you want to use a generalized image, see [Create a VM using a generalized image version](vm-generalized-image-version.md). Depending on the image you choose, the **Region** the VM will be created in will change to match the image.
1. Complete the rest of the options and then select the **Review + create** button at the bottom of the page.
1. On the **Create a virtual machine** page, you can see the details about the VM you're about to create. When you're ready, select **Create**.


---


## Next steps

- [Create an Azure Compute Gallery](create-gallery.md)
- [Create an image in an Azure Compute Gallery](image-version.md)

