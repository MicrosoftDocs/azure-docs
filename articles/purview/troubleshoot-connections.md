---
title: Troubleshoot your connections in Azure Purview
description: This article explains the steps to troubleshoot your connections in Azure Purview.
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 11/23/2020
---
# Troubleshoot your connections in Azure Purview

This article describes how to troubleshoot connection errors while setting up scans on data sources in Azure Purview.

## Permission the credential on the data source

If you're using a managed identity or service principal as a method of authentication for scans, you'll have to allow these identities to have access to your data source.

There are specific instructions for each source type:

- [Azure Blob Storage](register-scan-azure-blob-storage-source.md#setting-up-authentication-for-a-scan)
- [Azure Cosmos DB](register-scan-azure-cosmos-database.md#setting-up-authentication-for-a-scan)
- [Azure Data Explorer](register-scan-azure-data-explorer.md#setting-up-authentication-for-a-scan)
- [Azure Data Lake Storage Gen1](register-scan-adls-gen1.md#setting-up-authentication-for-a-scan)
- [Azure Data Lake Storage Gen2](register-scan-adls-gen2.md#setting-up-authentication-for-a-scan)
- [Azure SQL Database](register-scan-azure-sql-database.md)
- [Azure SQL Database Managed Instance](register-scan-azure-sql-database-managed-instance.md#setting-up-authentication-for-a-scan)
- [Azure Synapse Analytics](register-scan-azure-synapse-analytics.md#setting-up-authentication-for-a-scan)
- [SQL Server](register-scan-on-premises-sql-server.md#setting-up-authentication-for-a-scan)
- [Power BI](register-scan-power-bi-tenant.md)
- [Amazon S3](register-scan-amazon-s3.md#create-a-purview-credential-for-your-aws-bucket-scan)
## Storing your credential in your key vault and using the right secret name and version

You must also store your credential in your Azure Key Vault instance and use the right secret name and version.

Verify this by following the steps below:

1. Navigate to your Key Vault.
1. Select **Settings** > **Secrets**.
1. Select the secret you're using to authenticate against your data source for scans.
1. Select the version that you intend to use and verify that the password or account key is correct by clicking on **Show Secret Value**. 

## Verify permissions for the Purview managed identity on your Azure Key Vault

Verify that the correct permissions have been configured for the Purview managed identity to access your Azure Key Vault.

To verify this, do the following steps:

1. Navigate to your key vault and to the **Access policies** section

1. Verify that your Purview managed identity shows under the *Current access policies* section with at least **Get** and **List** permissions on Secrets

   :::image type="content" source="./media/troubleshoot-connections/verify-minimum-permissions.png" alt-text="Image showing dropdown selection of both Get and List permission options":::

If you don't see your Purview managed identity listed, then follow the steps in [Create and manage credentials for scans](manage-credentials.md) to add it. 

## Next steps

- [Browse the Azure Purview Data catalog](how-to-browse-catalog.md)
- [Search the Azure Purview Data Catalog](how-to-search-catalog.md)
