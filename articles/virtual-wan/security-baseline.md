---
title: Azure security baseline for Virtual WAN
description: The Virtual WAN security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 01/01/2000
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Virtual WAN

This security baseline applies guidance from the [Azure Security Benchmark](../security/benchmarks/overview.md) to Microsoft Azure Virtual
WAN. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Virtual
WAN. **Controls** not applicable to Virtual
WAN have been excluded.

To see how Virtual
WAN completely maps to the Azure Security Benchmark, see the [full Virtual
WAN security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](/azure/security/benchmarks/security-controls-v2-network-security).*

### NS-1: Implement security for internal traffic

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41239.).

**Guidance**: Azure Virtual WAN does not support deploying directly into a virtual network. However, you can still apply network security group rules on spoke resources, use Azure Firewall's protections or create custom route-tables to prevent or allow private traffic.

- [Custom routing scenarios](scenario-any-to-any.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### NS-2: Connect private networks together 

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41240.).

**Guidance**: Use Azure ExpressRoute or Azure virtual private network (VPN) to create private connections between Azure datacenters and on-premises infrastructure in a colocation environment. ExpressRoute connections do not go over the public internet, offer more reliability, faster speeds, and lower latencies than typical internet connections. 

For point-to-site VPN and site-to-site VPN, connect on-premises devices or networks to a virtual network using any combination of these VPN options and ExpressRoute. To connect two or more virtual networks in Azure together, use Virtual Network peering. Network traffic between peered virtual networks is private and is kept on the Azure backbone network.

- [ExpressRoute in Virtual WAN](virtual-wan-expressroute-portal.md)

- [Site to Site VPN overview](virtual-wan-site-to-site-portal.md)

- [Point to Site VPN overview](virtual-wan-point-to-site-portal.md)

