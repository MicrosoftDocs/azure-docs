---
title: Use Azure Active Directory for authentication with Azure Database for PostgreSQL - Flexible Server
description: Learn how to set up Azure Active Directory (Azure AD) for authentication with Azure Database for PostgreSQL - Flexible Server.
author: kabharati
ms.author: kabharati
ms.reviewer: maghan
ms.date: 01/18/2023
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
---

# Use Azure AD for authentication with Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-Flexible-server](../includes/applies-to-postgresql-Flexible-server.md)]

In this article, you'll configure Azure Active Directory (Azure AD) access for authentication with Azure Database for PostgreSQL - Flexible Server. You'll also learn how to use an Azure AD token with Azure Database for PostgreSQL - Flexible Server.

You can configure Azure AD authentication for Azure Database for PostgreSQL - Flexible Server either during server provisioning or later. Only Azure AD administrator users can create or enable users for Azure AD-based authentication. We recommend not using the Azure AD administrator for regular database operations because that role has elevated user permissions (for example, CREATEDB).

You can have multiple Azure AD admin users with Azure Database for PostgreSQL - Flexible Server. Azure AD admin users can be a user, a group, or service principal.

## Prerequisites


**Configure network requirements**

Azure AD is a multitenant application. It requires outbound connectivity to perform certain operations, like adding Azure AD admin groups. Additionally, you need network rules for Azure AD connectivity to work, depending on your network topology:

- **Public access (allowed IP addresses)**: No extra network rules are required.
- **Private access (virtual network integration)**:

  - You need an outbound network security group (NSG) rule to allow virtual network traffic to only reach the `AzureActiveDirectory` service tag.
  - If you're using a route table, you need to create a rule with destination service tag `AzureActiveDirectory` and next hop `Internet`.
  - Optionally, if you're using a proxy, you can add a new firewall rule to allow HTTP/S traffic to reach only the `AzureActiveDirectory` service tag.

To set the Azure AD admin during server provisioning, follow these steps:

1. In the Azure portal, during server provisioning, select either **PostgreSQL and Azure Active Directory authentication** or **Azure Active Directory authentication only** as the authentication method.
1. On the **Set admin** tab, select a valid Azure AD user, group, service principal, or managed identity in the customer tenant to be the Azure AD administrator.

  You can optionally add a local PostgreSQL admin account if you prefer using the **PostgreSQL and Azure Active Directory authentication** method.

  > [!NOTE]  
  > You can add only one Azure admin user during server provisioning. You can add multiple Azure AD admin users after the Server is created.


  :::image type="content" source="media/how-to-configure-sign-in-Azure-ad-authentication/set-Azure-ad-admin-server-creation.png" alt-text="Screenshot that shows selections for setting an Azure AD admin during server provisioning.]":::


To set the Azure AD administrator after server creation, follow these steps:

1. In the Azure portal, select the instance of Azure Database for PostgreSQL - Flexible Server that you want to enable for Azure AD.
1. Under **Security**, select **Authentication**. Then choose either **PostgreSQL and Azure Active Directory authentication** or **Azure Active Directory authentication only** as the authentication method, based on your requirements.
1. Select **Add Azure AD Admins**. Then select a valid Azure AD user, group, service principal, or managed identity in the customer tenant to be an Azure AD administrator.
1. Select **Save**.

  :::image type="content" source="media/how-to-configure-sign-in-Azure-ad-authentication/set-Azure-ad-admin.png" alt-text="Screenshot that shows selections for setting an Azure AD admin after server creation.":::

> [!IMPORTANT]  
> When setting the administrator, a new user is added to Azure Database for PostgreSQL - Flexible Server with full administrator permissions.

## Connect to Azure Database for PostgreSQL by using Azure AD

The following high-level diagram summarizes the workflow of using Azure AD authentication with Azure Database for PostgreSQL:

  :::image type="content" source="media/how-to-configure-sign-in-Azure-ad-authentication/authentication-flow.png" alt-text="Diagram of authentication flow between Azure Active Directory, the user's computer, and the server.":::

Azure AD integration works with standard PostgreSQL tools like psql, which aren't Azure AD aware and support only specifying the username and password when you're connecting to PostgreSQL. As shown in the preceding diagram, the Azure AD token is passed as the password.

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

