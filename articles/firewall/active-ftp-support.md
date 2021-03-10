---
title: Azure Firewall Active FTP support
description: By default, Active FTP is disabled on Azure Firewall. You can enable it using PowerShell, CLI, and ARM template.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: conceptual
ms.date: 03/05/2021
ms.author: victorh
---

# Azure Firewall Active FTP support

With Active FTP, the FTP server initiates the data connection to the designated FTP client data port. Firewalls on the client-side network normally block an outside connection request to an internal client port. For more information, see [Active FTP vs. Passive FTP, a Definitive Explanation](https://slacksite.com/other/ftp.html).

By default, Active FTP support is disabled on Azure Firewall to protect against FTP bounce attacks using the FTP `PORT` command. However, you can enable Active FTP when you deploy using Azure PowerShell, the Azure CLI, or an Azure ARM template.


## Azure PowerShell

To deploy using Azure PowerShell, use the `AllowActiveFTP` parameter. For more information, see [Create a Firewall with Allow Active FTP](/powershell/module/az.network/new-azfirewall#16---create-a-firewall-with-allow-active-ftp-).

## Azure CLI

To deploy using the Azure CLI, use the `--allow-active-ftp` parameter. For more information, see [az network firewall create](/cli/azure/ext/azure-firewall/network/firewall#ext_azure_firewall_az_network_firewall_create-optional-parameters). 

## Azure Resource Manager (ARM) template

To deploy using an ARM template, use the `AdditionalProperties` field:

```json
"additionalProperties": {
            "Network.FTP.AllowActiveFTP": "True"
        },
```
For more information, see [Microsoft.Network azureFirewalls](/azure/templates/microsoft.network/azurefirewalls).

## Next steps

To learn how to deploy an Azure Firewall, see [Deploy and configure Azure Firewall using Azure PowerShell](deploy-ps.md).