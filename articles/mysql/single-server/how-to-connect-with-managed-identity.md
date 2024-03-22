---
title: Connect with Managed Identity - Azure Database for MySQL
description: Learn about how to connect and authenticate using Managed Identity for authentication with Azure Database for MySQL
ms.service: mysql
ms.subservice: single-server
ms.topic: how-to
author: SudheeshGH
ms.author: sunaray
ms.custom: devx-track-csharp, devx-track-azurecli
ms.date: 05/03/2023
---

# Connect with Managed Identity to Azure Database for MySQL

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

This article shows you how to use a user-assigned identity for an Azure Virtual Machine (VM) to access an Azure Database for MySQL server. Managed Service Identities are automatically managed by Azure and enable you to authenticate to services that support Microsoft Entra authentication, without needing to insert credentials into your code.

You learn how to:

- Grant your VM access to an Azure Database for MySQL server
- Create a user in the database that represents the VM's user-assigned identity
- Get an access token using the VM identity and use it to query an Azure Database for MySQL server
- Implement the token retrieval in a C# example application

> [!IMPORTANT]
> Connecting with Managed Identity is only available for MySQL 5.7 and newer.

## Prerequisites

- If you're not familiar with the managed identities for Azure resources feature, see this [overview](../../../articles/active-directory/managed-identities-azure-resources/overview.md). If you don't have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before you continue.
- To do the required resource creation and role management, your account needs "Owner" permissions at the appropriate scope (your subscription or resource group). If you need assistance with role assignment, see [Assign Azure roles to manage access to your Azure subscription resources](../../../articles/role-based-access-control/role-assignments-portal.md).
- You need an Azure VM (for example running Ubuntu Linux) that you'd like to use for access your database using Managed Identity
- You need an Azure Database for MySQL database server that has [Microsoft Entra authentication](how-to-configure-sign-in-azure-ad-authentication.md) configured
- To follow the C# example, first complete the guide how to [Connect using C#](connect-csharp.md)

## Creating a user-assigned managed identity for your VM

Create an identity in your subscription using the [az identity create](/cli/azure/identity#az-identity-create) command. You can use the same resource group that your virtual machine runs in, or a different one.

```azurecli-interactive
az identity create --resource-group myResourceGroup --name myManagedIdentity
```

To configure the identity in the following steps, use the [az identity show](/cli/azure/identity#az-identity-show) command to store the identity's resource ID and client ID in variables.

```azurecli-interactive
# Get resource ID of the user-assigned identity

RESOURCE_ID=$(az identity show --resource-group myResourceGroup --name myManagedIdentity --query id --output tsv)

# Get client ID of the user-assigned identity


CLIENT_ID=$(az identity show --resource-group myResourceGroup --name myManagedIdentity --query clientId --output tsv)
```

We can now assign the user-assigned identity to the VM with the [az vm identity assign](/cli/azure/vm/identity#az-vm-identity-assign) command:

```azurecli-interactive
az vm identity assign --resource-group myResourceGroup --name myVM --identities $RESOURCE_ID
```

To finish setup, show the value of the Client ID, which you'll need in the next few steps:

```bash
echo $CLIENT_ID
```

## Creating a MySQL user for your Managed Identity

Now, connect as the Microsoft Entra administrator user to your MySQL database, and run the following SQL statements:

```sql
SET aad_auth_validate_oids_in_tenant = OFF;
CREATE AADUSER 'myuser' IDENTIFIED BY 'CLIENT_ID';
```

The managed identity now has access when authenticating with the username `myuser` (replace with a name of your choice).

## Retrieving the access token from Azure Instance Metadata service

Your application can now retrieve an access token from the Azure Instance Metadata service and use it for authenticating with the database.

This token retrieval is done by making an HTTP request to `http://169.254.169.254/metadata/identity/oauth2/token` and passing the following parameters:

- `api-version` = `2018-02-01`
- `resource` = `https://ossrdbms-aad.database.windows.net`
- `client_id` = `CLIENT_ID` (that you retrieved earlier)

You'll get back a JSON result that contains an `access_token` field - this long text value is the Managed Identity access token, that you should use as the password when connecting to the database.

For testing purposes, you can run the following commands in your shell. Note you need `curl`, `jq`, and the `mysql` client installed.

```bash
# Retrieve the access token


ACCESS_TOKEN=$(curl -s 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fossrdbms-aad.database.windows.net&client_id=CLIENT_ID' -H Metadata:true | jq -r .access_token)

# Connect to the database


mysql -h SERVER --user USER@SERVER --enable-cleartext-plugin --password=$accessToken
```

You are now connected to the database you've configured earlier.

## Connecting using Managed Identity in C#

This section shows how to get an access token using the VM's user-assigned managed identity and use it to call Azure Database for MySQL. Azure Database for MySQL natively supports Microsoft Entra authentication, so it can directly accept access tokens obtained using managed identities for Azure resources. When creating a connection to MySQL, you pass the access token in the password field.

Here's a .NET code example of opening a connection to MySQL using an access token. This code must run on the VM to access the VM's user-assigned managed identity's endpoint. .NET Framework 4.6 or higher or .NET Core 2.2 or higher is required to use the access token method. Replace the values of HOST, USER, DATABASE, and CLIENT_ID.

```csharp
using System;
using System.Net;
using System.IO;
using System.Collections;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;

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

        static async Task Main(string[] args)
        {
            //
            // Get an access token for MySQL.
            //
            Console.Out.WriteLine("Getting access token from Azure Instance Metadata service...");

            // Azure AD resource ID for Azure Database for MySQL is https://ossrdbms-aad.database.windows.net/
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
            // Open a connection to the MySQL server using the access token.
            //
            var builder = new MySqlConnectionStringBuilder
            {
                Server = Host,
                Database = Database,
                UserID = User,
                Password = accessToken,
                SslMode = MySqlSslMode.Required,
            };

            using (var conn = new MySqlConnection(builder.ConnectionString))
            {
                Console.Out.WriteLine("Opening connection using access token...");
                await conn.OpenAsync();

                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "SELECT VERSION()";

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            Console.WriteLine("\nConnected!\n\nMySQL version: {0}", reader.GetString(0));
                        }
                    }
                }
            }
        }
    }
}
```

When run, this command will give an output like this:

```output
Getting access token from Azure Instance Metadata service...
Opening connection using access token...

Connected!

MySQL version: 5.7.27
```

## Next steps

- Review the overall concepts for [Microsoft Entra authentication with Azure Database for MySQL](concepts-azure-ad-authentication.md)
