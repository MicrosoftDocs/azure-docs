---
title: Create a record set and records for a DNS zone using PowerShell | Microsoft Docs
description: How to create host records for Azure DNS. Setting up record sets and records using PowerShell
services: dns
documentationcenter: na
author: georgewallace
manager: timlt

ms.assetid: a8068c5a-f248-4e97-be97-8bd0d79eeffd
ms.service: dns
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 12/05/2016
ms.author: gwallace
---

# Create DNS record sets and records by using PowerShell

> [!div class="op_single_selector"]
> * [Azure portal](dns-getstarted-create-recordset-portal.md)
> * [PowerShell](dns-getstarted-create-recordset.md)
> * [Azure CLI](dns-getstarted-create-recordset-cli.md)

This article walks you through the process of creating records and records sets by using Azure PowerShell.

## Introduction

Before creating DNS records in Azure DNS, you first need to understand how Azure DNS organizes DNS records into DNS record sets.

[!INCLUDE [dns-about-records-include](../../includes/dns-about-records-include.md)]

For more information about DNS records in Azure DNS, see [DNS zones and records](dns-zones-records.md).

## Create a record set and record

This section describes how to create DNS records in Azure DNS. The examples assume you have already [installed Azure PowerShell, signed in, and created a DNS zone](dns-getstarted-create-dnszone.md).

The examples on this page all use the 'A' DNS record type. For other record types and further details on how to manage DNS records and record sets, see [Manage DNS records and record sets by using PowerShell](dns-operations-recordsets.md).

If your new record has the same name and type as an existing record, you need to [add it to the existing record set](#add-a-record-to-an-existing-record-set). If your new record has a different name and type to all existing records, you need to [create a new record set](#create-records-in-a-new-record-set). 

### Create records in a new record set

You create record sets by using the `New-AzureRmDnsRecordSet` cmdlet. When creating a record set, you need to specify the record set name, the zone, the time to live (TTL), the record type, and the records to be created.

To create a record set in the apex of the zone (in this case, "contoso.com"), use the record name "@", including the quotation marks. This is a common DNS convention.

The following example creates a new record set with the relative name "www" in the DNS Zone "contoso.com". The fully-qualified name of the record set is "www.contoso.com". The record type is "A", and the TTL is 3600 seconds. The record set contains a single record, with IP address "1.2.3.4"

```powershell
New-AzureRmDnsRecordSet -Name "www" -RecordType "A" -ZoneName "contoso.com" -ResourceGroupName "MyResourceGroup" -Ttl 3600 -DnsRecords (New-AzureRmDnsRecordConfig -IPv4Address "1.2.3.4")
```

If you need to create a new record set containing more than one record, you first need to create a local array containing the records to be added.  This is passed to `New-AzureRmDnsRecordSet` as follows:

```powershell
$aRecords = @()
$aRecords += New-AzureRmDnsRecordConfig -IPv4Address "1.2.3.4"
$aRecords += New-AzureRmDnsRecordConfig -IPv4Address "2.3.4.5"
New-AzureRmDnsRecordSet -Name "www" –ZoneName "contoso.com" -ResourceGroupName "MyResourceGroup" -Ttl 3600 -RecordType A -DnsRecords $aRecords
```

### Add a record to an existing record set

To add a record to an existing record set, follow the following three steps:

1. Get the existing record set

    ```powershell
    $rs = Get-AzureRmDnsRecordSet -Name "www" –ZoneName "contoso.com" -ResourceGroupName "MyResourceGroup" -RecordType A
    ```

2. Add the new record to the local record set. This is an off-line operation.

    ```powershell
    Add-AzureRmDnsRecordConfig -RecordSet $rs -Ipv4Address "5.6.7.8"
    ```

3. Commit the change back to the Azure DNS service 

    ```powershell
    Set-AzureRmDnsRecordSet -RecordSet $rs
    ```

### Verify name resolution

You can test your DNS records are present on the Azure DNS name servers by using DNS tools such as nslookup, dig, or the [Resolve-DnsName PowerShell cmdlet](https://technet.microsoft.com/library/jj590781.aspx).

If you haven't yet delegated your domain to use the new zone in Azure DNS, you need to [direct the DNS query directly to one of the name servers for your zone](dns-getstarted-create-dnszone.md#test-name-servers). Be sure the substitute the correct values for your records zone into the following example:

```
nslookup
> set type=A
> server ns1-01.azure-dns.com
> www.contoso.com

Server:  ns1-01.azure-dns.com
Address:  40.90.4.1

Name:    www.contoso.com
Address:  1.2.3.4
```

## Next steps

Learn how to [delegate your domain name to the Azure DNS name servers](dns-domain-delegation.md)

Learn how to [manage DNS zones by using PowerShell](dns-operations-dnszones.md).

Learn how to [manage DNS records and record sets by using PowerShell](dns-operations-recordsets.md).


