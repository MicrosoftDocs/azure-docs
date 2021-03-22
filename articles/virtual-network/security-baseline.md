---
title: Azure security baseline for Virtual Network
description: The Virtual Network security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: virtual-network
ms.topic: conceptual
ms.date: 01/01/2000
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Virtual Network

This security baseline applies guidance from the [Azure Security Benchmark version 1.0](../security/benchmarks/overview-v1.md) to Azure Virtual Network. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Virtual Network. **Controls** not applicable to Azure Virtual Network, or for which the responsibility is Microsoft's, have been excluded.

To see how Azure Virtual Network completely maps to the Azure Security Benchmark, see the [full Azure Virtual Network security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](../security/benchmarks/security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9765).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Azure Virtual Network as it is a core Azure offering and the fundamental building block for a private network in Azure.

An Azure Virtual Network cannot be deployed into another virtual network to secure it, all of the underlying infrastructure and networking for the Azure Virtual Network offering is fully managed by Microsoft.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Network**:

[!INCLUDE [Resource Policy for Microsoft.Network 1.1](../../includes/policy/standards/asb/rp-controls/microsoft.network-1-1.md)]

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and network interfaces

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9766).

**Guidance**: Use Security Center and follow network protection recommendations to help secure your network resources in Azure. 

Send network security group flow logs to a Log Analytics Workspace and use Traffic Analytics to provide insights into traffic flow into your Azure cloud. Traffic Analytics offers the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations. 

Use Azure Monitor logs to provide insights into your environment. A workspace should be used to collate and analyze the data, and can integrate with other Azure services such as Application Insights and Security Center. 

Choose resource logs to send to an Azure storage account or an event hub. A different platform can also be used to analyze the logs. 

- [How to Enable NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to Enable and use Traffic Analytics](../network-watcher/traffic-analytics.md)

- [Understand Network Security provided by Security Center](../security-center/security-center-network-recommendations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Network**:

[!INCLUDE [Resource Policy for Microsoft.Network 1.2](../../includes/policy/standards/asb/rp-controls/microsoft.network-1-2.md)]

### 1.3: Protect critical web applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9767).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Azure Virtual Network. This recommendation is intended for web applications running on Azure App Service or compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 1.4: Deny communications with known-malicious IP addresses

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9768).

**Guidance**: Enable distributed denial of service (DDoS) Standard protection on your Azure Virtual Network to guard against DDoS attacks.

Deploy Azure Firewall at each of the organization's network boundaries with threat intelligence-based filtering enabled and configured to "Alert and deny" for malicious network traffic.

Use Security Center's threat protection features to detect communications with known malicious IP addresses.

Apply Security Center's Adaptive Network Hardening recommendations for network security group configurations that limit ports and source IPs based on actual traffic and threat intelligence. 

- [Manage Azure DDoS Protection Standard using the Azure portal](../ddos-protection/manage-ddos-protection.md)

- [Azure Firewall threat intelligence-based filtering](../firewall/threat-intel.md)

- [Threat protection in Security Center](../security-center/azure-defender.md)

- [Adaptive Network Hardening in Azure Security Center](../security-center/security-center-adaptive-network-hardening.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Network**:

[!INCLUDE [Resource Policy for Microsoft.Network 1.4](../../includes/policy/standards/asb/rp-controls/microsoft.network-1-4.md)]

### 1.5: Record network packets

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9769).

**Guidance**: Use VPN Gateway's packet capture in addition to commonly available packet capture tools to record network packets. 

You can also review agent based or NVA solutions that provide Terminal Access Point (TAP) or Network Visibility functionality through Packet Broker partner solutions available in Azure Marketplace Offerings.

- [Configure packet captures for VPN gateways](../vpn-gateway/packet-capture.md) 

- [Network Virtual Appliance Partner](https://azure.microsoft.com/solutions/network-appliances)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Network**:

[!INCLUDE [Resource Policy for Microsoft.Network 1.5](../../includes/policy/standards/asb/rp-controls/microsoft.network-1-5.md)]

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9770).

