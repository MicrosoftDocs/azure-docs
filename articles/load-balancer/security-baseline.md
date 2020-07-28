---
title: Azure security baseline for Azure Load Balancer
description: The Azure Load Balancer security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: load-balancer
ms.topic: conceptual
ms.date: 07/27/2020
ms.author: mbaldwin
ms.custom: security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Load Balancer

The Azure Security Baseline for Azure Load Balancer contains recommendations that will help you improve the security posture of your deployment. The baseline for this service is drawn from the [Azure Security Benchmark version 1.0](https://docs.microsoft.com/azure/security/benchmarks/overview), which provides recommendations on how you can secure your cloud solutions on Azure with our best practices guidance. For more information, see [Azure Security Baselines overview](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network security

*For more information, see [Security control: Network security](/azure/security/benchmarks/security-control-network-security).*

### 1.1: Protect Azure resources within virtual networks

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32349).

**Guidance**: An Azure Load Balancer (ALB) operates at layer four of the Open Systems Interconnection (OSI) model, evenly distributing load (incoming network traffic) across a group of backend pool instances such as Azure Virtual Machines or instances in a virtual machine scale set.

Based on how an ALB is deployed, it can be public (external) or internal (private). An Internal load balancer balances traffic within a VNET, where as an external load balancers balances traffic to and from an internet connected endpoint.

A public load balancer can provide outbound connections for virtual machines (VMs) inside a virtual network by translating their private IP addresses to public IP addresses. An internal (or private) load balancer manages traffic within a Virtual Network (VNet), and is used where private IPs are needed  at the frontend for access from an on-premises network in a hybrid scenario. 

Azure offers two types of Azure Load Balancer (ALB) offerings, Standard and Basic.

Standard ALB is built on the zero trust network security model, secure by default and part of a virtual network which is a private and isolated network. This means the Standard ALB is closed to inbound flows unless opened by Network Security Groups (NSG) to explicitly permit allowed traffic. If there is not an NSG on a subnet or NIC of your virtual machine resource, traffic is not allowed to reach this resource. 
A Basic ALB is open to the internet by default, with an NSG as optional.

For a Standard ALB, the VMs in the backend address for are required to have network interfaces that belong to a network security group.
It is important to note that when the external clients to the backend-pool Virtual Machines (VM) go through the load balancer, the IP address of these (VM)  clients will be used for the communication. Make sure the IP address of the clients are added into the NSG allow list, otherwise NSGs can be used to refrain Internet traffic from reaching these VMs by creating an NSG rule on the Network Interface of the VMs. 
NSGs can also be used to manage which public destination can initiate inbound flows. 

Additionally NAT rules can be used to route traffic to a backend resource. For example, they can be used to configure a specific load balancer port to send RDP traffic to a specific VM in the backend-pool. 
An inbound NAT rule can be used to forward incoming traffic sent to Frontend IP address and port combination. The traffic is sent to a specific virtual machine or instance in the backend pool. Port forwarding is done by the same hash-based distribution as load balancing.
An outbound rule configures outbound Network Address Translation (NAT) for all virtual machines or instances identified by the backend pool. This rule enables instances in the backend to communicate (outbound) to the internet or other endpoints.

With outbound rules, you can use Load Balancer to define outbound NAT from scratch. You can also scale and tune the behavior of existing outbound NAT.

Outbound rules allow you to control:

which virtual machines should be translated to which public IP addresses.
how outbound SNAT ports should be allocated.
which protocols to provide outbound translation for.
what duration to use for outbound connection idle timeout (4-120 minutes).
whether to send a TCP Reset on idle timeout
both TCP and UDP transport protocols with a single rule

https://docs.microsoft.com/azure/load-balancer/load-balancer-outbound-connections#outboundrules

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and NICs

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32350).

**Guidance**: A public load balancer can provide outbound connections for virtual machines (VMs) inside a virtual network by translating their private IP addresses to public IP addresses. An internal (or private) load balancer to manage traffic within a Virtual Network (VNet), and is used where private IPs are needed  at the frontend for access from an on-premises network in a hybrid scenario. 

Azure Cloud offers two types of Azure Load Balancer (ALB) offerings, Standard and Basic.

Standard ALB is built on the zero trust network security model, secure by default and part of a virtual network, a private and isolated network. This means the Standard ALB is closed to inbound flows unless opened by Network Security Groups (NSG) to explicitly permit allowed traffic. If there is not an NSG on a subnet or NIC of your virtual machine resource, traffic is not allowed to reach this resource. 
A Basic ALB is open to the internet by default, with an NSG as optional.

Web Worker Roles without a VNet and other Microsoft platform services can be accessible when only an internal Standard Load Balancer. You must always assume you need to create outbound connectivity explicitly if desired when using an internal Standard Load Balancer only. 

Azure load balancing services can be categorized along two dimensions: global versus regional, and HTTP(S) versus non-HTTP(S).

Global load-balancing services distribute traffic across regional backends, clouds, or hybrid on-premises services. These services route end-user traffic to the closest available backend. They also react to changes in service reliability or performance, in order to maximize availability and performance. You can think of them as systems that load balance between application stamps, endpoints, or scale-units hosted across different regions/geographies.

Regional load-balancing services distribute traffic within virtual networks across virtual machines (VMs) or zonal and zone-redundant service endpoints within a region. You can think of them as systems that load balance between VMs, containers, or clusters within a region in a virtual network.

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.3: Protect critical web applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32351).

