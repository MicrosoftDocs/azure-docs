---
title: Build a Node.js and MongoDB web app in Azure | Microsoft Docs 
description: Learn how to get a Docker Python app working in Azure, with connection to a PostgreSQL database.
services: app-service\web
documentationcenter: python
author: berndverst
manager: jopapa
editor: ''

ms.assetid:
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: python
ms.topic: article
ms.date: 05/03/2017
ms.author: berndverst

---
# Build a Docker Python and PostgreSQL web app in Azure
This tutorial shows you how to create a Docker container based Python web app in Azure and connect it to a PostgreSQL database. When you are done, you will have a Python Flask application running within a Docker container on [Azure App Service Web Apps](app-service-web-overview.md).

![MEAN.js app running in Azure App Service](./media/app-service-web-tutorial-nodejs-mongodb-app/meanjs-in-azure.png)

## Before you begin

Before running this sample, install the following prerequisites locally:

1. [Download and install git](https://git-scm.com/)
1. [Download and install Python](https://www.python.org/downloads/)
1. [Download, install, and run PostgreSQL](https://www.postgresql.org/download/)
1. [Download and install Docker Community Edition](https://www.docker.com/community-edition)
1. [Download and install the Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli)

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Test local PostgreSQL installation and create a database
In this step, you make sure that your local PostgreSQL database is running.

Open the terminal window and run `psql postgres` to connect to your local PostgreSQL server.

```bash
psql postgres
```

If your connection is successful, then your PostgreSQL database is already running. If not, make sure that your local PostgresQL database is started by following the steps at [Download, install, and run PostgreSQL](https://www.postgresql.org/download/).

Create a database called `eventregistration` and set up a separate database user named `manager` with password `supersecretpass`.

```bash
postgres=> CREATE DATABASE eventregistration;
postgres=> CREATE USER manager WITH PASSWORD 'supersecretpass';
postgres=> GRANT ALL PRIVILEGES ON DATABASE eventregistration TO manager;
```
Type `\q` to exit the PostgreSQL client. 

<a name="step2"></a>

## Create local Python Flask application
In this step, you set up the local Python Flask project.

### Clone the sample application

Open the terminal window and `CD` to a working directory.  

Run the following commands to clone the sample repository and go to the `0.1-initialapp` release.

```bash
git clone https://github.com/Azure-Samples/docker-flask-postgres.gi
cd docker-flask-postgres
git checkout tags/0.1-initialapp
```

This sample repository contains a [Flask](http://http://flask.pocoo.org/) application. 

### Run the application

> [!NOTE] 
> We will in a later step simplify this process by building a Docker container to use with our production database.

Install the required packages and start the application.

Mac / Linux:
```bash
pip install virtualenv
virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
cd app
export FLASK_APP=app.py
export DBHOST="localhost";
export DBUSER="manager";
export DBNAME="eventregistration";
export DBPASS="supersecretpass";
flask db upgrade
flask run
```

Windows:
```bash
pip install virtualenv
virtualenv venv
venv\Scripts\activate.bat
pip install -r requirements.txt
cd app
set FLASK_APP=app.py
set DBHOST="localhost";
set DBUSER="manager";
set DBNAME="eventregistration";
set DBPASS="supersecretpass"
flask db upgrade
flask run
```

When the app is fully loaded, you should see something similar to the following message:

```
INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.
INFO  [alembic.runtime.migration] Will assume transactional DDL.
INFO  [alembic.runtime.migration] Running upgrade  -> 791cd7d80402, empty message
 * Serving Flask app "app"
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
```

Navigate to `http://localhost:5000` in a browser. Click **Register!** and try to create a dummy registration. 

The Flask sample application stores user data in the database. If you are successful and able to view your registration in the app, then your app is writing data to the local PostgreSQL database.

![MEAN.js connects successfully to MongoDB](./media/app-service-web-tutorial-nodejs-mongodb-app/mongodb-connect-success.png)


To stop the Flask server at anytime, type `Ctrl`+`C` in the terminal. 

## Create a production PostgreSQL database

In this step, you create a PostgreSQL database in Azure. When your app is deployed to Azure, we will specify this database for its production workload.

### Log in to Azure

You are now going to use the Azure CLI 2.0 in a terminal window to create the resources needed to host your Node.js application in Azure App Service.  Log in to your Azure subscription with the [az login](/cli/azure/#login) command and follow the on-screen directions. 

```azurecli 
az login 
``` 
   
### Create a resource group

Create a [resource group](../azure-resource-manager/resource-group-overview.md) with the [az group create](/cli/azure/group#create). An Azure resource group is a logical container into which Azure resources like web apps, databases, and storage accounts are deployed and managed. 

The following example creates a resource group in the West US region:

```azurecli
az group create --name myResourceGroup --location "West US"
```

To see what possible values you can use for `--location`, use the `az appservice list-locations` Azure CLI command.

### Create a PostgreSQL account

Create a PostgreSQL account with the [az postgres server create](/cli/azure/documentdb#create) command.

In the following command, substitute your own unique PostgreSQL name where you see the `<postgresql_name>` placeholder. This unique name will be used as the part of your PostgreSQL endpoint (`https://<postgresql_name>.documents.azure.com/`), so the name needs to be unique across all PostgreSQL accounts in Azure. 

```azurecli
az postgres server create --resource-group myResourceGroup --name <postgresql_name> --admin-user <my_admin_username>
```

The `--admin-user` is required to create the intial database admin user account. You will be prompted to pick a password for this user.

When the PostgreSQL account is created, the Azure CLI shows information similar to the following example:

```json
{
  "administratorLogin": "<my_admin_username>",
  "fullyQualifiedDomainName": "<postgresql_name>.database.windows.net",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.DBforPostgreSQL/servers/<postgresql_name>",
  "location": "westus",
  "name": "<postgresql_name>",
  "resourceGroup": "myResourceGroup",
  "sku": {
    "capacity": 100,
    "family": null,
    "name": "PGSQLS3M100",
    "size": null,
    "tier": "Basic"
  },
  "sslEnforcement": null,
  "storageMb": 2048,
  "tags": null,
  "type": "Microsoft.DBforPostgreSQL/servers",
  "userVisibleState": "Ready",
  "version": null
}
```

### Creating a firewall rule for the PostgreSQL database

Before we can access the database we must now allow it to be reached from all IP addresses. This can be done via the following Azure CLI command.

```azurecli
az postgres server firewall-rule create --resource-group myResourceGroup --server-name <postgresql_name> --start-ip-address=0.0.0.0 --end-ip-address=255.255.255.255 --name AllowAllIPs
```

When the firewall has been created, the Azure CLI confirms the rules presence as follows:

```json
{
  "endIpAddress": "255.255.255.255",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.DBforPostgreSQL/servers/<postgresql_name>/firewallRules/AllowAllIPs",
  "name": "AllowAllIPs",
  "resourceGroup": "myResourceGroup",
  "startIpAddress": "0.0.0.0",
  "type": "Microsoft.DBforPostgreSQL/servers/firewallRules"
}
```

## Connect your Python Flask application to the database

In this step, you connect your Python Flask sample application to the PostgreSQL database you just created.

### Creating an empty database and setting up a new database application user

Instead of giving our application full access to the server via our admin credentials, we will create a new database user with access to a single database only.

Connect to the database (you will be prompted for your admin password).
```bash
psql -h <postgresql_name>.database.windows.net -U <my_admin_username>@<postgresql_name> postgres
```

Then create the database and user from the PostgreSQL CLI.
```
postgres=> CREATE DATABASE eventregistration;
postgres=> CREATE USER manager WITH PASSWORD 'supersecretpass';
postgres=> GRANT ALL PRIVILEGES ON DATABASE eventregistration TO manager;
```

Type `\q` to exit the PostgreSQL client.

### Test the application in production mode 

Going back now to the `app` folder of the cloned Github repository, we can run our Python Flask application simply by replacing the values of database environment variables.

Linux / Mac
```bash
export DBHOST="<postgresql_name>.database.windows.net";
export DBUSER="manager@<postgresql_name>";
export DBNAME="eventregistration";
export DBPASS="supersecretpass";
flask db upgrade
flask run
```

Windows
```bash
set DBHOST="<postgresql_name>.database.windows.net";
set DBUSER="manager@<postgresql_name>";
set DBNAME="eventregistration";
set DBPASS="supersecretpass"
flask db upgrade
flask run
```

When the app is fully loaded, once again you should see something similar to the following message:

```
INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.
INFO  [alembic.runtime.migration] Will assume transactional DDL.
INFO  [alembic.runtime.migration] Running upgrade  -> 791cd7d80402, empty message
 * Serving Flask app "app"
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
```

Navigate to `http://localhost:5000` in a browser. Click **Register!** and try to create a dummy registration. You are now writing data to the production database in Azure.

### Running the application from a Docker Container

We will now build the Docker container image and locally run the application from within a Docker container while still connecting to the PostgreSQL production database in Azure.

```bash
cd ..
docker build -t flask-postgresql-sample .
```

Docker will display a confirmation that it successfully created the container.

```
Sending build context to Docker daemon 31.82 MB
Step 1/7 : FROM python:3.6.1
 ---> a0d32d529a0a
Step 2/7 : COPY requirements.txt /
 ---> 4562b61e3469
Step 3/7 : RUN pip install -r ./requirements.txt
 ---> 557b1cf333ee
Step 4/7 : COPY app/ /app/
 ---> a9468d5b11d4
Step 5/7 : WORKDIR /app
 ---> adeef3caf680
Step 6/7 : ENV FLASK_APP app.py
 ---> 7ffadd086cb4
Step 7/7 : CMD flask db upgrade && flask run -h 0.0.0.0 -p 5000
 ---> 7548f983a36b
Successfully built 7548f983a36b
```

We will now run the app from within the Docker container. We expose our Database environment variables to the Docker container and map the default Flask port 5000 to our local port 5000.

```bash
docker run -it --env DBHOST --env DBUSER --env DBPASS --env DBNAME -p 5000:5000 flask-postgresql-sample
```

Not surpringly, the output is similar as before. However, the initial database migration no longer needs to be performed and therefore is skipped.
```
INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.
INFO  [alembic.runtime.migration] Will assume transactional DDL.
 * Serving Flask app "app"
 * Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)
 ```

## Upload the Docker container to a container registry
In this step, you will upload the Docker container we created to a container registry. We will use Azure Container Registry, however, you could also use other popular ones such as Docker Hub.

### Create an Azure Container Registry

In the following command to create a container registry replace `<registry_name>` with a unique Azure container registry name of your choice.

```azurecli
az acr create --name <registry_name> --resource-group myResourceGroup --location "West US" --sku Basic
```

Output
```json
{
  "adminUserEnabled": false,
  "creationDate": "2017-05-04T08:50:55.635688+00:00",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/<registry_name>",
  "location": "westus",
  "loginServer": "<registry_name>.azurecr.io",
  "name": "<registry_name>",
  "provisioningState": "Succeeded",
  "sku": {
    "name": "Basic",
    "tier": "Basic"
  },
  "storageAccount": {
    "name": "<registry_name>01234"
  },
  "tags": {},
  "type": "Microsoft.ContainerRegistry/registries"
}
```

### Retrieve the registry credentials for pushing and pulling Docker images

We first must enable admin mode before we can access the credentials.

```azurecli
az acr update --name <registry_name> --admin-enabled true
az acr credential show -n <registry_name>
```

You will be shown two passwords. Make note of the username and the first password going forward.
```json
{
  "passwords": [
    {
      "name": "password",
      "value": "<registry_password>"
    },
    {
      "name": "password2",
      "value": "<registry_password2>"
    }
  ],
  "username": "<registry_name>"
}
```

### Upload your Docker container to Azure Container Registry

```bash
docker login <registry_name>.azurecr.io -u <registry_name> -p "<registry_password>"
docker tag flask-postgresql-sample <registry_name>.azurecr.io/flask-postgresql-sample
docker push <registry_name>.azurecr.io/flask-postgresql-sample
```

Output
```
The push refers to a repository [<registry_name>.azurecr.io/flask-postgresql-sample]
a6cd8251e07d: Pushed
c298b29e305f: Pushed
500d7cb0f165: Pushed
ade6994ee59e: Pushed
9762e6b181bb: Pushed
a7f774767e3f: Pushed
eda5b29538df: Pushed
d359ab38b013: Pushed
682e7cee9d37: Pushed
295d6a056bfd: Pushed
latest: digest: sha256:539bcaec8d7799c355eff99e91e6164290277ccd82c85900dde7b63c040c82a8 size: 2423
```

## Deploy the Docker Python Flask application to Azure
In this step, you deploy your Docker container-based Python Flask application to Azure App Service.

### Create an App Service plan

Create an App Service plan with the [az appservice plan create](/cli/azure/appservice/plan#create) command. 

> [!NOTE] 
> An App Service plan represents the collection of physical resources used to host your apps. All applications assigned to an App Service plan share the resources defined by it allowing you to save cost when hosting multiple apps. 
> 
> App Service plans define: 
> 
> * Region (North Europe, East US, Southeast Asia, etc) 
> * Instance Size (Small, Medium, Large) 
> * Scale Count (one, two, or three instances, etc.) 
> * SKU (Free, Shared, Basic, Standard, Premium) 
> 

The following example creates a Linux-based App Service plan named `myAppServicePlan` using the S1 pricing tier:

```azurecli
az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku S1 --is-linux
```

When the App Service plan is created, the Azure CLI shows information similar to the following example:

```json 
{
  "adminSiteName": null,
  "appServicePlanName": "myAppServicePlan",
  "geoRegion": "West US",
  "hostingEnvironmentProfile": null,
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Web/serverfarms/myAppServicePlan", 
  "kind": "linux",
  "location": "West US",
  "maximumNumberOfWorkers": 10,
  "name": "myAppServicePlan",
  "numberOfSites": 0,
  "perSiteScaling": false,
  "provisioningState": "Succeeded",
  "reserved": true,
  "resourceGroup": "myResourceGroup",
  "sku": {
    "capabilities": null,
    "capacity": 1,
    "family": "S",
    "locations": null,
    "name": "S1",
    "size": "S1",
    "skuCapacity": null,
    "tier": "Standard"
  },
  "status": "Ready",
  "subscription": "00000000-0000-0000-0000-000000000000",
  "tags": null,
  "targetWorkerCount": 0,
  "targetWorkerSizeId": 0,
  "type": "Microsoft.Web/serverfarms",
  "workerTierName": null
}
``` 

### Create a web app

Now that an App Service plan has been created, create a web app within the `myAppServicePlan` App Service plan. The web app gives you a hosting space to deploy your code and provides a URL for you to view the deployed application. Use the [az appservice web create](/cli/azure/appservice/web#create) command to create the web app. 

In the following command, substitute `<app_name>` placeholder with your own unique app name. This unique name will be used as the part of the default domain name for the web app, so the name needs to be unique across all apps in Azure. You can later map any custom DNS entry to the web app before you expose it to your users. 

```azurecli
az appservice web create --name <app_name> --resource-group myResourceGroup --plan myAppServicePlan
```

When the web app has been created, the Azure CLI shows information similar to the following example: 

```json 
{ 
    "clientAffinityEnabled": true, 
    "defaultHostName": "<app_name>.azurewebsites.net", 
    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Web/sites/<app_name>", 
    "isDefaultContainer": null, 
    "kind": "app", 
    "location": "West Europe", 
    "name": "<app_name>", 
    "repositorySiteName": "<app_name>", 
    "reserved": true, 
    "resourceGroup": "myResourceGroup", 
    "serverFarmId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Web/serverfarms/myAppServicePlan", 
    "state": "Running", 
    "type": "Microsoft.Web/sites", 
} 
```

### Configure the database environment variables

Earlier in the tutorial, you manually defined environment variables to connect to our PostgreSQL database.

In App Service, you set environment variables as _app settings_ by using the [az appservice web config appsettings update](/cli/azure/appservice/web/config/appsettings#update) command. 

The following lets you specify the database connection details as app settings. We additionally use the `PORT` variable to specify that we want to map PORT 5000 from our Docker Container to receive HTTP traffic on PORT 80.

```azurecli
az appservice web config appsettings update --name <app_name> --resource-group myResourceGroup --settings DBHOST="<postgresql_name>.database.windows.net" DBUSER="manager@<postgresql_name>" DBPASS="supersecretpass" DBNAME="eventregistration" PORT=5000
```

### Configure Docker container deployment 

AppService can automatically download and run a Docker container.

Use the [az appservice web deployment user set](/cli/azure/appservice/web/deployment/user#set) command to create your account-level credentials. 

```azurecli
az appservice web config container update --resource-group myResourceGroup --name <app_name> --docker-registry-server-user "<registry_name>" --docker-registry-server-password "<registry_password>" --docker-custom-image-name "<registry_name>.azurecr.io/flask-postgresql-sample" --docker-registry-server-url "https://<registry_name>.azurecr.io"
```

Whenever we update the Docker container or change the above settings, restart the app to ensure all settings are applied and the latest container is pulled from the registry.

```azurecli
az appservice web restart --resource-group myResourceGroup --name <app_name>
```

### Browse to the Azure web app 
Browse to the deployed web app using your web browser. 

```bash 
http://<app_name>.azurewebsites.net 
```
> [!NOTE]
> The very first time you access your web app since making a change to the container configuration please allow for additional time for the container to be downloaded and started.

Click **Register!** and try to create a dummy user. You will see previously registered users that were saved in the Azure production database.

![MEAN.js app running in Azure App Service](./media/app-service-web-tutorial-nodejs-mongodb-app/meanjs-in-azure.png)

**Congratulations!** You're running a Docker container-based Python Flask app in Azure App Service.


## Update data model and redeploy

In this step, we add the number of attendees to each event registration by updating the Guest model.

Check out the `0.2-migration` release with the following git command.
```bash
git checkout tags/0.2-migration
```

This release already made the necessary changes to views, controllers and our model. It also includes a database migration generated via *alembic* (`flask db migrate`). You can see all changes made via the following git command.

```bash
git diff 0.1-initialapp 0.2-migration
```

### Test your changes locally

Run the following commands to test your changes locally by running the flask server.

Mac / Linux:
```bash
source venv/bin/activate
cd app
export FLASK_APP=app.py
export DBHOST="localhost";
export DBUSER="manager";
export DBNAME="eventregistration";
export DBPASS="supersecretpass";
flask db upgrade
flask run
```

Windows:
```bash
venv\Scripts\activate.bat
cd app
set FLASK_APP=app.py
set DBHOST="localhost";
set DBUSER="manager";
set DBNAME="eventregistration";
set DBPASS="supersecretpass"
flask db upgrade
flask run
```

Navigate to `http://127.0.0.1:5000` in your browser to view the changes.

### Publish changes to Azure

Build the new docker image, push it to the container registry, and restart the app.

```bash
docker build -t flask-postgresql-sample .
docker tag flask-postgresql-sample <registry_name>.azurecr.io/flask-postgresql-sample
docker push <registry_name>.azurecr.io/flask-postgresql-sample
az appservice web restart --resource-group myResourceGroup --name <app_name>
```

Navigate to your Azure web app and try out the new functionality again.

```bash 
http://<app_name>.azurewebsites.net 
```

## Manage your Azure web app

Go to the Azure portal to see the web app you created.

To do this, sign in to [https://portal.azure.com](https://portal.azure.com).

From the left menu, click **App Service**, then click the name of your Azure web app.

![Portal navigation to Azure web app](./media/app-service-web-tutorial-nodejs-mongodb-app/access-portal.png)

You have landed in your web app's _blade_ (a portal page that opens horizontally).

By default, your web app's blade shows the **Overview** page. This page gives you a view of how your app is doing. Here, you can also perform basic management tasks like browse, stop, start, restart, and delete. The tabs on the left side of the blade show the different configuration pages you can open.

![App Service blade in Azure portal](./media/app-service-web-tutorial-nodejs-mongodb-app/web-app-blade.png)

These tabs in the blade show the many great features you can add to your web app. The following list gives you just a few of the possibilities:

* Map a custom DNS name
* Bind a custom SSL certificate
* Configure continuous deployment
* Scale up and out
* Add user authentication

## More resources
