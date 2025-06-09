---
title: Create Pipelines for Infrastructure, CI, and CD
description: Learn to create pipelines that automate infrastructure, continuous integration (CI) and deployment (CD) for business process stages mapped to Standard workflow operations in different environments without rebuilding or remapping.
ms.service: azure-business-process-tracking
ms.topic: how-to
ms.reviewer: estfan, kewear, archidda, azla
ms.date: 06/09/2025
# Customer intent: As an integration developer, I want to create pipelines that automate infrastructure, CI, and CD provisioning for business process stages mapped to Standard workflow operations in different deployment environments without rebuilding and remapping.
---

# Automate pipelines for business process and logic app infrastructure, CI, and CD in different environments

[!INCLUDE [logic-apps-sku-standard](includes/logic-apps-sku-standard.md)]

To avoid rebuilding logic apps and remapping business processes to logic app workflow operations when you deploy to different environments, you can create pipelines by using Azure DevOps. Pipelines do all the work to automate infrastructure creation, continuous integration (CI) and continuous deployment (CD). These pipelines create resources for your logic apps, business processes, mappings between business process stages and workflow operations, and set up transaction tracking in your deployment environments for development, test, and production.

This guide shows how to complete the following tasks:

- Create and run pipelines for your Standard logic app infrastructure, CI, and CD by using **Azure Logic Apps Standard Tasks** for Azure DevOps.

- Prepare your business process for CI and CD.

- Create and run pipelines for your business process infrastructure, CI, and CD by using **Azure Logic Apps Standard Tasks** for Azure DevOps.

