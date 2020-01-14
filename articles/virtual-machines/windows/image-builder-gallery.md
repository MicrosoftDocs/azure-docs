---
title: Use Azure Image Builder with an image gallery for Windows VMs (preview)
description: Create Windows VM images with Azure Image Builder and Shared Image Gallery.
author: cynthn
ms.author: cynthn
ms.date: 05/02/2019
ms.topic: article
ms.service: virtual-machines-windows
manager: gwallace
---
# Preview: Create a Windows image and distribute it to a Shared Image Gallery 

This article is to show you how you can use the Azure Image Builder to create an image version in a [Shared Image Gallery](shared-image-galleries.md), then distribute the image globally.

We will be using a .json template to configure the image. The .json file we are using is here: [armTemplateWinSIG.json](https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/quickquickstarts/1_Creating_a_Custom_Win_Shared_Image_Gallery_Image/armTemplateWinSIG.json). 

To distribute the image to a Shared Image Gallery, the template uses [sharedImage](../linux/image-builder-json.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json#distribute-sharedimage) as the value for the `distribute` section of the template.

Azure Image Builder automatically runs sysprep to generalize the image, this is a generic sysprep command, which you can [overide](https://github.com/danielsollondon/azvmimagebuilder/blob/master/troubleshootingaib.md#vms-created-from-aib-images-do-not-create-successfully) if needed. 

Be aware how many times you layer customizations. You can run the Sysprep command up to 8 times on a single Windows image. After running Sysprep 8 times, you must recreate your Windows image. For more information, see [Limits on how many times you can run Sysprep](https://docs.microsoft.com/windows-hardware/manufacture/desktop/sysprep--generalize--a-windows-installation#limits-on-how-many-times-you-can-run-sysprep). 

> [!IMPORTANT]
> Azure Image Builder is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Register the features
To use Azure Image Builder during the preview, you need to register the new feature.

```azurecli-interactive
Register-AzProviderFeature -FeatureName VirtualMachineTemplatePreview -ProviderNamespace Microsoft.VirtualMachineImages
```

Check the status of the feature registration.

```azurecli-interactive
Get-AzProviderFeature -FeatureName VirtualMachineTemplatePreview -ProviderNamespace Microsoft.VirtualMachineImages
```

Wait until `RegistrationState` is `Registered` before moving to the next step.

Check your provider registrations. Make sure each returns `Registered`.

```azurecli-interactive
Get-AzResourceProvider -ProviderNamespace Microsoft.VirtualMachineImages
Get-AzResourceProvider -ProviderNamespace Microsoft.Storage 
Get-AzResourceProvider -ProviderNamespace Microsoft.Compute
Get-AzResourceProvider -ProviderNamespace Microsoft.KeyVault
```

If they do not say registered, run the following:

```azurecli-interactive
Register-AzResourceProvider -ProviderNamespace Microsoft.VirtualMachineImages
Register-AzResourceProvider -ProviderNamespace Microsoft.Storage
Register-AzResourceProvider -ProviderNamespace Microsoft.Compute
Register-AzResourceProvider -ProviderNamespace Microsoft.KeyVault
```

## Create variables

We will be using some pieces of information repeatedly, so we will create some variables to store that information. Replace the values for the variables, like `username` and `vmpassword`, with your own information.

```azurepowershell-interactive
# Get existing context
$currentAzContext = Get-AzContext

# Destination image resource group
$imageResourceGroup="aibwinsig"

# Location
$location="westus"

# Get your current subscription ID
$subscriptionID=$currentAzContext.Subscription.Id

# Name of the image to be created
$imageName="aibCustomImgWin10"

# Image distribution metadata reference name
$runOutputName="aibCustWinManImg02ro"

# Image template name
$imageTemplateName="helloImageTemplateWin02ps"

# Distribution properties object name (runOutput). This gives you the properties of the managed image on completion.
$runOutputName="winclientR01"
```



## Create the resource group

Create a resource group and give Azure Image Builder permission to create resources in that resource group.

```azurepowershell-interactive
New-AzResourceGroup -Name $imageResourceGroup -Location $location
New-AzRoleAssignment -ObjectId ef511139-6170-438e-a6e1-763dc31bdf74 -Scope /subscriptions/$subscriptionID/resourceGroups/$imageResourceGroup -RoleDefinitionName Contributor
```



## Create the Shared Image Gallery

To use Image Builder with a shared image gallery, you need to have an existing image gallery and image definition. Image Builder will not create the image gallery and image definition for you.

If you don't already have a gallery and image definition to use, start by creating them. First, create an image gallery.

```azurepowershell-interactive
# Image gallery name
$sigGalleryName= "my22stSIG"

# Image definition name
$imageDefName ="winSvrimages"

# additional replication region
$replRegion2="eastus"

# Create the gallery
New-AzGallery -GalleryName $sigGalleryName -ResourceGroupName $imageResourceGroup  -Location $location

# Create the image definition
New-AzGalleryImageDefinition -GalleryName $sigGalleryName -ResourceGroupName $imageResourceGroup -Location $location -Name $imageDefName -OsState generalized -OsType Windows -Publisher 'myCo' -Offer 'Windows' -Sku 'Win10'
```



## Download and configure the template

Download the .json template and configure it with your variables.

```azurepowershell-interactive
$templateUrl="https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/quickquickstarts/1_Creating_a_Custom_Win_Shared_Image_Gallery_Image/armTemplateWinSIG.json"
$templateFilePath = "armTemplateWinSIG.json"

Invoke-WebRequest -Uri $templateUrl -OutFile $templateFilePath -UseBasicParsing

((Get-Content -path $templateFilePath -Raw) -replace '<subscriptionID>',$subscriptionID) | Set-Content -Path $templateFilePath
((Get-Content -path $templateFilePath -Raw) -replace '<rgName>',$imageResourceGroup) | Set-Content -Path $templateFilePath
((Get-Content -path $templateFilePath -Raw) -replace '<region>',$location) | Set-Content -Path $templateFilePath
((Get-Content -path $templateFilePath -Raw) -replace '<runOutputName>',$runOutputName) | Set-Content -Path $templateFilePath

((Get-Content -path $templateFilePath -Raw) -replace '<imageDefName>',$imageDefName) | Set-Content -Path $templateFilePath
((Get-Content -path $templateFilePath -Raw) -replace '<sharedImageGalName>',$sigGalleryName) | Set-Content -Path $templateFilePath
((Get-Content -path $templateFilePath -Raw) -replace '<region1>',$location) | Set-Content -Path $templateFilePath
((Get-Content -path $templateFilePath -Raw) -replace '<region2>',$replRegion2) | Set-Content -Path $templateFilePath
```


## Create the image version

Your template must be submitted to the service, this will download any dependent artifacts (scripts etc), and store them in the staging Resource Group, prefixed, *IT_*.

```azurepowershell-interactive
New-AzResourceGroupDeployment -ResourceGroupName $imageResourceGroup -TemplateFile $templateFilePath -api-version "2019-05-01-preview" -imageTemplateName $imageTemplateName -svclocation $location
```

To build the image you need to invoke 'Run' on the template.

```azurepowershell-interactive
Invoke-AzResourceAction -ResourceName $imageTemplateName -ResourceGroupName $imageResourceGroup -ResourceType Microsoft.VirtualMachineImages/imageTemplates -ApiVersion "2019-05-01-preview" -Action Run
```

Creating the image and replicating it to both regions can take a while. Wait until this part is finished before moving on to creating a VM.

For information on options for automating getting the image build status, see the [Readme](https://github.com/danielsollondon/azvmimagebuilder/blob/master/quickquickstarts/1_Creating_a_Custom_Win_Shared_Image_Gallery_Image/readme.md#get-status-of-the-image-build-and-query) for this template on GitHub.


## Create the VM

Create a VM from the image version that was created by Azure Image Builder.

Get the image version you created.
```azurepowershell-interactive
$imageVersion = Get-AzGalleryImageVersion `
   -ResourceGroupName $imageResourceGroup `
   -GalleryName $sigGalleryName `
   -GalleryImageDefinitionName $imageDefName `
   -Name] $imageName
```

Create the VM.

```azurepowershell-interactive
$vmResourceGroup = "myResourceGroup"
$vmLocation = "South Central US"
$vmName = "myVMfromImage"

# Create user object
$cred = Get-Credential -Message "Enter a username and password for the virtual machine."

# Create a resource group
New-AzResourceGroup -Name $vmResourceGroup -Location $vmLocation

# Network pieces
$subnetConfig = New-AzVirtualNetworkSubnetConfig -Name mySubnet -AddressPrefix 192.168.1.0/24
$vnet = New-AzVirtualNetwork -ResourceGroupName $vmResourceGroup -Location $vmLocation `
  -Name MYvNET -AddressPrefix 192.168.0.0/16 -Subnet $subnetConfig
$pip = New-AzPublicIpAddress -ResourceGroupName $vmResourceGroup -Location $vmLocation `
  -Name "mypublicdns$(Get-Random)" -AllocationMethod Static -IdleTimeoutInMinutes 4
$nsgRuleRDP = New-AzNetworkSecurityRuleConfig -Name myNetworkSecurityGroupRuleRDP  -Protocol Tcp `
  -Direction Inbound -Priority 1000 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * `
  -DestinationPortRange 3389 -Access Allow
$nsg = New-AzNetworkSecurityGroup -ResourceGroupName $vmResourceGroup -Location $vmLocation `
  -Name myNetworkSecurityGroup -SecurityRules $nsgRuleRDP
$nic = New-AzNetworkInterface -Name myNic -ResourceGroupName $vmResourceGroup -Location $vmLocation `
  -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id -NetworkSecurityGroupId $nsg.Id

# Create a virtual machine configuration using $imageVersion.Id to specify the shared image
$vmConfig = New-AzVMConfig -VMName $vmName -VMSize Standard_D1_v2 | `
Set-AzVMOperatingSystem -Windows -ComputerName $vmName -Credential $cred | `
Set-AzVMSourceImage -Id $imageVersion.Id | `
Add-AzVMNetworkInterface -Id $nic.Id

# Create a virtual machine
New-AzVM -ResourceGroupName $vmResourceGroup -Location $vmLocation -VM $vmConfig
```

## Verify the customization
Create a Remote Desktop connection to the VM using the username and password you set when you created the VM. Inside the VM, open a cmd prompt and type:

```console
dir c:\
```

You should see a directory named `buildActions` that was created during image customization.


## Clean up resources
If you want to now try re-customizing the image version to create a new version of the same image, **skip this step** and go on to [Use Azure Image Builder to create another image version](image-builder-gallery-update-image-version.md).


This will delete the image that was created, along with all of the other resource files. Make sure you are finished with this deployment before deleting the resources.

When deleting image gallery resources, you need delete all of the image versions before you can delete the image definition used to create them. To delete a gallery, you first need to have deleted all of the image definitions in the gallery.

Delete the image builder template.

```azurecli-interactive
az resource delete \
    --resource-group $sigResourceGroup \
    --resource-type Microsoft.VirtualMachineImages/imageTemplates \
    -n helloImageTemplateforWinSIG01
```

Get the image version created by image builder, this always starts with `0.`, and then delete the image version

```azurecli-interactive
sigDefImgVersion=$(az sig image-version list \
   -g $sigResourceGroup \
   --gallery-name $sigName \
   --gallery-image-definition $imageDefName \
   --subscription $subscriptionID --query [].'name' -o json | grep 0. | tr -d '"')
az sig image-version delete \
   -g $sigResourceGroup \
   --gallery-image-version $sigDefImgVersion \
   --gallery-name $sigName \
   --gallery-image-definition $imageDefName \
   --subscription $subscriptionID
```   


Delete the image definition.

```azurecli-interactive
az sig image-definition delete \
   -g $sigResourceGroup \
   --gallery-name $sigName \
   --gallery-image-definition $imageDefName \
   --subscription $subscriptionID
```

Delete the gallery.

```azurecli-interactive
az sig delete -r $sigName -g $sigResourceGroup
```

Delete the resource group.

```azurecli-interactive
az group delete -n $sigResourceGroup -y
```

## Next Steps

To learn how to update the image version you created, see [Use Azure Image Builder to create another image version](image-builder-gallery-update-image-version.md).
