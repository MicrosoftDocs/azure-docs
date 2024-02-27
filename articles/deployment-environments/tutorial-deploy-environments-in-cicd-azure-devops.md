---
title: 'Tutorial: Deploy environments in CI/CD by using Azure DevOps Pipelines'
description: Learn how to integrate Azure Deployment Environments into your CI/CD pipeline by using Azure DevOps.
author: RoseHJM
ms.author: rosemalcolm
ms.service: deployment-environments
ms.topic: tutorial
ms.date: 02/26/2024

# customer intent: As a developer, I want to use an Azure Pipeline to deploy an ADE deployment environment so that I can integrate it into a CI/CD development environment.
---

# Tutorial: Deploy environments in CI/CD by using Azure DevOps Pipelines

In this tutorial, you'll learn how to integrate Azure Deployment Environments into your Azure DevOps CI/CD pipeline. You can use any GitOps provider that supports CI/CD, like GitHub Actions, Azure Arc, GitLab, or Jenkins.

Continuous integration and continuous delivery (CI/CD) is a software development approach that helps teams to automate the process of building, testing, and deploying software changes. CI/CD enables you to release software changes more frequently and with greater confidence. 

<!-- You use a workflow that features three branches: main, dev, and test.

- The *main* branch is always considered production.
- You create feature branches from the *main* branch.
- You create pull requests to merge feature branches into *main*.

This workflow is a small example for the purposes of this tutorial. Real-world workflows might be more complex. -->

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
- Azure Deployment Environments
    - dev center, project, and environment types. 


## Create and configure an Azure Repos repository

1. Sign in to your Azure DevOps organization (`https://dev.azure.com/<your-organization>`), and select your project.
    
    Replace the `<your-organization>` text placeholder with your project identifier.

1. Select **Repos** > **Files**.
1. 
1. Import 
1. 
1. 


## Connect the catalog to your dev center

In Azure Deployment Environments, a catalog is a repository that contains a set of environment definitions. Catalog items consist of an infrastructure as code (IaC) template and an environment file that acts as a manifest. The template defines the environment, and the environment file provides metadata about the template. Development teams use environment definitions from the catalog to create environments.

## Configure service connection

In Azure Pipelines, you create a *service connection* in your Azure DevOps project to access resources in your Azure subscription. When you create the service connection, Azure DevOps creates a Microsoft Entra service principal object.

1. Sign in to your Azure DevOps organization (`https://dev.azure.com/<your-organization>`), and select your project.
    
    Replace the `<your-organization>` text placeholder with your project identifier.

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

### Grant access to ADE project

Azure Deployment Environments uses Azure RBAC to grant permissions for performing specific activities on your ADE resource. To make changes from a CI/CD pipeline, you grant the Deployment Environments User role to the service principal.

1. In the [Azure portal](https://portal.azure.com/), go to your ADE project.

1. Select **Access control (IAM)** > **Add** > **Add role assignment**.

1. In the **Role** tab, select **Deployment Environments User** in the list of job function roles.

1. In the **Members** tab, select **Select members**, and then use the display name you copied previously to search the service principal.

1. Select the service principal, and then select **Select**.

1. In the **Review + assign tab**, select **Review + assign** to add the role assignment.

You can now use the service connection in your Azure Pipelines workflow definition to access your ADE environments.


## Create and configure a pipeline

## Create an environment using a pipeline

## Clean up resources

[!INCLUDE [alt-delete-resource-group](includes/alt-delete-resource-group.md)]

## Related content

- [Create and access an environment by using the Azure CLI](how-to-create-access-environments.md)
- For complete command listings, see the [Microsoft Dev Box and Azure Deployment Environments Azure CLI documentation](https://aka.ms/CLI-reference)
