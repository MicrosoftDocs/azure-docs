---
title: Build a hybrid CI/CD pipeline with Azure Stack - Deploy to Azure Stack | Microsoft Docs
description: In this guide, you'll learn how to configure VSTS to deploy to App Services on Azure Stack.
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
# Deploy apps with a hybrid CI/CD pipeline:  Deploy to Azure Stack
The final step to configuring your hybrid CI/CD pipeline is to add your production cloud, configure any code reviewers, and test the complete pipeline.  This topic is the last of four parts, and covers adding Azure Stack to the pipeline, configuring a code review, and finally pushing new code through the entire pipeline.


## Add Azure Stack environment
Adding an Azure Stack environment to the pipeline enables it receive completed builds.  In this tutorial, Azure Stack serves as the production environment, so it will be the last environment published.  Use these steps to add Azure Stack:

### Add Environment
1.  In the Release definition, select **+ Add Environment** and **Create new environment**
2.  Select **Empty**, click **Next**.
3.  Select **Create**
4.  Rename the environment by selecting the existing name and typing *Azure Stack*
5.  Now, selecton the Azure Stack environment, then select **Add tasks**
6.  Select the **FTP Upload** task and select **Add**, then select **Close**


### Configure FTP task
Now that you've created a release, you'll configure the steps required for publishing to Web Apps on Azure Stack.  Just like you configured the FTP Upload task for Azure, you will configure the task for Azure Stack.

1.  Select the **FTP Upload** task you just added, and configure the following parameters:
    
    | Parameter | Value |
    | -----     | ----- |
    |Authentication Method| Enter Credentials|
    |Server URL | Web App FTP URL retrieved from Azure Portal |
    |Username | Username you configured when creating FTP Credentials for Web App |
    |Password | Password you created when establishing FTP credentuials for Web App|
    |Source Directory | $(System.DefaultWorkingDirectory)\**\ |
    |Remote Directory | /site/wwwroot/| 
2.  Click **Save**


## Add release approver
You may want to add a review step before publishing to prodution.  This is useful where you want a person to approve the code before moving from testing to production.  In this section, you'll configure a configure a code reviewer to approve or deny any releases destined for production.  

1. Open your VSTS workspace and navigate to **Build & Release** > **Release**
2. Select the **...** on your release definition, and select **Edit**
3. In the Azure Stack enviorment, select **...** > **Assign Approvers**
4. Select **Specific Users** for pre-deployment approver, and specify your account as an approver.  Click **Ok**


## Deploy new code
Once you've established your new code, and you can test the pipeline.  In this section, you modify the site's footer and start deployment through the pipeline.

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


 
    
