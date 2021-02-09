---
title: Securing your system against systemic-identity compromise | Microsoft Docs
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
ms.date: 02/04/2021
ms.author: bagol

---

# Securing your system against systemic-identity compromise

In December 2020, a massive systemic-identity compromise was [discovered by FireEye in the SolarWinds software](https://www.fireeye.com/blog/threat-research/2020/12/evasive-attacker-leverages-solarwinds-supply-chain-compromises-with-sunburst-backdoor.html) (Solorigate).

The Solorigate attack is an example of how a systemic-identity compromise can provide attackers with a foothold into affected customer networks, which they can then use to gain elevated credentials. The attackers can use those credentials to access global administrator accounts or trusted SAML token-signing certificates. 

The global administrator account or certificates enable the attackers to forge SAML tokens that can impersonate any of the organization's existing users and accounts, including highly privileged accounts.

Providing full security coverage is a [shared responsibility](/azure/security/fundamentals/shared-responsibility). This article provides information both about the steps that Microsoft has taken to shut down the Solorigate attack and steps you can take to identify risks and evidence of compromise while hardening your system against attacks.

**Microsoft swiftly took the following steps against the Solorigate attack**:

- **Disclosed the set of complex techniques** used by the advanced threat actor in the attack, affecting several key customers.

-  **Removed the digital certificates used by the files infected with the trojan,** causing all Windows systems to immediately stop trusting those compromised files. 

- **Updated Azure Sentinel detections and hunting queries, and added a new workbook** to detect and alert for infected files on the system.

- **Updated Microsoft 365 Defender products** to detect, alert, and immediately quarantine an infected file on the system.
 
- **Sinkholed one of the domains used** for the malware's command-and-control servers.

> [!IMPORTANT]
> The Solorigate attack is an ongoing investigation, and our teams continue to act as first responders. As new information becomes available, we provide updates through the Microsoft Security Response Center (MSRC) blog at https://aka.ms/solorigate.
> 

> [!NOTE]
> If you are not sure whether your organization has been affected, we recommend that you review the indicators of compromise listed in the [Azure Active Directory Identity Blog](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/bg-p/Identity) to understand about how to identify a Solorigate attack.
>
> For more information, see [Understanding "Solorigate"'s Identity IOCs - for Identity Vendors and their customers](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/understanding-quot-solorigate-quot-s-identity-iocs-for-identity/ba-p/2007610)

## Using Azure Sentinel to respond to a systemic-identity compromise

1. Make sure that you have the following Azure Sentinel connectors set up in order to stream a range of alerts and queries for known patterns related to the Solorigate attack:

    - [Windows security events](connect-windows-security-events.md) 
    - [Microsoft 365 Defender](connect-microsoft-365-defender.md) 
    - [Microsoft Defender for Office 365](connect-office-365-advanced-threat-protection.md) 
    - [Office 365 logs ](connect-office-365.md) 
    - [Azure Active Directory](connect-azure-active-directory.md) 
    - [Domain name server](connect-dns.md) 
 
1. Use the **SolarWinds Post Compromise Hunting** workbook to [hunt](hunting.md) for attack activity related to the Solorigate compromise. 

    In Azure Sentinel, under **Threat management** on the left, navigate to the **Workbooks** and search for the **SolarWinds Post Compromise Hunting** workbook.

    For more information, see our blog, [SolarWinds: Post compromise hunting with Azure Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/solarwinds-post-compromise-hunting-with-azure-sentinel/ba-p/1995095). This blog contains references to more hunting queries that you can use when responding to the Solorigate attack.

The **SolarWinds Post Compromise Hunting** workbook queries logs collected by Azure Sentinel and displays data that may indicate suspicious activity, such as:

- Suspicious sign-in events, such as where an attacker has used SAML tokens that were minted by stolen AD FS key material in order to access your environment. 

- Applications or accounts with new permissions, key credentials, and access patterns that may indicate compromise.

- Suspicious lateral movements inside your environment, which is a common element of many attacks, including Solorigate.

> [!TIP]
> Modify the **Hunting Timeframe** in each section to update the query results shown.    

## Using Microsoft 365 Defender resources to secure your network after a systemic-identity compromise

We recommend that Microsoft 365 Defender customers to start their investigations with the following threat analytics reports, created by Microsoft specifically for Solorigate:

- [Sophisticated actor attacks FireEye](https://security.microsoft.com/threatanalytics3/a43fc0c6-120a-40c5-a948-a9f41eef0bf9/overview) provides information about the FireEye breach and compromised red team tools

- [Solorigate supply chain attack](https://security.microsoft.com/threatanalytics3/2b74f636-146e-48dd-94f6-5cb5132467ca/overview) provides a detailed analysis of the Solorigate supply chain compromise

- [CVE-2020-10148 leads to trojanized SolarWinds binary](https://securitycenter.microsoft.com/threatanalytics3/8780a140-321f-4cac-8013-2f7b998ff9f3/overview) provides information around the webshell embedded in the legitimate SolarWinds dynamic-link library (DLL). The malicious DLL file is dubbed as SUPERNOVA by industry researchers.

- [The Solorigate missing link](https://securitycenter.windows.com/threatanalytics3/e26c0cf9-6e53-4e07-8bc7-6120c9dd4393/overview) provides information around the Solorigate backdoor malware, and the hands-on-keyboard techniques that attackers employed on compromised endpoints using a powerful second-stage payload. These payloads include several custom Cobalt Strike loaders, the loader dubbed TEARDROP by FireEye, and a variant named Raindrop by Symantec.

These reports include a deep-dive analysis, MITRE techniques, detection details, recommended actions, updated lists of IOCs, and advanced hunting techniques to expand detection coverage.

For example:

- From the **Vulnerability patching status** chart in threat analytics, view  mitigation details to see a list of devices with the vulnerability ID **TVM-2020-0002**. This vulnerability was added specifically to help with Solorigate investigations.

- Use the **Devices with alerts** chart to identify devices with malicious components or activities known to be directly related to Solorigate. 

We recommend that you review the [Incidents queue](/microsoft-365/security/mtp/investigate-incidents) to look for other relevant alerts.

For more information, see: 

- [Track and respond to emerging threats with threat analytics](https://docs.microsoft.com/windows/security/threat-protection/microsoft-defender-atp/threat-analytics)
- [Understand the analyst report in threat analytics](/windows/security/threat-protection/microsoft-defender-atp/threat-analytics-analyst-reports)


> [!NOTE]
> These reports are available only to Microsoft Defender for Endpoint customers and Microsoft 365 Defender early adopters. 
> 

## Using Azure Active Directory to secure your network after a systemic-identity compromise

Use Azure Active Directory services to protect and defend your network by performing the following steps in your system:

1. [Enable multi-factor authentication (MFA)](/azure/active-directory/authentication/concept-mfa-howitworks) to reduce the probability of account compromise in your system.

1. Configure your system for Zero Trust. For more information, see the Microsoft [Zero Trust Deployment Guides](/security/zero-trust/).

1. In Azure Active Directory, use the **Sensitive Operations Report** to learn more about suspicious activity detected in your tenant. 

    Under **Monitoring** on the left, select **Workbooks**. Then, under **Troubleshoot**, select the **Sensitive Operations Report**.

The **Sensitive Operations Report** indicates suspicious activity detected in your tenant, such as:

- New credentials added, or existing credentials modified, for existing applications and service principals, which might allow attackers to authenticate and access resources during an attack

- Changes made to existing domain federation trusts, which may help attackers gain a long-term foothold in the environment, by adding an attacker-controlled SAML IDP as a trusted authentication source.

- Manual modifications made to refresh tokens, which are used to validate identification and obtain access tokens, and can be used to by an attacker to gain persistence in the network.

For more information, see [Active Directory best practices](/azure/active-directory/develop/identity-platform-integration-checklist) and [Blocking legacy authentication](/azure/active-directory/fundamentals/concept-fundamentals-block-legacy-authentication) in the Azure Active Directory documentation.
## Microsoft references for Solorigate

For more information about securing your system after Solorigate, see any of the following Microsoft resources:

|Source  |Links  |
|---------|---------|
|**Microsoft On The Issues**     |[Important steps for customers to protect themselves from recent nation-state cyberattacks](https://blogs.microsoft.com/on-the-issues/2020/12/13/customers-protect-nation-state-cyberattacks/) <br><br>[A moment of reckoning: the need for a strong and global cybersecurity response](https://blogs.microsoft.com/on-the-issues/2020/12/17/cyberattacks-cybersecurity-solarwinds-fireeye/)         |
|**Microsoft Security Response Center**     |  [Solorigate Resource Center: https://aka.ms/solorigate](https://aka.ms/solorigate) <br><br>[Customer guidance on recent nation-state cyber attack](https://msrc-blog.microsoft.com/2020/12/13/customer-guidance-on-recent-nation-state-cyber-attacks/)       |
|**Azure Active Directory Identity blog**     |  [Understanding "Solorigate"'s Identity IOCs - for Identity Vendors and their customers](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/understanding-quot-solorigate-quot-s-identity-iocs-for-identity/ba-p/2007610)       |
|**TechCommunity**     |    [Azure AD workbook to help you assess Solorigate risk](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/azure-ad-workbook-to-help-you-assess-solorigate-risk/ba-p/2010718) <br><br> [SolarWinds: Post compromise hunting with Azure Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/solarwinds-post-compromise-hunting-with-azure-sentinel/ba-p/1995095)   <br><br>[Latest Threat Intelligence (15 December, 2020) - FireEye and SolarWinds Events](https://techcommunity.microsoft.com/t5/iot-security/latest-threat-intelligence-15-december-2020-fireeye-and/m-p/1999394) <br><br>[Protecting Microsoft 365 from on-premises attacks](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/protecting-microsoft-365-from-on-premises-attacks/ba-p/1751754) <br><br>[Understanding "Solorigate"'s Identity IOCs - for Identity Vendors and their customers](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/understanding-quot-solorigate-quot-s-identity-iocs-for-identity/ba-p/2007610) |
|**Microsoft Security Intelligence**     |  [Malware encyclopedia definition: Solorigate](https://www.microsoft.com/en-us/wdsi/threats/malware-encyclopedia-description?Name=Trojan:MSIL/Solorigate.B!dha)       |
|**Microsoft Security blog**     |   [Analyzing Solorigate: The compromised DLL file that started a sophisticated cyberattack and how Microsoft Defender helps protect](https://www.microsoft.com/security/blog/2020/12/18/analyzing-solorigate-the-compromised-dll-file-that-started-a-sophisticated-cyberattack-and-how-microsoft-defender-helps-protect/)<br><br> [Advice for incident responders on recovery from system identity compromises](https://www.microsoft.com/security/blog/2020/12/21/advice-for-incident-responders-on-recovery-from-systemic-identity-compromises/) from the Detection and Response Team (DART) <br><br>[Using Microsoft 365 Defender to coordinate protection against Solorigate](https://www.microsoft.com/security/blog/2020/12/28/using-microsoft-365-defender-to-coordinate-protection-against-solorigate/)   <br><br>[Ensuring customers are protected from Solorigate](https://www.microsoft.com/security/blog/2020/12/15/ensuring-customers-are-protected-from-solorigate/)  <br><br>[Using Zero Trust principles to protect against sophisticated attacks like Solorigate](https://www.microsoft.com/security/blog/2021/01/19/using-zero-trust-principles-to-protect-against-sophisticated-attacks-like-solorigate/) <br><br>[Deep dive into the Solorigate second-stage activation: From SUNBURST to TEARDROP and Raindrop](https://www.microsoft.com/security/blog/2021/01/20/deep-dive-into-the-solorigate-second-stage-activation-from-sunburst-to-teardrop-and-raindrop/) <br><br>[Increasing resilience against Solorigate and other sophisticated attacks with Microsoft Defender](https://www.microsoft.com/security/blog/2021/01/14/increasing-resilience-against-solorigate-and-other-sophisticated-attacks-with-microsoft-defender/) |
| **GitHub resources**    |   [Azure Sentinel workbook for SolarWinds post-compromise hunting](https://github.com/Azure/Azure-Sentinel/blob/master/Workbooks/SolarWindsPostCompromiseHunting.json) <br><br>[Advanced Microsoft 365 Defender query reference](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries)      |
|  **Microsoft docs**   | [Best practices for securing privileged access](/security/compass/overview) <br><br>[Best practices for human operated ransomware](/security/compass/human-operated-ransomware)   <br><br>[Search the audit log in the Microsoft 365 compliance center](/microsoft-365/compliance/search-the-audit-log-in-security-and-compliance) <br><br>[Track and respond to emerging threats with threat analytics](/windows/security/threat-protection/microsoft-defender-atp/threat-analytics) <br><br> [Understand the analyst report in threat analytics](/windows/security/threat-protection/microsoft-defender-atp/threat-analytics-analyst-reports) <br><br>[Zero Trust Deployment Guides](/security/zero-trust/) <br><br>[Active Directory best practices](/azure/active-directory/develop/identity-platform-integration-checklist) <br><br> [Blocking legacy authentication](/azure/active-directory/fundamentals/concept-fundamentals-block-legacy-authentication)  |
| | |

