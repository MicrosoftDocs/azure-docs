---
title: 'Quickstart: Create an Azure Database for PostgreSQL Flexible Server - Azure libraries (SDK) for Python'
description: In this Quickstart, learn how to create an Azure Database for PostgreSQL Flexible server using Azure libraries (SDK) for Python.
author: AwdotiaRomanowna
ms.service: postgresql
ms.subservice: flexible-server
ms.custom: devx-track-python-sdk
ms.topic: quickstart
ms.author: alkuchar
ms.date: 04/24/2023
---

# Quickstart: Use a Azure libraries (SDK) for Python to create an Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

In this quickstart, you'll learn how to use an [Azure libraries (SDK) for Python](https://learn.microsoft.com/azure/developer/python/sdk/azure-sdk-overview?view=azure-python) 
to create an Azure Database for PostgreSQL - Flexible Server.

Flexible server is a managed service that you use to run, manage, and scale highly available PostgreSQL databases in the cloud. You can use Python SDK to provision a PostgreSQL Flexible Server, multiple servers or multiple databases on a server.


## Prerequisites

An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).

## Create the Server

Install the required packages:

```bash
pip install azure-mgmt-resource
pip install azure-identity
pip install azure-mgmt-rdbms
```

Create a create_postgres_flexible_server.py file and include the following code:

```python
from azure.identity import DefaultAzureCredential
from azure.mgmt.resource import ResourceManagementClient
from azure.mgmt.rdbms.postgresql_flexibleservers import PostgreSQLManagementClient
from azure.mgmt.rdbms.postgresql_flexibleservers.models import Server, Sku, Storage


def create_postgres_flexible_server(subscription_id, resource_group, server_name, location):
    # Authenticate with your Azure account
    credential = DefaultAzureCredential()

    # Create resource management client and PostgreSQL management client
    resource_client = ResourceManagementClient(credential, subscription_id)
    postgres_client = PostgreSQLManagementClient(credential, subscription_id)

    # Create resource group
    resource_client.resource_groups.create_or_update(
        resource_group,
        {
            'location': location
        }
    )

    # Create PostgreSQL Flexible Server
    server_params = Server(
        sku=Sku(name='Standard_D4s_v3', tier='GeneralPurpose'),
        administrator_login='pgadmin',
        administrator_login_password='<mySecurePassword>',
        storage=Storage(storage_size_gb=32),
        version="14",
        create_mode="Create"
    )

    postgres_server = postgres_client.servers.begin_create(
        resource_group,
        server_name,
        server_params
    ).result()

    print(f"PostgreSQL Flexible Server '{server_name}' created in resource group '{resource_group}'")


if __name__ == '__main__':
    subscription_id = '<subscription_id>'
    resource_group = '<resource_group>'
    server_name = '<servername>'
    location = 'eastus'

    create_postgres_flexible_server(subscription_id, resource_group, server_name, location)

```

Replace the following placeholders with your data:

- **<subscription_id>**: 
- **<resource_group>**: enter your own login account to use when you connect to the server. For example, `myadmin`. 
- **<servername>**: Unique name that identifies your Azure Database for PostgreSQL server. The domain name `postgres.database.azure.com` is appended to the server name you provide. Server name must be at least 3 characters and at most 63 characters. Server name must only contain lowercase letters, numbers, and hyphens.
- **administrator_login**: The primary administrator username for the server. You can create additional users after the server has been created.
- **<mySecurePassword>**: Password for the primary administrator for the server. It must contain between 8 and 128 characters. Your password must contain characters from three of the following categories: English uppercase letters, English lowercase letters, numbers (0 through 9), and non-alphanumeric characters (!, $, #, %, etc.).

You can also change other parameters like location, storage size, engine version etc.

> [!NOTE]
> Note that the DefaultAzureCredential class will try to authenticate using various methods, such as environment variables, managed identities, or the Azure CLI. 
> Make sure you have one of these methods set up. You can find more information on authentication in the [Azure SDK documentation](https://learn.microsoft.com/python/api/overview/azure/identity-readme?view=azure-python#defaultazurecredential).

## Review deployed resources

Use the Azure portal, Azure CLI, or Azure PowerShell to validate the deployment and review the deployed resources.

# [CLI](#tab/CLI)

```azurecli
az resource list --resource-group <resource_group>
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
Get-AzResource -ResourceGroupName <resource_group>
```

---

## Clean up resources

Keep this resource group, server, and single database if you want to go to the [Next steps](#next-steps). 
The next steps show you how to connect and query your database using different methods.

To delete the resource group:

# [CLI](#tab/CLI)

```azurecli
az group delete --name <resource_group>
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
Remove-AzResourceGroup -Name exampleRG
```

---
