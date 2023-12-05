---
title: Use Microsoft Entra ID - Azure Database for PostgreSQL - Single Server
description: Learn about how to set up Microsoft Entra ID for authentication with Azure Database for PostgreSQL - Single Server
ms.service: postgresql
ms.subservice: single-server
ms.topic: how-to
ms.author: sunila
author: sunilagarwal 
ms.date: 06/24/2022
---

# Use Microsoft Entra ID for authentication with PostgreSQL

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

This article will walk you through the steps how to configure Microsoft Entra ID access with Azure Database for PostgreSQL, and how to connect using a Microsoft Entra token.

<a name='setting-the-azure-ad-admin-user'></a>

## Setting the Microsoft Entra Admin user

Only Microsoft Entra administrator users can create/enable users for Microsoft Entra ID-based authentication. We recommend not using the Microsoft Entra administrator for regular database operations, as it has elevated user permissions (e.g. CREATEDB).

To set the Microsoft Entra administrator (you can use a user or a group), please follow the following steps

1. In the Azure portal, select the instance of Azure Database for PostgreSQL that you want to enable for Microsoft Entra ID.
2. Under Settings, select Active Directory Admin:

![set Microsoft Entra administrator][2]

3. Select a valid Microsoft Entra user in the customer tenant to be Microsoft Entra administrator.

> [!IMPORTANT]
> When setting the administrator, a new user is added to the Azure Database for PostgreSQL server with full administrator permissions. 
> The Microsoft Entra Admin user in Azure Database for PostgreSQL will have the role `azure_ad_admin`.
> Only one Microsoft Entra admin can be created per PostgreSQL server and selection of another one will overwrite the existing Microsoft Entra admin configured for the server. 
> You can specify a Microsoft Entra group instead of an individual user to have multiple administrators.

Only one Microsoft Entra admin can be created per PostgreSQL server and selection of another one will overwrite the existing Microsoft Entra admin configured for the server. You can specify a Microsoft Entra group instead of an individual user to have multiple administrators. Note that you will then sign in with the group name for administration purposes.

<a name='connecting-to-azure-database-for-postgresql-using-azure-ad'></a>

## Connecting to Azure Database for PostgreSQL using Microsoft Entra ID

The following high-level diagram summarizes the workflow of using Microsoft Entra authentication with Azure Database for PostgreSQL:

![authentication flow][1]

We've designed the Microsoft Entra integration to work with common PostgreSQL tools like psql, which are not Microsoft Entra aware and only support specifying username and password when connecting to PostgreSQL. We pass the Microsoft Entra token as the password as shown in the picture above.

We currently have tested the following clients:

- psql commandline (utilize the PGPASSWORD variable to pass the token, see step 3 for more information)
- Azure Data Studio (using the PostgreSQL extension)
- Other libpq based clients (e.g. common application frameworks and ORMs)
- PgAdmin (uncheck connect now at server creation. See step 4 for more information)

These are the steps that a user/application will need to do authenticate with Microsoft Entra ID described below:

### Prerequisites

You can follow along in Azure Cloud Shell, an Azure VM, or on your local machine. Make sure you have the [Azure CLI installed](/cli/azure/install-azure-cli).

<a name='authenticate-with-azure-ad-as-a-single-user'></a>

## Authenticate with Microsoft Entra ID as a single user

### Step 1: Login to the user's Azure subscription

Start by authenticating with Microsoft Entra ID using the Azure CLI tool. This step is not required in Azure Cloud Shell.

```
az login
```

The command will launch a browser window to the Microsoft Entra authentication page. It requires you to give your Microsoft Entra user ID and the password.

<a name='step-2-retrieve-azure-ad-access-token'></a>

### Step 2: Retrieve Microsoft Entra access token

Invoke the Azure CLI tool to acquire an access token for the Microsoft Entra authenticated user from step 1 to access Azure Database for PostgreSQL.

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

After authentication is successful, Microsoft Entra ID will return an access token:

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

### Step 3: Use token as password for logging in with client psql

When connecting you need to use the access token as the PostgreSQL user password.

When using the `psql` command line client, the access token needs to be passed through the `PGPASSWORD` environment variable, since the access token exceeds the password length that `psql` can accept directly:

Windows Example:

```cmd
set PGPASSWORD=<copy/pasted TOKEN value from step 2>
```

```PowerShell
$env:PGPASSWORD='<copy/pasted TOKEN value from step 2>'
```

Linux/macOS Example:

```shell
export PGPASSWORD=<copy/pasted TOKEN value from step 2>
```

Now you can initiate a connection with Azure Database for PostgreSQL like you normally would:

```shell
psql "host=mydb.postgres... user=user@tenant.onmicrosoft.com@mydb dbname=postgres sslmode=require"
```
### Step 4: Use token as a password for logging in with PgAdmin

To connect using Microsoft Entra token with pgAdmin you need to follow the next steps:
1. Uncheck the connect now option at server creation.
2. Enter your server details in the connection tab and save.
3. From the browser menu, select connect to the Azure Database for PostgreSQL server
4. Enter the AD token password when prompted.

Important considerations when connecting:

