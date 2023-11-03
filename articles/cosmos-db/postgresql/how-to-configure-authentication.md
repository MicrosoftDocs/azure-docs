---
title: Use Microsoft Entra ID and native PostgreSQL roles for authentication with Azure Cosmos DB for PostgreSQL
description: Learn how to set up Microsoft Entra ID and add native PostgreSQL roles for authentication with Azure Cosmos DB for PostgreSQL
author: niklarin
ms.author: nlarin
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: how-to
ms.date: 09/19/2023
---

# Use Microsoft Entra ID and native PostgreSQL roles for authentication with Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

> [!IMPORTANT]
> Microsoft Entra authentication in Azure Cosmos DB for PostgreSQL is currently in preview.
> This preview version is provided without a service level agreement, and it's not recommended
> for production workloads. Certain features might not be supported or might have constrained 
> capabilities.
>
> You can see a complete list of other new features in [preview features](product-updates.md#features-in-preview).

In this article, you configure authentication methods for Azure Cosmos DB for PostgreSQL. You manage Microsoft Entra admin users and native PostgreSQL roles for authentication with Azure Cosmos DB for PostgreSQL. You also learn how to use a Microsoft Entra token with Azure Cosmos DB for PostgreSQL.

An Azure Cosmos DB for PostgreSQL cluster is created with one built-in native PostgreSQL role named 'citus'. You can add more native PostgreSQL roles after cluster provisioning is completed. 

You can also configure Microsoft Entra authentication for Azure Cosmos DB for PostgreSQL. You can enable Microsoft Entra authentication in addition or instead of the native PostgreSQL authentication on your cluster. You can change authentication methods enabled on cluster at any point after the cluster is provisioned. When Microsoft Entra authentication is enabled, you can add multiple Microsoft Entra users to an Azure Cosmos DB for PostgreSQL cluster and make any of them administrators. Microsoft Entra user can be a user or a service principal.

## Choose authentication method
You need to use Azure portal to configure authentication methods on an Azure Cosmos DB for PostgreSQL cluster.

Complete the following items on your Azure Cosmos DB for PostgreSQL cluster to enable or disable Microsoft Entra authentication and native PostgreSQL authentication.

1. On the cluster page, under the **Cluster management** heading, choose **Authentication** to open authentication management options.
1. In **Authentication methods** section, choose **PostgreSQL authentication only**, **Microsoft Entra authentication (preview)**, or **PostgreSQL and Microsoft Entra authentication (preview)** as the authentication method based on your requirements.

Once done proceed with [configuring Microsoft Entra authentication](#configure-azure-active-directory-authentication) or [adding native PostgreSQL roles](#configure-native-postgresql-authentication) on **Authentication** page.

<a name='configure-azure-active-directory-authentication'></a>

## Configure Microsoft Entra authentication

To add or remove Microsoft Entra roles on cluster, follow these steps on **Authentication** page:

1. In **Microsoft Entra authentication (preview)** section, select **Add Microsoft Entra admins**. 
1. In **Select Microsoft Entra Admins** panel, select one or more valid Microsoft Entra user or enterprise application in the current AD tenant to be a Microsoft Entra administrator on your Azure Cosmos DB for PostgreSQL cluster.
1. Use **Select** to confirm your choice.
1. In the **Authentication** page, select **Save** in the toolbar to save changes or proceed with adding native PostgreSQL roles.
 
## Configure native PostgreSQL authentication

To add Postgres roles on cluster, follow these steps on **Authentication** page:

1. In **PostgreSQL authentication** section, select **Add PostgreSQL role**.
1. Enter the role name and password. Select **Save**.
1. In the **Authentication** page, select **Save** in the toolbar to save changes or proceed with adding Microsoft Entra admin users.

The native PostgreSQL user is created on the coordinator node of the cluster, and propagated to all the worker nodes. Roles created through the Azure portal have the LOGIN attribute, which means they’re true users who can sign in to the database.

<a name='connect-to-azure-cosmos-for-postgresql-by-using-azure-ad-authentication'></a>

## Connect to Azure Cosmos for PostgreSQL by using Microsoft Entra authentication

Microsoft Entra integration works with standard PostgreSQL client tools like **psql**, which aren't Microsoft Entra aware and support only specifying the username and password when you're connecting to PostgreSQL. In such cases, the Microsoft Entra token is passed as the password.

We've tested the following clients:

- **psql command line**: Use the `PGPASSWORD` variable to pass the token.
- **Other libpq-based clients**: Examples include common application frameworks and object-relational mappers (ORMs).
- **pgAdmin**: Clear **Connect now** at server creation.

Use the following procedures to authenticate with Microsoft Entra ID as an Azure Cosmos DB for PostgreSQL user. You can follow along in [Azure Cloud Shell](./../../cloud-shell/quickstart.md), on an Azure virtual machine, or on your local machine.

### Sign in to the user's Azure subscription

Start by authenticating with Microsoft Entra ID by using the Azure CLI. This step isn't required in Azure Cloud Shell.

```azurecli
az login
```

The command opens a browser window to the Microsoft Entra authentication page. It requires you to give your Microsoft Entra user ID and password.

<a name='retrieve-the-azure-ad-access-token'></a>

### Retrieve the Microsoft Entra access token

Use the Azure CLI to acquire an access token for the Microsoft Entra authenticated user to access Azure Cosmos for PostgreSQL. Here's an example:

```azurecli-interactive
az account get-access-token --resource https://postgres.cosmos.azure.com
```

After authentication is successful, Microsoft Entra ID returns an access token for current Azure subscription:

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
> Make sure PGPASSWORD variable is set to the Microsoft Entra access token for your 
> subscription for Microsoft Entra authentication. If you need to do Postgres role authentication 
> from the same session you can set PGPASSWORD to the Postgres role password 
> or clear the PGPASSWORD variable value to enter the password interactively. 
> Authentication would fail with the wrong value in PGPASSWORD.

Now you can initiate a connection with Azure Cosmos DB for PostgreSQL as you usually would (without 'password' parameter in the command line):

```sql
psql "host=mycluster.[uniqueID].postgres.cosmos.azure.com user=user@tenant.onmicrosoft.com dbname=[db_name] sslmode=require"
```

### Use a token as a password for signing in with PgAdmin

To connect by using a Microsoft Entra token with PgAdmin, follow these steps:

1. Clear the **Connect now** option at server creation.
1. Enter your server details on the **Connection** tab and save.
    1. Make sure a valid Microsoft Entra user is specified in **Username**.
1. From the pgAdmin **Object** menu, select **Connect Server**.
1. Enter the Active Directory token password when you're prompted.

Here are some essential considerations when you're connecting:

- `user@tenant.onmicrosoft.com` is the name of the Microsoft Entra user.
- Be sure to use the exact way the Azure user is spelled. Microsoft Entra user and group names are case-sensitive.
- If the name contains spaces, use a backslash (`\`) before each space to escape it.
- The access token's validity is 5 minutes to 90 minutes. You should get the access token before initiating the sign-in to Azure Cosmos for PostgreSQL.

You're now authenticated to your Azure Cosmos for PostgreSQL server through Microsoft Entra authentication.

## Manage native PostgreSQL roles

When native PostgreSQL authentication is enabled on cluster, you can add and delete Postgres roles in addition to built-in 'citus' role. You can also reset password and modify Postgres privileges for native roles.

### How to delete a native PostgreSQL user role or change their password

To update a user, visit the **Authentication** page for your cluster,
and select the ellipses **...** next to the user. The ellipses open a menu
to delete the user or reset their password.

The `citus` role is privileged and can't be deleted. However, `citus` role would be disabled, if 'Microsoft Entra authentication only' authentication method is selected for the cluster.

## How to modify privileges for user roles

New user roles are commonly used to provide database access with restricted
privileges. To modify user privileges, use standard PostgreSQL commands, using
a tool such as PgAdmin or psql. For more information, see [Connect to a cluster](quickstart-connect-psql.md).

For example, to allow PostgreSQL `db_user` to read `mytable`, grant the permission:

```sql
GRANT SELECT ON mytable TO db_user;
```

To grant the same permissions to Microsoft Entra role `user@tenant.onmicrosoft.com` use the following command: 

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

Or for Microsoft Entra role

```sql
-- applies to the coordinator node and propagates to worker nodes for Azure AD role user@tenant.onmicrosoft.com
GRANT SELECT ON ALL TABLES IN SCHEMA public TO "user@tenant.onmicrosoft.com";
```


## Next steps

- Learn about [authentication in Azure Cosmos DB for PostgreSQL](./concepts-authentication.md)
- Check out [Microsoft Entra ID limits and limitations in Azure Cosmos DB for PostgreSQL](./reference-limits.md#azure-active-directory-authentication)
- Review [Microsoft Entra fundamentals](./../../active-directory/fundamentals/active-directory-whatis.md)
- [Learn more about SQL GRANT in PostgreSQL](https://www.postgresql.org/docs/current/sql-grant.html)
