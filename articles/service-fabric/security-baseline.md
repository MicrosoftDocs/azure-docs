---
title: Azure security baseline for Service Fabric
description: Azure security baseline for Service Fabric
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 06/16/2020
ms.author: mbaldwin
ms.custom: security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Service Fabric

The Azure Security Baseline for Service Fabric contains recommendations that will help you improve the security posture of your deployment.

The baseline for this service is drawn from the [Azure Security Benchmark version 1.0](https://docs.microsoft.com/azure/security/benchmarks/overview), which provides recommendations on how you can secure your cloud solutions on Azure with our best practices guidance.

For more information, see the [Azure security baselines overview](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network security

*For more information, see [Security control: Network security](https://docs.microsoft.com/azure/security/benchmarks/security-control-network-security).*

### 1.1: Protect resources using Network Security Groups or Azure Firewall on your Virtual Network

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24082).

**Guidance**: Ensure that all Virtual Network subnet deployments have a Network Security Group applied with network access controls specific to your application's trusted ports and sources. 

Deploy Azure Firewall using a template:

https://docs.microsoft.com/azure/firewall/deploy-template

Create perimeter networks by using Azure Network Security Groups (NSGs):
https://docs.microsoft.com/azure/security/fundamentals/service-fabric-best-practices#use-network-isolation-and-security-with-azure-service-fabric

How to integrate your Azure Service Fabric cluster with an existing virtual network: 
https://docs.microsoft.com/azure/service-fabric/service-fabric-patterns-networking

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.2: Monitor and log the configuration and traffic of Vnets, Subnets, and NICs

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24083).

**Guidance**: Use Azure Security Center and remediate network protection recommendations for the virtual network, subnet, and network security group being used to secure your Azure Service Fabric cluster. Enable network security group (NSG) flow logs and send logs into a Azure Storage Account to traffic audit. You may also send NSG flow logs to a Azure Log Analytics Workspace and use Azure Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Azure Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network mis-configurations.

How to Enable NSG Flow Logs:
https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal

How to Enable and use Azure Traffic Analytics:
https://docs.microsoft.com/azure/network-watcher/traffic-analytics

Understand Network Security provided by Azure Security Center:
https://docs.microsoft.com/azure/security-center/security-center-network-recommendations

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.3: Protect critical web applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24084).

**Guidance**: Provide a front-end gateway to provide a single point of ingress for users, devices, or other applications. Azure API Management integrates directly with Service Fabric, allowing you to secure access to back-end services, prevent DOS attacks by using throttling, and verify API keys, JWT tokens, certificates, and other credentials.

Consider deploying Azure Web Application Firewall (WAF) in front of critical web applications for additional inspection of incoming traffic. Enable Diagnostic Setting for WAF and ingest logs into a Storage Account, Event Hub, or Log Analytics Workspace.

Service Fabric with Azure API Management overview:
https://docs.microsoft.com/azure/service-fabric/service-fabric-api-management-overview

Integrate API Management in an internal VNET with Application Gateway:
https://docs.microsoft.com/azure/api-management/api-management-howto-integrate-internal-vnet-appgateway
How to deploy Azure WAF:
https://docs.microsoft.com/azure/web-application-firewall/ag/create-waf-policy-ag


**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 1.4: Deny communications with known malicious IP addresses

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24085).

**Guidance**: For protections from DDoS attacks, enable Azure DDoS Standard protection on the virtual network where your Azure Service Fabric cluster is deployed. Use Azure Security Center integrated threat intelligence to deny communications with known malicious or unused Internet IP addresses.

How to configure DDoS protection:
https://docs.microsoft.com/azure/virtual-network/manage-ddos-protection

Understand Azure Security Center Integrated Threat Intelligence:
https://docs.microsoft.com/azure/security-center/security-center-alerts-service-layer

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.5: Record network packets and flow logs

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24086).

**Guidance**: Enable network security group (NSG) flog logs for the NSG attached to the subnet being used to protect your Azure Service Fabric cluster. Record the NSG flow logs into a Azure Storage Account to generate flow records. If required for investigating anomalous activity, enable Azure Network Watcher packet capture.

How to Enable NSG Flow Logs:
https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal

How to enable Network Watcher:
https://docs.microsoft.com/azure/network-watcher/network-watcher-create


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.6: Deploy network based intrusion detection/intrusion prevention systems (IDS/IPS)

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24087).

**Guidance**: Select an offer from the Azure Marketplace that supports IDS/IPS functionality with payload inspection capabilities.  If intrusion detection and/or prevention based on payload inspection is not a requirement, Azure Firewall with Threat Intelligence can be used. Azure Firewall Threat intelligence-based filtering can alert and deny traffic to and from known malicious IP addresses and domains. The IP addresses and domains are sourced from the Microsoft Threat Intelligence feed. Deploy the firewall solution of your choice at each of your organization's network boundaries to detect and/or deny malicious traffic. Azure Marketplace: https://azuremarketplace.microsoft.com/marketplace/?term=Firewall How to deploy Azure Firewall: https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal How to configure alerts with Azure Firewall: https://docs.microsoft.com/azure/firewall/threat-intel



**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.7: Manage traffic to web applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24088).

**Guidance**: Deploy Azure Application Gateway for web applications with HTTPS/SSL enabled for trusted certificates. How to deploy Application Gateway:https://docs.microsoft.com/azure/application-gateway/quick-create-portalHow to configure Application Gateway to use HTTPS:
https://docs.microsoft.com/azure/application-gateway/create-ssl-portal

Understand layer 7 load balancing with Azure web application gateways:
https://docs.microsoft.com/azure/application-gateway/overview



**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 1.8: Minimize complexity and administrative overhead of network security rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24089).

**Guidance**: Use Virtual network service tags to define network access controls on network security groups (NSG) that are attached to the subnet your Azure Service Fabric cluster is deployed in. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., ApiManagement) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

Understand and using Service Tags for Azure Service Fabric:
https://docs.microsoft.com/azure/virtual-network/security-overview#service-tags

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.9: Maintain standard security configurations for network devices

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24090).

**Guidance**: Define and implement standard security configurations for network resources related to your Azure Service Fabric cluster. Use Azure Policy aliases in the "Microsoft.ServiceFabric" and "Microsoft.Network" namespaces to create custom policies to audit or enforce the network configuration of your Azure Service Fabric cluster.

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

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24091).

**Guidance**: Use Tags for network security group (NSGs) and other resources related to network security and traffic flow that are associated with your Azure Service Fabric cluster. For individual NSG rules, use the "Description" field to specify business need and/or duration (etc.) for any rules that allow traffic to/from a network.

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

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24092).

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network resources related to your Azure Service Fabric deployments. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place.

How to view and retrieve Azure Activity Log events:
https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view

How to create alerts in Azure Monitor:
https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Logging and monitoring

*For more information, see [Security control: Logging and monitoring](https://docs.microsoft.com/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.1: Use approved time synchronization sources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24093).

**Guidance**: Microsoft maintains time sources for Azure Service Fabric cluster components, you may update time synchronization for your compute deployments.

How to configure time synchronization for Azure compute resources:
https://docs.microsoft.com/azure/virtual-machines/windows/time-sync


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Microsoft

### 2.2: Configure central security log management

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24094).

**Guidance**: You can onboard your Azure Service Fabric cluster to Azure Monitor to aggregate security data generated by the cluster. See example diagnostics problems and solutions with Service Fabric.

Configure Azure Monitor logs integration with Service Fabric:
https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-oms-setup

Set up Azure Monitor logs for monitoring containers in Azure Service Fabric:https://docs.microsoft.com/azure/service-fabric/service-fabric-tutorial-monitoring-wincontainers

Diagnosing common Service Fabric scenarios:
https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-common-scenarios


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24095).

**Guidance**: Enable Azure Monitor for the Service Fabric cluster, direct it to a Log Analytics workspace. This will log relevant cluster information and OS metrics for all Azure Service Fabric cluster nodes.

Configure Azure Monitor logs integration with Service Fabric:
https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-oms-setup

Set up Azure Monitor logs for monitoring containers in Azure Service Fabric:
https://docs.microsoft.com/azure/service-fabric/service-fabric-tutorial-monitoring-wincontainers

How to deploy the Log Analystics agent onto your nodes:
https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-oms-agent

Log Analytics Log Searches:
https://docs.microsoft.com/azure/log-analytics/log-analytics-log-searches

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.4: Collect security logs from operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24096).