**Guidance**: Use an Azure Firewall deployed on your virtual network with Threat Intelligence enabled. Use Azure Firewall Threat intelligence-based filtering to alert or to deny traffic to and from known malicious IP addresses and domains. The IP addresses and domains are sourced from the Microsoft Threat Intelligence feed. 

You can also select an appropriate offer from the Azure Marketplace that supports IDS/IPS functionality with payload inspection capabilities.

Deploy the firewall solution of your choice at each of your organization's network boundaries to detect and/or deny malicious traffic.

- [How to deploy Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md)

- [How to configure alerts with Azure Firewall](../firewall/threat-intel.md)

- [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/?term=Firewall)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.7: Manage traffic to web applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9771).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Azure Virtual Network. This recommendation is intended for web applications running on Azure App Service or compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 1.8: Minimize complexity and administrative overhead of network security rules

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9772).

**Guidance**: Use Virtual Network service tags to define network access controls on network security groups or Azure Firewall. Service tags can be used in place of specific IP addresses when creating security rules. 
Allow or deny the traffic for the corresponding service by specifying the service tag name (for example, ApiManagement) in the appropriate source or destination field of a rule. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

Use Application Security Groups to help simplify complex security configuration. Application security groups allow you to configure network security as a natural extension of an application's structure. This enables you to group virtual machines and define network security policies based on those groups.

- [Understand and use Service tags](service-tags-overview.md)

- [Understand and use Application Security Groups](https://docs.microsoft.com/azure/virtual-network/network-security-groups-overview#application-security-groups)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.9: Maintain standard security configurations for network devices

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9773).

**Guidance**: Define and implement standard security configurations for network resources with Azure Policy and review the built-in network policy definitions for implementation.

Refer to the default policy for Security Center which contains available security recommendations related to your virtual networks.

Use Azure Blueprints to simplify large-scale Azure deployments by packaging key environment artifacts, such as Azure Resource Manager templates, role-based access control (Azure RBAC) assignments, and policies, in a single blueprint definition. Azure Blueprint can be applied to new subscriptions for fine-tuned control and management through versioning. 

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Azure Policy samples for networking](https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies#network) 

- [How to create an Azure Blueprint](../governance/blueprints/create-blueprint-portal.md)

- [Enable monitoring in Azure Security Center](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Security%20Center/AzureSecurityCenter.json)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.10: Document traffic configuration rules

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9774).

**Guidance**: Use tags for network security groups and other resources related to network security and traffic flow. Use the "Description" field to specify business need, duration, and other information for any rules that allow traffic to/from a network for individual network security group rules.
Use any of the built-in Azure Policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with tags and to notify you of existing untagged resources.

Choose Azure PowerShell or Azure CLI to look up or perform actions on resources based on their tags.

- [How to create and use Tags](../azure-resource-manager/management/tag-resources.md)

- [How to create a Virtual Network](quick-create-portal.md)

- [How to create an NSG with a Security Config](tutorial-filter-network-traffic.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.11: Use automated tools to monitor network resource configurations and detect changes

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9775).

**Guidance**: Use Azure Activity Log to monitor resource configurations and detect changes to your virtual network. Create alerts within Azure Monitor which will trigger when changes to critical resources take place.

