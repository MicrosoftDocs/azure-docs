---
title: Publish Revisions by Using Azure Pipelines in Azure Container Apps
description: Learn how to automatically create new revisions in Azure Container Apps by using an Azure DevOps pipeline.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom:
  - devx-track-azurecli
  - ignite-2023
ms.topic: how-to
ms.date: 02/02/2026
ms.author: cshoe
---

# Deploy to Azure Container Apps from Azure Pipelines

Azure Container Apps enables you to use Azure Pipelines to publish [revisions](revisions.md) to your container app. As commits are pushed to your [Azure DevOps repository](/azure/devops/repos/), a pipeline is triggered that updates the container image in the container registry. Container Apps creates a new revision based on the updated container image.

Commits to a specific branch in your repository trigger the pipeline. When creating the pipeline, you decide which branch is the trigger.

## Container Apps Azure Pipelines task

The task supports the following scenarios:

* Build from a Dockerfile and deploy to Container Apps.
* Build from source code without a Dockerfile and deploy to Container Apps. Supported languages include .NET, Java, Node.js, PHP, and Python.
* Deploy an existing container image to Container Apps.

With the production release, this task comes with Azure DevOps and doesn't require explicit installation. For the complete documentation, see [AzureContainerApps@1 - Azure Container Apps Deploy v1 task](/azure/devops/pipelines/tasks/reference/azure-container-apps-v1).

### Usage examples

