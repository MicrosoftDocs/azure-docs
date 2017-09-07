---
title: Enterprise-class WordPress on Azure | Microsoft Docs
description: Learn how to host an enterprise-class WordPress site on Azure App Service
services: app-service\web
documentationcenter: ''
author: sunbuild
manager: yochayk
editor: ''

ms.assetid: 22d68588-2511-4600-8527-c518fede8978
ms.service: app-service-web
ms.devlang: php
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: web
ms.date: 10/24/2016
ms.author: sumuth

---
# Enterprise-class WordPress on Azure
Azure App Service provides a scalable, secure, and easy-to-use environment for mission-critical, large-scale [WordPress][wordpress] sites. Microsoft itself runs enterprise-class sites such as the [Office][officeblog] and [Bing][bingblog] blogs. This article shows you how to use the Web Apps feature of Microsoft Azure App Service to establish and maintain an enterprise-class, cloud-based WordPress site that can handle a large volume of visitors.

## Architecture and planning
A basic WordPress installation has only two requirements:

* **MySQL Database**: This requirement is available through [ClearDB in the Azure Marketplace][cdbnstore]. As an alternative, you can manage your own MySQL installation on Azure Virtual Machines by using either [Windows][mysqlwindows] or [Linux][mysqllinux].

  > [!NOTE]
  > ClearDB provides several MySQL configurations. Each configuration has different performance characteristics. See the [Azure Store][cdbnstore] for information about offerings that are provided through the Azure Store or directly as seen on the [ClearDB website](http://www.cleardb.com/pricing.view).
  >
  >
* **PHP 5.2.4 or greater**: Azure App Service currently provides [PHP versions 5.4, 5.5, and 5.6][phpwebsite].

  > [!NOTE]
  > We recommend that you always run the latest version of PHP so that you have the latest security fixes.
  >
  >

### Basic deployment
If you use just the basic requirements, you can create a basic solution within an Azure region.

![An Azure web app and MySQL Database hosted in a single Azure region][basic-diagram]

Although this would let you create multiple Web Apps instances of the site to scale out your application, everything is hosted within the datacenters in a specific geographic region. Visitors from outside this region may see slow response times when they use the site. If the datacenters in this region go down, so does your application.

### Multi-region deployment
By using Azure [Traffic Manager][trafficmanager], you can scale your WordPress site across multiple geographic regions and provide the same URL for all visitors. All visitors come in through Traffic Manager and are then routed to a region that's based on the load-balancing configuration.

![An Azure web app, hosted in multiple regions, using CDBR High Availability router to route to MySQL across regions][multi-region-diagram]

Within each region, the WordPress site would still be scaled across multiple Web Apps instances, but this scaling is specific to a region. High-traffic regions and low-traffic regions can be scaled differently.

To replicate and route traffic to multiple MySQL databases, you can use [ClearDB high-availability routers (CDBRs)][cleardbscale] (shown left) or [MySQL Cluster Carrier Grade Edition (CGE)][cge].

### Multi-region deployment with media storage and caching
If the site accepts uploads or hosts media files, use Azure Blob storage. If you need caching, consider [Redis cache][rediscache], [Memcache Cloud](http://azure.microsoft.com/gallery/store/garantiadata/memcached/), [MemCachier](http://azure.microsoft.com/gallery/store/memcachier/memcachier/), or one of the other caching offerings in the [Azure Store](http://azure.microsoft.com/gallery/store/).

![An Azure web app, hosted in multiple regions, using CDBR High Availability router for MySQL, with Managed Cache, Blob storage, and Content Delivery Network][performance-diagram]

Blob storage is geo-distributed across regions by default, so you don't have to worry about replicating files across all sites. You can also enable the Azure [Content Delivery Network][cdn] for Blob storage, which distributes files to end nodes that are closer to your visitors.

### Planning
#### Additional requirements
| To do this... | Use this... |
| --- | --- |
| **Upload or store large files** |[WordPress plugin for using Blob storage][storageplugin] |
| **Send email** |[SendGrid][storesendgrid] and the [WordPress plugin for using SendGrid][sendgridplugin] |
| **Custom domain names** |[Configure a custom domain name in Azure App Service][customdomain] |
| **HTTPS** |[Enable HTTPS for a web app in Azure App Service][httpscustomdomain] |
| **Pre-production validation** |[Set up staging environments for web apps in Azure App Service][staging] <p>When you move a web app from staging to production, you also move the WordPress configuration. Make sure that all settings are updated to the requirements for your production app before you move the staged app to production.</p> |
| **Monitoring and troubleshooting** |[Enable diagnostics logging for web apps in Azure App Service][log] and [Monitor Web Apps in Azure App Service][monitor] |
| **Deploy your site** |[Deploy a web app in Azure App Service][deploy] |

#### Availability and disaster recovery
| To do this... | Use this... |
| --- | --- |
| **Load balance sites** or **geo-distribute sites** |[Route traffic with Azure Traffic Manager][trafficmanager] |
| **Back up and restore** |[Back up a web app in Azure App Service][backup] and [Restore a web app in Azure App Service][restore] |

#### Performance
Performance in the cloud is achieved primarily through caching and scale-out. However, the memory, bandwidth, and other attributes of Web Apps hosting should be considered.

| To do this... | Use this... |
| --- | --- |
| **Understand App Service instance capabilities** |[Pricing details, including capabilities of App Service tiers][websitepricing] |
| **Cache resources** |[Redis cache][rediscache], [Memcache Cloud](/gallery/store/garantiadata/memcached/), [MemCachier](/gallery/store/memcachier/memcachier/), or one of the other caching offerings in the [Azure Store](/gallery/store/) |
| **Scale your application** |[Scale a web app in Azure App Service][websitescale] and [ClearDB High Availability Routing][cleardbscale]. If you choose to host and manage your own MySQL installation, you should consider [MySQL Cluster CGE][cge] for scale-out. |

#### Migration
There are two methods to migrate an existing WordPress site to Azure App Service:

* **[WordPress export][export]**: This method exports the content of your blog. You can then import the content to a new WordPress site on Azure App Service by using the [WordPress Importer plugin][import].

  > [!NOTE]
  > While this process lets you migrate your content, it does not migrate any plugins, themes, or other customizations. You must install these components again manually.
  >
  >
* **Manual migration**: [Back up your site][wordpressbackup] and [database][wordpressdbbackup], and then manually restore it to a web app in Azure App Service and associated MySQL database. This method is useful to migrate highly customized sites because it avoids the tedium of manually installing plugins, themes, and other customizations.

## Step-by-step instructions
### Create a WordPress site
1. Use the [Azure Marketplace][cdbnstore] to create a MySQL database of the size that you identified in the [Architecture and planning](#planning) section in the region or regions where you will host your site.
2. <a href="https://portal.azure.com/#create/WordPress.WordPress" target="_blank">Create a WordPress web app</a>. When you create the web app, select **Use an existing MySQL Database**, and then select the database that you created in step 1.

If you are migrating an existing WordPress site, see [Migrate an existing WordPress site to Azure](#Migrate-an-existing-WordPress-site-to-Azure) after you create a new web app.

### Migrate an existing WordPress site to Azure
As mentioned in the [Architecture and planning](#planning) section, there are two ways to migrate a WordPress site:

* **Use export and import** for sites that don't have much customization or where you just want to move the content.
* **Use backup and restore** for sites that have a lot of customization where you want to move everything.

Use one of the following sections to migrate your site.

#### The export and import method
1. Use [WordPress export][export] to export your existing site.
2. Create a web app by using the steps in the [Create a WordPress site](#Create-a-new-WordPress-site) section.
3. Sign in to your WordPress site on the [Azure portal][mgmtportal], and then click **Plugins** > **Add New**. Search for and install the **WordPress Importer** plugin.
4. After you install the WordPress Importer plugin, click **Tools** > **Import**, and then click **WordPress** to use the WordPress Importer plugin.
5. On the **Import WordPress** page, click **Choose File**. Find the WXR file that was exported from your existing WordPress site, and then click **Upload file and import**.
6. Click **Submit**. You are prompted that the import was successful.
7. After you complete all these steps, restart your site from its **App Services** blade in the [Azure portal][mgmtportal].

After you import the site, you might need to perform the following steps to enable settings that are not in the import file.

| If you were using this... | Do this... |
| --- | --- |
| **Permalinks** |From the WordPress dashboard of the new site, click **Settings** > **Permalinks**, and then update the Permalinks structure. |
| **image/media links** |To update links to the new location, use the [Velvet Blues Update URLs plugin][velvet], a search and replace tool, or manually update the links in your database. |
| **Themes** |Go to **Appearance** > **Theme**, and then update the site theme as needed. |
| **Menus** |If your theme supports menus, links to your home page may still have the old subdirectory embedded in them. Go to **Appearance** > **Menus**, and then update them. |

#### The backup and restore method
1. Back up your existing WordPress site by using the information at [WordPress backups][wordpressbackup].
2. Back up your existing database by using the information at [Backing up your database][wordpressdbbackup].
3. Create a database and restore the backup.

   1. Purchase a new database from the [Azure Marketplace][cdbnstore], or set up a MySQL database on a [Windows][mysqlwindows] or [Linux][mysqllinux] virtual machine.
   2. Use a MySQL client like [MySQL Workbench][workbench] to connect to the new database, and import your WordPress database.
   3. Update the database to change the domain entries to your new Azure App Service domain, for example, mywordpress.azurewebsites.net. Use the [Search and Replace for WordPress Databases Script][searchandreplace] to safely change all instances.
4. Create a web app in the Azure portal, and publish the WordPress backup.

   1. To create a web app that has a database, in the [Azure portal][mgmtportal], click **New** > **Web + Mobile** > **Azure Marketplace** > **Web Apps** > **Web app + SQL** (or **Web app + MySQL**) > **Create**. Configure all the required settings to create an empty web app.
   2. In your WordPress backup, locate the **wp-config.php** file, and open it in an editor. Replace the following entries with the information for your new MySQL database:

      * **DB_NAME**: The user name of the database.
      * **DB_USER**: The user name used to access the database.
      * **DB_PASSWORD**: The user password.

        After you change these entries, save and close the **wp-config.php** file.
   3. Use the [Deploy a web app in Azure App Service][deploy] information to enable the deployment method that you want to use, and then deploy your WordPress backup to your web app in Azure App Service.
5. After the WordPress site has been deployed, you should be able to access the new site (as an App Service web app) by using the *.azurewebsite.net URL for the site.

### Configure your site
After the WordPress site has been created or migrated, use the following information to improve performance or enable additional functionality.

| To do this... | Use this... |
| --- | --- |
| **Set App Service plan mode, size, and enable scaling** |[Scale a web app in Azure App Service][websitescale]. |
| **Enable persistent database connections** |By default, WordPress does not use persistent database connections, which might cause your connection to the database to become throttled after multiple connections. To enable persistent connections, install the [persistent connections adapter plugin](https://wordpress.org/plugins/persistent-database-connection-updater/installation/). |
| **Improve performance** |<ul><li><p><a href="https://azure.microsoft.com/en-us/blog/disabling-arrs-instance-affinity-in-windows-azure-web-sites/">Disable the ARR cookie</a>, which can improve performance when WordPress runs on multiple Web Apps instances.</p></li><li><p>Enable caching. You can use <a href="http://msdn.microsoft.com/library/azure/dn690470.aspx">Redis cache</a> (preview) with the <a href="https://wordpress.org/plugins/redis-object-cache/">Redis object cache WordPress plugin</a>, or you can use one of the other caching offerings from the <a href="/gallery/store/">Azure Store</a>.</p></li><li><p>[Make WordPress faster with Wincache](https://wordpress.org/plugins/w3-total-cache/). Wincache is enabled by default for web apps. When using WinCache and Dynamic Cache together, turn off WinCache's file cache, but leave the user and session cache enabled. To turn off file cache, in a system-level .ini file, set the following value:<br/><code>wincache.fcenabled = 0</code></p></li><li><p>[Scale a web app in Azure App Service][websitescale] and use <a href="http://www.cleardb.com/developers/cdbr/introduction">ClearDB High Availability Routing</a> or <a href="http://www.mysql.com/products/cluster/">MySQL Cluster CGE</a>.</p></li></ul> |
| **Use blobs for storage** |<ol><li><p>[Create an Azure storage account](../storage/common/storage-create-storage-account.md).</p></li><li><p>Learn how to [Use the Content Distribution Network](../cdn/cdn-create-new-endpoint.md) to geo-distribute data stored in blobs.</p></li><li><p>Install and configure the <a href="https://wordpress.org/plugins/windows-azure-storage/">Azure Storage for WordPress plugin</a>.</p><p>For detailed setup and configuration information for the plugin, see the <a href="http://plugins.svn.wordpress.org/windows-azure-storage/trunk/UserGuide.docx">user guide</a>.</p> </li></ol> |
| **Enable email** |Enable <a href="https://azure.microsoft.com/en-us/marketplace/partners/sendgrid/sendgrid-azure/">SendGrid</a> by using the Azure Store. Install the <a href="http://wordpress.org/plugins/sendgrid-email-delivery-simplified">SendGrid plugin</a> for WordPress. |
| **Configure a custom domain name** |[Configure a custom domain name in Azure App Service][customdomain]. |
| **Enable HTTPS for a custom domain name** |[Enable HTTPS for a web app in Azure App Service][httpscustomdomain]. |
| **Load balance or geo-distribute your site** |[Route traffic with Azure Traffic Manager][trafficmanager]. If you are using a custom domain, see [Configure a custom domain name in Azure App Service][customdomain] for information about how to use Traffic Manager with custom domain names. |
| **Enable automated backups** |[Back up a web app in Azure App Service][backup]. |
| **Enable diagnostic logging** |[Enable diagnostics logging for web apps in Azure App Service][log]. |

## Next steps
* [WordPress optimization](http://codex.wordpress.org/WordPress_Optimization)
<!-- * [Convert WordPress to multisite in Azure App Service](web-sites-php-convert-wordpress-multisite.md) -->
* [ClearDB upgrade wizard for Azure](http://www.cleardb.com/store/azure/upgrade)
* [Hosting WordPress in a subfolder of your web app in Azure App Service](http://blogs.msdn.com/b/webapps/archive/2013/02/13/hosting-wordpress-in-a-subfolder-of-your-windows-azure-web-site.aspx)
* [Step-by-step: Create a WordPress site using Azure](http://blogs.technet.com/b/blainbar/archive/2013/08/07/article-create-a-wordpress-site-using-windows-azure-read-on.aspx)
* [Host your existing WordPress blog on Azure](http://blogs.msdn.com/b/msgulfcommunity/archive/2013/08/26/migrating-a-self-hosted-wordpress-blog-to-windows-azure.aspx)
* [Enabling pretty permalinks in WordPress](http://www.iis.net/learn/extensions/url-rewrite-module/enabling-pretty-permalinks-in-wordpress)
* [How to migrate and run your WordPress blog on Azure App Service](http://www.kefalidis.me/2012/06/how-to-migrate-and-run-your-wordpress-blog-on-windows-azure-websites/)
* [How to run WordPress on Azure App Service for free](http://architects.dzone.com/articles/how-run-wordpress-azure)
* [WordPress on Azure in two minutes or less](http://www.sitepoint.com/wordpress-windows-azure-2-minutes-less/)
* [Moving a WordPress blog to Azure - Part 1: Creating a WordPress blog on Azure](http://www.davebost.com/2013/07/10/moving-a-wordpress-blog-to-windows-azure-part-1)
* [Moving a WordPress blog to Azure - Part 2: Transferring your content](http://www.davebost.com/2013/07/11/moving-a-wordpress-blog-to-windows-azure-transferring-your-content)
* [Moving a WordPress blog to Azure - Part 3: Setting up your custom domain](http://www.davebost.com/2013/07/11/moving-a-wordpress-blog-to-windows-azure-part-3-setting-up-your-custom-domain)
* [Moving a WordPress blog to Azure - Part 4: Pretty permalinks and URL Rewrite rules](http://www.davebost.com/2013/07/11/moving-a-wordpress-blog-to-windows-azure-part-4-pretty-permalinks-and-url-rewrite-rules)
* [Moving a WordPress blog to Azure - Part 5: Moving from a subfolder to the root](http://www.davebost.com/2013/07/11/moving-a-wordpress-blog-to-windows-azure-part-5-moving-from-a-subfolder-to-the-root)
* [How to set up a WordPress web app in your Azure account](http://www.itexperience.net/2014/01/20/how-to-set-up-a-wordpress-website-in-your-windows-azure-account/)
* [Propping up WordPress on Azure](http://www.johnpapa.net/wordpress-on-azure/)
* [Tips for WordPress on Azure](http://www.johnpapa.net/azurecleardbmysql/)

> [!NOTE]
> If you want to get started with Azure App Service before you sign up for an Azure account, go to [Try App Service](https://azure.microsoft.com/try/app-service/), where you can immediately create a short-lived starter web app in App Service. No credit cards are required, and there are no commitments.
>
>

## What's changed
For a guide to the change from websites to App Service, see [Azure App Service and its impact on existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714).

<!-- URL List -->

[performance-diagram]: ./media/web-sites-php-enterprise-wordpress/performance-diagram.png
[basic-diagram]: ./media/web-sites-php-enterprise-wordpress/basic-diagram.png
[multi-region-diagram]: ./media/web-sites-php-enterprise-wordpress/multi-region-diagram.png
[wordpress]: http://www.microsoft.com/web/wordpress
[officeblog]: http://blogs.office.com/
[bingblog]: http://blogs.bing.com/
[cdbnstore]: http://www.cleardb.com/store/azure
[storageplugin]: https://wordpress.org/plugins/windows-azure-storage/
[sendgridplugin]: http://wordpress.org/plugins/sendgrid-email-delivery-simplified/
[phpwebsite]: web-sites-php-configure.md
[customdomain]: app-service-web-tutorial-custom-domain.md
[trafficmanager]: ../traffic-manager/traffic-manager-overview.md
[backup]: web-sites-backup.md
[restore]: web-sites-restore.md
[rediscache]: https://azure.microsoft.com/documentation/services/redis-cache/
[managedcache]: http://msdn.microsoft.com/library/azure/dn386122.aspx
[websitescale]: web-sites-scale.md
[managedcachescale]: http://msdn.microsoft.com/library/azure/dn386113.aspx
[cleardbscale]: http://www.cleardb.com/developers/cdbr/introduction
[staging]: web-sites-staged-publishing.md
[monitor]: web-sites-monitor.md
[log]: web-sites-enable-diagnostic-log.md
[httpscustomdomain]: app-service-web-tutorial-custom-ssl.md
[mysqlwindows]:../virtual-machines/windows/classic/mysql-2008r2.md
[mysqllinux]:../virtual-machines/linux/classic/mysql-on-opensuse.md
[cge]: http://www.mysql.com/products/cluster/
[websitepricing]: /pricing/details/app-service/
[export]: http://en.support.wordpress.com/export/
[import]: http://wordpress.org/plugins/wordpress-importer/
[wordpressbackup]: http://wordpress.org/plugins/wordpress-importer/
[wordpressdbbackup]: http://codex.wordpress.org/Backing_Up_Your_Database
[createwordpress]: https://portal.azure.com/#create/WordPress.WordPress
[velvet]: https://wordpress.org/plugins/velvet-blues-update-urls/
[mgmtportal]: https://portal.azure.com/
[wordpressbackup]: http://codex.wordpress.org/WordPress_Backups
[wordpressdbbackup]: http://codex.wordpress.org/Backing_Up_Your_Database
[workbench]: http://www.mysql.com/products/workbench/
[searchandreplace]: http://interconnectit.com/124/search-and-replace-for-wordpress-databases/
[deploy]: web-sites-deploy.md
[posh]: /powershell/azureps-cmdlets-docs
[Azure CLI]:../cli-install-nodejs.md
[storesendgrid]: https://azure.microsoft.com/marketplace/partners/sendgrid/sendgrid-azure/
[cdn]: ../cdn/cdn-overview.md