- [How to view and retrieve Azure Activity Log events](/azure/azure-monitor/platform/activity-log#view-the-activity-log)

- [How to create alerts in Azure Monitor](/azure/azure-monitor/platform/alerts-activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Logging and Monitoring

*For more information, see the [Azure Security Benchmark: Logging and Monitoring](../security/benchmarks/security-control-logging-monitoring.md).*

### 2.1: Use approved time synchronization sources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9776).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Microsoft maintains time sources for Azure resources like Azure Virtual Network.

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

### 2.2: Configure central security log management

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9777).

**Guidance**: Enable Azure Monitor for access to your audit and activity logs which includes event source, date, user, timestamp, source addresses, destination addresses, and other useful elements. 

In Azure Monitor, use Log Analytics Workspaces to query and perform analytics, and use Azure Storage Accounts for long-term/archival storage.
Alternatively, you may enable and on-board data to Azure Sentinel or a third-party SIEM. 

- [How to collect platform logs and metrics with Azure Monitor](/azure/azure-monitor/platform/diagnostic-settings) 

- [View and retrieve Azure Activity log events](/azure/azure-monitor/platform/activity-log#view-the-activity-log)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.3: Enable audit logging for Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9778).

**Guidance**: Enable Azure Monitor for access to your audit and activity logs which includes event source, date, user, timestamp, source addresses, destination addresses, and other useful elements.

- [How to collect platform logs and metrics with Azure Monitor](/azure/azure-monitor/platform/diagnostic-settings) 

- [View and retrieve Azure Activity log events](/azure/azure-monitor/platform/activity-log#view-the-activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.4: Collect security logs from operating systems

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9779).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Azure Virtual Network. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 2.5: Configure security log storage retention

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9780).

**Guidance**: Within Azure Monitor, set your Log Analytics Workspace retention period
according to your organization's compliance regulations. Use Azure Storage accounts for long-term/archival storage of security log storage retention.

- [Change the data retention period in Log Analytics](/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period)

- [How to configure retention policy for Azure Storage account logs](/azure/storage/common/storage-monitor-storage-account#configure-logging)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.6: Monitor and review logs

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9781).

**Guidance**: Analyze and monitor logs for anomalous behavior and regularly review results. Use Azure Monitor's Log Analytics Workspace to query and perform analytics, and use Azure Storage Accounts for long-term/archival storage. 

Alternatively, you may enable and on-board data to Azure Sentinel or a third-party SIEM. 

- [Understand Log Analytics Workspace](/azure/azure-monitor/log-query/log-analytics-tutorial)

- [How to perform custom queries in Azure Monitor](/azure/azure-monitor/log-query/get-started-queries)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

- [How to get started with Azure Monitor and third-party SIEM integration](https://azure.microsoft.com/blog/use-azure-monitor-to-integrate-with-siem-tools/)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.7: Enable alerts for anomalous activities

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9782).

**Guidance**: Use Security Center with Log Analytics Workspace for monitoring and alerting on anomalous activity found in security logs and events.

Alternatively, you may enable and onboard data to Azure Sentinel or a third-party SIEM for alerting.

- [How to manage alerts in Security Center](../security-center/security-center-managing-and-responding-alerts.md)

- [How to alert on log analytics log data](/azure/azure-monitor/learn/tutorial-response)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.8: Centralize anti-malware logging

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9783).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Azure Virtual Network. It does not process or produce anti-malware related logs.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 2.9: Enable DNS query logging

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9784).

**Guidance**: Implement a third-party solution from Azure Marketplace for DNS logging solution as per your organizational need.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.10: Enable command-line audit logging

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9785).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Azure Virtual Network. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9786).

**Guidance**: Use Azure Active Directory (Azure AD) built-in administrator roles that can be explicitly assigned and are queryable.

Use the Azure AD PowerShell module to perform ad hoc queries to discover accounts that are members of administrative groups.

- [How to get a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0&amp;preserve-view=true)

- [How to get members of a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0&amp;preserve-view=true)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.2: Change default passwords where applicable

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9787).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Azure Virtual Network does not have the concept of default passwords. Customers are responsible for third party applications and marketplace services which may be using default passwords.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 3.3: Use dedicated administrative accounts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9788).

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts. Use Security Center's Identity and Access Management to monitor the number of administrative accounts.

Enable Just-In-Time / Just-Enough-Access by using Azure Active Directory (Azure AD) Privileged Identity Management Privileged Roles for Microsoft Services and Azure Resource Manager.

- [Learn more about Privileged Identity Management](/azure/active-directory/privileged-identity-management/)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.4: Use Azure Active Directory single sign-on (SSO)

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9789).

**Guidance**: Use SSO with Azure Active Directory (Azure AD) rather than configuring individual stand-alone credentials per-service. Use Security Center's Identity and Access Management recommendations.

- [Single sign-on to applications in Azure AD](../active-directory/manage-apps/what-is-single-sign-on.md)

