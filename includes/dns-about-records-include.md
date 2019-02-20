---
author: vhorne
ms.service: dns
ms.topic: include
ms.date: 11/25/2018
ms.author: victorh
---
### Record names

In Azure DNS, records are specified by using relative names. A *fully qualified* domain name (FQDN) includes the zone name, whereas a *relative* name does not. For example, the relative record name 'www' in the zone 'contoso.com' gives the fully qualified record name 'www.contoso.com'.

An *apex* record is a DNS record at the root (or *apex*) of a DNS zone. For example, in the DNS zone 'contoso.com', an apex record also has the fully qualified name 'contoso.com' (this is sometimes called a *naked* domain).  By convention, the relative name '\@' is used to represent apex records.

### Record types

Each DNS record has a name and a type. Records are organized into various types according to the data they contain. The most common type is an 'A' record, which maps a name to an IPv4 address. Another common type is an 'MX' record, which maps a name to a mail server.

Azure DNS supports all common DNS record types: A, AAAA, CAA, CNAME, MX, NS, PTR, SOA, SRV, and TXT. Note that [SPF records are represented using TXT records](../articles/dns/dns-zones-records.md#spf-records).

### Record sets

Sometimes you need to create more than one DNS record with a given name and type. For example, suppose the 'www.contoso.com' web site is hosted on two different IP addresses. The website requires two different A records, one for each IP address. Here is an example of a record set:

    www.contoso.com.        3600    IN    A    134.170.185.46
    www.contoso.com.        3600    IN    A    134.170.188.221

Azure DNS manages all DNS records using *record sets*. A record set (also known as a *resource* record set) is the collection of DNS records in a zone that have the same name and are of the same type. Most record sets contain a single record. However, examples like the one above, in which a record set contains more than one record, are not uncommon.

For example, suppose you have already created an A record 'www' in the zone 'contoso.com', pointing to the IP address '134.170.185.46' (the first record above).  To create the second record you would add that record to the existing record set, rather than create an additional record set.

The SOA and CNAME record types are exceptions. The DNS standards don't permit multiple records with the same name for these types, therefore these record sets can only contain a single record.