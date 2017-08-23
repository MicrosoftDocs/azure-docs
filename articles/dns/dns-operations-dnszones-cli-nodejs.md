---
title: Manage DNS zones in Azure DNS - Azure CLI 1.0 | Microsoft Docs
description: You can manage DNS zones using Azure CLI 1.0. This article shows how to update, delete and create DNS zones on Azure DNS.
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
ms.date: 12/21/2016
ms.author: gwallace
---

# How to manage DNS Zones in Azure DNS using the Azure CLI 1.0

> [!div class="op_single_selector"]
> * [Portal](dns-operations-dnszones-portal.md)
> * [PowerShell](dns-operations-dnszones.md)
> * [Azure CLI 1.0](dns-operations-dnszones-cli-nodejs.md)
> * [Azure CLI 2.0](dns-operations-dnszones-cli.md)

This guide shows how to manage your DNS zones by using the cross-platform Azure CLI 1.0, which is available for Windows, Mac and Linux. You can also manage your DNS zones using [Azure PowerShell](dns-operations-dnszones.md) or the Azure portal.

## CLI versions to complete the task

You can complete the task using one of the following CLI versions:

* [Azure CLI 1.0](dns-operations-dnszones-cli-nodejs.md) - our CLI for the classic and resource management deployment models.
* [Azure CLI 2.0](dns-operations-dnszones-cli.md) - our next generation CLI for the resource management deployment model.

## Introduction

[!INCLUDE [dns-create-zone-about](../../includes/dns-create-zone-about-include.md)]

[!INCLUDE [dns-cli-setup](../../includes/dns-cli-setup-include.md)]

## Getting help

All CLI 1.0 commands relating to Azure DNS start with `azure network dns`. Help is available for each command using the `--help` option (short form `-h`).  For example:

```azurecli
azure network dns -h
azure network dns zone -h
azure network dns zone create -h
```

## Create a DNS zone

A DNS zone is created using the `azure network dns zone create` command. For help, see `azure network dns zone create -h`.

The following example creates a DNS zone called *contoso.com* in the resource group called *MyResourceGroup*:

```azurecli
azure network dns zone create MyResourceGroup contoso.com
```

### To create a DNS zone with tags

The following example shows how to create a DNS zone with two [Azure Resource Manager tags](dns-zones-records.md#tags), *project = demo* and *env = test*, by using the `--tags` parameter (short form `-t`):

```azurecli
azure network dns zone create MyResourceGroup contoso.com -t "project=demo";"env=test"
```

## Get a DNS zone

To retrieve a DNS zone, use `azure network dns zone show`. For help, see `azure network dns zone show -h`.

The following example returns the DNS zone *contoso.com* and its associated data from resource group *MyResourceGroup*. 

```azurecli
azure network dns zone show MyResourceGroup contoso.com
```

The following example is the response.

```
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

This command does not update any of the DNS record sets within the zone (see [How to Manage DNS records](dns-operations-recordsets-cli-nodejs.md)). It is only used to update properties of the zone resource itself. These properties are currently limited to the [Azure Resource Manager 'tags'](dns-zones-records.md#tags) for the zone resource.

The following example shows how to update the tags on a DNS zone. The existing tags are replaced by the value specified.

```azurecli
azure network dns zone set MyResourceGroup contoso.com -t "team=support"
```

## Delete a DNS Zone

DNS zones can be deleted using `azure network dns zone delete`. For help, see `azure network dns zone delete -h`.

> [!NOTE]
> Deleting a DNS zone also deletes all DNS records within the zone. This operation cannot be undone. If the DNS zone is in use, services using the zone will fail when the zone is deleted.
>
>To protect against accidental zone deletion, see [How to protect DNS zones and records](dns-protect-zones-recordsets.md).

This command prompts for confirmation. The optional `--quiet` switch (short form `-q`) suppresses this prompt.

The following example shows how to delete the zone *contoso.com* from resource group *MyResourceGroup*.

```azurecli
azure network dns zone delete MyResourceGroup contoso.com
```

## Next steps

Learn how to [manage record sets and records](dns-getstarted-create-recordset-cli-nodejs.md) in your DNS zone.

Learn how to [delegate your domain to Azure DNS](dns-domain-delegation.md).

