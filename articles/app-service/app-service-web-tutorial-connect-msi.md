---
title: 'Tutorial: Access data with managed identity'
description: Learn how to make database connectivity more secure by using a managed identity, and also how to apply it to other Azure services.

ms.devlang: dotnet
ms.topic: tutorial
ms.date: 04/27/2020
ms.custom: "devx-track-csharp, mvc, cli-validate, devx-track-azurecli"
---
# Tutorial: Secure Azure SQL Database connection from App Service using a managed identity

[App Service](overview.md) provides a highly scalable, self-patching web hosting service in Azure. It also provides a [managed identity](overview-managed-identity.md) for your app, which is a turn-key solution for securing access to [Azure SQL Database](/azure/sql-database/) and other Azure services. Managed identities in App Service make your app more secure by eliminating secrets from your app, such as credentials in the connection strings. In this tutorial, you will add managed identity to the sample web app you built in one of the following tutorials: 

- [Tutorial: Build an ASP.NET app in Azure with Azure SQL Database](app-service-web-tutorial-dotnet-sqldatabase.md)
- [Tutorial: Build an ASP.NET Core and Azure SQL Database app in Azure App Service](tutorial-dotnetcore-sqldb-app.md)

When you're finished, your sample app will connect to SQL Database securely without the need of username and passwords.

> [!NOTE]
> The steps covered in this tutorial support the following versions:
> 
> - .NET Framework 4.7.2 and above
> - .NET Core 2.2 and above
>

What you will learn:

> [!div class="checklist"]
> * Enable managed identities
> * Grant SQL Database access to the managed identity
> * Configure Entity Framework to use Azure AD authentication with SQL Database
> * Connect to SQL Database from Visual Studio using Azure AD authentication

> [!NOTE]
>Azure AD authentication is _different_ from [Integrated Windows authentication](/previous-versions/windows/it-pro/windows-server-2003/cc758557(v=ws.10)) in on-premises Active Directory (AD DS). AD DS and Azure AD use completely different authentication protocols. For more information, see [Azure AD Domain Services documentation](../active-directory-domain-services/index.yml).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

This article continues where you left off in [Tutorial: Build an ASP.NET app in Azure with SQL Database](app-service-web-tutorial-dotnet-sqldatabase.md) or [Tutorial: Build an ASP.NET Core and SQL Database app in Azure App Service](tutorial-dotnetcore-sqldb-app.md). If you haven't already, follow one of the two tutorials first. Alternatively, you can adapt the steps for your own .NET app with SQL Database.

To debug your app using SQL Database as the back end, make sure that you've allowed client connection from your computer. If not, add the client IP by following the steps at [Manage server-level IP firewall rules using the Azure portal](../azure-sql/database/firewall-configure.md#use-the-azure-portal-to-manage-server-level-ip-firewall-rules).

Prepare your environment for the Azure CLI.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](../../includes/azure-cli-prepare-your-environment-no-header.md)]

## Grant database access to Azure AD user

