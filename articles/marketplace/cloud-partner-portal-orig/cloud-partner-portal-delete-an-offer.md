---
title: Delete an offer or SKU from Azure Marketplace | Microsoft Docs
description: Steps for deleting an offer or SKU.
services: Azure, Marketplace, Cloud Partner Portal, 
documentationcenter:
author: dan-wesley
manager: Patrick.Butler  
editor:

ms.assetid: 
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: conceptual
ms.date: 09/13/2018
ms.author: pbutlerm
---


Delete an offer or SKU from Azure Marketplace
==========================================

For various reasons, you may decide to remove your offer from the
Marketplace. Offer Removal ensures that new customers may no longer
purchase or deploy your offer, but has no impact on existing customers.
Offer Termination is the process of terminating the service and/or
licensing agreement between you and your existing customers. Guidance
and policies related to offer removal and termination are governed by
[Microsoft Marketplace Publisher
Agreement](http://go.microsoft.com/fwlink/?LinkID=699560) (see Section
7) and the [Participation
Policies](https://azure.microsoft.com/support/legal/marketplace/participation-policies/)
(see Section 6.2). This article talks about the different supported
delete scenarios and the steps you can take for them.

Delete a live SKU from Azure Marketplace
----------------------------------------

You can delete a live SKU from Azure Marketplace using the following steps:

1.  Sign in to the [Cloud Partner
    Portal](https://cloudpartner.azure.com/).

2.  Select your offer from the **All offers** tab.

3.  In the pane on the left side of the screen, select the **SKUs** tab.

4.  Select the SKU that you want to delete and click on the delete
    button for that SKU.

5.  [Republish](./cloud-partner-portal-make-offer-live-on-Azure-Marketplace.md)
    the offer to Azure Marketplace.

After the offer is live on Azure Marketplace, the SKU will be deleted
from Azure Marketplace and Azure portal.

Roll back to a previous SKU version
----------------------------------

You can delete the current version of a live SKU from Azure Marketplace
by following the steps here. When the process is complete, the SKU will
be rolled back to its previous version.

1.  Sign in to the [Cloud Partner
    Portal](https://cloudpartner.azure.com/).

2.  Select your offer from the **All offers** tab.

3.  In the pane on the left side of the screen, select the **SKUs** tab.

4.  Delete the latest **Disk Version** from the list of published disk versions.

5.  [Republish](./cloud-partner-portal-make-offer-live-on-Azure-Marketplace.md)
    the offer to Azure Marketplace.

After the offer is live in Azure Marketplace, the current version of the
listed SKU will be deleted from Azure Marketplace and the Azure portal.
The SKU will be rolled back to its previous version.

Delete a live offer
-------------------

There are various aspects that need to be taken care of in case of a
request to remove a live offer. Please follow the steps below to get
guidance from the support team to remove a live offer from Azure
Marketplace:

1.  Raise a support ticket using this
    [link](https://go.microsoft.com/fwlink/?linkid=844975), or by
    clicking Support in the upper right corner of CLoud Partner Portal.

2.  Select your specific offer type in the **Problem type** list and
    **Remove a published offer** in the **Category** list.

3.  Submit the request.

The support team will guide you through the offer deletion process.

>[!NOTE]
>Deleting a SKU/offer will not affect current purchases of
the SKU/offer. These SKUs/offers will continue to work as before. However, they won't be available for any new purchases going forward.
