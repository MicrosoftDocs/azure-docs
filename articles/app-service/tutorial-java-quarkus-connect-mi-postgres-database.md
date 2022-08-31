---
title: 'Tutorial: Access data with managed identity in Java'
description: Secure Azure Database for PostgreSQL connectivity with managed identity from a sample Java app, and also how to apply it to other Azure services.

ms.devlang: java
ms.topic: tutorial
ms.date: 09/22/2022
---
# Tutorial: Connect to PostgreSQL Database from Java Quarkus App Service without secrets using a managed identity

[App Service](overview.md) provides a highly scalable, self-patching web hosting service in Azure. It also provides a [managed identity](overview-managed-identity.md) for your app, which is a turn-key solution for securing access to [Azure Database for PostgreSQL](/azure/postgresql/) and other Azure services. Managed identities in App Service make your app more secure by eliminating secrets from your app, such as credentials in the environment variables. In this tutorial, you'll add managed identity to the sample Quarkus web app you built in the following tutorials: 

- [Tutorial: Tutorial: Linux Java app with Quarkus and PostgreSQL](tutorial-java-quarkus-postgresql-app.md)

When you're finished, your sample app will connect to PostgreSQL Database securely without the need of username and passwords.

What you will learn:

> [!div class="checklist"]
> * Configure Quarkus web application to use Azure AD authentication with PostgreSQL Database
> * Connect to PostgreSQL Database with Managed Identity using Service Connector

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

This article continues where you left off in the following tutorial:

- [Tutorial: Tutorial: Linux Java app with Quarkus and PostgreSQL](tutorial-java-quarkus-postgresql-app.md)

If you haven't already, follow one of the two tutorials first.

To debug your app using SQL Database as the back end, make sure that you've allowed client connection from your computer. If not, add the client IP by following the steps at [Manage server-level IP firewall rules using the Azure portal](/azure/azure-sql/database/firewall-configure#use-the-azure-portal-to-manage-server-level-ip-firewall-rules).


## 1. Modify your project

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
