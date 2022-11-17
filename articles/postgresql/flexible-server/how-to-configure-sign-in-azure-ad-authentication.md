---
title: Use Azure Active Directory for authentication with Azure Database for PostgreSQL - Flexible Server
description: Learn how to set up Azure Active Directory (Azure AD) for authentication with Azure Database for PostgreSQL - Flexible Server.
author: kabharati
ms.author: kabharati
ms.reviewer: maghan
ms.date: 11/04/2022
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
---

# Use Azure AD for authentication with Azure Database for PostgreSQL - Flexible Server (preview)

[!INCLUDE [applies-to-postgresql-Flexible-server](../includes/applies-to-postgresql-Flexible-server.md)]

In this article, you'll configure Azure Active Directory (Azure AD) access for authentication with Azure Database for PostgreSQL - Flexible Server. You'll also learn how use an Azure AD token with Azure Database for PostgreSQL - Flexible Server.

> [!NOTE]  
> Azure Active Directory authentication for Azure Database for PostgreSQL - Flexible Server is currently in preview.

You can configure Azure AD authentication for Azure Database for PostgreSQL - Flexible Server either during server provisioning or later. Only Azure AD administrator users can create or enable users for Azure AD-based authentication. We recommend not using the Azure AD administrator for regular database operations, because that role has elevated user permissions (for example, CREATEDB). 

You can now have multiple Azure AD admin users with Flexible Server. Azure AD admin users can be either a user, a group, or a service principal.

## Install the Azure AD PowerShell module

### Prerequisites

- An Azure account with an active subscription. If you don't already have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, Privileged Role Administrator, Tenant Administrator.

The following steps are mandatory to use Azure AD authentication with Azure Database for PostgreSQL - Flexible Server.

### Connect to the user's tenant

```powershell
Connect-AzureAD -TenantId <customer tenant id>
```

### Grant read access

Grant Azure Database for PostgreSQL - Flexible Server Service Principal read access to a customer tenant to request Graph API tokens for Azure AD validation tasks:

```powershell
New-AzureADServicePrincipal -AppId 5657e26c-cc92-45d9-bc47-9da6cfdb4ed9
```

In the preceding command, `5657e26c-cc92-45d9-bc47-9da6cfdb4ed9` is the app ID for Azure Database for PostgreSQL - Flexible Server service.

### Configure network requirements

Azure AD is a multitenant application. It requires outbound connectivity to perform certain operations like adding Azure AD admin groups. Additionally, you need network rules for Azure AD connectivity to work, depending on your network topology:

- `Public access (allowed IP addresses)`: No extra network rules are required.
- `Private access (VNet Integration)`:

  - An outbound network security group (NSG) rule to allow virtual network traffic to reach the `AzureActiveDirectory` service tag only.
  - Optionally, if you're using a proxy, add a new firewall rule to allow HTTP/S traffic to reach the `AzureActiveDirectory` service tag only.

To set the Azure AD admin during server provisioning, follow these steps:

1. In the Azure portal, during server provisioning, select either `PostgreSQL and Azure Active Directory authentication` or `Azure Active Directory authentication only` as the authentication method.
1. Set Azure AD Admin using `set admin` tab and select a valid Azure AD user/ group /service principal/Managed Identity in the customer tenant to be Azure AD administrator
1. You can also optionally add a local PostgreSQL admin account if you prefer `PostgreSQL and Azure Active Directory authentication` method.

Note only one Azure admin user can be added during server provisioning, and you can add multiple Azure AD admin users after server is created.

![set-Azure-ad-administrator][3]

To set the Azure AD administrator after server creation,  follow these steps:

1. In the Azure portal, select the instance of Azure Database for PostgreSQL - Flexible Server that you want to enable for Azure AD.
1. Under Security, select Authentication and choose either `PostgreSQL and Azure Active Directory authentication` or `Azure Active Directory authentication only` as the authentication method based on your requirements.

   ![set Azure ad administrator][2]

1. Select `Add Azure AD Admins` and select a valid Azure AD user/group/service principal/Managed Identity in the customer tenant to be an Azure AD administrator.

1. Select **Save**.

> [!IMPORTANT]  
> When you're setting the administrator, a new user is added to the Azure Database for PostgreSQL - Flexible Server with full administrator permissions.

## Connect to Azure Database for PostgreSQL - Flexible Server by using Azure AD

The following high-level diagram summarizes the workflow of using Azure AD authentication with Azure Database for PostgreSQL:

![authentication flow][1]

We've designed the Azure AD integration to work with standard PostgreSQL tools like psql, which aren't Azure AD aware and only support specifying username and password when you're connecting to PostgreSQL. We pass the Azure AD token as the password, as shown in the preceding diagram.

We've tested the following clients:

- psql commandline (utilize the PGPASSWORD variable to pass the token, see step 3 for more information)
- Azure Data Studio (using the PostgreSQL extension)
- Other libpq based clients (for example, common application frameworks and ORMs)
- PgAdmin (uncheck connect now at server creation. For more information, see step 4.

These are the steps that a user or application needs to authenticate with Azure AD:

## Authenticate with Azure AD

Use the following procedures to authenticate with Azure AD as an Azure Database for PostgreSQL - Flexible Server user. You can follow along in Azure Cloud Shell, an Azure VM, or on your local machine. 

Make sure you have the [Azure CLI installed](/cli/azure/install-azure-cli).

### Sign in to the user's Azure subscription

Start by authenticating with Azure AD using the Azure CLI tool. This step isn't required in Azure Cloud Shell.

```azurecli-interactive
az login
```

The command launches a browser window to the Azure AD authentication page. It requires you to give your Azure AD user ID and password.

### Retrieve Azure AD access token

Invoke the Azure CLI tool to acquire an access token for the Azure AD authenticated user from step 1 to access Azure Database for PostgreSQL.

Example (for Public Cloud):

```azurecli-interactive
az account get-access-token --resource https://ossrdbms-aad.database.windows.net
```

The above resource value must be specified as shown. For other clouds, the resource value can be looked up using:

```azurecli-interactive
az cloud show
```

For Azure CLI version 2.0.71 and later, the command can be specified in the following more convenient version for all clouds:

```azurecli-interactive
az account get-access-token --resource-type oss-rdbms
```

After authentication is successful, Azure AD returns an access token:

```json
{
  "accessToken": "TOKEN",
  "expiresOn": "...",
  "subscription": "...",
  "tenant": "...",
  "tokenType": "Bearer"
}
```

The token is a Base 64 string that encodes all the information about the authenticated user and is targeted to the Azure Database for PostgreSQL service.

### Use token as password for logging in with client psql

When connecting, it's best to use the access token as the PostgreSQL user password.

While using the `psql` command line client, the access token needs to be passed through the `PGPASSWORD` environment variable since the access token exceeds the password length that `psql` can accept directly:

Windows Example:

```cmd
set PGPASSWORD=<copy/pasted TOKEN value from step 2>
```

```powerShell
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

### Use token as a password for logging in with PgAdmin

To connect using an Azure AD token with pgAdmin, you need to follow the next steps:
1. Uncheck the connect now an option at server creation.
1. Enter your server details in the connection tab and save.
1. From the browser menu, select connect to the Azure Database for PostgreSQL - Flexible Server
1. Enter the AD token password when prompted.

Essential considerations when connecting:

* `user@tenant.onmicrosoft.com` is the name of the Azure AD user
* Make sure to use the exact way the Azure user is spelled - as the Azure AD user and group names are case-sensitive.
* If the name contains spaces, use `\` before each space to escape it.
* The access token validity is anywhere between 5 minutes to 60 minutes. We recommend you get the access token just before initiating the sign-in to Azure Database for PostgreSQL.

You're now authenticated to your Azure Database for PostgreSQL server using Azure AD authentication.

## Authenticate with Azure AD as a group member

### Create Azure AD groups in Azure Database for PostgreSQL - Flexible Server

To enable an Azure AD group for access to your database, use the exact mechanism as for users, but instead specify the group name. For example:

```
select * from pgAzure ADauth_create_principal('Prod DB Readonly', false, false).
```

When group members log in, they use their personal access tokens but sign in with the group name specified as the username.

> [!NOTE]  
> Azure Database for PostgreSQL - Flexible Server supports managed identities as group members.

### Sign in to the user's Azure subscription

Authenticate with Azure AD by using the Azure CLI. This step isn't required in Azure Cloud Shell. The user needs to be a member of the Azure AD group.

```
az login
```

### Retrieve the Azure AD access token

Invoke the Azure CLI to acquire an access token for the Azure AD authenticated user from step 2 to access Azure Database for PostgreSQL.For example (public cloud):

```azurecli-interactive
az account get-access-token --resource https://ossrdbms-aad.database.windows.net
```

You must specify the preceding resource value exactly as shown. For other clouds, you can look up the resource value by using the following command:

```azurecli-interactive
az cloud show
```

For Azure CLI version 2.0.71 and later, you can specify the command in the following (more convenient) version for all clouds:

```azurecli-interactive
az account get-access-token --resource-type oss-rdbms
```

After authentication is successful, Azure AD returns an access token:

```json
{
  "accessToken": "TOKEN",
  "expiresOn": "...",
  "subscription": "...",
  "tenant": "...",
  "tokenType": "Bearer"
}
```

### Use token as password for logging in with psql or PgAdmin

Important considerations when connecting as a group member:

- groupname is the name of the Azure AD group you're trying to connect as
- Make sure to use the exact way the Azure AD group name is spelled.
- Azure AD user and group names are case-sensitive
- When connecting as a group, use only the group name and not the alias of a group member.
- If the name contains spaces, use \ before each space to escape it.
- The access token validity is anywhere between 5 minutes to 60 minutes. We recommend you get the access token just before initiating the sign-in to Azure Database for PostgreSQL.

You're now authenticated to your PostgreSQL server using Azure AD authentication.

## Next steps

- Review the overall concepts for [Azure Active Directory authentication with Azure Database for PostgreSQL - Flexible Server](concepts-azure-ad-authentication.md)
- Learn how to create and manage Azure AD enabled PostgreSQL roles [Manage Azure AD roles in Azure Database for PostgreSQL - Flexible Server](how-to-create-users.md)

<!--Image references-->

[1]: ./media/concepts-azure-ad-authentication/authentication-flow.png
[2]: ./media/concepts-azure-ad-authentication/set-azure-ad-admin.png
[3]: ./media/concepts-azure-ad-authentication/set-azure-ad-admin-server-creation.png
