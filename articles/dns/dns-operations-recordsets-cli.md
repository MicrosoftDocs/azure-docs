---
title: Manage DNS records in Azure DNS using the Azure CLI
description: Managing DNS record sets and records on Azure DNS when hosting your domain on Azure DNS.
author: greg-lindsay
ms.assetid: 5356a3a5-8dec-44ac-9709-0c2b707f6cb5
ms.service: azure-dns
ms.devlang: azurecli
ms.topic: how-to
ms.custom: H1Hack27Feb2017, devx-track-azurecli
ms.date: 11/30/2023
ms.author: greglin
---

# Manage DNS records and recordsets in Azure DNS using the Azure CLI

> [!div class="op_single_selector"]
> * [Azure Portal](dns-operations-recordsets-portal.md)
> * [Azure CLI](dns-operations-recordsets-cli.md)
> * [PowerShell](dns-operations-recordsets.md)

This article shows you how to manage DNS records for your DNS zone by using the cross-platform Azure CLI. Azure CLI is available for Windows, Mac, and Linux. You can also manage your DNS records using [Azure PowerShell](dns-operations-recordsets.md) or the [Azure portal](dns-operations-recordsets-portal.md).

The examples in this article assume you've already [installed the Azure CLI, signed in, and created a DNS zone](dns-operations-dnszones-cli.md).

## Introduction

Before creating DNS records in Azure DNS, you first need to understand how Azure DNS organizes DNS records into DNS record sets.

[!INCLUDE [dns-about-records-include](../../includes/dns-about-records-include.md)]

For more information about DNS records in Azure DNS, see [DNS zones and records](dns-zones-records.md).

## Create a DNS record

To create a DNS record, use the `az network dns record-set <record-type> add-record` command (where `<record-type>` is the type of record, i.e a, srv, txt, etc.) For help, see `az network dns record-set --help`.

When creating a record, you need to specify the following information: 

* Resource group name
* Zone name
* Record set name
* Record type

The record set name given must be a *relative* name, meaning it must exclude the zone name. If the record set doesn't already exist, this command will create it for you. This command however will add the record you specify if the record set already exist.

