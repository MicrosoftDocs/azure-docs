---
title: Azure Defender for SQL - the benefits and features
description: Learn about the benefits and features of Azure Defender for SQL.
author: memildin
ms.author: memildin
ms.date: 9/12/2020
ms.topic: conceptual
ms.service: security-center
manager: rkarlin

---

# Introduction to Azure Defender for SQL

**Azure Defender for SQL** protects SQL Servers hosted in Azure, on other cloud environments, and even on-premises machines. This extends the protections for your Azure-native SQL Servers to fully support hybrid environments.

This preview feature includes functionality for identifying and mitigating potential database vulnerabilities and detecting anomalous activities that could indicate threats to your database: 

- **Vulnerability assessment** - The scanning service to discover, track, and help you remediate potential database vulnerabilities. Assessment scans provide an overview of your SQL machines' security state, and details of any security findings.

- [Advanced threat protection](https://docs.microsoft.com/azure/sql-database/sql-database-threat-detection-overview) - The detection service that continuously monitors your SQL servers for threats such as SQL injection, brute-force attacks, and privilege abuse. This service provides action-oriented security alerts in Azure Security Center with details of the suspicious activity, guidance on how to mitigate to the threats, and options for continuing your investigations with Azure Sentinel.

>[!TIP]
> Azure Defender for SQL is an extension of Azure Security Center's [data security package](https://docs.microsoft.com/azure/sql-database/sql-database-advanced-data-security), available for Azure SQL Database, Azure Synapse, and SQL Managed Instance.




## Next steps

In this article, you learned about Azure Defender for SQL.

For related material, see the following articles: 

- [How to enable Azure Defender for SQL](defender-for-sql-usage.md)
- [The list of Azure Defender alerts for SQL](alerts-reference.md#alerts-sql-db-and-warehouse)