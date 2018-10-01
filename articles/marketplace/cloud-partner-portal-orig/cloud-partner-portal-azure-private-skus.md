---
title: Private SKUs | Microsoft Docs
description: How to use private SKUs to manage the offer availability.
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

Private SKUs
============

Private SKUs enable you to restrict the availability of SKUs to specific
customers. When a SKU is marked private, it's not available in any
public catalog including on [Azure
Marketplace](http://azuremarketplace.microsoft.com) and the [Azure
portal](http://portal.azure.com). On the Azure portal, only customers
with access to the SKU can see it. Additionally, they would also be
prompted that they have access to private offers.

>[!NOTE]
>Private SKUs must have new unique SKU/Plan Ids to avoid any
conflict with your public SKUs.

You can use private SKUs to handle the following scenarios:

1.  Publish software that you want only available publicly to specific
    customers and not publicly available.
2.  Publish variations of public software at a customized price for
    specific customers.
3.  Publish variations of public software with a customized description
    and terms (via new offer).

If you only want to change the price, you can reuse the disks from
another SKU in the same offer. With private SKUs, you don't have to resubmit disks across SKUs.

Mark a SKU Private
---------------------

To mark a SKU as private, toggle the option asking if the SKU is
private:

![Mark a SKU as private](./media/cloud-partner-portal-publish-virtual-machine/markingskuprivate.png)

You can reuse the disks in another SKU and modify the pricing or the description. To reuse the disks, select **Yes** as a response to the "Does this SKU re-use images from a public SKU" prompt.

If the SKU is marked as private and the offer has other SKUs with
reuseable disks, you are required to indicate that the SKU reuses disks
from another SKU. You are also required to specify the target
audience for the private SKU.

>[!NOTE]
>After it's published, a public SKU can't be made private.

Select an image
------------------

You can provide new disks for the private SKU or reuse the same disks already provided in another SKU, only modifying the pricing or description. To reuse the disks, select **Yes**  as a response to the "Does this SKU re-use image from a public SKU" prompt.

![Indicate image re-use](./media/cloud-partner-portal-publish-virtual-machine/selectimage1.png)

After you confirm that the SKU reuses images from another SKU, you identify the SKU that's the source of the images.

The prompts in the next screen capture show how to identify the private SKU would reuse the images from the
selected SKU:

![Select an image](./media/cloud-partner-portal-publish-virtual-machine/selectimage2.png)

When you publish the offer, the images from the selected SKU would be
made available under the private SKU ID with the custom rates/terms. The
private SKU would only be visible to the targeted audience.

For image updates, you would only be required to update the underlying
SKU's image. Behind the scenes, the image for the private SKU will also
be updated automatically. Similarly, if you delete the image from the
underlying SKU, the image would also be removed from the private SKU.

Restricting the Audience
------------------------

Private offers can be found and deployed only by targeted users.
Currently we support targeting users using subscription Ids.

These subscriptions can be entered via a manual entry form **for up to
10 subscriptions**, or by uploading a CSV file, which allows **for up to
20,000 subscriptions**.

Manual Entry for restricted audience:

![Manually restrict audience](./media/cloud-partner-portal-publish-virtual-machine/restrictaudience1.png)

CSV Upload for restricted audience:

![Use CSV to restrict audience](./media/cloud-partner-portal-publish-virtual-machine/restrictaudience2.png)

Sample CSV file content:

            Type,Id,Description
            SubscriptionId,7738d703-3135-4e8d-8b81-1e70379abd9d,Private Customer

When you switch from manual entry to CSV upload view or from CSV to
manual entry, the old list of subscription Ids with access to the SKU is
not retained. A warning is displayed and the list is only overwritten
upon saving the offer.

Previewing Private Offers
-------------------------

During the preview/staging step, only the offer level preview
subscriptions will be able to access the SKU. This is the testing stage
at which time you can validate what the offer would look like to your
targeted customers, and is standard for all types of publishing.

Offer Level Preview Subscriptions to access staged offers:

![Preview Subscription Ids](./media/cloud-partner-portal-publish-virtual-machine/previewoffer1.png)

After the offer is live, only the restricted audience subscriptions
(entered via manual entry or CSV) will be able to view and deploy the
private SKU. We recommend that you **always include your own
subscriptions in the restricted audience** for the private SKU for
validation purposes.

>[!NOTE]
>For debugging purposes, Microsoft support and engineering
teams will also have access to these private offers.
