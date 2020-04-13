---
title: 'Tutorial: Linux Python app with Postgres'
description: Learn how to get a Linux Python app working in Azure App Service, with connection to a PostgreSQL database in Azure. Django is used in this tutorial.
ms.devlang: python
ms.topic: tutorial
ms.date: 04/13/2020
ms.custom: [mvc, seodec18, seo-python-october2019, cli-validate]
---
# Tutorial: Deploy a Python (Django) web app with PostgreSQL in Azure App Service

[Azure App Service](app-service-linux-intro.md) provides a highly scalable, self-patching web hosting service. This tutorial shows how to connect a data-driven Python Django web app to an Azure Database for PostgreSQL database, and deploy and run the app on Azure App Service.

![Python Django web app in Azure App Service](./media/tutorial-python-postgresql-app/run-python-django-app-in-azure.png)

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an Azure Database for PostgreSQL database
> * Deploy code to Azure App Service and connect to Postgres
> * Update your code and redeploy
> * View diagnostic logs
> * Manage the web app in the Azure portal

You can follow the steps in this article on macOS, Linux, or Windows. The steps are similar in most cases, although differences aren't detailed in this tutorial. Most of the examples below use a `bash` terminal window on Linux. 

## Prerequisites

Before you start this tutorial:

- [!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]
- Install [Git](https://git-scm.com/).
- Install [Python 3](https://www.python.org/downloads/).

## Clone the sample app

In a terminal window, run the following commands to clone the sample app repository, and change to the new working directory:

```
git clone https://github.com/cephalin/djangoapp
cd djangoapp
```

The djangoapp sample repository contains the data-driven [Django](https://www.djangoproject.com/) polls app you get by following [Writing your first Django app](https://docs.djangoproject.com/en/2.1/intro/tutorial01/) in the Django documentation.

## Prepare app for App Service

Like many Python web frameworks, Django [requires certain changes before they can be run in a production server](https://docs.djangoproject.com/en/2.1/howto/deployment/checklist/), and it's no different with App Service. You need to change and add some settings in the default *azuresite/settings.py* file so that the app works after it's deployed to App Service.

Also, a Django app by default uses Sqlite3 as the database. To run your app in production, you change it to PostgreSQL in Azure as the production database.

1. In the *azuresite* directory, add a file called production.py and add the following content to it:

    ```python
    from .settings import *
    
    # Configure default domain name
    ALLOWED_HOSTS = [os.environ['WEBSITE_SITE_NAME'] + '.azurewebsites.net', '127.0.0.1'] if 'WEBSITE_SITE_NAME' in os.environ else []
    
    # WhiteNoise configuration
    MIDDLEWARE = [                                                                   
        'django.middleware.security.SecurityMiddleware',
        # Add whitenoise middleware after the security middleware                             
        'whitenoise.middleware.WhiteNoiseMiddleware',
        'django.contrib.sessions.middleware.SessionMiddleware',                      
        'django.middleware.common.CommonMiddleware',                                 
        'django.middleware.csrf.CsrfViewMiddleware',                                 
        'django.contrib.auth.middleware.AuthenticationMiddleware',                   
        'django.contrib.messages.middleware.MessageMiddleware',                      
        'django.middleware.clickjacking.XFrameOptionsMiddleware',                    
    ]
    
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'  
    STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
    
    # Configure Postgres database
    DATABASES = {                                                                    
        'default': {                                                                 
            'ENGINE': 'django.db.backends.postgresql',                               
            'NAME': os.environ['DBNAME'],                                            
            'HOST': os.environ['DBHOST'],                                            
            'USER': os.environ['DBUSER'],                                            
            'PASSWORD': os.environ['DBPASS']                                         
        }                                                                            
    }
    ```
    
    Briefly, *azuresite/production.py* does the following:

    - Inherit all settings from *azuresite/settings.py*.
    - Add the fully qualified domain name of the App Service app to the allowed hosts. 
    - Use [WhiteNoise](https://whitenoise.evans.io/en/stable/) to enable serving static files in production. The WhiteNoise package is already included in *requirements.txt*.
    - Add configuration for PostgreSQL database. The [psycopg2-binary](https://pypi.org/project/psycopg2-binary/) package is already included in *requirements.txt*.

1. In *manage.py*, change the following line:

    ```python
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'azuresite.settings')
    ```

    To the following code:

    ```python
    if os.environ.get('DJANGO_ENV') == 'production':
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'azuresite.production')
    else:
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'azuresite.settings')
    ```

1. In *azuresite/wsgi.py*, make the same change as above.

    In App Service, you use *manage.py* to run database migrations, and App Service uses *azuresite/wsgi.py* to run your Django app in production. This change in both files ensures that the production settings are used in both cases.

## Sign in to Azure CLI

Run the following command in the terminal:

```azurecli
az login
```

Follow the instructions in the terminal to sign into your Azure account. When you're finished, your subscriptions are listed:

```
[
  {
    "cloudName": "AzureCloud",
    "homeTenantId": "00000000-0000-0000-0000-000000000000",
    "id": "00000000-0000-0000-0000-000000000000",
    "isDefault": false,
    "managedByTenants": [],
    "name": "<subscription-name>",
    "state": "Enabled",
    "tenantId": "00000000-0000-0000-0000-000000000000",
    "user": {
      "name": "<azure-account-name>",
      "type": "user"
    }
  },
  ...
]
```

## Create Postgres database in Azure

<!-- > [!NOTE]
> Before you create an Azure Database for PostgreSQL server, check which [compute generation](/azure/postgresql/concepts-pricing-tiers#compute-generations-and-vcores) is available in your region. If your region doesn't support Gen4 hardware, change *--sku-name* in the following command line to a value that's supported in your region, such as B_Gen4_1.  -->

In this section, you create an Azure Database for PostgreSQL server and database. To start, install the `db-up` extension with the following command:

```azurecli
az extension add --name db-up
```

Create the Postgres database in Azure with the [`az postgres up`](/cli/azure/ext/db-up/postgres?view=azure-cli-latest#ext-db-up-az-postgres-up) command, as shown in the following example. Replace *\<postgresql-name>* with a *unique* name (the server endpoint is *https://\<postgresql-name>.postgres.database.azure.com*). For *\<admin-username>* and *\<admin-password>*, specify credentials for a database administrator account.

<!-- Issue: without --location -->
```azurecli
az postgres up --resource-group myResourceGroup --location westus --server-name <postgresql-name> --database-name pollsdb --admin-user <admin-username> --admin-password <admin-password> --ssl-enforcement Enabled
```

This command may take a while because it's doing the following:

- Creates a resource group called `myResourceGroup`, if it doesn't exist. `--resource-group` is optional.
- Creates a Postgres server with the administrative user.
- Creates a `pollsdb` database.
- Allows access from your local IP address.
- Allows access from Azure services.
- Create a user with access to the `pollsdb` database.

You can do all the steps separately with other `az postgres` commands and `psql`, but `az postgres up` does all of them in one step for you.

When the command finishes, find the script that created the database user, with the username `root` and password `Pollsdb1`, which you'll use later to connect to the database:

```
Successfully Connected to PostgreSQL.
Ran Database Query: `CREATE USER root WITH ENCRYPTED PASSWORD 'Pollsdb1'`
Ran Database Query: `GRANT ALL PRIVILEGES ON DATABASE pollsdb TO root`
```

<!-- not all locations support az postgres up -->
> [!TIP]
> To specify the location for your Postgres server, include the argument `--location <location-name>`, where `<location_name>` is one of the [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/). You can get the regions available to your subscription with the [`az account list-locations`](/cli/azure/appservice?view=azure-cli-latest.md#az-appservice-list-locations) command.

## Deploy the App Service app

In this section, you create the App Service app. You will connect this app to the Postgres database you created and deploy your code.

### Create the App Service app

<!-- validation error: Parameter 'ResourceGroup.location' can not be None. -->
<!-- --resource-group is not respected at all -->

```azurecli
az webapp up --location westus --plan myAppServicePlan --sku B1 --name <app-name>
```
<!-- !!! without --sku creates PremiumV2 plan!! -->

This command may take a while because it's doing the following:

<!-- - Create the resource group if it doesn't exist. `--resource-group` is optional. -->
<!-- No it doesn't. az webapp up doesn't respect --resource-group -->
- Create the App Service plan *myAppServicePlan* in basic (B1) tier, if it doesn't exist. `--plan` and `--sku` are optional.
- Create the App Service app if it doesn't exist.
- Enable default logging for the app, if not already enabled.
- Upload the repository using ZIP deployment with build automation enabled.

Once the deployment finishes, you see a JSON output like the following:

```json
{
  "URL": "http://<app-name>.azurewebsites.net",
  "appserviceplan": "myAppServicePlan",
  "location": "westus",
  "name": "<app-name>",
  "os": "Linux",
  "resourcegroup": "<app-resource-group>",
  "runtime_version": "python|3.7",
  "runtime_version_detected": "-",
  "sku": "BASIC",
  "src_path": "//var//lib//postgresql//djangoapp"
}
```

Copy <app-resource-group>. This resource group is auto-generated for you. You need it to configure the app later. 

> [!TIP]
> You can use the same command later to deploy any changes and immediately enable diagnostic logs with:
> 
> ```azurecli
> az webapp up --name <app-name>
> ```

The sample code is now deployed, but the app doesn't connect to the Postgres database in Azure yet. You'll do this next.

### Configure environment variables

When you run your app locally, you set the environment variables in your terminal. In Azure App Service, you do it with *app settings*, by using the [az webapp config appsettings set](/cli/azure/webapp/config/appsettings?view=azure-cli-latest#az-webapp-config-appsettings-set) command.

In the Azure Cloud Shell, run the following command to specify the database connection details as app settings. Replace *\<app-name>*, *\<app-resource-group>*, and *\<postgresql-name>* with your own values. Remember that the user credentials `root` and `Pollsdb1` were created for you by `az postgres up`.

```azurecli
az webapp config appsettings set --name <app-name> --resource-group <app-resource-group> --settings DJANGO_ENV="production" DBHOST="<postgresql-name>.postgres.database.azure.com" DBUSER="root@<postgresql-name>" DBPASS="Pollsdb1" DBNAME="pollsdb"
```

For information on how your code accesses these app settings, see [Access environment variables](how-to-configure-python.md#access-environment-variables).

### Run database migrations

To run database migrations in App Service, open an SSH session in the browser by navigating to *https://\<app-name>.scm.azurewebsites.net/webssh/host*:

<!-- doesn't work when container not started -->
<!-- ```azurecli
az webapp ssh --resource-group myResourceGroup --name <app-name>
``` -->

In the SSH session, run the following commands:

```bash
cd site/wwwroot

# Activate virtual environment
python3 -m venv venv
source venv/bin/activate
# Install requirements in environment
pip install -r requirements.txt
# Run database migrations
python manage.py migrate
# Create the super user (follow prompts)
python manage.py createsuperuser
```

### Browse to the Azure app

Browse to the deployed app with URL *http:\//\<app-name>.azurewebsites.net* in a browser. You should see the message **No polls are available**. 

Browse to *http:\//\<app-name>.azurewebsites.net/admin* and sign in using the admin user you created in the last step. Select **Add** next to **Questions**, and create a poll question with some choices.

Browse to the deployed app with URL *http:\//\<app-name>.azurewebsites.net/admin*, and create some poll questions. You can see the questions at *http:\//\<app-name>.azurewebsites.net/*. 

![Run Python Django app in App Services in Azure](./media/tutorial-python-postgresql-app/run-python-django-app-in-azure.png)

Browse to the deployed app with URL *http:\//\<app-name>.azurewebsites.net* again to see the poll question and answer the question.

App Service detects a Django project in your repository by looking for a *wsgi.py* file in each subdirectory, which `manage.py startproject` creates by default. When App Service finds the file, it loads the Django web app. For more information on how App Service loads Python apps, see [Configure built-in Python image](how-to-configure-python.md).

**Congratulations!** You're running a Python (Django) web app in Azure App Service for Linux.

## Develop app locally and redeploy

In this section, you develop your app in your local environment and redeploy your code to App Service.

### Set up locally and run

To set up your local development environment and run the sample app for the first time, run the following commands:

# [bash](#tab/bash)

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

# [PowerShell](#tab/powershell)

```powershell
# Configure the Python virtual environment
py -3 -m venv venv
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
venv\scripts\activate

# Install packages
pip install -r requirements.txt
# Run Django migrations
python manage.py migrate
# Create Django superuser (follow prompts)
python manage.py createsuperuser
# Run the dev server
python manage.py runserver
```

# [CMD](#tab/cmd)

```CMD
:: Configure the Python virtual environment
py -3 -m venv venv
venv\scripts\activate

:: Install packages
pip install -r requirements.txt
:: Run Django migrations
python manage.py migrate
:: Create Django superuser (follow prompts)
python manage.py createsuperuser
:: Run the dev server
python manage.py runserver
```
---

When the Django web app is fully loaded, it returns something like the following message:

```
Performing system checks...

System check identified no issues (0 silenced).
December 13, 2019 - 10:54:59
Django version 2.1.2, using settings 'azuresite.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

Go to *http:\//localhost:8000* in a browser. You should see the message **No polls are available**. 

Go to *http:\//localhost:8000/admin* and sign in using the admin user you created in the last step. Select **Add** next to **Questions**, and create a poll question with some choices.

![Run Python Django app in App Services locally](./media/tutorial-python-postgresql-app/run-python-django-app-locally.png)

Go to *http:\//localhost:8000* again to see the poll question and answer the question. The local Django sample application writes and stores user data to a local Sqlite3 database, so you don't need to worry about messing up your production database. To make your development environment match the Azure environment, consider using a Postgres database locally instead.

To stop the Django server, type Ctrl+C in the terminal.

### Update the app

TODO HERE

### Redeploy code

To redeploy the changes, just run the following command from the repository root:

```azurecli
az webapp up --name <app-name>
```

### Rerun migrations

To rerun database migrations in App Service, open an SSH session in the browser by navigating to *https://\<app-name>.scm.azurewebsites.net/webssh/host*. Run the following commands:

```
cd site/wwwroot

# Activate the virtual environment
source venv/bin/activate
# Run database migrations
python manage.py migrate
```

### Review app in production

Browse to *http:\//\<app-name>.azurewebsites.net* and see the changes running live in production. 

## Stream diagnostic logs

You can access the console logs generated from inside the container.

> [!TIP]
> `az webapp up` turns on the default logging for you. For performance reasons, this logging turns itself off after some time, but turns back on each time you run `az webapp up` again. To turn it on manually, run the following command in the Cloud Shell:
>
> ```azurecli
> az webapp log config --name <app-name> --resource-group <app-resource-group> --docker-container-logging filesystem
> ```

Run the following Azure CLI command to see the log stream:

```azurecli
az webapp log tail --name <app-name> --resource-group <app-resource-group>
```

If you don't see console logs immediately, check again in 30 seconds.

> [!NOTE]
> You can also inspect the log files from the browser at `https://<app-name>.scm.azurewebsites.net/api/logs/docker`.

To stop log streaming at any time, type `Ctrl`+`C`.

## Manage your app in the Azure portal

In the [Azure portal](https://portal.azure.com), search for and select the app you created.

![Navigate to your Python Django app in the Azure portal](./media/tutorial-python-postgresql-app/navigate-to-django-app-in-app-services-in-the-azure-portal.png)

By default, the portal shows your app's **Overview** page. This page gives you a view of how your app is doing. Here, you can also perform basic management tasks like browse, stop, restart, and delete. The tabs on the left side of the page show the different configuration pages you can open.

![Manage your Python Django app in the Overview page in the Azure portal](./media/tutorial-python-postgresql-app/manage-django-app-in-app-services-in-the-azure-portal.png)

## Clean up resources

If you don't expect to need these resources in the future, delete the resource groups by running the following command in the Cloud Shell:

```azurecli
az group delete --name myResourceGroup
az group delete --name <app-resource-group>
```

## Next steps

In this tutorial, you learned:

> [!div class="checklist"]
> * Create an Azure Database for PostgreSQL database
> * Deploy code to Azure App Service and connect to Postgres
> * Update your code and redeploy
> * View diagnostic logs
> * Manage the web app in the Azure portal

Go to the next tutorial to learn how to map a custom DNS name to your app:

> [!div class="nextstepaction"]
> [Tutorial: Map custom DNS name to your app](../app-service-web-tutorial-custom-domain.md)

Or check out other resources:

> [!div class="nextstepaction"]
> [Configure Python app](how-to-configure-python.md)