**Guidance**: &lt;-- need confirmation - this may not be a recommended solution to use an WAF with App Gateway in front of an ALB --&gt;

The ALB doesn't directly interact with TCP or UDP or the application layer. As the ALB doesn't close or originate flows or interact with the payload of the flow it doesn't provide application layer gateway functionality. Protocol handshakes always occur directly between the client and the back-end pool instance such as a VM.

Deploy Azure Web Application Firewall (WAF) in front of critical web applications for additional protection from common exploits and vulnerabilities.. They are intended for web applications or other HTTP(S) endpoints. They include features such as SSL offload, web application firewall, path-based load balancing, and session affinity.

Enable diagnostic settings for WAF and ingest logs into an Azure Storage account, Azure Event Hub, or Azure Log Analytics Workspace.

- [Application independence and transparency](https://docs.microsoft.com/azure/load-balancer/concepts#application-independence-and-transparency)

- [How to deploy Azure WAF](https://docs.microsoft.com/azure/web-application-firewall/ag/create-waf-policy-ag)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.4: Deny communications with known malicious IP addresses

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32352).

**Guidance**: &lt;-- need confirmation. This seems to be a simple form of protection provided by the Standard ALB. Should this verbiage be adjusted? Also adding platform level protections not dependent upon this offering (ALB)  --&gt;

Standard ALB is built on the zero trust network security model, secure by default and part of a virtual network which is a private and isolated network. This means the Standard ALB is closed to inbound flows unless opened by Network Security Groups (NSG) to explicitly permit allowed traffic, and disallow known malicious IP addresses. If there is not an NSG on a subnet or NIC of your virtual machine resource behind the ALB, traffic is not allowed to reach this resource. 

However,, there are various options at the Azure Platform to prevent communication with malicious IP addresses. These include:

Enable distributed denial of service (DDoS) Standard protection on your Azure Virtual Network to guard against DDoS attacks. 
Deploy Azure Firewall at each of the organization's network boundaries with threat intelligence-based filtering enabled and configured to "Alert and deny" for malicious network traffic.​​ 
Use Azure Security Center  threat protection to detect  communications with known malicious IP addresses. 
​​Use Azure Security Center (Standard Tier) just-in-time virtual machine access, and configure allowed source IP addresses to allow access only from approved IP addresses/ranges.​ ​
Use Azure Security Center Adaptive Network Hardening to recommend network security group configurations that limit ports and source IPs based on actual traffic and threat intelligence.​ 
​​
- [Manage Azure DDoS Protection Standard using the Azure Portal](https://docs.microsoft.com/azure/virtual-network/manage-ddos`protection)

- [Azure Firewall threat intelligence-based filtering](https://docs.microsoft.com/azure/firewall/threat-intel)

- [Threat protection in Azure Security Center](https://docs.microsoft.com/azure/security-center/threat-protection)

- [Secure your management ports with just-in-time access](https://docs.microsoft.com/azure/security-center/security-center-just-in-time)

- [Adaptive Network Hardening in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-adaptive-network-hardening​)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.5: Record network packets

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32353).

**Guidance**: Not available on ALB. However, tt is recommended to enable Network Watcher packet capture to investigate anomalous activities.

- [How to create a Network Watcher instance](https://docs.microsoft.com/azure/network-watcher/network-watcher-create)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32354).

**Guidance**: Not available on ALB. Select an offer from the Azure Marketplace that supports IDS/IPS functionality with payload inspection capabilities.  

When payload inspection is not a requirement, Azure Firewall threat intelligence can be used.

Azure Firewall threat intelligence-based filtering is used to alert on and/or block traffic to and from known malicious IP addresses and domains. The IP addresses and domains are sourced from the Microsoft Threat Intelligence feed.

Deploy the firewall solution of your choice at each of your organization's network boundaries to detect and/or block malicious traffic.

- [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/?term=Firewall)

- [How to deploy Azure Firewall](https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal)

- [How to configure alerts with Azure Firewall](https://docs.microsoft.com/azure/firewall/threat-intel)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.7: Manage traffic to web applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32355).

**Guidance**: &lt;--need confirmation - this may not be a recommended solution to use an WAF with App Gateway in front of an ALB  --&gt;

The ALB doesn't directly interact with TCP or UDP or the application layer. As the ALB doesn't close or originate flows or interact with the payload of the flow it doesn't provide application layer gateway functionality. Protocol handshakes always occur directly between the client and the back-end pool instance such as a VM.

Deploy Azure Web Application Firewall (WAF) in front of critical web applications for additional protection from common exploits and vulnerabilities.. They are intended for web applications or other HTTP(S) endpoints. They include features such as SSL offload, web application firewall, path-based load balancing, and session affinity.

Enable diagnostic settings for WAF and ingest logs into an Azure Storage account, Azure Event Hub, or Azure Log Analytics Workspace.

- [Application independence and transparency](https://docs.microsoft.com/azure/load-balancer/concepts#application-independence-and-transparency)

- [How to deploy Azure WAF](https://docs.microsoft.com/azure/web-application-firewall/ag/create-waf-policy-ag)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.8: Minimize complexity and administrative overhead of network security rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32356).

**Guidance**: You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name in the source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change. 

By default, every network security grou (NSG)p includes the service tag AzureLoadBalancer to permit health probe traffic. 

Refer to Azure documentation which  includes all the service tags available for use in network security group rules: 

- [Available service tags](https://docs.microsoft.com/azure/virtual-network/service-tags-overview#available-service-tags)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.9: Maintain standard security configurations for network devices

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32357).

**Guidance**: Define and implement standard security configurations for network resources with Azure Policy.

You can also use Azure Blueprints to simplify large scale Azure deployments by packaging key environment artifacts, such as Azure Resources Manager templates, RBAC controls, and policies, in a single blueprint definition. You can apply the blueprint to new subscriptions, and fine-tune control and management through versioning.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [Azure Policy samples for networking](https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies#network)

- [How to create an Azure Blueprint](https://docs.microsoft.com/azure/governance/blueprints/create-blueprint-portal)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.10: Document traffic configuration rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32358).

**Guidance**: Use resource tags for network security groups and other resources related to network security and traffic flow. 

For individual network security group rules, use the "Description" field to document the rules that allow traffic to/from a network.

Use any of the built-in Azure Policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with tags and to notify you of existing untagged resources.

You can use Azure PowerShell or Azure CLI to look-up or perform actions on resources based on their tags.

- [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

- [How to create an Azure Virtual Network](https://docs.microsoft.com/azure/virtual-network/quick-create-portal)

- [How to filter network traffic with network security group rules](https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.11: Use automated tools to monitor network resource configurations and detect changes

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32359).

**Guidance**: Use Azure Activity log to monitor resource configurations and detect changes to your Azure resources. 

Create alerts in Azure Monitor to notify you when critical resources are changed.

- [How to view and retrieve Azure Activity log events](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view)

- [How to create alerts in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Logging and monitoring

*For more information, see [Security control: Logging and monitoring](/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.2: Configure central security log management

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32361).

**Guidance**: For Basic ALB, the Control and management plane logging and audit information can be captured with Activity logs, which are enabled by default.
You can use Activity logs to monitor actions on resources to view all activity and their status. Through activity logs, you can determine:
what operations were taken on the resources in your subscription
who started the operation
when the operation occurred
the status of the operation
the values of other properties that might help you research the operation

You can  retrieve information from the activity log through Azure PowerShell, the Azure Command Line Interface (CLI), the Azure REST API, or the Azure portal. 
- [It is recommended to read through this article with step-by-step instructions for each method detailed in the Audit operations with Resource Manager article](https://docs.microsoft.com/azure/azure-resource-manager/management/view-activity-logs)

With Power BI, you can use the Azure Audit Logs content pack for Power BI and analyze your data with pre-configured dashboards, or you can customize views to suit your requirements.

The Standard ALB provides multi-dimensional diagnostic capabilities through Azure Monitor for standard load balancer configurations. Available metrics for security include infromation on Source Network Address Translation (SNAT) connections, ports. Additionally metrics on SYN (synchronize) packets and packet counters are also available. You can also retrieve multi-dimensional metrics programmatically via APIs and they can be written to a storage account via the 'All Metrics' option.

These logs can be streamed to an event hub or a Log Analytics workspace. They can also be extracted from Azure blob storage, and viewed in different tools, such as Excel and Power BI. You can enable and on-board data to Azure Sentinel or a third-party SIEM.

- [Azure Monitor logs for public Basic Load Balancer](https://docs.microsoft.com/azure/load-balancer/load-balancer-monitor-log)

- [View activity logs to monitor actions on resources](https://docs.microsoft.com/azure/azure-resource-manager/management/view-activity-logs)

- [Retrieve multi-dimensional metrics programmatically via APIs](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-diagnostics#retrieve-multi-dimensional-metrics-programmatically-via-apis)

- [How to get started with Azure Monitor and third-party SIEM integration](https://azure.microsoft.com/blog/use-azure-monitor-to-integrate-with-siem-tools)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32362).

**Guidance**: For Basic ALB, the Control and management plane logging and audit information can be captured with Activity logs, which are enabled by default.
You can use Activity logs to monitor actions on resources to view all activity and their status. Through activity logs, you can determine:
what operations were taken on the resources in your subscription
who started the operation
when the operation occurred
the status of the operation
the values of other properties that might help you research the operation

You can  retrieve information from the activity log through Azure PowerShell, the Azure Command Line Interface (CLI), the Azure REST API, or the Azure portal. 
- [It is recommended to read through this article with step-by-step instructions for each method detailed in the Audit operations with Resource Manager article](https://docs.microsoft.com/azure/azure-resource-manager/management/view-activity-logs)

With Power BI, you can use the Azure Audit Logs content pack for Power BI and analyze your data with pre-configured dashboards, or you can customize views to suit your requirements.

The Standard ALB provides multi-dimensional diagnostic capabilities through Azure Monitor for standard load balancer configurations. Available metrics for security include infromation on Source Network Address Translation (SNAT) connections, ports. Additionally metrics on SYN (synchronize) packets and packet counters are also available. You can also retrieve multi-dimensional metrics programmatically via APIs and they can be written to a storage account via the 'All Metrics' option.

These logs can be streamed to an event hub or a Log Analytics workspace. They can also be extracted from Azure blob storage, and viewed in different tools, such as Excel and Power BI. You can enable and on-board data to Azure Sentinel or a third-party SIEM.

- [Azure Monitor logs for public Basic Load Balancer](https://docs.microsoft.com/azure/load-balancer/load-balancer-monitor-log)

- [View activity logs to monitor actions on resources](https://docs.microsoft.com/azure/azure-resource-manager/management/view-activity-logs)

- [Retrieve multi-dimensional metrics programmatically via APIs](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-diagnostics#retrieve-multi-dimensional-metrics-programmatically-via-apis)

- [How to get started with Azure Monitor and third-party SIEM integration](https://azure.microsoft.com/blog/use-azure-monitor-to-integrate-with-siem-tools)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.4: Collect security logs from operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32363).

**Guidance**: Not applicable to Azure Load Balancer as this recommendation applies to IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.5: Configure security log storage retention

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32364).

**Guidance**: The Actitivity log is enabled by default and is preserved for 90 days in Azure's Event Logs store. Within Azure Monitor, you set your Log Analytics workspace retention period according to your organization's compliance regulations. It is recommended to use Azure Storage accounts for long-term and archival storage.

- [View activity logs to monitor actions on resources article](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-audit)
- [Change the data retention period in Log Analytics](https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period)
- [How to configure retention policy for Azure Storage account logs](https://docs.microsoft.com/azure/storage/common/storage-monitor-storage-account#configure-logging)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.6: Monitor and review Logs

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32365).

**Guidance**: Both the Standard ALBs, public and internal, expose per endpoint and backend endpoint health probe status as multi-dimensional metrics through Azure Monitor.  You can monitor, manage, and troubleshoot your standard load balancer resources. The Load Balancer page in the Azure portal and the Resource Health page (under Monitor) expose the Resource Health section for Standard Load Balancer

Basic public ALB exposes health probe status summarized per backend pool via Azure Monitor logs which can be used to check on the public load balancer probe health status and probe count. Azure Monitor logs are not available for internal Basic ALBs. 

You can use different types of logs in Azure to manage and troubleshoot Basic Load Balancers. Some of these logs can be accessed through the portal. 

Activity logs: You can view activity logs to monitor actions on resources to view all activity being submitted to your Azure subscription(s), and their status. Activity logs are enabled by default, and can be viewed in the Azure portal.
Alert event logs: You can use this log to view alerts raised by the load balancer. The status for the load balancer is collected every five minutes. This log is only written if a load balancer alert event is raised.
Health probe logs: You can use this log to view problems detected by your health probe, such as the number of instances in your backend-pool that are not receiving requests from the load balancer because of health probe failures. This log is written to when there is a change in the health probe status.

With Power BI, you can use the Azure Audit Logs content pack for Power BI and analyze your data with pre-configured dashboards, or you can customize views to suit your requirements. Logging can be used with Azure Operational Insights to provide statistics about load balancer health status. 

The Standard ALB provides multi-dimensional diagnostic capabilities through Azure Monitor for standard load balancer configurations. Available metrics for security include infromation on Source Network Address Translation (SNAT) connections, ports. Additionally metrics on SYN (synchronize) packets and packet counters are also available. You can also retrieve multi-dimensional metrics programmatically via APIs and they can be written to a storage account via the 'All Metrics' option.

These logs can be streamed to an event hub or a Log Analytics workspace. They can also be extracted from Azure blob storage, and viewed in different tools, such as Excel and Power BI. You can enable and on-board data to Azure Sentinel or a third-party SIEM.

- [Load Balancer health probes](https://docs.microsoft.com/azure/load-balancer/load-balancer-custom-probe-overview)
- [Azure Monitor REST API](https://docs.microsoft.com/rest/api/monitor/)
- [How to retrieve metrics via REST API](https://docs.microsoft.com/rest/api/monitor/metrics/list)
- [Standard Load Balancer diagnostics with metrics, alerts and resource health](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-diagnostics)
- [Azure Monitor logs for public Basic Load Balancer](https://docs.microsoft.com/azure/load-balancer/load-balancer-monitor-log)
- [View your load balancer metrics in the Azure portal](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-diagnostics#view-your-load-balancer-metrics-in-the-azure-portal)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32366).

**Guidance**: Use Azure Security Center with Log Analytics workspace for monitoring and alerting on anomalous activity related to Azure Load Balancer (ALB) as found in security logs and events.

Alternatively, you can enable and on-board data to Azure Sentinel.

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

- [How to manage alerts in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-managing-and-responding-alerts)

- [How to alert on log analytics log data](https://docs.microsoft.com/azure/azure-monitor/learn/tutorial-response)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.8: Centralize anti-malware logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32367).

**Guidance**: Not applicable to Azure Load Balancer as this recommendation applies to IaaS compute resources.

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.9: Enable DNS query logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32368).

**Guidance**: &lt;--Need confirmation on whether this verbiage is applicable to ALB. It is not clear from documentation if the ALB produces any DNS query logs  --&gt;

You must configure DNS resource records to point to the respective frontend IP address of the Load Balancer being used.For more information about using Azure DNS with
Load Balancer, see Using Azure DNS with other Azure services.

- [How Azure DNS works with other Azure services](https://docs.microsoft.com/azure/dns/dns-for-azure-services)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.10: Enable command-line audit logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32369).

**Guidance**: Not applicable to Azure Load Balancer as this recommendation applies to IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Identity and access control

*For more information, see [Security control: Identity and access control](/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain an inventory of administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32370).

**Guidance**: Azure role-based access control (RBAC) allows you to manage access to Azure resources such as Azure Load Balancer (ALB) through role assignments.

You can assign these roles to users, groups service principals and managed identities. 

There are pre-defined built-in roles for certain resources, and these roles can be inventoried or queried through tools such as Azure CLI, Azure owerShell or the Azure portal.

- [How to get a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0)

- [How to get members of a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.2: Change default passwords where applicable

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32371).

**Guidance**: Azure AD does not have the concept of default passwords. 

Other Azure resources that do require a password force it to be created with complexity requirements and a minimum password length. The requirements differ depending on the service. 

You are responsible for third-party applications and marketplace services that may use default passwords.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.3: Use dedicated administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32372).

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts.

You can also enable a Just-In-Time access by using Azure AD Privileged Identity Management and Azure Resource Manager. 

- [Learn more about Privileged Identity Management](https://docs.microsoft.com/azure/active-directory/privileged-identity-management/)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.4: Use single sign-on (SSO) with Azure Active Directory

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32373).

**Guidance**: Wherever possible, use Azure Active Directory SSO instead of configuring individual stand-alone credentials per-service. 

Use Azure Security Center identity and access recommendations.

- [Understand SSO with Azure AD](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32374).

**Guidance**: Enable Azure AD MFA and follow Azure Security Center identity and access recommendations for Azure Load Balancer (ALB).

- [How to enable MFA in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

- [How to monitor identity and access within Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32375).

**Guidance**: Use a secure, Azure-managed workstation (also known as a Privileged Access Workstation, or PAW) for administrative tasks for Azure Load Balancer (ALB) that require elevated privileges.
​
- [Understand secure, Azure-managed workstations](https://docs.microsoft.com/azure/active-directory/devices/concept-azure-managed-workstation​)

- [How to enable Azure AD MFA](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted​)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.7: Log and alert on suspicious activities from administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32376).

**Guidance**: Use Azure Active Directory security reports and monitoring to detect when suspicious or unsafe activity related to Azure Load Balancer (ALB) occurs in the environment. 

Use Azure Security Center to monitor identity and access activity.

- [How to identify Azure AD users flagged for risky activity](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-user-at-risk)

- [How to monitor users' identity and access activity in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.8: Manage Azure resources only from approved locations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32377).

**Guidance**: Use Azure AD named locations to allow access only to Azure Load Balancer (ALB) from specific logical groupings of IP address ranges or countries/regions.

- [How to configure Azure AD named locations](https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.9: Use Azure Active Directory

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32378).

**Guidance**: Use Azure Active Directory (Azure AD) for Azure Load Balancer (ALB) as the central authentication and authorization system.

Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.

- [How to create and configure an Azure AD instance](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-access-create-new-tenant)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.10: Regularly review and reconcile user access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32379).

**Guidance**: Azure AD provides logs to help discover stale accounts used by or for Azure Load Balancer (ALB). 

In addition, use Azure AD identity and access reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. 

User access can be reviewed on a regular basis to make sure only the right users have continued access. 

- [Understand Azure AD reporting](https://docs.microsoft.com/azure/active-directory/reports-monitoring/)

- [How to use Azure AD identity and access reviews](https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.11: Monitor attempts to access deactivated credentials

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32380).

**Guidance**: You have access to Azure AD sign-in activity, audit, and risk event log sources, which allow you to integrate with any SIEM/monitoring tool.

You can streamline this process by creating diagnostic settings for Azure AD user accounts and sending the audit logs and sign-in logs to a Log Analytics workspace. 

You can configure desired alerts within Log Analytics workspace.

- [How to integrate Azure activity logs with Azure Monitor](https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.12: Alert on account login behavior deviation

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32381).

**Guidance**: Use Azure AD Identity Protection features to configure automated responses to detected suspicious actions related to user identities for  Azure Load Balancer (ALB). 

You can also ingest data into Azure Sentinel for further investigation.

- [How to view Azure AD risky sign-ins](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risky-sign-ins)

- [How to configure and enable Identity Protection risk policies](https://docs.microsoft.com/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies)

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32382).

**Guidance**: In support scenarios where Microsoft needs to access customer data, Customer Lockbox provides an interface for you to review and approve or reject customer data access requests.

- [Understand Customer Lockbox](https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Data protection

*For more information, see [Security control: Data protection](/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an inventory of sensitive Information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32383).

**Guidance**: Use tags to assist in tracking Azure resources such as  Azure Load Balancer (ALB) that store or process sensitive information.

- [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32384).

**Guidance**: Implement isolation using separate subscriptions and management groups for individual security domains such as environment type and data sensitivity level. 

You can restrict the level of access to your Azure resources that your applications and enterprise environments demand. You can control access to Azure resources via Azure Active Directory RBAC.

- [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/billing/billing-create-subscription)

- [How to create management groups](https://docs.microsoft.com/azure/governance/management-groups/create)

- [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.3: Monitor and block unauthorized transfer of sensitive information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32385).

**Guidance**: Use a third-party solution from Azure Marketplace in network perimeters to monitor for unauthorized transfer of sensitive information and block such transfers while alerting information security professionals.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and guards against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 4.4: Encrypt all sensitive information in transit

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32386).

**Guidance**: Not applicable to Azure Load Balancer (ALB). It is however recommened to ensure that any clients connecting to your Azure resources are able to negotiate TLS 1.2 or greater. 

Follow Azure Security Center recommendations for encryption at rest and encryption in transit, where applicable.

- [Understand encryption in transit with Azure](https://docs.microsoft.com/azure/security/fundamentals/encryption-overview#encryption-of-data-in-transit)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### 4.5: Use an active discovery tool to identify sensitive data

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32387).

**Guidance**: Not applicable to Azure Load Balancer (ALB). When no discovery feature is available for your specific service in Azure, use a third-party active discovery tool to identify all sensitive information stored, processed, or transmitted by the organization's technology systems, including those located on-site, or at a remote service provider, and then update the organization's sensitive information inventory.

Use Azure AD Information Protection for identifying sensitive information within Office 365 documents.

Use Azure SQL Data Discovery &amp; Classification to assist in the classification and labeling of information stored in Azure SQL Databases.

- [How to implement Azure SQL Data Discovery &amp; Classification](https://docs.microsoft.com/azure/sql-database/sql-database-data-discovery-and-classification)

- [How to implement Azure Information Protection](https://docs.microsoft.com/azure/information-protection/deployment-roadmap)

- [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 4.6: Use Azure RBAC to manage access to resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32388).

**Guidance**: Use Azure AD RBAC to control access to Azure Load Balancer (ALB) related data and resources, otherwise use service specific access control methods.

- [How to configure RBAC in Azure](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 4.7: Use host-based data loss prevention to enforce access control

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32389).

**Guidance**: Not applicable to Azure Load Balancer (ALB) as this recommendation is for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 4.8: Encrypt sensitive information at rest

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32390).

**Guidance**: Use  encryption at rest on all Azure resources such as Azure Load Balancer (ALB). Microsoft recommends allowing Azure to manage your encryption keys, however, there is an option for you to manage your own keys in some instances. 

- [Understand encryption at rest in Azure](https://docs.microsoft.com/azure/security/fundamentals/encryption-atrest)

- [How to configure customer managed encryption keys](https://docs.microsoft.com/azure/storage/common/storage-encryption-keys-portal)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.9: Log and alert on changes to critical Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32391).

**Guidance**: Use Azure Monitor with the Azure Activity log to create alerts when changes take place to critical Azure resources such as Azure Load Balancer (ALB).

- [How to create alerts for Azure Activity log events](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Vulnerability management

*For more information, see [Security control: Vulnerability management](/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.1: Run automated vulnerability scanning tools

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32392).

**Guidance**: Follow recommendations from Azure Security Center for performing vulnerability assessments on your Azure virtual machines, container images, and SQL servers.

Use a third-party solution for performing vulnerability assessments on network devices and web applications. 

When conducting remote scans, do not use a single, perpetual, administrative account. 
Consider implementing JIT provisioning methodology for the scan account. 

Credentials for the scan account should be protected, monitored, and used only for vulnerability scanning.

- [How to implement Azure Security Center vulnerability assessment recommendations](https://docs.microsoft.com/azure/security-center/security-center-vulnerability-assessment-recommendations)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 5.2: Deploy automated operating system patch management solution

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32393).

**Guidance**: Not applicable to Azure Load Balancer (ALB) as this recommendation is for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 5.3: Deploy an automated patch management solution for third-party software titles

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32394).

**Guidance**: Not applicable to Azure Load Balancer (ALB) as this recommendation is for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 5.4: Compare back-to-back vulnerability scans

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32395).

**Guidance**: Not applicable to Azure Load Balancer (ALB) as this recommendation is for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32396).

**Guidance**: Use a common risk scoring program (for example, Common Vulnerability Scoring System) or the default risk ratings provided by your third-party scanning tool.

- [NIST Publication--Common Vulnerability Scoring System](https://www.nist.gov/publications/common-vulnerability-scoring-system)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Inventory and asset management

*For more information, see [Security control: Inventory and asset management](/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use automated asset discovery solution

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32397).

**Guidance**: Use Azure Resource Graph to query for and discover all resources (such as compute, storage, network, ports, and protocols etc.) in your subscriptions.  

Ensure appropriate (read) permissions in your tenant and enumerate all Azure subscriptions as well as resources in your subscriptions.

Although classic Azure resources may be discovered via Azure Resource Graph Explorer, it is highly recommended to create and use Azure Resource Manager resources going forward.

- [How to create queries with Azure Resource Graph Explorer](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

- [How to view your Azure subscriptions](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0)

- [Understand Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/overview)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 6.2: Maintain asset metadata

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32398).

**Guidance**: Use Policy Name, Description, and Category to logically organize assets according to a taxonomy for your Azure Load Balancer (ALB) instances.
​
- [For more information about tagging assets, see Resource naming and tagging decision guide](https://docs.microsoft.com/azure/cloud-adoption-framework/decision-guides/resource-tagging/?toc=/azure/azure-resource-manager/management/toc.json​)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.3: Delete unauthorized Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32399).

**Guidance**: Use tagging, management groups, and separate subscriptions where appropriate, to organize and track assets. 

Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

- [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/billing/billing-create-subscription)

- [How to create management groups](https://docs.microsoft.com/azure/governance/management-groups/create)

- [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 6.4: Define and maintain an inventory of approved Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32400).

**Guidance**: Create an inventory of approved Azure resources such as Azure Load Balancer (ALB) and approved software for compute resources as per your organizational needs.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.5: Monitor for unapproved Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32401).

**Guidance**: Not applicable to Azure Load Balancer (ALB). It is recommended to use Azure Policy to put restrictions on the type of resources that can be created in your subscriptions.

Use Azure Resource Graph to query for and discover resources within their subscriptions.  Ensure that all Azure resources present in the environment are approved.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [How to create queries with Azure Resource Graph Explorer](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.6: Monitor for unapproved software applications within compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32402).

**Guidance**: Not applicable to Azure Load Balancer (ALB) as this recommendation is for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.7: Remove unapproved Azure resources and software applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32403).

**Guidance**: Use Azure Security Center's File Integrity Monitoring (FIM) to identify all software installed on VMs. 

Another option that can be used instead of or in conjunction with FIM is Azure Automation Change Tracking and Inventory to collect inventory from your Linux and Windows VMs. 

You can implement your own process for removing unauthorized software. You can also use a third party solution to identify unapproved software.

Remove Azure resources when they are no longer needed.

- [How to use File Integrity Monitoring](https://docs.microsoft.com/azure/security-center/security-center-file-integrity-monitoring#using-file-integrity-monitoring)

Understand Azure Automation Change Tracking and Inventory
https://docs.microsoft.com/azure/automation/change-tracking

- [How to enable Azure virtual machine inventory](https://docs.microsoft.com/azure/automation/automation-tutorial-installed-software)

- [Azure resource group and resource deletion](https://docs.microsoft.com/azure/azure-resource-manager/management/delete-resource-group)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 6.8: Use only approved applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32404).

**Guidance**: Use Azure Security Center adaptive application controls to ensure that only authorized software executes and all unauthorized software is blocked from executing on Azure Virtual Machines used in your subscriptions.

- [How to use Azure Security Center adaptive application controls](https://docs.microsoft.com/azure/security-center/security-center-adaptive-application)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 6.9: Use only approved Azure services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32405).

**Guidance**: Use Azure Policy to restrict which services you can provision in your environment.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [How to deny a specific resource type with Azure Policy](https://docs.microsoft.com/azure/governance/policy/samples/not-allowed-resource-types)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 6.10: Maintain an inventory of approved software titles

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32406).

**Guidance**: Use Azure Security Center adaptive application controls to specify which file types a rule may or may not apply to.

Implement a third-party solution if this does not meet the requirement.

- [How to use Azure Security Center adaptive application controls](https://docs.microsoft.com/azure/security-center/security-center-adaptive-application)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 6.11: Limit users' ability to interact with Azure Resource Manager

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32407).

**Guidance**: Use Azure AD Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resources Manager](https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 6.12: Limit users' ability to execute scripts in compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32408).

**Guidance**: Not applicable to Azure Load Balancer (ALB) as this recommendation is for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.13: Physically or logically segregate high risk applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32409).

**Guidance**: Software that is required for business operations, but may incur higher risk for the organization, should be isolated within its own virtual machine and/or virtual network and sufficiently secured with either an Azure Firewall or a network security group.

- [How to create a virtual network](https://docs.microsoft.com/azure/virtual-network/quick-create-portal)

- [How to create an network security group with a security config](https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Secure configuration

*For more information, see [Security control: Secure configuration](/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish secure configurations for all Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32410).

**Guidance**: Use Azure Policy aliases to create custom policies to audit or enforce the configuration of your Azure resources. You may also use built-in Azure Policy definitions.

Azure Resource Manager has the ability to export the template in Java Script Object Notation (JSON), which should be reviewed to ensure that the configurations meet the security requirements for your organization.

You can also use the recommendations from Azure Security Center as a secure configuration baseline for your Azure resources.

- [How to view available Azure Policy aliases](https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0)

- [Tutorial: Create and manage policies to enforce compliance](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [Single and multi-resource export to a template in Azure portal](https://docs.microsoft.com/azure/azure-resource-manager/templates/export-template-portal)

- [Security recommendations - a reference guide](https://docs.microsoft.com/azure/security-center/recommendations-reference)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.2: Establish secure operating system configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32411).

**Guidance**: Use Azure Security Center recommendations to maintain security configurations on all compute resources.  Additionally, you can use custom operating system images or Azure Automation State configuration to establish the security configuration of the operating system required by your organization.

- [How to monitor Azure Security Center recommendations](https://docs.microsoft.com/azure/security-center/security-center-recommendations)

- [Security recommendations - a reference guide](https://docs.microsoft.com/azure/security-center/recommendations-reference)

- [Azure Automation State Configuration Overview](https://docs.microsoft.com/azure/automation/automation-dsc-overview)

- [Upload a VHD and use it to create new Windows VMs in Azure](https://docs.microsoft.com/azure/virtual-machines/windows/upload-generalized-managed)

- [Create a Linux VM from a custom disk with the Azure CLI](https://docs.microsoft.com/azure/virtual-machines/linux/upload-vhd)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.3: Maintain secure Azure resource configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32412).

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.  

In addition, you can use Azure Resource Manager templates to maintain the security configuration of your Azure resources required by your organization. 

- [Understand Azure Policy effects](https://docs.microsoft.com/azure/governance/policy/concepts/effects)

- [Create and manage policies to enforce compliance](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [Azure Resource Manager templates overview](https://docs.microsoft.com/azure/azure-resource-manager/templates/overview)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.4: Maintain secure operating system configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32413).

**Guidance**: Not applicable to Azure Load Balancer (ALB) as this recommendation is for IaaS compute resources.

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### 7.5: Securely store configuration of Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32414).

**Guidance**: Use Azure DevOps to securely store and manage your code like custom Azure Policy definitions, Azure Resource Manager templates and desired state configuration scripts. To access the resources you manage in Azure DevOps, you can grant or deny permissions to specific users, built-in security groups, or groups defined in Azure Active Directory (Azure AD) if integrated with Azure DevOps, or Active Directory if integrated with TFS.

- [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops)

- [About permissions and groups in Azure DevOps](https://docs.microsoft.com/azure/devops/organizations/security/about-permissions)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.6: Securely store custom operating system images

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32415).

**Guidance**: Not applicable to Azure Load Balancer (ALB) as this recommendation is for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.7: Deploy configuration management tools for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32416).

**Guidance**: Define and implement standard security configurations for Azure resources using Azure Policy. 

Use Azure Policy aliases to create custom policies to audit or enforce the network configuration of your Azure resources. 

You can also make use of built-in policy definitions related to your specific resources.  

Additionally, you can use Azure Automation to deploy configuration changes.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [How to use aliases](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#aliases)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.8: Deploy configuration management tools for operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32417).

**Guidance**: Not applicable to Azure Load Balancer (ALB) as this recommendation is for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.9: Implement automated configuration monitoring for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32418).

**Guidance**: Use Azure Security Center to perform baseline scans for your Azure Resources.  

Additionally, use Azure Policy to alert and audit Azure resource configurations.

- [How to remediate recommendations in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-remediate-recommendations)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.10: Implement automated configuration monitoring for operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32419).

**Guidance**: Not applicable to Azure Load Balancer (ALB) as this recommendation is for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.11: Manage Azure secrets securely

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32420).

**Guidance**: Use managed identities in conjunction with Azure Key Vault to simplify secret management for your cloud applications.

- [How to use managed identities for Azure resources](https://docs.microsoft.com/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity)

- [How to create a Key Vault](https://docs.microsoft.com/azure/key-vault/quick-create-portal)

- [How to provide Key Vault authentication with a managed identity](https://docs.microsoft.com/azure/key-vault/managed-identity)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.12: Manage identities securely and automatically

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32421).

**Guidance**: Use managed identities to provide Azure services with an automatically-managed identity in Azure AD. 

Managed identities allow you to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code.

- [How to configure managed identities for Azure resources](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.13: Eliminate unintended credential exposure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32422).

**Guidance**: Implement Credential Scanner to identify credentials within code. 

Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault. 

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Malware defense

*For more information, see [Security control: Malware defense](/azure/security/benchmarks/security-control-malware-defense).*

### 8.1: Use centrally managed antimalware software

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32423).

**Guidance**: Not applicable to Azure Load Balancer (ALB) as this recommendation is for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32424).

**Guidance**: Not applicable to Azure Load Balancer (ALB) as this recommendation is for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 8.3: Ensure antimalware software and signatures are updated

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32425).

**Guidance**: Not applicable to Azure Load Balancer (ALB) as this recommendation is for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Data recovery

*For more information, see [Security control: Data recovery](/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure regular automated back ups

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32426).

**Guidance**: Not applicable to Azure Load Balancer (ALB) as this recommendation is for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.2: Perform complete system backups and backup any customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32427).

**Guidance**: Not applicable to Azure Load Balancer (ALB) as this recommendation is for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.3: Validate all backups including customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32428).

**Guidance**: Not applicable to Azure Load Balancer (ALB) as this recommendation is for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.4: Ensure protection of backups and customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32429).

**Guidance**: For on-premises backup, encryption at rest is provided using the passphrase you provide when backing up to Azure. 

Use role-based access control to protect backups and customer managed keys. 

Enable soft delete and purge protection in Key Vault to protect keys against accidental or malicious deletion. 

If Azure Storage is used to store backups, enable soft delete to save and recover your data when blobs or blob snapshots are deleted.

- [Understand Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/overview)

- [How to enable soft delete and purge protection in Key Vault](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete?tabs=azure-portal)

- [Soft delete for Azure Blob storage](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete?tabs=azure-portal)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Incident response

*For more information, see [Security control: Incident response](/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create an incident response guide

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32430).

**Guidance**: Develop an incident response guide for your organization. 

Ensure there are written incident response plans that define all the roles of personnel as well as the phases of incident handling and management from detection to post-incident review. 

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/06/27/inside-the-msrc-anatomy-of-a-ssirp-incident/)

- [Use NIST's Computer Security Incident Handling Guide to aid in the creation of your own incident response plan](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32431).

**Guidance**: Azure Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. 

The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, mark subscriptions using tags and create a naming system to identify and categorize Azure resources, especially those processing sensitive data.  

It's your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

- [Security alerts in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-alerts-overview)

- [Use tags to organize your Azure resources](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.3: Test security response procedures

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32436).

**Guidance**: Conduct exercises to test your systems' incident response capabilities on a regular cadence to help protect your Azure resources. Identify weak points and gaps and then revise your response plan as needed.

- [NIST's publication--Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://csrc.nist.gov/publications/detail/sp/800-84/final)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32432).

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. 

Review incidents after the fact to ensure that issues are resolved.

- [How to set the Azure Security Center security contact](https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32433).

**Guidance**: Export your Azure Security Center alerts and recommendations using the continuous export feature to help identify risks to Azure resources. 

Continuous export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. 

You can use the Azure Security Center data connector to stream the alerts to Azure Sentinel.

- [How to configure continuous export](https://docs.microsoft.com/azure/security-center/continuous-export)

- [How to stream alerts into Azure Sentinel](https://docs.microsoft.com/azure/sentinel/connect-azure-security-center)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32434).

**Guidance**: Use workflow automation feature Azure Security Center to automatically trigger responses to security alerts and recommendations to protect your Azure resources.

- [How to configure workflow automation in Security Center](https://docs.microsoft.com/azure/security-center/workflow-automation)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Penetration tests and red team exercises

*For more information, see [Security control: Penetration tests and red team exercises](/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/32435).

**Guidance**: Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1)

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Next steps

- See the [Azure security benchmark](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
