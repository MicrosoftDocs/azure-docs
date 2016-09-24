A DNS zone is used to host the DNS records for a particular domain. In order to start hosting your domain, you need to create a DNS zone. Any DNS record created for a particular domain will be inside a DNS zone for the domain. 

For example, the domain "contoso.com" may contain a number of DNS records, such as "mail.contoso.com" (for a mail server) and "www.contoso.com" (for a web site). 


## <a name="names"></a>About DNS zone names
 
- The name of the zone must be unique within the resource group, and the zone must not exist already. Otherwise, the operation will fail.

- The same zone name can be re-used in a different resource group or a different Azure subscription. 

- Where multiple zones share the same name, each instance will be assigned different name server addresses, and only one instance can be delegated from the parent domain. For more information, see [Delegate a domain to Azure DNS](../articles/dns/dns-domain-delegation.md).