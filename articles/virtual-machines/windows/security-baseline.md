---
title: Azure Security Baseline for Windows Virtual Machines
description: Azure Security Baseline for Windows Virtual Machines
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 04/13/2020
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Azure Security Baseline for Windows Virtual Machines

The Azure Security Baseline for Windows Virtual Machines contains recommendations that will help you improve the security posture of your deployment.

The baseline for this service is drawn from the [Azure Security Benchmark version 1.0](https://docs.microsoft.com/azure/security/benchmarks/overview), which provides recommendations on how you can secure your cloud solutions on Azure with our best practices guidance.

For more information, see [Azure Security Baselines overview](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network Security

*For more information, see [Security Control: Network Security](https://docs.microsoft.com/azure/security/benchmarks/security-control-network-security).*

### 1.1: Protect resources using Network Security Groups or Azure Firewall on your Virtual Network

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1816).

**Guidance**: When you create an Azure virtual machine (VM), you must create a virtual network (VNet) or use an existing VNet and configure VM with a subnet.   Ensure that all deployed subnets have a Network Security Group applied with network access controls specific to your applications trusted ports and sources. Use Azure Services with Private Link enabled, deploy the service inside your VNet or connect privately using Private Endpoints. For service specific requirements, please refer to the security recommendation for that specific service.  Alternatively, if customer has a specific use case, Azure Firewall may also be used to meet certain requirements.

Virtual networks and virtual machines in Azure: https://docs.microsoft.com/azure/virtual-machines/windows/network-overview

How to create a Virtual Network: https://docs.microsoft.com/azure/virtual-network/quick-create-portal

How to create an NSG with a Security Config: https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic

How to deploy and configure Azure Firewall: https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.2: Monitor and log the configuration and traffic of Vnets, Subnets, and NICS

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1817).

**Guidance**: Use the Azure Security Center to identify and follow network protection recommendations to help secure your Azure Virtual Machine (VM) resources in Azure. Enable NSG flow logs and send logs into a Storage Account for traffic audit for the VMs for unusual activity.

How to Enable NSG Flow Logs: https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal

Understand Network Security provided by Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-network-recommendations



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.3: Protect Critical Web Applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1818).

**Guidance**: Use Azure Network Security group to configure which network traffic and ports are able to connect to the resources on the Virtual Network.  NSGs contain two sets of rules: inbound and outbound. The priority for a rule must be unique within each set. Each rule has properties of protocol, source and destination port ranges, address prefixes, direction of traffic, priority, and access type.

Virtual networks and virtual machines in Azure: https://docs.microsoft.com/azure/virtual-machines/windows/network-overview

Information on Network Security Groups: https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.4: Deny Communications with Known Malicious IP Addresses

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1819).

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
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1820).

**Guidance**: You can record NSG flow logs into a storage account to generate flow records for your Azure Virtual Machines. When investigating anomalous activity, you could enable Network Watcher packet capture so that network traffic can be reviewed for unusual and unexpected activity.

How to Enable NSG Flow Logs: https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal

How to enable Network Watcher: https://docs.microsoft.com/azure/network-watcher/network-watcher-create


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.6: Deploy Network Based Intrusion Detection/Intrusion Prevention Systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1821).

**Guidance**: By combining packet captures provided by Network Watcher and open source IDS tools such as Suricata, you can perform network intrusion detection for a wide range of threats. Also, you can deploy Azure Firewall on the Virtual Network segments as appropiate, with Threat Intelligence enabled and configured to "Alert and deny" for malicious network traffic.

Perform network intrusion detection with Network Watcher and open source tools: https://docs.microsoft.com/azure/network-watcher/network-watcher-intrusion-detection-open-source-tools

How to deploy Azure Firewall: https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal

How to configure alerts with Azure Firewall: https://docs.microsoft.com/azure/firewall/threat-intel


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.7: Manage traffic to your web applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1822).

**Guidance**: You may deploy Azure Application Gateway for web applications with HTTPS/SSL enabled for trusted certificates. With Azure Application Gateway, you direct your application web traffic to specific resources by assigning listeners to ports, creating rules, and adding resources to a backend pool like Windows Virtual machines etc.

How to deploy Application Gateway: https://docs.microsoft.com/azure/application-gateway/quick-create-portal

How to configure Application Gateway to use HTTPS: https://docs.microsoft.com/azure/application-gateway/create-ssl-portal

Understand layer 7 load balancing with Azure web application gateways: https://docs.microsoft.com/azure/application-gateway/overview


**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

### 1.8: Minimize complexity and administrative overhead of network security rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1823).

**Guidance**: Use Virtual Network Service Tags to define network access controls on Network Security Groups or Azure Firewall configured for your Azure Virtual machines. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., ApiManagement) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

Understand and using Service Tags: https://docs.microsoft.com/azure/virtual-network/service-tags-overview



**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

### 1.9: Maintain Standard Security Configurations for Network Devices

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1824).

**Guidance**: Define and implement standard security configurations for Azure Virtual Machines (VM) using Azure Policy.  You may also use Azure Blueprints to simplify large scale Azure VM deployments by packaging key environment artifacts, such as AzureResources Manager templates, RBAC controls, and policies, in a single blueprint definition. You can apply the blueprint to new subscriptions, and fine-tune control and management through versioning.

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

Azure Policy samples for networking: https://docs.microsoft.com/azure/governance/policy/samples/#network

