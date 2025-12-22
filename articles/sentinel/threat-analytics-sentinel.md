---
title: Threat analytics for Microsoft Sentinel users (preview)
description: Learn about threat analytics and how Microsoft Sentinel users can access it in the Microsoft Defender portal.
author: poliveria
ms.topic: concept-article
ms.date: 11/18/2025
ms.author: pauloliveria
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security

#Customer intent: As a Microsoft Sentinel user, I want to know how I can access threat analytics in Microsoft Defender portal, and which sections are accessible to me.

---

# Track and respond to threats with threat analytics in Microsoft Defender (preview)

> [!IMPORTANT]
> Threat analytics access for customers who use only Microsoft Sentinel is currently in preview.
> This information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, expressed or implied, with respect to the information provided here.

**Threat analytics** is an in-product threat intelligence solution from expert Microsoft security researchers. It helps security teams stay efficient while facing emerging threats, such as:
- Active threat actors and their campaigns
- Popular and new attack techniques
- Critical vulnerabilities
- Common attack surfaces
- Prevalent malware

For more information, see the following articles:
- [Threat analytics in Microsoft Defender](/defender-xdr/threat-analytics)
- [Understand the analyst report in threat analytics in Microsoft Defender](/defender-xdr/threat-analytics-analyst-reports)
- [Get access to IOCs in threat analytics in Microsoft Defender](/defender-xdr/threat-analytics-indicators)

## Available threat analytics sections for Microsoft Sentinel customers
You can access threat analytics from the Microsoft Defender portal. By default, Microsoft Sentinel customers can access the following tabs or sections in threat analytics:
- Overview
- Analyst report
- Indicators

If you only have a Microsoft Sentinel license, you can't access the following sections in threat analytics because they're integrated with Microsoft Defender capabilities and data:
- Related incidents
- Impacted assets
- Endpoints exposure
- Recommended actions

## Unlock restricted sections in threat analytics
To access these other threat analytics sections, you need to have a license for at least one Microsoft Defender product and appropriate role-based access control (RBAC) permissions. For more information about Microsoft Defender license requirements, see [Microsoft Defender XDR prerequisites](/defender-xdr/prerequisites).

## Related content
- [Threat intelligence in Microsoft Sentinel](understand-threat-intelligence.md)
- [Threat intelligence integration in Microsoft Sentinel](threat-intelligence-integration.md)
