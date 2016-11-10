
## FAQ - Hosting your ARPA zone in Azure DNS

### Can I host ARPA zones for my ISP-assigned IP blocks on Azure DNS?

Yes. Hosting the ARPA zones for your own IP ranges in Azure DNS is fully supported.

Simply [create the zone in Azure DNS](../articles/dns/dns-getstarted-create-dnszone.md), then work with your ISP to [delegate the zone](../articles/dns/dns-domain-delegation.md).  You can then manage the PTR records for each reverse lookup in the same way as other record types.

You can also [import an existing reverse lookup zone using the Azure CLI](../articles/dns/dns-import-export.md).

### How much does hosting my ARPA zone cost?

Hosting the ARPA zone for your ISP-assigned IP block in Azure DNS is charged at [standard Azure DNS rates](https://azure.microsoft.com/pricing/details/dns/).

### Can I host ARPA zones for both IPv4 and IPv6 addresses in Azure DNS?

Yes.
