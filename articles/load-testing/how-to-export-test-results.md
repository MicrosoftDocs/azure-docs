---
title: Export load test results for reporting 
titleSuffix: Azure Load Testing
description: Learn how to export load test results in Azure Load Testing for use in third-party tools.
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 11/30/2021
ms.topic: how-to

---
# Export load test results in the Azure portal for use in third-party tools

In this article, you'll learn how to download the test results from Azure Load Testing Preview in the Azure portal. You might use these results for reporting in third-party tools.

The test results contain a comma-separated (CSV) file with details of each application request. In addition, all files for running the Apache JMeter dashboard locally are included.

:::image type="content" source="media/how-to-export-test-results/apache-jmeter-dashboard.png" alt-text="Screenshot that shows the downloaded Apache JMeter dashboard.":::

> [!IMPORTANT]
> Azure Load Testing is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
- An Azure Load Testing resource that has a completed test run. If you need to create an Azure Load Testing resource, see [Create and run a load test](./quickstart-create-and-run-load-test.md).  

    > [!IMPORTANT]
    > A test run needs to be in the **Done**, **Stopped**, or **Failed** status for the results file to be available for download.

## Access and download load test results

In this section, you'll retrieve and download the Azure Load Testing results file from the Azure portal.

1. Navigate to your Azure Load Testing resource in the [Azure portal](https://portal.azure.com).

1. Select **Tests** to view the list of tests, and then select your test.

    :::image type="content" source="media/how-to-export-test-results/test-list.png" alt-text="Screenshot that shows the list of tests for an Azure Load Test resource.":::  

   >[!TIP]
   > You can use the search box and the **Time range** filter to limit the number of tests.

1. Select **...** on the test run, and then select **Download results file**.

    :::image type="content" source="media/how-to-export-test-results/test-run-page-download.png" alt-text="Screenshot that shows how to download the logs of a load test run.":::  

    The browser should now start downloading the test results as a zipped folder.

1. Alternatively, you can download the test results from the test run details page. Select **Download**, and then select **Results**.
    :::image type="content" source="media/how-to-export-test-results/dashboard-download.png" alt-text="Screenshot that shows how to download the test results from the test run details page.":::

1. You can use any zip tool to unzip the folder and access the test results.

    :::image type="content" source="media/how-to-export-test-results/test-results-zip.png" alt-text="Screenshot that shows the test results zip file content.":::  

    The *testreport.csv* file contains the individual requests that the test engine executed during the load test. The Apache JMeter dashboard, which is also included in the zip file, uses this file for its graphs.

## Next steps

- For information about how to compare test results, see [Compare multiple test results](./how-to-compare-multiple-test-runs.md).

- To learn about performance test automation, see [Configure automated performance testing](./tutorial-cicd-azure-pipelines.md)
