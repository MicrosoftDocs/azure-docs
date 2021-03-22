---
title: Azure security baseline for Site Recovery
description: The Site Recovery security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: site-recovery
ms.topic: conceptual
ms.date: 01/01/2000
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Site Recovery

This security baseline applies guidance from the [Azure Security Benchmark version 1.0](../security/benchmarks/overview-v1.md) to SiteRecovery. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to SiteRecovery. **Controls** not applicable to SiteRecovery, or for which the responsibility is Microsoft's, have been excluded.

To see how SiteRecovery completely maps to the Azure Security Benchmark, see the [full SiteRecovery security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](../security/benchmarks/security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33680).

**Guidance**: Microsoft Azure Site Recovery does not support deployment into an Azure Virtual Network. Configure Site Recovery service with an Azure Private Endpoint to enforce secure communications over your network.

- [Azure Site Recovery Private Link Support](azure-to-azure-how-to-enable-replication-private-endpoints.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and NICs

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33681).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Site Recovery's Services vault, a Site Recovery resource. The vault cannot be deployed or associated to an Azure Virtual Network or a network security group. 

Recovery Service vault is a Platform as a Service (PaaS) resource and replication of data is performed over a secured encrypted channel.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 1.3: Protect critical web applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33682).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Site Recovery. It is a PaaS resource and does not support customer facing web applications.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 1.4: Deny communications with known malicious IP addresses

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33683).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Microsoft manages the management endpoints for Site Recovery endpoints, which are used by Infrastructure as a Service (IaaS) Virtual Machine extensions and on-premise components. Customers are responsible for any securing additional endpoints, which are deployed by them.

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

### 1.5: Record network packets

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33684).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Site Recovery. This guideline is intended for resources deployed within Azure Virtual Networks. Site Recovery service resources cannot be deployed or associated with Azure Virtual Networks. All data from customer workloads is transferred to desired locations over encrypted channels.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33685).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Microsoft manages the endpoints for Site Recovery endpoints, which are used by IaaS Virtual Machine extension and on-premise components. Customers are responsible for any securing additional endpoints, which are deployed by them.

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

### 1.7: Manage traffic to web applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33686).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Site Recovery. It does not host any Web Apps to serve Disaster Recovery functionality for customer workloads.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 1.8: Minimize complexity and administrative overhead of network security rules

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33687).

**Guidance**: Site Recovery service supports service tags, which allow customers to open traffic only to specific services and ports. Customers have to allow "AzureSiteRecovery" service tag on their firewall or network security group to allow outbound access to Site Recovery service.

- [Outbound connectivity using Service Tags](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-about-networking#outbound-connectivity-using-service-tags)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.9: Maintain standard security configurations for network devices

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33688).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Site Recovery. All the endpoints used by Site Recovery are managed by Microsoft.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 1.10: Document traffic configuration rules

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33689).

**Guidance**: Use resource tags for network security groups and other resources related to network security and traffic flow. For individual network security group rules, use the "Description" field to document the rules that allow traffic to and from a network. 

Incorporate any of the built-in Azure Policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with tags and to notify you of existing untagged resources. 

You can use Azure PowerShell or Azure CLI to look up or perform actions on resources based on their tags. 

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

- [How to create an Azure Virtual Network](../virtual-network/quick-create-portal.md) 

- [How to filter network traffic with network security group rules](../virtual-network/tutorial-filter-network-traffic.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.11: Use automated tools to monitor network resource configurations and detect changes

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33690).

**Guidance**: Monitor any changes to network resource configurations related to the Site Recovery service using Azure Activity Logs. Create alerts in Azure Monitor to notify you when critical Site Recovery network resources are changed.

