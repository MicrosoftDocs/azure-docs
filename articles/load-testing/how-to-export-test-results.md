---
title: Export load test results for reporting 
titleSuffix: Azure Load Testing
description: Learn how to export load test results in Azure Load Testing and use them for reporting in third-party tools.
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 02/10/2023
ms.topic: how-to

---
# Export test results from Azure Load Testing for use in third-party tools

In this article, you learn how to download the test results from Azure Load Testing in the Azure portal. You might use these results for reporting in third-party tools or for diagnosing test failures. Azure Load Testing generates the test results in comma-separated values (CSV) file format, and provides details of each application request for the load test.

You can also use the test results to diagnose errors during a load test. The `responseCode` and `responseMessage` fields give you more information about failed requests. For more information about investigating errors, see [Diagnose failing load tests](./how-to-diagnose-failing-load-test.md).

You can generate the Apache JMeter dashboard from the CSV log file following the steps mentioned [here](https://jmeter.apache.org/usermanual/generating-dashboard.html#report).

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
- An Azure Load Testing resource that has a completed test run. If you need to create an Azure Load Testing resource, see [Create and run a load test](./quickstart-create-and-run-load-test.md).  

## Test results file

Azure Load Testing generates a test results CSV file for each [test engine instance](./concept-load-testing-concepts.md#test-engine). Learn how you can [scale out your load test](./how-to-high-scale-load.md).

Azure Load Testing uses the [Apache JMeter CSV log format](https://jmeter.apache.org/usermanual/listeners.html#csvlogformat). For more information about the different fields, see the [JMeter Glossary in the Apache JMeter documentation](https://jmeter.apache.org/usermanual/glossary.html).

You can find the details of each application request for the load test run in the test results file. The following snippet shows a sample test result:

```output
timeStamp,elapsed,label,responseCode,responseMessage,threadName,dataType,success,failureMessage,bytes,sentBytes,grpThreads,allThreads,URL,Latency,IdleTime,Connect
1676040230680,104,Homepage,200,OK,172.18.33.7-Thread Group 1-5,text,true,,1607,133,5,5,https://www.example.com/,104,0,100
1676040230681,101,Homepage,200,OK,172.18.33.7-Thread Group 1-3,text,true,,1591,133,5,5,https://www.example.com/,101,0,93
1676040230680,101,Homepage,200,OK,172.18.33.7-Thread Group 1-1,text,true,,1591,133,5,5,https://www.example.com/,98,0,94
```

## Access and download load test results
>[!IMPORTANT]
>For load tests with more than 45 engine instances or a greater than 3-hour test run duration, the results file will not be available for download. You can configure a [JMeter Backend Listener](#export-test-results-using-jmeter-backend-listeners) to export the results to a data store of your choice. 
# [Azure portal](#tab/portal)

To download the test results for a test run in the Azure portal:

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

# [GitHub Actions](#tab/github)

When you run a load test as part of your CI/CD pipeline, Azure Load Testing generates a test results file. Follow these steps to publish these test results and attach them to your CI/CD pipeline run:

1. Go to your GitHub repository, and select **Code**.

1. In the **Code** window, select your GitHub Actions workflow YAML file in the `.github/workflow` folder.

    :::image type="content" source="./media/how-to-export-test-results/github-repository-workflow-definition-file.png" alt-text="Screenshot that shows the folder that contains the GitHub Actions workflow definition file." lightbox="./media/how-to-export-test-results/github-repository-workflow-definition-file.png":::

1. Edit the workflow file and add the `actions/upload-artifact` action after the `azure/load-testing` action in the workflow file.

    Azure Load Testing places the test results in the `loadTest` folder of the GitHub Actions workspace.

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

1. After your GitHub Actions workflow completes, you can select the test results from the **Artifacts** section on the **Summary** page of the workflow run.

    :::image type="content" source="./media/how-to-export-test-results/github-actions-run-summary.png" alt-text="Screenshot that shows the GitHub Actions workflow summary page, highlighting the test results in the Artifacts section." lightbox="./media/how-to-export-test-results/github-actions-run-summary.png":::

# [Azure Pipelines](#tab/pipelines)

When you run a load test as part of your CI/CD pipeline, Azure Load Testing generates a test results file. Follow these steps to publish these test results and attach them to your CI/CD pipeline run:

1. In your Azure DevOps project, select **Pipelines** in the left navigation, and select your pipeline from the list.

1. On the pipeline details page, select **Edit** to edit the workflow definition.

1. Edit the workflow file and add the `publish` task after the `AzureLoadTest` task in the workflow file.

    Azure Load Testing places the test results in the `loadTest` folder of the Azure Pipelines default working directory.

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

    You can find and download the test results in the **Results** folder.

    :::image type="content" source="./media/how-to-export-test-results/azure-pipelines-run-summary.png" alt-text="Screenshot that shows the Azure Pipelines workflow summary page, highlighting the test results in the Stages section." lightbox="./media/how-to-export-test-results/azure-pipelines-run-summary.png":::
---
## Export test results using JMeter Backend Listeners
You can use [JMeter Backend Listeners](https://jmeter.apache.org/usermanual/component_reference.html#Backend_Listener) to export test results to databases like InfluxDB, MySQL or monitoring tools like AppInsights. 

You can use the backend listeners available by default in JMeter, backend listeners from [jmeter-plugins.org](https://jmeter-plugins.org), or a custom backend listener in the form of a Java archive (JAR) file. 

A sample JMeter script that uses a [backend listener for Azure Application Insights](https://github.com/adrianmo/jmeter-backend-azure) is available [here](https://github.com/Azure-Samples/azure-load-testing-samples/tree/main/jmeter-backend-listeners).

The following code snippet shows an example of a backend listener, for Azure Application Insights, in a JMX file:
:::code language="xml" source="~/azure-load-testing-samples/jmeter-backend-listeners/sample-backend-listener-appinsights.jmx" range="85-126" :::

## Next steps

- Learn more about [Diagnosing failing load tests](./how-to-diagnose-failing-load-test.md).
- For information about comparing test results, see [Compare multiple test results](./how-to-compare-multiple-test-runs.md).
- To learn about performance test automation, see [Configure automated performance testing](./tutorial-identify-performance-regression-with-cicd.md).
