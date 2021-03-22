---
title: Azure security baseline for Azure Private Link
description: The Azure Private Link security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: private-link
ms.topic: conceptual
ms.date: 01/01/2000
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Private Link

This security baseline applies guidance from the [Azure Security Benchmark version1.0](../security/benchmarks/overview-v1.md) to Azure Private Link. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure.The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Private Link. **Controls** not applicable to Azure Private Link, or for which the responsibility is Microsoft's, have been excluded.

To see how Azure Private Link completely maps to the Azure Security Benchmark, see the [full Azure Private Link security baseline mappingfile](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](../security/benchmarks/security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18962).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Microsoft Azure Private Link. This control is intended for standalone Azure services that can be deployed or integrated into virtual networks. 

Private Link is a core Azure networking service for providing access to other Azure services over private networks, and it is not intended to be secured as a standalone resource.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Network**:

[!INCLUDE [Resource Policy for Microsoft.Network 1.1](../../includes/policy/standards/asb/rp-controls/microsoft.network-1-1.md)]

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and network interfaces

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18963).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. This control is intended for standalone Azure services that can be deployed or integrated into virtual networks. 

Private Link is a core Azure networking service for providing access to other Azure services over private networks, and it is not intended to be secured as a standalone resource.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Network**:

[!INCLUDE [Resource Policy for Microsoft.Network 1.2](../../includes/policy/standards/asb/rp-controls/microsoft.network-1-2.md)]

### 1.3: Protect critical web applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18964).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. This recommendation is intended for web applications running on Azure App Service or compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 1.4: Deny communications with known-malicious IP addresses

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18965).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. This control is intended for standalone Azure services that can be deployed or integrated into virtual networks. 

Private Link is a core Azure networking service for providing access to other Azure services over private networks, and it is not intended to be secured as a standalone resource.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Network**:

[!INCLUDE [Resource Policy for Microsoft.Network 1.4](../../includes/policy/standards/asb/rp-controls/microsoft.network-1-4.md)]

### 1.5: Record network packets

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18966).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. This control is intended for standalone Azure services that can be deployed or integrated into virtual networks. 

Private Link is a core Azure networking service for providing access to other Azure services over private networks, and it is not intended to be secured as a standalone resource.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Network**:

[!INCLUDE [Resource Policy for Microsoft.Network 1.5](../../includes/policy/standards/asb/rp-controls/microsoft.network-1-5.md)]

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18967).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. This control is intended for standalone Azure services that can be deployed or integrated into virtual networks. 

Private Link is a core Azure networking service for providing access to other Azure services over private networks, and it is not intended to be secured as a standalone resource.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 1.7: Manage traffic to web applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18968).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 1.8: Minimize complexity and administrative overhead of network security rules

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18969).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. This control is intended for standalone Azure services that can be deployed or integrated into virtual networks. 

Private Link is a core Azure networking service for providing access to other Azure services over private networks, and it is not intended to be secured as a standalone resource.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 1.9: Maintain standard security configurations for network devices

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18970).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. This control is intended for standalone Azure services that can be deployed or integrated into virtual networks. 

Private Link is a core Azure networking service for providing access to other Azure services over private networks, and it is not intended to be secured as a standalone resource.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 1.10: Document traffic configuration rules

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18971).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. This control is intended for standalone Azure services that can be deployed or integrated into virtual networks. 

Private Link is a core Azure networking service for providing access to other Azure services over private networks, and it is not intended to be secured as a standalone resource.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 1.11: Use automated tools to monitor network resource configurations and detect changes

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18972).

**Guidance**: Use the Azure Activity Log to monitor resource configurations and detect changes to your network resources related to Private Link. 

Create alerts within Azure Monitor that will trigger when changes to critical resources take place.

