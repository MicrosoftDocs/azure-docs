---
title: Azure security baseline for Azure Load Balancer
description: The Azure Load Balancer security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: load-balancer
ms.topic: conceptual
ms.date: 01/01/2000
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Load Balancer

This security baseline applies guidance from the [Azure Security Benchmark version1.0](../security/benchmarks/overview-v1.md) to Microsoft Azure Load Balancer. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure.The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Load Balancer. **Controls** not applicable to Azure Load Balancer, or for which the responsibility is Microsoft's, have been excluded.

To see how Azure Load Balancer completely maps to the Azure Security Benchmark, see the [full Azure Load Balancer security baseline mappingfile](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](../security/benchmarks/security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32349).

**Guidance**: Use internal Azure Load Balancers to only allow traffic to backend resources from within certain virtual networks or peered virtual networks without exposure to the internet. Implement an external Load Balancer with Source Network

Address Translation (SNAT) to masquerade the IP addresses of backend resources for protection from direct internet exposure.

Azure offers two types of Load Balancer offerings, Standard and Basic. Use the Standard Load Balancer for all production workloads. Implement network
security groups and only allow access to your application's trusted ports and IP address ranges. In cases where there is no network security group assigned to the backend subnet or NIC of the backend virtual machines, traffic will not be not allowed to these resources from the load balancer. With Standard Load Balancers, provide outbound rules to define outbound NAT with a network security group. Review these outbound rules to tune the behavior of your outbound connections.

Using a Standard Load Balancer is recommended for your production workloads and typically the Basic Load Balancer is only used for testing since the basic type is open to connections from the internet by default, and doesn't require network security groups for operation.

- [Outbound connections in Azure](load-balancer-outbound-connections.md)

- [Upgrade Azure Public Load Balancer](upgrade-basic-standard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Network**:

[!INCLUDE [Resource Policy for Microsoft.Network 1.1](../../includes/policy/standards/asb/rp-controls/microsoft.network-1-1.md)]

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and NICs

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32350).

**Guidance**: The Load Balancer is a pass through service as it relies on the network security groups rules applied to backend resources and the configured outbound rules to control internet access.

Review the outbound rules configured for your Standard Load Balancer through the Outbound Rules blade of your Load Balancer and the load-balancing rules blade where you may have Implicit outbound rules enabled.

Monitor the count of your outbound connections to track how often your resources are reaching out to the internet. 

Use Security Center and follow the network protection recommendations to help secure your Azure network resources.

Follow security recommendations for your backend resources and enable network security group flow logs and send the logs to an Azure Storage account for auditing.

Also send the flow logs to a Log Analytics workspace and then use Traffic Analytics to provide insights into traffic patterns in your Azure cloud. Advantages of Traffic Analytics include the ability to visualize network activity, identify hot spots and security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

- [How to enable network security group flow logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to enable and use Traffic Analytics](../network-watcher/traffic-analytics.md)

- [Understand network security provided by Azure Security Center](../security-center/security-center-network-recommendations.md)

