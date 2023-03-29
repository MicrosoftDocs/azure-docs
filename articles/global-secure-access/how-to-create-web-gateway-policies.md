---
title: How to create web gateway policies
description: Learn how to create web gateway policies for Entra Global Secure Access.
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.topic: how-to
ms.date: 03/29/2023
ms.service: network-access
ms.custom: 
---


<!-- 1. H1
Required. Set expectations for what the content covers, so customers know the 
content meets their needs. H1 format is # What is <product/service>?
-->

# Learn how to create web gateway policies for Global Secure Access
Global Secure Access provides the ability to restrict network traffic based on groups or domains. For example, you can block a category of network traffic, such as social media, or a Fully Qualified Domain Name (FQDN), such as example.com.

Global Secure Access includes Microsoft Entra Private Access and Microsoft Entra Internet Access. The table outlines which product is required for each feature in this article. To learn more about Microsoft Entra Private Access, see [What is Microsoft Entra Private Access?](overview-what-is-private-access.md). To learn more about Microsoft Entra Internet Access, see [What is Microsoft Entra Internet Access?](overview-what-is-internet-access.md).

| Feature   | Microsoft Entra Private Access | Microsoft Entra Internet Access |
|----------|-----------|------------|
| Feature A | X |   |
| Feature B |   | X |
| Feature C | X | X |
| Feature D | X |   |

<!-- 2. Introductory paragraph 
Required. Lead with a light intro that describes what the article covers. Answer the 
fundamental “why would I want to know this?” question. Keep it short.
-->

## Create a category policy
Create a category policy such as blocking "social media".
1. Navigate to the Entra portal at `https://entra.microsoft.com` and select **Global Secure Access**.
1. Select **Web filtering policies** to create a new policy.
1. Select **Create policy**.
1. Select **Add rule**.
1. Provide a name for the policy and select **webCategory**.

## Create domain specific policy
Create a Fully Qualified Domain Name (FQDN) to block specific destinations.
1. Navigate to the Entra portal at `https://entra.microsoft.com` and select **Global Secure Access**.
1. Select **Web filtering policies** to create a new policy.
1. Select **Create policy**.
4. Select **Add rule**.
5. Provide a name and select **Fully Qualified Domain Name (FQDN)**.
6. Enter a FQDN destination such as `example.com`.
7. Select **Add**.
8. Select **Create policy**.


<!-- 3. H2s
Required. Give each H2 a heading that sets expectations for the content that follows. 
Follow the H2 headings with a sentence about how the section contributes to the whole.
-->

## [Section 1 H2]
<!-- add your content here -->

## [Section 2 H2]
<!-- add your content here -->

## [Section n H2]
<!-- add your content here -->

<!-- 4. Next steps
Required. Provide at least one next step and no more than three. Include some 
context so the customer can determine why they would click the link.
-->

## Next steps
<!-- Add a context sentence for the following links -->
- [abc](#)

