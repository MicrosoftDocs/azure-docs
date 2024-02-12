---
title: Diagnose failing load tests
titleSuffix: Azure Load Testing
description: Learn how you can diagnose and troubleshoot failing tests in Azure Load Testing. Download and analyze the Apache JMeter worker logs in the Azure portal.
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 11/23/2023
ms.topic: how-to

---
# Diagnose failing load tests in Azure Load Testing

In this article, you learn how to diagnose and troubleshoot failing load tests in Azure Load Testing. Azure Load Testing provides several options to identify the root cause of a failing load test. For example, you can use the load test dashboard, or download the test results or test log files for an in-depth analysis. Alternately, configure server-side metrics to identify issues with application endpoint.

Azure Load Testing uses two indicators to determine the outcome of a load test:

- **Test status**: indicates whether the load test was able to start successfully and run the test script until the end. For example, the test status is *Failed* if there's an error in the JMeter test script, or if the [autostop listener](./how-to-define-test-criteria.md#auto-stop-configuration) interrupted the load test because too many requests failed.

- **Test result**: indicates the result of evaluating the [test fail criteria](./how-to-define-test-criteria.md). If at least one of the test fail criteria was met, the test result is set to *Failed*.

Depending on the indicator, you can use a different approach to identify the root cause of a test failure.

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
- An Azure load testing resource that has a completed test run. If you need to create an Azure load testing resource, see [Create and run a load test](./quickstart-create-and-run-load-test.md).  

## Determine the outcome of a load test

Use the following steps to get the outcome of a load test:

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), and go to your load testing resource.

1. Select **Tests** in the left pane, to view the list of tests.

1. Select a test from the list to view all test runs for that test.

    The list of test runs shows the **Test result** and **Test status** fields.

    :::image type="content" source="media/how-to-find-download-logs/load-testing-test-runs-list.png" alt-text="Screenshot that shows the list of test runs in the Azure portal, highlighting the test result and test status columns." lightbox="media/how-to-find-download-logs/load-testing-test-runs-list.png":::

1. Alternately, select a test run to view the load test dashboard for the test run.

    :::image type="content" source="media/how-to-find-download-logs/load-testing-dashboard-failed-test.png" alt-text="Screenshot that shows the load test dashboard, highlighting status information for a failed test." lightbox="media/how-to-find-download-logs/load-testing-dashboard-failed-test.png":::

# [GitHub Actions](#tab/github)

