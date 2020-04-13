---
title: Azure Security Baseline for Virtual Machine Scale Sets
description: Azure Security Baseline for Virtual Machine Scale Sets
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 04/13/2020
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Azure Security Baseline for Virtual Machine Scale Sets

The Azure Security Baseline for Virtual Machine Scale Sets contains recommendations that will help you improve the security posture of your deployment.

The baseline for this service is drawn from the [Azure Security Benchmark version 1.0](https://docs.microsoft.com/azure/security/benchmarks/overview), which provides recommendations on how you can secure your cloud solutions on Azure with our best practices guidance.

For more information, see [Azure Security Baselines overview](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network Security

*For more information, see [Security Control: Network Security](https://docs.microsoft.com/azure/security/benchmarks/security-control-network-security).*

### 1.1: Protect resources using Network Security Groups or Azure Firewall on your Virtual Network

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2086).

**Guidance**: When you create an Azure virtual machine (VM), you must create a virtual network or use an existing virtual network and configure VM with a subnet.   Ensure that all deployed subnets have a Network Security Group applied with network access controls specific to your applications trusted ports and sources. Use Azure Services with Private Link enabled, deploy the service inside your virtual network or connect privately using Private Endpoints. For service specific requirements, please refer to the security recommendation for that specific service.  Alternatively, if you have a specific use case, Azure Firewall may also be used to meet certain requirements.

Networking for Azure virtual machine scale sets:  https://docs.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-networking

How to create a Virtual Network: https://docs.microsoft.com/azure/virtual-network/quick-create-portal

How to create an NSG with a Security Config: https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic

How to deploy and configure Azure Firewall: https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.2: Monitor and log the configuration and traffic of Vnets, Subnets, and NICS

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2087).

**Guidance**: Use the Azure Security Center to identify and follow network protection recommendations to help secure your Azure Virtual Machine (VM) resources in Azure. Enable NSG flow logs and send logs into a Storage Account for traffic audit for the VMs for unusual activity.
How to Enable NSG Flow Logs: https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal

Understand Network Security provided by Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-network-recommendations



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.3: Protect Critical Web Applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2088).

**Guidance**: If using web applications inside your Virtual Machine Scale Set(VMSS),  use network security group(NSG) to configure which network traffic and ports are able to connect to the resources on the virtual network.  NSGs contain two sets of rules: inbound and outbound. The priority for a rule must be unique within each set. Each rule has properties of protocol, source and destination port ranges, address prefixes, direction of traffic, priority, and access type.  You can also deploy Azure Web Application Firewall (WAF) in front of critical web applications for additional inspection of incoming traffic. Enable Diagnostic Setting for WAF and ingest logs into a Storage Account, Event Hub, or Log Analytics Workspace. 

Networking for Azure virtual machine scale sets:  https://docs.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-networking
Create an application gateway with a Web Application Firewall using the Azure portal:  https://docs.microsoft.com/azure/web-application-firewall/ag/application-gateway-web-application-firewall-portal



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.4: Deny Communications with Known Malicious IP Addresses

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2089).

**Guidance**: Enable Distributed Denial of Service (DDoS) Standard protection on the Virtual Networks to guard against DDoS attacks. Using Azure Security Center Integrated Threat Intelligence, you can deny communications with known malicious IP addresses.  Configure appropriately Azure Firewall on each of the Virtual Network segments, with Threat Intelligence enabled and configured to "Alert and deny" for malicious network traffic.
You can use Azure Security Center's Just In Time Network access to limit exposure of Windows Virtual Machines to the approved IP addresses for a limited period.  Also, use Azure Security Center Adaptive Network Hardening to recommend NSG configurations that limit ports and source IPs based on actual traffic and threat intelligence.

How to configure DDoS protection: https://docs.microsoft.com/azure/virtual-network/manage-ddos-protection

How to deploy Azure Firewall: https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal

Understand Azure Security Center Integrated Threat Intelligence: https://docs.microsoft.com/azure/security-center/security-center-alerts-service-layer

Understand Azure Security Center Adaptive Network Hardening: https://docs.microsoft.com/azure/security-center/security-center-adaptive-network-hardening

Understand Azure Security Center Just In Time Network Access Control: https://docs.microsoft.com/azure/security-center/security-center-just-in-time


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.5: Record Network Packets and Flow Logs

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2090).

**Guidance**: You can record NSG flow logs into a storage account to generate flow records for your Azure Virtual Machines. When investigating anomalous activity, you could enable Network Watcher packet capture so that network traffic can be reviewed for unusual and unexpected activity.
How to Enable NSG Flow Logs: https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal

How to enable Network Watcher: https://docs.microsoft.com/azure/network-watcher/network-watcher-create


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.6: Deploy Network Based Intrusion Detection/Intrusion Prevention Systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2091).

**Guidance**: By combining packet captures provided by Network Watcher and open source IDS tools such as Suricata, you can perform network intrusion detection for a wide range of threats. Also, you can deploy Azure Firewall on the Virtual Network segments as appropiate, with Threat Intelligence enabled and configured to "Alert and deny" for malicious network traffic.
Perform network intrusion detection with Network Watcher and open source tools: https://docs.microsoft.com/azure/network-watcher/network-watcher-intrusion-detection-open-source-tools

How to deploy Azure Firewall: https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal

How to configure alerts with Azure Firewall: https://docs.microsoft.com/azure/firewall/threat-intel


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.7: Manage traffic to your web applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2092).