- [How do I check my outbound connection statistics](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-diagnostics#how-do-i-check-my-outbound-connection-statistics)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Network**:

[!INCLUDE [Resource Policy for Microsoft.Network 1.2](../../includes/policy/standards/asb/rp-controls/microsoft.network-1-2.md)]

### 1.3: Protect critical web applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32351).

**Guidance**: Explicitly define internet connectivity and valid source IPs through outbound rules and network security groups with your Load Balancer to use Microsoft's threat intelligence for protecting your web applications.

- [Integrate the Azure Firewall](../firewall/integrate-lb.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.4: Deny communications with known malicious IP addresses

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32352).

**Guidance**: Enable Azure Distributed Denial of Service (DDoS) Standard protection on your Azure Virtual Network to guard against DDoS attacks. 

Deploy Azure Firewall at each of the organization's network boundaries with threat intelligence-based filtering enabled and configured to "Alert and deny" for malicious network traffic.

 

Use Security Center threat protection to detect  communications with known malicious IP addresses. 

The Standard Load Balancer is designed to be secure by default and part of a private and isolated Virtual Network. It is closed to inbound flows unless opened by network security groups to explicitly permit allowed traffic, and to disallow known malicious IP addresses. 
Unless a network security group on a subnet or NIC of your virtual machine resource exists behind the Load Balancer, traffic is not allowed to reach this resource. 

Deploy Azure Firewall at each of the organization's network boundaries with threat intelligence-based filtering enabled and configured to "Alert and deny" for malicious network traffic to prevent attacks from malicious IP addresses. 

Implement guidance to integrate Azure Firewall with your Load Balancer.

Use Security Center threat protection features to detect communications with known malicious IP addresses. 

Security Center (Standard Tier) provides just-in-time virtual machine access, and configures allowed source IP addresses to allow access only from approved IP addresses/ranges.
 

Use Security Center's Adaptive Network Hardening feature to recommend network security group configurations that limit ports and source IPs based on actual traffic and threat intelligence.
 

- [Manage Azure DDoS Protection Standard using the Azure portal](../ddos-protection/manage-ddos-protection.md)

- [Azure Firewall threat intelligence-based filtering](../firewall/threat-intel.md)

- [Threat protection in Azure Security Center](../security-center/azure-defender.md)

- [Secure your management ports with just-in-time access](../security-center/security-center-just-in-time.md)

- [Adaptive Network Hardening in Azure Security Center](../security-center/security-center-adaptive-network-hardening.md)

- [Integrate Azure Firewall with your Load Balancer](../firewall/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Network**:

[!INCLUDE [Resource Policy for Microsoft.Network 1.4](../../includes/policy/standards/asb/rp-controls/microsoft.network-1-4.md)]

### 1.5: Record network packets

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32353).

**Guidance**: Enable Network Watcher packet capture to investigate anomalous activities.

- [How to create a Network Watcher instance](../network-watcher/network-watcher-create.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Network**:

[!INCLUDE [Resource Policy for Microsoft.Network 1.5](../../includes/policy/standards/asb/rp-controls/microsoft.network-1-5.md)]

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32354).

**Guidance**: Implement an offer from the Azure Marketplace that supports IDS/IPS functionality with payload inspection capabilities to the environment of your Load Balancer. 

Use Azure Firewall threat intelligence if payload inspection is not a requirement. 
Azure Firewall threat intelligence-based filtering is used to alert on and/or block traffic to and from known malicious IP addresses and domains. The IP addresses and domains are sourced from the Microsoft Threat Intelligence feed.

Deploy the firewall solution of your choice at each of your organization's network boundaries to detect and/or block malicious traffic.

- [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/?term=Firewall)

- [How to deploy Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md)

- [How to configure alerts with Azure Firewall](../firewall/threat-intel.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.7: Manage traffic to web applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32355).

**Guidance**: Explicitly define internet connectivity and valid source IPs through outbound rules and network security groups with your Load Balancer to use Microsoft's threat intelligence features to protect your web applications.

- [Integrate the Azure Firewall](../firewall/integrate-lb.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.8: Minimize complexity and administrative overhead of network security rules

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32356).

**Guidance**: Use service tags in place of specific IP addresses when creating security rules. Specify the service tag name in the source or destination field of a rule to allow or deny the traffic for the corresponding service. 

Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change. 

By default, every network security group includes the service tag AzureLoadBalancer to permit health probe traffic. 

Refer to Azure documentation for all the service tags available for use in network security group rules.

- [Available service tags](https://docs.microsoft.com/azure/virtual-network/service-tags-overview#available-service-tags)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.9: Maintain standard security configurations for network devices

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32357).

**Guidance**: Define and implement standard security configurations for network resources with Azure Policy.

Use Azure Blueprints to simplify large-scale Azure deployments by packaging key environment artifacts, such as Azure Resources Manager templates, Azure RBAC controls, and policies, in a single blueprint definition. 

Apply the blueprint to new subscriptions, and fine-tune control and management through versioning.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Azure Policy samples for networking](https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies#network)

- [How to create an Azure Blueprint](../governance/blueprints/create-blueprint-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.10: Document traffic configuration rules

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32358).

**Guidance**: Use resource tags for network security groups and other resources related to network security and traffic flow. 

Use the "Description" field to document the rules that allow traffic to/from a network for individual network security group rules.

Implement any of the built-in Azure Policy definitions related to tagging, such as "Require tag and its value", which ensures that all resources are created with tags and to notify of any existing untagged resources.

Use Azure PowerShell or Azure CLI to look up or perform actions on resources based on their tags.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

- [How to create an Azure Virtual Network](../virtual-network/quick-create-portal.md)

- [How to filter network traffic with network security group rules](../virtual-network/tutorial-filter-network-traffic.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.11: Use automated tools to monitor network resource configurations and detect changes

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32359).

**Guidance**: Use Azure Activity log to monitor resource configurations and detect changes to your Azure resources. 

Create alerts in Azure Monitor to notify you when critical resources are changed.

- [How to view and retrieve Azure Activity log events](https://docs.microsoft.com/azure/azure-monitor/essentials/activity-log#view-the-activity-log)

- [How to create alerts in Azure Monitor](../azure-monitor/alerts/alerts-activity-log.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Logging and Monitoring

*For more information, see the [Azure Security Benchmark: Logging and Monitoring](../security/benchmarks/security-control-logging-monitoring.md).*

### 2.1: Use approved time synchronization sources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32360).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Microsoft maintains time synchronization sources for Azure services like Azure Load Balancer.

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

### 2.2: Configure central security log management

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32361).

**Guidance**: Review changes to your outbound rules and network security groups for your Load Balancers by viewing the Activity Log in your subscriptions. 

View the internal host logs to ensure your backend resources are secure.

Export these logs to Log Analytics or another storage platform. In Azure Monitor, use Log Analytics workspaces to query and perform analytics, and use Azure Storage accounts for long term and archival storage.

Enable and on-board this data to Azure Sentinel or a third-party SIEM based on your organizational business requirements.

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

- [How to collect platform logs and metrics with Azure Monitor](../azure-monitor/essentials/diagnostic-settings.md)

- [How to collect Azure Virtual Machine internal host logs with Azure Monitor](../azure-monitor/vm/quick-collect-azurevm.md)

- [How to get started with Azure Monitor and third-party SIEM integration](https://azure.microsoft.com/blog/use-azure-monitor-to-integrate-with-siem-tools/)

- [Platform Activity logs](../azure-monitor/essentials/activity-log.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.3: Enable audit logging for Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32362).

**Guidance**: Review the Control and Management Plane logging and audit information captured with Activity logs for the Basic Load Balancer. These capture settings are enabled by default. 

Use Activity logs to monitor actions on resources to view all activity and their status. 

Determine what operations were taken on the resources in your subscription with activity logs: 

- who started the operation
- when the operation occurred
- the status of the operation

- the values of other properties that might help you research the operation

Retrieve information from the activity log through Azure PowerShell, the Azure Command Line Interface (CLI), the Azure REST API, or the Azure portal. 

Implement Multi-dimensional diagnostic for the Standard Load Balancer configurations capabilities with Azure Monitor.  These include available metrics for security include information on Source Network Address Translation (SNAT) connections, ports. Additional metrics on SYN (synchronize) packets and packet counters are also available. 

Retrieve multi-dimensional metrics programmatically via APIs and write them to a storage account via the 'All Metrics' option.

Use the Azure Audit Logs content pack with Microsoft Power BI to analyze your data with pre-configured dashboards, or to customize the views based on your requirements.

Stream logs to an event hub or a Log Analytics workspace. They can also be extracted from Azure blob storage, and viewed in different tools, such as Excel and Power BI. 

Enable and on-board data to Azure Sentinel or a third-party SIEM based on your business requirements.

- [Review this article with step-by-step instructions for each method detailed in the Audit operations with Resource Manager](../azure-resource-manager/management/view-activity-logs.md)

- [Azure Monitor logs for public Basic Load Balancer](load-balancer-monitor-log.md)

- [View activity logs to monitor actions on resources](../azure-resource-manager/management/view-activity-logs.md)

- [Retrieve multi-dimensional metrics programmatically via APIs](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-diagnostics#retrieve-multi-dimensional-metrics-programmatically-via-apis)

- [How to get started with Azure Monitor and third-party SIEM integration](https://azure.microsoft.com/blog/use-azure-monitor-to-integrate-with-siem-tools)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.4: Collect security logs from operating systems

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32363).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Azure Load Balancer. This recommendation applies to compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 2.5: Configure security log storage retention

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32364).

**Guidance**: The Activity log is enabled by default and is preserved for 90 days in Azure's Event Logs store. Set your Log Analytics workspace retention period according to your organization's compliance regulations in Azure Monitor. Use Azure Storage accounts for long-term and archival storage.

- [View activity logs to monitor actions on resources article](../azure-resource-manager/management/view-activity-logs.md)

- [Change the data retention period in Log Analytics](https://docs.microsoft.com/azure/azure-monitor/logs/manage-cost-storage#change-the-data-retention-period)

- [How to configure retention policy for Azure Storage account logs](https://docs.microsoft.com/azure/storage/common/manage-storage-analytics-logs#configure-logging)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.6: Monitor and review Logs

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32365).

**Guidance**: Monitor, manage, and troubleshoot Standard Load Balancer resources using the Load Balancer page in the Azure portal and the Resource Health page under Azure Monitor. Available metrics for security include information on Source Network Address Translation (SNAT) connections, ports. Additionally metrics on SYN (synchronize) packets and packet counters are also available. 

Use Azure Monitor to review endpoint health probe status with multi-dimensional metrics for Standard, external and internal, Load Balancers. Gather these metrics programmatically via APIs and written to a storage account via the 'All Metrics' option.

Azure Monitor logs are not available for Internal Basic Load Balancers. 

Use Azure Monitor to see health probe status summarized per backend pool for the Basic External Load Balancer, such as, the number of instances in your backend-pool  not receiving requests from the Load Balancer due to health probe failures. 

Implement Logging with Azure Operational Insights to provide statistics about load balancer health status. 

Use the Activity Logs to view alerts and monitor actions on resources and their status in your Azure subscriptions. Activity logs are enabled by default, and can be viewed in the Azure portal. 

Use Microsoft Power BI with the Azure Audit Logs content pack and analyze your data with pre-configured dashboards. Customize views to suit your requirements based on business need. 

Stream logs to an event hub or a Log Analytics workspace. They can also be extracted from Azure blob storage, and viewed in different tools, such as Excel and Power BI. You can enable and on-board data to Azure Sentinel or a third-party SIEM.

- [Load Balancer health probes](load-balancer-custom-probe-overview.md)

- [Azure Monitor REST API](/rest/api/monitor)

- [How to retrieve metrics via REST API](/rest/api/monitor/metrics/list)

- [Standard Load Balancer diagnostics with metrics, alerts, and resource health](load-balancer-standard-diagnostics.md)

- [Azure Monitor logs for public Basic Load Balancer](load-balancer-monitor-log.md)

- [View your load balancer metrics in the Azure portal](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-diagnostics#view-your-load-balancer-metrics-in-the-azure-portal)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.7: Enable alerts for anomalous activities

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32366).

**Guidance**: Use Security Center with Log Analytics workspace for monitoring and alerting on anomalous activity related to Load Balancer in security logs and events.

Enable and on-board data to Azure Sentinel or a third-party SIEM tool.

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

- [How to manage alerts in Azure Security Center](../security-center/security-center-managing-and-responding-alerts.md)

- [How to alert on log analytics log data](../azure-monitor/alerts/tutorial-response.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.8: Centralize anti-malware logging

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32367).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Azure Load Balancer. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 2.9: Enable DNS query logging

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32368).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable as Azure Load Balancer is a core networking service that does not make DNS queries.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 2.10: Enable command-line audit logging

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32369).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Azure Load Balancer as this recommendation applies to compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32370).

**Guidance**: Azure role-based access control (Azure RBAC) allows you to manage access to Azure resources such as your Load Balancer through role assignments. Assign these roles to users, groups service principals, and managed identities.

Inventory Pre-defined and built-in roles for certain resources with tools like Azure CLI, Azure PowerShell or the Azure portal.

- [How to get a directory role in Azure Active Directory (Azure AD) with PowerShell](/powershell/module/azuread/get-azureaddirectoryrole)

- [How to get members of a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrolemember)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.2: Change default passwords where applicable

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32371).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable as Azure Load Balancer is a core networking service and does not have the concept of default passwords.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 3.3: Use dedicated administrative accounts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32372).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable as Azure Load Balancer is a core networking service that does not have the concept of any 'administrative accounts'.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 3.4: Use single sign-on (SSO) with Azure Active Directory

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32373).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Use Azure Active Directory (Azure AD) single-sign-on instead of configuring individual stand-alone credentials per-service. 

