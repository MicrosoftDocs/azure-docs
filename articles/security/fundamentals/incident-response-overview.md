---
title: Incident response overview for Azure - Microsoft Azure
description: Understand how to respond to security incidents in Azure environments using Microsoft security services and best practices.
services: security
author: msmbaldwin
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 02/12/2026
ms.author: mbaldwin
ai-usage: ai-assisted
---

# Incident response overview for Azure

Incident response is the practice of investigating and remediating active attack campaigns on your organization. Effective incident response for Azure environments requires understanding the shared responsibility model, Azure-native investigation capabilities, and automated response tools.

This article focuses on Azure-specific incident response considerations. For comprehensive, platform-agnostic incident response guidance—including detailed playbooks for phishing, password spray, token theft, and other attack types—see [Incident response overview](/security/operations/incident-response-overview) in the Microsoft Security documentation.

This article is aligned with [NIST SP 800-61](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final) phases: preparation, detection and analysis, containment and recovery, and post-incident activities. For prescriptive security controls with Azure Policy enforcement, see [Microsoft Cloud Security Benchmark v2 - Incident Response](/security/benchmark/azure/mcsb-v2-incident-response).

## Prepare for incident response

Establish plans, procedures, and capabilities before incidents occur.

**Develop Azure-specific incident response plans.** Traditional plans often fail in cloud environments where the shared responsibility model, API-based evidence collection, and service provider collaboration differ from datacenter incident handling. Your plans should address:

- Clear delineation of responsibilities between Microsoft and your organization for IaaS, PaaS, and SaaS services
- Cloud-native investigation using Azure Monitor logs, Microsoft Entra audit logs, and NSG flow logs
- Procedures for VM snapshots, memory dumps, and network packet captures
- Microsoft collaboration processes including Microsoft Support and [Microsoft Security Response Center (MSRC)](https://www.microsoft.com/msrc)

**Configure security contacts in Microsoft Defender for Cloud.** Designate contacts that Microsoft can reach during incidents requiring collaboration. Include 24/7 reachable primary contacts, backup contacts for global coverage, and role-based contacts for different incident types. For more information, see [Configure security contacts](/azure/defender-for-cloud/configure-email-notifications).

**Implement automated notification workflows.** Manual notification introduces critical delays. Use Azure Logic Apps and Microsoft Sentinel playbooks to automatically route alerts to appropriate stakeholders based on incident severity, regulatory requirements, and affected resources. Configure escalation procedures with time-based triggers for unacknowledged critical incidents.

**Test response procedures regularly.** Organizations discover gaps during actual incidents rather than controlled testing. Conduct quarterly tabletop exercises using attack scenarios like ransomware, data exfiltration, and insider threats.

## Detect and analyze incidents

Implement high-quality alert generation and systematic investigation capabilities.

### Enable unified threat detection

**Deploy Microsoft Defender XDR** as your primary unified security platform. Defender XDR automatically correlates alerts from endpoints, identities, email, and cloud apps into unified incidents, providing automated investigation and response at machine speed. For more information, see [Microsoft Defender XDR](/defender-xdr/microsoft-365-defender).

**Configure Microsoft Defender for Cloud** with appropriate Defender plans for your workloads (Servers, Storage, Containers, Key Vault). Tune alert thresholds and create suppression rules for known false positives, while maintaining threat coverage. For more information, see [Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction).

**Implement Microsoft Sentinel** for centralized SIEM and SOAR capabilities. Configure analytics rules for automated incident creation with intelligent alert grouping and entity enrichment. Use the investigation graph and entity behavior analytics for comprehensive investigation. For more information, see [Microsoft Sentinel](/azure/sentinel/overview).

### Establish comprehensive logging

Comprehensive log data is essential for constructing attack timelines and understanding scope. Collect:

- **Microsoft Entra ID logs**: Sign-in logs, audit logs, and risky user detections
- **Azure Activity Logs**: Control plane operations including resource modifications and policy changes
- **NSG flow logs**: Network traffic with source/destination mapping for lateral movement detection
- **Resource diagnostic logs**: Azure Storage, Key Vault, SQL, Firewall, and Application Gateway logs

Send logs to a Log Analytics workspace for long-term retention and centralized querying. For more information, see [Azure Monitor](/azure/azure-monitor/overview).

### Prioritize incidents based on business impact

Tag Azure resources with criticality levels based on business impact, revenue dependency, and regulatory scope. Configure automated severity scoring in Microsoft Sentinel that considers asset criticality, data sensitivity, and threat intelligence confidence. Automatically escalate incidents involving regulatory-protected data or critical business systems. For more information, see [Tag resources](/azure/azure-resource-manager/management/tag-resources).

## Contain and recover from incidents

Automate response to match the speed of automated attacks.

### Preserve evidence immediately

Evidence collection delays and improper handling compromise forensic integrity. Automate evidence preservation:

- **VM snapshots**: Create point-in-time snapshots for compromised VMs before remediation
- **Immutable storage**: Export logs and evidence to Azure Storage with [immutable storage policies](/azure/storage/blobs/immutable-storage-overview) and legal hold
- **Network packet capture**: Use Azure Network Watcher for network forensics
- **Memory dumps**: Collect volatile evidence using Azure extensions

Maintain chain of custody with cryptographic hashing and access logging for legal proceedings.

### Automate containment actions

Manual containment takes hours while automated attacks complete objectives in minutes. Deploy Microsoft Sentinel playbooks for:

- **User account response**: Disable accounts, reset passwords, terminate sessions, revoke privileges
- **Network isolation**: Modify NSG rules to isolate VMs while preserving investigation access
- **Device quarantine**: Isolate compromised endpoints through Microsoft Defender for Endpoint
- **Malware response**: Quarantine files and block hashes across the organization

Configure approval workflows for high-impact actions to prevent false positive damage. For more information, see [Automate threat response with playbooks](/azure/sentinel/tutorial-respond-threats-playbook).

### Use Azure-native isolation capabilities

- **Network Security Groups**: Add deny rules to block attacker traffic
- **Azure Firewall**: Deploy rules blocking malicious IPs and domains
- **Microsoft Entra Conditional Access**: Block access from compromised accounts or locations
- **Privileged Identity Management**: Revoke privileged access assignments

## Learn and improve after incidents

Conduct systematic post-incident activities to prevent recurrence.

**Document lessons learned.** Determine what worked well and what needs improvement. Capture the complete attack timeline, response effectiveness, and gaps discovered during the incident.

**Retain evidence appropriately.** Store evidence in immutable Azure Storage with retention policies meeting regulatory requirements for different incident types.

**Update detection capabilities.** Add detection rules for attack techniques observed during the incident. Map detected activities to [MITRE ATT&CK](https://attack.mitre.org/) techniques to identify defense gaps.

**Improve response procedures.** Update playbooks and runbooks based on lessons learned. Refine automation to address manual bottlenecks discovered during response.

## Incident response playbooks

Microsoft provides detailed playbooks for common attack scenarios:

| Playbook | Description |
|----------|-------------|
| [Phishing investigation](/security/operations/incident-response-playbook-phishing) | Investigate phishing attacks |
| [Password spray investigation](/security/operations/incident-response-playbook-password-spray) | Respond to password spray attacks |
| [App consent grant investigation](/security/operations/incident-response-playbook-app-consent) | Investigate malicious OAuth consent grants |
| [Compromised and malicious applications](/security/operations/incident-response-playbook-compromised-malicious-app) | Investigate compromised or malicious applications |
| [Token theft](/security/operations/token-theft-playbook) | Investigate token theft attacks |

For more playbooks, see [Incident response playbooks](/security/operations/incident-response-playbooks).

## Next steps

- Review [Incident response overview](/security/operations/incident-response-overview) for comprehensive guidance
- Learn about [threat protection](threat-detection.md) in Azure
- Review [operational security best practices](operational-best-practices.md)
- Explore [Microsoft Cloud Security Benchmark v2 - Incident Response](/security/benchmark/azure/mcsb-v2-incident-response)
