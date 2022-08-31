---
title: 'Tutorial: Access data with managed identity in Java using Service Connector'
description: Secure Azure Database for PostgreSQL connectivity with managed identity from a sample Java app, and also how to apply it to other Azure services.

ms.devlang: java
ms.topic: tutorial
ms.date: 09/22/2022
---
# Tutorial: Connect to PostgreSQL Database from Java Quarkus Container App without secrets using a managed identity

[Container Apps](overview.md) provides a [managed identity](managed-identity.md) for your app, which is a turn-key solution for securing access to [Azure Database for PostgreSQL](/azure/postgresql/) and other Azure services. Managed identities in Container Apps make your app more secure by eliminating secrets from your app, such as credentials in the environment variables. 

This tutorial walks you through the process of building, configuring, deploying, and scaling Java container apps on Azure. 
When you are finished, you will have a [Quarkus](https://quarkus.io) application storing data in [PostgreSQL](../postgresql/index.yml) database with Managed Identity running on [Container Apps](overview.md).


What you will learn:

> [!div class="checklist"]

> * Configure Quarkus app to use Azure AD authentication with PostgreSQL Database
> * Create a Azure Container Registry and push Java app image to it
> * Create a Container App on Azure
> * Create a PostgreSQL database on Azure
> * Connect to PostgreSQL Database with Managed Identity using Service Connector

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## 1. Prerequisites

* [Azure CLI](/cli/azure/overview), installed on your own computer. 
* [Git](https://git-scm.com/)
* [Java JDK](/azure/developer/java/fundamentals/java-support-on-azure)
* [Maven](https://maven.apache.org)
* [Docker](https://docs.docker.com/get-docker/)
* [GraalVM](https://www.graalvm.org/downloads/)


## 2. Create a Container Registry

## 3. Clone the sample app and prepare the container image

This tutorial uses a sample Fruits list app with a web UI that calls a Quarkus REST API backed by [Azure Database for PostgreSQL](../postgresql/index.yml). The code for the app is available [on GitHub](https://github.com/quarkusio/quarkus-quickstarts/tree/main/hibernate-orm-panache-quickstart). To learn more about writing Java apps using Quarkus and PostgreSQL, see the [Quarkus Hibernate ORM with Panache Guide](https://quarkus.io/guides/hibernate-orm-panache) and the [Quarkus Datasource Guide](https://quarkus.io/guides/datasource).


Run the following commands in your terminal to clone the sample repo and set up the sample app environment.

```bash
git clone https://github.com/quarkusio/quarkus-quickstarts
cd quarkus-quickstarts/hibernate-orm-panache-quickstart
```


### Modify your project

1. Add the required dependencies to your project's BOM file.

    ```xml
    <dependency>
        <groupId>io.quarkus</groupId>
        <artifactId>quarkus-oidc</artifactId>
    </dependency>
    ```

1. Configure the Quarkus app properties

    Quarkus configuration is located in the `src/main/resources/application.properties` file. Open this file in your editor, and observe several default properties. The properties prefixed with `%prod` are only used when the application is built and deployed, for example when deployed to Azure App Service. When the application runs locally, `%prod` properties are ignored.  Similarly, `%dev` properties are used in Quarkus' Live Coding / Dev mode, and `%test` properties are used during continuous testing.

    Delete the existing content in `application.properties` and replace with the following to configure our database for dev, test, and production modes:

    ```properties
    quarkus.package.type=uber-jar
    %dev.quarkus.datasource.db-kind=h2
    %dev.quarkus.datasource.jdbc.url=jdbc:h2:mem:fruits

    %test.quarkus.datasource.db-kind=h2
    %test.quarkus.datasource.jdbc.url=jdbc:h2:mem:fruits

    %prod.quarkus.datasource.db-kind=postgresql
    %prod.quarkus.datasource.jdbc.url=jdbc:postgresql://${DBHOST}.postgres.database.azure.com:5432/${DBNAME}?user=${DBUSER}@${DBHOST}&password=${DBPASS}
    %prod.quarkus.hibernate-orm.sql-load-script=import.sql

    quarkus.hibernate-orm.database.generation=drop-and-create
    ```

### Build and push Docker Image to the container registry

## 2. Create a Container App on Azure

## 3. Connect Postgres Database with identity connectivity

Next, you configure your App Service app to connect to SQL Database with a system-assigned managed identity.

### Connect to Postgres Database using Service Connector

To enable a managed identity for your Azure app, use the [az webapp connection create](/cli/azure/webapp/identity#az-webapp-identity-assign) command in the Cloud Shell. In the following command, replace *\<app-name>*.

```azurecli-interactive
az containerapp connection create --resource-group myResourceGroup --name <app-name>
```


## 3. Review your changes

You can then access the application using the following command:

```azurecli
az containerapp
```

When the new webpage shows your to-do list, your app is connecting to the database using the managed identity.

You should now be able to edit the to-do list as before.

[!INCLUDE [cli-samples-clean-up](../../includes/cli-samples-clean-up.md)]
> [!div class="nextstepaction"]
> [Map an existing custom DNS name to Azure App Service](app-service-web-tutorial-custom-domain.md)

## Next steps