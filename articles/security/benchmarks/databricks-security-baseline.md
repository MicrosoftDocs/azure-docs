---
title: Azure security baseline for Azure Databricks
description: The Azure Databricks security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: azure-databricks
ms.topic: conceptual
ms.date: 01/01/2000
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Databricks

This security baseline applies guidance from the [Azure Security Benchmark version1.0](overview-v1.md) to Azure Databricks. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure.The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Databricks. **Controls** not applicable to Azure Databricks, or for which the responsibility is Microsoft's, have been excluded.

To see how Azure Databricks completely maps to the Azure Security Benchmark, see the [full Azure Databricks security baseline mappingfile](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2809).

**Guidance**: Deploy Azure Databricks in your own Azure virtual network (VNet). The default deployment of Azure Databricks is a fully managed service on Azure: all data plane resources, including a VNet that all clusters will be associated with, are deployed to a locked resource group. If you require network customization, however, you can deploy Azure Databricks data plane resources in your own virtual network (VNet injection), enabling you to implement custom network configurations. You can apply your own network security group (NSG) with custom rules to specific egress traffic restrictions.  

Additionally, you can configure NSG rules to specify egress traffic restrictions on the subnet that your Azure Databricks instance is deployed to. Azure Firewall can be configured for VNET injected workspaces. 

- [How to deploy Azure Databricks into your own Virtual Network](/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject)

- [How to manage NSGs](../../virtual-network/manage-network-security-group.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and network interfaces

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2810).

**Guidance**: Deploy Azure Databricks in your own Azure virtual network (VNet). A network security group (NSG) is not created automatically. You are required to create a baseline NSG with default Azure rules only. When you deploy a workspace, rules required by Databricks are added. You can also start with an empty NSG and the appropriate rules will be added automatically. Enable NSG flow logs and send logs into a storage account for traffic audits. You may also send flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

- [How to deploy Azure Databricks into your own Virtual Network](/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject)

- [How to Enable NSG Flow Logs](../../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to Enable and use Traffic Analytics](../../network-watcher/traffic-analytics.md)

- [How to enable Network Watcher](../../network-watcher/network-watcher-create.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.3: Protect critical web applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2811).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 1.4: Deny communications with known-malicious IP addresses

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2812).

**Guidance**: Enable Azure DDoS Protection Standard on the Azure Virtual Networks associated with your Azure Databricks instances for protection against distributed denial-of-service attacks. Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious or unused public IP addresses.

- [Manage Azure DDoS Protection Standard using the Azure portal](/azure/virtual-network/manage-ddos-protection)

- [Understand threat protection for Azure network layer in Azure Security Center](/azure/security-center/threat-protection#threat-protection-for-azure-network-layer-)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.5: Record network packets

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2813).

**Guidance**: Deploy Azure Databricks in your own Azure virtual network (VNet). A Network Security Group (NSG) is not created automatically. You are required to create a baseline NSG with default Azure rules only. When you deploy a workspace, rules required by Databricks are added. Enable NSG flow logs and send logs into a storage account for traffic audit. You may also send flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

- [How to deploy Azure Databricks into your own Virtual Network](/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject)

- [How to Enable NSG Flow Logs](../../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to Enable and use Traffic Analytics](../../network-watcher/traffic-analytics.md)

- [How to enable Network Watcher](../../network-watcher/network-watcher-create.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2814).

**Guidance**: Implement an IDP/IPS capable network virtual appliance (NVA) from the Azure Marketplace to create a virtual network-integrated workspace in which all Azure Databricks clusters have a single IP outbound address. The single IP address can be used as an additional security layer with other Azure services and applications that allow access based on specific IP addresses. You can use an Azure firewall, or other 3rd party tools like NVA, to manage ingress and egress traffic.

If intrusion detection and/or prevention based on payload inspection is not a requirement, Azure Firewall with Threat Intelligence can be used. Azure Firewall Threat intelligence-based filtering can alert and deny traffic to and from known malicious IP addresses and domains. The IP addresses and domains are sourced from the Microsoft Threat Intelligence feed.

- [How to Assign a Single Public IP for VNet-Injected Workspaces Using Azure Firewall](/azure/databricks/kb/cloud/azure-vnet-single-ip)

- [How to create an NVA](../../virtual-network/tutorial-create-route-table-portal.md)

- [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/?term=Firewall)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.7: Manage traffic to web applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2815).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 1.8: Minimize complexity and administrative overhead of network security rules

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2816).

**Guidance**: Use Service Tags to define network access controls on Network Security Groups that are attached to the Subnets your Azure Databricks instance is associated with. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., ApiManagement) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change. Service tags are not supported with non-injected VNET workspaces.

