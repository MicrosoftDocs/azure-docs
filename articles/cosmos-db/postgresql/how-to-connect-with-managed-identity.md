---
title: Connect with Managed Identity using Microsoft Entra ID in Azure Cosmos DB for PostgreSQL
description: Learn how to connect and authenticate using Managed Identity when Microsoft Entra ID authentication method is enabled on an Azure Cosmos DB for PostgreSQL cluster
author: niklarin
ms.author: nlarin
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: how-to
ms.date: 01/21/2024
---
# Connect with Managed Identity to Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

> [!IMPORTANT]
> Microsoft Entra ID (formerly Azure Active Directory) authentication in Azure Cosmos DB for PostgreSQL is currently in preview.
> This preview version is provided without a service level agreement, and it's not recommended
> for production workloads. Certain features might not be supported or might have constrained
> capabilities.
>
> You can see a complete list of other new features in [preview features](product-updates.md#features-in-preview).

You can use both system-assigned and user-assigned managed identities to authenticate to Azure Cosmos DB for PostgreSQL. This article shows you how to use a system-assigned managed identity for an Azure virtual machine (VM) to access an Azure Cosmos DB for PostgreSQL cluster. Managed identities are automatically managed by Azure and enable you to authenticate to services that support Microsoft Entra ID authentication without needing to insert credentials into your code.

You learn how to:
- Grant your VM access to an Azure Cosmos DB for PostgreSQL cluster
- Create a user in the database that represents the VM's system-assigned identity
- Get an access token using the VM identity and use it to query an Azure Cosmos DB for PostgreSQL cluster
- Implement the token retrieval in a C# example application

## Prerequisites

- If you're not familiar with the managed identities for Azure resources feature, see this [overview](/entra/identity/managed-identities-azure-resources/overview). If you don't have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before you continue.
- To do the required resource creation and role management, your account needs "Owner" permissions at the appropriate scope (your Azure subscription or resource group). If you need assistance with a role assignment, see [Assign Azure roles to manage access to your Azure subscription resources](../../role-based-access-control/role-assignments-portal.md).
- You need an Azure VM (for example, running Ubuntu Linux) that you'd like to use to access your database using managed identity.
- You need an Azure Cosmos DB for PostgreSQL cluster that has [Microsoft Entra ID authentication method](./how-to-configure-authentication.md#choose-authentication-method) configured.
- To follow the C# example, first, complete the guide on how to [connect with C#](./quickstart-app-stacks-csharp.md)

## Create a system-assigned managed identity for your VM

Use [az vm identity assign](/cli/azure/vm/identity/) with the `identity assign` command enables the system-assigned identity to an existing VM:

```azurecli-interactive
az vm identity assign -g myResourceGroup -n myVm
```

Retrieve the application ID for the system-assigned managed identity, which you'll need in the next few steps:

```azurecli
# Get the client ID (application ID) of the system-assigned managed identity

az ad sp list --display-name vm-name --query [*].appId --out tsv
```

The output of this command is the application ID. 

## Create a PostgreSQL user for your Managed Identity

Now, follow these steps to add the system-assigned managed identity to the list of Microsoft Entra ID accounts on your Azure Cosmos DB for PostgreSQL cluster. 

1. In [Azure portal](https://portal.azure.com), open **Authentication** page of your Azure Cosmos DB for PostgreSQL cluster.
1. In the **Azure Active Directory (AAD) authentication (preview)** section, select **Add Azure AD roles**.
1. In the **Select Azure AD roles** panel, enter application ID from the previous step in the **Search** field.
1. Select the VM's system-assigned managed identity in the search results. It has the application ID from the previous step in the **Details** column of the search results.
1. Use **Select** button to confirm your choice.
1. 1. In the **Authentication** page, select **Save** in the toolbar to save changes.

For more information on managing Microsoft Entra ID database roles, see [how to manage Microsoft Entra ID roles](./how-to-configure-authentication.md#configure-microsoft-entra-id-authentication).

The managed identity now has access when authenticating with the identity name as a role name and the Microsoft Entra ID token as a password.

## Retrieve the access token from the Azure Instance Metadata service

Your application can now retrieve an access token from the Azure Instance Metadata service and use it for authenticating with the database.

This token retrieval is done by making an HTTP request to `http://169.254.169.254/metadata/identity/oauth2/token` and passing the following parameters:

* `api-version` = `2018-02-01`
* `resource` = `https://ossrdbms-aad.database.windows.net`
* `client_id` = `CLIENT_ID` (that you retrieved earlier)

You get back a JSON result containing an `access_token` field - this long text value is the Managed Identity access token you should use as the password when connecting to the database.

For testing purposes, you can run the following commands in your shell.

> [!NOTE]
> Note you need `curl`, `jq`, and the `psql` client installed.

```bash
# Retrieve the access token

export PGPASSWORD=`curl -s 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fossrdbms-aad.database.windows.net&client_id=CLIENT_ID' -H Metadata:true | jq -r .access_token`

# Connect to the database

psql "host=[FQDN_of_coordinator] port=5432 dbname=[db_name] user=citus sslmode=require"
```

You're now connected to the cluster's coordinator.

## Connect using Managed Identity in C#

This section shows how to get an access token using the VM's user-assigned managed identity and use it to call Azure Cosmos DB for PostgreSQL. Azure Cosmos DB for PostgreSQL natively supports Azure AD authentication, so it can directly accept access tokens obtained using managed identities for Azure resources. When creating a connection to PostgreSQL, you pass the access token in the password field.

Here's a .NET code example of opening a connection to PostgreSQL using an access token. This code must run on the VM to use the system-assigned managed identity to obtain an access token from Azure AD. Replace the values of HOST, USER, DATABASE, and CLIENT_ID.

```csharp
using System;
using System.Net;
using System.IO;
using System.Collections;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;
using Npgsql;
using Azure.Identity;

namespace Driver
{
    class Script
    {
        // Obtain connection string information from the portal for use in the following variables
        private static string Host = "[FQDN_of_coordinator]";
        private static string User = "[NAME]";
        private static string Database = "[DATABASE]";

        static async Task Main(string[] args)
        {
            //
            // Get an access token for PostgreSQL.
            //
            Console.Out.WriteLine("Getting access token from Azure AD...");

            // Azure AD resource ID for Azure Cosmos DB for PostgreSQL cluster is https://ossrdbms-aad.database.windows.net/
            string accessToken = null;

            try
            {
                // Call managed identities for Azure resources endpoint.
                var sqlServerTokenProvider = new DefaultAzureCredential();
                accessToken = (await sqlServerTokenProvider.GetTokenAsync(
                    new Azure.Core.TokenRequestContext(scopes: new string[] { "https://ossrdbms-aad.database.windows.net/.default" }) { })).Token;

            }
            catch (Exception e)
            {
                Console.Out.WriteLine("{0} \n\n{1}", e.Message, e.InnerException != null ? e.InnerException.Message : "Acquire token failed");
                System.Environment.Exit(1);
            }

            //
            // Open a connection to the PostgreSQL server using the access token.
            //
            string connString =
                String.Format(
                    "Server={0}; User Id={1}; Database={2}; Port={3}; Password={4}; SSLMode=Prefer",
                    Host,
                    User,
                    Database,
                    5432,
                    accessToken);

            using (var conn = new NpgsqlConnection(connString))
            {
                Console.Out.WriteLine("Opening connection using access token...");
                conn.Open();

                using (var command = new NpgsqlCommand("SELECT version()", conn))
                {

                    var reader = command.ExecuteReader();
                    while (reader.Read())
                    {
                        Console.WriteLine("\nConnected!\n\nPostgres version: {0}", reader.GetString(0));
                    }
                }
            }
        }
    }
}
```

When run, this command gives an output like this:

```output
Getting access token from Azure AD...
Opening connection using access token...

Connected!

Postgres version: PostgreSQL 16.0, compiled by Visual C++ build 1800, 64-bit
```

## Next steps
- Learn about [authentication in Azure Cosmos DB for PostgreSQL](./concepts-authentication.md).
- Check out [Azure AD limits and limitations in Azure Cosmos DB for PostgreSQL](./reference-limits.md#azure-active-directory-authentication)
- Learn how to configure authentication for Azure Cosmos DB for PostgreSQL clusters, see [Use Azure Active Directory and native PostgreSQL roles for authentication with Azure Cosmos DB for PostgreSQL](./how-to-configure-authentication.md).