- [Private Link](howto-private-link.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### NS-3: Establish private network access to Azure services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41241.).

**Guidance**: Use Azure Private Link to enable private access to Azure Virtual WAN from your virtual networks without crossing the internet. Private access is another defense-in-depth measure in addition to authentication and traffic security offered by Azure services.

- [Understand Azure Private Link](../private-link/private-link-overview.md)

- [Virtual Wan Private Link](howto-private-link.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### NS-4: Protect applications and services from external network attacks

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41242.).

**Guidance**: Protect your Azure Virtual WAN resources against attacks from external networks, including distributed denial of service (DDoS) attacks, application-specific attacks, and unsolicited and potentially malicious internet traffic. 

Use Azure Firewall to protect applications and services against potentially malicious traffic from the internet and other external locations. Use Azure DDoS Protection for your assets against attacks on your Azure virtual networks. Use Azure Security Center to detect misconfiguration risks related to your network-related resources.

- [Azure Firewall Documentation](/azure/firewall)

- [Manage Azure DDoS Protection Standard using the Azure Portal](/azure/virtual-network/manage-ddos-protection) 

- [Azure Security Center recommendations](../security-center/recommendations-reference.md#recs-network)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### NS-5: Deploy intrusion detection/intrusion prevention systems (IDS/IPS)

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41243.).

**Guidance**: The best way of deploying intrusion detection or prevention systems in Azure Virtual WAN is using a Network Virtual Appliance in the spoke networks attached to the virtual hub.  More information is available on the routing scenarios at the referenced links. 

- [Scenario - Route traffic through an NVA](scenario-route-through-nva.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### NS-6: Simplify network security rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41244.).

**Guidance**: Use Azure Virtual Network service tags to define network access controls on Azure network security groups or Azure Firewall configured for your Virtual WAN resources. 

Use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (for example: {VirtualWAN: Virtual Network}) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### NS-7: Secure Domain Name Service (DNS)

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41245.).

**Guidance**: Azure Virtual WAN offers Custom DNS servers for Point-to-Site VPN Gateways. 

Follow the best practices for DNS security to mitigate against common attacks like dangling DNS, DNS amplifications attacks, DNS poisoning and spoofing, and so on.

When Azure DNS is used as your authoritative DNS service, ensure DNS zones and records are protected from accidental or malicious modification using Azure role-based access control (Azure RBAC) and resource locks.

- [Azure DNS overview](../dns/dns-overview.md) 

- [Secure Domain Name System (DNS) Deployment Guide](https://csrc.nist.gov/publications/detail/sp/800-81/2/final) 

- [Prevent dangling DNS entries and avoid subdomain takeover](../security/fundamentals/subdomain-takeover.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Identity Management

*For more information, see the [Azure Security Benchmark: Identity Management](/azure/security/benchmarks/security-controls-v2-identity-management).*

### IM-1: Standardize Azure Active Directory as the central identity and authentication system

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41225.).

**Guidance**: Azure Virtual WAN's Point-to-Site VPN is integrated with Azure Active Directory (Azure AD), which is Azure's default identity and access management service. You should standardize Azure AD to govern your organization’s identity and access management in:

- Microsoft Cloud resources, such as the Azure portal, Azure Storage, Azure Virtual Machines (Linux and Windows), Azure Key Vault, PaaS, and SaaS applications.
- Your organization's resources, such as applications on Azure or your corporate network resources.

Secure Azure AD with high priority in your organization’s cloud security practice. Assess your identity and security posture with Azure Security Center's security score feature to gauge how closely your configuration matches best practice recommendations. Implement Microsoft’s best practice recommendations for improvements to your security posture.

Azure AD also supports external identities, which allow users without a Microsoft account to sign in to their applications and resources with their external identity. Review information on using Azure AD in Point-to-Site VPN scenarios at the referenced links.

- [Create an Azure Active Directory (AD) tenant for P2S OpenVPN protocol connections](openvpn-azure-ad-tenant-multi-app.md)

- [Configure Azure Active Directory authentication for User VPN](virtual-wan-point-to-site-azure-ad.md)

- [Tenancy in Azure Active Directory](../active-directory/develop/single-and-multi-tenant-apps.md) 

- [How to create and configure an Azure AD instance](../active-directory/fundamentals/active-directory-access-create-new-tenant.md) 

- [Use external identity providers for application](/azure/active-directory/b2b/identity-providers)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### IM-2: Manage application identities securely and automatically

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41226.).

**Guidance**: Not applicable; Azure Virtual WAN does not use any identities or manage any secrets for them.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### IM-3: Use Azure AD single sign-on (SSO) for application access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41227.).

**Guidance**: Not applicable; Azure Virtual WAN does not support single sign-on for authentication to its resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### IM-4: Use strong authentication controls for all Azure Active Directory based access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41228.).

**Guidance**: Azure Virtual WAN's Point-to-Site VPN is integrated with Azure Active Directory (Azure AD), which supports strong authentication controls with multifactor authentication, and strong passwordless methods.

- Multifactor authentication - Enable Azure AD multifactor authentication and follow Azure Security Center's Identity and Access Management recommendations for best practices for your multifactor authentication setup. Multifactor authentication can be enforced on all, select users or at the per-user level based on sign in conditions and risk factors.

- Passwordless authentication – Three passwordless authentication options are available. These include, Windows Hello for Business, Microsoft Authenticator app, and on-premises authentication methods such as smart cards.

For administrator and privileged users, ensure the highest level of the strong authentication method are used, followed by a roll out of the appropriate strong authentication policy to other users.

- [How to enable MFA in P2S VPN for Virtual WAN](openvpn-azure-ad-mfa.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### IM-5: Monitor and alert on account anomalies

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41229.).

**Guidance**: Not applicable; Azure Virtual WAN does not use any sensitive accounts. There are no available account activity logs or any methods for customers to export them.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### IM-6: Restrict Azure resource access based on conditions

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41230.).

**Guidance**: Azure Virtual WAN's Point-to-Site VPN supports Azure AD conditional access for a more granular access control based on user-defined conditions. For example, user logins from certain IP ranges have to use multifactor authentication for logging in. Granular authentication session management policy can also be used for different use cases.

- [Common conditional access policies](../active-directory/conditional-access/concept-conditional-access-policy-common.md) 

- [Configure authentication session management with conditional access](../active-directory/conditional-access/howto-conditional-access-session-lifetime.md)

- [Virtual Wan P2S VPN Conditional Access](openvpn-azure-ad-mfa.md#conditional)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### IM-7: Eliminate unintended credential exposure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41231.).

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

For GitHub, you can use native secret scanning feature to identify credentials or other form of secrets within the code.

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html) 

