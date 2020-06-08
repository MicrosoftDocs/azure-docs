---
title: Azure security baseline for Batch
description: Azure security baseline for Batch
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 06/10/2020
ms.author: mbaldwin
ms.custom: security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Batch

The Azure Security Baseline for Batch contains recommendations that will help you improve the security posture of your deployment.

The baseline for this service is drawn from the [Azure Security Benchmark version 1.0](https://docs.microsoft.com/azure/security/benchmarks/overview), which provides recommendations on how you can secure your cloud solutions on Azure with our best practices guidance.

For more information, see the [Azure security baselines overview](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview).

## Network security

*For more information, see [Security control: Network security](https://docs.microsoft.com/azure/security/benchmarks/security-control-network-security).*

### 1.1: Protect Azure resources within virtual networks

**Guidance**: Deploy Azure Batch pool(s) within virtual network. To allow pool compute nodes to communicate securely with other virtual machines, or with an on-premises network, you can provision the pool in a subnet of an Azure virtual network. Also, deploying your Pool within a virtual network gives you control over the network security group (NSG) used to secure the individual nodes' network interfaces (NIC), as well as the subnet. Configure the NSG to allow traffic from only trusted IP(s)/locations on the Internet.

* [How to create an Azure Batch Pool within a Virtual Network](https://docs.microsoft.com/azure/batch/batch-virtual-network)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and NICs

**Guidance**: Use Azure Security Center and remediate network protection recommendations related to the virtual network/ network security group (NSG) associated with your Batch pool. Enable flow logs on the NSG being used to protect your Batch pool, and send logs into a Azure Storage Account for traffic audit. You may also send NSG flow logs to a Azure Log Analytics workspace and use Azure Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Azure Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network mis-configurations.

* [How to Enable NSG Flow Logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal)

* [How to Enable and use Traffic Analytics](https://docs.microsoft.com/azure/network-watcher/traffic-analytics)

* [Understand Network Security provided by Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-network-recommendations)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.3: Protect critical web applications

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.4: Deny communications with known malicious IP addresses

**Guidance**: Enable Azure DDoS (distributed denial-of-service) Standard protection on the virtual network protecting your Azure Batch pool for protection against DDoS attacks. Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious or unused Internet IP addresses.

* [How to configure DDoS protection](https://docs.microsoft.com/azure/virtual-network/manage-ddos-protection)

* [Understand Azure Security Center Integrated Threat Intelligence](https://docs.microsoft.com/azure/security-center/security-center-alerts-service-layer)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.5: Record network packets

**Guidance**: Enable flow logs on the network security group (NSG) being used to protect your Azure Batch pool, and send logs into a Azure Storage Account for traffic audit.

* [How to Enable NSG Flow Logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: If required for compliance purposes, select a network virtual appliance from the Azure Marketplace that supports intrusion detection systems (IDS) and intrusion prevention systems (IPS) functionality with payload inspection capabilities.

If intrusion detection and/or prevention based on payload inspection is not a requirement, Azure Firewall with threat intelligence can be used. Azure Firewall threat intelligence-based filtering can alert and deny traffic to and from known malicious IP addresses and domains. The IP addresses and domains are sourced from the Microsoft Threat Intelligence feed.

Deploy Azure Firewall with a public IP address in the same virtual network as your Azure Batch Pool nodes. Configure network address translation (NAT) rules between trusted locations on the Internet and the private IP addresses of your individual pool nodes. On the Azure Firewall, under Threat Intelligence, configure "Alert and deny" to block to alert and block traffic to/from known malicious IP addresses and domains. The IP addresses and domains are sourced from the Microsoft Threat Intelligence feed, and only highest confidence records are included.

* [How to create an Azure Batch Pool within a Virtual Network](https://docs.microsoft.com/azure/batch/batch-virtual-network)

* [How to deploy Azure Firewall](https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal)

* [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/?term=Firewall)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.7: Manage traffic to web applications

**Guidance**: Not applicable, Benchmark is intended for web applications running on Azure App Service or IaaS instances.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: Use virtual network service tags to define network access controls on network security groups or Azure Firewalls associated with your Azure Batch pool(s). You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., ApiManagement) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

* [Understand and using service tags](https://docs.microsoft.com/azure/virtual-network/service-tags-overview)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement standard security configurations for network resources associated with your Azure Batch pool(s) with Azure Policy. Use Azure Policy aliases in the "Microsoft.Batch" and "Microsoft.Network" namespaces to create custom policies to audit or enforce the network configuration of your Azure Batch pools.

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.10: Document traffic configuration rules

**Guidance**: Use tags for network service groups (NSGs) and other resources related to network security and traffic flow that are associated with your Azure batch pools. For individual NSG rules, use the "Description" field to specify business need and/or duration (etc.) for any rules that allow traffic to/from a network.

Use any of the built-in Azure Policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with tags and to notify you of existing untagged resources.

You may use Azure PowerShell or Azure CLI to look-up or perform actions on resources based on their tags.

* [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

* [How to create a virtual network](https://docs.microsoft.com/azure/virtual-network/quick-create-portal)

* [How to create an NSG](https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network resources related to your Azure Batch pools. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place.

* [How to view and retrieve Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view)

* [How to create alerts in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Logging and monitoring

*For more information, see [Security control: Logging and monitoring](https://docs.microsoft.com/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.1: Use approved time synchronization sources

**Guidance**: For Azure Batch, by default, Microsoft provides time sync. However, if you have specific time sync requirements, you may implement those changes.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Microsoft

### 2.2: Configure central security log management

**Guidance**: Onboard Azure Batch account to Azure Monitor to aggregate security data generated by the cluster devices. Leverage custom queries to detect and respond to threats in the environment. For Azure Batch resource-level monitoring, use the Batch APIs to monitor or query the status of your resources including jobs, tasks, nodes, and pools.

* [How to onboard an Azure Batch account to Azure Monitor](https://docs.microsoft.com/azure/batch/batch-diagnostics)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

**Guidance**: For Azure Batch account level monitoring, monitor each Batch account using features of Azure Monitor. Azure Monitor collects metrics and optionally diagnostic logs for resources scoped at the level of a Batch account, such as pools, jobs, and tasks. Collect and consume this data manually or programmatically to monitor activities in your Batch account and to diagnose issues.

For Azure Batch resource level monitoring, use the Azure Batch APIs to monitor or query the status of your resources including jobs, tasks, nodes, and pools.

* [How to configure Azure Batch account-level monitoring and logging](https://docs.microsoft.com/azure/batch/monitoring-overview)

* [Understand Batch resource-level monitoring](https://docs.microsoft.com/azure/batch/monitoring-overview#batch-resource-monitoring)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.4: Collect security logs from operating systems

**Guidance**: Azure Monitor collects metrics and diagnostic logs for resources in your Azure Batch account. Collect and consume this data in a variety of ways to monitor your Azure Batch account and diagnose issues. You can also configure metric alerts so you receive notifications when a metric reaches a specified value.

If required, you maybe connect to your individual pool nodes via Secured Shell (SSH) or Remote Desktop Protocol (RDP) to access local operating system logs.

* [How to collect diagnostic logs from your Azure Batch account](https://docs.microsoft.com/azure/batch/batch-diagnostics#batch-diagnostics)

* [How to remotely connect to your Azure Batch pool nodes](https://docs.microsoft.com/azure/batch/batch-api-basics#error-handling)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.5: Configure security log storage retention

**Guidance**: Onboard Azure Batch Account to Azure Monitor. Ensure that the Azure Log Analytics workspace used has the log retention period set according to your organization's compliance regulations

* [How to configure Azure Batch monitoring and logging](https://docs.microsoft.com/azure/batch/monitoring-overview)

* [How to configure Azure Log Analytics workspace retention period](https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.6: Monitor and review Logs

**Guidance**: Create Azure Batch metric alerts that trigger when the value of a specified metric crosses a given threshold.

* [How to configure Azure Batch metric alerts](https://docs.microsoft.com/azure/batch/batch-diagnostics)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activities

**Guidance**: Create Azure Batch metric alerts that trigger when the value of a specified metric crosses a given threshold.

* [How to configure Azure Batch metric alerts](https://docs.microsoft.com/azure/batch/batch-diagnostics)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.8: Centralize anti-malware logging

**Guidance**: Use Windows Defender on your individual batch nodes in the case of Windows operating systems, or provide your own anti-malware solution if you are using Linux.

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.9: Enable DNS query logging

**Guidance**: Implement third-party solution for DNS logging.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.10: Enable command-line audit logging

**Guidance**: Manually configure console logging and PowerShell transcription on a per-node basis.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Identity and access control

*For more information, see [Security control: Identity and access control](https://docs.microsoft.com/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Maintain record of the local administrative account that is created during provisioning of the Azure Batch pool as well as any other accounts that you create. In addition, if Azure Active Directory integration is used, Azure AD has built-in roles that must be explicitly assigned and are therefore queryable. Use the Azure AD PowerShell module to perform adhoc queries to discover accounts that are members of administrative groups.

In addition, you may use Azure Security Center Identity and Access Management recommendations.

* [How to get a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0)

* [How to get members of a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0)

* [How to monitor identity and access with Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.2: Change default passwords where applicable

**Guidance**: When provisioning a Azure Batch pool, you are given the option to create local machine accounts. There are no default passwords to change, however you can specify different passwords for Secured Shell (SSH) and Remote Desktop Protocol (RDP) access. After Azure Batch Pool has been configured, you can generate a random user for individual nodes within the Azure portal, or via Azure Resource Manager API.

* [How to add a user to specific compute node](https://docs.microsoft.com/rest/api/batchservice/computenode/adduser)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.3: Use dedicated administrative accounts

**Guidance**: Integrate Authentication for Azure Batch Applications with Azure Active Directory. Create policies and procedures around the use of dedicated administrative accounts.

In addition, you may use Azure Security Center Identity and Access Management recommendations.

* [How to authenticate Batch applications with Azure Active Directory](https://docs.microsoft.com/azure/batch/batch-aad-auth)

* [How to monitor identity and access with Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.4: Use single sign-on (SSO) with Azure Active Directory

**Guidance**: Not applicable, While Azure Batch supports Azure AD authentication, single sign-on is not supported.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

**Guidance**: Integrate Authentication for Azure Batch Applications with Azure Active Directory. Enable Azure AD multi-factor authentication (MFA) and follow Azure Security Center Identity and Access Management recommendations.

* [How to enable MFA in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

* [How to monitor identity and access within Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

**Guidance**: Use PAWs (privileged access workstations) with multi-factor authentication (MFA) configured to log into and configure your Azure Batch resources.

* [Learn about Privileged Access Workstations](https://docs.microsoft.com/windows-server/identity/securing-privileged-access/privileged-access-workstations)

* [How to enable MFA in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.7: Log and alert on suspicious activities from administrative accounts

**Guidance**: If you have integrated authentication for Azure Batch Applications with Azure Active Directory, use Azure Active Directory security reports for generation of logs and alerts when suspicious or unsafe activity occurs in the environment. Use Azure Security Center to monitor identity and access activity.

* [How to identify Azure AD users flagged for risky activity](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-user-at-risk)

* [How to monitor users identity and access activity in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.8: Manage Azure resources from only approved locations

**Guidance**: If you have integrated authentication for Azure Batch Applications with Azure Active Directory, you can use Conditional Access Named Locations to allow access from only specific logical groupings of IP address ranges or countries/regions.

* [How to configure Named Locations in Azure](https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory as the central authentication and authorization system and integrate Authentication for Azure Batch Applications with Azure AD. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.

* [How to create and configure an Azure AD instance](https://docs.microsoft.com/azure/active-directory-domain-services/tutorial-create-instance)

* [How to authenticate Batch applications with Azure AD](https://docs.microsoft.com/azure/batch/batch-aad-auth)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.10: Regularly review and reconcile user access

**Guidance**: Azure Active Directory provides logs to help discover stale accounts. In addition, you may use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. Users' access can be reviewed on a regular basis to make sure only the right users have continued access.

* [How to use Azure Identity Access Reviews](https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.11: Monitor attempts to access deactivated credentials

**Guidance**: Create Diagnostic Settings for Azure Active Directory user accounts, sending the audit logs and sign-in logs to a Azure Log Analytics workspace. Configure desired Alerts within Azure Log Analytics workspace.

* [How to integrate Azure Activity Logs into Azure Monitor](https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.12: Alert on account login behavior deviation

**Guidance**: Use Azure Active Directory Risk Detections and Identity Protection feature to configure automated responses to detected suspicious actions related to user identities. Additionally, you can ingest data into Azure Sentinel for further investigation.

* [How to view Azure AD risky sign-ins](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risky-sign-ins)

* [How to configure and enable Identity Protection risk policies](https://docs.microsoft.com/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies)

* [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

**Guidance**: Not available; Customer Lockbox not yet supported for Azure Batch.

* [List of Customer Lockbox supported services](https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview#supported-services-and-scenarios-in-general-availability)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Data protection

*For more information, see [Security control: Data protection](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags to assist in tracking Azure resources that store or process sensitive information.

* [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. Azure Batch Pools should be separated by virtual network/subnet, tagged appropriately, and secured with an network security groups (NSG). Azure Batch data should be contained within a secured Azure Storage Account.

* [How to create an Azure Batch Pool within a Virtual Network](https://docs.microsoft.com/azure/batch/batch-virtual-network)

* [How to secure Azure Storage Accounts](https://docs.microsoft.com/azure/storage/common/storage-security-guide)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: For Azure Storage Accounts associated with your Azure Batch Pool(s) which contain sensitive information, mark them as sensitive using Tags and secure them with Azure best-practices.

Data identification, classification, and loss prevention features are not yet available for Azure Storage or compute resources. Implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

* [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

* [How to secure Azure Storage Accounts](https://docs.microsoft.com/azure/storage/common/storage-security-guide)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### 4.4: Encrypt all sensitive information in transit

**Guidance**: Encrypt all sensitive information in transit. Microsoft Azure resources will negotiate TLS 1.2 by default. Ensure that any clients connecting to your Azure Batch Pools or data stores (Azure Storage Accounts) are able to negotiate TLS 1.2 or greater.

Ensure HTTPS is required for accessing the Storage Account containing your Azure Batch data.

* [Understand Azure Storage Account Encryption in Transit](https://docs.microsoft.com/azure/storage/blobs/security-recommendations)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: For Azure Storage Accounts associated with your Azure Batch Pool(s) which contain sensitive information, mark them as sensitive using tags and secure them with Azure best-practices.

Data identification, classification, and loss prevention features are not yet available for Azure Storage or compute resources. Implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

* [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

* [How to secure Azure Storage Accounts](https://docs.microsoft.com/azure/storage/common/storage-security-guide)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### 4.6: Use Role-based access control to control access to resources

**Guidance**: Use Azure Active Directory Role-based access control (RBAC) to control access to the management plane of Azure resources including Batch Account, Batch Pool(s), and Storage Accounts.

* [Understand Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/overview)

* [How to configure RBAC in Azure](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.7: Use host-based data loss prevention to enforce access control

**Guidance**: Data identification, classification, and loss prevention features are not yet available for Azure Storage or compute resources. Implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

* [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### 4.8: Encrypt sensitive information at rest

**Guidance**: For storage accounts associated with your Azure Batch account, it is recommended to allow Microsoft to manage encryption keys, however, you have the option to manage your own keys if required.

* [How to manage encryption keys for Azure Storage Accounts](https://docs.microsoft.com/azure/storage/common/storage-encryption-keys-portal)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with the Azure Activity Log to create alerts for when changes take place to critical Azure resources related to or associated with your Azure Batch accounts/pools.

Configure Diagnostic Settings for Storage Accounts associated with Azure Batch Pool to monitor and log all CRUD operations against pool data.

* [How to create alerts for Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

* [How to enable additional logging/auditing for an Azure Storage Account](https://docs.microsoft.com/azure/storage/common/storage-monitor-storage-account)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Vulnerability management

*For more information, see [Security control: Vulnerability management](https://docs.microsoft.com/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: For Azure Batch Pool nodes, you are responsible for managing the vulnerability management solution.

Optionally, if you have a Rapid7, Qualys, or any other vulnerability management platform subscription, you may manually install vulnerability assessment agents on Batch pool nodes and manage nodes through the respective portal.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 5.2: Deploy automated operating system patch management solution

**Guidance**: Microsoft to maintain and update base Azure Batch Pool node images. Ensure Azure Batch Pool nodes' operating system remains patched for the duration of the cluster lifetime which may require enabling automatic updates, monitoring the nodes, or performing periodic reboots.

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### 5.3: Deploy automated patch management solution for third-party software titles

**Guidance**: Ensure Azure Batch Pool nodes' third-party applications remain patched for the duration of the cluster lifetime which may require enabling automatic updates, monitoring the nodes, or performing periodic reboots.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 5.4: Compare back-to-back vulnerability scans

**Guidance**: If you have a Rapid7, Qualys, or any other vulnerability management platform subscription, you may use that vendor's portal to view and compare back-to-back vulnerability scans.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

**Guidance**: Use a common risk scoring program (e.g. Common Vulnerability Scoring System) or the default risk ratings provided by your third-party scanning tool.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Inventory and asset management

*For more information, see [Security control: Inventory and asset management](https://docs.microsoft.com/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use automated Asset Discovery solution

**Guidance**: Use Azure Resource Graph to query/discover all resources (such as compute, storage, network, etc.) within your subscription(s). Ensure that you have appropriate (read) permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Azure Resource Graph Explorer, it is highly recommended to create and use Azure Resource Manager resources going forward.

* [How to create queries with Azure Resource Graph Explorer](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

* [How to view your Azure Subscriptions](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0)

* [Understand Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/overview)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

* [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track assets. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

* [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/billing/billing-create-subscription)

* [How to create Management Groups](https://docs.microsoft.com/azure/governance/management-groups/create)

* [How to create and use Tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.4: Define and Maintain an inventory of approved Azure resources

**Guidance**: Define list of approved Azure resources and approved software for compute resources

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:
- Not allowed resource types
- Allowed resource types

Use Azure Resource Graph to query/discover resources within your subscription(s). Ensure that all Azure resources present in the environment are approved.

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

* [How to create queries with Azure Resource Graph Explorer](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.6: Monitor for unapproved software applications within compute resources

**Guidance**: For Azure Batch Pool nodes, implement a third-party solution to monitor cluster nodes for unapproved software applications.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.7: Remove unapproved Azure resources and software applications

**Guidance**: For Azure Batch Pool nodes, implement a third-party solution to monitor cluster nodes for unapproved software applications.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.8: Use only approved applications

**Guidance**: For Azure Batch Pool nodes, implement a third-party solution to prevent unauthorized software from executing.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.9: Use only approved Azure services

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:
- Not allowed resource types
- Allowed resource types

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

* [How to deny a specific resource type with Azure Policy](https://docs.microsoft.com/azure/governance/policy/samples/not-allowed-resource-types)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.10: Maintain an inventory of approved software titles

**Guidance**: For Azure Batch Pool nodes, implement a third-party solution to prevent unauthorized file types from executing.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.11: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Use Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

* [How to configure Conditional Access to block access to Azure Resource Manager](https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.12: Limit users' ability to execute scripts within compute resources

**Guidance**: Not applicable,

This is not applicable to Azure Batch, as users (non-administrators) of the Azure Batch pools do not need access to the individual nodes to run jobs. The cluster administrator already has root access to all nodes.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.13: Physically or logically segregate high risk applications

**Guidance**: Not applicable, Benchmark is intended for web applications running on Azure App Service or IaaS instances.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Secure configuration

*For more information, see [Security control: Secure configuration](https://docs.microsoft.com/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Use Azure Policy aliases in the "Microsoft.Batch" namespace to create custom policies to audit or enforce the configuration of your Azure Batch accounts and pools.

* [How to view available Azure Policy aliases](https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0)

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.2: Establish secure operating system configurations

**Guidance**: Establish secure configurations for your Batch Pool nodes' operating system.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] to enforce secure settings for the Azure resources related to your Batch account and pools (such as virtual networks, subnets, Azure Firewalls, Azure Storage Accounts, etc.). You may use Azure Policy aliases from the following namespaces to create custom policies:
- Microsoft.Batch
- Microsoft.Storage
- Microsoft.Network

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

* [Understand Azure Policy Effects](https://docs.microsoft.com/azure/governance/policy/concepts/effects)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.4: Maintain secure operating system configurations

**Guidance**: Azure Batch Pool Operating System Images managed and maintained by Microsoft. You are responsible for implementing OS-level state configuration.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### 7.5: Securely store configuration of Azure resources

**Guidance**: If using custom Azure Policy definitions for your Azure Batch accounts, pools, or related resources, use Azure Repos to securely store and manage your code.

* [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops)

* [Azure Repos Documentation](https://docs.microsoft.com/azure/devops/repos/index?view=azure-devops)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.6: Securely store custom operating system images

**Guidance**: If using custom images for your Azure Batch pools, use Role-based access control (RBAC) to ensure only authorized users may access the images.

* [Understand RBAC in Azure](https://docs.microsoft.com/azure/role-based-access-control/rbac-and-directory-admin-roles)

* [How to configure RBAC in Azure](https://docs.microsoft.com/azure/role-based-access-control/quickstart-assign-role-user-portal)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Use built-in Azure Policy definitions to alert, audit, and enforce Azure Batch-related resource configurations. Use Azure Policy aliases in the "Microsoft.Batch" namespace to create custom policies for your Azure Batch accounts and pools. Additionally, develop a process and pipeline for managing policy exceptions.

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.8: Deploy configuration management tools for operating systems

**Guidance**: Implement a third-party solution to maintain desired state for your Azure Batch Pool nodes' operating systems.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Use Azure Policy aliases in the "Microsoft.Batch" namespace to create custom policies to audit or enforce the configuration of your Azure Batch instance. You may also use any built-in policies created specifically for Azure Batch or the resources used by Azure Batch, such as:
- Subnets should be associated with a Network Security Group
-Storage Accounts should use a virtual network service endpoint
- Diagnostic logs in Batch accounts should be enabled

* [How to view available Azure Policy aliases](https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0)

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.10: Implement automated configuration monitoring for operating systems

**Guidance**: Implement a third-party solution to monitor the state of your Azure Batch Pool nodes' operating systems.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.11: Manage Azure secrets securely

**Guidance**: Azure Key Vault may be used with Azure Batch deployments to manage keys for pool storage within Azure Storage Accounts.

* [How to integrate with Azure Managed Identities](https://docs.microsoft.com/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity)

* [How to create a Azure Key Vault](https://docs.microsoft.com/azure/key-vault/quick-create-portal)

* [How to provide Key Vault authentication with a managed identity](https://docs.microsoft.com/azure/key-vault/managed-identity)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.12: Manage identities securely and automatically

**Guidance**: Not available, Managed Service Identity not supported by Azure Batch

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.13: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

* [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Malware defense

*For more information, see [Security control: Malware defense](https://docs.microsoft.com/azure/security/benchmarks/security-control-malware-defense).*

### 8.1: Use centrally managed anti-malware software

**Guidance**: Use Windows Defender on your individual Azure Batch pool nodes in the case of Windows operating systems, or provide your own anti-malware solution if you are using Linux.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Microsoft Antimalware is enabled on the underlying host that supports Azure services (for example, Azure Batch), however it does not run on customer content.

Pre-scan any files being uploaded to non-compute Azure resources, such as App Service, Data Lake Storage, Blob Storage, etc. Microsoft cannot access customer data in these instances.

* [Understand Microsoft Antimalware for Azure Cloud Services and Virtual Machines](https://docs.microsoft.com/azure/security/fundamentals/antimalware)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 8.3: Ensure anti-malware software and signatures are updated

**Guidance**: Use Windows Defender on your individual Azure Batch pool nodes in the case of Windows operating systems and ensure automatic update is enabled. Provide your own anti-malware solution if you are using Linux.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Data recovery

*For more information, see [Security control: Data recovery](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure regular automated back ups

**Guidance**: When using an Azure Storage Account for the Azure Batch Pool data store, choose the appropriate redundancy option (LRS,ZRS, GRS, RA-GRS).

* [How to configure storage redundancy for Azure Storage Accounts](https://docs.microsoft.com/azure/storage/common/storage-redundancy)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.2: Perform complete system backups and backup any customer-managed keys

**Guidance**: When using an Azure Storage Account for the Azure Batch Pool data store, choose the appropriate redundancy option (LRS,ZRS, GRS, RA-GRS). If using Azure Key Vault for any part of your Azure Batch deployment, ensure your keys are backed up.

* [How to configure storage redundancy for Azure Storage Accounts](https://docs.microsoft.com/azure/storage/common/storage-redundancy)

* [How to backup key vault keys in Azure](https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey?view=azurermps-6.13.0)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 9.3: Validate all backups including customer-managed keys

**Guidance**: If you are managing your own keys for Azure Storage Accounts or any other resource related to your Azure Batch implementation, periodically test restoration of backed up keys.

* [How to backup key vault keys in Azure](https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey?view=azurermps-6.13.0)

* [How to restore a customer-managed key with PowerShell](https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultkey?view=azurermps-6.13.0)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.4: Ensure protection of backups and customer-managed keys

**Guidance**: If Azure Key Vault is being used to hold any keys related to Azure Batch Pool Storage Accounts, enable Soft-Delete in Azure Key Vault to protect keys against accidental or malicious deletion.

* [How to enable Soft Delete in Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-soft-delete-powershell)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Incident response

*For more information, see [Security control: Incident response](https://docs.microsoft.com/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create an incident response guide

**Guidance**: Ensure that there are written incident response plans that define roles of personnel as well as phases of incident handling/management.

* [How to configure Workflow Automations within Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-planning-and-operations-guide)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Security Center assigns a severity to alerts, to help you prioritize the order in which you attend to each alert, so that when a resource is compromised, you can get to it right away. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

* [Refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that the your data has been accessed by an unlawful or unauthorized party.

* [How to set the Azure Security Center Security Contact](https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts to Azure Sentinel.

* [How to configure continuous export](https://docs.microsoft.com/azure/security-center/continuous-export)

* [How to stream alerts into Azure Sentinel](https://docs.microsoft.com/azure/sentinel/connect-azure-security-center)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.

* [How to configure Workflow Automation and Logic Apps](https://docs.microsoft.com/azure/security-center/workflow-automation)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Penetration tests and red team exercises

*For more information, see [Security control: Penetration tests and red team exercises](https://docs.microsoft.com/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

**Guidance**: * [Please follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1.)

* [You can find more information on Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft managed cloud infrastructure, services and applications, here](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Next steps

- See the [Azure security benchmark](https://docs.microsoft.com/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview)
