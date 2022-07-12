---
title: 'Quickstart: Create a WordPress site'
description: Create your first WordPress site on Azure App Service in minutes.
keywords: app service, azure app service, wordpress, preview, app service on linux, plugins, mysql flexible server, wordpress on linux, php
ms.topic: quickstart
ms.date: 06/27/2022
ms.devlang: wordpress
ms.author: msangapu
ms.custom: mvc
---
# Create a WordPress site

[WordPress](https://www.wordpress.org) is an open source content management system (CMS) that can be used to create websites, blogs, and other applications. Over 40% of the web uses WordPress from  blogs to major news websites.

In this quickstart, you'll learn how to create and deploy your first [WordPress](https://www.wordpress.org) site to [Azure App Service on Linux](overview.md#app-service-on-linux) using [Azure portal](https://portal.azure.com). It uses the **Basic** tier and [**incurs a cost**](https://azure.microsoft.com/pricing/details/app-service/linux/) for your Azure subscription. The WordPress installation comes with pre-installed plugins for performance improvements, [W3TC](https://wordpress.org/plugins/w3-total-cache/) for caching and [Smush](https://wordpress.org/plugins/wp-smushit/) for image compression.

> [!IMPORTANT]
> [After November 28, 2022, PHP will only be supported on App Service on Linux.](https://github.com/Azure/app-service-linux-docs/blob/master/Runtime_Support/php_support.md#end-of-life-for-php-74) Due to this reason, this article deploys WordPress to App Service on Linux.
>

## Create WordPress site using Azure portal

1. Sign in to the Azure portal at https://portal.azure.com.
1. In the Azure portal, click **Create a resource**.

     :::image type="content" source="./media/quickstart-wordpress/01-portal-create-resource.png?text=Azure portal create a resource" alt-text="Screenshot of Azure portal create resource":::

1. In **Create a resource**, type **WordPress** in the search and press **enter**.

     :::image type="content" source="./media/quickstart-wordpress/02-portal-create-resource-search-wordpress.png?text=Azure portal Create Resource WordPress Details" alt-text="Screenshot of WordPress in Create Resource search":::

1. Select the **WordPress** product for **App Service**. 

     :::image type="content" source="./media/quickstart-wordpress/03-wordpress-marketplace.png?text=WordPress in Azure Marketplace" alt-text="Screenshot of WordPress in Azure Marketplace":::

1. In the **Basics** tab, under **Project details**, make sure the correct subscription is selected and then choose to **Create new** resource group. Type **`myResourceGroup`** for the name and select a **Region** you want to serve your app from.

     :::image type="content" source="./media/quickstart-wordpress/04-wordpress-basics-project-details.png?text=Azure portal WordPress Project Details" alt-text="Screenshot of WordPress project details":::

1. Under **Instance details**, type a globally unique name for your web app and choose **Linux** for **Operating System**. Select **Basic** for **Hosting plan**. See the table below for app and database SKUs for given hosting plans. You can view [hosting plans details in the announcement](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/the-new-and-better-wordpress-on-app-service/ba-p/3202594). For pricing, visit [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/) and [Azure Database for MySQL pricing](https://azure.microsoft.com/pricing/details/mysql/flexible-server/). 

     :::image type="content" source="./media/quickstart-wordpress/05-wordpress-basics-instance-details.png?text=WordPress basics instance details" alt-text="Screenshot of WordPress instance details":::

1. <a name="wordpress-settings"></a>Under **WordPress Settings**, type an **Admin Email**, **Admin Username**, and **Admin Password**. The **Admin Email** here is used for WordPress administrative sign-in only.

     :::image type="content" source="./media/quickstart-wordpress/06-wordpress-basics-wordpress-settings.png?text=Azure portal WordPress settings" alt-text="Screenshot of WordPress settings":::

1. Select the **Advanced** tab. Under **Additional Settings** choose your preferred **Site Language** and  **Content Distribution**. If you're unfamiliar with a [Content Delivery Network](../cdn/cdn-overview.md) or [Blob Storage](../storage/blobs/storage-blobs-overview.md), select **Disabled**. For more details on the Content Distribution options, see [WordPress on App Service](https://azure.github.io/AppService/2022/02/23/WordPress-on-App-Service-Public-Preview.html).

    :::image type="content" source="./media/quickstart-wordpress/08-wordpress-advanced-settings.png" alt-text="Screenshot of WordPress Advanced Settings":::

1. Select the **Review + create** tab. After validation runs, select the **Create** button at the bottom of the page to create the WordPress site.
 
    :::image type="content" source="./media/quickstart-wordpress/09-wordpress-create.png?text=WordPress create button" alt-text="Screenshot of WordPress create button":::

    > [!NOTE]
    > App Service creates environment variables and application settings needed for WordPress/PHP configuration. For more information on customizing environment variables, see the WordPress section in [Environment variables and app settings in Azure App Service](reference-app-settings.md#wordpress).

1. Browse to your site URL and verify the app is running properly. The site may take a few minutes to load. If you receive an error, allow a few more minutes then refresh the browser.

    :::image type="content" source="./media/quickstart-wordpress/wordpress-sample-site.png?text=WordPress sample site" alt-text="Screenshot of WordPress site":::

1. To access the WordPress Admin page, browse to `/wp-admin` and use the credentials you created in the [WordPress settings step](#wordpress-settings).

    :::image type="content" source="./media/quickstart-wordpress/wordpress-admin-login.png?text=WordPress admin login" alt-text="Screenshot of WordPress admin login":::

## Clean up resources

When no longer needed, you can delete the resource group, App service, and all related resources.

1. From your App Service *overview* page, click the *resource group* you created in the [Create WordPress site using Azure portal](#create-wordpress-site-using-azure-portal) step.

    :::image type="content" source="./media/quickstart-wordpress/resource-group.png" alt-text="Resource group in App Service overview page":::

1. From the *resource group* page, select **Delete resource group**. Confirm the name of the resource group to finish deleting the resources.

    :::image type="content" source="./media/quickstart-wordpress/delete-resource-group.png" alt-text="Delete resource group":::

## Next steps

Congratulations, you've successfully completed this quickstart!

> [!div class="nextstepaction"]
> [Tutorial: Map a custom domain name](app-service-web-tutorial-custom-domain.md)

> [!div class="nextstepaction"]
> [Tutorial: PHP app with MySQL](tutorial-php-mysql-app.md)

> [!div class="nextstepaction"]
> [Configure PHP app](configure-language-php.md)
