---
title: Azure Security Baseline for Azure Kubernetes Service
description: Azure Security Baseline for Azure Kubernetes Service
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 04/06/2020
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Azure Security Baseline for Azure Kubernetes Service

The Azure Security Baseline for Azure Kubernetes Service contains recommendations that will help you improve the security posture of your deployment.

The baseline for this service is drawn from the [Azure Security Benchmark version 1.0](https://docs.microsoft.com/azure/security/benchmarks/overview), which provides recommendations on how you can secure your cloud solutions on Azure with our best practices guidance.

For more information, see [Azure Security Baselines overview](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network Security

*For more information, see [Security Control: Network Security](https://docs.microsoft.com/azure/security/benchmarks/security-control-network-security).*

### 1.1: Protect resources using Network Security Groups or Azure Firewall on your Virtual Network

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3260).

**Guidance**: With Azure Kubernetes Service (AKS), you can deploy a cluster that uses one of the following two network models:

'Basic', which creates a new VNet for your cluster using default values.

'Advanced',  which allows clusters to use a new or existing VNet with customizable addresses. Application pods are connected directly to the VNet, which allows for native integration with VNet features.

A network security group filters traffic for VMs, such as the AKS nodes. As you create services, such as a Load Balancer, the Azure platform automatically configures any network security group rules that are needed. Don't manually configure network security group rules to filter traffic for pods in an AKS cluster. Define any required ports and forwarding as part of your Kubernetes Service manifests, and let the Azure platform create or update the appropriate rules.

How to configure networking for your AKS instance:
https://docs.microsoft.com/azure/aks/configure-azure-cni#configure-networking---portal

Understand network security configurations for AKS:
https://docs.microsoft.com/azure/aks/concepts-network#azure-virtual-networks

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### 1.2: Monitor and log the configuration and traffic of Vnets, Subnets, and NICs

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3261).

**Guidance**: Use Azure Security Center and follow network protection recommendations to help secure the network resources being used by your Azure Kubernetes Service (AKS) clusters.  For your AKS management virtual network/subnet, enable network security group (NSG) flow logs and send logs into an Azure Storage Account for traffic audit. You may also send NSG flow logs to a Azure Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Azure Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

How to Enable NSG Flow Logs:

https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal

How to Enable and use Traffic Analytics:

https://docs.microsoft.com/azure/network-watcher/traffic-analytics

Understand Network Security provided by Azure Security Center:

https://docs.microsoft.com/azure/security-center/security-center-network-recommendations

Understand best practices for network connectivity and security in AKS:

https://docs.microsoft.com/azure/aks/operator-best-practices-network

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.3: Protect critical web applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3262).

**Guidance**: To scan incoming traffic for potential attacks, use a web application firewall (WAF) such as Barracuda WAF for Azure or Azure Application Gateway to protect your Azure Kubernetes Service (AKS) cluster. These more advanced network resources can also route traffic beyond just HTTP and HTTPS connections or basic SSL termination.

A web application firewall (WAF) provides an additional layer of security by filtering the incoming traffic. The Open Web Application Security Project (OWASP) provides a set of rules to watch for attacks like cross site scripting or cookie poisoning.

Create an Application Gateway Ingress Controller (AGIC), a Kubernetes application, which makes it possible for Azure Kubernetes Service (AKS) customers to leverage Azure's native Application Gateway L7 load-balancer to expose cloud software to the Internet.

Understand best practices for network connectivity and security in AKS:

https://docs.microsoft.com/azure/aks/operator-best-practices-network

How to get started by creating an Application Gateway Ingress Controller:

https://github.com/azure/application-gateway-kubernetes-ingress

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.4: Deny communications with known malicious IP addresses

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3263).

**Guidance**: For protections from distributed denial-of-service (DDoS) attacks, Enable DDoS Standard protection on the Virtual Network your AKS components are deployed in. 

How to configure DDoS protection:
https://docs.microsoft.com/azure/virtual-network/manage-ddos-protection

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.5: Record network packets and flow logs

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3264).

**Guidance**: Enable network security group (NSG) flog logs for the NSGs attached to your Azure Kubernetes Service (AKS) nodes as well as any NSGs attached to subnets being used to protect your AKS service components (such as the management virtual network your web application firewall (WAF) is deployed to). Record the NSG flow logs into a Azure Storage Account to generate flow records. If required for investigating anomalous activity, enable Network Watcher packet capture.

How to Enable NSG Flow Logs:
https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal

How to enable Network Watcher:
https://docs.microsoft.com/azure/network-watcher/network-watcher-create

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.6: Deploy network based intrusion detection/intrusion prevention systems (IDS/IPS)

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3265).

**Guidance**: Secure your Azure Kubernetes Service (AKS) cluster with a web application firewall such as Barracuda WAF for Azure with Barracuda Advanced Threat Protection enabled. If intrusion detection and/or prevention based on payload inspection or behavior analytics is not a requirement, Azure Application Gateway can be used and configured in "detection mode" to log alerts and threats, or "prevention mode" to actively block detected intrusions and attacks.

Understand best practices for securing your AKS cluster with a WAF:

https://docs.microsoft.com/azure/aks/operator-best-practices-network#secure-traffic-with-a-web-application-firewall-waf

How to deploy Azure Application Gateway (Azure WAF):

https://docs.microsoft.com/azure/web-application-firewall/ag/application-gateway-web-application-firewall-portal

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.7: Manage traffic to web applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3266).

**Guidance**: Covered in detail by Azure ID 1.3; Deploy Azure WAF.

Understand best practices for network connectivity and security in AKS:

https://docs.microsoft.com/azure/aks/operator-best-practices-network

How to get started by creating an Application Gateway Ingress Controller:

https://github.com/azure/application-gateway-kubernetes-ingress

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.8: Minimize complexity and administrative overhead of network security rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3267).

**Guidance**: Use virtual network service tags to define network access controls on network security groups associated with your Azure Kubernetes Service (AKS) instances. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., ApiManagement) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

*If updating network security group (NSG) rules, make sure they are for NSGs other than the NSG that is automatically created and maintained by AKS. As a managed service, AKS has specific networking and connectivity requirements. These requirements are less flexible than requirements for normal IaaS components. In AKS, operations like customizing NSG rules, blocking a specific port (for example, using firewall rules that block outbound port 443), and white-listing URLs can make your cluster unsupportable.

