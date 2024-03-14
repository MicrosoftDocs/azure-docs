---
title: Automate build and deployment for Standard workflows
description: Automate build and deployment for Standard logic apps with Azure DevOps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 03/29/2024
## Customer intent: As a developer, I want to automate builds and deployments for my Standard logic app workflows.
---

# Automate build and deployment for Standard logic app workflows with Azure DevOps (preview)

> [!NOTE]
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

For Standard logic app workflows that run in single-tenant Azure Logic Apps, you can use Visual Studio Code with the Azure Logic Apps (Standard) extension to locally develop, test, and store your logic app project using any source control system. However, to get the full benefits of easily and consistently deploying your workflows across different environments and platforms, you must also automate your build and deployment process.

The Azure Logic Apps (Standard) extension provides tools for you to create and maintain automated build and deployment processes using Azure DevOps. However, before you start this automation, consider the following elements:

- The Azure logic app resource where you create your workflows

- The Azure-hosted connections that workflows use and are created from Microsoft-managed connectors.

  These connections differ from the connections that directly and natively run with the Azure Logic Apps runtime.

- The specific settings and parameters for the different environments where you want to deploy

The extension helps you complete the following required tasks to automate build and deployment:

- Parameterize connection references at design time. This task simplifies the process of updating references in different environments without breaking local development functionality.

- Generate scripts that automate deployment for your Standard logic app resource, including all dependent resources.

- Generate scripts that automate deployment for Azure-hosted connections.

- Prepare environment-specific parameters that you can inject into the Azure Logic Apps package during the build process without breaking local development functionality. 

- Generate pipelines on demand using Azure DevOps to support infrastructure deployment along with the build and release processes.

This guide shows how to complete the following tasks:

1. Create a logic app workspace and project in Visual Studio Code that includes the files that create pipelines for infrastructure deployment, continuous integration (CI), and continuous deployment (CD).

1. Create a connection between your workspace and Git repository in Azure DevOps.

1. Create pipelines in Azure DevOps.

For more information, see the following documentation:

- [What is Azure DevOps?](/azure/devops/user-guide/what-is-azure-devops)
- [What is Azure Pipelines?](/azure/devops/pipelines/get-started/what-is-azure-pipelines)

## Known issues and limitations

- This capability supports only Standard logic app projects. If your Visual Studio Code workspace contains both a Standard logic app project and a Functions custom code project, both have deployment scripts generated, but custom code projects are currently ignored. The capability to create build pipelines for custom code are on the roadmap.

- The extension creates pipelines for infrastructure deployment, continuous integration (CI), and continuous deployment (CD). However, you're responsible for connecting the pipelines to Azure DevOps and create the relevant triggers.

