---
title: Azure Monitor best practices - Cost management
description: Guidance and recommendations for reducing your cost with Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/08/2022

---

# Azure Monitor best practices - Cost management
This article provides guidance on reducing your cloud monitoring costs by implementing Azure Monitor in the most cost effective manner. This includes leveraging cost saving features and ensuring that you're not paying for data collection that provides little or no value. 

## Ensure most effective pricing tier
In most Azure Monitor implementations, the highest cost will be for data ingestion and retention in your Log Analytics workspace. Since there are various 

## Determine most cost effective workspace configuration

## Consider commitments

## Reduce data collection
Because you're charged for ingestion and retention for any data you collect in your Log Analytics workspace, you can reduce your costs by reducing the amount of data you collect. The following table lists common sources of data and strategies for reducing their data volume.


| Source of high data volume | How to reduce data volume |
| -------------------------- | ------------------------- |
| Data Collection Rules      | The [Azure Monitor Agent](../agents/azure-monitor-agent-overview.md) uses Data Collection Rules to manage the collection of data. You can [limit the collection of data](../agents/data-collection-rule-azure-monitor-agent.md#limit-data-collection-with-custom-xpath-queries) using custom XPath queries. | 
| Container Insights         | [Configure Container Insights](../containers/container-insights-cost.md#controlling-ingestion-to-reduce-cost) to collect only the data you required. |
| Microsoft Sentinel | Review any [Sentinel data sources](../../sentinel/connect-data-sources.md) that you recently enabled as sources of additional data volume. [Learn more](../../sentinel/azure-sentinel-billing.md) about Sentinel costs and billing. |
| Security events            | Select [common or minimal security events](../../security-center/security-center-enable-data-collection.md#data-collection-tier). <br> Change the security audit policy to collect only needed events. In particular, review the need to collect events for: <br> - [audit filtering platform](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/dd772749(v=ws.10)). <br> - [audit registry](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/dd941614(v%3dws.10)). <br> - [audit file system](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/dd772661(v%3dws.10)). <br> - [audit kernel object](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/dd941615(v%3dws.10)). <br> - [audit handle manipulation](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/dd772626(v%3dws.10)). <br> - audit removable storage. |
| Performance counters       | Change the [performance counter configuration](../agents/data-sources-performance-counters.md) to: <br> - Reduce the frequency of collection. <br> - Reduce the number of performance counters. |
| Event logs                 | Change the [event log configuration](../agents/data-sources-windows-events.md) to: <br> - Reduce the number of event logs collected. <br> - Collect only required event levels. For example, do not collect *Information* level events. |
| Syslog                     | Change the [syslog configuration](../agents/data-sources-syslog.md) to: <br> - Reduce the number of facilities collected. <br> - Collect only required event levels. For example, do not collect *Info* and *Debug* level events. |
| AzureDiagnostics           | Change the [resource log collection](../essentials/diagnostic-settings.md#create-in-azure-portal) to: <br> - Reduce the number of resources that send logs to Log Analytics. <br> - Collect only required logs. |
| Solution data from computers that don't need the solution | Use [solution targeting](../insights/solution-targeting.md) to collect data from only required groups of computers. |
| Application Insights | Review options for [managing Application Insights data volume](../app/pricing.md#managing-your-data-volume). |
| [SQL Analytics](../insights/azure-sql.md) | Use [Set-AzSqlServerAudit](/powershell/module/az.sql/set-azsqlserveraudit) to tune the auditing settings. 


### Optimize resource logs

Since diagnostic settings don't allow for granular configuration, you may have some resources that send excessive data. This may be certain types of records that you don't require or data within records that you don't require.

## Next steps

- See [Configure data collection](best-practices-data-collection.md) for steps and recommendations to configure data collection in Azure Monitor.
