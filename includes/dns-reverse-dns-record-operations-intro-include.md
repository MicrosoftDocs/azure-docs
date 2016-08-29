## What are reverse DNS records?

Reverse DNS records are used in a variety of situations. Server validation and authenticating server requests among them. For example, reverse DNS records are widely used in combating e-mail spam by verifying the sender of an e-mail message by verifying its reverse DNS record, and also, if that host was recognized as authorized to send e-mail from the originating domain.<BR>
Reverse DNS records, or PTR records, are DNS record types that enable the translation of a publically routable IP address back to a name. In DNS, names such as app1.contoso.com, are resolved to IP addresses in a process that is called forward resolution. With reverse DNS, this process is reversed to enable the resolution of the name given its IP address.<BR>
For more information on Reverse DNS records, please see [here](http://en.wikipedia.org/wiki/Reverse_DNS_lookup).<BR>

## How does Azure support reverse DNS records for your Azure services?

Microsoft works with a number of registries to secure an adequate supply of publically routable IP blocks. Each of these blocks is then delegated to Microsoft-owned and operated authoritative DNS servers. Microsoft hosts the reverse DNS zones for all publically routable IP blocks assigned to it. <BR>
Azure enables you to specify a custom fully-qualified domain name (FQDN) for public routable IPs assigned to your deployments. These custom FQDNs will then be returned for reverse DNS lookups for those IPs.<BR> 
Azure provides reverse DNS support for all publically routable IPs at no additional cost, and for services deployed using the classic and ARM deployment models.
