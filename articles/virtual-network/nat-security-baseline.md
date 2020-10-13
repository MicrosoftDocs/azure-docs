---
title: Azure security baseline for Virtual Network NAT
description: The Virtual Network NAT security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 01/01/2000
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Virtual Network NAT

This security
baseline applies guidance from the [Azure Security Benchmark version
1.0](../security/benchmarks/overview-v1.md) to Virtual Network NAT. The Azure Security Benchmark
provides recommendations on how you can secure your cloud solutions on Azure.
The content is grouped by the **security controls** defined by the Azure
Security Benchmark and the related guidance applicable to Virtual Network NAT. **Controls** not applicable to Virtual Network NAT have been excluded.

 
To see how Virtual Network NAT completely maps to the Azure
Security Benchmark, see the [full Virtual Network NAT security baseline mapping
file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network security

*For more information, see the [Azure Security Benchmark: Network security](../security/benchmarks/security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33768.).

**Guidance**: Virtual Network NAT provides outbound originated connectivity for a virtual network. When a NAT gateway resource is assigned to a subnet, the default route from the subnet is mapped to the NAT gateway resource without customer action. Inbound traffic is only allowed in response to an outbound originated flow.  Network security groups (NSG) can be used for resources on a subnet using a NAT gateway, but don't apply to outbound originated traffic through NAT gateway resources.  NSG flow logs can be used to monitor traffic traversing a NAT gateway resource.

- [Virtual Network NAT overview](nat-overview.md)

- [NAT gateway resource](nat-gateway-resource.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and NICs

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33769.).

**Guidance**: Virtual Network NAT doesn't support controlling outbound traffic with network security groups (NSG).  Inbound traffic is only allowed in response to an outbound originated flow.

However, network security group (NSG) flow logs can be used with NAT gateway resources to monitor outbound originated traffic.

Use Azure Security Center and follow the network protection recommendations to help secure your Azure network resources. Enable network security group flow logs and send the logs to an Azure Storage account for auditing. You can also send the flow logs to a Log Analytics workspace and then use Traffic Analytics to provide insights into traffic patterns in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity, identify hot spots and security threats, understand traffic flow patterns, and pinpoint network misconfigurations. 

- [Virtual Network NAT overview](nat-overview.md)

- [NAT gateway resource](nat-gateway-resource.md)

- [How to enable network security group flow logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md) 

- [How to enable and use Traffic Analytics](../network-watcher/traffic-analytics.md)

- [Understand network security provided by Azure Security Center](../security-center/security-center-network-recommendations.md)

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Customer

### 1.3: Protect critical web applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33770.).

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.4: Deny communications with known malicious IP addresses

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33771.).

**Guidance**: Not applicable; Virtual Network NAT doesn't support controlling outbound traffic with network security groups (NSG).  Inbound traffic is only allowed in response to an outbound originated flow.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.5: Record network packets

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33772.).

**Guidance**: Enable Network Watcher packet capture to investigate anomalous activities. 

- [How to create a Network Watcher instance](../network-watcher/network-watcher-create.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33773.).

**Guidance**: Not applicable; not supported within NAT gateway resources themselves.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.7: Manage traffic to web applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33774.).

**Guidance**: Not applicable.  Virtual Network NAT provides outbound originated connectivity.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.8: Minimize complexity and administrative overhead of network security rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33775.).

**Guidance**: Virtual Network NAT doesn't support controlling outbound traffic with network security groups (NSG).  Inbound traffic is only allowed in response to an outbound originated flow.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.9: Maintain standard security configurations for network devices

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33776.).

**Guidance**: Define and implement standard security configurations for subnets configured with NAT gateway resources using built-in or custom Azure Policy definitions and assignments.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Azure Policy samples for networking](/azure/governance/policy/samples/#network)

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Customer

### 1.10: Document traffic configuration rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33777.).

**Guidance**: Virtual Network NAT doesn't support controlling outbound traffic with network security groups (NSG).  Inbound traffic is only allowed in response to an outbound originated flow.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.11: Use automated tools to monitor network resource configurations and detect changes

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33778.).

**Guidance**: Use Azure Activity log to monitor resource configurations and detect changes to your NAT gateway resources and virtual network resources. Create alerts in Azure Monitor to notify you when critical resources are changed.

- [How to view and retrieve Azure Activity log events](/azure/azure-monitor/platform/activity-log-view)

- [How to create alerts in Azure Monitor](../azure-monitor/platform/alerts-activity-log.md)

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Customer

