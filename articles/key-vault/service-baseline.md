---
title: Security Controls for Key Vault
description: Service Baselines for Key Vault
author: msmbaldwin
manager: rkarlin

ms.service: security
ms.topic: conceptual
ms.date: 02/10/2020
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Service Baselines for Key Vault

>[!IMPORTANT]
>This preview version of the article is for review only.
> **DO NOT MERGE INTO MASTER**

## Network Security

*For more information, see [Security Control: Network Security](https://docs.microsoft.com/azure/security/benchmarks/security-control-network-security).*

### 1.1: Protect resources using Network Security Groups or Azure Firewall on your Virtual Network

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1546)*

**Guidance**: Integrate Key Vault with Azure Private Link. 

Azure Private Link Service enables you to access Azure Services (for example, Azure Key Vault) and Azure hosted customer/partner services over a Private Endpoint in your virtual network.

An Azure Private Endpoint is a network interface that connects you privately and securely to a service powered by Azure Private Link. The private endpoint uses a private IP address from your VNet, effectively bringing the service into your VNet. All traffic to the service can be routed through the private endpoint, so no gateways, NAT devices, ExpressRoute or VPN connections, or public IP addresses are needed. Traffic between your virtual network and the service traverses over the Microsoft backbone network, eliminating exposure from the public Internet. You can connect to an instance of an Azure resource, giving you the highest level of granularity in access control. 

How to integrate Key Vault with Azure Private Link: 

<https://docs.microsoft.com/azure/key-vault/private-link-service>


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.2: Monitor and log the configuration and traffic of Vnets, Subnets, and NICs

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1547)*

**Guidance**: Use Azure Security Center and follow network protection recommendations to help secure your Key Vault configured resources in Azure. For more information about the Network Security provided by Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-network-recommendations


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.3: Protect critical web applications

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1548)*

**Guidance**: 

N/A; recommendation is intended for web applications running on Azure App Service or compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: N/A

### 1.4: Deny communications with known malicious IP addresses

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1549)*

**Guidance**: Enable DDoS Standard protection on the Azure Virtual Networks associated with your Key Vault instances for protection from DDoS attacks. Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious or unused Internet IP addresses. How to configure DDoS protection: https://docs.microsoft.com/azure/virtual-network/manage-ddos-protection For more information about the Azure Security Center Integrated Threat Intelligence: https://docs.microsoft.com/azure/security-center/security-center-alerts-service-layer


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.5: Record network packets and flow logs

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1550)*

**Guidance**: 

Key Vault does not use NSGs and Flow logs for Key Vault are not captured. Instead, use Private Endpoint to secure your Key Vault instances and enable Diagnostic Settings to record metrics and audit events.

How to integrate Key Vault with Azure Private Link: 

<https://docs.microsoft.com/azure/key-vault/private-link-service>

How to enable Diagnostic Settings for log collection for Azure Key Vault: <https://docs.microsoft.com/azure/key-vault/key-vault-logging>


**Azure Security Center monitoring**: Not applicable

**Responsibility**: N/A

### 1.6: Deploy network based intrusion detection/intrusion prevention systems (IDS/IPS)

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1551)*

**Guidance**: Requirement can be met by configuring Advanced Threat Protection for Key Vault. Advanced threat protection for Azure Key Vault provides an additional layer of security intelligence. This tool detects potentially harmful attempts to access or exploit Key Vault accounts. When Security Center detects anomalous activity, it displays alerts. It also emails the subscription administrator with details of the suspicious activity and recommendations for how to investigate and remediate the identified threats. How to set up advanced threat protection for Azure Key Vault: https://docs.microsoft.com/azure/security-center/advanced-threat-protection-key-vault


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.7: Manage traffic to web applications

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1552)*

**Guidance**: N/A; benchmark is intended for web applications running on Azure App Service or compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: N/A

### 1.8: Minimize complexity and administrative overhead of network security rules

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1553)*

