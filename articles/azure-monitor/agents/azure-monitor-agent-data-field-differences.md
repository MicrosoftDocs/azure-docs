---
title: Data field differences between MMA and AMA 
description: Documents that field lever data changes made in the migration.
author: JeffreyWolford
ms.author: jeffwo
ms.reviewer: guywild
ms.topic: reference
ms.date: 06/21/2024
Customer intent: As an azure administrator, I want to understand which Log Analytics Workspace queries I may need to update after AMA migration.
---

# AMA agent data field differences from MMA

[Azure Monitor Agent (AMA)](./agents-overview.md) replaces the Log Analytics agent, also known as Microsoft Monitor Agent (MMA) and OMS, for Windows and Linux machines, in Azure and non-Azure environments, on-premises and other clouds. The agent introduces a simplified, flexible method of configuring data collection using [Data Collection Rules (DCRs)](../essentials/data-collection-rule-overview.md). The article provides information on the data fields that change when collected by AMA, which is critical information for you to migrate your LAW queries.

Each of the data changes was carefully considered and the rational for each change is provided in the table. If you encounter a data field that isn't in the tables file a support request. Your help keeping the tables current and complete is appreciated.

## Log analytics workspace tables

### W3CIISLog table for Internet Information Services (IIS)

This table collects log data from the Internet Information Service on Window systems.

| LAW Field | Difference | Reason | Additional Information |
|-----------|------------|--------|------------------------|
| sSiteName | Not be populated | depends on customer data collection configuration | The MMA agent could turn on collection by default, but by principle is restricted from making configuration changes in other services.<p>Enable the `Service Name (s-sitename)` field in W3C logging of IIS. See [Select W3C Fields to Log](/iis/manage/provisioning-and-managing-iis/configure-logging-in-iis#select-w3c-fields-to-log).|
| Fileuri | No longer populated | not required for MMA parity | MMA doesn't collect this field. This field was only populated for IIS logs collected from Azure Cloud Services through the Azure Diagnostics Extension. |

### Windows event table

This table collects Events from the Windows Event log. There are two other tables that are used to store Windows events, the SecurityEvent and Event tables.

| LAW Field | Difference | Reason | Additional Information |
|-----------|------------|--------|------------------------|
| UserName | MMA enriches the event with the username before sending the event for ingestion. AMA doesn't do the same enrichment. | The AMA enrichment isn't implemented yet. | AMA principles dictate that the event data should remain unchanged by default. Adding and enriched field adds possible processing errors and extra costs for storage. In this case, the customer demand for the field is very high and work is underway to add the username. |

### Perf table for performance counters

The perf table collects performance counters from Windows and Linux agents. It offers valuable insights into the performance of hardware components, operating systems, and applications. The following table shows key differences in how data is reported between OMS and Azure Monitor Agent (AMA).

| LAW Field    | Difference | Reason | Additional Information |
|--------------|------------|--------|------------------------|
| InstanceName | Reported as **_Total** by OMS<br>Reported as **total** by AMA | | Where `ObjectName` is **"Logical Disk"** and `CounterName` is **"% Used Space"**, the `InstanceName` value is reported as **_Total** for records ingested by the OMS agent, and as **total** for records ingested by the Azure Monitor Agent (AMA).\* |
| CounterValue | Is rounded to the nearest whole number by OMS but not rounded by AMA | | Where `ObjectName` is **"Logical Disk"** and `CounterName` is **"% Used Space"**, the `CounterValue` value is rounded to the nearest whole number for records ingested by the OMS agent but not rounded for records ingested by the Azure Monitor Agent (AMA).\* |

\* Doesn't apply to records ingested by the Microsoft Monitoring Agent (MMA) on Windows.

:::image type="content" source="./media/azure-monitor-agent-data-field-differences/oms-agent-vs-ama.png" alt-text="Screenshot that shows the **Availability** tab with SLA Report highlighted." lightbox="./media/azure-monitor-agent-data-field-differences/oms-agent-vs-ama.png":::

## Next steps

* [Azure Monitor Agent migration helper workbook](./azure-monitor-agent-migration-helper-workbook.md)
* [DCR Config Generator](./azure-monitor-agent-migration-data-collection-rule-generator.md)

