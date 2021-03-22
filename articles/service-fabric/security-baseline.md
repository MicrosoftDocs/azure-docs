---
title: Azure security baseline for Service Fabric
description: The Service Fabric security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: service-fabric
ms.topic: conceptual
ms.date: 01/01/2000
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Service Fabric

This security baseline applies guidance from the [Azure Security Benchmark version1.0](../security/benchmarks/overview-v1.md) to Service Fabric. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure.The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Service Fabric. **Controls** not applicable to Service Fabric, or for which the responsibility is Microsoft's, have been excluded.

To see how Service Fabric completely maps to the Azure Security Benchmark, see the [full Service Fabric security baseline mappingfile](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](../security/benchmarks/security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24082).

**Guidance**: Ensure that all Virtual Network subnet deployments have an network security group applied with network access controls specific to your application's trusted ports and sources. 

- [Deploy Azure Firewall using a template](../firewall/deploy-template.md)

- [Create perimeter networks by using Azure Network Security Groups (NSGs)](https://docs.microsoft.com/azure/security/fundamentals/service-fabric-best-practices#use-network-isolation-and-security-with-azure-service-fabric)

- [How to integrate your Azure Service Fabric cluster with an existing virtual network](service-fabric-patterns-networking.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and NICs

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24083).

**Guidance**: Use Security Center and remediate network protection recommendations for the virtual network, subnet, and network security group being used to secure your Azure Service Fabric cluster. Enable network security group flow logs and send logs into an Azure Storage Account to traffic audit. You may also send network security groups flow logs to an Azure Log Analytics Workspace and use Azure Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Azure Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

- [How to Enable NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to Enable and use Azure Traffic Analytics](../network-watcher/traffic-analytics.md)

- [Understand Network Security provided by Azure Security Center](../security-center/security-center-network-recommendations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.3: Protect critical web applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24084).

**Guidance**: Provide a front-end gateway to provide a single point of ingress for users, devices, or other applications. Azure API Management integrates directly with Service Fabric, allowing you to secure access to back-end services, prevent DOS attacks by using throttling, and verify API keys, JWT tokens, certificates, and other credentials.

Consider deploying Azure Web Application Firewall (WAF) in front of critical web applications for additional inspection of incoming traffic. Enable Diagnostic Setting for WAF and ingest logs into a Storage Account, Event Hub, or Log Analytics Workspace.

- [Service Fabric with Azure API Management overview](service-fabric-api-management-overview.md)

- [Integrate API Management in an internal VNET with Application Gateway](../api-management/api-management-howto-integrate-internal-vnet-appgateway.md)

- [How to deploy Azure WAF](../web-application-firewall/ag/create-waf-policy-ag.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.4: Deny communications with known malicious IP addresses

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24085).

**Guidance**: For protections from DDoS attacks, enable Azure DDoS Standard protection on the virtual network where your Azure Service Fabric cluster is deployed. Use Azure Security Center integrated threat intelligence to deny communications with known malicious or unused Internet IP addresses.

- [How to configure DDoS protection](../ddos-protection/manage-ddos-protection.md)

- [Understand Azure Security Center Integrated Threat Intelligence](../security-center/azure-defender.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.5: Record network packets

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24086).

**Guidance**: Enable network security group flow logs for the network security groups attached to the subnet being used to protect your Service Fabric cluster. Record the NSG flow logs into an Azure Storage Account to generate flow records. If required for investigating anomalous activity, enable Azure Network Watcher packet capture.

- [How to Enable NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to enable Network Watcher](../network-watcher/network-watcher-create.md)

- [Use traffic analytics to visualize NSG flow logs](../network-watcher/traffic-analytics.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24087).

**Guidance**: Select an offer from the Azure Marketplace that supports IDS/IPS functionality with payload inspection capabilities.  If intrusion detection and/or prevention based on payload inspection is not a requirement, Azure Firewall with Threat Intelligence can be used. Azure Firewall Threat intelligence-based filtering can alert and deny traffic to and from known malicious IP addresses and domains. The IP addresses and domains are sourced from the Microsoft Threat Intelligence feed. 

Deploy the firewall solution of your choice at each of your organization's network boundaries to detect and/or deny malicious traffic. 

- [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/?term=Firewall) 

- [How to deploy Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md) 

- [How to configure alerts with Azure Firewall](../firewall/threat-intel.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.7: Manage traffic to web applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24088).

**Guidance**: Deploy Azure Application Gateway for web applications with HTTPS/SSL enabled for trusted certificates. 

- [How to deploy Application Gateway](../application-gateway/quick-create-portal.md)

- [How to configure Application Gateway to use HTTPS](../application-gateway/create-ssl-portal.md)

- [Understand layer 7 load balancing with Azure web application gateways](../application-gateway/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.8: Minimize complexity and administrative overhead of network security rules

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24089).

**Guidance**: Use Virtual network service tags to define network access controls on network security groups (NSG) that are attached to the subnet your Azure Service Fabric cluster is deployed in. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., ApiManagement) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

