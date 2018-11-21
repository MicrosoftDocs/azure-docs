---
<<<<<<< HEAD
title: Create a CI/CD pipeline for .NET with Azure DevOps Projects  | Quickstart
description: DevOps Projects makes it easy to get started with Azure. It helps you launch a .NET app on an Azure service of your choice in few quick steps.
=======
title: 'Quickstart: Create a CI/CD pipeline for .NET with Azure DevOps Projects'
description: Azure DevOps Projects makes it easy to get started on Azure. It helps you launch a .NET app on an Azure service of your choice in few quick steps.
>>>>>>> 256631dbffa6084662397853f04439c19541e60b
ms.prod: devops
ms.technology: devops-cicd
services: azure-devops-project
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


# Create a CI/CD pipeline for .NET with Azure DevOps Projects

<<<<<<< HEAD
Configure continuous integration (CI) and continuous delivery (CD) for your .NET core or ASP.NET application with **Azure DevOps Projects**.  Azure DevOps Projects simplifies the initial configuration of an Azure DevOps Services build and release pipeline.
=======
Configure continuous integration (CI) and continuous delivery (CD) for your .NET core or ASP.NET application with DevOps Projects. DevOps Projects simplifies the initial configuration of a build and release pipeline in Azure Pipelines.
>>>>>>> 256631dbffa6084662397853f04439c19541e60b

If you don't have an Azure subscription, you can get one free through [Visual Studio Dev Essentials](https://visualstudio.microsoft.com/dev-essentials/).

## Sign in to the Azure portal

<<<<<<< HEAD
 Azure DevOps Projects creates a CI/CD pipeline in Azure DevOps Services.  You can create a **new Azure DevOps Services** organization or use an **existing organization**.  Azure DevOps Projects also creates **Azure resources** in the **Azure subscription** of your choice.
=======
DevOps Projects creates a CI/CD pipeline in Azure DevOps. You can create a new Azure DevOps organization or use an  existing organization. DevOps Projects also creates Azure resources in the Azure subscription of your choice.
>>>>>>> 256631dbffa6084662397853f04439c19541e60b

