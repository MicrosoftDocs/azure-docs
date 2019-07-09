---
title: Create a Windows VM with Azure Image Builder (preview)
description: Create a Windows VM with the Azure Image Builder.
author: cynthn
ms.author: cynthn
ms.date: 05/02/2019
ms.topic: article
ms.service: virtual-machines-windows
manager: gwallace
---
# Preview: Create a Windows VM with Azure Image Builder

This article is to show you how you can create a customized Windows image using the Azure VM Image Builder. The example in this article uses three different [customizers](../linux/image-builder-json.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json#properties-customize) for customizing the image:
- PowerShell (ScriptUri) - download and run a [PowerShell script](https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/testPsScript.ps1).
- Windows Restart - restarts the VM.
- PowerShell (inline) - run a specific command. In this example, it creates a directory on the VM using `mkdir c:\\buildActions`.
- File - copy a file from GitHub onto the VM. This example copies [index.md](https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/quickquickstarts/exampleArtifacts/buildArtifacts/index.html) to `c:\buildArtifacts\index.html` on the VM.

We will be using a sample .json template to configure the image. The .json file we are using is here: [helloImageTemplateWin.json](https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/quickquickstarts/0_Creating_a_Custom_Windows_Managed_Image/helloImageTemplateWin.json). 


> [!IMPORTANT]
> Azure Image Builder is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


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

## Create a resource group

We will be using some pieces of information repeatedly, so we will create some variables to store that information.

```azurecli-interactive
# Resource group name - we are using myImageBuilderRG in this example
imageResourceGroup=myWinImgBuilderRG
# Region location 
location=WestUS2
# Name for the image 
imageName=myWinBuilderImage
# Run output name
runOutputName=aibWindows
# name of the image to be created
imageName=aibWinImage
```

Create a variable for your subscription ID. You can get this using `az account show | grep id`.

```azurecli-interactive
subscriptionID=<Your subscription ID>
```

Create the resource group.

```azurecli-interactive
az group create -n $imageResourceGroup -l $location
```

Give Image Builder permission to create resources in that resource group. The `--assignee` value is the app registration ID for the Image Builder service. 

```azurecli-interactive
az role assignment create \
    --assignee cf32a0cc-373c-47c9-9156-0db11f6a6dfc \
    --role Contributor \
    --scope /subscriptions/$subscriptionID/resourceGroups/$imageResourceGroup
```


## Download the .json example

Download the example .json file and configure it with the variables you created.

```azurecli-interactive
curl https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/quickquickstarts/0_Creating_a_Custom_Windows_Managed_Image/helloImageTemplateWin.json -o helloImageTemplateWin.json
sed -i -e "s/<subscriptionID>/$subscriptionID/g" helloImageTemplateWin.json
sed -i -e "s/<rgName>/$imageResourceGroup/g" helloImageTemplateWin.json
sed -i -e "s/<region>/$location/g" helloImageTemplateWin.json
sed -i -e "s/<imageName>/$imageName/g" helloImageTemplateWin.json
sed -i -e "s/<runOutputName>/$runOutputName/g" helloImageTemplateWin.json

```

## Create the image

Submit the image configuration to the VM Image Builder service

```azurecli-interactive
az resource create \
    --resource-group $imageResourceGroup \
    --properties @helloImageTemplateWin.json \
    --is-full-object \
    --resource-type Microsoft.VirtualMachineImages/imageTemplates \
    -n helloImageTemplateWin01
```

Start the image build.

```azurecli-interactive
az resource invoke-action \
     --resource-group $imageResourceGroup \
     --resource-type  Microsoft.VirtualMachineImages/imageTemplates \
     -n helloImageTemplateWin01 \
     --action Run 
```

Wait until the build is complete. This can take about 15 minutes.

## Create the VM

Create the VM using the image you built. Replace *<password>* with your own password for the `aibuser` on the VM.

```azurecli-interactive
az vm create \
  --resource-group $imageResourceGroup \
  --name aibImgWinVm00 \
  --admin-username aibuser \
  --admin-password <password> \
  --image $imageName \
  --location $location
```

## Verify the customization

Create a Remote Desktop connection to the VM using the username and password you set when you created the VM. Inside the VM, open a cmd prompt and type:

```console
dir c:\
```

You should see these two directories created during image customization:
- buildActions
- buildArtifacts

## Clean up

When you are done, delete the resources.

```azurecli-interactive
az resource delete \
    --resource-group $imageResourceGroup \
    --resource-type Microsoft.VirtualMachineImages/imageTemplates \
    -n helloImageTemplateWin01
az group delete -n $imageResourceGroup
```

## Next steps

To learn more about the components of the .json file used in this article, see [Image builder template reference](../linux/image-builder-json.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

