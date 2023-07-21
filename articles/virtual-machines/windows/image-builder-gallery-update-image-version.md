---
title: Create a new Windows image version from an existing image version using Azure VM Image Builder 
description: Create a new Windows VM image version from an existing image version using Azure VM Image Builder.
author: kof-f
ms.author: kofiforson
ms.reviewer: erd
ms.date: 07/21/2023
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: image-builder
ms.custom: devx-track-azurecli
ms.collection: windows
---

# Create a new Windows VM image from an existing image by using Azure VM Image Builder

**Applies to:** :heavy_check_mark: Windows VMs

In this article, you learn how to update an existing Windows image version in an [Azure Compute Gallery](../shared-image-galleries.md) (formerly Shared Image Gallery) and publish it to the gallery as a new image version.

To configure the image, you use a sample JSON template, [helloImageTemplateforSIGfromWinSIG.json](https://raw.githubusercontent.com/azure/azvmimagebuilder/master/quickquickstarts/2_Creating_a_Custom_Win_Shared_Image_Gallery_Image_from_SIG/helloImageTemplateforSIGfromWinSIG.json). 


## Register the features

To use VM Image Builder, you need to register the features.

1. Check your provider registrations. Make sure that each one returns *Registered*.

    ```azurecli-interactive
    az provider show -n Microsoft.VirtualMachineImages | grep registrationState
    az provider show -n Microsoft.KeyVault | grep registrationState
    az provider show -n Microsoft.Compute | grep registrationState
    az provider show -n Microsoft.Storage | grep registrationState
    az provider show -n Microsoft.Network | grep registrationState
    ```

1. If they don't return *Registered*, register the providers by running the following commands:

    ```azurecli-interactive
    az provider register -n Microsoft.VirtualMachineImages
    az provider register -n Microsoft.Compute
    az provider register -n Microsoft.KeyVault
    az provider register -n Microsoft.Storage
    az provider register -n Microsoft.Network
    ```


## Set variables and permissions

If you've already created an Azure Compute Gallery by using [Create an image and distribute it to an Azure Compute Gallery](image-builder-gallery.md), you've already created some of the variables you need. 

> [!NOTE]
> VM Image Builder supports creating custom images only in the same resource group that the source-managed image is in. In the following example, update the resource group name, *ibsigRG*, with the name of resource group that your source-managed image is in.

1. If you haven't already created the variables, run the following commands:

    ```azurecli-interactive
    # Resource group name - we are using ibsigRG in this example
    sigResourceGroup=myIBWinRG
    # Datacenter location - we are using West US 2 in this example
    location=westus
    # Additional region to replicate the image to - we are using East US in this example
    additionalregion=eastus
    # name of the Azure Compute Gallery - in this example we are using myGallery
    sigName=my22stSIG
    # name of the image definition to be created - in this example we are using myImageDef
    imageDefName=winSvrimages
    # image distribution metadata reference name
    runOutputName=w2019SigRo
    # User name and password for the VM
    username="user name for the VM"
    vmpassword="password for the VM"
    ```

1. Create a variable for your subscription ID:

    ```azurecli-interactive
    subscriptionID=$(az account show --query id --output tsv)
    ```

1. Get the image version that you want to update:

    ```azurecli-interactive
    sigDefImgVersionId=$(az sig image-version list \
    -g $sigResourceGroup \
    --gallery-name $sigName \
    --gallery-image-definition $imageDefName \
    --subscription $subscriptionID --query [].'id' -o tsv)
    ```

## Create a user-assigned identity and set permissions on the resource group

You've set up the user identity in an earlier example, so now you need to get the resource ID, which will be appended to the template.

```azurecli-interactive
#get identity used previously
imgBuilderId=$(az identity list -g $sigResourceGroup --query "[?contains(name, 'aibBuiUserId')].id" -o tsv)
```

If you already have an Azure Compute Gallery but didn't set it up by following an earlier example, you need to assign permissions for VM Image Builder to access the resource group so that it can access the gallery. For more information, see [Create an image and distribute it to an Azure Compute Gallery](image-builder-gallery.md).


## Modify the helloImage example

You can review the JSON example you're about to use at [helloImageTemplateforSIGfromSIG.json](https://raw.githubusercontent.com/azure/azvmimagebuilder/master/quickquickstarts/8_Creating_a_Custom_Win_Shared_Image_Gallery_Image_from_SIG/helloImageTemplateforSIGfromWinSIG.json). For information about the JSON file, see [Create an Azure VM Image Builder template](../linux/image-builder-json.md). 

1. Download the JSON example, as shown in [Create a user-assigned identity and set permissions on the resource group](image-builder.md). 

1. Configure the JSON with your variables: 

    ```azurecli-interactive
    curl https://raw.githubusercontent.com/azure/azvmimagebuilder/master/quickquickstarts/8_Creating_a_Custom_Win_Shared_Image_Gallery_Image_from_SIG/helloImageTemplateforSIGfromWinSIG.json -o helloImageTemplateforSIGfromWinSIG.json
    sed -i -e "s/<subscriptionID>/$subscriptionID/g" helloImageTemplateforSIGfromWinSIG.json
    sed -i -e "s/<rgName>/$sigResourceGroup/g" helloImageTemplateforSIGfromWinSIG.json
    sed -i -e "s/<imageDefName>/$imageDefName/g" helloImageTemplateforSIGfromWinSIG.json
    sed -i -e "s/<sharedImageGalName>/$sigName/g" helloImageTemplateforSIGfromWinSIG.json
    sed -i -e "s%<sigDefImgVersionId>%$sigDefImgVersionId%g" helloImageTemplateforSIGfromWinSIG.json
    sed -i -e "s/<region1>/$location/g" helloImageTemplateforSIGfromWinSIG.json
    sed -i -e "s/<region2>/$additionalregion/g" helloImageTemplateforSIGfromWinSIG.json
    sed -i -e "s/<runOutputName>/$runOutputName/g" helloImageTemplateforSIGfromWinSIG.json
    sed -i -e "s%<imgBuilderId>%$imgBuilderId%g" helloImageTemplateforSIGfromWinSIG.json
    ```

## Create the image

1. Submit the image configuration to the VM Image Builder service:

    ```azurecli-interactive
    az resource create \
        --resource-group $sigResourceGroup \
        --location $location \
        --properties @helloImageTemplateforSIGfromWinSIG.json \
        --is-full-object \
        --resource-type Microsoft.VirtualMachineImages/imageTemplates \
        -n imageTemplateforSIGfromWinSIG01
    ```

1. Start the image build:

    ```azurecli-interactive
    az resource invoke-action \
        --resource-group $sigResourceGroup \
        --resource-type  Microsoft.VirtualMachineImages/imageTemplates \
        -n imageTemplateforSIGfromWinSIG01 \
        --action Run 
    ```

Wait for the image to be built and replicated before you move along to the next step.


## Create the VM

Create the VM by doing the following:

```azurecli-interactive
az vm create \
--resource-group $sigResourceGroup \
--name aibImgWinVm002 \
--admin-username $username \
--admin-password $vmpassword \
--image "/subscriptions/$subscriptionID/resourceGroups/$sigResourceGroup/providers/Microsoft.Compute/galleries/$sigName/images/$imageDefName/versions/latest" \
--location $location
```

## Verify the customization

Create a Remote Desktop connection to the VM by using the username and password you set when you created the VM. Inside the VM, open a Command Prompt window, and then run:

```console
dir c:\
```

You should now see two directories:

- *buildActions*: Created in the first image version.
- *buildActions2*: Created when you updated the first image version to create the second image version.


## Next steps

To learn more about the components of the JSON file that you used in this article, see [Create an Azure VM Image Builder template](../linux/image-builder-json.md).  
