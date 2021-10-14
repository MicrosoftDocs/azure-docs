---
title: Identify bottlenecks in Azure portal
titleSuffix: Azure Load Testing
description: In Azure portal, identify and monitor performance bottlenecks with Azure Load Testing.
services: load-testing
ms.service: load-testing
ms.author: jmartens
author: j-martens
ms.date: 10/14/2021
ms.topic: tutorial
#Customer intent: As a Azure user, I want to learn how to identify and fix bottlenecks in a web app so that I can improve the performance of the web apps I have running in Azure.
---

# Tutorial: Run a load test in Azure portal to identify performance bottlenecks

In this tutorial, you'll load test a sample web app learn how to identify performance bottlenecks. The application consists of a web API deployed to an Azure App Service. The app and service interacts with an Azure Cosmos DB data store.

In this tutorial, you'll learn how to:

> [!div class="checklist"]

> * Deploy the sample app.  
> * Create and run a load test.  
> * Identify performance bottlenecks in the app.  
> * Remove the bottleneck.  
> * Re-run the load test to check performance improvements.  

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* This tutorial requires that you run the Azure CLI locally. You must have the Azure CLI version 2.2.0 or later installed. Run `az --version` to find the version. If you need to install or upgrade the CLI, see [How to install the Azure CLI](/cli/azure/install-azure-cli).
* Download and install:
   * [VS Code](https://code.visualstudio.com/Download).
   * The [Azure Load Testing extension](https://github.com/microsoft/azureloadtest#installation-of-vs-code-extension) for VS Code.
   * [Java](https://java.com/download/windows_manual.jsp).
   * [Apache JMeter](https://jmeter.apache.org/download_jmeter.cgi).
   * [Apache JMeter Plugins Manager](https://jmeter-plugins.org/install/Install/). Since the sample app's `SampleApp.jmx` uses an Ultimate Thread group, install Plugins Manager to run the Apache JMeter script on a fresh Apache JMeter install.

## Deploy the sample app

Before you can load test the sample app, you have to get it up and running. Use Azure CLI commands, Git commands, and PowerShell commands to make that happen.

1. Open Windows PowerShell, sign in to Azure, and set the subscription:  

   ```powershell
   az login
   az account set --subscription <your-Azure-Subscription-ID>
   ```

1. Clone the sample application's source repo.

   ```powershell
    git clone https://github.com/Azure-Samples/nodejs-appsvc-cosmosdb-bottleneck.git
   ```

    The sample application is a Node.js app consisting of an Azure App Service web component and a Cosmos DB database. The repo includes a PowerShell script that deploys the sample app to your Azure subscription. It also has an Apache JMeter script that you'll use in later steps.

1. Go to the Node.js app's directory and deploy the sample app using the PowerShell script.

   ```powershell
    cd nodejs-appsvc-cosmosdb-bottleneck
    .\deploymentscript.ps1
   ```

   > [!TIP]
   > You can install PowerShell Core on [Linux/WASL](/powershell/scripting/install/installing-powershell-core-on-linux?view=powershell-7.1#ubuntu-1804&preserve-view=true) or [macOS](/powershell/scripting/install/installing-powershell-core-on-macos?view=powershell-7.1&preserve-view=true).  
   >
   > After installing it, you can run the previous command as `pwsh .\deploymentscript.ps1`.  

1. At the prompt, provide:  

   * Your Subscription ID.
   * A unique name for your web app.
   * A location. By default, the location is `eastus`.  

   > [!IMPORTANT]
   > For your webapp name, use only lowercase letters and numbers. No spaces. No special characters.  

1. Once deployment finishes, go to the running sample application.  

   ```powershell
   Start-Process "https://<yourappname>.azurewebsites.net"
   ```

1. To see the application's components, sign in to the [Azure portal](https://portal.azure.com) and go to the resource group you created.  

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/resource-group.png" alt-text="Resource groups.":::

Now that you have the application deployed and running, go ahead and get started with running your first load test against it.  

## Create the load test

The sample application's source repo includes an Apache JMeter script named `SampleApp.jmx`. This script carries out three API calls on each test iteration:  

* `add` - Carries out a data insert operation on Cosmos DB for the number of visitors on the webapp.  

* `get` - Carries out a GET operation from Cosmos DB to retrieve the count.  

* `lasttimestamp` - Updates the timestamp since the last user went to the website.  

Here, you'll update the Apache JMeter script with the URL of the webapp deployed in the previous section.  

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

1. Use **Ctrl** + **Shift** + **P** to launch the command palette. Begin typing `Azure load`. You'll see two commands associated with the Azure Load Test extension:  

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/azure-load-testing-new-load-test.png" alt-text="Create a new Azure Load Testing test.":::

    * **Run Current File as Load Test in Cloud**: Use this command to run an existing cloud load test at scale in Azure.
    * **Create New Test**: Use this command to author a new cloud load test from an existing JMeter script.  

1. Select **Create New Test**.  

1. Select the **SampleApp.jmx** test plan.  

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/browse-for-load-test-plans.png" alt-text="Search for Azure Load Testing plans.":::

   A YAML-based load test with smart defaults opens.  

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/azure-load-testing-yaml-based-test.png" alt-text="YAML-based load test for Azure Load Testing.":::

   By default, the name of the load test matches the Apache JMeter script name you selected in the previous step. You can rename this script. The cloud load test YAML is saved in the current workspace. For more information about YAML properties, see [Common Terminologies](https://github.com/microsoft/azureloadtest/wiki/Common-Terminologies).  

1. Edit the parameters or comment out the optional parameters if they don’t apply.  

   For instance, since you don’t have configuration files associated with your current test plan, you can comment them out for now.  

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/azure-load-testing-yaml-based-test-updated.png" alt-text="(Updated) YAML-based load test for Azure Load Testing.":::

1. Save the changes to your YAML file.  

## Run the load test

Now that you've got the load test created and configured, feel free to run it.  

1. With the YAML file still open, go to the command pallet and select **Run Current File as Load Test in Cloud**.  

1. Sign in to Azure if prompted.  

1. Select the subscription from which you'll run your load test.  

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/select-a-subscription.png" alt-text="Select an Azure subscription for Azure Load Testing.":::

1. Select **Create new Test Environment...** and follow the prompts to create the resource.  

   The Test Environment is an Azure resource that will store load tests, test results, and other related artifacts.  

1. Select the resource group *of the sample application you're testing* and select **OK**.  

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/app-server-results.png" alt-text="Application's server metrics monitored by Azure Load Testing.":::

   The test will start and the **OUTPUT** section will show status messages.  

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/azure-load-testing-run-messages.png" alt-text="Azure Load Testing status messages.":::

1. Select **View Progress**, or follow the link to see the metrics related to your load test in Azure portal.  

   Azure Load Testing service begins to monitor and display the application's server metrics in the test results.  

   > [!TIP]
   > You can stop a load test at any time from the Azure portal UI.  

You can see the streaming client-side metrics while the test is running which auto refreshes every 5 seconds. You can stop the test by selecting **Stop** and also apply filters to the requests by sampler and errors. You can aggregate the response times for different percentiles.  

:::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/azure-load-testing-aggregated-by-percentile.png" alt-text="Azure Load Testing: results by percentile.":::

Wait until the load test finishes fully before proceeding to the next section.  

## Identify performance bottlenecks

Now, you'll analyze the load test results. Check for performance bottlenecks in the application. Examine the client-side and server-side metrics in the dashboard.  

1. Take a look at the client-side metrics.  

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/azure-load-testing-client-side-metrics.png" alt-text="Azure Load Testing: Client-side metrics.":::

    The metrics reveal an increase in the 90th percentile **Response time** for the API requests (`add` and `get`). That's compared to the `lasttimestamp` API.  

   The issues may be database-related since the `add` and `get` APIs interact with Cosmos DB. Notice a similar pattern for **Errors**.  

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/azure-load-testing-client-side-metrics-errors.png" alt-text="Errors in Azure Load Testing.":::

1. To learn why this increase occurred, scroll down to the **Server-side metrics** section.  

   It shows your application's components - in this case an App Service Plan, App Service, and Cosmos DB - and their server metrics.  

1. For the App Service Plan metrics, you'll note that the **CPU Percentage** and **Memory Percentage** metrics are within healthy ranges.  

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/app-service-metrics-for-load-testing.png" alt-text="App Service Plan metrics.":::

1. Examine metrics for Cosmos DB.  

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/azure-load-testing-cosmos-db-metrics.png" alt-text="Cosmos DB Metrics.":::

   The **Normalized RU Consumption** metric shows that you were running at 100% utilization soon after the load test began.  

   High utilization would have caused throttling errors and increased response times for the `add` and `get` web APIs.  

1. In the chart above, check out the **Provisioned Throughput** metric.  

   Your Cosmos DB is set up with a maximum throughput of 400 RUs. Go to the next section and adjust this limit to see if it fixes your performance bottleneck.  

## Remove bottleneck

To remove the bottleneck, manually increase the RU settings:  

1. Open a new browser tab.  

1. Go to the Cosmos DB resource that was provisioned as part of the sample application deployment.  

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/ru-scaling-for-cosmos-db.png" alt-text="RU scaling for Cosmos DB.":::

1. Select the **Scale & Settings** option and set the value to 1200 RU.  

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/1200-ru-scaling-for-cosmos-db.png" alt-text="Azure Load Testing scale at 1200 RU.":::

1. Select **Save**.  

## Check the performance

Go back to your load test, rerun it, and check the results.  

1. Go to your load test's browser tab, and select **Rerun**.  

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/azure-load-testing-rerun-test.png" alt-text="Rerun in Azure Load Testing.":::

   You'll see an entry for the new test run with the status column that cycles through **Provisioning**, **Executing**, and **Done**.  

1. At any time, select the test run to see how the load test is progressing.  

1. Once the load test finishes, check the **Response time** and the **Errors** of the client-side metrics.  

1. Then check the server-side metrics for Cosmos DB and check that performance has improved.  

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/azure-load-testing-cosmos-db-metrics.png" alt-text="Cosmos DB client-side metrics.":::

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/azure-load-testing-cosmos-db-metrics-post-run.png" alt-text="Cosmos DB client-side metrics after the run.":::

After the changes you've made, you'll see that:  

* The response time for the `add` and `get` APIs has improved compared to the first test run.  
* The normalized RU consumption was well under the limits.  

Both the improved response times and the normalized RU consumption increase the overall performance of your application.  

## Clean up resources

[!INCLUDE [alt-delete-resource-group](../../includes/alt-delete-resource-group.md)]

## Next steps

You now have a web app and a load test app running in the Azure portal.  

Advance to the next article to learn how to identify bottlenecks using VS Code.  

> [!div class="nextstepaction"]
> [Identify bottlenecks using VS Code](how-to-identify-bottlenecks-vs-code.md)