Use the Azure CLI to acquire an access token for the Azure AD authenticated user to access Azure Database for PostgreSQL. Here's an example of the public cloud:

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

When connecting, it's best to use the access token as the PostgreSQL user password.

While using the psql command-line client, the access token needs to be passed through the `PGPASSWORD` environment variable. The reason is that the access token exceeds the password length that psql can accept directly.

Here's a Windows example:

```cmd
set PGPASSWORD=<copy/pasted TOKEN value from step 2>
```

```powerShell
$env:PGPASSWORD='<copy/pasted TOKEN value from step 2>'
```

Here's a Linux/macOS example:

```bash
export PGPASSWORD=<copy/pasted TOKEN value from step 2>
```

You can also combine step 2 and step 3 together using command substitution. The token retrieval can be encapsulated into a variable and passed directly as a value for `PGPASSWORD` environment variable:

```bash
export PGPASSWORD=$(az account get-access-token --resource-type oss-rdbms --query "[accessToken]" -o tsv)
```

Now you can initiate a connection with Azure Database for PostgreSQL as you usually would:

```sql
psql "host=mydb.postgres... user=user@tenant.onmicrosoft.com dbname=postgres sslmode=require"
```

### Use a token as a password for signing in with PgAdmin

To connect by using an Azure AD token with PgAdmin, follow these steps:

1. Clear the **Connect now** option at server creation.
1. Enter your server details on the **Connection** tab and save.
1. From the browser menu, select **Connect to Azure Database for PostgreSQL - Flexible Server**.
1. Enter the Active Directory token password when you're prompted.

Here are some essential considerations when you're connecting:

- `user@tenant.onmicrosoft.com` is the name of the Azure AD user.
- Be sure to use the exact way the Azure user is spelled. Azure AD user and group names are case-sensitive.
- If the name contains spaces, use a backslash (`\`) before each space to escape it.
- The access token's validity is 5 minutes to 60 minutes. You should get the access token before initiating the sign-in to Azure Database for PostgreSQL.

You're now authenticated to your Azure Database for PostgreSQL server through Azure AD authentication.

## Authenticate with Azure AD as a group member

### Create Azure AD groups in Azure Database for PostgreSQL - Flexible Server

To enable an Azure AD group to access your database, use the same mechanism you used for users, but specify the group name instead. For example:

```sql
select * from  pgaadauth_create_principal('Prod DB Readonly', false, false).
```

When group members sign in, they use their access tokens but specify the group name as the username.

> [!NOTE]  
> Azure Database for PostgreSQL - Flexible Server supports managed identities as group members.

### Sign in to the user's Azure subscription

Authenticate with Azure AD by using the Azure CLI. This step isn't required in Azure Cloud Shell. The user needs to be a member of the Azure AD group.

```azurecli-interactive
az login
```

### Retrieve the Azure AD access token

Use the Azure CLI to acquire an access token for the Azure AD authenticated user to access Azure Database for PostgreSQL. Here's an example of the public cloud:

```azurecli-interactive
az account get-access-token --resource https://ossrdbms-aad.database.windows.net
```

You must specify the initial resource value exactly as shown. For other clouds, you can look up the resource value by using the following command:

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

These considerations are essential when you're connecting as a group member:

- The group name is the name of the Azure AD group that you're trying to connect.
- Be sure to use the exact way the Azure AD group name is spelled. Azure AD user and group names are case-sensitive.
- When you're connecting as a group, use only the group name and not the alias of a group member.
- If the name contains spaces, use a backslash (`\`) before each space to escape it.
- The access token's validity is 5 minutes to 60 minutes. We recommend you get the access token before initiating the sign-in to Azure Database for PostgreSQL.

You're now authenticated to your PostgreSQL server through Azure AD authentication.

## Next steps

- Review the overall concepts for [Azure AD authentication with Azure Database for PostgreSQL - Flexible Server](concepts-azure-ad-authentication.md).
- Learn how to [Manage Azure Active Directory users - Azure Database for PostgreSQL - Flexible Server](how-to-manage-azure-ad-users.md).
