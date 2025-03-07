---
title: Overview of Azure Firewall service tags
description: A service tag represents a group of IP address prefixes to help minimize complexity for security rule creation.
services: firewall
author: duongau
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 08/31/2023
ms.author: duau 
ms.custom: devx-track-azurepowershell
---

# Azure Firewall service tags

A service tag represents a group of IP address prefixes to help minimize complexity for security rule creation. You can’t create your own service tag, nor specify which IP addresses are included within a tag. Microsoft manages the address prefixes encompassed by the service tag, and automatically updates the service tag as addresses change.

Azure Firewall service tags can be used in the network rules destination field. You can use them in place of specific IP addresses.

## Supported service tags

Azure Firewall supports the following Service Tags to use in Azure Firewall Network rules:

- Tags for various Microsoft and Azure services listed in [Virtual network service tags](../virtual-network/service-tags-overview.md#available-service-tags).
- Tags for the required IP addresses of Office365 services, split by Office365 product and category. You must define the TCP/UDP ports in your rules. For more information, see [Use Azure Firewall to protect Office 365](protect-office-365.md).

## Configuration

Azure Firewall supports configuration of service tags via PowerShell, Azure CLI, or the Azure portal.

### Configure via Azure PowerShell

In this example, we are making a change to an Azure Firewall using classic rules.  We must first get context to our previously created Azure Firewall instance.

```Get the context to an existing Azure Firewall
$FirewallName = "AzureFirewall"
$ResourceGroup = "AzureFirewall-RG"
$azfirewall = Get-AzFirewall -Name $FirewallName -ResourceGroupName $ResourceGroup
```

Next, we must create a new rule.  For the Destination, you can specify the text value of the service tag you wish to leverage, as mentioned previously.

````Create new Network Rules using Service Tags
$rule = New-AzFirewallNetworkRule -Name "AllowSQL" -Description "Allow access to Azure Database as a Service (SQL, MySQL, PostgreSQL, Datawarehouse)" -SourceAddress "10.0.0.0/16" -DestinationAddress Sql -DestinationPort 1433 -Protocol TCP
$ruleCollection = New-AzFirewallNetworkRuleCollection -Name "Data Collection" -Priority 1000 -Rule $rule -ActionType Allow
````

Next, we must update the variable containing our Azure Firewall definition with the new network rules we created.

````Merge the new rules into our existing Azure Firewall variable
$azFirewall.NetworkRuleCollections.add($ruleCollection)
`````

Last, we must commit the Network Rule changes to the running Azure Firewall instance.
````Commit the changes to Azure
Set-AzFirewall -AzureFirewall $azfirewall
````

## Next steps

To learn more about Azure Firewall rules, see [Azure Firewall rule processing logic](rule-processing.md).
