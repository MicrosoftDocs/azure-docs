## What is reverse DNS?

Conventional DNS records enable a mapping from a DNS name (such as 'www.contoso.com') to an IP address (such as 64.4.6.100).  Reverse DNS enables the translation of an IP address (64.4.6.100) back to a name ('www.contoso.com').

Reverse DNS records are used in a variety of situations. For example, reverse DNS records are widely used in combating e-mail spam by verifying the sender of an e-mail message.  The receiving mail server will retrieve the reverse DNS record of the sending server's IP address, and verify if that host is authorized to send e-mail from the originating domain. (Please note however that [Azure Compute services do not support sending emails to external domains](https://blogs.msdn.microsoft.com/mast/2016/04/04/sending-e-mail-from-azure-compute-resource-to-external-domains/).)

## How reverse DNS works

Reverse DNS records are hosted in special DNS zones, known as 'ARPA' zones.  These zones form a separate DNS hierarchy in parallel with the normal hierarchy hosting domains such as 'contoso.com'.

For example, the DNS record 'www.contoso.com' is implemented using a DNS 'A' record with the name 'www' in the zone 'contoso.com'.  This A record points to the corresponding IP address, in this case 64.4.6.100.  The reverse lookup is implemented separately, using a 'PTR' record named '100' in the zone '6.4.64.in-addr.arpa' (note that IP addresses are reversed in ARPA zones.)  This PTR record, if it has been configured correctly, points to the name 'www.contoso.com'.

When an organization is assigned an IP address block, they also acquire the right to manage the corresponding ARPA zone. The ARPA zones corresponding to the IP address blocks used by Azure are hosted and managed by Microsoft. Your ISP may host the ARPA zone for your own IP addresses for you, or may allow you host the ARPA zone in a DNS service of your choice, such as Azure DNS.

> [!NOTE]
> Forward DNS lookups and reverse DNS lookups are implemented in separate, parallel DNS hierarchies. The reverse lookup for 'www.contoso.com' is **not** hosted in the zone 'contoso.com', rather it is hosted in the ARPA zone for the corresponding IP address block.

For more information on reverse DNS, please see [Reverse DNS Lookup](http://en.wikipedia.org/wiki/Reverse_DNS_lookup).

## Azure support for reverse DNS

Azure supports two separate scenarios relating to reverse DNS:

1. Hosting the ARPA zone corresponding to your IP address block.
2. Allowing you to configure the reverse DNS record for the IP address assigned to your Azure service.

To support the former, Azure DNS can be used to host your ARPA zones and manage the PTR records for each reverse DNS lookup.  The process of creating the ARPA zone, setting up the delegation, and configuring PTR records is the same as for regular DNS zones.  The only differences are that the delegation must be configured via your ISP rather than your DNS registrar, and only the PTR record type should be used.

To support the latter, Azure enables you to configure the reverse lookup for the IP addresses allocated to your service.  This reverse lookup is configured by Azure as a PTR record in the corresponding ARPA zone.  These ARPA zones, corresponding to all the IP ranges used by Azure, are hosted by Microsoft. **The remainder of this article describes this scenario in detail.**
