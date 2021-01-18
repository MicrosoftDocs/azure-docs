---
title: Securing your system against systemic-identity compromise| Microsoft Docs
description: Learn how to use Microsoft resources to secure your system against systemic-identity compromises similar to the SolarWinds attack (Solorigate).
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
ms.date: 01/18/2021
ms.author: bagol

---

# Securing your system against systemic-identity compromise

In December 2020, a massive systemic-identity compromise was [discovered by FireEye in the SolarWinds software](https://www.fireeye.com/blog/threat-research/2020/12/evasive-attacker-leverages-solarwinds-supply-chain-compromises-with-sunburst-backdoor.html) (Solorigate).

The Solorigate attack is an example of how a systemic-identity compromise can provide attackers with a foothold into affected customer networks, which they can then use to gain elevated credentials. The attackers can use those credentials to access global administrator accounts or trusted SAML token-signing certificates. 

The global administrator account or certificates enable the attackers to forge SAML tokens that can impersonate any of the organization's existing users and accounts, including highly privileged accounts.

Providing full security coverage is a [shared responsibility](/azure/security/fundamentals/shared-responsibility). This article provides information both about the steps that Microsoft has taken to shut down the Solorigate attack and steps you can take to identify risks and evidence of compromise while hardening your system against attacks.

**Microsoft swiftly took the following steps against the Solorigate attack**:

1. **Disclosed the set of complex techniques** used by the advanced threat actor in the attack, affecting several key customers.

1. **Removed the digital certificates used by the files infected with the trojan,** causing all Windows systems to immediately stop trusting those compromised files. 

1. **Updated Microsoft 365 Defender products** to detect, alert, and immediately quarantine an infected file on the system.

1. **Sinkholed one of the domains used** for the malware's command-and-control servers.

> [!IMPORTANT]
> The Solorigate attack is an ongoing investigation, and our teams continue to act as first responders. As new information becomes available, we provide updates through the Microsoft Security Response Center (MSRC) blog at https://aka.ms/solorigate.
> 

> [!NOTE]
> If you are not sure whether your organization has been infected, we recommend that you review the indications of compromise listed in the [Azure Active Directory Identity Blog](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/bg-p/Identity) to understand about how to identify a Solorigate attack.
>
> For more information, see [Understanding "Solorigate"'s Identity IOCs - for Identity Vendors and their customers](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/understanding-quot-solorigate-quot-s-identity-iocs-for-identity/ba-p/2007610)

## Using Azure Sentinel to secure your network after a systemic-identity compromise

1. Make sure that you have the following Azure Sentinel connectors set up in order to stream a range of alerts and queries for known pattern related to the Solorigate attack:

    - [Windows security events](connect-windows-security-events.md) 
    - [Microsoft 365 Defender](connect-microsoft-365-defender.md) 
    - [Microsoft Defender for Office 365](connect-office-365-advanced-threat-protection.md) 
    - [Office 365 logs ](connect-office-365.md) 
    - [Azure Active Directory](connect-azure-active-directory.md) 
    - [Domain name server](connect-dns.md) 
 
1. Use the **SolarWinds Post Compromise Hunting** workbook to [hunt](hunting.md) for attack activity related to the Solorigate compromise. 

    In Azure Sentinel, under **Threat management** on the left, navigate to the **Workbooks** > **SolarWinds Post Compromise Hunting** workbook.

The **SolarWinds Post Compromise Hunting** workbook queries logs collected by Azure Sentinel and displays data that may indicate suspicious activity, such as:

- Suspicious sign-in events, such as where an attacker has used SAML tokens that were minted by stolen AD FS key material in order to access your environment. 

- Applications or accounts with new permissions, key credentials, and access patterns that may indicate compromise.

- Suspicious lateral movements inside your environment, which is a common element of many attacks, including Solorigate.

This workbook hunts for activity in both Microsoft Defender for Endpoint data, and data from hosts where Microsoft Defender services are not installed.

> [!TIP]
> Modify the **Hunting Timeframe** in each section to update the query results shown.    

## Using Microsoft 365 Defender resources to secure your network after a systemic-identity compromise

We recommend that Microsoft 365 Defender customers to start their investigations with the following threat analytics reports, created by Microsoft specifically for Solorigate:

- [Sophisticated actor attacks FireEye](https://security.microsoft.com/threatanalytics3/a43fc0c6-120a-40c5-a948-a9f41eef0bf9/overview) provides information about the FireEye breach and compromised red team tools
- [Solorigate supply chain attack](https://security.microsoft.com/threatanalytics3/2b74f636-146e-48dd-94f6-5cb5132467ca/overview) provides a detailed analysis of the Solorigate supply chain compromise

These reports include a deep-dive analysis, MITRE techniques, detection details, recommended actions, updated lists of IOCs, and advanced hunting techniques to expand detection coverage.

For example:

- From the **Vulnerability patching status** chart in threat analytics, view  mitigation details to see a list of devices with the vulnerability ID **TVM-2020-0002**. This vulnerability was added specifically to help with Solorigate investigations.

- Use the **Devices with alerts** chart to identify devices with malicious components or activities known to be directly related to Solorigate. 

We recommend that you review the [Incidents queue](/microsoft-365/security/mtp/investigate-incidents) to look for other relevant alerts.

> [!NOTE]
> These reports are available only to Microsoft Defender for Endpoint customers and Microsoft 365 Defender early adopters. 
> 

For more information, see: 

- [Understand the analyst report in threat analytics](/windows/security/threat-protection/microsoft-defender-atp/threat-analytics-analyst-reports)
- [Microsoft Defender Security Center Solorigate supply chain attack threat report](https://securitycenter.microsoft.com/threatanalytics3/2b74f636-146e-48dd-94f6-5cb5132467ca/overview)

## Using Azure Active Directory to secure your network after a systemic-identity compromise

In Azure Active Directory, use the **Sensitive Operations Report** to learn more about suspicious activity detected in your tenant. 

Under **Monitoring** on the left, select **Workbooks**. Then, under **Troubleshoot**, select the **Sensitive Operations Report**.

The **Sensitive Operations Report** indicates suspicious activity detected in your tenant, such as:

- New credentials added, or existing credentials modified, for existing applications and service principals, which might allow attackers to authenticate and access resources during an attack

- Changes made to existing domain federation trusts, which may help attackers gain a long-term foothold in the environment, by adding an attacker-controlled SAML IDP as a trusted authentication source.

- Manual modifications made to refresh tokens, which are used to validate identification and obtain access tokens, and can be used to by an attacker to gain persistence in the network.



## Microsoft references for Solorigate

For more information about securing your system after Solorigate, see any of the following Microsoft resources:

|Source  |Links  |
|---------|---------|
|**Microsoft On The Issues**     |[Important steps for customers to protect themselves from recent nation-state cyberattacks](https://blogs.microsoft.com/on-the-issues/2020/12/13/customers-protect-nation-state-cyberattacks/)         |
|**Microsoft Security Response Center**     |  [Solorigate Resource Center: https://aka.ms/solorigate](https://aka.ms/solorigate) <br><br>[Customer guidance on recent nation-state cyber attack](https://msrc-blog.microsoft.com/2020/12/13/customer-guidance-on-recent-nation-state-cyber-attacks/)       |
|**Azure Active Directory Identity blog**     |  [Understanding "Solorigate"'s Identity IOCs - for Identity Vendors and their customers](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/understanding-quot-solorigate-quot-s-identity-iocs-for-identity/ba-p/2007610)       |
|**TechCommunity**     |    [Azure AD workbook to help you assess Solorigate risk](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/azure-ad-workbook-to-help-you-assess-solorigate-risk/ba-p/2010718) <br><br> [SolarWinds: Post compromise hunting with Azure Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/solarwinds-post-compromise-hunting-with-azure-sentinel/ba-p/1995095)      |
|**Microsoft Security Intelligence**     |  [Malware encyclopedia definition: Solorigate](https://www.microsoft.com/en-us/wdsi/threats/malware-encyclopedia-description?Name=Trojan:MSIL/Solorigate.B!dha)       |
|**Microsoft Security blog**     |   [Analyzing Solorigate: The compromised DLL file that started a sophisticated cyberattack and how Microsoft Defender helps protect](https://www.microsoft.com/security/blog/2020/12/18/analyzing-solorigate-the-compromised-dll-file-that-started-a-sophisticated-cyberattack-and-how-microsoft-defender-helps-protect/)<br><br> [Advice for incident responders on recovery from system identity compromises](https://www.microsoft.com/security/blog/2020/12/21/advice-for-incident-responders-on-recovery-from-systemic-identity-compromises/) from the Detection and Response Team (DART) <br><br>[Using Microsoft 365 Defender to coordinate protection against Solorigate](https://www.microsoft.com/security/blog/2020/12/28/using-microsoft-365-defender-to-coordinate-protection-against-solorigate/)   <br><br>[Ensuring customers are protected from Solorigate](https://www.microsoft.com/security/blog/2020/12/15/ensuring-customers-are-protected-from-solorigate/)   |
| **GitHub resources**    |   [Azure Sentinel workbook for SolarWinds post-compromise hunting](https://github.com/Azure/Azure-Sentinel/blob/master/Workbooks/SolarWindsPostCompromiseHunting.json) <br><br>[Advanced Microsoft 365 Defender query reference](identity-compromise-defender.md#advanced-microsoft-365-defender-query-reference)      |
|     |         |