- [How to monitor identity and access within Azure Security Center](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.5: Use multi-factor authentication for all Azure Active Directory-based access

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9790).

**Guidance**: Enable Azure Active Directory (Azure AD) multifactor authentication and follow Security Center's Identity and Access Management recommendations.

- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md) 

- [How to monitor identity and access within Azure Security Center](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.6: Use secure, Azure-managed workstations for administrative tasks

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9791).

**Guidance**: Use Privileged Access Workstations (PAW) with multifactor authentication configured to log into and access Azure network resources. 

- [Learn about Privileged Access Workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/)

- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.7: Log and alert on suspicious activities from administrative accounts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9792).

**Guidance**: Utilize Azure Active Directory (Azure AD) Risk Detections to view alerts and reports on risky user behavior. 

Ingest Security Center Risk Detection alerts into Azure Monitor and configure custom alerting/notifications using Action Groups.

- [Understanding Security Center risk detections (suspicious activity)](../active-directory/identity-protection/overview-identity-protection.md)

- [How to integrate Azure Activity Logs into Azure Monitor](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md) 

- [How to configure action groups for custom alerting and notification](/azure/azure-monitor/platform/action-groups)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.8: Manage Azure resources from only approved locations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9793).

**Guidance**: Use Conditional Access named locations to allow access from only specific logical groupings of IP address ranges or countries/regions.

- [How to configure named locations in Azure](../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.9: Use Azure Active Directory

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9794).

**Guidance**: Use Azure Active Directory (Azure AD) as a central authentication and authorization system for your services. Azure AD protects data by using strong encryption for data at rest and in transit and also salts, hashes, and securely stores user credentials.  

- [How to create and configure an Azure AD instance](../active-directory-domain-services/tutorial-create-instance.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.10: Regularly review and reconcile user access

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9795).

**Guidance**: Use Azure Active Directory (Azure AD) to provide logs to help discover stale accounts. 

Azure Identity Access Reviews can be performed to efficiently manage group memberships, access to enterprise applications, and role assignments. User access should be reviewed on a regular basis to make sure only the active users have continued access.

- [Understand Azure AD reporting](/azure/active-directory/reports-monitoring/)

- [How to use Azure Identity Access Reviews](../active-directory/governance/access-reviews-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.11: Monitor attempts to access deactivated credentials

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9796).

**Guidance**: Integrate Azure Active Directory (Azure AD) Sign-in Activity, Audit and Risk Event log sources, with any SIEM or Monitoring tool based on your access.

Streamline this process by creating Diagnostic Settings for Azure AD user accounts and sending the audit logs and sign-in logs to a Log Analytics Workspace. Any desired alerts can be configured within Log Analytics Workspace.

- [How to integrate Azure Activity Logs into Azure Monitor](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.12: Alert on account sign-in behavior deviation

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9797).

**Guidance**: Use Azure Active Directory (Azure AD)'s Risk and Identity Protection features to configure automated responses to detected suspicious actions related to user identities for your Virtual network. Ingest data into Azure Sentinel for any further investigations.

- [How to view Azure AD risky sign-ins](../active-directory/identity-protection/overview-identity-protection.md)

- [How to configure and enable Identity Protection risk policies](../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9798).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Azure Virtual Network as Customer Lockbox is not supported.

- [Supported services and scenarios in general availability](https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview#supported-services-and-scenarios-in-general-availability)

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](../security/benchmarks/security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive Information

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9799).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Use tags to assist in tracking Azure virtual networks which may contain Azure resources which store or process sensitive information.

- [How to create and use tags](/azure/azure-resource-manager/resource-group-using-tags)

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 4.2: Isolate systems storing or processing sensitive information

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9800).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Implement isolation using separate subscriptions and management groups for individual security domains such as environment type and data sensitivity level. 

Separate resources by subnets, tagged appropriately, and secured within an network security group or Azure Firewall.   

Manage access to Azure resources via Azure role-based access control (Azure RBAC). This allows you to restrict the level of access to your Azure resources that your applications and enterprise environments demand.

Implement separate subscriptions and/or management groups for development, test, and production.

