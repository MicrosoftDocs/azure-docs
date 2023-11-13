---
author: xiaofanzhou
ms.service: service-connector
ms.topic: include
ms.date: 10/18/2023
ms.author: xiaofanzhou
---

## 1. Install the Service Connector passwordless extension

[!INCLUDE [CLI-samples-clean-up](./install-passwordless-extension.md)]

## 2. Create a passwordless connection

Next, create a passwordless connection with Service Connector.

> [!TIP]
> The Azure portal can help you compose the commands below. In the Azure portal, go to your [Azure App Service](../quickstart-portal-app-service-connection.md) resource, select **Service Connector** from the left menu and select **Create**. Fill out the form with all required parameters. Azure automaticaly generates the connection creation command, which you can copy to use in the CLI or execute in Azure Cloud Shell.

# [Azure SQL Database](#tab/sqldatabase-sc)

The following Azure CLI command uses a `--client-type` parameter.

1. Optionally run the `az webapp connection create sql -h` to get the supported client types.

1. Choose a client type and run the corresponding command. Replace the placeholders below with your own information.

    # [User-assigned managed identity](#tab/userassigned-sc)

    ```azurecli-interactive
    az webapp connection create sql \
        --resource-group <group-name> \
        --name <server-name> \
        --target-resource-group <sql-group-name> \
        --server <sql-name> \
        --database <database-name> \
        --user-identity client-id=<client-id> subs-id=<subscription-id> \
        --client-type <client-type>
    ```

    # [System-assigned managed identity](#tab/systemassigned-sc)

    ```azurecli-interactive
    az webapp connection create sql \
        --resource-group <group-name> \
        --name <server-name> \
        --target-resource-group <group-name> \
        --server <sql-name> \
        --database <database-name> \
        --system-identity \
        --client-type <client-type>
    ```

    -----

# [Azure Database for MySQL](#tab/mysql-sc)

Azure Database for MySQL - Flexible Server requires a user-assigned managed identity to enable Microsoft Entra authentication. For more information, see [Set up Microsoft Entra authentication for Azure Database for MySQL - Flexible Server](../../mysql/flexible-server/how-to-azure-ad.md). You can use the following command to create a user-assigned managed identity:

```azurecli-interactive
USER_IDENTITY_NAME=<YOUR_USER_ASSIGNED_MANAGEMED_IDENTITY_NAME>
IDENTITY_RESOURCE_ID=$(az identity create \
    --name $USER_IDENTITY_NAME \
    --resource-group <group-name> \
    --query id \
    --output tsv)
```

After creating the user-assigned managed identity, ask your *Global Administrator* or *Privileged Role Administrator* to grant the following permissions for this identity:

* `User.Read.All`
* `GroupMember.Read.All`
* `Application.Read.All`

For more information, see the [Permissions](../../mysql/flexible-server/concepts-azure-ad-authentication.md#permissions) section of [Microsoft Entra authentication](../../mysql/flexible-server/concepts-azure-ad-authentication.md).

Then, connect your app to a MySQL database with a system-assigned managed identity using Service Connector.

The following Azure CLI command uses a `--client-type` parameter.

1. Optionally run the command `az webapp connection create mysql-flexible -h` to get the supported client types.

1. Choose a client type and run the corresponding command.

    # [User-assigned managed identity](#tab/userassigned-sc)

    ```azurecli-interactive
    az webapp connection create mysql-flexible \
        --resource-group <group-name> \
        --name <server-name> \
        --target-resource-group <group-name> \
        --server <mysql-name> \
        --database <database-name> \
        --user-identity client-id=XX subs-id=XX mysql-identity-id=$IDENTITY_RESOURCE_ID \
        --client-type <client-type>
    ```

    # [System-assigned managed identity](#tab/systemassigned-sc)

    ```azurecli-interactive
    az webapp connection create mysql-flexible \
    --resource-group <group-name> \
    --name <server-name> \
    --target-resource-group <group-name> \
    --server <mysql-name> \
    --database <database-name> \
    --system-identity mysql-identity-id=$IDENTITY_RESOURCE_ID \
    --client-type <client-type>
    ```

    -----

# [Azure Database for PostgreSQL](#tab/postgresql-sc)

The following Azure CLI command uses a `--client-type` parameter.

1. Optionally run the command `az webapp connection create postgres-flexible -h` to get a list of all supported client types.

1. Choose a client type and run the corresponding command.

    # [User-assigned managed identity](#tab/userassigned-sc)

    ```azurecli-interactive
    az webapp connection create postgres-flexible \
        --resource-group <group-name> \
        --name <server-name> \
        --target-resource-group <group-name> \
        --server <postgresql-name> \
        --database <database-name> \
        --user-identity client-id=XX subs-id=XX \
        --client-type java
    ```

    # [System-assigned managed identity](#tab/systemassigned-sc)

    ```azurecli-interactive
    az webapp connection create postgres-flexible \
        --resource-group <group-name> \
        --name <server-name> \
        --target-resource-group <group-name> \
        --server <postgresql-name> \
        --database <database-name> \
        --system-identity \
        --client-type <client-type>
    ```

    -----

1. Grant permission to pre-created tables

[!INCLUDE [Postgresql grant permission](./postgres-grant-permission.md)]

-----

This Service Connector command completes the following tasks in the background:

* Enable system-assigned managed identity, or assign a user identity for the app `<server-name>` hosted by Azure App Service.
* Set the Microsoft Entra admin to the current signed-in user.
* Add a database user for the system-assigned managed identity or user-assigned managed identity. Grant all privileges of the database `<database-name>` to this user. The username can be found in the connection string in preceding command output.
* Set configurations named `AZURE_MYSQL_CONNECTIONSTRING`, `AZURE_POSTGRESQL_CONNECTIONSTRING`, or `AZURE_SQL_CONNECTIONSTRING` to the Azure resource based on the database type.
* For App Service, the configurations are set in the **App Settings** blade.

If you encounter any problem when creating a connection, refer to [Troubleshooting](../tutorial-passwordless.md#troubleshooting) for help.

## 3. Modify your code

In this section, connectivity to the Azure database in your code follows the `DefaultAzureCredential` pattern for all language stacks. `DefaultAzureCredential` is flexible enough to adapt to both the development environment and the Azure environment. When running locally, it can retrieve the logged-in Azure user from the environment of your choice (Visual Studio, Visual Studio Code, Azure CLI, or Azure PowerShell). When running in Azure, it retrieves the managed identity. So it's possible to have connectivity to database both at development time and in production. The pattern is as follows:

1. Instantiate a `DefaultAzureCredential` from the Azure Identity client library. If you're using a user-assigned identity, specify the client ID of the identity.
2. Get an access token for the resource URI respective to the database type.
    * For Azure SQL Database: `https://database.windows.net/.default`
    * For Azure Database for MySQL: `https://ossrdbms-aad.database.windows.net/.default`
    * For Azure Database for PostgreSQL: `https://ossrdbms-aad.database.windows.net/.default`
3. Add the token to your connection string.
4. Open the connection.

# [Azure SQL Database](#tab/sqldatabase-sc)

[!INCLUDE [code sample for postgres managed identity authentication connection](./code-sql-mi.md)]

# [Azure Database for MySQL](#tab/mysql-sc)

[!INCLUDE [code sample for mysql managed identity authentication connection](./code-mysql-mi.md)]

# [Azure Database for PostgreSQL](#tab/postgresql-sc)

[!INCLUDE [code sample for sql managed identity authentication connection](./code-postgres-mi.md)]


-----