**Guidance**: For resource that need access to your Key Vault instances, use Virtual Network Service Tags for the Key Vault Service to define network access controls on Network Security Groups or Azure Firewall. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., ApiManagement) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change. For more information about using Service Tags: https://docs.microsoft.com/azure/virtual-network/service-tags-overview


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.9: Maintain standard security configurations for network devices

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1554)*

**Guidance**: 

Define and implement standard security configurations for network resources associated with your Azure Key Vault instances with Azure Policy. Use Azure Policy aliases in the "Microsoft.KeyVault" and "Microsoft.Network" namespaces to create custom policies to audit or enforce the network configuration of your Azure Key Vault instances. You may also make use of built-in policy definitions related to Key Vault, such as: 

Key Vault should use a virtual network service endpoint How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage Azure Policy samples for networking: https://docs.microsoft.com/azure/governance/policy/samples/#network How to create an Azure Blueprint: https://docs.microsoft.com/azure/governance/blueprints/create-blueprint-portal


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.10: Document traffic configuration rules

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1555)*

**Guidance**: Use Tags for resources related to network security and traffic flow for your Key Vault instances to provide metadata and logical organization. Use any of the built-in Azure policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with Tags and to notify you of existing untagged resources. You may use Azure PowerShell or Azure CLI to look-up or perform actions on resources based on their Tags. How to create and use Tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.11: Use automated tools to monitor network resource configurations and detect changes

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1556)*

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network resources related to your Azure Key Vault instances. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place. How to view and retrieve Azure Activity Log events: https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view How to create alerts in Azure Monitor: https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Logging and Monitoring

*For more information, see [Security Control: Logging and Monitoring](https://docs.microsoft.com/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.1: Use approved time synchronization sources

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1557)*

**Guidance**: Microsoft maintains the time source used for Azure resources such as Key Vault for timestamps in the logs.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 2.2: Configure central security log management

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1558)*

**Guidance**: Ingest logs via Azure Monitor to aggregate security data generated by Key Vault. Within Azure Monitor, use Log Analytics Workspace(s) to query and perform analytics, and use Azure Storage Accounts for long-term/archival storage. Alternatively, you may enable and on-board data to Azure Sentinel or a third-party SIEM. How to enable Diagnostic Settings for log collection for Azure Key Vault: https://docs.microsoft.com/azure/key-vault/key-vault-logging How to onboard Azure Sentinel: https://docs.microsoft.com/azure/sentinel/quickstart-onboard


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1559)*

**Guidance**: Enable Diagnostic Settings on your Key Vault instances for access to audit, security, and diagnostic logs. Activity logs, which are automatically available, include event source, date, user, timestamp, source addresses, destination addresses, and other useful elements. How to enable Diagnostic Settings for log collection for Azure Key Vault: https://docs.microsoft.com/azure/key-vault/key-vault-logging


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.4: Collect security logs from operating systems

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1560)*

**Guidance**: N/A; benchmark is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: N/A

### 2.5: Configure security log storage retention

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1561)*

**Guidance**: Within Azure Monitor, set your Log Analytics Workspace retention period according to your organization's compliance regulations to capture and review Key Vault related incidents. How to set log retention parameters for Log Analytics Workspaces: https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.6: Monitor and review Logs

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1562)*

**Guidance**: Analyze and monitor logs for anomalous behavior and regularly review results for your Key Vault protected resources. Use Azure Monitor's Log Analytics Workspace to review logs and perform queries on log data. Alternatively, you may enable and on-board data to Azure Sentinel or a third party SIEM. How to onboard Azure Sentinel: https://docs.microsoft.com/azure/sentinel/quickstart-onboard For more information about the Log Analytics Workspace: https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-portal How to perform custom queries in Azure Monitor: https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-queries


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activity

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1563)*

