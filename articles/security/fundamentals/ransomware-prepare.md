---
title: Prepare for a ransomware attack
description: Prepare for a ransomware attack
author: msmbaldwin
ms.service: security
ms.subservice: security-fundamentals
ms.custom: ignite-2022
ms.topic: article
ms.author: mbaldwin
ms.date: 01/10/2022
---

# Prepare for a ransomware attack

## Adopt a Cybersecurity framework

A good place to start is to adopt the [Microsoft cloud security benchmark](/security/benchmark/azure) (MCSB) to secure the Azure environment. The Microsoft cloud security benchmark is the Azure security control framework, based on industry-based security control frameworks such as NIST SP800-53, CIS Controls v7.1.

:::image type="content" source="./media/ransomware/ransomware-13.png" alt-text="Screenshot of the NS-1: Establish Network Segmentation Boundaries security control":::

The Microsoft cloud security benchmark provides organizations guidance on how to configure Azure and Azure Services and implement the security controls. Organizations can use [Microsoft Defender for Cloud](../../defender-for-cloud/index.yml) to monitor their live Azure environment status with all the MCSB controls.

Ultimately, the Framework is aimed at reducing and better managing cybersecurity risks.

| Microsoft cloud security benchmark stack |
|--|
| [Network&nbsp;security&nbsp;(NS)](/security/benchmark/azure/mcsb-network-security) |
| [Identity&nbsp;Management&nbsp;(IM)](/security/benchmark/azure/mcsb-identity-management) |
| [Privileged&nbsp;Access&nbsp;(PA)](/security/benchmark/azure/mcsb-privileged-access) |
| [Data&nbsp;Protection&nbsp;(DP)](/security/benchmark/azure/mcsb-data-protection) |
| [Asset&nbsp;Management&nbsp;(AM)](/security/benchmark/azure/mcsb-asset-management) |
| [Logging&nbsp;and&nbsp;Threat&nbsp;Detection (LT)](/security/benchmark/azure/security-controls-v2-logging-threat-detection) |
| [Incident&nbsp;Response&nbsp;(IR)](/security/benchmark/azure/mcsb-incident-response) |
| [Posture&nbsp;and&nbsp;Vulnerability&nbsp;Management&nbsp;(PV)](/security/benchmark/azure/mcsb-posture-vulnerability-management) |
| [Endpoint&nbsp;Security&nbsp;(ES)](/security/benchmark/azure/mcsb-endpoint-security) |
| [Backup&nbsp;and&nbsp;Recovery&nbsp;(BR)](/security/benchmark/azure/mcsb-backup-recovery) |
| [DevOps&nbsp;Security&nbsp;(DS)](/security/benchmark/azure/mcsb-devops-security) |
| [Governance&nbsp;and&nbsp;Strategy&nbsp;(GS)](/security/benchmark/azure/mcsb-governance-strategy) |

## Prioritize mitigation

Based on our experience with ransomware attacks, we've found that prioritization should focus on: 1) prepare, 2) limit, 3) prevent. This may seem counterintuitive, since most people want to prevent an attack and move on. Unfortunately, we must assume breach (a key Zero Trust principle) and focus on reliably mitigating the most damage first. This prioritization is critical because of the high likelihood of a worst-case scenario with ransomware. While it's not a pleasant truth to accept, we're facing creative and motivated human attackers who are adept at finding a way to control the complex real-world environments in which we operate. Against that reality, it's important to prepare for the worst and establish frameworks to contain and prevent attackers' ability to get what they're after.

While these priorities should govern what to do first, we encourage organizations to run as many steps in parallel as possible (including pulling quick wins forward from step 1 whenever you can).

## Make it harder to get in

Prevent a ransomware attacker from entering your environment and rapidly respond to incidents to remove attacker access before they can steal and encrypt data. This will cause attackers to fail earlier and more often, undermining the profit of their attacks. While prevention is the preferred outcome, it is a continuous journey and may not be possible to achieve 100% prevention  and rapid response across a real-world organizations (complex multi-platform and multi-cloud estate with distributed IT responsibilities).

