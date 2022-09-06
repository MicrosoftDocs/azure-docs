---
title: 'About Azure DDoS Protection Standard configuration settings'
description: Learn about the available configuration settings for Azure DDoS Protection Standard.
author: AbdullahBell
ms.author: Abell
ms.service: ddos-protection
ms.topic: conceptual 
ms.date: 09/06/2022
ms.custom: template-concept 
---


# About Azure DDoS Protection Standard configuration settings

<!-- 2. Introductory paragraph 
Required. Lead with a light intro that describes what the article covers. Answer the 
fundamental “why would I want to know this?” question. Keep it short.
-->

The sections in this article discuss the resources and settings of Azure DDoS Protection Standard.

<!-- 3. H2s
Required. Give each H2 a heading that sets expectations for the content that follows. 
Follow the H2 headings with a sentence about how the section contributes to the whole.
-->

## SKUs

A SKU is also known as a Tier. Azure DDoS Protection Standard supports two SKU Types,
 DDoS IP Protection and DDoS Network Protection. The SKU is configured in the Azure portal during the workflow when you configure Azure DDoS Protection.



The following table shows features and corresponding SKUs.

| Feature |  DDoS Protection Basic | DDoS IP Protection | DDoS Network Protection |
|---|---|---|---|
| Active traffic monitoring & always on detection| Yes |  Yes| Yes |
| Automatic attack mitigation | Yes | Yes | Yes |
| Availability guarantee| Not available | Yes | Yes |
| Cost protection | Not available | Yes | Yes |
| Application based mitigation policies | Not available | Yes| Yes |
| Metrics & alerts | Not available  | Yes | Yes |
| Mitigation reports | Not available | Yes | Yes |
| Mitigation flow logs| Not available  | Yes| Yes |
| Mitigation policy customizations | Not available | Yes| Yes |
| DDoS rapid response support | Not available| Yes| Yes |
| Cost | Free | Per protected IP | Per 100 protected IP addresses |

## DDoS Protection Basic
 At no additional cost, Azure DDoS Protection Basic protects every Azure service that uses public IPv4 and IPv6 addresses. This DDoS protection service helps to protect all Azure services, including platform as a service (PaaS) services such as Azure DNS. DDoS Protection Basic requires no user configuration or application changes.

>Note!
>Azure provides continuous protection against DDoS attacks. DDoS protection does not store customer data.

## DDoS IP Protection

- 
- 

## DDoS Network Protection

DDoS Network Protection provides enhanced DDoS mitigation features to defend against DDoS attacks. It's automatically tuned to help protect your specific Azure resources in a virtual network.

<!-- 4. Next steps
Required. Provide at least one next step and no more than three. Include some 
context so the customer can determine why they would click the link.
-->

## Next steps
<!-- Add a context sentence for the following links -->
* [Quickstart: Create a DDoS Protection Plan](manage-ddos-protection.md)
* [Azure DDoS Protection Standard features](ddos-protection-standard-features.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->