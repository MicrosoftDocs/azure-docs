---
title: Azure security baseline for Azure Database Migration Service
description: The Azure Database Migration Service security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: database-migration
ms.topic: conceptual
ms.date: 01/01/2000
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Database Migration Service

This security baseline applies guidance from the [Azure Security Benchmark version 2.0](overview.md) to Azure Database Migration Service. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Database Migration Service. **Controls** not applicable to Azure Database Migration Service have been excluded.

To see how Azure Database Migration Service completely maps to the Azure Security Benchmark, see the [full Azure Database Migration Service security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](/azure/security/benchmarks/security-controls-v2-network-security).*

### NS-1: Implement security for internal traffic

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39954.).

**Guidance**: When you deploy Azure Database Migration Service resources you must create or use an existing virtual network. Ensure that all Azure virtual networks follow an enterprise segmentation principle that aligns to the business risks. Any system that could incur higher risk for the organization should be isolated within its own virtual network and sufficiently secured with either a network security group (NSG) and/or Azure Firewall.

- [How to create a network security group with security rules](../../virtual-network/tutorial-filter-network-traffic.md)

 

- [How to deploy and configure Azure Firewall](../../firewall/tutorial-firewall-deploy-portal.md) 

- [Follow pre-requisite documentation for ports to be open for Azure Database Migration Service here](../../dms/pre-reqs.md#prerequisites-common-across-migration-scenarios)

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### NS-2: Connect private networks together

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39955.).

**Guidance**: Use Azure ExpressRoute or Azure virtual private network (VPN) to create private connections between Azure datacenters and on-premises infrastructure in a colocation environment. ExpressRoute connections do not go over the public internet, and they offer more reliability, faster speeds, and lower latencies than typical internet connections. For point-to-site VPN and site-to-site VPN, you can connect on-premises devices or networks to a virtual network using any combination of these VPN options and Azure ExpressRoute. To connect two or more virtual networks in Azure together, use virtual network peering. Network traffic between peered virtual networks is private and is kept on the Azure backbone network.

- [What are the ExpressRoute connectivity models](../../expressroute/expressroute-connectivity-models.md) 

- [Azure VPN overview](../../vpn-gateway/vpn-gateway-about-vpngateways.md) 

- [Virtual network peering](../../virtual-network/virtual-network-peering-overview.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### NS-3: Establish private network access to Azure services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39956.).

**Guidance**: Use Azure Private Link to enable private access to Azure Database Migration Service from your virtual networks without crossing the internet.

Private access is an additional defense in depth measure in addition to authentication and traffic security offered by Azure services.

- [Understand Azure Private Link](../../private-link/private-link-overview.md) 
Azure Database Migration Service does not not provide the capability to configure Service Endpoints.

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### NS-4: Protect applications and services from external network attacks

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39957.).

**Guidance**: Not applicable; Azure Database migration service does not expose any endpoints to external networks which need to be secured by conventional network protections.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### NS-5: Deploy intrusion detection/intrusion prevention systems (IDS/IPS)

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39958.).

**Guidance**: Use Azure Firewall with threat intelligence-based filtering to alert on and/or block traffic to and from known

malicious IP addresses and domains. The IP addresses and domains are sourced from the Microsoft Threat
Intelligence feed. When payload inspection is required, you can deploy a third-party IDS/IPS solution from Azure Marketplace with payload inspection capabilities. Alternately you may choose to use host-based IDS/IPS or a
host-based endpoint detection and response (EDR) solution in conjunction with or instead of network-based
IDS/IPS.

Note: If you have a regulatory or other requirement for IDS/IPS use, ensure that it is always tuned to provide
high quality alerts to your SIEM solution.

- [How to deploy Azure Firewall](../../firewall/tutorial-firewall-deploy-portal.md) 

- [Azure Marketplace includes 3rd party IDS capabilities](https://azuremarketplace.microsoft.com/marketplace?search=IDS) 

- [Microsoft Defender ATP EDR capability](/windows/security/threat-protection/microsoft-defender-atp/overviewendpoint-detection-response)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### NS-6: Simplify network security rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39959.).

**Guidance**: Not applicable; this recommendation is intended for offerings that can be deployed into Azure Virtual Networks, or have the capability to define groupings of allowed IP ranges for efficient management. Azure Database Migration Service does not currently support service tags, or it is not designed to deploy into Azure virtual networks.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### NS-7: Secure Domain Name Service (DNS)

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39960.).

**Guidance**: Not applicable; This control is intended for offerings that expose DNS configurations.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Identity Management

*For more information, see the [Azure Security Benchmark: Identity Management](/azure/security/benchmarks/security-controls-v2-identity-management).*

### IM-1: Standardize Azure Active Directory as the central identity and authentication system

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39940.).

**Guidance**: Azure Database Migration Service uses Azure Active Directory (Azure AD) as the default identity and access management service. You should standardize Azure AD to govern your organization’s identity and access management in:
Microsoft Cloud resources, such as the Azure portal, Azure Storage, Azure Virtual Machine (Linux and Windows), Azure Key Vault, PaaS, and SaaS applications.

Your organization's resources, such as applications on Azure or your corporate network resources.

