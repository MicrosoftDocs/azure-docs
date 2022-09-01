---
title: Troubleshoot load test errors
titleSuffix: Azure Load Testing
description: Learn how you can diagnose and troubleshoot errors in Azure Load Testing. Download and analyze the Apache JMeter worker logs in the Azure portal.
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 03/23/2022
ms.topic: how-to

---
# Troubleshoot load test errors by downloading Apache JMeter logs

Learn how to diagnose and troubleshoot errors while running a load test with Azure Load Testing Preview. Download the Apache JMeter worker logs or load test results for detailed logging information.

When you start a load test, the Azure Load Testing test engines run your Apache JMeter script. Errors can occur at different levels. For example, during the execution of the JMeter script, while connecting to the application endpoint, or in the test engine instance.

You can use different sources of information to diagnose these errors:

- [Download the Apache JMeter worker logs](#download-apache-jmeter-worker-logs) to investigate issues with JMeter and the test script execution.
- [Export the load test result](./how-to-export-test-results.md) and analyze the response code and response message of each HTTP request.

There might also be problems with the application endpoint itself. If you host the application on Azure, you can [configure server-side monitoring](./how-to-monitor-server-side-metrics.md) to get detailed insights about the application components.

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Load test error indicators

After running a load test, there are multiple error indicators available:

- The test run **Status** information is **Failed**.

    :::image type="content" source="media/how-to-find-download-logs/dashboard-test-failed.png" alt-text="Screenshot that shows the load test dashboard, highlighting status information for a failed test.":::

- The test run statistics shows a non-zero **Error percentage** value.
- The **Errors** graph in the client-side metrics shows errors.

    :::image type="content" source="media/how-to-find-download-logs/dashboard-errors.png" alt-text="Screenshot that shows the load test dashboard, highlighting the error information.":::

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
- An Azure load testing resource that has a completed test run. If you need to create an Azure load testing resource, see [Create and run a load test](./quickstart-create-and-run-load-test.md).  

## Download Apache JMeter worker logs

When you run a load test, the Azure Load Testing test engines execute your Apache JMeter test script. During the load test, Apache JMeter stores detailed logging in the worker node logs. You can download these JMeter worker logs for each test run in the Azure portal.

For example, if there's a problem with your JMeter script, the load test status will be **Failed**. In the worker logs you might find additional information about the cause of the problem.

To download the worker logs for an Azure Load Testing test run, follow these steps:

1. In the [Azure portal](https://portal.azure.com), go to your Azure Load Testing resource.

1. Select **Tests** to view the list of tests, and then select your load test.

    :::image type="content" source="media/how-to-find-download-logs/test-list.png" alt-text="Screenshot that shows the list of load tests for an Azure Load Test resource.":::  

   >[!TIP]
   > To limit the number of tests, use the search box and the **Time range** filter.

1. Select a test run from the list to view the test run dashboard.

    :::image type="content" source="media/how-to-find-download-logs/test-run.png" alt-text="Screenshot that shows a list of test runs for the selected load test.":::  

1. On the dashboard, select **Download**, and then select **Logs**.

    :::image type="content" source="media/how-to-find-download-logs/logs.png" alt-text="Screenshot that shows how to download the test log files from the test run details page.":::  

    The browser should now start downloading the JMeter worker node log file *worker.log*.

1. You can use a text editor to open the log file.

    :::image type="content" source="media/how-to-find-download-logs/jmeter-log.png" alt-text="Screenshot that shows the JMeter log file content.":::  

    The *worker.log* file can help you diagnose the root cause of a failing load test. In the previous screenshot, you can see that the test failed because a file is missing.

## Next steps

- Learn how to [Export the load test result](./how-to-export-test-results.md).
- Learn how to [Monitor server-side application metrics](./how-to-monitor-server-side-metrics.md).
- Learn how to [Get detailed insights for Azure App Service based applications](./how-to-appservice-insights.md).
- Learn how to [Compare multiple load test runs](./how-to-compare-multiple-test-runs.md).
