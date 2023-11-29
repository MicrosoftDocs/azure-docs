---
title: Back up an app
description: Learn how to restore backups of your apps in Azure App Service or configure custom backups. Customize backups by including the linked database.
ms.assetid: 6223b6bd-84ec-48df-943f-461d84605694
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 04/25/2023
author: msangapu-msft
ms.author: msangapu
---

# Back up and restore your app in Azure App Service

In [Azure App Service](overview.md), you can easily restore app backups. You can also make on-demand custom backups or configure scheduled custom backups. You can restore a backup by overwriting an existing app by restoring to a new app or slot. This article shows you how to restore a backup and make custom backups.

Back up and restore are supported in **Basic**, **Standard**, **Premium**, and **Isolated** tiers. For **Basic** tier, only the production slot can be backed up and restored. For more information about scaling your App Service plan to use a higher tier, see [Scale up an app in Azure](manage-scale-up.md).

> [!NOTE]
> For App Service Environments:
> 
> - Automatic backups can be restored to a target app within the App Service environment itself, not in another App Service environment.
> - Custom backups can be restored to a target app in another App Service environment, such as from App Service Environment v2 to App Service Environment v3.
> - Backups can be restored to target app of the same OS platform as the source app.

[!INCLUDE [backup-restore-vs-disaster-recovery](./includes/backup-restore-disaster-recovery.md)]

## Automatic vs. custom backups

There are two types of backups in App Service. Automatic backups made for your app regularly as long as it's in a supported pricing tier. Custom backups require initial configuration, and can be made on-demand or on a schedule. The following table shows the differences between the two types.

