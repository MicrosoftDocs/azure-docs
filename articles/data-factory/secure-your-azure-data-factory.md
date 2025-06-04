---
title: Secure your Azure Data Factory
description: Learn how to secure <service>, with best practices for <summary of #Required; article description that is displayed in search results. Include the word "secure" or "security", as well as the Azure service name.
author: whhender #Required; your GitHub user alias.
ms.author: whhender #Required; Microsoft alias of author; optional team alias.
ms.service: azure-data-factory #Required; service per approved list. service slug assigned to your service by ACOM.
ms.topic: concept-article #Required
ms.custom: horz-security #Required
ms.date: 06/04/2025 #Required; mm/dd/yyyy format.
---

# Secure your Azure Data Factory deployment

<!---Required:
Starts "Secure your <service name> deployment". You may omit "deployment" and "your", if that makes the title read better
Example H1: Secure Azure Key Vault
Example H1: Secure your Azure Key Vault
Example H1: Secure your Azure Key Vault deployment

The introduction comprises two paragraphs:
    1. A brief overview of the service and the importance of keeping it secure.
    2. "This article provides guidance on how to best secure your <service>."

Here is an example of an introductory paragraph in the security features article:
--->

Azure Key Vault protects cryptographic keys, certificates (and the private keys associated with the certificates), and secrets (such as connection strings and passwords) in the cloud. When storing sensitive and business-critical data, however, you must take steps to maximize the security of your vaults and the data stored in them.

This article provides guidance on how to best secure your Azure Key Vault deployment.

<!---Required:>

Each H2 in the article should focus on a **specific security area or security control** related to the service. The section title should clearly convey its scope, such as *Network Security*, *Identity Management*, or *Data Protection*.

Following the header, there should be a brief description of the section's focus. This description should provide context for the recommendations that follow, explaining why this area is important for security and how it relates to the overall security posture of the service.

Each section consists of **a list of bullet points**, where each item provides a specific security recommendation. The format of each bullet point follows these rules:

- **Each recommendation begins with a directive in bold** that tells the reader exactly what they should do to enhance security.  
- **The explanation provides the necessary context or reasoning** for the recommendation.  
- If there is an existing article that contains more details, include a brief summary and **a "For more details" sentence with a link**.  
- If there is no separate article, provide full guidance within the bullet point.

Here is an example of each

Recommendation with a link to more information:

```
- **Restrict access using role-based permissions**: Limit access to sensitive resources by applying role-based access control (RBAC). For more details, see [RBAC best practices](/security/rbac-best-practices).
```

Recommendation with full guidance in the article:

```
- **Use secure authentication methods**: Always require multi-factor authentication (MFA) for administrative access to minimize the risk of unauthorized access.

    MFA adds an extra layer of security by requiring a secondary form of verification, such as a mobile authentication app or hardware token. Configure your system to enforce MFA for all privileged accounts and high-risk operations.
```

Additional Formatting Rules:

- **Include a blank line between each bullet point** to improve readability.  
- **Keep section titles concise and descriptive.**  
- **Maintain a consistent writing style** across all recommendations.

The rest of this template provides some common H2 sections. While the exact list of H2s will vary by service and are left to the discretion of the writer, the following sections are common across many services.  You can use the text as the intro for each section, but feel free to modify it to fit your service.

After the introfuction, each of these sections contains a bulleted list of common security recommendations, complete with boilerplate desriptuions and links to more information. Ideally, however, you will link to your service's specific documentation, not the generic links provided in this template.
--->

## Network security

The Network Security section provides comprehensive guidance on establishing and maintaining secure, segmented cloud network architectures. It emphasizes isolating high-risk workloads, securing both internal and external network traffic, and implementing monitoring and logging for threat detection. The section covers best practices for mitigating external attacks like DDoS and web-based exploits, securing DNS traffic, and simplifying network security management through automation and centralized controls. It also addresses securing internet-exposed applications through layered defenses and ensuring secure remote management using encryption and multi-factor authentication.

- **Isolate and segment workloads using Virtual Networks (VNets)**: Use VNets to create isolated network environments for cloud resources, enabling segmentation of workloads based on risk. VNets help control traffic within the cloud infrastructure, and you can use Network Security Groups (NSGs) to enforce security rules. See [Azure Virtual Network](/azure/virtual-network/).

- **Secure service access using Private Links**: Securely connect to Azure services (such as Azure Storage, SQL Database) within your virtual network, preventing exposure to the public internet. This enhances data privacy and reduces attack vectors. See [Azure Private Link](/azure/private-link/private-link-overview).

- **Control traffic flow with Network Security Groups (NSGs)**: Apply NSGs to control inbound and outbound traffic for virtual machines and subnets within VNets. Use a "deny by default, permit by exception" approach to restrict traffic flow and protect sensitive resources. See [Azure Network Security Groups](/azure/virtual-network/security-overview).

