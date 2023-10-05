---
title: 'Tutorial: Deploy a Python Django or Flask web app with PostgreSQL'
description: Create a Python Django or Flask web app with a PostgreSQL database and deploy it to Azure. The tutorial uses either the Django or Flask framework and the app is hosted on Azure App Service on Linux.
ms.devlang: python
ms.topic: tutorial
ms.date: 09/08/2023
ms.author: msangapu
author: msangapu-msft
ms.custom: mvc, seodec18, seo-python-october2019, cli-validate, devx-track-python, devdivchpfy22, event-tier1-build-2022, vscode-azure-extension-update-completed, AppServiceConnectivity
zone_pivot_groups: app-service-portal-azd
---

# Deploy a Python (Django or Flask) web app with PostgreSQL in Azure


::: zone pivot="azure-portal"  
In this tutorial, you'll deploy a data-driven Python web app (**[Django](https://www.djangoproject.com/)** or **[Flask](https://flask.palletsprojects.com/)**) to **[Azure App Service](./overview.md#app-service-on-linux)** with the **[Azure Database for PostgreSQL](../postgresql/index.yml)** relational database service. Azure App Service supports [Python](https://www.python.org/downloads/) in a Linux server environment.

:::image type="content" border="False" source="./media/tutorial-python-postgresql-app/python-postgresql-app-architecture-240px.png" lightbox="./media/tutorial-python-postgresql-app/python-postgresql-app-architecture.png" alt-text="An architecture diagram showing an App Service with a PostgreSQL database in Azure.":::

**To complete this tutorial, you'll need:**

* An Azure account with an active subscription. If you don't have an Azure account, you [can create one for free](https://azure.microsoft.com/free/python).
* Knowledge of Python with Flask development or [Python with Django development](/training/paths/django-create-data-driven-websites/)

## Sample application

Sample Python applications using the Flask and Django framework are provided to help you follow along with this tutorial. To deploy them without running them locally, skip this part. 

