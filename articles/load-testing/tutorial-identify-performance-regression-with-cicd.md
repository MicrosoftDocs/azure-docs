---
title: 'Tutorial: Automate regression tests with CI/CD'
titleSuffix: Azure Load Testing
description: 'In this tutorial, you learn how to automate regression testing by using Azure Load Testing and CI/CD workflows. Quickly identify performance degradation for applications under high load.'
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 09/19/2023
ms.topic: tutorial
#Customer intent: As an Azure user, I want to learn how to automatically test builds for performance regressions on every merge request and/or deployment by using Azure Pipelines.
---

# Tutorial: Identify performance regressions by automating load tests with CI/CD

This tutorial describes how to identify performance regressions by using Azure Load Testing and CI/CD tools. Set up a CI/CD workflow in Azure Pipelines to automatically run a load test for your application. Use test fail criteria to get alerted about application changes that affect performance or stability.

With regression testing, you want to validate that code changes don't affect the application functionality, performance, and stability. Azure Load Testing enables you to verify that your application continues to meet your performance and stability requirements when put under real-world user load. Test fail criteria give you a point-in-time check about how the application performs.

In this tutorial, you use a sample Node.js application and JMeter script. The tutorial doesn't require any coding or Apache JMeter skills.

You'll learn how to:

> [!div class="checklist"]
> * Deploy the sample application on Azure.
> * Create a load test by using a JMeter script.
> * Set up a CI/CD workflow from the Azure portal.
> * View the load test results in the CI/CD dashboard.
> * Define load test fail criteria to identify performance regressions.

> [!NOTE]
> Azure Pipelines has a 60-minute timeout on jobs that are running on Microsoft-hosted agents for private projects. If your load test is running for more than 60 minutes, you'll need to pay for [additional capacity](/azure/devops/pipelines/agents/hosted?tabs=yaml#capabilities-and-limitations). If not, the pipeline will time out without waiting for the test results. You can view the status of the load test in the Azure portal.

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* An Azure DevOps organization and project. If you don't have an Azure DevOps organization, you can [create one for free](/azure/devops/pipelines/get-started/pipelines-sign-up?view=azure-devops&preserve-view=true).

## Deploy the sample application

To get started with this tutorial, you first need to set up a sample Node.js web application.

[!INCLUDE [include-deploy-sample-application](includes/include-deploy-sample-application.md)]

Now that you have the application deployed and running, you can create a URL-based load test against it.

## Create a load test

Before you set up the CI/CD workflow in Azure Pipelines, you create an Azure load testing resource and create load test by uploading a JMeter test script in the Azure portal. The JMeter script tests three endpoints in the sample application: `lasttimestamp`, `add`, and `get`.

After you create the load test, you can then set up the CI/CD workflow from the Azure portal.

### Create the Azure load testing resource

The Azure load testing resource is a top-level resource for your load-testing activities. This resource provides a centralized place to view and manage load tests, test results, and related artifacts.

If you already have a load testing resource, skip this section and continue to [Create a load test by uploading a JMeter script](#create-a-load-test-by-uploading-a-jmeter-script).

If you don't yet have an Azure load testing resource, create one now:

[!INCLUDE [azure-load-testing-create-portal](./includes/azure-load-testing-create-in-portal/azure-load-testing-create-in-portal.md)]

### Create a load test by uploading a JMeter script

You can create a load test by uploading an Apache JMeter test script. The test script defines the test plan, and describes the application requests to invoke and any custom logic for the load test. Azure Load Testing abstracts the infrastructure for running the test script at scale.

To create a load test by uploading a JMeter script in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com) by using the credentials for your Azure subscription.

1. Go to your Azure Load Testing resource, select **Tests** from the left pane, select **+ Create**, and then select **Upload a JMeter script**.

    :::image type="content" source="./media/tutorial-identify-performance-regression-with-cicd/create-new-test.png" alt-text="Screenshot that shows the Azure Load Testing page and the button for creating a new test." :::
    
1. On the **Basics** tab, enter the **Test name** and **Test description** information.

    :::image type="content" source="./media/tutorial-identify-performance-regression-with-cicd/create-new-test-basics.png" alt-text="Screenshot that shows the Basics tab for creating a test." :::

1. On the **Test plan** tab, select the sample application JMeter script, and then select **Upload** to upload the file to Azure.

    You can find the JMeter script `SampleApp.jmx` in the repository you cloned earlier.

    :::image type="content" source="./media/tutorial-identify-performance-regression-with-cicd/create-new-test-test-plan.png" alt-text="Screenshot that shows the Test plan tab." :::

1. On the **Parameters** tab, add an environment variable for the sample application endpoint:

    The test script uses an environment variable to retrieve the endpoint of the sample application.

    | Field | Value |
    |-|-|
    | **Name** | *webapp* |
    | **Value** | Hostname of the deployed sample application, without `https://` prefix.

    :::image type="content" source="./media/tutorial-identify-performance-regression-with-cicd/create-new-test-parameters.png" alt-text="Screenshot that shows the Parameters plan tab, highlighting the environment variable for the sample app hostname." :::

