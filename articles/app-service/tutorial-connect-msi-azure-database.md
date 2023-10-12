---
title: 'Tutorial: Access Azure databases with managed identity'
description: Secure database connectivity (Azure SQL Database, Database for MySQL, and Database for PostgreSQL) with managed identity from .NET, Node.js, Python, and Java apps.
keywords: azure app service, web app, security, msi, managed service identity, managed identity, .net, dotnet, asp.net, c#, csharp, node.js, node, python, java, visual studio, visual studio code, visual studio for mac, azure cli, azure powershell, defaultazurecredential
author: cephalin
ms.author: cephalin

ms.devlang: csharp,java,javascript,python
ms.topic: tutorial
ms.date: 04/12/2022
ms.custom: mvc, devx-track-azurecli, ignite-2022, devx-track-dotnet, devx-track-extended-java, devx-track-python, AppServiceConnectivity
---
# Tutorial: Connect to Azure databases from App Service without secrets using a managed identity

[App Service](overview.md) provides a highly scalable, self-patching web hosting service in Azure. It also provides a [managed identity](overview-managed-identity.md) for your app, which is a turn-key solution for securing access to Azure databases, including: 

- [Azure SQL Database](/azure/azure-sql/database/)
- [Azure Database for MySQL](../mysql/index.yml)
- [Azure Database for PostgreSQL](../postgresql/index.yml)

> [!NOTE]
> This tutorial doesn't include guidance for [Azure Cosmos DB](../cosmos-db/index.yml), which supports Microsoft Entra authentication differently. For more information, see the Azure Cosmos DB documentation, such as [Use system-assigned managed identities to access Azure Cosmos DB data](../cosmos-db/managed-identity-based-authentication.md).

Managed identities in App Service make your app more secure by eliminating secrets from your app, such as credentials in the connection strings. This tutorial shows you how to connect to the above-mentioned databases from App Service using managed identities. 

<!-- ![Architecture diagram for tutorial scenario.](./media/tutorial-connect-msi-sql-database/architecture.png) -->

What you will learn:

> [!div class="checklist"]
> * Configure a Microsoft Entra user as an administrator for your Azure database.
> * Connect to your database as the Microsoft Entra user.
> * Configure a system-assigned or user-assigned managed identity for an App Service app.
> * Grant database access to the managed identity.
> * Connect to the Azure database from your code (.NET Framework 4.8, .NET 6, Node.js, Python, Java) using a managed identity.
> * Connect to the Azure database from your development environment using the Microsoft Entra user.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

- Create an app in App Service based on .NET, Node.js, Python, or Java.
- Create a database server with Azure SQL Database, Azure Database for MySQL, or Azure Database for PostgreSQL.
- You should be familiar with the standard connectivity pattern (with username and password) and be able to connect successfully from your App Service app to your database of choice.

Prepare your environment for the Azure CLI.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

<a name='1-grant-database-access-to-azure-ad-user'></a>

## 1. Grant database access to Microsoft Entra user

First, enable Microsoft Entra authentication to the Azure database by assigning a Microsoft Entra user as the administrator of the server. For the scenario in the tutorial, you'll use this user to connect to your Azure database from the local development environment. Later, you set up the managed identity for your App Service app to connect from within Azure.

