---
title: 'Tutorial: Using Service Connector to build a Django app with Postgres on Azure App Service'
description: Create a Python web app with a PostgreSQL database and deploy it to Azure. The tutorial uses the Django framework, the app is hosted on Azure App Service on Linux, and the App Service and Database is connected with Service Connector.
ms.devlang: python
ms.custom: event-tier1-build-2022, devx-track-azurecli, devx-track-python
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: tutorial
ms.date: 11/22/2023
zone_pivot_groups: postgres-server-options
---
# Tutorial: Using Service Connector to build a Django app with Postgres on Azure App Service

> [!NOTE]
> You are using Service Connector that makes it easier to connect your web app to database service in this tutorial. The tutorial here is a modification of the [App Service tutorial](../app-service/tutorial-python-postgresql-app.md) to use this feature so you will see similarities. Look into section [Configure environment variables to connect the database](#configure-environment-variables-to-connect-the-database) in this tutorial to see where Service Connector comes into play and simplifies the connection process given in the App Service tutorial.

::: zone pivot="postgres-single-server"

This tutorial shows how to deploy a data-driven Python [Django](https://www.djangoproject.com/) web app to [Azure App Service](overview.md) and connect it to an Azure Database for a Postgres database. You can also try the PostgreSQL Flexible Server by selecting the option above. Flexible Server provides a simpler deployment mechanism and lower ongoing costs.

In this tutorial, you use the Azure CLI to complete the following tasks:

> [!div class="checklist"]
> * Set up your initial environment with Python and the Azure CLI
> * Create an Azure Database for PostgreSQL database
> * Deploy code to Azure App Service and connect to PostgreSQL
> * Update your code and redeploy
> * View diagnostic logs
> * Manage the web app in the Azure portal

:::zone-end

::: zone pivot="postgres-flexible-server"

This tutorial shows how to deploy a data-driven Python [Django](https://www.djangoproject.com/) web app to [Azure App Service](overview.md) and connect it to an [Azure Database for PostgreSQL Flexible server](../postgresql/flexible-server/index.yml) database. If you can't use PostgreSQL Flexible server, then select the Single Server option above.

In this tutorial, you'll use the Azure CLI to complete the following tasks:

> [!div class="checklist"]
> * Set up your initial environment with Python and the Azure CLI
> * Create an Azure Database for PostgreSQL Flexible server database
> * Deploy code to Azure App Service and connect to PostgreSQL Flexible server
> * Update your code and redeploy
> * View diagnostic logs
> * Manage the web app in the Azure portal

:::zone-end

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).

## Set up your initial environment

1. Install [Python 3.6 or higher](https://www.python.org/downloads/). To check if your Python version is 3.6 or higher, run the following code in a terminal window:

    ### [Bash](#tab/bash)

    ```bash
    python3 --version
    ```

    ### [PowerShell](#tab/powershell)

    ```cmd
    py -3 --version
    ```

    ### [Cmd](#tab/cmd)

    ```cmd
    py -3 --version
    ```

    ---

1. Install the [Azure CLI](/cli/azure/install-azure-cli) 2.30.0 or higher. To check if your Azure CLI version is 2.30.0 or higher, run the `az --version` command. If you need to upgrade, run `az upgrade` (requires version 2.30.0+).

1. Sign in to Azure using the CLI with `az login`. This command opens a browser to gather your credentials. When the command finishes, it shows JSON output containing information about your subscriptions. Once signed in, you can run Azure commands with the Azure CLI to work with resources in your subscription.

## Clone or download the sample app

### [Git clone](#tab/clone)

Clone the sample repository:

```terminal
git clone https://github.com/Azure-Samples/serviceconnector-webapp-postgresql-django.git
```

Navigate into the following folder:

```terminal
cd serviceconnector-webapp-postgresql-django
```

::: zone pivot="postgres-flexible-server"

Use the flexible-server branch of the sample, which contains a few necessary changes, such as how the database server URL is set and adding `'OPTIONS': {'sslmode': 'require'}` to the Django database configuration as required by Azure PostgreSQL Flexible server.

```terminal
git checkout flexible-server
```

::: zone-end

### [Download](#tab/download)

Visit [https://github.com/Azure-Samples/djangoapp](https://github.com/Azure-Samples/djangoapp).

::: zone pivot="postgres-flexible-server"

For Flexible server, select the branches control that says "master" and then select the **flexible-server** branch.

::: zone-end

Select **Code**, and then select **Download ZIP**.

Unpack the ZIP file into a folder named *djangoapp*.

Open a terminal window in that *djangoapp* folder.

---

The djangoapp sample contains the data-driven Django polls app you get by following [Writing your first Django app](https://docs.djangoproject.com/en/3.1/intro/tutorial01/) in the Django documentation. The completed app is provided here for your convenience.

The sample is also modified to run in a production environment like App Service:

* Production settings are in the *azuresite/production.py* file. Development settings are in *azuresite/settings.py*.
* The app uses production settings when the `WEBSITE_HOSTNAME` environment variable is set. Azure App Service automatically sets this variable to the URL of the web app, such as `msdocs-django.azurewebsites.net`.

The production settings are specific to configuring Django to run in any production environment and aren't particular to App Service. For more information, see the [Django deployment checklist](https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/). Also see [Production settings for Django on Azure](../app-service/configure-language-python.md#production-settings-for-django-apps) for details on some of the changes.

Having issues? [Let us know](https://aka.ms/DjangoCLITutorialHelp).

## Create Postgres database in Azure

::: zone pivot="postgres-single-server"

<!-- > [!NOTE]
> Before you create an Azure Database for PostgreSQL server, check which [compute generation](../postgresql/concepts-pricing-tiers.md#compute-generations-and-vcores) is available in your region. -->

1. Enable parameters caching with the Azure CLI so you don't need to provide those parameters with every command. (Cached values are saved in the *.azure* folder.)

    ```azurecli
    az config param-persist on 
    ```

1. Install the `db-up` extension for the Azure CLI:

    ```azurecli
    az extension add --name db-up
    ```

    If the `az` command isn't recognized, be sure you have the Azure CLI installed as described in [Set up your initial environment](#set-up-your-initial-environment).

1. Create the Postgres database in Azure with the [`az postgres up`](/cli/azure/postgres#az-postgres-up) command:

    ```azurecli
    az postgres up --resource-group ServiceConnector-tutorial-rg --location eastus --sku-name B_Gen5_1 --server-name <postgres-server-name> --database-name pollsdb --admin-user <admin-username> --admin-password <admin-password> --ssl-enforcement Enabled
    ```

    Replace the following placeholder texts with your own data:

    * **Replace** *`<postgres-server-name>`* with a name that's **unique across all Azure** (the server endpoint becomes `https://<postgres-server-name>.postgres.database.azure.com`). A good pattern is to use a combination of your company name and another unique value.

    * For *`<admin-username>`* and *`<admin-password>`*, specify credentials to create an administrator user for this Postgres server. The admin username can't be *azure_superuser*, *azure_pg_admin*, *admin*, *administrator*, *root*, *guest*, or *public*. It can't start with *pg_*. The password must contain **8 to 128 characters** from three of the following categories: English uppercase letters, English lowercase letters, numbers (0 through 9), and non-alphanumeric characters (for example, *!*, *#*, *%*). The password can't contain a username.
    * Don't use the `$` character in the username or password. You'll later create environment variables with these values where the `$` character has special meaning within the Linux container used to run Python apps.
    * The `*B_Gen5_1*` (Basic, Gen5, 1 core) [pricing tier](../postgresql/concepts-pricing-tiers.md) used here is the least expensive. For production databases, omit the `--sku-name` argument to use the GP_Gen5_2 (General Purpose, Gen 5, 2 cores) tier instead.

    This command performs the following actions, which may take a few minutes:

    * Create a [resource group](../azure-resource-manager/management/overview.md#terminology) called `ServiceConnector-tutorial-rg`, if it doesn't already exist.
    * Create a Postgres server named by the `--server-name` argument.
    * Create an administrator account using the `--admin-user` and `--admin-password` arguments. You can omit these arguments to allow the command to generate unique credentials for you.
    * Create a `pollsdb` database as named by the `--database-name` argument.
    * Enable access from your local IP address.
    * Enable access from Azure services.
    * Create a database user with access to the `pollsdb` database.

    You can do all the steps separately with other `az postgres` and `psql` commands, but `az postgres up` does all the steps together.

    When the command completes, it outputs a JSON object that contains different connection strings for the database along with the server URL, a generated user name (such as "joyfulKoala@msdocs-djangodb-12345"), and a GUID password.

    > [!IMPORTANT]
    > Copy the user name and password to a temporary text file as you will need them later in this tutorial.

    <!-- not all locations support az postgres up -->
    > [!TIP]
    > `-l <location-name>` can be set to any [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/). You can get the regions available to your subscription with the [`az account list-locations`](/cli/azure/account#az-account-list-locations) command. For production apps, put your database and your app in the same location.

::: zone-end

::: zone pivot="postgres-flexible-server"

1. Enable parameters caching with the Azure CLI so you don't need to provide those parameters with every command. (Cached values are saved in the *.azure* folder.)

    ```azurecli
    az config param-persist on 
    ```

1. Create a [resource group](../azure-resource-manager/management/overview.md#terminology) (you can change the name, if desired). The resource group name is cached and automatically applied to subsequent commands.

    ```azurecli
    az group create --name ServiceConnector-tutorial-rg --location eastus
    ```

1. Create the database server (the process takes a few minutes):

    ```azurecli
    az postgres flexible-server create --sku-name Standard_B1ms --public-access all
    ```

    If the `az` command isn't recognized, be sure you have the Azure CLI installed as described in [Set up your initial environment](#set-up-your-initial-environment).

    The [az postgres flexible-server create](/cli/azure/postgres/flexible-server#az-postgres-flexible-server-create) command performs the following actions, which take a few minutes:

    * Create a default resource group if there's not a cached name already.
    * Create a PostgreSQL Flexible server:
        * By default, the command uses a generated name like `server383813186`. You can specify your own name with the `--name` parameter. The name must be unique across all of Azure.
        * The command uses the lowest-cost `Standard_B1ms` pricing tier. Omit the `--sku-name` argument to use the default `Standard_D2s_v3` tier.
        * The command uses the resource group and location cached from the previous `az group create` command, which in this example is the resource group `ServiceConnector-tutorial-rg` in the `eastus` region.
    * Create an administrator account with a username and password. You can specify these values directly with the `--admin-user` and `--admin-password` parameters.
    * Create a database named `flexibleserverdb` by default. You can specify a database name with the `--database-name` parameter.
    * Enables complete public access, which you can control using the `--public-access` parameter.

1. When the command completes, **copy the command's JSON output to a file** as you need values from the output later in this tutorial, specifically the host, username, and password, along with the database name.

::: zone-end

Having issues? [Let us know](https://aka.ms/DjangoCLITutorialHelp).

## Deploy the code to Azure App Service

In this section, you create app host in App Service app, connect this app to the Postgres database, then deploy your code to that host.

### Create the App Service app

::: zone pivot="postgres-single-server"

1. In the terminal, make sure you're in the *djangoapp* repository folder that contains the app code.

1. Create an App Service app (the host process) with the [`az webapp up`](/cli/azure/webapp#az-webapp-up) command:

    ```azurecli
    az webapp up --resource-group ServiceConnector-tutorial-rg --location eastus --plan ServiceConnector-tutorial-plan --sku B1 --name <app-name>
    ```
    <!-- without --sku creates PremiumV2 plan -->

    * For the `--location` argument, make sure you use the location that [Service Connector supports](concept-region-support.md).
    * **Replace** *\<app-name>* with a unique name across all Azure (the server endpoint is `https://<app-name>.azurewebsites.net`). Allowed characters for *\<app-name>* are `A`-`Z`, `0`-`9`, and `-`. A good pattern is to use a combination of your company name and an app identifier.

    This command performs the following actions, which may take a few minutes:

    <!-- - Create the resource group if it doesn't exist. `--resource-group` is optional. -->
    <!-- No it doesn't. az webapp up doesn't respect --resource-group -->

    * Create the [resource group](../azure-resource-manager/management/overview.md#terminology) if it doesn't already exist. (In this command you use the same resource group in which you created the database earlier.)
    * Create the [App Service plan](../app-service/overview-hosting-plans.md) *DjangoPostgres-tutorial-plan* in the Basic pricing tier (B1), if it doesn't exist. `--plan` and `--sku` are optional.
    * Create the App Service app if it doesn't exist.
    * Enable default logging for the app, if not already enabled.
    * Upload the repository using ZIP deployment with build automation enabled.
    * Cache common parameters, such as the name of the resource group and App Service plan, into the file *.azure/config*. As a result, you don't need to specify all the same parameter with later commands. For example, to redeploy the app after making changes, you can just run `az webapp up` again without any parameters. Commands that come from CLI extensions, such as `az postgres up`, however, do not at present use the cache, which is why you needed to specify the resource group and location here with the initial use of `az webapp up`.

::: zone-end

::: zone pivot="postgres-flexible-server"

1. In the terminal, make sure you're in the *djangoapp* repository folder that contains the app code.

1. Switch to the sample app's `flexible-server` branch. This branch contains specific configuration needed for PostgreSQL Flexible server:

    ```cmd
    git checkout flexible-server
    ```

1. Run the following [`az webapp up`](/cli/azure/webapp#az-webapp-up) command to create the App Service host for the app:

    ```azurecli
    az webapp up --name <app-name> --sku B1 
    ```
    <!-- without --sku creates PremiumV2 plan -->

    This command performs the following actions, which may take a few minutes, using resource group and location cached from the previous `az group create` command (the group `Python-Django-PGFlex-rg` in the `eastus` region in this example).

    <!-- - Create the resource group if it doesn't exist. `--resource-group` is optional. -->
    <!-- No it doesn't. az webapp up doesn't respect --resource-group -->
    * Create an [App Service plan](../app-service/overview-hosting-plans.md) in the Basic pricing tier (B1). You can omit `--sku` to use default values.
    * Create the App Service app.
    * Enable default logging for the app.
    * Upload the repository using ZIP deployment with build automation enabled.

::: zone-end

Upon successful deployment, the command generates JSON output like the following example:

![Example az webapp up command output](../app-service/media/tutorial-python-postgresql-app/az-webapp-up-output.png)

Having issues? Refer first to the [Troubleshooting guide](../app-service/configure-language-python.md#troubleshooting), otherwise, [let us know](https://aka.ms/DjangoCLITutorialHelp).

### Configure environment variables to connect the database

With the code now deployed to App Service, the next step is to connect the app to the Postgres database in Azure.

The app code expects to find database information in four environment variables named `AZURE_POSTGRESQL_HOST`, `AZURE_POSTGRESQL_NAME`, `AZURE_POSTGRESQL_USER`, and `AZURE_POSTGRESQL_PASS`.

To set environment variables in App Service, create "app settings" with the following `az connection create` command.

::: zone pivot="postgres-single-server"

```azurecli
az webapp connection create postgres --client-type django
```

The resource group, app name, db name are drawn from the cached values. You need to provide admin password of your postgres database during the execution of this command.

* The command creates settings named "AZURE_POSTGRESQL_HOST", "AZURE_POSTGRESQL_NAME", "AZURE_POSTGRESQL_USER", "AZURE_POSTGRESQL_PASS" as expected by the app code.
* If you forgot your admin credentials, the command would guide you to reset it.

::: zone-end

::: zone pivot="postgres-flexible-server"

```azurecli
az webapp connection create postgres-flexible --client-type django
```

The resource group, app name, db name are drawn from the cached values. You need to provide admin password of your postgres database during the execution of this command.

* The command creates settings named "AZURE_POSTGRESQL_HOST", "AZURE_POSTGRESQL_NAME", "AZURE_POSTGRESQL_USER", "AZURE_POSTGRESQL_PASS" as expected by the app code.
* If you forgot your admin credentials, the command would guide you to reset it.

::: zone-end

> [!NOTE]
> If you see the error message "The subscription is not registered to use Microsoft.ServiceLinker", please run `az provider register -n Microsoft.ServiceLinker` to register the Service Connector resource provider and run the connection command again.

In your Python code, you access these settings as environment variables with statements like `os.environ.get('AZURE_POSTGRESQL_HOST')`. For more information, see [Access environment variables](../app-service/configure-language-python.md#access-environment-variables).

Having issues? Refer first to the [Troubleshooting guide](../app-service/configure-language-python.md#troubleshooting), otherwise, [let us know](https://aka.ms/DjangoCLITutorialHelp).

### Run Django database migrations

Django database migrations ensure that the schema in the PostgreSQL on Azure database matches with your code.

1. Run `az webapp ssh` to open an SSH session for the web app in the browser:

    ```azurecli
    az webapp ssh
    ```

1. In the SSH session, run the following commands:

    ```bash
    # Run database migrations
    python manage.py migrate

    # Create the super user (follow prompts)
    python manage.py createsuperuser
    ```

    If you encounter any errors related to connecting to the database, check the values of the application settings created in the previous section.

1. The `createsuperuser` command prompts you for superuser credentials. For the purposes of this tutorial, use the default username `root`, press **Enter** for the email address to leave it blank, and enter `Pollsdb1` for the password.

1. If you see an error that the database is locked, make sure that you ran the `az webapp settings` command in the previous section. Without those settings, the migrate command can't communicate with the database, resulting in the error.

Having issues? Refer first to the [Troubleshooting guide](../app-service/configure-language-python.md#troubleshooting), otherwise, [let us know](https://aka.ms/DjangoCLITutorialHelp).

### Create a poll question in the app

1. Open the app website. The app should display the message "Polls app" and "No polls are available" because there are no specific polls yet in the database.

    ```azurecli
    az webapp browse
    ```

    If you see "Application Error", then it's likely that you either didn't create the required settings in the previous step "[Configure environment variables to connect the database](#configure-environment-variables-to-connect-the-database)", or that these values contain errors. Run the command `az webapp config appsettings list` to check the settings.

    After updating the settings to correct any errors, give the app a minute to restart, then refresh the browser.

1. Browse to the web app's admin page by appending `/admin` to the URL, for example, `http://<app-name>.azurewebsites.net/admin`. Sign in using Django superuser credentials from the previous section (`root` and `Pollsdb1`). Under **Polls**, select **Add** next to **Questions** and create a poll question with some choices.

1. Return to the main website (`http://<app-name>.azurewebsites.net`) to confirm that the questions are now presented to the user. Answer questions however you like to generate some data in the database.

**Congratulations!** You're running a Python Django web app in Azure App Service for Linux, with an active Postgres database.

> [!NOTE]
> App Service detects a Django project by looking for a *wsgi.py* file in each subfolder, which `manage.py startproject` creates by default. When App Service finds that file, it loads the Django web app. For more information, see [Configure built-in Python image](../app-service/configure-language-python.md).

## Clean up resources

If you'd like to keep the app or continue to additional tutorials, skip ahead to [Next steps](#next-steps). Otherwise, to avoid incurring ongoing charges, delete the resource group created for this tutorial:

```azurecli
az group delete --name ServiceConnector-tutorial-rg --no-wait
```

By deleting the resource group, you also deallocate and delete all the resources contained within it. Be sure you no longer need the resources in the group before using the command.

Deleting all the resources can take some time. The `--no-wait` argument allows the command to return immediately.

Having issues? [Let us know](https://aka.ms/DjangoCLITutorialHelp).

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
