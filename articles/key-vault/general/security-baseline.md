---
title: Azure security baseline for Key Vault
description: The Key Vault security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: key-vault
ms.topic: conceptual
ms.date: 03/29/2021
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Key Vault

This security baseline applies guidance from the [Azure Security Benchmark version 1.0](../../security/benchmarks/overview-v1.md) to Key Vault. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Key Vault. **Controls** not applicable to Key Vault, or for which the responsibility is Microsoft's, have been excluded.

To see how Key Vault completely maps to the Azure Security Benchmark, see the [full Key Vault security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](../../security/benchmarks/security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

**Guidance**: Integrate Azure Key Vault with Azure Private Link. Azure Private Link Service enables you to access Azure Services (for example, Azure Key Vault) and Azure hosted customer/partner services over a Private Endpoint in your virtual network.

An Azure Private Endpoint is a network interface that connects you privately and securely to a service powered by Azure Private Link. The private endpoint uses a private IP address from your VNet, effectively bringing the service into your VNet. All traffic to the service can be routed through the private endpoint, so no gateways, NAT devices, ExpressRoute or VPN connections, or public IP addresses are needed. Traffic between your virtual network and the service traverses over the Microsoft backbone network, eliminating exposure from the public Internet. You can connect to an instance of an Azure resource, giving you the highest level of granularity in access control.

- [How to integrate Key Vault with Azure Private Link](/azure/key-vault/private-link-service)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.KeyVault**:

[!INCLUDE [Resource Policy for Microsoft.KeyVault 1.1](../../../includes/policy/standards/asb/rp-controls/microsoft.keyvault-1-1.md)]

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and network interfaces

**Guidance**: Use Azure Security Center and follow network protection recommendations to help secure your Key Vault-configured resources in Azure. 

- [For more information about the Network Security provided by Azure Security Center](../../security-center/security-center-network-recommendations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.4: Deny communications with known-malicious IP addresses

**Guidance**: Enable Azure DDoS Protection Standard on the Azure Virtual Networks associated with your Key Vault instances for protection against distributed denial-of-service attacks. Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious or unused Internet IP addresses.

 
- [Manage Azure DDoS Protection Standard using the Azure portal](/azure/virtual-network/manage-ddos-protection)

- [Threat detection for the Azure service layer in Azure Security Center](/azure/security-center/security-center-alerts-service-layer)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: This requirement can be met by configuring advanced threat protection (ATP) for Azure Key Vault. ATP provides an additional layer of security intelligence. This tool detects potentially harmful attempts to access or exploit Azure Key Vault accounts.

When Azure Security Center detects anomalous activity, it displays alerts. It also emails the subscription administrator with details of the suspicious activity and recommendations for how to investigate and remediate the identified threats.

- [Set up advanced threat protection for Azure Key Vault](/azure/security-center/advanced-threat-protection-key-vault)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: For resources that need access to your Azure Key Vault instances, use Azure service tags for the Azure Key Vault to define network access controls on network security groups or Azure Firewall. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., ApiManagement) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

- [Azure service tags overview](../../virtual-network/service-tags-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement standard security configurations for network resources associated with your Azure Key Vault instances with Azure Policy. Use Azure Policy aliases in the "Microsoft.KeyVault" and "Microsoft.Network" namespaces to create custom policies to audit or enforce the network configuration of your Azure Key Vault instances. You may also make use of built-in policy definitions related to Azure Key Vault, such as:
- Key Vault should use a virtual network service endpoint

For more information, see the following references:

- [Create and manage policies to enforce compliance](../../governance/policy/tutorials/create-and-manage.md)

- [Azure Policy Samples](/azure/governance/policy/samples)

- [Define and assign a blueprint in the portal](../../governance/blueprints/create-blueprint-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.10: Document traffic configuration rules

**Guidance**: Use tags for resources related to network security and traffic flow for your Azure Key Vault instances to provide metadata and logical organization.

Use the built-in Azure Policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with tags and to notify you of untagged resources.

You can use Azure PowerShell or Azure CLI to look up or perform actions on resources based on their tags.

- [Use tags to organize your Azure resources](/azure/azure-resource-manager/resource-group-using-tags)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network resources related to your Azure Key Vault instances. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place.

- [View and retrieve Azure Activity Log events](/azure/azure-monitor/platform/activity-log-view)

- [Create, view, and manage activity log alerts by using Azure Monitor](/azure/azure-monitor/platform/alerts-activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Logging and Monitoring

*For more information, see the [Azure Security Benchmark: Logging and Monitoring](../../security/benchmarks/security-control-logging-monitoring.md).*

### 2.2: Configure central security log management

**Guidance**: Ingest logs via Azure Monitor to aggregate security data generated by Azure Key Vault. Within Azure Monitor, use Azure Log Analytics workspace to query and perform analytics, and use Azure Storage Accounts for long-term/archival storage. Alternatively, you may enable and on-board data to Azure Sentinel or a third-party SIEM. 

- [Azure Key Vault logging](/azure/key-vault/key-vault-logging)

- [Quickstart: How to on-board Azure Sentinel](../../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.3: Enable audit logging for Azure resources

**Guidance**: Enable diagnostic settings on your Azure Key Vault instances for access to audit, security, and diagnostic logs. Activity logs, which are automatically available, include event source, date, user, timestamp, source addresses, destination addresses, and other useful elements.

- [Azure Key Vault logging](/azure/key-vault/key-vault-logging)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.KeyVault**:

[!INCLUDE [Resource Policy for Microsoft.KeyVault 2.3](../../../includes/policy/standards/asb/rp-controls/microsoft.keyvault-2-3.md)]

### 2.5: Configure security log storage retention

**Guidance**: Within Azure Monitor, for the Log Analytics workspace being used to hold your Azure Key Vault logs, set the retention period according to your organization's compliance regulations. Use Azure Storage Accounts for long-term/archival storage.

- [Change the data retention period](/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.6: Monitor and review logs

**Guidance**: Analyze and monitor logs for anomalous behavior and regularly review results for your Azure Key Vault-protected resources. Use Azure Monitor's Log Analytics workspace to review logs and perform queries on log data. Alternatively, you may enable and on-board data to Azure Sentinel or a third-party SIEM. 

- [On-board Azure Sentinel](../../sentinel/quickstart-onboard.md)

- [Get started with Log Analytics in Azure Monitor](/azure/azure-monitor/log-query/get-started-portal)

- [Get started with log queries in Azure Monitor](/azure/azure-monitor/log-query/get-started-queries)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.7: Enable alerts for anomalous activities

**Guidance**: In Azure Security Center, enable advanced threat protection (ATP) for Key Vault. Enable diagnostic settings in Azure Key Vault and send logs to a Log Analytics workspace. Onboard your Log Analytics workspace to Azure Sentinel as it provides a security orchestration automated response (SOAR) solution. This allows for playbooks (automated solutions) to be created and used to remediate security issues.

- [Quickstart: On-board Azure Sentinel](../../sentinel/quickstart-onboard.md)

- [Manage and respond to security alerts in Azure Security Center](../../security-center/security-center-managing-and-responding-alerts.md)

- [Respond to events with Azure Monitor Alerts](/azure/azure-monitor/learn/tutorial-response)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](../../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Maintain an inventory of your Azure Active Directory (Azure AD)-registered applications, as well as any user accounts that have access to your Azure Key Vault keys, secrets, and certificates. You may use either the Azure portal or PowerShell to query and reconcile Key Vault access. To view access in PowerShell, use the following command:

(Get-AzResource -ResourceId [KeyVaultResourceID]).Properties.AccessPolicies

- [Registering an application with Azure AD](/azure/key-vault/key-vault-manage-with-cli2#registering-an-application-with-azure-active-directory)

- [Secure access to a key vault](security-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.3: Use dedicated administrative accounts

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts that have access to your Azure Key Vault instances. Use Azure Security Center Identity and Access Management (currently in preview) to monitor the number of active administrative accounts.

- [Monitor identity and access (preview)](../../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.4: Use Azure Active Directory single sign-on (SSO)

**Guidance**: Use an Azure service principal in conjunction with the AppId, TenantID, and ClientSecret, to seamlessly authenticate your application and retrieve the token that will be used to access your Azure Key Vault secrets.

- [Service-to-service authentication to Azure Key Vault using .NET](/azure/key-vault/service-to-service-authentication)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.5: Use multi-factor authentication for all Azure Active Directory-based access

**Guidance**: Enable Azure Active Directory (Azure AD) multifactor authentication and follow Azure Security Center Identity and Access Management (currently in preview) recommendations to help protect your Event Hub-enabled resources.

- [Plan an Azure AD Multi-Factor Authentication deployment](../../active-directory/authentication/howto-mfa-getstarted.md)

- [Monitor identity and access (preview)](../../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.6: Use secure, Azure-managed workstations for administrative tasks

**Guidance**: Use a Privileged Access Workstation (PAW) with Azure AD multifactor authentication configured to log into and configure Key Vault enabled resources.

- [Privileged Access Workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/) 

- [Planning a cloud-based Azure AD multifactor authentication deployment](../../active-directory/authentication/howto-mfa-getstarted.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.7: Log and alert on suspicious activities from administrative accounts

**Guidance**: Use Azure Active Directory (Azure AD) Privileged Identity Management (PIM) for generation of logs and alerts when suspicious or unsafe activity occurs in the environment. Use Azure AD risk detections to view alerts and reports on risky user behavior. For additional logging, send Azure Security Center risk detection alerts into Azure Monitor and configure custom alerting/notifications using Action Groups.

Enable advanced threat protection (ATP) for Azure Key Vault to generate alerts for suspicious activity.

- [Deploy Azure AD Privileged Identity Management (PIM)](../../active-directory/privileged-identity-management/pim-deployment-plan.md)

- [Set up advanced threat protection for Azure Key Vault (preview)](/azure/security-center/advanced-threat-protection-key-vault)

- [Alerts for Azure Key Vault (Preview)](https://docs.microsoft.com/azure/security-center/alerts-reference#alerts-azurekv)

- [Azure AD risk detections](/azure/active-directory/reports-monitoring/concept-risk-events)

- [Create and manage action groups in the Azure portal](/azure/azure-monitor/platform/action-groups)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.8: Manage Azure resources from only approved locations

**Guidance**: Configure the location condition of a Conditional Access policy and manage your named locations. With named locations, you can create logical groupings of IP address ranges or countries and regions. You can restrict access to sensitive resources, such as your Key Vault secrets, to your configured named locations.

- [What is the location condition in Azure Active Directory (Azure AD) Conditional Access?](../../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system for Azure resources such as Key Vault. This allows for Azure role-based access control (Azure RBAC) to administrate sensitive resources.

- [Create a new tenant in Azure AD](../../active-directory/fundamentals/active-directory-access-create-new-tenant.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.10: Regularly review and reconcile user access

**Guidance**: Review Azure Active Directory (Azure AD) logs to help discover stale accounts with Azure Key Vault administrative roles. In addition, use Azure AD access reviews to efficiently manage group memberships, access to enterprise applications that may be used to access Azure Key Vault, and role assignments. User access should be reviewed on a regular basis such as every 90 days to make sure only the right users have continued access.

- [Azure AD reports and monitoring documentation](/azure/active-directory/reports-monitoring/)

- [What are Azure AD access reviews?](../../active-directory/governance/access-reviews-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.11: Monitor attempts to access deactivated credentials

**Guidance**: Enable diagnostic settings for Azure Key Vault and Azure Active Directory (Azure AD), sending all logs to a Log Analytics workspace. Configure desired alerts (such as attempts to access disabled secrets) within Log Analytics.

- [Integrate Azure AD logs with Azure Monitor logs](/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)

- [Migrating from the old Key Vault solution](/azure/azure-monitor/insights/azure-key-vault#migrating-from-the-old-key-vault-solution)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.12: Alert on account sign-in behavior deviation

**Guidance**: Use Azure Active Directory (Azure AD)'s Identity Protection and risk detection features to configure automated responses to detected suspicious actions related to your Azure Key Vault protected resources. You should enable automated responses through Azure Sentinel to implement your organization's security responses.

- [Risky sign-ins report in the Azure AD portal](/azure/active-directory/reports-monitoring/concept-risky-sign-ins)

- [How To: Configure and enable risk policies](../../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)

- [How to onboard Azure Sentinel](../../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](../../security/benchmarks/security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags to assist in tracking Azure resources that store or process sensitive information on Azure Key Vault enabled resources. 

- [Use tags to organize your Azure resources](/azure/azure-resource-manager/resource-group-using-tags)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: You can secure access to Azure Key Vault by making use of virtual network service endpoints configured to restrict access to specific subnets.

After firewall rules are in effect, you can only perform Azure Key Vault data plane operations when your request originates from allowed subnets or IP address ranges. This also applies to Azure Key Vault access in the Azure portal. Although you can browse to a key vault from the Azure portal, you may not be able to list keys, secrets, or certificates if your client machine is not on the allowed list. This also affects the Azure Key Vault Picker and other Azure services. You may be able to see lists of Key Vaults, but not list keys, if firewall rules prevent your client machine from doing so.

- [Configure Azure Key Vault firewalls and virtual networks](/azure/key-vault/key-vault-network-security)

- [Virtual network service endpoints for Azure Key Vault](/azure/key-vault/key-vault-overview-vnet-service-endpoints)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: All data stored within Azure Key Vault is considered sensitive. Use Azure Key Vault data plane access controls to control access to Azure Key Vault secrets. You may also use Key Vault's built-in firewall to control access at the network layer. To monitor access to Azure Key Vault, enable Key Vault Diagnostic Settings and send logs to an Azure Storage Account or Log Analytics workspace.

- [Secure access to a key vault](security-overview.md)

- [Configure Azure Key Vault firewalls and virtual networks](/azure/key-vault/key-vault-network-security)

- [Azure Key Vault logging](/azure/key-vault/key-vault-logging)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.6: Use Azure RBAC to manage access to resources

**Guidance**: Secure access to the management and data plane of your Azure Key Vault instances.

- [Secure access to a key vault](security-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use the Azure Key Vault Analytics solution in Azure Monitor to review Azure Key Vault audit event logs.

- [Azure Key Vault Analytics solution in Azure Monitor](/azure/azure-monitor/insights/azure-key-vault)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Vulnerability Management

*For more information, see the [Azure Security Benchmark: Vulnerability Management](../../security/benchmarks/security-control-vulnerability-management.md).*

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

**Guidance**: Use the default risk ratings (Secure Score) provided by Azure Security Center.

- [Improve your Secure Score in Azure Security Center](/azure/security-center/security-center-secure-score)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Inventory and Asset Management

*For more information, see the [Azure Security Benchmark: Inventory and Asset Management](../../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

**Guidance**: Use Azure Resource Graph to query and discover all resources (including Azure Key Vault instances) within your subscription. Ensure you have appropriate (read) permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions.

- [Run your first Resource Graph query using Azure Resource Graph Explorer](../../governance/resource-graph/first-query-portal.md)

- [Get subscriptions that the current account can access](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-4.8.0&amp;preserve-view=true)

- [Azure role-based access control (RBAC)](../../role-based-access-control/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure Key Vault resources giving metadata to logically organize them into a taxonomy.

- [How to create and use Tags](/azure/azure-resource-manager/resource-group-using-tags)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track Azure Key Vault instances and related resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

- [Create an additional Azure subscription](/azure/billing/billing-create-subscription)

- [Create management groups for resource organization and management](/azure/governance/management-groups/create)

- [Use tags to organize your Azure resources](/azure/azure-resource-manager/resource-group-using-tags)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure policies to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

In addition, use the Azure Resource Graph to query/discover resources within the subscription(s).

- [Tutorial: Create and manage policies to enforce compliance](../../governance/policy/tutorials/create-and-manage.md)

- [Quickstart: Run your first Resource Graph query using Azure Resource Graph Explorer](../../governance/resource-graph/first-query-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.9: Use only approved Azure services

**Guidance**: Use Azure policies to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

For more information, see the following references:

- [Tutorial: Create and manage policies to enforce compliance](../../governance/policy/tutorials/create-and-manage.md)

- [Azure Policy Samples](/azure/governance/policy/samples/built-in-policies#general)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.11: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Use the Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App. This can prevent the creation and changes to resources within a high security environment, such as those with Key Vault configuration.

- [Manage access to Azure management with Conditional Access](../../role-based-access-control/conditional-access-azure-management.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Secure Configuration

*For more information, see the [Azure Security Benchmark: Secure Configuration](../../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Use Azure Policy aliases in the "Microsoft.KeyVault" namespace to create custom policies to audit or enforce the configuration of your Azure Key Vault instances. You may also use built-in Azure Policy definitions for Azure Key Vault such as:

- Key Vault objects should be recoverable

- Deploy Diagnostic Settings for Key Vault to Log Analytics workspace

- Diagnostic logs in Key Vault should be enabled

- Key Vault should use a virtual network service endpoint

- Deploy Diagnostic Settings for Key Vault to Event Hub

- Use recommendations from Azure Security Center as a secure configuration baseline for your Azure Key Vault instances.

For more information, see the following references:

- [How to view available Azure Policy aliases](https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-4.8.0&amp;preserve-view=true)

- [Tutorial: Create and manage policies to enforce compliance](../../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] to enforce secure settings across your Azure Key Vault-enabled resources. 

- [Create and manage policies to enforce compliance](../../governance/policy/tutorials/create-and-manage.md)

  
- [Understand Azure Policy effects](../../governance/policy/concepts/effects.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.5: Securely store configuration of Azure resources

**Guidance**: If using custom Azure Policy definitions for your Azure Key Vault enabled resources, use Azure Repos to securely store and manage your code.

- [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops&amp;preserve-view=true)

- [Azure Repos Documentation](https://docs.microsoft.com/azure/devops/repos/?view=azure-devops&amp;preserve-view=true)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Use Azure Policy aliases in the "Microsoft.KeyVault" namespace to create custom policies to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.

- [How to configure and manage Azure Policy](../../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Use Azure Security Center to perform baseline scans for your Azure Key Vault-protected resources.

- [How to remediate recommendations in Azure Security Center](../../security-center/security-center-remediate-recommendations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.11: Manage Azure secrets securely

**Guidance**: Use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure secrets management for your cloud applications. Ensure that Azure Key Vault soft-delete is enabled.

- [Integrate with Azure Managed Identities](../../azure-app-configuration/howto-integrate-azure-managed-service-identity.md)

- [Create a Key Vault](quick-create-portal.md)

- [Authenticate to Key Vault](authentication.md)

- [Assign a Key Vault access policy](assign-access-policy-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.KeyVault**:

[!INCLUDE [Resource Policy for Microsoft.KeyVault 7.11](../../../includes/policy/standards/asb/rp-controls/microsoft.keyvault-7-11.md)]

### 7.12: Manage identities securely and automatically

**Guidance**: Use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure secret management for your cloud applications.

  

- [How to integrate with Azure Managed Identities](../../azure-app-configuration/howto-integrate-azure-managed-service-identity.md) 

- [How to create a Key Vault](quick-create-portal.md)    

- [How to authenticate to Key Vault](authentication.md)

- [Assign a Key Vault access policy](assign-access-policy-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.13: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.  
  
- [ How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Malware Defense

*For more information, see the [Azure Security Benchmark: Malware Defense](../../security/benchmarks/security-control-malware-defense.md).*

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure Key Vault), however, it does not run on customer content.

Pre-scan any content being uploaded or sent to non-compute Azure resources such as Azure Key Vault. Microsoft cannot access your data in these instances.

- [Understand Microsoft Antimalware for Azure Cloud Services and Virtual Machines](../../security/fundamentals/antimalware.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Recovery

*For more information, see the [Azure Security Benchmark: Data Recovery](../../security/benchmarks/security-control-data-recovery.md).*

### 9.1: Ensure regular automated back-ups

**Guidance**: Ensure regular automated backups of your Key Vault Certificates, Keys, Managed Storage Accounts, and Secrets, with the following PowerShell commands:

- Backup-AzKeyVaultCertificate

- Backup-AzKeyVaultKey

- Backup-AzKeyVaultManagedStorageAccount

- Backup-AzKeyVaultSecret

Optionally, you may store your Key Vault backups within Azure Backup.

- [How to backup Key Vault Certificates](https://docs.microsoft.com/powershell/module/az.keyvault/backup-azkeyvaultcertificate?view=azps-5.3.0&amp;preserve-view=true)

- [How to backup Key Vault Keys](https://docs.microsoft.com/powershell/module/az.keyvault/backup-azkeyvaultkey?view=azps-5.3.0&amp;preserve-view=true)

- [How to backup Key Vault Managed Storage Accounts](/powershell/module/az.keyvault/add-azkeyvaultmanagedstorageaccount)

- [How to backup Key Vault Secrets](https://docs.microsoft.com/powershell/module/az.keyvault/backup-azkeyvaultsecret?view=azps-5.3.0&amp;preserve-view=true)

- [How to enable Azure Backup](/azure/backup)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.2: Perform complete system backups and backup any customer-managed keys

**Guidance**: Perform backups of your Key Vault Certificates, Keys, Managed Storage Accounts, and Secrets, with the following PowerShell commands:

- Backup-AzKeyVaultCertificate

- Backup-AzKeyVaultKey

- Backup-AzKeyVaultManagedStorageAccount

- Backup-AzKeyVaultSecret

Optionally, you may store your Key Vault backups within Azure Backup.

- [How to backup Key Vault Certificates](https://docs.microsoft.com/powershell/module/az.keyvault/backup-azkeyvaultcertificate?view=azps-5.3.0&amp;preserve-view=true)

- [How to backup Key Vault Keys](https://docs.microsoft.com/powershell/module/az.keyvault/backup-azkeyvaultkey?view=azps-5.3.0&amp;preserve-view=true)

- [How to backup Key Vault Managed Storage Accounts](/powershell/module/az.keyvault/add-azkeyvaultmanagedstorageaccount)

- [How to backup Key Vault Secrets](https://docs.microsoft.com/powershell/module/az.keyvault/backup-azkeyvaultsecret?view=azps-5.3.0&amp;preserve-view=true)

- [How to enable Azure Backup](/azure/backup)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.3: Validate all backups including customer-managed keys

**Guidance**: Periodically perform data restoration of your Key Vault Certificates, Keys, Managed Storage Accounts, and Secrets, with the following PowerShell commands:

- Restore-AzKeyVaultCertificate

- Restore-AzKeyVaultKey

- Restore-AzKeyVaultManagedStorageAccount

- Restore-AzKeyVaultSecret

For more information, see the following references:

- [How to restore Key Vault Certificates](https://docs.microsoft.com/powershell/module/az.keyvault/restore-azkeyvaultcertificate?view=azps-5.3.0&amp;preserve-view=true)

- [How to restore Key Vault Keys](https://docs.microsoft.com/powershell/module/az.keyvault/restore-azkeyvaultkey?view=azps-5.3.0&amp;preserve-view=true)

- [How to restore Key Vault Managed Storage Accounts](/powershell/module/az.keyvault/backup-azkeyvaultmanagedstorageaccount)

- [How to restore Key Vault Secrets](https://docs.microsoft.com/powershell/module/az.keyvault/restore-azkeyvaultsecret?view=azps-5.3.0&amp;preserve-view=true)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.4: Ensure protection of backups and customer-managed keys

**Guidance**: Ensure that soft delete is enabled for Azure Key Vault. Soft-delete allows recovery of deleted key vaults and vault objects such as keys, secrets, and certificates. 

- [How to use Azure Key Vault's soft-delete](/azure/key-vault/key-vault-soft-delete-powershell)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.KeyVault**:

[!INCLUDE [Resource Policy for Microsoft.KeyVault 9.4](../../../includes/policy/standards/asb/rp-controls/microsoft.keyvault-9-4.md)]

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](../../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review. These processes should have a focus on protecting sensitive systems, such as those using Key Vault secrets.

- [How to configure Workflow Automations within Azure Security Center](../../security-center/security-center-planning-and-operations-guide.md)   

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process)   

- [Customer may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the metric used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert. Additionally, clearly mark subscriptions (for ex. production, non-prod) and create a naming system to clearly identify and categorize Azure resources, especially those processing sensitive data such as Azure Key Vault secrets.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence to help protect your Azure Key Vault instances and related resources. Identify weak points and gaps and revise plan as needed.

- [Refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party.  Review incidents after the fact to ensure that issues are resolved.

- [How to set the Azure Security Center Security Contact](../../security-center/security-center-provide-security-contact-details.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature to help identify risks to Azure Key Vault-enabled resources. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion.  You may use the Azure Security Center data connector to stream the alerts to Azure Sentinel. 

 

- [How to configure continuous export](../../security-center/continuous-export.md) 

  

- [How to stream alerts into Azure Sentinel](../../sentinel/connect-azure-security-center.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.6: Automate the response to security alerts

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations to protect your Azure Key Vault-protected resources. 

 

- [How to configure Workflow Automation and Logic Apps](../../security-center/workflow-automation.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Penetration Tests and Red Team Exercises

*For more information, see the [Azure Security Benchmark: Penetration Tests and Red Team Exercises](../../security/benchmarks/security-control-penetration-tests-red-team-exercises.md).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

**Guidance**: Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1)

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Next steps

- See the [Azure Security Benchmark V2 overview](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
