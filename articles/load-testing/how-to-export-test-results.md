---
title: Export load test results for reporting 
titleSuffix: Azure Load Testing
description: Learn how to export load test results in Azure Load Testing and use them for reporting in third-party tools.
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 03/31/2022
ms.topic: how-to

---
# Export test results from Azure Load Testing Preview for use in third-party tools

In this article, you'll learn how to download the test results from Azure Load Testing Preview in the Azure portal. You might use these results for reporting in third-party tools.

The test results contain comma-separated values (CSV) file(s) with details of each application request. See [Apache JMeter CSV log format](https://jmeter.apache.org/usermanual/listeners.html#csvlogformat) and the [Apache JMeter Glossary](https://jmeter.apache.org/usermanual/glossary.html) for details about the different fields.

You can also use the test results to diagnose errors during a load test. The `responseCode` and `responseMessage` fields give you more information about failed requests. For more information about investigating errors, see [Troubleshoot test execution errors](./how-to-find-download-logs.md).

You can generate the Apache JMeter dashboard from the CSV log file following the steps mentioned [here](https://jmeter.apache.org/usermanual/generating-dashboard.html#report).

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
- An Azure Load Testing resource that has a completed test run. If you need to create an Azure Load Testing resource, see [Create and run a load test](./quickstart-create-and-run-load-test.md).  

## Access and download load test results

In this section, you'll retrieve and download the Azure Load Testing results file from the Azure portal.

1. In the [Azure portal](https://portal.azure.com), go to your Azure Load Testing resource.

1. On the left pane, select **Tests** to view a list of tests, and then select your test.

    :::image type="content" source="media/how-to-export-test-results/test-list.png" alt-text="Screenshot that shows the list of tests for an Azure Load Testing resource.":::  

   >[!TIP]
   > To limit the number of tests to display in the list, you can use the search box and the **Time range** filter.

1. You can download the test results file as a zipped folder in either of two ways:

   * Select the ellipsis (**...**) next to the load test run you're working with, and then select **Download results file**.

     :::image type="content" source="media/how-to-export-test-results/test-run-page-download.png" alt-text="Screenshot that shows how to download the results file for a load test run.":::  

     > [!NOTE]
     > A load test run needs to have a *Done*, *Stopped*, or *Failed* status for the results file to be available for download.

   * On the **Test run details** pane, select **Download**, and then select **Results**.

     :::image type="content" source="media/how-to-export-test-results/dashboard-download.png" alt-text="Screenshot that shows how to download the test results from the 'Test run details' pane.":::

1. You can use any zip tool to extract the folder and access the test results.

    :::image type="content" source="media/how-to-export-test-results/test-results-zip.png" alt-text="Screenshot that shows the test results zip file in the downloads list.":::  

    The folder contains a separate CSV file for every test engine and contains details of requests that the test engine executed during the load test.

## Next steps

- Learn more about [Troubleshooting test execution errors](./how-to-find-download-logs.md).
- For information about comparing test results, see [Compare multiple test results](./how-to-compare-multiple-test-runs.md).
- To learn about performance test automation, see [Configure automated performance testing](./tutorial-identify-performance-regression-with-cicd.md).
