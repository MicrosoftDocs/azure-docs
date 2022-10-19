---
title: 'Quickstart: Create a WordPress site'
description: Create your first WordPress site on Azure App Service in minutes.
keywords: app service, azure app service, wordpress, preview, app service on linux, plugins, mysql flexible server, wordpress on linux, php
author: msangapu-msft
ms.topic: quickstart
ms.date: 06/27/2022
ms.devlang: wordpress
ms.author: msangapu
ms.custom: mvc
---
# Create a WordPress site

[WordPress](https://www.wordpress.org) is an open source content management system (CMS) used by over 40% of the web to create websites, blogs, and other applications. WordPress can be run on a few different Azure services: [AKS](../mysql/flexible-server/tutorial-deploy-wordpress-on-aks.md), [Virtual Machines](../virtual-machines/linux/tutorial-lamp-stack.md#install-wordpress), and App Service. For a full list of WordPress options on Azure, see [WordPress on Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps?search=wordpress&page=1).

In this quickstart, you'll learn how to create and deploy your first [WordPress](https://www.wordpress.org/) site to [Azure App Service on Linux](overview.md#app-service-on-linux) with [Azure Database for MySQL - Flexible Server](../mysql/flexible-server/index.yml) using the [WordPress Azure Marketplace item by App Service](https://azuremarketplace.microsoft.com/marketplace/apps/WordPress.WordPress?tab=Overview). This quickstart uses the **Basic** tier for your app and a **Burstable, B1ms** tier for your database, and incurs a cost for your Azure Subscription. For pricing, visit [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/) and [Azure Database for MySQL pricing](https://azure.microsoft.com/pricing/details/mysql/flexible-server/). 

To complete this quickstart, you need an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs).

