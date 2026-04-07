---
title: Azure Firewall FTP support
description: By default, Active FTP is disabled on Azure Firewall. Enable it by using PowerShell, CLI, or an ARM template.
author: duongau
ms.author: duau
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 03/28/2026
ms.custom: devx-track-arm-template, devx-track-azurepowershell, devx-track-azurecli
# Customer intent: As a network administrator, I want to configure Azure Firewall to support both Active and Passive FTP, so that I can ensure secure and effective FTP communication for my applications.
---

# Azure Firewall FTP support

To support FTP, a firewall must consider the following key aspects:
- FTP mode – Active or Passive
- Client and server location - Internet or intranet
- Flow direction - inbound or outbound

Azure Firewall supports both Active and Passive FTP scenarios. For more information about FTP mode, see [Active FTP vs. Passive FTP, a Definitive Explanation](https://slacksite.com/other/ftp.html).

By default, Azure Firewall enables Passive FTP and disables Active FTP support to protect against FTP bounce attacks that use the FTP PORT command.

However, you can enable Active FTP when you deploy Azure Firewall by using Azure PowerShell, the Azure CLI, or an Azure ARM template. Azure Firewall can support both Active and Passive FTP simultaneously.

*ActiveFTP* is an Azure Firewall property that you can enable for:
- All Azure Firewall SKUs
- Secure hub and virtual network firewalls
- Firewalls using policy and classic rules

## Supported scenarios

The following table shows the configuration required to support various FTP scenarios:

> [!TIP]
> Remember that you might also need to configure firewall rules on the client side to support the connection.

> [!NOTE]
> - By default, Azure Firewall enables Passive FTP, and Active FTP needs extra configuration. For instructions, see the next section.
>
> - Most FTP servers don't accept data and control channels from different source IP addresses for security reasons. Hence, FTP sessions via Azure Firewall must connect with a single client IP. This requirement means you should never SNAT E-W FTP traffic with Azure Firewall Private IP. Instead, use the client IP for FTP flows. For internet FTP traffic, provision Azure Firewall with a single public IP for FTP connectivity. Use NAT Gateway to avoid SNAT exhaustion.

| Firewall scenario | Active FTP mode | Passive FTP mode |
| --- | --- | --- |
| VNet-VNet | Network rules to configure:<br>- Allow from source virtual network to destination IP port 21<br>- Allow from destination IP port 20 to source virtual network | Network rules to configure:<br>- Allow from source virtual network to destination IP port 21<br>- Allow from source virtual network to destination IP \<Range of Data Ports> |
| Outbound virtual network - Internet<br><br>(FTP client in virtual network, server on Internet) | Not supported <sup>1</sup> | Network rules to configure:<br>- Allow from source virtual network to destination IP port 21<br>- Allow from source virtual network to destination IP \<Range of Data Ports> |
| Inbound DNAT<br><br>(FTP client on Internet, FTP server in virtual network) | DNAT rule to configure:<br>- DNAT from Internet source to virtual network IP port 21<br><br>Network rule to configure:<br>- Allow **traffic from** FTP server IP **to** the internet client IP on the active FTP port ranges. | Not supported <sup>2</sup> |

<sup>1</sup> Active FTP doesn't work when the FTP client must reach an FTP server on the Internet. Active FTP uses a PORT command from the FTP client that tells the FTP server what IP address and port to use for the data channel. The PORT command uses the private IP address of the client, which can't be changed. Client-side traffic traversing the Azure Firewall is NATed for Internet-based communications, so the PORT command is seen as invalid by the FTP server. This is a general limitation of Active FTP when used with a client-side NAT.

<sup>2</sup> Passive FTP over the internet is unsupported because the data path traffic (from the internet client via Azure Firewall) can potentially use a different IP address (due to the load balancer). For security reasons, we don't recommend changing the FTP server settings to accept control and data plane traffic from different source IP addresses.

## Deploy by using Azure PowerShell

To deploy by using Azure PowerShell, use the `AllowActiveFTP` parameter. For more information, see [Create a Firewall with Allow Active FTP](/powershell/module/az.network/new-azfirewall#example-16-create-a-firewall-with-allow-active-ftp).

## Update an existing Azure Firewall by using Azure PowerShell

To update an existing Azure Firewall by using Azure PowerShell, set the `AllowActiveFTP` parameter to `True`.

```azurepowershell
$rgName = "resourceGroupName"
$afwName = "afwName"
$afw = Get-AzFirewall `
    -Name $afwName `
    -ResourceGroupName $rgName
$afw.AllowActiveFTP = $true
$afw | Set-AzFirewall
```

## Deploy by using Azure CLI

To deploy by using the Azure CLI, use the `--allow-active-ftp` parameter. For more information, see [az network firewall create](/cli/azure/network/firewall#az-network-firewall-create-optional-parameters).

## Deploy an Azure Resource Manager template

To deploy by using an ARM template, use the `AdditionalProperties` field:

```json
"additionalProperties": {
            "Network.FTP.AllowActiveFTP": "True"
        },
```

For more information, see [Microsoft.Network azureFirewalls](/azure/templates/microsoft.network/azurefirewalls).

## Next steps

- To learn more about FTP scenarios, see [Validating FTP traffic scenarios with Azure Firewall](https://techcommunity.microsoft.com/t5/azure-network-security-blog/validating-ftp-traffic-scenarios-with-azure-firewall/ba-p/3880683).
- To learn how to deploy an Azure Firewall, see [Deploy and configure Azure Firewall using Azure PowerShell](deploy-ps.md).
