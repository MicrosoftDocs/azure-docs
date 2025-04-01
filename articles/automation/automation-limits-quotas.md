---
title: Manage Azure Automation subscription limits and quotas
description: This article provides information on how to view automation limits and request for quota increase or decrease.
services: automation
ms.topic: how-to
ms.date: 01/28/2025
ms.service: azure-automation
---

# Manage Azure Automation subscription limits and quotas

This article provides steps to view the current limits and request for quota increase or decrease.

## Prerequisites for quota changes

- An active Azure Automation account
- Contributor role for Azure Automation account.

> [!NOTE]
> Free subscriptions including [Azure Free Account](https://azure.microsoft.com/offers/ms-azr-0044p/) and [Azure for Students](https://azure.microsoft.com/offers/ms-azr-0170p/) aren't eligible for limit or quota changes.

## View current limits and request for quota changes

You can view your current usage and limits, request for quota increase/decrease for number of Automation accounts per subscription and number of concurrently running jobs per Automation account. For more information, see the [complete list of service limits](automation-subscription-limits-faq.md)

Follow the steps to view your current quota and request for changes in quota:

1. Select [**Help+support**](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/NewSupportRequestV3Blade/callerWorkflowId/01133068-af18-43c8-baa4-a54f5fa7c684/callerName/Microsoft_Azure_Support%2FHelpPane.ReactView/productId/06bfd9d3-516b-d5c6-5802-169c800dec89/issueType/quota), and then select **New support request**.
1. In the **New support request** page, select the **Problem description** tab, and provide the following details:
    - In **Issue type**, select *Service and subscription limits (quotas)*.
    - In **Subscription**, select the subscription for which you want to check the quota
    - In **Quota type**, select *Azure Automation*.
    
      :::image type="content" source="./media/automation-limits-quotas/check-quota.png" alt-text="Screenshot showing how to check the current quota.":::

1. In the **Additional details** tab, under the **Problem details** section, select **Enter details**

    :::image type="content" source="./media/automation-limits-quotas/provide-details.png" alt-text="Screenshot showing how to provide details for quota increase.":::

1. In the side pane, select the resource for which you want to view current quota and request for quota increase/decrease. You can select *Automation Account per region or Concurrent jobs per account*.
1. Select the **Region** to view the **Current usage** and **Current quota** for the selected resource.
1. Provide a value in the **New quota requested** as per your requirement to increase or decrease quota.

   :::image type="content" source="./media/automation-limits-quotas/request-new-quota.png" alt-text="Screenshot showing how to request for a new quota increase or decrease.":::

1. Select **Save and Continue**
1. Provide the remaining details to create the support request.
1. Select **Next:Review+Create** to validate the information provided and then select **Create** to create a support request.

> [!NOTE]
> Quota increases are subject to availability of resources in the selected region.

## View current limits and request for increase on Quotas page

You can also view your current usage and request for quota increase/decrease for number of Automation accounts per subscription on Quotas page on Azure portal. This capability isn't currently available for viewing number of concurrently running jobs in your Automation account. 

Follow these steps to view current limits and request for quota increase:

1. Go to [My Quotas](https://ms.portal.azure.com/#view/Microsoft_Azure_Capacity/QuotaMenuBlade/~/myQuotas) page and choose provider **Automation accounts**. The filter options at the top of the page allow you to filter by location, subscription, and usage.
1. You can view your current usage and limit on the number of Automation accounts.

   :::image type="content" source="./media/automation-limits-quotas/view-current-usage.png" alt-text="Screenshot showing how to view current usage.":::
 
1. Select the pencil icon in the **Request adjustment** column to request for additional quota.
1. In the **New Quota request** pane, enter the **New limit** for number of Automation accounts based on your business requirement.
1. Select **Submit**. It may take few minutes to process your request.
    - If your request is rejected, select **Create a Support request**. Some fields are auto-populated. Complete the remaining details in Support request and submit it.


## Next steps

Learn more on [the default quotas or limits offered to different resources in Azure Automation](automation-subscription-limits-faq.md).

