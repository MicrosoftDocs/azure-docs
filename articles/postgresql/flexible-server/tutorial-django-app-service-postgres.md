---
title: 'Tutorial: Deploy Django app with App Service and Azure Database for PostgreSQL - Flexible Server (Preview) in virtual network'
description:  Deploy Django app with App Serice and Azure Database for PostgreSQL - Flexible Server (Preview)  in virtual network
author: mksuni
ms.author: sumuth
ms.service: postgresql
ms.devlang: azurecli
ms.topic: tutorial
ms.date: 09/22/2020
ms.custom: mvc, devx-track-azurecli
---

# Tutorial: Deploy Django app with App Service and Azure Database for PostgreSQL - Flexible Server (Preview)

> [!IMPORTANT]
> Azure Database for PostgreSQL - Flexible Server is in preview

In this tutorial you will learn how to deploy a Django application in Azure using App Services and Azure Database for PostgreSQL - Flexible Server in a virtual network.

## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

This article requires that you're running the Azure CLI version 2.0 or later locally. To see the version installed, run the `az --version` command. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

You'll need to login to your account using the [az login](/cli/azure/authenticate-azure-cli) command. Note the **id** property from the command output for the corresponding subscription name.

```azurecli
az login
```

If you have multiple subscriptions, choose the appropriate subscription in which the resource should be billed. Select the specific subscription ID under your account using [az account set](/cli/azure/account) command. Substitute the **subscription ID** property from the **az login** output for your subscription into the subscription ID placeholder.

```azurecli
az account set --subscription <subscription id>
```
## Clone or download the sample app

# [Git clone](#tab/clone)

Clone the sample repository:

```terminal
git clone https://github.com/Azure-Samples/djangoapp
```

Then go into that folder:

```terminal
cd djangoapp
```

# [Download](#tab/download)