**Guidance**: If using web applications inside your Virtual Machine Scale Set(VMSS),  you may deploy Azure Application Gateway for web applications with HTTPS/SSL enabled for trusted certificates. With Azure Application Gateway, you direct your application web traffic to specific resources by assigning listeners to ports, creating rules, and adding resources to a backend pool like VMSS etc.

How to deploy Application Gateway: https://docs.microsoft.com/azure/application-gateway/quick-create-portal

How to configure Application Gateway to use HTTPS: https://docs.microsoft.com/azure/application-gateway/create-ssl-portal

Create a scale set that references an Application Gateway:  https://docs.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-networking#create-a-scale-set-that-references-an-application-gateway

Understand layer 7 load balancing with Azure web application gateways: https://docs.microsoft.com/azure/application-gateway/overview

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.8: Minimize complexity and administrative overhead of network security rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2093).

**Guidance**: Use Virtual Network Service Tags to define network access controls on network security groups or Azure Firewall configured for your Azure Virtual machines. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., ApiManagement) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

Understand and using Service Tags: https://docs.microsoft.com/azure/virtual-network/service-tags-overview



**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.9: Maintain Standard Security Configurations for Network Devices

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2094).

**Guidance**: Define and implement standard security configurations for Azure Virtual Machines (VM) using Azure Policy.  You may also use Azure Blueprints to simplify large scale Azure VM deployments by packaging key environment artifacts, such as AzureResources Manager templates, RBAC controls, and policies, in a single blueprint definition. You can apply the blueprint to new subscriptions, and fine-tune control and management through versioning.
How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

Learn about virtual machine scale set templates :  https://docs.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-mvss-start 

Azure Policy samples for networking: https://docs.microsoft.com/azure/governance/policy/samples/#network

How to create an Azure Blueprint: https://docs.microsoft.com/azure/governance/blueprints/create-blueprint-portal


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.10: Document Traffic Configuration Rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2095).

**Guidance**: You may use tags for network security groups (NSG) and other resources related to network security and traffic flow configured for your Windows Virtual machines. For individual NSG rules, use the "Description" field to specify business need and/or duration (etc.) for any rules that allow traffic to/from a network.

How to create and use tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

How to create a Virtual Network:  https://docs.microsoft.com/azure/virtual-network/quick-create-portal

How to create an NSG with a Security Config: https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.11: Use Automated Tools to Monitor Network Resource Configurations and Detect Changes

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2096).

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network settings and resources related to your Azure Virtual Machine Scale Set. Create alerts within Azure Monitor that will trigger when changes to critical network settings or resources takes place.How to view and retrieve Azure Activity Log events: https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-viewHow to create alerts in Azure Monitor: https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Logging and Monitoring

*For more information, see [Security Control: Logging and Monitoring](https://docs.microsoft.com/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.1: Use Approved Time Synchronization Sources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2097).

**Guidance**: Microsoft maintains time sources for Azure resources, however, you have the option to manage the time synchronization settings for your Virtual Machines.
How to configure time synchronization for Azure Windows compute resources: https://docs.microsoft.com/azure/virtual-machines/windows/time-sync

How to configure time synchronization for Azure Linux compute resources: https://docs.microsoft.com/azure/virtual-machines/linux/time-sync



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 2.2: Configure Central Security Log Management

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2098).

**Guidance**: Use Azure Security Center to provide Security Event log monitoring for Azure Virtual Machines. Given the volume of data that the security event log generates, it is not stored by default. 
If your organization would like to retain the security event log data from the virtual machine, it can be stored within a Data Collection tier, at which point it can be queried in Log Analytics. 

Additionally, use Azure Activity Log to provides insight into subscription-level events that have occurred in Azure.

Data collection in Azure Security Center:  https://docs.microsoft.com/azure/security-center/security-center-enable-data-collection#data-collection-tier 

How to monitor virtual machines in Azure:  https://docs.microsoft.com/azure/virtual-machines/windows/monitor


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure Resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2099).

**Guidance**: Enable Azure Monitor for access to your audit and activity logs which includes event source, date, user, timestamp, source addresses, destination addresses, and other useful elements. 

How to collect platform logs and metrics with Azure Monitor:  https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings

View and retrieve Azure Activity log events:  https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.4: Collect Security Logs from Operating System

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2100).

**Guidance**: Use Azure Security Center to provide Security Event log monitoring for Azure Virtual Machines. Given the volume of data that the security event log generates, it is not stored by default. 
If your organization would like to retain the security event log data from the virtual machine, it can be stored within a Data Collection tier, at which point it can be queried in Log Analytics. 

Data collection in Azure Security Center:  https://docs.microsoft.com/azure/security-center/security-center-enable-data-collection#data-collection-tier 

How to monitor virtual machines in Azure:  https://docs.microsoft.com/azure/virtual-machines/windows/monitor



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.5: Configure Security Log Storage Retention

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2101).

**Guidance**: Onboard Azure Virtual Machine Scale Sets (VMSS) to Azure Monitor. Ensure that the Azure Log Analytics workspace used has the log retention period set according to your organization's compliance regulations.

How to monitor virtual machines in Azure:  https://docs.microsoft.com/azure/virtual-machines/windows/monitor

How to configure Log Analytics Workspace Retention Period: https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage



**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.6: Monitor and Review Logs

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2102).

**Guidance**: Analyze and monitor logs for anomalous behavior and regularly review results. Use Azure Monitor's Log Analytics workspace to review logs and perform queries on log data.
Alternatively, you may enable and on-board data to Azure Sentinel or a third party SIEM. 