First enable Azure AD authentication to SQL Database by assigning an Azure AD user as the Active Directory admin of the server. This user is different from the Microsoft account you used to sign up for your Azure subscription. It must be a user that you created, imported, synced, or invited into Azure AD. For more information on allowed Azure AD users, see [Azure AD features and limitations in SQL Database](../azure-sql/database/authentication-aad-overview.md#azure-ad-features-and-limitations).

If your Azure AD tenant doesn't have a user yet, create one by following the steps at [Add or delete users using Azure Active Directory](../active-directory/fundamentals/add-users-azure-active-directory.md).

Find the object ID of the Azure AD user using the [`az ad user list`](/cli/azure/ad/user#az_ad_user_list) and replace *\<user-principal-name>*. The result is saved to a variable.

```azurecli-interactive
azureaduser=$(az ad user list --filter "userPrincipalName eq '<user-principal-name>'" --query [].objectId --output tsv)
```
> [!TIP]
> To see the list of all user principal names in Azure AD, run `az ad user list --query [].userPrincipalName`.
>

Add this Azure AD user as an Active Directory admin using [`az sql server ad-admin create`](/cli/azure/sql/server/ad-admin#az_sql_server_ad_admin_create) command in the Cloud Shell. In the following command, replace *\<server-name>* with the server name (without the `.database.windows.net` suffix).

```azurecli-interactive
az sql server ad-admin create --resource-group myResourceGroup --server-name <server-name> --display-name ADMIN --object-id $azureaduser
```

For more information on adding an Active Directory admin, see [Provision an Azure Active Directory administrator for your server](../azure-sql/database/authentication-aad-configure.md#provision-azure-ad-admin-sql-managed-instance)

## Set up Visual Studio

### Windows client
Visual Studio for Windows is integrated with Azure AD authentication. To enable development and debugging in Visual Studio, add your Azure AD user in Visual Studio by selecting **File** > **Account Settings** from the menu, and click **Add an account**.

To set the Azure AD user for Azure service authentication, select **Tools** > **Options** from the menu, then select **Azure Service Authentication** > **Account Selection**. Select the Azure AD user you added and click **OK**.

You're now ready to develop and debug your app with the SQL Database as the back end, using Azure AD authentication.

### macOS client

Visual Studio for Mac is not integrated with Azure AD authentication. However, the [Microsoft.Azure.Services.AppAuthentication](https://www.nuget.org/packages/Microsoft.Azure.Services.AppAuthentication) library that you will use later can use tokens from Azure CLI. To enable development and debugging in Visual Studio, first you need to [install Azure CLI](/cli/azure/install-azure-cli) on your local machine.

Once Azure CLI is installed on your local machine, sign in to Azure CLI with the following command using your Azure AD user:

```azurecli
az login --allow-no-subscriptions
```
You're now ready to develop and debug your app with the SQL Database as the back end, using Azure AD authentication.

## Modify your project

The steps you follow for your project depends on whether it's an ASP.NET project or an ASP.NET Core project.

- [Modify ASP.NET](#modify-aspnet)
- [Modify ASP.NET Core](#modify-aspnet-core)

### Modify ASP.NET

In Visual Studio, open the Package Manager Console and add the NuGet package [Microsoft.Azure.Services.AppAuthentication](https://www.nuget.org/packages/Microsoft.Azure.Services.AppAuthentication):

```powershell
Install-Package Microsoft.Azure.Services.AppAuthentication -Version 1.4.0
```

In *Web.config*, working from the top of the file and make the following changes:

- In `<configSections>`, add the following section declaration in it:

    ```xml
    <section name="SqlAuthenticationProviders" type="System.Data.SqlClient.SqlAuthenticationProviderConfigurationSection, System.Data, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" />
    ```

- below the closing `</configSections>` tag, add the following XML code for `<SqlAuthenticationProviders>`.

    ```xml
    <SqlAuthenticationProviders>
      <providers>
        <add name="Active Directory Interactive" type="Microsoft.Azure.Services.AppAuthentication.SqlAppAuthenticationProvider, Microsoft.Azure.Services.AppAuthentication" />
      </providers>
    </SqlAuthenticationProviders>
    ```    

- Find the connection string called `MyDbConnection` and replace its `connectionString` value with `"server=tcp:<server-name>.database.windows.net;database=<db-name>;UID=AnyString;Authentication=Active Directory Interactive"`. Replace _\<server-name>_ and _\<db-name>_ with your server name and database name.

> [!NOTE]
> The SqlAuthenticationProvider you just registered is based on top of the AppAuthentication library you installed earlier. By default, it uses a system-assigned identity. To leverage a user-assigned identity, you will need to provide an additional configuration. Please see [connection string support](/dotnet/api/overview/azure/service-to-service-authentication#connection-string-support) for the AppAuthentication library.

That's every thing you need to connect to SQL Database. When debugging in Visual Studio, your code uses the Azure AD user you configured in [Set up Visual Studio](#set-up-visual-studio). You'll set up SQL Database later to allow connection from the managed identity of your App Service app.

Type `Ctrl+F5` to run the app again. The same CRUD app in your browser is now connecting to the Azure SQL Database directly, using Azure AD authentication. This setup lets you run database migrations from Visual Studio.

### Modify ASP.NET Core

In Visual Studio, open the Package Manager Console and add the NuGet package [Microsoft.Azure.Services.AppAuthentication](https://www.nuget.org/packages/Microsoft.Azure.Services.AppAuthentication):

```powershell
Install-Package Microsoft.Azure.Services.AppAuthentication -Version 1.4.0
```

In the [ASP.NET Core and SQL Database tutorial](tutorial-dotnetcore-sqldb-app.md), the `MyDbConnection` connection string isn't used at all because the local development environment uses a Sqlite database file, and the Azure production environment uses a connection string from App Service. With Active Directory authentication, you want both environments to use the same connection string. In *appsettings.json*, replace the value of the `MyDbConnection` connection string with:

```json
"Server=tcp:<server-name>.database.windows.net,1433;Database=<database-name>;"
```

Next, you supply the Entity Framework database context with the access token for the SQL Database. In *Data\MyDatabaseContext.cs*, add the following code inside the curly braces of the empty `MyDatabaseContext (DbContextOptions<MyDatabaseContext> options)` constructor:

```csharp
var connection = (SqlConnection)Database.GetDbConnection();
connection.AccessToken = (new Microsoft.Azure.Services.AppAuthentication.AzureServiceTokenProvider()).GetAccessTokenAsync("https://database.windows.net/").Result;
```

> [!NOTE]
> This demonstration code is synchronous for clarity and simplicity.

That's every thing you need to connect to SQL Database. When debugging in Visual Studio, your code uses the Azure AD user you configured in [Set up Visual Studio](#set-up-visual-studio). You'll set up SQL Database later to allow connection from the managed identity of your App Service app. The `AzureServiceTokenProvider` class caches the token in memory and retrieves it from Azure AD just before expiration. You don't need any custom code to refresh the token.

> [!TIP]
> If the Azure AD user you configured has access to multiple tenants, call `GetAccessTokenAsync("https://database.windows.net/", tenantid)` with the desired tenant ID to retrieve the proper access token.

Type `Ctrl+F5` to run the app again. The same CRUD app in your browser is now connecting to the Azure SQL Database directly, using Azure AD authentication. This setup lets you run database migrations from Visual Studio.

## Use managed identity connectivity

Next, you configure your App Service app to connect to SQL Database with a system-assigned managed identity.

> [!NOTE]
> While the instructions in this section are for a system-assigned identity, a user-assigned identity can just as easily be used. To do this. you would need the change the `az webapp identity assign command` to assign the desired user-assigned identity. Then, when creating the SQL user, make sure to use the name of the user-assigned identity resource rather than the site name.

### Enable managed identity on app

To enable a managed identity for your Azure app, use the [az webapp identity assign](/cli/azure/webapp/identity#az_webapp_identity_assign) command in the Cloud Shell. In the following command, replace *\<app-name>*.

```azurecli-interactive
az webapp identity assign --resource-group myResourceGroup --name <app-name>
```

Here's an example of the output:

<pre>
{
  "additionalProperties": {},
  "principalId": "21dfa71c-9e6f-4d17-9e90-1d28801c9735",
  "tenantId": "72f988bf-86f1-41af-91ab-2d7cd011db47",
  "type": "SystemAssigned"
}
</pre>

### Grant permissions to managed identity

> [!NOTE]
> If you want, you can add the identity to an [Azure AD group](../active-directory/fundamentals/active-directory-manage-groups.md), then grant SQL Database access to the Azure AD group instead of the identity. For example, the following commands add the managed identity from the previous step to a new group called _myAzureSQLDBAccessGroup_:
> 
> ```azurecli-interactive
> groupid=$(az ad group create --display-name myAzureSQLDBAccessGroup --mail-nickname myAzureSQLDBAccessGroup --query objectId --output tsv)
> msiobjectid=$(az webapp identity show --resource-group myResourceGroup --name <app-name> --query principalId --output tsv)
> az ad group member add --group $groupid --member-id $msiobjectid
> az ad group member list -g $groupid
> ```
>

In the Cloud Shell, sign in to SQL Database by using the SQLCMD command. Replace _\<server-name>_ with your server name, _\<db-name>_ with the database name your app uses, and _\<aad-user-name>_ and _\<aad-password>_ with your Azure AD user's credentials.

```bash
sqlcmd -S <server-name>.database.windows.net -d <db-name> -U <aad-user-name> -P "<aad-password>" -G -l 30
```

In the SQL prompt for the database you want, run the following commands to grant the permissions your app needs. For example, 

```sql
CREATE USER [<identity-name>] FROM EXTERNAL PROVIDER;
ALTER ROLE db_datareader ADD MEMBER [<identity-name>];
ALTER ROLE db_datawriter ADD MEMBER [<identity-name>];
ALTER ROLE db_ddladmin ADD MEMBER [<identity-name>];
GO
```

*\<identity-name>* is the name of the managed identity in Azure AD. If the identity is system-assigned, the name always the same as the name of your App Service app. To grant permissions for an Azure AD group, use the group's display name instead (for example, *myAzureSQLDBAccessGroup*).

Type `EXIT` to return to the Cloud Shell prompt.

> [!NOTE]
> The back-end services of managed identities also [maintains a token cache](overview-managed-identity.md#obtain-tokens-for-azure-resources) that updates the token for a target resource only when it expires. If you make a mistake configuring your SQL Database permissions and try to modify the permissions *after* trying to get a token with your app, you don't actually get a new token with the updated permissions until the cached token expires.

> [!NOTE]
> AAD is not supported for on-prem SQL Server, and this includes MSIs. 

### Modify connection string

Remember that the same changes you made in *Web.config* or *appsettings.json* works with the managed identity, so the only thing to do is to remove the existing connection string in App Service, which Visual Studio created deploying your app the first time. Use the following command, but replace *\<app-name>* with the name of your app.

```azurecli-interactive
az webapp config connection-string delete --resource-group myResourceGroup --name <app-name> --setting-names MyDbConnection
```

## Publish your changes

All that's left now is to publish your changes to Azure.

**If you came from [Tutorial: Build an ASP.NET app in Azure with SQL Database](app-service-web-tutorial-dotnet-sqldatabase.md)**, publish your changes in Visual Studio. In the **Solution Explorer**, right-click your **DotNetAppSqlDb** project and select **Publish**.

![Publish from Solution Explorer](./media/app-service-web-tutorial-dotnet-sqldatabase/solution-explorer-publish.png)

In the publish page, click **Publish**. 

**If you came from [Tutorial: Build an ASP.NET Core and SQL Database app in Azure App Service](tutorial-dotnetcore-sqldb-app.md)**, publish your changes using Git, with the following commands:

```bash
git commit -am "configure managed identity"
git push azure main
```

When the new webpage shows your to-do list, your app is connecting to the database using the managed identity.

![Azure app after Code First Migration](./media/app-service-web-tutorial-dotnet-sqldatabase/this-one-is-done.png)

You should now be able to edit the to-do list as before.

[!INCLUDE [cli-samples-clean-up](../../includes/cli-samples-clean-up.md)]

## Next steps

What you learned:

> [!div class="checklist"]
> * Enable managed identities
> * Grant SQL Database access to the managed identity
> * Configure Entity Framework to use Azure AD authentication with SQL Database
> * Connect to SQL Database from Visual Studio using Azure AD authentication

Advance to the next tutorial to learn how to map a custom DNS name to your web app.

> [!div class="nextstepaction"]
> [Map an existing custom DNS name to Azure App Service](app-service-web-tutorial-custom-domain.md)