- [How to create additional Azure subscriptions](/azure/billing/billing-create-subscription) 

- [How to create Management Groups](/azure/governance/management-groups/create) 

- [How to create and utilize Tags](/azure/azure-resource-manager/resource-group-using-tags) 

- [How to create a Virtual Network](quick-create-portal.md) 

- [How to create an NSG with a Security Config](tutorial-filter-network-traffic.md) 

- [How to deploy Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md)

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 4.3: Monitor and block unauthorized transfer of sensitive information

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9801).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Microsoft manages the underlying infrastructure for Azure Virtual Network and has implemented strict controls to prevent the loss or exposure of customer data. Microsoft treats all customer content as sensitive and guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 4.4: Encrypt all sensitive information in transit

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9802).

**Guidance**: Encrypt all sensitive information in transit. Ensure that any clients connecting to your Azure resources in your virtual networks are able to negotiate TLS 1.2 or greater. Follow Security Center recommendations for encryption at rest and encryption in transit. 

Microsoft provides several options which can be utilized by customers for securing data in transit internally within the Azure network and externally across the Internet to the end user. These include communication through Virtual Private Networks (utilizing IPsec/IKE encryption), Transport Layer Security (TLS) 1.2 or later (via Azure components such as Application Gateway or Azure Front Door), protocols directly on the Azure virtual machines (such as Windows IPsec or SMB), and more.

Additionally, "encryption by default" using MACsec (an IEEE standard at the data-link layer) is enabled for all Azure traffic traveling between Azure datacenters to ensure confidentiality and integrity of customer data.

- [Understand encryption in transit with Azure](https://docs.microsoft.com/azure/security/fundamentals/encryption-overview#encryption-of-data-in-transit)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.5: Use an active discovery tool to identify sensitive data

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9803).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Use a third party active discovery tool to identify all sensitive information stored, processed, or transmitted by the organization's technology systems, including those located onsite or at a remote service provider and update the organization's sensitive information inventory.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 4.6: Use Azure RBAC to manage access to resources 

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9804).

**Guidance**: Use Azure role-based access control (Azure RBAC) to manage access to data and resources. Otherwise use service-specific access-control methods. 

Choose built-in roles like Owner, Contributor, or Network contributor and assign the role to the appropriate scope. For example, you can assign a subset of virtual network capabilities with the specific permissions required for virtual networks to any of these roles. 

- [How to configure Azure RBAC](../role-based-access-control/role-assignments-portal.md)

- [Plan virtual networks](https://docs.microsoft.com/azure/virtual-network/virtual-network-vnet-plan-design-arm#permissions)

- [Review the Azure built-in roles](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#networking)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.7: Use host-based data loss prevention to enforce access control

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9805).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Virtual Network. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 4.8: Encrypt sensitive information at rest

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9806).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Virtual Network. This recommendation is intended for compute resources and resources which uses stores data.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 4.9: Log and alert on changes to critical Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9807).

**Guidance**: Use Azure Monitor with the Azure Activity Logs to create alerts for when changes take place to critical Azure resources like Virtual Networks and network security groups.

- [Diagnostic logging for a network security group](virtual-network-nsg-manage-log.md)

- [How to create alerts for Azure Activity Log events](/azure/azure-monitor/platform/alerts-activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Vulnerability Management

*For more information, see the [Azure Security Benchmark: Vulnerability Management](../security/benchmarks/security-control-vulnerability-management.md).*

### 5.1: Run automated vulnerability scanning tools

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9808).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Virtual Network. Microsoft performs vulnerability management on the underlying systems that support Azure Virtual Network.

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

### 5.2: Deploy automated operating system patch management solution

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9809).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Virtual Network. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 5.3: Deploy automated patch management solution for third-party software titles

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9810).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Virtual Network. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 5.4: Compare back-to-back vulnerability scans

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9811).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Virtual Network. Microsoft performs vulnerability management on the underlying systems that support Azure Virtual Network.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9812).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Virtual Network. Microsoft performs vulnerability management on the underlying systems that support Virtual Network.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

## Inventory and Asset Management