How to create an Azure Blueprint: https://docs.microsoft.com/azure/governance/blueprints/create-blueprint-portal


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 1.10: Document Traffic Configuration Rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1825).

**Guidance**: You may use tags for network security groups (NSG) and other resources related to network security and traffic flow configured for your Windows Virtual machines. For individual NSG rules, use the "Description" field to specify business need and/or duration (etc.) for any rules that allow traffic to/from a network.

How to create and use Tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

How to create a Virtual Network:  https://docs.microsoft.com/azure/virtual-network/quick-create-portal

How to create an NSG with a Security Config: https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 1.11: Use Automated Tools to Monitor Network Resource Configurations and Detect Changes

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1826).

**Guidance**: Use Azure Policy to validate (and/or remediate) configuration for for network resource related to Windows Virtual Machines.

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

Azure Policy samples for networking:  https://docs.microsoft.com/azure/governance/policy/samples/#network


**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

## Logging and Monitoring

*For more information, see [Security Control: Logging and Monitoring](https://docs.microsoft.com/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.1: Use Approved Time Synchronization Sources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1827).

**Guidance**: Microsoft maintains time sources for Azure resources, however, you have the option to manage the time synchronization settings for your Windows Virtual Machines.

How to configure time synchronization for Azure compute resources: https://docs.microsoft.com/azure/virtual-machines/windows/time-sync


**Azure Security Center monitoring**: Not Available

**Responsibility**: Microsoft

### 2.2: Configure Central Security Log Management

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1828).

**Guidance**: The Azure Security Center provides Security Event log monitoring for windows Virtual Machines. Given the volume of data that the security event log generates, it is not stored by default. 

If your organization would like to retain the security event log data from the virtual machine, it can be stored within a Data Collection tier, at which point it can be queried in Log Analytics. There are different tiers: Minimal, Common and All, which are detailed in the following link: https://docs.microsoft.com/azure/security-center/security-center-enable-data-collection#data-collection-tier


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure Resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1829).

**Guidance**: Enable Azure Monitor for access to your audit and activity logs which includes event source, date, user, timestamp, source addresses, destination addresses, and other useful elements. 


**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

### 2.4: Collect Security Logs from Operating System

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1830).

**Guidance**: The Azure Security Center provides Security Event log monitoring for Windows Virtual Machines. Given the volume of data that the security event log generates, it is not stored by default. 

If your organization would like to retain the  security event log data, it can be stored within a Data Collection tier, at which point it can be queried in Log Analytics. There are different tiers: Minimal, Common and All, which are detailed in the following link: https://docs.microsoft.com/azure/security-center/security-center-enable-data-collection#data-collection-tier


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.5: Configure Security Log Storage Retention

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1831).

**Guidance**: The Azure Security Center provides Security Event log monitoring for Windows Virtual Machines. Given the volume of data that the Security Event Log generates, it is not retained by default. 

If your organization would like to retain the Security Event Log data, it can be stored within a Data Collection tier, at which point it can be queried in Log Analytics. There are different tiers: Minimal, Common and All, which are detailed in the following link:https://docs.microsoft.com/azure/security-center/security-center-enable-data-collection#data-collection-tier

**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

### 2.6: Monitor and Review Logs

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1832).

**Guidance**: Analyze and monitor logs for anomalous behavior and regularly review results. Use Azure Monitor's Log Analytics workspace to review logs and perform queries on log data.

Alternatively, you may enable and on-board data to Azure Sentinel or a third party SIEM. 

How to onboard Azure Sentinel: https://docs.microsoft.com/azure/sentinel/quickstart-onboard

Understand Log Analytics Workspace: https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-portal

How to perform custom queries in Azure Monitor: https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-queries


**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

### 2.7: Enable Alerts for Anomalous Activity

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1833).

**Guidance**: Use Azure Security Center with Log Analytics workspace for monitoring and alerting on anomalous activity found in security logs and events for your Windows Virtual Machines.  

Alternatively, you may enable and on-board data to Azure Sentinel or a third party SIEM. 

How to onboard Azure Sentinel: https://docs.microsoft.com/azure/sentinel/quickstart-onboard

How to manage alerts in Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-managing-and-responding-alerts

How to alert on log analytics log data: https://docs.microsoft.com/azure/azure-monitor/learn/tutorial-response


**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

### 2.8: Centralize Anti-malware Logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1834).

**Guidance**: You may use Microsoft Antimalware for Azure Cloud Services and Virtual Machines and configure your virtual machines to log events to an Azure Storage Account. Configure a Log Analytics workspace to ingest the events from the Storage Accounts and create alerts where appropriate. Follow recommendations in Azure Security Center: "Compute &amp; Apps". 

How to configure Microsoft Antimalware for Cloud Services and Virtual Machines: https://docs.microsoft.com/azure/security/fundamentals/antimalware

How to Enable guest-level monitoring for Virtual Machines: https://docs.microsoft.com/azure/cost-management/azure-vm-extended-metrics


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.9: Enable DNS Query Logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1835).

**Guidance**: Azure DNS Analytics (Preview) solution in Azure Monitor gathers insights into DNS infrastructure on security, performance, and operations. Also,you can use third party dns logging solution if DNS Analytics is not available in your region.
Gather insights about your DNS infrastructure with the DNS Analytics Preview solution: https://docs.microsoft.com/azure/azure-monitor/insights/dns-analytics


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 2.10: Enable Command-line Audit Logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1836).

