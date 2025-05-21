---
title: Analyze test results using actionable insights
titleSuffix: Azure Load Testing
description: Learn how to analyze test results using AI powered actionable insights 
services: load-testing
ms.service: azure-load-testing
ms.author: vanshsingh
author: vanshsingh
ms.date: 05/19/2025
ms.topic: how-to

---
# Use actionable insights to troubleshoot load test results (Preview)

In this article, you learn how to use **AI-powered actionable insights** in Azure Load Testing to identify and troubleshoot performance issues in your application. This feature analyzes your test run data using AI to highlight key issues—such as latency spikes, throughput drops, or backend resource bottlenecks—and provides recommended next steps.


You can view actionable insights directly in the test run dashboard after your test completes.

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
- An Azure load testing resource. To create a load testing resource, see [Create and run a load test](./quickstart-create-and-run-load-test.md).
- Server-side metrics enabled for your test run. For best results, see [Monitor server-side application metrics by using Azure Load Testing](./how-to-monitor-server-side-metrics.md)

## View actionable insights for a test run

To view actionable insights for a completed test:

1. In the Azure portal, go to your Azure Load Testing resource. 

2. Select **Tests**, and choose the relevant test run.

3. Azure Load Testing generates actionable insights on demand. If you're visiting the test run dashboard for the first time, expand the **AI summary and insights** section, and select **Generate insights**.

    :::image type="content" source="media/how-to-analyze-test-results-using-actionable-insights/generate-insight.png" alt-text="Screenshot that shows the 'Generate insights' action for a test run." lightbox="media/how-to-analyze-test-results-using-actionable-insights/generate-insight.png":::

> [!TIP]
> For the best insights, configure server-side metrics. The AI engine correlates client-side and server-side data to generate more accurate diagnostics and recommendations.

4. The service generates insights and displays a summary and key insights in the same section. To explore further, select **View detailed insights**.

    :::image type="content" source="media/how-to-analyze-test-results-using-actionable-insights/view-detailed-insights.png" alt-text="Screenshot that shows 'View detailed insights' section." lightbox="media/how-to-analyze-test-results-using-actionable-insights/view-detailed-insights.png":::

5. In the detailed insights view, you can explore what went wrong during the test, supporting evidence, and recommended next steps.


> [!CAUTION]
> AI-generated insights might not always be accurate. We recommend reviewing the evidence and validating with your application’s telemetry 

## Related content

- [View metrics trends and compare load test results to identify performance regressions](./how-to-compare-multiple-test-runs.md).