- [GitHub secret scanning](https://docs.github.com/github/administering-a-repository/about-secret-scanning)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### IM-8: Secure user access to legacy applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41267.).

**Guidance**: Not applicable; Azure Virtual WAN does not access any legacy applications.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Privileged Access

*For more information, see the [Azure Security Benchmark: Privileged Access](/azure/security/benchmarks/security-controls-v2-privileged-access).*

### PA-1: Protect and limit highly privileged users

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41232.).

**Guidance**: Not applicable; Azure Virtual WAN does not use any administrative accounts.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PA-2: Restrict administrative access to business-critical systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41233.).

**Guidance**: Azure Virtual WAN uses Azure role-based access controls (Azure RBAC) to isolate access to business-critical systems by restricting which accounts are granted privileged access to the subscriptions and management groups they are in.

Also restrict access to the management, identity, and security systems that have administrative access to your business critical access such as Active Directory Domain Controllers, security tools, and system management tools with agents installed on business critical systems. Attackers who compromise these management and security systems can immediately weaponize them to compromise business critical assets.

All types of access controls should be aligned to your enterprise segmentation strategy to ensure consistent access control.

- [Azure Components and Reference model](/security/compass/microsoft-security-compass-introduction#azure-components-and-reference-model-2151) 

- [Management Group Access](../governance/management-groups/overview.md#management-group-access) 

- [Azure subscription administrators](../cost-management-billing/manage/add-change-subscription-administrator.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### PA-3: Review and reconcile user access regularly

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41234.).

**Guidance**: Not applicable; Azure Virtual WAN does not use any user accounts.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PA-4: Set up emergency access in Azure AD

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41235.).

**Guidance**: Not applicable; Azure Virtual WAN does not require or support emergency accounts.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PA-5: Automate entitlement management 

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41236.).

**Guidance**: Not applicable; Azure Virtual WAN does not support any automation for accounts or roles management.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PA-6: Use privileged access workstations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41237.).

**Guidance**: Secured, isolated workstations are critically important for the security of sensitive roles like administrators, developers, and critical service operators. Use highly secured user workstations or Azure Bastion for administrative tasks. Use Azure Active Directory (Azure AD), Microsoft Defender Advanced Threat Protection (ATP), or Microsoft Intune to deploy a secure and managed user workstation for administrative tasks. The secured workstations can be centrally managed to enforce secured configuration including strong authentication, software and hardware baselines, restricted logical and network access.

- [Understand privileged access workstations](../active-directory/devices/concept-azure-managed-workstation.md)

- [Deploy a privileged access workstation](../active-directory/devices/howto-azure-managed-workstation.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### PA-7: Follow just enough administration (least privilege principle) 

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41238.).

**Guidance**: Not applicable; Azure Virtual WAN does not support any role-based administrative accounts.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PA-8: Choose approval process for Microsoft support  

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41294.).

**Guidance**: Not applicable. The Customer Lockbox offering does not apply to Azure Virtual WAN as it does not store customer data.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](/azure/security/benchmarks/security-controls-v2-data-protection).*

### DP-1: Discovery, classify and label sensitive data

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41246.).

**Guidance**: Not applicable; Azure Virtual WAN does not offer this capability as it does not store any customer data.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### DP-2: Protect sensitive data

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41247.).

**Guidance**: Not applicable; Azure Virtual WAN does not offer this capability as it does not store any customer data, regardless of the data's sensitivity.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### DP-3: Monitor for unauthorized transfer of sensitive data

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41248.).

**Guidance**: Not applicable; Azure Virtual WAN does not offer this capability, as it does not store any customer data.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### DP-4: Encrypt sensitive information in transit

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41249.).

**Guidance**: Encryption is critical for traffic on external and public networks.

- Use access controls, data-in-transit should be protected against ‘out of band’ attacks (for example traffic capture) using encryption to ensure that attackers cannot easily read or modify the data.

- Ensure for HTTP traffic, that any clients connecting to your Azure resources can negotiate TLS v1.2 or greater.-

