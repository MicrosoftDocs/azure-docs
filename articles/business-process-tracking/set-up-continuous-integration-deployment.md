---
title: Set Up CI and CD for Business Processes
description: Learn how to set up continuous integration and continuous deployment for business processes in different environments without rebuilding or remapping.
ms.service: azure-business-process-tracking
ms.topic: how-to
ms.reviewer: estfan, kewear, azla
ms.date: 06/09/2025
# Customer intent: As an integration developer, I want to set up continuous integration and continuous delivery for business processes without having to rebuild and map business stages to workflows across different environments, such as development, test, and production.
---

# Set up continuous integration and delivery for business processes in different environments

To deploy a business process across various environments, such as development, test, and production, without having to remap business stages to workflow operations and rebuild logic app projects, you can set up continuous integration (CI) and continuous deployment (CD) for your business processes and Standard logic app workflows.

This guide shows how to set up infrastructure, CI, and CD pipelines by using the Azure Logic Apps Standard Tasks for Azure DevOps and run those pipelines.

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Visual Studio Code installed with the Azure Logic Apps (Standard) extension and the required prerequisites.

  For more information, see [Create Standard logic app workflows with Visual Studio Code](/azure/logic-apps/create-standard-workflows-visual-studio-code.md#prerequisites).

- A Visual Studio Code workspace with an undeployed Standard logic app project.

- An Azure DevOps Services Git repository where you store your source code and artifacts.

  To create and run pipelines in Azure DevOps, you need the capability to run pipelines on Microsoft-hosted agents. To use Microsoft-hosted agents, your Azure DevOps organization must have access to Microsoft-hosted parallel jobs.

  If you don't have a repository, follow the steps in [Create a new Git repo in your project](/azure/devops/repos/git/create-new-repo). To create repository, you need a GitHub account or Microsoft account, an Azure DevOps organization, and an Azure DevOps project where you're an administrator.

  After you create the repository, clone the repository to your computer and initialize the repository, so that you can push local changes to Azure DevOps:

  1. Follow the steps in [Clone the repo to your computer](/azure/devops/repos/git/create-new-repo#clone-the-repo-to-your-computer), for example:

     :::image type="content" source="media/set-up-continuous-integration-deployment/clone-repo.png" alt-text="Screenshot shows Azure DevOps, Files page, and selected Clone button." lightbox="media/set-up-continuous-integration-deployment/clone-repo.png":::

  1. After you get the clone URL, go to Visual Studio Code, and open your Standard logic app project.

  1. From the **Terminal** menu, select **New Terminal**.

  1. From the command prompt, go to the folder that has your project's workspace file.

     A workspace is a text file that has the **.code-workspace** extension. To find the folder with this file, in the project root folder, open the folder named **.vscode**.

  1. At the command prompt, run the following Git commands:

     `git init`<br>
     `git add -A`<br>
     `git commit -m "<your-commit-comment>"`<br>
     `git remote add origin <clone-URL>`<br>
     `git push --set-upstream origin main`<br>

  1. At the prompt, provide your Git credentials to the Git Credential Manager.

- The latest **Azure Logic Apps Standard Tasks** extension for Azure Pipelines.

  This extension provides automated, build, connections deployment, and release tasks for Azure Logic Apps (Standard). For more information, see [**Azure Logic Apps Standard Tasks**](https://marketplace.visualstudio.com/items?itemName=ms-logicapps-ado.azure-logic-apps-devops-tasks).

- The appropriate user role permissions to create, view, use, or manage a service connection between the pipelines that you create later in this article.

  For more information, see [Set service connection security in Azure Pipelines](/azure/devops/pipelines/policies/permissions#set-service-connection-security-in-azure-pipelines).

## Generate deployment scripts

Now, generate deployment scripts for your logic app project. This approach lets you create the required infrastructure with the CI and CD scripts that help you deploy your logic app to Azure. For more information, see [Automate build and deployment for Standard logic app workflows with Azure DevOps](/azure/logic-apps/automate-build-deployment-standard).

1. If your logic app project isn't currently visible, in Visual Studio Code, on the Activity Bar, select **Explorer**.

1. In the **Explorer** window, open the shortcut menu for the project folder, and select **Generate deployment scripts**.

1. Follow the prompts to provide the following deployment information as required for your logic app:

   | Parameter | Description |
   |-----------|-------------|
   | **Resource group** | Select or create a new Azure resource group. |
   | **Logic app name** | Provide a unique name for your logic app resource. |
   | **Storage account name** | The name for the Azure storage account to use with your logic app. |
   | **App Service plan name** | The name to assign to the App Service plan. |
   | **Subscription** | The Azure subscription. |
   | **Location** | The Azure region. |

   The deployment script generation process creates a **deployment** folder that contains files for your infrastructure (CI) and application (CD) pipelines along with parameters files, for example:

   :::image type="content" source="media/set-up-continuous-integration-deployment/deployment-scripts.png" alt-text="Screenshot shows Visual Studio code and generated deployment script files." lightbox="media/set-up-continuous-integration-deployment/deployment-scripts.png":::

1. Commit these updates Azure DevOps by running the following Git commands from the command prompt:

   `git add -A`<br>
   `git commit -m "<your-commit-comment>"`<br>
   `git push`

## Create an infrastructure pipeline

Now, create a pipeline in your repository for your logic app infrastructure. For the general steps, see [Create your first pipeline](/azure/devops/pipelines/create-first-pipeline), but use the following custom steps:

1. In your Azure DevOps project, go to **Pipelines**. Select **Create pipeline**, or **New pipeline** if pipelines exist, for example:

   :::image type="content" source="media/set-up-continuous-integration-deployment/pipelines.png" alt-text="Screenshot shows Visual Studio code and generated deployment script files." lightbox="media/set-up-continuous-integration-deployment/pipelines.png":::

1. On the **Select** tab, select the repo type and the repo to use.

   This example selects **Azure DevOps**.

1. On the **Inventory** tab, select **Non-production** > **Configure pipeline**.

1. On the **Configure** tab, select **Existing Azure Pipeline YAML file**.

1. For **Branch**, select the appropriate branch.

   This example selects the **main** branch.

   Earlier, you pushed changes with generated deployment script files to Azure DevOps. Now, you can select the infrastructure pipeline file that you created in Visual Studio Code.

1. For **Path**, browse to and select the **infrastucture-pipeline.yaml** file at the following location:

   **/pipelines/infrastructure-pipeline.yaml**

1. Select **Continue** > **Review**. Provide the name for the pipeline, but the pipeline folder is optional.

1. To complete this task, select **Save**.

## Create a continuous integration (CI) pipeline

Create a pipeline in your repo for continuous integration.

1. Follow the steps from the previous section until you specify the path for the CI pipeline.

1. For **Path**, browse to and select the **CI-pipeline.yaml** file at the following location:

   **/pipelines/CI-pipeline.yaml**

1. Select **Continue** > **Review**. Provide the name for the pipeline, but the pipeline folder is optional.

1. To complete this task, select **Save**.

## Create a continuous deployment (CD) pipeline

Create a pipeline in your repo for continuous deployment.

1. Follow the steps from the previous section until you specify the path for the CD pipeline.

1. For **Path**, browse to and select the **CD-pipeline.yaml** file at the following location:

   **/pipelines/CD-pipeline.yaml**

1. Select **Continue** > **Review**. Provide the name for the pipeline, but the pipeline folder is optional.

1. To complete this task, select **Save**.

## Create a service connection

A service connection is an authenticated connection between your pipelines and external or remote services that you use to complete tasks. In this scenario, the service connection lets your CI/CD pipelines create and manage resources in Azure. These steps create a Microsoft Entra ID app registration that you use as an authentication credential. For more information, see [Create Azure Resource Manager service connection that uses workload identity federation](/azure/devops/pipelines/library/connect-to-azure#create-an-azure-resource-manager-service-connection-that-uses-workload-identity-federation).

1. In your Azure DevOps project, go to **Project settings** > **Pipelines** > **Service connections**.

1. Select **Create service connection**. On the **New service connection** pane, select **Azure Resource Manager** as the service connection type, and then select **Next**.

1. On the **New Azure service connection** pane, provide the following information:

   | Parameter | Value or description |
   |-----------|----------------------|
   | **Identity type** | **App registration (automatic)** |
   | **Credential** | **Workload identity federation (Recommended)** |
   | **Scope level** | **Subscription** |
   | **Subscription** | Your Azure subscription. |
   | **Resource group** | The Azure resource group. |
   | **Service Connection Name** | The name for the service connection. |

1. When you're done, select **Save**.

1. Note the name for the created Microsoft Entra ID app registration.

## Find the Microsoft Entra ID application registration

Confirm that your Microsoft Entra ID application has the necessary role and permissions for your scenario and get the object ID for later use. For more information about app registrations, see [Register an application in Microsoft Entra ID](/entra/identity-platform/quickstart-register-app).

1. In the Azure portal search box, enter the name for the Microsoft Entra ID application.

1. Confirm that the Microsoft Entra ID application has **Contributor** access for the resource group. If not, assign that access.

## Update pipelines to use the service connection

Now, specify the service connection to use with your pipelines.

1. In each file listed, find the property named **`serviceConnectionName`**. Set the property value to the service connection name.

   - Infrastructure pipeline: Update the **infrastructure-pipeline-variables.yml** file.
   - CI pipeline: Update the **CI-pipeline-variables.yml** file.
   - CD pipeline: Update the **CD-pipeline-variables.yml** file.

1. In the **CI-pipeline-variables.yml** file, add a new property named **`subscriptionId`**. Set the property value to your Azure subscription ID, for example:

   `subscriptionId: '<Azure-subscription-ID>'`

1. Make sure to save all the updated .yml pipeline files.

1. In Visual Studio Code, run the following Git commands from the command prompt:

   `git add -A`<br>
   `git commit -m "<your-commit-comment>"`<br>
   `git push`

## Run infrastructure pipeline

To create your Standard logic app in Azure, follow these steps:

1. In Azure DevOps, select the appropriate branch, and then select **Run**.

1. If prompted, provide the permissions necessary to run the pipeline.

After the pipeline completes, you have an empty Standard logic app resource without any workflows in Azure.

## Run CI and CD pipelines

1. Before you run the CD pipeline, update this pipeline to include the source value, which is the name for your CI pipeline.

   You can directly commit to the branch, but then run **`git pull`** on your local source to locally synchronize this change.

1. In Azure DevOps, run the CI pipeline, then run the CD pipeline.

1. If prompted, provide the permissions necessary to run the pipelines.

After the CD pipeline completes, you have the content from your Standard logic app project deployed to the logic app resource previously created in Azure.

## Related content

- [Deploy a business process and tracking profile to Azure](deploy-business-process.md)
- [Manage business process](manage-business-process.md)
