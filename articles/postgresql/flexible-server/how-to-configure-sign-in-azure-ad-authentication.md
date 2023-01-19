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

In this article, you'll configure Azure Active Directory (Azure AD) access for authentication with Azure Database for PostgreSQL - Flexible Server. You'll also learn how to use an Azure AD token with Azure Database for PostgreSQL - Flexible Server.

> [!NOTE]  
> Azure Active Directory authentication for Azure Database for PostgreSQL - Flexible Server is currently in preview.

You can configure Azure AD authentication for Azure Database for PostgreSQL - Flexible Server either during server provisioning or later. Only Azure AD administrator users can create or enable users for Azure AD-based authentication. We recommend not using the Azure AD administrator for regular database operations, because that role has elevated user permissions (for example, CREATEDB). 

You can have multiple Azure AD admin users with Azure Database for PostgreSQL - Flexible Server. Azure AD admin users can be a user, a group, or a service principal.

## Prerequisites

- An Azure account with an active subscription. If you don't already have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, Privileged Role Administrator, Tenant Administrator.
- Installation of the [Azure CLI](/cli/azure/install-azure-cli).

## Install the Azure AD PowerShell module

The following steps are mandatory to use Azure AD authentication with Azure Database for PostgreSQL - Flexible Server.

### Connect to the user's tenant

```powershell
Connect-AzureAD -TenantId <customer tenant id>
```

### Grant read access

Grant Azure Database for PostgreSQL - Flexible Server Service Principal read access to a customer tenant, to request Graph API tokens for Azure AD validation tasks:

```powershell
New-AzureADServicePrincipal -AppId 5657e26c-cc92-45d9-bc47-9da6cfdb4ed9
```

In the preceding command, `5657e26c-cc92-45d9-bc47-9da6cfdb4ed9` is the app ID for Azure Database for PostgreSQL - Flexible Server.

### Configure network requirements

Azure AD is a multitenant application. It requires outbound connectivity to perform certain operations, like adding Azure AD admin groups. Additionally, you need network rules for Azure AD connectivity to work, depending on your network topology:

- **Public access (allowed IP addresses)**: No extra network rules are required.
- **Private access (virtual network integration)**:

  - You need an outbound network security group (NSG) rule to allow virtual network traffic to reach the `AzureActiveDirectory` service tag only.
  - Optionally, if you're using a proxy, you can add a new firewall rule to allow HTTP/S traffic to reach the `AzureActiveDirectory` service tag only.

To set the Azure AD admin during server provisioning, follow these steps:

1. In the Azure portal, during server provisioning, select either **PostgreSQL and Azure Active Directory authentication** or **Azure Active Directory authentication only** as the authentication method.
1. On the **Set admin** tab, select a valid Azure AD user, group, service principal, or managed identity in the customer tenant to be the Azure AD administrator.
 
   You can optionally add a local PostgreSQL admin account if you prefer using the **PostgreSQL and Azure Active Directory authentication** method.

   > [!NOTE]
   > You can add only one Azure admin user during server provisioning. You can add multiple Azure AD admin users after the server is created.

![Screenshot that shows selections for setting an Azure AD admin during server provisioning.][3]

To set the Azure AD administrator after server creation, follow these steps:

1. In the Azure portal, select the instance of Azure Database for PostgreSQL - Flexible Server that you want to enable for Azure AD.
1. Under **Security**, select **Authentication**. Then choose either **PostgreSQL and Azure Active Directory authentication** or **Azure Active Directory authentication only** as the authentication method, based on your requirements.
1. Select **Add Azure AD Admins**. Then select a valid Azure AD user, group, service principal, or managed identity in the customer tenant to be an Azure AD administrator.
1. Select **Save**.

![Screenshot that shows selections for setting an Azure AD admin after server creation.][2]

> [!IMPORTANT]  
> When you're setting the administrator, a new user is added to Azure Database for PostgreSQL - Flexible Server with full administrator permissions.

## Connect to Azure Database for PostgreSQL by using Azure AD

The following high-level diagram summarizes the workflow of using Azure AD authentication with Azure Database for PostgreSQL:

![Diagram of authentication flow between Azure Active Directory, the user's computer, and the server.][1]

Azure AD integration works with standard PostgreSQL tools like psql, which aren't Azure AD aware and support only specifying the username and password when you're connecting to PostgreSQL. The Azure AD token is passed as the password, as shown in the preceding diagram.

We've tested the following clients:

- **psql command line**: Use the `PGPASSWORD` variable to pass the token.
- **Azure Data Studio**: Use the PostgreSQL extension.
- **Other libpq-based clients**: Examples include common application frameworks and object-relational mappers (ORMs).
- **PgAdmin**: Clear **Connect now** at server creation.

## Authenticate with Azure AD

Use the following procedures to authenticate with Azure AD as an Azure Database for PostgreSQL - Flexible Server user. You can follow along in Azure Cloud Shell, on an Azure virtual machine, or on your local machine. 

### Sign in to the user's Azure subscription

Start by authenticating with Azure AD by using the Azure CLI. This step isn't required in Azure Cloud Shell.

```azurecli-interactive
az login
```

The command opens a browser window to the Azure AD authentication page. It requires you to give your Azure AD user ID and password.

### Retrieve the Azure AD access token

Use the Azure CLI to acquire an access token for the Azure AD authenticated user to access Azure Database for PostgreSQL. Here's an example for the public cloud:

```azurecli-interactive
az account get-access-token --resource https://ossrdbms-aad.database.windows.net
```

The preceding resource value must be specified as shown. For other clouds, you can look up the resource value by using the following command:

```azurecli-interactive
az cloud show
```

For Azure CLI version 2.0.71 and later, you can specify the command in the following convenient version for all clouds:

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

The token is a Base64 string. It encodes all the information about the authenticated user and is targeted to the Azure Database for PostgreSQL service.

### Use a token as a password for signing in with client psql

When you're connecting, it's best to use the access token as the PostgreSQL user password.

While you're using the psql command-line client, the access token needs to be passed through the `PGPASSWORD` environment variable. The reason is that the access token exceeds the password length that psql can accept directly.

Here's a Windows example:

```cmd
set PGPASSWORD=<copy/pasted TOKEN value from step 2>
```

```powerShell
$env:PGPASSWORD='<copy/pasted TOKEN value from step 2>'
```

Here's a Linux/macOS example:

```shell
export PGPASSWORD=<copy/pasted TOKEN value from step 2>
```

You can also combine step 2 and step 3 together using command substitution. The token retrieval can be encapsulated into a variable and passed directly as a value for `PGPASSWORD` environment variable:

```shell
export PGPASSWORD=$(az account get-access-token --resource-type oss-rdbms --query "[accessToken]" -o tsv)
```


Now you can initiate a connection with Azure Database for PostgreSQL as you normally would:

```shell
psql "host=mydb.postgres... user=user@tenant.onmicrosoft.com dbname=postgres sslmode=require"
```

### Use a token as a password for signing in with PgAdmin

To connect by using an Azure AD token with PgAdmin, follow these steps:

1. Clear the **Connect now** option at server creation.
1. Enter your server details on the **Connection** tab and save.
1. From the browser menu, select **Connect to Azure Database for PostgreSQL - Flexible Server**.
1. Enter the Active Directory token password when you're prompted.

Here are some essential considerations when you're connecting:

* `user@tenant.onmicrosoft.com` is the name of the Azure AD user.
* Be sure to use the exact way that the Azure user is spelled. Azure AD user and group names are case-sensitive.
* If the name contains spaces, use a backslash (`\`) before each space to escape it.
* The access token's validity is 5 minutes to 60 minutes. We recommend that you get the access token just before you initiate the sign-in to Azure Database for PostgreSQL.

You're now authenticated to your Azure Database for PostgreSQL server through Azure AD authentication.

## Authenticate with Azure AD as a group member

### Create Azure AD groups in Azure Database for PostgreSQL - Flexible Server

To enable an Azure AD group for access to your database, use the same mechanism that you used for users, but instead specify the group name. For example:

```
select * from pgAzure ADauth_create_principal('Prod DB Readonly', false, false).
```

When group members sign in, they use their personal access tokens but specify the group name as the username.

> [!NOTE]  
> Azure Database for PostgreSQL - Flexible Server supports managed identities as group members.

### Sign in to the user's Azure subscription

Authenticate with Azure AD by using the Azure CLI. This step isn't required in Azure Cloud Shell. The user needs to be a member of the Azure AD group.

```
az login
```

### Retrieve the Azure AD access token

Use the Azure CLI to acquire an access token for the Azure AD authenticated user to access Azure Database for PostgreSQL. Here's an example for the public cloud:

```azurecli-interactive
az account get-access-token --resource https://ossrdbms-aad.database.windows.net
```

You must specify the preceding resource value exactly as shown. For other clouds, you can look up the resource value by using the following command:

```azurecli-interactive
az cloud show
```

For Azure CLI version 2.0.71 and later, you can specify the command in the following convenient version for all clouds:

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

### Use a token as a password for signing in with psql or PgAdmin

These considerations are important when you're connecting as a group member:

- The group name is the name of the Azure AD group that you're trying to connect as.
- Be sure to use the exact way that the Azure AD group name is spelled. Azure AD user and group names are case-sensitive.
- When you're connecting as a group, use only the group name and not the alias of a group member.
- If the name contains spaces, use a backslash (`\`) before each space to escape it.
- The access token's validity is 5 minutes to 60 minutes. We recommend that you get the access token just before you initiate the sign-in to Azure Database for PostgreSQL.

You're now authenticated to your PostgreSQL server through Azure AD authentication.

## Next steps

- Review the overall concepts for [Azure AD authentication with Azure Database for PostgreSQL - Flexible Server](concepts-azure-ad-authentication.md).
- Learn how to [manage Azure AD roles in Azure Database for PostgreSQL - Flexible Server](how-to-create-users.md).

<!--Image references-->

[1]: ./media/concepts-azure-ad-authentication/authentication-flow.png
[2]: ./media/concepts-azure-ad-authentication/set-azure-ad-admin.png
[3]: ./media/concepts-azure-ad-authentication/set-azure-ad-admin-server-creation.png
