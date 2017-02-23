---
title: Get started with Azure DNS | Microsoft Docs
description: Learn how to create DNS zones in Azure DNS. This is a step-by-step guide to create and manage your first DNS zone using Azure PowerShell.
services: dns
documentationcenter: na
author: georgewallace
manager: timlt

ms.assetid: d78583b7-e669-435c-819b-7605cf791b0e
ms.service: dns
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 12/05/2016
ms.author: gwallace
---

# Create a DNS zone using PowerShell

> [!div class="op_single_selector"]
> * [Azure portal](dns-getstarted-create-dnszone-portal.md)
> * [PowerShell](dns-getstarted-create-dnszone.md)
> * [Azure CLI](dns-getstarted-create-dnszone-cli.md)

This article walks you through the steps to create a DNS zone using Azure PowerShell. You can also create a DNS zone using the cross-platform [Azure CLI](dns-getstarted-create-dnszone-cli.md) or the [Azure portal](dns-getstarted-create-dnszone-portal.md).

[!INCLUDE [dns-create-zone-about](../../includes/dns-create-zone-about-include.md)]

[!INCLUDE [dns-powershell-setup](../../includes/dns-powershell-setup-include.md)]


## Create a DNS zone

A DNS zone is created by using the `New-AzureRmDnsZone` cmdlet. The following example creates a DNS zone called *contoso.com* in the resource group called *MyResourceGroup*. Use the example to create a DNS zone, substituting the values for your own.

```powershell
New-AzureRmDnsZone -Name contoso.com -ResourceGroupName MyAzureResourceGroup
```

## Verify your DNS zone

### View records

Creating a DNS zone also creates the following DNS records:

* The *Start of Authority* (SOA) record. This record is present at the root of every DNS zone.
* The authoritative name server (NS) records. These records show which name servers are hosting the zone. Azure DNS uses a pool of name servers, and so different name servers may be assigned to different zones in Azure DNS. For more information, see [delegate a domain to Azure DNS](dns-domain-delegation.md).

To view these records, use `Get-AzureRmDnsRecordSet`:

```powershell
Get-AzureRmDnsRecordSet -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup

Name              : @
ZoneName          : contoso.com
ResourceGroupName : MyAzureResourceGroup
Ttl               : 172800
Etag              : f573237b-088c-424a-b53c-08567d87d049
RecordType        : NS
Records           : {ns1-01.azure-dns.com., ns2-01.azure-dns.net., ns3-01.azure-dns.org., ns4-01.azure-dns.info.}
Metadata          : 

Name              : @
ZoneName          : contoso.com
ResourceGroupName : MyAzureResourceGroup
Ttl               : 3600
Etag              : bf88a27d-0eec-4847-ad42-f0c83b9a2c32
RecordType        : SOA
Records           : {[ns1-01.azure-dns.com.,azuredns-hostmaster.microsoft.com,3600,300,2419200,300]}
Metadata          : 
```

> [!NOTE]
> Record sets at the root (or *apex*) of a DNS Zone use **@** as the record set name.

### Test name servers

You can test your DNS zone is present on the Azure DNS name servers by using DNS tools such as nslookup, dig, or the [Resolve-DnsName PowerShell cmdlet](https://technet.microsoft.com/library/jj590781.aspx).

If you haven't yet delegated your domain to use the new zone in Azure DNS, you need to direct the DNS query directly to one of the name servers for your zone. The name servers for your zone are given in the NS records, as listed by `Get-AzureRmDnsRecordSet` above. Be sure the substitute the correct values for your zone into the following example:

```
nslookup
> set type=SOA
> server ns1-01.azure-dns.com
> contoso.com

Server: ns1-01.azure-dns.com
Address:  40.90.4.1

contoso.com
        primary name server = ns1-01.azure-dns.com
        responsible mail addr = azuredns-hostmaster.microsoft.com
        serial  = 1
        refresh = 3600 (1 hour)
        retry   = 300 (5 mins)
        expire  = 2419200 (28 days)
        default TTL = 300 (5 mins)
```

## Next steps

After creating a DNS zone, [create record sets and records](dns-getstarted-create-recordset.md) to create DNS records for your Internet domain.
