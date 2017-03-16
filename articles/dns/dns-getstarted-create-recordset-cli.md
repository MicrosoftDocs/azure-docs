---
title: Create DNS records using the Azure CLI 2.0 | Microsoft Docs
description: How to create host records for Azure DNS.Setting up record sets and records using Azure CLI 2.0
services: dns
documentationcenter: na
author: georgewallace
manager: timlt

ms.assetid: 02b897d3-e83b-4257-b96d-5c29aa59e843
ms.service: dns
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.custom: H1Hack27Feb2017
ms.workload: infrastructure-services
ms.date: 02/27/2017
ms.author: gwallace
---

# How to create DNS records using the Azure CLI 2.0

> [!div class="op_single_selector"]
> * [Azure Portal](dns-getstarted-create-recordset-portal.md)
> * [PowerShell](dns-getstarted-create-recordset.md)
> * [Azure CLI 1.0](dns-getstarted-create-recordset-cli-nodejs.md)
> * [Azure CLI 2.0](dns-getstarted-create-recordset-cli.md)

This article walks you through the process of creating records and records sets by using the Azure CLI.

## Introduction

Before creating DNS records in Azure DNS, you first need to understand how Azure DNS organizes DNS records into DNS record sets.

[!INCLUDE [dns-about-records-include](../../includes/dns-about-records-include.md)]

For more information about DNS records in Azure DNS, see [DNS zones and records](dns-zones-records.md).

## CLI versions to complete the task

You can complete the task using one of the following CLI versions:

* [Azure CLI 1.0](dns-getstarted-create-recordset-cli-nodejs.md) - our CLI for the classic and resource management deployment models.
* [Azure CLI 2.0](dns-getstarted-create-recordset-cli.md) - our next generation CLI for the resource management deployment model.

## Create a record set and record

This section describes how to create DNS records in Azure DNS. The examples assume you have already [installed the Azure CLI 2.0, signed in, and created a DNS zone](dns-getstarted-create-dnszone-cli.md).

The examples on this page all use the 'A' DNS record type. For other record types and further details on how to manage DNS records and record sets, see [Manage DNS records and record sets by using the Azure CLI 2.0](dns-operations-recordsets-cli.md).

## Create a DNS record

To create a DNS record, use the `az network dns record-set ? add` command (where ? is the record type). For help, see `az network dns record-set --help`.

When creating a record, you need to specify the resource group name, zone name, record set name, the record type, and the details of the record being 
created.

If the record set does not already exist, this command creates it for you. If the record set already exists, this command adds the record you specify to the existing record set. 

If a new record set is created, a default time-to-live (TTL) of 3600 is used. For instructions on how to use different TTLs, see [Manage DNS records in Azure DNS using the Azure CLI 2.0](dns-operations-recordsets-cli.md).

The following example creates an A record called *www* in the zone *contoso.com* in the resource group *MyResourceGroup*. The IP address of the A record is *1.2.3.4*.

```azurecli
az network dns record-set a create --resource-group myresourcegroup --zone-name contoso.com --record-set-name www --ipv4-address 1.2.3.4
```

To create a record set in the apex of the zone (in this case, "contoso.com"), use the record name "@", including the quotation marks:

```azurecli
az network dns record-set a --resource-group myresourcegroup --zone-name contoso.com --record-set-name "@" --ipv4-address 1.2.3.4
```

The parameters used to specify the record data vary depending on the type of the record. For example, for a record of type "A", you specify the IPv4 address with the parameter `--ipv4-address <IPv4 address>`. See `az network dns record --help` to list the parameters for other record types. For examples for each record type, see [Manage DNS records and record sets by using the Azure CLI 2.0](dns-operations-recordsets-cli.md).


## Verify name resolution

You can test your DNS records are present on the Azure DNS name servers by using DNS tools such as nslookup, dig, or the [Resolve-DnsName PowerShell cmdlet](https://technet.microsoft.com/library/jj590781.aspx).

If you haven't yet delegated your domain to use the new zone in Azure DNS, you need to [direct the DNS query directly to one of the name servers for your zone](dns-getstarted-create-dnszone.md#test-name-servers). Be sure the substitute the correct values for your records zone into the command below.

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

Learn how to [manage DNS zones by using the Azure CLI 2.0](dns-operations-dnszones-cli.md).

Learn how to [manage DNS records and record sets by using the Azure CLI 2.0](dns-operations-recordsets-cli.md).

