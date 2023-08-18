---
title: 'Tutorial - Web app accesses SQL Database as the user'
description: Secure database connectivity with Azure Active Directory authentication from .NET web app, using the signed-in user. Learn how to apply it to other Azure services.
author: cephalin

ms.service: app-service
ms.workload: identity
ms.author: cephalin
ms.devlang: csharp
ms.custom: devx-track-azurecli, devx-track-dotnet, AppServiceConnectivity
ms.topic: tutorial
ms.date: 04/21/2023
---
# Tutorial: Connect an App Service app to SQL Database on behalf of the signed-in user

This tutorial shows you how to enable [built-in authentication](overview-authentication-authorization.md) in an [App Service](overview.md) app using the Azure Active Directory authentication provider, then extend it by connecting it to a back-end Azure SQL Database by impersonating the signed-in user (also known as the [on-behalf-of flow](../active-directory/develop/v2-oauth2-on-behalf-of-flow.md)). This is a more advanced connectivity approach to [Tutorial: Access data with managed identity](tutorial-connect-msi-sql-database.md) and has the following advantages in enterprise scenarios:

- Eliminates connection secrets to back-end services, just like the managed identity approach.
- Gives the back-end database (or any other Azure service) more control over who or how much to grant access to its data and functionality.
- Lets the app tailor its data presentation to the signed-in user.

In this tutorial, you add Azure Active Directory authentication to the sample web app you deployed in one of the following tutorials: 

- [Tutorial: Build an ASP.NET app in Azure with Azure SQL Database](app-service-web-tutorial-dotnet-sqldatabase.md)
- [Tutorial: Build an ASP.NET Core and Azure SQL Database app in Azure App Service](tutorial-dotnetcore-sqldb-app.md)

When you're finished, your sample app will authenticate users connect to SQL Database securely on behalf of the signed-in user.

:::image type="content" source="./media/tutorial-connect-app-access-sql-database-as-user-dotnet/architecture.png" alt-text="Architecture diagram for tutorial scenario.":::

> [!NOTE]
> The steps covered in this tutorial support the following versions:
> 
> - .NET Framework 4.8 and higher
> - .NET 6.0 and higher
>

What you will learn:

> [!div class="checklist"]
> * Enable built-in authentication for Azure SQL Database
> * Disable other authentication options in Azure SQL Database
> * Enable App Service authentication
> * Use Azure Active Directory as the identity provider
> * Access Azure SQL Database on behalf of the signed-in Azure AD user

> [!NOTE]
>Azure AD authentication is _different_ from [Integrated Windows authentication](/previous-versions/windows/it-pro/windows-server-2003/cc758557(v=ws.10)) in on-premises Active Directory (AD DS). AD DS and Azure AD use completely different authentication protocols. For more information, see [Azure AD Domain Services documentation](../active-directory-domain-services/index.yml).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

This article continues where you left off in either one of the following tutorials:

- [Tutorial: Build an ASP.NET app in Azure with SQL Database](app-service-web-tutorial-dotnet-sqldatabase.md)
- [Tutorial: Build an ASP.NET Core and SQL Database app in Azure App Service](tutorial-dotnetcore-sqldb-app.md).

If you haven't already, follow one of the two tutorials first. Alternatively, you can adapt the steps for your own .NET app with SQL Database.

Prepare your environment for the Azure CLI.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](../../includes/cloud-shell-try-it-no-header.md)]

## 1. Configure database server with Azure AD authentication

