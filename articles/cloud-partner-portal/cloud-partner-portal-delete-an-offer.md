---
title: Delete an offer from Azure Marketplace | Microsoft Docs
description: This article gives gives details around deleting an offer from Azure Marketplace
services: cloud-partner-portal
documentationcenter: ''
author: anuragdalmia
manager: hamidm

ms.robots: NOINDEX, NOFOLLOW
ms.service: cloud-partner-portal
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/22/2017
ms.author: andalmia

---
# Delete an offer/SKU from Azure Marketplace

For various reasons, you may decide to remove your offer from the Marketplace.  Offer Removal ensures that new customers may no longer purchase or deploy your offer, but has no impact on existing customers. Offer Termination is the process of terminating the service and/or licensing agreement between you and your existing customers.  Guidance and policies related to offer removal and termination are governed by [Microsoft Marketplace Publisher Agreement](http://go.microsoft.com/fwlink/?LinkID=699560) (see Section 7) and the [Participation Policies](https://azure.microsoft.com/support/legal/marketplace/participation-policies/) (see Section 6.2).   This article talks about the different supported delete scenarios and the steps you can take for them.

## Delete a live SKU from Azure Marketplace

You can delete a live SKU from Azure Marketplace by following these steps:

1.  Sign in to the [Cloud Partner Portal](https://cloudpartner.azure.com/).

2.  Select your offer from the **All offers** tab.

3.  In the pane on the left side of the screen, select the **SKUs** tab.

4.  Select the SKU which you want to delete and click on the delete button for that SKU.

5.  [Republish](./Cloud-partner-portal-make-offer-live-on-Azure-Marketplace.md) the offer to Azure Marketplace.

After the offer is live on Azure Marketplace, the SKU will be deleted from Azure Marketplace and Azure portal.

## Rollback to a previous SKU version

You can delete the current version of a live SKU from Azure Marketplace by following the steps here. When the process is complete, the SKU will be rolled back to its previous version.

1.  Sign in to the [Cloud Partner Portal](https://cloudpartner.azure.com/).

2.  Select your offer from the **All offers** tab.

3.  In the pane on the left side of the screen, select the **SKUs** tab.

4.  Delete the latest **Disk Version** from the list of published disk versions.

5.  [Republish](./Cloud-partner-portal-make-offer-live-on-Azure-Marketplace.md) the offer to Azure Marketplace.

After the offer is live in Azure Marketplace, the current version of the listed SKU will be deleted from Azure Marketplace and the Azure portal. The SKU will be rolled back to its previous version.

## Delete a live offer

There are various aspects that need to be taken care of in case of a request to remove a live offer. Please follow the steps below to get guidance from the support team to remove a live offer from Azure Marketplace:

1.  Raise a support ticket using this [link](https://go.microsoft.com/fwlink/?linkid=844975)

2.  Select **Managing offers** in the **Problem type** list and **Modifying an offer and/or SKU already in production** in the **Category** list.

3.  Submit the request

The support team will guide you through the offer deletion process.

Note that deletion of a SKU/offer will not affect current purchases of the SKU/offer already made. Those will continue to work as before. They will not be available for any new purchases going forward.  