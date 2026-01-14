---
title: Best practices for secure PaaS deployments - Microsoft Azure
description: Learn best practices for designing, building, and managing secure cloud applications on Azure and understand the security advantages of PaaS versus other cloud service models.
services: security
author: msmbaldwin
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 11/04/2025
ms.author: mbaldwin
---

# Securing PaaS deployments

This article provides information that helps you:

- Understand the security advantages of hosting applications in the cloud
- Evaluate the security advantages of platform as a service (PaaS) versus other cloud service models
- Change your security focus from a network-centric to an identity-centric perimeter security approach
- Implement general PaaS security best practices recommendations

[Develop secure applications on Azure](/azure/security/develop/secure-develop) is a general guide to the security questions and controls you should consider at each phase of the software development lifecycle when developing applications for the cloud.

## Cloud security advantages

It's important to understand the [division of responsibility](/azure/security/fundamentals/shared-responsibility) between you and Microsoft. On-premises, you own the whole stack, but as you move to the cloud some responsibilities transfer to Microsoft.

There are security advantages to being in the cloud. In an on-premises environment, organizations likely have unmet responsibilities and limited resources available to invest in security, which creates an environment where attackers can exploit vulnerabilities at all layers.

Organizations can improve their threat detection and response times by using a provider's cloud-based security capabilities and cloud intelligence. By shifting responsibilities to the cloud provider, organizations can get more security coverage, which enables them to reallocate security resources and budget to other business priorities.

## Security advantages of a PaaS cloud service model

Let's look at the security advantages of an Azure PaaS deployment versus on-premises.

![Security advantages of PaaS](./media/paas-deployments/advantages-of-paas.png)

Starting at the bottom of the stack, the physical infrastructure, Microsoft mitigates common risks and responsibilities. Because the Microsoft cloud is continually monitored by Microsoft, it is hard to attack. It doesn't make sense for an attacker to pursue the Microsoft cloud as a target. Unless the attacker has lots of money and resources, the attacker is likely to move on to another target.

In the middle of the stack, there is no difference between a PaaS deployment and on-premises. At the application layer and the account and access management layer, you have similar risks. In the next steps section of this article, we guide you to best practices for eliminating or minimizing these risks.

At the top of the stack, data governance and rights management, you take on one risk that can be mitigated by key management. While key management is an additional responsibility, you have areas in a PaaS deployment that you no longer have to manage so you can shift resources to key management.

The Azure platform also provides strong DDoS protection by using various network-based technologies. However, all types of network-based DDoS protection methods have their limits on a per-link and per-datacenter basis. To help avoid the impact of large DDoS attacks, you can take advantage of Azure's core cloud capability of enabling you to quickly and automatically scale out to defend against DDoS attacks.

## Identity as the primary security perimeter

With PaaS deployments comes a shift in your overall approach to security. You shift from needing to control everything yourself to sharing responsibility with Microsoft.

Another significant difference between PaaS and traditional on-premises deployments is a new view of what defines the primary security perimeter. Historically, the primary on-premises security perimeter was your network and most on-premises security designs use the network as its primary security pivot. For PaaS deployments, you are better served by considering identity to be the primary security perimeter.

One of the five essential characteristics of cloud computing is broad network access, which makes network-centric thinking less relevant. The goal of much of cloud computing is to allow users to access resources regardless of location. For most users, their location is going to be somewhere on the Internet.

The following figure shows how the security perimeter has evolved from a network perimeter to an identity perimeter. Security becomes less about defending your network and more about defending your data, as well as managing the security of your apps and users. The key difference is that you want to push security closer to what's important to your company.

![Identity as new security perimeter](./media/paas-deployments/identity-perimeter.png)

Initially, Azure PaaS services (for example, Azure App Service and Azure SQL) provided little or no traditional network perimeter defenses. It was understood that the element's purpose was to be exposed to the Internet (web role) and that authentication provides the new perimeter (for example, Azure SQL).

