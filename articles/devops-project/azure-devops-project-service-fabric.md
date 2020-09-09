---
title: 'Tutorial: Deploy your ASP.NET Core app to Azure Service Fabric by using Azure DevOps Starter'
description: Azure DevOps Starter makes it easy to get started on Azure. With DevOps Projects, you can deploy your ASP.NET Core app to Azure Service Fabric in a few quick steps.
ms.author: mlearned
ms.manager: gwallace
ms.prod: devops
ms.technology: devops-cicd
ms.topic: tutorial
ms.date: 03/24/2020
author: mlearned
---

# Tutorial: Deploy your ASP.NET Core app to Azure Service Fabric by using Azure DevOps Starter

Azure DevOps Starter presents a simplified experience where you can bring your existing code and Git repo or choose a sample application to create a continuous integration (CI) and continuous delivery (CD) pipeline to Azure. 

DevOps Starter also:

* Automatically creates Azure resources, such as Azure Service Fabric.
* Creates and configures a release pipeline in Azure DevOps that sets up a CI/CD pipeline.
* Creates an Azure Application Insights resource for monitoring.

In this tutorial, you will:

> [!div class="checklist"]
> * Use DevOps Starter to create an ASP.NET Core app and deploy it to Service Fabric
> * Configure Azure DevOps and an Azure subscription 
> * Examine the CI pipeline
> * Examine the CD pipeline
> * Commit changes to Git and automatically deploy to Azure
> * Clean up resources

## Prerequisites

