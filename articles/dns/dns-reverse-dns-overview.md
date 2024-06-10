---
title: Overview of reverse DNS in Azure - Azure DNS
description: In this learning path, get started learning how reverse DNS works and how it can be used in Azure
author: greg-lindsay
manager: KumuD
ms.service: dns
ms.topic: article
ms.custom:
ms.date: 04/27/2023
ms.author: greglin
---

# Overview of reverse DNS and support in Azure

This article provides an overview of how reverse DNS works, and scenarios in which reverse DNS is supported in Azure.

## What is reverse DNS?

Conventional DNS records map a DNS name to an IP address, such as `www.contoso.com` resolves to 64.4.6.100. A reverse DNS does the opposite by translating an IP address back to a name. For example, a lookup of 64.4.6.100 will resolve to `www.contoso.com`.

Reverse DNS records are used in various situations. For example, reverse DNS records are widely used in combating e-mail spam by verifying the sender of an e-mail message.  The receiving mail server retrieves the reverse DNS record of the sending server's IP address. Then the receiving mail server verifies if that host is authorized to send e-mail from the originating domain.

## How reverse DNS works

Reverse DNS records are hosted in special DNS zones, known as 'ARPA' zones.  These zones form a separate DNS hierarchy in parallel with the normal hierarchy hosting domains such as `contoso.com`.

For example, the DNS record `www.contoso.com` is implemented using a DNS 'A' record with the name 'www' in the zone `contoso.com`. This A record points to the corresponding IP address, in this case 64.4.6.100.  The reverse lookup gets implemented separately, using a 'PTR' record named '100' in the zone '6.4.64.in-addr.arpa'. Notice that IP addresses in ARPA zones are reversed. This PTR record, when configured correctly will point to the name `www.contoso.com`.

When an organization is assigned an IP address block, they also acquire the right to manage the corresponding ARPA zone. The ARPA zones corresponding to the IP address blocks used by Azure are hosted and managed by Microsoft. Your ISP may host the ARPA zone for you for the IP addresses you owned. They may also allow you to host the ARPA zone in a DNS service of your choice, such as Azure DNS.

> [!NOTE]
> Forward DNS lookups and reverse DNS lookups are implemented in separate, parallel DNS hierarchies. The reverse lookup for 'www.contoso.com' is **not** hosted in the zone 'contoso.com', rather it's hosted in the ARPA zone for the corresponding IP address block. Separate zones are used for IPv4 and IPv6 address blocks.

### IPv4

The name of an IPv4 reverse lookup zone should be in the following format:
`<IPv4 network prefix in reverse order>.in-addr.arpa`.

For example, when creating a reverse zone to host records for hosts with IPs that are in the 192.0.2.0/24 prefix, the zone name would be created by isolating the network prefix of the address (192.0.2) and then reversing the order (2.0.192) and adding the suffix `.in-addr.arpa`.

|Subnet class|Network prefix  |Reversed network prefix  |Standard suffix  |Reverse zone name |
|-------|----------------|------------|-----------------|---------------------------|
|Class A|203.0.0.0/8     | 203        | .in-addr.arpa   | `203.in-addr.arpa`        |
|Class B|198.51.0.0/16   | 51.198     | .in-addr.arpa   | `51.198.in-addr.arpa`     |
|Class C|192.0.2.0/24    | 2.0.192    | .in-addr.arpa   | `2.0.192.in-addr.arpa`    |

### Classless IPv4 delegation

In some cases, the IP range given to an organization is smaller than a Class C (/24) range. In this case, the IP range doesn't fall on a zone boundary within the `.in-addr.arpa` zone hierarchy, and as such can't be delegated as a child zone.

A different method is used to transfer each reverse lookup record to a dedicated DNS zone. This method delegates a child zone for each IP range. Then maps each IP address in the range individually to that child zone using CNAME records.