- [How to view and retrieve Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/essentials/activity-log#view-the-activity-log)

- [How to create alerts in Azure Monitor](../azure-monitor/alerts/alerts-activity-log.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Logging and Monitoring

*For more information, see the [Azure Security Benchmark: Logging and Monitoring](../security/benchmarks/security-control-logging-monitoring.md).*

### 2.1: Use approved time synchronization sources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18973).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. Microsoft maintains time sources for the underlying infrastructure that hosts Azure services.

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

### 2.2: Configure central security log management

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18974).

**Guidance**: Ingest logs via Azure Monitor to aggregate security data generated by network resources like Private Link endpoints, Virtual Networks, and network security groups. 

Within Azure Monitor, use Log Analytics workspaces to query and perform analytics, and use Azure Storage Accounts for long-term/archival storage.

Also, enable and on-board data to Azure Sentinel or a third-party SIEM, based on organizational business requirements.

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

- [How to collect platform logs and metrics with Azure Monitor](../azure-monitor/essentials/diagnostic-settings.md)

- [Logging and monitoring for Private Link](https://docs.microsoft.com/azure/private-link/private-link-overview#logging-and-monitoring)

- [Diagnostic logging for a network security group](../virtual-network/virtual-network-nsg-manage-log.md)

- [How to get started with Azure Monitor and third-party SIEM integration](https://azure.microsoft.com/blog/use-azure-monitor-to-integrate-with-siem-tools/)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.3: Enable audit logging for Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18975).

**Guidance**: Enable Azure Monitor activity logs, which log operations taken on Private Link resources, such as, who started the operation, when the operation occurred, the status of the operation and other useful audit information. 

- [How to collect platform logs and metrics with Azure Monitor](../azure-monitor/essentials/diagnostic-settings.md)

- [How to view and retrieve Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/essentials/activity-log#view-the-activity-log)

- [Logging and Monitoring for Private Link](https://docs.microsoft.com/azure/private-link/private-link-overview#logging-and-monitoring)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.4: Collect security logs from operating systems

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18976).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 2.5: Configure security log storage retention

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18977).

**Guidance**: For logs related to Private Link, set your Log Analytics workspace retention period according to your organization's compliance regulations within Azure Monitor. Use Azure Storage Accounts for any long-term/archival storage of logs.

- [Change the data retention period in Log Analytics](https://docs.microsoft.com/azure/azure-monitor/logs/manage-cost-storage#change-the-data-retention-period)

- [How to configure retention policy for Azure Storage account logs](https://docs.microsoft.com/azure/storage/common/manage-storage-analytics-logs#configure-logging)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.6: Monitor and review logs

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18978).

**Guidance**: Analyze and monitor logs for anomalous behavior and regularly review results. Use Azure Monitor's Log Analytics Workspace to review logs and perform queries on log data.

Another option is to enable and on-board data to Azure Sentinel or a third-party SIEM.

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

- [Understand Log Analytics Workspace](../azure-monitor/logs/log-analytics-tutorial.md)

- [How to perform custom queries in Azure Monitor](../azure-monitor/logs/get-started-queries.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.7: Enable alerts for anomalous activities

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18979).

**Guidance**: Use Security Center configured with a Log Analytics workspace for monitoring and alerting on anomalous activity found in security logs and events.

Enable and on-board data to Azure Sentinel or a third-party SIEM based on your organizational business requirements.

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

- [How to manage alerts in Azure Security Center](../security-center/security-center-managing-and-responding-alerts.md)

- [How to alert on log analytics log data](../azure-monitor/alerts/tutorial-response.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.8: Centralize anti-malware logging

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18980).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. Private Link does not process or produce anti-malware related logs.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 2.9: Enable DNS query logging

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18981).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. Implement a third-party solution from Azure Marketplace for a DNS logging solution as per your organizational business requirements.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 2.10: Enable command-line audit logging

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18982).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18983).

**Guidance**: Use Azure Active Directory (Azure AD) built-in administrator roles, which can be explicitly assigned and queried. Run the Azure AD PowerShell module to perform ad hoc queries to discover accounts that are members of administrative groups.

- [How to get a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0&amp;preserve-view=true)

- [How to get members of a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0&amp;preserve-view=true)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.2: Change default passwords where applicable

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18984).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Private Link does not have the concept of default passwords. Customers are responsible for third-party applications and marketplace services that may use default passwords.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 3.3: Use dedicated administrative accounts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18985).

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts. Use Security Center's Identity and Access Management features to monitor the number of administrative accounts.

