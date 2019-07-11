---
title: 'Tutorial: Deploy Node.js apps powered by Azure Cosmos DB with Azure DevOps Projects'
description: Azure DevOps Projects makes it easy to get started on Azure. With DevOps Projects, you can deploy your Node.js app powered by Azure Cosmos DB to Windows Web App in a few quick steps.
ms.author: mlearned
ms.manager: douge
ms.prod: devops
ms.technology: devops-cicd
ms.topic: tutorial
ms.date: 07/11/2019
author: mlearned
monikerRange: 'vsts'
---

# Deploy Node.js apps powered by Azure Cosmos DB with DevOps Projects

Azure DevOps Projects offers a streamlined experience where you can bring your existing code and Git repo or select a sample application to create a continuous integration (CI) and continuous delivery (CD) pipeline to Azure.

DevOps Projects also:

* Create Azure resources automatically, such as Azure Cosmos DB, Application Insights, App Service and App Service.

* Creates and configures a release pipeline in Azure DevOps for CI/CD

In this tutorial, you will:

> [!div class="checklist"]
> * Use DevOps Projects to deploy a Node.js app powered by Azure Cosmos DB
> * Configure Azure DevOps and an Azure subscription
> * Examine the Azure Cosmos DB
> * Examine the CI pipeline
> * Examine the CD pipeline
> * Commit the changes to Git and automatically deploy them to Azure
> * Clean up the resources

## Prerequisites