Understand and using Service Tags:
https://docs.microsoft.com/azure/virtual-network/service-tags-overview

Understand NSGs for AKS:
https://docs.microsoft.com/azure/aks/support-policies

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.9: Maintain standard security configurations for network devices

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3268).

**Guidance**: Define and implement standard security configurations for network resources associated with your Azure Kubernetes Service (AKS) clusters with Azure Policy. Use Azure Policy aliases in the "Microsoft.ContainerService" and "Microsoft.Network" namespaces to create custom policies to audit or enforce the network configuration of your AKS clusters. You may also make use of built-in policy definitions related to AKS, such as:

Authorized IP ranges should be defined on Kubernetes Services

Enforce HTTPS ingress in Kubernetes cluster

Ensure services listen only on allowed ports in Kubernetes cluster

How to configure and manage Azure Policy:

https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

Azure Policy samples for networking:

https://docs.microsoft.com/azure/governance/policy/samples/#network

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.10: Document traffic configuration rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3269).

**Guidance**: Use tags for network security groups (NSG) and other resources related to network security and traffic flow. For individual NSG rules, use the "Description" field to specify business need and/or duration (etc.) for any rules that allow traffic to/from a network.

Use any of the built-in Azure policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with Tags and to notify you of existing untagged resources.

You may use Azure PowerShell or Azure command-line interface (CLI) to look-up or perform actions on resources based on their Tags.

How to create and use tags:

https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

How to create a Virtual Network:

https://docs.microsoft.com/azure/virtual-network/quick-create-portal

How to create an NSG with a Security Config:

https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.11: Use automated tools to monitor network resource configurations and detect changes

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3270).

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network resources related to your Azure Kubernetes Service (AKS) clusters. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place.

How to view and retrieve Azure Activity Log events:
https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view

How to create alerts in Azure Monitor:
https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Logging and Monitoring

*For more information, see [Security Control: Logging and Monitoring](https://docs.microsoft.com/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.1: Use approved time synchronization sources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3271).

**Guidance**: Azure Kubernetes Service (AKS) nodes use ntp.ubuntu.com for time synchronization.

Understand NTP domain and port requirements for AKS cluster nodes:
https://docs.microsoft.com/azure/aks/limit-egress-traffic

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 2.2: Configure central security log management

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3272).

**Guidance**: Azure Monitor for Containers gives you performance visibility by collecting memory and processor metrics from controllers, nodes, and containers that are available in Kubernetes through the Metrics API. Container logs are also collected. After you enable monitoring from Kubernetes clusters, metrics and logs are automatically collected for you through a containerized version of the Azure Log Analytics agent for Linux. Metrics are written to the metrics store and log data is written to the logs store associated with your Log Analytics workspace.

Understand Azure Monitor for Containers:
https://docs.microsoft.com/azure/azure-monitor/insights/container-insights-overview

How to enable Azure Monitor for Containers:
https://docs.microsoft.com/azure/azure-monitor/insights/container-insights-onboard

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3273).

**Guidance**: Configure Diagnostic Settings to enable log collection for the Kubernetes master components in your Azure Kubernetes Service (AKS) cluster.

How to enable and review Kubernetes master node logs in AKS:
https://docs.microsoft.com/azure/aks/view-master-logs

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.4: Collect security logs from operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3274).

**Guidance**: Enable automatic provisioning of the Azure Log Analytics Agent. Security center collects data from your Azure virtual machines (VMs), virtual machine scale sets, and IaaS containers (Kubernetes cluster nodes), to monitor for security vulnerabilities and threats. Data is collected using the Azure Log Analytics Agent, which reads various security-related configurations and event logs from the machine and copies the data to your workspace for analysis. Data collection is required to provide visibility into missing updates, misconfigured OS security settings, endpoint protection status, and health and threat detections.

How to enable automatic provisioning of the Log Analytics Agent:

https://docs.microsoft.com/azure/security-center/security-center-enable-data-collection

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.5: Configure security log storage retention

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3275).

**Guidance**: After onboarding your Azure Kubernetes Service (AKS) instances to Azure Monitor for Containers, set the corresponding Azure Log Analytics workspace retention period according to your organization's compliance regulations.

How to set log retention parameters for Log Analytics Workspaces:
https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.6: Monitor and review Logs

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3276).

**Guidance**: Onboard your Azure Kubernetes Service (AKS) instances to Azure Monitor for Containers and configure Diagnostic Settings for your cluster. Use Azure Monitor's Log Analytics workspace to review logs and perform queries on log data.

Alternatively, you may enable and on-board data to Azure Sentinel or a third party SIEM. 

How to enable and review Kubernetes master node logs in AKS:
https://docs.microsoft.com/azure/aks/view-master-logs

How to onboard Azure Sentinel:
https://docs.microsoft.com/azure/sentinel/quickstart-onboard

How to perform custom queries in Azure Monitor:
https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-queries

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activity

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3277).

**Guidance**: Use Azure Kubernetes Service (AKS) together with Azure Security Center's Standard Tier to gain deeper visibility into your AKS nodes.

Through continuous analysis of raw security events occurring in your AKS cluster, such as network data, process creation, and the Kubernetes audit log, Security Center alerts you to threats and malicious activity detected at the host and AKS cluster level.

Understand Azure Kubernetes Services integration with Security Center:
https://docs.microsoft.com/azure/security-center/azure-kubernetes-service-integration

How to enable Azure Security Center Standard Tier:
https://docs.microsoft.com/azure/security-center/security-center-get-started

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.8: Centralize anti-malware logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3278).

**Guidance**: Use Azure Security Center Standard Tier with support for Azure Kubernetes Services enabled. Enable master node logging for your Azure Kubernetes Service (AKS) instances and send logs to an Azure Storage Account for archive as well as a Azure Log Analytics workspace if you wish to create queries and alerts.

Optionally, onboard your Azure Log Analytics workspace to Azure Sentinel and use the Azure Security Center Data Connector to stream alerts into Azure Sentinel.

For Windows-based AKS clusters, enable Microsoft anti-malware. For AKS cluster nodes running Linux, you must deploy your own anti-malware solution as Microsoft Antimalware is not compatible with Linux.

How to enable and review Kubernetes master node logs in AKS:
https://docs.microsoft.com/azure/aks/view-master-logs

