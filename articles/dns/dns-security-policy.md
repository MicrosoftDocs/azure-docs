---
title: Overview of DNS security policy (Preview)
description: Learn about DNS security policy.
author: greg-lindsay
manager: KumuD
ms.service: azure-dns
ms.topic: article
ms.date: 11/19/2024
ms.author: greglin
---

# DNS security policy (Preview)

This article provides an overview of DNS security policy. Also see the following how-to guide:

- [How to filter and view DNS traffic (Preview)](dns-traffic-log-how-to.md).

> [!NOTE]
> DNS security policy is currently in PREVIEW.<br> 
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
 
## What DNS security policy?

DNS security policy offers the ability to filter and log DNS queries at the virtual network (VNet) level and view detailed DNS logs. Think of it like a DNS firewall for your cloud resources. You can allow, alert, or block name resolution of known or malicious domains. The logging capability enables you to gain detailed insight into your DNS traffic. DNS logs can be sent to a storage account, log analytics workspace, or event hubs.

A DNS security policy has the following associated elements and properties:
- **Location**: A security policy can only apply to VNets in the same region.
- **DNS traffic rules**: Rules that allow, block, or alert based on priority and domain lists. Rules can be enabled or disabled.
- **Virtual network links**: You can link one security policy per VNet. A security policy can be associated to multiple VNets.
- **DNS domain lists**: Location-based lists of DNS domains.

DNS Security Policy can be configured using Azure PowerShell or the Azure portal.

### Location

You can create any number of security policies in the same region. In the following example, two polices are created in each of two different regions (East US and Central US). Keep in mind that the policy:VNet relationship is 1:N. When you associate a VNet with a security policy (via virtual network links), that VNet can't then be associated with another security policy. However, a single DNS security policy can be associated with multiple VNets in the same region. 

![Screenshot of the list of DNS security policies.](./media/dns-security-policy/policy-list.png)

### DNS traffic rules

### Virtual network links

### DNS domain lists


## Requirements and restrictions

Virtual network restrictions:
- DNS security policies can only be applied to virtual networks in the same region as the DNS security policy.
- DNS security policy cannot be deleted unless the virtual network links under it are deleted.



## Related content

- [How to filter and view DNS traffic (Preview)](dns-traffic-log-how-to.md).