- [View and retrieve Azure Activity Log events](/azure/azure-monitor/platform/activity-log#view-the-activity-log)

- [Create, view, and manage activity log alerts by using Azure Monitor](/azure/azure-monitor/platform/alerts-activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Logging and Monitoring

*For more information, see the [Azure Security Benchmark: Logging and Monitoring](../security/benchmarks/security-control-logging-monitoring.md).*

### 2.1: Use approved time synchronization sources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33691).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Site Recovery. This guideline is intended for compute resources.

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

### 2.2: Configure central security log management

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33692).

**Guidance**: Enable Azure Activity Log diagnostic settings for audit logging and send the logs to a Log Analytics workspace, Azure Storage account or an Azure Event Hub for archival.

Use Azure Activity Log data to determine the "what, who, and when" for any write operations (PUT, POST, DELETE) performed on your Azure resources.

Ingest Site Recovery logs in Azure Monitor to aggregate generated security data. Within Azure Monitor, use Log Analytics workspaces to query and perform analytics, and use storage accounts for long-term or archival storage. Also, you may enable and on-board data to Azure Sentinel or a third-party Security Incident and Event Management (SIEM) solution.

- [How to enable Diagnostic Settings for Azure Activity Log](/azure/azure-monitor/platform/activity-log)

- [Monitor Site Recovery with Azure Monitor Logs](monitor-log-analytics.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.3: Enable audit logging for Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33693).

**Guidance**: Enable Azure Activity Log diagnostic settings for audit logging and send the logs to a Log Analytics workspace, Azure Storage account or to an Azure Event Hub for archival. 

Use Azure Activity Log data to determine the "what, who, and when" for any write operations (PUT, POST, DELETE) performed on your Azure resources.

Ingest Site Recovery logs with Azure Monitor to aggregate generated security data. Within Azure Monitor, use Log Analytics workspaces to query and perform analytics, and use storage accounts for long-term/archival storage. Enable and on-board data to Azure Sentinel or a third-party Security Incident and Event Management (SIEM) solution.

- [How to enable Diagnostic Settings for Azure Activity Log](/azure/azure-monitor/platform/activity-log)

- [Monitor Site Recovery with Azure Monitor Logs](monitor-log-analytics.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.4: Collect security logs from operating systems

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33694).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Site Recovery. This guideline is intended for compute resources. Site Recovery does not expose any operating system configurations or security logs to customers. Microsoft is responsible for monitoring the underlying service's compute infrastructure.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 2.5: Configure security log storage retention

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33695).

**Guidance**: Set log retention period for Log Analytics workspaces associated with your Azure Recovery Services vaults using Azure Monitor according to your organization's compliance regulations. 

- [How to set log retention parameters](/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.6: Monitor and review Logs

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33696).

**Guidance**: Enable Azure Activity Log diagnostic settings and send the logs to a Log Analytics workspace. 

Perform queries in Log Analytics to search terms, identify trends, analyze patterns, and insights on the Activity Log Data collected from Recovery Services Vaults.

- [Monitor Site Recovery](site-recovery-monitor-and-troubleshoot.md)

- [How to enable Diagnostic Settings for Azure Activity Log](/azure/azure-monitor/platform/activity-log)

- [How to collect and analyze Azure activity logs in Log Analytics workspace in Azure Monitor](/azure/azure-monitor/platform/activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.7: Enable alerts for anomalous activities

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33697).

**Guidance**: Monitor machines replicated by Azure Site Recovery using Azure Monitor logs and Log Analytics. Use Log Analytics within Azure Monitor to write and test log queries and to interactively analyze log data. Azure Monitor collects activity and resource logs, along with other monitoring data. 

Visualize and query log results, and configure alerts to take actions based on monitored data. Setup alerts on a Log Analytics workspace to Azure Sentinel as it provides a security orchestration automated response (SOAR) solution. This allows for automated solutions, like playbooks to be created and used to remediate security issues. Create custom log alerts in your Log Analytics workspace using Azure Monitor. 

- [Monitor Site Recovery](site-recovery-monitor-and-troubleshoot.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

- [Create, view, and manage log alerts using Azure Monitor](/azure/azure-monitor/platform/alerts-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.8: Centralize anti-malware logging

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33698).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Site Recovery. This guideline is intended for compute resources. Site Recovery is a PaaS resource and does not produce or expose any anti-malware logging to customers. 

Microsoft handles the anti-malware logging for all Microsoft-managed resources.

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

### 2.9: Enable DNS query logging

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33699).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Site Recovery. Site Recovery does not produce or process DNS query logs.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 2.10: Enable command-line audit logging

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33700).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Site Recovery. Site Recovery does not expose a command line to users.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33701).

**Guidance**: No roles are assigned by default. They need to be explicitly assigned based on business need. Any role assignments can be checked with PowerShell CLI or Azure Active Directory (Azure AD) to discover accounts that are members of administrative groups.

