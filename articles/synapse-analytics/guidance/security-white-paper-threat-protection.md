---
title: "Azure Synapse Analytics security white paper: Threat detection"
description: Audit, protect, and monitor Azure Synapse Analytics.
author: SnehaGunda
ms.author: sngun
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 01/14/2022
---

# Azure Synapse Analytics security white paper: Threat detection

[!INCLUDE [security-white-paper-context](includes/security-white-paper-context.md)]

Azure Synapse provides SQL Auditing, SQL Threat Detection, and Vulnerability Assessment to audit, protect, and monitor databases.

## Auditing

[Auditing for Azure SQL Database](/azure/azure-sql/database/auditing-overview#overview) and Azure Synapse tracks database events and writes them to an audit log in an Azure storage account, Log Analytics workspace, or Event Hubs. For any database, auditing is important. It produces an audit trail over time to help understand database activity and gain insight into discrepancies and anomalies that could indicate business concerns or suspected security violations.
Used with [Data discovery and classification](/azure/azure-sql/database/data-discovery-and-classification-overview), when any sensitive columns or tables are queried by users, entries will appear in a field named **data_sensitivity_information** of the **sql_audit_information** table.

> [!NOTE]
> Azure SQL Auditing applies to Azure Synapse, dedicated SQL pool (formerly SQL DW), and serverless SQL pool, but it doesn't apply to Apache Spark pool.

## Threat detection

[Microsoft Defender for Cloud](../../defender-for-cloud/defender-for-cloud-introduction.md) is a tool for security posture management and threat detection. It protects workloads running in Azure, including (but not exclusively) servers, app service, key vaults, Kubernetes services, storage accounts, and Azure SQL Databases.

As one of the options available with Microsoft Defender for Cloud, [Microsoft Defender for SQL](/azure/azure-sql/database/azure-defender-for-sql) extends Defender for Cloud's data security package to secure databases. It can discover and mitigate potential database vulnerabilities by detecting anomalous activities that could be a potential threat to the database. Specifically, it continually monitors your database for:

> [!div class="checklist"]
> - Potential SQL injection attacks
> - Anomalous database access and queries
> - Suspicious database activity

Alert notifications include details of the incident, and recommendations on how to investigate and remediate threats.

> [!NOTE]
> Microsoft Defender for SQL applies to Azure Synapse and dedicated SQL pool (formerly SQL DW). It doesn't apply to serverless SQL pool or Apache Spark pool.

## Vulnerability assessment

[SQL vulnerability assessment](/sql/relational-databases/security/sql-vulnerability-assessment) is part of the Microsoft Defender for SQL offering. It continually monitors the data warehouse, ensuring that databases are always maintained at a high level of security and that organizational policies are met. It provides a comprehensive security report along with actionable remediation steps for each issue found, making it easy to proactively manage database security stature even if you're not a security expert.

> [!NOTE]
> SQL vulnerability assessment applies to Azure Synapse and dedicated SQL pool (formerly SQL DW). It doesn't apply to serverless SQL pool or Apache Spark pool.

## Compliance

For an overview of Azure compliance offerings, download the latest version of the [Microsoft Azure Compliance Offerings](https://azure.microsoft.com/resources/microsoft-azure-compliance-offerings/) document.

## Next steps

For more information related to this white paper, check out the following resources:

- [Azure Synapse Analytics Blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/bg-p/AzureSynapseAnalyticsBlog)
- [Azure security baseline for Azure Synapse dedicated SQL pool (formerly SQL DW)](/security/benchmark/azure/baselines/synapse-analytics-security-baseline)
- [Overview of the Microsoft cloud security benchmark](/security/benchmark/azure/overview)
- [Security baselines for Azure](/security/benchmark/azure/security-baselines-overview)
