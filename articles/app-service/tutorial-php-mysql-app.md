---
title: 'Tutorial: PHP app with MySQL and Redis'
description: Learn how to get a PHP app working in Azure, with connection to a MySQL database and a Redis cache in Azure. Laravel is used in the tutorial.
author: msangapu-msft
ms.author: msangapu
ms.assetid: 14feb4f3-5095-496e-9a40-690e1414bd73
ms.devlang: php
ms.topic: tutorial
ms.date: 02/21/2025
ms.custom: mvc, cli-validate, devdivchpfy22, AppServiceConnectivity
---

# Tutorial: Deploy a PHP, MySQL, and Redis app to Azure App Service

This tutorial shows how to create a secure PHP app in Azure App Service connects to a MySQL database (using Azure Database for MySQL Flexible Server). You'll also deploy an Azure Cache for Redis to enable the caching code in your application. Azure App Service is a highly scalable, self-patching, web-hosting service that can easily deploy apps on Windows or Linux. When you're finished, you'll have a Laravel app running on Azure App Service on Linux.

:::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-browse-app-2.png" alt-text="Screenshot of the Azure app example titled Task List showing new tasks added.":::

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure account, you [can create one for free](https://azure.microsoft.com/free).
* A GitHub account. you can also [get one for free](https://github.com/join).
* Knowledge of [PHP with Laravel development](https://laravel.com/).
* **(Optional)** To try GitHub Copilot, a [GitHub Copilot account](https://docs.github.com/copilot/using-github-copilot/using-github-copilot-code-suggestions-in-your-editor). A 30-day free trial is available.

## 1. Run the sample

First, you set up a sample data-driven app as a starting point. For your convenience, the [sample repository](https://github.com/Azure-Samples/laravel-tasks), includes a [dev container](https://docs.github.com/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers) configuration. The dev container has everything you need to develop an application, including the database, cache, and all environment variables needed by the sample application. The dev container can run in a [GitHub codespace](https://docs.github.com/en/codespaces/overview), which means you can run the sample on any computer with a web browser.

:::row:::
    :::column span="2":::
        **Step 1:** In a new browser window:
        1. Sign in to your GitHub account.
        1. Navigate to [https://github.com/Azure-Samples/laravel-tasks/fork](https://github.com/Azure-Samples/laravel-tasks/fork).
        1. Select **Create fork**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-run-sample-application-1.png" alt-text="A screenshot showing how to create a fork of the sample GitHub repository." lightbox="./media/tutorial-php-mysql-app/azure-portal-run-sample-application-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the GitHub fork:
        1. Select **Code** > **Create codespace on main**.
        The codespace takes a few minutes to set up. Also, the provided *.env* file already contains a dummy [`APP_KEY` variable that Laravel needs to run locally](https://laravel.com/docs/11.x/encryption#configuration). 
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-run-sample-application-2.png" alt-text="A screenshot showing how to create a codespace in GitHub." lightbox="./media/tutorial-php-mysql-app/azure-portal-run-sample-application-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** In the codespace terminal:
        1. Run `composer install`.
        1. Run database migrations with `php artisan migrate`.
        1. Run the app with `php artisan serve`.
        1. When you see the notification `Your application running on port 80 is available.`, select **Open in Browser**.
        You should see the sample application in a new browser tab.
        To stop the application, type `Ctrl`+`C`.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-run-sample-application-3.png" alt-text="A screenshot showing how to run the sample application inside the GitHub codespace." lightbox="./media/tutorial-php-mysql-app/azure-portal-run-sample-application-3.png":::
    :::column-end:::
:::row-end:::

<!-- > [!TIP]
> You can ask [GitHub Copilot](https://docs.github.com/copilot/using-github-copilot/using-github-copilot-code-suggestions-in-your-editor) about this repository. For example:
>
> * *@workspace What does this project do?*
> * *@workspace What does the .devcontainer folder do?* -->

Having issues? Check the [Troubleshooting section](#troubleshooting).

<!-- ::: zone pivot="azure-portal"  

## 2. Create App Service, database, and cache

In this step, you create the Azure resources. The steps used in this tutorial create a set of secure-by-default resources that include App Service, Azure Database for MySQL, and Azure Cache for Redis. For the creation process, you specify:

* The **Name** for the web app. It's used as part of the DNS name for your app in the form of `https://<app-name>-<hash>.<region>.azurewebsites.net`.
* The **Region** to run the app physically in the world. It's also used as part of the DNS name for your app.
* The **Runtime stack** for the app. It's where you select the version of PHP to use for your app.
* The **Hosting plan** for the app. It's the pricing tier that includes the set of features and scaling capacity for your app.
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
        1. *Resource Group*: Select **Create new** and use a name of **msdocs-laravel-mysql-tutorial**.
        1. *Region*: Any Azure region near you.
        1. *Name*: **msdocs-laravel-mysql-XYZ** where *XYZ* is any three random characters. This name must be unique across Azure.
        1. *Runtime stack*: **PHP 8.3**.
        1. *Add Azure Cache for Redis?*: **Yes**.
        1. *Hosting plan*: **Basic**. When you're ready, you can [scale up](manage-scale-up.md) to a production pricing tier later.
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
        - **Resource group**: The container for all the created resources.
        - **App Service plan**: Defines the compute resources for App Service. A Linux plan in the *Basic* tier is created.
        - **App Service**: Represents your app and runs in the App Service plan.
        - **Virtual network**: Integrated with the App Service app and isolates back-end network traffic.
        - **Private endpoints**: Access endpoints for the database server and the Redis cache in the virtual network.
        - **Network interfaces**: Represents private IP addresses, one for each of the private endpoints.
        - **Azure Database for MySQL Flexible Server**: Accessible only from behind its private endpoint. A database and a user are created for you on the server.
        - **Azure Cache for Redis**: Accessible only from behind its private endpoint.
        - **Private DNS zones**: Enable DNS resolution of the database server and the Redis cache in the virtual network.
    :::column-end:::    
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-create-app-mysql-3.png" alt-text="A screenshot showing the deployment process completed." lightbox="./media/tutorial-php-mysql-app/azure-portal-create-app-mysql-3.png":::
    :::column-end:::
:::row-end:::

## 3. Secure connection secrets

The creation wizard generated the connectivity variables for you already as [app settings](configure-common.md#configure-app-settings). However, the security best practice is to keep secrets out of App Service completely. You'll move your secrets to a key vault and change your app setting to [Key Vault references](app-service-key-vault-references.md) with the help of Service Connectors.

:::row:::
    :::column span="2":::
        **Step 1: Retrieve the existing connection string** 
        1. In the left menu of the App Service page, select **Settings > Environment variables**. 
        1. Select **AZURE_MYSQL_PASSWORD**. 
        1. In **Add/Edit application setting**, in the **Value** field, copy the password string for use later.
        This app settings let you connect to the MySQL database secured behind private endpoints. However, the secrets are saved directly in the App Service app, which isn't the best. You'll change this. In addition, you will add a `APP_KEY` setting, which is required by your Laravel app.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-secure-connection-secrets-1.png" alt-text="A screenshot showing how to see the value of an app setting." lightbox="./media/tutorial-php-mysql-app/azure-portal-secure-connection-secrets-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:  Create a key vault for secure management of secrets**
        1. In the top search bar, type "*key vault*", then select **Marketplace** > **Key Vault**.
        1. In **Resource Group**, select **msdocs-laravel-mysql-tutorial**.
        1. In **Key vault name**, type a name that consists of only letters and numbers.
        1. In **Region**, set it to the same location as the resource group.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-secure-connection-secrets-2.png" alt-text="A screenshot showing how to create a key vault." lightbox="./media/tutorial-php-mysql-app/azure-portal-secure-connection-secrets-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3: Secure the key vault with a Private Endpoint**
        1. Select the **Networking** tab.
        1. Unselect **Enable public access**.
        1. Select **Create a private endpoint**.
        1. In **Resource Group**, select **msdocs-laravel-mysql-tutorial**.
        1. In the dialog, in **Location**, select the same location as your App Service app.
        1. In **Name**, type **msdocs-laravel-mysql-XYZVaultEndpoint**.
        1. In **Virtual network**, select **msdocs-laravel-mysql-XYZVnet**.
        1. In **Subnet**, **msdocs-laravel-mysql-XYZSubnet**.
        1. Select **OK**.
        1. Select **Review + create**, then select **Create**. Wait for the key vault deployment to finish. You should see "Your deployment is complete."
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-secure-connection-secrets-3.png" alt-text="A screenshot showing how to secure a key vault with a private endpoint." lightbox="./media/tutorial-php-mysql-app/azure-portal-secure-connection-secrets-3.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4: Configure the MySQL connector**
        1. In the top search bar, type *msdocs-laravel-mysql*, then select the App Service resource called **msdocs-laravel-mysql-XYZ**.
        1. In the App Service page, in the left menu, select **Settings > Service Connector**. There are already two connectors, which the app creation wizard created for you.
        1. Select checkbox next to the MySQL connector, then select **Edit**.
        1. Select the **Authentication** tab.
        1. In **Password**, paste the password you copied earlier.
        1. Select **Store Secret in Key Vault**.
        1. Under **Key Vault Connection**, select **Create new**. 
        A **Create connection** dialog is opened on top of the edit dialog.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-secure-connection-secrets-4.png" alt-text="A screenshot showing how to edit a service connector with a key vault connection." lightbox="./media/tutorial-php-mysql-app/azure-portal-secure-connection-secrets-4.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 5: Establish the Key Vault connection**        
        1. In the **Create connection** dialog for the Key Vault connection, in **Key Vault**, select the key vault you created earlier.
        1. Ignore the message `No client type is available. Please select another target service or change application runtime` and select **Review + Create**.
        1. When validation completes, select **Create**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-secure-connection-secrets-5.png" alt-text="A screenshot showing how to configure a key vault service connector." lightbox="./media/tutorial-php-mysql-app/azure-portal-secure-connection-secrets-5.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 6: Finalize the PostgreSQL connector settings** 
        1. You're back in the edit dialog for **defaultConnector**. In the **Authentication** tab, wait for the key vault connector to be created. When it's finished, the **Key Vault Connection** dropdown automatically selects it.
        1. Select **Next: Networking**.
        1. Select **Save**. Wait until the **Update succeeded** notification appears.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-secure-connection-secrets-6.png" alt-text="A screenshot showing the key vault connection selected in the defaultConnector." lightbox="./media/tutorial-php-mysql-app/azure-portal-secure-connection-secrets-6.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 7: Configure the Redis connector to use Key Vault secrets** 
        1. In the Service Connectors page, select the checkbox next to the Cache for Redis connector, then select **Edit**.
        1. Select the **Authentication** tab.
        1. Select **Store Secret in Key Vault**.
        1. Under **Key Vault Connection**, select the key vault you created. 
        1. Select **Next: Networking**.
        1. Select **Configure firewall rules to enable access to target service**. The app creation wizard already secured the SQL database with a private endpoint.
        1. Select **Save**. Wait until the **Update succeeded** notification appears.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-dotnetcore-sqldb-app/azure-portal-secure-connection-secrets-7.png" alt-text="A screenshot showing how to edit the Cache for Redis service connector with a key vault connection." lightbox="./media/tutorial-dotnetcore-sqldb-app/azure-portal-secure-connection-secrets-7.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 8: Verify the Key Vault integration**
        1. From the left menu, select **Settings > Environment variables** again.
        1. Next to **AZURE_POSTGRESQL_PASSWORD**, select **Show value**. The value should be `@Microsoft.KeyVault(...)`, which means that it's a [key vault reference](app-service-key-vault-references.md) because the secret is now managed in the key vault.
        1. To verify the Redis connection string, select **Show value** next to **AZURE_REDIS_CONNECTIONSTRING**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-secure-connection-secrets-8.png" alt-text="A screenshot showing how to see the value of PostgreSQL password in Azure." lightbox="./media/tutorial-php-mysql-app/azure-portal-secure-connection-secrets-8.png":::
    :::column-end:::
:::row-end:::

To summarize, the process for securing your connection secrets involved:

- Retrieving the connection secrets from the App Service app's environment variables.
- Creating a key vault.
- Creating a Key Vault connection with the system-assigned managed identity.
- Updating the service connectors to store the secrets in the key vault.

Having issues? Check the [Troubleshooting section](#troubleshooting).

-----

## 4 - Configure Laravel variables

:::row:::
    :::column span="2":::
        **Step 1:** Create `CACHE_DRIVER` as an app setting.
        1. In the **App settings** tab, select **Add**.
        1. In the **Name** field, enter *CACHE_DRIVER*.
        1. In the **Value** field, enter *redis*.
        1. Click **Apply**, then **Apply** again, then **Confirm**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-secure-connection-secrets-9.png" alt-text="A screenshot showing the Add/Edit application setting dialog." lightbox="./media/tutorial-php-mysql-app/azure-portal-secure-connection-secrets-9.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** Using the same steps in **Step 1**, create the following app settings:
        - **MYSQL_ATTR_SSL_CA**: Use */home/site/wwwroot/ssl/DigiCertGlobalRootCA.crt.pem* as the value. This app setting points to the path of the [TLS/SSL certificate you need to access the MySQL server](/azure/mysql/flexible-server/how-to-connect-tls-ssl#download-the-public-ssl-certificate). It's included in the sample repository for convenience.
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
>
> Ideally, the `APP_KEY` app setting should be configured as a key vault reference too, which is a multi-step process. For more information, see [How do I change the APP_KEY app setting to a Key Vault reference?](#how-do-i-change-the-app-key-app-setting-to-a-key-vault-reference) 


## 5 - Deploy sample code

In this step, you configure GitHub deployment using GitHub Actions. It's just one of many ways to deploy to App Service, but also a great way to have continuous integration in your deployment process. By default, every `git push` to your GitHub repository kicks off the build and deploy action.

:::row:::
    :::column span="2":::
        **Step 1:** In the left menu, select **Deployment** > **Deployment Center**. 
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-1.png" alt-text="A screenshot showing how to open the deployment center in App Service." lightbox="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the Deployment Center page:
        1. In **Source**, select **GitHub**. By default, **GitHub Actions** is selected as the build provider.        
        1. Sign in to your GitHub account and follow the prompt to authorize Azure.
        1. In **Organization**, select your account.
        1. In **Repository**, select **msdocs-postgresql-sample-app**.
        1. In **Branch**, select **starter-no-infra**. This is the same branch that you worked in with your sample app, without any Azure-related files or configuration.
        1. For **Authentication type**, select **User-assigned identity**.
        1. In the top menu, select **Save**. 
        App Service commits a workflow file into the chosen GitHub repository, in the `.github/workflows` directory.
        By default, the deployment center [creates a user-assigned identity](#i-dont-have-permissions-to-create-a-user-assigned-identity) for the workflow to authenticate using Microsoft Entra (OIDC authentication). For alternative authentication options, see [Deploy to App Service using GitHub Actions](deploy-github-actions.md).
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-2.png" alt-text="A screenshot showing how to configure CI/CD using GitHub Actions (Django)." lightbox="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** Back in the GitHub codespace of your sample fork, run `git pull origin starter-no-infra`. 
        This pulls the newly committed workflow file into your codespace.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-3.png" alt-text="A screenshot showing git pull inside a GitHub codespace." lightbox="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-3.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4 (Option 1: with GitHub Copilot):**  
        1. Start a new chat session by selecting the **Chat** view, then selecting **+**.
        1. Ask, "*@workspace How does the app connect to the database and redis?*" Copilot might give you some explanation about how the settings are configured in *config/database.php*. 
        1. Ask, "*@workspace In production mode, my app is running in an App Service web app, which uses Azure Service Connector to connect to a PostgreSQL flexible server using the Django client type. What are the environment variable names I need to use?*" Copilot might give you a code suggestion similar to the one in the **Option 2: without GitHub Copilot** steps below and even tell you to make the change in the *azureproject/production.py* file. 
        1. Open *config/database.php* in the explorer and add the code suggestion.
        1. Ask, "@workspace My App Service app also uses Azure Service Connector to connect to a Cache for Redis using the Django client type. What are the environment variable names I need to use?*" Copilot might give you a code suggestion similar to the one in the **Option 2: without GitHub Copilot** steps below and even tell you to make the change in the *config/database.php* file. 
        1. Add the code suggestion.
        GitHub Copilot doesn't give you the same response every time, and it's not always correct. You might need to ask more questions to fine-tune its response. For tips, see [What can I do with GitHub Copilot in my codespace?](#what-can-i-do-with-github-copilot-in-my-codespace).
    :::column-end:::
    :::column:::
        :::image type="content" source="media/tutorial-php-mysql-app/github-copilot-1.png" alt-text="A screenshot showing how to ask a question in a new GitHub Copilot chat session." lightbox="media/tutorial-php-mysql-app/github-copilot-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4 (Option 2: without GitHub Copilot):**  
        1. In Visual Studio Code in the browser, open *config/database.php* in the explorer. Find the `mysql` section and make the following changes:
            1. Replace `DB_HOST` with `AZURE_MYSQL_HOST`.
            1. Replace `DB_DATABASE` with `AZURE_MYSQL_DBNAME`.
            1. Replace `DB_USERNAME` with `AZURE_MYSQL_USERNAME`.
            1. Replace `DB_PASSWORD` with `AZURE_MYSQL_PASSWORD`.
            1. Replace `DB_PORT` with `AZURE_MYSQL_PORT`.
        1. scroll to the Redis `cache` section and make the following changes:
            1. Replace `REDIS_HOST` with `AZURE_REDIS_HOST`.
            1. Replace `REDIS_PASSWORD` with `AZURE_REDIS_PASSWORD`.
            1. Replace `REDIS_PORT` with `AZURE_REDIS_PORT`.
            1. Replace `REDIS_CACHE_DB` with `AZURE_REDIS_DATABASE`.
            1. In the same section, add a line with `'scheme' => 'tls',`. This configuration tells Laravel to use encryption to connect to Redis.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-4.png" alt-text="A screenshot showing a GitHub codespace and config/database.php opened." lightbox="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-4.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 5:**
        1. Select the **Source Control** extension.
        1. In the textbox, type a commit message like `Configure Azure database and cache connectons`. Or, select :::image type="icon" source="media/quickstart-dotnetcore/github-copilot-in-editor.png" border="false"::: and let GitHub Copilot generate a commit message for you.
        1. Select **Commit**, then confirm with **Yes**.
        1. Select **Sync changes 1**, then confirm with **OK**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-5.png" alt-text="A screenshot showing the changes being committed and pushed to GitHub." lightbox="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-5.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 6:**
        Back in the Deployment Center page in the Azure portal:
        1. Select the **Logs** tab, then select **Refresh** to see the new deployment run.
        1. In the log item for the deployment run, select the **Build/Deploy Logs** entry with the latest timestamp.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-6.png" alt-text="A screenshot showing how to open deployment logs in the deployment center." lightbox="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-6.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 7:** You're taken to your GitHub repository and see that the GitHub action is running. The workflow file defines two separate stages, build and deploy. Wait for the GitHub run to show a status of **Success**. It takes about 5 minutes.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-7.png" alt-text="A screenshot showing a GitHub run in progress." lightbox="./media/tutorial-php-mysql-app/azure-portal-deploy-sample-code-7.png":::
    :::column-end:::
:::row-end:::

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 6 - Generate database schema

The creation wizard puts the MySQL database server behind a private endpoint, so it's accessible only from the virtual network. Because the App Service app is already integrated with the virtual network, the easiest way to run database migrations with your database is directly from within the App Service container.

:::row:::
    :::column span="2":::
        **Step 1:** Back in the App Service page, in the left menu,
        1. Select **Development Tools** > **SSH**.
        1. Select **Go**.
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
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-generate-db-schema-2.png" alt-text="A screenshot showing the commands to run in the SSH shell and their output." lightbox="./media/tutorial-php-mysql-app/azure-portal-generate-db-schema-2.png":::
    :::column-end:::
:::row-end:::

> [!TIP]
> In the SSH session, only changes to files in `/home` can persist beyond app restarts. Changes outside of `/home` aren't persisted.

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
        :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-clean-up-resources-3.png" alt-text="A screenshot of the confirmation dialog for deleting a resource group in the Azure portal." lightbox="./media/tutorial-php-mysql-app/azure-portal-clean-up-resources-3.png":::
    :::column-end:::
:::row-end:::

::: zone-end

::: zone pivot="azure-developer-cli" -->

## 2. Create Azure resources and deploy a sample app

In this step, you create the Azure resources and deploy a sample app to App Service on Linux. The steps used in this tutorial create a set of secure-by-default resources that include App Service and Azure Database for MySQL.

The GitHub codespace already has the [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd) (AZD).

1. Generate a Laravel encryption key with `php artisan key:generate --show`:

    ```bash
    php artisan key:generate --show
    ```  

1. Sign into Azure by running the `azd auth login` command and following the prompt:

    ```bash
    azd auth login
    ```  

1. Create the necessary Azure resources and deploy the app code with the `azd up` command. Follow the prompt to select the desired subscription and location for the Azure resources.

    ```bash
    azd up
    ```  

1. When prompted, give the following answers:
    
    |Question  |Answer  |
    |---------|---------|
    |Enter a new environment name     | Type a unique name. The AZD template uses this name as part of the DNS name of your web app in Azure (`<app-name>-<hash>.azurewebsites.net`). Alphanumeric characters and hyphens are allowed.          |
    |Select an Azure Subscription to use| Select your subscription. |
    |Select an Azure location to use| Select a location. |
    |Enter a value for the 'appKey' infrastructure secured parameter| Use the output of `php artisan key:generate --show` here. The AZD template creates a Key Vault secret for it that you can use in your app. |
    |Enter a value for the 'databasePassword' infrastructure secured parameter| Database password for MySQL. It must be at least 8 characters long and contain uppercase letters, lowercase letters, numbers, and special characters.|

    The `azd up` command takes about 15 minutes to complete (the Redis cache takes the most time). It also compiles and deploys your application code, but you modify your code later to work with App Service. While it's running, the command provides messages about the provisioning and deployment process, including a link to the deployment in Azure. When it finishes, the command also displays a link to the deploy application.

    This AZD template contains files (*azure.yaml* and the *infra* directory) that generate a secure-by-default architecture with the following Azure resources:

    - **Resource group**: The container for all the created resources.
    - **App Service plan**: Defines the compute resources for App Service. A Linux plan in the *B1* tier is created.
    - **App Service**: Represents your app and runs in the App Service plan.
    - **Virtual network**: Integrated with the App Service app and isolates back-end network traffic.
    - **Azure Database for MySQL Flexible Server**: Accessible only from the virtual network through the DNS zone integration. A database is created for you on the server.
    - **Azure Cache for Redis**: Accessible only from within the virtual network.
    - **Private endpoints**: Access endpoints for the key vault and the Redis cache in the virtual network.
    - **Private DNS zones**: Enable DNS resolution of the key vault, the database server, and the Redis cache in the virtual network.
    - **Log Analytics workspace**: Acts as the target container for your app to ship its logs, where you can also query the logs.
    - **Key vault**: Used to keep your database password the same when you redeploy with AZD.

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 3. Use Azure connection strings in application code

The AZD template you use generated the connectivity variables for you already as [app settings](configure-common.md#configure-app-settings) and outputs the them to the terminal for your convenience. App settings are one way to keep connection secrets out of your code repository.

1. In the AZD output, find the app settings that begin with `AZURE_MYSQL_` and `AZURE_REDIS_`. Only the setting names are displayed. They look like this in the AZD output:

    <pre>
    App Service app has the following app settings:
            - AZURE_KEYVAULT_RESOURCEENDPOINT
            - AZURE_KEYVAULT_SCOPE
            - AZURE_MYSQL_DBNAME
            - AZURE_MYSQL_FLAG
            - AZURE_MYSQL_HOST
            - AZURE_MYSQL_PASSWORD
            - AZURE_MYSQL_PORT
            - AZURE_MYSQL_USERNAME
            - AZURE_REDIS_DATABASE
            - AZURE_REDIS_HOST
            - AZURE_REDIS_PASSWORD
            - AZURE_REDIS_PORT
            - AZURE_REDIS_SSL
    </pre>

    Settings beginning with `AZURE_MYSQL_` are connection variables for the MySQL database, and settings beginning with `AZURE_REDIS_` are for the Redis cache. You need to use them in your code later. For your convenience, the AZD template shows you the direct link to the app's app settings page in the Azure portal.

1. From the explorer, open *config/database.php*. This is the configuration file for database and Redis cache connections.

1. Find the part that defines the `mysql` connection (lines 46-64) and replace `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD` with the `AZURE_MYSQL_` app settings from the AZD output. Your `mysql` connection should look like the following code.

    ```php
    'mysql' => [
        'driver' => 'mysql',
        'url' => env('DATABASE_URL'),
        'host' => env('AZURE_MYSQL_HOST', '127.0.0.1'),
        'port' => env('AZURE_MYSQL_PORT', '3306'),
        'database' => env('AZURE_MYSQL_DBNAME', 'forge'),
        'username' => env('AZURE_MYSQL_USERNAME', 'forge'),
        'password' => env('AZURE_MYSQL_PASSWORD', ''),
        'unix_socket' => env('DB_SOCKET', ''),
        'charset' => 'utf8mb4',
        'collation' => 'utf8mb4_unicode_ci',
        'prefix' => '',
        'prefix_indexes' => true,
        'strict' => true,
        'engine' => null,
        'options' => extension_loaded('pdo_mysql') ? array_filter([
            PDO::MYSQL_ATTR_SSL_CA => env('MYSQL_ATTR_SSL_CA'),
        ]) : [],
    ],
    ```

    For more information on database configuration in Laravel, see [Laravel documentation](https://laravel.com/docs/10.x/database).

1. Find the part that defines the Redis cache connection (lines 140-147) and replace `REDIS_HOST`, `REDIS_PASSWORD`, `REDIS_PORT`, and `REDIS_CACHE_DB` with the `Azure_REDIS_` app settings from the AZD output. Also, add `'scheme' => 'tls',` to the connection. Your cache connection should look like the following code:

    ```php
    'cache' => [
        'scheme' => 'tls',
        'url' => env('REDIS_URL'),
        'host' => env('AZURE_REDIS_HOST', '127.0.0.1'),
        'username' => env('REDIS_USERNAME'),
        'password' => env('AZURE_REDIS_PASSWORD'),
        'port' => env('AZURE_REDIS_PORT', '6379'),
        'database' => env('AZURE_REDIS_DATABASE', '1'),
    ],
    ```
    
    For more information on Redis cache configuration in Laravel, see [Laravel documentation](https://laravel.com/docs/10.x/redis#configuration).

    > [!NOTE]
    > Remember that your changes aren't deployed yet. You'll deploy them at the end of the next step.

## 4. Configure Laravel settings in web app

1. From the explorer, open *infra/resources.bicep*. This is the Bicep template file that defines the created Azure resources.

1. Find the part that defines the app settings (lines 510-514) and uncomment them. These app settings are:
    
    |Setting  |Description  |
    |---------|---------|
    |`CACHE_DRIVER`     | Tells Laravel to use Redis as its cache (see [Laravel documentation](https://laravel.com/docs/10.x/cache#configuration)).        |
    |`MYSQL_ATTR_SSL_CA`     | Needed to [open a TLS connection to MySQL in Azure](/azure/mysql/flexible-server/how-to-connect-tls-ssl). The certificate file is included in the sample repository for convenience. This variable is used by the mysql connection in *config/database.php*      |
    |`LOG_CHANNEL`     | Tells Laravel to pipe logs to `stderr`, which makes it available to the App Service logs (see [Laravel documentation](https://laravel.com/docs/10.x/logging)).       |
    |`APP_DEBUG`     | Enable debug mode pages in Laravel (see [Laravel documentation](https://laravel.com/docs/10.x/configuration#debug-mode)).      |
    |`APP_KEY`     | [Laravel encryption variable](https://laravel.com/docs/10.x/encryption#configuration). The AZD template already created a Key Vault secret (lines 212-217), so you access it with a [Key Vault reference](app-service-key-vault-references.md).       |

1. In *infra/resources.bicep*, find the resource definition for the App Service app and uncomment line 315: 

    ```bicep
    appCommandLine: 'cp /home/site/wwwroot/default /etc/nginx/sites-available/default && service nginx reload'
    ```

    [Laravel application lifecycle](https://laravel.com/docs/10.x/lifecycle#lifecycle-overview) begins in the */public* directory instead of the application root. The default PHP container for App Service uses Nginx, which starts in the application root. To change the site root, you need to change the Nginx configuration file in the PHP container (*/etc/nginx/sites-available/default*). For your convenience, the sample repository contains a replacement configuration file called *default*, which tells Nginx to look in the */public* directory. This custom command in `appCommandLine` runs every time the app starts to apply the file replacement each time the Linux container is reloaded from a clean state.

1. Back in the codespace terminal, run `azd up` again.
 
    ```bash
    azd up
    ```

> [!TIP]
> `azd up` runs `azd package`, `azd provision`, and `azd deploy` together, and it makes sense because you're making both infrastructure and application changes. To make infrastructure changes only, run `azd provision`. To just deploy changes to application code, run `azd deploy`.

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 5. Generate database schema

With the MySQL database protected by the virtual network, the easiest way to run Laravel database migrations is in an SSH session with the Linux container in App Service.

1. In the AZD output, find the URL for the SSH session and navigate to it in the browser. It looks like this in the output:

    <pre>
    Open SSH session to App Service container at: https://&lt;app-name>-&lt;hash>.scm.azurewebsites.net/webssh/host
    </pre>

1. In the SSH session, run database migrations from the */home/site/wwwroot* directory:

    ```bash
    cd /home/site/wwwroot
    php artisan migrate --force
    ```
    
    If it succeeds, App Service is [connecting successfully to the database](#i-get-the-error-during-database-migrations-php_network_getaddresses-getaddrinfo-for-mysqldb-failed-no-address-associated-with-hostname).

> [!NOTE]
> Only changes to files in `/home` can persist beyond app restarts.
>

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 6. Browse to the app

1. In the AZD output, find the URL of your app and navigate to it in the browser. The URL looks like this in the AZD output:

    <pre>
    Deploying services (azd deploy)
    
      (✓) Done: Deploying service web
      - Endpoint: https://&lt;app-name>-&lt;hash>.azurewebsites.net/
    </pre>

2. Add a few tasks to the list.

    :::image type="content" source="./media/tutorial-php-mysql-app/azure-portal-browse-app-2.png" alt-text="A screenshot of the Laravel web app with MySQL running in Azure showing tasks.":::

    Congratulations, you're running a web app in Azure App Service, with secure connectivity to Azure Database for MySQL.

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 7. Stream diagnostic logs

Azure App Service captures all messages logged to the console to assist you in diagnosing issues with your application. For convenience, the AZD template already [enabled logging to the local file system](troubleshoot-diagnostic-logs.md#enable-application-logging-linuxcontainer) and is [shipping the logs to a Log Analytics workspace](troubleshoot-diagnostic-logs.md#send-logs-to-azure-monitor).

The sample app outputs console log messages in each of its endpoints to demonstrate this capability. By default, Laravel's logging functionality (for example, `Log::info()`) outputs to a local file. Your `LOG_CHANNEL` app setting from earlier makes log entries accessible from the App Service log stream.

:::code language="php" source="~/laravel-tasks/routes/web.php" range="25-36" highlight="2":::

In the AZD output, find the link to stream App Service logs and navigate to it in the browser. The link looks like this in the AZD output:

<pre>
Stream App Service logs at: https://portal.azure.com/#@/resource/subscriptions/&lt;subscription-guid>/resourceGroups/&lt;group-name>/providers/Microsoft.Web/sites/&lt;app-name>/logStream
</pre>

Having issues? Check the [Troubleshooting section](#troubleshooting).

## 8. Clean up resources

To delete all Azure resources in the current deployment environment, run `azd down` and follow the prompts.

```bash
azd down
```

<!-- ::: zone-end -->

## Troubleshooting

#### I get the error during database migrations `php_network_getaddresses: getaddrinfo for mysqldb failed: No address associated with hostname...`

It indicates that MySQL connection variables aren't properly configured. Verify that the `AZURE_MYSQL_` app settings are properly configured in [3. Use Azure connection strings in application code](#3-use-azure-connection-strings-in-application-code).

#### I get a blank page in the browser.

It indicates that App Service can't find the PHP start files in */public*. Follow the steps in [4. Configure Laravel settings in web app](#4-configure-laravel-settings-in-web-app).

#### I get a debug page in the browser saying `Unsupported cipher or incorrect key length.`

It indicates that the `APP_KEY` setting is set to an invalid key. When you run `azd up`, make sure you set `appKey` to the output of `php artisan key:generate --show`.

#### I get a debug page in the browser saying `Uncaught Error: Class "Illuminate\..." not found.`

This error and similar errors indicate that you didn't run `composer install` before `azd up`, or that the packages in the */vendor* directory are stale. Run `composer install` and `azd deploy` again.

#### I get a debug page in the browser saying `php_network_getaddresses: getaddrinfo for redishost failed: Name or service not known.`

It indicates that Redis connection variables aren't properly configured. Verify that the `AZURE_REDIS_` app settings are properly configured in [3. Use Azure connection strings in application code](#3-use-azure-connection-strings-in-application-code).

#### I get a debug page in the browser saying `SQLSTATE[42S02]: Base table or view not found: 1146 Table 'XXXX-XXXXXXXXX-mysql-database.tasks' doesn't exist`

It means you haven't run database migrations, or database migrations weren't successful. Follow the steps at [5. Generate database schema](#5-generate-database-schema).

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
