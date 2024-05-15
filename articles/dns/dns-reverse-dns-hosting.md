---
title: Host reverse DNS lookup zones in Azure DNS
description: Learn how to use Azure DNS to host the reverse DNS lookup zones for your IP ranges
author: greg-lindsay
ms.service: dns
ms.topic: how-to
ms.date: 04/27/2023
ms.author: greglin
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.devlang: azurecli
---

# Host reverse DNS lookup zones in Azure DNS

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

This article explains how to host reverse DNS lookup zones for your assigned IP ranges with Azure DNS. The IP ranges represented by the reverse lookup zones must be assigned to your organization, typically by your ISP.

To configure reverse DNS for an Azure-owned IP address assigned to your Azure service, see [Configure reverse DNS for services hosted in Azure](dns-reverse-dns-for-azure-services.md).

Before reading this article, you should familiarize yourself with the [overview of reverse DNS](dns-reverse-dns-overview.md) and it's supported in Azure.

In this article, you learn how to create your first reverse lookup DNS zone and record by using the Azure portal, Azure PowerShell, Azure classic CLI, and Azure CLI.

## Create a reverse lookup DNS zone

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the top left-hand side of the screen, select **Create a resource** and search for **DNS zone**. Then select **Create**.

      :::image type="content" source="./media/dns-operations-dnszones-portal/search-dns-zone.png" alt-text="Screenshot of create a resource search for reverse DNS zone.":::