First, enable Azure Active Directory authentication to SQL Database by assigning an Azure AD user as the admin of the server. This user is different from the Microsoft account you used to sign up for your Azure subscription. It must be a user that you created, imported, synced, or invited into Azure AD. For more information on allowed Azure AD users, see [Azure AD features and limitations in SQL Database](/azure/azure-sql/database/authentication-aad-overview#azure-ad-features-and-limitations).

1. If your Azure AD tenant doesn't have a user yet, create one by following the steps at [Add or delete users using Azure Active Directory](../active-directory/fundamentals/add-users-azure-active-directory.md).

1. Find the object ID of the Azure AD user using the [`az ad user list`](/cli/azure/ad/user#az_ad_user_list) and replace *\<user-principal-name>*. The result is saved to a variable.

    ```azurecli-interactive
    azureaduser=$(az ad user list --filter "userPrincipalName eq '<user-principal-name>'" --query [].id --output tsv)
    ```

    > [!TIP]
    > To see the list of all user principal names in Azure AD, run `az ad user list --query [].userPrincipalName`.
    >

1. Add this Azure AD user as an Active Directory admin using [`az sql server ad-admin create`](/cli/azure/sql/server/ad-admin#az_sql_server_ad_admin_create) command in the Cloud Shell. In the following command, replace *\<server-name>* with the server name (without the `.database.windows.net` suffix).

    ```azurecli-interactive
    az sql server ad-admin create --resource-group <group-name> --server-name <server-name> --display-name ADMIN --object-id $azureaduser
    ```

1. Restrict the database server authentication to Active Directory authentication. This step effectively disables SQL authentication.

    ```azurecli-interactive
    az sql server ad-only-auth enable --resource-group <group-name> --server-name <server-name>
    ```

For more information on adding an Active Directory admin, see [Provision Azure AD admin (SQL Database)](/azure/azure-sql/database/authentication-aad-configure#provision-azure-ad-admin-sql-database).

## 2. Enable user authentication for your app

You enable authentication with Azure Active Directory as the identity provider. For more information, see [Configure Azure Active Directory authentication for your App Services application](configure-authentication-provider-aad.md).

1. In the [Azure portal](https://portal.azure.com) menu, select **Resource groups** or search for and select *Resource groups* from any page.

1. In **Resource groups**, find and select your resource group, then select your app.

1. In your app's left menu, select **Authentication**, and then select **Add identity provider**.

1. In the **Add an identity provider** page, select **Microsoft** as the **Identity provider** to sign in Microsoft and Azure AD identities.

1. Accept the default settings and select **Add**.

    :::image type="content" source="./media/tutorial-connect-app-access-sql-database-as-user-dotnet/add-azure-ad-provider.png" alt-text="Screenshot showing the add identity provider page." lightbox="./media/tutorial-connect-app-access-sql-database-as-user-dotnet/add-azure-ad-provider.png":::

> [!TIP]
> If you run into errors and reconfigure your app's authentication settings, the tokens in the token store may not be regenerated from the new settings. To make sure your tokens are regenerated, you need to sign out and sign back in to your app. An easy way to do it is to use your browser in private mode, and close and reopen the browser in private mode after changing the settings in your apps.

## 3. Configure user impersonation to SQL Database

Currently, your Azure app connects to SQL Database uses SQL authentication (username and password) managed as app settings. In this step, you give the app permissions to access SQL Database on behalf of the signed-in Azure AD user.

1. In the **Authentication** page for the app, select your app name under **Identity provider**. This app registration was automatically generated for you. Select **API permissions** in the left menu.

1. Select **Add a permission**, then select **APIs my organization uses**.

1. Type *Azure SQL Database* in the search box and select the result.

1. In the **Request API permissions** page for Azure SQL Database, select **Delegated permissions** and **user_impersonation**, then select **Add permissions**.

    :::image type="content" source="./media/tutorial-connect-app-access-sql-database-as-user-dotnet/select-permission.png" alt-text="Screenshot of the Request API permissions page showing Delegated permissions, user_impersonation, and the Add permission button selected." lightbox="./media/tutorial-connect-app-access-sql-database-as-user-dotnet/select-permission.png":::

## 4. Configure App Service to return a usable access token

The app registration in Azure Active Directory now has the required permissions to connect to SQL Database by impersonating the signed-in user. Next, you configure your App Service app to give you a usable access token.

In the Cloud Shell, run the following commands on the app to add the `scope` parameter to the authentication setting `identityProviders.azureActiveDirectory.login.loginParameters`.

```azurecli-interactive
authSettings=$(az webapp auth show --resource-group <group-name> --name <app-name>)
authSettings=$(echo "$authSettings" | jq '.properties' | jq '.identityProviders.azureActiveDirectory.login += {"loginParameters":["scope=openid profile email offline_access https://database.windows.net/user_impersonation"]}')
az webapp auth set --resource-group <group-name> --name <app-name> --body "$authSettings"
```

The commands effectively add a `loginParameters` property with extra custom scopes. Here's an explanation of the requested scopes:

- `openid`, `profile`, and `email` are requested by App Service by default already. For information, see [OpenID Connect Scopes](../active-directory/develop/v2-permissions-and-consent.md#openid-connect-scopes).
- `https://database.windows.net/user_impersonation` refers to Azure SQL Database. It's the scope that gives you a JWT token that includes SQL Database as a [token audience](https://wikipedia.org/wiki/JSON_Web_Token).
- [offline_access](../active-directory/develop/v2-permissions-and-consent.md#offline_access) is included here for convenience (in case you want to [refresh tokens](#what-happens-when-access-tokens-expire)).

> [!TIP]
> To configure the required scopes using a web interface instead, see the Microsoft steps at [Refresh auth tokens](configure-authentication-oauth-tokens.md#refresh-auth-tokens).

Your apps are now configured. The app can now generate a token that SQL Database accepts.

## 5. Use the access token in your application code

The steps you follow for your project depends on whether you're using [Entity Framework](/ef/ef6/) (default for ASP.NET) or [Entity Framework Core](/ef/core/) (default for ASP.NET Core).

# [Entity Framework](#tab/ef)

1. In Visual Studio, open the Package Manager Console and update Entity Framework:

    ```powershell
    Update-Package EntityFramework
    ```

1. In your DbContext object (in *Models/MyDbContext.cs*), add the following code to the default constructor.

    ```csharp
    var conn = (System.Data.SqlClient.SqlConnection)Database.Connection;
    conn.AccessToken = System.Web.HttpContext.Current.Request.Headers["X-MS-TOKEN-AAD-ACCESS-TOKEN"];
    ```

# [Entity Framework Core](#tab/efcore)

In your `DbContext` object (in *Models/MyDbContext.cs*), change the default constructor to the following.

```csharp
public MyDatabaseContext (DbContextOptions<MyDatabaseContext> options, IHttpContextAccessor accessor)
    : base(options)
{
    var conn = Database.GetDbConnection() as SqlConnection;
    conn.AccessToken = accessor.HttpContext.Request.Headers["X-MS-TOKEN-AAD-ACCESS-TOKEN"];
}
```

-----

> [!NOTE]
> The code adds the access token supplied by App Service authentication to the connection object.
> 
> This code change doesn't work locally. For more information, see [How do I debug locally when using App Service authentication?](#how-do-i-debug-locally-when-using-app-service-authentication).

## 6. Publish your changes

# [ASP.NET](#tab/dotnet)

1. **If you came from [Tutorial: Build an ASP.NET app in Azure with SQL Database](app-service-web-tutorial-dotnet-sqldatabase.md)**, you set a connection string in App Service using SQL authentication, with a username and password. Use the following command to remove the connection secrets, but replace *\<group-name>*, *\<app-name>*, *\<db-server-name>*, and *\<db-name>* with yours.

    ```azurecli-interactive
    az webapp config connection-string set --resource-group <group-name> --name <app-name> --type SQLAzure --settings MyDbConnection="server=tcp:<db-server-name>.database.windows.net;database=<db-name>;"
    ```

1. Publish your changes in Visual Studio. In the **Solution Explorer**, right-click your **DotNetAppSqlDb** project and select **Publish**.

    :::image type="content" source="./media/app-service-web-tutorial-dotnet-sqldatabase/solution-explorer-publish.png" alt-text="Screenshot showing how to publish from the Solution Explorer in Visual Studio." lightbox="./media/app-service-web-tutorial-dotnet-sqldatabase/solution-explorer-publish.png":::

1. In the publish page, select **Publish**. 

# [ASP.NET Core](#tab/dotnetcore)

1. **If you came from [Tutorial: Build an ASP.NET Core and SQL Database app in Azure App Service](tutorial-dotnetcore-sqldb-app.md)**, you have a connection string called `defaultConnection` in App Service using SQL authentication, with a username and password. Use the following command to remove the connection secrets, but replace *\<group-name>*, *\<app-name>*, *\<db-server-name>*, and *\<db-name>* with yours.

    ```azurecli-interactive
    az webapp config connection-string set --resource-group <group-name> --name <app-name> --type SQLAzure --settings defaultConnection="server=tcp:<db-server-name>.database.windows.net;database=<db-name>;"
    ```

1. You would have made your code changes in your GitHub fork, with Visual Studio Code in the browser. From the left menu, select **Source Control**.

1. Type in a commit message like `OBO connect` and select **Commit**.

    The commit triggers a GitHub Actions deployment to App Service. Wait a few minutes for the deployment to finish.

-----

When the new webpage shows your to-do list, your app is connecting to the database on behalf of the signed-in Azure AD user.

![Azure app after Code First Migration](./media/app-service-web-tutorial-dotnet-sqldatabase/this-one-is-done.png)

You should now be able to edit the to-do list as before.

## 7. Clean up resources

In the preceding steps, you created Azure resources in a resource group. If you don't expect to need these resources in the future, delete the resource group by running the following command in the Cloud Shell:

```azurecli-interactive
az group delete --name <group-name>
```

This command may take a minute to run.

## Frequently asked questions

- [Why do I get a `Login failed for user '<token-identified principal>'.` error?](#why-do-i-get-a-login-failed-for-user-token-identified-principal-error)
- [How do I add other Azure AD users or groups in Azure SQL Database?](#how-do-i-add-other-azure-ad-users-or-groups-in-azure-sql-database)
- [How do I debug locally when using App Service authentication?](#how-do-i-debug-locally-when-using-app-service-authentication)
- [What happens when access tokens expire?](#what-happens-when-access-tokens-expire)

#### Why do I get a `Login failed for user '<token-identified principal>'.` error?

The most common causes of this error are:

- You're running the code locally, and there's no valid token in the `X-MS-TOKEN-AAD-ACCESS-TOKEN` request header. See [How do I debug locally when using App Service authentication?](#how-do-i-debug-locally-when-using-app-service-authentication).
- Azure AD authentication isn't configured on your SQL Database.
- The signed-in user isn't permitted to connect to the database. See [How do I add other Azure AD users or groups in Azure SQL Database?](#how-do-i-add-other-azure-ad-users-or-groups-in-azure-sql-database).

#### How do I add other Azure AD users or groups in Azure SQL Database?

1. Connect to your database server, such as with [sqlcmd](/azure/azure-sql/database/authentication-aad-configure#sqlcmd) or [SSMS](/azure/azure-sql/database/authentication-aad-configure#connect-to-the-database-using-ssms-or-ssdt).
1. [Create contained users mapped to Azure AD identities](/azure/azure-sql/database/authentication-aad-configure#create-contained-users-mapped-to-azure-ad-identities) in SQL Database documentation.

    The following Transact-SQL example adds an Azure AD identity to SQL Server and gives it some database roles:

    ```sql
    CREATE USER [<user-or-group-name>] FROM EXTERNAL PROVIDER;
    ALTER ROLE db_datareader ADD MEMBER [<user-or-group-name>];
    ALTER ROLE db_datawriter ADD MEMBER [<user-or-group-name>];
    ALTER ROLE db_ddladmin ADD MEMBER [<user-or-group-name>];
    GO
    ```

#### How do I debug locally when using App Service authentication?

Because App Service authentication is a feature in Azure, it's not possible for the same code to work in your local environment. Unlike the app running in Azure, your local code doesn't benefit from the authentication middleware from App Service. You have a few alternatives:

- Connect to SQL Database from your local environment with [`Active Directory Interactive`](/sql/connect/ado-net/sql/azure-active-directory-authentication#using-active-directory-interactive-authentication). The authentication flow doesn't sign in the user to the app itself, but it does connect to the back-end database with the signed-in user, and allows you to test database authorization locally.
- Manually copy the access token from `https://<app-name>.azurewebsites.net/.auth/me` into your code, in place of the `X-MS-TOKEN-AAD-ACCESS-TOKEN` request header.
- If you deploy from Visual Studio, use remote debugging of your App Service app.

#### What happens when access tokens expire?

Your access token expires after some time. For information on how to refresh your access tokens without requiring users to reauthenticate with your app, see [Refresh identity provider tokens](configure-authentication-oauth-tokens.md#refresh-auth-tokens).

## Next steps

What you learned:

> [!div class="checklist"]
> * Enable built-in authentication for Azure SQL Database
> * Disable other authentication options in Azure SQL Database
> * Enable App Service authentication
> * Use Azure Active Directory as the identity provider
> * Access Azure SQL Database on behalf of the signed-in Azure AD user

> [!div class="nextstepaction"]
> [Map an existing custom DNS name to Azure App Service](app-service-web-tutorial-custom-domain.md)

> [!div class="nextstepaction"]
> [Tutorial: Access Microsoft Graph from a secured .NET app as the app](scenario-secure-app-access-microsoft-graph-as-app.md)

> [!div class="nextstepaction"]
> [Tutorial: Isolate back-end communication with Virtual Network integration](tutorial-networking-isolate-vnet.md)
