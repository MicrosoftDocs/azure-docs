---
title: Azure features & resources that help you protect, detect, and respond
description: Azure features & resources that help you protect, detect, and respond
author: msmbaldwin
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.author: mbaldwin
ms.date: 01/10/2022
ms.custom: ignite-fall-2021
---

# Azure features & resources that help you protect, detect, and respond

Microsoft has invested in Azure native security capabilities that organizations can leverage to defeat ransomware attack techniques found in both high-volume, everyday attacks, and sophisticated targeted attacks.

Key capabilities include:
- **Native Threat Detection**: Microsoft Defender for Cloud provides high-quality threat detection and response capabilities, also called Extended Detection and Response (XDR). This helps you:
  - Avoid wasting time and talent of scarce security resources to build custom alerts using raw activity logs.
  - Ensure effective security monitoring, which often enables security teams to rapidly approve use of Azure services.
- **Passwordless and Multi-factor authentication**: Azure Active Directory MFA, Azure AD Authenticator App, and Windows Hello provide these capabilities. This helps protect accounts against commonly seen password attacks (which account for 99.9% of the volume of identity attacks we see in Azure AD). While no security is perfect, eliminating password-only attack vectors dramatically lowers the ransomware attack risk to Azure resources. 
- **Native Firewall and Network Security**: Microsoft built native DDoS attack mitigations, Firewall, Web Application Firewall, and many other controls into Azure. These security 'as a service' help simplify the configuration and implementation of security controls. These give organizations the choice of using native services or virtual appliances versions of familiar vendor capabilities to simplify their Azure security. 

## Microsoft Defender for Cloud

Microsoft Defender for Cloud is a built-in tool that provides threat protection for workloads running in Azure, on-premises, and in other clouds. It protects your hybrid data, cloud native services, and servers from ransomware and other threats; and integrates with your existing security workflows like your SIEM solution and Microsoft's vast threat intelligence to streamline threat mitigation.

Microsoft Defender for Cloud delivers protection for all resources from directly within the Azure experience and extends protection to on-premises and multi-cloud virtual machines and SQL databases using Azure Arc:
- Protects Azure services
- Protects hybrid workloads
- Streamline security with AI and automation
- Detects and blocks advanced malware and threats for Linux and Windows servers on any cloud
- Protects cloud-native services from threats
- Protects data services against ransomware attacks
- Protects your managed and unmanaged IoT and OT devices, with continuous asset discovery, vulnerability management, and threat monitoring

Microsoft Defender for Cloud provides you the tools to detect and block ransomware, advanced malware and threats for your resources

Keeping your resources safe is a joint effort between your cloud provider, Azure, and you, the customer. You have to make sure your workloads are secure as you move to the cloud, and at the same time, when you move to IaaS (infrastructure as a service) there is more customer responsibility than there was in PaaS (platform as a service), and SaaS (software as a service). Microsoft Defender for Cloud provides you the tools needed to harden your network, secure your services and make sure you're on top of your security posture.

Microsoft Defender for Cloud is a unified infrastructure security management system that strengthens the security posture of your data centers and provides advanced threat protection across your hybrid workloads in the cloud whether they're in Azure or not - as well as on premises.

Defender for Cloud's threat protection enables you to detect and prevent threats at the Infrastructure as a Service (IaaS) layer, non-Azure servers as well as for Platforms as a Service (PaaS) in Azure.

Defender for Cloud's threat protection includes fusion kill-chain analysis, which automatically correlates alerts in your environment based on cyber kill-chain analysis, to help you better understand the full story of an attack campaign, where it started and what kind of impact it had on your resources.

Key Features:
- Continuous security assessment: Identify Windows and Linux machines with missing security updates or insecure OS settings and vulnerable Azure configurations. Add optional watchlists or events you want to monitor. 
- Actionable recommendations: Remediate security vulnerabilities quickly with prioritized, actionable security recommendations. 
- Centralized policy management: Ensure compliance with company or regulatory security requirements by centrally managing security policies across all your hybrid cloud workloads.
- Industry's most extensive threat intelligence: Tap into the Microsoft Intelligent Security Graph, which uses trillions of signals from Microsoft services and systems around the globe to identify new and evolving threats.
- Advanced analytics and machine learning: Use built-in behavioral analytics and machine learning to identify known attack patterns and post-breach activity.
- Adaptive application control: Block malware and other unwanted applications by applying allowlist recommendations adapted to your specific workloads and powered by machine learning.
- Prioritized alerts and attack timelines: Focus on the most critical threats first with prioritized alerts and incidents that are mapped into a single attack campaign.
- Streamlined investigation: Quickly investigate the scope and impact of an attack with a visual, interactive experience. Use ad hoc queries for deeper exploration of security data.
- Automation and orchestration: Automate common security workflows to address threats quickly using built-in integration with Azure Logic Apps. Create security playbooks that can route alerts to existing ticketing system or trigger incident response actions. 

## Microsoft Sentinel

Microsoft Sentinel helps to create a complete view of a kill chain

With Sentinel, you can connect to any of your security sources using built-in connectors and industry standards and then take advantage of artificial intelligence to correlate multiple low fidelity signals spanning multiple sources to create a complete view of a ransomware kill chain and prioritized alerts so that defenders can accelerate their time to evict adversaries. 

Microsoft Sentinel is your birds-eye view across the enterprise alleviating the stress of increasingly sophisticated attacks, increasing volumes of alerts, and long resolution time frames.

Collect data at cloud scale across all users, devices, applications, and infrastructure, both on-premises and in multiple clouds. 

Detect previously undetected threats, and minimize [false positives](../../sentinel/false-positives.md) using Microsoft's analytics and unparalleled threat intelligence. 