**Guidance**: The Azure Security Center provides Security Event log monitoring for Azure Virtual Machines(VM).  Security Center provisions the Microsoft Monitoring Agent on all supported Azure VMs and any new ones that are created if automatic provisioning is enabled OR you can install the agent manually.  The agent enables the process creation event 4688 and the CommandLine field inside event 4688. New processes created on the VM are recorded by EventLog and monitored by Security Center’s detection services.

Data collection in Azure Security Center:

https://docs.microsoft.com/azure/security-center/security-center-enable-data-collection#data-collection-tier

**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

## Identity and Access Control

*For more information, see [Security Control: Identity and Access Control](https://docs.microsoft.com/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain Inventory of Administrative Accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1837).

**Guidance**: While Azure Active Directory is the recommended method to administrate user access, Azure Virtual Machines may have local accounts. Both local and domain accounts should be reviewed and managed, normally with a minimum footprint. In addition, we would advise that the Privileged Identity Manager is reviewed for the Just In Time feature to reduce the availability of administrative permissions.

Information for Local Accounts is available at: https://docs.microsoft.com/azure/active-directory/devices/assign-local-admin#manage-the-device-administrator-role

Information on Privileged Identity Manager: https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-deployment-plan


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.2: Change Default Passwords where Applicable

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1838).

**Guidance**: Azure Windows Virtual Machine does not have the concept of default passwords.  Customer responsible for third party applications and marketplace services that may use default passwords.



**Azure Security Center monitoring**: Not available

**Responsibility**: Customer

### 3.3: Ensure the Use of Dedicated Administrative Accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1839).

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts that have access to your virtual machine. Use Azure Security Center Identity and access management to monitor the number of administrative accounts.  The administrator accounts on Azure Virtual Machines can also be configured with the Azure Privileged Identity Manager (PIM). Azure Privileged Identity Manager provides several options such as Just in Time elevation, Multi-Factor Authentication, and delegation options so that permissions are only available for specific time frames and require a second person to approve.

Understand Azure Security Center Identity and Access: https://docs.microsoft.com/azure/security-center/security-center-identity-access

Information on Privileged Identity Manager: https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-deployment-plan


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.4: <div>Use Single Sign-On (SSO) with Azure Active Directory</div>

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1840).

**Guidance**: Wherever possible, customer to use SSO with Azure Active Directory rather than configuring individual stand-alone credentials per-service. Use Azure Security Center Identity and Access Management recommendations.
Single sign-on to applications in Azure Active Directory
: https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on

How to monitor identity and access within Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-identity-access


**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

### 3.5: Use Multifactor Authentication For all Azure Active Directory based access.

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1841).

**Guidance**: The administrator accounts on Azure Virtual Machines can be configured with the Azure Privileged Identity Manager (PIM). Azure Privileged Identity Manager provides several options such as Just in Time elevation, Multi-Factor Authentication, and delegation options so that permissions are only available for specific time frames and require a second person to approve.

Information on Privileged Identity Manager: https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-deployment-plan


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.6: Use of Dedicated Machines (Privileged Access Workstations) for all Administrative Tasks

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1842).

**Guidance**: Use PAWs (privileged access workstations) with MFA configured to log into and configure Azure resources.

Learn about Privileged Access Workstations: https://docs.microsoft.com/windows-server/identity/securing-privileged-access/privileged-access-workstations

How to enable MFA in Azure: https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted


**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

### 3.7: Log and Alert on Suspicious Activity on Administrative Accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1844).

**Guidance**: Utilize Azure AD Privileged Identity Management (PIM) for generation of logs and alerts when suspicious or unsafe activity occurs in the environment. Utilize Azure AD Risk Detections to view alerts and reports on risky user behavior. Optionally, customer may ingest Azure Security Center Risk Detection alerts into Azure Monitor and configure custom alerting/notifications using Action Groups.
How to deploy Privileged Identity Management (PIM): https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-deployment-plan

Understanding Azure Security Center risk detections (suspicious activity): https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risk-events

How to integrate Azure Activity Logs into Azure Monitor: https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics

How to configure action groups for custom alerting and notification: https://docs.microsoft.com/azure/azure-monitor/platform/action-groups


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.8: Manage Azure Resource from only Approved Locations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1845).

**Guidance**: Customer to use Conditional Access Named Locations to allow access from only specific logical groupings of IP address ranges or countries/regions.

How to configure Named Locations in Azure:  https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations


**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

### 3.9: Utilize Azure Active Directory

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1846).

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.  You can use managed identities to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code. Your code that's running on a virtual machine, can use managed identity to request access tokens for services that support Azure AD authentication. 

How to create and configure an Azure AD instance: https://docs.microsoft.com/azure/active-directory-domain-services/tutorial-create-instance

What are managed identities for Azure resources?: https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview


**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

### 3.10: Regularly Review and Reconcile User Access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1847).

**Guidance**: Azure AD provides logs to help discover stale accounts. In addition, customer to use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User's access can be reviewed on a regular basis to make sure only the right users have continued access. When using Windows Virtual Machines, you will need to review the local security groups and users to make sure that there are no unexpected accounts which could compromise the system. 

How to use Azure Identity Access Reviews:  https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.11: Monitor Attempts to Access Deactivated Accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1848).

