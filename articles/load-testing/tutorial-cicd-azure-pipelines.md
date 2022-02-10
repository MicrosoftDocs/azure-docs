---
title: 'Tutorial: Identify performance regressions with Azure Load Testing and Azure Pipelines'
titleSuffix: Azure Load Testing
description: 'In this tutorial, you learn how to automate performance regression testing by using Azure Load Testing and Azure Pipelines CI/CD workflows.'
services: load-testing
ms.service: load-testing
ms.author: ninallam
author: ninallam
ms.date: 01/25/2022
ms.topic: tutorial
#Customer intent: As an Azure user, I want to learn how to automatically test builds for performance regressions on every merge request and/or deployment by using Azure Pipelines.
---

# Tutorial: Identify performance regressions with Azure Load Testing Preview and Azure Pipelines

This tutorial describes how to automate performance regression testing by using Azure Load Testing Preview and Azure Pipelines. You'll configure an Azure Pipelines continuous integration and continuous delivery (CI/CD) workflow to run a load test for a sample web application. You'll then use the test results to identify performance regressions.

If you're using GitHub Actions for your CI/CD workflows, see the corresponding [GitHub Actions tutorial](./tutorial-cicd-github-actions.md).

You'll learn how to:

> [!div class="checklist"]
> * Set up your repository with files required for load testing.
> * Set up Azure Pipelines to integrate with Azure Load Testing.
> * Run the load test and view results in the pipeline logs.
> * Define pass/fail criteria for the load test.
> * Parameterize the load test by using pipeline variables.

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

> [!NOTE]
> Azure Pipelines has a 60-minute timeout on jobs that are running on Microsoft-hosted agents for private projects. If your load test is running for more than 60 minutes, you'll need to pay for [additional capacity](/azure/devops/pipelines/agents/hosted?tabs=yaml#capabilities-and-limitations). If not, the pipeline will time out without waiting for the test results. You can view the status of the load test in the Azure portal.

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
* An Azure DevOps organization and project. If you don't have an Azure DevOps organization, you can [create one for free](/azure/devops/pipelines/get-started/pipelines-sign-up?view=azure-devops&preserve-view=true). If you need help with getting started with Azure Pipelines, see [Create your first pipeline](/azure/devops/pipelines/create-first-pipeline?preserve-view=true&view=azure-devops&tabs=java%2Ctfs-2018-2%2Cbrowser).
* A GitHub account, where you can create a repository. If you don't have one, you can [create one for free](https://github.com/).

## Set up your repository

To get started, you need a GitHub repository with the sample web application. You'll use this repository to configure an Azure Pipelines workflow to run the load test.

The sample application's source repo includes an Apache JMeter script named *SampleApp.jmx*. This script makes three API calls on each test iteration:

* `add`: Carries out a data insert operation on Azure Cosmos DB for the number of visitors on the web app.
* `get`: Carries out a GET operation from Azure Cosmos DB to retrieve the count.
* `lasttimestamp`: Updates the time stamp since the last user went to the website.

1. Open a browser and go to the sample application's [source GitHub repository](https://github.com/Azure-Samples/nodejs-appsvc-cosmosdb-bottleneck.git).

    The sample application is a Node.js app that consists of an Azure App Service web component and an Azure Cosmos DB database.

1. Select **Fork** to fork the sample application's repository to your GitHub account.

    :::image type="content" source="./media/tutorial-cicd-azure-pipelines/fork-github-repo.png" alt-text="Screenshot that shows the button to fork the sample application's GitHub repo.":::

## Set up Azure Pipelines access permissions for Azure

In this section, you'll configure your Azure DevOps project to have permissions to access the Azure Load Testing resource.

To access Azure resources, create a service connection in Azure DevOps and use role-based access control to assign the necessary permissions:

1. Sign in to your Azure DevOps organization (`https://dev.azure.com/<yourorganization>`).

1. Select **Project settings** > **Service connections**.

1. Select **+ New service connection**, select the **Azure Resource Manager** service connection, and then select **Next**.

1. Select the **Service Principal (automatic)** authentication method, and then select **Next**.

