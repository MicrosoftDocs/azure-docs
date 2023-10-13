---
title: Quickstart - Create an Azure DNS Private Resolver using Azure PowerShell
description: In this quickstart, you learn how to create and manage your first private DNS resolver using Azure PowerShell.
services: dns
author: greg-lindsay
ms.author: greglin
ms.date: 07/19/2023
ms.topic: quickstart
ms.service: dns
ms.custom: devx-track-azurepowershell, mode-api, ignite-2022
#Customer intent: As an experienced network administrator, I want to create an  Azure private DNS resolver, so I can resolve host names on my private virtual networks.
---

# Quickstart: Create an Azure DNS Private Resolver using Azure PowerShell

This article walks you through the steps to create your first private DNS zone and record using Azure PowerShell. If you prefer, you can complete this quickstart using [Azure portal](private-dns-getstarted-portal.md).

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

Azure DNS Private Resolver is a new service that enables you to query Azure DNS private zones from an on-premises environment and vice versa without deploying VM based DNS servers. For more information, including benefits, capabilities, and regional availability, see [What is Azure DNS Private Resolver](dns-private-resolver-overview.md).

## Prerequisites

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

This article assumes you've [installed the Az Azure PowerShell module](/powershell/azure/install-azure-powershell).


## Install the Az.DnsResolver PowerShell module

> [!NOTE]
> If you previously installed the Az.DnsResolver module for evaluation during private preview, you can [unregister](/powershell/module/powershellget/unregister-psrepository) and delete the local PSRepository that was created. Then, install the latest version of the Az.DnsResolver module using the steps provided in this article.

Install the Az.DnsResolver module.

```Azure PowerShell
Install-Module Az.DnsResolver
```

Confirm that the Az.DnsResolver module was installed. The current version of this module is 0.2.1.

```Azure PowerShell
Get-InstalledModule -Name Az.DnsResolver
```

## Set subscription context in Azure PowerShell

Connect PowerShell to Azure cloud.

```Azure PowerShell
Connect-AzAccount -Environment AzureCloud
```

If multiple subscriptions are present, the first subscription ID will be used. To specify a different subscription ID, use the following command.

```Azure PowerShell
Select-AzSubscription -SubscriptionObject (Get-AzSubscription -SubscriptionId <your-sub-id>)
```

## Register the Microsoft.Network provider namespace for your account.

Before you can use Microsoft.Network services with your Azure subscription, you must register the Microsoft.Network namespace:

Use the following command to register the Microsoft.Network namespace.

```Azure PowerShell
Register-AzResourceProvider -ProviderNamespace Microsoft.Network
```

## Create a DNS resolver instance

> [!IMPORTANT]
> Steps to verify or confirm that resources were successfully created are not optional. Do not skip these steps. The steps populate variables that can be used in later procedures.

Create a resource group to host the resources. The resource group must be in a [supported region](dns-private-resolver-overview.md). In this example, the location is westcentralus.

```Azure PowerShell
New-AzResourceGroup -Name myresourcegroup -Location westcentralus
```

Create a virtual network in the resource group that you created.

```Azure PowerShell
New-AzVirtualNetwork -Name myvnet -ResourceGroupName myresourcegroup -Location westcentralus -AddressPrefix "10.0.0.0/8"
```

Create a DNS resolver in the virtual network that you created.

```Azure PowerShell
New-AzDnsResolver -Name mydnsresolver -ResourceGroupName myresourcegroup -Location westcentralus -VirtualNetworkId "/subscriptions/<your subs id>/resourceGroups/myresourcegroup/providers/Microsoft.Network/virtualNetworks/myvnet"
```

Verify that the DNS resolver was created successfully and the state is connected (optional). In output, the **dnsResolverState** is **Connected**.

```Azure PowerShell
$dnsResolver = Get-AzDnsResolver -Name mydnsresolver -ResourceGroupName myresourcegroup
$dnsResolver.ToJsonString()
```
## Create a DNS resolver inbound endpoint

### Create a subnet in the virtual network

Create a subnet in the virtual network (Microsoft.Network/virtualNetworks/subnets) from the IP address space that you previously assigned. The subnet needs to be at least /28 in size (16 IP addresses).

```Azure PowerShell
$virtualNetwork = Get-AzVirtualNetwork -Name myvnet -ResourceGroupName myresourcegroup
Add-AzVirtualNetworkSubnetConfig -Name snet-inbound -VirtualNetwork $virtualNetwork -AddressPrefix "10.0.0.0/28"
$virtualNetwork | Set-AzVirtualNetwork
```

### Create the inbound endpoint

Create an inbound endpoint to enable name resolution from on-premises or another private location using an IP address that is part of your private virtual network address space.

> [!TIP]
> Using PowerShell, you can specify the inbound endpoint IP address to be dynamic or static.<br> 
> If the endpoint IP address is specified as dynamic, the address does not change unless the endpoint is deleted and reprovisioned. Typically the same IP address will be assigned again during reprovisioning.<br>
> If the endpoint IP address is static, it can be specified and reused if the endpoint is reprovisioned. The IP address that you choose can't be a [reserved IP address in the subnet](../virtual-network/virtual-networks-faq.md#are-there-any-restrictions-on-using-ip-addresses-within-these-subnets).

