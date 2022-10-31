---
title: Set up Azure Active Directory authentication for Azure Database for MySQL flexible server Preview
description: Learn how to set up Azure Active Directory authentication for Azure Database for MySQL flexible Server
author: vivgk
ms.author: vivgk
ms.reviewer: maghan
ms.date: 09/21/2022
ms.service: mysql
ms.subservice: flexible-server
ms.topic: how-to
---

# Set up Azure Active Directory authentication for Azure Database for MySQL - Flexible Server Preview

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This tutorial shows you how to set up Azure Active Directory authentication for Azure Database for MySQL flexible server.

In this tutorial, you learn how to:

- Configure the Azure AD Admin
- Connect to Azure Database for MySQL flexible server using Azure AD

## Configure the Azure AD Admin
 
To create an Azure AD Admin user, please follow the following steps. 

- In the Azure portal, select the instance of Azure Database for MySQL Flexible server that you want to enable for Azure AD. 
 
- Under Security pane, select **Authentication**:
:::image type="content" source="media//how-to-azure-ad/azure-ad-configuration.jpg" alt-text="Diagram of how to configure Azure ad authentication.":::

- There are three types of authentication available: 

    - **MySQL authentication only** – By default, MySQL uses the built-in mysql_native_password authentication plugin, which performs authentication using the native password hashing method 

    - **Azure Active Directory authentication only** – Only allows authentication with an Azure AD account. Disables mysql_native_password authentication and turns _ON_ the server parameter aad_auth_only 

    - **MySQL and Azure Active Directory authentication** – Allows authentication using a native MySQL password or an Azure AD account. Turns _OFF_ the server parameter aad_auth_only 

    > [!NOTE]
    > The server parameter aad_auth_only stays set to ON when the authentication type is changed to Azure Active Directory authentication only. We recommend disabling it manually when you opt for MySQL authentication only in the future.

