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

Subdomain takeovers are a common, high-severity threat for organizations that regularly create and delete many resources. A subdomain takeover can occur when you have a stale DNS record that pointing to a deprovisioned Azure resource. The issue occurs especially with A/AAAA or CNAME record types. 

For example, this is a common scenario:

1. A website `wer123821432.azurewebsites.net` is created.

1. The CNAME entry `GreatApp.Contoso.com` is added to the DNS pointing to this website.

1. After a few months, the site is no longer needed so it is deleted. **The CNAME entry remains.**

1. Almost immediately after the site is deleted, a threat actor discovers creates their own `wer123821432.azurewebsites.net` website. 
    Now, the traffic intended to go to `GreatApp.Contoso.com` is reaching the threat actor's Azure site. The 'dangling DNS' was exploited, and Contoso's subdomain "GreatApp" has been taken over. 


### The risks of dangling DNS records

When a DNS record points to a resource that isn't available, the record itself should have been removed from your DNS tables. If it hasn't been deleted, it's a “dangling DNS” record and presents a security risk.

The risk to the organization is that it enables a threat actor to take control of the associated DNS name to host a malicious website or service and that can, in turn, lead to:

- Authentication bypass
- Cookie extraction from unsuspecting visitors
- CORS bypass
- Authentic-looking subdomains can be used in phishing campaigns - This is true for malicious sites and also for MX records that would allow the threat actor to receive emails addressed to a legitimate subdomain of a known-safe brand
- SSL certificate generation - It's possible to validate SSL certificate requests to increase the perceived legitimacy of a malicious site hosted on a subdomain that has been taken over
- Negative PR


### Preventing dangling DNS entries

It's clear that when you find a dangling DNS, the easiest solution is to delete the DNS entry.

However, your security program should include preventative measures such as those described below.

### Use Azure DNS's alias records

[Azure DNS's alias records](https://docs.microsoft.com/azure/dns/dns-alias#scenarios) feature prevents dangling references by tightly coupling the life cycle of a DNS record with an Azure resource. For example, consider a DNS record that's qualified as an alias record to point to a public IP address or a Traffic Manager profile. If you delete those underlying resources, the DNS alias record becomes an empty record set. It no longer references the deleted resource. It's important to note that there are limits to what you can protect with alias records:

- Traffic Manager profiles
- Azure Content Delivery Network (CDN) endpoints
- Public IPs
- Other DNS records of the same type

Despite these limitations, if you have relevant resources that can be protected from subdomain takeover by using alias records, Microsoft recommends  

[Learn more](https://docs.microsoft.com/azure/dns/dns-alias#capabilities) about the capabilities of Azure DNS's alias records.


### Education and expanding internal development procedures

It's often up to developers and operations teams to perform cleanup processes to avoid dangling DNS threats. The practices below will help ensure your organization avoids suffering from this threat. 

- **Create procedures for prevention:**
    - Perform regular reviews of your DNS records to ensure that your subdomains are correctly mapped.

    - Put [delete locks](https://docs.microsoft.com/azure/azure-resource-manager/management/lock-resources) on any resources that have a custom DNS entry. This should serve as an indicator that the mapping must be removed before the resource is deprovisioned. Measures like this can only work when combined with internal programs for educating dev, ops, and devops teams.

    - Use a tool like [digwebinterface](https://digwebinterface.com/) to review your records. Another option is to use  [Resolve-DnsName](https://docs.microsoft.com/powershell/module/dnsclient/resolve-dnsname?view=win10-ps) through PowerShell to query specified names.

    - Put "removing DNS entries" on the list of checks performed when decommissioning a service.

    - Educate your application developers to reroute addresses whenever they delete resources.

    - Ensure you're using [Azure DNS alias records](https://docs.microsoft.com/azure/dns/dns-alias#scenarios).


- **Create procedures for discovery:**

    - One way to try to discover dangling DNS entries is to access your DNS provider and query everything that points to an Azure resource. This is time consuming and inefficient, but may be an effective way to perform discovery. 

    - Alternatively, by querying Azure Graph for all resources (to which you have access) using the queries below, you can  


- **Create procedures for remediation:**
    - When dangling DNS entries are found, your team needs to investigate whether any compromise has occurred.
    - Investigate why the address wasn't rerouted when the resource was decommissioned.
    - Delete the DNS record if it is no longer in use, or point it to the correct Azure resource (FQDN) owned by your organization.
 





## Next steps

To learn more about related services and Azure features you can use to defend your DNS, see the following pages.

- [Azure DNS supports using alias records for custom domains](https://docs.microsoft.com/azure/dns/dns-alias#prevent-dangling-dns-records)

- [Leverage the Domain Verification ID when adding Custom Domains in Azure App Service](https://docs.microsoft.com/azure/app-service/app-service-web-tutorial-custom-domain#get-domain-verification-id) 