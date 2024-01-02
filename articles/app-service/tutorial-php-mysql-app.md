---
title: 'Tutorial: PHP app with MySQL and Redis' 
description: Learn how to get a PHP app working in Azure, with connection to a MySQL database and a Redis cache in Azure. Laravel is used in the tutorial.
author: msangapu-msft
ms.author: msangapu
ms.assetid: 14feb4f3-5095-496e-9a40-690e1414bd73
ms.devlang: php
ms.topic: tutorial
ms.date: 06/30/2023
ms.custom: mvc, cli-validate, seodec18, devdivchpfy22, AppServiceConnectivity
---

# Tutorial: Deploy a PHP, MySQL, and Redis app to Azure App Service

This tutorial shows how to create a secure PHP app in Azure App Service that's connected to a MySQL database (using Azure Database for MySQL flexible server). You'll also deploy an Azure Cache for Redis to enable the caching code in your application. Azure App Service is a highly scalable, self-patching, web-hosting service that can easily deploy apps on Windows or Linux. When you're finished, you'll have a Laravel app running on Azure App Service on Linux.

:::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-browse-app-2.png" alt-text="Screenshot of the Azure app example titled Task List showing new tasks added.":::

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Sample application

To follow along with this tutorial, clone or download the sample [Laravel](https://laravel.com/) application from the repository:

```terminal
git clone https://github.com/Azure-Samples/laravel-tasks.git
```

If you want to run the application locally, do the following:

- In **.env**, configure the database settings (like `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD`) using settings in your local MySQL database. You need a local MySQL server to run this sample.
- From the root of the repository, start Laravel with the following commands:

    ```terminal
    composer install
    php artisan migrate
    php artisan key:generate
    php artisan serve
    ```

## 1 - Create App Service and MySQL resources

In this step, you create the Azure resources. The steps used in this tutorial create an App Service and Azure Database for MySQL configuration that's secure by default. For the creation process, you'll specify:

* The **Name** for the web app. It's the name used as part of the DNS name for your webapp in the form of `https://<app-name>.azurewebsites.net`.
* The **Runtime** for the app. It's where you select the version of PHP to use for your app.
* The **Resource Group** for the app. A resource group lets you group (in a logical container) all the Azure resources needed for the application.

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create your Azure App Service resources.

:::row:::
    :::column span="2":::
        **Step 1:** In the Azure portal:
        1. Enter "web app database" in the search bar at the top of the Azure portal.
        1. Select the item labeled **Web App + Database** under the **Marketplace** heading.
        You can also navigate to the [creation wizard](https://portal.azure.com/?feature.customportal=false#create/Microsoft.AppServiceWebAppDatabaseV3) directly.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-create-app-mysql-1.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find the Web App + Database creation wizard." lightbox="./media/tutorial-php-mysql-app/azure-portal-create-app-mysql-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the **Create Web App + Database** page, fill out the form as follows.
        1. *Resource Group* &rarr; Select **Create new** and use a name of **msdocs-laravel-mysql-tutorial**.
        1. *Region* &rarr; Any Azure region near you.
        1. *Name* &rarr; **msdocs-laravel-mysql-XYZ** where *XYZ* is any three random characters. This name must be unique across Azure.
        1. *Runtime stack* &rarr; **PHP 8.2**.
        1. *Add Azure Cache for Redis?* &rarr; **Yes**.
        1. *Hosting plan* &rarr; **Basic**. When you're ready, you can [scale up](manage-scale-up.md) to a production pricing tier later.
        1. **MySQL - Flexible Server** is selected for you by default as the database engine. Azure Database for MySQL is a fully managed MySQL database as a service on Azure, compatible with the latest community editions.
        1. Select **Review + create**.
        1. After validation completes, select **Create**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-create-app-mysql-2.png" alt-text="A screenshot showing how to configure a new app and database in the Web App + Database wizard." lightbox="./media/tutorial-php-mysql-app/azure-portal-create-app-mysql-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** The deployment takes a few minutes to complete. Once deployment completes, select the **Go to resource** button. You're taken directly to the App Service app, but the following resources are created:
        - **Resource group** &rarr; The container for all the created resources.
        - **App Service plan** &rarr; Defines the compute resources for App Service. A Linux plan in the *Basic* tier is created.
        - **App Service** &rarr; Represents your app and runs in the App Service plan.
        - **Virtual network** &rarr; Integrated with the App Service app and isolates back-end network traffic.
        - **Private endpoints** &rarr; Access endpoints for the database server and the Redis cache in the virtual network.
        - **Network interfaces** &rarr; Represents private IP addresses, one for each of the private endpoints.
        - **Azure Database for MySQL flexible server** &rarr; Accessible only from behind its private endpoint. A database and a user are created for you on the server.
        - **Azure Cache for Redis** &rarr; Accessible only from behind its private endpoint.
        - **Private DNS zones** &rarr; Enable DNS resolution of the database server and the Redis cache in the virtual network.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-create-app-mysql-3.png" alt-text="A screenshot showing the deployment process completed." lightbox="./media/tutorial-php-mysql-app/azure-portal-create-app-mysql-3.png":::
    :::column-end:::
:::row-end:::

## 2 - Set up database connectivity

:::row:::
    :::column span="2":::
        **Step 1:** In the App Service page, in the left menu, select **Configuration**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-get-connection-string-1.png" alt-text="A screenshot showing how to open the configuration page in App Service." lightbox="./media/tutorial-php-mysql-app/azure-portal-get-connection-string-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** 
        1. Find app settings that begin with **AZURE_MYSQL_**. They were generated from the new MySQL database by the creation wizard.
        1. Also, find app settings that begin with **AZURE_REDIS_**. They were generated from the new Redis cache by the creation wizard. To set up your application, this name is all you need.
        1. If you want, you can select the **Edit** button to the right of each setting and see or copy its value.
        Later, you'll change your application code to use these settings.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-get-connection-string-2.png" alt-text="A screenshot showing how to create an app setting." lightbox="./media/tutorial-php-mysql-app/azure-portal-get-connection-string-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** In the **Application settings** tab of the **Configuration** page, create a `CACHE_DRIVER` setting:
        1. Select **New application setting**.
        1. In the **Name** field, enter *CACHE_DRIVER*.
        1. In the **Value** field, enter *redis*.
        1. Select **OK**.
        `CACHE_DRIVER` is already used in the Laravel application code. This setting tells Laravel to use Redis as its cache.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-get-connection-string-3.png" alt-text="A screenshot showing how to see the autogenerated connection string." lightbox="./media/tutorial-php-mysql-app/azure-portal-get-connection-string-3.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4:** Using the same steps in **Step 3**, create the following app settings:
        - **MYSQL_ATTR_SSL_CA**: Use */home/site/wwwroot/ssl/DigiCertGlobalRootCA.crt.pem* as the value. This app setting points to the path of the [TLS/SSL certificate you need to access the MySQL server](../mysql/flexible-server/how-to-connect-tls-ssl.md#download-the-public-ssl-certificate). It's included in the sample repository for convenience.
        - **LOG_CHANNEL**: Use *stderr* as the value. This setting tells Laravel to pipe logs to stderr, which makes it available to the App Service logs.
        - **APP_DEBUG**: Use *true* as the value. It's a [Laravel debugging variable](https://laravel.com/docs/10.x/errors#configuration) that enables debug mode pages.
        - **APP_KEY**: Use *base64:Dsz40HWwbCqnq0oxMsjq7fItmKIeBfCBGORfspaI1Kw=* as the value. It's a [Laravel encryption variable](https://laravel.com/docs/10.x/encryption#configuration).
        1. In the menu bar at the top, select **Save**.
        1. When prompted, select **Continue**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-get-connection-string-4.png" alt-text="A screenshot showing how to save settings in the configuration page." lightbox="./media/tutorial-php-mysql-app/azure-portal-get-connection-string-4.png":::
    :::column-end:::
:::row-end:::

> [!IMPORTANT]
> The `APP_KEY` value is used here for convenience. For production scenarios, it should be generated specifically for your deployment using `php artisan key:generate --show` in the command line.

## 3 - Deploy sample code

In this step, you'll configure GitHub deployment using GitHub Actions. It's just one of many ways to deploy to App Service, but also a great way to have continuous integration in your deployment process. By default, every `git push` to your GitHub repository kicks off the build and deploy action. You'll make some changes to your codebase with Visual Studio Code directly in the browser, then let GitHub Actions deploy automatically for you.

:::row:::
    :::column span="2":::
        **Step 1:** In a new browser window:
        1. Sign in to your GitHub account.
        1. Navigate to [https://github.com/Azure-Samples/laravel-tasks](https://github.com/Azure-Samples/laravel-tasks).
        1. Select **Fork**.
        1. Select **Create fork**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-1.png" alt-text="A screenshot showing how to create a fork of the sample GitHub repository." lightbox="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the GitHub page, open Visual Studio Code in the browser by pressing the `.` key.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-2.png" alt-text="A screenshot showing how to open the Visual Studio Code browser experience in GitHub." lightbox="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** In Visual Studio Code in the browser, open *config/database.php* in the explorer. Find the `mysql` section and make the following changes:
        1. Replace `DB_HOST` with `AZURE_MYSQL_HOST`.
        1. Replace `DB_DATABASE` with `AZURE_MYSQL_DBNAME`.
        1. Replace `DB_USERNAME` with `AZURE_MYSQL_USERNAME`.
        1. Replace `DB_PASSWORD` with `AZURE_MYSQL_PASSWORD`.
        1. Replace `DB_PORT` with `AZURE_MYSQL_PORT`.
        Remember that these `AZURE_MYSQL_` settings were created for you by the create wizard.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-3.png" alt-text="A screenshot showing Visual Studio Code in the browser and an opened file with modified MySQL variables." lightbox="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-3.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4:** In *config/database.php* scroll to the Redis `cache` section and make the following changes:
        1. Replace `REDIS_HOST` with `AZURE_REDIS_HOST`.
        1. Replace `REDIS_PASSWORD` with `AZURE_REDIS_PASSWORD`.
        1. Replace `REDIS_PORT` with `AZURE_REDIS_PORT`.
        1. Replace `REDIS_CACHE_DB` with `AZURE_REDIS_DATABASE`.
        1. In the same section, add a line with `'scheme' => 'tls',`. This configuration tells Laravel to use encryption to connect to Redis.
        Remember that these `AZURE_REDIS_` settings were created for you by the create wizard.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-4.png" alt-text="A screenshot showing Visual Studio Code in the browser and an opened file with modified Redis variables." lightbox="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-4.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 5:**
        1. Select the **Source Control** extension.
        1. In the textbox, type a commit message like `Configure DB & Redis variables`.
        1. Select **Commit and Push**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-5.png" alt-text="A screenshot showing the changes being committed and pushed to GitHub." lightbox="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-5.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 6:** Back in the App Service page, in the left menu, select **Deployment Center**. 
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-6.png" alt-text="A screenshot showing how to open the deployment center in App Service." lightbox="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-6.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 7:** In the Deployment Center page:
        1. In **Source**, select **GitHub**. By default, **GitHub Actions** is selected as the build provider.        
        1. Sign in to your GitHub account and follow the prompt to authorize Azure.
        1. In **Organization**, select your account.
        1. In **Repository**, select **laravel-task**.
        1. In **Branch**, select **main**.
        1. In the top menu, select **Save**. App Service commits a workflow file into the chosen GitHub repository, in the `.github/workflows` directory.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-7.png" alt-text="A screenshot showing how to configure CI/CD using GitHub Actions." lightbox="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-7.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 8:** In the Deployment Center page:
        1. Select **Logs**. A deployment run is already started.
        1. In the log item for the deployment run, select **Build/Deploy Logs**. 
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-8.png" alt-text="A screenshot showing how to open deployment logs in the deployment center." lightbox="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-8.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 9:** You're taken to your GitHub repository and see that the GitHub action is running. The workflow file defines two separate stages, build and deploy. Wait for the GitHub run to show a status of **Complete**. It takes about 15 minutes.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-9.png" alt-text="A screenshot showing a GitHub run in progress." lightbox="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-9.png":::
    :::column-end:::
:::row-end:::

## 4 - Generate database schema

The creation wizard puts the MySQL database server behind a private endpoint, so it's accessible only from the virtual network. Because the App Service app is already integrated with the virtual network, the easiest way to run database migrations with your database is directly from within the App Service container.

:::row:::
    :::column span="2":::
        **Step 1:** Back in the App Service page, in the left menu, select **SSH**. 
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-generate-db-schema-1.png" alt-text="A screenshot showing how to open the SSH shell for your app from the Azure portal." lightbox="./media/tutorial-php-mysql-app/azure-portal-generate-db-schema-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the SSH terminal:
        1. Run `cd /home/site/wwwroot`. Here are all your deployed files.
        1. Run `php artisan migrate --force`. If it succeeds, App Service is connecting successfully to the MySQL database.
        Only changes to files in `/home` can persist beyond app restarts. Changes outside of `/home` aren't persisted.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-generate-db-schema-2.png" alt-text="A screenshot showing the commands to run in the SSH shell and their output." lightbox="./media/tutorial-php-mysql-app/azure-portal-generate-db-schema-2.png":::
    :::column-end:::
:::row-end:::

## 5 - Change site root

[Laravel application lifecycle](https://laravel.com/docs/10.x/lifecycle#lifecycle-overview) begins in the **/public** directory instead. The default PHP container for App Service uses Nginx, which starts in the application's root directory. To change the site root, you need to change the Nginx configuration file in the PHP container (*/etc/nginx/sites-available/default*). For your convenience, the sample repository contains a custom configuration file called *default*. As noted previously, you don't want to replace this file using the SSH shell, because the change is outside of `/home` and will be lost after an app restart. 

:::row:::
    :::column span="2":::
        **Step 1:**
        1. From the left menu, select **Configuration**.
        1. Select the **General settings** tab.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-change-site-root-1.png" alt-text="A screenshot showing how to open the general settings tab in the configuration page of App Service." lightbox="./media/tutorial-php-mysql-app/azure-portal-change-site-root-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the General settings tab:
        1. In the **Startup Command** box, enter the following command: *cp /home/site/wwwroot/default /etc/nginx/sites-available/default && service nginx reload*.
        1. Select **Save**.
        The command replaces the Nginx configuration file in the PHP container and restarts Nginx. This configuration ensures that the same change is made to the container each time it starts.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-change-site-root-2.png" alt-text="A screenshot showing how to configure a startup command in App Service." lightbox="./media/tutorial-php-mysql-app/azure-portal-change-site-root-2.png":::
    :::column-end:::
:::row-end:::

## 6 - Browse to the app

:::row:::
    :::column span="2":::
        **Step 1:** In the App Service page:
        1. From the left menu, select **Overview**.
        1. Select the URL of your app. You can also navigate directly to `https://<app-name>.azurewebsites.net`.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-browse-app-1.png" alt-text="A screenshot showing how to launch an App Service from the Azure portal." lightbox="./media/tutorial-php-mysql-app/azure-portal-browse-app-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** Add a few tasks to the list.
        Congratulations, you're running a secure data-driven PHP app in Azure App Service.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-browse-app-2.png" alt-text="A screenshot of the Laravel app running in App Service." lightbox="./media/tutorial-php-mysql-app/azure-portal-browse-app-2.png":::
    :::column-end:::
:::row-end:::

> [!TIP]
> The sample application implements the [cache-aside](/azure/architecture/patterns/cache-aside) pattern. When you reload the page after making data changes, **Response time** in the webpage shows a much faster time because it's loading the data from the cache instead of the database.

## 7 - Stream diagnostic logs

Azure App Service captures all messages logged to the console to assist you in diagnosing issues with your application. The sample app outputs console log messages in each of its endpoints to demonstrate this capability. By default, Laravel's logging functionality (for example, `Log::info()`) outputs to a local file. Your `LOG_CHANNEL` app setting from earlier makes log entries accessible from the App Service log stream.

:::row:::
    :::column span="2":::
        **Step 1:** In the App Service page:
        1. From the left menu, select **App Service logs**.
        1. Under **Application logging**, select **File System**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-stream-diagnostic-logs-1.png" alt-text="A screenshot showing how to enable native logs in App Service in the Azure portal." lightbox="./media/tutorial-php-mysql-app/azure-portal-stream-diagnostic-logs-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** From the left menu, select **Log stream**. You see the logs for your app, including platform logs and logs from inside the container.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-stream-diagnostic-logs-2.png" alt-text="A screenshot showing how to view the log stream in the Azure portal." lightbox="./media/tutorial-php-mysql-app/azure-portal-stream-diagnostic-logs-2.png":::
    :::column-end:::
:::row-end:::

## Clean up resources

When you're finished, you can delete all of the resources from your Azure subscription by deleting the resource group.

:::row:::
    :::column span="2":::
        **Step 1:** In the search bar at the top of the Azure portal:
        1. Enter the resource group name.
        1. Select the resource group.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-clean-up-resources-1.png" alt-text="A screenshot showing how to search for and navigate to a resource group in the Azure portal." lightbox="./media/tutorial-php-mysql-app/azure-portal-clean-up-resources-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the resource group page, select **Delete resource group**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-clean-up-resources-2.png" alt-text="A screenshot showing the location of the Delete Resource Group button in the Azure portal." lightbox="./media/tutorial-php-mysql-app/azure-portal-clean-up-resources-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** 
        1. Enter the resource group name to confirm your deletion.
        1. Select **Delete**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-clean-up-resources-3.png" alt-text="A screenshot of the confirmation dialog for deleting a resource group in the Azure portal." lightbox="./media/tutorial-php-mysql-app/azure-portal-clean-up-resources-3.png"::::
    :::column-end:::
:::row-end:::

## Frequently asked questions

- [How much does this setup cost?](#how-much-does-this-setup-cost)
- [How do I connect to the MySQL database that's secured behind the virtual network with other tools?](#how-do-i-connect-to-the-mysql-database-thats-secured-behind-the-virtual-network-with-other-tools)
- [How does local app development work with GitHub Actions?](#how-does-local-app-development-work-with-github-actions)
- [Why is the GitHub Actions deployment so slow?](#why-is-the-github-actions-deployment-so-slow)

#### How much does this setup cost?

Pricing for the create resources is as follows:

- The App Service plan is created in **Basic** tier and can be scaled up or down. See [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/).
- The MySQL flexible server is created in **B1ms** tier and can be scaled up or down. With an Azure free account, **B1ms** tier is free for 12 months, up to the monthly limits. See [Azure Database for MySQL pricing](https://azure.microsoft.com/pricing/details/mysql/flexible-server/).
- The Azure Cache for Redis is created in **Basic** tier with the minimum cache size. There's a small cost associated with this tier. You can scale it up to higher performance tiers for higher availability, clustering, and other features. See [Azure Cache for Redis pricing](https://azure.microsoft.com/pricing/details/cache/).
- The virtual network doesn't incur a charge unless you configure extra functionality, such as peering. See [Azure Virtual Network pricing](https://azure.microsoft.com/pricing/details/virtual-network/).
- The private DNS zone incurs a small charge. See [Azure DNS pricing](https://azure.microsoft.com/pricing/details/dns/). 

#### How do I connect to the MySQL database that's secured behind the virtual network with other tools?

- For basic access from a command-line tool, you can run `mysql` from the app's SSH terminal.
- To connect from a desktop tool like MySQL Workbench, your machine must be within the virtual network. For example, it could be an Azure VM that's connected to one of the subnets, or a machine in an on-premises network that has a [site-to-site VPN](../vpn-gateway/vpn-gateway-about-vpngateways.md) connection with the Azure virtual network.
- You can also [integrate Azure Cloud Shell](../cloud-shell/private-vnet.md) with the virtual network.

#### How does local app development work with GitHub Actions?

Take the autogenerated workflow file from App Service as an example, each `git push` kicks off a new build and deployment run. From a local clone of the GitHub repository, you make the desired updates push it to GitHub. For example:

```terminal
git add .
git commit -m "<some-message>"
git push origin main
```

#### Why is the GitHub Actions deployment so slow?

The autogenerated workflow file from App Service defines build-then-deploy, two-job run. Because each job runs in its own clean environment, the workflow file ensures that the `deploy` job has access to the files from the `build` job:

- At the end of the `build` job, [upload files as artifacts](https://docs.github.com/actions/using-workflows/storing-workflow-data-as-artifacts).
- At the beginning of the `deploy` job, download the artifacts.

Most of the time taken by the two-job process is spent uploading and download artifacts. If you want, you can simplify the workflow file by combining the two jobs into one, which eliminates the need for the upload and download steps.

<a name="next"></a>

## Next steps

Advance to the next tutorial to learn how to secure your app with a custom domain and certificate.

> [!div class="nextstepaction"]
> [Secure with custom domain and certificate](tutorial-secure-domain-certificate.md)

Or, check out other resources:

> [!div class="nextstepaction"]
> [Configure PHP app](configure-language-php.md)
