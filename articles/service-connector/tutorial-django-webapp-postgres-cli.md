---
title: 'Tutorial: Using Service Connector to build a Django app with Postgres on Azure App Service'
description: Create a Python web app with a PostgreSQL database and deploy it to Azure. The tutorial uses the Django framework, the app is hosted on Azure App Service on Linux, and the App Service and Database is connected with Service Connector.
ms.devlang: python
ms.custom: devx-track-azurecli, devx-track-python, linux-related-content
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: tutorial
ms.date: 05/13/2024
---
# Tutorial: Using Service Connector to build a Django app with Postgres on Azure App Service

> [!NOTE]
> In this tutorial, you use Service Connector that simplifies the process of connecting a web app to a database service. This tutorial is a modification of the [App Service tutorial](../app-service/tutorial-python-postgresql-app.md), so you may see some similarities. Look into section [Configure environment variables to connect the database](#configure-environment-variables-to-connect-the-database) to see where Service Connector comes into play and simplifies the connection process given in the App Service tutorial.

This tutorial shows how to deploy a data-driven Python [Django](https://www.djangoproject.com/) web app to [Azure App Service](overview.md) and connect it to an [Azure Database for PostgreSQL Flexible server](../postgresql/flexible-server/index.yml) database.

In this tutorial, you use the Azure CLI to complete the following tasks:

> [!div class="checklist"]
> * Set up your initial environment with Python and the Azure CLI
> * Create an Azure Database for PostgreSQL Flexible server database
> * Deploy code to Azure App Service and connect to PostgreSQL Flexible server
> * Update your code and redeploy
> * View diagnostic logs
> * Manage the web app in the Azure portal

## Set up your initial environment

1. Install [Python 3.8 or higher](https://www.python.org/downloads/). To check if your Python version is 3.8 or higher, run the following code in a terminal window:

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

Use the flexible-server branch of the sample, which contains a few necessary changes, such as how the database server URL is set and adding `'OPTIONS': {'sslmode': 'require'}` to the Django database configuration as required by Azure PostgreSQL Flexible server.

```terminal
git checkout flexible-server
```

### [Download](#tab/download)

Visit [https://github.com/Azure-Samples/djangoapp](https://github.com/Azure-Samples/djangoapp).

For Flexible server, select the branches control that says "master" and then select the **flexible-server** branch.

Select **Code**, and then select **Download ZIP**.

Unpack the ZIP file into a folder named *djangoapp*.

Open a terminal window in that *djangoapp* folder.

---

The djangoapp sample contains the data-driven Django polls app you get by following [Writing your first Django app](https://docs.djangoproject.com/en/5.0/intro/tutorial01/) in the Django documentation. The completed app is provided here for your convenience.

The sample is also modified to run in a production environment like App Service:

* Production settings are in the *azuresite/production.py* file. Development settings are in *azuresite/settings.py*.
* The app uses production settings when the `WEBSITE_HOSTNAME` environment variable is set. Azure App Service automatically sets this variable to the URL of the web app, such as `msdocs-django.azurewebsites.net`.

The production settings are specific to configuring Django to run in any production environment and aren't particular to App Service. For more information, see the [Django deployment checklist](https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/). Also see [Production settings for Django on Azure](../app-service/configure-language-python.md#production-settings-for-django-apps) for details on some of the changes.

Having issues? [Let us know](https://aka.ms/DjangoCLITutorialHelp).

## Create Postgres database in Azure

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

Having issues? [Let us know](https://aka.ms/DjangoCLITutorialHelp).

## Deploy the code to Azure App Service

In this section, you create app host in App Service app, connect this app to the Postgres database, then deploy your code to that host.

### Create the App Service app

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

Upon successful deployment, the command generates JSON output like the following example:

:::image type="content" source="../app-service/media/tutorial-python-postgresql-app/az-webapp-up-output.png" alt-text="Screenshot of the terminal, showing an example output for the az webapp up command." :::

Having issues? Refer first to the [Troubleshooting guide](../app-service/configure-language-python.md#troubleshooting), otherwise, [let us know](https://aka.ms/DjangoCLITutorialHelp).

### Configure environment variables to connect the database

With the code now deployed to App Service, the next step is to connect the app to the Postgres database in Azure.

The app code expects to find database information in four environment variables named `AZURE_POSTGRESQL_HOST`, `AZURE_POSTGRESQL_NAME`, `AZURE_POSTGRESQL_USER`, and `AZURE_POSTGRESQL_PASS`.

To set environment variables in App Service, create "app settings" with the following `az connection create` command.

```azurecli
az webapp connection create postgres-flexible --client-type django
```

The resource group, app name, db name are drawn from the cached values. You need to provide admin password of your postgres database during the execution of this command.

* The command creates settings named "AZURE_POSTGRESQL_HOST", "AZURE_POSTGRESQL_NAME", "AZURE_POSTGRESQL_USER", "AZURE_POSTGRESQL_PASS" as expected by the app code.
* If you forgot your admin credentials, the command would guide you to reset it.

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

If you'd like to keep the app or continue to more tutorials, skip ahead to [Next steps](#next-step). Otherwise, to avoid incurring ongoing charges, delete the resource group created for this tutorial:

```azurecli
az group delete --name ServiceConnector-tutorial-rg --no-wait
```

By deleting the resource group, you also deallocate and delete all the resources contained within it. Be sure you no longer need the resources in the group before using the command.

Deleting all the resources can take some time. The `--no-wait` argument allows the command to return immediately.

Having issues? [Let us know](https://aka.ms/DjangoCLITutorialHelp).

## Next step

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