1. In [GitHub](https://github.com), browse to your repository.

1. Select **Actions**, and then select your workflow run from the list.

    On the **Summary** page, the status of the GitHub Actions workflow reflects the outcome of the load test action.

    :::image type="content" source="media/how-to-find-download-logs/github-actions-summary-failed-test.png" alt-text="Screenshot that shows the summary page for an Azure Pipelines run, highlighting the failed load test stage." lightbox="media/how-to-find-download-logs/github-actions-summary-failed-test.png":::

1. Alternately, select the workflow job to view the GitHub Actions workflow log.

    :::image type="content" source="media/how-to-find-download-logs/github-actions-load-testing-log.png" alt-text="Screenshot that shows the GitHub Actions workflow logs, highlighting the error statistics information for a load test run." lightbox="media/how-to-find-download-logs/github-actions-load-testing-log.png":::

# [Azure Pipelines](#tab/pipelines)

1. Sign in to your Azure DevOps organization (`https://dev.azure.com/<your-organization>`), and select your project.
    
    Replace the `<your-organization>` text placeholder with your project identifier.

1. Select **Pipelines** in the left navigation, and then select your CI/CD workflow.

    You can view the test run status in Azure Pipelines on the pipeline run **Summary** page. The status of the pipeline reflects the status of the load test task.

    :::image type="content" source="media/how-to-find-download-logs/azure-pipelines-summary-failed-test.png" alt-text="Screenshot that shows the summary page for an Azure Pipelines run, highlighting the failed load test stage.":::

1. Alternately, drill down into the Azure Pipelines log.

    :::image type="content" source="./media/how-to-find-download-logs/azure-pipelines-load-test-log.png" alt-text="Screenshot that shows the Azure Pipelines run log, displaying the load testing metrics and Azure portal link." lightbox="./media/how-to-find-download-logs/azure-pipelines-load-test-log.png":::

---

## Diagnose test failures

You can use a different approach for diagnosing a load test failure based whether Azure Load Testing was able to run and complete the test script or not.

### Load test failed to complete

When the load test fails to complete, the *test status* of the test run is set to *Failed*.

A load test can fail to complete because of multiple reasons. Examples of why a load test doesn't finish:

- There are errors in the JMeter test script.
- The test script uses JMeter features that Azure Load Testing doesn't support. Learn about the [supported JMeter features](./resource-jmeter-support.md).
- The test script references a file or plugin that isn't available on the test engine instance.
- The autostop functionality interrupted the load test because too many requests are failing and the error rate exceeds the threshold. Learn more about the [autostop functionality in Azure Load Testing](./how-to-define-test-criteria.md#auto-stop-configuration).

Use the following steps to help diagnose a test not finishing:

1. Verify the error details on the load test dashboard.
1. [Download and analyze the test logs](#download-apache-jmeter-worker-logs-for-your-load-test) to identify issues in the JMeter test script.
1. [Download the test results](./how-to-export-test-results.md) to identify issues with individual requests.

### Load test completed

A load test might run the test script until the end (test status equals *Done*), but might not pass all the [test fail criteria](./how-to-define-test-criteria.md). If at least one of the test criteria didn't pass, the *test result* of the test run is set to *Failed*.

Use the following steps to help diagnose a test failing to meet the test criteria:

1. Review the [test fail criteria](./how-to-define-test-criteria.md) in the load test dashboard.
1. Review the sampler statistics in the load test dashboard to further identify which requests in the test script might cause an issue.
1. Review the client-side metrics in the load test dashboard. Optionally, you can filter the charts for a specific request by using the filter controls.
1. [Download the test results](./how-to-export-test-results.md) to get error information for individual requests.
1. Verify the test [engine health metrics](./how-to-high-scale-load.md#monitor-engine-instance-metrics) to identify possible resource contention on the test engines.
1. Optionally, [add app components and monitor server-side metrics](./how-to-monitor-server-side-metrics.md) to identify performance bottlenecks for the application endpoint.

## Download Apache JMeter worker logs for your load test

When you run a load test, the Azure Load Testing test engines execute your Apache JMeter test script. During the load test, Apache JMeter stores detailed logging in the worker node logs. You can download these JMeter worker logs for each test run in the Azure portal. Azure Load Testing generates a worker log for each [test engine instance](./concept-load-testing-concepts.md#test-engine).

> [!NOTE]
> Azure Load Testing only records log messages with `WARN` or `ERROR` level in the worker logs.

For example, if there's a problem with your JMeter script, the load test status is **Failed**. In the worker logs you might find additional information about the cause of the problem.

To download the worker logs for an Azure Load Testing test run, follow these steps:

1. In the [Azure portal](https://portal.azure.com), go to your Azure Load Testing resource.

1. Select **Tests** to view the list of tests, and then select your load test from the list.

1. From the list of test runs, select a test run to view the load test dashboard.

1. On the dashboard, select **Download**, and then select **Logs**.

    The browser should now start downloading a zipped folder that contains the JMeter worker node log file for each [test engine instance](./concept-load-testing-concepts.md#test-engine).

    :::image type="content" source="media/how-to-find-download-logs/logs.png" alt-text="Screenshot that shows how to download the test log files from the test run details page.":::  

1. You can use any zip tool to extract the folder and access the log files.

    The *worker.log* file can help you diagnose the root cause of a failing load test. In the screenshot, you can see that the test failed because of a missing file.

    :::image type="content" source="media/how-to-find-download-logs/jmeter-log.png" alt-text="Screenshot that shows the JMeter log file content.":::  

## Related content

- Learn how to [export the load test result](./how-to-export-test-results.md).
- Learn how to [monitor server-side application metrics](./how-to-monitor-server-side-metrics.md).
- Learn how to [get detailed insights for Azure App Service based applications](./concept-load-test-app-service.md#monitor).
- Learn how to [compare multiple load test runs](./how-to-compare-multiple-test-runs.md).