- [How to get a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrole)

- [How to get members of a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrolemember)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.2: Change default passwords where applicable

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33702).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Site Recovery. Site Recovery does not have a concept of default passwords.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 3.3: Use dedicated administrative accounts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33703).

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts. Use Security Center's Identity and Access Management features to monitor the number of administrative accounts.

Additionally, to help you keep track of dedicated administrative accounts, use recommendations from Security Center or built-in Azure policies, such as: 

- There should be more than one owner assigned to your subscription 
- Deprecated accounts with owner permissions should be removed from your subscription 

- External accounts with owner permissions should be removed from your subscription

Create a process to track identity and access control for administrative accounts and review it periodically.

- [How to use Azure Security Center to monitor identity and access](../security-center/security-center-identity-access.md)

- [How to use Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.4: Use single sign-on (SSO) with Azure Active Directory

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33704).

**Guidance**: Use Azure app registration with a Service Principal to retrieve a token to be used to interact with your Recovery Services vaults through API calls.

- [How to call Azure REST APIs](/rest/api/azure/#how-to-call-azure-rest-apis-with-postman)

- [How to register your client application (service principal) with Azure Active Directory (Azure AD)](/rest/api/azure/#register-your-client-application-with-azure-ad)

- [Azure Recovery Services API information](/rest/api/recoveryservices)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33705).

**Guidance**: Enable Azure Active Directory (Azure AD), multifactor authentication and follow Security Center's Identity and Access recommendations.

- [Plan an Azure multifactor authentication deployment](../active-directory/authentication/howto-mfa-getstarted.md)

- [Monitor identity and access](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33706).

**Guidance**: Use a secure, Azure-managed workstation (also known as a Privileged Access Workstation (PAW)) with Azure multifactor authentication for administrative tasks and to perform privileged actions on Site Recovery resources. 

- [Privileged Access Workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/)

- [Planning a cloud-based Azure multifactor authentication deployment](../active-directory/authentication/howto-mfa-getstarted.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.7: Log and alert on suspicious activities from administrative accounts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33707).

**Guidance**: Use Azure Active Directory (Azure AD)'s Privileged Identity Management (PIM) feature for generation of logs and alerts when suspicious or unsafe activity occurs in the environment.

View alerts and reports on risky user behavior with Azure AD risk detection feature.

- [How to deploy Privileged Identity Management (PIM)](../active-directory/privileged-identity-management/pim-deployment-plan.md)

- [Understand Azure AD risk detections](../active-directory/identity-protection/overview-identity-protection.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.8: Manage Azure resources only from approved locations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33708).

**Guidance**: Use Conditional Access Named Locations to allow access to the Azure portal from only specific logical groupings of IP address ranges, regions, or countries.
- [How to configure Named Locations in Azure](../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.9: Use Azure Active Directory

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33709).

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system for Site Recovery. Azure AD protects data by using strong encryption for data at rest, in transit and also salts, hashes, and securely stores user credentials.

- [How to create and configure an Azure AD instance](../active-directory/fundamentals/active-directory-access-create-new-tenant.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.10: Regularly review and reconcile user access

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33710).

**Guidance**: Use Azure Active Directory (Azure AD) logs to help discover stale accounts.

Efficiently manage group memberships, access to enterprise applications and role assignments with Azure AD's Identity and Access Reviews.

Create a process to review user access on a regular basis to ensure only users with completed access reviews have continued access.

- [Understand Azure AD reporting](/azure/active-directory/reports-monitoring/)

- [How to use Azure Identity Access Reviews](../active-directory/governance/access-reviews-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.11: Monitor attempts to access deactivated credentials

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33711).

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system for Site Recovery resources. Azure AD protects data by using strong encryption for data at rest and in transit and also salts, hashes, and securely stores user credentials.

You have access to Azure AD sign-in activity, audit, and risk event log sources, which allow you to integrate them with Azure Sentinel or any SIEM or monitoring tool available in the Azure Marketplace.

Further streamline this process by creating diagnostic settings for Azure AD user accounts and sending the audit and sign-in logs to a Log Analytics workspace. You can configure desired alerts within a Log Analytics workspace.

- [How to integrate Azure Activity Logs into Azure Monitor](/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)

- [How to on-board Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.12: Alert on account login behavior deviation

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33712).

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system for your Recovery Services vaults.

Employ Azure AD's Identity Protection features for account login behavior detection and to configure automated responses to detected suspicious actions, as related to user identities. Also ingest data into Azure Sentinel for further investigation.

- [How to view Azure AD risky sign-in](../active-directory/identity-protection/overview-identity-protection.md)

- [How to configure and enable Identity Protection risk policies](../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33713).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Site Recovery. It does not store customer data. 

All of Site Recovery's Disaster Recovery data is transferred or stored in customer owned resources. Site Recovery service stores only metadata of customer resources, such as primary location resource and Disaster Recovery location details. Any metadata and customer data is securely transferred from primary to Disaster Recovery location through an end-to-end encrypted channel.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](../security/benchmarks/security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive Information

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33714).

