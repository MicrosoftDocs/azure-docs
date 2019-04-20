---
title: Create a new image version from an existing image version using Azure Image Builder
description: Create a new image version from an existing image version using Azure Image Builder.
author: cynthn
ms.author: cynthn
ms.date: 04/17/2019
ms.topic: article
ms.service: virtual-machines-linux
manager: jeconnoc
---
# Create a new image version from an existing image version using Azure Image Builder

This article is to show you how you can create a basic customized image using the Azure VM Image Builder, and then use the Azure [Shared Image Gallery](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/shared-image-galleries).


## Register the features
To use Azure Image Builder during the preview, you need to register the new feature.

```azurecli-interactive
az feature register --namespace Microsoft.VirtualMachineImages --name VirtualMachineTemplatePreview
```

Check the status of the feature registration.

```azurecli-interactive
az feature show --namespace Microsoft.VirtualMachineImages --name VirtualMachineTemplatePreview | grep state
```

Check your registration.

```azurecli-interactive
az provider show -n Microsoft.VirtualMachineImages | grep registrationState

az provider show -n Microsoft.Storage | grep registrationState
```

If they do not say registered, run the following:

```azurecli-interactive
az provider register -n Microsoft.VirtualMachineImages

az provider register -n Microsoft.Storage
```


## Set Permissions & Create Shared Image Gallery (SIG)

>>> NOTE!!! Currently Linux Support only. 
For Preview AIB will only support creating custom images in the same Resource Group as the source custom managed image. For example, if your existing managed custom images resides in RG1, then you must make sure the sigResourceGroup variable below is set to RG1. In the quick start below, we will create a SIG in that RG.

This Quick Start assumes you have completed 1_Creating_a_Custom_Linux_Shared_Image_Gallery_Image, and therefore the variables below, will be preset to those variable names, for continuity, but you can always update them yourself.



```azurecli-interactive
# Resource group name - we are using ibsigRG in this example
sigResourceGroup=ibsigRG
# Datacenter location - we are using West US 2 in this example
location=westus2
# Additional region to replicate the image to - we are using East US in this example
additionalregion=eastus
# name of the shared image gallery - in this example we are using myGallery
sigName=myIbGallery
# name of the image definition to be created - in this example we are using myImageDef
imageDefName=myIbImageDef
# image distribution metadata reference name
runOutputName=ubuntusig2sig
```

Create a variable for your subscription ID. You can get this using `az account show | grep id`.

```azurecli-interactive
subscriptionID=<Subscription ID>
```

Get the image version created that we created earlier.

```
sigDefImgVersionId=$(az sig image-version list \
   -g $sigResourceGroup \
   --gallery-name $sigName \
   --gallery-image-definition $imageDefName \
   --subscription $subscriptionID --query [].'id' -o json | grep 0. | tr -d '"' | tr -d '[:space:]')
```


If you already have your own Shared Image Gallery, and did not follow the previous example, you will need to assign permissions for Image Builder to access the Resource Group, so it can access the SIG.


```bash
# assign permissions for that resource group
az role assignment create \
    --assignee cf32a0cc-373c-47c9-9156-0db11f6a6dfc \
    --role Contributor \
    --scope /subscriptions/$subscriptionID/resourceGroups/$sigResourceGroup
```


## Modify HelloImage Example

```bash
# download the example and configure it with your vars

curl https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/quickquickstarts/8_Creating_a_Custom_Linux_Shared_Image_Gallery_Image_from_SIG/helloImageTemplateforSIGfromSIG.json -o helloImageTemplateforSIGfromSIG.json

sed -i -e "s/<subscriptionID>/$subscriptionID/g" helloImageTemplateforSIGfromSIG.json
sed -i -e "s/<rgName>/$sigResourceGroup/g" helloImageTemplateforSIGfromSIG.json
sed -i -e "s/<imageDefName>/$imageDefName/g" helloImageTemplateforSIGfromSIG.json
sed -i -e "s/<sharedImageGalName>/$sigName/g" helloImageTemplateforSIGfromSIG.json
sed -i -e "s%<sigDefImgVersionId>%$sigDefImgVersionId%g" helloImageTemplateforSIGfromSIG.json

sed -i -e "s/<region1>/$location/g" helloImageTemplateforSIGfromSIG.json
sed -i -e "s/<region2>/$additionalregion/g" helloImageTemplateforSIGfromSIG.json
sed -i -e "s/<runOutputName>/$runOutputName/g" helloImageTemplateforSIGfromSIG.json

```

## Create the Image

Submit the image confiuration to the VM Image Builder Service.

```azurecli-interactive
az resource create \
    --resource-group $sigResourceGroup \
    --properties @helloImageTemplateforSIGfromSIG.json \
    --is-full-object \
    --resource-type Microsoft.VirtualMachineImages/imageTemplates \
    -n helloImageTemplateforSIGfromSIG01


Start the image build.

```azurecli-interactive
az resource invoke-action \
     --resource-group $sigResourceGroup \
     --resource-type  Microsoft.VirtualMachineImages/imageTemplates \
     -n helloImageTemplateforSIGfromSIG01 \
     --action Run 
```

Wait until the image has been built and replication before moving on to the next step.


## Create the VM

```azurecli-interactive
az vm create \
  --resource-group $sigResourceGroup \
  --name aibImgVm001 \
  --admin-username azureuser \
  --location $location \
  --image "/subscriptions/$subscriptionID/resourceGroups/$sigResourceGroup/providers/Microsoft.Compute/galleries/$sigName/images/$imageDefName/versions/latest" \
  --generate-ssh-keys
```

Create an SSH connection to the VM using the public IP address of the VM.

```azurecli-interactive
ssh azureuser@<pubIp>
```

You should see the image was customized with a "Message of the Day" as soon as your SSH connection is established.

```console
*******************************************************
**            This VM was built from the:            **
**      !! AZURE VM IMAGE BUILDER Custom Image !!    **
**         You have just been Customized :-)         **
*******************************************************
```



## Next Steps

To learn more about the components of the .json file used in this article, see [Image builder json template example](image-builder-json.md).