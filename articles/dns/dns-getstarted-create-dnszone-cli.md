---
title: Create a DNS zone using Azure CLI 2.0 | Microsoft Docs
description: Learn how to create DNS zones in Azure DNS. This is a step-by-step guide to create and manage your first DNS zone using the Azure CLI 2.0.
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
ms.date: 02/27/2017
ms.author: gwallace
---

# Create an Azure DNS zone using Azure CLI 2.0

> [!div class="op_single_selector"]
> * [Azure portal](dns-getstarted-create-dnszone-portal.md)
> * [PowerShell](dns-getstarted-create-dnszone.md)
> * [Azure CLI 1.0](dns-getstarted-create-dnszone-cli-nodejs.md)
> * [Azure CLI 2.0](dns-getstarted-create-dnszone-cli.md)

This article walks you through the steps to create a DNS zone using the cross-platform Azure CLI, which is available for Windows, Mac and Linux. You can also create a DNS zone using [Azure PowerShell](dns-getstarted-create-dnszone.md) or the [Azure portal](dns-getstarted-create-dnszone-portal.md).

## CLI versions to complete the task

You can complete the task using one of the following CLI versions:

* [Azure CLI 1.0](dns-getstarted-create-dnszone-cli-nodejs.md) - our CLI for the classic and resource management deployment models.
* [Azure CLI 2.0](dns-getstarted-create-dnszone-cli.md) - our next generation CLI for the resource management deployment model.

## Introduction

[!INCLUDE [dns-create-zone-about](../../includes/dns-create-zone-about-include.md)]

## Set up Azure CLI 2.0 for Azure DNS

### Before you begin

Verify that you have the following items before beginning your configuration.

* An Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).

* Install the latest version of the Azure CLI, available for Windows, Linux, or MAC. More information is available at [Install the Azure CLI 2.0](https://docs.microsoft.com/en-us/cli/azure/install-az-cli2).

### Sign in to your Azure account

Open a console window and authenticate with your credentials. For more information, see Log in to Azure from the Azure CLI

```azurecli
az login
```

### Select the subscription

Check the subscriptions for the account.

```azurecli
az account list
```

### Choose which of your Azure subscriptions to use.

```azurecli
az account set --subscription "subscription name"
```

### Create a resource group

Azure Resource Manager requires that all resource groups specify a location. This is used as the default location for resources in that resource group. However, because all DNS resources are global, not regional, the choice of resource group location has no impact on Azure DNS.

You can skip this step if you are using an existing resource group.

```azurecli
az group create --name myresourcegroup --location "West US"
```

## Create a DNS zone

A DNS zone is created using the `az network dns zone create` command. To see help for this command, type `az network dns zone create --help`.

The following example creates a DNS zone called *contoso.com* in the resource group called *MyResourceGroup*. Use the example to create a DNS zone, substituting the values for your own.

```azurecli
az network dns zone create --resource-group myresourcegroup --name contoso.com
```

## Verify your DNS zone

### View records

Creating a DNS zone also creates the following DNS records:

* The *Start of Authority* (SOA) record. This record is present at the root of every DNS zone.
* The authoritative name server (NS) records. These records show which name servers are hosting the zone. Azure DNS uses a pool of name servers, and so different name servers may be assigned to different zones in Azure DNS. For more information, see [delegate a domain to Azure DNS](dns-domain-delegation.md).

To view these records, use `az network dns record-set list`:

```azurecli
az network dns record-set list --resource-group MyResourceGroup --zone-name contoso.com
```

The response for `az network dns record-set list` is shown below:

```json
[
  {
    "etag": "510f4711-8b7f-414e-b8d5-c0383ea3d62e",
    "id": "/subscriptions/147a22e9-2356-4e56-b3de-1f5842ae4a3b/resourceGroups/myresourcegroup/providers/Microsoft.Network/dnszones/contoso.com/NS/@",
    "metadata": null,
    "name": "@",
    "nsRecords": [
      {
        "nsdname": "ns1-04.azure-dns.com."
      },
      {
        "nsdname": "ns2-04.azure-dns.net."
      },
      {
        "nsdname": "ns3-04.azure-dns.org."
      },
      {
        "nsdname": "ns4-04.azure-dns.info."
      }
    ],
    "resourceGroup": "myresourcegroup",
    "ttl": 172800,
    "type": "Microsoft.Network/dnszones/NS"
  },
  {
    "etag": "0e48e82f-f194-4d3e-a864-7e109a95c73a",
    "id": "/subscriptions/147a22e9-2356-4e56-b3de-1f5842ae4a3b/resourceGroups/myresourcegroup/providers/Microsoft.Network/dnszones/contoso.com/SOA/@",
    "metadata": null,
    "name": "@",
    "resourceGroup": "myresourcegroup",
    "soaRecord": {
      "email": "azuredns-hostmaster.microsoft.com",
      "expireTime": 2419200,
      "host": "ns1-04.azure-dns.com.",
      "minimumTtl": 300,
      "refreshTime": 3600,
      "retryTime": 300,
      "serialNumber": 1
    },
    "ttl": 3600,
    "type": "Microsoft.Network/dnszones/SOA"
  }
]
```

> [!NOTE]
> Record sets at the root (or *apex*) of a DNS Zone use **@** as the record set name.

### Test name servers

You can test your DNS zone is present on the Azure DNS name servers by using DNS tools such as nslookup, dig, or the `Resolve-DnsName` PowerShell cmdlet.

If you haven't yet delegated your domain to use the new zone in Azure DNS, you need to direct the DNS query directly to one of the name servers for your zone. The name servers for your zone are given in the NS records, as given by `az network dns record-set list`.

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

