---
title: What's new in Azure VM Image Builder
description: This article offers the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.
author: kof-f
ms.service: virtual-machines
ms.topic: conceptual
ms.date: 02/13/2024
ms.reviewer: mattmcinnes
ms.subservice: image-builder
ms.custom: references_regions
---

# What's new in Azure VM Image Builder

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

This article contains all major API changes and feature updates for the Azure VM Image Builder (AIB) service.

## Updates

### May 2024
#### Breaking Change: Case Sensitivity

Starting from May 21, 2024, Azure VM Image Builder's API version 2024-02-01 and beyond will enforce case sensitivity for all fields. This means that the capitalization of letters in your API requests must match exactly with the expected format. 

>[!IMPORTANT]
> **Important Note for Existing Azure Image Builder Users**
>
> If you're an existing user of Azure VM Image Builder, rest assured that this change will **not** impact your existing resources. The case sensitivity enforcement applies only to **newly created resources** using **API version 2024-02-01 and beyond**. Your existing resources will continue to function as expected without any changes.
>
> If you encounter any issues related to case sensitivity, please refer to Azure Image Builder's updated API documentation for guidance.

Previously, Azure Image Builder's API was more forgiving in terms of case, but moving forward, precision is crucial. When making API calls, ensure that you use the correct capitalization for field names, parameters, and values. For example, if a field is named “vmBoot,” you must use “vmBoot” (not “VMBoot” or “vmboot”).

If you send an API request to Azure Image Builder's API version 2024-02-01 and beyond with incorrect case or unrecognized fields, the service will reject it. You will receive an error response indicating that the request is invalid. The error will look something like this:

`Unmarshalling entity encountered error: unmarshalling type *v2024_02_01.ImageTemplate: struct field Properties: unmarshalling type *v2024_02_01.ImageTemplateProperties: struct field Optimize: unmarshalling type *v2024_02_01.ImageTemplatePropertiesOptimize: unmarshalling type *v2024_02_01.ImageTemplatePropertiesOptimize, unknown field \"vmboot\". There is an issue with the syntax with the JSON template you are submitting. Please check the JSON template for syntax and grammar. For more information on the syntax and grammar of the JSON template, visit http://aka.ms/azvmimagebuildertmplref.`

The error message will mention an "unknown field" and direct you to the official documentation: [Create an Azure Image Builder Bicep or ARM template JSON template](./linux/image-builder-json.md).

> [!NOTE]
>  **Reference Azure Image Builder's Swagger for API Calls**
> 
> When making calls to the Azure Image Builder service, always reference the [Swagger documentation](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/imagebuilder/resource-manager/Microsoft.VirtualMachineImages/stable), which serves as the definitive source of truth for Azure Image Builder's API specifications. While the public documentation has been updated to include the proper capitalization and field names ahead of the API release, the Swagger definition contains precise details about each AIB API to ensure you are making calls to the service correctly.

Below is a list of the documentation changes that were made to match the field names in API version 2024-02-01:

In the [Create an Azure Image Builder Bicep or ARM template JSON template](./linux/image-builder-json.md) documentation:

**Fields Updated:**

- Replaced several mentions of `vmboot` with `vmBoot`
- Replaced one mention of `imageVersionID` with `imageVersionId`

**Field Removed:**

- `apiVersion`: We recommend avoiding the inclusion of this field in your requests because it is not explicitly specified in our API, so including it in your JSON template _may_ lead to errors in your image build.

In the [Azure VM Image Builder networking options](./linux/image-builder-networking.md) documentation:

**Field Updated:**

- Replaced one mention of `VirtualNetworkConfig` with `vnetConfig`

**Fields Removed:**

- `subnetName` in the `vnetConfig` property – this field is deprecated and the new field is `subnetId`
- `resourceGroupName` in the `vnetConfig` property – this field is deprecated and the new field is `subnetId`

#### How to Pin to an Older Azure Image Builder API Version

> **Important Consideration for Pinning to Older API Versions**
>
> Pinning to an older Azure Image Builder API version can provide compatibility with your existing templates, but it's not recommended due to the following factors:
>
> - Deprecation Risk: Older API versions may eventually be deprecated.
>
> - Missing Features: By pinning to an older API version, you miss out on the latest features and improvements introduced in newer versions. These enhancements often improve performance, security, and functionality.

If you’d like to avoid making changes to the properties in your image templates due to the new case sensitivity rules, you have the option to pin your Azure VM Image Builder API calls to a previous API version. This allows you to continue using the familiar behavior without any modifications.

