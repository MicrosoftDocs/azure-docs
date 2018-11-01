---
title: Update an existing offer for Azure Marketplace | Microsoft Docs
description: Explains how to update an existing Azure Marketplace offer using the Cloud Partner Portal.
services: Azure, Marketplace, Cloud Partner Portal, 
documentationcenter:
author: v-miclar
manager: Patrick.Butler  
editor:

ms.assetid: 
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: conceptual
ms.date: 09/18/2018
ms.author: pbutlerm
---

Update an existing offer for Azure Marketplace
==============================================

There are various kinds of updates you can apply to your offer once
it’s gone live.   The [Cloud Partner Portal](https://cloudpartner.azure.com/) 
has several features to assist you in editing an offer to ensure the changes are correct, including:

-  Adding new virtual machine (VM) image version to an existing SKU
-  Change regions a SKU is available in
-  Adding new SKUs
-  Updating marketplace metadata for offers or SKUs 
-  Updating pricing on pay-as-you-go offers
-  Comparing features
-  History of features

After you modify an offer or SKU, it must be republished before the changes go live.
This article walks you through the different aspects of updating your VM offer.


Unpermitted changes to VM offer/SKU
-----------------------------------

There are some attributes of a VM offer or SKU that cannot be modified once the
offer is live in Azure Marketplace.

-  Offer ID and Publisher ID of the offer.
-  SKU ID of existing SKUs.
-  Data disk count of existing SKUs.
-  Billing/License model changes to existing SKUs.


Updating the VM image version for a SKU
---------------------------------------

The VM image for a SKU of your offer may have been updated with additional
features, security patches, etc. Under such scenarios, you may want to update
the VM image that your SKU references. Use the following steps to update a 
VM image. 

1.  Log in to the [Cloud Partner Portal](https://cloudpartner.azure.com/).
2.  Under **All offers**, find the offer you would like to update.
3.  Under the **SKUs** form, click on the SKU whose VM image you would like to
    update.
4.  Under **Disk version**, click on **+New Disk Version** to add a new VM image.
5.  Provide the new VM Images **Disk version**. The disk version needs to follow
    the [semantic version](http://semver.org/) format. Versions should be of the
    form X.Y.Z, where X, Y, and Z are integers. Make sure that the new version
    you provide is greater than the previous versions, else the new version number
    will not show up in Azure portal or Azure marketplace upon republish.
6.  For **OS VHD URL**, enter the shared access signature (SAS) URI created for the
    operating system VHD. Note that data disk count cannot change between
    different versions of the SKU. If previous versions had data disks
    configured, this new version must also have the data disks configured.
7.  Click on **Publish** to kick off the publish workflow to get your new VM
    version to go live onto Azure marketplace and Azure portal.


Changing regions a SKU is available in
--------------------------------------

Over time, you may want to make your offer/SKU available in more regions.
Alternatively, you may want to stop supporting the offer/SKU in a given region.
To implement these changes, follow the steps below.

1.  Log in to the [Cloud Partner Portal](https://cloudpartner.azure.com/).
2.  Under **All offers** find the offer you would like to update.
3.  Under the **SKUs** form, click on the SKU whose region availability you would
    like to update.
4.  Click on the **Select Countries** button under the **Country/Region
    availability** field.
5.  In the region availability pop-up, add/remove the regions you want for this
    SKU.
6.  Click on **Publish** to kick off the publish workflow to update your SKUs
    region availability.

If a SKU is being made available in a new region, you will have the ability to
specify pricing for that particular region via the **Export Pricing Data**
functionality. If you are adding a region back that was once available
before, you will not be able to update its pricing since pricing changes are not
permitted.


Adding a new SKU
----------------

To make a new SKU available for your existing offer, follow the below steps.

1.  Log in to the [Cloud Partner Portal](https://cloudpartner.azure.com/).
2.  Under **All offers** find the offer you would like to update.
3.  Under the **SKUs** form, clik on **Add new SKU** and provide a **SKU ID** in
    the pop-up.
4.  Follow the rest of the steps detailed in [Publish a virtual machine to Azure Marketplace](./cloud-partner-portal-publish-virtual-machine.md).
5.  Click on **Publish** to kick off the publish workflow to have your new SKU
    go live.


Updating offer marketplace metadata.
------------------------------------

You may have scenarios where you need to update the marketplace metadata
associated with your offer like updating your company logos, etc. Use the
following steps to update your offer's metadata.

1.  Log in to the [Cloud Partner Portal](https://cloudpartner.azure.com/).
2.  Under **All offers** find the offer you would like to update.
3.  Goto the **Marketplace** form and follow the instructions here to make any
    changes.
4.  Click on **Publish** to kick off the publish workflow to have your changes
    go live.


Updating Pricing on Published Offers
------------------------------------

Once your pay-as-you-go offer is published, you cannot increase the price of an
existing SKU, but you can create a new SKU under the same offer, delete the old
SKU, and then republish your offer. We also do allow you to decrease the price
on already published offers. To decrease your offer price:

1.  Click on the SKU for which you want to decrease pricing.
2.  If you have set the pricing in the 1x1 GUI, you can change the price
    directly in the UI. If you set pricing via import/export spreadsheet, you
    can only decrease prices via import/export feature.
3.  Click **Save**.
4.  Republish your offer and go live.

The pricing will be visible to new customers once it is completely live on the
website, and all new customers will pay the new decreased price.

For existing customers, the price decrease will be reflected retroactively to
the start of the billing cycle during which the price decrease became effective.
If they have already been billed for the cycle during which a price decrease
occurred, they will receive a refund during their next billing cycle to cover
the decreased price.


Simplified Currency Pricing
---------------------------

Starting September 2018, a new section called **Simplified Currency
Pricing** would be visible to you. Microsoft is streamlining the Azure
Marketplace business by enabling more predictable pricing and collections from
your customers across the world. This streamlining will be achieved by reducing the number of
currencies in which we invoice your customers.

The new section will take pricing in these new currencies. Once all customers
have been migrated to these new settlement currencies, the original pricing
section will be retired and only the “Simplified Currency Pricing” section will
remain.

You will have until November 1, 2018 to set a new price for the regions wherein the
settlement currency is changing. You will not be able to increase the price for
regions wherein the settlement currency is not changing. The following are the
regions wherein the currency is changing:

| Country                  | ISO2 Code | Simplified Billing Currency |
|--------------------------|-----------|-----------------------------|
| **Algeria**              | DZ        | USD                         |
| **Argentina**            | AR        | USD                         |
| **Bahrain**              | BH        | USD                         |
| **Belarus**              | BY        | USD                         |
| **Brazil**               | BR        | BRL                         |
| **Bulgaria**             | BG        | EUR                         |
| **Chile**                | CL        | USD                         |
| **Colombia**             | CO        | USD                         |
| **Costa Rica**           | CR        | USD                         |
| **Croatia**              | HR        | EUR                         |
| **Czech Republic**       | CZ        | EUR                         |
| **Egypt**                | EG        | USD                         |
| **Guatemala**            | GT        | USD                         |
| **Hong Kong**            | HK        | USD                         |
| **Hungary**              | HU        | EUR                         |
| **Iceland**              | IS        | EUR                         |
| **Indonesia**            | ID        | USD                         |
| **Israel**               | IL        | USD                         |
| **Jordan**               | JO        | USD                         |
| **Kazakhstan**           | KZ        | USD                         |
| **Kenya**                | KE        | USD                         |
| **Kuwait**               | KW        | USD                         |
| **Liechtenstein**        | LI        | EUR                         |
| **Macedonia (FYRO)**     | MK        | USD                         |
| **Malaysia**             | MY        | USD                         |
| **Mexico**               | MX        | USD                         |
| **Montenegro**           | ME        | USD                         |
| **Morocco**              | MA        | USD                         |
| **Nigeria**              | NG        | USD                         |
| **Oman**                 | OM        | USD                         |
| **Pakistan**             | PK        | USD                         |
| **Paraguay**             | PY        | USD                         |
| **Peru**                 | PE        | USD                         |
| **Philippines**          | PH        | USD                         |
| **Poland\***             | PL        | EUR                         |
| **Qatar**                | QA        | USD                         |
| **Romania**              | RO        | EUR                         |
| **Saudi Arabia**         | SA        | USD                         |
| **Serbia**               | RS        | USD                         |
| **Singapore**            | SG        | USD                         |
| **South Africa**         | ZA        | USD                         |
| **Thailand**             | TH        | USD                         |
| **Trinidad and Tobago**  | TT        | USD                         |
| **Tunisia**              | TN        | USD                         |
| **Turkey**               | TR        | USD                         |
| **Ukraine**              | UA        | USD                         |
| **United Arab Emirates** | AE        | USD                         |
| **Uruguay**              | UY        | USD                         |
|  |  |  |

> [!NOTE]
> If you use APIs to publish your offer, you could see a new section within
the offer named **JSON**. This would be annotated as `virtualMachinePricingV2` or
`monthlyPricingV2`, depending upon the type of offer.

If you have any questions around this change, contact Azure Marketplace
Support.


Compare Feature
---------------

When you make changes on an already published offer, you can use the
*Compare* feature to audit the changes that have been made. To utilize Compare:

1.  At any point in the editing process, you can click the **Compare** button for
    your offer.

2.  View side-by-side versions of marketing assets and metadata.


History of Publishing Actions
-----------------------------

To view any historical publishing activity, click on the **History** tab in the
left nav of Cloud Partner Portal. Here you will be able to view timestamped
actions that have been taken during the lifetime of your Azure Marketplace
offers.