- **Use a centralized firewall for enhanced network security**: Deploy Azure Firewall to provide centralized, network-layer protection for your cloud environment. Azure Firewall helps filter traffic between subnets and VMs and supports high availability and scalability. See [Azure Firewall](/azure/firewall/).

- **Protect against DDoS attacks**: Enable Azure DDoS Protection to defend against distributed denial-of-service attacks. This service offers real-time detection and mitigation to protect critical resources and ensure service availability under high traffic loads. See [Azure DDoS Protection](/azure/ddos-protection/).

- **Mitigate web vulnerabilities with a Web Application Firewall (WAF)**: Protect applications from web vulnerabilities like SQL injection and cross-site scripting (XSS) using WAF. It can be deployed alongside Azure Application Gateway or Azure Front Door to filter and block malicious traffic. See [Azure Web Application Firewall](/azure/web-application-firewall/).

- **Secure DNS traffic and management**: Use Azure DNS for public domain management and Azure Private DNS to manage DNS within your private virtual network. Enable DNSSEC to protect against DNS spoofing and ensure the integrity of DNS queries. See [Azure DNS](/azure/dns/dns-overview) and [Azure Private DNS](/azure/dns/private-dns-overview).

- **Ensure secure remote management of virtual machines**: Securely manage remote access to your virtual machines through Azure Bastion, which provides encrypted RDP and SSH sessions without exposing your VMs to the public internet. See [Azure Bastion](/azure/bastion/).

- **Automate security management and enforce policies**: Simplify network security management by using [Microsoft Defender for Cloud](/azure/defender-for-cloud/) and Azure Policy to automate security configurations, monitor compliance, and enforce security best practices across your environment. See [Microsoft Defender for Cloud](/azure/defender-for-cloud/) and [Azure Policy](/azure/governance/policy/overview).

## Identity management

The Identity Management section focuses on securing identities and access controls using centralized identity and access management systems. It covers best practices such as the use of single sign-on (SSO), strong authentication mechanisms, managed identities for applications, conditional access policies, and monitoring for account anomalies. The section emphasizes using a unified, centralized system to manage identities across both cloud and non-cloud environments, helping to ensure consistent, secure authentication and access management practices.

Here are some possible security services, features, and best practices for the identity management section:

- **Centralize identity and access management**: Use Microsoft Entra as your centralized identity and authentication management system for governing access to both Microsoft cloud resources (such as Azure Storage, Virtual Machines, and Key Vault) and non-cloud resources, including third-party SaaS applications. Standardizing on Microsoft Entra ensures consistent identity management and reduces the risks associated with local authentication methods. See [Microsoft Entra](/entra).

- **Implement single sign-on (SSO)**: Implement SSO through Microsoft Entra to provide seamless access to cloud and on-premises applications using a single identity. This improves user experience and reduces the attack surface by minimizing the need for multiple passwords. See [Microsoft Entra Single Sign-On](/entra/identity/hybrid/connect/how-to-connect-sso-quick-start).

- **Use managed identities for secure application access**: Use managed identities in Azure to securely authenticate applications and services without the need to manage credentials. This provides a secure and simplified way to access resources like Azure Key Vault or Azure SQL Database. See [Managed Identities](/entra/identity/managed-identities-azure-resources/overview).

- **Enforce security through conditional access policies**: Set up conditional access policies in Microsoft Entra to enforce security controls based on user, location, or device context. These policies allow dynamic enforcement of security requirements based on risk, enhancing overall security posture. See [Microsoft Entra Conditional Access](/entra/identity/conditional-access/overview).

## Privileged access

The privileged access section focuses on securing administrative access to critical resources by implementing strict access controls, just-in-time access, and enhanced monitoring of privileged accounts. It emphasizes minimizing the risk of unauthorized access to sensitive resources by restricting and managing elevated permissions, enforcing multifactor authentication, and ensuring that privileged actions are logged and audited.

Here are some possible security services, features, and best practices for the privileged access section:

- **Apply least privilege principles**: Use role-based access control (RBAC) to assign the minimum necessary permissions to users and services, ensuring that they only have access to what is needed to perform their duties. Regularly review and adjust roles to align with the principle of least privilege. See [Azure RBAC](/azure/role-based-access-control/overview).

- **Limit privileged access using just-in-time (JIT) elevation**: Use Entra Privileged Identity Management (PIM) to grant privileged roles only when needed. This reduces the risk of long-standing elevated access and ensures that users have elevated permissions only for the time required to complete their tasks. See [Privileged Identity Management](/entra/id-governance/privileged-identity-management/pim-configure).

- **Enforce multifactor authentication (MFA) for privileged accounts**: Require MFA for all users with elevated permissions to ensure an additional layer of security. This significantly reduces the risk of account compromise even if passwords are stolen or guessed. See [Entra MFA](/entra/identity/authentication/concept-mfa-howitworks).