How to onboard Azure Sentinel:
https://docs.microsoft.com/azure/sentinel/quickstart-onboard

How to Connect data from Azure Security Center to Azure Sentinel:
https://docs.microsoft.com/azure/sentinel/connect-azure-security-center

Understand and Deploy Microsoft Antimalware:
https://docs.microsoft.com/azure/security/fundamentals/antimalware

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.9: Enable DNS query logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3279).

**Guidance**: Implement a third-party solution for DNS logging.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.10: Enable command-line audit logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3280).

**Guidance**: Manually configure bash logging and PowerShell transcription on a per-node basis.

How to enable PowerShell transcription in Windows:
https://docs.microsoft.com/powershell/module/microsoft.powershell.core/about/about_logging_windows

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Identity and Access Control

*For more information, see [Security Control: Identity and Access Control](https://docs.microsoft.com/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain an inventory of administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3281).

**Guidance**: Use Azure Active Directory (AAD) as the integrated identity solution for your Azure Kubernetes Service (AKS) clusters. With Azure AD integration, you can grant users or groups access to Kubernetes resources within a namespace or across the cluster. Use the AAD PowerShell module to perform ad hoc queries to discover accounts that are members of your AKS administrative groups; reconcile access on a regular basis. Use Azure Security Center Identity and Access Management recommendations.

Understand AKS Azure Active Directory integration:

https://docs.microsoft.com/azure/aks/concepts-identity

How to integrate AKS with Azure Active Directory:

https://docs.microsoft.com/azure/aks/azure-ad-integration

How to get a directory role in AAD with PowerShell:

https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0

How to get members of a directory role in Azure AD with PowerShell:

https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0

How to monitor identity and access with Azure Security Center:

https://docs.microsoft.com/azure/security-center/security-center-identity-access

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.2: Change default passwords where applicable

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3282).

**Guidance**: Kubernetes itself doesn't have the concept of common default passwords or provide an identity management solution where regular user accounts and passwords are stored. Instead, external identity solutions can be integrated into Kubernetes. For Azure Kubernetes Service (AKS) clusters, this integrated identity solution is Azure Active Directory.

Understand access and identity options for AKS:
https://docs.microsoft.com/azure/aks/concepts-identity

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.3: Use dedicated administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3283).

**Guidance**: Integrate authentication for your Azure Kubernetes Service (AKS) clusters with Azure Active Directory. Create policies and procedures around the use of dedicated administrative accounts. Use Azure Security Center Identity and Access Management recommendations.

Understand AKS Azure Active Directory integration:

https://docs.microsoft.com/azure/aks/concepts-identity

How to monitor identity and access with Azure Security Center:

https://docs.microsoft.com/azure/security-center/security-center-identity-access

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.4: Use single sign-on (SSO) with Azure Active Directory

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3284).

**Guidance**: Not available; while Azure Kubernetes Service (AKS)  supports Azure Active Directory authentication, single sign-on is not supported.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3285).

**Guidance**: Integrate Authentication for Azure Kubernetes Service (AKS) with Azure Active Directory (AAD). Enable AAD multi-factor authentication (MFA) and follow Azure Security Center Identity and Access Management recommendations.

How to enable MFA in Azure:
https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted

How to monitor identity and access within Azure Security Center:
https://docs.microsoft.com/azure/security-center/security-center-identity-access

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3286).

**Guidance**: Use PAWs (privileged access workstations) with multi-factor authentication (MFA) configured to log into and configure your Azure Kubernetes Service (AKS) clusters and related resources.

Learn about Privileged Access Workstations:
https://docs.microsoft.com/windows-server/identity/securing-privileged-access/privileged-access-workstations

How to enable MFA in Azure:
https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.7: Log and alert on suspicious activity from administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3287).

**Guidance**: If you have integrated authentication for Azure Kubernetes Service (AKS) with Azure Active Directory (AAD), use Azure Active Directory security reports for generation of logs and alerts when suspicious or unsafe activity occurs in the environment. Use Azure Security Center to monitor identity and access activity.

How to identify AAD users flagged for risky activity:
https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-user-at-risk

How to monitor users identity and access activity in Azure Security Center:
https://docs.microsoft.com/azure/security-center/security-center-identity-access

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.8: Manage Azure resources from only approved locations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3288).

**Guidance**: Integrated authentication for Azure Kubernetes Service (AKS) with Azure Active Directory and use Conditional Access Named Locations to allow access from only specific logical groupings of IP address ranges or countries/regions.

How to configure Named Locations in Azure:

https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.9: Use Azure Active Directory

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3289).

**Guidance**: Use Azure Active Directory (AAD) as the central authentication and authorization system and integrate Authentication for AKS with AAD. AAD protects data by using strong encryption for data at rest and in transit. AAD also salts, hashes, and securely stores user credentials.

How to create and configure an AAD instance:
https://docs.microsoft.com/azure/active-directory-domain-services/tutorial-create-instance

How to integrate Azure Active Directory with AKS:
https://docs.microsoft.com/azure/aks/azure-ad-integration

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.10: Regularly review and reconcile user access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3290).

**Guidance**: Integrate authentication for Azure Kubernetes Service (AKS) with Azure Active Directory (AAD) and use Azure AD logs to help discover stale accounts. In addition, you may use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. Remediate Identity and Access recommendations from Azure Security Center.

Understand AAD Logs:

https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-audit-logs

How to use Azure Identity Access Reviews:

https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview

How to monitor users identity and access activity in Azure Security Center:

https://docs.microsoft.com/azure/security-center/security-center-identity-access

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.11: Monitor attempts to access deactivated accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3291).

**Guidance**: Integrate authentication for Azure Kubernetes Service (AKS) with Azure Active Directory. Create Diagnostic Settings for Azure Active Directory, sending the audit and sign-in logs to a Azure Log Analytics workspace. Configure desired Alerts (such as when a deceived account attempts to login) within Azure Log Analytics workspace.

How to integrate Azure Activity Logs into Azure Monitor:
https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics

How to create, view, and manage log alerts using Azure Monitor:
https://docs.microsoft.com/azure/azure-monitor/platform/alerts-log

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.12: Alert on account login behavior deviation

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3292).

**Guidance**: Integrate authentication for Azure Active Directory with Azure Active Directory(AAD) and use AAD Risk Detections and Identity Protection feature to configure automated responses to detected suspicious actions related to user identities. Additionally, you can ingest data into Azure Sentinel for further investigation.

