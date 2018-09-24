---
title: Publish a custom marketplace item in Azure Stack (cloud operator) | Microsoft Docs
description: As an Azure Stack operator, learn how to publish a custom marketplace item in Azure Stack.
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila
editor: ''

ms.assetid: 60871cbb-eed2-433c-a76d-d605c7aec06c
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/12/2018
ms.author: sethm
ms.reviewer: jeffgo

---
# The Azure Stack Marketplace overview

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

The Marketplace is a collection of services, applications, and resources customized for Azure Stack. Resources include networks, virtual machines, storage, and so on. Users come here to create new resources and deploy new applications. Think of it as a shopping catalog where users can browse and choose the items they want to use. To use a Marketplace item, users must subscribe to an offer that grants them access to the item.

As an Azure Stack operator, you decide which items to add (publish) to the Marketplace. You can publish things like databases, App Services, and so on. Publishing makes them visible to all your users. You can publish custom items that you create. You can also publish items from a growing [list of Azure Marketplace items](azure-stack-marketplace-azure-items.md). When you publish an item to the Marketplace, users can see it within five minutes.

> [!Caution]  
> All gallery item artifacts known as images and json files are accessible without authentication after making them available in the Azure Stack marketplace. For more considerations when publishing custom marketplace items, see [Create and publish a Marketplace item](azure-stack-create-and-publish-marketplace-item.md).

To open the Marketplace, in the admin console select **+ Create a resource**.

![](media/azure-stack-publish-custom-marketplace-item/image1.png)

## Marketplace items
An Azure Stack Marketplace item is a service, application, or resource that your users can download and use. All Azure Stack Marketplace items are visible to all your users, including administrative items like plans and offers. These items don't require a subscription to view, but are non-functional to users.

Every Marketplace item has:

* An Azure Resource Manager template for resource provisioning
* Metadata, like strings, icons, and other marketing collateral
* Formatting information to display the item in the portal

Every item published to the Marketplace uses the Azure Gallery Package (.azpkg) format. Add deployment or runtime resources (like code, zip files with software, or virtual machine images) to Azure Stack separately, not as part of the Marketplace item. 

With version 1803 and later, Azure Stack converts images to sparse files when they download from Azure or when you upload custom images. This process adds time when adding an image, but saves space and speeds up the deployment of those images. Conversion only applies to new images.  Existing images are not changed. 

## Next steps
[Download Marketplace items](azure-stack-download-azure-marketplace-item.md)  
[Create and publish a Marketplace item](azure-stack-create-and-publish-marketplace-item.md)

