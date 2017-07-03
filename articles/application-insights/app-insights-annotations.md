---
title: Release annotations for Application Insights | Microsoft Docs
description: Add deployment or build markers to your metrics explorer charts in Application Insights.
services: application-insights
documentationcenter: .net
author: CFreemanwa
manager: carmonm

ms.assetid: 23173e33-d4f2-4528-a730-913a8fd5f02e
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 11/16/2016
ms.author: cfreeman

---
# Annotations on metric charts in Application Insights
Annotations on [Metrics Explorer](app-insights-metrics-explorer.md) charts show where you deployed a new build, or other significant event. They make it easy to see whether your changes had any effect on your application's performance. They can be automatically created by the [Visual Studio Team Services build system](https://www.visualstudio.com/en-us/get-started/build/build-your-app-vs). You can also create annotations to flag any event you like by [creating them from PowerShell](#create-annotations-from-powershell).

![Example of annotations with visible correlation with server response time](./media/app-insights-annotations/00.png)



## Release annotations with VSTS build

Release annotations are a feature of the cloud-based build and release service of Visual Studio Team Services. 

### Install the Annotations extension (one time)
To be able to create release annotations, you'll need to install one of the many Team Service extensions available in the Visual Studio Marketplace.

1. Sign in to your [Visual Studio Team Services](https://www.visualstudio.com/en-us/get-started/setup/sign-up-for-visual-studio-online) project.
2. In Visual Studio Marketplace, [get the Release Annotations extension](https://marketplace.visualstudio.com/items/ms-appinsights.appinsightsreleaseannotations), and add it to your Team Services account.

![At top right of Team Services web page, open Marketplace. Select Visual Team Services and then under Build and Release, choose See More.](./media/app-insights-annotations/10.png)

You only need to do this once for your Visual Studio Team Services account. Release annotations can now be configured for any project in your account. 

### Configure release annotations

You need to get a separate API key for each VSTS release template.

1. Sign in to the [Microsoft Azure Portal](https://portal.azure.com) and open the Application Insights resource that monitors your application. (Or [create one now](app-insights-overview.md), if you haven't done so yet.)
2. Open **API Access**,  **Application Insights Id**.
   
    ![In portal.azure.com, open your Application Insights resource and choose Settings. Open API Access. Copy the Application ID](./media/app-insights-annotations/20.png)

4. In a separate browser window, open (or create) the release template that manages your deployments from Visual Studio Team Services. 
   
    Add a task, and select the Application Insights Release Annotation task from the menu.
   
    Paste the **Application Id** that you copied from the API Access blade.
   
    ![In Visual Studio Team Services, open Release, select a release definition, and choose Edit. Click Add Task and select Application Insights Release Annotation. Paste the Application Insights Id.](./media/app-insights-annotations/30.png)
4. Set the **APIKey** field to a variable `$(ApiKey)`.

5. Back in the Azure window, create a new API Key and take a copy of it.
   
    ![In the API Access blade in the Azure window, click Create API Key. Provide a comment, check Write annotations, and click Generate Key. Copy the new key.](./media/app-insights-annotations/40.png)

6. Open the Configuration tab of the release template.
   
    Create a variable definition for `ApiKey`.
   
    Paste your API key to the ApiKey variable definition.
   
    ![In the Team Services window, select the Configuration tab and click Add Variable. Set the name to ApiKey and into the Value, paste the key you just generated, and click the lock icon.](./media/app-insights-annotations/50.png)
7. Finally, **Save** the release definition.


## View annotations
Now, whenever you use the release template to deploy a new release, an annotation will be sent to Application Insights. The annotations will appear on charts in Metrics Explorer.

Click on any annotation marker to open details about the release, including requestor, source control branch, release definition, environment, and more.

![Click any release annotation marker.](./media/app-insights-annotations/60.png)

## Create custom annotations from PowerShell
You can also create annotations from any process you like (without using VS Team System). 


1. Make a local copy of the [Powershell script from GitHub](https://github.com/Microsoft/ApplicationInsights-Home/blob/master/API/CreateReleaseAnnotation.ps1).

2. Get the Application ID and create an API key from the API Access blade.

3. Call the script like this:

```PS

     .\CreateReleaseAnnotation.ps1 `
      -applicationId "<applicationId>" `
      -apiKey "<apiKey>" `
      -releaseName "<myReleaseName>" `
      -releaseProperties @{
          "ReleaseDescription"="a description";
          "TriggerBy"="My Name" }
```

It's easy to modify the script, for example to create annotations for the past.

## Next steps

* [Create work items](app-insights-diagnostic-search.md#create-work-item)
* [Automation with PowerShell](app-insights-powershell.md)
