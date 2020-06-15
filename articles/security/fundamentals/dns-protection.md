---

title: Ensuring resilient and secure configurations of your Azure DNS
description: Learn about how to avoid common DNS threats 
services: security
author: memildin
manager: rkarlin

ms.assetid: 
ms.service: security
ms.subservice: security-fundamentals
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/15/2020
ms.author: memildin

---
# Azure DNS and subdomain takeover ("dangling DNS")

This article describes the common security threat of subdomain takeover, as well as things you can do to mitigate against it.


## What is subdomain takeover?

A subdomain takeover can occur when you have a stale DNS record in your organization’s DNS zone pointing to a deprovisioned Azure resource. For example, DNS records that haven't been updated to reflect changes to the resource name or its underlying IP addresses. The issue occurs especially with A/AAAA or CNAME record types. 

### The risks of dangling DNS records

If you have a DNS record pointing to a resource that is no longer available, the record itself should have been  removed from your DNS tables. If it hasn't been, it's a “dangling DNS” record and presents a security risk. The risk to the organization is that it enables a threat actor to take control of the associated DNS name to host a malicious website or service.


### Preventing dangling DNS entries

[Azure DNS's alias records](https://docs.microsoft.com/azure/dns/dns-alias#scenarios) feature prevents dangling references by tightly coupling the life cycle of a DNS record with an Azure resource. For example, consider a DNS record that's qualified as an alias record to point to a public IP address or a Traffic Manager profile. If you delete those underlying resources, the DNS alias record becomes an empty record set. It no longer references the deleted resource.

It's often up to developers and operations teams to perform cleanup processes to avoid dangling DNS threats. The practices below will help ensure your organization avoids suffering from this threat. 

- **Create procedures for prevention:**
    - Perform regular reviews of your DNS records to ensure that your subdomains are correctly mapped.
    - Use a tool like [digwebinterface](https://digwebinterface.com/) to review your records. Another option is to use  [Resolve-DnsName](https://docs.microsoft.com/powershell/module/dnsclient/resolve-dnsname?view=win10-ps) through PowerShell to query specified names.
    - Put "removing DNS entries" on the list of checks performed when decommissioning a service.
    - Educate your application developers to reroute addresses whenever they delete resources.
    - Ensure you're using [Azure DNS alias records](https://docs.microsoft.com/azure/dns/dns-alias#scenarios).

- **Create procedures for discovery:**
    - "Tim has a script" [TBD]().

- **Create procedures for remediation:**
    - When dangling DNS entries are found, your team needs to investigate whether any compromise has occurred.
    - Investigate why the address wasn't rerouted when the resource was decommissioned.
    - Delete the DNS record if it is no longer in use, or point it to the correct Azure resource (FQDN) owned by your organization.
 





## Next steps

To learn more about related services and Azure features you can use to defend your DNS, see the following pages.

- [Azure DNS supports using alias records for custom domains](https://docs.microsoft.com/azure/dns/dns-alias#prevent-dangling-dns-records)

- [Leverage the Domain Verification ID when adding Custom Domains in Azure App Service](https://docs.microsoft.com/azure/app-service/app-service-web-tutorial-custom-domain#get-domain-verification-id) 