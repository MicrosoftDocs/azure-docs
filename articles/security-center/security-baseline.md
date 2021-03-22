---
title: Azure security baseline for Security Center
description: The Security Center security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: security-center
ms.topic: conceptual
ms.date: 01/01/2000
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Security Center

This security baseline applies guidance from the [Azure Security Benchmark version1.0](../security/benchmarks/overview-v1.md) to Azure Security Center. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure.The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Security Center. **Controls** not applicable to Azure Security Center, or for which the responsibility is Microsoft's, have been excluded.

To see how Azure Security Center completely maps to the Azure Security Benchmark, see the [full Azure Security Center security baseline mappingfile](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](../security/benchmarks/security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13651).

**Guidance**: Azure Security Center is a core Azure offering. You cannot associate a virtual network, subnet, or network security group directly to Security Center. If you enable data collection for your compute resources then Security Center stores the data it collects via a Log Analytics workspace, you can configure that workspace to use Private Link for access to your workspace data over a private endpoint in your virtual network. Also, if using data collection Security Center relies on the Log Analytics agent being deployed to your servers to collect security data and provide protection to these compute resources. The Log Analytics agent requires specific ports and protocols to be opened for proper operation with Security Center. Lock down your networks to only allow these required ports and protocols and only add additional rules that your application requires to operate via network security groups.

- [Data collection in Azure Security Center](security-center-enable-data-collection.md)

- [Filter network traffic with a network security group](../virtual-network/tutorial-filter-network-traffic.md)

- [Firewall requirements for using the Log Analytics agent](/azure/azure-monitor/platform/log-analytics-agent#firewall-requirements)

- [Understand Azure Private Link](../private-link/private-link-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Security**:

[!INCLUDE [Resource Policy for Microsoft.Security 1.1](../../includes/policy/standards/asb/rp-controls/microsoft.security-1-1.md)]

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and NICs

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13652).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Azure Security Center is a core Azure offering. You cannot associate a virtual network, subnet, or network security group directly to Security Center.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 1.3: Protect critical web applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13653).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 1.4: Deny communications with known malicious IP addresses 

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13654).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Azure Security Center is a core Azure offering. You cannot associate a virtual network, subnet, or network security group directly to Security Center.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Security**:

[!INCLUDE [Resource Policy for Microsoft.Security 1.4](../../includes/policy/standards/asb/rp-controls/microsoft.security-1-4.md)]

### 1.5: Record network packets

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13655).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Azure Security Center is a core Azure offering. You cannot associate a virtual network, subnet, or network security group directly to Security Center.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 1.6: Deploy network based intrusion detection/intrusion prevention systems (IDS/IPS)

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13656).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Azure Security Center is a core Azure offering. You cannot associate a virtual network, subnet, or network security group directly to Security Center.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 1.7: Manage traffic to web applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13657).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 1.8: Minimize complexity and administrative overhead of network security rules

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13658).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 1.9: Maintain standard security configurations for network devices

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13659).

**Guidance**: The Azure Security Center offering does not directly integrate with a virtual network but it can collect data from servers configured with the Log Analytics agent which are deployed on your networks. Your servers that are configured to send data to Security Center require certain ports and protocols to be allowed to communicate properly. Define and enforce standard security configurations for these network resources with Azure Policy.

You can also use Azure Blueprints to simplify large-scale Azure deployments by packaging key environment artifacts, such as Azure Resource Manager templates, role assignments, and Azure Policy assignments, in a single blueprint definition. You can apply the blueprint to new subscriptions to deploy Security Center configurations and related networking resources consistently and securely.

- [Data collection in Azure Security Center](security-center-enable-data-collection.md)

- [Firewall requirements for using the Log Analytics agent](/azure/azure-monitor/platform/log-analytics-agent#firewall-requirements)

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md) 

