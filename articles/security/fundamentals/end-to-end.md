---
title: End-to-end security in Azure | Microsoft Docs
description: The article provides a map of Azure services that help you secure and protect your cloud resources and detect and investigate threats.
services: security
documentationcenter: na
author: TerryLanfear
manager: rkarlin

ms.assetid: a5a7f60a-97e2-49b4-a8c5-7c010ff27ef8
ms.service: security
ms.subservice: security-fundamentals
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 4/07/2021
ms.author: terrylan

---
# End-to-end security in Azure
One of the best reasons to use Azure for your applications and services is to take advantage of its wide array of security tools and capabilities. These tools and capabilities help make it possible to create secure solutions on the secure Azure platform. Microsoft Azure provides confidentiality, integrity, and availability of customer data, while also enabling transparent accountability.

The following diagram and documentation introduces you to the security services in Azure. These security services help you meet the security needs of your business and protect your users, devices, resources, data, and applications in the cloud.

## Microsoft security services map

The security services map organizes services by the resources they protect (column). The diagram also groups services into the following categories (row):

- Secure and protect - Services that let you implement a layered, defense in-depth strategy across identity, hosts, networks, and data. This collection of security services and capabilities provides a way to understand and improve your security posture across your Azure environment.
- Detect threats – Services that identify suspicious activities and facilitate mitigating the threat.
- Investigate and respond – Services that pull logging data so you can assess a suspicious activity and respond.

The diagram includes the Azure Security Benchmark program, a collection of high-impact security recommendations you can use to help secure the services you use in Azure.

:::image type="content" source="media/end-to-end/security-diagram.svg" alt-text="Diagram showing end-to-end security services in Azure." border="false":::

## Security controls and baselines
The [Azure Security Benchmark](../benchmarks/introduction.md) program includes a collection of high-impact security recommendations you can use to help secure the services you use in Azure:

- Security controls - These recommendations are generally applicable across your Azure tenant and Azure services. Each recommendation identifies a list of stakeholders that are typically involved in planning, approval, or implementation of the benchmark.
- Service baselines - These apply the controls to individual Azure services to provide recommendations on that service’s security configuration.

## Secure and protect

:::image type="content" source="media/end-to-end/secure-and-protect.svg" alt-text="Diagram showing Azure services that help you secure and protect your cloud resources." border="false":::

