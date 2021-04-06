---
title: Azure security baseline for Azure Data Factory
description: The Azure Data Factory security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: data-factory
ms.topic: conceptual
ms.date: 02/17/2021
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Data Factory

This security
baseline applies guidance from the [Azure Security Benchmark version
1.0](../security/benchmarks/overview-v1.md) to Azure Data Factory. The Azure Security Benchmark
provides recommendations on how you can secure your cloud solutions on Azure.
The content is grouped by the **security controls** defined by the Azure
Security Benchmark and the related guidance applicable to Azure Data Factory. **Controls** not applicable to Azure Data Factory have been excluded.

To see how Azure Data Factory completely maps to the Azure
Security Benchmark, see [full Azure Data Factory security baseline mapping
file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network Security

*For more information, see [Azure Security Benchmark: Network Security](../security/benchmarks/security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

**Guidance**: When creating an Azure-SSIS Integration Runtime (IR), you have the option to join it with a virtual network. This will allow Azure Data Factory to create certain network resources, such as a network security group (NSG) and a load balancer. You also have the ability to provide your own static public IP address or have Azure Data Factory create one for you.  On the NSG that is automatically created by Azure Data Factory, port 3389 is open to all traffic by default. Lock this down to ensure that only your administrators have access.

Self-Hosted IRs can be deployed on an on-premises machine or Azure virtual machine inside a virtual network. Ensure that your virtual network subnet deployment has an  NSG configured to allow only administrative access. Azure-SSIS IR has disallowed port 3389 outbound by default at windows firewall rule on each IR node for protection. You can secure your virtual network-configured resources by associating an NSG with the subnet and setting strict rules.

Where Private Link is available, use private endpoints to secure any resources being linked to your Azure Data Factory pipeline, such as Azure SQL Server. With Private Link, traffic between your virtual network and the service traverses over the Microsoft backbone network, eliminating exposure from the public Internet.

- [How to create an Azure-SSIS IR](create-azure-ssis-integration-runtime.md)

- [How to create and configure a self-hosted IR](create-self-hosted-integration-runtime.md)

- [How to create a Virtual Network](../virtual-network/quick-create-portal.md)

- [How to create an NSG with a security configuration](../virtual-network/tutorial-filter-network-traffic.md)

- [Join an Azure-SSIS IR to a virtual network](join-azure-ssis-integration-runtime-virtual-network.md#virtual-network-configuration)

- [Understand Azure Private Link](../private-link/private-link-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and network interfaces

**Guidance**: Use Azure Security Center and remediate network protection recommendations for the virtual network and network security group associated with your Integration Runtime deployment.

Additionally, enable network security group (NSG) flow logs for the NSG protecting your Integration Runtime deployment and send logs into an Azure Storage Account for traffic auditing.

You may also send NSG flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

- [Understand Network Security provided by Azure Security Center](../security-center/security-center-network-recommendations.md)

- [How to Enable NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [Understand Network Security provided by Azure Security Center](../security-center/security-center-network-recommendations.md)

- [How to Enable and use Traffic Analytics](../network-watcher/traffic-analytics.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.4: Deny communications with known-malicious IP addresses

**Guidance**: Enable DDoS Protection Standard on the virtual networks associated with your Integration Runtime deployment for protection from distributed denial-of-service attacks. Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious or unused Internet IP addresses.

- [How to configure DDoS protection](../ddos-protection/manage-ddos-protection.md)

- [Understand Azure Security Center Integrated Threat Intelligence](../security-center/azure-defender.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.5: Record network packets

**Guidance**: Enable network security group (NSG) flow logs for the NSG protecting your Integration Runtime deployment and send logs into an Azure Storage Account for traffic auditing.

You may also send NSG flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

- [How to Enable NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [Understand Network Security provided by Azure Security Center](../security-center/security-center-network-recommendations.md)

- [How to Enable and use Traffic Analytics](../network-watcher/traffic-analytics.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: If you want to inspect outbound traffic from Azure-SSIS IR, you can route traffic initiated from Azure-SSIS IR to
on-premises firewall appliance via Azure ExpressRoute force tunneling or to a Network Virtual Appliance (NVA) from Azure Marketplace that supports IDS/IPS capabilities. If intrusion detection and/or prevention based on payload inspection is not a requirement, Azure Firewall with Threat Intelligence can be used.

- [Join an Azure-SSIS Integration Runtime to a virtual network](join-azure-ssis-integration-runtime-virtual-network.md)

- [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/?term=Firewall)

- [How to deploy Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md)

- [How to configure alerts with Azure Firewall](../firewall/threat-intel.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: Use virtual network service tags to define network access controls on network security group (NSG) or Azure Firewall. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., DataFactoryManagement) in the appropriate source or destination field of a rule, you can allow or deny inbound traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

- [Understand and use service tags](../virtual-network/service-tags-overview.md)

- [Understand Azure Data Factory specific service tags](join-azure-ssis-integration-runtime-virtual-network.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement standard security configurations for network settings and network resources associated with your Azure data Factory instances with Azure Policy. Use Azure Policy aliases in the "Microsoft.DataFactory" and "Microsoft.Network" namespaces to create custom policies to audit or enforce the network configuration of your Azure Data Factory instances. You may also make use of built-in policy definitions related to networking or your Azure Data factory instances, such as:
"DDoS Protection Standard should be enabled".

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Azure Policy samples for networking](../governance/policy/samples/index.md)

- [How to create an Azure Blueprint](../governance/blueprints/create-blueprint-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.10: Document traffic configuration rules

**Guidance**: Use tags for resources related to network security and traffic flow for your Azure Data Factory instances to provide metadata and logical organization.

Use any of the built-in Azure Policy definitions related to tagging, such as, "Require tag and its value," to ensure that all resources are created with tags and to notify you of existing untagged resources.

You may use Azure PowerShell or Azure CLI to look up or perform actions on resources based on their tags.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network resources related to your Azure Data Factory instances. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place.

- [How to view and retrieve Azure Activity Log events](../azure-monitor/essentials/activity-log.md#view-the-activity-log)

- [How to create alerts in Azure Monitor](../azure-monitor/alerts/alerts-activity-log.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Logging and Monitoring

*For more information, see [Azure Security Benchmark: Logging and Monitoring](../security/benchmarks/security-control-logging-monitoring.md).*

### 2.2: Configure central security log management

**Guidance**: Ingest logs via Azure Monitor to aggregate security data generated by Azure Data Factory. Within Azure Monitor, you are able to query the Log Analytics workspace that is configured to receive your Azure Data Factory activity logs. Use Azure Storage Accounts for long-term/archival log storage or event hubs for exporting data to other systems.

Alternatively, you may enable and on-board data to Azure Sentinel or a third-party Security Incident and Event Management (SIEM).You can also integrate Azure Data Factory with Git to leverage several source control benefits, such as the ability to track/audit changes and the ability to revert changes that introduce bugs.

- [How to configure diagnostic settings](../azure-monitor/essentials/diagnostic-settings.md#create-in-azure-portal)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

- [How to get started with Azure Monitor and third-party SIEM integration](https://azure.microsoft.com/blog/use-azure-monitor-to-integrate-with-siem-tools/)

- [Source control in Azure Data Factory](source-control.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.3: Enable audit logging for Azure resources

**Guidance**: For control plane audit logging, enable Azure Activity Log diagnostic settings and send the logs to a Log Analytics workspace, Azure Event Hubs, or Azure Storage Account for archive. Using Azure Activity Log data, you can determine the "what, who, and when" for any write operations (PUT, POST, DELETE) performed at the control plane level for your Azure resources.

Use diagnostic settings to configure diagnostic logs for noncompute resources in Azure Data Factory, such as metrics and pipeline-run data. Azure Data Factory stores pipeline-run data for 45 days. To retain this data for  longer period of time, save your diagnostic logs to a storage account for auditing or manual inspection and specify the retention time in days.  You can also stream the logs to Azure Event Hubs or send the logs to a Log Analytics workspace for analysis.

- [How to enable Diagnostic Settings for Azure Activity Log](../azure-monitor/essentials/activity-log.md)

- [Understand Azure Data Factory diagnostic logs](monitor-using-azure-monitor.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.4: Collect security logs from operating systems

**Guidance**: If you are running your Integration Runtime in an Azure Virtual Machine (VM), you can use Azure Monitor to collect data from the virtual machine. Installing the Log Analytics VM extension allows Azure Monitor to collect data from your Azure VMs. Azure Security Center can then provide Security Event log monitoring for Virtual Machines. Given the volume of data that the security event log generates, it is not stored by default. 

If your organization would like to retain the  security event log data, it can be stored within a Data Collection tier, at which point it can be queried in Log Analytics.

- [How to collect data from Azure Virtual Machines in Azure Monitor](../azure-monitor/vm/quick-collect-azurevm.md)

- [Enabling Data Collection in Azure Security Center](../security-center/security-center-enable-data-collection.md#data-collection-tier)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.5: Configure security log storage retention

**Guidance**: Enable diagnostic settings for Azure Data Factory. If choosing to store logs in a Log Analytics Workspace, set your Log Analytics Workspace retention period according to your organization's compliance regulations. Use Azure Storage Accounts for long-term/archival storage.

- [How to enable diagnostic logs in Azure Data Factory](monitor-using-azure-monitor.md)

- [How to set log retention parameters for Log Analytics Workspaces](../azure-monitor/logs/manage-cost-storage.md#change-the-data-retention-period)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.6: Monitor and review logs

**Guidance**: Enable diagnostic settings for Azure Data Factory and send logs to a Log Analytics workspace. Use Log Analytics to analyze and monitor your logs for anomalous behavior and regularly review results. Ensure that you also enable diagnostic settings for any data stores related to your Azure Data Factory deployments. Refer to each service's security baseline for guidance on how to enable diagnostic settings.

If you are running your Integration Runtime in an Azure Virtual Machine (VM), enable diagnostic settings for the VM as well.

Alternatively, you may enable and on-board data to Azure Sentinel or a third-party SIEM.

- [Log Analytics schema](./monitor-using-azure-monitor.md#schema-of-logs-and-events)

- [How to collect data from an Azure Virtual Machine with Azure Monitor](../azure-monitor/vm/quick-collect-azurevm.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.7: Enable alerts for anomalous activities

**Guidance**: You can raise alerts on supported metrics in Data Factory by going to the Alerts &amp; Metrics section in Azure Monitor.

Configure diagnostic settings for Azure Data Factory and send logs to a Log Analytics workspace. Within your Log Analytics workspace, configure alerts to take place for when a pre-defined set of conditions takes place. Alternatively, you may enable and on-board data to Azure Sentinel or a third-party SIEM.

Additionally, ensure that you enable diagnostic settings for services related to your data stores. You can refer to each service's security baseline for guidance.

- [Alerts in Azure Data Factory](./monitor-visually.md#alerts)

- [All supported metrics page](../azure-monitor/essentials/metrics-supported.md)

- [How to configure alerts in Log Analytics Workspace](../azure-monitor/alerts/alerts-log.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.8: Centralize anti-malware logging

**Guidance**: If you are running your Integration Runtime in an Azure Virtual Machine, you may use Microsoft Antimalware for Azure Cloud Services and Virtual Machines and configure your virtual machines to log events to an Azure Storage Account. Configure a Log Analytics workspace to ingest the events from the Storage Accounts and create alerts where appropriate. Follow recommendations in Azure Security Center: "Compute &amp; Apps". 

- [How to configure Microsoft Antimalware for Cloud Services and Virtual Machines](../security/fundamentals/antimalware.md)

- [How to Enable guest-level monitoring for Virtual Machines](../cost-management-billing/cloudyn/azure-vm-extended-metrics.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.10: Enable command-line audit logging

**Guidance**: If you are running your Integration Runtime in an Azure Virtual Machine (VM), you can enable command-line audit logging. The Azure Security Center provides Security Event log monitoring for Azure VMs.  Security Center provisions the Microsoft Monitoring Agent on all supported Azure VMs and any new ones that are created if automatic provisioning is enabled or you can install the agent manually.  The agent enables the process creation event 4688 and the CommandLine field inside event 4688. New processes created on the VM are recorded by EventLog and monitored by Security Center's detection services.

- [Data collection in Azure Security Center](../security-center/security-center-enable-data-collection.md#data-collection-tier)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Identity and Access Control

*For more information, see [Azure Security Benchmark: Identity and Access Control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Within Azure Data Factory, ensure that you track and reconcile user access on a regular basis. To create Data Factory instances, the user account that you use to sign in to Azure must be a member of the contributor or owner role, or an administrator of the Azure subscription.

Additionally, at the tenant level, Azure Active Directory (Azure AD) has built-in roles that must be explicitly assigned and are queryable. Use the Azure AD PowerShell module to perform ad hoc queries to discover accounts that are members of administrative groups that have administrative access to the control plane of your Azure Data Factory instances.

While Azure AD is the recommended method to administrate user access, keep in mind that if you are running Integration Runtime in an Azure Virtual Machine (VM), your VM may have local accounts as well. Both local and domain accounts should be reviewed and managed, normally with a minimum footprint. In addition, we would advise that the Privileged Identity Manager is reviewed for the Just In Time feature to reduce the availability of administrative permissions.

- [Roles and permissions for Azure Data Factory](concepts-roles-permissions.md)

- [Information on Privileged Identity Manager](../active-directory/privileged-identity-management/pim-deployment-plan.md)

- [How to get a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrole)

- [How to get members of a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrolemember)

- [Information for Local Accounts](../active-directory/devices/assign-local-admin.md#manage-the-device-administrator-role)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.2: Change default passwords where applicable

**Guidance**: Azure Data Factory uses Azure Active Directory (Azure AD) to provide access to the Azure portal as well as the Azure Data Factory console. Azure AD does not have the concept of default passwords, however, you are responsible to change or not permit default passwords for any custom or third-party applications.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.3: Use dedicated administrative accounts

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts for access to the Azure control plane (Azure portal) as well as the Azure Data Factory console. Use Azure Security Center Identity and Access Management to monitor the number of administrative accounts within Azure Active Directory (Azure AD).

Additionally, to help you keep track of dedicated administrative accounts, you may use recommendations from Azure Security Center or built-in Azure Policies, such as:
- There should be more than one owner assigned to your subscription
- Deprecated accounts with owner permissions should be removed from your subscription
- External accounts with owner permissions should be removed from your subscription

If you are running your Integration Runtime on an Azure Virtual Machine, the administrator accounts on Azure Virtual Machines can also be configured with the Azure Privileged Identity Manager (PIM). Azure Privileged Identity Manager provides several options such as Just in Time elevation, multifactor authentication, and delegation options so that permissions are only available for specific time frames and require a second person to approve.

- [Understand Azure Security Center Identity and Access](../security-center/security-center-identity-access.md)

- [How to use Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Information on Privileged Identity Manager](../active-directory/privileged-identity-management/pim-deployment-plan.md)

- [Roles and permissions for Azure Data Factory](concepts-roles-permissions.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.4: Use Azure Active Directory single sign-on (SSO)

**Guidance**: Use an Azure app registration (service principal) to retrieve a token that your application or function can use to access and interact with your Recovery Services vaults.

- [How to call Azure REST APIs](/rest/api/azure/#how-to-call-azure-rest-apis-with-postman)

- [How to register your client application (service principal) with Azure Active Directory (Azure AD)](/rest/api/azure/#register-your-client-application-with-azure-ad)

- [Azure Recovery Services API information](/rest/api/recoveryservices/)

- [Information on REST API for Azure Data Factory](/rest/api/datafactory/)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.5: Use multi-factor authentication for all Azure Active Directory-based access

**Guidance**: Enable Azure Active Directory (Azure AD) multifactor authentication and follow Azure Security Center Identity and Access Management recommendations.

- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

- [How to monitor identity and access within Azure Security Center](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

**Guidance**: Use privileged access workstations (PAW) with multifactor authentication configured to log into and configure Azure resources. 

- [Learn about Privileged Access Workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/)

- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.7: Log and alert on suspicious activities from administrative accounts

**Guidance**: Use Azure Active Directory (Azure AD) security reports for generation of logs and alerts when suspicious or unsafe activity occurs in the environment. Use Azure Security Center to monitor identity and access activity.

If you are running your Integration Runtime on an Azure Virtual Machine (VM), you can, additionally, on-board your VM to Azure Sentinel. Microsoft Azure Sentinel is a scalable, cloud-native, security information event management (SIEM) and security orchestration automated response (SOAR) solution. Azure Sentinel delivers intelligent security analytics and threat intelligence across the enterprise, providing a single solution for alert detection, threat visibility, proactive hunting, and threat response.

- [How to identify Azure AD users flagged for risky activity](../active-directory/identity-protection/overview-identity-protection.md)

- [How to monitor users' identity and access activity in Azure Security Center](../security-center/security-center-identity-access.md)

- [How to on-board Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.8: Manage Azure resources from only approved locations

**Guidance**: Use Conditional Access Named Locations to allow access from only specific logical groupings of IP address ranges or countries/regions.

- [How to configure Named Locations in Azure](../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.9: Use Azure Active Directory

**Guidance**: A data factory can be associated with a managed identity for Azure resources that represents the specific data factory. You can use this managed identity for Azure SQL Database authentication. The designated factory can access and copy data from or to your database by using this identity.

If you are running your Integration Runtime (IR) on an Azure Virtual Machine, you can use managed identities to authenticate to any service that supports Azure Active Directory (Azure AD) authentication, including Key Vault, without any credentials in your code. Your code that's running on a virtual machine, can use managed identity to request access tokens for services that support Azure AD authentication.

- [How to create and configure an Azure AD instance](../active-directory/fundamentals/active-directory-access-create-new-tenant.md)

- [What are managed identities for Azure resources?](../active-directory/managed-identities-azure-resources/overview.md)

- [Copy and transform data in Azure SQL Database by using Azure Data Factory](connector-azure-sql-database.md)

- [How to configure and manage Azure AD authentication with Azure SQL Database](../azure-sql/database/authentication-aad-configure.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.10: Regularly review and reconcile user access

**Guidance**: Azure Active Directory (Azure AD) provides logs to help you discover stale accounts. In addition, use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access can be reviewed on a regular basis to make sure only the right Users have continued access.

If you are running your Runtime Integration in an Azure Virtual Machine, you will need to review the local security groups and users to make sure that there are no unexpected accounts which could compromise the system.

- [How to use Azure Identity Access Reviews](../active-directory/governance/access-reviews-overview.md)

- [Understand Azure AD reporting](../active-directory/reports-monitoring/index.yml)

- [How to use Azure Identity Access Reviews](../active-directory/governance/access-reviews-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.11: Monitor attempts to access deactivated credentials

**Guidance**: You have access to Azure Active Directory (Azure AD) sign-in activity, audit and risk event log sources, which allow you to integrate with any SIEM/Monitoring tool. You can streamline this process by creating diagnostic settings for Azure AD user accounts and sending the audit logs and sign-in logs to a Log Analytics workspace. You can configure desired log alerts within Log Analytics.

If you are running your Integration Runtime in an Azure Virtual Machine (VM), on-board that VM to Azure Sentinel. Microsoft Azure Sentinel is a scalable, cloud-native, security information event management (SIEM) and security orchestration automated response (SOAR) solution. Azure Sentinel delivers intelligent security analytics and threat intelligence across the enterprise, providing a single solution for alert detection, threat visibility, proactive hunting, and threat response.

- [How to integrate Azure Activity Logs into Azure Monitor](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)

- [Authorize access to Event Hubs resources using Azure AD](../event-hubs/authorize-access-azure-active-directory.md)

- [How to on-board Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.12: Alert on account sign-in behavior deviation

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system for your Azure Data Factory resources, such Azure SQL Database or Azure Virtual Machines. For account login behavior deviation on the control plane (the Azure portal), use Azure AD Identity Protection and risk detection features to configure automated responses to detected suspicious actions related to user identities. You can also ingest data into Azure Sentinel for further investigation.

- [How to view Azure AD risky sign-ins](../active-directory/identity-protection/overview-identity-protection.md)

- [How to configure and enable Identity Protection risk policies](../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

- [Configure and manage Azure AD authentication with SQL](../azure-sql/database/authentication-aad-configure.md?tabs=azure-powershell)

- [Enable Azure AD authentication for Azure-SSIS Integration Runtime](enable-aad-authentication-azure-ssis-ir.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

**Guidance**: In support scenarios where Microsoft needs to access customer data, Azure Customer Lockbox provides an interface for customers to review and approve or reject customer data access requests. Note that while Azure Lockbox is not available for Azure Data Factory itself, Azure Lockbox does support Azure SQL Database and Azure Virtual Machines.

 

- [Understand Customer Lockbox](../security/fundamentals/customer-lockbox-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Protection

*For more information, see [Azure Security Benchmark: Data Protection](../security/benchmarks/security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags to assist in tracking Azure resources that store or process sensitive information.

Use the Azure SQL Database data discovery and classification feature. Data discovery and classification provides advanced capabilities built into Azure SQL Database for discovering, classifying, labeling &amp; protecting the sensitive data in your databases.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

- [How to use data discovery and classification for Azure SQL Server](../azure-sql/database/data-discovery-and-classification-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. Integration Runtimes should be separated by virtual network (VNet)/subnet and tagged appropriately.

You may also use Private Endpoints to perform network isolation. An Azure Private Endpoint is a network interface that connects you privately and securely to a service powered by Azure Private Link. Private Endpoint uses a private IP address from your VNet, effectively bringing the service into your VNet.

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create Management Groups](../governance/management-groups/create-management-group-portal.md)

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

- [Understand Private Link](../private-link/private-endpoint-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: For data sources (such as Azure SQL Database) storing or processing sensitive information for your Azure Data Factory deployment, mark the related resources as sensitive using tags.

Where Private Link is available, use private endpoints to secure any resources being linked to your Azure Data Factory pipeline. Traffic between your virtual network and the service traverses over the Microsoft backbone network, eliminating exposure from the public Internet. You can also reduce the risk of data exfiltration by configuring a strict set of outbound rules on a network security group (NSG) and associating that NSG with your subnet.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

- [How to create an NSG with a security configuration](../virtual-network/tutorial-filter-network-traffic.md) 

- [Understand Azure Private Link](../private-link/private-link-overview.md)

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.4: Encrypt all sensitive information in transit

**Guidance**: If the cloud data store supports HTTPS or TLS, all data transfers between data movement services in Data Factory and a cloud data store are via secure channel HTTPS or TLS. TLS version used is 1.2. 

All connections to Azure SQL Database and Azure Synapse Analytics (formerly SQL Data Warehouse) require encryption (SSL/TLS) while data is in transit to and from the database. When you're authoring a pipeline by using JSON, add the encryption property and set it to true in the connection string. For Azure Storage, you can use HTTPS in the connection string.

- [Understanding encryption in transit in Azure Data Factory](data-movement-security-considerations.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: If you use Azure Data Factory to copy and transform your Azure SQL Database instances, use the Azure SQL Database data discovery and classification feature. Data discovery and classification provides advanced capabilities built into Azure SQL Database for discovering, classifying, labeling &amp; protecting the sensitive data in your databases.

Data discovery and classification features are not yet available for other Azure services.

- [How to use data discovery and classification for Azure SQL Server](../azure-sql/database/data-discovery-and-classification-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.6: Use Role-based access control to control access to resources

**Guidance**: Use Azure role-based access control (Azure RBAC) to control access to the Azure Data Factory control plane (the Azure portal).

To create Data Factory instances, the user account that you use to sign in to Azure must be a member of the contributor or owner role, or an administrator of the Azure subscription.

For your Data Factory data sources, such as Azure SQL Database, refer to the security baseline for that service for more information regarding Azure RBAC.

- [How to configure Azure RBAC](../role-based-access-control/role-assignments-portal.md)

- [Roles and permissions for Azure Data Factory](concepts-roles-permissions.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.7: Use host-based data loss prevention to enforce access control

**Guidance**: Data identification, classification, and loss prevention features are not yet available for Azure Storage or compute resources. Implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.8: Encrypt sensitive information at rest

**Guidance**: We recommend that you enable the data encryption mechanism for any data stores related to your Azure Data Factory deployments. You can refer to the security baseline for that service for more information regarding the encryption of data at rest.

If you are running your Integration Runtime in an Azure Virtual Machine, Virtual disks on Windows Virtual Machines (VM) are encrypted at rest using either Server-side encryption or Azure disk encryption (ADE). Azure Disk Encryption leverages the BitLocker feature of Windows to encrypt managed disks with customer-managed keys within the guest VM. Server-side encryption with customer-managed keys improves on ADE by enabling you to use any OS types and images for your VMs by encrypting data in the Storage service.

You can store credentials or secret values in an Azure Key Vault and use them during pipeline execution to pass to your activities. You can also store credentials for data stores and computes in an Azure Key Vault. Azure Data Factory retrieves the credentials when executing an activity that uses the data store/compute.

- [Understanding encryption at rest in Azure Data Factory](data-movement-security-considerations.md)

- [Server side encryption of Azure managed disks](../virtual-machines/disk-encryption.md)

- [Azure Disk Encryption for Windows VMs](../virtual-machines/windows/disk-encryption-overview.md)

- [How to use Azure Key Vault secrets in pipeline activities](how-to-use-azure-key-vault-secrets-pipeline-activities.md) 

- [How to credentials in Azure Key Vault](store-credentials-in-key-vault.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with the Azure Activity Log to create alerts for when changes take place to Azure Data Factory and related resources.

- [How to create alerts for Azure Activity Log events](../azure-monitor/alerts/alerts-activity-log.md)

- [How to create alerts for Azure Activity Log events](../azure-monitor/alerts/alerts-activity-log.md)

- [Azure Storage analytics logging](../storage/common/storage-analytics-logging.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Vulnerability Management

*For more information, see [Azure Security Benchmark: Vulnerability Management](../security/benchmarks/security-control-vulnerability-management.md).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: If you are using Azure SQL Database as a data store, enable Advanced Data Security for Azure SQL Database and follow recommendations from Azure Security Center on performing vulnerability assessments on your Azure SQL Servers.

If you are running your Integration Runtime in an Azure Virtual Machine (VM), follow recommendations from Azure Security Center on performing vulnerability assessments on your VMs.  Use Azure Security recommended or third-party solution for performing vulnerability assessments for your virtual machines. 

- [How to run vulnerability assessments on Azure SQL Database](../azure-sql/database/sql-vulnerability-assessment.md)

- [How to enable Advanced Data Security](../azure-sql/database/azure-defender-for-sql.md)

- [How to implement Azure Security Center vulnerability assessment recommendations](../security-center/deploy-vulnerability-assessment-vm.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.2: Deploy automated operating system patch management solution

**Guidance**: If you are running your Integration Runtime in an Azure Virtual Machine (VM), use the Azure Update Management solution to manage updates and patches for your VMs.  Update Management relies on the locally configured update repository to patch supported Windows systems. Tools like System Center Updates Publisher (Updates Publisher) allow you to publish custom updates into Windows Server Update Services (WSUS). This scenario allows Update Management to patch machines that use Configuration Manager as their update repository with third-party software.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Update Management solution in Azure](../automation/update-management/overview.md)

- [Manage updates and patches for your Azure VMs](../automation/update-management/manage-updates-for-vm.md)

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 5.3: Deploy automated patch management solution for third-party software titles

**Guidance**: If you are running your Integration Runtime in an Azure Virtual Machine (VM), you may use a third-party patch management solution.  You can use the Azure Update Management solution to manage updates and patches for your virtual machines.  Update Management relies on the locally configured update repository to patch supported Windows systems. Tools like System Center Updates Publisher (Updates Publisher) allow you to publish custom updates into Windows Server Update Services (WSUS). This scenario allows Update Management to patch machines that use Configuration Manager as their update repository with third-party software. 

- [Update Management solution in Azure](../automation/update-management/overview.md)

- [Manage updates and patches for your Azure VMs](../automation/update-management/manage-updates-for-vm.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.4: Compare back-to-back vulnerability scans

**Guidance**: If you are running your Integration Runtime on an Azure Virtual Machine, export scan results at consistent intervals and compare the results to verify that vulnerabilities have been remediated. When using vulnerability management recommendation suggested by Azure Security Center, you may pivot into the selected solution's portal to view historical scan data.

- [Understand integrated vulnerability scanner for virtual machines](../security-center/deploy-vulnerability-assessment-vm.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

**Guidance**: If you're running your Integration Runtime in an Azure Virtual Machine, you can use the native vulnerability scanner. The vulnerability scanner included with Azure Security Center is powered by Qualys. Qualys's scanner is the leading tool for real-time identification of vulnerabilities in your Azure Virtual Machines.

When Security Center identifies vulnerabilities, it presents findings and related information as recommendations. The related information includes remediation steps, related CVEs, CVSS scores, and more. You can view the identified vulnerabilities for one or more subscriptions, or for a specific virtual machine.

- [Integrated vulnerability scanner for virtual machines](../security-center/deploy-vulnerability-assessment-vm.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Inventory and Asset Management

*For more information, see [Azure Security Benchmark: Inventory and Asset Management](../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

**Guidance**: Use Azure Resource Graph to query/discover all resources (such as compute, storage, network, ports, and protocols etc.) within your subscription(s). Ensure appropriate (read) permissions in your tenant and enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use Azure Resource Manager resources going forward.

- [How to create queries with Azure Resource Graph](../governance/resource-graph/first-query-portal.md)

- [How to view your Azure Subscriptions](/powershell/module/az.accounts/get-azsubscription)

- [Understand Azure RBAC](../role-based-access-control/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track Azure resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

In addition, use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create Management Groups](../governance/management-groups/create-management-group-portal.md)

- [How to create and use Tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.4: Define and maintain inventory of approved Azure resources

**Guidance**: Define approved Azure resources and approved software for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in your subscription(s). 

Use Azure Resource Graph to query/discover resources within their subscription(s).  Ensure that all Azure resources present in the environment are approved.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to create queries with Azure Graph](../governance/resource-graph/first-query-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.6: Monitor for unapproved software applications within compute resources

**Guidance**: If you are running your Integration Runtime in an Azure Virtual Machine (VM), leverage Azure Virtual Machine Inventory to automate the collection of information about all software on Virtual Machines. Azure Automation provides complete control during deployment, operations, and decommissioning of workloads and resources.

Note: Software Name, Version, Publisher, and Refresh time are available from the Azure portal. To get access to install date and other information, customer required to enable guest-level diagnostic and bring the Windows Event logs into a Log Analytics Workspace.

- [An introduction to Azure Automation](../automation/automation-intro.md)

- [How to enable Azure VM Inventory](../automation/automation-tutorial-installed-software.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.7: Remove unapproved Azure resources and software applications

**Guidance**: If you are running your Integration Runtime in an Azure Virtual Machine, Azure Automation provides complete control during deployment, operations, and decommissioning of workloads and resources.  You may use Change Tracking to identify all software installed on Virtual Machines. You can implement your own process or use Azure Automation State Configuration for removing unauthorized software.

- [An introduction to Azure Automation](../automation/automation-intro.md)

- [Track changes in your environment with the Change Tracking solution](../automation/change-tracking/overview.md)

- [Azure Automation State Configuration Overview](../automation/automation-dsc-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.8: Use only approved applications

**Guidance**: If you are running your Integration Runtime in an Azure Virtual Machine (VM), use Azure Security Center Adaptive Application Controls to ensure that only authorized software executes and all unauthorized software is blocked from executing on VMs.

- [How to use Azure Security Center Adaptive Application Controls](../security-center/security-center-adaptive-application.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.9: Use only approved Azure services

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:
- Not allowed resource types
- Allowed resource types

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to deny a specific resource type with Azure Policy](../governance/policy/samples/index.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.10: Maintain an inventory of approved software titles

**Guidance**: Adaptive application control is an intelligent, automated, end-to-end solution from Azure Security Center which helps you control which applications can run on your Azure and non-Azure machines (Windows and Linux).  Implement a third-party solution if this does not meet your organization's requirements.

Note that this only applies if your Integration Runtime is running in an Azure Virtual Machine.

- [How to use Azure Security Center Adaptive Application Controls](../security-center/security-center-adaptive-application.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.11: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Configure Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resource Manager](../role-based-access-control/conditional-access-azure-management.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.12: Limit users' ability to execute scripts within compute resources

**Guidance**: If you are running your Runtime Integration in an Azure Virtual Machine, depending on the type of scripts, you may use operating system-specific configurations or third-party resources to limit users' ability to execute scripts within Azure compute resources. You can also leverage Azure Security Center Adaptive Application Controls to ensure that only authorized software executes and all unauthorized software is blocked from executing on Azure Virtual Machines.

- [How to control PowerShell script execution in Windows Environments](/powershell/module/microsoft.powershell.security/set-executionpolicy)

- [How to use Azure Security Center Adaptive Application Controls](../security-center/security-center-adaptive-application.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.13: Physically or logically segregate high risk applications

**Guidance**: High risk applications deployed in your Azure environment may be isolated using virtual network, subnet, subscriptions, management groups etc. and sufficiently secured with either an Azure Firewall, Web Application Firewall (WAF) or network security group (NSG). 

- [Virtual networks and virtual machines in Azure](../virtual-machines/network-overview.md)

- [What is Azure Firewall?](../firewall/overview.md)

- [What is Azure Web Application Firewall?](../web-application-firewall/overview.md)

- [Network security groups](../virtual-network/network-security-groups-overview.md)

- [What is Azure Virtual Network?](../virtual-network/virtual-networks-overview.md)

- [Organize your resources with Azure management groups](../governance/management-groups/overview.md)

- [Subscription decision guide](/azure/cloud-adoption-framework/decision-guides/subscriptions/)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Secure Configuration

*For more information, see [Azure Security Benchmark: Secure Configuration](../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Define and implement standard security configurations for Azure Data Factory with Azure Policy. Use Azure Policy aliases in the "Microsoft.DataFactory" namespace to create custom policies to audit or enforce the configuration of your Azure Data Factory instances.

- [How to view available Azure Policy Aliases](/powershell/module/az.resources/get-azpolicyalias)

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.2: Establish secure operating system configurations

**Guidance**: If you are running your Runtime Integration in an Azure Virtual Machine, use Azure Security Center recommendation [Remediate Vulnerabilities in Security Configurations on your Virtual Machines] to maintain security configurations on all compute resources.

- [How to monitor Azure Security Center recommendations](../security-center/security-center-recommendations.md)

- [How to remediate Azure Security Center recommendations](../security-center/security-center-remediate-recommendations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Understand Azure Policy Effects](../governance/policy/concepts/effects.md)

- [Information on creating Azure Resource Manager templates](../virtual-machines/windows/ps-template.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.4: Maintain secure operating system configurations

**Guidance**: If you are running your Integration Runtime in an Azure Virtual Machine (VM), note that there are several options for maintaining a secure configuration for VMs for deployment:
- Azure Resource Manager templates: These are JSON-based files used to deploy a VM from the Azure portal, and custom template will need to be maintained. Microsoft performs the maintenance on the base templates.
- Custom Virtual hard disk (VHD): In some circumstances it may be required to have custom VHD files used such as when dealing with complex environments that cannot be managed through other means. 
- Azure Automation State Configuration: Once the base OS is deployed, this can be used for more granular control of the settings, and enforced through the automation framework.

For most scenarios, the Microsoft base VM templates combined with the Azure Automation Desired State Configuration can assist in meeting and maintaining the security requirements.

- [Information on how to download the VM template](/previous-versions/azure/virtual-machines/windows/download-template)

- [Information on creating Azure Resource Manager templates](../virtual-machines/windows/ps-template.md)

- [How to upload a custom VM VHD to Azure](../virtual-machines/windows/upload-generalized-managed.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.5: Securely store configuration of Azure resources

**Guidance**: If using custom Azure Policy definitions, use Azure DevOps or Azure Repos to securely store and manage your code.

- [How to store code in Azure DevOps](/azure/devops/repos/git/gitworkflow)

- [Azure Repos Documentation](/azure/devops/repos/)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.6: Securely store custom operating system images

**Guidance**: If using custom images, use Azure role-based access control (Azure RBAC) to ensure only authorized users may access the images. For container images, store them in Azure Container Registry and leverage Azure RBAC to ensure only authorized users may access the images.

The Data Factory  Contributor role can be used to create and manage data factories, as well as child resources within them.

- [Understand Azure RBAC](../role-based-access-control/rbac-and-directory-admin-roles.md) 

- [Understand Azure RBAC for Container Registry](../container-registry/container-registry-roles.md) 

- [How to configure Azure RBAC](../role-based-access-control/quickstart-assign-role-user-portal.md)

- [Roles and permissions for Azure Data Factory](concepts-roles-permissions.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Use built-in Azure Policy definitions as well as Azure Policy aliases in the "Microsoft.DataFactory" namespace to create custom policies to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.8: Deploy configuration management tools for operating systems

**Guidance**: This recommendation can apply if your Integration Runtime is running in an Azure Virtual Machine. Azure Automation State Configuration is a configuration management service for Desired State Configuration (DSC) nodes in any cloud or on-premises datacenter. It enables scalability across thousands of machines quickly and easily from a central, secure location. You can easily onboard machines, assign them declarative configurations, and view reports showing each machine's compliance with the desired state you specified. 

- [Onboarding machines for management by Azure Automation State Configuration](../automation/automation-dsc-onboarding.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Use built-in Azure Policy definitions as well as Azure Policy aliases in the "Microsoft.DataFactory" namespace to create custom policies to alert, audit, and enforce system configurations. Use Azure Policy [audit], [deny], and [deploy if not exist] to automatically enforce configurations for your Azure resources.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.10: Implement automated configuration monitoring for operating systems

**Guidance**: This recommendation can apply if your Integration Runtime is running in an Azure Virtual Machine. Azure Automation State Configuration is a configuration management service for Desired State Configuration (DSC) nodes in any cloud or on-premises datacenter. It enables scalability across thousands of machines quickly and easily from a central, secure location. You can easily onboard machines, assign them declarative configurations, and view reports showing each machine's compliance with the desired state you specified. 

- [Onboarding machines for management by Azure Automation State Configuration](../automation/automation-dsc-onboarding.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.11: Manage Azure secrets securely

**Guidance**: Use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure secret management for your cloud applications.

You can also store credentials or secret values in an Azure Key Vault and use them during pipeline execution to pass to your activities. Ensure that soft-delete is enabled.

- [How to integrate with Azure Managed Identities](../azure-app-configuration/howto-integrate-azure-managed-service-identity.md)

- [How to create a Key Vault](../key-vault/secrets/quick-create-portal.md)

- [How to authenticate to Key Vault](../key-vault/general/authentication.md)

- [How to assign a Key Vault access policy](../key-vault/general/assign-access-policy-portal.md)

- [Use Azure Key Vault secrets in pipeline activities](how-to-use-azure-key-vault-secrets-pipeline-activities.md)

- [Soft-delete in Azure Key Vault](../key-vault/general/soft-delete-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.12: Manage identities securely and automatically

**Guidance**: When creating a data factory, a managed identity can be created along with factory creation. The managed identity is a managed application registered to Azure Active Directory (Azure AD), and represents this specific data factory.

- [Managed identity for Azure Data Factory](data-factory-service-identity.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.13: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Malware Defense

*For more information, see [Azure Security Benchmark: Malware Defense](../security/benchmarks/security-control-malware-defense.md).*

### 8.1: Use centrally-managed anti-malware software

**Guidance**: If you are running your Integration Runtime in an Azure Virtual Machine, you can use Microsoft Antimalware for Azure Windows Virtual Machines to continuously monitor and defend your resources. 

- [How to configure Microsoft Antimalware for Cloud Services and Virtual Machines](../security/fundamentals/antimalware.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Microsoft Antimalware is enabled on the underlying host that supports Azure services (for example, Azure App Service), however it does not run on your content.

Pre-scan any files being uploaded to non-compute Azure resources, such as App Service, Data Lake Storage, Blob Storage, etc. 

Use Azure Security Center's Threat detection for data services to detect malware uploaded to storage accounts. 

- [Understand Microsoft Antimalware for Azure Cloud Services and Virtual Machines](../security/fundamentals/antimalware.md)

- [Understand Azure Security Center's Threat detection for data services](../security-center/azure-defender.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 8.3: Ensure anti-malware software and signatures are updated

**Guidance**: When deployed, Microsoft Antimalware for Azure will automatically install the latest signature, platform, and engine updates by default. Follow recommendations in Azure Security Center: "Compute &amp; Apps" to ensure all endpoints are up to date with the latest signatures. The Windows OS can be further protected with additional security to limit the risk of virus or malware-based attacks with the Microsoft Defender Advanced Threat Protection service that integrates with Azure Security Center.

- [How to deploy Microsoft Antimalware for Azure Cloud Services and Virtual Machines](../security/fundamentals/antimalware.md)

- [Microsoft Defender Advanced Threat Protection](/windows/security/threat-protection/microsoft-defender-atp/onboard-configure)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Recovery

*For more information, see [Azure Security Benchmark: Data Recovery](../security/benchmarks/security-control-data-recovery.md).*

### 9.1: Ensure regular automated back-ups

**Guidance**: If you are running your Integration Runtime in an Azure Virtual Machine (VM), enable Azure Backup and configure the VM, as well as the desired frequency and retention period for automatic backups.

For any of your data stores, refer to that service's security baseline for recommendations on how to perform regular, automated backups.

- [An overview of Azure VM backup](../backup/backup-azure-vms-introduction.md)

- [Back up an Azure VM from the VM settings](../backup/backup-azure-vms-first-look-arm.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.2: Perform complete system backups and backup any customer-managed keys

**Guidance**: If you are running your Integration Runtime in an Azure Virtual Machine (VM), enable Azure Backup and target Azure VMs, as well as the desired frequency and retention periods. Back up customer-managed keys within Azure Key Vault.

For any of your data stores, refer to that service's security baseline for recommendations on how to perform regular, automated backups.

- [An overview of Azure VM backup](../backup/backup-azure-vms-introduction.md)

- [How to backup key vault keys in Azure](/powershell/module/az.keyvault/backup-azkeyvaultkey)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.3: Validate all backups including customer-managed keys

**Guidance**: If you are running your Integration Runtime in an Azure Virtual Machine, ensure the ability to periodically perform data restoration of content within Azure Backup. If necessary, test restore content to an isolated VLAN. Periodically test restoration of backed up customer-managed keys.

For any of your data stores, refer to that service's security baseline for guidance on validating backups.

- [How to recover files from Azure Virtual Machine backup](../backup/backup-azure-restore-files-from-vm.md)

- [How to restore key vault keys in Azure](/powershell/module/az.keyvault/restore-azkeyvaultkey)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.4: Ensure protection of backups and customer-managed keys

**Guidance**: If you are running your Integration Runtime in an Azure Virtual Machine (VM) and you back that VM up with Azure Backup, your VM is encrypted at rest with Storage Service Encryption (SSE). Azure Backup can also back up Azure VMs that are encrypted by using Azure Disk Encryption. Azure Disk Encryption integrates with BitLocker encryption keys (BEKs), which are safeguarded in a key vault as secrets. Azure Disk Encryption also integrates with Azure Key Vault key encryption keys (KEKs). Enable Soft-Delete in Key Vault to protect keys against accidental or malicious deletion.

- [Soft delete for VMs](../backup/backup-azure-security-feature-cloud.md)

- [Azure Key Vault soft-delete overview](../key-vault/general/soft-delete-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Incident Response

*For more information, see [Azure Security Benchmark: Incident Response](../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.

- [How to configure Workflow Automations within Azure Security Center](../security-center/security-center-planning-and-operations-guide.md)

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Customer may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytics used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, clearly mark subscriptions (for ex. production, non-prod) and create a naming system to clearly identify and categorize Azure resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems' incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

- [Refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that the customer's data has been accessed by an unlawful or unauthorized party.  Review incidents after the fact to ensure that issues are resolved.

- [How to set the Azure Security Center Security Contact](../security-center/security-center-provide-security-contact-details.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts to Azure Sentinel.

- [How to configure continuous export](../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../sentinel/connect-azure-security-center.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.6: Automate the response to security alerts

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.

- [How to configure Workflow Automation and Logic Apps](../security-center/workflow-automation.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Penetration Tests and Red Team Exercises

*For more information, see [Azure Security Benchmark: Penetration Tests and Red Team Exercises](../security/benchmarks/security-control-penetration-tests-red-team-exercises.md).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

**Guidance**: Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications. 

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1) 

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Next steps

- see [Azure Security Benchmark V2 overview](../security/benchmarks/overview.md)
- Learn more about [Azure security baselines](../security/benchmarks/security-baselines-overview.md)