Also, enable Just-In-Time / Just-Enough-Access by using Azure Active Directory (Azure AD) Privileged Identity Management Privileged Roles for Microsoft Services, and Azure Resource Manager.

- [Learn more about Privileged Identity Management](/azure/active-directory/privileged-identity-management/)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.4: Use Azure Active Directory single sign-on (SSO)

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18986).

**Guidance**: Wherever possible, use single sign-on with Azure Active Directory (Azure AD) rather than configuring individual stand-alone credentials per-service.

- [Single sign-on to applications in Azure AD](../active-directory/manage-apps/what-is-single-sign-on.md)

- [How to monitor identity and access within Azure Security Center](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.5: Use multi-factor authentication for all Azure Active Directory-based access

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18987).

**Guidance**: Enable Azure Active Directory (Azure AD) multifactor authentication and follow Security Center Identity and Access Management recommendations.

- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

- [How to monitor identity and access within Azure Security Center](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.6: Use secure, Azure-managed workstations for administrative tasks

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18988).

**Guidance**: Use a Privileged Access Workstation (PAW) with multifactor authentication configured to log into and configure Azure network resources.

- [Learn about Privileged Access Workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/)

- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.7: Log and alert on suspicious activities from administrative accounts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18989).

**Guidance**: Utilize Azure Active Directory (Azure AD) Risk Detections feature to view alerts and reports on risky user behavior. 

Ingest Security Center Risk Detection alerts into Azure Monitor and configure custom alerting/notifications using Action Groups.

- [Understanding Azure Security Center risk detections (suspicious activity)](../active-directory/identity-protection/overview-identity-protection.md)

- [How to integrate Azure Activity Logs into Azure Monitor](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)

- [How to configure action groups for custom alerting and notification](../azure-monitor/alerts/action-groups.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.8: Manage Azure resources from only approved locations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18990).

**Guidance**: Use Conditional Access named locations to allow access from only specific logical groupings of IP address ranges or countries/regions.

- [How to configure named locations in Azure](../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.9: Use Azure Active Directory

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18991).

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system. Azure AD protects data by using strong encryption for data at rest and in transit and also salts, hashes, and securely stores user credentials.  

- [How to create and configure an Azure AD instance](../active-directory-domain-services/tutorial-create-instance.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.10: Regularly review and reconcile user access

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18992).

**Guidance**: Azure Active Directory (Azure AD) provides logs to help discover stale accounts. Also, use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access can be reviewed on a regular basis to make sure only the right users have continued access.

- [Understand Azure AD reporting](/azure/active-directory/reports-monitoring/)

- [How to use Azure Identity Access Reviews](../active-directory/governance/access-reviews-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.11: Monitor attempts to access deactivated credentials

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18993).

**Guidance**: Use the Azure Active Directory (Azure AD) Sign-in Activity, Audit, and Risk Event log sources to integrate with any SIEM/Monitoring tool.

Streamline this process by creating Diagnostic Settings for Azure AD user accounts and sending the audit logs and sign-in logs to a Log Analytics Workspace. Configure desired Alerts within Log Analytics Workspace.

- [How to integrate Azure Activity Logs into Azure Monitor](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.12: Alert on account sign-in behavior deviation

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18994).

**Guidance**: Use Azure Active Directory (Azure AD) Risk and Identity Protection features to configure automated responses to detected suspicious actions related to user identities for your network resources. 

Ingest data into Azure Sentinel for further investigation.

- [How to view Azure AD risky sign-ins](../active-directory/identity-protection/overview-identity-protection.md)