- [Understand Service Tags](../../virtual-network/service-tags-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.9: Maintain standard security configurations for network devices

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2817).

**Guidance**: Define and implement network security configurations for your Azure Databricks instances with Azure Policy. You may use Azure Policy aliases in the "Microsoft.Databricks" namespace to define custom policy definitions. Policies won’t apply to resources within the managed resource group.
 

 
You may also use Azure Blueprints to simplify large-scale Azure deployments by packaging key environment artifacts, such as Azure Resource Management templates, Role-based access control (RBAC), and policies, in a single blueprint definition. Easily apply the blueprint to new subscriptions and environments, and fine-tune control and management through versioning.
 

 
- [How to configure and manage Azure Policy](../../governance/policy/tutorials/create-and-manage.md)
 

 
- [Understand Azure Policy aliases and definition structure](../../governance/policy/concepts/definition-structure.md)
 

 
- [How to create an Azure Blueprint](../../governance/blueprints/create-blueprint-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.10: Document traffic configuration rules

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2818).

**Guidance**: Use Tags for NSGs and other resources related to network security and traffic flow that are associated with your Azure Databricks instance. For individual NSG rules, use the "Description" field to specify business need and/or duration (etc.) for any rules that allow traffic to/from a network.

- [How to create and use Tags](/azure/azure-resource-manager/resource-group-using-tags)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.11: Use automated tools to monitor network resource configurations and detect changes

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2819).

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network resources related to your Azure Databricks instances. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place.

- [How to view and retrieve Azure Activity Log events](/azure/azure-monitor/platform/activity-log-view)

- [How to create alerts in Azure Monitor](/azure/azure-monitor/platform/alerts-activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Logging and Monitoring

*For more information, see the [Azure Security Benchmark: Logging and Monitoring](security-control-logging-monitoring.md).*

### 2.1: Use approved time synchronization sources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2820).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Microsoft maintains time sources for Azure resources, however, you have the option to manage the time synchronization settings for your compute resources. Since Azure Databricks is a PaaS service, you do not have direct access to the VMs in an Azure Databricks cluster and cannot set up time synchronization settings.

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

### 2.2: Configure central security log management

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2821).

**Guidance**: Ingest logs via Azure Monitor to aggregate security data generated by Azure Databricks. Within Azure Monitor, you are able to query the Log Analytics workspace which is configured to receive your Databricks and diagnostic logs. Use Azure Storage Accounts for long-term/archival log storage or event hubs for exporting data to other systems. Alternatively, you may enable, and on-board data to Azure Sentinel or a third-party Security Incident and Event Management (SIEM).

Note: Azure Databricks diagnostic logs require the Azure Databricks Premium Plan

- [How to configure diagnostic settings](/azure/azure-monitor/platform/diagnostic-settings)

- [How to onboard Azure Sentinel](../../sentinel/quickstart-onboard.md)

- [How to get started with Azure Monitor and third-party SIEM integration](https://azure.microsoft.com/blog/use-azure-monitor-to-integrate-with-siem-tools/)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.3: Enable audit logging for Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2822).

**Guidance**: Enable Azure Activity log diagnostic settings and send the logs to a Log Analytics workspace, Azure event hub, or Azure storage account for archive. Using Azure Activity Log data, you can determine the "what, who, and when" for any write operations (PUT, POST, DELETE) performed at the control plane level for your Azure resources.

For audit logging, Azure Databricks provides comprehensive end-to-end diagnostic logs of activities performed by Azure Databricks users, allowing your enterprise to monitor detailed Azure Databricks usage patterns.

Note: that Azure Databricks diagnostic logs require the Azure Databricks Premium Plan

- [How to enable Diagnostic Settings for Azure Activity Log](/azure/azure-monitor/platform/activity-log)

- [How to enable Diagnostic Settings for Azure Databricks](/azure/databricks/administration-guide/account-settings/azure-diagnostic-logs)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.4: Collect security logs from operating systems

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2823).

**Guidance**: Azure Databricks provides comprehensive end-to-end diagnostic logs of activities performed by Azure Databricks users, allowing your enterprise to monitor detailed Azure Databricks usage patterns.

Note: Azure Databricks diagnostic logs require the Azure Databricks Premium Plan. OS security logging is not available.

- [How to enable Diagnostic Settings for Azure Activity Log](/azure/azure-monitor/platform/activity-log)

- [How to enable Diagnostic Settings for Azure Databricks](/azure/databricks/administration-guide/account-settings/azure-diagnostic-logs)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.5: Configure security log storage retention

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2824).