**Guidance**: In Azure Security Center, enable Advanced Threat Protection for Key Vault. Enable Diagnostic Settings in Key Vault and send logs to a Log Analytics Workspace. Onboard your Log Analytics Workspace to Azure Sentinel as it provides a security orchestration automated response (SOAR) solution. This allows for playbooks (automated solutions) to be created and used to remediate security issues. How to onboard Azure Sentinel: https://docs.microsoft.com/azure/sentinel/quickstart-onboard How to manage alerts in Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-managing-and-responding-alerts How to alert on log analytics log data: https://docs.microsoft.com/azure/azure-monitor/learn/tutorial-response


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.8: Centralize anti-malware logging

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1564)*

**Guidance**: N/A; Key Vault does not process anti-malware logging.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: N/A

### 2.9: Enable DNS query logging

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1565)*

**Guidance**: N/A; Key Vault is an end point and does not initiate communication. As such the service would not query DNS, so this control would not apply.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: N/A

### 2.10: Enable command-line audit logging

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1566)*

**Guidance**: N/A; benchmark is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: N/A

## Identity and Access Control

*For more information, see [Security Control: Identity and Access Control](https://docs.microsoft.com/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain an inventory of administrative accounts

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1567)*

**Guidance**: Maintain and inventory of the Azure AD registered applications as well as user accounts that have access to your Key Vault keys, secrets, and certificates. You may use the Azure Portal or PowerShell to query and reconcile Key Vault access. To view access in PowerShell, use the following command: (Get-AzResource -ResourceId [KeyVaultResourceID]).Properties.AccessPolicies Understand application registration with Key Vault: https://docs.microsoft.com/azure/key-vault/key-vault-manage-with-cli2#registering-an-application-with-azure-active-directory Understand securing access to Key Vault: https://docs.microsoft.com/azure/key-vault/key-vault-secure-your-key-vault


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.2: Change default passwords where applicable

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1568)*

**Guidance**: N/A; Key Vault does not have the concept of default passwords as authentication is provided with Active Directory and secured by Role Based Access Controls.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: N/A

### 3.3: Use dedicated administrative accounts

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1569)*

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts that have access to your Key Vault instances. Use Azure Security Center Identity and access management to monitor the number of administrative accounts. Understand Azure Security Center Identity and Access: https://docs.microsoft.com/azure/security-center/security-center-identity-access


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.4: Use single sign-on (SSO) with Azure Active Directory

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1570)*

**Guidance**: Use a Service Principal in conjunction with the AppId, TenantID, and ClientSecret, to seamlessly authenticate your application and retrieve the token that will be used to access your Key Vault secrets. Understand service-to-service authentication to Azure Key: https://docs.microsoft.com/azure/key-vault/service-to-service-authentication


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1571)*

**Guidance**: 

Enable Azure Active Directory Multifactor Authentication and follow Azure Security Center Identity and access management recommendations to help protect your Event Hub enabled resources. 

How to enable MFA in Azure: https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted How to monitor identity and access within Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-identity-access


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1572)*

**Guidance**: Use PAWs (privileged access workstations) with MFA configured to log into and configure Key Vault enabled resources. Learn about Privileged Access Workstations: https://docs.microsoft.com/windows-server/identity/securing-privileged-access/privileged-access-workstations How to enable MFA in Azure: https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.7: Log and alert on suspicious activity from administrative accounts

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1574)*

**Guidance**: Use Azure AD Privileged Identity Management (PIM) for generation of logs and alerts when suspicious or unsafe activity occurs in the environment. Use Azure AD Risk Detections to view alerts and reports on risky user behavior. For additional logging, send Azure Security Center Risk Detection alerts into Azure Monitor and configure custom alerting/notifications using Action Groups. Enable Advanced Threat Protection for Azure Key Vault to generate alerts for suspicious activity. How to deploy Privileged Identity Management (PIM): https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-deployment-plan How to setup Advanced Threat Protection for Azure Key Vault: https://docs.microsoft.com/azure/security-center/advanced-threat-protection-key-vault Understand Advanced Threat Protection alerts for Azure Key Vault: https://docs.microsoft.com/azure/security-center/alerts-reference#alerts-azurekv Understand Azure AD risk detections: https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risk-events How to configure action groups for custom alerting and notification: https://docs.microsoft.com/azure/azure-monitor/platform/action-groups