- [Azure Policy samples for networking](https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies#network)

- [How to create an Azure Blueprint](../governance/blueprints/create-blueprint-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.10: Document traffic configuration rules

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13660).

**Guidance**: The Azure Security Center offering does not directly integrate with a virtual network but it can collect data from servers configured with the Log Analytics agent which are deployed on your networks. Your servers that are configured to send data to Security Center require certain ports and protocols to be allowed to communicate properly. Define and enforce standard security configurations for these network resources with Azure Policy.

Use resource tags for network security groups and other resources like servers on your networks that are configured to send security logs to Azure Security Center. For individual network security group rules, use the "Description" field to document the rules that allow traffic to/from a network. 

Use any of the built-in Azure Policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with tags and to notify you of existing untagged resources.

You can use Azure PowerShell or Azure CLI to look up or perform actions on resources based on their tags. 

- [Data collection in Azure Security Center](security-center-enable-data-collection.md)

- [Firewall requirements for using the Log Analytics agent](/azure/azure-monitor/platform/log-analytics-agent#firewall-requirements)

- [How to create and use tags](/azure/azure-resource-manager/resource-group-using-tags) 

- [How to create an Azure Virtual Network](../virtual-network/quick-create-portal.md) 

- [How to filter network traffic with network security group rules](../virtual-network/tutorial-filter-network-traffic.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.11: Use automated tools to monitor network resource configurations and detect changes

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13661).

**Guidance**: Use Azure Activity log to monitor resource configurations and detect changes for network resources related to Azure Security Center. Create alerts in Azure Monitor to notify you when changes to critical resources take place.

- [How to view and retrieve Azure Activity log events](/azure/azure-monitor/platform/activity-log-view) 

- [How to create alerts in Azure Monitor](/azure/azure-monitor/platform/alerts-activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Logging and Monitoring

*For more information, see the [Azure Security Benchmark: Logging and Monitoring](../security/benchmarks/security-control-logging-monitoring.md).*

### 2.1: Use approved time synchronization sources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13662).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Microsoft maintains the time source used for Azure Security Center.

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

### 2.2: Configure central security log management

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13663).

**Guidance**: Aggregate security data generated by Azure Security Center and its connected sources using a central Log Analytics workspace. 

Configure Security Center's data collection to send security data and events from your connected Azure compute resources to a central Log Analytics workspace. In addition to data collection, use the continuous export feature to stream security alerts and recommendations generated by Security Center to your central Log Analytics workspace. In Azure Monitor, you can query and perform analytics on the security data generated from Security Center and your connected Azure resources. 

Alternatively, you can send data produced by Security Center to Azure Sentinel or a third-party SIEM.

- [Export security alerts and recommendations](continuous-export.md)

- [Data collection in Azure Security Center](security-center-enable-data-collection.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md) 

- [How to collect platform logs and metrics with Azure Monitor](/azure/azure-monitor/platform/diagnostic-settings) 

- [How to collect Azure Virtual Machine internal host logs with Azure Monitor](/azure/azure-monitor/learn/quick-collect-azurevm)

- [How to get started with Azure Monitor and third-party SIEM integration](https://azure.microsoft.com/blog/use-azure-monitor-to-integrate-with-siem-tools/)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Security**:

[!INCLUDE [Resource Policy for Microsoft.Security 2.2](../../includes/policy/standards/asb/rp-controls/microsoft.security-2-2.md)]

### 2.3: Enable audit logging for Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13664).

**Guidance**: Azure Monitor Activity logs are automatically available, these logs contain all write operations for your resource like Azure Security Center including what operations were made, who started the operation, and when they occurred. Send your Azure Activity logs to a Log Analytics workspace for log consolidation and increased retention.

- [How to collect platform logs and metrics with Azure Monitor](/azure/azure-monitor/platform/diagnostic-settings) 

- [Understand logging and different log types in Azure](/azure/azure-monitor/platform/platform-logs-overview)

- [Send Activity logs to a Log Analytics workspace](/azure/azure-monitor/platform/activity-log#send-to-log-analytics-workspace)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.4: Collect security logs from operating systems

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13665).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Azure Security Center is a core Azure offering and does not expose its underlying infrastructure such as the operating system. The underlying infrastructure for the service is handled by Microsoft.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Security**:

[!INCLUDE [Resource Policy for Microsoft.Security 2.4](../../includes/policy/standards/asb/rp-controls/microsoft.security-2-4.md)]

### 2.5: Configure security log storage retention

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13666).

**Guidance**: In Azure Monitor, set your Log Analytics workspace retention period according to your organization's compliance regulations. Use Azure Storage accounts for long-term and archival storage. 

- [Change the data retention period in Log Analytics](/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period) 

- [How to configure retention policy for Azure Storage account logs](/azure/storage/common/storage-monitor-storage-account#configure-logging)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.6: Monitor and review logs

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13667).

**Guidance**: Analyze and monitor logs produced by Azure Security Center and its connected sources for anomalous behavior and regularly review the results. Use Azure Monitor and a Log Analytics workspace to review logs and perform queries on log data.

Alternatively, you can enable and on-board data to Azure Sentinel or a third-party SIEM. 

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md) 

- [Getting started with Log Analytics queries](/azure/azure-monitor/log-query/get-started-portal) 

- [How to perform custom queries in Azure Monitor](/azure/azure-monitor/log-query/get-started-queries)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.7: Enable alerts for anomalous activities

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13668).