**Guidance**: Enable diagnostic settings for Azure Databricks. If choosing to store logs in a Log Analytics Workspace, set your Log Analytics Workspace retention period according to your organization's compliance regulations. Use Azure Storage Accounts for long-term/archival storage. Security-related activities are tracked in Databricks audit logs.

Note: Azure Databricks diagnostic logs require the Azure Databricks Premium Plan

- [How to enable diagnostic settings in Azure Databricks](/azure/databricks/administration-guide/account-settings/azure-diagnostic-logs)

- [How to set log retention parameters for Log Analytics Workspaces](/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.6: Monitor and review logs

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2825).

**Guidance**: Enable diagnostic settings for Azure Databricks and send logs to a Log Analytics workspace. Use the Log Analytics workspace to analyze and monitor your Azure Databricks logs for anomalous behavior and regularly review results.

Alternatively, you may enable and on-board data to Azure Sentinel or a third-party SIEM. 
 

Note: Azure Databricks diagnostic logs require the Azure Databricks Premium Plan

- [How to enable diagnostic settings in Azure Databricks](/azure/databricks/administration-guide/account-settings/azure-diagnostic-logs)

- [How to query Azure Databricks logs sent to Log Analytics Workspace](/azure/databricks/administration-guide/account-settings/azure-diagnostic-logs#analyze-diagnostic-logs)

- [How to onboard Azure Sentinel](../../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.7: Enable alerts for anomalous activities

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2826).

**Guidance**: Configure diagnostic settings for your Azure Databricks instance and send the logs to Log Analytics workspace. In your Log Analytics workspace, configure alerts to take place when a pre-defined set of conditions takes place.
 

Alternatively, you may enable and on-board data to Azure Sentinel or a third-party SIEM.
 

 

Note: Azure Databricks diagnostic logs require the Azure Databricks Premium Plan

- [How to send Azure Databricks logs to Log Analytics Workspace](/azure/databricks/administration-guide/account-settings/azure-diagnostic-logs#configure-diagnostic-log-delivery))

- [How to configure alerts in Log Analytics Workspace](/azure/azure-monitor/platform/alerts-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.8: Centralize anti-malware logging

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2827).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 2.9: Enable DNS query logging

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2828).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Azure Databricks does not process or produce user accessible DNS-related logs.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 2.10: Enable command-line audit logging

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2829).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2830).

**Guidance**: You can use Azure Databricks SCIM APIs to manage users in an Azure Databricks workspace and grant administrative privileges to designated users. You can also manage them through the Azure Databricks UI. 

- [How to use the SCIM APIs ](/azure/databricks/dev-tools/api/latest/scim/) 

- [How to add and removes users in Azure Databricks](/azure/databricks/administration-guide/users-groups/users)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.2: Change default passwords where applicable

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2831).

**Guidance**: Azure Databricks uses Azure Active Directory (Azure AD) to provide access to the Azure portal as well as the Azure Databricks admin console. Azure AD does not have the concept of default passwords, however, you are responsible to change or not permit default passwords for any custom or third-party applications.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.3: Use dedicated administrative accounts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2832).

**Guidance**: You can use Azure Databricks SCIM APIs to add users with admin privileges in an Azure Databricks. You can also manage them through the Azure Databricks UI. 

- [How to use the SCIM APIs](/azure/databricks/dev-tools/api/latest/scim/) 

- [How to add and removes users in Azure Databricks](/azure/databricks/administration-guide/users-groups/users)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.4: Use Azure Active Directory single sign-on (SSO)

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2833).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Azure Databricks is automatically set up to use Azure Active Directory (Azure AD) single sign-on to authenticate users. Users outside of your organization must complete the invitation process and be added to your Active Directory tenant before they are able to log in to Azure Databricks via single sign-on. You can implement SCIM to automate provisioning and de-provisioning users from workspaces.
 

How to use the SCIM APIs
/azure/databricks/dev-tools/api/latest/scim/

- [Understand single sign-on for Azure Databricks](/azure/databricks/administration-guide/users-groups/single-sign-on/)

- [How to invite users to your Azure AD tenant](../../role-based-access-control/role-assignments-external-users.md)

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

### 3.5: Use multi-factor authentication for all Azure Active Directory-based access

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2834).

**Guidance**: Enable Azure Active Directory (Azure AD) multifactor authentication and follow Azure Security Center Identity and Access Management recommendations.

- [How to enable multifactor authentication in Azure](../../active-directory/authentication/howto-mfa-getstarted.md)

