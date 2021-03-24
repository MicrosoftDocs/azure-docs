---
title: Azure security baseline for HDInsight
description: The HDInsight security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: hdinsight
ms.topic: conceptual
ms.date: 02/17/2021
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for HDInsight

This security
baseline applies guidance from the [Azure Security Benchmark version
1.0](../security/benchmarks/overview-v1.md) to HDInsight. The Azure Security Benchmark
provides recommendations on how you can secure your cloud solutions on Azure.
The content is grouped by the **security controls** defined by the Azure
Security Benchmark and the related guidance applicable to HDInsight. **Controls** not applicable to HDInsight have been excluded.

 
To see how HDInsight completely maps to the Azure
Security Benchmark, see the [full HDInsight
security baseline mapping
file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](../security/benchmarks/security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

**Guidance**: Perimeter security in Azure HDInsight is achieved through virtual networks. An enterprise administrator can create a cluster inside a virtual network and use a network security group (NSG) to restrict access to the virtual network. Only the allowed IP addresses in the inbound Network Security Group rules will be able to communicate with the Azure HDInsight cluster. This configuration provides perimeter security. All clusters deployed in a virtual network will also have a private endpoint that resolves to a private IP address inside the Virtual Network for private HTTP access to the cluster gateways.

To reduce the risk of data loss via exfiltration, restrict outbound network traffic for Azure HDInsight clusters using Azure Firewall.

- [How to Deploy Azure HDInsight within a Virtual Network and Secure with a Network Security Group](hdinsight-create-virtual-network.md)

- [How to restrict outbound traffic for Azure HDInsight Clusters with Azure Firewall](hdinsight-restrict-outbound-traffic.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and network interfaces

**Guidance**: Use Azure Security Center and remediate network protection recommendations for the virtual network, subnet, and network security group being used to secure your Azure HDInsight cluster. Enable network security group (NSG) flow logs and send logs into an Azure Storage Account to traffic audit. You may also send NSG flow logs to an Azure Log Analytics Workspace and use Azure Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Azure Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network mis-configurations.

- [How to Enable NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to Enable and use Azure Traffic Analytics](../network-watcher/traffic-analytics.md)

- [Understand Network Security provided by Azure Security Center](../security-center/security-center-network-recommendations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.4: Deny communications with known-malicious IP addresses

**Guidance**: For protections from DDoS attacks, enable Azure DDoS Standard protection on the virtual network where your Azure HDInsight is deployed. Use Azure Security Center integrated threat intelligence to deny communications with known malicious or unused Internet IP addresses.

- [How to configure DDoS protection](/azure/virtual-network/manage-ddos-protection)

- [Understand Azure Security Center Integrated Threat Intelligence](/azure/security-center/security-center-alerts-service-layer)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.5: Record network packets

**Guidance**: Enable network security group (NSG) flow logs for the NSG attached to the subnet being used to protect your Azure HDInsight cluster. Record the NSG flow logs into an Azure Storage Account to generate flow records. If required for investigating anomalous activity, enable Azure Network Watcher packet capture.

- [How to Enable NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to enable Network Watcher](../network-watcher/network-watcher-create.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Requirement can be met Azure security control ID 1.1; Deploy Azure HDInsight cluster into a virtual network and secure with a network security group (NSG).

There are several dependencies for Azure HDInsight that require inbound traffic. The inbound management traffic can't be sent through a firewall device. The source addresses for required management traffic are known and published. Create Network Security Group rules with this information to allow traffic from only trusted locations, securing inbound traffic to the clusters.

To reduce the risk of data loss via exfiltration, restrict outbound network traffic for Azure HDInsight clusters using Azure Firewall.

- [How to Deploy HDInsight within a Virtual Network and Secure with a Network Security Group](hdinsight-create-virtual-network.md)

- [Understand HDInsight dependencies and firewall usage](hdinsight-restrict-outbound-traffic.md)

- [HDInsight management IP addresses](hdinsight-management-ip-addresses.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: Use Virtual network service tags  to define network access controls on network security groups (NSG) that are attached to the subnet your Azure HDInsight cluster is deployed in. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., ApiManagement) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

- [Understand and using Service Tags for Azure HDInsight](/azure/virtual-network/security-overview#service-tags)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement standard security configurations for network resources related to your Azure HDInsight cluster. Use Azure Policy aliases in the "Microsoft.HDInsight" and "Microsoft.Network" namespaces to create custom policies to audit or enforce the network configuration of your Azure HDInsight cluster.

You may also use Azure Blueprints to simplify large-scale Azure deployments by packaging key environment artifacts, such as Azure Resource Manager templates, Azure RBAC controls, and policies, in a single blueprint definition. Easily apply the blueprint to new subscriptions and environments, and fine-tune control and management through versioning.

- [How to view available Azure Policy aliases](/powershell/module/az.resources/get-azpolicyalias)

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to create an Azure Blueprint](../governance/blueprints/create-blueprint-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.10: Document traffic configuration rules

**Guidance**: Use Tags for network security group (NSGs) and other resources related to network security and traffic flow that are associated with your Azure HDInsight cluster. For individual NSG rules, use the "Description" field to specify business need and/or duration (etc.) for any rules that allow traffic to/from a network.

Use any of the built-in Azure Policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with Tags and to notify you of existing untagged resources.

You may use Azure PowerShell or Azure command-line interface (CLI) to look up or perform actions on resources based on their Tags.

- [How to create and use Tags](/azure/azure-resource-manager/resource-group-using-tags)

- [How to create a virtual network](../virtual-network/quick-create-portal.md)

- [How to create an NSG with a Security Config](../virtual-network/tutorial-filter-network-traffic.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Activity Log to monitor network resource configurations and 
detect changes for network resources related to your Azure HDInsight deployments. Create alerts within Azure Monitor that will trigger when 
changes to critical network resources take place.

- [How to view and retrieve Azure Activity Log events](/azure/azure-monitor/platform/activity-log-view)

- [How to create alerts in Azure Monitor](/azure/azure-monitor/platform/alerts-activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Logging and Monitoring

*For more information, see the [Azure Security Benchmark: Logging and Monitoring](../security/benchmarks/security-control-logging-monitoring.md).*

### 2.2: Configure central security log management

**Guidance**: You can onboard your Azure HDInsight cluster to Azure Monitor to aggregate security data generated by the cluster. Leverage custom queries to detect and respond to threats in the environment. 

- [How to onboard an Azure HDInsight cluster to Azure Monitor](hdinsight-hadoop-oms-log-analytics-tutorial.md)

- [How to create custom queries for an Azure HDInsight cluster](hdinsight-hadoop-oms-log-analytics-use-queries.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.3: Enable audit logging for Azure resources

**Guidance**: Enable Azure Monitor for the HDInsight cluster, direct it to a Log Analytics workspace. This will log relevant cluster information and OS metrics for all Azure HDInsight cluster nodes.

- [How to enable logging for HDInsight Cluster](hdinsight-hadoop-oms-log-analytics-tutorial.md)

- [How to query HDInsight logs](hdinsight-hadoop-oms-log-analytics-use-queries.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.4: Collect security logs from operating systems

**Guidance**: Onboard Azure HDInsight cluster to Azure Monitor. Ensure that the Log Analytics workspace used has the log retention period set according to your organization's compliance regulations.

- [How to onboard an Azure HDInsight Cluster to Azure Monitor](hdinsight-hadoop-oms-log-analytics-tutorial.md)

- [How to configure Log Analytics Workspace Retention Period](/azure/azure-monitor/platform/manage-cost-storage)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.5: Configure security log storage retention

**Guidance**: Onboard Azure HDInsight cluster to Azure Monitor. Ensure that the Azure Log Analytics workspace used has the log retention period set according to your organization's compliance regulations.

- [How to onboard an Azure HDInsight Cluster to Azure Monitor](hdinsight-hadoop-oms-log-analytics-tutorial.md)

- [How to configure Log Analytics Workspace Retention Period](/azure/azure-monitor/platform/manage-cost-storage)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.6: Monitor and review logs

**Guidance**: Use Azure Log Analytics workspace queries to query Azure HDInsight logs:

- [How to Create Custom Queries for Azure HDInsight Clusters](hdinsight-hadoop-oms-log-analytics-use-queries.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.7: Enable alerts for anomalous activities

**Guidance**: Use Azure Log Analytics workspace for monitoring and alerting on anomalous activities in security logs and events related to your Azure HDInsight cluster.

- [How to manage alerts in Azure Security Center](../security-center/security-center-managing-and-responding-alerts.md)

- [How to alert on log analytics log data](/azure/azure-monitor/learn/tutorial-response)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.8: Centralize anti-malware logging

**Guidance**: Azure HDInsight comes with Clamscan pre-installed and enabled for the cluster node images, however you must manage the software and manually aggregate/monitor any logs Clamscan produces.

- [Understand Clamscan](https://docs.microsoft.com/azure/hdinsight/hdinsight-faq#security-and-certificates)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.9: Enable DNS query logging

**Guidance**: Implement third-party solution for DNS logging.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.10: Enable command-line audit logging

**Guidance**: Manually configure console logging on a per-node basis.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Maintain record of the local administrative account that is created during cluster provisioning of Azure HDInsight cluster as well as any other accounts you create. In addition, if Azure Active Directory (Azure AD) integration is used, Azure AD has built-in roles that must be explicitly assigned and are therefore queryable. Use the Azure AD PowerShell module to perform adhoc queries to discover accounts that are members of administrative groups.

In addition, you may use Azure Security Center Identity and Access Management recommendations.

- [How to get a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrole)

- [How to get members of a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrolemember)

- [How to monitor identity and access with Azure Security Center](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.2: Change default passwords where applicable

**Guidance**: When provisioning a cluster, Azure requires you to create new passwords for the web portal and Secure Shell (SSH) access. There are no default passwords to change, however you can specify different passwords for SSH and web portal access.

- [How to set passwords when provisioning an Azure HDInsight cluster](hdinsight-hadoop-linux-use-ssh-unix.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.3: Use dedicated administrative accounts

**Guidance**: Integrate Authentication for Azure HDInsight cluster with Azure Active Directory (Azure AD). Create policies and procedures around the use of dedicated administrative accounts.

In addition, you may use Azure Security Center Identity and Access Management recommendations.

- [How to integrate Azure HDInsight authentication with Azure AD](domain-joined/apache-domain-joined-configure-using-azure-adds.md)

- [How to monitor identity and access with Azure Security Center](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.4: Use Azure Active Directory single sign-on (SSO)

**Guidance**: Use Azure HDInsight ID Broker to sign in to Enterprise Security Package (ESP) clusters by using multifactor authentication, without providing any passwords. If you've already signed in to other Azure services, such as the Azure portal, you can sign in to your Azure HDInsight cluster with a single sign-on (SSO) experience.

- [How to enable Azure HDInsight ID Broker](https://docs.microsoft.com/azure/hdinsight/domain-joined/identity-broker#enable-hdinsight-id-broker)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.5: Use multi-factor authentication for all Azure Active Directory-based access

**Guidance**: Enable Azure Active Directory (Azure AD) multifactor authentication and follow Azure Security Center Identity and Access Management recommendations. Azure HDInsight clusters with the Enterprise Security Package configured can be connected to a domain so that domain users can use their domain credentials to authenticate with the clusters and run big data jobs. When authenticating with multifactor authentication enabled, users will be challenged to provide a second authentication factor.

- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

- [How to monitor identity and access within Azure Security Center](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

**Guidance**: Use PAWs (privileged access workstations) with multifactor authentication configured to log into and configure your Azure HDInsight clusters and related resources.

- [Learn about Privileged Access Workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/)

- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.7: Log and alert on suspicious activities from administrative accounts

**Guidance**: Azure HDInsight clusters with the Enterprise Security Package configured can be connected to a domain so that domain users can use their domain credentials to authenticate. You may use Azure Active Directory (Azure AD) security reports for generation of logs and alerts when suspicious or unsafe activity occurs in the Azure AD environment. Use Azure Security Center to monitor identity and access activity.

- [How to identify Azure AD users flagged for risky activity](/azure/active-directory/reports-monitoring/concept-user-at-risk)

- [How to monitor users identity and access activity in Azure Security Center](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.8: Manage Azure resources from only approved locations

**Guidance**: Azure HDInsight clusters with the Enterprise Security Package configured can be connected to a domain so that domain users can use their domain credentials to authenticate. Use Conditional Access Named Locations to allow access from only specific logical groupings of IP address ranges or countries/regions.

- [How to configure Named Locations in Azure](../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.

Azure HDInsight clusters with Enterprise Security Package (ESP) configured can be connected to a domain so that domain users can use their domain credentials to authenticate with the clusters.

- [How to create and configure an Azure AD instance](../active-directory/fundamentals/active-directory-access-create-new-tenant.md)

- [How to configure Enterprise Security Package with Azure AD Domain Services in Azure HDInsight](domain-joined/apache-domain-joined-configure-using-azure-adds.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.10: Regularly review and reconcile user access

**Guidance**: Use Azure Active Directory (Azure AD) authentication with your Azure HDInsight cluster. Azure AD provides logs to help discover stale accounts. In addition, use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User's access can be reviewed on a regular basis to make sure only the right Users have continued access.

- [How to use Azure Identity Access Reviews](../active-directory/governance/access-reviews-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.11: Monitor attempts to access deactivated credentials

**Guidance**: Use Azure Active Directory (Azure AD) Sign-in and Audit logs to monitor for attempts to access deactivated accounts; these logs can be integrated into any third-party SIEM/monitoring tool.

You can streamline this process by creating Diagnostic Settings for Azure AD user accounts, sending the audit logs and sign-in logs to an Azure Log Analytics workspace. Configure desired Alerts within Azure Log Analytics workspace.

- [How to integrate Azure Activity Logs into Azure Monitor](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.12: Alert on account sign-in behavior deviation

**Guidance**: Azure HDInsight clusters with Enterprise Security Package (ESP) configured can be connected to a domain so that domain users can use their domain credentials to authenticate with the clusters. Use Azure Active Directory (Azure AD) Risk Detections and Identity Protection feature to configure automated responses to detected suspicious actions related to user identities. Additionally, you can ingest data into Azure Sentinel for further investigation.

- [How to view Azure AD risky sign-ins](/azure/active-directory/reports-monitoring/concept-risky-sign-ins)

- [How to configure and enable Identity Protection risk policies](../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

**Guidance**: Not available; Customer Lockbox not yet supported for Azure HDInsight.

- [List of Customer Lockbox supported services](https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview#supported-services-and-scenarios-in-general-availability)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](../security/benchmarks/security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags on resources related to your Azure HDInsight  deployments to assist in tracking Azure resources that store or process sensitive information.

- [How to create and use tags](/azure/azure-resource-manager/resource-group-using-tags)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. Azure HDInsight clusters and any associated storage accounts should be separated by virtual network/subnet, tagged appropriately, and secured within a network security group (NSG) or Azure Firewall. Cluster data should be contained within a secured Azure Storage Account or Azure Data Lake Storage (Gen1 or Gen2).

- [Choose storage options for your Azure HDInsight cluster](hdinsight-hadoop-compare-storage-options.md)

- [How to secure Azure Data Lake Storage](../data-lake-store/data-lake-store-security-overview.md)

- [How to secure Azure Storage Accounts](/azure/storage/common/storage-security-guide)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: For Azure HDInsight clusters storing or processing sensitive information, mark the cluster and related resources as sensitive using tags. To reduce the risk of data loss via exfiltration, restrict outbound network traffic for Azure HDInsight clusters using Azure Firewall.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [How to restrict outbound traffic for Azure HDInsight Clusters with Azure Firewall](hdinsight-restrict-outbound-traffic.md)

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.4: Encrypt all sensitive information in transit

**Guidance**: Encrypt all sensitive information in transit. Ensure that any clients connecting to your Azure HDInsight cluster or cluster data stores (Azure Storage Accounts or Azure Data Lake Storage Gen1/Gen2) are able to negotiate TLS 1.2 or greater. Microsoft Azure resources will negotiate TLS 1.2 by default. 

- [Understand Azure Data Lake Storage encryption in transit](../data-lake-store/data-lake-store-security-overview.md)

- [Understand Azure Storage Account encryption in transit](../storage/blobs/security-recommendations.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Data identification, classification, and loss prevention features are not yet available for Azure Storage or compute resources. Implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.6: Use Azure RBAC to control access to resources 

**Guidance**: With Azure HDInsight Enterprise Security Package (ESP), you can use Apache Ranger to create and manage fine-grained access control and data obfuscation policies for your data stored in files, folders, databases, tables and rows/columns. The hadoop admin can configure role-based access control (RBAC) to secure Apache Hive, HBase, Kafka and Spark using those plugins in Apache Ranger.

Configuring RBAC policies with Apache Ranger allows you to associate permissions with a role in the organization. This layer of abstraction makes it easier to ensure that people have only the permissions needed to perform their work responsibilities.

- [Enterprise Security Package configurations with Azure Active Directory (Azure AD) Domain Services in HDInsight](domain-joined/apache-domain-joined-configure-using-azure-adds.md)

- [Overview of enterprise security in Azure HDInsight](domain-joined/hdinsight-security-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.7: Use host-based data loss prevention to enforce access control

**Guidance**: For Azure HDInsight clusters storing or processing sensitive information, mark the cluster and related resources as sensitive using tags. Data identification, classification, and loss prevention features are not yet available for Azure Storage or compute resources. Implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.8: Encrypt sensitive information at rest

**Guidance**: If using Azure SQL Database to store Apache Hive and Apache Oozie metadata, ensure SQL data remains encrypted at all times. For Azure Storage Accounts and Data Lake Storage (Gen1 or Gen2), it is recommended to allow Microsoft to manage your encryption keys, however, you have the option to manage your own keys.

- [How to manage encryption keys for Azure Storage Accounts](/azure/storage/common/storage-encryption-keys-portal)

- [How to create Azure Data Lake Storage using customer-managed encryption keys](../data-lake-store/data-lake-store-get-started-portal.md)

- [Understand encryption for Azure SQL Database](/azure/sql-database/sql-database-technical-overview#data-encryption)

- [How to configure Transparent Data Encryption for SQL Database using customer-managed keys](https://docs.microsoft.com/azure/sql-database/transparent-data-encryption-azure-sql?tabs=azure-portal)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Configure Diagnostic Settings for Azure Storage Accounts associated with Azure HDInsight clusters to monitor and log all CRUD operations against cluster data. Enable Auditing for any Storage Accounts or Data Lake Stores associated with the Azure HDInsight cluster.

- [How to enable additional logging/auditing for an Azure Storage Account](/azure/storage/common/storage-monitor-storage-account)

- [How to enable additional logging/auditing for Azure Data Lake Storage](../data-lake-analytics/data-lake-analytics-diagnostic-logs.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Vulnerability Management

*For more information, see the [Azure Security Benchmark: Vulnerability Management](../security/benchmarks/security-control-vulnerability-management.md).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: Implement a third-party vulnerability management solution.

Optionally, if you have a Rapid7, Qualys, or any other vulnerability management platform subscription, you may use script actions to install vulnerability assessment agents on your Azure HDInsight cluster nodes and manage the nodes through the respective portal.

- [How to Install Rapid7 Agent Manually](https://insightvm.help.rapid7.com/docs/install)

- [How to install Qualys Agent Manually](https://www.qualys.com/docs/qualys-cloud-agent-linux-install-guide.pdf)

- [How to use script actions](hdinsight-hadoop-customize-cluster-linux.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.2: Deploy automated operating system patch management solution

**Guidance**: Automatic system updates have been enabled for cluster node images, however you must periodically reboot cluster nodes to ensure updates are applied.

Microsoft to maintain and update base Azure HDInsight node images.

- [How to configure the OS patching schedule for HDInsight clusters](hdinsight-os-patching.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 5.3: Deploy automated patch management solution for third-party software titles

**Guidance**: Use script actions or other mechanisms to patch your Azure HDInsight clusters. Newly created clusters will always have the latest available updates, including the most recent security patches.

- [How to configure the OS patching schedule for Linux-based Azure HDInsight clusters](hdinsight-os-patching.md)

- [How to use script actions](hdinsight-hadoop-customize-cluster-linux.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.4: Compare back-to-back vulnerability scans

**Guidance**: Implement a third-party vulnerability management solution which has the ability to compare vulnerability scans over time. If you have a Rapid7 or Qualys subscription, you may use that vendor's portal to view and compare back-to-back vulnerability scans.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

**Guidance**: Use a common risk scoring program (e.g. Common Vulnerability Scoring System) or the default risk ratings provided by your third-party scanning tool.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Inventory and Asset Management

*For more information, see the [Azure Security Benchmark: Inventory and Asset Management](../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

**Guidance**: Use Azure Resource Graph to query for and discover all resources (such as compute, storage, network, ports, and protocols etc.), including Azure HDInsight clusters, within your subscriptions. Ensure you have appropriate (read) permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Azure Resource Graph, it is highly recommended to create and use Azure Resource Manager resources going forward.

- [How to create queries with Azure Resource Graph](../governance/resource-graph/first-query-portal.md)

- [How to view your Azure Subscriptions](/powershell/module/az.accounts/get-azsubscription)

- [Understand Azure RBAC](../role-based-access-control/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

- [How to create and use tags](/azure/azure-resource-manager/resource-group-using-tags)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track assets. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

- [How to create additional Azure subscriptions](/azure/billing/billing-create-subscription)

- [How to create Management Groups](/azure/governance/management-groups/create)

- [How to create and use tags](/azure/azure-resource-manager/resource-group-using-tags)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.4: Define and maintain inventory of approved Azure resources

**Guidance**: Define list of approved Azure resources and approved software for your compute resources

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

Use Azure Resource Graph to query for and discover resources within your subscriptions. Ensure that all Azure resources present in the environment are approved.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to create queries with Azure Resource Graph](../governance/resource-graph/first-query-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.6: Monitor for unapproved software applications within compute resources

**Guidance**: Implement a third-party solution to monitor cluster nodes for unapproved software applications.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.7: Remove unapproved Azure resources and software applications

**Guidance**: Use Azure Resource Graph to query for and discover all resources (such as compute, storage, network, ports, and protocols etc.), including Azure HDInsight clusters, within your subscriptions.  Remove any unapproved Azure resources that you discover. For Azure HDInsight cluster nodes, implement a third-party solution to remove or alert on unapproved software.

- [How to create queries with Azure Resource Graph](../governance/resource-graph/first-query-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.8: Use only approved applications

**Guidance**: For Azure HDInsight cluster nodes, implement a third-party solution to prevent unauthorized software from executing.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.9: Use only approved Azure services

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:
- Not allowed resource types

- Allowed resource types

For more information, see the following references:

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to deny a specific resource type with Azure Policy](https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies#general)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.10: Maintain an inventory of approved software titles

**Guidance**: For Azure HDInsight cluster nodes, implement a third-party solution to prevent unauthorized file types from executing.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.11: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Use Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resource Manager](../role-based-access-control/conditional-access-azure-management.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Secure Configuration

*For more information, see the [Azure Security Benchmark: Secure Configuration](../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Use Azure Policy aliases in the "Microsoft.HDInsight" namespace to create custom policies to audit or enforce the network configuration of your HDInsight cluster.

- [How to view available Azure Policy aliases](/powershell/module/az.resources/get-azpolicyalias)

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.2: Establish secure operating system configurations

**Guidance**: Azure HDInsight Operating System Images managed and maintained by Microsoft. Customer responsible for implementing secure configurations for your cluster nodes' operating system.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] to enforce secure settings for your Azure HDInsight clusters and related resources.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Understand Azure Policy Effects](../governance/policy/concepts/effects.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.4: Maintain secure operating system configurations

**Guidance**: Azure HDInsight Operating System Images managed and maintained by Microsoft. Customer responsible for implementing OS-level state configuration.

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 7.5: Securely store configuration of Azure resources

**Guidance**: If using custom Azure Policy definitions, use Azure DevOps or Azure Repos to securely store and manage your code.

- [Azure Repos Git tutorial](/azure/devops/repos/git/gitworkflow)

- [Azure Repos Documentation](/azure/devops/repos/index)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Use Azure Policy aliases in the "Microsoft.HDInsight" namespace to create custom policies to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.8: Deploy configuration management tools for operating systems

**Guidance**: Implement a third-party solution to maintain desired state for your cluster node operating systems.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Use Azure Policy aliases in the "Microsoft.HDInsight" namespace to create custom policies to audit or enforce the configuration of your HDInsight cluster.

- [How to view available Azure Policy aliases](/powershell/module/az.resources/get-azpolicyalias)

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.10: Implement automated configuration monitoring for operating systems

**Guidance**: Implement a third-party solution to monitor the state of your cluster node operating systems.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.11: Manage Azure secrets securely

**Guidance**: Azure HDInsight includes Bring Your Own Key (BYOK) support for Apache Kafka. This capability lets you own and manage the keys used to encrypt data at rest.

All managed disks in Azure HDInsight are protected with Azure Storage Service Encryption (SSE). By default, the data on those disks is encrypted using Microsoft-managed keys. If you enable BYOK, you provide the encryption key for Azure HDInsight to use and manage it using Azure Key Vault.

Key Vault may also be use with Azure HDInsight deployments to manage keys for cluster storage (Azure Storage Accounts, and Azure Data Lake Storage)

- [How to bring your own key for Apache Kafka on Azure HDInsight](/azure/hdinsight/kafka/apache-kafka-byok)

- [How to manage encryption keys for Azure Storage Accounts](/azure/storage/common/storage-encryption-keys-portal)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.12: Manage identities securely and automatically

**Guidance**: Managed identities can be used in Azure HDInsight to allow your clusters to access Azure Active Directory (Azure AD) domain services, access Azure Key Vault, or access files in Azure Data Lake Storage Gen2.

- [Understand Managed Identities with Azure HDInsight](hdinsight-managed-identities.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.13: Eliminate unintended credential exposure

**Guidance**: If using any code related to your Azure HDInsight deployment, you may implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault. 

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Malware Defense

*For more information, see the [Azure Security Benchmark: Malware Defense](../security/benchmarks/security-control-malware-defense.md).*

### 8.1: Use centrally-managed anti-malware software

**Guidance**: Azure HDInsight comes with Clamscan pre-installed and enabled for the cluster node images, however you must manage the software and manually aggregate/monitor any logs Clamscan produces.

- [Understand Clamscan for Azure HDInsight](https://docs.microsoft.com/azure/hdinsight/hdinsight-faq#security-and-certificates)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Microsoft Antimalware is enabled on the underlying host that supports Azure services, however it does not run on customer content.

Pre-scan any files being uploaded to any Azure resources related to your Azure HDInsight cluster deployment, such as Data Lake Storage, Blob Storage, etc. Microsoft cannot access customer data in these instances.

- [Understand Microsoft Antimalware for Azure Cloud Services and Virtual Machines](../security/fundamentals/antimalware.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 8.3: Ensure anti-malware software and signatures are updated

**Guidance**: Azure HDInsight comes with Clamscan pre-installed and enabled for the cluster node images. Clamscan will perform engine and definition updates automatically, however, aggregation and management of logs will need to be performed manually.

- [Understand Clamscan for Azure Azure HDInsight](https://docs.microsoft.com/azure/hdinsight/hdinsight-faq#security-and-certificates)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Recovery

*For more information, see the [Azure Security Benchmark: Data Recovery](../security/benchmarks/security-control-data-recovery.md).*

### 9.1: Ensure regular automated back-ups

**Guidance**: When using an Azure Storage Account for the HDInsight cluster data store, choose the appropriate redundancy option (LRS, ZRS, GRS, RA-GRS).  When using an Azure SQL Database for the Azure HDInsight cluster data store, configure Active Geo-replication.

- [How to configure storage redundancy for Azure Storage Accounts](../storage/common/storage-redundancy.md)

- [How to configure redundancy for Azure SQL Database](/azure/sql-database/sql-database-active-geo-replication)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.2: Perform complete system backups and backup any customer-managed keys

**Guidance**: When using an Azure Storage Account for the Azure HDInsight cluster data store, choose the appropriate redundancy option (LRS, ZRS, GRS, RA-GRS). If using Azure Key Vault for any part of your Azure HDInsight deployment, ensure your keys are backed up.

- [Choose storage options for your Azure HDInsight cluster](hdinsight-hadoop-compare-storage-options.md)

- [How to configure storage redundancy for Azure Storage Accounts](../storage/common/storage-redundancy.md)

- [How to backup Key Vault keys in Azure](/powershell/module/az.keyvault/backup-azkeyvaultkey)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.3: Validate all backups including customer-managed keys

**Guidance**: If Azure Key Vault is being used with your Azure HDInsight deployment, test restoration of backed up customer-managed keys.

- [How to bring your own key for Apache Kafka on Azure HDInsight](/azure/hdinsight/kafka/apache-kafka-byok)

- [How to restore key vault keys in Azure](/powershell/module/az.keyvault/restore-azkeyvaultkey)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.4: Ensure protection of backups and customer-managed keys

**Guidance**: If Azure Key Vault is being used with your Azure HDInsight deployment, enable soft delete in Key Vault to protect keys against accidental or malicious deletion.

- [How to enable soft delete Azure Key Vault](/azure/key-vault/key-vault-ovw-soft-delete)

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

**Guidance**: Security Center assigns a severity to alerts, to help you prioritize the order in which you attend to each alert, so that when a resource is compromised, you can get to it right away. The severity is based on how confident Security Center is in the finding or the analytics used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems' incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

- [Refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party.

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