Implement Security Center's identity and access recommendations.

- [Understand SSO with Azure AD](../active-directory/manage-apps/what-is-single-sign-on.md)

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32374).

**Guidance**: Enable Azure Active Directory (Azure AD) multifactor authentication and follow Security Center's Identity and Access Management recommendations.

- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md) 

- [How to monitor identity and access within Azure Security Center](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32375).

**Guidance**: Use Privileged Access Workstations (PAW) with multifactor authentication configured to manage and access Azure network resources. 

- [Learn about Privileged Access Workstations](/security/compass/privileged-access-devices)

- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.7: Log and alert on suspicious activities from administrative accounts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32376).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable as Azure Load Balancer is a core networking service that does not have the concept of any 'administrative accounts'.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 3.8: Manage Azure resources only from approved locations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32377).

**Guidance**: Use Conditional Access named locations to allow access from only specific logical groupings of IP address ranges or countries/regions.

- [How to configure named locations in Azure](../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.9: Use Azure Active Directory

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32378).

**Guidance**: Use Azure Active Directory (Azure AD) as a central authentication and authorization system for your services. Azure AD protects data by using strong encryption for data at rest and in transit and also salts, hashes, and securely stores user credentials.  

- [How to create and configure an Azure AD instance](../active-directory-domain-services/tutorial-create-instance.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.10: Regularly review and reconcile user access

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32379).