**Guidance**: Configure diagnostic settings for Azure Active Directory to send the audit logs and sign-in logs to a Log Analytics workspace. Also, use Azure Monitor's Log Analytics workspace to review logs and perform queries on log data from Azure Virtual machines. 

Understand Log Analytics Workspace: https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-portal

How to integrate Azure Activity Logs into Azure Monitor: https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics

How to perform custom queries in Azure Monitor: https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-queries

How to monitor virtual machines in Azure: https://docs.microsoft.com/azure/virtual-machines/windows/monitor


**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

### 3.12: Alert on Account Login Behavior Deviation

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1849).

**Guidance**: Use Azure Active Directory's Risk and Identity Protection features to configure automated responses to detected suspicious actions related to your Storage account resources. You should enable automated responses through Azure Sentinel to implement your organization's security responses. 

How to view Azure AD risky sign-ins: https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risky-sign-ins 

How to configure and enable Identity Protection risk policies: https://docs.microsoft.com/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies 

How to onboard Azure Sentinel: https://docs.microsoft.com/azure/sentinel/quickstart-onboard


**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1850).

**Guidance**: In cases where a third party needs to access customer data (such as during a support request), use Customer Lockbox (Preview) for Azure virtual machines to review and approve or reject customer data access requests.

Understanding Customer Lockbox: https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

## Data Protection

*For more information, see [Security Control: Data Protection](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an Inventory of Sensitive Information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1851).

**Guidance**: Use Tags to assist in tracking Azure virtual machines that store or process sensitive information.

How to create and use Tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1852).

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. Resources should be separated by virtual network/subnet, tagged appropriately, and secured within an network security group (NSG) or Azure Firewall. For Virtual Machines storing or processing sensitive data, implement policy and procedure(s) to turn them off when not in use.

How to create additional Azure subscriptions: https://docs.microsoft.com/azure/billing/billing-create-subscription

How to create Management Groups: https://docs.microsoft.com/azure/governance/management-groups/create

How to create and use Tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

How to create a Virtual Network: https://docs.microsoft.com/azure/virtual-network/quick-create-portal

How to create an NSG with a Security Config: https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic

How to deploy Azure Firewall: https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal

How to configure alert or alert and deny with Azure Firewall: https://docs.microsoft.com/azure/firewall/threat-intel


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 4.3: Monitor and Block unauthorized transfer of sensitive information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1853).

**Guidance**: &lt;--------------------NEED TO VALIDATE---------------------&gt;

Microsoft Defender ATP is seamlessly integrated in Microsoft Threat Protection to provide a complete and comprehensive data loss prevention (DLP) solution for Windows devices.    Azure Advanced Threat Protection enables you to integrate Azure ATP with Windows Defender ATP and with Azure Security center.

Integrate Azure ATP with Windows Defender ATP: https://docs.microsoft.com/azure-advanced-threat-protection/integrate-wd-atp


**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

### 4.4: Encrypt All Sensitive Information in Transit

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1854).

**Guidance**: Data in transit to, from, and between Virtual Machines(VM) that are running Windows is encrypted in a number of ways, depending on the nature of the connection e.g RDP sessions, SSH etc.

In-transit encryption in VMs: https://docs.microsoft.com/azure/security/fundamentals/encryption-overview#in-transit-encryption-in-vms


**Azure Security Center monitoring**: Not Available

**Responsibility**: Shared

### 4.5: Utilize an Active Discovery Tool to Identify Sensitive Data

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1855).

**Guidance**: &lt;--------------------NEED TO VALIDATE---------------------&gt;

Microsoft Defender ATP is seamlessly integrated in Microsoft Threat Protection to provide a complete and comprehensive data loss prevention (DLP) solution for Windows devices.    Azure Advanced Threat Protection enables you to integrate Azure ATP with Windows Defender ATP and with Azure Security center.

Integrate Azure ATP with Windows Defender ATP: https://docs.microsoft.com/azure-advanced-threat-protection/integrate-wd-atp


**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

### 4.6: Utilize Azure RBAC to control access to resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1856).

**Guidance**: Using role-based access control (RBAC), you can segregate duties within your team and grant only the amount of access to users on your VM that they need to perform their jobs. Instead of giving everybody unrestricted permissions on the VM, you can allow only certain actions. You can configure access control for the VM in the Azure portal, using the Azure CLI, orAzure PowerShell.

What is role-based access control (RBAC) for Azure resources?: https://docs.microsoft.com/azure/role-based-access-control/overview

Built-in roles for Azure resources (e.g. Virtual Machine Contributor): https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#virtual-machine-contributor


**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

### 4.7: Use host-based Data Loss Prevention to enforce access control

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1857).

**Guidance**: &lt;--------------------NEED TO VALIDATE---------------------&gt;

You can use Windows Defender ATP to provide data loss prevention functionality for Azure Windows virtual machines.  Azure Advanced Threat Protection also enables you to integrate Azure ATP with Windows Defender ATP, for an even more complete threat protection solution. While Azure ATP monitors the traffic on your domain controllers, Windows Defender ATP monitors your endpoints, together providing a single interface from which you can protect your environment.

Microsoft Defender Advanced Threat Protection with Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-wdatp

Integrate Azure ATP with Windows Defender ATP: https://docs.microsoft.com/azure-advanced-threat-protection/integrate-wd-atp


**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

### 4.8: Encrypt Sensitive Information at Rest

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1858).