To ensure compatibility with your existing templates, when creating or updating an image template, specify the desired API version (e.g., api-version=2022-07-01) by including the `api-version` parameter in your call to the service. Example:

# [HTTP](#tab/http)
```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.VirtualMachineImages/imageTemplates/{imageTemplateName}?api-version=2022-07-01
```

# [Azure CLI](#tab/-interactive)

```azurecli-interactive
az resource create \
    --api-version=2022-07-01 \
    --resource-group <resourceGroupName> \
    --properties <jsonResource> \
    --is-full-object \
    --resource-type Microsoft.VirtualMachineImages/imageTemplates \
    -n <imageTemplateName>
```

# [Azure PowerShell](#tab/azurepowershell-interactive)

```azurepowershell-interactive
New-AzResourceGroupDeployment -ResourceGroupName <resourceGroupName> -TemplateFile <templateFilePath> -TemplateParameterObject @{"api-version" = "2022-07-01"; "imageTemplateName" = <imageTemplateName>; "svclocation" = <location>}
```
---

> **Test Your Code**
>
> After pinning to the older API version, test your code to verify that it behaves as expected. Ensure that your existing templates continue to function correctly.

### November 2023
Azure Image Builder is enabling Isolated Image Builds using Azure Container Instances in a phased manner. The rollout is expected to be completed by early 2024. Your existing image templates will continue to work and there is no change in the way you create or build new image templates. 

You might observe a different set of transient Azure resources appear temporarily in the staging resource group but that does not impact your actual builds or the way you interact with Azure Image Builder. For more information, see [Isolated Image Builds](./security-isolated-image-builds-image-builder.md).

> [!IMPORTANT]
>Make sure your subscription is registered for the `Microsoft.ContainerInstance` provider and there are no policies blocking deployment of Azure Container Instances resources. Also ensure that quota is available for Azure Container Instances resources.

