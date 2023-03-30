---
title: Azure Structured Firewall Logs (preview)
description: Learn about Azure Structured Firewall Logs (preview)
services: firewall
author: vhorne
ms.service: firewall
ms.topic: conceptual
ms.date: 01/25/2023
ms.author: victorh
---

# Azure Structured Firewall Logs (preview)


> [!IMPORTANT]
> This feature is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Currently, the following diagnostic log categories are available for Azure Firewall:
- Application rule log
- Network rule log
- DNS proxy log

These log categories use [Azure diagnostics mode](../azure-monitor/essentials/resource-logs.md#azure-diagnostics-mode). In this mode, all data from any diagnostic setting will be collected in the [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics) table.

With this new feature, you'll be able to choose to use [Resource Specific Tables](../azure-monitor/essentials/resource-logs.md#resource-specific) instead of the existing [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics) table. In case both sets of logs are required, at least two diagnostic settings need to be created per firewall.

## Resource specific mode

In **Resource specific** mode, individual tables in the selected workspace are created for each category selected in the diagnostic setting. This method is recommended since it:
- makes it much easier to work with the data in log queries
- makes it easier to discover schemas and their structure
- improves performance across both ingestion latency and query times
- allows you to grant Azure RBAC rights on a specific table

New resource specific tables are now available in Diagnostic setting that allows you to utilize the following newly added categories:

- [Network rule log](/azure/azure-monitor/reference/tables/azfwnetworkrule) - Contains all Network Rule log data. Each match between data plane and network rule creates a log entry with the data plane packet and the matched rule's attributes.
- [NAT rule log](/azure/azure-monitor/reference/tables/azfwnatrule) - Contains all DNAT (Destination Network Address Translation) events log data. Each match between data plane and DNAT rule creates a log entry with the data plane packet and the matched rule's attributes.
- [Application rule log](/azure/azure-monitor/reference/tables/azfwapplicationrule) - Contains all Application rule log data. Each match between data plane and Application rule creates a log entry with the data plane packet and the matched rule's attributes.
- [Threat Intelligence log](/azure/azure-monitor/reference/tables/azfwthreatintel) - Contains all Threat Intelligence events.
- [IDPS log](/azure/azure-monitor/reference/tables/azfwidpssignature) - Contains all data plane packets that were matched with one or more IDPS signatures.
- [DNS proxy log](/azure/azure-monitor/reference/tables/azfwdnsquery) - Contains all DNS Proxy events log data.
- [Internal FQDN resolve failure log](/azure/azure-monitor/reference/tables/azfwinternalfqdnresolutionfailure) - Contains all internal Firewall FQDN resolution requests that resulted in failure.
- [Application rule aggregation log](/azure/azure-monitor/reference/tables/azfwapplicationruleaggregation) - Contains aggregated Application rule log data for Policy Analytics.
- [Network rule aggregation log](/azure/azure-monitor/reference/tables/azfwnetworkruleaggregation) - Contains aggregated Network rule log data for Policy Analytics.
- [NAT rule aggregation log](/azure/azure-monitor/reference/tables/azfwnatruleaggregation) - Contains aggregated NAT rule log data for Policy Analytics.
- [Top 10 flows log (preview)](/azure/azure-monitor/reference/tables/azfwfatflow) - The Top 10 Flows (Fat Flows) log shows the top connections that are contributing to the highest throughput through the firewall.
- [Flow trace (preview)](/azure/azure-monitor/reference/tables/azfwflowtrace) - Contains flow information, flags, and the time period when the flows were recorded. You'll be able to see full flow information such as SYN, SYN-ACK, FIN, FIN-ACK, RST, INVALID (flows).

## Enable/disable structured logs

By default, the new resource specific tables are disabled. 

Run the following Azure PowerShell commands to enable Azure Firewall Structured logs:

```azurepowershell
Connect-AzAccount 
Select-AzSubscription -Subscription "subscription_id or subscription_name" 
Register-AzProviderFeature -FeatureName AFWEnableStructuredLogs -ProviderNamespace Microsoft.Network
Register-AzResourceProvider -ProviderNamespace Microsoft.Network
```

Run the following Azure PowerShell command to turn off this feature:

```azurepowershell
Unregister-AzProviderFeature -FeatureName AFWEnableStructuredLogs -ProviderNamespace Microsoft.Network 
```

In addition, when setting up your log analytics workspace, you must select whether you want to work with the AzureDiagnostics table (default) or with Resource Specific Tables.

Additional KQL log queries were added to query structured firewall logs.

> [!NOTE]
> Existing Workbooks and any Sentinel integration will be adjusted to support the new structured logs when **Resource Specific** mode is selected.

## Next steps

- For more information, see [Exploring the New Resource Specific Structured Logging in Azure Firewall](https://techcommunity.microsoft.com/t5/azure-network-security-blog/exploring-the-new-resource-specific-structured-logging-in-azure/ba-p/3620530).


- To learn more about Azure Firewall logs and metrics, see [Azure Firewall logs and metrics](logs-and-metrics.md)