- **Monitor and log privileged activities**: Ensure all privileged actions are logged for auditing purposes. Use Azure Monitor and Microsoft Sentinel to track administrative activities and detect suspicious behavior in real-time. See [Azure Monitor](/azure/azure-monitor/) and [Microsoft Sentinel](/azure/sentinel/).

- **Implement break-glass accounts for emergencies**: Create highly restricted, break-glass accounts for emergency access that bypass conditional access policies. These accounts should be tightly monitored and used only in critical scenarios. See [Break-Glass Accounts](/entra/identity/role-based-access-control/security-emergency-access).

## Logging and threat detection

The logging and threat detection section covers controls for detecting threats in Azure environments, enabling, collecting, and storing audit logs for Azure services. It emphasizes the use of native threat detection capabilities, centralized log management, and proper log retention for security investigations and compliance. This section focuses on generating high-quality alerts, centralizing security analysis through Azure tools, maintaining accurate time synchronization, and ensuring effective log retention strategies.

Here are some possible security services, features, and best practices for the logging and threat detection section:

- **Centralize log collection and analysis with Microsoft Sentinel**: Aggregate and analyze logs from Azure resources, including activity logs, security logs, and application logs, using Microsoft Sentinel. This helps correlate security events and provides a comprehensive view for detecting threats and investigating incidents. See [Microsoft Sentinel](/azure/sentinel/).

- **Enable native threat detection and security monitoring**: Use Microsoft Defender for Cloud to monitor threats across Azure services. It provides built-in threat detection and security alerting capabilities for Azure resources like virtual machines, databases, and storage. Defender for Cloud can also be integrated with Microsoft Sentinel for more advanced threat analytics and correlation across your environment. See [Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction).

- **Monitor and analyze performance and security with Azure Monitor**: Use Azure Monitor to collect data from various Azure resources, applications, and VMs. It helps track performance metrics, provides real-time monitoring, and offers analytics capabilities for troubleshooting and proactive threat detection. Logs can be stored in Log Analytics for further analysis and reporting. See [Azure Monitor](/azure/azure-monitor/overview).

- **Enable and configure network logging**: Configure network security logging using Azure tools like Network Security Group (NSG) flow logs, Azure Firewall logs, and DNS query logs. These logs can be sent to Azure Monitor for analysis and visualized using Traffic Analytics to provide insights into network traffic and detect suspicious activity. See [NSG Flow Logs](/azure/network-watcher/network-watcher-nsg-flow-logging-portal).

- **Retain logs for compliance and forensic investigation**: Set log retention policies in Azure Monitor Log Analytics based on compliance requirements. Logs can be retained for up to one year, with options for long-term archiving in Azure Storage or other services. Ensure proper retention and management of security logs to support audits and investigations. See [Log Retention](/azure/azure-monitor/platform/manage-cost-storage).

## Backup and recovery

The backup and recovery section focuses on ensuring that data and configurations across Azure services are regularly backed up, protected, and recoverable in case of failures or disasters. It emphasizes automating backups, securing backup data, and ensuring that recovery processes are tested and validated to meet recovery time objectives (RTO) and recovery point objectives (RPO). The section also highlights the importance of monitoring and auditing backup processes to ensure compliance and readiness.

Here are some possible security services, features, and best practices for the backup and recovery detection section:

- **Automate backups for critical resources**: Use Azure Backup to automate regular backups for Azure VMs, SQL databases, file shares, and other critical resources. Ensure that the backup frequency and retention policies align with your business requirements. Use Azure Policy to automatically enable backups for new resources. See [Azure Backup](/azure/backup/).

- **Protect backup data with encryption and access controls**: Secure your backup data using encryption at rest and in transit. For Azure Backup, data is encrypted using platform-managed keys or customer-managed keys in Azure Key Vault. Apply Azure RBAC and multi-factor authentication (MFA) to control access to backup operations and data. Enable soft delete to protect against accidental or malicious deletions. See [Azure Backup Security](/azure/backup/security-overview).

- **Ensure disaster recovery with cross-region and geo-redundant storage**: Use geo-redundant storage (GRS) to replicate backup data across different Azure regions, ensuring data availability in case of regional outages. For zone-specific protection, enable zone-redundant storage (ZRS) for resilient backups. Consider cross-region restore to recover data in case of a disaster in the primary region. See [Azure Backup Geo-Redundancy](/azure/backup/backup-create-rs-vault#set-cross-region-restore).

- **Monitor backup health and compliance**: Use Azure Backup Center to monitor backup health, get alerts for critical incidents, and audit user actions on vaults. Ensure that all business-critical resources are compliant with defined backup policies by auditing through Azure Policy. See [Backup Center](/azure/backup/backup-center-govern-environment).

- **Test recovery processes regularly**: Periodically perform recovery tests to validate the integrity and availability of backup data. Ensure that the tests align with your RTO and RPO goals to meet business continuity requirements. Use Azure Backup’s built-in recovery testing features to simplify and automate the process. See [Azure Backup Testing](/azure/backup/backup-azure-restore-files-from-vm).