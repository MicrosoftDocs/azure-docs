---
title: Azure security baseline for Site Recovery
description: The Site Recovery security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: site-recovery
ms.topic: conceptual
ms.date: 10/26/2020
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Site Recovery

This security baseline applies guidance from the [Azure Security Benchmark version 1.0](../security/benchmarks/overview-v1.md) to Site
Recovery. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Site
Recovery. **Controls** not applicable to Site
Recovery have been excluded. 

To see how Site
Recovery completely maps to the Azure Security Benchmark, see the [full Site
Recovery security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](../security/benchmarks/security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

**Guidance**: Microsoft Azure Site Recovery does not support deployment into an Azure Virtual Network. Configure Site Recovery service with an Azure Private Endpoint to enforce secure communications over your network.

- [Azure Site Recovery Private Link Support](azure-to-azure-how-to-enable-replication-private-endpoints.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: Site Recovery service supports service tags, which allow customers to open traffic only to specific services and ports. Customers have to allow "AzureSiteRecovery" service tag on their firewall or network security group to allow outbound access to Site Recovery service.

- [Outbound connectivity using Service Tags](azure-to-azure-about-networking.md#outbound-connectivity-using-service-tags)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.10: Document traffic configuration rules

**Guidance**: Use resource tags for network security groups and other resources related to network security and traffic flow. For individual network security group rules, use the "Description" field to document the rules that allow traffic to and from a network. 

Incorporate any of the built-in Azure Policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with tags and to notify you of existing untagged resources. 

You can use Azure PowerShell or Azure CLI to look up or perform actions on resources based on their tags. 

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md) 

- [How to create an Azure Virtual Network](../virtual-network/quick-create-portal.md) 

- [How to filter network traffic with network security group rules](../virtual-network/tutorial-filter-network-traffic.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Monitor any changes to network resource configurations related to the Site Recovery service using Azure Activity Logs. Create alerts in Azure Monitor to notify you when critical Site Recovery network resources are changed.

- [View and retrieve Azure Activity Log events](../azure-monitor/essentials/activity-log.md#view-the-activity-log)

- [Create, view, and manage activity log alerts by using Azure Monitor](../azure-monitor/alerts/alerts-activity-log.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Logging and Monitoring

*For more information, see the [Azure Security Benchmark: Logging and Monitoring](../security/benchmarks/security-control-logging-monitoring.md).*

### 2.2: Configure central security log management

**Guidance**: Enable Azure Activity Log diagnostic settings for audit logging and send the logs to a Log Analytics workspace, Azure Storage account or an Azure Event Hub for archival.

Use Azure Activity Log data to determine the "what, who, and when" for any write operations (PUT, POST, DELETE) performed on your Azure resources.

Ingest Site Recovery logs in Azure Monitor to aggregate generated security data. Within Azure Monitor, use Log Analytics workspaces to query and perform analytics, and use storage accounts for long-term or archival storage. Also, you may enable and on-board data to Azure Sentinel or a third-party Security Incident and Event Management (SIEM) solution.

- [How to enable Diagnostic Settings for Azure Activity Log](../azure-monitor/essentials/activity-log.md)

- [Monitor Site Recovery with Azure Monitor Logs](monitor-log-analytics.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

**Guidance**: Enable Azure Activity Log diagnostic settings for audit logging and send the logs to a Log Analytics workspace, Azure Storage account or to an Azure Event Hub for archival. 

Use Azure Activity Log data to determine the "what, who, and when" for any write operations (PUT, POST, DELETE) performed on your Azure resources.

Ingest Site Recovery logs with Azure Monitor to aggregate generated security data. Within Azure Monitor, use Log Analytics workspaces to query and perform analytics, and use storage accounts for long-term/archival storage. Enable and on-board data to Azure Sentinel or a third-party Security Incident and Event Management (SIEM) solution.

- [How to enable Diagnostic Settings for Azure Activity Log](../azure-monitor/essentials/activity-log.md)

- [Monitor Site Recovery with Azure Monitor Logs](monitor-log-analytics.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.5: Configure security log storage retention

**Guidance**: Set log retention period for Log Analytics workspaces associated with your Azure Recovery Services vaults using Azure Monitor according to your organization's compliance regulations. 

- [How to set log retention parameters](../azure-monitor/logs/manage-cost-storage.md#change-the-data-retention-period)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.6: Monitor and review Logs

**Guidance**: Enable Azure Activity Log diagnostic settings and send the logs to a Log Analytics workspace. 

Perform queries in Log Analytics to search terms, identify trends, analyze patterns, and insights on the Activity Log Data collected from Recovery Services Vaults.

- [Monitor Site Recovery](site-recovery-monitor-and-troubleshoot.md)

- [How to enable Diagnostic Settings for Azure Activity Log](../azure-monitor/essentials/activity-log.md)

- [How to collect and analyze Azure activity logs in Log Analytics workspace in Azure Monitor](../azure-monitor/essentials/activity-log.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activities

**Guidance**: Monitor machines replicated by Azure Site Recovery using Azure Monitor logs and Log Analytics. Use Log Analytics within Azure Monitor to write and test log queries and to interactively analyze log data. Azure Monitor collects activity and resource logs, along with other monitoring data. 

Visualize and query log results, and configure alerts to take actions based on monitored data. Setup alerts on a Log Analytics workspace to Azure Sentinel as it provides a security orchestration automated response (SOAR) solution. This allows for automated solutions, like playbooks to be created and used to remediate security issues. Create custom log alerts in your Log Analytics workspace using Azure Monitor. 

- [Monitor Site Recovery](site-recovery-monitor-and-troubleshoot.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

- [Create, view, and manage log alerts using Azure Monitor](../azure-monitor/alerts/alerts-log.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: No roles are assigned by default. They need to be explicitly assigned based on business need. Any role assignments can be checked with PowerShell CLI or Azure Active Directory (Azure AD) to discover accounts that are members of administrative groups.

- [How to get a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrole?preserve-view=true&view=azureadps-2.0)

- [How to get members of a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrolemember?preserve-view=true&view=azureadps-2.0)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.3: Use dedicated administrative accounts

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts. Use Security Center's Identity and Access Management features to monitor the number of administrative accounts.

Additionally, to help you keep track of dedicated administrative accounts, use recommendations from Security Center or built-in Azure policies, such as: 

- There should be more than one owner assigned to your subscription 
- Deprecated accounts with owner permissions should be removed from your subscription 

- External accounts with owner permissions should be removed from your subscription

Create a process to track identity and access control for administrative accounts and review it periodically.

- [How to use Azure Security Center to monitor identity and access](../security-center/security-center-identity-access.md)

- [How to use Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.4: Use single sign-on (SSO) with Azure Active Directory

**Guidance**: Use Azure app registration with a Service Principal to retrieve a token to be used to interact with your Recovery Services vaults through API calls.

- [How to call Azure REST APIs](/rest/api/azure/#how-to-call-azure-rest-apis-with-postman)

- [How to register your client application (service principal) with Azure AD](/rest/api/azure/#register-your-client-application-with-azure-ad)

- [Azure Recovery Services API information](/rest/api/recoveryservices)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

**Guidance**: Enable Azure AD, multifactor authentication and follow Security Center's Identity and Access recommendations. 
- [Plan an Azure AD Multi-Factor Authentication deployment](../active-directory/authentication/howto-mfa-getstarted.md)

- [Monitor identity and access](../security-center/security-center-identity-access.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

**Guidance**: Use a secure, Azure-managed workstation (also known as a Privileged Access Workstation (PAW)) with Azure multifactor authentication for administrative tasks and to perform privileged actions on Site Recovery resources.

- [Privileged Access Workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/)

- [Planning a cloud-based Azure AD Multi-Factor Authentication deployment](../active-directory/authentication/howto-mfa-getstarted.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.7: Log and alert on suspicious activities from administrative accounts

**Guidance**: Use Azure AD's Privileged Identity Management (PIM) feature for generation of logs and alerts when suspicious or unsafe activity occurs in the environment.
View alerts and reports on risky user behavior with Azure AD risk detection feature.

- [How to deploy Privileged Identity Management (PIM)](../active-directory/privileged-identity-management/pim-deployment-plan.md)

- [Understand Azure AD risk detections](../active-directory/identity-protection/overview-identity-protection.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.8: Manage Azure resources only from approved locations

**Guidance**: Use Conditional Access Named Locations to allow access to the Azure portal from only specific logical groupings of IP address ranges, regions, or countries.
- [How to configure Named Locations in Azure](../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure AD as the central authentication and authorization system for Site Recovery. Azure AD protects data by using strong encryption for data at rest, in transit and also salts, hashes, and securely stores user credentials. 

- [How to create and configure an Azure AD instance](../active-directory/fundamentals/active-directory-access-create-new-tenant.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.10: Regularly review and reconcile user access

**Guidance**: Use Azure AD logs to help discover stale accounts. 

Efficiently manage group memberships, access to enterprise applications and role assignments with Azure AD's Identity and Access Reviews. 

Create a process to review user access on a regular basis to ensure only users with completed access reviews have continued access. 

- [Understand Azure AD reporting](../active-directory/reports-monitoring/index.yml)

- [How to use Azure Identity Access Reviews](../active-directory/governance/access-reviews-overview.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.11: Monitor attempts to access deactivated credentials

**Guidance**: Use Azure AD as the central authentication and authorization system for Site Recovery resources. Azure AD protects data by using strong encryption for data at rest and in transit and also salts, hashes, and securely stores user credentials.

You have access to Azure AD sign-in activity, audit, and risk event log sources, which allow you to integrate them with Azure Sentinel or any SIEM or monitoring tool available in the Azure Marketplace.

Further streamline this process by creating diagnostic settings for Azure AD user accounts and sending the audit and sign-in logs to a Log Analytics workspace. You can configure desired alerts within a Log Analytics workspace.

- [How to integrate Azure Activity Logs into Azure Monitor](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)

- [How to on-board Azure Sentinel](../sentinel/quickstart-onboard.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.12: Alert on account login behavior deviation

**Guidance**: Use Azure AD as the central authentication and authorization system for your Recovery Services vaults. 

Employ Azure AD's Identity Protection features for account login behavior detection and to configure automated responses to detected suspicious actions, as related to user identities. Also ingest data into Azure Sentinel for further investigation.

- [How to view Azure AD risky sign-in](../active-directory/identity-protection/overview-identity-protection.md)

- [How to configure and enable Identity Protection risk policies](../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](../security/benchmarks/security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags to assist in tracking Azure resources that store or process sensitive information.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Implement separate subscriptions or management groups for development, test, and production Recovery Services Vaults. Separate resources with a virtual network or subnet, tagged appropriately, and secured by a network security group or Azure Firewall. 

Turn off virtual machines, which store or process sensitive data, when not in use. Implement policy and procedures to make this a recurring process. 

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create Management Groups](../governance/management-groups/create-management-group-portal.md)

- [Overview of Site Recovery](site-recovery-overview.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: Use Private Link or Private Endpoint, network security groups, and service tags to mitigate any opportunities for data exfiltration from the Site Recovery enabled virtual machines.

Microsoft manages the underlying platform used by Site Recovery and treats all customer content as sensitive and guard against customer data loss and exposure. Microsoft has implemented and maintains a suite of robust data protection controls and capabilities to ensure customer data within Azure remains secure. 

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

- [Replicate virtual machines with Azure Private Endpoints](azure-to-azure-how-to-enable-replication-private-endpoints.md)

- [Replicate virtual machines with Azure Site Recovery Service Tags](azure-to-azure-about-networking.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 4.4: Encrypt all sensitive information in transit

**Guidance**: Site Recovery uses a secure https channel, encrypted using Advanced Encryption Standard (AES 256), from Azure workload servers to Site Recovery services hosted behind a Recovery Services vault.

Current TLS versions supported for Site Recovery are TLS 1.0, TLS 1.1, TLS 1.2 in regions, which were live by the end of 2019. TLS1.2 is the only supported TLS version for any new regions.

- [Understanding encryption in transit for Azure Site Recovery](physical-azure-set-up-source.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Data identification, classification, and loss prevention features are not yet available for Site Recovery. 

Implement a third-party solution, as necessary, for compliance purposes.

Microsoft manages the underlying platform used by Site Recovery and treats all customer content as sensitive and guards against customer data loss and exposure. It has implemented and maintains a suite of robust data protection controls and capabilities to ensure customer data within Azure remains secure. 

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.6: Use Azure RBAC to manage access to resources

**Guidance**: Use Azure role-based access control (Azure RBAC) to manage access to data and resources related to Site Recovery resources. 

Separate work duties with Azure RBAC and grant appropriate access required for them. Use the built-in Site Recovery roles to control Site Recovery management operations.

- [How to configure Azure RBAC](../role-based-access-control/role-assignments-portal.md)

- [Use Role-Based Access Control to manage Azure Site Recovery](site-recovery-role-based-linked-access-control.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.8: Encrypt sensitive information at rest

**Guidance**: Enable double encryption with both platform and customer-managed keys. This capability is available in Site Recovery. 

Site Recovery supports encryption at-rest for data. For Azure IaaS workloads, data is encrypted-at-rest using Storage Service Encryption (SSE). 

Only the customer has access to the encryption key while using a Recovery Services vault encrypted with a customer-managed key. Microsoft never maintains a copy, does not have access to the key, and does not decrypt the data transferred from primary to Disaster Recovery location at any point. 

- [Customer Managed Keys Support for Azure Site Recovery](azure-to-azure-how-to-enable-replication-cmk-disks.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with Azure Activity Logs to create alerts when changes take place to critical resources,. These resources could include production instances of Recovery Services Vaults, resources of Site Recovery service and related resources.
- [How to create alerts for Azure Activity Log events](../azure-monitor/alerts/alerts-activity-log.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Inventory and Asset Management

*For more information, see the [Azure Security Benchmark: Inventory and Asset Management](../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

**Guidance**: Use Azure Resource Graph to query or discover all resources, including Recovery Services Vaults, within your subscriptions. Ensure appropriate read permissions in your tenant and enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use Azure Resource Manager resources going forward.

- [How to create queries with Azure Graph](../governance/resource-graph/first-query-portal.md)

- [How to view your Azure Subscriptions](/powershell/module/az.accounts/get-azsubscription?preserve-view=true&view=azps-4.8.0)

- [Understand Azure RBAC](../role-based-access-control/overview.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Recovery Services vaults and other related resources, used by Site Recovery with metadata, to logically organize them into a taxonomy.
- [How to create and use Tags](../azure-resource-manager/management/tag-resources.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track Site Recovery (Recovery Services vaults) and other related resources. 

In addition, use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions: 

- Not allowed resource types
- Allowed resource types

Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create Management Groups](../governance/management-groups/create-management-group-portal.md)

- [How to create and use Tags](../azure-resource-manager/management/tag-resources.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.4: Define and maintain an inventory of approved Azure resources

**Guidance**: Create an inventory of approved Azure resources and approved software for compute resources based on customer's organizational requirements.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions: 

- Not allowed resource types 
- Allowed resource types

Use Azure Resource Graph to query for and discover resources within the subscriptions.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to create queries with Azure Resource Graph](../governance/resource-graph/first-query-portal.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.9: Use only approved Azure services

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:

- Not allowed resource types 
- Allowed resource types

Understanding how to create and manage policies in Azure is important for staying compliant with your corporate standards and service level agreements.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to deny a specific resource type with Azure Policy](../governance/policy/samples/index.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.11: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Use Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App. This can prevent the creation and changes to resources within a high security environment.

- [How to configure Conditional Access to block access to Azure Resource Manager](../role-based-access-control/conditional-access-azure-management.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Secure Configuration

*For more information, see the [Azure Security Benchmark: Secure Configuration](../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Define and implement standard security configurations for your Recovery Services vault with Azure Policy. 

Use Azure Policy aliases in the "Microsoft.RecoveryServices" namespace to create custom policies to audit, or enforce the configuration of the Recovery Services vault resources of Site Recovery service.
- [How to view available Azure Policy Aliases](/powershell/module/az.resources/get-azpolicyalias?preserve-view=true&view=azps-4.8.0)

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] effects to enforce secure settings across your Azure resources.
- [Understand Azure Policy Effects](../governance/policy/concepts/effects.md)

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.5: Securely store configuration of Azure resources

**Guidance**: Choose Azure Repos to securely store and manage your code if you're using custom Azure Policy definitions for your Recovery Services Vaults and related resources.

- [How to store code in Azure DevOps](/azure/devops/repos/git/gitworkflow?preserve-view=true&view=azure-devops)

- [Azure Repos Documentation](/azure/devops/repos/?preserve-view=true&view=azure-devops)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Use built-in Azure Policy definitions as well as Azure Policy aliases in the "Microsoft.RecoveryServices" namespace to create custom policies to alert, audit, and enforce system configurations. 

Additionally, develop a process and pipeline for managing policy exceptions.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Use built-in Azure Policy definitions as well as Azure Policy aliases in the "Microsoft.RecoveryServices" namespace to create custom policies to alert, audit, and enforce system configurations. 

Use Azure Policy [audit], [deny], and [deploy if not exist] effects to automatically enforce configurations for your Azure resources.
- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.11: Manage Azure secrets securely

**Guidance**: Customer should manage Site Recovery secrets integrated with Azure Key vault, while enabling Disaster Recovery for Azure Disk Encryption-enabled virtual machines. 

- [How to create a Key vault](../key-vault/general/quick-create-portal.md)

- [How to authenticate to Key vault](../key-vault/general/authentication.md)

- [How to assign a Key vault access policy](../key-vault/general/assign-access-policy-portal.md)

- [How to enable DR for Azure Disk Encryption-enabled virtual machines using Site Recovery](azure-to-azure-how-to-enable-replication-ade-vms.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.12: Manage identities securely and automatically

**Guidance**: Site Recovery supports system-managed identity only where a customer can enable system managed identity on Recovery Services vault. The same methodology applies to resources used in the Disaster Recovery offering to define the access boundary. 

Use managed identities to provide Azure services with an automatically managed identity in Azure AD. 

Managed identities allow you to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code.

- [How to integrate with Azure Managed Identities](../azure-app-configuration/howto-integrate-azure-managed-service-identity.md?tabs=core2x)

- [How to enable System Managed Identity on Recovery Services Vault](azure-to-azure-how-to-enable-replication-private-endpoints.md#enable-the-managed-identity-for-the-vault)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.13: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Malware Defense

*For more information, see the [Azure Security Benchmark: Malware Defense](../security/benchmarks/security-control-malware-defense.md).*

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Microsoft Antimalware is enabled on the underlying host that supports Azure services (for example, Site Recovery), however it does not run on your content. Pre-scan any files being uploaded to non-compute Azure resources, such as App Service, Data Lake Storage, and Blob Storage.

Use Security Center's Threat detection for data services to detect malware uploaded to storage accounts.

- [Understand Microsoft Antimalware for Azure Cloud Services and Virtual Machines](../security/fundamentals/antimalware.md)

- [Understand Azure Security Center's Threat detection for data services](../security-center/azure-defender.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Data Recovery

*For more information, see the [Azure Security Benchmark: Data Recovery](../security/benchmarks/security-control-data-recovery.md).*

### 9.2: Perform complete system backups and backup any customer-managed keys

**Guidance**: Site Recovery internally uses an Azure Storage account to maintain the state of the Disaster Recovery solution, as configured by customers on their workloads.

All the storage resources used by Site Recovery services metadata with configuration of type: Read Access Geo-redundant storage (RA-GRS). Storage accounts of type above GRS (Like RAGRS, RAG-ZRS) replicate your data to a secondary region (hundreds of miles away from the primary location of the source data) to continue to serve Disaster Recovery for customers during outages.

This is out of customer scope and Site Recovery team takes care of it internally. Customer can backup Key Vault keys in Azure.

- [How to backup key vault keys in Azure](/powershell/module/az.keyvault/backup-azkeyvaultkey?preserve-view=true&view=azps-4.8.0)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.3: Validate all backups including customer-managed keys

**Guidance**: Periodically test restores of backed-up customer-managed keys.

- [How to restore key vault keys in Azure](/powershell/module/az.keyvault/restore-azkeyvaultkey?preserve-view=true&view=azps-4.8.0)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.4: Ensure protection of backups and customer-managed keys

**Guidance**: Data is encrypted-at-rest using Storage Service Encryption (SSE) with Azure's Infrastructure as a Service (IaaS) based Virtual Machines. Enable soft-delete in Key Vault to protect keys against accidental or malicious deletion.

- [How to enable soft-delete in Key Vault](../storage/blobs/soft-delete-blob-overview.md?tabs=azure-portal)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide

**Guidance**: Build out an incident response guide for your organization. 

Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling or management from detection to post-incident review.

- [How to configure Workflow Automations within Azure Security Center](../security-center/security-center-planning-and-operations-guide.md)

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process)

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process)

- [Customer may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Prioritize which alerts should be investigated first based on Security Center's assigned alert-severity. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Mark subscriptions clearly (for example, production, non-production) and create a naming system to clearly identify and categorize Azure resources.

- [Security alerts in Azure Security Center](../security-center/security-center-alerts-overview.md) 

- [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed

- [Refer to NIST's publication - Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that the customer's data has been accessed by an unlawful or unauthorized party. 

Create a process to review incidents, post occurrence, to ensure that issues are resolved.

- [How to set the Azure Security Center Security Contact](../security-center/security-center-provide-security-contact-details.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. 

Use the Security Center data connector to stream the alerts to Azure Sentinel, as needed.
- [How to configure continuous export](../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../sentinel/connect-azure-security-center.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

**Guidance**: Use the Workflow Automation feature in Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.
- [How to configure Workflow Automation and Logic Apps](../security-center/workflow-automation.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Penetration Tests and Red Team Exercises

*For more information, see the [Azure Security Benchmark: Penetration Tests and Red Team Exercises](../security/benchmarks/security-control-penetration-tests-red-team-exercises.md).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

**Guidance**: Follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies: https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1

- [You can find more information on Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications, here](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Next steps

- See the [Azure Security Benchmark V2 overview](../security/benchmarks/overview.md)
- Learn more about [Azure security baselines](../security/benchmarks/security-baselines-overview.md)