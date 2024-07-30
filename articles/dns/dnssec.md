---
title: What is DNSSEC?
description: Learn about DNSSEC zone signing for Azure public DNS.
author: greg-lindsay
manager: KumuD
ms.service: dns
ms.topic: article
ms.custom:
ms.date: 07/30/2024
ms.author: greglin
---

# What is DNSSEC?

Domain Name System Security Extensions (DNSSEC) is a suite of extensions that add security to the Domain Name System (DNS) protocol by enabling DNS responses to be validated. DNSSEC provides origin authority, data integrity, and authenticated denial of existence. With DNSSEC, the DNS protocol is much less susceptible to certain types of attacks, particularly DNS spoofing attacks.

## How DNSSEC works

DNS zones can be secured with DNSSEC using a process called zone signing. Signing a zone with DNSSEC adds validation support to a zone without changing the basic mechanism of a DNS query and response. To sign a zone with DNSSEC, the zone's primary authoritative DNS server must support DNSSEC.

Validation of DNS responses occurs by using digital signatures included with DNS responses. These digital signatures are contained in DNSSEC-related resource records that are generated and added to the zone during zone signing.

## Why sign a zone with DNSSEC?

DNSSEC validation of DNS responses can prevent common types of DNS hijacking attacks. DNS hijacking, also known as 

![A diagram showing how DNS hijacking works.](media/dnssec/dns-hijacking.png)


## Next steps

- For more information about reverse DNS, see [reverse DNS lookup on Wikipedia](https://en.wikipedia.org/wiki/Reverse_DNS_lookup).
- Learn how to [host the reverse lookup zone for your ISP-assigned IP range in Azure DNS](dns-reverse-dns-for-azure-services.md).
- Learn how to [manage reverse DNS records for your Azure services](dns-reverse-dns-for-azure-services.md).
