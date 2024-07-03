---
title: Export load test results for reporting 
titleSuffix: Azure Load Testing
description: Learn how to export load test results in Azure Load Testing and use them for reporting in third-party tools.
services: load-testing
ms.service: load-testing
ms.author: ninallam
author: ninallam
ms.date: 02/08/2024
ms.topic: how-to
# CustomerIntent: As a tester, I want to understand how I can export the load test results, so that I can use other reporting tools to analyze the load test results.
---
# Export test results from Azure Load Testing for use in third-party tools

In this article, you learn how to export your Azure Load Testing test results and reports. You can download the results by using the Azure portal, as an artifact in your CI/CD workflow, in JMeter by using a backend listener, or by copying the results from an Azure storage account. You can use these results for reporting in third-party tools or for diagnosing test failures. Azure Load Testing generates the test results in comma-separated values (CSV) file format, and provides details of each application request for the load test.

You can also use the test results to diagnose errors during a load test. The `responseCode` and `responseMessage` fields give you more information about failed requests. For more information about investigating errors, see [Diagnose failing load tests](./how-to-diagnose-failing-load-test.md).

You can generate the Apache JMeter dashboard from the CSV log file following the steps mentioned [here](https://jmeter.apache.org/usermanual/generating-dashboard.html#report).

You can also download the Azure Load Testing Result dashboard as an HTML report for offline viewing and collaboration. 

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
- An Azure Load Testing resource that has a completed test run. If you need to create an Azure Load Testing resource, see [Create and run a load test](./quickstart-create-and-run-load-test.md).  

## Test results file format

Azure Load Testing generates a test results CSV file for each [test engine instance](./concept-load-testing-concepts.md#test-engine). Learn how you can [scale out your load test](./how-to-high-scale-load.md).

Azure Load Testing uses the [Apache JMeter CSV log format](https://jmeter.apache.org/usermanual/listeners.html#csvlogformat). For more information about the different fields, see the [JMeter Glossary in the Apache JMeter documentation](https://jmeter.apache.org/usermanual/glossary.html).

You can find the details of each application request for the load test run in the test results file. The following snippet shows a sample test result:

```output
timeStamp,elapsed,label,responseCode,responseMessage,threadName,dataType,success,failureMessage,bytes,sentBytes,grpThreads,allThreads,URL,Latency,IdleTime,Connect
1676040230680,104,Homepage,200,OK,172.18.33.7-Thread Group 1-5,text,true,,1607,133,5,5,https://www.example.com/,104,0,100
1676040230681,101,Homepage,200,OK,172.18.33.7-Thread Group 1-3,text,true,,1591,133,5,5,https://www.example.com/,101,0,93
1676040230680,101,Homepage,200,OK,172.18.33.7-Thread Group 1-1,text,true,,1591,133,5,5,https://www.example.com/,98,0,94
```

## Access and download load test results and report

After a load test run finishes, you can access and download the load test results and the HTML report through the Azure portal, or as an artifact in your CI/CD workflow.

>[!IMPORTANT]
>For load tests with more than 45 engine instances or a greater than 3-hour test run duration, the results file is not available for download. You can [configure a JMeter Backend Listener to export the results](#export-test-results-using-jmeter-backend-listeners) to a data store of your choice or [copy the results from a storage account container](#copy-test-artifacts-from-a-storage-account-container).
>For tests with samplers greater than 30, the downloaded HTML report will only have graphs for data aggregated over all samplers. Graphs will not show sampler-wise data. Additionally, the downloaded report will only show graphs corresponding to client-side metrics.

# [Azure portal](#tab/portal)

To download the test results and the HTML report for a test run in the Azure portal:

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

   * Select **Download** on the **Test run details** pane. To download the results, select **Results**. To download the HTML report, select **Report**.

     :::image type="content" source="media/how-to-export-test-results/download-dashboard.png" alt-text="Screenshot that shows how to download the test results from the 'Test run details' pane.":::

1. You can use any zip tool to extract the folder and access the downloaded files.

    :::image type="content" source="media/how-to-export-test-results/test-results-zip.png" alt-text="Screenshot that shows the test results zip file in the downloads list.":::  

    The results folder contains a separate CSV file for every test engine and contains details of requests that the test engine executed during the load test.

   The report folder contains an HTML file that provides a summary of the test run and graphs of the performance metrics for offline viewing and collaboration. 

# [GitHub Actions](#tab/github)

When you run a load test as part of your CI/CD pipeline, Azure Load Testing generates test results and reports. Follow these steps to publish these test results and attach them to your CI/CD pipeline run:

1. Go to your GitHub repository, and select **Code**.

1. In the **Code** window, select your GitHub Actions workflow YAML file in the `.github/workflow` folder.

    :::image type="content" source="./media/how-to-export-test-results/github-repository-workflow-definition-file.png" alt-text="Screenshot that shows the folder that contains the GitHub Actions workflow definition file." lightbox="./media/how-to-export-test-results/github-repository-workflow-definition-file.png":::

1. Edit the workflow file and add the `actions/upload-artifact` action after the `azure/load-testing` action in the workflow file.

    Azure Load Testing places the test results and the HTML report in the `loadTest` folder of the GitHub Actions workspace.

    ```yml
    - name: 'Azure Load Testing'
        uses: azure/load-testing@v1
        with:
          loadTestConfigFile: 'SampleApp.yaml'
          loadTestResource: ${{ env.LOAD_TEST_RESOURCE }}
          resourceGroup: ${{ env.LOAD_TEST_RESOURCE_GROUP }}
      
    - uses: actions/upload-artifact@v2
      with:
        name: loadTestResults
        path: ${{ github.workspace }}/loadTest
    ```

1. After your GitHub Actions workflow completes, you can select the **loadTestResults** folder from the **Artifacts** section on the **Summary** page of the workflow run.

    :::image type="content" source="./media/how-to-export-test-results/github-actions-run-summary.png" alt-text="Screenshot that shows the GitHub Actions workflow summary page, highlighting the test results in the Artifacts section." lightbox="./media/how-to-export-test-results/github-actions-run-summary.png":::

# [Azure Pipelines](#tab/pipelines)

When you run a load test as part of your CI/CD pipeline, Azure Load Testing generates a test results file. Follow these steps to publish these test results and attach them to your CI/CD pipeline run:

1. In your Azure DevOps project, select **Pipelines** in the left navigation, and select your pipeline from the list.

1. On the pipeline details page, select **Edit** to edit the workflow definition.

1. Edit the workflow file and add the `publish` task after the `AzureLoadTest` task in the workflow file.

    Azure Load Testing places the test results and the HTML report in the `loadTest` folder of the Azure Pipelines default working directory.

    ```yml
    - task: AzureLoadTest@1
      inputs:
        azureSubscription: $(serviceConnection)
        loadTestConfigFile: 'SampleApp.yaml'
        resourceGroup: $(loadTestResourceGroup)
        loadTestResource: $(loadTestResource)
          
    - publish: $(System.DefaultWorkingDirectory)/loadTest
      artifact: results
    ```
1. After your Azure Pipelines workflow completes, you can select the test results from the **Stages** section on the **Summary** page of the workflow run.

    You can find and download the test results and the report in the **Results** folder.

    :::image type="content" source="./media/how-to-export-test-results/azure-pipelines-run-summary.png" alt-text="Screenshot that shows the Azure Pipelines workflow summary page, highlighting the test results in the Stages section." lightbox="./media/how-to-export-test-results/azure-pipelines-run-summary.png":::
---

## Export test results using JMeter backend listeners

You can use a [JMeter backend listener](https://jmeter.apache.org/usermanual/component_reference.html#Backend_Listener) to export test results to databases like InfluxDB, MySQL, or monitoring tools like Azure Application Insights.

You can use the default JMeter backend listeners, backend listeners from [jmeter-plugins.org](https://jmeter-plugins.org), or a custom backend listener in the form of a Java archive (JAR) file.

The following code snippet shows an example of how to use the backend listener for Azure Application Insights, in a JMeter file (JMX):

:::code language="xml" source="~/azure-load-testing-samples/jmeter-backend-listeners/sample-backend-listener-appinsights.jmx" range="85-126" :::

You can download the full [example of using the Azure Application Insights backend listener](https://github.com/Azure-Samples/azure-load-testing-samples/tree/main/jmeter-backend-listeners).

## Copy test artifacts from a storage account container

>[!IMPORTANT]
>Copying test artifacts from a storage account container is only enabled for load tests with more than 45 engine instances or with a test run duration greater than three hours. 

To copy the test results and log files for a test run from a storage account, in the Azure portal:

1. In the [Azure portal](https://portal.azure.com), go to your Azure Load Testing resource.

1. On the left pane, select **Tests** to view a list of tests, and then select your test.

    :::image type="content" source="media/how-to-export-test-results/test-list.png" alt-text="Screenshot that shows the list of tests for an Azure Load Testing resource.":::
1. From the list of test runs, select your test run.

    :::image type="content" source="media/how-to-export-test-results/test-runs-list.png" alt-text="Screenshot that shows the list of test runs for a test in an Azure Load Testing resource.":::

   >[!TIP]
   > To limit the number of tests to display in the list, you can use the search box and the **Time range** filter.

1. On the **Test run details** pane, select **Copy artifacts**.

     :::image type="content" source="media/how-to-export-test-results/test-run-page-copy-artifacts.png" alt-text="Screenshot that shows how to copy the test artifacts from the 'Test run details' pane.":::

     > [!NOTE]
     > A load test run needs to be in the *Done*, *Stopped*, or *Failed* status for the results file to be available for download.

1. Copy the SAS URL of the storage account container. 

    You can use the SAS URL in the [Azure Storage Explorer](/azure/vs-azure-tools-storage-manage-with-storage-explorer?tabs=windows#shared-access-signature-sas-url) or [AzCopy](/azure/storage/common/storage-use-azcopy-blobs-copy#copy-a-container) to copy the results CSV files and the log files for the test run to your storage account.
    
    The SAS URL is valid for 60 minutes from the time it gets generated. If the URL expires, select **Copy artifacts** to generate a new SAS URL. 

## Related content

- Learn more about [Diagnosing failing load tests](./how-to-diagnose-failing-load-test.md).
- Learn more about [Comparing multiple test results](./how-to-compare-multiple-test-runs.md).
- Learn more about [Configuring automated performance testing in Azure Pipelines](./quickstart-add-load-test-cicd.md).
