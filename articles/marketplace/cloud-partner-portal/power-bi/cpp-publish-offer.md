---
title: Publish Power BI App offer - Azure Marketplace | Microsoft Docs
description: Publish a Power BI App offer on the Microsoft AppSource Marketplace. 
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
ms.date: 01/31/2019
ms.author: pbutlerm
---

# Publish Power BI App offer

The last step, after you have defined the offer in the portal and created the associated technical assets, is to submit the offer for publishing.  To start this process, click the **Publish** button on the vertical menu in the **New Offer** window.  For more information, see [Publish Azure Marketplace and AppSource offers](../manage-offers/cpp-publish-offer.md).


## Publishing steps

The following diagram depicts the main steps in the publishing process to "go live".

![Publishing process steps for Power BI App](./media/publishing-process-steps.png)

The following table describes these steps and provides a maximum time estimate for their completion:

|   Publishing Step            |   Time     |   Description                                                                  |
| --------------------         |------------| ----------------                                                               |
| Validate prerequisites       | 15 min     | Offer information and offer settings are validated.                            |
| Certification                | 1-7 days   | The Power BI Certification Team analyses your offer. We run your Power BI App through a manual verification test by installing the app via provided installation URL. Main validations are performed as part of the app certification process; see below.         |
| Packaging                    | \< 1 hour  | Offer’s technical assets are packaged for customer use.                        |
| Lead Generation Registration | \< 1 hour  | Lead systems are configured and deployed.                                      |
| Publisher signoff            | \-         | Final publisher review and confirmation before the offer goes live. You will also now have a link to preview your offering. Once you are happy with how your preview looks, click the **Go Live** button in the **Status** tab. This action sends a request to the onboarding team to list your app on AppSource.    |
| Live                         | \< 3 hours | Your offer is now publicly listed ("live") on AppSource, and customers will be able to view and deploy your app in their Power BI subscriptions. You will also receive a confirmation e-mail. At any point, you can click on the **All offers** tab, and see the status for all your offers listed on the right column. You can click on the **Status** tab to see the publishing flow status in detail for your offer. |
|   |   |

Allow for up to eight days for this process to complete. After you go through these publishing steps, your Power BI App offer will be listed in the
[AppSource](https://appsource.microsoft.com/marketplace/apps?product=power-bi%20) Power BI Apps section.


### App certification process

The Microsoft onboarding team uses the following process to validate your Power BI offer submission:

1. Legal documents and help links are reviewed.
2. Support Contact info is validated.
3. Installer URL is used to verify proper installation. 
4. App is scanned for malware and other malicious content. 
5. Verification is performed that content displayed matches app’s description.
6. App-related operations work as expected in Power BI: open reports and dashboards with sample data, connect to custom data sources, refresh, etc.

The Certification Team provides feedback if they find any issues.  For more info on Power BI App requirements, see the [Power BI App documentation](https://go.microsoft.com/fwlink/?linkid=2028636).


## Next steps

We recommend that you regularly monitor your app in the [AppSource Marketplace](https://appsource.microsoft.com).  In addition, you should use the [Seller Insights](../../cloud-partner-portal-orig/si-getting-started.md) feature of the [Cloud Partner Portal](https://cloudpartner.azure.com/#insights) to provide insights on your marketplace customers and usage.  You can also perform certain [updates to your offer](./cpp-update-existing-offer.md).