**Guidance**: Use Azure Active Directory (Azure AD) to provide logs to help discover stale accounts. 

Azure Identity Access Reviews can be performed to efficiently manage group memberships, access to enterprise applications, and role assignments. User access should be reviewed on a regular basis to make sure only the active users have continued access.

- [Understand Azure AD reporting](/azure/active-directory/reports-monitoring/)

- [How to use Azure Identity Access Reviews](../active-directory/governance/access-reviews-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.11: Monitor attempts to access deactivated credentials

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32380).

**Guidance**: Integrate Azure Active Directory (Azure AD) Sign-in Activity, Audit and Risk Event log sources, with any SIEM or Monitoring tool based on your access.

Streamline this process by creating Diagnostic Settings for Azure AD user accounts and sending the audit logs and sign-in logs to a Log Analytics Workspace. Any desired alerts can be configured within Log Analytics Workspace.

- [How to integrate Azure Activity Logs into Azure Monitor](/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.12: Alert on account login behavior deviation

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32381).

**Guidance**: Use Azure Active Directory (Azure AD)'s Risk and Identity Protection features to configure automated responses to detected suspicious actions related to user identities. Ingest data into Azure Sentinel for any further investigations.

- [How to view Azure AD risky sign-ins](/azure/active-directory/reports-monitoring/concept-risky-sign-ins)

