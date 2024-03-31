---
title: Monitor and track Azure free service usage
description: Learn how to check free service usage in the Azure portal. There's no charge for services included in a free account unless you go over the service limits.
author: bandersmsft
ms.reviewer: amberbhargava
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 03/21/2024
ms.author: banders
---

# Check usage of free services included with your Azure free account

You're not charged for services included for free with your Azure free account, unless you exceed the limits of the services. To remain in the limits, you can use the Azure portal to track the free service usage.

Usage only appears in the Azure portal after you start using free resources so if you haven't used any resources, usage isn't shown. Note that usage and status doesn't immediately appear. It's delayed for one to two days after you use a resource.

## Check usage in the Azure portal

1.	Sign in to the [Azure portal](https://portal.azure.com).
1.  Search for **Subscriptions**.  
    :::image type="content" border="true" source="./media/check-free-service-usage/billing-search-subscriptions.png" alt-text="Screenshot that shows search in the Azure portal for subscriptions.":::
1.	Select the subscription that was created when you signed up for your Azure free account.
1.  The page shows your free service usage.  
    :::image type="content" source="./media/check-free-service-usage/free-account-subscription-page.png" alt-text="Screenshot showing the free account subscription page where you see your Azure usage." lightbox="./media/check-free-service-usage/free-account-subscription-page.png" :::

The page has the following usage areas:

- **Spending rate and forecast** - Shows the cost of resources that you've used over time. Select **View details** to get a more detailed view of your spending in Cost analysis.
- **Cost by resource** - Shows the costs for individual resources that you've used. Select **View details** to get a more detailed view of your spending in Cost analysis.
- **Top free services by usage** - The area only appears for Free accounts, so if you don't have a Free account, the area isn't shown. The area shows the free services that you've used. Select the **View all free services** to view the **Free services for 12 months** table that shows the following columns:
    - **Meter** - Identifies the unit of measure for the service being consumed.
    - **Usage/Limit** - Current month's usage and limit for the meter.
    - **Status** - Usage status of the service. Based on your usage, you can have one of the following statutes:
        - **Not in use** - You haven't used the meter or the usage for the meter hasn't reached the billing system.
        - **Exceeded on \<Date>** - You've exceeded the limit for the meter on \<Date>.
        - **Unlikely to Exceed** - You're unlikely to exceed the limit for the meter.
        - **Exceeds on \<Date>** - You're likely to exceed the limit for the meter on \<Date>.  
            :::image type="content" source="./media/check-free-service-usage/free-services-table.png" alt-text="Screenshot showing the Free services for 12 months table." lightbox="./media/check-free-service-usage/free-services-table.png" :::
- **Top products by number of resources** - Shows the highest number of product resources that you've used.
- **Azure Defender coverage** - Shows your Azure Defender usage. Select **Upgrade coverage** to enable Microsoft Defender by starting a 30-day free trial.

> [!IMPORTANT]
>
> Free services are only available for the subscription that was created when you signed up for your Azure free account. If you can't see the free services table in the subscription overview page, they are not available for the subscription.

## Need help? Contact us.

If you have questions or need help,  [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps
- [Upgrade your Azure free account](upgrade-azure-subscription.md)
