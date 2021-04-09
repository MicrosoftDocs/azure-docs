---
title: Azure Firewall SNAT private IP address ranges
description: You can configure IP address ranges for SNAT. 
services: firewall
author: vhorne
ms.service: firewall
ms.topic: how-to
ms.date: 01/11/2021
ms.author: victorh
---

# Azure Firewall SNAT private IP address ranges

Azure Firewall provides automatic SNAT for all outbound traffic to public IP addresses. By default, Azure Firewall doesn't SNAT with Network rules when the destination IP address is in a private IP address range per [IANA RFC 1918](https://tools.ietf.org/html/rfc1918). Application rules are always applied using a [transparent proxy](https://wikipedia.org/wiki/Proxy_server#Transparent_proxy) whatever the destination IP address.

This logic works well when you route traffic directly to the Internet. However, if you've enabled [forced tunneling](forced-tunneling.md), Internet-bound traffic is SNATed to one of the firewall private IP addresses in AzureFirewallSubnet, hiding the source from your on-premises firewall.

If your organization uses a public IP address range for private networks, Azure Firewall SNATs the traffic to one of the firewall private IP addresses in AzureFirewallSubnet. However, you can configure Azure Firewall to **not** SNAT your public IP address range. For example, to specify an individual IP address you can specify it like this: `192.168.1.10`. To specify a range of IP addresses, you can specify it like this: `192.168.1.0/24`.

- To configure Azure Firewall to **never** SNAT regardless of the destination IP address, use **0.0.0.0/0** as your private IP address range. With this configuration, Azure Firewall can never route traffic directly to the Internet. 

- To configure the firewall to **always** SNAT regardless of the destination address, use **255.255.255.255/32** as your private IP address range.

> [!IMPORTANT]
> The private address range that you specify only applies to network rules. Currently, application rules always SNAT.

> [!IMPORTANT]
> If you want to specify your own private IP address ranges, and keep the default IANA RFC 1918 address ranges, make sure your custom list still includes the IANA RFC 1918 range. 

## Configure SNAT private IP address ranges - Azure PowerShell

You can use Azure PowerShell to specify private IP address ranges for the firewall.

### New firewall

For a new firewall, the Azure PowerShell cmdlet is:

```azurepowershell
$azFw = @{
    Name               = '<fw-name>'
    ResourceGroupName  = '<resourcegroup-name>'
    Location           = '<location>'
    VirtualNetworkName = '<vnet-name>'
    PublicIpName       = '<public-ip-name>'
    PrivateRange       = @("IANAPrivateRanges", "192.168.1.0/24", "192.168.1.10")
}

New-AzFirewall @azFw
```
> [!NOTE]
> Deploying Azure Firewall using `New-AzFirewall` requires an existing VNet and Public IP address. See [Deploy and configure Azure Firewall using Azure PowerShell](deploy-ps.md) for a full deployment guide.

> [!NOTE]
> IANAPrivateRanges is expanded to the current defaults on Azure Firewall while the other ranges are added to it. To keep the IANAPrivateRanges default in your private range specification, it must remain in your `PrivateRange` specification as shown in the following examples.

For more information, see [New-AzFirewall](/powershell/module/az.network/new-azfirewall).

### Existing firewall

To configure an existing firewall, use the following Azure PowerShell cmdlets:

```azurepowershell
$azfw = Get-AzFirewall -Name '<fw-name>' -ResourceGroupName '<resourcegroup-name>'
$azfw.PrivateRange = @("IANAPrivateRanges","192.168.1.0/24", "192.168.1.10")
Set-AzFirewall -AzureFirewall $azfw
```

## Configure SNAT private IP address ranges - Azure CLI

You can use Azure CLI to specify private IP address ranges for the firewall.

### New firewall

For a new firewall, the Azure CLI command is:

```azurecli-interactive
az network firewall create \
-n <fw-name> \
-g <resourcegroup-name> \
--private-ranges 192.168.1.0/24 192.168.1.10 IANAPrivateRanges
```

> [!NOTE]
> Deploying Azure Firewall using Azure CLI command `az network firewall create` requires additional configuration steps to create public IP addresses and IP configuration. See [Deploy and configure Azure Firewall using Azure CLI](deploy-cli.md) for a full deployment guide.

> [!NOTE]
> IANAPrivateRanges is expanded to the current defaults on Azure Firewall while the other ranges are added to it. To keep the IANAPrivateRanges default in your private range specification, it must remain in your `PrivateRange` specification as shown in the following examples.

### Existing firewall

To configure an existing firewall, the Azure CLI command is:

```azurecli-interactive
az network firewall update \
-n <fw-name> \
-g <resourcegroup-name> \
--private-ranges 192.168.1.0/24 192.168.1.10 IANAPrivateRanges
```

## Configure SNAT private IP address ranges - ARM Template

To configure SNAT during ARM Template deployment, you can add the following to the `additionalProperties` property:

```json
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