To achieve this, organizations should identify and execute quick wins to strengthen  security controls to prevent entry and rapidly detect/evict attackers while implementing a sustained program that helps them stay secure. Microsoft recommends organizations follow the principles outlined in the Zero Trust strategy [here](https://aka.ms/zerotrust). Specifically, against Ransomware, organizations should prioritize:
- Improving security hygiene by focusing efforts on attack surface reduction and threat and vulnerability management for assets in their estate. 
- Implementing Protection, Detection and Response controls for their digital assets that can protect against commodity and advanced threats, provide visibility and alerting on attacker activity and respond to active threats. 

## Limit scope of damage

Ensure you have strong controls (prevent, detect, respond) for privileged accounts like IT Admins and other roles with control of business-critical systems. This slows and/or blocks attackers from gaining complete access to your resources to steal and encrypt them. Taking away the attackers' ability to use IT Admin accounts as a shortcut to resources will drastically lower the chances they are successful at attacking you and demanding payment / profiting.

Organizations should have elevated security for privileged accounts (tightly protect, closely monitor, and rapidly respond to incidents related to these roles). See Microsoft's [Security rapid modernization plan](/security/compass/security-rapid-modernization-plan), which covers:
- End to End Session Security (including multifactor authentication (MFA) for admins)
- Protect and Monitor Identity Systems
- Mitigate Lateral Traversal
- Rapid Threat Response

## Prepare for the worst

Plan for the worst-case scenario and expect that it will happen (at all levels of the organization). This will both help your organization and others in the world you depend on:

- Limits damage for the worst-case scenario – While restoring all systems from backups is highly disruptive to business, this is more effective and efficient than trying to recovery using (low quality) attacker-provided decryption tools after paying to get the key. Note: Paying is an uncertain path – You have no formal or legal guarantee that the key works on all files, the tools work will work effectively, or that the attacker (who may be an amateur affiliate using a professional's toolkit) will act in good faith.
- Limit the financial return for attackers – If an organization can restore business operations without paying the attackers, the attack has effectively failed and resulted in zero return on investment (ROI) for the attackers. This makes it less likely that they will target the organization in the future (and deprives them of additional funding to attack others). 

The attackers may still attempt to extort the organization through data disclosure or abusing/selling the stolen data, but this gives them less leverage than if they have the only access path to your data and systems.

To realize this, organizations should ensure they:
- Register Risk - Add ransomware to risk register as high likelihood and high impact scenario. Track mitigation status via Enterprise Risk Management (ERM) assessment cycle.
- Define and Backup Critical Business Assets – Define systems required for critical business operations and automatically back them up on a regular schedule (including correct backup of critical dependencies like Active Directory)
Protect backups against deliberate erasure and encryption with offline storage, immutable storage, and/or out of band steps (MFA or PIN) before modifying/erasing online backups.
- Test 'Recover from Zero' Scenario – test to ensure your business continuity / disaster recovery (BC/DR) can rapidly bring critical business operations online from zero functionality (all systems down). Conduct practice exercise(s) to validate cross-team processes and technical procedures, including out-of-band employee and customer communications (assume all email/chat/etc. is down).  
  It is critical to protect (or print) supporting documents and systems required for recovery including restoration procedure documents, CMDBs, network diagrams, SolarWinds instances, etc. Attackers destroy these regularly.
- Reduce on-premises exposure – by moving data to cloud services with automatic backup & self-service rollback.

## Promote awareness and ensure there is no knowledge gap

There are a number of activities that may be undertaken to prepare for potential ransomware incidents.

### Educate end users on the dangers of ransomware

As most ransomware variants rely on end-users to install the ransomware or connect to compromised Web sites, all end users should be educated about the dangers.  This would typically be part of annual security awareness training as well as ad hoc training available through the company's learning management systems.  The awareness training should also extend to the company's customers via the company's portals or other appropriate channels.

### Educate security operations center (SOC) analysts and others on how to respond to ransomware incidents

SOC analysts and others involved in ransomware incidents should know the fundamentals of malicious software and ransomware specifically.  They should be aware of major variants/families of ransomware, along with some of their typical characteristics.  Customer call center staff should also be aware of how to handle ransomware reports from the company's end users and customers.

## Ensure that you have appropriate technical controls in place

There are a wide variety of technical controls that should be in place to protect, detect, and respond to ransomware incidents with a strong emphasis on prevention.  At a minimum, SOC analysts should have access to the telemetry generated by antimalware systems in the company, understand what preventive measures are in place, understand the infrastructure targeted by ransomware, and be able to assist the company teams to take appropriate action.
 
This should include some or all of the following essential tools: 

- Detective and preventive tools
  - Enterprise server antimalware product suites (such as Microsoft Defender for Cloud)
  - Network antimalware solutions (such as Azure Anti-malware)
  - Security data analytics platforms (such as Azure Monitor, Sentinel)
  - Next generation intrusion detection and prevention systems 
  - Next generation firewall (NGFW)

- Malware analysis and response toolkits
  - Automated malware analysis systems with support for most major end-user and server operating systems in the organization
  - Static and dynamic malware analysis tools 
  - Digital forensics software and hardware
  - Non- Organizational Internet access (for example, 4G dongle)
  - For maximum effectiveness, SOC analysts should have extensive access to almost all antimalware platforms through their native interfaces in addition to unified telemetry within the security data analysis platforms.  The platform for Azure native Antimalware for Azure Cloud Services and Virtual Machines provides step-by-step guides on how to accomplish this.
  - Enrichment and intelligence sources
  - Online and offline threat and malware intelligence sources (such as sentinel, Azure Network Watcher)
  - Active directory and other authentication systems (and related logs)
 - Internal Configuration Management Databases (CMDBs) containing endpoint device info

- Data protection 
  - Implement data protection to ensure rapid and reliable recovery from a ransomware attack + block some techniques.
  - Designate Protected Folders – to make it more difficult for unauthorized applications to modify the data in these folders. 
  - Review Permissions – to reduce risk from broad access enabling ransomware
  - Discover broad write/delete permissions on fileshares, SharePoint, and other solutions
  - Reduce broad permissions while meeting business collaboration requirements
  - Audit and monitor to ensure broad permissions don't reappear
  - Secure backups 
  - Ensure critical systems are backed up and backups are protected against deliberate attacker erasure/encryption.
  - Back up all critical systems automatically on a regular schedule
  - Ensure Rapid Recovery of business operations by regularly exercising business continuity / disaster recovery (BC/DR) plan
  - Protect backups against deliberate erasure and encryption
  - Strong Protection – Require out of band steps (like MUA/MFA) before modifying online backups such as Azure Backup
  - Strongest Protection – Isolate backups from online/production workloads to enhance the protection of backup data.
  - Protect supporting documents required for recovery such as restoration procedure documents, CMDB, and network diagrams

## Establish an incident handling process

Ensure your organization undertakes a number of activities roughly following the incident response steps and guidance described in the US National Institute of Standards and Technology (NIST) Computer Security Incident Handling Guide (Special Publication 800-61r2) to prepare for potential ransomware incidents.  These steps include:

1. **Preparation**:  This stage describes the various measures that should be put into place prior to an incident.  This may include both technical preparations (such as the implementation of suitable security controls and other technologies) and non-technical preparations (such as the preparation of processes and procedures).
1. **Triggers / Detection**:  This stage describes how this type of incident may be detected and what triggers may be available that should be used to initiate either further investigation or the declaration of an incident.  These are generally separated into high-confidence and low-confidence triggers.
1. **Investigation / Analysis**:  This stage describes the activities that should be undertaken to investigate and analyze available data when it isn’t clear that an incident has occurred, with the goal of either confirming that an incident should be declared or concluded that an incident hasn't occurred.
1. **Incident Declaration**:  This stage covers the steps that must be taken to declare an incident, typically with the raising of a ticket within the enterprise incident management (ticketing) system and directing the ticket to the appropriate personnel for further evaluation and action.
1. **Containment / Mitigation**:  This stage covers the steps that may be taken either by the Security Operations Center (SOC), or by others, to contain or mitigate (stop) the incident from continuing to occur or limiting the effect of the incident using available tools, techniques, and procedures.
1. **Remediation / Recovery**:  This stage covers the steps that may be taken to remediate or recover from damage that was caused by the incident before it was contained and mitigated.
1. **Post-Incident Activity**:  This stage covers the activities that should be performed once the incident has been closed.  This can include capturing the final narrative associated with the incident as well as identifying lessons learned.

:::image type="content" source="./media/ransomware/ransomware-17.png" alt-text="Flowchart of an incident handling process":::

## Prepare for a quick recovery

Ensure that you have appropriate processes and procedures in place. Almost all ransomware incidents result in the need to restore compromised systems. So appropriate and tested backup and restore processes and procedures should be in place for most systems.  There should also be suitable containment strategies in place with suitable procedures to stop ransomware from spreading and recovery from ransomware attacks. 

Ensure that you have well-documented procedures for engaging any third-party support, particularly support from threat intelligence providers, antimalware solution providers and from the malware analysis provider.  These contacts may be useful if the ransomware variant may have known weaknesses or decryption tools may be available.

The Azure platform provides backup and recovery options through Azure Backup as well built-in within various data services and workloads. 

Isolated backups with [Azure Backup](../../backup/backup-azure-security-feature.md#prevent-attacks)
- Azure Virtual Machines
- Databases in Azure VMs: SQL, SAP HANA
- Azure Database for PostgreSQL
- On-prem Windows Servers (back up to cloud using MARS agent)

Local (operational) backups with Azure Backup
- Azure Files
- Azure Blobs
- Azure Disks

Built-in backups from Azure services
- Data services like Azure Databases (SQL, MySQL, MariaDB, PostgreSQL), Azure Cosmos DB, and ANF offer built-in backup capabilities

## What's Next

See the white paper: [Azure defenses for ransomware attack whitepaper](https://azure.microsoft.com/resources/azure-defenses-for-ransomware-attack).

Other articles in this series:

- [Ransomware protection in Azure](ransomware-protection.md)
- [Detect and respond to ransomware attack](ransomware-detect-respond.md)
- [Azure features and resources that help you protect, detect, and respond](ransomware-features-resources.md)