### April 2023
New portal functionality has been added for Azure Image Builder. Search “Image Templates” in Azure portal, then click “Create”. You can also [get started here](https://ms.portal.azure.com/#create/Microsoft.ImageTemplate) with building and validating custom images inside the portal.

## API releases

### Version 2024-02-01 

**Improvements**
- New `autoRun` property which allows you to run the image build on template creation or update. For more information, see [Properties: autoRun](../virtual-machines/linux/image-builder-json.md#properties-autorun).
- New `managedResourceTags` property which allows you to apply tags to the resources that the Azure Image Builder service creates in the staging resource group during the image build. For more information, see [Properties: managedResourceTags](../virtual-machines/linux/image-builder-json.md#properties-managedresourcetags).
- New `containerInstanceSubnetId` property which allows you to specify a subnet on which Azure Container Instance will be deployed for Isolated Builds. This field may be specified only if `subnetId` is also specified and must be on the same Virtual Network as the subnet specified in `subnetId`. For more information, see [
Bring your own Build VM subnet and bring your own ACI subnet](./security-isolated-image-builds-image-builder.md#bring-your-own-build-vm-subnet-and-bring-your-own-aci-subnet).
- Added support for updating the `vmProfile` property including the following fields:
    - `vmSize`
    - `osDiskSizeGB`
    - `userAssignedIdentities`
    - `vnetConfig`
        - `subnetId`
		- `containerInstanceSubnetId`
For more information on the `vmProfile` property, see [vmProfile](../virtual-machines/linux/image-builder-json.md#properties-vmprofile).

**Changes**
API version 2024-02-01 introduces a breaking change that enforces case sensitivity for all fields. This means that the capitalization of letters in your API requests must match exactly with the expected format. If you send an API request to Azure Image Builder's API version 2024-02-01 and beyond with incorrect case or unrecognized fields, the service will reject it. You will receive an error response indicating that the request is invalid. For more information, see [Breaking Change: Case Sensitivity](#may-2024).

### Version 2023-07-01

**Coming Soon**

Support for updating Azure Compute Gallery distribution targets.



**Changes**

New `errorHandling` property. This property provides users with more control over how errors are handled during the image building process. For more information, see [errorHandling](../virtual-machines/linux/image-builder-json.md#properties-errorhandling)

### Version 2022-07-01

**Improvements**
- Added support to use the latest image version stored in Azure Compute Gallery as the source for the image template
- Added `versioning` to support generating version numbers for image distributions. For more information, see [properties: versioning](../virtual-machines/linux/image-builder-json.md#versioning)
- Added support for per region configuration when distributing to Azure Compute Gallery. For more information, see [Distribute:targetRegions](../virtual-machines/linux/image-builder-json.md#distribute-targetregions)
- Added new 'File' validation type. For more information, see [validate properties](../virtual-machines/linux/image-builder-json.md#properties-validate)
- VHDs can now be distributed to a custom blob or container in a custom storage account. For more information, see [Distribute: VHD](../virtual-machines/linux/image-builder-json.md#distribute-vhd)
- Added support for using a [Direct Shared Gallery](/azure/virtual-machines/shared-image-galleries?tabs=azure-cli#sharing) image as the source for the image template


**Changes**
- `replicationRegions` is now deprecated for gallery distributions. For more information, use [gallery-replicated-regions](/cli/azure/image/builder/output?view=azure-cli-latest#az-image-builder-output-add-examples&preserve-view=true)
- VHDs can now be distributed to a custom blob or container in a custom storage account
- `targetRegions` array added and applied only to "SharedImage" type distribute. For more information on `targetRegions`, see [Azure Compute Gallery](../../articles/virtual-machines/azure-compute-gallery.md)
- Added support for using a [Direct Shared Gallery](/azure/virtual-machines/shared-image-galleries?tabs=azure-cli#sharing) image as the source for the image template. Direct Shared Gallery is currently in preview.
- Triggers are now available in public preview to set up automatic image builds. For more information, see [How to use AIB triggers](./image-builder-triggers-how-to.md)



### Version 2022-02-14

**Improvements**
- [Validation support](./linux/image-builder-json.md#properties-validate)
    - Shell (Linux): Script or inline
    - PowerShell (Windows): Script or inline, run elevated, run as system
    - Source-Validation-Only mode
- [Customized staging resource group support](./linux/image-builder-json.md#properties-stagingresourcegroup)

### Version 2021-10-01

**Breaking change**
 
API version 2021-10-01 introduces a change to the error schema that will be part of every future API release. If you have any Azure VM Image Builder automations, be aware of the [new error output](#error-output-for-version-2021-10-01-and-later) when you switch to API version 2021-10-01 or later. We recommend, after you've switched to the latest API version, that you don't revert to an earlier version, because you'll have to change your automation again to produce the earlier error schema. We don't anticipate that we'll change the error schema again in future releases.

##### **Error output for version 2020-02-14 and earlier**

```
{ 
  "code": "ValidationFailed",
  "message": "Validation failed: 'ImageTemplate.properties.source': Field 'imageId' has a bad value: '/subscriptions/subscriptionID/resourceGroups/resourceGroupName/providers/Microsoft.Compute/images/imageName'. Please review  http://aka.ms/azvmimagebuildertmplref  for details on fields requirements in the Image Builder Template." 
} 
```

##### **Error output for version 2021-10-01 and later**

```
{ 
  "error": {
    "code": "ValidationFailed", 
    "message": "Validation failed: 'ImageTemplate.properties.source': Field 'imageId' has a bad value: '/subscriptions/subscriptionID/resourceGroups/resourceGroupName/providers/Microsoft.Compute/images/imageName'. Please review  http://aka.ms/azvmimagebuildertmplref  for details on fields requirements in the Image Builder Template." 
  }
}
```

**Improvements**

- Added support for [Build VM MSIs](linux/image-builder-json.md#user-assigned-identity-for-the-image-builder-build-vm).
- Added support for Proxy VM size customization.

### Version 2020-02-14

**Improvements**

- Added support for creating images from the following sources:
    - Managed image
    - Azure Compute Gallery
    - Platform Image Repository (including Platform Image Purchase Plan)
- Added support for the following customizations:
    - Shell (Linux): Script or inline
    - PowerShell (Windows): Script or inline, run elevated, run as system
    - File (Linux and Windows)
    - Windows Restart (Windows)
    - Windows Update (Windows): Search criteria, filters, and update limit
- Added support for the following distribution types:
    - VHD (virtual hard disk)
    - Managed image
    - Azure Compute Gallery
- Other features:
    - Added support for customers to use their own virtual network
    - Added support for customers to customize the build VM (VM size, operating system disk size)
    - Added support for user-assigned Microsoft Windows Installer (MSI) (for customize/distribute steps)
    - Added support for [Gen2 images](image-builder-overview.md#hyper-v-generation)

### Preview APIs

 The following APIs are deprecated, but still supported:
- Version 2019-05-01-preview


## Next steps
Learn more about [VM Image Builder](image-builder-overview.md).
