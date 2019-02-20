---
title: Seller Insights Release Notes | Microsoft Docs
description: Provides information on changes to the Seller Insights feature.
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
ms.date: 09/13/2018
ms.author: pbutlerm
---


Seller Insights release notes 
===============================
(Release date: July 28, 2018)

This article provides information on changes to the Seller Insights feature in the [Cloud Partner Portal](https://cloudpartner.azure.com/#insights).


Release highlights
------------------

-   *Estimated prices* provide a view of customer charges with currency conversion implications.
-   *Forecasted payouts* provide an earlier view into potential payouts.
-  *Usage reference identifiers* provide data fidelity between customer usage and orders with payouts
-   *Usage at a daily grain* provides more granularity and better insights into customer usage.


Changes to data structure and taxonomy
--------------------------------------

The following table lists the metrics that have been added or substantially changed with this release. 

| **New Term**                   |    **Definition**                                                             |
|--------------------------------|  ---------------------------------------------------------------------------- |
| Price (CC)                     | Price for a unit of usage for a given SKU (in the customer's currency).       |
| Estimated Extended Charge (CC) | Estimated extended charge for the quantity of units of usage for a given SKU (in the customer’s currency). This value may not be exact due to rounding or truncation errors.   |
| Publisher Currency (PC)        | Currency preferred by the publisher for payout.                               |
| Estimated Price (PC)           | Estimated price for a unit of usage for a given SKU based on foreign exchange conversion on the date usage is calculated (in the publisher’s currency). This value may not be exact due to rounding or truncation errors.   |
| Estimated Extended Charge (PC) | Estimated extended charge for the quantity of units of usage for a given SKU based on foreign exchange conversion on the date usage is calculated (in the publisher’s currency). This value may not be exact due to rounding or truncation errors. |
| Estimated Payout (PC)          | Estimated payment for the quantity of units of usage for a given SKU based on foreign exchange conversion on the date the usage is calculated (in the publisher’s currency). This value may not be exact due to rounding or truncation errors.   |
| Usage Reference                | The identifier for one or more days of customer usage for a given SKU associated with an entry in the payout report. |
|  |  |
