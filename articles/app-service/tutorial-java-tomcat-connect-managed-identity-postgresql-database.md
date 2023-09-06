---
title: 'Tutorial: Access data with managed identity in Java'
description: Secure Azure Database for PostgreSQL connectivity with managed identity from a sample Java Tomcat app, and apply it to other Azure services.
ms.devlang: java
ms.topic: tutorial
ms.date: 08/14/2023
author: KarlErickson
ms.author: karler
ms.custom: passwordless-java, service-connector, devx-track-azurecli, devx-track-extended-java, AppServiceConnectivity
---

# Tutorial: Connect to a PostgreSQL Database from Java Tomcat App Service without secrets using a managed identity

[Azure App Service](overview.md) provides a highly scalable, self-patching web hosting service in Azure. It also provides a [managed identity](overview-managed-identity.md) for your app, which is a turn-key solution for securing access to [Azure Database for PostgreSQL](../postgresql/index.yml) and other Azure services. Managed identities in App Service make your app more secure by eliminating secrets from your app, such as credentials in the environment variables. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a PostgreSQL database.
> * Deploy the sample app to Azure App Service on Tomcat using WAR packaging.
> * Configure a Spring Boot web application to use Azure AD authentication with PostgreSQL Database.
> * Connect to PostgreSQL Database with Managed Identity using Service Connector.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

