---
title: 'Quickstart: Create an Azure Database for PostgreSQL Flexible Server - Azure libraries (SDK) for Python'
description: In this Quickstart, learn how to create an Azure Database for PostgreSQL Flexible server using Azure libraries (SDK) for Python.
author: AlicjaKucharczyk
ms.service: postgresql
ms.subservice: flexible-server
ms.custom: devx-track-python-sdk
ms.topic: quickstart
ms.author: alkuchar
ms.date: 04/24/2023
---

# Quickstart: Use an Azure libraries (SDK) for Python to create an Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

In this quickstart, you'll learn how to use the [Azure libraries (SDK) for Python](/azure/developer/python/sdk/azure-sdk-overview?view=azure-python&preserve-view=true) 
to create an Azure Database for PostgreSQL - Flexible Server.

Flexible Server is a managed service that you use to run, manage, and scale highly available PostgreSQL databases in the cloud. You can use Python SDK to provision a PostgreSQL Flexible Server, multiple servers or multiple databases on a server.


## Prerequisites

An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).

## Create the Server

First, install the required packages.

```bash
pip install azure-mgmt-resource
pip install azure-identity
pip install azure-mgmt-rdbms
```

Create a `create_postgres_flexible_server.py` file and include the following code.

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
        location='<location>',
        sku=Sku(name='Standard_D4s_v3', tier='GeneralPurpose'),
        administrator_login='pgadmin',
        administrator_login_password='<mySecurePassword>',
        storage=Storage(storage_size_gb=32),
        version="16",
        create_mode="Create"
    )

    postgres_client.servers.begin_create(
        resource_group,
        server_name,
        server_params
    ).result()

    print(f"PostgreSQL Flexible Server '{server_name}' created in resource group '{resource_group}'")


if __name__ == '__main__':
    subscription_id = '<subscription_id>'
    resource_group = '<resource_group>'
    server_name = '<servername>'

    create_postgres_flexible_server(subscription_id, resource_group, server_name, location)

```

Replace the following parameters with your data:

- **subscription_id**: Your own [subscription ID](../../azure-portal/get-subscription-tenant-id.md#find-your-azure-subscription).
- **resource_group**: The name of the resource group you want to use. The script will create a new resource group if it doesn't exist.   
- **server_name**: A unique name that identifies your Azure Database for PostgreSQL - Flexible Server. The domain name `postgres.database.azure.com` is appended to the server name you provide. The server name must be at least 3 characters and at most 63 characters, and can only contain lowercase letters, numbers, and hyphens.
- **location**: The Azure region where you want to create your Azure Database for PostgreSQL - Flexible Server. It defines the geographical location where your server and its data reside. Choose a region close to your users for reduced latency. The location should be specified in the format of Azure region short names, like `westus2`, `eastus`, or `northeurope`.
- **administrator_login**: The primary administrator username for the server. You can create additional users after the server has been created.
- **administrator_login_password**: A password for the primary administrator for the server. It must contain between 8 and 128 characters. Your password must contain characters from three of the following categories: English uppercase letters, English lowercase letters, numbers (0 through 9), and non-alphanumeric characters (!, $, #, %, etc.).

You can also customize other parameters like storage size, engine version, etc.


> [!NOTE]
> Note that the DefaultAzureCredential class will try to authenticate using various methods, such as environment variables, managed identities, or the Azure CLI. 
> Make sure you have one of these methods set up. You can find more information on authentication in the [Azure SDK documentation](/python/api/overview/azure/identity-readme?view=azure-python#defaultazurecredential&preserve-view=true).

## Review deployed resources

You can use the Python SDK, Azure portal, Azure CLI, Azure PowerShell, and various other tools to validate the deployment and review the deployed resources. Some examples are provided below.


# [Python SDK](#tab/PythonSDK)
Add the `check_server_created` function to your existing script to use the servers attribute of the [`PostgreSQLManagementClient`](/python/api/azure-mgmt-rdbms/azure.mgmt.rdbms.postgresql_flexibleservers.postgresqlmanagementclient?view=azure-python&preserve-view=true) instance to check if the PostgreSQL Flexible Server was created:

```python
def check_server_created(subscription_id, resource_group, server_name):
    # Authenticate with your Azure account
    credential = DefaultAzureCredential()

    # Create PostgreSQL management client
    postgres_client = PostgreSQLManagementClient(credential, subscription_id)

    try:
        server = postgres_client.servers.get(resource_group, server_name)
        if server:
            print(f"Server '{server_name}' exists in resource group '{resource_group}'.")
            print(f"Server state: {server.state}")
        else:
            print(f"Server '{server_name}' not found in resource group '{resource_group}'.")
    except Exception as e:
        print(f"Error occurred: {e}")
        print(f"Server '{server_name}' not found in resource group '{resource_group}'.")
```

Call it with the appropriate parameters.

```python
    check_server_created(subscription_id, resource_group, server_name)
```

> [!NOTE]
> The `check_server_created` function will return the server state as soon as the server is provisioned. However, it might take a few minutes for the server to become fully available. Ensure that you wait for the server to be in the Ready state before connecting to it.


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

If you no longer need the PostgreSQL Flexible Server, you can delete it and the associated resource group using the following methods.

# [Python SDK](#tab/PythonSDK)
Add the `delete_resources` function to your existing script to delete your Postgres server and the associated resource group that was created in this quickstart.

```python
def delete_resources(subscription_id, resource_group, server_name):
    # Authenticate with your Azure account
    credential = DefaultAzureCredential()

    # Create resource management client and PostgreSQL management client
    resource_client = ResourceManagementClient(credential, subscription_id)
    postgres_client = PostgreSQLManagementClient(credential, subscription_id)

    # Delete PostgreSQL Flexible Server
    postgres_client.servers.begin_delete(resource_group, server_name).result()
    print(f"Deleted PostgreSQL Flexible Server '{server_name}' in resource group '{resource_group}'.")

    # Delete resource group
    resource_client.resource_groups.begin_delete(resource_group).result()
    print(f"Deleted resource group '{resource_group}'.")

# Call the delete_resources function
delete_resources(subscription_id, resource_group, server_name)
```


# [CLI](#tab/CLI)

```azurecli
az group delete --name <resource_group>
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
Remove-AzResourceGroup -Name <resource_group>
```

---
