---
title: 'Tutorial: Run a load test to identify performance bottlenecks'
titleSuffix: Azure Load Testing
description: In this tutorial, you learn how to identify and monitor performance bottlenecks in a web app by running a high-scale load test with Azure Load Testing.
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 01/18/2023
ms.topic: tutorial
#Customer intent: As an Azure user, I want to learn how to identify and fix bottlenecks in a web app so that I can improve the performance of the web apps that I'm running in Azure.
---

# Tutorial: Run a load test to identify performance bottlenecks in a web app

In this tutorial, you'll learn how to identify performance bottlenecks in a web application by using Azure Load Testing. You'll create a load test for a sample Node.js application.

The sample application consists of a Node.js web API, which interacts with a NoSQL database. You'll deploy the web API to Azure App Service web apps and use Azure Cosmos DB as the database.

Learn more about the [key concepts for Azure Load Testing](./concept-load-testing-concepts.md).

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Deploy the sample app.
> * Create and run a load test.
> * Identify performance bottlenecks in the app.
> * Remove a bottleneck.
> * Rerun the load test to check performance improvements.

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* Azure CLI version 2.2.0 or later. Run `az --version` to find the version that's installed on your computer. If you need to install or upgrade the Azure CLI, see [How to install the Azure CLI](/cli/azure/install-azure-cli).
* Visual Studio Code. If you don't have it, [download and install it](https://code.visualstudio.com/Download).
* Git. If you don't have it, [download and install it](https://git-scm.com/download).

## Deploy the sample app

Before you can load test the sample app, you have to get it deployed and running. Use Azure CLI commands, Git commands, and PowerShell commands to make that happen.

[!INCLUDE [include-deploy-sample-application](includes/include-deploy-sample-application.md)]

Now that you have the application deployed and running, you can run your first load test against it.

## Configure and create the load test

In this section, you'll create a load test by using a sample Apache JMeter test script.

The sample application's source repo includes an Apache JMeter script named *SampleApp.jmx*. This script makes three API calls to the web app on each test iteration:

* `add`: Carries out a data insert operation on Azure Cosmos DB for the number of visitors on the web app.
* `get`: Carries out a GET operation from Azure Cosmos DB to retrieve the count.
* `lasttimestamp`: Updates the time stamp since the last user went to the website.

