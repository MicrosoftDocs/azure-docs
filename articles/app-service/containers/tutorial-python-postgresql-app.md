---
title: Python (Django) with PostgreSQL on Linux - Azure App Service | Microsoft Docs
description: Learn how to run a data-driven Python app in Azure, with connection to a PostgreSQL database. Django is used in the tutorial.
services: app-service\web
documentationcenter: python
author: cephalin
manager: jeconnoc
ms.service: app-service-web
ms.workload: web
ms.devlang: python
ms.topic: tutorial
ms.date: 03/27/2019
ms.author: cephalin
ms.reviewer: beverst
ms.custom: mvc
ms.custom: seodec18
---
# Build a Python and PostgreSQL app in Azure App Service

[App Service on Linux](app-service-linux-intro.md) provides a highly scalable, self-patching web hosting service. This tutorial shows how to create a data-driven Python app, using PostgreSQL as the database back end. When you are done, you have a Django application running in App Service on Linux.

![Python Django app in App Service on Linux](./media/tutorial-python-postgresql-app/django-admin-azure.png)

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a PostgreSQL database in Azure
> * Connect a Python app to PostgreSQL
> * Deploy the app to Azure
> * View diagnostic logs
> * Manage the app in the Azure portal

> [!NOTE]
> Before creating an Azure Database for PostgreSQL, please check [which compute generation is available in your region](https://docs.microsoft.com/azure/postgresql/concepts-pricing-tiers#compute-generations-and-vcores).

You can follow the steps in this article on macOS. Linux and Windows instructions are the same in most cases, but the differences are not detailed in this tutorial.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this tutorial:

1. [Install Git](https://git-scm.com/)
2. [Install Python](https://www.python.org/downloads/)
3. [Install and run PostgreSQL](https://www.postgresql.org/download/)

## Test local PostgreSQL installation and create a database

In a local terminal window, run `psql` to connect to your local PostgreSQL server.

```bash
sudo -u postgres psql postgres
```

If you get an error message similar to `unknown user: postgres`, your PostgreSQL installation may be configured with your logged in username. Try the following command instead.

```bash
psql postgres
```

If your connection is successful, your PostgreSQL database is running. If not, make sure that your local PostgresQL database is started by following the instructions for your operating system at [Downloads - PostgreSQL Core Distribution](https://www.postgresql.org/download/).

Create a database called *pollsdb* and set up a separate database user named *manager* with password *supersecretpass*.

```sql
CREATE DATABASE pollsdb;
CREATE USER manager WITH PASSWORD 'supersecretpass';
GRANT ALL PRIVILEGES ON DATABASE pollsdb TO manager;
```

Type `\q` to exit the PostgreSQL client.

<a name="step2"></a>

## Create local Python app

In this step, you set up the local Python Django project.

### Clone the sample app

Open the terminal window, and `CD` to a working directory.

Run the following commands to clone the sample repository.

```bash
git clone https://github.com/Azure-Samples/djangoapp.git
cd djangoapp
```

This sample repository contains a [Django](https://www.djangoproject.com/) application. It's the same data-driven app you would get by following the [getting started tutorial in the Django documentation](https://docs.djangoproject.com/en/2.1/intro/tutorial01/). This tutorial doesn't teach you Django, but shows you how to take deploy and run a Django app (or another data-driven Python app) to App Service.

### Configure environment

Create a Python virtual environment and use a script to set the database connection settings.

```bash
# Bash
python3 -m venv venv
source venv/bin/activate
source ./env.sh

# PowerShell
py -3 -m venv venv
venv\scripts\activate
.\env.ps1
```

The environment variables defined in *env.sh* and *env.ps1* are used in _azuresite/settings.py_ to define the database settings.

### Run app locally

Install the required packages, [run Django migrations](https://docs.djangoproject.com/en/2.1/topics/migrations/) and [create an admin user](https://docs.djangoproject.com/en/2.1/intro/tutorial02/#creating-an-admin-user).

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
```

Once the admin user is created, run the Django server.

```bash
python manage.py runserver
```

When the app is fully loaded, you see something similar to the following message:

```bash
Performing system checks...

System check identified no issues (0 silenced).
October 26, 2018 - 10:54:59
Django version 2.1.2, using settings 'azuresite.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

Navigate to `http://localhost:8000` in a browser. You should see the message `No polls are available.`. 

Navigate to `http://localhost:8000/admin` and sign in using the admin user you created in the last step. Click **Add** next to **Questions** and create a poll question with some choices.

![Python Django application running locally](./media/tutorial-python-postgresql-app/django-admin-local.png)

Navigate to `http://localhost:8000` again and see the poll question displayed.

The Django sample application stores user data in the database. If you are successful at adding a poll question, your app is writing data to the local PostgreSQL database.

To stop the Django server at anytime, type Ctrl+C in the terminal.

## Create a production PostgreSQL database

In this step, you create a PostgreSQL database in Azure. When your app is deployed to Azure, it uses this cloud database.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

### Create a resource group

[!INCLUDE [Create resource group](../../../includes/app-service-web-create-resource-group-linux-no-h.md)]

### Create an Azure Database for PostgreSQL server

Create a PostgreSQL server with the [`az postgres server create`](/cli/azure/postgres/server?view=azure-cli-latest#az-postgres-server-create) command in the Cloud Shell.

In the following example command, replace *\<postgresql-name>* with a unique server name, and replace *\<admin-username>* and *\<admin-password>* with the desired user credentials. The user credentials are for the database administrator account. The server name is used as part of your PostgreSQL endpoint (`https://<postgresql-name>.postgres.database.azure.com`), so the name needs to be unique across all servers in Azure.

```azurecli-interactive
az postgres server create --resource-group myResourceGroup --name <postgresql-name> --location "West Europe" --admin-user <admin-username> --admin-password <admin-password> --sku-name B_Gen4_1
```

When the Azure Database for PostgreSQL server is created, the Azure CLI shows information similar to the following example:

```json
{
  "administratorLogin": "<admin-username>",
  "fullyQualifiedDomainName": "<postgresql-name>.postgres.database.azure.com",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.DBforPostgreSQL/servers/<postgresql-name>",
  "location": "westus",
  "name": "<postgresql-name>",
  "resourceGroup": "myResourceGroup",
  "sku": {
    "capacity": 1,
    "family": "Gen4",
    "name": "B_Gen4_1",
    "size": null,
    "tier": "Basic"
  },
  < JSON data removed for brevity. >
}
```

> [!NOTE]
> Remember \<admin-username> and \<admin-password> for later. You need them to sign in to the Postgre server and its databases.

### Create firewall rules for the PostgreSQL server

In the Cloud Shell, run the following Azure CLI commands to allow access to the database from Azure resources.

```azurecli-interactive
az postgres server firewall-rule create --resource-group myResourceGroup --server-name <postgresql-name> --start-ip-address=0.0.0.0 --end-ip-address=0.0.0.0 --name AllowAllAzureIPs
```

> [!NOTE]
> This setting allows network connections from all IPs within the Azure network. For production use, try to configure the most restrictive firewall rules possible by [using only the outbound IP addresses your app uses](../overview-inbound-outbound-ips.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json#find-outbound-ips).

In the Cloud Shell, run the command again to allow access from your local computer by replacing *\<your-ip-address>* with [your local IPv4 IP address](https://www.whatsmyip.org/).

```azurecli-interactive
az postgres server firewall-rule create --resource-group myResourceGroup --server-name <postgresql-name> --start-ip-address=<your-ip-address> --end-ip-address=<your-ip-address> --name AllowLocalClient
```

## Connect Python app to production database

In this step, you connect your Django sample app to the Azure Database for PostgreSQL server you created.

### Create empty database and user access

In the Cloud Shell, connect to the database by running the command below. When prompted for your admin password, use the same password you specified in [Create an Azure Database for PostgreSQL server](#create-an-azure-database-for-postgresql-server).

```bash
psql -h <postgresql-name>.postgres.database.azure.com -U <admin-username>@<postgresql-name> postgres
```

Just like in your local Postgres server, create the database and user in the Azure Postgres server.

```sql
CREATE DATABASE pollsdb;
CREATE USER manager WITH PASSWORD 'supersecretpass';
GRANT ALL PRIVILEGES ON DATABASE pollsdb TO manager;
```

Type `\q` to exit the PostgreSQL client.

> [!NOTE]
> It's best practice to create database users with restricted permissions for specific applications, instead of using the admin user. In this example, the `manager` user has full privileges to _only_ the `pollsdb` database.

### Test app connectivity to production database

In the local terminal window, change the database environment variables (which you configured earlier by running *env.sh* or *env.ps1*):

```bash
# Bash
export DBHOST="<postgresql-name>.postgres.database.azure.com"
export DBUSER="manager@<postgresql-name>"
export DBNAME="pollsdb"
export DBPASS="supersecretpass"

# PowerShell
$Env:DBHOST = "<postgresql-name>.postgres.database.azure.com"
$Env:DBUSER = "manager@<postgresql-name>"
$Env:DBNAME = "pollsdb"
$Env:DBPASS = "supersecretpass"
```

Run Django migration to the Azure database and create an admin user.

```bash
python manage.py migrate
python manage.py createsuperuser
```

Once the admin user is created, run the Django server.

```bash
python manage.py runserver
```

Navigate to `http://localhost:8000` in again. You should see the message `No polls are available.` again. 

Navigate to `http://localhost:8000/admin` and sign in using the admin user you created, and create a poll question like before.

![Python Django application running in locally](./media/tutorial-python-postgresql-app/django-admin-local.png)

Navigate to `http://localhost:8000` again and see the poll question displayed. Your app is now writing data to the database in Azure.

## Deploy to Azure

In this step, you deploy the Postgres-connected Python application to Azure App Service.

### Configure repository

Django validates the `HTTP_HOST` header in incoming requests. For your Django app to work in App Service, you need to add the full-qualified domain name of the app to the allowed hosts. Open _azuresite/settings.py_ and find the `ALLOWED_HOSTS` setting. Change the line to:

```python
ALLOWED_HOSTS = [os.environ['WEBSITE_SITE_NAME'] + '.azurewebsites.net',
                 '127.0.0.1'] if 'WEBSITE_SITE_NAME' in os.environ else []
```

Next, Django doesn't support [serving static files in production](https://docs.djangoproject.com/en/2.1/howto/static-files/deployment/), so you need to enable this manually. For this tutorial, you use [WhiteNoise](https://whitenoise.evans.io/en/stable/). The WhiteNoise package is already included in _requirements.txt_. You just need to configure Django to use it. 

In _azuresite/settings.py_, find the `MIDDLEWARE` setting, and add the `whitenoise.middleware.WhiteNoiseMiddleware` middleware to the list, just below the `django.middleware.security.SecurityMiddleware` middleware. Your `MIDDLEWARE` setting should look like this:

```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    ...
]
```

At the end of _azuresite/settings.py_, add the following lines.

```python
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
```

For more information on configuring WhiteNoise, see the [WhiteNoise documentation](https://whitenoise.evans.io/en/stable/).

> [!IMPORTANT]
> The database settings section already follows the security best practice of using environment variables. For the complete deployment recommendations, see [Django Documentation: deployment checklist](https://docs.djangoproject.com/en/2.1/howto/deployment/checklist/).

Commit your changes into the repository.

```bash
git commit -am "configure for App Service"
```

### Configure deployment user

[!INCLUDE [Configure deployment user](../../../includes/configure-deployment-user-no-h.md)]

### Create App Service plan

[!INCLUDE [Create app service plan](../../../includes/app-service-web-create-app-service-plan-linux-no-h.md)]

### Create a web app

[!INCLUDE [Create web app](../../../includes/app-service-web-create-web-app-python-linux-no-h.md)]

### Configure environment variables

Earlier in the tutorial, you defined environment variables to connect to your PostgreSQL database.

In App Service, you set environment variables as _app settings_ by using the [`az webapp config appsettings set`](/cli/azure/webapp/config/appsettings?view=azure-cli-latest#az-webapp-config-appsettings-set) command in Cloud Shell.

The following example specifies the database connection details as app settings. 

```azurecli-interactive
az webapp config appsettings set --name <app-name> --resource-group myResourceGroup --settings DBHOST="<postgresql-name>.postgres.database.azure.com" DBUSER="manager@<postgresql-name>" DBPASS="supersecretpass" DBNAME="pollsdb"
```

For information on how these app settings are accessed in your code, see [Access environment variables](how-to-configure-python.md#access-environment-variables).

### Push to Azure from Git

[!INCLUDE [app-service-plan-no-h](../../../includes/app-service-web-git-push-to-azure-no-h.md)]

```bash 
Counting objects: 7, done.
Delta compression using up to 8 threads.
Compressing objects: 100% (7/7), done.
Writing objects: 100% (7/7), 775 bytes | 0 bytes/s, done.
Total 7 (delta 4), reused 0 (delta 0)
remote: Updating branch 'master'.
remote: Updating submodules.
remote: Preparing deployment for commit id '6520eeafcc'.
remote: Generating deployment script.
remote: Running deployment command...
remote: Python deployment.
remote: Kudu sync from: '/home/site/repository' to: '/home/site/wwwroot'
. 
. 
. 
remote: Deployment successful.
remote: App container will begin restart within 10 seconds.
To https://<app-name>.scm.azurewebsites.net/<app-name>.git 
   06b6df4..6520eea  master -> master
```  

The App Service deployment server sees _requirements.txt_ in the repository root and runs Python package management automatically after `git push`.

### Browse to the Azure app

Browse to the deployed app. It takes some time to start because the container needs to be downloaded and run when the app is requested for the first time. If the page times out or displays an error message, wait a few minutes and refresh the page.

```bash
http://<app-name>.azurewebsites.net
```

You should see the poll question that you created earlier. 

App Service detects a Django project in your repository by looking for a _wsgi.py_ in each subdirectory, which is created by `manage.py startproject` by default. When it finds the file, it loads the Django app. For more information on how App Service loads Python apps, see [Configure built-in Python image](how-to-configure-python.md).

Navigate to `<app-name>.azurewebsites.net` and sign in using same admin user you created. If you like, try creating some more poll questions.

![Python Django application running in locally](./media/tutorial-python-postgresql-app/django-admin-azure.png)

**Congratulations!** You're running a Python app in App Service for Linux.

## Stream diagnostic logs

[!INCLUDE [Access diagnostic logs](../../../includes/app-service-web-logs-access-no-h.md)]

## Manage your app in the Azure portal

Go to the [Azure portal](https://portal.azure.com) to see the app you created.

From the left menu, click **App Services**, then click the name of your Azure app.

![Portal navigation to Azure app](./media/tutorial-python-postgresql-app/app-resource.png)

By default, the portal shows your app's **Overview** page. This page gives you a view of how your app is doing. Here, you can also perform basic management tasks like browse, stop, start, restart, and delete. The tabs on the left side of the page show the different configuration pages you can open.

![App Service page in Azure portal](./media/tutorial-python-postgresql-app/app-mgmt.png)

[!INCLUDE [cli-samples-clean-up](../../../includes/cli-samples-clean-up.md)]

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a PostgreSQL database in Azure
> * Connect a Python app to PostgreSQL
> * Deploy the app to Azure
> * View diagnostic logs
> * Manage the app in the Azure portal

Advance to the next tutorial to learn how to map a custom DNS name to your app.

> [!div class="nextstepaction"]
> [Tutorial: Map custom DNS name to your app](../app-service-web-tutorial-custom-domain.md)

Or, check out other resources:

> [!div class="nextstepaction"]
> [Configure Python app](how-to-configure-python.md)
