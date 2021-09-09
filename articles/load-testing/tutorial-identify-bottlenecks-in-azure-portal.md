---
title: Identify bottlenecks in Azure portal
titleSuffix: Azure Load Testing
description: In Azure portal, identify & monitor performance bottlenecks with Azure Load Testing.
services: load-testing
ms.service: load-testing
ms.author: jmartens
author: j-martens
ms.date: 8/25/2021
ms.topic: tutorial
---

# Run a load test in Azure portal to identify performance bottlenecks

In this tutorial, you'll learn how to load test a sample application to identify performance bottlenecks, including:

> [!div class="checklist"]
> * Set up a sample application to load test. The application consists of a Web API deployed to Azure App Service that interacts with an Azure Cosmos DB data store.
> * Create and run a load test that exercises the sample application.
> * Use the test results to identify performance bottlenecks in the application.
> * Re-run the load test to check performance improvements after making cloud configuration changes to the application.
> * Clean up resources.


## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Apache JMeter [Plugins Manager](https://jmeter-plugins.org/install/Install/) installed to run the JMeter script on a fresh JMeter install since the JMX uses an Ultimate Thread group.

## Deploy the sample app

1. In your terminal window, sign in to Azure and set the subscription:
 
   ```CLI
   az login
   az account set -s mySubscriptionName
   ```

1. Clone the sample application's source repository.

   ```txt
    git clone https://github.com/Azure-Samples/nodejs-appsvc-cosmosdb-bottleneck.git
   ```

    The sample application is a Node.js app consisting of an Azure App Service web component and a Cosmos DB database. The repo also includes a PowerShell script that deploys the sample app to your Azure subscription. It also has a JMeter script that you'll use in later steps.