How to onboard Azure Sentinel: https://docs.microsoft.com/azure/sentinel/quickstart-onboard

Understand Log Analytics Workspace: https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-portal

How to perform custom queries in Azure Monitor: https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-queries


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.7: Enable Alerts for Anomalous Activity

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2103).

**Guidance**: Use Azure Security Center with Log Analytics workspace for monitoring and alerting on anomalous activity found in security logs and events for your Azure Virtual Machines.  
Alternatively, you may enable and on-board data to Azure Sentinel or a third party SIEM. 

How to onboard Azure Sentinel: https://docs.microsoft.com/azure/sentinel/quickstart-onboard

How to manage alerts in Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-managing-and-responding-alerts

How to alert on log analytics log data: https://docs.microsoft.com/azure/azure-monitor/learn/tutorial-response


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.8: Centralize Anti-malware Logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2104).

**Guidance**: You may use Microsoft Antimalware for Azure Cloud Services and Virtual Machines and configure your Windows Virtual machines to log events to an Azure Storage Account. Configure a Log Analytics workspace to ingest the events from the Storage Accounts and create alerts where appropriate. Follow recommendations in Azure Security Center: "Compute &amp; Apps".  For Linux Virtual machines, you will need a third party tool for anti-malware vulnerability detection. How to configure Microsoft Antimalware for Cloud Services and Virtual Machines: https://docs.microsoft.com/azure/security/fundamentals/antimalware

How to Enable guest-level monitoring for Virtual Machines: https://docs.microsoft.com/azure/cost-management/azure-vm-extended-metrics

Instructions for onboarding Linux servers to Azure Security center:  https://docs.microsoft.com/azure/security-center/quick-onboard-linux-computer 
Following link provides the Microsoft recommended security guidelines, which can serve as a criteria list for the vulnerability software selected : https://docs.microsoft.com/azure/virtual-machines/linux/security-recommendations



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.9: Enable DNS Query Logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2105).

**Guidance**: If using your own DNS solution, Azure DNS Analytics (Preview) solution in Azure Monitor gathers insights into DNS infrastructure on security, performance, and operations. Also,you can use third party dns logging solution if DNS Analytics is not available in your region.
Gather insights about your DNS infrastructure with the DNS Analytics Preview solution: https://docs.microsoft.com/azure/azure-monitor/insights/dns-analytics


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.10: Enable Command-line Audit Logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2106).

**Guidance**: The Azure Security Center provides Security Event log monitoring for Azure Virtual Machines(VM).  Security Center provisions the Microsoft Monitoring Agent on all supported Azure VMs and any new ones that are created if automatic provisioning is enabled OR you can install the agent manually.  The agent enables the process creation event 4688 and the CommandLine field inside event 4688. New processes created on the VM are recorded by EventLog and monitored by Security Center’s detection services.

For Linux Virtual machines, you can manually configure console logging on a per-node basis and use syslogs to store the data.  Also, use Azure Monitor's Log Analytics workspace to review logs and perform queries on syslog data from Azure Virtual machines. 

Data collection in Azure Security Center:

https://docs.microsoft.com/azure/security-center/security-center-enable-data-collection#data-collection-tier

How to perform custom queries in Azure Monitor: https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-queries

Syslog data sources in Azure Monitor:  https://docs.microsoft.com/azure/azure-monitor/platform/data-sources-syslog



**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Identity and Access Control

*For more information, see [Security Control: Identity and Access Control](https://docs.microsoft.com/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain Inventory of Administrative Accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2107).

**Guidance**: While Azure Active Directory is the recommended method to administrate user access, Azure Virtual Machines may have local accounts. Both local and domain accounts should be reviewed and managed, normally with a minimum footprint. In addition, we would advise that the Privileged Identity Manager is reviewed for the Just In Time feature to reduce the availability of administrative permissions.

Information for Local Accounts is available at: https://docs.microsoft.com/azure/active-directory/devices/assign-local-admin#manage-the-device-administrator-role

Information on Privileged Identity Manager: https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-deployment-plan

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.2: Change Default Passwords where Applicable

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2108).

**Guidance**: Azure Virtual Machine Scale Set and Azure Active Directory does not have the concept of default passwords.  Customer responsible for third party applications and marketplace services that may use default passwords.



**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.3: Ensure the Use of Dedicated Administrative Accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2109).

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts that have access to your virtual machine. Use Azure Security Center Identity and access management to monitor the number of administrative accounts.  The administrator accounts on Azure Virtual Machines can also be configured with the Azure Privileged Identity Manager (PIM). Azure Privileged Identity Manager provides several options such as Just in Time elevation, Multi-Factor Authentication, and delegation options so that permissions are only available for specific time frames and require a second person to approve.
Understand Azure Security Center Identity and Access: https://docs.microsoft.com/azure/security-center/security-center-identity-access

Information on Privileged Identity Manager: https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-deployment-plan


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.4: Utilize Single Sign-On (SSO) with Azure Active Directory

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2110).

**Guidance**: Wherever possible, use SSO with Azure Active Directory rather than configuring individual stand-alone credentials per-service. Use Azure Security Center Identity and Access Management recommendations.

Single sign-on to applications in Azure Active Directory: https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on

How to monitor identity and access within Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-identity-access

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.5: Use Multifactor Authentication for all Azure Active Directory based access.

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2111).