- [Virtual network service tags](../virtual-network/service-tags-overview.md)

- [Service Fabric networking best practices](service-fabric-best-practices-networking.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.9: Maintain standard security configurations for network devices

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24090).

**Guidance**: Define and implement standard security configurations for network resources related to your Azure Service Fabric cluster. Use Azure Policy aliases in the "Microsoft.ServiceFabric" and "Microsoft.Network" namespaces to create custom policies to audit or enforce the network configuration of your Azure Service Fabric cluster.

You may also use Azure Blueprints to simplify large-scale Azure deployments by packaging key environment artifacts, such as Azure Resource Manager templates, Azure RBAC controls, and policies, in a single blueprint definition. Easily apply the blueprint to new subscriptions and environments, and fine-tune control and management through versioning.

- [How to view available Azure Policy aliases](https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-4.8.0&amp;preserve-view=true)

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to create an Azure Blueprint](../governance/blueprints/create-blueprint-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.10: Document traffic configuration rules

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24091).

**Guidance**: Use tags for network security groups and other resources related to network security and traffic flow that are associated with your Service Fabric cluster. For individual network security groups rules, use the "Description" field to specify business need, duration and so on, for any rules that allow traffic to/from a network.

Use any of the built-in Azure Policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with Tags and to notify you of existing untagged resources.

You may use Azure PowerShell or Azure command-line interface (CLI) to look up or perform actions on resources based on their Tags.

- [How to create and use Tags](../azure-resource-manager/management/tag-resources.md)

- [How to create a virtual network](../virtual-network/quick-create-portal.md)

- [How to create an NSG with a Security Config](../virtual-network/tutorial-filter-network-traffic.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.11: Use automated tools to monitor network resource configurations and detect changes

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24092).

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network resources related to your Azure Service Fabric deployments. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place.

- [How to view and retrieve Azure Activity Log events](/azure/azure-monitor/platform/activity-log#view-the-activity-log)

- [How to create alerts in Azure Monitor](/azure/azure-monitor/platform/alerts-activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Logging and Monitoring

*For more information, see the [Azure Security Benchmark: Logging and Monitoring](../security/benchmarks/security-control-logging-monitoring.md).*

### 2.1: Use approved time synchronization sources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24093).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Microsoft maintains time sources for Azure Service Fabric cluster components, you may update time synchronization for your compute deployments.

- [How to configure time synchronization for Azure compute resources](../virtual-machines/windows/time-sync.md)

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

### 2.2: Configure central security log management

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24094).

**Guidance**: You can onboard your Azure Service Fabric cluster to Azure Monitor to aggregate security data generated by the cluster. See example diagnostics problems and solutions with Service Fabric.

- [Configure Azure Monitor logs integration with Service Fabric](service-fabric-diagnostics-oms-setup.md)

- [Set up Azure Monitor logs for monitoring containers in Azure Service Fabric](service-fabric-tutorial-monitoring-wincontainers.md)

- [Diagnosing common Service Fabric scenarios](service-fabric-diagnostics-common-scenarios.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.3: Enable audit logging for Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24095).

**Guidance**: Enable Azure Monitor for the Service Fabric cluster, direct it to a Log Analytics workspace. This will log relevant cluster information and OS metrics for all Azure Service Fabric cluster nodes.

- [Configure Azure Monitor logs integration with Service Fabric](service-fabric-diagnostics-oms-setup.md)

- [Set up Azure Monitor logs for monitoring containers in Azure Service Fabric](service-fabric-tutorial-monitoring-wincontainers.md)

- [How to deploy the Log Analytics agent onto your nodes](service-fabric-diagnostics-oms-agent.md)

- [Log Analytics Log Searches](/azure/azure-monitor/log-query/log-query-overview)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.4: Collect security logs from operating systems

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24096).

**Guidance**: Onboard the Azure Service Fabric cluster to Azure Monitor. Ensure that the Log Analytics workspace used has the log retention period set according to your organization's compliance regulations.

- [Configure Azure Monitor logs integration with Service Fabric](service-fabric-diagnostics-oms-setup.md)

