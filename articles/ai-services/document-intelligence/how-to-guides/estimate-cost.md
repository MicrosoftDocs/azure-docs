---
title: "Check my usage and estimate the cost -  Document Intelligence (formerly Form Recognizer)"
titleSuffix: Azure AI services
description: Learn how to use Azure portal to check how many pages are analyzed and estimate the total price.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: how-to
ms.date: 07/18/2023
ms.author: luzhan
---


# Check usage and estimate cost

::: moniker range="<=doc-intel-4.0.0"
 [!INCLUDE [applies to v4.0 v3.1 v3.0 v2.1](../includes/applies-to-v40-v31-v30-v21.md)]
::: moniker-end

In this guide, you'll learn how to use the metrics dashboard in the Azure portal to view how many pages were processed by Azure AI Document Intelligence. You'll also learn how to estimate the cost of processing those pages using the Azure pricing calculator.

## Check how many pages were processed

We'll start by looking at the page processing data for a given time period:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to your Document Intelligence resource.

1. From the **Overview** page, select the **Monitoring** tab located near the middle of the page.

   :::image type="content" source="../media/azure-portal-overview-menu.png" alt-text="Screenshot of the Azure portal overview page menu.":::

1. Select a time range and you'll see the **Processed Pages** chart displayed.

    :::image type="content" source="../media/azure-portal-overview-monitoring.png" alt-text="Screenshot that shows how many pages are processed on the resource overview page." lightbox="../media/azure-portal-processed-pages.png":::

### Examine analyzed pages

We can now take a deeper dive to see each model's analyzed pages:

1. Under the **Monitoring** section, select **Metrics** from the left navigation menu.

   :::image type="content" source="../media/azure-portal-monitoring-metrics.png" alt-text="Screenshot of the monitoring menu in the Azure portal.":::

1. On the **Metrics** page, select **Add metric**.

1. Select the Metric dropdown menu and, under **USAGE**, choose **Processed Pages**.

    :::image type="content" source="../media/azure-portal-add-metric.png" alt-text="Screenshot that shows how to add new metrics on Azure portal.":::

1. From the upper right corner, configure the time range and select the **Apply** button.

    :::image type="content" source="../media/azure-portal-processed-pages-timeline.png" alt-text="Screenshot of time period options for metrics in the Azure portal." lightbox="../media/azure-portal-metrics-timeline.png":::

1. Select **Apply splitting**.

    :::image type="content" source="../media/azure-portal-apply-splitting.png" alt-text="Screenshot of the Apply splitting option in the Azure portal.":::

1. Choose **FeatureName** from the **Values** dropdown menu.

    :::image type="content" source="../media/azure-portal-splitting-on-feature-name.png" alt-text="Screenshot of the Apply splitting values dropdown menu.":::

1. You'll see a breakdown of the pages analyzed by each model.

    :::image type="content" source="../media/azure-portal-metrics-drill-down.png" alt-text="Screenshot demonstrating how to drill down to check analyzed pages by model." lightbox="../media/azure-portal-drill-down-closeup.png":::

## Estimate price

Now that we have the page processed data from the portal, we can use the Azure pricing calculator to estimate the cost:

1. Sign in to [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) with the same credentials you use for the Azure portal.

    > Press Ctrl + right-click to open in a new tab!

1. Search for **Azure AI Document Intelligence** in the **Search products** search box.

1. Select **Azure AI Document Intelligence** and you'll see that it has been added to the page.

1. Under **Your Estimate**, select the relevant **Region**, **Payment Option** and **Instance** for your Document Intelligence resource. For more information, *see* [Azure AI Document Intelligence pricing options](https://azure.microsoft.com/pricing/details/form-recognizer/#pricing).

1. Enter the number of pages processed from the Azure portal metrics dashboard. That data can be found using the steps in sections [Check how many pages are processed](#check-how-many-pages-were-processed) or [Examine analyzed pages](#examine-analyzed-pages), above.

1. The estimated price is on the right, after the equal (**=**) sign.

    :::image type="content" source="../media/azure-portal-pricing.png" alt-text="Screenshot of how to estimate the price based on processed pages.":::

That's it. You now know where to find how many pages you have processed using Document Intelligence and how to estimate the cost.

## Next steps

> [!div class="nextstepaction"]
>
> [Learn more about Document Intelligence service quotas and limits](../service-limits.md)
