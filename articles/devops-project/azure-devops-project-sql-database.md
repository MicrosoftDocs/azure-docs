---
title: Deploy your ASP.NET App and Azure SQL Database with the Azure DevOps Project | Azure DevOps Services Tutorial
description: The DevOps Project makes it easy to get started on Azure. The Azure DevOps Project makes it easy to deploy your ASP.NET with Azure SQL Database in a few quick steps.
ms.author: mlearned
ms.manager: douge
ms.prod: devops
ms.technology: devops-cicd
ms.topic: tutorial
ms.date: 07/09/2018
author: mlearned
monikerRange: 'vsts'
---


# Tutorial:  Deploy your ASP.NET App and Azure SQL Database with the Azure DevOps Project

The Azure DevOps Project presents a simplified experience where you bring your existing code and Git repository, or choose from one of the sample applications to create a continuous integration (CI) and continuous delivery (CD) pipeline to Azure.  The DevOps Project automatically creates Azure resources such as an Azure SQL Database, creates and configures a release pipeline in Azure DevOps that includes a build pipeline for CI, sets up a release pipeline for CD, and then creates an Azure Application Insights resource for monitoring.

You will:

> [!div class="checklist"]
> * Create an Azure DevOps Project for an ASP.NET App and Azure SQL Database
> * Configure Azure DevOps Services and an Azure subscription 
> * Examine the Azure DevOps Services CI pipeline
> * Examine the Azure DevOps Services CD pipeline
> * Commit changes to Azure DevOps Services and automatically deploy to Azure
> * Connect to the Azure SQL Server Database 
> * Clean up resources

## Prerequisites