How to view AAD risky sign-ins:
https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risky-sign-ins

How to configure and enable Identity Protection risk policies:
https://docs.microsoft.com/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies

How to onboard Azure Sentinel:
https://docs.microsoft.com/azure/sentinel/quickstart-onboard

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3293).

**Guidance**: 
Not available; Customer Lockbox not yet supported for Azure Kubernetes Service (AKS).

List of Customer Lockbox supported services: https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview#supported-services-and-scenarios-in-general-availability


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Data Protection

*For more information, see [Security Control: Data Protection](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an inventory of sensitive Information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3294).

**Guidance**: Use tags on resources related to your Azure Kubernetes Service (AKS) deployments to assist in tracking Azure resources that store or process sensitive information.

How to create and use Tags:
https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3295).

**Guidance**: Azure Kubernetes Service (AKS) provides features that let you logically isolate teams and workloads in the same cluster. The goal should be to provide the least number of privileges, scoped to the resources each team needs. A namespace in Kubernetes creates a logical isolation boundary. Additional Kubernetes features and considerations for isolation and multi-tenancy include the following areas: scheduling, networking, authentication/authorization, and containers.

Additionally, you may implement separate subscriptions and/or management groups for development, test, and production. AKS clusters should be separated by virtual network/subnet, tagged appropriately, and secured within a Web Application Firewall.

Learn about best practices for cluster isolation in AKS:
https://docs.microsoft.com/azure/aks/operator-best-practices-cluster-isolation

How to create additional Azure subscriptions:
https://docs.microsoft.com/azure/billing/billing-create-subscription

How to create Management Groups:
https://docs.microsoft.com/azure/governance/management-groups/create 

Understand best practices for network connectivity and security in AKS:
https://docs.microsoft.com/azure/aks/operator-best-practices-network

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.3: Monitor and block unauthorized transfer of sensitive information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3296).

**Guidance**: To increase the security of your Azure Kubernetes Service (AKS) cluster, restrict egress traffic to addresses, ports, and domain names that are required for your use case. AKS clusters are configured to pull base system container images from Microsoft Container Registry or Azure Container Registry. If you lock down the egress traffic, define specific ports and FQDNs to allow the AKS nodes to correctly communicate with required external services. Without these authorized ports and FQDNs, your AKS nodes can't communicate with the API server or install core components.

You can use Azure Firewall or a third-party firewall appliance to secure your egress traffic and define the required addresses, ports, and domain names. AKS does not automatically create these rules for you.

If using Azure Firewall, enable Diagnostic Settings to log rule matches. Use Azure Monitor Activity Log to detect changes to the Azure Firewall(s) being used to limit egress traffic on your AKS cluster(s).

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

List of required ports, addresses, and domain names for AKS functionality:

https://docs.microsoft.com/azure/aks/limit-egress-traffic

How to configure Diagnostic Settings for Azure Firewall:

https://docs.microsoft.com/azure/firewall/tutorial-diagnostics

How to create alerts in Azure Monitor:

https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log

Understand customer data protection in Azure:

https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 4.4: Encrypt all sensitive information in transit

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3297).

**Guidance**: Create an HTTPS ingress controller and use your own TLS certificates (or optionally, Let's Encrypt) for your Azure Kubernetes Service (AKS) deployments. 

Throughout the lifecycle of your AKS cluster, you may need to access an AKS node. You can securely access AKS nodes using SSH for nodes running Linux, or RDP for nodes running Windows Server.

Kubernetes egress traffic (for example, communication with the API server or downloading core Kubernetes cluster components and node security updates) is encrypted by default over HTTPS/TLS.

Potentially un-encrypted egress traffic from your AKS instance may include NTP traffic, DNS traffic, and in some cases, HTTP traffic for retrieving updates.

How to create an HTTPS ingress controller on AKS and use your own TLS certificates :

https://docs.microsoft.com/azure/aks/ingress-own-tls

How to create an HTTPS ingress controller on AKS with Let's Encrypt:

https://docs.microsoft.com/azure/aks/ingress-tls

How to connect with SSH to AKS cluster nodes for maintenance or troubleshooting:

https://docs.microsoft.com/azure/aks/ssh

List of potential out-going ports and protocols used by AKS:

https://docs.microsoft.com/azure/aks/limit-egress-traffic

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.5: Use an active discovery tool to identify sensitive data

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3298).

**Guidance**: Data identification, classification, and loss prevention features are not yet available for Azure Storage or compute resources. Implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

Understand customer data protection in Azure:

https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 4.6: Use Azure RBAC to control access to resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3299).

**Guidance**: Azure Kubernetes Service (AKS) can be configured to use Azure Active Directory (AAD) for user authentication. In this configuration, you sign in to an AKS cluster using an AAD authentication token. You can configure Kubernetes RBAC to limit access to cluster resources based a user's identity or group membership.

How to control access to cluster resources using RBAC and Azure AD Identities in AKS:
https://docs.microsoft.com/azure/aks/azure-ad-rbac

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 4.7: Use host-based data loss prevention to enforce access control

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3300).

**Guidance**: Data identification, classification, and loss prevention features are not yet available for Azure Storage or compute resources. Implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

Understand customer data protection in Azure:

https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 4.8: Encrypt sensitive information at rest

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3301).

**Guidance**: Azure Storage encrypts all data in a storage account at rest. By default, data is encrypted with Microsoft-managed keys. For additional control over encryption keys, you can supply customer-managed keys (BYOK) to use for encryption of both the OS and data disks for your Azure Kubernetes Service (AKS) clusters.

If using customer-managed keys, you are responsible for key management activities such as key backup and rotation.

Understand encryption-at-rest and BYOK with AKS:

https://docs.microsoft.com/azure/aks/azure-disk-customer-managed-keys

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 4.9: Log and alert on changes to critical Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3302).

**Guidance**: Azure Monitor for containers is a feature designed to monitor the performance of container workloads deployed to managed Kubernetes clusters hosted on Azure Kubernetes Service (AKS). Configure alerts to proactively notify you or create logs when CPU and memory utilization on nodes or containers exceed your thresholds, or when a health state change occurs in the cluster at the infrastructure or nodes health rollup. Integrate with Prometheus to view application and workload metrics it collects from nodes and Kubernetes using queries to create custom alerts, dashboards, and detailed perform detailed analysis.

