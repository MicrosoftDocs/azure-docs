---
title: Integrate with Azure security products 
description: This article describes how to connect Azure security services and Azure Purview to get enriched security experiences.
author: aashishr
ms.author: aashishr
ms.service: purview
ms.topic: how-to
ms.date: 11/05/2021
---
# Integrate Azure Purview with Azure security products

This document explains the steps required for connecting an Azure Purview account with various Azure security products to enrich security experiences with data classifications and sensitivity labels.

## Microsoft Defender for Cloud
Azure Purview provides rich insights into the sensitivity of your data. This makes it valuable to security teams using Microsoft Defender for Cloud to manage the organization’s security posture and protect against threats to their workloads. Data resources remain a popular target for malicious actors, making it crucial for security teams to identify, prioritize, and secure sensitive data resources across their cloud environments. The integration with Azure Purview expands visibility into the data layer, enabling security teams to prioritize resources that contain sensitive data.

To take advantage of this [enrichment in Microsoft Defender for Cloud](../security-center/information-protection.md), no additional steps are needed in Azure Purview. Start exploring the security enrichments with Microsoft Defender for Cloud's [Inventory page](https://portal.azure.com/#blade/Microsoft_Azure_Security/SecurityMenuBlade/25) where you can see the list of data sources with classifications and sensitivity labels.

### Supported data sources
The integration supports data sources in Azure and AWS; sensitive data discovered in these resources is shared with Microsoft Defender for Cloud:
- [Azure Blob Storage](./register-scan-azure-blob-storage-source.md)
- [Azure Cosmos DB](./register-scan-azure-cosmos-database.md)
- [Azure Data Explorer](./register-scan-azure-data-explorer.md)
- [Azure Data Lake Storage Gen1](./register-scan-adls-gen1.md)
- [Azure Data Lake Storage Gen2](./register-scan-adls-gen2.md)
- [Azure Files](./register-scan-azure-files-storage-source.md)
- [Azure Database for MySQL](./register-scan-azure-mysql-database.md)
- [Azure Database for PostgreSQL](./register-scan-azure-postgresql.md)
- [Azure SQL Database Managed Instance](./register-scan-azure-sql-database-managed-instance.md)
- [Azure Dedicated SQL pool (formerly SQL DW)](./register-scan-azure-synapse-analytics.md)
- [Azure SQL Database](./register-scan-azure-sql-database.md)
- [Azure Synapse Analytics (Workspace)](./register-scan-synapse-workspace.md)
- [Amazon S3](./register-scan-amazon-s3.md)

### Known issues
1. Data sensitivity information is currently not shared for sources hosted inside virtual machines - like SAP, Erwin, and Teradata.
2. Data sensitivity information is currently not shared for Amazon RDS.
3. Data sensitivity information is currently not shared for Azure PaaS data sources registered using a connection string. 
5. Unregistering the data source in Azure Purview doesn't remove the data sensitivity enrichment in Microsoft Defender for Cloud.
6. Deleting the Azure Purview account will persist the data sensitivity enrichment for 30 days in Microsoft Defender for Cloud.
7. Custom classifications defined in the Microsoft 365 Compliance Center or in Azure Purview are not shared with Microsoft Defender for Cloud.

## FAQ
### **Why don't I see the AWS data source I have scanned with Azure Purview in Microsoft Defender for Cloud?**

Data sources must be onboarded to Microsoft Defender for Cloud as well. Learn more about how to [connect your AWS accounts](../security-center/quickstart-onboard-aws.md) and see your AWS data sources in Microsoft Defender for Cloud.

### **Why don't I see sensitivity labels in Microsoft Defender for Cloud?**

Assets must first be labeled in Azure Purview, before the labels are shown in Microsoft Defender for Cloud. Check if you have the [prerequisites of sensitivity labels](./how-to-automatically-label-your-content.md) in place. Once your scan the data, the labels will show up in Azure Purview and then automatically in Microsoft Defender for Cloud.

## Next steps
- [Experiences in Microsoft Defender for Cloud enriched using sensitivity from Azure Purview](../security-center/information-protection.md)
