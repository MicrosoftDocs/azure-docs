---
title: Get started with Azure DNS Private Zones using Azure CLI 2.0 | Microsoft Docs
description: Learn how to create a Private DNS zone and record in Azure DNS. This is a step-by-step guide to create and manage your first DNS Private zone and record using the Azure CLI 2.0.
services: dns
documentationcenter: na
author: KumuD
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: fb0aa0a6-d096-4d6a-b2f6-eda1c64f6182
ms.service: dns
ms.devlang: azurecli
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/15/2018
ms.author: victorh
---

# Get started with Azure DNS Private Zones using Azure CLI 2.0

> [!div class="op_single_selector"]
> * [PowerShell](private-dns-getstarted-powershell.md)
> * [Azure CLI 2.0](private-dns-getstarted-cli.md)

This article walks you through the steps to create your first DNS private zone and record using the cross-platform Azure CLI 2.0, which is available for Windows, Mac and Linux. You can also perform these steps using the Azure PowerShell.

[!INCLUDE [private-dns-public-preview-notice](../../includes/private-dns-public-preview-notice.md)]

A DNS zone is used to host the DNS records for a particular domain. To start hosting your domain in Azure DNS, you need to create a DNS zone for that domain name. Each DNS record for your domain is then created inside this DNS zone. To publish a private DNS zone to your virtual network, you specify the list of virtual networks that are allowed to resolve records within the zone.  We call these 'resolution virtual networks'.  You may also specify a virtual network for which Azure DNS maintains hostname records whenever a VM is created, changes IP, or is destroyed.  We call this a 'registration virtual network'.

These instructions assume you have already installed and signed in to Azure CLI 2.0 and also installed the needed CLI extension that supports Private Zones. For help, see [How to manage DNS zones using Azure CLI 2.0](dns-operations-dnszones-cli.md).

## To install/use Azure DNS Private Zones feature (Public Preview)
The Azure DNS Private Zone feature is released in Public Preview via an extension to the Azure CLI. Install the “dns” Azure CLI extension 

```
az extension add --name dns
``` 

## Create the resource group

Before creating the DNS zone, a resource group is created to contain the DNS Zone. The following shows the command.

```azurecli
az group create --name MyResourceGroup --location "West US"
```

## Create a DNS private zone

A DNS private zone is created using the `az network dns zone create` command. To see help for this command, type `az network dns zone create --help`.

The following example creates a DNS private zone called *contoso.local* in the resource group *MyResourceGroup* and makes it available (links to) the virtual network *MyAzureVnet* using the resolution-vnets parameter. Use the example to create a DNS zone, substituting the values for your own.

```azurecli
az network dns zone create -g MyResourceGroup -n contoso.local --zone-type Private --resolution-vnets MyAzureVnet
```

Note: In the above example, the virtual network "MyAzureVnet" belongs to the same Resource Group and Subscription as the private zone. If you need to link a virtual network that belongs to a different Resource Group or Subscription, you need to specify the full Azure Resource Manager ID instead of just the virtual network name, for the parameter --resolution-vnets. 

If you need Azure to automatically create hostname records in the zone, use the *registration-vnets* parameter instead of *resolution-vnets*.  Registration virtual networks are automatically enabled for resolution.

```azurecli
az network dns zone create -g MyResourceGroup -n contoso.local --zone-type Private --registration-vnets MyAzureVnet
```

## Create a DNS record

To create a DNS record, use the `az network dns record-set [record type] add-record` command. For help, for A records for example, see `azure network dns record-set A add-record --help`.

The following example creates a record with the relative name "ip1" in the DNS Zone "contoso.local", in resource group "MyResourceGroup". The fully-qualified name of the record set is "ip1.contoso.local". The record type is "A", with IP address "10.0.0.1".

```azurecli
az network dns record-set a add-record -g MyResourceGroup -z contoso.local -n ip1 -a 10.0.0.1
```

For other record types, for record sets with more than one record, for alternative TTL values, and to modify existing records, see [Manage DNS records and record sets using the Azure CLI 2.0](dns-operations-recordsets-cli.md).

## View records

To list the DNS records in your zone, use:

```azurecli
az network dns record-set list -g MyResourceGroup -z contoso.com
```

## Get a DNS private zone

To retrieve a DNS private zone, use `az network dns zone show`. For help, see `az network dns zone show --help`.

The following example returns the DNS zone *contoso.local* and its associated data from resource group *MyResourceGroup*. 

```azurecli
az network dns zone show --resource-group MyResourceGroup --name contoso.local
```

The following example is the response.

```json
{
  "etag": "00000002-0000-0000-3d4d-64aa3689d201",
  "id": "/subscriptions/147a22e9-2356-4e56-b3de-1f5842ae4a3b/resourceGroups/MyResourceGroup/providers/Microsoft.Network/dnszones/contoso.local",
  "location": "global",
  "maxNumberOfRecordSets": 5000,
  "name": "contoso.local",
  "nameServers": null,
  "numberOfRecordSets": 1,
  "registrationVirtualNetworks": [],
  "resolutionVirtualNetworks": [
    {
      "additionalProperties": {},
      "id": "/subscriptions/147a22e9-2356-4e56-b3de-1f5842ae4a3b/resourceGroups/MyResourceGroup/providers/Microsoft.Network/virtualNetworks/MyAzureVnet",
      "resourceGroup": "MyResourceGroup"
    }
  ]
  "resourceGroup": "MyResourceGroup",
  "tags": {},
  "type": "Microsoft.Network/dnszones",
  "zoneType": "Private"
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

This command does not update any of the DNS record sets within the zone (see [How to Manage DNS records](dns-operations-recordsets-cli.md)). It is only used to update properties of the zone resource itself. For private zones, you can update the Registration or Resolution virtual networks linked to a zone. 

The following example shows how to update the Resolution virtual network linked to a DNS private zone. The existing linked Resolution virtual network is replaced by the new virtual network specified.

```azurecli
az network dns zone update --resource-group MyResourceGroup --name contoso.local --zone-type Private --resolution-vnets MyNewAzureVnet
```

## Delete a DNS zone

DNS zones can be deleted using `az network dns zone delete`. For help, see `az network dns zone delete --help`.

> [!NOTE]
> Deleting a DNS zone also deletes all DNS records within the zone. This operation cannot be undone. If the DNS zone is in use, services using the zone will fail when the zone is deleted.
>
>To protect against accidental zone deletion, see [How to protect DNS zones and records](dns-protect-zones-recordsets.md).

This command prompts for confirmation. The optional `--yes` switch suppresses this prompt.

The following example shows how to delete the zone *contoso.local* from resource group *MyResourceGroup*.

```azurecli
az network dns zone delete --resource-group myresourcegroup --name contoso.local
```

## Delete all resources
 
To delete all resources created in this article, take the following step:

```azurecli
az group delete --name MyResourceGroup
```

## Next steps

To learn more about Azure DNS, see [Azure DNS overview](dns-overview.md).

To learn more about managing DNS zones in Azure DNS, see [Manage DNS zones in Azure DNS using Azure CLI 2.0](dns-operations-dnszones-cli.md).

To learn more about managing DNS records in Azure DNS, see [Manage DNS records and record sets in Azure DNS using Azure CLI 2.0](dns-operations-recordsets-cli.md).
