---
title: Troubleshoot load test errors
titleSuffix: Azure Load Testing
description: Learn how you can diagnose and troubleshoot errors in Azure Load Testing. Download and analyze the Apache JMeter worker logs in the Azure portal.
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 02/15/2023
ms.topic: how-to

---
# Troubleshoot failing load tests in Azure Load Testing

Learn how to diagnose and troubleshoot errors while running a load test with Azure Load Testing. Download the Apache JMeter worker logs or load test results for detailed logging information. Alternately, you can configure server-side metrics to identify issues in specific Azure application components.

Azure Load Testing runs your Apache JMeter script on the [test engine instances](./concept-load-testing-concepts.md#test-engine). During a load test run, errors might occur at different stages. For example, the JMeter test script could have an error that prevents the test from starting. Or there might be a problem to connect to the application endpoint, which results in the load test to have a large number of failed requests.

Azure Load Testing provides different sources of information to diagnose these errors:

- [Download the Apache JMeter worker logs](#download-apache-jmeter-worker-logs) to investigate issues with JMeter and the test script execution.
- [Diagnose failing tests using test results](./how-to-export-test-results.md) and analyze the response code and response message of each HTTP request.
- [Diagnose failing testing using server-side metrics](./how-to-monitor-server-side-metrics.md) to identify issues with specific Azure application components.

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
- An Azure load testing resource that has a completed test run. If you need to create an Azure load testing resource, see [Create and run a load test](./quickstart-create-and-run-load-test.md).  

## Identify load test errors

You can identify errors in your load test in the following ways:

# [Azure portal](#tab/portal)

- The test run status is failed.

    You can view the test run status in list of test runs for your load test, or in **Test details** in the load test dashboard for your test run.

    :::image type="content" source="media/how-to-find-download-logs/dashboard-test-failed.png" alt-text="Screenshot that shows the load test dashboard, highlighting status information for a failed test." lightbox="media/how-to-find-download-logs/dashboard-test-failed.png":::

- The test run has a non-zero error percentage value.

    If the test error percentage is below the default threshold, your test run shows as succeeded, even though there are errors. You can add [test fail criteria](./how-to-define-test-criteria.md) based on the error percentage.

    You can view the error percentage in the **Statistics** in the load test dashboard for your test run.

- The errors chart in the client-side metrics in the load test dashboard shows errors.

    :::image type="content" source="media/how-to-find-download-logs/dashboard-errors.png" alt-text="Screenshot that shows the load test dashboard, highlighting the error information." lightbox="media/how-to-find-download-logs/dashboard-errors.png":::

# [GitHub Actions](#tab/github)

- The test run status is failed.

    You can view the test run status in GitHub Actions for your repository, on the **Summary** page, or drill down into the workflow run details.

    :::image type="content" source="media/how-to-find-download-logs/github-actions-summary-failed-test.png" alt-text="Screenshot that shows the summary page for an Azure Pipelines run, highlighting the failed load test stage." lightbox="media/how-to-find-download-logs/github-actions-summary-failed-test.png":::

- The test run has a non-zero error percentage value.

    If the test error percentage is below the default threshold, your test run shows as succeeded, even though there are errors. You can add [test fail criteria](./how-to-define-test-criteria.md) based on the error percentage.

    You can view the error percentage in GitHub Actions, in the workflow run logging information.

    :::image type="content" source="media/how-to-find-download-logs/github-actions-log-error-percentage.png" alt-text="Screenshot that shows the GitHub Actions workflow logs, highlighting the error statistics information for a load test run." lightbox="media/how-to-find-download-logs/github-actions-log-error-percentage.png":::

- The test run log contains errors.

    When there's a problem running the load test, the test run log might contain details about the root cause.

    You can view the list of errors in GitHub Actions, on the workflow run **Summary** page, in the **Annotations** section. From this section, you can drill down into the workflow run details to view the error details.

# [Azure Pipelines](#tab/pipelines)

- The test run status is failed.

    You can view the test run status in Azure Pipelines, on the pipeline run **Summary** page, or drill down into the pipeline run details.

    :::image type="content" source="media/how-to-find-download-logs/azure-pipelines-summary-failed-test.png" alt-text="Screenshot that shows the summary page for an Azure Pipelines run, highlighting the failed load test stage.":::

- The test run has a non-zero error percentage value.

    If the test error percentage is below the default threshold, your test run shows as succeeded, even though there are errors. You can add [test fail criteria](./how-to-define-test-criteria.md) based on the error percentage.

    You can view the error percentage in Azure Pipelines, in the pipeline run logging information.

    :::image type="content" source="media/how-to-find-download-logs/azure-pipelines-log-error-percentage.png" alt-text="Screenshot that shows the Azure Pipelines run logs, highlighting the error statistics information for a load test run." lightbox="media/how-to-find-download-logs/azure-pipelines-log-error-percentage.png":::

- The test run log contains errors.

    When there's a problem running the load test, the test run log might contain details about the root cause.

    You can view the list of errors in Azure Pipelines, on the pipeline run **Summary** page, in the **Errors** section. From this section, you can drill down into the pipeline run details to view the error details.

---

## Download Apache JMeter worker logs

When you run a load test, the Azure Load Testing test engines execute your Apache JMeter test script. During the load test, Apache JMeter stores detailed logging in the worker node logs. You can download these JMeter worker logs for each test run in the Azure portal. Azure Load Testing generates a worker log for each [test engine instance](./concept-load-testing-concepts.md#test-engine).

For example, if there's a problem with your JMeter script, the load test status will be **Failed**. In the worker logs you might find additional information about the cause of the problem.

To download the worker logs for an Azure Load Testing test run, follow these steps:

1. In the [Azure portal](https://portal.azure.com), go to your Azure Load Testing resource.

1. Select **Tests** to view the list of tests, and then select your load test from the list.

    :::image type="content" source="media/how-to-find-download-logs/test-list.png" alt-text="Screenshot that shows the list of load tests for an Azure Load Test resource.":::  

1. Select a test run from the list to view the test run dashboard.

1. On the dashboard, select **Download**, and then select **Logs**.

    The browser should now start downloading a zipped folder that contains the JMeter worker node log file for each [test engine instance](./concept-load-testing-concepts.md#test-engine).

    :::image type="content" source="media/how-to-find-download-logs/logs.png" alt-text="Screenshot that shows how to download the test log files from the test run details page.":::  

1. You can use any zip tool to extract the folder and access the log files.

    The *worker.log* file can help you diagnose the root cause of a failing load test. In the screenshot, you can see that the test failed because of a missing file.

    :::image type="content" source="media/how-to-find-download-logs/jmeter-log.png" alt-text="Screenshot that shows the JMeter log file content.":::  

## Diagnose failing tests using test results

## Diagnose failing testing using server-side metrics

## Next steps

- Learn how to [Export the load test result](./how-to-export-test-results.md).
- Learn how to [Monitor server-side application metrics](./how-to-monitor-server-side-metrics.md).
- Learn how to [Get detailed insights for Azure App Service based applications](./how-to-appservice-insights.md).
- Learn how to [Compare multiple load test runs](./how-to-compare-multiple-test-runs.md).