**Azure Security Center monitoring**: Not available

**Responsibility**: Customer

### 3.8: Manage Azure resources from only approved locations

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1575)*

**Guidance**: Use Conditional Access Named Locations to allow access from only specific logical groupings of IP address ranges or countries/regions to limit access to sensitive resources such as Key Vault secrets. How to configure Named Locations in Azure: https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations


**Azure Security Center monitoring**: Not available

**Responsibility**: Customer

### 3.9: Use Azure Active Directory

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1576)*

**Guidance**: Use Azure Active Directory (AAD) as the central authentication and authorization system for Azure resources such as Key Vault. This allows for Role Based Access Control to administrate sensitive resources. How to create and configure an AAD instance: https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-access-create-new-tenant


**Azure Security Center monitoring**: Not available

**Responsibility**: Customer

### 3.10: Regularly review and reconcile user access

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1577)*

**Guidance**: Review the Azure Active Directory logs to help discover stale accounts which can include those with Key Vault administrative roles. In addition, use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications that may be used to access Key Vault, and role assignments. User access should be reviewed on a regular basis such as every 90 days to make sure only the right Users have continued access. Understand Azure AD Reporting https://docs.microsoft.com/azure/active-directory/reports-monitoring/ How to use Azure Identity Access Reviews: https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.11: Monitor attempts to access deactivated accounts

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1578)*

**Guidance**: 

Enable Diagnostic Settings for Key Vault and Azure Active Directory, sending all logs to a Log Analytics Workspace. Configure desired Alerts (such as attempts to access disabled secrets) within Log Analytics Workspace. 

How to integrate Azure Activity Logs into Azure Monitor: 

<https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics> How to query Key Vault logs within Log Analytics Workspace:

[https://docs.microsoft.com/azure/azure-monitor/insights/azure-key-vault#migrating-from-the-old-key-vault-solution](https://docs.microsoft.com/en-us/azure/azure-monitor/insights/azure-key-vault#migrating-from-the-old-key-vault-solution)


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.12: Alert on account login behavior deviation

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1579)*

**Guidance**: Use Azure Active Directory's Risk and Identity Protection features to configure automated responses to detected suspicious actions related to your Key Vault protected resources. You should enable automated responses through Azure Sentinel to implement your organization's security responses. How to view Azure AD risky sign-ins: https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risky-sign-ins How to configure and enable Identity Protection risk policies: https://docs.microsoft.com/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies How to onboard Azure Sentinel: https://docs.microsoft.com/azure/sentinel/quickstart-onboard


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1580)*

**Guidance**: In support scenarios where Microsoft needs to access customer data, Customer Lockbox provides an interface for customers to review and approve or reject customer data access requests. Microsoft will not require, nor request access to your organization's secrets stored within Key Vault. Understand Customer Lockbox: https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview


**Azure Security Center monitoring**: Not applicable

**Responsibility**: N/A

## Data Protection

*For more information, see [Security Control: Data Protection](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an inventory of sensitive Information

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1581)*

**Guidance**: Use Tags to assist in tracking Azure resources that store or process sensitive information on Key Vault enabled resources. How to create and use Tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1582)*

