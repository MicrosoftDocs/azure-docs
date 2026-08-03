---
title: Connect a function app to Azure SQL with managed identity and SQL bindings
titleSuffix: Azure Functions
ms.service: azure-functions
description: Learn how to connect Azure SQL bindings through managed identity.
ms.topic: tutorial
ms.date: 07/22/2026
author: dzsquared
ms.author: drskwier
ms.reviewer: cachai
ms.custom: sfi-ropc-nochange
#Customer intent: As a function developer, I want to learn how to use managed identities so that I can avoid having to handle connection strings in my application settings.
---

# Tutorial: Connect a function app to Azure SQL with managed identity and SQL bindings

Azure Functions provides a [managed identity](../active-directory/managed-identities-azure-resources/overview.md), which is a turn-key solution for securing access to [Azure SQL Database](/azure/sql-database/) and other Azure services. Managed identities make your app more secure by eliminating secrets from your app, such as credentials in the connection strings. In this tutorial, you add a managed identity to a function app that uses [Azure SQL bindings](./functions-bindings-azure-sql.md).

This tutorial uses a user-assigned managed identity (UAMI), which is recommended because it can be shared across resources and is independent of the app lifecycle. For more information about identity-based connections in Azure Functions, see [Configure connections to remote services](manage-connections.md?pivots=functions-auth-identity).

When you finish this tutorial, your function app connects to Azure SQL Database without the need for a username and password.

An overview of the steps you take:

> [!div class="checklist"]
> * [Enable Microsoft Entra authentication to the SQL database](#grant-database-access-to-azure-ad-user)
> * [Create a user-assigned managed identity](#create-a-user-assigned-managed-identity)
> * [Grant SQL Database access to the managed identity](#grant-sql-database-access-to-the-managed-identity)
> * [Configure Azure Function SQL connection string](#configure-azure-function-sql-connection-string)


<a name='grant-database-access-to-azure-ad-user'></a>

## Grant database access to Microsoft Entra user

First, enable Microsoft Entra authentication to SQL database by assigning a Microsoft Entra user as the Active Directory admin of the server. This user is different from the Microsoft account you used to sign up for your Azure subscription. It must be a user that you created, imported, synced, or invited into Microsoft Entra ID. For more information on allowed Microsoft Entra users, see [Microsoft Entra features and limitations in SQL database](/azure/azure-sql/database/authentication-aad-overview#azure-ad-features-and-limitations).

You can enable Microsoft Entra authentication through the Azure portal, PowerShell, or Azure CLI. Directions for Azure CLI are in the following section. For information about completing this task through the Azure portal and PowerShell, see [Azure SQL documentation on Microsoft Entra authentication](/azure/azure-sql/database/authentication-aad-configure).

1. If your Microsoft Entra tenant doesn't have a user yet, create one by following the steps at [Add or delete users using Microsoft Entra ID](../active-directory/fundamentals/add-users-azure-active-directory.md).

1. Find the object ID of the Microsoft Entra user by using the [`az ad user list`](/cli/azure/ad/user#az-ad-user-list) command and replace *\<user-principal-name>*. Save the result to a variable.

    For Azure CLI 2.37.0 and newer:

    ```azurecli-interactive
    azureaduser=$(az ad user list --filter "userPrincipalName eq '<user-principal-name>'" --query [].id --output tsv)
    ```

    For older versions of Azure CLI:

    ```azurecli-interactive
    azureaduser=$(az ad user list --filter "userPrincipalName eq '<user-principal-name>'" --query [].objectId --output tsv)
    ```

    > [!TIP]
    > To see the list of all user principal names in Microsoft Entra ID, run `az ad user list --query [].userPrincipalName`.
    >

1. Add this Microsoft Entra user as an Active Directory admin by using the [`az sql server ad-admin create`](/cli/azure/sql/server/ad-admin#az-sql-server-ad-admin-create) command in Cloud Shell. In the following command, replace *\<server-name>* with the server name (without the `.database.windows.net` suffix).

    ```azurecli-interactive
    az sql server ad-admin create --resource-group myResourceGroup --server-name <server-name> --display-name ADMIN --object-id $azureaduser
    ```

For more information about adding an Active Directory admin, see [Provision a Microsoft Entra administrator for your server](/azure/azure-sql/database/authentication-aad-configure#provision-azure-ad-admin-sql-database).



## Create a user-assigned managed identity

Create a user-assigned managed identity and assign it to your function app. Use a user-assigned identity because you can reuse it across multiple resources and its lifecycle is independent of your function app.

1. In the [Azure portal](https://portal.azure.com), search for **Managed Identities** and select **Create**.

1. Choose your **Subscription**, **Resource group**, **Region**, and give the identity a **Name** (for example, `my-sql-identity`).

1. Select **Review + create**, and then select **Create**.

1. After the identity is created, go to your function app in the portal.

1. Under **Settings**, select **Identity**, and then select the **User assigned** tab.

1. Select **Add**, choose the managed identity you created, and select **Add**.

> [!TIP]
> You can also use a system-assigned managed identity. If you prefer system-assigned, enable it on the **System assigned** tab of the **Identity** page. When using system-assigned identity, the `<identity-name>` in the SQL commands is the name of your function app, and you don't need the `User Id` parameter in the connection string.
 

## Grant SQL database access to the managed identity

In this step, connect to the SQL database by using a Microsoft Entra user account and grant the managed identity access to the database.

1. Open your preferred SQL tool and sign in by using a Microsoft Entra user account, such as the Microsoft Entra user you assigned as administrator. You can accomplish this step in Cloud Shell by using the SQLCMD command.

    ```bash
    sqlcmd -S <server-name>.database.windows.net -d <db-name> -U <aad-user-name> -P "<aad-password>" -G -l 30
    ```

1. In the SQL prompt for the database you want, run the following commands to grant permissions to your function. For example, 

    ```sql
    CREATE USER [<identity-name>] FROM EXTERNAL PROVIDER;
    ALTER ROLE db_datareader ADD MEMBER [<identity-name>];
    ALTER ROLE db_datawriter ADD MEMBER [<identity-name>];
    GO
    ```

    *\<identity-name>* is the name of the managed identity in Microsoft Entra ID. For a user-assigned identity, this name is the name you gave the identity when you created it (for example, `my-sql-identity`). For a system-assigned identity, the name is always the same as the name of your function app.

    > [!NOTE]
    > If you're using the [Azure SQL trigger](functions-bindings-azure-sql-trigger.md), your managed identity requires additional permissions beyond `db_datareader` and `db_datawriter`. For more information, see [Grant permissions for Azure SQL trigger](functions-bindings-azure-sql-trigger.md#grant-permissions-for-azure-sql-trigger).

## Configure Azure Function SQL connection string

In the final step, configure the function app SQL connection string to use Microsoft Entra managed identity authentication.

You identify the connection string setting name in your function code as the binding attribute `ConnectionStringSetting`, as seen in the SQL input binding [attributes and annotations](./functions-bindings-azure-sql-input.md?pivots=programming-language-csharp#attributes). 

In the application settings of your function app, update the SQL connection string setting to follow this format:

`Server=<server-name>.database.windows.net; Authentication=Active Directory Default; Database=<database-name>; User Id=<client-id-of-user-assigned-identity>`

Replace `<server-name>` with your SQL server name, `<database-name>` with your database name, and `<client-id-of-user-assigned-identity>` with the client ID of your user-assigned managed identity. You can find the client ID on the **Overview** page of your managed identity resource in the Azure portal.

> [!TIP]
> The `Active Directory Default` authentication keyword works both locally (using your developer credentials) and in Azure (using the managed identity). This feature means you can use the same connection string in both environments. For system-assigned managed identity, omit the `User Id` parameter.

For more information about identity-based connections, see [Configure connections to remote services](manage-connections.md?pivots=functions-auth-identity).

## Next steps

- [Quickstart: Respond to Azure SQL Database changes using Azure Functions](./scenario-database-changes-azure-sqldb.md)
- [Read data from a database (Input binding)](./functions-bindings-azure-sql-input.md)
- [Save data to a database (Output binding)](./functions-bindings-azure-sql-output.md)