**Guidance**: The administrator accounts on Azure Virtual Machines can be configured with the Azure Privileged Identity Manager (PIM). Azure Privileged Identity Manager provides several options such as Just in Time elevation, Multi-Factor Authentication, and delegation options so that permissions are only available for specific time frames and require a second person to approve.
Information on Privileged Identity Manager: https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-deployment-plan


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.6: Use of Dedicated Machines (Privileged Access Workstations) for all Administrative Tasks

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2112).

**Guidance**: Use PAWs (privileged access workstations) with MFA configured to log into and configure Azure resources.
Learn about Privileged Access Workstations: https://docs.microsoft.com/windows-server/identity/securing-privileged-access/privileged-access-workstations

How to enable MFA in Azure: https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.7: Log and Alert on Suspicious Activity on Administrative Accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2114).

**Guidance**: Utilize Azure AD Privileged Identity Management (PIM) for generation of logs and alerts when suspicious or unsafe activity occurs in the environment. Utilize Azure AD Risk Detections to view alerts and reports on risky user behavior. Optionally, customer may ingest Azure Security Center Risk Detection alerts into Azure Monitor and configure custom alerting/notifications using Action Groups.
How to deploy Privileged Identity Management (PIM): https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-deployment-plan

Understanding Azure Security Center risk detections (suspicious activity): https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risk-events

How to integrate Azure Activity Logs into Azure Monitor: https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics

How to configure action groups for custom alerting and notification: https://docs.microsoft.com/azure/azure-monitor/platform/action-groups


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.8: Manage Azure Resource from only Approved Locations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2115).

**Guidance**: Customer to use Conditional Access named locations to allow access from only specific logical groupings of IP address ranges or countries/regions.
How to configure named locations in Azure:  https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.9: Utilize Azure Active Directory

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2116).

**Guidance**: Utilizes Azure Active Directory (Azure AD) as the central authentication and authorization system. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.  You can use managed identities to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code. Your code that's running on a virtual machine, can use managed identity to request access tokens for services that support Azure AD authentication. 

How to create and configure an Azure AD instance: https://docs.microsoft.com/azure/active-directory-domain-services/tutorial-create-instance

What are managed identities for Azure resources?: https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.10: Regularly Review and Reconcile User Access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2117).

**Guidance**: Azure AD provides logs to help discover stale accounts. In addition, customer to use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User's access can be reviewed on a regular basis to make sure only the right users have continued access. When using Azure Virtual machines, you will need to review the local security groups and users to make sure that there are no unexpected accounts which could compromise the system. 
How to use Azure Identity Access Reviews:  https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.11: <span></span><span>Monitor Attempts to Access Deactivated Accounts<br></span><span></span><span></span>

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2118).

**Guidance**: Configure diagnostic settings for Azure Active Directory to send the audit logs and sign-in logs to a Log Analytics workspace. Also, use Azure Monitor's Log Analytics workspace to review logs and perform queries on log data from Azure Virtual machines.
Understand Log Analytics Workspace: https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-portal

How to integrate Azure Activity Logs into Azure Monitor: https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics

How to perform custom queries in Azure Monitor: https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-queries

How to monitor virtual machines in Azure: https://docs.microsoft.com/azure/virtual-machines/windows/monitor

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.12: Alert on Account Login Behavior Deviation

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2119).

**Guidance**: Use Azure Active Directory's Risk and Identity Protection features to configure automated responses to detected suspicious actions related to your Storage account resources. You should enable automated responses through Azure Sentinel to implement your organization's security responses. 

How to view Azure AD risky sign-ins: https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risky-sign-ins 

How to configure and enable Identity Protection risk policies: https://docs.microsoft.com/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies 

How to onboard Azure Sentinel: https://docs.microsoft.com/azure/sentinel/quickstart-onboard

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2120).

**Guidance**: In support scenarios where Microsoft needs access to customer data (such as during a support request), use Customer Lockbox (Preview) for Azure virtual machines to review and approve or reject customer data access requests.

Understanding Customer Lockbox: https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Data Protection

*For more information, see [Security Control: Data Protection](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an Inventory of Sensitive Information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2121).

**Guidance**: Use Tags to assist in tracking Azure virtual machines that store or process sensitive information.

How to create and use tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2122).

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. Resources should be separated by virtual network/subnet, tagged appropriately, and secured within an network security group (NSG) or Azure Firewall. For Virtual Machines storing or processing sensitive data, implement policy and procedure(s) to turn them off when not in use.

How to create additional Azure subscriptions: https://docs.microsoft.com/azure/billing/billing-create-subscription

How to create Management Groups: https://docs.microsoft.com/azure/governance/management-groups/create

How to create and use Tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

How to create a Virtual Network: https://docs.microsoft.com/azure/virtual-network/quick-create-portal

How to create an NSG with a Security Config: https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic

How to deploy Azure Firewall: https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal

How to configure alert or alert and deny with Azure Firewall: https://docs.microsoft.com/azure/firewall/threat-intel

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.3: Monitor and Block unauthorized transfer of sensitive information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2123).

**Guidance**: Deploy an automated tool on network perimeters that monitors for unauthorized transfer of sensitive information and blocks such transfers while alerting information security professionals.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

Understand customer data protection in Azure:

https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 4.4: Encrypt All Sensitive Information in Transit

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2124).

**Guidance**: Data in transit to, from, and between Virtual Machines(VM) that are running Windows is encrypted in a number of ways, depending on the nature of the connection e.g RDP sessions, SSH etc.

In-transit encryption in VMs: https://docs.microsoft.com/azure/security/fundamentals/encryption-overview#in-transit-encryption-in-vms

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### 4.5: Utilize an Active Discovery Tool to Identify Sensitive Data

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2125).

