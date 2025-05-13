---
title: Overview of Azure Firewall service tags
description: A service tag represents a group of IP address prefixes to help minimize complexity for security rule creation.
services: firewall
author: duongau
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 03/17/2025
ms.author: duau 
ms.custom: devx-track-azurepowershell
---

# Azure Firewall service tags

A service tag represents a group of IP address prefixes to simplify security rule creation. You cannot create your own service tag or specify which IP addresses are included. Microsoft manages and updates the address prefixes within the service tag automatically.

Azure Firewall service tags can be used in the network rules destination field, replacing specific IP addresses.

## Supported service tags

Azure Firewall supports the following service tags in network rules:

- Tags for various Microsoft and Azure services listed in [Virtual network service tags](../virtual-network/service-tags-overview.md#available-service-tags).
- Tags for required IP addresses of Office365 services, categorized by product and category. Define the TCP/UDP ports in your rules. For more information, see [Use Azure Firewall to protect Office 365](protect-office-365.md).

## Configuration

You can configure Azure Firewall service tags with PowerShell, Azure CLI, or the Azure portal.

### Configure with Azure PowerShell

First, get the context of your existing Azure Firewall instance:

```powershell
$FirewallName = "AzureFirewall"
$ResourceGroup = "AzureFirewall-RG"
$azfirewall = Get-AzFirewall -Name $FirewallName -ResourceGroupName $ResourceGroup
```

Next, create a new rule. For the Destination, specify the service tag text value:

```powershell
$rule = New-AzFirewallNetworkRule -Name "AllowSQL" -Description "Allow access to Azure Database as a Service (SQL, MySQL, PostgreSQL, Datawarehouse)" -SourceAddress "10.0.0.0/16" -DestinationAddress Sql -DestinationPort 1433 -Protocol TCP
$ruleCollection = New-AzFirewallNetworkRuleCollection -Name "Data Collection" -Priority 1000 -Rule $rule -ActionType Allow
```

Update the Azure Firewall definition with the new network rules:

```powershell
$azFirewall.NetworkRuleCollections.add($ruleCollection)
```

Finally, commit the network rule changes to the running Azure Firewall instance:

```powershell
Set-AzFirewall -AzureFirewall $azfirewall
```

## Next steps

To learn more about Azure Firewall rules, see [Azure Firewall rule processing logic](rule-processing.md).
