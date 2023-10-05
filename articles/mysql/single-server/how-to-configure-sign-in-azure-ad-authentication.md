---
title: Use Azure Active Directory - Azure Database for MySQL
description: Learn about how to set up Azure Active Directory (Azure AD) for authentication with Azure Database for MySQL
ms.service: mysql
ms.subservice: single-server
ms.topic: how-to
author: SudheeshGH
ms.author: sunaray
ms.date: 06/20/2022
---

# Use Azure Active Directory for authentication with MySQL

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

This article will walk you through the steps how to configure Azure Active Directory access with Azure Database for MySQL, and how to connect using an Azure AD token.

> [!IMPORTANT]
> Azure Active Directory authentication is only available for MySQL 5.7 and newer.

## Setting the Azure AD Admin user

Only an Azure AD Admin user can create/enable users for Azure AD-based authentication. To create an Azure AD Admin user, please follow the following steps

1. In the Azure portal, select the instance of Azure Database for MySQL that you want to enable for Azure AD.
2. Under Settings, select Active Directory Admin:

![set azure ad administrator][2]

3. Select a valid Azure AD user in the customer tenant to be Azure AD administrator.

> [!IMPORTANT]
> When setting the administrator, a new user is added to the Azure Database for MySQL server with full administrator permissions.

Only one Azure AD admin can be created per MySQL server and selection of another one will overwrite the existing Azure AD admin configured for the server.

After configuring the administrator, you can now sign in:

## Connecting to Azure Database for MySQL using Azure AD

The following high-level diagram summarizes the workflow of using Azure AD authentication with Azure Database for MySQL:

![authentication flow][1]

We’ve designed the Azure AD integration to work with common MySQL tools like the mysql CLI, which are not Azure AD aware and only support specifying username and password when connecting to MySQL. We pass the Azure AD token as the password as shown in the picture above.

We currently have tested the following clients:

- MySQLWorkbench 
- MySQL CLI

We have also tested most common application drivers, you can see details at the end of this page.

These are the steps that a user/application will need to do authenticate with Azure AD described below:

### Prerequisites

You can follow along in Azure Cloud Shell, an Azure VM, or on your local machine. Make sure you have the [Azure CLI installed](/cli/azure/install-azure-cli).

### Step 1: Authenticate with Azure AD

Start by authenticating with Azure AD using the Azure CLI tool. This step is not required in Azure Cloud Shell.

```
az login
```

The command will launch a browser window to the Azure AD authentication page. It requires you to give your Azure AD user ID and the password.

### Step 2: Retrieve Azure AD access token

Invoke the Azure CLI tool to acquire an access token for the Azure AD authenticated user from step 1 to access Azure Database for MySQL.

Example (for Public Cloud):

```azurecli-interactive
az account get-access-token --resource https://ossrdbms-aad.database.windows.net
```
The above resource value must be specified exactly as shown. For other clouds, the resource value can be looked up using:

```azurecli-interactive
az cloud show
```

For Azure CLI version 2.0.71 and later, the command can be specified in the following more convenient version for all clouds:

```azurecli-interactive
az account get-access-token --resource-type oss-rdbms
```
Using PowerShell, you can use the following command to acquire access token:

```azurepowershell-interactive
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

The access token validity is anywhere between ***5 minutes to 60 minutes***. We recommend you get the access token just before initiating the login to Azure Database for MySQL. You can use the following PowerShell command to see the token validity. 

```azurepowershell-interactive
$accessToken.ExpiresOn.DateTime
```

### Step 3: Use token as password for logging in with MySQL

When connecting you need to use the access token as the MySQL user password. When using GUI clients such as MySQLWorkbench, you can use the method described above to retrieve the token. 

#### Using MySQL CLI
When using the CLI, you can use this short-hand to connect: 

**Example (Linux/macOS):**
```
mysql -h mydb.mysql.database.azure.com \ 
  --user user@tenant.onmicrosoft.com@mydb \ 
  --enable-cleartext-plugin \ 
  --password=`az account get-access-token --resource-type oss-rdbms --output tsv --query accessToken`