**Guidance**: Use a third party active discovery tool to identify all sensitive information stored, processed, or transmitted by the organization's technology systems, including those located onsite or at a remote service provider and update the organization's sensitive information inventory.



**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.6: Utilize Azure RBAC to control access to resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2126).

**Guidance**: Using role-based access control (RBAC), you can segregate duties within your team and grant only the amount of access to users on your virtual machine(VM) that they need to perform their jobs. Instead of giving everybody unrestricted permissions on the VM, you can allow only certain actions. You can configure access control for the VM in the Azure portal, using the Azure CLI, or Azure PowerShell.
What is role-based access control (RBAC) for Azure resources?: https://docs.microsoft.com/azure/role-based-access-control/overview

Built-in roles for Azure resources (e.g. Virtual Machine Contributor): https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#virtual-machine-contributor


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.7: Use host-based Data Loss Prevention to enforce access control

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2127).

**Guidance**: Implement a third party tool, such as an automated host-based Data Loss Prevention solution, to enforce access controls to mitigate the risk of data breaches.


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.8: Encrypt Sensitive Information at Rest

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2128).

**Guidance**: Use Azure Disk Encryption to provide volume encryption for the OS and data disks of your virtual machines

Azure Disk Encryption for Virtual Machine Scale Sets: https://docs.microsoft.com/azure/virtual-machine-scale-sets/disk-encryption-overview



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 4.9: Log and alert on changes to critical Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2129).

**Guidance**: Use Azure Monitor with the Azure Activity Log to create alerts for when changes take place to Virtual machines scale sets and related resources.  

How to create alerts for Azure Activity Log events: https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log

Azure Storage analytics logging: https://docs.microsoft.com/azure/storage/common/storage-analytics-logging

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Vulnerability Management

*For more information, see [Security Control: Vulnerability Management](https://docs.microsoft.com/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.1: Run Automated Vulnerability Scanning Tools

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2130).

**Guidance**: Follow recommendations from Azure Security Center on performing vulnerability assessments on your Azure Virtual Machines.  Use Azure Security recommended or third-party solution for performing vulnerability assessments for your virtual machines. 

How to implement Azure Security Center vulnerability assessment recommendations:  https://docs.microsoft.com/azure/security-center/security-center-vulnerability-assessment-recommendations

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 5.2: Deploy Automated Operating System Patch Management Solution

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2131).

**Guidance**: Enable Automatic OS Upgrades for supported operating system versions, or for custom images stored in a Shared Image Gallery.

Automatic OS Upgrades for virtual machine scale sets in Azure: https://docs.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 5.3: Deploy Automated Third Party Software Patch Management Solution

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2132).

**Guidance**: You may use third-party patch management solution.  You can use the Azure Update Management solution to manage updates and patches for your virtual machines.  Update Management relies on the locally configured update repository to patch supported systems. 

Update Management solution in Azure: https://docs.microsoft.com/azure/automation/automation-update-management

Manage updates and patches for your Azure VMs: https://docs.microsoft.com/azure/automation/automation-tutorial-update-management

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 5.4: Compare Back-to-back Vulnerability Scans

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2133).

**Guidance**: Export scan results at consistent intervals and compare the results to verify that vulnerabilities have been remediated. When using vulnerability management recommendation suggested by Azure Security Center, customer may pivot into the selected solution's portal to view historical scan data.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 5.5: Utilize a risk-rating process to prioritize the remediation of discovered vulnerabilities.

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2134).

**Guidance**: Use the default risk ratings (Secure Score) provided by Azure Security Center.

Understand Azure Security Center Secure Score: https://docs.microsoft.com/azure/security-center/security-center-secure-score

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Inventory and Asset Management

*For more information, see [Security Control: Inventory and Asset Management](https://docs.microsoft.com/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Utilize Azure Asset Discovery

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2135).

**Guidance**: Use Azure Resource Graph to query and discover all resources (including Virtual machines) within your subscription(s). Ensure you have appropriate (read) permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions.

How to create queries with Azure Graph: https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal

How to view your Azure Subscriptions: https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0

Understand Azure RBAC: https://docs.microsoft.com/azure/role-based-access-control/overview

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.2: Maintain Asset Metadata

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2136).

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

How to create and use Tags:  https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.3: Delete Unauthorized Azure Resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2137).

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track Virtual Machines Scale Sets and related resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

How to create additional Azure subscriptions:  https://docs.microsoft.com/azure/billing/billing-create-subscription

How to create Management Groups:  https://docs.microsoft.com/azure/governance/management-groups/create

How to create and use Tags:  https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.4: Maintain inventory of approved Azure resources and software titles.

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2138).

**Guidance**: 
You will need to create an inventory of approved Azure resources and approved software for compute resources as per your organizational needs.  


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.5: Monitor for Unapproved Azure Resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2139).

**Guidance**: Use Azure policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

In addition, use the Azure Resource Graph to query/discover resources within the subscription(s). This can help in high security based environments, such as those with Storage accounts.

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

How to create queries with Azure Graph: https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.6: Monitor for Unapproved Software Applications within Compute Resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2140).

**Guidance**: Azure Automation provides complete control during deployment, operations, and decommissioning of workloads and resources.  Leverage Azure Virtual Machine Inventory to automate the collection of information about all software on Virtual Machines. Note: Software Name, Version, Publisher, and Refresh time are available from the Azure Portal. To get access to install date and other information, customer required to enable guest-level diagnostic and bring the Windows Event logs into a Log Analytics Workspace.
An introduction to Azure Automation:  https://docs.microsoft.com/azure/automation/automation-intro

