--- 
title: VM Boot Optimization for Azure Compute Gallery Images with Azure VM Image Builder 
description: Optimize VM Boot and Provisioning time with Azure VM Image Builder 
ms.author: surbhijain 
ms.reviewer: kofiforson 
ms.date: 06/07/2023 
ms.topic: how-to 
ms.service: virtual-machines 
ms.subservice: image-builder
--- 

  

# VM optimization for gallery images with Azure VM Image Builder 

  **Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Virtual Machine Scale Sets 

In this article, you learn how to use Azure VM Image Builder to optimize your ACG (Azure Compute Gallery) Images or Managed Images or VHDs to improve the create time for your VMs. 

## Azure VM Optimization 
Azure VM optimization improves virtual machine creation time by updating the gallery image to optimize the image for a faster boot time. 

## Image types supported 

Optimization for the following images is supported: 

| Features  | Details   |
|---|---|
|OS Type| Linux, Windows |
| Partition | MBR/GPT |
| Hyper-V | Gen1/Gen2 |
| OS State | Generalized |

The following types of images aren't supported: 

* Images with size greater than 2 TB 
* ARM64 images 
* Specialized images

## Create an image

 ### Register the feature

To use VM Image Builder with prefetch, you need to register the below features. Check your registration by running the following commands:

```azurecli-interactive
az provider show -n Microsoft.VirtualMachineImages -o json | grep registrationState
az provider show -n Microsoft.KeyVault -o json | grep registrationState
az provider show -n Microsoft.Compute -o json | grep registrationState
az provider show -n Microsoft.Storage -o json | grep registrationState
az provider show -n Microsoft.Network -o json | grep registrationState
```

If the output doesn't say registered, run the following commands:

```azurecli-interactive
az provider register -n Microsoft.VirtualMachineImages
az provider register -n Microsoft.Compute
az provider register -n Microsoft.KeyVault
az provider register -n Microsoft.Storage
az provider register -n Microsoft.Network
```

### Set variables
First, you need to set some variables that you'll repeatedly use in commands.

```azurecli-interactive
# Resource group name - ibPrefetchTestRG in this example
resourceGroupName=ibTriggersRG
# Datacenter location - West US 2 in this example
location=westus2
# Additional region to replicate the image to - East US in this example
additionalregion=eastus2
# Name of the Azure Compute Gallery - ibTriggersGallery in this example
acgName=ibTriggersGallery
# Name of the image definition to be created - ibTriggersImageDef in this example
imageDefName=ibTriggersImageDef
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
az resource create --api-version 2022-07-01 --resource-group $resourceGroupName --properties @helloImageTemplateforTriggers.json --is-full-object --resource-type Microsoft.VirtualMachineImages/imageTemplates --name $imageTemplateName
```
You can use the following command to check to make sure the image template was created successfully:

```azurecli-interactive
az resource show --api-version 2022-07-01 --ids /subscriptions/$subscriptionID/resourcegroups/$resourceGroupName/providers/Microsoft.VirtualMachineImages/imageTemplates/$imageTemplateName
```
> [!NOTE]
> When running the command above the `provisioningState` should say "Succeeded", which means the template was created without any issues. If the `provisioningState` does not say succeeded, you will not be able to make a trigger use the image template.

## Optimization in Azure VM Image Builder 

Optimization can be enabled while creating a VM image using the CLI. 

Customers can create an Azure VM Image Builder template using CLI. It contains details regarding source, type of customization, and distribution.

In your template, you will need to enable the additional fields shown below for VM optimization. For more information on how to create an image builder template, see [Create an Azure Image Builder Bicep or ARM JSON template.](/azure/virtual-machines/linux/image-builder-json)



```json 

 "optimize": { 

      "vmboot": { 

        "state": "Enabled" 

      } 

    } 

``` 

> [!NOTE]
> To enable VM optimization benefits, you must be using Azure Image Builder API Version `2022-07-01` or later.

  

## FAQs 

  

### Can VM optimization be used without Azure VM Image Builder customization? 

  

Yes, customers can opt for only VM optimization without using Azure VM Image Builder customization feature. Customers can simply enable the optimization flag and keep customization field as empty.  

  

### Can an existing ACG image version be optimized? 

No, this optimization feature won't update an existing SIG image version. However, optimization can be enabled during new version creation for an existing image 

  

## How much time does it take for generating an optimized image? 

 

 The below latencies have been observed at various percentiles: 

| OS | Size | P50 | P95 | Average |
| --- | --- | --- | --- | --- |
| Linux | 30 GB VHD | 20 mins | 21 mins | 20 mins |
| Windows | 127 GB VHD | 34 mins | 35 mins | 33 mins |

  

This is the end to end duration observed. Note, image generation duration varies based on different factors such as, OS Type, VHD size, OS State, etc. 

  

### Is OS image copied out of customer subscription for optimization? 

Yes, the OS VHD is copied from customer subscription to Azure subscription for optimization in the same geographic location. Once optimization is finished or timed out, Azure internally deletes all copied OS VHDs.  

### What are the performance improvements observed for VM boot optimization?

Enabling VM boot optimization feature may not always result in noticeable performance improvement as it depends on several factors like source image already optimized, OS type, customization etc. However, to ensure the best VM boot performance, it's recommended to enable this feature.

  

## Next steps 
Learn more about [Azure Compute Gallery](../virtual-machines/azure-compute-gallery.md).
