---
title: Azure security baseline for Azure App Configuration
description: The Azure App Configuration security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: azure-app-configuration
ms.topic: conceptual
ms.date: 11/20/2020
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure App Configuration

This security baseline applies guidance from the [Azure Security Benchmark version 2.0](../security/benchmarks/overview.md) to Azure App Configuration. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure App Configuration. **Controls** not applicable to Azure App Configuration have been excluded.

To see how Azure App Configuration completely maps to the Azure Security Benchmark, see the [full Azure App Configuration security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](../security/benchmarks/security-controls-v2-network-security.md).*

### NS-1: Implement security for internal traffic

**Guidance**: Azure App Configuration does not deploy any resources directly into a virtual network. Since the service is not deployed into a virtual network, you cannot leverage certain networking features to secure the service's internal traffic such as: network security groups, route tables, or other network appliances such as an Azure Firewall. However, App Configuration allows you to use private endpoints to connect securely to Azure App Configuration from a virtual network.

Use Azure Sentinel to discover the use of legacy insecure protocols such as SSL/TLSv1, SMBv1, LM/NTLMv1, wDigest, Unsigned LDAP Binds, and weak ciphers in Kerberos.

- [Using private endpoints for Azure App Configuration](concept-private-endpoint.md)

- [Azure Sentinel insecure protocols workbook](../sentinel/quickstart-get-visibility.md#use-built-in-workbooks)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### NS-2: Connect private networks together

**Guidance**: Azure App Configuration supports using private endpoints to securely send data over a private link. Use Azure ExpressRoute or Azure virtual private network (VPN) to create private connections between Azure datacenters and on-premises infrastructure in a colocation environment. ExpressRoute connections do not go over the public internet, and they offer more reliability, faster speeds, and lower latencies than typical internet connections. For point-to-site VPN and site-to-site VPN, you can connect on-premises devices or networks to a virtual network using any combination of these VPN options and Azure ExpressRoute.

To connect two or more virtual networks in Azure together, use virtual network peering. Network traffic between peered virtual networks is private and is kept on the Azure backbone network.

- [What are the ExpressRoute connectivity models](../expressroute/expressroute-connectivity-models.md)

- [Azure VPN overview](../vpn-gateway/vpn-gateway-about-vpngateways.md)

- [Virtual network peering](../virtual-network/virtual-network-peering-overview.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### NS-3: Establish private network access to Azure services

**Guidance**: Use Azure Private Link to enable private access to Azure App Configuration from your virtual networks without crossing the internet.

Private access is an additional defense in-depth measure in addition to authentication and traffic security offered by Azure services.

- [Understand Azure Private Link](../private-link/private-link-overview.md)

- [How to set up private link in Azure App Configuration](concept-private-endpoint.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### NS-4: Protect applications and services from external network attacks

**Guidance**: When accessing configuration values through a virtual network, protect your resources against attacks from external networks, including distributed denial of service (DDoS) attacks, application-specific attacks, and unsolicited and potentially malicious internet traffic. Use Azure Firewall to protect applications and services against potentially malicious traffic from the internet and other external locations. Protect your assets against DDoS attacks by enabling DDoS standard protection on your Azure virtual networks. Use Azure Security Center to detect misconfiguration risks related to your network-related resources.

Azure App Configuration is not intended to run web applications, it provides the configuration for these web applications. You are not required to configure any additional settings or deploy any extra network services to protect it from external network attacks targeting web applications.

- [Azure Firewall Documentation](../firewall/index.yml)

- [Manage Azure DDoS Protection Standard using the Azure portal](../ddos-protection/manage-ddos-protection.md)

- [Azure Security Center recommendations](../security-center/recommendations-reference.md#recs-networking)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### NS-5: Deploy intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Use Azure Firewall with threat intelligence-based filtering to alert on and/or block traffic to and from known malicious IP addresses and domains. The IP addresses and domains are sourced from the Microsoft Threat
Intelligence feed. When payload inspection is required, you can deploy a third-party IDS/IPS solution from Azure Marketplace with payload inspection capabilities. Alternately you may choose to use host-based IDS/IPS or a host-based endpoint detection and response (EDR) solution in conjunction with or instead of network-based IDS/IPS.

Note: If you have a regulatory or other requirement for IDS/IPS use, ensure that it is always tuned to provide high-quality alerts to your SIEM solution.

- [How to deploy Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md)

- [Azure Marketplace includes 3rd party IDS capabilities](https://azuremarketplace.microsoft.com/marketplace?search=IDS)

- [Microsoft Defender ATP EDR capability](/windows/security/threat-protection/microsoft-defender-atp/overview-endpoint-detection-response)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### NS-6: Simplify network security rules

**Guidance**: Use Azure Virtual Network Service Tags to define network access controls on network security groups or Azure Firewall configured for your App Configuration resources. You can use the service tag "AppConfiguration" in place of specific IP addresses when creating security rules for outbound traffic in your application's network. By specifying the service tag name in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

- [Understand and using Service Tags](../virtual-network/service-tags-overview.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Identity Management

*For more information, see the [Azure Security Benchmark: Identity Management](../security/benchmarks/security-controls-v2-identity-management.md).*

### IM-1: Standardize Azure Active Directory as the central identity and authentication system

**Guidance**: Azure App Configuration is integrated with Azure Active Directory (Azure AD) that is Azure's default identity and access management service. You should standardize Azure AD to govern your organization’s identity and access management in:
- Microsoft Cloud resources, such as the Azure portal, Azure Storage, Azure Virtual Machine (Linux and Windows), Azure Key Vault, PaaS, and SaaS applications.
- Your organization's resources, such as applications on Azure or your corporate network resources.

Securing Azure AD should be a high priority in your organization’s cloud security practice. Azure AD provides an identity secure score to help you assess identity security posture relative to Microsoft’s best practice recommendations. Use the score to gauge how closely your configuration matches best practice recommendations, and to make improvements in your security posture.

Azure provides the following Azure built-in roles for authorizing access to App Configuration data using Azure AD and OAuth:

- App Configuration Data Owner: Use this role to give read/write/delete access to App Configuration data. This does not grant access to the App Configuration resource.

- App Configuration Data Reader: Use this role to give read access to App Configuration data. This does not grant access to the App Configuration resource.

- Contributor: Use this role to manage the App Configuration resource. While the App Configuration data can be accessed using access keys, this role does not grant direct access to the data using Azure AD.

- Reader: Use this role to give read access to the App Configuration resource. This does not grant access to the resource's access keys, nor to the data stored in App Configuration.

For more information, see the following references:

- [How to create and configure an Azure AD instance](../active-directory/fundamentals/active-directory-access-create-new-tenant.md)

- [What is the identity secure score in Azure Active Directory](../active-directory/fundamentals/identity-secure-score.md)

- [Authorize access to Azure App Configuration using Azure AD](concept-enable-rbac.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IM-2: Manage application identities securely and automatically

**Guidance**: Use Azure-managed identities to access Azure App Configuration from non-human accounts such as other Azure services. It is recommended to use Azure managed identity feature instead of creating a more powerful human account to access or execute your resources to limit the need to manage additional credentials. Azure App Configuration can also be assigned a managed identity itself to natively authenticate to other Azure services/resources that supports Azure AD authentication. This can be useful to enable easy access from App Configuration to Azure Key Vault when retrieving secrets. When using managed identities, the identity is managed by the Azure platform and does not require you to provision or rotate any secrets.

Azure App Configuration supports your application being granted two types of identities:
- A system-assigned identity is tied to your configuration resource. It's deleted if your configuration resource is deleted. A configuration resource can only have one system-assigned identity.
- A user-assigned identity is a standalone Azure resource that can be assigned to your configuration resource. A configuration resource can have multiple user-assigned identities.

When managed identities cannot be leveraged, create a service principal with restricted permissions at the Azure App Configuration resource level. Configure these service principals with certificate credentials and only fall back to client secrets. In both cases, Azure Key Vault can be used to in conjunction with Azure managed identities, so that the runtime environment (e.g., an Azure function) can retrieve the credential from the key vault.

- [How to use managed identities for Azure App Configuration](overview-managed-identity.md)

- [Azure managed identities](../active-directory/managed-identities-azure-resources/overview.md)

- [Services that support managed identities for Azure resources](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md)

- [Use managed identities to access App Configuration](howto-integrate-azure-managed-service-identity.md)

- [Azure service principal](/powershell/azure/create-azure-service-principal-azureps) 

- [Create a service principal with certificates](../active-directory/develop/howto-authenticate-service-principal-powershell.md) 

- [Use Azure Key Vault for security principal registration](../key-vault/general/authentication.md#app-identity-and-security-principals)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IM-3: Use Azure AD single sign-on (SSO) for application access

**Guidance**: Azure App Configuration uses Azure Active Directory (Azure AD) to provide identity and access management to Azure resources, cloud applications, and on-premises applications. This includes enterprise identities such as employees, as well as external identities such as partners, vendors, and suppliers. Azure AD enables single sign-on (SSO) to manage the App Configuration service through the Azure portal using any synced corporate Active Directory identities. Connect all your users, applications, and devices to the Azure AD for seamless, secure access and greater visibility and control.

- [Understand Application SSO with Azure AD](../active-directory/manage-apps/what-is-single-sign-on.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IM-4: Use strong authentication controls for all Azure Active Directory based access

**Guidance**: Azure App Configuration uses Azure Active Directory which supports strong authentication controls through multi-factor authentication (MFA), and strong passwordless methods.
- Multi-factor authentication - Enable Azure AD MFA and follow Azure Security Center Identity and Access Management recommendations for some best practices in your MFA setup. MFA can be enforced on all, select users or at the per-user level based on sign-in conditions and risk factors.
- Passwordless authentication – Three passwordless authentication options are available: Windows Hello for Business, Microsoft Authenticator app, and on-premises authentication methods such as smart cards.

For administrator and privileged users, ensure the highest level of strong authentication method is used, followed by rolling out the appropriate strong authentication policy to other users.

Note: MFA can be enforced on the user accounts that are accessing and managing App Configuration, but not on programmatic service accounts. Use passwordless authentication such as managed identities where possible, and enforce MFA on any user accounts.

- [How to enable MFA in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

- [Introduction to passwordless authentication options for Azure Active Directory](../active-directory/authentication/concept-authentication-passwordless.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IM-5: Monitor and alert on account anomalies

**Guidance**: Azure App Configuration is integrated with Azure Active Directory in which provides the following data sources:

-	Sign-ins – The sign-ins report provides information about the usage of managed applications and user sign-in activities.

-	Audit logs - Provides traceability through logs for all changes made through various features in Azure AD. Examples of logged changes audit logs include adding or removing users, apps, groups, roles, and policies.

-	Risky sign-ins - A risky sign-in is an indicator for a sign-in attempt that might have been performed by someone who is not the legitimate owner of a user account.

-	Users flagged for risk - A risky user is an indicator for a user account that might have been compromised.

These data sources can be integrated with Azure Monitor, Azure Sentinel or third-party SIEM systems.

Azure Security Center can also alert on certain suspicious activities such as an excessive number of failed authentication attempts, and deprecated accounts in the subscription. 

Azure Advanced Threat Protection (ATP) is a security solution that can use on-premises Active Directory signals to identify, detect, and investigate advanced threats, compromised identities, and malicious insider actions.

- [Audit activity reports in Azure AD](../active-directory/reports-monitoring/concept-audit-logs.md)

- [How to view Azure AD risky sign-ins](../active-directory/identity-protection/overview-identity-protection.md)

- [How to identify Azure AD users flagged for risky activity](../active-directory/identity-protection/overview-identity-protection.md)

- [How to monitor users' identity and access activity in Azure Security Center](../security-center/security-center-identity-access.md)

- [Alerts in Azure Security Center's threat intelligence protection module](../security-center/alerts-reference.md)

- [How to integrate Azure activity logs into Azure Monitor](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)

- [Connect data from Azure AD Identity Protection](../sentinel/connect-azure-ad-identity-protection.md)

- [Azure Advanced Threat Protection](/azure-advanced-threat-protection/what-is-atp)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IM-6: Restrict Azure resource access based on conditions

**Guidance**: Azure App Configuration supports Azure Active Directory (Azure AD) conditional access for a more granular access control based on user-defined conditions, such as user logins from certain IP ranges will need to use MFA for login. Granular authentication session management policy can also be used for different use cases. These conditional access policies will only apply to user accounts that are authenticating to Azure AD to access and manage the App Configuration service, but they will not apply to service principals or connection strings connecting to your configuration resource.

- [Azure conditional access overview](../active-directory/conditional-access/overview.md)

- [Common conditional access policies](../active-directory/conditional-access/concept-conditional-access-policy-common.md)

- [Configure authentication session management with conditional access](../active-directory/conditional-access/howto-conditional-access-session-lifetime.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IM-7: Eliminate unintended credential exposure

**Guidance**: Azure App Configuration allows customers to store configurations that may potentially contain identities or secrets. It is recommended to implement Credential Scanner to identify credentials within configurations. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

Use the Azure App Configuration service together with Azure Key Vault. Store any credentials in Key Vault, then link to these credentials by creating a Key Vault reference in your App configuration resource. When App Configuration creates these references, it stores the URIs of the Key Vault values rather than the values themselves. Applications can connect to App Configuration to retrieve any credentials from Key Vault.

For GitHub, you can use native secret scanning feature to identify credentials or other form of secrets within the code.

- [Tutorial for Using Key Vault References in an ASP.NET Core App](use-key-vault-references-dotnet-core.md)

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

- [GitHub secret scanning](https://docs.github.com/github/administering-a-repository/about-secret-scanning)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Privileged Access

*For more information, see the [Azure Security Benchmark: Privileged Access](../security/benchmarks/security-controls-v2-privileged-access.md).*

### PA-1: Protect and limit highly privileged users

**Guidance**: Limit the number of highly privileged accounts or roles and protect these accounts at an elevated level because users with this privilege can directly or indirectly read and modify every resource in your Azure environment.

You can enable just-in-time (JIT) privileged access to Azure resources and Azure AD using Azure AD Privileged Identity Management (PIM). JIT grants temporary permissions to perform privileged tasks only when users need it. PIM can also generate security alerts when there is suspicious or unsafe activity in your Azure AD organization.

Access Keys are highly privileged and should be rotated regularly as a security best practice. Access keys contain connection strings, which contain credential information and are considered secrets. These secrets need to be stored in Azure Key Vault, and your code must authenticate to Key Vault to retrieve them. Access Keys can give read-write or just read access to an application. Ensure that the correct type of access key is issued to prevent unauthorized access. To be more secure, use the managed identities feature in Azure AD. This only requires applications to have the configuration endpoint URL to access configuration values.

- [App Configuration Best Practices](howto-best-practices.md#app-configuration-bootstrap)

- [Use managed identities to access App Configuration](howto-integrate-azure-managed-service-identity.md)
- [Administrator role permissions in Azure AD](../active-directory/roles/permissions-reference.md)

- [Use Azure Privileged Identity Management security alerts](../active-directory/privileged-identity-management/pim-how-to-configure-security-alerts.md)

- [Securing privileged access for hybrid and cloud deployments in Azure AD](../active-directory/roles/security-planning.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### PA-2: Restrict administrative access to business-critical systems

**Guidance**: Azure App Configuration uses Azure RBAC to isolate access to business-critical systems by restricting which accounts are granted privileged access. Azure RBAC is supported by App Configuration at the resource level. To securely silo business-critical configurations store this information in its own App Configuration resource. Within a resource, granular access is also available through read-only access accounts or keys, as well as labeling and tagging.

All types of access controls should be aligned to your enterprise segmentation strategy to ensure consistent access control.

- [Management Group Access](../governance/management-groups/overview.md#management-group-access)

- [Azure subscription administrators](../cost-management-billing/manage/add-change-subscription-administrator.md)

- [To integrate RBAC using Azure AD with App Configuration](concept-enable-rbac.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### PA-3: Review and reconcile user access regularly

**Guidance**: Azure App Configuration uses Azure Active Directory (Azure AD) accounts to manage its resources, review user accounts and access assignment regularly to ensure the accounts and their access are valid. 

Azure provides the following Azure built-in roles for authorizing access to App Configuration data using Azure AD and OAuth:

- App Configuration Data Owner: Use this role to give read/write/delete access to App Configuration data. This does not grant access to the App Configuration resource.

- App Configuration Data Reader: Use this role to give read access to App Configuration data. This does not grant access to the App Configuration resource

You can use Azure AD access reviews to review group memberships, access to enterprise applications, and role assignments such as the App Configuration roles above. Azure AD reporting can provide logs to help discover stale accounts. You can also use Azure AD Privileged Identity Management to create access review report workflow to facilitate the review process.

Note: Managed identities are suggested where possible for authenticating to App Configuration from another service or application. You will need to manage any service principals or connection strings configured with access to App Configuration separately when used.

- [Create an access review of Azure resource roles in Privileged Identity Management(PIM)](../active-directory/privileged-identity-management/pim-resource-roles-start-access-review.md) 

- [How to use Azure AD identity and access reviews](../active-directory/governance/access-reviews-overview.md)

- [Authorize access to Azure App Configuration using Azure AD](concept-enable-rbac.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### PA-4: Set up emergency access in Azure AD

**Guidance**: Azure App Configuration is integrated with Azure Active Directory to manage its resources. To prevent being accidentally locked out of your Azure AD organization, set up an emergency access account for access when normal administrative accounts cannot be used. Emergency access accounts are usually highly privileged, and they should not be assigned to specific individuals. Emergency access accounts are limited to emergency or "break glass"' scenarios where normal administrative accounts can't be used.

You should ensure that the credentials (such as password, certificate, or smart card) for emergency access accounts are kept secure and known only to individuals who are authorized to use them only in an emergency.

- [Manage emergency access accounts in Azure AD](../active-directory/roles/security-emergency-access.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### PA-5: Automate entitlement management 

**Guidance**: Azure App Configuration is integrated with Azure Active Directory to manage its resources. Use Azure AD entitlement management features to automate access request workflows, including access assignments, reviews, and expiration. Dual or multi-stage approval is also supported.

- [What are Azure AD access reviews](../active-directory/governance/access-reviews-overview.md)

- [What is Azure AD entitlement management](../active-directory/governance/entitlement-management-overview.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### PA-6: Use privileged access workstations

**Guidance**: Secured, isolated workstations are critically important for the security of sensitive roles like administrators, developers, and critical service operators. Use highly secured user workstations and/or Azure Bastion for administrative tasks related the App Configuration. Use Azure Active Directory, Microsoft Defender Advanced Threat Protection (ATP), and/or Microsoft Intune to deploy a secure and managed user workstation for administrative tasks. The secured workstations can be centrally managed to enforce secured configuration including strong authentication, software and hardware baselines, restricted logical and network access.

- [Understand privileged access workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/) 

- [Deploy a privileged access workstation](/security/compass/privileged-access-deployment)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### PA-7: Follow just enough administration (least privilege principle) 

**Guidance**: Azure App Configuration is integrated with Azure role-based access control (RBAC) to manage its resources. Azure RBAC allows you to manage Azure resource access through role assignments. You can assign these roles to users, groups service principals and managed identities. There are pre-defined built-in roles for Azure App Configuration, and these roles can be inventoried or queried through tools such as Azure CLI, Azure PowerShell or the Azure portal. The privileges you assign to resources through the Azure RBAC should be always limited to what is required by the roles. This complements the just in time (JIT) approach of Azure AD Privileged Identity Management (PIM) and should be reviewed periodically.

Azure provides the following Azure built-in roles for authorizing access to App Configuration data using Azure AD and OAuth:
- App Configuration Data Owner: Use this role to give read/write/delete access to App Configuration data. This does not grant access to the App Configuration resource.
- App Configuration Data Reader: Use this role to give read access to App Configuration data. This does not grant access to the App Configuration resource.

Use built-in roles to allocate permission and only create custom roles when required. 

App Configuration supports storing configuration of multiple applications in one App Configuration resource. To limit information access between applications, create an App Configuration resource per application and set up Azure RBAC accordingly.

- [What is Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md)

- [How to configure Azure RBAC](../role-based-access-control/role-assignments-portal.md)

- [How to use Azure AD identity and access reviews](../active-directory/governance/access-reviews-overview.md)

- [Authorize access to Azure App Configuration using Azure AD](concept-enable-rbac.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### PA-8: Choose approval process for Microsoft support  

**Guidance**: Implement an organizational approval process for support scenarios where Microsoft may need access to your App Configuration data. Customer Lockbox is not currently available for App Configuration support scenarios.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](../security/benchmarks/security-controls-v2-data-protection.md).*

### DP-1: Discover, classify and label sensitive data

**Guidance**: Discover, classify, and label your sensitive data so that you can design the appropriate controls to ensure sensitive information is stored, processed, and transmitted securely by the organization's technology systems. Labeling for sensitive information, in the form of tagging, is supported for App Configuration resources, but not for configuration values contained within them. Once an application has read or read/write access to a configuration store, it has full access to any of the configurations in that store.

- [Tag sensitive information using Azure Information Protection](/azure/information-protection/what-is-information-protection)

- [Tagging data classifications in Azure](/azure/cloud-adoption-framework/govern/policy-compliance/data-classification#tagging-data-classification-in-azure)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### DP-2: Protect sensitive data

**Guidance**: For the underlying platform, which is managed by Microsoft, Microsoft treats all customer content as sensitive and guards against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented some default data protection controls and capabilities. Ensure you are regularly rotating the access keys to your App Configuration resources. Credential information from connection strings can be stored in Azure Key Vault, and your code must authenticate to Key Vault to retrieve them. Access Keys can give read-write or just read access to an application. Ensure that the correct type of access key is issued to prevent unauthorized access. To be more secure, use the managed identities feature in Azure AD. This only requires applications to have the configuration endpoint URL to access configuration values.

Restrict access using Azure role-based access control (Azure RBAC):

- Separate sensitive data into its own App Configuration resource, then allocate RBAC policies accordingly so only authorized access is enabled 

- Use network-based access controls

- Specific controls in Azure services (such as encryption in SQL and other databases) and ensure consistent access control, all types of access control should be aligned to your enterprise segmentation strategy.

- The enterprise segmentation strategy should also be informed by the location of sensitive or business critical data and systems.

For more information, see the following references:

- [Authorize access to Azure App Configuration using Azure Active Directory](concept-enable-rbac.md)

- [App Configuration Data Encryption](faq.yml#does-app-configuration-encrypt-my-data)

- [Azure Role Based Access Control (RBAC)](../role-based-access-control/overview.md) 

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### DP-4: Encrypt sensitive information in transit

**Guidance**: To complement access controls, data in transit should be protected against ‘out of band’ attacks using encryption. This helps ensure that attackers cannot easily read or modify the data.

Azure App Configuration uses TLS encryption for all HTTP requests. The Azure infrastructure provides an added layer of network level encryption for all requests between Azure data centers. Ensure for HTTP traffic that any clients connecting to your App Configuration resources can negotiate TLS v1.2 or greater.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### DP-5: Encrypt sensitive data at rest

**Guidance**: To complement access controls, data at rest should be protected against ‘out of band’ attacks (such as accessing underlying storage) using encryption. This helps ensure that attackers cannot easily read or modify the data.

Azure provides data at rest encryption by default. For highly sensitive data, you have options to implement additional encryption at rest on all Azure resources where available. Azure manages your encryption keys by default, but Azure provides the option to manage your own keys (customer-managed keys) for Azure App Configuration.

- [Use customer managed keys to encrypt your data in Azure App Configuration](concept-customer-managed-keys.md)

- [Understand encryption at rest in Azure](../security/fundamentals/encryption-atrest.md#encryption-at-rest-in-microsoft-cloud-services) 

- [Encryption Model and key management table](../security/fundamentals/encryption-atrest.md#azure-resource-providers-encryption-model-support)

- [Data at rest double encryption in Azure](../security/fundamentals/double-encryption.md#data-at-rest)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

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

**Guidance**: Ensure that security teams have access to a continuously updated inventory of assets on Azure, like Azure App Configuration. Security teams often need this inventory to evaluate their organization's potential exposure to emerging risks, and as an input to continuously security improvements. Create an Azure Active Directory group to contain your organization's authorized security team and assign them read access to all Azure App Configuration resources, this can be simplified by a single high-level role assignment within your subscription.

The Azure Security Center inventory feature and Azure Resource Graph can query for and discover all resources in your subscriptions, including Azure services, applications, and network resources.

Apply tags to your Azure resources, resource groups, and subscriptions to logically organize them into a taxonomy. Each tag consists of a name and a value pair. For example, you can apply the name "Environment" and the value "Production" to all the resources in production.

- [How to create queries with Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md)

- [Azure Security Center asset inventory management](../security-center/asset-inventory.md)

- [For more information about tagging assets, see the resource naming and tagging decision guide](/azure/cloud-adoption-framework/decision-guides/resource-tagging/?toc=%2fazure%2fazure-resource-manager%2fmanagement%2ftoc.json)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### AM-3: Use only approved Azure services

**Guidance**: Azure App Configuration supports Azure Resource Manager based deployments and configuration enforcement using Azure Policy. Use Azure Policy to audit and restrict which services users can provision in your environment. Use Azure Resource Graph to query for and discover resources within their subscriptions. You can also use Azure Monitor to create rules to trigger alerts when a non-approved service is detected.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to deny a specific resource type with Azure Policy](../governance/policy/samples/built-in-policies.md#general)

- [How to create queries with Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### AM-4: Ensure security of asset lifecycle management

**Guidance**: Establish or update security policies that address asset lifecycle management processes for potentially high impact modifications. These modifications include changes, but are not limited to: identity providers and access, data sensitivity, network configuration, and administrative privilege assignment.

Remove Azure resources when they are no longer needed. Ensure administrators regularly rotate access keys to ensure only authenticated users have access to their configuration resource.

- [Rotate encryption keys used for Application Configuration](concept-customer-managed-keys.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### AM-5: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Use Azure Conditional Access to limit users' ability to interact with Azure Resources Manager by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resources Manager](../role-based-access-control/conditional-access-azure-management.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Logging and Threat Detection

*For more information, see the [Azure Security Benchmark: Logging and Threat Detection](../security/benchmarks/security-controls-v2-logging-threat-detection.md).*

### LT-2: Enable threat detection for Azure identity and access management

**Guidance**: App Configuration integrates with Azure Active Directory (Azure AD). This provides the following user logs that can be viewed in Azure AD reporting or integrated with Azure Monitor, Azure Sentinel or other SIEM/monitoring tools for more sophisticated monitoring and analytics use cases:
- Sign-ins – The sign-ins report provides information about the usage of managed applications and user sign-in activities.
- Audit logs - Provides traceability through logs for all changes done by various features within Azure AD. Examples of audit logs include changes made to any resources within Azure AD like adding or removing users, apps, groups, roles and policies.
- Risky sign-ins - A risky sign-in is an indicator for a sign-in attempt that might have been performed by someone who is not the legitimate owner of a user account.
- Users flagged for risk - A risky user is an indicator for a user account that might have been compromised.

Azure Security Center can also alert on certain suspicious activities such as excessive number of failed authentication attempts, deprecated accounts in the subscription. In addition to the basic security hygiene monitoring, Azure Security Center’s Threat Protection module can also collect more in-depth security alerts of Azure service layers. This capability gives you visibility on account anomalies inside the individual resources.

Another method of gaining access to your App Configuration configuration resource is using access keys. These need to be rotated regularly to ensure no unauthorized agents get access to your configuration resource. Rotating them can be done directly in the portal under "access keys".

- [To allow Azure App Configuration to access other Azure AD protected resources using a managed identity](overview-managed-identity.md)

- [Use managed identities with Azure App Configuration](howto-integrate-azure-managed-service-identity.md)

- [Audit activity reports in the Azure Active Directory](../active-directory/reports-monitoring/concept-audit-logs.md)

- [Enable Azure Identity Protection](../active-directory/identity-protection/overview-identity-protection.md)

- [Authorizing Access to Azure App Configuration using Azure AD](concept-enable-rbac.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### LT-3: Enable logging for Azure network activities

**Guidance**: Azure App Configuration does not deploy any resources directly into a virtual network. However, App Configuration allows you to use private endpoints to connect securely to Azure App Configuration from a virtual network. Azure App Configuration also does not produce or process DNS query logs which would need to be enabled.

Enable logging on your configured App Configuration private endpoints to capture:
- Data processed by the Private Endpoint  (IN/OUT)
- Data processed by the Private Link service (IN/OUT)
- NAT port availability

For more information, see the following references:

- [Azure Private Link Monitoring](../private-link/private-link-overview.md#logging-and-monitoring)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### LT-4: Enable logging for Azure resources

**Guidance**: Activity logs, which are automatically available, contain all write operations (PUT, POST, DELETE) for your App Configuration resources except read operations (GET). Activity logs can be used to find an error when troubleshooting or to monitor how a user in your organization modified a resource. For App Configuration, activity logs are only available on the control plane and are surfaced by the Azure Resource Manager (ARM). Customer facing data plane logging for App Configuration is currently not supported. Azure resource logs are also not available to be configured.

- [How to collect platform logs and metrics with Azure Monitor](../azure-monitor/essentials/diagnostic-settings.md)

- [Understand logging and different log types in Azure](../azure-monitor/essentials/platform-logs-overview.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### LT-5: Centralize security log management and analysis

**Guidance**: Centralize logging storage and analysis to enable correlation. For each log source, ensure you have assigned a data owner, access guidance, storage location, what tools are used to process and access the data, and data retention requirements.

Ensure you are integrating Azure activity logs into your central logging. Ingest logs via Azure Monitor to aggregate security data generated by endpoint devices, network resources, and other security systems. In Azure Monitor, use Log Analytics workspaces to query and perform analytics, and use Azure Storage accounts for long term and archival storage.

In addition, enable and onboard data to Azure Sentinel or a third-party SIEM. Many organizations choose to use Azure Sentinel for “hot” data that is used frequently and Azure Storage for “cold” data that is used less frequently.

- [How to collect platform logs and metrics with Azure Monitor](../azure-monitor/essentials/diagnostic-settings.md) 

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### LT-6: Configure log storage retention

**Guidance**: Ensure that any storage accounts or Log Analytics workspaces used for storing App Configuration logs has the log retention period set according to your organization's compliance regulations. Use Azure Storage, Data Lake or Log Analytics workspace accounts for long-term and archival storage.

In Azure Monitor, you can set your Log Analytics workspace retention period according to your organization's compliance regulations.

- [How to configure Log Analytics Workspace Retention Period](../azure-monitor/logs/manage-cost-storage.md)

- [Storing resource logs in an Azure Storage Account](../azure-monitor/essentials/resource-logs.md#send-to-azure-storage)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](../security/benchmarks/security-controls-v2-incident-response.md).*

### IR-1: Preparation – update incident response process for Azure

**Guidance**: Ensure your organization has processes to respond to security incidents, has updated these processes for Azure, and is regularly exercising them to ensure readiness.

- [Implement security across the enterprise environment](/azure/cloud-adoption-framework/security/security-top-10#4-process-update-incident-response-ir-processes-for-cloud)

- [Incident response reference guide](/microsoft-365/downloads/IR-Reference-Guide.pdf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IR-2: Preparation – setup incident notification

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

Azure Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytics used to issue the alert, as well as the confidence level that there was malicious intent behind the activity that led to the alert.

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

### PV-1: Establish secure configurations for Azure services 

**Guidance**: Azure App Configuration supports below service-specific policies that are available in Azure Security Center to audit and enforce configurations of your Azure resources. This can be configured in Azure Security Center or Azure Policy initiatives.
- App Configuration should use a customer managed key: Customer-managed keys provide enhanced data protection by allowing you to manage your encryption keys. This is often required to meet compliance requirements.
- App Configuration should use a private link: Private endpoint connections allow clients on a virtual network to securely access Azure App Configuration over a private link.

You can use Azure Blueprints to automate deployment and configuration of services and application environments including Azure Resources Manager templates, Azure RBAC controls, and policies, in a single blueprint definition.

- [Further information on App Configuration policies](../governance/policy/samples/built-in-policies.md#app-configuration)

- [Working with security policies in Azure Security Center](../security-center/tutorial-security-policy.md)

- [Illustration of Guardrails implementation in Enterprise Scale Landing Zone](/azure/cloud-adoption-framework/ready/enterprise-scale/architecture#landing-zone-expanded-definition)

- [Tutorial: Create and manage policies to enforce compliance](../governance/policy/tutorials/create-and-manage.md)

- [Azure Blueprints](../governance/blueprints/overview.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### PV-2: Sustain secure configurations for Azure services

**Guidance**: Use Azure Security Center to monitor your configuration baseline and enforce using Azure Policy. Azure Policy for App Configuration includes: 
- App Configuration should use a customer managed key: Customer-managed keys provide enhanced data protection by allowing you to manage your encryption keys. This is often required to meet compliance requirements.
- App Configuration should use a private link: Private endpoint connections allow clients on a virtual network to securely access Azure App Configuration over a private link.

- [Understand Azure Policy effects](../governance/policy/concepts/effects.md) 

- [Create and manage policies to enforce compliance](../governance/policy/tutorials/create-and-manage.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

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