- [Set up Azure Monitor logs for monitoring containers in Azure Service Fabric](service-fabric-tutorial-monitoring-wincontainers.md)

- [How to deploy the Log Analytics agent onto your nodes](service-fabric-diagnostics-oms-agent.md) 

- [How to configure Log Analytics Workspace Retention Period](/azure/azure-monitor/platform/manage-cost-storage)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.5: Configure security log storage retention

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24097).

**Guidance**: Onboard the Service Fabric cluster to Azure Monitor. Ensure that the Log Analytics workspace used has the log retention period set according to your organization's compliance regulations.

- [Configure Azure Monitor logs integration with Service Fabric](service-fabric-diagnostics-oms-setup.md)

- [Set up Azure Monitor logs for monitoring containers in Azure Service Fabric](service-fabric-tutorial-monitoring-wincontainers.md)

- [How to deploy the Log Analytics agent onto your nodes](service-fabric-diagnostics-oms-agent.md)

- [How to configure Log Analytics Workspace Retention Period](/azure/azure-monitor/platform/manage-cost-storage)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.6: Monitor and review logs

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24098).

**Guidance**: Use Azure Log Analytics workspace queries to query Azure Service Fabric logs.

- [Log Analytics Log Searches](/azure/azure-monitor/log-query/log-query-overview)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.7: Enable alerts for anomalous activities

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24099).

**Guidance**: Use Azure Log Analytics workspace for monitoring and alerting on anomalous activities in security logs and events related to your Azure Service Fabric cluster.

- [How to manage alerts in Azure Security Center](../security-center/security-center-managing-and-responding-alerts.md)

- [How to alert on log analytics log data](/azure/azure-monitor/learn/tutorial-response)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.8: Centralize anti-malware logging

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24100).

**Guidance**: By default, Windows Defender is installed on Windows Server 2016. Refer to your Antimaleware documentation for configuration rules if you are not using Windows Defender. Windows Defender is not supported on Linux.

- [For details, see Windows Defender antivirus on Windows Server 2016](/windows/security/threat-protection/windows-defender-antivirus/windows-defender-antivirus-on-windows-server-2016)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.9: Enable DNS query logging

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24101).

**Guidance**: Implement a third-party solution for DNS logging.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.10: Enable command-line audit logging

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24102).

**Guidance**: Manually configure console logging on a per-node basis.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24103).

**Guidance**: Maintain record of the local administrative account that is created during cluster provisioning of Azure Service Fabric cluster as well as any other accounts you create. In addition, if Azure Active Directory (Azure AD) integration is used, Azure AD has built-in roles that must be explicitly assigned and are therefore queryable. Use the Azure AD PowerShell module to perform adhoc queries to discover accounts that are members of administrative groups.

In addition, you may use Azure Security Center Identity and Access Management recommendations.

- [How to get a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0&amp;preserve-view=true)

- [How to get members of a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0&amp;preserve-view=true)

- [How to monitor identity and access with Azure Security Center](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.2: Change default passwords where applicable

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24104).

**Guidance**: When provisioning a cluster, Azure requires you to create new passwords for the web portal. There are no default passwords to change, however you can specify different passwords for web portal access.

- [Create in Azure portal](service-fabric-cluster-creation-via-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.3: Use dedicated administrative accounts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24105).

**Guidance**: Integrate Authentication for Service Fabric with Azure Active Directory (Azure AD). Create policies and procedures around the use of dedicated administrative accounts.

In addition, you may use Security Center Identity and Access Management recommendations.

- [Set up Azure AD client authentication](https://docs.microsoft.com/azure/service-fabric/service-fabric-tutorial-create-vnet-and-windows-cluster#set-up-azure-active-directory-client-authentication)

- [How to monitor identity and access with Azure Security Center](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.4: Use single sign-on (SSO) with Azure Active Directory

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24106).

**Guidance**: Wherever possible, use Azure Active Directory (Azure AD) SSO instead of configuring individual stand-alone credentials per-service. Use Security Center Identity and Access Management recommendations. 

- [Understand SSO with Azure AD](../active-directory/manage-apps/what-is-single-sign-on.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24107).

**Guidance**: Enable Azure Active Directory (Azure AD) multifactor authentication and follow Security Center Identity and Access Management recommendations.

- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

- [How to monitor identity and access within Azure Security Center](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24108).

**Guidance**: Use  Privileged Access Workstation (PAW) with multifactor authentication configured to log into and configure your Service Fabric clusters and related resources.

- [Learn about Privileged Access Workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/)

- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.7: Log and alert on suspicious activities from administrative accounts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24109).

