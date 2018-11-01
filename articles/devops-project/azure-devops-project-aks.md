---
title: Deploy your ASP.NET Core App to Azure Kubernetes Service (AKS) with the Azure DevOps Project | Azure DevOps Tutorial
description: Azure DevOps Project makes it easy to get started on Azure. Azure DevOps Project makes it easy to deploy your ASP.NET Core App with the Azure Kubernetes Service (AKS) in a few quick steps.
ms.author: mlearned
ms.manager: douge
ms.prod: devops
ms.technology: devops-cicd
ms.topic: tutorial
ms.date: 07/09/2018
author: mlearned
monikerRange: 'vsts'
---


# Tutorial:  Deploy your ASP.NET Core App to Azure Kubernetes Service (AKS) with the Azure DevOps Project

The Azure DevOps Project presents a simplified experience where you bring your existing code and Git repository, or choose from one of the sample applications to create a continuous integration (CI) and continuous delivery (CD) pipeline to Azure.  The DevOps Project automatically creates Azure resources such as AKS, creates and configures a release pipeline in Azure DevOps Services that includes a build and release pipeline for CI/CD, and then creates an Azure Application Insights resource for monitoring.

You will:

> [!div class="checklist"]
> * Create an Azure DevOps Project for an ASP.NET Core App and AKS
> * Configure Azure DevOps Services and an Azure subscription 
> * Examine the AKS cluster
> * Examine the Azure DevOps Services CI pipeline
> * Examine the Azure DevOps Services CD pipeline
> * Commit changes to Git and automatically deploy to Azure
> * Clean up resources

## Prerequisites