**Guidance**: Configure Azure Monitor log alerts to query for unwanted or anomalous activities that are recorded by your activity log or the data produced by Azure Security Center. Set up Action Groups so that your organization is notified and can take action if a log alert is initiated for anomalous activity. Use Security Center workflow automation feature to trigger logic apps on security alerts and recommendations. Security Center workflows can be used to notify users for incident response, or take actions to remediate resources based on the alert information.

Alternatively, you can enable and on-board data related to and produced by Azure Security Center to Azure Sentinel. Azure Sentinel supports playbooks that allow for automated threat responses to security-related issues.

- [Azure Security Center workflow automation](workflow-automation.md)

- [How to manage alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) 

- [How to alert on log analytics log data](/azure/azure-monitor/learn/tutorial-response)

- [Set up automated threat responses in Azure Sentinel](../sentinel/tutorial-respond-threats-playbook.md)

- [Log alerts in Azure Monitor](/azure/azure-monitor/platform/alerts-unified-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.8: Centralize anti-malware logging

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13669).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Azure Security Center is a core Azure offering and does not expose its underlying infrastructure for the installation of of anti-malware related software. The underlying infrastructure for the service is handled by Microsoft. Azure Security Center can be used to deploy Microsoft anti-malware or other endpoint protection onto virtual machines you have deployed in Azure.

- [Azure Security Center's endpoint protection solutions](https://docs.microsoft.com/azure/security-center/security-center-services?tabs=features-windows#supported-endpoint-protection-solutions-)

**Responsibility**: Not applicable

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Security**:

[!INCLUDE [Resource Policy for Microsoft.Security 2.8](../../includes/policy/standards/asb/rp-controls/microsoft.security-2-8.md)]

### 2.9: Enable DNS query logging

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13670).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Azure Security Center is a core Azure offering and there is no native capability to monitor DNS queries to this offering. Implement a third-party solution from Azure Marketplace for DNS logging solution as per your organizations need.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 2.10: Enable command-line audit logging

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13671).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Azure Security Center is a core Azure offering and does not expose its underlying infrastructure for enabling command-line auditing. The underlying infrastructure for the service is handled by Microsoft.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13672).

**Guidance**: Azure role-based access control (Azure RBAC) allows you to manage access to Azure resources through role assignments. You can assign these roles to users, groups service principals and managed identities. There are pre-defined built-in roles for certain resources, and these roles can be inventoried or queried through tools such as Azure CLI, Azure PowerShell or the Azure portal. Azure Security Center has built-in roles for 'Security Reader' or 'Security Admin' which allows users to read or update security policies and dismiss alerts and recommendations.

- [Permissions in Azure Security Center](security-center-permissions.md)

- [How to get a directory role in Azure Active Directory (Azure AD) with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0&amp;preserve-view=true)

- [How to get members of a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0&amp;preserve-view=true)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Security**:

[!INCLUDE [Resource Policy for Microsoft.Security 3.1](../../includes/policy/standards/asb/rp-controls/microsoft.security-3-1.md)]

### 3.2: Change default passwords where applicable

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13673).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Azure Security Center does not have the concept of default passwords. Other Azure resources requiring a password forces a password to be created with complexity requirements and a minimum password length, which differs depending on the service. You are responsible for third-party applications and marketplace services that may use default passwords.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 3.3: Use dedicated administrative accounts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13674).

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts for the Azure Platform or specific to the Azure Security Center offering. Use Azure Security Center Identity and Access Management to monitor the number of administrative accounts in Azure Active Directory (Azure AD). Security Center also has built-in roles for 'Security Admin' which allows users to update security policies and dismiss alerts and recommendations, ensure you review and reconcile any users who have this role assignment on a regular basis.

Additionally, to help you keep track of dedicated administrative accounts, you may use recommendations from Azure Security Center or built-in Azure Policies, such as:
- There should be more than one owner assigned to your subscription
- Deprecated accounts with owner permissions should be removed from your subscription
- External accounts with owner permissions should be removed from your subscription

- [Permissions in Azure Security Center](security-center-permissions.md)

- [How to use Azure Security Center to monitor identity and access (Preview)](security-center-identity-access.md)

- [How to use Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Security**:

[!INCLUDE [Resource Policy for Microsoft.Security 3.3](../../includes/policy/standards/asb/rp-controls/microsoft.security-3-3.md)]

### 3.4: Use single sign-on (SSO) with Azure Active Directory

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13675).

**Guidance**: Wherever possible, use Azure Active Directory (Azure AD) SSO instead of configuring individual stand-alone credentials per-service. Use Azure Security Center identity and access recommendations.

- [Understand SSO with Azure AD](../active-directory/manage-apps/what-is-single-sign-on.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13676).

