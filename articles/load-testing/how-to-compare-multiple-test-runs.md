---
title: Compare load testing runs to find regressions
titleSuffix: Azure Load Testing
description: 'Azure Load Testing allows you to compare multiple test runs to better understand performance regressions.'
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 11/30/2021
ms.topic: how-to

---

# Monitor for performance regressions by comparing load test runs

In this article, learn how to compare multiple test runs in Azure Load Testing by using the Azure Load Testing dashboard in Azure portal. Visually compare multiple test runs to help you monitor for and identify performance regressions across test runs.

A test run contains client-side and server-side metrics. The test engine reports client-side metrics, such as the number of virtual users. The server-side metrics provide application-specific information.

## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  

- An Azure Load Testing resource with a test plan that has multiple test runs. To create a Load Test resource, see [Identify performance bottlenecks](./tutorial-identify-bottlenecks-azure-portal.md).

    > [!NOTE]
    > A test run needs to be in the **Done**, **Stopped**, or **Failed** state to compare it.
    
## Compare test runs by starting from a test plan

In this section, you'll first select a test plan, and then select which test runs to compare.

1. Sign in to the [Azure portal](https://portal.azure.com) by using the credentials for your Azure subscription.

1. Navigate to your Load Testing resource, and select **Tests** from the left navigation to view the list of test plans.

1. Select the test plan whose runs you want to compare. Make sure to use the filters on the top to find your test plan.

    :::image type="content" source="media/how-to-compare-multiple-test-runs/test-plan.png" alt-text="Screenshot that shows the list of test runs in the Test Plan page.":::

1. Select **Compare** in the command bar. You can now choose the test runs you want to compare by using the checkboxes.

    :::image type="content" source="media/how-to-compare-multiple-test-runs/choose-runs-to-compare.png" alt-text="Screenshot that shows the test runs to compare.":::

    You can choose a maximum of five test runs to compare.

1. Select **Compare** to visualize the test runs in the dashboard. Each run is shown as an overlay in the different graphs.

    :::image type="content" source="media/how-to-compare-multiple-test-runs/compare-screen.png" alt-text="Screenshot that shows two test runs being compared.":::

    You can use filters to customize the graphs. There are separate filters for the client and the server metrics.

    > [!TIP]
    > The time filter is based on the relative duration of the tests. A value of zero indicates the beginning of the test and the maximum value marks the duration of the longest test run. For client-side metrics, test runs will show only data for the duration of the test.

## Compare test runs by starting from a test run

In this section, you'll select a test run, and then select other test runs to compare with.

1. Sign in to the [Azure portal](https://portal.azure.com) by using the credentials for your Azure subscription.

1. Navigate to your Load Testing resource, and select **Tests** from the left navigation to view the list of test plans.

1. Select the test plan whose runs you want to compare. Make sure to use the filters on the top to find your test plan.

    :::image type="content" source="media/how-to-compare-multiple-test-runs/test-plan.png" alt-text="Screenshot that shows the list of test runs in the Test Plan page.":::

1. Select the test run you want to compare from the list. You'll navigate to the test run details page.

1. Select **Compare** in the command bar. You can now choose the test runs you want to compare by using the checkboxes.

    :::image type="content" source="media/how-to-compare-multiple-test-runs/choose-runs-to-compare.png" alt-text="Screenshot that shows which test runs you want to compare.":::

    You can choose a maximum of five test runs to compare.

1. Select **Compare**. The test runs will now be rendered in the dashboard by overlaying each run on the different graphs.

    :::image type="content" source="media/how-to-compare-multiple-test-runs/compare-screen.png" alt-text="Screenshot that shows two test runs being compared.":::

    You can use filters to customize the graphs. There are separate filters for the client and the server metrics.

    > [!TIP]
    > The time filter is based on the relative duration of the tests. A value of zero indicates the beginning of the test and the maximum value marks the duration of the longest test run. For client-side metrics, test runs will show only data for the duration of the test.

## Next steps

- For information on high-scale load tests, see [Set up a high-scale load test](./how-to-high-scale-load.md).

- To learn how to configure automated regression testing, see [Configure automated load testing with Azure Pipelines](./tutorial-cicd-azure-pipelines.md)