* [Git](https://git-scm.com/)
* [Java JDK](/azure/developer/java/fundamentals/java-support-on-azure)
* [Maven](https://maven.apache.org)
* [Azure CLI](/cli/azure/install-azure-cli) version 2.45.0 or higher.

## Clone the sample app and prepare the repo

Run the following commands in your terminal to clone the sample repo and set up the sample app environment.

```bash
git clone https://github.com/Azure-Samples/Passwordless-Connections-for-Java-Apps
cd Passwordless-Connections-for-Java-Apps/Tomcat/
```

## Create an Azure Database for PostgreSQL

Follow these steps to create an Azure Database for Postgres in your subscription. The Spring Boot app connects to this database and store its data when running, persisting the application state no matter where you run the application.

1. Sign into the Azure CLI, and optionally set your subscription if you have more than one connected to your login credentials.

   ```azurecli-interactive
   az login
   az account set --subscription <subscription-ID>
   ```

1. Create an Azure Resource Group, noting the resource group name.

   ```azurecli-interactive
   export RESOURCE_GROUP=<resource-group-name>
   export LOCATION=eastus

   az group create --name $RESOURCE_GROUP --location $LOCATION
   ```

1. Create an Azure Database for PostgreSQL server. The server is created with an administrator account, but it isn't used because we're going to use the Azure Active Directory (Azure AD) admin account to perform administrative tasks.

   ### [Flexible Server](#tab/flexible)

   ```azurecli-interactive
   export POSTGRESQL_ADMIN_USER=azureuser
   # PostgreSQL admin access rights won't be used because Azure AD authentication is leveraged to administer the database.
   export POSTGRESQL_ADMIN_PASSWORD=<admin-password>
   export POSTGRESQL_HOST=<postgresql-host-name>

   # Create a PostgreSQL server.
   az postgres flexible-server create \
       --resource-group $RESOURCE_GROUP \
       --name $POSTGRESQL_HOST \
       --location $LOCATION \
       --admin-user $POSTGRESQL_ADMIN_USER \
       --admin-password $POSTGRESQL_ADMIN_PASSWORD \
       --public-access 0.0.0.0 \
       --sku-name Standard_D2s_v3
   ```

   ### [Single Server](#tab/single)

   ```azurecli-interactive
   export POSTGRESQL_ADMIN_USER=azureuser
   # PostgreSQL admin access rights won't be used because Azure AD authentication is leveraged to administer the database.
   export POSTGRESQL_ADMIN_PASSWORD=<admin-password>
   export POSTGRESQL_HOST=<postgresql-host-name>

   # Create a PostgreSQL server.
   az postgres server create \
       --resource-group $RESOURCE_GROUP \
       --name $POSTGRESQL_HOST \
       --location $LOCATION \
       --admin-user $POSTGRESQL_ADMIN_USER \
       --admin-password $POSTGRESQL_ADMIN_PASSWORD \
       --public-access 0.0.0.0 \
       --sku-name B_Gen5_1
   ```

1. Create a database for the application.

   ### [Flexible Server](#tab/flexible)

   ```azurecli-interactive
   export DATABASE_NAME=checklist

   az postgres flexible-server db create \
       --resource-group $RESOURCE_GROUP \
       --server-name $POSTGRESQL_HOST \
       --database-name $DATABASE_NAME
   ```

   ### [Single Server](#tab/single)

   ```azurecli-interactive
   export DATABASE_NAME=checklist

   az postgres db create \
       --resource-group $RESOURCE_GROUP \
       --server-name $POSTGRESQL_HOST \
       --name $DATABASE_NAME
   ```

## Deploy the application to App Service

Follow these steps to build a WAR file and deploy to Azure App Service on Tomcat using a WAR packaging.

1. The sample app contains a *pom.xml* file that can generate the WAR file. Run the following command to build the app.

   ```bash
   mvn clean package -f pom.xml
   ```

1. Create an Azure App Service resource on Linux using Tomcat 9.0.

   ```azurecli-interactive
   export APPSERVICE_PLAN=<app-service-plan>
   export APPSERVICE_NAME=<app-service-name>
   # Create an App Service plan
   az appservice plan create \
       --resource-group $RESOURCE_GROUP \
       --name $APPSERVICE_PLAN \
       --location $LOCATION \
       --sku B1 \
       --is-linux

   # Create an App Service resource.
   az webapp create \
       --resource-group $RESOURCE_GROUP \
       --name $APPSERVICE_NAME \
       --plan $APPSERVICE_PLAN \
       --runtime "TOMCAT:10.0-java11"
   ```

1. Deploy the WAR package to App Service.

   ```azurecli-interactive
   az webapp deploy \
       --resource-group $RESOURCE_GROUP \
       --name $APPSERVICE_NAME \
       --src-path target/app.war \
       --type war
   ```

## Connect the Postgres database with identity connectivity

Next, connect the database using [Service Connector](../service-connector/overview.md).

Install the Service Connector passwordless extension for the Azure CLI:

```azurecli
az extension add --name serviceconnector-passwordless --upgrade
```

Then, connect your app to a Postgres database with a system-assigned managed identity using Service Connector.

### [Flexible Server](#tab/flexible)

To make this connection, run the [az webapp connection create](/cli/azure/webapp/connection/create#az-webapp-connection-create-postgres-flexible) command.

```azurecli-interactive
az webapp connection create postgres-flexible \
    --resource-group $RESOURCE_GROUP \
    --name $APPSERVICE_NAME \
    --target-resource-group $RESOURCE_GROUP \
    --server $POSTGRESQL_HOST \
    --database $DATABASE_NAME \
    --system-identity \
    --client-type java
```

### [Single Server](#tab/single)

To make this connection, run the [az webapp connection create](/cli/azure/webapp/connection/create#az-webapp-connection-create-postgres) command.

```azurecli-interactive
az webapp connection create postgres \
    --resource-group $RESOURCE_GROUP \
    --name $APPSERVICE_NAME \
    --target-resource-group $RESOURCE_GROUP \
    --server $POSTGRESQL_HOST \
    --database $DATABASE_NAME \
    --system-identity \
    --client-type java
```

---

This command creates a connection between your web app and your PostgreSQL server, and manages authentication through a system-assigned managed identity.

Next, update App Settings and add plugin in connection string

```azurecli-interactive
export AZURE_POSTGRESQL_CONNECTIONSTRING=$(\
    az webapp config appsettings list \
        --resource-group $RESOURCE_GROUP \
        --name $APPSERVICE_NAME \
    | jq -c -r '.[] \
    | select ( .name == "AZURE_POSTGRESQL_CONNECTIONSTRING" ) \
    | .value')

az webapp config appsettings set \
    --resource-group $RESOURCE_GROUP \
    --name $APPSERVICE_NAME \
    --settings 'CATALINA_OPTS=-DdbUrl="'"${AZURE_POSTGRESQL_CONNECTIONSTRING}"'&authenticationPluginClassName=com.azure.identity.extensions.jdbc.postgresql.AzurePostgresqlAuthenticationPlugin"'
```

## Test the sample web app

Run the following command to test the application.

```bash
export WEBAPP_URL=$(az webapp show \
    --resource-group $RESOURCE_GROUP \
    --name $APPSERVICE_NAME \
    --query defaultHostName \
    --output tsv)

# Create a list
curl -X POST -H "Content-Type: application/json" -d '{"name": "list1","date": "2022-03-21T00:00:00","description": "Sample checklist"}' https://${WEBAPP_URL}/checklist

# Create few items on the list 1
curl -X POST -H "Content-Type: application/json" -d '{"description": "item 1"}' https://${WEBAPP_URL}/checklist/1/item
curl -X POST -H "Content-Type: application/json" -d '{"description": "item 2"}' https://${WEBAPP_URL}/checklist/1/item
curl -X POST -H "Content-Type: application/json" -d '{"description": "item 3"}' https://${WEBAPP_URL}/checklist/1/item

# Get all lists
curl https://${WEBAPP_URL}/checklist

# Get list 1
curl https://${WEBAPP_URL}/checklist/1
```

[!INCLUDE [cli-samples-clean-up](../../includes/cli-samples-clean-up.md)]

## Next steps

Learn more about running Java apps on App Service on Linux in the developer guide.

> [!div class="nextstepaction"]
> [Java in App Service Linux dev guide](configure-language-java.md?pivots=platform-linux)

Learn how to secure your app with a custom domain and certificate.

> [!div class="nextstepaction"]
> [Secure with custom domain and certificate](tutorial-secure-domain-certificate.md)
