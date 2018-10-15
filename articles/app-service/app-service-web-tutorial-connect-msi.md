---
title: Secure Azure SQL Database connection from App Service using a managed identity | Microsoft Docs 
description: Learn how to make database connectivity more secure by using a managed identity, and also how to apply this to other Azure services.
services: app-service\web
documentationcenter: dotnet
author: cephalin
manager: syntaxc4
editor: ''

ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: tutorial
ms.date: 10/24/2018
ms.author: cephalin
ms.custom: mvc
---
# Tutorial: Secure Azure SQL Database connection from App Service using a managed identity

[App Service](app-service-web-overview.md) provides a highly scalable, self-patching web hosting service in Azure. It also provides a [managed identity](app-service-managed-service-identity.md) for your app, which is a turn-key solution for securing access to [Azure SQL Database](/azure/sql-database/) and other Azure services. Managed identities in App Service make your app more secure by eliminating secrets from your app, such as credentials in the connection strings. In this tutorial, you will add managed identity to the sample ASP.NET web app you built in [Tutorial: Build an ASP.NET app in Azure with SQL Database](app-service-web-tutorial-dotnet-sqldatabase.md). When you're finished, your sample app will connect to SQL Database securely without the need of username and passwords.

What you learn how to:

> [!div class="checklist"]
> * Enable managed identities
> * Grant SQL Database access to the managed identity
> * Configure application code to authenticate with SQL Database using Azure Active Directory authentication
> * Grant minimal privileges to the managed identity in SQL Database

