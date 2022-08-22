---
title: 'Tutorial: Deploy a Python Django or Flask web app with PostgreSQL'
description: Create a Python Django or Flask web app with a PostgreSQL database and deploy it to Azure. The tutorial uses either the Django or Flask framework and the app is hosted on Azure App Service on Linux.
author: jessmjohnson
ms.author: jejohn
ms.devlang: python
ms.topic: tutorial
ms.date: 03/09/2022
ms.custom: mvc, seodec18, seo-python-october2019, cli-validate, devx-track-python, devx-track-azurecli, devdivchpfy22, event-tier1-build-2022, vscode-azure-extension-update-completed
---

# Deploy a Python (Django or Flask) web app with PostgreSQL in Azure

In this tutorial, you'll deploy a data-driven Python web app (**[Django](https://www.djangoproject.com/)** or **[Flask](https://flask.palletsprojects.com/)**) with the **[Azure Database for PostgreSQL](../postgresql/index.yml)** relational database service. The Python app is hosted in a fully managed **[Azure App Service](./overview.md#app-service-on-linux)** which supports [Python 3.7 or higher](https://www.python.org/downloads/) in a Linux server environment. You can start with a basic pricing tier that can be scaled up at any later time.

:::image type="content" border="False" source="./media/tutorial-python-postgresql-app/python-postgresql-app-architecture-240px.png" lightbox="./media/tutorial-python-postgresql-app/python-postgresql-app-architecture.png" alt-text="An architecture diagram showing an  App Service with a PostgreSQL database in Azure.":::

**To complete this tutorial, you'll need:**

