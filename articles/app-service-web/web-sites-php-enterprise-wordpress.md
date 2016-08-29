<properties
	pageTitle="Enterprise-class WordPress on Azure App Service | Microsoft Azure"
	description="Learn how to host an enterprise-class WordPress site on Azure App Service"
	services="app-service\web"
	documentationCenter=""
	authors="sunbuild"
	manager="yochayk"
	editor=""/>

<tags
	ms.service="app-service-web"
	ms.devlang="php"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="web"
	ms.date="07/06/2016"
	ms.author="sumuth"/>

# Enterprise-class WordPress on Azure App Service

Azure App Service provides a scalable, secure and easy to use environment for mission critical, large scale [WordPress][wordpress] sites. Microsoft itself runs enterprise-class sites such as the [Office][officeblog] and [Bing][bingblog] blogs. This document shows you how you can use Azure App Service Web Apps to establish and maintain an enterprise-class, cloud-based WordPress site that can handle a large volume of visitors.

## Architecture and planning

A basic WordPress installation has only two requirements.

* **MySQL Database** - available through [ClearDB in the Azure Marketplace][cdbnstore], or you can manage your own MySQL installation on Azure Virtual Machines using either [Windows][mysqlwindows] or [Linux][mysqllinux].

    > [AZURE.NOTE] ClearDB provides several MySQL configurations, with different performance characteristics for each configuration. See the [Azure Store][cdbnstore] for information on offerings provided through the Azure store or [ClearDB pricing](http://www.cleardb.com/pricing.view) for offerings directly from ClearDB.

* **PHP 5.2.4 or greater** - Azure App Service currently provide [PHP versions 5.4, 5.5, and 5.6][phpwebsite].

	> [AZURE.NOTE] We recommend always running on the latest version of PHP to ensure you have the latest security fixes.

### Basic deployment

Using just the basic requirements, you could create a basic solution within an Azure region.

![an Azure web app and MySQL Database hosted in a single Azure region][basic-diagram]

While this would allow you to scale out your application by creating multiple Web Apps instances of the site, everything is hosted within the data centers in a specific geographic region. Visitors from outside this region may see slow response times when using the site, and if the data centers in this region go down, so does your application.


### Multi-region deployment

Using Azure [Traffic Manager][trafficmanager], it's possible to scale your WordPress site across multiple geographic regions while providing only one URL for visitors. All visitors come in through Traffic Manager and are then routed to a region based on the load balancing configuration.

![an Azure web app, hosted in multiple regions, using CDBR High Availability router to route to MySQL across regions][multi-region-diagram]

Within each region, the WordPress site would still be scaled across multiple Web Apps instances, but this scaling is region specific; high traffic regions can be scaled differently than low traffic ones.

Replication and routing to multiple MySQL Databases can be done using ClearDB's [CDBR High Availability Router][cleardbscale] (shown left,) or [MySQL Cluster CGE][cge].

### Multi-region deployment with media storage and caching

If the site will accept uploads, or host media files, use Azure Blob storage. If you need caching, consider [Redis cache][rediscache], [Memcache Cloud](https://azure.microsoft.com/marketplace/partners/garantiadata/memcached/), [MemCachier](https://azure.microsoft.com/marketplace/partners/memcachier/memcachier/), or one of the other caching offerings in the [Azure Store](https://azure.microsoft.com/gallery/store/).

![an Azure web app, hosted in multiple regions, using CDBR High Availability router for MySQL, with Managed Cache, Blob storage, and CDN][performance-diagram]

Blob storage is geo-distributed across regions by default, so you don't have to worry about replicating files across all sites. You can be also enable the Azure [Content Distribution Network (CDN)][cdn] for Blob storage, which distributes files to end nodes closer to your visitors.

### Planning

#### Additional requirements

To do this... | Use this...
------------------------|-----------
**Upload or store large files** | [WordPress plugin for using Blob storage][storageplugin]
**Send email** | [SendGrid][storesendgrid] and the [WordPress plugin for using SendGrid][sendgridplugin]
**Custom domain names** | [Configure a custom domain name in Azure App Service][customdomain]
**HTTPS** | [Enable HTTPS for a web app in Azure App Service][httpscustomdomain]
**Pre-production validation** | [Set up staging environments for web apps in Azure App Service][staging] <p>Note that switching a web app from staging to production also moves the WordPress configuration. You should ensure that all settings are updated to the requirements for your production app before switching the staged app into production.</p>
**Monitoring and troubleshooting** | [Enable diagnostics logging for web apps in Azure App Service][log] and [Monitor Web Apps in Azure App Service][monitor]
**Deploy your site** | [Deploy a web app in Azure App Service][deploy]

#### Availability and disaster recovery

To do this... | Use this...
------------------------|-----------
**Load balance sites** or **geo-distribute sites** | [Route traffic with Azure Traffic Manager][trafficmanager]
**Backup and restore** | [Back up a web app in Azure App Service][backup] and [Restore a web app in Azure App Service][restore]

#### Performance

Performance in the cloud is achieved primarily through caching and scale out; however the memory, bandwidth, and other attributes of Web Apps hosting should also be taken into consideration.

To do this... | Use this...
------------------------|-----------
**Understand App Service instance capabilities** |  [Pricing details, including capabilities of App Service tiers][websitepricing]
**Cache resources** | [Redis cache][rediscache], [Memcache Cloud](https://azure.microsoft.com/marketplace/partners/garantiadata/memcached/), [MemCachier](https://azure.microsoft.com/marketplace/partners/memcachier/memcachier/), or one of the other caching offerings in the [Azure Store](/gallery/store/)
**Scale your application** | [Scale a web app in Azure App Service][websitescale] and [ClearDB High Availability Routing][cleardbscale]. If you choose to host and manage your own MySQL installation, you should consider [MySQL Cluster CGE][cge] for scale out

#### Migration

There are two methods of migrating an existing WordPress site to Azure App Service.

* **[WordPress export][export]** - This exports the content of your blog, which can then be imported to a new WordPress site on Azure App Service using the [WordPress importer plugin][import].

	> [AZURE.NOTE] While this process allows you to migrate your content, it does not migrate any plugins, themes or other customizations. These must be installed again manually.

* **Manual migration** - [Back up your site][wordpressbackup] and [database][wordpressdbbackup], then manually restore it to a web app in Azure App Service and associated MySQL database to migrate highly customized sites and avoid the tedium of manually installing plugins, themes, and other customizations.

## Step-by-step instructions

### Create a new WordPress site

1. Use the [Azure Marketplace][cdbnstore] to create a MySQL database of the size you identified in the [Architecture and planning](#planning) section, in the region(s) that you will host your site.

2. Follow the steps in [Create a WordPress web app in Azure App Service][createwordpress] to create a new WordPress web app. When creating the web app, select **Use an existing MySQL Database** and select the database created in step 1.

If you are migrating an existing WordPress site, see [Migrate an existing WordPress site to Azure](#Migrate-an-existing-WordPress-site-to-Azure) after creating a new web app.

### Migrate an existing WordPress site to Azure

As mentioned in the [Architecture and planning](#planning) section, there are two ways to migrate a WordPress site.

* **export and import** - for sites without a lot of customization, or where you just want to move the content.

* **backup and restore** - for sites with a lot of customization where you want to move everything.

Use one of the following sections to migrate your site.

#### The export and import method

1. Use [WordPress export][export] to export your existing site.

2. Create a new web app using the steps in the [Create a new WordPress site](#Create-a-new-WordPress-site) section.

3. Login to your WordPress site on Web Apps and click on **Plugins** -> **Add New**. Search for, and install, the **WordPress Importer** plugin.

4. After the importer plugin has been installed, click on **Tools** -> **Import**, and then select **WordPress** to use the WordPress importer plugin.

5. On the **Import WordPress** page, click **Choose File**. Browse to the WXR file exported from your existing WordPress site, and then choose **Upload file and import**.

6. Click **Submit**. You will be prompted that the import was successful.

8. Once you have completed all these steps, restart your site from its web app blade in the [Azure Portal][mgmtportal].

After importing the site, you may need to perform the following steps to enable settings not contained in the import file.

If you were using this... | Do this...
------------------ | ----------
**Permalinks** | From the WordPress dashboard of the new site, click **Settings** -> **Permalinks** and then update the Permalinks structure
**image/media links** | To update links to the new location, use the [Velvet Blues Update URLs plugin][velvet], a search and replace tool, or manually in your database
**Themes** | Go to **Appearance** -> **Theme** and update the site theme as needed
**Menus** | If your theme supports menus, links to your home page may still have the old sub-directory embedded in them. Go to **Appearance** -> **Menus** and update them

#### The backup and restore method

1. Back up your existing WordPress site using the information at [WordPress backups][wordpressbackup].

2. Back up your existing database using the information at [Backing up your database][wordpressdbbackup].

3. Create a new database and restore the backup.

	1. Purchase a new database from the [Azure Marketplace][cdbnstore], or setup a  MySQL database on a [Windows][mysqlwindows] or [Linux][mysqllinux] VM.

	2. Using a MySQL client like [MySQL Workbench][workbench], connect to the new database and import your WordPress database.

	3. Update the database to change the domain entries to your new Azure App Service domain. For example, mywordpress.azurewebsites.net. Use the [Search and Replace for WordPress Databases Script][searchandreplace] to safely change all instances.

4. Create a new web app in the Azure Portal and publish the WordPress backup.

	1. Create a new web app in the [Azure Portal][mgmtportal] with a database using **New** -> **Web + Mobile** -> **Azure Marketplace** -> **Web Apps** -> **Web app + SQL** (or **Web app + MySQL**) -> **Create**. Configure all the required settings to create an empty web app.

	2. In your WordPress backup, locate the **wp-config.php** file and open it in an editor. Replace the following entries with the information for your new MySQL database.

		* **DB_NAME** - the user name of the database

		* **DB_USER** - the user name used to access the database

		* **DB_PASSWORD** - the user password

		After changing these entries, save and close the **wp-config.php** file.

	3. Use the [Deploy a web app in Azure App Service][deploy] information to enable the deployment method you wish to use, and then deploy your WordPress backup to your web app in Azure App Service.

5. Once the WordPress site has been deployed, you should be able to access the new site (as an App Service web app) using the *.azurewebsite.net URL for the site.

### Configure your site

After the WordPress site has been created or migrated, use the following information to improve performance or enable additional functionality.

To do this... | Use this...
------------- | -----------
**Set App Service plan mode, size, and enable scaling** | [Scale a web app in Azure App Service][websitescale]
**Enable persistent database connections** <p>By default, WordPress does not use persistent database connections, which may cause your connection to the database to become throttled after multiple connections.</p>  | <ol><li><p>Edit the <strong>wp-includes/wp-db.php</strong> file.</p></li><li><p>Find the following line.</p><code>$this->dbh = mysql_connect( $this->dbhost, $this->dbuser, $this->dbpassword, $new_link, $client_flags );</code></li><li><p>Replace the previous line with the following.</p><code>$this->dbh = mysql_pconnect( $this->dbhost, $this->dbuser, $this->dbpassword,  $client_flags ); <br/>if ( false !== $error_reporting ) { /br/>&nbsp;&nbsp;error_reporting( $error_reporting ); <br/>} </code></li><li><p>Find the following line.</p><code>$this->dbh = @mysql_connect( $this->dbhost, $this->dbuser, $this->dbpassword, $new_link, $client_flags ); </code></li><li><p>Replace the above line with the following.</p><code>$this->dbh = @mysql_pconnect( $this->dbhost, $this->dbuser, $this->dbpassword,  $client_flags ); </code></li><li><p>Save the file <strong>wp-includes/wp-db.php</strong> file and redeploy the site.</p></li></ol><div class="wa-note"><span class="wa-icon-bulb"></span><p>These changes may be overwritten when WordPress is updated.</p><p>WordPress defaults to automatic updates, which can be disabled by editing the <strong>wp-config.php</strong> file and adding <code>define ( 'WP_AUTO_UPDATE_CORE', false );</code></p><p>Another way of addressing updates would be to use a WebJob that monitors the <strong>wp-db.php</strong> file and performs the above modifications each time the file is updated. See [Introduction to WebJobs](http://www.hanselman.com/blog/IntroducingWindowsAzureWebJobs.aspx) for more information.</p></div>
**Improve performance** | <ul><li><p>[Disable the ARR cookie](http://ppe.blogs.msdn.com/b/windowsazure/archive/2013/11/18/disabling-arr-s-instance-affinity-in-windows-azure-web-sites.aspx) - can improve performance when running WordPress on multiple Web Apps instances</p></li><li><p>Enable caching. [Redis cache](http://msdn.microsoft.com/library/azure/dn690470.aspx) can be used with the [Redis object cache WordPress plugin](https://wordpress.org/plugins/redis-object-cache/), or use one of the other caching offerings from the [Azure Store](/gallery/store/)</p></li><li><p>[How to make WordPress faster with Wincache](http://ruslany.net/2010/03/make-wordpress-faster-on-iis-with-wincache-1-1/) - Wincache is enabled by default for Web Apps</p></li><li><p>[Scale a web app in Azure App Service](../app-service-web/web-sites-scale.md) and use [ClearDB High Availability Routing](http://www.cleardb.com/developers/cdbr/introduction) or [MySQL Cluster CGE](http://www.mysql.com/products/cluster/)</p></li></ul>
**Use blobs for storage** | <ol><li><p>[Create an Azure Storage account](../storage/storage-create-storage-account.md)</p></li><li><p>Learn how to [Use the Content Distribution Network (CDN)][cdn] to geo-distribute data stored in blobs.</p></li><li><p>Install and configure the [Azure Storage for WordPress plugin](https://wordpress.org/plugins/windows-azure-storage/).</p><p>For detailed setup and configuration information for the plugin, see the [user guide](http://plugins.svn.wordpress.org/windows-azure-storage/trunk/UserGuide.docx).</p> </li></ol>
**Enable email** | <ol><li><p>[Enable SendGrid using the Azure Store](/gallery/store/sendgrid/sendgrid-azure/)</p></li><li><p>[Install the SendGrid plugin for WordPress](http://wordpress.org/plugins/sendgrid-email-delivery-simplified/)</p></li></ol>
**Configure a custom domain name** | [Configure a custom domain name in Azure App Service][customdomain]
**Enable HTTPS for a custom domain name** | [Enable HTTPS for a web app in Azure App Service][httpscustomdomain]
**Load balance or geo-distribute your site** | [Route traffic with Azure Traffic Manager][trafficmanager]. If you are using a custom domain, see [Configure a custom domain name in Azure App Service][customdomain] for information on using Traffic Manager with custom domain names
**Enable automated backups** | [Back up a web app in Azure App Service][backup]
**Enable diagnostic logging** | [Enable diagnostics logging for web apps in Azure App Service][log]

## Next Steps

* [WordPress optimization](http://codex.wordpress.org/WordPress_Optimization)

* [Convert WordPress to Multisite in Azure App Service](web-sites-php-convert-wordpress-multisite.md)

* [ClearDB upgrade wizard for Azure](http://www.cleardb.com/store/azure/upgrade)

* [Hosting WordPress in a subfolder of your web app in Azure App Service](http://blogs.msdn.com/b/webapps/archive/2013/02/13/hosting-wordpress-in-a-subfolder-of-your-windows-azure-web-site.aspx)

* [Step-By-Step: Create a WordPress site using Azure](http://blogs.technet.com/b/blainbar/archive/2013/08/07/article-create-a-wordpress-site-using-windows-azure-read-on.aspx)

* [Host your existing WordPress blog on Azure](http://blogs.msdn.com/b/msgulfcommunity/archive/2013/08/26/migrating-a-self-hosted-wordpress-blog-to-windows-azure.aspx)

* [Enabling pretty permalinks in WordPress](http://www.iis.net/learn/extensions/url-rewrite-module/enabling-pretty-permalinks-in-wordpress)

* [How to migrate and run your WordPress blog on Azure App Service](http://www.kefalidis.me/2012/06/how-to-migrate-and-run-your-wordpress-blog-on-windows-azure-websites/)

* [How to run WordPress on Azure App Service for free](http://architects.dzone.com/articles/how-run-wordpress-azure)

* [WordPress on Azure in 2 minutes or less](http://www.sitepoint.com/wordpress-windows-azure-2-minutes-less/)

* [Moving a WordPress blog to Azure - Part 1: Creating a WordPress blog on Azure](http://www.davebost.com/2013/07/10/moving-a-wordpress-blog-to-windows-azure-part-1)

* [Moving a WordPress blog to Azure - Part 2: Transferring your content](http://www.davebost.com/2013/07/11/moving-a-wordpress-blog-to-windows-azure-transferring-your-content)

* [Moving a WordPress blog to Azure - Part 3: Setting up your custom domain](http://www.davebost.com/2013/07/11/moving-a-wordpress-blog-to-windows-azure-part-3-setting-up-your-custom-domain)

* [Moving a WordPress blog to Azure - Part 4: Pretty permalinks and URL Rewrite rules](http://www.davebost.com/2013/07/11/moving-a-wordpress-blog-to-windows-azure-part-4-pretty-permalinks-and-url-rewrite-rules)

* [Moving a WordPress blog to Azure - Part 5: Moving from a subfolder to the root](http://www.davebost.com/2013/07/11/moving-a-wordpress-blog-to-windows-azure-part-5-moving-from-a-subfolder-to-the-root)

* [How to set up a WordPress web app in your Azure account](http://www.itexperience.net/2014/01/20/how-to-set-up-a-wordpress-website-in-your-windows-azure-account/)

* [Propping up WordPress on Azure](http://www.johnpapa.net/wordpress-on-azure/)

* [Tips for WordPress on Azure](http://www.johnpapa.net/azurecleardbmysql/)

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)

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
[customdomain]: web-sites-custom-domain-name.md
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
[httpscustomdomain]: web-sites-configure-ssl-certificate.md
[mysqlwindows]: ../virtual-machines/virtual-machines-windows-classic-mysql-2008r2.md
[mysqllinux]: ../virtual-machines/virtual-machines-linux-classic-mysql-on-opensuse.md
[cge]: http://www.mysql.com/products/cluster/
[websitepricing]: /pricing/details/app-service/
[export]: http://en.support.wordpress.com/export/
[import]: http://wordpress.org/plugins/wordpress-importer/
[wordpressbackup]: http://wordpress.org/plugins/wordpress-importer/
[wordpressdbbackup]: http://codex.wordpress.org/Backing_Up_Your_Database
[createwordpress]: web-sites-php-web-site-gallery.md
[velvet]: https://wordpress.org/plugins/velvet-blues-update-urls/
[mgmtportal]: https://portal.azure.com/
[wordpressbackup]: http://codex.wordpress.org/WordPress_Backups
[wordpressdbbackup]: http://codex.wordpress.org/Backing_Up_Your_Database
[workbench]: http://www.mysql.com/products/workbench/
[searchandreplace]: http://interconnectit.com/124/search-and-replace-for-wordpress-databases/
[deploy]: web-sites-deploy.md
[posh]: ../powershell-install-configure.md
[Azure CLI]: ../xplat-cli-install.md
[storesendgrid]: https://azure.microsoft.com/marketplace/partners/sendgrid/sendgrid-azure/
[cdn]: ../cdn/cdn-overview.md