Securing Azure AD should be a high priority in your organization’s cloud security practice. Azure AD provides an identity secure score to help you assess identity security posture relative to Microsoft’s best practice recommendations. Use the score to gauge how closely your configuration matches best practice recommendations, and to make improvements in your security posture.

Note: Azure AD supports external identity that allow users without a Microsoft account to sign-in to their applications and resources with their external identity.

- [Tenancy in Azure Active Directory](../../active-directory/develop/single-and-multi-tenant-apps.md) 

- [How to create and configure an Azure AD instance](../../active-directory/fundamentals/active-directory-access-create-new-tenant.md) 

- [Use external identity providers for application](/azure/active-directory/b2b/identity-providers) 

- [What is the identity secure score in Azure Active Directory](../../active-directory/fundamentals/identity-secure-score.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### IM-2: Manage application identities securely and automatically

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39941.).

**Guidance**: &lt;This placeholder text gives initial instructions, please remove all of the text in this 'ASCB Customer Guidelines' text box and replace it with your customer guidance&gt;

Please provide customer guidance for this control specific to your offering. More detail can be found on what guidance to include for this control in the self-service wiki guide.
 
Mark this control work item as 'Submitted for Review' when ready for the benchmark team to review.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### IM-3: Use Azure AD single sign-on (SSO) for application access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39942.).

**Guidance**: Azure Database Migration Service: Use Azure Active Directory to provide identity and access management to Azure resources, cloud applications, and on-premises applications. This includes enterprise identities such as employees, as well as external identities such as partners, vendors, and suppliers. This enables single sign-on (SSO) to manage and secure access to your organization’s data and resources on-premises and in the cloud. Connect all your users, applications, and devices to the Azure AD for seamless, secure access and greater visibility and control.

- [Understand Application SSO with Azure AD](../../active-directory/manage-apps/what-is-single-sign-on.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### IM-4: Use strong authentication controls for all Azure Active Directory based access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39943.).

**Guidance**: Azure Database Migration Service uses Azure Active Directory that supports strong authentication controls through multi-factor authentication (MFA), and strong passwordless methods.
Multi-factor authentication - Enable Azure AD MFA and follow Azure Security Center Identity and Access Management recommendations for some best practices in your MFA setup. MFA can be enforced on all, select users or at the per-user level based on sign-in conditions and risk factors.

Passwordless authentication – Three passwordless authentication options are available: Windows Hello for Business, Microsoft Authenticator app, and on-premises authentication methods such as smart cards.

For administrator and privileged users, ensure the highest level of the strong authentication method are used, followed by rolling out the appropriate strong authentication policy to other users.

- [How to enable MFA in Azure](../../active-directory/authentication/howto-mfa-getstarted.md) 

- [Introduction to passwordless authentication options for Azure Active Directory](../../active-directory/authentication/concept-authentication-passwordless.md) 

Please provide customer guidance for this control specific to your offering. More detail can be found on what guidance to include for this control in the self-service wiki guide.
 
Mark this control work item as 'Submitted for Review' when ready for the benchmark team to review.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### IM-5: Monitor and alert on account anomalies

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39944.).

**Guidance**: Azure Database Migration Service  is integrated with Azure Active Directory in which provides the following data sources:
Sign-ins - The sign-ins report provides information about the usage of managed applications and user sign-in activities.

Audit logs - Provides traceability through logs for all changes done by various features within Azure AD. Examples of audit logs include changes made to any resources within Azure AD like adding or removing users, apps, groups, roles and policies.

Risky sign-ins - A risky sign-in is an indicator for a sign-in attempt that might have been performed by someone who is not the legitimate owner of a user account.

Users flagged for risk - A risky user is an indicator for a user account that might have been compromised.

These data sources can be integrated with Azure Monitor, Azure Sentinel or third party SIEM systems.

Azure Security Center can also alert on certain suspicious activities such as excessive number of failed authentication attempts, deprecated accounts in the subscription.

Azure Advanced Threat Protection (ATP) is a security solution that can use Active Directory signals to identify, detect, and investigate advanced threats, compromised identities, and malicious insider actions.

- [Audit activity reports in the Azure Active Directory](../../active-directory/reports-monitoring/concept-audit-logs.md) 

- [How to view Azure AD risky sign-ins](/azure/active-directory/reports-monitoring/concept-risky-sign-ins) 

- [How to identify Azure AD users flagged for risky activity](/azure/active-directory/reports-monitoring/concept-user-at-risk) 

