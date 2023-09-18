---
title: Upgrade Application Insights Snapshot Debugger
description: Learn how to upgrade the Snapshot Debugger for .NET apps to the latest version on Azure App Services or via NuGet packages.
ms.author: hannahhunter
author: hhunter-ms
ms.reviewer: charles.weininger
reviewer: cweining
ms.topic: conceptual
ms.date: 07/10/2023
ms.custom: devdivchpfy22, devx-track-dotnet, engagement
---

# Upgrade the Snapshot Debugger

> [!IMPORTANT]
> [Microsoft is moving away from TLS 1.0 and TLS 1.1](/lifecycle/announcements/transport-layer-security-1x-disablement) due to vulnerabilities. If you're using an older version of the site extension, you need to upgrade your instance of Snapshot Debugger to the latest version.

Depending on how you enabled the Snapshot Debugger, you can follow two primary upgrade paths:

- Via site extension
- Via an SDK/NuGet added to your application

# [Site extension](#tab/site-ext)

> [!IMPORTANT]
> Older versions of Application Insights used a private site extension called *Application Insights extension for Azure App Service*. 
> The current Application Insights experience is enabled by setting App Settings to light up a preinstalled site extension.
> To avoid conflicts, which might cause your site to stop working, delete the private site extension first. See step 4 in the following procedure.

If you enabled the Snapshot Debugger by using the site extension, you can upgrade by following these steps:

1. Sign in to the Azure portal.
1. Go to your resource that has Application Insights and Snapshot Debugger enabled. For example, for a web app, go to the Azure App Service resource.

   :::image type="content" source="./media/snapshot-debugger-upgrade/app-service-resource.png" alt-text="Screenshot that shows an individual App Service resource named DiagService01.":::

1. Select the **Extensions** pane. Wait for the list of extensions to populate.

   :::image type="content" source="./media/snapshot-debugger-upgrade/application-insights-site-extension-to-be-deleted.png" alt-text="Screenshot that shows App Service Extensions showing the Application Insights extension for Azure App Service installed.":::

1. If any version of **Application Insights extension for Azure App Service** is installed, select it and select **Delete**. Confirm **Yes** to delete the extension. Wait for the delete process to finish before you move to the next step.

   :::image type="content" source="./media/snapshot-debugger-upgrade/application-insights-site-extension-delete.png" alt-text="Screenshot that shows App Service Extensions showing Application Insights extension for Azure App Service with the Delete button.":::

1. Go to the **Overview** pane of your resource and select **Application Insights**.

   :::image type="content" source="./media/snapshot-debugger-upgrade/application-insights-button.png" alt-text="Screenshot that shows selecting the Application Insights button.":::

1. If this is the first time you've viewed the **Application Insights** pane for this app service, you're prompted to turn on Application Insights. Select **Turn on Application Insights**.

   :::image type="content" source="./media/snapshot-debugger-upgrade/turn-on-application-insights.png" alt-text="Screenshot that shows the Turn on Application Insights button.":::

1. On the **Application Insights settings** pane, switch the Snapshot Debugger setting toggles to **On** and select **Apply**.

   If you decide to change *any* Application Insights settings, the **Apply** button is activated.

   :::image type="content" source="./media/snapshot-debugger-upgrade/view-application-insights-data.png" alt-text="Screenshot that shows Application Insights App Service Configuration page with the Apply button highlighted.":::

1. After you select **Apply**, you're asked to confirm the changes.

    > [!NOTE]
    > The site restarts as part of the upgrade process.

   :::image type="content" source="./media/snapshot-debugger-upgrade/apply-monitoring-settings.png" alt-text="Screenshot that shows the App Service Apply monitoring settings prompt.":::

1. Select **Yes** to apply the changes and wait for the process to finish.

The site is now upgraded and is ready to use.


# [SDK/NuGet](#tab/sdk-nuget)

If your application is using a version of `Microsoft.ApplicationInsights.SnapshotCollector` earlier than version 1.3.1, upgrade it to a [newer version](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector) to continue working.

---

## Next steps

- [Learn how to view snapshots](./snapshot-debugger-data.md)
- [Troubleshoot issues you encounter in Snapshot Debugger](./snapshot-debugger-troubleshoot.md)