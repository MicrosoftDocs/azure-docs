---
title: Overview of Azure Firewall service tags
description: A service tag represents a group of IP address prefixes to help minimize complexity for security rule creation.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: article
ms.date: 4/5/2021
ms.author: victorh
---

# Azure Firewall service tags

A service tag represents a group of IP address prefixes to help minimize complexity for security rule creation. You cannot create your own service tag, nor specify which IP addresses are included within a tag. Microsoft manages the address prefixes encompassed by the service tag, and automatically updates the service tag as addresses change.

Azure Firewall service tags can be used in the network rules destination field. You can use them in place of specific IP addresses.

## Supported service tags

See [Virtual network service tags](../virtual-network/service-tags-overview.md#available-service-tags) for a list of service tags that are available for use in Azure firewall network rules.

## Configuration

Azure Firewall supports configuration of Service Tags via PowerShell, Azure CLI, or the Azure portal.

### Configure via Azure PowerShell

In this example, we must first get context to our previously created Azure Firewall instance.

```Get the context to an existing Azure Firewall
$FirewallName = "AzureFirewall"
$ResourceGroup = "AzureFirewall-RG"
$azfirewall = Get-AzFirewall -Name $FirewallName -ResourceGroupName $ResourceGroup
```

Next, we must create a new Rule.  For the Source or Destination, you can specify the text value of the Service Tag you wish to leverage, as mentioned earlier above in this article.

````Create new Network Rules using Service Tags
$rule = New-AzFirewallNetworkRule -Name "AllowSQL" -Description "Allow access to Azure Database as a Service (SQL, MySQL, PostgreSQL, Datawarehouse)" -SourceAddress "10.0.0.0/16" -DestinationAddress Sql -DestinationPort 1433 -Protocol TCP
$ruleCollection = New-AzFirewallNetworkRuleCollection -Name "Data Collection" -Priority 1000 -Rule $rule -ActionType Allow
````

Next, we must update the variable containing our Azure Firewall definition with the new Network Rules we created.

````Merge the new rules into our existing Azure Firewall variable
$azFirewall.NetworkRuleCollections.add($ruleCollection)
`````

Last, we must commit the Network Rule changes to the running Azure Firewall instance.
````Commit the changes to Azure
Set-AzFirewall -AzureFirewall $azfirewall
````

## Next steps

To learn more about Azure Firewall rules, see [Azure Firewall rule processing logic](rule-processing.md).
