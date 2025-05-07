---
title: Delegate a subdomain - Azure PowerShell - Azure DNS
description: With this learning path, get started delegating an Azure DNS subdomain using Azure PowerShell.
services: dns
author: greg-lindsay
ms.service: azure-dns
ms.topic: how-to
ms.date: 11/30/2023
ms.author: greglin 
ms.custom: devx-track-azurepowershell
---

# Delegate an Azure DNS subdomain using Azure PowerShell

You can use Azure PowerShell to delegate a DNS subdomain. For example, if you own the contoso.com domain, you may delegate a subdomain called *engineering* to another separate zone that you can administer separately from the contoso.com zone.

If you prefer, you can also delegate a subdomain using the [Azure portal](delegate-subdomain.md).

> [!NOTE]
> Contoso.com is used as an example throughout this article. Substitute your own domain name for contoso.com.

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](~/reusable-content/ce-skilling/azure/includes/cloud-shell-try-it.md)]

## Prerequisites

To delegate an Azure DNS subdomain, you must first delegate your public domain to Azure DNS. See [Delegate a domain to Azure DNS](./dns-delegate-domain-azure-dns.md) for instructions on how to configure your name servers for delegation. Once your domain is delegated to your Azure DNS zone, you can delegate your subdomain.

## Create a zone for your subdomain

First, create the zone for the **engineering** subdomain.

```azurepowershell-interactive
New-AzDnsZone -ResourceGroupName <resource group name> -Name engineering.contoso.com
```

## Note the name servers

Next, note the four name servers for the engineering subdomain.

```azurepowershell-interactive
Get-AzDnsRecordSet -ZoneName engineering.contoso.com -ResourceGroupName <resource group name> -RecordType NS
```

## Create a test record

Create an **A** record in the engineering zone to use for testing.

```azurepowershell-interactive
New-AzDnsRecordSet -ZoneName engineering.contoso.com -ResourceGroupName <resource group name> -Name www -RecordType A -ttl 3600 -DnsRecords (New-AzDnsRecordConfig -IPv4Address 10.10.10.10)
```

## Create an NS record

Next, create a name server (NS) record  for the **engineering** zone in the contoso.com zone.

```azurepowershell-interactive
$Records = @()
$Records += New-AzDnsRecordConfig -Nsdname <name server 1 noted previously>
$Records += New-AzDnsRecordConfig -Nsdname <name server 2 noted previously>
$Records += New-AzDnsRecordConfig -Nsdname <name server 3 noted previously>
$Records += New-AzDnsRecordConfig -Nsdname <name server 4 noted previously>
$RecordSet = New-AzDnsRecordSet -Name engineering -RecordType NS -ResourceGroupName <resource group name> -TTL 3600 -ZoneName contoso.com -DnsRecords $Records
```

## Test the delegation

Use nslookup to test the delegation.

1. Open a PowerShell window.

1. At command prompt, type `nslookup www.engineering.contoso.com.`

1. You should receive a non-authoritative answer showing the address **10.10.10.10**.

## Next steps

Learn how to [configure reverse DNS for services hosted in Azure](dns-reverse-dns-for-azure-services.md).
