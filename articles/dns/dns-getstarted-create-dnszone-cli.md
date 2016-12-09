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
ms.date: 12/05/2016
ms.author: gwallace
---

# Create an Azure DNS zone using CLI

> [!div class="op_single_selector"]
> * [Azure Portal](dns-getstarted-create-dnszone-portal.md)
> * [PowerShell](dns-getstarted-create-dnszone.md)
> * [Azure CLI](dns-getstarted-create-dnszone-cli.md)

This article walks you through the steps to create a DNS zone using the cross-platform Azure CLI, which is available for Windows, Mac and Linux. You can also create a DNS zone using PowerShell or the Azure portal.

[!INCLUDE [dns-create-zone-about](../../includes/dns-create-zone-about-include.md)]


## Before you begin

Verify that you have the following items before beginning your configuration.

* An Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).
* You need to install the latest version of the Azure CLI, available for Windows, Linux, or MAC. More information is available at [Install the Azure CLI](../xplat-cli-install.md).

## Step 1 - Sign in and create a resource group

### Switch CLI mode

Azure DNS uses Azure Resource Manager. Make sure you switch CLI mode to use ARM commands.

```azurecli
azure config mode arm
```

### Sign in to your Azure account

You will be prompted to authenticate with your credentials. Keep in mind that you can only use OrgID accounts.

```azurecli
azure login
```

### Select the subscription

Check the subscriptions for the account.

```azurecli
azure account list
```

Choose which of your Azure subscriptions to use.

```azurecli
azure account set "subscription name"
```

### Create a resource group

Azure Resource Manager requires that all resource groups specify a location. This is used as the default location for resources in that resource group. However, because all DNS resources are global, not regional, the choice of resource group location has no impact on Azure DNS.

You can skip this step if you are using an existing resource group.

```azurecli
azure group create -n myresourcegroup --location "West US"
```

### Register resource provider

The Azure DNS service is managed by the Microsoft.Network resource provider. Your Azure subscription needs to be registered to use this resource provider before you can use Azure DNS. This is a one-time operation for each subscription.

```azurecli
azure provider register --namespace Microsoft.Network
```

## Step 2 - Create a DNS zone

A DNS zone is created using the `azure network dns zone create` command. To see help for this command, type `azure network dns zone create -h`.

The example below creates a DNS zone called *contoso.com* in the resource group called *MyResourceGroup*. Use the example to create a DNS zone, substituting the values for your own.

```azurecli
azure network dns zone create MyResourceGroup contoso.com
```

## Step 3 - Verify

### View records

Creating a DNS zone also creates the following DNS records:

* The 'Start of Authority' (SOA) record. This is present at the root of every DNS zone.
* The authoritative name server (NS) records. These show which name servers are hosting the zone. Azure DNS uses a pool of name servers, and so different name servers can be assigned to different zones in Azure DNS. See [Delegate a domain to Azure DNS](dns-domain-delegation.md) for more information.

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

If you haven't yet delegated your domain to use the new zone in Azure DNS, you need to direct the DNS query directly to one of the name servers for your zone. The name servers for your zone are given in the NS records, as listed by "azure network dns record-set show" above. Be sure the substitute the correct values for your zone in the command below.

The following example uses 'dig' to query the domain contoso.com using the name servers assigned for the DNS zone. The query has to point to a name server for which we used *@\<name server for the zone\>* and zone name using 'dig'.

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

## Next steps

After creating a DNS zone, [create record sets and records](dns-getstarted-create-recordset-cli.md) to create DNS records for your Internet domain.