**Guidance**: Onboard the Azure Service Fabric cluster to Azure Monitor. Ensure that the Log Analytics workspace used has the log retention period set according to your organization's compliance regulations.

Configure Azure Monitor logs integration with Service Fabric:
https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-oms-setup

Set up Azure Monitor logs for monitoring containers in Azure Service Fabric:
https://docs.microsoft.com/azure/service-fabric/service-fabric-tutorial-monitoring-wincontainers

How to deploy the Log Analystics agent onto your nodes:
https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-oms-agent

How to configure Log Analytics Workspace Retention Period:
https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.5: Configure security log storage retention

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24097).

**Guidance**: Onboard the Azure Service Fabric cluster to Azure Monitor. Ensure that the Log Analytics workspace used has the log retention period set according to your organization's compliance regulations.

Configure Azure Monitor logs integration with Service Fabric:
https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-oms-setup

Set up Azure Monitor logs for monitoring containers in Azure Service Fabric:
https://docs.microsoft.com/azure/service-fabric/service-fabric-tutorial-monitoring-wincontainers

How to deploy the Log Analystics agent onto your nodes:
https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-oms-agent

How to configure Log Analytics Workspace Retention Period:
https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.6: Monitor and review Logs

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24098).

**Guidance**: Use Azure Log Analytics workspace queries to query Azure Service Fabric logs.

Log Analytics Log Searches:
https://docs.microsoft.com/azure/log-analytics/log-analytics-log-searches


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activity

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24099).

**Guidance**: Use Azure Log Analytics workspace for monitoring and alerting on anomalous activities in security logs and events related to your Azure Service Fabric cluster.

How to manage alerts in Azure Security Center:
https://docs.microsoft.com/azure/security-center/security-center-managing-and-responding-alerts

How to alert on log analytics log data:
https://docs.microsoft.com/azure/azure-monitor/learn/tutorial-response

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.8: Centralize anti-malware logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24100).

**Guidance**: By default, Windows Defender is installed on Windows Server 2016. Refer to your Antimaleware documentation for configuration rules if you are not using Windows Defender. Windows Defender is not supported on Linux.

For details, see Windows Defender antivirus on Windows Server 2016:
https://docs.microsoft.com/windows/security/threat-protection/windows-defender-antivirus/windows-defender-antivirus-on-windows-server-2016

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.9: Enable DNS query logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24101).

**Guidance**: Implement a third-party solution for DNS logging.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.10: Enable command-line audit logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24102).

**Guidance**: Manually configure console logging on a per-node basis.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Identity and access control

*For more information, see [Security control: Identity and access control](https://docs.microsoft.com/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain an inventory of administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24103).

**Guidance**: Maintain record of the local administrative account that is created during cluster provisioning of Azure Service Fabric cluster as well as any other accounts you create. In addition, if Azure AD integration is used, Azure AD has built-in roles that must be explicitly assigned and are therefore queryable. Use the Azure AD PowerShell module to perform adhoc queries to discover accounts that are members of administrative groups.

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

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24104).

**Guidance**: When provisioning a cluster, Azure requires you to create new passwords for the web portal. There are no default passwords to change, however you can specify different passwords for web portal access.

Create in Azure portal:

https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-creation-via-portal

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.3: Use dedicated administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24105).

**Guidance**: Integrate Authentication for Azure Service Fabric with Azure Active Directory. Create policies and procedures around the use of dedicated administrative accounts.

In addition, you may use Azure Security Center Identity and Access Management recommendations.

Set up Azure Active Directory client authentication:
https://docs.microsoft.com/azure/service-fabric/service-fabric-tutorial-create-vnet-and-windows-cluster#set-up-azure-active-directory-client-authentication

How to monitor identity and access with Azure Security Center:
https://docs.microsoft.com/azure/security-center/security-center-identity-access


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.4: Use single sign-on (SSO) with Azure Active Directory

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24106).

**Guidance**: Wherever possible, use Azure Active Directory SSO instead than configuring individual stand-alone credentials per-service. Use Azure Security Center Identity and Access Management recommendations. Understand SSO with Azure AD: https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24107).

