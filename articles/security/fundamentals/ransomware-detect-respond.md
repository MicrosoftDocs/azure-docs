---
title: Detect and respond to ransomware attacks
description: Learn Azure-specific guidance for detecting, responding to, and recovering from ransomware attacks in cloud environments.
author: msmbaldwin
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.author: mbaldwin
ai-usage: ai-assisted
ms.date: 07/21/2026

---

# Detect and respond to ransomware attacks

This article provides Azure-specific guidance for detecting and responding to ransomware attacks.

> [!TIP]
> This article focuses on Azure-specific detection and response. For comprehensive guidance, see [Protect your organization against ransomware and extortion](/security/ransomware/protect-against-ransomware).

Ransomware incidents typically present with distinct warning signs that security teams can identify. Unlike other malware types, ransomware usually produces highly evident indicators that require minimal investigation before declaring an incident. These high-confidence triggers stand in contrast to more subtle threats that would demand extensive analysis before escalation. When ransomware strikes, the evidence is often unmistakable.

## Detecting ransomware attacks

Microsoft Defender for Cloud provides high-quality threat detection and response capabilities for Azure resources, also called Extended Detection and Response (XDR).

Ensure rapid detection and remediation of common attacks on Azure VMs, SQL servers, web applications, and identity in your Azure environment.

- **Prioritize common entry points**: Ransomware operators favor endpoint, email, identity, and Remote Desktop Protocol (RDP) entry points.
  - **Integrated XDR**: Use integrated Extended Detection and Response (XDR) tools like [Microsoft Defender for Cloud](/azure/defender-for-cloud/) to provide high-quality alerts for Azure resources and minimize friction and manual steps during response.
  - **Brute force**: Monitor for brute-force attempts like [password spray](/defender-for-identity/compromised-credentials-alerts) against Azure resources.
- **Monitor for adversary disabling security**: Adversaries often disable security as part of the human-operated ransomware attack chain.
- **Monitor event log clearing**: Monitor Security event log and PowerShell operational log clearing on Azure VMs.
  - **Disabling security tools and controls**: Monitor for disabling of security tools and controls associated with some groups.
- **Don't ignore commodity malware**: Ransomware attackers regularly purchase access to target organizations from dark markets.
- **Integrate outside experts**: Integrate outside experts into processes to supplement expertise, such as the [Microsoft Incident Response team](https://aka.ms/dart).
- **Rapidly isolate compromised Azure VMs**: Rapidly isolate compromised Azure VMs by using [Defender for Endpoint](/windows/security/threat-protection/microsoft-defender-atp/respond-machine-alerts#isolate-devices-from-the-network).

## Responding to ransomware attacks

### Incident declaration

After a successful ransomware infection is confirmed, the analyst should verify whether it represents a new incident or might be related to an existing incident. Look for currently open tickets that indicate similar incidents. If so, update the current incident ticket with new information in the ticketing system. If it's a new incident, declare an incident in the relevant ticketing system and escalate it to the appropriate teams or providers to contain and mitigate the incident. Managing ransomware incidents might require actions by multiple IT and security teams. Where possible, ensure that the ticket clearly identifies the incident as ransomware to guide workflow.

### Containment and mitigation

In general, configure various server or endpoint antimalware, email antimalware, and network protection solutions to automatically contain and mitigate known ransomware. Specific ransomware variants might bypass these protections and successfully infect target systems.

Microsoft provides extensive resources to help update your incident response processes on the [Top Azure Security Best Practices](/azure/cloud-adoption-framework/secure/security-top-10#4-process-update-incident-response-processes-for-cloud).

Take the following recommended actions to contain or mitigate a declared incident involving ransomware where automated actions taken by antimalware systems are unsuccessful:

1. Engage antimalware vendors through standard support processes.
1. Manually add hashes and other information associated with malware to antimalware systems.
1. Apply antimalware vendor updates.
1. Contain affected systems until you remediate them.
1. Disable compromised accounts.
1. Perform root cause analysis.
1. Apply relevant patches and configuration changes on affected systems.
1. Block ransomware communications by using internal and external controls.
1. Purge cached content.

## Road to recovery

The Microsoft Incident Response team helps protect you from attacks.

Understanding and fixing the fundamental security problems that led to the compromise should be a priority for ransomware targets.

Integrate outside experts into processes to supplement expertise, such as [Microsoft Incident Response](https://aka.ms/dart). Microsoft Incident Response engages with organizations around the world, helps protect and harden Azure environments against attacks before they occur, and investigates and remediates attacks when they occur.

You can engage Microsoft security experts directly from the Microsoft Defender portal for timely and accurate response. Experts provide insights needed to better understand the complex threats affecting your organization, from alert inquiries, potentially compromised devices, and the root cause of a suspicious network connection to extra threat intelligence about ongoing advanced persistent threat campaigns.

Microsoft is ready to assist your company in returning to safe operations.

Microsoft performs hundreds of compromise recoveries and has a tried-and-true methodology. The methodology helps you reach a more secure position and consider your long-term strategy rather than only reacting to the situation.

Microsoft provides Rapid Ransomware Recovery services. These services provide assistance in areas such as restoration of identity services, remediation and hardening, and monitoring deployment to help targets of ransomware attacks return to normal business in the shortest possible timeframe.

Microsoft treats Rapid Ransomware Recovery services as confidential for the duration of the engagement. The Microsoft Incident Response team exclusively delivers Rapid Ransomware Recovery engagements. For more information, contact [Microsoft Incident Response](https://aka.ms/dart).

## What's next

For comprehensive ransomware protection guidance across all Microsoft platforms and services, see [Protect your organization against ransomware and extortion](/security/ransomware/protect-against-ransomware).

Other Azure ransomware articles:

- [Ransomware protection in Azure](ransomware-protection.md)
- [Prepare for a ransomware attack](ransomware-prepare.md)
- [Azure features and resources that help you protect, detect, and respond](ransomware-features-resources.md)
- [Improve your security defenses for ransomware attacks with Azure Firewall Premium](ransomware-protection-with-azure-firewall.md)
