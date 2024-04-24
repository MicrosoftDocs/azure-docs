--- 
title: Determine your resource usage and quota 
description: Use the Quota management Service to determine where the Dev Box resources for your subscription are used and if you have any spare capacity against your quota.  
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

To help you understand where and how you're using your quota, Azure provides the Quota Management System (QMS) to manage requests to view or alter quota. QMS provides several advantages to the Dev Box service including:  

- Expedited approvals via automation based on thresholds.  
- Metrics to monitor quota usage in existing subscription.  
- Improved User Experience for an easier requesting experience 

For example, if dev box users encounter a vCPU quota error such as, *QuotaExceeded*, during dev box creation there might be a need to increase this quota. A great place to start is to determine the current quota available.   


## Determine your Dev Box usage and quota

1. Sign in to the [Azure portal](https://portal.azure.com), and go to the subscription you want to examine. 

1. In the Azure portal search bar, enter *quota*, and select **Quotas** from the results.  

1. On the Quotas page, select **Dev Box**. 
 
   :::image type="content" source="media/how-to-determine-your-quota-usage/quotas-page.png" alt-text="Screenshot of the Azure portal Quotas page with Microsoft Dev Box highlighted." lightbox="media/how-to-determine-your-quota-usage/quotas-page.png":::

1. View your quota usage and limits for each resource type. 

   :::image type="content" source="media/how-to-determine-your-quota-usage/my-quotas-page.png" alt-text="Screenshot of the Azure portal Quotas page with Microsoft Dev Box quotas." lightbox="media/how-to-determine-your-quota-usage/my-quotas-page.png":::




## Request additional quota

On the Quotas | My quotas page, you can select a subscription and view the usage and quota levels. Quotas are listed from highest to lowest. 

1.	To submit a quota request for compute, select **New Quota Request**.  


  > [!Tip]
  > To adjust other quotas and submit requests, select the pencil icons on the right.


## Related content 

- Check the default quota for each resource type by subscription type with [Microsoft Dev Box limits](../azure-resource-manager/management/azure-subscription-service-limits.md#microsoft-dev-box-limits)
- Learn how to [request a quota limit increase](./how-to-request-quota-increase.md)
- You can also check your Dev Box quota using either: 
   - REST API: [Usages - List By Location - REST API (Azure Dev Center)](/rest/api/devcenter/administrator/usages/list-by-location?tabs=HTTP)
   - CLI:  [az devcenter admin usage](/cli/azure/devcenter/admin/usage) 
