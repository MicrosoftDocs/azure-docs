---
title: Azure security baseline for Azure Functions
description: Azure security baseline for Azure Functions
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 05/04/2020
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Azure security baseline for Azure Functions

The Azure Security Baseline for Azure Functions contains recommendations that will help you improve the security posture of your deployment.

The baseline for this service is drawn from the [Azure Security Benchmark version 1.0](https://docs.microsoft.com/azure/security/benchmarks/overview), which provides recommendations on how you can secure your cloud solutions on Azure with our best practices guidance.

For more information, see the [Azure security baselines overview](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview).

## Network security

*For more information, see [Security control: Network security](https://docs.microsoft.com/azure/security/benchmarks/security-control-network-security).*

### 1.1: Protect resources using Network Security Groups or Azure Firewall on your Virtual Network

**Guidance**: Integrate your Azure Functions apps with an Azure virtual network. Function apps running in the Premium plan have the same hosting capabilities as web apps in Azure App Service, which includes the "VNet Integration" feature.  Azure virtual networks allow you to place many of your Azure resources, such as Azure Functions, in a non-internet routable network.

- [How to integrate Functions with an Azure Virtual Network](https://docs.microsoft.com/azure/azure-functions/functions-create-vnet)

- [Understand Vnet Integration for Azure Functions and Azure App Service](https://docs.microsoft.com/azure/app-service/web-sites-integrate-with-vnet)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.2: Monitor and log the configuration and traffic of Vnets, Subnets, and NICs

**Guidance**: Use Azure Security Center and follow network protection recommendations to help secure network resources and network configurations related to your Azure Functions apps.

If using Network Security groups (NSGs) with your Azure Functions implementation, enable NSG flow logs and send logs into an Azure Storage Account for traffic audits. You may also send NSG flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

- [Understand Network Security provided by Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-network-recommendations)

- [How to Enable NSG Flow Logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal)

- [How to Enable and use Traffic Analytics](https://docs.microsoft.com/azure/network-watcher/traffic-analytics)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.3: Protect critical web applications

**Guidance**: To fully secure your Azure Function endpoints in production, you should consider implementing one of the following function app-level security options:
- Turn on App Service Authentication / Authorization for your function app,
- Use Azure API Management (APIM) to authenticate requests, or
- Deploy your function app to an Azure App Service Environment.

In addition, ensure remote debugging has been disabled for your production Azure Functions. Furthermore, Cross-Origin Resource Sharing (CORS) should not allow all domains to access your Azure Function app. Allow only required domains to interact with your Azure Function app.

Consider deploying Azure Web Application Firewall (WAF) as part of the networking configuration for additional inspection of incoming traffic. Enable Diagnostic Setting for WAF and ingest logs into a Storage Account, Event Hub, or Log Analytics Workspace. 

- [How to secure Azure Function endpoints in production](https://docs.microsoft.com/azure/azure-functions/functions-bindings-http-webhook-trigger?tabs=csharp#secure-an-http-endpoint-in-production)

- [How to deploy Azure WAF](https://docs.microsoft.com/azure/web-application-firewall/ag/create-waf-policy-ag)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.4: Deny communications with known malicious IP addresses

**Guidance**: Enable DDoS Protection Standard on the Virtual Networks associated with your functions apps to guard against DDoS attacks. Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious or unused public IP addresses.
In addition, configure a front-end gateway, such as Azure Web Application Firewall, to authenticate all incoming requests and filter out malicious traffic. Azure Web Application Firewall can help secure your Azure Function apps by inspecting inbound web traffic to block SQL injections, Cross-Site Scripting, malware uploads, and DDoS attacks. Introduction of a WAF requires either an App Service Environment or use of Private Endpoints (Preview). Ensure that Private Endpoints are no longer in (Preview) before using them with production workloads.

- [Azure Functions networking options](https://docs.microsoft.com/azure/azure-functions/functions-networking-options)

- [Azure Functions Premium Plan](https://docs.microsoft.com/azure/azure-functions/functions-scale#premium-plan)

- [Introduction to the App Service Environments](https://docs.microsoft.com/azure/app-service/environment/intro)

- [Networking considerations for an App Service Environment](https://docs.microsoft.com/azure/app-service/environment/network-info)

- [How to configure DDoS protection](https://docs.microsoft.com/azure/virtual-network/manage-ddos-protection)

- [How to deploy Azure Firewall](https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal)

- [Understand Azure Security Center Integrated Threat Intelligence](https://docs.microsoft.com/azure/security-center/security-center-alerts-service-layer)

- [Understand Azure Security Center Adaptive Network Hardening](https://docs.microsoft.com/azure/security-center/security-center-adaptive-network-hardening)

- [Understand Azure Security Center Just In Time Network Access Control](https://docs.microsoft.com/azure/security-center/security-center-just-in-time)

- [Using Private Endpoints for Azure Functions](https://docs.microsoft.com/azure/app-service/networking/private-endpoint)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.5: Record network packets and flow logs

**Guidance**: If using Network Security groups (NSGs) with your Azure Functions implementation, enable Network Security Group flow logs and send logs into a storage account for traffic audit. You may also send flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

- [How to Enable NSG Flow Logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal)

- [How to Enable and use Traffic Analytics](https://docs.microsoft.com/azure/network-watcher/traffic-analytics)

- [How to enable Network Watcher](https://docs.microsoft.com/azure/network-watcher/network-watcher-create)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.6: Deploy network based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Configure a front-end gateway such as Azure Web Application Firewall to authenticate all incoming requests and filter out malicious traffic. Azure Web Application Firewall can help secure your function apps by inspecting inbound web traffic to block SQL injections, Cross-Site Scripting, malware uploads, and DDoS attacks. Introduction of a WAF requires either an App Service Environment or use of Private Endpoints (Preview). Ensure that Private Endpoints are no longer in (Preview) before using them with production workloads.

Alternatively, there are multiple marketplace options like the Barracuda WAF for Azure that are available on the Azure Marketplace which include IDS/IPS features.

- [Azure Functions networking options](https://docs.microsoft.com/azure/azure-functions/functions-networking-options)

- [Azure Functions Premium Plan](https://docs.microsoft.com/azure/azure-functions/functions-scale#premium-plan)

- [Introduction to the App Service Environments](https://docs.microsoft.com/azure/app-service/environment/intro)

- [Networking considerations for an App Service Environment](https://docs.microsoft.com/azure/app-service/environment/network-info)

- [Understand Azure Web Application Firewall](https://docs.microsoft.com/azure/application-gateway/overview#web-application-firewall)

- [Using Private Endpoints for Azure Functions](https://docs.microsoft.com/azure/app-service/networking/private-endpoint)

- [Understand Barracuda WAF Cloud Service](https://docs.microsoft.com/azure/app-service/environment/app-service-app-service-environment-web-application-firewall#configuring-your-barracuda-waf-cloud-service)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.7: Manage traffic to web applications

**Guidance**: Configure a front-end gateway for your network such as Azure Web Application Firewall with end-to-end TLS encryption. Introduction of a WAF requires either an App Service Environment or use of Private Endpoints (Preview). Ensure that Private Endpoints are no longer in (Preview) before using them with production workloads.

- [Azure Functions networking options](https://docs.microsoft.com/azure/azure-functions/functions-networking-options)

- [Azure Functions Premium Plan](https://docs.microsoft.com/azure/azure-functions/functions-scale#premium-plan)

- [Introduction to the App Service Environments](https://docs.microsoft.com/azure/app-service/environment/intro)

- [Networking considerations for an App Service Environment](https://docs.microsoft.com/azure/app-service/environment/network-info)

- [Understand Azure Web Application Firewall](https://docs.microsoft.com/azure/application-gateway/overview#web-application-firewall)

- [How to configure end-to-end TLS by using Application Gateway with the portal](https://docs.microsoft.com/azure/application-gateway/end-to-end-ssl-portal)

- [Using Private Endpoints for Azure Functions](https://docs.microsoft.com/azure/app-service/networking/private-endpoint)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: Use Virtual Network service tags to define network access controls on Network Security Groups or Azure Firewall. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., AzureAppService) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

- [For more information about using service tags](https://docs.microsoft.com/azure/virtual-network/service-tags-overview)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement standard security configurations for network settings related to your Azure Functions. Use Azure Policy aliases in the "Microsoft.Web" and "Microsoft.Network" namespaces to create custom policies to audit or enforce the network configuration of your Azure Functions. You may also make use of built-in policy definitions for Azure Functions, such as:
- CORS should not allow every resource to access your Function Apps
- Function App should only be accessible over HTTPS
- Latest TLS version should be used in your Function App

You may also use Azure Blueprints to simplify large-scale Azure deployments by packaging key environment artifacts, such as Azure Resource Manager templates, role-based access control (RBAC), and policies in a single blueprint definition. You can easily apply the blueprint to new subscriptions, environments, and fine-tune control and management through versioning.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [How to create an Azure Blueprint](https://docs.microsoft.com/azure/governance/blueprints/create-blueprint-portal)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.10: Document traffic configuration rules

**Guidance**: If using Network Security groups (NSGs) with your Azure Functions implementation, use tags for the NSGs and other resources related to network security and traffic flow. For individual NSG rules, use the "Description" field to specify business need and/or duration (etc.) for any rules that allow traffic to/from a network.

Use any of the built-in Azure policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with tags and to notify you of existing untagged resources.

You may use Azure PowerShell or Azure CLI to look-up or perform actions on resources based on their tags.

- [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network settings and resources related to your Azure Functions deployments. Create alerts within Azure Monitor that will trigger when changes to critical network settings or resources takes place. 

- [How to view and retrieve Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view)

- [How to create alerts in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Logging and monitoring

*For more information, see [Security control: Logging and monitoring](https://docs.microsoft.com/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.1: Use approved time synchronization sources

**Guidance**: Microsoft maintains the time source used for Azure resources such as Azure Functions for timestamps in the logs.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 2.2: Configure central security log management

**Guidance**: For control plane audit logging, enable Azure Activity Log diagnostic settings and send the logs to a Log Analytics workspace, Azure event hub, or Azure storage account for archive. Using Azure Activity Log data, you can determine the "what, who, and when" for any write operations (PUT, POST, DELETE) performed at the control plane level for your Azure resources.

Azure Functions also offers built-in integration with Azure Application Insights to monitor functions. Application Insights collects log, performance, and error data. It automatically detects performance anomalies and includes powerful analytics tools to help you diagnose issues and to understand how your functions are used.

If you have built-in custom security/audit logging within your Azure Function app, enable the diagnostics setting "FunctionAppLogs" and send the logs to a Log Analytics workspace, Azure event hub, or Azure storage account for archive. 

Optionally, you may enable and on-board data to Azure Sentinel or a third-party SIEM. 

- [How to enable Diagnostic Settings for Azure Activity Log](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings-legacy)

- [How to set up Azure Functions with Azure Application Insights](https://docs.microsoft.com/azure/azure-functions/functions-monitoring)

- [How to enable Diagnostic Settings (user-generated logs) for Azure Functions](https://docs.microsoft.com/azure/azure-functions/functions-monitor-log-analytics)

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

**Guidance**: For control plane audit logging, enable Azure Activity Log diagnostic settings and send the logs to a Log Analytics workspace, Azure event hub, or Azure storage account for archive. Using Azure Activity Log data, you can determine the "what, who, and when" for any write operations (PUT, POST, DELETE) performed at the control plane level for your Azure resources.

If you have built-in custom security/audit logging within your Azure Function app, enable the diagnostics setting "FunctionAppLogs" and send the logs to a Log Analytics workspace, Azure event hub, or Azure storage account for archive. 

- [How to enable Diagnostic Settings for Azure Activity Log](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings-legacy)

- [How to enable Diagnostic Settings (user-generated logs) for Azure Functions](https://docs.microsoft.com/azure/azure-functions/functions-monitor-log-analytics)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.4: Collect security logs from operating systems

**Guidance**: Not applicable; this guideline is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.5: Configure security log storage retention

**Guidance**: In Azure Monitor, set log retention period for Log Analytics workspaces associated with your Azure Functions apps according to your organization's compliance regulations.

- [How to set log retention parameters](https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.6: Monitor and review Logs

**Guidance**: Enable Azure Activity Log diagnostic settings as well as the diagnostic settings for your Azure Functions app and send the logs to a Log Analytics workspace. Perform queries in Log Analytics to search terms, identify trends, analyze patterns, and provide many other insights based on the collected data.

Enable Application Insights for your Azure Functions apps to collect log, performance, and error data. You can view the telemetry data collected by Application Insights within the Azure portal.

If you have built-in custom security/audit logging within your Azure Function app, enable the diagnostics setting "FunctionAppLogs" and send the logs to a Log Analytics workspace, Azure event hub, or Azure storage account for archive. 

Optionally, you may enable and on-board data to Azure Sentinel or a third-party SIEM. 

- [How to enable diagnostic settings for Azure Activity Log](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings-legacy)

- [How to enable diagnostic settings for Azure Functions](https://docs.microsoft.com/azure/azure-functions/functions-monitor-log-analytics)

- [How to set up Azure Functions with Azure Application Insights and view the telemetry data](https://docs.microsoft.com/azure/azure-functions/functions-monitoring)

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activity

**Guidance**: Enable Azure Activity Log diagnostic settings as well as the diagnostic settings for your Azure Functions app and send the logs to a Log Analytics workspace. Perform queries in Log Analytics to search terms, identify trends, analyze patterns, and provide many other insights based on the collected data. You can create alerts based on your Log Analytics workspace queries.

Enable Application Insights for your Azure Functions apps to collect log, performance, and error data. You can view the telemetry data collected by Application Insights and create alerts within the Azure portal.

Optionally, you may enable and on-board data to Azure Sentinel or a third-party SIEM. 

- [How to enable diagnostic settings for Azure Activity Log](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings-legacy)

- [How to enable diagnostic settings for Azure Functions](https://docs.microsoft.com/azure/azure-functions/functions-monitor-log-analytics)

- [How to enable Application Insights for Azure Functions](https://docs.microsoft.com/azure/azure-functions/functions-monitoring#enable-application-insights-integration)

- [How to create alerts within Azure](https://docs.microsoft.com/azure/azure-monitor/learn/tutorial-response)

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.8: Centralize anti-malware logging

**Guidance**: Not applicable; Azure Functions apps do not process or produce anti-malware related logs.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.9: Enable DNS query logging

**Guidance**: Not applicable; Azure Functions apps do not process or produce user accessible DNS-related logs.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.10: Enable command-line audit logging

**Guidance**: Not applicable; this guideline is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Identity and access control

*For more information, see [Security control: Identity and access control](https://docs.microsoft.com/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Azure Active Directory (AD) has built-in roles that must be explicitly assigned and are queryable. Use the Azure AD PowerShell module to perform ad hoc queries to discover accounts that are members of administrative groups. 

- [How to get a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0)

- [How to get members of a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.2: Change default passwords where applicable

**Guidance**: Control plane access to Azure Functions is controlled through Azure Active Directory (AD). Azure AD does not have the concept of default passwords.

Data plane access can be controlled through several means, including authorization keys, network restrictions, and validating an AAD identity. Authorization keys are used by the clients connecting to your Azure Functions HTTP endpoints and can be regenerated at any time. These keys are generated for new HTTP endpoints by default.

Multiple deployment methods are available to function apps, some of which may leverage a set of generated credentials. Review the deployment methods that will be used for your application.

- [Secure an HTTP endpoint](https://docs.microsoft.com/azure/azure-functions/functions-bindings-http-webhook-trigger?tabs=csharp#secure-an-http-endpoint-in-production)

- [How to obtain and regenerate authorization keys](https://docs.microsoft.com/azure/azure-functions/functions-bindings-http-webhook-trigger?tabs=csharp#obtaining-keys)

- [Deployment technologies in Azure Functions](https://docs.microsoft.com/azure/azure-functions/functions-deployment-technologies)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.3: Use dedicated administrative accounts

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts. Use Azure Security Center Identity and Access Management to monitor the number of administrative accounts.

Additionally, to help you keep track of dedicated administrative accounts, you may use recommendations from Azure Security Center or built-in Azure Policies, such as:
There should be more than one owner assigned to your subscription
Deprecated accounts with owner permissions should be removed from your subscription
External accounts with owner permissions should be removed from your subscription

- [How to use Azure Security Center to monitor identity and access (Preview)](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

- [How to use Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.4: Use single sign-on (SSO) with Azure Active Directory

**Guidance**: Wherever possible, use Azure Active Directory SSO instead than configuring individual stand-alone credentials for data access to your function app. Use Azure Security Center Identity and Access Management recommendations. Implement single sign-on for your Azure Functions apps using the App Service Authentication / Authorization feature.

- [Understand authentication and authorization in Azure Functions](https://docs.microsoft.com/azure/app-service/overview-authentication-authorization#identity-providers)

- [Understand SSO with Azure AD](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

**Guidance**: Enable Azure Active Directory (AD) Multi-Factor Authentication (MFA) and follow Azure Security Center Identity and Access Management recommendations.

- [How to enable MFA in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

- [How to monitor identity and access within Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

**Guidance**: Use privileged access workstations (PAW) with Multi-Factor Authentication (MFA) configured to log into and configure Azure resources.

- [Learn about Privileged Access Workstations](https://docs.microsoft.com/windows-server/identity/securing-privileged-access/privileged-access-workstations)

- [How to enable MFA in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.7: Log and alert on suspicious activity from administrative accounts

**Guidance**: Use Azure Active Directory (AD) Privileged Identity Management (PIM) for generation of logs and alerts when suspicious or unsafe activity occurs in the environment.

In addition, use Azure AD risk detections to view alerts and reports on risky user behavior.

- [How to deploy Privileged Identity Management (PIM)](https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-deployment-plan)

- [Understand Azure AD risk detections](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risk-events)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.8: Manage Azure resources from only approved locations

**Guidance**: Use Conditional Access Named Locations to allow access to the Azure portal from only specific logical groupings of IP address ranges or countries/regions.

- [How to configure Named Locations in Azure](https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory (AD) as the central authentication and authorization system for your Azure Functions apps. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.

- [How to configure your Azure Functions app to use Azure AD login](https://docs.microsoft.com/azure/app-service/configure-authentication-provider-aad)

- [How to create and configure an AAD instance](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-access-create-new-tenant)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.10: Regularly review and reconcile user access

**Guidance**: Azure Active Directory (AD) provides logs to help you discover stale accounts. In addition, use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access can be reviewed on a regular basis to make sure only the right Users have continued access. 

- [Understand Azure AD reporting](https://docs.microsoft.com/azure/active-directory/reports-monitoring/)

- [How to use Azure Identity Access Reviews](https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.11: Monitor attempts to access deactivated accounts

**Guidance**: Use Azure Active Directory (AD) as the central authentication and authorization system for your Azure Function apps. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.

You have access to Azure AD sign-in activity, audit and risk event log sources, which allow you to integrate with Azure Sentinel or a third-party SIEM.

You can streamline this process by creating diagnostic settings for Azure AD user accounts and sending the audit logs and sign-in logs to a Log Analytics workspace. You can configure desired log alerts within Log Analytics.

- [How to configure your Azure Functions app to use Azure AD login](https://docs.microsoft.com/azure/app-service/configure-authentication-provider-aad)

- [How to integrate Azure Activity Logs into Azure Monitor](https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)

- [How to on-board Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.12: Alert on account login behavior deviation

**Guidance**: Use Azure Active Directory (AD) as the central authentication and authorization system for your Azure Functions apps. For account login behavior deviation on the control plane (the Azure portal), use Azure Active Directory (AD) Identity Protection and risk detection features to configure automated responses to detected suspicious actions related to user identities. You can also ingest data into Azure Sentinel for further investigation.

- [How to view Azure AD risky sign-ins](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risky-sign-ins)

- [How to configure and enable Identity Protection risk policies](https://docs.microsoft.com/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies)

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

**Guidance**: Not currently available; Customer Lockbox is not currently supported for Azure Functions.

- [List of Customer Lockbox-supported services](https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview#supported-services-and-scenarios-in-general-availability)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Data protection

*For more information, see [Security control: Data protection](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags to assist in tracking Azure resources that store or process sensitive information.

- [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. Azure Function apps should be separated by virtual network (VNet)/subnet and tagged appropriately.

You may also use Private Endpoints to perform network isolation. An Azure Private Endpoint is a network interface that connects you privately and securely to a service (for example: Azure Functions app HTTPs endpoint) powered by Azure Private Link. Private Endpoint uses a private IP address from your VNet, effectively bringing the service into your VNet. Private endpoints are in (Preview) for function apps running in the Premium plan. Ensure that Private Endpoints are no longer in (Preview) before using them with production workloads.

- [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/billing/billing-create-subscription)

- [How to create Management Groups](https://docs.microsoft.com/azure/governance/management-groups/create)

- [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

- [Azure Functions networking options](https://docs.microsoft.com/azure/azure-functions/functions-networking-options)

- [Azure Functions Premium Plan](https://docs.microsoft.com/azure/azure-functions/functions-scale#premium-plan)

- [Understand Private Endpoint](https://docs.microsoft.com/azure/private-link/private-endpoint-overview)

- [Using Private Endpoints for Azure Functions](https://docs.microsoft.com/azure/app-service/networking/private-endpoint)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: Deploy an automated tool on network perimeters that monitors for unauthorized transfer of sensitive information and blocks such transfers while alerting information security professionals. 

Microsoft manages the underlying infrastructure for Azure Functions and has implemented strict controls to prevent the loss or exposure of customer data.

- [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Not applicable

### 4.4: Encrypt all sensitive information in transit

**Guidance**: In the Azure portal for your Azure Function apps, under "Platform Features:  Networking: SSL", enable the "HTTPs Only" setting and set the minimum TLS version to 1.2.

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Not currently available; data identification, classification, and loss prevention features are not currently available for Azure Functions. Tag Function apps that may be processing sensitive information as such and implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.6: Use Azure RBAC to control access to resources

**Guidance**: Use Azure Active Directory (AD) role-based access control (RBAC) to control access to the Azure Function control plane (the Azure portal). 

- [How to configure RBAC in Azure](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.7: Use host-based data loss prevention to enforce access control

**Guidance**: Not applicable; this recommendation is intended for IaaS compute resources.

Microsoft manages the underlying infrastructure for Azure Functions and has implemented strict controls to prevent the loss or exposure of customer data.

- [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.8: Encrypt sensitive information at rest

**Guidance**: When creating a function app, you must create or link to a general-purpose Azure Storage account that supports Blob, Queue, and Table storage. This is because Functions relies on Azure Storage for operations such as managing triggers and logging function executions. Azure Storage encrypts all data in a storage account at rest. By default, data is encrypted with Microsoft-managed keys. For additional control over encryption keys, you can supply customer-managed keys for encryption of blob and file data. These keys must be present in Azure Key Vault for the function app to be able to access the storage account.

- [Understand storage considerations for Azure Functions](https://docs.microsoft.com/azure/azure-functions/storage-considerations)

- [Understand Azure storage encryption for data at rest](https://docs.microsoft.com/azure/storage/common/storage-service-encryption)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with the Azure Activity log to create alerts for when changes take place to production Azure Function apps as well as other critical or related resources.

- [How to create alerts for Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Vulnerability management

*For more information, see [Security control: Vulnerability management](https://docs.microsoft.com/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: Adopt a DevSecOps practice to ensure your Azure Functions applications are secure and remain as secure as possible throughout the duration of their life-cycle. DevSecOps incorporates your organization's security team and their capabilities into your DevOps practices making security a responsibility of everyone on the team.

In addition, follow recommendations from Azure Security Center to help secure your Azure Function apps.

- [How to add continuous security validation to your CI/CD pipeline](https://docs.microsoft.com/azure/devops/migrate/security-validation-cicd-pipeline?view=azure-devops)

- [How to implement Azure Security Center vulnerability assessment recommendations](https://docs.microsoft.com/azure/security-center/security-center-vulnerability-assessment-recommendations)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 5.2: Deploy an automated operating system patch management solution

**Guidance**: Not applicable; this recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 5.3: Deploy automated third-party software patch management solution

**Guidance**: Not applicable; this recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 5.4: Compare back-to-back vulnerability scans

**Guidance**: Not applicable; this recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

**Guidance**: Microsoft performs vulnerability management on the underlying systems that support Azure Functions, however you may use the severity of the recommendations within Azure Security Center as well as the Secure Score to measure risk within your environment. Your Secure Score is based on how many Security Center recommendations you have mitigated. To prioritize the recommendations to resolve first, consider the severity of each.

- [Security recommendations reference guide](https://docs.microsoft.com/azure/security-center/recommendations-reference)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

## Inventory and asset management

*For more information, see [Security control: Inventory and asset management](https://docs.microsoft.com/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use Azure Asset Discovery

**Guidance**: Use Azure Resource Graph to query/discover all resources (such as compute, storage, network, ports, and protocols etc.) within your subscription(s).  Ensure appropriate (read) permissions in your tenant and enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use Azure Resource Manager resources going forward.

- [How to create queries with Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

- [How to view your Azure Subscriptions](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0)

- [Understand Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/overview)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

- [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track Azure resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

In addition, use Azure policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:
Not allowed resource types
Allowed resource types

- [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/billing/billing-create-subscription)

- [How to create Management Groups](https://docs.microsoft.com/azure/governance/management-groups/create)

- [How to create and use Tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.4: Maintain an inventory of approved Azure resources and software titles

**Guidance**: Define approved Azure resources and approved software for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in your subscription(s). 

Use Azure Resource Graph to query/discover resources within their subscription(s).  Ensure that all Azure resources present in the environment are approved. 

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [How to create queries with Azure Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.6: Monitor for unapproved software applications within compute resources

**Guidance**: Not applicable; this recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.7: Remove unapproved Azure resources and software applications

**Guidance**: Not applicable; this recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.8: Use only approved applications

**Guidance**: Not applicable; this recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.9: Use only approved Azure services

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:
Not allowed resource types
Allowed resource types

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [How to deny a specific resource type with Azure Policy](https://docs.microsoft.com/azure/governance/policy/samples/not-allowed-resource-types)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.10: Implement approved application list

**Guidance**: Not applicable; this recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.11: Limit users' ability to interact with Azure Resources Manager via scripts

**Guidance**: Configure Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resource Manager](https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.12: Limit users' ability to execute scripts within compute resources

**Guidance**: Not applicable; this recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.13: Physically or logically segregate high risk applications

**Guidance**: For sensitive or high risk Azure Function apps, implement separate subscriptions and/or management groups to provide isolation.

Deploy high risk Azure Function apps into their own Virtual Network (VNet). Perimeter security in Azure Functions is achieved through VNets. Functions running in the Premium plan or App Service Environment (ASE) can be integrated with VNets. Choose the best architecture for your use case.

- [Azure Functions networking options](https://docs.microsoft.com/azure/azure-functions/functions-networking-options)

- [Azure Functions Premium Plan](https://docs.microsoft.com/azure/azure-functions/functions-scale#premium-plan)

- [Networking considerations for an App Service Environment](https://docs.microsoft.com/azure/app-service/environment/network-info)

- [How to create an external ASE](https://docs.microsoft.com/azure/app-service/environment/create-external-ase)

How to create an internal ASE:

- [https://docs.microsoft.com/azure/app-service/environment/create-ilb-as](https://docs.microsoft.com/azure/virtual-network/quick-create-portal)

- [How to create an NSG with a security config](https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Secure configuration

*For more information, see [Security control: Secure configuration](https://docs.microsoft.com/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Define and implement standard security configurations for your Azure Function app with Azure Policy. Use Azure Policy aliases in the "Microsoft.Web" namespace to create custom policies to audit or enforce the configuration of your Azure Functions apps. You may also make use of built-in policy definitions such as:
- Managed identity should be used in your Function App
- Remote debugging should be turned off for Function Apps
- Function App should only be accessible over HTTPS

- [How to view available Azure Policy Aliases](https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0)

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.2: Establish secure operating system configurations

**Guidance**: Not applicable; this guideline is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [Understand Azure Policy Effects](https://docs.microsoft.com/azure/governance/policy/concepts/effects)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.4: Maintain secure operating system configurations

**Guidance**: Not applicable; while it is possible to deploy on-premises functions, this guideline is intended for IaaS compute resources. When deploying on premises functions, you are responsible for the secure configuration of your environment.

- [Understand on-premises functions](https://docs.microsoft.com/azure/azure-functions/functions-runtime-install)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.5: Securely store configuration of Azure resources

**Guidance**: Store and manage ARM templates and custom Azure policy definitions securely in source control.

- [What is infrastructure as code](https://docs.microsoft.com/azure/devops/learn/what-is-infrastructure-as-code)

- [Design policy as code workflows](https://docs.microsoft.com/azure/governance/policy/concepts/policy-as-code)

- [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops)

- [Azure Repos Documentation](https://docs.microsoft.com/azure/devops/repos/index?view=azure-devops)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.6: Securely store custom operating system images

**Guidance**: Not applicable; this guideline is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.7: Deploy system configuration management tools

**Guidance**: Use built-in Azure Policy definitions as well as Azure Policy aliases in the "Microsoft.Web" namespace to create custom policies to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.8: Deploy system configuration management tools for operating systems

**Guidance**: Not applicable; this guideline is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.9: Implement automated configuration monitoring for Azure services

**Guidance**: Use built-in Azure Policy definitions as well as Azure Policy aliases in the "Microsoft.Web" namespace to create custom policies to alert, audit, and enforce system configurations. Use Azure policy [audit], [deny], and [deploy if not exist] to automatically enforce configurations for your Azure resources.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.10: Implement automated configuration monitoring for operating systems

**Guidance**: Not applicable; this guideline is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.11: Manage Azure secrets securely

**Guidance**: Use Managed Identities in conjunction with Azure Key Vault to simplify and secure secret management for your cloud applications. Managed Identities allows your function app to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code.

- [How to create a Key Vault](https://docs.microsoft.com/azure/key-vault/quick-create-portal)

- [How to use managed identities for App Service and Azure Functions](https://docs.microsoft.com/azure/app-service/overview-managed-identity)

- [How to provide Key Vault authentication with a managed identity](https://docs.microsoft.com/azure/key-vault/managed-identity)

- [Use Key Vault references for App Service and Azure Functions](https://docs.microsoft.com/azure/app-service/app-service-key-vault-references)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.12: Manage identities securely and automatically

**Guidance**: Use Managed Identities to provide your Azure Function app with an automatically managed identity in Azure AD. Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code.

- [How to use managed identities for App Service and Azure Functions](https://docs.microsoft.com/azure/app-service/overview-managed-identity)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.13: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault. 

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Malware defense

*For more information, see [Security control: Malware defense](https://docs.microsoft.com/azure/security/benchmarks/security-control-malware-defense).*

### 8.1: Use centrally managed anti-malware software

**Guidance**: Not applicable; this guideline is intended for IaaS compute resources.

Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure Functions), however it does not run on customer content.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Not applicable; this recommendation is intended for non-compute resources designed to store data.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 8.3: Ensure anti-malware software and signatures are updated

**Guidance**: Not applicable; this recommendation is intended for non-compute resources designed to store data.

Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure Functions), however it does not run on customer content.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Data recovery

*For more information, see [Security control: Data recovery](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure regular automated back ups

**Guidance**: Use the Backup and Restore feature to schedule regular backups of your app. Function apps running in the Premium plan have the same hosting capabilities as web apps in Azure App Service, which includes the "Backup and Restore" feature.

Also make use of a source control solution such as Azure Repos and Azure DevOps to securely store and manage your code. Azure DevOps Services leverages many of the Azure storage features to ensure data availability in the case of hardware failure, service disruption, or region disaster. Additionally, the Azure DevOps team follows procedures to protect data from accidental or malicious deletion.

- [Back up your app in Azure](https://docs.microsoft.com/azure/app-service/manage-backup)

- [Understand data availability in Azure DevOps](https://docs.microsoft.com/azure/devops/organizations/security/data-protection?view=azure-devops#data-availability)

- [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops)

- [Azure Repos Documentation](https://docs.microsoft.com/azure/devops/repos/index?view=azure-devops)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.2: Perform complete system backups and backup any customer managed keys

**Guidance**: Use the Backup and Restore feature to schedule regular backups of your app. Function apps running in the Premium plan have the same hosting capabilities as web apps in Azure App Service, which includes the "Backup and Restore" feature. Backup customer managed keys within Azure Key Vault.

Also make use of a source control solution such as Azure Repos and Azure DevOps to securely store and manage your code. Azure DevOps Services leverages many of the Azure storage features to ensure data availability in the case of hardware failure, service disruption, or region disaster. Additionally, the Azure DevOps team follows procedures to protect data from accidental or malicious deletion.

- [Back up your app in Azure](https://docs.microsoft.com/azure/app-service/manage-backup)

- [How to backup key vault keys in Azure](https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey)

- [Understand data availability in Azure DevOps](https://docs.microsoft.com/azure/devops/organizations/security/data-protection?view=azure-devops#data-availability)

- [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops)

- [Azure Repos Documentation](https://docs.microsoft.com/azure/devops/repos/index?view=azure-devops)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.3: Validate all backups including customer managed keys

**Guidance**: Ensure ability to periodically perform restoration from the Backup and Restore feature. If using another offline location to backup your code, periodically ensure ability to perform complete restorations. Test restoration of backed up customer managed keys.

- [Restore an app in Azure from a backup](https://docs.microsoft.com/azure/app-service/web-sites-restore)

- [Restore an app in Azure from a snapshot](https://docs.microsoft.com/azure/app-service/app-service-web-restore-snapshots)

- [How to restore key vault keys in Azure](https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultkey?view=azurermps-6.13.0)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.4: Ensure protection of backups and customer managed keys

**Guidance**: Backups from the Backup and Restore feature use an Azure Storage account in your subscription. Azure Storage encrypts all data in a storage account at rest. By default, data is encrypted with Microsoft-managed keys. For additional control over encryption keys, you can supply customer-managed keys for encryption of storage data.

If you are using customer-managed-keys, ensure Soft-Delete in Key Vault is enabled to protect keys against accidental or malicious deletion.

- [Azure Storage encryption at rest](https://docs.microsoft.com/azure/storage/common/storage-service-encryption)

- [How to enable Soft-Delete in Key Vault](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete?tabs=azure-portal)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

## Incident response

*For more information, see [Security control: Incident response](https://docs.microsoft.com/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create an incident response guide

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.

- [How to configure Workflow Automations within Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-planning-and-operations-guide)

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Customer may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, clearly mark subscriptions (for ex. production, non-prod) and create a naming system to clearly identify and categorize Azure resources.

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

- [Refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that the customer's data has been accessed by an unlawful or unauthorized party.  Review incidents after the fact to ensure that issues are resolved.

- [How to set the Azure Security Center Security Contact](https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts to Azure Sentinel.

- [How to configure continuous export](https://docs.microsoft.com/azure/security-center/continuous-export)

- [How to stream alerts into Azure Sentinel](https://docs.microsoft.com/azure/sentinel/connect-azure-security-center)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses to security alerts and recommendations with Logic Apps.

- [How to configure Workflow Automation and Logic Apps](https://docs.microsoft.com/azure/security-center/workflow-automation)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Penetration tests and red team exercises

*For more information, see [Security control: Penetration tests and red team exercises](https://docs.microsoft.com/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

**Guidance**: Follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies. Use Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1)

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Next steps

- See the [Azure security benchmark](https://docs.microsoft.com/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview)