- [How to monitor identity and access within Azure Security Center](../../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.6: Use secure, Azure-managed workstations for administrative tasks

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2835).

**Guidance**: Use PAWs (privileged access workstations) with multifactor authentication configured to log into and configure Azure resources.  

 
- [Learn about Privileged Access Workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/) 

 
- [How to enable multifactor authentication in Azure](../../active-directory/authentication/howto-mfa-getstarted.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.7: Log and alert on suspicious activities from administrative accounts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2836).

**Guidance**: Use Azure Active Directory (Azure AD) security reports for the generation of logs and alerts when suspicious or unsafe activity occurs in the environment. Use Azure Security Center to monitor identity and access activity. In addition, you can leverage the Azure Databricks diagnostic logs.

- [How to identify Azure AD users flagged for risky activity](/azure/active-directory/reports-monitoring/concept-user-at-risk)

- [How to monitor users' identity and access activity in Azure Security Center](../../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.8: Manage Azure resources from only approved locations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2837).

**Guidance**: Use Conditional Access Named Locations to allow access from only specific logical groupings of IP address ranges or countries/regions.

- [How to configure Named Locations in Azure](../../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.9: Use Azure Active Directory

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2838).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Azure Databricks is automatically setup to use Azure Active Directory (Azure AD) single sign-on to authenticate users. Users outside of your organization
 must complete the invitation process and be added to your Azure AD tenant before they are able to log in to Azure Databricks via 
single sign-on.
 

Understand single sign-on for Azure 
- [Databricks](/azure/databricks/administration-guide/users-groups/single-sign-on)
 

How
- [ to invite users to your Azure AD tenant](../../role-based-access-control/role-assignments-external-users.md)

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

### 3.10: Regularly review and reconcile user access

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2839).

**Guidance**: Azure Active Directory (Azure AD) provides logs to help discover stale accounts. In addition, use Azure identity access reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access can be reviewed on a regular basis to make sure only the right Users have continued access. You can also implement SCIM APIs and Azure Databricks diagnostic logs to review user access. You can also use SCIM APIs and Azure Databricks diagnostic logs to review user access.

In addition, regularly review and manage user access within the Azure Databricks admin console.

- [Azure AD Reporting](/azure/active-directory/reports-monitoring/)

- [How to use Azure identity access reviews](../../active-directory/governance/access-reviews-overview.md)

- [How to manage user access within the Azure Databricks admin console](/azure/databricks/administration-guide/users-groups/users)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.11: Monitor attempts to access deactivated credentials

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2840).

**Guidance**: You have access to Azure Active Directory (Azure AD) Sign-in Activity, Audit and Risk Event log sources, which allow you to integrate with any SIEM/Monitoring tool. Additionally, you can use Azure Databricks diagnostic logs to review user access activity.

You can streamline this process by creating Diagnostic Settings for Azure AD user accounts and sending the audit logs and sign-in logs to a Log Analytics Workspace. You can configure desired Alerts within Log Analytics Workspace.

- [How to use SCIM APIs](/azure/databricks/dev-tools/api/latest/scim/)

- [How to integrate Azure Activity Logs into Azure Monitor](/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.12: Alert on account sign-in behavior deviation

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2841).

**Guidance**: Use Azure Active Directory (Azure AD) Risk and Identity Protection features to configure automated responses to detected suspicious actions related to user identities. You can also ingest data into Azure Sentinel for further investigation. Additionally, you can use Azure Databricks diagnostic logs to review user access activity.

- [How to view Azure AD risky sign-ins](/azure/active-directory/reports-monitoring/concept-risky-sign-ins)

- [How to configure and enable Identity Protection risk policies](../../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)

- [How to onboard Azure Sentinel](../../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2842).

**Guidance**: When support tickets are open, Customer Service and Support engineers will ask for consent to access relevant customer data.

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive Information

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2843).

**Guidance**: Use Tags to assist in tracking Azure Databricks instances that process sensitive information. 

- [How to create and use Tags](/azure/azure-resource-manager/resource-group-using-tags)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.2: Isolate systems storing or processing sensitive information

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2844).

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. The default deployment of Azure Databricks is a fully managed service that is deployed within its own virtual network. If you require network customization, you can deploy Azure Databricks in your own virtual network. It is a best practice is to create separate Azure Databricks workspaces for different business teams or departments.

- [How to deploy Azure Databricks into your own Virtual Network](/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject)

- [How to create additional Azure subscriptions](/azure/billing/billing-create-subscription)

- [How to create Management Groups](/azure/governance/management-groups/create)

- [How to create a Virtual Network](../../virtual-network/quick-create-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.3: Monitor and block unauthorized transfer of sensitive information

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2845).

