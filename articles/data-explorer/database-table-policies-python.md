---
title: 'Create policies for Azure Data Explorer cluster and database using the Azure Data Explorer Python library '
description: In this article, you learn how to create policies using Python.
author: lugoldbe
ms.author: lugoldbe
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: conceptual
ms.date: 09/24/2019
---

# Create database/table policies for Azure Data Explorer by using Python

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. In this article, you create database/table policies for Azure Data Explorer using Python.

## Prerequisites

1. If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

1. [A test cluster and database](create-cluster-database-python.md)

1. [A test table](python-ingest-data.md)

## Install the data libraries

```
pip install azure-kusto-data
pip install azure-mgmt-kusto
pip install adal
pip install msrestazure
```

# Authentication
For running the examples in this article, we need an Azure AD Application and service principal that can access resources. You may use the same Azure AD Application for authentication from the step of creating [A test cluster and database](create-cluster-database-csharp.md). If you want to use a different Azure AD Application, Check [create an Azure AD application](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal) to create a free Azure AD Application and add role assignment at the subscription scope. It also shows how to get the `Directory (tenant) ID`, `Application ID`, and `Client Secret`. You may need to add the new Azure AD Application as a principal in the database, check [Manage Azure Data Explorer database permissions](https://docs.microsoft.com/bs-latn-ba/azure/data-explorer/manage-database-permissions).   

## Alter database's retention policy
Sets a retention policy with a 10 day soft-delete period.

```python
from azure.mgmt.kusto import KustoManagementClient
from azure.mgmt.kusto.models import DatabaseUpdate
from adal import AuthenticationContext
from msrestazure.azure_active_directory import AdalAuthentication
import datetime

#Directory (tenant) ID
tenant_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
#Application ID
client_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
#Client Secret
client_secret = "xxxxxxxxxxxxxx"
subscription_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
context = AuthenticationContext('https://login.microsoftonline.com/{}'.format(tenant_id))
credentials = AdalAuthentication(context.acquire_token_with_client_credentials,
                                        resource="https://management.core.windows.net/",
                                        client_id=client_id,
                                        client_secret=client_secret)
kusto_management_client = KustoManagementClient(credentials, subscription_id)

resource_group_name = "testrg";
#The cluster and database that are created in step(2) at the Prerequisite section
cluster_name = "mykustocluster";
database_name = "mykustodatabase";

#Returns an instance of LROPoller, check https://docs.microsoft.com/en-us/python/api/msrest/msrest.polling.lropoller?view=azure-python
poller = kustoManagementClient.databases.update(resource_group_name=resource_group_name, cluster_name=cluster_name, database_name=database_name,
                                           parameters=DatabaseUpdate(soft_delete_period=datetime.timedelta(days=10)))
```

## Alter a database's cache policy
Sets a cache policy for the database that the last five days of data and indexes will be on the cluster SSD.

```python
from azure.mgmt.kusto import KustoManagementClient
from azure.mgmt.kusto.models import DatabaseUpdate
from adal import AuthenticationContext
from msrestazure.azure_active_directory import AdalAuthentication
import datetime

#Directory (tenant) ID
tenant_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
#Application ID
client_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
#Client Secret
client_secret = "xxxxxxxxxxxxxx"
subscription_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
context = AuthenticationContext('https://login.microsoftonline.com/{}'.format(tenant_id))
credentials = AdalAuthentication(context.acquire_token_with_client_credentials,
                                        resource="https://management.core.windows.net/",
                                        client_id=client_id,
                                        client_secret=client_secret)
kusto_management_client = KustoManagementClient(credentials, subscription_id)

resource_group_name = "testrg";
#The cluster and database that are created in step(2) at the Prerequisite section
cluster_name = "mykustocluster";
database_name = "mykustodatabase";

#Returns an instance of LROPoller, check https://docs.microsoft.com/en-us/python/api/msrest/msrest.polling.lropoller?view=azure-python
poller = kustoManagementClient.databases.update(resource_group_name=resource_group_name, cluster_name=cluster_name, database_name=database_name,
                                           parameters=DatabaseUpdate(hot_cache_period=datetime.timedelta(days=5)))
```

## Alter a table's cache policy
Sets a cache policy for the table that the last five days of data will be on the cluster SSD.

```python
from azure.kusto.data.request import KustoClient, KustoConnectionStringBuilder
kusto_uri = "https://<ClusterName>.<Region>.kusto.windows.net"
database_name = "<DatabaseName>"
#Directory (tenant) ID
tenant_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
#Application ID
client_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
#Client Secret
client_secret = "xxxxxxxxxxxxxx"
#Application ID
client_id_to_add = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";

kusto_connection_string_builder = KustoConnectionStringBuilder.with_aad_application_key_authentication(connection_string=kusto_uri, aad_app_id=client_id, app_key=client_secret, authority_id=tenant_id)

#The table that is created in step(3) at the Prerequisite section
table_name = "<TableName>"
#hotdata and hotindex should have the same value
caching_policy = r'hotdata=time(5.00:00:00) hotindex=time(5.00:00:00)'
command = '.alter table {} policy caching '.format(table_name) +  caching_policy
kusto_client.execute_mgmt(database_name, command)
```

## Add a new principal for database
Add a new Azure AD application as admin principal for the database

```python
from azure.mgmt.kusto import KustoManagementClient
from azure.mgmt.kusto.models import DatabasePrincipal
from adal import AuthenticationContext
from msrestazure.azure_active_directory import AdalAuthentication

#Directory (tenant) ID
tenant_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
#Application ID
client_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
#Client Secret
client_secret = "xxxxxxxxxxxxxx"
#Application ID
client_id_to_add = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
subscription_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
context = AuthenticationContext('https://login.microsoftonline.com/{}'.format(tenant_id))
credentials = AdalAuthentication(context.acquire_token_with_client_credentials,
                                        resource="https://management.core.windows.net/",
                                        client_id=client_id,
                                        client_secret=client_secret)
kusto_management_client = KustoManagementClient(credentials, subscription_id)

resource_group_name = "testrg";
#The cluster and database that are created in step(2) at the Prerequisite section
cluster_name = "mykustocluster";
database_name = "mykustodatabase";
role = "Admin"
principle_name = "<database_principle_name>";
type_name = "App"
kustoManagementClient.databases.add_principals(resource_group_name=resource_group_name, cluster_name=cluster_name, database_name=database_name,
                         value=[DatabasePrincipal(role=role, name=principle_name, type=type_name, app_id=client_id_to_add, tenant_name=tenant_id)])
```
