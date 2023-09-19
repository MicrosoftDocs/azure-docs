---
title: Use Azure DevOps to create a CI/CD pipeline for a Stream Analytics job
description: This article describes how to set up a continuous integration and deployment (CI/CD) pipeline for an Azure Stream Analytics job in Azure DevOps
services: stream-analytics
author: alexlzx
ms.author: zhenxilin
ms.service: stream-analytics
ms.topic: how-to
ms.date: 09/08/2023
---

# Use Azure DevOps to create a CI/CD pipeline for a Stream Analytics job

In this article, you learn how to create Azure DevOps [build](/azure/devops/pipelines/get-started/pipelines-get-started) and [release](/azure/devops/pipelines/release/define-multistage-release-process) pipelines using Azure Stream Analytics CI/CD tools.

## Commit your Stream Analytics project

Before you begin, commit your complete Stream Analytics projects as source files to an [Azure DevOps](/azure/devops/user-guide/source-control) repository. You can reference this [sample repository](https://dev.azure.com/ASA-CICD-sample/azure-streamanalytics-cicd-demo) and [Stream Analytics project source code](https://dev.azure.com/ASA-CICD-sample/_git/azure-streamanalytics-cicd-demo) in Azure Pipelines.

The steps in this article use a Stream Analytics Visual Studio Code project. If you're using a Visual Studio project, follow the steps in [Automate builds, tests, and deployments of an Azure Stream Analytics job using CI/CD tools](cicd-tools.md).

## Create a build pipeline

In this section, you learn how to create a build pipeline. 

1. Open a web browser and navigate to your project in Azure DevOps.  

2. Under **Pipelines** in the left navigation menu, select **Builds**. Then, select **New pipeline**.

   :::image type="content" source="media/set-up-cicd-pipeline/new-pipeline.png" alt-text="Create new Azure Pipeline":::

3. Select **Use the classic editor** to create a pipeline without YAML.

4. Select your source type, team project, and repository. Then, select **Continue**.

   :::image type="content" source="media/set-up-cicd-pipeline/select-repo.png" alt-text="Select Azure Stream Analytics project":::

5. On the **Choose a template** page, select **Empty job**.

## Install npm package

1. On the **Tasks** page, select the plus sign next to **Agent job 1**. Enter *npm* in the task search and select **npm**.

   :::image type="content" source="media/set-up-cicd-pipeline/search-npm.png" alt-text="Select npm task":::

2. Give the task a **Display name**. Change the **Command** option to *custom* and enter the following command in **Command and arguments**. Leave the remaining default options.

   ```bash
   install -g azure-streamanalytics-cicd
   ```

   :::image type="content" source="media/set-up-cicd-pipeline/npm-config.png" alt-text="Enter configurations for npm task":::

Use following steps if you need to use hosted-Linux agent:
1.  Select your **Agent Specification**
   
    :::image type="content" source="media/set-up-cicd-pipeline/select-linux-agent.png" alt-text="Screenshot of selecting agent specification.":::

2.  On the **Tasks** page, select the plus sign next to **Agent job 1**. Enter *command line* in the task search and select **Command line**.
   
    :::image type="content" source="media/set-up-cicd-pipeline/cmd-search.png" alt-text="Screenshot of searching commandline task. ":::

3.  Give the task a **Display name**. enter the following command in **Script**. Leave the remaining default options.

      ```bash
      sudo npm install -g azure-streamanalytics-cicd --unsafe-perm=true --allow-root
      ```
      :::image type="content" source="media/set-up-cicd-pipeline/cmd-scripts.png" alt-text="Screenshot of entering script for cmd task.":::

## Add a Build task

1. On the **Variables** page, select **+ Add** in **Pipeline variables**. Add the following variables. Set the following values according to your preference:

   |Variable name|Value|
   |-|-|
   |projectRootPath|[YourProjectName]|
   |outputPath|Output|
   |deployPath|Deploy|

2. On the **Tasks** page, select the plus sign next to **Agent job 1**. Search for **Command line**.

3. Give the task a **Display name** and enter the following script. Modify the script with your repository name and project name.
    
    > [!NOTE]
    > It's highly recommended to use the `build --v2` to generate ARM template for deployment. The new ARM template has fewer parameters while preserving the same functionality as the previous version.
    >
    > Please note that the older ARM template will soon be deprecated, only templates created using `build --v2` will receive updates and bug fixes.

   ```bash
   azure-streamanalytics-cicd build --v2 -project $(projectRootPath)/asaproj.json -outputpath $(projectRootPath)/$(outputPath)/$(deployPath)
   ```

   The image uses a Stream Analytics Visual Studio Code project as an example.

   :::image type="content" source="media/set-up-cicd-pipeline/command-line-config-build.png" alt-text="Enter configurations for command-line task visual studio code":::

## Add a Test task

1. On the **Variables** page, select **+ Add** in **Pipeline variables**. Add the following variables. Modify the values with your output path and repository name.

   |Variable name|Value|
   |-|-|
   |testPath|Test|

   :::image type="content" source="media/set-up-cicd-pipeline/pipeline-variables-test.png" alt-text="Add pipeline variables":::

2. On the **Tasks** page, select the plus sign next to **Agent job 1**. Search for **Command line**.

3. Give the task a **Display name** and enter the following script. Modify the script with your project file name and the path to the test configuration file. 

   See [automated test instructions](cicd-tools.md#automated-test) for details on how to add and configure test cases.

   ```bash
   azure-streamanalytics-cicd test -project $(projectRootPath)/asaproj.json -outputpath $(projectRootPath)/$(outputPath)/$(testPath) -testConfigPath $(projectRootPath)/test/testConfig.json 
   ```

   :::image type="content" source="media/set-up-cicd-pipeline/command-line-config-test.png" alt-text="Enter configurations for command-line task":::

## Add a Copy files task

You need to add a copy file task to copy the test summary file and Azure Resource Manager template files to the artifact folder. 

1. On the **Tasks** page, select the **+** next to **Agent job 1**. Search for **Copy files**. Then enter the following configurations. By assigning `**` to **Contents**, all files of the test results are copied.

   |Parameter|Input|
   |-|-|
   |Display name|Copy Files to: $(build.artifactstagingdirectory)|
   |Source Folder|`$(system.defaultworkingdirectory)/$(outputPath)/`|
   |Contents| `**` |
   |Target Folder| `$(build.artifactstagingdirectory)`|

2. Expand **Control Options**. Select **Even if a previous task has failed, unless the build was canceled** in **Run this task**.

   :::image type="content" source="media/set-up-cicd-pipeline/copy-config.png" alt-text="Enter configurations for copy task":::

## Add a Publish build artifacts task

1. On the **Tasks** page, select the plus sign next to **Agent job 1**. Search for **Publish build artifacts** and select the option with the black arrow icon.

2. Expand **Control Options**. Select **Even if a previous task has failed, unless the build was canceled** in **Run this task**.

   :::image type="content" source="media/set-up-cicd-pipeline/publish-config.png" alt-text="Enter configurations for publish task":::

## Save and run

Once you have finished adding the npm package, command line, copy files, and publish build artifacts tasks, select **Save & queue**. When you're prompted, enter a save comment and select **Save and run**. You can download the testing results from **Summary** page of the pipeline.

## Check the build and test results

The test summary file and Azure Resource Manager Template files can be found in **Published** folder.

   :::image type="content" source="media/set-up-cicd-pipeline/check-build-test-result.png" alt-text="Check build and test result":::

   :::image type="content" source="media/set-up-cicd-pipeline/check-drop-folder.png" alt-text="Check artifacts":::

## Release with Azure Pipelines

In this section, you learn how to create a release pipeline. 

Open a web browser and navigate to your Azure Stream Analytics Visual Studio Code project.

1. Under **Pipelines** in the left navigation menu, select **Releases**. Then select **New pipeline**.

2. Select **start with an Empty job**.

3. In the **Artifacts** box, select **+ Add an artifact**. Under **Source**, select the build pipeline you created and select **Add**.

   :::image type="content" source="media/set-up-cicd-pipeline/build-artifact.png" alt-text="Enter build pipeline artifact":::

4. Change the name of **Stage 1** to **Deploy job to test environment**.

5. Add a new stage and name it **Deploy job to production environment**.

### Add deploy tasks

> [!NOTE]
> The `Override template parameters` is not applicable for ARM --v2 builds since parameters are passed as objects. To address this, it's recommended to include a PowerShell script in your pipeline to read the parameter file as JSON and make the necessary parameter modifications.
>
> For more guidance on adding the PowerShell script, please refer to [ConvertFrom-Json](/powershell/module/microsoft.powershell.utility/convertfrom-json) and [Update Object in JSON file](https://stackoverflow.com/questions/65753594/update-object-in-json-file-using-powershell).

1. From the tasks dropdown, select **Deploy job to test environment**.

2. Select the **+** next to **Agent job** and search for **ARM template deployment**. Enter the following parameters:

   |Parameter|Value|
   |-|-|
   |Display name| *Deploy myASAProject*|
   |Azure subscription| Choose your subscription.|
   |Action| *Create or update resource group*|
   |Resource group| Choose a name for the test resource group that will contain your Stream Analytics job.|
   |Location|Choose the location of your test resource group.|
   |Template location| Linked artifact|
   |Template| $(System.DefaultWorkingDirectory)/_azure-streamanalytics-cicd-demo-CI-Deploy/drop/myASAProject.JobTemplate.json |
   |Template parameters|$(System.DefaultWorkingDirectory)/_azure-streamanalytics-cicd-demo-CI-Deploy/drop/myASAProject.JobTemplate.parameters.json |
   |Override template parameters|-<arm_template_parameter> "your value". You can define the parameters using **Variables**.|
   |Deployment mode|Incremental|

3. From the tasks dropdown, select **Deploy job to production environment**.

4. Select the **+** next to **Agent job** and search for *ARM template deployment*. Enter the following parameters:

   |Parameter|Value|
   |-|-|
   |Display name| *Deploy myASAProject*|
   |Azure subscription| Choose your subscription.|
   |Action| *Create or update resource group*|
   |Resource group| Choose a name for the production resource group that will contain your Stream Analytics job.|
   |Location|Choose the location of your production resource group.|
   |Template location| *Linked artifact*|
   |Template| $(System.DefaultWorkingDirectory)/_azure-streamanalytics-cicd-demo-CI-Deploy/drop/myASAProject.JobTemplate.json |
   |Template parameters|$(System.DefaultWorkingDirectory)/_azure-streamanalytics-cicd-demo-CI-Deploy/drop/myASAProject.JobTemplate.parameters.json |
   |Override template parameters|-<arm_template_parameter> "your value"|
   |Deployment mode|Incremental|

### Create a release

To create a release, select **Create release** in the top-right corner.

:::image type="content" source="media/set-up-cicd-pipeline/create-release.png" alt-text="Create a release using Azure Pipelines":::

## Next steps

* [Continuous integration and Continuous deployment for Azure Stream Analytics](cicd-overview.md)
* [Automate build, test, and deployment of an Azure Stream Analytics job using CI/CD tools](cicd-tools.md)
