---
title: 'Tutorial: Deploy your ASP.NET app and Azure SQL Database code by using Azure DevOps Starter'
description: DevOps Starter makes it easy to get started on Azure. With DevOps Starter, you can deploy your ASP.NET app and Azure SQL Database code in a few quick steps.
ms.author: mlearned
ms.manager: gwallace
ms.prod: devops
ms.technology: devops-cicd
ms.topic: tutorial
ms.date: 03/24/2020
author: mlearned
---

# Tutorial: Deploy your ASP.NET app and Azure SQL Database code by using Azure DevOps Starter

Azure DevOps Starter presents a simplified experience where you can bring your existing code and Git repo or choose a sample application to create a continuous integration (CI) and continuous delivery (CD) pipeline to Azure. 

DevOps Starter also:
* Automatically creates Azure resources, such as a database in Azure SQL Database.
* Creates and configures a release pipeline in Azure Pipelines that includes a build pipeline for CI.
* Sets up a release pipeline for CD. 
* Creates an Azure Application Insights resource for monitoring.

In this tutorial, you will:

> [!div class="checklist"]
> * Use Azure DevOps Starter to deploy your ASP.NET app and Azure SQL Database code
> * Configure Azure DevOps and an Azure subscription 
> * Examine the CI pipeline
> * Examine the CD pipeline
> * Commit changes to Azure Repos and automatically deploy them to Azure
> * Connect to Azure SQL Database 
> * Clean up resources

## Prerequisites

