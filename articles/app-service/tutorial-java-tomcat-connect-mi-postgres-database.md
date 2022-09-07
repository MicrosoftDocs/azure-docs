---
title: 'Tutorial: Access data with managed identity in Java'
description: Secure Azure Database for PostgreSQL connectivity with managed identity from a sample Java Tomcat app, and also how to apply it to other Azure services.

ms.devlang: java
ms.topic: tutorial
ms.date: 09/22/2022
---
# Tutorial: Connect to PostgreSQL Database from Java Tomcat App Service without secrets using a managed identity

[App Service](overview.md) provides a highly scalable, self-patching web hosting service in Azure. It also provides a [managed identity](overview-managed-identity.md) for your app, which is a turn-key solution for securing access to [Azure Database for PostgreSQL](/azure/postgresql/) and other Azure services. Managed identities in App Service make your app more secure by eliminating secrets from your app, such as credentials in the environment variables. In this tutorial, you will learn:

> [!div class="checklist"]
> * Create a Postgres database.
> * Deploy the sample app to Azure App Service on Tomcat using WAR packaging
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

    ```azurecli-interactive
    az login
    az account set -s <your-subscription-id>
    ```

1. Create an Azure Resource Group, noting the resource group name.

    ```azurecli-interactive
    RESOURCE_GROUP=[YOUR RESOURCE GROUP]
    LOCATION=eastus

    az group create --name $RESOURCE_GROUP --location $LOCATION
    ```

1. Create Azure Postgres Database server. It is created with an administrator account, but it won't be used as it wil be used the Azure AD admin account to perform the administrative tasks.

    ```azurecli-interactive
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

    ```azurecli-interactive
    DATABASE_NAME=checklist

    az postgres db create -g $RESOURCE_GROUP -s $POSTGRESQL_HOST -n $DATABASE_NAME
    ```

## Deploy the application on App Service
Follow these steps to build a WAR file and deploy to Azure App Service on Tomcat using WAR packaging.

Remember that the same changes you made in `application.properties` works with the managed identity, so the only thing to do is to remove the existing application settings in App Service.

1. The sample app contains a `pom-war.xml` file that can generate the WAR file. Run the following command to build the app.

    ```bash
    mvn clean package -f pom-war.xml
    ```

1. Create Azure App Service on Linux using Tomcat 9.0.


    ```azurecli-interactive
    # Create app service plan
    az appservice plan create --name $APPSERVICE_PLAN --resource-group $RESOURCE_GROUP --location $LOCATION --sku B1 --is-linux
    # Create application service
    az webapp create --name $APPSERVICE_NAME --resource-group $RESOURCE_GROUP --plan $APPSERVICE_PLAN --runtime "TOMCAT:9.0-jre8" 
    ```

1. Deploy the war package to App Service.


    ```azurecli-interactive
    # Create webapp deployment
    az webapp deploy --resource-group $RESOURCE_GROUP --name $APPSERVICE_NAME --src-path target/app.war --type war
    ```


## Connect Postgres Database with identity connectivity

Next, you configure your App Service app to connect to SQL Database with a system-assigned managed identity using Service Connector.

To enable a managed identity for your Azure app, use the [az webapp connection create](/cli/azure/webapp/identity#az-webapp-identity-assign) command.

```azurecli-interactive
az webapp connection create postgres --resource-group $RESOURCE_GROUP --name $APPSERVICE_NAME --system-assigned-identity
```

This command will do the following things,
    - TODO
    - TODO
    - TODO

## View sample web app

Run the following command to open the deployed web app in your browser.

```azurecli-interactive
az webapp browse --name MyWebapp --resource-group $RESOURCE_GROUP --name $APPSERVICE_NAME
```


[!INCLUDE [cli-samples-clean-up](../../includes/cli-samples-clean-up.md)]

## Next steps

[Azure for Java Developers](/java/azure/)
[Spring Boot](https://spring.io/projects/spring-boot), 
[Spring Data for Cosmos DB](/azure/developer/java/spring-framework/configure-spring-boot-starter-java-app-with-cosmos-db), 
[Azure Cosmos DB](../cosmos-db/introduction.md)
and
[App Service Linux](overview.md).

Learn more about running Java apps on App Service on Linux in the developer guide.

> [!div class="nextstepaction"] 
> [Java in App Service Linux dev guide](configure-language-java.md?pivots=platform-linux)
