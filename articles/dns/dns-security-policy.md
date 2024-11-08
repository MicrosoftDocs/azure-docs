---
title: Overview of DNS security policy (Preview)
description: Learn about DNS security policy.
author: greg-lindsay
manager: KumuD
ms.service: azure-dns
ms.topic: article
ms.date: 11/06/2024
ms.author: greglin
---

# DNS security policy (Preview)

This article provides an overview of DNS security policy. Also see the following how-to guide:

- [How to filter and view DNS traffic (Preview)](dns-traffic-log-how-to.md).

> [!NOTE]
> DNS security policy is currently in PREVIEW.<br> 
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
 
## What DNS security policy?

DNS security policy offers the ability to filter DNS queries at the virtual network (VNet) level. You can allow, alert, or block name resolution of known or malicious domains and gain insight into your DNS traffic. Detailed DNS logs can be sent to a storage account, log analytics workspace, or event hubs.

A DNS security policy has the following associated elements and properties:
- Location: A security policy can only apply to VNets in the same region.
- DNS traffic rules: Rules that allow, block, or alert based on priority and domain lists. Rules can be enabled or disabled.
- Virtual network links: You can link one security policy per VNet. A security policy can be associated to multiple VNets.
- DNS domain lists: Location-based lists of DNS domains.

You can

On the first option, the security policy is created with diagnostics set to be sent towards a storage account (your DNS query logs will be visible there).
On the second option, you configure the security policy via Portal and have instructions on how to create and manage the security policy, plus setting the diagnostic options to send the DNS query details to a log analytics workspace.

You should now be able to log your DNS traffic to one or multiple locations (storage account, log analytics workspace). DNS security policy should log all DNS queries initiated from your VNET. You can try following two scenarios for your testing.
1. Create an Azure DNS private zone and link it to the virtual network where you have deployed the resolver. Next create some DNS records in the DNS zone and try to resolve these records from on-prem machines and Azure VMs. You can use nslookup command or Resolve-DnsName PowerShell command to lookup specific DNS records. You can also try variation of this scenario by creating different types of DNS records like AAAA, TXT, CNAME etc.

## FAQ

What is a DNS security policy?
- DNS security policy is an object which will contain monitoring settings for DNS query logging which can be applied to one or more Virtual Networks. This is a 1:N relationship.

What is a Virtual Network Link?
- Virtual Network links enable the policy on Virtual Networks which are linked to a DNS security policy. This is a 1:1 relationship.

Virtual network restrictions: The following restrictions are held with respect to virtual networks:
- DNS security policy can reference a virtual network in the same region as the DNS security policy only.
- DNS security policy restrictions: DNS security policy has the following limitations:
- DNS security policy cannot be deleted unless the virtual network links under it are deleted.

What is a Domain List?
- A domain list is essentially a collection of domain names grouped together for a specific purpose. In the context of DNS security policy, a domain list can be used for DNS filtering.
- For example, in DNS security policies, a domain list can be used to specify which domains should be allowed or blocked. This can help in managing and securing network traffic by filtering out unwanted or harmful domains. Additionally, domain lists can be linked to multiple rules for DNS filtering, allowing for more granular control over DNS traffic.

What is a DNS traffic rule?
- A DNS traffic rule is a set of predefined criteria or policies used to manage and control the flow of DNS queries and responses within a virtual network. These rules can be applied to virtual networks to which a DNS security policy is linked to and may contain 1 or Domain List.

Security Policies: These rules can help protect against DNS-based attacks by allowing or blocking specific domain names, helping to filter out unwanted or harmful domains and enhance network security.

## Next steps

- Learn how to [sign a DNS zone with DNSSEC](dnssec-how-to.md).
- Learn how to [unsign a DNS zone](dnssec-unsign.md).
- Learn how to [host the reverse lookup zone for your ISP-assigned IP range in Azure DNS](dns-reverse-dns-for-azure-services.md).
- Learn how to [manage reverse DNS records for your Azure services](dns-reverse-dns-for-azure-services.md).