**Guidance**: Follow Databricks’ exfiltration protection architecture to mitigate the possibility of data exfiltration. 

Microsoft
 manages the underlying infrastructure for Azure Databricks and has 
implemented strict controls to prevent the loss or exposure of customer 
data.

- [Data Exfiltration Protection with Azure Databricks](https://databricks.com/blog/2020/03/27/data-exfiltration-protection-with-azure-databricks.html) 

- [Understand customer data protection in Azure](../fundamentals/protection-customer-data.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.4: Encrypt all sensitive information in transit

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2846).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Microsoft will negotiate TLS 1.2 by default when administering your Azure Databricks instance through the Azure portal or Azure Databricks console. Databricks Web App supports TLS 1.3.

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

### 4.5: Use an active discovery tool to identify sensitive data

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2847).

**Guidance**: Currently not available; data identification, classification, and loss prevention features are not currently available for Azure Databricks. Tag Azure Databricks instances and related resources that may be processing sensitive information as such and implement third-party solution if required for compliance purposes.

The Databricks platform is compute-only, and all the data is stored on other Azure data services. For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](../fundamentals/protection-customer-data.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.6: Use Role-based access control to control access to resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2848).

**Guidance**: In Azure Databricks, you can use access control lists (ACLs) to configure permission to access data tables, clusters, pools, jobs, and workspace objects like notebooks, experiments, and folders. All admin users can manage access control lists, as can users who have been given delegated permissions to manage access control lists. You can use Azure RBAC for setting permissions on the Azure Databricks workspace.

Note: Table, cluster, pool, job, and workspace access control are available only in the Azure Databricks Premium Plan

- [How to manage access control in Azure Databricks](/azure/databricks/administration-guide/access-control/)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.7: Use host-based data loss prevention to enforce access control

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2849).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for compute resources.

Microsoft
 manages the underlying infrastructure for Azure Databricks and has 
implemented strict controls to prevent the loss or exposure of customer 
data.

- [Understand customer data protection in Azure](../fundamentals/protection-customer-data.md)

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 4.8: Encrypt sensitive information at rest

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2850).

**Guidance**: An Azure Databricks workspace comprises a management plane that is hosted in an Azure Databricks managed virtual network and a data plane that is deployed in a customer-managed virtual network. The control plane stores all users’ notebooks and associated notebook results in a database. By default, all notebooks and results are encrypted at rest with a different encryption key.

Databricks File System (DBFS) is a distributed file system mounted into an Azure Databricks workspace and available on Azure Databricks clusters. DBFS is implemented as a Storage Account in your Azure Databricks workspace’s managed resource group. By default, the storage account is encrypted with Microsoft-managed keys. Your data is stored in the Azure data services that you own, and you have the choice to encrypt it. The use of DBFS to store production data is not recommended

Note: These features are not available for all Azure Databricks subscriptions. Contact your Microsoft or Databricks account representative to request access.

- [How to enable customer-managed keys for Azure Databricks notebooks](/azure/databricks/security/customer-managed-key-notebook)

- [How to enable customer-managed keys for Azure Databricks File System](/azure/databricks/security/customer-managed-keys-dbfs)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.9: Log and alert on changes to critical Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2851).

**Guidance**: Use Azure Monitor with the Azure Activity Log to create alerts for when changes take place to critical Azure Databricks workspaces.

- [How to create alerts for Azure Activity Log events](/azure/azure-monitor/platform/alerts-activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Vulnerability Management

*For more information, see the [Azure Security Benchmark: Vulnerability Management](security-control-vulnerability-management.md).*

### 5.1: Run automated vulnerability scanning tools

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2852).

**Guidance**: Implement a third-party vulnerability management solution.

If you have a vulnerability 
management platform subscription, you may use Azure Databricks initialization scripts to install vulnerability assessment agents on your Azure Databricks cluster nodes and manage the nodes through the respective portal. Note that every third-party solution works differently. 

- [How to Install Rapid7 Agent Manually](https://insightagent.help.rapid7.com/docs/install)

- [How to install Qualys Agent Manually](https://www.qualys.com/docs/qualys-cloud-agent-linux-install-guide.pdf)

- [Azure Databricks initialization scripts](/azure/databricks/clusters/init-scripts)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.2: Deploy automated operating system patch management solution

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2853).

**Guidance**: Microsoft maintains the Azure Databricks cluster node base images, however, you are responsible for ensuring that your cluster nodes remain patched. To add a maintenance update to an existing running cluster, you must restart the cluster. 

 
- [Understand Runtime maintenance updates for Azure Databricks](/azure/databricks/release-notes/runtime/maintenance-updates)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.3: Deploy automated patch management solution for third-party software titles

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2854).

