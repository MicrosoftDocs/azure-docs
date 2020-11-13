---
title: Azure Defender for SQL - the benefits and features
description: Learn about the benefits and features of Azure Defender for SQL.
author: memildin
ms.author: memildin
ms.date: 9/22/2020
ms.topic: overview
ms.service: security-center
ms.custom: references_regions
manager: rkarlin

---

# Introduction to Azure Defender for SQL

Azure Defender for SQL includes two Azure Defender plans that extend Azure Security Center's [data security package](../azure-sql/database/azure-defender-for-sql.md) to secure your databases and their data wherever they're located. 

## Availability

|Aspect|Details|
|----|:----|
|Release state:|**Azure Defender for Azure SQL database servers** - Generally available (GA)<br>**Azure Defender for SQL servers on machines** - Preview<br>[!INCLUDE [Legalese](../../includes/security-center-preview-legal-text.md)] |
|Pricing:|The two plans that form **Azure Defender for SQL** are billed as shown on [the pricing page](security-center-pricing.md)|
|Protected SQL versions:|Azure SQL Database <br>Azure SQL Managed Instance<br>Azure Synapse Analytics (formerly SQL DW)<br>SQL Server (all supported versions)|
|Clouds:|![Yes](./media/icons/yes-icon.png) Commercial clouds<br>![Yes](./media/icons/yes-icon.png) US Gov<br>![No](./media/icons/no-icon.png) China Gov, Other Gov|
|||

## What does Azure Defender for SQL protect?

**Azure Defender for SQL** comprises two separate Azure Defender plans:

- **Azure Defender for Azure SQL database servers** protects:
  - [Azure SQL Database](../azure-sql/database/sql-database-paas-overview.md)
  - [Azure SQL Managed Instance](../azure-sql/managed-instance/sql-managed-instance-paas-overview.md)
  - [Azure Synapse Analytics](../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md)

- **Azure Defender for SQL servers on machines (Preview)** extends the protections for your Azure-native SQL Servers to fully support hybrid environments and protect SQL servers (all supported version) hosted in Azure, other cloud environments, and even on-premises machines


## What are the benefits of Azure Defender for SQL?

These two plans include functionality for identifying and mitigating potential database vulnerabilities and detecting anomalous activities that could indicate threats to your databases:

- [Vulnerability assessment](../azure-sql/database/sql-vulnerability-assessment.md) - The scanning service to discover, track, and help you remediate potential database vulnerabilities. Assessment scans provide an overview of your SQL machines' security state, and details of any security findings.

- [Advanced threat protection](../azure-sql/database/threat-detection-overview.md) - The detection service that continuously monitors your SQL servers for threats such as SQL injection, brute-force attacks, and privilege abuse. This service provides action-oriented security alerts in Azure Security Center with details of the suspicious activity, guidance on how to mitigate to the threats, and options for continuing your investigations with Azure Sentinel.


## What kind of alerts does Azure Defender for SQL provide?

Security alerts are triggered when there's:

- **Potential SQL injection attacks** - including vulnerabilities detected when applications generate a faulty SQL statement in the database
- **Anomalous database access and query patterns** - for example, an abnormally high number of failed sign-in attempts with different credentials (a brute force attempt)
- **Suspicious database activity** - for example, a change in the export storage destination for a SQL import and export operation

Alerts include details of the incident that triggered them, as well as recommendations on how to investigate and remediate threats.



## Next steps

In this article, you learned about Azure Defender for SQL.

For related material, see the following articles: 

- [How to enable Azure Defender for SQL servers on machines](defender-for-sql-usage.md)
- [How to enable Azure Defender for SQL database servers](../azure-sql/database/azure-defender-for-sql.md)
- [The list of Azure Defender alerts for SQL](alerts-reference.md#alerts-sql-db-and-warehouse)