1. Select **Review + Create**, review the values, and then select **Create** to create and run the load test.

    > [!NOTE]
    > After creating the load test, it might take a few minutes for the load test to finish running.

## Set up the CI/CD workflow from the Azure portal

Now that you have load testing resource and a load test for the sample application, you can set up a new CI workflow to automatically run your load test. Azure Load Testing enables you to set up a new CI workflow in Azure Pipelines from the Azure portal.

### Create the CI/CD workflow

1. In the [Azure portal](https://portal.azure.com/), go to your Azure load testing resource.

1. On the left pane, select **Tests** to view the list of tests.

1. Select the test you created previously by selecting the checkbox, and then select **Set up CI/CD**.

    :::image type="content" source="media/tutorial-identify-performance-regression-with-cicd/list-of-tests.png" alt-text="Screenshot that shows the list of tests in Azure portal." lightbox="media/tutorial-identify-performance-regression-with-cicd/list-of-tests.png":::

1. Enter the following details for creating a CI/CD pipeline definition:

    |Setting|Value|
    |-|-|
    | **Organization** | Select the Azure DevOps organization where you want to run the pipeline from. |
    | **Project** | Select the project from the organization selected previously. |
    | **Repository** | Select the source code repository to store and run the Azure pipeline from. |
    | **Branch** | Select the branch in the selected repository. |
    | **Repository branch folder** | (Optional) Enter the repository branch folder name in which you'd like to commit. If empty, the root folder is used. |
    | **Override existing files** | Check this setting. |
    | **Service connection** | Select *Create new* to create a new service connection to allow Azure Pipelines to connect to the load testing resource. |

    :::image type="content" source="media/tutorial-identify-performance-regression-with-cicd/set-up-cicd-pipeline.png" alt-text="Screenshot that shows the settings to be configured to set up a CI/CD pipeline." lightbox="media/tutorial-identify-performance-regression-with-cicd/set-up-cicd-pipeline.png":::

    > [!IMPORTANT]
    > If you're getting an error creating a PAT token, or you don't see any repositories, make sure to [connect your Azure DevOps organization to Azure Active Directory (Azure AD)](/azure/devops/organizations/accounts/connect-organization-to-azure-ad). Make sure the directory in Azure DevOps matches the directory you're using for Azure Load Testing. After connecting to Azure AD, close and reopen your browser window.

1. Select **Create Pipeline** to start creating the pipeline definition.

    Azure Load Testing performs the following actions to configure the pipeline:

    - Create a new service connection of type [Azure Resource Manager](/azure/devops/pipelines/library/service-endpoints#azure-resource-manager-service-connection) in the Azure DevOps project. The service principal is automatically assigned the *Load Test Contributor* role on the Azure load testing resource.

    - Commit the JMeter script and test configuration YAML to the source code repository.

    - Create a pipeline definition that invokes the Azure load testing resource and runs the load test.

1. When the pipeline creation finishes, you receive a notification in the Azure portal with a link to the pipeline.

### Run the CI/CD workflow

You can now manually trigger the CI/CD workflow to validate that the load test is run correctly.

1. Sign in to your Azure DevOps organization (`https://dev.azure.com/<your-organization>`), and select your project.
    
    Replace the `<your-organization>` text placeholder with your project identifier.

1. Select **Pipelines** in the left navigation

    Notice that there's a new pipeline created in your project.

    :::image type="content" source="./media/tutorial-identify-performance-regression-with-cicd/azure-pipelines-pipelines-list.png" alt-text="Screenshot that shows the Azure Pipelines page, showing the pipeline that Azure Load Testing generated." lightbox="./media/tutorial-identify-performance-regression-with-cicd/azure-pipelines-pipelines-list.png":::

1. Select the pipeline, select **Run pipeline**, and then select **Run** to start the CI workflow.

    The first time you run the pipeline, you need to grant the pipeline permission to access the service connection and connect to Azure. Until you grant permission, the CI workflow run remains in the waiting state.

    :::image type="content" source="./media/tutorial-identify-performance-regression-with-cicd/azure-pipelines-run-pipeline.png" alt-text="Screenshot that shows the Azure Pipelines 'Run pipeline' page." lightbox="./media/tutorial-identify-performance-regression-with-cicd/azure-pipelines-run-pipeline.png":::

1. Select the **Load Test** job to view the job details.

    An alert message is shown that the pipeline needs permission to access a resource.

    :::image type="content" source="./media/tutorial-identify-performance-regression-with-cicd/azure-pipelines-pending-permissions.png" alt-text="Screenshot that shows the Azure Pipelines run details page, showing a warning that the pipeline needs additional permissions." lightbox="./media/tutorial-identify-performance-regression-with-cicd/azure-pipelines-pending-permissions.png":::

1. Select **View** > **Permit** > **Permit** to grant the permission.

    The CI/CD pipeline run now starts and runs your load test.

You've now configured and run an Azure Pipelines workflow that automatically runs a load test each time a source code update is made.

## View load test results

While the CI pipeline is running, you can view the load test statistics directly in the Azure Pipelines log. The CI/CD log displays the following load test statistics: response time metrics, requests per second, total number of requests, number of errors, and error rate. Alternately, you can navigate directly to the load test dashboard in the Azure portal by selecting the URL in the pipeline log.

:::image type="content" source="./media/tutorial-identify-performance-regression-with-cicd/azure-pipelines-load-test-log.png" alt-text="Screenshot that shows the Azure Pipelines run log, displaying the load testing metrics and Azure portal link." lightbox="./media/tutorial-identify-performance-regression-with-cicd/azure-pipelines-load-test-log.png":::

You can also download the load test results file, which is available as a pipeline artifact. In the pipeline log view, select **Load Test**, and then select **1 artifact produced** to download the result files for the load test.

:::image type="content" source="./media/tutorial-identify-performance-regression-with-cicd/create-pipeline-download-results.png" alt-text="Screenshot that shows how to download the load test results." lightbox="./media/tutorial-identify-performance-regression-with-cicd/create-pipeline-download-results.png":::

## Add test fail criteria

To identify performance regressions, you can analyze the test metrics for each pipeline run logs. Ideally, you want the pipeline run to fail whenever your performance or stability requirements aren't met. 

Azure Load Testing enables you to define load test fail criteria based on client-side metrics, such as the response time or error rate. When at least one of the fail criteria isn't met, the status of the CI pipeline is set to failed accordingly. With test fail criteria, you can now quickly identify if a specific application build results in a performance regression.

To define test fail criteria for the average response time and the error rate:

1. In your Azure DevOps project, select **Repos** > **Files**.

1. Select the `alt-config-<unique_id>.yml` file, and then select **Edit**.

    This YAML file specifies the load test configuration settings, such as the reference to the JMeter test script, the list of fail criteria, references to input data files, and more.

1. Replace the `failureCriteria:` with the following snippet to define two test fail criteria:

    ```yaml
    failureCriteria: 
        - avg(response_time_ms) > 100
        - percentage(error) > 20
    ```

    :::image type="content" source="./media/tutorial-identify-performance-regression-with-cicd/azure-pipelines-update-load-test-config.png" alt-text="Screenshot that shows how to update the load test configuration file with test criteria in Azure Pipelines." lightbox="./media/tutorial-identify-performance-regression-with-cicd/azure-pipelines-update-load-test-config.png":::

    You've now specified fail criteria for your load test based on the average response time and the error rate. The test fails if at least one of these conditions is met:
    
    - The aggregate average response time is greater than 100 ms.    
    - The aggregate percentage of errors is greater than 20%.

1. Select **Commit** to save the updates.

    Updating the file will trigger the CI/CD workflow.

1. After the test finishes, notice that the CI/CD pipeline run has failed.

    In the CI/CD output log, you find that the test failed because one of the fail criteria was met. The load test average response time was higher than the value that you specified in the fail criteria.

    :::image type="content" source="./media/tutorial-identify-performance-regression-with-cicd/test-criteria-failed.png" alt-text="Screenshot that shows pipeline logs after failed test criteria.":::

    The Azure Load Testing service evaluates the criteria during the test run. If any of these conditions fails, Azure Load Testing service returns a nonzero exit code. This code informs the CI/CD workflow that the test has failed.

1. Edit the `alt-config-<unique_id>.yml` file and change the test's fail criteria to increase the criterion for average response time:

    ```yaml
    failureCriteria: 
        - avg(response_time_ms) > 5000
        - percentage(error) > 20
    ```
    
1. Commit the changes to trigger the CI/CD workflow again.

    After the test finishes, you notice that the load test and the CI/CD workflow run complete successfully.

## Clean up resources

[!INCLUDE [alt-delete-resource-group](../../includes/alt-delete-resource-group.md)]

## Related content

In this tutorial, you've set up a new CI/CD workflow in Azure Pipelines to automatically run a load test with every code change. By using test fail criteria, you can identify when a performance regression was introduced in the application.

* [Manually configure load testing in CI/CD](./how-to-configure-load-test-cicd.md) if you're using GitHub Actions, or want to use an existing workflow.
* [Identify performance degradation over time by using metrics trends](./how-to-compare-multiple-test-runs.md#view-metrics-trends-across-test-runs).
* [Monitor server-side application metrics](./how-to-monitor-server-side-metrics.md) to identify performance bottlenecks.
* Learn more about [test fail criteria](./how-to-define-test-criteria.md).
