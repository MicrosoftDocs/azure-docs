---
title: Azure security baseline for Azure HPC Cache
description: The Azure HPC Cache security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: hpc-cache
ms.topic: conceptual
ms.date: 11/19/2020
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure HPC Cache

This security baseline applies guidance from the [Azure Security Benchmark version 2.0](../security/benchmarks/overview.md) to Microsoft Azure HPC Cache. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure HPC Cache. **Controls** not applicable to Azure HPC Cache have been excluded.

To see how Azure HPC Cache completely maps to the Azure Security Benchmark, see the [full Azure HPC Cache security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](../security/benchmarks/security-controls-v2-network-security.md).*

### NS-1: Implement security for internal traffic

**Guidance**: When you deploy Azure HPC Cache resources, you must create or use an existing virtual network. 

Ensure that all Azure virtual networks follow an enterprise segmentation principle that aligns to the business risks. Any system that could incur higher risk for the organization should be isolated within its own virtual network and sufficiently secured with either a network security group (NSG) and/or Azure Firewall.

Two network-related prerequisites should be set up before you can use your cache: 

- A dedicated subnet for the Azure HPC Cache instance

- DNS support so that the cache can access storage and other resources

The Azure HPC Cache needs a dedicated subnet with these qualities: 

- The subnet must have at least 64 IP addresses available.

- The subnet cannot host any other VMs, even for related services like client machines.

- If you use multiple Azure HPC Cache instances, each one needs its own subnet.

The best practice is to create a new subnet for each cache. You can create a new virtual network and subnet as part of creating the cache.

To use HPC Cache with on-premises NAS storage, you must ensure that certain ports in the on-premises network allow unrestricted traffic from the Azure HPC Cache's subnet. 