How to enable Azure VM Inventory:  https://docs.microsoft.com/azure/automation/automation-tutorial-installed-software


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.7: Remove Unapproved Azure Resources and Software Applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2141).

**Guidance**: Azure Automation provides complete control during deployment, operations, and decommissioning of workloads and resources.  You may use Change Tracking to identify all software installed on Virtual Machines. You can implement your own process or use Azure Automation State Configuration for removing unauthorized software.

An introduction to Azure Automation: https://docs.microsoft.com/azure/automation/automation-intro

Track changes in your environment with the Change Tracking solution: https://docs.microsoft.com/azure/automation/change-tracking

Azure Automation State Configuration Overview: https://docs.microsoft.com/azure/automation/automation-dsc-overview

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.8: Utilize only approved applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2142).

**Guidance**: Use Azure Security Center Adaptive Application Controls to ensure that only authorized software executes and all unauthorized software is blocked from executing on Azure Virtual Machines.
How to use Azure Security Center Adaptive Application Controls:  https://docs.microsoft.com/azure/security-center/security-center-adaptive-application


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 6.9: Utilize only approved Azure Services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2143).

**Guidance**: Use Azure policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:
- Not allowed resource types
- Allowed resource types

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

How to deny a specific resource type with Azure Policy: https://docs.microsoft.com/azure/governance/policy/samples/not-allowed-resource-types


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.10: <span style="display:inline !important;">Implement approved application list</span>

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/4080).

**Guidance**: Use Adaptive application control to control which applications can run on your Azure and non-Azure machines (Windows and Linux).  Implement third party solution if this does not meet your organization's requirement.

How to use Azure Security Center Adaptive Application Controls:  https://docs.microsoft.com/azure/security-center/security-center-adaptive-application

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.11: Limit Users' Ability to interact with <span style="display:inline !important;">Azure Resource Manager<span>&nbsp;</span></span>via Scripts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2144).

**Guidance**: Use Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.
How to configure Conditional Access to block access to Azure Resource Manager: https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 6.12: Limit Users' Ability to Execute Scripts within Compute Resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2145).

**Guidance**: Depending on the type of scripts, you may use operating system specific configurations or third-party resources to limit users' ability to execute scripts within Azure compute resources.  You can also leverage Azure Security Center Adaptive Application Controls to ensure that only authorized software executes and all unauthorized software is blocked from executing on Azure Virtual Machines.
How to control PowerShell script execution in Windows Environments: https://docs.microsoft.com/powershell/module/microsoft.powershell.security/set-executionpolicy?view=powershell-6

How to use Azure Security Center Adaptive Application Controls: https://docs.microsoft.com/azure/security-center/security-center-adaptive-application


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.13: Physically or Logically Segregate High Risk Applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2146).

**Guidance**: High risk applications deployed in your Azure environment may be isolated using virtual network, subnet, subscriptions, management groups etc. and sufficiently secured with either an Azure Firewall, Web Application Firewall (WAF) or network security group (NSG). 
Virtual networks and virtual machines in Azure:  https://docs.microsoft.com/azure/virtual-machines/windows/network-overview

What is Azure Firewall?:  https://docs.microsoft.com/azure/firewall/overview

What is Azure Web Application Firewall?: https://docs.microsoft.com/azure/web-application-firewall/overview

Network security groups: https://docs.microsoft.com/azure/virtual-network/security-overview

What is Azure Virtual Network?: https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview

Organize your resources with Azure management groups: https://docs.microsoft.com/azure/governance/management-groups/overview

Subscription decision guide: https://docs.microsoft.com/azure/cloud-adoption-framework/decision-guides/subscriptions/

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Secure Configuration

*For more information, see [Security Control: Secure Configuration](https://docs.microsoft.com/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish Secure Configurations for all Azure Resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2147).

**Guidance**: Use Azure Policy or Azure Security Center to maintain security configurations for all Azure Resources. Also, Azure Resource Manager has the ability to export the template in Java Script Object Notation (JSON), which should be reviewed to ensure that the configurations meet / exceed the security requirements for your company.
How to configure and manage Azure Policy:  https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

Information on how to download the VM template:  https://docs.microsoft.com/azure/virtual-machines/windows/download-template


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.2: Establish Secure Configurations for your Operating System

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2148).

**Guidance**: Use Azure Security Center recommendation [Remediate Vulnerabilities in Security Configurations on your Virtual Machines] to maintain security configurations on all compute resources.
How to monitor Azure Security Center recommendations:  https://docs.microsoft.com/azure/security-center/security-center-recommendations

How to remediate Azure Security Center recommendations:  https://docs.microsoft.com/azure/security-center/security-center-remediate-recommendations


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.3: Maintain Secure Configurations for all Azure Resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2149).

**Guidance**: Use Azure Resource Manager templates and Azure Policies to securely configure Azure resources associated with the Virtual Machines Scale Sets.  Azure Resource Manager templates are JSON based files used to deploy Virtual machine along with Azure resources and custom template will need to be maintained.  Microsoft performs the maintenance on the base templates.  Use Azure policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.
Information on creating Azure Resource Manager templates:  https://docs.microsoft.com/azure/virtual-machines/windows/ps-template

How to configure and manage Azure Policy:  https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

Understanding Azure Policy Effects:  https://docs.microsoft.com/azure/governance/policy/concepts/effects


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.4: Maintain Secure Configurations for Operating Systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2150).