**Guidance**: Enable Azure AD MFA and follow Azure Security Center Identity and Access Management recommendations. How to enable MFA in Azure:https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstartedHow to monitor identity and access within Azure Security Center:
https://docs.microsoft.com/azure/security-center/security-center-identity-access


**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24108).

**Guidance**: Use PAWs (privileged access workstations) with multi-factor authentication (MFA) configured to log into and configure your Azure Service Fabric clusters and related resources.

Learn about Privileged Access Workstations:

https://docs.microsoft.com/windows-server/identity/securing-privileged-access/privileged-access-workstations 

How to enable MFA in Azure:

https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.7: Log and alert on suspicious activity from administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24109).

**Guidance**: Use Azure Active Directory (AD) Privileged Identity Management (PIM) for generation of logs and alerts when suspicious or unsafe activity occurs in the environment. In addition, use Azure AD risk detections to view alerts and reports on risky user behavior.

How to deploy Privileged Identity Management (PIM):

https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-deployment-plan

Understand Azure AD risk detections:

https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risk-events

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 3.8: Manage Azure resources from only approved locations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24110).

**Guidance**: Use Conditional Access Named Locations to allow access from only specific logical groupings of IP address ranges or countries/regions. How to configure Named Locations in Azure: https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 3.9: Use Azure Active Directory

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24111).

**Guidance**: Use Azure Active Directory (AAD) as the central authentication and authorization system to secure access to management endpoints of Azure Service Fabric clusters. AAD protects data by using strong encryption for data at rest and in transit. AAD also salts, hashes, and securely stores user credentials. How to create and configure an AAD instance:https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-access-create-new-tenant

Setup Azure Active Directory for Service Fabric client authentication:
https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-creation-setup-aad



**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 3.10: Regularly review and reconcile user access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24112).

**Guidance**: Use Azure Active Directory (AAD) authentication with your Azure Service Fabric cluster. AAD provides logs to help discover stale accounts. In addition, use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User's access can be reviewed on a regular basis to make sure only the right Users have continued access.

How to use Azure Identity Access Reviews:

https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.11: Monitor attempts to access deactivated accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24113).

**Guidance**: Use Azure Active Directory (AAD) Sign-in and Audit logs to monitor for attempts to access deactivated accounts; these logs can be integrated into any third-party SIEM/monitoring tool.

You can streamline this process by creating Diagnostic Settings for AAD user accounts, sending the audit logs and sign-in logs to a Azure Log Analytics workspace. Configure desired Alerts within Azure Log Analytics workspace.

How to integrate Azure Activity Logs into Azure Monitor:
https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.12: Alert on account login behavior deviation

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24114).

**Guidance**: Use Azure AD Risk and Identity Protection features to configure automated responses to detected suspicious actions related to user identities. You can also ingest data into Azure Sentinel for further investigation. How to view Azure AD risky sign-ins: https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risky-sign-ins How to configure and enable Identity Protection risk policies: https://docs.microsoft.com/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies How to onboard Azure Sentinel: https://docs.microsoft.com/azure/sentinel/quickstart-onboard

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24115).

**Guidance**: Not available; Customer Lockbox not yet supported for Azure Service Fabric.

List of Customer Lockbox supported services:https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview#supported-services-and-scenarios-in-general-availability


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Data protection

*For more information, see [Security control: Data protection](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an inventory of sensitive Information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24116).

**Guidance**: Use tags on resources related to your Azure Service Fabric cluster deployments to assist in tracking Azure resources that store or process sensitive information.

How to create and use tags:
https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24117).

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. Resources should be separated by VNet/Subnet, tagged appropriately, and secured by an NSG or Azure Firewall. Resources storing or processing sensitive data should be sufficiently isolated. For Virtual Machines storing or processing sensitive data, implement policy and procedure(s) to turn them off when not in use. How to create additional Azure subscriptions:https://docs.microsoft.com/azure/billing/billing-create-subscriptionHow to create Management Groups:
https://docs.microsoft.com/azure/governance/management-groups/createHow to create and use Tags:
https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tagsHow to create a Virtual Network:
https://docs.microsoft.com/azure/virtual-network/quick-create-portalHow to create an NSG with a Security Config:
https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-trafficHow to deploy Azure Firewall:
https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal

How to configure alert or alert and deny with Azure Firewall:
https://docs.microsoft.com/azure/firewall/threat-intel



