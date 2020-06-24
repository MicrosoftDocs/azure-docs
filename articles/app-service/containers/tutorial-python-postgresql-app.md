---
title: 'Tutorial: Deploy a Python Django app with Postgres'
description: Learn how to create a Python app with a PostgreSQL database and deploy it to Azure App Service on Linux. The tutorial uses a Django sample app for demonstration.
ms.devlang: python
ms.topic: tutorial
ms.date: 06/23/2020
ms.custom: [mvc, seodec18, seo-python-october2019, cli-validate, tracking-python]
---
# Tutorial: Deploy a Django web app with PostgreSQL in Azure App Service

This tutorial shows how to deploy a data-driven Python [Django](https://www.djangoproject.com/) web app to [Azure App Service](app-service-linux-intro.md) and connect it to an Azure Database for Postgres database. App Service provides a highly scalable, self-patching web hosting service.

![Deploy Python Django web app to Azure App Service](./media/tutorial-python-postgresql-app/deploy-python-django-app-in-azure.png)

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an Azure Database for Postgres database
> * Deploy code to Azure App Service and connect to Postgres
> * Update your code and redeploy
> * View diagnostic logs
> * Manage the web app in the Azure portal

You can follow the steps in this article on macOS, Linux, or Windows.

## Configure your local environment

Before you begin, you must have the following accounts and tools:

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- <a href="https://www.python.org/downloads/" target="_blank">Python 3.7</a> (Python 3.6 is also supported).
- <a href="https://git-scm.com/downloads" target="_blank">Git</a>.
- The <a href="https://docs.microsoft.com/cli/azure/install-azure-cli" target="_blank">Azure CLI</a> 2.0.80 or higher. Run `az --version` to check your version.

## Clone the sample app

In a terminal window, clone the sample app repository:

```terminal
git clone https://github.com/Azure-Samples/djangoapp
```

Then go into the repository folder:

```terminal
cd djangoapp
```

The djangoapp sample repository contains the data-driven Django polls app you get by following [Writing your first Django app](https://docs.djangoproject.com/en/2.1/intro/tutorial01/) in the Django documentation. The completed app is provided here for your convenience.

## Prepare the app for App Service

Like many Python web frameworks, Django requires certain settings to run in a production environment like App Service. These changes are described in the [deployment checklist]](https://docs.djangoproject.com/en/2.1/howto/deployment/checklist/). 

The sample application already contains these settings in the *azuresite/production.py* file. These settings are used in the app if the `DJANGO_ENV` environment variable is set to "production"; otherwise the app uses the defaults in *azuresite/settings.py*.

You create this environment variable later in the tutorial along with others used for the PostgreSQL database configuration.

## Sign in to Azure through the Azure CLI

In a terminal window, run the [`az login`](/cli/azure/reference-index#az-login) command:

```azurecli
az login
```

This command opens a browser to gather your credentials. When the command completes, it shows JSON output containing information about your subscriptions.

Once signed in, you can run Azure commands with the Azure CLI to work with resources in your subscription.

## Create Postgres database in Azure

<!-- > [!NOTE]
> Before you create an Azure Database for PostgreSQL server, check which [compute generation](/azure/postgresql/concepts-pricing-tiers#compute-generations-and-vcores) is available in your region. If your region doesn't support Gen4 hardware, change *--sku-name* in the following command line to a value that's supported in your region, such as B_Gen4_1.  -->

Install the `db-up` extension for the Azure CLI:

```azurecli
az extension add --name db-up
```

Then create the Postgres database in Azure with the [`az postgres up`](/cli/azure/ext/db-up/postgres#ext-db-up-az-postgres-up) command:

<!-- Issue: without --location -->
```azurecli
az postgres up -g DjangoPostgres-tutorial-rg -l westus2 --server-name <postgre-server-name> --database-name pollsdb --admin-user <admin-username> --admin-password <admin-password> --ssl-enforcement Enabled
```

Replace *\<postgres-server-name>* with a name that's unique across all Azure (the server endpoint is *https://\<postgres-server-name>.postgres.database.azure.com*). A good pattern is to use a combination of your personal or company name with a series of numbers.



For *\<admin-username>* and *\<admin-password>*, specify credentials to create an administrator user for this Postgres server.

This command performs the following actions, which may take a few minutes:

- Create a [resource group](../../azure-resource-manager/management/overview.md#terminology) called `DjangoPostgres-tutorial-rg`, if it doesn't already exist.
- Create a Postgres server.
- Create a default administrator account with a unique user name and password. (To specify your own credentials, use the `--admin-user` and `--admin-password` arguments with the `az postgres up` command.)
- Create a `pollsdb` database.
- Enable access from your local IP address.
- Enable access from Azure services.
- Create a database user with access to the `pollsdb` database.

You can do all the steps separately with other `az postgres` and `psql` commands, but `az postgres up` does all the steps together.

When the command completes, it outputs a JSON object that contains different connection strings for the database along with the server URL, a generated user name (such as "joyfulKoala@msdocs-djangodb-12345"), and a GUID password. Copy the user name and password to a temporary text file as you need them later in this tutorial.

<!-- not all locations support az postgres up -->
> [!TIP]
> `--location <location-name>`, can be set to any one of the [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/). You can get the regions available to your subscription with the [`az account list-locations`](/cli/azure/account#az-account-list-locations) command. For production apps, put your database and your app in the same location.

## Deploy the code to Azure App Service

In this section, you create app host in App Service app, connect this app to the Postgres database, then deploy your code to that host.

### Create the App Service host

<!-- validation error: Parameter 'ResourceGroup.location' can not be None. -->
<!-- --resource-group is not respected at all -->

In the terminal, make sure you're in the repository root (`djangoapp`) that contains the app code.

Create an App Service app (the host process) with the [`az webapp up`](/cli/azure/webapp#az-webapp-up) command:

```azurecli
az webapp up -g DjangoPostgres-tutorial-rg -l westus2 --plan DjangoPostgres-tutorial-plan --sku B1 --name <app-name>
```
<!-- !!! without --sku creates PremiumV2 plan!! -->

Replace *\<app-name>* with a unique name across all Azure (the server endpoint is *https://\<app-name>.azurewebsites.net*). Allowed characters for *\<app-name>* are `A`-`Z`, `0`-`9`, and `-`. A good pattern is to use a combination of your personal or company name with a series of numbers.

This command performs the following actions, which may take a few minutes:

<!-- - Create the resource group if it doesn't exist. `--resource-group` is optional. -->
<!-- No it doesn't. az webapp up doesn't respect --resource-group -->
- Create the [resource group](../../azure-resource-manager/management/overview.md#terminology) if it doesn't already exist. (In this command you use the same resource group in which you created the database earlier.)
- Create the [App Service plan](../overview-hosting-plans.md) *DjangoPostgres-tutorial-plan* in the Basic pricing tier (B1), if it doesn't exist. `--plan` and `--sku` are optional.
- Create the App Service app if it doesn't exist.
- Enable default logging for the app, if not already enabled.
- Upload the repository using ZIP deployment with build automation enabled.

Upon successful deployment, the command generates JSON output like the following example:

<pre>
{
  "URL": "http://msdocs-djangoapp-12345.azurewebsites.net",
  "appserviceplan": "DjangoPostgres-tutorial-plan",
  "location": "westus",
  "name": "msdocs-djangoapp-12345",
  "os": "Linux",
  "resourcegroup": "&lt;DjangoPostgres-tutorial-rg&gt;",
  "runtime_version": "python|3.7",
  "runtime_version_detected": "-",
  "sku": "BASIC",
  "src_path": "//var//lib//postgresql//djangoapp"
}
</pre>

> [!TIP]
> Many Azure CLI commands cache common parameters, such as the name of the resource group and App Service plan, into the file *.azure/config*. As a result, you don't need to specify all the same parameter with later commands. For example, to redeploy the app after making changes, you can just run `az webapp up` again without any parameters. Commands that come from CLI extensions, such as `az postgres up`, however, do not at present use the cache, which is why you needed to specify the resource group and location here with `az webapp up`.

> [!NOTE]
> If you attempt to visit the app's URL at this point, you encounter the error "DisallowedHost at /". This error happens because you have not yet configured the app to use the production settings discussed earlier, which you do in the following section.

### Configure environment variables to connect the database

With the code now deployed to App Service, the next step is to connect the app to the Postgres database in Azure and tell the app to use production settings.

The app code expects to find database information in a number of environment variables. To set environment variables in App Service, you create "app settings" with the [az webapp config appsettings set](/cli/azure/webapp/config/appsettings#az-webapp-config-appsettings-set) command.

```azurecli
az webapp config appsettings set --settings DJANGO_ENV="production" DBHOST="<postgres-server-name>.postgres.database.azure.com" DBNAME="pollsdb" DBUSER="<username>" DBPASS="<password>"
```

Replace *\<postgres-server-name>* with the name you used earlier with the `az postgres up` command, and replace *\<username>* and *\<password>* with the credentials that the command also generated for you. The resource group and app name are drawn from the cached values in the *.azure/config* file.

The command specifically creates app setting named `DJANGO_ENV` (with the value "production"), `DBHOST` (with the URL of the database server), `DBNAME` (with the name of the database, and `DBUSER` and `DBPASS` with credentials.

In your Python code, these settings appear like environment variable, so you use statements like `os.environ.get('DJANGO_ENV')` to access them. For more information, see [Access environment variables](how-to-configure-python.md#access-environment-variables).

### Run Django database migrations

Django database migrations ensure that the schema in the PostgreSQL on Azure database match those described in your code.

To run Django database migrations in App Service, open an SSH session in the browser by navigating to *https://\<app-name>.scm.azurewebsites.net/webssh/host* and signing in with your Azure account credentials (not the database server credentials).

In the SSH session, run the following commands (you can paste commands using **Ctrl**+**Shift**+**V**):

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

The `createsuperuser` command prompts you for superuser credentials. For the purposes of this tutorial, use the default username `root`, press **Enter** for the email address to leave it blank, and enter `Pollsdb1` for the password.

### Browse to the app

In a browser, open the URL *http:\//\<app-name>.azurewebsites.net*. The app should display the message "No polls are available" because there are no specific polls yet in the database.

Browse to *http:\//\<app-name>.azurewebsites.net/admin*. Sign in using superuser credentials from the previous section (`root` and `Pollsdb1`). Under **Polls**, select **Add** next to **Questions** and create a poll question with some choices.

Browse again to *http:\//\<app-name>.azurewebsites.net/* to confirm that the questions are now presented to the user. Answer questions however you like to generate some data in the database.

**Congratulations!** You're running a Python Django web app in Azure App Service for Linux, with an active Postgres database.

> [!NOTE]
> When starting the app host, App Service detects a Django project by looking for a *wsgi.py* file in each subfolder, which `manage.py startproject` creates by default. When App Service finds that file, it loads the Django web app. For more information, see [Configure built-in Python image](how-to-configure-python.md).


## Make code changes and redeploy

In this section, you make local changes to the app and redeploy the code to App Service. In the process, you set up a development environment for the app in which you can do ongoing work.

### Run the app locally

Run the following commands to set up your local development environment and run the app in the Django development server. Be sure to follow the prompts when creating the superuser:

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

```cmd
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

Once the web app is fully loaded, the Django development server displays a message similar to the following text:

<pre>
Performing system checks...

System check identified no issues (0 silenced).
June 24, 2020 - 10:27:14
Django version 2.2.13, using settings 'azuresite.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
</pre>

Go to *http:\//localhost:8000* in a browser, which should display the message "No polls are available". 

Go to *http:\//localhost:8000/admin* and sign in using the admin user you created previously. Under **Polls**, again select **Add** next to **Questions** and create a poll question with some choices. 

Go to *http:\//localhost:8000* again and answer the question to test the app. 

When running locally, the app is using a local Sqlite3 database and doesn't interfere with your production database. You can also use a local PostgreSQL database, if desired, to better simulate your production environment.

Stop the Django server by pressing **Ctrl**+**C**.

### Update the app

In `polls/models.py`, locate the following line:

<pre>
choice_text = models.CharField(max_length=200)
</pre>

Make a trivial change to the size of the field:

```python
choice_text = models.CharField(max_length=100)
```

Because you changed the data model, you must create a new Django migration and migrate the database:

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

## Stream diagnostic logs

You can access the console logs generated from inside the container that hosts the app on Azure.

Run the following Azure CLI command to see the log stream:

```azurecli
az webapp log tail
```

Again, this command uses parameters cached in the *.azure/config* file.

If you don't see console logs immediately, check again in 30 seconds.

To stop log streaming at any time, type **Ctrl**+**C**.

> [!NOTE]
> You can also inspect the log files from the browser at `https://<app-name>.scm.azurewebsites.net/api/logs/docker`.
>
> `az webapp up` turns on the default logging for you. For performance reasons, this logging turns itself off after some time, but turns back on each time you run `az webapp up` again. To turn it on manually, run the following command:
>
> ```azurecli
> az webapp log config --docker-container-logging filesystem
> ```

## Manage your app in the Azure portal

In the [Azure portal](https://portal.azure.com), search for the app name and select the app in the results.

![Navigate to your Python Django app in the Azure portal](./media/tutorial-python-postgresql-app/navigate-to-django-app-in-app-services-in-the-azure-portal.png)

By default, the portal shows your app's **Overview** page, which provides a general performance view. Here, you can also perform basic management tasks like browse, stop, restart, and delete. The tabs on the left side of the page show the different configuration pages you can open.

![Manage your Python Django app in the Overview page in the Azure portal](./media/tutorial-python-postgresql-app/manage-django-app-in-app-services-in-the-azure-portal.png)

## Clean up resources

If you'd like to keep the app or continue to the next tutorial, skip ahead to [Next steps](#next-steps). Otherwise, to avoid incurring ongoing charges you can delete the resource group create for this tutorial:

```azurecli
az group delete
```

The command uses the resource group name cached in the *.azure/config* file. By deleting the resource group, you also deallocate and delete all the resources contained within it.

## Next steps

Learn how to map a custom DNS name to your app:

> [!div class="nextstepaction"]
> [Tutorial: Map custom DNS name to your app](../app-service-web-tutorial-custom-domain.md)

Learn how App Service runs a Python app:

> [!div class="nextstepaction"]
> [Configure Python app](how-to-configure-python.md)
