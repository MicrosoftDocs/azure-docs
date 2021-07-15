---
title: Azure Defender for SQL - the benefits and features
description: Learn about the benefits and features of Azure Defender for SQL.
author: memildin
ms.author: memildin
ms.date: 05/27/2021
ms.topic: overview
ms.service: security-center
ms.custom: references_regions
manager: rkarlin

---

# Introduction to Azure Defender for SQL

Azure Defender for SQL includes two Azure Defender plans that extend Azure Security Center's [data security package](../azure-sql/database/azure-defender-for-sql.md) to secure your databases and their data wherever they're located. Azure Defender for SQL includes functionalities for discovering and mitigating potential database vulnerabilities, and detecting anomalous activities that could indicate a threat to your databases.

## Availability

|Aspect|Details|
|----|:----|
|Release state:|**Azure Defender for Azure SQL database servers** - Generally available (GA)<br>**Azure Defender for SQL servers on machines** - Generally available (GA) |
|Pricing:|The two plans that form **Azure Defender for SQL** are billed as shown on [Security Center pricing](https://azure.microsoft.com/pricing/details/security-center/)|
|Protected SQL versions:|[SQL on Azure virtual machines](../azure-sql/virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview.md)<br>[Azure Arc enabled SQL servers](/sql/sql-server/azure-arc/overview)<br>On-premises SQL servers on Windows machines without Azure Arc<br>Azure SQL [single databases](../azure-sql/database/single-database-overview.md) and [elastic pools](../azure-sql/database/elastic-pool-overview.md)<br>[Azure SQL Managed Instance](../azure-sql/managed-instance/sql-managed-instance-paas-overview.md)<br>[Azure Synapse Analytics (formerly SQL DW) dedicated SQL pool](../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md)|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: US Gov<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Azure China (**Partial**: Subset of alerts and vulnerability assessment for SQL servers. Behavioral threat protections aren't available.)|
|||

## What does Azure Defender for SQL protect?

**Azure Defender for SQL** comprises two separate Azure Defender plans:

- **Azure Defender for Azure SQL database servers** protects:
    - [Azure SQL Database](../azure-sql/database/sql-database-paas-overview.md)
    - [Azure SQL Managed Instance](../azure-sql/managed-instance/sql-managed-instance-paas-overview.md)
    - [Dedicated SQL pool in Azure Synapse](../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md)

- **Azure Defender for SQL servers on machines** extends the protections for your Azure-native SQL Servers to fully support hybrid environments and protect SQL servers (all supported version) hosted in Azure, other cloud environments, and even on-premises machines:
    - [SQL Server on Virtual Machines](https://azure.microsoft.com/services/virtual-machines/sql-server/)
    - On-premises SQL servers:
        - [Azure Arc enabled SQL Server (preview)](/sql/sql-server/azure-arc/overview)
        - [SQL Server running on Windows machines without Azure Arc](../azure-monitor/agents/agent-windows.md)


## What are the benefits of Azure Defender for SQL?

These two plans include functionality for identifying and mitigating potential database vulnerabilities and detecting anomalous activities that could indicate threats to your databases.

A vulnerability assessment service discovers, tracks, and helps you remediate potential database vulnerabilities. Assessment scans provide an overview of your SQL machines' security state, and details of any security findings.

- Learn more about [vulnerability assessment for Azure SQL Database](../azure-sql/database/sql-vulnerability-assessment.md).
- Learn more about [vulnerability assessment for Azure SQL servers on machines](defender-for-sql-on-machines-vulnerability-assessment.md).

An advanced threat protection service continuously monitors your SQL servers for threats such as SQL injection, brute-force attacks, and privilege abuse. This service provides action-oriented security alerts in Azure Security Center with details of the suspicious activity, guidance on how to mitigate to the threats, and options for continuing your investigations with Azure Sentinel. Learn more about [advanced threat protection](../azure-sql/database/threat-detection-overview.md).

 > [!TIP]
 > View the list of security alerts for SQL servers [in the alerts reference page](alerts-reference.md#alerts-sql-db-and-warehouse).


## Is there a performance impact from deploying Azure Defender for SQL on machines?

The focus of **Azure Defender for SQL on machines** is obviously security. But we also care about your business and so we've prioritized performance to ensure the minimal impact on your SQL servers. 

The service has a split architecture to balance data uploading and speed with performance: 

- some of our detectors run on the machine for real-time speed advantages
- others run in the cloud to spare the machine from heavy computational loads

Lab tests of our solution, comparing it against benchmark loads, showed CPU usage averaging 3% for peak slices. An analysis of the telemetry for our current users shows a negligible impact on CPU and memory usage.

Of course, performance always varies between environments, machines, and loads. The statements and numbers above are provided as a general guideline, not a guarantee for any individual deployment.


## What kind of alerts does Azure Defender for SQL provide?

Threat intelligence enriched security alerts are triggered when there's:

- **Potential SQL injection attacks** - including vulnerabilities detected when applications generate a faulty SQL statement in the database
- **Anomalous database access and query patterns** - for example, an abnormally high number of failed sign-in attempts with different credentials (a brute force attempt)
- **Suspicious database activity** - for example, a legitimate user accessing an SQL Server from a breached computer which communicated with a crypto-mining C&C server

Alerts include details of the incident that triggered them, as well as recommendations on how to investigate and remediate threats.



## Next steps

In this article, you learned about Azure Defender for SQL. To use the services that have been described:

- Use Azure Defender for SQL servers on machines to [scan your SQL servers for vulnerabilities](defender-for-sql-usage.md)
- For a presentation of Azure Defender for SQL, see [how Azure Defender for SQL can protect SQL servers anywhere](https://www.youtube.com/watch?v=V7RdB6RSVpc)