**Guidance**: Enable Azure Active Directory (Azure AD) multifactor authentication for accessing Azure Security Center and the Azure portal, follow any Security Center identity and access recommendations.

- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

- [How to monitor identity and access within Azure Security Center](security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Security**:

[!INCLUDE [Resource Policy for Microsoft.Security 3.5](../../includes/policy/standards/asb/rp-controls/microsoft.security-3-5.md)]

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13677).

**Guidance**: Use a secure, Azure-managed workstation (also known as a Privileged Access Workstation, or PAW) for administrative tasks that require elevated privileges.

- [Understand secure, Azure-managed workstations](/azure/active-directory/devices/concept-azure-managed-workstation)

- [How to enable Azure Active Directory (Azure AD) multifactor authentication](../active-directory/authentication/howto-mfa-getstarted.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.7: Log and alert on suspicious activities from administrative accounts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13678).

**Guidance**: Use Azure Active Directory (Azure AD) security reports and monitoring to detect when suspicious or unsafe activity occurs in the environment. Use Azure Security Center to monitor identity and access activity.

- [How to identify Azure AD users flagged for risky activity](/azure/active-directory/reports-monitoring/concept-user-at-risk)

- [How to monitor users' identity and access activity in Azure Security Center](security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.8: Manage Azure resources from only approved locations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13679).

**Guidance**: Use Azure Active Directory (Azure AD) named locations to allow access only from specific logical groupings of IP address ranges or countries/regions.

- [How to configure Azure AD named locations](../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.9: Use Azure Active Directory

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13680).

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system when using Azure Security Center. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials. Azure Security Center has built-in roles that are assignable like 'Security Admin' which allows users to update security policies and dismiss alerts and recommendations.

- [Permissions in Azure Security Center](security-center-permissions.md)

- [How to create and configure an Azure AD instance](../active-directory/fundamentals/active-directory-access-create-new-tenant.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.10: Regularly review and reconcile user access

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13681).

**Guidance**: Azure Active Directory (Azure AD) provides logs to help discover stale accounts. In addition, use Azure AD identity and access reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access related to Azure Security Center can be reviewed on a regular basis to make sure only the right users have continued access.

- [Understand Azure AD reporting](/azure/active-directory/reports-monitoring/)

- [How to use Azure AD identity and access reviews](../active-directory/governance/access-reviews-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Security**:

[!INCLUDE [Resource Policy for Microsoft.Security 3.10](../../includes/policy/standards/asb/rp-controls/microsoft.security-3-10.md)]

### 3.11: Monitor attempts to access deactivated credentials

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13682).

**Guidance**: You have access to Azure Active Directory (Azure AD) sign-in activity, audit, and risk event log sources, which allow you to integrate with any SIEM/monitoring tool.

You can streamline this process by creating diagnostic settings for Azure AD user accounts and sending the audit logs and sign-in logs to a Log Analytics workspace. You can configure desired alerts within Log Analytics workspace.

- [How to integrate Azure activity logs with Azure Monitor](/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.12: Alert on account login behavior deviation 

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13683).

**Guidance**: Use Azure Active Directory (Azure AD) Identity Protection features to configure automated responses to detected suspicious actions related to user identities. You can also ingest data into Azure Sentinel for further investigation.

- [How to view Azure AD risky sign-ins](/azure/active-directory/reports-monitoring/concept-risky-sign-ins)

- [How to configure and enable Identity Protection risk policies](../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13684).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Currently not available; Customer Lockbox is not yet supported for Azure Security Center or Log Analytics workspaces.

- [List of Customer Lockbox-supported services](https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview#supported-services-and-scenarios-in-general-availability)

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](../security/benchmarks/security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive Information

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13685).

**Guidance**: Use tags to assist in tracking Azure resources like the Log Analytics workspace which stores sensitive security information from Azure Security Center.

- [How to create and use tags](/azure/azure-resource-manager/resource-group-using-tags)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Security**:

[!INCLUDE [Resource Policy for Microsoft.Security 4.1](../../includes/policy/standards/asb/rp-controls/microsoft.security-4-1.md)]

### 4.2: Isolate systems storing or processing sensitive information

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13686).

**Guidance**: Implement isolation using separate subscriptions and management groups for individual security domains such as environment type and data sensitivity level. You can restrict the level of access to your Azure resources that your applications and enterprise environments demand. You can control access to Azure resources via Azure Active Directory (Azure AD) RBAC.

By default Azure Security Center data is stored in the Security Center backend service. If your organization has added requirements to store this data in your own resources you can configure a Log Analytics workspace to store Security Center data, alerts, and recommendations. When using your own workspace you can add further separation by configuring different workspaces according to which environment the data originated in.