- For remote management, use SSH (for Linux) or RDP/TLS (for Windows) instead of unencrypted protocol. Obsoleted SSL/TLS/SSH versions, protocols, and weak ciphers should be disabled.-

- At the underlying infrastructure, Azure provides data in transit encryption by default for data traffic between Azure datacenters.

In general, we provide encryption on the secure Microsoft backbone and opportunities to encrypt traffic in your Site-to-site VPN, Site-to-site VPN over Azure ExpressRoute and Point-to-site User VPN.

- [Understand encryption in transit with Azure](../security/fundamentals/encryption-overview.md#encryption-of-data-in-transit)

- [Information on TLS Security](/security/engineering/solving-tls1-problem)

- [Double encryption for Azure data in transit](../security/fundamentals/double-encryption.md#data-in-transit)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### DP-5: Encrypt sensitive data at rest

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41250.).

**Guidance**: Azure Virtual WAN does not interact with sensitive data. As a result, you can not leverage any data protection features with the offering's resources such as access controls, encryption at rest or in transit, and enforcement of security controls with automated tools.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Asset Management

*For more information, see the [Azure Security Benchmark: Asset Management](/azure/security/benchmarks/security-controls-v2-asset-management).*

### AM-1: Ensure security team has visibility into risks for assets

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41268.).

**Guidance**: Not applicable; no risk visibility is provided to Azure Virtual WAN by Azure Security Center's 'Security Reader' role.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### AM-2: Ensure security team has access to asset inventory and metadata

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41269.).

**Guidance**: Apply tags to your Azure resources, resource groups, and subscriptions to logically organize them into a taxonomy. Each tag consists of a name and a value pair. For example, you can apply the name "Environment" and the value "Production" to all the resources in production.

Azure Virtual WAN also supports Azure Resource Manager based resource deployments and Azure Resource Graph queries. 

- [For more information about tagging assets, see the resource naming and tagging decision guide](https://docs.microsoft.com/azure/cloud-adoption-framework/decision-guides/resource-tagging/?toc=/azure/azure-resource-manager/management/toc.json)

- [How to create queries with Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md) 

- [Azure Security Center asset inventory management](../security-center/asset-inventory.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### AM-3: Use only approved Azure services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41270.).

**Guidance**: Use Azure Policy to restrict services which can be provisioned in your environment. Query and discover resources with Azure Resource Graph within your subscriptions and use Azure Monitor to create rules to trigger alerts when a non-approved service is detected.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to deny specific resource type with Azure Policy](../governance/policy/samples/built-in-policies.md#general)

- [How to create queries with Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### AM-4: Ensure security of asset lifecycle management

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41271.).

**Guidance**: Not applicable; customers can not use the offering's capabilities to inventory and manage assets. Microsoft controls all asset lifecycle management processes behind the scenes, with the customer having no control over this process.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Microsoft

### AM-5: Limit users' ability to interact with Azure Resource Manager

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41272.).

**Guidance**: Use Azure Conditional Access to limit users ability to interact with Azure Resources Manager by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resource Manager](../role-based-access-control/conditional-access-azure-management.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### AM-6: Use only approved applications in compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41273.).

**Guidance**: Not applicable; Azure Virtual WAN is not comprised of any virtual machines or containers which would either expose computer resources or allow customers to install applications on them.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Logging and Threat Detection

*For more information, see the [Azure Security Benchmark: Logging and Threat Detection](/azure/security/benchmarks/security-controls-v2-logging-threat-protection).*

### LT-1: Enable threat detection for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41251.).

**Guidance**: Not applicable; Azure Virtual WAN does not produce customer facing resource logs, which can be used for threat detection.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### LT-2: Enable threat detection for Azure identity and access management

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41252.).

**Guidance**: Azure Active Directory (Azure AD) provides the following user logs that can be viewed in Azure AD reporting or integrated with Azure Monitor, Azure Sentinel, SIEM or monitoring tools for more sophisticated monitoring and analytics use cases. These are:

- Sign in – The sign in report provides information about the usage of managed applications and user sign in activities.
- Audit logs - Provides traceability through logs for all changes done by various features within Azure AD. Examples of audit logs include changes made to any resources within Azure AD, such as, adding or removing users, apps, groups, roles and policies.
- Risky sign in - A risky sign in is an indicator for a sign in attempt that might have been performed by someone who is not the legitimate owner of a user account.
- Users flagged for risk - A risky user is an indicator for a user account that might have been compromised.

