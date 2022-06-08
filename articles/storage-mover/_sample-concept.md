---
title: #Required; page title is displayed in search results. Include the brand.
description: #Required; article description that is displayed in search results. 
author: stevenmatthew
ms.author: shaas
ms.service: storage
ms.topic: conceptual
ms.date: 06/08/2022
ms.custom: template-concept
---

<!--

This template provides the basic structure of a concept article.

1. H1

##Docs Required##

Set expectations for what the content covers, so customers know the content meets their needs. The heading should NOT begin with a verb.-->

# Migration agents and registration

<!-- 
2. Introductory paragraph\

##Docs Required## 

Lead with a light intro that describes what the article covers. Answer the fundamental “why would I want to know this?” question. Keep it short. -->

A migration agent is the on-premises component of the Azure Storage Mover service. An agent sends heartbeat information to the service and will look for configuration or migration jobs on a regular basis. The agent always contacts the Storage Mover service, never the reverse.

The following information should be kept in mind when provisioning a new agent:

- Agents require at least 2048 MB RAM, and ideally 8192 MB
- Use a virtual network switch with internet access. Ensure the management VM and agent VM are on the same switch. On the WAN link firewall, port 443 (TCP) must be open outbound.
- You can use the default virtual processor count, though you should set it as high as your host will allow.

<!-- 
3. H2s

##Docs Required## 

Give each H2 a heading that sets expectations for the content that follows. Follow the H2 headings with a sentence about how the section contributes to the whole. -->

## Configuration

While you can keep the default value of 1 virtual processor, you should use the maximum number which your host will allow. Performance and comparison testing will not be supported in the initial release, but will be included in subsequent releases.

Although there are several ways to configure your local network, the agent requires port 443 outbound open on the WAN link firewall. 

> [!IMPORTANT]
> When changing network configurations, connectivity interruptions are common.

The easiest way to accomplish this is to create an external virtual switch. This switch can be shared by your host OS with your VMs. Although this approach is suitable when used in a test environment, an internal virtual switch is better used on Hyper-V hosts running production workloads.


<!-- 
4. Next steps
##Docs Required##

We must provide at least one next step, but should provide no more than three. This should be relevant to the learning path and provide context so the customer can determine why they would click the link.-->

## Next steps
<!-- Add a context sentence for the following links -->
- [Step 1](overview.md)
- [Step 2](overview.md)