- [How to configure and enable Identity Protection risk policies](../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32382).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable as Load Balancer is a core networking service that does not store customer data that would need to be shared during support scenarios.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](../security/benchmarks/security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive Information

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32383).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable as Load Balancer is a core networking service that does not store customer data.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 4.2: Isolate systems storing or processing sensitive information

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32384).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable as Load Balancer is a core networking service that does not store customer data.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 4.3: Monitor and block unauthorized transfer of sensitive information

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32385).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable as Load Balancer is a core networking service that does not store customer data.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 4.4: Encrypt all sensitive information in transit

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32386).

**Guidance**: Ensure that any clients connecting to your Azure resources are able to negotiate TLS 1.2 or greater.

Follow Azure Security Center recommendations for encryption at rest and encryption in transit, where applicable.

- [Understand encryption in transit with Azure](https://docs.microsoft.com/azure/security/fundamentals/encryption-overview#encryption-of-data-in-transit)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.5: Use an active discovery tool to identify sensitive data

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32387).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable as Load Balancer is a core networking service that does not store customer data.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 4.6: Use Azure RBAC to manage access to resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32388).

**Guidance**: Use Azure RBAC to control access to your Load Balancer resources.

- [How to configure Azure RBAC](../role-based-access-control/role-assignments-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.7: Use host-based data loss prevention to enforce access control

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32389).

