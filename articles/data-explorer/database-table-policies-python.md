---
title: 'Create policies for Azure Data Explorer cluster and database using the Azure Data Explorer Python library '
description: In this article, you learn how to create policies using .NET Standard SDK.
author: lugoldbe
ms.author: lugoldbe
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: conceptual
ms.date: 24/09/2019
---

# Create database/table policies for Azure Data Explorer by using Python (Preview)

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. In this article, you create database/table policies for Azure Data Explorer using Python.

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

* [A test cluster and database](create-cluster-database-python.md)

* [A test table](python-ingest-data.md)

## Install the data libraries

```
pip install azure-kusto-data
```

# Authentication
This article, we need an Azure AD Application and service principal that can access resources. Check [create an Azure AD application](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal) to create a free Azure AD Application. For running examples in this article, subscription scope permissions are not necessary. To set database-level permissions, check [Manage Azure Data Explorer database permissions](https://docs.microsoft.com/bs-latn-ba/azure/data-explorer/manage-database-permissions). This article use `tenant_id`, `client_id`, and `client_secret` for authentication in the examples, check [create an Azure AD application](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal) to learn about how to get them.

## Construct the connection string
Now construct the connection string, which will be used in the later sections. This example uses an AAD Application key for authentication to access the cluster. You can also use AAD application certificate and AAD user, check this [Kusto connection strings](https://docs.microsoft.com/en-us/azure/kusto/api/connection-strings/kusto) for more examples. Set the values for `kusto_uri`, `database_name`, `tenant_id`, `client_id`, and `client_secret` before running this code.

```python
kusto_uri = "https://<ClusterName>.<Region>.kusto.windows.net"
database_name = "<DatabaseName>"
tenant_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
client_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
client_secret = "xxxxxxxxxxxxxx";

kusto_connection_string_builder = KustoConnectionStringBuilder.with_aad_application_key_authentication(connection_string=kusto_uri, aad_app_id=client_id, app_key=client_secret, authority_id=tenant_id)
```

## Alter database's retention policy
Sets a retention policy with a 10 day soft-delete period and disabled data recoverability.

```python
retention_policy = r'"{\"SoftDeletePeriod\": \"10.00:00:00\", \"Recoverability\": \"Disabled\"}"'
command = '.alter database {} policy retention '.format(database_name) +  retention_policy
kusto_client = KustoClient(kusto_connection_string_builder)
kusto_client.execute_mgmt(database_name, command)
```

## Alter a database's cache policy
Sets a cache policy for the database that the last five days of data and indexes will be on the cluster SSD.

```python
caching_policy = r'hotdata=time(5.00:00:00) hotindex=time(5.00:00:00)'
command = '.alter database {} policy caching '.format(database_name) +  caching_policy
kusto_client = KustoClient(kusto_connection_string_builder)
kusto_client.execute_mgmt(database_name, command)
```

## Alter a table's cache policy
Sets a cache policy for the table that the last five days of data and indexes will be on the cluster SSD.

```python
table_name = "<TableName>"
caching_policy = r'hotdata=time(10.00:00:00) hotindex=time(10.00:00:00)'
command = '.alter table {} policy caching '.format(table_name) +  caching_policy
kusto_client.execute_mgmt(database_name, command)
```

## Add a new principal for database
Add a new Azure AD application client Id as admin principal for the database

```python
new_application_clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
new_tenant_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
command = r'.add database {} admins ("aadapp={};{}")'.format(database_name, new_application_clientId, new_tenant_id)
kusto_client = KustoClient(kusto_connection_string_builder)
kusto_client.execute_mgmt(database_name, command)
```