**Guidance**: Service Endpoint for Key Vault allows you to restrict access to Key Vault to specific Subnets. After firewall rules are in effect, users can only perform Key Vault data plane operations when their requests originate from allowed Subnets or IP ranges. This also applies to accessing Key Vault from the Azure portal. Although users can browse to a key vault from the Azure portal, they might not be able to list keys, secrets, or certificates if their client machine is not in the allowed list. This also affects the Key Vault Picker by other Azure services. Users might be able to see list of key vaults, but not list keys, if firewall rules prevent their client machine. How to secure Azure Key Vault within a Vnet and Service Endpoint: https://docs.microsoft.com/azure/key-vault/key-vault-network-security For more information on how Key Vault interacts with Virtual Network Service Endpoints: https://docs.microsoft.com/azure/key-vault/key-vault-overview-vnet-service-endpoints


**Azure Security Center monitoring**: Not available

**Responsibility**: Customer

### 4.3: Monitor and block unauthorized transfer of sensitive information

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1583)*

**Guidance**: All data stored within Key Vault is considered sensitive. Use Key Vault data plane access controls to control access to Key Vault secrets. You may also use Key Vault's built-in firewall to control access at the network layer. To monitor access to key vault, enable Key Vault Diagnostic Settings and send logs to an Azure Storage Account or Log Analytics Workspace. Understand Key Vault data plane access control: https://docs.microsoft.com/azure/key-vault/key-vault-secure-your-key-vault How to configure Key Vault firewall: https://docs.microsoft.com/azure/key-vault/key-vault-network-security How to enable Key Vault Diagnostic Settings: https://docs.microsoft.com/azure/key-vault/key-vault-logging


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 4.4: Encrypt all sensitive information in transit

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1584)*

**Guidance**: All traffic to Azure Key Vault for authentication, management, and data plane access, is encrypted and goes over HTTPS: port 443. (However, there will occasionally be HTTP [port 80] traffic for CRL.) For more information about the required ports and protocol for Azure Key Vault: https://docs.microsoft.com/azure/key-vault/key-vault-access-behind-firewall


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 4.5: Use an active discovery tool to identify sensitive data

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1585)*

**Guidance**: N/A; all data within Key Vault (secrets, keys, and certificates) is considered sensitive.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: N/A

### 4.6: Use an active discovery tool to identify sensitive data

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1586)*

**Guidance**: Secure access to the management and data plane of your Key Vault instances. Information about the management plane and data plane access control for Azure Key Vault: https://docs.microsoft.com/azure/key-vault/key-vault-secure-your-key-vault


**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

### 4.7: Use host-based data loss prevention to enforce access control

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1587)*

**Guidance**: Microsoft manages the underlying infrastructure for Key Vault and has implemented strict controls to prevent the loss or exposure of customer data. Understand how keys are stored and protected in Key Vault: https://docs.microsoft.com/azure/key-vault/key-vault-overview Understand customer data protection in Azure: https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 4.8: Encrypt sensitive information at rest

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1588)*

**Guidance**: All managed objects (key, certificates, and secrets) are encrypted at rest in Key Vault. For more information on Key Vault Security Controls: https://docs.microsoft.com/azure/key-vault/key-vault-security-controls


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 4.9: Log and alert on changes to critical Azure resources

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1589)*

**Guidance**: Use the Azure Key Vault Analytics solution in Azure Monitor to review Azure Key Vault Audit Event logs. How to configure Azure Key Vault Analytics in Azure Monitor: https://docs.microsoft.com/azure/azure-monitor/insights/azure-key-vault


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Vulnerability Management

*For more information, see [Security Control: Vulnerability Management](https://docs.microsoft.com/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.1: Run automated vulnerability scanning tools

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1590)*

**Guidance**: Microsoft performs vulnerability management on the underlying systems that support Key Vault.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 5.2: Deploy automated operating system patch management solution

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1591)*

**Guidance**: N/A; Microsoft performs patch management on the underlying systems that support Key Vault.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: N/A

### 5.3: Deploy automated third-party software patch management solution

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1592)*

**Guidance**: N/A; benchmark is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: N/A

### 5.4: Compare back-to-back vulnerability scans

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1593)*

**Guidance**: Microsoft performs vulnerability management on the underlying systems that support Key Vault.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1594)*