- [Export security alerts and recommendations](continuous-export.md)

- [Data collection in Azure Security Center](security-center-enable-data-collection.md)

- [How to create additional Azure subscriptions](/azure/billing/billing-create-subscription)

- [How to create management groups](/azure/governance/management-groups/create)

- [How to create and use tags](/azure/azure-resource-manager/resource-group-using-tags)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.3: Monitor and block unauthorized transfer of sensitive information

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13687).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Microsoft manages the underlying infrastructure for Azure Security Center and Log Analytics workspaces, Microsoft implements strict controls to prevent the loss or exposure of customer data via the underlying infrastructure.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

### 4.4: Encrypt all sensitive information in transit

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13688).

**Guidance**: Encrypt all sensitive information in transit. Ensure that any clients connecting to your Azure resources are able to negotiate TLS 1.2 or greater. Any virtual machines that are configured with the Log Analytics agent and to send data to Azure Security center should be configured to use TLS 1.2.

Follow Azure Security Center recommendations for encryption at rest and encryption in transit, where applicable. 

- [Sending data securely to Log Analytics](/azure/azure-monitor/platform/data-security#sending-data-securely-using-tls-12)

- [Understand encryption in transit with Azure](https://docs.microsoft.com/azure/security/fundamentals/encryption-overview#encryption-of-data-in-transit)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.5: Use an active discovery tool to identify sensitive data

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13689).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Azure Security Center uses a Log Analytics workspace for data retention. Data identification, classification, and loss prevention features are not yet available in Azure.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Not applicable

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Security**:

[!INCLUDE [Resource Policy for Microsoft.Security 4.5](../../includes/policy/standards/asb/rp-controls/microsoft.security-4-5.md)]

### 4.6: Use Azure role-based access controls to control access to resources 

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13690).

**Guidance**: Use Azure role-based access control (Azure RBAC) to manage access to Azure Security Center related data and resources. Azure Security Center has built-in roles for 'Security Reader' or 'Security Admin' which allows users to read or update security policies and dismiss alerts and recommendations. The Log Analytics workspace that stores the data collected by Security Center also has built-in roles you can assign like 'Log Analytics Reader', 'Log Analytics Contributor', and others. Assign the least permissive role needed for users to complete their required tasks. For example, assign the Reader role to users who only need to view information about the security health of a resource but not take action, such as applying recommendations or editing policies.

- [Permissions for Azure Log Analytics workspace](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#log-analytics-reader)

- [Permissions in Azure Security Center](security-center-permissions.md)

- [How to configure Azure RBAC](../role-based-access-control/role-assignments-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.7: Use host-based data loss prevention to enforce access control

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13691).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for compute resources. Microsoft manages the underlying infrastructure for Azure Security Center and has implemented strict controls to prevent the loss or exposure of customer data.

- [Azure customer data protection](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 4.8: Encrypt sensitive information at rest

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13692).

**Guidance**: Azure Security Center uses a configured Log Analytics workspace to store the data, alerts, and recommendations it generates. Configure a customer-managed key (CMK) for the workspace that you have configured for Security Center data collection. CMK enables all data saved or sent to the workspace to be encrypted with an Azure Key Vault key created and owned by you. 

- [Azure Monitor customer-managed key](/azure/azure-monitor/platform/customer-managed-keys)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Security**:

[!INCLUDE [Resource Policy for Microsoft.Security 4.8](../../includes/policy/standards/asb/rp-controls/microsoft.security-4-8.md)]

### 4.9: Log and alert on changes to critical Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13693).

**Guidance**: Use Azure Monitor to create alerts when changes take place to critical Azure resources related to Azure Security Center. These changes may include any actions that modify configurations related to security center like the disabling of alerts or recommendations, or the update or deletion of data stores.

- [How to create alerts for Azure Activity log events](/azure/azure-monitor/platform/alerts-activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Vulnerability Management

*For more information, see the [Azure Security Benchmark: Vulnerability Management](../security/benchmarks/security-control-vulnerability-management.md).*

### 5.1: Run automated vulnerability scanning tools

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13694).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Azure Security Center is a core Azure offering and does not expose its underlying infrastructure for the configuration of vulnerability scanning tools.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Security**:

[!INCLUDE [Resource Policy for Microsoft.Security 5.1](../../includes/policy/standards/asb/rp-controls/microsoft.security-5-1.md)]

### 5.2: Deploy automated operating system patch management solution

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13695).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Azure Security Center is a core Azure offering and does not expose its underlying infrastructure for configuration.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Security**:

[!INCLUDE [Resource Policy for Microsoft.Security 5.2](../../includes/policy/standards/asb/rp-controls/microsoft.security-5-2.md)]

