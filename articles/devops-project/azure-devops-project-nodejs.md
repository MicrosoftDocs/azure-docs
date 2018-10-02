---
title: Create a CI/CD pipeline for Node.js with the Azure DevOps Project | Quickstart
description: The DevOps Project makes it easy to get started on Azure. It helps you launch an app on an Azure service of your choice in few quick steps.
ms.prod: devops
ms.technology: devops-cicd
services: vsts
documentationcenter: vs-devops-build
author: mlearned
manager: douge
editor: ''
ms.assetid:
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.date: 07/09/2018
ms.author: mlearned
ms.custom: mvc
monikerRange: 'vsts'
---


# Create a CI/CD pipeline for Node.js with the Azure DevOps Project

The Azure DevOps Project presents a simplified experience which creates Azure resources and sets up a continuous integration (CI) and continuous delivery (CD) pipeline for your Node.js app in Azure DevOps Services.  

If you don't have an Azure subscription, you can get one free through [Visual Studio Dev Essentials](https://visualstudio.microsoft.com/dev-essentials/).

## Sign in to the Azure portal

The Azure DevOps Project creates a CI/CD pipeline in Azure.  You can create a free **new Azure DevOps Services** organization or use an **existing organization**.  The DevOps Project also creates **Azure resources** in the **Azure subscription** of your choice.

1. Sign into the [Microsoft Azure portal](https://portal.azure.com).

1. Choose the **Create a resource** icon in the left navigation bar, then search for **DevOps Project**.  Choose **Create**.

   	![Starting Continuous Delivery configuration](_img/azure-devops-project-nodejs/fullbrowser.png)

## Select a sample application and Azure service

1. Select the **Node.js** sample application.  The Node.js samples include a choice of several application frameworks.

1. The default sample framework is **Express.js**. Leave the default setting, and choose **Next**.  

1. **Web App on Windows** is the default deployment target.  The application framework, which you chose on the previous steps, dictates the type of Azure service deployment target available here.  Leave the default service, and then choose **Next**.
 
## Configure Azure DevOps Services and an Azure subscription 

1. Create a **new** Azure DevOps Services organization or choose an **existing** organization.  Choose a **name** for your Azure DevOps project.  Select your **Azure subscription**, **location**, and choose a **name** for your application.  When you're done, choose **Done**.

1. In a few minutes, the **Azure DevOps Project dashboard** loads in the Azure portal.  A sample application is set up in a repository in your Azure DevOps Services organization, a build executes, and your application deploys to Azure.  This dashboard provides visibility into your **code repository**, **Azure CI/CD pipeline**, and your **application in Azure**.  On the right side of the dashboard, select **Browse** to view your running application.

   	![Dashboard view](_img/azure-devops-project-nodejs/dashboardnopreview.png) 
	
The Azure DevOps Project automatically configures a CI build and release trigger.  You're now ready to collaborate with a team on a Node.js app with a CI/CD process that automatically deploys your latest work to your web site.

## Commit code changes and execute CI/CD

The Azure DevOps Project created a Git repository in your Azure DevOps Services organization or GitHub account.  Follow the steps below to view the repository and make code changes to your application.

1. On the left-hand side of the DevOps Project dashboard, select the link for your **master** branch.  This link opens a view to the newly created Git repository.

1. To view the repository clone URL, select **Clone** from the top right of the browser. You can clone your Git repository in your favorite IDE.  In the next few steps, you can use the web browser to make and commit code changes directly to the master branch.

1. On the left-hand side of the browser, navigate to the **views/index.pug** file.

1. Select **Edit**, and make a change to the h2 heading.  For example, type **Get started right away with the Azure DevOps Project** or make some other change.

1. Choose **Commit**, then save your changes.

1. In your browser, navigate to the **Azure DevOps Project dashboard**.  You should now see a build is in progress.  The changes you just made are automatically built and deployed via an Azure CI/CD pipeline.

## Examine the Azure CI/CD pipeline

The Azure DevOps Project automatically configured a full Azure CI/CD pipeline in your Azure DevOps Services organization.  Explore and customize the pipeline as needed.  Follow the steps below to familiarize yourself with the Azure DevOps Services build and release pipelines.

1. Select **Build Pipelines** from the **top** of the Azure DevOps Project dashboard.  This link opens a browser tab and opens the Azure DevOps Services build pipeline for your new project.

1. Move the mouse cursor to the right of the build pipeline next to the **Status** field. Select the **ellipsis** that appears.  This action opens a menu where you can start several activities such as queue a new build, pause a build, and edit the build pipeline.

1. Select **Edit**.

1. From this view, **examine the various tasks** for your build pipeline.  The build executes various tasks such as fetching sources from the Git repository, restoring dependencies, and publishing outputs used for deployments.

1. At the top of the build pipeline, select the **build pipeline name**.

1. Change the **name** of your build pipeline to something more descriptive.  Select **Save & queue**, then select **Save**.

1. Under your build pipeline name, select **History**.  You see an audit trail of your recent changes for the build.  Azure DevOps Services keeps track of any changes made to the build pipeline, and allows you to compare versions.

1. Select **Triggers**.  The Azure DevOps Project automatically created a CI trigger, and every commit to the repository starts a new build.  You can optionally choose to include or exclude branches from the CI process.

1. Select **Retention**.  Based on your scenario, you can specify policies to keep or remove a certain number of builds.

1. Select **Build and Release**, then choose **Releases**.  The Azure DevOps Project created an Azure DevOps Services release pipeline to manage deployments to Azure.

1. On the left-hand side of the browser, select the **ellipsis** next to your release pipeline, then choose **Edit**.

1. The release pipeline contains a **pipeline**, which defines the release process.  Under **Artifacts**, select **Drop**.  The build pipeline you examined in the previous steps produces the output used for the artifact. 

1. To the right-hand side of the **Drop** icon, select the **Continuous deployment trigger**.  This release pipeline has an enabled CD trigger, which executes a deployment every time there is a new build artifact available.  Optionally, you can disable the trigger, so your deployments require manual execution. 

1. On the left-hand side of the browser, select **Tasks**.  The tasks are the activities your deployment process performs.  In this example, a task was created to deploy to **Azure App service**.

1. On the right-hand side of the browser, select **View releases**.  This view shows a history of releases.

1. Select the **ellipsis** next to one of your releases, and choose **Open**.  There are several menus to explore from this view such as a release summary, associated work items, and tests.

1. Select **Commits**.  This view shows code commits associated with the specific deployment. 

1. Select **Logs**.  The logs contain useful information about the deployment process.  They can be viewed both during and after deployments.

## Clean up resources

When no longer needed, you can delete the Azure App service and related resources created in this quickstart by using the **Delete** functionality on the Azure DevOps Project dashboard.

## Next steps

When you configured your CI/CD process in this quickstart, a build and release pipeline were automatically created in your Azure DevOps Project. You can modify these build and release pipelines to meet the needs of your team. To learn more see this tutorial:

> [!div class="nextstepaction"]
> [Customize CD process](https://docs.microsoft.com/azure/devops/pipelines/release/define-multistage-release-process?view=vsts)

## Videos

> [!VIDEO https://www.youtube.com/embed/3etwjubReJs]
