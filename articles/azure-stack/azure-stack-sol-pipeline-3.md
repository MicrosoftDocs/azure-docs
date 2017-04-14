---
title: Build a hybrid CI/CD pipeline with Azure Stack - deploy to Azure | Microsoft Docs
description: Learn how to deploy to Azure as a first step of your hybrid CI/CD pipeline
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
ms.date: 4/17/2017
ms.author: helaw

---

# Deploy apps with a hybrid CI/CD pipeline:  Create the pipeline & deploy
This topic is part three on building a hybrid CI/CD pipeline, and provides the steps on how to create the build & release definitions in Visual Studio Team Services (VSTS) that publish to Azure.  If you already have a working CI/CD pipeline that publishes to Azure, you can review the steps below for any differences and then move on to part four to configure publishing to Azure Stack.

## Configure build definition
The build process defines how your application will be built and packaged for deployment when new code is introduced. In our example, we'll use a the included template to configure the build process for the ASP.NET app, though this could be adapted depending on your application.

1.  Sign-in to your VSTS workspace from a web browser.
2.  From the banner, select **Build & Release**  and then **Builds**.
3.  Click **+ New**
4.  From the list of templates, select **ASP.NET (Preview)** and select **Next**.
5.  You can select the defaults for repository source if this is your first project, or if not, select the appropriate repository.  Check the box for **Continuous Integration**, which tells VSTS to create a build any time changes are committed to the master branch.
6. <Fix this - add step depending on release steps>

## Configure release definition
The release defines how builds from the previous step are deployed to each environment.  In this case, we'll be using FTP publishing with App Service to Azure, and we'll be configuring Azure Stack in part four. To configure a release to Azure, use the following steps:

1.  Sign-in to your VSTS workspace from a web bowser.
2.  From the banner, select **Build & Release**  and then **Releases**.
3.  Click the green **+**, and select **Create a new release**. 
4.  Select **Empty** and click **Next**
5.  You can select the defaults if this is your first build & release in this environment, or select the build created in the previous steps.  Check the box for *Continuous deployment*, and then click **Create**

Now that you've created an empty release definition and tied it to the build, we'll add steps for the Azure environment:

1.  Click the green + to add tasks.
2.  From the list, add **FTP Upload** and select **Close**
3.  Select the **FTP Upload** task you just added, and configure the following parameters:
    | Parameter | Value |
    | -----     | ----- |
    |Authentication Method| Enter Credentials|
    |Server URL | Web App FTP URL retrieved from Azure Portal |
    |Username | Username you configured when creating FTP Credentials for Web App |
    |Password | Password you created when establishing FTP credentuials for Web App|
    |Source Directory | $(System.DefaultWorkingDirectory)\**\ |
    |Remote Directory | /site/wwwroot/
4.  Click **Save**

## Deploy your app to Azure
To see the power of a CI/CD pipeline, you will publish your app to Azure.  

1.  From the banner in VSTS, select **Build & Release**, and then select **Builds**.
2.  Click the **...** on the build definition previously created, and select **Queue new build**
3.  Accept the defaults and click **Ok**.  The build will now begin and display progress.
4.  Once the build is complete, you can track the status through the release dashboard.
5.  After the build is complete, visit the website url created for the Web App.   

In [part four](azure-stack-sol-pipeline-4.md), we'll add Azure Stack to the pipeline and establish a release approver.  