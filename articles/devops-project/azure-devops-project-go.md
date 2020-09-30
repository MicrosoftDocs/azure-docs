---
title: 'Quickstart: Create a CI/CD pipeline for the Go programming language by using Azure DevOps Starter'
description: DevOps Starter makes it easy to get started on Azure. It helps you launch a Go programming language web app on an Azure service in a few quick steps.
ms.prod: devops
ms.technology: devops-cicd
services: vsts
documentationcenter: vs-devops-build
author: mlearned
manager: gwallace
ms.workload: web
ms.tgt_pltfrm: na
ms.topic: quickstart
ms.date: 07/09/2018
ms.author: mlearned
ms.custom: mvc
---

# Create a CI/CD pipeline for Go using Azure DevOps Starter

Configure continuous integration (CI) and continuous delivery (CD) for your Go app by using Azure DevOps Starter. DevOps Starter simplifies the initial configuration of an Azure DevOps build and release pipeline.

If you don't have an Azure subscription, you can get one free through [Visual Studio Dev Essentials](https://visualstudio.microsoft.com/dev-essentials/).

## Sign in to the Azure portal

DevOps Starter creates a CI/CD pipeline in Azure Pipelines. You can create a new Azure DevOps organization or use an existing organization. DevOps Starter also creates Azure resources in the Azure subscription of your choice.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, type **DevOps Starter**, and then select. Click on **Add** to create a new one.

    ![The DevOps Starter dashboard](_img/azure-devops-starter-aks/search-devops-starter.png)

## Select a sample app and Azure service

1. Select the **Go** sample app, and then select **Next**.  
    
1. **Simple Go app** is the default framework. Select **Next**.  The app framework, which you chose previously, dictates the type of Azure service deployment targets that are available for deployment. 
    
1. Leave the default Azure service and select **Next**.

## Configure Azure DevOps and an Azure subscription 

1. Create a new free Azure DevOps organization or choose an existing organization. 

1. Enter a name for your Azure DevOps project. 

1. Select your Azure subscription and location, enter a name for your app, and then select **Done**. After a few minutes, the DevOps Starter dashboard is displayed in the Azure portal. A sample app is set up in a repo in your Azure DevOps organization, a build is executed, and your app is deployed to Azure. 

    The dashboard provides visibility into your code repo, your CI/CD pipeline, and your app in Azure. At the right, select **Browse** to view your running app.

    ![Dashboard view](_img/azure-devops-project-go/dashboardnopreview.png) 

## Commit your code changes and execute the CI/CD

DevOps Starter creates a Git repo in Azure Repos or GitHub. To view the repo and make code changes to your app, do the following:

1. On the DevOps Starter, at the left, select the link for your master branch. The link opens a view to the newly created Git repo.

1. To view the repo clone URL, select **Clone** at the top right. You can clone your Git repo in your favorite IDE. In the next few steps, you can use the web browser to make and commit code changes directly to the master branch.

1. At the left, go to the *views/index.html* file, and then select **Edit**.

1. Make a change to the file. For example, modify some text within one of the div tags.

1. Select **Commit**, and then save your changes.

1. In your browser, go to the DevOps Projects dashboard. A build should be in progress. The changes you made are automatically built and deployed via a CI/CD pipeline.

## Examine the CI/CD pipeline

DevOps Starter automatically configures a full CI/CD pipeline in Azure Repos. Explore and customize the pipeline as needed. To familiarize yourself with the Azure DevOps build and release pipelines, do the following:

1. Go to the DevOps Starter dashboard.

1. At the top, select **Build pipelines**. A browser tab displays the build pipeline for your new project.

1. Point to the **Status** field, and then select the ellipsis (...). A menu displays several options, such as queueing a new build, pausing a build, and editing the build pipeline.

1. Select **Edit**.

1. In this pane, you can examine the various tasks for your build pipeline. The build performs various tasks, such as fetching sources from the Git repo, restoring dependencies, and publishing outputs used for deployments.

1. At the top of the build pipeline, select the build pipeline name.

1. Change the name of your build pipeline to something more descriptive, select **Save & queue**, and then select **Save**.

1. Under your build pipeline name, select **History**. This pane displays an audit trail of your recent changes for the build. Azure DevOps keeps track of any changes made to the build pipeline, and it allows you to compare versions.

1. Select **Triggers**. DevOps Starter automatically creates a CI trigger, and every commit to the repo starts a new build. Optionally, you can choose to include or exclude branches from the CI process.

1. Select **Retention**. Depending on your scenario, you can specify policies to keep or remove a certain number of builds.

1. Select **Build and Release**, and then select **Releases**.  DevOps Starter creates a release pipeline to manage deployments to Azure.

1. Select the ellipsis (...) next to your release pipeline, and then select **Edit**. The release pipeline contains a *pipeline*, which defines the release process.

1. Under **Artifacts**, select **Drop**. The build pipeline you examined previously produces the output that's used for the artifact. 

1. At the right of the **Drop** icon, select **Continuous deployment trigger**. This release pipeline has an enabled CD trigger, which executes a deployment every time a new build artifact is available. Optionally, you can disable the trigger so that your deployments require manual execution. 

1. At the left, select **Tasks**. Tasks are the activities your deployment process performs. In this example, a task was created to deploy to Azure App Service.

1. At the right, select **View releases** to display a history of releases.

1. Select the ellipsis (...) next to a release, and then select **Open**. You can explore several menus, such as a release summary, associated work items, and tests.

1. Select **Commits**. This view shows code commits that are associated with this deployment. 

1. Select **Logs**. The logs contain useful information about the deployment process. You can view them both during and after deployments.

## Clean up resources

When they are no longer needed, you can delete the Azure App Service instance and related resources that you created in this quickstart. To do so, use the **Delete** functionality on the DevOps Starter dashboard.

## Next steps

To learn more about modifying the build and release pipelines to meet the needs of your team, see:

> [!div class="nextstepaction"]
> [Define your multi-stage continuous deployment (CD) pipeline](https://docs.microsoft.com/azure/devops/pipelines/release/define-multistage-release-process?view=vsts)