- [How to monitor users' identity and access activity in Azure Security Center](../../security-center/security-center-identity-access.md) 

- [Alerts in Azure Security Center's threat intelligence protection module](../../security-center/alerts-reference.md) 

- [How to integrate Azure Activity Logs into Azure Monitor](../../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### IM-6: Restrict Azure resource access based on conditions

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39945.).

**Guidance**: Not applicable; Azure Database Migration Service doesn't support capability of conditional access.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### IM-7: Eliminate unintended credential exposure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39946.).

**Guidance**: Azure Database Migration Service allows customers to deploy/run {code or configurations or persisted data} potentially with identities/secretes, it is recommend to implement Credential Scanner to identify credentials within {code or configurations or persisted data}. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

For GitHub, you can use native secret scanning feature to identify credentials or other form of secrets within the code.

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

- [GitHub secret scanning](https://docs.github.com/github/administering-a-repository/about-secret-scanning)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### IM-8: Secure user access to legacy applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39982.).

**Guidance**: Not applicable; Azure Database Migration Service doesn't access any legacy applications.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Privileged Access

*For more information, see the [Azure Security Benchmark: Privileged Access](/azure/security/benchmarks/security-controls-v2-privileged-access).*

### PA-1: Protect and limit highly privileged users

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39947.).

**Guidance**: Not applicable; Azure Database Migration Service doesn't use any administrative accounts.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PA-2: Restrict administrative access to business-critical systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39948.).

**Guidance**: Not applicable; Azure Database Migration Service doesn't store or process any data that are considered as business critical by customers.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PA-3: Review and reconcile user access regularly

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39949.).

**Guidance**: Azure Database Migration Service uses Azure Active Directory (AAD) accounts to manage its resources, review user accounts and access assignment regularly to ensure the accounts and their access are valid. You can use Azure AD access reviews to review group memberships, access to enterprise applications, and role assignments. Azure AD reporting can provide logs to help discover stale accounts. You can also use Azure AD Privileged Identity Management to create access review report workflow to facilitate the review process.

In addition, Azure Privileged Identity Management can also be configured to alert when an excessive number of administrator accounts are created, and to identify administrator accounts that are stale or improperly configured.

Note: Some Azure services support local users and roles which not managed through Azure AD. You will need to manage these users separately.

- [Create an access review of Azure resource roles in Privileged Identity Management(PIM)](../../active-directory/privileged-identity-management/pim-resource-roles-start-access-review.md) 

- [How to use Azure AD identity and access reviews](/azure/active-directory/governance/access-reviews-overvie)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### PA-4: Set up emergency access in Azure AD

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39950.).

**Guidance**: Not applicable; Azure Database Migration Service doesn't support emergency accounts or doesn't need emergency accounts.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PA-5: Automate entitlement management 

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39951.).

**Guidance**: Azure Database Migration Service is integrated with Azure Active Directory to manage its resources. Use Azure AD entitlement management features to automate access request workflows, including access assignments, reviews, and expiration. Dual or multi-stage approval is also supported.

- [What are Azure AD access reviews](/azure/active-directory/governance/access-reviews-overview) 

- [What is Azure AD entitlement management](../../active-directory/governance/entitlement-management-overview.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### PA-6: Use privileged access workstations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39952.).

**Guidance**: Secured, isolated workstations are critically important for the security of sensitive roles like administrators, developers, and critical service operators. Use highly secured user workstations and/or Azure Bastion for administrative tasks. Use Azure Active Directory, Microsoft Defender Advanced Threat Protection (ATP), and/or Microsoft Intune to deploy a secure and managed user workstation for administrative tasks. The secured workstations can be centrally managed to enforce secured configuration including strong authentication, software and hardware baselines, restricted logical and network access.

- [Understand privileged access workstations](../../active-directory/devices/concept-azure-managed-workstation.md) 

- [Deploy a privileged access workstation](../../active-directory/devices/howto-azure-managed-workstation.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### PA-7: Follow just enough administration (least privilege principle) 

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39953.).

**Guidance**: Azure Database Migration Service is integrated with Azure role-based access control (RBAC) to manage its resources. Azure RBAC allows you to manage Azure resource access through role assignments. You can assign these roles to users, groups service principals and managed identities. There are pre-defined built-in roles for certain resources, and these roles can be inventoried or queried through tools such as Azure CLI, Azure PowerShell or the Azure portal. The privileges you assign to resources through the Azure RBAC should be always limited to what is required by the roles. This complements the just in time (JIT) approach of Azure AD Privileged Identity Management (PIM) and should be reviewed periodically.

Use built-in roles to allocate permission and only create custom role when required.

What is Azure role-based access control (Azure RBAC) ../../role-based-access-control/overview.md 

- [How to configure RBAC in Azure](../../role-based-access-control/role-assignments-portal.md) 

- [How to use Azure AD identity and access reviews](/azure/active-directory/governance/access-reviews-overview)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](/azure/security/benchmarks/security-controls-v2-data-protection).*

### DP-1: Discovery, classify and label sensitive data

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39961.).

**Guidance**: Azure Database Migration Service does not provide this capability.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### DP-2: Protect sensitive data

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39962.).

**Guidance**: Azure Database Migration Service does not provide this capability. The data is encrypted on transit by Azure Database Migration Service but the data is not stored.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### DP-3: Monitor for unauthorized transfer of sensitive data

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39963.).

**Guidance**: Azure Database Migration Service does not provide this capability.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### DP-4: Encrypt sensitive information in transit

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39964.).

**Guidance**: Encryption is critical for traffic on external and public networks.
Use access controls,

data in transit should be protected against ‘out of band’ attacks (e.g. traffic capture) using encryption to ensure that attackers cannot easily read or modify the data.

