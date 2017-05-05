---
title: Deploy your app to Azure and Azure Stack| Microsoft Docs
description: Learn about use cases for Hybrid Cloud, and how to orchestrate deployments across multiple clouds with a hybrid CI/CD pipeline to Azure Stack.
services: azure-stack
documentationcenter: ''
author: HeathL17
manager: byronr
editor: ''


ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 5/5/2017
ms.author: helaw

---

# Deploy apps to Azure and Azure Stack
A hybrid [continuous integration](https://www.visualstudio.com/learn/what-is-continuous-integration/)/[continuous delivery](https://www.visualstudio.com/learn/what-is-continuous-delivery/)(CI/CD) pipeline enables you to build, test, and deploy your app to multiple clouds.  As an example, you can use a hybrid CI/CD pipe line to:
 
 - Initiate a new build based on code commits to your master branch in Visual Studio Team Services (VSTS).
 - Automatically deploy your newly built code to Azure for user acceptance testing.
 - Once your code has passed testing, automatically deploy to production on Azure Stack. 

This topic provides steps to create a simple hybrid CI/CD pipeline for an ASP.NET app using Visual Studio, VSTS, Azure, and Azure Stack.  We understand these steps take time to complete, but when you're finished you'll have a functioning CI/CD pipeline to test app deployment across multiple clouds.  

## Before you begin
You need a few components to build a hybrid CI/CD pipeline, and you may have some of them already.  If you already have some of these items configured, review the following list, and make sure your environment meet the requirements.

This topic also assumes that you have some pre-requisite knowledge of Azure and Azure Stack. If you want to learn more before proceeding, be sure to take a look at these topics:

- [Azure Basics](https://docs.microsoft.com/azure/fundamentals-introduction-to-azure)
- [Azure Stack Key Concepts](azure-stack-key-features.md)

### Azure
 - You can use any Azure subscription to get started.  If you don't have a subscription, you can create a [trial account](https://azure.microsoft.com/free/)
 - Create a [Web App](../app-service-web/app-service-web-how-to-create-a-web-app-in-an-ase.md), and configure it for [FTP publishing](../app-service-web/app-service-deploy-ftp.md).  Make note of the new Web App URL, as you use this later.


### Azure Stack
 - Make sure you've [deployed Azure Stack](azure-stack-run-powershell-script.md).  This usually takes about a day to complete, so make sure you plan accordingly.
 - Deploy [SQL](azure-stack-sql-resource-provider-deploy.md) and [App Service](azure-stack-app-service-deploy.md) PaaS services to Azure Stack.
 - Create Web App and configure it for [FTP publishing](azure-stack-app-service-enable-ftp.md).  Make note of the new Web App URL, as you use this later.  

### Dev tools
 - Create a [VSTS workspace](https://www.visualstudio.com/docs/setup-admin/team-services/sign-up-for-visual-studio-team-services) and [project](https://www.visualstudio.com/docs/setup-admin/team-services/connect-to-visual-studio-team-services#create-your-team-project-in-visual-studio-team-services)
 - [Install Visual Studio 2017](https://docs.microsoft.com/visualstudio/install/install-visual-studio) and [sign-in to VSTS](https://www.visualstudio.com/docs/setup-admin/team-services/connect-to-visual-studio-team-services#connect-and-share-code-from-visual-studio)
 - Deploy a [VSTS build agent](https://www.visualstudio.com/docs/build/actions/agents/v2-windows) on an Azure Stack virtual machine.  
 

## Create app & push to VSTS

### Create application
In this section, you create a simple ASP.NET application and push it to VSTS.  These steps represent the normal developer experience, though could be adapted with other IDEs and languages. 

1.  Open Visual Studio
2.  Click **File** > **New** > **Project**
3.  Select **Visual C#** > **Web** > **ASP.NET Web Application (.NET Framework)**
4.  Provide a name for the application.  In the remaining steps, we'll reference our app as *HelloWorld*.
5.  Click **OK**

### Commit and push changes to VSTS
1.  Using Team Explorer in Visual Studio, select the dropdown and click **Changes**
2.  Provide a commit message and select **Commit all**
3.  You may be prompted to save the solution file, click yes to save all.
4.  Once committed, Visual Studio will offer you to sync changes to your project. Select **Sync** and you will move to the synchronization tab.
5.  In the synchronization tab, under *Outgoing*, you will see the commit you just created.  Select **Push** to synchronize the change to VSTS.

### Review code in VSTS
1.  Once you've commit a changed and pushed to VSTS, check your code from the VSTS portal.
2.  Select *Code*, and then *Files* from the dropdown menu.  You can see the solution you created.

## Create build definition
The build process defines how your application will be built (compiled) and packaged for deployment on each commit of code change. In our example, we'll use the included template to configure the build process for the ASP.NET app, though this could be adapted depending on your application.

1.  Sign in to your VSTS workspace from a web browser.
2.  From the banner, select **Build & Release**  and then **Builds**.
3.  Click **+ New definition**
4.  From the list of templates, select **ASP.NET (Preview)** and select **Next**.
5.  You can select the defaults for repository source if this is your first project, or if not, select the appropriate repository.  Check the box for **Continuous Integration**, which tells VSTS to create a build any time changes are committed to the master branch. Select **Create**
7.  click "Save"


## Create release definition
The release process defines how builds from the previous step are deployed to an environment.  In this case, we'll be publishing our ASP.NET app with FTP to an Azure Web App. At the end of this section, you can see your app running on Azure.  To configure a release to Azure, use the following steps:

1.  Sign in to your VSTS workspace from a web browser.
2.  From the banner, select **Build & Release**  and then **Releases**.
3.  Click the green **+ New definition**, and select **Create release definition**. 
4.  Select **Empty** and click **Next**
5.  You can select the defaults if this is your first build & release in this environment, or select the build created in the previous steps.  Check the box for *Continuous deployment*, and then click **Create**

Now that you've created an empty release definition and tied it to the build, we'll add steps for the Azure environment:

1.  Click the green + to add tasks.
2.  Select All, and then from the list, add **FTP Upload** and select **Close**
3.  Select the **FTP Upload** task you just added, and configure the following parameters:
    
    | Parameter | Value |
    | ----- | ----- |
    |Authentication Method| Enter Credentials|
    |Server URL | Web App FTP URL retrieved from Azure portal |
    |Username | Username you configured when creating FTP Credentials for Web App |
    |Password | Password you created when establishing FTP credentials for Web App|
    |Source Directory | $(System.DefaultWorkingDirectory)\**\ |
    |Remote Directory | /site/wwwroot/ |
    
4.  Click **Save**

## Deploy your app to Azure
This step uses your newly built CI/CD pipeline to deploy the ASP.NET app to a Web App on Azure. 

1.  From the banner in VSTS, select **Build & Release**, and then select **Builds**.
2.  Click the **...** on the build definition previously created, and select **Queue new build**
3.  Accept the defaults and click **Ok**.  The build will now begin and display progress.
4.  Once the build is complete, you can track the status through the release dashboard.
5.  After the build is complete, visit the website URL created for the Web App.    


## Add Azure Stack to pipeline
Now that you've tested your CI/CD pipeline by deploying to Azure, it's time to add Azure Stack to the pipeline.  The following steps will guide you adding an FTP Upload task.  You also add a release approver, which will serve as a way to simulate signing off a code release to Azure Stack.  

1.  In the Release definition, select **+ Add Environment** and **Create new environment**
2.  Select **Empty**, click **Next**.
3.  Select **Create**
4.  Rename the environment by selecting the existing name and typing *Azure Stack*
5.  Now, selection the Azure Stack environment, then select **Add tasks**
6.  Select the **FTP Upload** task and select **Add**, then select **Close**


### Configure FTP task
Now that you've created a release, you'll configure the steps required for publishing to Web Apps on Azure Stack.  Just like you configured the FTP Upload task for Azure, you will configure the task for Azure Stack.

1.  Select the **FTP Upload** task you just added, and configure the following parameters:
    
    | Parameter | Value |
    | -----     | ----- |
    |Authentication Method| Enter Credentials|
    |Server URL | Web App FTP URL retrieved from Azure portal |
    |Username | Username you configured when creating FTP Credentials for Web App |
    |Password | Password you created when establishing FTP credentials for Web App|
    |Source Directory | $(System.DefaultWorkingDirectory)\**\ |
    |Remote Directory | /site/wwwroot/| 
2.  Click **Save**


### Add release approver
You may want to add a review step before publishing to production (Azure Stack).  This is useful where you want a person to approve the code before moving from testing to production.  Use the steps below to configure a code reviewer to approve or deny any releases destined for production.  

1. Open your VSTS workspace and navigate to **Build & Release** > **Release**
2. Select the **...** on your release definition, and select **Edit**
3. In the Azure Stack environment, select **...** > **Assign Approvers**
4. Select **Specific Users** for pre-deployment approver, and specify your account as an approver.  Click **Ok**


## Deploy new code
You can now test the hybrid CI/CD pipeline, with the final step publishing to Azure Stack.  In this section, you modify the site's footer and start deployment through the pipeline.  Once complete, you'll see your changes deployed to Azure, then once you approve the release, they are published to Azure Stack.

1. In Visual Studio, open the .content/site.master file and change this line:
    ````
        <p>&copy; <%: DateTime.Now.Year %> - My ASP.NET Application</p>
    ````

    to this:

    ````
        <p>&copy; <%: DateTime.Now.Year %> - My ASP.NET Application delivered by VSTS, Azure and Azure Stack</p>
    ````
3.  Commit the changes and sync to VSTS.  
4.  From the VSTS workspace, check the build status by select ***Build & Release>Build**
5.  You will see a build in progress, and then see results.  Once you see "Finished build" in the console, move on to check the release.
6.  Once the build is complete, and the pipeline has released to Azure, you will receive notification that a release requires review. 
< screenshot >
7.  Approve the release, and verify publishing the Azure Stack is complete.


You can now use your new hybrid CI/CD pipeline as a building block for other hybrid cloud patterns.

> [!div class="nextstepaction"]
> [Develop for Azure Stack](https://docs.microsoft.com/azure/azure-stack/azure-stack-developer)


