---
title: 'Tutorial: Create a WordPress site on Azure App Service integrating with Azure Database for MySQL - Flexible Server'
description: Create your first and fully managed WordPress site on Azure App Service and integrate with Azure Database for MySQL - Flexible Server in minutes.
author: shreyaaithal
ms.author: shaithal
ms.service: mysql
ms.subservice: flexible-server
ms.topic: tutorial
ms.devlang: wordpress
ms.date: 8/11/2022
ms.custom: mvc, devx-track-azurecli
---

# Tutorial: Create a WordPress site on Azure App Service integrating with Azure Database for MySQL - Flexible Server

[WordPress](https://www.wordpress.org) is an open source content management system (CMS) that can be used to create websites, blogs, and other applications. Over 40% of the web uses WordPress from blogs to major news websites.

In this tutorial, you'll learn how to create and deploy your first [WordPress](https://www.wordpress.org) site to [Azure App Service on Linux](../../app-service/overview.md#app-service-on-linux) integrating with [Azure Database for MySQL - Flexible Server]() in the backend. You'll use the [WordPress on Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/WordPress.WordPress?tab=Overview) to set up your site along with the database integration within minutes.

## Prerequisites

- An Azure subscription [!INCLUDE [flexible-server-free-trial-note](../includes/flexible-server-free-trial-note.md)]


## Create WordPress site using Azure portal

1. Browse to [https://ms.portal.azure.com/#create/WordPress.WordPress](https://ms.portal.azure.com/#create/WordPress.WordPress), or search for "WordPress" in the Azure Marketplace.

    :::image type="content" source="./media/tutorial-wordpress-app-service/01-portal-create-wordpress-on-app-service.png?text=WordPress from Azure Marketplace" alt-text="Screenshot of Create a WordPress site.":::

1. In the **Basics** tab, under **Project details**, make sure the correct subscription is selected and then choose to **Create new** resource group. Type `myResourceGroup` for the name and select a **Region** you want to serve your app from.

     :::image type="content" source="./media/tutorial-wordpress-app-service/04-wordpress-basics-project-details.png?text=Azure portal WordPress Project Details" alt-text="Screenshot of WordPress project details.":::

1. Under **Instance details**, type a globally unique name for your web app and choose **Linux** for **Operating System**. For the purposes of this tutorial, select **Basic** for **Hosting plan**. 

     :::image type="content" source="./media/tutorial-wordpress-app-service/05-wordpress-basics-instance-details.png?text=WordPress basics instance details" alt-text="Screenshot of WordPress instance details.":::

    For app and database SKUs for each hosting plans, see the below table. 
    
    | **Hosting Plan** | **Web App** | **Database (MySQL Flexible Server)** |
    |---|---|---|
    |Basic (Hobby or Research purposes) | B1 (1 vCores, 1.75 GB RAM, 10 GB Storage) | Burstable, B1ms (1 vCores, 2 GB RAM, 32 GB Storage, 400 IOPs) |
    |Standard (General Purpose production apps)| P1V2 (1 vCores, 3.5 GB RAM, 250 GB Storage)| General Purpose D2ds_v4 (2 vCores, 8 GB RAM, 128 GB Storage, 700 IOPs)|
    |Premium (Heavy Workload production apps) | P1V3 (2 Cores, 8 GB RAM, 250 GB storage) | Business Critical, Standard_E4ds_v4 (2 vCores, 16 GB RAM, 256 GB storage, 1100 IOPS) |

    For pricing, visit [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/) and [Azure Database for MySQL pricing](https://azure.microsoft.com/pricing/details/mysql/flexible-server/). 

1. <a name="wordpress-settings"></a>Under **WordPress Settings**, type an **Admin Email**, **Admin Username**, and **Admin Password**. The **Admin Email** here is used for WordPress administrative sign-in only.

     :::image type="content" source="./media/tutorial-wordpress-app-service/06-wordpress-basics-wordpress-settings.png?text=Azure portal WordPress settings" alt-text="Screenshot of WordPress settings.":::

1. Select the **Advanced** tab. Under **Additional Settings** choose your preferred **Site Language** and  **Content Distribution**. If you're unfamiliar with a [Content Delivery Network](../../cdn/cdn-overview.md) or [Blob Storage](../../storage/blobs/storage-blobs-overview.md), select **Disabled**. For more details on the Content Distribution options, see [WordPress on App Service](https://azure.github.io/AppService/2022/02/23/WordPress-on-App-Service-Public-Preview.html).

    :::image type="content" source="./media/tutorial-wordpress-app-service/08-wordpress-advanced-settings.png" alt-text="Screenshot of WordPress Advanced Settings.":::

1. Select the **Review + create** tab. After validation runs, select the **Create** button at the bottom of the page to create the WordPress site.
 
    :::image type="content" source="./media/tutorial-wordpress-app-service/09-wordpress-create.png?text=WordPress create button" alt-text="Screenshot of WordPress create button.":::

1. Browse to your site URL and verify the app is running properly. The site may take a few minutes to load. If you receive an error, allow a few more minutes then refresh the browser.

    :::image type="content" source="./media/tutorial-wordpress-app-service/wordpress-sample-site.png?text=WordPress sample site" alt-text="Screenshot of WordPress site.":::

1. To access the WordPress Admin page, browse to `/wp-admin` and use the credentials you created in the [WordPress settings step](#wordpress-settings).

    :::image type="content" source="./media/tutorial-wordpress-app-service/wordpress-admin-login.png?text=WordPress admin login" alt-text="Screenshot of WordPress admin login.":::

> [!NOTE]
> - [After November 28, 2022, PHP will only be supported on App Service on Linux.](https://github.com/Azure/app-service-linux-docs/blob/master/Runtime_Support/php_support.md#end-of-life-for-php-74).
> - The WordPress installation comes with pre-installed plugins for performance improvements, [W3TC](https://wordpress.org/plugins/w3-total-cache/) for caching and [Smush](https://wordpress.org/plugins/wp-smushit/) for image compression.
>  
> If you have feedback to improve this WordPress offering on App Service, submit your ideas at [Web Apps Community](https://feedback.azure.com/d365community/forum/b09330d1-c625-ec11-b6e6-000d3a4f0f1c).


## MySQL flexible server username and password

- Database username and password of the MySQL Flexible Server are generated automatically. To retrieve these values after the deployment go to Application Settings section of the Configuration page in Azure App Service. The WordPress configuration is modified to use these [Application Settings](../../app-service/reference-app-settings.md#wordpress) to connect to the MySQL database.

- To change the MySQL database password, see [Reset admin password](how-to-manage-server-portal.md#reset-admin-password). Whenever the MySQL database credentials are changed, the [Application Settings](../../app-service/reference-app-settings.md#wordpress) also need to be updated. The [Application Settings for MySQL database](../../app-service/reference-app-settings.md#wordpress) begin with the **`DATABASE_`** prefix. For more information on updating MySQL passwords, see [WordPress on App Service](https://azure.github.io/AppService/2022/02/23/WordPress-on-App-Service-Public-Preview.html#known-limitations).

## Manage the MySQL database

The MySQL Flexible Server is created behind a private [Virtual Network](../../virtual-network/virtual-networks-overview.md) and can't be accessed directly. To access and manage the database, use phpMyAdmin that's deployed with the WordPress site. 
- Navigate to the URL : https://`<sitename>`.azurewebsites.net/phpmyadmin
- Login with the flexible server's username and password

## Change WordPress admin password

The [Application Settings](../../app-service/reference-app-settings.md#wordpress) for WordPress admin credentials are only for deployment purposes. Modifying these values has no effect on the WordPress installation. To change the WordPress admin password, see [resetting your password](https://wordpress.org/support/article/resetting-your-password/#to-change-your-password). The [Application Settings for WordPress admin credentials](../../app-service/reference-app-settings.md#wordpress) begin with the **`WORDPRESS_ADMIN_`** prefix. For more information on updating the WordPress admin password, see [WordPress on App Service](https://azure.github.io/AppService/2022/02/23/WordPress-on-App-Service-Public-Preview.html#known-limitations).

## Clean up resources

When no longer needed, you can delete the resource group, App service, and all related resources.

1. From your App Service *overview* page, click the *resource group* you created in the [Create WordPress site using Azure portal](#create-wordpress-site-using-azure-portal) step.

    :::image type="content" source="./media/tutorial-wordpress-app-service/resource-group.png" alt-text="Resource group in App Service overview page.":::

1. From the *resource group* page, select **Delete resource group**. Confirm the name of the resource group to finish deleting the resources.

    :::image type="content" source="./media/tutorial-wordpress-app-service/delete-resource-group.png" alt-text="Delete resource group.":::

## Next steps

Congratulations, you've successfully completed this quickstart!

> [!div class="nextstepaction"]
> [Tutorial: Map a custom domain name](../../app-service/app-service-web-tutorial-custom-domain.md)

> [!div class="nextstepaction"]
> [Tutorial: PHP app with MySQL](tutorial-php-database-app.md)

> [!div class="nextstepaction"]
> [How to manage your server](how-to-manage-server-cli.md)
