---
title: Build a hybrid CI/CD pipeline with Azure Stack - Configure Tools | Microsoft Docs
description: In this topic, you'll create a simple app and publish to VSTS.  
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
ms.date: 4/12/2017
ms.author: helaw

---

# Deploy apps with a hybrid CI/CD pipeline: Create app
Creating a sample application in Visual Studio will allow you to test the build and release process.  Use these steps to create a sample app and push to a Visual Studio Team Services repository.

## Create simple application
1.  Open Visual Studio
2.  Click **File**>**New**>**Project**
3.  Select **Visual C#**>**Web**>**ASP.NET Web Application (.NET Framework)
4.  Provide a name for the application.  In the remaining steps, we'll reference our app as *HelloWorld*.
5.  Click **OK**

## Commit and push changes to VSTS
1.  From Team Explorer in Visual Studio, select the dropdown and click **Changes**
2.  Provide a commit message and select **Commit**
<Screenshot>
3.  Once committed, Visual Studio will offer you to sync changes to your project. Select **Sync** and you will move to the synchronization tab.
4.  In the synchronization tab, under *Outgoing*, you will see the commit you just created.  Select **Push** to synchronize the change to VSTS.
<Screenshot>

## Review code in VSTS
1.  Once you've commit a changed and pushed to VSTS, check your code from the VSTS portal.
2.  Select *Code*, and then *Files* from the dropdown menu.  In this screen, you can see the solution you created.  

Now that you've created your application and pushed to VSTS, create your [CI/CD pipeline and deploy to Azure](azure-stack-sol-pipeline-3.md).  




