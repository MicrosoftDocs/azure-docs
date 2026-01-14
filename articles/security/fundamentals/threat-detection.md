---
title: Azure threat protection | Microsoft Docs
description: Learn about built-in threat protection functionality for Azure, such as Microsoft Defender for Cloud, Microsoft Sentinel, and Microsoft Entra ID Protection.
services: security
author: msmbaldwin
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 11/04/2025
ms.author: mbaldwin
---

# Azure threat protection

Azure provides comprehensive threat protection through services such as Microsoft Defender for Cloud, Microsoft Sentinel, Microsoft Entra ID Protection, and Microsoft Defender for Cloud Apps. This collection of security services and capabilities offers advanced detection, response, and threat intelligence to protect your Azure deployments.

## Microsoft Defender for Cloud

[Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction) helps protect your hybrid cloud environment. By performing continuous security assessments of your connected resources, it provides detailed security recommendations and threat detection for discovered vulnerabilities.

Defender for Cloud's recommendations are based on the [Microsoft cloud security benchmark](/security/benchmark/azure/introduction)—the Microsoft-authored, Azure-specific set of guidelines for security and compliance best practices based on common compliance frameworks.

Enabling Defender for Cloud's enhanced security features brings advanced, intelligent protection of your Azure, hybrid, and multicloud resources and workloads through specialized plans including:

- **Microsoft Defender for Servers** - Provides threat detection and advanced defenses for Windows and Linux machines
- **Microsoft Defender for Storage** - Detects unusual and potentially harmful attempts to access or exploit storage accounts
- **Microsoft Defender for SQL** - Protects databases against vulnerabilities, anomalous activities, and SQL injection threats  
- **Microsoft Defender for Containers** - Secures containerized environments including Kubernetes clusters
- **Microsoft Defender for App Service** - Identifies attacks targeting applications running over App Service
- **Microsoft Defender for Key Vault** - Detects unusual and potentially harmful attempts to access key vault accounts
- **Microsoft Defender for Resource Manager** - Monitors resource management operations in your organization
- **Microsoft Defender for DNS** - Detects suspicious activities and anomalous DNS queries
- **Microsoft Defender for AI Services** - Provides runtime protection for Azure AI services against jailbreaks, data exposure, and suspicious access patterns

### Security analytics and threat intelligence

Microsoft security researchers are constantly on the lookout for threats. They have access to an expansive set of telemetry gained from Microsoft's global presence in the cloud and on-premises. This wide-reaching and diverse collection of datasets enables Microsoft to discover new attack patterns and trends across its on-premises consumer and enterprise products, as well as its online services.

Defender for Cloud can rapidly update its detection algorithms as attackers release new and increasingly sophisticated exploits. This approach helps you keep pace with a fast-moving threat environment.

Defender for Cloud automatically collects security information from your resources, the network, and connected partner solutions. It analyzes this information, correlating data from multiple sources, to identify threats. Security alerts are prioritized in Defender for Cloud along with recommendations on how to remediate the threats.

Defender for Cloud employs advanced security analytics, which go far beyond signature-based approaches. Breakthroughs in big data and machine learning technologies are used to evaluate events across the entire cloud. Advanced analytics can detect threats that would be impossible to identify through manual approaches and predict the evolution of attacks.

For more information, see [Introduction to Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction).

## Microsoft Sentinel

[Microsoft Sentinel](/azure/sentinel/overview) is a cloud-native security information and event management (SIEM) and security orchestration, automation, and response (SOAR) solution. Microsoft Sentinel provides intelligent security analytics and threat intelligence across the enterprise, offering a single solution for attack detection, threat visibility, proactive hunting, and threat response.

Microsoft Sentinel helps you:

- **Collect data at cloud scale** across all users, devices, applications, and infrastructure, both on-premises and in multiple clouds
- **Detect previously undetected threats** and minimize false positives using Microsoft's analytics and unparalleled threat intelligence
- **Investigate threats with artificial intelligence** and hunt for suspicious activities at scale, tapping into years of cybersecurity work at Microsoft
- **Respond to incidents rapidly** with built-in orchestration and automation of common tasks