**Guidance**: Use tags to assist in tracking Azure resources that store or process sensitive information.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.2: Isolate systems storing or processing sensitive information

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33715).

**Guidance**: Implement separate subscriptions or management groups for development, test, and production Recovery Services Vaults. Separate resources with a virtual network or subnet, tagged appropriately, and secured by a network security group or Azure Firewall. 

Turn off virtual machines, which store or process sensitive data, when not in use. Implement policy and procedures to make this a recurring process. 

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create Management Groups](../governance/management-groups/create-management-group-portal.md)

- [Overview of Site Recovery](site-recovery-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.3: Monitor and block unauthorized transfer of sensitive information

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33716).

**Guidance**: Use Private Link or Private Endpoint, network security groups, and service tags to mitigate any opportunities for data exfiltration from the Site Recovery enabled virtual machines.

Microsoft manages the underlying platform used by Site Recovery and treats all customer content as sensitive and guard against customer data loss and exposure. Microsoft has implemented and maintains a suite of robust data protection controls and capabilities to ensure customer data within Azure remains secure. 

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

- [Replicate virtual machines with Azure Private Endpoints](azure-to-azure-how-to-enable-replication-private-endpoints.md)

- [Replicate virtual machines with Azure Site Recovery Service Tags](azure-to-azure-about-networking.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.4: Encrypt all sensitive information in transit

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33717).

**Guidance**: Site Recovery uses a secure https channel, encrypted using Advanced Encryption Standard (AES 256), from Azure workload servers to Site Recovery services hosted behind a Recovery Services vault.

Current TLS versions supported for Site Recovery are TLS 1.0, TLS 1.1, TLS 1.2 in regions, which were live by the end of 2019. TLS1.2 is the only supported TLS version for any new regions.

- [Understanding encryption in transit for Azure Site Recovery](physical-azure-set-up-source.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.5: Use an active discovery tool to identify sensitive data

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33718).

**Guidance**: Data identification, classification, and loss prevention features are not yet available for Site Recovery. 

Implement a third-party solution, as necessary, for compliance purposes.

Microsoft manages the underlying platform used by Site Recovery and treats all customer content as sensitive and guards against customer data loss and exposure. It has implemented and maintains a suite of robust data protection controls and capabilities to ensure customer data within Azure remains secure. 

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.6: Use Azure RBAC to manage access to resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33719).

**Guidance**: Use Azure role-based access control (Azure RBAC) to manage access to data and resources related to Site Recovery resources. 

Separate work duties with Azure RBAC and grant appropriate access required for them. Use the built-in Site Recovery roles to control Site Recovery management operations.

- [How to configure Azure RBAC](../role-based-access-control/role-assignments-portal.md)

- [Use Role-Based Access Control to manage Azure Site Recovery](site-recovery-role-based-linked-access-control.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.7: Use host-based data loss prevention to enforce access control

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33720).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Site Recovery. This recommendation is intended for compute resources. 

Microsoft manages the underlying infrastructure for Azure Site Recovery and has implemented strict controls to prevent the loss or exposure of customer data.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

### 4.8: Encrypt sensitive information at rest

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33721).

**Guidance**: Enable double encryption with both platform and customer-managed keys. This capability is available in Site Recovery. 

Site Recovery supports encryption at-rest for data. For Azure IaaS workloads, data is encrypted-at-rest using Storage Service Encryption (SSE). 

Only the customer has access to the encryption key while using a Recovery Services vault encrypted with a customer-managed key. Microsoft never maintains a copy, does not have access to the key, and does not decrypt the data transferred from primary to Disaster Recovery location at any point. 

