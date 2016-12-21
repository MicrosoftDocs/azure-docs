---
title: How to create and manage a DNS zone in the Azure portal | Microsoft Docs
description: Learn how to create DNS zones in Azure DNS. This is a step-by-step guide to create and manage your first DNS zone using the Azure portal.
services: dns
documentationcenter: na
author: georgewallace
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: f44c5ea1-4c85-469e-888e-5f5b34451664
ms.service: dns
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 12/05/2016
ms.author: gwallace
---

# Create a DNS zone in the Azure portal

> [!div class="op_single_selector"]
> * [Azure Portal](dns-getstarted-create-dnszone-portal.md)
> * [PowerShell](dns-getstarted-create-dnszone.md)
> * [Azure CLI](dns-getstarted-create-dnszone-cli.md)

This article walks you through the steps to create a DNS zone using the Azure portal. You can also create a DNS zone using PowerShell or CLI.

[!INCLUDE [dns-create-zone-about](../../includes/dns-create-zone-about-include.md)]

## Create a DNS zone

1. Sign in to the Azure portal
2. On the Hub menu, click and click **New > Networking >** and then click **DNS zone** to open the Create DNS zone blade.

    ![DNS zone](./media/dns-getstarted-create-dnszone-portal/openzone650.png)

4. On the **Create DNS zone** blade, Name your DNS zone. For example, *contoso.com*.
 
    ![Create zone](./media/dns-getstarted-create-dnszone-portal/newzone250.png)

5. Next, specify the resource group that you want to use. You can either create a new resource group, or select one that already exists. If you choose to create a new resource group, use the **Location** dropdown to specify the location of the resource group. Note that this setting refers to the location of the resource group, and has no impact on the DNS zone. The DNS zone location is always "global", and is not shown.

6. You can leave the **Pin to dashboard** checkbox selected if you want to easily locate your new zone on your dashboard. Then click **Create**.

    ![Pin to dashboard](./media/dns-getstarted-create-dnszone-portal/pindashboard150.png)

7. After you click Create, you'll see your new zone being configured on the dashboard.

    ![Creating](./media/dns-getstarted-create-dnszone-portal/creating150.png)

8. When your new zone has been created, the blade for your new zone will open on the dashboard.

## View records

Creating a DNS zone also creates the following records:

* The "Start of Authority" (SOA) record. The SOA is present at the root of every DNS zone.
* The authoritative name server (NS) records. These show which name servers are hosting the zone. Azure DNS uses a pool of name servers, and so different name servers may be assigned to different zones in Azure DNS. See [Delegate a domain to Azure DNS](dns-domain-delegation.md) for more information.

In the lower part of the DNS Zone blade, you can see the record sets for the DNS zone.

![zone](./media/dns-getstarted-create-dnszone-portal/viewzone500.png)

## Test name servers

You can test your DNS zone is present on the Azure DNS name servers by using DNS tools such as nslookup, dig, or the [Resolve-DnsName PowerShell cmdlet](https://technet.microsoft.com/library/jj590781.aspx).

If you haven't yet delegated your domain to use the new zone in Azure DNS, you need to direct the DNS query directly to one of the name servers for your zone. The name servers for your zone are given in the Azure portal:
    
![zone](./media/dns-getstarted-create-dnszone-portal/viewzonens500.png)

Be sure the substitute the correct name server for your zone into the command below.

    nslookup
    > set type=SOA
    > server ns1-01.azure-dns.com
    > contoso.com

    Server: ns1-01.azure-dns.com
    Address:  208.76.47.1

    contoso.com
            primary name server = ns1-01.azure-dns.com
            responsible mail addr = azuredns-hostmaster.microsoft.com
            serial  = 1
            refresh = 3600 (1 hour)
            retry   = 300 (5 mins)
            expire  = 2419200 (28 days)
            default TTL = 300 (5 mins)

## Next steps

After creating a DNS zone, [create record sets and records](dns-getstarted-create-recordset-portal.md) to create DNS records for your Internet domain.

