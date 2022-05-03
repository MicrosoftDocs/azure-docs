---
title: Create a VM from a specialized image version
description: Create a VM using a specialized image version in an Azure Compute Gallery.
author: sandeepraichura
ms.service: virtual-machines
ms.subservice: gallery
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 08/05/2021
ms.author: saraic
ms.reviewer: cynthn
ms.custom: devx-track-azurecli, devx-track-azurepowershell
---

# Create a VM using a specialized image version 

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs 

Create a VM from a [specialized image version](./shared-image-galleries.md#generalized-and-specialized-images) stored in an Azure Compute Gallery (formerly known as Shared Image Gallery). If want to create a VM using a generalized image version, see [Create a VM from a generalized image version](vm-generalized-image-version.md).

> [!IMPORTANT]
> 
> When you create a new VM from a specialized image, the new VM retains the computer name of the original VM. Other computer-specific information (e.g. CMID) is also kept and, in some cases, this duplicate information could cause issues. When copying a VM, be aware of what types of computer-specific information your applications rely on.  

Replace resource names as needed in these examples. 

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
1. Under **Administrator account**, the username will be greyed out because the username and credentials from the source VM are used.
1. If you want to allow remote access to the VM, under **Public inbound ports**, choose **Allow selected ports** and then select **SSH (22)** or **RDP (3389)** from the drop-down. If you don't want to allow remote access to the VM, leave **None** selected for **Public inbound ports**.
1. When you are finished, select the **Review + create** button at the bottom of the page.
1. After the VM passes validation, select **Create** at the bottom of the page to start the deployment.


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

Create the VM using [az vm create](/cli/azure/vm#az-vm-create) using the --specialized parameter to indicate the the image is a specialized image. 

Use the image definition ID for `--image` to create the VM from the latest version of the image that is available. You can also create the VM from a specific version by supplying the image version ID for `--image`. 

In this example, we are creating a VM from the latest version of the *myImageDefinition* image.

```azurecli
az group create --name myResourceGroup --location eastus
az vm create --resource-group myResourceGroup \
    --name myVM \
    --image "/subscriptions/<Subscription ID>/resourceGroups/myGalleryRG/providers/Microsoft.Compute/galleries/myGallery/images/myImageDefinition" \
    --specialized
```

### [PowerShell](#tab/powershell)

Once you have a specialized image version, you can create one or more new VMs using the [New-AzVM](/powershell/module/az.compute/new-azvm) cmdlet. 

In this example, we are using the image definition ID to ensure your new VM will use the most recent version of an image. You can also use a specific version by using the image version ID for `Set-AzVMSourceImage -Id`. For example, to use image version *1.0.0* type: `Set-AzVMSourceImage -Id "/subscriptions/<subscription ID where the gallery is located>/resourceGroups/myGalleryRG/providers/Microsoft.Compute/galleries/myGallery/images/myImageDefinition/versions/1.0.0"`. 

Be aware that using a specific image version means automation could fail if that specific image version isn't available because it was deleted or removed from the region. We recommend using the image definition ID for creating your new VM, unless a specific image version is required.

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

---

**Next steps**

You can also create Azure Compute Gallery resource using templates. There are several Azure Quickstart Templates available: 

- [Create an Azure Compute Gallery](https://azure.microsoft.com/resources/templates/sig-create/)
- [Create an Image Definition in an Azure Compute Gallery](https://azure.microsoft.com/resources/templates/sig-image-definition-create/)
- [Create an Image Version in an Azure Compute Gallery](https://azure.microsoft.com/resources/templates/sig-image-version-create/)
