---
title: Request quota changes for Azure Container Apps
description: Learn about how and where to submit a quota request for Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 04/29/2025
ms.author: cshoe
---

# Request quota changes for Azure Container Apps

Azure Container Apps has default quotas and limits that apply to your resources. As your application needs grow, you might need to increase these limits. This article explains how to request quota changes for Azure Container Apps through integrated and manual request processes. Follow these procedures when you need to expand your resource capacity beyond the default limits.

## Integrated requests

Integrated requests use the [Azure Quota Management System](https://ms.portal.azure.com/#view/Microsoft_Azure_Capacity/QuotaMenuBlade/~/myQuotas) (QMS) to automate most quota change requests. Most requests are processed within a few minutes, while a limited number requests are converted into support ticket for further evaluation.

Make an integrated request for the following quotas:

- Managed environment count
- Session pools
- Subscription consumption NCA 100 GPUs
- Subscription consumption T 4 GPUs
- Subscription NCA 100 GPUs

### Make an integrated request

Use the following steps to make an integrated request for a quota change.

1. Go to the [Quota Management System](https://ms.portal.azure.com/#view/Microsoft_Azure_Capacity/QuotaMenuBlade/~/myQuotas) in the Azure portal.

1. Select the *Provider* drop down and select **Azure Container Apps**.

1. Select the  *Subscription* drop down and select your Azure subscription.

1. Use the search box to filter for the quota item that matches your request.

1. Locate the quota item in the appropriate region.

1. Select the pencil icon (:::image type="icon" source="media/quotas/edit-icon.png" border="false":::) to initiate a request.

1. In the *New Quota Request* window, enter the new limit value you're requesting in the *New limit* box.

1. Select **Submit**.

Once your request is approved, then you'll see a success message that resembles the following example.

:::image type="content" source="media/quotas/azure-container-apps-quota-success.png" alt-text="Screenshot of successful quota request.":::

## Manual requests

Manual requests could take up to a few days to complete. Use this option for the following quotas:

- Managed environment consumption cores
- Managed environment general purpose cores
- Managed environment memory optimized cores

### Make a manual request

1. Open [New support request](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/NewSupportRequestV4Blade/callerName/Quota/summary/Quota%20request) form in the Azure portal.

1. Enter the following values into the form:

    | Property | Value |
    |---|---|
    | Issue type | Select **Service and subscription limits (quotas)** |
    | Subscription | Select your subscription.  |
    | Quota type | Select **Container Apps**. |

1. Select **Next**.

1. In the *Additional details* window, select **Enter details** to open the request details window and enter your values.

    :::image type="content" source="media/quotas/azure-container-apps-qms-support-details.png" alt-text="Screenshot of Azure Quota Management System details window.":::

1. Select **Save and continue**.

1. Fill out the rest the relevant details in the *Additional details* window.

1. Select **Next**.

1. Select **Create**.

## Related content

- [Quotas for Azure Container Apps](./quotas.md)
