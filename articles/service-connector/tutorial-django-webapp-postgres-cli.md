---
title: 'Tutorial: Connect a Django web app to Azure Database for PostgreSQL using Service Connector'
description: Deploy a Python Django web app to Azure App Service and connect it to an Azure PostgreSQL database by using Service Connector.
ms.devlang: python
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: tutorial
ms.date: 08/25/2026
ai-usage: ai-assisted
ms.custom:
  - devx-track-azurecli
  - devx-track-python
  - linux-related-content
  - sfi-ropc-nochange
#customer intent: As a Django app developer and PostgreSQL user, I want to learn how to use Service Connector to connect Azure PostgreSQL backing databases and other services to my App Service apps, so I can easily store and serve app data to my users.
---

# Tutorial: Connect a Django web app to Azure Database for PostgreSQL using Service Connector

In this tutorial, you learn how to deploy a data-driven Python Django web app to Azure App Service and use Service Connector to connect it to other Azure services. The sample web app stores restaurant and review information in an Azure Database for PostgreSQL database and stores photos in an Azure Storage container.

You use Azure CLI to complete the following tasks:

> [!div class="checklist"]
> * Create a Python [Django](https://www.djangoproject.com/) web app and deploy it to [Azure App Service](/azure/app-service/overview).
> * Create an [Azure Database for PostgreSQL](/azure/postgresql/flexible-server/) flexible server and database.
> * Create an [Azure Storage](/azure/storage/common/storage-introduction) account and container.
> * Connect the web app to the database and storage container by using Service Connector with [managed identity](/entra/identity/managed-identities-azure-resources/overview) authentication.
> * Interact with the web app.

> [!NOTE]
> This tutorial is similar to the App Service [Deploy a Python Django web app with PostgreSQL in Azure](/azure/app-service/tutorial-python-postgresql-app-django) tutorial, but uses a system-assigned passwordless managed identity with Azure role-based access control to access other Azure resources. The [Create a passwordless service connection](#create-a-passwordless-service-connection) section of this article shows how Service Connector simplifies the connection process.
> 
> The web app uses the [DefaultAzureCredential](/azure/developer/intro/passwordless-overview#introducing-defaultazurecredential) class of the Python [Azure Identity client library](/python/api/overview/azure/identity-readme) to automatically detect when a managed identity exists and uses it to access the other resources.

## Prerequisites

- An Azure subscription with write and role-assignment permissions for the tutorial resources, in an Azure region that [supports Service Connector](concept-region-support.md) and has sufficient [App Service support and quota](/azure/azure-resource-manager/management/azure-subscription-service-limits#azure-app-service-limits).

- [Azure Cloud Shell](/azure/cloud-shell/overview) to run the tutorial steps, or if you prefer to run locally:
  1. Install [Azure CLI](/cli/azure/install-azure-cli) 2.87.0 or later. To check your version, run `az version`. To upgrade, run `az upgrade`.
  1. Install [Python 3](https://www.python.org/downloads/).
  1. Install [Git](https://git-scm.com/downloads).
  1. Sign in to Azure by using `az login` and following the prompts.

## Set up your environment

1. Register the `Microsoft.ServiceLinker` and `Microsoft.DBforPostgreSQL` resource providers for your subscription.

    ```azurecli
    az provider register --namespace Microsoft.ServiceLinker
    az provider register --namespace Microsoft.DBforPostgreSQL
    ```

1. Install the latest version of the Service Connector passwordless extension. The `--upgrade` parameter updates the extension if it's already installed:

   ```azurecli
   az extension add --name serviceconnector-passwordless --upgrade
   ```

### Clone the sample app

> [!IMPORTANT]
> The tutorial's sample repository was archived on June 15, 2026, and is no longer actively maintained. Use it only to complete this tutorial.

1. Clone the sample app repository.

   ```bash
   git clone https://github.com/Azure-Samples/serviceconnector-webapp-postgresql-django-passwordless.git
   ```

    Alternatively, you can download the app from the [serviceconnector-webapp-postgresql-django-passwordless repository](https://github.com/Azure-Samples/serviceconnector-webapp-postgresql-django-passwordless) and unzip it into a folder called *serviceconnector-webapp-postgresql-django-passwordless*.

1. Change directories into the repo folder using `cd serviceconnector-webapp-postgresql-django-passwordless` and run all remaining commands from that folder.

In the sample app, the web app production settings are in the *azureproject/production.py* file. Development settings are in *azureproject/settings.py*. The production settings configure Django to run in any production environment and aren't specific to App Service.

The app uses production settings when the `WEBSITE_HOSTNAME` environment variable is set. App Service sets this variable to the app's host name, such as `msdocs-django.azurewebsites.net`.

For more information, see the [Django deployment checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/). Also see [Production settings for Django on Azure](/azure/app-service/configure-language-python#production-settings-for-django-apps).

### Define initial environment variables

The following code defines the necessary environment variables for this tutorial.

- `LOCATION` must be an Azure region where your subscription has sufficient quota to create the resources and doesn't restrict Azure Database for PostgreSQL for your subscription.
- The PostgreSQL administrator password must contain 8 to 128 characters from at least three of these categories: uppercase letters, lowercase letters, numerals, and nonalphanumeric characters. Don't use `$` in the password for this tutorial.

1. Set up the following environment variables, replacing `<region>` with a valid value:

    ```bash
    LOCATION="<region>"
    RAND_ID=$RANDOM$RANDOM
    RESOURCE_GROUP_NAME="msdocs-mi-web-app-$RAND_ID"
    APP_SERVICE_NAME="msdocs-mi-web-$RAND_ID"
    APP_SERVICE_PLAN_NAME="$APP_SERVICE_NAME-plan"
    DB_SERVER_NAME="msdocs-mi-postgres-$RAND_ID"
    DATABASE_NAME="restaurant"
    STORAGE_ACCOUNT_NAME="account$RAND_ID"
    ADMIN_USER="demoadmin"
    ```

1. Read the PostgreSQL administrator password without displaying it or adding it to your shell history:

   ```bash
   read -s -p "PostgreSQL administrator password: " ADMIN_PW && echo
   ```

1. Create a [resource group](/azure/azure-resource-manager/management/overview#terminology) to contain all the project resources. The resource group name is cached and automatically applied to subsequent commands.

    ```azurecli
    az group create --name $RESOURCE_GROUP_NAME --location $LOCATION
    ```

## Deploy the app code to App Service

Create the app host in App Service, enable build automation, and deploy the sample app code. The Basic (B1) App Service plan used in this tutorial incurs a cost in your Azure subscription. For current prices, see [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/).

1. The archived sample's *requirements.txt* file doesn't declare the Gunicorn server used by *start.sh*. Add it to your local copy if it isn't already present:

    ```bash
    grep -qiE "^gunicorn([=<>~ ]|$)" requirements.txt || echo "gunicorn" >> requirements.txt
    ```

1. Create a Linux App Service plan in the Basic (B1) pricing tier, and then create the web app with the sample's startup command:

    ```azurecli
    az appservice plan create \
      --resource-group $RESOURCE_GROUP_NAME \
      --name $APP_SERVICE_PLAN_NAME \
      --location $LOCATION \
      --sku B1 \
      --is-linux

    az webapp create \
      --resource-group $RESOURCE_GROUP_NAME \
      --name $APP_SERVICE_NAME \
      --plan $APP_SERVICE_PLAN_NAME \
      --runtime "PYTHON:3.14" \
      --startup-file "start.sh"
    ```

1. Enable App Service build automation so that the deployment installs the packages in *requirements.txt*:

    ```azurecli
    az webapp config appsettings set \
      --resource-group $RESOURCE_GROUP_NAME \
      --name $APP_SERVICE_NAME \
      --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
    ```

1. From the repository root, create a ZIP file of the sample app and deploy it by using [az webapp deploy](/cli/azure/webapp#az-webapp-deploy):

    ```bash
    rm -f app.zip
    python -m zipfile -c app.zip *

    az webapp deploy \
      --resource-group $RESOURCE_GROUP_NAME \
      --name $APP_SERVICE_NAME \
      --src-path app.zip \
      --type zip \
      --track-status false

    rm app.zip
    ```

   The deployment command succeeds when App Service accepts the ZIP file. The build continues in App Service and can take several minutes.

## Create the PostgreSQL database in Azure

Create an Azure Database for PostgreSQL flexible server and database to store the app data.

1. Create the Azure Database for PostgreSQL server:

    ```azurecli
    az postgres flexible-server create \
      --resource-group $RESOURCE_GROUP_NAME \
      --name $DB_SERVER_NAME \
      --location $LOCATION \
      --admin-user $ADMIN_USER \
      --admin-password $ADMIN_PW \
      --sku-name Standard_D2ds_v4 \
      --microsoft-entra-auth Enabled
    ```

   The command succeeds when the PostgreSQL flexible server provisioning state is `Succeeded`.

1. Remove the administrator password from the current shell after the server is created:

    ```bash
    unset ADMIN_PW
    ```

1. Create the database by using [az postgres flexible-server db create](/cli/azure/postgres/flexible-server/db#az-postgres-flexible-server-db-create):

    ```azurecli
    az postgres flexible-server db create \
      --resource-group $RESOURCE_GROUP_NAME \
      --server-name $DB_SERVER_NAME \
      --name $DATABASE_NAME
    ```

## Create a passwordless service connection

Use [az webapp connection create postgres-flexible](/cli/azure/webapp/connection/create#az-webapp-connection-create-postgres-flexible) to add a service connector that connects the Azure web app to the PostgreSQL database using passwordless managed identity authentication. The following command configures Azure Database for PostgreSQL to use managed identity and Azure role-based access control. The command output lists the actions Service Connector takes.

The command creates an app setting named `AZURE_POSTGRESQL_CONNECTIONSTRING` that contains the database connection information. The sample reads this setting in *azureproject/production.py*. For more information, see [Access environment variables](/azure/app-service/configure-language-python#access-environment-variables).

```azurecli
az webapp connection create postgres-flexible \
  --resource-group $RESOURCE_GROUP_NAME \
  --name $APP_SERVICE_NAME \
  --target-resource-group $RESOURCE_GROUP_NAME \
  --server $DB_SERVER_NAME \
  --database $DATABASE_NAME \
  --client-type python \
  --system-identity \
  --yes
```

The connection is ready when the command reports the PostgreSQL flexible server connection and creates the `AZURE_POSTGRESQL_CONNECTIONSTRING` app setting.

## Connect the Django web app to Azure Storage with Service Connector

Create an Azure storage account, and then use [az webapp connection create storage-blob](/cli/azure/webapp/connection/create#az-webapp-connection-create-storage-blob) to connect it to the web app. The connection command takes the following actions:

* Enables system-assigned managed identity on the web app.
* Adds the web app with role **Storage Blob Data Contributor** to the storage account.
* Configures the storage account network to accept access from the web app.
* Creates an environment variable named `AZURE_STORAGEBLOB_RESOURCEENDPOINT` for the Azure Storage account.

### Create an Azure Storage account

Create a general-purpose v2 storage account with locally redundant storage:

```azurecli
az storage account create \
  --resource-group $RESOURCE_GROUP_NAME \
  --name $STORAGE_ACCOUNT_NAME \
  --location $LOCATION \
  --sku Standard_LRS \
  --kind StorageV2
```

### Create a passwordless storage connection

Create the passwordless connection to the storage account:

```azurecli
az webapp connection create storage-blob \
  --resource-group $RESOURCE_GROUP_NAME \
  --name $APP_SERVICE_NAME \
  --target-resource-group $RESOURCE_GROUP_NAME \
  --account $STORAGE_ACCOUNT_NAME \
  --client-type python \
  --system-identity
```

The connection is ready when the command reports the storage account connection and creates the `AZURE_STORAGEBLOB_RESOURCEENDPOINT` app setting.

### Configure the sample photo container

1. Update the Azure Storage account to allow public read access to blobs for this archived sample app.

    > [!NOTE]
    > This archived sample uses direct blob URLs to display photos, so the tutorial enables anonymous read access to the `photos` container. This setting is specific to the sample and isn't required by Service Connector. For production apps, keep containers private and use a controlled delivery method, such as an authenticated application endpoint.

    ```azurecli
    az storage account update \
      --resource-group $RESOURCE_GROUP_NAME \
      --name $STORAGE_ACCOUNT_NAME \
      --allow-blob-public-access true
    ```

1. Assign your signed-in user permission to create the container by using Microsoft Entra authentication:

    ```azurecli
    SIGNED_IN_USER_ID=$(az ad signed-in-user show --query id --output tsv)
    STORAGE_ACCOUNT_ID=$(az storage account show \
      --resource-group $RESOURCE_GROUP_NAME \
      --name $STORAGE_ACCOUNT_NAME \
      --query id \
      --output tsv)

    MSYS_NO_PATHCONV=1 az role assignment create \
      --assignee-object-id $SIGNED_IN_USER_ID \
      --assignee-principal-type User \
      --role "Storage Blob Data Contributor" \
      --scope $STORAGE_ACCOUNT_ID
    ```

   Setting `MSYS_NO_PATHCONV` for this command prevents Git Bash on Windows from converting the Azure resource ID into a Windows path. It has no effect in Azure Cloud Shell or other Bash environments. Role assignments can take a few minutes to become effective.

1. Use [az storage container create](/cli/azure/storage/container#az-storage-container-create) to create a container called `photos` and allow anonymous read access to blobs in that container:

    ```azurecli
    BLOB_ENDPOINT=$(az storage account show \
      --resource-group $RESOURCE_GROUP_NAME \
      --name $STORAGE_ACCOUNT_NAME \
      --query primaryEndpoints.blob \
      --output tsv)

    az storage container create \
      --account-name $STORAGE_ACCOUNT_NAME \
      --name photos \
      --public-access blob \
      --auth-mode login \
      --blob-endpoint $BLOB_ENDPOINT
    ```

   The container is ready when the response shows `"created": true` for the `photos` container.

## Test the Python web app in Azure

Open and test the Azure Restaurant Review web app. The app uses the [azure.identity](https://pypi.org/project/azure-identity/) package and its `DefaultAzureCredential` class. When the app is running in Azure, the `DefaultAzureCredential` automatically detects when a managed identity exists for the App Service, and uses it to access the Azure Storage and Azure Database for PostgreSQL resources. The app doesn't need to provide storage keys, certificates, or credentials to access these resources.

- For a local Azure CLI installation, you can use [`az webapp browse`](/cli/azure/webapp#az-webapp-browse) to open the app in your default browser:

  ```azurecli
  az webapp browse --name $APP_SERVICE_NAME --resource-group $RESOURCE_GROUP_NAME
  ```

- Azure Cloud Shell can't open a local browser, so it doesn't support the `az webapp browse` command. From Cloud Shell, select the **Default domain** link in the upper-right corner of the app's Azure portal page.

It can take a minute or two for the app to start. If you see a default app page that isn't the sample app, wait a minute and refresh the browser.

Test the functionality of the sample app by adding a restaurant and some reviews with photos. The app should resemble the following screenshot:

:::image type="content" source="media/tutorial-django-webapp-postgres-cli/example-of-review-sample-app-production-deployed-small.png" lightbox="media/tutorial-django-webapp-postgres-cli/example-of-review-sample-app-production-deployed.png" alt-text="Screenshot of the sample restaurant review web app showing a restaurant entry with a customer review and an uploaded photo." :::

## Clean up resources

To avoid ongoing charges, you can delete the resources you created for this tutorial by deleting the resource group that contains them. Be sure you no longer need the app or the resources before you run the command.

```azurecli
az group delete --name $RESOURCE_GROUP_NAME --no-wait
```

The command returns immediately while Azure deletes the resources.

## Troubleshooting

If the app doesn't start or connect to its resources, check the App Service deployment logs, confirm that the `AZURE_POSTGRESQL_CONNECTIONSTRING` and `AZURE_STORAGEBLOB_RESOURCEENDPOINT` app settings exist, and allow a few minutes for Azure role assignments to take effect. For Python app startup issues, see the following article:

- [Troubleshoot Linux Python apps for Azure App Service](/azure/app-service/configure-language-python#troubleshooting)

## Related content

- [Quickstart: Connect Azure App Service to databases and services with Service Connector](quickstart-portal-app-service-connection.md)
- [Create service connections using IaC tools](how-to-build-connections-with-iac-tools.md)
- [Deploy a Python Django web app with PostgreSQL in Azure](/azure/app-service/tutorial-python-postgresql-app-django)

