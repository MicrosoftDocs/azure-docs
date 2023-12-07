---
title: How to use Azure Image Builder triggers to set up an automatic image build
description: Use triggers in Azure Image Builder to set up automatic image builds when criteria are met in a build pipeline
author: kof-f
ms.author: kofiforson
ms.reviewer: erd
ms.service: virtual-machines
ms.subservice: image-builder
ms.topic: how-to
ms.date: 11/10/2023
ms.custom: template-how-to-pattern, devx-track-azurecli
---

# How to use Azure Image Builder triggers to set up an automatic image build
You can use triggers in Azure Image Builder (AIB) to set up automatic image builds when certain criteria are met in your build pipeline.

> [!IMPORTANT]
> Please be informed that there exists a restriction on the number of triggers allowable per region, specifically 100 per region per subscription.

> [!NOTE]
> Currently, we only support setting a trigger for a new source image, but we do expect to support different kinds of triggers in the future.

## Prerequisites
Before setting up your first trigger, ensure you're using Azure Image Builder API version **2022-07-01.**

## How to set up a trigger in Azure Image Builder

### Register the providers

To use VM Image Builder with triggers, you need to register the below providers. Check your registration by running the following commands:

```azurecli-interactive
az provider show -n Microsoft.VirtualMachineImages -o json | grep registrationState
az provider show -n Microsoft.KeyVault -o json | grep registrationState
az provider show -n Microsoft.Compute -o json | grep registrationState
az provider show -n Microsoft.Storage -o json | grep registrationState
az provider show -n Microsoft.Network -o json | grep registrationState
az provider show -n Microsoft.ContainerInstance -o json | grep registrationState
```

If the output doesn't say registered, run the following commands:

```azurecli-interactive
az provider register -n Microsoft.VirtualMachineImages
az provider register -n Microsoft.Compute
az provider register -n Microsoft.KeyVault
az provider register -n Microsoft.Storage
az provider register -n Microsoft.Network
az provider register -n Microsoft.ContainerInstance
```
Register the auto image build triggers feature:

```azurecli-interactive
az feature register --namespace Microsoft.VirtualMachineImages --name Triggers
```


### Set variables
First, you need to set some variables that you'll repeatedly use in commands.

```azurecli-interactive
# Resource group name - ibTriggersTestRG in this example
resourceGroupName=ibTriggersRG
# Datacenter location - West US 2 in this example
location=westus2
# Additional region to replicate the image to - East US in this example
additionalregion=eastus2
# Name of the Azure Compute Gallery - ibTriggersGallery in this example
acgName=ibTriggersGallery
# Name of the image definition to be created - ibTriggersImageDef in this example
imageDefName=ibTriggersImageDef
# Name of the Trigger to be created - ibTrigger in this example
ibTriggerName=ibTrigger
# Name of the image template to be created - ibTriggersImageTemplate in this example
imageTemplateName=ibTriggersImageTemplate
# Reference name in the image distribution metadata
runOutputName=ibTriggersTestRun
# Create a variable for your subscription ID
subscriptionID=$(az account show --query id --output tsv)
```

### Create resource group
Now, you need to create a resource group where you can store your image template. Use the following command to make your resource group:

```azurecli-interactive
az group create -n $resourceGroupName -l $location
```

### Create managed identity for the service
You'll also need to create a managed identity that will be used for the image template (and potentially the Azure Image Builder build VM). In this example, we create a managed identity with "Contributor" access, but you can refine the permissions or role assigned to the managed identity as you like as long as you include the permissions needed for the Azure Image Builder service to function properly.

For more information on the permissions needed for the Azure Image Builder service, see the following documentation: Configure [Azure VM Image Builder permissions](/azure/virtual-machines/linux/image-builder-permissions-cli) by using the Azure CLI