**Guidance**: Virtual disks on Windows Virtual Machines (VM) are encrypted at rest using either Server-side encryption or Azure disk encryption (ADE). Azure Disk Encryption leverages the BitLocker feature of Windows to encrypt managed disks with customer-managed keys within the guest VM. Server-side encryption with customer-managed keys improves on ADE by enabling you to use any OS types and images for your VMs by encrypting data in the Storage service.

Server side encryption of Azure managed disks: https://docs.microsoft.com/azure/virtual-machines/windows/disk-encryption

Azure Disk Encryption for Windows VMs: https://docs.microsoft.com/azure/virtual-machines/windows/disk-encryption-overview


**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### 4.9: Log and alert on changes to critical Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1859).

**Guidance**: Use Azure Monitor with the Azure Activity Log to create alerts for when changes take place to Virtual machines and related resources.  

How to create alerts for Azure Activity Log events: https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log

How to create alerts for Azure Activity Log events: https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log

Azure Storage analytics logging: https://docs.microsoft.com/azure/storage/common/storage-analytics-logging


**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

## Vulnerability Management

*For more information, see [Security Control: Vulnerability Management](https://docs.microsoft.com/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.1: Run Automated Vulnerability Scanning Tools

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1860).

**Guidance**: Follow recommendations from Azure Security Center on performing vulnerability assessments on your Azure Virtual Machines.  Use Azure Security recommended or third-party solution for performing vulnerability assessments for your virtual machines. 

How to implement Azure Security Center vulnerability assessment recommendations:  https://docs.microsoft.com/azure/security-center/security-center-vulnerability-assessment-recommendations


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 5.2: Deploy Automated Operating System Patch Management Solution

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1861).

**Guidance**: Use the Azure Update Management solution to manage updates and patches for your virtual machines.  Update Management relies on the locally configured update repository to patch supported Windows systems. Tools like System Center Updates Publisher (Updates Publisher) allow you to publish custom updates into Windows Server Update Services (WSUS). This scenario allows Update Management to patch machines that use Configuration Manager as their update repository with third-party software. 

Update Management solution in Azure:  https://docs.microsoft.com/azure/automation/automation-update-management

Manage updates and patches for your Azure VMs: https://docs.microsoft.com/azure/automation/automation-tutorial-update-management


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 5.3: Deploy Automated Third Party Software Patch Management Solution

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1862).

**Guidance**: You may use third-party patch management solution.  You can use the Azure Update Management solution to manage updates and patches for your virtual machines.  Update Management relies on the locally configured update repository to patch supported Windows systems. Tools like System Center Updates Publisher (Updates Publisher) allow you to publish custom updates into Windows Server Update Services (WSUS). This scenario allows Update Management to patch machines that use Configuration Manager as their update repository with third-party software. 

Update Management solution in Azure: https://docs.microsoft.com/azure/automation/automation-update-management

Manage updates and patches for your Azure VMs: https://docs.microsoft.com/azure/automation/automation-tutorial-update-management


**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

### 5.4: Compare Back-to-back Vulnerability Scans

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1863).

**Guidance**: Export scan results at consistent intervals and compare the results to verify that vulnerabilities have been remediated. When using vulnerability management recommendation suggested by Azure Security Center, customer may pivot into the selected solution's portal to view historical scan data.

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 5.5: Utilize a risk-rating process to prioritize the remediation of discovered vulnerabilities.

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1864).

**Guidance**: Use the default risk ratings (Secure Score) provided by Azure Security Center.

Understand Azure Security Center Secure Score: https://docs.microsoft.com/azure/security-center/security-center-secure-score


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Inventory and Asset Management

*For more information, see [Security Control: Inventory and Asset Management](https://docs.microsoft.com/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Utilize Azure Asset Discovery

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1865).

**Guidance**: Use Azure Resource Graph to query and discover all resources (including Virtual machines) within your subscription(s). Ensure you have appropriate (read) permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions.

How to create queries with Azure Graph: https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal

How to view your Azure Subscriptions: https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0

Understand Azure RBAC: https://docs.microsoft.com/azure/role-based-access-control/overview


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 6.2: Maintain Asset Metadata

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1866).

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

How to create and use Tags:  https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags


**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

### 6.3: Delete Unauthorized Azure Resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1867).

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track virtual machines and related resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

How to create additional Azure subscriptions:  https://docs.microsoft.com/azure/billing/billing-create-subscription

How to create Management Groups:  https://docs.microsoft.com/azure/governance/management-groups/create

How to create and use Tags:  https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 6.4: Maintain inventory of approved Azure resources and software titles.

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1868).

**Guidance**: &lt;--------NEED TO VALIDATE-----&gt;

You should create an inventory of approved Azure resources and approved software for your compute resources.


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 6.5: Monitor for Unapproved Azure Resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1869).

**Guidance**: Use Azure policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:
- Not allowed resource types
- Allowed resource types

In addition, use the Azure Resource Graph to query/discover resources within the subscription(s). This can help in high security based environments, such as those with Storage accounts.

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

How to create queries with Azure Graph: https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 6.6: Monitor for Unapproved Software Applications within Compute Resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1870).

**Guidance**: Azure Automation provides complete control during deployment, operations, and decommissioning of workloads and resources.  Leverage Azure Virtual Machine Inventory to automate the collection of information about all software on Virtual Machines. Note: Software Name, Version, Publisher, and Refresh time are available from the Azure Portal. To get access to install date and other information, customer required to enable guest-level diagnostic and bring the Windows Event logs into a Log Analytics Workspace.

