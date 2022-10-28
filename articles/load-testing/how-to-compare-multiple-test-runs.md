---
title: Compare load test runs to find regressions
titleSuffix: Azure Load Testing
description: 'Learn how you can visually compare multiple test runs with Azure Load Testing to identify and analyze performance regressions.'
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 02/16/2022
ms.topic: how-to
ms.custom: contperf-fy22q3
---

# Identify performance regressions by comparing test runs in Azure Load Testing Preview

In this article, you'll learn how you can identify performance regressions by comparing test runs in the Azure Load Testing Preview dashboard. The dashboard overlays the client-side and server-side metric graphs for each run, which allows you to quickly analyze performance issues.

You can compare load test runs for the following scenarios:

- [Identify performance regressions](#identify-performance-regressions) between application builds or configurations. You could run a load test at each development sprint to ensure that the previous sprint didn't introduce performance issues.
- [Identify which application component is responsible](#identify-the-root-cause) for a performance problem (root cause analysis). For example, an application redesign might result in slower application response times. Comparing load test runs might reveal that the root cause was a lack of database resources.

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

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

## Identify performance regressions

You can compare multiple test runs to identify performance regressions. For example, before deploying a new application version in production, you can verify that the performance hasn't degraded.

Use the client-side metrics, such as requests per second or response time, on the load test dashboard to quickly spot performance changes between different load test runs:

1. Hover over the client-side metrics graphs to compare the values across the different test runs.

    In the following screenshot, you notice that the metric values for **Requests per second** and **Response Time** are significantly different. This difference indicates that the application performance dropped significantly between the two test runs.

    :::image type="content" source="media/how-to-compare-multiple-test-runs/compare-client-side-metrics.png" alt-text="Screenshot of the client-side metrics, highlighting the difference in requests per second and response time.":::

1. Optionally, use the **Requests** filter to compare a specific application request in the JMeter script.

    :::image type="content" source="media/how-to-compare-multiple-test-runs/compare-client-side-requests-filter.png" alt-text="Screenshot of the client-side 'requests' filter, which allows you to filter specific application requests.":::

## Identify the root cause

When there's a performance issue, you can use the server-side metrics to analyze what the root cause of the problem is. Azure Load Testing can [capture server-side resource metrics](./how-to-monitor-server-side-metrics.md) for Azure-hosted applications.

1. Hover over the server-side metrics graphs to compare the values across the different test runs.

    In the following screenshot, you notice from the **Response time** and **Requests** that the application performance has degraded. You can also see that for one test run, the database **RU Consumption** peeks at 100%. This indicates that the root cause is likely the database **Provisioned Throughput**.

    :::image type="content" source="media/how-to-compare-multiple-test-runs/compare-server-side-metrics.png" alt-text="Screenshot of the server-side metrics, highlighting the difference in database resource consumption and provisioning throughput.":::

1. Optionally, select **Configure metrics** to add or remove server-side metrics.

    You can add more server-side metrics for the selected Azure app components to further investigate performance problems. The dashboard immediately shows the additional metrics data, and you don't have to rerun the load test.

1. Optionally, use the **Resource** filter to hide or show all metric graphs for an Azure component.

## Next steps

- Learn more about [exporting the load test results for reporting](./how-to-export-test-results.md).
- Learn more about [troubleshooting load test execution errors](./how-to-find-download-logs.md).
- Learn more about [configuring automated performance testing with CI/CD](./tutorial-identify-performance-regression-with-cicd.md).
