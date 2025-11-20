---
title: 'Tutorial: Deploy Environments with Azure Pipelines'
description: Learn how to integrate Azure Deployment Environments into your Azure Pipelines CI/CD pipeline to streamline your software development process.
author: RoseHJM
ms.author: rosemalcolm
ms.service: azure-deployment-environments
ms.topic: tutorial
ms.date: 07/25/2025

# customer intent: As a developer, I want to use Azure Pipelines to deploy an Azure Deployment Environments deployment environment so that I can integrate it into a CI/CD development environment.
---

# Tutorial: Deploy environments in CI/CD by using Azure Pipelines

In this tutorial, you learn how to integrate Azure Deployment Environments into your Azure Pipelines CI/CD pipeline.

Continuous integration and continuous delivery (CI/CD) is a software development approach that helps teams automate the process of building, testing, and deploying software changes. CI/CD enables you to release software changes more frequently and with greater confidence. 

Before starting this tutorial, familiarize yourself with Deployment Environments resources and concepts by reviewing [Key concepts for Azure Deployment Environments](concept-environments-key-concepts.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create and configure an Azure Repos repository
> * Configure environment types
> * Configure a service connection
> * Create a pipeline
> * Create an environment

## Prerequisites

- An Azure account with an active subscription.
  - [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Owner permissions on the Azure subscription.
- An Azure DevOps subscription.
  - [Create an account for free](https://azure.microsoft.com/services/devops/?WT.mc_id=A261C142F).
  - An Azure DevOps organization and project.
- In Azure Deployment Environments:
    - [A dev center and a project](./quickstart-create-and-configure-devcenter.md).
    - [Sample catalog](https://github.com/Azure/deployment-environments) attached to the dev center.

## Create and configure an Azure Repos repository

1. Sign in to your Azure DevOps organization (`https://dev.azure.com/<your-organization>`). Replace `<your-organization>` with your project identifier. 
1. Select your project.
1. Select **Repos** > **Files**.
1. In **Import a repository**, select **Import**. 
1. In **Import a Git repository**, select or enter the following:
    - **Repository type**: Git
    - **Clone URL**: https://github.com/Azure/deployment-environments

## Configure environment types

Environment types define the types of environments that your development teams can deploy. You can apply different settings for each environment type. You can create environment types at the dev center level and at the project level.

To create dev center environment types:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In **Dev centers**, select your dev center.
1. In the left menu, under **Environment configuration**, select **Environment types**, and then select **Create**.
1. Use the following steps to create three environment types: Sandbox, FunctionApp, and WebApp.
   
   1. In **Create environment type**, enter the following information, and then select **Add**.

       |Name     |Value     |
       |---------|----------|
       |**Name**|Enter a name for the environment type.|
       |**Tags**|Enter a tag name and a tag value.|

   1. Confirm that the environment type appears in the list.
 
To create project environment types:

1. In the left menu, under **Manage**, select **Projects**, and then select the project that you want to use.
1. In the left menu, under **Environment configuration**, select **Environment types**, and then select **Add**.
1. Use the following steps to add the three environment types: Sandbox, FunctionApp, and WebApp.
   1. In **Add environment type to \<project-name\>**, enter or select the following information:

       |Name     |Value     |
       |---------|----------|
       |**Type**| Select a dev center-level environment type to enable for the specific project.|
       |**Deployment subscription**| Select the subscription in which the environment is created.|
       |**Deployment identity** | Select either a system-assigned or a user-assigned managed identity to perform deployments on behalf of the user.|
       |**Permissions on environment resources** > **Environment creator role(s)**|  Select the roles to give access to the environment resources.|
       |**Permissions on environment resources** > **Additional access** | Select the users or Microsoft Entra groups to assign to specific roles on the environment resources.|
       |**Tags** | Enter a tag name and a tag value. These tags are applied on all resources that are created as part of the environment.|

   1. Confirm that the environment type appears in the list.

## Configure a service connection

In Azure Pipelines, you create a *service connection* in your Azure DevOps project to access resources in your Azure subscription.  

1. If you don't have a user-assigned managed identity for the project, [add one](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity).
   > [!NOTE] 
   > You can use one of three options for identity: app registration, user-assigned managed identity, and system-assigned managed identity. App registration is the most secure option. To use app registration, you need to have appropriate permissions. For more information see [Azure Resource Manager service connection special cases](/azure/devops/pipelines/library/azure-resource-manager-alternate-approaches).
1. Sign in to your Azure DevOps organization (`https://dev.azure.com/<your-organization>`). Replace `<your-organization>` with your project identifier.
1. Select your project. 
1. Select **Project settings** > **Service connections** > **Create service connection**.
1. In the **New service connection** pane, select **Azure Resource Manager**, and then select **Next**.
1. Enter the following service connection details, and then select **Save** to create the service connection.

    | Field | Value |
    | ----- | ----- |
    |**Identity type**|**Managed identity**|
    |**Subscription for managed identity**|Enter the Azure subscription that contains the managed identity. |
    |**Resource group for managed identity** |Enter the resource group that contains the managed identity.|
    |**Managed identity** |Enter the name of the managed identity.|
    | **Scope level for service connection** | **Subscription** |
    | **Subscription for service connection** | Enter the ID of the Azure subscription that hosts your dev center resource. |
    | **Service Connection Name** | Enter a unique name for the service connection. |
    | **Grant access permission to all pipelines** | Select this checkbox. |

1. Select **Save**.

### Grant the service connection access to the Deployment Environments project

Deployment Environments uses role-based access control to grant permissions for performing specific activities on your Deployment Environments resource. To make changes from a CI/CD pipeline, you grant the Deployment Environments User role to the managed identity.

 

1. In the [Azure portal](https://portal.azure.com/), go to your Deployment Environments project.
1. Select **Access control (IAM)** > **Add** > **Add role assignment**.
1. On the **Role** tab, select **Deployment Environments User** in the list of job function roles.
1. On the **Members** tab, select **Managed identity** and **Select members**.
1. In the **Select managed identities** tab, under **Managed identity**, select the **Project** identity, select the project name, and then select **Select**.
1. On the **Review + assign** tab, select **Review + assign** to add the role assignment.

You can now use the service connection in your Azure Pipelines workflow definition to access your Deployment Environments environments.

### Grant your account access to the Deployment Environments project

To view environments created by other users, including the service connection, you need to grant your account read access to the Deployment Environments project.

1. In the [Azure portal](https://portal.azure.com/), go to your Deployment Environments project. 
1. Select **Access control (IAM)** > **Add** > **Add role assignment**.
1. On the **Role** tab, select **Deployment Environments Reader** in the list of job function roles.
1. On the **Members** tab, select **Select members**, and then search for your own account.
1. Select your account from the list, and then select **Select**.
1. On the **Review + assign** tab, select **Review + assign** to add the role assignment.

You can now view the environments created by your Azure Pipelines workflow.

## Configure a pipeline

Edit the *azure-pipelines.yml* file in your Azure Repos repository to customize your pipeline.

In the pipeline, you define the steps to create the environment. In this pipeline, you define the steps to create the environment as a job, which is a series of steps that run sequentially as a unit. 

To customize the pipeline, you:
- Specify the service connection to use.
- Use an inline script to run an Azure CLI command that creates the environment. 

Azure CLI is a command-line tool that provides a set of commands for working with Azure resources. To learn about more Azure CLI commands, see [az devcenter](/cli/azure/devcenter?view=azure-cli-latest&preserve-view=true).

1. In your Azure DevOps project, select **Repos** > **Files**.
1. In the **Files** pane, in the **.ado** folder, select the **azure-pipelines.yml** file.
1. In the azure-pipelines.yml file, edit the existing content:
   - Replace `<AzureServiceConnectionName>` with the name of the service connection you created earlier.
   - In the `Inline script` input, replace each of the following placeholders with values that are appropriate to your Azure environment:
   
      | Placeholder                     | Value |
      | ------------------------------- | ----- |
      | `<DevCenterName>`             | The name of your dev center. |
      | `<project-name>`                | The name of your project. |
      | `<catalog-name>`                | The name of your catalog. |
      | `<environment-definition-name>` | Do not change. Defines the environment definition that's used. |
      | `<environment-type>`            | The environment type. |
      | `<environment-name>`            | Specify a name for your new environment. |
      | `<parameters>`                  | Do not change. References the JSON file that defines parameters for the environment. |

1. Select **Commit** to save your changes.
1. In the **Commit changes** pane, enter a commit message, and then select **Commit**.

## Create an environment by using a pipeline

Next, you run the pipeline to create the Deployment Environments environment. 

1. In your Azure DevOps project, select **Pipelines**.
1. Select the pipeline you created earlier, and then select **Run pipeline**.
1. You can check on the progress of the pipeline run by selecting the pipeline name and then selecting **Runs**. Select the run to see the details of the pipeline run.
1. You can also check the progress of the creation of the environment in the Azure portal by selecting your dev center, selecting your project, and then selecting **Environments**.

You can insert this job anywhere in a CI and/or CD pipeline. See the [Azure Pipelines documentation](/azure/devops/pipelines/?view=azure-devops&preserve-view=true) to learn more about creating and managing pipelines.

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
