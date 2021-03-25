---
title: Azure security baseline for Azure DevTest Labs
description: The Azure DevTest Labs security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: devtest-lab
ms.topic: conceptual
ms.date: 02/17/2021
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure DevTest Labs

This security baseline applies guidance from the [Azure Security Benchmark version 1.0](../security/benchmarks/overview-v1.md) to Azure DevTest Labs. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure DevTest Labs. **Controls** not applicable to Azure DevTest Labs have been excluded.

To see how Azure DevTest Labs completely maps to the Azure Security Benchmark, see the [full Azure DevTest Labs security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](../security/benchmarks/security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

**Guidance**: When you deploy Azure DevTest Labs resources you must create or use an existing virtual network. Ensure that the chosen virtual network has a network security group applied to its subnets and network access controls configured specific to your application's trusted ports and sources. When a lab resources are configured with a virtual network, they are not publicly addressable and can only be accessed from within the virtual network. You can also choose to create a network isolated lab, where alongside lab environments, lab resources such as Storage Account and Key Vaults will also be completely isolated and only accessible through specified end points. 

Depending on your organizational needs, use the Azure Firewall service to centrally create, enforce, and log application and network connectivity policies across subscriptions and virtual networks.

- [How to configure a virtual network for Azure DevTest Labs](devtest-lab-configure-vnet.md)

- [How to create a network isolated DevTest Labs instance](network-isolation.md)

- [How to create a network security group with security rules](../virtual-network/tutorial-filter-network-traffic.md)

- [How to deploy and configure Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and NICs

**Guidance**: Deploy a network security group on the network that your Azure DevTest Labs resources are deployed to. Enable network security group flow logs on your network security groups for traffic auditing.

You may also send NSG flow logs to a Log Analytics Workspace and
use Traffic Analytics to provide insights into traffic flow in your Azure
cloud. Some advantages of Traffic Analytics are the ability to visualize
network activity and identify hot spots, identify security threats, understand
traffic flow patterns, and pinpoint network misconfigurations.

- [How to Enable NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to Enable and use Traffic Analytics](../network-watcher/traffic-analytics.md)

- [Understand Network Security provided by Azure Security Center](../security-center/security-center-network-recommendations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.3: Protect critical web applications

**Guidance**: Deploy Azure Web Application Firewall (WAF) in front of critical web applications deployed using Azure Resource Manager templates for additional inspection of incoming traffic. Enable diagnostic setting for WAF and ingest logs into a Storage Account, Event Hub, or Log Analytics workspace.

- [How to deploy Azure WAF](../web-application-firewall/ag/create-waf-policy-ag.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.4: Deny communications with known malicious IP addresses

**Guidance**: Deploying a Azure Virtual Network (VNet) for a lab enhances security and isolation for your lab. Subnets, access control policies, and other features also aid in restricting access. When deployed in a VNet, Azure DevTest Labs is not publicly addressable and can only be accessed from virtual machines and applications within the VNet.

Enable DDoS Standard protection on your Azure Virtual Networks to guard against DDoS attacks. Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious IP addresses.

Deploy Azure Firewall at each of the organization's network boundaries with Threat Intelligence enabled and configured to "Alert and deny" for malicious network traffic. Use Azure Security Center Just In Time Network access to configure NSGs to limit exposure of endpoints to approved IP addresses for a limited period. Use Azure Security Center Adaptive Network Hardening to recommend NSG configurations that limit ports and source IPs based on actual traffic and threat intelligence.

- [How to configure a virtual network for Azure DevTest Labs](devtest-lab-configure-vnet.md)

- [How to configure DDoS protection](../ddos-protection/manage-ddos-protection.md)

- [How to deploy Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md)

- [Understand Azure Security Center Integrated Threat Intelligence](../security-center/azure-defender.md)

- [Understand Azure Security Center Adaptive Network Hardening](../security-center/security-center-adaptive-network-hardening.md)

- [Understand Azure Security Center Just In Time Network Access Control](../security-center/security-center-just-in-time.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.5: Record network packets

**Guidance**: Enable Network Watcher packet capture on your
lab virtual network to investigate anomalous activities. 

- [How to Enable NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to Enable and use Traffic Analytics](../network-watcher/traffic-analytics.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Use an Azure Firewall deployed on your virtual network with Threat Intelligence enabled. Azure Firewall Threat intelligence-based filtering can alert and deny traffic to and from known malicious IP addresses and domains. The IP addresses and domains are sourced from the Microsoft Threat Intelligence feed. If your organization requires additional functionality on top of what Azure Firewall can provide, select an appropriate offer from the Azure Marketplace that supports IDS/IPS functionality with payload inspection capabilities.

Deploy the firewall solution of your choice at each of your organization's network boundaries to detect and/or deny malicious traffic.

- [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/?term=Firewall)
 

- [How to deploy Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md)
 

- [How to configure alerts with Azure Firewall](../firewall/threat-intel.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.7: Manage traffic to web applications

**Guidance**: When working with DevTest Labs Azure Resource Manager based
environments that include web applications, deploy an Azure Application Gateway
with HTTPS/TLS enabled for trusted certificates.

- [How to deploy Application Gateway](../application-gateway/quick-create-portal.md)

- [How to configure Application Gateway to use HTTPS](../application-gateway/create-ssl-portal.md)

- [Understand layer 7 load balancing with Azure web application gateways](../application-gateway/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: Use Virtual Network Service Tags to define network access controls on Network Security Groups or Azure Firewall configured for your DevTest Labs resources. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., ApiManagement) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

You may also use Application Security Groups to help simplify
complex security configuration. Application security groups enable you to
configure network security as a natural extension of an application's
structure, allowing you to group virtual machines and define network security
policies based on those groups.

- [Understand and use Service Tags](../virtual-network/service-tags-overview.md)

- [Understand and use Application Security Groups](../virtual-network/network-security-groups-overview.md#application-security-groups)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement standard security configurations for
network resources with Azure Policy.

You may also use Azure Blueprints to simplify large scale Azure
deployments by packaging key environment artifacts, such as Azure Resources
Manager templates, RBAC controls, and policies, in a single blueprint
definition. You can apply the blueprint to new subscriptions, and fine-tune
control and management through versioning.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Azure Policy samples for networking](../governance/policy/samples/built-in-policies.md#network)

- [How to create an Azure Blueprint](../governance/blueprints/create-blueprint-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.10: Document traffic configuration rules

**Guidance**: Use tags for network resources associated with your Azure DevTest Labs deployment in order to logically organize them into a taxonomy. For individual NSG rules, use the "Description" field to specify business need and/or duration (etc.) for any rules that allow traffic to/from a network.

Use any of the built-in Azure Policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with Tags and to notify you of existing untagged resources.

You may use Azure PowerShell or Azure CLI to look-up or perform actions on resources based on their Tags.

- [How to create and use Tags](../azure-resource-manager/management/tag-resources.md)

- [How to create a Virtual Network](../virtual-network/quick-create-portal.md)

- [How to create an NSG with a Security Config](../virtual-network/tutorial-filter-network-traffic.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Activity Log to monitor resource configurations and
detect changes to your Azure resources. Create alerts within Azure Monitor that
will trigger when changes to critical resources take place.

- [How to view and retrieve Azure Activity Log events](../azure-monitor/essentials/activity-log.md#view-the-activity-log)

- [How to create alerts in Azure Monitor](../azure-monitor/alerts/alerts-activity-log.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Logging and Monitoring

*For more information, see the [Azure Security Benchmark: Logging and Monitoring](../security/benchmarks/security-control-logging-monitoring.md).*

### 2.1: Use approved time synchronization sources

**Guidance**: Microsoft maintains time sources for Azure resources. However, you can manage time synchronization settings for your compute resources.

- [Time sync for Windows VMs in Azure](../virtual-machines/windows/time-sync.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 2.2: Configure central security log management

**Guidance**: Enable Azure Activity Log diagnostic settings and send the logs to a Log Analytics workspace, Azure event hub, or Azure storage account for archive. Activity logs provide insight into the operations that were done on your Azure DevTest Labs instances at the management plane-level. Using Azure activity log data, you can determine "what, who, and when" for any write operations (PUT, POST, DELETE) done at the management plane-level for your DevTest Labs instances.

- [Create diagnostic settings to send platform logs and metrics to different destinations](../azure-monitor/essentials/diagnostic-settings.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.3: Enable audit logging for Azure resources

**Guidance**: Enable Azure Activity Log diagnostic settings and send the logs to a Log Analytics workspace, Azure event hub, or Azure storage account for archive. Activity logs provide insight into the operations that were done on your Azure DevTest Labs instances at the management plane-level. Using Azure Activity Log data, you can determine the "what, who, and when" for any write operations (PUT, POST, DELETE) done at the management plane-level for your DevTest Labs instances.

- [Create diagnostic settings to send platform logs and metrics to different destinations](../azure-monitor/essentials/diagnostic-settings.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.4: Collect security logs from operating systems

**Guidance**: Azure DevTest Labs virtual machines (VMs) are created and owned by the customer. So, it’s the organization’s responsibility to monitor it. You can use Azure Security Center to monitor the compute OS. Data collected by Security Center from the operating system includes OS type and version, OS (Windows Event Logs), running processes, machine name, IP addresses, and logged in user. The Log Analytics Agent also collects crash dump files.

For more information, see the following articles:

- [How to collect Azure Virtual Machine internal host logs with Azure Monitor](../azure-monitor/vm/quick-collect-azurevm.md)

- [Understand Azure Security Center data collection](../security-center/security-center-enable-data-collection.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.5: Configure security log storage retention

**Guidance**: In Azure Monitor, set log retention period for Log Analytics workspaces associated with your Azure DevTest Labs instances according to your organization's compliance regulations.

- [For more information, see the following article](../azure-monitor/logs/manage-cost-storage.md#change-the-data-retention-period)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.6: Monitor and review Logs

**Guidance**: Enable Azure Activity Log diagnostic settings and send the logs to a Log Analytics workspace. Run queries in Log Analytics to search terms, identify trends, analyze patterns, and provide many other insights based on the activity log data that may have been collected for Azure DevTest Labs.

For more information, see the following articles:

- [How to enable Diagnostic Settings for Azure Activity Log](../azure-monitor/essentials/diagnostic-settings.md)

- [How to collect and analyze Azure activity logs in Log Analytics workspace in Azure Monitor](../azure-monitor/essentials/activity-log.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.7: Enable alerts for anomalous activities

**Guidance**: Use Azure Log Analytics workspace for monitoring and alerting on anomalous activities in security logs and events related to your Azure DevTest Labs.

- [How to alert on log analytics log data](../azure-monitor/alerts/tutorial-response.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Azure Active Directory (Azure AD) has built-in roles that must be explicitly assigned and are queryable. Use the Azure AD PowerShell module to run ad-hoc queries to discover accounts that are members of administrative groups.

- [How to get a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrole)

- [How to get members of a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrolemember)

- [Azure DevTest Labs roles](devtest-lab-add-devtest-user.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.2: Change default passwords where applicable

**Guidance**: Azure Active Directory (Azure AD) doesn't have the concept of default passwords. Other Azure resources requiring a password force a password to be created with complexity requirements and a minimum password length, which differ depending on the service. You're responsible for third-party applications and Marketplace services that may use default passwords.

DevTest Labs doesn't have the concept of default passwords.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.3: Use dedicated administrative accounts

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts. Use Azure Security Center Identity and Access Management to monitor the number of administrative accounts.

Additionally, to help you keep track of dedicated administrative accounts, you may use recommendations from Azure Security Center or built-in Azure Policies, such as:

- There should be more than one owner assigned to your subscription

- Deprecated accounts with owner permissions should be removed from your subscription
- External accounts with owner permissions should be removed from your subscription

- [How to use Azure Security Center to monitor identity and access (Preview)](../security-center/security-center-identity-access.md)

- [How to use Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Azure DevTest Labs roles](devtest-lab-add-devtest-user.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.4: Use single sign-on (SSO) with Azure Active Directory

**Guidance**: DevTest Labs uses the Azure Active Directory (Azure AD) service for identity management. Consider these two key aspects when you give users access to an environment based on DevTest Labs:
- Resource management: It provides access to the Azure portal to manage resources (create VMs, create environments, start, stop, restart, delete, and apply artifacts, and so on). Resource management is done in Azure by using Azure role-based access control (Azure RBAC). You assign roles to users and set resource and access-level permissions.
- Virtual machines (network-level): In the default configuration, VMs use a local admin account. If there's a domain available (Azure Active Directory Domain Services (Azure AD DS), an on-premises domain, or a cloud-based domain), machines can be joined to the domain. Users can then use their domain-based identities using the domain join artifact to connect to the machines.

- [Reference architecture for DevTest Labs](./devtest-lab-reference-architecture.md#architecture)

- [Understand SSO with Azure AD](../active-directory/manage-apps/what-is-single-sign-on.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

**Guidance**: Enable Azure Active Directory (Azure AD) multifactor authentication and follow Azure Security Center Identity and Access Management recommendations.

- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

- [How to monitor identity and access within Azure Security Center](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

**Guidance**: Use privileged access workstations (PAWs) with multifactor authentication configured to log into and configure Azure resources. 

- [Learn about Privileged Access Workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/)
 
- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.7: Log and alert on suspicious activities from administrative accounts

**Guidance**: Use Azure Active Directory (Azure AD) security reports for generation of logs and alerts when suspicious or unsafe activity occurs in the environment. Use Azure Security Center to monitor identity and access activity.

- [How to identify Azure AD users flagged for risky activity](../active-directory/identity-protection/overview-identity-protection.md)

- [How to monitor users' identity and access activity in Azure Security Center](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.8: Manage Azure resources only from approved locations

**Guidance**: Use conditional access named locations to allow access from only specific logical groupings of IP address ranges or countries/regions.

- [How to configure named locations in Azure](../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.

- [How to create and configure an Azure AD instance](../active-directory/fundamentals/active-directory-access-create-new-tenant.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.10: Regularly review and reconcile user access

**Guidance**: Azure Active Directory (Azure AD) provides logs to help discover stale accounts. Also, use Azure identity access reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access can be reviewed on a regular basis to make sure only the right Users have continued access.

- [Understand Azure AD reporting](../active-directory/reports-monitoring/overview-reports.md)

- [How to use Azure identity access reviews](../active-directory/governance/access-reviews-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.11: Monitor attempts to access deactivated credentials

**Guidance**: You have access to Azure Active Directory (Azure AD) sign in Activity, Audit, and Risk Event log sources, which allow you to integrate with any Security Information and Event Management (SIEM) /Monitoring tool.

You can streamline this process by creating Diagnostic Settings for Azure AD user accounts and sending the audit logs and sign-in logs to a Log Analytics Workspace. You can configure alerts within Log Analytics Workspace.

- [How to integrate Azure Activity Logs into Azure Monitor](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.12: Alert on account login behavior deviation

**Guidance**: Use Azure Active Directory (Azure AD) Risk and Identity Protection features to configure automated responses to detected suspicious actions related to user identities.

- [How to view Azure AD risky sign-ins](../active-directory/identity-protection/overview-identity-protection.md)

- [How to configure and enable Identity Protection risk policies](../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](../security/benchmarks/security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags to assist in tracking Azure resources that store or process sensitive information.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.6: Use Azure RBAC to manage access to resources

**Guidance**: Use Azure role-based access control (Azure RBAC) to control access to labs in Azure DevTest Labs.

- [How to configure Azure RBAC](../role-based-access-control/role-assignments-portal.md)

- [Understand roles in DevTest Labs](devtest-lab-add-devtest-user.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with the Azure Activity log to create alerts for when changes take place to DevTest Labs instances and other critical or related resources.

- [How to create alerts for Azure activity Log events](../azure-monitor/alerts/alerts-activity-log.md)

- [How to create alerts for DevTest Labs activity log events](create-alerts.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Inventory and Asset Management

*For more information, see the [Azure Security Benchmark: Inventory and Asset Management](../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

**Guidance**: Use Azure Resource Graph to query and discover all resources (including DevTest Labs resources) within your subscriptions. Ensure you have appropriate (read) permissions in your tenant and can enumerate all Azure subscriptions and resources within your subscriptions.

- [How to create queries with Azure Graph](../governance/resource-graph/first-query-portal.md)

- [How to view your Azure Subscriptions](/powershell/module/az.accounts/get-azsubscription?preserve-view=true&view=azps-4.8.0)

- [Understand Azure RBAC](../role-based-access-control/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them according to a taxonomy.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

- [Configure tags for DevTest Labs](devtest-lab-add-tag.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, and separate labs where appropriate, to organize and track labs and lab-related resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription quickly.

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create Management Groups](../governance/management-groups/create-management-group-portal.md)

- [How to create a lab using DevTest Labs](devtest-lab-create-lab.md)

- [How to create and use tags](devtest-lab-add-tag.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.4: Define and maintain an inventory of approved Azure resources

**Guidance**: Create an inventory of approved Azure resources and approved software for compute resources as per organizational needs. As a subscription admin, you can also use adaptive application controls, a feature of Azure Security Center to help you define a set of applications that are allowed to run on configured groups of lab machines. This feature is available for both Azure and non-Azure Windows (all versions, classic, or Azure Resource Manager) and Linux machines.

- [How to enable Adaptive Application Control](../security-center/security-center-adaptive-application.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

Also, use the Azure Resource Graph to query/discover resources within the subscriptions. It can help in high security-based environments, such as those with Storage accounts.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to create queries with Azure Graph](../governance/resource-graph/first-query-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.6: Monitor for unapproved software applications within compute resources

**Guidance**: Azure Automation provides complete control during deployment, operations, and decommissioning of workloads and resources. As a subscription admin, you can use Azure Virtual Machine inventory to automate the collection of information about all software on DevTest Labs VMs in your subscription. The software name, version, publisher, and refresh time properties are available from the Azure portal. To get access to install date and other information, customer required to enable guest-level diagnostic and bring the Windows Event logs into a Log Analytics Workspace.

In addition to using Change Tracking for monitoring of software applications, adaptive application controls in Azure Security Center use machine learning to analyze the applications running on your machines and create an allow list from this intelligence. This capability greatly simplifies the process of configuring and maintaining application allow list policies, enabling you to avoid unwanted software to be used in your environment. You can configure audit mode or enforce mode. Audit mode only audits the activity on the protected VMs. Enforce mode does enforce the rules and makes sure that applications that aren't allowed to run are blocked. 

- [An introduction to Azure Automation](../automation/automation-intro.md)

- [How to enable Azure VM inventory](../automation/automation-tutorial-installed-software.md)

- [Understand adaptive application controls](../security-center/security-center-adaptive-application.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.7: Remove unapproved Azure resources and software applications

**Guidance**: Azure Automation provides complete control during deployment, operations, and decommissioning of workloads and resources. As a subscription admin, you may use Change Tracking to identify all software installed on VMs hosted in DevTest Labs. You can implement your own process or use Azure Automation State Configuration for removing unauthorized software.

- [An introduction to Azure Automation](../automation/automation-intro.md)

- [Track changes in your environment with the Change Tracking solution](../automation/change-tracking/overview.md)

- [Azure Automation state configuration overview](../automation/automation-dsc-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.8: Use only approved applications

**Guidance**: As a subscription admin, you can use Azure Security Center Adaptive Application Controls to ensure that only authorized software executes, and all unauthorized software is blocked from executing on Azure VMs hosted in DevTest Labs.

- [How to use Azure Security Center Adaptive Application Controls](../security-center/security-center-adaptive-application.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.9: Use only approved Azure services

**Guidance**: Use Azure policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:
- Not allowed resource types
- Allowed resource types

Reference Material:

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to deny a specific resource type with Azure Policy](../governance/policy/samples/built-in-policies.md#general)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.10: Maintain an inventory of approved software titles

**Guidance**: Adaptive application control is an intelligent, automated, end-to-end solution from Azure Security Center, which helps you control which applications can run on your Azure and non-Azure machines (Windows and Linux), hosted in DevTest Labs. Note you need to be a subscription admin to configure this setting for the underlying compute resources hosted in DevTest Labs. Implement third-party solution if this setting doesn't meet your organization's requirement.

- [How to use Azure Security Center Adaptive Application Controls](../security-center/security-center-adaptive-application.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.11: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Use Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring **Block access** for the **Microsoft Azure Management** App.

- [How to configure Conditional Access to block access to Azure Resource Manager](../role-based-access-control/conditional-access-azure-management.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.12: Limit users' ability to execute scripts in compute resources

**Guidance**: Depending on the type of scripts, you may use operating system-specific configurations or third-party resources to limit users' ability to execute scripts within the VMs hosted in DevTest Labs. You can also use Azure Security Center Adaptive Application Controls to ensure that only authorized software executes, and all unauthorized software is blocked from executing on the underlying Azure VMs.

- [How to control PowerShell script execution in Windows Environments](/powershell/module/microsoft.powershell.security/set-executionpolicy?preserve-view=true&view=powershell-7)

- [How to use Azure Security Center Adaptive Application Controls](../security-center/security-center-adaptive-application.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.13: Physically or logically segregate high risk applications

**Guidance**: High risk applications deployed in your Azure environment may be isolated using virtual network, subnet, subscriptions, management groups, and so on. and sufficiently secured with either an Azure Firewall, Web Application Firewall (WAF), or network security group (NSG).

- [Configure virtual network for DevTest Labs](devtest-lab-configure-vnet.md)

- [Azure Firewall overview](../web-application-firewall/overview.md)

- [Web Application Firewall overview](../virtual-network/network-security-groups-overview.md)

- [Network security overview](security-baseline.md)

- [Organize your resources with Azure management groups](../governance/management-groups/overview.md)

- [Subscription decision guide](/azure/cloud-adoption-framework/decision-guides/subscriptions/)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Secure Configuration

*For more information, see the [Azure Security Benchmark: Secure Configuration](../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Use Azure Policy aliases to create custom policies to audit or enforce the configuration of your Azure resources created as part of DevTest Labs. You may also use built-in Azure Policy definitions.

Also, Azure Resource Manager has the ability to export the template in JavaScript Object Notation (JSON), which should be reviewed to ensure that the configurations meet / exceed the security requirements for your organization.

You may also use recommendations from Azure Security Center as a secure configuration baseline for your Azure resources.

- [How to view available Azure Policy aliases](/powershell/module/az.resources/get-azpolicyalias?preserve-view=true&view=azps-4.8.0)

- [Tutorial: Create and manage policies to enforce compliance](../governance/policy/tutorials/create-and-manage.md)

- [Single and multi-resource export to a template in Azure portal](../azure-resource-manager/templates/export-template-portal.md)

- [Security recommendations - a reference guide](../security-center/recommendations-reference.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.2: Establish secure operating system configurations

**Guidance**: Use Azure Security Center recommendations to maintain security configurations on all underlying compute resources created as part of DevTest Labs. Additionally, you may use custom operating system images or Azure Automation State configuration or DevTest Labs artifacts to establish the security configuration of the operating system required by your organization.

- [How to monitor Azure Security Center recommendations](../security-center/security-center-recommendations.md)

- [Security recommendations - a reference guide](../security-center/recommendations-reference.md)

- [Azure Automation State Configuration overview](../automation/automation-dsc-overview.md)

- [Upload a VHD and use it to create new Windows VMs in Azure](../virtual-machines/windows/upload-generalized-managed.md)

- [Create a Linux VM from a custom disk with the Azure CLI](../virtual-machines/linux/upload-vhd.md)

- [Create and distribute custom images to multiple DevTest Labs](image-factory-save-distribute-custom-images.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure Policy **deny** and **deploy if not exist** rules to enforce secure settings across your Azure resources created as a part of DevTest Labs. Also, you may use Azure Resource Manager templates to maintain the security configuration of your Azure resources required by your organization.

- [Understand Azure Policy effects](../governance/policy/concepts/effects.md)

- [Create and manage policies to enforce compliance](../governance/policy/tutorials/create-and-manage.md)

- [Azure Resource Manager templates overview](../azure-resource-manager/templates/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.4: Maintain secure operating system configurations

**Guidance**: Follow recommendations from Azure Security Center on performing vulnerability assessments on your underlying Azure compute resources created as part of a lab. Also, you may use Azure Resource Manager templates, custom operating system images, or Azure Automation State configuration to maintain the security configuration of the operating system required by your organization. You can also use the image factory solution, which is a configuration-as-code solution that builds and distributes images automatically on a regular basis with all the desired configurations.

Also, Azure Marketplace Virtual Machine Images published by Microsoft are managed and maintained by Microsoft.

- [How to implement Azure Security Center vulnerability assessment recommendations](../security-center/deploy-vulnerability-assessment-vm.md)

- [Azure Automation State Configuration overview](../automation/automation-dsc-overview.md)

- [Sample script to upload a VHD to Azure and create a new VM](/previous-versions/azure/virtual-machines/scripts/virtual-machines-windows-powershell-upload-generalized-script)

- [How to create an image factory in DevTest Labs](image-factory-create.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 7.5: Securely store configuration of Azure resources

**Guidance**: Use Azure DevOps to securely store and manage your code like custom Azure policies, Azure Resource Manager templates and Desired State Configuration scripts. To access the resources you manage in Azure DevOps, you can grant or deny permissions to specific users, built-in security groups, or groups defined in Azure Active Directory (Azure AD) if integrated with Azure DevOps.

- [Azure Repos Git tutorial](/azure/devops/repos/git/gitworkflow)

- [About permissions and groups](/azure/devops/organizations/security/about-permissions?preserve-view=true&tabs=preview-page&view=azure-devops)

- [Integration between Azure DevTest Labs and Azure DevOps workflow](devtest-lab-dev-ops.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.6: Securely store custom operating system images

**Guidance**: If using custom images, use Azure role-based access control (Azure RBAC) to ensure only authorized users may access the images. Using a Shared Image Gallery, you can share your images to specific labs that need it. For container images, store them in Azure Container Registry and use Azure RBAC to ensure only authorized users may access the images.

- [Understand Azure RBAC](../role-based-access-control/rbac-and-directory-admin-roles.md)

- [How to configure Azure RBAC](../role-based-access-control/quickstart-assign-role-user-portal.md)

- [Configure a Shared Image Gallery for a DevTest Labs](configure-shared-image-gallery.md)

- [Understand Azure RBAC for Container Registry](../container-registry/container-registry-roles.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Define and implement standard security configurations for Azure resources using Azure Policy. Use Azure Policy aliases to create custom policies to audit or enforce the network configuration of your Azure resources created under DevTest Labs. You may also make use of built-in policy definitions related to your specific resources. Additionally, you may use Azure Automation to deploy configuration changes.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to use aliases](../governance/policy/concepts/definition-structure.md#aliases)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.8: Deploy configuration management tools for operating systems

**Guidance**: Azure Automation State Configuration is a configuration management service for Desired State Configuration (DSC) nodes in any cloud or on-premises datacenter. You can easily onboard machines, assign them declarative configurations, and view reports showing each machine's compliance to the desired state you specified. You can also write a custom artifact that can installed on every lab machine to ensure they are follow organizational policies. 

- [Onboarding machines for management by Azure Automation State Configuration](../automation/automation-dsc-onboarding.md)

- [Creating custom artifacts for DevTest Labs virtual machines](devtest-lab-artifact-author.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Use Azure Security Center to perform baseline scans for your Azure Resources created under DevTest Labs. Additionally, use Azure Policy to alert and audit Azure resource configurations.

- [How to remediate recommendations in Azure Security Center](../security-center/security-center-remediate-recommendations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.10: Implement automated configuration monitoring for operating systems

**Guidance**: Use Azure Security Center to perform baseline scans for OS and Docker settings for containers that are ran in your lab.

- [Understand Azure Security Center container recommendations](../security-center/container-security.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.11: Manage Azure secrets securely

**Guidance**: Use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure secret management for your cloud applications.

- [Configure managed identity to deploy Azure Resource Manager environments in DevTest Labs](use-managed-identities-environments.md)

- [Configure managed identity to deploy virtual machines in DevTest Labs](enable-managed-identities-lab-vms.md)

- [How to create a key vault](../key-vault/general/quick-create-portal.md)

- [How to provide Key Vault authentication with a managed identity](../key-vault/general/authentication.md)

- [How to assign a Key Vault access policy](../key-vault/general/assign-access-policy-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.12: Manage identities securely and automatically

**Guidance**: Use Managed Identities to provide Azure services with an automatically managed identity in Azure Active Directory (Azure AD). Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code.

- [Configure managed identity to deploy Azure Resource Manager environments in DevTest Labs](use-managed-identities-environments.md)

- [Configure managed identity to deploy virtual machines in DevTest Labs](enable-managed-identities-lab-vms.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.13: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

- [How to set up Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Malware Defense

*For more information, see the [Azure Security Benchmark: Malware Defense](../security/benchmarks/security-control-malware-defense.md).*

### 8.1: Use centrally managed antimalware software

**Guidance**: Use Microsoft Antimalware for Azure to continuously monitor and defend your resources. For Linux, use third party antimalware solution.  Also, use Azure Security Center's Threat detection for data services to detect malware uploaded to storage accounts. 

- [How to configure Microsoft Antimalware for Azure](../security/fundamentals/antimalware.md) 

- [Threat protection in Azure Security Center](../security-center/azure-defender.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Microsoft Antimalware is enabled on the underlying host that supports Azure services (for example, Azure App Service hosted in a lab), however, it does not run on your content. 

Pre-scan files uploaded to non-compute Azure resources, such as App Service, Data Lake Storage, Blob Storage, and so on. 

Use Azure Security Center's threat detection for data services to detect malware uploaded to storage accounts. 

- [Understand Microsoft Antimalware for Azure](../security/fundamentals/antimalware.md) 

- [Understand Azure Security Center's threat detection for data services](../security-center/azure-defender.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 8.3: Ensure antimalware software and signatures are updated

**Guidance**: When deployed, Microsoft Antimalware for Azure will automatically install the latest signature, platform, and engine updates by default. Follow recommendations in Azure Security Center: "Compute &amp; Apps" to ensure all endpoints for DevTest Labs underlying compute resources are up to date with the latest signatures. The Windows OS can be further protected with additional security to limit the risk of virus or malware-based attacks with the Microsoft Defender Advanced Threat Protection service that integrates with Azure Security Center.

- [How to deploy Microsoft Antimalware for Azure](../security/fundamentals/antimalware.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Recovery

*For more information, see the [Azure Security Benchmark: Data Recovery](../security/benchmarks/security-control-data-recovery.md).*

### 9.1: Ensure regular automated back ups

**Guidance**: Currently, Azure DevTest Labs doesn't support VM backups and snapshots. However, you can enable and configure Azure Backup on the underlying Azure VMs hosted in DevTest Labs. And, you can also configure the wanted frequency and retention period for automatic backups as long as you have appropriate access to the underlying compute resources. 

- [An overview of Azure VM backup](../backup/backup-azure-vms-introduction.md)

- [Back up an Azure VM from the VM settings](../backup/backup-azure-vms-first-look-arm.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.2: Perform complete system backups and backup any customer-managed keys

**Guidance**: Currently, Azure DevTest Labs doesn't support VM backups and snapshots. However, you can create snapshots of your underlying Azure VMs hosted in the DevTest Labs or the managed disks attached to those instances using PowerShell or REST APIs as long as you have appropriate access to the underlying compute resources. You can also back up any customer-managed keys within Azure Key Vault.

Enable Azure Backup on target Azure VMs, and the wanted frequency and retention periods. It includes complete system state backup. If you're using Azure disk encryption, Azure VM backup automatically handles the backup of customer-managed keys.

- [Back up on Azure VMs that use encryption](../backup/backup-azure-vms-encryption.md)

- [Overview of Azure VM backup](../backup/backup-azure-vms-introduction.md)

- [An overview of Azure VM backup](../backup/backup-azure-vms-introduction.md)

- [How to back up Key Vault keys in Azure](/powershell/module/az.keyvault/backup-azkeyvaultkey?preserve-view=true&view=azps-4.8.0)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.3: Validate all backups including customer-managed keys

**Guidance**: Ensure ability to periodically perform data restoration of content within Azure Backup. If necessary, test restoration of content to an isolated virtual network or subscription. Also, test restoration of backed up customer-managed keys.

If you're using Azure disk encryption, you can restore the Azure VM with the disk encryption keys. When using disk encryption, you can restore the Azure VM with the disk encryption keys.

- [Back up on Azure VMs that use encryption](../backup/backup-azure-vms-encryption.md)

- [How to recover files from Azure VM backup](../backup/backup-azure-restore-files-from-vm.md)

- [How to restore key vault keys in Azure](/powershell/module/az.keyvault/restore-azkeyvaultkey?preserve-view=true&view=azps-4.8.0)

- [How to back up and restore an encrypted VM](../backup/backup-azure-vms-encryption.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.4: Ensure protection of backups and customer-managed keys

**Guidance**: When you back up managed disks with Azure Backup, VMs are encrypted at rest with Storage Service Encryption (SSE). Azure Backup can also back up Azure VMs that are encrypted by using Azure Disk Encryption. Azure Disk Encryption integrates with BitLocker encryption keys (BEKs), which are safeguarded in a key vault as secrets. Azure Disk Encryption also integrates with Azure Key Vault key encryption keys (KEKs). Enable Soft-Delete in Key Vault to protect keys against accidental or malicious deletion.

- [Soft delete for VMs](../backup/soft-delete-virtual-machines.md)

- [Azure Key Vault soft-delete overview](../key-vault/general/soft-delete-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide

**Guidance**: Develop an incident response guide for your organization. Ensure there are written incident response plans that define all the roles of personnel as well as the phases of incident handling and management from detection to post-incident review. 

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/) 

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/06/27/inside-the-msrc-anatomy-of-a-ssirp-incident/) 

- [Use NIST's Computer Security Incident Handling Guide to aid in the creation of your own incident response plan](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Azure Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, mark subscriptions using tags and create a naming system to identify and categorize Azure resources, especially those processing sensitive data.  It's your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred. 

- [Security alerts in Azure Security Center](../security-center/security-center-alerts-overview.md) 

- [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems' incident response capabilities on a regular cadence to help protect your Azure resources. Identify weak points and gaps and then revise your response plan as needed. 

- [NIST's publication - Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://csrc.nist.gov/publications/detail/sp/800-84/final)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved. 

- [How to set the Azure Security Center security contact](../security-center/security-center-provide-security-contact-details.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Azure Security Center alerts and recommendations using the continuous export feature to help identify risks to Azure resources. Continuous export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You can use the Azure Security Center data connector to stream the alerts to Azure Sentinel. 

- [How to configure continuous export](../security-center/continuous-export.md) 

- [How to stream alerts into Azure Sentinel](../sentinel/connect-azure-security-center.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.6: Automate the response to security alerts

**Guidance**: Use workflow automation feature Azure Security Center to automatically trigger responses to security alerts and recommendations to protect your Azure resources. 

- [How to configure workflow automation in Security Center](../security-center/workflow-automation.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Penetration Tests and Red Team Exercises

*For more information, see the [Azure Security Benchmark: Penetration Tests and Red Team Exercises](../security/benchmarks/security-control-penetration-tests-red-team-exercises.md).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

**Guidance**: Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications. 

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1) 

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Next steps

- See the [Azure Security Benchmark V2 overview](../security/benchmarks/overview.md)
- Learn more about [Azure security baselines](../security/benchmarks/security-baselines-overview.md)