* An Azure subscription. You can get one free through [Visual Studio Dev Essentials](https://visualstudio.microsoft.com/dev-essentials/).

## Create an Azure DevOps Project for an ASP.NET Core App and AKS

The Azure DevOps Project creates a CI/CD pipeline in Azure.  You can create a **new Azure DevOps Services** organization or use an **existing organization**.  The Azure DevOps Project also creates **Azure resources** such as an AKS cluster in the **Azure subscription** of your choice.

1. Sign into the [Microsoft Azure portal](https://portal.azure.com).

1. Choose the **Create a resource** icon in the left navigation bar, then search for **DevOps Project**.  Choose **Create**.

   	![Starting Continuous Delivery](_img/azure-devops-project-aks/fullbrowser.png)

1. Select **.NET**, and then choose **Next**.

1. For **Choose an application Framework**, select **ASP.NET Core**, and then select **Next**.

1. Select **Kubernetes Service**, then choose **Next**.  

## Configure Azure DevOps Services and an Azure subscription

1. Create a **new** Azure DevOps organization or choose an **existing** organization.  Choose a **name** for your project.  

1. Select your **Azure subscription**.

1. Select the **Change** link to see additional Azure configuration settings, and identify the **number of nodes** for the **Kubernetes cluster**.  There are various options here for configuring the type and location of Azure services.
 
1. Exit the Azure configuration area, and choose **Done**.

1. It will take several minutes for the process to complete.  A sample ASP.NET Core application is set up in an Azure Repos Git repository in your Azure DevOps Services organization, an AKS cluster is created, a CI/CD pipeline executes, and your application deploys to Azure.  

	Once complete, the Azure DevOps **Project dashboard** loads in the Azure portal.  You can also navigate to the **Azure DevOps Project Dashboard** directly from **All resources** in the **Azure portal**.  

	This dashboard provides visibility into your Azure Repos **code repository**, **Azure DevOps Services CI/CD pipeline**, and **AKS cluster**.  You can further configure additional CI/CD options in your Azure DevOps Services pipeline.  On the right-side of the dashboard, select **Browse** to view your running application.

## Examine the AKS cluster

The Azure DevOps Project automatically configures an AKS cluster.  You can explore and customize the cluster.  Follow the steps below to familiarize yourself with the AKS.

1. Navigate to the **Azure DevOps Project dashboard**.

1. On the right-side of the DevOps Project dashboard, select the **Kubernetes service**.

1. A blade opens for the AKS cluster.  From this view you can perform various actions such as **monitor container health**, **search logs**, and open the **Kubernetes dashboard**.

1. On the right-side of the screen, select **View Kubernetes dashboard**.  Optionally follow the steps to open the Kubernetes dashboard.

## Examine the Azure DevOps Services CI pipeline

The Azure DevOps Project automatically configures a Azure CI/CD pipeline in your Azure DevOps organization.  You can explore and customize the pipeline.  Follow the steps below to familiarize yourself with the Azure DevOps Services CI/CD pipeline.

1. Navigate to the **Azure DevOps Project dashboard**.

1. Select **Build Pipelines** from the **top** of the **Azure DevOps Project dashboard**.  This link opens a browser tab and opens the Azure DevOps Services build pipeline for your new project.

1. Move the mouse cursor to the right of the build pipeline next to the **Status** field. Select the **ellipsis** that appears.  This action opens a menu where you can perform several activities such as **queue a new build**, **pause a build**, and **edit the build pipeline**.

1. Select **Edit**.

1. From this view, **examine the various tasks** for your.  The build performs various tasks such as fetching sources from the Azure DevOps Services Repos Git repository, restoring dependencies, and publishing outputs used for deployments.

1. At the top of the build pipeline, select the **build pipeline name**.

1. Change the **name** of your build pipeline to something more descriptive.  Select **Save & queue**, then select **Save**.

1. Under your build pipeline name, select **History**.  You see an audit trail of your recent changes for the build.  Azure DevOps Services keeps track of any changes made to the build pipeline and allows you to compare versions.

1. Select **Triggers**.  The Azure DevOps Project automatically created a CI trigger, and every commit to the repository starts a new build.  You can optionally choose to include or exclude branches from the CI process.

1. Select **Retention**.  Based on your scenario, you can specify policies to keep or remove a certain number of builds.

## Examine the Azure DevOps Services CD Release pipeline

The Azure DevOps Project automatically creates and configures the necessary steps to deploy from your Azure DevOps Services organization to your Azure subscription.  These steps include configuring an Azure service connection to authenticate Azure DevOps Services with your Azure subscription.  The automation also creates an Azure DevOps Services Release pipeline, and the Release pipeline provides the CD to the Azure.  Follow the steps below to examine more about the Azure DevOps Services Release pipeline.

1. Select **Build and Release**, then choose **Releases**.  The Azure DevOps Project created an Azure DevOps Services release pipeline to manage deployments to Azure.

1. On the left-hand side of the browser, select the **ellipsis** next to your release pipeline, then choose **Edit**.

1. The release pipeline contains a **pipeline**, which defines the release process.  Under **Artifacts**, select **Drop**.  The build pipeline you examined in the previous steps produces the output used for the artifact. 

1. To the right-hand side of the **Drop** icon, select the **Continuous deployment trigger** **icon** (which appears as a lightning bolt.)  This release pipeline has an enabled CD trigger.  The trigger creates a deployment every time there is a new build artifact available.  Optionally, you can disable the trigger, so your deployments will then require manual execution. 

1. On the right-hand side of the browser, select **View releases**.  This view shows a history of releases.

1. Select the **ellipsis** next to one of your releases, and choose **Open**.  There are several menus to explore from this view such as a **release summary**, **associated work items**, and **Tests**.

1. Select **Commits**.  This view shows code commits associated with the specific deployment. You can compare releases to view the commit differences between deployments.

1. Select **Logs**.  The logs contain useful information about the deployment process.  They can be viewed both during and after deployments.

## Commit changes to Azure DevOps Services and automatically deploy to Azure 

 > [!NOTE]
 > The steps below test the CI/CD pipeline with a simple text change to your web app.

You're now ready to collaborate with a team on your app with a CI/CD process that automatically deploys your latest work to your web site.  Each change to the Azure DevOps Services Git repo starts a build in Azure DevOps Services, and a CD pipeline deploys your changes to Azure.  Follow the steps below, or use other techniques to commit changes to your repository.  For example, you can **clone** the Git repository in your favorite tool or IDE, and then push changes to this repo.

1. Select **Code** and then **Files** from the Azure DevOps Services menu, and navigate to your repository.
1. Navigate to the **Views\Home** directory, then select the **ellipsis** next to the **Index.cshtml** file, and then choose **Edit**.

1. Make a change to the file such as some text inside one of the **div tags**.  At the top right, select **Commit**.  Select **Commit** again to push your change. 

1. In a few moments, a **build starts in Azure DevOps Services**, and then a release executes to deploy the changes.  You can monitor the **build status** with the DevOps Project dashboard or in the browser with your Azure DevOps Services organization.

1. Once the release completes, **refresh your application** in the browser to verify you see your changes.

## Clean up resources

 > [!NOTE]
 > The steps below will permanently delete resources.  Only use this functionality after carefully reading the prompts.

If you are testing, you can clean up resources to avoid creating billing charges.  When no longer needed, you can delete the Azure Kubernetes cluster and related resources created in this tutorial by using the **Delete** functionality on the Azure DevOps Project dashboard.  **Be careful**, as the delete functionality destroys the data created by the Azure DevOps Project in both Azure and Azure DevOps Services, and you will not be able to retrieve it once it's gone.

1. From the **Azure portal**, navigate to the **Azure DevOps Project**.
2. On the **top right** side of the dashboard, select **Delete**.  After reading the prompt, select **Yes** to **permanently delete** the resources.

## Next steps

You can optionally modify these build and release pipelines to meet the needs of your team. You can also use this CI/CD pattern as a template for your other pipelines.  You learned how to:

> [!div class="checklist"]
> * Create an Azure DevOps Project for an ASP.NET Core App and AKS
> * Configure Azure DevOps Services and an Azure subscription 
> * Examine the AKS cluster
> * Examine the Azure DevOps Services CI pipeline
> * Examine the Azure DevOps Services CD pipeline
> * Commit changes to Git and automatically deploy to Azure
> * Clean up resources

To learn more about using the Kubernetes dashboard see below:

> [!div class="nextstepaction"]
> [Use the Kubernetes dashboard](https://docs.microsoft.com/azure/devops/pipelines/release/define-multistage-release-process?view=vsts)