**Guidance**: Use the default risk ratings (Secure Score) provided by Azure Security Center. Understand Azure Security Center Secure Score: https://docs.microsoft.com/azure/security-center/security-center-secure-score


**Azure Security Center monitoring**: Not available

**Responsibility**: Customer

## Inventory and Asset Management

*For more information, see [Security Control: Inventory and Asset Management](https://docs.microsoft.com/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use Azure Asset Discovery

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1595)*

**Guidance**: Use Azure Resource Graph to query and discover all resources (including Azure Key Vault instances) within your subscription(s). Ensure you have appropriate (read) permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions. How to create queries with Azure Graph: https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal How to view your Azure Subscriptions: https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0 Understand Azure RBAC: https://docs.microsoft.com/azure/role-based-access-control/overview


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.2: Maintain asset metadata

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1596)*

**Guidance**: Apply tags to Key Vault resources giving metadata to logically organize them into a taxonomy. How to create and use Tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.3: Delete unauthorized Azure resources

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1597)*

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track Key Vault instances and related resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner. How to create additional Azure subscriptions: https://docs.microsoft.com/azure/billing/billing-create-subscription How to create Management Groups: https://docs.microsoft.com/azure/governance/management-groups/create How to create and use Tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.4: Maintain an inventory of approved Azure resources and software titles

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1598)*

**Guidance**: N/A; benchmark intended for Azure as a whole.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: N/A

### 6.5: Monitor for unapproved Azure resources

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1599)*

**Guidance**: Use Azure policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions: Not allowed resource types Allowed resource types In addition, use the Azure Resource Graph to query/discover resources within the subscription(s). This can help in high security based environments, such as those with Key Vault secrets. How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage How to create queries with Azure Graph: https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.6: Monitor for unapproved software applications within compute resources

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1600)*

**Guidance**: N/A; benchmark is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: N/A

### 6.7: Remove unapproved Azure resources and software applications

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1601)*

**Guidance**: N/A; benchmark is intended for Azure as a whole as well as compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: N/A

### 6.8: Use only approved applications

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1602)*

**Guidance**: N/A; benchmark is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: N/A

### 6.9: Use only approved Azure services

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1603)*

**Guidance**: Use Azure policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions: Not allowed resource types Allowed resource types How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage How to deny a specific resource type with Azure Policy: https://docs.microsoft.com/azure/governance/policy/samples/not-allowed-resource-types


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.10: Implement approved application list

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/3352)*

**Guidance**: N/A; benchmark is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: N/A

### 6.11: Limit users' ability to interact with AzureResources Manager via scripts

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1604)*

**Guidance**: Use the Azure Conditional Access to limit users' ability to interact with ARM by configuring "Block access" for the "Microsoft Azure Management" App. This can prevent the creation and changes to resources within a high security environment, such as those with Key Vault configuration. How to configure Conditional Access to block access to ARM: https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.12: Limit users' ability to execute scripts within compute resources

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1605)*

**Guidance**: N/A; benchmark is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: N/A

### 6.13: Physically or logically segregate high risk applications

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1606)*

**Guidance**: N/A; benchmark is intended for web applications running on Azure App Service or compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: N/A

## Secure Configuration

*For more information, see [Security Control: Secure Configuration](https://docs.microsoft.com/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish secure configurations for all Azure resources

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1607)*

**Guidance**: Use Azure Policy aliases in the "Microsoft.KeyVault" namespace to create custom policies to audit or enforce the configuration of your Key Vault instances. You may also use built-in Azure policy definitions for Azure Key Vault such as: Key Vault objects should be recoverable Deploy Diagnostic Settings for Key Vault to Log Analytics workspace Diagnostic logs in Key Vault should be enabled Key Vault should use a virtual network service endpoint Deploy Diagnostic Settings for Key Vault to Event Hub Use recommendations from Azure Security Center as a secure configuration baseline for your Key Vault instances. How to view available Azure Policy Aliases: https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0 How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.2: Establish secure operating system configurations

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1608)*