If a new record set is created, a default time-to-live (TTL) of 3600 is used. For instructions on how to use different TTLs, see [Create a DNS record set](#create-a-dns-record-set).

The following example creates an A record called *www* in the zone *contoso.com* in the resource group *MyResourceGroup*. The IP address of the A record is *203.0.113.11*.

```azurecli-interactive
az network dns record-set a add-record --resource-group myresourcegroup --zone-name contoso.com --record-set-name www --ipv4-address 203.0.113.11
```

To create a record set in the apex of the zone (in this case, "contoso.com"), use the record name "\@", including the quotation marks:

```azurecli-interactive
az network dns record-set a add-record --resource-group myresourcegroup --zone-name contoso.com --record-set-name "@" --ipv4-address 203.0.113.11
```

## Create a DNS record set

In the above examples, the DNS record was either added to an existing record set, or the record set was created *implicitly*. You can also create the record set *explicitly* before adding records to it. Azure DNS supports 'empty' record sets, which can act as a placeholder to reserve a DNS name before creating DNS records. Empty record sets are visible in the Azure DNS control plane, but don't appear on the Azure DNS name servers.

Record sets are created using the `az network dns record-set <record-type> create` command. For help, see `az network dns record-set <record-type> create --help`.

Creating the record set explicitly allows you to specify record set properties such as the [Time-To-Live (TTL)](dns-zones-records.md#time-to-live) and metadata. [Record set metadata](dns-zones-records.md#tags-and-metadata) can be used to associate application-specific data with each record set, as key-value pairs.

The following example creates an empty record set of type 'A' with a 60-second TTL, by using the `--ttl` parameter (short form `-l`):

```azurecli-interactive
az network dns record-set a create --resource-group myresourcegroup --zone-name contoso.com --name www --ttl 60
```

The following example creates a record set with two metadata entries, "dept=finance" and "environment=production", by using the `--metadata` parameter:

```azurecli-interactive
az network dns record-set a create --resource-group myresourcegroup --zone-name contoso.com --name www --metadata "dept=finance" "environment=production"
```

Having created an empty record set, records can be added using `azure network dns record-set <record-type> add-record` as described in [Create a DNS record](#create-a-dns-record).

## Create records of other types

Having seen in detail how to create 'A' records, the following examples show how to create record of other record types supported by Azure DNS.

The parameters used to specify the record data vary depending on the type of the record. For example, for a record of type "A", you specify the IPv4 address with the parameter `--ipv4-address <IPv4 address>`. The parameters for each record type can be listed using `az network dns record-set <record-type> add-record --help`.

In each case, we show how to create a single record. The record is added to the existing record set, or a record set created implicitly. For more information on creating record sets and defining record set parameter explicitly, see [Create a DNS record set](#create-a-dns-record-set).

There's no example for create an SOA record set, since SOAs are created and deleted with each DNS zone. The SOA record can't be created or deleted separately. However, the SOA can be [modified](#to-modify-an-soa-record), as shown in a later example.

### Create an AAAA record

```azurecli-interactive
az network dns record-set aaaa add-record --resource-group myresourcegroup --zone-name contoso.com --record-set-name test-aaaa --ipv6-address FD00::1
```

### Create a CAA record

```azurecli-interactive
az network dns record-set caa add-record --resource-group myresourcegroup --zone-name contoso.com --record-set-name test-caa --flags 0 --tag "issue" --value "ca1.contoso.com"
```

### Create a CNAME record

> [!NOTE]
> The DNS standards do not permit CNAME records at the apex of a zone (`--Name "@"`), nor do they permit record sets containing more than one record.
> 
> For more information, see [CNAME records](dns-zones-records.md#cname-records).

```azurecli-interactive
az network dns record-set cname set-record --resource-group myresourcegroup --zone-name contoso.com --record-set-name test-cname --cname www.contoso.com
```

### Create an MX record

In this example, we use the record set name "\@" to create the MX record at the zone apex (in this case, "contoso.com").

```azurecli-interactive
az network dns record-set mx add-record --resource-group myresourcegroup --zone-name contoso.com --record-set-name "@" --exchange mail.contoso.com --preference 5
```

### Create an NS record

```azurecli-interactive
az network dns record-set ns add-record --resource-group myresourcegroup --zone-name contoso.com --record-set-name test-ns --nsdname ns1.fabrikam.com
```

### Create a PTR record

In this case, 'my-arpa-zone.com' represents the ARPA zone representing your IP range. Each PTR record set in this zone corresponds to an IP address within this IP range.  The record name '10' is the last octet of the IP address within this IP range represented by this record.

```azurecli-interactive
az network dns record-set ptr add-record --resource-group myresourcegroup --zone-name contoso.com --record-set-name my-arpa.zone.com --ptrdname myservice.contoso.com
```

### Create an SRV record

When creating an [SRV record set](dns-zones-records.md#srv-records), specify the *\_service* and *\_protocol* in the record set name. There's no need to include "\@" in the record set name when creating an SRV record set at the zone apex.

```azurecli-interactive
az network dns record-set srv add-record --resource-group myresourcegroup --zone-name contoso.com --record-set-name _sip._tls --priority 10 --weight 5 --port 8080 --target sip.contoso.com
```

### Create a TXT record

The following example shows how to create a TXT record. For more information about the maximum string length supported in TXT records, see [TXT records](dns-zones-records.md#txt-records).

```azurecli-interactive
az network dns record-set txt add-record --resource-group myresourcegroup --zone-name contoso.com --record-set-name test-txt --value "This is a TXT record"
```

## Get a record set

To retrieve an existing record set, use `az network dns record-set <record-type> show`. For help, see `az network dns record-set <record-type> show --help`.

When creating a record or record set, the record set name given must be a *relative* name. This name doesn't include the zone name. You also need to specify the record type, the zone containing the record set, and the resource group containing the zone.

The following example retrieves the record *www* of type A from zone *contoso.com* in resource group *MyResourceGroup*:

```azurecli-interactive
az network dns record-set a show --resource-group myresourcegroup --zone-name contoso.com --name www
```

## List record sets

You can list all records in a DNS zone by using the `az network dns record-set list` command. For help, see `az network dns record-set list --help`.

This example returns all record sets in the zone *contoso.com*, in resource group *MyResourceGroup*:

```azurecli-interactive
az network dns record-set list --resource-group myresourcegroup --zone-name contoso.com
```

This example returns all record sets that match the given record type (in this case, 'A' records):

```azurecli-interactive
az network dns record-set a list --resource-group myresourcegroup --zone-name contoso.com 
```

## Add a record to an existing record set

You can use `az network dns record-set <record-type> add-record` both to create a record in a new record set, or to add a record to an existing record set.

For more information, see [Create a DNS record](#create-a-dns-record) and [Create records of other types](#create-records-of-other-types) above.

## Remove a record from an existing record set.

To remove a DNS record from an existing record set, use `az network dns record-set <record-type> remove-record`. For help, see `az network dns record-set <record-type> remove-record -h`.

This command deletes a DNS record from a record set. If the last record in a record set is deleted, the record set itself is also deleted. To keep the empty record set instead, use the `--keep-empty-record-set` option.

When you use the `az network dns record-set <record-type> add-record` command, you need to specify the record getting deleted and the zone to delete from. These parameters are described in [Create a DNS record](#create-a-dns-record) and [Create records of other types](#create-records-of-other-types) above.

The following example deletes the A record with value '203.0.113.11' from the record set named *www* in the zone *contoso.com*, in the resource group *MyResourceGroup*.

```azurecli-interactive
az network dns record-set a remove-record --resource-group myresourcegroup --zone-name contoso.com --record-set-name "www" --ipv4-address 203.0.113.11
```

## Modify an existing record set

Each record set contains a [time-to-live (TTL)](dns-zones-records.md#time-to-live), [metadata](dns-zones-records.md#tags-and-metadata), and DNS records. The following sections explain how to modify each of these properties.

### To modify an A, AAAA, CAA, MX, NS, PTR, SRV, or TXT record

To modify an existing record of type A, AAAA, CAA, MX, NS, PTR, SRV, or TXT, you should first add a new record and then delete the existing record. For detailed instructions on how to delete and add records, see the earlier sections of this article.

The following example shows how to modify an 'A' record, from IP address 203.0.113.11 to IP address 203.0.113.22:

```azurecli-interactive
az network dns record-set a add-record --resource-group myresourcegroup --zone-name contoso.com --record-set-name www --ipv4-address 203.0.113.22
az network dns record-set a remove-record --resource-group myresourcegroup --zone-name contoso.com --record-set-name www --ipv4-address 203.0.113.11
```

You can't add, remove, or modify the records in the automatically created NS record set at the zone apex (`--Name "@"`, including quote marks). For this record set, the only changes permitted are to modify the record set TTL and metadata.

### To modify a CNAME record

Unlike most other record types, a CNAME record set can only contain a single record.  That's why you can't replace the current value by adding a new record and removing the existing record like other record types.

Instead, to modify a CNAME record, use `az network dns record-set cname set-record`. For help, see `az network dns record-set cname set-record --help`

The example modifies the CNAME record set *www* in the zone *contoso.com*, in resource group *MyResourceGroup*, to point to 'www.fabrikam.net' instead of its existing value:

```azurecli-interactive
az network dns record-set cname set-record --resource-group myresourcegroup --zone-name contoso.com --record-set-name test-cname --cname www.fabrikam.net
``` 

### To modify an SOA record

Unlike most other record types, a SOA record set can only contain a single record.  That's why you can't replace the current value by adding a new record and removing the existing record like other record types.

Instead, to modify the SOA record, use `az network dns record-set soa update`. For help, see `az network dns record-set soa update --help`.

The following example shows how to set the 'email' property of the SOA record for the zone *contoso.com*:

```azurecli-interactive
az network dns record-set soa update --resource-group myresourcegroup --zone-name contoso.com --email admin.contoso.com
```

### To modify NS records at the zone apex

The NS record set at the zone apex is automatically created with each DNS zone. It contains the names of the Azure DNS name servers assigned to the zone.

You can add more name servers to this NS record set, to support cohosting domains with more than one DNS provider. You may also modify the TTL and metadata for this record set. However, you can't remove or modify the pre-populated Azure DNS name servers.

This restriction applies only to the NS record set at the zone apex. Other NS record sets in your zone (as used to delegate child zones) can be modified without constraint.

The following example shows how to add another name server to the NS record set at the zone apex:

```azurecli-interactive
az network dns record-set ns add-record --resource-group myresourcegroup --zone-name contoso.com --record-set-name "@" --nsdname ns1.fabrikam.com 
```

### To modify the TTL of an existing record set

To modify the TTL of an existing record set, use `azure network dns record-set <record-type> update`. For help, see `azure network dns record-set <record-type> update --help`.

The following example shows how to modify a record set TTL, in this case to 60 seconds:

```azurecli-interactive
az network dns record-set a update --resource-group myresourcegroup --zone-name contoso.com --name www --set ttl=60
```

### To modify the metadata of an existing record set

[Record set metadata](dns-zones-records.md#tags-and-metadata) can be used to associate application-specific data with each record set, as key-value pairs. To modify the metadata of an existing record set, use `az network dns record-set <record-type> update`. For help, see `az network dns record-set <record-type> update --help`.

The following example shows how to modify a record set with two metadata entries, "dept=finance" and "environment=production". Any existing metadata is *replaced* by the values given.

```azurecli-interactive
az network dns record-set a update --resource-group myresourcegroup --zone-name contoso.com --name www --set metadata.dept=finance metadata.environment=production
```

## Delete a record set

Record sets can be deleted by using the `az network dns record-set <record-type> delete` command. For help, see `azure network dns record-set <record-type> delete --help`. Deleting a record set also deletes all records within the record set.

> [!NOTE]
> You cannot delete the SOA and NS record sets at the zone apex (`--name "@"`).  These are created automatically when the zone was created, and are deleted automatically when the zone is deleted.

The following example deletes the record set named *www* of type A from the zone *contoso.com* in resource group *MyResourceGroup*:

```azurecli-interactive
az network dns record-set a delete --resource-group myresourcegroup --zone-name contoso.com --name www
```

You're prompted to confirm the delete operation. To suppress this prompt, use the `--yes` switch.

## Next steps

Learn more about [zones and records in Azure DNS](dns-zones-records.md).
<br>
Learn how to [protect your zones and records](dns-protect-zones-recordsets.md) when using Azure DNS.
