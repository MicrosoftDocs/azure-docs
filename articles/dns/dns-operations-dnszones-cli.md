---
title: Manage DNS zones using CLI | Microsoft Docs
description: You can manage DNS zones using Azure CLI. How to update, delete and create DNS zones on Azure DNS
services: dns
documentationcenter: na
author: georgewallace
manager: timlt

ms.assetid: 8ab63bc4-5135-4ed8-8c0b-5f0712b9afed
ms.service: dns
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 12/07/2016
ms.author: gwallace
---

# How to manage DNS Zones using CLI

> [!div class="op_single_selector"]
> * [Azure CLI](dns-operations-dnszones-cli.md)
> * [PowerShell](dns-operations-dnszones.md)

This guide shows how to manage your DNS zone resources using the cross-platform Azure CLI.

These instructions use Microsoft Azure CLI. Be sure to update to the latest Azure CLI to use these Azure DNS commands. You can install Azure CLI for Windows, Linux, or MAC. More information is available at [Install the Azure CLI](../xplat-cli-install.md).

Azure DNS is an Azure Resource Manager-only service. It does not have a 'classic' deployment model. You need to make sure the Azure CLI is configured to use Resource Manager mode. You can do this by using the `azure config mode arm` command.

If you see the message "*error: 'dns' is not an azure command*", it's most likely because you are using Azure CLI in Azure Service Management mode, not Resource Manager mode.

All CLI commands relating to Azure DNS start with `azure network dns`. Help is available for each command using the `--help` option (short form `-h`).  For example:

```azurecli
azure network dns -h
azure network dns zone -h
azure network dns zone create -h
```

## Create a DNS zone

A DNS zone is created using the `azure network dns zone create` command. For help, see `azure network dns zone create -h`.

The examples below show how to create a DNS zone with or without [Azure Resource Manager tags](dns-zones-records.md#tags).

### To create a DNS zone

The example below creates a DNS zone called *contoso.com* in the resource group called *MyResourceGroup*. Use the example to create your DNS zone, substituting the values for your own.

```azurecli
azure network dns zone create MyResourceGroup contoso.com
```

### To create a DNS zone with tags.

The following example shows how to create a DNS zone with two tags, *project = demo* and *env = test*, using the `--tags` parameter (short form `-t`).

```azurecli
azure network dns zone create MyResourceGroup contoso.com -t "project=demo";"env=test"
```

## Get a DNS zone

To retrieve a DNS zone, use `azure network dns zone show`. For help, see `azure network dns zone show -h`.

The following example returns the DNS zone *contoso.com* and its associated data from resource group *MyResourceGroup*. 

```azurecli
azure network dns zone show MyResourceGroup contoso.com

info:    Executing command network dns zone show
+ Looking up the dns zone "contoso.com"
data:    Id                              : /subscriptions/.../contoso.com
data:    Name                            : contoso.com
data:    Type                            : Microsoft.Network/dnszones
data:    Location                        : global
data:    Number of record sets           : 2
data:    Max number of record sets       : 5000
data:    Name servers:
data:        ns1-01.azure-dns.com.
data:        ns2-01.azure-dns.net.
data:        ns3-01.azure-dns.org.
data:        ns4-01.azure-dns.info.
data:    Tags                            : project=demo;env=test
info:    network dns zone show command OK
```

Note that DNS records are not returned by `azure network dns zone show`. To list DNS records, use `azure network dns record-set list`.


## List DNS zones

To enumerate DNS zones, use `azure network dns zone list`. For help, see `azure network dns zone list -h`.

Specifying the resource group lists only those zones within the resource group:

```azurecli
azure network dns zone list MyResourceGroup
```

Omitting the resource group lists all zones in the subscription:

```azurecli
azure network dns zone list 
```

## Update a DNS zone

Changes to a DNS zone resource can be made using `azure network dns zone set`. For help, see `azure network dns zone set -h`.

This command does not update any of the DNS record sets within the zone (see [How to Manage DNS records](dns-operations-recordsets.md)). It is only used to update properties of the zone resource itself. These properties are currently limited to the [Azure Resource Manager 'tags'](dns-zones-records.md#tags) for the zone resource.

The following example shows how to update the tags on a DNS zone. The existing tags are replaced by the value specified.

```azurecli
azure network dns zone set MyResourceGroup contoso.com -t "team=support"
```

## Delete a DNS Zone

DNS zones can be deleted using `azure network dns zone delete`. For help, see `azure network dns zone delete -h`.

> [!NOTE]
> Deleting a DNS zone will also delete all DNS records within the zone. This operation cannot be undone. If the DNS zone is in use, services using the zone will fail when the zone is deleted.
>
>To protect against accidental zone deletion, see [How to protect DNS zones and records](dns-protect-zones-recordsets.md).

This command prompts for confirmation. The optional `--quiet` switch (short form `-q`) suppresses this prompt.

The following example shows how to delete the zone *contoso.com* from resource group *MyResourceGroup*.

```azurecli
azure network dns zone delete MyResourceGroup contoso.com
```

## Next steps

Learn how to [manage record sets and records](dns-getstarted-create-recordset-cli.md) in your DNS zone.
<br>
Learn how to [delegate your domain to Azure DNS](dns-domain-delegation.md).

