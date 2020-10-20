---
title: Azure Security Benchmark V2 - Network Security
description: Azure Security Benchmark V2 Network Security
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 09/20/2020
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Security Control V2: Network Security

Network Security covers controls to secure and protect Azure networks. This includes securing virtual networks, establishing private connections, preventing and mitigating external attacks, and securing DNS.

## NS-1: Implement security for internal traffic

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| NS-1 | 9.2, 9.4, 14.1, 14.2, 14.3 | AC-4, CA-3, SC-7 |

Ensure that all Azure virtual networks follow an enterprise segmentation principle that aligns to the business risks. Any system that could incur higher risk for the organization should be isolated within its own virtual network and sufficiently secured with either a network security group (NSG) and/or Azure Firewall. 

Based on your applications and enterprise segmentation strategy, restrict or allow traffic between internal resources based on network security group rules. For specific well-defined applications (such as a 3-tier app), this can be a highly secure "deny by default, permit by exception" approach. This might not scale well if you have many applications and endpoints interacting with each other. You can also use Azure Firewall in circumstances where central management is required over a large number of enterprise segments or spokes (in a hub/spoke topology). 

Use Azure Security Center Adaptive Network Hardening to recommend network security group configurations that limit ports and source IPs based with the reference to external network traffic rules.

Use Azure Sentinel to discover the use of legacy insecure protocols such as SSL/TLSv1, SMBv1, LM/NTLMv1, wDigest, Unsigned LDAP Binds, and weak ciphers in Kerberos.

- [How to create a network security group with security rules](../../virtual-network/tutorial-filter-network-traffic.md)

- [How to deploy and configure Azure Firewall](../../firewall/tutorial-firewall-deploy-portal.md)

- [Adaptive Network Hardening in Azure Security Center](../../security-center/security-center-adaptive-network-hardening.md)

