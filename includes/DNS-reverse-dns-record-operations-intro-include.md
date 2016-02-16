## What are reverse DNS records?
Reverse DNS records are used in a variety of situations to weakly authenticate the caller. For example, reverse DNS records are widely used in combating email spam through by verifying that the sender of an email message did so from a host for which there was a reverse DNS record, and optionally, where that host was recognized as one that was authorized to send email from the originating domain.<BR>
Reverse DNS records, or PTR records, are DNS record types that enable the translation of a publically routable IP back to a name. In DNS, names, such as app1.contoso.com, are resolved to IPs in a process that is called forward resolution. With reverse DNS, this process is reversed to enable the resolution of the name given the publically routable IP.
Reverse DNS records are created in so-called ‘ARPA’ zones that represent contiguous blocks of IPs. Similarly to forward DNS zones (i.e. contoso.com) ARPA zones (i.e. 101.23.in-addr.arpa.) exist in a hierarchy which enables the delegation of authority of IP blocks to the organization to which those IPs are assigned.<BR> Reverse DNS records are not created within standard forward-DNS zones (i.e. contoso.com).
For more information on Reverse DNS records, please see here.


## How does Azure support reverse DNS records for your Azure services?
Microsoft hosts the reverse DNS zones for all publically routable IP blocks assigned to it. Azure enables Azure customers to specify a custom fully-qualified domain name (FQDN) for public routable IPs assigned to that customer. These custom FQDNs will then be returned for reverse DNS lookups for that IP. 
Azure provides reverse DNS support for all assigned publically routable IPs at no additional cost, and for services deployed using the ASM and newer ARM deployment models.

## Validation of reverse DNS records
To ensure a third party can’t create reverse DNS records mapping to your DNS domains, Azure only allows the creation of a reverse DNS record where one of the following is true:

- The “ReverseFqdn” is the same as the “Fqdn” for the Public IP Address resource for which it has been specified, or the “Fqdn” for any Public IP Address within the same subscription e.g., “ReverseFqdn” is “contosoapp1.northus.cloudapp.azure.com.”.

- The “ReverseFqdn” forward resolves to the name or IP of the Public IP Address for which it has been specified, or to any Public IP Address “Fqdn” or IP within the same subscription e.g., “ReverseFqdn” is “app1.contoso.com.” which is a CName alias for “contosoapp1.northus.cloudapp.azure.com.”
Validation checks are only performed when the reverse DNS property for a Public IP Address is set or modified. Periodic re-validation is not performed.
