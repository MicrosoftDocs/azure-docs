---
title: Identify bottlenecks in Azure portal
titleSuffix: Azure Load Testing
description: In Azure portal, identify & monitor performance bottlenecks with Azure Load Testing.
services: machine-learning
ms.service: machine-learning
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
> * Re-run the load test to verify performance improvements after making cloud configuration changes to the application.
> * Clean up resources.


## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Apache JMeter [Plugins Manager](https://jmeter-plugins.org/install/Install/) installed to run the JMeter script on a fresh JMeter install since the JMX uses an Ultimate Thread group.

## Deploy the sample app

1. In your terminal window, log into Azure and set the subscription:
   ```CLI
   az login
   az account set -s mySubscriptionName
   ```

1. Clone the sample application's source repository. The sample application is a Node.js app consisting of an Azure App Service web component and a Cosmos DB database. The repo also contains a PowerShell script, which deploys the sample app to your Azure subscription, and a JMeter script, which you'll use in later steps.
   ```txt
    git clone https://github.com/Azure-Samples/nodejs-appsvc-cosmosdb-bottleneck.git
   ```

1. Deploy the sample app using the PowerShell script.
   ```txt
    cd nodejs-appsvc-cosmosdb-bottleneck
    .\deploymentscript.ps1
   ```
        
   > [!TIP]
   > PowerShell Core can also be installed on [Linux/WASL](/powershell/scripting/install/installing-powershell-core-on-linux?view=powershell-7.1#ubuntu-1804&preserve-view=true) or [macOS](/powershell/scripting/install/installing-powershell-core-on-macos?view=powershell-7.1).
   > After installing it, you can run the previous command with `pwsh .\deploymentscript.ps1`.

1. At the prompt, provide a unique application name and a location, which by default is  `eastus`.

1. Once deployment is complete, browse to the running sample application with your browser.
   ```txt
    https://<app_name>.azurewebsites.net
   ```

1. You can also go to the [Azure portal](https://portal.azure.com) to view the application's components by going to its resource group.

   :::image type="content" source="/media/tutorial-identify-bottlenecks-in-azure-portal/resource-group.png" alt-text="Resource groups.":::

Now that the application is deployed and running, let’s get started with running your first load test against it.

## Create and run a load test
The sample application's source repository contains a JMeter script named `SampleApp.jmx`. This script performs three API calls on each test iteration:
* `add` - performs a data insert operation on Cosmos DB for the number of visitors on the webapp.

* `get` - performs a GET operation from Cosmos DB to retrieve the count.

* `timestamp` - updates the timestamp since the last user visit to the website.

### Make sure to update the JMeter script with the URL of the webapp deployed in the previous steps.

1. Before starting, make sure you have the directory of the cloned sample app open in Visual Studio Code.

1. Open the JMX script named `SampleApp.jmx` in a text editor, and update lines 36, 81, and 119 with the URL of your newly deployed sample application (tip: the URL needs to be updated in 3 separate places, and do not include the `https://` prefix). Save your changes and close the file.
   ```xml
   <stringProp name="HTTPSampler.domain">APPNAME.azurewebsites.net</stringProp>
   ```

1. Use **Ctrl+Shift+P** to launch the command palette. Begin typing `Azure load` and you would see two commands associated with the Azure Load Test extension:
    * **Create New Test**: This command is used to author a new cloud load test from an existing JMeter script.
    * **Run Current File as Load Test in Cloud**: This command is used to run an existing cloud load test at scale in Azure.

   :::image type="content" source="/media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-new-load-test.png" alt-text="Create a new Azure Load Testing test.":::

1. Select **Create New Test**

1. Select the test plan **SampleApp.jmx**. If there are multiple test plans in the workspace, they will be shown as a list. There is also a browse option to search for a test plan within your local file system.

   :::image type="content" source="/media/tutorial-identify-bottlenecks-in-azure-portal/browse-for-load-test-plans.png" alt-text="Search for Azure Load Testing plans.":::

1. A YAML-based load test with smart defaults opens. By default, the name of the load test matches the JMeter script name we selected in the previous step. You can rename this script. The cloud load test YAML is saved in the current workspace. Learn more about the [YAML properties](https://github.com/microsoft/azureloadtest/wiki/Common-Terminologies#brief-overview-of-yaml-properties).

   ![YAML-based load test](./media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-yaml-based-test.png)

1. You can edit the parameters or comment out the optional parameters if those don’t apply. For instance, since we don’t have any configuration files associated with our current test plan, we can remove these for now.
 
   ![Updated yml](./media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-yaml-based-test-updated.png)

1. Save your YAML changes, and then select **Run Current File as Load Test in Cloud** from the Visual Studio Code command palette. Sign in to Azure if prompted.

   ![Subscriptions](./media/tutorial-identify-bottlenecks-in-azure-portal/select-a-subscription.png)

1. Select the subscription from which you will run your load test. 

1. Select **Create new Test Environment...** and follow the prompts to create this resource (this is an Azure resource that will store load tests, test results, and other related artifacts).

1. Finally, select the resource group *of the sample application being tested* and press **OK**. The load test service begins to monitor and display the application's server metrics in the test results.

   ![Server metrics](./media/tutorial-identify-bottlenecks-in-azure-portal/appcomp.png)

1. If everything is okay, the test will start with status messages as shown below. Select the **View here** link to see the metrics related to your load test in Azure portal. 
    > [!Tip]
    > You can stop a load test at any time from the Azure portal UI.
 
   ![Status messages](./media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-run-messages.png)

1. You can see the streaming client-side metrics while the test is running which auto refreshes every 10 seconds. you can stop the test using the **stop** button and also apply filters to the requests by sampler and errors. The response times can also be aggregated for different percentiles.
 
   ![Response times](./media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-aggregated-by-percentile.png)

1. Wait until the load test fully completes before proceeding to the next section.

## Identify performance bottlenecks in the sample app

Let’s now analyze the load test results to see if there are any performance bottlenecks in our application. We can do this by examining the client-side and server-side metrics in the dashboard.

1. Taking a quick look at the client-side metrics reveals an increase in the 90th percentile **Response times** for the API requests (add and get) compared to the timestamp API(the issues may be database-related since the `add` and `get` APIs interact with Cosmos DB). We note a similar pattern for **Errors**.

   ![Client-side metrics](./media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-client-side-metrics.png)

   ![Errors](./media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-client-side-metrics-errors.png)

1. To understand why this increase occurred, navigate to the **Server side metrics** section. It displays our application's components - in this case an App Service Plan, App Service, and Cosmos DB - and their server metrics.

1. On closer inspection of the App Service Plan metrics, we note that the **CPU Percentage** and **Memory Percentage** metrics are within healthy ranges.

   ![App Service Plan metrics](./media/tutorial-identify-bottlenecks-in-azure-portal/app-service-metrics-for-load-testing.png)

1. Let's now examine metrics for Cosmos DB. We see that the **Normalized RU Consumption** metric shows that we were quickly running at 100% utilization soon after the load test began. This would have caused throttling errors and increased response times for the `add` and `get` web APIs.

   ![Cosmos DB Metrics](./media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-cosmos-db-metrics.png)

1. In the chart above, we note that the **Provisioned Throughput** metric shows that our Cosmos DB has been configured with a maximum throughput of 400 RUs. Let's adjust this limit and verify whether it addresses our performance bottleneck.

## Remove bottleneck and verify the performance

1. To manually configure the RU settings, open a new browser tab and navigate to the Cosmos DB resource that was provisioned as part of our sample application deployment.

   ![RU scaling for Cosmos DB](./media/tutorial-identify-bottlenecks-in-azure-portal/ru-scaling-for-cosmos-db.png)

1. Click the **Scale & Settings** option and set the value to 1200 RU. Then, select the **Save** button in the blade's toolbar. You will be able to see the associated cost too.

   ![Azure Load Testing scale](./media/tutorial-identify-bottlenecks-in-azure-portal/1200-ru-scaling-for-cosmos-db.png)

1. Navigate to our load test's browser tab, and select **Rerun** in the toolbar.

   ![Rerun in Azure Load Testing](./media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-rerun-test.png)

1. You should now see an entry for the new test run with the status column that cycles through Provisioning, Executing, and Done.

1. At any time, select the test run to see how the load test is progressing.

1. Once the load test has finished, check the client-side metrics (response time and errors graphs) and the server-side metrics for Cosmos DB and verify that performance has improved.

   ![Cosmos DB client-side metrics](./media/tutorial-identify-bottlenecks-in-azure-portal/clientresponsenew.png)

   ![Cosmos DB](./media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-cosmos-db-metrics-post-run.png)

We see that the response time for the `add` and `get` APIs has improved compared to our first test run, and also the normalized RU consumption was well under the limits, thereby improving the performance of our application overall.

### Delete all resources

[!INCLUDE [alt-delete-resource-group](../../includes/alt-delete-resource-group.md)]

## Next steps

You now have an Azure Machine Learning workspace that contains:

- A compute instance to use for your development environment.
- A compute cluster to use for submitting training runs.

Use these resources to learn more about Azure Machine Learning and train a model with Python scripts.

> [!div class="nextstepaction"]
> [Learn more with Python scripts](how-to-identify-bottlenecks-in-vs-code.md)
>