**Guidance**: Use Azure Active Directory (Azure AD) Privileged Identity Management (PIM) for generation of logs and alerts when suspicious or unsafe activity occurs in the environment. In addition, use Azure AD risk detections to view alerts and reports on risky user behavior.

- [How to deploy Privileged Identity Management (PIM)](../active-directory/privileged-identity-management/pim-deployment-plan.md)

- [Understand Azure AD risk detections](../active-directory/identity-protection/overview-identity-protection.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.8: Manage Azure resources from only approved locations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24110).

**Guidance**: Use Conditional Access Named Locations to allow access from only specific logical groupings of IP address ranges or countries/regions. 

- [How to configure Named Locations in Azure](../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.9: Use Azure Active Directory

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24111).

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system to secure access to management endpoints of Service Fabric clusters. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.

- [How to create and configure an Azure AD instance](../active-directory/fundamentals/active-directory-access-create-new-tenant.md)

- [Setup Azure AD for Service Fabric client authentication](service-fabric-cluster-creation-setup-aad.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.ServiceFabric**:

[!INCLUDE [Resource Policy for Microsoft.ServiceFabric 3.9](../../includes/policy/standards/asb/rp-controls/microsoft.servicefabric-3-9.md)]

### 3.10: Regularly review and reconcile user access

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24112).

**Guidance**: Use Azure Active Directory (Azure AD) authentication with your Service Fabric cluster. Azure AD provides logs to help discover stale accounts. In addition, use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User's access can be reviewed on a regular basis to make sure only the right Users have continued access.

- [How to use Azure Identity Access Reviews](../active-directory/governance/access-reviews-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.11: Alert on account login behavior deviation

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24113).

**Guidance**: Use Azure Active Directory (Azure AD) Sign-in and Audit logs to monitor for attempts to access deactivated accounts; these logs can be integrated into any third-party SIEM/monitoring tool.

You can streamline this process by creating Diagnostic Settings for Azure AD user accounts, sending the audit logs and sign-in logs to a Azure Log Analytics workspace. Configure desired Alerts within Azure Log Analytics workspace.

- [How to integrate Azure Activity Logs into Azure Monitor](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.12: Alert on account sign-in behavior deviation

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24114).

**Guidance**: Use Azure Active Directory (Azure AD) Risk and Identity Protection features to configure automated responses to detected suspicious actions related to user identities. You can also ingest data into Azure Sentinel for further investigation.

- [How to view Azure AD risky sign-ins](../active-directory/identity-protection/overview-identity-protection.md)

- [How to configure and enable Identity Protection risk policies](../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24115).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not available; Customer Lockbox not yet supported for Azure Service Fabric.

- [List of Customer Lockbox supported services](https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview#supported-services-and-scenarios-in-general-availability)

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](../security/benchmarks/security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive Information

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24116).

**Guidance**: Use tags on resources related to your Service Fabric cluster deployments to assist in tracking Azure resources that store or process sensitive information.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.2: Isolate systems storing or processing sensitive information

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24117).

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. Resources should be separated by Virtual Network or subnet, tagged appropriately, and secured by an network security groups or Azure Firewall. Resources storing or processing sensitive data should be sufficiently isolated. For Virtual Machines storing or processing sensitive data, implement policy and procedures to turn them off when not in use. 

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create Management Groups](../governance/management-groups/create-management-group-portal.md)

- [How to create and use Tags](../azure-resource-manager/management/tag-resources.md)

- [How to create a Virtual Network](../virtual-network/quick-create-portal.md)

- [How to create an NSG with a Security Config](../virtual-network/tutorial-filter-network-traffic.md)

- [How to deploy Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md)

- [How to configure alert or alert and deny with Azure Firewall](../firewall/threat-intel.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.3: Monitor and block unauthorized transfer of sensitive information

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24118).

**Guidance**: Deploy an automated tool on network perimeters that monitors for unauthorized transfer of sensitive information and blocks such transfers while alerting information security professionals. 

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities. 

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.4: Encrypt all sensitive information in transit

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24119).

**Guidance**: Encrypt all sensitive information in transit. Ensure that any clients connecting to your Azure resources are able to negotiate TLS 1.2 or greater. 

For Service Fabric client-to-node mutual authentication, use a X.509 certificate for server identity and TLS encryption of http communication. Any number of additional certificates can be installed on a cluster for application security purposes, including encryption and decryption of application configuration values and data across nodes during replication.
Follow Security Center recommendations for encryption at rest and encryption in transit, where applicable. 