* An Azure subscription. You can get one free through [Visual Studio Dev Essentials](https://visualstudio.microsoft.com/dev-essentials/).

## Use DevOps Starter to create an ASP.NET Core app and deploy it to Service Fabric

DevOps Starter creates a CI/CD pipeline in Azure Pipelines. You can create a new Azure DevOps organization or use an existing organization. DevOps Starter also creates Azure resources, such as a Service Fabric cluster, in the Azure subscription of your choice.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, type **DevOps Starter**, and then select. Click on **Add** to create a new one.

    ![The DevOps Starter dashboard](_img/azure-devops-starter-aks/search-devops-starter.png) 

1. Select **.NET**, and then select **Next**.

1. Under **Choose an application framework**, select **ASP.NET Core**, and then select **Next**.

1. Select **Service Fabric Cluster**, and then select **Next**. 

## Configure Azure DevOps and an Azure subscription

1. Create a new Azure DevOps organization, or select an existing organization. 

1. Enter a name for your Azure DevOps project. 

1. Select your Azure subscription.

1. To view additional Azure configuration settings and to identify the node virtual machine size and operating system for the Service Fabric cluster, select **Change**. This pane displays various options for configuring the type and location of Azure services.
 
1. Exit the Azure configuration area, and then select **Done**.  
    After a few minutes, the process is completed. A sample ASP.NET Core app is set up in a Git repo in your Azure DevOps organization, a Service Fabric cluster is created, a CI/CD pipeline is executed, and your app is deployed to Azure. 

    After all this is completed, the DevOps Starter dashboard is displayed in the Azure portal. You can also go to the DevOps Starter dashboard directly from **All resources** in the Azure portal. 

    This dashboard provides visibility into your Azure DevOps code repo, your CI/CD pipeline, and your Service Fabric cluster. You can configure additional options for your CI/CD pipeline in Azure Repos. At the right, select **Browse** to view your running app.

## Examine the CI pipeline

DevOps Starter automatically configures a CI/CD pipeline in Azure Pipelines. You can explore and customize the pipeline. To familiarize yourself with it, do the following:

1. Go to the DevOps Starter dashboard.

1. At the top of the DevOps Starter dashboard, select **Build pipelines**. A browser tab displays the build pipeline for your new project.

1. Point to the **Status** field, and then select the ellipsis (...). A menu displays several options, such as queueing a new build, pausing a build, and editing the build pipeline.

1. Select **Edit**.

1. In this pane, you can examine the various tasks for your build pipeline. The build performs various tasks, such as fetching sources from the Git repo, restoring dependencies, and publishing outputs used for deployments.

1. At the top of the build pipeline, select the build pipeline name. 

1. Under your build pipeline name, select **History**. This pane displays an audit trail of your recent changes for the build. Azure DevOps keeps track of any changes made to the build pipeline, and it allows you to compare versions.

1. Select **Triggers**. DevOps Starter automatically creates a CI trigger, and every commit to the repo starts a new build. Optionally, you can choose to include or exclude branches from the CI process.

1. Select **Retention**. Depending on your scenario, you can specify policies to keep or remove a certain number of builds.

## Examine the CD pipeline

DevOps Starter automatically creates and configures the necessary steps to deploy from your Azure DevOps organization to your Azure subscription. These steps include configuring an Azure service connection to authenticate Azure DevOps to your Azure subscription. The automation also creates a release pipeline, which provides the CD to Azure. To learn more about the release pipeline, do the following:

1. Select **Build and Release**, and then select **Releases**. DevOps Starter creates a release pipeline to manage deployments to Azure.

1. Select the ellipsis (...) next to your release pipeline, and then select **Edit**. The release pipeline contains a *pipeline*, which defines the release process.

1. Under **Artifacts**, select **Drop**. The build pipeline you examined previously produces the output that's used for the artifact. 

1. At the right of the **Drop** icon, select **Continuous deployment trigger**. This release pipeline has an enabled CD trigger, which executes a deployment every time a new build artifact is available. Optionally, you can disable the trigger so that your deployments require manual execution. 

1. At the right, select **View releases** to display a history of releases.

1. Select the ellipsis (...) next to a release, and then select **Open**. You can explore several menus, such as a release summary, associated work items, and tests.

1. Select **Commits**. This view shows code commits that are associated with this deployment. Compare releases to view the commit differences between deployments.

1. Select **Logs**. The logs contain useful information about the deployment process. You can view them both during and after deployments.

## Commit changes to Git and automatically deploy them to Azure 

 > [!NOTE]
 > The following procedure tests the CI/CD pipeline by making a simple text change.

You're now ready to collaborate with a team on your app by using a CI/CD process that automatically deploys your latest work to your website. Each change to the Git repo starts a build, and a release deploys your changes to Azure. Follow the procedure in this section, or use another technique to commit changes to your repo. For example, you can clone the Git repo in your favorite tool or IDE, and then push changes to this repo.

1. In the Azure DevOps menu, select **Code** > **Files**, and then go to your repo.

1. Go to the *Views\Home* directory, select the ellipsis (...) next to the *Index.cshtml* file, and then select **Edit**.

1. Make a change to the file, such as adding some text within one of the div tags. 

1. At the top right, select **Commit**, and then select **Commit** again to push your change.  
    After a few moments, a build starts, and then a release executes to deploy the changes. You can monitor the build status on the DevOps Starter dashboard or in the browser with Azure DevOps real-time logging.

1. After the release is completed, refresh your app to verify your changes.

## Clean up resources

If you are testing, you can avoid accruing billing charges by cleaning up your resources. When they are no longer needed, you can delete the Azure Service Fabric cluster and related resources that you created in this tutorial. To do so, use the **Delete** functionality on the DevOps Starter dashboard.

> [!IMPORTANT]
> The following procedure permanently deletes resources. The *Delete* functionality destroys the data that's created by the project in DevOps Starter in both Azure and Azure DevOps, and you will be unable to retrieve it. Use this procedure only after you've carefully read the prompts.

1. In the Azure portal, go to the DevOps Starter dashboard.
1. At the top right, select **Delete**. 
1. At the prompt, select **Yes** to *permanently delete* the resources.

## Next steps

You can optionally modify the Azure CI/CD pipeline to meet the needs of your team. You can also use this CI/CD pattern as a template for your other pipelines. In this tutorial, you learned how to:

> [!div class="checklist"]
> * Use DevOps Starter to create an ASP.NET Core app and deploy it to Service Fabric
> * Configure Azure DevOps and an Azure subscription 
> * Examine the CI pipeline
> * Examine the CD pipeline
> * Commit changes to Git and automatically deploy them to Azure
> * Clean up resources

To learn more about Service Fabric and microservices, see:

> [!div class="nextstepaction"]
> [Use a microservices approach for building applications](https://docs.microsoft.com/azure/devops/pipelines/release/define-multistage-release-process?view=vsts)