1. On the **Create DNS zone** page, select, or enter the following settings:

    | Setting | Details |
    | --- | --- |
    | **Subscription** | Select a subscription to create the DNS zone in.|
    | **Resource group** | Select or create a new resource group. To learn more about resource groups, read the [Resource Manager](../azure-resource-manager/management/overview.md?toc=%2fazure%2fdns%2ftoc.json#resource-groups) overview article.|
    | **Name** | Enter a name for the DNS zone. The name of the zone is crafted differently for IPv4 and IPv6 prefixes. Use the instructions for [IPv4](#ipv4) or [IPv6](#ipv6) to name your zone.  |
    | **Location** | Select the location for the resource group. The location is already be selected if you're using a previously created resource group. |

1. Select **Review + create**, and then select **Create** once validation has passed.

### IPv4

The name of an IPv4 reverse lookup zone is based on the IP range that it represents. It should be in the following format: `<IPv4 network prefix in reverse order>.in-addr.arpa`. For examples, see [Overview of reverse DNS](dns-reverse-dns-overview.md#ipv4) for IPv4.

> [!NOTE]
> When you're creating classless reverse DNS lookup zones in Azure DNS, you must use a hyphen (`-`) instead of a forward slash (`/`) in the zone name.
>
> For example, for the IP range of 192.0.2.128/26, use `128-26.2.0.192.in-addr.arpa` as the zone name instead of `128/26.2.0.192.in-addr.arpa`.
>
> Although the DNS standards support both methods, Azure DNS doesn't support DNS zone names that contain the forward slash (`/`) character.

The following example shows how to create a Class C reverse DNS zone named `2.0.192.in-addr.arpa` in Azure DNS via the Azure portal:

:::image type="content" source="./media/dns-reverse-dns-hosting/ipv4-arpa-zone.png" alt-text="Screenshot of create IPv4 arpa DNS zone.":::

The following examples show how to complete this task using Azure PowerShell and Azure CLI.

#### PowerShell

```azurepowershell-interactive
New-AzDnsZone -Name 2.0.192.in-addr.arpa -ResourceGroupName mydnsresourcegroup
```

#### Azure classic CLI

```azurecli
azure network dns zone create mydnsresourcegroup 2.0.192.in-addr.arpa
```

#### Azure CLI

```azurecli-interactive
az network dns zone create -g mydnsresourcegroup -n 2.0.192.in-addr.arpa
```

### IPv6

The name of an IPv6 reverse lookup zone should be in the following form:
`<IPv6 network prefix in reverse order>.ip6.arpa`.  For examples, see [Overview of reverse DNS](dns-reverse-dns-overview.md#ipv6) for IPv6.


The following example shows how to create an IPv6 reverse DNS lookup zone named `0.0.0.0.d.c.b.a.8.b.d.0.1.0.0.2.ip6.arpa` in Azure DNS via the Azure portal:

:::image type="content" source="./media/dns-reverse-dns-hosting/ipv6-arpa-zone.png" alt-text="Screenshot of create IPv6 arpa DNS zone.":::

The following examples show how to complete this task using Azure PowerShell and Azure CLI.

#### PowerShell

```powershell
New-AzDnsZone -Name 0.0.0.0.d.c.b.a.8.b.d.0.1.0.0.2.ip6.arpa -ResourceGroupName mydnsresourcegroup
```

#### Azure classic CLI

```azurecli
azure network dns zone create mydnsresourcegroup 0.0.0.0.d.c.b.a.8.b.d.0.1.0.0.2.ip6.arpa
```

#### Azure CLI

```azurecli
az network dns zone create -g mydnsresourcegroup -n 0.0.0.0.d.c.b.a.8.b.d.0.1.0.0.2.ip6.arpa
```

## Delegate a reverse DNS lookup zone

Once the reverse DNS lookup zone gets created, you then need to make sure the zone gets delegated from the parent zone. DNS delegation enables the DNS name resolution process to find the name servers that host your reverse DNS lookup zone. Those name servers can then answer DNS reverse queries for the IP addresses in your address range.

For forward lookup zones, the process of delegating a DNS zone is described in [Delegate your domain to Azure DNS](dns-delegate-domain-azure-dns.md). Delegation for reverse lookup zones works the same way. The only difference is that you need to configure the name servers with the ISP. The ISP manages your IP range, that's why they need to update the name servers instead of domain name registrar.

## Create a DNS PTR record

### IPv4

The following example explains the process of creating a PTR record for a reverse DNS zone in Azure DNS. To learn more about record types or how to modify existing records, see [Manage DNS records and record sets](dns-operations-recordsets-portal.md).

1. At the top of the *DNS zone* overview page, select **+ Record set** to open the *Add record set* pane.

    :::image type="content" source="./media/dns-reverse-dns-hosting/create-record-set-ipv4.png" alt-text="Screenshot of create IPv4 pointer record set.":::

1. The name of the record set for a PTR record is the rest of the IPv4 address in reverse order.

    In this example, the first three octets are already populated as part of the zone name `.2.0.192`. That's why only the last octet is needed in the **Name** box. For example, give your record set the name of **15** for a resource whose IP address is `192.0.2.15`.

    :::image type="content" source="./media/dns-reverse-dns-hosting/create-ipv4-ptr.png" alt-text="Screenshot of create IPv4 pointer record.":::

1. For *Type*, select **PTR**.

1. For *DOMAIN NAME*, enter the fully qualified domain name (FQDN) of the resource that uses the IP.

1. Select **OK** to create the DNS record.

The following examples show how to complete this task by using Azure PowerShell and Azure CLI.

#### PowerShell

```azurepowershell-interactive
New-AzDnsRecordSet -Name 15 -RecordType PTR -ZoneName 2.0.192.in-addr.arpa -ResourceGroupName mydnsresourcegroup -Ttl 3600 -DnsRecords (New-AzDnsRecordConfig -Ptrdname "dc1.contoso.com")
```
#### Azure classic CLI

```azurecli
azure network dns record-set add-record mydnsresourcegroup 2.0.192.in-addr.arpa 15 PTR --ptrdname dc1.contoso.com
```

#### Azure CLI

```azurecli-interactive
az network dns record-set ptr add-record -g mydnsresourcegroup -z 2.0.192.in-addr.arpa -n 15 --ptrdname dc1.contoso.com
```

### IPv6

The following example explains the process of creating new PTR record for IPv6. To learn more about record types or how to modify existing records, see [Manage DNS records and record sets](dns-operations-recordsets-portal.md).

1. At the top of the *DNS zone* pane, select **+ Record set** to open the *Add record set* pane.

   :::image type="content" source="./media/dns-reverse-dns-hosting/create-record-set-ipv6.png" alt-text="Screenshot of create IPv6 pointer record set.":::

1. The name of the record set for a PTR record is the rest of the IPv6 address in reverse order. It must not include any zero compression.

    In this example, the first 64 bits of the IPv6 gets populated as part of the zone name (0.0.0.0.c.d.b.a.8.b.d.0.1.0.0.2.ip6.arpa). That's why only the last 64 bits are supplied in the **Name** box. The last 64 bits of the IP address gets entered in reverse order, with a period as the delimiter between each hexadecimal number. Name your record set **e.5.0.4.9.f.a.1.c.b.0.1.4.2.5.f** if you have a resource whose IP address is 2001:0db8:abdc:0000:f524:10bc:1af9:405e.

    :::image type="content" source="./media/dns-reverse-dns-hosting/create-ipv6-ptr.png" alt-text="Screenshot of create IPv6 pointer record.":::

1. For *Type*, select **PTR**.

1. For *DOMAIN NAME*, enter the FQDN of the resource that uses the IP.

1. Select **OK** to create the DNS record.

The following examples show how to complete this task by using PowerShell or Azure CLI.

#### PowerShell

```azurepowershell-interactive
New-AzDnsRecordSet -Name "e.5.0.4.9.f.a.1.c.b.0.1.4.2.5.f" -RecordType PTR -ZoneName 0.0.0.0.c.d.b.a.8.b.d.0.1.0.0.2.ip6.arpa -ResourceGroupName mydnsresourcegroup -Ttl 3600 -DnsRecords (New-AzDnsRecordConfig -Ptrdname "dc2.contoso.com")
```

#### Azure classic CLI

```azurecli
azure network dns record-set add-record mydnsresourcegroup 0.0.0.0.c.d.b.a.8.b.d.0.1.0.0.2.ip6.arpa e.5.0.4.9.f.a.1.c.b.0.1.4.2.5.f PTR --ptrdname dc2.contoso.com
```

#### Azure CLI

```azurecli-interactive
az network dns record-set ptr add-record -g mydnsresourcegroup -z 0.0.0.0.c.d.b.a.8.b.d.0.1.0.0.2.ip6.arpa -n e.5.0.4.9.f.a.1.c.b.0.1.4.2.5.f --ptrdname dc2.contoso.com
```

## View records

To view the records that you created, browse to your DNS zone in the Azure portal. In the lower part of the **DNS zone** pane, you can see the records for the DNS zone. You should see the default NS and SOA records, plus any new records that you've created. The NS and SOA records are created in every zone.

### IPv4

The **DNS zone** page shows the IPv4 PTR record:

:::image type="content" source="./media/dns-reverse-dns-hosting/view-ipv4-ptr-record.png" alt-text="Screenshot of IPv4 pointer record on overview page." lightbox="./media/dns-reverse-dns-hosting/view-ipv4-ptr-record-expanded.png":::

The following examples show how to view the PTR records by using Azure PowerShell and Azure CLI.

#### PowerShell

```azurepowershell-interactive
Get-AzDnsRecordSet -ZoneName 2.0.192.in-addr.arpa -ResourceGroupName mydnsresourcegroup
```

#### Azure classic CLI

```azurecli
azure network dns record-set list mydnsresourcegroup 2.0.192.in-addr.arpa
```

#### Azure CLI

```azurecli-interactive
az network dns record-set list -g mydnsresourcegroup -z 2.0.192.in-addr.arpa
```

### IPv6

The **DNS zone** page shows the IPv6 PTR record:

:::image type="content" source="./media/dns-reverse-dns-hosting/view-ipv6-ptr-record.png" alt-text="Screenshot of IPv6 pointer record on overview page." lightbox="./media/dns-reverse-dns-hosting/view-ipv6-ptr-record-expanded.png":::

The following examples show how to view the records by using PowerShell or Azure CLI.

#### PowerShell

```powershell
Get-AzDnsRecordSet -ZoneName 0.0.0.0.c.d.b.a.8.b.d.0.1.0.0.2.ip6.arpa -ResourceGroupName mydnsresourcegroup
```

#### Azure classic CLI

```azurecli
azure network dns record-set list mydnsresourcegroup 0.0.0.0.c.d.b.a.8.b.d.0.1.0.0.2.ip6.arpa
```

#### Azure CLI

```azurecli
az network dns record-set list -g mydnsresourcegroup -z 0.0.0.0.c.d.b.a.8.b.d.0.1.0.0.2.ip6.arpa
```

## FAQ

### Can I host reverse DNS lookup zones for my ISP-assigned IP blocks on Azure DNS?

Yes. Hosting the reverse lookup (ARPA) zones for your own IP ranges in Azure DNS is fully supported.

Create the reverse lookup zone in Azure DNS as explained in this article. Then work with your ISP to [delegate the zone](dns-domain-delegation.md). You can then manage the PTR records for each reverse lookup in the same way as other record types.

### How much does hosting my reverse DNS lookup zone cost?

Hosting the reverse DNS lookup zone for your ISP-assigned IP block in Azure DNS is charged at [standard Azure DNS rates](https://azure.microsoft.com/pricing/details/dns/).

### Can I host reverse DNS lookup zones for both IPv4 and IPv6 addresses in Azure DNS?

Yes. This article explains how to create both IPv4 and IPv6 reverse DNS lookup zones in Azure DNS.

### Can I import an existing reverse DNS lookup zone?

Yes. You can use Azure CLI to import existing DNS zones into Azure DNS. This method works for both forward lookup zones and reverse lookup zones.

For more information, see [import and export a DNS zone file](dns-import-export.md) using Azure CLI.

## Next steps

* For more information on reverse DNS, see [reverse DNS lookup on Wikipedia](https://en.wikipedia.org/wiki/Reverse_DNS_lookup).

* Learn how to [manage reverse DNS records for your Azure services](dns-reverse-dns-for-azure-services.md).