*For more information, see the [Azure Security Benchmark: Inventory and Asset Management](../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9813).

**Guidance**: Use Azure Resource Graph to query and discover all networking resources like Virtual Networks, subnets within your subscriptions. Ensure you have appropriate (read) permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions.

- [How to create queries with Azure Graph](../governance/resource-graph/first-query-portal.md)

- [How to view your Azure Subscriptions](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-4.8.0&amp;preserve-view=true)

- [Understand Azure RBAC](../role-based-access-control/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.2: Maintain asset metadata

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9814).

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

- [How to create and use Tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.3: Delete unauthorized Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9815).

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track Virtual network and related resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create Management Groups](/azure/governance/management-groups/create-management-group-portal)

- [How to create and use Tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.4: Define and maintain inventory of approved Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9816).

**Guidance**: You will need to create an inventory of approved Azure resources and approved software for compute resources as per your organizational needs.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.5: Monitor for unapproved Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9817).

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:

- Not allowed resource types 

- Allowed resource types 

Query or discover resources within the subscriptions with Azure Resource Graph in high security-based environments, such as those with Azure Storage accounts. 

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md) 

- [How to create queries with Azure Graph](../governance/resource-graph/first-query-portal.md)

- [Azure policy sample built-ins for virtual network](policy-reference.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.6: Monitor for unapproved software applications within compute resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9818).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Virtual Network. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 6.7: Remove unapproved Azure resources and software applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9819).

**Guidance**: Prevent resource creation or usage with Azure Policy as required by the organization's policies. Implement processes for removing unauthorized resources.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.8: Use only approved applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9820).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Virtual Network. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 6.9: Use only approved Azure services

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9821).

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:
- Not allowed resource types
- Allowed resource types

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to deny a specific resource type with Azure Policy](https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies#general)

- [Azure policy sample built-ins for virtual network](policy-reference.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.10: Maintain an inventory of approved software titles

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9852).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Virtual Network. This recommendation is intended for compute resources hosting software applications.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 6.11: Limit users' ability to interact with Azure Resource Manager

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9822).

**Guidance**: Use Azure Conditional Access to limit user's ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resource Manager](../role-based-access-control/conditional-access-azure-management.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.12: Limit users' ability to execute scripts within compute resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9823).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Virtual Network. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 6.13: Physically or logically segregate high risk applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9824).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Virtual Network. This recommendation is intended for web applications running on Azure App Service or compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

## Secure Configuration

*For more information, see the [Azure Security Benchmark: Secure Configuration](../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9825).

**Guidance**: Use Azure Policy aliases to create custom policies to audit or enforce the configuration of your Azure network resources and also use built-in Azure Policy definitions.

Export any of your build templates with Azure Resource Manager in JavaScript Object Notation (JSON) form and review it to ensure that the configurations meet or exceed the security requirements for your organization.

Implement recommendations from Security Center as a secure configuration baseline for your Azure resources.

- [How to view available Azure Policy Aliases](https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-4.8.0&amp;preserve-view=true)

- [Tutorial: Create and manage policies to enforce compliance](../governance/policy/tutorials/create-and-manage.md)

- [Azure policy sample built-ins for virtual network](policy-reference.md)

- [Single and multi-resource export to a template in Azure portal](../azure-resource-manager/templates/export-template-portal.md)

- [Security recommendations - a reference guide](../security-center/recommendations-reference.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.2: Establish secure operating system configurations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9826).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Virtual Network. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.3: Maintain secure Azure resource configurations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9827).

**Guidance**: Use Azure Resource Manager templates and Azure Policies to securely configure Azure resources associated with the Virtual network and related resources.  Azure Resource Manager templates are JSON (JavaScript Object Notation) based files used to deploy virtual machines along with Azure resources. Microsoft performs the maintenance on the base templates.  

Use Azure Policy [deny] and [deploy if not exist] effects to enforce secure settings across your Azure resources.

- [Information on creating Azure Resource Manager templates](../virtual-machines/windows/ps-template.md) 

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md) 

- [Understanding Azure Policy Effects](../governance/policy/concepts/effects.md)