- [How to configure and enable Identity Protection risk policies](../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18995).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. Azure Private Link does not store data. 

Microsoft support can access platform resource metadata during an open support case without usage of another tool.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](../security/benchmarks/security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive Information

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18996).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Use tags to assist in tracking Azure resources which store or process sensitive information.

- [How to create and use tags](/azure/azure-resource-manager/resource-group-using-tags)

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 4.2: Isolate systems storing or processing sensitive information

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18997).

**Guidance**: Implement isolation using separate subscriptions and management groups for individual security domains such as environment type and data sensitivity level.

Restrict the level of access to your Azure resources with your applications and enterprise environments based on business requirements.

Control access to Azure resources via Azure role-based access control (Azure AD).

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create management groups](../governance/management-groups/create-management-group-portal.md)

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.3: Monitor and block unauthorized transfer of sensitive information

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18998).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Use a third-party solution from Azure Marketplace on network perimeters that monitors for unauthorized transfer of sensitive information and blocks such transfers while alerting information security professionals.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 4.4: Encrypt all sensitive information in transit

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/18999).

**Guidance**: Encrypt all sensitive information in transit. Ensure that any clients connecting to your Azure resources in virtual networks are able to negotiate TLS 1.2 or greater. Private Link does not interfere with underlying protocols. Use best practices for other offerings used by customers.

Follow Security Center recommendations for encryption at rest and encryption in transit, where applicable.

- [Understand encryption in transit with Azure](https://docs.microsoft.com/azure/security/fundamentals/encryption-overview#encryption-of-data-in-transit)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.5: Use an active discovery tool to identify sensitive data

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19000).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Use a third third-party active discovery tool to identify all sensitive information stored, processed, or transmitted by the organization's technology systems. 

Include systems located onsite or at a remote service provider and regularly update the organization's sensitive information inventory.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 4.6: Use Azure RBAC to control access to resources 

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19001).

**Guidance**: Use Azure role-based access control (Azure RBAC) to control access to data and resources, otherwise use service-specific access control methods.

- [Familiarize yourself with a brief description and the unique ID of Azure built-in roles here](../role-based-access-control/built-in-roles.md)

Invoke PowerShell cmd "Get-AzRoleDefinition" or "az role definition list" to retrieve a list of roles in your environment.

Review your options to control the exposure of your service through "Visibility" setting. in Private Link. These visibility settings decide whether a consumer can connect to your service. 

Make your service private for consumption from your other Virtual Networks (Azure RBAC permissions only). Restrict the exposure to a limited set of trusted subscriptions, or make it public so that all Azure subscriptions can request connections on the Private Link service.

- [How to configure Azure RBAC](../role-based-access-control/role-assignments-portal.md)

- [Properties for Private Link service](private-link-service-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.7: Use host-based data loss prevention to enforce access control

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19002).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 4.8: Encrypt sensitive information at rest

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19003).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. This recommendation is intended for compute  resources which store customer data.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 4.9: Log and alert on changes to critical Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19004).

**Guidance**: Use Azure Monitor activity log alerts to create alerts for when changes take place to critical Azure resources like Private Link services and endpoints. 

- [Diagnostic logging for a network security group](https://docs.microsoft.com/azure/private-link/private-link-overview#logging-and-monitoring)

- [How to create alerts for Azure Activity Log events](../azure-monitor/alerts/alerts-activity-log.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Vulnerability Management

*For more information, see the [Azure Security Benchmark: Vulnerability Management](../security/benchmarks/security-control-vulnerability-management.md).*

### 5.1: Run automated vulnerability scanning tools

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19005).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. This recommendation is intended for compute  resources which store customer data.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 5.2: Deploy automated operating system patch management solution

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19006).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. This recommendation is intended for compute  resources which store customer data.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 5.3: Deploy automated patch management solution for third-party software titles

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19007).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. This recommendation is intended for compute  resources which store customer data.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 5.4: Compare back-to-back vulnerability scans

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19008).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. This recommendation is intended for compute  resources which store customer data.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19009).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. This recommendation is intended for compute  resources which store customer data.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

