---
title: Create a record set and records for a DNS Zone using CLI| Microsoft Docs
description: How to create host records for Azure DNS.Setting up record sets and records using CLI
services: dns
documentationcenter: na
author: georgewallace
manager: timlt

ms.assetid: 02b897d3-e83b-4257-b96d-5c29aa59e843
ms.service: dns
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 12/09/2016
ms.author: gwallace
---

# Create DNS record sets and records by using CLI

> [!div class="op_single_selector"]
> * [Azure Portal](dns-getstarted-create-recordset-portal.md)
> * [PowerShell](dns-getstarted-create-recordset.md)
> * [Azure CLI](dns-getstarted-create-recordset-cli.md)

This article walks you through the process of creating records and records sets by using CLI. To do this, you first need to understand DNS records and record sets.

[!INCLUDE [dns-about-records-include](../../includes/dns-about-records-include.md)]

This section describes how to create DNS records in Azure DNS. The examples assume you have already [installed the Azure CLI, signed in, and created a DNS zone](dns-getstarted-create-dnszone-cli.md).

The examples on this page all use the 'A' DNS record type. For other record types and further details on how to manage DNS records and record sets, see [Manage DNS records and record sets by using the Azure CLI](dns-operations-recordsets-cli.md).

## Create a record set and record

In this section, we'll show you how to create a record set and records. In this example, you'll create a record set that has the relative name "www" in the DNS zone "contoso.com". The fully-qualified name of the records is "www.contoso.com". The record type is "A", and the time to live (TTL) is 60 seconds. After completing this step, you will have created an empty record set.

To create a record set in the apex of the zone (in this case, "contoso.com"), use the record name "@", including the quotation marks. This is a common DNS convention.

### 1. Create a record set

If your new record has the same name and type as an existing record, you need to add it to the existing record set. You can omit this step and skip to [Add records](#add-records) below. Otherwise, if your new record has a different name and type to all existing records, you need to create a new record set.

You create record sets by using the `azure network dns record-set create` command. For help, see `azure network dns record-set create -h`.  

When creating a record set, you need to specify the record set name, the zone, the time to live (TTL), and the record type. 

```azurecli
azure network dns record-set create myresourcegroup contoso.com www A 60
```

After completing this step, you will have an empty "www" record set. To use the newly created "www" record set, you first need to add records to it.

### 2. Add records

You add records to record sets by using `azure network dns record-set add-record`. For help, see `azure network dns record-set add-record -h`.

The parameters for adding records to a record set vary depending on the type of the record set. For example, when using a record set of type "A", you can only specify records with the parameter `-a <IPv4 address>`. See `azure network dns record-set add-record -h` to list the parameters for other record types.

You can add an A record to the "www" record set created above by using the following command:

```azurecli
azure network dns record-set add-record myresourcegroup contoso.com  www A  -a 1.2.3.4
```

### Verify name resolution

You can test your DNS records are present on the Azure DNS name servers by using DNS tools such as nslookup, dig, or the [Resolve-DnsName PowerShell cmdlet](https://technet.microsoft.com/library/jj590781.aspx).

If you haven't yet delegated your domain to use the new zone in Azure DNS, you need to [direct the DNS query directly to one of the name servers for your zone](dns-getstarted-create-dnszone.md#test-name-servers). Be sure the substitute the correct values for your records zone into the command below.

    nslookup
    > set type=A
    > server ns1-01.azure-dns.com
    > www.contoso.com

    Server:  ns1-01.azure-dns.com
    Address:  40.90.4.1

	Name:    www.contoso.com
	Address:  1.2.3.4

## Next steps

Learn how to [delegate your domain name to the Azure DNS name servers](dns-domain-delegation.md)

Learn how to [manage DNS zones by using the Azure CLI](dns-operations-dnszones-cli.md).

Learn how to [manage DNS records and record sets by using the Azure CLI](dns-operations-recordsets-cli.md).

