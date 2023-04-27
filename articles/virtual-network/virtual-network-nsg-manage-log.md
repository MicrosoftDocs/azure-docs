---
title: Diagnostic resource logging for a network security group
titleSuffix: Azure Virtual Network
description: Learn how to enable event and rule counter diagnostic resource logs for an Azure network security group.
services: virtual-network
author: asudbring
manager: mtillman
ms.service: virtual-network
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 03/22/2023
ms.author: allensu 
ms.custom: devx-track-azurecli
ms.devlang: azurecli
---

# Resource logging for a network security group

A network security group (NSG) includes rules that allow or deny traffic to a virtual network subnet, network interface, or both.

When you enable logging for an NSG, you can gather the following types of resource log information:

- **Event:** Entries are logged for which NSG rules are applied to virtual machines, based on MAC address.
- **Rule counter:** Contains entries for how many times each NSG rule is applied to allow or deny traffic. The status for these rules is collected every 300 seconds.

Resource logs are only available for NSGs deployed through the Azure Resource Manager deployment model. You can't enable resource logging for NSGs deployed through the classic deployment model. For more information, see [Understand deployment models](../azure-resource-manager/management/deployment-models.md).

Resource logging is enabled separately for *each* NSG for which to collect diagnostic data. If you're interested in *activity*, or *operational*, logs instead, see [Overview of Azure platform logs](../azure-monitor/essentials/platform-logs-overview.md). If you're interested in IP traffic flowing through NSGs, see [Flow logs for network security groups](../network-watcher/network-watcher-nsg-flow-logging-overview.md).

## Enable logging