Visit [https://github.com/Azure-Samples/djangoapp](https://github.com/Azure-Samples/djangoapp), select **Clone**, and then select **Download ZIP**.

Unpack the ZIP file into a folder named *djangoapp*.

Then open a terminal window in that *djangoapp* folder.

---

The djangoapp sample contains the data-driven Django polls app you get by following [Writing your first Django app](https://docs.djangoproject.com/en/2.1/intro/tutorial01/) in the Django documentation. The completed app is provided here for your convenience.

The sample is also modified to run in a production environment like App Service:

- Production settings are in the *azuresite/production.py* file. Development details are in *azuresite/settings.py*.
- The app uses production settings when the `DJANGO_ENV` environment variable is set to "production". You create this environment variable later in the tutorial along with others used for the PostgreSQL database configuration.

These changes are specific to configuring Django to run in any production environment and aren't particular to App Service. For more information, see the [Django deployment checklist](https://docs.djangoproject.com/en/2.1/howto/deployment/checklist/).

## Create a PostgreSQL Flexible Server in a new virtual network

Create a private flexible server and a database inside a virtual network (VNET) using the following command:
```azurecli
# Create Flexible server in a VNET

az postgres flexible-server create --resource-group myresourcegroup --location westus2

```

This command performs the following actions, which may take a few minutes:

- Create the resource group if it doesn't already exist.
- Generates a server name if it is not provided.
- Create a new virtual network for your new postgreSQL server. **Make a note of virtual network name and subnet name** created for your server since you need to add the web app to the same virtual network.
- Creates admin username , password for your server if not provided. **Make a note of the username and password** to use in the next step.
- Create a database ```postgres``` that can be used for development. You can run [**psql** to connect to the database](quickstart-create-server-portal.md#connect-to-the-postgresql-database-using-psql) to create a different database.

> [!NOTE]
> Make a note of your password that will be generate for you if not provided. If you forget the password you would have to reset the password using ``` az postgres flexible-server update``` command


## Deploy the code to Azure App Service

In this section, you create app host in App Service app, connect this app to the Postgres database, then deploy your code to that host.


### Create the App Service web app in a virtual network

In the terminal, make sure you're in the repository root (`djangoapp`) that contains the app code.

Create an App Service app (the host process) with the [`az webapp up`](/cli/azure/webapp#az_webapp_up) command:

```azurecli

# Create a web app
az webapp up --resource-group myresourcegroup --location westus2 --plan DjangoPostgres-tutorial-plan --sku B1 --name <app-name>

# Enable VNET integration for web app.
# Replace <vnet-name> and <subnet-name> with the virtual network and subnet name that the flexible server is using.

az webapp vnet-integration add -g myresourcegroup -n  mywebapp --vnet <vnet-name> --subnet <subnet-name>

# Configure database information as environment variables
# Use the postgres server name , database name , username , password for the database created in the previous steps

az webapp config appsettings set --settings DJANGO_ENV="production" DBHOST="<postgres-server-name>.postgres.database.azure.com" DBNAME="postgres" DBUSER="<username>" DBPASS="<password>"
```
- For the `--location` argument, use the same location as you did for the database in the previous section.
- Replace *\<app-name>* with a unique name across all Azure (the server endpoint is `https://\<app-name>.azurewebsites.net`). Allowed characters for *\<app-name>* are `A`-`Z`, `0`-`9`, and `-`. A good pattern is to use a combination of your company name and an app identifier.
- Create the [App Service plan](../../app-service/overview-hosting-plans.md) *DjangoPostgres-tutorial-plan* in the Basic pricing tier (B1), if it doesn't exist. `--plan` and `--sku` are optional.
- Create the App Service app if it doesn't exist.
- Enable default logging for the app, if not already enabled.
- Upload the repository using ZIP deployment with build automation enabled.
- **az webapp vnet-integration** command adds the web app in the same virtual network as the postgres server.
- The app code expects to find database information in a number of environment variables. To set environment variables in App Service, you create "app settings" with the [az webapp config appsettings set](/cli/azure/webapp/config/appsettings#az_webapp_config_appsettings_set) command.

> [!TIP]
> Many Azure CLI commands cache common parameters, such as the name of the resource group and App Service plan, into the file *.azure/config*. As a result, you don't need to specify all the same parameter with later commands. For example, to redeploy the app after making changes, you can just run `az webapp up` again without any parameters.

### Run Django database migrations

Django database migrations ensure that the schema in the PostgreSQL on Azure database match those described in your code.

1. Open an SSH session in the browser by navigating to *https://\<app-name>.scm.azurewebsites.net/webssh/host* and sign in with your Azure account credentials (not the database server credentials).

1. In the SSH session, run the following commands (you can paste commands using **Ctrl**+**Shift**+**V**):

    ```bash
    cd site/wwwroot

    # Activate default virtual environment in App Service container
    source /antenv/bin/activate
    # Install packages
    pip install -r requirements.txt
    # Run database migrations
    python manage.py migrate
    # Create the super user (follow prompts)
    python manage.py createsuperuser
    ```

1. The `createsuperuser` command prompts you for superuser credentials. For the purposes of this tutorial, use the default username `root`, press **Enter** for the email address to leave it blank, and enter `postgres1` for the password.

### Create a poll question in the app

1. In a browser, open the URL *http:\//\<app-name>.azurewebsites.net*. The app should display the message "No polls are available" because there are no specific polls yet in the database.

1. Browse to *http:\//\<app-name>.azurewebsites.net/admin*. Sign in using superuser credentials from the previous section (`root` and `postgres1`). Under **Polls**, select **Add** next to **Questions** and create a poll question with some choices.

1. Browse again to *http:\//\<app-name>.azurewebsites.net/* to confirm that the questions are now presented to the user. Answer questions however you like to generate some data in the database.

**Congratulations!** You're running a Python Django web app in Azure App Service for Linux, with an active Postgres database.

> [!NOTE]
> App Service detects a Django project by looking for a *wsgi.py* file in each subfolder, which `manage.py startproject` creates by default. When App Service finds that file, it loads the Django web app. For more information, see [Configure built-in Python image](../../app-service/configure-language-python.md).

## Make code changes and redeploy

In this section, you make local changes to the app and redeploy the code to App Service. In the process, you set up a Python virtual environment that supports ongoing work.

### Run the app locally

In a terminal window, run the following commands. Be sure to follow the prompts when creating the superuser:

```bash
# Configure the Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install packages
pip install -r requirements.txt
# Run Django migrations
python manage.py migrate
# Create Django superuser (follow prompts)
python manage.py createsuperuser
# Run the dev server
python manage.py runserver
```
Once the web app is fully loaded, the Django development server provides the local app URL in the message, "Starting development server at http://127.0.0.1:8000/. Quit the server with CTRL-BREAK".

:::image type="content" source="./media/tutorial-django-app-service-postgres/django-dev-server-output.png" alt-text="Example Django development server output":::

Test the app locally with the following steps:

1. Go to *http:\//localhost:8000* in a browser, which should display the message "No polls are available".

1. Go to *http:\//localhost:8000/admin* and sign in using the admin user you created previously. Under **Polls**, again select **Add** next to **Questions** and create a poll question with some choices.

1. Go to *http:\//localhost:8000* again and answer the question to test the app.

1. Stop the Django server by pressing **Ctrl**+**C**.

When running locally, the app is using a local Sqlite3 database and doesn't interfere with your production database. You can also use a local PostgreSQL database, if desired, to better simulate your production environment.



### Update the app

In `polls/models.py`, locate the line that begins with `choice_text` and change the `max_length` parameter to 100:

```python
# Find this lie of code and set max_length to 100 instead of 200
choice_text = models.CharField(max_length=100)
```

Because you changed the data model, create a new Django migration and migrate the database:

```
python manage.py makemigrations
python manage.py migrate
```

Run the development server again with `python manage.py runserver` and test the app at to *http:\//localhost:8000/admin*:

Stop the Django web server again with **Ctrl**+**C**.


### Redeploy the code to Azure

Run the following command in the repository root:

```azurecli
az webapp up
```

This command uses the parameters cached in the *.azure/config* file. Because App Service detects that the app already exists, it just redeploys the code.



### Rerun migrations in Azure

Because you made changes to the data model, you need to rerun database migrations in App Service.

Open an SSH session again in the browser by navigating to *https://\<app-name>.scm.azurewebsites.net/webssh/host*. Then run the following commands:

```
cd site/wwwroot

# Activate default virtual environment in App Service container
source /antenv/bin/activate
# Run database migrations
python manage.py migrate
```

### Review app in production

Browse to *http:\//\<app-name>.azurewebsites.net* and test the app again in production. (Because you only changed the length of a database field, the change is only noticeable if you try to enter a longer response when creation a question.)

> [!TIP]
> You can use [django-storages](https://django-storages.readthedocs.io/en/latest/backends/azure.html) to store static & media assets in Azure storage. You can use Azure CDN for gzipping for static files.


## Manage your app in the Azure portal

In the [Azure portal](https://portal.azure.com), search for the app name and select the app in the results.

:::image type="content" source="./media/tutorial-django-app-service-postgres/navigate-to-django-app-in-app-services-in-the-azure-portal.png" alt-text="Navigate to your Python Django app in the Azure portal":::

By default, the portal shows your app's **Overview** page, which provides a general performance view. Here, you can also perform basic management tasks like browse, stop, restart, and delete. The tabs on the left side of the page show the different configuration pages you can open.

:::image type="content" source="./media/tutorial-django-app-service-postgres/manage-django-app-in-app-services-in-the-azure-portal.png" alt-text="Manage your Python Django app in the Overview page in the Azure portal":::


## Clean up resources

If you'd like to keep the app or continue to the next tutorial, skip ahead to [Next steps](#next-steps). Otherwise, to avoid incurring ongoing charges you can delete the resource group create for this tutorial:

```azurecli
az group delete -g myresourcegroup
```

The command uses the resource group name cached in the *.azure/config* file. By deleting the resource group, you also deallocate and delete all the resources contained within it.

## Next steps

Learn how to map a custom DNS name to your app:

> [!div class="nextstepaction"]
> [Tutorial: Map custom DNS name to your app](../../app-service/app-service-web-tutorial-custom-domain.md)

Learn how App Service runs a Python app:

> [!div class="nextstepaction"]
> [Configure Python app](../../app-service/configure-language-python.md)