## Inventory and Asset Management

*For more information, see the [Azure Security Benchmark: Inventory and Asset Management](../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19010).

**Guidance**: Use Azure Resource Graph to query and discover all networking resources like Private Link services, and endpoints within your subscriptions.

Ensure you have appropriate (read) permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions.

- [How to create queries with Azure Graph](../governance/resource-graph/first-query-portal.md)

- [How to view your Azure Subscriptions](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-4.8.0&amp;preserve-view=true)

- [Understand Azure RBAC](../role-based-access-control/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.2: Maintain asset metadata

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19011).

**Guidance**: Apply tags to Azure resources using metadata to logically organize them into a taxonomy.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.3: Delete unauthorized Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19012).

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track Private Link and related resources. 

Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create management groups](../governance/management-groups/create-management-group-portal.md)

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.4: Define and maintain inventory of approved Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19013).

**Guidance**: Create an inventory of approved Azure resources and software for compute resources based on your organizational needs.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.5: Monitor for unapproved Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19014).

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

Also use the Azure Resource Graph to query/discover resources within the subscriptions. This can help in high security-based environments, such as those with Storage accounts.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to create queries with Azure Graph](../governance/resource-graph/first-query-portal.md)

- [Azure policy sample built-ins for private link](../governance/policy/samples/built-in-policies.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.6: Monitor for unapproved software applications within compute resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19015).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 6.7: Remove unapproved Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19016).

**Guidance**: Customer may prevent resource creation or usage with Azure Policy as required by the customer's company policies. You can implement your own process for removing unauthorized resources.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.8: Use only approved applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19017).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 6.9: Use only approved Azure services

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19018).

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:
- Not allowed resource types
- Allowed resource types

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to deny a specific resource type with Azure Policy](https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies#general)

- [Azure policy sample built-ins for private link](../governance/policy/samples/built-in-policies.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.10: Maintain an inventory of approved software titles

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19019).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 6.11: Limit users' ability to interact with Azure Resource Manager

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19020).

**Guidance**: Use Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resource Manager](../role-based-access-control/conditional-access-azure-management.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.12: Limit users' ability to execute scripts within compute resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19021).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link; this recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 6.13: Physically or logically segregate high risk applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19022).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

## Secure Configuration

*For more information, see the [Azure Security Benchmark: Secure Configuration](../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19023).

**Guidance**: Use Azure Policy aliases to create custom policies to audit or enforce the configuration of your Azure network resources along with the built-in Azure Policy definitions.

Azure Resource Manager has the ability to export the template in JavaScript Object Notation (JSON). This artifact should be reviewed to ensure that the configurations meet or exceed the security requirements for your organization.

Implement recommendations from Security Center as a secure configuration baseline for your Azure resources.

- [How to view available Azure Policy Aliases](https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-4.8.0&amp;preserve-view=true)

- [Tutorial: Create and manage policies to enforce compliance](../governance/policy/tutorials/create-and-manage.md)

- [Azure policy sample built-ins for private link](../governance/policy/samples/built-in-policies.md)

- [Single and multi-resource export to a template in Azure portal](../azure-resource-manager/templates/export-template-portal.md)

- [Security recommendations - a reference guide](../security-center/recommendations-reference.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.2: Establish secure operating system configurations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19024).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.3: Maintain secure Azure resource configurations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19025).

**Guidance**: Use Azure Resource Manager templates and Azure Policy to securely configure Azure resources associated with Private Link and related resources.  

Azure Resource Manager templates are JavaScript Object Notation (JSON) based files used to deploy Azure resources, any custom templates will need to be stored and maintained securely in a code repository. 

Use Azure policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.

- [Information on creating Azure Resource Manager templates](../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md)

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Understanding Azure Policy Effects](../governance/policy/concepts/effects.md)

