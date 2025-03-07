---
title: 'Quickstart: Deploy a WordPress site on Azure App Service'
description: Learn how to create and deploy a WordPress site on Azure App Service with Azure Database for MySQL. This quickstart walks you through setting up WordPress, configuring hosting plans, and managing essential site settings.
keywords: app service, azure app service, wordpress, wordpress hosting, azure wordpress, php, mysql flexible server, linux app service, wordpress on linux, azure marketplace

author: msangapu-msft
ms.subservice: wordpress
ms.topic: quickstart
ms.date: 02/21/2025
# ms.devlang: wordpress
ms.author: msangapu
ms.custom: mvc, linux-related-content
---
# Create a WordPress site

In this quickstart, you'll learn how to create and deploy your first [WordPress](https://www.wordpress.org/) site to [Azure App Service on Linux](overview.md#app-service-on-linux) with [Azure Database for MySQL - Flexible Server](/azure/mysql/flexible-server/) using the [WordPress Azure Marketplace item by App Service](https://azuremarketplace.microsoft.com/marketplace/apps/WordPress.WordPress?tab=Overview). This quickstart uses the **Standard** tier for your app and a **Burstable, B2s** tier for your database, and incurs a cost for your Azure Subscription. For pricing, visit [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/), [Azure Database for MySQL pricing](https://azure.microsoft.com/pricing/details/mysql/flexible-server/), [Content Delivery Network pricing](https://azure.microsoft.com/pricing/details/storage/blobs/), and [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/). You can learn more about WordPress on App Service in the [overview](overview-wordpress.md).

To complete this quickstart, you need an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs).

## Create WordPress site using Azure portal