> [!NOTE]
> The sample Apache JMeter script requires two plugins: ```Custom Thread Groups``` and ```Throughput Shaping Timer```. To open the script on your local Apache JMeter instance, you need to install both plugins. You can use the [Apache JMeter Plugins Manager](https://jmeter-plugins.org/install/Install/) to do this.

### Create the Azure load testing resource

The Azure load testing resource is a top-level resource for your load-testing activities. This resource provides a centralized place to view and manage load tests, test results, and related artifacts.

If you already have a load testing resource, skip this section and continue to [Create a load test](#create-a-load-test).

If you don't yet have an Azure load testing resource, create one now:

[!INCLUDE [azure-load-testing-create-portal](./includes/azure-load-testing-create-in-portal/azure-load-testing-create-in-portal.md)]

### Create a load test

Next, you create a load test in your load testing resource for the sample app. You create the load test by using an existing JMeter script in the sample app repository.

1. Go to your load testing resource, and select **Create** on the **Overview** page.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/create-test.png" alt-text="Screenshot that shows the button for creating a new test." :::

1. On the **Basics** tab, enter the **Test name** and **Test description** information. Optionally, you can select the **Run test after creation** checkbox to automatically start the load test after creating it.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/create-new-test-basics.png" alt-text="Screenshot that shows the Basics tab for creating a test." :::

1. On the **Test plan** tab, select the **JMeter script** test method, and then select the *SampleApp.jmx* test script from the cloned sample application directory. Next, select **Upload** to upload the file to Azure and configure the load test.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/create-new-test-test-plan.png" alt-text="Screenshot that shows the Test plan tab and how to upload an Apache JMeter script." :::

    Optionally, you can select and upload additional Apache JMeter configuration files or other files that are referenced in the JMX file. For example, if your test script uses CSV data sets, you can upload the corresponding *.csv* file(s).

1. On the **Parameters** tab, add a new environment variable. Enter *webapp* for the **Name** and *`<yourappname>.azurewebsites.net`* for the **Value**. Replace the placeholder text `<yourappname>` with the name of the newly deployed sample application. Don't include the `https://` prefix.

    The Apache JMeter test script uses the environment variable to retrieve the web application URL. The script then invokes the three APIs in the web application.

    :::image type="content" source="media/tutorial-identify-bottlenecks-azure-portal/create-new-test-parameters.png" alt-text="Screenshot that shows the parameters tab to add environment variable.":::

1. On the **Load** tab, configure the following details. You can leave the default value for this tutorial.

    |Setting  |Value  |Description  |
    |---------|---------|---------|
    |**Engine instances**     |**1**         |The number of parallel test engines that run the Apache JMeter script. |

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/create-new-test-load.png" alt-text="Screenshot that shows the Load tab for creating a test." :::

1. On the **Monitoring** tab, specify the application components that you want to monitor with the resource metrics. Select **Add/modify** to manage the list of application components.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/create-new-test-monitoring.png" alt-text="Screenshot that shows the Monitoring tab for creating a test." :::

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/create-new-test-add-resource.png" alt-text="Screenshot that shows how to add Azure resources to monitor during the load test." :::

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/create-new-test-added-resources.png" alt-text="Screenshot that shows the Monitoring tab with the list of Azure resources to monitor." :::

1. Select **Review + create**, review all settings, and select **Create**.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/create-new-test-review.png" alt-text="Screenshot that shows the tab for reviewing and creating a test." :::

> [!NOTE]
> You can update the test configuration at any time, for example to upload a different JMX file. Choose your test in the list of tests, and then select **Edit**.

## Run the load test in the Azure portal

In this section, you'll use the Azure portal to manually start the load test that you created previously. If you checked the **Run test after creation** checkbox, the test will already be running.

1. Select **Tests** to view the list of tests, and then select the test that you created.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/test-list.png" alt-text="Screenshot that shows the list of tests." :::

   >[!TIP]
   > You can use the search box and the **Time range** filter to limit the number of tests.

1. On the test details page, select **Run** or **Run test**. Then, select **Run** on the **Run test** confirmation pane to start the load test.

    :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/test-runs-run.png" alt-text="Screenshot that shows selections for running a test." :::

    Azure Load Testing begins to monitor and display the application's server metrics on the dashboard.

    You can see the streaming client-side metrics while the test is running. By default, the results refresh automatically every five seconds.

    :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/aggregated-by-percentile.png" alt-text="Screenshot that shows the dashboard with test results.":::

    You can apply multiple filters or aggregate the results to different percentiles to customize the charts.

   > [!TIP]
   > You can stop a load test at any time from the Azure portal by selecting **Stop**.

Wait until the load test finishes fully before you proceed to the next section.

## Identify performance bottlenecks

In this section, you'll analyze the results of the load test to identify performance bottlenecks in the application. Examine both the client-side and server-side metrics to determine the root cause of the problem.

1. First, look at the client-side metrics. You'll notice that the 90th percentile for the **Response time** metric for the `add` and `get` API requests is higher than it is for the `lasttimestamp` API.

    :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/client-side-metrics.png" alt-text="Screenshot that shows the client-side metrics.":::

    You can see a similar pattern for **Errors**, where the `lasttimestamp` API has fewer errors than the other APIs.

    :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/client-side-metrics-errors.png" alt-text="Screenshot that shows the error chart.":::

    The results of the `add` and `get` APIs are similar, whereas the `lasttimestamp` API behaves differently. The cause might be database related, because both the `add` and `get` APIs involve database access.

1. To investigate this bottleneck in more detail, scroll down to the **Server-side metrics** dashboard section.

    The server-side metrics show detailed information about your Azure application components: Azure App Service plan, Azure App Service web app, and Azure Cosmos DB.

    :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/app-service-metrics-for-load-testing.png" alt-text="Screenshot that shows the Azure App Service plan metrics.":::

    In the metrics for the Azure App Service plan, you can see that the **CPU Percentage** and **Memory Percentage** metrics are within an acceptable range.

1. Now, look at the Azure Cosmos DB server-side metrics.

    :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/cosmos-db-metrics.png" alt-text="Screenshot that shows Azure Cosmos DB metrics.":::

    Notice that the **Normalized RU Consumption** metric shows that the database was quickly running at 100% resource utilization. The high resource usage might have caused database throttling errors. It also might have increased response times for the `add` and `get` web APIs.

    You can also see that the **Provisioned Throughput** metric for the Azure Cosmos DB instance has a maximum throughput of 400 RUs. Increasing the provisioned throughput of the database might resolve the performance problem.

## Increase the database throughput

In this section, you'll allocate more resources to the database, to resolve the performance bottleneck.

For Azure Cosmos DB, increase the database RU scale setting:

1. Go to the Azure Cosmos DB resource that you provisioned as part of the sample application deployment.

1. Select the **Data Explorer** tab.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/ru-scaling-for-cosmos-db.png" alt-text="Screenshot that shows Data Explorer tab.":::

1. Select **Scale & Settings**, and update the throughput value to **1200**.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/1200-ru-scaling-for-cosmos-db.png" alt-text="Screenshot that shows the updated Azure Cosmos DB scale settings.":::

1. Select **Save** to confirm the changes.

## Validate the performance improvements

Now that you've increased the database throughput, rerun the load test and verify that the performance results have improved:

1. On the test run dashboard, select **Rerun**, and then select **Rerun** on the **Rerun test** pane.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/rerun-test.png" alt-text="Screenshot that shows selections for running the load test.":::

   You'll see a new test run entry with a status column that cycles through the **Provisioning**, **Executing**, and **Done** states. At any time, select the test run to monitor how the load test is progressing.

1. After the load test finishes, check the **Response time** results and the **Errors** results of the client-side metrics.

1. Check the server-side metrics for Azure Cosmos DB and ensure that the performance has improved.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/cosmos-db-metrics-post-run.png" alt-text="Screenshot that shows the Azure Cosmos DB client-side metrics after update of the scale settings.":::

   The Azure Cosmos DB **Normalized RU Consumption** value is now well below 100%.

Now that you've changed the scale settings of the database, you see that:

* The response time for the `add` and `get` APIs has improved.
* The normalized RU consumption remains well under the limit.

As a result, the overall performance of your application has improved.

## Clean up resources

[!INCLUDE [alt-delete-resource-group](../../includes/alt-delete-resource-group.md)]

## Next steps

Advance to the next tutorial to learn how to set up an automated regression testing workflow by using Azure Pipelines or GitHub Actions.

> [!div class="nextstepaction"]
> [Set up automated regression testing](./tutorial-identify-performance-regression-with-cicd.md)