- [Understand encryption in transit with Azure](https://docs.microsoft.com/azure/security/fundamentals/encryption-overview#encryption-of-data-in-transit)

- [Service Fabric cluster security scenarios](service-fabric-cluster-security.md)

- [Service Fabric Troubleshooting Guide for TLS Configuration](https://github.com/Azure/Service-Fabric-Troubleshooting-Guides/blob/master/Security/TLS%20Configuration.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.5: Use an active discovery tool to identify sensitive data

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24120).

**Guidance**: Data identification, classification, and loss prevention features are not yet available for Azure Storage or compute resources. Implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.6: Use Azure RBAC to control access to resources 

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24121).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for non-compute resources designed to store data.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 4.7: Use host-based data loss prevention to enforce access control

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24122).

**Guidance**: For Service Fabric clusters storing or processing sensitive information, mark the cluster and related resources as sensitive using tags. Data identification, classification, and loss prevention features are not yet available for Azure Storage or compute resources. Implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.8: Encrypt sensitive information at rest

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24123).

**Guidance**: Use encryption at rest on all Azure resources. Microsoft recommends allowing Azure to manage your encryption keys, however there is the option for you to manage your own keys in some instances. 

- [Understand encryption at rest in Azure](../security/fundamentals/encryption-atrest.md)  

- [How to configure customer-managed encryption keys](../storage/common/customer-managed-keys-configure-key-vault.md)

- [Enable disk encryption for Azure Service Fabric cluster nodes in Windows](service-fabric-enable-azure-disk-encryption-windows.md)

- [Enable disk encryption for Azure Service Fabric cluster nodes in Linux](service-fabric-enable-azure-disk-encryption-linux.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.ServiceFabric**:

[!INCLUDE [Resource Policy for Microsoft.ServiceFabric 4.8](../../includes/policy/standards/asb/rp-controls/microsoft.servicefabric-4-8.md)]

### 4.9: Log and alert on changes to critical Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24124).

**Guidance**: Use Azure Monitor with the Azure Activity Log to create alerts for when changes take place to critical Azure resources. 

- [How to create alerts for Azure Activity Log events](/azure/azure-monitor/platform/alerts-activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Vulnerability Management

*For more information, see the [Azure Security Benchmark: Vulnerability Management](../security/benchmarks/security-control-vulnerability-management.md).*

### 5.1: Run automated vulnerability scanning tools

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24125).

**Guidance**: Regularly run the Service Fabric Fault Analysis Service and Chaos services to simulate faults throughout the cluster to assess the robustness and reliability of your services.

Follow recommendations from Security Center on performing vulnerability assessments on your Azure virtual machines and container images. 

Use a third-party solution for performing vulnerability assessments on network devices and web applications. When conducting remote scans, do not use a single, perpetual, administrative account. Consider implementing JIT provisioning methodology for the scan account. Credentials for the scan account should be protected, monitored, and used only for vulnerability scanning. 

- [Introduction to Service Fabric Fault Analysis Service](service-fabric-testability-overview.md)

- [Induce controlled Chaos in Service Fabric clusters](service-fabric-controlled-chaos.md)

- [How to implement Azure Security Center vulnerability assessment recommendations](../security-center/deploy-vulnerability-assessment-vm.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.2: Deploy automated operating system patch management solution

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24126).

**Guidance**: Enable automatic OS image upgrades on the virtual machine scale sets of your Service Fabric cluster. 

Alternately, to test OS patches first before going to
production, use the manual trigger for OS image upgrades of your scale set. Note that the manual trigger option doesn't provide  built-in rollback. Monitor OS patches using Update Management from Azure Automation. 

- [Patch management for Service Fabric cluster nodes](https://docs.microsoft.com/azure/service-fabric/service-fabric-best-practices-infrastructure-as-code#azure-virtual-machine-operating-system-automatic-upgrade-configuration)

- [Automatic OS image upgrades with Azure virtual machine scale sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md)

- [How to bring VMs up-to-date with the latest scale set model](https://docs.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-upgrade-scale-set#how-to-bring-vms-up-to-date-with-the-latest-scale-set-model)

- [Azure Automation Update Management overview](../automation/update-management/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.3: Deploy automated patch management solution for third-party software titles

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24127).

**Guidance**: Enable automatic OS image upgrades on the virtual machine scale sets of your Azure Service Fabric cluster. Patch Orchestration Application (POA) is an alternative solution that is intended for Service Fabric clusters hosted outside of Azure. POA can be used with Azure clusters, with some additional hosting overhead.

- [Patch management for Service Fabric cluster nodes](https://docs.microsoft.com/azure/service-fabric/service-fabric-best-practices-infrastructure-as-code#azure-virtual-machine-operating-system-automatic-upgrade-configuration)

- [Automatic OS image upgrades with Azure virtual machine scale sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md)

- [How to configure the OS patching schedule for Service Fabric clusters](service-fabric-patch-orchestration-application.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.4: Compare back-to-back vulnerability scans

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24128).

**Guidance**: Export scan results at consistent intervals and compare the results to verify that vulnerabilities have been remediated. When using vulnerability management recommendations suggested by Security Center, you may pivot into the selected solution's portal to view historical scan data.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24129).

**Guidance**: Use a common risk scoring program (e.g. Common Vulnerability Scoring System) or the default risk ratings provided by your third-party scanning tool.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Inventory and Asset Management

*For more information, see the [Azure Security Benchmark: Inventory and Asset Management](../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24130).

**Guidance**: Use Azure Resource Graph to query/discover all resources (such as compute, storage, network, ports, and protocols etc.) within your subscription(s). Ensure appropriate (read) permissions in your tenant and enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use Azure Resource Manager resources going forward.

- [How to create queries with Azure Resource Graph](../governance/resource-graph/first-query-portal.md)

- [How to view your Azure Subscriptions](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-4.8.0&amp;preserve-view=true)

- [Understand Azure RBAC](../role-based-access-control/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.2: Maintain asset metadata

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24131).

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.3: Delete unauthorized Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24132).

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track assets. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create Management Groups](../governance/management-groups/create-management-group-portal.md)

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.4: Define and maintain inventory of approved Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24133).

**Guidance**: Define approved Azure resources and approved software for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.5: Monitor for unapproved Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24134).

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

