---
title: Request quota changes for Azure Container Apps
description: Learn about how and where to submit a quota request for Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 09/21/2026
ms.author: cshoe
---

# Request quota changes for Azure Container Apps

Azure Container Apps has default quotas and limits that apply to your resources. As your application needs grow, you might need to increase these limits. The request process depends on whether the quota applies to the selected subscription and region or to one managed environment (Container Apps environment).

## Subscription quota requests

Submit quota requests that apply to the selected subscription and region through the [Azure Quota Management System](https://ms.portal.azure.com/#view/Microsoft_Azure_Capacity/QuotaMenuBlade/~/myQuotas) (QMS). The request might be fulfilled automatically or routed to Azure Support for further review.

Use this process for the following subscription quotas:

- Managed environment count
- Session pools
- Subscription NCA 100 GPUs

### Submit a subscription quota request

To request a subscription quota change:

1. Go to the [Quota Management System](https://ms.portal.azure.com/#view/Microsoft_Azure_Capacity/QuotaMenuBlade/~/myQuotas) in the Azure portal.

1. In the **Provider** dropdown list, select **Azure Container Apps**.

1. In the **Subscription** dropdown list, select your Azure subscription.

1. Use the search box to filter for the quota item that matches your request.

1. Locate the quota item in the appropriate region.

1. Select the pencil icon (:::image type="icon" source="media/quotas/edit-icon.png" border="false":::) to initiate a request.

1. In the **New Quota Request** window, enter the requested value in the **New limit** box.

1. Select **Submit**.

After your request is approved, a success message appears.

:::image type="content" source="media/quotas/azure-container-apps-quota-success.png" alt-text="Screenshot of successful quota request.":::

## Managed environment quota requests

Submit quota requests that apply to one managed environment from that environment's **Quota** page. Azure might fulfill the request automatically or route it to Azure Support for further review.

Use this process for the following managed environment quotas:

- Managed environment consumption cores
- Managed environment general purpose cores
- Managed environment memory optimized cores
- Managed environment consumption NCA100 GPUs
- Managed environment consumption T4 GPUs

### Submit a managed environment quota request

Before you can request a managed environment quota increase, you must [create a Container Apps environment](environment.md).

1. In the Azure portal, open your Container Apps environment.

1. Under **Settings**, select **Quota**.

    :::image type="content" source="media/quotas/azure-container-apps-environment-quota-list.png" alt-text="Screenshot of the Quota page for a Container Apps environment, showing CPU and GPU quota types.":::

1. Select the quota that you want to increase.

1. In the **New Quota Request** pane, enter the requested value in the **New limit** box.

    :::image type="content" source="media/quotas/azure-container-apps-environment-quota-request.png" alt-text="Screenshot of a new managed environment quota request with a value entered in the New limit box.":::

1. Select **Submit**.

If a quota doesn't appear on the **Quota** page, it might not be available for the environment. Availability can depend on the region or environment type. For example, GPU quotas are available only in certain regions. Managed environment memory optimized cores are available only for workload profiles environments, not consumption-only environments.

## Related content

- [Quotas for Azure Container Apps](./quotas.md)
