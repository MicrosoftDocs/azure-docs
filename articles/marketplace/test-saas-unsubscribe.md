---
title: How to unsubscribe from a SaaS plan - Azure Marketplace
description: Learn how to unsubscribe from a SaaS plan in Azure Marketplace.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: trkeya 
ms.author: trkeya
ms.date: 03/30/2022
---

# Unsubscribe from and deactivate a test plan

When you’re done testing a plan, you can unsubscribe from and deactivate the plan.

## Unsubscribe from a plan

1. Publishers can unsubscribe a customer from the system, using the [Cancel Subscription API](./partner-center-portal/pc-saas-fulfillment-subscription-api.md#cancel-a-subscription).
1. Using Postman, send a **DELETE** API action against `subscriptionId`.
1. Once unsubscribe is successful, you will receive Status Code **202 Accepted**.

    [ ![Screenshot of the DELETE API action with status 200.](./media/review-publish-offer/test-plan-2.png) ](./media/review-publish-offer/test-plan-2.png#lightbox)

## Deactivate a test plan

Use these steps to deactivate a test plan after you’re done testing the plan.

> [!NOTE]
> If there is only one plan in your offer, you must create another plan before you can deactivate the test plan.

1. Sign in to [Partner Center](https://go.microsoft.com/fwlink/?linkid=2166002).

1. On the Home page, select the **Marketplace offers** tile.

    [ ![Illustrates the Marketplace offers tile on the Partner Center Home page.](./media/workspaces/partner-center-home.png) ](./media/workspaces/partner-center-home.png#lightbox)

1. On the Marketplace Offers page, select the offer that contains the plan you want to deactivate.
1. In the left-nav, select **Plan overview**.

    [ ![Screenshot of the preview links under the Go live button.](./media/review-publish-offer/plan-deactivate-1.png) ](./media/review-publish-offer/plan-deactivate-1.png#lightbox)

1. For the plan you want to deactivate, in the **Action** column, select **Stop distribution**.

    [ ![Screenshot of the Stop distribution link in the Action column.](./media/review-publish-offer/plan-deactivate-2.png) ](./media/review-publish-offer/plan-deactivate-2.png#lightbox)

1. To confirm that you want to deactivate the plan, in the dialog box that appears, enter the **Plan ID** and select the **Stop selling** button.

    [ ![Screenshot of the dialog box to confirm you want to Stop selling a plan.](./media/review-publish-offer/plan-deactivate-3.png) ](./media/review-publish-offer/plan-deactivate-3.png#lightbox)

Once you deactivate the plan, it will be no longer available in the marketplaces.

## Next Steps

- [Create a SaaS plan in your production offer](create-new-saas-offer-plans.md)
- [Access analytic reports for the commercial marketplace in Partner Center](analytics.md)