- [Customer-Managed Keys Support for Azure Site Recovery](azure-to-azure-how-to-enable-replication-cmk-disks.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.9: Log and alert on changes to critical Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33722).

**Guidance**: Use Azure Monitor with Azure Activity Logs to create alerts when changes take place to critical resources,. These resources could include production instances of Recovery Services Vaults, resources of Site Recovery service and related resources.
- [How to create alerts for Azure Activity Log events](/azure/azure-monitor/platform/alerts-activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Vulnerability Management

*For more information, see the [Azure Security Benchmark: Vulnerability Management](../security/benchmarks/security-control-vulnerability-management.md).*

### 5.1: Run automated vulnerability scanning tools

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33723).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Site Recovery. It does not allow installation of vulnerability scanning tools for its resources. 

All compute and other resources used by Site Recovery are scanned and patched by Microsoft.

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

### 5.2: Deploy automated operating system patch management solution

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33724).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Site Recovery. This guideline is intended for compute resources. 

Microsoft performs patch management on the underlying operating systems that support Recovery Services Vaults.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 5.3: Deploy an automated patch management solution for third-party software titles

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33725).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Site Recovery. This guideline is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 5.4: Compare back-to-back vulnerability scans

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33726).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Site Recovery. This guideline is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33727).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Microsoft performs vulnerability management for the underlying systems and Site Recovery service resources, which support Recovery Services Vaults.

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

## Inventory and Asset Management

*For more information, see the [Azure Security Benchmark: Inventory and Asset Management](../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33728).

**Guidance**: Use Azure Resource Graph to query or discover all resources, including Recovery Services Vaults, within your subscriptions. Ensure appropriate read permissions in your tenant and enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use Azure Resource Manager resources going forward.

- [How to create queries with Azure Graph](../governance/resource-graph/first-query-portal.md)

- [How to view your Azure Subscriptions](/powershell/module/az.accounts/get-azsubscription)

- [Understand Azure RBAC](../role-based-access-control/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.2: Maintain asset metadata

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33729).

**Guidance**: Apply tags to Recovery Services vaults and other related resources, used by Site Recovery with metadata, to logically organize them into a taxonomy.
- [How to create and use Tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.3: Delete unauthorized Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33730).

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track Site Recovery (Recovery Services vaults) and other related resources. 

In addition, use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions: 

- Not allowed resource types
- Allowed resource types

Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create Management Groups](../governance/management-groups/create-management-group-portal.md)

- [How to create and use Tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.4: Define and maintain an inventory of approved Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33731).

**Guidance**: Create an inventory of approved Azure resources and approved software for compute resources based on customer's organizational requirements.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.5: Monitor for unapproved Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33732).

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions: 

- Not allowed resource types 
- Allowed resource types

Use Azure Resource Graph to query for and discover resources within the subscriptions.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to create queries with Azure Resource Graph](../governance/resource-graph/first-query-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.6: Monitor for unapproved software applications within compute resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33733).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Site Recovery. This guideline is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 6.7: Remove unapproved Azure resources and software applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33734).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Site Recovery. This guideline is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 6.8: Use only approved applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33735).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Site Recovery. This guideline is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 6.9: Use only approved Azure services

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33736).

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:

- Not allowed resource types 
- Allowed resource types

Understanding how to create and manage policies in Azure is important for staying compliant with your corporate standards and service level agreements.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to deny a specific resource type with Azure Policy](/azure/governance/policy/samples)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.10: Maintain an inventory of approved software titles

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33737).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Site Recovery. This guideline is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 6.11: Limit users' ability to interact with Azure Resource Manager

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33738).

**Guidance**: Use Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App. This can prevent the creation and changes to resources within a high security environment.