Ensure for HTTP traffic, that any clients connecting to your Azure resources can negotiate TLS v1.2 or greater.

For remote management, use SSH (for Linux) or RDP/TLS (for Windows) instead of unencrypted protocol. Obsoleted SSL/TLS/SSH versions, protocols, and weak ciphers should be disabled.

At the underlying infrastructure, Azure provides data in transit encryption by default for data traffic between Azure data centers.

- [Understand encryption in transit with Azure](../fundamentals/encryption-overview.md#encryption-of-data-in-transit) 

- [Information on TLS Security](/security/engineering/solving-tls1-problem) 

- [Double encryption for Azure data in transit](../fundamentals/double-encryption.md#data-in-transit)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### DP-5: Encrypt sensitive data at rest

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39965.).

**Guidance**: Azure Database Migration Service does not store data. Because of this you can not leverage data protection features with the offering's resources such as access controls, encryption at rest, and enforcement of security controls with automated tools.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Asset Management

*For more information, see the [Azure Security Benchmark: Asset Management](/azure/security/benchmarks/security-controls-v2-asset-management).*

### AM-1: Ensure security team has visibility into risks for assets

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39983.).

**Guidance**: Ensure security teams are granted Security Reader permissions in your Azure tenant and subscriptions so they can monitor for security risks using Azure Security Center.

Depending on how security team responsibilities are structured, monitoring for security risks could be the responsibility of a central security team or a local team. That said, security insights and risks must always be aggregated centrally within an organization.

Security Reader permissions can be applied broadly to an entire tenant (Root Management Group) or scoped to management groups or specific subscriptions.

Note: Additional permissions might be required to get visibility into workloads and services.

- [Overview of Security Reader Role](../../role-based-access-control/built-in-roles.md#security-reader) 

- [Overview of Azure Management Groups](../../governance/management-groups/overview.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### AM-2: Ensure security team has access to asset inventory and metadata

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39984.).

**Guidance**: Apply tags to your Azure resources, resource groups, and subscriptions to logically organize them into a taxonomy. Each tag consists of a name and a value pair. For example, you can apply the name "Environment" and the value "Production" to all the resources in production.

- [How to create queries with Azure Resource Graph Explorer](../../governance/resource-graph/first-query-portal.md) 

- [Azure Security Center asset inventory management](../../security-center/asset-inventory.md) 

- [For more information about tagging assets, see the resource naming and tagging decision guide](https://docs.microsoft.com/azure/cloud-adoption-framework/decision-guides/resource-tagging/?toc=/azure/azure-resource-manager/management/toc.json) 
Azure Database Migration Service does not allow running an application or installation of software on its resources.

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### AM-3: Use only approved Azure services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39985.).

**Guidance**: Use Azure Policy to audit and restrict which services users can provision in your environment. Use Azure Resource Graph to query for and discover resources within their subscriptions. You can also use Azure Monitor to create rules to trigger alerts when a non-approved service is detected.

- [How to configure and manage Azure Policy](../../governance/policy/tutorials/create-and-manage.md) 

- [How to deny a specific resource type with Azure Policy](../../governance/policy/samples/built-in-policies.md#general) 

- [How to create queries with Azure Resource Graph Explorer](../../governance/resource-graph/first-query-portal.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### AM-4: Ensure security of asset lifecycle management

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39986.).

**Guidance**: Not applicable. The Azure Database Migration Service can not be used for ensuring security of assets in a lifecycle management process. It is the customer's responsibility to maintain attributes and network configurations of assets which are considered high-impact. It is recommended that the customer create a process to capture the attribute and network-configuration changes, measure the change-impact and create remediation tasks, as applicable.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### AM-5: Limit users' ability to interact with Azure Resource Manager

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39987.).

**Guidance**: Not applicable; Azure Database Migration Service does not provide capabilities to customers to limit their users' ability to access Azure Resource Manager. The customer should restrict this access with other means or methods.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### AM-6: Use only approved applications in compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39988.).

**Guidance**: Not applicable; Azure Database Migration Service is not comprised of any virtual machines or containers which would either expose compute resources or allow customers to install applications on them.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Logging and Threat Detection

*For more information, see the [Azure Security Benchmark: Logging and Threat Detection](/azure/security/benchmarks/security-controls-v2-logging-threat-protection).*

### LT-1: Enable threat detection for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39966.).

**Guidance**: Not applicable; Azure Database Migration Service does not currently produce customer facing resource logs that can be used for threat detection.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Not applicable

### LT-2: Enable threat detection for Azure identity and access management

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39967.).

**Guidance**: Azure AD provides the following user logs that can be viewed in Azure AD reporting or integrated with Azure Monitor, Azure Sentinel or other SIEM/monitoring tools for more sophisticated monitoring and analytics use cases:

Sign-ins – The sign-ins report provides information about the usage of managed applications and user sign-in activities.

Audit logs - Provides traceability through logs for all changes done by various features within Azure AD. Examples of audit logs include changes made to any resources within Azure AD like adding or removing users, apps, groups, roles and policies.

Risky sign-ins - A risky sign-in is an indicator for a sign-in attempt that might have been performed by someone who is not the legitimate owner of a user account.

Users flagged for risk - A risky user is an indicator for a user account that might have been compromised.

Azure Security Center can also alert on certain suspicious activities such as excessive number of failed authentication attempts, deprecated accounts in the subscription. In addition to the basic security hygiene monitoring, Azure Security Center’s Threat Protection module can also collect more in-depth security alerts from individual Azure compute resources (virtual machines, containers, app service), data resources (SQL DB and storage), and Azure service layers. This capability allows you have visibility on account anomalies inside the individual resources.

Audit activity reports in the Azure Active Directory
../../active-directory/reports-monitoring/concept-audit-logs.md 

- [Enable Azure Identity Protection](../../active-directory/identity-protection/overview-identity-protection.md) 

- [Threat protection in Azure Security Center](/azure/security-center/threat-protection)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### LT-3: Enable logging for Azure network activities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39968.).

**Guidance**: Enable and collect network security group (NSG) resource logs, NSG flow logs, Azure Firewall logs, and Web Application Firewall (WAF) logs for security analysis to support incident investigations, threat hunting, and security alert generation. You can send the flow logs to an Azure Monitor Log Analytics workspace and then use Traffic Analytics to provide insights.

- [How to enable network security group flow logs](../../network-watcher/network-watcher-nsg-flow-logging-portal.md) 

- [How to enable network security group flow logs](../../network-watcher/network-watcher-nsg-flow-logging-portal.md) 

- [Azure Firewall logs and metrics](../../firewall/logs-and-metrics.md) 

- [How to enable and use Traffic Analytics](../../network-watcher/traffic-analytics.md) 

- [Monitoring with Network Watcher](../../network-watcher/network-watcher-monitoring-overview.md) 

- [Azure networking monitoring solutions in Azure Monitor](../../azure-monitor/insights/azure-networking-analytics.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### LT-4: Enable logging for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39969.).

**Guidance**: Activity logs, which are automatically available, contain all write operations (PUT, POST, DELETE) for your {offering_name} resources except read operations (GET). Activity logs can be used to find an error when troubleshooting or to monitor how a user in your organization modified a resource.

- [How to collect platform logs and metrics with Azure Monitor](../../azure-monitor/platform/diagnostic-settings.md) 

- [Understand logging and different log types in Azure](../../azure-monitor/platform/platform-logs-overview.md) 
Azure Database Migration Service currently does not produce Azure resource logs.

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### LT-5: Centralize security log management and analysis

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39970.).

**Guidance**: Centralize logging storage and analysis to enable correlation. For each log source, ensure you have assigned a data owner, access guidance, storage location, what tools are used to process and access the data, and data retention requirements.

Ensure you are integrating Azure activity logs into your central logging. Ingest logs via Azure Monitor to aggregate security data generated by endpoint devices, network resources, and other security systems. In Azure Monitor, use Log Analytics workspaces to query and perform analytics, and use Azure Storage accounts for long term and archival storage.

In addition, enable and onboard data to Azure Sentinel or a third-party SIEM.

Many organizations choose to use Azure Sentinel for “hot” data that is used frequently and Azure Storage for “cold” data that is used less frequently.

- [How to collect platform logs and metrics with Azure Monitor](../../azure-monitor/platform/diagnostic-settings.md) 

- [How to onboard Azure Sentinel](../../sentinel/quickstart-onboard.md)

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Customer

### LT-6: Configure log storage retention

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39971.).

