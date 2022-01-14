---
title: Troubleshoot load test errors
titleSuffix: Azure Load Testing
description: Learn how you can troubleshoot errors during your load test by downloading and analyzing the Apache JMeter logs in the Azure portal.
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 01/14/2022
ms.topic: how-to

---
# Troubleshoot load test errors by downloading Apache JMeter logs in Azure Load Testing Preview

In this article, you'll learn how to download the Apache JMeter logs for Azure Load Testing Preview in the Azure portal. You can use the logging information to troubleshoot problems while the Apache JMeter script runs.

The Apache JMeter log can help you identify problems in your JMX file, or run-time issues that occur while the test is running. For example, the application endpoint might be unavailable, or the JMX file might contain invalid credentials.

When you run a load test, the Azure Load Testing test engines execute your Apache JMeter test script. While your load test is running, Apache JMeter stores detailed logging information in the worker node logs. You can download the JMeter worker node log for your load test run from the Azure portal to help you diagnose load test errors.

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
- An Azure load testing resource that has a completed test run. If you need to create an Azure load testing resource, see [Create and run a load test](./quickstart-create-and-run-load-test.md).  

## Access and download logs for your load test  

In this section, you retrieve and download the Azure Load Testing logs from the Azure portal.

1. In the [Azure portal](https://portal.azure.com), go to your Azure Load Testing resource.

1. Select **Tests** to view the list of tests, and then select your load test.

    :::image type="content" source="media/how-to-find-download-logs/test-list.png" alt-text="Screenshot that shows the list of load tests for an Azure Load Test resource.":::  

   >[!TIP]
   > To limit the number of tests, use the search box and the **Time range** filter.

1. In the list of tests, select the test run you're working with to view its details.

    :::image type="content" source="media/how-to-find-download-logs/test-run.png" alt-text="Screenshot that shows a list of test runs for the selected load test.":::  

1. On the dashboard, select **Download**, and then select **Logs**.  

    :::image type="content" source="media/how-to-find-download-logs/logs.png" alt-text="Screenshot that shows how to download the load test logs from the test run details page.":::  

    The browser should now start downloading the JMeter worker node log file *worker.log*.

1. You can use a text editor to open the log file.

    :::image type="content" source="media/how-to-find-download-logs/jmeter-log.png" alt-text="Screenshot that shows the JMeter log file content.":::  

    The *worker.log* file can help you diagnose the root cause of a failing load test. In the previous screenshot, you can see that the test failed because a file is missing.

## Next steps

- Learn how to [Monitor server-side application metrics](./how-to-update-rerun-test.md).

- Learn how to [Get detailed insights for Azure App Service based applications](./how-to-appservice-insights.md).

- Learn how to [Compare multiple load test runs](./how-to-compare-multiple-test-runs.md).