An introduction to Azure Automation:  https://docs.microsoft.com/azure/automation/automation-intro

How to enable Azure VM Inventory:  https://docs.microsoft.com/azure/automation/automation-tutorial-installed-software


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 6.7: Remove Unapproved Azure Resources and Software Applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1871).

**Guidance**: Azure Automation
provides complete control during deployment, operations, and decommissioning of
workloads and resources.  You may use
Change Tracking to identify all software installed on Virtual Machines. You can
implement your own process or use Azure Automation State Configuration for
removing unauthorized software. An introduction to
Azure Automation:  https://docs.microsoft.com/azure/automation/automation-intro Track changes in
your environment with the Change Tracking solution:  https://docs.microsoft.com/azure/automation/change-tracking Azure Automation
State Configuration Overview:  https://docs.microsoft.com/azure/automation/automation-dsc-overview


**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

### 6.8: Utilize only approved applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1872).

**Guidance**: Use Azure Security Center Adaptive Application Controls to ensure that only authorized software executes and all unauthorized software is blocked from executing on Azure Virtual Machines.

How to use Azure Security Center Adaptive Application Controls:  https://docs.microsoft.com/azure/security-center/security-center-adaptive-application


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 6.9: Utilize only approved Azure Services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1873).

**Guidance**: Use Azure policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

How to deny a specific resource type with Azure Policy: https://docs.microsoft.com/azure/governance/policy/samples/not-allowed-resource-types


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 6.10: Implement approved application list

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/4081).

**Guidance**: Adaptive application control is an intelligent, automated, end-to-end solution from Azure Security Center which helps you control which applications can run on your Azure and non-Azure machines (Windows and Linux).  Implement third party solution if this does not meet your organization's requirement.

How to use Azure Security Center Adaptive Application Controls:  https://docs.microsoft.com/azure/security-center/security-center-adaptive-application


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 6.11: Limit Users' Ability to interact with ARM via Scripts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1874).

**Guidance**: Use Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

How to configure Conditional Access to block access to Azure Resource Manager: https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 6.12: Limit Users' Ability to Execute Scripts within Compute Resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1875).

**Guidance**: Depending on the type of scripts, you may use operating system specific configurations or third-party resources to limit users' ability to execute scripts within Azure compute resources.  You can also leverage Azure Security Center Adaptive Application Controls to ensure that only authorized software executes and all unauthorized software is blocked from executing on Azure Virtual Machines.

How to control PowerShell script execution in Windows Environments: https://docs.microsoft.com/powershell/module/microsoft.powershell.security/set-executionpolicy?view=powershell-6

How to use Azure Security Center Adaptive Application Controls: https://docs.microsoft.com/azure/security-center/security-center-adaptive-application


**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

### 6.13: Physically or Logically Segregate High Risk Applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1876).

**Guidance**: High risk applications deployed in your Azure environment may be isolated using virtual network, subnet, subscriptions, management groups etc. and sufficiently secured with either an Azure Firewall, Web Application Firewall (WAF) or network security group (NSG). 

Virtual networks and virtual machines in Azure:  https://docs.microsoft.com/azure/virtual-machines/windows/network-overview

What is Azure Firewall?:  https://docs.microsoft.com/azure/firewall/overview

What is Azure Web Application Firewall?: https://docs.microsoft.com/azure/web-application-firewall/overview

Network security groups: https://docs.microsoft.com/azure/virtual-network/security-overview

What is Azure Virtual Network?: https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview

Organize your resources with Azure management groups: https://docs.microsoft.com/azure/governance/management-groups/overview

Subscription decision guide: https://docs.microsoft.com/azure/cloud-adoption-framework/decision-guides/subscriptions/


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

## Secure Configuration

*For more information, see [Security Control: Secure Configuration](https://docs.microsoft.com/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish Secure Configurations for all Azure Resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1877).

**Guidance**: Use Azure Policy or Azure Security Center to maintain security configurations for all Azure Resources. Also, Azure Resource Manager has the ability to export the template in Java Script Object Notation (JSON), which should be reviewed to ensure that the configurations meet / exceed the security requirements for your company.

How to configure and manage Azure Policy:  https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

Information on how to download the VM template:  https://docs.microsoft.com/azure/virtual-machines/windows/download-template


**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

### 7.2: Establish Secure Configurations for your Operating System

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1878).

**Guidance**: Use Azure Security Center recommendation [Remediate Vulnerabilities in Security Configurations on your Virtual Machines] to maintain security configurations on all compute resources.

How to monitor Azure Security Center recommendations:  https://docs.microsoft.com/azure/security-center/security-center-recommendations

How to remediate Azure Security Center recommendations:  https://docs.microsoft.com/azure/security-center/security-center-remediate-recommendations


**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

### 7.3: Maintain Secure Configurations for all Azure Resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1879).

**Guidance**: Use Azure Resource Manager templates and Azure Policies to securely configure Azure resources associated with the Virtual machines.  Azure Resource Manager templates are JSON based files used to deploy Virtual machine along with Azure resources and custom template will need to be maintained.  Microsoft performs the maintenance on the base templates.  Use Azure policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.

Information on creating Azure Resource Manager templates:  https://docs.microsoft.com/azure/virtual-machines/windows/ps-template

How to configure and manage Azure Policy:  https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

Understanding Azure Policy Effects:  https://docs.microsoft.com/azure/governance/policy/concepts/effects