You can use the [Azure portal](#azure-portal), [Azure PowerShell](#azure-powershell), or the [Azure CLI](#azure-cli) to enable resource logging.

### Azure portal

1. Sign in to [the Azure portal](https://portal.azure.com).
1. In the search box at the top of the Azure portal, enter *network security groups*. Select **Network security groups** in the search results.
1. Select the NSG for which to enable logging.
1. Under **Monitoring**, select **Diagnostic settings**, and then select **Add diagnostic setting**:

   :::image type="content" source="./media/virtual-network-nsg-manage-log/turn-on-diagnostics.png" alt-text="Screenshot shows the diagnostic settings for an NSG with Add diagnostic setting highlighted." lightbox="./media/virtual-network-nsg-manage-log/turn-on-diagnostics.png":::

1. In **Diagnostic setting**, enter a name, such as *myNsgDiagnostic*.
1. For **Logs**, select **allLogs** or select individual categories of logs. For more information about each category, see [Log categories](#log-categories).
1. Under **Destination details**, select one or more destinations:

   - Send to Log Analytics workspace
   - Archive to a storage account
   - Stream to an event hub
   - Send to partner solution

   For more information, see [Log destinations](#log-destinations).

1. Select **Save**.

1. View and analyze logs. For more information, see [View and analyze logs](#view-and-analyze-logs).

### Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

You can run the commands that in this section in the [Azure Cloud Shell](https://shell.azure.com/powershell), or by running PowerShell from your computer. The Azure Cloud Shell is a free interactive shell. It has common Azure tools preinstalled and configured to use with your account.

If you run PowerShell from your computer, you need the Azure PowerShell module, version 1.0.0 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps). If you run PowerShell locally, you also need to run the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet to sign in to Azure with an account that has the [necessary permissions](virtual-network-network-interface.md#permissions).

To enable resource logging, you need the ID of an existing NSG. If you don't have an existing NSG, create one by using the [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup) cmdlet.

Get the network security group that you want to enable resource logging for by using the [Get-AzNetworkSecurityGroup](/powershell/module/az.network/get-aznetworksecuritygroup) cmdlet. Store the NSG in a variable for later use. For example, to retrieve an NSG named *myNsg* that exists in a resource group named *myResourceGroup*, enter the following command:

```azurepowershell-interactive
$Nsg=Get-AzNetworkSecurityGroup `
  -Name myNsg `
  -ResourceGroupName myResourceGroup
```

You can write resource logs to different destination types. For more information, see [Log destinations](#log-destinations). In this article, logs are sent to a *Log Analytics workspace* destination. If you don't have an existing workspace, you can create one by using the [New-AzOperationalInsightsWorkspace](/powershell/module/az.operationalinsights/new-azoperationalinsightsworkspace) cmdlet.

Retrieve an existing Log Analytics workspace with the [Get-AzOperationalInsightsWorkspace](/powershell/module/az.operationalinsights/get-azoperationalinsightsworkspace) cmdlet. For example, to get and store an existing workspace named *myWorkspace* in a resource group named *myWorkspaces*, enter the following command:

```azurepowershell-interactive
$Oms=Get-AzOperationalInsightsWorkspace `
  -ResourceGroupName myWorkspaces `
  -Name myWorkspace
```

There are two categories of logging that you can enable. For more information, see [Log categories](#log-categories). Enable resource logging for the NSG with the [New-AzDiagnosticSetting](/powershell/module/az.monitor/new-azdiagnosticsetting) cmdlet. The following example logs both event and counter category data to the workspace for an NSG. It uses the IDs for the NSG and workspace that you got with the previous commands:

```azurepowershell-interactive
New-AzDiagnosticSetting `
   -Name myDiagnosticSetting `
   -ResourceId $Nsg.Id `
   -WorkspaceId $Oms.ResourceId
```

If you want to log to a different [destination](#log-destinations) than a Log Analytics workspace, use an appropriate parameter in the command. For more information, see [Azure resource logs](../azure-monitor/essentials/resource-logs.md).

For more information about settings, see [New-AzDiagnosticSetting](/powershell/module/az.monitor/new-azdiagnosticsetting).

View and analyze logs. For more information, see [View and analyze logs](#view-and-analyze-logs).

### Azure CLI

You can run the commands in this section in the [Azure Cloud Shell](https://shell.azure.com/bash), or by running the Azure CLI from your computer. The Azure Cloud Shell is a free interactive shell. It has common Azure tools preinstalled and configured to use with your account.

If you run the CLI from your computer, you need version 2.0.38 or later. Run `az --version` on your computer, to find the installed version. If you need to upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). If you run the CLI locally, you also need to run `az login` to sign in to Azure with an account that has the [necessary permissions](virtual-network-network-interface.md#permissions).

To enable resource logging, you need the ID of an existing NSG. If you don't have an existing NSG, create one by using [az network nsg create](/cli/azure/network/nsg#az-network-nsg-create).

Get and store the network security group that you want to enable resource logging for with [az network nsg show](/cli/azure/network/nsg#az-network-nsg-show). For example, to retrieve an NSG named *myNsg* that exists in a resource group named *myResourceGroup*, enter the following command:

```azurecli-interactive
nsgId=$(az network nsg show \
  --name myNsg \
  --resource-group myResourceGroup \
  --query id \
  --output tsv)
```

You can write resource logs to different destination types. For more information, see [Log destinations](#log-destinations). In this article, logs are sent to a *Log Analytics workspace* destination, as an example. For more information, see [Log categories](#log-categories).

Enable resource logging for the NSG with [az monitor diagnostic-settings create](/cli/azure/monitor/diagnostic-settings#az-monitor-diagnostic-settings-create). The following example logs both event and counter category data to an existing workspace named *myWorkspace*, which exists in a resource group named *myWorkspaces*. It uses the ID of the NSG that you saved by using the previous command.

```azurecli-interactive
az monitor diagnostic-settings create \
  --name myNsgDiagnostics \
  --resource $nsgId \
  --logs '[ { "category": "NetworkSecurityGroupEvent", "enabled": true, "retentionPolicy": { "days": 30, "enabled": true } }, { "category": "NetworkSecurityGroupRuleCounter", "enabled": true, "retentionPolicy": { "days": 30, "enabled": true } } ]' \
  --workspace myWorkspace \
  --resource-group myWorkspaces
```

If you don't have an existing workspace, create one using the [Azure portal](../azure-monitor/logs/quick-create-workspace.md) or [Azure PowerShell](/powershell/module/az.operationalinsights/new-azoperationalinsightsworkspace). There are two categories of logging for which you can enable logs.

If you only want to log data for one category or the other, remove the category you don't want to log data for in the previous command. If you want to log to a different [destination](#log-destinations) than a Log Analytics workspace, use an appropriate parameter. For more information, see [Azure resource logs](../azure-monitor/essentials/resource-logs.md).

View and analyze logs. For more information, see [View and analyze logs](#view-and-analyze-logs).

## Log destinations

You can send diagnostics data to the following options:

- [Log Analytics workspace](../azure-monitor/essentials/resource-logs.md#send-to-log-analytics-workspace)
- [Azure Event Hubs](../azure-monitor/essentials/resource-logs.md#send-to-azure-event-hubs)
- [Azure Storage](../azure-monitor/essentials/resource-logs.md#send-to-azure-storage)
- [Azure Monitor partner integrations](../azure-monitor/essentials/resource-logs.md#azure-monitor-partner-integrations)

## Log categories

JSON-formatted data is written for the following log categories: event and rule counter.

### Event

The event log contains information about which NSG rules are applied to virtual machines, based on MAC address. The following data is logged for each event. In the following example, the data is logged for a virtual machine with the IP address 192.168.1.4 and a MAC address of 00-0D-3A-92-6A-7C:

```json
{
    "time": "[DATE-TIME]",
    "systemId": "[ID]",
    "category": "NetworkSecurityGroupEvent",
    "resourceId": "/SUBSCRIPTIONS/[SUBSCRIPTION-ID]/RESOURCEGROUPS/[RESOURCE-GROUP-NAME]/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/[NSG-NAME]",
    "operationName": "NetworkSecurityGroupEvents",
    "properties": {
        "vnetResourceGuid":"[ID]",
        "subnetPrefix":"192.168.1.0/24",
        "macAddress":"00-0D-3A-92-6A-7C",
        "primaryIPv4Address":"192.168.1.4",
        "ruleName":"[SECURITY-RULE-NAME]",
        "direction":"[DIRECTION-SPECIFIED-IN-RULE]",
        "priority":"[PRIORITY-SPECIFIED-IN-RULE]",
        "type":"[ALLOW-OR-DENY-AS-SPECIFIED-IN-RULE]",
        "conditions":{
            "protocols":"[PROTOCOLS-SPECIFIED-IN-RULE]",
            "destinationPortRange":"[PORT-RANGE-SPECIFIED-IN-RULE]",
            "sourcePortRange":"[PORT-RANGE-SPECIFIED-IN-RULE]",
            "sourceIP":"[SOURCE-IP-OR-RANGE-SPECIFIED-IN-RULE]",
            "destinationIP":"[DESTINATION-IP-OR-RANGE-SPECIFIED-IN-RULE]"
            }
        }
}
```

### Rule counter

The rule counter log contains information about each rule applied to resources. The following example data is logged each time a rule is applied. In the following example, the data is logged for a virtual machine with the IP address 192.168.1.4 and a MAC address of 00-0D-3A-92-6A-7C:

```json
{
    "time": "[DATE-TIME]",
    "systemId": "[ID]",
    "category": "NetworkSecurityGroupRuleCounter",
    "resourceId": "/SUBSCRIPTIONS/[SUBSCRIPTION ID]/RESOURCEGROUPS/[RESOURCE-GROUP-NAME]/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/[NSG-NAME]",
    "operationName": "NetworkSecurityGroupCounters",
    "properties": {
        "vnetResourceGuid":"[ID]",
        "subnetPrefix":"192.168.1.0/24",
        "macAddress":"00-0D-3A-92-6A-7C",
        "primaryIPv4Address":"192.168.1.4",
        "ruleName":"[SECURITY-RULE-NAME]",
        "direction":"[DIRECTION-SPECIFIED-IN-RULE]",
        "type":"[ALLOW-OR-DENY-AS-SPECIFIED-IN-RULE]",
        "matchedConnections":125
        }
}
```

> [!NOTE]
> The source IP address for the communication is not logged. You can enable [NSG flow logging](../network-watcher/network-watcher-nsg-flow-logging-portal.md) for an NSG, which logs all of the rule counter information and the source IP address that initiated the communication. NSG flow log data is written to an Azure Storage account. You can analyze the data with the [traffic analytics](../network-watcher/traffic-analytics.md) capability of Azure Network Watcher.

## View and analyze logs

If you send diagnostics data to:

- **Azure Monitor logs**: You can use the [network security group analytics](../azure-monitor/insights/azure-networking-analytics.md?toc=%2fazure%2fvirtual-network%2ftoc.json) solution for enhanced insights. The solution provides visualizations for NSG rules that allow or deny traffic, per MAC address, of the network interface in a virtual machine.
- **Azure Storage account**: Data is written to a *PT1H.json* file. You can find the:

  - Event log that is in the following path: *insights-logs-networksecuritygroupevent/resourceId=/SUBSCRIPTIONS/[ID]/RESOURCEGROUPS/[RESOURCE-GROUP-NAME-FOR-NSG]/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/[NSG NAME]/y=[YEAR]/m=[MONTH/d=[DAY]/h=[HOUR]/m=[MINUTE]*
  - Rule counter log that is in the following path: *insights-logs-networksecuritygrouprulecounter/resourceId=/SUBSCRIPTIONS/[ID]/RESOURCEGROUPS/[RESOURCE-GROUP-NAME-FOR-NSG]/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/[NSG NAME]/y=[YEAR]/m=[MONTH/d=[DAY]/h=[HOUR]/m=[MINUTE]*

To learn how to view resource log data, see [Azure platform logs overview](../azure-monitor/essentials/platform-logs-overview.md).

## Next steps

- For more information about Activity logging, see [Overview of Azure platform logs](../azure-monitor/essentials/platform-logs-overview.md).

  Activity logging is enabled by default for NSGs created through either Azure deployment model. To determine which operations were completed on NSGs in the activity log, look for entries that contain the following resource types:

  - Microsoft.ClassicNetwork/networkSecurityGroups
  - Microsoft.ClassicNetwork/networkSecurityGroups/securityRules
  - Microsoft.Network/networkSecurityGroups
  - Microsoft.Network/networkSecurityGroups/securityRules

- To learn how to log diagnostic information, see [Log network traffic to and from a virtual machine using the Azure portal](../network-watcher/network-watcher-nsg-flow-logging-portal.md).