- [Azure Resource Manager template samples for Private Endpoints](/azure/templates/microsoft.network/2019-11-01/privateendpoints)

- [Azure policy sample built-ins for private link](../governance/policy/samples/built-in-policies.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.4: Maintain secure operating system configurations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19026).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.5: Securely store configuration of Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19027).

**Guidance**: Use Azure DevOps to securely store and manage your code like custom Azure policies, Azure Resource Manager templates and Desired State Configuration scripts.

Grant or deny permissions to specific users, built-in security groups, or groups defined in Azure Active Directory (Azure AD) if integrated with Azure DevOps for their access, or Active Directory if integrated with Team Foundation Server.

- [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops&amp;preserve-view=true)

- [About permissions and groups in Azure DevOps](/azure/devops/organizations/security/about-permissions)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.6: Securely store custom operating system images

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19028).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.7: Deploy configuration management tools for Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19029).

**Guidance**: Define and implement standard security configurations for Azure resources using Azure Policy. 

Use Azure Policy aliases to create custom policies to audit or enforce the network configuration of your Azure resources. 

Also utilize the built-in policy definitions related to any specific resources managed under your subscriptions.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to use Aliases](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#aliases)

- [Azure policy sample built-ins for private link](../governance/policy/samples/built-in-policies.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.8: Deploy configuration management tools for operating systems

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19030).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.9: Implement automated configuration monitoring for Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19031).

**Guidance**: Use Azure Policy to audit Azure resource configurations. For example, Azure Policy can be used to detect resources, which are not configured with a private endpoint.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Azure policy sample built-ins for private link](../governance/policy/samples/built-in-policies.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.10: Implement automated configuration monitoring for operating systems

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19032).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.11: Manage Azure secrets securely

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19033).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link as it does not store data containing secrets.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.12: Manage identities securely and automatically

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19034).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. This recommendation is intended for services which need to be assigned permissions to perform actions on other Azure resources. 

Private Link resources do not take actions on other resources which would require a managed identity.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.13: Eliminate unintended credential exposure

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19035).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. This recommendation is intended for compute resources which store customer data.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

## Malware Defense

*For more information, see the [Azure Security Benchmark: Malware Defense](../security/benchmarks/security-control-malware-defense.md).*

### 8.1: Use centrally-managed anti-malware software

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19036).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19037).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link as it does not store or process files. 

Microsoft Antimalware is enabled on the underlying host that supports Azure services (for example, Private Link). However it does not run on customer content.  

- [Understand Microsoft Antimalware for Azure Cloud Services and Virtual Machines](../security/fundamentals/antimalware.md)

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 8.3: Ensure anti-malware software and signatures are updated

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19038).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Private Link. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

## Data Recovery

*For more information, see the [Azure Security Benchmark: Data Recovery](../security/benchmarks/security-control-data-recovery.md).*

### 9.1: Ensure regular automated back-ups

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19039).

**Guidance**: Use Azure Resource Manager to deploy Private Link services, endpoints, and related resources. Azure Resource Manager provides the ability to export templates, which can be used as backups to restore Private Link endpoints and related resources. 

Use Azure Automation to call the Azure Resource Manager template export API on a regular basis.

- [Overview of Azure Resource Manager](../azure-resource-manager/management/overview.md)

- [Azure Resource Manager template samples for Private Endpoints](/azure/templates/microsoft.network/2019-11-01/privateendpoints)

- [Single and multi-resource export to a template in Azure portal](../azure-resource-manager/templates/export-template-portal.md)

- [Resource Groups - Export Template](/rest/api/resources/resourcegroups/exporttemplate)

- [Introduction to Azure Automation](../automation/automation-intro.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.2: Perform complete system backups and backup any customer-managed keys

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19040).

**Guidance**: Use Azure Resource Manager to deploy Private Link services, endpoints, and related resources. Azure Resource Manager provides ability to export templates, which can be used as backups to restore Private Link endpoints and related resources.