**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 4.3: Monitor and block unauthorized transfer of sensitive information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24118).

**Guidance**: Deploy an automated tool on network perimeters that monitors for unauthorized transfer of sensitive information and blocks such transfers while alerting information security professionals. For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities. Understand customer data protection in Azure: https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data

**Azure Security Center monitoring**: N/A

**Responsibility**: Shared

### 4.4: Encrypt all sensitive information in transit

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24119).

**Guidance**: Encrypt all sensitive information in transit. Ensure that any clients connecting to your Azure resources are able to negotiate TLS 1.2 or greater. 

For Service Fabric client-to-node mutual authentication, use a X.509 certificate for server identity and TLS encryption of http communication. Any number of additional certificates can be installed on a cluster for application security purposes, including encryption and decryption of application configuration values and data across nodes durinkg replication.Follow Azure Security Center recommendations for encryption at rest and encryption in transit, where applicable. Understand encryption in transit with Azure:
https://docs.microsoft.com/azure/security/fundamentals/encryption-overview#encryption-of-data-in-transit

Service Fabric cluster security scenarios:
https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-security

Service Fabric Troubleshooting Guide for TLS Configuration:
https://github.com/Azure/Service-Fabric-Troubleshooting-Guides/blob/master/Security/TLS%20Configuration.md


**Azure Security Center monitoring**: N/A

**Responsibility**: Shared

### 4.5: Use an active discovery tool to identify sensitive data

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24120).

**Guidance**: Data identification, classification, and loss prevention features are not yet available for Azure Storage or compute resources. Implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

Understand customer data protection in Azure:
https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data

**Azure Security Center monitoring**: N/A

**Responsibility**: Shared

### 4.6: Use Azure RBAC to control access to resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24121).

**Guidance**: Not applicable; this recommendation is intended for non-compute resources designed to store data.

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 4.7: Use host-based data loss prevention to enforce access control

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24122).

**Guidance**: For Azure Service Fabric clusters storing or processing sensitive information, mark the cluster and related resources as sensitive using tags. Data identification, classification, and loss prevention features are not yet available for Azure Storage or compute resources. Implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

Understand customer data protection in Azure:
https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data

**Azure Security Center monitoring**: N/A

**Responsibility**: Shared

### 4.8: Encrypt sensitive information at rest

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24123).

**Guidance**: Not applicable; this recommendation is intended for non-compute resources designed to store data.

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 4.9: Log and alert on changes to critical Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24124).

**Guidance**: Use Azure Monitor with the Azure Activity Log to create alerts for when changes take place to critical Azure resources. How to create alerts for Azure Activity Log events: https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

## Vulnerability management

*For more information, see [Security control: Vulnerability management](https://docs.microsoft.com/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.1: Run automated vulnerability scanning tools

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24125).

**Guidance**: Implement a third-party vulnerability management solution.

Optionally, if you have a Rapid7, Qualys, or any other vulnerability management platform subscription, you may use script actions to install vulnerability assessment agents on your Azure HDInsight cluster nodes and manage the nodes through the respective portal.

How to Install Rapid7 Agent Manually:
https://insightvm.help.rapid7.com/docs/install

How to install Qualys Agent Manually:
https://www.qualys.com/docs/qualys-cloud-agent-linux-install-guide.pdf


**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 5.2: Deploy automated operating system patch management solution

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24126).

**Guidance**: Automatic system updates have been enabled for cluster node images, however you must periodically reboot cluster nodes to ensure updates are applied. The Patch Orchestration Application (POA) is recommended for configuration-based OS patch scheduling.

Microsoft to maintain and update base Azure Service Fabric cluster node images.

How to configure the OS patching schedule for Service Fabric clusters:
https://docs.microsoft.com/azure/service-fabric/service-fabric-patch-orchestration-application

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 5.3: Deploy automated third-party software patch management solution

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24127).

**Guidance**: Use the Patch Orchestration Application (POA) to patch your Azure Service Fabric clusters without any downtime. Newly created clusters will always have the latest available updates, including the most recent security patches.

How to configure the OS patching schedule for Service Fabric clusters:
https://docs.microsoft.com/azure/service-fabric/service-fabric-patch-orchestration-application


**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 5.4: Compare back-to-back vulnerability scans

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24128).

