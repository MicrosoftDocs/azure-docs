---
title: Upgrading Azure Application Insights Snapshot Debugger
description: How to upgrade Snapshot Debugger for .NET apps to the latest version on Azure App Services, or via Nuget packages
ms.author: hannahhunter
author: hhunter-ms
ms.reviewer: charles.weininger
reviewer: cweining
ms.topic: conceptual
ms.date: 08/18/2022
ms.custom: devdivchpfy22
---

# Upgrading the Snapshot Debugger

To provide the best possible security for your data, Microsoft is moving away from TLS 1.0 and TLS 1.1, which have been shown to be vulnerable to determined attackers. If you're using an older version of the site extension, it will require an upgrade to continue working. This document outlines the steps needed to upgrade your Snapshot debugger to the latest version.

You can follow two primary upgrade paths, depending on how you enabled the Snapshot Debugger:

* Via site extension
* Via an SDK/NuGet added to your application

This article discusses both upgrade paths.

## Upgrading the site extension

> [!IMPORTANT]
> Older versions of Application Insights used a private site extension called *Application Insights extension for Azure App Service*. The current Application Insights experience is enabled by setting App Settings to light up a pre-installed site extension.
> To avoid conflicts, which may cause your site to stop working, it is important to delete the private site extension first. See step 4 below.

If you enabled the Snapshot debugger using the site extension, you can upgrade using the following procedure:

1. Sign in to the Azure portal.
1. Go to to your resource that has Application Insights and Snapshot debugger enabled. For example, for a Web App, go to to the App Service resource:

   :::image type="content" source="./media/snapshot-debugger-upgrade/app-service-resource.png" alt-text="Screenshot of individual App Service resource named DiagService01.":::

1. After you've navigated to your resource, click on the **Extensions** blade and wait for the list of extensions to populate:

   :::image type="content" source="./media/snapshot-debugger-upgrade/application-insights-site-extension-to-be-deleted.png" alt-text="Screenshot of App Service Extensions showing Application Insights extension for Azure App Service installed.":::

1. If any version of *Application Insights extension for Azure App Service* is installed, select it and click **Delete**. Confirm **Yes** to delete the extension and wait for the delete to complete before moving to the next step.

   :::image type="content" source="./media/snapshot-debugger-upgrade/application-insights-site-extension-delete.png" alt-text="Screenshot of App Service Extensions showing Application Insights extension for Azure App Service with the Delete button highlighted.":::

1. Go to the **Overview** blade of your resource and select **Application Insights**:

   :::image type="content" source="./media/snapshot-debugger-upgrade/application-insights-button.png" alt-text="Screenshot of three buttons. Center button with name Application Insights is selected.":::

1. If this is the first time you've viewed the Application Insights blade for this App Service, you'll be prompted to turn on Application Insights. Select **Turn on Application Insights**.

   :::image type="content" source="./media/snapshot-debugger-upgrade/turn-on-application-insights.png" alt-text="Screenshot of the first-time experience for the Application Insights blade with the Turn on Application Insights button highlighted.":::

1. In the Application Insights settings blade, switch the Snapshot Debugger setting toggles to **On** and select **Apply**.

   If you decide to change *any* Application Insights settings, the **Apply** button on the bottom of the blade will be activated.

   :::image type="content" source="./media/snapshot-debugger-upgrade/view-application-insights-data.png" alt-text="Screenshot of Application Insights App Service Configuration page with Apply button highlighted in red.":::

1. After you click **Apply**, you'll be asked to confirm the changes.

    > [!NOTE]
    > The site will be restarted as part of the upgrade process.

   :::image type="content" source="./media/snapshot-debugger-upgrade/apply-monitoring-settings.png" alt-text="Screenshot of App Service's apply monitoring prompt.":::

1. Click **Yes** to apply the changes and wait for the process to complete.

The site has now been upgraded and is ready to use.

## Upgrading Snapshot Debugger using SDK/Nuget

If the application is using a version of `Microsoft.ApplicationInsights.SnapshotCollector` below version 1.3.1, it will need to be upgraded to a [newer version](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector) to continue working.