**Guidance**: Microsoft maintains the Azure Databricks cluster node base images, 
however you are responsible for ensuring that any third-party applications you install remain patched.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.4: Compare back-to-back vulnerability scans

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2855).

**Guidance**: Implement a third-party vulnerability management solution that has the ability to compare vulnerability scans over time. If you have a vulnerability management subscription, you may use that vendor's portal to view and compare back-to-back vulnerability scans. Note that every third-party solution works differently.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2856).

**Guidance**: Use a common risk scoring program (e.g. Common Vulnerability Scoring System) or the default risk ratings provided by your third-party scanning tool.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Inventory and Asset Management

*For more information, see the [Azure Security Benchmark: Inventory and Asset Management](security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2857).

**Guidance**: Use Azure Resource Graph to query/discover all resources (such as compute, storage, network, ports, and protocols etc.) within your subscription(s). Ensure appropriate (read) permissions exist in your tenant and enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use Azure Resource Manager resources going forward.

- [How to create queries with Azure Resource Graph](../../governance/resource-graph/first-query-portal.md)

- [How to view your Azure Subscriptions](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-4.8.0&amp;preserve-view=true)

- [Understanding Azure RBAC](../../role-based-access-control/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.2: Maintain asset metadata

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2858).

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

- [How to create and use Tags](/azure/azure-resource-manager/resource-group-using-tags)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.3: Delete unauthorized Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2859).

**Guidance**: Use tagging, management groups, and separate subscriptions, where 
appropriate, to organize and track Azure resources. Reconcile inventory 
on a regular basis and ensure unauthorized resources are deleted from 
the subscription in a timely manner.

In addition, use Azure 
policy to put restrictions on the type of resources that can be created 
in customer subscription(s) using the following built-in policy 
definitions:

- Not allowed resource types
- Allowed resource types

Additional information is available at the referenced links.

- [How to create additional Azure subscriptions](/azure/billing/billing-create-subscription)

- [How to create Management Groups](/azure/governance/management-groups/create)

- [How to create and use Tags](/azure/azure-resource-manager/resource-group-using-tags)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.4: Define and maintain inventory of approved Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2860).

**Guidance**: Define approved Azure resources and approved software for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.5: Monitor for unapproved Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2861).

**Guidance**: Use Azure policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

Additional information is available at the referenced links.

Use Azure Resource Graph to query/discover resources within their subscription(s). Ensure that all Azure resources present in the environment are approved.

- [How to configure and manage Azure Policy](../../governance/policy/tutorials/create-and-manage.md)

- [How to create queries with Azure Graph](../../governance/resource-graph/first-query-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.6: Monitor for unapproved software applications within compute resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2862).

**Guidance**: Not applicable; Azure Databricks is a PaaS service, customers do not have direct access to the VMs in an Azure Databricks cluster.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.7: Remove unapproved Azure resources and software applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2863).

**Guidance**: Use Azure Resource Graph to query/discover all resources (such as 
compute, storage, network, ports, and protocols etc.), including Azure 
Databricks instances, within your subscription(s).  Remove any unapproved 
Azure resources that you discover. For Azure Databricks cluster nodes, 
implement a third-party solution to remove or alert on unapproved 
software.

- [How to create queries with Azure Graph](../../governance/resource-graph/first-query-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.8: Use only approved applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2864).

**Guidance**: Not applicable; Azure Databricks is a PaaS service, you do not have direct access to the VMs in an Azure Databricks cluster.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.9: Use only approved Azure services

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2865).

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

- Not allowed resource types
- Allowed resource types

Additional information is available at the referenced links.

- [How to configure and manage Azure Policy](../../governance/policy/tutorials/create-and-manage.md)

- [How to deny a specific resource type with Azure Policy](https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies#general)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.10: Maintain an inventory of approved software titles

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2866).

**Guidance**: Not applicable; Azure Databricks is a PaaS service, you do not have direct access to the VMs in an Azure Databricks cluster.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.11: Limit users' ability to interact with Azure Resource Manager

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2867).

**Guidance**: Use Azure Conditional Access to limit users' ability to interact 
with Azure Resource Manager by configuring "Block access" for the 
"Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resource Manager](../../role-based-access-control/conditional-access-azure-management.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.12: Limit users' ability to execute scripts within compute resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2868).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this is not applicable to Azure Databricks as users 
(non-administrators) of the cluster do not need access to the individual
 nodes to run jobs. The cluster administrator has root access to all 
