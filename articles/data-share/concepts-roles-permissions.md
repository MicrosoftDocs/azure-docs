---
title: Roles and requirements for Azure Data Share   
description: Learn about the permissions required to share and receive data using Azure Data Share.
author: joannapea
ms.author: joanpo
ms.service: data-share
ms.topic: conceptual
ms.date: 07/10/2019
---

# Roles and requirements for Azure Data Share 

This article describes roles and permissions required to share and receive data using Azure Data Share service. 

## Roles and requirements

With Azure Data Share service, you can share data without exchanging credentials between data provider and consumer. Azure Data Share service uses Managed Identities (previously known as MSIs) to authenticate to Azure data store. 

Azure Data Share resource's managed identity needs to be granted access to Azure data store. Azure Data Share service then uses this managed identity to read and write data for snapshot-based sharing, and to establish symbolic link for in-place sharing. 

To share or receive data from an Azure data store, user needs at least the following permissions. Additional permissions are required for SQL-based sharing.

* Permission to write to the Azure data store. Typically, this permission exists in the **Contributor** role.
* Permission to create role assignment in the Azure data store. Typically, permission to create role assignments exists in the **Owner** role, User Access Administrator role, or a custom role with Microsoft.Authorization/role assignments/write permission assigned. This permission is not required if the data share resource's managed identity is already granted access to the Azure data store. See table below for required role.

Below is a summary of the roles assigned to Data Share resource's managed identity:

| |  |  |
|---|---|---|
|**Data Store Type**|**Data Provider Source Data Store**|**Data Consumer Target Data Store**|
|Azure Blob Storage| Storage Blob Data Reader | Storage Blob Data Contributor
|Azure Data Lake Gen1 | Owner | Not Supported
|Azure Data Lake Gen2 | Storage Blob Data Reader | Storage Blob Data Contributor
|Azure SQL Server | SQL DB Contributor | SQL DB Contributor
|Azure Data Explorer Cluster | Contributor | Contributor
|

For SQL-based sharing, a SQL user needs to be created from an external provider in the SQL database with the same name as the Azure Data Share resource. Below is a summary of the permission required by the SQL user.

| |  |  |
|---|---|---|
|**SQL Database Type**|**Data Provider SQL User Permission**|**Data Consumer SQL User Permission**|
|Azure SQL Database | db_datareader | db_datareader, db_datawriter, db_ddladmin
|Azure Synapse Analytics (formerly SQL DW) | db_datareader | db_datareader, db_datawriter, db_ddladmin
|

### Data provider

To add a dataset in Azure Data Share, provider data share resource's managed identity needs to be granted access to the source Azure data store. For example, in the case of storage account, the data share resource's managed identity is granted the Storage Blob Data Reader role. 

This is done automatically by the Azure Data Share service when user is adding dataset via Azure portal and the user has the proper permission. For example, user is an owner of the Azure data store, or is a member of a custom role that has the Microsoft.Authorization/role assignments/write permission assigned. 

Alternatively, user can have owner of the Azure data store add the data share resource's managed identity to the Azure data store manually. This action only needs to be performed once per data share resource.

To create a role assignment for the data share resource's managed identity, follow the below steps:

1. Navigate to the Azure data store.
1. Select **Access Control (IAM)**.
1. Select **Add a role assignment**.
1. Under *Role*, select the role in the role assignment table above (for example, for storage account, select *Storage Blob Data Reader*).
1. Under *Select*, type in the name of your Azure Data Share resource.
1. Click *Save*.

For SQL-based sources, in addition to the above steps, a SQL user needs to be created from an external provider in the SQL database with the same name as the Azure Data Share resource. This user needs to be granted *db_datareader* permission. A sample script along with other prerequisites for SQL-based sharing can be found in the [share your data](share-your-data.md) tutorial. 

### Data consumer
To receive data, consumer data share resource's managed identity needs to be granted access to the target Azure data store. For example, in the case of storage account, the data share resource's managed identity is granted the Storage Blob Data Contributor role. 

This is done automatically by the Azure Data Share service if the user specifies a target data store via Azure portal and the user has proper permission. For example, user is an owner of the Azure data store, or is a member of a custom role which has the Microsoft.Authorization/role assignments/write permission assigned. 

Alternatively, user can have owner of the Azure data store add the data share resource's managed identity to the Azure data store manually. This action only needs to be performed once per data share resource.

To create a role assignment for the data share resource's managed identity manually, follow the below steps:

1. Navigate to the Azure data store.
1. Select **Access Control (IAM)**.
1. Select **Add a role assignment**.
1. Under *Role*, select the role in the role assignment table above (for example, for storage account, select *Storage Blob Data Reader*).
1. Under *Select*, type in the name of your Azure Data Share resource.
1. Click *Save*.

For SQL-based target, in addition to the above steps, a SQL user needs to be created from an external provider in the SQL database with the same name as the Azure Data Share resource. This user needs to be granted *db_datareader, db_datawriter, db_ddladmin* permission. A sample script along with other prerequisites for SQL-based sharing can be found in the [accept and receive data](subscribe-to-data-share.md) tutorial. 

If you are sharing data using REST APIs, you need to create these role assignments manually. 

To learn more about how to add a role assignment, refer to [this documentation,](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal#add-a-role-assignment). 

## Resource provider registration 

To view Azure Data Share invitation for the first time in your Azure tenant, you may need to manually register the Microsoft.DataShare resource provider into your Azure subscription. Follow these steps to register the Microsoft.DataShare resource provider into your Azure Subscription. You need *Contributor* access to the Azure subscription to register resource provider.

1. In the Azure portal, navigate to **Subscriptions**.
1. Select the subscription that you're using for Azure Data Share.
1. Click on **Resource Providers**.
1. Search for Microsoft.DataShare.
1. Click **Register**.

## Next steps

- Learn more about roles in Azure - [Understand role definitions](../role-based-access-control/role-definitions.md)

