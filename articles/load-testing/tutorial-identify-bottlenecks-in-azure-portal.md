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

 This article describes how to load test a sample application to identify performance bottlenecks. The application consists of a Web API deployed to Azure App Service that interacts with an Azure Cosmos DB data store.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> - Deploy the sample app.
> - Create and run a load test.
> - Identify performance bottlenecks in the app.
> - Remove the bottleneck.
> - Re-run the load test to check performance improvements.


## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Download and install:
  - [VS Code](https://code.visualstudio.com/Download)
  - The [Azure Load Testing extension](https://github.com/microsoft/azureloadtest#installation-of-vs-code-extension)
  - [Java](https://java.com/en/download/windows_manual.jsp)
  - [Apache JMeter](https://jmeter.apache.org/download_jmeter.cgi)
  - Apache JMeter [Plugins Manager](https://jmeter-plugins.org/install/Install/)

    Since the JMX uses an Ultimate Thread group,  Install Plugins Manager to run the JMeter script on a fresh JMeter install .

## Deploy the sample app

1. In your terminal window, sign in to Azure and set the subscription:
 
   ```powershell
   az login
   az account set -s <your-Azure-Subscription-ID>
   ```

1. Clone the sample application's source repository.

   ```powershell
    git clone https://github.com/Azure-Samples/nodejs-appsvc-cosmosdb-bottleneck.git
   ```

    The sample application is a Node.js app consisting of an Azure App Service web component and a Cosmos DB database. The repo also includes a PowerShell script that deploys the sample app to your Azure subscription. It also has a JMeter script that you'll use in later steps.

1. Deploy the sample app using the PowerShell script.

   ```powershell
    cd nodejs-appsvc-cosmosdb-bottleneck
    .\deploymentscript.ps1
   ```
        
   > [!TIP]
   > PowerShell Core can also be installed on [Linux/WASL](/powershell/scripting/install/installing-powershell-core-on-linux?view=powershell-7.1#ubuntu-1804&preserve-view=true) or [macOS](/powershell/scripting/install/installing-powershell-core-on-macos?view=powershell-7.1&preserve-view=true).
   > After installing it, you can run the previous command with `pwsh .\deploymentscript.ps1`.

1. At the prompt, provide a unique application name and a location, which by default is  `eastus`.

   > [!IMPORTANT]
   > For your webapp name, use only lowercase letters and numbers. No spaces. No special characters.

1. Once deployment is finished, browse to the running sample application.

   ```powershell
   Start-Process "https://<your-app-name>.azurewebsites.net"
   ```

1. You can also go to the [Azure portal](https://portal.azure.com) to view the application's components by going to its resource group.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/resource-group.png" alt-text="Resource groups.":::

Now that the application is deployed and running, let’s get started with running your first load test against it.

## Create and run a load test
The sample application's source repository includes a JMeter script named `SampleApp.jmx`. This script carries out three API calls on each test iteration:

* `add` - Carries out a data insert operation on Cosmos DB for the number of visitors on the webapp.

* `get` - Carries out a GET operation from Cosmos DB to retrieve the count.

* `lasttimestamp` - Updates the timestamp since the last user went to the website.

### Update the JMeter script with the URL of the webapp

Make sure to update the JMeter script with the URL of the webapp deployed in the previous section.

Before you start, make sure you have the directory of the cloned sample app open in VS Code.

1. Open `SampleApp.jmx`.

1. Search for `<stringProp name="HTTPSampler.domain">`.

   You'll see three instances of `<stringProp name="HTTPSampler.domain">` in the file.

1. Replace the values in all three instances with the URL of your newly deployed sample application.

   ```xml
   <stringProp name="HTTPSampler.domain">yourappname.azurewebsites.net</stringProp>
   ```

   Update the value in all three places. Don't include the `https://` prefix.

1. Save your changes and close the file.

1. Use **Ctrl+Shift+P** to launch the command palette. Begin typing `Azure load` and you would see two commands associated with the Azure Load Test extension:

   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-new-load-test.png" alt-text="Create a new Azure Load Testing test.":::

    * **Run Current File as Load Test in Cloud**: This command is used to run an existing cloud load test at scale in Azure.
    * **Create New Test**: This command is used to author a new cloud load test from an existing JMeter script.

1. Select **Create New Test**.

1. Select the **SampleApp.jmx** test plan.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/browse-for-load-test-plans.png" alt-text="Search for Azure Load Testing plans.":::

   If there are multiple test plans in the workspace, they'll be shown as a list. There's also a browse option to search for a test plan within your local file system.

1. A YAML-based load test with smart defaults opens.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-yaml-based-test.png" alt-text="YAML-based load test for Azure Load Testing.":::

   By default, the name of the load test matches the JMeter script name you selected in the previous step. You can rename this script. The cloud load test YAML is saved in the current workspace. Learn more about the [YAML properties](https://github.com/microsoft/azureloadtest/wiki/Common-Terminologies#brief-overview-of-yaml-properties).

1. You can edit the parameters or comment out the optional parameters if they don’t apply.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-yaml-based-test-updated.png" alt-text="(Updated) YAML-based load test for Azure Load Testing.":::

    For instance, since you don’t have configuration files associated with your current test plan, you can remove them for now.

1. Save the changes to your YAML file and then select **Run Current File as Load Test in Cloud** from the Visual Studio Code command palette.

1. Sign in to Azure if prompted.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/select-a-subscription.png" alt-text="Select an Azure subscription for Azure Load Testing.":::

1. Select the subscription from which you'll run your load test. 

1. Select **Create new Test Environment...** and follow the prompts to create the resource.

   It's an Azure resource that will store load tests, test results, and other related artifacts.

1. Finally, select the resource group *of the sample application being tested* and select **OK**.

Azure Load Testing service begins to monitor and display the application's server metrics in the test results.

If everything is okay, the test will start with status messages as shown below. Select the **View here** link to see the metrics related to your load test in Azure portal. 

:::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/app-server-results.png" alt-text="Application's server metrics monitored by Azure Load Testing.":::

> [!TIP]
> You can stop a load test at any time from the Azure portal UI.

:::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-run-messages.png" alt-text="Azure Load Testing status messages.":::

You can see the streaming client-side metrics while the test is running which auto refreshes every 10 seconds. You can stop the test by selecting **Stop** and also apply filters to the requests by sampler and errors. The response times can also be aggregated for different percentiles.
 
:::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-aggregated-by-percentile.png" alt-text="Azure Load Testing: results by percentile.":::

Wait until the load test finishes fully before proceeding to the next section.

## Identify performance bottlenecks in the sample app

Now, you'll analyze the load test results. Check if there are any performance bottlenecks in the application by examining the client-side and server-side metrics in the dashboard.

1. Taking a quick look at the client-side metrics reveals an increase in the 90th percentile **Response time** for the API requests (`add` and `get`). That's compared to the `lasttimestamp` API.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-client-side-metrics.png" alt-text="Azure Load Testing: Client-side metrics.":::

   The issues may be database-related since the `add` and `get` APIs interact with Cosmos DB. Notice a similar pattern for **Errors**.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-client-side-metrics-errors.png" alt-text="Errors in Azure Load Testing.":::

1. To learn why this increase occurred, go to the **Server side metrics** section.

   It shows your application's components - in this case an App Service Plan, App Service, and Cosmos DB - and their server metrics.

1. On closer inspection of the App Service Plan metrics, you'll note that the **CPU Percentage** and **Memory Percentage** metrics are within healthy ranges.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/app-service-metrics-for-load-testing.png" alt-text="App Service Plan metrics.":::

1. Examine metrics for Cosmos DB. You'll see that the **Normalized RU Consumption** metric shows that you were quickly running at 100% utilization soon after the load test began.

   The high utilization would have caused throttling errors and increased response times for the `add` and `get` web APIs.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-cosmos-db-metrics.png" alt-text="Cosmos DB Metrics.":::

1. In the chart above, check out the **Provisioned Throughput** metric.

   It shows that your Cosmos DB has been set up with a maximum throughput of 400 RUs. Go ahead and adjust this limit and check whether it addresses your performance bottleneck.

## Remove bottleneck and check the performance

To manually adjust the RU settings:

1. Open a new browser tab.

1. Go to the Cosmos DB resource that was provisioned as part of the sample application deployment.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/ru-scaling-for-cosmos-db.png" alt-text="RU scaling for Cosmos DB.":::

1. Select the **Scale & Settings** option and set the value to 1200 RU.
 
   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/1200-ru-scaling-for-cosmos-db.png" alt-text="Azure Load Testing scale at 1200 RU.":::

1. Select **Save**. You'll see the associated cost displayed as well.

1. Go to your load test's browser tab, and select **Rerun**.
 
   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-rerun-test.png" alt-text="Rerun in Azure Load Testing.":::

   You'll see an entry for the new test run with the status column that cycles through Provisioning, Executing, and Done.

1. At any time, select the test run to see how the load test is progressing.

1. Once the load test finishes, check the **Response time** and the **Errors** of the client-side metrics.

1. Then check the server-side metrics for Cosmos DB and check that performance has improved.
 
   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-cosmos-db-metrics.png" alt-text="Cosmos DB client-side metrics.":::

   :::image type="content" source="./media/tutorial-identify-bottlenecks-in-azure-portal/azure-load-testing-cosmos-db-metrics-post-run.png" alt-text="Cosmos DB client-side metrics after the run.":::

After those changes, you'll see that:

* The response time for the `add` and `get` APIs has improved compared to the first test run.
* The normalized RU consumption was well under the limits.

Both improve the overall performance of your application.

## Clean up resources

[!INCLUDE [alt-delete-resource-group](../../includes/alt-delete-resource-group.md)]

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> - Deploy the sample app.
> - Create and run a load test.
> - Identify performance bottlenecks in the app.
> - Remove the bottleneck.
> - Re-run the load test to check performance improvements.

You now have an Azure Machine Learning workspace that has:

- A compute instance to use for your development environment.
- A compute cluster to use for submitting training runs.

Use these resources to learn more about Azure Machine Learning and train a model with Python scripts.

> [!div class="nextstepaction"]
> [Learn more with Python scripts](how-to-identify-bottlenecks-in-vs-code.md)
