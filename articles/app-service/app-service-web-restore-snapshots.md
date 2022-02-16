---
title: Restore app from a snapshot
description: Learn how to restore your app from a snapshot. Recover from unexpected data loss in Premium tier with the automatic shadow copies.

ms.assetid: 4164f9b5-f735-41c6-a2bb-71f15cdda417
ms.topic: article
ms.date: 02/16/2022
ms.reviewer: nicking
ms.custom: seodec18

---
# Restore an app in Azure from a snapshot
This article shows you how to restore an app in [Azure App Service](../app-service/overview.md) from a snapshot. You can restore your app to a previous state, based on one of your app's snapshots. You do not need to enable snapshot backups; the platform automatically saves a hourly snapshot of each app's content and configuration for data recovery purposes. Hourly snapshots for the last 30 days are available. The retention period and snapshot frequency are not configurable.

Restoring from snapshots is available to apps running in one of the **Standard** or **Premium** tiers. For information about scaling up your app, see [Scale up an app in Azure](manage-scale-up.md).

> [!NOTE]
> Snapshot restore is not available for: 
>
> - App Service environments (**Isolated** tier)
> - Azure Functions in the [**Consumption**](../azure-functions/consumption-plan.md) or [**Elastic Premium**](../azure-functions/functions-premium-plan.md) pricing plans.
>
> Snapshot restore is available in preview for Azure Functions in [dedicated (App Service)](../azure-functions/dedicated-plan.md) **Standard** or **Premium** tiers.

## Snapshots vs Backups

Snapshots are incremental shadow copies and offer several advantages over [standard backups](manage-backup.md):

- No file copy errors due to file locks.
- Higher maximum snapshot size (30GB).
- Enabled by default in supported pricing tiers and no configuration required.
- Restored to a new or existing App Service app or slot in any Azure region.

## What snapshot restore includes

> [!NOTE]
> Maximum supported size for snapshot restore is 30GB. Snapshot restore fails if your storage size is greater than 30GB. To reduce your storage size, consider moving files like logs, images, audios, and videos to [Azure Storage](../storage/index.yml), for example.

When you restore a snapshot, the following content and configuration are restored:

# [Windows apps](#tab/windowsnative)

- All app content under `%HOME%`

# [Linux apps](#tab/linux)

- All app content under `/home`

# [Custom containers (Windows and Linux)](#tab/windowscontainers)

- Content in [persistent storage](configure-custom-container.md?pivots=container-linux#use-persistent-shared-storage)

-----

- [Native log settings](troubleshoot-diagnostic-logs.md), including the Azure Storage account and container to write logs to, if applicable.
- Application Insights configuration.
- [Health check](monitor-instances-health-check.md).
- If you [run your app directly from a ZIP package](deploy-run-package.md), snapshot backups don't include the content of the ZIP package.

The following content and configuration are *not included*. You must configure them manually after the restore:

- Content of the [run-from-ZIP package](deploy-run-package.md)
- Content from [custom mounted Azure storage](configure-connect-to-azure-storage.md?pivots=container-windows)
- Network features, such as [private endpoints](networking/private-endpoint.md), [hybrid connections](app-service-hybrid-connections.md), and [virtual network integration](overview-vnet-integration.md).
- [Authentication](overview-authentication-authorization.md)
- [Managed identities](overview-managed-identity.md)
- [Custom domains](app-service-web-tutorial-custom-domain.md)
- [TLS/SSL](configure-ssl-bindings.md)
- [Scale out](../azure-monitor/autoscale/autoscale-get-started.md?toc=/azure/app-service/toc.json)
- [Diagnostics with Azure Monitor](troubleshoot-diagnostic-logs.md#send-logs-to-azure-monitor)
- [Alerts and Metrics](../azure-monitor/alerts/alerts-classic-portal.md)
- [Backup](manage-backup.md)
- Associated [deployment slots](deploy-staging-slots.md)
- Any connected database that [standard backup](manage-backup.md#what-gets-backed-up) supports

## Restore from a snapshot

> [!NOTE]
> You can only restore to apps in the same resource group and region combination.
> 

# [Azure portal](#tab/portal)

1. On the **Settings** page of your app in the [Azure portal](https://portal.azure.com), click **Backups** to display the **Backups** page. Then click **Restore** under the **Snapshot** section.
   
    :::image type="content" source="./media/app-service-web-restore-snapshots/1.png" alt-text="Screenshot that shows how to restore an app from a snapshot.":::

2. In the **Restore** page, select the snapshot to restore.
   
    <!-- ![Screenshot that shows how to select the snapshot to restore. ](./media/app-service-web-restore-snapshots/2.png) -->
   
3. Specify the destination for the app restore in **Restore destination**. To restore to an existing [deployment slot](deploy-staging-slots.md), select **Existing app**. 
   
    <!-- ![Screenshot that shows how to specify the restoration destination.](./media/app-service-web-restore-snapshots/3.png) -->
   
   > [!NOTE]
   > It's recommended that you restore to a deployment slot and then perform a swap into production. If you choose **Overwrite**, all existing data in your app's current file system is erased and overwritten. Before you click **OK**, make sure that it is what you want to do.
   > 
      
4. You can choose to restore your site configuration.
   
    :::image type="content" source="./media/app-service-web-restore-snapshots/4.png" alt-text="Screenshot that shows how to restore site configuration.":::

5. Click **OK**.

# [Azure CLI](#tab/cli)

1. List the restorable snapshots for your app and copy the timestamp of the one you want to restore.

    ```azurecli-interactive
    az webapp config snapshot list --name <app-name> --resource-group <group-name>
    ```

2. To restore the snapshot by overwriting the app's content and configuration:

    ```azurecli-interactive
    az webapp config snapshot restore --name <app-name> --resource-group <group-name> --time <snapshot-timestamp>
    ```

    To restore the snapshot to a different app:

    ```azurecli-interactive
    az webapp config snapshot restore --name <target-app-name> --resource-group <target-group-name> --source-name <source-app-name> --source-resource-group <source-group-name> --time <source-snapshot-timestamp>
    ```

    To restore app content only and not the app configuration, use the `--restore-content-only` parameter. For more information, see [az webapp config snapshot restore](/cli/webapp/config/snapshot#az_webapp_config_snapshot_restore).

-----