---
title: 'Quickstart: Create a WordPress site'
description: Create your first WordPress site on Azure App Service in minutes.
ms.topic: quickstart
ms.date: 01/14/2021
ms.devlang: wordpress
ms.custom: mvc
---
# Create a WordPress site in Azure

In this quickstart, you'll learn how to create and deploy your first  ([WordPress](https://www.wordpress.org)) site to [Azure App Service](overview.md) using [Azure Portal](https://portal.azure.com). 

This quickstart configures WordPress in App Service on Linux. It uses the **Basic** tier and [**incurs a cost**](https://azure.microsoft.com/pricing/details/app-service/linux/) for your Azure subscription.

> [!IMPORTANT]
> [After November 28, 2022, PHP will only be supported on App Service on Linux.](https://github.com/Azure/app-service-linux-docs/blob/master/Runtime_Support/php_support.md#end-of-life-for-php-74)

### Sign in to Azure portal

Sign in to the Azure portal at https://portal.azure.com.

## Create WordPress site using Azure Portal

1. In the Azure Portal, click **Create a resource**.

     :::image type="content" source="./media/quickstart-wordpress/01-portal-create-resource.png?text=Azure Portal create a resource" alt-text="Screenshot of Azure Portal create resource":::

1. In **Create a resource**, type **WordPress** in the search and press **enter**.

     :::image type="content" source="./media/quickstart-wordpress/02-portal-create-resource-search-wordpress.png?text=Azure Portal Create Resource WordPress Details" alt-text="Screenshot of WordPress in Create Resource search":::

1. Select the **WordPress** product for **App Service**. 

     :::image type="content" source="./media/quickstart-wordpress/03-wordpress-marketplace.png?text=WordPress in Azure Marketplace" alt-text="Screenshot of WordPress in Azure Marketplace":::

1. In the **Basics** tab, under **Project details**, make sure the correct subscription is selected and then choose to **Create new** resource group. Type **`myResourceGroup`** for the name and select a **Region** you want to serve your app from.

     :::image type="content" source="./media/quickstart-wordpress/04-wordpress-basics-project-details.png?text=Azure portal WordPress Project Details" alt-text="Screenshot of WordPress project details":::

1. Under **Instance details**, type a globally unique name for your web app and choose **Linux** for **Operating System**. Select **Basic** for **Hosting plan**. See the table below for App and DB SKUs. For pricing, visit [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/) and [Azure Database for MySQL pricing](https://azure.microsoft.com/pricing/details/mysql/flexible-server/). 

    > [!div class="mx-tdCol2BreakAll mx-tdCol3BreakAll"]
    > |Hosting Plan | App Service SKU | Database SKU |
    > |-------------|-------------|-------------|
    > | Basic | B1, 1.75 GB Memory, 10GB Storage A-Series Compute Equivalent | 	Flexi Server - Burstable (1-2 vCores) – Standard B1s(1v Core, 1GB Memory, 32 GB Storage & 400 IOPs)|
    > |Development |	S1, 1.75 GB Memory, 50 GB Storage A-Series Compute Equivalent |	Flexi Server - Burstable (1-2 vCores) – Standard_B1ms(1v Core, 2 GB Memory, 64 GB Storage and 500 IOPs)|
    > |Standard |	P1V2, 3.5 GB Memory, 250GB Storage Dv2 Series Compute Equivalent |	Flexi Server - Burstable (1-2 vCores) - Standard_B2s(  2v Core, 4 GB Memory,   128 GB Storage and 700 IOPs) |
    > |Premium |P1V3, 8 GB Memory, 250GB Storage 2 v CPU	| Flexi Server - General Purpose (2-64 vCores) Standard_D2ds_v4(2v Core, 8 GB Memory, 128 GB Storage and 700 IOPs) |

     :::image type="content" source="./media/quickstart-wordpress/05-wordpress-basics-instance-details.png?text=WordPress basics instance details" alt-text="Screenshot of WordPress instance details":::

1. Under **WordPress Settings**, type an **Admin Email**, **Admin Username**, and **Admin Password**. The **Admin Email** here is used for WordPress administrative sign-in only.

     :::image type="content" source="./media/quickstart-wordpress/06-wordpress-basics-wordpress-settings.png?text=Azure Portal WordPress settings" alt-text="Screenshot of WordPress settings":::

1. Select the **Review + create** tab. After validation runs, select the **Create** button at the bottom of the page to create the WordPress site.

1. Browse to your site URL and verify the app is running properly.

    :::image type="content" source="./media/quickstart-wordpress/wordpress-sample-site.png?text=WordPress sample site" alt-text="Screenshot of WordPress site":::

1. To access WordPress Admin page, browse to `/wp-admin` on your site.

    :::image type="content" source="./media/quickstart-wordpress/wordpress-admin-login.png?text=WordPress admin login" alt-text="Screenshot of WordPress admin login":::

## WordPress Application Settings

App Service creates the following Application Settings for the WordPress site:

> [!div class="mx-tdCol5BreakAll"]
> |Application Setting | Scope | Value | Max | Description
> |-------------|-------------|-------------|---------------|--------------------|
> |WEBSITES_ENABLE_APP_SERVICE_STORAGE|Web App|true|-|When set to TRUE, file contents are preserved during restarts. |
> |WP_MEMORY_LIMIT|WordPress|128M|512M|Frontend or general wordpress PHP memory limit (per script). Can't be more than PHP_MEMORY_LIMIT|
> |WP_MAX_MEMORY_LIMIT|WordPress|256M|512M|Admin dashboard PHP memory limit (per script). Generally Admin dashboard/ backend scripts takes lot of memory compared to frontend scripts. Can't be more than PHP_MEMORY_LIMIT.|
> |PHP_MEMORY_LIMIT|PHP|512M|512M|Memory limits for general PHP script. It can only be decreased.|
> |FILE_UPLOADS|PHP|On|-|Can be either On or Off. Note that values are case sensitive. Enables or disables file uploads. |
> |UPLOAD_MAX_FILESIZE|PHP|50M|256M	Max file upload size limit. Can be increased upto 256M.|
> |POST_MAX_SIZE|PHP|128M|256M|Can be increased upto 256M. Generally should be more than UPLOAD_MAX_FILESIZE.|
> |MAX_EXECUTION_TIME|PHP|120|120|Can only be decreased. Please break down the scripts if it is taking more than 120 seconds. Added to avoid bad scripts from slowing the system.|
> |MAX_INPUT_TIME|PHP|120|120|Max time limit for parsing the input requests. Can only be decreased.|
> |MAX_INPUT_VARS|PHP|10000|10000|-|
> |DATABASE_HOST|Database|-|-|Database host used to connect to WordPress.|
> |DATABASE_NAME|Database|-|-|Database name used to connect to WordPress.|
> |DATABASE_USERNAME|Database|-|-|Database username used to connect to WordPress.|
> |DATABASE_PASSWORD|Database|-|-|Database password used to connect to WordPress.|

## Clean up resources

When no longer needed, you can delete the resource group, App service, and all related resources.

1. From your App Service *overview* page, click the *resource group* you created in the [Create WordPress site using Azure Portal](#create-wordpress-site-using-azure-portal) step.

    :::image type="content" source="./media/quickstart-wordpress/resource-group.png" alt-text="Resource group in App Service overview page":::

1. From the *resource group* page, select **Delete resource group**. Confirm the name of the resource group to finish deleting the resources.

    :::image type="content" source="./media/quickstart-wordpress/delete-resource-group.png" alt-text="Delete resource group":::

## Next steps

Congratulations, you've successfully completed this quickstart!

> [!div class="nextstepaction"]
> [Tutorial: PHP app with MySQL](tutorial-php-mysql-app.md)

> [!div class="nextstepaction"]
> [Configure PHP app](configure-language-php.md)
