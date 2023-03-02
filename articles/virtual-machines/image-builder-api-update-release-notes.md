---
title: What's new in Azure VM Image Builder 
description: This article offers the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.
author: kof-f
ms.service: virtual-machines
ms.topic: conceptual
ms.workload: infrastructure
ms.date: 04/04/2022
ms.reviewer: erd
ms.subservice: image-builder
ms.custom: references_regions


---

# What's new in Azure VM Image Builder

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

This article contains all major API changes and feature updates for the Azure VM Image Builder service.

## API releases


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
