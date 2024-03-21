---
title: 'Tutorial: Identify performance issues with load testing'
titleSuffix: Azure Load Testing
description: In this tutorial, you learn how to identify performance bottlenecks in a web app by running a high-scale load test with Azure Load Testing. Use the dashboard to analyze client-side and server-side metrics.
services: load-testing
ms.service: load-testing
ms.author: ninallam
author: ninallam
ms.date: 11/29/2023
ms.topic: tutorial
#Customer intent: As an Azure user, I want to learn how to identify and fix bottlenecks in a web app so that I can improve the performance of the web apps that I'm running in Azure.
---

# Tutorial: Run a load test to identify performance bottlenecks in a web app

In this tutorial, you learn how to identify performance bottlenecks in a web application by using Azure Load Testing. You simulate load for a sample Node.js web application, and then use the load test dashboard to analyze client-side and server-side metrics.

The sample application consists of a Node.js web API, which interacts with a NoSQL database. You deploy the web API to Azure App Service web apps and use Azure Cosmos DB as the database.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Deploy the sample app.
> * Create and run a load test.
> * Add Azure app components to the load test.
> * Identify performance bottlenecks by using the load test dashboard.

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* The [Azure CLI](/cli/azure/install-azure-cli) installed on your local computer.
* Azure CLI version 2.2.0 or later. Run `az --version` to find the version that is installed on your computer. If you need to install or upgrade the Azure CLI, see [How to install the Azure CLI](/cli/azure/install-azure-cli).
* Visual Studio Code. If you don't have it, [download and install it](https://code.visualstudio.com/Download).
* Git. If you don't have it, [download and install it](https://git-scm.com/download).

### Prerequisites check

Before you start, validate your environment:

* Sign in to the Azure portal and check that your subscription is active.

* Check your version of the Azure CLI in a terminal or command window by running `az --version`. For the latest version, see the [latest release notes](/cli/azure/release-notes-azure-cli?tabs=azure-cli).

  If you don't have the latest version, update your installation by following the [installation guide for your operating system or platform](/cli/azure/install-azure-cli).

## Deploy the sample application

In this tutorial, you're generating load against a sample web application that you deploy to Azure App Service. Use Azure CLI commands, Git commands, and PowerShell commands to deploy the sample application in your Azure subscription.

[!INCLUDE [include-deploy-sample-application](includes/include-deploy-sample-application.md)]

Now that you have the sample application deployed and running, you can create an Azure load testing resource and a load test.

## Create a load test

In this tutorial, you're creating a load test with the Azure CLI by uploading a JMeter test script (`jmx` file). The sample application repository already contains a load test configuration file and JMeter test script.

To create a load test by using the Azure portal, follow the steps in [Quickstart: create a load test with a JMeter script](./how-to-create-and-run-load-test-with-jmeter-script.md).

Follow these steps to create an Azure load testing resource and a load test by using the Azure CLI:

1. Open a terminal window and enter the following command to sign in to your Azure subscription.

    ```azurecli
    az login
    ```

1. Go to the sample application directory.

   ```azurecli
   cd nodejs-appsvc-cosmosdb-bottleneck
   ```

1. Create a resource group for the Azure load testing resource.

    Optionally, you can also reuse the resource group of the sample application you deployed previously.

    Replace the `<load-testing-resource-group-name>` text placeholder with the name of the resource group.

    ```azurecli
    resourceGroup="<load-testing-resource-group-name>"
    location="East US"
    
    az group create --name $resourceGroup --location $location
    ```

1. Create an Azure load testing resource with the [`az load create`](/cli/azure/load) command.

    Replace the `<load-testing-resource-name>` text placeholder with the name of the load testing resource.

    ```azurecli
    # This script requires the following Azure CLI extensions:
    # - load
    
    loadTestResource="<load-testing-resource-name>"
    
    az load create --name $loadTestResource --resource-group $resourceGroup --location $location
    ```

1. Create a load test for simulating load against your sample application with the [`az load test create`](/cli/azure/load/test) command.

    Replace the `<web-app-hostname>` text placeholder with the App Service hostname of the sample application. This value is of the form `myapp.azurewebsites.net`. Don't include the `https://` part of the URL.

    ```azurecli
    testId="sample-app-test"
    webappHostname="<web-app-hostname>"
    
    az load test create --test-id $testId --load-test-resource $loadTestResource --resource-group $resourceGroup --load-test-config-file SampleApp.yaml --env webapp=$webappHostname
    ```

    This command uses the `Sampleapp.yaml` load test configuration file, which references the `SampleApp.jmx` JMeter test script. You use a command-line parameter to pass the sample application hostname to the load test.

You now have an Azure load testing resource and a load test to generate load against the sample web application in your Azure subscription.

## Add Azure app components to monitor the application

Azure Load Testing enables you to monitor resource metrics for the Azure components of your application. By analyzing these *server-side metrics*, you can identify performance and stability issues in your application directly from the Azure Load Testing dashboard.

In this tutorial, you add the Azure components for the sample application you deployed on Azure, such as the app service, Cosmos DB account, and more.

To add the Azure app components for the sample application to your load test:

