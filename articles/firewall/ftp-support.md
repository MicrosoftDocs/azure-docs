---
title: Azure Firewall FTP support
description: By default, Active FTP is disabled on Azure Firewall. You can enable it using PowerShell, CLI, and ARM template.
services: firewall
author: vhorne
ms.service: firewall
ms.custom: devx-track-arm-template, devx-track-azurepowershell, devx-track-azurecli
ms.topic: conceptual
ms.date: 06/02/2023
ms.author: victorh
---

# Azure Firewall FTP support

To support FTP, a firewall must consider the following key aspects:
- FTP mode – Active or Passive
- Client/server location -  Internet or intranet
- Flow direction - inbound or outbound. 

Azure Firewall supports both Active and Passive FTP scenarios. For more information about FTP mode, see [Active FTP vs. Passive FTP, a Definitive Explanation](https://slacksite.com/other/ftp.html). 

By default, Passive FTP is enabled and Active FTP support is disabled to protect against FTP bounce attacks using the FTP PORT command. 

However, you can enable Active FTP when you deploy using Azure PowerShell, the Azure CLI, or an Azure ARM template. Azure Firewall can support both Active and Passive FTP simultaneously. 

*ActiveFTP* is an Azure Firewall property that can be enabled for:
- all Azure Firewall SKUs
- secure hub and VNet firewalls
- firewalls using policy and classic rules


## Supported scenarios

The following table shows the configuration required to support various FTP scenarios:

> [!TIP]
> Remember that it may also be necessary to configure firewall rules on the client side to support the connection.

> [!NOTE]
> By default, Passive FTP is enabled, and Active FTP needs additional configured on Azure Firewall. For instructions, see next section.
>
> Most FTP servers do not accept data and control channels from different source IP addresses for security reasons. Hence, FTP sessions via Azure Firewall are required to connect with a  single client IP. This implies E-W FTP traffic should never be SNAT’ed with Azure Firewall Private IP and instead use client IP for FTP flows. Likewise for internet FTP traffic, it is recommended to provision Azure Firewall with a single public IP for FTP connectivity. It is recommended to use NAT Gateway to avoid SNAT exhaustion.

|Firewall Scenario  |Active FTP mode   |Passive FTP mode  |
|---------|---------|---------|
|VNet-VNet     |Network Rules to configure:<br>- Allow From Source VNet to Dest IP port 21<br>- Allow From Dest IP port 20 to Source VNet |Network Rules to configure:<br>- Allow From Source VNet to Dest IP port 21<br>- Allow From Source VNet to Dest IP \<Range of Data Ports>|
|Outbound VNet - Internet<br><br>(FTP client in VNet, server on Internet)      |Not supported *|Network Rules to configure:<br>- Allow From Source VNet to Dest IP port 21<br>- Allow From Source VNet to Dest IP \<Range of Data Ports> |
|Inbound DNAT<br><br>(FTP client on Internet, FTP server in VNet)      |DNAT rule to configure:<br>- DNAT From Internet Source to VNet IP port 21<br><br>Network rule to configure:<br>- Allow **traffic from** FTP server IP **to** the internet client IP on the active FTP port ranges. | Not supported** |

\* Active FTP doesn't work when the FTP client must reach an FTP server on the Internet. Active FTP uses a PORT command from the FTP client that tells the FTP server what IP address and port to use for the data channel. The PORT command uses the private IP address of the client, which can't be changed. Client-side traffic traversing the Azure Firewall is NATed for Internet-based communications, so the PORT command is seen as invalid by the FTP server. This is a general limitation of Active FTP when used with a client-side NAT. 

\** Passive FTP over the internet is currently unsupported because the data path traffic (from the internet client via Azure Firewall) can potentially use a different IP address (due to the load balancer). For security reasons, It’s not recommended to change the FTP server settings to accept control and data plane traffic from different source IP addresses.


## Deploy using Azure PowerShell

To deploy using Azure PowerShell, use the `AllowActiveFTP` parameter. For more information, see [Create a Firewall with Allow Active FTP](/powershell/module/az.network/new-azfirewall#example-16-create-a-firewall-with-allow-active-ftp).

## Update an existing Azure Firewall by using Azure PowerShell

To update an existing Azure Firewall by using Azure PowerShell, switch the `AllowActiveFTP` parameter to 'True'.

```azurepowershell
$rgName = "resourceGroupName"
$afwName = "afwName"
$afw = Get-AzFirewall -Name $afwName -ResourceGroupName $rgName
$afw.AllowActiveFTP = $true
$afw | Set-AzFirewall
```

## Deploy using Azure CLI

To deploy using the Azure CLI, use the `--allow-active-ftp` parameter. For more information, see [az network firewall create](/cli/azure/network/firewall#az-network-firewall-create-optional-parameters). 

## Deploy Azure Resource Manager (ARM) template

To deploy using an ARM template, use the `AdditionalProperties` field:

```json
"additionalProperties": {
            "Network.FTP.AllowActiveFTP": "True"
        },
```
For more information, see [Microsoft.Network azureFirewalls](/azure/templates/microsoft.network/azurefirewalls).

## Next steps

To learn how to deploy an Azure Firewall, see [Deploy and configure Azure Firewall using Azure PowerShell](deploy-ps.md).