The following commands provision a dynamic IP address:
```Azure PowerShell
$ipconfig = New-AzDnsResolverIPConfigurationObject -PrivateIPAllocationMethod Dynamic -SubnetId /subscriptions/<your sub id>/resourceGroups/myresourcegroup/providers/Microsoft.Network/virtualNetworks/myvnet/subnets/snet-inbound
New-AzDnsResolverInboundEndpoint -DnsResolverName mydnsresolver -Name myinboundendpoint -ResourceGroupName myresourcegroup -Location westcentralus -IpConfiguration $ipconfig
```

Use the following commands to specify a static IP address. Do not use both the dynamic and static sets of commands. 

You must specify an IP address in the subnet that was created previously. The IP address that you choose can't be a [reserved IP address in the subnet](../virtual-network/virtual-networks-faq.md#are-there-any-restrictions-on-using-ip-addresses-within-these-subnets).

The following commands provision a static IP address:
```Azure PowerShell
$ipconfig = New-AzDnsResolverIPConfigurationObject -PrivateIPAddress 10.0.0.4 -PrivateIPAllocationMethod Static -SubnetId /subscriptions/<your sub id>/resourceGroups/myresourcegroup/providers/Microsoft.Network/virtualNetworks/myvnet/subnets/snet-inbound
New-AzDnsResolverInboundEndpoint -DnsResolverName mydnsresolver -Name myinboundendpoint -ResourceGroupName myresourcegroup -Location westcentralus -IpConfiguration $ipconfig
```

### Confirm your inbound endpoint

Confirm that the inbound endpoint was created and allocated an IP address within the assigned subnet.

```Azure PowerShell
$inboundEndpoint = Get-AzDnsResolverInboundEndpoint -Name myinboundendpoint -DnsResolverName mydnsresolver -ResourceGroupName myresourcegroup
$inboundEndpoint.ToJsonString()
```

## Create a DNS resolver outbound endpoint

### Create a subnet in the virtual network

Create a subnet in the virtual network (Microsoft.Network/virtualNetworks/subnets) from the IP address space that you previously assigned, different than your inbound subnet (snet-inbound). The outbound subnet also needs to be at least /28 in size (16 IP addresses).

```Azure PowerShell
$virtualNetwork = Get-AzVirtualNetwork -Name myvnet -ResourceGroupName myresourcegroup
Add-AzVirtualNetworkSubnetConfig -Name snet-outbound -VirtualNetwork $virtualNetwork -AddressPrefix "10.1.1.0/28"
$virtualNetwork | Set-AzVirtualNetwork
```

### Create the outbound endpoint

An outbound endpoint enables conditional forwarding name resolution from Azure to external DNS servers. 

```Azure PowerShell
New-AzDnsResolverOutboundEndpoint -DnsResolverName mydnsresolver -Name myoutboundendpoint -ResourceGroupName myresourcegroup -Location westcentralus -SubnetId /subscriptions/<your sub id>/resourceGroups/myresourcegroup/providers/Microsoft.Network/virtualNetworks/myvnet/subnets/snet-outbound
```

### Confirm your outbound endpoint

Confirm that the outbound endpoint was created and allocated an IP address within the assigned subnet.

```Azure PowerShell
$outboundEndpoint = Get-AzDnsResolverOutboundEndpoint -Name myoutboundendpoint -DnsResolverName mydnsresolver -ResourceGroupName myresourcegroup
$outboundEndpoint.ToJsonString()
```

## Create DNS resolver forwarding ruleset

Create a DNS forwarding ruleset for the outbound endpoint that you created.

```Azure PowerShell
New-AzDnsForwardingRuleset -Name myruleset -ResourceGroupName myresourcegroup -DnsResolverOutboundEndpoint $outboundendpoint -Location westcentralus
```

### Confirm your DNS forwarding ruleset

Confirm the forwarding ruleset was created.

```Azure PowerShell
$dnsForwardingRuleset = Get-AzDnsForwardingRuleset -Name myruleset -ResourceGroupName myresourcegroup
$dnsForwardingRuleset.ToJsonString()
```

## Create a virtual network link to a DNS forwarding ruleset

Virtual network links enable name resolution for virtual networks that are linked to an outbound endpoint with a DNS forwarding ruleset.

```Azure PowerShell
$vnet = Get-AzVirtualNetwork -Name myvnet -ResourceGroupName myresourcegroup 
$vnetlink = New-AzDnsForwardingRulesetVirtualNetworkLink -DnsForwardingRulesetName $dnsForwardingRuleset.Name -ResourceGroupName myresourcegroup -VirtualNetworkLinkName "vnetlink" -VirtualNetworkId $vnet.Id -SubscriptionId <your sub id>
```

### Confirm the virtual network link