Use Azure Security Center to create alerts on certain suspicious activities such as excessive number of failed authentication attempts including deprecated accounts in the subscription. In addition to the basic security hygiene monitoring, use Security Center’s Threat Protection module to collect more in-depth security alerts from individual Azure compute resources (virtual machines, containers, app service), data resources (SQL DB and storage), and Azure service layers. This capability allows you have visibility on account anomalies inside the individual resources.

- [Audit activity reports in the Azure Active Directory](../active-directory/reports-monitoring/concept-audit-logs.md) 

- [Enable Azure Identity Protection](../active-directory/identity-protection/overview-identity-protection.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### LT-3: Enable logging for Azure network activities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41253.).

**Guidance**: Use VPN packet capture tools to record network packets traveling between your Azure Virtual WAN resources. This could assist with the debugging process related to your hybrid network. While you cannot deploy a network security group on  Virtual WAN, you can deploy it onto your spoke virtual network resources.

Enable network security group flow logs on your network security groups for traffic auditing.

Enable Azure Traffic Analytics feature to process flow logs which are retained in storage account, and then send them to a Log Analytics workspace. Traffic Analytics provides additional insights into traffic flow for your Azure networks. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

- [How to enable network security group flow logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md) 

- [How to enable and use Traffic Analytics](../network-watcher/traffic-analytics.md) 

Virtual Wan does not produce or process DNS query logs which would need to be enabled.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### LT-4: Enable logging for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41254.).

**Guidance**: Azure Activity logs, enabled automatically, contain all write operations (PUT, POST, DELETE) for your Azure Virtual WAN resources except read (GET) operations. Activity logs can be used to find an error during troubleshooting or to monitor how a user in your organization modified a resource. However, Virtual WAN does not produce Azure resource logs.

- [How to collect platform logs and metrics with Azure Monitor](../azure-monitor/platform/diagnostic-settings.md) 
- [Understand logging and different log types in Azure](../azure-monitor/platform/platform-logs-overview.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### LT-5: Centralize security log management and analysis

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41255.).

**Guidance**: Centralize logging storage and analysis to enable correlation. For each log source, ensure you have assigned a data owner, access guidance, storage location, what tools are used to process and access the data, and data retention requirements. Ensure you are integrating Azure Activity logs into your central logging systems. 

Ingest logs via Azure Monitor to aggregate security data generated by endpoint devices, network resources, and other security systems. In Azure Monitor, use Log Analytics workspaces to query and perform analytics, and use Azure storage accounts for long term and archival storage. In addition, enable and onboard data to Azure Sentinel or a third-party SIEM.

Many organizations choose to use Azure Sentinel for “hot” data that is used frequently and Azure Storage for “cold” data that is used less frequently.

- [How to collect platform logs and metrics with Azure Monitor](../azure-monitor/platform/diagnostic-settings.md) 

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### LT-6: Configure log storage retention

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41256.).

**Guidance**: Azure Virtual WAN does not produce any security-related logs. Customers are not able to set any log retention.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### LT-7: Use approved time synchronization sources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41257.).

**Guidance**: Azure Virtual WAN does not support configuring your own time synchronization sources. Virtual WAN relies on Microsoft-provided time synchronization sources, without any exposure to customers for configuration.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Microsoft

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](/azure/security/benchmarks/security-controls-v2-incident-response).*

### IR-1: Preparation – update incident response process for Azure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41258.).

**Guidance**: Ensure your organization has processes to respond to security incidents, has updated these processes for Azure, and is regularly exercising them to ensure readiness. Ensure you service offering is included in the incident response process, as applicable.