**Guidance**: Azure Database Migration Service does not currently produce any security-related logs, and the customer is unable to set any log retention.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### LT-7: Use approved time synchronization sources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39972.).

**Guidance**: Azure Database Migration Service does not support configuring your own time synchronization sources. The Azure Database Migration service relies on Microsoft time synchronization sources, and is not exposed to customers for configuration.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](/azure/security/benchmarks/security-controls-v2-incident-response).*

### IR-1: Preparation – update incident response process for Azure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39973.).

**Guidance**: &lt;This placeholder text gives initial instructions, please remove all of the text in this 'ASCB Customer Guidelines' text box and replace it with your customer guidance&gt;

Please provide customer guidance for this control specific to your offering. More detail can be found on what guidance to include for this control in the self-service wiki guide.
 
Mark this control work item as 'Submitted for Review' when ready for the benchmark team to review.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### IR-2: Preparation – setup incident notification

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39974.).

**Guidance**: &lt;This placeholder text gives initial instructions, please remove all of the text in this 'ASCB Customer Guidelines' text box and replace it with your customer guidance&gt;

Please provide customer guidance for this control specific to your offering. More detail can be found on what guidance to include for this control in the self-service wiki guide.
 
Mark this control work item as 'Submitted for Review' when ready for the benchmark team to review.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### IR-3: Detection and analysis – create incidents based on high quality alerts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39975.).

**Guidance**: &lt;This placeholder text gives initial instructions, please remove all of the text in this 'ASCB Customer Guidelines' text box and replace it with your customer guidance&gt;

Please provide customer guidance for this control specific to your offering. More detail can be found on what guidance to include for this control in the self-service wiki guide.
 
Mark this control work item as 'Submitted for Review' when ready for the benchmark team to review.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### IR-4: Detection and analysis – investigate an incident

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39976.).

