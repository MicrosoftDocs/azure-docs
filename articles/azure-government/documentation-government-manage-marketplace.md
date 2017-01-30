---
title: Azure Government Marketplace | Microsoft Docs
description: This provides a comparison of features and guidance on developing applications for Azure Government.
services: azure-government
cloud: gov
documentationcenter: ''
author: VybavaRamadoss
manager: asimm

ms.assetid: b4ffa6c1-30c9-4aef-8938-10326e9f7d1e
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 11/14/2016
ms.author: vybavar

---
# Azure Marketplace for Government
The Azure Marketplace is available for Azure Government with an updated list of images from our marketplace publishers. 

## Variations
Below are some considerations when using Azure Marketplace for Government:

* Only Bring Your Own License (BYOL) images are available. You cannot access any images that require purchase transaction through Azure Marketplace
* Only a subset of images is currently available as compared to the public marketplace. You can find the list of available images [here](../azure-government-image-gallery.md) 
* Before provisioning an image, your Enterprise Administrator must enable Marketplace purchases for your Azure subscription
  * Log in to the Portal as an Enterprise Administrator
  * Navigate to *Manage*
  * Under *Enrollment Details* click the pencil icon next to the *Azure Marketplace* line item
  * Toggle *Enabled/Disabled* as appropriate
  * Click *Save*

> [!NOTE]
> If you are interested in making your images available in Azure Government please refer to [partner onboarding guidelines](documentation-government-manage-marketplace-partners.md) for more information.
> 
> 

### Step 1
Launch the Marketplace

![alt text](./media/government-manage-marketplace-launch.png)  

### Step 2
Browse through different products to find the right one.

The marketplace publisher provides a list of certifications as part of the product description to help you make the right choice. 

![alt text](./media/government-manage-marketplace-service.png)

### Step 3
Choose an product\image

![alt text](./media/government-manage-marketplace-image.png)

### Step 4
Launch the create flow and enter the required parameters for deployment

![alt text](./media/government-manage-marketplace-deployment.png)

> [!NOTE]
> In the Location dropdown, only Azure Government locations are visible
> 
> 

### Step 5
Observe pricing

![alt text](./media/government-manage-marketplace-pricing.png)

### Step 6
Complete all steps and click Ok to start the provisioning process

## Next steps
For supplemental information and updates, subscribe to the [Microsoft Azure Government Blog](https://blogs.msdn.microsoft.com/azuregov/).

