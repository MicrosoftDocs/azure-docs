---
title: Microsoft Defender for SQL - the benefits and features
description: Learn about the benefits and features of Microsoft Defender for SQL.
ms.date: 01/06/2022
ms.topic: overview
ms.author: benmansheim
author: bmansheim
ms.custom: references_regions
---

# Introduction to Microsoft Defender for SQL

Microsoft Defender for SQL includes two Microsoft Defender plans that extend Microsoft Defender for Cloud's [data security package](/azure/azure-sql/database/azure-defender-for-sql) to secure your databases and their data wherever they're located. Microsoft Defender for SQL includes functionalities for discovering and mitigating potential database vulnerabilities, and detecting anomalous activities that could indicate a threat to your databases.

## Availability

|Aspect|Details|
|----|:----|
|Release state:|**Microsoft Defender for Azure SQL database servers** - Generally available (GA)<br>**Microsoft Defender for SQL servers on machines** - Generally available (GA) |
|Pricing:|The two plans that form **Microsoft Defender for SQL** are billed as shown on the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/)|
|Protected SQL versions:|[SQL on Azure virtual machines](/azure/azure-sql/virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview)<br>[SQL Server on Azure Arc-enabled servers](/sql/sql-server/azure-arc/overview)<br>On-premises SQL servers on Windows machines without Azure Arc<br>Azure SQL [single databases](/azure/azure-sql/database/single-database-overview) and [elastic pools](/azure/azure-sql/database/elastic-pool-overview)<br>[Azure SQL Managed Instance](/azure/azure-sql/managed-instance/sql-managed-instance-paas-overview)<br>[Azure Synapse Analytics (formerly SQL DW) dedicated SQL pool](../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md)|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Azure Government<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Azure China 21Vianet (**Partial**: Subset of alerts and vulnerability assessment for SQL servers. Behavioral threat protections aren't available.)|


## What does Microsoft Defender for SQL protect?

**Microsoft Defender for SQL** comprises two separate Microsoft Defender plans:

- **Microsoft Defender for Azure SQL database servers** protects:
    - [Azure SQL Database](/azure/azure-sql/database/sql-database-paas-overview)
    - [Azure SQL Managed Instance](/azure/azure-sql/managed-instance/sql-managed-instance-paas-overview)
    - [Dedicated SQL pool in Azure Synapse](../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md)

- **Microsoft Defender for SQL servers on machines** extends the protections for your Azure-native SQL Servers to fully support hybrid environments and protect SQL servers (all supported version) hosted in Azure, other cloud environments, and even on-premises machines:
    - [SQL Server on Virtual Machines](https://azure.microsoft.com/services/virtual-machines/sql-server/)
    - On-premises SQL servers:
        - [Azure Arc-enabled SQL Server (preview)](/sql/sql-server/azure-arc/overview)
        - [SQL Server running on Windows machines without Azure Arc](../azure-monitor/agents/agent-windows.md)

When you enable either of these plans, all supported resources that exist within the subscription are protected. Future resources created on the same subscription will also be protected. 

## What are the benefits of Microsoft Defender for SQL?

These two plans include functionality for identifying and mitigating potential database vulnerabilities and detecting anomalous activities that could indicate threats to your databases.

A vulnerability assessment service discovers, tracks, and helps you remediate potential database vulnerabilities. Assessment scans provide an overview of your SQL machines' security state, and details of any security findings.

- Learn more about [vulnerability assessment for Azure SQL Database](/azure/azure-sql/database/sql-vulnerability-assessment).
- Learn more about [vulnerability assessment for Azure SQL servers on machines](defender-for-sql-on-machines-vulnerability-assessment.md).

An advanced threat protection service continuously monitors your SQL servers for threats such as SQL injection, brute-force attacks, and privilege abuse. This service provides action-oriented security alerts in Microsoft Defender for Cloud with details of the suspicious activity, guidance on how to mitigate to the threats, and options for continuing your investigations with Microsoft Sentinel. Learn more about [advanced threat protection](/azure/azure-sql/database/threat-detection-overview).

 > [!TIP]
 > View the list of security alerts for SQL servers [in the alerts reference page](alerts-reference.md#alerts-sql-db-and-warehouse).


## Is there a performance impact from deploying Microsoft Defender for SQL on machines?

The focus of **Microsoft Defender for SQL on machines** is obviously security. But we also care about your business and so we've prioritized performance to ensure the minimal impact on your SQL servers. 

The service has a split architecture to balance data uploading and speed with performance: 

- Some of our detectors, including an [extended events trace](/azure/azure-sql/database/xevent-db-diff-from-svr) named `SQLAdvancedThreatProtectionTraffic`, run on the machine for real-time speed advantages.
- Other detectors run in the cloud to spare the machine from heavy computational loads.

Lab tests of our solution, comparing it against benchmark loads, showed CPU usage averaging 3% for peak slices. An analysis of the telemetry for our current users shows a negligible impact on CPU and memory usage.

Of course, performance always varies between environments, machines, and loads. The statements and numbers above are provided as a general guideline, not a guarantee for any individual deployment.


## What kind of alerts does Microsoft Defender for SQL provide?

Threat intelligence enriched security alerts are triggered when there's:

- **Potential SQL injection attacks** - including vulnerabilities detected when applications generate a faulty SQL statement in the database
- **Anomalous database access and query patterns** - for example, an abnormally high number of failed sign-in attempts with different credentials (a brute force attempt)
- **Suspicious database activity** - for example, a legitimate user accessing an SQL Server from a breached computer which communicated with a crypto-mining C&C server

Alerts include details of the incident that triggered them, as well as recommendations on how to investigate and remediate threats.



## Next steps

In this article, you learned about Microsoft Defender for SQL. To use the services that have been described:

- Use Microsoft Defender for SQL servers on machines to [scan your SQL servers for vulnerabilities](defender-for-sql-usage.md)
- For a presentation of Microsoft Defender for SQL, see [how Microsoft Defender for SQL can protect SQL servers anywhere](https://www.youtube.com/watch?v=V7RdB6RSVpc)
