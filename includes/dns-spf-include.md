---
author: vhorne
ms.service: dns
ms.topic: include
ms.date: 11/25/2018
ms.author: victorh
---
Sender policy framework (SPF) records are used to specify which email servers can send email on behalf of a domain name. Correct configuration of SPF records is important to prevent recipients from marking your email as junk.

The DNS RFCs originally introduced a new SPF record type to support this scenario. To support older name servers, they also allowed the use of the TXT record type to specify SPF records. This ambiguity led to confusion, which was resolved by [RFC 7208](https://datatracker.ietf.org/doc/html/rfc7208#section-3.1). It states that SPF records must be created by using the TXT record type. It also states that the SPF record type is deprecated.

**SPF records are supported by Azure DNS and must be created by using the TXT record type.** The obsolete SPF record type isn't supported. When you [import a DNS zone file](../articles/dns/dns-import-export.md), any SPF records that use the SPF record type are converted to the TXT record type.