You may also use Azure Activity Log to monitor your AKS clusters and related resources at a high level. Create alerts within Azure Monitor that will trigger when changes to these resources takes place.

Understand Azure Monitor for Containers:
https://docs.microsoft.com/azure/azure-monitor/insights/container-insights-overview

How to enable Azure Monitor for containers:
https://docs.microsoft.com/azure/azure-monitor/insights/container-insights-onboard

How to view and retrieve Azure Activity Log events:
https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Vulnerability Management

*For more information, see [Security Control: Vulnerability Management](https://docs.microsoft.com/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.1: Run automated vulnerability scanning tools

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3303).

**Guidance**: To monitor your Azure Container Registry (including Azure Kubernetes Service (AKS) instances) for vulnerabilities, ensure you have Azure Security Center Standard Tier enabled. Enable the optional Container Registries bundle. When a new image is pushed, Security Center scans the image using a scanner from the industry-leading vulnerability scanning vendor, Qualys. When issues are found, you’ll get notified in the Security Center dashboard. For every vulnerability, Security Center provides actionable recommendations, along with a severity classification, and guidance for how to remediate the issue. For details of Security Center's recommendations, see the reference list of recommendations.

Understand best practices for container image management and security in AKS:
https://docs.microsoft.com/azure/aks/operator-best-practices-container-image-management

Understand container Registry integration with Azure Security Center:
https://docs.microsoft.com/azure/security-center/azure-container-registry-integration

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 5.2: Deploy automated operating system patch management solution

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3304).

**Guidance**: To protect your Azure Kubernetes Service (AKS) clusters, security updates are automatically applied to Linux nodes. These updates include OS security fixes or kernel updates. Some of these updates require a node reboot to complete the process. AKS doesn't automatically reboot these Linux nodes to complete the update process.

The process to keep Windows Server nodes up to date differs from nodes running Linux. Windows Server nodes don't receive daily updates. Instead, you perform an AKS upgrade that deploys new nodes with the latest base Window Server image and patches. For AKS clusters that use Windows Server nodes, see Upgrade a node pool in AKS.

Understand how updates are applied to AKS cluster nodes running Linux:
https://docs.microsoft.com/azure/aks/node-updates-kured

How to upgrade an AKS node pool for AKS clusters that use Windows Server nodes):
https://docs.microsoft.com/azure/aks/use-multiple-node-pools#upgrade-a-node-pool

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 5.3: Deploy automated third-party software patch management solution

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3305).

**Guidance**: Implement a manual process to ensure Azure Kubernetes Service (AKS) cluster nodes' third-party applications remain patched for the duration of the cluster lifetime which may require enabling automatic updates, monitoring the nodes, or performing periodic reboots.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 5.4: Compare back-to-back vulnerability scans

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3306).

**Guidance**: Export Azure Security Center scan results at consistent intervals and compare the results to verify that vulnerabilities have been remediated. Use the PowerShell cmdlet "Get-AzSecurityTask" to automate the retrieval of security tasks that Azure Security Center recommends you to do in order to strengthen your security posture and remediation vulnerability scan findings. 

How to use PowerShell to view vulnerabilities discovered by Azure Security Center:
https://docs.microsoft.com/powershell/module/az.security/get-azsecuritytask?view=azps-3.3.0

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3307).

**Guidance**: Use the severity rating provided by Azure Security Center to prioritize the remediation of vulnerabilities. If using a built-in vulnerability assessment tool (such as Qualys or Rapid7, which are offered by Azure), use CVSS or whatever scoring systems is provided by your scanning tool.

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Inventory and Asset Management

*For more information, see [Security Control: Inventory and Asset Management](https://docs.microsoft.com/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use Azure Asset Discovery

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3308).

**Guidance**: Use Azure Resource Graph to query/discover all resources (such as compute, storage, network, etc.) within your subscription(s). Ensure that you have appropriate (read) permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use Azure Resource Manager (ARM) resources going forward.

How to create queries with Azure Graph:
https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal

How to view your Azure Subscriptions:
https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0

Understand Azure RBAC:
https://docs.microsoft.com/azure/role-based-access-control/overview

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.2: Maintain asset metadata

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3309).

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

How to create and use tags:

https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.3: Delete unauthorized Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3310).

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track assets. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

How to create additional Azure subscriptions:
https://docs.microsoft.com/azure/billing/billing-create-subscription

How to create Management Groups:
https://docs.microsoft.com/azure/governance/management-groups/create

How to create and user Tags:
https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.4: Maintain an inventory of approved Azure resources and software titles

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3311).

**Guidance**: Define list of approved Azure resources and approved software for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.5: Monitor for unapproved Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3312).

**Guidance**: Use Azure policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

Not allowed resource types
Allowed resource types

Use Azure Resource Graph to query/discover resources within your subscription(s). Ensure that all Azure resources present in the environment are approved.

How to configure and manage Azure Policy:
https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

How to create queries with Azure Graph:
https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.6: Monitor for unapproved software applications within compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3313).

**Guidance**: When deploying Azure Kubernetes Service (AKS) to a non-scale set on a Windows OS, use Azure virtual machine inventory to automate the collection of information about all software on your AKS cluster nodes which can be used to monitor for unapproved applications. Software Name, Version, Publisher, and Refresh time are available from the Azure Portal. To get access to install date and other information, enable guest-level diagnostics and bring the Windows Event Logs into a Azure Log Analytics workspace.  When deploying AKS to a scale set or Linux OS, implement your own solution to monitor nodes for unapproved software applications.

How to enable Azure virtual machine Inventory:
https://docs.microsoft.com/azure/automation/automation-tutorial-installed-software

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.7: Remove unapproved Azure resources and software applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3314).

**Guidance**: For Azure Kubernetes Service (AKS) clusters running Windows in a non-scale set, use Azure Security Center's File Integrity Monitoring (Change Tracking) and virtual machine (VM) inventory to identify all unapproved software installed on AKS cluster nodes. Implement your own process for removing the unauthorized software. For AKS clusters running Linux or deployed in a VM scale set, implement your own solution or manually monitor for and remove unapproved software applications.

How to use File Integrity Monitoring:
https://docs.microsoft.com/azure/security-center/security-center-file-integrity-monitoring#using-file-integrity-monitoring