Key capabilities include:

- **Advanced threat detection** using built-in machine learning, anomaly detection, and user and entity behavior analytics (UEBA)
- **Threat intelligence integration** from Microsoft and third-party sources to identify known threat actors and their techniques
- **Investigation and hunting** tools powered by AI to uncover hidden threats and pursue attackers across your environment
- **Automated response** through playbooks that can respond to threats in seconds
- **Microsoft Sentinel data lake** for scalable, cost-efficient long-term data retention and multi-modal analytics
- **Microsoft Sentinel graph** for unified graph analytics providing deeper context and threat reasoning

For more information, see [What is Microsoft Sentinel?](/azure/sentinel/overview).

## Microsoft Entra ID Protection

[Microsoft Entra ID Protection](/entra/id-protection/overview-identity-protection) is a Microsoft Entra ID P2 feature that provides an overview of the risk detections and potential vulnerabilities that can affect your organization's identities. Identity Protection uses existing Microsoft Entra anomaly-detection capabilities and introduces new risk detection types that can detect real-time anomalies.

Identity Protection uses adaptive machine learning algorithms and heuristics to detect anomalies and risk detections that might indicate that an identity has been compromised. Using this data, Identity Protection generates reports and alerts so that you can investigate these risk detections and take appropriate remediation or mitigation action.

### Identity Protection capabilities

Identity Protection helps you protect your organization's identities through:

**Risk detection and assessment**:
- Detect six risk detection types using machine learning and heuristic rules
- Calculate user risk levels
- Provide custom recommendations to improve overall security posture by highlighting vulnerabilities

**Investigation capabilities**:
- Send notifications for risk detections
- Investigate risk detections using relevant and contextual information
- Provide basic workflows to track investigations
- Provide easy access to remediation actions such as password reset

**Risk-based conditional access policies**:
- Mitigate risky sign-ins by blocking sign-ins or requiring multifactor authentication challenges
- Block or secure risky user accounts
- Require users to register for multifactor authentication

For more information, see [What is Microsoft Entra ID Protection?](/entra/id-protection/overview-identity-protection).

## Microsoft Entra Privileged Identity Management

With [Microsoft Entra Privileged Identity Management (PIM)](/entra/id-governance/privileged-identity-management/pim-configure), you can manage, control, and monitor access within your organization. This feature includes access to resources in Microsoft Entra ID and other Microsoft online services, such as Microsoft 365 or Microsoft Intune.

PIM helps you:

- Get alerts and reports about Microsoft Entra administrators and just-in-time (JIT) administrative access to Microsoft online services
- Get reports about administrator access history and changes in administrator assignments
- Get alerts about access to a privileged role

For more information, see [What is Microsoft Entra Privileged Identity Management?](/entra/id-governance/privileged-identity-management/pim-configure).

## Microsoft Defender for Cloud Apps

[Microsoft Defender for Cloud Apps](/defender-cloud-apps/what-is-defender-for-cloud-apps) is a comprehensive solution that helps your organization take full advantage of the promise of cloud applications while maintaining control through improved visibility into activity and increased protection of critical data.

With tools that help uncover shadow IT, assess risk, enforce policies, investigate activities, and stop threats, your organization can more safely move to the cloud while maintaining control of critical data.

Defender for Cloud Apps integrates visibility with your cloud by:

- Using Cloud Discovery to map and identify your cloud environment and the cloud apps your organization is using
- Sanctioning and prohibiting apps in your cloud
- Using easy-to-deploy app connectors that take advantage of provider APIs for visibility and governance
- Providing continuous control by setting and continually fine-tuning policies
- Using behavioral analytics with dynamic threat detection powered by Microsoft Threat Intelligence

For more information, see [What is Microsoft Defender for Cloud Apps?](/defender-cloud-apps/what-is-defender-for-cloud-apps).

## Microsoft Defender for Storage