> [!NOTE]
> This user is different from the Microsoft account you used to sign up for your Azure subscription. It must be a user that you created, imported, synced, or invited into Microsoft Entra ID. For more information on allowed Microsoft Entra users, see [Microsoft Entra features and limitations in SQL Database](/azure/azure-sql/database/authentication-aad-overview#azure-ad-features-and-limitations).

1. If your Microsoft Entra tenant doesn't have a user yet, create one by following the steps at [Add or delete users using Microsoft Entra ID](../active-directory/fundamentals/add-users-azure-active-directory.md).

1. Find the object ID of the Microsoft Entra user using the [`az ad user list`](/cli/azure/ad/user#az-ad-user-list) and replace *\<user-principal-name>*. The result is saved to a variable.

    ```azurecli-interactive
    azureaduser=$(az ad user list --filter "userPrincipalName eq '<user-principal-name>'" --query [].id --output tsv)
    ```

# [Azure SQL Database](#tab/sqldatabase)

3. Add this Microsoft Entra user as an Active Directory administrator using [`az sql server ad-admin create`](/cli/azure/sql/server/ad-admin#az-sql-server-ad-admin-create) command in the Cloud Shell. In the following command, replace *\<group-name>* and *\<server-name>* with your own parameters.

    ```azurecli-interactive
    az sql server ad-admin create --resource-group <group-name> --server-name <server-name> --display-name ADMIN --object-id $azureaduser
    ```

    For more information on adding an Active Directory administrator, see [Provision a Microsoft Entra administrator for your server](/azure/azure-sql/database/authentication-aad-configure#provision-azure-ad-admin-sql-managed-instance)

# [Azure Database for MySQL](#tab/mysql)

3. Add this Microsoft Entra user as an Active Directory administrator using [`az mysql server ad-admin create`](/cli/azure/mysql/server/ad-admin#az-mysql-server-ad-admin-create) command in the Cloud Shell. In the following command, replace *\<group-name>* and *\<server-name>* with your own parameters.

    ```azurecli-interactive
    az mysql server ad-admin create --resource-group <group-name> --server-name <server-name> --display-name <user-principal-name> --object-id $azureaduser
    ```

    > [!NOTE] 
    > The command is currently unavailable for Azure Database for MySQL Flexible Server.

# [Azure Database for PostgreSQL](#tab/postgresql)

3. Add this Microsoft Entra user as an Active Directory administrator using [`az postgres server ad-admin create`](/cli/azure/postgres/server/ad-admin#az-postgres-server-ad-admin-create) command in the Cloud Shell. In the following command, replace *\<group-name>* and *\<server-name>* with your own parameters.

    ```azurecli-interactive
    az postgres server ad-admin create --resource-group <group-name> --server-name <server-name> --display-name <user-principal-name> --object-id $azureaduser
    ```

    > [!NOTE] 
    > The command is currently unavailable for Azure Database for PostgreSQL Flexible Server.

-----

## 2. Configure managed identity for app

Next, you configure your App Service app to connect to SQL Database with a managed identity.

1. Enable a managed identity for your App Service app with the [az webapp identity assign](/cli/azure/webapp/identity#az-webapp-identity-assign) command in the Cloud Shell. In the following command, replace *\<app-name>*.

    # [System-assigned identity](#tab/systemassigned/sqldatabase)

    ```azurecli-interactive
    az webapp identity assign --resource-group <group-name> --name <app-name>
    ```

    # [System-assigned identity](#tab/systemassigned/mysql)

    ```azurecli-interactive
    az webapp identity assign --resource-group <group-name> --name <app-name> --output tsv --query principalId
    az ad sp show --id <output-from-previous-command> --output tsv --query appId
    ```

    The output of [az ad sp show](/cli/azure/ad/sp#az-ad-sp-show) is the application ID of the system-assigned identity. You'll need it later. 

    # [System-assigned identity](#tab/systemassigned/postgresql)

    ```azurecli-interactive
    az webapp identity assign --resource-group <group-name> --name <app-name> --output tsv --query principalId
    az ad sp show --id <output-from-previous-command> --output tsv --query appId
    ```

    The output of [az ad sp show](/cli/azure/ad/sp#az-ad-sp-show) is the application ID of the system-assigned identity. You'll need it later. 

    # [User-assigned identity](#tab/userassigned)

    ```azurecli-interactive
    # Create a user-assigned identity and get its client ID
    az identity create --name <identity-name> --resource-group <group-name> --output tsv --query "id"
    # assign identity to app 
    az webapp identity assign --resource-group <group-name> --name <app-name> --identities <output-of-previous-command> 
    # get client ID of identity for later
    az webapp identity show --name <identity-name> --resource-group <group-name> --output tsv --query "clientId"
    ```

    The output of [az webapp identity show](/cli/azure/webapp/identity#az-webapp-identity-show) is the client ID of the user-assigned identity. You'll need it later. 

    -----

    > [!NOTE]
    > To enable managed identity for a [deployment slot](deploy-staging-slots.md), add `--slot <slot-name>` and use the name of the slot in *\<slot-name>*.
    
1. The identity needs to be granted permissions to access the database. In the Cloud Shell, sign in to your database with the following command. Replace _\<server-name>_ with your server name, _\<database-name>_ with the database name your app uses, and _\<aad-user-name>_ and _\<aad-password>_ with your Microsoft Entra user's credentials from [1. Grant database access to Microsoft Entra user]().

    # [Azure SQL Database](#tab/sqldatabase)

    ```azurecli-interactive
    sqlcmd -S <server-name>.database.windows.net -d <database-name> -U <aad-user-name> -P "<aad-password>" -G -l 30
    ```

    # [Azure Database for MySQL](#tab/mysql)

    ```azurecli-interactive
    # Sign into Azure using the Azure AD user from "1. Grant database access to Azure AD user"
    az login --allow-no-subscriptions
    # Get access token for MySQL with the Azure AD user
    az account get-access-token --resource-type oss-rdbms --output tsv --query accessToken
    # Sign into the MySQL server using the token
    mysql -h <server-name>.mysql.database.azure.com --user <aad-user-name>@<server-name> --enable-cleartext-plugin --password=<token-output-from-last-command> --ssl
    ```

    The full username *\<aad-user-name>@\<server-name>* looks like `admin1@contoso.onmicrosoft.com@mydbserver1`.

    # [Azure Database for PostgreSQL](#tab/postgresql)

    ```azurecli-interactive
    # Sign into Azure using the Azure AD user from "1. Grant database access to Azure AD user"
    az login --allow-no-subscriptions
    # Get access token for PostgreSQL with the Azure AD user
    az account get-access-token --resource-type oss-rdbms --output tsv --query accessToken
    # Sign into the Postgres server
    psql "host=<server-name>.postgres.database.azure.com port=5432 dbname=<database-name> user=<aad-user-name>@<server-name> password=<token-output-from-last-command>"
    ```

    The full username *\<aad-user-name>@\<server-name>* looks like `admin1@contoso.onmicrosoft.com@mydbserver1`.

    -----

1. Run the following database commands to grant the permissions your app needs. For example, 

    # [System-assigned identity](#tab/systemassigned/sqldatabase)

    ```sql
    CREATE USER [<app-name>] FROM EXTERNAL PROVIDER;
    ALTER ROLE db_datareader ADD MEMBER [<app-name>];
    ALTER ROLE db_datawriter ADD MEMBER [<app-name>];
    ALTER ROLE db_ddladmin ADD MEMBER [<app-name>];
    GO
    ```

    For a [deployment slot](deploy-staging-slots.md), use *\<app-name>/slots/\<slot-name>* instead of *\<app-name>*.

    # [User-assigned identity](#tab/userassigned/sqldatabase)

    ```sql
    CREATE USER [<identity-name>] FROM EXTERNAL PROVIDER;
    ALTER ROLE db_datareader ADD MEMBER [<identity-name>];
    ALTER ROLE db_datawriter ADD MEMBER [<identity-name>];
    ALTER ROLE db_ddladmin ADD MEMBER [<identity-name>];
    GO
    ```

    # [System-assigned identity](#tab/systemassigned/mysql)

    ```sql
    SET aad_auth_validate_oids_in_tenant = OFF;
    CREATE AADUSER '<mysql-user-name>' IDENTIFIED BY '<application-id-of-system-assigned-identity>';
    GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, ALTER ON *.* TO '<mysql-user-name>'@'%' WITH GRANT OPTION;
    FLUSH PRIVILEGES;
    ```

    Whatever name you choose for *\<mysql-user-name>*, it's the MySQL user you'll use to connect to the database later from your code in App Service.

    # [User-assigned identity](#tab/userassigned/mysql)

    ```sql
    SET aad_auth_validate_oids_in_tenant = OFF;
    CREATE AADUSER '<mysql-user-name>' IDENTIFIED BY '<client-id-of-user-assigned-identity>';
    GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, ALTER ON *.* TO '<mysql-user-name>'@'%' WITH GRANT OPTION;
    FLUSH PRIVILEGES;
    ```

    Whatever name you choose for *\<mysql-user-name>*, it's the MySQL user you'll use to connect to the database later from your code in App Service.

    # [System-assigned identity](#tab/systemassigned/postgresql)

    ```sql
    SET aad_validate_oids_in_tenant = off;
    CREATE ROLE <postgresql-user-name> WITH LOGIN PASSWORD '<application-id-of-system-assigned-identity>' IN ROLE azure_ad_user;
    ```
    
    Whatever name you choose for *\<postgresql-user-name>*, it's the PostgreSQL user you'll use to connect to the database later from your code in App Service.

    # [User-assigned identity](#tab/userassigned/postgresql)

    ```sql
    SET aad_validate_oids_in_tenant = off;
    CREATE ROLE <postgresql-user-name> WITH LOGIN PASSWORD '<application-id-of-user-assigned-identity>' IN ROLE azure_ad_user;
    ```

    Whatever name you choose for *\<postgresql-user-name>*, it's the PostgreSQL user you'll use to connect to the database later from your code in App Service.

    -----

## 3. Modify your code

In this section, connectivity to the Azure database in your code follows the `DefaultAzureCredential` pattern for all language stacks. `DefaultAzureCredential` is flexible enough to adapt to both the development environment and the Azure environment. When running locally, it can retrieve the logged-in Azure user from the environment of your choice (Visual Studio, Visual Studio Code, Azure CLI, or Azure PowerShell). When running in Azure, it retrieves the managed identity. So it's possible to have connectivity to database both at development time and in production. The pattern is as follows:

1. Instantiate a `DefaultAzureCredential` from the Azure Identity client library. If you're using a user-assigned identity, specify the client ID of the identity. 
1. Get an access token for the resource URI respective to the database type.
    - For Azure SQL Database: `https://database.windows.net/.default`
    - For Azure Database for MySQL: `https://ossrdbms-aad.database.windows.net/.default`
    - For Azure Database for PostgreSQL: `https://ossrdbms-aad.database.windows.net/.default`
1. Add the token to your connection string.
1. Open the connection.

For Azure Database for MySQL and Azure Database for PostgreSQL, the database username that you created in [2. Configure managed identity for app](#2-configure-managed-identity-for-app) is also required in the connection string.

# [.NET Framework](#tab/netfx)

1. In Visual Studio, open the Package Manager Console and add the NuGet packages you need:

    # [Azure SQL Database](#tab/sqldatabase)

    ```powershell
    Install-Package Azure.Identity
    Install-Package System.Data.SqlClient
    ```

    # [Azure Database for MySQL](#tab/mysql)

    ```powershell
    Install-Package Azure.Identity
    Install-Package MySql.Data
    ```

    # [Azure Database for PostgreSQL](#tab/postgresql)

    ```powershell
    Install-Package Azure.Identity
    Install-Package Npgsql
    ```

    -----

1. Connect to the Azure database by adding an access token. If you're using a user-assigned identity, make sure you uncomment the applicable lines.

    # [Azure SQL Database](#tab/sqldatabase)

    ```csharp
    // Uncomment one of the two lines depending on the identity type
    //var credential = new Azure.Identity.DefaultAzureCredential(); // system-assigned identity
    //var credential = new Azure.Identity.DefaultAzureCredential(new DefaultAzureCredentialOptions { ManagedIdentityClientId = '<client-id-of-user-assigned-identity>' }); // user-assigned identity

    // Get token for Azure SQL Database
    var token = credential.GetToken(new Azure.Core.TokenRequestContext(new[] { "https://database.windows.net/.default" }));

    // Add the token to the SQL connection
    var connection = new System.Data.SqlClient.SqlConnection("Server=tcp:<server-name>.database.windows.net;Database=<database-name>;TrustServerCertificate=True");
    connection.AccessToken = token.Token;

    // Open the SQL connection
    connection.Open();
    ```

    For a more detailed tutorial, see [Tutorial: Connect to SQL Database from .NET App Service without secrets using a managed identity](tutorial-connect-msi-sql-database.md).
    
    # [Azure Database for MySQL](#tab/mysql)

    ```csharp
    using Azure.Identity;

    ...

    // Uncomment one of the two lines depending on the identity type
    //var credential = new DefaultAzureCredential(); // system-assigned identity
    //var credential = new DefaultAzureCredential(new DefaultAzureCredentialOptions { ManagedIdentityClientId = '<client-id-of-user-assigned-identity>' }); // user-assigned identity

    // Get token for Azure Database for MySQL
    var token = credential.GetToken(new Azure.Core.TokenRequestContext(new[] { "https://ossrdbms-aad.database.windows.net/.default" }));

    // Set MySQL user depending on the environment
    string user;
    if (String.IsNullOrEmpty(Environment.GetEnvironmentVariable("IDENTITY_ENDPOINT")))
        user = "<aad-user-name>@<server-name>";
    else user = "<mysql-user-name>@<server-name>";

    // Add the token to the MySQL connection
    var connectionString = "Server=<server-name>.mysql.database.azure.com;" + 
        "Port=3306;" + 
        "SslMode=Required;" +
        "Database=<database-name>;" + 
        "Uid=" + user+ ";" +
        "Password="+ token.Token;
    var connection = new MySql.Data.MySqlClient.MySqlConnection(connectionString);

    connection.Open();
    ```

    # [Azure Database for PostgreSQL](#tab/postgresql)

    ```csharp
    using Azure.Identity;

    ...

    // Uncomment one of the two lines depending on the identity type
    //var credential = new DefaultAzureCredential(); // system-assigned identity
    //var credential = new DefaultAzureCredential(new DefaultAzureCredentialOptions { ManagedIdentityClientId = '<client-id-of-user-assigned-identity>' }); // user-assigned identity

    // Get token for Azure Database for PostgreSQL
    var token = credential.GetToken(new Azure.Core.TokenRequestContext(new[] { "https://ossrdbms-aad.database.windows.net/.default" }));

    // Check if in Azure and set user accordingly
    string postgresqlUser;
    if (String.IsNullOrEmpty(Environment.GetEnvironmentVariable("IDENTITY_ENDPOINT")))
        postgresqlUser = "<aad-user-name>@<server-name>";
    else postgresqlUser = "<postgresql-user-name>@<server-name>";

    // Add the token to the PostgreSQL connection
    var connectionString = "Server=<server-name>.postgres.database.azure.com;" + 
        "Port=5432;" + 
        "Database=<database-name>;" + 
        "User Id=" + postgresqlUser + ";" +
        "Password="+ token.Token;
    var connection = new Npgsql.NpgsqlConnection(connectionString);

    connection.Open();
    ```

    -----

# [.NET 6](#tab/dotnet)

1. Install the .NET packages you need into your .NET project:

    # [Azure SQL Database](#tab/sqldatabase)

    ```dotnetcli
    dotnet add package Microsoft.Data.SqlClient
    ```

    # [Azure Database for MySQL](#tab/mysql)

    ```dotnetcli
    dotnet add package Azure.Identity
    dotnet add package MySql.Data
    ```

    # [Azure Database for PostgreSQL](#tab/postgresql)

    ```dotnetcli
    dotnet add package Azure.Identity
    dotnet add package Npgsql
    ```

    -----

1. Connect to the Azure database by adding an access token. If you're using a user-assigned identity, make sure you uncomment the applicable lines.

    # [Azure SQL Database](#tab/sqldatabase)

    ```csharp
    using Microsoft.Data.SqlClient;

    ...

    // Uncomment one of the two lines depending on the identity type    
    //SqlConnection connection = new SqlConnection("Server=tcp:<server-name>.database.windows.net;Database=<database-name>;Authentication=Active Directory Default;TrustServerCertificate=True"); // system-assigned identity
    //SqlConnection connection = new SqlConnection("Server=tcp:<server-name>.database.windows.net;Database=<database-name>;Authentication=Active Directory Default;User Id=<client-id-of-user-assigned-identity>;TrustServerCertificate=True"); // user-assigned identity

    // Open the SQL connection
    connection.Open();
    ```

    [Microsoft.Data.SqlClient](/sql/connect/ado-net/sql/azure-active-directory-authentication?view=azuresqldb-current&preserve-view=true) provides integrated support of Microsoft Entra authentication. In this case, the [Active Directory Default](/sql/connect/ado-net/sql/azure-active-directory-authentication?view=azuresqldb-current&preserve-view=true#using-active-directory-default-authentication) uses `DefaultAzureCredential` to retrieve the required token for you and adds it to the database connection directly.

    For a more detailed tutorial, see [Tutorial: Connect to SQL Database from .NET App Service without secrets using a managed identity](tutorial-connect-msi-sql-database.md).

    # [Azure Database for MySQL](#tab/mysql)

    ```csharp
    using Azure.Identity;

    ...

    // Uncomment one of the two lines depending on the identity type
    //var credential = new DefaultAzureCredential(); // system-assigned identity
    //var credential = new DefaultAzureCredential(new DefaultAzureCredentialOptions { ManagedIdentityClientId = '<client-id-of-user-assigned-identity>' }); // user-assigned identity

    // Get token for Azure Database for MySQL
    var token = credential.GetToken(new Azure.Core.TokenRequestContext(new[] { "https://ossrdbms-aad.database.windows.net/.default" }));

    // Set MySQL user depending on the environment
    string user;
    if (String.IsNullOrEmpty(Environment.GetEnvironmentVariable("IDENTITY_ENDPOINT")))
        user = "<aad-user-name>@<server-name>";
    else user = "<mysql-user-name>@<server-name>";

    // Add the token to the MySQL connection
    var connectionString = "Server=<server-name>.mysql.database.azure.com;" + 
        "Port=3306;" + 
        "SslMode=Required;" +
        "Database=<database-name>;" + 
        "Uid=" + user+ ";" +
        "Password="+ token.Token;
    var connection = new MySql.Data.MySqlClient.MySqlConnection(connectionString);

    connection.Open();
    ```

    The `if` statement sets the MySQL username based on which identity the token applies to. The token is then passed in to the MySQL connection as the password for the Azure identity. For more information, see [Connect with Managed Identity to Azure Database for MySQL](../postgresql/howto-connect-with-managed-identity.md).

    # [Azure Database for PostgreSQL](#tab/postgresql)

    ```csharp
    using Azure.Identity;

    ...

    // Uncomment one of the two lines depending on the identity type
    //var credential = new DefaultAzureCredential(); // system-assigned identity
    //var credential = new DefaultAzureCredential(new DefaultAzureCredentialOptions { ManagedIdentityClientId = '<client-id-of-user-assigned-identity>' }); // user-assigned identity

    // Get token for Azure Database for PostgreSQL
    var token = credential.GetToken(new Azure.Core.TokenRequestContext(new[] { "https://ossrdbms-aad.database.windows.net/.default" }));

    // Check if in Azure and set user accordingly
    string postgresqlUser;
    if (String.IsNullOrEmpty(Environment.GetEnvironmentVariable("IDENTITY_ENDPOINT")))
        postgresqlUser = "<aad-user-name>@<server-name>";
    else postgresqlUser = "<postgresql-user-name>@<server-name>";

    // Add the token to the PostgreSQL connection
    var connectionString = "Server=<server-name>.postgres.database.azure.com;" + 
        "Port=5432;" + 
        "Database=<database-name>;" + 
        "User Id=" + postgresqlUser + ";" +
        "Password="+ token.Token;
    var connection = new Npgsql.NpgsqlConnection(connectionString);

    connection.Open();
    ```

    The `if` statement sets the PostgreSQL username based on which identity the token applies to. The token is then passed in to the PostgreSQL connection as the password for the Azure identity. For more information, see [Connect with Managed Identity to Azure Database for PostgreSQL](../postgresql/howto-connect-with-managed-identity.md).

    -----

# [Node.js](#tab/nodejs)

1. Install the required npm packages you need into your Node.js project:

    # [Azure SQL Database](#tab/sqldatabase)

    ```terminal
    npm install --save @azure/identity
    npm install --save tedious
    ```

    # [Azure Database for MySQL](#tab/mysql)

    ```terminal
    npm install --save @azure/identity
    npm install --save mysql2
    ```

    # [Azure Database for PostgreSQL](#tab/postgresql)

    ```terminal
    npm install --save @azure/identity
    npm install --save pg
    ```

    -----

1. Connect to the Azure database by adding an access token. If you're using a user-assigned identity, make sure you uncomment the applicable lines.

    # [Azure SQL Database](#tab/sqldatabase)

    ```javascript
    const { Connection, Request } = require("tedious");
    const { DefaultAzureCredential } = require("@azure/identity");
    
    // Uncomment one of the two lines depending on the identity type
    //const credential = new DefaultAzureCredential(); // system-assigned identity
    //const credential = new DefaultAzureCredential({ managedIdentityClientId: '<client-id-of-user-assigned-identity>' }); // user-assigned identity
    
    // Get token for Azure SQL Database
    const accessToken = await credential.getToken("https://database.windows.net/.default");
    
    // Create connection to database
    const connection = new Connection({
        server: '<server-name>.database.windows.net',
        authentication: {
            type: 'azure-active-directory-access-token',
            options: {
                token: accessToken.token
            }
        },
        options: {
            database: '<database-name>',
            encrypt: true,
            port: 1433
        }
    });
    
    // Open the database connection
    connection.connect();
    ```

    The [tedious](https://tediousjs.github.io/tedious/) library also has an authentication type `azure-active-directory-msi-app-service`, which doesn't require you to retrieve the token yourself, but the use of `DefaultAzureCredential` in this example works both in App Service and in your local development environment. For more information, see [Quickstart: Use Node.js to query a database in Azure SQL Database or Azure SQL Managed Instance](/azure/azure-sql/database/connect-query-nodejs)

    # [Azure Database for MySQL](#tab/mysql)
    
    ```javascript
    const mysql = require('mysql2');
    const { DefaultAzureCredential } = require("@azure/identity");
    
    // Uncomment one of the two lines depending on the identity type
    //const credential = new DefaultAzureCredential(); // system-assigned identity
    //const credential = new DefaultAzureCredential({ managedIdentityClientId: '<client-id-of-user-assigned-identity>' }); // user-assigned identity
    
    // Get token for Azure Database for MySQL
    const accessToken = await credential.getToken("https://ossrdbms-aad.database.windows.net/.default");
    
    // Set MySQL user depending on the environment
    if(process.env.IDENTITY_ENDPOINT) {
        var mysqlUser = '<mysql-user-name>@<server-name>';
    } else {
        var mysqlUser = '<aad-user-name>@<server-name>';
    }

    // Add the token to the MySQL connection
    var config =
    {
        host: '<server-name>.mysql.database.azure.com',
        user: mysqlUser,
        password: accessToken.token,
        database: '<database-name>',
        port: 3306,
        insecureAuth: true,
        authPlugins: {
            mysql_clear_password: () => () => {
                return Buffer.from(accessToken.token + '\0')
            }
        }
    };
    
    const conn = new mysql.createConnection(config);
    
    // Open the database connection
    conn.connect(
        function (err) { 
        if (err) { 
            console.log("!!! Cannot connect !!! Error:");
            throw err;
        }
        else
        {
            ...
        }
    });
    ```

    The `if` statement sets the MySQL username based on which identity the token applies to. The token is then passed in to the [standard MySQL connection](../mysql/connect-nodejs.md) as the password of the Azure identity.

    # [Azure Database for PostgreSQL](#tab/postgresql)
    
    ```javascript
    const pg = require('pg');
    const { DefaultAzureCredential } = require("@azure/identity");
    
    // Uncomment one of the two lines depending on the identity type
    //const credential = new DefaultAzureCredential(); // system-assigned identity
    //const credential = new DefaultAzureCredential({ managedIdentityClientId: '<client-id-of-user-assigned-identity>' }); // user-assigned identity
    
    // Get token for Azure Database for PostgreSQL
    const accessToken = await credential.getToken("https://ossrdbms-aad.database.windows.net/.default");
    
    // Set PosrgreSQL user depending on the environment
    if(process.env.IDENTITY_ENDPOINT) {
        var postgresqlUser = '<postgresql-user-name>@<server-name>';
    } else {
        var postgresqlUser = '<aad-user-name>@<server-name>';
    }

    // Add the token to the PostgreSQL connection
    var config =
    {
        host: '<server-name>.postgres.database.azure.com',
        user: postgresqlUser,
        password: accessToken.token,
        database: '<database-name>',
        port: 5432
    };
    
    const client = new pg.Client(config);
    
    // Open the database connection
    client.connect(err => {
        if (err) throw err;
        else {
            // Do something with the connection... 
        }
    });

    ```

    The `if` statement sets the PostgreSQL username based on which identity the token applies to. The token is then passed in to the [standard PostgreSQL connection](../postgresql/connect-nodejs.md) as the password of the Azure identity.

    -----

# [Python](#tab/python)

1. In your Python project, install the required packages.

    # [Azure SQL Database](#tab/sqldatabase)

    ```terminal
    pip install azure-identity
    pip install pyodbc
    ```

    The required [ODBC Driver 17 for SQL Server](/sql/connect/odbc/download-odbc-driver-for-sql-server) is already installed in App Service. To run the same code locally, install it in your local environment too.

    # [Azure Database for MySQL](#tab/mysql)

    ```terminal
    pip install azure-identity
    pip install mysql-connector-python
    ```

    # [Azure Database for PostgreSQL](#tab/postgresql)

    ```terminal
    pip install azure-identity
    pip install psycopg2-binary
    ```

    -----

1. Connect to the Azure database by using an access token:

    # [Azure SQL Database](#tab/sqldatabase)

    ```python
    from azure.identity import DefaultAzureCredential
    import pyodbc, struct
    
    # Uncomment one of the two lines depending on the identity type
    #credential = DefaultAzureCredential() # system-assigned identity
    #credential = DefaultAzureCredential(managed_identity_client_id='<client-id-of-user-assigned-identity>') # user-assigned identity
    
    # Get token for Azure SQL Database and convert to UTF-16-LE for SQL Server driver
    token = credential.get_token("https://database.windows.net/.default").token.encode("UTF-16-LE")
    token_struct = struct.pack(f'<I{len(token)}s', len(token), token)
    
    # Connect with the token
    SQL_COPT_SS_ACCESS_TOKEN = 1256
    connString = f"Driver={{ODBC Driver 17 for SQL Server}};SERVER=<server-name>.database.windows.net;DATABASE=<database-name>"
    conn = pyodbc.connect(connString, attrs_before={SQL_COPT_SS_ACCESS_TOKEN: token_struct})
    ```
    
    The ODBC Driver 17 for SQL Server also supports an authentication type `ActiveDirectoryMsi`. You can connect from App Service without getting the token yourself, simply with the connection string `Driver={{ODBC Driver 17 for SQL Server}};SERVER=<server-name>.database.windows.net;DATABASE=<database-name>;Authentication=ActiveDirectoryMsi`. The difference with the above code is that it gets the token with `DefaultAzureCredential`, which works both in App Service and in your local development environment.

    For more information about PyODBC, see [PyODBC SQL Driver](/sql/connect/python/pyodbc/python-sql-driver-pyodbc).

    # [Azure Database for MySQL](#tab/mysql)

    ```python
    from azure.identity import DefaultAzureCredential
    import mysql.connector
    import os

    # Uncomment one of the two lines depending on the identity type
    #credential = DefaultAzureCredential() # system-assigned identity
    #credential = DefaultAzureCredential(managed_identity_client_id='<client-id-of-user-assigned-identity>') # user-assigned identity
    
    # Get token for Azure Database for MySQL
    token = credential.get_token("https://ossrdbms-aad.database.windows.net/.default")
    
    # Set MySQL user depending on the environment
    if 'IDENTITY_ENDPOINT' in os.environ:
        mysqlUser = '<mysql-user-name>@<server-name>'
    else:
        mysqlUser = '<aad-user-name>@<server-name>'

    # Connect with the token
    os.environ['LIBMYSQL_ENABLE_CLEARTEXT_PLUGIN'] = '1'
    config = {
      'host': '<server-name>.mysql.database.azure.com',
      'database': '<database-name>',
      'user': mysqlUser,
      'password': token.token
    }
    conn = mysql.connector.connect(**config)
    print("Connection established")
    ```

    The `if` statement sets the MySQL username based on which identity the token applies to. The token is then passed in to the [standard MySQL connection](../mysql/connect-python.md) as the password of the Azure identity.

    The `LIBMYSQL_ENABLE_CLEARTEXT_PLUGIN` environment variable enables the [Cleartext plugin](https://dev.mysql.com/doc/refman/8.0/en/cleartext-pluggable-authentication.html) in the MySQL Connector (see [Use Microsoft Entra ID for authentication with MySQL](../mysql/howto-configure-sign-in-azure-ad-authentication.md#compatibility-with-application-drivers)).

    # [Azure Database for PostgreSQL](#tab/postgresql)

    ```python
    from azure.identity import DefaultAzureCredential
    import psycopg2
    
    # Uncomment one of the two lines depending on the identity type
    #credential = DefaultAzureCredential() # system-assigned identity
    #credential = DefaultAzureCredential(managed_identity_client_id='<client-id-of-user-assigned-identity>') # user-assigned identity
    
    # Get token for Azure Database for PostgreSQL
    token = credential.get_token("https://ossrdbms-aad.database.windows.net/.default")
    
    # Set PostgreSQL user depending on the environment
    if 'IDENTITY_ENDPOINT' in os.environ:
        postgresUser = '<postgres-user-name>@<server-name>'
    else:
        postgresUser = '<aad-user-name>@<server-name>'

    # Connect with the token
    host = "<server-name>.postgres.database.azure.com"
    dbname = "<database-name>"
    conn_string = "host={0} user={1} dbname={2} password={3}".format(host, postgresUser, dbname, token.token)
    conn = psycopg2.connect(conn_string)
    ```

    The `if` statement sets the PostgreSQL username based on which identity the token applies to. The token is then passed in to the [standard PostgreSQL connection](../postgresql/connect-python.md) as the password of the Azure identity.

    Whatever database driver you use, make sure it can send the token as clear text (see [Use Microsoft Entra ID for authentication with MySQL](../mysql/howto-configure-sign-in-azure-ad-authentication.md#compatibility-with-application-drivers)).

    -----

# [Java](#tab/java)

1. Add the required dependencies to your project's BOM file.

    # [Azure SQL Database](#tab/sqldatabase)

    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity</artifactId>
        <version>1.4.6</version>
    </dependency>
    <dependency>
        <groupId>com.microsoft.sqlserver</groupId>
        <artifactId>mssql-jdbc</artifactId>
        <version>10.2.0.jre11</version>
    </dependency>
    ```

    # [Azure Database for MySQL](#tab/mysql)

    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity</artifactId>
        <version>1.4.6</version>
    </dependency>
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.28</version>
    </dependency>
    ```

    # [Azure Database for PostgreSQL](#tab/postgresql)

    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity</artifactId>
        <version>1.4.6</version>
    </dependency>
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <version>42.3.3</version>
    </dependency>
    ```

    -----

1. Connect to Azure database by using an access token:

    # [Azure SQL Database](#tab/sqldatabase)

    ```java
    import com.azure.identity.*;
    import com.azure.core.credential.*;
    import com.microsoft.sqlserver.jdbc.SQLServerDataSource;
    import java.sql.*;
    
    ...

    // Uncomment one of the two lines depending on the identity type
    //DefaultAzureCredential creds = new DefaultAzureCredentialBuilder().build(); // system-assigned identity
    //DefaultAzureCredential creds = new DefaultAzureCredentialBuilder().managedIdentityClientId('<client-id-of-user-assigned-identity>")'build(); // user-assigned identity

    // Get the token  
    TokenRequestContext request = new TokenRequestContext();
    request.addScopes("https://database.windows.net//.default");
    AccessToken token=creds.getToken(request).block();

    // Set token in your SQL connection
    SQLServerDataSource ds = new SQLServerDataSource();
    ds.setServerName("<server-name>.database.windows.net");
    ds.setDatabaseName("<database-name>");
    ds.setAccessToken(token.getToken());

    // Connect
    try {
        Connection connection = ds.getConnection(); 
        Statement stmt = connection.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT SUSER_SNAME()");
        if (rs.next()) {
            System.out.println("Signed into database as: " + rs.getString(1));
        }	
    }
    catch (Exception e) {
        System.out.println(e.getMessage());
    }
    ```

    The [JDBC Driver for SQL Server] also has an authentication type [ActiveDirectoryMsi](/sql/connect/jdbc/connecting-using-azure-active-directory-authentication#connect-using-activedirectorymsi-authentication-mode), which is easier to use for App Service. The above code gets the token with `DefaultAzureCredential`, which works both in App Service and in your local development environment.

    # [Azure Database for MySQL](#tab/mysql)

    ```java
    import com.azure.identity.*;
    import com.azure.core.credential.*;
    import java.sql.*;

    ...

    // Uncomment one of the two lines depending on the identity type
    //DefaultAzureCredential creds = new DefaultAzureCredentialBuilder().build(); // system-assigned identity
    //DefaultAzureCredential creds = new DefaultAzureCredentialBuilder().managedIdentityClientId('<client-id-of-user-assigned-identity>")'build(); // user-assigned identity

    // Get the token
    TokenRequestContext request = new TokenRequestContext();
    request.addScopes("https://ossrdbms-aad.database.windows.net/.default");
    AccessToken token=creds.getToken(request).block();

    // Set MySQL user depending on the environment
    String mysqlUser;
    if (System.getenv("IDENTITY_ENDPOINT" != null)) {
        mysqlUser = "<aad-user-name>@<server-name>";
    }
    else {
        mysqlUser = "<mysql-user-name>@<server-name>";
    }

    // Set token in your SQL connection
    try {
        Connection connection = DriverManager.getConnection(
                "jdbc:mysql://<server-name>.mysql.database.azure.com/<database-name>",
                mysqlUser,
                token.getToken());
        Statement stmt = connection.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT USER();");
        if (rs.next()) {
            System.out.println("Signed into database as: " + rs.getString(1));
        }	
    }
    catch (Exception e) {
        System.out.println(e.getMessage());
    }
    ```

    The `if` statement sets the MySQL username based on which identity the token applies to. The token is then passed in to the [standard MySQL connection](../mysql/connect-java.md) as the password of the Azure identity.

    # [Azure Database for PostgreSQL](#tab/postgresql)

    ```java
    import com.azure.identity.*;
    import com.azure.core.credential.*;
    import java.sql.*;

    ...

    // Uncomment one of the two lines depending on the identity type
    //DefaultAzureCredential creds = new DefaultAzureCredentialBuilder().build(); // system-assigned identity
    //DefaultAzureCredential creds = new DefaultAzureCredentialBuilder().managedIdentityClientId('<client-id-of-user-assigned-identity>")'build(); // user-assigned identity

    // Get the token
    TokenRequestContext request = new TokenRequestContext();
    request.addScopes("https://ossrdbms-aad.database.windows.net/.default");
    AccessToken token=creds.getToken(request).block();

    // Set PostgreSQL user depending on the environment
    String postgresUser;
    if (System.getenv("IDENTITY_ENDPOINT") != null) {
        postgresUser = "<aad-user-name>@<server-name>";
    }
    else {
        postgresUser = "<postgresql-user-name>@<server-name>";
    }

    // Set token in your SQL connection
    try {
        Connection connection = DriverManager.getConnection(
                "jdbc:postgresql://<server-name>.postgres.database.azure.com:5432/<database-name>",
                postgresUser,
                token.getToken());
        Statement stmt = connection.createStatement();
        ResultSet rs = stmt.executeQuery("select current_user;");
        if (rs.next()) {
            System.out.println("Signed into database as: " + rs.getString(1));
        }
    }
    catch (Exception e) {
        System.out.println(e.getMessage());
    }
    ```

    The `if` statement sets the PostgreSQL username based on which identity the token applies to. The token is then passed in to the [standard PostgreSQL connection](../postgresql/connect-nodejs.md) as the password of the identity. To see how you can do it similarly with specific frameworks, see: 

    - [Spring Data JDBC](/azure/developer/java/spring-framework/configure-spring-data-jdbc-with-azure-postgresql)
    - [Spring Data JPA](/azure/developer/java/spring-framework/configure-spring-data-jpa-with-azure-postgresql)
    - [Spring Data R2DBC](/azure/developer/java/spring-framework/configure-spring-data-r2dbc-with-azure-postgresql)
    -----

-----

## 4. Set up your dev environment

 This sample code uses `DefaultAzureCredential` to get a useable token for your Azure database from Microsoft Entra ID and then adds it to the database connection. While you can customize `DefaultAzureCredential`, it's already versatile by default. It gets a token from the signed-in Microsoft Entra user or from a managed identity, depending on whether you run it locally in your development environment or in App Service.

Without any further changes, your code is ready to be run in Azure. To debug your code locally, however, your develop environment needs a signed-in Microsoft Entra user. In this step, you configure your environment of choice by signing in [with your Microsoft Entra user](#1-grant-database-access-to-azure-ad-user). 

# [Visual Studio Windows](#tab/windowsclient)

1. Visual Studio for Windows is integrated with Microsoft Entra authentication. To enable development and debugging in Visual Studio, add your Microsoft Entra user in Visual Studio by selecting **File** > **Account Settings** from the menu, and select **Sign in** or **Add**.

1. To set the Microsoft Entra user for Azure service authentication, select **Tools** > **Options** from the menu, then select **Azure Service Authentication** > **Account Selection**. Select the Microsoft Entra user you added and select **OK**.

# [Visual Studio for macOS](#tab/macosclient)

1. Visual Studio for Mac is *not* integrated with Microsoft Entra authentication. However, the Azure Identity client library that you'll use later can also retrieve tokens from Azure CLI. To enable development and debugging in Visual Studio, [install Azure CLI](/cli/azure/install-azure-cli) on your local machine.

1. Sign in to Azure CLI with the following command using your Microsoft Entra user:

    ```azurecli
    az login --allow-no-subscriptions
    ```

# [Visual Studio Code](#tab/vscode)

1. Visual Studio Code is integrated with Microsoft Entra authentication through the Azure extension. Install the <a href="https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack" target="_blank">Azure Tools</a> extension in Visual Studio Code.

1. In Visual Studio Code, in the [Activity Bar](https://code.visualstudio.com/docs/getstarted/userinterface), select the **Azure** logo.

1. In the **App Service** explorer, select **Sign in to Azure...** and follow the instructions.

# [Azure CLI](#tab/cli)

1. The Azure Identity client library that you'll use later can use tokens from Azure CLI. To enable command-line based development, [install Azure CLI](/cli/azure/install-azure-cli) on your local machine.

1. Sign in to Azure with the following command using your Microsoft Entra user:

    ```azurecli
    az login --allow-no-subscriptions
    ```

# [Azure PowerShell](#tab/ps)

1. The Azure Identity client library that you'll use later can use tokens from Azure PowerShell. To enable command-line based development, [install Azure PowerShell](/powershell/azure/install-azure-powershell) on your local machine.

1. Sign in to Azure CLI with the following cmdlet using your Microsoft Entra user:

    ```powershell-interactive
    Connect-AzAccount
    ```

-----

For more information about setting up your dev environment for Microsoft Entra authentication, see [Azure Identity client library for .NET](/dotnet/api/overview/azure/Identity-readme).

You're now ready to develop and debug your app with the SQL Database as the back end, using Microsoft Entra authentication.

## 5. Test and publish

1. Run your code in your dev environment. Your code uses the [signed-in Microsoft Entra user](#1-grant-database-access-to-azure-ad-user)) in your environment to connect to the back-end database. The user can access the database because it's configured as a Microsoft Entra administrator for the database.

1. Publish your code to Azure using the preferred publishing method. In App Service, your code uses the app's managed identity to connect to the back-end database.

## Frequently asked questions

- [Does managed identity support SQL Server?](#does-managed-identity-support-sql-server)
- [I get the error `Login failed for user '<token-identified principal>'.`](#i-get-the-error-login-failed-for-user-token-identified-principal)
- [I made changes to App Service authentication or the associated app registration. Why do I still get the old token?](#i-made-changes-to-app-service-authentication-or-the-associated-app-registration-why-do-i-still-get-the-old-token)
- [How do I add the managed identity to a Microsoft Entra group?](#how-do-i-add-the-managed-identity-to-an-azure-ad-group)
- [I get the error `mysql: unknown option '--enable-cleartext-plugin'`.](#i-get-the-error-mysql-unknown-option---enable-cleartext-plugin)
- [I get the error `SSL connection is required. Please specify SSL options and retry`.](#i-get-the-error-ssl-connection-is-required-please-specify-ssl-options-and-retry)

#### Does managed identity support SQL Server?

Microsoft Entra ID and managed identities aren't supported for on-premises SQL Server. 

#### I get the error `Login failed for user '<token-identified principal>'.`

The managed identity you're attempting to request a token for is not authorized to access the Azure database.

#### I made changes to App Service authentication or the associated app registration. Why do I still get the old token?

The back-end services of managed identities also [maintain a token cache](overview-managed-identity.md#configure-target-resource) that updates the token for a target resource only when it expires. If you modify the configuration *after* trying to get a token with your app, you don't actually get a new token with the updated permissions until the cached token expires. The best way to work around this is to test your changes with a new InPrivate (Edge)/private (Safari)/Incognito (Chrome) window. That way, you're sure to start from a new authenticated session.


<a name='how-do-i-add-the-managed-identity-to-an-azure-ad-group'></a>

#### How do I add the managed identity to a Microsoft Entra group?

If you want, you can add the identity to an [Microsoft Entra group](../active-directory/fundamentals/active-directory-manage-groups.md), then grant  access to the Microsoft Entra group instead of the identity. For example, the following commands add the managed identity from the previous step to a new group called _myAzureSQLDBAccessGroup_:

```azurecli-interactive
groupid=$(az ad group create --display-name myAzureSQLDBAccessGroup --mail-nickname myAzureSQLDBAccessGroup --query objectId --output tsv)
msiobjectid=$(az webapp identity show --resource-group <group-name> --name <app-name> --query principalId --output tsv)
az ad group member add --group $groupid --member-id $msiobjectid
az ad group member list -g $groupid
```

To grant database permissions for a Microsoft Entra group, see documentation for the respective database type.

#### I get the error `mysql: unknown option '--enable-cleartext-plugin'`.

If you're using a MariaDB client, the `--enable-cleartext-plugin` option isn't required.

#### I get the error `SSL connection is required. Please specify SSL options and retry`.

Connecting to the Azure database requires additional settings and is beyond the scope of this tutorial. For more information, see one of the following links:

[Configure TLS connectivity in Azure Database for PostgreSQL - Single Server](../postgresql/concepts-ssl-connection-security.md)
[Configure SSL connectivity in your application to securely connect to Azure Database for MySQL](../mysql/howto-configure-ssl.md)

## Next steps

What you learned:

> [!div class="checklist"]
> * Configure a Microsoft Entra user as an administrator for your Azure database.
> * Connect to your database as the Microsoft Entra user.
> * Configure a system-assigned or user-assigned managed identity for an App Service app.
> * Grant database access to the managed identity.
> * Connect to the Azure database from your code (.NET Framework 4.8, .NET 6, Node.js, Python, Java) using a managed identity.
> * Connect to the Azure database from your development environment using the Microsoft Entra user.

> [!div class="nextstepaction"]
> [How to use managed identities for App Service and Azure Functions](overview-managed-identity.md)

> [!div class="nextstepaction"]
> [Tutorial: Connect to SQL Database from .NET App Service without secrets using a managed identity](tutorial-connect-msi-sql-database.md)

> [!div class="nextstepaction"]
> [Tutorial: Connect to Azure services that don't support managed identities (using Key Vault)](tutorial-connect-msi-key-vault.md)

> [!div class="nextstepaction"]
> [Tutorial: Isolate back-end communication with Virtual Network integration](tutorial-networking-isolate-vnet.md)
