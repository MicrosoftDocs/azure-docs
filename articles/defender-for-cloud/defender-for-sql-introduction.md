---
title: Microsoft Defender for Azure SQL - the benefits and features
description: Learn how Microsoft Defender for Azure SQL protects your Azure SQL databases.
ms.date: 07/28/2022
ms.topic: overview
ms.custom: references_regions
ms.author: dacurwin
author: dcurwin
---

# Overview of Microsoft Defender for Azure SQL

Microsoft Defender for Azure SQL helps you discover and mitigate potential [database vulnerabilities](sql-azure-vulnerability-assessment-overview.md) and alerts you to [anomalous activities](#advanced-threat-protection) that may be an indication of a threat to your databases.

- [Vulnerability assessment](#discover-and-mitigate-vulnerabilities): Scan databases to discover, track, and remediate vulnerabilities. Learn more about [vulnerability assessment](sql-azure-vulnerability-assessment-overview.md).
- [Threat protection](#advanced-threat-protection): Receive detailed security alerts and recommended actions based on SQL Advanced Threat Protection to provide to mitigate threats. Learn more about [SQL Advanced Threat Protection](/azure/azure-sql/database/threat-detection-overview).

When you enable **Microsoft Defender for Azure SQL**, all supported resources that exist within the subscription are protected. Future resources created on the same subscription will also be protected.

## Availability

|Aspect|Details|
|----|:----|
|Release state:|Generally available (GA)|
|Pricing:|**Microsoft Defender for Azure SQL** is billed as shown on the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/)|
|Protected SQL versions:|Read-write replicas of:<br>- Azure SQL [single databases](/azure/azure-sql/database/single-database-overview) and [elastic pools](/azure/azure-sql/database/elastic-pool-overview)<br>- [Azure SQL Managed Instance](/azure/azure-sql/managed-instance/sql-managed-instance-paas-overview)<br>- [Azure Synapse Analytics (formerly SQL DW) dedicated SQL pool](../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md)|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Azure Government<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Microsoft Azure operated by 21Vianet (**Partial**: Subset of alerts and vulnerability assessment for SQL servers. Behavioral threat protections aren't available.)|

## What are the benefits of Microsoft Defender for Azure SQL?

### Discover and mitigate vulnerabilities

A vulnerability assessment service discovers, tracks, and helps you remediate potential database vulnerabilities. Assessment scans provide an overview of your SQL machines' security state, and details of any security findings. Defender for Azure SQL helps you identify and mitigate potential database vulnerabilities and detecting anomalous activities that could indicate threats to your databases.

Learn more about [vulnerability assessment for Azure SQL Database](./sql-azure-vulnerability-assessment-overview.md).

### Advanced threat protection

An advanced threat protection service continuously monitors your SQL servers for threats such as SQL injection, brute-force attacks, and privilege abuse. This service provides action-oriented security alerts in Microsoft Defender for Cloud with details of the suspicious activity, guidance on how to mitigate to the threats, and options for continuing your investigations with Microsoft Sentinel. Learn more about [advanced threat protection](/azure/azure-sql/database/threat-detection-overview).

Threat intelligence enriched security alerts are triggered when there's:

- **Potential SQL injection attacks** - including vulnerabilities detected when applications generate a faulty SQL statement in the database
- **Anomalous database access and query patterns** - for example, an abnormally high number of failed sign-in attempts with different credentials (a brute force attempt)
- **Suspicious database activity** - for example, a legitimate user accessing an SQL Server from a breached computer which communicated with a crypto-mining C&C server

Alerts include details of the incident that triggered them, as well as recommendations on how to investigate and remediate threats. Learn more about the [security alerts for SQL servers](alerts-reference.md#alerts-sql-db-and-warehouse).

## Next steps

In this article, you learned about Microsoft Defender for Azure SQL. Now you can:

- [Enable Microsoft Defender for Azure SQL](quickstart-enable-database-protections.md)
- [How Microsoft Defender for Azure SQL can protect SQL servers anywhere](https://www.youtube.com/watch?v=V7RdB6RSVpc).
- [Set up email notifications for security alerts](configure-email-notifications.md)