---
title: Use Azure Active Directory - Azure Database for PostgreSQL - Flexible Server
description: Learn about how to set up Azure Active Directory (Azure AD) for authentication with Azure Database for PostgreSQL - Flexible Server
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.author: kabharati
author: kabharati
ms.date: 09/26/2022
---

# Use Azure Active Directory for authentication with PostgreSQL Flexible Server

[!INCLUDE [applies-to-postgresql-Flexible-server](../includes/applies-to-postgresql-Flexible-server.md)]

> [!NOTE]
> Azure Active Directory Authentication for PostgreSQL Flexible Server is currently in preview.

This article will walk you through the steps how to configure Azure Active Directory access with Azure Database for PostgreSQL Flexible Server, and how to connect using an Azure AD token.

## Enabling Azure AD Authentication

Azure Active Directory Authentication for Azure Database for PostgreSQL Flexible Server can be configured either during server provisioning or later.
Only Azure AD administrator users can create/enable users for Azure AD-based authentication. We recommend not using the Azure AD administrator for regular database operations, as it has elevated user permissions (for example, CREATEDB). You can now have multiple Azure AD admin users with flexible server and Azure AD admin user can be either user, group or a service principal. 

## Prerequisites 

The below three steps are mandatory to use Azure Active Directory Authentication with Azure Database for PostgreSQL Flexible Server and must be run by tenant administrator or a user with tenant admin rights and this is one time activity per tenant.

Install AzureAD PowerShell: AzureAD Module

### Step 1: Connect to user tenant.

```
Connect-AzureAD -TenantId <customer tenant id>

```
### Step 2: Grant Flexible Server Service Principal read access to customer tenant 
```
Step 2: New-AzureADServicePrincipal -AppId 5657e26c-cc92-45d9-bc47-9da6cfdb4ed

```
This command will grant Azure Database for PostgreSQL Flexible Server Service Principal read access to customer tenant to request Graph API tokens for AAD validation tasks. AppID (5657e26c-cc92-45d9-bc47-9da6cfdb4ed) in the above command is the AppID for Azure Database for PostgreSQL Flexible Server Service.

### Step 3: Networking Requirements 

Azure Active Directory is a multi-tenant application and requires outbound connectivity to perform certain operations like adding AAD admins/ groups and additional networking rules are required for AAD connectivity to work depending upon your network topology.

  `Public access (allowed IP addresses)`

No additional networking rules are required.

 `Private access (VNet Integration)`

*  An outbound NSG rule to allow virtual network traffic to reach AzureActiveDirectory service tag only.

* Optionally, if you’re using a proxy then please add a new firewall rule to allow http/s traffic to reach AzureActiveDirectory service tag only.

Please complete the above prerequisites steps before adding AAD administrator to your server. To set the Azure AD admin  during server provisioning, please follow the below steps. 

1. In the Azure Portal, during server provisioning select either `PostgreSQL and Azure Active Directory authentication` or `Azure Active Directory authentication only` as authentication method.
2. Set Azure AD Admin using `set admin` tab and select a valid Azure AD user/ group /service principal/Managed Identity in the customer tenant to be Azure AD administrator
3. You can also optionally add local postgreSQL admin account if you prefer `PostgreSQL and Azure Active Directory authentication` method.


Note only one Azure admin user can be added during server provisioning and you can add multiple Azure AD admin users after server is created.

![set-azure-ad-administrator][3]

To set the Azure AD administrator after server creation, please follow the below steps

1. In the Azure portal, select the instance of Azure Database for PostgreSQL that you want to enable for Azure AD.
2. Under Security, select Authentication and choose either`PostgreSQL and Azure Active Directory authentication` or `Azure Active Directory authentication only` as authentication method based upon your requirements.

![set azure ad administrator][2]

3. Click `Add Azure AD Admins` and select a valid Azure AD user / group /service principal/Managed Identity in the customer tenant to be Azure AD administrator.
4. Click Save,

> [!IMPORTANT]
> When setting the administrator, a new user is added to the Azure Database for PostgreSQL server with full administrator permissions. 



## Connecting to Azure Database for PostgreSQL using Azure AD

The following high-level diagram summarizes the workflow of using Azure AD authentication with Azure Database for PostgreSQL:

![authentication flow][1]

