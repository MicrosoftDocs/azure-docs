---
author: vhorne
ms.service: dns
ms.topic: include
ms.date: 11/25/2018
ms.author: victorh
---
A DNS zone is used to host the DNS records for a particular domain. To start hosting your domain in Azure DNS, you need to create a DNS zone for that domain name. Each DNS record for your domain is then created inside this DNS zone.

For example, the domain 'contoso.com' may contain several DNS records, such as 'mail.contoso.com' (for a mail server) and 'www.contoso.com' (for a web site).

When creating a DNS zone in Azure DNS:

* The name of the zone must be unique within the resource group, and the zone must not exist already. Otherwise, the operation fails.
* The same zone name can be reused in a different resource group or a different Azure subscription.
* Where multiple zones share the same name, each instance is assigned different name server addresses. Only one set of addresses can be configured with the domain name registrar.

> [!NOTE]
> You do not have to own a domain name to create a DNS zone with that domain name in Azure DNS. However, you do need to own the domain to configure the Azure DNS name servers as the correct name servers for the domain name with the domain name registrar.
> 
> For more information, see [Delegate a domain to Azure DNS](../articles/dns/dns-domain-delegation.md).