> [!NOTE]
> Azure Active Directory authentication is _different_ from [Integrated Windows authentication](/previous-versions/windows/it-pro/windows-server-2003/cc758557(v=ws.10)) in on-premises Active Directory (AD DS). AD DS and Azure Active Directory use completely different authentication protocols. For more information, see [The difference between Windows Server AD DS and Azure AD](../active-directory/fundamentals/understand-azure-identity-solutions.md#the-difference-between-windows-server-ad-ds-and-azure-ad).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

This article continues where you left off in [Tutorial: Build an ASP.NET app in Azure with SQL Database](app-service-web-tutorial-dotnet-sqldatabase.md). If you haven't already, follow that tutorial first. Alternatively, you can adapt the steps for your own ASP.NET app with SQL Database.

<!-- ![app running in App Service](./media/app-service-web-tutorial-dotnetcore-sqldb/azure-app-in-browser.png) -->

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Enable managed identities

To enable a managed identity for your Azure app, use the [az webapp identity assign](/cli/azure/webapp/identity?view=azure-cli-latest#az-webapp-identity-assign) command in the Cloud Shell. In the following command, replace *\<app name>*.

```azurecli-interactive
az webapp identity assign --resource-group myResourceGroup --name <app name>
```

Here's an example of the output after the identity is created in Azure Active Directory:

```json
{
  "additionalProperties": {},
  "principalId": "21dfa71c-9e6f-4d17-9e90-1d28801c9735",
  "tenantId": "72f988bf-86f1-41af-91ab-2d7cd011db47",
  "type": "SystemAssigned"
}
```

You'll use the value of `principalId` in the next step. If you want to see the details of the new identity in Azure Active Directory, run the following optional command with the value of `principalId`:

```azurecli-interactive
az ad sp show --id <principalid>
```

## Grant database access to identity

Next, you grant database access to your app's managed identity, using the [`az sql server ad-admin create`](/cli/azure/sql/server/ad-admin?view=azure-cli-latest#az-sql-server-ad-admin_create) command in the Cloud Shell. In the following command, replace *\<server_name>* and <principalid_from_last_step>. Type an administrator name for *\<admin_user>*.

```azurecli-interactive
az sql server ad-admin create --resource-group myResourceGroup --server-name <server_name> --display-name <admin_user> --object-id <principalid_from_last_step>
```

The managed identity now has access to your Azure SQL Database server.

## Modify connection string

Modify the connection you set previously for your app, using the [`az webapp config appsettings set`](/cli/azure/webapp/config/appsettings?view=azure-cli-latest#az-webapp-config-appsettings-set) command in the Cloud Shell. In the following command, replace *\<app name>* with the name of your app, and replace *\<server_name>* and *\<db_name>* with the ones for your SQL Database.

```azurecli-interactive
az webapp config connection-string set --resource-group myResourceGroup --name <app name> --settings MyDbConnection='Server=tcp:<server_name>.database.windows.net,1433;Database=<db_name>;' --connection-string-type SQLAzure
```

## Modify ASP.NET code

In your **DotNetAppSqlDb** project in Visual Studio, open _packages.config_ and add the following line in the list of packages.

```xml
<package id="Microsoft.Azure.Services.AppAuthentication" version="1.1.0-preview" targetFramework="net461" />
<package id="Microsoft.IdentityModel.Clients.ActiveDirectory" version="3.14.2" targetFramework="net461" />
```

Open _Models\MyDatabaseContext.cs_ and add the following `using` statements to the top of the file:

```csharp
using System.Data.SqlClient;
using Microsoft.Azure.Services.AppAuthentication;
using System.Web.Configuration;
```

In the `MyDatabaseContext` class, add the following constructor:

```csharp
public MyDatabaseContext(SqlConnection conn) : base(conn, true)
{
    conn.ConnectionString = WebConfigurationManager.ConnectionStrings["MyDbConnection"].ConnectionString;
    // DataSource != LocalDB means app is running in Azure with the SQLDB connection string you configured
    if(conn.DataSource != "(localdb)\\MSSQLLocalDB")
        conn.AccessToken = (new AzureServiceTokenProvider()).GetAccessTokenAsync("https://database.windows.net/").Result;

    Database.SetInitializer<MyDatabaseContext>(null);
}
```

This constructor configures a custom SqlConnection object to use an access token for Azure SQL Database from App Service. With the access token, your App Service app authenticates with Azure SQL Database with its managed identity. For more information, see [Obtaining tokens for Azure resources](app-service-managed-service-identity.md#obtaining-tokens-for-azure-resources). The `if` statement lets you continue to test your app locally with LocalDB.

> [!NOTE]
> `SqlConnection.AccessToken` is currently supported only in .NET Framework 4.6 and above, not in [.NET Core](https://www.microsoft.com/net/learn/get-started/windows).
>

To use this new constructor, open `Controllers\TodosController.cs` and find the line `private MyDatabaseContext db = new MyDatabaseContext();`. The existing code uses the default `MyDatabaseContext` controller to create a database using the standard connection string, which had username and password in clear text before [you changed it](#modify-connection-string).

Replace the entire line with the following code:

```csharp
private MyDatabaseContext db = new MyDatabaseContext(new System.Data.SqlClient.SqlConnection());
```

### Publish your changes

All that's left now is to publish your changes to Azure.

In the **Solution Explorer**, right-click your **DotNetAppSqlDb** project and select **Publish**.

![Publish from Solution Explorer](./media/app-service-web-tutorial-dotnet-sqldatabase/solution-explorer-publish.png)

In the publish page, click **Publish**. When the new webpage shows your to-do list, your app is connecting to the database using the managed identity.

![Azure web app after Code First Migration](./media/app-service-web-tutorial-dotnet-sqldatabase/this-one-is-done.png)

You should now be able to edit the to-do list as before.

[!INCLUDE [cli-samples-clean-up](../../includes/cli-samples-clean-up.md)]

## Grant minimal privileges to identity

During the earlier steps, you probably noticed your managed identity is connected to SQL Server as the Azure AD administrator. To grant minimal privileges to your managed identity, you need to sign in to the Azure SQL Database server as the Azure AD administrator, and then add an Azure Active Directory group that contains the managed identity. 

### Add managed identity to an Azure Active Directory group

In the Cloud Shell, add the managed identity for your app into a new Azure Active Directory group called _myAzureSQLDBAccessGroup_, shown in the following script:

```azurecli-interactive
groupid=$(az ad group create --display-name myAzureSQLDBAccessGroup --mail-nickname myAzureSQLDBAccessGroup --query objectId --output tsv)
msiobjectid=$(az webapp identity show --resource-group <group_name> --name <app_name> --query principalId --output tsv)
az ad group member add --group $groupid --member-id $msiobjectid
az ad group member list -g $groupid
```

If you want to see the full JSON output for each command, drop the parameters `--query objectId --output tsv`.

### Reconfigure Azure AD administrator

Previously, you assigned the managed identity as the Azure AD administrator for your SQL Database. You can't use this identity for interactive sign-in (to add database users), so you need to use your real Azure AD user. To add your Azure AD user, follow the steps at [Provision an Azure Active Directory administrator for your Azure SQL Database Server](../sql-database/sql-database-aad-authentication-configure.md#provision-an-azure-active-directory-administrator-for-your-azure-sql-database-server). 

### Grant permissions to Azure Active Directory group

In the Cloud Shell, sign in to SQL Database by using the SQLCMD command. Replace _\<server\_name>_ with your SQL Database server name, _\<db\_name>_ with the database name your app uses, and _\<AADuser\_name>_ and _\<AADpassword>_ with your Azure AD user's credentials.

```azurecli-interactive
sqlcmd -S <server_name>.database.windows.net -d <db_name> -U <AADuser_name> -P "<AADpassword>" -G -l 30
```

In the SQL prompt for the database you want, run the following commands to add the Azure Active Directory group you created earlier and grant the permissions your app needs. For example, 

```sql
CREATE USER [myAzureSQLDBAccessGroup] FROM EXTERNAL PROVIDER;
ALTER ROLE db_datareader ADD MEMBER [myAzureSQLDBAccessGroup];
ALTER ROLE db_datawriter ADD MEMBER [myAzureSQLDBAccessGroup];
ALTER ROLE db_ddladmin ADD MEMBER [myAzureSQLDBAccessGroup];
GO
```

Type `EXIT` to return to the Cloud Shell prompt. 

## Next steps

What you learned:

> [!div class="checklist"]
> * Enable managed identities
> * Grant SQL Database access to the managed identity
> * Configure application code to authenticate with SQL Database using Azure Active Directory authentication
> * Grant minimal privileges to the managed identity in SQL Database

Advance to the next tutorial to learn how to map a custom DNS name to your web app.

> [!div class="nextstepaction"]
> [Map an existing custom DNS name to Azure Web Apps](app-service-web-tutorial-custom-domain.md)