- [Azure Resource Manager template samples for virtual network](template-samples.md)

- [Azure policy sample built-ins for virtual network](policy-reference.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.4: Maintain secure operating system configurations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9828).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Virtual Network. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.5: Securely store configuration of Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9829).

**Guidance**: Use Azure DevOps to securely store and manage your code like custom Azure policies, Azure Resource Manager templates, desired state configuration scripts. and so on.

You must have permissions to access the resources you wish to manage in Azure DevOps, such as your code, builds, and work tracking. Most permissions are granted through built-in security groups. You can grant or deny permissions to specific users, built-in security groups, or groups defined in Azure Active Directory (Azure AD) if integrated with Azure DevOps, or Active Directory if integrated with Team Foundation Server.

- [How to store code in Azure DevOps](/azure/devops/repos/git/gitworkflow?view=azure-devops&amp;preserve-view=true)

- [About permissions and groups in Azure DevOps](/azure/devops/organizations/security/about-permissions)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.6: Securely store custom operating system images

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9830).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Virtual Network. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.7: Deploy configuration management tools for Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9831).

**Guidance**: Define and implement standard security configurations for Azure resources using Azure Policy. Use Azure Policy aliases to create custom policies to audit or enforce the network configuration of your Azure resources and any built-in policy definitions related to  specific resources. 

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to use Aliases](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#aliases)

- [Azure policy sample built-ins for virtual network](policy-reference.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.8: Deploy configuration management tools for operating systems

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9832).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Virtual Network. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.9: Implement automated configuration monitoring for Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9833).

**Guidance**: Use Security Center to perform baseline scans for your Azure Virtual Network and related resources. Use Azure Policy to alert and audit Azure resource configurations.

- [How to remediate recommendations in Security Center](../security-center/security-center-remediate-recommendations.md)

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Azure policy sample built-ins for virtual network](policy-reference.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.10: Implement automated configuration monitoring for operating systems

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9834).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Virtual Network. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.11: Manage Azure secrets securely

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9835).

**Guidance**: Use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure secret management for your Azure resources hosted in an Azure Virtual Network.

- [How to integrate with Azure Managed Identities](../azure-app-configuration/howto-integrate-azure-managed-service-identity.md) 

- [How to create a Key Vault](../key-vault/secrets/quick-create-portal.md) 

- [How to provide Key Vault authentication with a managed identity](../key-vault/general/assign-access-policy-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.12: Manage identities securely and automatically

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9836).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Virtual Network. It is a core networking offering and does not support assigning managed identities to the service.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.13: Eliminate unintended credential exposure

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9837).

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Malware Defense

*For more information, see the [Azure Security Benchmark: Malware Defense](../security/benchmarks/security-control-malware-defense.md).*

### 8.1: Use centrally-managed anti-malware software

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9838).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Virtual Network. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9839).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Virtual Network. As a service, Virtual Network, does not store or process files. Microsoft Antimalware is enabled on the underlying host that supports Azure services (for example, Azure Virtual network), however it does not run on customer content.  

- [Understand Microsoft Antimalware for Azure Cloud Services and Virtual Machines](../security/fundamentals/antimalware.md)

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 8.3: Ensure anti-malware software and signatures are updated

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9840).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Virtual Network. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

## Data Recovery

*For more information, see the [Azure Security Benchmark: Data Recovery](../security/benchmarks/security-control-data-recovery.md).*

### 9.1: Ensure regular automated back-ups

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9841).

**Guidance**: Use Azure Resource Manager to deploy a virtual network and related resources. Azure Resource Manager provides ability to export templates which can be used as backups to restore Virtual network and related resources.  Use Azure Automation to call the Azure Resource Manager template export API on a regular basis.

- [Overview of Azure Resource Manager](../azure-resource-manager/management/overview.md)

- [Azure Resource Manager template samples for virtual network](template-samples.md)

- [Single and multi-resource export to a template in Azure portal](../azure-resource-manager/templates/export-template-portal.md)

- [Resource Groups - Export Template](/rest/api/resources/resourcegroups/exporttemplate)

