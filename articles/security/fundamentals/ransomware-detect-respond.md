---
title: Detect and respond to ransomware attacks
description: Detect and respond to ransomware attacks
author: msmbaldwin
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.author: mbaldwin
ms.date: 01/10/2022

---

# Detect and respond to ransomware attacks

There are several potential triggers that may indicate a ransomware incident.  Unlike many other types of malware, most will be higher-confidence triggers (where little additional investigation or analysis should be required prior to the declaration of an incident) rather than lower-confidence triggers (where more investigation or analysis would likely be required before an incident should be declared).  

In general, such infections obvious from basic system behavior, the absence of key system or user files and the demand for ransom.  In this case, the analyst should consider whether to immediately declare and escalate the incident, including taking any automated actions to mitigate the attack. 

## Detecting ransomware attacks

Microsoft Defender for Cloud provides high-quality threat detection and response capabilities, also called Extended Detection and Response (XDR).

Ensure rapid detection and remediation of common attacks on VMs, SQL Servers, Web applications, and identity.

- **Prioritize Common Entry Points** – Ransomware (and other) operators favor Endpoint/Email/Identity + Remote Desktop Protocol (RDP)
  - **Integrated XDR** - Use integrated Extended Detection and Response (XDR) tools like Microsoft [Defender for Cloud](https://azure.microsoft.com/services/azure-defender/) to provide high quality alerts and minimize friction and manual steps during response
  - **Brute Force** - Monitor for brute-force attempts like [password spray](/defender-for-identity/compromised-credentials-alerts)
- **Monitor for Adversary Disabling Security** – as this is often part of Human Operated Ransomware (HumOR) attack chain
  - **Event Logs Clearing** – especially the Security Event log and PowerShell Operational logs
  - **Disabling of security tools/controls** (associated with some groups)
- **Don't Ignore Commodity Malware** - Ransomware attackers regularly purchase access to target organizations from dark markets
- **Integrate outside experts** – into processes to supplement expertise, such as the [Microsoft Detection and Response Team (DART)](https://aka.ms/dart).
- **Rapidly isolate** compromised computers using [Defender for Endpoint](/windows/security/threat-protection/microsoft-defender-atp/respond-machine-alerts#isolate-devices-from-the-network) in on-premises deployment.

## Responding to ransomware attacks

### Incident declaration

Once a successful ransomware infection has been confirmed, the analyst should verify this represents a new incident or whether it may be related to an existing incident.  Look for currently-open tickets that indicate similar incidents.  If so, update the current incident ticket with new information in the ticketing system. If this is a new incident, an incident should be declared in the relevant ticketing system and escalated to the appropriate teams or providers to contain and mitigate the incident.  Be mindful that managing ransomware incidents may require actions taken by multiple IT and security teams.  Where possible, ensure that the ticket is clearly identified as a ransomware incident to guide workflow.

### Containment/Mitigation

In general, various server/endpoint antimalware, email antimalware and network protection solutions should be configured to automatically contain and mitigate known ransomware.  There may be cases, however, where the specific ransomware variant has been able to bypass such protections and successfully infect target systems.
 
Microsoft provides extensive resources to help update your incident response processes on the [Top Azure Security Best Practices](/azure/cloud-adoption-framework/secure/security-top-10#4-process-update-incident-response-processes-for-cloud).

The following are recommended actions to contain or mitigate a declared incident involving ransomware where automated actions taken by antimalware systems have been unsuccessful:

1. Engage antimalware vendors through standard support processes
1. Manually add hashes and other information associated with malware to antimalware systems  
1. Apply antimalware vendor updates
1. Contain affected systems until they can be remediated 
1. Disable compromised accounts
1. Perform root cause analysis
1. Apply relevant patches and configuration changes on affected systems  
1. Block ransomware communications using internal and external controls
1. Purge cached content

## Road to recovery

The Microsoft Detection and Response Team will help protect you from attacks

Understanding and fixing the fundamental security issues that led to the compromise in the first place should be a priority for ransomware victims.

Integrate outside experts into processes to supplement expertise, such as the [Microsoft Detection and Response Team (DART)](https://aka.ms/dart). The DART engages with customers around the world, helping to protect and harden against attacks before they occur, as well as investigating and remediating when an attack has occurred.

Customers can engage our security experts directly from within the Microsoft Defender Portal for timely and accurate response. Experts provide insights needed to better understand the complex threats affecting your organization, from alert inquiries, potentially compromised devices, root cause of a suspicious network connection, to additional threat intelligence regarding ongoing advanced persistent threat campaigns.

Microsoft is ready to assist your company in returning to safe operations.

Microsoft performs hundreds of compromise recoveries and has a tried-and-true methodology. Not only will it get you to a more secure position, it affords you the opportunity to consider your long-term strategy rather than reacting to the situation. 

Microsoft provides Rapid Ransomware Recovery services. Under this, assistance is provided in all areas such as restoration of identity services, remediation and hardening and with monitoring deployment to help victims of ransomware attacks to return to normal business in the shortest possible timeframe.

Our Rapid Ransomware Recovery services are treated as "Confidential" for the duration of the engagement. Rapid Ransomware Recovery engagements are exclusively delivered by the Compromise Recovery Security Practice (CRSP) team, part of the Azure Cloud & AI Domain. For more information, you can contact CRSP at [Request contact about Azure security](https://azure.microsoft.com/overview/meet-with-an-azure-specialist/). 

## What's next

See the white paper: [Azure defenses for ransomware attack whitepaper](https://azure.microsoft.com/resources/azure-defenses-for-ransomware-attack).

Other articles in this series:

- [Ransomware protection in Azure](ransomware-protection.md)
- [Prepare for a ransomware attack](ransomware-prepare.md)
- [Azure features and resources that help you protect, detect, and respond](ransomware-features-resources.md)