**Guidance**: Implement a third-party vulnerability management solution which has the ability to compare vulnerability scans over time. If you have a Rapid7 or Qualys subscription, you may use that vendor's portal to view and compare back-to-back vulnerability scans.

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24129).

**Guidance**: Use a common risk scoring program (e.g. Common Vulnerability Scoring System) or the default risk ratings provided by your third-party scanning tool.

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

## Inventory and asset management

*For more information, see [Security control: Inventory and asset management](https://docs.microsoft.com/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use Azure Asset Discovery

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24130).

**Guidance**: Use Azure Resource Graph to query/discover all resources (such as compute, storage, network, ports, and protocols etc.) within your subscription(s).  Ensure appropriate (read) permissions in your tenant and enumerate all Azure subscriptions as well as resources within your subscriptions. Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use Azure Resource Manager resources going forward. How to create queries with Azure Resource Graph: https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal How to view your Azure Subscriptions: https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0 Understand Azure RBAC: https://docs.microsoft.com/azure/role-based-access-control/overview

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 6.2: Maintain asset metadata

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24131).

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

How to create and use tags:
https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags


**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 6.3: Delete unauthorized Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24132).

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track assets. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

How to create additional Azure subscriptions:
https://docs.microsoft.com/azure/billing/billing-create-subscription

How to create Management Groups:
https://docs.microsoft.com/azure/governance/management-groups/create

How to create and use tags:
https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 6.4: Maintain an inventory of approved Azure resources and software titles

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24133).

**Guidance**: Define approved Azure resources and approved software for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 6.5: Monitor for unapproved Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24134).

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

Not allowed resource types

Allowed resource types

Use Azure Resource Graph to query/discover resources within your subscription(s). Ensure that all Azure resources present in the environment are approved.

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

How to create queries with Azure Graph: https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 6.6: Monitor for unapproved software applications within compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24135).

**Guidance**: Implement a third-party solution to monitor cluster nodes for unapproved software applications.

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 6.7: Remove unapproved Azure resources and software applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24136).

**Guidance**: Use Azure Resource Graph to query/discover all resources (such as compute, storage, network, ports, and protocols etc.), including Azure Service Fabric clusters, within your subscription(s). Remove any unapproved Azure resources that you discover. For Azure Service Fabric cluster nodes, implement a third-party solution to remove or alert on unapproved software.

How to create queries with Azure Graph:
https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 6.8: Use only approved applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24137).

**Guidance**: For Azure Service Fabric cluster nodes, implement a third-party solution to prevent unauthorized software from executing.

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 6.9: Use only approved Azure services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24138).

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

Not allowed resource types

Allowed resource types

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

How to deny a specific resource type with Azure Policy: https://docs.microsoft.com/azure/governance/policy/samples/not-allowed-resource-types

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 6.10: Implement approved application list

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24139).

**Guidance**: For Azure Service Fabric cluster nodes, implement a third-party solution to prevent unauthorized file types from executing.

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 6.11: Limit users' ability to interact with AzureResources Manager via scripts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24140).

**Guidance**: Use Azure Conditional Access to limit users' ability to interact with Azure Resources Manager by configuring "Block access" for the "Microsoft Azure Management" App. How to configure Conditional Access to block access to Azure Resources Manager: https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 6.12: Limit users' ability to execute scripts within compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24141).

**Guidance**: Use operating system specific configurations or third-party resources to limit users' ability to execute scripts within Azure compute resources. For example, how to control PowerShell script execution in Windows Environments: https://docs.microsoft.com/powershell/module/microsoft.powershell.security/set-executionpolicy?view=powershell-6

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 6.13: Physically or logically segregate high risk applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24142).

**Guidance**: Software that is required for business operations, but may incur higher risk for the organization, should be isolated within its own virtual machine and/or virtual network and sufficiently secured with either an Azure Firewall or Network Security Group. How to create a virtual network: https://docs.microsoft.com/azure/virtual-network/quick-create-portal How to create an NSG with a security config: https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

## Secure configuration

*For more information, see [Security control: Secure configuration](https://docs.microsoft.com/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish secure configurations for all Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24143).

**Guidance**: Use Azure Policy aliases in the "Microsoft.ServiceFabric" namespace to create custom policies to audit or enforce the network configuration of your Service Fabric cluster.

How to view available Azure Policy aliases:
https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0

How to configure and manage Azure Policy:
https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.2: Establish secure operating system configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24144).

