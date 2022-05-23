---
title: What's new in Azure Image Builder 
description: Learn what is new with Azure Image Builder; such as the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.
author: kof-f
ms.service: virtual-machines
ms.topic: conceptual
ms.workload: infrastructure
ms.date: 04/04/2022
ms.reviewer: erd
ms.subservice: image-builder
ms.custom: references_regions


---

# What's new in Azure Image Builder

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

This document contains all major API changes and feature updates for the Azure Image Builder service.

## API Releases




### 2021-10-01

**Breaking Change**:
 
Our 2021-10-01 API introduces a change to the error schema that will be part of every future API release. Any Azure Image Builder automations you may have need to take account the new error output when switching to 2021-10-01 or newer API versions (new schema shown below). We recommend that once customers switch to the new API version (2021-10-01 and beyond), they don't revert to older versions as they'll have to change their automation again to expect the older error schema. We don't anticipate changing the error schema again in future releases.

For API versions 2020-02-14 and older, the error output will look like the following messages:

```
{ 
  "code": "ValidationFailed",
  "message": "Validation failed: 'ImageTemplate.properties.source': Field 'imageId' has a bad value: '/subscriptions/subscriptionID/resourceGroups/resourceGroupName/providers/Microsoft.Compute/images/imageName'. Please review  http://aka.ms/azvmimagebuildertmplref  for details on fields requirements in the Image Builder Template." 
} 
```


For API versions 2021-10-01 and newer, the error output will look like the following messages:

```
{ 
  "error": {
    "code": "ValidationFailed", 
    "message": "Validation failed: 'ImageTemplate.properties.source': Field 'imageId' has a bad value: '/subscriptions/subscriptionID/resourceGroups/resourceGroupName/providers/Microsoft.Compute/images/imageName'. Please review  http://aka.ms/azvmimagebuildertmplref  for details on fields requirements in the Image Builder Template." 
  }
}
```

**Improvements**:

- Added support for [Build VM MSIs](linux/image-builder-json.md#user-assigned-identity-for-the-image-builder-build-vm).
- Added support for Proxy VM size customization.

### 2020-02-14



**Improvements:**

- Added support for creating images from the following sources:
    - Managed Image
    - Azure Compute Gallery
    - Platform Image Repository (including Platform Image Purchase Plan)
- Added support for the following customizations:
    - Shell (Linux) - Script or Inline
    - PowerShell (Windows) - Script or Inline, run elevated, run as system
    - File (Linux and Windows)
    - Windows Restart (Windows)
    - Windows Update (Windows) (with search criteria, filters, and update limit)
- Added support for the following distribution types:
    - VHD
    - Managed Image
    - Azure Compute Gallery
- **Other Features**
    - Added support for customers to use their own VNet.
    - Added support for customers to customize the build VM (VM size, OS disk size).
    - Added support for user assigned MSI (for customize/distribute steps).
    - Added support for [Gen2 images.](image-builder-overview.md#hyper-v-generation).

### Preview APIs

 The following APIs are deprecated, but still supported:
- 2019-05-01-preview


## Next steps
Learn more about [Image Builder](image-builder-overview.md).