**Guidance**: Load Balancer is a pass through service that does not store customer data. It is a part of the underlying platform that is managed by Microsoft. 

Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. 

To ensure customer data in Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities. 

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.8: Encrypt sensitive information at rest

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32390).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable as Load Balancer is a core networking service that does not store customer data.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 4.9: Log and alert on changes to critical Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32391).

**Guidance**: Use Azure Monitor with the Azure Activity log to create alerts when changes take place to critical Azure resources, such as Load Balancers used for important production workloads.

- [How to create alerts for Azure Activity log events](../azure-monitor/alerts/alerts-activity-log.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Vulnerability Management

*For more information, see the [Azure Security Benchmark: Vulnerability Management](../security/benchmarks/security-control-vulnerability-management.md).*

### 5.1: Run automated vulnerability scanning tools

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32392).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Microsoft performs vulnerability management on the underlying systems that support Azure Load Balancer.

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

### 5.2: Deploy automated operating system patch management solution

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32393).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Not applicable; This control is intended for compute services which expose their OS configurations. Microsoft performs OS patching on the underlying systems that support Azure Load Balancer.

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

### 5.3: Deploy an automated patch management solution for third-party software titles

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32394).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Not applicable; This control is intended for compute services which expose their OS configurations. Microsoft performs OS patching on the underlying systems that support Azure Load Balancer.

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

### 5.4: Compare back-to-back vulnerability scans

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32395).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Microsoft performs vulnerability management on the underlying systems that support Azure Load Balancer.

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32396).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Microsoft performs vulnerability management on the underlying systems that support Azure Load Balancer.

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

## Inventory and Asset Management

*For more information, see the [Azure Security Benchmark: Inventory and Asset Management](../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32397).

**Guidance**: Use Azure Resource Graph to query for and discover all resources (such as compute, storage, network, ports, protocols, and so on) in your subscriptions. Azure Resource Manager is recommended to create and use current resources.

Ensure appropriate (read) permissions in your tenant and enumerate all Azure subscriptions and resources in your subscriptions.

- [How to create queries with Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md)

- [How to view your Azure subscriptions](/powershell/module/az.accounts/get-azsubscription)

- [Understand Azure RBAC](../role-based-access-control/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.2: Maintain asset metadata

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32398).

**Guidance**: Apply tags to Azure resources with metadata to logically organize according to a taxonomy.

- [How to create and use tags](/azure/azure-resource-manager/resource-group-using-tags)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.3: Delete unauthorized Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32399).

**Guidance**: Use tagging, management groups, and separate subscriptions where appropriate, to organize and track assets. 

Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from your subscriptions in a timely manner.

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create management groups](../governance/management-groups/create-management-group-portal.md)

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.4: Define and maintain an inventory of approved Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32400).

**Guidance**: Create a list of approved Azure resources per your organizational needs which you can leverage as an allowlist mechanism. This will allow your organization to onboard any newly available Azure services after they are formally reviewed and approved by your organization's typical security evaluation processes.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.5: Monitor for unapproved Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32401).

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in your subscriptions.

Query for and discover resources with Azure Resource Graph within owned subscriptions. 

Ensure all Azure resources present in the environment are approved.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to create queries with Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.6: Monitor for unapproved software applications within compute resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32402).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Load Balancer as this recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 6.7: Remove unapproved Azure resources and software applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32403).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Load Balancer. This control is intended for compute resources which host Azure resources and software applications.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 6.8: Use only approved applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32404).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Load Balancer. This control is intended for compute resources which host applications.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 6.9: Use only approved Azure services

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32405).

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:
- Not allowed resource types
- Allowed resource types

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to deny a specific resource type with Azure Policy](https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies#general)

- [Azure policy sample built-ins for virtual network](/azure/virtual-network/policy-samples)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.10: Maintain an inventory of approved software titles

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32406).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Load Balancer. This control is recommended for compute resources which host software applications.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 6.11: Limit users' ability to interact with Azure Resource Manager

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32407).

