--- 
title: How to determine your resource usage and quota 
description: Learn how to determine where the Dev Box resources for your subscription are used and if you have any spare capacity against your quota.  
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.topic: how-to 
ms.date: 08/21/2023 
--- 

# Determine resource usage and quota for Microsoft Dev Box  

To ensure that resources are available for customers, Microsoft Dev Box has a limit on the number of each type of resource that can be used in a subscription. This limit is called a quota. 

Keeping track of how your quota of VM cores is being used across your subscriptions can be difficult. You may want to know what your current usage is, how much you have left, and in what regions you have capacity. To help you understand where and how you're using your quota, Azure provides the Usage + Quotas page. 

## Determine your Dev Box usage and quota by subscription

1. In the [Azure portal](https://portal.azure.com), go to the subscription you want to examine. 

1. On the Subscription page, under Settings, select **Usage + quotas**.

   :::image type="content" source="media/how-to-determine-your-quota-usage/subscription-overview.png" alt-text="Screenshot showing the Subscription overview left menu, with Usage and quotas highlighted." lightbox="media/how-to-determine-your-quota-usage/subscription-overview.png"::: 
 
1. To view Usage + quotas information about Microsoft Dev Box, select **Dev Box**.  

   :::image type="content" source="media/how-to-determine-your-quota-usage/select-dev-box.png" alt-text="Screenshot showing the Usage and quotas page, with Dev Box highlighted." lightbox="media/how-to-determine-your-quota-usage/select-dev-box.png":::    
 
1. In this example, you can see the **Quota name**, the **Region**, the **Subscription** the quota is assigned to, the **Current Usage**, and whether or not the limit is **Adjustable**.

   :::image type="content" source="media/how-to-determine-your-quota-usage/example-subscription.png" alt-text="Screenshot showing the Usage and quotas page, with column headings highlighted." lightbox="media/how-to-determine-your-quota-usage/example-subscription.png":::    

1. You can also see that the usage is grouped by level; regular, low, and no usage. 

   :::image type="content" source="media/how-to-determine-your-quota-usage/example-subscription-groups.png" alt-text="Screenshot showing the Usage and quotas page, with VM size groups highlighted." lightbox="media/how-to-determine-your-quota-usage/example-subscription-groups.png" :::
 
1. To view quota and usage information for specific regions, select the **Region:** filter, select the regions to display, and then select **Apply**. 

   :::image type="content" source="media/how-to-determine-your-quota-usage/select-regions.png"  lightbox="media/how-to-determine-your-quota-usage/select-regions.png" alt-text="Screenshot showing the Usage and quotas page, with Regions drop down highlighted.":::
 
1. To view only the items that are using part of your quota, select the **Usage:** filter, and then select **Only items with usage**. 

   :::image type="content" source="media/how-to-determine-your-quota-usage/select-items-with-usage.png" lightbox="media/how-to-determine-your-quota-usage/select-items-with-usage.png" alt-text="Screenshot showing the Usage and quotas page, with Usage drop down and Only show items with usage option highlighted.":::
 
1. To view items that are using above a certain amount of your quota, select the **Usage:** filter, and then select **Select custom usage**. 

   :::image type="content" source="media/how-to-determine-your-quota-usage/select-custom-usage-before.png" alt-text="Screenshot showing the Usage and quotas page, with Usage drop down and Select custom usage option highlighted." lightbox="media/how-to-determine-your-quota-usage/select-custom-usage-before.png" :::
 
1. You can then set a custom usage threshold, so only the items using above the specified percentage of the quota are displayed.  
 
   :::image type="content" source="media/how-to-determine-your-quota-usage/select-custom-usage.png" alt-text="Screenshot showing the Usage and quotas page, with Select custom usage option and configuration settings highlighted."  lightbox="media/how-to-determine-your-quota-usage/select-custom-usage.png":::

1. Select **Apply**. 

 Each subscription has its own Usage + quotas page, which covers all the various services in the subscription, not just Microsoft Dev Box. 

## Related content 

- Check the default quota for each resource type by subscription type: [Microsoft Dev Box limits](/azure/azure-resource-manager/management/azure-subscription-service-limits#microsoft-dev-box-limits).
- To learn how to request a quota increase, see [Request a quota limit increase](./how-to-request-quota-increase.md). 