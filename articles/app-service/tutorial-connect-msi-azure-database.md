---
title: 'Tutorial: Access Azure databases with managed identity'
description: Secure database connectivity with managed identity from .NET web app, and also how to apply it to other Azure services.

ms.devlang: csharp
ms.topic: tutorial
ms.date: 03/29/2022
ms.custom: "devx-track-csharp, mvc, cli-validate, devx-track-azurecli"
---
# Tutorial: Connect to Azure databases from App Service without secrets using a managed identity

[App Service](overview.md) provides a highly scalable, self-patching web hosting service in Azure. It also provides a [managed identity](overview-managed-identity.md) for your app, which is a turn-key solution for securing access to Azure databases, including: 

- [Azure SQL Database](/azure/sql-database/)
- [Azure Database for MySQL](/azure/mysql/)
- [Azure Database for PostgreSQL](/azure/postgresql/)

    > [!NOTE]
    > This tutorial doesn't include guidance for [Azure Cosmos DB](/azure/cosmos-db/), which supports Azure Active Directory authentication differently. For information, see Cosmos DB documentation. For example: [Use system-assigned managed identities to access Azure Cosmos DB data](../cosmos-db/managed-identity-based-authentication.md).

Managed identities in App Service make your app more secure by eliminating secrets from your app, such as credentials in the connection strings. This tutorial shows you how to connect to the above-mentioned databases from App Service using managed identities. 

<!-- ![Architecture diagram for tutorial scenario.](./media/tutorial-connect-msi-sql-database/architecture.png) -->

> [!div class="checklist"]
> * Grant database access to Azure AD user for access development machine.
> * Configure managed identity for the app and grant database access to managed identity.
> * Connect to Azure database from your code (.NET Framework 4.8, .NET 6, Node.js, Python, Java) using a managed identity.
> * Maintain database connectivity both from your development environment and from Azure.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

- Create an app in App Service based on .NET, Node.js, Python, or Java.
- Create a database server with Azure SQL Database, Azure Database for MySQL, or Azure Database for PostgreSQL.
- You should be familiar with the standard connectivity pattern (with username and password) and be able to connect successfully from your App Service app to your database of choice.

Prepare your environment for the Azure CLI.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](../../includes/azure-cli-prepare-your-environment-no-header.md)]

## 1. Grant database access to Azure AD user

First, enable Azure Active Directory authentication to the Azure database by assigning an Azure AD user as the admin of the server. For the scenario in the tutorial, you'll use this admin user to connect to your Azure database from the local development environment. Later, you set up the managed identity for your App Service app to connect from within Azure.