**Guidance**: &lt;This placeholder text gives initial instructions, please remove all of the text in this 'ASCB Customer Guidelines' text box and replace it with your customer guidance&gt;

Please provide customer guidance for this control specific to your offering. More detail can be found on what guidance to include for this control in the self-service wiki guide.
 
Mark this control work item as 'Submitted for Review' when ready for the benchmark team to review.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### IR-5: Detection and analysis – prioritize incidents

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39977.).

**Guidance**: &lt;This placeholder text gives initial instructions, please remove all of the text in this 'ASCB Customer Guidelines' text box and replace it with your customer guidance&gt;

Please provide customer guidance for this control specific to your offering. More detail can be found on what guidance to include for this control in the self-service wiki guide.
 
Mark this control work item as 'Submitted for Review' when ready for the benchmark team to review.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### IR-6: Containment, eradication and recovery – automate the incident handling

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39978.).

**Guidance**: &lt;This placeholder text gives initial instructions, please remove all of the text in this 'ASCB Customer Guidelines' text box and replace it with your customer guidance&gt;

Please provide customer guidance for this control specific to your offering. More detail can be found on what guidance to include for this control in the self-service wiki guide.
 
Mark this control work item as 'Submitted for Review' when ready for the benchmark team to review.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

## Posture and Vulnerability Management

*For more information, see the [Azure Security Benchmark: Posture and Vulnerability Management](/azure/security/benchmarks/security-controls-v2-vulnerability-management).*

### PV-1: Establish secure configurations for Azure services 

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39993.).

**Guidance**: &lt;This placeholder text gives initial instructions, please remove all of the text in this 'ASCB Customer Guidelines' text box and replace it with your customer guidance&gt;

Please provide customer guidance for this control specific to your offering. More detail can be found on what guidance to include for this control in the self-service wiki guide.
 
Mark this control work item as 'Submitted for Review' when ready for the benchmark team to review.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### PV-2: Sustain secure configurations for Azure services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39994.).

**Guidance**: &lt;This placeholder text gives initial instructions, please remove all of the text in this 'ASCB Customer Guidelines' text box and replace it with your customer guidance&gt;

Please provide customer guidance for this control specific to your offering. More detail can be found on what guidance to include for this control in the self-service wiki guide.
 
Mark this control work item as 'Submitted for Review' when ready for the benchmark team to review.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### PV-3: Establish secure configurations for compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39995.).

**Guidance**: Not applicable; Azure Database Migration Service doesn't have any resource configurations..

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PV-4: Sustain secure configurations for compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39996.).

**Guidance**: &lt;This placeholder text gives initial instructions, please remove all of the text in this 'ASCB Customer Guidelines' text box and replace it with your customer guidance&gt;

Please provide customer guidance for this control specific to your offering. More detail can be found on what guidance to include for this control in the self-service wiki guide.
 
Mark this control work item as 'Submitted for Review' when ready for the benchmark team to review.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### PV-5: Securely store custom operating system and container images

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39997.).

**Guidance**: &lt;This placeholder text gives initial instructions, please remove all of the text in this 'ASCB Customer Guidelines' text box and replace it with your customer guidance&gt;

Please provide customer guidance for this control specific to your offering. More detail can be found on what guidance to include for this control in the self-service wiki guide.
 
Mark this control work item as 'Submitted for Review' when ready for the benchmark team to review.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### PV-6: Perform software vulnerability assessments

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39998.).

**Guidance**: &lt;This placeholder text gives initial instructions, please remove all of the text in this 'ASCB Customer Guidelines' text box and replace it with your customer guidance&gt;

Please provide customer guidance for this control specific to your offering. More detail can be found on what guidance to include for this control in the self-service wiki guide.
 
Mark this control work item as 'Submitted for Review' when ready for the benchmark team to review.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### PV-7: Rapidly and automatically remediate software vulnerabilities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39999.).

**Guidance**: &lt;This placeholder text gives initial instructions, please remove all of the text in this 'ASCB Customer Guidelines' text box and replace it with your customer guidance&gt;

Please provide customer guidance for this control specific to your offering. More detail can be found on what guidance to include for this control in the self-service wiki guide.
 
Mark this control work item as 'Submitted for Review' when ready for the benchmark team to review.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### PV-8: Conduct regular attack simulation

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40000.).

**Guidance**: &lt;This placeholder text gives initial instructions, please remove all of the text in this 'ASCB Customer Guidelines' text box and replace it with your customer guidance&gt;

Please provide customer guidance for this control specific to your offering. More detail can be found on what guidance to include for this control in the self-service wiki guide.
 
Mark this control work item as 'Submitted for Review' when ready for the benchmark team to review.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

## Endpoint Security

*For more information, see the [Azure Security Benchmark: Endpoint Security](/azure/security/benchmarks/security-controls-v2-endpoint-security).*

### ES-1: Use Endpoint Detection and Response (EDR)

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39979.).

**Guidance**: &lt;This placeholder text gives initial instructions, please remove all of the text in this 'ASCB Customer Guidelines' text box and replace it with your customer guidance&gt;

