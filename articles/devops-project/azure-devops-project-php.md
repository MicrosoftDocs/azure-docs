---
title: 'Quickstart: Create a CI/CD pipeline for PHP with Azure DevOps Starter' 
description: DevOps Starter makes it easy to get started on Azure. It helps you launch an app on an Azure service of your choice in few quick steps.
ms.prod: devops
ms.technology: devops-cicd
services: vsts
documentationcenter: vs-devops-build
author: mlearned
manager: gwallace
ms.workload: web
ms.tgt_pltfrm: na
ms.topic: quickstart
ms.date: 03/24/2020
ms.author: mlearned
ms.custom: mvc
---

# Create a CI/CD pipeline for PHP with Azure DevOps Starter

Azure DevOps Starter presents a simplified experience that creates Azure resources and sets up a continuous integration (CI) and continuous delivery (CD) pipeline for your PHP app in Azure Pipelines.  

If you don't have an Azure subscription, you can get one for free through [Visual Studio Dev Essentials](https://visualstudio.microsoft.com/dev-essentials/).

## Sign in to the Azure portal

 DevOps Starter creates a CI/CD pipeline in Azure Pipelines. You can create a free new Azure DevOps organization or use an existing organization. DevOps Projects also creates Azure resources in the Azure subscription of your choice.

1. Sign in to the [Microsoft Azure portal](https://portal.azure.com).

1. In the search box, type **DevOps Starter**, and then select. Click on **Add** to create a new one.

    ![The DevOps Starter dashboard](_img/azure-devops-starter-aks/search-devops-starter.png) 

## Select a sample application and Azure service

1. Select the PHP sample application. The PHP samples include a choice of several application frameworks. The default sample framework is Laravel.
        
1. Leave the default setting, and then select **Next**.  

1. Web App For Containers is the default deployment target. The application framework, which you chose previously, dictates the type of Azure service deployment target that's available here.  Leave the default service, and then select **Next**.
 
## Configure Azure DevOps and an Azure subscription 

1. Create a new Azure DevOps organization or select an existing organization. 

    1. Choose a name for your project in Azure DevOps. 
    
    1. Select your Azure subscription and location, enter a name for your application, and then select **Done**.  
    
    After few minutes, the DevOps Starter dashboard is displayed in the Azure portal. A sample application is set up in a repository in your Azure DevOps organization, a build runs, and your application deploys to Azure. This dashboard provides visibility into your code repository, your CI/CD pipeline, and your application in Azure.  
        
2. Select **Browse** to view your running application.

    ![Dashboard view](_img/azure-devops-project-php/dashboardnopreview.png) 
    
   DevOps Starter automatically configured a CI build and release trigger.  You're now ready to collaborate with a team on a PHP app with a CI/CD process that automatically deploys your latest work to your web site.

## Commit code changes and execute CI/CD

 DevOps Starter creates a Git repository in Azure Repos or GitHub. To view the repository and make code changes to your application, take the following steps:

1. On the left of the DevOps Starter dashboard, select the link for your master branch. This link opens a view to the newly created Git repository.

1. To view the repository clone URL, select **Clone** from the top right of the browser. You can clone your Git repository in your favorite IDE. In the next few steps, use the web browser to make and commit code changes directly to the master branch.

1. On the left, go to the **resources/views/welcome.blade.php** file.

1. Select **Edit**, and then make a change to some of the text.  For example, change some of the text for one of the div tags.

1. Select **Commit**, and then save your changes.

1. In your browser, go to the DevOps Starter dashboard. You should now see a build in progress. The changes you just     made are automatically built and deployed via a CI/CD         pipeline.

## Examine the CI/CD pipeline

 DevOps Starter automatically configures a full CI/CD pipeline in Azure Pipelines. Explore and customize the pipeline as needed. To familiarize yourself with the build and release pipelines, do the following:

1. At the top of the DevOps Starter dashboard, select **Build Pipelines**. This link opens a browser tab and the build pipeline for your new project.

1. Point to the **Status** field, and then select the **ellipsis** (...). A menu displays several options, such as queuing a new build, pausing a build, and editing the build pipeline.

1. Select **Edit**.

1. In this pane, you can examine the various tasks for your build pipeline. The build runs a variety of tasks, such as fetching sources from the Git repository, restoring dependencies, and publishing outputs that are used for deployments.

1. At the top of the build pipeline, select the build pipeline name.

1. Change the name of your build pipeline to something more descriptive, select, **Save & queue**, and then select **Save**.

1. Under your build pipeline name, select **History**.  The **History** pane displays an audit trail of your recent changes for the build. Azure Pipelines keeps track of any changes that are made to the build pipeline, and it allows you to compare versions.

1. Select **Triggers**. DevOps Starter automatically created a CI trigger, and every commit to the repository starts a new build. You can optionally choose to include or exclude branches from the CI process.

1. Select **Retention**. Depending on your scenario, you can specify policies to keep or remove a certain number of builds.

1. Select **Build and Release**, and then select **Releases**.  DevOps Starter creates a release pipeline to manage deployments to Azure.

1. Select the ellipsis (...) next to your release pipeline, and then select **Edit**. The release pipeline contains a pipeline, which defines the release process. 

12. Under **Artifacts**, select **Drop**. The build pipeline you examined in the previous steps produces the output that's used for the artifact. 

1. Next to the **Drop** icon, select the **Continuous deployment trigger**. This release pipeline has an enabled CD trigger, which runs a deployment every time there's a new build artifact available. Optionally, you can disable the trigger so that your deployments require manual execution. 

1. On the left, select **Tasks**. The tasks are the activities that your deployment process performs. In this example, a task was created to deploy to Azure App Service.

1. On the right, select **View releases** to display a history of releases.

1. Select the ellipsis (...) next to one of your releases, and then select  **Open**. There are several menus to explore from this view such as a release summary, associated work items, and tests.

1. Select **Commits**. This view shows code commits that are associated with the specific deployment. 

1. Select **Logs**. The logs contain useful information about the deployment process. They can be viewed both during and after deployments.

## Clean up resources

You can delete Azure App Service and other related resources when you don't need them anymore. Use the **Delete** functionality on the DevOps Starter dashboard.

## Next steps

When you configured your CI/CD process, build and release pipelines were automatically created. You can modify these build and release pipelines to meet the needs of your team. To learn more about the CI/CD pipeline, see this tutorial:

> [!div class="nextstepaction"]
> [Customize CD process](https://docs.microsoft.com/azure/devops/pipelines/release/define-multistage-release-process?view=vsts)
