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

To deploy a business process across various environments, such as development, test, and production, without having to remap business stages to workflow operations and rebuild logic app projects, you can set up continuous integration (CI) and continuous deployment (CD)

This guide shows how to set up a CI/CD pipeline by using the Azure Logic Apps Standard Tasks for Azure DevOps.

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Visual Studio Code and the required prerequisites.

  For more information, see [Create Standard logic app workflows with Visual Studio Code](create-standard-workflows-visual-studio-code.md#prerequisites).

- A Visual Studio Code workspace with an undeployed Standard logic app project.

- An Azure DevOps Services Git repository where you store your source code and artifacts.

  If you don't have a repository, follow the steps in [Set up a Git repository](/devops/develop/git/set-up-a-git-repository).

  After you create your repository, follow these steps to initialize your repository, so you can push your local changes to Azure DevOps:

  1. Clone your repository. Find and save the clone URL. 

     For more information, see [Clone an existing Git repo](/azure/devops/repos/git/clone).

  1. In Visual Studio Code, open your Standard logic app project.

  1. From the **Terminal** menu, select **New Terminal**.

  1. From the command prompt, go to the folder that has your project's workspace file. 

     A workspace is a text file with the **.code-workspace** extension. To find the folder with this file, open the **.vscode** folder in your root folder. 

  1. At the command prompt, run the following Git commands:

     `git init`<br>
     `git add -A`<br>
     `git commit -m "<your-commit-comment>"`<br>
     `git remote add origin <clone-URL>`<br>
     `git push --set-upstream origin main`<br>  

  1. At the prompt, provide your Git credentials to the Git Credential Manager.

- The latest **Azure Logic Apps Standard Tasks** extension for Azure Pipelines

  This extension provides automated, build, connections deployment, and release tasks for Azure Logic Apps (Standard). For more information, see [**Azure Logic Apps Standard Tasks**](https://marketplace.visualstudio.com/items?itemName=ms-logicapps-ado.azure-logic-apps-devops-tasks).

## Generate deployment scripts

Now, generate deployment scripts for your logic app project. This approach lets you create the required infrastructure with the CI and CD scripts that help you deploy your logic app to Azure. For more information, see [Automate build and deployment for Standard logic app workflows with Azure DevOps](automate-build-deployment-standard.md). 

1. If your logic app project isn't currently visible, in Visual Studio Code, on the Activity Bar, select **Explorer**.

1. In the **Explorer** window, open the shortcut menu for the project folder, and select **Generate Deployment Scripts**.

1. Follow the prompts to provide the following deployment information for your logic app:

   | Parameter | Description |
   |-----------|-------------|
   | **Subscription** | The Azure subscription. |
   | **Resource Group** | The Azure resource group. |
   | **Location** | The Azure region. |
   | **Logic App Name** | The name for your logic app resource. |
   | **Storage Account Name** | The name for the Azure storage account to use with your logic app. |

   The deployment process creates the infrastructure (CI) and application (CD) pipelines and parameters files in a deployment folder, for example:

   <**SCREENSHOT**>

1. After the generated deployment scripts appear in your project, synchronize these updates to Azure DevOps by running the following Git commands from the command prompt:

   `git add -A`<br>
   `git commit -m "<your-commit-comment>"`<br>
   `git push`

## Create the infrastructure pipeline

Now, create a pipeline in your repository for your logic app infrastructure. For the general steps, see [Create your first pipeline](/azure/devops/pipelines/create-first-pipeline?view=azure-devops&tabs=java%2Cbrowser), but use the following custom steps:

1. Select **Existing Azure Pipeline YAML File**.

1. Select the appropriate branch.

   Earlier, you pushed local changes to Azure DevOps. Now, you can select the infrastructure pipeline that is created in Visual Studio Code.

1. To find the pipeline, go to the following location:

   **/pipelines/infrastructure-pipeline.yaml**

1. Select **Continue** > **Review**. Provide the name for the pipeline, but the pipeline folder is optional. 

1. To complete this task, select **Save**.

## Related content