1. Sign in to the [Microsoft Azure portal](https://portal.azure.com).

<<<<<<< HEAD
2. In the left navigation bar, select the **Create a resource** icon. Then search for **DevOps Project**.  Select **Create**.
=======
1. In the left pane, select **Create a resource** icon in the left navigation bar, and then search for **DevOps Projects**.  

3.  Select **Create**.
>>>>>>> 256631dbffa6084662397853f04439c19541e60b

   	![Starting continuous delivery](_img/azure-devops-project-aspnet-core/fullbrowser.png)

## Select a sample application and Azure service

1. Select the .NET sample application. The .NET samples include a choice of either the open-source ASP.NET framework or the cross-platform .NET Core framework.

   	![.NET framework](_img/azure-devops-project-aspnet-core/chooselanguagedotnet.png)

<<<<<<< HEAD
1. Select the **.NET Core** application framework.  This sample is an ASP.NET Core MVC application. When you're done, select **Next**.

1. **Web App on Windows** is the default deployment target.  Optionally, you can choose Web App on Linux or Web App for Containers.  The application framework, which you chose in previous steps, dictates the type of Azure service deployment target that's available here. Leave the default service, and then select **Next**.
=======
1. Select the .NET Core application framework.  
	This sample is an ASP.NET Core MVC application.
	
2. Select **Next**.  
	Web App on Windows is the default deployment target.  Optionally, you can choose Web App on Linux or Web App for Containers.  The application framework, which you chose previously, dictates the type of Azure service deployment target available here.  
	
3. Leave the default service, and then select **Next**.

## Configure Azure DevOps and an Azure subscription 

1. Create a new free Azure DevOps organization or choose an existing organization.
>>>>>>> 256631dbffa6084662397853f04439c19541e60b

	a. Choose a name for your project. 

<<<<<<< HEAD
1. Create a **new** free Azure DevOps Services organization, or choose an **existing** organization.  Choose a **name** for your Azure DevOps project.  Select your **Azure subscription**, **location**, and then choose a **name** for your application. When you're done, select **Done**.

1. In a few minutes, the **DevOps Projects dashboard** loads in the Azure portal.  A sample application is set up in a repository in your Azure DevOps Services organization, a build runs, and your application deploys to Azure. This dashboard provides visibility into your **code repository**, the **Azure DevOps Services CI/CD pipeline**, and your **application in Azure**.  On the right side of the dashboard, select **Browse** to view your running application.
=======
	b. Select your Azure subscription and location, choose a name for your application, and then select **Done**.  
	After a few minutes, the DevOps Projects dashboard is displayed  in the Azure portal. A sample application is set up in a repository in your Azure DevOps organization, a build is executed, and your application is deployed to Azure. This dashboard provides visibility into your code repository, the  CI/CD pipeline, and your application in Azure.
	

2. On the right of the dashboard, select **Browse** to view your running application.
>>>>>>> 256631dbffa6084662397853f04439c19541e60b

   	![Dashboard view](_img/azure-devops-project-aspnet-core/dashboardnopreview.png) 

## Commit code changes and execute CI/CD

<<<<<<< HEAD
 Azure DevOps Projects created a Git repository in your Azure DevOps Services organization or GitHub account. Take the following steps to view the repository and make code changes to your application.

1. On the left side of the DevOps Project dashboard, select the link for your **master** branch.  This link opens a view to the newly created Git repository.

1. To view the repository clone URL, select **Clone** from the top right of the browser. You can clone your Git repository in your favorite IDE. In the next few steps, you can use the web browser to make and commit code changes directly to the master branch.

1. On the left side of the browser, go to the **Views/Home/index.cshtml** file.

1. Select **Edit**, and make a change to the h2 heading. For example, type **Get started right away with the Azure DevOps Project** or make some other change.

    ![Code edits](_img/azure-devops-project-aspnet-core/codechange.png)

1. Choose **Commit**, and then save your changes.

1. In your browser, go to the **Azure DevOps Projects dashboard**. You should now see a build in progress. The changes that you made are automatically built and deployed via an Azure DevOps Services CI/CD pipeline.
=======
 DevOps Projects created a Git repository in Azure Repos or GitHub. To view the repository and make code changes to your application, do the following:

1. On the left of the DevOps Projects dashboard, select the link for your **master** branch.  
This link opens a view to the newly created Git repository.

1. To view the repository clone URL, select **Clone** from the top right of the browser.  
You can clone your Git repository in your favorite IDE.  In the next few steps, you can use the web browser to make and commit code changes directly to the master branch.

1. On the left of the browser, go to the **Views/Home/index.cshtml** file.

1. Select **Edit**, and then make a change to the h2 heading. For example, type **Get started right away with the Azure DevOps Projects** or make some other change.

    ![Code edits](_img/azure-devops-project-aspnet-core/codechange.png)

1. Select **Commit**, and then save your changes.

1. In your browser, go to the Azure DevOps Project dashboard.  You should now see a build is in progress. The changes you made are automatically built and deployed via a CI/CD pipeline.
>>>>>>> 256631dbffa6084662397853f04439c19541e60b

## Examine the CI/CD pipeline

<<<<<<< HEAD
Azure DevOps Projects automatically configured a full Azure DevOps Services CI/CD pipeline in your Azure DevOps Services organization.  Explore and customize the pipeline as needed. Take the following steps to familiarize yourself with the Azure DevOps Services build and release pipelines.

1. Select **Build Pipelines** from the **top** of the Azure DevOps Projects dashboard. This link opens a browser tab and the Azure DevOps Services build pipeline for your new project.

1. Select the **ellipsis**. This action opens a menu where you can start several activities such as queuing a new build, pausing a build, and editing the build pipeline.
=======
In the previous step, Azure DevOps Projects automatically configured a full CI/CD pipeline. Explore and customize the pipeline as needed. Take the following steps to familiarize yourself with the Azure DevOps build and release pipelines.

1. At the top of the DevOps Projects dashboard, select **Build Pipelines**.  
This link opens a browser tab and the Azure DevOps build pipeline for your new project.

1. Select the ellipsis (...).  This action opens a menu where you can start several activities such as queuing a new build, pausing a build, and editing the build pipeline.
>>>>>>> 256631dbffa6084662397853f04439c19541e60b

1. Select **Edit**.

    ![Build pipeline](_img/azure-devops-project-aspnet-core/builddef.png)

<<<<<<< HEAD
1. From this view, **examine the various tasks** for your build pipeline.  The build performs various tasks such as fetching sources from the Azure Repos Git repository, restoring dependencies, and publishing outputs that are used for deployments.
=======
1. In this pane, you can examine the various tasks for your build pipeline.  
 The build performs various tasks, such as fetching sources from the Git repository, restoring dependencies, and publishing outputs used that are used for deployments.

1. At the top of the build pipeline, select the build pipeline name.

1. Change the name of your build pipeline to something more descriptive, select **Save & queue**, and then select **Save**.
>>>>>>> 256631dbffa6084662397853f04439c19541e60b

1. Under your build pipeline name, select **History**.   
In the **History** pane, you see an audit trail of your recent changes for the build.  Azure Pipelines keeps track of any changes that are made to the build pipeline, and it allows you to compare versions.

<<<<<<< HEAD
1. Change the **name** of your build pipeline to something more descriptive. Select **Save & queue**, and then select **Save**.

1. Under your build pipeline name, select **History**. You see an audit trail of your recent changes for the build.  Azure DevOps Services keeps track of any changes that are made to the build pipeline, which means you can compare versions.

1. Select **Triggers**. Azure DevOps Projects automatically created a CI trigger, and every commit to the repository creates a new build.  You can optionally choose to include or exclude branches from the CI process.
=======
1. Select **Triggers**.  
DevOps Projects automatically created a CI trigger, and every commit to the repository starts a new build.  You can optionally choose to include or exclude branches from the CI process.

1. Select **Retention**.  
Depending on your scenario, you can specify policies to keep or remove a certain number of builds.

1. Select **Build and Release**, then select **Releases**.  
DevOps Projects creates a release pipeline to manage deployments to Azure.
>>>>>>> 256631dbffa6084662397853f04439c19541e60b

1.  On the left, select the ellipsis (...) next to your release pipeline, and then select **Edit**.  
The release pipeline contains a pipeline, which defines the release process.  

<<<<<<< HEAD
1. Select **Build and Release**, and then select **Releases**. Azure DevOps Projects created an Azure DevOps Services release pipeline to manage deployments to Azure.

1. On the left side of the browser, select the **ellipsis** next to your release pipeline, and then select **Edit**.

1. The release pipeline contains a **pipeline**, which defines the release process. Under **Artifacts**, select **Drop**. The build pipeline that you examined in the previous steps produces the output that's used for the artifact. 

1. To the right of the **Drop** icon, select the **Continuous deployment trigger**.  This release pipeline has an enabled CD trigger, which runs a deployment every time there is a new build artifact available. Optionally, you can disable the trigger so that your deployments require manual execution. 

1. On the left side of the browser, select **Tasks**. The tasks are the activities your deployment process performs. In this example, a task was created to deploy to **Azure App service**.

1. On the right side of the browser, select **View releases**. This view shows a history of releases.

1. Select the **ellipsis** next to one of your releases, and then select **Open**. There are several menus to explore from this view, such as a release summary, associated work items, and tests.

1. Select **Commits**. This view shows code commits that are associated with the specific deployment. 

1. Select **Logs**. The logs contain useful information about the deployment process.  They can be viewed both during and after deployments.

## Clean up resources

You can delete Azure App Service and related resources that were created in this quickstart by using the **Delete** function from the Azure DevOps Project dashboard.
=======
1. Under **Artifacts**, select **Drop**.  The build pipeline you examined in the previous steps produces the output used for the artifact. 

1. Next to the **Drop** icon, select the **Continuous deployment trigger**.  
This release pipeline has an enabled CD trigger, which runs a deployment every time there is a new build artifact available. Optionally, you can disable the trigger so that your deployments require manual execution.  

1. On the left, select **Tasks**.   
The tasks are the activities that your deployment process performs. In this example, a task was created to deploy to Azure App Service.

1. On the right, select **View releases**. This view shows a history of releases.

1. Select the ellipsis (...) next to one of your releases, and then select **Open**.  
There are several menus to explore, such as a release summary, associated work items, and tests.


1. Select **Commits**.   
This view shows code commits that are associated with the specific deployment. 

1. Select **Logs**.  
The logs contain useful information about the deployment process. They can be viewed both during and after deployments.


## Clean up resources

You can delete Azure App Service and other related resources that you created when you don't need them anymore. Use the **Delete** functionality on the DevOps Projects dashboard.
>>>>>>> 256631dbffa6084662397853f04439c19541e60b

## Next steps

To learn more about modifying the build and release pipelines to meet the needs of your team, see this tutorial:

> [!div class="nextstepaction"]
> [Customize CD process](https://docs.microsoft.com/azure/devops/pipelines/release/define-multistage-release-process?view=vsts)

## Videos

> [!VIDEO https://www.youtube.com/embed/itwqMf9aR0w]