### 5.3: Deploy automated patch management solution for third-party software titles

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13696).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Azure Security Center is a core Azure offering and does not expose its underlying infrastructure for configuration.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 5.4: Compare back-to-back vulnerability scans

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13697).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Azure Security Center is a core Azure offering and does not expose its underlying infrastructure for configuration.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13698).

**Guidance**: Use a common risk scoring program (for example, Common Vulnerability Scoring System) or the default risk ratings provided by your third-party scanning tool.

- [NIST Publication--Common Vulnerability Scoring System](https://www.nist.gov/publications/common-vulnerability-scoring-system)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Security**:

[!INCLUDE [Resource Policy for Microsoft.Security 5.5](../../includes/policy/standards/asb/rp-controls/microsoft.security-5-5.md)]

## Inventory and Asset Management

*For more information, see the [Azure Security Benchmark: Inventory and Asset Management](../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13699).

**Guidance**: Use Azure Resource Graph to query for and discover all resources related to Azure Security Center in your subscriptions. Ensure appropriate (read) permissions in your tenant and enumerate all Azure subscriptions to discover Security Center resources.

- [How to create queries with Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md)

- [How to view your Azure subscriptions](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-4.8.0&amp;preserve-view=true)

- [Understand Azure RBAC](../role-based-access-control/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.2: Maintain asset metadata

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13700).

**Guidance**: Use tags to assist in tracking Azure resources like the Log Analytics workspace which stores sensitive security information from Azure Security Center.

- [How to create and use tags](/azure/azure-resource-manager/resource-group-using-tags)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.3: Delete unauthorized Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13701).

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track Azure Security Center resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

In addition, use Azure policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:

- Not allowed resource types
- Allowed resource types

- [How to create additional Azure subscriptions](/azure/billing/billing-create-subscription)

- [How to create Management Groups](/azure/governance/management-groups/create)

- [How to create and use Tags](/azure/azure-resource-manager/resource-group-using-tags)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.4: Define and maintain inventory of approved Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13702).

**Guidance**: Create an inventory of approved Azure resources and approved software for compute resources as per your organizational needs.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.5: Monitor for unapproved Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13703).

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in your subscriptions. 

Use Azure Resource Graph to query for and discover resources within their subscriptions.  Ensure that all Azure resources present in the environment are approved. 

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md) 

- [How to create queries with Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.6: Monitor for unapproved software applications within compute resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13704).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Azure Security Center is a core Azure offering and does not expose its underlying infrastructure for configuration.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 6.7: Remove unapproved Azure resources and software applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13705).

**Guidance**: Remove Azure resources related to Azure Security Center when they are no longer needed as part of your organization's inventory and review process.

- [Azure resource group and resource deletion](../azure-resource-manager/management/delete-resource-group.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.8: Use only approved applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13706).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Azure Security Center is a core Azure offering and does not expose its underlying infrastructure for configuration.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Security**:

[!INCLUDE [Resource Policy for Microsoft.Security 6.8](../../includes/policy/standards/asb/rp-controls/microsoft.security-6-8.md)]

### 6.9: Use only approved Azure services

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13707).

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in your subscriptions using the following built-in policy definitions:
- Not allowed resource types
- Allowed resource types

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to deny a specific resource type with Azure Policy](https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies#general)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.10: Maintain an inventory of approved software titles

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13708).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Azure Security Center is a core Azure offering and does not expose its underlying infrastructure for configuration.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Security**:

[!INCLUDE [Resource Policy for Microsoft.Security 6.10](../../includes/policy/standards/asb/rp-controls/microsoft.security-6-10.md)]

### 6.11: Limit users' ability to interact with Azure Resource Manager

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13709).

**Guidance**: Configure Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resource Manager](../role-based-access-control/conditional-access-azure-management.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.12: Limit users' ability to execute scripts within compute resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13710).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Azure Security Center is a core Azure offering and does not expose its underlying infrastructure for configuration.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 6.13: Physically or logically segregate high risk applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13711).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; This recommendation is intended for Azure offerings that can host applications.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

## Secure Configuration

*For more information, see the [Azure Security Benchmark: Secure Configuration](../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13712).

**Guidance**: Define and implement standard security configurations for Azure Security Center and its connected workspace via Azure Policy. Use Azure Policy aliases in the "Microsoft.OperationalInsights" and "Microsoft.Security" namespaces to create custom Azure Policy definitions to audit or enforce the configuration of Security Center and its Log Analytics workspace.

- [How to view available Azure Policy Aliases](https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-4.8.0&amp;preserve-view=true)

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.2: Establish secure operating system configurations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13713).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Azure Security Center is a core Azure offering and does not expose its underlying infrastructure for configuration.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.3: Maintain secure Azure resource configurations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13714).