- [Implement security across the enterprise environment](https://aka.ms/AzSec4) 
- [Incident Response Reference Guide](https://aka.ms/IRRG)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### IR-2: Preparation – setup incident notification

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41259.).

**Guidance**: Set up security incident contact information in Azure Security Center. This contact information is used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. You also have options to customize incident alert and notification in different Azure services based on your incident response needs.

Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are fully resolved.

- [How to set the Azure Security Center security contact](../security-center/security-center-provide-security-contact-details.md) 

- [How to set the Azure Security Center security contact](../security-center/security-center-provide-security-contact-details.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### IR-3: Detection and analysis – create incidents based on high quality alerts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41260.).

**Guidance**: Azure Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytics used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, clearly mark subscriptions (for example, production, non-production) and create a naming system to clearly identify and categorize Azure resources.

- [Security alerts in Azure Security Center](../security-center/security-center-alerts-overview.md) 

- [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### IR-4: Detection and analysis – investigate an incident

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41261.).

**Guidance**: Build out an incident response guide for your organization. Conduct exercises to test your systems’ incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.

- [How to configure Workflow Automations within Azure Security Center](../security-center/security-center-planning-and-operations-guide.md) 

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process) 

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process) 

- [Refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### IR-5: Detection and analysis – prioritize incidents

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41262.).

**Guidance**: Azure Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, clearly mark subscriptions (such as, production, non-production) and create a naming system to clearly identify and categorize Azure resources.

- [Security alerts in Azure Security Center](../security-center/security-center-alerts-overview.md) 

- [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### IR-6: Containment, eradication and recovery – automate the incident handling

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41263.).

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Azure Logic Apps" on security alerts and recommendations.

- [How to configure Workflow Automation and Logic Apps](../security-center/workflow-automation.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Posture and Vulnerability Management

*For more information, see the [Azure Security Benchmark: Posture and Vulnerability Management](/azure/security/benchmarks/security-controls-v2-vulnerability-management).*

### PV-1: Establish secure configurations for Azure services 

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41278.).

**Guidance**: Not applicable; Azure Virtual WAN does not hold any security configurations.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PV-2: Sustain secure configurations for Azure services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41279.).

**Guidance**: Not applicable; Azure Virtual WAN does not hold any security configurations.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PV-3: Establish secure configurations for compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41280.).

**Guidance**: Not applicable; Azure Virtual WAN does not contain any resource configurations.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PV-4: Sustain secure configurations for compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41281.).

**Guidance**: Not applicable, this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PV-5: Securely store custom operating system and container images

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41282.).

**Guidance**: Not applicable, this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PV-6: Perform software vulnerability assessments

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41283.).

**Guidance**: Azure Virtual WAN is a core networking service. Customers can not install their vulnerability assessment software on it. Microsoft performs vulnerability scanning on the underlying infrastructure supporting the service.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Microsoft

### PV-7: Rapidly and automatically remediate software vulnerabilities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41284.).

**Guidance**: Azure Virtual WAN is a core networking service. Customers can not install their vulnerability assessment software on it. Microsoft performs vulnerability scanning on the underlying infrastructure supporting the service.

**Azure Security Center monitoring**: Yes

**Responsibility**: Microsoft

### PV-8: Conduct regular attack simulation

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41285.).

**Guidance**: As per your requirements, conduct penetration testing or red team activities on your Azure resources and ensure remediation of all critical security findings.

Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft's strategy, execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.

- [Penetration testing in Azure](../security/fundamentals/pen-testing.md)

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1) 

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Endpoint Security

*For more information, see the [Azure Security Benchmark: Endpoint Security](/azure/security/benchmarks/security-controls-v2-endpoint-security).*

### ES-1: Use Endpoint Detection and Response (EDR)

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41264.).

**Guidance**: Customers are not explicitly allowed to configure Endpoint Detection and Response settings. However, the Virtual Machines used in the Azure Virtual WAN offering do use these capabilities. Learn more about these general capabilities at the referenced links. 

- [Microsoft Defender Advanced Threat Protection Overview](/windows/security/threat-protection/microsoft-defender-atp/microsoft-defender-advanced-threat-protection)

- [Microsoft Defender ATP service for Windows servers](/windows/security/threat-protection/microsoft-defender-atp/configure-server-endpoints)

- [Microsoft Defender ATP service for non-Windows servers](/windows/security/threat-protection/microsoft-defender-atp/configure-endpoints-non-windows)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### ES-2: Use centrally managed modern anti-malware software

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41265.).

**Guidance**: Not applicable; Azure Virtual WAN does not interact with compute hosts, containers or storage endpoints requiring anti-malware protection.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### ES-3: Ensure anti-malware software and signatures are updated

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41266.).