[Microsoft Defender for Storage](/azure/storage/common/azure-defender-storage-configure) is an Azure-native layer of security intelligence that detects unusual and potentially harmful attempts to access or exploit your storage accounts. It uses advanced threat detection capabilities and Microsoft Threat Intelligence data to provide contextual security alerts with steps to mitigate detected threats and prevent future attacks.

Key features include:

- **Malware scanning** - On-upload and on-demand malware scanning with automated remediation capabilities  
- **Sensitive data threat detection** - Detects anomalous access to storage accounts containing sensitive data
- **Activity monitoring** - Provides aggregated storage activity logs for threat detection and investigation

For more information, see [Introduction to Microsoft Defender for Storage](/azure/defender-for-cloud/defender-for-storage-introduction).

## Microsoft Defender for SQL

Defender for SQL provides protection for databases against vulnerabilities, anomalous activities, and threats:

- **Vulnerability assessment** - Discovers, tracks, and helps remediate potential database vulnerabilities
- **Advanced threat protection** - Detects anomalous database activities indicating potential security threats such as SQL injection, brute-force attacks, and privilege abuse

For more information, see [Microsoft Defender for Azure SQL](/azure/defender-for-cloud/defender-for-sql-introduction).

## Microsoft Antimalware

[Microsoft Antimalware](/azure/security/fundamentals/antimalware) for Azure is a single-agent solution for applications and tenant environments, designed to run in the background without human intervention. You can deploy protection based on the needs of your application workloads, with either basic secure-by-default or advanced custom configuration.

Microsoft Antimalware for Azure provides:

- **Real-time protection** - Monitors activity to detect and block malware execution
- **Scheduled scanning** - Performs targeted scanning to detect malware
- **Malware remediation** - Automatically acts on detected malware
- **Signature updates** - Automatically installs the latest protection signatures
- **Active protection** - Reports telemetry metadata about detected threats to Microsoft Azure

For more information, see [Microsoft Antimalware for Azure Cloud Services and Virtual Machines](/azure/security/fundamentals/antimalware).

## Azure Firewall

[Azure Firewall](/azure/firewall/overview) is a cloud-native and intelligent network firewall security service that provides threat protection for your cloud workloads running in Azure. Azure Firewall inspects east-west and north-south traffic with built-in threat intelligence that can alert and deny traffic from/to known malicious IP addresses and domains.

Azure Firewall is available in three SKUs:

- **Azure Firewall Basic** - Simplified security for small to medium-sized businesses
- **Azure Firewall Standard** - Provides L3-L7 filtering and threat intelligence feeds from Microsoft Cyber Security
- **Azure Firewall Premium** - Advanced capabilities including signature-based IDPS, TLS inspection, and URL filtering

For more information, see [What is Azure Firewall?](/azure/firewall/overview) and [Azure network security overview](/azure/security/fundamentals/network-overview).

## Web Application Firewall

[Web Application Firewall (WAF)](/azure/web-application-firewall/overview) provides centralized protection of your web applications from common exploits and vulnerabilities. WAF is available through:

- **Azure Application Gateway** - Provides regional WAF protection
- **Azure Front Door** - Provides global WAF protection with protection against network-level DDoS attacks

WAF protects against common web vulnerabilities such as:

- SQL injection
- Cross-site scripting
- Other OWASP top 10 vulnerabilities
- Bot attacks
- HTTP protocol violations and anomalies

For more information, see [What is Azure Web Application Firewall?](/azure/web-application-firewall/overview).

## Next steps

- [Responding to today's threats](/azure/defender-for-cloud/managing-and-responding-alerts) - Identify active threats and respond quickly
- [Azure security best practices and patterns](/azure/security/fundamentals/best-practices-and-patterns) - Collection of security best practices
- [Microsoft Defender for Cloud documentation](/azure/defender-for-cloud/) - Comprehensive guide to Defender for Cloud
- [Microsoft Sentinel documentation](/azure/sentinel/) - Complete documentation for Microsoft Sentinel