## Logging and monitoring

*For more information, see the [Azure Security Benchmark: Logging and monitoring](../security/benchmarks/security-control-logging-monitoring.md).*

### 2.1: Use approved time synchronization sources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33779.).

**Guidance**: Not Applicable; Azure Network NAT does not support configuring your own time synchronization sources. The Azure Network NAT service relies on Microsoft time synchronization sources, and is not exposed to customers for configuration.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 2.2: Configure central security log management

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33780.).

**Guidance**: Ingest logs related to Virtual Network NAT via Azure Monitor to aggregate security data generated by endpoint devices, network resources, and other security systems. In Azure Monitor, use Log Analytics workspaces to query and perform analytics, and use Azure Storage accounts for long term and archival storage.

Alternatively, you can enable and on-board this data to Azure Sentinel or a third-party SIEM.

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md) 

- [How to collect platform logs and metrics with Azure Monitor](../azure-monitor/platform/diagnostic-settings.md) 

- [How to get started with Azure Monitor and third-party SIEM integration](https://azure.microsoft.com/blog/use-azure-monitor-to-integrate-with-siem-tools/) 

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33781.).

**Guidance**: Activity logs, which are automatically available, contain all write operations (PUT, POST, DELETE) for your NAT gateway resources except read operations (GET). Activity logs can be used to find an error when troubleshooting or to monitor how a user in your organization modified a resource.

- [How to collect platform logs and metrics with Azure Monitor](../azure-monitor/platform/diagnostic-settings.md) 

- [Understand logging and different log types in Azure](../azure-monitor/platform/platform-logs-overview.md) 

Virtual Network NAT currently does not produce any additional diagnostic logs which are configurable by customers.

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.4: Collect security logs from operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33782.).

**Guidance**: Not applicable; Virtual Network NAT does not expose any operating system configurations or security logs to customers. Microsoft is responsible for monitoring the underlying service's compute infrastructure.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 2.5: Configure security log storage retention

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33783.).

**Guidance**: Not applicable; Virtual Network NAT does not currently produce any Azure Activity, or other logs. For this reason, the customer is unable to set retention settings for logs related to the NAT gateway resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.6: Monitor and review Logs

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33784.).

**Guidance**: Not applicable; Virtual Network NAT does not currently produce customer facing logs. For this reason, customers are unable to review and monitor logs related to NAT gateway resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.7: Enable alerts for anomalous activities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33785.).

**Guidance**: Use Azure Security Center with Log Analytics workspace for monitoring and alerting on anomalous activity found in security logs and events. Instead, you can enable and on-board data to Azure Sentinel.

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md) 

- [How to manage alerts in Azure Security Center](../security-center/security-center-managing-and-responding-alerts.md) 

- [How to alert on log analytics log data](../azure-monitor/learn/tutorial-response.md) 

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.8: Centralize anti-malware logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33786.).

**Guidance**: Not Applicable; Virtual Network NAT does not produce or expose any anti-malware logging to customers. For all Microsoft managed resources, Microsoft handles the anti-malware logging.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 2.9: Enable DNS query logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33787.).

**Guidance**: Not applicable; Virtual Network NAT does not produce or process DNS query logs.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.10: Enable command-line audit logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33788.).

**Guidance**: 
Not applicable; Virtual Network NAT does not expose a command line to users.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Identity and access control

*For more information, see the [Azure Security Benchmark: Identity and access control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33789.).

**Guidance**: Not applicable; Virtual Network NAT doesn't use administrative accounts.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 3.2: Change default passwords where applicable

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33790.).

**Guidance**: Not Applicable; Virtual Network NAT doesn't have default passwords.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 3.3: Use dedicated administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33791.).

**Guidance**: Not applicable; Virtual Network NAT doesn't use dedicated administrative accounts.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 3.4: Use single sign-on (SSO) with Azure Active Directory

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33792.).

**Guidance**: Not applicable; Virtual Network NAT doesn't support SSO.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33793.).

**Guidance**: Not applicable; Virtual Network NAT doesn't support multi-factor authentication.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33794.).

**Guidance**: Not applicable; Virtual Network NAT doesn't support management from a customer workstation.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 3.7: Log and alert on suspicious activities from administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33795.).

**Guidance**: Not applicable; Virtual Network NAT doesn't use any administrative accounts.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 3.8: Manage Azure resources only from approved locations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33796.).

**Guidance**: Not applicable; Virtual Network NAT doesn't support capability of approved location as condition for access.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 3.9: Use Azure Active Directory

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33797.).

