<BR> 
## FAQ 
### How much do reverse DNS records cost?
They’re free!  There is no additional cost for reverse DNS records or queries.
### Will my reverse DNS records resolve from the internet?
Yes. Once you set the reverse DNS property for your Cloud Service, Azure manages all the DNS delegations and DNS zones required to ensure that reverse DNS record resolves for all internet users.
### Will a default reverse DNS record be created for my Cloud Services?
No. Reverse DNS is an opt-in feature. No default reverse DNS records are created if you choose not to configure them.
### What is the format for the fully-qualified domain name (FQDN)?
FQDNs are specified in forward order, and must be terminated by a dot (e.g., “app1.contoso.com.”).
### What happens if the validation checks for the reverse DNS I’ve specified fail?
Where the validation for reverse DNS checks fail, the service management operation will fail. Please correct the reverse DNS value as required, and retry.
### Can I manage reverse DNS for my Azure Website?
Reverse DNS is not supported for Azure Websites. Reverse DNS is supported for Azure PaaS roles and IaaS virtual machines.
### Can I configure multiple reverse DNS records for my Cloud Service?
No. Azure supports a single reverse DNS record for each Azure Cloud Service. Each Azure Cloud Service however can have their own reverse DNS record.
