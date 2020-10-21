---
title: Host reverse DNS lookup zones in Azure DNS
description: Learn how to use Azure DNS to host the reverse DNS lookup zones for your IP ranges
author: rohinkoul

ms.service: dns
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 05/29/2017
ms.author: rohink
---

# Host reverse DNS lookup zones in Azure DNS

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

This article explains how to host the reverse DNS lookup zones for your assigned IP ranges in Azure DNS. The IP ranges represented by the reverse lookup zones must be assigned to your organization, typically by your ISP.

To configure reverse DNS for an Azure-owned IP address that's assigned to your Azure service, see [Configure reverse DNS for services hosted in Azure](dns-reverse-dns-for-azure-services.md).

Before you read this article, you should be familiar with the [overview of reverse DNS and support in Azure](dns-reverse-dns-overview.md).

This article walks you through the steps to create your first reverse lookup DNS zone and record by using the Azure portal, Azure PowerShell, Azure classic CLI, or Azure CLI.

## Create a reverse lookup DNS zone

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the **Hub** menu, select **New** > **Networking**, and then select **DNS zone**.

   !["DNS zone" selection](./media/dns-reverse-dns-hosting/figure1.png)

1. In the **Create DNS zone** pane, name your DNS zone. The name of the zone is crafted differently for IPv4 and IPv6 prefixes. Use the instructions for [IPv4](#ipv4) or [IPv6](#ipv6) to name your zone. When you're finished, select **Create** to create the zone.

### IPv4

The name of an IPv4 reverse lookup zone is based on the IP range that it represents. It should be in the following format: `<IPv4 network prefix in reverse order>.in-addr.arpa`. For examples, see [Overview of reverse DNS and support in Azure](dns-reverse-dns-overview.md#ipv4).

> [!NOTE]
> When you're creating classless reverse DNS lookup zones in Azure DNS, you must use a hyphen (`-`) rather than a forward slash (`/`) in the zone name.
>
> For example, for the IP range 192.0.2.128/26, you must use `128-26.2.0.192.in-addr.arpa` as the zone name instead of `128/26.2.0.192.in-addr.arpa`.
>
> Although the DNS standards support both methods, Azure DNS doesn't support DNS zone names that contain for forward slash (`/`) character.

The following example shows how to create a Class C reverse DNS zone named `2.0.192.in-addr.arpa` in Azure DNS via the Azure portal:

 !["Create DNS zone" pane, with boxes filled in](./media/dns-reverse-dns-hosting/figure2.png)

**Resource group location** defines the location for the resource group. It has no impact on the DNS zone. The DNS zone location is always "global," and is not shown.

The following examples show how to complete this task by using Azure PowerShell and Azure CLI.

#### PowerShell

```powershell
New-AzDnsZone -Name 2.0.192.in-addr.arpa -ResourceGroupName MyResourceGroup
```

#### Azure classic CLI

```azurecli
azure network dns zone create MyResourceGroup 2.0.192.in-addr.arpa
```

#### Azure CLI

```azurecli
az network dns zone create -g MyResourceGroup -n 2.0.192.in-addr.arpa
```

### IPv6

The name of an IPv6 reverse lookup zone should be in the following form:
`<IPv6 network prefix in reverse order>.ip6.arpa`.  For examples, see [Overview of reverse DNS and support in Azure](dns-reverse-dns-overview.md#ipv6).


The following example shows how to create an IPv6 reverse DNS lookup zone named `0.0.0.0.d.c.b.a.8.b.d.0.1.0.0.2.ip6.arpa` in Azure DNS via the Azure portal:

 !["Create DNS zone" pane, with boxes filled in](./media/dns-reverse-dns-hosting/figure3.png)

**Resource group location** defines the location for the resource group. It has no impact on the DNS zone. The DNS zone location is always "global," and is not shown.

The following examples show how to complete this task by using Azure PowerShell and Azure CLI.

#### PowerShell

```powershell
New-AzDnsZone -Name 0.0.0.0.d.c.b.a.8.b.d.0.1.0.0.2.ip6.arpa -ResourceGroupName MyResourceGroup
```

#### Azure classic CLI

```azurecli
azure network dns zone create MyResourceGroup 0.0.0.0.d.c.b.a.8.b.d.0.1.0.0.2.ip6.arpa
```

#### Azure CLI

```azurecli
az network dns zone create -g MyResourceGroup -n 0.0.0.0.d.c.b.a.8.b.d.0.1.0.0.2.ip6.arpa
```

## Delegate a reverse DNS lookup zone

Now that you've created your reverse DNS lookup zone, you must ensure that the zone is delegated from the parent zone. DNS delegation enables the DNS name resolution process to find the name servers that host your reverse DNS lookup zone. Those name servers can then answer DNS reverse queries for the IP addresses in your address range.

For forward lookup zones, the process of delegating a DNS zone is described in [Delegate your domain to Azure DNS](dns-delegate-domain-azure-dns.md). Delegation for reverse lookup zones works the same way. The only difference is that you need to configure the name servers with the ISP that provided your IP range, rather than your domain name registrar.

## Create a DNS PTR record

### IPv4

The following example walks you through the process of creating a PTR record in a reverse DNS zone in Azure DNS. For other record types and to modify existing records, see [Manage DNS records and record sets by using the Azure portal](dns-operations-recordsets-portal.md).

1. At the top of the **DNS zone** pane, select **+ Record set** to open the **Add record set** pane.

   ![Button for creating a record set](./media/dns-reverse-dns-hosting/figure4.png)

1. The name of the record set for a PTR record needs to be the rest of the IPv4 address in reverse order. 

   In this example, the first three octets are already populated as part of the zone name (.2.0.192). Therefore, only the last octet is supplied in the **Name** box. For example, you might name your record set **15** for a resource whose IP address is 192.0.2.15.  
1. For **Type**, select **PTR**.  
1. For **DOMAIN NAME**, enter the fully qualified domain name (FQDN) of the resource that uses the IP.
1. Select **OK** at the bottom of the pane to create the DNS record.

   !["Add record set" pane, with boxes filled in](./media/dns-reverse-dns-hosting/figure5.png)

The following examples show how to complete this task by using PowerShell or Azure CLI.

#### PowerShell

```powershell
New-AzDnsRecordSet -Name 15 -RecordType PTR -ZoneName 2.0.192.in-addr.arpa -ResourceGroupName MyResourceGroup -Ttl 3600 -DnsRecords (New-AzDnsRecordConfig -Ptrdname "dc1.contoso.com")
```
#### Azure classic CLI

```azurecli
azure network dns record-set add-record MyResourceGroup 2.0.192.in-addr.arpa 15 PTR --ptrdname dc1.contoso.com  
```

#### Azure CLI

```azurecli
az network dns record-set ptr add-record -g MyResourceGroup -z 2.0.192.in-addr.arpa -n 15 --ptrdname dc1.contoso.com
```

### IPv6

The following example walks you through the process of creating new PTR record. For other record types and to modify existing records, see [Manage DNS records and record sets by using the Azure portal](dns-operations-recordsets-portal.md).

1. At the top of the **DNS zone** pane, select **+ Record set** to open the **Add record set** pane.

   ![Button for creating a record set](./media/dns-reverse-dns-hosting/figure6.png)

2. The name of the record set for a PTR record needs to be the rest of the IPv6 address in reverse order. It must not include any zero compression. 

   In this example, the first 64 bits of the IPv6 are already populated as part of the zone name (0.0.0.0.c.d.b.a.8.b.d.0.1.0.0.2.ip6.arpa). Therefore, only the last 64 bits are supplied in the **Name** box. The last 64 bits of the IP address are entered in reverse order, with a period as the delimiter between each hexadecimal number. For example, you might name your record set **e.5.0.4.9.f.a.1.c.b.0.1.4.2.5.f** for a resource whose IP address is 2001:0db8:abdc:0000:f524:10bc:1af9:405e.  
3. For **Type**, select **PTR**.  
4. For **DOMAIN NAME**, enter the FQDN of the resource that uses the IP.
5. Select **OK** at the bottom of the pane to create the DNS record.

!["Add record set" pane, with boxes filled in](./media/dns-reverse-dns-hosting/figure7.png)

The following examples show how to complete this task by using PowerShell or Azure CLI.

#### PowerShell

```powershell
New-AzDnsRecordSet -Name "e.5.0.4.9.f.a.1.c.b.0.1.4.2.5.f" -RecordType PTR -ZoneName 0.0.0.0.c.d.b.a.8.b.d.0.1.0.0.2.ip6.arpa -ResourceGroupName MyResourceGroup -Ttl 3600 -DnsRecords (New-AzDnsRecordConfig -Ptrdname "dc2.contoso.com")
```

#### Azure classic CLI

```azurecli
azure network dns record-set add-record MyResourceGroup 0.0.0.0.c.d.b.a.8.b.d.0.1.0.0.2.ip6.arpa e.5.0.4.9.f.a.1.c.b.0.1.4.2.5.f PTR --ptrdname dc2.contoso.com 
```
 
#### Azure CLI

```azurecli
az network dns record-set ptr add-record -g MyResourceGroup -z 0.0.0.0.c.d.b.a.8.b.d.0.1.0.0.2.ip6.arpa -n e.5.0.4.9.f.a.1.c.b.0.1.4.2.5.f --ptrdname dc2.contoso.com
```

## View records

To view the records that you created, browse to your DNS zone in the Azure portal. In the lower part of the **DNS zone** pane, you can see the records for the DNS zone. You should see the default NS and SOA records, plus any new records that you've created. The NS and SOA records are created in every zone. 

### IPv4

The **DNS zone** pane shows the IPv4 PTR records:

!["DNS zone" pane with IPv4 records](./media/dns-reverse-dns-hosting/figure8.png)

The following examples show how to view the PTR records by using PowerShell or Azure CLI.

#### PowerShell

```powershell
Get-AzDnsRecordSet -ZoneName 2.0.192.in-addr.arpa -ResourceGroupName MyResourceGroup
```

#### Azure classic CLI

```azurecli
azure network dns record-set list MyResourceGroup 2.0.192.in-addr.arpa
```

#### Azure CLI

```azurecli
az network dns record-set list -g MyResourceGroup -z 2.0.192.in-addr.arpa
```

### IPv6

The **DNS zone** pane shows the IPv6 PTR records:

!["DNS zone" pane with IPv6 records](./media/dns-reverse-dns-hosting/figure9.png)

The following examples show how to view the records by using PowerShell or Azure CLI.

#### PowerShell

```powershell
Get-AzDnsRecordSet -ZoneName 0.0.0.0.c.d.b.a.8.b.d.0.1.0.0.2.ip6.arpa -ResourceGroupName MyResourceGroup
```

#### Azure classic CLI

```azurecli
azure network dns record-set list MyResourceGroup 0.0.0.0.c.d.b.a.8.b.d.0.1.0.0.2.ip6.arpa
```

#### Azure CLI

```azurecli
az network dns record-set list -g MyResourceGroup -z 0.0.0.0.c.d.b.a.8.b.d.0.1.0.0.2.ip6.arpa
```

## FAQ

### Can I host reverse DNS lookup zones for my ISP-assigned IP blocks on Azure DNS?

Yes. Hosting the reverse lookup (ARPA) zones for your own IP ranges in Azure DNS is fully supported.

Create the reverse lookup zone in Azure DNS as explained in this article, and then work with your ISP to [delegate the zone](dns-domain-delegation.md). You can then manage the PTR records for each reverse lookup in the same way as other record types.

### How much does hosting my reverse DNS lookup zone cost?

Hosting the reverse DNS lookup zone for your ISP-assigned IP block in Azure DNS is charged at [standard Azure DNS rates](https://azure.microsoft.com/pricing/details/dns/).

### Can I host reverse DNS lookup zones for both IPv4 and IPv6 addresses in Azure DNS?

Yes. This article explains how to create both IPv4 and IPv6 reverse DNS lookup zones in Azure DNS.

### Can I import an existing reverse DNS lookup zone?

Yes. You can use Azure CLI to import existing DNS zones into Azure DNS. This method works for both forward lookup zones and reverse lookup zones.

For more information, see [Import and export a DNS zone file using Azure CLI](dns-import-export.md).

## Next steps

For more information on reverse DNS, see [reverse DNS lookup on Wikipedia](https://en.wikipedia.org/wiki/Reverse_DNS_lookup).
<br>
Learn how to [manage reverse DNS records for your Azure services](dns-reverse-dns-for-azure-services.md).