* `user@tenant.onmicrosoft.com` is the name of the Microsoft Entra user 
* Make sure to use the exact way the Azure user is spelled - as the Microsoft Entra user and group names are case sensitive.
* If the name contains spaces, use `\` before each space to escape it.
* The access token validity is anywhere between 5 minutes to 60 minutes. We recommend you get the access token just before initiating the login to Azure Database for PostgreSQL.

You are now authenticated to your Azure Database for PostgreSQL server using Microsoft Entra authentication.

<a name='authenticate-with-azure-ad-as-a-group-member'></a>

## Authenticate with Microsoft Entra ID as a group member

<a name='step-1-create-azure-ad-groups-in-azure-database-for-postgresql'></a>

### Step 1: Create Microsoft Entra groups in Azure Database for PostgreSQL

To enable a Microsoft Entra group for access to your database, use the same mechanism as for users, but instead specify the group name:

Example:

```
CREATE USER <new_user> IN ROLE azure_ad_user;
```
When logging in, members of the group will use their personal access tokens, but sign with the group name specified as the username.

### Step 2: Login to the user’s Azure Subscription

Authenticate with Microsoft Entra ID using the Azure CLI tool. This step is not required in Azure Cloud Shell. The user needs to be member of the Microsoft Entra group.

```
az login
```

<a name='step-3-retrieve-azure-ad-access-token'></a>

### Step 3: Retrieve Microsoft Entra access token

Invoke the Azure CLI tool to acquire an access token for the Microsoft Entra authenticated user from step 2 to access Azure Database for PostgreSQL.

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

After authentication is successful, Microsoft Entra ID will return an access token:

```json
{
  "accessToken": "TOKEN",
  "expiresOn": "...",
  "subscription": "...",
  "tenant": "...",
  "tokenType": "Bearer"
}
```

### Step 4: Use token as password for logging in with psql or PgAdmin (see above steps for user connection)

Important considerations when connecting as a group member:
* groupname@mydb is the name of the Microsoft Entra group you are trying to connect as
* Always append the server name after the Microsoft Entra user/group name (e.g. @mydb)
* Make sure to use the exact way the Microsoft Entra group name is spelled.
* Microsoft Entra user and group names are case sensitive
* When connecting as a group, use only the group name (e.g. GroupName@mydb) and not the alias of a group member.
* If the name contains spaces, use \ before each space to escape it.
* The access token validity is anywhere between 5 minutes to 60 minutes. We recommend you get the access token just before initiating the login to Azure Database for PostgreSQL.

You are now authenticated to your PostgreSQL server using Microsoft Entra authentication.

<a name='creating-azure-ad-users-in-azure-database-for-postgresql'></a>

## Creating Microsoft Entra users in Azure Database for PostgreSQL

To add a Microsoft Entra user to your Azure Database for PostgreSQL database, perform the following steps after connecting (see later section on how to connect):

1. First ensure that the Microsoft Entra user `<user>@yourtenant.onmicrosoft.com` is a valid user in Microsoft Entra tenant.
2. Sign in to your Azure Database for PostgreSQL instance as the Microsoft Entra Admin user.
3. Create role `<user>@yourtenant.onmicrosoft.com` in Azure Database for PostgreSQL.
4. Make `<user>@yourtenant.onmicrosoft.com` a member of role azure_ad_user. This must only be given to Microsoft Entra users.

**Example:**

```sql
CREATE USER "user1@yourtenant.onmicrosoft.com" IN ROLE azure_ad_user;
```

> [!NOTE]
> Authenticating a user through Microsoft Entra ID does not give the user any permissions to access objects within the Azure Database for PostgreSQL database. You must grant the user the required permissions manually.

## Token Validation

Microsoft Entra authentication in Azure Database for PostgreSQL ensures that the user exists in the PostgreSQL server, and it checks the validity of the token by validating the contents of the token. The following token validation steps are performed:

- Token is signed by Microsoft Entra ID and has not been tampered with
- Token was issued by Microsoft Entra ID for the tenant associated with the server
- Token has not expired
- Token is for the Azure Database for PostgreSQL resource (and not another Azure resource)

<a name='migrating-existing-postgresql-users-to-azure-ad-based-authentication'></a>

## Migrating existing PostgreSQL users to Microsoft Entra ID-based authentication

You can enable Microsoft Entra authentication for existing users. There are two cases to consider:

<a name='case-1-postgresql-username-matches-the-azure-ad-user-principal-name'></a>

### Case 1: PostgreSQL username matches the Microsoft Entra user Principal Name

In the unlikely case that your existing users already match the Microsoft Entra user names, you can grant the `azure_ad_user` role to them in order to enable them for Microsoft Entra authentication:

```sql
GRANT azure_ad_user TO "existinguser@yourtenant.onmicrosoft.com";
```

They will now be able to sign in with Microsoft Entra credentials instead of using their previously configured PostgreSQL user password.

<a name='case-2-postgresql-username-is-different-than-the-azure-ad-user-principal-name'></a>

### Case 2: PostgreSQL username is different than the Microsoft Entra user Principal Name

If a PostgreSQL user either does not exist in Microsoft Entra ID or has a different username, you can use Microsoft Entra groups to authenticate as this PostgreSQL user. You can migrate existing Azure Database for PostgreSQL users to Microsoft Entra ID by creating a Microsoft Entra group with a name that matches the PostgreSQL user, and then granting role azure_ad_user to the existing PostgreSQL user:

```sql
GRANT azure_ad_user TO <new_user>;
```

This assumes you have created a group "DBReadUser" in your Microsoft Entra ID. Users belonging to that group will now be able to sign in to the database as this user.

## Next steps

* Review the overall concepts for [Microsoft Entra authentication with Azure Database for PostgreSQL - Single Server](concepts-azure-ad-authentication.md)

<!--Image references-->

[1]: ./media/concepts-azure-ad-authentication/authentication-flow.png
[2]: ./media/concepts-azure-ad-authentication/set-azure-ad-admin.png