cluster nodes by default.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 6.13: Physically or logically segregate high risk applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2869).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; benchmark is intended for Azure Apps Service or compute resources hosting web applications.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

## Secure Configuration

*For more information, see the [Azure Security Benchmark: Secure Configuration](security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2870).

**Guidance**: Define and implement standard security configurations for your Azure Databricks instances with Azure Policy. Use Azure Policy aliases in the  "Microsoft.Databricks" namespace to create custom policies to audit or enforce the configuration of your Azure Databricks instances. Note that any policies applied do not work on the Databricks Managed Resource Group. 

 
- [How to view available Azure Policy Aliases](/powershell/module/az.resources/get-azpolicyalias) 

 
- [How to configure and manage Azure Policy](../../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.2: Establish secure operating system configurations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2871).

**Guidance**: Not applicable; Azure Databricks is a PaaS service, you do not have direct access to the VMs in an Azure Databricks cluster.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.3: Maintain secure Azure resource configurations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2872).

**Guidance**: Define and implement standard security configurations for your Azure 
Databricks instances with Azure Policy. Use Azure Policy aliases in the 
"Microsoft.Databricks" namespace to create custom policies to audit or enforce 
the configuration of your Azure Databricks instances. Use Azure policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.

- [How to configure and manage Azure Policy](../../governance/policy/tutorials/create-and-manage.md)

- [Understand Azure Policy Effects](../../governance/policy/concepts/effects.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.4: Maintain secure operating system configurations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2873).

**Guidance**: Azure Databricks operating system Images managed and maintained by Microsoft. You are responsible for implementing OS-level state configuration.

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 7.5: Securely store configuration of Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2874).

**Guidance**: If using custom Azure policy definitions, use Azure DevOps or Azure Repos to securely store and manage your code.

- [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops&amp;preserve-view=true)

- [Azure Repos Documentation](https://docs.microsoft.com/azure/devops/repos/?view=azure-devops&amp;preserve-view=true)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.6: Securely store custom operating system images

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2875).

**Guidance**: If using custom images for your Azure Databricks cluster nodes, push your custom base image to a Docker registry such as Azure Container Registry (ACR).

- [How to customize containers with Databricks Container Services](/azure/databricks/clusters/custom-containers)

- [Understand Azure Container Registry](../../container-registry/container-registry-intro.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.7: Deploy configuration management tools for Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2876).

**Guidance**: Define and implement standard security configurations for your Azure Databricks instances with Azure Policy. Use Azure Policy aliases in the "Microsoft.Databricks" namespace to create custom policies to audit or enforce the configuration of your Azure Databricks instances.

- [How to configure and manage Azure Policy](../../governance/policy/tutorials/create-and-manage.md)

- [How to view available Azure Policy Aliases](/powershell/module/az.resources/get-azpolicyalias?view=azps-4.8.0&amp;preserve-view=true)

- [How to configure and manage Azure Policy](../../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.8: Deploy configuration management tools for operating systems

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2877).

**Guidance**: Not applicable; Azure Databricks is a PaaS service, you do not have direct access to the VMs in an Azure Databricks cluster.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.9: Implement automated configuration monitoring for Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2878).

**Guidance**: Define and implement standard security configurations for your Azure 
Databricks instances with Azure Policy. Use Azure Policy aliases in the 
"Microsoft.Databricks" namespace to create custom policies to audit or enforce 
the configuration of your Azure Databricks instances.

How
- [ to view available Azure Policy Aliases](/powershell/module/az.resources/get-azpolicyalias?view=azps-4.8.0&amp;preserve-view=true)

- [How to configure and manage Azure Policy](../../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.10: Implement automated configuration monitoring for operating systems

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2879).

**Guidance**: Implement a third-party solution to monitor the state of your Azure Databricks cluster node operating systems.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.11: Manage Azure secrets securely

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2880).

**Guidance**: Use Azure Key Vault with an Azure Databricks secret scope to securely manage and use secrets.

- [How to use Azure Key Vault with Azure Databricks](/azure/azure-databricks/store-secrets-azure-key-vault)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.12: Manage identities securely and automatically

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2881).

**Guidance**: Currently not available; Managed Identities are currently not available for Azure Databricks

- [Services that support managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/services-support-managed-identities.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.13: Eliminate unintended credential exposure

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2882).

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault. 

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Malware Defense

*For more information, see the [Azure Security Benchmark: Malware Defense](security-control-malware-defense.md).*

### 8.1: Use centrally-managed anti-malware software

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2883).

