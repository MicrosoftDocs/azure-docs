---
title: Azure security baseline for Windows Virtual Machines
description: The Windows Virtual Machines security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: virtual-machines-windows
ms.topic: conceptual
ms.date: 03/26/2021
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Windows Virtual Machines

This security baseline applies guidance from the [Azure Security Benchmark version1.0](https://docs.microsoft.com/azure/security/benchmarks/overview-v1) to Windows Virtual Machines. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure.The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Windows Virtual Machines. **Controls** not applicable to Windows Virtual Machines, or for which the responsibility is Microsoft's, have been excluded.

To see how Windows Virtual Machines completely maps to the Azure Security Benchmark, see the [full Windows Virtual Machines security baseline mappingfile](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](https://docs.microsoft.com/azure/security/benchmarks/security-control-network-security).*

### 1.1: Protect Azure resources within virtual networks

**Guidance**: When you create an Azure virtual machine (VM), you must create a virtual network (VNet) or use an existing VNet and configure the VM with a subnet. Ensure that all deployed subnets have a Network Security Group applied with network access controls specific to your applications trusted ports and sources. 

Alternatively, if you have a specific use case for a centralized firewall, Azure Firewall can also be used to meet those requirements.

- [Virtual networks and virtual machines in Azure](https://docs.microsoft.com/azure/virtual-machines/windows/network-overview)

- [How to create a Virtual Network](https://docs.microsoft.com/azure/virtual-network/quick-create-portal)

- [How to create an NSG with a Security Config](https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic)

- [How to deploy and configure Azure Firewall](https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.ClassicCompute**:

[!INCLUDE [Resource Policy for Microsoft.ClassicCompute 1.1](../../../includes/policy/standards/asb/rp-controls/microsoft.classiccompute-1-1.md)]

**Azure Policy built-in definitions - Microsoft.Compute**:

[!INCLUDE [Resource Policy for Microsoft.Compute 1.1](../../../includes/policy/standards/asb/rp-controls/microsoft.compute-1-1.md)]

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and network interfaces

**Guidance**: Use the Azure Security Center to identify and follow network protection recommendations to help secure your Azure Virtual Machine (VM) resources in Azure. Enable NSG flow logs and send logs into a Storage Account for traffic audit for the VMs for unusual activity.

- [How to Enable NSG Flow Logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal)

- [Understand Network Security provided by Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-network-recommendations)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.3: Protect critical web applications

**Guidance**: If using your virtual machine (VM) to host web applications, use a network security group (NSG) on the VM's subnet to limit what network traffic, ports and protocols are allowed to communicate. Follow a least privileged network approach when configuring your NSGs to only allow required traffic to your application.

You can also deploy Azure Web Application Firewall (WAF) in front of critical web applications for additional inspection of incoming traffic. Enable Diagnostic Setting for WAF and ingest logs into a Storage Account, Event Hub, or Log Analytics Workspace. 

- [Create an application gateway with a Web Application Firewall using the Azure portal](https://docs.microsoft.com/azure/web-application-firewall/ag/application-gateway-web-application-firewall-portal)

- [Information on Network Security Groups](https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.4: Deny communications with known-malicious IP addresses

**Guidance**: Enable Distributed Denial of Service (DDoS) Standard protection on the Virtual Networks to guard against DDoS attacks. Using Azure Security Center Integrated Threat Intelligence, you can monitor communications with known malicious IP addresses.  Configure appropriately Azure Firewall on each of your Virtual Network segments, with Threat Intelligence enabled and configured to "Alert and deny" for malicious network traffic.

You can use Azure Security Center's Just In Time Network access to limit exposure of Windows Virtual Machines to the approved IP addresses for a limited period.  Also, use Azure Security Center Adaptive Network Hardening to recommend NSG configurations that limit ports and source IPs based on actual traffic and threat intelligence.

- [How to configure DDoS protection](https://docs.microsoft.com/azure/ddos-protection/manage-ddos-protection)

- [How to deploy Azure Firewall](https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal)

- [Understand Azure Security Center Integrated Threat Intelligence](https://docs.microsoft.com/azure/security-center/azure-defender)

- [Understand Azure Security Center Adaptive Network Hardening](https://docs.microsoft.com/azure/security-center/security-center-adaptive-network-hardening)

- [Understand Azure Security Center Just In Time Network Access Control](https://docs.microsoft.com/azure/security-center/security-center-just-in-time)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Compute**:

[!INCLUDE [Resource Policy for Microsoft.Compute 1.4](../../../includes/policy/standards/asb/rp-controls/microsoft.compute-1-4.md)]

### 1.5: Record network packets

**Guidance**: You can record NSG flow logs into a storage account to generate flow records for your Azure Virtual Machines. When investigating anomalous activity, you could enable Network Watcher packet capture so that network traffic can be reviewed for unusual and unexpected activity.

- [How to Enable NSG Flow Logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal)

- [How to enable Network Watcher](https://docs.microsoft.com/azure/network-watcher/network-watcher-create)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: By combining packet captures provided by Network Watcher and an open-source IDS tool, you can perform network intrusion detection for a wide range of threats. Also, you can deploy Azure Firewall on the Virtual Network segments as appropriate, with Threat Intelligence enabled and configured to "Alert and deny" for malicious network traffic.

- [Perform network intrusion detection with Network Watcher and open-source tools](https://docs.microsoft.com/azure/network-watcher/network-watcher-intrusion-detection-open-source-tools)

- [How to deploy Azure Firewall](https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal)

- [How to configure alerts with Azure Firewall](https://docs.microsoft.com/azure/firewall/threat-intel)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.7: Manage traffic to web applications

**Guidance**: You may deploy Azure Application Gateway for web applications with HTTPS/SSL enabled for trusted certificates. With Azure Application Gateway, you direct your application web traffic to specific resources by assigning listeners to ports, creating rules, and adding resources to a backend pool like Windows Virtual machines.

- [How to deploy Application Gateway](https://docs.microsoft.com/azure/application-gateway/quick-create-portal)

- [How to configure Application Gateway to use HTTPS](https://docs.microsoft.com/azure/application-gateway/create-ssl-portal)

- [Understand layer 7 load balancing with Azure web application gateways](https://docs.microsoft.com/azure/application-gateway/overview)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: Use Virtual Network Service Tags to define network access controls on Network Security Groups or Azure Firewall configured for your Azure Virtual machines. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., ApiManagement) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

- [Understand and using Service Tags](https://docs.microsoft.com/azure/virtual-network/service-tags-overview)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement standard security configurations for Azure Virtual Machines (VM) using Azure Policy. You may also use Azure Blueprints to simplify large-scale Azure VM deployments by packaging key environment artifacts, such as Azure Resource Manager templates, role assignments, and Azure Policy assignments, in a single blueprint definition. You can apply the blueprint to subscriptions, and enable resource management through blueprint versioning.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [Azure Policy samples for networking](https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies#network)

- [How to create an Azure Blueprint](https://docs.microsoft.com/azure/governance/blueprints/create-blueprint-portal)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.10: Document traffic configuration rules

**Guidance**: You may use tags for network security groups (NSG) and other resources related to network security and traffic flow configured for your Windows Virtual machines. For individual NSG rules, use the "Description" field to specify business need and/or duration for any rules that allow traffic to/from a network.

- [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/management/tag-resources)

- [How to create a Virtual Network](https://docs.microsoft.com/azure/virtual-network/quick-create-portal)

- [How to create an NSG with a Security Config](https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use the Azure Activity Log to monitor changes to network resource configurations related to your virtual machines. Create alerts within Azure Monitor that will trigger when changes to critical network settings or resources take place.

Use Azure Policy to validate (and/or remediate) configurations for network resource related to Windows Virtual Machines.

- [How to view and retrieve Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log#view-the-activity-log)

- [How to create alerts in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [Azure Policy samples for networking](https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies#network)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Compute**:

[!INCLUDE [Resource Policy for Microsoft.Compute 1.11](../../../includes/policy/standards/asb/rp-controls/microsoft.compute-1-11.md)]

## Logging and Monitoring

*For more information, see the [Azure Security Benchmark: Logging and Monitoring](https://docs.microsoft.com/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.2: Configure central security log management

**Guidance**: The Azure Security Center provides Security Event log monitoring for windows Virtual Machines. Given the volume of data that the security event log generates, it is not stored by default.

- [If your organization would like to retain the security event log data from the virtual machine, it can be stored within a Data Collection tier, at which point it can be queried in Log Analytics. There are different tiers: Minimal, Common and All, which are detailed in the following link](https://docs.microsoft.com/azure/security-center/security-center-enable-data-collection#data-collection-tier)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Compute**:

[!INCLUDE [Resource Policy for Microsoft.Compute 2.2](../../../includes/policy/standards/asb/rp-controls/microsoft.compute-2-2.md)]

### 2.3: Enable audit logging for Azure resources

**Guidance**: Activity logs can be used to audit operations and actions performed on virtual machine resources. The activity log contains all write operations (PUT, POST, DELETE) for your resources except read operations (GET). Activity logs can be used to find an error when troubleshooting or to monitor how a user in your organization modified a resource.

Enable the collection of guest OS diagnostic data by deploying the diagnostic extension on your Virtual Machines (VM). You can use the diagnostics extension to collect diagnostic data like application logs or performance counters from an Azure virtual machine.

For advanced visibility of the applications and services supported by your virtual machines you can enable both Azure Monitor for VMs and Application insights. With Application Insights, you can monitor your application and capture telemetry such as HTTP requests, exceptions, etc. so you can correlate issues between the VMs and your application.

Additionally, enable Azure Monitor for access to your audit and activity logs which includes event source, date, user, timestamp, source addresses, destination addresses, and other useful elements. 

- [How to collect platform logs and metrics with Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings)

- [Log analytics agent overview](https://docs.microsoft.com/azure/azure-monitor/platform/log-analytics-agent)

- [Log analytics virtual machine extension for Windows](https://docs.microsoft.com/azure/virtual-machines/extensions/oms-windows)

- [View and retrieve Azure Activity log events](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log#view-the-activity-log)

- [Application Insights overview](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Compute**:

[!INCLUDE [Resource Policy for Microsoft.Compute 2.3](../../../includes/policy/standards/asb/rp-controls/microsoft.compute-2-3.md)]

### 2.4: Collect security logs from operating systems

**Guidance**: Use Azure Security Center to provide Security Event log monitoring for Azure Virtual Machines. Given the volume of data that the security event log generates, it is not stored by default. 

If your organization would like to retain the security event log data from the virtual machine, it can be stored within a Log Analytics Workspace at the desired data collection tier configured within Azure Security Center.

- [Data collection in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-enable-data-collection)

- [To capture the Syslog data for monitoring, you will need to enable the Log Analytics extension](https://docs.microsoft.com/azure/azure-monitor/learn/quick-collect-azurevm#enable-the-log-analytics-vm-extension)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Compute**:

[!INCLUDE [Resource Policy for Microsoft.Compute 2.4](../../../includes/policy/standards/asb/rp-controls/microsoft.compute-2-4.md)]

### 2.5: Configure security log storage retention

**Guidance**: Ensure that any storage accounts or Log Analytics workspaces used for storing virtual machine logs has the log retention period set according to your organization's compliance regulations.

- [How to monitor virtual machines in Azure](https://docs.microsoft.com/azure/azure-monitor/insights/monitor-vm-azure)

- [How to configure Log Analytics Workspace Retention Period](https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.6: Monitor and review logs

**Guidance**: Enable the Log Analytics agent, also referred to as the Microsoft Monitoring Agent (MMA), and configure it to send logs to a Log Analytics workspace. The Windows agent sends collected data from different sources to your Log Analytics workspace in Azure Monitor, as well as any unique logs or metrics as defined in a monitoring solution.

Analyze and monitor logs for anomalous behavior and regularly review results. Use Azure Monitor to review logs and perform queries on log data.

Alternatively, you may enable and on-board data to Azure Sentinel or a third-party SIEM to monitor and review your logs.

- [Log analytics agent overview](https://docs.microsoft.com/azure/azure-monitor/platform/log-analytics-agent)

- [Log analytics virtual machine extension for Windows](https://docs.microsoft.com/azure/virtual-machines/extensions/oms-windows)

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

- [Understand Log Analytics Workspace](https://docs.microsoft.com/azure/azure-monitor/log-query/log-analytics-tutorial)

- [How to perform custom queries in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-queries)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.7: Enable alerts for anomalous activities

**Guidance**: Use Azure Security Center configured with a Log Analytics workspace for monitoring and alerting on anomalous activity found in security logs and events for your Azure Virtual Machines.  

Alternatively, you may enable and on-board data to Azure Sentinel or a third-party SIEM to set up alerts for anomalous activity.

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

- [How to manage alerts in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-managing-and-responding-alerts)

- [How to alert on log analytics log data](https://docs.microsoft.com/azure/azure-monitor/learn/tutorial-response)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.8: Centralize anti-malware logging

**Guidance**: You may use Microsoft Antimalware for Azure Cloud Services and Virtual Machines and configure your virtual machines to log events to an Azure Storage Account. Configure a Log Analytics workspace to ingest the events from the Storage Accounts and create alerts where appropriate. Follow recommendations in Azure Security Center: "Compute &amp; Apps". 

- [How to configure Microsoft Antimalware for Cloud Services and Virtual Machines](https://docs.microsoft.com/azure/security/fundamentals/antimalware)

- [How to Enable guest-level monitoring for Virtual Machines](https://docs.microsoft.com/azure/cost-management-billing/cloudyn/azure-vm-extended-metrics)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.ClassicCompute**:

[!INCLUDE [Resource Policy for Microsoft.ClassicCompute 2.8](../../../includes/policy/standards/asb/rp-controls/microsoft.classiccompute-2-8.md)]

**Azure Policy built-in definitions - Microsoft.Compute**:

[!INCLUDE [Resource Policy for Microsoft.Compute 2.8](../../../includes/policy/standards/asb/rp-controls/microsoft.compute-2-8.md)]

### 2.9: Enable DNS query logging

**Guidance**: Implement a third-party solution from Azure Marketplace for DNS logging solution as per your organizations need.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.10: Enable command-line audit logging

**Guidance**: The Azure Security Center provides Security Event log monitoring for Azure Virtual Machines(VM).  Security Center provisions the Microsoft Monitoring Agent on all supported Azure VMs and any new ones that are created if automatic provisioning is enabled OR you can install the agent manually. The agent enables the process creation event 4688 and the CommandLine field inside event 4688. New processes created on the VM are recorded by EventLog and monitored by Security Center’s detection services.

- [Data collection in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-enable-data-collection#data-collection-tier)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](https://docs.microsoft.com/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: While Azure Active Directory (Azure AD) is the recommended method to administrate user access, Azure Virtual Machines may have local accounts. Both local and domain accounts should be reviewed and managed, normally with a minimum footprint. In addition, leverage Azure Privileged Identity Management for administrative accounts used to access the virtual machines resources.

- [Information for Local Accounts is available at](https://docs.microsoft.com/azure/active-directory/devices/assign-local-admin#manage-the-device-administrator-role)

- [Information on Privileged Identity Manager](https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-deployment-plan)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.2: Change default passwords where applicable

**Guidance**: Windows Virtual Machines and Azure Active Directory (Azure AD) do not have the concept of default passwords. Customer responsible for third-party applications and marketplace services that may use default passwords.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.3: Use dedicated administrative accounts

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts that have access to your virtual machines. Use Azure Security Center identity and access management to monitor the number of administrative accounts. Any administrator accounts used to access Azure Virtual Machine resources can also be managed by Azure Privileged Identity Management (PIM). Azure Privileged Identity Management provides several options such as Just in Time elevation, requiring multifactor authentication before assuming a role, and delegation options so that permissions are only available for specific time frames and require an approver.

- [Understand Azure Security Center Identity and Access](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

- [Information on Privileged Identity Manager](https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-deployment-plan)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Compute**:

[!INCLUDE [Resource Policy for Microsoft.Compute 3.3](../../../includes/policy/standards/asb/rp-controls/microsoft.compute-3-3.md)]

### 3.4: Use Azure Active Directory single sign-on (SSO)

**Guidance**: Wherever possible, customer to use SSO with Azure Active Directory (Azure AD) rather than configuring individual stand-alone credentials per-service. Use Azure Security Center Identity and Access Management recommendations.

- [Single sign-on to applications in Azure AD](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on)

- [How to monitor identity and access within Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.5: Use multi-factor authentication for all Azure Active Directory-based access

**Guidance**: Enable Azure Active Directory (Azure AD) multifactor authentication and follow Azure Security Center Identity and Access Management recommendations.

- [How to enable multifactor authentication in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

- [How to monitor identity and access within Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.6: Use secure, Azure-managed workstations for administrative tasks

**Guidance**: Use PAWs (privileged access workstations) with multifactor authentication configured to log into and configure Azure resources.

- [Learn about Privileged Access Workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/)

- [How to enable multifactor authentication in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.7: Log and alert on suspicious activities from administrative accounts

**Guidance**: Use Azure Active Directory (Azure AD) Privileged Identity Management (PIM) for generation of logs and alerts when suspicious or unsafe activity occurs in the environment. Use Azure AD Risk Detections to view alerts and reports on risky user behavior. Optionally, customer may ingest Azure Security Center Risk Detection alerts into Azure Monitor and configure custom alerting/notifications using Action Groups.

- [How to deploy Privileged Identity Management (PIM)](https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-deployment-plan)

- [Understanding Azure Security Center risk detections (suspicious activity)](https://docs.microsoft.com/azure/active-directory/identity-protection/overview-identity-protection)

- [How to integrate Azure Activity Logs into Azure Monitor](https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)

- [How to configure action groups for custom alerting and notification](https://docs.microsoft.com/azure/azure-monitor/platform/action-groups)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.8: Manage Azure resources from only approved locations

**Guidance**: Use Azure Active Directory (Azure AD) Conditional Access policies and named locations to allow access from only specific logical groupings of IP address ranges or countries/regions.

- [How to configure Named Locations in Azure](https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.  You can use managed identities to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code. Your code that's running on a virtual machine can use its managed identity to request access tokens for services that support Azure AD authentication.

- [How to create and configure an Azure AD instance](https://docs.microsoft.com/azure/active-directory-domain-services/tutorial-create-instance)

- [Managed identities for Azure resources overview](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.10: Regularly review and reconcile user access

**Guidance**: Azure Active Directory (Azure AD) provides logs to help discover stale accounts. In addition, use Azure AD identity access reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User's access can be reviewed on a regular basis to make sure only the right users have continued access. When using Azure Virtual machines, you will need to review the local security groups and users to make sure that there are no unexpected accounts which could compromise the system.

- [How to use Azure Identity Access Reviews](https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.11: Monitor attempts to access deactivated credentials

**Guidance**: Configure diagnostic settings for Azure Active Directory (Azure AD) to send the audit logs and sign-in logs to a Log Analytics workspace. Also, use Azure Monitor to review logs and perform queries on log data from Azure Virtual machines.

- [Understand Log Analytics Workspace](https://docs.microsoft.com/azure/azure-monitor/log-query/log-analytics-tutorial)

- [How to integrate Azure Activity Logs into Azure Monitor](https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)

- [How to perform custom queries in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-queries)

- [How to monitor virtual machines in Azure](https://docs.microsoft.com/azure/azure-monitor/insights/monitor-vm-azure)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.12: Alert on account sign-in behavior deviation

**Guidance**: Use Azure Active Directory (Azure AD)'s Risk and Identity Protection features to configure automated responses to detected suspicious actions related to your storage account resources. You should enable automated responses through Azure Sentinel to implement your organization's security responses.

- [How to view Azure AD risky sign-ins](https://docs.microsoft.com/azure/active-directory/identity-protection/overview-identity-protection)

- [How to configure and enable Identity Protection risk policies](https://docs.microsoft.com/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies)

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

**Guidance**: In cases where a third-party needs to access customer data (such as during a support request), use Customer Lockbox for Azure virtual machines to review and approve or reject customer data access requests.

- [Understanding Customer Lockbox](https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use Tags to assist in tracking Azure virtual machines that store or process sensitive information.

- [How to create and use Tags](https://docs.microsoft.com/azure/azure-resource-manager/management/tag-resources)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. Resources should be separated by virtual network/subnet, tagged appropriately, and secured within a network security group (NSG) or by an Azure Firewall. For Virtual Machines storing or processing sensitive data, implement policy and procedure(s) to turn them off when not in use.

- [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/cost-management-billing/manage/create-subscription)

- [How to create Management Groups](https://docs.microsoft.com/azure/governance/management-groups/create-management-group-portal)

- [How to create and use Tags](https://docs.microsoft.com/azure/azure-resource-manager/management/tag-resources)

- [How to create a Virtual Network](https://docs.microsoft.com/azure/virtual-network/quick-create-portal)

- [How to create an NSG with a Security Config](https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic)

- [How to deploy Azure Firewall](https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal)

- [How to configure alert or alert and deny with Azure Firewall](https://docs.microsoft.com/azure/firewall/threat-intel)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: Implement third-party solution on network perimeters that monitors for unauthorized transfer of sensitive information and blocks such transfers while alerting information security professionals.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.4: Encrypt all sensitive information in transit

**Guidance**: Data in transit to, from, and between Virtual Machines(VM) that are running Windows is encrypted in a number of ways, depending on the nature of the connection such as when connecting to a VM in a RDP or SSH session.

Microsoft uses the Transport Layer Security (TLS) protocol to protect data when it's traveling between the cloud services and customers.

- [In-transit encryption in VMs](https://docs.microsoft.com/azure/security/fundamentals/encryption-overview#in-transit-encryption-in-vms)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Use a third-party active discovery tool to identify all sensitive information stored, processed, or transmitted by the organization's technology systems, including those located onsite or at a remote service provider and update the organization's sensitive information inventory.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.6: Use Azure RBAC to control access to resources 

**Guidance**: Using Azure role-based access control (Azure RBAC), you can segregate duties within your team and grant only the amount of access to users on your VM that they need to perform their jobs. Instead of giving everybody unrestricted permissions on the VM, you can allow only certain actions. You can configure access control for the VM in the Azure portal, using the Azure CLI, or Azure PowerShell.

- [Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/overview)

- [Azure built-in roles](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#virtual-machine-contributor)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.7: Use host-based data loss prevention to enforce access control

**Guidance**: Implement a third-party tool, such as an automated host-based Data Loss Prevention solution, to enforce access controls to mitigate the risk of data breaches.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.8: Encrypt sensitive information at rest

**Guidance**: Virtual disks on Windows Virtual Machines (VM) are encrypted at rest using either Server-side encryption or Azure disk encryption (ADE). Azure Disk Encryption leverages the BitLocker feature of Windows to encrypt managed disks with customer-managed keys within the guest VM. Server-side encryption with customer-managed keys improves on ADE by enabling you to use any OS types and images for your VMs by encrypting data in the Storage service.

- [Server side encryption of Azure-managed disks](https://docs.microsoft.com/azure/virtual-machines/windows/disk-encryption)

- [Azure Disk Encryption for Windows VMs](https://docs.microsoft.com/azure/virtual-machines/windows/disk-encryption-overview)

**Responsibility**: Shared

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.ClassicCompute**:

[!INCLUDE [Resource Policy for Microsoft.ClassicCompute 4.8](../../../includes/policy/standards/asb/rp-controls/microsoft.classiccompute-4-8.md)]

**Azure Policy built-in definitions - Microsoft.Compute**:

[!INCLUDE [Resource Policy for Microsoft.Compute 4.8](../../../includes/policy/standards/asb/rp-controls/microsoft.compute-4-8.md)]

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with the Azure Activity Log to create alerts for when changes take place to Virtual machines and related resources.  

- [How to create alerts for Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

- [How to create alerts for Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

- [Azure Storage analytics logging](https://docs.microsoft.com/azure/storage/common/storage-analytics-logging)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Vulnerability Management

*For more information, see the [Azure Security Benchmark: Vulnerability Management](https://docs.microsoft.com/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: Follow recommendations from Azure Security Center on performing vulnerability assessments on your Azure Virtual Machines.  Use Azure Security recommended or third-party solution for performing vulnerability assessments for your virtual machines.

- [How to implement Azure Security Center vulnerability assessment recommendations](https://docs.microsoft.com/azure/security-center/deploy-vulnerability-assessment-vm)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.ClassicCompute**:

[!INCLUDE [Resource Policy for Microsoft.ClassicCompute 5.1](../../../includes/policy/standards/asb/rp-controls/microsoft.classiccompute-5-1.md)]

**Azure Policy built-in definitions - Microsoft.Compute**:

[!INCLUDE [Resource Policy for Microsoft.Compute 5.1](../../../includes/policy/standards/asb/rp-controls/microsoft.compute-5-1.md)]

### 5.2: Deploy automated operating system patch management solution

**Guidance**: Use the Azure Update Management solution to manage updates and patches for your virtual machines.  Update Management relies on the locally configured update repository to patch supported Windows systems. Tools like System Center Updates Publisher (Updates Publisher) allow you to publish custom updates into Windows Server Update Services (WSUS). This scenario allows Update Management to patch machines that use Configuration Manager as their update repository with third-party software.

- [Update Management solution in Azure](https://docs.microsoft.com/azure/automation/overview)

- [Manage updates and patches for your Azure VMs](https://docs.microsoft.com/azure/automation/manage-updates-for-vm)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.ClassicCompute**:

[!INCLUDE [Resource Policy for Microsoft.ClassicCompute 5.2](../../../includes/policy/standards/asb/rp-controls/microsoft.classiccompute-5-2.md)]

**Azure Policy built-in definitions - Microsoft.Compute**:

[!INCLUDE [Resource Policy for Microsoft.Compute 5.2](../../../includes/policy/standards/asb/rp-controls/microsoft.compute-5-2.md)]

### 5.3: Deploy automated patch management solution for third-party software titles

**Guidance**: You may use a third-party patch management solution.  You can use the Azure Update Management solution to manage updates and patches for your virtual machines.  Update Management relies on the locally configured update repository to patch supported Windows systems. Tools like System Center Updates Publisher (Updates Publisher) allow you to publish custom updates into Windows Server Update Services (WSUS). This scenario allows Update Management to patch machines that use Configuration Manager as their update repository with third-party software.

- [Update Management solution in Azure](https://docs.microsoft.com/azure/automation/overview)

- [Manage updates and patches for your Azure VMs](https://docs.microsoft.com/azure/automation/manage-updates-for-vm)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.4: Compare back-to-back vulnerability scans

**Guidance**: Export scan results at consistent intervals and compare the results to verify that vulnerabilities have been remediated. When using vulnerability management recommendation suggested by Azure Security Center, customer may pivot into the selected solution's portal to view historical scan data.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

**Guidance**: Use the default risk ratings (Secure Score) provided by Azure Security Center.

- [Understand Azure Security Center Secure Score](https://docs.microsoft.com/azure/security-center/secure-score-security-controls)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.ClassicCompute**:

[!INCLUDE [Resource Policy for Microsoft.ClassicCompute 5.5](../../../includes/policy/standards/asb/rp-controls/microsoft.classiccompute-5-5.md)]

**Azure Policy built-in definitions - Microsoft.Compute**:

[!INCLUDE [Resource Policy for Microsoft.Compute 5.5](../../../includes/policy/standards/asb/rp-controls/microsoft.compute-5-5.md)]

## Inventory and Asset Management

*For more information, see the [Azure Security Benchmark: Inventory and Asset Management](https://docs.microsoft.com/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use automated asset discovery solution

**Guidance**: Use Azure Resource Graph to query and discover all resources (including Virtual machines) within your subscriptions. Ensure you have appropriate (read) permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions.

- [How to create queries with Azure Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

- [How to view your Azure Subscriptions](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-4.8.0&amp;preserve-view=true)

- [Understand Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/overview)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them according to a taxonomy.

- [How to create and use Tags](https://docs.microsoft.com/azure/azure-resource-manager/management/tag-resources)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track virtual machines and related resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

- [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/cost-management-billing/manage/create-subscription)

- [How to create Management Groups](https://docs.microsoft.com/azure/governance/management-groups/create-management-group-portal)

- [How to create and use Tags](https://docs.microsoft.com/azure/azure-resource-manager/management/tag-resources)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.4: Define and maintain inventory of approved Azure resources

**Guidance**: You should create an inventory of approved Azure resources and approved software for your compute resources. You can also use Adaptive application controls, a feature of Azure Security Center to help you define a set of applications that are allowed to run on configured groups of machines. This feature is available for both Azure and non-Azure Windows (all versions, classic, or Azure Resource Manager) and Linux machines.
                    

- [How to enable Adaptive Application Control](https://docs.microsoft.com/azure/security-center/security-center-adaptive-application)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:
- Not allowed resource types

- Allowed resource types

In addition, use the Azure Resource Graph to query/discover resources within the subscription(s). This can help in high security based environments, such as those with Storage accounts.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [How to create queries with Azure Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.6: Monitor for unapproved software applications within compute resources

**Guidance**: Azure Automation provides complete control during deployment, operations, and decommissioning of workloads and resources. Leverage Azure Virtual Machine Inventory to automate the collection of information about all software on Virtual Machines. Note: Software Name, Version, Publisher, and Refresh time are available from the Azure portal. To get access to install date and other information, customer required to enable guest-level diagnostic and bring the Windows Event logs into a Log Analytics Workspace.

In addition to using Change Tracking for monitoring of software applications, adaptive application controls in Azure Security Center use machine learning to analyze the applications running on your machines and create an allow list from this intelligence. This capability greatly simplifies the process of configuring and maintaining application allow list policies, enabling you to Avoid unwanted software to be used in your environment. You can configure audit mode or enforce mode. Audit mode only audits the activity on the protected VMs. Enforce mode does enforce the rules, and makes sure that applications that are not allowed to run are blocked.

- [An introduction to Azure Automation](https://docs.microsoft.com/azure/automation/automation-intro)

- [How to enable Azure VM Inventory](https://docs.microsoft.com/azure/automation/automation-tutorial-installed-software)

- [Understand adaptive application controls](https://docs.microsoft.com/azure/security-center/security-center-adaptive-application)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.7: Remove unapproved Azure resources and software applications

**Guidance**: Azure Automation provides complete control during deployment, operations, and decommissioning of workloads and resources.  You may use Change Tracking to identify all software installed on Virtual Machines. You can implement your own process or use Azure Automation State Configuration for removing unauthorized software.

- [An introduction to Azure Automation](https://docs.microsoft.com/azure/automation/automation-intro)

- [Track changes in your environment with the Change Tracking solution](https://docs.microsoft.com/azure/automation/change-tracking/overview)

- [Azure Automation State Configuration Overview](https://docs.microsoft.com/azure/automation/automation-dsc-overview)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.8: Use only approved applications

**Guidance**: Use Azure Security Center Adaptive Application Controls to ensure that only authorized software executes and all unauthorized software is blocked from executing on Azure Virtual Machines.

- [How to use Azure Security Center Adaptive Application Controls](https://docs.microsoft.com/azure/security-center/security-center-adaptive-application)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.ClassicCompute**:

[!INCLUDE [Resource Policy for Microsoft.ClassicCompute 6.8](../../../includes/policy/standards/asb/rp-controls/microsoft.classiccompute-6-8.md)]

**Azure Policy built-in definitions - Microsoft.Compute**:

[!INCLUDE [Resource Policy for Microsoft.Compute 6.8](../../../includes/policy/standards/asb/rp-controls/microsoft.compute-6-8.md)]

### 6.9: Use only approved Azure services

**Guidance**: Use Azure policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:
- Not allowed resource types

- Allowed resource types

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [How to deny a specific resource type with Azure Policy](https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies#general)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.ClassicCompute**:

[!INCLUDE [Resource Policy for Microsoft.ClassicCompute 6.9](../../../includes/policy/standards/asb/rp-controls/microsoft.classiccompute-6-9.md)]

**Azure Policy built-in definitions - Microsoft.Compute**:

[!INCLUDE [Resource Policy for Microsoft.Compute 6.9](../../../includes/policy/standards/asb/rp-controls/microsoft.compute-6-9.md)]

### 6.10: Maintain an inventory of approved software titles

**Guidance**: Adaptive application control is an intelligent, automated, end-to-end solution from Azure Security Center which helps you control which applications can run on your Azure and non-Azure machines (Windows and Linux). Implement third-party solution if this does not meet your organization's requirement.

- [How to use Azure Security Center Adaptive Application Controls](https://docs.microsoft.com/azure/security-center/security-center-adaptive-application)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.ClassicCompute**:

[!INCLUDE [Resource Policy for Microsoft.ClassicCompute 6.10](../../../includes/policy/standards/asb/rp-controls/microsoft.classiccompute-6-10.md)]

**Azure Policy built-in definitions - Microsoft.Compute**:

[!INCLUDE [Resource Policy for Microsoft.Compute 6.10](../../../includes/policy/standards/asb/rp-controls/microsoft.compute-6-10.md)]

### 6.11: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Use Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resource Manager](https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.12: Limit users' ability to execute scripts within compute resources

**Guidance**: Depending on the type of scripts, you may use operating system specific configurations or third-party resources to limit users' ability to execute scripts within Azure compute resources. You can also leverage Azure Security Center Adaptive Application Controls to ensure that only authorized software executes and all unauthorized software is blocked from executing on Azure Virtual Machines.

- [How to control PowerShell script execution in Windows Environments](https://docs.microsoft.com/powershell/module/microsoft.powershell.security/set-executionpolicy?view=powershell-7&amp;preserve-view=true)

- [How to use Azure Security Center Adaptive Application Controls](https://docs.microsoft.com/azure/security-center/security-center-adaptive-application)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.13: Physically or logically segregate high risk applications

**Guidance**: High risk applications deployed in your Azure environment may be isolated using virtual network, subnet, subscriptions, management groups etc. and sufficiently secured with either an Azure Firewall, Web Application Firewall (WAF) or network security group (NSG).

- [Virtual networks and virtual machines in Azure](https://docs.microsoft.com/azure/virtual-machines/windows/network-overview)

- [Azure Firewall overview](https://docs.microsoft.com/azure/firewall/overview)

- [Web Application Firewall overview](https://docs.microsoft.com/azure/web-application-firewall/overview)

- [Network security overview](https://docs.microsoft.com/azure/virtual-network/network-security-groups-overview)

- [Azure Virtual Network overview](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview)

- [Organize your resources with Azure management groups](https://docs.microsoft.com/azure/governance/management-groups/overview)

- [Subscription decision guide](https://docs.microsoft.com/azure/cloud-adoption-framework/decision-guides/subscriptions/)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Secure Configuration

*For more information, see the [Azure Security Benchmark: Secure Configuration](https://docs.microsoft.com/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Use Azure Policy or Azure Security Center to maintain security configurations for all Azure Resources. Also, Azure Resource Manager has the ability to export the template in JavaScript Object Notation (JSON), which should be reviewed to ensure that the configurations meet / exceed the security requirements for your company.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [Information on how to download the VM template](https://docs.microsoft.com/previous-versions/azure/virtual-machines/windows/download-template)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.2: Establish secure operating system configurations

**Guidance**: Use Azure Security Center recommendation [Remediate Vulnerabilities in Security Configurations on your Virtual Machines] to maintain security configurations on all compute resources.

- [How to monitor Azure Security Center recommendations](https://docs.microsoft.com/azure/security-center/security-center-recommendations)

- [How to remediate Azure Security Center recommendations](https://docs.microsoft.com/azure/security-center/security-center-remediate-recommendations)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure Resource Manager templates and Azure Policies to securely configure Azure resources associated with the Virtual machines.  Azure Resource Manager templates are JSON-based files used to deploy Virtual machine along with Azure resources and custom template will need to be maintained.  Microsoft performs the maintenance on the base templates.  Use Azure policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.

- [Information on creating Azure Resource Manager templates](https://docs.microsoft.com/azure/virtual-machines/windows/ps-template)

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [Understanding Azure Policy Effects](https://docs.microsoft.com/azure/governance/policy/concepts/effects)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.4: Maintain secure operating system configurations

**Guidance**: There are several options for maintaining a secure configuration for Azure Virtual Machines(VM) for deployment:

1- Azure Resource Manager templates: These are JSON-based files used to deploy a VM from the Azure portal, and custom template will need to be maintained. Microsoft performs the maintenance on the base templates.

2- Custom Virtual hard disk (VHD): In some circumstances it may be required to have custom VHD files used such as when dealing with complex environments that cannot be managed through other means.

3- Azure Automation State Configuration: Once the base OS is deployed, this can be used for more granular control of the settings, and enforced through the automation framework.

For most scenarios, the Microsoft base VM templates combined with the Azure Automation Desired State Configuration can assist in meeting and maintaining the security requirements.

- [Information on how to download the VM template](https://docs.microsoft.com/previous-versions/azure/virtual-machines/windows/download-template)

- [Information on creating ARM templates](https://docs.microsoft.com/azure/virtual-machines/windows/ps-template)

- [How to upload a custom VM VHD to Azure](https://docs.microsoft.com/azure/virtual-machines/windows/upload-generalized-managed)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.ClassicCompute**:

[!INCLUDE [Resource Policy for Microsoft.ClassicCompute 7.4](../../../includes/policy/standards/asb/rp-controls/microsoft.classiccompute-7-4.md)]

**Azure Policy built-in definitions - Microsoft.Compute**:

[!INCLUDE [Resource Policy for Microsoft.Compute 7.4](../../../includes/policy/standards/asb/rp-controls/microsoft.compute-7-4.md)]

### 7.5: Securely store configuration of Azure resources

**Guidance**: Use Azure Repos to securely store and manage your code like custom Azure policies, Azure Resource Manager templates, Desired State Configuration scripts etc. To access the resources you manage in Azure DevOps, such as your code, builds, and work tracking, you must have permissions for those specific resources. Most permissions are granted through built-in security groups as described in Permissions and access. You can grant or deny permissions to specific users, built-in security groups, or groups defined in Azure Active Directory (Azure AD) if integrated with Azure DevOps, or Active Directory if integrated with TFS.

- [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops&amp;preserve-view=true)

- [About permissions and groups in Azure DevOps](https://docs.microsoft.com/azure/devops/organizations/security/about-permissions)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.6: Securely store custom operating system images

**Guidance**: If using custom images (e.g. Virtual Hard Disk), use Azure role-based access controls to ensure only authorized users may access the images.  

- [Understand Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/rbac-and-directory-admin-roles)

- [How to configure Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/quickstart-assign-role-user-portal)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Leverage Azure Policy to alert, audit, and enforce system configurations for your virtual machines. Additionally, develop a process and pipeline for managing policy exceptions.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.8: Deploy configuration management tools for operating systems

**Guidance**: Azure Automation State Configuration is a configuration management service for Desired State Configuration (DSC) nodes in any cloud or on-premises datacenter. It enables scalability across thousands of machines quickly and easily from a central, secure location. You can easily onboard machines, assign them declarative configurations, and view reports showing each machine's compliance to the desired state you specified.

- [Onboarding machines for management by Azure Automation State Configuration](https://docs.microsoft.com/azure/automation/automation-dsc-onboarding)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Leverage Azure Security Center to perform baseline scans for your Azure Virtual machines.  Additional methods for automated configuration include using Azure Automation State Configuration.

- [How to remediate recommendations in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-remediate-recommendations)

- [Getting started with Azure Automation State Configuration](https://docs.microsoft.com/azure/automation/automation-dsc-getting-started)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.10: Implement automated configuration monitoring for operating systems

**Guidance**: Azure Automation State Configuration is a configuration management service for Desired State Configuration (DSC) nodes in any cloud or on-premises datacenter. It enables scalability across thousands of machines quickly and easily from a central, secure location. You can easily onboard machines, assign them declarative configurations, and view reports showing each machine's compliance to the desired state you specified.

- [Onboarding machines for management by Azure Automation State Configuration](https://docs.microsoft.com/azure/automation/automation-dsc-onboarding)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.ClassicCompute**:

[!INCLUDE [Resource Policy for Microsoft.ClassicCompute 7.10](../../../includes/policy/standards/asb/rp-controls/microsoft.classiccompute-7-10.md)]

**Azure Policy built-in definitions - Microsoft.Compute**:

[!INCLUDE [Resource Policy for Microsoft.Compute 7.10](../../../includes/policy/standards/asb/rp-controls/microsoft.compute-7-10.md)]

### 7.11: Manage Azure secrets securely

**Guidance**: Use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure secret management for your cloud applications.

- [How to integrate with Azure-Managed Identities](https://docs.microsoft.com/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity)

- [How to create a Key Vault](https://docs.microsoft.com/azure/key-vault/general/quick-create-portal)

- [How to authenticate to Key Vault](https://docs.microsoft.com/azure/key-vault/general/authentication)

- [How to assign a Key Vault access policy](https://docs.microsoft.com/azure/key-vault/general/assign-access-policy-portal)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.12: Manage identities securely and automatically

**Guidance**: Use Managed Identities to provide Azure services with an automatically managed identity in Azure Active Directory (Azure AD). Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code.

- [How to configure Managed Identities](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.13: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Malware Defense

*For more information, see the [Azure Security Benchmark: Malware Defense](https://docs.microsoft.com/azure/security/benchmarks/security-control-malware-defense).*

### 8.1: Use centrally-managed anti-malware software

**Guidance**: Use Microsoft Antimalware for Azure  Windows Virtual machines to continuously monitor and defend your resources.

- [How to configure Microsoft Antimalware for Cloud Services and Virtual Machines](https://docs.microsoft.com/azure/security/fundamentals/antimalware)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.ClassicCompute**:

[!INCLUDE [Resource Policy for Microsoft.ClassicCompute 8.1](../../../includes/policy/standards/asb/rp-controls/microsoft.classiccompute-8-1.md)]

**Azure Policy built-in definitions - Microsoft.Compute**:

[!INCLUDE [Resource Policy for Microsoft.Compute 8.1](../../../includes/policy/standards/asb/rp-controls/microsoft.compute-8-1.md)]

### 8.3: Ensure anti-malware software and signatures are updated

**Guidance**: When deployed, Microsoft Antimalware for Azure will automatically install the latest signature, platform, and engine updates by default. Follow recommendations in Azure Security Center: "Compute &amp; Apps" to ensure all endpoints are up to date with the latest signatures. The Windows OS can be further protected with additional security to limit the risk of virus or malware-based attacks with the Microsoft Defender Advanced Threat Protection service that integrates with Azure Security Center.

- [How to deploy Microsoft Antimalware for Azure Cloud Services and Virtual Machines](https://docs.microsoft.com/azure/security/fundamentals/antimalware)

- [Microsoft Defender Advanced Threat Protection](https://docs.microsoft.com/windows/security/threat-protection/microsoft-defender-atp/onboard-configure)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Compute**:

[!INCLUDE [Resource Policy for Microsoft.Compute 8.3](../../../includes/policy/standards/asb/rp-controls/microsoft.compute-8-3.md)]

## Data Recovery

*For more information, see the [Azure Security Benchmark: Data Recovery](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure regular automated back-ups

**Guidance**: Enable Azure Backup and configure the Azure Virtual machines (VM), as well as the desired frequency and retention period for automatic backups.

- [An overview of Azure VM backup](https://docs.microsoft.com/azure/backup/backup-azure-vms-introduction)

- [Back up an Azure VM from the VM settings](https://docs.microsoft.com/azure/backup/backup-azure-vms-first-look-arm)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Compute**:

[!INCLUDE [Resource Policy for Microsoft.Compute 9.1](../../../includes/policy/standards/asb/rp-controls/microsoft.compute-9-1.md)]

### 9.2: Perform complete system backups and backup any customer-managed keys

**Guidance**: Create snapshots of your Azure virtual machines or the managed disks attached to those instances using PowerShell or REST APIs. Back up any customer-managed keys within Azure Key Vault.

Enable Azure Backup and target Azure Virtual Machines (VM), as well as the desired frequency and retention periods. This includes complete system state backup. If you are using Azure disk encryption, Azure VM backup automatically handles the backup of customer-managed keys.

- [Backup on Azure VMs that use encryption](https://docs.microsoft.com/azure/backup/backup-azure-vms-encryption)

- [Overview of Azure VM backup](https://docs.microsoft.com/azure/backup/backup-azure-vms-introduction)

- [An overview of Azure VM backup](https://docs.microsoft.com/azure/backup/backup-azure-vms-introduction)

- [How to backup key vault keys in Azure](https://docs.microsoft.com/powershell/module/az.keyvault/backup-azkeyvaultkey?view=azps-4.8.0&amp;preserve-view=true)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Compute**:

[!INCLUDE [Resource Policy for Microsoft.Compute 9.2](../../../includes/policy/standards/asb/rp-controls/microsoft.compute-9-2.md)]

### 9.3: Validate all backups including customer-managed keys

**Guidance**: Ensure ability to periodically perform data restoration of content within Azure Backup. If necessary, test restore content to an isolated virtual network or subscription. Customer to test restoration of backed up customer-managed keys.

If you are using Azure disk encryption, you can restore the Azure VM with the disk encryption keys. When using disk encryption, you can restore the Azure VM with the disk encryption keys.

- [Backup on Azure VMs that use encryption](https://docs.microsoft.com/azure/backup/backup-azure-vms-encryption)

- [How to recover files from Azure Virtual Machine backup](https://docs.microsoft.com/azure/backup/backup-azure-restore-files-from-vm)

- [How to restore key vault keys in Azure](https://docs.microsoft.com/powershell/module/az.keyvault/restore-azkeyvaultkey?view=azps-4.8.0&amp;preserve-view=true)

- [How to back up and restore an encrypted VM](https://docs.microsoft.com/azure/backup/backup-azure-vms-encryption)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.4: Ensure protection of backups and customer-managed keys

**Guidance**: When you back up Azure managed disks with Azure Backup, VMs are encrypted at rest with Storage Service Encryption (SSE). Azure Backup can also back up Azure VMs that are encrypted by using Azure Disk Encryption. Azure Disk Encryption integrates with BitLocker encryption keys (BEKs), which are safeguarded in a key vault as secrets. Azure Disk Encryption also integrates with Azure Key Vault key encryption keys (KEKs). Enable Soft-Delete in Key Vault to protect keys against accidental or malicious deletion.

- [Soft delete for VMs](https://docs.microsoft.com/azure/backup/soft-delete-virtual-machines)

- [Azure Key Vault soft-delete overview](https://docs.microsoft.com/azure/key-vault/general/overview-soft-delete)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](https://docs.microsoft.com/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create an incident response guide

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/06/27/inside-the-msrc-anatomy-of-a-ssirp-incident/)

- [Customer may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, clearly mark subscriptions (for ex. production, non-prod) using tags and create a naming system to clearly identify and categorize Azure resources, especially those processing sensitive data.  It is your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

- [Security alerts in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-alerts-overview)

- [Use tags to organize your Azure resources](https://docs.microsoft.com/azure/azure-resource-manager/management/tag-resources)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence to help protect your Azure resources. Identify weak points and gaps and revise plan as needed.

- [Refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved.

- [How to set the Azure Security Center Security Contact](https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature to help identify risks to Azure resources. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts to Azure Sentinel.

- [How to configure continuous export](https://docs.microsoft.com/azure/security-center/continuous-export)

- [How to stream alerts into Azure Sentinel](https://docs.microsoft.com/azure/sentinel/connect-azure-security-center)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.6: Automate the response to security alerts

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations to protect your Azure resources.

- [How to configure Workflow Automation and Logic Apps](https://docs.microsoft.com/azure/security-center/workflow-automation)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Penetration Tests and Red Team Exercises

*For more information, see the [Azure Security Benchmark: Penetration Tests and Red Team Exercises](https://docs.microsoft.com/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

**Guidance**: Follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies. Use Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1)

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Next steps

- See the [Azure Security Benchmark V2 overview](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