1. Select the **Subscription** scope level, and then select the Azure subscription that contains your Azure Load Testing resource.

    :::image type="content" source="./media/tutorial-cicd-azure-pipelines/new-service-connection.png" alt-text="Screenshot that shows selections for creating a new service connection.":::

    You'll use the name of the service connection in a later step to configure the pipeline.

1. Select **Save** to create the connection.

1. Select the service connection from the list, and then select **Manage Service Principal**.

    :::image type="content" source="./media/tutorial-cicd-azure-pipelines/manage-service-principal.png" alt-text="Screenshot that shows selections for managing a service principal.":::

    You'll see the details of the service principal in the Azure portal. Note the service principal's **Application (Client) ID** value.

    :::image type="content" source="./media/tutorial-cicd-azure-pipelines/service-connection-object-id.png" alt-text="Screenshot that shows how to get the application I D for the service connection.":::
    
1. Assign the Load Test Contributor role to the service principal to allow access to the Azure Load Testing service.

    First, retrieve the ID of the service principal object. Select the `objectId` result from the following Azure CLI command:

    ```azurecli
    az ad sp show --id "<application-client-id>"
    ```
    
    Next, assign the Load Test Contributor role to the service principal. Replace the placeholder text `<sp-object-id>` with the ID of the service principal object. Also, replace `<subscription-name-or-id>` with your Azure subscription ID.

    ```azurecli
    az role assignment create --assignee "<sp-object-id>" \
        --role "Load Test Contributor" \
        --subscription "<subscription-name-or-id>"
    ```

## Configure the Azure Pipelines workflow to run a load test

In this section, you'll set up an Azure Pipelines workflow that triggers the load test. The sample application repository contains a pipelines definition file. The pipeline first deploys the sample web application to Azure App Service, and then invokes the load test. The pipeline uses an environment variable to pass the URL of the web application to the Apache JMeter script.

First, you'll install the Azure Load Testing extension from the Azure DevOps Marketplace, create a new pipeline, and then connect it to the sample application's forked repository.

1. Install the Azure Load Testing task extension from the Azure DevOps Marketplace.

    :::image type="content" source="./media/tutorial-cicd-azure-pipelines/browse-marketplace.png" alt-text="Screenshot that shows how to browse the Visual Studio Marketplace for extensions.":::
    
    :::image type="content" source="./media/tutorial-cicd-azure-pipelines/marketplace-load-testing-extension.png" alt-text="Screenshot that shows the button for installing the Azure Load Testing extension from the Visual Studio Marketplace.":::

1. In your Azure DevOps project, select **Pipelines**, and then select **Create pipeline**.

    :::image type="content" source="./media/tutorial-cicd-azure-pipelines/create-pipeline.png" alt-text="Screenshot that shows selections for creating an Azure pipeline.":::

1. On the **Connect** tab, select **GitHub**.

1. Select **Authorize Azure Pipelines** to allow Azure Pipelines to access your GitHub account for triggering workflows.

1. On the **Select** tab, select the sample application's forked repository.

    :::image type="content" source="./media/tutorial-cicd-azure-pipelines/create-pipeline-select-repo.png" alt-text="Screenshot that shows how to select the sample application's GitHub repository.":::

    The repository contains an *azure-pipeline.yml* pipeline definition file. You'll now modify this definition to connect to your Azure Load Testing service.

1. On the **Review** tab, replace the following placeholder text in the YAML code:

    |Placeholder  |Value  |
    |---------|---------|
    |`<Name of your webapp>`     | The name of the Azure App Service web app. |
    | `<Name of your webARM Service connection>` | The name of the service connection that you created in the previous section. |
    |`<Azure subscriptionId>`     | Your Azure subscription ID. |
    |`<Name of your load test resource>`     | The name of your Azure Load Testing resource. |
    |`<Name of your load test resource group>`     | The name of the resource group that contains the Azure Load Testing resource. |

    :::image type="content" source="./media/tutorial-cicd-azure-pipelines/create-pipeline-review.png" alt-text="Screenshot that shows the Azure Pipelines Review tab when you're creating a pipeline.":::