**Guidance**: Use Azure Active Directory (Azure AD) Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resources Manager](../role-based-access-control/conditional-access-azure-management.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.12: Limit users' ability to execute scripts in compute resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32408).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Load Balancer. This control is recommended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 6.13: Physically or logically segregate high risk applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32409).

**Guidance**: Software that is required for business operations, but may incur higher risk for the organization, should be isolated within its own virtual machine and/or virtual network and sufficiently secured with either an Azure Firewall or a network security group.

- [How to create a virtual network](../virtual-network/quick-create-portal.md)

- [How to create a network security group with a security config](../virtual-network/tutorial-filter-network-traffic.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Secure Configuration

*For more information, see the [Azure Security Benchmark: Secure Configuration](../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32410).

**Guidance**: Use Azure Policy aliases to create custom policies to audit or enforce the configuration of your Azure resources. Use Built-in Azure Policy definitions.

Azure Resource Manager has the ability to export the template in JavaScript Object Notation (JSON), which should be reviewed to ensure that the configurations meet the security requirements for your organization.

Export Azure Resource Manager templates into JavaScript Object Notation (JSON) formats, and periodically review them to ensure that the configurations meet your organizational security requirements.

Implement recommendations from Security Center as a secure configuration baseline for your Azure resources.

- [How to view available Azure Policy aliases](/powershell/module/az.resources/get-azpolicyalias)

- [Tutorial: Create and manage policies to enforce compliance](../governance/policy/tutorials/create-and-manage.md)

- [Single and multi-resource export to a template in Azure portal](../azure-resource-manager/templates/export-template-portal.md)

- [Security recommendations - a reference guide](../security-center/recommendations-reference.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.2: Establish secure operating system configurations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32411).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Load Balancer. This recommendation is for compute resources which host operating systems.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.3: Maintain secure Azure resource configurations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32412).

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.  Also, you can use Azure Resource Manager templates to maintain the security configuration of your Azure resources required by your organization. 

- [Understand Azure Policy effects](../governance/policy/concepts/effects.md)

- [Create and manage policies to enforce compliance](../governance/policy/tutorials/create-and-manage.md)

- [Azure Resource Manager templates overview](../azure-resource-manager/templates/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.4: Maintain secure operating system configurations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32413).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Load Balancer. This recommendation is for compute resources which host operating systems.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.5: Securely store configuration of Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32414).

**Guidance**: Use Azure DevOps to securely store and manage your code like custom Azure Policy definitions, Azure Resource Manager templates, and desired state configuration scripts.

Grant or deny permissions to specific users, built-in security groups, or groups defined in Azure Active Directory (Azure AD) if it is integrated with Azure DevOps, or in Azure AD if integrated with TFS.

- [How to store code in Azure DevOps](/azure/devops/repos/git/gitworkflow)

- [About permissions and groups in Azure DevOps](/azure/devops/organizations/security/about-permissions)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.6: Securely store custom operating system images

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32415).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Azure Load Balancer. This recommendation is for compute resources which host operating systems.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.7: Deploy configuration management tools for Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32416).

**Guidance**: Define and implement standard security configurations for Azure resources using Azure Policy.  Use Azure Policy aliases to create custom policies to audit or enforce the network configuration of your Azure resources. Implement built-in policy definitions related to your specific Azure Load Balancer resources.  Also, use Azure Automation to deploy configuration changes. to your Azure Load Balancer resources.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to use aliases](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#aliases)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.8: Deploy configuration management tools for operating systems

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32417).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Load Balancer. This recommendation is for compute resources which host operating systems.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.9: Implement automated configuration monitoring for Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32418).

**Guidance**: Use Security Center to perform baseline scans for your Azure Resources and Azure Policy to alert and audit resource configurations.

