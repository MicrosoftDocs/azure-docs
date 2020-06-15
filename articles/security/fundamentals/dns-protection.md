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
# Azure DNS - Protect against these threats to your DNS security

This article provides an introduction to common DNS threats, and advice for ensuring the security and stability of your Azure DNS infrastructure.

## What are the common DNS threats?

One common reason for deploying a domain name server is to increase the security for your users and customers. However, the DNS itself also needs to be defended to prevent attackers taking advantage of some well-known vulnerabilities. Below are some of the most common DNS threats:

- Subdomain takeover (also known as "dangling DNS")
- Distributed denial of service attacks (DDoS)



## Subdomain takeover or "dangling DNS"

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
 


## Distributed denial of service attacks (DDoS)

DDoS attacks aren't specific to DNS. However, domain name servers are vulnerable to such attacks and are often overlooked when considering this threat. Even if you've established good defenses for your websites and web applications, they're still vulnerable if the DNS infrastructure can't handle the number of incoming requests it receives. 

### The risks of DDoS attacks on a DNS

Distributed denial of service (DDoS) attacks are known to be easy to execute. They've become a great security concern, particularly if you're moving your applications to the cloud. 

A DDoS attack attempts to exhaust an application's resources, making the application unavailable to legitimate users. DDoS attacks can target any endpoint that can be reached through the internet, including the DNS. A successful DDoS attack against a DNS server causes it to crash. When it crashes, users are unable to access the pages and applications listed on that DNS (apart from any that have been cached locally).


### Defending your DNS from DDoS attacks

To defend against DDoS attacks, use [Azure DDoS Protection standard](https://docs.microsoft.com/azure/virtual-network/ddos-protection-overview) to defend your organization from the three main types of DDoS attacks:

- **Volumetric attacks** flood the network with legitimate traffic. DDoS Protection Standard mitigates these attacks by absorbing or scrubbing them automatically.
- **Protocol attacks** render a target inaccessible, by exploiting weaknesses in the layer 3 and layer 4 protocol stack. DDoS Protection Standard mitigates these attacks by blocking malicious traffic.
- **Resource (application) layer attacks** target web application packets. Defend against this type with a web application firewall and DDoS Protection Standard.

For a list of the security alerts Azure DDoS Protection produces, see the [Azure Security Center table of DDoS alerts](https://docs.microsoft.com/azure/security-center/alerts-reference#alerts-azureddos).

>[!TIP]
> If you're using a content delivery network (CDN), it includes DDoS protection by design. [Azure CDN from Microsoft](https://docs.microsoft.com/azure/cdn/cdn-ddos) is protected by Azure Basic DDoS by default, and at no extra cost. 




## Next steps

To learn more about related services and Azure features you can use to defend your DNS, see the following pages.

- [Azure DNS supports using alias records for custom domains](https://docs.microsoft.com/azure/dns/dns-alias#prevent-dangling-dns-records)

- [Leverage the Domain Verification ID when adding Custom Domains in Azure App Service](https://docs.microsoft.com/azure/app-service/app-service-web-tutorial-custom-domain#get-domain-verification-id) 