Understand Azure Change Tracking:
https://docs.microsoft.com/azure/automation/change-tracking

How to enable Azure virtual machine inventory:
https://docs.microsoft.com/azure/automation/automation-tutorial-installed-software

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.8: Use only approved applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3315).

**Guidance**: For Azure Kubernetes Service (AKS) clusters running Windows in a non-scale set, use Azure Security Center Adaptive Application Controls to ensure that only authorized software executes and all unauthorized software is blocked from executing on Azure Virtual Machines. For AKS clusters running Linux or AKS clusters running in a scale set,  implement your own solution  to prevent unauthorized software from executing.

How to use Azure Security Center Adaptive Application Controls:
https://docs.microsoft.com/azure/security-center/security-center-adaptive-application

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 6.9: Use only approved Azure services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3316).

**Guidance**: Use Azure policy to put restrictions on the type of resources that can be created in your subscription(s) using the following built-in policy definitions:

Not allowed resource types
Allowed resource types

How to configure and manage Azure Policy:
https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

How to deny a specific resource type with Azure Policy:
https://docs.microsoft.com/azure/governance/policy/samples/not-allowed-resource-types

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.10: Implement approved application list

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3317).

**Guidance**: Create a list of applications that are approved to run on your Azure Kubernetes Service (AKS) instances. For AKS clusters running Windows in a non-scale set, use Azure Security Center Adaptive Application Controls to ensure that only authorized software executes and all unauthorized software is blocked from executing on Azure Virtual Machines. For AKS clusters running Linux or AKS clusters running in a scale set, implement your own solution to prevent unauthorized software from executing.

How to use Azure Security Center Adaptive Application Controls:
https://docs.microsoft.com/azure/security-center/security-center-adaptive-application

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 6.11: Limit users' ability to interact with Azure Resources Manager via scripts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3318).

**Guidance**: Use Azure Conditional Access to limit users' ability to interact with Azure Resource Manager (ARM) by configuring "Block access" for the "Microsoft Azure Management" App.

How to configure Conditional Access to block access to ARM:
https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.12: Limit users' ability to execute scripts within compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3319).

**Guidance**: Not available; this is not applicable to Azure Kubernetes Service (AKS) as users (non-administrators) of the clusters do not need access to the individual nodes to run jobs. The cluster administrator has root access to all cluster nodes.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.13: Physically or logically segregate high risk applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3320).

**Guidance**: Azure Kubernetes Service (AKS) provides features that let you logically isolate teams and workloads in the same cluster. The goal should be to provide the least number of privileges, scoped to the resources each team needs. A namespace in Kubernetes creates a logical isolation boundary. Additional Kubernetes features and considerations for isolation and multi-tenancy include the following areas: scheduling, networking, authentication/authorization, and containers.

Additionally, you may implement separate subscriptions and/or management groups for development, test, and production. AKS clusters should be separated by virtual network/subnet, tagged appropriately, and secured within a Web Application Firewall.

Learn about best practices for cluster isolation in AKS:
https://docs.microsoft.com/azure/aks/operator-best-practices-cluster-isolation

How to create additional Azure subscriptions:
https://docs.microsoft.com/azure/billing/billing-create-subscription

How to create Management Groups:
https://docs.microsoft.com/azure/governance/management-groups/create 

Understand best practices for network connectivity and security in AKS:
https://docs.microsoft.com/azure/aks/operator-best-practices-network

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Secure Configuration

*For more information, see [Security Control: Secure Configuration](https://docs.microsoft.com/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish secure configurations for all Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3321).

**Guidance**: Secure your Azure Kubernetes Service (AKS) cluster using pod security policies. To improve the security of your cluster, you can limit what pods can be scheduled. Pods that request resources you don't allow can't run in the AKS cluster. You define this access using pod security policies.

In addition, you may use Azure Policy aliases in the "Microsoft.ContainerService" namespace to create custom policies to audit or enforce the configuration of your AKS instances.  You may also use built-in policies. Examples of built-in policy definitions for AKS include:

Enforce HTTPS ingress in Kubernetes cluster

Authorized IP ranges should be defined on Kubernetes Services

Based Access Control (RBAC) should be used on Kubernetes Services

Ensure only allowed container images in Kubernetes cluster

How to configure and manage AKS pod security policies:

https://docs.microsoft.com/azure/aks/use-pod-security-policies

How to configure and manage Azure Policy:

https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.2: Establish secure operating system configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3322).

**Guidance**: Azure Kubernetes Service (AKS) is a secure service compliant with SOC, ISO, PCI DSS, and HIPAA standards. AKS clusters are deployed on host virtual machines, which run a security optimized OS. This host OS is currently based on an Ubuntu 16.04.LTS image with a set of additional security hardening steps applied (see Security hardening details). The goal of the security hardened host OS is to reduce the surface area of attack and allow the deployment of containers in a secure fashion.

Understand security hardening in AKS virtual machine hosts:

https://docs.microsoft.com/azure/aks/security-hardened-vm-host-image

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.3: Maintain secure Azure resource configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3323).

**Guidance**: Secure your Azure Kubernetes Service (AKS) cluster using pod security policies. To improve the security of your cluster, you can limit what pods can be scheduled. Pods that request resources you don't allow can't run in the AKS cluster. You define this access using pod security policies.

In addition, you may use Azure policy [deny] and [deploy if not exist] to enforce secure settings for the Azure resources related to your AKS deployments (such as Virtual Networks, Subnets, Azure Firewalls, Storage Accounts, etc.). You may use Azure Policy Aliases from the following namespaces to create custom policies:

Microsoft.ContainerService

Microsoft.Network

How to configure and manage Azure Policy:

https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

Understand Azure Policy Effects:

https://docs.microsoft.com/azure/governance/policy/concepts/effects

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.4: Maintain secure operating system configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3324).

**Guidance**: When you create an Azure Kubernetes Service (AKS) cluster, a control plane is automatically created and configured. This control plane is provided as a managed Azure resource abstracted from you (as the user). There's no cost for the control plane, only the nodes that are part of the AKS cluster. The managed control plane includes the 'etcd store', which is used to maintain the state of your Kubernetes cluster and configuration.

Having a managed control plane means that you don't need to configure components like a highly available etcd store, but it also means that you can't access the control plane directly. Upgrades to Kubernetes are orchestrated through the Azure CLI or Azure portal, which upgrades the control plane and then the nodes.

