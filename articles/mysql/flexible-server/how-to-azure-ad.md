---
title: Set up Microsoft Entra authentication for Azure Database for MySQL - Flexible Server
description: Learn how to set up Microsoft Entra authentication for Azure Database for MySQL - Flexible Server
author: SudheeshGH
ms.author: sunaray
ms.reviewer: maghan
ms.date: 11/21/2022
ms.service: mysql
ms.subservice: flexible-server
ms.custom: devx-track-azurecli, has-azure-ad-ps-ref
ms.topic: how-to
---

# Set up Microsoft Entra authentication for Azure Database for MySQL - Flexible Server

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This tutorial shows you how to set up Microsoft Entra authentication for Azure Database for MySQL - Flexible Server.

In this tutorial, you learn how to:

- Configure the Microsoft Entra Admin
- Connect to Azure Database for MySQL - Flexible Server using Microsoft Entra ID

## Prerequisites

- An Azure account with an active subscription.

- If you don't have an Azure subscription, create an [Azure free account](https://azure.microsoft.com/free) before you begin.

    > [!NOTE]  
    > With an Azure free account, you can now try Azure Database for MySQL - Flexible Server for free for 12 months. For more information, see [Try Flexible Server for free](how-to-deploy-on-azure-free-account.md).

- Install or upgrade Azure CLI to the latest version. See [Install Azure CLI](/cli/azure/install-azure-cli).

<a name='configure-the-azure-ad-admin'></a>

## Configure the Microsoft Entra Admin

To create a Microsoft Entra Admin user, follow the following steps.

- In the Azure portal, select the instance of Azure Database for MySQL - Flexible Server that you want to enable for Microsoft Entra ID.

- Under the Security pane, select **Authentication**:
:::image type="content" source="media//how-to-Azure-ad/Azure-ad-configuration.jpg" alt-text="Diagram of how to configure Microsoft Entra authentication.":::

- There are three types of authentication available:

    - **MySQL authentication only** – By default, MySQL uses the built-in mysql_native_password authentication plugin, which performs authentication using the native password hashing method

    - **Microsoft Entra authentication only** – Only allows authentication with a Microsoft Entra account. Disables mysql_native_password authentication and turns _ON_ the server parameter aad_auth_only

    - **MySQL and Microsoft Entra authentication** – Allows authentication using a native MySQL password or a Microsoft Entra account. Turns _OFF_ the server parameter aad_auth_only