We've designed the Azure AD integration to work with common PostgreSQL tools like psql, which aren't Azure AD aware and only support specifying username and password when connecting to PostgreSQL. We pass the Azure AD token as the password as shown in the picture above.

We currently have tested the following clients:

- psql commandline (utilize the PGPASSWORD variable to pass the token, see step 3 for more information)
- Azure Data Studio (using the PostgreSQL extension)
- Other libpq based clients (for example, common application frameworks and ORMs)
- PgAdmin (uncheck connect now at server creation. See step 4 for more information)

These are the steps that a user/application will need to do authenticate with Azure AD described below:

### CLI Prerequisites

You can follow along in Azure Cloud Shell, an Azure VM, or on your local machine. Make sure you have the [Azure CLI installed](/cli/azure/install-azure-cli).

## Authenticate with Azure AD as a Flexible user

### Step 1: Log in to the user's Azure subscription

Start by authenticating with Azure AD using the Azure CLI tool. This step isn't required in Azure Cloud Shell.

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

### Step 3: Use token as password for logging in with client psql

When connecting you need to use the access token as the PostgreSQL user password.

While using the `psql` command line client, the access token needs to be passed through the `PGPASSWORD` environment variable, since the access token exceeds the password length that `psql` can accept directly:

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
psql "host=mydb.postgres... user=user@tenant.onmicrosoft.com dbname=postgres sslmode=require"
```
### Step 4: Use token as a password for logging in with PgAdmin

To connect using Azure AD token with pgAdmin, you need to follow the next steps:
1. Uncheck the connect now option at server creation.
2. Enter your server details in the connection tab and save.
3. From the browser menu, select connect to the Azure Database for PostgreSQL Flexible server
4. Enter the AD token password when prompted.

Important considerations when connecting:

* `user@tenant.onmicrosoft.com` is the name of the Azure AD user 
* Make sure to use the exact way the Azure user is spelled - as the Azure AD user and group names are case sensitive.
* If the name contains spaces, use `\` before each space to escape it.
* The access token validity is anywhere between 5 minutes to 60 minutes. We recommend you get the access token just before initiating the login to Azure Database for PostgreSQL.

You're now authenticated to your Azure Database for PostgreSQL server using Azure AD authentication.

## Authenticate with Azure AD as a group member

### Step 1: Create Azure AD groups in Azure Database for PostgreSQL

To enable an Azure AD group for access to your database, use the same mechanism as for users, but instead specify the group name:

Example:

```
select * from pgaadauth_create_principal('Prod DB Readonly', false, false).
```

When logging in, members of the group will use their personal access tokens, but sign with the group name specified as the username.

> [!NOTE]
> PostgreSQL Flexible Servers supports Managed Identities as group members.

### Step 2: Log in to the user’s Azure Subscription

Authenticate with Azure AD using the Azure CLI tool. This step isn't required in Azure Cloud Shell. The user needs to be member of the Azure AD group.

```
az login
```

### Step 3: Retrieve Azure AD access token

Invoke the Azure CLI tool to acquire an access token for the Azure AD authenticated user from step 2 to access Azure Database for PostgreSQL.

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

### Step 4: Use token as password for logging in with psql or PgAdmin (see above steps for user connection)

Important considerations when connecting as a group member:
* groupname is the name of the Azure AD group you're trying to connect as
* Make sure to use the exact way the Azure AD group name is spelled.
* Azure AD user and group names are case sensitive
* When connecting as a group, use only the group name and not the alias of a group member.
* If the name contains spaces, use \ before each space to escape it.
* The access token validity is anywhere between 5 minutes to 60 minutes. We recommend you get the access token just before initiating the login to Azure Database for PostgreSQL.

You're now authenticated to your PostgreSQL server using Azure AD authentication.

## Next steps

* Review the overall concepts for [Azure Active Directory authentication with Azure Database for PostgreSQL - Flexible Server](concepts-azure-ad-authentication.md)
* Learn how to create and manage Azure AD enabled PostgreSQL roles [Manage Azure AD roles in Azure Database for PostgreSQL - Flexible Server](Manage Azure AD roles in Azure Database for PostgreSQL - Flexible Server.md)

<!--Image references-->

[1]: ./media/concepts-azure-ad-authentication/authentication-flow.png
[2]: ./media/concepts-azure-ad-authentication/set-azure-ad-admin.png
[3]: ./media/concepts-azure-ad-authentication/set-azure-ad-admin-server-creation.png
