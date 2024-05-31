---
title: 'Tutorial: Deploy environments with Azure Pipelines'
description: Learn how to integrate Azure Deployment Environments into your Azure Pipelines CI/CD pipeline and streamline your software development process.
author: RoseHJM
ms.author: rosemalcolm
ms.service: deployment-environments
ms.topic: tutorial
ms.date: 02/26/2024

# customer intent: As a developer, I want to use an Azure Pipeline to deploy an ADE deployment environment so that I can integrate it into a CI/CD development environment.
---

# Tutorial: Deploy environments in CI/CD by using Azure Pipelines

In this tutorial, you learn how to integrate Azure Deployment Environments (ADE) into your Azure Pipelines CI/CD pipeline.

Continuous integration and continuous delivery (CI/CD) is a software development approach that helps teams to automate the process of building, testing, and deploying software changes. CI/CD enables you to release software changes more frequently and with greater confidence. 

Before beginning this tutorial, familiarize yourself with Deployment Environments resources and concepts by reviewing [Key concepts for Azure Deployment Environments](concept-environments-key-concepts.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create and configure an Azure Repos repository
> * Connect the catalog to your dev center
> * Configure service connection
> * Create a pipeline
> * Create an environment
> * Test the CI/CD pipeline

## Prerequisites

- An Azure account with an active subscription.
  - [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Owner permissions on the Azure subscription.
- An Azure DevOps subscription.
  - [Create an account for free](https://azure.microsoft.com/services/devops/?WT.mc_id=A261C142F).
  - An Azure DevOps organization and project.
- Azure Deployment Environments.
    - [Dev center and project](./quickstart-create-and-configure-devcenter.md).
    - [Sample catalog](https://github.com/Azure/deployment-environments) attached to the dev center.

## Create and configure an Azure Repos repository

1. Sign in to your Azure DevOps organization (`https://dev.azure.com/<your-organization>`), and select your project. Replace the `<your-organization>` text placeholder with your project identifier.
1. Select **Repos** > **Files**.
1. In **Import a repository**, select **Import**. 
1. In **Import a Git repository**, select or enter the following:
    - **Repository type**: Git
    - **Clone URL**: https://github.com/Azure/deployment-environments


## Configure environment types

Environment types define the different types of environments your development teams can deploy. You can apply different settings for each environment type. You create environment types at the dev center level and referenced at the project level.

Create dev center environment types:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In **Dev centers**, select your dev center.
1. In the left menu under **Environment configuration**, select **Environment types**, and then select **Create**.
1. Use the following steps to create three environment types: Sandbox, FunctionApp, WebApp.
   In **Create environment type**, enter the following information, and then select **Add**.

    |Name     |Value     |
    |---------|----------|
    |**Name**|Enter a name for the environment type.|
    |**Tags**|Enter a tag name and a tag value.|

1. Confirm that the environment type was added by checking your Azure portal notifications.
 
Create project environment types:

1. In the left menu under **Manage**, select **Projects**, and then select the project you want to use.
1. In the left menu under **Environment configuration**, select **Environment types**, and then select **Add**.
1. Use the following steps to add the three environment types: Sandbox, FunctionApp, WebApp.
   In **Add environment type to \<project-name\>**, enter or select the following information:

    |Name     |Value     |
    |---------|----------|
    |**Type**| Select a dev center level environment type to enable for the specific project.|
    |**Deployment subscription**| Select the subscription in which the environment is created.|
    |**Deployment identity** | Select either a system-assigned identity or a user-assigned managed identity to perform deployments on behalf of the user.|
    |**Permissions on environment resources** > **Environment creator role(s)**|  Select the roles to give access to the environment resources.|
    |**Permissions on environment resources** > **Additional access** | Select the users or Microsoft Entra groups to assign to specific roles on the environment resources.|
    |**Tags** | Enter a tag name and a tag value. These tags are applied on all resources that are created as part of the environment.|

1. Confirm that the environment type was added by checking your Azure portal notifications.


## Configure a service connection

In Azure Pipelines, you create a *service connection* in your Azure DevOps project to access resources in your Azure subscription. When you create the service connection, Azure DevOps creates a Microsoft Entra service principal object.

1. Sign in to your Azure DevOps organization (`https://dev.azure.com/<your-organization>`), and select your project. Replace the `<your-organization>` text placeholder with your project identifier.
1. Select **Project settings** > **Service connections** > **+ New service connection**.
1. In the **New service connection** pane, select the **Azure Resource Manager**, and then select **Next**.
1. Select the **Service Principal (automatic)** authentication method, and then select **Next**.
1. Enter the service connection details, and then select **Save** to create the service connection.

    | Field | Value |
    | ----- | ----- |
    | **Scope level** | *Subscription*. |
    | **Subscription** | Select the Azure subscription that hosts your dev center resource. |
    | **Resource group** | Select the resource group that contains your dev center resource. |
    | **Service connection name** | Enter a unique name for the service connection. |
    | **Grant access permission to all pipelines** | Checked. |

1. From the list of service connections, select the one you created earlier, and then select **Manage Service Principal**.
   The Azure portal opens in a separate browser tab and shows the service principal details.
1. In the Azure portal, copy the **Display name** value.
    You use this value in the next step to grant permissions for running load tests to the service principal.

### Grant the service connection access to the ADE project

Azure Deployment Environments uses role-based access control to grant permissions for performing specific activities on your ADE resource. To make changes from a CI/CD pipeline, you grant the Deployment Environments User role to the service principal.

1. In the [Azure portal](https://portal.azure.com/), go to your ADE project.
1. Select **Access control (IAM)** > **Add** > **Add role assignment**.
1. In the **Role** tab, select **Deployment Environments User** in the list of job function roles.
1. In the **Members** tab, select **Select members**, and then use the display name you copied previously to search the service principal.
1. Select the service principal, and then select **Select**.
1. In the **Review + assign tab**, select **Review + assign** to add the role assignment.

You can now use the service connection in your Azure Pipelines workflow definition to access your ADE environments.

### Grant your account access to the ADE project

To view environments created by other users, including the service connection, you need to grant your account read access to the ADE project.

1. In the [Azure portal](https://portal.azure.com/), go to your ADE project.
1. Select **Access control (IAM)** > **Add** > **Add role assignment**.
1. In the **Role** tab, select **Deployment Environments Reader** in the list of job function roles.
1. In the **Members** tab, select **Select members**, and then search for your own account.
1. Select your account from the list, and then select **Select**.
1. In the **Review + assign tab**, select **Review + assign** to add the role assignment.

You can now view the environments created by your Azure Pipelines workflow.

## Configure a pipeline

Edit the `azure-pipelines.yml` file in your Azure Repos repository to customize your pipeline.

In the pipeline, you define the steps to create the environment. In this pipeline, you define the steps to create the environment as a job, which is a series of steps that run sequentially as a unit. 

To customize the pipeline you:
- Specify the Service Connection to use, and The pipeline uses the Azure CLI to create the environment.
- Use an Inline script to run an Azure CLI command that creates the environment. 

The Azure CLI is a command-line tool that provides a set of commands for working with Azure resources. To discover more Azure CLI commands, see [az devcenter](/cli/azure/devcenter?view=azure-cli-latest&preserve-view=true).

1. In your Azure DevOps project, select **Repos** > **Files**.
1. In the **Files** pane, from the `.ado` folder, select `azure-pipelines.yml` file.
1. In the `azure-pipelines.yml` file, edit the existing content with the following code:
   - Replace `<AzureServiceConnectionName>` with the name of the service connection you created earlier.
   - In the `Inline script`, replace each of the following placeholders with values appropriate to your Azure environment:
   
      | Placeholder                     | Value |
      | ------------------------------- | ----- |
      | `<dev-center-name>`             | The name of your dev center. |
      | `<project-name>`                | The name of your project. |
      | `<catalog-name>`                | The name of your catalog. |
      | `<environment-definition-name>` | Do not change. Defines the environment definition that is used. |
      | `<environment-type>`            | The environment type. |
      | `<environment-name>`            | Specify a name for your new environment. |
      | `<parameters>`                  | Do not change. References the json file that defines parameters for the environment. |

1. Select **Commit** to save your changes.
1. In the **Commit changes** pane, enter a commit message, and then select **Commit**.


## Create an environment using a pipeline

Next, you run the pipeline to create the ADE environment. 

1. In your Azure DevOps project, select **Pipelines**.
1. Select the pipeline you created earlier, and then select **Run pipeline**.
1. You can check on the progress of the pipeline run by selecting the pipeline name, and then selecting **Runs**. Select the run to see the details of the pipeline run.
1. You can also check the progress of the environment creation in the Azure portal by selecting your dev center, selecting your project, and then selecting **Environments**.


You can insert this job anywhere in a Continuous Integration (CI) and/or a Continuous Delivery (CD) pipeline. Get started with the [Azure Pipelines documentation](/azure/devops/pipelines/?view=azure-devops&preserve-view=true) to learn more about creating and managing pipelines.

## Clean up resources

When you're done with the resources you created in this tutorial, you can delete them to avoid incurring charges.

Use the following command to delete the environment you created in this tutorial:

```azurecli
az devcenter dev environment delete --dev-center <DevCenterName> --project-name <DevCenterProjectName> --name <DeploymentEnvironmentInstanceToCreateName> --yes
```

## Related content

- [Install the devcenter Azure CLI extension](how-to-install-devcenter-cli-extension.md)
- [Create and access an environment by using the Azure CLI](how-to-create-access-environments.md)
- [Microsoft Dev Box and Azure Deployment Environments Azure CLI documentation](https://aka.ms/CLI-reference)
