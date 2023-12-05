---
title: Use Azure Image Builder & Azure Compute Gallery for Linux VMs
description: Learn how to use the Azure Image Builder, and the Azure CLI, to create an image version in an Azure Compute Gallery, and then distribute the image globally.
author: kof-f
ms.author: kofiforson
ms.reviewer: erd
ms.date: 11/10/2023
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: image-builder
ms.custom: devx-track-azurecli, devx-track-linux
---

# Create a Linux image and distribute it to an Azure Compute Gallery

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets

This article shows you how you can use the Azure Image Builder, and the Azure CLI, to create an image version in an [Azure Compute Gallery](../shared-image-galleries.md) (formerly known as Shared Image Gallery), then distribute the image globally. You can also do this using [Azure PowerShell](../windows/image-builder-gallery.md).

We'll be using a sample .json template to configure the image. The .json file we're using is here: [helloImageTemplateforSIG.json](https://github.com/azure/azvmimagebuilder/blob/master/quickquickstarts/1_Creating_a_Custom_Linux_Shared_Image_Gallery_Image/helloImageTemplateforSIG.json). 

To distribute the image to an Azure Compute Gallery, the template uses [sharedImage](image-builder-json.md#distribute-sharedimage) as the value for the `distribute` section of the template.

## Register the providers

To use Azure Image Builder, you need to register the feature.

Check your registration.

```azurecli-interactive
az provider show -n Microsoft.VirtualMachineImages | grep registrationState
az provider show -n Microsoft.KeyVault | grep registrationState
az provider show -n Microsoft.Compute | grep registrationState
az provider show -n Microsoft.Storage | grep registrationState
az provider show -n Microsoft.Network | grep registrationState
az provider show -n Microsoft.ContainerInstance | grep registrationState
```

If they don't say registered, run the following:

```azurecli-interactive
az provider register -n Microsoft.VirtualMachineImages
az provider register -n Microsoft.Compute
az provider register -n Microsoft.KeyVault
az provider register -n Microsoft.Storage
az provider register -n Microsoft.Network
az provider register -n Microsoft.ContainerInstance
```

## Set variables and permissions

We'll be using some pieces of information repeatedly, so we'll create some variables to store that information.

Image Builder only supports creating custom images in the same Resource Group as the source managed image. Update the resource group name in this example to be the same resource group as your source managed image.

```azurecli-interactive
# Resource group name - we are using ibLinuxGalleryRG in this example
sigResourceGroup=ibLinuxGalleryRG
# Datacenter location - we are using West US 2 in this example
location=westus2
# Additional region to replicate the image to - we are using East US in this example
additionalregion=eastus
# name of the Azure Compute Gallery - in this example we are using myGallery
sigName=myIbGallery
# name of the image definition to be created - in this example we are using myImageDef
imageDefName=myIbImageDef
# image distribution metadata reference name
runOutputName=aibLinuxSIG
```

Create a variable for your subscription ID.

```azurecli-interactive
subscriptionID=$(az account show --query id --output tsv)
```

Create the resource group.

```azurecli-interactive
az group create -n $sigResourceGroup -l $location
```

## Create a user-assigned identity and set permissions on the resource group

Image Builder uses the [user-identity](../../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md#user-assigned-managed-identity) provided to inject the image into the Azure Compute Gallery. In this example, you'll create an Azure role definition that has the granular actions to perform distributing the image to the gallery. The role definition will then be assigned to the user-identity.

```azurecli-interactive
# create user assigned identity for image builder to access the storage account where the script is located
identityName=aibBuiUserId$(date +'%s')
az identity create -g $sigResourceGroup -n $identityName

# get identity id
imgBuilderCliId=$(az identity show -g $sigResourceGroup -n $identityName --query clientId -o tsv)

# get the user identity URI, needed for the template
imgBuilderId=/subscriptions/$subscriptionID/resourcegroups/$sigResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/$identityName

# this command will download an Azure role definition template, and update the template with the parameters specified earlier.
curl https://raw.githubusercontent.com/azure/azvmimagebuilder/master/solutions/12_Creating_AIB_Security_Roles/aibRoleImageCreation.json -o aibRoleImageCreation.json

imageRoleDefName="Azure Image Builder Image Def"$(date +'%s')

# update the definition
sed -i -e "s/<subscriptionID>/$subscriptionID/g" aibRoleImageCreation.json
sed -i -e "s/<rgName>/$sigResourceGroup/g" aibRoleImageCreation.json
sed -i -e "s/Azure Image Builder Service Image Creation Role/$imageRoleDefName/g" aibRoleImageCreation.json

# create role definitions
az role definition create --role-definition ./aibRoleImageCreation.json

# grant role definition to the user assigned identity
az role assignment create \
    --assignee $imgBuilderCliId \
    --role "$imageRoleDefName" \
    --scope /subscriptions/$subscriptionID/resourceGroups/$sigResourceGroup
```

## Create an image definition and gallery

To use Image Builder with an Azure Compute Gallery, you need to have an existing gallery and image definition. Image Builder won't create the gallery and image definition for you.

If you don't already have a gallery and image definition to use, start by creating them. First, create a gallery.

```azurecli-interactive
az sig create \
    -g $sigResourceGroup \
    --gallery-name $sigName
```

Then, create an image definition.

```azurecli-interactive
az sig image-definition create \
   -g $sigResourceGroup \
   --gallery-name $sigName \
   --gallery-image-definition $imageDefName \
   --publisher myIbPublisher \
   --offer myOffer \
   --sku 18.04-LTS \
   --os-type Linux
```

## Download and configure the .json

Download the .json template and configure it with your variables.

```azurecli-interactive
curl https://raw.githubusercontent.com/azure/azvmimagebuilder/master/quickquickstarts/1_Creating_a_Custom_Linux_Shared_Image_Gallery_Image/helloImageTemplateforSIG.json -o helloImageTemplateforSIG.json
sed -i -e "s/<subscriptionID>/$subscriptionID/g" helloImageTemplateforSIG.json
sed -i -e "s/<rgName>/$sigResourceGroup/g" helloImageTemplateforSIG.json
sed -i -e "s/<imageDefName>/$imageDefName/g" helloImageTemplateforSIG.json
sed -i -e "s/<sharedImageGalName>/$sigName/g" helloImageTemplateforSIG.json
sed -i -e "s/<region1>/$location/g" helloImageTemplateforSIG.json
sed -i -e "s/<region2>/$additionalregion/g" helloImageTemplateforSIG.json
sed -i -e "s/<runOutputName>/$runOutputName/g" helloImageTemplateforSIG.json
sed -i -e "s%<imgBuilderId>%$imgBuilderId%g" helloImageTemplateforSIG.json
```

## Create the image version

This next part will create the image version in the gallery. 

Submit the image configuration to the Azure Image Builder service.

```azurecli-interactive
az resource create \
    --resource-group $sigResourceGroup \
    --properties @helloImageTemplateforSIG.json \
    --is-full-object \
    --resource-type Microsoft.VirtualMachineImages/imageTemplates \
    -n helloImageTemplateforSIG01
```

Start the image build.

```azurecli-interactive
az resource invoke-action \
     --resource-group $sigResourceGroup \
     --resource-type  Microsoft.VirtualMachineImages/imageTemplates \
     -n helloImageTemplateforSIG01 \
     --action Run 
```

Creating the image and replicating it to both regions can take a while. Wait until this part is finished before moving on to creating a VM.

## Create the VM

Create a VM from the image version that was created by Azure Image Builder.

```azurecli-interactive
az vm create \
  --resource-group $sigResourceGroup \
  --name myAibGalleryVM \
  --admin-username aibuser \
  --location $location \
  --image "/subscriptions/$subscriptionID/resourceGroups/$sigResourceGroup/providers/Microsoft.Compute/galleries/$sigName/images/$imageDefName/versions/latest" \
  --generate-ssh-keys
```

SSH into the VM.

```azurecli-interactive
ssh aibuser@<publicIpAddress>
```

You should see the image was customized with a *Message of the Day* as soon as your SSH connection is established!

```console
*******************************************************
**            This VM was built from the:            **
**      !! AZURE VM IMAGE BUILDER Custom Image !!    **
**         You have just been Customized :-)         **
*******************************************************
```

## Clean up resources

If you want to now try recustomizing the image version to create a new version of the same image, skip the next steps and go on to [Use Azure Image Builder to create another image version](image-builder-gallery-update-image-version.md).

This deletes the image that was created, along with all of the other resource files. Make sure you're finished with this deployment before deleting the resources.

When deleting gallery resources, you need delete all of the image versions before you can delete the image definition used to create them. To delete a gallery, you first need to have deleted all of the image definitions in the gallery.

Delete the image builder template.

```azurecli-interactive
az resource delete \
    --resource-group $sigResourceGroup \
    --resource-type Microsoft.VirtualMachineImages/imageTemplates \
    -n helloImageTemplateforSIG01
```

Delete permissions assignments, roles and identity

```azurecli-interactive
az role assignment delete \
    --assignee $imgBuilderCliId \
    --role "$imageRoleDefName" \
    --scope /subscriptions/$subscriptionID/resourceGroups/$sigResourceGroup

az role definition delete --name "$imageRoleDefName"

az identity delete --ids $imgBuilderId
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

## Next steps

Learn more about [Azure Compute Galleries](../shared-image-galleries.md).