Following are some common scenarios for using the task. For more information, see the [task's documentation](https://github.com/Azure/container-apps-deploy-pipelines-task/blob/main/README.md).

#### Build and deploy to Container Apps

The following snippet shows how to build a container image from source code and deploy it to Container Apps.

```yaml
steps:
- task: AzureContainerApps@1
  inputs:
    appSourcePath: '$(Build.SourcesDirectory)/src'
    azureSubscription: 'my-subscription-service-connection'
    acrName: 'myregistry'
    containerAppName: 'my-container-app'
    resourceGroup: 'my-container-app-rg'
```

The task uses the Dockerfile at `appSourcePath` to build the container image. If no Dockerfile is found, the task attempts to build the container image from source code in `appSourcePath`.

#### Deploy an existing container image to Container Apps

The following snippet shows how to deploy an existing container image to Container Apps. The task authenticates with the registry by using the service connection. If the service connection's identity isn't assigned the `AcrPush` role for the registry, supply the registry's admin credentials by using the `acrUsername` and `acrPassword` input parameters.

```yaml
steps:
  - task: AzureContainerApps@1
    inputs:
      azureSubscription: 'my-subscription-service-connection'
      containerAppName: 'my-container-app'
      resourceGroup: 'my-container-app-rg'
      imageToDeploy: 'myregistry.azurecr.io/my-container-app:$(Build.BuildId)'
```

> [!IMPORTANT]
> If you're building a container image in a separate step, be sure to use a unique tag such as the build ID instead of a stable tag like `latest`. For more information, see [Image tag best practices](/azure/container-registry/container-registry-image-tag-version).

### Authenticate with Azure Container Registry

The Container Apps task needs to authenticate with your Azure Container Registry to push the container image. The container app also needs to authenticate with your container registry to pull the container image.

To push images, the task automatically authenticates with the container registry specified in `acrName` by using the service connection provided in `azureSubscription`. If the service connection's identity isn't assigned the `AcrPush` role for the registry, supply the registry's admin credentials by using `acrUsername` and `acrPassword`.

To pull images, Container Apps uses either managed identity (recommended) or admin credentials to authenticate with the container registry. To use managed identity, the target container app for the task must be [configured to use managed identity](managed-identity-image-pull.md). To authenticate with the registry's admin credentials, set the task's `acrUsername` and `acrPassword` inputs.

## Configuration

Complete the following steps to configure an Azure DevOps pipeline to deploy to Container Apps.

> [!div class="checklist"]
> * Create an Azure DevOps repository for your app
> * Create a container app with managed identity enabled
> * Assign the `AcrPull` role for the container registry to the container app's managed identity
> * Configure an Azure DevOps service connection for your Azure subscription
> * Create an Azure DevOps pipeline

### Prerequisites

| Requirement | Instructions |
|--|--|
| Azure account | If you don't have one, [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn). You need the *Contributor* or *Owner* permission on the Azure subscription to complete the procedures in this article. For more information, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal?tabs=current). |
| Azure DevOps project | Go to [Azure DevOps](https://azure.microsoft.com/services/devops/) and select **Get started with Azure**. Then create a new project. |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|

### Create an Azure DevOps repository and clone the source code

Before you create a pipeline, the source code for your app must be in a repository. 

1. Sign in to [Azure DevOps](https://dev.azure.com/) and go to your project.

1. Select **Repos** in the left pane.

1. Select **Import a repository**.

1. Enter the following values, and then select **Import**:

    | Field | Value |
    |--|--|
    | **Repository type**|	**Git**|
    | **Clone URL** | **https://github.com/Azure-Samples/containerapps-albumapi-csharp.git** |

1. Select **Import**.

1. Select **Clone** to view the repository URL and copy it.

1. Open a command prompt and run the following command:

    ```bash
    git clone <REPOSITORY_URL> my-container-app
    ```

    Replace `<REPOSITORY_URL>` with the URL you copied.
    
### Create a container app and configure managed identity

Create your container app by completing the following steps. The `az containerapp up` command creates Azure resources, builds the container image, stores the image in a registry, and deploys a container app.

After your app is created, you can add a managed identity to your app and assign the identity the `AcrPull` role to allow the identity to pull images from the registry. 

[!INCLUDE [container-apps-github-devops-setup.md](../../includes/container-apps-github-devops-setup.md)]


### Create an Azure DevOps service connection

To deploy to Container Apps, you need to create an Azure DevOps service connection for your Azure subscription.

1. In Azure DevOps, select **Project settings**.

1. Select **Service connections**.

1. Select **Create service connection**.

1. Select **Azure Resource Manager**, and then select **Next**.

1. Select **App registration (automatic)**, and then select **Next**.

1. Provide the following values, and then select **Save**:

    | Field | Value |
    |--|--|
    | **Subscription** | Select your Azure subscription. |
    | **Resource group** | Select the resource group (`my-container-app-rg`) that contains your container app and container registry. |
    | **Service connection name** | `my-subscription-service-connection` |

To learn more about service connections, see [Connect to Microsoft Azure](/azure/devops/pipelines/library/connect-to-azure).

### Create an Azure DevOps YAML pipeline

1. In your Azure DevOps project, select **Pipelines**.

1. Select **Create pipeline**.

1. Select **Azure Repos Git**.

    > [!NOTE]
    > If you don't see **Azure Repos Git** as an option, make sure your source code is pushed to a Git repository in your Azure DevOps project.

1. Select the repo that contains your source code (`my-container-app`).

1. Select **Starter pipeline**.

1. In the editor, replace the contents of the file with the following YAML:

    ```yaml
    trigger:
      branches:
        include:
          - main

    pool:
      vmImage: ubuntu-latest

    steps:
      - task: AzureContainerApps@1
        inputs:
          appSourcePath: '$(Build.SourcesDirectory)/src'
          azureSubscription: '<AZURE_SUBSCRIPTION_SERVICE_CONNECTION>'
          acrName: '<ACR_NAME>'
          containerAppName: 'my-container-app'
          resourceGroup: 'my-container-app-rg'
    ```

    Replace `<AZURE_SUBSCRIPTION_SERVICE_CONNECTION>` with the name of the Azure DevOps service connection (`my-subscription-service-connection`) you created in the previous step. Replace `<ACR_NAME>` with the name of your Azure container registry.

1. Select **Save and run**.

An Azure Pipelines run starts to build and deploy your container app. To check its progress, go to **Pipelines** and select the run. During the first pipeline run, you might be prompted to authorize the pipeline to use your service connection.

To deploy a new revision of your app, push a new commit to the *main* branch.