- [Introduction to Azure Automation](../automation/automation-intro.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.2: Perform complete system backups and backup any customer-managed keys

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9842).

**Guidance**: Use Azure Resource Manager to deploy a virtual network and related resources. Azure Resource Manager provides ability to export templates which can be used as backups to restore Virtual network and related resources. Use Azure Automation to call the Azure Resource Manager template export API on a regular basis. Back up customer-managed keys within Azure Key Vault.

- [Overview of Azure Resource Manager](../azure-resource-manager/management/overview.md)

- [Azure Resource Manager template samples for virtual network](template-samples.md)

- [Single and multi-resource export to a template in Azure portal](../azure-resource-manager/templates/export-template-portal.md)

- [Resource Groups - Export Template](/rest/api/resources/resourcegroups/exporttemplate)

- [Introduction to Azure Automation](../automation/automation-intro.md)

- [How to backup key vault keys in Azure](https://docs.microsoft.com/powershell/module/az.keyvault/backup-azkeyvaultkey?view=azps-4.8.0&amp;preserve-view=true)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.3: Validate all backups including customer-managed keys

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9843).

**Guidance**: Periodically perform deployment of Azure Resource Manager templates to an isolated subscription and test restoration of backed up customer-managed keys.

- [Deploy resources with ARM templates and Azure portal](../azure-resource-manager/templates/deploy-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.4: Ensure protection of backups and customer-managed keys

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9844).

**Guidance**: Use Azure DevOps to securely store and manage your code like custom Azure Policy definitions and Azure Resource Manager templates.

Grant or deny permissions to specific users, built-in security groups, or groups defined in Azure Active Directory (Azure AD) if integrated with Azure DevOps, or Active Directory if integrated with Team Foundation Server.

Use Azure role-based access control (Azure RBAC) to protect customer-managed keys. 

Enable Soft-Delete and purge protection in Key Vault to protect keys against accidental or malicious deletion.

- [How to store code in Azure DevOps](/azure/devops/repos/git/gitworkflow)

- [About permissions and groups in Azure DevOps](/azure/devops/organizations/security/about-permissions)

- [How to enable Soft-Delete and Purge protection in Key Vault](../storage/blobs/soft-delete-blob-overview.md)

- [Soft delete for Azure Storage blobs](../storage/blobs/soft-delete-blob-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9845).

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.  

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/06/27/inside-the-msrc-anatomy-of-a-ssirp-incident/)

- [Leverage NIST's Computer Security Incident Handling Guide to aid in the creation of your own incident response plan](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.2: Create an incident scoring and prioritization procedure

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9846).

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Clearly mark subscriptions (for example, production or non-production) using tags and create a naming system to clearly identify and categorize Azure resources, especially those processing sensitive data.  It is your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

- [Security alerts in Security Center](../security-center/security-center-alerts-overview.md)

- [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.3: Test security response procedures

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9847).

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence to help protect your Azure resources. Identify weak points and gaps and revise plan as needed.

- [NIST's publication - Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://csrc.nist.gov/publications/detail/sp/800-84/final)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9848).

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved.

- [How to set the Security Center Security Contact](../security-center/security-center-provide-security-contact-details.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.5: Incorporate security alerts into your incident response system

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9849).

**Guidance**: Export your Security Center alerts and recommendations using the Continuous Export feature to help identify risks to Azure resources. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. 

You can also use the Security Center data connector to stream the alerts to Azure Sentinel.

- [How to configure continuous export](../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../sentinel/connect-azure-security-center.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.6: Automate the response to security alerts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9850).

**Guidance**: Use the Workflow Automation feature in Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations to protect your Azure resources.

- [How to configure Workflow Automation and Logic Apps](../security-center/workflow-automation.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Penetration Tests and Red Team Exercises

*For more information, see the [Azure Security Benchmark: Penetration Tests and Red Team Exercises](../security/benchmarks/security-control-penetration-tests-red-team-exercises.md).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/9851).

**Guidance**: Follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies. Use Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1)

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Next steps

- See the [Azure Security Benchmark V2 overview](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