Not allowed resource types

Allowed resource types

Use Azure Resource Graph to query/discover resources within your subscriptions. Ensure that all Azure resources present in the environment are approved.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to create queries with Azure Graph](../governance/resource-graph/first-query-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.6: Monitor for unapproved software applications within compute resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24135).

**Guidance**: Implement a third-party solution to monitor cluster nodes for unapproved software applications.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.7: Remove unapproved Azure resources and software applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24136).

**Guidance**: Use Azure Resource Graph to query/discover all resources (such as compute, storage, network, ports, and protocols etc.), including Service Fabric clusters, within your subscriptions. Remove any unapproved Azure resources that you discover. For Service Fabric cluster nodes, implement a third-party solution to remove or alert on unapproved software.

- [How to create queries with Azure Graph](../governance/resource-graph/first-query-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.8: Use only approved applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24137).

**Guidance**: For Service Fabric cluster nodes, implement a third-party solution to prevent unauthorized software from executing.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.9: Use only approved Azure services

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24138).

**Guidance**: Use Azure Policy to restrict which services you can provision in your environment.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to deny a specific resource type with Azure Policy](https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies#general)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.10: Maintain an inventory of approved software titles

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24139).

**Guidance**: For Azure Service Fabric cluster nodes, implement a third-party solution to prevent unauthorized file types from executing.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.11: Limit users' ability to interact with Azure Resource Manager

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24140).

**Guidance**: Use Azure Conditional Access to limit users' ability to interact with Azure Resources Manager by configuring "Block access" for the "Microsoft Azure Management" App. 

- [How to configure Conditional Access to block access to Azure Resources Manager](../role-based-access-control/conditional-access-azure-management.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.12: Limit users' ability to execute scripts within compute resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24141).

**Guidance**: Use operating system specific configurations or third-party resources to limit users' ability to execute scripts within Azure compute resources.

- [For example, how to control PowerShell script execution in Windows Environments](https://docs.microsoft.com/powershell/module/microsoft.powershell.security/set-executionpolicy?view=powershell-7&amp;preserve-view=true)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.13: Physically or logically segregate high risk applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24142).

**Guidance**: Software that is required for business operations, but may incur higher risk for the organization, should be isolated within its own virtual machine and/or virtual network and sufficiently secured with either an Azure Firewall or Network Security Group. 

- [How to create a virtual network](../virtual-network/quick-create-portal.md) 

- [How to create an NSG with a Security Config](../virtual-network/tutorial-filter-network-traffic.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Secure Configuration

*For more information, see the [Azure Security Benchmark: Secure Configuration](../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24143).

**Guidance**: Use Azure Policy aliases in the "Microsoft.ServiceFabric" namespace to create custom policies to audit or enforce the network configuration of your Service Fabric cluster.

- [How to view available Azure Policy aliases](https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-4.8.0&amp;preserve-view=true)

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.2: Establish secure operating system configurations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24144).

**Guidance**: Service Fabric Operating System Images are managed and maintained by Microsoft. Customer responsible for implementing secure configurations for your cluster nodes' operating system.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.3: Maintain secure Azure resource configurations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24145).

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] effects to enforce secure settings for your Azure Service Fabric clusters and related resources.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Understand Azure Policy Effects](../governance/policy/concepts/effects.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.4: Maintain secure operating system configurations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24146).

