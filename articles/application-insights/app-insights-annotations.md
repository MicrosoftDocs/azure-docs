<properties
    pageTitle="Deployment annotations for Application Insights | Microsoft Azure"
    description="Add deployment or build markers to your metrics explorer charts in Application Insights."
    services="application-insights"
    documentationCenter=".net"
    authors="alancameronwills"
    manager="douge"/>

<tags
    ms.service="application-insights"
    ms.workload="tbd"
    ms.tgt_pltfrm="ibiza"
    ms.devlang="na"
    ms.topic="article"
	ms.date="01/06/2016"
    ms.author="awills"/>

# Deployment annotations in Application Insights

Deployment markers on [Metrics Explorer](app-insights-metrics-explorer.md) charts show where you deployed a new build. They make it easy to see whether your changes had any effect on your application's performance. They can be automatically created by the [Visual Studio Team Services build system](https://www.visualstudio.com/en-us/get-started/build/build-your-app-vs).

![Example of annotations with visible correlation with server response time](./media/app-insights-annotations/00.png)

Deployment markers are a feature of the cloud-based build and release service of Visual Studio Team Services. 

## Install the Annotations extension (one time)

To be able to create deployment markers, you'll need to install one of the many Team Service extensions available in the Visual Studio Marketplace.

1. Sign in to your [Visual Studio Team Services](https://www.visualstudio.com/en-us/get-started/setup/sign-up-for-visual-studio-online) project.
2. Open Visual Studio Marketplace, find the Application Insights Annotations extension, and add it to your Team Services account.

![At top right of Team Services web page, open Marketplace. Search for and install Application Insights Annotations in your account.](./media/app-insights-annotations/10.png)

You only need to do this once for your Visual Studio Team Services account. Deployment markers can now be configured for any project in your account. 



## Add a marker task to your release template

You need to do this for each release template that you want to create deployment markers.

Open (or create) the release template that manages your deployments from Visual Studio Team Services. 

Add a task, and select the Application Insights Release Annotation task from the menu.

![At top right of Team Services web page, open Marketplace. Search for and install Application Insights Annotations in your account.](./media/app-insights-annotations/40.png)

To finish this step, you'll need some details from the Application Insights resource that you use to monitor your application.

Keep the Team Services window open while you get the details from Application Insights.

## Copy an API key from Application Insights

In a separate browser window:  

1. Sign in to the [Microsoft Azure Portal](https://portal.azure.com) and open the Application Insights resource that monitors your application. (Or [create one now](app-insights-overview.md), if you haven't done so yet.)
2. Open the **Essentials** drop-down and copy the Subscription Id, the Resource group, and the Name of the resource to the release annotation task.
![](./media/app-insights-annotations/50.png)
2. Open **Settings**, **API Keys** and create a new key. Copy this across.
![](./media/app-insights-annotations/30.png)

Finally, **Save** the release definition.

## Deployment markers

Now, whenever you use the release template to deploy a new release, a marker will be sent to Application Insights. The markers will appear on charts in Metrics Explorer.