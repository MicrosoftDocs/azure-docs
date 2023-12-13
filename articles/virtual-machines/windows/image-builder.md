---
title: Create a Windows VM by using Azure VM Image Builder 
description: In this article, you learn how to create a Windows VM by using VM Image Builder.
author: kof-f
ms.author: kofiforson
ms.reviewer: erd
ms.date: 11/10/2023
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: image-builder
ms.custom: devx-track-azurecli, devx-track-linux
ms.collection: windows
---
# Create a Windows VM by using Azure VM Image Builder

**Applies to:** :heavy_check_mark: Windows VMs 

In this article, you learn how to create a customized Windows image by using Azure VM Image Builder. The example in this article uses [customizers](../linux/image-builder-json.md#properties-customize) for customizing the image:
- PowerShell (ScriptUri): Download and run a [PowerShell script](https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/testPsScript.ps1).
- Windows Restart: Restarts the VM.
- PowerShell (inline): Runs a specific command. In this example, it creates a directory on the VM by using `mkdir c:\\buildActions`.
- File: Copies a file from GitHub to the VM. This example copies [index.md](https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/quickquickstarts/exampleArtifacts/buildArtifacts/index.html) to `c:\buildArtifacts\index.html` on the VM.
- `buildTimeoutInMinutes`: Specifies a build time, in minutes. The default is 240 minutes, which you can increase to allow for longer-running builds. The minimum allowed value is 6 minutes. Values shorter than 6 minutes will cause errors.
- `vmProfile`: Specifies a `vmSize` and network properties.
- `osDiskSizeGB`: Can be used to increase the size of an image.
- `identity`. Provides an identity for VM Image Builder to use during the build.

Use the following sample JSON template to configure the image: [helloImageTemplateWin.json](https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/quickquickstarts/0_Creating_a_Custom_Windows_Managed_Image/helloImageTemplateWin.json). 

> [!NOTE]
> Windows users can run the following Azure CLI examples on [Azure Cloud Shell](https://shell.azure.com) by using Bash.

## Register the providers

To use VM Image Builder, you need to register the feature. Check your registration by running the following commands:

```azurecli-interactive
az provider show -n Microsoft.VirtualMachineImages | grep registrationState
az provider show -n Microsoft.KeyVault | grep registrationState
az provider show -n Microsoft.Compute | grep registrationState
az provider show -n Microsoft.Storage | grep registrationState
az provider show -n Microsoft.Network | grep registrationState
az provider show -n Microsoft.ContainerInstance -o json | grep registrationState
```

If the output doesn't say *registered*, run the following commands:

```azurecli-interactive
az provider register -n Microsoft.VirtualMachineImages
az provider register -n Microsoft.Compute
az provider register -n Microsoft.KeyVault
az provider register -n Microsoft.Storage
az provider register -n Microsoft.Network
az provider register -n Microsoft.ContainerInstance
```

## Set variables

Because you'll be using some pieces of information repeatedly, create some variables to store that information:

```azurecli-interactive
# Resource group name - we're using myImageBuilderRG in this example
imageResourceGroup='myWinImgBuilderRG'
# Region location 
location='WestUS2'
# Run output name
runOutputName='aibWindows'
# The name of the image to be created
imageName='aibWinImage'
```

Create a variable for your subscription ID:

```azurecli-interactive
subscriptionID=$(az account show --query id --output tsv)
```

## Create the resource group

To store the image configuration template artifact and the image, use the following resource group:

```azurecli-interactive
az group create -n $imageResourceGroup -l $location
```

## Create a user-assigned identity and set permissions on the resource group

VM Image Builder uses the provided [user-identity](../../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md#user-assigned-managed-identity) to inject the image into the resource group. In this example, you create an Azure role definition with specific permissions for distributing the image. The role definition is then assigned to the user identity.

## Create a user-assigned managed identity and grant permissions 

Create a user-assigned identity so that VM Image Builder can access the storage account where the script is stored.

```azurecli-interactive
identityName=aibBuiUserId$(date +'%s')
az identity create -g $imageResourceGroup -n $identityName

# Get the identity ID
imgBuilderCliId=$(az identity show -g $imageResourceGroup -n $identityName --query clientId -o tsv)

# Get the user identity URI that's needed for the template
imgBuilderId=/subscriptions/$subscriptionID/resourcegroups/$imageResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/$identityName

# Download the preconfigured role definition example
curl https://raw.githubusercontent.com/azure/azvmimagebuilder/master/solutions/12_Creating_AIB_Security_Roles/aibRoleImageCreation.json -o aibRoleImageCreation.json

imageRoleDefName="Azure Image Builder Image Def"$(date +'%s')

# Update the definition
sed -i -e "s%<subscriptionID>%$subscriptionID%g" aibRoleImageCreation.json
sed -i -e "s%<rgName>%$imageResourceGroup%g" aibRoleImageCreation.json
sed -i -e "s%Azure Image Builder Service Image Creation Role%$imageRoleDefName%g" aibRoleImageCreation.json

# Create role definitions
az role definition create --role-definition ./aibRoleImageCreation.json

# Grant a role definition to the user-assigned identity
az role assignment create \
    --assignee $imgBuilderCliId \
    --role "$imageRoleDefName" \
    --scope /subscriptions/$subscriptionID/resourceGroups/$imageResourceGroup
```

## Download the image configuration template

We've created a parameterized image configuration template for you to try. Download the example JSON file, and then configure it with the variables that you set earlier.

```azurecli-interactive
curl https://raw.githubusercontent.com/azure/azvmimagebuilder/master/quickquickstarts/0_Creating_a_Custom_Windows_Managed_Image/helloImageTemplateWin.json -o helloImageTemplateWin.json

sed -i -e "s%<subscriptionID>%$subscriptionID%g" helloImageTemplateWin.json
sed -i -e "s%<rgName>%$imageResourceGroup%g" helloImageTemplateWin.json
sed -i -e "s%<region>%$location%g" helloImageTemplateWin.json
sed -i -e "s%<imageName>%$imageName%g" helloImageTemplateWin.json
sed -i -e "s%<runOutputName>%$runOutputName%g" helloImageTemplateWin.json
sed -i -e "s%<imgBuilderId>%$imgBuilderId%g" helloImageTemplateWin.json
```

You can modify this example in the terminal by using a text editor such as `vi`.

```azurecli-interactive
vi helloImageTemplateWin.json
```

> [!NOTE]
> For the source image, always [specify a version](../linux/image-builder-troubleshoot.md#the-build-step-failed-for-the-image-version). You can't specify `latest` as the version.
>
> If you add or change the resource group that the image is distributed to, make sure that the [permissions are set](#create-a-user-assigned-identity-and-set-permissions-on-the-resource-group) on the resource group.
 
## Create the image

Submit the image configuration to the VM Image Builder service by running the following commands:

```azurecli-interactive
az resource create \
    --resource-group $imageResourceGroup \
    --properties @helloImageTemplateWin.json \
    --is-full-object \
    --resource-type Microsoft.VirtualMachineImages/imageTemplates \
    -n helloImageTemplateWin01
```

When you're done, a success message is returned to the console, and a VM Image Builder configuration template is created in the `$imageResourceGroup`. To view this resource in the resource group, go to the Azure portal, and then enable **Show hidden types**.

In the background, VM Image Builder also creates a staging resource group in your subscription. This resource group is used to build the image in the following format: `IT_<DestinationResourceGroup>_<TemplateName>`.

> [!Note]
> Don't delete the staging resource group directly. First, delete the image template artifact, which causes the staging resource group to be deleted.

If the service reports a failure when you submit the image configuration template, do the following:
- See [Troubleshoot the Azure VM Image Builder service](../linux/image-builder-troubleshoot.md#troubleshoot-image-template-submission-errors). 
- Before you try to resubmit the template, delete it by running the following commands:

```azurecli-interactive
az resource delete \
    --resource-group $imageResourceGroup \
    --resource-type Microsoft.VirtualMachineImages/imageTemplates \
    -n helloImageTemplateWin01
```

## Start the image build

Start the image-building process by using [az resource invoke-action](/cli/azure/resource#az-resource-invoke-action).

```azurecli-interactive
az resource invoke-action \
     --resource-group $imageResourceGroup \
     --resource-type  Microsoft.VirtualMachineImages/imageTemplates \
     -n helloImageTemplateWin01 \
     --action Run 
```

Wait until the build is complete.

If you encounter any errors, see [Troubleshoot the Azure VM Image Builder service](../linux/image-builder-troubleshoot.md#troubleshoot-common-build-errors).


## Create the VM

Create the VM by using the image that you built. In the following code, replace *\<password>* with your own password for the *aibuser* on the VM.

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

Create a Remote Desktop connection to the VM by using the username and password that you set when you created the VM. In the VM, open a Command Prompt window, and then type:

```console
dir c:\
```

The following two directories are created during the image customization:

- buildActions
- buildArtifacts

## Clean up your resources

When you're done, delete the resources you've created.

1. Delete the VM Image Builder template.

   ```azurecli-interactive
   az resource delete \
       --resource-group $imageResourceGroup \
       --resource-type Microsoft.VirtualMachineImages/imageTemplates \
       -n helloImageTemplateWin01
   ```

1. Delete the role assignment, role definition, and user identity.

   ```azurecli-interactive
   az role assignment delete \
       --assignee $imgBuilderCliId \
       --role "$imageRoleDefName" \
       --scope /subscriptions/$subscriptionID/resourceGroups/$imageResourceGroup

   az role definition delete --name "$imageRoleDefName"

   az identity delete --ids $imgBuilderId
   ```

1. Delete the image resource group.

   ```azurecli-interactive
   az group delete -n $imageResourceGroup
   ```

## Next steps

To learn more about the components of the JSON file that this article uses, see the [VM Image Builder template reference](../linux/image-builder-json.md).