```
#### Using MySQL Workbench
* Launch MySQL Workbench and Click the Database option, then click "Connect to database"
* In the hostname field, enter the MySQL FQDN eg. mydb.mysql.database.azure.com
* In the username field, enter the MySQL Azure Active Directory administrator name and append this with MySQL server name, not the FQDN e.g. user@tenant.onmicrosoft.com@mydb
* In the password field, click "Store in Vault" and paste in the access token from file e.g. C:\temp\MySQLAccessToken.txt
* Click the advanced tab and ensure that you check "Enable Cleartext Authentication Plugin"
* Click OK to connect to the database

#### Important considerations when connecting:

* `user@tenant.onmicrosoft.com` is the name of the Azure AD user or group you are trying to connect as
* Always append the server name after the Azure AD user/group name (e.g. `@mydb`)
* Make sure to use the exact way the Azure AD user or group name is spelled
* Azure AD user and group names are case sensitive
* When connecting as a group, use only the group name (e.g. `GroupName@mydb`)
* If the name contains spaces, use `\` before each space to escape it

Note the “enable-cleartext-plugin” setting – you need to use a similar configuration with other clients to make sure the token gets sent to the server without being hashed.

You are now authenticated to your MySQL server using Azure AD authentication.

## Creating Azure AD users in Azure Database for MySQL

To add an Azure AD user to your Azure Database for MySQL database, perform the following steps after connecting (see later section on how to connect):

1. First ensure that the Azure AD user `<user>@yourtenant.onmicrosoft.com` is a valid user in Azure AD tenant.
2. Sign in to your Azure Database for MySQL instance as the Azure AD Admin user.
3. Create user `<user>@yourtenant.onmicrosoft.com` in Azure Database for MySQL.

**Example:**

```sql
CREATE AADUSER 'user1@yourtenant.onmicrosoft.com';
```

For user names that exceed 32 characters, it is recommended you use an alias instead, to be used when connecting: 

Example:

```sql
CREATE AADUSER 'userWithLongName@yourtenant.onmicrosoft.com' as 'userDefinedShortName'; 
```
> [!NOTE]
> 1. MySQL ignores leading and trailing spaces so user name should not have any leading or trailing spaces. 
> 2. Authenticating a user through Azure AD does not give the user any permissions to access objects within the Azure Database for MySQL database. You must grant the user the required permissions manually.

## Creating Azure AD groups in Azure Database for MySQL

To enable an Azure AD group for access to your database, use the same mechanism as for users, but instead specify the group name:

**Example:**

```sql
CREATE AADUSER 'Prod_DB_Readonly';
```

When logging in, members of the group will use their personal access tokens, but sign with the group name specified as the username.

## Token Validation

Azure AD authentication in Azure Database for MySQL ensures that the user exists in the MySQL server, and it checks the validity of the token by validating the contents of the token. The following token validation steps are performed:

-	Token is signed by Azure AD and has not been tampered with
-	Token was issued by Azure AD for the tenant associated with the server
-	Token has not expired
-	Token is for the Azure Database for MySQL resource (and not another Azure resource)

## Compatibility with application drivers

Most drivers are supported, however make sure to use the settings for sending the password in clear-text, so the token gets sent without modification.

* C/C++
  * libmysqlclient: Supported
  * mysql-connector-c++: Supported
* Java
  * Connector/J (mysql-connector-java): Supported, must utilize `useSSL` setting
* Python
  * Connector/Python: Supported
* Ruby
  * mysql2: Supported
* .NET
  * mysql-connector-net: Supported, need to add plugin for mysql_clear_password
  * mysql-net/MySqlConnector: Supported
* Node.js
  * mysqljs: Not supported (does not send token in cleartext without patch)
  * node-mysql2: Supported
* Perl
  * DBD::mysql: Supported
  * Net::MySQL: Not supported
* Go
  * go-sql-driver: Supported, add `?tls=true&allowCleartextPasswords=true` to connection string

## Next steps

* Review the overall concepts for [Azure Active Directory authentication with Azure Database for MySQL](concepts-azure-ad-authentication.md)

<!--Image references-->

[1]: ./media/concepts-azure-ad-authentication/authentication-flow.png
[2]: ./media/concepts-azure-ad-authentication/set-azure-ad-admin.png