Secure operating system configuration is covered in detail by Azure ID 7.2; Establish secure operating system configurations.

Understand state configuration of AKS clusters:

https://docs.microsoft.com/azure/aks/concepts-clusters-workloads#control-plane

Understand security hardening in AKS virtual machine hosts:

https://docs.microsoft.com/azure/aks/security-hardened-vm-host-image

**Azure Security Center monitoring**: Yes

**Responsibility**: Microsoft

### 7.5: Securely store configuration of Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3325).

**Guidance**: If using custom Azure policy definitions, utilize Azure DevOps/Repos to securely store and manage your code.

How to store code in Azure DevOps:
https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops

Azure Repos Documentation:
https://docs.microsoft.com/azure/devops/repos/index?view=azure-devops

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.6: Securely store custom operating system images

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3326).

**Guidance**: Not available; Azure Kubernetes Service (AKS) provides a security optimized host OS by default. There is no current option to select an alternate (or custom) operating system.


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Not applicable

### 7.7: Deploy system configuration management tools

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3327).

**Guidance**: Use Azure policy [deny] and [deploy if not exist] to enforce secure settings for the Azure resources related to your Azure Kubernetes Service (AKS) deployments (such as virtual networks, subnets, Azure Firewalls, Azure Storage Accounts, etc.). You may use Azure Policy Aliases from the "Microsoft.ContainerService" namespace to create custom policies for your AKS deployments.  You may also use built-in policies. Examples of built-in policy definitions include:

Enforce HTTPS ingress in Kubernetes cluster
Authorized IP ranges should be defined on Kubernetes Services
Based Access Control (RBAC) should be used on Kubernetes Services
Ensure only allowed container images in Kubernetes cluster

How to configure and manage Azure Policy:
https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

How to create an Azure Blueprint:
https://docs.microsoft.com/azure/governance/blueprints/create-blueprint-portal

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.8: Deploy system configuration management tools for operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3328).

**Guidance**: Covered in detail by Azure ID 7.4; Maintain secure operating system configurations.

Understand state configuration of Azure Kubernetes Service (AKS) clusters:

https://docs.microsoft.com/azure/aks/concepts-clusters-workloads#control-plane

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 7.9: Implement automated configuration monitoring for Azure services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3329).

**Guidance**: Use Azure Security Center Standard Tier to perform baseline scans for resources related to your Azure Kubernetes Service (AKS) deployments. These resources might include (but are not limited to) the AKS cluster itself, the virtual network your AKS cluster has been deployed to, an Azure Storage Account that you're using to track Terraform state, or Azure Key Vault instances being used for the encryption keys for your AKS cluster's OS and data disks.

How to remediate recommendations in Azure Security Center:
https://docs.microsoft.com/azure/security-center/security-center-remediate-recommendations

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.10: Implement automated configuration monitoring for operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3330).

**Guidance**: Use Azure Security Center container recommendations under "Compute &amp; apps" to perform baseline scans for your Azure Kubernetes Service (AKS) clusters. To monitor your Azure Container Registry, ensure you're on Security Center's Standard Tier. Enable the optional Container Registries bundle. When a new image is pushed, Security Center scans the image. When configuration issues or vulnerabilities are found, you’ll be notified in the Security Center dashboard.

Understand Azure Security Center container recommendations:
https://docs.microsoft.com/azure/security-center/security-center-container-recommendations

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.11: Manage Azure secrets securely

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3331).

**Guidance**: With Azure Key Vault, you store and regularly rotate secrets such as credentials, storage account keys, or certificates. You can integrate Azure Key Vault with an Azure Kubernetes Service (AKS) cluster using a FlexVolume. The FlexVolume driver lets the AKS cluster natively retrieve credentials from Key Vault and securely provide them only to the requesting pod. Work with your cluster operator to deploy the Key Vault FlexVolume driver onto the AKS nodes. You can use a pod managed identity to request access to Key Vault and retrieve the credentials you need through the FlexVolume driver. Ensure Key Vault Soft Delete is enabled.

How to use Key Vault with your AKS cluster:

https://docs.microsoft.com/azure/aks/developer-best-practices-pod-security#limit-credential-exposure

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.12: Manage identities securely and automatically

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3332).

**Guidance**: As a best practice, do not define credentials in your application code. Use managed identities for Azure resources to let your pod request access to other resources. A digital vault, such as Azure Key Vault, should also be used to store and retrieve digital keys and credentials. Pod managed identities is intended for use with Linux pods and container images only.

A managed identity for Azure resources lets a pod authenticate itself against any service in Azure that supports it, such as Azure Key Vault. The pod is assigned an Azure Identity that lets them authenticate to Azure Active Directory and receive a digital token. This digital token can be presented to other Azure services that check if the pod is authorized to access the service and perform the required actions. This approach means that no secrets are required for database connection strings, for example.

Understand Managed Identities and Key Vault with Azure Kubernetes Service (AKS):
https://docs.microsoft.com/azure/aks/developer-best-practices-pod-security#limit-credential-exposure

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.13: Eliminate unintended credential exposure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3333).

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault. 

How to setup Credential Scanner:
https://secdevtools.azurewebsites.net/helpcredscan.html

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Malware Defense

*For more information, see [Security Control: Malware Defense](https://docs.microsoft.com/azure/security/benchmarks/security-control-malware-defense).*

### 8.1: Use centrally managed anti-malware software

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3334).

**Guidance**: For Azure Kubernetes Service (AKS) cluster nodes running Windows Server, deploy and enable Microsoft Antimalware for virtual machines. For AKS cluster nodes running Linux, you must deploy your own anti-malware solution as Microsoft Antimalware is not compatible with Linux.

How to deploy Microsoft Antimalware:
https://docs.microsoft.com/azure/security/fundamentals/antimalware

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3335).

**Guidance**: Microsoft Antimalware is enabled on the underlying host that supports Azure services (for example, Azure Kubernetes Service (AKS)), however, it does not run on your Linux compute resources. Pre-scan any files or applications being uploaded to your Linux compute or related resources.

If you're using an Azure Storage Account as a data store or to track Terraform state for your AKS cluster, you may use Azure Security Center's threat detection for data services to detect malware uploaded to storage accounts.

Understand Microsoft Antimalware for Azure Cloud Services and Virtual Machines:
https://docs.microsoft.com/azure/security/fundamentals/antimalware