* An Azure subscription. You can get one free through [Visual Studio Dev Essentials](https://visualstudio.microsoft.com/dev-essentials/)

## Use DevOps Projects to deploy Node.js app

DevOps Projects creates a CI/CD pipeline in Azure Pipelines. You can create a new Azure DevOps organization or use an existing organization. DevOps Projects also creates Azure resources, such as Azure Cosmos DB, Application Insights, App Service and App Service plan, in the Azure subscription of your choice.

1. Sign in to the [Azure portal](https://portal.azure.com)

1. In the left pane, select the section **Create a resource**.

1. In the search box, type **DevOps Projects**, and then click **Add**.

   ![DevOps Projects](_img/azure-devops-project-cosmos-db/devops-project.png)

1. Select **Node.js** as the runtime, and then select **Next**. Under **Choose an application framework**, select **Express.js**.

1. Enable the section **Add a database** for **Cosmos DB** and click on **Next**.

    ![Add Database](_img/azure-devops-project-cosmos-db/add-database.png)

    Cosmos DB supports various application frameworks like **Express.js**, **Sample Node.js app**, and **Sail.js**. In this tutorial, lets consider **Express.js**.

1. Select an Azure service to deploy the application. You have different services like Windows Web App, Kubernetes Service and Web App for Containers. For this tutorial, we will use **Windows Web App**. Click on **Next**.

## Configure Azure DevOps and Azure subscription

1. Enter a name for your Azure DevOps project.

1. Create a new Azure DevOps organization, or select an existing organization.

1. Select your Azure subscription.

1. To view additional Azure configuration settings and to identify the pricing tier and location, click on Additional settings. This pane displays various options for configuring the pricing tier and location of Azure services.

1. Exit the Azure configuration area, and then select **Done**.

1. After a few minutes, the process is completed. A sample Node.js app is set up in a Git repo in your Azure DevOps organization, an Azure Cosmos DB, App Service, App Service plan and Application Insights are created, a CI/CD pipeline is executed, and your app is deployed to Azure.

   After all this is completed, the Azure DevOps Project dashboard is displayed in the Azure portal. You can also go to the DevOps Projects dashboard directly from **All resources** in the Azure portal.

   This dashboard provides visibility into your Azure DevOps code repository, your CI/CD pipeline, and in your Azure Cosmos DB. You can configure additional CI/CD options in your Azure DevOps pipeline. At the right, select **Azure Cosmos DB** to view.

## Examine the Azure Cosmos DB

DevOps Projects automatically configures Cosmos DB, which you can explore and customize. To familiarize yourself with the Cosmos DB, do the following:

1. Go to the DevOps Projects dashboard.

    ![DevOps Projects Dashboard](_img/azure-devops-project-cosmos-db/devops-project-dashboard.png)

1. At the right, select the Cosmos DB. A pane opens for the Cosmos DB. From this view you can perform various actions such as operations monitoring and searching logs.

    ![Function App](_img/azure-devops-project-cosmos-db/cosmos-db.png)

## Examine the CI pipeline

DevOps Projects automatically configures a CI/CD pipeline in your Azure DevOps organization. You can explore and customize the pipeline. To familiarize yourself with it, do the following:

1. Go to the DevOps Projects dashboard.

1. Click on the hyperlink under **Build**. A browser tab displays the build pipeline for your new project.

    ![Build](_img/azure-devops-project-cosmos-db/build.png)

1. Select **Edit**. In this pane, you can examine the various tasks for your build pipeline. The build performs various tasks, such as fetching source code from the Git repo, building the application, running unit tests, and publishing outputs that are used for deployments.

1. Select **Triggers**. DevOps Projects automatically creates a CI trigger, and every commit to the repo starts a new build. Optionally, you can choose to include or exclude branches from the CI process.

1. Select **Retention**. Depending on your scenario, you can specify policies to keep or remove a certain number of builds.

1. At the top of the build pipeline, select the build pipeline name.

1. Change the name of your build pipeline to something more descriptive, and then select **Save** from the **Save & queue** dropdown.

1. Under your build pipeline name, select **History**. This pane displays an audit trail of your recent changes for the build. Azure DevOps keeps track of any changes made to the build pipeline, and it allows you to compare versions.

## Examine the CD release pipeline

DevOps Projects automatically creates and configures the necessary steps to deploy from your Azure DevOps organization to your Azure subscription. These steps include configuring an Azure service connection to authenticate Azure DevOps to your Azure subscription. The automation also creates a release pipeline, which provides the CD to Azure. To learn more about the release pipeline, do the following:

1. Navigate to the **Pipelines | Releases**.

1. Click on **Edit**.

1. Under **Artifacts**, select **Drop**. The build pipeline you examined in the previous steps produces the output that's used for the artifact.

1. At the right of the **Drop** icon, select **Continuous deployment trigger**. This release pipeline has enabled CD trigger, which executes a deployment every time a new build artifact is available. Optionally, you can disable the trigger so that your deployments require manual execution.

1. At the right, select the section **View releases** to display a history of releases.

1. Click on the release, which will display the pipeline. Click on any environment to check the release **Summary, Commits**, associated **Work Items**.

1. Select **Commits**. This view shows code commits that are associated with this deployment. Compare releases to view the commit differences between deployments.

1. Select **View Logs**. The logs contain useful information about the deployment process. You can view them both during and after deployments.

## Commit code changes and execute CI/CD

> [!NOTE]
> The following procedure tests the CI/CD pipeline by making a simple text change.

You're now ready to collaborate with a team on your app by using a CI/CD process that automatically deploys your latest work to your Azure App Service. Each change to the Git repo starts a build in Azure DevOps, and a CD pipeline executes a deployment to Azure. Follow the procedure in this section, or use another technique to commit changes to your repo. For example, you can clone the Git repo in your favorite tool or IDE, and then push changes to this repo.

1. In the Azure DevOps menu, select **Repos | Files**, and then go to your repo.

1. The repository already contains code based on the application language that you chose in the creation process. Open the **Application/views/index.pug** file.

1. Select **Edit**, and then make a change to **line number 15** . For example, you can update it to **My First deployment to Azure App Service powered by Azure Cosmos DB**

1. At the top right, select **Commit**, and then select **Commit** again to push your change.

     After a few moments, a build starts in Azure DevOps and a release executes to deploy the changes. Monitor the build status on the DevOps Projects dashboard or in the browser with your Azure DevOps organization.

## Clean up resources

You can delete the related resources that you created when you don't need them anymore. Use the **Delete** functionality on the DevOps Projects dashboard.

## Next steps

You can optionally modify these build and release pipelines to meet the needs of your team. You can also use this CI/CD pattern as a template for your other pipelines. In this tutorial, you learned how to:

> [!div class="checklist"]
> * Use DevOps Projects to deploy a Node.js app powered by Azure Cosmos DB
> * Configure Azure DevOps and an Azure subscription 
> * Examine the Azure Cosmos DB
> * Examine the CI pipeline
> * Examine the CD pipeline
> * Commit changes to Git and automatically deploy them to Azure
> * Clean up resources
