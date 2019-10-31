---
title: Roles and requirements for Azure Data Share   
description: Learn about the access control roles and requirements for data providers and data consumers to share data in Azure Data Share.
author: joannapea
ms.author: joanpo
ms.service: data-share
ms.topic: conceptual
ms.date: 07/10/2019
---

# Roles and requirements for Azure Data Share 

This article describes the roles required to share data using Azure Data Share, as well as to accept and receive data using Azure Data Share. 

## Roles and requirements

Azure Data Share uses Managed Identities for Azure Services (previously known as MSIs) to authenticate to underlying storage accounts in order to be able to read data to be shared by a data provider, as well as receive data shared as a data consumer. As a result, there is no exchange of credentials between the data provider and the data consumer. 

The Managed Service Identity needs to be granted access to the underlying storage account or SQL database. The Azure Data Share service uses the Azure Data Share resource's Managed Service Identity to read and write data. The user of Azure Data Share needs the ability to create a role assignment for the Managed Service Identity to the storage account or SQL database that they are sharing data from/to. 

In the case of storage, Permission to create role assignments exists in the **owner** role, User Access Administrator role, or a custom role with Microsoft.Authorization/role assignments/write permission assigned. 

If you are not an owner of the storage account in question, and you are unable to create a role assignment for the Azure Data Share resource's Managed Identity yourself, you can request an Azure Administrator to create a role assignment on your behalf. 

Below is a summary of the roles assigned to Data Share resource-Managed Identity:

| |  |  |
|---|---|---|
|**Storage Type**|**Data Provider Store**|**Data Consumer Target Store**|
|Azure Blob Storage| Storage Blob Data Reader | Storage Blob Data Contributor
|Azure Data Lake Gen1 | Owner | Not Supported
|Azure Data Lake Gen2 | Storage Blob Data Reader | Storage Blob Data Contributor
|Azure SQL | dbo | dbo 
|

### Data providers 
To add a dataset to an Azure Data Share, the data providers data share resource-managed identity needs to be added to the Storage Blob Data Reader role. This is done automatically by the Azure Data Share service if the user is adding datasets via Azure and is an owner of the storage account, or is a member of a custom role that has the Microsoft.Authorization/role assignments/write permission assigned. 

Alternatively, the user can have an Azure Administrator add the data share resource-managed identity to the Storage Blob Data Reader role manually. Creating this role assignment manually by the Administrator will void having to be an owner of the Storage account or have a custom role assignment. This applies to data being shared from Azure Storage or Azure Data Lake Gen2. 

If sharing data from Azure Data Lake Gen1, the role assignment must be made to the Owner role. 

To create a role assignment for the Data Share resource's Managed Identity, follow the below steps:

1. Navigate to the Storage account.
1. Select **Access Control (IAM)**.
1. Select **Add a role assignment**.
1. Under *Role*, select *Storage Blob Data Reader*.
1. Under *Select*, type in the name of your Azure Data Share account.
1. Click *Save*.

For SQL-based sources, a user needs to be created from an external provider in the SQL database that data is being shared from with the same name as the Azure Data Share account. A sample script along with other prerequisites for SQL-based sharing can be found in the [share your data](share-your-data.md) tutorial. 

### Data consumers
To receive data, the data consumers data share resource-managed identity needs to be added to the Storage Blob Data Contributor role and/or dbo role of a SQL database if receiving data into a SQL database. 

In the case of storage, this is done automatically by the Azure Data Share service if the user is adding datasets via Azure and is an owner of the storage account, or is a member of a custom role which has the Microsoft.Authorization/role assignments/write permission assigned. 

Alternatively, the user can have an Azure Administrator add the data share resource-managed identity to the Storage Blob Data Contributor role manually. Creating this role assignment manually by the Administrator will void having to be an owner of the Storage account or have a custom role assignment. Note that this applies to data being shared to Azure Storage or Azure Data Lake Gen2. Receiving data to Azure Data Lake Gen1 is not supported. 

To create a role assignment for the Data Share resource's Managed Identity manually, follow the below steps:

1. Navigate to the Storage account.
1. Select **Access Control (IAM)**.
1. Select **Add a role assignment**.
1. Under *Role*, select *Storage Blob Data Contributor*. 
1. Under *Select*, type in the name of your Azure Data Share account.
1. Click *Save*.

If you are sharing data using our REST APIs, you will need to create these role assignments manually by adding the data share account in to the appropriate roles. 

If you are receiving data into a SQL-based source, ensure that a new user is created from an external provider with the same name as your Azure Data Share account. See prerequisites in [accept and receive data](subscribe-to-data-share.md) tutorial. 

To learn more about how to add a role assignment, refer to [this documentation,](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal#add-a-role-assignment) which outlines how to add a role assignment to an Azure resource. 

## Resource provider registration 

When accepting an Azure Data Share invitation, you will need to manually register the Microsoft.DataShare resource provider in to your subscription. Follow these steps to register the Microsoft.DataShare resource provider into your Azure Subscription. 

1. In the Azure portal, navigate to **Subscriptions**.
1. Select the subscription that you're using for Azure Data Share.
1. Click on **Resource Providers**.
1. Search for Microsoft.DataShare.
1. Click **Register**.

## Next steps

- Learn more about roles in Azure - [Understand role definitions](../role-based-access-control/role-definitions.md)

