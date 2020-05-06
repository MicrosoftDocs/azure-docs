---
title: Azure Security Baseline for Key Vault
description: Azure Security Baseline for Key Vault
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 04/10/2020
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Azure Security Baseline for Key Vault

The Azure Security Baseline for Key Vault contains recommendations that will help you improve the security posture of your deployment.

The baseline for this service is drawn from the [Azure Security Benchmark version 1.0](https://docs.microsoft.com/azure/security/benchmarks/overview), which provides recommendations on how you can secure your cloud solutions on Azure with our best practices guidance.

For more information, see [Azure Security Baselines overview](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview).

## Network Security

*For more information, see [Security Control: Network Security](https://docs.microsoft.com/azure/security/benchmarks/security-control-network-security).*

### 1.1: Protect resources using Network Security Groups or Azure Firewall on your Virtual Network

**Guidance**: Integrate Azure Key Vault with Azure Private Link. 

Azure Private Link Service enables you to access Azure Services (for example, Azure Key Vault) and Azure hosted customer/partner services over an Private Endpoint in your virtual network.

An Azure Private Endpoint is a network interface that connects you privately and securely to a service powered by Azure Private Link. The private endpoint uses a private IP address from your VNet, effectively bringing the service into your VNet. All traffic to the service can be routed through the private endpoint, so no gateways, NAT devices, ExpressRoute or VPN connections, or public IP addresses are needed. Traffic between your virtual network and the service traverses over the Microsoft backbone network, eliminating exposure from the public Internet. You can connect to an instance of an Azure resource, giving you the highest level of granularity in access control.

How to integrate Key Vault with Azure Private Link:

https://docs.microsoft.com/azure/key-vault/private-link-service


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.2: Monitor and log the configuration and traffic of Vnets, Subnets, and NICs

**Guidance**: Use Azure Security Center and follow network protection recommendations to help secure your Key Vault-configured resources in Azure. 

For more information about the Network Security provided by Azure Security Center: 

https://docs.microsoft.com/azure/security-center/security-center-network-recommendations

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.3: Protect critical web applications

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.4: Deny communications with known malicious IP addresses

**Guidance**: Enable Azure DDoS Protection Standard on the Azure Virtual Networks associated with your Key Vault instances for protection against distributed denial-of-service attacks. Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious or unused Internet IP addresses.

 
Manage Azure DDoS Protection Standard using the Azure portal: https://docs.microsoft.com/azure/virtual-network/manage-ddos-protection

Threat detection for the Azure service layer in Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-alerts-service-layer


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.5: Record network packets and flow logs

**Guidance**: Azure Key Vault does not use network security groups (NSG) and flow logs for Azure Key Vault are not captured. Instead, use Azure Private Link to secure your Azure Key Vault instances and enable diagnostic settings to record metrics and audit events.

Integrate Key Vault with Azure Private Link:

https://docs.microsoft.com/azure/key-vault/private-link-service

Azure Key Vault logging:
https://docs.microsoft.com/azure/key-vault/key-vault-logging



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.6: Deploy network based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: This requirement can be met by configuring advanced threat protection (ATP) for Azure Key Vault. ATP provides an additional layer of security intelligence. This tool detects potentially harmful attempts to access or exploit Azure Key Vault accounts.

When Azure Security Center detects anomalous activity, it displays alerts. It also emails the subscription administrator with details of the suspicious activity and recommendations for how to investigate and remediate the identified threats.

Set up advanced threat protection for Azure Key Vault:

https://docs.microsoft.com/azure/security-center/advanced-threat-protection-key-vault



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.7: Manage traffic to web applications

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: For resources that need access to your Azure Key Vault instances, use Azure service tags for the Azure Key Vault to define network access controls on network security groups or Azure Firewall. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., ApiManagement) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

Azure service tags overview: https://docs.microsoft.com/azure/virtual-network/service-tags-overview


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement standard security configurations for network resources associated with your Azure Key Vault instances with Azure Policy. Use Azure Policy aliases in the "Microsoft.KeyVault" and "Microsoft.Network" namespaces to create custom policies to audit or enforce the network configuration of your Azure Key Vault instances. You may also make use of built-in policy definitions related to Azure Key Vault, such as:

Key Vault should use a virtual network service endpoint

Tutorial: Create and manage policies to enforce compliance:

https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

Azure Policy Samples:

https://docs.microsoft.com/azure/governance/policy/samples/#networ

Quickstart: Define and assign a blueprint in the portal:

https://docs.microsoft.com/azure/governance/blueprints/create-blueprint-portal


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.10: Document traffic configuration rules

**Guidance**: Use tags for resources related to network security and traffic flow for your Azure Key Vault instances to provide metadata and logical organization.

Use any of the built-in Azure Policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with tags and to notify you of existing untagged resources.

You may use Azure PowerShell or Azure CLI to look up or perform actions on resources based on their tags.

Use tags to organize your Azure resources:

https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network resources related to your Azure Key Vault instances. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place.

View and retrieve Azure Activity Log events:

https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view

Create, view, and manage activity log alerts by using Azure Monitor:

https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Logging and Monitoring

*For more information, see [Security Control: Logging and Monitoring](https://docs.microsoft.com/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.1: Use approved time synchronization sources

**Guidance**: Not applicable; Microsoft maintains the time source used for Azure resources, such as Azure Key Vault, for timestamps in the logs.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 2.2: Configure central security log management

**Guidance**: Ingest logs via Azure Monitor to aggregate security data generated by Azure Key Vault. Within Azure Monitor, use Azure Log Analytics workspace to query and perform analytics, and use Azure Storage Accounts for long-term/archival storage. Alternatively, you may enable and on-board data to Azure Sentinel or a third-party SIEM. 

Azure Key Vault logging:

https://docs.microsoft.com/azure/key-vault/key-vault-logging

Quickstart: How to on-board Azure Sentinel:

https://docs.microsoft.com/azure/sentinel/quickstart-onboard


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

**Guidance**: Enable diagnostic settings on your Azure Key Vault instances for access to audit, security, and diagnostic logs. Activity logs, which are automatically available, include event source, date, user, timestamp, source addresses, destination addresses, and other useful elements.

Azure Key Vault logging:

https://docs.microsoft.com/azure/key-vault/key-vault-logging


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.4: Collect security logs from operating systems

**Guidance**: Not applicable; this recommendation is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.5: Configure security log storage retention

**Guidance**: Within Azure Monitor, for the Log Analytics workspace being used to hold your Azure Key Vault logs, set the retention period according to your organization's compliance regulations. Use Azure Storage Accounts for long-term/archival storage.

Change the data retention period: https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.6: Monitor and review Logs

**Guidance**: Analyze and monitor logs for anomalous behavior and regularly review results for your Azure Key Vault-protected resources. Use Azure Monitor's Log Analytics workspace to review logs and perform queries on log data. Alternatively, you may enable and on-board data to Azure Sentinel or a third party SIEM. 

Quickstart: On-board Azure Sentinel:

https://docs.microsoft.com/azure/sentinel/quickstart-onboard

Get started with Log Analytics in Azure Monitor:

https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-portal

Get started with log queries in Azure Monitor:

https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-queries


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activity

**Guidance**: In Azure Security Center, enable advanced threat protection (ATP) for Key Vault. Enable diagnostic settings in Azure Key Vault and send logs to a Log Analytics workspace. Onboard your Log Analytics workspace to Azure Sentinel as it provides a security orchestration automated response (SOAR) solution. This allows for playbooks (automated solutions) to be created and used to remediate security issues.

Quickstart: On-board Azure Sentinel:

https://docs.microsoft.com/azure/sentinel/quickstart-onboard

Manage and respond to security alerts in Azure Security Center:

https://docs.microsoft.com/azure/security-center/security-center-managing-and-responding-alerts

Respond to events with Azure Monitor Alerts:

https://docs.microsoft.com/azure/azure-monitor/learn/tutorial-response


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.8: Centralize anti-malware logging

**Guidance**: Not applicable; Azure Key Vault does not process or produce anti-malware related logs.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.9: Enable DNS query logging

**Guidance**: Not applicable; Azure Key Vault does not process or produce DNS related logs.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.10: Enable command-line audit logging

**Guidance**: Not applicable; this recommendation is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Identity and Access Control

*For more information, see [Security Control: Identity and Access Control](https://docs.microsoft.com/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Maintain an inventory of your Azure Active Directory-registered applications, as well as any user accounts that have access to your Azure Key Vault keys, secrets, and certificates. You may use either the Azure portal or PowerShell to query and reconcile Key Vault access. To view access in PowerShell, use the following command:

(Get-AzResource -ResourceId [KeyVaultResourceID]).Properties.AccessPolicies

Registering an application with Azure Active Directory:

https://docs.microsoft.com/azure/key-vault/key-vault-manage-with-cli2#registering-an-application-with-azure-active-directory

Secure access to a key vault:

https://docs.microsoft.com/azure/key-vault/key-vault-secure-your-key-vault


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.2: Change default passwords where applicable

**Guidance**: Not applicable; Azure Key Vault does not have the concept of default passwords as authentication is provided by Active Directory and secured with Role-based access control.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 3.3: Use dedicated administrative accounts

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts that have access to your Azure Key Vault instances. Use Azure Security Center Identity and Access Management (currently in preview) to monitor the number of active administrative accounts.

Monitor identity and access (preview):

https://docs.microsoft.com/azure/security-center/security-center-identity-access


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.4: Use single sign-on (SSO) with Azure Active Directory

**Guidance**: Use an Azure service principal in conjunction with the AppId, TenantID, and ClientSecret, to seamlessly authenticate your application and retrieve the token that will be used to access your Azure Key Vault secrets.

Service-to-service authentication to Azure Key Vault using .NET:

https://docs.microsoft.com/azure/key-vault/service-to-service-authentication



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

**Guidance**: Enable Azure Active Directory Multi-Factor Authentication and follow Azure Security Center Identity and Access Management (currently in preview) recommendations to help protect your Event Hub-enabled resources.

Planning a cloud-based Azure Multi-Factor Authentication deployment:

https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted

Monitor identity and access (preview):

https://docs.microsoft.com/azure/security-center/security-center-identity-access


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

**Guidance**: Use a Privileged Access Workstation (PAW) with Azure Multi-Factor Authentication (MFA) configured to log into and configure Key Vault enabled resources. 

Privileged Access Workstations: https://docs.microsoft.com/windows-server/identity/securing-privileged-access/privileged-access-workstations 

Planning a cloud-based Azure Multi-Factor Authentication deployment: https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.7: Log and alert on suspicious activity from administrative accounts

**Guidance**: Use Azure Active Directory (AAD) Privileged Identity Management (PIM) for generation of logs and alerts when suspicious or unsafe activity occurs in the environment. Use AAD risk detections to view alerts and reports on risky user behavior. For additional logging, send Azure Security Center risk detection alerts into Azure Monitor and configure custom alerting/notifications using Action Groups.

Enable advanced threat protection (ATP) for Azure Key Vault to generate alerts for suspicious activity.

Deploy Azure AD Privileged Identity Management (PIM): https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-deployment-plan

Set up advanced threat protection for Azure Key Vault (preview): https://docs.microsoft.com/azure/security-center/advanced-threat-protection-key-vault

Alerts for Azure Key Vault (Preview): https://docs.microsoft.com/azure/security-center/alerts-reference#alerts-azurekv

Azure Active Directory risk detections: https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risk-events

Create and manage action groups in the Azure portal: https://docs.microsoft.com/azure/azure-monitor/platform/action-groups



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.8: Manage Azure resources from only approved locations

**Guidance**: Configure the location condition of a Conditional Access policy and manage your named locations. With named locations, you can create logical groupings of IP address ranges or countries and regions. You can restrict access to sensitive resources, such as your Key Vault secrets, to your configured named locations.

What is the location condition in Azure Active Directory Conditional Access?: https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations



**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory (AAD) as the central authentication and authorization system for Azure resources such as Key Vault. This allows for Role-based access control (RBAC) to administrate sensitive resources.

 

Quickstart: Create a new tenant in Azure Active Directory:

https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-access-create-new-tenant


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.10: Regularly review and reconcile user access

**Guidance**: Review Azure Active Directory (AAD) logs to help discover stale accounts with Azure Key Vault administrative roles. In addition, use AAD access reviews to efficiently manage group memberships, access to enterprise applications that may be used to access Azure Key Vault, and role assignments. User access should be reviewed on a regular basis such as every 90 days to make sure only the right users have continued access.

Azure Active Directory reports and monitoring documentation:

https://docs.microsoft.com/azure/active-directory/reports-monitoring/

What are Azure AD access reviews?:

https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.11: Monitor attempts to access deactivated accounts

**Guidance**: Enable diagnostic settings for Azure Key Vault and Azure Active Directory, sending all logs to a Log Analytics workspace. Configure desired alerts (such as attempts to access disabled secrets) within Log Analytics.

Integrate Azure AD logs with Azure Monitor logs: https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics

Migrating from the old Key Vault solution: https://docs.microsoft.com/azure/azure-monitor/insights/azure-key-vault#migrating-from-the-old-key-vault-solution



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.12: Alert on account login behavior deviation

**Guidance**: Use Azure Active Directory's Identity Protection and risk detection features to configure automated responses to detected suspicious actions related to your Azure Key Vault protected resources. You should enable automated responses through Azure Sentinel to implement your organization's security responses. 

Risky sign-ins report in the Azure Active Directory portal: https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risky-sign-ins 

How To: Configure and enable risk policies: https://docs.microsoft.com/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies

How to onboard Azure Sentinel:  https://docs.microsoft.com/azure/sentinel/quickstart-onboard


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

**Guidance**: Not applicable; Customer Lockbox not supported for Azure Key Vault.

Supported services and scenarios in general availability: 
https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview#supported-services-and-scenarios-in-general-availability



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Data Protection

*For more information, see [Security Control: Data Protection](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags to assist in tracking Azure resources that store or process sensitive information on Azure Key Vault enabled resources. 

Use tags to organize your Azure resources: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: You can secure access to Azure Key Vault by making use of virtual network service endpoints configured to restrict access to specific subnets.

After firewall rules are in effect, you can only perform Azure Key Vault data plane operations when your request originates from allowed subnets or IP address ranges. This also applies to Azure Key Vault access in the Azure portal. Although you can browse to a key vault from the Azure portal, you may not be able to list keys, secrets, or certificates if your client machine is not on the allowed list. This also affects the Azure Key Vault Picker and other Azure services. You may be able to see lists of Key Vaults, but not list keys, if firewall rules prevent your client machine from doing so.

Configure Azure Key Vault firewalls and virtual networks: https://docs.microsoft.com/azure/key-vault/key-vault-network-security

Virtual network service endpoints for Azure Key Vault: https://docs.microsoft.com/azure/key-vault/key-vault-overview-vnet-service-endpoints



**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: All data stored within Azure Key Vault is considered sensitive. Use Azure Key Vault data plane access controls to control access to Azure Key Vault secrets. You may also use Key Vault's built-in firewall to control access at the network layer. To monitor access to Azure Key Vault, enable Key Vault Diagnostic Settings and send logs to an Azure Storage Account or Log Analytics workspace.

Secure access to a key vault: https://docs.microsoft.com/azure/key-vault/key-vault-secure-your-key-vault

Configure Azure Key Vault firewalls and virtual networks: https://docs.microsoft.com/azure/key-vault/key-vault-network-security

Azure Key Vault logging: https://docs.microsoft.com/azure/key-vault/key-vault-logging



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 4.4: Encrypt all sensitive information in transit

**Guidance**: All traffic to Azure Key Vault for authentication, management, and data plane access, is encrypted and goes over HTTPS: port 443. (However, there will occasionally be HTTP [port 80] traffic for CRL.) 

Access Azure Key Vault behind a firewall: https://docs.microsoft.com/azure/key-vault/key-vault-access-behind-firewall



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Not applicable; all data within Azure Key Vault (secrets, keys, and certificates) is considered sensitive.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 4.6: Use Azure RBAC to control access to resources

**Guidance**: Secure access to the management and data plane of your Azure Key Vault instances.

Secure access to a key vault:

https://docs.microsoft.com/azure/key-vault/key-vault-secure-your-key-vault


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 4.7: Use host-based data loss prevention to enforce access control

**Guidance**: Microsoft manages the underlying infrastructure for Azure Key Vault and has implemented strict controls to prevent the loss or exposure of customer data.

What is Azure Key Vault?

https://docs.microsoft.com/azure/key-vault/key-vault-overview

Azure customer data protection:

https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 4.8: Encrypt sensitive information at rest

**Guidance**: All managed objects (key, certificates, and secrets) are encrypted at rest in Azure Key Vault.

Supporting documentation:

- [Encryption Model and key management table](https://docs.microsoft.com/azure/security/fundamentals/encryption-atrest#encryption-model-and-key-management-table)


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use the Azure Key Vault Analytics solution in Azure Monitor to review Azure Key Vault audit event logs.

Azure Key Vault Analytics solution in Azure Monitor:

https://docs.microsoft.com/azure/azure-monitor/insights/azure-key-vault



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Vulnerability Management

*For more information, see [Security Control: Vulnerability Management](https://docs.microsoft.com/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: Microsoft performs vulnerability management on the underlying systems that support Azure Key Vault.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 5.2: Deploy automated operating system patch management solution

**Guidance**: N/A; Microsoft performs patch management on the underlying systems that support Key Vault.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 5.3: Deploy automated third-party software patch management solution

**Guidance**: Not applicable; this recommendation is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 5.4: Compare back-to-back vulnerability scans

**Guidance**: Microsoft performs vulnerability management on the underlying systems that support Key Vault.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

**Guidance**: Use the default risk ratings (Secure Score) provided by Azure Security Center.

Improve your Secure Score in Azure Security Center:

https://docs.microsoft.com/azure/security-center/security-center-secure-score


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Inventory and Asset Management

*For more information, see [Security Control: Inventory and Asset Management](https://docs.microsoft.com/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use Azure Asset Discovery

**Guidance**: Use Azure Resource Graph to query and discover all resources (including Azure Key Vault instances) within your subscription. Ensure you have appropriate (read) permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions.

Quickstart: Run your first Resource Graph query using Azure Resource Graph Explorer:

https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal

Get subscriptions that the current account can access.:

https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0

What is role-based access control (RBAC) for Azure resources?

https://docs.microsoft.com/azure/role-based-access-control/overview

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure Key Vault resources giving metadata to logically organize them into a taxonomy.

How to create and use Tags:

https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track Azure Key Vault instances and related resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

Create an additional Azure subscription:

https://docs.microsoft.com/azure/billing/billing-create-subscription

Create management groups for resource organization and management:

https://docs.microsoft.com/azure/governance/management-groups/create

Use tags to organize your Azure resources:
https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.4: Maintain an inventory of approved Azure resources and software titles

**Guidance**: Define list of approved Azure resources and approved software for your compute resources

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure policies to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

In addition, use the Azure Resource Graph to query/discover resources within the subscription(s).

Tutorial: Create and manage policies to enforce compliance: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

Quickstart: Run your first Resource Graph query using Azure Resource Graph Explorer: https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.6: Monitor for unapproved software applications within compute resources

**Guidance**: Not applicable; this recommendation is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.7: Remove unapproved Azure resources and software applications

**Guidance**: Not applicable; this recommendation is intended for Azure as a whole as well as compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.8: Use only approved applications

**Guidance**: Not applicable; this recommendation is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.9: Use only approved Azure services

**Guidance**: Use Azure policies to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

Tutorial: Create and manage policies to enforce compliance: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

Azure Policy Samples: https://docs.microsoft.com/azure/governance/policy/samples/not-allowed-resource-types



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.10: Implement approved application list

**Guidance**: Not applicable; this recommendation is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.11: Limit users' ability to interact with AzureResources Manager via scripts

**Guidance**: Use the Azure Conditional Access to limit users' ability to interact with Azure Resource Manager (ARM) by configuring "Block access" for the "Microsoft Azure Management" App. This can prevent the creation and changes to resources within a high security environment, such as those with Key Vault configuration.

Manage access to Azure management with Conditional Access:

https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.12: Limit users' ability to execute scripts within compute resources

**Guidance**: Not applicable; this recommendation is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.13: Physically or logically segregate high risk applications

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Secure Configuration

*For more information, see [Security Control: Secure Configuration](https://docs.microsoft.com/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Use Azure Policy aliases in the "Microsoft.KeyVault" namespace to create custom policies to audit or enforce the configuration of your Azure Key Vault instances. You may also use built-in Azure Policy definitions for Azure Key Vault such as:

Key Vault objects should be recoverable

Deploy Diagnostic Settings for Key Vault to Log Analytics workspace

Diagnostic logs in Key Vault should be enabled

Key Vault should use a virtual network service endpoint

Deploy Diagnostic Settings for Key Vault to Event Hub

Use recommendations from Azure Security Center as a secure configuration baseline for your Azure Key Vault instances.

How to view available Azure Policy aliases:

https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0

Tutorial: Create and manage policies to enforce compliance:

https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.2: Establish secure operating system configurations

**Guidance**: Not applicable; this recommendation is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] to enforce secure settings across your Azure Key Vault-enabled resources. 

Tutorial: Create and manage policies to enforce compliance:

https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage 

  
Understand Azure Policy effects: 

https://docs.microsoft.com/azure/governance/policy/concepts/effects


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.4: Maintain secure operating system configurations

**Guidance**: Not applicable; this recommendation is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.5: Securely store configuration of Azure resources

**Guidance**: If using custom Azure Policy definitions for your Azure Key Vault enabled resources, use Azure Repos to securely store and manage your code.

How to store code in Azure DevOps: 

https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops 

Azure Repos Documentation: 

https://docs.microsoft.com/azure/devops/repos/index?view=azure-devops

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.6: Securely store custom operating system images

**Guidance**: Not applicable; this recommendation is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.7: Deploy system configuration management tools

**Guidance**: Use Azure Policy aliases in the "Microsoft.KeyVault" namespace to create custom policies to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.

How to configure and manage Azure Policy:

https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.8: Deploy system configuration management tools for operating systems

**Guidance**: Not applicable; this recommendation is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.9: Implement automated configuration monitoring for Azure services

**Guidance**: Use Azure Security Center to perform baseline scans for your Azure Key Vault-protected resources 

  

How to remediate recommendations in Azure Security Center: 

https://docs.microsoft.com/azure/security-center/security-center-remediate-recommendations

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.10: Implement automated configuration monitoring for operating systems

**Guidance**: Not applicable; this benchmark is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.11: Manage Azure secrets securely

**Guidance**: Use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure secret management for your cloud applications. Ensure that Azure Key Vault soft-delete is enabled.

How to integrate with Azure Managed Identities:

https://docs.microsoft.com/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity

How to create a Key Vault:

https://docs.microsoft.com/azure/key-vault/quick-create-portal

How to provide Key Vault authentication with a managed identity: 

https://docs.microsoft.com/azure/key-vault/managed-identity

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.12: Manage identities securely and automatically

**Guidance**: Use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure secret management for your cloud applications. 

  

How to integrate with Azure Managed Identities: 

https://docs.microsoft.com/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity  

How to create a Key Vault: 

https://docs.microsoft.com/azure/key-vault/quick-create-portal    

How to provide Key Vault authentication with a managed identity:  
https://docs.microsoft.com/azure/key-vault/managed-identity

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.13: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.  
  
 How to setup Credential Scanner: 
 https://secdevtools.azurewebsites.net/helpcredscan.html

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Malware Defense

*For more information, see [Security Control: Malware Defense](https://docs.microsoft.com/azure/security/benchmarks/security-control-malware-defense).*

### 8.1: Use centrally managed anti-malware software

**Guidance**: Not applicable; this recommendation is intended for compute resources. Microsoft handles anti-malware for underlying platform.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure Key Vault), however, it does not run on customer content.

Pre-scan any content being uploaded or sent to non-compute Azure resources such as Azure Key Vault. Microsoft cannot access your data in these instances.

Understand Microsoft Antimalware for Azure Cloud Services and Virtual Machines:
 https://docs.microsoft.com/azure/security/fundamentals/antimalware

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 8.3: Ensure anti-malware software and signatures are updated

**Guidance**: Not applicable; this recommendation is intended for compute resources. Microsoft handles anti-malware for underlying platform.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Data Recovery

*For more information, see [Security Control: Data Recovery](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure regular automated back ups

**Guidance**: Ensure regular automated backups of your Key Vault Certificates, Keys, Managed Storage Accounts, and Secrets, with the following PowerShell commands:

- Backup-AzKeyVaultCertificate

- Backup-AzKeyVaultKey

- Backup-AzKeyVaultManagedStorageAccount

- Backup-AzKeyVaultSecret

Optionally, you may store your Key Vault backups within Azure Backup.

How to backup Key Vault Certificates: https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultcertificate

How to backup Key Vault Keys: https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey

How to backup Key Vault Managed Storage Accounts: https://docs.microsoft.com/powershell/module/az.keyvault/add-azkeyvaultmanagedstorageaccount

How to backup Key Vault Secrets: https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultsecret

How to enable Azure Backup: https://docs.microsoft.com/azure/backup



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.2: Perform complete system backups and backup any customer managed keys

**Guidance**: Perform backups of your Key Vault Certificates, Keys, Managed Storage Accounts, and Secrets, with the following PowerShell commands:

- Backup-AzKeyVaultCertificate

- Backup-AzKeyVaultKey

- Backup-AzKeyVaultManagedStorageAccount

- Backup-AzKeyVaultSecret

Optionally, you may store your Key Vault backups within Azure Backup.

How to backup Key Vault Certificates: https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultcertificate

How to backup Key Vault Keys: https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey

How to backup Key Vault Managed Storage Accounts: https://docs.microsoft.com/powershell/module/az.keyvault/add-azkeyvaultmanagedstorageaccount

How to backup Key Vault Secrets: https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultsecret

How to enable Azure Backup: https://docs.microsoft.com/azure/backup



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.3: Validate all backups including customer managed keys

**Guidance**: Periodically perform data restoration of your Key Vault Certificates, Keys, Managed Storage Accounts, and Secrets, with the following PowerShell commands:

- Restore-AzKeyVaultCertificate

- Restore-AzKeyVaultKey

- Restore-AzKeyVaultManagedStorageAccount

- Restore-AzKeyVaultSecret

How to restore Key Vault Certificates:  https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultcertificate?view=azurermps-6.13.0

How to restore Key Vault Keys: https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultkey?view=azurermps-6.13.0 

How to restore Key Vault Managed Storage Accounts: https://docs.microsoft.com/powershell/module/az.keyvault/backup-azkeyvaultmanagedstorageaccount

How to restore Key Vault Secrets: https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultsecret?view=azurermps-6.13.0


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.4: Ensure protection of backups and customer managed keys

**Guidance**: Ensure that soft-delete is enabled for Azure Key Vault. Soft-delete allows recovery of deleted key vaults and vault objects such as keys, secrets, and certificates. 

How to use Azure Key Vault's Soft Delete: 

https://docs.microsoft.com/azure/key-vault/key-vault-soft-delete-powershell

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Incident Response

*For more information, see [Security Control: Incident Response](https://docs.microsoft.com/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create an incident response guide

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review. These processes should have a focus on protecting sensitive systems, such as those using Key Vault secrets.

How to configure Workflow Automations within Azure Security Center: 

https://docs.microsoft.com/azure/security-center/security-center-planning-and-operations-guide   

Guidance on building your own security incident response process:  

https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/

Microsoft Security Response Center's Anatomy of an Incident:   

https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process   

Customer may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan: 

https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert. Additionally, clearly mark subscriptions (for ex. production, non-prod) and create a naming system to clearly identify and categorize Azure resources, especially those processing sensitive data such as Azure Key Vault secrets.


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence to help protect your Azure Key Vault instances and related resources. Identify weak points and gaps and revise plan as needed.

Refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities: 

https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party.  Review incidents after the fact to ensure that issues are resolved.

How to set the Azure Security Center Security Contact:

https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature to help identify risks to Azure Key Vault-enabled resources. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion.  You may use the Azure Security Center data connector to stream the alerts to Azure Sentinel. 

 

How to configure continuous export: 

https://docs.microsoft.com/azure/security-center/continuous-export 

  

How to stream alerts into Azure Sentinel: 

https://docs.microsoft.com/azure/sentinel/connect-azure-security-center

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations to protect your Azure Key Vault-protected resources. 

 

How to configure Workflow Automation and Logic Apps: 

https://docs.microsoft.com/azure/security-center/workflow-automation

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Penetration Tests and Red Team Exercises

*For more information, see [Security Control: Penetration Tests and Red Team Exercises](https://docs.microsoft.com/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings within 60 days

**Guidance**: You are not to perform pen testing on the Azure Key Vault service directly, however it is encouraged to test your Azure resources which are using Key Vault to ensure the security of the secrets.

You will need to follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies:

https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1

You can find more information on Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications, here: 

https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Next steps

- See the [Azure Security Benchmark](https://docs.microsoft.com/azure/security/benchmarks/overview)
- Learn more about [Azure Security Baselines](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview)