**Guidance**: Not applicable; Virtual Network NAT is not integrated with Azure Active Directory.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 3.10: Regularly review and reconcile user access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33798.).

**Guidance**: Not applicable; Virtual Network NAT doesn't support the capability for user access review and reconcile.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 3.11: Monitor attempts to access deactivated credentials

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33799.).

**Guidance**: Not applicable; Virtual Network NAT doesn't have capabilities to monitor deactivated credentials.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 3.12: Alert on account login behavior deviation

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33800.).

**Guidance**: Not applicable; Virtual Network NAT doesn't support capabilities to detect account login behavior deviation.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33801.).

**Guidance**: Not applicable; Virtual Network NAT doesn't store customer data.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Data protection

*For more information, see the [Azure Security Benchmark: Data protection](../security/benchmarks/security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive Information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33802.).

**Guidance**: Not applicable; Virtual Network NAT doesn't store customer data.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 4.2: Isolate systems storing or processing sensitive information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33803.).

**Guidance**: Not applicable; Virtual Network NAT does not interact with systems storing or processing sensitive information by design. This control is intended to describe how to monitor and block unauthorized transfer of sensitive information.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 4.3: Monitor and block unauthorized transfer of sensitive information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33804.).

**Guidance**: Not applicable; Virtual Network NAT does not interact with systems storing or processing sensitive information by design. This control is intended to describe how to monitor and block unauthorized transfer of sensitive information.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 4.4: Encrypt all sensitive information in transit

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33805.).

**Guidance**: Not applicable; Virtual Network NAT does not store sensitive information by design. This control is intended to describe how to monitor and block unauthorized transfer of sensitive information.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 4.5: Use an active discovery tool to identify sensitive data

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33806.).

**Guidance**: Not applicable; Virtual Network NAT does not store sensitive information by design. This control is intended to describe how to monitor and block unauthorized transfer of sensitive information.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 4.6: Use Azure RBAC to manage access to resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33807.).

**Guidance**: Virtual Network NAT does not support integration with Azure Active Directory (AAD), because of this you can not leverage RBAC features with it.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 4.7: Use host-based data loss prevention to enforce access control

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33808.).

**Guidance**: Not applicable; Virtual Network NAT does not interact with compute hosts or containers which offer host-based data loss prevention.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 4.8: Encrypt sensitive information at rest

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33809.).

**Guidance**: Not applicable; Virtual Network NAT does not store sensitive information by design. This control is intended to describe how to monitor and block unauthorized transfer of sensitive information.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 4.9: Log and alert on changes to critical Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33810.).

**Guidance**: Not applicable; Virtual Network NAT does not store sensitive information by design. This control is intended to describe how to monitor and block unauthorized transfer of sensitive information.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Vulnerability management

*For more information, see the [Azure Security Benchmark: Vulnerability management](../security/benchmarks/security-control-vulnerability-management.md).*

### 5.1: Run automated vulnerability scanning tools

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33811.).

**Guidance**: Not applicable

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 5.2: Deploy automated operating system patch management solution

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33812.).

**Guidance**: Not applicable; Microsoft performs patch management on the underlying operating systems that support Virtual Network NAT.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 5.3: Deploy an automated patch management solution for third-party software titles

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33813.).

**Guidance**: 
Not applicable; Virtual Network NAT doesn't support third-party software installations.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 5.4: Compare back-to-back vulnerability scans

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33814.).

**Guidance**: Not applicable.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33815.).

**Guidance**: Not applicable

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Inventory and asset management

*For more information, see the [Azure Security Benchmark: Inventory and asset management](../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33816.).

**Guidance**: Use Azure Resource Graph to query/discover all resources (such as compute, storage, network, ports, and protocols and so on) within your subscriptions. 

Ensure appropriate (read) permissions in your tenant and enumerate all Azure subscriptions and resources within your subscriptions.

Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use Azure Resource Manager based resources going forward.

- [Azure Resource Graph queries](../governance/resource-graph/first-query-portal.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.2: Maintain asset metadata

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33817.).

**Guidance**: Apply tags to your Azure resources, resource groups, and subscriptions to logically organize them into a taxonomy. Each tag consists of a name and a value pair. For example, you can apply the name "Environment" and the value "Production" to all the resources in production.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.3: Delete unauthorized Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33818.).

**Guidance**: Apply tags for management of Azure resources.

- [How to create additional Azure subscriptions](/azure/billing/billing-create-subscription) 

