---
title: Overview of customized images in Azure Update Manager
description: This article describes customized image support, how to register and validate customized images for public preview, and limitations.
ms.service: azure-update-manager
author: snehasudhirG
ms.author: sudhirsneha
ms.date: 09/27/2023
ms.topic: conceptual
---

# Manage updates for customized images

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

This article describes customized image support, how to enable a subscription, and limitations.

## Asynchronous check to validate customized image support

If you're using Azure Compute Gallery (formerly known as Shared Image Gallery) to create customized images, you can use Update Manager operations such as **Check for updates**, **One-time update**, **Schedule updates**, or **Periodic assessment** to validate if the VMs are supported for guest patching. If the VMs are supported, you can begin patching.

With marketplace images, support is validated even before Update Manager operation is triggered. Here, there are no preexisting validations in place and the Update Manager operations are triggered. Only their success or failure determines support.

For instance, an assessment call attempts to fetch the latest patch that's available from the image's OS family to check support. It stores this support-related data in an Azure Resource Graph table, which you can query to see the support status for your Azure Compute Gallery image.


## Limitations

Currently, it's only applicable to Azure Compute Gallery (SIG) images and not to non-Azure Compute Gallery custom images. The Azure Compute Gallery images are of two types: generalized and specialized. The following supported scenarios are for both types.

| Images | Currently supported scenarios | Unsupported scenarios |
|--- | --- | ---|
| Azure Compute Gallery: Generalized images | - On-demand assessment </br> - On-demand patching </br> - Periodic assessment </br> - Scheduled patching | Automatic VM guest patching | 
| Azure Compute Gallery: Specialized images | - On-demand assessment </br> - On-demand patching | - Periodic assessment </br> - Scheduled patching </br> - Automatic VM guest patching | 
| Non-Azure Compute Gallery images (non-SIG) | None | - On-demand assessment </br> - On-demand patching </br> - Periodic assessment </br> - Scheduled patching </br> - Automatic VM guest patching |

Automatic VM guest patching doesn't work on Azure Compute Gallery images even if Patch orchestration mode is set to `Azure orchestrated/AutomaticByPlatform`. You can use scheduled patching to patch the machines and define your own schedules.

## Next steps

[Learn more](support-matrix.md) about supported operating systems.
