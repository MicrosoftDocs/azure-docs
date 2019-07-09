---
title: Create a Linux VM with Azure Image Builder (preview)
description: Create a Linux VM with the Azure Image Builder.
author: cynthn
ms.author: cynthn
ms.date: 05/02/2019
ms.topic: article
ms.service: virtual-machines-linux
manager: gwallace
---
# Preview: Create a Linux VM with Azure Image Builder

This article shows you how you can create a customized Linux image using the Azure Image Builder and the Azure CLI. The example in this article uses three different [customizers](image-builder-json.md#properties-customize) for customizing the image:

- Shell (ScriptUri) - downloads and runs a [shell script](https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/quickquickstarts/customizeScript.sh).
- Shell (inline) - runs specific commands. In this example, the inline commands include creating a directory and updating the OS.
- File - copies a [file from GitHub](https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/quickquickstarts/exampleArtifacts/buildArtifacts/index.html) into a directory on the VM.


We will be using a sample .json template to configure the image. The .json file we are using is here: [helloImageTemplateLinux.json](https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/quickquickstarts/0_Creating_a_Custom_Linux_Managed_Image/helloImageTemplateLinux.json). 

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

## Setup example variables

We will be using some pieces of information repeatedly, so we will create some variables to store that information.


```azurecli-interactive
# Resource group name - we are using myImageBuilderRG in this example
imageResourceGroup=myImageBuilerRGLinux
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

## Create the resource group.
This is used to store the image configuration template artifact and the image.

```azurecli-interactive
az group create -n $imageResourceGroup -l $location
```

## Set permissions on the resource group
Give Image Builder 'contributor' permission to create the image in the resource group. Without the proper permissions, the image build will fail. 

The `--assignee` value is the app registration ID for the Image Builder service. 

```azurecli-interactive
az role assignment create \
    --assignee cf32a0cc-373c-47c9-9156-0db11f6a6dfc \
    --role Contributor \
    --scope /subscriptions/$subscriptionID/resourceGroups/$imageResourceGroup
```

## Download the template example

A parameterized sample image configuration template has been created for you to use. Download the sample .json file and configure it with the variables you set earlier.

```azurecli-interactive
curl https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/quickquickstarts/0_Creating_a_Custom_Linux_Managed_Image/helloImageTemplateLinux.json -o helloImageTemplateLinux.json

sed -i -e "s/<subscriptionID>/$subscriptionID/g" helloImageTemplateLinux.json
sed -i -e "s/<rgName>/$imageResourceGroup/g" helloImageTemplateLinux.json
sed -i -e "s/<region>/$location/g" helloImageTemplateLinux.json
sed -i -e "s/<imageName>/$imageName/g" helloImageTemplateLinux.json
sed -i -e "s/<runOutputName>/$runOutputName/g" helloImageTemplateLinux.json
```

You can modify this example .json as needed. For example, you can increase the value of `buildTimeoutInMinutes` to allow for longer running builds. You can edit the file in Cloud Shell using `vi`.

```azurecli-interactive
vi helloImageTemplateLinux.json
```

> [!NOTE]
> For source image, you must always [specify a version](https://github.com/danielsollondon/azvmimagebuilder/blob/master/troubleshootingaib.md#image-version-failure), you cannot use `latest`.
>
> If you add or change the resource group where the image is being distributed, you need to make sure the [permissions are set for the resource group](#set-permissions-on-the-resource-group).


## Submit the image configuration
Submit the image configuration to the VM Image Builder service

```azurecli-interactive
az resource create \
    --resource-group $imageResourceGroup \
    --properties @helloImageTemplateLinux.json \
    --is-full-object \
    --resource-type Microsoft.VirtualMachineImages/imageTemplates \
    -n helloImageTemplateLinux01
```

If it completes successfully, it will return a success message, and create an image builder configuration template artifact in the $imageResourceGroup. You can see the resource group in the portal if you enable 'Show hidden types'.

Also, in the background, Image Builder creates a staging resource group in your subscription. Image Builder uses the staging resource group for the image build. The name of the resource group will be in this format: `IT_<DestinationResourceGroup>_<TemplateName>`.

> [!IMPORTANT]
> Do not delete the staging resource group directly. If you delete the image template artifact, it will automatically delete the staging resource group. For more information, see the [Clean up](#clean-up) section at the end of this article.

If the service reports a failure during the image configuration template submission, see the [troubleshooting](https://github.com/danielsollondon/azvmimagebuilder/blob/master/troubleshootingaib.md#template-submission-errors--troubleshooting) steps. You will also need to delete the template before you retry submitting the build. To delete the template:

```azurecli-interactive
az resource delete \
    --resource-group $imageResourceGroup \
    --resource-type Microsoft.VirtualMachineImages/imageTemplates \
    -n helloImageTemplateLinux01
```

## Start the image build

Start the image build.


```azurecli-interactive
az resource invoke-action \
     --resource-group $imageResourceGroup \
     --resource-type  Microsoft.VirtualMachineImages/imageTemplates \
     -n helloImageTemplateLinux01 \
     --action Run 
```

Wait until the build is complete, for this example, it can take 10-15 minutes.

If you encounter any errors, please review these [troubleshooting](https://github.com/danielsollondon/azvmimagebuilder/blob/master/troubleshootingaib.md#image-build-errors--troubleshooting) steps.


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

For more detailed information about this .json file, see [Image builder template reference](image-builder-json.md)

## Clean up

When you are done, you can delete the resources.

Delete the image builder template.

```azurecli-interactive
az resource delete \
    --resource-group $imageResourceGroup \
    --resource-type Microsoft.VirtualMachineImages/imageTemplates \
    -n helloImageTemplateLinux01
```

Delete the image resource group.

```bash
az group delete -n $imageResourceGroup
```


## Next steps

To learn more about the components of the .json file used in this article, see [Image Builder template reference](image-builder-json.md).
