---
title: Azure Migrate Reports Overview 
description: Learn how Azure Migrate Reports help you create decision‑ready reports with insights into security, readiness, cost, ROI, and migration strategies for Azure planning
author: habibaum
ms.author: v-uhabiba
ms.topic: how-to
ms.service: azure-migrate
ms.date: 03/25/2026
monikerRange:
# Customer intent: As an IT administrator managing migration resources, I want to tag workloads with relevant attributes, so that I can enhance resource organization and visibility during the migration process.
---

# Overview of Azure Migrate reports (preview)

Azure Migrate reports provide a summarized view of Migration and modernization opportunities to Azure. They include insights on workload readiness, security, and costs to help you prioritize workloads and make informed migration and modernization decisions. Reports can be generated after successful discovery and inventory enrichment.
 
## What are Azure Migrate reports? 

Reports in Azure Migrate provide decision-ready insights by summarizing your discovered estate and highlighting migration and modernization opportunities across applications, infrastructure, and data to support planning and stakeholder decision-making.

Depending on the selected report type and scenario, reports can summarize insights such as:
- Workload and application summary across your discovered estate, including web apps, databases, and file servers.
- Security insights and vulnerability summary for discovered workloads.
- Utilization summary for workloads across the estate.
- Software inventory summary, including the types of software supporting your applications.
- Total cost of ownership (TCO) and return on investment (ROI) considerations for migration and modernization scenarios.
- Value realization of Azure, including potential savings through Azure benefits, management solutions, and pricing options.
- Readiness, target recommendations, and Azure cost insights for workloads based on the selected migration preference. 
- High-level migration wave plan to support phased migration planning.
- Exportable, read-only outputs available in PowerPoint and Excel formats.
 
## Types of reports 

Azure Migrate provides the following reports to help you assess your environment and plan your migration and modernization journey:

- [Azure modernization and migration report](#azure-modernization-and-migration-report).
- [Security insights report](#security-insights-report).

### Azure modernization and migration report

The Azure modernization and migration report provides a consolidated view of migration and modernization opportunities across applications, infrastructure, data, web apps, file share servers, and software.

This report helps you:

- Understand your current environment and infrastructure.
- Assess security and vulnerability posture.
- Identify software that supports your applications.
- Determine recommended Azure target services, readiness, SKUs, and estimated Azure costs for your selected migration strategy.
- Evaluate return on investment (ROI), business value, and potential savings to support stakeholder discussions and executive decision-making.

[Learn more](#migration-preferences-in-azure-migrate-reports) about the migration strategies supported by the Azure modernization and migration report.

### Security insights report

The Security insights report provides an overview of the security assessment for infrastructure, software, web apps, and databases discovered in your datacenter.

This report helps you:

- Understand your overall security posture
- Identify vulnerabilities in your on-premises environment

## Migration preferences in Azure Migrate reports

When you build a report, choose from two migration preferences:

| **Migration Strategy** |  **Details**  | **Assessment insights**|
| --- | --- | --- |
| **Modernize (Platform as a Service)** | You can get a PaaS preferred recommendation that means, the logic identifies workloads best fit for PaaS targets.<br><br>General servers are recommended with a quick lift and shift recommendation to Azure IaaS. | For SQL Servers, sizing and cost comes from the Recommended report with optimization strategy - *Modernize to PaaS* from Azure SQL assessment.<br><br>For web apps, sizing and cost comes from Azure App Service and Azure Kubernetes Service assessments, with a preference to App Service. For general servers, sizing and cost comes from Azure VM assessment.<br><br>All of these recommendations are aggregated using the heterogeneous assessments. |
| **Migrate (Infrastructure as a Service)** | You can get a quick lift and shift recommendation to Azure IaaS (Azure VM or Azure AVS). | **When Lift and Shift to Azure VM is selected:**<br>For SQL Servers, sizing and cost comes from the *Instance to SQL Server on Azure VM report*.<br><br>For general servers and servers hosting web apps, sizing and cost comes from Azure VM assessment.<br><br>All of these recommendations are aggregated using heterogeneous assessments.<br><br>**When Lift and Shift to Azure VMware Solution is selected:**<br>For all general servers, hosted on VMware, sizing and cost comes from Azure VMware Solution (AVS) assessment.<br><br>All of these recommendations are aggregated using the heterogeneous assessments. |

Reports surface Azure recommendations from heterogeneous assessments and provide direct access to those assessments. To review sizing, readiness, and Azure cost estimates in detail, open the relevant assessment for the selected applications or workloads.

### Discovery sources

Create a report using either of the following discovery methods:

- **Azure Migrate appliance or Azure Migrate collector–based discovery**: Provides the most accurate inventory, metadata, and performance data.
- **CSV import**: Provides a quick estimate when inventory data is available in CSV format.

### Report configuration

Configure report generation in one of the following ways:

- **Define configuration**: Specify the scope, settings, and configuration to use when generating the report.
- **Use configuration from an existing assessment**: Select an existing assessment and reuse its scope, settings, and configuration to generate the report.

## Next steps 

- Learn how to [build a report](how-to-build-a-report.md). 