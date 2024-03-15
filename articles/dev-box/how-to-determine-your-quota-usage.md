--- 
title: Determine your resource usage and quota 
description: Learn how to determine where the Dev Box resources for your subscription are used and if you have any spare capacity against your quota.  
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.topic: how-to 
ms.date: 01/16/2024 
--- 

# Determine resource usage and quota for Microsoft Dev Box  

To ensure that resources are available for customers, Microsoft Dev Box has a limit on the number of each type of resource that can be used in a subscription. This limit is called a quota.  There are different types of quotas related to Dev Box that you might see in the Developer portal and Azure portal, such as quota for Dev Box vCPU for box creation as well as resource limits for Dev Centers, network connections, and Dev Box Definitions.

Understanding quota limits that affect your Dev Box resources helps you to plan for future use. You can check the [default quota level](/azure/azure-resource-manager/management/azure-subscription-service-limits?branch=main#microsoft-dev-box-limits) for each resource, view your current usage, and determine how much quota remains in each region. By monitoring the rate at which your quota is used, you can plan and prepare to [request a quota limit increase](how-to-request-quota-increase.md) before you reach the quota limit for the resource.

To help you understand where and how you're using your quota, Azure provides the **Usage + Quotas** page in the Azure portal. Each subscription has its own **Usage + quotas** page that covers all the various services in the subscription.

For example, if dev box users encounter a vCPU quota error such as, *QuotaExceeded*, during dev box creation there might be a need to increase this quota. A great place to start is to determine the current quota available.   


## Determine your Dev Box usage and quota by subscription in Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com), and go to the subscription you want to examine. 

1. On the **Subscription** page, under **Settings**, select **Usage + quotas**.

   :::image type="content" source="media/how-to-determine-your-quota-usage/subscription-overview.png" alt-text="Screenshot showing the Subscription overview left menu, with Usage and quotas highlighted." lightbox="media/how-to-determine-your-quota-usage/subscription-overview.png"::: 
 
1. To view usage and quota information about Microsoft Dev Box, select the **Provider** filter, and then select **Dev Box** in the dropdown list.  

   :::image type="content" source="media/how-to-determine-your-quota-usage/select-dev-box.png" alt-text="Screenshot showing the Usage and quotas page, with Dev Box highlighted in the Provider filter dropdown list." lightbox="media/how-to-determine-your-quota-usage/select-dev-box.png":::    
 
1. You can see the **Quota name**, the **Region**, the **Subscription** the quota is assigned to, the **Current Usage**, and whether or not the limit is **Adjustable**.

1. Notice that Azure groups the usage by level: **Regular**, **Low**, and **No usage**: 

1. To view quota and usage information for specific regions, select the **Region:** filter, select the regions to display, and then select **Apply**. 
 
1. To view only the items that are using part of your quota, select the **Usage:** filter, and then select **Only items with usage**. 

1. To view items that are using above a certain amount of your quota, select the **Usage:** filter, and then select **Select custom usage**. 
 
1. You can then set a custom usage threshold, so only the items using above the specified percentage of the quota are displayed.  

1. Select **Apply**. 

## Related content 

- Check the default quota for each resource type by subscription type with [Microsoft Dev Box limits](../azure-resource-manager/management/azure-subscription-service-limits.md#microsoft-dev-box-limits)
- Learn how to [request a quota limit increase](./how-to-request-quota-increase.md)
- You can also check your Dev Box quota using either: 
   - REST API: [Usages - List By Location - REST API (Azure Dev Center)](/rest/api/devcenter/administrator/usages/list-by-location?tabs=HTTP)
   - CLI:  [az devcenter admin usage](/cli/azure/devcenter/admin/usage) 