Understand Azure Security Center's Threat detection for data services:
https://docs.microsoft.com/azure/security-center/security-center-alerts-data-services

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 8.3: Ensure anti-malware software and signatures are updated

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3336).

**Guidance**: If using Windows Server Azure Kubernetes Service (AKS) cluster nodes, Microsoft Antimalware will automatically install the latest signatures and engine updates by default. Follow recommendations in Azure Security Center: "Compute &amp; Apps" to ensure all endpoints are up to date with the latest signatures. For Linux, you must deploy your own anti-malware solution and ensure the engine and signatures remain up-to-date.

How to deploy Microsoft Antimalware for Azure Cloud Services and Virtual Machines:
https://docs.microsoft.com/azure/security/fundamentals/antimalware

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

## Data Recovery

*For more information, see [Security Control: Data Recovery](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure regular automated back ups

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3337).

**Guidance**: As a best practice, back up your data using an appropriate tool for your storage type, such as Velero or Azure Site Recovery. Verify the integrity, and security, of those backups. Azure Disks can use built-in snapshot technologies. You may need to look for your applications to flush writes to disk before you perform the snapshot operation. Velero can back up persistent volumes along with additional cluster resources and configurations. If you can't remove state from your applications, back up the data from persistent volumes and regularly test the restore operations to verify data integrity and the processes required.

If you use Azure Storage as your Azure Kubernetes Service (AKS) application data store, prepare and test how to migrate your storage from the primary region to the backup region. Your applications might use Azure Storage for their data. Because your applications are spread across multiple AKS clusters in different regions, you need to keep the storage synchronized.

Best practices for storage and backups in AKS:
https://docs.microsoft.com/azure/aks/operator-best-practices-storage

Best practices for business continuity and disaster recovery in AKS:
https://docs.microsoft.com/azure/aks/operator-best-practices-multi-region

Understand Azure Site Recovery:
https://docs.microsoft.com/azure/site-recovery/site-recovery-overview

How to setup Velero on Azure:
https://github.com/vmware-tanzu/velero-plugin-for-microsoft-azure/blob/master/README.md

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 9.2: Perform complete system backups and backup any customer managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3338).

**Guidance**: Enable Azure Backup and target your Azure Kubernetes Service (AKS) cluster VMs. Set the desired backup frequency and retention periods.  If applicable, ensure regular automated backups of your Key Vault Certificates, Keys, Managed Storage Accounts, and Secrets, with the following PowerShell commands:

Backup-AzKeyVaultCertificate
Backup-AzKeyVaultKey
Backup-AzKeyVaultManagedStorageAccount
Backup-AzKeyVaultSecret

Optionally, you may store your Key Vault backups within Azure Backup.

How to backup Key Vault Certificates:
https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultcertificate

How to backup Key Vault Keys:
https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey

How to backup Key Vault Managed Storage Accounts:
https://docs.microsoft.com/powershell/module/az.keyvault/add-azkeyvaultmanagedstorageaccount

How to backup Key Vault Secrets:
https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultsecret

How to enable Azure Backup:
https://docs.microsoft.com/azure/backup

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 9.3: Validate all backups including customer managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3339).

**Guidance**: Ensure ability to periodically perform data restoration of content within Azure Backup. If necessary, test restore to an isolated virtual network.

Periodically perform data restoration of your Key Vault Certificates, Keys, Managed Storage Accounts, and Secrets, with the following PowerShell commands:

Restore-AzKeyVaultCertificate
Restore-AzKeyVaultKey
Restore-AzKeyVaultManagedStorageAccount
Restore-AzKeyVaultSecret

How to restore Key Vault Certificates: 
https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultcertificate?view=azurermps-6.13.0

How to restore Key Vault Keys: 
https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultkey?view=azurermps-6.13.0 

How to restore Key Vault Managed Storage Accounts:
https://docs.microsoft.com/powershell/module/az.keyvault/backup-azkeyvaultmanagedstorageaccount

How to restore Key Vault Secrets: 
https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultsecret?view=azurermps-6.13.0

How to recover files from Azure Virtual Machine backup:
https://docs.microsoft.com/azure/backup/backup-azure-restore-files-from-vm

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.4: Ensure protection of backups and customer managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3340).

**Guidance**: On the back end, Azure Backup uses Azure Storage Service Encryption, which protects data at rest.

If Azure Key Vault is being used with your Azure Kubernetes Service (AKS) deployment(s), enable Soft-Delete in Key Vault to protect keys against accidental or malicious deletion.

Understand Azure Storage Service Encryption:
https://docs.microsoft.com/azure/storage/common/storage-service-encryption

How to enable Soft-Delete in Key Vault:
https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete?tabs=azure-portal

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Incident Response

*For more information, see [Security Control: Incident Response](https://docs.microsoft.com/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create an incident response guide

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3341).

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.

How to configure Workflow Automations within Azure Security Center:

https://docs.microsoft.com/azure/security-center/security-center-planning-and-operations-guide

Guidance on building your own security incident response process:

https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/

Microsoft Security Response Center's Anatomy of an Incident:

https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/

Customer may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan:

https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3342).

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, clearly mark subscriptions (for ex. production, non-prod) and create a naming system to clearly identify and categorize Azure resources.

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.3: Test security response procedures

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3343).

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

Refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities:

https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3344).

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that the customer's data has been accessed by an unlawful or unauthorized party.  Review incidents after the fact to ensure that issues are resolved.

How to set the Azure Security Center Security Contact:

https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3345).

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts Sentinel.

How to configure continuous export:

https://docs.microsoft.com/azure/security-center/continuous-export

How to stream alerts into Azure Sentinel:

https://docs.microsoft.com/azure/sentinel/connect-azure-security-center

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3346).

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.

How to configure Workflow Automation and Logic Apps:

https://docs.microsoft.com/azure/security-center/workflow-automation

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Penetration Tests and Red Team Exercises

*For more information, see [Security Control: Penetration Tests and Red Team Exercises](https://docs.microsoft.com/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings within 60 days

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3347).

**Guidance**: Follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies:

https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1

You can find more information on Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications, here: 

https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Next steps

- See the [Azure Security Benchmark](https://docs.microsoft.com/azure/security/benchmarks/overview)
- Learn more about [Azure Security Baselines](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview)