Please provide customer guidance for this control specific to your offering. More detail can be found on what guidance to include for this control in the self-service wiki guide.
 
Mark this control work item as 'Submitted for Review' when ready for the benchmark team to review.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### ES-2: Use centrally managed modern anti-malware software

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39980.).

**Guidance**: &lt;This placeholder text gives initial instructions, please remove all of the text in this 'ASCB Customer Guidelines' text box and replace it with your customer guidance&gt;

Please provide customer guidance for this control specific to your offering. More detail can be found on what guidance to include for this control in the self-service wiki guide.
 
Mark this control work item as 'Submitted for Review' when ready for the benchmark team to review.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### ES-3: Ensure anti-malware software and signatures are updated

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39981.).

**Guidance**: &lt;This placeholder text gives initial instructions, please remove all of the text in this 'ASCB Customer Guidelines' text box and replace it with your customer guidance&gt;

Please provide customer guidance for this control specific to your offering. More detail can be found on what guidance to include for this control in the self-service wiki guide.
 
Mark this control work item as 'Submitted for Review' when ready for the benchmark team to review.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

## Backup and Recovery

*For more information, see the [Azure Security Benchmark: Backup and Recovery](/azure/security/benchmarks/security-controls-v2-backup-recovery).*

### BR-1: Ensure regular automated backups

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39989.).

**Guidance**: &lt;This placeholder text gives initial instructions, please remove all of the text in this 'ASCB Customer Guidelines' text box and replace it with your customer guidance&gt;

Please provide customer guidance for this control specific to your offering. More detail can be found on what guidance to include for this control in the self-service wiki guide.
 
Mark this control work item as 'Submitted for Review' when ready for the benchmark team to review.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### BR-2: Encrypt backup data

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39990.).

**Guidance**: &lt;This placeholder text gives initial instructions, please remove all of the text in this 'ASCB Customer Guidelines' text box and replace it with your customer guidance&gt;

Please provide customer guidance for this control specific to your offering. More detail can be found on what guidance to include for this control in the self-service wiki guide.
 
Mark this control work item as 'Submitted for Review' when ready for the benchmark team to review.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### BR-3: Validate all backups including customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39991.).

**Guidance**: &lt;This placeholder text gives initial instructions, please remove all of the text in this 'ASCB Customer Guidelines' text box and replace it with your customer guidance&gt;

Please provide customer guidance for this control specific to your offering. More detail can be found on what guidance to include for this control in the self-service wiki guide.

 

Mark this control work item as 'Submitted for Review' when ready for the benchmark team to review.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### BR-4: Mitigate risk of lost keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/39992.).

**Guidance**: &lt;This placeholder text gives initial instructions, please remove all of the text in this 'ASCB Customer Guidelines' text box and replace it with your customer guidance&gt;

Please provide customer guidance for this control specific to your offering. More detail can be found on what guidance to include for this control in the self-service wiki guide.
 
Mark this control work item as 'Submitted for Review' when ready for the benchmark team to review.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

## Governance and Strategy

*For more information, see the [Azure Security Benchmark: Governance and Strategy](/azure/security/benchmarks/security-controls-v2-governance-strategy).*

### GS-1: Define asset management and data protection strategy 

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40001.).

**Guidance**: Ensure you document and communicate a clear strategy for continuous monitoring and protection of systems and data. Prioritize discovery, assessment, protection, and monitoring of business-critical data and systems. 

This strategy should include documented guidance, policy, and standards for the following elements: 

-	Data classification standard in accordance with the business risks

-	Security organization visibility into risks and asset inventory 

-	Security organization approval of Azure services for use 

-	Security of assets through their lifecycle

-	Required access control strategy in accordance with organizational data classification

-	Use of Azure native and third party data protection capabilities

-	Data encryption requirements for in-transit and at-rest use cases

-	Appropriate cryptographic standards

For more information, see the following references:

