---
title: Azure and Dynamics 365 consulting service offer - Define offer settings | Microsoft Docs
description: Guide for defining offer settings in an Azure or Dynamics 365 consulting service offer in the Cloud Partner Portal.
services: Azure, Marketplace, Cloud Partner Portal, 
documentationcenter:
author: qianw211
manager: Patrick.Butler  
editor:

ms.assetid: 
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: conceptual
ms.date: 11/30/2018
ms.author: pbutlerm
---

# Offer settings tab

On the **New Offer** screen, the first step is to create the offer identity. The offer identity consists of three parts: **Offer ID**, **Publisher ID**, and **Name**. Each of these parts is covered in the following sections.

![Creating a new consulting service offer - Offer settings tab](media/consultingoffer-settings-tab.png)

*Offer ID*

This identifier is a unique name you create when you first submit the offer. It must consist only of lowercase alphanumeric characters, dashes, or underscores. The **Offer ID** will be visible in the URL and impacts search engine results. For example, *yourcompanyname_exampleservice*

As shown in the example, the **offer ID** gets appended to your publisher ID to create a unique identifier. This is exposed as a permanent link that can be booked and is indexed by the search engines.

*After an offer is live, its identifier can't be updated*

*Publisher ID*

This identifier is related to your account. When you are logged in with your organizational account, your **Publisher** ID will show up in the dropdown menu.

*Name*

This string is what will display as the offer name on AppSource or Azure Marketplace. The *name* field is limited to 50 characters.  The reviewer may need to edit your title to allow for appending the offer name with the duration and offer type.

>[!Note]
>Important: Only enter the name of the actual service here. Do not include duration and type of service.

The following example by Edgewater Fullscope shows how the offer name is assembled. The offer name appears as:

![Creating a new consulting service offer](media/cppsampleconsultingoffer.png)

The Offer name is comprised of four parts:

-   **Duration:** - defined in the **Storefront Details** tab of the
    editor. Duration can be expressed in hours, days, or weeks.
-   **Type of service:** - defined in the **Storefront Details** tab
    of the editor. Types of services are `Assessment`, `Briefing`,
    `Implementation`, `Proof of concept`, and `Workshop`.
-   **Preposition:** - inserted by the reviewer
-   **Name:** - defined in the **Offer Settings** page.

>[!Note]
>The name field is limited to 50 characters. The name you submit may need to be edited by the reviewer 
to allow for the duration and offer type to be appended to the name.

The following list provides several well-named offer names:

-   Essentials for Professional Services: 1-Hr Briefing
-   Cloud Migration Platform: 1-Hr Briefing
-   PowerApps and Microsoft Flow: 1-Day Workshop
-   Azure Machine Learning Services: 3-Wk PoC
-   Brick and Click Retail Solution: 1-Hr Briefing
-   Bring your own Data: 1-Wk Workshop
-   Cloud Analytics: 3-Day Workshop
-   Power BI Training: 3-Day Workshop
-   Sales Management Solution: 1-Week Implementation
-   CRM QuickStart: 1-Day Workshop
-   Dynamics 365 for Sales: 2-Day Assessment

After you have completed the **Offer Settings** tab, you can save your
submission. The offer name will now appear above the editor, and you can
find it back in All Offers.

**Next steps**

Now you can enter [Storefront details and determine whether to publish in Azure Marketplace or in AppSource](./cpp-consulting-service-storefront-details.md).