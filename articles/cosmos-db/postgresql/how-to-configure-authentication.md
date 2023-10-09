---
title: Use Azure Active Directory and native PostgreSQL roles for authentication with Azure Cosmos DB for PostgreSQL
description: Learn how to set up Azure Active Directory (Azure AD) and add native PostgreSQL roles for authentication with Azure Cosmos DB for PostgreSQL
author: niklarin
ms.author: nlarin
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: how-to
ms.date: 09/19/2023
---

# Use Azure Active Directory and native PostgreSQL roles for authentication with Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

> [!IMPORTANT]
> Azure Active Directory authentication in Azure Cosmos DB for PostgreSQL is currently in preview.
> This preview version is provided without a service level agreement, and it's not recommended
> for production workloads. Certain features might not be supported or might have constrained 
> capabilities.
>
> You can see a complete list of other new features in [preview features](product-updates.md#features-in-preview).

In this article, you configure authentication methods for Azure Cosmos DB for PostgreSQL. You manage Azure Active Directory (Azure AD) admin users and native PostgreSQL roles for authentication with Azure Cosmos DB for PostgreSQL. You also learn how to use an Azure AD token with Azure Cosmos DB for PostgreSQL.

An Azure Cosmos DB for PostgreSQL cluster is created with one built-in native PostgreSQL role named 'citus'. You can add more native PostgreSQL roles after cluster provisioning is completed. 

You can also configure Azure AD authentication for Azure Cosmos DB for PostgreSQL. You can enable Azure AD authentication in addition or instead of the native PostgreSQL authentication on your cluster. You can change authentication methods enabled on cluster at any point after the cluster is provisioned. When Azure Active Directory authentication is enabled, you can add multiple Azure AD users to an Azure Cosmos DB for PostgreSQL cluster and make any of them administrators. Azure AD user can be a user or a service principal.

## Choose authentication method
You need to use Azure portal to configure authentication methods on an Azure Cosmos DB for PostgreSQL cluster.

Complete the following items on your Azure Cosmos DB for PostgreSQL cluster to enable or disable Azure Active Directory authentication and native PostgreSQL authentication.

1. On the cluster page, under the **Cluster management** heading, choose **Authentication** to open authentication management options.
1. In **Authentication methods** section, choose **PostgreSQL authentication only**, **Azure Active Directory authentication (preview)**, or **PostgreSQL and Azure Active Directory authentication (preview)** as the authentication method based on your requirements.

Once done proceed with [configuring Azure Active Directory authentication](#configure-azure-active-directory-authentication) or [adding native PostgreSQL roles](#configure-native-postgresql-authentication) on **Authentication** page.

## Configure Azure Active Directory authentication

To add or remove Azure AD roles on cluster, follow these steps on **Authentication** page:

1. In **Azure Active Directory (Azure AD) authentication (preview)** section, select **Add Azure AD admins**. 
1. In **Select Azure AD Admins** panel, select one or more valid Azure AD user or enterprise application in the current AD tenant to be an Azure AD administrator on your Azure Cosmos DB for PostgreSQL cluster.
1. Use **Select** to confirm your choice.
1. In the **Authentication** page, select **Save** in the toolbar to save changes or proceed with adding native PostgreSQL roles.
 
## Configure native PostgreSQL authentication

To add Postgres roles on cluster, follow these steps on **Authentication** page:

1. In **PostgreSQL authentication** section, select **Add PostgreSQL role**.
1. Enter the role name and password. Select **Save**.
1. In the **Authentication** page, select **Save** in the toolbar to save changes or proceed with adding Azure Active Directory admin users.

The native PostgreSQL user is created on the coordinator node of the cluster, and propagated to all the worker nodes. Roles created through the Azure portal have the LOGIN attribute, which means they’re true users who can sign in to the database.

## Connect to Azure Cosmos for PostgreSQL by using Azure AD authentication

Azure AD integration works with standard PostgreSQL client tools like **psql**, which aren't Azure AD aware and support only specifying the username and password when you're connecting to PostgreSQL. In such cases, the Azure AD token is passed as the password.

We've tested the following clients:

- **psql command line**: Use the `PGPASSWORD` variable to pass the token.
- **Other libpq-based clients**: Examples include common application frameworks and object-relational mappers (ORMs).
- **pgAdmin**: Clear **Connect now** at server creation.

Use the following procedures to authenticate with Azure AD as an Azure Cosmos DB for PostgreSQL user. You can follow along in [Azure Cloud Shell](./../../cloud-shell/quickstart.md), on an Azure virtual machine, or on your local machine.

### Sign in to the user's Azure subscription

Start by authenticating with Azure AD by using the Azure CLI. This step isn't required in Azure Cloud Shell.

```azurecli
az login
```

The command opens a browser window to the Azure AD authentication page. It requires you to give your Azure AD user ID and password.

### Retrieve the Azure AD access token

Use the Azure CLI to acquire an access token for the Azure AD authenticated user to access Azure Cosmos for PostgreSQL. Here's an example:

```azurecli-interactive
az account get-access-token --resource https://postgres.cosmos.azure.com
```

After authentication is successful, Azure AD returns an access token for current Azure subscription:

```json
{
  "accessToken": "[TOKEN]",
  "expiresOn": "[expiration_date_and_time]",
  "subscription": "[subscription_id]",
  "tenant": "[tenant_id]",
  "tokenType": "Bearer"
}
```

The TOKEN is a Base64 string. It encodes all the information about the authenticated user and is targeted to the Azure Cosmos DB for PostgreSQL service. The token is valid for at least 5 minutes with the maximum of 90 minutes. The expiresOn defines actual token expiration time.

### Use a token as a password for signing in with client psql

When connecting, it's best to use the access token as the PostgreSQL user password.

While using the psql command-line client, the access token needs to be passed through the `PGPASSWORD` environment variable. The reason is that the access token exceeds the password length that psql can accept directly.

Here's a Windows example:

```cmd
set PGPASSWORD=<TOKEN value from the previous step>
```

```powerShell
$env:PGPASSWORD='<TOKEN value from from the previous step>'
```

Here's a Linux/macOS example:

```bash
export PGPASSWORD=<TOKEN value from the previous step>
```

You can also combine the previous two steps together using command substitution. The token retrieval can be encapsulated into a variable and passed directly as a value for `PGPASSWORD` environment variable:

```bash
export PGPASSWORD=$(az account get-access-token --resource-type oss-rdbms --query "[accessToken]" -o tsv)
```


> [!NOTE]
> Make sure PGPASSWORD variable is set to the Azure AD access token for your 
> subscription for Azure AD authentication. If you need to do Postgres role authentication 
> from the same session you can set PGPASSWORD to the Postgres role password 
> or clear the PGPASSWORD variable value to enter the password interactively. 
> Authentication would fail with the wrong value in PGPASSWORD.

Now you can initiate a connection with Azure Cosmos DB for PostgreSQL as you usually would (without 'password' parameter in the command line):

```sql
psql "host=mycluster.[uniqueID].postgres.cosmos.azure.com user=user@tenant.onmicrosoft.com dbname=[db_name] sslmode=require"
```

### Use a token as a password for signing in with PgAdmin

To connect by using an Azure AD token with PgAdmin, follow these steps:

1. Clear the **Connect now** option at server creation.
1. Enter your server details on the **Connection** tab and save.
    1. Make sure a valid Azure AD user is specified in **Username**.
1. From the pgAdmin **Object** menu, select **Connect Server**.
1. Enter the Active Directory token password when you're prompted.

Here are some essential considerations when you're connecting:

- `user@tenant.onmicrosoft.com` is the name of the Azure AD user.
- Be sure to use the exact way the Azure user is spelled. Azure AD user and group names are case-sensitive.
- If the name contains spaces, use a backslash (`\`) before each space to escape it.
- The access token's validity is 5 minutes to 90 minutes. You should get the access token before initiating the sign-in to Azure Cosmos for PostgreSQL.

You're now authenticated to your Azure Cosmos for PostgreSQL server through Azure AD authentication.

## Manage native PostgreSQL roles

When native PostgreSQL authentication is enabled on cluster, you can add and delete Postgres roles in addition to built-in 'citus' role. You can also reset password and modify Postgres privileges for native roles.

### How to delete a native PostgreSQL user role or change their password

To update a user, visit the **Authentication** page for your cluster,
and select the ellipses **...** next to the user. The ellipses open a menu
to delete the user or reset their password.

The `citus` role is privileged and can't be deleted. However, `citus` role would be disabled, if 'Azure Active Directory authentication only' authentication method is selected for the cluster.

## How to modify privileges for user roles

New user roles are commonly used to provide database access with restricted
privileges. To modify user privileges, use standard PostgreSQL commands, using
a tool such as PgAdmin or psql. For more information, see [Connect to a cluster](quickstart-connect-psql.md).

For example, to allow PostgreSQL `db_user` to read `mytable`, grant the permission:

```sql
GRANT SELECT ON mytable TO db_user;
```

To grant the same permissions to Azure AD role `user@tenant.onmicrosoft.com` use the following command: 

```sql
GRANT SELECT ON mytable TO "user@tenant.onmicrosoft.com";
```

Azure Cosmos DB for PostgreSQL propagates single-table GRANT statements through the entire
cluster, applying them on all worker nodes. It also propagates GRANTs that are
system-wide (for example, for all tables in a schema):

```sql
-- applies to the coordinator node and propagates to worker nodes for Postgres role db_user
GRANT SELECT ON ALL TABLES IN SCHEMA public TO db_user;
```

Or for Azure AD role

```sql
-- applies to the coordinator node and propagates to worker nodes for Azure AD role user@tenant.onmicrosoft.com
GRANT SELECT ON ALL TABLES IN SCHEMA public TO "user@tenant.onmicrosoft.com";
```


## Next steps

- Learn about [authentication in Azure Cosmos DB for PostgreSQL](./concepts-authentication.md)
- Check out [Azure AD limits and limitations in Azure Cosmos DB for PostgreSQL](./reference-limits.md#azure-active-directory-authentication)
- Review [Azure Active Directory fundamentals](./../../active-directory/fundamentals/active-directory-whatis.md)
- [Learn more about SQL GRANT in PostgreSQL](https://www.postgresql.org/docs/current/sql-grant.html)
