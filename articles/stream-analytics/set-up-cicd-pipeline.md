---
title: Azure DevOps CI/CD Pipeline for Stream Analytics Jobs
description: Learn how to set up a CI/CD pipeline for Azure Stream Analytics jobs in Azure DevOps. Follow step-by-step instructions to automate builds, tests, and deployments.
#customer intent: As a developer, I want to set up a CI/CD pipeline for an Azure Stream Analytics job in Azure DevOps so that I can automate the build and deployment process.
author: alexlzx
ms.author: zhenxilin
ms.service: azure-stream-analytics
ms.topic: how-to
ms.date: 03/05/2026
# Customer intent: I want to know how to set up a CI/CD pipeline for an Azure Stream Analytics job in Azure DevOps.
---

# Use Azure DevOps to create a CI/CD pipeline for a Stream Analytics job

In this article, you learn how to create Azure DevOps [build](/azure/devops/pipelines/get-started/pipelines-get-started) and [release](/azure/devops/pipelines/release/define-multistage-release-process) pipelines by using Azure Stream Analytics CI/CD tools.

## Commit your Stream Analytics project

Before you begin, commit your complete Stream Analytics projects as source files to an [Azure DevOps](/azure/devops/user-guide/source-control) repository. You can reference this [sample repository](https://dev.azure.com/ASA-CICD-sample/azure-streamanalytics-cicd-demo) and [Stream Analytics project source code](https://dev.azure.com/ASA-CICD-sample/_git/azure-streamanalytics-cicd-demo) in Azure Pipelines.

The steps in this article use a Stream Analytics Visual Studio Code project. If you're using a Visual Studio project, follow the steps in [Automate builds, tests, and deployments of an Azure Stream Analytics job using CI/CD tools](cicd-tools.md).

## Create a build pipeline

In this section, you learn how to create a build pipeline. 

1. Open a web browser and go to your project in Azure DevOps.  

2. Under **Pipelines** in the left navigation menu, select **Builds**. Then, select **New pipeline**.

   :::image type="content" source="media/set-up-cicd-pipeline/new-pipeline.png" alt-text="Screenshot of Azure Pipelines Builds page showing no build pipelines found and a New pipeline button." lightbox="media/set-up-cicd-pipeline/new-pipeline.png":::

3. Select **Use the classic editor** to create a pipeline without YAML.

4. Select your source type, team project, and repository. Then, select **Continue**.

   :::image type="content" source="media/set-up-cicd-pipeline/select-repo.png" alt-text="Screenshot of Azure Pipelines source selection page with Azure Repos Git, GitHub, and other options, and repository, branch, and continue button visible." lightbox="media/set-up-cicd-pipeline/select-repo.png":::

5. On the **Choose a template** page, select **Empty job**.

## Install npm package

1. On the **Tasks** page, select the plus sign next to **Agent job 1**. Enter *npm* in the task search, and select **npm**.

   :::image type="content" source="media/set-up-cicd-pipeline/search-npm.png" alt-text="Screenshot of Azure Pipelines Tasks page with Agent job 1 selected, npm searched, and npm task options displayed to the right." lightbox="media/set-up-cicd-pipeline/search-npm.png":::

2. Give the task a **Display name**. Change the **Command** option to *custom* and enter the following command in **Command and arguments**. Don't change the other default options.

   ```bash
   install -g azure-streamanalytics-cicd
   ```

   :::image type="content" source="media/set-up-cicd-pipeline/npm-config.png" alt-text="Screenshot of Azure Pipelines task editor showing npm task with custom command to install azure-streamanalytics-cicd package." lightbox="media/set-up-cicd-pipeline/npm-config.png":::

Use the following steps if you need to use a hosted Linux agent:
1.  Select your **Agent Specification**.
   
    :::image type="content" source="media/set-up-cicd-pipeline/select-linux-agent.png" alt-text="Screenshot of Azure Pipelines Tasks page showing agent pool set to Azure Pipelines and agent specification set to ubuntu-16.04." lightbox="media/set-up-cicd-pipeline/select-linux-agent.png":::

2.  On the **Tasks** page, select the plus sign next to **Agent job 1**. Enter *command line* in the task search, and select **Command line**.
   
    :::image type="content" source="media/set-up-cicd-pipeline/cmd-search.png" alt-text="Screenshot of searching commandline task. " lightbox="media/set-up-cicd-pipeline/cmd-search.png":::

3.  Give the task a **Display name**. Enter the following command in **Script**. Don't change the other default options.

      ```bash
      sudo npm install -g azure-streamanalytics-cicd --unsafe-perm=true --allow-root
      ```
      :::image type="content" source="media/set-up-cicd-pipeline/cmd-scripts.png" alt-text="Screenshot of entering script for cmd task." lightbox="media/set-up-cicd-pipeline/cmd-scripts.png":::

## Add a build task

1. On the **Variables** page, select **+ Add** in **Pipeline variables**. Add the following variables. Set the following values according to your preference:

   |Variable name|Value|
   |-|-|
   |projectRootPath|[YourProjectName]|
   |outputPath|Output|
   |deployPath|Deploy|

2. On the **Tasks** page, select the plus sign next to **Agent job 1**. Search for **Command line**.

3. Give the task a **Display name** and enter the following script. Modify the script with your repository name and project name.
    
    > [!NOTE]
    > It's highly recommended to use the `build --v2` command to generate the ARM template for deployment. The new ARM template has fewer parameters while preserving the same functionality as the previous version.
    >
    > The older ARM template will soon be deprecated. Only templates created by using `build --v2` receive updates and bug fixes.

    ```bash
    azure-streamanalytics-cicd build --v2 -project $(projectRootPath)/asaproj.json -outputpath $(projectRootPath)/$(outputPath)/$(deployPath)
    ```

   The following image uses a Stream Analytics Visual Studio Code project as an example.

   :::image type="content" source="media/set-up-cicd-pipeline/command-line-config-build.png" alt-text="Screenshot of Azure DevOps pipeline editor showing a command line task to build a Stream Analytics Visual Studio Code project.":::

## Add a Test task

1. On the **Variables** page, select **+ Add** in **Pipeline variables**. Add the following variables. Modify the values with your output path and repository name.

   |Variable name|Value|
   |-|-|
   |testPath|Test|

   :::image type="content" source="media/set-up-cicd-pipeline/pipeline-variables-test.png" alt-text="Screenshot of Azure Pipelines Variables page showing a list of pipeline variables and values, with the Add button visible." lightbox="media/set-up-cicd-pipeline/pipeline-variables-test.png":::

2. On the **Tasks** page, select the plus sign next to **Agent job 1**. Search for **Command line**.

3. Give the task a **Display name** and enter the following script. Modify the script with your project file name and the path to the test configuration file. 

   See [automated test instructions](cicd-tools.md#automated-test) for details on how to add and configure test cases.

   ```bash
   azure-streamanalytics-cicd test -project $(projectRootPath)/asaproj.json -outputpath $(projectRootPath)/$(outputPath)/$(testPath) -testConfigPath $(projectRootPath)/test/testConfig.json 
   ```

   :::image type="content" source="media/set-up-cicd-pipeline/command-line-config-test.png" alt-text="Screenshot of Azure Pipelines task configuration." lightbox="media/set-up-cicd-pipeline/command-line-config-test.png":::

## Add a Copy files task

Add a copy file task to copy the test summary file and Azure Resource Manager template files to the artifact folder.  

1. On the **Tasks** page, select the **+** next to **Agent job 1**. Search for **Copy files**. Then enter the following configurations. By assigning `**` to **Contents**, all files of the test results are copied.

   | Parameter | Input |
   |-|-|
   | Display name | Copy Files to: $(build.artifactstagingdirectory) |
   | Source Folder | `$(system.defaultworkingdirectory)/$(outputPath)/` |
   | Contents | `**` |
   | Target Folder | `$(build.artifactstagingdirectory)` |

2. Expand **Control Options**. Select **Even if a previous task has failed, unless the build was canceled** in **Run this task**.

   :::image type="content" source="media/set-up-cicd-pipeline/copy-config.png" alt-text="Screenshot of Azure DevOps pipeline task settings showing Copy Files step with source, contents, and target folder fields filled." lightbox="media/set-up-cicd-pipeline/copy-config.png":::

## Add a Publish build artifacts task

1. On the **Tasks** page, select the plus sign next to **Agent job 1**. Search for **Publish build artifacts** and select the option with the black arrow icon.

2. Expand **Control Options**. Select **Even if a previous task has failed, unless the build was canceled** in **Run this task**.

   :::image type="content" source="media/set-up-cicd-pipeline/publish-config.png" alt-text="Screenshot of Azure Pipelines task editor showing Publish build artifacts settings with Control Options expanded." lightbox="media/set-up-cicd-pipeline/publish-config.png":::

## Save and run

After you finish adding the npm package, command line, copy files, and publish build artifacts tasks, select **Save & queue**. When prompted, enter a save comment and select **Save and run**. You can download the testing results from **Summary** page of the pipeline.

## Check the build and test results

You can find the test summary file and Azure Resource Manager template files in the **Published** folder.

   :::image type="content" source="media/set-up-cicd-pipeline/check-build-test-result.png" alt-text="Screenshot of Azure Pipelines summary page showing manual run details, repository info, elapsed time, and a published test result link." lightbox="media/set-up-cicd-pipeline/check-build-test-result.png":::

   :::image type="content" source="media/set-up-cicd-pipeline/check-drop-folder.png" alt-text="Screenshot of Azure Artifacts page showing the Published tab with folders and files for build and test results." lightbox="media/set-up-cicd-pipeline/check-drop-folder.png":::

## Release with Azure Pipelines

In this section, you learn how to create a release pipeline. 

Open a web browser and go to your Azure Stream Analytics Visual Studio Code project.

1. Under **Pipelines** in the left navigation menu, select **Releases**. Then select **New pipeline**.

2. Select **start with an Empty job**.

3. In the **Artifacts** box, select **+ Add an artifact**. Under **Source**, select the build pipeline you created and select **Add**.

   :::image type="content" source="media/set-up-cicd-pipeline/build-artifact.png" alt-text="Screenshot of Add an artifact dialog in Azure Pipelines, showing Build source type selected and build pipeline fields completed." lightbox="media/set-up-cicd-pipeline/build-artifact.png":::

4. Change the name of **Stage 1** to **Deploy job to test environment**.

5. Add a new stage and name it **Deploy job to production environment**.

### Add deploy tasks

> [!NOTE]
> The **Override template parameters** option doesn't apply to Azure Resource Manager v2 builds because the process passes parameters as objects. To work around this limitation, add a PowerShell script to your pipeline that reads the parameter file as JSON and makes the necessary parameter modifications.
>
> For more information on adding the PowerShell script, see [ConvertFrom-Json](/powershell/module/microsoft.powershell.utility/convertfrom-json) and [Update Object in JSON file](https://stackoverflow.com/questions/65753594/update-object-in-json-file-using-powershell).

1. From the tasks dropdown, select **Deploy job to test environment**.

2. Select the **+** next to **Agent job** and search for **ARM template deployment**. Enter the following parameters:

   | Parameter | Value |
   |-|-|
   | Display name | *Deploy myASAProject* |
   | Azure subscription | Choose your subscription. |
   | Action | *Create or update resource group* |
   | Resource group | Choose a name for the test resource group that contains your Stream Analytics job. |
   | Location | Choose the location of your test resource group. |
   | Template location | Linked artifact |
   | Template | `$(System.DefaultWorkingDirectory)/_azure-streamanalytics-cicd-demo-CI-Deploy/drop/myASAProject.JobTemplate.json` |
   | Template parameters | `$(System.DefaultWorkingDirectory)/_azure-streamanalytics-cicd-demo-CI-Deploy/drop/myASAProject.JobTemplate.parameters.json` |
   | Override template parameters | `-<arm_template_parameter> "your value"`. Define the parameters by using **Variables**. |
   | Deployment mode | Incremental |

3. From the tasks dropdown, select **Deploy job to production environment**.

4. Select the **+** next to **Agent job** and search for *ARM template deployment*. Enter the following parameters:

   | Parameter | Value |
   |-|-|
   | Display name | *Deploy myASAProject* |
   | Azure subscription | Choose your subscription. |
   | Action | *Create or update resource group* |
   | Resource group | Choose a name for the production resource group that contains your Stream Analytics job. |
   | Location | Choose the location of your production resource group. |
   | Template location | *Linked artifact* |
   | Template | `$(System.DefaultWorkingDirectory)/_azure-streamanalytics-cicd-demo-CI-Deploy/drop/myASAProject.JobTemplate.json` |
   | Template parameters | `$(System.DefaultWorkingDirectory)/_azure-streamanalytics-cicd-demo-CI-Deploy/drop/myASAProject.JobTemplate.parameters.json` |
   | Override template parameters | `-<arm_template_parameter> "your value"` |
   | Deployment mode | Incremental |

### Create a release

To create a release, select **Create release** in the upper-right corner.

:::image type="content" source="media/set-up-cicd-pipeline/create-release.png" alt-text="Screenshot of Azure Pipelines release pipeline with artifacts, stages, and the Create release button highlighted." lightbox="media/set-up-cicd-pipeline/create-release.png":::

## Related content

* [Continuous integration and Continuous deployment for Azure Stream Analytics](cicd-overview.md)
* [Automate build, test, and deployment of an Azure Stream Analytics job using CI/CD tools](cicd-tools.md)
