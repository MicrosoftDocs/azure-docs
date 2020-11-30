---
title: Create and manage credentials for scans
description: This article explains the steps to create and manage credentials in Azure Purview.
author: viseshag
ms.author: viseshag
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: how-to
ms.date: 11/23/2020
---

# Troubleshoot your connections in Azure Purview

This article describes how you can troubleshoot connection errors while setting up scans on data sources in Azure Purview.

## Did you apply the credential on the data source?
If you are using Managed identity or Service Principal as a method of authentication for scans, you will have to allow these identities to have access to your data source.

Here's how to do it for each source type:

- [Azure Blob Storage](register-scan-azure-blob-storage-source.md#set-up-authentication-for-a-scan)
- [Azure Cosmos DB](register-scan-azure-cosmos-database.md#set-up-authentication-for-a-scan)
- [Azure Data Explorer](register-scan-azure-data-explorer.md#set-up-authentication-for-a-scan)
- [Azure Data Lake Storage Gen1](register-scan-adls-gen1.md)
- [Azure Data Lake Storage Gen2](register-scan-adls-gen2.md)
- [Azure SQL Database](register-scan-azure-sql-database.md)
- [Azure SQL Database Managed Instance](register-scan-azure-sql-database-managed-instance.md)
- [Azure Synapse Analytics](register-scan-azure-synapse-analytics.md)
- [SQL Server](register-scan-on-premises-sql-server.md)
- [Power BI](register-scan-power-bi-tenant.md)

## Did you store your credential in your key vault and are you using the right secret name and version?

Verify this by following the steps below:

1. Navigate to your key vault
1. Select **Settings > Secrets**
1. Select the secret you are using to authenticate against your data source for scans
1. Select the version which you intend to use and verify that the password or account key is correct by clicking on **Show Secret Value** 

## Did you add the Purview managed identity on your Azure key vault?

Verify this by following the steps below:

1. Navigate to your key vault and to the **Access policies** section
1. Verify that your Purview managed identity shows under the *Current access policies* section with **get** permissions on secrets at least

If you don't see your Purview managed identity listed, then follow these [steps](manage-credentials.md) to add it. 
