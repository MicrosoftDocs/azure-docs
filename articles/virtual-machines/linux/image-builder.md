---
title: Create a Linux VM with Azure Image Builder (preview)
description: Create a Linux VM with the Azure Image Builder.
author: cynthn
ms.author: cynthn
ms.date: 04/20/2019
ms.topic: article
ms.service: virtual-machines-linux
manager: jeconnoc
---
# Preview: Create a Linux VM with Azure Image Builder

This article shows you how you can create a basic customized image using the Azure Image Builder and the Azure CLI.

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
imageResourceGroup=myImageBuilerRG
# Datacenter location - we are using West US 2 in this example
location=WestUS2
# Name for the image - we are using myBuilderImage in this example
imageName=myBuilderImage
# Run output name
runOutputName=aibLinux
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
curl https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/quickquickstarts/0_Creating_a_Custom_Linux_Managed_Image/helloImageTemplateLinux.json -o helloImageTemplateLinux.json

sed -i -e "s/<subscriptionID>/$subscriptionID/g" helloImageTemplateLinux.json
sed -i -e "s/<rgName>/$imageResourceGroup/g" helloImageTemplateLinux.json
sed -i -e "s/<region>/$location/g" helloImageTemplateLinux.json
sed -i -e "s/<imageName>/$imageName/g" helloImageTemplateLinux.json
sed -i -e "s/<runOutputName>/$runOutputName/g" helloImageTemplateLinux.json
```

## Create the image
Submit the image configuration to the VM Image Builder service

```azurecli-interactive
az resource create \
    --resource-group $imageResourceGroup \
    --properties @helloImageTemplateLinux.json \
    --is-full-object \
    --resource-type Microsoft.VirtualMachineImages/imageTemplates \
    -n helloImageTemplateLinux01
```

Start the image build.

```azurecli-interactive
az resource invoke-action \
     --resource-group $imageResourceGroup \
     --resource-type  Microsoft.VirtualMachineImages/imageTemplates \
     -n helloImageTemplateLinux01 \
     --action Run 
```

Wait until the build is complete. This can take about 15 minutes.


## Create the VM

Create the VM using the image you built.

```azurecli-interactive
az vm create \
  --resource-group $imageResourceGroup \
  --name myVM \
  --admin-username azureuser \
  --image $imageName \
  --location $location \
  --generate-ssh-keys
```

Get the IP address from the output of creating the VM and use it to SSH to the VM.

```azurecli-interactive
ssh azureuser@<pubIp>
```

You should see the image was customized with a Message of the Day as soon as your SSH connection is established!

```console

*******************************************************
**            This VM was built from the:            **
**      !! AZURE VM IMAGE BUILDER Custom Image !!    **
**         You have just been Customized :-)         **
*******************************************************
```

Type `exit` when you are done to close the SSH connection.

## Check the source

In the Image Builder Template, in the 'Properties', you will see the source image, customization script it runs, and where it is distributed.

```azurecli-interactive
cat helloImageTemplateLinux.json
```

For more detailed information about this .json file, see [Image builder .json example](image-builder-json.md)

## Clean up

When you are done, delete the resources.

```azurecli-interactive
az resource delete \
    --resource-group $imageResourceGroup \
    --resource-type Microsoft.VirtualMachineImages/imageTemplates \
    -n helloImageTemplateLinux01

az group delete -n $imageResourceGroup
```


## Next steps

To learn more about the components of the .json file used in this article, see [Image builder json template example](image-builder-json.md).