|Feature|Automatic backups | Custom backups |
|-|-|-|
| Pricing tiers | **Basic**, **Standard**, **Premium**, **Isolated**. | **Basic**, **Standard**, **Premium**, **Isolated**. |
| Configuration required | No. | Yes. |
| Backup size | 30 GB. | 10 GB, 4 GB of which can be the linked database. |
| Linked database | Not backed up. | The following linked databases can be backed up: [SQL Database](/azure/azure-sql/database/), [Azure Database for MySQL](../mysql/index.yml), [Azure Database for PostgreSQL](../postgresql/index.yml), [MySQL in-app](https://azure.microsoft.com/blog/mysql-in-app-preview-app-service/). |
| [Storage account](../storage/index.yml) required | No. | Yes. |
| Backup frequency | Hourly, not configurable. | Configurable. |
| Retention | 30 days, not configurable. <br>- Days 1-3: hourly backups retained.<br>- Days 4-14: every 3 hourly backup retained.<br>- Days 15-30: every 6 hourly backup retained. | 0-30 days or indefinite. |
| Downloadable | No. | Yes, as Azure Storage blobs. |
| Partial backups | Not supported. | Supported. |
| Back up over VNet | Not supported. | Supported. |

<!-- - No file copy errors due to file locks. -->

## Restore a backup

> [!NOTE]
> App Service stops the target app or target slot while restoring a backup. To minimize downtime for the production app, restore the backup to a [deployment slot](deploy-staging-slots.md) first, then [swap](deploy-staging-slots.md#swap-two-slots) into production.

# [Azure portal](#tab/portal)

1. In your app management page in the [Azure portal](https://portal.azure.com), in the left menu, select **Backups**. The **Backups** page lists all the automatic and custom backups for your app and the status of each.
   
    :::image type="content" source="./media/manage-backup/open-backups-page.png" alt-text="Screenshot that shows how to open the backups page.":::

1. Select the automatic backup or custom backup to restore by clicking its **Restore** link.
   
    :::image type="content" source="./media/manage-backup/click-restore-link.png" alt-text="Screenshot that shows how to select the restore link.":::
   
1. The **Backup details** section is automatically populated for you. 

1. Specify the restore destination in **Choose a destination**. To restore to a new app, select **Create new** under the **App Service** box. To restore to a new [deployment slot](deploy-staging-slots.md), select **Create new** under the **Deployment slot** box. 

    If you choose an existing slot, all existing data in its file system is erased and overwritten. The production slot has the same name as the app name.
   
1. You can choose to restore your site configuration under **Advanced options**.
   
1. Click **Restore**.

# [Azure CLI](#tab/cli)

<!-- # [Automatic backups](#tab/cli/auto) -->

1. List the automatic backups for your app. In the command output, copy the `time` property of the backup you want to restore.

    ```azurecli-interactive
    az webapp config snapshot list --name <app-name> --resource-group <group-name>
    ```

2. To restore the automatic backup by overwriting the app's content and configuration:

    ```azurecli-interactive
    az webapp config snapshot restore --name <app-name> --resource-group <group-name> --time <snapshot-timestamp>
    ```

    To restore the automatic backup to a different app:

    ```azurecli-interactive
    az webapp config snapshot restore --name <target-app-name> --resource-group <target-group-name> --source-name <source-app-name> --source-resource-group <source-group-name> --time <source-snapshot-timestamp>
    ```

    To restore app content only and not the app configuration, use the `--restore-content-only` parameter. For more information, see [az webapp config snapshot restore](/cli/azure/webapp/config/snapshot#az-webapp-config-snapshot-restore).

<!-- # [Custom backups](#tab/cli/custom)

1. List the custom backups for your app and copy the `namePropertiesName` and `storageAccountUrl` properties of the backup you want to restore.

    ```azurecli-interactive
    az webapp config backup list --webapp-name <app-name> --resource-group <group-name>
    ```

2. To restore the custom backup by overwriting the app's content and configuration:

    ```azurecli-interactive
    az webapp config backup restore --webapp-name <app-name> --resource-group <group-name> --backup-name <namePropertiesName> --container-url <storageAccountUrl> --overwrite
    ```

    To restore the custom backup to a different app:

    ```azurecli-interactive
    az webapp config backup restore --webapp-name <source-app-name> --resource-group <group-name> --target-name <target-app-name> --time <source-snapshot-timestamp> --backup-name <namePropertiesName> --container-url <storageAccountUrl>
    ```

----- -->

-----

<a name="manualbackup"></a>

## Create a custom backup

1. In your app management page in the [Azure portal](https://portal.azure.com), in the left menu, select **Backups**.

    :::image type="content" source="./media/manage-backup/open-backups-page.png" alt-text="Screenshot that shows how to open the backups page.":::

1. At the top of the **Backups** page, select **Configure custom backups**.

1. In **Storage account**, select an existing storage account (in the same subscription) or select **Create new**. Do the same with **Container**.

    To back up the linked databases, select **Next: Advanced** > **Include database**, and select the databases to backup.

    > [!NOTE]
    > For a supported database to appear in this list, its connection string must exist in the **Connection strings** section of the **Configuration** page for your app. 
    >
    > In-app MySQL databases are backed up always without any configuration. If you make settings for in-app MySQL databases manually, such as adding connection strings, the backups may not work correctly.
    >
    >

1. Click **Configure**.

    Once the storage account and container is configured, you can initiate an on-demand backup at any time. On-demand backups are retained indefinitely.

1. At the top of the **Backups** page, select **Backup Now**.

    :::image type="content" source="./media/manage-backup/manual-backup.png" alt-text="Screenshot that shows how to make an on-demand backup.":::

    The custom backup is displayed in the list with a progress indicator. If it fails with an error, you can select the line item to see the error message.

<a name="automatedbackups"></a>

## Configure custom scheduled backups

1. In the **Configure custom backups** page, select **Set schedule**.

1. Configure the backup schedule as desired and select **Configure**.

#### Back up and restore a linked database

Custom backups can include linked databases (except when the backup is configured over an Azure Virtual Network). To make sure your backup includes a linked database, do the following:

1. Make sure the linked database is [supported](#automatic-vs-custom-backups).
1. Create a connection string that points to your database. A database is considered "linked" to your app when there's a valid connection string for it in your app's configuration.
1. Follow the steps in [Create a custom backup](#create-a-custom-backup) to select the linked database in the **Advanced** tab.

To restore a database that's included in a custom backup:

1. Follow the steps in [Restore a backup](#restore-a-backup).
1. In **Advanced options**, select **Include database**.

For troubleshooting information, see [Why is my linked database not backed up](#why-is-my-linked-database-not-backed-up).

## Back up and restore over Azure Virtual Network (preview)

With [custom backups](#create-a-custom-backup), you can back up your app's files and configuration data to a firewall-protected storage account if the following requirements are fulfilled:

- The app is [integrated with a virtual network](overview-vnet-integration.md), or the app is in a v3 [App Service environment](environment/app-service-app-service-environment-intro.md).
- The storage account has [granted access from the virtual network](../storage/common/storage-network-security.md#grant-access-from-a-virtual-network) that the app is integrated with, or that the v3 App Service environment is created with.

To back up and restore over Azure Virtual Network:

1. When configuring [custom backups](#create-a-custom-backup), select **Backup/restore over virtual network integration**. 
1. Save your settings by selecting **Configure**.

If you don't see the checkbox, or if the checkbox is disabled, verify that you have fulfilled the aforementioned requirements. 

Once the configuration is saved, any manual, scheduled backup, or restore is made through the virtual network. If you make changes to the app, the virtual network, or the storage account that prevent the app from accessing the storage account through the virtual network, the backup or restore operations will fail.

<a name="partialbackups"></a>

## Configure partial backups

Partial backups are supported for custom backups (not for automatic backups). Sometimes you don't want to back up everything on your app. Here are a few examples:

* You [set up weekly backups](#configure-custom-scheduled-backups) of your app that contains static content that never changes, such as old blog posts or images.
* Your app has over 10 GB of content (that's the max amount you can back up at a time).
* You don't want to back up the log files.

To exclude folders and files from being stored in your future backups, create a `_backup.filter` file in the [`%HOME%\site\wwwroot` folder](operating-system-functionality.md#network-drives-unc-shares) of your app. Specify the list of files and folders you want to exclude in this file.

> [!TIP]
> You can access your files by navigating to `https://<app-name>.scm.azurewebsites.net/DebugConsole`. If prompted, sign in to your Azure account.

Identify the folders that you want to exclude from your backups. For example, you want to filter out the highlighted folder and files.

:::image type="content" source="./media/manage-backup/kudu-images.png" alt-text="Screenshot that shows files and folders to exclude from backups.":::

Create a file called `_backup.filter` and put the preceding list in the file, but remove the root `%HOME%`. List one directory or file per line. So the content of the file should be:

```
\site\wwwroot\Images\brand.png
\site\wwwroot\Images\2014
\site\wwwroot\Images\2013
```

Upload `_backup.filter` file to the `D:\home\site\wwwroot\` directory of your site using [ftp](deploy-ftp.md) or any other method. If you wish, you can create the file directly using Kudu `DebugConsole` and insert the content there.

Run backups the same way you would normally do it, [custom on-demand](#create-a-custom-backup) or [custom scheduled](#configure-custom-scheduled-backups). Any files and folders that are specified in `_backup.filter` are excluded from the future backups.

> [!NOTE]
> `_backup.filter` changes the way a restore works. Without `_backup.filter`, restoring a backup deletes all existing files in the app and replaces them with the files in the backup. With `_backup.filter`, any content in the app's file system that's included in `_backup.filter` is left as is (not deleted).
>

<a name="aboutbackups"></a>

## How backups are stored

After you have made one or more backups for your app, the backups are visible on the **Containers** page of your storage account, and your app. In the storage account, each backup consists of a`.zip` file that contains the backup data and an `.xml` file that contains a manifest of the `.zip` file contents. You can unzip and browse these files if you want to access your backups without actually performing an app restore.

The database backup for the app is stored in the root of the .zip file. For SQL Database, this is a BACPAC file (no file extension) and can be imported. To create a database in Azure SQL Database based on the BACPAC export, see [Import a BACPAC file to create a database in Azure SQL Database](/azure/azure-sql/database/database-import).

> [!WARNING]
> Altering any of the files in your **websitebackups** container can cause the backup to become invalid and therefore non-restorable.

## Error messages

The **Backups** page shows you the status of each backup. To get log details regarding a failed backup, select the line item in the list. Use the following table to help you troubleshoot your backup. If the failure isn't documented in the table, open a support ticket.

| Error | Fix |
| - | - |
| Storage access failed. | Delete backup schedule and reconfigure it. Or, reconfigure the backup storage. |
| The website + database size exceeds the {0} GB limit for backups. Your content size is {1} GB. | [Exclude some files](#configure-partial-backups) from the backup, or remove the database portion of the backup and use externally offered backups instead. |
| Error occurred while connecting to the database {0} on server {1}: Authentication to host '{1}' for user '\<username>' using method 'mysql_native_password' failed with message: Unknown database '\<db-name>' | Update database connection string. |
| Cannot resolve {0}. {1} (CannotResolveStorageAccount) | Delete the backup schedule and reconfigure it. |
| Login failed for user '{0}'. | Update the database connection string. |
| Create Database copy of {0} ({1}) threw an exception. Could not create Database copy. | Use an administrative user in the connection string. |
| The server principal "\<name>" is not able to access the database "master" under the current security context. Cannot open database "master" requested by the login. The login failed. Login failed for user '\<name>'. | Use an administrative user in the connection string. |
| A network-related or instance-specific error occurred while establishing a connection to SQL Server. The server was not found or was not accessible. Verify that the instance name is correct and that SQL Server is configured to allow remote connections. (provider: Named Pipes Provider, error: 40 - Could not open a connection to SQL Server). | Check that the connection string is valid. Allow the app's [outbound IPs](overview-inbound-outbound-ips.md) in the database server settings. |
| Cannot open server "\<name>" requested by the login. The login failed. | Check that the connection string is valid. |
| Missing mandatory parameters for valid Shared Access Signature. | Delete the backup schedule and reconfigure it. |
| SSL connection is required. Please specify SSL options and retry when trying to connect. | SSL connectivity to Azure Database for MySQL and Azure Database for PostgreSQL isn't supported for database backups. Use the native backup feature in the respective database instead. |

## Automate with scripts

You can automate backup management with scripts, using the [Azure CLI](/cli/azure/install-azure-cli) or [Azure PowerShell](/powershell/azure/).

For samples, see:

- [Azure CLI samples](samples-cli.md)
- [Azure PowerShell samples](samples-powershell.md)

## Frequently asked questions

<a name="requirements"></a>

<a name="whatsbackedup"></a>

- [Are the backups incremental updates or complete backups?](#are-the-backups-incremental-updates-or-complete-backups)
- [Does Azure Functions support automatic backups?](#does-azure-functions-support-automatic-backups)
- [What's included in an automatic backup?](#whats-included-in-an-automatic-backup)
- [What's included in a custom backup?](#whats-included-in-a-custom-backup)
- [Why is my linked database not backed up?](#why-is-my-linked-database-not-backed-up)
- [What happens if the backup size exceeds the allowable maximum?](#what-happens-if-the-backup-size-exceeds-the-allowable-maximum)
- [Can I use a storage account that has security features enabled?](#can-i-use-a-storage-account-that-has-security-features-enabled)
- [How do I restore to an app in a different subscription?](#how-do-i-restore-to-an-app-in-a-different-subscription)
- [How do I restore to an app in the same subscription but in a different region?](#how-do-i-restore-to-an-app-in-the-same-subscription-but-in-a-different-region)
- [Where are the automatic backups stored?](#where-are-the-automatic-backups-stored)
- [How do I stop the automatic backup?](#how-do-i-stop-the-automatic-backup)

#### Are the backups incremental updates or complete backups?

Each backup is a complete offline copy of your app, not an incremental update.

#### Does Azure Functions support automatic backups?

Automatic backups are available for Azure Functions in [dedicated (App Service)](../azure-functions/dedicated-plan.md) **Basic** or **Standard** or **Premium** tiers. Function apps in the [**Consumption**](../azure-functions/consumption-plan.md) or [**Elastic Premium**](../azure-functions/functions-premium-plan.md) pricing tiers aren't supported for automatic backups.

#### What's included in an automatic backup?

The following table shows which content is backed up in an automatic backup:

|Settings| Restored?|
|-|-|
| **Windows apps**: All app content under `%HOME%` directory<br/>**Linux apps**: All app content under `/home` directory<br/>**Custom containers (Windows and Linux)**: Content in [persistent storage](configure-custom-container.md?pivots=container-linux#use-persistent-shared-storage)| Yes |
| Content of the [run-from-ZIP package](deploy-run-package.md)| No |
| Content from any [custom mounted Azure storage](configure-connect-to-azure-storage.md?pivots=container-windows), such as from an Azure Files share. | No |

The following table shows which app configuration is restored when you choose to restore app configuration:

|Settings| Restored?|
|-|-|
|[Native log settings](troubleshoot-diagnostic-logs.md), including the Azure Storage account and container settings | Yes |
|Application Insights configuration | Yes |
|[Health check](monitor-instances-health-check.md) | Yes |
| Network features, such as [private endpoints](networking/private-endpoint.md), [hybrid connections](app-service-hybrid-connections.md), and [virtual network integration](overview-vnet-integration.md) | No|
|[Authentication](overview-authentication-authorization.md)| No|
|[Managed identities](overview-managed-identity.md)| No |
|[Custom domains](app-service-web-tutorial-custom-domain.md)| No |
|[TLS/SSL](configure-ssl-bindings.md)| No |
|[Scale out](../azure-monitor/autoscale/autoscale-get-started.md?toc=/azure/app-service/toc.json)| No |
|[Diagnostics with Azure Monitor](troubleshoot-diagnostic-logs.md#send-logs-to-azure-monitor)| No |
|[Alerts and Metrics](../azure-monitor/alerts/alerts-classic-portal.md)| No |
|[Backup](manage-backup.md)| No |
|Associated [deployment slots](deploy-staging-slots.md)| No |
|Any linked database that [custom backup](#whats-included-in-a-custom-backup) supports| No |

#### What's included in a custom backup?

A custom backup (on-demand backup or scheduled backup) includes all content and configuration that's included in an [automatic backup](#whats-included-in-an-automatic-backup), plus any linked database, up to the allowable maximum size.

When [backing up over an Azure Virtual Network](#back-up-and-restore-over-azure-virtual-network-preview), you can't [back up the linked database](#back-up-and-restore-a-linked-database).

#### Why is my linked database not backed up?

Linked databases are backed up only for custom backups, up to the allowable maximum size. If the maximum backup size (10 GB) or the maximum database size (4 GB) is exceeded, your backup fails. Here are a few common reasons why your linked database isn't backed up: 

* Backups of [TLS enabled Azure Database for MySQL](../mysql/concepts-ssl-connection-security.md) isn't supported. If a backup is configured, you'll encounter backup failures.
* Backups of [TLS enabled Azure Database for PostgreSQL](../postgresql/concepts-ssl-connection-security.md) isn't supported. If a backup is configured, you'll encounter backup failures.
* In-app MySQL databases are automatically backed up without any configuration. If you make manual settings for in-app MySQL databases, such as adding connection strings, the backups may not work correctly.

#### What happens if the backup size exceeds the allowable maximum?

Automatic backups can't be restored if the backup size exceeds the maximum size. Similarly, custom backups fail if the maximum backup size or the maximum database size is exceeded. To reduce your storage size, consider moving files like logs, images, audio, and videos to Azure Storage, for example.

#### Can I use a storage account that has security features enabled?

You can back up to a firewall-protected storage account if it's part of the same virtual network topology as your app. See [Back up and restore over Azure Virtual Network (preview)](#back-up-and-restore-over-azure-virtual-network-preview).

#### How do I restore to an app in a different subscription?

1. Make a custom backup to an Azure Storage container.
1. [Download the backup ZIP file](../storage/blobs/storage-quickstart-blobs-portal.md) to your local machine.
1. In the **Backups** page for your target app, select **Restore** in the top menu.
1. In **Backup details**, select **Storage** in **Source**.
1. Select the preferred storage account.
1. In **Zip file**, select **Upload file**.
1. In Name, select **Browse** and select the downloaded ZIP file.
1. Configure the rest of the sections like in [Restore a backup](#restore-a-backup).

#### How do I restore to an app in the same subscription but in a different region?

The steps are the same as in [How do I restore to an app in a different subscription](#how-do-i-restore-to-an-app-in-a-different-subscription).

#### Where are the automatic backups stored?

Automatic backups are simple and stored in the same datacenter as the App Service and should not be relied upon as your disaster recovery plan.

#### How do I stop the automatic backup?

You cannot stop automatic backup. The automatic backup is stored on the platform and has no effect on the underlying app instance or its storage.


<a name="nextsteps"></a>

## Next Steps

[Azure Blob Storage documentation](../storage/blobs/index.yml)