**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

### 7.4: Maintain Secure Configurations for Operating Systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1880).

**Guidance**: There are several options for maintaining a secure configuration for Azure Virtual Machines(VM) for deployment:
1- Azure Resource Manager templates: These are JSON based files used to deploy a VM from the Azure Portal, and custom template will need to be maintained. Microsoft performs the maintenance on the base templates.

2- Custom Virtual hard disk (VHD): In some circumstances it may be required to have custom VHD files used such as when dealing with complex environments that cannot be managed through other means. 

3- Azure Automation State Configuration: Once the base OS is deployed, this can be used for more granular control of the settings, and enforced through the automation framework.

For most scenarios, the Microsoft base VM templates combined with the Azure Automation Desired State Configuration can assist in meeting and maintaining the security requirements. 

Information on how to download the VM template: https://docs.microsoft.com/azure/virtual-machines/windows/download-template

Information on creating ARM templates: https://docs.microsoft.com/azure/virtual-machines/windows/ps-template

How to upload a custom VM VHD to Azure: https://docs.microsoft.com/azure-stack/operator/azure-stack-add-vm-image?view=azs-1910


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.5: Securely Store Configuration of Azure Resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1881).

**Guidance**: Use Azure DevOps/Repos to securely store and manage your code like custom Azure policies, Azure Resource Manager templates, Desired State Configuration scripts etc.   To access the resources you manage in Azure DevOps—such as your code, builds, and work tracking—you must have permissions for those specific resources. Most permissions are granted through built-in security groups as described in Permissions and access. You can grant or deny permissions to specific users, built-in security groups, or groups defined in Azure Active Directory (Azure AD) if integrated with Azure DevOps, or Active Directory if integrated with TFS.

How to store code in Azure DevOps:  https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops

About permissions and groups in Azure DevOps:  https://docs.microsoft.com/azure/devops/organizations/security/about-permissions


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 7.6: Securely Store Custom Operating System Images

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1882).

**Guidance**: If using custom images(e.g. Windows Virtual Hard Disk(VHD)), use RBAC to ensure only authorized users may access the images.  

Understand RBAC in Azure:  https://docs.microsoft.com/azure/role-based-access-control/rbac-and-directory-admin-roles

How to configure RBAC in Azure:  https://docs.microsoft.com/azure/role-based-access-control/quickstart-assign-role-user-portal 



**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

### 7.7: Deploy System Configuration Management Tools

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1883).

**Guidance**: Leverage Azure Policy to alert, audit, and enforce system configurations for your Virtual machine. Additionally, develop a process and pipeline for managing policy exceptions.

How to configure and manage Azure Policy:  https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 7.8: Deploy System Configuration Management Tools for Operating Systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1884).

**Guidance**: Azure Automation State Configuration is a configuration management service for Desired State Configuration (DSC) nodes in any cloud or on-premises datacenter. It enables scalability across thousands of machines quickly and easily from a central, secure location. You can easily onboard machines, assign them declarative configurations, and view reports showing each machine's compliance to the desired state you specified. 

Onboarding machines for management by Azure Automation State Configuration:  https://docs.microsoft.com/azure/automation/automation-dsc-onboarding


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 7.9: Implement Automated Configuration Monitoring for Azure Services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1885).

**Guidance**: Leverage Azure Security Center to perform baseline scans for your Azure Virtual machines.  Additional methods for automated configuration includes the Azure Automation State Configuration.

How to remediate recommendations in Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-remediate-recommendations

Getting started with Azure Automation State Configuration:  https://docs.microsoft.com/azure/automation/automation-dsc-getting-started


**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

### 7.10: Implement Automated Configuration Monitoring for Operating Systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1886).

**Guidance**: Azure Automation State Configuration is a configuration management service for Desired State Configuration (DSC) nodes in any cloud or on-premises datacenter. It enables scalability across thousands of machines quickly and easily from a central, secure location. You can easily onboard machines, assign them declarative configurations, and view reports showing each machine's compliance to the desired state you specified. 

Onboarding machines for management by Azure Automation State Configuration:  https://docs.microsoft.com/azure/automation/automation-dsc-onboarding


**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

### 7.11: Securely manage Azure secrets

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1887).

**Guidance**: Use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure secret management for your cloud applications.
How to integrate with Azure Managed Identities:  https://docs.microsoft.com/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity

How to create a Key Vault:  https://docs.microsoft.com/azure/key-vault/quick-create-portal

How to provide Key Vault authentication with a managed identity:  https://docs.microsoft.com/azure/key-vault/managed-identity


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.12: Securely and automatically manage identities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1888).

**Guidance**: Use Managed Identities to provide Azure services with an automatically managed identity in Azure AD. Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code.
How to configure Managed Identities:  https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm


**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

### 7.13: Eliminate unintended credential exposure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1889).

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.
How to setup Credential Scanner:  https://secdevtools.azurewebsites.net/helpcredscan.html


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

## Malware Defense

*For more information, see [Security Control: Malware Defense](https://docs.microsoft.com/azure/security/benchmarks/security-control-malware-defense).*

### 8.1: Utilize Centrally Managed Anti-malware Software

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1890).

**Guidance**: Use Microsoft Antimalware for Azure  Windows Virtual machines to continuously monitor and defend your resources. 

How to configure Microsoft Antimalware for Cloud Services and Virtual Machines:  https://docs.microsoft.com/azure/security/fundamentals/antimalware


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1891).

