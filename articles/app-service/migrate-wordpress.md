---
title: Migrate WordPress to App Service on Linux
description: Migrate WordPress to App Service on Linux.
author: msangapu-msft

ms.topic: article
ms.date: 12/12/2022
ms.author: msangapu
ms.devlang: php
ms.custom: seodec18

---
# WordPress Migration to Linux App Service

This document describes two approaches for migrating your WordPress sites from Windows App Services or any other external hosting provider to WordPress deployed to Linux App Services, preferably created from [Azure Market Place](https://aka.ms/linux-wordpress). These migration approaches will let you continue with the existing WordPress site as it is. It is recommended to transition the traffic to the new site after all the validations are taken place, site is successfully up and running.

>**Note:** Migrate the content to a test instance first, validate all E2E scenarios of your website, and if everything works as expected, swap this instance to the production slot.

 You can migrate your site to WordPress on Azure App Service in two ways:

 1. With WordPress plugin All-In-One WP Migration
 2. Manual process of migration

## All-In-One WP Migration Plugin

This is a very popular and trusted plugin used for migrating sites with ease and is also recommended by the Azure WordPress team. However, there are certain things that need to be taken care of before starting on the WordPress migration.

This approach is recommended for smaller sites where the content size is less than 256MB. If it is more, you can either **purchase the premium version** of the plugin, which allows you to bypass the file upload limit, or you can **manually migrate** the site using the steps outlined in the next section.

By default, the file upload size for WordPress on Linux App Services is limited to 50MB, and it can be increased up to 256MB (Maximum Limit). To change the file upload size limit, you need to add the following Application Settings in the App Service and save it.

|    Application Setting Name    | Default Value | New Value   |
|--------------------------------|---------------|-------------|
|    UPLOAD_MAX_FILESIZE         |      50M      |   256M      |
|    POST_MAX_SIZE               |      128M     |   256M      |

If you choose to migrate the site using this plugin, install All-In-One Migration plugin on both source and target sites.

### Export the data at source site

1. Launch WordPress Admin page
1. Open All-In-One WP Migration plugin
1. Click on 'Export' option and specify the export type as file
1. This bundles the contents of database, media files, plugins, and themes into a single file, which can then be downloaded.

### Import the data at destination site

1. Launch WordPress Admin page
1. Open All-In-One WP Migration plugin
1. Click on import option on the destination site, and upload the file downloaded in previous section
1. Empty the caches in W3TC plugin (or any other caches) and validate the content of the site.
    - Click on the **Performance** option given in the left sidebar of the admin panel to open the W3TC plugin.
    - Then click on the **Dashboard** option shown below it.
    - On the dashboard, you will see a button with the label **Empty All Caches**.

## Manual Migration Process

The prerequisite is that the WordPress on Linux Azure App Service must have been created with an appropriate hosting plan from here: [WordPress on Linux App Service](https://aka.ms/linux-wordpress).

### Manually Export the data at source site

>**NOTE:** Depending on the size of your content and your internet connection, this operation could take sometime.

1. Download the **wp-content** folder from the source site. You can use popular FTP tools like [FileZilla](https://filezilla-project.org/download.php?type=client) to connect to the web server and download the content.

1. Export the contents of the source database into an SQL file. You can perform this task either using MySQL client tools like HeidiSQL, [MySQL workbench](https://dev.mysql.com/downloads/workbench/), [PhpMyAdmin](https://docs.phpmyadmin.net/en/latest/setup.html) or through command line interface. For more information on exporting the database, please refer to the following [documentation](https://dev.mysql.com/doc/workbench/en/wb-admin-export-import-management.html).

### Manually Import the data at destination site

1. Create a new Wordpress app using our [WordPress on Linux App Service template](https://aka.ms/linux-wordpress)

2. Open an SSH session using **WebSSH** from the Azure portal.
![Web SSH](./media/post_startup_script_1.png)

3. Delete the existing content of **/home/site/wwwroot/wp-content** folder using the following command.

   ```bash
   rm -rf /home/site/wwwroot/wp-content/* 
   ```

4. Upload the new contents of **wp-content** folder using the File Manager. Click on the label that says '**Drag a File/Folder here to upload, or click to select one**'. Please note that if you are not able to upload everything at once, then you can try dividing your upload into multiple smaller ones.

   <!TODO: we should prob recomend doing this over FTP, it's more reliable than web upload through SCM site?>

5. You can either point your WordPress to [use an existing MySQL database](./using_an_existing_mysql_database.md), or use the steps below to migrate the content to the new database server (an Azure Database for MySQL flexible server) created by the WordPress on Linux App Services offering.

	>**NOTE:** Azure Database for MySQL - Single Server is on the road to retirement by 16 September 2024. If your existing MySQL database is hosted on Azure Database for MySQL - Single Server, please consider migrating to Azure Database for MySQL - Flexible Server using the following steps, or using [Azure Database Migration Service (DMS)](https://learn.microsoft.com/azure/mysql/single-server/whats-happening-to-mysql-single-server#migrate-from-single-server-to-flexible-server).

6. If you chose to migrate the database, import the SQL file downloaded from the source database into the database of your newly created WordPress site. You can do it via the PhpMyAdmin dashboard available at **\<sitename\>.azurewebsites.net/phpmyadmin**. Please note that if you are unable to one single large SQL file, please try to break it into multiple smaller parts and try uploading. Steps to import the database through phpmyadmin are described [here](https://docs.phpmyadmin.net/en/latest/import_export.html#import).

7. Launch the Azure Portal and navigate to your **App Service -> Configuration** blade. Update the database name in the **Application Settings** of App Service and save it. This will restart your App and the new changes will get reflected.  [Learn more: WordPress Application Settings](./wordpress_application_settings.md)

    |    Application Setting Name    | Update Required?                         |
    |--------------------------------|------------------------------------------|
    |    DATABASE_NAME               |      Yes, replace with the source (exported) database name |
    |    DATABASE_HOST               |      Not Required                        |
    |    DATABASE_USERNAME           |      Not Required                        |
    |    DATABASE_PASSWORD           |      Not Required                        |

    ![Database Application Settings](./media/wordpress_database_application_settings.png)

## Post Migration Actions

### Install Recommended Plugins

It is an optional step, after the site migration it is recommended to validate that you have the default recommended/equivalent plugins activated and configured accurate as before. If you are prohibited from not configuring them as per your organization governing policies, then you can uninstall the plugins.

- The W3TC plugin should be activated and configured properly to use the local Redis cache server and Azure CDN/Blob Storage (if it was configured to use them originally). For more information on how to configure these, please refer to the following documentations:

  - [Local Redis Cache](./wordpress_local_redis_cache.md)
  - [Azure CDN](./wordpress_azure_cdn.md)
  - [Azure Blob Storage](./wordpress_azure_blob_storage.md)

- WP Smush plugin is activated and configured properly for image optimization. Please see [Image Compression](./wordpress_image_compression.md) for more information on configuration.

### Recommended WordPress Settings

The following WordPress settings are recommended. However, when the users migrate their custom sites, is it up to them to decide whether to use these settings or not.

1. Open the WordPress Admin dashboard.
2. Set the permalink structure to 'day and name', as it performs better compared to the plain permalinks that uses the format **?p=123**.
3. Under the comment settings, enable the option to break comments into pages.
4. Show excerpts instead of the full post in the feed.

## Search And Replace (paths and domains)

One common issue that users face during migration is that some of the contents of their old site use absolute urls/paths instead of relative ones. To resolve this issue, you can use plugins like [Search and Replace](https://wordpress.org/plugins/search-replace/) to update the database records.

## Configuring Custom Domain

If you plan to setup your site with a new Custom Domain please follow the steps described here: Tutorial: [Map existing custom DNS name - Azure App Service | Microsoft Docs](https://docs.microsoft.com/azure/app-service/app-service-web-tutorial-custom-domain?tabs=a%2Cazurecli)

## Migrating Custom Domain

When you migrate a live site and its DNS domain name to App Service, that DNS name is already serving live traffic. You can avoid downtime in DNS resolution during the migration by binding the active DNS name to your App Service app pre-emptively as per the steps described here: [Migrate an active DNS name - Azure App Service | Microsoft Docs](https://docs.microsoft.com/azure/app-service/manage-custom-dns-migrate-domain)

## Updating SSL Certificates

If your site is configured with SSL certs, then we need to redo the setup following the instructions here: [Add and manage TLS/SSL certificates - Azure App Service | Microsoft Docs](https://docs.microsoft.com/azure/app-service/configure-ssl-certificate?tabs=apex%2Cportal)

Next steps:
[At-scale assessment of .NET web apps](/training/modules/migrate-app-service-migration-assistant/)