* An Azure account with an active subscription exists. If you don't have an Azure account, you [can create one for free](https://azure.microsoft.com/free/python).
* Knowledge of Python with Flask development or [Python with Django development](/learn/paths/django-create-data-driven-websites/)
* [Python 3.7 or higher](https://www.python.org/downloads/) installed locally.
* [PostgreSQL](https://www.postgresql.org/download/) installed locally.

## 1 - Sample application

Sample Python applications using the Flask and Django framework are provided to help you follow along with this tutorial. Download or clone one of the sample applications to your local workstation.

### [Flask](#tab/flask)

```bash
git clone https://github.com/Azure-Samples/msdocs-flask-postgresql-sample-app
```

### [Django](#tab/django)

```bash
git clone https://github.com/Azure-Samples/msdocs-django-postgresql-sample-app.git
```

---

To run the application locally, navigate into the application folder:

### [Flask](#tab/flask)

```bash
cd msdocs-flask-postgresql-sample-app
```

### [Django](#tab/django)

```bash
cd msdocs-django-postgresql-sample-app
```

---

Create a virtual environment for the app:

[!INCLUDE [Virtual environment setup](<./includes/tutorial-python-postgresql-app/virtual-environment-setup.md>)]

Install the dependencies:

```Console
pip install -r requirements.txt
```

> [!NOTE]
> If you are following along with this tutorial with your own app, look at the *requirements.txt* file description in each project's *README.md* file ([Flask](https://github.com/Azure-Samples/msdocs-flask-postgresql-sample-app/blob/main/README.md), [Django](https://github.com/Azure-Samples/msdocs-django-postgresql-sample-app/blob/main/README.md)) to see what packages you'll need.

This sample application requires an *.env* file describing how to connect to your local PostgreSQL instance. Create an *.env* file as shown below using the *.env.sample* file as a guide. Set the value of `DBNAME` to the name of an existing database in your local PostgreSQL instance. This tutorial assumes the database name is *restaurant*. Set the values of `DBHOST`, `DBUSER`, and `DBPASS` as appropriate for your local PostgreSQL instance.

```
DBNAME=<database name>
DBHOST=<database-hostname>
DBUSER=<db-user-name>
DBPASS=<db-password>
```

For Django, you can use SQLite locally instead of PostgreSQL by following the instructions in the comments of the [*settings.py*](https://github.com/Azure-Samples/msdocs-django-postgresql-sample-app/blob/main/azureproject/settings.py) file.

Create the `restaurant` and `review` database tables:

### [Flask](#tab/flask)

```Console
flask db init
flask db migrate -m "initial migration"
```

### [Django](#tab/django)

```Console
python manage.py migrate
```

---

Run the app:

### [Flask](#tab/flask)

```Console
flask run
```

### [Django](#tab/django)

```Console
python manage.py runserver
```

---

### [Flask](#tab/flask)

In a web browser, go to the sample application at `http://127.0.0.1:5000` and add some restaurants and restaurant reviews to see how the app works.

:::image type="content" source="./media/tutorial-python-postgresql-app/run-flask-postgresql-app-localhost.png" alt-text="A screenshot of the Flask web app with PostgreSQL running locally showing restaurants and restaurant reviews.":::


### [Django](#tab/django)

In a web browser, go to the sample application at `http://127.0.0.1:8000` and add some restaurants and restaurant reviews to see how the app works.

:::image type="content" source="./media/tutorial-python-postgresql-app/run-django-postgresql-app-localhost.png" alt-text="A screenshot of the Django web app with PostgreSQL running locally showing restaurants and restaurant reviews.":::

---

> [!TIP]
> With Django, you can create users with the `python manage.py createsuperuser` command like you would with a typical Django app. For more information, see the documentation for [django django-admin and manage.py](https://docs.djangoproject.com/en/1.8/ref/django-admin/). Use the superuser account to access the `/admin` portion of the web site. For Flask, use an extension such as [Flask-admin](https://github.com/flask-admin/flask-admin) to provide the same functionality.

Having issues? [Let us know](https://aka.ms/DjangoCLITutorialHelp).

## 2 - Create a web app in Azure

To host your application in Azure, you need to create Azure App Service web app.
### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create your Azure App Service resource.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [A screenshot showing how to use the search box in the top tool bar to find App Services in Azure](<./includes/tutorial-python-postgresql-app/create-app-service-azure-portal-1.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/create-app-service-azure-portal-1-240px.png" lightbox="./media/tutorial-python-postgresql-app/create-app-service-azure-portal-1.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure portal." ::: |
| [!INCLUDE [A screenshot showing the location of the Create button on the App Services page in the Azure portal](<./includes/tutorial-python-postgresql-app/create-app-service-azure-portal-2.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/create-app-service-azure-portal-2-240px.png" lightbox="./media/tutorial-python-postgresql-app/create-app-service-azure-portal-2.png" alt-text="A screenshot showing the location of the Create button on the App Services page in the Azure portal." ::: |
| [!INCLUDE [A screenshot showing how to fill out the form to create a new App Service in the Azure portal](<./includes/tutorial-python-postgresql-app/create-app-service-azure-portal-3.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/create-app-service-azure-portal-3-240px.png" lightbox="./media/tutorial-python-postgresql-app/create-app-service-azure-portal-3.png" alt-text="A screenshot showing how to fill out the form to create a new App Service in the Azure portal." ::: |
| [!INCLUDE [A screenshot showing how to select the basic App Service plan in the Azure portal](<./includes/tutorial-python-postgresql-app/create-app-service-azure-portal-4.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/create-app-service-azure-portal-4-240px.png" lightbox="./media/tutorial-python-postgresql-app/create-app-service-azure-portal-4.png" alt-text="A screenshot showing how to select the basic App Service plan in the Azure portal." ::: |
| [!INCLUDE [A screenshot showing the location of the Review plus Create button in the Azure portal](<./includes/tutorial-python-postgresql-app/create-app-service-azure-portal-5.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/create-app-service-azure-portal-5-240px.png" lightbox="./media/tutorial-python-postgresql-app/create-app-service-azure-portal-5.png" alt-text="A screenshot showing the location of the Review plus Create button in the Azure portal." ::: |

### [VS Code](#tab/vscode-aztools)

To create Azure resources in VS Code, you must have the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) installed and be signed into Azure from VS Code.

> [!div class="nextstepaction"]
> [Download Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [A screenshot showing how to use the search box in the top tool bar to find App Services in Azure](<./includes/tutorial-python-postgresql-app/create-app-service-visual-studio-code-1.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/create-app-service-visual-studio-code-1-240px.png" lightbox="./media/tutorial-python-postgresql-app/create-app-service-visual-studio-code-1.png" alt-text="A screenshot showing how to find the VS Code Azure extension in VS Code." ::: |
| [!INCLUDE [A screenshot showing how to use the search box in the top tool bar to find App Services in Azure](<./includes/tutorial-python-postgresql-app/create-app-service-visual-studio-code-2.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/create-app-service-visual-studio-code-2-240px.png" lightbox="./media/tutorial-python-postgresql-app/create-app-service-visual-studio-code-2.png" alt-text="A screenshot showing how to create a new web app in VS Code." ::: |
| [!INCLUDE [A screenshot showing how to use the search box in the top tool bar to find App Services in Azure](<./includes/tutorial-python-postgresql-app/create-app-service-visual-studio-code-3.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/create-app-service-visual-studio-code-3-240px.png" lightbox="./media/tutorial-python-postgresql-app/create-app-service-visual-studio-code-3.png" alt-text="A screenshot showing how to use the search box in the top tool bar of VS Code to name a new web app." ::: |
| [!INCLUDE [A screenshot showing how to use the search box in the top tool bar to find App Services in Azure](<./includes/tutorial-python-postgresql-app/create-app-service-visual-studio-code-4.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/create-app-service-visual-studio-code-4a-240px.png" lightbox="./media/tutorial-python-postgresql-app/create-app-service-visual-studio-code-4a.png" alt-text="A screenshot showing how to use the search box in the top tool bar of VS Code to create a new resource group." ::: :::image type="content" source="./media/tutorial-python-postgresql-app/create-app-service-visual-studio-code-4b-240px.png" lightbox="./media/tutorial-python-postgresql-app/create-app-service-visual-studio-code-4b.png" alt-text="A screenshot showing how to use the search box in the top tool bar of VS Code to name a new resource group." ::: |
| [!INCLUDE [A screenshot showing how to use the search box in the top tool bar to find App Services in Azure](<./includes/tutorial-python-postgresql-app/create-app-service-visual-studio-code-5.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/create-app-service-visual-studio-code-5-240px.png" lightbox="./media/tutorial-python-postgresql-app/create-app-service-visual-studio-code-5.png" alt-text="A screenshot showing how to use the search box in the top tool bar of VS Code to set the runtime stack of a web app in Azure." ::: |
| [!INCLUDE [A screenshot showing how to use the search box in the top tool bar to find App Services in Azure](<./includes/tutorial-python-postgresql-app/create-app-service-visual-studio-code-6.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/create-app-service-visual-studio-code-6-240px.png" lightbox="./media/tutorial-python-postgresql-app/create-app-service-visual-studio-code-6.png" alt-text="A screenshot showing how to use the search box in the top tool bar of VS Code to set location for new web app resource in Azure." ::: |
| [!INCLUDE [A screenshot showing how to use the search box in the top tool bar to find App Services in Azure](<./includes/tutorial-python-postgresql-app/create-app-service-visual-studio-code-7.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/create-app-service-visual-studio-code-7a-240px.png" lightbox="./media/tutorial-python-postgresql-app/create-app-service-visual-studio-code-7a.png" alt-text="A screenshot showing how to use the search box in the top tool bar of VS Code to create a new App Service plan in Azure." :::  :::image type="content" source="./media/tutorial-python-postgresql-app/create-app-service-visual-studio-code-7b-240px.png" lightbox="./media/tutorial-python-postgresql-app/create-app-service-visual-studio-code-7b.png" alt-text="A screenshot showing how to use the search box in the top tool bar in VS Code to name a new App Service plan in Azure." ::: |
| [!INCLUDE [A screenshot showing how to use the search box in the top tool bar to find App Services in Azure](<./includes/tutorial-python-postgresql-app/create-app-service-visual-studio-code-8.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/create-app-service-visual-studio-code-8-240px.png" lightbox="./media/tutorial-python-postgresql-app/create-app-service-visual-studio-code-8.png" alt-text="A screenshot showing how to use the search box in the top tool bar in VS Code to select a pricing tier for a web app in Azure." ::: |
| [!INCLUDE [A screenshot showing how to use the search box in the top tool bar to find App Services in Azure](<./includes/tutorial-python-postgresql-app/create-app-service-visual-studio-code-9.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/create-app-service-visual-studio-code-9-240px.png" lightbox="./media/tutorial-python-postgresql-app/create-app-service-visual-studio-code-9.png" alt-text="A screenshot showing how to use the search box in the top tool bar of VS Code to skip configuring Application Insights for a web app in Azure." ::: |
| [!INCLUDE [A screenshot showing how to use the search box in the top tool bar to find App Services in Azure](<./includes/tutorial-python-postgresql-app/create-app-service-visual-studio-code-10.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/create-app-service-visual-studio-code-10a-240px.png" lightbox="./media/tutorial-python-postgresql-app/create-app-service-visual-studio-code-10a.png" alt-text="A screenshot showing deployment with Visual Studio Code and View Output Button." :::  :::image type="content" source="./media/tutorial-python-postgresql-app/create-app-service-visual-studio-code-10b-240px.png" lightbox="./media/tutorial-python-postgresql-app/create-app-service-visual-studio-code-10b.png" alt-text="A screenshot showing deployment with Visual Studio Code and how to view App Service in Azure portal." :::  :::image type="content" source="./media/tutorial-python-postgresql-app/create-app-service-visual-studio-code-10c-240px.png" lightbox="./media/tutorial-python-postgresql-app/create-app-service-visual-studio-code-10c.png" alt-text="A screenshot showing the default App Service web page when no app has been deployed." :::  |

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

[!INCLUDE [Create app service with CLI](<./includes/tutorial-python-postgresql-app/create-app-service-cli.md>)]

----

Having issues? Refer first to the [Troubleshooting guide](configure-language-python.md#troubleshooting), otherwise, [let us know](https://aka.ms/DjangoCLITutorialHelp).

## 3 - Create the PostgreSQL database in Azure

You can create a PostgreSQL database in Azure using the [Azure portal](https://portal.azure.com/), Visual Studio Code, or the Azure CLI.

### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create your Azure Database for PostgreSQL resource.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [A screenshot showing how to use the search box in the top tool bar to find Postgres Services in Azure](<./includes/tutorial-python-postgresql-app/create-postgres-service-azure-portal-1.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/create-postgres-service-azure-portal-1-240px.png" lightbox="./media/tutorial-python-postgresql-app/create-postgres-service-azure-portal-1.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find Postgres Services in the Azure portal." ::: |
| [!INCLUDE [A screenshot showing the location of the Create button on the Azure Database for PostgreSQL servers page in the Azure portal](<./includes/tutorial-python-postgresql-app/create-postgres-service-azure-portal-2.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/create-postgres-service-azure-portal-2-240px.png" lightbox="./media/tutorial-python-postgresql-app/create-postgres-service-azure-portal-2.png" alt-text="A screenshot showing the location of the Create button on the Azure Database for PostgreSQL servers page in the Azure portal." ::: |
| [!INCLUDE [A screenshot showing the location of the Create button on the Azure Database for PostgreSQL Flexible server deployment option page in the Azure portal](<./includes/tutorial-python-postgresql-app/create-postgres-service-azure-portal-3.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/create-postgres-service-azure-portal-3-240px.png" lightbox="./media/tutorial-python-postgresql-app/create-postgres-service-azure-portal-3.png" alt-text="A screenshot showing the location of the Create Flexible Server button on the Azure Database for PostgreSQL deployment option page in the Azure portal." ::: |
| [!INCLUDE [A screenshot showing how to fill out the form to create a new Azure Database for PostgreSQL Flexible server in the Azure portal](<./includes/tutorial-python-postgresql-app/create-postgres-service-azure-portal-4.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/create-postgres-service-azure-portal-4-240px.png" lightbox="./media/tutorial-python-postgresql-app/create-postgres-service-azure-portal-4.png" alt-text="A screenshot showing how to fill out the form to create a new Azure Database for PostgreSQL in the Azure portal." ::: |
| [!INCLUDE [A screenshot showing how to select and configure the compute and storage for PostgreSQL Flexible server in the Azure portal](<./includes/tutorial-python-postgresql-app/create-postgres-service-azure-portal-5.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/create-postgres-service-azure-portal-5-240px.png" lightbox="./media/tutorial-python-postgresql-app/create-postgres-service-azure-portal-5.png" alt-text="A screenshot showing how to select and configure the basic database service plan in the Azure portal." ::: |
| [!INCLUDE [A screenshot showing creating administrator account information for the PostgreSQL Flexible server in in the Azure portal](<./includes/tutorial-python-postgresql-app/create-postgres-service-azure-portal-6.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/create-postgres-service-azure-portal-6-240px.png" lightbox="./media/tutorial-python-postgresql-app/create-postgres-service-azure-portal-6.png" alt-text="Creating administrator account information for the PostgreSQL Flexible server in the Azure portal." ::: |
| [!INCLUDE [A screenshot showing adding current IP as a firewall rule for the PostgreSQL Flexible server in the Azure portal](<./includes/tutorial-python-postgresql-app/create-postgres-service-azure-portal-7.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/create-postgres-service-azure-portal-7-240px.png" lightbox="./media/tutorial-python-postgresql-app/create-postgres-service-azure-portal-7.png" alt-text="A screenshot showing adding current IP as a firewall rule for the PostgreSQL Flexible server in the Azure portal." ::: |

[!INCLUDE [A screenshot showing creating the restaurant database in the Azure Cloud Shell](<./includes/tutorial-python-postgresql-app/create-postgres-service-azure-portal-8.md>)]

### [VS Code](#tab/vscode-aztools)

Follow these steps to create your Azure Database for PostgreSQL resource using the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) in Visual Studio Code.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Open Azure Extension - Database in VS Code](<./includes/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-1.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-1-240px.png" lightbox="./media/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-1.png" alt-text="A screenshot showing how to open Azure Extension for Database in VS Code." ::: |
| [!INCLUDE [Create database server in VS Code](<./includes/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-2.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-2-240px.png" alt-text="A screenshot showing how create a database server in VSCode." lightbox="./media/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-2.png"::: |
| [!INCLUDE [Azure portal - create new resource](<./includes/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-3.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-3-240px.png" alt-text="A screenshot how to create a new resource in VS Code." lightbox="./media/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-3.png"::: |
| [!INCLUDE [Azure portal - create new resource](<./includes/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-4.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-4a-240px.png" alt-text="A screenshot showing how to create a new resource in the VS Code - server name." lightbox="./media/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-4a.png"::: :::image type="content" source="./media/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-4b-240px.png" alt-text="A screenshot showing how to create a new resource in VS Code - SKU." lightbox="./media/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-4b.png"::: :::image type="content" source="./media/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-4c-240px.png" alt-text="A screenshot showing how to create a new resource in VS Code - admin account name." lightbox="./media/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-4c.png"::: :::image type="content" source="./media/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-4d-240px.png" alt-text="A screenshot showing how to create a new resource in VS Code - admin account password." lightbox="./media/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-4d.png"::: :::image type="content" source="./media/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-4e-240px.png" alt-text="A screenshot showing how to create a new resource in VS Code - resource group." lightbox="./media/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-4e.png"::: :::image type="content" source="./media/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-4f-240px.png" alt-text="A screenshot showing how to create a new resource in VS Code - location." lightbox="./media/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-4f.png":::|
| [!INCLUDE [Configure access for the database in the Azure portal](<./includes/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-5.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-5a-240px.png" lightbox="./media/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-5a.png" alt-text="A screenshot showing how to configure access for a database by configuring a firewall rule in VS Code." ::: :::image type="content" source="./media/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-5b-240px.png" lightbox="./media/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-5b.png" alt-text="A screenshot showing how to select the correct PostgreSQL server to add a firewall rule in VS Code." ::: :::image type="content" source="./media/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-5c-240px.png" lightbox="./media/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-5c.png" alt-text="A screenshot showing a dialog box asking to add firewall rule for local IP address in VS Code." :::|
| [!INCLUDE [Create a new Azure resource in the Azure portal](<./includes/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-6.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-6-240px.png" lightbox="./media/tutorial-python-postgresql-app/create-postgres-service-visual-studio-code-6.png" alt-text="A screenshot showing how to create a PostgreSQL database server in VS Code." ::: |

### [Azure CLI](#tab/azure-cli)

Run `az login` to sign in to  and follow these steps to create your Azure Database for PostgreSQL resource.

[!INCLUDE [Create postgres service with CLI](<./includes/tutorial-python-postgresql-app/create-postgres-service-cli.md>)]

----

Having issues? [Let us know](https://aka.ms/DjangoCLITutorialHelp).

## 4 - Allow web app to access the database

After the Azure Database for PostgreSQL server is created, configure access to the server from the web app by adding a firewall rule. This can be done through the Azure portal or the Azure CLI.

If you're working in VS Code, right-click the database server and select **Open in Portal** to go to the Azure portal. Or, go to the [Azure Cloud Shell](https://shell.azure.com) and run the Azure CLI commands.
### [Azure portal](#tab/azure-portal-access)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [A screenshot showing the location and adding a firewall rule in the Azure portal](<./includes/tutorial-python-postgresql-app/add-access-to-postgres-from-web-app-portal-1.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/add-access-to-postgres-from-web-app-portal-1-240px.png" lightbox="./media/tutorial-python-postgresql-app/add-access-to-postgres-from-web-app-portal-1.png" alt-text="A screenshot showing how to add access from other Azure services to a PostgreSQL database in the Azure portal." ::: |

### [Azure CLI](#tab/azure-cli-access)

[!INCLUDE [Allow access from web app to postgres service with CLI](<./includes/tutorial-python-postgresql-app/add-access-to-postgres-from-web-app-cli.md>)]

----

Having issues? Refer first to the [Troubleshooting guide](configure-language-python.md#troubleshooting), otherwise, [let us know](https://aka.ms/DjangoCLITutorialHelp).

## 5 - Connect the web app to the database

With the web app and PostgreSQL database created, the next step is to connect the web app to the PostgreSQL database in Azure.

The web app code uses database information in four environment variables named `DBHOST`, `DBNAME`, `DBUSER`, and `DBPASS` to connect to the PostgresSQL server.

### [Azure portal](#tab/azure-portal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Azure portal connect app to postgres step 1](<./includes/tutorial-python-postgresql-app/connect-postgres-to-app-azure-portal-1.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/connect-postgres-to-app-azure-portal-1-240px.png" lightbox="./media/tutorial-python-postgresql-app/connect-postgres-to-app-azure-portal-1.png" alt-text="A screenshot showing how to navigate to App Settings in the Azure portal." ::: |
| [!INCLUDE [Azure portal connect app to postgres step 2](<./includes/tutorial-python-postgresql-app/connect-postgres-to-app-azure-portal-2.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/connect-postgres-to-app-azure-portal-2-240px.png" lightbox="./media/tutorial-python-postgresql-app/connect-postgres-to-app-azure-portal-2.png" alt-text="A screenshot showing how to configure the App Settings in the Azure portal." ::: |

### [VS Code](#tab/vscode-aztools)

To configure environment variables for the web app from VS Code, you must have the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) installed and be signed into Azure from VS Code.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [VS Code connect app to postgres step 1](<./includes/tutorial-python-postgresql-app/connect-postgres-to-app-visual-studio-code-1.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/connect-app-to-database-azure-extension-240px.png" lightbox="./media/tutorial-python-postgresql-app/connect-app-to-database-azure-extension.png" alt-text="A screenshot showing how to locate the Azure Tools extension in VS Code." ::: |
| [!INCLUDE [VS Code connect app to postgres step 2](<./includes/tutorial-python-postgresql-app/connect-postgres-to-app-visual-studio-code-2.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/connect-app-to-database-create-setting-240px.png" lightbox="./media/tutorial-python-postgresql-app/connect-app-to-database-create-setting.png" alt-text="A screenshot showing how to add a setting to the App Service in VS Code." ::: |
| [!INCLUDE [VS Code connect app to postgres step 3](<./includes/tutorial-python-postgresql-app/connect-postgres-to-app-visual-studio-code-3.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/connect-app-to-database-settings-example-a-240px.png" lightbox="./media/tutorial-python-postgresql-app/connect-app-to-database-settings-example-a.png" alt-text="A screenshot showing adding setting name for app service to connect to PostgreSQL database in VS Code." :::  :::image type="content" source="./media/tutorial-python-postgresql-app/connect-app-to-database-settings-example-b-240px.png" lightbox="./media/tutorial-python-postgresql-app/connect-app-to-database-settings-example-b.png" alt-text="A screenshot showing adding setting value for app service to connect to PostgreSQL database in VS Code." ::: |

### [Azure CLI](#tab/azure-cli)

[!INCLUDE [Connect web app to postgres service with CLI](<./includes/tutorial-python-postgresql-app/connect-postgres-to-app-cli.md>)]

----

Having issues? Refer first to the [Troubleshooting guide](configure-language-python.md#troubleshooting), otherwise, [let us know](https://aka.ms/DjangoCLITutorialHelp).

## 6 - Deploy your application code to Azure

Azure App service supports multiple methods to deploy your application code to Azure including support for GitHub Actions and all major CI/CD tools. This article focuses on how to deploy your code from your local workstation to Azure.

### [Deploy using VS Code](#tab/vscode-aztools-deploy)

To deploy a web app from VS Code, you must have the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) installed and be signed into Azure from VS Code.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [VS Code deploy step 1](<./includes/tutorial-python-postgresql-app/deploy-visual-studio-code-1.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/connect-app-to-database-azure-extension-240px.png" lightbox="./media/tutorial-python-postgresql-app/connect-app-to-database-azure-extension.png" alt-text="A screenshot showing how to locate the Azure Tools extension in VS Code." ::: |
| [!INCLUDE [VS Code deploy step 2](<./includes/tutorial-python-postgresql-app/deploy-visual-studio-code-2.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/deploy-web-app-visual-studio-code-1-240px.png" lightbox="./media/tutorial-python-postgresql-app/deploy-web-app-visual-studio-code-1.png" alt-text="A screenshot showing how to deploy a web app in VS Code." ::: |
| [!INCLUDE [VS Code deploy step 3](<./includes/tutorial-python-postgresql-app/deploy-visual-studio-code-3.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/deploy-web-app-visual-studio-code-2-240px.png" lightbox="./media/tutorial-python-postgresql-app/deploy-web-app-visual-studio-code-2.png" alt-text="A screenshot showing how to deploy a web app in VS Code: selecting the code to deploy." ::: :::image type="content" source="./media/tutorial-python-postgresql-app/deploy-web-app-visual-studio-code-3-240px.png" lightbox="./media/tutorial-python-postgresql-app/deploy-web-app-visual-studio-code-3.png" alt-text="A screenshot showing how to deploy a web app in VS Code: a dialog box to confirm deployment." ::: |
| [!INCLUDE [VS Code deploy step 4](<./includes/tutorial-python-postgresql-app/deploy-visual-studio-code-4.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/deploy-web-app-visual-studio-code-4-240px.png" lightbox="./media/tutorial-python-postgresql-app/deploy-web-app-visual-studio-code-4.png" alt-text="A screenshot showing how to deploy a web app in VS Code: a dialog box to choose to always deploy to the app service." ::: |
| [!INCLUDE [VS Code deploy step 5](<./includes/tutorial-python-postgresql-app/deploy-visual-studio-code-5.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/deploy-web-app-visual-studio-code-5-240px.png" lightbox="./media/tutorial-python-postgresql-app/deploy-web-app-visual-studio-code-5.png" alt-text="A screenshot showing how to deploy a web app in VS Code: a dialog box with choice to browse to website." :::  :::image type="content" source="./media/tutorial-python-postgresql-app/deploy-web-app-visual-studio-code-6-240px.png" lightbox="./media/tutorial-python-postgresql-app/deploy-web-app-visual-studio-code-6.png" alt-text="A screenshot showing how to deploy a web app in VS Code: a dialog box with choice to view deployment details." ::: |

### [Deploy using Local Git](#tab/local-git-deploy)

[!INCLUDE [Deploy Local Git](<./includes/tutorial-python-postgresql-app/deploy-local-git.md>)]

### [Deploy using a ZIP file](#tab/zip-deploy)

[!INCLUDE [Deploy using ZIP file](<./includes/tutorial-python-postgresql-app/deploy-zip-file.md>)]

----

Having issues? Refer first to the [Troubleshooting guide](configure-language-python.md#troubleshooting), otherwise, [let us know](https://aka.ms/DjangoCLITutorialHelp).

## 7 - Migrate app database

With the code deployed and the database in place, the app is almost ready to use. First, you need to establish the necessary schema in the database itself. You do this by "migrating" the data models in the Django app to the database.

**Step 1.** Create SSH session and connect to web app server.

### [Azure portal](#tab/azure-portal)

Navigate to page for the App Service instance in the Azure portal.

1. Select **SSH**, under **Development Tools** on the left side
2. Then **Go** to open an SSH console on the web app server. (It may take a minute to connect for the first time as the web app container needs to start.)

### [VS Code](#tab/vscode-aztools)

In VS Code, you can use the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack), which must be installed and be signed into Azure from VS Code.

In the **App Service** section of the Azure Tools extension:

1. Locate your web app and right-click to bring up the context menu.
2. Select **SSH into Web App** to open an SSH terminal window.

### [Azure CLI](#tab/azure-cli)

[!INCLUDE [Deploy local git with CLI](<./includes/tutorial-python-postgresql-app/migrate-app-database-cli.md>)]

---

> [!NOTE]
> If you cannot connect to the SSH session, then the app itself has failed to start. **Check the diagnostic logs** for details. For example, if you haven't created the necessary app settings in the previous section, the logs will indicate `KeyError: 'DBNAME'`.

**Step 2.** In the SSH session, run the following command to migrate the models into the database schema (you can paste commands using **Ctrl**+**Shift**+**V**):

### [Flask](#tab/flask)

When you deploy the Flask sample app to Azure App Service, the database tables are created automatically in Azure PostgreSQL. If the tables aren't created, try the following command:

```bash
# Create database tables
flask db init
```

### [Django](#tab/django)

```bash
# Create database tables
python manage.py migrate
```

---

If you encounter any errors related to connecting to the database, check the values of the application settings of the App Service created in the previous section, namely `DBHOST`, `DBNAME`, `DBUSER`, and `DBPASS`. Without those settings, the migrate command can't communicate with the database.

> [!TIP]
> In an SSH session, for Django you can also create users with the `python manage.py createsuperuser` command like you would with a typical Django app. For more information, see the documentation for [django django-admin and manage.py](https://docs.djangoproject.com/en/1.8/ref/django-admin/). Use the superuser account to access the `/admin` portion of the web site. For Flask, use an extension such as [Flask-admin](https://github.com/flask-admin/flask-admin) to provide the same functionality.

Having issues? [Let us know](https://aka.ms/DjangoCLITutorialHelp).

## 8 - Browse to the app

Browse to the deployed application in your web browser at the URL `http://<app-name>.azurewebsites.net`. It can take a minute or two for the app to start, so if you see a default app page, wait a minute and refresh the browser.

When you see your sample web app, it's running in a Linux container in App Service using a built-in image **Congratulations!** You've deployed your Python app to App Service.

### [Flask](#tab/flask)

:::image type="content" source="./media/tutorial-python-postgresql-app/run-flask-postgresql-app-production.png" alt-text="A screenshot of the Flask web app with PostgreSQL running in Azure showing restaurants and restaurant reviews.":::

### [Django](#tab/django)

:::image type="content" source="./media/tutorial-python-postgresql-app/run-django-postgresql-app-production.png" alt-text="A screenshot of the Django web app with PostgreSQL running in Azure showing restaurants and restaurant reviews.":::

---

Having issues? [Let us know](https://aka.ms/DjangoCLITutorialHelp).

## 9 - Stream diagnostic logs

Azure App Service captures all messages output to the console to help you diagnose issues with your application. The sample app includes `print()` statements to demonstrate this capability as shown below.

### [Flask](#tab/flask)

:::code language="python" source="~/msdocs-django-postgresql-sample-app/restaurant_review/views.py" range="12-16" highlight="2":::

### [Django](#tab/django)

:::code language="python" source="~/msdocs-flask-postgresql-sample-app/app.py" range="39-43" highlight="3":::

---

You can access the console logs generated from inside the container that hosts the app on Azure.

### [Azure portal](#tab/azure-portal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Stream logs from Azure portal 1](<./includes/tutorial-python-postgresql-app/stream-logs-azure-portal-1.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/stream-logs-azure-portal-1-240px.png" lightbox="./media/tutorial-python-postgresql-app/stream-logs-azure-portal-1.png" alt-text="A screenshot showing how to set application logging in the Azure portal." ::: |
| [!INCLUDE [Stream logs from Azure portal 2](<./includes/tutorial-python-postgresql-app/stream-logs-azure-portal-2.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/stream-logs-azure-portal-2-240px.png" lightbox="./media/tutorial-python-postgresql-app/stream-logs-azure-portal-2.png" alt-text="A screenshot showing how to stream logs in the Azure portal." ::: |

### [VS Code](#tab/vscode-aztools)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Stream logs from VS Code 1](<./includes/tutorial-python-postgresql-app/stream-logs-visual-studio-code-1.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/stream-logs-visual-studio-code-1-240px.png" lightbox="./media/tutorial-python-postgresql-app/stream-logs-visual-studio-code-1.png" alt-text="A screenshot showing how to set application logging in VS Code." ::: |
| [!INCLUDE [Stream logs from VS Code 2](<./includes/tutorial-python-postgresql-app/stream-logs-visual-studio-code-2.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/stream-logs-visual-studio-code-2-240px.png" lightbox="./media/tutorial-python-postgresql-app/stream-logs-visual-studio-code-2.png" alt-text="A screenshot showing VS Code output window." ::: |

### [Azure CLI](#tab/azure-cli)

[!INCLUDE [Stream logs CLI](<./includes/tutorial-python-postgresql-app/stream-logs-cli.md>)]

----

Having issues? [Let us know](https://aka.ms/DjangoCLITutorialHelp).

## Clean up resources

You can leave the app and database running as long as you want for further development work and skip ahead to [Next steps](#next-steps).

However, when you're finished with the sample app, you can remove all of the resources for the app from Azure to ensure you don't incur other charges and keep your Azure subscription uncluttered. Removing the resource group also removes all resources in the resource group and is the fastest way to remove all Azure resources for your app.

### [Azure portal](#tab/azure-portal)

Follow these steps while signed-in to the Azure portal to delete a resource group.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Remove resource group Azure portal 1](<./includes/tutorial-python-postgresql-app/remove-resource-group-azure-portal-1.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/remove-resource-group-azure-portal-1-240px.png" lightbox="./media/tutorial-python-postgresql-app/remove-resource-group-azure-portal-1.png" alt-text="A screenshot showing how to find resource group in the Azure portal." ::: |
| [!INCLUDE [Remove resource group Azure portal 2](<./includes/tutorial-python-postgresql-app/remove-resource-group-azure-portal-2.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/remove-resource-group-azure-portal-2-240px.png" lightbox="./media/tutorial-python-postgresql-app/remove-resource-group-azure-portal-2.png" alt-text="A screenshot showing how to delete a resource group in the Azure portal." ::: |
| [!INCLUDE [Remove resource group Azure portal 3](<./includes/tutorial-python-postgresql-app/remove-resource-group-azure-portal-3.md>)] | |

### [VS Code](#tab/vscode-aztools)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Remove resource group VS Code 1](<./includes/tutorial-python-postgresql-app/remove-resource-group-visual-studio-code-1.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/remove-resource-group-visual-studio-code-1-240px.png" lightbox="./media/tutorial-python-postgresql-app/remove-resource-group-visual-studio-code-1.png" alt-text="A screenshot showing how to delete a resource group in VS Code." ::: |
| [!INCLUDE [Remove resource group VS Code 2](<./includes/tutorial-python-postgresql-app/remove-resource-group-visual-studio-code-2.md>)] | :::image type="content" source="./media/tutorial-python-postgresql-app/remove-resource-group-visual-studio-code-2-240px.png" lightbox="./media/tutorial-python-postgresql-app/remove-resource-group-visual-studio-code-2.png" alt-text="A screenshot showing how to finish deleting a resource in VS Code." ::: |

### [Azure CLI](#tab/azure-cli)

[!INCLUDE [Stream logs CLI](<./includes/tutorial-python-postgresql-app/clean-up-resources-cli.md>)]

---

Having issues? [Let us know](https://aka.ms/DjangoCLITutorialHelp).

## Next steps

Learn how to map a custom DNS name to your app:

> [!div class="nextstepaction"]
> [Tutorial: Map custom DNS name to your app](app-service-web-tutorial-custom-domain.md)

Learn how App Service runs a Python app:

> [!div class="nextstepaction"]
> [Configure Python app](configure-language-python.md)
