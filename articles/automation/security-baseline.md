---
title: Azure security baseline for Automation
description: The Automation security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: automation
ms.topic: conceptual
ms.date: 02/17/2021
ms.author: mbaldwin
ms.custom: subject-security-benchmark, devx-track-azurepowershell

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Automation

This security
baseline applies guidance from the [Azure Security Benchmark version
1.0](../security/benchmarks/overview-v1.md) to Azure Automation. The Azure Security Benchmark
provides recommendations on how you can secure your cloud solutions on Azure.
The content is grouped by the **security controls** defined by the Azure
Security Benchmark and the related guidance applicable to Azure Automation. **Controls** not applicable to Azure Automation have been excluded.

 
To see how Azure Automation completely maps to the Azure
Security Benchmark, see the [full Azure Automation security baseline mapping
file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](../security/benchmarks/security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

**Guidance**: Azure Automation account does not yet support Azure Private Link for restricting access to the service through private endpoints. Runbooks that authenticate and run against resources in Azure run on an Azure sandbox, and leverage shared backend resources, which Microsoft is responsible for isolating from each other; their networking is unrestricted and can access public resources. Azure Automation does not currently have virtual network integration for private networking beyond the support for Hybrid Runbook Workers. This control is not applicable if you are using the out-of-the box service without Hybrid Runbook Workers.

To get further isolation for your runbooks you can use Hybrid Runbook Workers running on Azure virtual machines. When you create an Azure virtual machine, you must create a virtual network (VNet) or use an existing VNet and configure your VMs with a subnet. Ensure that all deployed subnets have a Network Security Group applied with network access controls specific to your applications trusted ports and sources. For service-specific requirements, refer to the security recommendation for that specific service. 
Alternatively, if you have a specific requirement, Azure Firewall may also be used to meet it.

- [Virtual networks and virtual machines in Azure](../virtual-machines/network-overview.md)

- [How to create a Virtual Network](../virtual-network/quick-create-portal.md)

- [How to create an NSG with a Security Config](../virtual-network/tutorial-filter-network-traffic.md)

- [How to deploy and configure Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md)

- [Runbook execution environment](./automation-runbook-execution.md#runbook-execution-environment)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and network interfaces

**Guidance**: Azure Automation currently does not have virtual network integration for private networking beyond the support for Hybrid Runbook Workers. This control is not applicable if you are using the out-of-the box service without Hybrid Runbook Workers.

If you are using Hybrid Runbook Workers backed by Azure virtual machines, ensure the subnet containing those workers are enabled with a Network Security Group (NSG) and configure flow logs to forward logs to a Storage Account for traffic audit. You may also forward NSG flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

While NSG rules and user-defined routes do not apply to private endpoint, NSG flow logs and monitoring information for outbound connections are still supported and can be used.

- [How to Enable NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to Enable and use Traffic Analytics](../network-watcher/traffic-analytics.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.4: Deny communications with known-malicious IP addresses

**Guidance**: Azure Automation does not currently have virtual network integration for private networking beyond the support for Hybrid Runbook Workers. This control is not applicable if you are using the out-of-the box service without Hybrid Runbook Workers.

If you are using Hybrid Runbook Workers backed by Azure virtual machines, enable Distributed Denial of Service (DDoS) Standard protection on your Virtual Networks hosting your Hybrid Runbook Workers to guard against DDoS attacks. By using Azure Security Center Integrated Threat Intelligence, you can deny communications with known malicious IP addresses.  Configure Azure Firewall on each of the Virtual Network segments, with Threat Intelligence enabled, and configure to **Alert and deny** for malicious network traffic.

You can use Azure Security Center's Just In Time Network access to limit exposure of Windows virtual machines to the approved IP addresses for a limited period of time.  Also, use Azure Security Center Adaptive Network Hardening recommendations for NSG configurations to limit ports and source IPs based on actual traffic and threat intelligence.

- [How to configure DDoS protection](../ddos-protection/manage-ddos-protection.md)

- [How to deploy Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md)

- [Understand Azure Security Center Integrated Threat Intelligence](../security-center/azure-defender.md)

- [Understand Azure Security Center Adaptive Network Hardening](../security-center/security-center-adaptive-network-hardening.md)

- [Understand Azure Security Center Just In Time Network Access Control](../security-center/security-center-just-in-time.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.5: Record network packets

**Guidance**: Azure Automation does not currently have virtual network integration for private networking beyond the support for Hybrid Runbook Workers, this control is not applicable if you are using the out-of-the box service without Hybrid Workers.

If you are using Hybrid Runbook Workers backed by Azure virtual machines, then you can record NSG flow logs into a storage account to generate flow records for your Azure Virtual Machines that are acting as runbook workers. When investigating anomalous activity, you could enable Network Watcher packet capture so that network traffic can be reviewed for unusual and unexpected activity.

- [How to Enable NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to enable Network Watcher](../network-watcher/network-watcher-create.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Azure Automation does not currently have virtual network integration for private networking beyond the support for Hybrid Runbook Workers. This control is not applicable if you are using the out-of-the box service without Hybrid Runbook Workers.

If you are using Hybrid Runbook Workers hosted on Azure virtual machines, you can combine packet captures provided by Network Watcher and open source IDS tools to perform network intrusion detection for a wide range of threats to those worker machines. Also, you can deploy Azure Firewall to the Virtual Network segments as appropriate, with Threat Intelligence enabled and configured to "Alert and deny" for malicious network traffic.

- [Perform network intrusion detection with Network Watcher and open source tools](../network-watcher/network-watcher-intrusion-detection-open-source-tools.md)

- [How to deploy Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md)

- [How to configure alerts with Azure Firewall](../firewall/threat-intel.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: Use Virtual Network service tags to define network access controls on Network Security Groups or Azure Firewall configured in Azure which require access to your Automation Resources. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (for example, GuestAndHybridManagement) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

- [Understand and using Service Tags](../virtual-network/service-tags-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement standard security configurations for network resources used by Azure Automation with Azure Policy.

You may also use Azure Blueprints to simplify large-scale Azure deployments by packaging key environment artifacts, such as Azure Resources Manager templates, Azure RBAC controls, and policies, in a single blueprint definition. You can apply the blueprint to new subscriptions, and fine-tune control and management through versioning.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Azure Policy samples for networking](../governance/policy/samples/built-in-policies.md#network)

- [How to create an Azure Blueprint](../governance/blueprints/create-blueprint-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.10: Document traffic configuration rules

**Guidance**: Use Tags for NSGs and other resources related to network security and traffic flow. For individual NSG rules, use the "Description" field to specify business need and/or duration (etc.) for any rules that allow traffic to/from a network.

Use any of the built-in Azure Policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with Tags and to notify you of existing untagged resources.

You may use Azure PowerShell or Azure CLI to look-up or perform actions on resources based on their Tags.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

- [How to create a Virtual Network](../virtual-network/quick-create-portal.md)

- [How to create an NSG with a Security Config](../virtual-network/tutorial-filter-network-traffic.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Activity Log to monitor resource configurations and detect changes to your network resources. Create alerts within Azure Monitor that will trigger when changes to critical resources take place.

- [How to view and retrieve Azure Activity Log events](../azure-monitor/essentials/activity-log.md#view-the-activity-log)

- [How to create alerts in Azure Monitor](../azure-monitor/essentials/activity-log.md#view-the-activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Logging and Monitoring

*For more information, see the [Azure Security Benchmark: Logging and Monitoring](../security/benchmarks/security-control-logging-monitoring.md).*

### 2.2: Configure central security log management

**Guidance**: Forward log data to Azure Monitor Logs to aggregate security data generated by Azure Automation resources. Within Azure Monitor, use log queries to search and perform analytics, and use Azure Storage Accounts for long-term/archival storage. Azure Automation can send runbook job status, job streams, Automation state configuration data, update management, and change tracking or inventory logs to your Log Analytics workspace. This information is visible from the Azure portal, Azure PowerShell, and Azure Monitor Logs API, which enables you to perform simple investigations.

Alternatively, you may enable and on-board data to Azure Sentinel or a third-party SIEM. 

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

- [How to collect platform logs and metrics with Azure Monitor](../azure-monitor/essentials/diagnostic-settings.md)

- [How to get started with Azure Monitor and third-party SIEM integration](https://azure.microsoft.com/blog/use-azure-monitor-to-integrate-with-siem-tools/)

- [Forward Azure Automation job data to Azure Monitor logs](automation-manage-send-joblogs-log-analytics.md)

- [Integrate DSC with Azure Monitor logs](automation-dsc-diagnostics.md)

- [Supported regions for linked Log Analytics workspace](how-to/region-mappings.md)

- [Query Update Management Logs](update-management/query-logs.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.3: Enable audit logging for Azure resources

**Guidance**: Enable Azure Monitor for access to your audit and activity logs which includes event source, date, user, timestamp, source addresses, destination addresses, and other useful elements. 

- [How to collect platform logs and metrics with Azure Monitor](../azure-monitor/essentials/diagnostic-settings.md) 

- [View and retrieve Azure Activity log events](../azure-monitor/essentials/activity-log.md#view-the-activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.5: Configure security log storage retention

**Guidance**: Within Azure Monitor, set your Log Analytics workspace retention period according to your organization's compliance regulations. Use Azure Storage Accounts for long-term/archival storage.

- [Change the data retention period in Log Analytics](../azure-monitor/logs/manage-cost-storage.md#change-the-data-retention-period)

- [Data retention details for Automation Accounts](./automation-managing-data.md#data-retention)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.6: Monitor and review logs

**Guidance**: Analyze and monitor logs for anomalous behavior and regularly review results. Use Azure Monitor log queries to review logs and perform queries on log data.

Alternatively, you may enable and on-board data to Azure Sentinel or a third-party SIEM. 

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

- [Understand log queries in Azure Monitor](../azure-monitor/logs/log-analytics-tutorial.md)

- [How to perform custom queries in Azure Monitor](../azure-monitor/logs/get-started-queries.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.7: Enable alerts for anomalous activities

**Guidance**: Use Azure Security Center with Azure Monitor for monitoring and alerting on anomalous activity found in security logs and events.

Alternatively, you may enable and on-board data to Azure Sentinel.

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

- [How to manage alerts in Azure Security Center](../security-center/security-center-managing-and-responding-alerts.md)

- [How to alert on Azure Monitor log data](../azure-monitor/alerts/tutorial-response.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.9: Enable DNS query logging

**Guidance**: Implement a third-party solution from Azure Marketplace for DNS logging solution as per your organizations need.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Use Azure Active Directory (Azure AD) built-in administrator roles which can be explicitly assigned and can be queried. Use the Azure AD PowerShell module to perform ad hoc queries to discover accounts that are members of administrative groups. Whenever using Automation Account Run As accounts for your runbooks, ensure these service principals are also tracked in your inventory since they often time have elevated permissions. Delete any unused Run As accounts to minimize your exposed attack surface.

- [How to get a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrole)

- [How to get members of a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrolemember)

- [Delete a Run As or Classic Run As account](delete-run-as-account.md)

- [Manage an Azure Automation Run As account](manage-runas-account.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.2: Change default passwords where applicable

**Guidance**: Azure Automation Account does not have the concept of default passwords.  Customers are responsible for third-party applications and marketplace services that may use default passwords that run on top on the service or its Hybrid Runbook Workers.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.3: Use dedicated administrative accounts

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts. Use Azure Security Center Identity and Access Management to monitor the number of administrative accounts. Whenever using Automation Account Run As accounts for your runbooks, ensure these service principals are also tracked in your inventory since they often time have elevated permissions. Scope these identities with the least privileged permissions they need in order for your runbooks to successfully perform their automated process. Delete any unused Run As accounts to minimize your exposed attack surface.

You can also enable a Just-In-Time / Just-Enough-Access by using Azure Active Directory (Azure AD) Privileged Identity Management Privileged Roles for Microsoft Services, and Azure Resource Manager.

- [Learn more about Privileged Identity Management](../active-directory/privileged-identity-management/index.yml)

- [Delete a Run As or Classic Run As account](delete-run-as-account.md)

- [Manage an Azure Automation Run As account](manage-runas-account.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.4: Use Azure Active Directory single sign-on (SSO)

**Guidance**: Wherever possible, use SSO with Azure Active Directory (Azure AD) rather than configuring individual stand-alone credentials per-service. Use Azure Security Center Identity and Access Management recommendations.

- [Single sign-on to applications in Azure AD](../active-directory/manage-apps/what-is-single-sign-on.md)

- [How to monitor identity and access within Azure Security Center](../security-center/security-center-identity-access.md)

- [Use Azure AD to authenticate to Azure](automation-use-azure-ad.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.5: Use multi-factor authentication for all Azure Active Directory-based access

**Guidance**: Enable Azure Active Directory (Azure AD) multifactor authentication and follow Azure Security Center Identity and Access Management recommendations.

- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

- [How to monitor identity and access within Azure Security Center](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

**Guidance**: Use PAWs with multifactor authentication configured to log into and configure Azure Automation Account resources in production environments. 

- [Learn about Privileged Access Workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/)

- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.7: Log and alert on suspicious activities from administrative accounts 

**Guidance**: Utilize Azure Active Directory (Azure AD) Risk Detections to view alerts and reports on risky user behavior. Optionally, customer may forward Azure Security Center Risk Detection alerts to Azure Monitor and configure custom alerting/notifications using Action Groups.

- [Understanding Azure Security Center risk detections (suspicious activity)](../active-directory/identity-protection/overview-identity-protection.md)

- [How to integrate Azure Activity Logs into Azure Monitor](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)

- [How to configure action groups for custom alerting and notification](../azure-monitor/alerts/action-groups.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.8: Manage Azure resources from only approved locations 

**Guidance**: It is recommended to use Conditional Access named locations to allow access from only specific logical groupings of IP address ranges or countries/regions. 

- [How to configure named locations in Azure](../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials. If using Hybrid Runbook Workers you may leverage managed identities instead of Run As Accounts to enable more seamless secure permissions.

- [How to create and configure an Azure AD instance](../active-directory-domain-services/tutorial-create-instance.md)

- [Use runbook authentication with managed identities](./automation-hrw-run-runbooks.md#runbook-auth-managed-identities)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.10: Regularly review and reconcile user access

**Guidance**: Azure Active Directory (Azure AD) provides logs to help discover stale accounts. In addition, use Azure identity access reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access can be reviewed on a regular basis to make sure only the right users have continued access. Whenever using Automation Account Run As accounts for your runbooks ensure these service principals are also tracked in your inventory since they often time have elevated permissions. Delete any unused Run As accounts to minimize your exposed attack surface.

- [Understand Azure AD reporting](../active-directory/reports-monitoring/index.yml)

- [How to use Azure identity access reviews](../active-directory/governance/access-reviews-overview.md)

- [Delete a Run As or Classic Run As account](delete-run-as-account.md)

- [Manage an Azure Automation Run As account](manage-runas-account.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.11: Monitor attempts to access deactivated credentials

**Guidance**: You have access to Azure Active Directory (Azure AD) Sign-in Activity, Audit and Risk Event log sources, which allow you to integrate with any SIEM/Monitoring tool.

You can streamline this process by creating Diagnostic Settings for Azure AD user accounts and sending the audit logs and sign-in logs to a Log Analytics Workspace. You can configure desired Alerts within Log Analytics Workspace.

- [How to integrate Azure Activity Logs into Azure Monitor](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.12: Alert on account sign-in behavior deviation

**Guidance**: Use Azure Active Directory (Azure AD) Risk and Identity Protection features to configure automated responses to detected suspicious actions related to user identities for your network resource. You can also ingest data into Azure Sentinel for further investigation.

- [How to view Azure AD risky sign-ins](../active-directory/identity-protection/overview-identity-protection.md)

- [How to configure and enable Identity Protection risk policies](../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

**Guidance**: For Azure Automation Accounts, Microsoft support can access platform resource metadata during an open support case without usage of another tool.

However, when using Hybrid Runbook Workers backed by Azure virtual machines and a third-party needs to access customer data (such as during a support request), use Customer Lockbox (Preview) for Azure virtual machines to review and approve or reject customer data access requests.

- [Understanding Customer Lockbox](../security/fundamentals/customer-lockbox-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](../security/benchmarks/security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags to assist in tracking Azure Automation resources which store or process sensitive information. 

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. Isolate environments by using separate Automation Account resources. Resources like Hybrid Runbook Workers should be separated by virtual network/subnet, tagged appropriately, and secured within a network security group (NSG) or Azure Firewall. For virtual machines storing or processing sensitive data, implement policy and procedure(s) to turn them off when not in use.

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create Management Groups](../governance/management-groups/create-management-group-portal.md)

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

- [How to create a Virtual Network](../virtual-network/quick-create-portal.md)

- [How to create an NSG with a Security Config](../virtual-network/tutorial-filter-network-traffic.md)

- [How to deploy Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md)

- [How to configure alert or alert and deny with Azure Firewall](../firewall/threat-intel.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: When using the Hybrid Runbook Worker feature, leverage a third-party solution from Azure Marketplace on network perimeters that monitors for unauthorized transfer of sensitive information and blocks such transfers while alerting information security professionals.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.4: Encrypt all sensitive information in transit

**Guidance**: Encrypt all sensitive information in transit. Ensure that any clients connecting to your Azure resources in Azure virtual networks are able to negotiate TLS 1.2 or higher. Azure Automation fully supports and enforces transport layer (TLS) 1.2  and all client calls or later versions for all external HTPS endpoints (through webhooks, DSC nodes, hybrid runbook worker).

Follow Azure Security Center recommendations for encryption at rest and encryption in transit, where applicable.

- [Understand encryption in transit with Azure](../security/fundamentals/encryption-overview.md#encryption-of-data-in-transit)

- [Azure Automation TLS 1.2 enforcement](../active-directory/hybrid/reference-connect-tls-enforcement.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Use a third-party active discovery tool to identify all sensitive information stored, processed, or transmitted by the organization's technology systems, including those located onsite or at a remote service provider and update the organization's sensitive information inventory.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.6: Use Role-based access control to control access to resources

**Guidance**: Use Azure role-based access control (Azure RBAC) to control access to Azure Automation resources using the built-in role definitions, assign access for users accessing your automation resources following a least privileged or 'just-enough' access model. When using Hybrid Runbook Workers, leverage managed identities for those virtual machines to avoid using service principals, when using both the multi-tenant or Hybrid Runbook Workers make sure to apply properly scoped Azure RBAC permissions on the identity of the runbook workers.

- [How to configure Azure RBAC](../role-based-access-control/role-assignments-portal.md)

- [Runbook permissions for a Hybrid Runbook Worker](./automation-hybrid-runbook-worker.md#runbook-permissions-for-a-hybrid-runbook-worker)

- [Manage role permissions and security](automation-role-based-access-control.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.7: Use host-based data loss prevention to enforce access control

**Guidance**: Azure Automation does not currently expose the underlying multi-tenant runbook worker's virtual machines, and this is handled by the platform. This control is not applicable if you are using the out-of-the box service without Hybrid Runbook Workers.

If you are using Hybrid Runbook Workers backed by Azure virtual machines, then you need to use a third-party host-based data loss prevention solution to enforce access controls to your hosted Hybrid Runbook Worker virtual machines.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.8: Encrypt sensitive information at rest

**Guidance**: Use customer-managed keys with Azure Automation. Azure Automation supports the use of customer-managed keys to encrypt all 'Secure assets' used such as: credentials, certificates, connections, and encrypted variables. Leverage encrypted variables with your runbooks for all of your persistent variable lookup needs to prevent unintended exposure.

When using Hybrid Runbook Workers, the virtual disks on the virtual machines are encrypted at rest using either server-side encryption or Azure disk encryption (ADE). Azure disk encryption leverages the BitLocker feature of Windows to encrypt managed disks with customer-managed keys within the guest VM. Server-side encryption with customer-managed keys improves on ADE by enabling you to use any OS types and images for your VMs by encrypting data in the Storage service.

- [Server side encryption of Azure managed disks](../virtual-machines/disk-encryption.md)

- [Azure Disk Encryption for Windows VMs](../virtual-machines/windows/disk-encryption-overview.md)

- [Use of customer-managed keys for an Automation account](./automation-secure-asset-encryption.md#use-of-customer-managed-keys-for-an-automation-account)

- [Managed variables in Azure Automation](shared-resources/variables.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Automation**:

[!INCLUDE [Resource Policy for Microsoft.Automation 4.8](../../includes/policy/standards/asb/rp-controls/microsoft.automation-4-8.md)]

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with Azure Activity Log to create alerts for when changes take place to critical Azure resources like networking components, Azure Automation accounts, and runbooks. 

- [Diagnostic logging for a network security group](../private-link/private-link-overview.md#logging-and-monitoring)

- [How to create alerts for Azure Activity Log events](../azure-monitor/alerts/alerts-activity-log.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Vulnerability Management

*For more information, see the [Azure Security Benchmark: Vulnerability Management](../security/benchmarks/security-control-vulnerability-management.md).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: Follow recommendations from Azure Security Center on performing vulnerability assessments on your Azure resources

- [Security recommendations in Azure Security Center](../security-center/security-center-recommendations.md)

- [Security Center recommendation reference](../security-center/recommendations-reference.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.4: Compare back-to-back vulnerability scans

**Guidance**: Export scan results at consistent intervals and compare the results to verify that vulnerabilities have been remediated. When using vulnerability management recommendation suggested by Azure Security Center, customer may pivot into the selected solution's portal to view historical scan data.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

**Guidance**: Use the default risk ratings (Secure Score) provided by Azure Security Center to help prioritize the remediation of discovered vulnerabilities.

- [Understand Azure Security Center Secure Score](../security-center/secure-score-security-controls.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Inventory and Asset Management

*For more information, see the [Azure Security Benchmark: Inventory and Asset Management](../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

**Guidance**: Use Azure Resource Graph to query and discover all Azure Automation resources within your subscriptions. Ensure you have appropriate (read) permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions.

- [How to create queries with Azure Resource Graph](../governance/resource-graph/first-query-portal.md)

- [How to view your Azure Subscriptions](/powershell/module/az.accounts/get-azsubscription)

- [Understand Azure RBAC](../role-based-access-control/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy. 

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track Azure Automation resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner. Delete any unused Run As accounts to minimize your exposed attack surface.

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create Management Groups](../governance/management-groups/create-management-group-portal.md)

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

- [Delete a Run As or Classic Run As account](delete-run-as-account.md)

- [Manage an Azure Automation Run As account](manage-runas-account.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.4: Define and maintain inventory of approved Azure resources

**Guidance**: You will need to create an inventory of approved Azure resources and approved software for compute resources as per your organizational needs.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions: 

- Not allowed resource types 
- Allowed resource types 

In addition, use the Azure Resource Graph to query/discover resources within subscriptions. This can help in high security-based environments, such as those with Storage accounts. 

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md) 

- [How to create queries with Azure Resource Graph](../governance/resource-graph/first-query-portal.md)

- [Azure Policy sample built-ins for Azure Automation](policy-reference.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.7: Remove unapproved Azure resources and software applications

**Guidance**: Customer may prevent resource creation or usage with Azure Policy as required by the customer's company guidelines. You can implement your own process for removing unauthorized resources. Within the Azure Automation offering it is possible to install, remove, and manage the PowerShell, or Python modules that runbooks can access via the Portal or cmdlets. Unapproved or old module should be removed or updated for the runbooks.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Manage module in Azure Automation](shared-resources/modules.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.9: Use only approved Azure services

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:
- Not allowed resource types
- Allowed resource types

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to deny a specific resource type with Azure Policy](../governance/policy/samples/built-in-policies.md#general)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.11: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Use Azure Conditional Access policies to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App from unsecured or unapproved locations, or devices. 

- [How to configure Conditional Access to block access to Azure Resource Manager](../role-based-access-control/conditional-access-azure-management.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Secure Configuration

*For more information, see the [Azure Security Benchmark: Secure Configuration](../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Use Azure Policy aliases to create custom policies to audit or enforce the configuration of your Azure Automation and related resources. You may also use built-in Azure Policy definitions.

Also, Azure Resource Manager has the ability to export the template in JavaScript Object Notation (JSON), which should be reviewed to ensure that the configurations meet / exceed the security requirements for your organization.

You may also use recommendations from Azure Security Center as a secure configuration baseline for your Azure resources.

- [How to view available Azure Policy Aliases](/powershell/module/az.resources/get-azpolicyalias)

- [Tutorial: Create and manage policies to enforce compliance](../governance/policy/tutorials/create-and-manage.md)

- [Azure Policy sample built-ins for Azure Automation](policy-reference.md)

- [Single and multi-resource export to a template in Azure portal](../azure-resource-manager/templates/export-template-portal.md)

- [Security recommendations - a reference guide](../security-center/recommendations-reference.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure Resource Manager templates and Azure Policy to securely configure Azure resources associated with Azure Automation. Azure Resource Manager templates are JSON-based files used to deploy Azure resources, and any custom templates will need to be stored and maintained securely in a code repository. Use the source control integration feature to keep your runbooks in your Automation account up to date with scripts in your source control repository. Use Azure Policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.

- [Use source control integration](source-control-integration.md)

- [Information on creating Azure Resource Manager templates](../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md) 

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md) 

- [Understanding Azure Policy Effects](../governance/policy/concepts/effects.md)

- [Deploy an Automation Account using an Azure Resource Manager template](/azure/automation/quickstart-create-automation-account-template)

- [Azure Policy sample built-ins for Azure Automation](policy-reference.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.5: Securely store configuration of Azure resources

**Guidance**: Use Azure DevOps to securely store and manage your code like custom Azure policies, Azure Resource Manager templates, and Desired State Configuration scripts. To access the resources you manage in Azure DevOps, you can grant or deny permissions to specific users, built-in security groups, or groups defined in Azure Active Directory (Azure AD) if integrated with Azure DevOps, or Active Directory if integrated with TFS. Use the source control integration feature to keep your runbooks in your Automation account up to date with scripts in your source control repository.

- [How to store code in Azure DevOps](/azure/devops/repos/git/gitworkflow)

- [About permissions and groups in Azure DevOps](/azure/devops/organizations/security/about-permissions)

- [Use source control integration](source-control-integration.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Define and implement standard security configurations for Azure resources using Azure Policy. Use Azure Policy aliases to create custom policies to audit or enforce the network configuration of your Azure resources. You may also make use of built-in policy definitions related to your specific resources. 

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to use Aliases](../governance/policy/concepts/definition-structure.md#aliases)

- [Azure Policy sample built-ins for Azure Automation](policy-reference.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Use Azure Policy to alert and audit Azure resource configurations, policy can be used to detect certain resource not configured with a private endpoint.

When using the Hybrid Runbook Worker feature, leverage Azure Security Center to perform baseline scans for your Azure Virtual machines.  Additional methods for automated configuration include: Azure Automation State Configuration.

- [How to remediate recommendations in Azure Security Center](../security-center/security-center-remediate-recommendations.md)

- [Getting started with Azure Automation State Configuration](automation-dsc-getting-started.md)

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Azure Policy sample built-ins for Azure Automation](policy-reference.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.13: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault. 

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Recovery

*For more information, see the [Azure Security Benchmark: Data Recovery](../security/benchmarks/security-control-data-recovery.md).*

### 9.1: Ensure regular automated back-ups

**Guidance**: Use Azure Resource Manager to deploy Azure Automation accounts, and related resources. Azure Resource Manager provides ability to export templates which can be used as backups to restore Azure Automation accounts and related resources. Use Azure Automation to call the Azure Resource Manager template export API on a regular basis.

Use the source control integration feature to keep your runbooks in your Automation account up to date with scripts in your source control repository.

- [Overview of Azure Resource Manager](../azure-resource-manager/management/overview.md)

- [Azure Resource Manager template reference for Azure Automation resources](/azure/templates/microsoft.automation/allversions)

- [Create an Automation account using an Azure Resource Manager template](quickstart-create-automation-account-template.md)

- [Single and multi-resource export to a template in Azure portal](../azure-resource-manager/templates/export-template-portal.md)

- [Resource Groups - Export Template](/rest/api/resources/resourcegroups/exporttemplate)

- [Introduction to Azure Automation](automation-intro.md)

- [How to backup key vault keys in Azure](/powershell/module/az.keyvault/backup-azkeyvaultkey)

- [Use of customer-managed keys for an Automation account](./automation-secure-asset-encryption.md#use-of-customer-managed-keys-for-an-automation-account)

- [Use source control integration](source-control-integration.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.2: Perform complete system backups and backup any customer-managed keys

**Guidance**: Use Azure Resource Manager to deploy Azure Automation accounts, and related resources. Azure Resource Manager provides ability to export templates which can be used as backups to restore Azure Automation accounts and related resources. Use Azure Automation to call the Azure Resource Manager template export API on a regular basis. Back up customer-managed keys within Azure Key Vault. You can export your runbooks to script files using either Azure portal or PowerShell.

- [Overview of Azure Resource Manager](../azure-resource-manager/management/overview.md)

- [Azure Resource Manager template reference for Azure Automation resources](/azure/templates/microsoft.automation/allversions)

- [Create an Automation account using an Azure Resource Manager template](quickstart-create-automation-account-template.md)

- [Single and multi-resource export to a template in Azure portal](../azure-resource-manager/templates/export-template-portal.md)

- [Resource Groups - Export Template](/rest/api/resources/resourcegroups/exporttemplate)

- [Introduction to Azure Automation](automation-intro.md)

- [How to backup key vault keys in Azure](/powershell/module/az.keyvault/backup-azkeyvaultkey)

- [Use of customer-managed keys for an Automation account](./automation-secure-asset-encryption.md#use-of-customer-managed-keys-for-an-automation-account)

- [Azure data backup for Automation Accounts](./automation-managing-data.md#data-backup)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.3: Validate all backups including customer-managed keys

**Guidance**: Ensure ability to periodically perform deployment of Azure Resource Manager templates on a regular basis to an isolated subscription if required. Test restoration of backed up customer-managed keys.

- [Deploy resources with ARM templates and Azure portal](../azure-resource-manager/templates/deploy-portal.md)

- [How to restore key vault keys in Azure](/powershell/module/az.keyvault/restore-azkeyvaultkey)

- [Use of customer-managed keys for an Automation account](./automation-secure-asset-encryption.md#use-of-customer-managed-keys-for-an-automation-account)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.4: Ensure protection of backups and customer-managed keys

**Guidance**: Use Azure DevOps to securely store and manage your code like Azure Resource Manager templates. To protect resources you manage in Azure DevOps, you can grant or deny permissions to specific users, built-in security groups, or groups defined in Azure Active Directory (Azure AD) if integrated with Azure DevOps, or Active Directory if integrated with TFS.

Use the source control integration feature to keep your runbooks in your Automation account up to date with scripts in your source control repository.

- [How to store code in Azure DevOps](/azure/devops/repos/git/gitworkflow)

- [About permissions and groups in Azure DevOps](/azure/devops/organizations/security/about-permissions)

- [Use source control integration](source-control-integration.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/06/27/inside-the-msrc-anatomy-of-a-ssirp-incident/)

- [Customer may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytics used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert. 

Additionally, clearly mark subscriptions (for ex. production, non-prod) using tags and create a naming system to clearly identify and categorize Azure resources, especially those processing sensitive data.  It is your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

- [Security alerts in Azure Security Center](../security-center/security-center-alerts-overview.md)

- [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems' incident response capabilities on a regular cadence to help protect your Azure resources. Identify weak points and gaps and revise plan as needed.

- [NIST's publication - Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://csrc.nist.gov/publications/detail/sp/800-84/final)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved.

- [How to set the Azure Security Center Security Contact](../security-center/security-center-provide-security-contact-details.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature to help identify risks to Azure resources. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts to Azure Sentinel.

- [How to configure continuous export](../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../sentinel/connect-azure-security-center.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.6: Automate the response to security alerts

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations to protect your Azure resources.

- [How to configure Workflow Automation and Logic Apps](../security-center/workflow-automation.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Penetration Tests and Red Team Exercises

*For more information, see the [Azure Security Benchmark: Penetration Tests and Red Team Exercises](../security/benchmarks/security-control-penetration-tests-red-team-exercises.md).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings 

**Guidance**: Follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1)

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Next steps

- See the [Azure Security Benchmark V2 overview](../security/benchmarks/overview.md)
- Learn more about [Azure security baselines](../security/benchmarks/security-baselines-overview.md)
