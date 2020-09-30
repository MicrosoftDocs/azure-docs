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

This security baseline applies guidance from the [Azure Security Benchmark](https://docs.microsoft.com/azure/security/benchmarks/overview) to Virtual
Network NAT. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Virtual
Network NAT. **Controls** not applicable to Virtual
Network NAT have been excluded. To see how Virtual
Network NAT completely maps to the Azure Security Benchmark, see the [full Virtual
Network NAT security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network security

*For more information, see the [Azure Security Benchmark: Network security](https://docs.microsoft.com/azure/security/benchmarks/security-control-network-security).*

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and NICs

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33769.).

**Guidance**: Virtual Network NAT doesn't support controlling outbound traffic with network security groups (NSG).  Inbound traffic is only allowed in response to an outbound originated flow.

However, network security group (NSG) flow logs can be used with NAT gateway resources to monitor outbound originated traffic.

Use Azure Security Center and follow the network protection recommendations to help secure your Azure network resources. Enable network security group flow logs and send the logs to an Azure Storage account for auditing. You can also send the flow logs to a Log Analytics workspace and then use Traffic Analytics to provide insights into traffic patterns in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity, identify hot spots and security threats, understand traffic flow patterns, and pinpoint network misconfigurations. 

- [Virtual Network NAT overview](https://docs.microsoft.com/azure/virtual-network/nat-overview)

- [NAT gateway resource](https://docs.microsoft.com/azure/virtual-network/nat-gateway-resource)

- [How to enable network security group flow logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal) 

- [How to enable and use Traffic Analytics](https://docs.microsoft.com/azure/network-watcher/traffic-analytics)

- [Understand network security provided by Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-network-recommendations)

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Customer

### 1.5: Record network packets

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33772.).

**Guidance**: Enable Network Watcher packet capture to investigate anomalous activities. 

- [How to create a Network Watcher instance](https://docs.microsoft.com/azure/network-watcher/network-watcher-create)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.9: Maintain standard security configurations for network devices

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33776.).

**Guidance**: Define and implement standard security configurations for subnets configured with NAT gateway resources using built-in or custom Azure Policy definitions and assignments.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [Azure Policy samples for networking](https://docs.microsoft.com/azure/governance/policy/samples/#network)

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Customer

### 1.11: Use automated tools to monitor network resource configurations and detect changes

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33778.).

**Guidance**: Use Azure Activity log to monitor resource configurations and detect changes to your NAT gateway resources and virtual network resources. Create alerts in Azure Monitor to notify you when critical resources are changed.

- [How to view and retrieve Azure Activity log events](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view)

- [How to create alerts in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Customer

## Logging and monitoring

*For more information, see the [Azure Security Benchmark: Logging and monitoring](https://docs.microsoft.com/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.2: Configure central security log management

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33780.).

**Guidance**: Ingest logs related to Virtual Network NAT via Azure Monitor to aggregate security data generated by endpoint devices, network resources, and other security systems. In Azure Monitor, use Log Analytics workspaces to query and perform analytics, and use Azure Storage accounts for long term and archival storage.

Alternatively, you can enable and on-board this data to Azure Sentinel or a third-party SIEM.

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard) 

- [How to collect platform logs and metrics with Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings) 

- [How to get started with Azure Monitor and third-party SIEM integration](https://azure.microsoft.com/blog/use-azure-monitor-to-integrate-with-siem-tools/) 

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33781.).

**Guidance**: Activity logs, which are automatically available, contain all write operations (PUT, POST, DELETE) for your NAT gateway resources except read operations (GET). Activity logs can be used to find an error when troubleshooting or to monitor how a user in your organization modified a resource.

- [How to collect platform logs and metrics with Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings) 

- [Understand logging and different log types in Azure](https://docs.microsoft.com/azure/azure-monitor/platform/platform-logs-overview) 

Virtual Network NAT currently does not produce any additional diagnostic logs which are configurable by customers.

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33785.).

**Guidance**: Use Azure Security Center with Log Analytics workspace for monitoring and alerting on anomalous activity found in security logs and events. Instead, you can enable and on-board data to Azure Sentinel.

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard) 

- [How to manage alerts in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-managing-and-responding-alerts) 

- [How to alert on log analytics log data](https://docs.microsoft.com/azure/azure-monitor/learn/tutorial-response) 

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Inventory and asset management

*For more information, see the [Azure Security Benchmark: Inventory and asset management](https://docs.microsoft.com/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use automated asset discovery solution

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33816.).

**Guidance**: Use Azure Resource Graph to query/discover all resources (such as compute, storage, network, ports, and protocols and so on) within your subscriptions. 

Ensure appropriate (read) permissions in your tenant and enumerate all Azure subscriptions and resources within your subscriptions.

Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use Azure Resource Manager based resources going forward.

- [Azure Resource Graph queries](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

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

- [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/billing/billing-create-subscription) 

- [How to create Management Groups](https://docs.microsoft.com/azure/governance/management-groups/create) 

- [How to create and use Tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.5: Monitor for unapproved Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33820.).

**Guidance**: 
Use Azure Policy to put restrictions on the type of resources that can be created in your subscription(s).
Use Azure Resource Graph to query/discover resources within their subscription(s). Ensure that all Azure resources present in the environment are approved.
- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage) 
- [How to create queries with Azure Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.9: Use only approved Azure services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33824.).

**Guidance**: Use Azure Policy to restrict which services you can provision in your environment. 

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage) 

- [How to deny a specific resource type with Azure Policy](https://docs.microsoft.com/azure/governance/policy/samples/not-allowed-resource-types)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Incident response

*For more information, see the [Azure Security Benchmark: Incident response](https://docs.microsoft.com/azure/security/benchmarks/security-control-incident-response).*

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

*For more information, see the [Azure Security Benchmark: Penetration tests and red team exercises](https://docs.microsoft.com/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

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