For example, suppose your organization is granted the IP range 192.0.2.128/26 by your ISP. This address block represents 64 IP addresses, from 192.0.2.128 to 192.0.2.191. Reverse DNS for this range is implemented as followed:
- Your organization creates a reverse lookup zone called 128-26.2.0.192.in-addr.arpa. The prefix '128-26' represents the network segment assigned to your organization within the Class C (/24) range.
- Your ISP creates NS records to set up the DNS delegation for the above zone from the Class C parent zone. The ISP also creates CNAME records in the parent (Class C) reverse lookup zone. Then they map each IP address in the IP range to the new zone created by your organization:

    ```
    $ORIGIN 2.0.192.in-addr.arpa
    ; Delegate child zone
    128-26    NS       <name server 1 for 128-26.2.0.192.in-addr.arpa>
    128-26    NS       <name server 2 for 128-26.2.0.192.in-addr.arpa>
    ; CNAME records for each IP address
    129       CNAME    129.128-26.2.0.192.in-addr.arpa
    130       CNAME    130.128-26.2.0.192.in-addr.arpa
    131       CNAME    131.128-26.2.0.192.in-addr.arpa
    ; etc
    ```

- Your organization then manages the individual PTR records within their child zone.

    ```
    $ORIGIN 128-26.2.0.192.in-addr.arpa
    ; PTR records for each UIP address. Names match CNAME targets in parent zone
    129      PTR    www.contoso.com
    130      PTR    mail.contoso.com
    131      PTR    partners.contoso.com
    ; etc
    ```

A reverse lookup for the IP address '192.0.2.129' queries for a PTR record named '129.2.0.192.in-addr.arpa'. This query resolves with the CNAME in the parent zone to the PTR record in the child zone.

### IPv6

The name of an IPv6 reverse lookup zone should be in the following form: `<IPv6 network prefix in reverse order>.ip6.arpa`

For example, when you create a reverse zone to host records for hosts with IPs that are in the 2001:db8:1000:abdc::/64 prefix. The zone name would be created by isolating the network prefix of the address (2001:db8:abdc::). Next expand the IPv6 network prefix to remove [zero compression](/previous-versions/windows/it-pro/windows-server-2003/cc781672(v=ws.10)), if it was used to shorten the IPv6 address prefix (2001:0db8:abdc:0000::). Reverse the order, using a period as the delimiter between each hexadecimal number in the prefix, to build the reversed network prefix (`0.0.0.0.c.d.b.a.8.b.d.0.1.0.0.2`) and add the suffix `.ip6.arpa`.


|Network prefix  |Expanded and reversed network prefix |Standard suffix |Reverse zone name  |
|---------|---------|---------|---------|
|2001:db8:abdc::/64    | 0.0.0.0.c.d.b.a.8.b.d.0.1.0.0.2        | .ip6.arpa        | `0.0.0.0.c.d.b.a.8.b.d.0.1.0.0.2.ip6.arpa`       |
|2001:db8:1000:9102::/64    | 2.0.1.9.0.0.0.1.8.b.d.0.1.0.0.2        | .ip6.arpa        | `2.0.1.9.0.0.0.1.8.b.d.0.1.0.0.2.ip6.arpa`        |


## Azure support for reverse DNS

Azure supports two separate scenarios relating to reverse DNS:

**Hosting the reverse lookup zone corresponding to your IP address block** -
Azure DNS can be used to [host your reverse lookup zones and manage the PTR records](dns-reverse-dns-hosting.md) for both IPv4 and IPv6. The process of creating the reverse lookup (ARPA) zone, setting up the delegation, and configuring PTR records is the same as for regular DNS zones. The differences are the delegation must be configured with your ISP rather than your DNS registrar, and only the PTR record type should be used.

**Configure the reverse DNS record for the IP address assigned to your Azure service** - Azure enables you to [configure the reverse lookup for the IP addresses given to your Azure service](dns-reverse-dns-for-azure-services.md).  This reverse lookup gets configured by Azure as a PTR record in the corresponding ARPA zone.  These ARPA zones, corresponding to all the IP ranges used by Azure, are hosted by Microsoft

## Next steps

- For more information about reverse DNS, see [reverse DNS lookup on Wikipedia](https://en.wikipedia.org/wiki/Reverse_DNS_lookup).
- Learn how to [host the reverse lookup zone for your ISP-assigned IP range in Azure DNS](dns-reverse-dns-for-azure-services.md).
- Learn how to [manage reverse DNS records for your Azure services](dns-reverse-dns-for-azure-services.md).