Modern security practices assume that the adversary has breached the network perimeter. Therefore, modern defense practices have moved to identity. Organizations must establish an identity-based security perimeter with strong authentication and authorization hygiene.

## Best practices for identity management

The following are best practices for managing the identity perimeter.

**Best practice**: You should first consider using managed identities for Azure resources to securely access other services without storing credentials.
**Detail**: [Managed identities](/entra/identity/managed-identities-azure-resources/overview) automatically provide an identity for applications running in Azure services, enabling them to authenticate to services that support Microsoft Entra ID without requiring credentials in code or configuration files. This reduces the risk of credential exposure and simplifies identity management for your applications.

**Best practice**: Secure your keys and credentials to secure your PaaS deployment.
**Detail**: Losing keys and credentials is a common problem. You can use a centralized solution where keys and secrets can be stored in hardware security modules (HSMs). [Azure Key Vault](/azure/key-vault/general/overview) safeguards your keys and secrets by encrypting authentication keys, storage account keys, data encryption keys, .pfx files, and passwords using keys that are protected by HSMs.

**Best practice**: Don't put credentials and other secrets in source code or GitHub.
**Detail**: The only thing worse than losing your keys and credentials is having an unauthorized party gain access to them. Attackers can take advantage of bot technologies to find keys and secrets stored in code repositories such as GitHub. Do not put keys and secrets in these public code repositories.

**Best practice**: Use strong authentication and authorization platforms.
**Detail**: Use [Microsoft Entra ID](/entra/fundamentals/whatis) for authentication instead of custom user stores. When you use Microsoft Entra ID, you take advantage of a platform-based approach and delegate the management of authorized identities. A Microsoft Entra ID approach is especially important when employees are terminated and that information needs to be reflected through multiple identity and authorization systems.

Use platform-supplied authentication and authorization mechanisms instead of custom code. The reason is that developing custom authentication code can be error prone. Most of your developers are not security experts and are unlikely to be aware of the subtleties and the latest developments in authentication and authorization. Commercial code (for example, from Microsoft) is often extensively security reviewed.

