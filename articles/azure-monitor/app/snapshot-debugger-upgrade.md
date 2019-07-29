---
title: Azure Application Insights Snapshot Debugger upgrade for .NET apps | Microsoft Docs
description: How to upgrade Snapshot Debugger to the latest version on Azure App Services, or via Nuget packages
services: application-insights
author: MarioHewardt
manager: carmonm
ms.service: application-insights
ms.topic: conceptual
ms.date: 03/28/2019
ms.author: marioh
ms.reviewer: mbullwin
---

# Upgrading the Snapshot Debugger

To provide the best possible security for your data, Microsoft is moving away from TLS 1.0 and TLS 1.1, which have been shown to be vulnerable to determined attackers. If you are using an older version of the site extension, it will require an upgrade to continue working. This document outlines the steps needed to upgrade your Snapshot debugger to the latest version. 
There are two primary upgrade paths depending on if you enabled the Snapshot Debugger using a site extension or if you used an SDK/Nuget added to your application. Both upgrade paths are discussed below. 

## Upgrading the site extension

If you enabled the Snapshot debugger using the site extension, you can easily upgrade using the following procedure:

1. Sign in to the Azure portal.
2. Navigate to your resource that has Application Insights and Snapshot debugger enabled. For example, for a Web App, navigate to the App Service resource:

   ![Screenshot of individual App Service resource named DiagService01](./media/snapshot-debugger-upgrade/app-service-resource.png)

3. Once you have navigated to your resource, click on Application Insights in the Overview blade:

   ![Screenshot of three buttons. Center button with name Application Insights is selected](./media/snapshot-debugger-upgrade/application-insights-button.png)

4. A new blade will open with the current settings. Unless you want to take the opportunity to change your settings, you can leave them as is. The **Apply** button on the bottom of the blade is not enabled by default and you will have to toggle one of the settings to activate the button. You don’t have to change any actual settings, rather you can change the setting and then immediately change it back. We recommend toggling the Profiler setting and then selecting **Apply**.

   ![Screenshot of Application Insights App Service Configuration page with Apply button highlighted in red](./media/snapshot-debugger-upgrade/view-application-insights-data.png)

5. Once you click **Apply**, you will be asked to confirm the changes.

    > [!NOTE]
    > The site will be restarted as part of the upgrade process.

   ![Screenshot of App Service's apply monitoring prompt. Text box displays message: "We will now apply changes to your app settings and install our tools to link your Application Insights resource to the web app. This will restart the site. Do you want to continue?"](./media/snapshot-debugger-upgrade/apply-monitoring-settings.png)

6. Click **Yes** to apply the changes. During the process a notification will appear showing that changes are being applied:

   ![Screenshot of Apply Changes - Updating extensions message that appears in the upper right corner](./media/snapshot-debugger-upgrade/updating-extensions.png)

Once completed, a **"Changes are applied"** notification will appear.

   ![Screenshot of message stating changes are applied](./media/snapshot-debugger-upgrade/changes-are-applied.png)

The site has now been upgraded and is ready to use.

## Upgrading Snapshot Debugger using SDK/Nuget

If the application is using a version of `Microsoft.ApplicationInsights.SnapshotCollector` below version 1.3.1, it will need to be upgraded to a [newer version](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector) to continue working.