- **Select Identity** – Select/Add User assigned managed identity. To allow the UMI to read from Microsoft Graph as the server identity, the following permissions are required. Alternatively, give the UMI the [Directory Readers](../../active-directory/roles/permissions-reference.md#directory-readers) role. 

    - [User.Read.All](/graph/permissions-reference#user-permissions): Allows access to Azure AD user information.
    - [GroupMember.Read.All](/graph/permissions-reference#group-permissions): Allows access to Azure AD group information.
    - [Application.Read.ALL](/graph/permissions-reference#application-resource-permissions): Allows access to Azure AD service principal (application) information.

For guidance about how to grant and use the permissions, refer [Microsoft Graph permissions](/graph/permissions-reference)

After you grant the permissions to the UMI, they're enabled for all servers or instances that are created with the UMI assigned as a server identity.

> [!IMPORTANT]
> Only a [Global Administrator](../../active-directory/roles/permissions-reference.md#global-administrator) or [Privileged Role Administrator](../../active-directory/roles/permissions-reference.md#privileged-role-administrator) can grant these permissions.

- Select a valid Azure AD user or an Azure AD group in the customer tenant to be **Azure AD administrator**. Once Azure AD authentication support has been enabled, Azure AD Admins can be added as security principals with permissions to add Azure AD Users to the MySQL server.  

    > [!NOTE]
    > Only one Azure AD admin can be created per MySQL server and selection of another one will overwrite the existing Azure AD admin configured for the server.

## Connect to Azure Database for MySQL flexible server using Azure AD

#### Prerequisites

- An Azure account with an active subscription.

- If you don't have an Azure subscription, create an [Azure free account](https://azure.microsoft.com/free) before you begin.
 
    > [!Note]
    > With an Azure free account, you can now try Azure Database for MySQL - Flexible Server for free for 12 months. For more information, see [Try Flexible Server for free](how-to-deploy-on-azure-free-account.md).

- Install or upgrade Azure CLI to the latest version. See [Install Azure CLI](/cli/azure/install-azure-cli).

**Step 1: Authenticate with Azure AD** 

Start by authenticating with Azure AD using the Azure CLI tool. 
_(This step is not required in Azure Cloud Shell.)_

- Log in to Azure account using [az login](/cli/azure/reference-index#az-login) command. Note the ID property, which refers to Subscription ID for your Azure account:

    ```azurecli-interactive
    az login
    ```

The command will launch a browser window to the Azure AD authentication page. It requires you to give your Azure AD user ID and the password.

- If you have multiple subscriptions, choose the appropriate subscription using the az account set command:

    ```azurecli-interactive
    az account set --subscription \<subscription id\>
    ```

**Step 2: Retrieve Azure AD access token** 

Invoke the Azure CLI tool to acquire an access token for the Azure AD authenticated user from step 1 to access Azure Database for MySQL flexible server. 

- Example (for Public Cloud):
 
    ```azurecli-interactive
    az account get-access-token --resource https://ossrdbms-aad.database.windows.net
    ```

- The above resource value must be specified exactly as shown. For other clouds, the resource value can be looked up using: 

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
 
After authentication is successful, Azure AD will return an access token: 

```json
{ 
  "accessToken": "TOKEN", 
  "expiresOn": "...", 
  "subscription": "...", 
  "tenant": "...", 
  "tokenType": "Bearer" 
}
```

The token is a Base 64 string that encodes all the information about the authenticated user, and which is targeted to the Azure Database for MySQL service. 

The access token validity is anywhere between 5 minutes to 60 minutes. We recommend you get the access token just before initiating the login to Azure Database for MySQL Flexible server. 

- You can use the following PowerShell command to see the token validity. 

 ```powershell
    $accessToken.ExpiresOn.DateTime
  ```

**Step 3: Use token as password for logging in with MySQL**

When connecting you need to use the access token as the MySQL user password. When using GUI clients such as MySQLWorkbench, you can use the method described above to retrieve the token. 

> [!NOTE]
> The newly restored server will also have the server parameter aad_auth_only set to ON if it was ON on the source server during failover. If you wish to use MySQL authentication on the restored server, you must manually disable this server parameter. Otherwise, an Azure AD Admin must be configured.

#### Using MySQL CLI
When using the CLI, you can use this short-hand to connect: 

**Example (Linux/macOS):**

```
mysql -h mydb.mysql.database.azure.com \ 
  --user user@tenant.onmicrosoft.com \ 
  --enable-cleartext-plugin \ 
  --password=`az account get-access-token --resource-type oss-rdbms --output tsv --query accessToken`
```  
#### Using MySQL Workbench

* Launch MySQL Workbench and Click the Database option, then click "Connect to database"
* In the hostname field, enter the MySQL FQDN eg. mysql.database.azure.com
* In the username field, enter the MySQL Azure Active Directory administrator name and append this with MySQL server name, not the FQDN e.g. user@tenant.onmicrosoft.com
* In the password field, click "Store in Vault" and paste in the access token from file e.g. C:\temp\MySQLAccessToken.txt
* Click the advanced tab and ensure that you check "Enable Cleartext Authentication Plugin"
* Click OK to connect to the database

#### Important considerations when connecting:

* `user@tenant.onmicrosoft.com` is the name of the Azure AD user or group you are trying to connect as
* Make sure to use the exact way the Azure AD user or group name is spelled
* Azure AD user and group names are case sensitive
* When connecting as a group, use only the group name (e.g. `GroupName`)
* If the name contains spaces, use `\` before each space to escape it

> [!Note]
> The “enable-cleartext-plugin” setting – you need to use a similar configuration with other clients to make sure the token gets sent to the server without being hashed. 

You are now authenticated to your MySQL flexible server using Azure AD authentication.

## Additional Azure AD Admin commands

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

## Creating Azure AD users in Azure Database for MySQL

To add an Azure AD user to your Azure Database for MySQL database, perform the following steps after connecting:

1. First ensure that the Azure AD user `<user>@yourtenant.onmicrosoft.com` is a valid user in Azure AD tenant.
2. Sign in to your Azure Database for MySQL instance as the Azure AD Admin user.
3. Create user `<user>@yourtenant.onmicrosoft.com` in Azure Database for MySQL.

_Example:_
```sql
CREATE AADUSER 'user1@yourtenant.onmicrosoft.com';
```

For user names that exceed 32 characters, it is recommended you use an alias instead, to be used when connecting: 

_Example:_
```sql
CREATE AADUSER 'userWithLongName@yourtenant.onmicrosoft.com' as 'userDefinedShortName'; 
```
> [!NOTE]
> 1. MySQL ignores leading and trailing spaces so user name should not have any leading or trailing spaces. 
> 2. Authenticating a user through Azure AD does not give the user any permissions to access objects within the Azure Database for MySQL database. You must grant the user the required permissions manually.

## Creating Azure AD groups in Azure Database for MySQL

To enable an Azure AD group for access to your database, use the same mechanism as for users, but instead specify the group name:

_Example:_

```sql
CREATE AADUSER 'Prod_DB_Readonly';
```

When logging in, members of the group will use their personal access tokens, but sign with the group name specified as the username.

## Compatibility with application drivers

Most drivers are supported, however make sure to use the settings for sending the password in clear-text, so the token gets sent without modification.

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
    - mysqljs: Not supported (does not send token in cleartext without patch)
    - node-mysql2: Supported

- Perl
    - DBD::mysql: Supported
    - Net::MySQL: Not supported

- Go
    - go-sql-driver: Supported, add `?tls=true&allowCleartextPasswords=true` to connection string

## Next steps

- Review the concepts for [Azure Active Directory authentication with Azure Database for MySQL flexible server](concepts-azure-ad-authentication.md)