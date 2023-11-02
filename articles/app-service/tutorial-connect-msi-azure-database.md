---
title: 'Tutorial: Access Azure databases with managed identity'
description: Secure database connectivity (Azure SQL Database, Database for MySQL, and Database for PostgreSQL) with managed identity from .NET, Node.js, Python, and Java apps.
keywords: azure app service, web app, security, msi, managed service identity, managed identity, .net, dotnet, asp.net, c#, csharp, node.js, node, python, java, visual studio, visual studio code, visual studio for mac, azure cli, azure powershell, defaultazurecredential
author: cephalin
ms.author: cephalin

ms.devlang: csharp,java,javascript,python
ms.topic: tutorial
ms.date: 04/12/2022
ms.custom: mvc, devx-track-azurecli, ignite-2022, devx-track-dotnet, devx-track-extended-java, devx-track-python, AppServiceConnectivity, service-connector
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



[!INCLUDE [passwordless-tutorial-snippet-webapp](../service-connector/includes/passwordless-tutorial-snippet-webapp.md)]



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
