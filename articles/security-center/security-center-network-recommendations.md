---
title: Protecting your network resources in Azure Security Center
description: This document addresses recommendations in Azure Security Center that help you protect your Azure network resources and stay in compliance with security policies.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: 96c55a02-afd6-478b-9c1f-039528f3dea0
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/05/2019
ms.author: memildin

---
# Protect your network resources

Azure Security Center continuously analyzes the security state of your Azure resources for network security best practices. When Security Center identifies potential security vulnerabilities, it creates recommendations that guide you through the process of configuring the needed controls to harden and protect your resources.

For a full list of the recommendations for Networking, see [Networking recommendations](recommendations-reference.md#recs-network).

This article addresses recommendations that apply to your Azure resources from a network security perspective. Networking recommendations center around next generation firewalls, Network Security Groups, JIT VM access, overly permissive inbound traffic rules, and more. For a list of networking recommendations and remediation actions, see [Managing security recommendations in Azure Security Center](security-center-recommendations.md).

The **Networking** features of Security Center include: 

- [Adaptive network hardening](security-center-adaptive-network-hardening.md)
- Networking security recommendations
 
## View your networking resources and their recommendations

From the [asset inventory page](asset-inventory.md), use the resource type filter to select the networking resources that you want to investigate:

:::image type="content" source="./media/security-center-network-recommendations/network-filters-inventory.png" alt-text="Asset inventory network resource types" lightbox="./media/security-center-network-recommendations/network-filters-inventory.png":::



## Next steps

To learn more about recommendations that apply to other Azure resource types, see the following:

* [Protecting your Azure SQL service in Azure Security Center](security-center-sql-service-recommendations.md)