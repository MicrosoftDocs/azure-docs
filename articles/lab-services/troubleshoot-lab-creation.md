---
title: Troubleshoot lab creation
titleSuffix: Azure Lab Services
description: Learn how to resolve common issues with creating a lab in Azure Lab Services.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: troubleshooting
ms.date: 01/19/2023
---

# Troubleshoot lab creation in Azure Lab Services

In this article, you learn how to resolve common issues with creating a lab in Azure Lab Services.

## You can't see a virtual machine image

Possible issues:

- The Azure Compute Gallery is not connected to the lab plan. To connect an Azure Compute Gallery, see [Attach or detach a compute gallery](./how-to-attach-detach-shared-image-gallery.md).

- The image is not enabled by the administrator. This applies to both Marketplace images and Azure Compute Gallery images. To enable images, see [Specify marketplace images for labs](specify-marketplace-images.md).

- The image in the attached Azure Compute Gallery is not replicated to the same location as the lab plan. For more information, see [Store and share images in an Azure Compute Gallery](../virtual-machines/shared-image-galleries.md).

- Image sizes greater than 127GB or with multiple disks are not supported.

## The preferred virtual machine size is not available

Possible issues:

- A quota is not yet requested or you need to request more quota. To request quota, see [Request a limit increase](capacity-limits.md#request-a-limit-increase).

- A quota is granted in a location other than what is enabled for the selected lab plan. For more information, see [Request a limit increase](capacity-limits.md#request-a-limit-increase).

>[!NOTE]
> You can run a script to query for lab quotas across all your regions. For more information, see the [PowerShell Quota script](https://aka.ms/azlabs/scripts/quota-powershell).

## You don't see multiple regions/locations to choose from

Possible issues:

- The administrator only enabled one region for the lab plan. To specify regions, see [Configure regions for labs](create-and-configure-labs-admin.md).

- Lab plan uses advanced networking. The lab plan and all labs must be in the same region as the network. For more information, see [Use advanced networking](how-to-connect-vnet-injection.md).

## Next steps

For more information about setting up and managing labs, see:

- [Manage lab plans](how-to-manage-lab-plans.md)  
- [Lab setup guide](setup-guide.md)