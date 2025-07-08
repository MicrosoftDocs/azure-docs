---
title: 'Tutorial: Connect a web app to SQL Database on behalf of the user'
description: Use the signed-in user to secure database connectivity from .NET web app using Microsoft Entra authentication. Learn how to apply it to other Azure services.
author: cephalin

ms.service: azure-app-service
ms.author: cephalin
ms.devlang: csharp
ms.custom: devx-track-azurecli, devx-track-dotnet, AppServiceConnectivity
ms.topic: tutorial
ms.date: 07/07/2025
---
# Tutorial: Connect an App Service app to SQL Database on behalf of the signed-in user

This tutorial shows you how to connect an [Azure App Service](overview.md) app to a back-end Azure SQL database by impersonating the signed-in user, also called the [on-behalf-of flow](/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow). You enable [built-in authentication](overview-authentication-authorization.md) for the app using the Microsoft Entra identity provider.

This connectivity method is more advanced than the managed identity approach in [Tutorial: Access data with managed identity](tutorial-connect-msi-sql-database.md), and has the following advantages in enterprise scenarios:

- Eliminates connection secrets to back-end services, as does the managed identity approach.
- Gives the back-end database or other Azure services more control over how much access to grant to whom.
- Lets the app tailor its data presentation to the signed-in user.

In this tutorial, you add Microsoft Entra authentication to a .NET web app that has an Azure SQL Database back end. You learn how to:

> [!div class="checklist"]
> - Enable Microsoft Entra authentication for Azure SQL Database.
> - Disable other SQL Database authentication options.
> - Add Microsoft Entra ID as the identity provider for your app.
> - Configure SQL Database user impersonation permission.
> - Configure App Service to provide a usable access token for SQL Database.
> - Access your Azure SQL database on behalf of the signed-in Microsoft Entra user.

When you complete the tutorial, your app securely connects to SQL Database on behalf of the signed-in user.

:::image type="content" source="./media/tutorial-connect-app-access-sql-database-as-user-dotnet/architecture.png" alt-text="Architecture diagram for tutorial scenario." border="false":::

> [!NOTE]
> - Microsoft Entra ID isn't supported for on-premises SQL Server.
> 
> - Microsoft Entra authentication is different from [Integrated Windows authentication](/previous-versions/windows/it-pro/windows-server-2003/cc758557(v=ws.10)) in on-premises Active Directory (AD) Domain Services (DS). AD DS and Microsoft Entra ID use completely different authentication protocols. For more information, see [Microsoft Entra Domain Services documentation](/azure/active-directory-domain-services/index).

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

- Have access to a Microsoft Entra tenant populated with users and groups.

- Have an Azure App Service app that uses Azure SQL Database with SQL authentication as the back end. You can use the sample app from either of the following tutorials:

  - [Tutorial: Build an ASP.NET app in Azure with SQL Database](app-service-web-tutorial-dotnet-sqldatabase.md)
  - [Tutorial: Build an ASP.NET Core and SQL Database app in Azure App Service](tutorial-dotnetcore-sqldb-app.md).

  Alternatively, you can adapt the steps for your own .NET app with SQL Database. The steps in this tutorial support the following .NET versions:

  - .NET Framework 4.8 and above
  - .NET 6.0 and above

