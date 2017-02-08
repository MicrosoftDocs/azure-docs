---
title: Create a record set and records for a DNS Zone using the Azure portal | Microsoft Docs
description: How to create host records for Azure DNS and create record sets and records using the Azure portal
services: dns
documentationcenter: na
author: georgewallace
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: f93905f4-e82e-45db-b490-878d318e6aba
ms.service: dns
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 08/16/2016
ms.author: gwallace
---

# Create DNS record sets and records by using the Azure portal

> [!div class="op_single_selector"]
> * [Azure Portal](dns-getstarted-create-recordset-portal.md)
> * [PowerShell](dns-getstarted-create-recordset.md)
> * [Azure CLI](dns-getstarted-create-recordset-cli.md)

This article walks you through the process of creating records and records sets by using the Azure portal. To do this, you first need to understand DNS records and record sets.

[!INCLUDE [dns-about-records-include](../../includes/dns-about-records-include.md)]

The examples on this page all use the 'A' DNS record type. The process for other record types is similar.

If your new record has the same name and type as an existing record, you need to add it to the existing record set&mdash;see [Manage DNS records and record sets by using the Azure portal](dns-operations-recordsets-portal.md). If your new record has a different name and type to all existing records, you need to create a new record set, as explained below.

## Create records in a new record set

The following example walks you through the process of creating a record set and record by using the Azure portal.

1. Sign in to the portal.
2. Go to the **DNS zone** blade in which you want to create a record set.
3. At the top of the **DNS zone** blade, select **+ Record set** to open the **Add record set** blade.

    ![New record set](./media/dns-getstarted-create-recordset-portal/newrecordset500.png)

4. On the **Add record set** blade, name your record set. For example, you could name your record set "**www**".

    ![Add record set](./media/dns-getstarted-create-recordset-portal/addrecordset500.png)

5. Select the type of record you want to create. For example, select **A**.
6. Set the **TTL**. The default time to live in the portal is one hour.
7. Add the details of each record in the record set. In this case, since the record type is 'A', you need to add the A record IP addresses, one IP address per line.
8. After you finish adding IP addresses, select **OK** at the bottom of the blade. The DNS record set will be created.

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

To manage your record set and records, see [Manage DNS records and record sets by using the Azure portal](dns-operations-recordsets-portal.md).
