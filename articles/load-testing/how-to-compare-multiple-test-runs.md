---
title: Compare load test runs to find regressions
titleSuffix: Azure Load Testing
description: 'Learn how you can visually compare multiple test runs with Azure Load Testing to identify and analyze performance regressions.'
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 01/18/2023
ms.topic: how-to
ms.custom: contperf-fy22q3
---

# Identify performance regressions by comparing test runs in Azure Load Testing

In this article, you'll learn how you can identify performance regressions by comparing test runs in the Azure Load Testing dashboard. The dashboard overlays the client-side and server-side metric graphs for each run, which allows you to quickly analyze performance issues. You will also learn how to view and analyze the trends in client-side performance metrics. 

To identify performance regressions, you can quickly glance over the client-side metrics from your recent test runs to understand if your performance is trending favorably or unfavorably. Optionally, you can compare the recent metrics with a baseline to understand if the performance is meeting your expectations. To dive deeper into a performance regression, you can compare upto five test runs.

You can compare load test runs for the following scenarios:

- Identify performance regressions between application builds or configurations. You could run a load test at each development sprint to ensure that the previous sprint didn't introduce performance issues.
- Identify which application component is responsible for a performance problem (root cause analysis). For example, an application redesign might result in slower application response times. Comparing load test runs might reveal that the root cause was a lack of database resources.

## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  

- An Azure Load Testing resource with a test plan that has multiple test runs. To create a Load Testing resource, see [Create and run a load test](./quickstart-create-and-run-load-test.md).

## Select test runs

To compare test runs in Azure Load Testing, you'll first have to select up to five runs within a load test. You can only compare runs that belong to the same load test.

A test run needs to be in the *Done*, *Stopped*, or *Failed* state to compare it.

Use the following steps to select the test runs:

1. Sign in to the [Azure portal](https://portal.azure.com) by using the credentials for your Azure subscription.

1. Go to your Azure Load Testing resource and then, on the left pane, select **Tests**.

    :::image type="content" source="media/how-to-compare-multiple-test-runs/choose-test-from-list.png" alt-text="Screenshot that shows the list of tests for a Load Testing resource.":::

    You can also use the filters to find your load test.

1. Select the test whose runs you want to compare by selecting its name.

1. Select two or more test runs by selecting the corresponding checkboxes in the list.

    :::image type="content" source="media/how-to-compare-multiple-test-runs/compare-test-results-from-list.png" alt-text="Screenshot that shows a list of test runs and the 'Compare' button.":::

    You can choose a maximum of five test runs to compare.

## Compare multiple test runs

After you've selected the test runs you want to compare, you can visually compare the client-side and server-side metrics for each test run in the load test dashboard.

1. Select the **Compare** button to open the load test dashboard.
    
    Each test run is shown as an overlay in the different graphs.

    :::image type="content" source="media/how-to-compare-multiple-test-runs/compare-screen.png" alt-text="Screenshot of the 'Compare' page, displaying a comparison of two test runs.":::

1. Optionally, use the filters to customize the graphs.

    :::image type="content" source="media/how-to-compare-multiple-test-runs/compare-client-side-filters.png" alt-text="Screenshot of the client-side filter controls on the load test dashboard.":::

    > [!TIP]
    > The time filter is based on the duration of the tests. A value of zero indicates the start of the test, and the maximum value marks the duration of the longest test run. 

## View metrics trends across test runs

To view metrics trends across test runs in Azure Load Testing, you'll need to have at least two test runs in the *Done*, or *Stopped* state. You can only view trends from runs that belong to the same load test.

Use the following steps to view metrics trends across test runs:

1. Sign in to the [Azure portal](https://portal.azure.com) by using the credentials for your Azure subscription.

1. Go to your Azure Load Testing resource and then, on the left pane, select **Tests**.

    :::image type="content" source="media/how-to-compare-multiple-test-runs/choose-test-from-list.png" alt-text="Screenshot that shows the list of tests for a Load Testing resource." lightbox="media/how-to-compare-multiple-test-runs/choose-test-from-list.png":::

    You can also use the filters to find your load test.
1. Select the test for which you want to view metrics trends by selecting its name.

1. On the **Test details** pane, select **Trends**

    The graphs show the trends for total requests, response time, error percentage, and throughput for the ten most recent test runs.

    :::image type="content" source="media/how-to-compare-multiple-test-runs/choose-trends-from-test-details.png" alt-text="Screenshot that shows the details of a Test in a Load Testing resource." lightbox="media/how-to-compare-multiple-test-runs/choose-trends-from-test-details.png":::
   
1. Optionally, you can select **Table view** to view the metrics trends in a tabular view.

    :::image type="content" source="media/how-to-compare-multiple-test-runs/metrics-trends-in-table-view.png" alt-text="Screenshot that shows metrics trends in a tabular view." lightbox="media/how-to-compare-multiple-test-runs/metrics-trends-in-table-view.png":::

    You can select a test run that you want to analyze and open the results dashboard for that test run.

## Use a baseline test run

You can mark a test run as baseline to compare the client-side metrics of the recent test runs with those of the baseline. 

Use the following steps to mark a test run as baseline:

1. On the **Trends** pane, select **Mark baseline**

    :::image type="content" source="media/how-to-compare-multiple-test-runs/select-mark-baseline.png" alt-text="Screenshot that shows Mark baseline button in the Trends pane." lightbox="media/how-to-compare-multiple-test-runs/select-mark-baseline.png":::

1. In the right context pane, select the checkbox for the test run that you want to mark as baseline, and then select **Mark baseline**

    :::image type="content" source="media/how-to-compare-multiple-test-runs/mark-test-run-as-baseline.png" alt-text="Screenshot that shows the context pane to mark a test run as baseline." lightbox="media/how-to-compare-multiple-test-runs/mark-test-run-as-baseline.png":::
   
    You can also use the filters to find your load test run.

    The baseline value is shown as a horizontal line in the charts. In the table view, an additional row with the baseline test run details is shown. For the recent test runs, an arrow mark next to the metrics 
    value indicates whether the metric is trending favorably or unfavorably as compared to the baseline metric value. 

    :::image type="content" source="media/how-to-compare-multiple-test-runs/trends-view-with-baseline.png" alt-text="Screenshot that shows trends in metrics when a baseline is selected." lightbox="media/how-to-compare-multiple-test-runs/trends-view-with-baseline.png":::

## Next steps

- Learn more about [exporting the load test results for reporting](./how-to-export-test-results.md).
- Learn more about [troubleshooting load test execution errors](./how-to-troubleshoot-failing-test.md).
- Learn more about [configuring automated performance testing with CI/CD](./tutorial-identify-performance-regression-with-cicd.md).
