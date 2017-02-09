---
title: Create a DNS zone using CLI| Microsoft Docs
description: Learn how to create DNS zones in Azure DNS. This is a step-by-step guide to create and manage your first DNS zone using the Azure CLI.
services: dns
documentationcenter: na
author: georgewallace
manager: timlt

ms.assetid: 1514426a-133c-491a-aa27-ee0962cea9dc
ms.service: dns
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 12/21/2016
ms.author: gwallace
---

# Create an Azure DNS zone using CLI

> [!div class="op_single_selector"]
> * [Azure Portal](dns-getstarted-create-dnszone-portal.md)
> * [PowerShell](dns-getstarted-create-dnszone.md)
> * [Azure CLI](dns-getstarted-create-dnszone-cli.md)

This article walks you through the steps to create a DNS zone using the cross-platform Azure CLI, which is available for Windows, Mac and Linux. You can also create a DNS zone using [Azure PowerShell](dns-getstarted-create-dnszone.md) or the [Azure portal](dns-getstarted-create-dnszone-portal.md).

[!INCLUDE [dns-create-zone-about](../../includes/dns-create-zone-about-include.md)]

[!INCLUDE [dns-cli-setup](../../includes/dns-cli-setup-include.md)]


## Create a DNS zone

A DNS zone is created using the `azure network dns zone create` command. To see help for this command, type `azure network dns zone create -h`.

The following example creates a DNS zone called *contoso.com* in the resource group called *MyResourceGroup*. Use the example to create a DNS zone, substituting the values for your own.

```azurecli
azure network dns zone create MyResourceGroup contoso.com
```

## Verify your DNS zone

### View records

Creating a DNS zone also creates the following DNS records:

* The *Start of Authority* (SOA) record. This record is present at the root of every DNS zone.
* The authoritative name server (NS) records. These records show which name servers are hosting the zone. Azure DNS uses a pool of name servers, and so different name servers may be assigned to different zones in Azure DNS. For more information, see [delegate a domain to Azure DNS](dns-domain-delegation.md).

To view these records, use `azure network dns-record-set list`:

```azurecli
azure network dns record-set list MyResourceGroup contoso.com

info:    Executing command network dns record-set list
+ Looking up the DNS Record Sets
data:    Name                            : @
data:    Type                            : NS
data:    TTL                             : 172800
data:    Records:
data:      ns1-01.azure-dns.com.
data:      ns2-01.azure-dns.net.
data:      ns3-01.azure-dns.org.
data:      ns4-01.azure-dns.info.
data:
data:    Name                            : @
data:    Type                            : SOA
data:    TTL                             : 3600
data:    Email                           : azuredns-hostmaster.microsoft.com
data:    Host                            : ns1-01.azure-dns.com.
data:    Serial Number                   : 2
data:    Refresh Time                    : 3600
data:    Retry Time                      : 300
data:    Expire Time                     : 2419200
data:    Minimum TTL                     : 300
data:
info:    network dns record-set list command OK
```

> [!NOTE]
> Record sets at the root (or *apex*) of a DNS Zone use **@** as the record set name.

### Test name servers

You can test your DNS zone is present on the Azure DNS name servers by using DNS tools such as nslookup, dig, or the `Resolve-DnsName` PowerShell cmdlet.

If you haven't yet delegated your domain to use the new zone in Azure DNS, you need to direct the DNS query directly to one of the name servers for your zone. The name servers for your zone are given in the NS records, as given by `azure network dns record-set list`.

The following example uses 'dig' to query the domain contoso.com using the name servers assigned to the DNS zone. Be sure the substitute the correct values for your zone.

```
  > dig @ns1-01.azure-dns.com contoso.com
  
  <<>> DiG 9.10.2-P2 <<>> @ns1-01.azure-dns.com contoso.com
(1 server found)
global options: +cmd
  Got answer:
->>HEADER<<- opcode: QUERY, status: NOERROR, id: 60963
  flags: qr aa rd; QUERY: 1, ANSWER: 0, AUTHORITY: 1, ADDITIONAL: 1
  WARNING: recursion requested but not available

  OPT PSEUDOSECTION:
  EDNS: version: 0, flags:; udp: 4000
  QUESTION SECTION:
contoso.com.                        IN      A

  AUTHORITY SECTION:
contoso.com.         3600     IN      SOA     ns1-01.azure-dns.com. azuredns-hostmaster.microsoft.com. 1 3600 300 2419200 300

Query time: 93 msec
SERVER: 208.76.47.5#53(208.76.47.5)
WHEN: Tue Jul 21 16:04:51 Pacific Daylight Time 2015
MSG SIZE  rcvd: 120
```

## Next steps

After creating a DNS zone, [create DNS record sets and records](dns-getstarted-create-recordset-cli.md) in your zone.

