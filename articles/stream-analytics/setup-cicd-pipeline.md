---
title: Setup a CI/CD pipeline for Stream Analytics job using Azure DevOps
description: This article describes how to set up a CI/CD pipeline for an Azure Stream Analytics job in Azure DevOps
services: stream-analytics
author: sujie
ms.author: sujie
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: how-to
ms.date: 09/10/2020
---

# Setup a CI/CD pipeline for Stream Analytics job using Azure Pipelines

This article details how to create Azure DevOps [build](https://docs.microsoft.com/azure/devops/pipelines/get-started-designer?view=vsts&tabs=new-nav) and [release](https://docs.microsoft.com/azure/devops/pipelines/release/define-multistage-release-process?view=vsts) pipelines using Stream Analytics CI/CD tools.

You can find below for a sample of a CI/CD pipeline for doing auto build, test and deployment in Azure DevOps.
* [Sample repository](https://dev.azure.com/wenyzou/azure-streamanalytics-cicd-demo) in Azure Pipelines.  
  * [Stream Analytics project source code](https://dev.azure.com/wenyzou/_git/azure-streamanalytics-cicd-demo?path=%2FmyASAProject)
  * [Build pipeline](https://dev.azure.com/wenyzou/_git/azure-streamanalytics-cicd-demo?path=%2FmyASAProject) (auto build, test)
  * [Release pipeline](https://dev.azure.com/wenyzou/azure-streamanalytics-cicd-demo/_release?_a=releases&view=mine&definitionId=2) (auto deploy)

## Presequisites
Stream Analytics Visual Studio Code or Visual Studio projects been developed and commited as source files in Azure DevOps.

[!Note] The instructions below are using a Stream Analytics Visual Studio Code project as example. Please refer to [command lines](./media/setup-cicd/cicd-tools) for working with Stream Analytics Visual Studio projects. 

## Create a build pipeline

Open a web browser and navigate to your project.  

1. Under **Pipelines** in the left navigation menu, select **Builds**. Then select **New pipeline**

   ![Create new Azure Pipeline](./media/setup-cicd/new-pipeline.png)

2. Select **Use the classic editor** to create a pipeline without YAML.

3. Select your source type, team project, and repository. Then select **Continue**.

   ![Select Azure Stream Analytics project](./media/setup-cicd/select-repo.png)

4. On the **Choose a template** page, select **Empty job**.

## Install npm package

1. On the **Tasks** page, select the plus sign next to **Agent job 1**. Enter "npm" in the task search and select **npm**.

   ![Select npm task](./media/setup-cicd/search-npm.png)

2. Give the task a **Display name**. Change the **Command** option to *custom* and enter the following command in **Command and arguments**. Leave the remaining default options.

   ```cmd
   install -g azure-streamanalytics-cicd
   ```

   ![Enter configurations for npm task](./media/setup-cicd/npm-config.png)

## Add build task

1. On the **Variables** page, click **+ Add** in **Pipeline variables** pane. Add the following variables. Set the value according to your preference.

   |Name|Value|
   |-|-|
   |projectRootPath|[YourProjectName]|
   |outputPath|Output|
   |deployPath|Deploy|

2. On the **Tasks** page, select the plus sign next to **Agent job 1**. Search for **Command line**.

3. Give the task a **Display name** and enter the following script. Modify the script with your repository name and project name.

   ```cmd
   azure-streamanalytics-cicd build -project $(projectRootPath)/asaproj.json -outputpath $(projectRootPath)/$(outputPath)/$(deployPath)
   ```

   The screenshot blow uses Stream Analytics Visual Studio Code project as an example.

   ![Enter configurations for command line task](./media/setup-cicd/commandline-config-build.png)

## Add test task

1. On the **Variables** page, click **+ Add** in **Pipeline variables** pane. Add the following variables. Modify the values with your output path and repository name.

   |Name|Value|
   |-|-|
   |testPath|Test|

   ![Add pipeline variables](./media/setup-cicd/pipeline-variables-test.png)

2. On the **Tasks** page, select the plus sign next to **Agent job 1**. Search for **Command line**.

3. Give the task a **Display name** and enter the following script. Modify the script with your project file name and the path to the test configuration file. 
See [automated test instructions](./media/cicd/cicd-tools#automatedtest) for details on how to add and configure test cases.

   ```cmd
   azure-streamanalytics-cicd test -project $(projectRootPath)/asaproj.json -outputpath $(projectRootPath)/$(outputPath)/$(testPath) -testConfigPath $(projectRootPath)/test/testConfig.json 
   ```

   ![Enter configurations for command line task](./media/setup-cicd/commandline-config-test.png)

## Add copy files task

You need to add a copy file task to copy the test summary file and Azure Resource Manager template files to the artifact folder. 

1. On the **Tasks** page, select the **+** next to **Agent job 1**. Search for **Copy files**. Then enter the following configurations. By assigning `**` to **Contents**, all files of testing results are copied.

   |Parameter|Input|
   |-|-|
   |Display name|Copy Files to: $(build.artifactstagingdirectory)|
   |Source Folder|`$(system.defaultworkingdirectory)/$(outputPath)/`|
   |Contents| `**` |
   |Target Folder| `$(build.artifactstagingdirectory)`|

2. Expand **Control Options". Select **Even if a previous task has failed, unless the build was canceled** in **Run this task**.

   ![Enter configurations for copy task](./media/setup-cicd/copy-config.png)


## Add Publish build artifacts task

1. On the **Tasks** page, select the plus sign next to **Agent job 1**. Search for **Publish build artifacts** and select the option with the black arrow icon.

2. Expand **Control Options". Select **Even if a previous task has failed, unless the build was canceled** in **Run this task**.

   ![Enter configurations for copy task](./media/setup-cicd/publish-config.png)

## Save and run

Once you have finished adding the npm package, command line, copy files, and publish build artifacts tasks, select **Save & queue**. When you are prompted, enter a save comment and select **Save and run**. You can download the testing results from **Summary** page of the pipeline.

## Check build and test result

The test summary file and Azure Resource Manager Template files can be found in **Published** folder.

   ![Check build and test result](./media/setup-cicd/check-build-test-result.png)

   ![Check build and test result](./media/setup-cicd/check-drop-folder.png)

## Release with Azure Pipelines

Open a web browser and navigate to your Azure Stream Analytics Visual Studio Code project.

1. Under **Pipelines** in the left navigation menu, select **Releases**. Then select **New pipeline**.

2. Select **start with an Empty job**.

3. In the **Artifacts** box, select **+ Add an artifact**. Under **Source**, select the build pipeline you just created and select **Add**.

   ![Enter build pipeline artifact](./media/setup-cicd/build-artifact.png)

4. Change the name of **Stage 1** to **Deploy job to test environment**.

5. Add a new stage and name it **Deploy job to production environment**.

### Add deploy tasks

1. From the tasks dropdown, select **Deploy job to test environment**.

2. Select the **+** next to **Agent job** and search for **ARM template deployment**. Enter the following parameters:

   |Setting|Value|
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

4. Select the **+** next to **Agent job** and search for *ARM template deployment
*. Enter the following parameters:

   |Setting|Value|
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

### Create release

To create a release, select **Create release** in the top right corner.

![Create a release using Azure Pipelines](./media/setup-cicd/create-release.png)


## Next Steps

* [Continuous integration and Continuous deployment for Azure Stream Analytics](cicd/cicd-overview)
* [Automate build, test and deployment of an Azure Stream Analytics job using CI/CD tools](cicd/cicd-tools)