**Guidance**: N/A; benchmark is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: N/A

### 7.3: Maintain secure Azure resource configurations

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1609)*

**Guidance**: Use Azure policy [deny] and [deploy if not exist] to enforce secure settings across your Key Vault enabled resources. How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage For more information about the Azure Policy Effects: https://docs.microsoft.com/azure/governance/policy/concepts/effects


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.4: Maintain secure operating system configurations

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1610)*

**Guidance**: N/A; benchmark is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: N/A

### 7.5: Securely store configuration of Azure resources

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1611)*

**Guidance**: If using custom Azure policy definitions for your Key Vault enabled resources, use Azure DevOps/Repos to securely store and manage your code. How to store code in Azure DevOps: https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops Azure Repos Documentation: https://docs.microsoft.com/azure/devops/repos/index?view=azure-devops


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.6: Securely store custom operating system images

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1612)*

**Guidance**: N/A; benchmark is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: N/A

### 7.7: Deploy system configuration management tools

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1613)*

**Guidance**: Use Azure Policy aliases in the "Microsoft.KeyVault" namespace to create custom policies to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions. How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.8: Deploy system configuration management tools for operating systems

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1614)*

**Guidance**: N/A; benchmark is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: N/A

### 7.9: Implement automated configuration monitoring for Azure services

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1615)*

**Guidance**: Use Azure Security Center to perform baseline scans for your Key Vault protected resources How to remediate recommendations in Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-remediate-recommendations


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.10: Implement automated configuration monitoring for operating systems

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1616)*

**Guidance**: N/A; benchmark is intended for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: N/A

### 7.11: Manage Azure secrets securely

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1617)*

**Guidance**: Use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure secret management for your cloud applications. Ensure Key Vault Soft Delete is enabled. How to integrate with Azure Managed Identities: https://docs.microsoft.com/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity How to create a Key Vault: https://docs.microsoft.com/azure/key-vault/quick-create-portal How to provide Key Vault authentication with a managed identity: https://docs.microsoft.com/azure/key-vault/managed-identity


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.12: Manage identities securely and automatically

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1618)*

**Guidance**: Use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure secret management for your cloud applications. How to integrate with Azure Managed Identities: https://docs.microsoft.com/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity How to create a Key Vault: https://docs.microsoft.com/azure/key-vault/quick-create-portal How to provide Key Vault authentication with a managed identity: https://docs.microsoft.com/azure/key-vault/managed-identity


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.13: Eliminate unintended credential exposure

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1619)*

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault. How to setup Credential Scanner: https://secdevtools.azurewebsites.net/helpcredscan.html


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Malware Defense

*For more information, see [Security Control: Malware Defense](https://docs.microsoft.com/azure/security/benchmarks/security-control-malware-defense).*

### 8.1: Use centrally managed anti-malware software

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1620)*

**Guidance**: N/A; benchmark is intended for compute resources. Microsoft handles anti-malware for underlying platform.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: N/A

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1621)*

**Guidance**: Microsoft Antimalware is enabled on the underlying host that supports Azure services (for example, Azure Key Vault), however it does not run on customer content. Pre-scan any content being uploaded or sent to non-compute Azure resources such as Azure Key Vault. Microsoft cannot access your data in these instances. Understand Microsoft Antimalware for Azure Cloud Services and Virtual Machines: https://docs.microsoft.com/azure/security/fundamentals/antimalware


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 8.3: Ensure anti-malware software and signatures are updated

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1622)*

**Guidance**: N/A; benchmark is intended for compute resources. Microsoft handles anti-malware for underlying platform.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: N/A

## Data Recovery

*For more information, see [Security Control: Data Recovery](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure regular automated back ups

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1624)*

**Guidance**: N/A; covered by AZ ID 9.2: "Perform complete system backups and backup any customer managed keys"


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.2: Perform complete system backups and backup any customer managed keys

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1625)*

