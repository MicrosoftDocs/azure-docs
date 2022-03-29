---
title: 'Tutorial: Something about Microsoft Dev Box'
titleSuffix: Microsoft Dev Box
description: 'Placeholder description for Dev Box content'
services: dev-box
ms.service: dev-box
ms.author: rosemalcolm
author: RoseHJM
ms.date: 03/22/2022
ms.topic: tutorial
#Customer intent: As an Azure user, I want to learn how to automatically test builds for performance regressions on every merge request and/or deployment by using Azure Pipelines.
---

# Tutorial: Placeholder H1

This tutorial describes how to automate performance regression testing by using Microsoft Dev Box Preview and Azure Pipelines. You'll configure an Azure Pipelines CI/CD workflow with the [Microsoft Dev Box task](/azure/devops/pipelines/tasks/test/azure-load-testing) to run a load test for a sample web application. You'll then use the test results to identify performance regressions.

You'll learn how to:

> [!div class="checklist"]
> * Set up your repository with files required for load testing.
> * Set up Azure Pipelines to integrate with Microsoft Dev Box.
> * Run the load test and view results in the pipeline logs.
> * Define pass/fail criteria for the load test.
> * Parameterize the load test by using pipeline variables.

> [!IMPORTANT]
> Microsoft Dev Box is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

> [!NOTE]
> Azure Pipelines has a 60-minute timeout on jobs that are running on Microsoft-hosted agents for private projects. If your load test is running for more than 60 minutes, you'll need to pay for [additional capacity](/azure/devops/pipelines/agents/hosted?tabs=yaml#capabilities-and-limitations). If not, the pipeline will time out without waiting for the test results. You can view the status of the load test in the Azure portal.

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
* An Azure DevOps organization and project. If you don't have an Azure DevOps organization, you can [create one for free](/azure/devops/pipelines/get-started/pipelines-sign-up?view=azure-devops&preserve-view=true). If you need help with getting started with Azure Pipelines, see [Create your first pipeline](/azure/devops/pipelines/create-first-pipeline?preserve-view=true&view=azure-devops&tabs=java%2Ctfs-2018-2%2Cbrowser).
* A GitHub account, where you can create a repository. If you don't have one, you can [create one for free](https://github.com/).

## Set up the sample application repository

To get started, you need a GitHub repository with the sample web application. You'll use this repository to configure an Azure Pipelines workflow to run the load test.

The sample application's source repo includes an Apache JMeter script named *SampleApp.jmx*. This script makes three API calls on each test iteration:

* `add`: Carries out a data insert operation on Azure Cosmos DB for the number of visitors on the web app.
* `get`: Carries out a GET operation from Azure Cosmos DB to retrieve the count.
* `lasttimestamp`: Updates the time stamp since the last user went to the website.

1. Open a browser and go to the sample application's [source GitHub repository](https://github.com/Azure-Samples/nodejs-appsvc-cosmosdb-bottleneck.git).

    The sample application is a Node.js app that consists of an Azure App Service web component and an Azure Cosmos DB database.

1. Select **Fork** to fork the sample application's repository to your GitHub account.

## Set up Azure Pipelines access permissions for Azure

In this section, you'll configure your Azure DevOps project to have permissions to access the Microsoft Dev Box resource.

To access Azure resources, create a service connection in Azure DevOps and use role-based access control to assign the necessary permissions:

1. Sign in to your Azure DevOps organization (`https://dev.azure.com/<yourorganization>`).

1. Select **Project settings** > **Service connections**.

1. Select **+ New service connection**, select the **Azure Resource Manager** service connection, and then select **Next**.

1. Select the **Service Principal (automatic)** authentication method, and then select **Next**.

1. Select the **Subscription** scope level, and then select the Azure subscription that contains your Microsoft Dev Box resource.

    You'll use the name of the service connection in a later step to configure the pipeline.

1. Select **Save** to create the connection.

1. Select the service connection from the list, and then select **Manage Service Principal**.
  
1. Assign the Load Test Contributor role to the service principal to allow access to the Microsoft Dev Box service.

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

In this section, you'll set up an Azure Pipelines workflow that triggers the load test. 

The sample application repository already contains a pipelines definition file. This pipeline first deploys the sample web application to Azure App Service, and then invokes the load test by using the [Microsoft Dev Box task](/azure/devops/pipelines/tasks/test/azure-load-testing). The pipeline uses an environment variable to pass the URL of the web application to the Apache JMeter script.

1. Install the **Microsoft Dev Box** task extension from the Azure DevOps Marketplace.

    :::image type="content" source="./media/tutorial-cicd-azure-pipelines/browse-marketplace.png" alt-text="Screenshot that shows how to browse the Visual Studio Marketplace for extensions.":::
    
    

1. In your Azure DevOps project, select **Pipelines**, and then select **Create pipeline**.

    :::image type="content" source="./media/tutorial-cicd-azure-pipelines/create-pipeline.png" alt-text="Screenshot that shows selections for creating an Azure pipeline.":::

1. On the **Connect** tab, select **GitHub**.

1. Select **Authorize Azure Pipelines** to allow Azure Pipelines to access your GitHub account for triggering workflows.

1. On the **Select** tab, select the sample application's forked repository.

    :::image type="content" source="./media/tutorial-cicd-azure-pipelines/create-pipeline-select-repo.png" alt-text="Screenshot that shows how to select the sample application's GitHub repository.":::

    The repository contains an *azure-pipeline.yml* pipeline definition file. The following snippet shows how to use the [Microsoft Dev Box task](/azure/devops/pipelines/tasks/test/azure-load-testing) in Azure Pipelines:

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

    You'll now modify the pipeline to connect to your Microsoft Dev Box service.

1. On the **Review** tab, replace the following placeholder text in the YAML code:

    |Placeholder  |Value  |
    |---------|---------|
    |`<Name of your webapp>`     | The name of the Azure App Service web app. |
    | `<Name of your webARM Service connection>` | The name of the service connection that you created in the previous section. |
    |`<Azure subscriptionId>`     | Your Azure subscription ID. |
    |`<Name of your load test resource>`     | The name of your Microsoft Dev Box resource. |
    |`<Name of your load test resource group>`     | The name of the resource group that contains the Microsoft Dev Box resource. |

    :::image type="content" source="./media/tutorial-cicd-azure-pipelines/create-pipeline-review.png" alt-text="Screenshot that shows the Azure Pipelines Review tab when you're creating a pipeline.":::

1. Select **Save and run**, enter text for **Commit message**, and then select **Save and run**.
    
## Clean up resources

[!INCLUDE [alt-delete-resource-group](../../includes/alt-delete-resource-group.md)]

## Next steps

You've now created an Azure Pipelines CI/CD workflow that uses Microsoft Dev Box for automatically running load tests. By using pass/fail criteria, you can set the status of the CI/CD workflow. With parameters, you can make the running of load tests configurable.

* Learn more about the [Microsoft Dev Box task](/azure/devops/pipelines/tasks/test/azure-load-testing).
* Learn more about [Parameterizing a load test](./how-to-1.md).
