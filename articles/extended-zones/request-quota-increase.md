---
title: Request quota increase - Azure portal
description: Learn how to request a quota increase for your Azure Extended Zone resources using the Azure portal.
author: halkazwini
ms.author: halkazwini
ms.service: azure-extended-zones
ms.topic: how-to
ms.date: 08/02/2024
---

# Request a quota increase in the Azure portal

> [!IMPORTANT]
> Azure Extended Zones service is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this article, you learn how to request a quota increase for your Azure Extended Zone resources using the Azure portal.

## Prerequisites

- An Azure account with an active subscription.

## Request a quota increase

In this section, you request a quota increase in the Azure portal.

1. In the search box at the top of the portal, enter ***quota***. Select **Quotas** from the search results.

    :::image type="content" source="./media/request-quota-increase/portal-search.png" alt-text="Screenshot that shows how to search for Quotas in the Azure portal." lightbox="./media/request-quota-increase/portal-search.png":::

1. On the Overview page, select a provider, such as **Compute**.

    :::image type="content" source="./media/request-quota-increase/quotas-overview.png" alt-text="Screenshot that shows the Overview page of Quotas in the Azure portal." lightbox="./media/request-quota-increase/quotas-overview.png":::

    > [!NOTE]
    > For all providers other than Compute, there is a **Request adjustment** column instead of the **Adjustable** column available for **Compute**. From the **Request adjustment**, you can request an increase for a specific quota, or create a support request for the increase.

1. On the **My quotas** page, select the quota you want to increase from the **Quota name** column. Make sure that the **Adjustable** column shows **Yes** for this quota.

    > [!TIP]
    > You can request an increase for a quota that is non-adjustable by submitting a support request. For more information, see [Request an increase for non-adjustable quotas](../quotas/per-vm-quota-requests.md#request-an-increase-for-non-adjustable-quotas).

1. Select **New Quota Request**, then select **Enter a new limit**.

    :::image type="content" source="./media/request-quota-increase/quota-request.png" alt-text="Screenshot that shows how to request a new quota in the Azure portal." lightbox="./media/request-quota-increase/quota-request.png":::

1. On the **New quota request** page, enter the new limit you want to request, then select **Submit**.

    :::image type="content" source="./media/request-quota-increase/new-quota-request.png" alt-text="Screenshot that shows the New quota request page in the Azure portal." lightbox="./media/request-quota-increase/new-quota-request.png":::

1. Wait a few minutes while your request is reviewed. Once the request is approved, the **New quota request** page will show the new quota.

    :::image type="content" source="./media/request-quota-increase/approved-request.png" alt-text="Screenshot that shows the New approved quota." lightbox="./media/request-quota-increase/approved-request.png":::
    
    If your request wasn't approved, you'll see a link to create a support request. When you use this link, a support engineer will assist you with your increase request.

## Related content

- [What is Azure Extended Zones?](overview.md)
- [Deploy a virtual machine in an Extended Zone](deploy-vm-portal.md)
- [Frequently asked questions](faq.md)