**Guidance**: Ensure regular automated backups of your Key Vault Certificates, Keys, Managed Storage Accounts, and Secrets, with the following PowerShell commands: Backup-AzKeyVaultCertificate Backup-AzKeyVaultKey Backup-AzKeyVaultManagedStorageAccount Backup-AzKeyVaultSecret Optionally, you may store your Key Vault backups within Azure Backup. How to backup Key Vault Certificates: https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultcertificate How to backup Key Vault Keys: https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey How to backup Key Vault Managed Storage Accounts: https://docs.microsoft.com/powershell/module/az.keyvault/add-azkeyvaultmanagedstorageaccount How to backup Key Vault Secrets: https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultsecret How to enable Azure Backup: https://docs.microsoft.com/azure/backup


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.3: Validate all backups including customer managed keys

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1626)*

**Guidance**: Periodically perform data restoration of your Key Vault Certificates, Keys, Managed Storage Accounts, and Secrets, with the following PowerShell commands: Restore-AzKeyVaultCertificate Restore-AzKeyVaultKey Restore-AzKeyVaultManagedStorageAccount Restore-AzKeyVaultSecret How to restore Key Vault Certificates: https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultcertificate?view=azurermps-6.13.0 How to restore Key Vault Keys: https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultkey?view=azurermps-6.13.0 How to restore Key Vault Managed Storage Accounts: https://docs.microsoft.com/powershell/module/az.keyvault/backup-azkeyvaultmanagedstorageaccount How to restore Key Vault Secrets: https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultsecret?view=azurermps-6.13.0


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.4: Ensure protection of backups and customer managed keys

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1627)*

**Guidance**: Ensure Soft Delete is enabled for Key Vault. Key Vault's Soft Delete feature allows recovery of deleted vaults and vault objects such as keys, secrets, and certificates. How to use Azure Key Vault's Soft Delete: https://docs.microsoft.com/azure/key-vault/key-vault-soft-delete-powershell


**Azure Security Center monitoring**: Not available

**Responsibility**: Customer

## Incident Response

*For more information, see [Security Control: Incident Response](https://docs.microsoft.com/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create an incident response guide

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1629)*

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review. These processes should have a focus on protecting sensitive systems, such as those using Key Vault secrets. How to configure Workflow Automations within Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-planning-and-operations-guide Guidance on building your own security incident response process: https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/ Microsoft Security Response Center's Anatomy of an Incident: https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process Customer may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan: https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1630)*

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert. Additionally, clearly mark subscriptions (for ex. production, non-prod) and create a naming system to clearly identify and categorize Azure resources, especially those processing sensitive data such as Key Vault secrets.


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.3: Test security response procedures

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1631)*

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence to help protect your Key Vault instances and related resources. Identify weak points and gaps and revise plan as needed. Refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities: https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1632)*

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved. How to set the Azure Security Center Security Contact: https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1633)*

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature to help identify risks to Key Vault enabled resources. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts Sentinel. How to configure continuous export: https://docs.microsoft.com/azure/security-center/continuous-export How to stream alerts into Azure Sentinel: https://docs.microsoft.com/azure/sentinel/connect-azure-security-center


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1634)*

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations to protect your Key Vault protected resources. How to configure Workflow Automation and Logic Apps: https://docs.microsoft.com/azure/security-center/workflow-automation


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Penetration Tests and Red Team Exercises

*For more information, see [Security Control: Penetration Tests and Red Team Exercises](https://docs.microsoft.com/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings within 60 days

* **Note**: To revise this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_queries/edit/1635)*

**Guidance**: You are not to perform pen testing on the Key Vault service directly, however it is encouraged to test your Azure resources which are using Key Vault to ensure the security of the secrets. You will need to follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies: https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1 You can find more information on Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications, here: https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