**Guidance**: There are several options for maintaining a secure configuration for Azure Virtual Machines(VM) for deployment:1. Azure Resource Manager templates: These are JSON based files used to deploy a VM from the Azure Portal, and custom template will need to be maintained. Microsoft performs the maintenance on the base templates.
2. Custom Virtual hard disk (VHD): In some circumstances it may be required to have custom VHD files used such as when dealing with complex environments that cannot be managed through other means. 
3. Azure Automation State Configuration: Once the base OS is deployed, this can be used for more granular control of the settings, and enforced through the automation framework.

For most scenarios, the Microsoft base VM templates combined with the Azure Automation Desired State Configuration can assist in meeting and maintaining the security requirements. 

Information on how to download the VM template: https://docs.microsoft.com/azure/virtual-machines/windows/download-template

Information on creating ARM templates: https://docs.microsoft.com/azure/virtual-machines/windows/ps-template

How to upload a custom VM VHD to Azure: https://docs.microsoft.com/azure-stack/operator/azure-stack-add-vm-image?view=azs-1910


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 7.5: Securely Store Configuration of Azure Resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2151).

**Guidance**: Use Azure DevOps to securely store and manage your code like custom Azure policies, Azure Resource Manager templates, Desired State Configuration scripts etc.   To access the resources you manage in Azure DevOps—such as your code, builds, and work tracking—you must have permissions for those specific resources. Most permissions are granted through built-in security groups as described in Permissions and access. You can grant or deny permissions to specific users, built-in security groups, or groups defined in Azure Active Directory (Azure AD) if integrated with Azure DevOps, or Active Directory if integrated with TFS.
How to store code in Azure DevOps:  https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops

About permissions and groups in Azure DevOps:  https://docs.microsoft.com/azure/devops/organizations/security/about-permissions


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.6: Securely Store Custom Operating System Images

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2152).

**Guidance**: If using custom images (e.g. Virtual Hard Disk(VHD)), use RBAC to ensure only authorized users may access the images.  
Understand RBAC in Azure:  https://docs.microsoft.com/azure/role-based-access-control/rbac-and-directory-admin-roles

How to configure RBAC in Azure:  https://docs.microsoft.com/azure/role-based-access-control/quickstart-assign-role-user-portal 


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.7: Deploy System Configuration Management Tools

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2153).

**Guidance**: Leverage Azure Policy to alert, audit, and enforce system configurations for your Virtual machine. Additionally, develop a process and pipeline for managing policy exceptions.
How to configure and manage Azure Policy:  https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.8: Deploy System Configuration Management Tools for Operating Systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2154).

**Guidance**: Azure Automation State Configuration is a configuration management service for Desired State Configuration (DSC) nodes in any cloud or on-premises datacenter. It enables scalability across thousands of machines quickly and easily from a central, secure location. You can easily onboard machines, assign them declarative configurations, and view reports showing each machine's compliance to the desired state you specified. 
Onboarding machines for management by Azure Automation State Configuration:  https://docs.microsoft.com/azure/automation/automation-dsc-onboarding


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.9: Implement Automated Configuration Monitoring for Azure Services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2155).

**Guidance**: Leverage Azure Security Center to perform baseline scans for your Azure Virtual machines.  Additional methods for automated configuration includes the Azure Automation State Configuration.
How to remediate recommendations in Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-remediate-recommendations

Getting started with Azure Automation State Configuration:  https://docs.microsoft.com/azure/automation/automation-dsc-getting-started


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.10: Implement Automated Configuration Monitoring for Operating Systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2156).

**Guidance**: Azure Automation State Configuration is a configuration management service for Desired State Configuration (DSC) nodes in any cloud or on-premises datacenter. It enables scalability across thousands of machines quickly and easily from a central, secure location. You can easily onboard machines, assign them declarative configurations, and view reports showing each machine's compliance to the desired state you specified. 

Onboarding machines for management by Azure Automation State Configuration:  https://docs.microsoft.com/azure/automation/automation-dsc-onboarding

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.11: Securely manage Azure secrets

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2157).

**Guidance**: Use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure secret management for your cloud applications.

How to integrate with Azure Managed Identities:  https://docs.microsoft.com/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity

How to create a Key Vault:  https://docs.microsoft.com/azure/key-vault/quick-create-portal

How to provide Key Vault authentication with a managed identity:  https://docs.microsoft.com/azure/key-vault/managed-identity

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.12: Securely and automatically manage identities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2158).

**Guidance**: Use Managed Identities to provide Azure services with an automatically managed identity in Azure AD. Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code.
How to configure Managed Identities:  https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.13: Eliminate unintended credential exposure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2159).

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.
How to setup Credential Scanner:  https://secdevtools.azurewebsites.net/helpcredscan.html


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Malware Defense

*For more information, see [Security Control: Malware Defense](https://docs.microsoft.com/azure/security/benchmarks/security-control-malware-defense).*

### 8.1: Utilize Centrally Managed Anti-malware Software

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2160).

**Guidance**: Use Microsoft Antimalware for Azure Windows Virtual machines to continuously monitor and defend your resources.  You will need a third party tool for anti-malware protection in Azure Linux Virtual machine. 
How to configure Microsoft Antimalware for Cloud Services and Virtual Machines:  https://docs.microsoft.com/azure/security/fundamentals/antimalware 



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2161).

**Guidance**: Not applicable to Azure Virtual machines as its a compute resource.

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 8.3: Ensure Anti-Malware Software and Signatures are Updated

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2162).

