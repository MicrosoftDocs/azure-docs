---
title: 'How to block high-risk network ports with SecurityAdmin Rules in Azure Virtual Network Manager.'
description: #Required; In this article, you will deploy Security admin rules to block high-risk security ports with Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 06/28/2022
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->

<!--
This template provides the basic structure of a how-to article.
See the [how-to guidance](contribute-how-to-write-howto.md) in the contributor guide.

To provide feedback on this template contact 
[the templates workgroup](mailto:templateswg@microsoft.com).
-->

<!-- 1. H1
Required. Start your H1 with a verb. Pick an H1 that clearly conveys the task the 
user will complete.
-->

# How to block high-risk network ports with Security Admin Rules in Azure Virtual Network Manager

<!-- 2. Introductory paragraph 
Required. Lead with a light intro that describes, in customer-friendly language, 
what the customer will learn, or do, or accomplish. Answer the fundamental “why 
would I want to do this?” question. Keep it short.
-->

In this article, you will learn to block high risk network ports using Azure Virtual Network Manager and Security Admin Rules. You'll walk through the creation of an Azure Virtual Network Manager instance, group your vnets with network groups, and create & deploy security admin configurations for your orginization. You'll deploy an general block rule for high risk ports. Then you'll create an exception for managing a specific application's vnet. This is will allow you to manage access to the application vnets using network security groups.

### Describe Scenario

:::image type="content" source="media/how-to-block-high-risk-ports/sec-admin-rules-scenario.png" alt-text="This diagram describes the scenario for the how-to. It includes virtual networks, network groups, and admin security policies.":::
<!-- 3. Prerequisites 
Optional. If you need prerequisites, make them your first H2 in a how-to guide. 
Use clear and unambiguous language and use a list format.
-->

## Prerequisites

- <!-- prerequisite 1 -->
- <!-- prerequisite 2 -->
- <!-- prerequisite n -->
<!-- remove this section if prerequisites are not needed -->

<!-- 4. H2s 
Required. A how-to article explains how to do a task. The bulk of each H2 should be 
a procedure.
-->

## Deploy Virtual Network environment



## Create a Virtual Network Manager
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

## Create a Network Group
With our network manager created, we can now create a network group to encapsulate the VNets we want to protect.
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

## Create a Security Admin Configuration
It’s time to construct our security admin rules within a configuration so that we can apply those rules to all the VNets within OurNetworkGroup at once.
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

## Deploy the Security Admin Configuration
We’re at the final step, which is to deploy OurSecurityConfig. This is how the security admin configuration will actually take effect on the VNets in OurNetworkGroup, and we can control the regions to which this deployment rolls out.

## Create a Network Group for Application
We need to create a network group specifically for the Application 1 team’s VNets so that we can create security admin rules that pertain only to Application 1’s VNets and allow them to handle SSH traffic through their own NSGs. Since we already have OurNetworkManager created, we can go ahead and create another network group.

## Create a Security Admin Rule Collection for Application 1
We can now create an exception for Application 1’s VNets by adding a new rule collection and security admin rule to our existing security admin configuration.

## Re-deploy the Security Admin Configuration
We’re at the final step, which is to redeploy OurSecurityConfig since we’ve modified this configuration by adding a rule collection.

## Verify 

## Clean up

<!-- 5. Next steps
Required. Provide at least one next step and no more than three. Include some 
context so the customer can determine why they would click the link.
-->

## Next steps
<!-- Add a context sentence for the following links -->
- [Write how-to guides](contribute-how-to-write-howto.md)
- [Links](links-how-to.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->
