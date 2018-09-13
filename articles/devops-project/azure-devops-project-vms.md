---
title: Deploy your ASP.NET App to Azure Virtual Machines with the Azure DevOps Project | Azure DevOps Services Tutorial
description: The DevOps Project makes it easy to get started on Azure. The Azure DevOps Project makes it easy to deploy your ASP.NET App to Azure Virtual Machines in a few quick steps.
ms.author: mlearned
ms.manager: douge
ms.prod: devops
ms.technology: devops-cicd
ms.topic: tutorial
ms.date: 07/09/2018
author: mlearned
monikerRange: 'vsts'
---


# Tutorial:  Deploy your ASP.NET App to Azure Virtual Machines with the Azure DevOps Project

The Azure DevOps Project presents a simplified experience where you bring your existing code and Git repository, or choose from one of the sample applications to create a continuous integration (CI) and continuous delivery (CD) pipeline to Azure.  The DevOps Project automatically creates Azure resources such as a new Azure virtual machine, creates and configures a release pipeline in Azure DevOps that includes a build pipeline for CI, sets up a release pipeline for CD, and then creates an Azure Application Insights resource for monitoring.

You will:

> [!div class="checklist"]
> * Create an Azure DevOps Project for an ASP.NET App
> * Configure Azure DevOps Services and an Azure subscription 
> * Examine the Azure DevOps Services CI pipeline
> * Examine the Azure DevOps Services CD pipeline
> * Commit changes to Azure DevOps Services and automatically deploy to Azure
> * Configure Azure Application Insights monitoring
> * Clean up resources

## Prerequisites

