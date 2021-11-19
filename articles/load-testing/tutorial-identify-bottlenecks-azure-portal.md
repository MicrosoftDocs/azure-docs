---
title: 'Tutorial: Run a load test to identify performance bottlenecks'
titleSuffix: Azure Load Testing
description: In this tutorial, you learn how to identify and monitor performance bottlenecks in a web app by running a high-scale load test with Azure Load Testing.
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 11/19/2021
ms.topic: tutorial
#Customer intent: As a Azure user, I want to learn how to identify and fix bottlenecks in a web app so that I can improve the performance of the web apps I have running in Azure.
---

# Tutorial: Run a load test to identify performance bottlenecks in a web app

In this tutorial, you'll learn how to identify performance bottlenecks in a web application by using Azure Load Testing Preview. You'll create a load test for a sample Node.js application.

The sample application consists of a Node.js web API, which interacts with a NoSQL database. You'll deploy the web API to Azure App Service web apps and use Cosmos DB as the database.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Deploy the sample app.
> * Create and run a load test.
> * Identify performance bottlenecks in the app.
> * Remove the bottleneck.
> * Re-run the load test to check performance improvements.

> [!IMPORTANT]
> Azure Load Testing is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* This tutorial requires that you run the Azure CLI locally. You must have the Azure CLI version 2.2.0 or later installed. Run `az --version` to find the version. If you need to install or upgrade the CLI, see [How to install the Azure CLI](/cli/azure/install-azure-cli).
* Download and install [VS Code](https://code.visualstudio.com/Download).

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
   > You can install PowerShell Core on [Linux/WSL](/powershell/scripting/install/installing-powershell-core-on-linux?view=powershell-7.1#ubuntu-1804&preserve-view=true) or [macOS](/powershell/scripting/install/installing-powershell-core-on-macos?view=powershell-7.1&preserve-view=true).  
   >
   > After installing it, you can run the previous command as `pwsh .\deploymentscript.ps1`.  

1. At the prompt, provide:

   * Your Azure subscription ID.
   * A unique name for your web app.
   * A location. By default, the location is `eastus`. You can obtain region codes by running the [Get-AzLocation](/powershell/module/az.resources/get-azlocation) command.

   > [!IMPORTANT]
   > For your webapp name, use only lowercase letters and numbers. No spaces. No special characters.

1. Once deployment finishes, go to the running sample application by opening `https://<yourappname>.azurewebsites.net` in a browser window.

1. To see the application's components, sign in to the [Azure portal](https://portal.azure.com) and go to the resource group you created.  

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/resource-group.png" alt-text="Screenshot that shows the list of Azure Resource Groups.":::

Now that you have the application deployed and running, go ahead and get started with running your first load test against it.

## Configure and create the load test

In this section, you'll create a load test by using an existing Apache JMeter test script.

### Configure the Apache JMeter script

The sample application's source repo includes an Apache JMeter script named `SampleApp.jmx`. This script carries out three API calls on each test iteration:  

* `add` - Carries out a data insert operation on Cosmos DB for the number of visitors on the webapp.
* `get` - Carries out a GET operation from Cosmos DB to retrieve the count.
* `lasttimestamp` - Updates the timestamp since the last user went to the website.

In this section, you'll update the Apache JMeter script with the URL of the sample web app you deployed in the previous section.

Before you start, make sure you have the directory of the cloned sample app open in VS Code.

1. Open the directory of the cloned sample app in VS Code.

    ```powershell
    cd nodejs-appsvc-cosmosdb-bottleneck
    code .
    ```
 
1. Open `SampleApp.jmx`.

1. Search for `<stringProp name="HTTPSampler.domain">`.

   You'll see three instances of `<stringProp name="HTTPSampler.domain">` in the file.

1. Replace the value with the URL of the newly deployed sample application in all three instances.

   ```xml
   <stringProp name="HTTPSampler.domain">yourappname.azurewebsites.net</stringProp>
   ```

   Update the value in all three places. Don't include the `https://` prefix.  

1. Save your changes and close the file.

### Create the Azure Load Testing resource

The Load Testing resource is a top-level resource for your load testing activities. This resource provides a centralized place to view and manage load tests, test results, and other related artifacts.

If you already have a Load Testing resource, skip this section and continue to [Create a load test](#create_test).

If you don't yet have a Load Testing resource, create one now:

[!INCLUDE [azure-load-testing-create-portal](../../includes/azure-load-testing-create-in-portal.md)]

In the next section, you'll create a load test in the Load Testing resource for the sample app.

### <a name="create_test"></a> Create a load test

1. Navigate to the load test resource and select **Create new test** in the command bar.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/create-test.png" alt-text="Screenshot that shows Create new test." :::

1. In the **Basics** tab, enter the **Test name** and **Test description** information. Optionally, you can check the **Run test after creation** box to automatically start the load test after creating it.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/basics.png" alt-text="Screenshot that shows the basics tab when creating a new test." :::

1. In the **Test plan** tab, select the **JMeter script** test method and select the *SampleApp.jmx* test script from the cloned sample application directory. Select **Upload** to upload the file to Azure and configure the load test.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/test-plan.png" alt-text="Screenshot that shows the Test plan tab and how to upload an Apache JMeter script." :::

    Optionally, you can select and upload more Apache JMeter configuration files.

1. In the **Load** tab, configure the following details. You can leave the default values for this tutorial:

    |Setting  |Value  |Description  |
    |---------|---------|---------|
    |Engine instances     |1         |The number of parallel test engines that execute the Apache JMeter script. |
    
   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/load.png" alt-text="Screenshot that shows the Load tab when creating a new test." :::

1. In the **Monitoring** tab, specify the application components you want to monitor the resource metrics. Select **add/modify** to manage the list of application components.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/monitoring.png" alt-text="Screenshot that shows the Monitoring tab when creating a new test." :::

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/add-resource.png" alt-text="Screenshot that shows how to add Azure resources to monitor during the load test." :::

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/added-resource.png" alt-text="Screenshot that shows the Monitoring tab with the list of Azure resources to monitor." :::

1. Select **Review + create**, review all settings, and select **Create**.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/create.png" alt-text="Screenshot that shows the Review + create tab when creating a new test." :::

## Run the load test in the Azure portal

In this section, you'll use the Azure portal to manually start the load test you created previously. If you checked the **Run test after creation** box, the test will already be running.

1. Select **Tests** to view the list of tests, and then select the test you created previously.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/test-list.png" alt-text="Screenshot that shows the list of tests." :::

   >[!TIP]
   > You can use the search box and the **Time range** filter to limit the number of tests.

1. In the test runs page, select **Run** or **Run test**.

    :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/test-runs-run.png" alt-text="Screenshot that shows how to run a test." :::

1. Select **Run** on the run summary page to start the load test. You'll then see the list of test runs.

    :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/test-run-list.png" alt-text="Screenshot that shows the run summary page." :::

    Azure Load Testing begins to monitor and display the application's server metrics in the dashboard.
    
    You can see the streaming client-side metrics while the test is running. By default, the results refresh automatically every five seconds.

    :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/aggregated-by-percentile.png" alt-text="Screenshot that shows the test results dashboard.":::

    You can apply multiple filters or aggregate the results to different percentiles to customize the charts.

   > [!TIP]
   > You can stop a load test at any time from the Azure portal UI by selecting **Stop**.

Wait until the load test finishes fully before proceeding to the next section.

## Identify performance bottlenecks

In this section, you'll analyze the load test results to identify performance bottlenecks in the application. Examine both the client-side and server-side metrics to determine the root cause of the problem.

1. First, take a look at the client-side metrics. You'll notice that the 90th percentile for the **Response time** metric for the `add` and `get` API requests are higher than for the `lasttimestamp` API.

    :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/client-side-metrics.png" alt-text="Screenshot that shows the client-side metrics.":::
    
    You can see a similar pattern for **Errors**, where the `lasttimestamp` API has fewer errors than the other APIs.
    
    :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/client-side-metrics-errors.png" alt-text="Screenshot that shows the errors chart.":::

    The results of the `add` and `get` APIs are similar, whereas the `lasttimestamp` API behaves differently. The cause might be database-related, because both the `add` and `get` APIs involve a database access.

1. To investigate this issue in more detail, scroll down to the **Server-side metrics** dashboard section.

    The server-side metrics show you detailed information about your Azure application components: Azure App Service Plan, Azure App Service Web App, and Azure Cosmos DB.

    :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/app-service-metrics-for-load-testing.png" alt-text="Screenshot that shows the Azure App Service Plan metrics.":::

    In the Azure App Service Plan metrics, you can see that the **CPU Percentage** and **Memory Percentage** metrics are within an acceptable range.

1. Now, take a look at the Cosmos DB server-side metrics.

    :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/cosmos-db-metrics.png" alt-text="Screenshot that shows Azure Cosmos DB metrics.":::
    
    You'll notice that the **Normalized RU Consumption** metric shows that the database was quickly running at 100% resource utilization. The high resource usage might have caused database throttling errors, and increased response times for the `add` and `get` web APIs.
    
    You can also see that the **Provisioned Throughput** metric for the Azure Cosmos DB instance has a maximum throughput of 400 RUs. By increasing the provisioned throughput of the database, the performance issue might be resolved.

In the next section, you'll increase the database provisioned throughput, and then verify if the application performance bottleneck has been resolved.

## Increase the database throughput

In this section, you'll allocate more resources to the database, to resolve the performance bottleneck. 

For Azure Cosmos DB, you'll increase the database RU scale setting.

1. Go to the Cosmos DB resource that you provisioned as part of the sample application deployment.

1. Select the **Data Explorer** tab.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/ru-scaling-for-cosmos-db.png" alt-text="Screenshot that shows Cosmos DB scale settings.":::

1. Select the **Scale & Settings** option, and update the throughput value to *1200*.
 
   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/1200-ru-scaling-for-cosmos-db.png" alt-text="Screenshot that shows the updated Cosmos DB scale settings.":::

1. Select **Save** to confirm the changes.

## Validate the performance improvements

Now that you've increased the database throughput, you'll rerun the load test and verify that the performance results have improved.

1. Return to the test run details page, select **Rerun**, and then select **Run** in the run summary page.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/rerun-test.png" alt-text="Screenshot that shows how to run the load test.":::

   You'll see a new test run entry with the status column that cycles through the **Provisioning**, **Executing**, and **Done** state. At any time, select the test run item to monitor how the load test is progressing.

1. Once the load test finishes, check the **Response time** and the **Errors** of the client-side metrics.

1. Then check the server-side metrics for Azure Cosmos DB and ensure that the performance has improved.
 
   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/cosmos-db-metrics-post-run.png" alt-text="Screenshot that shows the Cosmos DB client-side metrics after the scale settings update.":::

    You'll notice that the Cosmos DB **Normalized RU Consumption** is now well below 100%.

After changing the scale settings of the database, you now see that:

* The response time for the `add` and `get` APIs has improved.
* The normalized RU consumption remains well under the maximum limit.

As a result, the overall performance of your application was improved.

## Clean up resources

[!INCLUDE [alt-delete-resource-group](../../includes/alt-delete-resource-group.md)]

## Next steps

Advance to the next tutorial to learn how to set up an automated regression testing workflow by using Azure Pipelines or GitHub Actions.

> [!div class="nextstepaction"]
> [Set up automated regression testing](./tutorial-cicd-azure-pipelines.md)
