---
title: Data Field Differences between MMA and AMA 
description: Documents that field lever data changes made in the migration.
author: jeffwo-MSFT
ms.author: jeffwo
ms.reviewer: guywild
ms.topic: reference
ms.date: 06/21/2024

# Customer intent: As an azure administrator, I want to understand which Log Analytics Workspace queries I may need to update after AMA migration.

---

# Purpose
[Azure Monitor Agent (AMA)](./agents-overview.md) replaces the Log Analytics agent, also known as Microsoft Monitor Agent (MMA) and OMS, for Windows and Linux machines, in Azure and non-Azure environments, on-premises and other clouds. The agent introduces a simplified, flexible method of configuring data collection using [Data Collection Rules (DCRs)](../essentials/data-collection-rule-overview.md). This article provides information on the data fields that will change in a log Analytics Workspace after the migration to AMA. This provides critical information to you for the migration of LAW data queries.
Each of the data changes was carefully considered and the rational for each change is provided in the table below.  If you encounter a date element change that is not in the tables in this article, please file a support request. This will help us keep the tables current and complete.
# Log Analytics Workspace Tables
## W3CIISLog Table
This table collects log data from the Internet Information Service on Window systems.

|LAW Field | Difference | Reason| Additional Information |
|---|---|---|---|
| sSiteName | may not be populated | depends on customer data collection configuration | The MMA agent could turn on collection by default, but the AMA is prevented by principle from making configuration changes in other services.<p>Enable the `Service Name (s-sitename)` field in W3C logging of IIS, see [Select W3C Fields to Log](/iis/manage/provisioning-and-managing-iis/configure-logging-in-iis#select-w3c-fields-to-log).|
| Fileuri | No longer populated | not required for MMA parity | This field was only populated for IIS logs collected from Azure Cloud Services through the Azure Diagnostics Extension. It was not collected by MMA and thus is not collected by AMA|


## Next steps
- [Azure Monitor Agent migration helper workbook](./azure-monitor-agent-migration-helper-workbook.md)
- [DCR Config Generator](./azure-monitor-agent-migration-data-collection-rule-generator.md)
- [MMA Discovery and Removal tool](/azure/azure-monitor/agents/azure-monitor-agent-mma-removal-tool?tabs=single-tenant%2Cdiscovery)
