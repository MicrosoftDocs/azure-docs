---
title: Using Microsoft resources to respond to supply chain attacks and systemic identity compromise | Microsoft Docs
description: Learn how to use Microsoft resources to respond to supply chain attacks and systemic identity compromises similar to the SolarWinds attack (Solorigate).
services: sentinel
documentationcenter: na
author: batamig
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/30/2020
ms.author: bagol

---

# Using Microsoft resources to respond to supply chain attacks and systemic identity compromise

This section describes how to use Microsoft resources created specifically to respond to the SolarWinds attack (Solorigate), with clear action items for your to perform to help ensure your organization's continued security.

These resources can also be used to understand and mitigate risks in other similar supply chain attacks and system identity compromises.

## Overview

If you suspect that your organization has been affected by Solorigate or another similar attack, we recommend that you use Microsoft products such as Azure Sentinel, Microsoft Defender, and Azure Active Directory to identify risks and compromise, and then isolate resources and harden your system against attack.

Azure Sentinel users have the advantage of Azure Sentinel connectors for Microsoft Defender and Azure Active Directory, which provide all relevant data and checks through a single view. We therefore recommend that Azure Sentinel users with these connectors start responding to threats by [querying data found in Azure Sentinel](identity-compromise-azure-sentinel.md).

You can also use [Microsoft Defender](identity-compromise-defender.md) and [Azure Active Directory](identity-compromise-aad.md) directly to perform similar checks and hardening activities. 

For more information, see:

- [Solorigate indicators of compromise (IOCs)](solarwinds-ioc-mitigate.md)

- [MITRE ATT&CK techniques observed in Solorigate](solarwinds-ioc-mitigate.md#mitre-attck-techniques-observed-in-solorigate)

- [Solorigate attacker behaviors](solarwinds-ioc-mitigate.md#more-solorigate-attacker-behaviors)

- [About Solorigate and Microsoft's response](#about-solorigate-and-microsofts-response)

- [Microsoft references for Solorigate](#microsoft-references-for-solorigate)

> [!NOTE]
> Depending on your configurations and identified risk, there may be steps described in this section that are not relevant for your organization, or should be performed in a different order than listed. 
>
> We recommend performing as many checks as possible with an informed understanding of your network estate.
>

## About Solorigate and Microsoft's response

In December 2020, [FireEye discovered a nation-state cyber attack on SolarWinds software](https://www.fireeye.com/blog/threat-research/2020/12/evasive-attacker-leverages-solarwinds-supply-chain-compromises-with-sunburst-backdoor.html).

Following this discovery, Microsoft swiftly took the following steps against the attack:

1. **Disclosed a set of complex techniques** used by an advanced actor in the attack, affecting several key customers.

1. **Removed the digital certificates used by the Trojaned files,** effectively telling all Windows systems overnight to stop trusting those compromised files. 

1. **Updated Microsoft Windows Defender** to detect and alert if it found a Trojaned file on the system.

1. **Sinkholed one of the domains used by the malware** to command and control affected systems.

1. **Changed Windows Defender's default action for Solorigate from *Alert* to *Quarantine***, effectively killing the malware when found at the risk of crashing the system.

The SolarWinds attack provided the attacker with a foothold into affected networks, which the attacker then used to gain elevated credentials. The attacker then used those credentials to access global administrator accounts or trusted SAML token-signing certificates. 

The global administrator account or certificates enabled the attacker to forge SAML tokens that can impersonate any of the organization's existing users and accounts, including highly privileged accounts.

> [!IMPORTANT]
> Microsoft has taken swift action to neutralize and then kill the malware in the SolarWinds attack, and then take control oer the malware infrastructure from the attackers.
>
> The Solarwinds attack is an ongoing investigation, and our teams continue to act as first responders to these attacks. As new information becomes available, we will make updates through our Microsoft Security Response Center (MSRC) blog at https://aka.ms/solorigate.
> 

## Microsoft references for Solorigate

The following links were used in building this section of the documentation, and can be used to learn more about the Solorigate attack and mitigation activities:

|Source  |Links  |
|---------|---------|
|**Microsoft On The Issues**     |[Important steps for customers to protect themselves from recent nation-state cyberattacks](https://blogs.microsoft.com/on-the-issues/2020/12/13/customers-protect-nation-state-cyberattacks/)         |
|**Microsoft Security Response Center**     |  [Solorigate Resource Center: https://aka.ms/solorigate](https://aka.ms/solorigate) <br><br>[Customer guidance on recent nation-state cyber attack](https://msrc-blog.microsoft.com/2020/12/13/customer-guidance-on-recent-nation-state-cyber-attacks/)       |
|**Azure Active Directory Identity blog**     |  [Understanding "Solorigate"'s Identity IOCs - for Identity Vendors and their customers](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/understanding-quot-solorigate-quot-s-identity-iocs-for-identity/ba-p/2007610)       |
|**TechCommunity**     |    [Azure AD workbook to help you assess Solorigate risk](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/azure-ad-workbook-to-help-you-assess-solorigate-risk/ba-p/2010718) <br><br> [Solarwinds: Post compromise hunting with Azure Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/solarwinds-post-compromise-hunting-with-azure-sentinel/ba-p/1995095)      |
|**Microsoft Security Intelligence**     |  [Malware encyclopedia definition: Solorigate](https://www.microsoft.com/en-us/wdsi/threats/malware-encyclopedia-description?Name=Trojan:MSIL/Solorigate.B!dha)       |
|**Microsoft Security blog**     |   [Analyzing Solorigate: The compromised DLL file that started a sophisticated cyberattack and how Microsoft Defender helps protect](https://www.microsoft.com/security/blog/2020/12/18/analyzing-solorigate-the-compromised-dll-file-that-started-a-sophisticated-cyberattack-and-how-microsoft-defender-helps-protect/)<br><br> [Advice for incident responders on recovery from system identity compromises](https://www.microsoft.com/security/blog/2020/12/21/advice-for-incident-responders-on-recovery-from-systemic-identity-compromises/) from the Detection and Response Team (DART) <br><br>[Using Microsoft 365 Defender to coordinate protection against Solorigate](https://www.microsoft.com/security/blog/2020/12/28/using-microsoft-365-defender-to-coordinate-protection-against-solorigate/)   <br><br>[Ensuring customers are protected from Solorigate](https://www.microsoft.com/security/blog/2020/12/15/ensuring-customers-are-protected-from-solorigate/)   |
| **GitHub resources**    |   [Azure Sentinel workbook for SolarWinds post-compromise hunting](https://github.com/Azure/Azure-Sentinel/blob/master/Workbooks/SolarWindsPostCompromiseHunting.json) <br><br>[Advanced Microsoft Defender query reference](#advanced-microsoft-defender-query-reference)      |
|     |         |
