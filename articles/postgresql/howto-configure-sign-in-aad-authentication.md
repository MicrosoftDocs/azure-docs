---
title: Use Azure Active Directory - Azure Database for PostgreSQL - Single Server
description: Learn about how to set up Azure Active Directory (AAD) for authentication with Azure Database for PostgreSQL - Single Server
author: lfittl
ms.author: lufittl
ms.service: postgresql
ms.topic: conceptual
ms.date: 11/04/2019
---

# Use Azure Active Directory for authenticating with PostgreSQL

This article will walk you through the steps how to configure Azure Active Directory access with Azure Database for PostgreSQL, and how to connect using an Azure AD token.

## Setting the Azure AD Admin user

Only Azure AD administrator users can create/enable users for Azure AD-based authentication. We recommend not using the Azure AD administrator for regular database operations, as it has elevated user permissions (e.g. CREATEDB).

To set the Azure AD administrator (you can use a user or a group), please follow the following steps

1. In the Azure portal, select the instance of Azure Database for PostgreSQL that you want to enable for Azure AD.
2. Under Settings, select Active Directory Admin:

![set azure ad administrator][2]

3. Select a valid Azure AD user in the customer tenant to be Azure AD administrator.

> [!IMPORTANT]
> When setting the administrator, a new user is added to the Azure Database for PostgreSQL server with full administrator permissions. The Azure AD Admin user in Azure Database for PostgreSQL will have the role `azure_ad_admin`.

Only one Azure AD admin can be created per PostgreSQL server and selection of another one will overwrite the existing Azure AD admin configured for the server. You can specify an Azure AD group instead of an individual user to have multiple administrators. Note that you will then sign in with the group name for administration purposes.

## Connecting to Azure Database for PostgreSQL using Azure AD

The following high-level diagram summarizes the workflow of using Azure AD authentication with Azure Database for PostgreSQL:

![authentication flow][1]

We've designed the Azure AD integration to work with common PostgreSQL tools like psql, which are not Azure AD aware and only support specifying username and password when connecting to PostgreSQL. We pass the Azure AD token as the password as shown in the picture above.

We currently have tested the following clients:

- psql commandline (utilize the PGPASSWORD variable to pass the token, see below)
- Azure Data Studio (using the PostgreSQL extension)
- Other libpq based clients (e.g. common application frameworks and ORMs)

> [!NOTE]
> Please be aware that using the Azure AD token with pgAdmin is currently not supported, since it has a hard-coded limitation of 256 characters for passwords (which the token exceeds).

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

Invoke the Azure CLI tool to acquire an access token for the Azure AD authenticated user from step 1 to access Azure Database for PostgreSQL.

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

The token is a Base 64 string that encodes all the information about the authenticated user, and which is targeted to the Azure Database for PostgreSQL service.

> [!NOTE]
> The access token validity is anywhere between 5 minutes to 60 minutes. We recommend you get the access token just before initiating the login to Azure Database for PostgreSQL.

### Step 3: Use token as password for logging in with PostgreSQL

When connecting you need to use the access token as the PostgreSQL user password.

When using the `psql` command line client, the access token needs to be passed through the `PGPASSWORD` environment variable, since the access token exceeds the password length that `psql` can accept directly:

Windows Example:

```shell
set PGPASSWORD=<copy/pasted TOKEN value from step 2>
```

Linux/macOS Example:

```shell
export PGPASSWORD=<copy/pasted TOKEN value from step 2>
```

Now you can initiate a connection with Azure Database for PostgreSQL like you normally would:

```shell
psql "host=mydb.postgres... user=user@tenant.onmicrosoft.com@mydb dbname=postgres sslmode=require"
```

Important considerations when connecting:

* `user@tenant.onmicrosoft.com` is the name of the Azure AD user or group you are trying to connect as
* Always append the server name after the Azure AD user/group name (e.g. `@mydb`)
* Make sure to use the exact way the Azure AD user or group name is spelled
* Azure AD user and group names are case sensitive
* When connecting as a group, use only the group name (e.g. `GroupName@mydb`)
* If the name contains spaces, use `\` before each space to escape it

You are now authenticated to your PostgreSQL server using Azure AD authentication.

## Creating Azure AD users in Azure Database for PostgreSQL

To add an Azure AD user to your Azure Database for PostgreSQL database, perform the following steps after connecting (see later section on how to connect):

1. First ensure that the Azure AD user `<user>@yourtenant.onmicrosoft.com` is a valid user in Azure AD tenant.
2. Sign in to your Azure Database for PostgreSQL instance as the Azure AD Admin user.
3. Create role `<user>@yourtenant.onmicrosoft.com` in Azure Database for PostgreSQL.
4. Make `<user>@yourtenant.onmicrosoft.com` a member of role azure_ad_user. This must only be given to Azure AD users.

**Example:**

```sql
CREATE ROLE "user1@yourtenant.onmicrosoft.com" WITH LOGIN IN ROLE azure_ad_user;
```

> [!NOTE]
> Authenticating a user through Azure AD does not give the user any permissions to access objects within the Azure Database for PostgreSQL database. You must grant the user the required permissions manually.

## Creating Azure AD groups in Azure Database for PostgreSQL

To enable an Azure AD group for access to your database, use the same mechanism as for users, but instead specify the group name:

**Example:**

```sql
CREATE ROLE "Prod DB Readonly" WITH LOGIN IN ROLE azure_ad_user;
```

When logging in, members of the group will use their personal access tokens, but sign with the group name specified as the username.

## Token Validation

Azure AD authentication in Azure Database for PostgreSQL ensures that the user exists in the PostgreSQL server, and it checks the validity of the token by validating the contents of the token. The following token validation steps are performed:

- Token is signed by Azure AD and has not been tampered with
- Token was issued by Azure AD for the tenant associated with the server
- Token has not expired
- Token is for the Azure Database for PostgreSQL resource (and not another Azure resource)

## Migrating existing PostgreSQL users to Azure AD-based authentication

You can enable Azure AD authentication for existing users. There are two cases to consider:

### Case 1: PostgreSQL username matches the Azure AD User Principal Name

In the unlikely case that your existing users already match the Azure AD user names, you can grant the `azure_ad_user` role to them in order to enable them for Azure AD authentication:

```sql
GRANT azure_ad_user TO "existinguser@yourtenant.onmicrosoft.com";
```

They will now be able to sign in with Azure AD credentials instead of using their previously configured PostgreSQL user password.

### Case 2: PostgreSQL username is different than the Azure AD User Principal Name

If a PostgreSQL user either does not exist in Azure AD or has a different username, you can use Azure AD groups to authenticate as this PostgreSQL user. You can migrate existing Azure Database for PostgreSQL users to Azure AD by creating an Azure AD group with a name that matches the PostgreSQL user, and then granting role azure_ad_user to the existing PostgreSQL user:

```sql
GRANT azure_ad_user TO "DBReadUser";
```

This assumes you have created a group "DBReadUser" in your Azure AD. Users belonging to that group will now be able to sign in to the database as this user.

## Next steps

* Review the overall concepts for [Azure Active Directory authentication with Azure Database for PostgreSQL - Single Server](concepts-aad-authentication.md)

<!--Image references-->

[1]: ./media/concepts-aad-authentication/authentication-flow.png
[2]: ./media/concepts-aad-authentication/set-aad-admin.png
