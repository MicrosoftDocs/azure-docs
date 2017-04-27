---
title: Download marketplace items from Azure | Microsoft Docs
description: I can download marketplace items from Azure to my Azure Stack deployment.
services: azure-stack
documentationcenter: ''
author: ErikjeMS
manager: byronr
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 03/01/2017
ms.author: erikje

---
# Download marketplace items from Azure to Azure Stack

As you decide what content to include in your Azure Stack marketplace, you should consider the content available from the Azure marketplace. You can download from a curated list of Azure marketplace items that have been pre-tested to run on Azure Stack. New items are frequently added to this list, so make sure check back for new content.

To download marketplace items, you must first [register Azure Stack with Azure](azure-stack-register.md). 

## Download
1. Sign in to the Azure Stack administrator portal (https://portal.local.azurestack.external) as a service administrator.
2. Some marketplace items can be very large.  Check to make sure you have enough space on your system by clicking **Resource Providers** > **Storage**.

    ![](media/azure-stack-download-azure-marketplace-item/image01.png)

3. Click **More Services** > **Marketplace Management**.

    ![](media/azure-stack-download-azure-marketplace-item/image02.png)

4. Click **Add from Azure** to see a list of items available for download. You can click on each item in the list to view its description and download size.

    ![](media/azure-stack-download-azure-marketplace-item/image03.png)

5. Select the item you want in the list and then click **Download**. This starts downloading the VM image for the item you selected. Download times vary.

    ![](media/azure-stack-download-azure-marketplace-item/image04.png)

6. After the download completes, you can deploy your new marketplace item as either a service administrator or tenant user. Click **+New**, search among the categories for the new marketplace item, and then select the item.
7. Click **Create** to open up the creation experience for the newly downloaded item. Follow the step-by-step instructions to deploy your item.

## Next steps

[Create and publish a Marketplace item](azure-stack-create-and-publish-marketplace-item.md)