1. To start creating the WordPress site, browse to [https://portal.azure.com/#create/WordPress.WordPress](https://portal.azure.com/#create/WordPress.WordPress).

    :::image type="content" source="./media/quickstart-wordpress/01-portal-create-wordpress-on-app-service.png?text=WordPress from Azure Marketplace" alt-text="Screenshot of Create a WordPress site on Azure App Service.":::

1. In the **Basics** tab, under **Project details**, make sure the correct subscription is selected. Select **Create new** resource group and type **`myResourceGroup`** for the name.

     :::image type="content" source="./media/quickstart-wordpress/04-wordpress-basics-project-details.png?text=Azure portal WordPress Project Details" alt-text="Screenshot of WordPress project details.":::

1. Under **Hosting details**,  select a **Region** you want to serve your app from, then type a globally unique name for your web app. Under **Hosting plans**, select **Standard**. Select **Change plan** to view features and price comparisons.

     :::image type="content" source="./media/quickstart-wordpress/05-wordpress-basics-instance-details.png?text=WordPress basics instance details" alt-text="Screenshot of WordPress instance details.":::

1. <a name="wordpress-setup"></a>Under **WordPress setup**, choose your preferred **Site Language**, then type an **Admin Email**, **Admin Username**, and **Admin Password**. The **Admin Email** is used for WordPress administrative sign-in only. Clear the **Enable multisite** checkbox.

     :::image type="content" source="./media/quickstart-wordpress/06-wordpress-basics-wordpress-settings.png?text=Azure portal WordPress settings" alt-text="Screenshot of WordPress settings on Azure App Service..":::

1. Select the **Advanced** tab. If you're unfamiliar with an [Azure CDN](../cdn/cdn-overview.md), [Azure Front Door](../frontdoor/front-door-overview.md), or [Blob Storage](../storage/blobs/storage-blobs-overview.md), then clear the checkboxes. For more details on the Content Distribution options, see [WordPress on App Service](https://azure.github.io/AppService/2022/02/23/WordPress-on-App-Service-Public-Preview.html).

    :::image type="content" source="./media/quickstart-wordpress/08-wordpress-advanced-settings.png" alt-text="Screenshot of WordPress Advanced Settings.":::
    
   > [!NOTE]
   > The WordPress app requires a virtual network with an address space of /23 at minimum. 

1. Select the **Review + create** tab. After validation runs, select the **Create** button at the bottom of the page to create the WordPress site.
 
    :::image type="content" source="./media/quickstart-wordpress/09-wordpress-create.png?text=WordPress create button" alt-text="Screenshot of WordPress create button on Azure App Service.":::

1. Browse to your site URL and verify the app is running properly. The site may take a few minutes to load. If you receive an error, allow a few more minutes then refresh the browser.

    :::image type="content" source="./media/quickstart-wordpress/wordpress-sample-site.png?text=WordPress sample site" alt-text="Screenshot of WordPress site on Azure App Service.":::

1. To access the WordPress Admin page, browse to `/wp-admin` and use the credentials you created in the [WordPress setup](#wordpress-setup) step.

    :::image type="content" source="./media/quickstart-wordpress/wordpress-admin-login.png?text=WordPress admin login" alt-text="Screenshot of WordPress admin login on Azure App Service.":::
    
     
## Clean up resources

When no longer needed, you can delete the resource group, App service, and all related resources.

1. From your App Service *overview* page, click the *resource group* you created in the [Create WordPress site using Azure portal](#create-wordpress-site-using-azure-portal) step.

    :::image type="content" source="./media/quickstart-wordpress/resource-group.png" alt-text="Resource group in App Service overview page.":::

1. From the *resource group* page, select **Delete resource group**. Confirm the name of the resource group to finish deleting the resources.

    :::image type="content" source="./media/quickstart-wordpress/delete-resource-group.png" alt-text="Delete resource group.":::

## Manage the MySQL flexible server, username, or password (optional)

- The MySQL Flexible Server is created behind a private [Virtual Network](../virtual-network/virtual-networks-overview.md) and can't be accessed directly. To access or manage the database, use phpMyAdmin that's deployed with the WordPress site. You can access phpMyAdmin by following these steps:
    - Navigate to the URL: https://`<sitename>`.azurewebsites.net/phpmyadmin
    - Login with the flexible server's username and password

- Database username and password of the MySQL Flexible Server are generated automatically. To retrieve these values after the deployment go to Application Settings section of the Configuration page in Azure App Service. The WordPress configuration is modified to use these [Application Settings](reference-app-settings.md#wordpress) to connect to the MySQL database.

- To change the MySQL database password, see [Reset admin password](/azure/mysql/flexible-server/how-to-manage-server-portal#reset-admin-password). Whenever the MySQL database credentials are changed, the [Application Settings](reference-app-settings.md#wordpress) need to be updated. The [Application Settings for MySQL database](reference-app-settings.md#wordpress) begin with the **`DATABASE_`** prefix. For more information on updating MySQL passwords, see [WordPress on App Service](https://github.com/Azure/wordpress-linux-appservice/blob/main/WordPress/changing_mysql_database_password.md).

## Change WordPress admin password (optional)

The [Application Settings](reference-app-settings.md#wordpress) for WordPress admin credentials are only for deployment purposes. Modifying these values has no effect on the WordPress installation. To change the WordPress admin password, see [resetting your password](https://wordpress.org/support/article/resetting-your-password/#to-change-your-password). The [Application Settings for WordPress admin credentials](reference-app-settings.md#wordpress) begin with the **`WORDPRESS_ADMIN_`** prefix. For more information on updating the WordPress admin password, see [Changing WordPress Admin Credentials](https://github.com/Azure/wordpress-linux-appservice/blob/main/WordPress/changing_wordpress_admin_credentials.md).

## Migrate to App Service on Linux (optional)

There's a couple approaches when migrating your WordPress app to App Service on Linux. You could use a WP plugin or migrate manually using FTP and a MySQL client. Additional documentation, including [Migrating to App Service](https://github.com/Azure/wordpress-linux-appservice/blob/main/WordPress/wordpress_migration_linux_appservices.md), can be found at [WordPress - App Service on Linux](https://github.com/Azure/wordpress-linux-appservice/tree/main/WordPress).

## Related content

Congratulations, you've successfully completed this quickstart!

> [!div class="nextstepaction"]
> [Secure with custom domain and certificate](tutorial-secure-domain-certificate.md)

> [!div class="nextstepaction"]
> [Tutorial: PHP app with MySQL](tutorial-php-mysql-app.md)

> [!div class="nextstepaction"]
> [Configure PHP app](configure-language-php.md)