Investigate threats with artificial intelligence, and hunt for suspicious activities at scale, tapping into years of Cyber security work at Microsoft.

Respond to incidents rapidly with built-in orchestration and automation of common tasks.

## Native threat prevention with Microsoft Defender for Cloud

Microsoft Defender for Cloud scans virtual machines across an Azure subscription and makes a recommendation to deploy endpoint protection where an existing solution is not detected. This recommendation can be accessed via the Recommendations section:

:::image type="content" source="../../defender-for-cloud/media/get-started/overview.png" alt-text="Screenshot of Microsoft Defender for Cloud overview":::

Microsoft Defender for Cloud provides security alerts and advanced threat protection for virtual machines, SQL databases, containers, web applications, your network, and more. When Microsoft Defender for Cloud detects a threat in any area of your environment, it generates a security alert. These alerts describe details of the affected resources, suggested remediation steps, and in some cases an option to trigger a logic app in response.

This alert is an example of a detected Petya ransomware alert:

:::image type="content" source="./media/ransomware/ransomware-12.png" alt-text="Example of a detected Petya ransomware alert":::

### Azure native backup solution protects Your data

One important way that organizations can help protect against losses in a ransomware attack is to have a backup of business-critical information in case other defenses fail. Since ransomware attackers have invested heavily into neutralizing backup applications and operating system features like volume shadow copy, it is critical to have backups that are inaccessible to a malicious attacker. With a flexible business continuity and disaster recovery solution, industry-leading data protection and security tools, Azure cloud offers secure services to protect your data:

- **Azure Backup**: Azure Backup service provides simple, secure, and cost-effective solution to back up your Azure VM.  Currently, Azure Backup supports backing up of all the disks (OS and Data disks) in a VM using backup solution for Azure Virtual machine.
- **Azure Disaster Recovery**: With disaster recovery from on-prem to the cloud, or from one cloud to another, you can avoid downtime and keep your applications up and running. 
- **Built-in Security and Management in Azure**: To be successful in the Cloud era, enterprises must have visibility/metrics and controls on every component to pinpoint issues efficiently, optimize and scale effectively, while having the assurance the security, compliance and policies are in place to ensure the velocity.

### Guaranteed and Protected Access to Your Data

Azure has a lengthy period of experience managing global data centers, which are backed by Microsoft's $15 billion-infrastructure investment that is under continuous evaluation and improvement – with ongoing investments and improvements, of course.

Key Features:
- Azure comes with Locally Redundant Storage (LRS), where data is stored locally, as well as Geo Redundant Storage (GRS) in a second region
- All data stored on Azure is protected by an advanced encryption process, and all Microsoft's data centers have two-tier authentication, proxy card access readers, biometric scanners
- Azure has more certifications than any other public cloud provider on the market, including ISO 27001, HIPAA, FedRAMP, SOC 1, SOC 2, and many international specifications

## Additional resources

- [Microsoft Cloud Adoption Framework for Azure](/azure/cloud-adoption-framework/)
- [Build great solutions with the Microsoft Azure Well-Architected Framework](/training/paths/azure-well-architected-framework/)
- [Azure Top Security Best Practices](/azure/cloud-adoption-framework/get-started/security#step-1-establish-essential-security-practices)
- [Security Baselines](https://techcommunity.microsoft.com/t5/microsoft-security-baselines/bg-p/Microsoft-Security-Baselines)
- [Microsoft Azure Resource Center](https://azure.microsoft.com/resources/)
- [Azure Migration Guide](/azure/cloud-adoption-framework/migrate/azure-migration-guide/)
- [Security Compliance Management](/azure/cloud-adoption-framework/organize/cloud-security-compliance-management) 
- [Azure Security Control – Incident Response](/security/benchmark/azure/security-controls-v3-incident-response)
- [Zero Trust Guidance Center](/security/zero-trust/)
- [Azure Web Application Firewall](../../web-application-firewall/ag/application-gateway-crs-rulegroups-rules.md?tabs=owasp32)
- [Azure VPN gateway](../../vpn-gateway/openvpn-azure-ad-tenant.md#enable-authentication)
- [Azure Active Directory Multi-Factor Authentication (MFA)](../../active-directory/authentication/howto-mfa-userstates.md)
- [Azure AD Identity Protection](../../active-directory/authentication/concept-password-ban-bad.md)
- [Azure AD Conditional Access](../../active-directory/conditional-access/overview.md)
- [Microsoft Defender for Cloud documentation](../../defender-for-cloud/index.yml)

## Conclusion

Microsoft focuses heavily on both security of our cloud and providing you the security controls you need to protect your cloud workloads.  As a leader in cybersecurity, we embrace our responsibility to make the world a safer place. This is reflected in our comprehensive approach to ransomware prevention and detection in our security framework, designs, products, legal efforts, industry partnerships, and services. 

We look forward to partnering with you in addressing ransomware protection, detection, and prevention in a holistic manner.

Connect with us:
- [AskAzureSecurity@microsoft.com](mailto:AskAzureSecurity@microsoft.com)
- [www.microsoft.com/services](https://www.microsoft.com/en-us/msservices)

For detailed information on how Microsoft secures our cloud, visit the [service trust portal](https://servicetrust.microsoft.com/).

## What's Next

See the white paper: [Azure defenses for ransomware attack whitepaper](https://azure.microsoft.com/resources/azure-defenses-for-ransomware-attack).

Other articles in this series:

- [Ransomware protection in Azure](ransomware-protection.md)
- [Prepare for a ransomware attack](ransomware-prepare.md)
- [Detect and respond to ransomware attack](ransomware-detect-respond.md)