Use [multifactor authentication (MFA)](/entra/identity/authentication/concept-mfa-howitworks), and ensure that phishing-resistant MFA methods — such as [Passkeys](/entra/identity/authentication/concept-authentication-passwordless#passkey-fido2), [FIDO2](/entra/identity/authentication/how-to-enable-passkey-fido2), or [Certificate-Based Authentication (CBA)](/entra/identity/authentication/concept-certificate-based-authentication) — are enforced through [Conditional Access policies](/entra/identity/conditional-access/overview). At a minimum, require these for all administrators, and for optimal security, implement them tenant-wide. Access to both Azure management (portal/remote PowerShell) interfaces and customer-facing services should be designed and configured to use Microsoft Entra multifactor authentication.

For app sign-in, use [OpenID Connect (OIDC)](/entra/architecture/auth-oidc) with [OAuth 2.0](/entra/architecture/auth-oauth2) via Microsoft Entra ID. These protocols have been extensively peer reviewed and are likely implemented as part of your platform libraries for authentication and authorization.

## Use threat modeling during application design

The Microsoft [Security Development Lifecycle](https://www.microsoft.com/securityengineering/sdl) specifies that teams should engage in a process called threat modeling during the design phase. To help facilitate this process, Microsoft has created the [SDL Threat Modeling Tool](/azure/security/develop/threat-modeling-tool). Modeling the application design and enumerating [STRIDE](/azure/security/develop/threat-modeling-tool-threats) threats across all trust boundaries can catch design errors early on.

The following table lists the STRIDE threats and gives some example mitigations that use Azure features. These mitigations won't work in every situation.

| Threat | Security property | Potential Azure platform mitigations |
| --- | --- | --- |
| Spoofing | Authentication | Require HTTPS connections. |
| Tampering | Integrity | Validate TLS/SSL certificates. |
| Repudiation | Non-repudiation | Enable Azure [monitoring and diagnostics](/azure/architecture/best-practices/monitoring). |
| Information disclosure | Confidentiality | Encrypt sensitive data at rest by using [service certificates](/azure/cloud-services/cloud-services-certs-create). |
| Denial of service | Availability | Monitor performance metrics for potential denial-of-service conditions. Implement connection filters. |
| Elevation of privilege | Authorization | Use [Privileged Identity Management](/entra/id-governance/privileged-identity-management/pim-configure). |

## Azure App Service

[Azure App Service](/azure/app-service/overview) is a PaaS offering that lets you create web and mobile apps for any platform or device and connect to data anywhere, in the cloud or on-premises. App Service includes the web and mobile capabilities that were previously delivered separately as Azure Websites and Azure Mobile Services. It also includes new capabilities for automating business processes and hosting cloud APIs.

Following are best practices for using App Service.

**Best practice**: [Authenticate through Microsoft Entra ID](/azure/app-service/overview-authentication-authorization).
**Detail**: App Service provides an OAuth 2.0 service for your identity provider. OAuth 2.0 focuses on client developer simplicity while providing specific authorization flows for web applications, desktop applications, and mobile phones. Microsoft Entra ID uses OAuth 2.0 to enable you to authorize access to mobile and web applications.

**Best practice**: Restrict access based on the need to know and least privilege security principles.
**Detail**: Restricting access is imperative for organizations that want to enforce security policies for data access. You can use [Azure RBAC](/azure/role-based-access-control/overview) to assign permissions to users, groups, and applications at a certain scope.

**Best practice**: Protect your keys.
**Detail**: Azure Key Vault helps safeguard cryptographic keys and secrets that cloud applications and services use. With Key Vault, you can encrypt keys and secrets (such as authentication keys, storage account keys, data encryption keys, .PFX files, and passwords) by using keys that are protected by hardware security modules (HSMs). For added assurance, you can import or generate keys in HSMs. See [Azure Key Vault](/azure/key-vault/general/overview) to learn more. You can also use Key Vault to manage your TLS certificates with auto-renewal.

**Best practice**: Restrict incoming source IP addresses.
**Detail**: [App Service Environment](/azure/app-service/environment/intro) has a virtual network integration feature that helps you restrict incoming source IP addresses through network security groups. Virtual networks enable you to place Azure resources in a non-internet, routable network that you control access to. To learn more, see [Integrate your app with an Azure virtual network](/azure/app-service/overview-vnet-integration). In addition, you can also use [private link (private endpoint)](/azure/app-service/overview-private-endpoint) and disable the public network to force the private network connection between App Service and other services.

**Best practice**: Enforce HTTPS-only traffic and require TLS 1.2 or higher for all connections. Disable FTP access where possible; if file transfer is necessary, use FTPS to ensure secure, encrypted transfers.
**Detail**: Configuring your App Service to accept only HTTPS traffic ensures data is encrypted in transit, protecting sensitive information from interception. Requiring TLS 1.2 or higher provides stronger security against vulnerabilities found in earlier protocol versions. Disabling FTP reduces the risk of credentials or data being transmitted unencrypted. If file transfer is required, enable only FTPS, which encrypts both credentials and data during transit.

**Best practice**: Monitor the security state of your App Service environments.
**Detail**: Use Microsoft Defender for Cloud to monitor your App Service environments. When Defender for Cloud identifies potential security vulnerabilities, it creates recommendations that guide you through the process of configuring the needed controls. Microsoft Defender for App Service provides threat protection for your App Service resources.

For more information, see [Microsoft Defender for App Service](/azure/defender-for-cloud/defender-for-app-service-introduction).

## Web Application Firewall

Web applications are increasingly targets of malicious attacks that exploit common known vulnerabilities. Common among these exploits are SQL injection attacks and cross-site scripting attacks. Preventing such attacks in application code can be challenging and may require rigorous maintenance, patching, and monitoring at many layers of the application topology. A centralized web application firewall helps make security management much simpler and gives better assurance to application administrators against threats or intrusions. A WAF solution can also react to a security threat faster by patching a known vulnerability at a central location versus securing each individual web application.

[Azure Web Application Firewall (WAF)](/azure/web-application-firewall/overview) provides centralized protection of your web applications from common exploits and vulnerabilities. WAF is available through [Azure Application Gateway](/azure/web-application-firewall/ag/ag-overview) and [Azure Front Door](/azure/web-application-firewall/afds/afds-overview).

## DDoS protection

Azure offers two main DDoS protection tiers: [DDoS IP Protection](/azure/ddos-protection/ddos-protection-overview#ddos-ip-protection) and [DDoS Network Protection](/azure/ddos-protection/ddos-protection-overview#ddos-network-protection). These options cover different scenarios and have distinct features and pricing.

- **DDoS IP Protection**: Best for protecting specific public IP addresses, ideal for smaller or targeted deployments needing essential DDoS mitigation at the IP level.
- **DDoS Network Protection**: Covers entire virtual networks with advanced mitigation, analytics, and integration; suited for larger or enterprise environments needing broader security.

Choose DDoS IP Protection for focused, cost-sensitive cases; select DDoS Network Protection for comprehensive coverage and advanced features.

DDoS Protection defends at the network layer (3/4). For application-layer (7) defense, add a WAF. See [Application DDoS protection](/azure/web-application-firewall/shared/application-ddos-protection).

## Monitor application performance

[Azure Monitor](/azure/azure-monitor/overview) collects, analyzes, and acts on telemetry from your cloud and on-premises environments. An effective monitoring strategy helps you understand the detailed operation of the components of your application. It helps you increase your uptime by notifying you of critical issues so that you can resolve them before they become problems. It also helps you detect anomalies that might be security related.

Use [Application Insights](/azure/azure-monitor/app/app-insights-overview) to monitor availability, performance, and usage of your application, whether it's hosted in the cloud or on-premises. By using Application Insights, you can quickly identify and diagnose errors in your application without waiting for a user to report them. With the information that you collect, you can make informed choices on your application's maintenance and improvements.

Application Insights has extensive tools for interacting with the data that it collects. Application Insights stores its data in a common repository. It can take advantage of shared functionality such as alerts, dashboards, and deep analysis with the Kusto query language.

## Perform security penetration testing

Validating security defenses is as important as testing any other functionality. Make [penetration testing](/azure/security/fundamentals/pen-testing) a standard part of your build and deployment process. Schedule regular security tests and vulnerability scanning on deployed applications, and monitor for open ports, endpoints, and attacks.

## Next steps

In this article, we focused on security advantages of an Azure PaaS deployment and security best practices for cloud applications. Next, learn recommended practices for securing your PaaS web and mobile solutions using specific Azure services. We'll start with Azure App Service, Azure SQL Database and Azure Synapse Analytics, and Azure Storage. As articles on recommended practices for other Azure services become available, links will be provided in the following list:

- [Azure App Service](/azure/security/fundamentals/paas-applications-using-app-services)
- [Azure SQL Database and Azure Synapse Analytics](/azure/security/fundamentals/paas-applications-using-sql)
- [Azure Storage](/azure/security/fundamentals/paas-applications-using-storage)

See [Develop secure applications on Azure](/azure/security/develop/secure-dev-overview) for security questions and controls you should consider at each phase of the software development lifecycle when developing applications for the cloud.

See [Azure security best practices and patterns](/azure/security/fundamentals/best-practices-and-patterns) for more security best practices to use when you're designing, deploying, and managing your cloud solutions by using Azure.

The following resources are available to provide more general information about Azure security and related Microsoft services:

- [Azure Security Documentation](/azure/security/) - for comprehensive security guidance
- [Microsoft Security Response Center](https://www.microsoft.com/msrc) - where Microsoft security vulnerabilities, including issues with Azure, can be reported or via email to secure@microsoft.com
