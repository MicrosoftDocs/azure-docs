---
title: Quickstart - Request a quota increase in the Azure portal
description: This quickstart shows you how to increase a quota in the Azure portal.
ms.date: 07/22/2022
ms.topic: how-to
---

# Quickstart: Request a quota increase in the Azure portal

Get started with Azure Quotas by using the Azure portal to request a quota increase.

For more information about quotas, see [Quotas overview](quotas-overview.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Request a quota increase

You can submit a request for a quota increase directly from **My quotas**. Follow the steps below to request an increase for a quota. For this example, you can select any adjustable quota in your subscription.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Enter "quotas" into the search box, and then select **Quotas**.

   :::image type="content" source="media/quickstart-increase-quota-portal/quotas-portal.png" alt-text="Screenshot of the Quotas service page in the Azure portal.":::

1. On the Overview page, select a provider, such as **Compute** or **AML**.

   > [!NOTE]
   > For all providers other than Compute, you'll see a **Request increase** column instead of the **Adjustable** column described below. There, you can request an increase for a specific quota, or create a support request for the increase.

1. On the **My quotas** page, under **Quota name**, select the quota you want to increase. Make sure that the **Adjustable** column shows **Yes** for this quota.
1. Near the top of the page, select **Request quota increase**, then select **Enter a new limit**.

   :::image type="content" source="media/quickstart-increase-quota-portal/enter-new-quota-limit.png" alt-text="Screenshot of the Enter a new limit option in My quotas in the Azure portal.":::

1. In the **Request quota increase** pane, enter a numerical value for your new quota limit, then select **Submit**.

Your request will be reviewed, and you'll be notified if the request can be fulfilled. This usually happens within a few minutes.

If your request is not fulfilled, you'll see a link to create a support request. When you use this link, a support engineer will assist you with your increase request.

> [!TIP]
> You can request an increase for a quota that is non-adjustable by submitting a support request. For more information, see [Request an increase for non-adjustable quotas](per-vm-quota-requests.md#request-an-increase-for-non-adjustable-quotas).

## Next steps

- [Increase VM-family vCPU quotas](per-vm-quota-requests.md)
- [Increase regional vCPU quotas](regional-quota-requests.md)
- [Increase spot vCPU family quotas](spot-quota.md)
- [Increase networking quotas](networking-quota-requests.md)
- [Increase Azure Storage account quotas](storage-account-quota-requests.md)