- [How to create Management Groups](/azure/governance/management-groups/create) 

- [How to create and use Tags](/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.4: Define and maintain an inventory of approved Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33819.).

**Guidance**: Not applicable

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.5: Monitor for unapproved Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33820.).

**Guidance**: 
Use Azure Policy to put restrictions on the type of resources that can be created in your subscription(s).
Use Azure Resource Graph to query/discover resources within their subscription(s). Ensure that all Azure resources present in the environment are approved.
- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md) 
- [How to create queries with Azure Graph](../governance/resource-graph/first-query-portal.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.6: Monitor for unapproved software applications within compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33821.).

**Guidance**: Not applicable

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.7: Remove unapproved Azure resources and software applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33822.).

**Guidance**: Not applicable

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.8: Use only approved applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33823.).

**Guidance**: Not applicable.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.9: Use only approved Azure services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33824.).

**Guidance**: Use Azure Policy to restrict which services you can provision in your environment. 

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md) 

- [How to deny a specific resource type with Azure Policy](/azure/governance/policy/samples/not-allowed-resource-types)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.10: Maintain an inventory of approved software titles

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33825.).

**Guidance**: Not applicable

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.11: Limit users' ability to interact with Azure Resource Manager

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33826.).

**Guidance**: Not applicable.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.12: Limit users' ability to execute scripts in compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33827.).

**Guidance**: Not applicable.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.13: Physically or logically segregate high risk applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33828.).

**Guidance**: Not applicable.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Secure configuration

*For more information, see the [Azure Security Benchmark: Secure configuration](../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33829.).

**Guidance**: 
Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.2: Establish secure operating system configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33830.).

**Guidance**: 
Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.3: Maintain secure Azure resource configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33831.).

**Guidance**: Not applicable

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.4: Maintain secure operating system configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33832.).

**Guidance**: 
Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.5: Securely store configuration of Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33833.).

**Guidance**: 
Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.6: Securely store custom operating system images

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33834.).

**Guidance**: 
Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.7: Deploy configuration management tools for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33835.).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.8: Deploy configuration management tools for operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33836.).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.9: Implement automated configuration monitoring for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33837.).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.10: Implement automated configuration monitoring for operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33838.).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.11: Manage Azure secrets securely

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33839.).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.12: Manage identities securely and automatically

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33840.).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.13: Eliminate unintended credential exposure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33841.).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Malware defense

*For more information, see the [Azure Security Benchmark: Malware defense](../security/benchmarks/security-control-malware-defense.md).*

### 8.1: Use centrally managed antimalware software

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33842.).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33843.).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 8.3: Ensure antimalware software and signatures are updated

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33844.).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Data recovery

*For more information, see the [Azure Security Benchmark: Data recovery](../security/benchmarks/security-control-data-recovery.md).*

### 9.1: Ensure regular automated back ups

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33845.).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 9.2: Perform complete system backups and backup any customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33846.).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 9.3: Validate all backups including customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33847.).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 9.4: Ensure protection of backups and customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33848.).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Incident response

*For more information, see the [Azure Security Benchmark: Incident response](../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33849.).

**Guidance**: 
An incident response procedure should be created for the offering to ensure appropriate incident response processes can occur so that it receives the appropriate level of prioritization till the incidents resolution.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33850.).

**Guidance**: 
An incident scoring and prioritization procedure should be created for the offering to ensure proper risk or threat scoring can occur so that it receives the appropriate level of prioritization till the incidents resolution.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.3: Test security response procedures

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33855.).

**Guidance**: 
An incident security response procedure should be created and tested for the offering to ensure proper mitigation can occur with the appropriate level of prioritization till the incidents forecasted resolution.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33851.).

**Guidance**: 
An incident security response procedure should be created and tested for the offering to ensure proper mitigation can occur with the appropriate level of prioritization till the incidents forecasted resolution.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33852.).

**Guidance**: An incident security response procedure should be created and tested for the offering to ensure proper mitigation can occur with the appropriate level of prioritization till the incidents forecasted resolution.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33853.).

**Guidance**: 
An incident security response procedure should be created and tested for the offering to ensure proper mitigation can occur with the appropriate level of prioritization till the incidents forecasted resolution.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Penetration tests and red team exercises

*For more information, see the [Azure Security Benchmark: Penetration tests and red team exercises](../security/benchmarks/security-control-penetration-tests-red-team-exercises.md).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33854.).

**Guidance**: Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications. 

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1) 

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Next steps

- See the [Azure security benchmark](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
