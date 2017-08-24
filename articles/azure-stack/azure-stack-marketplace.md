---
title: Publish a custom marketplace item in Azure Stack (cloud operator) | Microsoft Docs
description: As a cloud operator, learn how to publish a custom marketplace item in Azure Stack.
services: azure-stack
documentationcenter: ''
author: ErikjeMS
manager: byronr
editor: ''

ms.assetid: 60871cbb-eed2-433c-a76d-d605c7aec06c
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/21/2017
ms.author: erikje

---
# The Azure Stack Marketplace overview
The Marketplace is a collection of services, applications, and resources customized for Azure Stack, like networks, virtual machines, storage, Docker extensions, phpBB, and so on. Users come here to create new resources and deploy new applications. Think of it as a shopping catalog where users can browse and choose the items they want to use.

As a cloud operator, you decide which items to publish to your Azure Stack Marketplace. This makes the item visible to all your users. Only those users subscribed to appropriate offers can use any specific Marketplace item. You can add custom items that you create and download items from a growing [list of Azure Marketplace items](azure-stack-marketplace-azure-items.md). When you add an item to the Marektplace, users can see it within five minutes.

To open the Marketplace, click **New**.

![](media/azure-stack-publish-custom-marketplace-item/image1.png)

## Marketplace items
An Azure Stack Marketplace item is a service, application, or resource that your users can download and use. All Azure Stack Marketplace items are visible to all your users.

Every Marketplace item has:

* An Azure Resource Manager template for resource provisioning
* Metadata, like strings, icons, and other marketing collateral
* Formatting information to display the item in the portal

Every item published to the Marketplace uses a format called the Azure Gallery Package (azpkg). Add deployment or runtime resources (like code, zip files with software, or virtual machine images) to Azure Stack separately, not as part of the Marketplace Item. 

## Next steps
[Create and publish a marketplace item](azure-stack-create-and-publish-marketplace-item.md)

