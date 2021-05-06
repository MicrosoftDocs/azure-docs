---
title: Connect with Managed Identity - Azure Database for PostgreSQL - Single Server
description: Learn about how to connect and authenticate using Managed Identity for authentication with Azure Database for PostgreSQL
author: sunilagarwal
ms.author: sunila
ms.service: postgresql
ms.topic: how-to
ms.date: 05/19/2020
ms.custom: devx-track-csharp, devx-track-azurecli
---

# Connect with Managed Identity to Azure Database for PostgreSQL

This article shows you how to use a user-assigned identity for an Azure Virtual Machine (VM) to access an Azure Database for PostgreSQL server. Managed Service Identities are automatically managed by Azure and enable you to authenticate to services that support Azure AD authentication, without needing to insert credentials into your code. 

You learn how to:
- Grant your VM access to an Azure Database for PostgreSQL server
- Create a user in the database that represents the VM's user-assigned identity
- Get an access token using the VM identity and use it to query an Azure Database for PostgreSQL server
- Implement the token retrieval in a C# example application

## Prerequisites

- If you're not familiar with the managed identities for Azure resources feature, see this [overview](../../articles/active-directory/managed-identities-azure-resources/overview.md). If you don't have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before you continue.
- To do the required resource creation and role management, your account needs "Owner" permissions at the appropriate scope (your subscription or resource group). If you need assistance with role assignment, see [Assign Azure roles to manage access to your Azure subscription resources](../../articles/role-based-access-control/role-assignments-portal.md).
- You need an Azure VM (for example running Ubuntu Linux) that you'd like to use for access your database using Managed Identity
- You need an Azure Database for PostgreSQL database server that has [Azure AD authentication](howto-configure-sign-in-aad-authentication.md) configured
- To follow the C# example, first complete the guide how to [Connect with C#](connect-csharp.md)

## Creating a user-assigned managed identity for your VM

Create an identity in your subscription using the [az identity create](/cli/azure/identity#az_identity_create) command. You can use the same resource group that your virtual machine runs in, or a different one.

```azurecli-interactive
az identity create --resource-group myResourceGroup --name myManagedIdentity
```

To configure the identity in the following steps, use the [az identity show](/cli/azure/identity#az_identity_show) command to store the identity's resource ID and client ID in variables.

```azurecli
# Get resource ID of the user-assigned identity
resourceID=$(az identity show --resource-group myResourceGroup --name myManagedIdentity --query id --output tsv)

# Get client ID of the user-assigned identity
clientID=$(az identity show --resource-group myResourceGroup --name myManagedIdentity --query clientId --output tsv)
```

We can now assign the user-assigned identity to the VM with the [az vm identity assign](/cli/azure/vm/identity#az_vm_identity_assign) command:

```azurecli
az vm identity assign --resource-group myResourceGroup --name myVM --identities $resourceID
```

To finish setup, show the value of the Client ID, which you'll need in the next few steps:

```bash
echo $clientID
```

## Creating a PostgreSQL user for your Managed Identity

Now, connect as the Azure AD administrator user to your PostgreSQL database, and run the following SQL statements:

```sql
SET aad_validate_oids_in_tenant = off;
CREATE ROLE myuser WITH LOGIN PASSWORD 'CLIENT_ID' IN ROLE azure_ad_user;
```

The managed identity now has access when authenticating with the username `myuser` (replace with a name of your choice).

## Retrieving the access token from Azure Instance Metadata service

Your application can now retrieve an access token from the Azure Instance Metadata service and use it for authenticating with the database.

This token retrieval is done by making an HTTP request to `http://169.254.169.254/metadata/identity/oauth2/token` and passing the following parameters:

* `api-version` = `2018-02-01`
* `resource` = `https://ossrdbms-aad.database.windows.net`
* `client_id` = `CLIENT_ID` (that you retrieved earlier)

You'll get back a JSON result that contains an `access_token` field - this long text value is the Managed Identity access token, that you should use as the password when connecting to the database.

For testing purposes, you can run the following commands in your shell. Note you need `curl`, `jq`, and the `psql` client installed.

```bash
# Retrieve the access token
export PGPASSWORD=`curl -s 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fossrdbms-aad.database.windows.net&client_id=CLIENT_ID' -H Metadata:true | jq -r .access_token`

# Connect to the database
psql -h SERVER --user USER@SERVER DBNAME
```

You are now connected to the database you've configured earlier.

## Connecting using Managed Identity in C#

This section shows how to get an access token using the VM's user-assigned managed identity and use it to call Azure Database for PostgreSQL. Azure Database for PostgreSQL natively supports Azure AD authentication, so it can directly accept access tokens obtained using managed identities for Azure resources. When creating a connection to PostgreSQL, you pass the access token in the password field.

Here's a .NET code example of opening a connection to PostgreSQL using an access token. This code must run on the VM to access the VM's user-assigned managed identity's endpoint. .NET Framework 4.6 or higher or .NET Core 2.2 or higher is required to use the access token method. Replace the values of HOST, USER, DATABASE, and CLIENT_ID.

```csharp
using System;
using System.Net;
using System.IO;
using System.Collections;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;
using Npgsql;

namespace Driver
{
    class Script
    {
        // Obtain connection string information from the portal
        //
        private static string Host = "HOST";
        private static string User = "USER";
        private static string Database = "DATABASE";
        private static string ClientId = "CLIENT_ID";

        static void Main(string[] args)
        {
            //
            // Get an access token for PostgreSQL.
            //
            Console.Out.WriteLine("Getting access token from Azure Instance Metadata service...");

            // Azure AD resource ID for Azure Database for PostgreSQL is https://ossrdbms-aad.database.windows.net/
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fossrdbms-aad.database.windows.net&client_id=" + ClientId);
            request.Headers["Metadata"] = "true";
            request.Method = "GET";
            string accessToken = null;

            try
            {
                // Call managed identities for Azure resources endpoint.
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();

                // Pipe response Stream to a StreamReader and extract access token.
                StreamReader streamResponse = new StreamReader(response.GetResponseStream());
                string stringResponse = streamResponse.ReadToEnd();
                var list = JsonSerializer.Deserialize<Dictionary<string, string>>(stringResponse);
                accessToken = list["access_token"];
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
                    "Server={0}; User Id={1}; Database={2}; Port={3}; Password={4};SSLMode=Prefer",
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

When run, this command will give an output like this:

```
Getting access token from Azure Instance Metadata service...
Opening connection using access token...

Connected!

Postgres version: PostgreSQL 11.6, compiled by Visual C++ build 1800, 64-bit
```

## Next steps

* Review the overall concepts for [Azure Active Directory authentication with Azure Database for PostgreSQL](concepts-aad-authentication.md)
