---
title: How to test and publish a SaaS offer to the Microsoft commercial marketplace
description: Use Partner Center to submit your SaaS offer to preview, preview your offer, test, and then publish it to the Microsoft commercial marketplace.
ms.reviewer: dannyevers 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: mingshen-ms 
ms.author: mingshen
ms.date: 08/31/2020
---

# How to test and publish a SaaS offer to the commercial marketplace

This article explains how to use Partner Center to submit your SaaS offer for publishing, preview your offer, test it, and then publish it live to the commercial marketplace. You must have already created an offer that you want to publish.

## Go to your offer in the commercial marketplace

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/home).
2. In the left-navigation menu, select **Commercial Marketplace** > **Overview**.
3. On the **Overview** tab, under **Offers**, one of the following status indicators is displayed in the **Status** column for each offer.

    | Status | Description |
    | ------------ | ------------- |
    | Draft | Offer has been created but it isn't being published. |
    | Publish in progress | Offer is working its way through the publishing process. |
    | Attention needed | We discovered a critical issue during certification or during another publishing phase. |
    | Preview | We certified the offer, which now awaits a final verification by the publisher. Select **Go live** to publish the offer live. |
    | Live | Offer is live in the marketplace and can be seen and acquired by customers. |
    | Pending stop sell | Publisher selected "stop sell" on an offer or plan, but the action has not yet been completed. |
    | Not available in the marketplace | A previously published offer in the marketplace has been removed. |
    |||

4. In the **Offer alias** column, select the offer you want to test and publish.

## Submit your offer for publishing

1. To submit your offer to preview, select **Review and publish** at the upper-right corner of the portal. The **Review and publish** page appears.
1. Make sure that the **Status** column for each page says **Complete**. The three possible statuses are as follows:

   - **Not started** – The page is incomplete.
   - **Incomplete** – The page is missing required information or has errors that need to be fixed. You'll need to go back to the page and update it.
   - **Complete** – The page is complete. All required data has been provided and there are no errors.

1. If any of the pages have a status other than **Complete**, in the **Page** column, select the page name, correct the issue, save the page, and then select **Review and publish** again to return to this page.
1. After all the pages are complete, in the **Notes for certification** box, provide testing instructions to the certification team to ensure that your app is tested correctly. Provide any supplementary notes helpful for understanding your app.
1. To publish your offer to preview, select **Publish**. The **Offer overview** page appears and shows the publishing status.

Your offer's publishing status will change as it moves through the publishing process. For detailed information, see [Review and publish an offer to the commercial marketplace](review-publish-offer.md#validation-and-publishing-steps).

## Preview and test your offer

When the offer is ready for you to review and be signed off, we’ll send you an email to request that you review and approve your offer preview. You can also refresh the **Offer overview** page in your browser to see if your offer has reached the Publisher sign-off phase. If it has, the **Go live** button and preview links will be available. There will be a link for either Microsoft AppSource preview, Azure Marketplace preview, or both depending on the options you chose when creating your offer. If you chose to sell your offer through Microsoft, anyone who has been added to the preview audience can test the acquisition and deployment of your offer to ensure it meets your requirements during this stage.

The following screenshot shows the **Offer overview** page for a SaaS offer, with two preview links under the **Go live** button. The validation steps you’ll see on this page vary depending on the the selections you made when you created the offer.

![Illustrates the Offer overview page for an offer in Partner Center. The Go live button and preview links are shown.](media/publish-status-publisher-signoff.png)

Use the following steps to preview your offer.

> [!IMPORTANT]
> To validate the end-to-end purchase and setup flow, purchase your offer while it is in Preview. First notify Microsoft with a [support ticket](https://aka.ms/marketplacesupport) to ensure we don't process a charge.

1. On the **Offer overview** page, select a preview link under the **Go live** button. 

1. To validate the end-to-end purchase and setup flow, purchase your offer while it's in Preview. First notify Microsoft with a [support ticket](https://aka.ms/marketplacesupport) to ensure we don't process a charge.

1. Transactable SaaS offers require integration with the SaaS fulfillment APIs. Review and follow the development and testing instructions in [SaaS fulfillment APIs version 2 in the Microsoft commercial marketplace](./partner-center-portal/pc-saas-fulfillment-api-v2.md) to ensure your offer is successfully integrated with the APIs before you publish your offer live.

1. If your SaaS offer supports [metered billing using the commercial marketplace metering service](./partner-center-portal/saas-metered-billing.md), review and follow the development and testing best practices detailed in [Marketplace metered billing APIs](./partner-center-portal/marketplace-metering-service-apis.md).

1. If you want to make changes after previewing and testing the offer, you can edit and resubmit to publish a new preview. For more information, see [Update an existing offer in the commercial marketplace](./partner-center-portal/update-existing-offer.md).

## Publish your offer live

- After you approve your preview, to publish your offer live to the commercial marketplace, select **Go live**.

   > [!TIP]
   > If your offer is already live in the commercial marketplace, any updates you make won't go live until you select **Go live**.

Now that you’ve chosen to go live with your offer, which makes it available in the commercial marketplace, we perform a series of final validation checks to ensure the live offer is configured just like the preview version of the offer. For details about these validation checks, see [Publish phase](review-publish-offer.md#publish-phase).

After these validation checks are complete, your offer will be live in the marketplace.

## Next step

[Access analytic reports for the commercial marketplace in Partner Center](./partner-center-portal/analytics.md)