**Guidance**: Azure Service Fabric Operating System Images are managed and maintained by Microsoft. Customer responsible for implementing secure configurations for your cluster nodes' operating system.


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.3: Maintain secure Azure resource configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24145).

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] to enforce secure settings for your Azure Service Fabric clusters and related resources.

How to configure and manage Azure Policy:
https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

Understand Azure Policy Effects:
https://docs.microsoft.com/azure/governance/policy/concepts/effects


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.4: Maintain secure operating system configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24146).

**Guidance**: Azure Service Fabric cluster Operating System Images managed and maintained by Microsoft. Customer responsible for implementing OS-level state configuration.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### 7.5: Securely store configuration of Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24147).

**Guidance**: If using custom Azure Policy definitions, use Azure DevOps or Azure Repos to securely store and manage your code.

How to store code in Azure DevOps:
https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops

Azure Repos Documentation:
https://docs.microsoft.com/azure/devops/repos/index?view=azure-devops


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.6: Securely store custom operating system images

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24148).

**Guidance**: Not applicable; custom images not applicable to Azure Service Fabric.

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 7.7: Deploy system configuration management tools

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24149).

**Guidance**: Use Azure Policy aliases in the "Microsoft.ServiceFabric" namespace to create custom policies to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.

How to configure and manage Azure Policy:
https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.8: Deploy system configuration management tools for operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24150).

**Guidance**: Not applicable; this guideline is intended for IaaS compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 7.9: Implement automated configuration monitoring for Azure services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24151).

**Guidance**: Use Azure Policy aliases in the "Microsoft.ServiceFabric" namespace to create custom policies to audit or enforce the configuration of your Service Fabric cluster.

How to view available Azure Policy aliases:
https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0

How to configure and manage Azure Policy:
https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.10: Implement automated configuration monitoring for operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24152).

**Guidance**: Use Azure Security Center to perform baseline scans for OS and Docker Settings for containers. Understand Azure Security Center container recommendations: https://docs.microsoft.com/azure/security-center/security-center-container-recommendations

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 7.11: Manage Azure secrets securely

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24153).

**Guidance**: Use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure secret management for your cloud applications. 

Using managed identities for Azure with Service Fabric:
https://docs.microsoft.com/azure/service-fabric/concepts-managed-identity

Configure managed identity support for a new Service Fabric cluster:
https://docs.microsoft.com/azure/service-fabric/configure-new-azure-service-fabric-enable-managed-identity

Use managed identity with a Service Fabric application:
https://docs.microsoft.com/azure/service-fabric/how-to-managed-identity-service-fabric-app-code

KeyVaultReference support for Service Fabric applications:
https://docs.microsoft.com/azure/service-fabric/service-fabric-keyvault-references



**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 7.12: Manage identities securely and automatically

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24154).

**Guidance**: Managed identities can be used in Azure-deployed Service Fabric clusters, and only for applications deployed as Azure resources.

Using Managed identities for Azure with Service Fabric:

https://docs.microsoft.com/azure/service-fabric/concepts-managed-identity

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.13: Eliminate unintended credential exposure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24155).

**Guidance**: If using any code related to your Azure Service Fabric deployment, you may implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

How to setup Credential Scanner:
https://secdevtools.azurewebsites.net/helpcredscan.html


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Malware defense

*For more information, see [Security control: Malware defense](https://docs.microsoft.com/azure/security/benchmarks/security-control-malware-defense).*

### 8.1: Use centrally managed anti-malware software

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24156).

**Guidance**: By default, Windows Defender antivirus is installed on Windows Server 2016. The user interface is installed by default on some SKUs, but is not required.

Refer to your Antimalware documentation for configuration rules if you are not using Windows Defender. Windows Defender isn't supported on Linux.

Understand Windows Defender Antivirus on Windows Server 2016:

https://docs.microsoft.com/windows/security/threat-protection/windows-defender-antivirus/windows-defender-antivirus-on-windows-server-2016

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24157).