- [How to configure ports for NFS storage access](hpc-cache-prerequisites.md#nfs-storage-requirements)

- [How to create a network security group with security rules](../virtual-network/tutorial-filter-network-traffic.md)

 

- [How to deploy and configure Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### NS-2: Connect private networks together

**Guidance**: Use Azure ExpressRoute or Azure virtual private network (VPN) to create private connections between Azure datacenters and on-premises infrastructure in a colocation environment. ExpressRoute connections do not go over the public internet, and they offer more reliability, faster speeds, and lower latencies than typical internet connections. For point-to-site VPN and site-to-site VPN, you can connect on-premises devices or networks to a virtual network using any combination of these VPN options and Azure ExpressRoute. 

To connect two or more virtual networks in Azure together, use virtual network peering. Network traffic between peered virtual networks is private and is kept on the Azure backbone network.

- [What are the ExpressRoute connectivity models](../expressroute/expressroute-connectivity-models.md) 

- [Azure VPN overview](../vpn-gateway/vpn-gateway-about-vpngateways.md) 

- [Virtual network peering](../virtual-network/virtual-network-peering-overview.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### NS-3: Establish private network access to Azure services

**Guidance**: Use Azure Virtual Network service endpoints to provide secure access to HPC Cache. Service endpoints are an optimized route over the Azure backbone network without crossing the internet. 

HPC Cache does not support using Azure Private Link to secure its management endpoints to a private network. 

Private access is an additional defense-in-depth measure, in addition to authentication and traffic security offered by Azure services.

- [Understand Virtual Network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md) 

- [Understand how to mount the Azure HPC Cache](hpc-cache-mount.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### NS-4: Protect applications and services from external network attacks

**Guidance**: Protect your HPC Cache resources against attacks from external networks, including distributed denial of service (DDoS) Attacks, application-specific attacks, and unsolicited and potentially malicious internet traffic. 

Azure includes native capabilities for this protection: 

- Use Azure Firewall to protect applications and services against potentially malicious traffic from the internet and other external locations. 
- Protect your assets against DDoS attacks by enabling DDoS standard protection on your Azure virtual networks. 
- Use Azure Security Center to detect misconfiguration risks related to your network resources.

Azure HPC Cache is not intended to run web applications, and does not require you to configure any additional settings or deploy any extra network services to protect it from external network attacks that target web applications.

- [Azure Firewall Documentation](../firewall/index.yml) 

- [Manage Azure DDoS Protection Standard using the Azure portal](../ddos-protection/manage-ddos-protection.md) 

- [Azure Security Center recommendations](../security-center/recommendations-reference.md#recs-networking)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### NS-5: Deploy intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Use Azure Firewall with threat-intelligence-based filtering to alert on and/or block traffic to and from known malicious IP addresses and domains. The IP addresses and domains are sourced from the Microsoft Threat Intelligence feed. 

When payload inspection is required, you can deploy a third-party intrusion detection/intrusion prevent system (IDS/IPS) solution from Azure Marketplace with payload inspection capabilities. Alternately you may choose to use host-based IDS/IPS or a host-based endpoint detection and response (EDR) solution in conjunction with or instead of network-based IDS/IPS.

Note: If you have a regulatory or other requirement for IDS/IPS use, ensure that it is always tuned to provide high-quality alerts to your SIEM solution.

- [How to deploy Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md) 

- [Azure Marketplace third-party IDS capabilities](https://azuremarketplace.microsoft.com/marketplace?search=IDS) 

- [Microsoft Defender ATP EDR capability](/windows/security/threat-protection/microsoft-defender-atp/overview-endpoint-detection-response)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### NS-6: Simplify network security rules

**Guidance**: Not applicable; this recommendation is intended for offerings that can be deployed into Azure Virtual Networks, or have the capability to define groupings of allowed IP ranges for efficient management. HPC Cache does not currently support service tags. 

The best practice is to create a new subnet for each cache. You can create a new virtual network and subnet as part of creating the cache.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### NS-7: Secure Domain Name Service (DNS)

**Guidance**: Follow the best practices for DNS security to mitigate against common attacks like dangling DNS, DNS amplifications attacks, DNS poisoning and spoofing, and others.

Azure HPC Cache needs DNS to access resources outside of the cache's private virtual network. If your workflow includes resources outside of Azure, you need to set up and secure your own DNS server in addition to using Azure DNS.

- To access Azure Blob storage endpoints, Azure-based client machines, or other Azure resources, use Azure DNS.
- To access on-premises storage, or to connect to the cache from clients outside of Azure, you need to create a custom DNS server that can resolve those hostnames.
- If your workflow includes both internal and external resources, set up your custom DNS server to forward Azure-specific resolution requests to the Azure DNS server. 

When Azure DNS is used as your authoritative DNS service, ensure that DNS zones and records are protected from accidental or malicious modification by using Azure RBAC and resource locks.

If configuring your own DNS server, make sure to follow these security guidelines:

- [Secure Domain Name System (DNS) Deployment Guide](https://csrc.nist.gov/publications/detail/sp/800-81/2/final) 

- [Prevent dangling DNS entries and avoid subdomain takeover](../security/fundamentals/subdomain-takeover.md) 

- [Read more about DNS access requirements for HPC Cache](hpc-cache-prerequisites.md#dns-access)

- [Azure DNS overview](../dns/dns-overview.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Identity Management

*For more information, see the [Azure Security Benchmark: Identity Management](../security/benchmarks/security-controls-v2-identity-management.md).*

### IM-1: Standardize Azure Active Directory as the central identity and authentication system

**Guidance**: Azure HPC Cache is not integrated with Azure Active Directory for internal operations. However, Azure AD can be used to authenticate users in the Azure portal or CLI in order to create, view, and manage HPC Cache deployments and related components.

Azure Active Directory (Azure AD) is the default identity and access management service in Azure. You should standardize Azure AD to govern your organization’s identity and access management in:

- Microsoft Cloud resources, such as the Azure portal, Azure Storage, Azure Virtual Machine (Linux and Windows), Azure Key Vault, PaaS, and SaaS applications.

- Your organization's resources, such as applications on Azure or your corporate network resources.

Securing Azure AD should be a high priority in your organization’s cloud security practice. Azure AD provides an identity secure score to help you assess identity security posture relative to Microsoft’s best practice recommendations. Use the score to gauge how closely your configuration matches best practice recommendations, and to make improvements in your security posture.

Note: Azure AD supports external identity that allows users without a Microsoft account to sign in to their applications and resources with their external identity.

- [Tenancy in Azure Active Directory](../active-directory/develop/single-and-multi-tenant-apps.md) 

- [How to create and configure an Azure AD instance](../active-directory/fundamentals/active-directory-access-create-new-tenant.md) 

- [Use external identity providers for an application](../active-directory/external-identities/identity-providers.md) 

- [What is the identity secure score in Azure Active Directory](../active-directory/fundamentals/identity-secure-score.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IM-2: Manage application identities securely and automatically

**Guidance**: HPC Cache uses Azure-managed identities for non-human accounts such as services or automation. It is recommended to use Azure's managed identity feature instead of creating a more powerful human account to access or execute your resources. 

HPC Cache can natively authenticate to Azure services/resources that support Azure AD authentication through predefined access grant rules. This avoids the need to use hard-coded credentials in source code or configuration files.

- [Azure-managed identities](../active-directory/managed-identities-azure-resources/overview.md) 

- [Services that support managed identities for Azure resources](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IM-3: Use Azure AD single sign-on (SSO) for application access

**Guidance**: Azure HPC Cache does not integrate with Azure AD for internal operations. However, Azure AD can be used to authenticate users in the Azure portal or CLI in order to create, view, and manage HPC Cache deployments and related components.

Azure Active Directory provides identity and access management to Azure resources, cloud applications, and on-premises applications. This includes enterprise identities such as employees, as well as external identities such as partners, vendors, and suppliers. This enables single sign-on (SSO) to manage and secure access to your organization’s data and resources on-premises and in the cloud. Connect all your users, applications, and devices to the Azure AD for seamless, secure access and greater visibility and control.

- [Understand Application SSO with Azure AD](../active-directory/manage-apps/what-is-single-sign-on.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IM-4: Use strong authentication controls for all Azure Active Directory based access

**Guidance**: Although Azure HPC Cache does not integrate with Azure AD for internal operations, Azure AD can be used to authenticate users in the Azure portal or CLI in order to create, view, and manage HPC Cache deployments and related components.  

Azure AD supports strong authentication controls through multi-factor authentication (MFA), and strong passwordless methods.

- Multi-factor authentication: Enable Azure AD MFA and follow Azure Security Center Identity and Access Management recommendations for some best practices in your MFA setup. MFA can be enforced on all users, select users, or at the per-user level based on sign-in conditions and risk factors.
- Passwordless authentication – Three passwordless authentication options are available: Windows Hello for Business, Microsoft Authenticator app, and on-premises authentication methods such as smart cards.

For administrator and privileged users, make sure to use the highest level of the strong authentication method. Roll out the appropriate strong authentication policy to other users.

Azure HPC Cache also supports legacy password-based authentication for client systems that connect to the cache. These kinds of connections include cloud-only accounts (user accounts created directly in Azure) that have a baseline password policy or hybrid accounts (user accounts that come from on-premises Active Directory) that will follow the on-premises password policies. 

When using password-based authentication, Azure AD provides a password protection capability that prevents users from setting passwords that are easy to guess. Microsoft provides a global list of banned passwords that is updated based on telemetry, and customers can augment the list based on their needs (for example with branding, cultural references, and so on). This password protection can be used for cloud-only and hybrid accounts.

Note: Authentication based on password credentials alone is susceptible to popular attack methods. For higher security, use strong authentication such as MFA and a strong password policy. If you use third-party applications and marketplace services that have default passwords, set a new, secure password the first time you set up the service. 

- [How to enable MFA in Azure](../active-directory/authentication/howto-mfa-getstarted.md) 

- [Introduction to passwordless authentication options for Azure Active Directory](../active-directory/authentication/concept-authentication-passwordless.md)

- [Azure AD default password policy](../active-directory/authentication/concept-sspr-policy.md#password-policies-that-only-apply-to-cloud-user-accounts)

- [Eliminate bad passwords using Azure AD Password Protection](../active-directory/authentication/concept-password-ban-bad.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### IM-5: Monitor and alert on account anomalies

**Guidance**: Azure HPC Cache can use Azure Active Directory for user management from the Azure portal.  Azure Active Directory provides the following data sources:

- Sign-ins - The sign-ins report provides information about the usage of managed applications and user sign-in activities.

- Audit logs - Provides traceability through logs for all changes done by various features within Azure AD. Examples of audit logs include changes made to any resources within Azure AD like adding or removing users, apps, groups, roles and policies.

- Risky sign-ins - A risky sign-in is an indicator for a sign-in attempt that might have been performed by someone who is not the legitimate owner of a user account.

- Users flagged for risk - A risky user is an indicator for a user account that might have been compromised.

These data sources can be integrated with Azure Monitor, Azure Sentinel or third-party SIEM systems.

Azure Security Center can also alert on certain suspicious activities, such as excessive number of failed authentication attempts, and on deprecated accounts in the subscription.

Azure Advanced Threat Protection (ATP) is a security solution that can use Active Directory signals to identify, detect, and investigate advanced threats, compromised identities, and malicious insider actions.

- [Audit activity reports in Azure Active Directory](../active-directory/reports-monitoring/concept-audit-logs.md)

- [How to view Azure AD risky sign-ins](../active-directory/identity-protection/overview-identity-protection.md) 

- [How to identify Azure AD users flagged for risky activity](../active-directory/identity-protection/overview-identity-protection.md) 

- [How to monitor users' identity and access activity in Azure Security Center](../security-center/security-center-identity-access.md)

 

- [Alerts in Azure Security Center's threat intelligence protection module](../security-center/alerts-reference.md) 

- [How to integrate Azure Activity Logs into Azure Monitor](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### IM-7: Eliminate unintended credential exposure

**Guidance**: Not applicable; HPC Cache doesn't allow customers to deploy any persisted data into the running environment.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Privileged Access

*For more information, see the [Azure Security Benchmark: Privileged Access](../security/benchmarks/security-controls-v2-privileged-access.md).*

### PA-2: Restrict administrative access to business-critical systems

**Guidance**: HPC Cache uses Azure RBAC to isolate access to business-critical systems by restricting which accounts are granted privileged access to the subscriptions and management groups they are in.

Create standard operating procedures around the use of dedicated administrative accounts. To create a cache, HPC Cache requires the users to have sufficient privileges in the subscription to create NICs. If using Blob storage, the Azure roles Storage Account Contributor and Storage Blob Data Contributor are required for HPC Cache to access the storage. 

Ensure that you also restrict access to the management, identity, and security systems that have administrative access to your business-critical assets, such as Active Directory Domain Controllers (DCs), security tools, and system management tools with agents installed on business critical systems. Attackers who compromise these management and security systems can immediately weaponize them to compromise business-critical assets.

All types of access controls should be aligned to your enterprise segmentation strategy to ensure consistent access control.

- [Azure HPC Cache RBAC permissions](hpc-cache-prerequisites.md#permissions)

- [Azure Components and Reference model](/security/compass/microsoft-security-compass-introduction#azure-components-and-reference-model-2151) 

- [Management Group Access](../governance/management-groups/overview.md#management-group-access)

- [Azure subscription administrators](../cost-management-billing/manage/add-change-subscription-administrator.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### PA-3: Review and reconcile user access regularly

**Guidance**: Review user accounts and access assignment regularly to ensure that the accounts and their access levels are valid. 

Azure HPC Cache can use Azure Active Directory (Azure AD) accounts to manage user access through the Azure portal and related interfaces. Azure AD offers access reviews that help you review group memberships, access to enterprise applications, and role assignments. Azure AD reporting can provide logs to help discover stale accounts. You can also use Azure AD Privileged Identity Management to create access review report workflow to facilitate the review process.

In addition, Azure Privileged Identity Management can be configured to alert when an excessive number of administrator accounts are created, and to identify administrator accounts that are stale or improperly configured.

Note: Some Azure services support local users and roles which are not managed through Azure AD. You will need to manage these users separately.

When using NFS storage targets, you will need to work with your network administrators and firewall managers to verify access settings and ensure that Azure HPC Cache will be able to communicate with the NFS storage systems.

- [For a list of HPC Cache permissions, read the Azure HPC Cache prerequisites](hpc-cache-prerequisites.md) 

- [Create an access review of Azure resource roles in Privileged Identity Management (PIM)](../active-directory/privileged-identity-management/pim-resource-roles-start-access-review.md) 

- [How to use Azure AD identity and access reviews](../active-directory/governance/access-reviews-overview.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### PA-4: Set up emergency access in Azure AD

**Guidance**: HPC Cache can use Azure Active Directory to manage resource access through the Azure portal. To prevent being accidentally locked out of your Azure AD organization, set up an emergency access account for access when normal administrative accounts cannot be used. Emergency access accounts are usually highly privileged, and they should not be assigned to specific individuals. Emergency access accounts are limited to emergency or "break glass"' scenarios where normal administrative accounts can't be used.

You should ensure that the credentials (such as password, certificate, or smart card) for emergency access accounts are kept secure and known only to individuals who are authorized to use them only in an emergency.

- [Manage emergency access accounts in Azure AD](../active-directory/roles/security-emergency-access.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### PA-5: Automate entitlement management 

**Guidance**: HPC Cache can use Azure Active Directory to manage access to cache resources through the Azure portal. 

Use Azure AD entitlement management features to automate access request workflows, including access assignments, reviews, and expiration. Dual or multi-stage approval is also supported. 

- [What are Azure AD access reviews](../active-directory/governance/access-reviews-overview.md) 

- [What is Azure AD entitlement management](../active-directory/governance/entitlement-management-overview.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### PA-7: Follow just enough administration (least privilege principle) 

**Guidance**: HPC Cache is integrated with Azure role-based access control (RBAC) to manage its resources. Azure RBAC allows you to manage Azure resource access through role assignments. You can assign these roles to users, groups service principals and managed identities. There are pre-defined built-in roles for certain resources, and these roles can be inventoried or queried through tools such as Azure CLI, Azure PowerShell or the Azure portal. 

The privileges you assign to resources through Azure RBAC should be always limited to what is required by the roles. This complements the just-in-time (JIT) approach of Azure AD Privileged Identity Management (PIM) and should be reviewed periodically.

Use built-in roles to allocate permission and only create custom role when required.

- [What is Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md) 

- [How to configure Azure RBAC](../role-based-access-control/role-assignments-portal.md) 

- [How to use Azure AD identity and access reviews](../active-directory/governance/access-reviews-overview.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](../security/benchmarks/security-controls-v2-data-protection.md).*

### DP-1: Discover, classify, and label sensitive data 

**Guidance**: HPC Cache manages sensitive data but doesn't have capability to discovery, classify, and labeling sensitive data.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### DP-2: Protect sensitive data

**Guidance**: Protect sensitive data by restricting access using Azure Role Based Access Control (Azure RBAC), network-based access controls, and specific controls in Azure services (such as encryption in SQL and other databases).

To ensure consistent access control, all types of access control should be aligned to your enterprise segmentation strategy. The enterprise segmentation strategy should also be informed by the location of sensitive or business critical data and systems.

For the underlying platform, which is managed by Microsoft, Microsoft treats all customer content as sensitive and guards against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented some default data protection controls and capabilities.

- [Azure Role Based Access Control (RBAC)](../role-based-access-control/overview.md) 

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### DP-3: Monitor for unauthorized transfer of sensitive data

**Guidance**: HPC Cache transmits sensitive data but does not support monitoring for unauthorized transfer of sensitive data.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### DP-4: Encrypt sensitive information in transit

**Guidance**: HPC Cache supports data encryption in transit with TLS v1.2 or greater.

While this is optional for traffic on private networks, this is critical for traffic on external and public networks. For HTTP traffic, ensure that any clients connecting to your Azure resources can negotiate TLS v1.2 or greater. For remote management, use SSH (for Linux) or RDP/TLS (for Windows) instead of an unencrypted protocol. Obsoleted SSL, TLS, and SSH versions and protocols, and weak ciphers should be disabled.

By default, Azure provides encryption for data in transit between Azure data centers.

- [Understand encryption in transit with Azure](../security/fundamentals/encryption-overview.md#encryption-of-data-in-transit) 

- [Information on TLS Security](/security/engineering/solving-tls1-problem) 

- [Double encryption for Azure data in transit](../security/fundamentals/double-encryption.md#data-in-transit)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### DP-5: Encrypt sensitive data at rest

**Guidance**: To complement access controls, data at rest should be protected against "out of band" attacks (for example, accessing underlying storage) using encryption. This helps ensure that attackers cannot easily read or modify the data.

Azure provides data at rest encryption by default. For highly sensitive data, you have options to implement additional encryption at rest on all Azure resources where available. Azure manages your encryption keys by default, but Azure provides options to manage your own keys (customer-managed keys) for certain Azure services.

All data stored in Azure, including on the cache disks, is encrypted at rest using Microsoft-managed keys by default. You only need to customize Azure HPC Cache settings if you want to manage the keys used to encrypt your data.

If required for compliance on compute resources, implement a third-party tool, such as an automated host-based Data Loss Prevention solution, to enforce access controls to data even when data is copied off a system.

- [How to use customer-managed encryption keys with Azure HPC Cache](./hpc-cache-create.md?tabs=azure-portal#enable-azure-key-vault-encryption-optional)

- [Understand encryption at rest in Azure](../security/fundamentals/encryption-atrest.md#encryption-at-rest-in-microsoft-cloud-services) 

- [How to configure customer-managed encryption keys](../storage/common/customer-managed-keys-configure-key-vault.md) 

- [Encryption Model and key management table](../security/fundamentals/encryption-atrest.md)

 

- [Data at rest double encryption in Azure](../security/fundamentals/double-encryption.md#data-at-rest)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Asset Management

*For more information, see the [Azure Security Benchmark: Asset Management](../security/benchmarks/security-controls-v2-asset-management.md).*

### AM-1: Ensure security team has visibility into risks for assets

**Guidance**: Ensure security teams are granted Security Reader permissions in your Azure tenant and subscriptions so they can monitor for security risks using Azure Security Center. 

Depending on how security team responsibilities are structured, monitoring for security risks could  be the responsibility of a central security team or a local team. That said, security insights and risks must always be aggregated centrally within an organization. 

Security Reader permissions can be applied broadly to an entire tenant (Root Management Group) or scoped to management groups or specific subscriptions. 

Note: Additional permissions might be required to get visibility into workloads and services. 

- [Overview of Security Reader Role](../role-based-access-control/built-in-roles.md#security-reader)

- [Overview of Azure Management Groups](../governance/management-groups/overview.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### AM-2: Ensure security team has access to asset inventory and metadata

**Guidance**: Azure HPC Cache supports using tags. Apply tags to your Azure resources, resource groups, and subscriptions to logically organize them into a taxonomy. Each tag consists of a name and a value pair. 

For example, you can apply the name "Environment" and the value "Production" to all the resources in production. Tags can be added when creating a cache as well as after the cache is deployed. 

Use Azure Virtual Machine Inventory to automate the collection of information about software on Virtual Machines. Software Name, Version, publisher, and Refresh time are available from the Azure portal. To get access to install date and other information, enable guest-level diagnostics and bring the Windows Event Logs into a Log Analytics Workspace.
HPC Cache does not allow running an application or installation of software on its resources. 

- [How to create queries with Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md) 

- [Azure Security Center asset inventory management](../security-center/asset-inventory.md) 

- [Resource naming and tagging decision guide](/azure/cloud-adoption-framework/decision-guides/resource-tagging/?toc=%2fazure%2fazure-resource-manager%2fmanagement%2ftoc.json) 

- [How to enable Azure virtual machine inventory](../automation/automation-tutorial-installed-software.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### AM-3: Use only approved Azure services

**Guidance**: HPC Cache supports Azure Resource Manager deployments. Use Azure Policy to audit and restrict which services users can provision in your environment. Use Azure Resource Graph to query for and discover resources within their subscriptions. You can also use Azure Monitor to create rules to trigger alerts when a non-approved service is detected.

- [Configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md) 

- [How to deny a specific resource type with Azure Policy](../governance/policy/samples/index.md) 

- [How to create queries with Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### AM-4: Ensure security of asset lifecycle management

**Guidance**: Not applicable. Azure HPC Cache cannot be used for ensuring security of assets in a lifecycle management process. It is the customer's responsibility to maintain attributes and network configurations of assets that are considered high impact. 

It is recommended that the customer create a process to capture the attribute and network configuration changes, measure the change impact, and create remediation tasks as applicable.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Logging and Threat Detection

*For more information, see the [Azure Security Benchmark: Logging and Threat Detection](../security/benchmarks/security-controls-v2-logging-threat-detection.md).*

### LT-1: Enable threat detection for Azure resources

**Guidance**: Use the Azure Security Center built-in threat detection capability and enable Azure Defender (Formally Azure Advanced Threat Protection) for your HPC Cache resources. Azure Defender for HPC Cache provides an additional layer of security intelligence that detects unusual and potentially harmful attempts to access or exploit your cache resources.

Forward any logs from HPC Cache to your SIEM which can be used to set up custom threat detections. Ensure you are monitoring different types of Azure assets for potential threats and anomalies. Focus on getting high-quality alerts to reduce false positives for analysts to sort through. Alerts can be sourced from log data, agents, or other data.

- [Threat protection in Azure Security Center](../security-center/azure-defender.md) 

- [Azure Security Center security alerts reference guide](../security-center/alerts-reference.md) 

- [Create custom analytics rules to detect threats](../sentinel/tutorial-detect-threats-custom.md) 

- [Cyber threat intelligence with Azure Sentinel](/azure/architecture/example-scenario/data/sentinel-threat-intelligence)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### LT-2: Enable threat detection for Azure identity and access management

**Guidance**: Azure AD provides the following user logs that can be viewed in Azure AD reporting or integrated with Azure Monitor, Azure Sentinel, or other SIEM/monitoring tools for more sophisticated monitoring and analytics use cases:
- Sign-ins – The sign-ins report provides information about the usage of managed applications and user sign-in activities.

- Audit logs - Provide traceability through logs for all changes done by various features within Azure AD. Examples of audit logs include changes made to any resources within Azure AD, like adding or removing users, apps, groups, roles, and policies.

- Risky sign-ins - A risky sign-in is an indicator for a sign-in attempt that might have been performed by someone who is not the legitimate owner of a user account.

- Users flagged for risk - A risky user is an indicator for a user account that might have been compromised.

Azure Security Center can also alert on certain suspicious activities such as excessive number of failed authentication attempts, or deprecated accounts in the subscription. In addition to the basic security hygiene monitoring, Azure Security Center’s Threat Protection module can also collect more in-depth security alerts from individual Azure compute resources (virtual machines, containers, app service), data resources (SQL DB and storage), and Azure service layers. This capability allows you to have visibility on account anomalies inside the individual resources.

- [Audit activity reports in Azure Active Directory](../active-directory/reports-monitoring/concept-audit-logs.md) 

- [Enable Azure Identity Protection](../active-directory/identity-protection/overview-identity-protection.md) 

- [Threat protection in Azure Security Center](../security-center/azure-defender.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### LT-3: Enable logging for Azure network activities

**Guidance**: You can use VPN gateways and their packet capture capability in addition to commonly available packet capture tools to record network packets traveling between your virtual networks.

Deploy a network security group on the network where your Azure HPC Cache resources are deployed. Enable network security group flow logs on your network security groups for traffic auditing.

Your flow logs are retained in a storage account. Enable the Traffic Analytics solution to process and send those flow logs to a Log Analytics workspace. Traffic Analytics provides additional insights into traffic flow for your Azure networks. Traffic Analytics can help you visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

The cache needs DNS to access resources outside of its virtual network. Depending on which resources you are using, you might need to set up a customized DNS server and configure forwarding between that server and Azure DNS servers. 

Implement a third-party solution from Azure Marketplace for DNS logging solution as per your organizations need.

- [Configure packet captures for VPN gateways](../vpn-gateway/packet-capture.md) 

- [How to enable network security group flow logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md) 

- [How to enable and use Traffic Analytics](../network-watcher/traffic-analytics.md) 

- [Understand network security provided by Azure Security Center](../security-center/security-center-network-recommendations.md) 

- [Learn more about the DNS prerequisites](hpc-cache-prerequisites.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### LT-4: Enable logging for Azure resources

**Guidance**: Azure HPC Cache resources automatically create activity logs. These logs contain all write operations (PUT, POST, DELETE) but do not include read operations (GET). Activity logs can be used to find an error when troubleshooting, or to monitor how a user in your organization modified a resource.

You also can use Azure Security Center and Azure Policy to enable Azure resource logs for HPC Cache, and to and log data collecting. These logs can be critical for later investigating security incidents and performing forensic exercises.

- [How to collect platform logs and metrics with Azure Monitor](../azure-monitor/essentials/diagnostic-settings.md) 

- [Understand logging and different log types in Azure](../azure-monitor/essentials/platform-logs-overview.md) 

- [Understand Azure Security Center data collection](../security-center/security-center-enable-data-collection.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### LT-5: Centralize security log management and analysis

**Guidance**: Centralize logging storage and analysis to enable correlation. For each log source, ensure that you have assigned a data owner, access guidance, storage location, what tools are used to process and access the data, and data retention requirements.

Ensure you are integrating Azure activity logs into your central logging. Ingest logs via Azure Monitor to aggregate security data generated by endpoint devices, network resources, and other security systems. In Azure Monitor, use Log Analytics workspaces to query and perform analytics, and use Azure Storage accounts for long term and archival storage.

In addition, enable and onboard data to Azure Sentinel or a third-party SIEM.

Many organizations choose to use Azure Sentinel for “hot” data that is used frequently and Azure Storage for “cold” data that is used less frequently.

- [How to collect platform logs and metrics with Azure Monitor](../azure-monitor/essentials/diagnostic-settings.md) 

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](../security/benchmarks/security-controls-v2-incident-response.md).*

### IR-1: Preparation – update incident response process for Azure

**Guidance**: Ensure your organization has processes to respond to security incidents, has updated these processes for Azure, and is regularly exercising them to ensure readiness.

- [Implement security across the enterprise environment](/azure/cloud-adoption-framework/security/security-top-10#4-process-update-incident-response-ir-processes-for-cloud)

- [Incident response reference guide](/microsoft-365/downloads/IR-Reference-Guide.pdf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IR-2: Preparation – set up incident notification 

**Guidance**: Set up security incident contact information in Azure Security Center. This contact information is used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. You also have options to customize incident alert and notification in different Azure services based on your incident response needs. 

- [How to set the Azure Security Center security contact](../security-center/security-center-provide-security-contact-details.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### IR-3: Detection and analysis – create incidents based on high quality alerts

**Guidance**: Ensure you have a process to create high-quality alerts and measure the quality of alerts. This allows you to learn lessons from past incidents and prioritize alerts for analysts, so they don’t waste time on false positives. 

High-quality alerts can be built based on experience from past incidents, validated community sources, and tools designed to generate and clean up alerts by fusing and correlating diverse signal sources. 

Azure Security Center provides high-quality alerts across many Azure assets. You can use the ASC data connector to stream the alerts to Azure Sentinel. Azure Sentinel lets you create advanced alert rules to generate incidents automatically for an investigation. 

Export your Azure Security Center alerts and recommendations using the export feature to help identify risks to Azure resources. Export alerts and recommendations either manually or in an ongoing, continuous fashion.

- [How to configure export](../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../sentinel/connect-azure-security-center.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### IR-4: Detection and analysis – investigate an incident

**Guidance**: Ensure analysts can query and use diverse data sources as they investigate potential incidents, to build a full view of what happened. Diverse logs should be collected to track the activities of a potential attacker across the kill chain to avoid blind spots.  You should also ensure insights and learnings are captured for other analysts and for future historical reference.  

The data sources for investigation include the centralized logging sources that are already being collected from the in-scope services and running systems, but can also include:

- Network data – use network security groups' flow logs, Azure Network Watcher, and Azure Monitor to capture network flow logs and other analytics information. 

- Snapshots of running systems: 

    - Use Azure virtual machine's snapshot capability to create a snapshot of the running system's disk. 

    - Use the operating system's native memory dump capability to create a snapshot of the running system's memory.

    - Use the snapshot feature of the Azure services or your software's own capability to create snapshots of the running systems.

Azure Sentinel provides extensive data analytics across virtually any log source and a case management portal to manage the full lifecycle of incidents. Intelligence information during an investigation can be associated with an incident for tracking and reporting purposes. 

- [Snapshot a Windows machine's disk](../virtual-machines/windows/snapshot-copy-managed-disk.md)

- [Snapshot a Linux machine's disk](../virtual-machines/linux/snapshot-copy-managed-disk.md)

- [Microsoft Azure Support diagnostic information and memory dump collection](https://azure.microsoft.com/support/legal/support-diagnostic-information-collection/) 

- [Investigate incidents with Azure Sentinel](../sentinel/tutorial-investigate-cases.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IR-5: Detection and analysis – prioritize incidents

**Guidance**: Provide context to analysts on which incidents to focus on first based on alert severity and asset sensitivity. 

Azure Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytically used to issue the alert, as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, mark resources using tags and create a naming system to identify and categorize Azure resources, especially those processing sensitive data.  It is your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

- [Security alerts in Azure Security Center](../security-center/security-center-alerts-overview.md)

- [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### IR-6: Containment, eradication and recovery – automate the incident handling

**Guidance**: Automate manual repetitive tasks to speed up response time and reduce the burden on analysts. Manual tasks take longer to execute, slowing each incident and reducing how many incidents an analyst can handle. Manual tasks also increase analyst fatigue, which increases the risk of human error that causes delays, and degrades the ability of analysts to focus effectively on complex tasks. 
Use workflow automation features in Azure Security Center and Azure Sentinel to automatically trigger actions or run a playbook to respond to incoming security alerts. The playbook takes actions, such as sending notifications, disabling accounts, and isolating problematic networks. 

- [Configure workflow automation in Security Center](../security-center/workflow-automation.md)

- [Set up automated threat responses in Azure Security Center](../security-center/tutorial-security-incident.md#triage-security-alerts)

- [Set up automated threat responses in Azure Sentinel](../sentinel/tutorial-respond-threats-playbook.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Posture and Vulnerability Management

*For more information, see the [Azure Security Benchmark: Posture and Vulnerability Management](../security/benchmarks/security-controls-v2-posture-vulnerability-management.md).*

### PV-3: Establish secure configurations for compute resources

**Guidance**: Use Azure Security Center and Azure Policy to establish secure configurations on all compute resources including VMs, containers, and others.

- [How to monitor Azure Security Center recommendations](../security-center/security-center-recommendations.md) 

- [Security recommendations - a reference guide](../security-center/recommendations-reference.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### PV-8: Conduct regular attack simulation

**Guidance**: As required, conduct penetration testing or red team activities on your Azure resources and ensure remediation of all critical security findings.
Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.

- [Penetration testing in Azure](../security/fundamentals/pen-testing.md)

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1) 

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Backup and Recovery

*For more information, see the [Azure Security Benchmark: Backup and Recovery](../security/benchmarks/security-controls-v2-backup-recovery.md).*

### BR-1: Ensure regular automated backups

**Guidance**: Because Azure HPC Cache is a caching solution and not a storage system, focus on ensuring that data in its storage targets is regularly backed up. Follow standard procedures for Azure Blob containers and for backing up any on-premises storage targets. 

To minimize disruption in the event of a regional outage, you can take steps to ensure cross-region data access.  

Each Azure HPC Cache instance runs within a particular subscription and in one region. This means that your cache workflow could possibly be disrupted if the region has a full outage. To minimize this disruption, the organization should use back-end storage that is accessible from multiple regions. This storage can be either an on-premises NAS system with appropriate DNS support, or Azure Blob storage that resides in a different region from the cache.

As your workflow proceeds in your primary region, data is saved in the long-term storage outside of the region. If the cache region becomes unavailable, you can create a duplicate Azure HPC Cache instance in a secondary region, connect to the same storage, and resume work from the new cache.

- [Read more about regional failover](hpc-region-recovery.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### BR-2: Encrypt backup data

**Guidance**: Ensure your backups are protected against attacks. This should include encryption of the backups to protect against loss of confidentiality.

For on-premises backup using Azure Backup, encryption-at-rest is provided using the passphrase you provide. For regular Azure service backup, backup data is automatically encrypted using Azure platform-managed keys. You can choose to encrypt the backup using customer-managed keys. In this case, ensure that this customer-managed key in the key vault is also in the backup scope.

Azure HPC Cache also is protected by VM host encryption on the managed disks that hold your cached data, even if you add a customer key for the cache disks. Adding a customer-managed key for double encryption gives an extra level of security for customers with high security needs. Read Server-side encryption of Azure disk storage for details.

Use role-based access control in Azure Backup, Azure Key Vault, or other resources to protect backups and customer-managed keys. Additionally, you can enable advanced security features to require MFA before backups can be altered or deleted.

- [VM host encryption](../virtual-machines/disk-encryption.md#encryption-at-host---end-to-end-encryption-for-your-vm-data)

- [Server-side encryption of Azure disk storage](../virtual-machines/disk-encryption.md)

- [Overview of security features in Azure Backup](../backup/security-overview.md) 

- [Encryption of backup data using customer-managed keys](../backup/encryption-at-rest-with-cmk.md)  

- [How to back up Key Vault keys in Azure](/powershell/module/az.keyvault/backup-azkeyvaultkey?preserve-view=true&view=azps-5.1.0)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### BR-3: Validate all backups including customer-managed keys

**Guidance**: Periodically ensure that you can restore backed-up customer-managed keys.

- [How to restore Key Vault keys in Azure](/powershell/module/az.keyvault/restore-azkeyvaultkey?preserve-view=true&view=azps-5.1.0)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### BR-4: Mitigate risk of lost keys

**Guidance**: Ensure you have measures in place to prevent and recover from loss of keys. Enable soft delete and purge protection in Azure Key Vault to protect keys against accidental or malicious deletion.

- [How to enable soft delete and purge protection in Key Vault](../storage/blobs/soft-delete-blob-overview.md?tabs=azure-portal)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Governance and Strategy

*For more information, see the [Azure Security Benchmark: Governance and Strategy](../security/benchmarks/security-controls-v2-governance-strategy.md).*

### GS-1: Define asset management and data protection strategy 

**Guidance**: Ensure you document and communicate a clear strategy for continuous monitoring and protection of systems and data. Prioritize discovery, assessment, protection, and monitoring of business-critical data and systems. 

This strategy should include documented guidance, policy, and standards for the following elements: 

-	Data classification standard in accordance with the business risks

-	Security organization visibility into risks and asset inventory 

-	Security organization approval of Azure services for use 

-	Security of assets through their lifecycle

-	Required access control strategy in accordance with organizational data classification

-	Use of Azure native and third-party data protection capabilities

-	Data encryption requirements for in-transit and at-rest use cases

-	Appropriate cryptographic standards

For more information, see the following references:
- [Azure Security Architecture Recommendation - Storage, data, and encryption](/azure/architecture/framework/security/storage-data-encryption?bc=%2fsecurity%2fcompass%2fbreadcrumb%2ftoc.json&toc=%2fsecurity%2fcompass%2ftoc.json)

- [Azure Security Fundamentals - Azure Data security, encryption, and storage](../security/fundamentals/encryption-overview.md)

- [Cloud Adoption Framework - Azure data security and encryption best practices](../security/fundamentals/data-encryption-best-practices.md?bc=%2fazure%2fcloud-adoption-framework%2f_bread%2ftoc.json&toc=%2fazure%2fcloud-adoption-framework%2ftoc.json)

- [Azure Security Benchmark - Asset management](../security/benchmarks/security-controls-v2-asset-management.md)

- [Azure Security Benchmark - Data Protection](../security/benchmarks/security-controls-v2-data-protection.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-2: Define enterprise segmentation strategy 

**Guidance**: Establish an enterprise-wide strategy to segmenting access to assets using a combination of identity, network, application, subscription, management group, and other controls.

Carefully balance the need for security separation with the need to enable daily operation of the systems that need to communicate with each other and access data.

Ensure that the segmentation strategy is implemented consistently across control types including network security, identity and access models, and application permission/access models, and human process controls.

- [Guidance on segmentation strategy in Azure (video)](/security/compass/microsoft-security-compass-introduction#azure-components-and-reference-model-2151)

- [Guidance on segmentation strategy in Azure (document)](/security/compass/governance#enterprise-segmentation-strategy)

- [Align network segmentation with enterprise segmentation strategy](/security/compass/network-security-containment#align-network-segmentation-with-enterprise-segmentation-strategy)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-3: Define security posture management strategy

**Guidance**: Continuously measure and mitigate risks to your individual assets and the environment they are hosted in. Prioritize high value assets and highly-exposed attack surfaces, such as published applications, network ingress and egress points, user and administrator endpoints, etc.

- [Azure Security Benchmark - Posture and vulnerability management](../security/benchmarks/security-controls-v2-posture-vulnerability-management.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-4: Align organization roles, responsibilities, and accountabilities

**Guidance**: Ensure you document and communicate a clear strategy for roles and responsibilities in your security organization. Prioritize providing clear accountability for security decisions, educating everyone on the shared responsibility model, and educate technical teams on technology to secure the cloud.

- [Azure Security Best Practice 1 – People: Educate Teams on Cloud Security Journey](/azure/cloud-adoption-framework/security/security-top-10#1-people-educate-teams-about-the-cloud-security-journey)

- [Azure Security Best Practice 2 - People: Educate Teams on Cloud Security Technology](/azure/cloud-adoption-framework/security/security-top-10#2-people-educate-teams-on-cloud-security-technology)

- [Azure Security Best Practice 3 - Process: Assign Accountability for Cloud Security Decisions](/azure/cloud-adoption-framework/security/security-top-10#4-process-update-incident-response-ir-processes-for-cloud)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-5: Define network security strategy

**Guidance**: Establish an Azure network security approach as part of your organization’s overall security access control strategy.  

This strategy should include documented guidance, policy, and standards for the following elements: 

-	Centralized network management and security responsibility

-	Virtual network segmentation model aligned with the enterprise segmentation strategy

-	Remediation strategy in different threat and attack scenarios

-	Internet edge and ingress and egress strategy

-	Hybrid cloud and on-premises interconnectivity strategy

-	Up-to-date network security artifacts (e.g. network diagrams, reference network architecture)

For more information, see the following references:
- [Azure Security Best Practice 11 - Architecture. Single unified security strategy](/azure/cloud-adoption-framework/security/security-top-10#11-architecture-establish-a-single-unified-security-strategy)

- [Azure Security Benchmark - Network Security](../security/benchmarks/security-controls-v2-network-security.md)

- [Azure network security overview](../security/fundamentals/network-overview.md)

- [Enterprise network architecture strategy](/azure/cloud-adoption-framework/ready/enterprise-scale/architecture)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-6: Define identity and privileged access strategy

**Guidance**: Establish an Azure identity and privileged access approaches as part of your organization’s overall security access control strategy.  

This strategy should include documented guidance, policy, and standards for the following elements: 

-	A centralized identity and authentication system and its interconnectivity with other internal and external identity systems

-	Strong authentication methods in different use cases and conditions

-	Protection of highly privileged users

-	Anomaly user activities monitoring and handling  

-	User identity and access review and reconciliation process

For more information, see the following references:

- [Azure Security Benchmark - Identity management](../security/benchmarks/security-controls-v2-identity-management.md)

- [Azure Security Benchmark - Privileged access](../security/benchmarks/security-controls-v2-privileged-access.md)

- [Azure Security Best Practice 11 - Architecture. Single unified security strategy](/azure/cloud-adoption-framework/security/security-top-10#11-architecture-establish-a-single-unified-security-strategy)

- [Azure identity management security overview](../security/fundamentals/identity-management-overview.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-7: Define logging and threat response strategy

**Guidance**: Establish a logging and threat response strategy to rapidly detect and remediate threats while meeting compliance requirements. Prioritize providing analysts with high-quality alerts and seamless experiences so that they can focus on threats rather than integration and manual steps. 

This strategy should include documented guidance, policy, and standards for the following elements: 

-	The security operations (SecOps) organization’s role and responsibilities 

-	A well-defined incident response process aligning with NIST or another industry framework 

-	Log capture and retention to support threat detection, incident response, and compliance needs

-	Centralized visibility of and correlation information about threats, using SIEM, native Azure capabilities, and other sources 

-	Communication and notification plan with your customers, suppliers, and public parties of interest

-	Use of Azure native and third-party platforms for incident handling, such as logging and threat detection, forensics, and attack remediation and eradication

-	Processes for handling incidents and post-incident activities, such as lessons learned and evidence retention

For more information, see the following references:

- [Azure Security Benchmark - Logging and threat detection](../security/benchmarks/security-controls-v2-logging-threat-detection.md)

- [Azure Security Benchmark - Incident response](../security/benchmarks/security-controls-v2-incident-response.md)

- [Azure Security Best Practice 4 - Process. Update Incident Response Processes for Cloud](/azure/cloud-adoption-framework/security/security-top-10#4-process-update-incident-response-ir-processes-for-cloud)

- [Azure Adoption Framework, logging, and reporting decision guide](/azure/cloud-adoption-framework/decision-guides/logging-and-reporting/)

- [Azure enterprise scale, management, and monitoring](/azure/cloud-adoption-framework/ready/enterprise-scale/management-and-monitoring)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Next steps

- See the [Azure Security Benchmark V2 overview](../security/benchmarks/overview.md)
- Learn more about [Azure security baselines](../security/benchmarks/security-baselines-overview.md)