---
title: Secure SQL Database connection with managed identity - Azure App Service | Microsoft Docs 
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
ms.date: 06/21/2019
ms.author: cephalin
ms.custom: mvc
---
# Tutorial: Secure Azure SQL Database connection from App Service using a managed identity

[App Service](overview.md) provides a highly scalable, self-patching web hosting service in Azure. It also provides a [managed identity](overview-managed-identity.md) for your app, which is a turn-key solution for securing access to [Azure SQL Database](/azure/sql-database/) and other Azure services. Managed identities in App Service make your app more secure by eliminating secrets from your app, such as credentials in the connection strings. In this tutorial, you will add managed identity to the sample ASP.NET web app you built in [Tutorial: Build an ASP.NET app in Azure with SQL Database](app-service-web-tutorial-dotnet-sqldatabase.md). When you're finished, your sample app will connect to SQL Database securely without the need of username and passwords.

> [!NOTE]
> This scenario is currently supported by .NET Framework 4.7.2 and above. [.NET Core 2.2](https://www.microsoft.com/net/download/dotnet-core/2.2) does support the scenario, but is not yet included in the default images in App Service. 
>

What you learn how to:

> [!div class="checklist"]
> * Enable managed identities
> * Grant SQL Database access to the managed identity
> * Configure Entity Framework to use Azure AD authentication with SQL Database
> * Connect to SQL Database from Visual Studio using Azure AD authentication

> [!NOTE]
>Azure AD authentication is _different_ from [Integrated Windows authentication](/previous-versions/windows/it-pro/windows-server-2003/cc758557(v=ws.10)) in on-premises Active Directory (AD DS). AD DS and Azure AD use completely different authentication protocols. For more information, see [Azure AD Domain Services documentation](https://docs.microsoft.com/azure/active-directory-domain-services/).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

This article continues where you left off in [Tutorial: Build an ASP.NET app in Azure with SQL Database](app-service-web-tutorial-dotnet-sqldatabase.md). If you haven't already, follow that tutorial first. Alternatively, you can adapt the steps for your own ASP.NET app with SQL Database.

To debug your app using SQL Database as the back end, make sure that you've [allowed client connection from your computer](app-service-web-tutorial-dotnet-sqldatabase.md#allow-client-connection-from-your-computer).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Grant Azure AD user access to database

First enable Azure AD authentication to SQL Database by assigning an Azure AD user as the Active Directory admin of the SQL Database server. This user is different from the Microsoft account you used to sign up for your Azure subscription. It must be a user that you created, imported, synced, or invited into Azure AD. For more information on allowed Azure AD users, see [Azure AD features and limitations in SQL Database](../sql-database/sql-database-aad-authentication.md#azure-ad-features-and-limitations). 

Find the object ID of the Azure AD user using the [`az ad user list`](/cli/azure/ad/user?view=azure-cli-latest#az-ad-user-list) and replace *\<user-principal-name>*. The result is saved to a variable.

```azurecli-interactive
azureaduser=$(az ad user list --filter "userPrincipalName eq '<user-principal-name>'" --query [].objectId --output tsv)
```
> [!TIP]
> To see the list of all user principal names in Azure AD, run `az ad user list --query [].userPrincipalName`.
>

Add this Azure AD user as an Active Directory admin using [`az sql server ad-admin create`](/cli/azure/sql/server/ad-admin?view=azure-cli-latest#az-sql-server-ad-admin-create) command in the Cloud Shell. In the following command, replace *\<server-name>*.

```azurecli-interactive
az sql server ad-admin create --resource-group myResourceGroup --server-name <server-name> --display-name ADMIN --object-id $azureaduser
```

For more information on adding an Active Directory admin, see [Provision an Azure Active Directory administrator for your Azure SQL Database Server](../sql-database/sql-database-aad-authentication-configure.md#provision-an-azure-active-directory-administrator-for-your-azure-sql-database-server)

## Set up Visual Studio

To enable development and debugging in Visual Studio, add your Azure AD user in Visual Studio by selecting **File** > **Account Settings** from the menu, and click **Add an account**.

To set the Azure AD user for Azure service authentication, select **Tools** > **Options** from the menu, then select **Azure Service Authentication** > **Account Selection**. Select the Azure AD user you added and click **OK**.

You're now ready to develop and debug your app with the SQL Database as the back end, using Azure AD authentication.

## Modify ASP.NET project

In Visual Studio, open the Package Manager Console and add the NuGet package [Microsoft.Azure.Services.AppAuthentication](https://www.nuget.org/packages/Microsoft.Azure.Services.AppAuthentication):

```powershell
Install-Package Microsoft.Azure.Services.AppAuthentication -Version 1.2.0
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

Type `Ctrl+F5` to run the app again. The same CRUD app in your browser is now connecting to the Azure SQL Database directly, using Azure AD authentication. This setup lets you run database migrations. Later when you deploy your changes to App Service, the same settings work with the app's managed identity.

## Use managed identity connectivity

Next, you configure your App Service app to connect to SQL Database with a system-assigned managed identity.

### Enable managed identity on app

To enable a managed identity for your Azure app, use the [az webapp identity assign](/cli/azure/webapp/identity?view=azure-cli-latest#az-webapp-identity-assign) command in the Cloud Shell. In the following command, replace *\<app-name>*.

```azurecli-interactive
az webapp identity assign --resource-group myResourceGroup --name <app-name>
```

Here's an example of the output:

```json
{
  "additionalProperties": {},
  "principalId": "21dfa71c-9e6f-4d17-9e90-1d28801c9735",
  "tenantId": "72f988bf-86f1-41af-91ab-2d7cd011db47",
  "type": "SystemAssigned"
}
```

### Add managed identity to an Azure AD group

To grant this identity access to your SQL Database, you need to add it to an [Azure AD group](../active-directory/fundamentals/active-directory-manage-groups.md). In the Cloud Shell, add it to a new group called _myAzureSQLDBAccessGroup_, shown in the following script:

```azurecli-interactive
groupid=$(az ad group create --display-name myAzureSQLDBAccessGroup --mail-nickname myAzureSQLDBAccessGroup --query objectId --output tsv)
msiobjectid=$(az webapp identity show --resource-group myResourceGroup --name <app-name> --query principalId --output tsv)
az ad group member add --group $groupid --member-id $msiobjectid
az ad group member list -g $groupid
```

If you want to see the full JSON output for each command, drop the parameters `--query objectId --output tsv`.

### Grant permissions to Azure AD group

In the Cloud Shell, sign in to SQL Database by using the SQLCMD command. Replace _\<server-name>_ with your SQL Database server name, _\<db-name>_ with the database name your app uses, and _\<aad-user-name>_ and _\<aad-password>_ with your Azure AD user's credentials.

```azurecli-interactive
sqlcmd -S <server-name>.database.windows.net -d <db-name> -U <aad-user-name> -P "<aad-password>" -G -l 30
```

In the SQL prompt for the database you want, run the following commands to add the Azure AD group and grant the permissions your app needs. For example, 

```sql
CREATE USER [myAzureSQLDBAccessGroup] FROM EXTERNAL PROVIDER;
ALTER ROLE db_datareader ADD MEMBER [myAzureSQLDBAccessGroup];
ALTER ROLE db_datawriter ADD MEMBER [myAzureSQLDBAccessGroup];
ALTER ROLE db_ddladmin ADD MEMBER [myAzureSQLDBAccessGroup];
GO
```

Type `EXIT` to return to the Cloud Shell prompt.

### Modify connection string

Remember that the same changes you made in `Web.config` works with the managed identity, so the only thing to do is to remove the existing connection string in your app, which Visual Studio created deploying your app the first time. Use the following command, but replace *\<app-name>* with the name of your app.

```azurecli-interactive
az webapp config connection-string delete --resource-group myResourceGroup --name <app-name> --setting-names MyDbConnection
```

## Publish your changes

All that's left now is to publish your changes to Azure.

In the **Solution Explorer**, right-click your **DotNetAppSqlDb** project and select **Publish**.

![Publish from Solution Explorer](./media/app-service-web-tutorial-dotnet-sqldatabase/solution-explorer-publish.png)

In the publish page, click **Publish**. When the new webpage shows your to-do list, your app is connecting to the database using the managed identity.

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