> [!IMPORTANT]
> After November 28, 2022, [PHP will only be supported on App Service on Linux.](https://github.com/Azure/app-service-linux-docs/blob/master/Runtime_Support/php_support.md#end-of-life-for-php-74).
>
> Additional documentation, including [Migrating to App Service](https://github.com/Azure/wordpress-linux-appservice/blob/main/WordPress/wordpress_migration_linux_appservices.md), can be found at [WordPress - App Service on Linux](https://github.com/Azure/wordpress-linux-appservice/tree/main/WordPress).
>

## Create WordPress site using Azure portal

1. To start creating the WordPress site, browse to [https://ms.portal.azure.com/#create/WordPress.WordPress](https://ms.portal.azure.com/#create/WordPress.WordPress).

    :::image type="content" source="./media/quickstart-wordpress/01-portal-create-wordpress-on-app-service.png?text=WordPress from Azure Marketplace" alt-text="Screenshot of Create a WordPress site.":::

1. In the **Basics** tab, under **Project details**, make sure the correct subscription is selected and then choose to **Create new** resource group. Type **`myResourceGroup`** for the name and select a **Region** you want to serve your app from.

     :::image type="content" source="./media/quickstart-wordpress/04-wordpress-basics-project-details.png?text=Azure portal WordPress Project Details" alt-text="Screenshot of WordPress project details.":::

1. Under **Hosting details**, type a globally unique name for your web app and choose **Linux** for **Operating System**. Select **Basic** for **Hosting plan**. Select **Compare plans** to view features and price comparisons.

     :::image type="content" source="./media/quickstart-wordpress/05-wordpress-basics-instance-details.png?text=WordPress basics instance details" alt-text="Screenshot of WordPress instance details.":::

1. <a name="wordpress-settings"></a>Under **WordPress Settings**, type an **Admin Email**, **Admin Username**, and **Admin Password**. The **Admin Email** here is used for WordPress administrative sign-in only.

     :::image type="content" source="./media/quickstart-wordpress/06-wordpress-basics-wordpress-settings.png?text=Azure portal WordPress settings" alt-text="Screenshot of WordPress settings.":::

1. Select the **Advanced** tab. Under **Additional Settings** choose your preferred **Site Language** and  **Content Distribution**. If you're unfamiliar with a [Content Delivery Network](../cdn/cdn-overview.md) or [Blob Storage](../storage/blobs/storage-blobs-overview.md), select **Disabled**. For more details on the Content Distribution options, see [WordPress on App Service](https://azure.github.io/AppService/2022/02/23/WordPress-on-App-Service-Public-Preview.html).

    :::image type="content" source="./media/quickstart-wordpress/08-wordpress-advanced-settings.png" alt-text="Screenshot of WordPress Advanced Settings.":::

1. Select the **Review + create** tab. After validation runs, select the **Create** button at the bottom of the page to create the WordPress site.
 
    :::image type="content" source="./media/quickstart-wordpress/09-wordpress-create.png?text=WordPress create button" alt-text="Screenshot of WordPress create button.":::

1. Browse to your site URL and verify the app is running properly. The site may take a few minutes to load. If you receive an error, allow a few more minutes then refresh the browser.

    :::image type="content" source="./media/quickstart-wordpress/wordpress-sample-site.png?text=WordPress sample site" alt-text="Screenshot of WordPress site.":::

1. To access the WordPress Admin page, browse to `/wp-admin` and use the credentials you created in the [WordPress settings step](#wordpress-settings).

    :::image type="content" source="./media/quickstart-wordpress/wordpress-admin-login.png?text=WordPress admin login" alt-text="Screenshot of WordPress admin login.":::
    
> [!NOTE]
> If you have feedback to improve this WordPress offering on App Service, submit your ideas at [Web Apps Community](https://feedback.azure.com/d365community/forum/b09330d1-c625-ec11-b6e6-000d3a4f0f1c). 
>
     
## Clean up resources

When no longer needed, you can delete the resource group, App service, and all related resources.

1. From your App Service *overview* page, click the *resource group* you created in the [Create WordPress site using Azure portal](#create-wordpress-site-using-azure-portal) step.

    :::image type="content" source="./media/quickstart-wordpress/resource-group.png" alt-text="Resource group in App Service overview page.":::

1. From the *resource group* page, select **Delete resource group**. Confirm the name of the resource group to finish deleting the resources.

    :::image type="content" source="./media/quickstart-wordpress/delete-resource-group.png" alt-text="Delete resource group.":::

## Manage the MySQL flexible server, username, or password

- The MySQL Flexible Server is created behind a private [Virtual Network](/azure/virtual-network/virtual-networks-overview) and can't be accessed directly. To access or manage the database, use phpMyAdmin that's deployed with the WordPress site. You can access phpMyAdmin by following these steps:
    - Navigate to the URL: https://`<sitename>`.azurewebsites.net/phpmyadmin
    - Login with the flexible server's username and password

- Database username and password of the MySQL Flexible Server are generated automatically. To retrieve these values after the deployment go to Application Settings section of the Configuration page in Azure App Service. The WordPress configuration is modified to use these [Application Settings](reference-app-settings.md#wordpress) to connect to the MySQL database.

- To change the MySQL database password, see [Reset admin password](../mysql/flexible-server/how-to-manage-server-portal.md#reset-admin-password). Whenever the MySQL database credentials are changed, the [Application Settings](reference-app-settings.md#wordpress) need to be updated. The [Application Settings for MySQL database](reference-app-settings.md#wordpress) begin with the **`DATABASE_`** prefix. For more information on updating MySQL passwords, see [WordPress on App Service](https://github.com/Azure/wordpress-linux-appservice/blob/main/WordPress/changing_mysql_database_password.md).

## Change WordPress admin password

The [Application Settings](reference-app-settings.md#wordpress) for WordPress admin credentials are only for deployment purposes. Modifying these values has no effect on the WordPress installation. To change the WordPress admin password, see [resetting your password](https://wordpress.org/support/article/resetting-your-password/#to-change-your-password). The [Application Settings for WordPress admin credentials](reference-app-settings.md#wordpress) begin with the **`WORDPRESS_ADMIN_`** prefix. For more information on updating the WordPress admin password, see [Changing WordPress Admin Credentials](https://github.com/Azure/wordpress-linux-appservice/blob/main/WordPress/changing_wordpress_admin_credentials.md).

## Migrate to App Service on Linux

There's a couple approaches when migrating your WordPress app to App Service on Linux. You could use a WP plugin or migrate manually using FTP and a MySQL client. Additional documentation, including [Migrating to App Service](https://github.com/Azure/wordpress-linux-appservice/blob/main/WordPress/wordpress_migration_linux_appservices.md), can be found at [WordPress - App Service on Linux](https://github.com/Azure/wordpress-linux-appservice/tree/main/WordPress).

## Next steps

Congratulations, you've successfully completed this quickstart!

> [!div class="nextstepaction"]
> [Tutorial: Map a custom domain name](app-service-web-tutorial-custom-domain.md)

> [!div class="nextstepaction"]
> [Tutorial: PHP app with MySQL](tutorial-php-mysql-app.md)

> [!div class="nextstepaction"]
> [Configure PHP app](configure-language-php.md)
