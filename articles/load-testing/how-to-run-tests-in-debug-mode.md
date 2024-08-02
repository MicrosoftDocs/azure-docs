---
title: Run load test in debug mode
titleSuffix: Azure Load Testing
description: 'Learn how you can run a load test in debug mode in Azure Load Testing.'
services: load-testing
ms.service: azure-load-testing
ms.author: ninallam
author: ninallam
ms.date: 05/23/2024
ms.topic: how-to
---

# Run load test in debug mode

Learn how to run load tests in debug mode in Azure Load Testing. With debug mode in Azure Load Testing, you can validate your test configuration and application behavior by running a load test with a single engine for up to 10 minutes.

You can use debug mode to troubleshoot issues with your test plan configuration. Test runs in debug mode have debug logs enabled, which can help you identify issues with your test script. Debug mode also includes request and response data for every failed request during the test run. With this information, you can identify the root cause of any issues and make necessary changes to your test script or application.


## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  

- An Azure load testing resource. To create a load testing resource, see [Create and run a load test](./quickstart-create-and-run-load-test.md).

## Debug mode

A test can be run in a debug mode to validate the test plan configuration and application behavior. The characteristics of a test run in debug mode are:

- The test run is executed with a single engine, irrespective of number of engines specified in the test configuration. For a test with load distributed in multiple regions, the engine will be in the parent region.

- The test run is limited to a maximum duration of 10 minutes, irrespective of the duration mention in the test plan.

- The test run has debug logs enabled.

- The test run has request and response data for every failed request during the test run.

- This is applicable only for URL based and JMeter based tests. Locust tests don't support debug mode.

- A test run in debug mode can't be marked as baseline test run.

- A test run in debug mode isn't included in the metrics trends.


## Run tests in debug mode

You can enable debug mode for the first test run while creating a new test. You can also enable debug mode when running a test or rerunning a test run.

To enable debug mode for your first test run, follow these steps while creating a test:

1. Sign in to the [Azure portal](https://portal.azure.com) by using the credentials for your Azure subscription.

1. On the **Get started** tab, select **Add HTTP requests** or **Upload a script** based on the type of test you want to create.

1. In the **Basics** tab, select the **Debug mode**. Make sure the **Run test after creation** is selected.

1. Complete the rest of the test configuration and then select **Review + create**.

:::image type="content" source="./media/how-to-run-tests-in-debug-mode/create-test-debug-mode.png" lightbox="./media/how-to-run-tests-in-debug-mode/create-test-debug-mode.png" alt-text="Screenshot that shows creating a test in debug mode.":::

Debug mode is enabled for the first test run after the test is created.

To run an existing test in debug mode, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) by using the credentials for your Azure subscription.

1. Go to your Azure Load Testing resource and then, on the left pane, select **Tests**.

1. Select the test that you want to run in debug mode by selecting its name.

1. Select **Run**.

1. In the **Run test** pane, select the **Debug mode**.

1. Select **Run**.

:::image type="content" source="./media/how-to-run-tests-in-debug-mode/run-test-debug-mode.png" lightbox="./media/how-to-run-tests-in-debug-mode/run-test-debug-mode.png" alt-text="Screenshot that shows running a test in debug mode.":::

The test run is now created in debug mode. Similarly, you can rerun a test run in debug mode by selecting the **Rerun** option.

## View results of a test run in debug mode

You can view the results of a test run in debug mode in the same way as you view the results of a regular test run. The results of a test run in debug mode also include the debug logs and request and response data for every failed request during the test run. The files are available in the storage account container. Follow the steps mentioned [here](./how-to-export-test-results.md#copy-test-artifacts-from-a-storage-account-container) to export the files.


## Related content

- Learn more about [exporting the load test results for reporting](./how-to-export-test-results.md).
- Learn more about [diagnosing failing load tests](./how-to-diagnose-failing-load-test.md).
