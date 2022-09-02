---
title: 'Tutorial: Access data with managed identity in Java'
description: Secure Azure Database for PostgreSQL connectivity with managed identity from a sample Java Spring app, and also how to apply it to other Azure services.

ms.devlang: java
ms.topic: tutorial
ms.date: 09/22/2022
---
# Tutorial: Connect to PostgreSQL Database from Java Quarkus App Service without secrets using a managed identity

[App Service](overview.md) provides a highly scalable, self-patching web hosting service in Azure. It also provides a [managed identity](overview-managed-identity.md) for your app, which is a turn-key solution for securing access to [Azure Database for PostgreSQL](/azure/postgresql/) and other Azure services. Managed identities in App Service make your app more secure by eliminating secrets from your app, such as credentials in the environment variables. In this tutorial, you will learn:

> [!div class="checklist"]
> * Create a Postgres database.
> * Deploy the sample app to Azure
> * Configure Spring Boot web application to use Azure AD authentication with PostgreSQL Database
> * Connect to PostgreSQL Database with Managed Identity using Service Connector

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

* [Git](https://git-scm.com/)
* [Java JDK](/azure/developer/java/fundamentals/java-support-on-azure)
* [Maven](https://maven.apache.org)


## Clone the sample TODO app and prepare the repo

Run the following commands in your terminal to clone the sample repo and set up the sample app environment.

```bash
git clone https://github.com/azure/azure-sdk-for-java.git
cd azure-sdk-for-java/sdk/spring-experimental/samples/spring-credential-free
```

## Create an Azure Postgres DB
Follow these steps to create an Azure Database for Postgres in your subscription. The Spring Boot app will connect to this database and store its data when running, persisting the application state no matter where you run the application.

1. Login to your Azure CLI, and optionally set your subscription if you have more than one connected to your login credentials.

    ```Azure CLI
    az login
    az account set -s <your-subscription-id>
    ```

1. Create an Azure Resource Group, noting the resource group name.

    ```Azure CLI
    RESOURCE_GROUP=[YOUR RESOURCE GROUP]
    LOCATION=eastus

    az group create --name $RESOURCE_GROUP --location $LOCATION
    ```

1. Create Azure Postgres Database server. It is created with an administrator account, but it won't be used as it wil be used the Azure AD admin account to perform the administrative tasks.

    ```Azure CLI
    POSTGRESQL_ADMIN_USER=azureuser
    # postgres admin won't be used as Azure AD authentication is leveraged also for administering the database
    POSTGRESQL_ADMIN_PASSWORD=[YOUR ADMIN PASSWORD]
    POSTGRESQL_HOST=[YOUR POSTGRESQL HOST] 

    # create postgresql server
    az postgres server create \
        --name $POSTGRESQL_HOST \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION \
        --admin-user $POSTGRESQL_ADMIN_USER \
        --admin-password $POSTGRESQL_ADMIN_PASSWORD \
        --public-network-access 0.0.0.0 \
        --sku-name B_Gen5_1 
    ```

1. Create a database for the application

    ```Azure CLI
    DATABASE_NAME=checklist

    az postgres db create -g $RESOURCE_GROUP -s $POSTGRESQL_HOST -n $DATABASE_NAME
    ```


## 2. Connect Postgres Database with identity connectivity

Next, you configure your App Service app to connect to SQL Database with a system-assigned managed identity.

### Connect to Postgres Database using Service Connector

To enable a managed identity for your Azure app, use the [az webapp connection create](/cli/azure/webapp/identity#az-webapp-identity-assign) command in the Cloud Shell. In the following command, replace *\<app-name>*.

```azurecli-interactive
az webapp connection create --resource-group myResourceGroup --name <app-name>
```

### Modify application settings

Remember that the same changes you made in `application.properties` works with the managed identity, so the only thing to do is to remove the existing application settings in App Service.

```azurecli-interactive
az webapp config appsettings delete --name MyWebApp --resource-group MyResourceGroup --setting-names {setting-names}
```


## 3. Publish and review your changes

All that's left now is to publish your changes to Azure. Publish your changes using Azure CLI with the following command.

```azurecli
az webapp deploy \
    --resource-group $RESOURCE_GROUP \
    --name $WEBAPP_NAME \
    --src-path target/*.jar --type jar
```

You can then access the application using the following command:

```azurecli
az webapp browse \
    --resource-group $RESOURCE_GROUP \
    --name $WEBAPP_NAME
```

When the new webpage shows your to-do list, your app is connecting to the database using the managed identity.

You should now be able to edit the to-do list as before.

[!INCLUDE [cli-samples-clean-up](../../includes/cli-samples-clean-up.md)]

## Next steps

What you learned:

> [!div class="checklist"]
> * Enable managed identities
> * Grant SQL Database access to the managed identity
> * Configure Entity Framework to use Azure AD authentication with SQL Database
> * Connect to SQL Database from Visual Studio using Azure AD authentication

> [!div class="nextstepaction"]
> [Map an existing custom DNS name to Azure App Service](app-service-web-tutorial-custom-domain.md)

> [!div class="nextstepaction"]
> [Tutorial: Connect to Azure databases from App Service without secrets using a managed identity](tutorial-connect-msi-azure-database.md)

> [!div class="nextstepaction"]
> [Tutorial: Connect to Azure services that don't support managed identities (using Key Vault)](tutorial-connect-msi-key-vault.md)

> [!div class="nextstepaction"]
> [Tutorial: Isolate back-end communication with Virtual Network integration](tutorial-networking-isolate-vnet.md)