**Guidance**: Not applicable to Azure Virtual machines as its a compute resource.


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 8.3: Ensure Anti-Malware Software and Signatures are Updated

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1892).

**Guidance**: When deployed, Microsoft Antimalware for Azure will automatically install the latest signature, platform, and engine updates by default. Follow recommendations in Azure Security Center: "Compute &amp; Apps" to ensure all endpoints are up to date with the latest signatures. The Windows OS can be further protected with additional security to limit the risk of virus or malware based attacks with the Microsoft Defender Advanced Threat Protection service that integrates with Azure Security Center. 

How to deploy Microsoft Antimalware for Azure Cloud Services and Virtual Machines:  https://docs.microsoft.com/azure/security/fundamentals/antimalware

Microsoft Defender Advanced Threat Protection:  https://docs.microsoft.com/windows/security/threat-protection/microsoft-defender-atp/onboard-configure


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Data Recovery

*For more information, see [Security Control: Data Recovery](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure Regular Automated Back Ups

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1894).

**Guidance**: Enable Azure Backup and configure the Azure Virtual machines (VM), as well as the desired frequency and retention period for automatic backups.

An overview of Azure VM backup:  https://docs.microsoft.com/azure/backup/backup-azure-vms-introduction

Back up an Azure VM from the VM settings:  https://docs.microsoft.com/azure/backup/backup-azure-vms-first-look-arm



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 9.2: Perform Complete System Backups and Backup any Customer Managed Keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1895).

**Guidance**: Enable Azure Backup and target Azure Virtual machines VM(s), as well as the desired frequency and retention periods. Backup customer managed keys within Azure Key Vault.

An overview of Azure VM backup:  https://docs.microsoft.com/azure/backup/backup-azure-vms-introduction

How to backup key vault keys in Azure:  https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey?view=azurermps-6.13.0


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 9.3: Validate all Backups including Customer Managed Keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1896).

**Guidance**: Ensure ability to periodically perform data restoration of content within Azure Backup. If necessary, test restore content to an isolated virtual network or subscription. Customer to test restoration of backed up customer managed keys.

How to recover files from Azure Virtual Machine backup:  https://docs.microsoft.com/azure/backup/backup-azure-restore-files-from-vm

How to restore key vault keys in Azure:  https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultkey?view=azurermps-6.13.0


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 9.4: Ensure Protection of Backups and Customer Managed Keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1897).

**Guidance**: When you back up Azure managed disks with Azure Backup, VMs are encrypted at rest with Storage Service Encryption (SSE). Azure Backup can also back up Azure VMs that are encrypted by using Azure Disk Encryption.  Azure Disk Encryption integrates with BitLocker encryption keys (BEKs), which are safeguarded in a key vault as secrets. Azure Disk Encryption also integrates with Azure Key Vault key encryption keys (KEKs). Enable Soft-Delete in Key Vault to protect keys against accidental or malicious deletion.   

Soft delete for VMs :   https://docs.microsoft.com/azure/backup/backup-azure-security-feature-cloud#soft-delete

Azure Key Vault soft-delete overview:  https://docs.microsoft.com/azure/key-vault/key-vault-ovw-soft-delete


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Incident Response

*For more information, see [Security Control: Incident Response](https://docs.microsoft.com/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create incident response guide

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1899).

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.
	

	Guidance on building your own security incident response process: https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/

	

	Microsoft Security Response Center's Anatomy of an Incident: https://msrc-blog.microsoft.com/2019/06/27/inside-the-msrc-anatomy-of-a-ssirp-incident/

	

Customer may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan: https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final

**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 10.2: Create Incident Scoring and Prioritization Procedure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1900).

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert. 
	

	Additionally, clearly mark subscriptions (for ex. production, non-prod) using tags and create a naming system to clearly identify and categorize Azure resources, especially those processing sensitive data.  It is your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

	

	Security alerts in Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-alerts-overview

	

Use tags to organize your Azure resources: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.3: Test Security Response Procedures

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1901).

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence to help protect your Azure resources. Identify weak points and gaps and revise plan as needed.
	

	Refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities: https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf



**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 10.4: Provide Security Incident Contact Details and Configure Alert Notifications &nbsp;for Security Incidents

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1902).

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved.
How to set the Azure Security Center Security Contact: https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1903).

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature to help identify risks to Azure resources. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts to Azure Sentinel.
	

	How to configure continuous export: https://docs.microsoft.com/azure/security-center/continuous-export

	

	How to stream alerts into Azure Sentinel: https://docs.microsoft.com/azure/sentinel/connect-azure-security-center



**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1904).

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations to protect your Azure resources.
	

	How to configure Workflow Automation and Logic Apps: https://docs.microsoft.com/azure/security-center/workflow-automation



**Azure Security Center monitoring**: Not Available

**Responsibility**: Customer

## Penetration Tests and Red Team Exercises

*For more information, see [Security Control: Penetration Tests and Red Team Exercises](https://docs.microsoft.com/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular Penetration Testing of your Azure resources and ensure to remediate all critical security findings within 60 days.

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1905).

**Guidance**: Follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies: https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1 
You can find more information on Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications, here: https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Shared

## Next steps

- See the [Azure Security Benchmark](https://docs.microsoft.com/azure/security/benchmarks/overview)
- Learn more about [Azure Security Baselines](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview)
