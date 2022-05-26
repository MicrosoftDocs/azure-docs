---
title: 'Tutorial: Identify performance regressions with Azure Load Testing and Azure Pipelines'
titleSuffix: Azure Load Testing
description: 'In this tutorial, you learn how to automate performance regression testing by using Azure Load Testing and Azure Pipelines CI/CD workflows.'
services: load-testing
ms.service: load-testing
ms.author: ninallam
author: ninallam
ms.date: 03/28/2022
ms.topic: tutorial
#Customer intent: As an Azure user, I want to learn how to automatically test builds for performance regressions on every merge request and/or deployment by using Azure Pipelines.
---

# Tutorial: Identify performance regressions with Azure Load Testing Preview and Azure Pipelines

This tutorial describes how to automate performance regression testing by using Azure Load Testing Preview and Azure Pipelines. You'll set up an Azure Pipelines CI/CD workflow to deploy a sample Node.js application on Azure and trigger a load test using the [Azure Load Testing task](/azure/devops/pipelines/tasks/test/azure-load-testing). Once the load test finishes, you'll use the Azure Load Testing dashboard to identify performance issues.

You'll deploy a sample Node.js web app on Azure App Service. The web app uses Azure Cosmos DB for storing the data. The sample application also contains an Apache JMeter script to load test three APIs.

If you're using GitHub Actions for your CI/CD workflows, see the corresponding [GitHub Actions tutorial](./tutorial-cicd-github-actions.md).

Learn more about the [key concepts for Azure Load Testing](./concept-load-testing-concepts.md).

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

## Set up the sample application repository

To get started with this tutorial, you first need to set up a sample Node.js web application. The sample application contains an Azure Pipelines definition to deploy the application on Azure and trigger a load test.

[!INCLUDE [azure-load-testing-set-up-sample-application](../../includes/azure-load-testing-set-up-sample-application.md)]

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
        --scope /subscriptions/<subscription-name-or-id>/resourceGroups/<resource-group-name> \
        --subscription "<subscription-name-or-id>"
    ```

## Configure the Azure Pipelines workflow to run a load test

In this section, you'll set up an Azure Pipelines workflow that triggers the load test. The sample application repository already contains a pipelines definition file *azure-pipeline.yml*. 

The Azure Pipelines workflow performs the following steps for every update to the main branch:

- Deploy the sample Node.js application to an Azure App Service web app.
- Create an Azure Load Testing resource using the *ARMTemplate/template.json* Azure Resource Manager (ARM) template, if the resource doesn't exist yet. Learn more about ARM templates [here](../azure-resource-manager/templates/overview.md).
- Trigger Azure Load Testing to create and run the load test, based on the Apache JMeter script and the test configuration YAML file in the repository.
- Invoke Azure Load Testing by using the [Azure Load Testing task](/azure/devops/pipelines/tasks/test/azure-load-testing) and the sample Apache JMeter script *SampleApp.jmx* and the load test configuration file *SampleApp.yaml*.

Follow these steps to configure the Azure Pipelines workflow for your environment:

1. Install the **Azure Load Testing** task extension from the Azure DevOps Marketplace.

    :::image type="content" source="./media/tutorial-cicd-azure-pipelines/browse-marketplace.png" alt-text="Screenshot that shows how to browse the Visual Studio Marketplace for extensions.":::
    
    :::image type="content" source="./media/tutorial-cicd-azure-pipelines/marketplace-load-testing-extension.png" alt-text="Screenshot that shows the button for installing the Azure Load Testing extension from the Visual Studio Marketplace.":::

1. In your Azure DevOps project, select **Pipelines**, and then select **Create pipeline**.

    :::image type="content" source="./media/tutorial-cicd-azure-pipelines/create-pipeline.png" alt-text="Screenshot that shows selections for creating an Azure pipeline.":::

1. On the **Connect** tab, select **GitHub**.

1. Select **Authorize Azure Pipelines** to allow Azure Pipelines to access your GitHub account for triggering workflows.

1. On the **Select** tab, select the sample application's forked repository.

    :::image type="content" source="./media/tutorial-cicd-azure-pipelines/create-pipeline-select-repo.png" alt-text="Screenshot that shows how to select the sample application's GitHub repository.":::

    The repository contains an *azure-pipeline.yml* pipeline definition file. The following snippet shows how to use the [Azure Load Testing task](/azure/devops/pipelines/tasks/test/azure-load-testing) in Azure Pipelines:

    ```yml
    - task: AzureLoadTest@1
      inputs:
        azureSubscription: $(serviceConnection)
        loadTestConfigFile: 'SampleApp.yaml'
        resourceGroup: $(loadTestResourceGroup)
        loadTestResource: $(loadTestResource)
        env: |
          [
            {
            "name": "webapp",
            "value": "$(webAppName).azurewebsites.net"
            }
          ]
    ```

    You'll now modify the pipeline to connect to your Azure Load Testing service.

1. On the **Review** tab, replace the following placeholder text in the YAML code:

    |Placeholder  |Value  |
    |---------|---------|
    |`<Name of your webapp>`     | The name of the Azure App Service web app. |
    | `<Name of your webARM Service connection>` | The name of the service connection that you created in the previous section. |
    |`<Azure subscriptionId>`     | Your Azure subscription ID. |
    |`<Name of your load test resource>`     | The name of your Azure Load Testing resource. |
    |`<Name of your load test resource group>`     | The name of the resource group that contains the Azure Load Testing resource. |

    :::image type="content" source="./media/tutorial-cicd-azure-pipelines/create-pipeline-review.png" alt-text="Screenshot that shows the Azure Pipelines Review tab when you're creating a pipeline.":::

    These variables are used to configure the Azure Pipelines tasks for deploying the sample application to Azure, and to connect to your Azure Load Testing resource.

1. Select **Save and run**, enter text for **Commit message**, and then select **Save and run**.

    :::image type="content" source="./media/tutorial-cicd-azure-pipelines/create-pipeline-save.png" alt-text="Screenshot that shows selections for saving and running a new Azure pipeline.":::

    Azure Pipelines now runs the CI/CD workflow. You can monitor the status and logs by selecting the pipeline job.

    :::image type="content" source="./media/tutorial-cicd-azure-pipelines/create-pipeline-status.png" alt-text="Screenshot that shows how to view pipeline job details.":::

## View load test results

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
    
## Clean up resources

[!INCLUDE [alt-delete-resource-group](../../includes/alt-delete-resource-group.md)]

## Next steps

You've now created an Azure Pipelines CI/CD workflow that uses Azure Load Testing for automatically running load tests. By using pass/fail criteria, you can set the status of the CI/CD workflow. With parameters, you can make the running of load tests configurable.

* Learn more about the [Azure Load Testing task](/azure/devops/pipelines/tasks/test/azure-load-testing).
* Learn more about [Parameterizing a load test](./how-to-parameterize-load-tests.md).
* Learn more [Define test pass/fail criteria](./how-to-define-test-criteria.md).
* Learn more about [Configuring server-side monitoring](./how-to-monitor-server-side-metrics.md).
