---
title: Azure security baseline for Virtual Network
description: The Virtual Network security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: virtual-network
ms.topic: conceptual
ms.date: 10/01/2020
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Virtual Network

This security baseline applies guidance from the [Azure Security Benchmark version 1.0](../security/benchmarks/overview-v1.md) to Azure Virtual Network. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Virtual Network. **Controls** not applicable to Azure Virtual Network have been excluded.

To see how Azure Virtual Network completely maps to the Azure Security Benchmark, see the [full Azure Virtual Network security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network security

*For more information, see the [Azure Security Benchmark: Network security](../security/benchmarks/security-control-network-security.md).*

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and network interfaces

**Guidance**: Use Security Center and follow network protection recommendations to help secure your network resources in Azure. 

Send network security group flow logs to a Log Analytics Workspace and use Traffic Analytics to provide insights into traffic flow into your Azure cloud. Traffic Analytics offers the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations. 

Use Azure Monitor logs to provide insights into your environment. A workspace should be used to collate and analyze the data, and can integrate with other Azure services such as Application Insights and Security Center. 

Choose resource logs to send to an Azure storage account or an event hub. A different platform can also be used to analyze the logs. 

- [How to Enable NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to Enable and use Traffic Analytics](../network-watcher/traffic-analytics.md)

- [Understand Network Security provided by Security Center](../security-center/security-center-network-recommendations.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.4: Deny communications with known-malicious IP addresses

**Guidance**: Enable distributed denial of service (DDoS) Standard protection on your Azure Virtual Network to guard against DDoS attacks.

Deploy Azure Firewall at each of the organization's network boundaries with threat intelligence-based filtering enabled and configured to "Alert and deny" for malicious network traffic.

Use Security Center's threat protection features to detect communications with known malicious IP addresses.

Apply Security Center's Adaptive Network Hardening recommendations for network security group configurations that limit ports and source IPs based on actual traffic and threat intelligence. 

- [Manage Azure DDoS Protection Standard using the Azure portal](manage-ddos-protection.md)

- [Azure Firewall threat intelligence-based filtering](../firewall/threat-intel.md)

- [Threat protection in Security Center](/azure/security-center/threat-protection)

- [Adaptive Network Hardening in Azure Security Center](../security-center/security-center-adaptive-network-hardening.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.5: Record network packets

**Guidance**: 
Use VPN Gateway's packet capture in addition to commonly available packet capture tools to record network packets. 

You can also review agent based or NVA solutions that provide Terminal Access Point (TAP) or Network Visibility functionality through Packet Broker partner solutions available in Azure Marketplace Offerings.

- [Configure packet captures for VPN gateways](../vpn-gateway/packet-capture.md) 

- [Network Virtual Appliance Partner](https://azure.microsoft.com/solutions/network-appliances)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Use an Azure Firewall deployed on your virtual network with Threat Intelligence enabled. Use Azure Firewall Threat intelligence-based filtering to alert or to deny traffic to and from known malicious IP addresses and domains. The IP addresses and domains are sourced from the Microsoft Threat Intelligence feed. 

You can also select an appropriate offer from the Azure Marketplace that supports IDS/IPS functionality with payload inspection capabilities.

Deploy the firewall solution of your choice at each of your organization's network boundaries to detect and/or deny malicious traffic.

- [How to deploy Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md)

- [How to configure alerts with Azure Firewall](../firewall/threat-intel.md)

- [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/?term=Firewall)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: Use Virtual Network service tags to define network access controls on network security groups or Azure Firewall. Service tags can be used in place of specific IP addresses when creating security rules. 
Allow or deny the traffic for the corresponding service by specifying the service tag name (for example, ApiManagement) in the appropriate source or destination field of a rule. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

Use Application Security Groups to help simplify complex security configuration. Application security groups allow you to configure network security as a natural extension of an application's structure. This enables you to group virtual machines and define network security policies based on those groups.

- [Understand and use Service tags](service-tags-overview.md)

- [Understand and use Application Security Groups](/azure/virtual-network/security-overview#application-security-groups)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement standard security configurations for network resources with Azure Policy and review the built-in network policy definitions for implementation.

Refer to the default policy for Security Center which contains available security recommendations related to your virtual networks.

Use Azure Blueprints to simplify large-scale Azure deployments by packaging key environment artifacts, such as Azure Resource Manager templates, role-based access control (Azure RBAC) assignments, and policies, in a single blueprint definition. Azure Blueprint can be applied to new subscriptions for fine-tuned control and management through versioning. 

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Azure Policy samples for networking](../governance/policy/samples/built-in-policies.md#network) 

- [How to create an Azure Blueprint](../governance/blueprints/create-blueprint-portal.md)

- [Enable monitoring in Azure Security Center](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Security%20Center/AzureSecurityCenter.json)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.10: Document traffic configuration rules

**Guidance**: Use tags for network security groups and other resources related to network security and traffic flow. Use the "Description" field to specify business need, duration, and other information for any rules that allow traffic to/from a network for individual network security group rules.
Use any of the built-in Azure Policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with tags and to notify you of existing untagged resources.

Choose Azure PowerShell or Azure CLI to look up or perform actions on resources based on their tags.

- [How to create and use Tags](/azure/azure-resource-manager/resource-group-using-tags)

- [How to create a Virtual Network](quick-create-portal.md)

- [How to create an NSG with a Security Config](tutorial-filter-network-traffic.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: 
Use Azure Activity Log to monitor resource configurations and detect changes to your virtual network. Create alerts within Azure Monitor which will trigger when changes to critical resources take place.

- [How to view and retrieve Azure Activity Log events](/azure/azure-monitor/platform/activity-log-view)

- [How to create alerts in Azure Monitor](../azure-monitor/platform/alerts-activity-log.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Logging and monitoring

*For more information, see the [Azure Security Benchmark: Logging and monitoring](../security/benchmarks/security-control-logging-monitoring.md).*

### 2.2: Configure central security log management

**Guidance**: Enable Azure Monitor for access to your audit and activity logs which includes event source, date, user, timestamp, source addresses, destination addresses, and other useful elements. 

In Azure Monitor, use Log Analytics Workspaces to query and perform analytics, and use Azure Storage Accounts for long-term/archival storage.
Alternatively, you may enable and on-board data to Azure Sentinel or a third-party SIEM. 

- [How to collect platform logs and metrics with Azure Monitor](../azure-monitor/platform/diagnostic-settings.md) 

- [View and retrieve Azure Activity log events](/azure/azure-monitor/platform/activity-log-view)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

**Guidance**: Enable Azure Monitor for access to your audit and activity logs which includes event source, date, user, timestamp, source addresses, destination addresses, and other useful elements.

- [How to collect platform logs and metrics with Azure Monitor](../azure-monitor/platform/diagnostic-settings.md) 

- [View and retrieve Azure Activity log events](/azure/azure-monitor/platform/activity-log-view)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.5: Configure security log storage retention

**Guidance**: Within Azure Monitor, set your Log Analytics Workspace retention period
according to your organization's compliance regulations. Use Azure Storage accounts for long-term/archival storage of security log storage retention.

- [Change the data retention period in Log Analytics](../azure-monitor/platform/manage-cost-storage.md#change-the-data-retention-period)

- [How to configure retention policy for Azure Storage account logs](../storage/common/storage-monitor-storage-account.md#configure-logging)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.6: Monitor and review logs

**Guidance**: Analyze and monitor logs for anomalous behavior and regularly review results. Use Azure Monitor's Log Analytics Workspace to query and perform analytics, and use Azure Storage Accounts for long-term/archival storage. 

Alternatively, you may enable and on-board data to Azure Sentinel or a third-party SIEM. 

- [Understand Log Analytics Workspace](../azure-monitor/log-query/get-started-portal.md)

- [How to perform custom queries in Azure Monitor](../azure-monitor/log-query/get-started-queries.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

- [How to get started with Azure Monitor and third-party SIEM integration](https://azure.microsoft.com/blog/use-azure-monitor-to-integrate-with-siem-tools/)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activities

**Guidance**: Use Security Center with Log Analytics Workspace for monitoring and alerting on anomalous activity found in security logs and events.

Alternatively, you may enable and onboard data to Azure Sentinel or a third-party SIEM for alerting.

- [How to manage alerts in Security Center](../security-center/security-center-managing-and-responding-alerts.md)

- [How to alert on log analytics log data](../azure-monitor/learn/tutorial-response.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.9: Enable DNS query logging

**Guidance**: Implement a third-party solution from Azure Marketplace for DNS logging solution as per your organizational need.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Identity and access control

*For more information, see the [Azure Security Benchmark: Identity and access control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Use Azure Active Directory (Azure AD) built-in administrator roles that can be explicitly assigned and are queryable. 

Use the Azure AD PowerShell module to perform ad hoc queries to discover accounts that are members of administrative groups.

- [How to get a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0)

- [How to get members of a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.3: Use dedicated administrative accounts

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts. Use Security Center's Identity and Access Management to monitor the number of administrative accounts.

Enable Just-In-Time / Just-Enough-Access by using Azure AD Privileged Identity Management Privileged Roles for Microsoft Services and Azure Resource Manager. 

- [Learn more about Privileged Identity Management](/azure/active-directory/privileged-identity-management/)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.4: Use Azure Active Directory single sign-on (SSO)

**Guidance**: Use SSO with Azure Active Directory (Azure AD) rather than configuring individual stand-alone credentials per-service. Use Security Center's Identity and Access Management recommendations.

- [Single sign-on to applications in Azure Active Directory](../active-directory/manage-apps/what-is-single-sign-on.md) 

- [How to monitor identity and access within Azure Security Center](../security-center/security-center-identity-access.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.5: Use multi-factor authentication for all Azure Active Directory-based access

**Guidance**: Enable Azure Active Directory (Azure AD) Multi-Factor Authentication (MFA) and follow Security Center's Identity and Access Management recommendations.

- [How to enable MFA in Azure](../active-directory/authentication/howto-mfa-getstarted.md) 

- [How to monitor identity and access within Azure Security Center](../security-center/security-center-identity-access.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.6: Use secure, Azure-managed workstations for administrative tasks

**Guidance**: Use Privileged Access Workstations (PAW) with Multi-Factor Authentication (MFA) configured to log into and access Azure network resources.

- [Learn about Privileged Access Workstations](/windows-server/identity/securing-privileged-access/privileged-access-workstations) 

- [How to enable MFA in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.7: Log and alert on suspicious activities from administrative accounts

**Guidance**: Utilize Azure Active Directory (Azure AD) Risk Detections to view alerts and reports on risky user behavior. 

Ingest Security Center Risk Detection alerts into Azure Monitor and configure custom alerting/notifications using Action Groups.

- [Understanding Security Center risk detections (suspicious activity)](/azure/active-directory/reports-monitoring/concept-risk-events) 

- [How to integrate Azure Activity Logs into Azure Monitor](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md) 

- [How to configure action groups for custom alerting and notification](../azure-monitor/platform/action-groups.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.8: Manage Azure resources from only approved locations

**Guidance**: Use Conditional Access named locations to allow access from only specific logical groupings of IP address ranges or countries/regions.

- [How to configure named locations in Azure](../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory (Azure AD) as a central authentication and authorization system for your services. Azure AD protects data by using strong encryption for data at rest and in transit and also salts, hashes, and securely stores user credentials.  

- [How to create and configure an Azure AD instance](../active-directory-domain-services/tutorial-create-instance.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.10: Regularly review and reconcile user access

**Guidance**: Use Azure Active Directory (Azure AD) to provide logs to help discover stale accounts. 

Azure Identity Access Reviews can be performed to efficiently manage group memberships, access to enterprise applications, and role assignments. User access should be reviewed on a regular basis to make sure only the active users have continued access.

- [Understand Azure AD reporting](/azure/active-directory/reports-monitoring/)

- [How to use Azure Identity Access Reviews](../active-directory/governance/access-reviews-overview.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.11: Monitor attempts to access deactivated credentials

**Guidance**: Integrate Azure Active Directory (Azure AD) Sign-in Activity, Audit and Risk Event log sources, with any SIEM or Monitoring tool based on your access. 

Streamline this process by creating Diagnostic Settings for Azure Active Directory user accounts and sending the audit logs and sign-in logs to a Log Analytics Workspace. Any desired alerts can be configured within Log Analytics Workspace.

- [How to integrate Azure Activity Logs into Azure Monitor](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.12: Alert on account sign-in behavior deviation

**Guidance**: Use Azure Active Directory's  (Azure AD) Risk and Identity Protection features to configure automated responses to detected suspicious actions related to user identities for your Virtual network. Ingest data into Azure Sentinel for any further investigations.

- [How to view Azure AD risky sign-ins](/azure/active-directory/reports-monitoring/concept-risky-sign-ins)

- [How to configure and enable Identity Protection risk policies](../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Data protection

*For more information, see the [Azure Security Benchmark: Data protection](../security/benchmarks/security-control-data-protection.md).*

### 4.4: Encrypt all sensitive information in transit

**Guidance**: Encrypt all sensitive information in transit. Ensure that any clients connecting to your Azure resources in your virtual networks are able to negotiate TLS 1.2 or greater. Follow Security Center recommendations for encryption at rest and encryption in transit. 

Microsoft provides several options which can be utilized by customers for securing data in transit internally within the Azure network and externally across the Internet to the end user. These include communication through Virtual Private Networks (utilizing IPsec/IKE encryption), Transport Layer Security (TLS) 1.2 or later (via Azure components such as Application Gateway or Azure Front Door), protocols directly on the Azure virtual machines (such as Windows IPsec or SMB), and more.

Additionally, "encryption by default" using MACsec (an IEEE standard at the data-link layer) is enabled for all Azure traffic traveling between Azure datacenters to ensure confidentiality and integrity of customer data.

- [Understand encryption in transit with Azure](../security/fundamentals/encryption-overview.md#encryption-of-data-in-transit)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### 4.6: Use Role-based access control to manage access to resources 

**Guidance**: Use Azure role-based access control (Azure RBAC) to manage access to data and resources. Otherwise use service-specific access-control methods. 

Choose built-in roles like Owner, Contributor, or Network contributor and assign the role to the appropriate scope. For example, you can assign a subset of virtual network capabilities with the specific permissions required for virtual networks to any of these roles. 

- [How to configure RBAC in Azure](../role-based-access-control/role-assignments-portal.md)

- [Plan virtual networks](virtual-network-vnet-plan-design-arm.md#permissions)

- [Review the Azure built-in roles](../role-based-access-control/built-in-roles.md#networking)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with the Azure Activity Logs to create alerts for when changes take place to critical Azure resources like Virtual Networks and network security groups.

- [Diagnostic logging for a network security group](virtual-network-nsg-manage-log.md)

- [How to create alerts for Azure Activity Log events](../azure-monitor/platform/alerts-activity-log.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Inventory and asset management

*For more information, see the [Azure Security Benchmark: Inventory and asset management](../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

**Guidance**: Use Azure Resource Graph to query and discover all networking resources like Virtual Networks, subnets within your subscriptions. Ensure you have appropriate (read) permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions.

- [How to create queries with Azure Graph](../governance/resource-graph/first-query-portal.md) 

- [How to view your Azure Subscriptions](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0) 

- [Understand Azure RBAC](../role-based-access-control/overview.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

- [How to create and use Tags](/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track Virtual network and related resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

- [How to create additional Azure subscriptions](/azure/billing/billing-create-subscription) 

- [How to create Management Groups](/azure/governance/management-groups/create) 

- [How to create and use Tags](/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.4: Define and maintain inventory of approved Azure resources

**Guidance**: You will need to create an inventory of approved Azure resources and approved software for compute resources as per your organizational needs.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:
- Not allowed resource types 

- Allowed resource types 

Query or discover resources within the subscriptions with Azure Resource Graph in high security-based environments, such as those with Azure Storage accounts. 

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md) 

- [How to create queries with Azure Graph](../governance/resource-graph/first-query-portal.md)

- [Azure policy sample built-ins for virtual network](/azure/virtual-network/policy-samples)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.7: Remove unapproved Azure resources and software applications

**Guidance**: Prevent resource creation or usage with Azure Policy as required by the organization's policies. Implement processes for removing unauthorized resources.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.9: Use only approved Azure services

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:
- Not allowed resource types 

- Allowed resource types 

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md) 

- [How to deny a specific resource type with Azure Policy](/azure/governance/policy/samples/not-allowed-resource-types)

- [Azure policy sample built-ins for virtual network](/azure/virtual-network/policy-samples)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.11: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Use Azure Conditional Access to limit user's ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resource Manager](../role-based-access-control/conditional-access-azure-management.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Secure configuration

*For more information, see the [Azure Security Benchmark: Secure configuration](../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Use Azure Policy aliases to create custom policies to audit or enforce the configuration of your Azure network resources and also use built-in Azure Policy definitions.

Export any of your build templates with Azure Resource Manager in JavaScript Object Notation (JSON) form and review it to ensure that the configurations meet or exceed the security requirements for your organization.

Implement recommendations from Security Center as a secure configuration baseline for your Azure resources.

- [How to view available Azure Policy Aliases](https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0)

- [Tutorial: Create and manage policies to enforce compliance](../governance/policy/tutorials/create-and-manage.md)

- [Azure policy sample built-ins for virtual network](/azure/virtual-network/policy-samples)

- [Single and multi-resource export to a template in Azure portal](../azure-resource-manager/templates/export-template-portal.md)

- [Security recommendations - a reference guide](../security-center/recommendations-reference.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure Resource Manager templates and Azure Policies to securely configure Azure resources associated with the Virtual network and related resources.  Azure Resource Manager templates are JSON (JavaScript Object Notation) based files used to deploy virtual machines along with Azure resources. Microsoft performs the maintenance on the base templates.  

Use Azure Policy [deny] and [deploy if not exist] effects to enforce secure settings across your Azure resources.

- [Information on creating Azure Resource Manager templates](../virtual-machines/windows/ps-template.md) 

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md) 

- [Understanding Azure Policy Effects](../governance/policy/concepts/effects.md)

- [Azure Resource Manager template samples for virtual network](template-samples.md)

- [Azure policy sample built-ins for virtual network](/azure/virtual-network/policy-samples)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.5: Securely store configuration of Azure resources

**Guidance**: Use Azure DevOps to securely store and manage your code like custom Azure policies, Azure Resource Manager templates, desired state configuration scripts. and so on.

You must have permissions to access the resources you wish to manage in Azure DevOps, such as your code, builds, and work tracking. Most permissions are granted through built-in security groups. You can grant or deny permissions to specific users, built-in security groups, or groups defined in Azure Active Directory (Azure AD) if integrated with Azure DevOps, or Active Directory if integrated with Team Foundation Server.

- [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops) 

- [About permissions and groups in Azure DevOps](/azure/devops/organizations/security/about-permissions)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Define and implement standard security configurations for Azure resources using Azure Policy. Use Azure Policy aliases to create custom policies to audit or enforce the network configuration of your Azure resources and any built-in policy definitions related to  specific resources. 

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to use Aliases](../governance/policy/concepts/definition-structure.md#aliases)

- [Azure policy sample built-ins for virtual network](/azure/virtual-network/policy-samples)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Use Security Center to perform baseline scans for your Azure Virtual Network and related resources. Use Azure Policy to alert and audit Azure resource configurations.

- [How to remediate recommendations in Security Center](../security-center/security-center-remediate-recommendations.md)

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Azure policy sample built-ins for virtual network](/azure/virtual-network/policy-samples)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.11: Manage Azure secrets securely

**Guidance**: Use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure secret management for your Azure resources hosted in an Azure Virtual Network.

- [How to integrate with Azure Managed Identities](../azure-app-configuration/howto-integrate-azure-managed-service-identity.md) 

- [How to create a Key Vault](/azure/key-vault/quick-create-portal) 

- [How to provide Key Vault authentication with a managed identity](/azure/key-vault/managed-identity)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.13: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Data recovery

*For more information, see the [Azure Security Benchmark: Data recovery](../security/benchmarks/security-control-data-recovery.md).*

### 9.1: Ensure regular automated back-ups

**Guidance**: Use Azure Resource Manager to deploy a virtual network and related resources. Azure Resource Manager provides ability to export templates which can be used as backups to restore Virtual network and related resources.  Use Azure Automation to call the Azure Resource Manager template export API on a regular basis.

- [Overview of Azure Resource Manager](../azure-resource-manager/management/overview.md)

- [Azure Resource Manager template samples for virtual network](template-samples.md)

- [Single and multi-resource export to a template in Azure portal](../azure-resource-manager/templates/export-template-portal.md)

- [Resource Groups - Export Template](/rest/api/resources/resourcegroups/exporttemplate)

- [Introduction to Azure Automation](../automation/automation-intro.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 9.2: Perform complete system backups and backup any customer-managed keys

**Guidance**: Use Azure Resource Manager to deploy a virtual network and related resources. Azure Resource Manager provides ability to export templates which can be used as backups to restore Virtual network and related resources. Use Azure Automation to call the Azure Resource Manager template export API on a regular basis. Back up customer-managed keys within Azure Key Vault.

- [Overview of Azure Resource Manager](../azure-resource-manager/management/overview.md)

- [Azure Resource Manager template samples for virtual network](template-samples.md)

- [Single and multi-resource export to a template in Azure portal](../azure-resource-manager/templates/export-template-portal.md)

- [Resource Groups - Export Template](/rest/api/resources/resourcegroups/exporttemplate)

- [Introduction to Azure Automation](../automation/automation-intro.md)

- [How to backup key vault keys in Azure](https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey?view=azurermps-6.13.0)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 9.3: Validate all backups including customer-managed keys

**Guidance**: Periodically perform deployment of Azure Resource Manager templates to an isolated subscription and test restoration of backed up customer-managed keys.

- [Deploy resources with ARM templates and Azure portal](../azure-resource-manager/templates/deploy-portal.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 9.4: Ensure protection of backups and customer-managed keys

**Guidance**: Use Azure DevOps to securely store and manage your code like custom Azure Policy definitions and Azure Resource Manager templates. 

Grant or deny permissions to specific users, built-in security groups, or groups defined in Azure Active Directory (Azure AD) if integrated with Azure DevOps, or Active Directory if integrated with Team Foundation Server.  

Use Azure role-based access control (Azure RBAC) to protect customer-managed keys.   

Enable Soft-Delete and purge protection in Key Vault to protect keys against accidental or malicious deletion.  

- [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops)

- [About permissions and groups in Azure DevOps](/azure/devops/organizations/security/about-permissions)

- [How to enable Soft-Delete and Purge protection in Key Vault](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete?tabs=azure-portal) 

- [Soft delete for Azure Storage blobs](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete?tabs=azure-portal)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Incident response

*For more information, see the [Azure Security Benchmark: Incident response](../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.  

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/06/27/inside-the-msrc-anatomy-of-a-ssirp-incident/)

- [Leverage NIST's Computer Security Incident Handling Guide to aid in the creation of your own incident response plan](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Clearly mark subscriptions (for example, production or non-production) using tags and create a naming system to clearly identify and categorize Azure resources, especially those processing sensitive data.  It is your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

- [Security alerts in Security Center](../security-center/security-center-alerts-overview.md)

- [Use tags to organize your Azure resources](/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence to help protect your Azure resources. Identify weak points and gaps and revise plan as needed.

- [NIST's publication - Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://csrc.nist.gov/publications/detail/sp/800-84/final)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved.

- [How to set the Security Center Security Contact](../security-center/security-center-provide-security-contact-details.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Security Center alerts and recommendations using the Continuous Export feature to help identify risks to Azure resources. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. 

You can also use the Security Center data connector to stream the alerts to Azure Sentinel.

- [How to configure continuous export](../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../sentinel/connect-azure-security-center.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

**Guidance**: Use the Workflow Automation feature in Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations to protect your Azure resources.

- [How to configure Workflow Automation and Logic Apps](../security-center/workflow-automation.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Penetration tests and red team exercises

*For more information, see the [Azure Security Benchmark: Penetration tests and red team exercises](../security/benchmarks/security-control-penetration-tests-red-team-exercises.md).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

**Guidance**: Follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies. Use Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1)

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Next steps

- See the [Azure security benchmark](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