**Guidance**: Use Azure Policy effects for 'deny' and 'deploy if not exist' to enforce secure settings across your Azure resources. In addition, you can use Azure Resource Manager templates to maintain the security configuration of your Azure resources required by your organization. 

- [Understand Azure Policy effects](../governance/policy/concepts/effects.md) 

- [Create and manage policies to enforce compliance](../governance/policy/tutorials/create-and-manage.md) 

- [Azure Resource Manager templates overview](../azure-resource-manager/templates/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.4: Maintain secure operating system configurations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13715).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Azure Security Center is a core Azure offering and does not expose its underlying infrastructure for configuration.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Security**:

[!INCLUDE [Resource Policy for Microsoft.Security 7.4](../../includes/policy/standards/asb/rp-controls/microsoft.security-7-4.md)]

### 7.5: Securely store configuration of Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13716).

**Guidance**: Use Azure DevOps to securely store and manage your code like custom Azure Policy definitions, Azure Resource Manager templates and desired state configuration scripts. To access the resources you manage in Azure DevOps, you can grant or deny permissions to specific users, built-in security groups, or groups defined in Azure Active Directory (Azure AD) if integrated with Azure DevOps, or Active Directory if integrated with TFS.

- [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops&amp;preserve-view=true)

- [About permissions and groups in Azure DevOps](/azure/devops/organizations/security/about-permissions)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.6: Securely store custom operating system images

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13717).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Azure Security Center is a core Azure offering and does not expose its underlying infrastructure for configuration.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.7: Deploy configuration management tools for Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13718).

**Guidance**: Define and implement standard security configurations for Azure resources using Azure Policy. Use Azure Policy aliases to create custom policies to audit or enforce the configuration of your Azure Security Center related resources. Additionally, you can use Azure Automation to deploy configuration changes. 

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md) 

- [How to use aliases](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#aliases)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.8: Deploy configuration management tools for operating systems

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13719).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Azure Security Center is a core Azure offering and does not expose its underlying infrastructure for configuration.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.9: Implement automated configuration monitoring for Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13720).

**Guidance**: Use built-in Azure Policy definitions as well as Azure Policy aliases in the "Microsoft.OperationalInsights" and "Microsoft. Security" namespaces to create custom policies to alert, audit, and enforce Azure resource configurations. Use Azure policy effects "audit", "deny", and "deploy if not exist" to automatically enforce configurations for your Azure resources.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.10: Implement automated configuration monitoring for operating systems

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13721).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Azure Security Center is a core Azure offering and does not expose its underlying infrastructure for configuration.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Security**:

[!INCLUDE [Resource Policy for Microsoft.Security 7.10](../../includes/policy/standards/asb/rp-controls/microsoft.security-7-10.md)]

### 7.11: Manage Azure secrets securely

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13722).

**Guidance**: Azure Security Center uses a configured Log Analytics workspace to store the data, alerts, and recommendations it generates. Configure a customer-managed key (CMK) for the workspace that you have configured for Security Center data collection. CMK enables all data saved or sent to the workspace to be encrypted with an Azure Key Vault key created and owned by you. 

- [Azure Monitor customer-managed key](/azure/azure-monitor/platform/customer-managed-keys)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.12: Manage identities securely and automatically

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13723).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Azure Security Center and Log Analytics workspace do not make use of managed identities.

- [Azure services that support managed identities](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md)

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.13: Eliminate unintended credential exposure

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13724).

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Malware Defense

*For more information, see the [Azure Security Benchmark: Malware Defense](../security/benchmarks/security-control-malware-defense.md).*

### 8.1: Use centrally managed anti-malware software

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13725).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Azure Security Center is a core Azure offering and does not expose its underlying infrastructure for configuration.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Security**:

[!INCLUDE [Resource Policy for Microsoft.Security 8.1](../../includes/policy/standards/asb/rp-controls/microsoft.security-8-1.md)]

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13726).

**Guidance**: Azure Security Center is not intended to store or process files. It is your responsibility to pre-scan any content being uploaded to non-compute Azure resources, including Log Analytics workspace.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 8.3: Ensure anti-malware software and signatures are updated

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13727).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Azure Security Center is a core Azure offering and does not expose its underlying infrastructure for configuration.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

## Data Recovery

*For more information, see the [Azure Security Benchmark: Data Recovery](../security/benchmarks/security-control-data-recovery.md).*

### 9.1: Ensure regular automated back ups 

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13728).

**Guidance**: Follow an infrastructure as code (IAC) approach and use Azure Resource Manager to deploy your Azure Security Center related resources in a JavaScript Object Notation (JSON) template which can be used as backup for resource-related configurations.

