---
title: Create a Power BI Application offer - Azure Marketplace | Microsoft Docs
description: How to create a Power BI App offer for the Microsoft AppSource Marketplace. 
services: Azure, AppSource, Marketplace, Cloud Partner Portal, Power BI
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
ms.date: 01/29/2019
ms.author: pbutlerm
---

# Create a Power BI Application offer

This section lists the steps required to create a new Power BI App offer for [AppSource](https://appsource.microsoft.com). Every offer appears as its own entity in AppSource.  When you create a new offer in the [Cloud Partner Portal](https://cloudpartner.azure.com/), you are required to supply four groups of assets for your offer.

|   Asset group      | Description                                                                         |
| ----------------   | ----------------                                                                    |
| Offer Settings     | Primary identifications and name for the offer                                      |
| Technical Info     | Installer URL used to install the app in client’s Power BI workspace. For more info on how to generate this URL, refer to [Power BI App documentation](https://go.microsoft.com/fwlink/?linkid=2028636).   |
| Storefront details | Contains marketing, legal and lead management assets. Marketing assets include offer description and logos.  Legal assets include a privacy policy, terms of use, and other legal documentation.  Lead management policy enables you to specify how to handle leads from the AppSource end-user portal. |
| Contacts           | Contains support contact and policy information                                     |
|    |     |


## New Offer form

Once your sign into the Cloud Partner Portal, click the **+ New Offer** item on the left menubar.  In the resulting menu, click on **Power BI Apps** to display the **New Offer** form and start the process of defining assets for a new app offer.

![Power BI offer menu item](./media/new-offer-menu.png)

> [!WARNING] 
> If the **Power BI Apps** option is not shown or is not enabled, then your account does not have permission to create this offer type. Please check that you have met all the [prerequisites](./cpp-prerequisites.md) for this offer type, including registering for a developer account.


## Next steps

The subsequent articles in this section mirror the tabs in the **New Offer** page (for a Power BI App offer type). Each article explains how to use the associated tab to define the asset groups and supporting services for your new app offer.

-  [Offer Settings tab](./cpp-offer-settings-tab.md)
-  [Technical info tab](./cpp-technical-info-tab.md)
-  [Storefront details tab](./cpp-storefront-details-tab.md)
-  [Contacts](./cpp-contacts-tab.md)