- [Azure Sentinel insecure protocols workbook](../../sentinel/quickstart-get-visibility.md#use-built-in-workbooks)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Security architecture](/azure/cloud-adoption-framework/organize/cloud-security-architecture) 

- [Posture management](/azure/cloud-adoption-framework/organize/cloud-security-posture-management)     

- [Application Security and DevOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

## NS-2: Connect private networks together

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| NS-2 | N/A | CA-3, AC-17, MA-4 |

Use Azure ExpressRoute or Azure virtual private network (VPN)  to create private connections between Azure datacenters and on-premises infrastructure in a colocation environment. ExpressRoute connections do not go over the public internet , and they offer more reliability, faster speeds, and lower latencies than typical internet connections. For point-to-site VPN and site-to-site VPN, you can connect on-premises devices or networks to a virtual network using any combination of these VPN options and Azure ExpressRoute.

To connect two or more virtual networks in Azure together, use virtual network peering or Private Link. Network traffic between peered virtual networks is private and is kept on the Azure backbone network. 

- [What are the ExpressRoute connectivity models](../../expressroute/expressroute-connectivity-models.md) 

- [Azure VPN overview](../../vpn-gateway/vpn-gateway-about-vpngateways.md)

- [Virtual network peering](../../virtual-network/virtual-network-peering-overview.md)

- [Azure Private Link](../../private-link/private-link-service-overview.md)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Security architecture](/azure/cloud-adoption-framework/organize/cloud-security-architecture) 

- [Posture management](/azure/cloud-adoption-framework/organize/cloud-security-posture-management)    

- [Application Security and DevOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops) 

## NS-3: Establish private network access to Azure services

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| NS-3 | 14.1 | AC-4, CA-3, SC-7 |

Use Azure Private Link to enable private access to Azure services from your virtual networks, without crossing the internet. In situations where Azure Private Link is not yet available, use Azure Virtual Network service endpoints.  Azure Virtual Network service endpoints provide secure access to services via an optimized route over the Azure backbone network.  

Private access is an additional defense in depth measure in addition to authentication and traffic security offered by Azure services. 

- [Understand Azure Private Link](../../private-link/private-link-overview.md)

- [Understand Virtual Network service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Security architecture](/azure/cloud-adoption-framework/organize/cloud-security-architecture) 

- [Posture management](/azure/cloud-adoption-framework/organize/cloud-security-posture-management)   

- [Application Security and DevOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops) 

## NS-4: Protect applications and services from external network attacks

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| NS-4 | 9.5, 12.3, 12.9 | SC-5, SC-7 |

Protect Azure resources against attacks from external networks, including distributed denial of service (DDoS) Attacks, application specific attacks, and unsolicited and potentially malicious internet traffic. Azure includes native capabilities for this:
-	Use Azure Firewall to protect applications and services against potentially malicious traffic from the internet and other external locations. 

-	Use Web Application Firewall (WAF) capabilities in Azure Application Gateway, Azure Front Door, and Azure Content Delivery Network (CDN) to protect your applications, services, and APIs against application layer attacks. 

-	Protect your assets against DDoS attacks by enabling DDoS standard protection on your Azure virtual networks. 
-	Use Azure Security Center to detect misconfiguration risks related to the above. 

- [Azure Firewall Documentation](/azure/firewall/)

- [How to deploy Azure WAF](../../web-application-firewall/overview.md)

- [Manage Azure DDoS Protection Standard using the Azure portal](../../virtual-network/manage-ddos-protection.md)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

None

## NS-5: Deploy intrusion detection/intrusion prevention systems (IDS/IPS)

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| NS-5 | 12.6, 12.7 | SI-4 |

Use Azure Firewall threat intelligence-based filtering to alert on and/or block traffic to and from known malicious IP addresses and domains. The IP addresses and domains are sourced from the Microsoft Threat Intelligence feed. When payload inspection is required, you can deploy a third-party intrusion detection/intrusion prevent system (IDS/IPS) from Azure Marketplace with payload inspection capabilities. Alternately you can use host-based IDS/IPS or a host-based endpoint detection and response (EDR) solution in conjunction with or instead of network-based IDS/IPS.  

Note: If you have a regulatory or other requirement for IDS/IPS use, ensure that it is always tuned to provide high quality alerts to your SIEM solution. 

- [How to deploy Azure Firewall](../../firewall/tutorial-firewall-deploy-portal.md)

- [Azure Marketplace includes third party IDS capabilities](https://azuremarketplace.microsoft.com/marketplace?search=IDS)

- [Microsoft Defender ATP EDR capability](/windows/security/threat-protection/microsoft-defender-atp/overview-endpoint-detection-response)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Security architecture](/azure/cloud-adoption-framework/organize/cloud-security-architecture) 

- [Posture management](/azure/cloud-adoption-framework/organize/cloud-security-posture-management)   

- [Application Security and DevOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops) 

## NS-6: Simplify network security rules

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| NS-6 | 1.5 | IA-4 |

Simplify network security rules by leveraging service tags and application security groups (ASGs). 

Use Virtual Network service tags to define network access controls on network security groups or Azure Firewall. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name in the source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

You can also use application security groups to help simplify complex security configuration. Instead of defining policy based on explicit IP addresses in network security groups, application security groups enable you to configure network security as a natural extension of an application's structure, allowing you to group virtual machines and define network security policies based on those groups.

- [Understand and use service tags](../../virtual-network/service-tags-overview.md)

- [Understand and use application security groups](/azure/virtual-network/security-overview#application-security-groups)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Security architecture](/azure/cloud-adoption-framework/organize/cloud-security-architecture) 

- [Posture management](/azure/cloud-adoption-framework/organize/cloud-security-posture-management)    

- [Application Security and DevOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

## NS-7: Secure Domain Name Service (DNS)

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| NS-7 | N/A | SC-20, SC-21 |

Follow the best practices for DNS security to mitigate against common attacks like dangling DNS, DNS amplifications attacks, DNS poisoning and spoofing, etc. 

When Azure DNS is used as your authoritative DNS service, ensure DNS zones and records are protected from accidental or malicious modification using Azure RBAC and resource locks. 

- [Azure DNS overview](../../dns/dns-overview.md)

- [Secure Domain Name System (DNS) Deployment Guide](https://csrc.nist.gov/publications/detail/sp/800-81/2/final)

- [Prevent dangling DNS entries and avoid subdomain takeover](../fundamentals/subdomain-takeover.md)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Security architecture](/azure/cloud-adoption-framework/organize/cloud-security-architecture) 

- [Posture management](/azure/cloud-adoption-framework/organize/cloud-security-posture-management)   

- [Application Security and DevOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops) 