- Update and run your CI and CD pipelines after you configure other necessary components.

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Visual Studio Code installed with the Azure Logic Apps (Standard) extension and the required prerequisites.

  For more information, see [Create Standard logic app workflows with Visual Studio Code](/azure/logic-apps/create-standard-workflows-visual-studio-code#prerequisites).

- A Visual Studio Code workspace with an undeployed Standard logic app project.

- An Azure DevOps organization, project, and Git repository where you store your source code and artifacts.

  To create and run pipelines in Azure DevOps, you need the capability to run pipelines on Microsoft-hosted agents. To use Microsoft-hosted agents, your Azure DevOps organization must have access to Microsoft-hosted parallel jobs.

  If you don't have a repository, follow the steps in [Create a new Git repo in your project](/azure/devops/repos/git/create-new-repo). To create repository, you need a GitHub account or Microsoft account, an Azure DevOps organization, and an Azure DevOps project where you have administrator permissions, such as **Project Collection Administrator** permissions.

- The latest **Azure Logic Apps Standard Tasks** extension for Azure Pipelines in your Azure DevOps project.

  This extension provides automated, build, connections deployment, and release tasks for Azure Logic Apps (Standard). For extension information and task prerequisites, see [**Azure Logic Apps Standard Tasks**](https://marketplace.visualstudio.com/items?itemName=ms-logicapps-ado.azure-logic-apps-devops-tasks).

- The appropriate user role permissions to create, view, use, or manage a service connection between the pipelines that you create later in this article.

  For more information, see [Set service connection security in Azure Pipelines](/azure/devops/pipelines/policies/permissions#set-service-connection-security-in-azure-pipelines).

## Clone your repo in Azure DevOps

After you create a repository, clone the repo to your computer so that you can make and push changes in your local repo to the original repo in Azure DevOps:

  1. [Clone the repo to your computer](/azure/devops/repos/git/create-new-repo#clone-the-repo-to-your-computer).

     The following example shows a repo in Azure DevOps with the default branch named **main**. Your team's repo in Azure DevOps might have a default branch with a different name.

     :::image type="content" source="media/set-up-continuous-integration-deployment/clone-repo.png" alt-text="Screenshot shows Azure DevOps, Files page, and selected Clone button." lightbox="media/set-up-continuous-integration-deployment/clone-repo.png":::

  1. Copy and save the **HTTPS** clone URL for later use.

  1. In Visual Studio Code, open your Standard logic app project.

  1. From the **Terminal** menu, select **New Terminal**.

  1. From the command prompt, go to the folder that has your project's workspace file.

     A workspace is a text file that has the **.code-workspace** extension. To find the folder with this file, in the project root folder, open the folder named **.vscode**.

  1. From the command prompt, run the following Git commands set up your local repo, snapshot your logic app project, link your local repo to the repo in Azure DevOps, and create a default branch in your local repo that points at the default branch for the repo in Azure DevOps:

     `git init`<br>
     `git add -A`<br>
     `git commit -m "<your-commit-comment>"`<br>
     `git remote add origin <clone-URL>`<br>
     `git push --set-upstream origin main`<br>

     These commands complete the following tasks:

     1. Create an empty local repo.

     1. Add all new or edit files from the current folder to the *index*, which is a staging area or cache in your local repo.

     1. Create and save a snapshot with only the new or edited files currently in the index as a new commit object in your local repo. This object includes a brief description about the contents in the snapshot.

     1. Create a link between your local repo and the repo in Azure DevOps.

        In this example, the Git command **git remote add origin <*clone-URL*>** links your local repo to the repo in Azure DevOps that uses **<*clone-URL*>**. The command also assigns **origin** as an alias that you can later use for that repo.

     1. Create a default branch in your local repo, which is **main** in this example, and set up tracking between this branch and the repo in Azure DevOps.

     For more information, see [Git reference](https://git-scm.com/docs).

  1. At the prompt, provide your Git credentials to the Git Credential Manager.

## Generate deployment scripts

Now, generate deployment scripts from your logic app project. This task lets you create the files to create your logic app resource along with the CI and CD pipelines to automate build and deployment for your logic app in Azure. For more information, see [Automate build and deployment for Standard logic app workflows with Azure DevOps](/azure/logic-apps/automate-build-deployment-standard).

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

   The deployment script generation process creates a **deployment** folder that contains files for your infrastructure, CI, and CD pipelines along with parameters files, for example:

   :::image type="content" source="media/set-up-continuous-integration-deployment/deployment-scripts.png" alt-text="Screenshot shows Visual Studio Code and generated deployment script files." lightbox="media/set-up-continuous-integration-deployment/deployment-scripts.png":::

1. From the command prompt, run the following Git commands to add, save, and push your local updates to Azure DevOps:

   `git add -A`<br>
   `git commit -m "<your-commit-comment>"`<br>
   `git push`

   For more information, see [Git reference](https://git-scm.com/docs).

## Create infrastructure pipeline for logic app

For this task, see the general steps in [Create your first pipeline](/azure/devops/pipelines/create-first-pipeline) with the following steps:

1. In your Azure DevOps project, on the project menu, select **Pipelines** > **Pipelines**.

1. On the **Pipelines** page, select **Create pipeline**, or **New pipeline** if pipelines exist, for example:

   :::image type="content" source="media/set-up-continuous-integration-deployment/pipelines.png" alt-text="Screenshot shows Azure DevOps project, Pipelines page, and button selected for New pipeline." lightbox="media/set-up-continuous-integration-deployment/pipelines.png":::

1. On the **Select** tab, select the repo type and the repo to use.

   This example selects **Azure DevOps**.

1. On the **Inventory** tab, select **Production** or **Non-production**, and then select **Configure pipeline**.

1. On the **Configure** tab, select **Existing Azure Pipeline YAML file**.

1. For **Branch**, find and select the branch with your deployment script files.

   This example selects the **main** branch.

   Earlier, you pushed changes with generated deployment script files to Azure DevOps. Now, you can select the infrastructure pipeline file that you created in Visual Studio Code.

1. For **Path**, find and select the **infrastucture-pipeline.yaml** file at the following location:

   **/pipelines/infrastructure-pipeline.yaml**

1. Select **Continue** > **Review pipeline**. Provide a name for the pipeline. The pipeline folder is optional.

1. To complete this task, select **Save**.

## Create CI pipeline for your logic app

1. Follow the steps in [Create a pipeline for logic app infrastructure](#create-infrastructure-pipeline-for-logic-app) until you specify the path for the CI pipeline file.

1. For **Path**, find and select the **CI-pipeline.yaml** file at the following location:

   **/pipelines/CI-pipeline.yaml**

1. Select **Continue** > **Review pipeline**. Provide a name for the pipeline. The pipeline folder is optional.

1. To complete this task, select **Save**.

## Create CD pipeline for your logic app

1. Follow the steps in [Create a pipeline for logic app infrastructure](#create-infrastructure-pipeline-for-logic-app) until you specify the path for the CD pipeline file.

1. For **Path**, find and select the **CD-pipeline.yaml** file at the following location:

   **/pipelines/CD-pipeline.yaml**

1. Select **Continue** > **Review pipeline**. Provide the name for the pipeline. The pipeline folder is optional.

1. To complete this task, select **Save**.

## Create a service connection

A service connection is an authenticated connection between your pipelines and external or remote services that you use to complete tasks. In this scenario, the service connection lets your CI/CD pipelines create and manage resources in Azure. These steps create a Microsoft Entra ID app registration to use as an authentication credential. For more information, see [Create Azure Resource Manager service connection that uses workload identity federation](/azure/devops/pipelines/library/connect-to-azure#create-an-azure-resource-manager-service-connection-that-uses-workload-identity-federation).

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

## Update logic app pipelines with the service connection

Now, specify the service connection to use with your logic app pipelines.

1. In each listed pipeline file, find the property named **`serviceConnectionName`**.

   - Infrastructure pipeline: Update the **infrastructure-pipeline-variables.yml** file.
   - CI pipeline: Update the **CI-pipeline-variables.yml** file.
   - CD pipeline: Update the **CD-pipeline-variables.yml** file.

1. For the **`serviceConnectionName`** property, set the value to the service connection name.

1. In the **CI-pipeline-variables.yml** file, add a new property named **`subscriptionId`**, and set the property value to your Azure subscription ID, for example:

   `subscriptionId: '<Azure-subscription-ID>'`

1. Make sure to save all the updated pipeline files.

1. From the command prompt, run the following Git commands to add, save, and push your local updates to Azure DevOps:

   `git add -A`<br>
   `git commit -m "<your-commit-comment>"`<br>
   `git push`

   For more information, see [Git reference](https://git-scm.com/docs).
 
## Run infrastructure pipeline for your logic app

To create your Standard logic app resource in Azure, follow these steps:

1. In Azure DevOps, open your logic app infrastructure pipeline, select **Edit**, select the appropriate branch, and then select **Run**.

1. If prompted, provide the permissions necessary to run the pipeline.

After the pipeline completes, your empty Standard logic app resource is created in the Azure portal.

## Run CI and CD pipelines for your logic app

1. Before you run the CD pipeline, update the CD pipeline to include the source value, which is the name for your CI pipeline.

   You can directly commit to the branch, but then run **`git pull`** on your local source to locally synchronize this change.

1. In Azure DevOps, run the CI pipeline, and then run the CD pipeline.

1. If prompted, provide the permissions necessary to run the pipelines.

After the CD pipeline completes, the content from your Standard logic app project is deployed to the previously created logic app resource in the Azure portal.

## Prepare your business process for CI and CD

After you create and deploy a working Standard logic app resource in Azure, you can [define and map your business process stages to workflow operations so you can start tracking transactions](create-business-process.md). After you set up, deploy, and test the business process, you can prepare the business process for CI/CD.

1. In the [Azure portal](https://portal.azure.com), find and open your business process resource.

1. On the resource navigation menu, select **Overview**. On the toolbar, select **Export** to extract the deployment content as a .zip file.

   This .zip file contains Azure Resource Manager templates, parameter files, and business process resource pipelines that you can use for infrastructure provisioning and CI/CD process in Azure DevOps.

1. In Visual Studio Code, go to your logic app project's **deployment** folder, which was created after you generated deployment scripts for the project, and create a folder named **businessprocesses**.

1. Extract the exported .zip file, and add the business process folders to the **businessprocesses** folder, so that your project folder structure looks similar to the following example:

   **\deployment\businessprocesses\\<*business-process-name*>**

   :::image type="content" source="media/set-up-continuous-integration-deployment/business-process-project-folders.png" alt-text="Screenshot shows Visual Studio Code and exported business process project folders." lightbox="media/set-up-continuous-integration-deployment/business-process-project-folders.png":::

## Update business process pipeline variables

Now, update your **business-process-pipelines-variables.yml** file to use the previously created service connection.

1. In Visual Studio Code, go to your logic app project, find the **pipelines** folder, and open the file named **business-process-pipelines-variables.yml** at the end of this path:

   **deployment\businessprocesses\\<*business-process-name*>\\pipelines\\**

   The **business-process-pipelines-variables.yml** file contains a node named **`businessProcessMapping`**. This node includes references to your business process stage mappings and specific logic apps. These references contain paths with Azure subscription IDs and names for resource groups and logic apps.

   > [!NOTE]
   >
   > Make sure to change these values if you plan to create a deployment package for a different 
   > environment, such as test or production. That way, when you deploy the business, the stages 
   > in the business process map to the correct subscription IDs and logic app names.

   [!INCLUDE [secrets-guidance](includes/secrets-guidance.md)]

1. In the **business-process-pipelines-variables.yml** file, find the **`serviceConnectionName`** property, and set the property value to the service connection name.

1. From the command prompt, run the following Git commands to add, save all local changes to tracked files, and push to Azure DevOps:

   `git add -A`<br>
   `git commit -a "<your-commit-comment>"`<br>
   `git push`

   For more information, see [Git reference](https://git-scm.com/docs).

After you finish these steps, your business process pipelines now appear in the Azure DevOps repo.

:::image type="content" source="media/set-up-continuous-integration-deployment/business-processes-repo.png" alt-text="Screenshot shows Azure DevOps repo with uploaded business process pipelines." lightbox="media/set-up-continuous-integration-deployment/business-processes-repo.png":::

## Set up permissions and access to Azure Data Explorer

Azure Business Process Tracking uses Azure Data Explorer as the backend data store. So, you need to make sure that your service connection can connect, access, and update Data Explorer cluster, database, and tables by completing the following steps:

On the Data Explorer database where your service connection needs to create a table, make sure that your service connection has **Database Admin** role.

1. In your Azure Database Explorer cluster, go to your Data Explorer database.
1. On the database menu, under **Overview**, select **Permissions**.
1. Add your service connection, and assign the **Database Admin** role.

For more information, see the following documentation:

- [Azure roles, Microsoft Entra roles, and classic subscription administrator roles](/azure/role-based-access-control/rbac-and-directory-admin-roles)
- [Role-based access control (Azure Data Explorer)](/kusto/access-control/role-based-access-control?view=azure-data-explorer#roles-and-permissions&preserve-view=true)

## Create infrastructure pipeline for your business process

1. Follow the steps in [Create a pipeline for logic app infrastructure](#create-infrastructure-pipeline-for-logic-app) until you specify the path for the business process infrastructure pipeline file.

1. For **Path**, find and select the **infrastucture-business-process-pipeline.yaml** file at the following location:

   **deployment/businessprocesses/<*business-process-name*>/pipelines/**

1. Select **Continue** > **Review pipeline**. Provide a name for the pipeline and pipeline folder.

1. To complete this task, select **Save**.

## Run infrastructure pipeline for your business process

To create the business process resource in Azure, follow these steps:

1. In Azure DevOps, open your business process infrastructure pipeline, select **Edit**, select the appropriate branch, and then select **Run**.

1. If prompted, provide the permissions necessary to run the pipeline.

After the pipeline completes, your business process resource is created in the Azure portal.

## Create CD pipeline for your business process

1. Follow the steps in [Create a pipeline for logic app infrastructure](#create-infrastructure-pipeline-for-logic-app) until you specify the path for the business process CD pipeline file.

1. For **Path**, find and select the **deploy-business-process-pipeline.yaml** file at the following location:

   **deployment/businessprocesses/<*business-process-name*>/pipelines/**

1. Select **Continue** > **Review pipeline**. Provide a name for the pipeline and pipeline folder.

1. To complete this task, select **Save**.

## Run CD pipeline for your business process

To deploy content from your previously deployed business process to your new business process resource in Azure, follow these steps:

1. In Azure DevOps, open your business process CD pipeline, select **Edit**, select the appropriate branch, and then select **Run**.

1. If prompted, provide the permissions necessary to run the pipeline.

## Update logic app CI pipeline with business process task

Now, update your logic app CI pipeline to use the task named **Azure Logic Apps (Standard) Business Process Artifacts Build**. The logic app CI pipeline extracts [tracking profile](deploy-business-process.md) content from your deployed business process and includes that content in subsequent logic app deployments. This tracking profile contains instructions that the Azure Logic Apps (Standard) runtime uses to emit business data to Azure Data Explorer. 

> [!NOTE]
>
> Per this guide's prerequisites, make sure that you installed the latest 
> [**Azure Logic Apps Standard Tasks** extension](https://marketplace.visualstudio.com/items?itemName=ms-logicapps-ado.azure-logic-apps-devops-tasks) for Azure Pipelines in your Azure DevOps project.

1. In Azure DevOps, open your logic app CI pipeline, and select **Edit**.

1. In the **Tasks** pane, find and select **Azure Logic Apps (Standard) Business Process Artifacts Build**.

1. In parameters pane or in the YAML file editor, provide the following parameter values as described in the table:

   > [!TIP]
   >
   > When you set these parameter values, try using the in-browser file editor instead. The editor 
   > makes it easier and more convenient to reuse parameters from elsewhere in your solution.

   | Parameter | YAML name | Required | Value | Description |
   |-----------|-----------|----------|-------|-------------|
   | **Azure service connection** | **`connectedServiceNameARM`** | Yes | <*serviceConnectionName*> | Parameters pane: <br><br>1. Select the Azure subscription associated with the service connection. <br><br>2. Select **Authorize**. <br><br>3. Select the service connection. <br><br>For more information, see [Create a service connection](#create-a-service-connection). |
   | **Standard logic app name** | **`appName`** | Yes | <*logicAppName*> | The name for your existing Standard logic app. |
   | **Subscription ID** | **`subscriptionId`** | Yes | <*subscriptionId*> | The ID for your Azure subscription. |
   | **Target folder** | **`targetFolder`** | Yes | <*logicAppName*> | The name for the folder that contains your Standard logic app. The folder that contains your Standard logic app and is the same folder as the **`sourceFolder`** parameter for the **AzureLogicAppsStandardBuild** task. |
   | **Deployment folder** | **`deploymentFolder`** | No | <*logicAppName*> | The folder that contains the **workflowparameters** folder, which contains the **parameters.json** file for your logic app. |
   | **App settings file path** | **`stagingAppSettingsFilePath`** | No | See example. | The path to the app settings file that the task generates. This file includes the app settings for the business process stages that are mapped to the specified logic app workflow operations. <br><br>In the **`AzureLogicAppsStandardRelease`** task, use this app settings file for the **`appSettings`** parameter value. To include the file with the published pipeline artifact, make sure that you store the file in artifacts staging directory. |

   For more information, see [Azure Logic Apps Standard Business Process Artifacts Build Task](https://marketplace.visualstudio.com/items?itemName=ms-logicapps-ado.azure-logic-apps-devops-tasks).

1. When you're done, make sure that **`task`** section named **`AzureLogicAppsStandardBusinessProcessArtifactsBuild@0`** appears below the node named **`steps:`** and above the **`task`** named **`AzureLogicAppsStandardBuild@`**, for example:

   ```yml
   jobs:
     - job: logic_app_build
       displayName: 'Build and publish logic app'
       steps:
         - task: AzureLogicAppsStandardBusinessProcessArtifactsBuild@0
           inputs:
             connectedServiceNameARM: '$(serviceConnectionName)'
             appName: '$(logicAppName)'
             subscriptionId: '$(subscriptionId)'
             targetFolder: '$(Build.SourcesDirectory)/$(logicAppName)'
             deploymentFolder: '$(System.DefaultWorkingDirectory)/deployment/$(logicAppName)/'
             stagingAppSettingsFilePath: '$(Build.ArtifactStagingDirectory)/appsettings_businessprocess_$(Build.BuildId).json'
         - task: AzureLogicAppsStandardBuild@0
           displayName: 'Azure Logic Apps Standard Build'
           inputs:
             sourceFolder: '$(Build.SourcesDirectory)/$(logicAppName)'
             deploymentFolder: '$(System.DefaultWorkingDirectory)/deployment/$(logicAppName)/'
             archiveFile: '$(Build.ArtifactStagingDirectory)/$(Build.BuildId).zip'
   ```

1. When you're done, select **Add**.

1. In the editor, update the **`targetPath`** parameter value to **`'$(Build.ArtifactStagingDirectory)'`**.

   ```yml
   - task: PublishPipelineArtifact@1
     displayName: 'Publish logic app zip artifact'
     inputs:
        targetPath: '$(Build.ArtifactStagingDirectory)'
        artifact: '$(logicAppCIArtifactName)'
        publishLocation: 'pipeline'
   ``` 

1. When you're done, select **Validate and Save**.

## Update logic app CD pipeline with app settings

The app settings for your Standard logic app provide important setup information for the Azure Logic Apps (Standard) runtime to emit data to Azure Data Explorer. Your logic app CD pipeline requires the following changes:

1. In Azure DevOps, open your logic app CD pipeline, and select **Edit**.

1. In the YAML file editor, set the **`appSettings`** property to the following value:

   **`'$(Pipeline.Workspace)/cipipeline/$(logicAppCIArtifactName)/appsettings_businessprocess_$(resources.pipeline.cipipeline.runID).json'`**

   For example:

   ```yml
   - task: AzureLogicAppsStandardRelease@0
     displayName: 'Azure Logic Apps Standard Release'
     inputs:
        connectedServiceName: '$(serviceConnectionName)'
        appName: '$(logicAppName)'
        resourceGroupName: '$(resourceGroupName)'
        appSettings: '$(Pipeline.Workspace)/cipipeline/$(logicAppCIArtifactName)/appsettings_businessprocess_$(resources.pipeline.cipipeline.runID).json'
        package: '$(Pipeline.Workspace)/cipipeline/$(logicAppCIArtifactName)/$(resources.pipeline.cipipeline.runID).zip'
   ```

1. When you're done, select **Validate and Save**.

1. To keep your local repo updated with the latest changes in your Azure DevOps repo, run the following Git command: `git pull`

## Run updated logic app CI and CD pipelines

1. In Azure DevOps, run the CI pipeline, and then run the CD pipeline.

1. If prompted, provide the permissions necessary to run the pipelines.

Now that you've completed deployment for your business processes and updated logic apps, test your solution to check that transactions are captured.

## Troubleshoot problems

If you experience problems when running transactions, check the following areas to make sure that your setup is correct.

- When you run pipelines and enable system diagnostics and extra logs, you get more verbose error messages, which might help you troubleshoot and resolve problems.

- After you run a logic app CD pipeline that includes tracking profiles, your deployed logic app includes a new parameter that starts with the following prefix:

  **`VersionForBusinessProcess-<business-process-name>`**

- Make sure that the following app settings exist in your logic app resource:

  1. On your logic app resource menu, under **Settings**, select **Environment variables**.

  1. On the **App settings** tab, find the following new settings:

     - **Workflows.BusinessEventTracking.DataExplorer.<*BusinessProcessName*>.TableName**
     - **Workflows.BusinessEventTracking.DataExplorer.<*BusinessProcessName*>.IngestConnectionString**
     - **Workflows.BusinessEventTracking.DataStore**
     - **Workflows.BusinessEventTracking.Enabled**

## Related content

- [Deploy a business process and tracking profile to Azure](deploy-business-process.md)
- [Manage business process](manage-business-process.md)