* An Azure subscription. You can get one free through [Visual Studio Dev Essentials](https://visualstudio.microsoft.com/dev-essentials/).

## Create a project in DevOps Projects for an ASP.NET app and Azure SQL Database

DevOps Starter creates a CI/CD pipeline in Azure Pipelines. You can create a new Azure DevOps organization or use an existing organization. DevOps Starter also creates Azure resources, such as Azure SQL Database, in the Azure subscription of your choice.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, type **DevOps Starter**, and then select. Click on **Add** to create a new one.

    ![The DevOps Starter dashboard](_img/azure-devops-starter-aks/search-devops-starter.png)

1. Select **.NET**, and then select **Next**.

1. Under **Choose an application framework**, select **ASP.NET**.

1. Select **Add a database**, and then select **Next**. The application framework, which you chose in a previous step, dictates the type of Azure service deployment target that's available here. 
    
1. Select **Next**.

## Configure Azure DevOps and an Azure subscription

1. Create a new Azure DevOps organization, or select an existing organization. 

1. Enter a name for your Azure DevOps project. 

1. Select your Azure subscription services. Optionally, to view additional Azure configuration settings and to identify the username in the **Database Server Login Details** section, you can select **Change**. Store the username for future steps in this tutorial. If you perform this optional step, exit the Azure configuration area before you select **Done**.
 
1. Select **Done**. After a few minutes, the process is completed and the DevOps Starter dashboard opens in the Azure portal. You can also navigate to the dashboard directly from **All resources** in the Azure portal. At the right, select **Browse** to view your running application.
    
## Examine the CI pipeline

DevOps Starter automatically configures a full CI/CD pipeline in Azure Repos. You can explore and customize the pipeline. To familiarize yourself with the Azure DevOps build pipeline, do the following:

1. At the top of the DevOps Starter dashboard, select **Build pipelines**. A browser tab displays the build pipeline for your new project.

1. Point to the **Status** field, and then select the ellipsis (...). A menu displays several options, such as queueing a new build, pausing a build, and editing the build pipeline.

1. Select **Edit**.

1. In this pane, you can examine the various tasks for your build pipeline. The build performs various tasks, such as fetching sources from the Git repository, restoring dependencies, and publishing outputs used for deployments.

1. At the top of the build pipeline, select the build pipeline name.

1. Change the name of your build pipeline to something more descriptive, select **Save & queue**, and then select **Save**.

1. Under your build pipeline name, select **History**. This pane displays an audit trail of your recent changes for the build. Azure Pipelines keeps track of any changes made to the build pipeline, and it allows you to compare versions.

1. Select **Triggers**. DevOps Starter automatically creates a CI trigger, and every commit to the repository starts a new build. Optionally, you can choose to include or exclude branches from the CI process.

1. Select **Retention**. Depending on your scenario, you can specify policies to keep or remove a certain number of builds.

## Examine the CD pipeline

DevOps Starter automatically creates and configures the necessary steps to deploy from your Azure DevOps organization to your Azure subscription. These steps include configuring an Azure service connection to authenticate Azure DevOps to your Azure subscription. The automation also creates a CD pipeline, which provides the CD to the Azure virtual machine. To learn more about the Azure DevOps CD pipeline, do the following:

1. Select **Build and Release**, and then select **Releases**. DevOps Starter creates a release pipeline to manage deployments to Azure.

1. Select the ellipsis (...) next to your release pipeline, and then select **Edit**. The release pipeline contains a *pipeline*, which defines the release process.

1. Under **Artifacts**, select **Drop**. The build pipeline you examined in the previous steps produces the output that's used for the artifact. 

1. At the right of the **Drop** icon, select **Continuous deployment trigger**. This release pipeline has an enabled CD trigger, which executes a deployment every time a new build artifact is available. Optionally, you can disable the trigger so that your deployments require manual execution. 

    DevOps Starter sets up a random SQL password and uses it for the release pipeline.
    
1. At the left, select **Variables**. 

   > [!NOTE]
   > Perform the following step only if you changed the SQL Server password. There is a single password variable.
  
1. Next to the **Value** box, select the padlock icon, enter the new password, and then select **Save**.

1. At the left, select **Tasks**, and then select your environment. Tasks are the activities that your deployment process executes, and they are grouped in phases. This release pipeline has a single phase, which contains an *Azure App Service Deploy* and *Azure SQL Database Deployment* task.

1. Select the *Execute Azure SQL* task, and examine the various properties that are used for the SQL deployment. Under **Deployment Package**, the task uses a *SQL DACPAC* file.

1. At the right, select **View releases** to display a history of releases.

1. Select the ellipsis (...) next to a release, and then select **Open**. You can explore several menus, such as a release summary, associated work items, and tests.

1. Select **Commits**. This view shows code commits that are associated with this deployment. Compare releases to view the commit differences between deployments.

1. Select **Logs**. The logs contain useful information about the deployment process. You can view them both during and after deployments.

## Commit changes to Azure Repos and automatically deploy them to Azure 

 > [!NOTE]
 > The following procedure tests the CI/CD pipeline with a simple text change. To test the SQL deployment process, you can optionally make a SQL Server schema change to the table.

You're now ready to collaborate with a team on your app by using a CI/CD process that automatically deploys your latest work to your website. Each change to the Git repo starts a build in Azure DevOps, and a CD pipeline executes a deployment to Azure. Follow the procedure in this section, or use another technique to commit changes to your repository. The code changes initiate the CI/CD process and automatically deploy your changes to Azure.

1. In the left pane, select **Code**, and then go to your repository.

1. Go to the *SampleWebApplication\Views\Home* directory, select the ellipsis (...) next to the *Index.cshtml* file, and then select **Edit**. 

1. Make a change to the file, such as adding some text within one of the div tags. 

1. At the top right, select **Commit**, and then select **Commit** again to push your change. After a few moments, a build starts in Azure DevOps and a release executes to deploy the changes. Monitor the build status in the DevOps Starter dashboard or in the browser with your Azure DevOps organization.

1. After the release is completed, refresh your application to verify your changes.

## Connect to Azure SQL Database

You need appropriate permissions to connect to Azure SQL Database.

1. On the DevOps Starter dashboard, select **SQL Database** to go to the management page for SQL Database.
   
1. Select **Set server firewall**, and then select **Add client IP**. 

1. Select **Save**. Your client IP now has access to the SQL Server Azure resource.

1. Go back to the **SQL Database** pane. 

1. At the right, select the server name to navigate to the configuration page for **SQL Server**.

1. Select **Reset password**, enter a password for the SQL Server admin login, and then select **Save**. Be sure to keep this password to use later in this tutorial.

    You may now optionally use client tools such as SQL Server Management Studio or Visual Studio to connect to SQL Server and Azure SQL Database. Use the **Server name** property to connect.

    If you didn't change the database username when you initially configured the project in DevOps Projects, your username is the local part of your email address. For example, if your email address is *johndoe\@microsoft.com*, your username is *johndoe*.

   > [!NOTE]
   > If you change your password for the SQL login, you must change the password in the release pipeline variable, as described in the [Examine the CD pipeline](#examine-the-cd-pipeline) section.

## Clean up resources

If you are testing, you can avoid accruing billing charges by cleaning up your resources. When they are no longer needed, you can delete Azure SQL Database and related resources that you created in this tutorial. To do so, use the **Delete** functionality on the DevOps Starter dashboard.

> [!IMPORTANT]
> The following procedure permanently deletes resources. The *Delete* functionality destroys the data that's created by the project in DevOps Starter in both Azure and Azure DevOps, and you will be unable to retrieve it. Use this procedure only after you've carefully read the prompts.

1. In the Azure portal, go to the DevOps Starter dashboard.
2. At the top right, select **Delete**. 
3. At the prompt, select **Yes** to *permanently delete* the resources.

## Next steps

You can optionally modify these build and release pipelines to meet the needs of your team. You can also use this CI/CD pattern as a template for your other pipelines. In this tutorial, you learned how to:

> [!div class="checklist"]
> * Use Azure DevOps Starter to deploy your ASP.NET app and Azure SQL Database code
> * Configure Azure DevOps and an Azure subscription 
> * Examine the CI pipeline
> * Examine the CD pipeline
> * Commit changes to Azure Repos and automatically deploy them to Azure
> * Connect to Azure SQL Database 
> * Clean up resources

To learn more about the CI/CD pipeline, see:

> [!div class="nextstepaction"]
> [Define your multi-stage continuous deployment (CD) pipeline](https://docs.microsoft.com/azure/devops/pipelines/release/define-multistage-release-process?view=vsts)

## Videos

> [!VIDEO https://channel9.msdn.com/Events/Build/2018/BRK3308/player]
