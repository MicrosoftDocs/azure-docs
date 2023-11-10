---
title: Create a new VM image version from an existing image version by using Azure VM Image Builder in Linux
description: In this article, you'll learn how to create a new VM image version from an existing image version by using VM Image Builder in Linux.
author: kof-f
ms.author: kofiforson
ms.reviewer: erd
ms.date: 11/10/2020
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: image-builder
ms.custom: devx-track-azurecli
---
# Create a new VM image from an existing image by using Azure VM Image Builder in Linux

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

In this article, you learn how to update an existing image version in an [Azure Compute Gallery](../shared-image-galleries.md) (formerly Shared Image Gallery) and publish it to the gallery as a new image version.

To configure the image, you use a sample JSON template, [helloImageTemplateforSIGfromSIG.json](https://raw.githubusercontent.com/azure/azvmimagebuilder/master/quickquickstarts/2_Creating_a_Custom_Linux_Shared_Image_Gallery_Image_from_SIG/helloImageTemplateforSIGfromSIG.json). 

## Register the providers

To use VM Image Builder, you need to register the providers.

1. Check your provider registrations. Make sure that each one returns *Registered*.

    ```azurecli-interactive
    az provider show -n Microsoft.VirtualMachineImages | grep registrationState
    az provider show -n Microsoft.KeyVault | grep registrationState
    az provider show -n Microsoft.Compute | grep registrationState
    az provider show -n Microsoft.Storage | grep registrationState
    az provider show -n Microsoft.Network | grep registrationState
    az provider show -n Microsoft.ContainerInstance | grep registrationState
    ```

1. If they don't return *Registered*, register the providers by running the following commands:

    ```azurecli-interactive
    az provider register -n Microsoft.VirtualMachineImages
    az provider register -n Microsoft.Compute
    az provider register -n Microsoft.KeyVault
    az provider register -n Microsoft.Storage
    az provider register -n Microsoft.Network
    az provider register -n Microsoft.ContainerInstance
    ```

## Set variables and permissions

If you've already created an Azure Compute Gallery by using [Create an image and distribute it to an Azure Compute Gallery](image-builder-gallery.md), you've already created some of the variables you need. 

1. If you haven't already created the variables, run the following commands:

    ```console
    # Resource group name 
    sigResourceGroup=ibLinuxGalleryRG
    # Gallery location 
    location=westus2
    # Additional region to replicate the image version to 
    additionalregion=eastus
    # Name of the Azure Compute Gallery 
    sigName=myIbGallery
    # Name of the image definition to use
    imageDefName=myIbImageDef
    # image distribution metadata reference name
    runOutputName=aibSIGLinuxUpdate
    ```

1. Create a variable for your subscription ID:

    ```console
    subscriptionID=$(az account show --query id --output tsv)
    ```

1. Get the image version that you want to update:

    ```azurecli
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

You can review the JSON example you're about to use at [helloImageTemplateforSIGfromSIG.json](https://raw.githubusercontent.com/azure/azvmimagebuilder/master/quickquickstarts/2_Creating_a_Custom_Linux_Shared_Image_Gallery_Image_from_SIG/helloImageTemplateforSIGfromSIG.json). For information about the JSON file, see [Create an Azure VM Image Builder template](image-builder-json.md). 

1. Download the JSON example, as shown in [Create a Linux image and distribute it to an Azure Compute Gallery by using the Azure CLI](image-builder.md). 

1. Configure the JSON with your variables: 

    ```console
    curl https://raw.githubusercontent.com/azure/azvmimagebuilder/master/quickquickstarts/8_Creating_a_Custom_Linux_Shared_Image_Gallery_Image_from_SIG/helloImageTemplateforSIGfromSIG.json -o helloImageTemplateforSIGfromSIG.json
    sed -i -e "s/<subscriptionID>/$subscriptionID/g" helloImageTemplateforSIGfromSIG.json
    sed -i -e "s/<rgName>/$sigResourceGroup/g" helloImageTemplateforSIGfromSIG.json
    sed -i -e "s/<imageDefName>/$imageDefName/g" helloImageTemplateforSIGfromSIG.json
    sed -i -e "s/<sharedImageGalName>/$sigName/g" helloImageTemplateforSIGfromSIG.json
    sed -i -e "s%<sigDefImgVersionId>%$sigDefImgVersionId%g" helloImageTemplateforSIGfromSIG.json
    sed -i -e "s/<region1>/$location/g" helloImageTemplateforSIGfromSIG.json
    sed -i -e "s/<region2>/$additionalregion/g" helloImageTemplateforSIGfromSIG.json
    sed -i -e "s/<runOutputName>/$runOutputName/g" helloImageTemplateforSIGfromSIG.json
    sed -i -e "s%<imgBuilderId>%$imgBuilderId%g" helloImageTemplateforSIGfromSIG.json
    ```

## Create the image

1. Submit the image configuration to the VM Image Builder service:

    ```azurecli-interactive
    az resource create \
        --resource-group $sigResourceGroup \
        --properties @helloImageTemplateforSIGfromSIG.json \
        --is-full-object \
        --resource-type Microsoft.VirtualMachineImages/imageTemplates \
        -n helloImageTemplateforSIGfromSIG01
    ```

1. Start the image build:

    ```azurecli-interactive
    az resource invoke-action \
        --resource-group $sigResourceGroup \
        --resource-type  Microsoft.VirtualMachineImages/imageTemplates \
        -n helloImageTemplateforSIGfromSIG01 \
        --action Run 
    ```

Wait for the image to be built and replicated before you move along to the next step.

## Create the VM

1. Create the VM by doing the following:

    ```azurecli-interactive
    az vm create \
    --resource-group $sigResourceGroup \
    --name aibImgVm001 \
    --admin-username azureuser \
    --location $location \
    --image "/subscriptions/$subscriptionID/resourceGroups/$sigResourceGroup/providers/Microsoft.Compute/galleries/$sigName/images/$imageDefName/versions/latest" \
    --generate-ssh-keys
    ```

1. Create a Secure Shell (SSH) connection to the VM by using the public IP address of the VM.

    ```console
    ssh azureuser@<pubIp>
    ```

    After the SSH connection is established, you should receive a "Message of the Day" saying that the image was customized:

    ```output
    *******************************************************
    **            This VM was built from the:            **
    **      !! AZURE VM IMAGE BUILDER Custom Image !!    **
    **         You have just been Customized :-)         **
    *******************************************************
    ```

1. Type `exit` to close the SSH connection.

1. To list the image versions that are now available in your gallery, run:

    ```azurecli-interactive
    az sig image-version list -g $sigResourceGroup -r $sigName -i $imageDefName -o table
    ```

## Next steps

To learn more about the components of the JSON file that you used in this article, see [Create an Azure VM Image Builder template](../linux/image-builder-json.md). 
 
