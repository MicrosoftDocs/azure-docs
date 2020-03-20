---
title: Azure Firewall SNAT private IP address ranges
description: You can configure IP address private ranges so the firewall won't SNAT traffic to those IP addresses. 
services: firewall
author: vhorne
ms.service: firewall
ms.topic: article
ms.date: 03/20/2020
ms.author: victorh
---

# Azure Firewall SNAT private IP address ranges

Azure Firewall doesn't SNAT with Network rules when the destination IP address is in a private IP address range per [IANA RFC 1918](https://tools.ietf.org/html/rfc1918). Application rules are always applied using a [transparent proxy](https://wikipedia.org/wiki/Proxy_server#Transparent_proxy) regardless of the destination IP address.

If your organization uses a public IP address range for private networks, Azure Firewall SNATs the traffic to one of the firewall private IP addresses in AzureFirewallSubnet. However, you can configure Azure Firewall to **not** SNAT your public IP address range.

## Configure SNAT private IP address ranges

You can use Azure PowerShell to specify an IP address range that the firewall won't SNAT.

### New firewall

For a new firewall, the Azure PowerShell command is:

`New-AzFirewall -Name $GatewayName -ResourceGroupName $RG -Location $Location -VirtualNetworkName $vnet.Name -PublicIpName $LBPip.Name -PrivateRange @("IANAPrivateRanges","IPRange1", "IPRange2")`

> [!NOTE]
> IANAPrivateRanges is expanded to the current defaults on Azure Firewall while the other ranges are added to it.

For more information, see [New-AzFirewall](https://docs.microsoft.com/powershell/module/az.network/new-azfirewall?view=azps-3.3.0).

### Existing firewall

To configure an existing firewall, use the following Azure PowerShell commands:

```azurepowershell
$azfw = Get-AzFirewall -ResourceGroupName "Firewall Resource Group name"
$azfw.PrivateRange = @("IANAPrivateRanges","IPRange1", "IPRange2")
Set-AzFirewall -AzureFirewall $azfw
```

### Templates

You can add the following to the `additionalProperties` section:

```
"additionalProperties": {
                    "Network.SNAT.PrivateRanges": "IANAPrivateRanges , IPRange1, IPRange2"
                },
```

## Next steps

- Learn how to [deploy and configure an Azure Firewall](tutorial-firewall-deploy-portal.md).