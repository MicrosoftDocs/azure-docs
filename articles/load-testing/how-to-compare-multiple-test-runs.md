---
title: Compare load test runs
titleSuffix: Azure Load Testing
description: 'Learn how you can visually compare multiple test runs with Azure Load Testing to identify and analyze performance regressions.'
services: load-testing
ms.service: load-testing
ms.author: ninallam
author: ninallam
ms.date: 01/11/2024
ms.topic: how-to
---

# Compare load test runs in Azure Load Testing

In this article, you learn how you can compare test runs in Azure Load Testing. You can view trends across the last 10 test runs, or you can select and compare up to five individual test runs. Optionally, you can mark a test run as a baseline to compare against.

To identify regressions over time, you can use the client-side metrics trends of the last 10 test runs, such as the response time, error rate, and more. In combination with [CI/CD integration](./quickstart-add-load-test-cicd.md), the trends data might help you identify which application build introduced a performance issue.

When you want to compare the client-side metrics trends against a specific reference test run, you can mark that test run as your baseline. For example, before you implement performance optimizations in your application, you might first create a baseline load test run, and then validate the effects of your optimizations against your baseline.

To compare both client-side and server-side metrics, you can select up to five test runs, and compare them in the Azure Load Testing dashboard. The dashboard overlays the client-side and server-side metric graphs for each test run. By also comparing server-side application metrics in the dashboard, you can identify which application component was the root cause for a sudden performance degradation.

## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  

- An Azure load testing resource, which has a test with multiple test runs. To create a load testing resource, see [Create and run a load test](./quickstart-create-and-run-load-test.md).

## Compare multiple load test runs

To compare test runs in Azure Load Testing, you first have to select up to five runs within a load test. You can only compare runs that belong to the same load test. After you select the test runs you want to compare, you can visually compare the client-side and server-side metrics for each test run in the load test dashboard.

A test run needs to be in the *Done*, *Stopped*, or *Failed* state to compare it.

Use the following steps to select the test runs:

1. Sign in to the [Azure portal](https://portal.azure.com) by using the credentials for your Azure subscription.

1. Go to your load testing resource, and then select **Tests** in the left pane.

    > [!TIP]
    > You can also use the filters to find your load test.

1. Select the test whose runs you want to compare by selecting its name.

1. Select two or more test runs, and then select **Compare** to compare test runs.

    You can choose a maximum of five test runs to compare.

    :::image type="content" source="media/how-to-compare-multiple-test-runs/compare-test-results-from-list.png" alt-text="Screenshot that shows a list of test runs and the 'Compare' button in the Azure portal." lightbox="media/how-to-compare-multiple-test-runs/compare-test-results-from-list.png":::

1. On the dashboard, each test run is shown as an overlay in the different graphs.

    The dashboard enables you to compare both client-side metrics and server-side metrics. You can view the color-coding for each test run in the **Test run details** section.

    > [!NOTE]
    > The time filter is based on the duration of the tests. A value of zero indicates the start of the test, and the maximum value marks the duration of the longest test run. 

    :::image type="content" source="media/how-to-compare-multiple-test-runs/load-test-dashboard-compare-runs.png" alt-text="Screenshot of the load testing dashboard in the Azure portal, comparing two test runs." lightbox="media/how-to-compare-multiple-test-runs/load-test-dashboard-compare-runs.png":::

## View metrics trends across load test runs

To view metrics trends across test runs in Azure Load Testing, you need to have at least two test runs in the *Done*, or *Stopped* state. You can only view trends from runs that belong to the same load test.

Use the following steps to view metrics trends across test runs:

1. Sign in to the [Azure portal](https://portal.azure.com) by using the credentials for your Azure subscription.

1. Go to your Azure Load Testing resource and then, on the left pane, select **Tests**.

1. Select the test for which you want to view metrics trends by selecting its name.

1. Select the **Trends** tab to view the metrics trends for the load test.

    The graphs show the trends for total requests, response time, error percentage, and throughput for the 10 most recent test runs.

    :::image type="content" source="media/how-to-compare-multiple-test-runs/choose-trends-from-test-details.png" alt-text="Screenshot that shows the details of a Test in a Load Testing resource." lightbox="media/how-to-compare-multiple-test-runs/choose-trends-from-test-details.png":::
   
1. Optionally, you can select **Table view** to view the metrics trends in a tabular view.

    :::image type="content" source="media/how-to-compare-multiple-test-runs/metrics-trends-in-table-view.png" alt-text="Screenshot that shows metrics trends in a tabular view." lightbox="media/how-to-compare-multiple-test-runs/metrics-trends-in-table-view.png":::

    You can select a test run that you want to analyze and open the results dashboard for that test run.

## Compare load test runs against a baseline

You can mark a test run as a baseline to compare the client-side metrics of the recent test runs with the metrics of the baseline.

Use the following steps to mark a test run as baseline:

1. On the **Trends** tab, select **Mark baseline**.

    :::image type="content" source="media/how-to-compare-multiple-test-runs/select-mark-baseline.png" alt-text="Screenshot that shows Mark baseline button in the Trends pane." lightbox="media/how-to-compare-multiple-test-runs/select-mark-baseline.png":::

1. From the list of test runs, select the checkbox for the test run that you want to mark as baseline, and then select **Mark baseline**.

    :::image type="content" source="media/how-to-compare-multiple-test-runs/mark-test-run-as-baseline.png" alt-text="Screenshot that shows the context pane to mark a test run as baseline." lightbox="media/how-to-compare-multiple-test-runs/mark-test-run-as-baseline.png":::

1. On the **Trends** tab, you can now view the baseline test run in the table and charts.

    The baseline value is shown as a horizontal line in the charts. In the table view, an extra row with the baseline test run details is shown.

    In the table, an arrow icon indicates whether the metric is trending favorably or unfavorably as compared to the baseline metric value.

    :::image type="content" source="media/how-to-compare-multiple-test-runs/trends-view-with-baseline.png" alt-text="Screenshot that shows trends in metrics when a baseline is selected." lightbox="media/how-to-compare-multiple-test-runs/trends-view-with-baseline.png":::

## Related content

- Learn more about [exporting the load test results for reporting](./how-to-export-test-results.md).
- Learn more about [diagnosing failing load tests](./how-to-diagnose-failing-load-test.md).
- Learn more about [configuring automated performance testing with CI/CD](./quickstart-add-load-test-cicd.md).