**Guidance**: Service Fabric cluster Operating System Images managed and maintained by Microsoft. Customer is responsible for implementing OS-level state configuration.

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 7.5: Securely store configuration of Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24147).

**Guidance**: If using custom Azure Policy definitions, use Azure DevOps or Azure Repos to securely store and manage your code.

- [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops&amp;preserve-view=true)

- [Azure Repos Documentation](https://docs.microsoft.com/azure/devops/repos/?view=azure-devops&amp;preserve-view=true)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.6: Securely store custom operating system images

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24148).

**Guidance**: If using custom images, use Azure role-based access control (Azure RBAC) to ensure only authorized users may access the images. For container images, store them in Azure Container Registry and leverage Azure RBAC to ensure only authorized users may access the images. 

- [Understand Azure RBAC](../role-based-access-control/rbac-and-directory-admin-roles.md) 

- [Understand Azure RBAC for Container Registry](../container-registry/container-registry-roles.md) 

- [How to configure Azure RBAC](../role-based-access-control/quickstart-assign-role-user-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.7: Deploy configuration management tools for Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24149).

**Guidance**: Use Azure Policy aliases in the "Microsoft.ServiceFabric" namespace to create custom policies to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.8: Deploy configuration management tools for operating systems

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24150).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this guideline is intended for IaaS compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.9: Implement automated configuration monitoring for Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24151).

**Guidance**: Use Azure Policy aliases in the "Microsoft.ServiceFabric" namespace to create custom policies to audit or enforce the configuration of your Service Fabric cluster.

- [How to view available Azure Policy aliases](https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-4.8.0&amp;preserve-view=true)

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.10: Implement automated configuration monitoring for operating systems

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24152).

**Guidance**: Use Security Center to perform baseline scans for OS and Docker Settings for containers. 

- [Understand Azure Security Center container recommendations](../security-center/container-security.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.11: Manage Azure secrets securely

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24153).

**Guidance**: Use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure secret management for your cloud applications. 

- [Using managed identities for Azure with Service Fabric](concepts-managed-identity.md)

- [Configure managed identity support for a new Service Fabric cluster](configure-new-azure-service-fabric-enable-managed-identity.md)

- [Use managed identity with a Service Fabric application](how-to-managed-identity-service-fabric-app-code.md)

- [KeyVaultReference support for Service Fabric applications](service-fabric-keyvault-references.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.12: Manage identities securely and automatically

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24154).

**Guidance**: Managed identities can be used in Azure-deployed Service Fabric clusters, and for applications deployed as Azure resources. Managed Identities allows you to authenticate to any service that supports Azure Active Directory (Azure AD) authentication, including Key Vault, without any credentials in your code.

- [Using Managed identities for Azure with Service Fabric](concepts-managed-identity.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.13: Eliminate unintended credential exposure

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24155).

**Guidance**: If using any code related to your Azure Service Fabric deployment, you may implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

Use Azure Key Vault to rotate Service Fabric cluster certificates automatically.

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

- [Certificate management in Service Fabric clusters](https://docs.microsoft.com/azure/service-fabric/cluster-security-certificate-management#certificate-rotation)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Malware Defense

*For more information, see the [Azure Security Benchmark: Malware Defense](../security/benchmarks/security-control-malware-defense.md).*

### 8.1: Use centrally managed anti-malware software

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24156).

**Guidance**: By default, Windows Defender antivirus is installed on Windows Server 2016. The user interface is installed by default on some SKUs, but is not required.

Refer to your Antimalware documentation for configuration rules if you are not using Windows Defender. Windows Defender isn't supported on Linux.

- [Understand Windows Defender Antivirus on Windows Server 2016](/windows/security/threat-protection/windows-defender-antivirus/windows-defender-antivirus-on-windows-server-2016)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24157).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for
non-compute resources designed to store data.

 

