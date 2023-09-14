---
title: Use Azure VM Image Builder with an Azure Compute Gallery for Linux VMs
description: Create Linux VM images with Azure VM Image Builder and Azure Compute Gallery.
author: kof-f
ms.author: kofiforson
ms.reviewer: cynthn
ms.date: 04/11/2023
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: image-builder
ms.custom: devx-track-azurecli, devx-track-linux
---
# Create a Linux image and distribute it to an Azure Compute Gallery by using the Azure CLI

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets  

In this article, you learn how to use Azure VM Image Builder and the Azure CLI to create an image version in an [Azure Compute Gallery](../shared-image-galleries.md) (formerly Shared Image Gallery) and then distribute the image globally. You can also create an image version by using [Azure PowerShell](../windows/image-builder-gallery.md).

This article uses a sample JSON template to configure the image. The JSON file is at [helloImageTemplateforSIG.json](https://github.com/danielsollondon/azvmimagebuilder/blob/master/quickquickstarts/1_Creating_a_Custom_Linux_Shared_Image_Gallery_Image/helloImageTemplateforSIG.json). 

To distribute the image to an Azure Compute Gallery, the template uses [sharedImage](image-builder-json.md#distribute-sharedimage) as the value for the `distribute` section of the template.

## Register the features

To use VM Image Builder, you need to register the feature. Check your registration by running the following commands:

```azurecli-interactive
az provider show -n Microsoft.VirtualMachineImages -o json | grep registrationState
az provider show -n Microsoft.KeyVault -o json | grep registrationState
az provider show -n Microsoft.Compute -o json | grep registrationState
az provider show -n Microsoft.Storage -o json | grep registrationState
az provider show -n Microsoft.Network -o json | grep registrationState
```

If the output doesn't say *registered*, run the following commands:

```azurecli-interactive
az provider register -n Microsoft.VirtualMachineImages
az provider register -n Microsoft.Compute
az provider register -n Microsoft.KeyVault
az provider register -n Microsoft.Storage
az provider register -n Microsoft.Network
```

## Set variables and permissions

Because you'll be using some pieces of information repeatedly, create some variables to store that information.

VM Image Builder supports creating custom images only in the same resource group as the source-managed image. In the following example, update the resource group name to be the same resource group as your source-managed image.

```azurecli-interactive
# Resource group name - ibLinuxGalleryRG in this example
sigResourceGroup=ibLinuxGalleryRG
# Datacenter location - West US 2 in this example
location=westus2
# Additional region to replicate the image to - East US in this example
additionalregion=eastus
# Name of the Azure Compute Gallery - myGallery in this example
sigName=myIbGallery
# Name of the image definition to be created - myImageDef in this example
imageDefName=myIbImageDef
# Reference name in the image distribution metadata
runOutputName=aibLinuxSIG
```

Create a variable for your subscription ID:

```azurecli-interactive
subscriptionID=$(az account show --query id --output tsv)
```

Create the resource group:

```azurecli-interactive
az group create -n $sigResourceGroup -l $location
```

## Create a user-assigned identity and set permissions on the resource group

VM Image Builder uses the provided [user-identity](../../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md#user-assigned-managed-identity) to inject the image into an Azure Compute Gallery. In this example, you create an Azure role definition with specific actions for distributing the image. The role definition is then assigned to the user identity.

```azurecli-interactive
# Create user-assigned identity for VM Image Builder to access the storage account where the script is stored
identityName=aibBuiUserId$(date +'%s')
az identity create -g $sigResourceGroup -n $identityName

# Get the identity ID
imgBuilderCliId=$(az identity show -g $sigResourceGroup -n $identityName --query clientId -o tsv)

# Get the user identity URI that's needed for the template
imgBuilderId=/subscriptions/$subscriptionID/resourcegroups/$sigResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/$identityName

# Download an Azure role-definition template, and update the template with the parameters that were specified earlier
curl https://raw.githubusercontent.com/Azure/azvmimagebuilder/master/solutions/12_Creating_AIB_Security_Roles/aibRoleImageCreation.json -o aibRoleImageCreation.json

imageRoleDefName="Azure Image Builder Image Def"$(date +'%s')

# Update the definition
sed -i -e "s/<subscriptionID>/$subscriptionID/g" aibRoleImageCreation.json
sed -i -e "s/<rgName>/$sigResourceGroup/g" aibRoleImageCreation.json
sed -i -e "s/Azure Image Builder Service Image Creation Role/$imageRoleDefName/g" aibRoleImageCreation.json

# Create role definitions
az role definition create --role-definition ./aibRoleImageCreation.json

# Grant a role definition to the user-assigned identity
az role assignment create \
    --assignee $imgBuilderCliId \
    --role "$imageRoleDefName" \
    --scope /subscriptions/$subscriptionID/resourceGroups/$sigResourceGroup
```

## Create an image definition and gallery

To use VM Image Builder with Azure Compute Gallery, you need to have an existing gallery and image definition. VM Image Builder doesn't create the gallery and image definition for you.

If you don't already have a gallery and image definition to use, start by creating them. 

First, create a gallery:

```azurecli-interactive
az sig create \
    -g $sigResourceGroup \
    --gallery-name $sigName
```

Then, create an image definition:

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

## Download and configure the JSON file

Download the JSON template and configure it with your variables:

```azurecli-interactive
curl https://raw.githubusercontent.com/Azure/azvmimagebuilder/master/quickquickstarts/1_Creating_a_Custom_Linux_Shared_Image_Gallery_Image/helloImageTemplateforSIG.json -o helloImageTemplateforSIG.json
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

In this section you create the image version in the gallery. 

Submit the image configuration to the Azure VM Image Builder service:

```azurecli-interactive
az resource create \
    --resource-group $sigResourceGroup \
    --properties @helloImageTemplateforSIG.json \
    --is-full-object \
    --resource-type Microsoft.VirtualMachineImages/imageTemplates \
    -n helloImageTemplateforSIG01
```

Start the image build:

```azurecli-interactive
az resource invoke-action \
     --resource-group $sigResourceGroup \
     --resource-type  Microsoft.VirtualMachineImages/imageTemplates \
     -n helloImageTemplateforSIG01 \
     --action Run 
```

It can take a few moments to create the image and replicate it to both regions. Wait until this part is finished before you move on to create a VM.

## Create the VM

Create the VM from the image version that was created by VM Image Builder.

```azurecli-interactive
az vm create \
  --resource-group $sigResourceGroup \
  --name myAibGalleryVM \
  --admin-username aibuser \
  --location $location \
  --image "/subscriptions/$subscriptionID/resourceGroups/$sigResourceGroup/providers/Microsoft.Compute/galleries/$sigName/images/$imageDefName/versions/latest" \
  --generate-ssh-keys
```

Connect to the VM via Secure Shell (SSH):

```azurecli-interactive
ssh aibuser@<publicIpAddress>
```

As soon as your SSH connection is established, you should see that the image was customized with a *Message of the Day*:

```console
*******************************************************
**            This VM was built from the:            **
**      !! AZURE VM IMAGE BUILDER Custom Image !!    **
**         You have just been Customized :-)         **
*******************************************************
```

## Clean up your resources

> [!NOTE]
> If you now want to try to recustomize the image version to create a new version of the same image, *skip the step outlined here* and go to [Use VM Image Builder to create another image version](image-builder-gallery-update-image-version.md).

If you no longer need the resources that were created as you followed the process in this article, you can delete them by doing the following.

This process deletes both the image that you created and all the other resource files. Make sure that you've finished this deployment before you delete the resources.

When you're deleting gallery resources, you need delete all the image versions before you can delete the image definition that was used to create them. To delete a gallery, you first need to have deleted all the image definitions in the gallery.

1. Delete the VM Image Builder template.

    ```azurecli-interactive
    az resource delete \
        --resource-group $sigResourceGroup \
        --resource-type Microsoft.VirtualMachineImages/imageTemplates \
        -n helloImageTemplateforSIG01
    ```

1. Delete permissions assignments, roles, and identity.

    ```azurecli-interactive
    az role assignment delete \
        --assignee $imgBuilderCliId \
        --role "$imageRoleDefName" \
        --scope /subscriptions/$subscriptionID/resourceGroups/$sigResourceGroup

    az role definition delete --name "$imageRoleDefName"

    az identity delete --ids $imgBuilderId
    ```

1. Get the image version that was created by VM Image Builder (it always starts with `0.`), and then delete it.

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

1. Delete the image definition.

    ```azurecli-interactive
    az sig image-definition delete \
    -g $sigResourceGroup \
    --gallery-name $sigName \
    --gallery-image-definition $imageDefName \
    --subscription $subscriptionID
    ```

1. Delete the gallery.

    ```azurecli-interactive
    az sig delete -r $sigName -g $sigResourceGroup
    ```

1. Delete the resource group.

    ```azurecli-interactive
    az group delete -n $sigResourceGroup -y
    ```

## Next steps

Learn more about [Azure Compute Gallery](../shared-image-galleries.md).