- Currently, the extension supports only Azure Resource Management templates (ARM templates) for infrastructure deployment scripts. Other templates are in planning.

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Visual Studio Code with the Azure Logic Apps (Standard) extension. To meet these requirements, see the prerequisites for [Create Standard workflows with Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md#prerequisites).

- Azure Logic Apps (Standard) Build and Release tasks for Azure DevOps Tasks. You can find these tasks in the [Azure DevOps Marketplace](https://marketplace.visualstudio.com/search?term=azure%20logic%20apps&target=AzureDevOps&category=Azure%20Pipelines&visibilityQuery=all&sortBy=Relevance).

- An existing [Git repository in Azure DevOps](/azure/devops/repos/git/create-new-repo#create-a-repo-using-the-web-portal) where you can store your logic app project.

- An [Azure Resource Manager service connection with an existing service principal](/azure/devops/pipelines/library/connect-to-azure#create-an-azure-resource-manager-service-connection-with-an-existing-service-principal).

- An existing [Azure resource group](../azure-resource-manager/management/manage-resource-groups-portal.md) where you want to deploy your logic app.

## Create a logic app workspace, project, and workflow

1. In Visual Studio Code, on the Activity bar, select the Azure icon.

1. In the **Azure** window, on the **Workspace** toolbar, open the **Azure Logic Apps** menu, and select **Create new logic app workspace**.

   :::image type="content" source="media/automate-build-deployment-standard/create-workspace.png" alt-text="Screenshot shows Visual Studio Code, Azure icon selected on left menu, Workspace section, and selected option for Create new logic app workspace." lightbox="media/automate-build-deployment-standard/create-workspace.png":::

1. Follow the prompts to complete the following tasks:

   1. Select the folder to create your workspace.

   1. Enter your workspace name.

   1. Select the project type: **Logic app**

   1. Enter your logic app project name.

   1. Select the workflow template. Enter your workflow name.

   1. Select whether to open your workspace in the current Visual Studio Code window or a new window. 

      Visual Studio Code shows your new workspace and logic app project.

1. Follow these steps to open the workflow designer:

   1. In your logic app project, expand the folder with your workflow name.

   1. If not already open, open the **workflow.json** file, open the file's shortcut men, and select **Open Designer**.

   1. When you're prompted to allow parameterizations for connections when your project loads, select **Yes**.

      This selection allows your project to use parameters in connection definitions so that you can automate build and deployment for different environments.

   1. Follow the prompts to select these items:

      - **Use connectors from Azure**

        > [!NOTE]
        >
        > If you skip this step, you can use only the [built-in connectors that are runtime-hosted](../connectors/built-in.md). 
        > To enable the Microsoft-managed, Azure-hosted connectors at a later time, follow these steps:
        >
        > 1. Open the shortcut menu for the **workflow.json** file, and select **Use Connectors from Azure**.
        >
        > 2. Select an existing Azure resource group that you want to use for your logic app.
        >
        > 3. Reload the workflow designer.

      - The existing Azure resource group that you want to use for your logic app

1. When you're done, reload the workflow designer. If prompted, sign in to Azure.

   :::image type="content" source="media/automate-build-deployment-standard/created-project.png" alt-text="Screenshot shows Visual Studio Code, Explorer icon selected on left menu, logic app project, and workflow designer." lightbox="media/automate-build-deployment-standard/created-project.png":::

You can now edit the workflow in any way that you want and locally test your workflow along the way. To create and test a sample workflow, see [Create Standard workflows with Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md).

## Generate deployment scripts

After you create and locally test your workflow, create your deployment scripts.

1. From the blank area under all your project files, open your project's shortcut menu, and select **Generate deployment scripts**.

   :::image type="content" source="media/automate-build-deployment-standard/generate-deployment-scripts.png" alt-text="Screenshot shows Visual Studio Code, Explorer icon selected on left menu, logic app project, opened project window shortcut menu, and selected option for Generate deployment scripts." lightbox="media/automate-build-deployment-standard/generate-deployment-scripts.png":::

1. Follow the prompts to complete these steps:

   1. Select the existing Azure resource group to use for your logic app.

   1. Enter a unique name for your logic app resource.

   1. Enter a unique name for your storage account resource.

   1. Enter a unique name to use for your App Service Plan.

   1. Select the workspace folder where you want to generate the files.

      | Deployment folder location | Description |
      |----------------------------|-------------|
      | **New deployment folder** (Default) | Create a new folder in the current workspace. |
      | **Choose a different folder** | Select a different folder in the current workspace. |

   When you're done, Visual Studio Code creates a folder named **deployment/{*logic-app-name*}** at your workspace's root. This folder uses the same logic app name that you provided in these steps.

   > [!NOTE]
   >
   > The values of variables, app settings, and parameters in the following files are prepopulated 
   > based on the input that you provided in these steps. When you target a different environment, 
   > make sure that you update the values for the created parameters and variable files.

   :::image type="content" source="media/automate-build-deployment-standard/deployment-folder.png" alt-text="Screenshot shows Visual Studio Code, Explorer icon selected on left menu, logic app project, and highlighted deployment scripts folder with contents." lightbox="media/automate-build-deployment-standard/deployment-folder.png":::

   Under the **{*logic-app-name*}** folder, you have the following structure:

   | Folder name | File name and description |
   |-------------|---------------------------|
   | **ADOPipelineScripts** | - **CD-pipeline.yml**: The continuous delivery pipeline that contains the instructions to deploy the logic app code to the logic app resource in Azure. <br><br>- **CD-pipeline-variables.yml**: A YAML file that contains the variables used by the **CD-pipeline.yml** file. <br><br>- **CI-pipeline.yml**: The continuous integration pipeline that contains the instructions to build and generate the artifacts required to deploy the logic app resource to Azure. <br><br>- **CI-pipeline-variables.yml**: A YAML file that contains the variables used by the **CI-pipeline.yml** file. <br><br>- **infrastructure-pipeline.yml**: A YAML "Infrastructure-as-Code" pipeline that contains the instructions to load all the ARM templates to Azure and to execute the steps in the **infrastructure-pipeline-template.yml** file. <br><br>- **infrastructure-pipeline-template.yml**: A YAML pipeline file that contains the steps to deploy a logic app resource with all required dependencies and to deploy each managed connection required by the source code. <br><br>- **infrastructure-pipeline-variables.yml**: A YAML pipeline that contains all the variables required to execute the steps in the **infrastructure-pipeline-template.yml** file. |
   | **ArmTemplates** | - **{*connection-type*}.parameters.json**: A Resource Manager parameters file that contains the parameters required to deploy an Azure-hosted connection named **{*connection-type*}** to Azure. This file exists for each Azure-hosted connection in your workflow. <br><br>- **{*connection-type*}.template.json**: A Resource Manager template file that represents an Azure-hosted connection named **{*connection-reference*}** and contains the information used to deploy the corresponding connection resource to Azure. This file exists for each Azure-hosted connection in your workflow. <br><br>- **{*logic-app-name*}.parameters.json**: A Resource Manager parameters file that contains the parameters required to deploy the Standard logic app resource named **{*logic-app-name*}** to Azure, including all the dependencies. <br><br>- **{*logic-app-name*}.template.json**: A Resource Manager template file that represents the Standard logic app resource named **{*logic-app-name*}** and contains the information used to deploy the logic app resource to Azure. |
   | **WorkflowParameters** | **parameters.json**: This JSON file is a copy of the local parameters file and contains a copy of all the user-defined parameters plus the cloud version of any parameters created by the extension to parameterize Azure-hosted connections. This file is used to build the package that deploys to Azure. |

## Connect your workspace to your Git repository

1. Follow these steps to initialize your repository:

   1. In Visual Studio Code, on the Activity bar, select the **Source Control** icon.

   1. In the **Source Control** window, select **Initialize Repository**.

   1. From the prompt menu, select **Choose Folder**. Select the workspace root folder, and then select **Initialize Repository**.

      :::image type="content" source="media/automate-build-deployment-standard/initialize-repo.png" alt-text="Screenshot shows Visual Studio Code, Source Control window, and selected option named Initialize Repository." lightbox="media/automate-build-deployment-standard/initialize-repo.png":::

   1. In the **Source Control** window, select **Open Repository**.

   1. From the prompt menu, select the repository that you just created.

   For more information, see [Visual Studio Code - Initialize a repository in a local folder](https://code.visualstudio.com/docs/sourcecontrol/intro-to-git#_initialize-a-repository-in-a-local-folder).

1. Follow these steps to get the URL for your Git repository so that you can add a remote:

   1. In Azure DevOps, open the team project for your Azure DevOps organization.

   1. On the left menu, expand **Repos**, and select **Files**.

   1. On the **Files** pane toolbar, select **Clone**.

      :::image type="content" source="media/automate-build-deployment-standard/clone-git-repository.png" alt-text="Screenshot shows Azure DevOps team project, Git repository, and selected option named Clone." lightbox="media/automate-build-deployment-standard/clone-git-repository.png":::

   1. In the **Clone Repository** window, copy the HTTPS version of the clone's URL.

      For more information, see [Get the clone URL for your Git repository in Azure Repos](/azure/devops/repos/git/clone#get-the-clone-url-of-an-azure-repos-git-repo).

1. Follow these steps to add a remote for your Git repository:

   1. Return to Visual Studio Code and to the **Source Control** window.

   1. Under **Source Control Repositories**, from your repository's toolbar, open the ellipses (**...**) menu, and select **Remote** > **Add remote**.

      :::image type="content" source="media/automate-build-deployment-standard/add-remote.png" alt-text="Screenshot shows Visual Studio Code, Source control window, and selected option named Add remote." lightbox="media/automate-build-deployment-standard/add-remote.png":::

1. At the prompt, paste your copied URL, and enter a name for the remote, which is usually **origin**.

   You've now created a connection between Visual Studio Code and your repository.

1. Before you set up your pipelines in the next section, open the **CD-pipeline.yml** file, and rename the **CI Pipeline** in the **`source`** attribute to match the CI pipeline name that you want to use.

   :::image type="content" source="media/automate-build-deployment-standard/rename-ci-pipeline.png" alt-text="Screenshot shows Visual Studio Code, Source control window, opened CD-pipeline.yml file, and highlighted source field for CI pipeline name." lightbox="media/automate-build-deployment-standard/rename-ci-pipeline.png":::

1. In the **Source Control** window, commit your changes, and publish them to the repository.

   For more information, see [Stage and commit code changes](https://code.visualstudio.com/docs/sourcecontrol/intro-to-git#_staging-and-committing-code-changes).

## Create pipelines in Azure DevOps

To create the infrastructure along with the CI and CD pipelines in Azure DevOps, repeat the following steps for each of the following pipeline files:

- **infrastructure-pipeline.yml** for the "Infrastructure-as-Code" pipeline.
- **CI-pipeline.yml** for the Continuous Integration pipeline.
- **CD-pipeline.yml** for the Continuous Delivery pipeline.

## Set up a pipeline

1. In Azure DevOps, go back to your team project and to the **Repos** > **Files** pane.

1. On the **Files** pane, select **Set up build**.

   :::image type="content" source="media/automate-build-deployment-standard/set-up-build.png" alt-text="Screenshot shows Azure DevOps team project, Git repository, and selected option named Set up build." lightbox="media/automate-build-deployment-standard/set-up-build.png":::

1. On the **Inventory your pipeline** pane, confirm the repository information, and select **Configure pipeline**.

   :::image type="content" source="media/automate-build-deployment-standard/inventory-pipeline.png" alt-text="Screenshot shows Inventory page with repo information for your pipeline." lightbox="media/automate-build-deployment-standard/inventory-pipeline.png":::

1. On the **Configure your pipeline** pane, select **Existing Azure Pipelines YAML file**.

   :::image type="content" source="media/automate-build-deployment-standard/configure-pipeline.png" alt-text="Screenshot shows Configure page for selecting a pipeline type." lightbox="media/automate-build-deployment-standard/configure-pipeline.png":::

1. On the **Select an existing YAML file** pane, follow these steps to select your **Infrastructure-pipeline.yml** file:

   1. For **Branch**, select the branch where you committed your changes, for example, **main** or your release branch.

   1. For **Path**, select the path to use for your pipeline. The following path is the default value:

      **deployment/{*logic-app-name*}/ADOPipelineScripts/{*infrastructure-pipeline-name*}.yml**

   1. When you're ready, select **Continue**.

      :::image type="content" source="media/automate-build-deployment-standard/select-infrastructure-pipeline.png" alt-text="Screenshot shows pane for Select an existing YAML file." lightbox="media/automate-build-deployment-standard/select-infrastructure-pipeline.png":::

1. On the **Configure your pipeline** pane, select **Review pipeline**.

1. On the **Review your governed pipeline** pane, provide the following information:

   - **Pipeline Name**: Enter a name for the pipeline.
   - **Pipeline folder**: Select the folder for where to save your pipeline, which is named **./deployment/{*logic-app-name*}/pipelines**.

1. When you're done, select **Save**.

   :::image type="content" source="media/automate-build-deployment-standard/review-pipeline.png" alt-text="Screenshot shows pane named Review governed pipeline." lightbox="media/automate-build-deployment-standard/review-pipeline.png":::

## View and run pipeline

To find and run your pipeline, follow these steps:

1. On your team project's left menu, expand **Pipelines**, and select **Pipelines**.

1. Select the **All** tab to view all available pipelines. Find and select your pipeline.

1. On your pipeline's toolbar, select **Run pipeline**.

   :::image type="content" source="media/automate-build-deployment-standard/run-pipeline.png" alt-text="Screenshot shows the pane for the created pipeline and the selected option for Run pipeline." lightbox="media/automate-build-deployment-standard/run-pipeline.png":::

For more information, see [Create your first pipeline](/azure/devops/pipelines/create-first-pipeline).

## See also

- [Customize your pipeline](/azure/devops/pipelines/customize-pipeline)

- [Manage your pipeline with Azure CLI](/azure/devops/pipelines/get-started/manage-pipelines-with-azure-cli)

- [Continuous integration with Azure Pipelines in Visual Studio Code](https://code.visualstudio.com/api/working-with-extensions/continuous-integration)
