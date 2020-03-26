---
title: Azure Security Baseline for Data Explorer
description: Azure Security Baseline for Data Explorer
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 03/25/2020
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Azure Security Baseline for Data Explorer

The Azure Security Baseline for Data Explorer contains recommendations that will help you improve the security posture of your deployment.

The baseline for this service is drawn from the [Azure Security Benchmark version 1.0](https://docs.microsoft.com/azure/security/benchmarks/overview), which provides recommendations on how you can secure your cloud solutions on Azure with our best practices guidance.

For more information, see [Azure Security Baselines overview](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview).

## Network Security

*For more information, see [Security Control: Network Security](https://docs.microsoft.com/azure/security/benchmarks/security-control-network-security).*

### 1.1: Protect resources using Network Security Groups or Azure Firewall on your Virtual Network

**Guidance**: Azure Data Explorer supports deploying a cluster into a subnet in your virtual network. This capability enables you to enforce network security group (NSG) rules on your Azure Data Explorer cluster traffic, connect your on-premises network to Azure Data Explorer cluster's subnet, and Secure your data connection sources (Event Hub and Event Grid) with service endpoints.

How to deploy your Azure Data Explorer cluster into a virtual network:  https://docs.microsoft.com/azure/data-explorer/vnet-deployment


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.2: Monitor and log the configuration and traffic of Vnets, Subnets, and NICS

**Guidance**: Enable network security group (NSG) flow logs and send logs into a Storage Account for traffic audit.

How to Enable NSG Flow Logs:  https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal

Understanding Network Security provided by Azure Security Center:  https://docs.microsoft.com/azure/security-center/security-center-network-recommendations


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.3: Protect Critical Web Applications

**Guidance**: Not applicable; Recommendation is intended for web applications running on Azure App Service or compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not applicable

### 1.4: Deny Communications with Known Malicious IP Addresses

**Guidance**: Enable Azure DDoS Protection Standard on the virtual network protecting your Data Explorer clusters for protection against DDoS attacks. Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious or unused Internet IP addresses.

How to configure DDoS protection:  https://docs.microsoft.com/azure/virtual-network/manage-ddos-protection

Understand Azure Security Center Integrated Threat Intelligence:  https://docs.microsoft.com/azure/security-center/security-center-alerts-service-layer


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.5: Record Network Packets and Flow Logs

**Guidance**: Enable Flow Logs on the network security groups (NSG) being used to protect your Azure Data Explorer cluster, and send logs into a Storage Account for traffic audit.

How to Enable NSG Flow Logs:  https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.6: Deploy Network Based Intrusion Detection/Intrusion Prevention Systems

**Guidance**: Not applicable; This control is done at endpoint or firewall.


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not applicable

### 1.7: Manage traffic to your web applications

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not applicable

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: Use Virtual Network Service Tags to define network access controls on Network Security Groups or Azure Firewalls associated with your Azure Data Explorer clusters. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., ApiManagement) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

Understanding and using Service Tags:  https://docs.microsoft.com/azure/virtual-network/service-tags-overview

Service Tags configuration requirements for Azure Data Explorer:  https://docs.microsoft.com/azure/data-explorer/vnet-deployment#dependencies-for-vnet-deployment


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.9: Maintain Standard Security Configurations for Network Devices

**Guidance**: Customer to define and implement standard security configurations for network resources with Azure Policy.

Customer may also use Azure Blueprints to simplify large scale Azure deployments by packaging key environment artifacts, such as ARM templates, RBAC controls, and policies, in a single blueprint definition. Easily apply the blueprint to new subscriptions and environments, and fine-tune control and management through versioning.

How to configure and manage Azure Policy:  https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

How to create an Azure Blueprint:  https://docs.microsoft.com/azure/governance/blueprints/create-blueprint-portal


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 1.10: Document Traffic Configuration Rules

**Guidance**: Use tags for network security groups (NSG) and other resources related to network security and traffic flow for your Data Explorer clusters. For individual NSG rules, use the "Description" field to specify business need and/or duration (etc.) for any rules that allow traffic to/from a network.

How to create and use tags:  https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 1.11: Use Automated Tools to Monitor Network Resource Configurations and Detect Changes

**Guidance**: Use Azure Policy to validate (and/or remediate) configuration for network resources.

How to configure and manage Azure Policy:
https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Logging and Monitoring

*For more information, see [Security Control: Logging and Monitoring](https://docs.microsoft.com/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.1: Use Approved Time Synchronization Sources

**Guidance**: Microsoft maintains time sources for Azure resources, customers may update time synchronization for compute deployments owned by customer.

How to configure time synchronization for Azure compute resources:
https://docs.microsoft.com/azure/virtual-machines/windows/time-sync

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Microsoft

### 2.2: Configure Central Security Log Management

**Guidance**: Azure Data Explorer uses diagnostic logs for insights on ingestion successes and failures. You can export operation logs to Azure Storage, Event Hub, or Log Analytics to monitor ingestion status.

How to monitor Azure Data Explorer ingestion operations:

https://docs.microsoft.com/azure/data-explorer/using-diagnostic-logs

How to ingest and query monitoring data in Azure Data Explorer:

https://docs.microsoft.com/azure/data-explorer/ingest-data-no-code

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure Resources

**Guidance**: Enable Diagnostic Settings for Azure Data Explorer for access and logging to service specific operations and logging. Azure Activity logs within Azure Monitor, which includes high-level logging about the resource are enabled by default.

How to monitor Azure Data Explorer ingestion operations:  https://docs.microsoft.com/azure/data-explorer/using-diagnostic-logs

How to collect platform logs and metrics with Azure Monitor:  https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings

Overview of Azure platform logs:  https://docs.microsoft.com/azure/azure-monitor/platform/platform-logs-overview


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.4: Collect Security Logs from Operating System

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not applicable

### 2.5: Configure Security Log Storage Retention

**Guidance**: Within Azure Monitor, set your Log Analytics Workspace retention period according to your organization's compliance regulations. Use Azure Storage Accounts for long-term/archival storage.

How to set log retention parameters for Log Analytics Workspaces: https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.6: Monitor and Review Logs

**Guidance**: Analyze and monitor logs for anomalous behaviors and regularly review results. After enabling Diagnostic Settings for Azure Data Explorer, use Azure Monitor's Log Analytics Workspace to review logs and perform queries on log data.

Understanding Log Analytics Workspace:  https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-portal

How to perform custom queries in Azure Monitor:  https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-queries


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.7: Enable Alerts for Anomalous Activity

**Guidance**: Not applicable; Azure Data Explorer does not have this ability.


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not applicable

### 2.8: Centralize Anti-malware Logging

**Guidance**: Not applicable; Azure Data Explorer does not process anti-malware logging.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not applicable

### 2.9: Enable DNS Query Logging

**Guidance**: Not applicable: DNS query is not a function of Azure Data Explorer.


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not applicable

### 2.10: Enable Command-line Audit Logging

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not applicable

## Identity and Access Control

*For more information, see [Security Control: Identity and Access Control](https://docs.microsoft.com/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain Inventory of Administrative Accounts

**Guidance**: In Azure Data Explorer, Security roles define which security principals (users and applications) have permissions to operate on a secured resource such as a database or a table, and what operations are permitted.  You can leverage Kusto query to list  principles in the admin role for the Azure Data Explorer clusters and databases.
Security roles management in Azure Data Explorer using Kusto query:  https://docs.microsoft.com/azure/kusto/management/security-roles



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.2: Change Default Passwords where Applicable

**Guidance**: Azure AD does not have the concept of default passwords. Other Azure resources requiring a password forces a password to be created with complexity requirements and a minimum password length, which differs depending on the service. You are responsible for third party applications and marketplace services that may use default passwords.


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.3: Ensure the Use of Dedicated Administrative Accounts

**Guidance**: Customer to create standard operating procedures around the use of dedicated administrative accounts. Use Azure Security Center Identity and Access Management to monitor the number of administrative accounts.

Customers can also enable a Just-In-Time / Just-Enough-Access by using Azure AD Privileged Identity Management Privileged Roles for Microsoft Services, and Azure ARM. 

What is Azure AD Privileged Identity Management?: https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-configure

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.4: Utilize Single Sign-On (SSO) with Azure Active Directory

**Guidance**: Wherever possible, customer to use SSO with Azure Active Directory (Azure AD) rather than configuring individual stand-alone credentials per-service. Use Azure Security Center Identity and Access Management recommendations.

Understanding SSO with Azure AD:  https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.5: Use Multifactor Authentication for all Azure Active Directory based access.

**Guidance**: Enable Azure Active Directory (Azure AD) multi-factor authentication (MFA) and follow Azure Security Center Identity and Access Management recommendations.

How to enable MFA in Azure: https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted 

How to monitor identity and access within Azure Security Center:  https://docs.microsoft.com/azure/security-center/security-center-identity-access


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.6: Use of Dedicated Machines (Privileged Access Workstations) for all Administrative Tasks

**Guidance**: Use PAWs (privileged access workstations) with multi-factor authentication (MFA) configured to log into and configure Azure resources.

Learn about Privileged Access Workstations: https://docs.microsoft.com/windows-server/identity/securing-privileged-access/privileged-access-workstations

How to enable MFA in Azure:  https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 3.7: Log and Alert on Suspicious Activity on Administrative Accounts

**Guidance**: Use Azure Active Directory (Azure AD) security reports for generation of logs and alerts when suspicious or unsafe activity occurs in the environment. Use Azure Security Center to monitor identity and access activity

How to identify Azure AD users flagged for risky activity:  https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-user-at-risk

How to monitor users identity and access activity in Azure Security Center:  https://docs.microsoft.com/azure/security-center/security-center-identity-access


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.8: Manage Azure Resource from only Approved Locations

**Guidance**: Customer to use Conditional Access named locations to allow access from only specific logical groupings of IP address ranges or countries/regions.

How to configure named locations in Azure:
https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.9: Utilize Azure Active Directory

**Guidance**: Azure Active Directory (Azure AD) is the preferred method for authenticating to Azure Data Explorer. It supports a number of authentication scenarios:

User authentication (interactive logon): Used to authenticate human principals.

Application authentication (non-interactive logon): Used to authenticate services and applications that have to run/authenticate with no human user being present.

Azure Data Explorer Access Control Overview:https://docs.microsoft.com/azure/kusto/management/access-control

Authenticating with Azure Active Directory:  https://docs.microsoft.com/azure/kusto/management/access-control/aad



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.10: Regularly Review and Reconcile User Access

**Guidance**: Azure Active Directory (Azure AD) provides logs to help discover stale accounts. In addition, use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User's access can be reviewed on a regular basis to make sure only the right Users have continued access. 

How-To Authenticate with Azure AD for Azure Data Explorer Access:  https://docs.microsoft.com/azure/kusto/management/access-control/how-to-authenticate-with-aad

Azure AD Reporting:  https://docs.microsoft.com/azure/active-directory/reports-monitoring/

How to use Azure Identity Access Reviews:  https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.11: Monitor Attempts to Access Deactivated Accounts

**Guidance**: You may use Azure Active Directory (Azure AD) Sign in Activity, Audit and Risk Event log sources for monitoring which allows you to integrate with any Security Information and Event Management (SIEM) / Monitoring tool.

 You can streamline this process by creating Diagnostic Settings for Azure Active Directory user accounts, sending the audit logs and sign-in logs to a Log Analytics Workspace. Customer to configure desired Alerts within Log Analytics Workspace.

How to integrate Azure Activity Logs into Azure Monitor:  https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.12: Alert on Account Login Behavior Deviation

**Guidance**: Use Azure Active Directory (Azure AD) Risk Detections and Identity Protection feature to configure automated responses to detected suspicious actions related to user identities. Additionally, you can ingest data into Azure Sentinel for further investigation.

How to view Azure AD risky sign-ins:  https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risky-sign-ins

How to configure and enable Identity Protection risk policies:  https://docs.microsoft.com/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

**Guidance**: In support scenarios where Microsoft needs to access customer data, Customer Lockbox provides an interface for customers to review and approve or reject customer data access requests.

Understanding Customer Lockbox:

https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Data Protection

*For more information, see [Security Control: Data Protection](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an Inventory of Sensitive Information

**Guidance**: Use tags to assist in tracking Azure resources that store or process sensitive information.

How to create and use tags:

https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. Azure Data Explorer clusters should be separated from other resources by virtual network/subnet, tagged appropriately, and secured within an network security group (NSG) or Azure Firewall. Data Explorer clusters storing or processing sensitive data should be sufficiently isolated.

How to create additional Azure subscriptions:  https://docs.microsoft.com/azure/billing/billing-create-subscription

How to create Management Groups:  https://docs.microsoft.com/azure/governance/management-groups/create

How to create and use tags:  https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

How to deploy your Azure Data Explorer cluster into a virtual network:  https://docs.microsoft.com/azure/data-explorer/vnet-deployment

How to create an NSG with a Security Config:  https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 4.3: Monitor and Block unauthorized transfer of sensitive information

**Guidance**: Not applicable; For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

Understand customer data protection in Azure:  https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not applicable

### 4.4: Encrypt All Sensitive Information in Transit

**Guidance**: Azure Data Explorer cluster negotiate TLS 1.2 by default. Ensure that any clients connecting to your Azure resources are able to negotiate TLS 1.2 or greater.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Shared

### 4.5: <div>Use an Active Discovery Tool to Identify Sensitive Data</div>

**Guidance**: Data identification, classification, and loss prevention features are not yet available for Azure Data Explorer. Implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

Understand customer data protection in Azure:  https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 4.6: <div>Use Azure RBAC to control access to resources</div>

**Guidance**: Azure Data Explorer enables you to control access to databases and tables, using a role-based access control (RBAC) model. Under this model, principals (users, groups, and apps) are mapped to roles. Principals can access resources according to the roles they're assigned.

List of roles and permissions and instructions on how to configure RBAC for Azure Data Explorer: https://docs.microsoft.com/azure/data-explorer/manage-database-permissions


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.7: Use host-based Data Loss Prevention to enforce access control

**Guidance**: Not applicable; this recommendation is intended for compute resources.

Microsoft manages the underlying infrastructure for Azure Data Explorer and has implemented strict controls to prevent the loss or exposure of customer data.

Understand customer data protection in Azure:  https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not applicable

### 4.8: Encrypt Sensitive Information at Rest

**Guidance**: Azure Disk Encryption helps protect and safeguard your data to meet your organizational security and compliance commitments. It provides volume encryption for the OS and data disks of your cluster virtual machines. It also integrates with Azure Key Vault which allows us to control and manage the disk encryption keys and secrets, and ensure all data on the VM disks is encrypted at rest while in Azure Storage.

How to enable encryption at rest for Azure Data Explorer clusters:  https://docs.microsoft.com/azure/data-explorer/manage-cluster-security


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with the Azure Activity Log to create alerts for when resource-level changes take place on your Azure Data Explorer clusters.

How to create alerts for Azure Activity Log events:  https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log

How to create alerts for Azure Activity Log events:  https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Vulnerability Management

*For more information, see [Security Control: Vulnerability Management](https://docs.microsoft.com/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.1: Run Automated Vulnerability Scanning Tools

**Guidance**: Follow recommendations from Azure Security Center on securing your Azure Data Explorer resources.

Microsoft also performs vulnerability management on the underlying systems that support Azure Data Explorer.

Understand Azure Security Center recommendations: https://docs.microsoft.com/azure/security-center/recommendations-reference

**Azure Security Center monitoring**: Yes

**Responsibility**: Microsoft

### 5.2: Deploy Automated Operating System Patch Management Solution

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not applicable

### 5.3: Deploy Automated Third Party Software Patch Management Solution

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not applicable

### 5.4: Compare Back-to-back Vulnerability Scans

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not applicable

### 5.5: Utilize a risk-rating process to prioritize the remediation of discovered vulnerabilities.

**Guidance**: Use the default risk ratings (Secure Score) provided by Azure Security Center.
Understand Azure Security Center Secure Score:  https://docs.microsoft.com/azure/security-center/security-center-secure-score


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Inventory and Asset Management

*For more information, see [Security Control: Inventory and Asset Management](https://docs.microsoft.com/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Utilize Azure Asset Discovery

**Guidance**: Use Azure Resource Graph to query/discover all resources (such as compute, storage, network, ports, and protocols etc.) within your subscription(s). Ensure appropriate (read) permissions in your tenant and enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use Azure Resource Manager resources going forward.

How to create queries with Azure Resource Graph:  https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal

How to view your Azure Subscriptions:  https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0

Understand Azure RBAC:  https://docs.microsoft.com/azure/role-based-access-control/overview



**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 6.2: Maintain Asset Metadata

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

How to create and use tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 6.3: Delete Unauthorized Azure Resources

**Guidance**: You may use appropriate naming conventions, tagging, management groups, or separate subscriptions, where appropriate, to organize and track assets. You may use Azure Resource Graph to reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner. 

How to create additional Azure subscriptions:  https://docs.microsoft.com/azure/billing/billing-create-subscription

How to create Management Groups: https://docs.microsoft.com/azure/governance/management-groups/create

How to create and use Tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

How to create queries with Azure Resource Graph:  https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal



**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 6.4: Maintain inventory of approved Azure resources and software titles.

**Guidance**: You will need to create an inventory of approved Azure resources and approved software for compute resources as per your organizational needs.  


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 6.5: Monitor for Unapproved Azure Resources

**Guidance**: You may use Azure policies to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

	- Not allowed resource types

	- Allowed resource types

You will be able to monitor the policy generated events using the 

Activity logs which can be monitored using Azure Monitor.

In addition, you may use the Azure Resource Graph to query/discover resources within the subscription(s).

Tutorial: Create and manage policies to enforce compliance: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

Quickstart: Run your first Resource Graph query using Azure Resource Graph Explorer: https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal

Create, view, and manage activity log alerts by using Azure Monitor:  https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log



**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 6.6: Monitor for Unapproved Software Applications within Compute Resources

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not applicable

### 6.7: Remove Unapproved Azure Resources and Software Applications

**Guidance**: Not applicable; this recommendation is intended for compute resources and Azure as a whole.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not applicable

### 6.8: Utilize only approved applications

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not applicable

### 6.9: Utilize only approved Azure Services

**Guidance**: You  may use Azure policies to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

	- Not allowed resource types

	- Allowed resource types

Tutorial: Create and manage policies to enforce compliance: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

Azure Policy Samples: https://docs.microsoft.com/azure/governance/policy/samples/not-allowed-resource-types



**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 6.10: Implement approved application list

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not applicable

### 6.11: Limit users' ability to interact with Azure Resources Manager via scripts

**Guidance**: Use the Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App. This will prevent the creation and changes to resources within your Azure subscriptions. 

Manage access to Azure management with Conditional Access: https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 6.12: Limit Users' Ability to Execute Scripts within Compute Resources

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not applicable

### 6.13: Physically or Logically Segregate High Risk Applications

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not applicable

## Secure Configuration

*For more information, see [Security Control: Secure Configuration](https://docs.microsoft.com/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish Secure Configurations for all Azure Resources

**Guidance**: Use Azure Policy aliases to create custom policies to audit or enforce the configuration of your Azure resources. You may also use built-in Azure Policy definitions.

Also, Azure Resource Manager has the ability to export the template in JavaScript Object Notation (JSON), which should be reviewed to ensure that the configurations meet / exceed the security requirements for your organization.

You may also use recommendations from Azure Security Center as a secure configuration baseline for your Azure resources.

How to view available Azure Policy Aliases: https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0

Tutorial: Create and manage policies to enforce compliance: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

Single and multi-resource export to a template in Azure portal: https://docs.microsoft.com/azure/azure-resource-manager/templates/export-template-portal

Security recommendations - a reference guide: https://docs.microsoft.com/azure/security-center/recommendations-reference



**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 7.2: Establish Secure Configurations for your Operating System

**Guidance**: 
Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not applicable

### 7.3: Maintain Secure Configurations for all Azure Resources

**Guidance**: Use Azure policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.  You may use solutions such as Change Tracking, Policy compliance dashboard or a custom solution to easily identify security changes in your environment.

Understand Azure Policy effects: https://docs.microsoft.com/azure/governance/policy/concepts/effects

Create and manage policies to enforce compliance:  https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

Track changes in your environment with the Change Tracking solution: https://docs.microsoft.com/azure/automation/change-tracking

Get compliance data of Azure resources: https://docs.microsoft.com/azure/governance/policy/how-to/get-compliance-data



**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 7.4: Maintain Secure Configurations for Operating Systems

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not applicable

### 7.5: Securely Store Configuration of Azure Resources

**Guidance**: Use Azure Repos to securely store and manage your code like custom Azure policies, Azure Resource Manager templates, Desired State Configuration scripts etc. To access the resources you manage in Azure DevOps, you can grant or deny permissions to specific users, built-in security groups, or groups defined in Azure Active Directory (Azure AD) if integrated with Azure DevOps, or Active Directory if integrated with TFS.

How to store code in Azure DevOps:  https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops

About permissions and groups in Azure DevOps:  https://docs.microsoft.com/azure/devops/organizations/security/about-permissions



**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 7.6: Securely Store Custom Operating System Images

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not applicable

### 7.7: Deploy System Configuration Management Tools

**Guidance**: Define and implement standard security configurations for Azure resources using Azure Policy. Use Azure Policy aliases to create custom policies to audit or enforce the network configuration of your Azure resources. You may also make use of built-in policy definitions related to your specific resources.  Additionally, you may use Azure Automation to deploy configuration changes.

How to configure and manage Azure Policy:  https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

How to use Aliases: https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#aliases



**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 7.8: Deploy System Configuration Management Tools for Operating Systems

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not applicable

### 7.9: Implement Automated Configuration Monitoring for Azure Services

**Guidance**: Use Azure Policy aliases to create custom policies to alert, audit, and enforce system configurations. Use Azure policy [audit], [deny], and [deploy if not exist] to automatically enforce configurations for your Azure resources.

How to configure and manage Azure Policy:  https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 7.10: Implement Automated Configuration Monitoring for Operating Systems

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not applicable

### 7.11: Securely manage Azure secrets

**Guidance**: Azure Disk Encryption provides volume encryption for the OS and data disks of your Azure Data Explorer cluster virtual machines. It also integrates with Azure Key Vault which allows you to control and manage the disk encryption keys and secrets, and ensure all data on the VM disks is encrypted at rest while in Azure Storage.

How to secure your cluster in Azure Data Explorer:  https://docs.microsoft.com/azure/data-explorer/manage-cluster-security


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Microsoft

### 7.12: Securely and automatically manage identities

**Guidance**: Use Managed Identities to provide Azure services with an automatically managed identity in Azure AD. Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code.How to configure Managed Identities:  https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm

Configure managed identities for your Azure Data Explorer cluster:  https://docs.microsoft.com/azure/data-explorer/managed-identities


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.13: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault. 

How to setup Credential Scanner:
https://secdevtools.azurewebsites.net/helpcredscan.html

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

## Malware Defense

*For more information, see [Security Control: Malware Defense](https://docs.microsoft.com/azure/security/benchmarks/security-control-malware-defense).*

### 8.1: Utilize Centrally Managed Anti-malware Software

**Guidance**: Not applicable; this recommendation is intended for compute resources.

Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure Data Explorer), however it does not run on customer content.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not applicable

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure Data Explorer), however it does not run on customer content.

Pre-scan any content being uploaded to non-compute Azure resources, such as Azure Data Explorer, Data Lake Storage, Blob Storage, Azure Database for PostgreSQL, etc. Microsoft cannot access your data in these instances.



**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 8.3: Ensure Anti-Malware Software and Signatures are Updated

**Guidance**: Not applicable; this recommendation is intended for compute resources.

Microsoft anti-malware is enabled on the underlying host that supports Azure services, however it does not run on customer content.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Not applicable

## Data Recovery

*For more information, see [Security Control: Data Recovery](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure Regular Automated Back Ups

**Guidance**: The data in your Microsoft Azure storage account used by your Data Explorer cluster is always replicated to ensure durability and high availability. Azure Storage copies your data so that it is protected from planned and unplanned events, including transient hardware failures, network or power outages, and massive natural disasters. You can choose to replicate your data within the same data center, across zonal data centers within the same region, or across geographically separated regions.

Understanding Azure Storage redundancy and Service-Level Agreements:  https://docs.microsoft.com/azure/storage/common/storage-redundancy

Export data to storage :  https://docs.microsoft.com/azure/kusto/management/data-export/export-data-to-storage



**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 9.2: Perform Complete System Backups and Backup any Customer Managed Keys

**Guidance**: Azure Data Explorer encrypts all data in a storage account at rest. By default, data is encrypted with Microsoft-managed keys. For additional control over encryption keys, you can supply customer-managed keys to use for data encryption. Customer-managed keys must be stored in an Azure Key Vault. 

Configure customer-managed-keys using C# : https://docs.microsoft.com/azure/data-explorer/customer-managed-keys-csharp

Configure customer-managed-keys using the Azure Resource Manager template:  https://docs.microsoft.com/azure/data-explorer/customer-managed-keys-resource-manager

How to backup Azure Key Vault certificates:  https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultcertificate?view=azurermps-6.13.0


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 9.3: Validate all Backups including Customer Managed Keys

**Guidance**: Periodically test data restoration of your Azure Key Vault secrets.

How to restore Azure Key Vault certificates:

https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultcertificate?view=azurermps-6.13.0 

Configure customer-managed-keys using C# : https://docs.microsoft.com/azure/data-explorer/customer-managed-keys-csharp

Configure customer-managed-keys using the Azure Resource Manager template:  https://docs.microsoft.com/azure/data-explorer/customer-managed-keys-resource-manager



**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 9.4: Ensure Protection of Backups and Customer Managed Keys

**Guidance**: Customer to enable Soft-Delete in Key Vault to protect keys against accidental or malicious deletion.  You can also enable purge protection so that if a vault or an object in the deleted state, it cannot be purged until the retention period has passed.  

How to enable Soft-Delete and Purge protection in Key Vault:  https://docs.microsoft.com/azure/key-vault/key-vault-ovw-soft-delete

Configure customer-managed-keys using C# : https://docs.microsoft.com/azure/data-explorer/customer-managed-keys-csharp

Configure customer-managed-keys using the Azure Resource Manager template:  https://docs.microsoft.com/azure/data-explorer/customer-managed-keys-resource-manager



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Incident Response

*For more information, see [Security Control: Incident Response](https://docs.microsoft.com/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create incident response guide

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.
	

	Guidance on building your own security incident response process: https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/

	

	Microsoft Security Response Center's Anatomy of an Incident: https://msrc-blog.microsoft.com/2019/06/27/inside-the-msrc-anatomy-of-a-ssirp-incident/

	

	Customer may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan: https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final

	



**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 10.2: Create Incident Scoring and Prioritization Procedure

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert. 
	

	Additionally, clearly mark subscriptions (for ex. production, non-prod) using tags and create a naming system to clearly identify and categorize Azure resources, especially those processing sensitive data.  It is your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

	

	Security alerts in Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-alerts-overview

	

	Use tags to organize your Azure resources: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.3: Test Security Response Procedures

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence to help protect your Azure resources. Identify weak points and gaps and revise plan as needed.
	

	Refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities: https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf



**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 10.4: Provide Security Incident Contact Details and Configure Alert Notifications &nbsp;for Security Incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved.
	

How to set the Azure Security Center Security Contact: https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature to help identify risks to Azure resources. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts to Azure Sentinel.
	

	How to configure continuous export: https://docs.microsoft.com/azure/security-center/continuous-export

	

	How to stream alerts into Azure Sentinel: https://docs.microsoft.com/azure/sentinel/connect-azure-security-center



**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations to protect your Azure resources.
	

	How to configure Workflow Automation and Logic Apps: https://docs.microsoft.com/azure/security-center/workflow-automation



**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Penetration Tests and Red Team Exercises

*For more information, see [Security Control: Penetration Tests and Red Team Exercises](https://docs.microsoft.com/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular Penetration Testing of your Azure resources and ensure to remediate all critical security findings within 60 days

**Guidance**: Please follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies:
https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1.

You can find more information on Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft managed cloud infrastructure, services and applications, here: 
https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Shared

## Next steps

- See the [Azure Security Benchmark](https://docs.microsoft.com/azure/security/benchmarks/overview)
- Learn more about [Azure Security Baselines](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview)