**Guidance**: If you have a vulnerability management platform subscription, you may use Azure Databricks initialization scripts to install vulnerability assessment agents on your Azure Databricks cluster nodes and manage the nodes through the respective portal. Note that every third-party solution works differently. 

- [How to Install Rapid7 Agent Manually](https://insightagent.help.rapid7.com/docs/install) 

- [How to install Qualys Agent Manually](https://www.qualys.com/docs/qualys-cloud-agent-linux-install-guide.pdf) 

- [Azure Databricks initialization scripts](/azure/databricks/clusters/init-scripts)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2884).

**Guidance**: Microsoft Antimalware is enabled on the underlying host that supports Azure services (for example, Azure App Service), however it does not run on your content.

Pre-scan any files being uploaded to your Azure Databricks cluster nodes or related resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 8.3: Ensure anti-malware software and signatures are updated

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2885).

**Guidance**: If you have a vulnerability management platform subscription, you may use Azure Databricks initialization scripts to install vulnerability assessment agents on your Azure Databricks cluster nodes and manage the nodes through the respective portal. Note that every third-party solution works differently. 

- [How to Install Rapid7 Agent Manually](https://insightagent.help.rapid7.com/docs/install) 

- [How to install Qualys Agent Manually](https://www.qualys.com/docs/qualys-cloud-agent-linux-install-guide.pdf) 

- [Azure Databricks initialization scripts](/azure/databricks/clusters/init-scripts)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Recovery

*For more information, see the [Azure Security Benchmark: Data Recovery](security-control-data-recovery.md).*

### 9.1: Ensure regular automated back-ups

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2886).

**Guidance**: For your Azure Databricks data sources, ensure you have configured an appropriate level of data redundancy for your use case. For example, if using an Azure Storage account for your Azure Databricks data 
store, choose the appropriate redundancy option (LRS, ZRS, GRS, RA-GRS). 

- [Data sources for Azure Databricks](/azure/azure-databricks/databricks-connect-to-data-sources#data-sources-for-azure-databricks)

- [Regional disaster recovery for Azure Databricks clusters](/azure/azure-databricks/howto-regional-disaster-recovery)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.2: Perform complete system backups and backup any customer-managed keys

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2887).

**Guidance**: Back up any customer-managed keys related to your Azure Databricks implementations in Azure Key Vault. You can also use REST API and CLI to create a daily backup of Databricks configurations.
 

- [How to backup key vault keys in Azure](https://docs.microsoft.com/powershell/module/az.keyvault/backup-azkeyvaultkey?view=azps-4.8.0&amp;preserve-view=true)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.3: Validate all backups including customer-managed keys

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2888).

**Guidance**: Test restoration of backed up customer-managed keys related to your Azure Databricks implementations.

- [How to restore key vault keys in Azure](https://docs.microsoft.com/powershell/module/az.keyvault/restore-azkeyvaultkey?view=azps-4.8.0&amp;preserve-view=true)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.4: Ensure protection of backups and customer-managed keys

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2889).

**Guidance**: Ensure Soft-Delete is enabled in Key Vault to protect keys against accidental or malicious deletion.

- [How to enable Soft-Delete in Key Vault](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete?tabs=azure-portal)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](security-control-incident-response.md).*

### 10.1: Create an incident response guide

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2890).

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.

- [How to configure Workflow Automations within Azure Security Center](../../security-center/security-center-planning-and-operations-guide.md)

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [You may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.2: Create an incident scoring and prioritization procedure

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2891).

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytics used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

 

Additionally, clearly mark subscriptions (for ex. production, non-prod) and create a naming system to clearly identify and categorize Azure resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.3: Test security response procedures

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2896).

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

- [Refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.4: Provide security incident contact details and configure alert notifications  for security incidents

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2892).

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that the customer data has been accessed by an unlawful or unauthorized party.  Review incidents after the fact to ensure that issues are resolved.

- [How to set the Azure Security Center Security Contact](../../security-center/security-center-provide-security-contact-details.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.5: Incorporate security alerts into your incident response system

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2893).

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts Sentinel.

- [How to configure continuous export](../../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../../sentinel/connect-azure-security-center.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.6: Automate the response to security alerts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2894).

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.

- [How to configure Workflow Automation and Logic Apps](../../security-center/workflow-automation.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Penetration Tests and Red Team Exercises

*For more information, see the [Azure Security Benchmark: Penetration Tests and Red Team Exercises](security-control-penetration-tests-red-team-exercises.md).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/2895).

**Guidance**: Follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies. You can find more information on Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and application. 

 
- [Microsoft Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1)
 

- [You can find more information on Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications, here](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Next steps

- See the [Azure Security Benchmark V2 overview](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
