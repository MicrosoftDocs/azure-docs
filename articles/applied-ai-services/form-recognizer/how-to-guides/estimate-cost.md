---
title: "Check my usage and estimate the cost"
titleSuffix: Azure Applied AI Services
description: Learn how to use Azure portal to check how many pages are analyzed and estimate the total price.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: how-to
ms.date: 07/14/2022
ms.author: luzhan
recommendations: false
---

# Check my Form Recognizer usage and estimate the price

 In this how-to guide, you'll learn to use Azure pricing calculator to check how many pages were processed by Azure Form Recognizer and estimate the cost.

## Check how many pages are processed

1. Sign in to [Azure portal](https://portal.azure.com).

1. Navigate to your Form Recognizer resource.

1. From the **Overview** page, select the **Monitoring** tab located near the middle of the page.

   :::image type="content" source="../media/azure-portal-overview-menu.png" alt-text="Screenshot of the Azure portal overview page menu.":::

1. Select a time range and you'll see the **Processed Pages** chart displayed.

    :::image type="content" source="../media/azure-portal-overview-monitoring.png" alt-text="Screenshot that shows how many pages are processed on the resource overview page." lightbox="../media/azure-portal-processed-pages.png":::

### Examine analyzed pages

You can dive deeper to see each model's analyzed pages:

1. Under **Monitoring** Select **Metrics** from the left navigation menu.

   :::image type="content" source="../media/azure-portal-monitoring-metrics.png" alt-text="Screenshot of the monitoring menu in the Azure portal.":::

1. On the **Metrics** page, select **Add metric**.

1. Select the Metric dropdown menu and, under **USAGE**, choose **Processed Pages**.

    :::image type="content" source="../media/azure-portal-add-metric.png" alt-text="Screenshot that shows how to add new metrics on Azure portal.":::

1. From the upper right corner, configure the time range and select the **Apply** button.

    :::image type="content" source="../media/azure-portal-processed-pages-timeline.png" alt-text="{alt-text}" lightbox="azure-portal-metrics-timeline.png":::

1. Select **Apply splitting**.

    :::image type="content" source="../media/azure-portal-apply-splitting.png" alt-text="Screenshot of the Apply splitting option in the Azure portal.":::

1. Choose **FeatureName** from the **Values** dropdown menu.

    :::image type="content" source="../media/azure-portal-splitting-on-feature-name.png" alt-text="Screenshot of the Apply splitting values dropdown menu.":::

1. Next, you'll see a breakdown of the pages analyzed by each model.

    :::image type="content" source="../media/azure-portal-metrics-drill-down.png" alt-text="Screenshot demonstrating how to drill down to check analyzed pages by model." lightbox="../media/azure-portal-drill-down-closeup.png":::

## Estimate price

1. Sign in to [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) with the same credentials you use for the Azure portal.

1. Search for **Azure Form Recognizer** in the **Search products** search box.

1. Select **Azure Form Recognizer** and you will see that it has been added to the page.

1. Under **Your Estimate**, select the relevant **Region**, **Payment Option** and **Instance** for your Form Recognizer instance. For more information, *see* [Azure Form Recognizer pricing options](https://azure.microsoft.com/pricing/details/form-recognizer/#pricing).

1. Enter the number of pages you from the metrics dashboard on Azure portal using the steps in the above [Check how many pages are processed](#check-how-many-pages-are-processed) or [Examine analyzed pages](#examine-analyzed-pages) sections.

* The price you'll pay is on the right, after the equal (**=**) sign.

    :::image type="content" source="../media/price-calculation.png" alt-text="Screenshot that shows how to estimate the price based on processed pages":::

That's it. You now know how to check how many pages you have processed and  estimate the cost.

## Next step

> [!div class="nextstepaction"]
> [Learn more about Form Recognizer service quotas and limits](../service-limits.md)