- Sign in to Azure Cloud Shell or prepare your environment to use the Azure CLI.
  [!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

<a name='1-configure-database-server-with-azure-ad-authentication'></a>
## 1. Configure database server with Microsoft Entra authentication

Enable Microsoft Entra authentication to the Azure SQL database by assigning a Microsoft Entra user as the admin of the Azure SQL server. The Microsoft Entra admin must be a user that is created, imported, synced, or invited into Microsoft Entra ID. The Microsoft Entra user might not be the same as the Microsoft account user for the Azure subscription.

- For more information on creating a Microsoft Entra user, see [Add or delete users using Microsoft Entra ID](/entra/fundamentals/how-to-create-delete-users).
- For more information on allowed Microsoft Entra users for SQL Database, see [Microsoft Entra features and limitations in SQL Database](/azure/azure-sql/database/authentication-aad-overview#limitations).
- For more information on adding an Azure SQL server admin, see [Provision a Microsoft Entra administrator for your server](/azure/azure-sql/database/authentication-aad-configure#provision-azure-ad-admin-sql-managed-instance).

To add the Microsoft Entra ID user as admin of the Azure SQL server, run the following Azure CLI commands.

1. Use [`az ad user list`](/cli/azure/ad/user#az-ad-user-list) with the `display-name`, `filter`, or `upn` parameter to get the object ID for the Microsoft Entra ID user you want to make admin. You can run `az ad user list` standalone to show information for all the users in the Microsoft Entra directory.

   For example, the following command lists information for a Microsoft Entra ID user with the `display-name` of Firstname Lastname.

   ```azurecli
   az ad user list --display-name "Firstname Lastname"
   ```

   Copy the `id` value from the output to use in the next step.
   
1. Add the Microsoft Entra ID user as an admin on your Azure SQL server by using [`az sql server ad-admin create`](/cli/azure/sql/server/ad-admin#az-sql-server-ad-admin-create) with the `object-id` parameter. In the following command, replace `<group-name>` with your server's resource group name, `<server-name>` with your server's name minus the `.database.windows.net` suffix, and `<entra-id>` with the `id` output from the preceding `az ad user list` command.

   ```azurecli
   az sql server ad-admin create --resource-group <group-name> --server-name <server-name> --display-name ADMIN --object-id <entra-id>
   ```

1. Restrict database server authentication to Active Directory authentication only. This step disables SQL username and password authentication.

   ```azurecli
   az sql server ad-only-auth enable --resource-group <group-name> --name <server-name>
   ```

## 2. Enable Entra ID authentication for your app

Add Microsoft Entra ID as an identity provider for your app. For more information, see [Configure Microsoft Entra authentication for your App Services application](configure-authentication-provider-aad.md).

1. On the [Azure portal](https://portal.azure.com) page for your app, select **Authentication** under **Settings** in the left navigation menu.

1. On the **Authentication** page, select **Add identity provider**, or select **Add provider** in the **Identity provider** section.

1. On the **Add an identity provider** page, select **Microsoft** as the provider.

1. For **Client secret expiration**, select one of the dropdown list options, such as **Recommended: 180 days**.

1. Keep all of the default settings, and select **Add**.

   :::image type="content" source="./media/tutorial-connect-app-access-sql-database-as-user-dotnet/add-azure-ad-provider.png" alt-text="Screenshot showing the add identity provider page." lightbox="./media/tutorial-connect-app-access-sql-database-as-user-dotnet/add-azure-ad-provider.png":::

> [!NOTE]
> If you reconfigure your app's authentication settings, the tokens in the token store might not regenerate from the new settings. To make sure your tokens regenerate, sign out and sign back in to your app. An easy method is to use your browser in private mode. Close and reopen the browser in private mode after changing the settings in your apps.

## 3. Configure SQL Database user impersonation

Grant your app permissions to access SQL Database on behalf of the signed-in Microsoft Entra user.

1. On the app's **Authentication** page, select your app name under **Identity provider**.

   The app registration page opens. This registration was automatically generated when you added the Microsoft Entra provider.

1. Select **API permissions** under **Manage** in the left navigation menu.

1. On the **API permissions** page, select **Add a permission**.

1. On the **Request API permissions** screen, select the **APIs my organization uses** tab.

1. Enter *azure sql database* in the search box and select the result.

1. Under **What type of permissions does your application require**, select **Delegated permissions**, then select the checkbox next to **user_impersonation**, and then select **Add permissions**.

    :::image type="content" source="./media/tutorial-connect-app-access-sql-database-as-user-dotnet/select-permission.png" alt-text="Screenshot of the Request API permissions page showing Delegated permissions, user_impersonation, and the Add permission button selected.":::

The app registration in Microsoft Entra ID now has the required permissions to connect to SQL Database by impersonating the signed-in user.

## 4. Configure App Service to return a usable access token

To configure your app to provide a usable access token for SQL Database, you add `https://database.windows.net/user_impersonation` as a `scope` to the Entra ID provider's `loginParameters`. The following command adds the `loginParameters` property with custom scopes to the Entra ID identity provider `login` settings.

Of the requested scopes, App Service already requests `openid`, `profile`, and `email` scopes by default. The [`offline_access`](/entra/identity-platform/scopes-oidc#the-offline_access-scope) scope is included so you can refresh tokens. For more information, see [OpenID Connect scopes](/entra/identity-platform/scopes-oidc#openid-connect-scopes).

The `https://database.windows.net/user_impersonation` scope refers to Azure SQL Database and provides a [JSON Web Token (JWT)](https://wikipedia.org/wiki/JSON_Web_Token) that specifies SQL Database as the token recipient. This command uses `jq` for JSON processing, which is already installed in Cloud Shell.

```azurecli
authSettings=$(az webapp auth show --resource-group <group-name> --name <app-name>)
authSettings=$(echo "$authSettings" | jq '.properties' | jq '.identityProviders.azureActiveDirectory.login += {"loginParameters":["scope=openid profile email offline_access https://database.windows.net/user_impersonation"]}')
az webapp auth set --resource-group <group-name> --name <app-name> --body "$authSettings"
```

> [!TIP]
> To configure the required scope using a web interface instead of Azure CLI, add `https://database.windows.net/user_impersonation` to the requested scopes in [Configure the Microsoft Entra provider to supply refresh tokens](configure-authentication-oauth-tokens.md#configure-the-microsoft-entra-provider-to-supply-refresh-tokens).

Your app is now configured to generate an access token that SQL Database accepts.

>[!NOTE]
> Your access token expires after some time. For information on how to refresh your access tokens without requiring users to reauthenticate with your app, see [Refresh auth tokens](configure-authentication-oauth-tokens.md#refresh-auth-tokens).

## 5. Update your application code

To use Microsoft Entra authentication to interact with your app, you must update the database context to refer to the Entity Framework SQL Server provider, which depends on the modern [Microsoft.Data.SqlClient](https://github.com/dotnet/SqlClient) ADO.NET provider. The Entity Framework provider replaces the built-in `System.Data.SqlClient` SQL Server provider, and includes support for Microsoft Entra ID authentication methods.

Because `System.Data.SqlClient` is hardcoded as the provider in Azure App Service, you must extend `MicrosoftSqlDbConfiguration` to redirect `System.Data.SqlClient` references to `Microsoft.Data.SqlClient` instead. Update your code to add the Microsoft Entra ID access token to the connection object. The steps to follow differ depending on whether you have an ASP.NET Core or ASP.NET app.

> [!NOTE]
> This code change doesn't work locally. For more information, see [Debug locally when you use App Service authentication](#debug-locally-when-you-use-app-service-authentication).

# [ASP.NET Core](#tab/efcore)

An ASP.NET Core app uses [Entity Framework Core](/ef/core/) by default.

1. In Visual Studio, from the **Tools** menu, select **NuGet Package Manager** > **Package Manager Console**.

1. In the **Package Manager Console**, add the NuGet package [Microsoft.Data.SqlClient](https://www.nuget.org/packages/Microsoft.Data.SqlClient).

   ```powershell
   Install-Package Microsoft.Data.SqlClient
   ```

1. In your `DbContext` object in *DatabaseContext.cs* or other file that configures the database context, change the default constructor to add the Microsoft Entra ID access token to the connection object.

   ```csharp
   public MyDatabaseContext (DbContextOptions<MyDatabaseContext> options, IHttpContextAccessor accessor)
       : base(options)
   {
       var conn = Database.GetDbConnection() as SqlConnection;
       conn.AccessToken = accessor.HttpContext.Request.Headers["X-MS-TOKEN-AAD-ACCESS-TOKEN"];
   }
   ```

1. In *appsettings.json*, replace the value of the connection string with the following code to remove the SQL Authentication connection secrets from your connection string. Replace `<server-name` and `<database-name>` with your server name and database name.

   ```json
   "Server=tcp:<server-name>.database.windows.net;Authentication=Active Directory Default; Database=<database-name>;"
   ```

# [ASP.NET](#tab/ef)

An ASP.NET app uses [Entity Framework](/ef/ef6/) by default. For more information, see [Microsoft.EntityFramework.SqlServer](https://www.nuget.org/packages/Microsoft.EntityFramework.SqlServer).

1. In Visual Studio, from the **Tools** menu, select **NuGet Package Manager** > **Package Manager Console**.

1. In the **Package Manager Console**, install and update the following packages:

   ```powershell
   Install-Package Microsoft.Data.SqlClient
   Install-Package Microsoft.EntityFramework.SqlServer
   Update-Package EntityFramework
   ```

1. In *DatabaseContext.cs* or other file that configures the database context:

   - Add the following class:

     ```csharp
         public class AppServiceConfiguration : MicrosoftSqlDbConfiguration
         {
             public AppServiceConfiguration()
             {
                 SetProviderFactory("System.Data.SqlClient", Microsoft.Data.SqlClient.SqlClientFactory.Instance);
                 SetProviderServices("System.Data.SqlClient", MicrosoftSqlProviderServices.Instance);
                 SetExecutionStrategy("System.Data.SqlClient", () => new MicrosoftSqlAzureExecutionStrategy());
             }
         }
     ```

   - Add the following attribute to the `DatabaseContext` class declaration:

     ```csharp
     [DbConfigurationType(typeof(AppServiceConfiguration))]
     ```

   - Add the following code to the default constructor in your `DbContext` object.

     ```csharp
     var conn = (System.Data.SqlClient.SqlConnection)Database.Connection;
     conn.AccessToken = System.Web.HttpContext.Current.Request.Headers["X-MS-TOKEN-AAD-ACCESS-TOKEN"];
     ```

1. In your *web.config* file

   - To remove the SQL Authentication connection secrets, replace the value of the connection string with the following code. Use your server name and database name for `<server-name` and `<database-name>`.

     ```json
     "Server=tcp:<server-name>.database.windows.net;Authentication=Active Directory Default; Database=<database-name>;"
     ```

   1. Remove the `entityFramework/providers/provider` section and line: `<provider invariantName="System.Data.SqlClient" .../>`.

-----

## 6. Publish your changes

If you used Visual Studio Code to edit your code in your GitHub fork, select **Source Control** from the left menu, enter a commit message, and select **Commit**. The commit triggers a GitHub Actions deployment to App Service. Wait a few minutes for the deployment to finish.

You can also publish your changes in Git Bash by using the following commands:

```bash
git commit -am "configure managed identity"
git push azure main
```

If your code is in Visual Studio:

1. Right-click your **DotNetAppSqlDb** project in **Solution Explorer** and select **Publish**.

   :::image type="content" source="./media/app-service-web-tutorial-dotnet-sqldatabase/solution-explorer-publish.png" alt-text="Screenshot showing how to publish from the Solution Explorer in Visual Studio." lightbox="./media/app-service-web-tutorial-dotnet-sqldatabase/solution-explorer-publish.png":::

1. On the **Publish** page, select **Publish**. 

When the new app page shows your app, the app is connecting to the Azure SQL database on behalf of the signed-in Microsoft Entra user. You should be able to use and edit your app as usual.

![Screenshot that shows the web app after publishing.](./media/app-service-web-tutorial-dotnet-sqldatabase/this-one-is-done.png)

## 7. Clean up resources

In the preceding steps, you created Azure resources in a resource group. If you no longer need these resources, delete the resource group by running the following command:

```azurecli
az group delete --name <group-name>
```

This command may take some time to run.

## Troubleshooting

If you get a `Login failed for user '<token-identified principal>'` error, the most common causes are:

- Microsoft Entra authentication not configured for the Azure SQL database. See [Configure database server with Microsoft Entra authentication](#1-configure-database-server-with-azure-ad-authentication).
- No valid token in the `X-MS-TOKEN-AAD-ACCESS-TOKEN` request header. This code doesn't work in local environments. For more information and alternatives, see [Debug locally when you use App Service authentication](#debug-locally-when-you-use-app-service-authentication).
- User doesn't have permission to connect to the database. See [Add other Microsoft Entra users or groups to Azure SQL Database](#add-other-microsoft-entra-users-or-groups-to-azure-sql-database).

### Debug locally when you use App Service authentication

Because App Service authentication is an Azure feature, the code in this tutorial doesn't work in your local environment. Unlike an app running in Azure, your local code doesn't benefit from the App Service authentication middleware. You can use the following alternatives for local debugging:

- Connect to SQL Database from your local environment with [`Active Directory Interactive`](/sql/connect/ado-net/sql/azure-active-directory-authentication#using-interactive-authentication). This authentication flow doesn't sign in the user itself, but connects to the back-end database with the signed-in user so you can test database authorization locally.
- Manually copy the access token into your code in place of the `X-MS-TOKEN-AAD-ACCESS-TOKEN` request header.
- If you deploy from Visual Studio, use remote debugging of your App Service app.

### Add other Microsoft Entra users or groups to Azure SQL Database

Connect to your database server using [sqlcmd](/azure/azure-sql/database/authentication-microsoft-entra-connect-to-azure-sql#sqlcmd) or [SQL Server Management Studio (SSMS)](/azure/azure-sql/database/authentication-microsoft-entra-connect-to-azure-sql#connect-with-ssms-or-ssdt), and create [contained database users](/azure/azure-sql/database/authentication-aad-configure#contained-database-users) mapped to Microsoft Entra identities.

The following Transact-SQL example adds a Microsoft Entra identity to SQL Server and gives the identity some database roles:

```sql
CREATE USER [<user-or-group-name>] FROM EXTERNAL PROVIDER;
ALTER ROLE db_datareader ADD MEMBER [<user-or-group-name>];
ALTER ROLE db_datawriter ADD MEMBER [<user-or-group-name>];
ALTER ROLE db_ddladmin ADD MEMBER [<user-or-group-name>];
GO
```
## Related content

- [Tutorial: Connect to Azure databases from App Service without secrets using a managed identity](tutorial-connect-msi-azure-database.md)
- [Tutorial: Access Microsoft Graph from a secured .NET app as the app](scenario-secure-app-access-microsoft-graph-as-app.md)
- [Tutorial: Isolate back-end communication with Virtual Network integration](tutorial-networking-isolate-vnet.md)
- [Map an existing custom DNS name to Azure App Service](app-service-web-tutorial-custom-domain.md)
