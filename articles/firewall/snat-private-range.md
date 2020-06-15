---
title: Azure Firewall SNAT private IP address ranges
description: You can configure IP address ranges for SNAT. 
services: firewall
author: vhorne
ms.service: firewall
ms.topic: article
ms.date: 06/09/2020
ms.author: victorh
---

# Azure Firewall SNAT private IP address ranges

Azure Firewall provides automatic SNAT for all outbound traffic to public IP addresses. By default, Azure Firewall doesn't SNAT with Network rules when the destination IP address is in a private IP address range per [IANA RFC 1918](https://tools.ietf.org/html/rfc1918). Application rules are always applied using a [transparent proxy](https://wikipedia.org/wiki/Proxy_server#Transparent_proxy) regardless of the destination IP address.

This logic works well when you route traffic directly to the Internet. However, if you've enabled [forced tunneling](forced-tunneling.md), Internet-bound traffic is SNATed to one of the firewall private IP addresses in AzureFirewallSubnet, hiding the source from your on-premises firewall.

If your organization uses a public IP address range for private networks, Azure Firewall SNATs the traffic to one of the firewall private IP addresses in AzureFirewallSubnet. However, you can configure Azure Firewall to **not** SNAT your public IP address range.

To configure Azure Firewall to never SNAT regardless of the destination IP address, use **0.0.0.0/0** as your private IP address range. With this configuration, Azure Firewall can never route traffic directly to the Internet. To configure the firewall to always SNAT regardless of the destination address, use **255.255.255.255/32** as your private IP address range.

## Configure SNAT private IP address ranges - Azure PowerShell

You can use Azure PowerShell to specify private IP address ranges for the firewall.

### New firewall

For a new firewall, the Azure PowerShell command is:

`New-AzFirewall -Name $GatewayName -ResourceGroupName $RG -Location $Location -VirtualNetworkName $vnet.Name -PublicIpName $LBPip.Name -PrivateRange @("IANAPrivateRanges","IPRange1", "IPRange2")`

> [!NOTE]
> IANAPrivateRanges is expanded to the current defaults on Azure Firewall while the other ranges are added to it. To keep the IANAPrivateRanges default in your private range specification, it must remain in your `PrivateRange` specification as shown in the following examples.

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

## Configure SNAT private IP address ranges - Azure portal

You can use the Azure portal to specify private IP address ranges for the firewall.

1. Select your resource group, and then select your firewall.
2. On the **Overview** page, **Private IP Ranges**, select the default value **IANA RFC 1918**.

   The **Edit Private IP Prefixes** page opens:

   :::image type="content" source="media/snat-private-range/private-ip.png" alt-text="Edit private IP prefixes":::

1. By default, **IANAPrivateRanges** is configured.
2. Edit the private IP address ranges for your environment and then select **Save**.

## Next steps

- Learn about [Azure Firewall forced tunneling](forced-tunneling.md).