**Guidance**: Ensure antimalware signatures are updated in a timely and consistent manner. Follow recommendations in Azure Security Center's "Compute &amp; Apps" section to ensure all virtual machines and/or containers are up to date with the latest signatures.

Microsoft's Antimalware processes will automatically install the latest signatures and engine updates by default. For Linux, use a third-party antimalware solution.
- [How to deploy Microsoft Antimalware for Azure Cloud Services and Virtual Machines](../security/fundamentals/antimalware.md)

- [Endpoint protection assessment and recommendations in Azure Security Center](../security-center/security-center-endpoint-protection.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Microsoft

## Backup and Recovery

*For more information, see the [Azure Security Benchmark: Backup and Recovery](/azure/security/benchmarks/security-controls-v2-backup-recovery).*

### BR-1: Ensure regular automated backups

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41274.).

**Guidance**: Not applicable; Azure Virtual WAN does not offer or support any data-backup features.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### BR-2: Encrypt backup data

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41275.).

**Guidance**: Not applicable; Azure Virtual WAN does not offer or support any data-backup features.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### BR-3: Validate all backups including customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41276.).

**Guidance**: Not applicable; Azure Virtual WAN does not offer or support any data-backup features.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### BR-4: Mitigate risk of lost keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41277.).

**Guidance**: Not applicable; Azure Virtual WAN does not manage any keys.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Governance and Strategy

*For more information, see the [Azure Security Benchmark: Governance and Strategy](/azure/security/benchmarks/security-controls-v2-governance-strategy).*

### GS-1: Define asset management and data protection strategy 

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41286.).

**Guidance**: Ensure you document and communicate a clear strategy for continuous monitoring and protection of systems and data. Prioritize discovery, assessment, protection, and monitoring of business-critical data and systems. 

This strategy should include documented guidance, policy, and standards for the following elements: 

- Data classification standard in accordance with the business risks
- Security organization visibility into risks and asset inventory 
- Security organization approval of Azure services for use 
- Security of assets through their lifecycle
- Required access control strategy in accordance with organizational data classification
- Use of Azure native and third party data protection capabilities
- Data encryption requirements for in-transit and at-rest use cases
- Appropriate cryptographic standards

Review additional information available at the referenced links.

