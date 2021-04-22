---
title: Azure security baseline for Azure Machine Learning
description: The Azure Machine Learning security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: machine-learning
ms.topic: conceptual
ms.date: 03/16/2021
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Machine Learning

This security
baseline applies guidance from the [Azure Security Benchmark version
1.0](../security/benchmarks/overview-v1.md) to Microsoft Azure Machine Learning. The Azure Security Benchmark
provides recommendations on how you can secure your cloud solutions on Azure.
The content is grouped by the **security controls** defined by the Azure
Security Benchmark and the related guidance applicable to Azure Machine Learning. **Controls** not applicable to Azure Machine Learning have been excluded.

 
To see how Azure Machine Learning completely maps to the Azure
Security Benchmark, see the [full Azure Machine Learning security baseline mapping
file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](../security/benchmarks/security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

**Guidance**: Azure Machine Learning relies on other Azure services for compute resources. Compute resources (compute targets) are used to train and deploy models. You can create these compute targets in a virtual network. For example, you can use Azure Virtual Machine Learning compute instance to train a model and then deploy the model to Azure Kubernetes Service (AKS). You can secure your machine learning lifecycles by isolating Azure Machine Learning training and inference jobs within an Azure virtual network.

Azure Firewall can be used to control access to your Azure Machine Learning workspace and the public internet.

- [Virtual network isolation and privacy overview](how-to-network-security-overview.md)

- [Use workspace behind Azure Firewall for Azure Machine Learning](how-to-access-azureml-behind-firewall.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and NICs

**Guidance**: Azure Machine Learning relies on other Azure services for compute resources. Assign network security groups to the networks that are created as your Machine Learning deployment. 

Enable network security group flow logs and send the logs to an Azure Storage account for auditing. You can also send the flow logs to a Log Analytics workspace and then use Traffic Analytics to provide insights into traffic patterns in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity, identify hot spots and security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

- [How to enable network security group flow logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to enable and use Traffic Analytics](../network-watcher/traffic-analytics.md)

- [Understand network security provided by Azure Security Center](../security-center/security-center-network-recommendations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.3: Protect critical web applications

**Guidance**: You can enable HTTPS to secure communication with web services deployed by Azure Machine Learning. Web services are deployed on Azure Kubernetes Services (AKS) or Azure Container Instances (ACI) and secure the data submitted by clients. You can also use private IP with AKS to restrict scoring, so that only clients behind a virtual network can access the web service.

- [Use TLS to secure a web service through Azure Machine Learning](how-to-secure-web-service.md)

- [Virtual network isolation and privacy overview](how-to-network-security-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.4: Deny communications with known malicious IP addresses

**Guidance**: Enable DDoS Protection Standard on the virtual networks associated with your Machine Learning instance to guard against distributed denial-of-service (DDoS) attacks. Use Azure Security Center Integrated threat detection to detect communications with known malicious or unused Internet IP addresses.

Deploy Azure Firewall at each of the organization's network boundaries with threat intelligence-based filtering enabled and configured to "Alert and deny" for malicious network traffic.

- [How to configure DDoS protection](../ddos-protection/manage-ddos-protection.md)

- [Use workspace behind Azure Firewall for Azure Machine Learning](how-to-access-azureml-behind-firewall.md)

- [For more information about the Azure Security Center threat detection](../security-center/azure-defender.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.5: Record network packets

**Guidance**: For any VMs with the proper extension installed in your Azure Machine Learning services, you can enable Network Watcher packet capture to investigate anomalous activities. 

- [How to create a Network Watcher instance](../network-watcher/network-watcher-create.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Deploy the firewall solution of your choice at each of your organization's network boundaries to detect and/or block malicious traffic.

Select an offer from Azure Marketplace that supports IDS/IPS functionality with payload inspection capabilities.  When payload inspection is not a requirement, Azure Firewall threat intelligence can be used. Azure Firewall threat intelligence-based filtering is used to alert on and/or block traffic to and from known malicious IP addresses and domains. The IP addresses and domains are sourced from the Microsoft Threat Intelligence feed.

- [How to deploy Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md)

- [How to configure alerts with Azure Firewall](../firewall/threat-intel.md)

- [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/?term=Firewall)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.7: Manage traffic to web applications

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Responsibility**: Not Applicable

**Azure Security Center monitoring**: None

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: For resources that need access to your Azure Machine Learning account, use Virtual Network service tags to define network access controls on network security groups or Azure Firewall. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (for example, AzureMachineLearning) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

Azure Machine Learning service documents a list of service tags for its compute targets within a virtual network that helps to minimize complexity, you can use it as guidelines in your network management.

- [For more information about using service tags](../virtual-network/service-tags-overview.md)

- [Virtual network isolation and privacy overview](how-to-network-security-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement standard security configurations for network resources associated with your Azure Machine Learning namespaces with Azure Policy. Use Azure Policy aliases in the "Microsoft.MachineLearning" and "Microsoft.Network" namespaces to create custom policies to audit or enforce the network configuration of your Machine Learning namespaces. 

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.10: Document traffic configuration rules

**Guidance**: Use tags for network resources associated with your Azure Machine Learning deployment in order to logically organize them according to a taxonomy.

For a resource in your Azure Machine Learning virtual network that support the Description field, use it to document the rules that allow traffic to/from a network.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network resources related to Azure Machine Learning. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place.

- [How to view and retrieve Azure Activity Log events](/azure/azure-monitor/platform/activity-log#view-the-activity-log)

- [How to create alerts in Azure Monitor](/azure/azure-monitor/platform/alerts-activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Logging and Monitoring

*For more information, see the [Azure Security Benchmark: Logging and Monitoring](../security/benchmarks/security-control-logging-monitoring.md).*

### 2.2: Configure central security log management

**Guidance**: Ingest
logs via Azure Monitor to aggregate security data generated by Azure Machine
Learning. In Azure Monitor, use Log Analytics workspaces to query and perform
analytics, and use Azure Storage accounts for long term and archival storage. Alternatively, you may enable, and on-board data to Azure Sentinel or a third-party Security Incident and Event Management (SIEM).

- [How to configure diagnostic logs for Azure Machine Learning](https://docs.microsoft.com/azure/machine-learning/monitor-azure-machine-learning#configuration)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.3: Enable audit logging for Azure resources

**Guidance**: Enable diagnostic settings on Azure resources for access to audit, security, and diagnostic logs. Activity logs, which are automatically available, include event source, date, user, timestamp, source addresses, destination addresses, and other useful elements.

You can also correlate Machine Learning service operation logs for security and compliance purposes.

- [How to collect platform logs and metrics with Azure Monitor](/azure/azure-monitor/platform/diagnostic-settings)

- [Understand logging and different log types in Azure](/azure/azure-monitor/platform/platform-logs-overview)

- [Enable logging in Azure Machine Learning](how-to-log-view-metrics.md)

- [Monitoring Azure Machine Learning](monitor-azure-machine-learning.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.4: Collect security logs from operating systems

**Guidance**: If the compute resource is owned by Microsoft, then Microsoft is responsible for collecting and monitoring it. 

Azure Machine Learning has varying support across different compute resources and even your own compute resources. For any compute resources that are owned by your organization, use Azure Security Center to monitor the operating system. 

- [How to collect Azure Virtual Machine internal host logs with Azure Monitor](/azure/azure-monitor/learn/quick-collect-azurevm)

- [Understand Azure Security Center data collection](../security-center/security-center-enable-data-collection.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 2.5: Configure security log storage retention

**Guidance**: In Azure Monitor, set the log retention period for Log Analytics workspaces associated with your Azure Machine Learning instances according to your organization's compliance regulations.

- [How to set log retention parameters](/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.6: Monitor and review Logs

**Guidance**: Analyze and monitor logs for anomalous behavior and regularly review the results from your Azure Machine Learning. Use Azure Monitor and a Log Analytics workspace to review logs and perform queries on log data.

Alternatively, you can enable and on-board data to Azure Sentinel or a third-party SIEM. 

- [How to perform queries for Azure Machine Learning in Log Analytics Workspaces](https://docs.microsoft.com/azure/machine-learning/monitor-azure-machine-learning#analyzing-log-data)

- [Enable logging in Azure Machine Learning](how-to-log-view-metrics.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

- [Getting started with Log Analytics queries](../azure-monitor/logs/log-analytics-tutorial.md)

- [How to perform custom queries in Azure Monitor](/azure/azure-monitor/log-query/get-started-queries)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.7: Enable alerts for anomalous activities

**Guidance**: In Azure Monitor, configure logs related to Azure Machine Learning within the Activity Log, and Machine Learning diagnostic settings to send logs into a Log Analytics workspace to be queried or into a storage account for long-term archival storage. Use Log Analytics workspace to create alerts for anomalous activity found in security logs and events.

Alternatively, you may enable and on-board data to Azure Sentinel.

- [For more information on Azure Machine Learning alerts](https://docs.microsoft.com/azure/machine-learning/monitor-azure-machine-learning#alerts)

- [How to alert on Log Analytics workspace log data](/azure/azure-monitor/learn/tutorial-response)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.8: Centralize anti-malware logging

**Guidance**: If the compute resource is owned by Microsoft, then Microsoft is responsible for Antimalware deployment of Azure Machine Learning service.

Azure Machine Learning has varying support across different compute resources and even your own compute resources. For compute resources that are owned by your organization, enable antimalware event collection for Microsoft Antimalware for Azure Cloud Services and Virtual Machines.

- [How to configure the Microsoft Antimalware extension for cloud services](/powershell/module/servicemanagement/azure.service/set-azurevmmicrosoftantimalwareextension)

- [Understand Microsoft Antimalware](../security/fundamentals/antimalware.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 2.9: Enable DNS query logging

**Guidance**: Not applicable; Azure Machine Learning does not process or produce DNS-related logs.

**Responsibility**: Not Applicable

**Azure Security Center monitoring**: None

### 2.10: Enable command-line audit logging

**Guidance**: Azure Machine Learning has varying support across different compute resources and even your own compute resources. For compute resources are owned by your organization, use Azure Security Center to enable security event log monitoring for Azure virtual machines. Azure Security Center provisions the Log Analytics agent on all supported Azure VMs, and any new ones that are created if automatic provisioning is enabled. Or you can install the agent manually. The agent enables the process creation event 4688 and the commandline field inside event 4688. New processes created on the VM are recorded by event log and monitored by Security Center's detection services.

- [Data collection in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-enable-data-collection#data-collection-tier)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: You can use the Identity and Access Management tab for a resource in the Azure portal to configure Azure role-based access control (Azure RBAC) and maintain inventory on Azure Machine Learning resources. The roles are applied to users, groups, service principals, and managed identities in Active Directory. You can use built-in roles or custom roles for individuals and groups.

Azure Machine Learning provides built-in roles for common management scenarios in Azure Machine Learning. An individual who has a profile in Azure Active Directory (Azure AD) can assign these roles to users, groups, service principals, or managed identities to grant or deny access to resources and operations on Azure Machine Learning resources.

You can also use the Azure AD PowerShell module to perform adhoc queries to discover accounts that are members of administrative groups.

- [Understand Azure role-based access control in Azure Machine Learning](how-to-assign-roles.md)

- [How to get a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrole)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.2: Change default passwords where applicable

**Guidance**: Access management to Machine Learning resources is controlled through Azure Active Directory (Azure AD). Azure AD does not have the concept of default passwords.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.3: Use dedicated administrative accounts

**Guidance**: Azure Machine Learning comes with three default roles when a new workspace is created, creating standard operating procedures around the use of owner accounts.

You can also enable a just-in-time access to administrative accounts by using Azure Active Directory (Azure AD) Privileged Identity Management and Azure Resource Manager.

- [To learn more Machine Learning default roles](https://docs.microsoft.com/azure/machine-learning/how-to-assign-roles#default-roles)

- [Learn more about Privileged Identity Management](/azure/active-directory/privileged-identity-management/index)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.4: Use single sign-on (SSO) with Azure Active Directory

**Guidance**: Machine Learning is integrated with Azure Active Directory (Azure AD), use Azure AD SSO instead of configuring individual stand-alone credentials per-service. Use Azure Security Center identity and access recommendations.

- [Understand SSO with Azure AD](../active-directory/manage-apps/what-is-single-sign-on.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

**Guidance**: Enable Azure Active Directory (Azure AD) multifactor authentication and follow Azure Security Center identity and access recommendations.

- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

- [How to monitor identity and access within Azure Security Center](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

**Guidance**: Use a secure, Azure-managed workstation (also known as a Privileged Access Workstation, or PAW) for administrative tasks that require elevated privileges.

- [Understand secure, Azure-managed workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/)

- [How to enable Azure Active Directory (Azure AD) multifactor authentication](../active-directory/authentication/howto-mfa-getstarted.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.7: Log and alert on suspicious activities from administrative accounts

**Guidance**: Use Azure Active Directory (Azure AD) security reports and monitoring to detect when suspicious or unsafe activity occurs in the environment. Use Azure Security Center to monitor identity and access activity.

- [How to identify Azure AD users flagged for risky activity](../active-directory/identity-protection/overview-identity-protection.md)

- [How to monitor users' identity and access activity in Azure Security Center](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.8: Manage Azure resources only from approved locations

**Guidance**: Use Azure Active Directory (Azure AD) named locations to allow access only from specific logical groupings of IP address ranges or countries/regions.

- [How to configure Azure AD named locations](../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.
 
Role access can be scoped to multiple levels in Azure. For Machine Learning, roles can be managed at workspace level, for example, you have owner access to a workspace may not have owner access to the resource group that contains the workspace. This provides more granular access controls to separate roles within the same resource group. 

- [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md) 
 
- [How to create and configure an Azure AD instance](../active-directory/fundamentals/active-directory-access-create-new-tenant.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.10: Regularly review and reconcile user access

**Guidance**: Azure Active Directory (Azure AD) provides logs to help discover stale accounts. In addition, use Azure AD identity and access reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access can be reviewed on a regular basis to make sure only the right users have continued access.

Use Azure AD Privileged Identity Management (PIM) for generation of logs and alerts when suspicious or unsafe activity occurs in the environment.

- [Understand Azure AD reporting](/azure/active-directory/reports-monitoring)

- [How to use Azure AD identity and access reviews](../active-directory/governance/access-reviews-overview.md)

- [Deploy Azure AD Privileged Identity Management (PIM)](../active-directory/privileged-identity-management/pim-deployment-plan.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.11: Monitor attempts to access deactivated credentials

**Guidance**: You have access to Azure Active Directory (Azure AD) sign-in activity, audit, and risk event log sources, which allow you to integrate with any SIEM/monitoring tool.

You can streamline this process by creating diagnostic settings for Azure AD user accounts and sending the audit logs and sign-in logs to a Log Analytics workspace. You can configure desired alerts within Log Analytics workspace.

- [How to integrate Azure activity logs with Azure Monitor](/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.12: Alert on account login behavior deviation

**Guidance**: Use Azure Active Directory (Azure AD) Identity Protection features to configure automated responses to detected suspicious actions related to user identities. You can also ingest data into Azure Sentinel for further investigation.

- [How to view Azure AD risky sign-ins](../active-directory/identity-protection/overview-identity-protection.md)

- [How to configure and enable Identity Protection risk policies](../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

**Guidance**: Not applicable; Azure Machine Learning service doesn’t support customer lockbox.

**Responsibility**: Not Applicable

**Azure Security Center monitoring**: None

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](../security/benchmarks/security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags to assist in tracking Azure resources that store or process sensitive information.
 
- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Implement isolation using separate subscriptions and management groups for individual security domains such as environment type and data sensitivity level. You can restrict the level of access to your Azure resources that your applications and enterprise environments demand. You can control access to Azure resources via Azure RBAC.
 
- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create management groups](../governance/management-groups/create-management-group-portal.md)

 
- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: Use a third-party solution from Azure Marketplace in network perimeters to monitor for unauthorized transfer of sensitive information and block such transfers while alerting information security professionals. 

For the underlying platform, which is managed by Microsoft, Microsoft treats all customer content as sensitive and guards against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities. 

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.4: Encrypt all sensitive information in transit

**Guidance**: Web services deployed through Azure Machine Learning only support TLS version 1.2 that enforces data encryption in transit.

- [Use TLS to secure a web service through Azure Machine Learning](how-to-secure-web-service.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Data identification, classification, and loss prevention features are not yet available for Azure Machine Learning. Implement a third-party solution if necessary for compliance purposes.

For the underlying platform, which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.6: Use Azure RBAC to manage access to resources

**Guidance**: Azure Machine Learning supports using Azure Active Directory (Azure AD) to authorize requests to Machine Learning resources. With Azure AD, you can use Azure role-based access control (Azure RBAC) to grant permissions to a security principal, which may be a user, or an application service principal.

- [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md)

- [Use Azure RBAC for Kubernetes authorization](../aks/manage-azure-rbac.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.8: Encrypt sensitive information at rest

**Guidance**: Azure Machine Learning stores snapshots, output, and logs in the Azure Blob storage account that's tied to the Azure Machine Learning workspace and your subscription. All the data stored in Azure Blob storage is encrypted at rest with Microsoft-managed keys. You can also encrypt data stored in Azure Blob storage with your own keys in Machine Learning service. 

- [Azure Machine Learning data encryption at rest](https://docs.microsoft.com/azure/machine-learning/concept-enterprise-security#encryption-at-rest)

- [Understand encryption at rest in Azure](../security/fundamentals/encryption-atrest.md)

- [How to configure customer-managed encryption keys](../storage/common/customer-managed-keys-configure-key-vault.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with the Azure Activity log to create alerts for when changes take place to production instances of Azure Machine Learning and other critical or related resources.

- [How to create alerts for Azure Activity Log events](/azure/azure-monitor/platform/alerts-activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Vulnerability Management

*For more information, see the [Azure Security Benchmark: Vulnerability Management](../security/benchmarks/security-control-vulnerability-management.md).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: If the compute resource is owned by Microsoft, then Microsoft is responsible for vulnerability management of Azure Machine Learning service. 

Azure Machine Learning has varying support across different compute resources and even your own compute resources. For compute resources that are owned by your organization, follow the recommendations from Azure Security Center for performing vulnerability assessments on your Azure virtual machines, container images, and SQL servers.

- [How to implement Azure Security Center vulnerability assessment recommendations](../security-center/deploy-vulnerability-assessment-vm.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 5.2: Deploy automated operating system patch management solution

**Guidance**: If the compute resource is owned by Microsoft, then Microsoft is responsible for patch management of Azure Machine Learning service. 

Azure Machine Learning has varying support across different compute resources and even your own compute resources. For any compute resources that are owned by your organization, use Azure Automation Update Management to ensure that the most recent security updates are installed on your Windows and Linux VMs. For Windows VMs, ensure Windows Update has been enabled and set to update automatically.

- [How to configure Update Management for virtual machines in Azure](../automation/update-management/overview.md)

- [Understand Azure security policies monitored by Security Center](../security-center/policy-reference.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 5.3: Deploy an automated patch management solution for third-party software titles

**Guidance**: Azure Machine Learning has varying support across different compute resources and even your own compute resources. For compute resources that are owned by your organization, use a third-party patch management solution. Customers already using Configuration Manager in their environment can also use System Center Updates Publisher, allowing them to publish custom updates into Windows Server Update Service. This allows Update Management to patch machines that use Configuration Manager as their update repository with third-party software.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.4: Compare back-to-back vulnerability scans

**Guidance**: Azure Machine Learning has varying support across different compute resources and even your own compute resources. For compute resources that are owned by your organization, follow recommendations from Azure Security Center for performing vulnerability assessments on your Azure virtual machines, container images, and SQL servers. Export scan results at consistent intervals and compare the results with previous scans to verify that vulnerabilities have been remediated. When using vulnerability management recommendations suggested by Azure Security Center, you can pivot into the selected solution's portal to view historical scan data.

- [How to implement Azure Security Center vulnerability assessment recommendations](../security-center/deploy-vulnerability-assessment-vm.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Responsibility**: Not Applicable

**Azure Security Center monitoring**: None

## Inventory and Asset Management

*For more information, see the [Azure Security Benchmark: Inventory and Asset Management](../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

**Guidance**: Use Azure Resource Graph to query for and discover resources (such as compute, storage, network, ports, and protocols etc.) in your subscriptions. Ensure appropriate (read) permissions in your tenant and enumerate all Azure subscriptions as well as resources in your subscriptions.

Although classic Azure resources can be discovered via Azure Resource Graph Explorer, it is highly recommended to create and use Azure Resource Manager resources going forward.

- [How to create queries with Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md)

- [How to view your Azure subscriptions](/powershell/module/az.accounts/get-azsubscription)

- [Understand Azure RBAC](../role-based-access-control/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources, adding metadata to logically organize according into a taxonomy.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions where appropriate, to organize and track assets. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

- [ How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [ How to create management groups](../governance/management-groups/create-management-group-portal.md)
 
- [ How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.4: Define and maintain an inventory of approved Azure resources

**Guidance**: Create an inventory of approved Azure resources and approved software for compute resources as per your organizational needs.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:

* Not allowed resource types
* Allowed resource types

In addition, use the Azure Resource Graph to query/discover resources within the subscriptions.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to create queries with Azure Graph](../governance/resource-graph/first-query-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.6: Monitor for unapproved software applications within compute resources

**Guidance**: Azure Machine Learning has varying support across different compute resources and even your own compute resources. For compute resources that are owned by your organization, use Azure Automation Change Tracking and Inventory to automate the collection of inventory information from your Windows and Linux VMs. Software name, version, publisher, and refresh time are available from the Azure portal. To get the software installation date and other information, enable guest-level diagnostics and direct the Windows Event Logs to Log Analytics workspace.

- [How to enable Azure Automation inventory collection for a VM](../automation/automation-tutorial-installed-software.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 6.7: Remove unapproved Azure resources and software applications

**Guidance**: Azure Machine Learning has varying support across different compute resources and even your own compute resources. For compute resources that are owned by your organization, use Azure Security Center's File Integrity Monitoring (FIM) to identify all software installed on VMs. Another option that can be used instead of or in conjunction with FIM is Azure Automation Change Tracking and Inventory to collect inventory from your Linux and Windows VMs. 

You can implement your own process for removing unauthorized software. You can also use a third-party solution to identify unapproved software.

Remove Azure resources when they are no longer needed.

- [How to use File Integrity Monitoring](../security-center/security-center-file-integrity-monitoring.md)

- [Understand Azure Automation Change Tracking and Inventory](../automation/change-tracking/overview.md)

- [How to enable Azure virtual machine inventory](../automation/automation-tutorial-installed-software.md)

- [Azure resource group and resource deletion](../azure-resource-manager/management/delete-resource-group.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 6.8: Use only approved applications

**Guidance**: Azure Machine Learning has varying support across different compute resources and even your own compute resources. For compute resources that are owned by your organization, use Azure Security Center adaptive application controls to ensure that only authorized software executes and all unauthorized software is blocked from executing on Azure Virtual Machines.

- [How to use Azure Security Center adaptive application controls](../security-center/security-center-adaptive-application.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 6.9: Use only approved Azure services

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:

* Not allowed resource types
* Allowed resource types

In addition, use the Azure Resource Graph to query for and discover resources in the subscriptions.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to create queries with Azure Resource Graph](../governance/resource-graph/first-query-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.10: Maintain an inventory of approved software titles

**Guidance**: Azure Machine Learning has varying support across different compute resources and even your own compute resources. For any compute resources that are owned by your organization, use Azure Security Center adaptive application controls to specify which file types a rule may or may not apply to.

Implement a third-party solution if adaptive application controls don't meet the requirement.

- [How to use Azure Security Center adaptive application controls](../security-center/security-center-adaptive-application.md)

**Responsibility**: Not Applicable

**Azure Security Center monitoring**: None

### 6.11: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Use Azure Active Directory (Azure AD) Conditional Access to limit users' ability to interact with Azure Resources Manager by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resources Manager](../role-based-access-control/conditional-access-azure-management.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.12: Limit users' ability to execute scripts in compute resources

**Guidance**: Azure Machine Learning has varying support across different compute resources and even your own compute resources. For compute resources that are owned by your organization, depending on the type of scripts, you can use operating system-specific configurations or third-party resources to limit users' ability to execute scripts in Azure compute resources. You can also use Azure Security Center adaptive application controls to ensure that only authorized software executes and all unauthorized software is blocked from executing on Azure Virtual Machines.

- [How to control PowerShell script execution in Windows environments](/powershell/module/microsoft.powershell.security/set-executionpolicy)

- [How to use Azure Security Center adaptive application controls](../security-center/security-center-adaptive-application.md)

**Responsibility**: Not Applicable

**Azure Security Center monitoring**: None

### 6.13: Physically or logically segregate high risk applications

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Responsibility**: Not Applicable

**Azure Security Center monitoring**: None

## Secure Configuration

*For more information, see the [Azure Security Benchmark: Secure Configuration](../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Define and implement standard security configurations for your Azure Machine Learning service with Azure Policy. Use Azure Policy aliases in the "Microsoft.MachineLearning" namespace to create custom policies to audit or enforce the configuration of your Azure Machine Learning services.

Azure Resource Manager has the ability to export the template in JavaScript Object Notation (JSON), which should be reviewed to ensure that the configurations meet the security requirements for your organization.

You can also use the recommendations from Azure Security Center as a secure configuration baseline for your Azure resources.

Azure Machine Learning fully supports Git repositories for tracking work; you can clone repositories directly onto your shared workspace file system, use Git on your local workstation, and make sure secure configurations apply to code resources as part of your Machine Learning environment.

- [How to view available Azure Policy aliases](/powershell/module/az.resources/get-azpolicyalias)

- [Tutorial: Create and manage policies to enforce compliance](../governance/policy/tutorials/create-and-manage.md)

- [Single and multi-resource export to a template in Azure portal](../azure-resource-manager/templates/export-template-portal.md)

- [Security recommendations - a reference guide](../security-center/recommendations-reference.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.2: Establish secure operating system configurations

**Guidance**: If the compute resource is owned by Microsoft, then Microsoft is responsible for operating system secure configurations of Azure Machine Learning service.

Azure Machine Learning has varying support across different compute resources and even your own compute resources. For compute resources that are owned by your organization, use Azure Security Center recommendations to maintain security configurations on all compute resources.  Additionally, you can use custom operating system images or Azure Automation State configuration to establish the security configuration of the operating system required by your organization.

- [How to monitor Azure Security Center recommendations](../security-center/security-center-recommendations.md)

- [Security recommendations - a reference guide](../security-center/recommendations-reference.md)

- [Azure Automation State Configuration Overview](../automation/automation-dsc-overview.md)

- [Upload a VHD and use it to create new Windows VMs in Azure](../virtual-machines/windows/upload-generalized-managed.md)

- [Create a Linux VM from a custom disk with the Azure CLI](../virtual-machines/linux/upload-vhd.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources. In addition, you can use Azure Resource Manager templates to maintain the security configuration of your Azure resources required by your organization. 
 
- [Understand Azure Policy effects](../governance/policy/concepts/effects.md)
 
- [Create and manage policies to enforce compliance](../governance/policy/tutorials/create-and-manage.md)
 
- [ Azure Resource Manager templates overview](../azure-resource-manager/templates/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.4: Maintain secure operating system configurations

**Guidance**: If the compute resource is owned by Microsoft, then Microsoft is responsible for operating system secure configurations of Azure Machine Learning service.

Azure Machine Learning has varying support across different compute resources and even your own compute resources. For compute resources that are owned by your organization, follow recommendations from Azure Security Center on performing vulnerability assessments on your Azure compute resources.  In addition, you may use Azure Resource Manager templates, custom operating system images, or Azure Automation State Configuration to maintain the security configuration of the operating system required by your organization.   The Microsoft virtual machine templates combined with the Azure Automation State Configuration may assist in meeting and maintaining the security requirements. 

Note that Azure Marketplace virtual machine Images published by Microsoft are managed and maintained by Microsoft. 

- [How to implement Azure Security Center vulnerability assessment recommendations](../security-center/deploy-vulnerability-assessment-vm.md)

- [How to create an Azure Virtual Machine from an ARM template](../virtual-machines/windows/ps-template.md)

- [Azure Automation State Configuration Overview](../automation/automation-dsc-overview.md)

- [Create a Windows virtual machine in the Azure portal](../virtual-machines/windows/quick-create-portal.md)

- [Information on how to download the VM template](/previous-versions/azure/virtual-machines/windows/download-template)

- [Sample script to upload a VHD to Azure and create a new VM](/previous-versions/azure/virtual-machines/scripts/virtual-machines-windows-powershell-upload-generalized-script)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 7.5: Securely store configuration of Azure resources

**Guidance**: If using custom Azure Policy definitions for your Machine Learning or related resources, use Azure Repos to securely store and manage your code.

Azure Machine Learning fully supports Git repositories for tracking work; you can clone repositories directly onto your shared workspace file system, use Git on your local workstation, and make sure secure configurations apply to code resources as part of your Machine Learning environment.

- [How to store code in Azure DevOps](/azure/devops/repos/git/gitworkflow)

- [Azure Repos documentation](/azure/devops/repos/)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.6: Securely store custom operating system images

**Guidance**: Azure Machine Learning has varying support across different compute resources and even your own compute resources. For compute resources that are owned by your organization, use Azure role-based access control (Azure RBAC) to ensure that only authorized users can access your custom images. Use an Azure Shared Image Gallery you can share your images to different users, service principals, or Azure Active Directory (Azure AD) groups within your organization. Store container images in Azure Container Registry and use Azure RBAC to ensure that only authorized users have access.

- [Understand Azure RBAC](../role-based-access-control/rbac-and-directory-admin-roles.md)

- [Understand Azure RBAC for Container Registry](../container-registry/container-registry-roles.md)

- [How to configure Azure RBAC](../role-based-access-control/quickstart-assign-role-user-portal.md)

- [Shared Image Gallery overview](../virtual-machines/shared-image-galleries.md)

- [Use Azure RBAC for Kubernetes authorization](../aks/manage-azure-rbac.md)

**Responsibility**: Not Applicable

**Azure Security Center monitoring**: None

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Use Azure Policy aliases in the "Microsoft.MachineLearning" namespace to create custom policies to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to use aliases](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#aliases)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.8: Deploy configuration management tools for operating systems

**Guidance**: If the compute resource is owned by Microsoft, then Microsoft is responsible for secure configuration deployment of Azure Machine Learning service.

Azure Machine Learning has varying support across different compute resources and even your own compute resources. For compute resources that are owned by your organization, use Azure Automation State Configuration for Desired State Configuration (DSC) nodes in any cloud or on-premises datacenter. You can easily onboard machines, assign them declarative configurations, and view reports showing each machine's compliance with the desired state you specified. 

- [How to enable Azure Automation State Configuration](../automation/automation-dsc-onboarding.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Use Azure Security Center to perform baseline scans for your Azure Resources. Additionally, use Azure Policy to alert and audit Azure resource configurations.
 
 
 
- [ How to remediate recommendations in Azure Security Center](../security-center/security-center-remediate-recommendations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.10: Implement automated configuration monitoring for operating systems

**Guidance**: If the compute resource is owned by Microsoft, then Microsoft is responsible for automated secure configuration monitoring of Azure Machine Learning service.

Azure Machine Learning has varying support across different compute resources and even your own compute resources. For compute resources that are owned by your organization, use Azure Security Center Compute &amp; Apps and follow the recommendations for VMs and servers, and containers.

- [Understand Azure Security Center container recommendations](../security-center/container-security.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 7.11: Manage Azure secrets securely

**Guidance**: Use managed identities in conjunction with Azure Key Vault to simplify secret management for your cloud applications.

Azure Machine Learning supports data store encryption with customer-managed keys, you need to manage key rotate and revoke per organization security and compliance requirements. 

Use Azure Key Vault to pass secrets to remote runs securely instead of cleartext in your training scripts.

- [Azure Machine Learning customer-managed keys](https://docs.microsoft.com/azure/machine-learning/concept-enterprise-security#azure-blob-storage)

- [Use authentication credential secrets in Azure Machine Learning training runs](how-to-use-secrets-in-runs.md)

- [How to use managed identities for Azure resources](../azure-app-configuration/howto-integrate-azure-managed-service-identity.md)

- [How to create a Key Vault](../key-vault/general/quick-create-portal.md)

- [How to authenticate to Key Vault](../key-vault/general/authentication.md)

- [How to assign a Key Vault access policy](../key-vault/general/assign-access-policy-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.12: Manage identities securely and automatically

**Guidance**: Azure Machine Learning supports both built-in roles and the ability to create custom roles. Use managed identities to provide Azure services with an automatically managed identity in Azure Active Directory (Azure AD). Managed identities allow you to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code.

- [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md)

- [How to configure managed identities for Azure resources](../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.13: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault. 

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Malware Defense

*For more information, see the [Azure Security Benchmark: Malware Defense](../security/benchmarks/security-control-malware-defense.md).*

### 8.1: Use centrally managed antimalware software

**Guidance**: Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure Machine Learning), however, it does not run on customer content.

Azure Machine Learning has varying support across different compute resources
and even your own compute resources. For compute resources that are owned by
your organization, use Microsoft Antimalware for Azure to continuously monitor
and defend your resources. For Linux, use third-party antimalware solution. Also,
use Azure Security Center's threat detection for data services to detect malware
uploaded to storage accounts.

- [How to configure Microsoft Antimalware for Azure](../security/fundamentals/antimalware.md)

- [Threat protection in Azure Security Center](../security-center/azure-defender.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Microsoft Anti-malware is enabled on the underlying host that supports Azure services (for example, Azure Machine Learning), however it does not run on customer content.

It is your responsibility to pre-scan any content being uploaded to non-compute Azure resources. Microsoft cannot access customer data, and therefore cannot conduct anti-malware scans of customer content on your behalf.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 8.3: Ensure antimalware software and signatures are updated

**Guidance**: Microsoft anti-malware is enabled and maintained for the underlying host that supports Azure services (for example, Azure Machine learning), however, it does not run on customer content.

Azure Machine Learning has varying support across different compute resources and even your own compute resources. For any compute resources that are owned by your organization, follow recommendations in Azure Security Center, Compute &amp; Apps to ensure all endpoints are up to date with the latest signatures. For Linux, use third-party antimalware solution.

- [How to deploy Microsoft Antimalware for Azure](../security/fundamentals/antimalware.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Data Recovery

*For more information, see the [Azure Security Benchmark: Data Recovery](../security/benchmarks/security-control-data-recovery.md).*

### 9.1: Ensure regular automated back ups

**Guidance**: Data recovery management in Machine Learning service is through data managements on connected data stores. Ensure to follow up data recovery guidelines for connected stores to back up data per customer organization policies.

- [How to recover files from Azure Virtual Machine backup](../backup/backup-azure-restore-files-from-vm.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.2: Perform complete system backups and backup any customer-managed keys

**Guidance**: Data backup in Machine Learning service is through data managements on connected data stores. Enable Azure Backup for VMs and configure the desired frequency and retention periods. Back up customer-managed keys in Azure Key Vault.

- [How to recover files from Azure Virtual Machine backup](../backup/backup-azure-restore-files-from-vm.md)

- [How to restore Key Vault keys in Azure](/powershell/module/az.keyvault/restore-azkeyvaultkey)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.3: Validate all backups including customer-managed keys

**Guidance**: Data backup validation in Machine Learning service is
through data managements on connected data stores. Periodically perform data
restoration of content in Azure Backup. Ensure that you can restore backed-up
customer-managed keys.

- [How to recover files from an Azure virtual machine backup](../backup/backup-azure-restore-files-from-vm.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.4: Ensure protection of backups and customer-managed keys

**Guidance**: For on-premises backup, encryption at rest is provided using the passphrase you provide when backing up to Azure. Use Azure role-based access control (Azure RBAC) to protect backups and customer-managed keys. 

Enable soft delete and purge protection in Key Vault to protect keys against accidental or malicious deletion. If Azure Storage is used to store backups, enable soft delete to save and recover your data when blobs or blob snapshots are deleted.

- [Understand Azure RBAC](../role-based-access-control/overview.md)

- [How to enable soft delete and purge protection in Key Vault](../storage/blobs/soft-delete-blob-overview.md)

- [Soft delete for Azure Blob storage](../storage/blobs/soft-delete-blob-overview.md)

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

**Guidance**: Azure Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytically used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, mark subscriptions using tags and create a naming system to identify and categorize Azure resources, especially those processing sensitive data. It's your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

- [Security alerts in Azure Security Center](../security-center/security-center-alerts-overview.md)

- [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems' incident response capabilities on a regular cadence to help protect your Azure resources. Identify weak points and gaps and then revise your response plan as needed.

- [NIST's publication--Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://csrc.nist.gov/publications/detail/sp/800-84/final)

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

- See the [Azure Security Benchmark V2 overview](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