- [How to remediate recommendations in Azure Security Center](../security-center/security-center-remediate-recommendations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.10: Implement automated configuration monitoring for operating systems

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32419).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Load Balancer. This recommendation is for compute resources which host operating systems.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.11: Manage Azure secrets securely

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32420).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Load Balancer. This control is intended for resources which can be ascribed a managed identity to secure secrets management of their applications.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.12: Manage identities securely and automatically

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32421).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Load Balancer. This control is intended for resources which who can use managed identity for authentication to their services.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.13: Eliminate unintended credential exposure

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32422).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Load Balancer. This control is intended for resources which can be ascribed a managed identity to secure secrets management of their applications.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

## Malware Defense

*For more information, see the [Azure Security Benchmark: Malware Defense](../security/benchmarks/security-control-malware-defense.md).*

### 8.1: Use centrally managed antimalware software

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32423).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this guideline is intended for compute resources. Microsoft Anti-malware is enabled on the underlying host that supports Azure services (for example, Azure App Service), however it does not run on customer content.

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32424).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this guideline is intended for compute resources. Microsoft Anti-malware is enabled on the underlying host that supports Azure services (for example, Azure App Service), however it does not run on customer content.

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

### 8.3: Ensure antimalware software and signatures are updated

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32425).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this guideline is intended for compute resources. Microsoft Anti-malware is enabled on the underlying host that supports Azure services (for example, Azure App Service), however it does not run on customer content.

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

## Data Recovery

*For more information, see the [Azure Security Benchmark: Data Recovery](../security/benchmarks/security-control-data-recovery.md).*

### 9.1: Ensure regular automated back ups

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32426).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Load Balancer as it is a core networking service. Load Balancer itself does not hold any customer data.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 9.2: Perform complete system backups and backup any customer-managed keys

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32427).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Load Balancer as it is a core networking service. Load Balancer itself does not hold any customer data.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 9.3: Validate all backups including customer-managed keys

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32428).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Load Balancer as it is a core networking service. Load Balancer itself does not hold any customer data.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 9.4: Ensure protection of backups and customer-managed keys

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32429).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Load Balancer as it is a core networking service. Load Balancer itself does not hold any customer data.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32430).

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review. 

- [How to configure Workflow Automations within Azure Security Center](../security-center/security-center-planning-and-operations-guide.md) 

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/) 

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/) 

- [Customer may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.2: Create an incident scoring and prioritization procedure

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32431).

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. 

The severity is based on how confident Security Center is in the finding or the analytics used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Mark subscriptions using tags and create a naming system to identify and categorize Azure resources, especially those processing sensitive data.  

It is your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

- [Security alerts in Azure Security Center](../security-center/security-center-alerts-overview.md)

- [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.3: Test security response procedures

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32436).

**Guidance**: Conduct exercises to test your systems' incident response capabilities on a regular cadence to help protect your Azure resources. Identify weak points and gaps and then revise your response plan as needed. 

- [NIST's publication--Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://csrc.nist.gov/publications/detail/sp/800-84/final)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32432).

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved. 

- [How to set the Azure Security Center security contact](../security-center/security-center-provide-security-contact-details.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.5: Incorporate security alerts into your incident response system

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32433).

**Guidance**: Export your Security Center alerts and recommendations using the continuous export feature to help identify risks to Azure resources. 

Use Continuous export feature in Security Center that allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. 

Utilize the Security Center data connector to stream the alerts to Azure Sentinel.

- [How to configure continuous export](../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../sentinel/connect-azure-security-center.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.6: Automate the response to security alerts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32434).

**Guidance**: Use the Workflow Automation feature in Security Center to automatically trigger responses to security alerts and recommendations to protect your Azure resources.

- [How to configure workflow automation in Security enter](../security-center/workflow-automation.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Penetration Tests and Red Team Exercises

*For more information, see the [Azure Security Benchmark: Penetration Tests and Red Team Exercises](../security/benchmarks/security-control-penetration-tests-red-team-exercises.md).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32435).

**Guidance**: Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications. 

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1) 

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Next steps

- See the [Azure Security Benchmark V2 overview](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