Microsoft anti-malware is enabled on the underlying
host that supports Azure services (for example, Service Fabric), however it
does not run on customer content.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 8.3: Ensure anti-malware software and signatures are updated

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24158).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for
non-compute resources designed to store data.

 

Microsoft anti-malware is enabled on the underlying
host that supports Azure services (for example, Service Fabric), however it
does not run on customer content.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

## Data Recovery

*For more information, see the [Azure Security Benchmark: Data Recovery](../security/benchmarks/security-control-data-recovery.md).*

### 9.1: Ensure regular automated back ups

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24159).

**Guidance**: The Backup and Restore service in Service Fabric enables easy and automatic backup of information stored in stateful services. Backing up application data on a periodic basis is fundamental for guarding against data loss and service unavailability. Service Fabric provides an optional backup and restore service, which allows you to configure periodic backup of stateful Reliable Services (including Actor Services) without having to write any additional code. It also facilitates restoring previously taken backups.

- [Periodic backup and restore in an Azure Service Fabric cluster](service-fabric-backuprestoreservice-quickstart-azurecluster.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.2: Perform complete system backups and backup any customer-managed keys

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24160).

**Guidance**: Enable backup restore service in your Service Fabric cluster and create backup policies to back up stateful services periodically and on-demand. Backup customer-managed keys within Azure Key Vault.

- [Periodic backup and restore in an Azure Service Fabric cluster](service-fabric-backuprestoreservice-quickstart-azurecluster.md)

- [Understanding periodic backup configuration in Azure Service Fabric](service-fabric-backuprestoreservice-configure-periodic-backup.md)

- [How to backup key vault keys in Azure](https://docs.microsoft.com/powershell/module/az.keyvault/backup-azkeyvaultkey?view=azps-4.8.0&amp;preserve-view=true)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.3: Validate all backups including customer-managed keys

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24161).

**Guidance**: Ensure ability to perform restoration from the backup restore service by periodically reviewing backup configuration information and available backups. Test restoration of backed up customer-managed keys.

- [Understanding periodic backup configuration in Azure Service Fabric](service-fabric-backuprestoreservice-configure-periodic-backup.md)

- [Restoring backup in Azure Service Fabric](service-fabric-backup-restore-service-trigger-restore.md)

- [How to restore key vault keys in Azure](https://docs.microsoft.com/powershell/module/az.keyvault/restore-azkeyvaultkey?view=azps-4.8.0&amp;preserve-view=true)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.4: Ensure protection of backups and customer-managed keys

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24162).

**Guidance**: Backups from Service Fabric backup restore service use an Azure Storage account in your subscription. Azure Storage encrypts all data in a storage account at rest. By default, data is encrypted with Microsoft-managed keys. For additional control over encryption keys, you can supply customer-managed keys for encryption of storage data.

If you are using customer-managed-keys, ensure Soft-Delete in Key Vault is enabled to protect keys against accidental or malicious deletion.

- [Azure Storage encryption at rest](../storage/common/storage-service-encryption.md)

- [How to enable Soft-Delete in Key Vault](../storage/blobs/soft-delete-blob-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24163).

**Guidance**: Develop an incident response guide for your organization. Ensure there are written incident response plans that define all the roles of personnel as well as the phases of incident handling and management from detection to post-incident review. 

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/) 

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/06/27/inside-the-msrc-anatomy-of-a-ssirp-incident/) 

- [Use NIST's Computer Security Incident Handling Guide to aid in the creation of your own incident response plan](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.2: Create an incident scoring and prioritization procedure

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24164).

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, mark subscriptions using tags and create a naming system to identify and categorize Azure resources, especially those processing sensitive data.  It's your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred. 

- [Security alerts in Azure Security Center](../security-center/security-center-alerts-overview.md) 

- [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.3: Test security response procedures

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24169).

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed. 

- [NIST Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24165).

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved. 

- [How to set the Azure Security Center security contact](../security-center/security-center-provide-security-contact-details.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.5: Incorporate security alerts into your incident response system

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24166).

**Guidance**: Export your Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Security Center data connector to stream the alerts Sentinel.

- [How to configure continuous export](../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../sentinel/connect-azure-security-center.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.6: Automate the response to security alerts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24167).

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.

- [How to configure Workflow Automation and Logic Apps](../security-center/workflow-automation.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Penetration Tests and Red Team Exercises

*For more information, see the [Azure Security Benchmark: Penetration Tests and Red Team Exercises](../security/benchmarks/security-control-penetration-tests-red-team-exercises.md).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/24168).

**Guidance**: Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications. 

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1) 

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Next steps

- See the [Azure Security Benchmark V2 overview](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