1. In the [Azure portal](https://portal.azure.com), go to your Azure load testing resource.

1. On the left pane, select **Tests** to view the list of load tests

1. Select the checkbox next to your load test, and then select **Edit**.

    :::image type="content" source="media/tutorial-identify-bottlenecks-azure-portal/edit-load-test.png" alt-text="Screenshot that shows the list of load tests in the Azure portal, highlighting how to select a test from the list and the Edit button to modify the load test configuration." lightbox="media/tutorial-identify-bottlenecks-azure-portal/edit-load-test.png":::

1. Go to the **Monitoring** tab, and then select **Add/Modify**.

1. Select the checkboxes for the sample application you deployed previously, and then select **Apply**.

    :::image type="content" source="media/tutorial-identify-bottlenecks-azure-portal/configure-load-test-select-app-components.png" alt-text="Screenshot that shows how to add app components to a load test in the Azure portal." lightbox="media/tutorial-identify-bottlenecks-azure-portal/configure-load-test-select-app-components.png":::

    > [!TIP]
    > You can use the resource group filter to only view the Azure resources in the sample application resource group.

1. Select **Apply** to save the changes to the load test configuration.

You successfully added the Azure app components for the sample application to your load test to enable monitoring server-side metrics while the load test is running.

## Run the load test

You can now run the load test to simulate load against the sample application you deployed in your Azure subscription. In this tutorial, you run the load test from within the Azure portal. Alternately, you can [configure your CI/CD workflow to run your load test](./quickstart-add-load-test-cicd.md).

To run your load test in the Azure portal:

1. In the [Azure portal](https://portal.azure.com), go to your Azure load testing resource.

1. On the left pane, select **Tests** to view the list of load tests

1. Select the load test from the list to view the test details and list of test runs.

1. Select **Run**, and then **Run** again to start the load test.

    Optionally, you can enter a test run description.

    :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/run-load-test-first-run.png" alt-text="Screenshot that shows how to start a load test in the Azure portal." lightbox="./media/tutorial-identify-bottlenecks-azure-portal/run-load-test-first-run.png":::

    When you run a load test, Azure Load Testing deploys the JMeter test script and any extra files to the test engine instance(s), and then starts the load test.

1. When the load test starts, you should see the load test dashboard.

    If the dashboard doesn't show, you can select **Refresh** on then select the test run from the list.

    The load test dashboard presents the test run details, such as the client-side metrics and server-side application metrics. The graphs on the dashboard refresh automatically.

    :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/load-test-dashboard-client-metrics.png" alt-text="Screenshot that shows the client-side metrics graphs in the load test dashboard in the Azure portal." lightbox="./media/tutorial-identify-bottlenecks-azure-portal/load-test-dashboard-client-metrics.png":::

    You can apply multiple filters or aggregate the results to different percentiles to customize the charts.

   > [!TIP]
   > You can stop a load test at any time from the Azure portal by selecting **Stop**.

Wait until the load test finishes fully before you proceed to the next section.

## Use server-side metrics to identify performance bottlenecks

In this section, you analyze the results of the load test to identify performance bottlenecks in the application. Examine both the client-side and server-side metrics to determine the root cause of the problem.

1. First, look at the client-side metrics. You notice that the 90th percentile for the **Response time** metric for the `add` and `get` API requests is higher than it is for the `lasttimestamp` API.

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

    Notice that the **Normalized RU Consumption** metric shows that the database was quickly running at 100% resource utilization. The high resource usage might cause database throttling errors. It also might increase response times for the `add` and `get` web APIs.

    You can also see that the **Provisioned Throughput** metric for the Azure Cosmos DB instance has a maximum throughput of 400 RUs. Increasing the provisioned throughput of the database might resolve the performance problem.

## Increase the database throughput

In this section, you allocate more resources to the database to resolve the performance bottleneck.

For Azure Cosmos DB, increase the database RU scale setting:

1. Go to the Azure Cosmos DB resource that you provisioned as part of the sample application deployment.

1. Select the **Data Explorer** tab.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/ru-scaling-for-cosmos-db.png" alt-text="Screenshot that shows Data Explorer tab.":::

1. Select **Scale & Settings**, and update the throughput value to **1200**.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/1200-ru-scaling-for-cosmos-db.png" alt-text="Screenshot that shows the updated Azure Cosmos DB scale settings.":::

1. Select **Save** to confirm the changes.

## Validate the performance improvements

Now that you increased the database throughput, rerun the load test and verify that the performance results improved:

1. On the test run dashboard, select **Rerun**, and then select **Rerun** on the **Rerun test** pane.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/rerun-test.png" alt-text="Screenshot that shows selections for running the load test.":::

   You can see a new test run entry with a status column that cycles through the **Provisioning**, **Executing**, and **Done** states. At any time, select the test run to monitor how the load test is progressing.

1. After the load test finishes, check the **Response time** results and the **Errors** results of the client-side metrics.

1. Check the server-side metrics for Azure Cosmos DB and ensure that the performance improved.

   :::image type="content" source="./media/tutorial-identify-bottlenecks-azure-portal/cosmos-db-metrics-post-run.png" alt-text="Screenshot that shows the Azure Cosmos DB client-side metrics after update of the scale settings.":::

   The Azure Cosmos DB **Normalized RU Consumption** value is now well below 100%.

Now that you updated the scale settings of the database, you can see that:

* The response time for the `add` and `get` APIs improved.
* The normalized RU consumption remains well under the limit.

As a result, the overall performance of your application improved.

## Clean up resources

[!INCLUDE [alt-delete-resource-group](../../includes/alt-delete-resource-group.md)]

## Related content

- Get more details about how to [diagnose failing tests](./how-to-diagnose-failing-load-test.md)
- [Monitor server-side metrics](./how-to-monitor-server-side-metrics.md) to identify performance bottlenecks in your application
- [Define load test fail criteria](./how-to-define-test-criteria.md) to validate test results against your service requirements
- Learn more about the [key concepts for Azure Load Testing](./concept-load-testing-concepts.md).