Confirm the virtual network link was created.

```Azure PowerShell
$virtualNetworkLink = Get-AzDnsForwardingRulesetVirtualNetworkLink -DnsForwardingRulesetName $dnsForwardingRuleset.Name -ResourceGroupName myresourcegroup 
$virtualNetworkLink.ToJsonString()
```

## Create a second virtual network and link it to your DNS forwarding ruleset

Create a second virtual network to simulate an on-premises or other environment.

```Azure PowerShell
$vnet2 = New-AzVirtualNetwork -Name myvnet2 -ResourceGroupName myresourcegroup -Location westcentralus -AddressPrefix "12.0.0.0/8"
$vnetlink2 = New-AzDnsForwardingRulesetVirtualNetworkLink -DnsForwardingRulesetName $dnsForwardingRuleset.Name -ResourceGroupName myresourcegroup -VirtualNetworkLinkName "vnetlink2" -VirtualNetworkId $vnet2.Id -SubscriptionId <your sub id>
```

### Confirm the second virtual network

Confirm the second virtual network was created.

```Azure PowerShell
$virtualNetworkLink2 = Get-AzDnsForwardingRulesetVirtualNetworkLink -DnsForwardingRulesetName $dnsForwardingRuleset.Name -ResourceGroupName myresourcegroup 
$virtualNetworkLink2.ToJsonString()
```

## Create forwarding rules

Create a forwarding rule for a ruleset to one or more target DNS servers. You must specify the fully qualified domain name (FQDN) with a trailing dot. The **New-AzDnsResolverTargetDnsServerObject** cmdlet sets the default port as 53, but you can also specify a unique port. 

```Azure PowerShell
$targetDNS1 = New-AzDnsResolverTargetDnsServerObject -IPAddress 192.168.1.2 -Port 53 
$targetDNS2 = New-AzDnsResolverTargetDnsServerObject -IPAddress 192.168.1.3 -Port 53
$targetDNS3 = New-AzDnsResolverTargetDnsServerObject -IPAddress 10.0.0.4 -Port 53
$targetDNS4 = New-AzDnsResolverTargetDnsServerObject -IPAddress 10.5.5.5 -Port 53
$forwardingrule = New-AzDnsForwardingRulesetForwardingRule -ResourceGroupName myresourcegroup -DnsForwardingRulesetName myruleset -Name "Internal" -DomainName "internal.contoso.com." -ForwardingRuleState "Enabled" -TargetDnsServer @($targetDNS1,$targetDNS2)
$forwardingrule = New-AzDnsForwardingRulesetForwardingRule -ResourceGroupName myresourcegroup -DnsForwardingRulesetName myruleset -Name "AzurePrivate" -DomainName "azure.contoso.com." -ForwardingRuleState "Enabled" -TargetDnsServer $targetDNS3
$forwardingrule = New-AzDnsForwardingRulesetForwardingRule -ResourceGroupName myresourcegroup -DnsForwardingRulesetName myruleset -Name "Wildcard" -DomainName "." -ForwardingRuleState "Enabled" -TargetDnsServer $targetDNS4
```

In this example: 
- 10.0.0.4 is the resolver's inbound endpoint. 
- 192.168.1.2 and 192.168.1.3 are on-premises DNS servers.
- 10.5.5.5 is a protective DNS service.

## Test the private resolver

You should now be able to send DNS traffic to your DNS resolver and resolve records based on your forwarding rulesets, including:
- Azure DNS private zones linked to the virtual network where the resolver is deployed.
- DNS zones in the public internet DNS namespace.
- Private DNS zones that are hosted on-premises.

## Delete a DNS resolver

To delete the DNS resolver, the resource inbound endpoints created within the resolver must be deleted first. Once the inbound endpoints are removed, the parent DNS resolver can be deleted.

### Delete the inbound endpoint

```Azure PowerShell
Remove-AzDnsResolverInboundEndpoint -Name myinboundendpoint -DnsResolverName mydnsresolver -ResourceGroupName myresourcegroup 
```

### Delete the virtual network link

```Azure PowerShell
Remove-AzDnsForwardingRulesetVirtualNetworkLink -DnsForwardingRulesetName $dnsForwardingRuleset.Name -Name vnetlink -ResourceGroupName myresourcegroup
```

### Delete the DNS forwarding ruleset

```Azure PowerShell
Remove-AzDnsForwardingRuleset -Name $dnsForwardingRuleset.Name -ResourceGroupName myresourcegroup
```

### Delete the outbound endpoint

```Azure PowerShell
Remove-AzDnsResolverOutboundEndpoint -DnsResolverName mydnsresolver -ResourceGroupName myresourcegroup -Name myoutboundendpoint
```

### Delete the DNS resolver

```Azure PowerShell
Remove-AzDnsResolver -Name mydnsresolver -ResourceGroupName myresourcegroup
```


## Next steps

> [!div class="nextstepaction"]
> [What is Azure DNS Private Resolver?](dns-private-resolver-overview.md)