- **Select Identity** – Select/Add User assigned managed identity. The following permissions are required to allow the UMI to read from Microsoft Graph as the server identity. Alternatively, give the UMI the [Directory Readers](../../active-directory/roles/permissions-reference.md#directory-readers) role.

    - [User.Read.All](/graph/permissions-reference#user-permissions): Allows access to Microsoft Entra user information.
    - [GroupMember.Read.All](/graph/permissions-reference#group-permissions): Allows access to Microsoft Entra group information.
    - [Application.Read.ALL](/graph/permissions-reference#application-resource-permissions): Allows access to Microsoft Entra service principal (application) information.

> [!IMPORTANT]  
> Only a [Global Administrator](../../active-directory/roles/permissions-reference.md#global-administrator) or [Privileged Role Administrator](../../active-directory/roles/permissions-reference.md#privileged-role-administrator) can grant these permissions.

- Select a valid Microsoft Entra user or a Microsoft Entra group in the customer tenant to be **Microsoft Entra administrator**. Once Microsoft Entra authentication support has been enabled, Microsoft Entra Admins can be added as security principals with permission to add Microsoft Entra users to the MySQL server.

    > [!NOTE]  
    > Only one Microsoft Entra admin can be created per MySQL server, and selecting another overwrites the existing Microsoft Entra admin configured for the server.

### Grant permissions to User assigned managed identity

The following sample PowerShell script grants the necessary permissions for a UMI. This sample assigns permissions to the UMI `umiservertest`. 

To run the script, you must sign in as a user with a Global Administrator or Privileged Role Administrator role.

The script grants the `User.Read.All`, `GroupMember.Read.All`, and `Application.Read.ALL` permissions to a UMI to access [Microsoft Graph](/graph/auth/auth-concepts#microsoft-graph-permissions).

```powershell
# Script to assign permissions to the UMI "umiservertest"

import-module AzureAD
$tenantId = '<tenantId>' # Your Azure AD tenant ID

Connect-AzureAD -TenantID $tenantId
# Log in as a user with a "Global Administrator" or "Privileged Role Administrator" role
# Script to assign permissions to an existing UMI 
# The following Microsoft Graph permissions are required: 
#   User.Read.All
#   GroupMember.Read.All
#   Application.Read.ALL

# Search for Microsoft Graph
$AAD_SP = Get-AzureADServicePrincipal -SearchString "Microsoft Graph";
$AAD_SP
# Use Microsoft Graph; in this example, this is the first element $AAD_SP[0]

#Output

#ObjectId                             AppId                                DisplayName
#--------                             -----                                -----------
#47d73278-e43c-4cc2-a606-c500b66883ef 00000003-0000-0000-c000-000000000000 Microsoft Graph
#44e2d3f6-97c3-4bc7-9ccd-e26746638b6d 0bf30f3b-4a52-48df-9a82-234910c4a086 Microsoft Graph #Change 

$MSIName = "<managedIdentity>";  # Name of your user-assigned
$MSI = Get-AzureADServicePrincipal -SearchString $MSIName 
if($MSI.Count -gt 1)
{ 
Write-Output "More than 1 principal found, please find your principal and copy the right object ID. Now use the syntax $MSI = Get-AzureADServicePrincipal -ObjectId <your_object_id>"

# Choose the right UMI

Exit
} 

# If you have more UMIs with similar names, you have to use the proper $MSI[ ]array number

# Assign the app roles

$AAD_AppRole = $AAD_SP.AppRoles | Where-Object {$_.Value -eq "User.Read.All"}
New-AzureADServiceAppRoleAssignment -ObjectId $MSI.ObjectId  -PrincipalId $MSI.ObjectId  -ResourceId $AAD_SP.ObjectId[0]  -Id $AAD_AppRole.Id 
$AAD_AppRole = $AAD_SP.AppRoles | Where-Object {$_.Value -eq "GroupMember.Read.All"}
New-AzureADServiceAppRoleAssignment -ObjectId $MSI.ObjectId  -PrincipalId $MSI.ObjectId  -ResourceId $AAD_SP.ObjectId[0]  -Id $AAD_AppRole.Id
$AAD_AppRole = $AAD_SP.AppRoles | Where-Object {$_.Value -eq "Application.Read.All"}
New-AzureADServiceAppRoleAssignment -ObjectId $MSI.ObjectId  -PrincipalId $MSI.ObjectId  -ResourceId $AAD_SP.ObjectId[0]  -Id $AAD_AppRole.Id
```

In the final steps of the script, if you have more UMIs with similar names, you have to use the proper `$MSI[ ]array` number. An example is `$AAD_SP.ObjectId[0]`.

### Check permissions for user-assigned managed identity

To check permissions for a UMI, go to the [Azure portal](https://portal.azure.com). In the **Microsoft Entra ID** resource, go to **Enterprise applications**. Select **All Applications** for **Application type**, and search for the UMI that was created.

Select the UMI, and go to the **Permissions** settings under **Security**.

After you grant the permissions to the UMI, they're enabled for all servers created with the UMI assigned as a server identity.

<a name='connect-to-azure-database-for-mysql---flexible-server-using-azure-ad'></a>

## Connect to Azure Database for MySQL - Flexible Server using Microsoft Entra ID

<a name='1---authenticate-with-azure-ad'></a>

### 1 - Authenticate with Microsoft Entra ID

Start by authenticating with Microsoft Entra ID using the Azure CLI tool.  
_(This step isn't required in Azure Cloud Shell.)_

- Sign in to Azure account using [az login](/cli/azure/reference-index#az-login) command. Note the ID property, which refers to the Subscription ID for your Azure account:

    ```azurecli-interactive
    az login
    ```

The command launches a browser window to the Microsoft Entra authentication page. It requires you to give your Microsoft Entra user ID and password.

- If you have multiple subscriptions, choose the appropriate subscription using the az account set command:

    ```azurecli-interactive
    az account set --subscription \<subscription id\>
    ```

<a name='2---retrieve-azure-ad-access-token'></a>

### 2 - Retrieve Microsoft Entra access token

Invoke the Azure CLI tool to acquire an access token for the Microsoft Entra authenticated user from step 1 to access Azure Database for MySQL - Flexible Server.

- Example (for Public Cloud):

    ```azurecli-interactive
    az account get-access-token --resource https://ossrdbms-aad.database.windows.net
    ```

- The above resource value must be specified exactly as shown. For other clouds, the resource value can be looked up using the following:

    ```azurecli-interactive
    az cloud show
    ```

- For Azure CLI version 2.0.71 and later, the command can be specified in the following more convenient version for all clouds:

    ```azurecli-interactive
    az account get-access-token --resource-type oss-rdbms
    ```

- Using PowerShell, you can use the following command to acquire access token:

    ```powershell
    $accessToken = Get-AzAccessToken -ResourceUrl https://ossrdbms-aad.database.windows.net
    $accessToken.Token | out-file C:\temp\MySQLAccessToken.txt
    ```

After authentication is successful, Microsoft Entra ID returns an access token:

```json
{
  "accessToken": "TOKEN",
  "expiresOn": "...",
  "subscription": "...",
  "tenant": "...",
  "tokenType": "Bearer"
}
```

The token is a Base 64 string that encodes all the information about the authenticated user and is targeted to the Azure Database for MySQL service.

The access token validity is anywhere between 5 minutes to 60 minutes. We recommend you get the access token before initiating the sign-in to Azure Database for MySQL - Flexible Server.

- You can use the following PowerShell command to see the token validity.

 ```powershell
    $accessToken.ExpiresOn.DateTime
  ```

### 3 - Use a token as a password for logging in with MySQL

You need to use the access token as the MySQL user password when connecting. You can use the method described above to retrieve the token using GUI clients such as MySQL workbench.

## Connect to Azure Database for MySQL - Flexible Server using MySQL CLI

When using the CLI, you can use this shorthand to connect:

**Example (Linux/macOS):**

```
mysql -h mydb.mysql.database.azure.com \
  --user user@tenant.onmicrosoft.com \
  --enable-cleartext-plugin \
  --password=`az account get-access-token --resource-type oss-rdbms --output tsv --query accessToken`
```

**Example (PowerShell):**

```
mysql -h mydb.mysql.database.azure.com \
  --user user@tenant.onmicrosoft.com \
  --enable-cleartext-plugin \
  --password=$(az account get-access-token --resource-type oss-rdbms --output tsv --query accessToken)


mysql -h mydb.mysql.database.azure.com \
  --user user@tenant.onmicrosoft.com \
  --enable-cleartext-plugin \
  --password=$((Get-AzAccessToken -ResourceUrl https://ossrdbms-aad.database.windows.net).Token)
```

## Connect to Azure Database for MySQL - Flexible Server using MySQL Workbench

- Launch MySQL Workbench and Select the Database option, then select **Connect to database**.
- In the hostname field, enter the MySQL FQDN for example, mysql.database.azure.com.
- In the username field, enter the MySQL Microsoft Entra administrator name. For example, user@tenant.onmicrosoft.com.
- In the password field, select **Store in Vault** and paste in the access token from the file for example, C:\temp\MySQLAccessToken.txt.
- Select the advanced tab and ensure that you check **Enable Cleartext Authentication Plugin**.
- Select OK to connect to the database.

## Important considerations when connecting

- `user@tenant.onmicrosoft.com` is the name of the Microsoft Entra user or group you're trying to connect as
- Make sure to use the exact way the Microsoft Entra user or group name is spelled
- Microsoft Entra user and group names are case sensitive
- When connecting as a group, use only the group name (for example, `GroupName`)
- If the name contains spaces, use `\` before each space to escape it

> [!NOTE]  
> The “enable-cleartext-plugin” setting – you need to use a similar configuration with other clients to make sure the token gets sent to the server without being hashed.

You're now authenticated to your MySQL flexible server using Microsoft Entra authentication.

<a name='other-azure-ad-admin-commands'></a>

## Other Microsoft Entra admin commands

- Manage server Active Directory administrator

    ```azurecli-interactive
    az mysql flexible-server ad-admin
    ```

- Create an Active Directory administrator

    ```azurecli-interactive
    az mysql flexible-server ad-admin create
    ```

    _Example: Create Active Directory administrator with user 'john@contoso.com', administrator ID '00000000-0000-0000-0000-000000000000' and identity 'test-identity'_

    ```azurecli-interactive
    az mysql flexible-server ad-admin create -g testgroup -s testsvr -u john@contoso.com -i 00000000-0000-0000-0000-000000000000 --identity test-identity
    ```

- Delete an Active Directory administrator

    ```azurecli-interactive
    az mysql flexible-server ad-admin delete
    ```
    _Example: Delete Active Directory administrator_

    ```azurecli-interactive
    az mysql flexible-server ad-admin delete -g testgroup -s testsvr
    ```

- List all Active Directory administrators

    ```azurecli-interactive
    az mysql flexible-server ad-admin list
    ```
    _Example: List Active Directory administrators_

    ```azurecli-interactive
    az mysql flexible-server ad-admin list -g testgroup -s testsvr
    ```

- Get an Active Directory administrator

    ```azurecli-interactive
    az mysql flexible-server ad-admin show
    ```

    _Example: Get Active Directory administrator_

    ```azurecli-interactive
    az mysql flexible-server ad-admin show -g testgroup -s testsvr
    ```

- Wait for the Active Directory administrator to satisfy certain conditions

    ```azurecli-interactive
    az mysql flexible-server ad-admin wait
    ```

    _Examples:_  
    - _Wait until the Active Directory administrator exists_

    ```azurecli-interactive
    az mysql flexible-server ad-admin wait -g testgroup -s testsvr --exists
    ```

    - _Wait for the Active Directory administrator to be deleted_

    ```azurecli-interactive
    az mysql flexible-server ad-admin wait -g testgroup -s testsvr –deleted
    ```

<a name='create-azure-ad-users-in-azure-database-for-mysql'></a>

## Create Microsoft Entra users in Azure Database for MySQL

To add a Microsoft Entra user to your Azure Database for MySQL database, perform the following steps after connecting:

1. First ensure that the Microsoft Entra user `<user>@yourtenant.onmicrosoft.com` is a valid user in Microsoft Entra tenant.
1. Sign in to your Azure Database for MySQL instance as the Microsoft Entra Admin user.
1. Create user `<user>@yourtenant.onmicrosoft.com` in Azure Database for MySQL.

_Example:_
```sql
CREATE AADUSER 'user1@yourtenant.onmicrosoft.com';
```

For user names that exceed 32 characters, it's recommended you use an alias instead, to be used when connecting:

_Example:_
```sql
CREATE AADUSER 'userWithLongName@yourtenant.onmicrosoft.com' as 'userDefinedShortName';
```
> [!NOTE]  
> 1. MySQL ignores leading and trailing spaces, so the user name should not have any leading or trailing spaces.  
> 2. Authenticating a user through Microsoft Entra ID does not give the user any permissions to access objects within the Azure Database for MySQL database. You must grant the user the required permissions manually.

<a name='create-azure-ad-groups-in-azure-database-for-mysql'></a>

## Create Microsoft Entra groups in Azure Database for MySQL

To enable a Microsoft Entra group for access to your database, use the exact mechanism as for users, but instead specify the group name:

_Example:_

```sql
CREATE AADUSER 'Prod_DB_Readonly';
```

When logging in, group members use their personal access tokens but sign in with the group name specified as the username.

## Compatibility with application drivers

Most drivers are supported; however, make sure to use the settings for sending the password in clear text, so the token gets sent without modification.

- C/C++
    - libmysqlclient: Supported
    - mysql-connector-c++: Supported

- Java
    - Connector/J (mysql-connector-java): Supported, must utilize `useSSL` setting

- Python
    - Connector/Python: Supported

- Ruby
    - mysql2: Supported

- .NET
    - mysql-connector-net: Supported, need to add plugin for mysql_clear_password
    - mysql-net/MySqlConnector: Supported

- Node.js
    - mysqljs: Not supported (doesn't send the token in cleartext without patch)
    - node-mysql2: Supported

- Perl
    - DBD::mysql: Supported
    - Net::MySQL: Not supported

- Go
    - go-sql-driver: Supported, add `?tls=true&allowCleartextPasswords=true` to connection string

## Next steps

- Review the concepts for [Microsoft Entra authentication with Azure Database for MySQL - Flexible Server](concepts-azure-ad-authentication.md)
