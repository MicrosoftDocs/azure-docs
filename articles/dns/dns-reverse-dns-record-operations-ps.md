---
title: Manage reverse DNS records in Azure DNS using PowerShell | Microsoft Docs
description: Azure DNS allows you to manage reverse DNS records or PTR records for Azure services using PowerShell in Resource Manager
services: DNS
documentationcenter: na
author: s-malone
manager: carmonm
editor: ''
tags: azure-resource-manager

ms.assetid: b95703c5-e94e-4009-ab37-0c3f7908783c
ms.service: DNS
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/28/2016
ms.author: smalone

---
# Manage reverse DNS records for your Azure services using PowerShell

[!INCLUDE [dns-reverse-dns-record-operations-arm-selectors-include.md](../../includes/dns-reverse-dns-record-operations-arm-selectors-include.md)]


[!INCLUDE [DNS-reverse-dns-record-operations-intro-include.md](../../includes/dns-reverse-dns-record-operations-intro-include.md)]


[!INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-rm-include.md)]

For more information about the classic deployment model, see [How to manage reverse DNS records for your Azure services (classic) using Azure PowerShell](dns-reverse-dns-record-operations-classic-ps.md).

## Validation of reverse DNS records

To ensure a third party can’t create reverse DNS records mapping to your DNS domains, Azure only allows the creation of a reverse DNS record where one of the following is true:

* The "ReverseFqdn" is the same as the "Fqdn" for the Public IP Address resource for which it has been specified, or the "Fqdn" for any Public IP Address within the same subscription e.g., "ReverseFqdn" is "contosoapp1.northus.cloudapp.azure.com.".
* The "ReverseFqdn" forward resolves to the name or IP of the Public IP Address for which it has been specified, or to any Public IP Address "Fqdn" or IP within the same subscription e.g., "ReverseFqdn" is "app1.contoso.com." which is a CName alias for "contosoapp1.northus.cloudapp.azure.com."

Validation checks are only performed when the reverse DNS property for a Public IP Address is set or modified. Periodic re-validation is not performed.

## Add reverse DNS to existing Public IP addresses

You can add reverse DNS to an existing Public IP Address using the `Set-AzureRmPublicIpAddress` cmdlet:

```powershell
$pip = Get-AzureRmPublicIpAddress -Name "PublicIP" -ResourceGroupName "NRP-DemoRG-PS"
$pip.DnsSettings.ReverseFqdn = "contosoapp1.westus.cloudapp.azure.com."
Set-AzureRmPublicIpAddress -PublicIpAddress $pip
```

If you wish to add reverse DNS to an existing Public IP Address that doesn't already have a DNS name, you must also specify a DNS name. You can add achieve this using the "Set-AzureRmPublicIpAddress" cmdlet:

```powershell
$pip = Get-AzureRmPublicIpAddress -Name "PublicIP" -ResourceGroupName "NRP-DemoRG-PS"
$pip.DnsSettings = New-Object -TypeName "Microsoft.Azure.Commands.Network.Models.PSPublicIpAddressDnsSettings"
$pip.DnsSettings.DomainNameLabel = "contosoapp1"
$pip.DnsSettings.ReverseFqdn = "contosoapp1.westus.cloudapp.azure.com."
Set-AzureRmPublicIpAddress -PublicIpAddress $pip
```

## Create a Public IP Address with reverse DNS

You can add a new Public IP Address with the reverse DNS property specified using the `New-AzureRmPublicIpAddress` cmdlet:

```powershell
New-AzureRmPublicIpAddress -Name "PublicIP2" -ResourceGroupName "NRP-DemoRG-PS" -Location "WestUS" -AllocationMethod Dynamic -DomainNameLabel "contosoapp2" -ReverseFqdn "contosoapp2.westus.cloudapp.azure.com."
```

## View reverse DNS for existing Public IP Addresses

You can view the configured value for an existing Public IP Address using the `Get-AzureRmPublicIpAddress` cmdlet:

```powershell
Get-AzureRmPublicIpAddress -Name "PublicIP2" -ResourceGroupName "NRP-DemoRG-PS"
```

## Remove reverse DNS from existing Public IP Addresses

You can remove a reverse DNS property from an existing Public IP Address using the `Set-AzureRmPublicIpAddress` cmdlet. This is done by setting the ReverseFqdn property value to blank:

```powershell
$pip = Get-AzureRmPublicIpAddress -Name "PublicIP" -ResourceGroupName "NRP-DemoRG-PS"
$pip.DnsSettings.ReverseFqdn = ""
Set-AzureRmPublicIpAddress -PublicIpAddress $pip
```

[!INCLUDE [FAQ1](../../includes/dns-reverse-dns-record-operations-faq-host-own-arpa-zone-include.md)]

[!INCLUDE [FAQ2](../../includes/dns-reverse-dns-record-operations-faq-arm-include.md)]

