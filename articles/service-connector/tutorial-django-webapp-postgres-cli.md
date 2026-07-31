---
title: 'Tutorial: Use Service Connector to connect a Django web app to Postgres'
description: Deploy a Python Django web app to Azure App Service and connect it to an Azure PostgreSQL database by using Service Connector.
ms.devlang: python
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 04/15/2026
ms.custom:
  - devx-track-azurecli
  - devx-track-python
  - linux-related-content
  - sfi-ropc-nochange
#customer intent: As a Django app developer and PostgreSQL user, I want to learn how to use Service Connector to connect Azure Postgres backing databases and other services to my App Service apps, so I can easily store and serve app data to my users.
---

# Tutorial: Connect a Django web app to Azure PostgreSQL using Service Connector

In this tutorial, you learn how to deploy a data-driven Python Django web app to Azure App Service and use Service Connector to connect it to other Azure services. The sample web app stores restaurant and review information in an Azure Database for PostgreSQL database and stores photos in an Azure Storage container.

You use Azure CLI to complete the following tasks:

> [!div class="checklist"]
> * Create a Python [Django](https://www.djangoproject.com/) web app and deploy it to [Azure App Service](/azure/app-service/overview).
> * Create an [Azure Database for PostgreSQL](/azure/postgresql/flexible-server/) flexible server and database.
> * Create an [Azure Storage](/azure/storage/common/storage-introduction) account and container.
> * Connect the web app to the database and storage container using Service Connector with [managed identity](/entra/identity/managed-identities-azure-resources/overview) authentication.
> * Interact with the web app.

> [!NOTE]
> This tutorial is similar to the App Service [Deploy a Python Django web app with PostgreSQL in Azure](/azure/app-service/tutorial-python-postgresql-app-django) tutorial, but uses a system-assigned passwordless managed identity with Azure role-based access control to access other Azure resources. The [Create a passwordless service connection](#create-a-passwordless-service-connection) section of this article shows how Service Connector simplifies the connection process.
> 
> The web app uses the [DefaultAzureCredential](/azure/developer/intro/passwordless-overview#introducing-defaultazurecredential) class of the Python [Azure Identity client library](/python/api/overview/azure/identity-readme) to automatically detect when a managed identity exists and uses it to access the other resources.

## Prerequisites

- An Azure subscription with write and role-assignment permissions for the tutorial resources, in an Azure region that [supports Service Connector](concept-region-support.md) and has sufficient [App Service support and quota](/azure/azure-resource-manager/management/azure-subscription-service-limits#azure-app-service-limits).

- [Azure Cloud Shell](/azure/cloud-shell/overview) to run the tutorial steps, or if you prefer to run locally:
  1. Install [Azure CLI](/cli/azure/install-azure-cli) 2.30.0 or higher. To check your version, run `az --version`. To upgrade, run `az upgrade`.
  1. Sign in to Azure by using `az login` and following the prompts.

## Set up your environment

1. Make sure your subscription is registered to use the `Microsoft.ServiceLinker` and `Microsoft.DBforPostgreSQL` resource providers. If not, run `az provider register -n Microsoft.[name of service]` to register the providers.

1. Install the following Azure CLI extensions:

   ```azurecli
   az extension add --name serviceconnector-passwordless --upgrade
   az extension add --name rdbms-connect
   ```

### Clone the sample app

1. Clone the sample app repository.

   ```bash
   git clone https://github.com/Azure-Samples/serviceconnector-webapp-postgresql-django-passwordless.git
   ```

   Alternatively, you can download the app from [https://github.com/Azure-Samples/serviceconnector-webapp-postgresql-django-passwordless](https://github.com/Azure-Samples/serviceconnector-webapp-postgresql-django-passwordless) and unzip it into a folder called *serviceconnector-webapp-postgresql-django-passwordless*.

1. Change directories into the repo folder using `cd serviceconnector-webapp-postgresql-django-passwordless` and run all remaining commands from that folder.

In the sample app, the web app production settings are in the *azuresite/production.py* file. Development settings are in *azuresite/settings.py*. The production settings configure Django to run in any production environment and aren't specific to App Service.

The app uses production settings when the `WEBSITE_HOSTNAME` environment variable is set. For Azure Postgres connection strings, App Service automatically sets this variable to the URL of the web app, such as `https://msdocs-django.azurewebsites.net`.

For more information, see the [Django deployment checklist](https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/). Also see [Production settings for Django on Azure](/azure/app-service/configure-language-python#production-settings-for-django-apps).

### Define initial environment variables

The following code defines the necessary environment variables for this tutorial.

- `LOCATION` must be an Azure region where your subscription has sufficient quota to create the resources and doesn't restrict Azure Database for PostgreSQL for your subscription.
- The `ADMIN_PW` must contain 8 to 128 characters in at least three of the four categories uppercase letters, lowercase letters, numerals, and nonalphanumeric characters, excluding `$`.

1. Set up the following environment variables, replacing the `<region>` and `<database password>` placeholders with valid values.

    ```bash
    LOCATION="<region>"
    RAND_ID=$RANDOM
    RESOURCE_GROUP_NAME="msdocs-mi-web-app"
    APP_SERVICE_NAME="msdocs-mi-web-$RAND_ID"
    DB_SERVER_NAME="msdocs-mi-postgres-$RAND_ID"
    ADMIN_USER="demoadmin"
    ADMIN_PW="<database password>"
    ```

1. Create a [resource group](/azure/azure-resource-manager/management/overview#terminology) to contain all the project resources. The resource group name is cached and automatically applied to subsequent commands.

    ```azurecli
    az group create --name $RESOURCE_GROUP_NAME --location $LOCATION
    ```

## Deploy the app code to App Service

Create the app host in App Service and deploy the sample app code to that host. The `az webapp up` command performs the following actions:

* Creates an [App Service plan](/azure/app-service/overview-hosting-plans) in the Basic (B1) pricing tier.
* Creates the App Service app.
* Enables default logging for the app.
* Uploads the repository using ZIP deployment with build automation enabled.
* Builds the app.

In the code, the `sku` defines the CPU, memory, and cost of the App Service plan. The Basic (B1) service plan incurs a small cost in your Azure subscription. You can omit the `--sku` parameter to use the default SKU, usually P1v3 (Premium v3). For a full list of App Service plans, see [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/).

1. From the *serviceconnector-webapp-postgresql-django-passwordless* repository folder, run the following [`az webapp up`](/cli/azure/webapp#az-webapp-up) command:

    ```azurecli
    az webapp up \
      --resource-group $RESOURCE_GROUP_NAME \
      --location $LOCATION \
      --name $APP_SERVICE_NAME \
      --runtime PYTHON:3.10 \
      --sku B1
    ```

   >[!NOTE]
   >The deployment takes a few minutes, and the command can hang or time out, especially on a Basic SKU. Once the app builds successfully and the output shows `Starting the site`, you can exit out of the command by selecting Ctrl+C.

1. Configure the app to use the repository *start.sh* file by running the [az webapp config set](/cli/azure/webapp/config#az-webapp-config-set) command.

    ```azurecli
    az webapp config set \
      --resource-group $RESOURCE_GROUP_NAME \
      --name $APP_SERVICE_NAME \
      --startup-file "start.sh"
    ```

## Create the Postgres database in Azure

Create the Azure Database for PostgreSQL database to store app information. The [az postgres flexible-server create](/cli/azure/postgres/flexible-server#az-postgres-flexible-server-create) command creates an Azure Database for PostgreSQL flexible server in the specified resource group that has:

* Server name specified in the `--name` parameter. The name must be unique across all of Azure.
* SKU specified in the `--sku-name` parameter.
* Administrator account username and password specified in the `--admin-user` and `--admin-password` parameters.

1. Create the Azure Database for PostgreSQL server. If prompted to enable access to the current client IP address, enter `y` for yes.

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

1. If you aren't prompted to enable access to your current client IP address, configure a firewall rule on your server with the [az postgres flexible-server firewall-rule create](/cli/azure/postgres/flexible-server/firewall-rule) command. This rule allows your local environment access to the server. 

    ```azurecli
    IP_ADDRESS=<your IP address>
    az postgres flexible-server firewall-rule create \
       --resource-group $RESOURCE_GROUP_NAME \
       --name $DB_SERVER_NAME \
       --rule-name AllowMyIP \
       --start-ip-address $IP_ADDRESS \
       --end-ip-address $IP_ADDRESS
    ```

    >[!TIP]
    >Use any tool or website that shows your IP address to substitute `<your IP address>` in the command. For example, you can use [What's My IP Address?](https://www.whatismyip.com/).

1. Create a database named `restaurant` in the server by using the [az postgres flexible-server execute](/cli/azure/postgres/flexible-server#az-postgres-flexible-server-execute) command.

    ```azurecli
    az postgres flexible-server execute \
      --name $DB_SERVER_NAME \
      --admin-user $ADMIN_USER \
      --admin-password $ADMIN_PW \
      --database-name postgres \
      --querytext 'create database restaurant;'
    ```

## Create a passwordless service connection

Use [az webapp connection create postgres-flexible](/cli/azure/webapp/connection/create#az-webapp-connection-create-postgres-flexible) to add a service connector that connects the Azure web app to the Postgres database using passwordless managed identity authentication. The following command configures Azure Database for PostgreSQL to use managed identity and Azure role-based access control. The command output lists the actions Service Connector takes.

The command creates an environment variable named `AZURE_POSTGRESQL_CONNECTIONSTRING` that provides the database connection information for the app. The app code accesses app environment variables with statements like `os.environ.get('AZURE_POSTGRESQL_HOST')`. For more information, see [Access environment variables](/azure/app-service/configure-language-python#access-environment-variables).

```azurecli
az webapp connection create postgres-flexible \
  --resource-group $RESOURCE_GROUP_NAME \
  --name $APP_SERVICE_NAME \
  --target-resource-group $RESOURCE_GROUP_NAME \
  --server $DB_SERVER_NAME \
  --database restaurant \
  --client-type python \
  --system-identity
```

## Create and connect to a storage account

Use [az webapp connection create storage-blob](/cli/azure/webapp/connection/create#az-webapp-connection-create-storage-blob) to create an Azure storage account and a service connector. The command takes the following actions:

* Enables system-assigned managed identity on the web app.
* Adds the web app with role **Storage Blob Data Contributor** to the new storage account.
* Configures the storage account network to accept access from the web app.
* Creates an environment variable named `AZURE_STORAGEBLOB_RESOURCEENDPOINT` for the Azure Storage account.

1. Run the following command to create the storage account and connection:

    ```azurecli
    STORAGE_ACCOUNT_URL=$(az webapp connection create storage-blob \
      --new true \
      --resource-group $RESOURCE_GROUP_NAME \
      --name $APP_SERVICE_NAME \
      --target-resource-group $RESOURCE_GROUP_NAME \
      --client-type python \
      --system-identity \
      --query configurations[].value \
      --output tsv)
    STORAGE_ACCOUNT_NAME=$(cut -d . -f1 <<< $(cut -d / -f3 <<< $STORAGE_ACCOUNT_URL))
    ```
1. Update the storage account to allow blob public access for app users to access photos.

    ```azurecli
     az storage account update  \
       --name $STORAGE_ACCOUNT_NAME \
       --allow-blob-public-access 
    ```

1. Use [az storage container create](/cli/azure/storage/container#az-storage-container-create) to create a container called `photos` in the storage account, and allow anonymous public read access to blobs in the new container.

    ```azurecli
    # Set the BLOB_ENDPOINT variable
    BLOB_ENDPOINT=$(az storage account show --name $STORAGE_ACCOUNT_NAME --query "primaryEndpoints.blob" | sed 's/"//g')
    echo $BLOB_ENDPOINT

    # Create the storage container using the BLOB_ENDPOINT variable
    az storage container create \
      --account-name $STORAGE_ACCOUNT_NAME \
      --name photos \
      --public-access blob \
      --auth-mode login \
      --blob-endpoint $BLOB_ENDPOINT
    ```

## Test the Python web app in Azure

Open and test the Azure Restaurant Review web app. The app uses the [azure.identity](https://pypi.org/project/azure-identity/) package and its `DefaultAzureCredential` class. When the app is running in Azure, the `DefaultAzureCredential` automatically detects when a managed identity exists for the App Service, and uses it to access the Azure Storage and Azure Database for PostgreSQL resources. The app doesn't need to provide storage keys, certificates, or credentials to access these resources.

- For a local Azure CLI installation, you can use [`az webapp browse`](/cli/azure/webapp#az-webapp-browse) to open the app in your default browser:

  ```azurecli
  az webapp browse --name $APP_SERVICE_NAME.azurewebsites.net --resource-group $RESOURCE_GROUP_NAME
  ```

- Azure Cloud Shell can't open a local browser, so it doesn't support the `az webapp browse` command. From Cloud Shell, the easiest way to open the web app is to select the **Default domain** link at upper right on the app's Azure portal page. 

It can take a minute or two for the app to start. If you see a default app page that isn't the sample app, wait a minute and refresh the browser.

Test the functionality of the sample app by adding a restaurant and some reviews with photos. The app should resemble the following screenshot:

:::image type="content" source="media/tutorial-django-webapp-postgres-cli/example-of-review-sample-app-production-deployed-small.png" lightbox="media/tutorial-django-webapp-postgres-cli/example-of-review-sample-app-production-deployed.png" alt-text="Screenshot of the sample app showing restaurant review functionality using App Service, Azure Database for PostgreSQL, and Azure Storage." :::

## Clean up resources

To avoid ongoing charges, you can delete the resources you created for this tutorial by deleting the resource group that contains them. Be sure you no longer need the app or the resources before you run the command.

```azurecli
az group delete --name $RESOURCE_GROUP_NAME --no-wait
```

Deleting all the resources can take some time. The `--no-wait` argument allows the command to return immediately.

## Troubleshooting

If you have issues running this tutorial, see the following resources:

- [Troubleshoot Linux Python apps for Azure App Service](/azure/app-service/configure-language-python#troubleshooting)
- [Request support](https://aka.ms/DjangoCLITutorialHelp)

## Related content

- [Quickstart: Connect Azure App Service to databases and services with Service Connector](quickstart-portal-app-service-connection.md)
- [Create service connections using IaC tools](how-to-build-connections-with-iac-tools.md)
- [Deploy a Python Django web app with PostgreSQL in Azure](/azure/app-service/tutorial-python-postgresql-app-django)