* An Azure subscription. You can get one free through [Visual Studio Dev Essentials](https://visualstudio.microsoft.com/dev-essentials/).

## Create an Azure DevOps Project for an ASP.NET App and Azure SQL Database

The Azure DevOps Project creates a CI/CD pipeline in Azure.  You can create a **new Azure DevOps Services** organization or use an **existing organization**.  The Azure DevOps Project also creates **Azure resources** such as an Azure SQL Database in the **Azure subscription** of your choice.

1. Sign into the [Microsoft Azure portal](https://portal.azure.com).

1. Choose the **Create a resource** icon in the left navigation bar, then search for **DevOps Project**.  Choose **Create**.

   	![Starting Continuous Delivery](_img/azure-devops-project-github/fullbrowser.png)

1. Select **.NET**, and then choose **Next**.

1. For **Choose an application Framework**, select **ASP.NET**.

1. Select **Add a database**, then choose **Next**.  

1. The application framework, which you chose on the previous steps, dictates the type of Azure service deployment target available here.  Select **Next**.

## Configure Azure DevOps Services and an Azure subscription

1. Create a **new** Azure DevOps Services organization or choose an **existing** organization.  Choose a **name** for your Azure DevOps project.  

1. Select your **Azure subscription**.

1. Optionally, select the **Change** link to see additional Azure configuration settings, and identify the **username** in the **Database Server Login Details** section.  **Store** the **username** for future steps in this tutorial.
 
1. If you performed the step above, exit the Azure configuration area, and choose **Done**.  Otherwise just select **Done**.

1. It will take several minutes for the process to complete.  Once complete, the Azure DevOps **Project dashboard** loads in the Azure portal.  You can also navigate to the **Azure DevOps Project Dashboard** directly from **All resources** in the **Azure portal**.  On the right side of the dashboard, select **Browse** to view your running application.
	
## Examine the Azure DevOps Services CI pipeline

The Azure DevOps Project automatically configures a full Azure CI/CD pipeline in your Azure DevOps Services organization.  You can explore and customize the pipeline.  Follow the steps below to familiarize yourself with the Azure DevOps Services build pipeline.

1. Navigate to the **Azure DevOps Project dashboard**.

1. Select **Build Pipelines** from the **top** of the **Azure DevOps Project dashboard**.  This link opens a browser tab and opens the Azure DevOps Services build pipeline for your new project.

1. Move the mouse cursor to the right of the build pipeline next to the **Status** field. Select the **ellipsis** that appears.  This action opens a menu where you can perform several activities such as **queue a new build**, **pause a build**, and **edit the build pipeline**.

1. Select **Edit**.

1. From this view, **examine the various tasks** for your build pipeline.  The build executes various tasks such as fetching sources from the Azure DevOps Services Git repository, restoring dependencies, and publishing outputs used for deployments.

1. At the top of the build pipeline, select the **build pipeline name**.

1. Change the **name** of your build pipeline to something more descriptive.  Select **Save & queue**, then select **Save**.

1. Under your build pipeline name, select **History**.  You see an audit trail of your recent changes for the build.  Azure DevOps Services keeps track of any changes made to the build pipeline and allows you to compare versions.

1. Select **Triggers**.  The Azure DevOps Project automatically created a CI trigger, and every commit to the repository starts a new build.  You can optionally choose to include or exclude branches from the CI process.

1. Select **Retention**.  Based on your scenario, you can specify policies to keep or remove a certain number of builds.

## Examine the Azure DevOps Services CD pipeline

The Azure DevOps Project automatically creates and configures the necessary steps to deploy from your Azure DevOps Services organization to your Azure subscription.  These steps include configuring an Azure service connection to authenticate Azure DevOps Services to your Azure subscription.  The automation also creates an Azure DevOps Services Release Definition, and the release provides the CD to the Azure.  Follow the steps below to examine more about the Azure DevOps Services Release Definition.

1. Select **Build and Release**, then choose **Releases**.  The Azure DevOps Project created an Azure DevOps Services release pipeline to manage deployments to Azure.

1. On the left-hand side of the browser, select the **ellipsis** next to your release pipeline, then choose **Edit**.

1. The release pipeline contains a **pipeline**, which defines the release process.  Under **Artifacts**, select **Drop**.  The build pipeline you examined in the previous steps produces the output used for the artifact. 

1. To the right-hand side of the **Drop** icon, select the **Continuous deployment trigger** **icon** (which appears as a lightning bolt.)  This release pipeline has an enabled CD trigger.  The trigger starts a deployment every time there is a new build artifact available.  Optionally, you can disable the trigger, so your deployments will then require manual execution. 

1. The Azure DevOps Project set up a random SQL password, and used this password for the release pipeline.  On the left-hand side of the browser, select **Variables**. 

1. **Only perform this step if you changed the SQL Server password.**  There is a single **Password** variable.  To the right of the **Value** text box, select the **padlock** icon.  **Enter** the new password, and then select **Save**.

1. On the left-hand side of the browser, select **Tasks**, and then choose your **environment**.  

1. The tasks are the activities your deployment process performs, and they are grouped in **Phases**.  There is a single phase for this release pipeline.  The phase contains an **Azure App Service Deploy** and **Azure SQL Database Deployment** task.

1. Select the **Execute Azure SQL** task and examine the various properties used for the SQL deployment.  Under **Deployment Package**, notice the task uses a **SQL DACPAC file**.

1. On the right-hand side of the browser, select **View releases**.  This view shows a history of releases.

1. Select the **ellipsis** next to one of your releases, and choose **Open**.  There are several menus to explore from this view such as a **release summary**, **associated work items**, and **Tests**.

1. Select **Commits**.  This view shows code commits associated with the specific deployment. You can compare releases to view the commit differences between deployments.

1. Select **Logs**.  The logs contain useful information about the deployment process.  They can be viewed both during and after deployments.

## Commit changes to Azure DevOps Services and automatically deploy to Azure 

 > [!NOTE]
 > The steps below test the CI/CD pipeline with a simple text change.  You may optionally make a SQL Server Schema change to the table to test the SQL deploy process.

You're now ready to collaborate with a team on your app with a CI/CD process that automatically deploys your latest work to your web site.  Each change to the Azure DevOps Services Git repo starts a build in Azure DevOps Services, and an Azure DevOps Services CD pipeline executes a deployment to Azure.  Follow the steps below, or use other techniques to commit changes to your repository.  The code changes start the CI/CD process and automatically deploys your new changes to Azure.

1. Select **Code** from the Azure DevOps Services menu, and navigate to your repository.

1. Navigate to the **SampleWebApplication\Views\Home** directory, then select the **ellipsis** next to the **Index.cshtml** file, and then choose **Edit**.

1. Make a change to the file such as some text inside one of the **div tags**.  At the top right, select **Commit**.  Select **Commit** again to push your change. 

1. In a few moments, a **build starts in Azure DevOps Services**, and then a release executes to deploy the changes.  You can monitor the **build status** with the DevOps Project dashboard or in the browser with your Azure DevOps Services organization.

1. Once the release completes, **refresh your application** in the browser to verify you see your changes.

## Connect to the Azure SQL Server Database

You need appropriate permissions to connect to the Azure SQL Database.

1. From the Azure DevOps Project dashboard, select the **SQL Database** to navigate to the management page for the SQL DB.
   
1. Select **Set server firewall**, and then select **+ Add client IP**.  

1. Select **Save**.  Your client IP is now allowed access to the **SQL Server Azure resource**.

1. Navigate back to the **SQL Database** blade. 

1. On the right side of the screen, select the **Server name** to navigate to the configuration page for the **SQL Server**.

1. Select **Reset password**, enter a password for the **SQL Server admin login**, and then select **Save**.  **Keep** this password for future steps in this tutorial.

1. You may now optionally use client tools such as **SQL Server Management Studio** or **Visual Studio** to connect to the Azure SQL Server and Database.  Use the **Server name** property to connect.

   If you did not change the DB username while initially configuring the DevOps Project, your username is the local-part of your email address.  For example, if your email address is johndoe@microsoft.com, your username is johndoe.

 > [!NOTE]
 > If you change your password for the SQL login, you need to change the password in the Azure DevOps Services release pipeline variable as described in the section **Examine the Azure DevOps Services CD pipeline**

## Clean up resources

 > [!NOTE]
 > The steps below will permanently delete resources.  Only use this functionality after carefully reading the prompts.

If you are testing, you can clean up resources to avoid accruing billing charges.  When no longer needed, you can delete the Azure SQL Database and related resources created in this tutorial by using the **Delete** functionality on the Azure DevOps Project dashboard.  **Be careful**, as the delete functionality destroys the data created by the Azure DevOps Project in both Azure and Azure DevOps Services, and you will not be able to retrieve it once it's gone.

1. From the **Azure portal**, navigate to the **Azure DevOps Project**.
2. On the **top right** side of the dashboard, select **Delete**.  After reading the prompt, select **Yes** to **permanently delete** the resources.

## Next steps

You can optionally modify these build and release pipelines to meet the needs of your team. You can also use this CI/CD pattern as a template for your other projects.  You learned how to:

> [!div class="checklist"]
> * Create an Azure DevOps Project for an ASP.NET App and Azure SQL Database
> * Configure Azure DevOps Services and an Azure subscription 
> * Examine the Azure DevOps Services CI pipeline
> * Examine the Azure DevOps Services CD pipeline
> * Commit changes to Azure DevOps Services and automatically deploy to Azure
> * Connect to the Azure SQL Server Database 
> * Clean up resources

To learn more about the Azure pipeline see this tutorial:

> [!div class="nextstepaction"]
> [Customize CD process](https://docs.microsoft.com/azure/devops/pipelines/release/define-multistage-release-process?view=vsts)

## Videos

> [!VIDEO https://channel9.msdn.com/Events/Build/2018/BRK3308/player]