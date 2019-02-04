---
title: Offer settings for a Power BI App offer - Azure Marketplace | Microsoft Docs
description: Configure offer settings for a Power BI App offer for the Microsoft AppSource Marketplace. 
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

# Power BI Apps Offer Settings tab

The **New Offer** page for service apps opens in the first tab named **Offer Settings**.  You will provide the primary identifiers and name for your offer in this tab.  An appended asterisk (*) on the field name indicates that it is required.

![Offer Settings tab](./media/offer-settings-tab.png)


## Offer settings fields 

In the **Offer Settings** tab, you must provide the following required fields.

|  Field        |  Description                                                               |
|---------------|----------------------------------------------------------------------------|
| **Offer ID**  | A unique identifier (within a publisher profile) for the offer. This identifier will be visible in product URLs, Resource Manager templates, and billing reports. It has a maximum length of 50 characters, can only be composed of lowercase alphanumeric characters and dashes (-), but cannot end in a dash. This field cannot be changed after an offer goes live. For example, if Contoso publishes an offer with offer ID `sample-SvcApp`, it is assigned the AppSource URL `https://appsource.microsoft.com/marketplace/apps/contoso.sample-SvcApp`.      |
| **Publisher** | Your organization's unique identifier in [AppSource](https://appsource.microsoft.com). All your offerings should be associated with your publisher ID. This value cannot be modified once the offer is saved.                         |
| **Name**      | Display name for your offer. This name will display in AppSource and in the Cloud Partner Portal. It can have a maximum of 50 characters. Guidance here is to include a recognizable brand name for your product. Don’t include your organization's name here unless that is how the app is marketed. If you are marketing this offer in other websites and publications, ensure that the name is the same across all publications.    <br/>If you release an offer during the preview period of Power BI Apps, preview mode, append the string `(Preview)` to your application’s name, for example `Sample Scv App (Preview)`. |
|     |     |


## Next steps

In the next tab, you will specify [Technical Info](./cpp-technical-info-tab.md) for your offer.