1. Select **Save and run**, enter text for **Commit message**, and then select **Save and run**.

    :::image type="content" source="./media/tutorial-cicd-azure-pipelines/create-pipeline-save.png" alt-text="Screenshot that shows selections for saving and running a new Azure pipeline.":::

    Azure Pipelines now runs the CI/CD workflow. You can monitor the status and logs by selecting the pipeline job.

    :::image type="content" source="./media/tutorial-cicd-azure-pipelines/create-pipeline-status.png" alt-text="Screenshot that shows how to view pipeline job details.":::

## View results of a load test

For every update to the main branch, the Azure pipeline executes the following steps:

- Deploy the sample Node.js application to an Azure App Service web app. The name of the web app is configured in the pipeline definition.
- Create an Azure Load Testing resource using the Azure Resource Manager (ARM) template present in the GitHub repository. Learn more about ARM templates [here](/azure/azure-resource-manager/templates/overview).
- Trigger Azure Load Testing to create and run the load test, based on the Apache JMeter script and the test configuration YAML file in the repository.

To view the results of the load test in the pipeline log:

1. In your Azure DevOps project, select **Pipelines**, and then select your pipeline definition from the list.

1. Select the pipeline run to view the run summary.

    :::image type="content" source="./media/tutorial-cicd-azure-pipelines/create-pipeline-run-summary.png" alt-text="Screenshot that shows the pipeline run summary.":::

1. Select **Load Test** in the **Jobs** section to view the pipeline log.

    :::image type="content" source="./media/tutorial-cicd-azure-pipelines/create-pipeline-log.png" alt-text="Screenshot that shows the Azure Pipelines run log.":::

    After the load test finishes, you can view the test summary information and the client-side metrics in the pipeline log. The log also shows the URL to go to the Azure Load Testing dashboard for this load test.

2. In the pipeline log view, select **Load Test**, and then select **1 artifact produced** to download the result files for the load test.

    :::image type="content" source="./media/tutorial-cicd-azure-pipelines/create-pipeline-download-results.png" alt-text="Screenshot that shows how to download the load test results.":::

## Define test pass/fail criteria

In this section, you'll add criteria to determine whether your load test passes or fails. If at least one of the pass/fail criteria evaluates to `true`, the load test is unsuccessful.

You can specify these criteria in the test configuration YAML file:

1. Edit the *SampleApp.yml* file in your GitHub repository.  

1. Add the following snippet at the end of the file:

    ```yaml
    failureCriteria: 
        - avg(response_time_ms) > 100
        - percentage(error) > 20
    ```

    You've now specified pass/fail criteria for your load test. The test will fail if at least one of these conditions is met:
    
    - The aggregate average response time is greater than 100 ms.    
    - The aggregate percentage of errors is greater than 20%.

1. Commit and push the changes to the main branch of the repository.
    
    The changes will trigger the Azure Pipelines CI/CD workflow.

1. On the page for pipeline runs, select the most recent entry from the list.

    After the load test finishes, you'll notice that the pipeline failed because the average response time was higher than the number that you specified in the pass/fail criteria.

    :::image type="content" source="./media/tutorial-cicd-azure-pipelines/test-criteria-failed.png" alt-text="Screenshot that shows pipeline logs after failed test criteria.":::

    The Azure Load Testing service evaluates the criteria during the test run. If any of these conditions fails, Azure Load Testing service returns a nonzero exit code. This code informs the CI/CD workflow that the test has failed.

1. Edit the *SampleApp.yml* file and change the test's pass/fail criteria:

    ```yaml
    failureCriteria: 
        - avg(response_time_ms) > 5000
        - percentage(error) > 20
    ```
    
1. Commit the changes to trigger the Azure Pipelines CI/CD workflow. 
    
    :::image type="content" source="./media/tutorial-cicd-azure-pipelines/test-criteria-passed.png" alt-text="Screenshot that shows pipeline logs after all test criteria pass.":::

    The load test now succeeds and the pipeline finishes successfully.

## Pass parameters to your load tests from the pipeline

Next, you'll parameterize your load test by using pipeline variables. These variables can be secrets, such as passwords, or non-secrets.

In this tutorial, you'll reconfigure the sample application to accept only secure requests. To send a secure request, you need to pass a secret value in the HTTP request:

