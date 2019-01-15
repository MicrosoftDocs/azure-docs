---
title: Continuous integration and continuous deployment - Azure IoT Edge | Microsoft Docs
description: Set up continuous integration and continuous deployment - Azure IoT Edge with Azure DevOps, Azure Pipelines
author: shizn
manager: philmea
ms.author: xshi
ms.date: 12/12/2018
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
ms.custom: seodec18
---

# Continuous integration and continuous deployment to Azure IoT Edge

You can easily adopt DevOps with your Azure IoT Edge applications with the built-in Azure IoT Edge tasks in Azure Pipelines. This article demonstrates how you can use the continuous integration and continuous deployment features of Azure Pipelines to build, test, and deploy applications quickly and efficiently to your Azure IoT Edge. 

In this article, you learn how to:
* Create and check in a sample IoT Edge solution.
* Configure continuous integration (CI) to build the solution.
* Configure continuous deployment (CD) to deploy the solution and view responses.

![Diagram - CI and CD branches for development and production](./media/how-to-ci-cd/cd.png)


## Prerequisites

* An Azure Repos repository. If you don't have one, you can [Create a new Git repo in your project](https://docs.microsoft.com/azure/devops/repos/git/create-new-repo?view=vsts&tabs=new-nav).
* An IoT Edge solution committed and pushed to your repository. If you want to create a new sample solution for testing this article, follow the steps in [Develop and debug modules in Visual Studio Code](how-to-vs-code-develop-modules.md) or [Develop and debug C# modules in Visual Studio](how-to-visual-studio-develop-csharp-module.md).
   * For this article, all you need is the solution folder created by the IoT Edge templates in either Visual Studio Code or Visual Studio. You don't need to build, push, deploy, or debug this code before proceeding. You'll set those processes up in Azure Pipelines. 
   * If you're creating a new solution, clone your repository locally first. Then, when you create the solution you can choose to create it directly in the repository folder. You can easily commit and push the new files from there. 

For more information about using Azure Repos, see [Share your code with Visual Studio and Azure Repos](https://docs.microsoft.com/azure/devops/repos/git/share-your-code-in-git-vs?view=vsts)

## Configure Azure Pipelines for continuous integration
In this section, you create a new build pipeline. Configure the pipeline to run automatically when you check in any changes to the sample IoT Edge solution, and retrieve build logs from Azure Pipelines.

>[!NOTE]
>This article uses the Azure DevOps visual designer. Before you follow the steps in this section, turn off the preview feature for the new YAML pipeline creation experience. 
>1. In Azure DevOps, select your profile icon then select **Preview features**.
>2. Turn **New YAML pipeline creation experience** off. 
>
>For more information, see [Create a build pipeline](https://docs.microsoft.com/azure/devops/pipelines/get-started-designer?view=vsts&tabs=new-nav#create-a-build-pipeline).

1. Sign into your Azure DevOps organization (**https://dev.azure.com/{your organization}/**) and open the project that contains your IoT Edge solution repository.

   For this article, we created a repository called **IoTEdgeRepo**. That repository contains **IoTEdgeSolution** which has the code for a module named **filtermodule**. 

   ![Open your DevOps project](./media/how-to-ci-cd/init-project.png)

2. Navigate to Azure Pipelines in your project. Open the **Builds** tab and choose **+ New pipeline**. Or, if you already have build pipelines, choose the **+ New** button. Then select **New build pipeline**.

    ![Create a new build pipeline](./media/how-to-ci-cd/add-new-build.png)

3. Follow the prompts to create your pipeline. 

   1. Provide the source information for your new build pipeline. Select **Azure Repos Git** as the source, then select the project, repository, and branch where your IoT Edge solution code is located. Then, select **Continue**. 

      ![Select your pipeline source](./media/how-to-ci-cd/pipeline-source.png)

   2. Select **Empty job** instead of a template. 

      ![Start with an empty process](./media/how-to-ci-cd/start-with-empty.png)

4. Once your pipeline is created, you are taken to the the pipeline editor. In your pipeline description, choose the correct agent pool based on your target platform: 
    
    * If you would like to build your modules in platform amd64 for Linux containers, choose **Hosted Ubuntu 1604**
    * If you would like to build your modules in platform amd64 for Windows containers, choose **Hosted VS2017** 
    * If you would like to build your modules in platform arm32v7 for Linux containers, you need to set up your own build agent by visiting the **Manage** button.
    
    ![Configure build agent pool](./media/how-to-ci-cd/configure-env.png)

5. Your pipeline comes preconfigured with a job called **Agent job 1**. Select the plus sign **+** to add three tasks to the job: **Azure IoT Edge** twice, and **Publish Build Artifacts** once. (Hover over the name of each task to see the **Add** button.)

   ![Add Azure IoT Edge task](./media/add-iot-edge-task.png)

   When all three tasks are added, your Agent job looks like the following example:
    
   ![Three tasks in the build pipeline](./media/how-to-ci-cd/add-tasks.png)

6. Select the first **Azure IoT Edge** task to edit it. This task builds all modules in the solution with the target platform that you specify, It also generates the **deployment.json** file which tells your IoT Edge devices how to configure the deployment.

   * **Display name**: Accept the default **Azure IoT Edge - Build module images**.
   * **Action**: Accept the default **Build module images**. 
   * **.template.json file**: Select the ellipsis **...** and navigate to the **deployment.template.json** file in the repository that contains your IoT Edge solution. 
   * **Default platform**: Select the appropriate platform for your modules based on your target IoT Edge device. 
   * **Output variables**: The output variables include a reference name that you can use to configure the file path where your deployment.json file will be generated. Set the reference name to **edge**. 

7. Select the second **Azure IoT Edge** task to edit it. This task pushes all module images to the container registry that you select. It also adds your container registry credentials to the **deployment.json** file so that your IoT Edge device can access the module images. 

   * **Display name**: Change the display name to to **Azure IoT Edge - Push module images**
   * **Action**: Use the dropdown list to select **Push module images**. 
   * **Container registry type**: Select the type of container registry that you use to store your module images. Depending on which registry type you choose, the form changes. If you choose **Azure Container Registry**, use the dropdown lists to select the Azure subscription and the name of your container registry. If you choose **Generic Container Registry**, select **New** to create a registry service connection. 
   * **.template.json file**: Select the ellipsis **...** and navigate to the **deployment.template.json** file in the repository that contains your IoT Edge solution. 
   * **Default platform**: Select the same platform as your built module images.
   * **Output variables**: Set the reference name to **edge** to match the file path that you configured in the previous task.

   If you have multiple container registries to host your module images, you need to duplicate this task, select different container registry, and use **Bypass module(s)** in the advanced settings to bypass the images which are not for this specific registry.

8. Select the **Publish Build Artifacts** task to edit it. Provide the file path to the deployment file generated by the build task. Set the **Path to publish** value to `$(edge.DEPLOYMENT_FILE_PATH)`. Leave the other values as their defaults. 

9. Open the **Triggers** tab and check the box to **Enable continuous integration**. Make sure the branch containing your code is included.

    ![Turn on continuous integration trigger](./media/how-to-ci-cd/configure-trigger.png)

10. Save the new build pipeline with **Save** button.


## Configure Azure Pipelines for continuous deployment
In this section, you will create a release pipeline that is configured to run automatically when your build pipeline drops artifacts, and it will show deployment logs in Azure Pipelines.

1. In the **Releases** tab, choose **+ New pipeline**. Or, if you already have release pipelines, choose the **+ New** button and select **+ New release pipeline**.  

    ![Add release pipeline](./media/how-to-ci-cd/add-release-pipeline.png)

    In **Select a template** window, choose **start with an Empty job.**

    ![Start with an empty job](./media/how-to-ci-cd/start-with-empty-job.png)

2. Then the release pipeline would initialize with one stage: **Stage 1**. Rename the **Stage 1** to **QA** and treat it as a test environment. In a typical continuous deployment pipeline, it usually exists multiple stages, you can create more based on your DevOps practice.

    ![Create test environment stage](./media/how-to-ci-cd/QA-env.png)

3. Link the release to the build artifacts. Click **Add** in artifacts area.

    ![Add artifacts](./media/how-to-ci-cd/add-artifacts.png)  
    
    In **Add an artifact page**, choose Source type **Build**. Then select the project and the build pipeline you created. Then select **Add**.

    ![Add a build artifact](./media/how-to-ci-cd/add-an-artifact.png)

    Open continuous deployment trigger so that new release will be created each time a new build is available.

    ![Configure continuous deployment trigger](./media/how-to-ci-cd/add-a-trigger.png)

4. Navigate to **QA stage** and configure the tasks in this stage.

    ![Configure QA tasks](./media/how-to-ci-cd/view-stage-tasks.png)

   Deployment task is platform insensitive, which means you can choose either **Hosted VS2017** or **Hosted Ubuntu 1604** in the **Agent pool** (or any other agent managed by yourself). Select "+" and add one task.

    ![Add tasks for QA](./media/how-to-ci-cd/add-task-qa.png)

5. In the Azure IoT Edge task, navigate to the **Action** dropdown list, select **Deploy to IoT Edge device**. Select your **Azure subscription** and input your **IoT Hub name**. You can choose to deploy to single or multiple devices. If you are deploying to **multiple devices**, you need to specify the device **target condition**. The target condition is a filter to match a set of Edge devices in IoT Hub. If you want to use Device Tags as the condition, you need to update your corresponding devices Tags with IoT Hub device twin. Update the **IoT Edge deployment ID** to "deploy-qa" in advanced settings. Assume you have several IoT Edge devices have been tagged as 'qa', then the task configuration should be as in the following screenshot. 

    ![Deploy to QA](./media/how-to-ci-cd/deploy-to-qa.png)

    Save the new release pipeline with the **Save** button. And then select **Pipeline** to go back to the pipeline.

6. The second stage is for your production environment. To add a new stage "PROD", you can clone the Stage "QA" and rename cloned stage to **PROD**,

    ![Clone stage](./media/how-to-ci-cd/clone-stage.png)

7. Configure the tasks for your production environment. Assume you have several IoT Edge devices have been tagged as 'prod', in the task configurations, update the Target Condition to "prod", and set the deployment ID as "deploy-prod" in advanced settings. Save it with the **Save** button. And then select **Pipeline** to go back to the pipeline.
    
    ![Deploy to production](./media/how-to-ci-cd/deploy-to-prod.png)

7. Currently, our build artifact will be triggered continuously on **QA** stage and then **PROD** stage. But most of the times you need to integrate some test cases on the QA devices and manually approve the bits. Later the bits will be deployed to PROD environment. Set up an approval in PROD stage as the following screenshot.

    1. Open **Pre-deployment conditions** setting panel.

        ![Open pre-deployment conditions](./media/how-to-ci-cd/pre-deploy-conditions.png)    

    2. Set **Enabled** in **Pre-deployment approvals**. And fill in the **Approvers** input. Then save it with **Save** button.
    
        ![Set conditions](./media/how-to-ci-cd/set-pre-deployment-conditions.png)


8. Now your release pipeline has been set up as following screenshot.

    ![Release pipeline](./media/how-to-ci-cd/release-pipeline.png)

    
## Verify IoT Edge CI/CD with the build and release pipelines

In this section, you will trigger a build to make the CI/CD pipeline work. Then verify the deployment succeeds.

1. To trigger a build job, you can either push a commit to source code repository or manually trigger it. You can trigger a build job in your build pipeline by selecting the **Queue** button as in following screenshot.

    ![Manual trigger](./media/how-to-ci-cd/manual-trigger.png)

2. If the build pipeline is completed successfully, it will trigger a release to **QA** stage. Navigate to build pipeline logs and you should see the following screenshot.

    ![Build logs](./media/how-to-ci-cd/build-logs.png)

3. The successful deployment to **QA** stage would trigger a notification to the approver. Navigate to release pipeline, you can see the following screenshot. 

    ![Pending approval](./media/how-to-ci-cd/pending-approval.png)


4. After the approver approve this change, it can be deployed to **PROD**.

    ![Deploy to prod](./media/how-to-ci-cd/approve-and-deploy-to-prod.png)


## Next steps

* Understand the IoT Edge deployment in [Understand IoT Edge deployments for single devices or at scale](module-deployment-monitoring.md)
* Walk through the steps to create, update, or delete a deployment in [Deploy and monitor IoT Edge modules at scale](how-to-deploy-monitor.md).
