---
title: Azure Firewall preview features
description: Learn about Azure Firewall preview features that are currently publicly available.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: conceptual
ms.date: 05/25/2022
ms.author: victorh
---

# Azure Firewall preview features

The following Azure Firewall preview features are available publicly for you to deploy and test. Some of the preview features are available on the Azure portal, and some are only visible using a feature flag.

> [!IMPORTANT]
> These features are currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Feature flags

As new features are released to preview, some of them will be behind a feature flag. To enable the functionality in your environment, you must enable the feature flag on your subscription. These features are applied at the subscription level for all firewalls (VNet firewalls and SecureHub firewalls).  

This article will be updated to reflect the features that are currently in preview with instructions to enable them. When the features move to General Availability (GA), they'll be available to all customers without the need to enable a feature flag. 

## Preview features

The following features are available in preview.

### Network rule name logging (preview)

Currently, a network rule hit event shows the following attributes in the logs: 

   - Source and destination IP/port
   - Action (allow, or deny)

 With this new feature, the event logs for network rules also show the following attributes:
   - Policy name
   - Rule collection group
   - Rule collection
   - Rule name 

To enable the Network Rule name Logging feature, the following commands need to be run in Azure PowerShell. For the feature to immediately take effect, an operation needs to be run on the firewall. This can be a rule change (least intrusive), a setting change, or a stop/start operation. Otherwise, the firewall/s is updated with the feature within several days.

Run the following Azure PowerShell commands to configure Azure Firewall network rule name logging:

```azurepowershell
Connect-AzAccount 
Select-AzSubscription -Subscription "subscription_id or subscription_name" 
Register-AzProviderFeature -FeatureName AFWEnableNetworkRuleNameLogging -ProviderNamespace Microsoft.Network
Register-AzResourceProvider -ProviderNamespace Microsoft.Network 
```

Run the following Azure PowerShell command to turn off this feature:

```azurepowershell
Unregister-AzProviderFeature -FeatureName AFWEnableNetworkRuleNameLogging -ProviderNamespace Microsoft.Network 
```

### Azure Firewall Premium performance boost (preview)

As more applications move to the cloud, the performance of the network elements can become a bottleneck. As the central piece of any network design, the firewall needs to support all the workloads. The Azure Firewall Premium performance boost feature allows more scalability for these deployments.

This feature significantly increases the throughput of Azure Firewall Premium. For more information, see [Azure Firewall performance](firewall-performance.md).

To enable the Azure Firewall Premium Performance boost feature, run the following commands in Azure PowerShell. Stop and start the firewall for the feature to take effect immediately. Otherwise, the firewall/s is updated with the feature within several days. 

The Premium performance boost feature can be enabled on both the [hub virtual network](../firewall-manager/vhubs-and-vnets.md) firewall and the [secured virtual hub](../firewall-manager/vhubs-and-vnets.md) firewall. This feature has no effect on Standard Firewalls.

Run the following Azure PowerShell commands to configure the Azure Firewall Premium performance boost:

```azurepowershell
Connect-AzAccount
Select-AzSubscription -Subscription "subscription_id or subscription_name"
Register-AzProviderFeature -FeatureName AFWEnableAccelnet -ProviderNamespace Microsoft.Network
Register-AzResourceProvider -ProviderNamespace Microsoft.Network
```

Run the following Azure PowerShell command to turn off this feature:

```azurepowershell
Unregister-AzProviderFeature -FeatureName AFWEnableAccelnet -ProviderNamespace Microsoft.Network
```

### IDPS Private IP ranges (preview)

In Azure Firewall Premium IDPS, private IP address ranges are used to identify if traffic is inbound, outbound, or internal (East-West). Each signature is applied on specific traffic direction, as indicated in the signature rules table. By default, only ranges defined by IANA RFC 1918 are considered private IP addresses. So traffic sent from a private IP address range to a private IP address range is considered internal. To modify your private IP addresses, you can now easily edit, remove, or add ranges as needed.

:::image type="content" source="media/firewall-preview/idps-private-ip.png" alt-text="Screenshot showing I D P S private IP address ranges.":::

### Structured Firewall Logs (preview)

Today, the following diagnostic log categories are available for Azure Firewall:
- Application rule log
- Network rule log
- DNS proxy log

These log categories use [Azure diagnostics mode](../azure-monitor/essentials/resource-logs.md#azure-diagnostics-mode). In this mode, all data from any diagnostic setting will be collected in the [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics) table.

With this new feature, you will be able to choose to use [Resource Specific Tables](../azure-monitor/essentials/resource-logs.md#resource-specific) instead of the existing [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics) table. In case both sets of logs are required, at least two diagnostic settings need to be created per firewall.

In **Resource specific** mode, individual tables in the selected workspace are created for each category selected in the diagnostic setting. This method is recommended since it:
- makes it much easier to work with the data in log queries
- makes it easier to discover schemas and their structure
- improves performance across both ingestion latency and query times
- allows you to grant Azure RBAC rights on a specific table

New resource specific tables are now available in Diagnostic setting, that allows you to utilize the following newly added categories:

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

By default, the new resource specific tables are disabled. Open a support ticket to enable the functionality in your environment.

In addition, when setting up your log analytics workspace, you must select whether you want to work with the AzureDiagnostics table (default) or with Resource Specific Tables.

Additional KQL log queries were added (as seen in the following screenshot) to query structured firewall logs.

:::image type="content" source="media/firewall-preview/resource-specific-tables.png" alt-text="Screenshot showing Firewall logs Resource Specific Tables." lightbox="media/firewall-preview/resource-specific-tables-zoom.png":::

> [!NOTE]
> Existing Workbooks and any Sentinel integration will be adjusted to support the new structured logs when **Resource Specific** mode is selected.

## Next steps

To learn more about Azure Firewall, see [What is Azure Firewall?](overview.md).