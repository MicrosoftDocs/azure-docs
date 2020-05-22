---
title: Azure security baseline for API Management
description: Azure security baseline for API Management
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 05/04/2020
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Azure security baseline for API Management

The Azure Security Baseline for API Management contains recommendations that will help you improve the security posture of your deployment.

The baseline for this service is drawn from the [Azure Security Benchmark version 1.0](https://docs.microsoft.com/azure/security/benchmarks/overview), which provides recommendations on how you can secure your cloud solutions on Azure with our best practices guidance.

For more information, see the [Azure security baselines overview](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview).

## Network security

*For more information, see [Security control: Network security](https://docs.microsoft.com/azure/security/benchmarks/security-control-network-security).*

### 1.1: Protect resources using Network Security Groups or Azure Firewall on your Virtual Network

**Guidance**: Azure API Management can be deployed inside an Azure Virtual Network (Vnet), so it can access backend services within the network. The developer portal and API Management gateway, can be configured to be accessible either from the Internet (External) or only within the Vnet (Internal).
- External: the API Management gateway and developer portal are accessible from the public internet via an external load balancer. The gateway can access resources within the virtual network.
- Internal: the API Management gateway and developer portal are accessible only from within the virtual network via an internal load balancer. The gateway can access resources within the virtual network.

Inbound and outbound traffic into the subnet in which API Management is deployed can be controlled using Network Security Group.

* [How to use Azure API Management with virtual networks](https://docs.microsoft.com/azure/api-management/api-management-using-with-vnet)

* [Using Azure API Management service with an internal virtual network](https://docs.microsoft.com/azure/api-management/api-management-using-with-internal-vnet)

* [Integrate API Management in an internal VNET with Application Gateway](https://docs.microsoft.com/azure/api-management/api-management-howto-integrate-internal-vnet-appgateway)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.2: Monitor and log the configuration and traffic of Vnets, Subnets, and NICs

**Guidance**: Inbound and outbound traffic into the subnet in which API Management is deployed can be controlled using Network Security groups (NSGs). Deploy an NSG to your API Management subnet and enable NSG flow logs and send logs into an Azure Storage account for traffic audit. You may also send NSG flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

Caution: When configuring an NSG on the API Management subnet, there are a set of ports that are required to be open. If any of these ports are unavailable, API Management may not operate properly and may become inaccessible.

* [Understand NSG configurations for Azure API Management](https://docs.microsoft.com/azure/api-management/api-management-using-with-vnet#-common-network-configuration-issues)

* [How to Enable NSG Flow Logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal)

* [How to Enable and use Traffic Analytics](https://docs.microsoft.com/azure/network-watcher/traffic-analytics)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.3: Protect critical web applications

**Guidance**: To protect critical Web/HTTP APIs configure API Management within a Virtual Network (Vnet) in internal mode and configure an Azure Application Gateway. Application Gateway is a PaaS service. It acts as a reverse-proxy and provides L7 load balancing, routing, web application firewall (WAF), and other services.

Combining API Management provisioned in an internal Vnet with the Application Gateway frontend enables the following scenarios:
- Use a single API Management resource for exposing all APIs to both internal consumers and external consumers.
- Use a single API Management resource for exposing a subset of APIs to external consumers.
- Provide a way of switching access to API Management from the public Internet on and off.

Note: This feature is available in the Premium and Developer tiers of API Management.

* [How to integrate API Management in an internal VNET with Application Gateway](https://docs.microsoft.com/azure/api-management/api-management-howto-integrate-internal-vnet-appgateway)

* [Understand Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.4: Deny communications with known malicious IP addresses

**Guidance**: Configure API Management within a Virtual Network (Vnet) in internal mode and configure an Azure Application Gateway. Application Gateway is a PaaS service. It acts as a reverse-proxy and provides L7 load balancing, routing, web application firewall (WAF), and other services.

Combining API Management provisioned in an internal Vnet with the Application Gateway frontend enables the following scenarios:
- Use a single API Management resource for exposing all APIs to both internal consumers and external consumers.
- Use a single API Management resource for exposing a subset of APIs to external consumers.
- Provide a way of switching access to API Management from the public Internet on and off.

Note: This feature is available in the Premium and Developer tiers of API Management.

Enable Azure DDoS Protection Standard on the Vnet associated with your API Management deployment to protect from distributed denial of service (DDoS) attacks.

Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious or unused Internet IP addresses.

* [How to integrate API Management in an internal VNET with Application Gateway](https://docs.microsoft.com/azure/api-management/api-management-howto-integrate-internal-vnet-appgateway)

* [Understand Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/)

* [How to configure Azure DDoS Protection Standard](https://docs.microsoft.com/azure/virtual-network/manage-ddos-protection)

* [Understand Azure Security Center Integrated Threat Intelligence](https://docs.microsoft.com/azure/security-center/security-center-alerts-service-layer)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.5: Record network packets and flow logs

**Guidance**: Inbound and outbound traffic into the subnet in which API Management is deployed can be controlled using Network Security Groups (NSG). Deploy an NSG to your API Management subnet and enable NSG flow logs and send logs into an Azure Storage account for traffic audit. You may also send NSG flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

Caution: When configuring an NSG on the API Management subnet, there are a set of ports that are required to be open. If any of these ports are unavailable, API Management may not operate properly and may become inaccessible.

* [Understand NSG configurations for Azure API Management](https://docs.microsoft.com/azure/api-management/api-management-using-with-vnet#-common-network-configuration-issues)

* [How to Enable NSG Flow Logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal)

* [How to Enable and use Traffic Analytics](https://docs.microsoft.com/azure/network-watcher/traffic-analytics)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.6: Deploy network based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Configure API Management within a Virtual Network (Vnet) in internal mode and configure an Azure Application Gateway. Application Gateway is a PaaS service. It acts as a reverse-proxy and provides L7 load balancing, routing, web application firewall (WAF), and other services. Application Gateway WAF provides protection from common security exploits and vulnerabilities and can run in the following two modes:
- Detection mode: Monitors and logs all threat alerts. You can turn on logging diagnostics for Application Gateway in the Diagnostics section. You must make sure that the WAF log is selected and turned on. Web application firewall doesn't block incoming requests when it's operating in Detection mode.
- Prevention mode: Blocks intrusions and attacks that the rules detect. The attacker receives a "403 unauthorized access" exception, and the connection is closed. Prevention mode records such attacks in the WAF logs.

Combining API Management provisioned in an internal Vnet with the Application Gateway frontend enables the following scenarios:
- Use a single API Management resource for exposing all APIs to both internal consumers and external consumers.
- Use a single API Management resource for exposing a subset of APIs to external consumers.
- Provide a way of switching access to API Management from the public Internet on and off.

Note: This feature is available in the Premium and Developer tiers of API Management.

* [How to integrate API Management in an internal VNET with Application Gateway](https://docs.microsoft.com/azure/api-management/api-management-howto-integrate-internal-vnet-appgateway)

* [Understand Azure Application Gateway WAF](https://docs.microsoft.com/azure/web-application-firewall/ag/ag-overview)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.7: Manage traffic to web applications

**Guidance**: To manage traffic flowing to Web/HTTP APIs deploy API Management to a Virtual Network (Vnet) associated with App Service Environment in external or internal mode.

In internal mode, configure an Azure Application Gateway in front of API Management. Application Gateway is a PaaS service. It acts as a reverse-proxy and provides L7 load balancing, routing, web application firewall (WAF), and other services. Application Gateway WAF provides protection from common security exploits and vulnerabilities.

Combining API Management provisioned in an internal Vnet with the Application Gateway frontend enables the following scenarios:
- Use a single API Management resource for exposing all APIs to both internal consumers and external consumers.
- Use a single API Management resource for exposing a subset of APIs to external consumers.
- Provide a way of switching access to API Management from the public Internet on and off.

Note: This feature is available in the Premium and Developer tiers of API Management.

* [How to expose private APIs to external consumers](https://docs.microsoft.com/azure/architecture/example-scenario/apps/publish-internal-apis-externally)

* [How to use API Management within a Vnet](https://docs.microsoft.com/azure/api-management/api-management-using-with-vnet)

* [Azure Web Application Firewall on Azure Application Gateway](https://docs.microsoft.com/azure/web-application-firewall/ag/ag-overview)

* [Understand Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/overview)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: Use Virtual Network (Vnet) Service Tags to define network access controls on Network Security Groups (NSGs) used on your API Management subnets. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., ApiManagement) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

Caution: When configuring an NSG on the API Management subnet, there are a set of ports that are required to be open. If any of these ports are unavailable, API Management may not operate properly and may become inaccessible.

* [Understanding and using Service Tags](https://docs.microsoft.com/azure/virtual-network/service-tags-overview)

* [Ports required for API Management](https://docs.microsoft.com/azure/api-management/api-management-using-with-vnet#-common-network-configuration-issues)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement standard security configurations for network settings related to your Azure API Management deployments. Use Azure Policy aliases in the "Microsoft.ApiManagement" and "Microsoft.Network" namespaces to create custom policies to audit or enforce network configuration of your Azure API Management deployments and related resources. You may also make use of built-in policy definitions for Azure Virtual Networks, such as:
- DDoS Protection Standard should be enabled

You may also use Azure Blueprints to simplify large-scale Azure deployments by packaging key environment artifacts, such as Azure Resource Manager templates, role-based access control (RBAC), and policies in a single blueprint definition. You can easily apply the blueprint to new subscriptions, environments, and fine-tune control and management through versioning.

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

* [How to create an Azure Blueprint](https://docs.microsoft.com/azure/governance/blueprints/create-blueprint-portal)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.10: Document traffic configuration rules

**Guidance**: Use Tags for Network Security groups (NSGs) and other resources related to network security and traffic flow. For individual NSG rules, you may use the "Description" field to specify business need and/or duration (etc.) for any rules that allow traffic to/from a network.

* [How to create and use Tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

* [How to create a Virtual Network](https://docs.microsoft.com/azure/virtual-network/quick-create-portal)

* [How to create an NSG with a Security Config](https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes to network resources associated with your Azure API Management deployments. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place.

* [How to view and retrieve Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view)

* [How to create alerts in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Logging and monitoring

*For more information, see [Security control: Logging and monitoring](https://docs.microsoft.com/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.1: Use approved time synchronization sources

**Guidance**: Microsoft maintains time sources for Azure API Management.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 2.2: Configure central security log management

**Guidance**: Within the Azure Monitor, use Log Analytics workspace(s) to query and perform analytics, send logs to Azure Storage for long-term/archival storage or offline analysis, or export logs to other analytics solution on Azure and elsewhere using Azure Event Hubs. Azure API Management outputs logs and metrics to Azure Monitor by default. Verbosity of the logging can be configured on a service-wide and per-API basis.

In addition to Azure Monitor, Azure API Management can be integrated with one or several Azure Application Insights services. Logging settings for Application Insights can be configured on either per-service or per-API basis.

Optionally, enable, and on-board data to Azure Sentinel or a third-party Security Incident and Event Management (SIEM).

* [How to configure diagnostic settings](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings#create-diagnostic-settings-in-azure-portal)

* [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

* [How to get started with Azure Monitor and third-party SIEM integration](https://azure.microsoft.com/blog/use-azure-monitor-to-integrate-with-siem-tools/)

* [How to create custom logging and analytics pipeline](https://docs.microsoft.com/azure/api-management/api-management-howto-log-event-hubs)

* [How to integrate with Azure Application Insights](https://docs.microsoft.com/azure/api-management/api-management-howto-app-insights)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

**Guidance**: For control plane audit logging, enable Azure Activity Log diagnostic settings and send activity logs to a Log Analytics workspace for reporting and analysis, to Azure Storage for long-term safekeeping, to Azure Event Hubs for export in other analytics solutions on Azure and elsewhere. Using Azure Activity Log data, you can determine the "what, who, and when" for any write operations (PUT, POST, DELETE) performed at the control plane level for your Azure API Management service.

For data plane audit logging, diagnostic logs provide rich information about operations and errors that are important for auditing as well as troubleshooting purposes. Diagnostics logs differ from activity logs. Activity logs provide insights into the operations that were performed on your Azure resources. Diagnostics logs provide insight into operations that your resource performed.

* [How to enable Diagnostic Settings for Azure Activity Log](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings-legacy)

* [How to enable Diagnostic Settings for Azure API Management](https://docs.microsoft.com/Azure/api-management/api-management-howto-use-azure-monitor#diagnostic-logs)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.4: Collect security logs from operating systems

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.5: Configure security log storage retention

**Guidance**: Within Azure Monitor, set your Log Analytics Workspace retention period according to your organization's compliance regulations. Use Azure Storage accounts for long-term/archival storage.

* [How to set log retention parameters for Log Analytics Workspaces](https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period)

* [How to archive logs to an Azure Storage account](https://docs.microsoft.com/azure/azure-monitor/platform/resource-logs-collect-storage)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.6: Monitor and review Logs

**Guidance**: Azure API Management continuously emits logs and metrics to Azure Monitor, giving you a near real-time visibility into the state and health of your APIs. With Azure Monitor and Log Analytics workspace(s), you can review, query, visualize, route, archive, configure alerts, and take actions on metrics and logs coming from API Management and related resources. Analyze and monitor logs for anomalous behaviors and regularly review results.

Optionally, integrate API Management with Azure Application Insights and use it as primary or secondary monitoring, tracing, reporting, and alerting tool.

* [How to monitor and review logs for Azure API Management](https://docs.microsoft.com/Azure/api-management/api-management-howto-use-azure-monitor)

* [How to perform custom queries in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-queries)

* [Understand Log Analytics Workspace](https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-portal)

* [How to integrate with Azure Application Insights](https://docs.microsoft.com/azure/api-management/api-management-howto-app-insights)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activity

**Guidance**: Enable Azure Activity Log diagnostic settings as well as the diagnostic settings for your Azure API Management instances and send the logs to a Log Analytics workspace. Perform queries in Log Analytics to search terms, identify trends, analyze patterns, and provide many other insights based on the collected data. You can create alerts based on your Log Analytics workspace queries.

Create metric alerts to let you know when something unexpected is happening. For example, get notifications when your Azure API Management instance has been exceeding its expected peak capacity over a certain period of time or if there has been a certain number of unauthorized gateway requests or errors over a predefined period of time.

Optionally, integrate API Management with Azure Application Insights and use it as primary or secondary monitoring, tracing, reporting, and alerting tool.

Optionally, you may enable and on-board data to Azure Sentinel or a third-party SIEM.

* [How to enable diagnostic settings for Azure Activity Log](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings-legacy)

* [How to enable diagnostic settings for Azure API Management](https://docs.microsoft.com/azure/api-management/api-management-howto-use-azure-monitor#diagnostic-logs)

* [How to configure an alert rule for unauthorized request](https://docs.microsoft.com/Azure/api-management/api-management-howto-use-azure-monitor#set-up-an-alert-rule-for-unauthorized-request)

* [How to view capacity metrics of an Azure API management instance](https://docs.microsoft.com/azure/api-management/api-management-capacity)

* [How to integrate with Azure Application Insights](https://docs.microsoft.com/azure/api-management/api-management-howto-app-insights)

* [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.8: Centralize anti-malware logging

**Guidance**: Not applicable; Azure API Management does not process or produce anti-malware related logs.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.9: Enable DNS query logging

**Guidance**: Not applicable; Azure API Management does not process or produce user accessible DNS-related logs.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.10: Enable command-line audit logging

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Identity and access control

*For more information, see [Security control: Identity and access control](https://docs.microsoft.com/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Maintain an inventory of accounts that have administrative access to the Azure API Management control plane (Azure portal).

Azure Active Directory (AD) has built-in roles that must be explicitly assigned and are queryable. API Management relies on these roles and Role-Based Access Control to enable fine-grained access management for API Management services and entities.

Additionally, API Management contains a built-in Administrators group in the API Management's user system. Groups in API Management control visibility of APIs in the developer portal and the members of the Administrators group can see all APIs.

Follow recommendations from Azure Security Center for the management and maintenance of administrative accounts.

* [How to use Role-Based Access Control in Azure API Management](https://docs.microsoft.com/azure/api-management/api-management-role-based-access-control)

* [How to get list of users under an Azure API Management Instance](https://docs.microsoft.com/powershell/module/az.apimanagement/get-azapimanagementuser?view=azps-3.1.0)

* [How to get a list of users assigned to a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/az.resources/get-azroleassignment?view=azps-3.7.0)

* [How to get a directory role definition in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/az.resources/get-azroledefinition?view=azps-3.7.0)

* [Understand identity and access recommendations from Azure Security Center](https://docs.microsoft.com/azure/security-center/recommendations-reference#recs-identity)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.2: Change default passwords where applicable

**Guidance**: Azure API Management does not have the concept of default passwords/key.

Azure API Management subscriptions, which are one means of securing access to APIs, do however come with a pair of generated subscription keys. Customers may regenerate these subscription keys at any time.

* [Understanding Azure API Management Subscriptions](https://docs.microsoft.com/azure/api-management/api-management-subscriptions)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.3: Use dedicated administrative accounts

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts. Use Azure Security Center Identity and Access Management to monitor the number of administrative accounts.

Additionally, to help you keep track of dedicated administrative accounts, you may use recommendations from Azure Security Center or built-in Azure Policies, such as:
- There should be more than one owner assigned to your subscription
- Deprecated accounts with owner permissions should be removed from your subscription
- External accounts with owner permissions should be removed from your subscription

* [How to use Azure Security Center to monitor identity and access (Preview)](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

* [How to use Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.4: Use single sign-on (SSO) with Azure Active Directory

**Guidance**: Azure API Management can be configured to leverage Azure Active Directory as an identity provider for authenticating users on the Developer Portal in order to benefit from the SSO capabilities offered by Azure AD. Once configured, new Developer Portal users can choose to follow the out-of-the-box sign-up process by first authenticating through Azure AD and then completing the sign-up process on the portal once authenticated.

* [Authorize developer accounts by using Azure Active Directory in Azure API Management](https://docs.microsoft.com/azure/api-management/api-management-howto-aad)

Alternatively, the sign-in/sign-up process can be further customized through delegation. Delegation allows you to use your existing website for handling developer sign in/sign up and subscription to products, as opposed to using the built-in functionality in the developer portal. It enables your website to own the user data and perform the validation of these steps in a custom way.

* [How to delegate user registration and product subscription](https://docs.microsoft.com/azure/api-management/api-management-howto-setup-delegation)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

**Guidance**: Enable Azure Active Directory (AD) Multi-Factor Authentication (MFA) and follow Azure Security Center Identity and Access Management recommendations.

* [How to enable MFA in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

* [How to monitor identity and access within Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

**Guidance**: Use privileged access workstations (PAW) with Multi-Factor Authentication (MFA) configured to log into and configure Azure resources.

* [Learn about Privileged Access Workstations](https://docs.microsoft.com/windows-server/identity/securing-privileged-access/privileged-access-workstations)

* [How to enable MFA in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.7: Log and alert on suspicious activity from administrative accounts

**Guidance**: Use Azure Active Directory (AD) Privileged Identity Management (PIM) for generation of logs and alerts when suspicious or unsafe activity occurs in the environment.

In addition, use Azure AD risk detections to view alerts and reports on risky user behavior.

* [How to deploy Privileged Identity Management (PIM)](https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-deployment-plan)

* [Understand Azure AD risk detections](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risk-events)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.8: Manage Azure resources from only approved locations

**Guidance**: Use Conditional Access Named Locations to allow access to the Azure portal from only specific logical groupings of IP address ranges or countries/regions.

* [How to configure Named Locations in Azure](https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.9: Use Azure Active Directory

**Guidance**: Whenever possible, use Azure AD as the central authentication and authorization system. AAD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.

Configure your Azure API Management Developer Portal to authenticate developer accounts by using Azure Active Directory.

Configure your Azure API Management instance to protect your APIs by using the OAuth 2.0 protocol with Azure Active Directory (AD).

* [How to authorize developer accounts by using Azure Active Directory in Azure API Management](https://docs.microsoft.com/azure/api-management/api-management-howto-aad)

* [How to protect an API by using OAuth 2.0 with Azure Active Directory and API Management](https://docs.microsoft.com/azure/api-management/api-management-howto-protect-backend-with-aad)

* [How to create and configure an AAD instance](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-access-create-new-tenant)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.10: Regularly review and reconcile user access

**Guidance**: Azure Active Directory provides logs to help discover stale accounts. Customers may utilize Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access can be reviewed on a regular basis to ensure that only the right users continue to have appropriate access.

Customers can maintain inventory of API Management user accounts and reconcile access as needed. In API Management, developers are the consumers of the APIs that exposed with API Management. By default, newly created developer accounts are Active, and associated with the Developers group. Developer accounts that are in an active state can be used to access all of the APIs for which they have subscriptions.

Administrators can create custom groups or leverage external groups in associated Azure Active Directory tenants. Custom and external groups can be used alongside system groups in giving developers visibility and access to API products.

* [How to manage user accounts in Azure API Management](https://docs.microsoft.com/azure/api-management/api-management-howto-create-or-invite-developers)

* [How to get list of API Management users](https://docs.microsoft.com/powershell/module/az.apimanagement/get-azapimanagementuser?view=azps-3.1.0)

* [How to create and use groups to manage developer accounts in Azure API Management](https://docs.microsoft.com/azure/api-management/api-management-howto-create-groups)

* [How to use Azure Identity Access Reviews](https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.11: Monitor attempts to access deactivated accounts

**Guidance**: Configure your Azure API Management instance to authenticate developer accounts by using Azure Active Directory as an identity provider in Azure API Management.

Configure your Azure API Management instance to protect your APIs by using the OAuth 2.0 protocol with Azure Active Directory (AD).

Configure JWT validation policy to incoming API requests to help enforce the existence and validity of a valid token.

Create diagnostic settings for Azure AD user accounts and send the audit logs and sign-in logs to a Log Analytics workspace. Configure desired alerts within Log Analytics. In addition, you may onboard the Log Analytics workspace to Azure Sentinel or a third-party SIEM.

Configure advanced monitoring with API Management by using the `log-to-eventhub` policy, capture any additional context information required for security analysis, and send to Azure Sentinel or third-party SIEM.

* [How to authorize developer accounts by using Azure Active Directory in Azure API Management](https://docs.microsoft.com/azure/api-management/api-management-howto-aad)

* [How to protect an API by using OAuth 2.0 with Azure Active Directory and API Management](https://docs.microsoft.com/azure/api-management/api-management-howto-protect-backend-with-aad)

* [API Management access restriction policies](https://docs.microsoft.com/azure/api-management/api-management-access-restriction-policies)

* [How to integrate Azure AD Logs into Azure Monitor](https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)

* [How to on-board Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

* [Advanced monitoring of APIs](https://docs.microsoft.com/azure/api-management/api-management-log-to-eventhub-sample)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.12: Alert on account login behavior deviation

**Guidance**: For account login behavior deviation on the control plane (the Azure portal), use Azure Active Directory (AD) Identity Protection and risk detection features to configure automated responses to detected suspicious actions related to user identities. You can also ingest data into Azure Sentinel for further investigation.

* [How to view Azure AD risky sign-ins](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risky-sign-ins)

* [How to configure and enable Identity Protection risk policies](https://docs.microsoft.com/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies)

* [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

**Guidance**: Not currently available; Customer Lockbox is not currently supported for Azure API Management.

* [List of Customer Lockbox-supported services](https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview#supported-services-and-scenarios-in-general-availability)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Data protection

*For more information, see [Security control: Data protection](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags to assist in tracking Azure resources that store or process sensitive information.

* [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. Azure API Management instances should be separated by virtual network (VNet)/subnet and tagged appropriately.

* [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/billing/billing-create-subscription)

* [How to create Management Groups](https://docs.microsoft.com/azure/governance/management-groups/create)

* [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

* [How to use Azure API Management with virtual networks](https://docs.microsoft.com/azure/api-management/api-management-using-with-vnet)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: Not currently available; data identification, classification, and loss prevention features are not currently available for Azure API Management.

Microsoft manages the underlying infrastructure for Azure API Management and has implemented strict controls to prevent the loss or exposure of customer data.

* [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.4: Encrypt all sensitive information in transit

**Guidance**: Management plane calls are made through Azure Resource Manager over TLS. A valid JSON web token (JWT) is required. Data plane calls can be secured with TLS and one of supported authentication mechanisms (for example, client certificate or JWT).

* [Understand data protection in Azure API Management](https://docs.microsoft.com/azure/api-management/api-management-security-controls#data-protection)

* [Manage TLS settings in Azure API Management](https://docs.microsoft.com/azure/api-management/api-management-howto-manage-protocols-ciphers)

* [Protect APIs in Azure API Management with Azure Active Directory](https://docs.microsoft.com/azure/api-management/api-management-howto-protect-backend-with-aad)

* [Protect APIs in Azure API Management with Azure Active Directory B2C](https://docs.microsoft.com/azure/api-management/howto-protect-backend-frontend-azure-ad-b2c)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Not currently available; data identification, classification, and loss prevention features are not currently available for Azure API Management. Tag Azure API Management services that may be processing sensitive information as such and implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

* [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.6: Use Azure RBAC to control access to resources

**Guidance**: Use role-based access control for controlling access to Azure API Management. Azure API Management relies on Azure Role-Based Access Control (RBAC) to enable fine-grained access management for API Management services and entities (for example, APIs and policies).

* [How to use Role-Based Access Control in Azure API Management](https://docs.microsoft.com/azure/api-management/api-management-role-based-access-control)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.7: Use host-based data loss prevention to enforce access control

**Guidance**: Not applicable; this recommendation is intended for compute resources.

Microsoft manages the underlying infrastructure for Azure API Management and has implemented strict controls to prevent the loss or exposure of customer data.

* [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.8: Encrypt sensitive information at rest

**Guidance**: Sensitive data such as certificates, keys, and secret named values are encrypted with service-managed, per service instance keys. All encryption keys are per service instance and are service managed.

* [Understand data protection/encryption at rest with Azure API Management](https://docs.microsoft.com/azure/api-management/api-management-security-controls#data-protection)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with the Azure Activity log to create alerts for when changes take place to production Azure Functions apps as well as other critical or related resources.

* [How to create alerts for Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

* [How to use Azure Monitor and Azure Activity Log in Azure API Management](https://docs.microsoft.com/azure/api-management/api-management-howto-use-azure-monitor)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Vulnerability management

*For more information, see [Security control: Vulnerability management](https://docs.microsoft.com/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: Not currently available; vulnerability assessment in Azure Security Center is not currently available for Azure API Management.

Underlying platform scanned and patched by Microsoft. Review security controls available to reduce service configuration related vulnerabilities.

* [Understanding security controls available to Azure API Management](https://docs.microsoft.com/azure/api-management/api-management-security-controls)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 5.2: Deploy automated operating system patch management solution

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 5.3: Deploy automated third-party software patch management solution

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 5.4: Compare back-to-back vulnerability scans

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

**Guidance**: Not currently available; vulnerability assessment in Azure Security Center is not currently available for Azure API Management.

Underlying platform scanned and patched by Microsoft. Customer to review security controls available to them to reduce service configuration related vulnerabilities.

* [Understanding security controls available to Azure API Management](https://docs.microsoft.com/azure/api-management/api-management-security-controls)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Inventory and asset management

*For more information, see [Security control: Inventory and asset management](https://docs.microsoft.com/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use Azure Asset Discovery

**Guidance**: Use Azure Resource Graph to query/discover all resources (such as compute, storage, network, ports, and protocols etc.) within your subscription(s). Ensure appropriate (read) permissions in your tenant and enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use Azure Resource Manager resources going forward.

* [How to create queries with Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

* [How to view your Azure Subscriptions](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0)

* [Understand Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/overview)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

* [How to create and utilize Tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track Azure resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

In addition, use Azure policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:
- Not allowed resource types
- Allowed resource types

* [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/billing/billing-create-subscription)

* [How to create Management Groups](https://docs.microsoft.com/azure/governance/management-groups/create)

* [How to create and use Tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.4: Maintain an inventory of approved Azure resources and software titles

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in your subscription(s) using the following built-in policy definitions:
- Not allowed resource types
- Allowed resource types

Use Azure Resource Graph to query/discover resources within their subscription(s). Ensure that all Azure resources present in the environment are approved.

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

* [How to create queries with Azure Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.6: Monitor for unapproved software applications within compute resources

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.7: Remove unapproved Azure resources and software applications

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.8: Use only approved applications

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.9: Use only approved Azure services

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:
- Not allowed resource types
- Allowed resource types

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

* [How to deny a specific resource type with Azure Policy](https://docs.microsoft.com/azure/governance/policy/samples/not-allowed-resource-types)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.10: Implement approved application list

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.11: Limit users' ability to interact with Azure Resources Manager via scripts

**Guidance**: Configure Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

* [How to configure Conditional Access to block access to Azure Resource Manager](https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management)

* [Role-based access control in Azure API Management](https://docs.microsoft.com/azure/api-management/api-management-role-based-access-control)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.12: Limit users' ability to execute scripts within compute resources

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.13: Physically or logically segregate high risk applications

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Secure configuration

*For more information, see [Security control: Secure configuration](https://docs.microsoft.com/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Define and implement standard security configurations for your Azure API Management service with Azure Policy. Use Azure Policy aliases in the "Microsoft.ApiManagement" namespace to create custom policies to audit or enforce the configuration of your Azure API Management services.

* [How to view available Azure Policy Aliases](https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0)

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.2: Establish secure operating system configurations

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Define and implement standard security configurations for your Azure API Management services with Azure Policy. Use Azure Policy aliases in the "Microsoft.ApiManagement" namespace to create custom policies to audit or enforce the configuration of Azure API Management instances. Use Azure policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

* [Understand Azure Policy Effects](https://docs.microsoft.com/azure/governance/policy/concepts/effects)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.4: Maintain secure operating system configurations

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 7.5: Securely store configuration of Azure resources

**Guidance**: If using custom Azure policy definitions, use Azure DevOps or Azure Repos to securely store and manage your Azure API Management service configuration.

* [How to store files in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops)

* [Azure Repos Documentation](https://docs.microsoft.com/azure/devops/repos/index?view=azure-devops)

* [Understand the Azure API Management DevOps Resource Kit](https://docs.microsoft.com/azure/api-management/api-management-security-controls#configuration-management)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.6: Securely store custom operating system images

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.7: Deploy system configuration management tools

**Guidance**: Define and implement standard security configurations for your Azure API Management services with Azure Policy. Use Azure Policy aliases in the "Microsoft.ApiManagement" namespace to create custom policies to audit or enforce the configuration of Azure API Management instances. Use Azure policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

* [Understand Azure Policy Effects](https://docs.microsoft.com/azure/governance/policy/concepts/effects)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.8: Deploy system configuration management tools for operating systems

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.9: Implement automated configuration monitoring for Azure services

**Guidance**: Use the Azure API Management DevOps Resource Kit to perform configuration management for Azure API Management.

In addition, define and implement standard security configurations for your Azure API Management services with Azure Policy. Use Azure Policy aliases in the "Microsoft.ApiManagement" namespace to create custom policies to audit or enforce the configuration of Azure API Management instances. Use Azure policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.

* [Understand the Azure API Management DevOps Resource Kit](https://docs.microsoft.com/azure/api-management/api-management-security-controls#configuration-management)

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

* [Understand Azure Policy Effects](https://docs.microsoft.com/azure/governance/policy/concepts/effects)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.10: Implement automated configuration monitoring for operating systems

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.11: Manage Azure secrets securely

**Guidance**: Use Key Vault for managing certificates and set them to autorotate. If you use Azure Key Vault to manage the custom domain SSL certificate, make sure the certificate is inserted into Key Vault as a certificate, not a secret.

* [How to set custom domain names with guidance for Key Vault key rotation](https://docs.microsoft.com/azure/api-management/configure-custom-domain)

**Azure Security Center monitoring**: Yes

**Responsibility**: Microsoft

### 7.12: Manage identities securely and automatically

**Guidance**: Use Managed Service Identity generated by Azure Active Directory (AD) to allow your API Management instance to easily and securely access other Azure AD-protected resources, such as Azure Key Vault.

* [How to create a managed identity for an API Management instance](https://docs.microsoft.com/azure/api-management/api-management-howto-use-managed-service-identity)

* [Policy to authenticate with managed identity](https://docs.microsoft.com/azure/api-management/api-management-authentication-policies#ManagedIdentity)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.13: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

* [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Malware defense

*For more information, see [Security control: Malware defense](https://docs.microsoft.com/azure/security/benchmarks/security-control-malware-defense).*

### 8.1: Use centrally managed anti-malware software

**Guidance**: Not applicable; this recommendation is intended for compute resources.

Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure API Management), however it does not run on customer content.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Not applicable; this recommendation is intended for non-compute resources designed to store data.

Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure API Management), however it does not run on customer content.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 8.3: Ensure anti-malware software and signatures are updated

**Guidance**: Not applicable; this recommendation is intended for non-compute resources designed to store data.

Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure API Management), however it does not run on customer content.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Data recovery

*For more information, see [Security control: Data recovery](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure regular automated back ups

**Guidance**: By publishing and managing your APIs via Azure API Management, you're taking advantage of fault tolerance and infrastructure capabilities that you'd otherwise design, implement, and manage manually. API Management supports multi-region deployment which makes the data plane impervious to regional failures without adding any operational overhead.

The service backup and restore features of API Management provide the necessary building blocks for implementing a disaster recovery strategy. Backup and restore operations can be performed manually or automated.

* [How to deploy API Management data plane to multiple regions](https://docs.microsoft.com/azure/api-management/api-management-howto-deploy-multi-region)

* [How to implement disaster recovery using service backup and restore in Azure API Management](https://docs.microsoft.com/azure/api-management/api-management-howto-disaster-recovery-backup-restore#calling-the-backup-and-restore-operations)

* [How to call the API Management backup operation](/rest/api/apimanagement/2019-12-01/apimanagementservice/backup)

* [How to call the API Management restore operation](/rest/api/apimanagement/2019-12-01/apimanagementservice/restore)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.2: Perform complete system backups and backup any customer managed keys

**Guidance**: Backup and restore operations provided by Azure API Management perform full system backup and restore.

Managed identities can be used to obtain certificates from Azure Key Vault for API Management custom domain names. Backup any certificates being stored within Azure Key Vault.

* [How to implement disaster recovery using service backup and restore in Azure API Management](https://docs.microsoft.com/azure/api-management/api-management-howto-disaster-recovery-backup-restore#calling-the-backup-and-restore-operations)

* [How to backup Azure Key Vault certificates](https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultcertificate?view=azurermps-6.13.0)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.3: Validate all backups including customer managed keys

**Guidance**: Validate backups by performing a test restore of the service and certificates from backups.

* [How to call the API Management restore operation](https://docs.microsoft.com/rest/api/apimanagement/2019-12-01/apimanagementservice/restore)

* [How to restore Azure Key Vault certificates](https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultcertificate?view=azurermps-6.13.0)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.4: Ensure protection of backups and customer managed keys

**Guidance**: Azure API Management writes backups to customer-owned Azure Storage accounts. Follow Azure Storage security recommendations to protect your backup.

* [How to implement disaster recovery using service backup and restore in Azure API Management](https://docs.microsoft.com/azure/api-management/api-management-howto-disaster-recovery-backup-restore#calling-the-backup-and-restore-operations)

* [Security recommendation for blob storage](https://docs.microsoft.com/azure/storage/blobs/security-recommendations)

Enable Soft-Delete in Key Vault to protect keys against accidental or malicious deletion.

* [How to enable Soft-Delete in Key Vault](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete?tabs=azure-portal)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Incident response

*For more information, see [Security control: Incident response](https://docs.microsoft.com/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create an incident response guide

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.

* [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

* [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/06/27/inside-the-msrc-anatomy-of-a-ssirp-incident/)

* [Leverage NIST's Computer Security Incident Handling Guide to aid in the creation of your own incident response plan](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, clearly mark subscriptions (for ex. production, non-prod) using tags and create a naming system to clearly identify and categorize Azure resources, especially those processing sensitive data. It is your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

* [Security alerts in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-alerts-overview)

* [Use tags to organize your Azure resources](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence to help protect your Azure resources. Identify weak points and gaps and revise plan as needed.

* [NIST's publication - Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://csrc.nist.gov/publications/detail/sp/800-84/final)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved.

* [How to set the Azure Security Center Security Contact](https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature to help identify risks to Azure resources. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts to Azure Sentinel.

* [How to configure continuous export](https://docs.microsoft.com/azure/security-center/continuous-export)

* [How to stream alerts into Azure Sentinel](https://docs.microsoft.com/azure/sentinel/connect-azure-security-center)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

**Guidance**: Utilize the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.

* [How to configure Workflow Automation and Logic Apps](https://docs.microsoft.com/azure/security-center/workflow-automation)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Penetration tests and red team exercises

*For more information, see [Security control: Penetration tests and red team exercises](https://docs.microsoft.com/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular Penetration Testing of your Azure resources and ensure to remediate all critical security findings within 60 days

**Guidance**: * [Please follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1.)

* [You can find more information on Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft managed cloud infrastructure, services and applications, here](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Next steps

- See the [Azure security benchmark](https://docs.microsoft.com/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview)
