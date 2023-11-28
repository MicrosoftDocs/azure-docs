---
author: xiaofanzhou
ms.service: service-connector
ms.custom: devx-track-azurecli
ms.topic: include
ms.date: 05/21/2023
ms.author: xiaofanzhou
---

### Install the Service Connector passwordless extension

[!INCLUDE [CLI-samples-clean-up](./install-passwordless-extension.md)]

## Create a passwordless connection

Next, we use Azure App Service as an example to create a connection using managed identity.

If you use:

* Azure Spring Apps: use `az spring connection create` instead. For more examples, see [Connect Azure Spring Apps to the Azure database](/azure/developer/java/spring-framework/deploy-passwordless-spring-database-app#connect-azure-spring-apps-to-the-azure-database).
* Azure Container Apps: use `az containerapp connection create` instead. For more examples, see [Create and connect a PostgreSQL database with identity connectivity](../../container-apps/tutorial-java-quarkus-connect-managed-identity-postgresql-database.md?tabs=flexible#5-create-and-connect-a-postgresql-database-with-identity-connectivity).

> [!NOTE]
> If you use the Azure portal, go to the **Service Connector** blade of [Azure App Service](../quickstart-portal-app-service-connection.md), [Azure Spring Apps](../quickstart-portal-spring-cloud-connection.md), or [Azure Container Apps](../quickstart-portal-container-apps.md), and select **Create** to create a connection. The Azure portal will automatically compose the command for you and trigger the command execution on Cloud Shell.

::: zone pivot="postgresql"

The following Azure CLI command uses a `--client-type` parameter. Run the `az webapp connection create postgres-flexible -h` to get the supported client types, and choose the one that matches your application.

### [User-assigned managed identity](#tab/user)

```azurecli-interactive
az webapp connection create postgres-flexible \
    --resource-group $RESOURCE_GROUP \
    --name $APPSERVICE_NAME \
    --target-resource-group $RESOURCE_GROUP \
    --server $POSTGRESQL_HOST \
    --database $DATABASE_NAME \
    --user-identity client-id=XX subs-id=XX \
    --client-type java
```

### [System-assigned managed identity](#tab/system)

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

### [Service principal](#tab/sp)

```azurecli-interactive
az webapp connection create postgres-flexible \
    --resource-group $RESOURCE_GROUP \
    --name $APPSERVICE_NAME \
    --target-resource-group $RESOURCE_GROUP \
    --server $POSTGRESQL_HOST \
    --database $DATABASE_NAME \
    --service-principal client-id=XX secret=XX\
    --client-type java
```

::: zone-end


::: zone pivot="mysql"

Azure Database for MySQL - Flexible Server requires a user-assigned managed identity to enable Microsoft Entra authentication. For more information, see [Set up Microsoft Entra authentication for Azure Database for MySQL - Flexible Server](../../mysql/flexible-server/how-to-azure-ad.md). You can use the following command to create a user-assigned managed identity:

```azurecli-interactive
USER_IDENTITY_NAME=<YOUR_USER_ASSIGNED_MANAGEMED_IDENTITY_NAME>
IDENTITY_RESOURCE_ID=$(az identity create \
    --name $USER_IDENTITY_NAME \
    --resource-group $RESOURCE_GROUP \
    --query id \
    --output tsv)
```

> [!IMPORTANT]
> After creating the user-assigned managed identity, ask your Global Administrator or Privileged Role Administrator to grant the following permissions for this identity:

* `User.Read.All`
* `GroupMember.Read.All`
* `Application.Read.All`

For more information, see the [Permissions](../../mysql/flexible-server/concepts-azure-ad-authentication.md#permissions) section of [Active Directory authentication](../../mysql/flexible-server/concepts-azure-ad-authentication.md).

Then, connect your app to a MySQL database with a system-assigned managed identity using Service Connector.

The following Azure CLI command uses a `--client-type` parameter. Run the `az webapp connection create mysql-flexible -h` to get the supported client types, and choose the one that matches your application.

### [User-assigned managed identity](#tab/user)

```azurecli-interactive
az webapp connection create mysql-flexible \
    --resource-group $RESOURCE_GROUP \
    --name $APPSERVICE_NAME \
    --target-resource-group $RESOURCE_GROUP \
    --server $MYSQL_HOST \
    --database $DATABASE_NAME \
    --user-identity client-id=XX subs-id=XX mysql-identity-id=$IDENTITY_RESOURCE_ID \
    --client-type java
```

### [System-assigned managed identity](#tab/system)

```azurecli-interactive
az webapp connection create mysql-flexible \
    --resource-group $RESOURCE_GROUP \
    --name $APPSERVICE_NAME \
    --target-resource-group $RESOURCE_GROUP \
    --server $MYSQL_HOST \
    --database $DATABASE_NAME \
    --system-identity mysql-identity-id=$IDENTITY_RESOURCE_ID \
    --client-type java
```

### [Service principal](#tab/sp)

```azurecli-interactive
az webapp connection create mysql-flexible \
    --resource-group $RESOURCE_GROUP \
    --name $APPSERVICE_NAME \
    --target-resource-group $RESOURCE_GROUP \
    --server $MYSQL_HOST \
    --database $DATABASE_NAME \
    --service-principal client-id=XX secret=XX mysql-identity-id=$IDENTITY_RESOURCE_ID \
    --client-type java
```

::: zone-end


::: zone pivot="sql"

The following Azure CLI command uses a `--client-type` parameter. Run the `az webapp connection create sql -h` to get the supported client types, and choose the one that matches your application.

### [User-assigned managed identity](#tab/user)

```azurecli-interactive
az webapp connection create sql \
    --resource-group $RESOURCE_GROUP \
    --name $APPSERVICE_NAME \
    --target-resource-group $RESOURCE_GROUP \
    --server $SQL_HOST \
    --database $DATABASE_NAME \
    --user-identity client-id=XX subs-id=XX \
    --client-type dotnet
```

### [System-assigned managed identity](#tab/system)

```azurecli-interactive
az webapp connection create sql \
    --resource-group $RESOURCE_GROUP \
    --name $APPSERVICE_NAME \
    --target-resource-group $RESOURCE_GROUP \
    --server $SQL_HOST \
    --database $DATABASE_NAME \
    --system-identity \
    --client-type dotnet
```

### [Service principal](#tab/sp)

```azurecli-interactive
az webapp connection create sql \
    --resource-group $RESOURCE_GROUP \
    --name $APPSERVICE_NAME \
    --target-resource-group $RESOURCE_GROUP \
    --server $SQL_HOST \
    --database $DATABASE_NAME \
    --service-principal client-id=XX secret=XX \
    --client-type dotnet
```

::: zone-end

This Service Connector command completes the following tasks in the background:

* Enable system-assigned managed identity, or assign a user identity for the app `$APPSERVICE_NAME` hosted by Azure App Service/Azure Spring Apps/Azure Container Apps.
* Set the Microsoft Entra admin to the current signed-in user.
* Add a database user for the system-assigned managed identity, user-assigned managed identity, or service principal. Grant all privileges of the database `$DATABASE_NAME` to this user. The username can be found in the connection string in preceding command output.
* Set configurations named `AZURE_MYSQL_CONNECTIONSTRING`, `AZURE_POSTGRESQL_CONNECTIONSTRING`, or `AZURE_SQL_CONNECTIONSTRING` to the Azure resource based on the database type.
  * For App Service, the configurations are set in the **App Settings** blade.
  * For Spring Apps, the configurations are set when the application is launched.
  * For Container Apps, the configurations are set to the environment variables. You can get all configurations and their values in the **Service Connector** blade in the Azure portal.

## Connect to a database with Microsoft Entra authentication

After creating the connection, you can use the connection string in your application to connect to the database with Microsoft Entra authentication. For example, you can use the following solutions to connect to the database with Microsoft Entra authentication.

:::zone pivot="postgresql"


[!INCLUDE [code sample for postgres Microsoft Entra authentication connection](./code-postgres-me-id.md)]


:::zone-end

:::zone pivot="mysql"

[!INCLUDE [code sample for mysql Microsoft Entra authentication connection](./code-mysql-me-id.md)]


:::zone-end


:::zone pivot="sql"


[!INCLUDE [code sample for sql Microsoft Entra authentication connection](./code-sql-me-id.md)]


:::zone-end
