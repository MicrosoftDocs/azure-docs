---
title: "Check my usage and estimate the cost"
titleSuffix: Azure Applied AI Services
description: Learn how to use Azure portal to check how many pages are analyzed and estimate the total price.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: how-to
ms.date: 07/11/2022
ms.author: luzhan
recommendations: false
---

# Check my Form Recognizer usage and estimate the price

 In this how-to guide, you'll learn to use Azure portal and pricing calculator to check how many pages are processed by Azure Form Recognizer and estimate the price spent on the resource.

 ## Check how many pages are processed
 * Sign in to [Azure portal](https://portal.azure.com).
 * Go to the Form Recognizer resource you use.
 * From the **Overview** page, go to **Monitoring** tab, select the time range and you will see **Processed Pages** chart.

    :::image type="content" source="../media/azure-portal-overview-monitoring.png" alt-text="Screenshot that shows how many pages are processed on the resource overview page":::

 * If you want to drill down to see each model's analyzed pages, click **Metrics** page from the left menu, select **Add metric**, choose **Processed Pages** under **USAGE** metric and configure the time range.

    :::image type="content" source="../media/azure-portal-metrics-creation.png" alt-text="Screenshot that shows how to add new metrics on Azure portal":::

 *  Select **Apply splitting**, choose **FeatureName** as Values. Then you will see a breakdown of the pages analyzed by each model.

    :::image type="content" source="../media/azure-portal-metrics-split.png" alt-text="Screenshot that shows how to apply splitting to the chart":::

    :::image type="content" source="../media/azure-portal-metrics-drill-down.png" alt-text="Screenshot that shows how to drill down to check analyzed pages by model":::

## Estimate the price
* Sign in to [Azure pricing calculater](https://azure.microsoft.com/pricing/calculator/) with the same credentials you use on the Azure portal.
* Search for **Form Recognizer** and select it.
* Under **Your Estimate**, select the region, payment options and instance. Check [Azure Form Recognizer pricing options](https://azure.microsoft.com/pricing/details/form-recognizer/#pricing) if you want to learn more.
* Enter the number of pages you see from the metrics dashboard on Azure portal.
* The price you will pay is on the right, after the "=" sign.

    :::image type="content" source="../media/price-calculation.png" alt-text="Screenshot that shows how to estimate the price based on processed pages":::