- [How to configure Conditional Access to block access to Azure Resource Manager](../role-based-access-control/conditional-access-azure-management.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.12: Limit users' ability to execute scripts in compute resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33739).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Site Recovery. This guideline is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 6.13: Physically or logically segregate high risk applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33740).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Site Recovery. This guideline is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

## Secure Configuration

*For more information, see the [Azure Security Benchmark: Secure Configuration](../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33741).

**Guidance**: Define and implement standard security configurations for your Recovery Services vault with Azure Policy. 

Use Azure Policy aliases in the "Microsoft.RecoveryServices" namespace to create custom policies to audit, or enforce the configuration of the Recovery Services vault resources of Site Recovery service.
- [How to view available Azure Policy Aliases](/powershell/module/az.resources/get-azpolicyalias)

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.2: Establish secure operating system configurations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33742).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Site Recovery. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.3: Maintain secure Azure resource configurations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33743).

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] effects to enforce secure settings across your Azure resources.
- [Understand Azure Policy Effects](../governance/policy/concepts/effects.md)

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.4: Maintain secure operating system configurations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33744).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Site Recovery. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.5: Securely store configuration of Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33745).

**Guidance**: Choose Azure Repos to securely store and manage your code if you're using custom Azure Policy definitions for your Recovery Services Vaults and related resources.

- [How to store code in Azure DevOps](/azure/devops/repos/git/gitworkflow)

- [Azure Repos Documentation](/azure/devops/repos/)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.6: Securely store custom operating system images

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33746).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Site Recovery. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.7: Deploy configuration management tools for Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33747).

**Guidance**: Use built-in Azure Policy definitions as well as Azure Policy aliases in the "Microsoft.RecoveryServices" namespace to create custom policies to alert, audit, and enforce system configurations. 

Additionally, develop a process and pipeline for managing policy exceptions.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.8: Deploy configuration management tools for operating systems

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33748).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Site Recovery. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.9: Implement automated configuration monitoring for Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33749).

**Guidance**: Use built-in Azure Policy definitions as well as Azure Policy aliases in the "Microsoft.RecoveryServices" namespace to create custom policies to alert, audit, and enforce system configurations. 

Use Azure Policy [audit], [deny], and [deploy if not exist] effects to automatically enforce configurations for your Azure resources.
- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.10: Implement automated configuration monitoring for operating systems

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33750).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Site Recovery. This recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.11: Manage Azure secrets securely

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33751).

**Guidance**: Customer should manage Site Recovery secrets integrated with Azure Key vault, while enabling Disaster Recovery for Azure Disk Encryption-enabled virtual machines. 

- [How to create a Key vault](../key-vault/general/quick-create-portal.md)

- [How to authenticate to Key vault](../key-vault/general/authentication.md)

- [How to assign a Key vault access policy](../key-vault/general/assign-access-policy-portal.md)

- [How to enable DR for Azure Disk Encryption-enabled virtual machines using Site Recovery](azure-to-azure-how-to-enable-replication-ade-vms.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.12: Manage identities securely and automatically

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33752).

**Guidance**: Site Recovery supports system-managed identity only where a customer can enable system managed identity on Recovery Services vault. The same methodology applies to resources used in the Disaster Recovery offering to define the access boundary.

Use managed identities to provide Azure services with an automatically managed identity in Azure Active Directory (Azure AD).

Managed identities allow you to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code.

- [How to integrate with Azure Managed Identities](https://docs.microsoft.com/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity?tabs=core2x)

- [How to enable System Managed Identity on Recovery Services Vault](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-how-to-enable-replication-private-endpoints#enable-the-managed-identity-for-the-vault)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.13: Eliminate unintended credential exposure

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33753).

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Malware Defense

*For more information, see the [Azure Security Benchmark: Malware Defense](../security/benchmarks/security-control-malware-defense.md).*

### 8.1: Use centrally managed antimalware software

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33754).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Site Recovery. This recommendation is intended for compute resources. 

Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Site Recovery for Recovery Services vault resources), however it does not run on customer content.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33755).

**Guidance**: Microsoft Antimalware is enabled on the underlying host that supports Azure services (for example, Site Recovery), however it does not run on your content. Pre-scan any files being uploaded to non-compute Azure resources, such as App Service, Data Lake Storage, and Blob Storage.

Use Security Center's Threat detection for data services to detect malware uploaded to storage accounts.

- [Understand Microsoft Antimalware for Azure Cloud Services and Virtual Machines](../security/fundamentals/antimalware.md)

- [Understand Azure Security Center's Threat detection for data services](../security-center/azure-defender.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 8.3: Ensure antimalware software and signatures are updated

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33756).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Site Recovery. This recommendation is intended for compute resources. Site Recovery does not allow for anti-malware solutions to be installed on it's resources. 

