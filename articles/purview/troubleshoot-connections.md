---
title: Troubleshoot your connections in Azure Purview
description: This article explains the steps to troubleshoot your connections in Azure Purview.
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 08/08/2021
---
# Troubleshoot your connections in Azure Purview

This article describes how to troubleshoot connection errors while setting up scans on data sources in Azure Purview.

## Permission the credential on the data source

If you're using a managed identity or service principal as a method of authentication for scans, you'll have to allow these identities to have access to your data source.

There are specific instructions for each source type:

- [Azure multiple sources](register-scan-azure-multiple-sources.md#set-up-authentication-to-scan-resources-under-a-subscription-or-resource-group)
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
- [Amazon RDS](register-scan-amazon-rds.md#create-purview-credentials-for-your-rds-scan) (public preview)
- [Amazon S3](register-scan-amazon-s3.md#create-a-purview-credential-for-your-aws-bucket-scan)

## Verifying Azure Role-based Access Control to enumerate Azure resources in Azure Purview Studio

### Registering single Azure data source
To register a single data source in Azure Purview, such as an Azure Blog Storage or an Azure SQL Database, you must be granted at least **Reader** role on the resource or inherited from higher scope such as resource group or subscription. Note that some Azure RBAC roles, such as Security Admin do not have read access to view Azure resources in control plane.  

Verify this by following the steps below:

1. From the [Azure portal](https://portal.azure.com), navigate to the resource that you are trying to register in Azure Purview. If you can view the resource, it is likely, that you already have at least reader role on the resource. 
2. Select **Access control (IAM)** > **Role Assignments**.
3. Search by name or email address of the user who is trying to register data sources in Azure Purview.
4. Verify if any role assignments such as Reader exists in the list or add a new role assignment if needed.

### Scanning multiple Azure data sources
1. From the [Azure portal](https://portal.azure.com), navigate to the subscription or the resource group.  
2. Select **Access Control (IAM)** from the left menu. 
3. Select **+Add**. 
4. In the **Select input** box, select the **Reader** role and enter your Azure Purview account name (which represents its MSI name). 
5. Select **Save** to finish the role assignment.
6. Repeat the steps above to add the identity of the user who is trying to create a new scan for multiple data sources in Azure Purview.

## Scanning data sources using Private Link 
If public endpoint is restricted on your data sources, to scan Azure data sources using Private Link, you need to setup a Self-hosted integration runtime and create a credential. 

> [!IMPORTANT]
> Scanning multiple data sources which contain databases as Azure SQL database with _Deny public network access_, would fail. To scan these data sources using private Endpoint, instead use registering single data source option.

For more information about setting up a self-hosted integration runtime, see [Ingestion private endpoints and scanning sources](catalog-private-link.md#ingestion-private-endpoints-and-scanning-sources)

For more information how to create a new credential in Azure Purview, see [Credentials for source authentication in Azure Purview](manage-credentials.md#create-azure-key-vaults-connections-in-your-azure-purview-account)

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
