---
title: Integrate with Azure security products
description: This article describes how to connect Azure security services and Microsoft Purview to get enriched security experiences.
author: aashishr
ms.author: aashishr
ms.service: purview
ms.topic: how-to
ms.date: 03/23/2023
---
# Integrate Microsoft Purview with Azure security products

This document explains the steps required for connecting a Microsoft Purview account with various Azure security products to enrich security experiences with data classifications and sensitivity labels.

## Microsoft Defender for Cloud

Microsoft Purview provides rich insights into the sensitivity of your data. This makes it valuable to security teams using Microsoft Defender for Cloud to manage the organization’s security posture and protect against threats to their workloads. Data resources remain a popular target for malicious actors, making it crucial for security teams to identify, prioritize, and secure sensitive data resources across their cloud environments. The integration with Microsoft Purview expands visibility into the data layer, enabling security teams to prioritize resources that contain sensitive data.

Classifications and labels applied to data resources in Microsoft Purview are ingested into Microsoft Defender for Cloud, which provides valuable context for protecting resources. Microsoft Defender for Cloud uses the resource classifications and labels to identify potential [attack paths](../defender-for-cloud/how-to-manage-attack-path.md) and [security risks](../defender-for-cloud/how-to-manage-cloud-security-explorer.md) related to sensitive data. The resources in the Defender for Cloud's Inventory and Alerts pages are also enriched with the classifications and labels discovered by Microsoft Purview, so your security teams can filter and focus to prioritize protecting your most sensitive assets.

To take advantage of this [enrichment in Microsoft Defender for Cloud](../security-center/information-protection.md), no more steps are needed in Microsoft Purview. Start exploring the security enrichments with Microsoft Defender for Cloud's [Inventory page](https://portal.azure.com/#blade/Microsoft_Azure_Security/SecurityMenuBlade/25) where you can see the list of data sources with classifications and sensitivity labels.

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
- [Azure SQL Managed Instance](./register-scan-azure-sql-managed-instance.md)
- [Azure Dedicated SQL pool (formerly SQL DW)](./register-scan-azure-synapse-analytics.md)
- [Azure SQL Database](./register-scan-azure-sql-database.md)
- [Azure Synapse Analytics (Workspace)](./register-scan-synapse-workspace.md)
- [Amazon S3](./register-scan-amazon-s3.md)

### Known issues

- Data sensitivity information is currently not shared for sources hosted inside virtual machines - like SAP, Erwin, and Teradata.
- Data sensitivity information is currently not shared for Amazon RDS.
- Data sensitivity information is currently not shared for Azure PaaS data sources registered using a connection string.
- Unregistering the data source in Microsoft Purview doesn't remove the data sensitivity enrichment in Microsoft Defender for Cloud.
- Deleting the Microsoft Purview account will persist the data sensitivity enrichment for 30 days in Microsoft Defender for Cloud.
- Custom classifications defined in the Microsoft Purview compliance portal or Microsoft Purview governance portal aren't shared with Microsoft Defender for Cloud.

### FAQ

#### **Why don't I see the AWS data source I have scanned with Microsoft Purview in Microsoft Defender for Cloud?**

Data sources must be onboarded to Microsoft Defender for Cloud as well. Learn more about how to [connect your AWS accounts](../security-center/quickstart-onboard-aws.md) and see your AWS data sources in Microsoft Defender for Cloud.

#### **Why don't I see sensitivity labels in Microsoft Defender for Cloud?**

Assets must first be labeled in Microsoft Purview Data Map, before the labels are shown in Microsoft Defender for Cloud. Check if you have the necessary [prerequisites for sensitivity labels](./how-to-automatically-label-your-content.md) in place. After you've scanned the data, the labels will show up in Microsoft Purview Data Map and then automatically in Microsoft Defender for Cloud.

## Microsoft Sentinel

Microsoft Sentinel is a scalable, cloud-native, solution for both security information and event management (SIEM), and security orchestration, automation, and response (SOAR). Microsoft Sentinel delivers intelligent security analytics and threat intelligence across the enterprise, providing a single solution for attack detection, threat visibility, proactive hunting, and threat response.

Integrate Microsoft Purview with Microsoft Sentinel to gain visibility into where on your network sensitive information is stored, in a way that helps you prioritize at-risk data for protection, and understand the most critical incidents and threats to investigate in Microsoft Sentinel.

1. Start by ingesting your Microsoft Purview logs into Microsoft Sentinel through a data source.
1. Then use a Microsoft Sentinel workbook to view data such as assets scanned, classifications found, and labels applied by Microsoft Purview.
1. Use analytics rules to create alerts for changes within data sensitivity.

Customize the Microsoft Purview workbook and analytics rules to best suit the needs of your organization, and combine Microsoft Purview logs with data ingested from other sources to create enriched insights within Microsoft Sentinel.

For more information, see [Tutorial: Integrate Microsoft Sentinel and Microsoft Purview](../sentinel/purview-solution.md).

## Next steps

- [Experiences in Microsoft Defender for Cloud enriched using sensitivity from Microsoft Purview](../security-center/information-protection.md)