For more information on how managed identities can be assigned and used in Azure Image Builder, see the following documentation: [VM Image Builder template reference: Identity](/azure/virtual-machines/linux/image-builder-json?tabs=json%2Cazure-powershell#user-assigned-identity-for-azure-image-builder-image-template-resource)

Use the following command to create the managed identity that will be used for the image template:

```azurecli-interactive
# Create user-assigned identity for VM Image Builder to access the storage account where the script is stored
identityName=aibBuiUserId$(date +'%s')
az identity create -g $resourceGroupName -n $identityName

# Get the identity client and principal ID
imgBuilderCliId=$(az identity show -g $resourceGroupName -n $identityName --query clientId -o tsv)

# Get the user identity URI that's needed for the template
imgBuilderId=/subscriptions/$subscriptionID/resourcegroups/$resourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/$identityName

# Grant "Contributor" access to the user-assigned identity
az role assignment create \
    --assignee $imgBuilderCliId \
    --role "Contributor" \
    --scope /subscriptions/$subscriptionID/resourceGroups/$resourceGroupName
```

### Create gallery and image definition
To use VM Image Builder with Azure Compute Gallery, you need to have an existing gallery and image definition. VM Image Builder doesn't create the gallery and image definition for you.

If you don't already have a gallery and image definition to use, start by creating them.

First, create a gallery:

```azurecli-interactive
az sig create \
    -g $resourceGroupName \
    --gallery-name $acgName
```

Then, create an image definition:

```azurecli-interactive
az sig image-definition create \
   -g $resourceGroupName \
   --gallery-name $acgName \
   --gallery-image-definition $imageDefName \
   --publisher myIbPublisher \
   --offer myOffer \
   --sku 18.04-LTS \
   --os-type Linux
```

### Create the image template
Download the example JSON template and configure it with your variables. The following image template uses a Platform Image as its source, but you can change the source to an Azure Compute Gallery image if you'd like to set up automatic image builds anytime there's a new image version in your Azure Compute Gallery.

```azurecli-interactive
curl https://raw.githubusercontent.com/Azure/azvmimagebuilder/main/quickquickstarts/9_Setting_up_a_Trigger_with_a_Custom_Linux_Image/helloImageTemplate.json -o helloImageTemplateforTriggers.json
sed -i -e "s/<subscriptionID>/$subscriptionID/g" helloImageTemplateforTriggers.json
sed -i -e "s/<rgName>/$resourceGroupName/g" helloImageTemplateforTriggers.json
sed -i -e "s/<imageDefName>/$imageDefName/g" helloImageTemplateforTriggers.json
sed -i -e "s/<acgName>/$acgName/g" helloImageTemplateforTriggers.json
sed -i -e "s/<region1>/$location/g" helloImageTemplateforTriggers.json
sed -i -e "s/<region2>/$additionalregion/g" helloImageTemplateforTriggers.json
sed -i -e "s/<runOutputName>/$runOutputName/g" helloImageTemplateforTriggers.json
sed -i -e "s%<imgBuilderId>%$imgBuilderId%g" helloImageTemplateforTriggers.json
```
Image template requirements:
- The `source` must be either a Platform image or Azure Compute Gallery image (only these two sources are allowed currently)
- If you're using a Platform Image, then the version in the source needs to be `Latest`. For an Azure Compute Gallery image the last part of the resource ID that has the version name needs to be set to `Latest`.
- You can't specify a version if you're distributing the image to an Azure Compute Gallery. The version is automatically incremented.
- When source is set to an Azure Compute Gallery image and distribute is set to an Azure Compute Gallery, the source gallery image and the distribute gallery image can't be the same. The Azure Compute Gallery image definition ID can't be the same for both the source gallery image and the distribute gallery image.
- The image template should have "Succeeded" in the `provisioningState`, meaning the template was created without any issues. If the template isn't provisioned successfully, you won't be able to create a trigger.

After configuring your template use the following command to submit the image configuration to the Azure Image Builder service:

```azurecli-interactive
az image builder create -g $resourceGroupName -n $imageTemplateName --image-template helloImageTemplateforTriggers.json
```
You can use the following command to check to make sure the image template was created successfully:

```azurecli-interactive
az image builder show --name $imageTemplateName --resource-group $resourceGroupName
```
> [!NOTE]
> When running the command above the `provisioningState` should say "Succeeded", which means the template was created without any issues. If the `provisioningState` does not say succeeded, you will not be able to make a trigger use the image template.

### Create source trigger

Download the example trigger template and configure it with your variables. The following trigger starts a new image build anytime the source image is updated.

```azurecli-interactive
curl https://raw.githubusercontent.com/kof-f/azvmimagebuilder/main/quickquickstarts/9_Setting_up_a_Trigger_with_a_Custom_Linux_Image/trigger.json -o trigger.json
sed -i -e "s/<region1>/$location/g" trigger.json
```

Trigger requirements:
- The location in the trigger needs to be the same as the location in the image template. This is a requirement of the `az resource create` cmdlet.
- We currently support one `kind` of trigger, which is a "SourceImage"
- We only support one "SourceImage" trigger per image. If you already have a "SourceImage" trigger on the image, then you can't create a new one.
- You can't update the `kind` field to another type of trigger. You have to delete the trigger and recreate it or create another trigger with the appropriate configuration.

Use the following command to add the trigger to your resource group.

```azurecli-interactive
az image builder trigger create --name $ibTriggerName --resource-group $resourceGroupName --image-template-name $imageTemplateName --kind SourceImage
```
You can also use the following command to check that the trigger was created successfully:

```azurecli
az image builder trigger show --name $ibTriggerName --image-template-name $imageTemplateName --resource-group $resourceGroupName
```
> [!NOTE]
> When running the command above the `provisioningState` should say `Succeeded`, which means the trigger was created without any issues. In `status`, the code should say `Healthy` and the message should say `Trigger is active.`

### Clean up your resources

#### Deleting the trigger

Use the following command to delete the trigger:

```azurecli-interactive
az image builder trigger delete --name $ibTriggerName --image-template-name $imageTemplateName --resource-group $resourceGroupName
```
#### Deleting the image template

Use the following command to delete the image template:

```azurecli-interactive
az image builder delete --name $imageTemplateName --resource-group $resourceGroupName
```

## Next steps
Check out the [Image Builder template reference](../virtual-machines/linux/image-builder-json.md) for more information.