- [Azure Security Architecture Recommendation - Storage, data, and encryption](https://docs.microsoft.com/azure/architecture/framework/security/storage-data-encryption?toc=/security/compass/toc.json&amp;bc=/security/compass/breadcrumb/toc.json)

- [Azure Security Fundamentals - Azure Data security, encryption, and storage](../security/fundamentals/encryption-overview.md)

- [Cloud Adoption Framework - Azure data security and encryption best practices](https://docs.microsoft.com/azure/security/fundamentals/data-encryption-best-practices?toc=/azure/cloud-adoption-framework/toc.json&amp;bc=/azure/cloud-adoption-framework/_bread/toc.json)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### GS-2: Define enterprise segmentation strategy 

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41293.).

**Guidance**: Establish an enterprise-wide strategy to segmenting access to assets using a combination of identity, network, application, subscription, management group, and other controls. Carefully balance the need for security separation with the need to enable daily operation of the systems that need to communicate with each other and access data.

Ensure that the segmentation strategy is implemented consistently across control types including network security, identity and access models, and application permission or access models, and human process controls.

- [Guidance on segmentation strategy in Azure (video)](/security/compass/microsoft-security-compass-introduction#azure-components-and-reference-model-2151)

- [Guidance on segmentation strategy in Azure (document)](/security/compass/governance#enterprise-segmentation-strategy)

- [Align network segmentation with enterprise segmentation strategy](/security/compass/network-security-containment#align-network-segmentation-with-enterprise-segmentation-strategy)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### GS-3: Define security posture management strategy

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41287.).

**Guidance**: Continuously measure and mitigate risks to your individual assets and to the environment where they are hosted. Prioritize high value assets and highly-exposed attack surfaces, such as published applications, network ingress and egress points, user and administrator endpoints, and so on.

- [Azure Security Benchmark - Posture and vulnerability management](/azure/security/benchmarks/security-benchmark-v2-posture-vulnerability-management)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### GS-4: Align organization roles, responsibilities, and accountabilities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41288.).

**Guidance**: Ensure you document and
communicate a clear strategy for roles and responsibilities in your security
organization. Prioritize your efforts based on clear accountability for
security decisions, educating everyone on the shared responsibility model, and
educate technical teams on technology to secure the cloud.

- [Azure Security Best Practice 1 – People: Educate Teams on Cloud Security Journey](https://aka.ms/AzSec1)

- [Azure Security Best Practice 2 - People: Educate Teams on Cloud Security Technology](https://aka.ms/AzSec2)

- [Azure Security Best Practice 3 - Process: Assign Accountability for Cloud Security Decisions](https://aka.ms/AzSec3)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### GS-5: Define network security strategy

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41289.).

**Guidance**: Establish an Azure network security approach as part of your organization’s overall security access control strategy. This strategy should include documented guidance, policy, and standards for the following elements: 

- Centralized network management and security responsibility
- Virtual network segmentation model aligned with the enterprise segmentation strategy
- Remediation strategy in different threat and attack scenarios
- Internet edge and ingress and egress strategy
- Hybrid cloud and on-premises interconnectivity strategy
- Up-to-date network security artifacts (e.g. network diagrams, reference network architecture)

Review additional information available at the referenced links.

- [Azure Security Best Practice 11 - Architecture. Single unified security strategy](https://aka.ms/AzSec11)

- [Azure Security Benchmark - Network Security](/azure/security/benchmarks/security-benchmark-v2-network-security)

- [Azure network security overview](../security/fundamentals/network-overview.md)

- [Enterprise network architecture strategy](/azure/cloud-adoption-framework/ready/enterprise-scale/architecture)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### GS-6: Define identity and privileged access strategy

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41290.).

**Guidance**: Establish Azure identity and privileged access approaches as part of your organization’s overall security access control strategy. This strategy should include documented guidance, policy, and standards for the following elements: 

- A centralized identity and authentication system and its interconnectivity with other internal and external identity systems
- Strong authentication methods in different use cases and conditions
- Protection of highly privileged users
- Anomaly user activities monitoring and handling  
- User identity and access review and reconciliation process

Review additional information available at the referenced links.

- [Azure Security Benchmark - Identity management](/azure/security/benchmarks/security-benchmark-v2-identity-management)

- [Azure Security Benchmark - Privileged access](/azure/security/benchmarks/security-benchmark-v2-privileged-access)

- [Azure Security Best Practice 11 - Architecture. Single unified security strategy](https://aka.ms/AzSec11)

- [Azure identity management security overview](../security/fundamentals/identity-management-overview.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### GS-7: Define logging and threat response strategy

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/41291.).

**Guidance**: Establish a logging and threat response strategy to rapidly detect and remediate threats while meeting compliance requirements. Prioritize providing analysts with high quality alerts and seamless experiences so that they can focus on threats rather than integration and manual steps. 

This strategy should include documented guidance, policy and standards for the following elements: 

- The security operations (SecOps) organization’s role and responsibilities
- A well-defined incident response process aligning with NIST or another industry framework
- Log capture and retention to support threat detection, incident response, and compliance needs
- Centralized visibility of and correlation information about threats, using SIEM, native Azure capabilities, and other sources-Communication and notification plan with your customers, suppliers, and public parties of interest
- Use of Azure native and third-party platforms for incident handling, such as logging and threat detection, forensics, and attack remediation and eradication
- Processes for handling incidents and post-incident activities, such as lessons learned and evidence retention

Review additional information available at the referenced links.
- [Azure Security Benchmark - Logging and threat detection](/azure/security/benchmarks/security-benchmark-v2-logging-threat-detection)

- [Azure Security Benchmark - Incident response](/azure/security/benchmarks/security-benchmark-v2-incident-response)

- [Azure Security Best Practice 4 - Process. Update Incident Response Processes for Cloud](https://aka.ms/AzSec4)

- [Azure Adoption Framework, logging, and reporting decision guide](/azure/cloud-adoption-framework/decision-guides/logging-and-reporting/)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Next steps

- See the [Azure Security Benchmark V2 overview](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