- [Azure Security Architecture Recommendation - Storage, data, and encryption](https://docs.microsoft.com/azure/architecture/framework/security/storage-data-encryption?toc=/security/compass/toc.json&amp;bc=/security/compass/breadcrumb/toc.json)

- [Azure Security Fundamentals - Azure Data security, encryption, and storage](../fundamentals/encryption-overview.md)

- [Cloud Adoption Framework - Azure data security and encryption best practices](https://docs.microsoft.com/azure/security/fundamentals/data-encryption-best-practices?toc=/azure/cloud-adoption-framework/toc.json&amp;bc=/azure/cloud-adoption-framework/_bread/toc.json)

- [Azure Security Benchmark - Asset management](/azure/security/benchmarks/security-benchmark-v2-asset-management)

- [Azure Security Benchmark - Data Protection](/azure/security/benchmarks/security-benchmark-v2-data-protection)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-2: Define enterprise segmentation strategy 

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40008.).

**Guidance**: Establish an enterprise-wide strategy to segmenting access to assets using a combination of identity, network, application, subscription, management group, and other controls.

Carefully balance the need for security separation with the need to enable daily operation of the systems that need to communicate with each other and access data.

Ensure that the segmentation strategy is implemented consistently across control types including network security, identity and access models, and application permission/access models, and human process controls.

- [Guidance on segmentation strategy in Azure (video)](/security/compass/microsoft-security-compass-introduction#azure-components-and-reference-model-2151)

- [Guidance on segmentation strategy in Azure (document)](/security/compass/governance#enterprise-segmentation-strategy)

- [Align network segmentation with enterprise segmentation strategy](/security/compass/network-security-containment#align-network-segmentation-with-enterprise-segmentation-strategy)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-3: Define security posture management strategy

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40002.).

**Guidance**: Continuously measure and mitigate risks to your individual assets and the environment they are hosted in. Prioritize high value assets and highly-exposed attack surfaces, such as published applications, network ingress and egress points, user and administrator endpoints, etc.

- [Azure Security Benchmark - Posture and vulnerability management](/azure/security/benchmarks/security-benchmark-v2-posture-vulnerability-management)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-4: Align organization roles, responsibilities, and accountabilities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40003.).

**Guidance**: Ensure you document and communicate a clear strategy for roles and responsibilities in your security organization. Prioritize providing clear accountability for security decisions, educating everyone on the shared responsibility model, and educate technical teams on technology to secure the cloud.

- [Azure Security Best Practice 1 – People: Educate Teams on Cloud Security Journey](https://aka.ms/AzSec1)

- [Azure Security Best Practice 2 - People: Educate Teams on Cloud Security Technology](https://aka.ms/AzSec2)

- [Azure Security Best Practice 3 - Process: Assign Accountability for Cloud Security Decisions](https://aka.ms/AzSec3)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-5: Define network security strategy

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40004.).

**Guidance**: Establish an Azure network security approach as part of your organization’s overall security access control strategy.  

This strategy should include documented guidance, policy, and standards for the following elements: 

-	Centralized network management and security responsibility

-	Virtual network segmentation model aligned with the enterprise segmentation strategy

-	Remediation strategy in different threat and attack scenarios

-	Internet edge and ingress and egress strategy

-	Hybrid cloud and on-premises interconnectivity strategy

-	Up-to-date network security artifacts (e.g. network diagrams, reference network architecture)

For more information, see the following references:

- [Azure Security Best Practice 11 - Architecture. Single unified security strategy](https://aka.ms/AzSec11)

- [Azure Security Benchmark - Network Security](/azure/security/benchmarks/security-benchmark-v2-network-security)

- [Azure network security overview](../fundamentals/network-overview.md)

- [Enterprise network architecture strategy](/azure/cloud-adoption-framework/ready/enterprise-scale/architecture)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-6: Define identity and privileged access strategy

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40005.).

**Guidance**: Establish an Azure identity and privileged access approaches as part of your organization’s overall security access control strategy.  

This strategy should include documented guidance, policy, and standards for the following elements: 

-	A centralized identity and authentication system and its interconnectivity with other internal and external identity systems

-	Strong authentication methods in different use cases and conditions

-	Protection of highly privileged users

-	Anomaly user activities monitoring and handling  

-	User identity and access review and reconciliation process

For more information, see the following references:

- [Azure Security Benchmark - Identity management](/azure/security/benchmarks/security-benchmark-v2-identity-management)

- [Azure Security Benchmark - Privileged access](/azure/security/benchmarks/security-benchmark-v2-privileged-access)

- [Azure Security Best Practice 11 - Architecture. Single unified security strategy](https://aka.ms/AzSec11)

- [Azure identity management security overview](../fundamentals/identity-management-overview.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-7: Define logging and threat response strategy

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40006.).

**Guidance**: Establish a logging and threat response strategy to rapidly detect and remediate threats while meeting compliance requirements. Prioritize providing analysts with high quality alerts and seamless experiences so that they can focus on threats rather than integration and manual steps. 

This strategy should include documented guidance, policy, and standards for the following elements: 

-	The security operations (SecOps) organization’s role and responsibilities 

-	A well-defined incident response process aligning with NIST or another industry framework 

-	Log capture and retention to support threat detection, incident response, and compliance needs

-	Centralized visibility of and correlation information about threats, using SIEM, native Azure capabilities, and other sources 

-	Communication and notification plan with your customers, suppliers, and public parties of interest

-	Use of Azure native and third-party platforms for incident handling, such as logging and threat detection, forensics, and attack remediation and eradication

-	Processes for handling incidents and post-incident activities, such as lessons learned and evidence retention

For more information, see the following references:

- [Azure Security Benchmark - Logging and threat detection](/azure/security/benchmarks/security-benchmark-v2-logging-threat-detection)

- [Azure Security Benchmark - Incident response](/azure/security/benchmarks/security-benchmark-v2-incident-response)

- [Azure Security Best Practice 4 - Process. Update Incident Response Processes for Cloud](https://aka.ms/AzSec11)

- [Azure Adoption Framework, logging, and reporting decision guide](/azure/cloud-adoption-framework/decision-guides/logging-and-reporting/)

- [Azure enterprise scale, management, and monitoring](/azure/cloud-adoption-framework/ready/enterprise-scale/management-and-monitoring)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Next steps

- See the [Azure Security Benchmark V2 overview](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
