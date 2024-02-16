---
title: Automate build and deployment for Standard workflows
description: Automate build and deployment for Standard logic app workflows across different environments and platforms using Azure DevOps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 02/29/2024
## Customer intent: 
---

# Automate build and deployment for Standard logic app workflows with Azure DevOps (preview)

> [!NOTE]
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

For Standard workflows that run in single-tenant Azure Logic Apps, you can use Visual Studio Code for local development and testing and then store your logic app project code using any source control system. However, to get the full benefits of easily and consistently deploying your workflows across different environments and platforms, you must also automate your build and deployment process.

In Visual Studio Code, the Azure Logic Apps extension provides the tools for you to set up and maintain your automated build and deployment process using Azure DevOps. However, before you start, consider the following elements:

- The Azure logic app resource where you create your workflows

- The Azure-hosted connections that workflows use and are created from Microsoft-managed connectors.

  These connections differ from the connections that directly and natively run with the Azure Logic Apps runtime.

- The specific settings and parameters for the different environments where you want to deploy

The extension helps you complete the following required tasks to set up automation:

- Parameterize connection references at design time. This task simplifies the process of updating references in different environments without breaking local development functionality.

- Generate scripts that automate deployment for your Standard logic app resource, including all dependent resources.

- Generate scripts that automate deployment for Azure-hosted connections.

- Prepare environment-specific parameters that you can inject into the Azure Logic Apps package during the build process without breaking local development functionality. 

- Generate Azure DevOps pipelines on demand to support infrastructure deployment along with the build and release processes.

## Known issues and limitations

- The extension supports only Standard logic app projects. Workspaces that contain Standard and custom code projects have deployment scripts generated, but custom code projects are currently ignored. The capability to create build pipelines for custom code are on the roadmap.

- The extension creates pipelines for infrastructure deployment, continuous integration (CI), and continuous deployment (CD). However, you're responsible for connecting the pipelines to Azure DevOps and create the relevant triggers.

- Currently, the extension supports only Azure Resource Management templates (ARM templates) for infrastructure deployment scripts. Other templates are in planning.

## Prerequisites

### For your logic app workspace and project

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Visual Studio Code with the Azure Logic Apps (Standard) extension. To meet these requirements, see the prerequisites for [Create Standard workflows with Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md#prerequisites).

- Azure Logic Apps (Standard) Build and Release tasks for Azure DevOps Tasks. You can find those task in the Azure DevOps Marketplace (link).

- An existing resource group in Azure where you want to deploy your logic app project.

### For the connection between your workspace and your repository

- An existing [Azure DevOps repository](/azure/devops/repos/git/create-new-repo#create-a-repo-using-the-web-portal)

- An [Azure Resource Manager service connection with an existing service principal](/azure/devops/pipelines/library/connect-to-azure)

## Create a logic app workspace, project, and workflow

1. In Visual Studio Code, on the Activity bar, select the Azure icon.

1. In the **Azure** window, on the **Workspace** toolbar, open the **Azure Logic Apps** menu, and select **Create new logic app workspace**.

1. Follow the prompts to complete the following tasks:

   1. Find and select the folder where you want to create your workspace.

   1. Provide a name for your workspace.

   1. Select the project type: **Logic app**

   1. Create a folder for your logic app project.

   1. Select the workflow template and provide the workflow name.

   1. Open the workflow designer, either in the current Visual Studio Code window or a new window.

You can now add operations to your workflow and test your workflow along the way. To create a sample workflow, see [Create Standard workflows with Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md).

## Generate deployment scripts

After you create and locally test your workflow, create your deployment scripts.

1. From your project's shortcut menu, select **Generate deployment scripts**.

1. Follow the prompts to complete the following tasks:

   1. Select the Azure subscription that you want to use.

   1. Select an existing resource group destination for your logic app.

   1. Provide a unique name to use for the logic app resource.

   1. Provide a unique name to use for the storage account resource.

   1. Provide a unique name to use for the App Service Plan.

   1. Select the location where you want to generate the files.

      | Deployment folder location | Description |
      |----------------------------|-------------|
      | **New deployment folder** (Default) | Create a new folder in the current workspace. |
      | **Choose a different folder** | Select a different folder in the current workspace. |

   When you're done, Visual Studio Code creates a folder named **Deployment/{logic-app-name}** in your logic app project. This folder uses the same logic app name that you provided in these steps.

   > [!NOTE]
   >
   > The values of variables, app settings, and parameters are prepopulated in the following files 
   > based on the input that you provided in these steps. When targeting a different environment, you will need to update the parameters and variable files created. 

   Under this folder, the following structure appears:


Folder 

File 

Description 

ADOPipelineScripts 

CD-Pipeline-variables.yml 

An yaml file containing the variables that are used by the CD-pipeline file. 

CD-pipeline.yml 

The continuous delivery pipeline, containing instructions to deploy the logic app code to the logic app resource.  

CI-pipeline-variables.yml 

An yaml file containing the variables that are used by the CI-pipeline file. 

Ci-pipeline.yml 

The continuous integration pipeline, containing instructions to build and generate the artefacts required to deploy the logic app to Azure. 

Infrastructure-pipeline-template.yml 

An yaml pipeline containing steps to deploy a logic app resource with all required dependencies, as well as deploying each managed connection required by the source code. 

Infrastructure-pipeline-variables.yml 

An yaml pipeline containing all variables required to execute the infrastructure-pipeline-template.yml 

Infrastructure-pipeline.yml 

An yaml pipeline containing the instructions to load all the ARM template to azure and execute the infrastructure-pipeline-template.yml 

ArmTemplates 

<connectionreference>. 
parameters.json 

An ARM parameters file with the parameters required to deploy the Azure Managed Connection <connectionreference> to Azure. 

You will find one of those files for each Azure Managed connection. 

<connectionreference>. 
template.json 

An ARM template file representing the Azure Managed Connection <connectionreference>,  use to deploy the connection resource to Azure. 

You will find one of those files for each Azure Managed connection. 

<logicappname>. 
parameters.json 

An ARM parameters file with the parameters required to deploy the Logic App resource <logicappname> to Azure, including all the dependencies. 

<logicappname>. 
template.json 

An ARM template file representing the Logic Apps Standard application <logicappname>, used to deploy the resource to Azure. 

WorkflowParameters 

parameters.json 

This is a copy of the local parameters file, containing a copy of all the user defined parameters, plus the cloud version of any parameters created by the tool to parameterize Azure Managed Connections. 

This file is used to build the package being deployed to Azure. 

 


## Connect your workspace to your repository

## Create pipelines in Azure DevOps