> [!NOTE]
> This user is different from the Microsoft account you used to sign up for your Azure subscription. It must be a user that you created, imported, synced, or invited into Azure AD. For more information on allowed Azure AD users, see [Azure AD features and limitations in SQL Database](../azure-sql/database/authentication-aad-overview.md#azure-ad-features-and-limitations).

1. If your Azure AD tenant doesn't have a user yet, create one by following the steps at [Add or delete users using Azure Active Directory](../active-directory/fundamentals/add-users-azure-active-directory.md).

1. Find the object ID of the Azure AD user using the [`az ad user list`](/cli/azure/ad/user#az_ad_user_list) and replace *\<user-principal-name>*. The result is saved to a variable.

    ```azurecli-interactive
    azureaduser=$(az ad user list --filter "userPrincipalName eq '<user-principal-name>'" --query [].objectId --output tsv)
    ```

# [Azure SQL Database](#tab/sqldatabase)

3. Add this Azure AD user as an Active Directory admin using [`az sql server ad-admin create`](/cli/azure/sql/server/ad-admin#az_sql_server_ad_admin_create) command in the Cloud Shell. In the following command, replace *\<group-name>* and *\<server-name>* with your own parameters.

    ```azurecli-interactive
    az sql server ad-admin create --resource-group <group-name> --server-name <server-name> --display-name ADMIN --object-id $azureaduser
    ```

For more information on adding an Active Directory admin, see [Provision an Azure Active Directory administrator for your server](../azure-sql/database/authentication-aad-configure.md#provision-azure-ad-admin-sql-managed-instance)

# [Azure Database for MySQL](#tab/mysql)

3. Add this Azure AD user as an Active Directory admin using [`az mysql server ad-admin create`](/cli/azure/mysql/server/ad-admin#az_mysql_server_ad_admin_create) command in the Cloud Shell. In the following command, replace *\<group-name>* and *\<server-name>* with your own parameters.

    ```azurecli-interactive
    az mysql server ad-admin create --resource-group <group-name> --server-name <server-name> --display-name ADMIN --object-id $azureaduser
    ```

    > [!NOTE] 
    > The command is currently unavailable for Azure Database for MySQL Flexible Server 

# [Azure Database for PostgreSQL](#tab/postgresql)

3. Add this Azure AD user as an Active Directory admin using [`az postgres server ad-admin create`](/cli/azure/postgres/server/ad-admin#az_postgres_server_ad_admin_create) command in the Cloud Shell. In the following command, replace *\<group-name>* and *\<server-name>* with your own parameters.

    ```azurecli-interactive
    az postgres server ad-admin create --resource-group <group-name> --server-name <server-name> --display-name ADMIN --object-id $azureaduser
    ```

-----

## 2. Configure managed identity for app

Next, you configure your App Service app to connect to SQL Database with a managed identity.

1. Enable a managed identity for your App Service app with the [az webapp identity assign](/cli/azure/webapp/identity#az_webapp_identity_assign) command in the Cloud Shell. In the following command, replace *\<app-name>*.

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
    az identity create --name <identity-name> --output tsv --query "id"
    # assign identity to app 
    az webapp identity assign --resource-group <group-name> --name <app-name> --identities <client-id-of-user-assigned-identity>
    ```

    -----

    > [!NOTE]
    > To enable managed identity for a [deployment slot](deploy-staging-slots.md), add `--slot <slot-name>` and use the name of the slot in *\<slot-name>*.
    
1. The identity needs to be granted permissions to access the database. In the Cloud Shell, sign in to your database with the following command. Replace_\<server-name>_ with your server name, _\<db-name>_ with the database name your app uses, and _\<aad-user-name>_ and _\<aad-password>_ with your Azure AD user's credentials from [1. Grant database access to Azure AD user]().

    # [Azure SQL Database](#tab/sqldatabase)

    ```azurecli-interactive
    sqlcmd -S <server-name>.database.windows.net -d <db-name> -U <aad-user-name> -P "<aad-password>" -G -l 30
    ```

    # [Azure Database for MySQL](#tab/mysql)

    ```azurecli-interactive
    # Sign into Azure using the Azure AD user from "1. Grant database access to Azure AD user"
    az login --allow-no-subscriptions
    # Get access token for MySQL with the Azure AD user
    az account get-access-token --resource-type oss-rdbms --output tsv --query accessToken
    # Sign into the MySQL server using the token
    mysql -h <server-name>.mysql.database.azure.com --user <aad-user-name>@<server-name> --enable-cleartext-plugin --password=<token-output-from-last-command>
    ```

    The full username *<aad-user-name>@<server-name>* looks like `admin1@contoso.onmicrosoft.com@mydbserver1`.

    # [Azure Database for PostgreSQL](#tab/postgresql)

    ```azurecli-interactive
    # Sign into Azure using the Azure AD user from "1. Grant database access to Azure AD user"
    az login --allow-no-subscriptions
    # Get access token for PostgreSQL with the Azure AD user
    az account get-access-token --resource-type oss-rdbms --output tsv --query accessToken
    # Sign into the Postgres server
    psql "host=<server-name>.postgres.database.azure.com port=5432 dbname=<database-name> user=<aad-user-name>@<server-name> password=<token-output-from-last-command>"
    ```

    The full username *<aad-user-name>@<server-name>* looks like `admin1@contoso.onmicrosoft.com@mydbserver1`.

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

    For a [deployment slot](deploy-staging-slots.md), use *\<app-name>/slots/\<slot-name>* instead of *\<app-name>.

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

    Whatever name you choose for *\<mysql-user-name>*, it's the MySQL user you'll use to connect to the database from your code in App Service.

    # [User-assigned identity](#tab/userassigned/mysql)

    ```sql
    SET aad_auth_validate_oids_in_tenant = OFF;
    CREATE AADUSER '<mysql-user-name>' IDENTIFIED BY '<client-id-of-user-assigned-identity>';
    GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, ALTER ON *.* TO '<mysql-user-name>'@'%' WITH GRANT OPTION;
    FLUSH PRIVILEGES;
    ```

    Whatever name you choose for *\<mysql-user-name>*, it's the MySQL user you'll use to connect to the database from your code in App Service.

    # [System-assigned identity](#tab/systemassigned/postgresql)

    ```sql
    SET aad_auth_validate_oids_in_tenant = OFF;
    CREATE ROLE '<postgres-user-name>' WITH LOGIN PASSWORD '<application-id-of-system-assigned-identity>' IN ROLE azure_ad_user';
    ```
    
    Whatever name you choose for *\<postgres-user-name>*, it's the MySQL user you'll use to connect to the database from your code in App Service.

    # [User-assigned identity](#tab/userassigned/postgresql)

    ```sql
    SET aad_auth_validate_oids_in_tenant = OFF;
    CREATE ROLE '<postgres-user-name>' WITH LOGIN PASSWORD '<application-id-of-system-assigned-identity>' IN ROLE azure_ad_user';
    ```

    Whatever name you choose for *\<postgres-user-name>*, it's the MySQL user you'll use to connect to the database from your code in App Service.

    -----

## 3. Modify your code

To open a connection to the Azure database in your code, regardless of the language stack, follows this pattern:

1. Instantiate a `DefaultAzureCredential` from the Azure Identity client library. If you're using a user-assigned identity, specify the client ID of the identity.
1. Get an access token for the resource URI respective to the database type.
1. Add the token to your connection string.
1. Open the connection.

For Azure Database for MySQL and Azure Database for PostgreSQL, a specially-crafted username is also required in the connection string. The sample code also shows how to set up your app to work in both environments.

# [.NET Framework](#tab/netfx)

1. In Visual Studio, open the Package Manager Console and add the NuGet packages you need:

    # [Azure SQL Database](#tab/sqldatabase)

    ```powershell
    Install-Package Azure.Identity
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
    //var credential = new Azure.Identity.DefaultAzureCredential(new DefaultAzureCredentialOptions { ManagedIdentityClientId = <client-id-of-user-assigned-identity> }); // user-assigned identity

    // Get token for Azure SQL Database
    var token = credential.GetToken(new Azure.Core.TokenRequestContext(new[] { "https://database.windows.net/.default" }));

    // Add the token to the SQL connection
    var connection = new System.Data.SqlClient.SqlConnection("Server=tcp:<server-name>.database.windows.net;Database=<database-name>;");
    connection.AccessToken = token.Token;

    // Open the SQL connection
    connection.Open();
    ```
    
    This code uses [Azure.Identity.DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) to get a useable token for SQL Database (`https://database.windows.net/.default`) from Azure Active Directory and then adds it to the database connection.

    # [Azure Database for MySQL](#tab/mysql)

    ```csharp
    // Uncomment one of the two lines depending on the identity type
    //var credential = new Azure.Identity.DefaultAzureCredential(); // system-assigned identity
    //var credential = new Azure.Identity.DefaultAzureCredential(new DefaultAzureCredentialOptions { ManagedIdentityClientId = <client-id-of-user-assigned-identity> }); // user-assigned identity

    // Get token for Azure Database for MySQL
    var token = credential.GetToken(new Azure.Core.TokenRequestContext(new[] { "https://ossrdbms-aad.database.windows.net/.default" }));

    // Check if in Azure and set user accordingly
    if (String.IsNullOrEmpty(ConfigurationManager.AppSettings["IDENTITY_ENDPOINT"]))
        var mysqlUser = "<aad-user-name>@<server-name>";
    else var mysqlUser = "<mysql-user-name>@<server-name>";

    // Add the token to the MySQL connection
    var connectionString = "Server=<server-name>.mysql.database.azure.com;" + 
        "Port=3306;" + 
        "Database=<database-name>;" + 
        "Uid=" + mysqlUser + ";" +
        "Password="+ token.Token;
    var connection = new MySql.Data.MySqlClient.MySqlConnection(connectionString);

    connection.Open();
    ```

    # [Azure Database for PostgreSQL](#tab/postgresql)

    ```csharp
    // Uncomment one of the two lines depending on the identity type
    //var credential = new Azure.Identity.DefaultAzureCredential(); // system-assigned identity
    //var credential = new Azure.Identity.DefaultAzureCredential(new DefaultAzureCredentialOptions { ManagedIdentityClientId = <client-id-of-user-assigned-identity> }); // user-assigned identity

    // Get token for Azure Database for PostgreSQL
    var token = credential.GetToken(new Azure.Core.TokenRequestContext(new[] { "https://ossrdbms-aad.database.windows.net/.default" }));

    // Check if in Azure and set user accordingly
    if (String.IsNullOrEmpty(ConfigurationManager.AppSettings["IDENTITY_ENDPOINT"]))
        var postgresqlUser = "<aad-user-name>@<server-name>";
    else var postgresqlUser = "<postgresql-user-name>@<server-name>";

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

1. Install the .NET package you need into your .NET project:

    # [Azure SQL Database](#tab/sqldatabase)

    ```terminal
    dotnet add package Microsoft.Data.SqlClient
    ```

    # [Azure Database for MySQL](#tab/mysql)

    ```powershell
    dotnet add package MySql.Data
    ```

    # [Azure Database for PostgreSQL](#tab/postgresql)

    ```powershell
    dotnet add package Npgsql
    ```

    -----

1. Connect to the Azure database by adding an access token. If you're using a user-assigned identity, make sure you uncomment the applicable lines.

    # [Azure SQL Database](#tab/sqldatabase)

    ```csharp
    using Microsoft.Data.SqlClient;

    ...

    // Uncomment one of the two lines depending on the identity type    
    //SqlConnection connection = new SqlConnection("Server=tcp:<server-name>.database.windows.net;Database=<database-name>;Authentication=Active Directory Default;"); // system-assigned identity
    //SqlConnection connection = new SqlConnection("Server=tcp:<server-name>.database.windows.net;Database=<database-name>;Authentication=Active Directory Default;User Id=<client-id-of-user-assigned-identity>"); // user-assigned identity

    // Open the SQL connection
    connection.Open();
    ```

    The [Active Directory Default](/sql/connect/ado-net/sql/azure-active-directory-authentication#using-active-directory-default-authentication) authentication type can be used both on your local machine and in Azure App Service. The driver attempts to acquire a token from Azure Active Directory using various means. If the app is deployed, it gets a token from the app's managed identity. If the app is running locally, it tries to get a token from Visual Studio, Visual Studio Code, and Azure CLI.

    # [Azure Database for MySQL](#tab/mysql)

    ```csharp
    // Uncomment one of the two lines depending on the identity type
    var credential = new Azure.Identity.DefaultAzureCredential(); // system-assigned identity
    //var credential = new Azure.Identity.DefaultAzureCredential(new DefaultAzureCredentialOptions { ManagedIdentityClientId = <client-id-of-user-assigned-identity> }); // user-assigned identity

    // Get token for Azure Database for MySQL
    var token = credential.GetToken(new Azure.Core.TokenRequestContext(new[] { "https://ossrdbms-aad.database.windows.net/.default" }));

    // Set MySQL user depending on the environment
    if (String.IsNullOrEmpty(ConfigurationManager.AppSettings["IDENTITY_ENDPOINT"]))
        var user = "<aad-user-name>@<server-name>";
    else var user = "<mysql-user-name>@<server-name>";

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
    // Uncomment one of the two lines depending on the identity type
    //var credential = new Azure.Identity.DefaultAzureCredential(); // system-assigned identity
    //var credential = new Azure.Identity.DefaultAzureCredential(new DefaultAzureCredentialOptions { ManagedIdentityClientId = <client-id-of-user-assigned-identity> }); // user-assigned identity

    // Get token for Azure Database for PostgreSQL
    var token = credential.GetToken(new Azure.Core.TokenRequestContext(new[] { "https://ossrdbms-aad.database.windows.net/.default" }));

    // Check if in Azure and set user accordingly
    if (String.IsNullOrEmpty(ConfigurationManager.AppSettings["IDENTITY_ENDPOINT"]))
        var postgresqlUser = "<aad-user-name>@<server-name>";
    else var postgresqlUser = "<postgresql-user-name>@<server-name>";

    // Add the token to the PostgreSQL connection
    var connectionString = "Server=<server-name>.postgres.database.azure.com;" + 
        "Port=5432;" + 
        "Database=<database-name>;" + 
        "User Id=" + postgresqlUser + ";" +
        "Password="+ token.Token;
    var connection = new Npgsql.NpgsqlConnection(connectionString);

    connection.Open();

    ```

    This code uses [Azure.Identity.DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) to get a useable token for Azure Database for PostgreSQL (`https://ossrdbms-aad.database.windows.net/.default`) from Azure Active Directory and then adds it to the database connection. By default, `DefaultAzureCredential` gets a token from the logged-in user or from a managed identity, depending on whether you run it locally or in App Service. The `if` statement sets the PostgreSQL username based on which identity the token applies to. The token is then passed in to the PostgreSQL connection as the password for the Azure AD user.

    https://docs.microsoft.com/azure/postgresql/howto-connect-with-managed-identity

    -----

# [Node.js](#tab/nodejs)

1. Install the required NPM packages you need into your Node.js project:

    # [Azure SQL Database](#tab/sqldatabase)

    ```terminal
    npm install --save @azure/identity
    npm install --save tedious
    ```

    # [Azure Database for MySQL](#tab/mysql)

    ```terminal
    npm install --save @azure/identity
    npm install --save mysql
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
    import { Connection, Request } = require("tedious");
    import { DefaultAzureCredential } = require("@azure/identity");
    
    // Uncomment one of the two lines depending on the identity type
    //const credential = new DefaultAzureCredential(); // system-assigned identity
    //const credential = new DefaultAzureCredential({ managedIdentityClientId: "<client-id-of-user-assigned-identity>" }); // user-assigned identity
    
    // Get token for Azure SQL Database
    const accessToken = await credential.getToken("https://database.windows.net/.default");
    
    // Create connection to database
    const connection = new Connection({
        server: '<server-name>.database.windows.net',
        authentication: {
            type: 'azure-active-directory-access-token',
            options: {
                token: accessToken
            }
        },
        options: {
            database: '<database-name>',
            encrypt: true,
            port: 1433
        }
    }));
    
    // Open the database connection
    connection.connect();
    ```

    https://docs.microsoft.com/azure/azure-sql/database/connect-query-nodejs
    https://tediousjs.github.io/tedious/ also has an authentication type `azure-active-directory-msi-app-service`, which doesn't require you to retrieve the token yourself, but the above code uses `DefaultAzureCredential`, which works both in App Service and in your local development environment.

    # [Azure Database for MySQL](#tab/mysql)
    
    ```javascript
    const mysql = require('mysql');
    const fs = require('fs');
    import { DefaultAzureCredential } = require("@azure/identity");
    
    // Uncomment one of the two lines depending on the identity type
    //const credential = new DefaultAzureCredential(); // system-assigned identity
    //const credential = new DefaultAzureCredential({ managedIdentityClientId: "<client-id-of-user-assigned-identity>" }); // user-assigned identity
    
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
        password: accessToken,
        database: '<database-name>',
        port: 3306
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

    This code uses [Azure.Identity.DefaultAzureCredential](https://docs.microsoft.com/javascript/api/@azure/identity/defaultazurecredential) to get a useable token for Azure Database for MySQL (`https://ossrdbms-aad.database.windows.net/.default`) from Azure Active Directory and then adds it to the database connection. By default, `DefaultAzureCredential` gets a token from the logged-in user or from a managed identity, depending on whether you run it locally or in App Service. The `if` statement sets the MySQL username based on which identity the token applies to. The token is then passed in to the MySQL connection as the password for the Azure AD user.

    https://docs.microsoft.com/azure/mysql/connect-nodejs

    # [Azure Database for PostgreSQL](#tab/postgresql)
    
    ```javascript
    const pg = require('pg');
    const fs = require('fs');
    import { DefaultAzureCredential } = require("@azure/identity");
    
    // Uncomment one of the two lines depending on the identity type
    //const credential = new DefaultAzureCredential(); // system-assigned identity
    //const credential = new DefaultAzureCredential({ managedIdentityClientId: "<client-id-of-user-assigned-identity>" }); // user-assigned identity
    
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
        password: accessToken,
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

    The `if` statement sets the PostgreSQL username based on which identity the token applies to. The token is then passed in to the PostgreSQL connection as the password for the Azure AD user.

    https://docs.microsoft.com/azure/postgresql/connect-nodejs

    -----

# [Python](#tab/python)

1. In your Python project, install the required packages.

    # [Azure SQL Database](#tab/sqldatabase)

    ```terminal
    pip install azure-identity
    pip install pyodbc
    ```

    # [Azure Database for MySQL](#tab/mysql)

    ```terminal
    pip install azure-identity
    pip install mysql-connector-python
    ```

    https://docs.microsoft.com/azure/mysql/connect-python

    # [Azure Database for PostgreSQL](#tab/postgresql)

    ```terminal
    pip install azure-identity
    pip install psycopg2-binary
    ```

    https://docs.microsoft.com/azure/postgresql/connect-python

    -----

1. Connect to the Azure database by using an access token:

    # [Azure SQL Database](#tab/sqldatabase)

    ```python
    from azure.identity import DefaultAzureCredential
    import pyodbc
    
    # Uncomment one of the two lines depending on the identity type
    #credential = DefaultAzureCredential() # system-assigned identity
    #credential = DefaultAzureCredential(managed_identity_client_id=<client-id-of-user-assigned-identity>) # user-assigned identity
    
    # Get token for Azure SQL Database
    token = credential.get_token("https://database.windows.net/.default").encode("UTF-16-LE")
    
    # Connect with the token
    SQL_COPT_SS_ACCESS_TOKEN = 1256
    connString = f"Driver={ODBC Driver 17 for SQL Server};SERVER=<database-server-name>.database.windows.net;DATABASE=<database-name>"
    conn = pyodbc.connect(connString, attrs_before={SQL_COPT_SS_ACCESS_TOKEN: token})
    ```
    
    The [ODBC Driver 17 for SQL Server] also has an authentication type `ActiveDirectoryMsi`. You can connect from App Service without getting the token yourself, simply with the connection string `Driver={{ODBC Driver 17 for SQL Server}};SERVER=<database-server-name>.database.windows.net;DATABASE=<database-name>;Authentication=ActiveDirectoryMsi`. The above code gets the token with `DefaultAzureCredential`, which works both in App Service and in your local development environment.

    https://docs.microsoft.com/sql/connect/python/pyodbc/python-sql-driver-pyodbc

    # [Azure Database for MySQL](#tab/mysql)

    ```python
    from azure.identity import DefaultAzureCredential
    import mysql.connector
    
    # Uncomment one of the two lines depending on the identity type
    #credential = DefaultAzureCredential() # system-assigned identity
    #credential = DefaultAzureCredential(managed_identity_client_id=<client-id-of-user-assigned-identity>) # user-assigned identity
    
    # Get token for Azure Database for MySQL
    token = credential.get_token("https://ossrdbms-aad.database.windows.net/.default")
    
    # Set MySQL user depending on the environment
    if 'IDENTITY_ENDPOINT' in os.environ:
        mysqlUser = '<mysql-user-name>@<server-name>'
    else:
        mysqlUser = '<aad-user-name>@<server-name>'

    # Connect with the token
    config = {
      'host': '<database-server-name>.mysql.database.azure.com',
      'database': '<database-name>',
      'user': mysqlUser,
      'password': token
    }
    conn = mysql.connector.connect(**config)
    print("Connection established")
    ```

    # [Azure Database for PostgreSQL](#tab/postgresql)

    ```python
    from azure.identity import DefaultAzureCredential
    import psycopg2
    
    # Uncomment one of the two lines depending on the identity type
    #credential = DefaultAzureCredential() # system-assigned identity
    #credential = DefaultAzureCredential(managed_identity_client_id=<client-id-of-user-assigned-identity>) # user-assigned identity
    
    # Get token for Azure Database for PostgreSQL
    token = credential.get_token("https://ossrdbms-aad.database.windows.net/.default")
    
    # Set PostgreSQL user depending on the environment
    if 'IDENTITY_ENDPOINT' in os.environ:
        postgresUser = '<postgres-user-name>@<server-name>'
    else:
        postgresUser = '<aad-user-name>@<server-name>'

    # Connect with the token
    host = "<database-server-name>.postgres.database.azure.com"
    dbname = "<database-name>"
    conn_string = "host={0} user={1} dbname={2} password={3}".format(host, user, postgresUser, token)
    conn = psycopg2.connect(conn_string)
    ```

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

    https://docs.microsoft.com/azure/mysql/connect-java

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
    // Uncomment one of the two lines depending on the identity type
    //DefaultAzureCredential creds = new DefaultAzureCredentialBuilder().build(); // system-assigned identity
    //DefaultAzureCredential creds = new DefaultAzureCredentialBuilder().managedIdentityClientId("<client-id-of-user-assigned-identity>").build(); // user-assigned identity

    // Get the token  
    TokenRequestContext request = new TokenRequestContext();
    request.addScopes("https://database.windows.net//.default");
    AccessToken token=creds.getToken(request).block();

    // Set token in your SQL connection
    SQLServerDataSource ds = new SQLServerDataSource();
    ds.setServerName("<database-server-name>.database.windows.net");
    ds.setDatabaseName("<database-name>");
    ds.setAccessToken(token.getToken());

    // Connect
    try (Connection connection = ds.getConnection(); 
            Statement stmt = connection.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT SUSER_SNAME()")) {
        if (rs.next()) {
            System.out.println("You have successfully logged on as: " + rs.getString(1));
        }
    }
    ```

    The [JDBC Driver for SQL Server] also has an authentication type [ActiveDirectoryMsi](https://docs.microsoft.com/sql/connect/jdbc/connecting-using-azure-active-directory-authentication#connect-using-activedirectorymsi-authentication-mode), which is easier to use for App Service. The above code gets the token with `DefaultAzureCredential`, which works both in App Service and in your local development environment.

    # [Azure Database for MySQL](#tab/mysql)

    ```java
    import java.sql.*;

    ...

    // Set JDBC driver
    Class.forName("com.mysql.jdbc.Driver").newInstance();

    // Uncomment one of the two lines depending on the identity type
    //DefaultAzureCredential creds = new DefaultAzureCredentialBuilder().build(); // system-assigned identity
    //DefaultAzureCredential creds = new DefaultAzureCredentialBuilder().managedIdentityClientId("<client-id-of-user-assigned-identity>").build(); // user-assigned identity

    // Get the token
    TokenRequestContext request = new TokenRequestContext();
    request.addScopes("https://ossrdbms-aad.database.windows.net/.default");
    AccessToken token=creds.getToken(request).block();

    // Set MySQL user depending on the environment
    if (System.getenv("IDENTITY_ENDPOINT"))
        var mysqlUser = "<aad-user-name>@<server-name>";
    else var mysqlUser = "<mysql-user-name>@<server-name>";

    // Set token in your SQL connection
    conn = DriverManager.getConnection(
            "jdbc:mysql://<database-server-name>.mysql.database.azure.com/<database-name>",
            mysqlUser
            token.getToken());
    ```

    # [Azure Database for PostgreSQL](#tab/postgresql)

    ```java
    import java.sql.*;

    ...

    // Set JDBC driver
    Class.forName("com.mysql.jdbc.Driver").newInstance();

    // Uncomment one of the two lines depending on the identity type
    //DefaultAzureCredential creds = new DefaultAzureCredentialBuilder().build(); // system-assigned identity
    //DefaultAzureCredential creds = new DefaultAzureCredentialBuilder().managedIdentityClientId("<client-id-of-user-assigned-identity>").build(); // user-assigned identity

    // Get the token
    TokenRequestContext request = new TokenRequestContext();
    request.addScopes("https://ossrdbms-aad.database.windows.net/.default");
    AccessToken token=creds.getToken(request).block();

    // Set PostgreSQL user depending on the environment
    if (System.getenv("IDENTITY_ENDPOINT"))
        var postgresUser = "<aad-user-name>@<server-name>";
    else var postgresUser = "<postgres-user-name>@<server-name>";

    // Set token in your SQL connection
    conn = DriverManager.getConnection(
            "jdbc:jdbc:postgresql://<database-server-name>.postgres.database.azure.com:5432/<database-name>",
            postgresUser
            token.getToken());
    ```

    https://docs.microsoft.com/azure/developer/java/spring-framework/configure-spring-data-jdbc-with-azure-postgresql
    https://docs.microsoft.com/azure/developer/java/spring-framework/configure-spring-data-jpa-with-azure-postgresql
    https://docs.microsoft.com/azure/developer/java/spring-framework/configure-spring-data-r2dbc-with-azure-postgresql
    -----

-----

## 4. Set up your dev environment

 This sample code uses `DefaultAzureCredential` to get a useable token for your Azure database from Azure Active Directory and then adds it to the database connection. While you can customize `DefaultAzureCredential`, it's already versatile by default. It gets a token from the signed-in Azure AD user or from a managed identity, depending on whether you run it locally in your development environment or in App Service.

In this step, you configure your development environment by signing in with the Azure AD user you want `DefaultAzureCredential` to use.

# [Visual Studio Windows](#tab/windowsclient)

1. Visual Studio for Windows is integrated with Azure AD authentication. To enable development and debugging in Visual Studio, add your Azure AD user in Visual Studio by selecting **File** > **Account Settings** from the menu, and select **Sign in** or **Add**.

1. To set the Azure AD user for Azure service authentication, select **Tools** > **Options** from the menu, then select **Azure Service Authentication** > **Account Selection**. Select the Azure AD user you added and select **OK**.

# [Visual Studio for macOS](#tab/macosclient)

1. Visual Studio for Mac is *not* integrated with Azure AD authentication. However, the Azure Identity client library that you'll use later can use tokens from Azure CLI. To enable development and debugging in Visual Studio, [install Azure CLI](/cli/azure/install-azure-cli) on your local machine.

1. Sign in to Azure CLI with the following command using your Azure AD user:

    ```azurecli
    az login --allow-no-subscriptions
    ```

# [Visual Studio Code](#tab/vscode)

1. Visual Studio Code is integrated with Azure AD authentication through the Azure extension. Install the <a href="https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack" target="_blank">Azure Tools</a> extension in Visual Studio Code.

1. In Visual Studio Code, in the [Activity Bar](https://code.visualstudio.com/docs/getstarted/userinterface), select the **Azure** logo.

1. In the **App Service** explorer, select **Sign in to Azure...** and follow the instructions.

# [Azure CLI](#tab/cli)

1. The Azure Identity client library that you'll use later can use tokens from Azure CLI. To enable command-line based development, [install Azure CLI](/cli/azure/install-azure-cli) on your local machine.

1. Sign in to Azure with the following command using your Azure AD user:

    ```azurecli
    az login --allow-no-subscriptions
    ```

# [Azure PowerShell](#tab/ps)

1. The Azure Identity client library that you'll use later can use tokens from Azure PowerShell. To enable command-line based development, [install Azure PowerShell](/powershell/azure/install-az-ps) on your local machine.

1. Sign in to Azure CLI with the following cmdlet using your Azure AD user:

    ```powershell-interactive
    Connect-AzAccount
    ```

-----

For more information about setting up your dev environment for Azure Active Directory authentication, see [Azure Identity client library for .NET](/dotnet/api/overview/azure/Identity-readme).

You're now ready to develop and debug your app with the SQL Database as the back end, using Azure AD authentication.

## 5. Test and publish

1. Run your code in your dev environment. Your code uses the signed-in Azure AD user in your environment to connect to the back-end database. The user can access the database because it's configured as an Azure AD administrator for the database.

1. Publish your code to Azure using the preferred publishing method. In App Service, your code uses the app's managed identity to connect to the back-end database.

## Frequently asked questions

#### Does managed identity support SQL Server?

Azure Active Directory and managed identities aren't supported for on-premises SQL Server. 

#### I made changes to App Service authentication or the associated app registration. Why do I still get the old token?

The back-end services of managed identities also [maintain a token cache](overview-managed-identity.md#configure-target-resource) that updates the token for a target resource only when it expires. If you modify the configuration *after* trying to get a token with your app, you don't actually get a new token with the updated permissions until the cached token expires. The best way to work around this is to test your changes with a new InPrivate (Edge)/private (Safari)/Incognito (Chrome) window. That way, you're sure to start from a new authenticated session.


#### How do I add the managed identity to an Azure AD group?

If you want, you can add the identity to an [Azure AD group](../active-directory/fundamentals/active-directory-manage-groups.md), then grant  access to the Azure AD group instead of the identity. For example, the following commands add the managed identity from the previous step to a new group called _myAzureSQLDBAccessGroup_:

```azurecli-interactive
groupid=$(az ad group create --display-name myAzureSQLDBAccessGroup --mail-nickname myAzureSQLDBAccessGroup --query objectId --output tsv)
msiobjectid=$(az webapp identity show --resource-group <group-name> --name <app-name> --query principalId --output tsv)
az ad group member add --group $groupid --member-id $msiobjectid
az ad group member list -g $groupid
```

To grant database permissions for an Azure AD group, see documentation for the respective database type.

## Next steps

What you learned:

> [!div class="checklist"]
> * Grant database access to Azure AD user for access development machine.
> * Configure managed identity for the app and grant database access to managed identity.
> * Connect to Azure database from your code using a managed identity.
> * Maintain database connectivity both from your development environment and from Azure.

> [!div class="nextstepaction"]
> [Map an existing custom DNS name to Azure App Service](app-service-web-tutorial-custom-domain.md)

> [!div class="nextstepaction"]
> [Tutorial: Connect to Azure services that don't support managed identities (using Key Vault)](tutorial-connect-msi-key-vault.md)

> [!div class="nextstepaction"]
> [Tutorial: Isolate back-end communication with Virtual Network integration](tutorial-networking-isolate-vnet.md)
