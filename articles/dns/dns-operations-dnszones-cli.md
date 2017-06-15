---
title: Manage DNS zones in Azure DNS - Azure CLI 2.0 | Microsoft Docs
description: You can manage DNS zones using Azure CLI 2.0. This article shows how to update, delete and create DNS zones on Azure DNS.
services: dns
documentationcenter: na
author: georgewallace
manager: timlt

ms.assetid: 8ab63bc4-5135-4ed8-8c0b-5f0712b9afed
ms.service: dns
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/27/2017
ms.author: gwallace
---

# How to manage DNS Zones in Azure DNS using the Azure CLI 2.0

> [!div class="op_single_selector"]
> * [Portal](dns-operations-dnszones-portal.md)
> * [PowerShell](dns-operations-dnszones.md)
> * [Azure CLI 1.0](dns-operations-dnszones-cli-nodejs.md)
> * [Azure CLI 2.0](dns-operations-dnszones-cli.md)


This guide shows how to manage your DNS zones by using the cross-platform Azure CLI, which is available for Windows, Mac and Linux. You can also manage your DNS zones using [Azure PowerShell](dns-operations-dnszones.md) or the Azure portal.

## CLI versions to complete the task

You can complete the task using one of the following CLI versions:

* [Azure CLI 1.0](dns-operations-dnszones-cli-nodejs.md) - our CLI for the classic and resource management deployment models.
* [Azure CLI 2.0](dns-operations-dnszones-cli.md) - our next generation CLI for the resource management deployment model.

## Introduction

[!INCLUDE [dns-create-zone-about](../../includes/dns-create-zone-about-include.md)]

## Set up Azure CLI 2.0 for Azure DNS

### Before you begin

Verify that you have the following items before beginning your configuration.

* An Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).

* Install the latest version of the Azure CLI 2.0, available for Windows, Linux, or MAC. More information is available at [Install the Azure CLI 2.0](https://docs.microsoft.com/en-us/cli/azure/install-az-cli2).

### Sign in to your Azure account

Open a console window and authenticate with your credentials. For more information, see Log in to Azure from the Azure CLI

```
az login
```

### Select the subscription

Check the subscriptions for the account.

```
az account list
```

Choose which of your Azure subscriptions to use.

```azurecli
az account set --subscription "subscription name"
```

### Create a resource group

Azure Resource Manager requires that all resource groups specify a location. This is used as the default location for resources in that resource group. However, because all DNS resources are global, not regional, the choice of resource group location has no impact on Azure DNS.

You can skip this step if you are using an existing resource group.

```azurecli
az group create --name myresourcegroup --location "West US"
```

## Getting help

All CLI 2.0 commands relating to Azure DNS start with `az network dns`. Help is available for each command using the `--help` option (short form `-h`).  For example:

```azurecli
az network dns --help
az network dns zone --help
az network dns zone create --help
```

## Create a DNS zone

A DNS zone is created using the `az network dns zone create` command. For help, see `az network dns zone create -h`.

The following example creates a DNS zone called *contoso.com* in the resource group called *MyResourceGroup*:

```azurecli
az network dns zone create --resource-group MyResourceGroup --name contoso.com
```

### To create a DNS zone with tags

The following example shows how to create a DNS zone with two [Azure Resource Manager tags](dns-zones-records.md#tags), *project = demo* and *env = test*, by using the `--tags` parameter (short form `-t`):

```azurecli
az network dns zone create --resource-group MyResourceGroup --name contoso.com --tags "project=demo" "env=test"
```

## Get a DNS zone

To retrieve a DNS zone, use `az network dns zone show`. For help, see `az network dns zone show --help`.

The following example returns the DNS zone *contoso.com* and its associated data from resource group *MyResourceGroup*. 

```azurecli
az network dns zone show --resource-group myresourcegroup --name contoso.com
```

The following example is the response.

```json
{
  "etag": "00000002-0000-0000-3d4d-64aa3689d201",
  "id": "/subscriptions/147a22e9-2356-4e56-b3de-1f5842ae4a3b/resourceGroups/myresourcegroup/providers/Microsoft.Network/dnszones/contoso.com",
  "location": "global",
  "maxNumberOfRecordSets": 5000,
  "name": "contoso.com",
  "nameServers": [
    "ns1-04.azure-dns.com.",
    "ns2-04.azure-dns.net.",
    "ns3-04.azure-dns.org.",
    "ns4-04.azure-dns.info."
  ],
  "numberOfRecordSets": 4,
  "resourceGroup": "myresourcegroup",
  "tags": {},
  "type": "Microsoft.Network/dnszones"
}
```

Note that DNS records are not returned by `az network dns zone show`. To list DNS records, use `az network dns record-set list`.


## List DNS zones

To enumerate DNS zones, use `az network dns zone list`. For help, see `az network dns zone list --help`.

Specifying the resource group lists only those zones within the resource group:

```azurecli
az network dns zone list --resource-group MyResourceGroup
```

Omitting the resource group lists all zones in the subscription:

```azurecli
az network dns zone list 
```

## Update a DNS zone

Changes to a DNS zone resource can be made using `az network dns zone update`. For help, see `az network dns zone update --help`.

This command does not update any of the DNS record sets within the zone (see [How to Manage DNS records](dns-operations-recordsets-cli.md)). It is only used to update properties of the zone resource itself. These properties are currently limited to the [Azure Resource Manager 'tags'](dns-zones-records.md#tags) for the zone resource.

The following example shows how to update the tags on a DNS zone. The existing tags are replaced by the value specified.

```azurecli
az network dns zone update --resource-group myresourcegroup --name contoso.com --set tags.team=support
```

## Delete a DNS zone

DNS zones can be deleted using `az network dns zone delete`. For help, see `az network dns zone delete --help`.

> [!NOTE]
> Deleting a DNS zone also deletes all DNS records within the zone. This operation cannot be undone. If the DNS zone is in use, services using the zone will fail when the zone is deleted.
>
>To protect against accidental zone deletion, see [How to protect DNS zones and records](dns-protect-zones-recordsets.md).

This command prompts for confirmation. The optional `--yes` switch suppresses this prompt.

The following example shows how to delete the zone *contoso.com* from resource group *MyResourceGroup*.

```azurecli
az network dns zone delete --resource-group myresourcegroup --name contoso.com
```

## Next steps

Learn how to [manage record sets and records](dns-getstarted-create-recordset-cli.md) in your DNS zone.

Learn how to [delegate your domain to Azure DNS](dns-domain-delegation.md).

