<BR> 
## FAQ 
### How much do reverse DNS records cost?
They’re free!  There is no additional cost for reverse DNS records or queries.
### Will my reverse DNS records resolve from the internet?
Yes. Once you set the reverse DNS property for your Public IP Address, Azure manages all the DNS delegations and DNS zones required to ensure that reverse DNS record resolves for all internet users.
### Will a default reverse DNS record be created for my Public IP Addresses?
No. Reverse DNS is an opt-in feature. No default reverse DNS records are created if you choose not to configure them.
### What is the format for the fully-qualified domain name (FQDN)?
FQDNs are specified in forward order, and must be terminated by a dot (e.g., “app1.contoso.com.”).
### What happens if the validation checks for the reverse DNS I’ve specified fail?
Where the validation for reverse DNS checks fail, the service management operation will fail. Please correct the reverse DNS value as required, and retry.
### Can I manage reverse DNS for my Azure Website?
Reverse DNS is not supported for Azure Websites. Reverse DNS is supported for Azure Virtual Machines.
### Can I configure multiple reverse DNS records for my Public IP Address?
No. Azure supports a single reverse DNS record for each Public IP Address. Each Public IP Address however can have their own reverse DNS record.
### Can I configure a reverse DNS record for my Public IP Address without having a DomainNameLabel specified?
No. To leverage reverse DNS records for your Public IP Addresses, you must specify the DomainNameLabel property.
### Can I host the ARPA zones for my Azure-assigned IPs on Azure DNS within my own subscription, or on my own authoritative DNS servers?
No. Azure does not support the onward delegation of ARPA zones. Azure hosts the ARPA zones for all available IPs, and enables customers to create reverse DNS records within these ARPA zones.
### Can I host ARPA zones for my ISP-assigned IP blocks on Azure DNS?
No. Azure DNS does not currently support reverse DNS records in customers DNS zones.
