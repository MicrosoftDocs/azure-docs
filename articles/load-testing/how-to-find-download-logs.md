---
title: Download load test JMeter logs in Azure Load Testing
titleSuffix: Azure Load Testing
description: Learn how to download the Azure Load Testing JMeter logs.
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 11/30/2021
ms.topic: how-to

---
# Download Apache JMeter logs in the Azure portal

Learn how you can download the Azure Load Testing Preview logs in the Azure portal to troubleshoot problems with the Apache JMeter script.

When you run a load test, the Azure Load Testing test engines execute your Apache JMeter test script. The Apache JMeter log can help you to identify problems in the JMX file, issues during the test execution. For example, the application endpoint might be unavailable, or the JMX file contains invalid credentials.

> [!IMPORTANT]
> Azure Load Testing is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
- You need an Azure Load Testing resource that has a completed test run. If you need to create an Azure Load Testing resource, see [Create and run a load test](./quickstart-create-and-run-load-test.md).  

## Access and download logs for your load test  

In this section, you'll retrieve and download the Azure Load Testing logs from the Azure portal.

1. Navigate to your Azure Load Testing resource in the [Azure portal](https://portal.azure.com).

1. Select **Tests** to view the list of tests, and then select your test.

    :::image type="content" source="media/how-to-find-download-logs/test-list.png" alt-text="Screenshot that shows the list of tests for an Azure Load Test resource.":::  

   >[!TIP]
   > You can use the search box and the **Time range** filter to limit the number of tests.

1. Select the test run from the list to view the test run details page.

    :::image type="content" source="media/how-to-find-download-logs/test-run.png" alt-text="Screenshot that shows how to select a test run for a load test.":::  

1. On the dashboard, select **Download**, and then **Logs**.  

    :::image type="content" source="media/how-to-find-download-logs/logs.png" alt-text="Screenshot that shows how to download the load test logs from the test result page.":::  

    The browser should now start downloading the execution logs as a zipped folder.

1. You can use any zip tool to unzip the folder and access the logging information.

    :::image type="content" source="media/how-to-find-download-logs/jmeter-log.png" alt-text="Screenshot that shows the JMeter log file content.":::  

## Next steps

- For information about how to compare test results, see [Compare multiple test results](./how-to-compare-multiple-test-runs.md).

- To learn about performance test automation, see [Configure automated performance testing](./tutorial-cicd-azure-pipelines.md)
