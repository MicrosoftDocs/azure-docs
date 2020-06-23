---
title: Azure Security Baseline for HDInsight
description: Azure Security Baseline for HDInsight
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 04/09/2020
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Azure Security Baseline for HDInsight

The Azure Security Baseline for HDInsight contains recommendations that will help you improve the security posture of your deployment.

The baseline for this service is drawn from the [Azure Security Benchmark version 1.0](https://docs.microsoft.com/azure/security/benchmarks/overview), which provides recommendations on how you can secure your cloud solutions on Azure with our best practices guidance.

For more information, see [Azure Security Baselines overview](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview).

## Network Security

*For more information, see [Security Control: Network Security](https://docs.microsoft.com/azure/security/benchmarks/security-control-network-security).*

### 1.1: Protect resources using Network Security Groups or Azure Firewall on your Virtual Network

**Guidance**: Perimeter security in Azure HDInsight is achieved through virtual networks. An enterprise administrator can create a cluster inside a virtual network and use a network security group (NSG) to restrict access to the virtual network. Only the allowed IP addresses in the inbound Network Security Group rules will be able to communicate with the Azure HDInsight cluster. This configuration provides perimeter security. All clusters deployed in a virtual network will also have a private endpoint that resolves to a private IP address inside the Virtual Network for private HTTP access to the cluster gateways.

To reduce the risk of data loss via exfiltration, restrict outbound network traffic for Azure HDInsight clusters using Azure Firewall.

How to Deploy Azure HDInsight within a Virtual Network and Secure with a Network Security Group: https://docs.microsoft.com/azure/hdinsight/hdinsight-create-virtual-network

How to restrict outbound traffic for Azure HDInsight Clusters with Azure Firewall: https://docs.microsoft.com/azure/hdinsight/hdinsight-restrict-outbound-traffic

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.2: Monitor and log the configuration and traffic of Vnets, Subnets, and NICs

**Guidance**: Use Azure Security Center and remediate network protection recommendations for the virtual network, subnet, and network security group being used to secure your Azure HDInsight cluster. Enable network security group (NSG) flow logs and send logs into a Azure Storage Account to traffic audit. You may also send NSG flow logs to a Azure Log Analytics Workspace and use Azure Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Azure Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network mis-configurations.

How to Enable NSG Flow Logs:

https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal

How to Enable and use Azure Traffic Analytics:

https://docs.microsoft.com/azure/network-watcher/traffic-analytics

Understand Network Security provided by Azure Security Center:

https://docs.microsoft.com/azure/security-center/security-center-network-recommendations

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.3: Protect critical web applications

**Guidance**: Not applicable; benchmark is intended for Azure Apps Service or compute resources hosting web applications.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.4: Deny communications with known malicious IP addresses

**Guidance**: For protections from DDoS attacks, enable Azure DDoS Standard protection on the virtual network where your Azure HDInsight is deployed. Use Azure Security Center integrated threat intelligence to deny communications with known malicious or unused Internet IP addresses.

How to configure DDoS protection:

https://docs.microsoft.com/azure/virtual-network/manage-ddos-protection

Understand Azure Security Center Integrated Threat Intelligence:

https://docs.microsoft.com/azure/security-center/security-center-alerts-service-layer

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.5: Record network packets and flow logs

**Guidance**: Enable network security group (NSG) flog logs for the NSG attached to the subnet being used to protect your Azure HDInsight cluster. Record the NSG flow logs into a Azure Storage Account to generate flow records. If required for investigating anomalous activity, enable Azure Network Watcher packet capture.

How to Enable NSG Flow Logs:

https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal

How to enable Network Watcher:

https://docs.microsoft.com/azure/network-watcher/network-watcher-create

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.6: Deploy network based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Requirement can be met Azure security control ID 1.1; Deploy Azure HDInsight cluster into a virtual network and secure with a network security group (NSG).

There are several dependencies for Azure HDInsight that require inbound traffic. The inbound management traffic can't be sent through a firewall device. The source addresses for required management traffic are known and published. Create Network Security Group rules with this information to allow traffic from only trusted locations, securing inbound traffic to the clusters.

To reduce the risk of data loss via exfiltration, restrict outbound network traffic for Azure HDInsight clusters using Azure Firewall.

How to Deploy HDInsight within a Virtual Network and Secure with a Network Security Group: https://docs.microsoft.com/azure/hdinsight/hdinsight-create-virtual-network

Understand HDInsight dependencies and firewall usage: https://docs.microsoft.com/azure/hdinsight/hdinsight-restrict-outbound-traffic

HDInsight management IP addresses: https://docs.microsoft.com/azure/hdinsight/hdinsight-management-ip-addresses

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.7: Manage traffic to web applications

**Guidance**: Not applicable; benchmark is intended for Azure Apps Service or compute resources hosting web applications.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: Use Virtual network service tags  to define network access controls on network security groups (NSG) that are attached to the subnet your Azure HDInsight cluster is deployed in. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., ApiManagement) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

Understand and using Service Tags for Azure HDInsight:

https://docs.microsoft.com/azure/virtual-network/security-overview#service-tags

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement standard security configurations for network resources related to your Azure HDInsight cluster. Use Azure Policy aliases in the "Microsoft.HDInsight" and "Microsoft.Network" namespaces to create custom policies to audit or enforce the network configuration of your Azure HDInsight cluster.

You may also use Azure Blueprints to simplify large scale Azure deployments by packaging key environment artifacts, such as Azure Resource Manager templates, RBAC controls, and policies, in a single blueprint definition. Easily apply the blueprint to new subscriptions and environments, and fine-tune control and management through versioning.

How to view available Azure Policy aliases:

https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0

How to configure and manage Azure Policy:

https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

How to create an Azure Blueprint:

https://docs.microsoft.com/azure/governance/blueprints/create-blueprint-portal

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.10: Document traffic configuration rules

**Guidance**: Use Tags for network security group (NSGs) and other resources related to network security and traffic flow that are associated with your Azure HDInsight cluster. For individual NSG rules, use the "Description" field to specify business need and/or duration (etc.) for any rules that allow traffic to/from a network.

Use any of the built-in Azure Policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with Tags and to notify you of existing untagged resources.

You may use Azure PowerShell or Azure command-line interface (CLI) to look-up or perform actions on resources based on their Tags.

How to create and use Tags:

https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

How to create a virtual network:

https://docs.microsoft.com/azure/virtual-network/quick-create-portal

How to create an NSG with a Security Config:

https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Activity Log to monitor network resource configurations and 
detect changes for network resources related to your Azure HDInsight deployments. Create alerts within Azure Monitor that will trigger when 
changes to critical network resources take place.

How to view and retrieve Azure Activity Log events:

https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view

How to create alerts in Azure Monitor:
https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Logging and Monitoring

*For more information, see [Security Control: Logging and Monitoring](https://docs.microsoft.com/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.1: Use approved time synchronization sources

**Guidance**: Microsoft maintains time sources for Azure HDInsight cluster components, you may update time synchronization for your compute deployments.

How to configure time synchronization for Azure compute resources:

https://docs.microsoft.com/azure/virtual-machines/windows/time-sync

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Microsoft

### 2.2: Configure central security log management

**Guidance**: You can onboard your Azure HDInsight cluster to Azure Monitor to aggregate security data generated by the cluster. Leverage custom queries to detect and respond to threats in the environment. 

How to onboard an Azure HDInsight cluster to Azure Monitor:

https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-oms-log-analytics-tutorial

How to create custom queries for an Azure HDInsight cluster:

https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-oms-log-analytics-use-queries

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

**Guidance**: Enable Azure Monitor for the HDInsight cluster, direct it to a Log Analytics workspace. This will log relevant cluster information and OS metrics for all Azure HDInsight cluster nodes.

How to enable logging for HDInsight Cluster:

 https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-oms-log-analytics-tutorial

How to query HDInsight logs:

https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-oms-log-analytics-use-queries

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.4: Collect security logs from operating systems

**Guidance**: Onboard Azure HDInsight cluster to Azure Monitor. Ensure that the Log Analytics workspace used has the log retention period set according to your organization's compliance regulations.

How to onboard an Azure HDInsight Cluster to Azure Monitor:

https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-oms-log-analytics-tutorial

How to configure Log Analytics Workspace Retention Period:

https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.5: Configure security log storage retention

**Guidance**: Onboard Azure HDInsight cluster to Azure Monitor. Ensure that the Azure Log Analytics workspace used has the log retention period set according to your organization's compliance regulations.

How to onboard an Azure HDInsight Cluster to Azure Monitor:

https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-oms-log-analytics-tutorial

How to configure Log Analytics Workspace Retention Period:

https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.6: Monitor and review Logs

**Guidance**: Use Azure Log Analytics workspace queries to query Azure HDInsight logs:

How to Create Custom Queries for Azure HDInsight Clusters:

https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-oms-log-analytics-use-queries

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activity

**Guidance**: Use Azure Log Analytics workspace for monitoring and alerting on anomalous activities in security logs and events related to your Azure HDInsight cluster.

How to manage alerts in Azure Security Center:

https://docs.microsoft.com/azure/security-center/security-center-managing-and-responding-alerts

How to alert on log analytics log data:

https://docs.microsoft.com/azure/azure-monitor/learn/tutorial-response

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.8: Centralize anti-malware logging

**Guidance**: Azure HDInsight comes with Clamscan pre-installed and enabled for the cluster node images, however you must manage the software and manually aggregate/monitor any logs Clamscan produces.

Understand Clamscan:

https://docs.microsoft.com/azure/hdinsight/hdinsight-faq#security-and-certificates

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.9: Enable DNS query logging

**Guidance**: Implement third party solution for dns logging.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.10: Enable command-line audit logging

**Guidance**: Manually configure console logging on a per-node basis.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Identity and Access Control

*For more information, see [Security Control: Identity and Access Control](https://docs.microsoft.com/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Maintain record of the local administrative account that is created during cluster provisioning of Azure HDInsight cluster as well as any other accounts you create. In addition, if Azure AD integration is used, Azure AD has built-in roles that must be explicitly assigned and are therefore queryable. Use the Azure AD PowerShell module to perform adhoc queries to discover accounts that are members of administrative groups.

In addition, you may use Azure Security Center Identity and Access Management recommendations.

How to get a directory role in Azure AD with PowerShell:

https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0

How to get members of a directory role in Azure AD with PowerShell:

https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0

How to monitor identity and access with Azure Security Center:

https://docs.microsoft.com/azure/security-center/security-center-identity-access

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.2: Change default passwords where applicable

**Guidance**: When provisioning a cluster, Azure requires you to create new passwords for the web portal and Secure Shell (SSH) access. There are no default passwords to change, however you can specify different passwords for SSH and web portal access.

How to set passwords when provisioning an Azure HDInsight cluster:

https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-linux-use-ssh-unix

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.3: Use dedicated administrative accounts

**Guidance**: Integrate Authentication for Azure HDInsight cluster with Azure Active Directory. Create policies and procedures around the use of dedicated administrative accounts.

In addition, you may use Azure Security Center Identity and Access Management recommendations.

How to integrate Azure HDInsight authentication with Azure Active Directory:

https://docs.microsoft.com/azure/hdinsight/domain-joined/apache-domain-joined-configure-using-azure-adds

How to monitor identity and access with Azure Security Center:

https://docs.microsoft.com/azure/security-center/security-center-identity-access

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.4: Use single sign-on (SSO) with Azure Active Directory

**Guidance**: Use Azure HDInsight ID Broker to sign in to Enterprise Security Package (ESP) clusters by using Multi-Factor Authentication, without providing any passwords. If you've already signed in to other Azure services, such as the Azure portal, you can sign in to your Azure HDInsight cluster with a single sign-on (SSO) experience.

How to enable Azure HDInsight ID Broker:

https://docs.microsoft.com/azure/hdinsight/domain-joined/identity-broker#enable-hdinsight-id-broker

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

**Guidance**: Enable Azure AD MFA and follow Azure Security Center Identity and Access Management recommendations. Azure HDInsight clusters with the Enterprise Security Package configured can be connected to a domain so that domain users can use their domain credentials to authenticate with the clusters and run big data jobs. When authenticating with multi-factor authentication (MFA) enabled, users will be challenged to provide a second authentication factor.

How to enable MFA in Azure:

https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted

How to monitor identity and access within Azure Security Center:

https://docs.microsoft.com/azure/security-center/security-center-identity-access

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

**Guidance**: Use PAWs (privileged access workstations) with multi-factor authentication (MFA) configured to log into and configure your Azure HDInsight clusters and related resources.

Learn about Privileged Access Workstations:

https://docs.microsoft.com/windows-server/identity/securing-privileged-access/privileged-access-workstations

How to enable MFA in Azure:

https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.7: Log and alert on suspicious activity from administrative accounts

**Guidance**: Azure HDInsight clusters with the Enterprise Security Package configured can be connected to a domain so that domain users can use their domain credentials to authenticate. You may use Azure Active Directory (AAD) security reports for generation of logs and alerts when suspicious or unsafe activity occurs in the AAD environment. Use Azure Security Center to monitor identity and access activity.

How to identify AAD users flagged for risky activity:

https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-user-at-risk

How to monitor users identity and access activity in Azure Security Center:

https://docs.microsoft.com/azure/security-center/security-center-identity-access

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.8: Manage Azure resources from only approved locations

**Guidance**: Azure HDInsight clusters with the Enterprise Security Package configured can be connected to a domain so that domain users can use their domain credentials to authenticate. Use Conditional Access Named Locations to allow access from only specific logical groupings of IP address ranges or countries/regions.

How to configure Named Locations in Azure:

https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory (AAD) as the central authentication and authorization system. AAD protects data by using strong encryption for data at rest and in transit. AAD also salts, hashes, and securely stores user credentials.

Azure HDInsight clusters with Enterprise Security Package (ESP) configured can be connected to a domain so that domain users can use their domain credentials to authenticate with the clusters.

How to create and configure an AAD instance:

https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-access-create-new-tenant

How to configure Enterprise Security Package  with Azure Active Directory Domain Services in Azure HDInsight:

https://docs.microsoft.com/azure/hdinsight/domain-joined/apache-domain-joined-configure-using-azure-adds

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.10: Regularly review and reconcile user access

**Guidance**: Use Azure Active Directory (AAD) authentication with your Azure HDInsight cluster. AAD provides logs to help discover stale accounts. In addition, use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User's access can be reviewed on a regular basis to make sure only the right Users have continued access. 

How to use Azure Identity Access Reviews:

https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.11: Monitor attempts to access deactivated accounts

**Guidance**: Use Azure Active Directory (AAD) Sign-in and Audit logs to monitor for attempts to access deactivated accounts; these logs can be integrated into any third-party SIEM/monitoring tool.

You can streamline this process by creating Diagnostic Settings for AAD user accounts, sending the audit logs and sign-in logs to a Azure Log Analytics workspace. Configure desired Alerts within Azure Log Analytics workspace.

How to integrate Azure Activity Logs into Azure Monitor:

https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.12: Alert on account login behavior deviation

**Guidance**: Azure HDInsight clusters with Enterprise Security Package (ESP) configured can be connected to a domain so that domain users can use their domain credentials to authenticate with the clusters.  Use Azure Active Directory (AAD) Risk Detections and Identity Protection feature to configure automated responses to detected suspicious actions related to user identities. Additionally, you can ingest data into Azure Sentinel for further investigation.

How to view AAD risky sign-ins:

https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risky-sign-ins

How to configure and enable Identity Protection risk policies:

https://docs.microsoft.com/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

**Guidance**: Not available; Customer Lockbox not yet supported for Azure HDInsight.

List of Customer Lockbox supported services: https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview#supported-services-and-scenarios-in-general-availability



**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Data Protection

*For more information, see [Security Control: Data Protection](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags on resources related to your Azure HDInsight  deployments to assist in tracking Azure resources that store or process sensitive information.

How to create and use tags:

https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. Azure HDInsight clusters and any associated storage accounts should be separated by virtual network/subnet, tagged appropriately, and secured within an network security group (NSG) or Azure Firewall. Cluster data should be contained within a secured Azure Storage Account or Azure Data Lake Storage (Gen1 or Gen2).

Choose storage options for your Azure HDInsight cluster:

https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-compare-storage-options

How to secure Azure Data Lake Storage:

https://docs.microsoft.com/azure/data-lake-store/data-lake-store-security-overview

How to secure Azure Storage Accounts:

https://docs.microsoft.com/azure/storage/common/storage-security-guide

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: For Azure HDInsight clusters storing or processing sensitive information, mark the cluster and related resources as sensitive using tags. To reduce the risk of data loss via exfiltration, restrict outbound network traffic for Azure HDInsight clusters using Azure Firewall.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

How to restrict outbound traffic for Azure HDInsight Clusters with Azure Firewall:

https://docs.microsoft.com/azure/hdinsight/hdinsight-restrict-outbound-traffic

Understand customer data protection in Azure:

https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### 4.4: Encrypt all sensitive information in transit

**Guidance**: Encrypt all sensitive information in transit. Ensure that any clients connecting to your Azure HDInsight cluster or cluster data stores (Azure Storage Accounts or Azure Data Lake Storage Gen1/Gen2) are able to negotiate TLS 1.2 or greater. Microsoft Azure resources will negotiate TLS 1.2 by default. 

Understand Azure Data Lake Storage encryption in transit:

https://docs.microsoft.com/azure/data-lake-store/data-lake-store-security-overview

Understand Azure Storage Account encryption in transit:

https://docs.microsoft.com/azure/storage/common/storage-security-guide#encryption-in-transit

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Data identification, classification, and loss prevention features are not yet available for Azure Storage or compute resources. Implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

Understand customer data protection in Azure:

https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### 4.6: Use Azure RBAC to control access to resources

**Guidance**: With Azure HDInsight Enterprise Security Package (ESP), you can use Apache Ranger to create and manage fine-grained access control and data obfuscation policies for your data stored in files, folders, databases, tables and rows/columns. The hadoop admin can configure role-based access control (RBAC) to secure Apache Hive, HBase, Kafka ​and Spark using those plugins in Apache Ranger.

Configuring RBAC policies with Apache Ranger allows you to associate permissions with a role in the organization. This layer of abstraction makes it easier to ensure that people have only the permissions needed to perform their work responsibilities.

Enterprise Security Package configurations with Azure Active Directory Domain Services in HDInsight:

https://docs.microsoft.com/azure/hdinsight/domain-joined/apache-domain-joined-configure-using-azure-adds

Overview of enterprise security in Azure HDInsight:

https://docs.microsoft.com/azure/hdinsight/domain-joined/hdinsight-security-overview



**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.7: Use host-based data loss prevention to enforce access control

**Guidance**: For Azure HDInsight clusters storing or processing sensitive information, mark the cluster and related resources as sensitive using tags. Data identification, classification, and loss prevention features are not yet available for Azure Storage or compute resources. Implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

Understand customer data protection in Azure:

https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### 4.8: Encrypt sensitive information at rest

**Guidance**: If using Azure SQL Database to store Apache Hive and Apache Oozie metadata, ensure SQL data remains encrypted at all times. For Azure Storage Accounts and Data Lake Storage (Gen1 or Gen2), it is recommended to allow Microsoft to manage your encryption keys, however, you have the option to manage your own keys.

How to manage encryption keys for Azure Storage Accounts:

https://docs.microsoft.com/azure/storage/common/storage-encryption-keys-portal

How to create Azure Data Lake Storage using customer managed encryption keys:

https://docs.microsoft.com/azure/data-lake-store/data-lake-store-get-started-portal

Understand encryption for Azure SQL Database:

https://docs.microsoft.com/azure/sql-database/sql-database-technical-overview#data-encryption

How to configure Transparent Data Encryption for SQL Database using customer managed keys:

https://docs.microsoft.com/azure/sql-database/transparent-data-encryption-azure-sql?tabs=azure-portal

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Configure Diagnostic Settings for Azure Storage Accounts associated with Azure HDInsight clusters to monitor and log all CRUD operations against cluster data. Enable Auditing for any Storage Accounts or Data Lake Stores associated with the Azure HDInsight cluster.

How to enable additional logging/auditing for an Azure Storage Account:

https://docs.microsoft.com/azure/storage/common/storage-monitor-storage-account

How to enable additional logging/auditing for Azure Data Lake Storage:

https://docs.microsoft.com/azure/data-lake-analytics/data-lake-analytics-diagnostic-logs

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Vulnerability Management

*For more information, see [Security Control: Vulnerability Management](https://docs.microsoft.com/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: Implement a third-party vulnerability management solution.

Optionally, if you have a Rapid7, Qualys, or any other vulnerability management platform subscription, you may use script actions to install vulnerability assessment agents on your Azure HDInsight cluster nodes and manage the nodes through the respective portal.

How to Install Rapid7 Agent Manually:

https://insightvm.help.rapid7.com/docs/install

How to install Qualys Agent Manually:

https://www.qualys.com/docs/qualys-cloud-agent-linux-install-guide.pdf

How to use script actions:

https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-customize-cluster-linux

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 5.2: Deploy automated operating system patch management solution

**Guidance**: Automatic system updates have been enabled for cluster node images, however you must periodically reboot cluster nodes to ensure updates are applied.

Microsoft to maintain and update base Azure HDInsight node images.

How to configure the OS patching schedule for HDInsight clusters:

https://docs.microsoft.com/azure/hdinsight/hdinsight-os-patching

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### 5.3: Deploy automated third-party software patch management solution

**Guidance**: Use script actions or other mechanisms to patch your Azure HDInsight clusters. Newly created clusters will always have the latest available updates, including the most recent security patches.

How to configure the OS patching schedule for Linux-based Azure HDInsight clusters:

https://docs.microsoft.com/azure/hdinsight/hdinsight-os-patching

How to use script actions:

https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-customize-cluster-linux

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 5.4: Compare back-to-back vulnerability scans

**Guidance**: Implement a third-party vulnerability management solution which has the ability to compare vulnerability scans over time. If you have a Rapid7 or Qualys subscription, you may use that vendor's portal to view and compare back-to-back vulnerability scans.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

**Guidance**: Use a common risk scoring program (e.g. Common Vulnerability Scoring System) or the default risk ratings provided by your third-party scanning tool.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Inventory and Asset Management

*For more information, see [Security Control: Inventory and Asset Management](https://docs.microsoft.com/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use Azure Asset Discovery

**Guidance**: Use Azure Resource Graph to query/discover all resources (such as compute, storage, network, ports, and protocols etc.), including Azure HDInsight clusters, within your subscription(s).  Ensure you have appropriate (read) permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use Azure Resource Manager resources going forward.

How to create queries with Azure Resource Graph:

https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal

How to view your Azure Subscriptions:

https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0

Understand Azure RBAC:

https://docs.microsoft.com/azure/role-based-access-control/overview

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

How to create and use tags:

https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track assets. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

How to create additional Azure subscriptions:

https://docs.microsoft.com/azure/billing/billing-create-subscription

How to create Management Groups:

https://docs.microsoft.com/azure/governance/management-groups/create

How to create and use tags:

https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.4: Maintain an inventory of approved Azure resources and software titles

**Guidance**: Define list of approved Azure resources and approved software for your compute resources

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

Use Azure Resource Graph to query/discover resources within your subscription(s). Ensure that all Azure resources present in the environment are approved.

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

How to create queries with Azure Graph: https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal



**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.6: Monitor for unapproved software applications within compute resources

**Guidance**: Implement a third-party solution to monitor cluster nodes for unapproved software applications.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.7: Remove unapproved Azure resources and software applications

**Guidance**: Use Azure Resource Graph to query/discover all resources (such as compute, storage, network, ports, and protocols etc.), including Azure HDInsight clusters, within your subscription(s).  Remove any unapproved Azure resources that you discover. For Azure HDInsight cluster nodes, implement a third-party solution to remove or alert on unapproved software.

How to create queries with Azure Graph:

https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.8: Use only approved applications

**Guidance**: For Azure HDInsight cluster nodes, implement a third-party solution to prevent unauthorized software from executing.


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.9: Use only approved Azure services

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

How to deny a specific resource type with Azure Policy: https://docs.microsoft.com/azure/governance/policy/samples/not-allowed-resource-types


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.10: Implement approved application list

**Guidance**: For Azure HDInsight cluster nodes, implement a third-party solution to prevent unauthorized file types from executing.


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.11: Limit users' ability to interact with Azure Resources Manager via scripts

**Guidance**: Use Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

How to configure Conditional Access to block access to Azure Resource Manager: https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.12: Limit users' ability to execute scripts within compute resources

**Guidance**: Not applicable; This is not applicable to Azure HDInsight as users (non-administrators) of the cluster do not need access to the individual nodes to run jobs. The cluster administrator has root access to all cluster nodes.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Not applicable

### 6.13: Physically or logically segregate high risk applications

**Guidance**: Not applicable; benchmark is intended for Azure Apps Service or compute resources hosting web applications.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Not applicable

## Secure Configuration

*For more information, see [Security Control: Secure Configuration](https://docs.microsoft.com/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Use Azure Policy aliases in the "Microsoft.HDInsight" namespace to create custom policies to audit or enforce the network configuration of your HDInsight cluster.

How to view available Azure Policy aliases:

https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0

How to configure and manage Azure Policy:

https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.2: Establish secure operating system configurations

**Guidance**: Azure HDInsight Operating System Images managed and maintained by Microsoft. Customer responsible for implementing secure configurations for your cluster nodes' operating system. 


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] to enforce secure settings for your Azure HDInsight clusters and related resources.

How to configure and manage Azure Policy:

https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

Understand Azure Policy Effects:

https://docs.microsoft.com/azure/governance/policy/concepts/effects

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.4: Maintain secure operating system configurations

**Guidance**: Azure HDInsight Operating System Images managed and maintained by Microsoft. Customer responsible for implementing OS-level state configuration.


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### 7.5: Securely store configuration of Azure resources

**Guidance**: If using custom Azure Policy definitions, use Azure DevOps or Azure Repos to securely store and manage your code.

How to store code in Azure DevOps:

https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops

Azure Repos Documentation:

https://docs.microsoft.com/azure/devops/repos/index?view=azure-devops

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.6: Securely store custom operating system images

**Guidance**: Not applicable; custom images not applicable to Azure HDInsight.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Not applicable

### 7.7: Deploy system configuration management tools

**Guidance**: Use Azure Policy aliases in the "Microsoft.HDInsight" namespace to create custom policies to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.

How to configure and manage Azure Policy:

https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.8: Deploy system configuration management tools for operating systems

**Guidance**: Implement a third-party solution to maintain desired state for your cluster node operating systems.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.9: Implement automated configuration monitoring for Azure services

**Guidance**: Use Azure Policy aliases in the "Microsoft.HDInsight" namespace to create custom policies to audit or enforce the  configuration of your HDInsight cluster.

How to view available Azure Policy aliases:

https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0

How to configure and manage Azure Policy:

https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.10: Implement automated configuration monitoring for operating systems

**Guidance**: Implement a third-party solution to monitor the state of your cluster node operating systems.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.11: Manage Azure secrets securely

**Guidance**: Azure HDInsight includes Bring Your Own Key (BYOK) support for Apache Kafka. This capability lets you own and manage the keys used to encrypt data at rest.

All managed disks in Azure HDInsight are protected with Azure Storage Service Encryption (SSE). By default, the data on those disks is encrypted using Microsoft-managed keys. If you enable BYOK, you provide the encryption key for Azure HDInsight to use and manage it using Azure Key Vault.

Key Vault may also be use with Azure HDInsight deployments to manage keys for cluster storage (Azure Storage Accounts, and Azure Data Lake Storage)

How to bring your own key for Apache Kafka on Azure HDInsight:

https://docs.microsoft.com/azure/hdinsight/kafka/apache-kafka-byok

How to manage encryption keys for Azure Storage Accounts:

https://docs.microsoft.com/azure/storage/common/storage-encryption-keys-portal

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.12: Manage identities securely and automatically

**Guidance**: Managed identities can be used in Azure HDInsight to allow your clusters to access Azure Active Directory domain services, access Azure Key Vault, or access files in Azure Data Lake Storage Gen2.

Understand Managed Identities with Azure HDInsight:

https://docs.microsoft.com/azure/hdinsight/hdinsight-managed-identities

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.13: Eliminate unintended credential exposure

**Guidance**: If using any code related to your Azure HDInsight deployment, you may implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault. 

How to setup Credential Scanner:

https://secdevtools.azurewebsites.net/helpcredscan.html

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Malware Defense

*For more information, see [Security Control: Malware Defense](https://docs.microsoft.com/azure/security/benchmarks/security-control-malware-defense).*

### 8.1: Use centrally managed anti-malware software

**Guidance**: Azure HDInsight comes with Clamscan pre-installed and enabled for the cluster node images, however you must manage the software and manually aggregate/monitor any logs Clamscan produces.

Understand Clamscan for Azure HDInsight:

https://docs.microsoft.com/azure/hdinsight/hdinsight-faq#security-and-certificates

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Microsoft Antimalware is enabled on the underlying host that supports Azure services, however it does not run on customer content.

Pre-scan any files being uploaded to any Azure resources related to your Azure HDInsight cluster deployment, such as Data Lake Storage, Blob Storage, etc. Microsoft cannot access customer data in these instances.

Understand Microsoft Antimalware for Azure Cloud Services and Virtual Machines:

 https://docs.microsoft.com/azure/security/fundamentals/antimalware

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### 8.3: Ensure anti-malware software and signatures are updated

**Guidance**: Azure HDInsight comes with Clamscan pre-installed and enabled for the cluster node images. Clamscan will perform engine and definition updates automatically, however, aggregation and management of logs will need to be performed manually.

Understand Clamscan for Azure Azure HDInsight:

https://docs.microsoft.com/azure/hdinsight/hdinsight-faq#security-and-certificates

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Data Recovery

*For more information, see [Security Control: Data Recovery](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure regular automated back ups

**Guidance**: When using an Azure Storage Account for the HDInsight cluster data store, choose the appropriate redundancy option (LRS,ZRS, GRS, RA-GRS).  When using an Azure SQL Database for the Azure HDInsight cluster data store, configure Active Geo-replication.

How to configure storage redundancy for Azure Storage Accounts:

https://docs.microsoft.com/azure/storage/common/storage-redundancy

How to configure redundancy for Azure SQL Databases:

https://docs.microsoft.com/azure/sql-database/sql-database-active-geo-replication

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 9.2: Perform complete system backups and backup any customer managed keys

**Guidance**: When using an Azure Storage Account for the Azure HDInsight cluster data store, choose the appropriate redundancy option (LRS,ZRS, GRS, RA-GRS). If using Azure Key Vault for any part of your Azure HDInsight deployment, ensure your keys are backed up.

Choose storage options for your Azure HDInsight cluster:

https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-compare-storage-options

How to configure storage redundancy for Azure Storage Accounts:

https://docs.microsoft.com/azure/storage/common/storage-redundancy

How to backup Key Vault keys in Azure:

https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey?view=azurermps-6.13.0

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 9.3: Validate all backups including customer managed keys

**Guidance**: If Azure Key Vault is being used with your Azure HDInsight deployment, test restoration of backed up customer managed keys.

How to bring your own key for Apache Kafka on Azure HDInsight:

https://docs.microsoft.com/azure/hdinsight/kafka/apache-kafka-byok

How to restore key vault keys in Azure:

https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultkey?view=azurermps-6.13.0

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 9.4: Ensure protection of backups and customer managed keys

**Guidance**: If Azure Key Vault is being used with your Azure HDInsight deployment, enable Soft-Delete in Key Vault to protect keys against accidental or malicious deletion.

How to enable Soft-Delete in Azure Key Vault:

https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete?tabs=azure-portal

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Incident Response

*For more information, see [Security Control: Incident Response](https://docs.microsoft.com/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create an incident response guide

**Guidance**: Ensure that there are written incident response plans that defines roles of personnel as well as phases of incident handling/management.

How to configure Workflow Automations within Azure Security Center:

https://docs.microsoft.com/azure/security-center/security-center-planning-and-operations-guide

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Security Center assigns a severity to alerts, to help you prioritize the order in which you attend to each alert, so that when a resource is compromised, you can get to it right away. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.Refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities:https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party.

How to set the Azure Security Center Security Contact:

https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts Sentinel.

How to configure continuous export:

https://docs.microsoft.com/azure/security-center/continuous-export

How to stream alerts into Azure Sentinel:

https://docs.microsoft.com/azure/sentinel/connect-azure-security-center

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.

How to configure Workflow Automation and Logic Apps:

https://docs.microsoft.com/azure/security-center/workflow-automation

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Penetration Tests and Red Team Exercises

*For more information, see [Security Control: Penetration Tests and Red Team Exercises](https://docs.microsoft.com/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings within 60 days

**Guidance**: Please follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies:

https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1.

You can find more information on Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft managed cloud infrastructure, services and applications, here:
 https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Next steps

- See the [Azure Security Benchmark](https://docs.microsoft.com/azure/security/benchmarks/overview)
- Learn more about [Azure Security Baselines](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview)
