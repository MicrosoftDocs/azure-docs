---
title: What's new? Release notes - Azure Image Builder | Microsoft Docs 
description: Learn what is new with Azure Image Builder; such as the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.
author: kofiforson
ms.service: virtual-machines
ms.topic: conceptual
ms.workload: infrastructure
ms.date: 04/04/2022
ms.reviewer: erd
ms.subservice: image-builder
ms.custom: references_regions


---

# API Changelog + Features Updates

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

This document contains all major API changes and feature updates for the Azure Image Builder service.

## API Releases



<!-- ### February 2022

(not released to public yet) 

**Improvements**: 

- Validation Support. 
- Shell (Linux) - Script or Inline. 
- PowerShell (Windows) - Script or Inline, run elevated, run as system. 
- Source-Validation-Only mode .
- Customized staging resource group support.  , commenting this for now -->


### October 2021

**Breaking Change**:
 
Our October 2021 API introduces a change to the error schema that will be part of every future API release. Any customer that has automated our service needs to expect to receive a new error output when switching to 2021-10-01 or newer API versions (new schema shown below). We recommend that once customers switch to the new API version (2021-10-01 and beyond), they don't revert to older versions as they'll have to change their automation again to expect the older error schema. We do not anticipate changing the error schema again in future releases.

For API versions February 2020 and older, the error output will look like the following:

```
{ 
 "code": "ValidationFailed", 

  "message": "Validation failed: 'ImageTemplate.properties.source': Field 'imageId' has a bad value: '/subscriptions/subscriptionID/resourceGroups/resourceGroupName/providers/Microsoft.Compute//images//imageName'. Please review  http://aka.ms/azvmimagebuildertmplref  for details on fields requirements in the Image Builder Template." 
} 
```


For API versions October 2021 and newer, the error output will look like the following:

```
{ 

  "error": { 

    "code": "ValidationFailed", 

    "message": "Validation failed: 'ImageTemplate.properties.source': Field 'imageId' has a bad value: '/subscriptions/subscriptionID/resourceGroups/resourceGroupName/providers/Microsoft.Compute//images//imageName'. Please review  http://aka.ms/azvmimagebuildertmplref  for details on fields requirements in the Image Builder Template." 

  } 

} 
```

**Improvements**:

- Added support for Build VM MSIs. Learn more here: https://docs.microsoft.com/azure/virtual-machines/linux/image-builder-json#user-assigned-identity-for-the-image-builder-build-vm 
- Added support for Proxy VM size customization.

### February 2020

Swagger: https://msazure.visualstudio.com/One/_git/Compute-AzLinux-ImageBuilderRp?version=GBdevelop&path=/swagger/api/2020-02-14/imagebuilder.json

**Improvements:**

- Added support for creating images from the following sources:
    - Managed Image
    - Azure Artifact Gallery
    - Platform Image Repository (including Platform Image Purchase Plan)
- Added support for the following customizations:
    - Shell (Linux) - Script or Inline
    - PowerShell (Windows) - Script or Inline, run elevated run as system
    - File (Linux and Windows)
    - Windows Restart (Windows)
    - Windows Update (Windows) (with search criteria, filters, and update limit)
- Added support for the following distribution types:
    - Managed Image
    - Azure Artifact Glery Image Version (including replication and the ability to exclude from latest)
    - VHD
- Added support for customers to use their own VNet.
- Added support for customers to customize the build VM (VM size, OS disk size)
- Added support for user assigned MSI (for customize/distribute steps)

## Other Features

### November 2021

Added support for Gen2 images. Learn more here: https://docs.microsoft.com/azure/virtual-machines/image-builder-overview#hyper-v-generation