* An Azure subscription. You can get one free through [Visual Studio Dev Essentials](https://visualstudio.microsoft.com/dev-essentials/).

## Create an Azure DevOps Project for an ASP.NET App

The Azure DevOps Project creates a CI/CD pipeline in Azure.  You can create a **new Azure DevOps Services** organization or use an **existing organization**.  The Azure DevOps Project also creates **Azure resources** such as virtual machines in the **Azure subscription** of your choice.

1. Sign into the [Microsoft Azure portal](https://portal.azure.com).

1. Choose the **+ New** icon in the left navigation bar, then search for **DevOps Project**.  Choose **Create**.

   	![Starting Continuous Delivery](_img/azure-devops-project-github/fullbrowser.png)

1. Select **.NET**, and then choose **Next**.

1. For **Choose an application Framework**, select **ASP.NET**, and then choose **Next**. 

1. The application framework, which you chose on the previous steps, dictates the type of Azure service deployment target available here.  Select the **Virtual machine**, and then choose **Next**.

## Configure Azure DevOps Services and an Azure subscription

1. Create a **new** Azure DevOps Services organization or choose an **existing** organization.  Choose a **name** for your Azure DevOps project.  

1. Select your **Azure subscription Services**.  You can optionally select the **Change** link, and then enter more configuration details such as changing the location of the Azure resources.
 
1. Enter a **Virtual machine name**, **User name**, and **Password** for your new Azure virtual machine resource, and then choose **Done**.

1. It will take several minutes for the Azure virtual machine to be ready.  A sample ASP.NET application is set up in a repository in your Azure DevOps Services organization, a build and release executes, and your application deploys to the newly created Azure VM.  

	Once complete, the Azure DevOps **project dashboard** loads in the Azure portal.  You can also navigate to the **Azure DevOps Project Dashboard** directly from **All resources** in the **Azure portal**.  

	This dashboard provides visibility into your Azure DevOps Services **code repository**, **Azure CI/CD pipeline**, and your running **application in Azure**.    

   	![Dashboard view](_img/azure-devops-project-vms/dashboardnopreview.png)

1. The Azure DevOps Project automatically configures a CI build and release trigger that automatically deploys any code changes to your repository.  You can further configure additional options in Azure DevOps.  On the right side of the dashboard, select **Browse** to view your running application.
	
## Examine the Azure DevOps Services CI pipeline
 
The Azure DevOps Project automatically configures a full Azure CI/CD pipeline in your Azure DevOps Services organization.  You can explore and customize the pipeline.  Follow the steps below to familiarize yourself with the Azure DevOps Services build pipeline.

1. Select **Build Pipelines** from the **top** of the **Azure DevOps Project dashboard**.  This link opens a browser tab and opens the Azure DevOps Services build pipeline for your new project.

1. Move the mouse cursor to the right of the build pipeline next to the **Status** field. Select the **ellipsis** that appears.  This action opens a menu where you can perform several activities such as **queue a new build**, **pause a build**, and **edit the build pipeline**.

1. Select **Edit**.

1. From this view, **examine the various tasks** for your build pipeline.  The build executes various tasks such as fetching sources from the Azure DevOps Services Git repository, restoring dependencies, and publishing outputs used for deployments.

1. At the top of the build pipeline, select the **build pipeline name**.

1. Change the **name** of your build pipeline to something more descriptive.  Select **Save & queue**, then select **Save**.

1. Under your build pipeline name, select **History**.  You see an audit trail of your recent changes for the build.  Azure DevOps Services keeps track of any changes made to the build pipeline and allows you to compare versions.

1. Select **Triggers**.  The Azure DevOps Project automatically created a CI trigger, and every commit to the repository starts a new build.  Optionally choose to include or exclude branches from the CI process.

1. Select **Retention**.  Based on your scenario, you can specify policies to keep or remove a certain number of builds.

## Examine the Azure DevOps Services CD pipeline

The Azure DevOps Project automatically creates and configures the necessary steps to deploy from your Azure DevOps Services organization to your Azure subscription.  These steps include configuring an Azure service connection to authenticate Azure DevOps Services to your Azure subscription.  The automation also creates an Azure DevOps Services CD pipeline, and this provides the CD to the Azure virtual machine.  Follow the steps below to examine more about the Azure DevOps Services CD pipeline.

1. Select **Build and Release**, then choose **Releases**.  The Azure DevOps Project created an Azure DevOps Services release pipeline to manage deployments to Azure.

1. On the left-hand side of the browser, select the **ellipsis** next to your release pipeline, then choose **Edit**.

1. The release pipeline contains a **pipeline**, which defines the release process.  Under **Artifacts**, select **Drop**.  The build pipeline you examined in the previous steps produces the output used for the artifact. 

1. To the right-hand side of the **Drop** icon, select the **Continuous deployment trigger** **icon** (which appears as a lightning bolt.)  This release pipeline has an enabled CD trigger.  The trigger starts a deployment every time there is a new build artifact available.  Optionally, you can disable the trigger, so your deployments will then require manual execution. 

1. On the left-hand side of the browser, select **Tasks**, and then choose your **environment**.  

1. The tasks are the activities your deployment process executes, and they are grouped in **Phases**.  There are two **Phases** for this release pipeline.  The first phase contains an **Azure Resource Group Deployment** task that configures the VM for deployment and adds the new VM to an **Azure DevOps Deployment Group**.  The VM deployment group in Azure DevOps manages logical groups of **deployment target** machines.

1. In this second phase, a **IIS Web App Manage** task was created to create an IIS Website on the VM.  A second **IIS Web App Deploy** task was created to deploy the site.

1. On the right-hand side of the browser, select **View releases**.  This view shows a history of releases.

1. Select the **ellipsis** next to one of your releases, and choose **Open**.  There are several menus to explore from this view such as a **release summary**, **associated work items**, and **Tests**.

1. Select **Commits**.  This view shows code commits associated with the specific deployment. Compare releases to view the commit differences between deployments.

1. Select **Logs**.  The logs contain useful information about the deployment process.  They can be viewed both during and after deployments.

## Commit changes to Azure DevOps Services and automatically deploy to Azure 

You're now ready to collaborate with a team on your app with a CI/CD process that automatically deploys your latest work to your web site.  Each change to the Azure DevOps Services Git repo starts a build in Azure DevOps Services, and an Azure DevOps Services CD pipeline executes a deployment to your Azure VM.  Follow the steps below, or use other techniques to commit changes to your repository.  The code changes initiate the CI/CD process and automatically deploys your new changes to the IIS website on the Azure VM.

1. Select **Code** from the Azure DevOps Services menu, and navigate to your repository.

1. Navigate to the **Views\Home** directory, then select the **ellipsis** next to the **Index.cshtml** file, and then choose **Edit**.

1. Make a change to the file such as some text inside one of the **div tags**.  At the top right, select **Commit**.  Select **Commit** again to push your change. 

1. In a few moments, a **build starts in Azure DevOps Services**, and then a release executes to deploy the changes.  Monitor the **build status** with the DevOps Project dashboard or in the browser with your Azure DevOps Services organization.

1. Once the release completes, **refresh your application** in the browser to verify you see your changes.

## Configure Azure Application Insights monitoring

With Azure Application insights, you can easily monitor your application's performance and usage.  The Azure DevOps Project automatically configured an Application Insights resource for your application.  You can further configure various alerts and monitoring capabilities as needed.

1. Navigate to the **Azure DevOps Project** dashboard in the **Azure portal**.  On the bottom-right of the dashboard, choose the **Application Insights** link for your app.

1. The **Application Insights** blade opens in the Azure portal.  This view contains usage, performance, and availability monitoring information for your app.

    ![Application Insights](_img/azure-devops-project-github/appinsights.png) 

1. Select **Time range**, and then choose **Last hour**.  Select **Update** to filter the results.  You now see all activity from the last 60 minutes.  Select the **x** to exit time range.

1. You can find **Alerts** and several other useful links near the top of the dashboard.  Select **Alerts**, then select **+ Add metric alert**.

1. Enter a **Name** for the alert.

1. The default alert is for a **server response time greater than 1 second**.  Select the **Metric** drop-down to examine the various alert metrics.  For example, you can configure **ASP.NET request execution time** for an ASP.NET app.  You can easily configure a variety of alerts to improve the monitoring capabilities of your app.

1. Select the check-box for **Notify via Email owners, contributors, and readers**.  Optionally, you can perform additional actions when an alert fires by executing an Azure logic app.

1. Choose **Ok** to create the alert.  In a few moments, the alert appears as active on the dashboard.  **Exit** the Alerts area, and navigate back to the **Application Insights blade**.

1. Select **Availability**, then select **+ Add test**. 

1. Enter a **Test name**, then choose **Create**.  This creates  simple ping test to verify the availability of your application.  After a few minutes, test results are available, and the Application Insights dashboard displays an availability status.

## Clean up resources

 > [!NOTE]
 > The steps below will permanently delete resources.  Only use this functionality after carefully reading the prompts.

If you are testing, you can clean up resources to avoid accruing billing charges.  When no longer needed, you can delete the Azure virtual machine and related resources created in this tutorial by using the **Delete** functionality on the Azure DevOps Project dashboard.  **Be careful**, as the delete functionality destroys the data created by the Azure DevOps Project in both Azure and Azure DevOps, and you will not be able to retrieve it once its gone.

1. From the **Azure portal**, navigate to the **Azure DevOps Project**.
2. On the **top right** side of the dashboard, select **Delete**.  After reading the prompt, select **Yes** to **permanently delete** the resources.

## Next steps

You can optionally modify these build and release pipelines to meet the needs of your team. You can also use this CI/CD pattern as a template for your other projects.  You learned how to:

> [!div class="checklist"]
> * Create an Azure DevOps Project for an ASP.NET App
> * Configure Azure DevOps Services and an Azure subscription 
> * Examine the Azure DevOps Services CI pipeline
> * Examine the Azure DevOps Services CD pipeline
> * Commit changes to Azure DevOps Services and automatically deploy to Azure
> * Configure Azure Application Insights monitoring
> * Clean up resources

To learn more about the Azure CI/CD pipeline see this tutorial:

> [!div class="nextstepaction"]
> [Customize CD process](https://docs.microsoft.com/azure/devops/pipelines/release/define-multistage-release-process?view=vsts)