Use Azure Automation to call the Azure Resource Manager template export API on a regular basis.

Back up customer-managed keys within Azure Key Vault.

- [Overview of Azure Resource Manager](../azure-resource-manager/management/overview.md)

- [Azure Resource Manager template samples for Private Endpoints](/azure/templates/microsoft.network/2019-11-01/privateendpoints)

- [Single and multi-resource export to a template in Azure portal](../azure-resource-manager/templates/export-template-portal.md)

- [Resource Groups - Export Template](/rest/api/resources/resourcegroups/exporttemplate)

- [Introduction to Azure Automation](../automation/automation-intro.md)

- [How to backup key vault keys in Azure](https://docs.microsoft.com/powershell/module/az.keyvault/backup-azkeyvaultkey?view=azps-4.8.0&amp;preserve-view=true)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.3: Validate all backups including customer-managed keys

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19041).

**Guidance**: Validate ability to periodically perform deployment of Azure Resource Manager templates on a regular basis to an isolated subscription per your business requirements.

Also, validate restores of backed up customer-managed keys.

- [Deploy resources with ARM templates and Azure portal](../azure-resource-manager/templates/deploy-portal.md)

- [How to restore key vault keys in Azure](https://docs.microsoft.com/powershell/module/az.keyvault/restore-azkeyvaultkey?view=azps-4.8.0&amp;preserve-view=true)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.4: Ensure protection of backups and customer-managed keys

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19042).

**Guidance**: Use Azure DevOps to securely store and manage your code like Azure Resource Manager templates.

Grant or deny permissions to specific users, built-in security groups, or groups defined in Azure Active Directory (Azure AD) if integrated with Azure DevOps for access to these resources, or in Active Directory if integrated with Team Foundation Server.

- [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops&amp;preserve-view=true)

- [About permissions and groups in Azure DevOps](/azure/devops/organizations/security/about-permissions)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19043).

**Guidance**: Build out an incident response guide for your organization. 

Ensure written incident response plans that define all roles of personnel and phases of incident handling or management from detection to post-incident review.

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/06/27/inside-the-msrc-anatomy-of-a-ssirp-incident/)

- [Customer may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.2: Create an incident scoring and prioritization procedure

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19044).

**Guidance**: Security Center assigns a severity to each alert to help prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytics used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Clearly mark subscriptions (for example, production, non-production) using tags and create a naming system to clearly identify and categorize Azure resources, especially those processing sensitive data.  

The customer is responsible to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

- [Security alerts in Azure Security Center](../security-center/security-center-alerts-overview.md)

- [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.3: Test security response procedures

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19045).

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence to help protect your Azure resources. Identify weak points and gaps and revise plan as needed.

- [NIST's publication - Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://csrc.nist.gov/publications/detail/sp/800-84/final)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19046).

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. 

Review incidents, post occurrence, to ensure that issues have been resolved.

- [How to set the Azure Security Center Security Contact](../security-center/security-center-provide-security-contact-details.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.5: Incorporate security alerts into your incident response system

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19047).

**Guidance**: Export Security Center alerts and recommendations using the Continuous Export feature to help identify risks to Azure resources. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. 

Also, use the Security Center data connector to stream the alerts to Azure Sentinel, as required per your business operations.

- [How to configure continuous export](../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../sentinel/connect-azure-security-center.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.6: Automate the response to security alerts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19048).

**Guidance**: Use the Workflow Automation feature in Security Center to automatically trigger responses with Logic Apps on security alerts and recommendations to protect your Azure resources.

- [How to configure Workflow Automation and Logic Apps](../security-center/workflow-automation.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Penetration Tests and Red Team Exercises

*For more information, see the [Azure Security Benchmark: Penetration Tests and Red Team Exercises](../security/benchmarks/security-control-penetration-tests-red-team-exercises.md).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/19049).

**Guidance**: Follow Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies. 

Use Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1)

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Next steps

- See the [Azure Security Benchmark V2 overview](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