**Guidance**: When deployed for Windows Virtual machines, Microsoft Antimalware for Azure will automatically install the latest signature, platform, and engine updates by default. Follow recommendations in Azure Security Center: "Compute &amp; Apps" to ensure all endpoints are up to date with the latest signatures. The Windows OS can be further protected with additional security to limit the risk of virus or malware based attacks with the Microsoft Defender Advanced Threat Protection service that integrates with Azure Security Center. 

You will need a third party tool for anti-malware protection in Azure Linux Virtual machine. 

How to deploy Microsoft Antimalware for Azure Cloud Services and Virtual Machines:  https://docs.microsoft.com/azure/security/fundamentals/antimalware

Microsoft Defender Advanced Threat Protection:  https://docs.microsoft.com/windows/security/threat-protection/microsoft-defender-atp/onboard-configure 

Following link is some of the Microsoft recommended security guidelines, which can serve as a criteria list for the vulnerability software selected : https://docs.microsoft.com/azure/virtual-machines/linux/security-recommendations



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Data Recovery

*For more information, see [Security Control: Data Recovery](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure Regular Automated Back Ups

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2164).

**Guidance**: Create snapshot of the Azure virtual machine scale set instance or managed disk attached to the instance using PowerShell or REST APIs.  You can also use Azure Automation to execute the backup scripts at regular intervals.

How to take a snapshot of a virtual machine scale set instance and managed disk: https://docs.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-faq#how-do-i-take-a-snapshot-of-a-virtual-machine-scale-set-instance 

Introduction to Azure Automation: https://docs.microsoft.com/azure/automation/automation-intro


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 9.2: Perform Complete System Backups and Backup any Customer Managed Keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2165).

**Guidance**: Create snapshot of the Azure virtual machine scale set instance or managed disk attached to the instance using PowerShell or REST APIs.  Backup customer managed keys within Azure Key Vault.

How to take a snapshot of a virtual machine scale set instance and managed disk: https://docs.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-faq#how-do-i-take-a-snapshot-of-a-virtual-machine-scale-set-instance 

How to backup key vault keys in Azure:  https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey?view=azurermps-6.13.0

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 9.3: Validate all Backups including Customer Managed Keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2166).

**Guidance**: Ensure ability to periodically perform data restoration of managed disk within Azure Backup. If necessary, test restore content to an isolated virtual network or subscription. Customer to test restoration of backed up customer managed keys.

Restore a disk and create a recovered VM in Azure: https://docs.microsoft.com/azure/backup/tutorial-restore-disk

How to restore key vault keys in Azure:  https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultkey?view=azurermps-6.13.0

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 9.4: Ensure Protection of Backups and Customer Managed Keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2167).

**Guidance**: Enable delete protection for managed disk using locks. Enable Soft-Delete and purge protection in Key Vault to protect keys against accidental or malicious deletion.   

Lock resources to prevent unexpected changes: https://docs.microsoft.com/azure/azure-resource-manager/management/lock-resources

Azure Key Vault soft-delete and purge protection overview:  https://docs.microsoft.com/azure/key-vault/key-vault-ovw-soft-delete

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Incident Response

*For more information, see [Security Control: Incident Response](https://docs.microsoft.com/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create incident response guide

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2169).

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.  
Guidance on building your own security incident response process: https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/

Microsoft Security Response Center's Anatomy of an Incident: https://msrc-blog.microsoft.com/2019/06/27/inside-the-msrc-anatomy-of-a-ssirp-incident/

Leverage NIST's Computer Security Incident Handling Guide to aid in the creation of your own incident response plan: https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.2: Create Incident Scoring and Prioritization Procedure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2170).

**Guidance**: 
Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert. 
Additionally, clearly mark subscriptions (for ex. production, non-prod) using tags and create a naming system to clearly identify and categorize Azure resources, especially those processing sensitive data.  It is your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

Security alerts in Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-alerts-overview

Use tags to organize your Azure resources: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.3: Test Security Response Procedures

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2171).

**Guidance**: 
Conduct exercises to test your systems’ incident response capabilities on a regular cadence to help protect your Azure resources. Identify weak points and gaps and revise plan as needed.
NIST's publication - Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities: https://csrc.nist.gov/publications/detail/sp/800-84/final



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.4: Provide Security Incident Contact Details and Configure Alert Notifications &nbsp;for Security Incidents

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2172).

**Guidance**: 
Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved.
How to set the Azure Security Center Security Contact: https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2173).

**Guidance**: 
Export your Azure Security Center alerts and recommendations using the Continuous Export feature to help identify risks to Azure resources. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts to Azure Sentinel.
How to configure continuous export: https://docs.microsoft.com/azure/security-center/continuous-export

How to stream alerts into Azure Sentinel: https://docs.microsoft.com/azure/sentinel/connect-azure-security-center


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2174).

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations to protect your Azure resources. 

How to configure Workflow Automation and Logic Apps: https://docs.microsoft.com/azure/security-center/workflow-automation


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Penetration Tests and Red Team Exercises

*For more information, see [Security Control: Penetration Tests and Red Team Exercises](https://docs.microsoft.com/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular Penetration Testing of your Azure resources and ensure to remediate all critical security findings within 60 days.

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/2175).

**Guidance**: 
Follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies. Use Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.
Penetration Testing Rules of Engagement:  https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1

Microsoft Cloud Red Teaming:  https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Next steps

- See the [Azure Security Benchmark](https://docs.microsoft.com/azure/security/benchmarks/overview)
- Learn more about [Azure Security Baselines](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview)