Microsoft handles updating any anti-malware software and signatures for the underlying platform supporting Site Recovery service.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

## Data Recovery

*For more information, see the [Azure Security Benchmark: Data Recovery](../security/benchmarks/security-control-data-recovery.md).*

### 9.1: Ensure regular automated back ups

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33757).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable to Site Recovery. This recommendation is intended for offerings which require backups. 

Site Recovery offers Disaster Recovery solutions to perform failover during outages. It is alternative solution to backup to enable Disaster Recovery for IaaS workload to meet an organization's Recovery Point Objectives (RPO) &amp; Recovery Time Objective (RTO) requirements.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.RecoveryServices**:

[!INCLUDE [Resource Policy for Microsoft.RecoveryServices 9.1](../../includes/policy/standards/asb/rp-controls/microsoft.recoveryservices-9-1.md)]

### 9.2: Perform complete system backups and backup any customer-managed keys

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33758).

**Guidance**: Site Recovery internally uses an Azure Storage account to maintain the state of the Disaster Recovery solution, as configured by customers on their workloads.

All the storage resources used by Site Recovery services metadata with configuration of type: Read Access Geo-redundant storage (RA-GRS). Storage accounts of type above GRS (Like RAGRS, RAG-ZRS) replicate your data to a secondary region (hundreds of miles away from the primary location of the source data) to continue to serve Disaster Recovery for customers during outages.

This is out of customer scope and Site Recovery team takes care of it internally. Customer can backup Key Vault keys in Azure.

- [How to backup key vault keys in Azure](/powershell/module/az.keyvault/backup-azkeyvaultkey)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.RecoveryServices**:

[!INCLUDE [Resource Policy for Microsoft.RecoveryServices 9.2](../../includes/policy/standards/asb/rp-controls/microsoft.recoveryservices-9-2.md)]

### 9.3: Validate all backups including customer-managed keys

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33759).

**Guidance**: Periodically test restores of backed-up customer-managed keys.

- [How to restore key vault keys in Azure](/powershell/module/az.keyvault/restore-azkeyvaultkey)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.4: Ensure protection of backups and customer-managed keys

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33760).

**Guidance**: Data is encrypted-at-rest using Storage Service Encryption (SSE) with Azure's Infrastructure as a Service (IaaS) based Virtual Machines. Enable soft-delete in Key Vault to protect keys against accidental or malicious deletion.

- [How to enable soft-delete in Key Vault](https://docs.microsoft.com/azure/storage/blobs/soft-delete-blob-overview?tabs=azure-portal)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33761).

**Guidance**: Build out an incident response guide for your organization. 

Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling or management from detection to post-incident review.

- [How to configure Workflow Automations within Azure Security Center](../security-center/security-center-planning-and-operations-guide.md)

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process)

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process)

- [Customer may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.2: Create an incident scoring and prioritization procedure

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33762).

**Guidance**: Prioritize which alerts should be investigated first based on Security Center's assigned alert-severity. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Mark subscriptions clearly (for example, production, non-production) and create a naming system to clearly identify and categorize Azure resources.

- [Security alerts in Azure Security Center](../security-center/security-center-alerts-overview.md) 

- [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.3: Test security response procedures

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33767).

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed

- [Refer to NIST's publication - Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33763).

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that the customer's data has been accessed by an unlawful or unauthorized party. 

Create a process to review incidents, post occurrence, to ensure that issues are resolved.

- [How to set the Azure Security Center Security Contact](../security-center/security-center-provide-security-contact-details.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.5: Incorporate security alerts into your incident response system

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33764).

**Guidance**: Export your Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. 

Use the Security Center data connector to stream the alerts to Azure Sentinel, as needed.
- [How to configure continuous export](../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../sentinel/connect-azure-security-center.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.6: Automate the response to security alerts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33765).

**Guidance**: Use the Workflow Automation feature in Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.
- [How to configure Workflow Automation and Logic Apps](../security-center/workflow-automation.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Penetration Tests and Red Team Exercises

*For more information, see the [Azure Security Benchmark: Penetration Tests and Red Team Exercises](../security/benchmarks/security-control-penetration-tests-red-team-exercises.md).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33766).

**Guidance**: Follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies: https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1

- [You can find more information on Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications, here](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Next steps

- See the [Azure Security Benchmark V2 overview](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
