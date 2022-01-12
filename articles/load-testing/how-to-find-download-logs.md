---
title: Download Apache JMeter logs for troubleshooting 
titleSuffix: Azure Load Testing
description: Learn how you can troubleshoot Apache JMeter script problems by downloading the Azure Load Testing logs in the Azure portal.
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 11/30/2021
ms.topic: how-to

---
# Troubleshoot JMeter problems by downloading Azure Load Testing Preview logs

In this article, you'll learn how to download the Azure Load Testing Preview logs in the Azure portal to troubleshoot problems with the Apache JMeter script.

When you run a load test, the Azure Load Testing test engines execute your Apache JMeter test script. The Apache JMeter log can help you identify both problems in the JMX file and issues that occur during the test execution. For example, the application endpoint might be unavailable, or the JMX file might contain invalid credentials.

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
- An Azure Load Testing resource that has a completed test run. If you need to create an Azure Load Testing resource, see [Create and run a load test](./quickstart-create-and-run-load-test.md).  

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

    :::image type="content" source="media/how-to-find-download-logs/logs.png" alt-text="Screenshot that shows how to download the load test logs from the test result page.":::  

    The browser should now start downloading the execution logs as a zipped folder.

1. You can use any extraction tool to extract the zipped folder and access the logging information.

    :::image type="content" source="media/how-to-find-download-logs/jmeter-log.png" alt-text="Screenshot that shows the JMeter log file content.":::  

## Next steps

- For more information about comparing test results, see [Compare multiple test results](./how-to-compare-multiple-test-runs.md).

- To learn about performance test automation, see [Configure automated performance testing](./tutorial-cicd-azure-pipelines.md).
