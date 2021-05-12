---
title: Create a Windows VM with Azure Image Builder (preview)
description: Create a Windows VM with the Azure Image Builder.
author: kof-f
ms.author: kofiforson
ms.date: 04/23/2021
ms.topic: how-to
ms.service: virtual-machines
ms.subervice: image-builder
ms.colletion: windows
---
# Preview: Create a Windows VM with Azure Image Builder

This article is to show you how you can create a customized Windows image using the Azure VM Image Builder. The example in this article uses [customizers](../linux/image-builder-json.md#properties-customize) for customizing the image:
- PowerShell (ScriptUri) - download and run a [PowerShell script](https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/testPsScript.ps1).
- Windows Restart - restarts the VM.
- PowerShell (inline) - run a specific command. In this example, it creates a directory on the VM using `mkdir c:\\buildActions`.
- File - copy a file from GitHub onto the VM. This example copies [index.md](https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/quickquickstarts/exampleArtifacts/buildArtifacts/index.html) to `c:\buildArtifacts\index.html` on the VM.
- buildTimeoutInMinutes - Increase a build time to allow for longer running builds, the default is 240 minutes, and you can increase a build time to allow for longer running builds.
- vmProfile - specifying a vmSize and Network properties
- osDiskSizeGB - you can increase the size of image
- identity - providing an identity for Azure Image Builder to use during the build


You can also specify a `buildTimeoutInMinutes`. The default is 240 minutes, and you can increase a build time to allow for longer running builds.

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
az provider show -n Microsoft.KeyVault | grep registrationState
az provider show -n Microsoft.Compute | grep registrationState
az provider show -n Microsoft.Storage | grep registrationState
az provider show -n Microsoft.Network | grep registrationState
```

If they do not say registered, run the following:

```azurecli-interactive
az provider register -n Microsoft.VirtualMachineImages
az provider register -n Microsoft.Compute
az provider register -n Microsoft.KeyVault
az provider register -n Microsoft.Storage
az provider register -n Microsoft.Network
```


## Set variables

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
## Create a resource group
This resource group is used to store the image configuration template artifact and the image.


```azurecli-interactive
az group create -n $imageResourceGroup -l $location
```

## Create a user-assigned identity and set permissions on the resource group
Image Builder will use the [user-identity](../../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md#user-assigned-managed-identity) provided to inject the image into the resource group. In this example, you will create an Azure role definition that has the granular actions to perform distributing the image. The role definition will then be assigned to the user-identity.

## Create user-assigned managed identity and grant permissions 
```bash
# create user assigned identity for image builder to access the storage account where the script is located
idenityName=aibBuiUserId$(date +'%s')
az identity create -g $imageResourceGroup -n $idenityName

# get identity id
imgBuilderCliId=$(az identity show -g $imageResourceGroup -n $idenityName | grep "clientId" | cut -c16- | tr -d '",')

# get the user identity URI, needed for the template
imgBuilderId=/subscriptions/$subscriptionID/resourcegroups/$imageResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/$idenityName

# download preconfigured role definition example
curl https://raw.githubusercontent.com/azure/azvmimagebuilder/master/solutions/12_Creating_AIB_Security_Roles/aibRoleImageCreation.json -o aibRoleImageCreation.json

imageRoleDefName="Azure Image Builder Image Def"$(date +'%s')

# update the definition
sed -i -e "s/<subscriptionID>/$subscriptionID/g" aibRoleImageCreation.json
sed -i -e "s/<rgName>/$imageResourceGroup/g" aibRoleImageCreation.json
sed -i -e "s/Azure Image Builder Service Image Creation Role/$imageRoleDefName/g" aibRoleImageCreation.json

# create role definitions
az role definition create --role-definition ./aibRoleImageCreation.json

# grant role definition to the user assigned identity
az role assignment create \
    --assignee $imgBuilderCliId \
    --role $imageRoleDefName \
    --scope /subscriptions/$subscriptionID/resourceGroups/$imageResourceGroup
```



## Download the image configuration template example

A parameterized image configuration template has been created for you to try. Download the example .json file and configure it with the variables you set previously.

```azurecli-interactive
curl https://raw.githubusercontent.com/azure/azvmimagebuilder/master/quickquickstarts/0_Creating_a_Custom_Windows_Managed_Image/helloImageTemplateWin.json -o helloImageTemplateWin.json

sed -i -e "s/<subscriptionID>/$subscriptionID/g" helloImageTemplateWin.json
sed -i -e "s/<rgName>/$imageResourceGroup/g" helloImageTemplateWin.json
sed -i -e "s/<region>/$location/g" helloImageTemplateWin.json
sed -i -e "s/<imageName>/$imageName/g" helloImageTemplateWin.json
sed -i -e "s/<runOutputName>/$runOutputName/g" helloImageTemplateWin.json
sed -i -e "s%<imgBuilderId>%$imgBuilderId%g" helloImageTemplateWin.json

```

You can modify this example, in the terminal using a text editor like `vi`.

```azurecli-interactive
vi helloImageTemplateWin.json
```

> [!NOTE]
> For the source image, you must always [specify a version](../linux/image-builder-troubleshoot.md#build--step-failed-for-image-version), you cannot use `latest`.
> If you add or change the resource group where the image is distributed to, you must make the [permissions are set](#create-a-user-assigned-identity-and-set-permissions-on-the-resource-group) on the resource group.
 
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

When complete, this will return a success message back to the console, and create an `Image Builder Configuration Template` in the `$imageResourceGroup`. You can see this resource in the resource group in the Azure portal, if you enable 'Show hidden types'.

In the background, Image Builder will also create a staging resource group in your subscription. This resource group is used for the image build. It will be in this format: `IT_<DestinationResourceGroup>_<TemplateName>`

> [!Note]
> You must not delete the staging resource group directly. First delete the image template artifact, this will cause the staging resource group to be deleted.

If the service reports a failure during the image configuration template submission:
-  Review these [troubleshooting](../linux/image-builder-troubleshoot.md#troubleshoot-image-template-submission-errors) steps. 
- You will need to delete the template, using the following snippet, before you retry submission.

```azurecli-interactive
az resource delete \
    --resource-group $imageResourceGroup \
    --resource-type Microsoft.VirtualMachineImages/imageTemplates \
    -n helloImageTemplateLinux01
```

## Start the image build
Start the image building process using [az resource invoke-action](/cli/azure/resource#az_resource_invoke_action).

```azurecli-interactive
az resource invoke-action \
     --resource-group $imageResourceGroup \
     --resource-type  Microsoft.VirtualMachineImages/imageTemplates \
     -n helloImageTemplateWin01 \
     --action Run 
```

Wait until the build is complete. This can take about 15 minutes.

If you encounter any errors, please review these [troubleshooting](../linux/image-builder-troubleshoot.md#troubleshoot-common-build-errors) steps.


## Create the VM

Create the VM using the image you built. Replace *\<password>* with your own password for the `aibuser` on the VM.

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

### Delete the image builder template

```azurecli-interactive
az resource delete \
    --resource-group $imageResourceGroup \
    --resource-type Microsoft.VirtualMachineImages/imageTemplates \
    -n helloImageTemplateWin01
```

### Delete the role assignment, role definition and user-identity.
```azurecli-interactive
az role assignment delete \
    --assignee $imgBuilderCliId \
    --role "$imageRoleDefName" \
    --scope /subscriptions/$subscriptionID/resourceGroups/$imageResourceGroup

az role definition delete --name "$imageRoleDefName"

az identity delete --ids $imgBuilderId
```

### Delete the image resource group

```azurecli-interactive
az group delete -n $imageResourceGroup
```


## Next steps

To learn more about the components of the .json file used in this article, see [Image builder template reference](../linux/image-builder-json.md).
