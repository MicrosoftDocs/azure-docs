---
title: How to update an existing offer | Microsoft Docs
description: This article gives gives details around updating an existing offer via the cloud partner portal
services: cloud-partner-portal
documentationcenter: ''
author: andalmia
manager: hamidm

ms.service: cloud-partner-portal
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/22/2017
ms.author: anuragdalmia

---
If you would like to update your offer that’s available in Azure Marketplace, you need to update your offer in the [Cloud Partner Portal](https://cloudpartner.azure.com/) and re-publish. This article walks you through the different aspects of updating your VM offer.

Making updates to Offer Settings
================================

The only field available to make updates to is the Name field. Offer ID and Publisher ID cannot be changed once an offer has been published.

![offer settings][1]

Making updates to SKUs
======================

Following are some of the fields that you cannot modify once an offer/SKU has been published.

1.  SKU ID

2.  Open Ports

3.  Data Disk count

4.  Billing/License model change

Other fields can be modified similar to how a new offer is published. Instructions [here](https://bing.com).

You can add up to 8 disk versions per SKU. Only the SKU with the highest disk version number will show up in Azure Marketplace. Others will be visible via [APIs](https://www.bing.com).

[1]: ./media/cloud-partner-portal-how-to-update-existing-offer/offer-settings.png