1. Edit the *SampleApp.yaml* file in your GitHub repository.

    Update the `testPlan` configuration setting to use the *SampleApp_Secrets.jmx* file:

    ```yml
    version: v0.1
    testName: SampleApp
    testPlan: SampleApp_Secrets.jmx
    description: 'SampleApp Test with secrets'
    engineInstances: 1
    ```

    The *SampleApp_Secrets.jmx* Apache JMeter script uses a user-defined variable that retrieves the secret value with the custom function `${__GetSecret(secretName)}`. Apache JMeter then passes this secret value to the sample application endpoint.

1. Commit the changes to the YAML file.

1. Edit the *config.json* file in your GitHub repository.
    
    Update the `enableSecretsFeature` setting to `true` to reconfigure the sample application to accept only secure requests:
    
    ```json
    {
        "enableSecretsFeature": true
    }
    ```
    
1. Commit the changes to the *config.json* file.

1. Go to the **Pipelines** page, select your pipeline definition, and then select **Edit**.

    :::image type="content" source="./media/tutorial-cicd-azure-pipelines/edit-pipeline.png" alt-text="Screenshot that shows selections for editing a pipeline definition.":::

1. Select **Variables**, and then select **New variable**.

1. Enter the **Name** (**mySecret**) and **Value** (**1797669089**) information. Then select the **Keep this value secret** checkbox to store the variable securely. 

    :::image type="content" source="./media/tutorial-cicd-azure-pipelines/new-variable.png" alt-text="Screenshot that shows selections for creating a pipeline variable.":::

1. Select **OK**, and then select **Save** to save the new variable.

1. Edit the *azure-pipeline.yml* file to pass the secret to the load test.

    Edit the Azure Load Testing task by adding the following YAML snippet:

    ```yml
    secrets: |
      [
          {
          "name": "appToken",
          "value": "$(mySecret)"
          }
      ]
    ```

1. Save and run the pipeline.  

    The Azure Load Testing task securely passes the secret from the pipeline to the test engine. The secret parameter is used only while you're running the load test, and then the value is discarded from memory.
    
## Configure and use the Azure Load Testing task

This section describes the Azure Load Testing task for Azure Pipelines. The task is cross-platform and runs on Windows, Linux, or Mac agents.

You can use the following parameters to configure the Azure Load Testing task:

|Parameter  |Description  |
|---------|---------|
|`azureSubscription`     |  *Required*. Name of the Azure Resource Manager service connection.       |
|`loadTestConfigFile`     | *Required*. Path to the YAML configuration file for the load test. The path is fully qualified or relative to the default working directory.        |
|`resourceGroup`     |  *Required*. Name of the resource group that contains the Azure Load Testing resource.       |
|`loadTestResource`     |   *Required*. Name of an existing Azure Load Testing resource.      |
|`secrets`     |   Array of JSON objects that consist of the name and value for each secret. The name should match the secret name used in the Apache JMeter test script. |
|`env`     |   Array of JSON objects that consist of the name and value for each environment variable. The name should match the variable name used in the Apache JMeter test script. |

The following YAML code snippet describes how to use the task in an Azure Pipelines CI/CD workflow:

```yaml
- task: AzureLoadTest@1
  inputs:
    azureSubscription: '<Azure service connection>'
    loadTestConfigFile: '< YAML File path>'
    loadTestResource: '<name of the load test resource>'
    resourceGroup: '<name of the resource group of your load test resource>' 
    secrets: |
      [
          {
          "name": "<Name of the secret>",
          "value": "$(mySecret1)"
          },
          {
          "name": "<Name of the secret>",
          "value": "$(mySecret1)"
          }
      ]
    env: |
      [
          {
          "name": "<Name of the variable>",
          "value": "<Value of the variable>"
          },
          {
          "name": "<Name of the variable>",
          "value": "<Value of the variable>"
          }
      ]
```

## Clean up resources

[!INCLUDE [alt-delete-resource-group](../../includes/alt-delete-resource-group.md)]

## Next steps

You've now created an Azure Pipelines CI/CD workflow that uses Azure Load Testing for automatically running load tests. By using pass/fail criteria, you can set the status of the CI/CD workflow. With parameters, you can make the running of load tests configurable.

* For more information about parameterizing load tests, see [Parameterize a load test](./how-to-parameterize-load-tests.md).
* For more information about defining test pass/fail criteria, see [Define test criteria](./how-to-define-test-criteria.md).