**Guidance**: Not applicable; this recommendation is intended for
non-compute resources designed to store data. Microsoft anti-malware is enabled on the underlying
host that supports Azure services (for example, Service Fabric), however it
does not run on customer content.

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 8.3: Ensure anti-malware software and signatures are updated

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24158).

**Guidance**: Not applicable; this recommendation is intended for
non-compute resources designed to store data. Microsoft anti-malware is enabled on the underlying
host that supports Azure services (for example, Service Fabric), however it
does not run on customer content.

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

## Data recovery

*For more information, see [Security control: Data recovery](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure regular automated back ups

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24159).

**Guidance**: How data is backed up/made redundant is dependent on the service. LRS, ZRS, GRS for Storage Accounts, Global Replication for CosmosDB, built-in backup and DR for Virtual Machines

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 9.2: Perform complete system backups and backup any customer managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24160).

**Guidance**: Enable backup restore service in your Service Fabric cluster and create backup policies to backup stateful services periodically and on-demand. Backup customer managed keys within Azure Key Vault.

Periodic backup and restore in an Azure Service Fabric cluster:

https://docs.microsoft.com/azure/service-fabric/service-fabric-backuprestoreservice-quickstart-azurecluster

Understanding periodic backup configuration in Azure Service Fabric:

https://docs.microsoft.com/azure/service-fabric/service-fabric-backuprestoreservice-configure-periodic-backup

How to backup key vault keys in Azure: https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey?view=azurermps-6.13.0



**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 9.3: Validate all backups including customer managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24161).

**Guidance**: Ensure ability to perform restoration from the backup restore service by periodically reviewing backup configuration information and available backups. Test restoration of backed up customer managed keys.

Understanding periodic backup configuration in Azure Service Fabric:

https://docs.microsoft.com/azure/service-fabric/service-fabric-backuprestoreservice-configure-periodic-backup

Restoring backup in Azure Service Fabric:

https://docs.microsoft.com/azure/service-fabric/service-fabric-backup-restore-service-trigger-restore

How to restore key vault keys in Azure: https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultkey?view=azurermps-6.13.0



**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 9.4: Ensure protection of backups and customer managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24162).

**Guidance**: Backups from Service Fabric backup restore service use an Azure Storage account in your subscription. Azure Storage encrypts all data in a storage account at rest. By default, data is encrypted with Microsoft-managed keys. For additional control over encryption keys, you can supply customer-managed keys for encryption of storage data.If you are using customer-managed-keys, ensure Soft-Delete in Key Vault is enabled to protect keys against accidental or malicious deletion.Azure Storage encryption at rest:https://docs.microsoft.com/azure/storage/common/storage-service-encryption

How to enable Soft-Delete in Key Vault:
https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete?tabs=azure-portal


**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

## Incident response

*For more information, see [Security control: Incident response](https://docs.microsoft.com/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create an incident response guide

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24163).

**Guidance**: Ensure that there are written incident response plans that defines roles of personnel as well as phases of incident handling/management.

How to configure Workflow Automations within Azure Security Center:
https://docs.microsoft.com/azure/security-center/security-center-planning-and-operations-guide

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24164).

**Guidance**: Security Center assigns a severity to alerts, to help you prioritize the order in which you attend to each alert, so that when a resource is compromised, you can get to it right away. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.3: Test security response procedures

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24169).

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

NIST Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities:

https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24165).

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party.

How to set the Azure Security Center Security Contact:
https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24166).

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts Sentinel.

How to configure continuous export:
https://docs.microsoft.com/azure/security-center/continuous-export

How to stream alerts into Azure Sentinel:
https://docs.microsoft.com/azure/sentinel/connect-azure-security-center


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24167).

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.

How to configure Workflow Automation and Logic Apps:
https://docs.microsoft.com/azure/security-center/workflow-automation

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Penetration tests and red team exercises

*For more information, see [Security control: Penetration tests and red team exercises](https://docs.microsoft.com/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings within 60 days

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24168).

**Guidance**: Follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies. Review Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft managed cloud infrastructure, services and applications.

Microsoft Cloud Penetration Testing Rules of Engagement:
https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1.

Microsoft Cloud Red Teaming:
https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e


**Azure Security Center monitoring**: N/A

**Responsibility**: Shared

## Next steps

- See the [Azure security benchmark](https://docs.microsoft.com/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview)