1. Deploy the sample app using the PowerShell script.

   ```txt
    cd nodejs-appsvc-cosmosdb-bottleneck
    .\deploymentscript.ps1
   ```
        
   > [!TIP]
   > PowerShell Core can also be installed on [Linux/WASL](/powershell/scripting/install/installing-powershell-core-on-linux?view=powershell-7.1#ubuntu-1804&preserve-view=true) or [macOS](/powershell/scripting/install/installing-powershell-core-on-macos?view=powershell-7.1&preserve-view=true).
   > After installing it, you can run the previous command with `pwsh .\deploymentscript.ps1`.

1. At the prompt, provide a unique application name and a location, which by default is  `eastus`.

1. Once deployment is finished, browse to the running sample application with your browser.

   ```txt
    https://<app_name>.azurewebsites.net
   ```

1. You can also go to the [Azure portal](https://portal.azure.com) to view the application's components by going to its resource group.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/resource-group.png" alt-text="Resource groups.":::

Now that the application is deployed and running, let’s get started with running your first load test against it.

## Create and run a load test
The sample application's source repository includes a JMeter script named `SampleApp.jmx`. This script carries out three API calls on each test iteration:

* `add` - Carries out a data insert operation on Cosmos DB for the number of visitors on the webapp.

* `get` - Carries out a GET operation from Cosmos DB to retrieve the count.

* `timestamp` - Updates the timestamp since the last user went to the website.

### Make sure to update the JMeter script with the URL of the webapp deployed in the previous steps.

1. Before starting, make sure you have the directory of the cloned sample app open in Visual Studio Code.

1. Open the JMX script named `SampleApp.jmx` in a text editor, and update lines 36, 81, and 119 with the URL of your newly deployed sample application (tip: Update the URL in three separate places, and don't include the `https://` prefix). Save your changes and close the file.

   ```xml
   <stringProp name="HTTPSampler.domain">APPNAME.azurewebsites.net</stringProp>
   ```

1. Use **Ctrl+Shift+P** to launch the command palette. Begin typing `Azure load` and you would see two commands associated with the Azure Load Test extension:

    * **Create New Test**: This command is used to author a new cloud load test from an existing JMeter script.
    * **Run Current File as Load Test in Cloud**: This command is used to run an existing cloud load test at scale in Azure.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-new-load-test.png" alt-text="Create a new Azure Load Testing test.":::

1. Select **Create New Test**

1. Select the test plan **SampleApp.jmx**. If there are multiple test plans in the workspace, they'll be shown as a list. There's also a browse option to search for a test plan within your local file system.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/browse-for-load-test-plans.png" alt-text="Search for Azure Load Testing plans.":::

1. A YAML-based load test with smart defaults opens. By default, the name of the load test matches the JMeter script name you selected in the previous step. You can rename this script. The cloud load test YAML is saved in the current workspace. Learn more about the [YAML properties](https://github.com/microsoft/azureloadtest/wiki/Common-Terminologies#brief-overview-of-yaml-properties).

   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-yaml-based-test.png" alt-text="YAML-based load test for Azure Load Testing.":::

1. You can edit the parameters or comment out the optional parameters if they don’t apply. For instance, since you don’t have configuration files associated with your current test plan, you can remove them for now.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-yaml-based-test-updated.png" alt-text="(Updated) YAML-based load test for Azure Load Testing.":::
 
1. Save your YAML changes, and then select **Run Current File as Load Test in Cloud** from the Visual Studio Code command palette. Sign in to Azure if prompted.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/select-a-subscription.png" alt-text="Select an Azure subscription for Azure Load Testing.":::

1. Select the subscription from which you'll run your load test. 

1. Select **Create new Test Environment...** and follow the prompts to create the resource. It's an Azure resource that will store load tests, test results, and other related artifacts.

1. Finally, select the resource group *of the sample application being tested* and press **OK**. Azure Load Testing service begins to monitor and display the application's server metrics in the test results.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/app-server-results.png" alt-text="Application's server metrics monitored by Azure Load Testing.":::

1. If everything is okay, the test will start with status messages as shown below. Select the **View here** link to see the metrics related to your load test in Azure portal. 

    > [!Tip]
    > You can stop a load test at any time from the Azure portal UI.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-run-messages.png" alt-text="Azure Load Testing status messages.":::

1. You can see the streaming client-side metrics while the test is running which auto refreshes every 10 seconds. you can stop the test using the **stop** button and also apply filters to the requests by sampler and errors. The response times can also be aggregated for different percentiles.
 
   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-aggregated-by-percentile.png" alt-text="Azure Load Testing: results by percentile.":::

1. Wait until the load test finishes fully before proceeding to the next section.

## Identify performance bottlenecks in the sample app

Now, let’s analyze the load test results. Check if there are any performance bottlenecks in the application by examining the client-side and server-side metrics in the dashboard.

1. Taking a quick look at the client-side metrics reveals an increase in the 90th percentile **Response times** for the API requests (add and get) compared to the timestamp API (the issues may be database-related since the `add` and `get` APIs interact with Cosmos DB). Notice a similar pattern for **Errors**.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-client-side-metrics.png" alt-text="Azure Load Testing: Client-side metrics.":::

   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-client-side-metrics-errors.png" alt-text="Errors in Azure Load Testing.":::

1. To learn why this increase occurred, go to the **Server side metrics** section. It shows your application's components - in this case an App Service Plan, App Service, and Cosmos DB - and their server metrics.

1. On closer inspection of the App Service Plan metrics, you'll note that the **CPU Percentage** and **Memory Percentage** metrics are within healthy ranges.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/app-service-metrics-for-load-testing.png" alt-text="App Service Plan metrics.":::

1. Examine metrics for Cosmos DB. You'll see that the **Normalized RU Consumption** metric shows that you were quickly running at 100% utilization soon after the load test began. The high utilization would have caused throttling errors and increased response times for the `add` and `get` web APIs.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-cosmos-db-metrics.png" alt-text="Cosmos DB Metrics.":::

1. In the chart above, check out the **Provisioned Throughput** metri. It shows that your Cosmos DB has been set up with a maximum throughput of 400 RUs. Go ahead and adjust this limit and check whether it addresses your performance bottleneck.

## Remove bottleneck and check the performance

To manually set up the RU settings:

1. Open a new browser tab

1. Go to the Cosmos DB resource that was provisioned as part of the sample application deployment.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/ru-scaling-for-cosmos-db.png" alt-text="RU scaling for Cosmos DB.":::

1. Select the **Scale & Settings** option and set the value to 1200 RU. Then, select the **Save** button. You'll see the associated cost too.
 
   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/1200-ru-scaling-for-cosmos-db.png" alt-text="Azure Load Testing scale at 1200 RU.":::

1. Go to your load test's browser tab, and select **Rerun** in the toolbar.
 
   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-rerun-test.png" alt-text="Rerun in Azure Load Testing.":::

1. You'll see an entry for the new test run with the status column that cycles through Provisioning, Executing, and Done.

1. At any time, select the test run to see how the load test is progressing.

1. Once the load test has finished, check the client-side metrics (response time and errors graphs) and the server-side metrics for Cosmos DB and check that performance has improved.
 
   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-cosmos-db-metrics.png" alt-text="Cosmos DB client-side metrics.":::

   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-cosmos-db-metrics-post-run.png" alt-text="Cosmos DB client-side metrics after the run.":::

After those changes, you'll see that:

* The response time for the `add` and `get` APIs has improved compared to the first test run.
* The normalized RU consumption was well under the limits.

Both improve the overall performance of your application.

### Delete all resources

[!INCLUDE [alt-delete-resource-group](../../includes/alt-delete-resource-group.md)]

## Next steps

You now have an Azure Machine Learning workspace that has:

- A compute instance to use for your development environment.
- A compute cluster to use for submitting training runs.

Use these resources to learn more about Azure Machine Learning and train a model with Python scripts.

> [!div class="nextstepaction"]
> [Learn more with Python scripts](how-to-identify-bottlenecks-in-vs-code.md)
