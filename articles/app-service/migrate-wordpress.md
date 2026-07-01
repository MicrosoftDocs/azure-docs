---
title: Migrate WordPress to App Service on Linux
description: Learn how to migrate WordPress from App Service on Windows or from external hosting providers to App Service on Linux.
author: msangapu-msft
ms.service: azure-app-service
ms.topic: how-to
ms.date: 12/02/2025
ms.update-cycle: 1095-days
ms.author: msangapu
ms.devlang: php
ms.custom:
  - linux-related-content
  - sfi-image-nochange
# Customer intent: As a developer, I want to migrate WordPress to App Service on Linux. 
---

# Migrate WordPress to App Service on Linux

This article describes how to migrate WordPress from Azure App Service on Windows or from external hosting providers to App Service on Linux.

> [!NOTE]
> Migrate the content to a test instance, and validate all scenarios. If everything works as expected, swap this instance to the production slot.
>

You can migrate your site to WordPress on Azure App Service in two ways:

- [All-in-One WP Migration and Backup plugin](#migrate-wordpress-by-using-all-in-one-wp-migration-plugin)
- [Manual migration process](#manual-migration-process)

## Migrate WordPress by using All-in-One WP Migration plugin

The [All-in-One WP Migration and Backup](https://wordpress.org/plugins/all-in-one-wp-migration) plugin is popular for migrating sites with ease. This approach is recommended for sites that are less than 256 MB. For larger sites, you can either *purchase the premium version* of the plugin or *migrate manually* by using the steps outlined in the [manual migration process](#manual-migration-process).

By default, the file upload size for WordPress on App Service (Linux) is limited to 50 MB, and it can be increased to a maximum limit of 256 MB. To change the file upload limit, add the following [application settings](configure-common.md?tabs=portal) in App Service.

|    Application setting    | Default value | New value   |
|---------------------------|---------------|-------------|
|    UPLOAD_MAX_FILESIZE    |      50M      |   256M      |
|    POST_MAX_SIZE          |      128M     |   256M      |

> [!IMPORTANT]
> Install the All-in-One WP Migration and Backup plugin on both the source and target sites.
>

### Export the data from the source

1. Sign in to the WordPress admin dashboard for the source site.
1. Open the All-in-One WP Migration and Backup plugin.
1. Select **Export**, and then specify the export type as **File**.
1. Download the file.

### Import the data at the destination

1. Sign in to the WordPress admin dashboard for your target site.
1. Open the All-in-One WP Migration and Backup plugin.
1. Select **Import**, and choose **File** as the import source.
1. Upload the file downloaded in the previous section, then select **Proceed**.
1. Select **Permalink Settings** to update the permalinks structure. Select **Save changes**.
1. Select **Finish** to complete the import process.

## Manual migration process

As a prerequisite, the WordPress instance on App Service must have been created with an [appropriate Linux hosting plan](https://aka.ms/linux-wordpress).

### Manually export the data at source site

> [!NOTE]
> Depending on the size of your content and your internet connection, this operation could take several minutes.
>

1. Download the *wp-content* folder from the source site. You can use FTP tools like [FileZilla](https://filezilla-project.org/download.php?type=client) to connect to the web server and download the content.

1. Export the contents of the source database into a SQL file. You can perform this task either by using MySQL client tools like HeidiSQL, [MySQL workbench](https://dev.mysql.com/downloads/workbench/), [phpMyAdmin](https://docs.phpmyadmin.net/en/latest/setup.html), or by using the command-line interface. For more information, see [Data Export and Import Wizard](https://dev.mysql.com/doc/workbench/en/wb-admin-export-import-management.html).

### Manually import the data at destination site

1. Create a new WordPress app by using our [WordPress on App Service template](https://aka.ms/linux-wordpress) for Linux.

1. Under **Development Tools** on the sidebar menu, select **SSH**.

    :::image type="content" source="media/app-service-migrate-wordpress/post-startup-script-1.png" alt-text="Screenshot of the button to launch the SSH web console.":::

1. Delete the existing content of the */home/site/wwwroot/wp-content* folder using the following command.

   ```bash
   rm -rf /home/site/wwwroot/wp-content/* 
   ```

1. Upload the new contents of the *wp-content* folder using the File Manager. Select the label that says **Drag a File/Folder here to upload, or click to select one**.

1. You can either [use an existing MySQL database](https://github.com/Azure/wordpress-linux-appservice/blob/main/WordPress/using_an_existing_mysql_database.md) or migrate the content to a new Azure MySQL Flexible Server created by App Service on Linux.

    > [!NOTE]
    > Azure Database for MySQL - Single Server was retired in 2024. If your existing MySQL database is hosted on Azure Database for MySQL - Single Server, consider migrating to Azure Database for MySQL - Flexible Server by using the following steps, or by using [Azure Database Migration Service (DMS)](/azure/dms/tutorial-mysql-azure-external-to-flex-online-portal).

1. If you migrate the database, import the SQL file downloaded from the source database into the database of your newly created WordPress site. You can do it via the PhpMyAdmin dashboard available at `<sitename>.azurewebsites.net/phpmyadmin`. If you're unable to use one single large SQL file, separate the files into parts and try uploading again. To import the database through phpMyAdmin, see [Import](https://docs.phpmyadmin.net/en/latest/import_export.html#import).

1. In your App Service app, select **Settings**, then choose **Environment variables**. Under **App Settings**, update **DATABASE_NAME** with the source database name. This restarts your app and the new changes are reflected. To learn more, see [WordPress Application Settings](https://github.com/Azure/wordpress-linux-appservice/blob/main/WordPress/wordpress_application_settings.md).

    |    Application setting    | Update required?                         |
    |---------------------------|------------------------------------------|
    |    DATABASE_NAME          |      Yes, replace with the source (exported) database name |
    |    DATABASE_HOST          |      Not required                        |
    |    DATABASE_USERNAME      |      Not required                        |
    |    DATABASE_PASSWORD      |      Not required                        |

    :::image type="content" source="media/app-service-migrate-wordpress/wordpress-database-application-settings.png" alt-text="Screenshot of the Database Application Settings.":::

## Post migration actions

### Install recommended plugins

After the site migration, you should validate that you have the default recommended or equivalent plugins activated and configured as before. If you're prohibited from not configuring them as per your organization governing policies, then you can uninstall the plugins.

- The W3TC plugin should be activated and configured properly to use the local Redis cache server and Azure Blob Storage (if it was configured to use them originally). For more information, see the following articles:

  - [Local Redis Cache](https://github.com/Azure/wordpress-linux-appservice/blob/main/WordPress/wordpress_local_redis_cache.md)
  - [Azure Blob Storage](https://github.com/Azure/wordpress-linux-appservice/blob/main/WordPress/wordpress_azure_blob_storage.md)

- WP Smush plugin is activated and configured properly for image optimization. For more information, see [Image Optimizations in WordPress](https://github.com/Azure/wordpress-linux-appservice/blob/main/WordPress/wordpress_image_compression.md).

### Configure recommended WordPress settings

The following WordPress settings are recommended. However, when the users migrate their custom sites, it's up to them to decide whether to use these settings or not.

1. Open the WordPress admin dashboard.
1. Set the permalink structure to **day and name** since it performs better compared to the plain permalinks that use the format **?p=123**.
1. Under the comment settings, enable the option to break comments into pages.
1. Show excerpts instead of the full post in the feed.

## Search and replace (paths and domains)

One common issue that users face during migration is that some of the contents of their old site use absolute URLs or paths instead of relative ones. To resolve this issue, you can use plugins like [Search and Replace](https://wordpress.org/plugins/search-replace/) to update the database records.

## Configure a custom domain

To configure your site with a custom domain, see [Set up an existing custom domain](app-service-web-tutorial-custom-domain.md?tabs=a%2Cazurecli).

## Migrate a custom domain

When you migrate a live site and its DNS domain name to App Service, that DNS name is already serving live traffic. You can avoid DNS resolution downtime by binding the active DNS name to your app as described in [Migrate an existing domain](manage-custom-dns-migrate-domain.md).

## Update SSL certificates

If your site is configured with Secure Sockets Layer (SSL) certs, then follow [Add and manage TLS/SSL certificates](configure-ssl-certificate.md?tabs=apex%2Cportal) to configure SSL.

## Related content

- [What is WordPress on App Service?](overview-wordpress.md)