| Service | Description |
|------|--------|
| [Azure Security Center](../../security-center/security-center-introduction.md)| A unified infrastructure security management system that strengthens the security posture of your data centers, and provides advanced threat protection across your hybrid workloads in the cloud - whether they're in Azure or not - as well as on premises. |
| **Identity&nbsp;&&nbsp;Access&nbsp;Management** | |
| [Azure Active Directory (AD)](../../active-directory/fundamentals/active-directory-whatis.md)| Microsoft’s cloud-based identity and access management service.  |
|  | [Conditional Access](../../active-directory/conditional-access/overview.md) is the tool used by Azure AD to bring identity signals together, to make decisions, and enforce organizational policies. |
|  | [Domain Services](../../active-directory-domain-services/overview.md) is the tool used by Azure AD to provide managed domain services such as domain join, group policy, lightweight directory access protocol (LDAP), and Kerberos/NTLM authentication. |
|  | [Privileged Identity Management (PIM)](../../active-directory/privileged-identity-management/pim-configure.md) is a service in Azure AD that enables you to manage, control, and monitor access to important resources in your organization. |
|  | [Multi-factor authentication](../../active-directory/authentication/concept-mfa-howitworks.md) is the tool used by Azure AD to help safeguard access to data and applications by requiring a second form of authentication. |
| [Azure AD Identity Protection](../../active-directory/identity-protection/overview-identity-protection.md) | A tool that allows organizations to automate the detection and remediation of identity-based risks, investigate risks using data in the portal, and export risk detection data to third-party utilities for further analysis. |
| **Infrastructure&nbsp;&&nbsp;Network** |  |
| [VPN Gateway](../../vpn-gateway/vpn-gateway-about-vpngateways.md) | A virtual network gateway that is used to send encrypted traffic between an Azure virtual network and an on-premises location over the public Internet and to send encrypted traffic between Azure virtual networks over the Microsoft network. |
| [Azure DDoS Protection Standard](../../ddos-protection/ddos-protection-overview.md) | Provides enhanced DDoS mitigation features to defend against DDoS attacks. It is automatically tuned to help protect your specific Azure resources in a virtual network. |
| [Azure Front Door](../../frontdoor/front-door-overview.md) | A global, scalable entry-point that uses the Microsoft global edge network to create fast, secure, and widely scalable web applications. |
| [Azure Firewall](../../firewall/overview.md) | A managed, cloud-based network security service that protects your Azure Virtual Network resources. It's a fully stateful firewall as a service with built-in high availability and unrestricted cloud scalability. |
| [Azure Key Vault](../../key-vault/general/overview.md) | A secure secrets store for tokens, passwords, certificates, API keys, and other secrets. Key Vault can also be used to create and control the encryption keys used to encrypt your data. |
| [Key Vault Managed HSM (preview)](../../key-vault/managed-hsm/overview.md) | A fully managed, highly available, single-tenant, standards-compliant cloud service that enables you to safeguard cryptographic keys for your cloud applications, using FIPS 140-2 Level 3 validated HSMs. |
| [Azure Private Link](../../private-link/private-link-overview.md) | Enables you to access Azure PaaS Services (for example, Azure Storage and SQL Database) and Azure hosted customer-owned/partner services over a private endpoint in your virtual network. |
| [Azure Application Gateway](../../application-gateway/overview.md) | An advanced web traffic load balancer that enables you to manage traffic to your web applications. Application Gateway can make routing decisions based on additional attributes of an HTTP request, for example URI path or host headers. |
| [Azure Service Bus](../../service-bus-messaging/service-bus-messaging-overview.md) | A fully managed enterprise message broker with message queues and publish-subscribe topics. Service Bus is used to decouple applications and services from each other. |
| [Web Application Firewall](../../web-application-firewall/overview.md) | Provides centralized protection of your web applications from common exploits and vulnerabilities. WAF can be deployed with Azure Application Gateway and Azure Front Door. |
| **Data & Application** |  |
| [Azure Backup](../../backup/backup-overview.md) | Provides simple, secure, and cost-effective solutions to back up your data and recover it from the Microsoft Azure cloud. |
| [Azure Storage Service Encryption](../../storage/common/storage-service-encryption.md) | Automatically encrypts data before it is stored and automatically decrypts the data when you retrieve it. |
| [Azure Information Protection](https://docs.microsoft.com/azure/information-protection/what-is-information-protection) | A cloud-based solution that enables organizations to discover, classify, and protect documents and emails by applying labels to content. |
| [API Management](../../api-management/api-management-key-concepts.md) | A way to create consistent and modern API gateways for existing back-end services. |
| [Azure confidential computing](../../confidential-computing/overview.md) | Allows you to isolate your sensitive data while it's being processed in the cloud. |
| [Azure DevOps](https://docs.microsoft.com/azure/devops/user-guide/what-is-azure-devops) | Your development projects benefit from multiple layers of security and governance technologies, operational practices, and compliance policies when stored in Azure DevOps. |
| **Customer Access** |  |
| [Azure AD External Identities](../../active-directory/external-identities/compare-with-b2c.md) | With External Identities in Azure AD, you can allow people outside your organization to access your apps and resources, while letting them sign in using whatever identity they prefer. |
|  | You can share your apps and resources with external users via [Azure AD B2B](../../active-directory/external-identities/what-is-b2b.md) collaboration. |
|  | [Azure AD B2C](../../active-directory-b2c/overview.md) lets you support millions of users and billions of authentications per day, monitoring and automatically handling threats like denial-of-service, password spray, or brute force attacks. |

## Detect threats

:::image type="content" source="media/end-to-end/detect-threats.svg" alt-text="Diagram showing Azure services that detect threats." border="false":::

| Service | Description |
|------|--------|
| [Azure Defender](../../security-center/azure-defender.md) | Brings advanced, intelligent, protection of your Azure and hybrid resources and workloads. The Azure Defender dashboard in Security Center provides visibility and control of the cloud workload protection features for your environment. |
| [Azure Sentinel](../../sentinel/overview.md) | A scalable, cloud-native, security information event management (SIEM) and security orchestration automated response (SOAR) solution. Sentinel delivers intelligent security analytics and threat intelligence across the enterprise, providing a single solution for alert detection, threat visibility, proactive hunting, and threat response. |
| **Identity&nbsp;&&nbsp;Access&nbsp;Management** |  |
| [Microsoft 365 Defender](https://docs.microsoft.com/microsoft-365/security/defender/microsoft-365-defender) | A unified pre- and post-breach enterprise defense suite that natively coordinates detection, prevention, investigation, and response across endpoints, identities, email, and applications to provide integrated protection against sophisticated attacks. |
|  | [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint) is an enterprise endpoint security platform designed to help enterprise networks prevent, detect, investigate, and respond to advanced threats. |
|  | [Microsoft Defender for Identity](https://docs.microsoft.com/defender-for-identity/what-is) is a cloud-based security solution that leverages your on-premises Active Directory signals to identify, detect, and investigate advanced threats, compromised identities, and malicious insider actions directed at your organization. |
| [Azure AD Identity Protection](../../active-directory/identity-protection/howto-identity-protection-configure-notifications.md) | Sends two types of automated notification emails to help you manage user risk and risk detections: Users at risk detected email and Weekly digest email. |
| **Infrastructure & Network** |  |
| [Azure Defender for IoT](../../defender-for-iot/overview.md) | A unified security solution for identifying IoT/OT devices, vulnerabilities, and threats. It enables you to secure your entire IoT/OT environment, whether you need to protect existing IoT/OT devices or build security into new IoT innovations. |
| [Azure Network Watcher](../../network-watcher/network-watcher-monitoring-overview.md) | Provides tools to monitor, diagnose, view metrics, and enable or disable logs for resources in an Azure virtual network. Network Watcher is designed to monitor and repair the network health of IaaS products which includes virtual machines, virtual networks, application gateways, and load balancers. |
| [Azure Policy audit logging](../../governance/policy/overview.md) | Helps to enforce organizational standards and to assess compliance at-scale. Azure Policy uses activity logs, which are automatically enabled to include event source, date, user, timestamp, source addresses, destination addresses, and other useful elements. |
| **Data & Application** |  |
| [Azure Defender for container registries](../../security-center/defender-for-container-registries-introduction.md) | Includes a vulnerability scanner to scan the images in your Azure Resource Manager-based Azure Container Registry registries and provide deeper visibility into your images' vulnerabilities. |
| [Azure Defender for Kubernetes](../../security-center/defender-for-kubernetes-introduction.md) | Provides cluster-level threat protection by monitoring your AKS-managed services through the logs retrieved by Azure Kubernetes Service (AKS). |
| [Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/what-is-cloud-app-security) | A Cloud Access Security Broker (CASB) that operates on multiple clouds. It provides rich visibility, control over data travel, and sophisticated analytics to identify and combat cyberthreats across all your cloud services. |

## Investigate and respond

:::image type="content" source="media/end-to-end/investigate-and-respond.svg" alt-text="Diagram showing Azure services that help you investigate and respond to threats." border="false":::

| Service | Description |
|------|--------|
| [Azure Sentinel](../../sentinel/hunting.md) | Powerful search and query tools to hunt for security threats across your organization's data sources. |
| [Azure&nbsp;Monitor&nbsp;logs&nbsp;and&nbsp;metrics](../../azure-monitor/overview.md) | Delivers a comprehensive solution for collecting, analyzing, and acting on telemetry from your cloud and on-premises environments. Azure Monitor [collects and aggregates data](../../azure-monitor/data-platform.md#observability-data-in-azure-monitor) from a variety of sources into a common data platform where it can be used for analysis, visualization, and alerting. |
| **Identity&nbsp;&&nbsp;Access&nbsp;Management** |  |
| [Azure&nbsp;AD&nbsp;reports&nbsp;and&nbsp;monitoring](https://docs.microsoft.com/azure/active-directory/reports-monitoring/) | [Azure AD reports](../../active-directory/reports-monitoring/overview-reports.md) provide a comprehensive view of activity in your environment. |
|  | [Azure AD monitoring](../../active-directory/reports-monitoring/overview-monitoring.md) lets you route your Azure AD activity logs to different endpoints.|
| [Azure AD PIM audit history](../../active-directory/privileged-identity-management/pim-how-to-use-audit-log.md) | Shows all role assignments and activations within the past 30 days for all privileged roles. |
| **Data & Application** |  |
| [Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/investigate) | Provides tools to gain a deeper understanding of what's happening in your cloud environment. |

## Next steps

- Understand your [shared responsibility in the cloud](shared-responsibility.md).

- Understand the [isolation choices in the Azure cloud](isolation-choices.md) against both malicious and non-malicious users.