To run the application locally, make sure you have [Python 3.7 or higher](https://www.python.org/downloads/) and [PostgreSQL](https://www.postgresql.org/download/) installed locally. Then, download or clone the app and go to the application folder:

### [Flask](#tab/flask)

```bash
git clone git clone https://github.com/Azure-Samples/msdocs-flask-postgresql-sample-app
cd msdocs-flask-postgresql-sample-app
```

### [Django](#tab/django)

```bash
git clone https://github.com/Azure-Samples/msdocs-django-postgresql-sample-app.git
cd msdocs-django-postgresql-sample-app
```

-----

Create an *.env* file as shown below using the *.env.sample* file as a guide. Set the value of `DBNAME` to the name of an existing database in your local PostgreSQL instance. Set the values of `DBHOST`, `DBUSER`, and `DBPASS` as appropriate for your local PostgreSQL instance.

```
DBNAME=<database name>
DBHOST=<database-hostname>
DBUSER=<db-user-name>
DBPASS=<db-password>
```

Create a SECRET_KEY value for your app by running the following command at a terminal prompt: `python -c 'import secrets; print(secrets.token_hex())'`.

Set the returned value as the value of `SECRET_KEY` in the .env file.

```
SECRET_KEY=<secret-key>
```

Create a virtual environment for the app:

[!INCLUDE [Virtual environment setup](<./includes/quickstart-python/virtual-environment-setup.md>)]

Install the dependencies:

```bash
pip install -r requirements.txt
```

Run the sample application with the following commands:

### [Flask](#tab/flask)

```bash
# Run database migration
flask db upgrade
# Run the app at http://127.0.0.1:5000
flask run
```

### [Django](#tab/django)

```bash
# Run database migration
python manage.py migrate
# Run the app at http://127.0.0.1:8000
python manage.py runserver
```

-----

## 1. Create App Service and PostgreSQL


### [Flask](#tab/flask)

```bash
git clone https://github.com/Azure-Samples/msdocs-flask-postgresql-sample-app.git
```

### [Django](#tab/django)

```bash
git clone https://github.com/Azure-Samples/msdocs-django-postgresql-sample-app.git
```

-----


In this step, you create the Azure resources. The steps used in this tutorial create a set of secure-by-default resources that include App Service and Azure Database for PostgreSQL. For the creation process, you'll specify:

* The **Name** for the web app. It's the name used as part of the DNS name for your webapp in the form of `https://<app-name>.azurewebsites.net`.
* The **Region** to run the app physically in the world.
* The **Runtime stack** for the app. It's where you select the version of Python to use for your app.
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
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-create-app-postgres-1.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find the Web App + Database creation wizard." lightbox="./media/tutorial-python-postgresql-app/azure-portal-create-app-postgres-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the **Create Web App + Database** page, fill out the form as follows.
        1. *Resource Group* &rarr; Select **Create new** and use a name of **msdocs-python-postgres-tutorial**.
        1. *Region* &rarr; Any Azure region near you.
        1. *Name* &rarr; **msdocs-python-postgres-XYZ** where *XYZ* is any three random characters. This name must be unique across Azure.
        1. *Runtime stack* &rarr; **Python 3.10**.
        1. *Database* &rarr;  **PostgreSQL - Flexible Server** is selected by default as the database engine. The server name and database name are also set by default to appropriate values.
        1. *Hosting plan* &rarr; **Basic**. When you're ready, you can [scale up](manage-scale-up.md) to a production pricing tier later.
        1. Select **Review + create**.
        1. After validation completes, select **Create**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-create-app-postgres-2.png" alt-text="A screenshot showing how to configure a new app and database in the Web App + Database wizard." lightbox="./media/tutorial-python-postgresql-app/azure-portal-create-app-postgres-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** The deployment takes a few minutes to complete. Once deployment completes, select the **Go to resource** button. You're taken directly to the App Service app, but the following resources are created:
        - **Resource group** &rarr; The container for all the created resources.
        - **App Service plan** &rarr; Defines the compute resources for App Service. A Linux plan in the *Basic* tier is created.
        - **App Service** &rarr; Represents your app and runs in the App Service plan.
        - **Virtual network** &rarr; Integrated with the App Service app and isolates back-end network traffic.
        - **Azure Database for PostgreSQL flexible server** &rarr; Accessible only from within the virtual network. A database and a user are created for you on the server.
        - **Private DNS zone** &rarr; Enables DNS resolution of the PostgreSQL server in the virtual network.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-create-app-postgres-3.png" alt-text="A screenshot showing the deployment process completed." lightbox="./media/tutorial-python-postgresql-app/azure-portal-create-app-postgres-3.png":::
    :::column-end:::
:::row-end:::

## 2. Verify connection settings

The creation wizard generated the connectivity variables for you already as [app settings](configure-common.md#configure-app-settings). App settings are one way to keep connection secrets out of your code repository. When you're ready to move your secrets to a more secure location, here's an [article on storing in Azure Key Vault](../key-vault/certificates/quick-create-python.md).

:::row:::
    :::column span="2":::
        **Step 1:** In the App Service page, in the left menu, select Configuration.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-get-connection-string-1.png" alt-text="A screenshot showing how to open the configuration page in App Service." lightbox="./media/tutorial-python-postgresql-app/azure-portal-get-connection-string-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the **Application settings** tab of the **Configuration** page, verify that `AZURE_POSTGRESQL_CONNECTIONSTRING` is present. That will be injected into the runtime environment as an environment variable.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-get-connection-string-2.png" alt-text="A screenshot showing how to see the autogenerated connection string." lightbox="./media/tutorial-python-postgresql-app/azure-portal-get-connection-string-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** In a terminal or command prompt, run the following Python script to generate a unique secret: `python -c 'import secrets; print(secrets.token_hex())'`. Copy the output value to use in the next step.
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4:** In the **Application settings** tab of the **Configuration** page, select **New application setting**. Name the setting `SECRET_KEY`. Paste the value from the previous value. Select **OK**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-app-service-app-setting.png" alt-text="A screenshot showing how to set the SECRET_KEY app setting in the Azure portal." lightbox="./media/tutorial-python-postgresql-app/azure-portal-app-service-app-setting.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 5:** Select **Save**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-app-service-app-setting-save.png" alt-text="A screenshot showing how to save the SECRET_KEY app setting in the Azure portal." lightbox="./media/tutorial-python-postgresql-app/azure-portal-app-service-app-setting-save.png":::
    :::column-end:::
:::row-end:::


Having issues? Check the [Troubleshooting guide](configure-language-python.md#troubleshooting).


## 3. Deploy sample code

In this step, you'll configure GitHub deployment using GitHub Actions. It's just one of many ways to deploy to App Service, but also a great way to have continuous integration in your deployment process. By default, every `git push` to your GitHub repository will kick off the build and deploy action.

### [Flask](#tab/flask)

:::row:::
    :::column span="2":::
        **Step 1:** In a new browser window:
        1. Sign in to your GitHub account.
        1. Navigate to [https://github.com/Azure-Samples/msdocs-flask-postgresql-sample-app](https://github.com/Azure-Samples/msdocs-flask-postgresql-sample-app).
        1. Select **Fork**.
        1. Select **Create fork**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-deploy-sample-code-flask-1.png" alt-text="A screenshot showing how to create a fork of the sample GitHub repository (Flask)." lightbox="./media/tutorial-python-postgresql-app/azure-portal-deploy-sample-code-flask-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the GitHub page, open Visual Studio Code in the browser by pressing the `.` key.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-deploy-sample-code-flask-2.png" alt-text="A screenshot showing how to open the Visual Studio Code browser experience in GitHub (Flask)." lightbox="./media/tutorial-python-postgresql-app/azure-portal-deploy-sample-code-flask-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** In Visual Studio Code in the browser, open *azureproject/production.py* in the explorer.
        See the environment variables being used in the production environment, including the app settings that you saw in the configuration page.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-deploy-sample-code-flask-3.png" alt-text="A screenshot showing Visual Studio Code in the browser and an opened file (Flask)." lightbox="./media/tutorial-python-postgresql-app/azure-portal-deploy-sample-code-flask-3.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4:** Back in the App Service page, in the left menu, select **Deployment Center**. 
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-deploy-sample-code-flask-4.png" alt-text="A screenshot showing how to open the deployment center in App Service (Flask)." lightbox="./media/tutorial-python-postgresql-app/azure-portal-deploy-sample-code-flask-4.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 5:** In the Deployment Center page:
        1. In **Source**, select **GitHub**. By default, **GitHub Actions** is selected as the build provider.        
        1. Sign in to your GitHub account and follow the prompt to authorize Azure.
        1. In **Organization**, select your account.
        1. In **Repository**, select **msdocs-flask-postgresql-sample-app**.
        1. In **Branch**, select **main**.
        1. Keep the default option selected to **Add a workflow**.
        1. In the top menu, select **Save**. App Service commits a workflow file into the chosen GitHub repository, in the `.github/workflows` directory.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-deploy-sample-code-flask-5.png" alt-text="A screenshot showing how to configure CI/CD using GitHub Actions (Flask)." lightbox="./media/tutorial-python-postgresql-app/azure-portal-deploy-sample-code-flask-5.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 6:** In the Deployment Center page:
        1. Select **Logs**. A deployment run is already started.
        1. In the log item for the deployment run, select **Build/Deploy Logs**. 
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-deploy-sample-code-flask-6.png" alt-text="A screenshot showing how to open deployment logs in the deployment center (Flask)." lightbox="./media/tutorial-python-postgresql-app/azure-portal-deploy-sample-code-flask-6.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 7:** You're taken to your GitHub repository and see that the GitHub action is running. The workflow file defines two separate stages, build and deploy. Wait for the GitHub run to show a status of **Complete**. It takes about 5 minutes.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-deploy-sample-code-flask-7.png" alt-text="A screenshot showing a GitHub run in progress (Flask)." lightbox="./media/tutorial-python-postgresql-app/azure-portal-deploy-sample-code-flask-7.png":::
    :::column-end:::
:::row-end:::

### [Django](#tab/django)

:::row:::
    :::column span="2":::
        **Step 1:** In a new browser window:
        1. Sign in to your GitHub account.
        1. Navigate to [https://github.com/Azure-Samples/msdocs-django-postgresql-sample-app](https://github.com/Azure-Samples/msdocs-django-postgresql-sample-app).
        1. Select **Fork**.
        1. Select **Create fork**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-deploy-sample-code-django-1.png" alt-text="A screenshot showing how to create a fork of the sample GitHub repository (Django)." lightbox="./media/tutorial-python-postgresql-app/azure-portal-deploy-sample-code-django-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the GitHub page, open Visual Studio Code in the browser by pressing the `.` key.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-deploy-sample-code-django-2.png" alt-text="A screenshot showing how to open the Visual Studio Code browser experience in GitHub (Django)." lightbox="./media/tutorial-python-postgresql-app/azure-portal-deploy-sample-code-django-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** In Visual Studio Code in the browser, open *azureproject/production.py* in the explorer.
        See the environment variables being used in the production environment, including the app settings that you saw in the configuration page.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-deploy-sample-code-django-3.png" alt-text="A screenshot showing Visual Studio Code in the browser and an opened file (Django)." lightbox="./media/tutorial-python-postgresql-app/azure-portal-deploy-sample-code-django-3.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4:** Back in the App Service page, in the left menu, select **Deployment Center**. 
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-deploy-sample-code-django-4.png" alt-text="A screenshot showing how to open the deployment center in App Service (Django)." lightbox="./media/tutorial-python-postgresql-app/azure-portal-deploy-sample-code-django-4.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 5:** In the Deployment Center page:
        1. In **Source**, select **GitHub**. By default, **GitHub Actions** is selected as the build provider.        
        1. Sign in to your GitHub account and follow the prompt to authorize Azure.
        1. In **Organization**, select your account.
        1. In **Repository**, select **msdocs-django-postgresql-sample-app**.
        1. In **Branch**, select **main**.
        1. In the top menu, select **Save**. App Service commits a workflow file into the chosen GitHub repository, in the `.github/workflows` directory.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-deploy-sample-code-django-5.png" alt-text="A screenshot showing how to configure CI/CD using GitHub Actions (Django)." lightbox="./media/tutorial-python-postgresql-app/azure-portal-deploy-sample-code-django-5.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 6:** In the Deployment Center page:
        1. Select **Logs**. A deployment run is already started.
        1. In the log item for the deployment run, select **Build/Deploy Logs**. 
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-deploy-sample-code-django-6.png" alt-text="A screenshot showing how to open deployment logs in the deployment center (Django)." lightbox="./media/tutorial-python-postgresql-app/azure-portal-deploy-sample-code-django-6.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 7:** You're taken to your GitHub repository and see that the GitHub action is running. The workflow file defines two separate stages, build and deploy. Wait for the GitHub run to show a status of **Complete**. It takes about 5 minutes.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-deploy-sample-code-django-7.png" alt-text="A screenshot showing a GitHub run in progress (Django)." lightbox="./media/tutorial-python-postgresql-app/azure-portal-deploy-sample-code-django-7.png":::
    :::column-end:::
:::row-end:::

-----

Having issues? Check the [Troubleshooting guide](configure-language-python.md#troubleshooting).


## 4. Generate database schema

### [Flask](#tab/flask)

With the PostgreSQL database protected by the virtual network, the easiest way to run [Flask database migrations](https://flask-migrate.readthedocs.io/en/latest/) is in an SSH session with the App Service container. 

:::row:::
    :::column span="2":::
        **Step 1:** Back in the App Service page, in the left menu, select **SSH**. 
        1. Select **Go**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-generate-db-schema-flask-1.png" alt-text="A screenshot showing how to open the SSH shell for your app from the Azure portal (Flask)." lightbox="./media/tutorial-python-postgresql-app/azure-portal-generate-db-schema-flask-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the SSH terminal, run `flask db upgrade`. If it succeeds, App Service is [connecting successfully to the database](#i-get-an-error-when-running-database-migrations).
        Only changes to files in `/home` can persist beyond app restarts. Changes outside of `/home` aren't persisted.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-generate-db-schema-flask-2.png" alt-text="A screenshot showing the commands to run in the SSH shell and their output (Flask)." lightbox="./media/tutorial-python-postgresql-app/azure-portal-generate-db-schema-flask-2.png":::
    :::column-end:::
:::row-end:::

### [Django](#tab/django)

With the PostgreSQL database protected by the virtual network, the easiest way to run [Django database migrations](https://docs.djangoproject.com/en/4.1/topics/migrations/) is in an SSH session with the App Service container. 

:::row:::
    :::column span="2":::
        **Step 1:** Back in the App Service page, in the left menu, select **SSH**. 
        1. Select **Go**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-generate-db-schema-django-1.png" alt-text="A screenshot showing how to open the SSH shell for your app from the Azure portal (Django)." lightbox="./media/tutorial-python-postgresql-app/azure-portal-generate-db-schema-django-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the SSH terminal, run `python manage.py migrate`. If it succeeds, App Service is [connecting successfully to the database](#i-get-an-error-when-running-database-migrations).
        Only changes to files in `/home` can persist beyond app restarts. Changes outside of `/home` aren't persisted.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-generate-db-schema-django-2.png" alt-text="A screenshot showing the commands to run in the SSH shell and their output (Django)." lightbox="./media/tutorial-python-postgresql-app/azure-portal-generate-db-schema-django-2.png":::
    :::column-end:::
:::row-end:::

> [!TIP]
> In an SSH session, for Django you can also create users with the `python manage.py createsuperuser` command like you would with a typical Django app. For more information, see the documentation for [django django-admin and manage.py](https://docs.djangoproject.com/en/1.8/ref/django-admin/). Use the superuser account to access the `/admin` portion of the web site. For Flask, use an extension such as [Flask-admin](https://github.com/flask-admin/flask-admin) to provide the same functionality.

-----

## 5. Browse to the app

:::row:::
    :::column span="2":::
        **Step 1:** In the App Service page:
        1. From the left menu, select **Overview**.
        1. Select the URL of your app. You can also navigate directly to `https://<app-name>.azurewebsites.net`.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-browse-app-1.png" alt-text="A screenshot showing how to launch an App Service from the Azure portal." lightbox="./media/tutorial-python-postgresql-app/azure-portal-browse-app-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** Add a few restaurants to the list.
        Congratulations, you're running a web app in Azure App Service, with secure connectivity to Azure Database for PostgreSQL.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-browse-app-2.png" alt-text="A screenshot of the Flask web app with PostgreSQL running in Azure showing restaurants and restaurant reviews." lightbox="./media/tutorial-python-postgresql-app/azure-portal-browse-app-2.png":::
    :::column-end:::
:::row-end:::

## 6. Stream diagnostic logs

Azure App Service captures all messages output to the console to help you diagnose issues with your application. The sample app includes `print()` statements to demonstrate this capability as shown below.

### [Flask](#tab/flask)

:::code language="python" source="~/msdocs-flask-postgresql-sample-app/app.py" range="37-41" highlight="3":::

### [Django](#tab/django)

:::code language="python" source="~/msdocs-django-postgresql-sample-app/restaurant_review/views.py" range="12-16" highlight="2":::

-----

:::row:::
    :::column span="2":::
        **Step 1:** In the App Service page:
        1. From the left menu, select **App Service logs**.
        1. Under **Application logging**, select **File System**.
        1. In the top menu, select **Save**. 
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-stream-diagnostic-logs-1.png" alt-text="A screenshot showing how to enable native logs in App Service in the Azure portal." lightbox="./media/tutorial-python-postgresql-app/azure-portal-stream-diagnostic-logs-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** From the left menu, select **Log stream**. You see the logs for your app, including platform logs and logs from inside the container.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-stream-diagnostic-logs-2.png" alt-text="A screenshot showing how to view the log stream in the Azure portal." lightbox="./media/tutorial-python-postgresql-app/azure-portal-stream-diagnostic-logs-2.png":::
    :::column-end:::
:::row-end:::

Learn more about logging in Python apps in the series on [setting up Azure Monitor for your Python application](/azure/azure-monitor/app/opencensus-python).

## 7. Clean up resources

When you're finished, you can delete all of the resources from your Azure subscription by deleting the resource group.

:::row:::
    :::column span="2":::
        **Step 1:** In the search bar at the top of the Azure portal:
        1. Enter the resource group name.
        1. Select the resource group.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-clean-up-resources-1.png" alt-text="A screenshot showing how to search for and navigate to a resource group in the Azure portal." lightbox="./media/tutorial-python-postgresql-app/azure-portal-clean-up-resources-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the resource group page, select **Delete resource group**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-clean-up-resources-2.png" alt-text="A screenshot showing the location of the Delete Resource Group button in the Azure portal." lightbox="./media/tutorial-python-postgresql-app/azure-portal-clean-up-resources-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** 
        1. Enter the resource group name to confirm your deletion.
        1. Select **Delete**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-clean-up-resources-3.png" alt-text="A screenshot of the confirmation dialog for deleting a resource group in the Azure portal." lightbox="./media/tutorial-python-postgresql-app/azure-portal-clean-up-resources-3.png"::::
    :::column-end:::
:::row-end:::
::: zone-end

::: zone pivot="azure-developer-cli"
In this tutorial, you'll deploy a data-driven Python web app (**[Django](https://www.djangoproject.com/)** or **[Flask](https://flask.palletsprojects.com/)**) to **[Azure App Service](./overview.md#app-service-on-linux)** with the **[Azure Database for PostgreSQL](../postgresql/index.yml)** relational database service. Azure App Service supports [Python](https://www.python.org/downloads/) in a Linux server environment.

:::image type="content" border="False" source="./media/tutorial-python-postgresql-app/python-postgresql-app-architecture-240px.png" lightbox="./media/tutorial-python-postgresql-app/python-postgresql-app-architecture.png" alt-text="An architecture diagram showing an App Service with a PostgreSQL database in Azure.":::

**To complete this tutorial, you'll need:**

* An Azure account with an active subscription. If you don't have an Azure account, you [can create one for free](https://azure.microsoft.com/free/python).
* [Git](https://git-scm.com/downloads) installed locally.
* [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd) installed locally.
* Knowledge of Python with Flask development or [Python with Django development](/training/paths/django-create-data-driven-websites/).

> [!NOTE]
> If you want, you can follow the steps using the [Azure Cloud Shell](https://shell.azure.com). It has all the necessary tools to run the steps in this tutorial. 

## Sample application

Sample Python applications using the Flask and Django framework are provided to help you follow along with this tutorial. To deploy them without running them locally, skip this part. 

> [!NOTE]
> To run the sample application locally, you need [Python 3.7 or higher](https://www.python.org/downloads/) and [PostgreSQL](https://www.postgresql.org/download/) installed locally.

Download the sample repository and change to the sample directory.

```bash
git clone https://github.com/Azure-Samples/msdocs-flask-postgresql-sample-app
cd msdocs-flask-postgresql-sample-app
```

Create an *.env* file as shown below using the *.env.sample* file as a guide. Set the values of `DBNAME`, `DBHOST`, `DBUSER`, and `DBPASS` as appropriate for your local PostgreSQL instance.

```
DBNAME=<database name>
DBHOST=<database-hostname>
DBUSER=<db-user-name>
DBPASS=<db-password>
```

Create a virtual environment for the app.

[!INCLUDE [Virtual environment setup](<./includes/quickstart-python/virtual-environment-setup.md>)]

Run the sample.

```bash
# Install dependencies
pip install -r requirements.txt
# Run database migrations
flask db upgrade
# Run the app at http://127.0.0.1:5000
flask run
```

## 1. Create Azure resources and deploy a sample app

In this step, you create the Azure resources and deploy a sample app to App Service on Linux. The steps used in this tutorial create a set of secure-by-default resources that include App Service and Azure Database for PostgreSQL.

1. If you haven't already, clone the sample application locally and checkout the branch `merged-projects`. `merged-projects` branch isn't needed for production.

    ```bash
    git clone https://github.com/Azure-Samples/msdocs-flask-postgresql-sample-app
    git checkout merged-projects //development only
    ```

1. From the repository root of the sample application, run `azd init`.

    ```bash
    azd init --template https://github.com/cephalin/msdocs-python-postgresql-infra
    ```
    This azd template contains files (*azure.yaml* and the *infra* directory) that will generate a secure-by-default architecture with the following Azure resources:

    - **Resource group** &rarr; The container for all the created resources.
    - **App Service plan** &rarr; Defines the compute resources for App Service. A Linux plan in the *B1* tier is specified.
    - **App Service** &rarr; Represents your app and runs in the App Service plan.
    - **Virtual network** &rarr; Integrated with the App Service app and isolates back-end network traffic.
    - **Azure Database for PostgreSQL flexible server** &rarr; Accessible only from within the virtual network. A database and a user are created for you on the server.
    - **Private DNS zone** &rarr; Enables DNS resolution of the PostgreSQL server in the virtual network.
    - **Log Analytics workspace** &rarr; Acts as the target container for your app to ship its logs, where you can also query the logs.

1. When prompted, give the following answers:
    
    |Question  |Answer  |
    |---------|---------|
    |The current directory is not empty. Would you like to initialize a project here in '\<your-directory>'?     | **Y**        |
    |What would you like to do with these files?     | **Keep my existing files unchanged**        |
    |Enter a new environment name     | Type a unique name. The azd template uses this name as part of the DNS name of your web app in Azure (`<app-name>.azurewebsites.net`). Alphanumeric characters and hyphens are allowed.          |

1. Run the `azd up` command to provision the necessary Azure resources and deploy the app code. If you are not already signed-in to Azure, the browser will launch and ask you to sign-in. The `azd up` command will also prompt you to select the desired subscription and location to deploy to. 

    ```bash
    azd up
    ```  

    The `azd up` command might take a few minutes to complete. It also compiles and deploys your application code, but you'll modify your code later to work with App Service. While it's running, the command provides messages about the provisioning and deployment process, including a link to the deployment in Azure. When it finishes, the command also displays a link to the deploy application.
    
    After you provide these values, the `azd up` command:
    
    - Creates and configures all necessary Azure resources (`azd provision`), including:
      - Access policies and roles for your account
      - Service-to-service communication with Managed Identities
    - Packages and deploys the code (`azd deploy`)

## 2. Use the database connection string

The azd template generated the connectivity variables for you already as [app settings](configure-common.md#configure-app-settings). App settings are one way to keep connection secrets out of your code repository.

In the success output, look for the app settings and find the `AZURE_POSTGRESQL_CONNECTIONSTRING`. This app settings contains the connection string to the Postgres database. 

The following text shows an example of the app settings in the output:
<pre>
...
Executing postprovision hook => /tmp/azd-postprovision-3312473031.sh

App Service app has the following settings:

        - AZURE_POSTGRESQL_CONNECTIONSTRING
        - FLASK_DEBUG
        - SCM_DO_BUILD_DURING_DEPLOYMENT
        - SECRET_KEY
< Output removed for brevity. >
</pre>

1. Open *azureproject/production.py*, uncomment the following lines, and save the file:

    ```python
    conn_str = os.environ['AZURE_POSTGRESQL_CONNECTIONSTRING']
    conn_str_params = {pair.split('=')[0]: pair.split('=')[1] for pair in conn_str.split(' ')}
    
    DATABASE_URI = 'postgresql+psycopg2://{dbuser}:{dbpass}@{dbhost}/{dbname}'.format(
        dbuser=conn_str_params['user'],
        dbpass=conn_str_params['password'],
        dbhost=conn_str_params['host'],
        dbname=conn_str_params['dbname']
    )
    ```

    Your application code is now configured to connect to the PostgreSQL database in Azure. If you want, open `app.py` and see how the `DATABASE_URI` environment variable is used.

2. In the terminal, run `azd deploy`
 
    ```bash
    azd deploy
    ```

## 4. Generate database schema

In the output, find the link to SSH to the App Service container. Select the SSH link.

The following text shows an example of the link to SSH to the App Service container:

<pre>
Open SSH session to App Service container at: https://test11-r5ez3q26g3zia-app-service.scm.azurewebsites.net/webssh/host
</pre>

With the PostgreSQL database protected by the virtual network, the easiest way to run [Flask database migrations](https://flask-migrate.readthedocs.io/en/latest/) is in an SSH session with the App Service container. 

In the SSH terminal, run `flask db upgrade`. If it succeeds, App Service is [connecting successfully to the database](#i-get-an-error-when-running-database-migrations).
    Only changes to files in `/home` can persist beyond app restarts. Changes outside of `/home` aren't persisted.

    :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-generate-db-schema-flask-2.png" alt-text="A screenshot showing the commands to run in the SSH shell and their output (Flask)." lightbox="./media/tutorial-python-postgresql-app/azure-portal-generate-db-schema-flask-2.png":::

> [!TIP]
> Use an extension such as [Flask-admin](https://github.com/flask-admin/flask-admin) to access the `admin` portion of the website.
>

## 5. Browse to the app

1. In the output, select the URL of your app.

The following text shows an example of the URL:

<pre>
...
Deploying services (azd deploy)

  (✓) Done: Deploying service web
  - Endpoint: https://cephalin-test11-r5ez3q26g3zia-app-service.azurewebsites.net/

< Output removed for brevity. >
</pre>

    :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-browse-app-1.png" alt-text="A screenshot showing how to launch an App Service from the Azure portal." lightbox="./media/tutorial-python-postgresql-app/azure-portal-browse-app-1.png":::

2. Add a few restaurants to the list.
    Congratulations, you're running a web app in Azure App Service, with secure connectivity to Azure Database for PostgreSQL.

    :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-browse-app-2.png" alt-text="A screenshot of the Flask web app with PostgreSQL running in Azure showing restaurants and restaurant reviews." lightbox="./media/tutorial-python-postgresql-app/azure-portal-browse-app-2.png":::

## 6. Stream diagnostic logs

Azure App Service captures all messages output to the console to help you diagnose issues with your application. The sample app includes `print()` statements to demonstrate this capability as shown below.

:::code language="python" source="~/msdocs-flask-postgresql-sample-app/app.py" range="37-41" highlight="3":::

In the output, select the link to stream App Service logs. 

The following text shows an example of the link to SSH to Stream App Service logs::

<pre>
Stream App Service logs at: https://portal.azure.com/#@/resource/subscriptions/ef90e930-9d7f-4a60-8a99-748e0eea69de/resourceGroups/cephalin-test11-rg/providers/Microsoft.Web/sites/test11-r5ez3q26g3zia-app-service/logStream
</pre>

Learn more about logging in Python apps in the series on [setting up Azure Monitor for your Python application](/azure/azure-monitor/app/opencensus-python).

## 7. Clean up resources

To delete all Azure resources in the current deployment environment, run `azd down`.

```bash
azd down
```
::: zone-end

## Troubleshooting

Listed below are issues you may encounter while trying to work through this tutorial and steps to resolve them.

#### I can't connect to the SSH session

If you can't connect to the SSH session, then the app itself has failed to start. Check the [diagnostic logs](#6-stream-diagnostic-logs) for details. For example, if you see an error like `KeyError: 'AZURE_POSTGRESQL_CONNECTIONSTRING'`, it may mean that the environment variable is missing (you may have removed the app setting).

#### I get an error when running database migrations

If you encounter any errors related to connecting to the database, check if the app settings (`AZURE_POSTGRESQL_CONNECTIONSTRING`) have been changed. Without that connection string, the migrate command can't communicate with the database. 

## Frequently asked questions

- [How much does this setup cost?](#how-much-does-this-setup-cost)
- [How do I connect to the PostgreSQL server that's secured behind the virtual network with other tools?](#how-do-i-connect-to-the-postgresql-server-thats-secured-behind-the-virtual-network-with-other-tools)
- [How does local app development work with GitHub Actions?](#how-does-local-app-development-work-with-github-actions)
- [How is the Django sample configured to run on Azure App Service?](#how-is-the-django-sample-configured-to-run-on-azure-app-service)

#### How much does this setup cost?

Pricing for the created resources is as follows:

- The App Service plan is created in **Basic** tier and can be scaled up or down. See [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/).
- The PostgreSQL flexible server is created in the lowest burstable tier **Standard_B1ms**, with the minimum storage size, which can be scaled up or down. See [Azure Database for PostgreSQL pricing](https://azure.microsoft.com/pricing/details/postgresql/flexible-server/).
- The virtual network doesn't incur a charge unless you configure extra functionality, such as peering. See [Azure Virtual Network pricing](https://azure.microsoft.com/pricing/details/virtual-network/).
- The private DNS zone incurs a small charge. See [Azure DNS pricing](https://azure.microsoft.com/pricing/details/dns/). 

#### How do I connect to the PostgreSQL server that's secured behind the virtual network with other tools?

- For basic access from a command-line tool, you can run `psql` from the app's SSH terminal.
- To connect from a desktop tool, your machine must be within the virtual network. For example, it could be an Azure VM that's connected to one of the subnets, or a machine in an on-premises network that has a [site-to-site VPN](../vpn-gateway/vpn-gateway-about-vpngateways.md) connection with the Azure virtual network.
- You can also [integrate Azure Cloud Shell](../cloud-shell/private-vnet.md) with the virtual network.

#### How does local app development work with GitHub Actions?

Using the autogenerated workflow file from App Service as an example, each `git push` kicks off a new build and deployment run. From a local clone of the GitHub repository, you make the desired updates and push to GitHub. For example:

```terminal
git add .
git commit -m "<some-message>"
git push origin main
```

#### How is the Django sample configured to run on Azure App Service?

> [!NOTE]
> If you are following along with this tutorial with your own app, look at the *requirements.txt* file description in each project's *README.md* file ([Flask](https://github.com/Azure-Samples/msdocs-flask-postgresql-sample-app/blob/main/README.md), [Django](https://github.com/Azure-Samples/msdocs-django-postgresql-sample-app/blob/main/README.md)) to see what packages you'll need.

The [Django sample application](https://github.com/Azure-Samples/msdocs-django-postgresql-sample-app) configures settings in the *azureproject/production.py* file so that it can run in Azure App Service. These changes are common to deploying Django to production, and not specific to App Service.

- Django validates the HTTP_HOST header in incoming requests. The sample code uses the [`WEBSITE_HOSTNAME` environment variable in App Service](reference-app-settings.md#app-environment) to add the app's domain name to Django's [ALLOWED_HOSTS](https://docs.djangoproject.com/en/4.1/ref/settings/#allowed-hosts) setting.

    :::code language="python" source="~/msdocs-django-postgresql-sample-app/azureproject/production.py" range="6-8" highlight="3":::

- Django doesn't support [serving static files in production](https://docs.djangoproject.com/en/4.1/howto/static-files/deployment/). For this tutorial, you use [WhiteNoise](https://whitenoise.evans.io/) to enable serving the files. The WhiteNoise package was already installed with requirements.txt, and its middleware is added to the list.

    :::code language="python" source="~/msdocs-django-postgresql-sample-app/azureproject/production.py" range="11-16" highlight="14":::

    Then the static file settings are configured according to the Django documentation.

    :::code language="python" source="~/msdocs-django-postgresql-sample-app/azureproject/production.py" range="25-26":::

For more information, see [Production settings for Django apps](configure-language-python.md#production-settings-for-django-apps).
  

## Next steps

Advance to the next tutorial to learn how to secure your app with a custom domain and certificate.

> [!div class="nextstepaction"]
> [Secure with custom domain and certificate](tutorial-secure-domain-certificate.md)

Learn how App Service runs a Python app:

> [!div class="nextstepaction"]
> [Configure Python app](configure-language-python.md)