- [Single and multi-resource export to a template in Azure portal](../azure-resource-manager/templates/export-template-portal.md)

- [Azure Resource Manager templates for security resource](/azure/templates/microsoft.security/allversions)

- [About Azure Automation](../automation/automation-intro.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.2: Perform complete system backups and backup any customer-managed keys

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13729).

**Guidance**: Azure Security Center uses a Log Analytics workspace to store the data, alerts, and recommendations that it generates. You can configure Azure Monitor and the workspace that Security Center uses to enable a customer-managed key. If you are using a Key Vault to store your customer-managed keys, ensure regular automated backups of your keys.

- [How to backup Key Vault Keys](/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.3: Validate all backups including customer-managed keys

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13730).

**Guidance**: Ensure ability to periodically perform restoration using Azure Resource Manager backed template files. Test restoration of backed up customer-managed keys.

- [Manage Log Analytics workspace using Azure Resource Manager templates](/azure/azure-monitor/platform/template-workspace-configuration)

- [How to restore key vault keys in Azure](https://docs.microsoft.com/powershell/module/az.keyvault/restore-azkeyvaultkey?view=azps-4.8.0&amp;preserve-view=true)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.4: Ensure protection of backups and customer-managed keys

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13731).

**Guidance**: Use Azure DevOps to securely store and manage your code like custom Azure Policy definitions and Azure Resource Manager templates. To protect resources you manage in Azure DevOps, you can grant or deny permissions to specific users, built-in security groups, or groups defined in Azure Active Directory (Azure AD) if integrated with Azure DevOps, or Active Directory if integrated with TFS. Use role-based access control to protect customer-managed keys.

Additionally, Enable Soft-Delete and purge protection in Key Vault to protect keys against accidental or malicious deletion. If Azure Storage is used to store Azure Resource Manager template backups, enable soft delete to save and recover your data when blobs or blob snapshots are deleted.

- [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops&amp;preserve-view=true)

- [About permissions and groups in Azure DevOps](/azure/devops/organizations/security/about-permissions)

- [How to enable Soft-Delete and Purge protection in Key Vault](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete?tabs=azure-portal)

- [Soft delete for Azure Storage blobs](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete?tabs=azure-portal)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13732).

**Guidance**: Develop an incident response guide for your organization. Ensure there are written incident response plans that define all the roles of personnel as well as the phases of incident handling and management from detection to post-incident review. 

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/) 

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/06/27/inside-the-msrc-anatomy-of-a-ssirp-incident/) 

- [Use NIST's Computer Security Incident Handling Guide to aid in the creation of your own incident response plan](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.2: Create an incident scoring and prioritization procedure

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13733).

**Guidance**: Azure Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, mark subscriptions using tags and create a naming system to identify and categorize Azure resources, especially those processing sensitive data.  It's your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred. 

- [Security alerts in Azure Security Center](security-center-alerts-overview.md) 

- [Use tags to organize your Azure resources](/azure/azure-resource-manager/resource-group-using-tags)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.3: Test security response procedures

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13738).

**Guidance**: Conduct exercises to test your systems' incident response capabilities on a regular cadence to help protect your Azure resources. Identify weak points and gaps and then revise your response plan as needed. 

- [NIST's publication--Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://csrc.nist.gov/publications/detail/sp/800-84/final)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13734).

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved. 

- [How to set the Azure Security Center security contact](security-center-provide-security-contact-details.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Security**:

[!INCLUDE [Resource Policy for Microsoft.Security 10.4](../../includes/policy/standards/asb/rp-controls/microsoft.security-10-4.md)]

### 10.5: Incorporate security alerts into your incident response system

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13735).

**Guidance**: Export your Azure Security Center alerts and recommendations using the continuous export feature to help identify risks to Azure resources. Continuous export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You can use the Azure Security Center data connector to stream the alerts to Azure Sentinel. 

- [How to configure continuous export](continuous-export.md) 

- [How to stream alerts into Azure Sentinel](../sentinel/connect-azure-security-center.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.6: Automate the response to security alerts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13736).

**Guidance**: Use workflow automation feature Azure Security Center to automatically trigger responses to security alerts and recommendations to protect your Azure resources. 

- [How to configure workflow automation in Security Center](workflow-automation.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Penetration Tests and Red Team Exercises

*For more information, see the [Azure Security Benchmark: Penetration Tests and Red Team Exercises](../security/benchmarks/security-control-penetration-tests-red-team-exercises.md).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/13737).

**Guidance**: Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications. 

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1) 

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Next steps

- See the [Azure Security Benchmark V2 overview](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
