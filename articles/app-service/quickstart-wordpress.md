---
title: 'Quickstart: Create a WordPress site'
description: Create your first WordPress site on Azure App Service in minutes.
keywords: app service, azure app service, wordpress, preview, app service on linux, plugins, mysql flexible server, wordpress on linux, php
ms.topic: quickstart
ms.date: 01/14/2021
ms.devlang: wordpress
ms.author: msangapu
ms.custom: mvc
---
# Create a WordPress site

In this quickstart, you'll learn how to create and deploy your first [WordPress](https://www.wordpress.org) site to [Azure App Service](overview.md) using [Azure portal](https://portal.azure.com). 

This quickstart configures WordPress in App Service on Linux.  It uses the **Basic** tier and [**incurs a cost**](https://azure.microsoft.com/pricing/details/app-service/linux/) for your Azure subscription.

> [!IMPORTANT]
> WordPress in App Service on Linux is in preview. [View the announcement](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/the-new-and-better-wordpress-on-app-service/ba-p/3202594).
>
> [After November 28, 2022, PHP will only be supported on App Service on Linux.](https://github.com/Azure/app-service-linux-docs/blob/master/Runtime_Support/php_support.md#end-of-life-for-php-74)

### Sign in to Azure portal

Sign in to the Azure portal at https://portal.azure.com.

## Create WordPress site using Azure portal

1. In the Azure portal, click **Create a resource**.

     :::image type="content" source="./media/quickstart-wordpress/01-portal-create-resource.png?text=Azure portal create a resource" alt-text="Screenshot of Azure portal create resource":::

1. In **Create a resource**, type **WordPress** in the search and press **enter**.

     :::image type="content" source="./media/quickstart-wordpress/02-portal-create-resource-search-wordpress.png?text=Azure portal Create Resource WordPress Details" alt-text="Screenshot of WordPress in Create Resource search":::

1. Select the **WordPress** product for **App Service**. 

     :::image type="content" source="./media/quickstart-wordpress/03-wordpress-marketplace.png?text=WordPress in Azure Marketplace" alt-text="Screenshot of WordPress in Azure Marketplace":::

1. In the **Basics** tab, under **Project details**, make sure the correct subscription is selected and then choose to **Create new** resource group. Type **`myResourceGroup`** for the name and select a **Region** you want to serve your app from.

     :::image type="content" source="./media/quickstart-wordpress/04-wordpress-basics-project-details.png?text=Azure portal WordPress Project Details" alt-text="Screenshot of WordPress project details":::

1. Under **Instance details**, type a globally unique name for your web app and choose **Linux (preview)** for **Operating System**. Select **Basic** for **Hosting plan**. See the table below for app and database SKUs for given hosting plans. You can view [hosting plans details in the announcement](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/the-new-and-better-wordpress-on-app-service/ba-p/3202594). For pricing, visit [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/) and [Azure Database for MySQL pricing](https://azure.microsoft.com/pricing/details/mysql/flexible-server/). 

     :::image type="content" source="./media/quickstart-wordpress/05-wordpress-basics-instance-details.png?text=WordPress basics instance details" alt-text="Screenshot of WordPress instance details":::

1. <a name="wordpress-settings"></a>Under **WordPress Settings**, type an **Admin Email**, **Admin Username**, and **Admin Password**. The **Admin Email** here is used for WordPress administrative sign-in only.

     :::image type="content" source="./media/quickstart-wordpress/06-wordpress-basics-wordpress-settings.png?text=Azure portal WordPress settings" alt-text="Screenshot of WordPress settings":::

1. Select the **Review + create** tab. After validation runs, select the **Create** button at the bottom of the page to create the WordPress site.
 
    :::image type="content" source="./media/quickstart-wordpress/08-wordpress-create.png?text=WordPress create button" alt-text="Screenshot of WordPress create button":::

    > [!NOTE]
    > App Service creates environment variables and application settings needed for WordPress/PHP configuration. See [Environment variables and app settings in Azure App Service](reference-app-settings.md#wordpress) for more information.

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
> [Tutorial: PHP app with MySQL](tutorial-php-mysql-app.md)

> [!div class="nextstepaction"]
> [Configure PHP app](configure-language-php.md)
