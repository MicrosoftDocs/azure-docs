---
title: Create and manage tests runs
titleSuffix: Azure Load Testing
description: Learn how to create and manage tests runs in Azure Load Testing with the Azure portal.
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 05/10/2023
ms.topic: how-to
---

# Create and manage tests runs in Azure Load Testing

When you run a load test, Azure Load Testing creates a test run associated with the test. Learn how to manage [tests runs](./concept-load-testing-concepts.md#test-run) for a load test in Azure Load Testing.

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* An Azure load testing resource. To create a load testing resource, see [Create and run a load test](./quickstart-create-and-run-load-test.md#create-an-azure-load-testing-resource).

## View test runs

Test runs are associated with a load test in Azure Load Testing. To view the test runs for a test in the Azure portal:

1. In the [Azure portal](https://portal.azure.com), and go to your load testing resource.

1. Select **Tests** in the left pane, to view the list of tests.

1. View the test runs for a test by selecting the test name in the list.

    :::image type="content" source="media/how-to-create-manage-test-runs/view-test-runs.png" alt-text="Screenshot that shows the list of test runs for a load test in the Azure portal.":::

1. Select **ellipsis (...)** for a test run perform more actions on the test run.

    :::image type="content" source="media/how-to-create-manage-test-runs/test-run-context-menu.png" alt-text="Screenshot that shows the test run context menu in the Azure portal to download input files, results file, and share a link.":::

    - Select **Download input file** to download all input files for running the test, such as the JMeter test script, input data files, and user property files. The download also contains the [load test configuration YAML file](./reference-test-config-yaml.md).

	    > [!TIP]
        > You can use the downloaded test configuration YAML file for [setting up automated load testing in a CI/CD pipeline](./tutorial-identify-performance-regression-with-cicd.md).

    - Select **Download results file** to download the JMeter test results CSV file. This file contains an entry for each web request. Learn more about [exporting load test results](./how-to-export-test-results.md).

    - Select **Share** to get a direct link to the test run dashboard in the Azure portal. To view the test run dashboard, you need to have access granted to the load testing resource. Learn more about [users and roles in Azure Load Testing](./how-to-assign-roles.md).

## Edit a test run

You can modify a test run by adding or removing Azure app components or resource metrics. You can't update the other test configuration settings.

To view the test runs for a test in the Azure portal:

1. In the [Azure portal](https://portal.azure.com), and go to your load testing resource.

1. Select **Tests** in the left pane, to view the list of tests.

1. Go to the test details by selecting the test name in the list tests.

1. Go to the test run dashboard by selecting a test run name in the list of runs.

1. Select **App Components** or **Configure metrics** to add or remove app components or resource metrics.

    The test run dashboard automatically reflects the updates to app components and metrics.

    :::image type="content" source="media/how-to-create-manage-test-runs/test-run-app-components-metrics.png" alt-text="Screenshot that shows how to configure app components and resource metrics for a test run in the Azure portal.":::

## Rerun a test run

When you rerun a test run, Azure Load Testing uses the test configuration that is associated with the *test run*. If you've made changes to the configuration of the *test* afterwards, those changes aren't taken into account for rerunning the test run.

To rerun a test run in the Azure portal:

1. In the [Azure portal](https://portal.azure.com), and go to your load testing resource.

1. Select **Tests** in the left pane, to view the list of tests.

1. Go to the test details by selecting the test name in the list tests.

1. Go to the test run dashboard by selecting a test run name in the list of runs.

1. Select **Rerun**.

1. In the **Rerun** page, optionally update the test run description and test parameters.

1. Select **Rerun** to start the load test.

## Stop a test run

To stop a test run in the Azure portal:

1. In the [Azure portal](https://portal.azure.com), and go to your load testing resource.

1. Select **Tests** in the left pane, to view the list of tests.

1. Go to the test details by selecting the test name in the list tests.

1. Select one or more test runs from the list by checking the corresponding checkboxes.

1. Select **Delete test runs**

    Alternately, go to the test run dashboard by selecting a test run name in the list of runs, and then select **Delete test run**.

1. In the **Delete test run** page, select **Delete** to delete the test run.

## Delete a test run

To delete a test run in the Azure portal:

1. In the [Azure portal](https://portal.azure.com), and go to your load testing resource.

1. Select **Tests** in the left pane, to view the list of tests.

1. Go to the test details by selecting the test name in the list tests.

1. Select **ellipsis (...)** > **Stop** to stop a running test run.

## Compare test runs

To identify performance degradation over time, you can visually compare up to five test runs in the dashboard. Learn more about [comparing test runs in Azure Load Testing](./how-to-compare-multiple-test-runs.md).

## Next steps

- [Create and manage load tests](./how-to-create-manage-test.md)
- [Set up automated load testing with CI/CD](./tutorial-identify-performance-regression-with-cicd.md)
