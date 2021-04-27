---
title: Azure security baseline for Azure Functions
description: The Azure Functions security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: azure-functions
ms.topic: conceptual
ms.date: 02/17/2021
ms.author: mbaldwin
ms.custom: subject-security-benchmark, devx-track-azurepowershell

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Functions

This security
baseline applies guidance from the [Azure Security Benchmark version
1.0](../security/benchmarks/overview-v1.md) to Azure Functions. The Azure Security Benchmark
provides recommendations on how you can secure your cloud solutions on Azure.
The content is grouped by the **security controls** defined by the Azure
Security Benchmark and the related guidance applicable to Azure Functions. **Controls** not applicable to Azure Functions have been excluded.

 
To see how Azure Functions completely maps to the Azure
Security Benchmark, see the [full Azure Functions security baseline mapping
file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](../security/benchmarks/security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

**Guidance**: Integrate your Azure Functions apps with an Azure virtual network. Function apps running in the Premium plan have the same hosting capabilities as web apps in Azure App Service, which includes the "VNet Integration" feature.  Azure virtual networks allow you to place many of your Azure resources, such as Azure Functions, in a non-internet routable network.

- [How to integrate Functions with an Azure Virtual Network](functions-create-vnet.md)

- [Understand Vnet Integration for Azure Functions and Azure App Service](../app-service/web-sites-integrate-with-vnet.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Web**:

[!INCLUDE [Resource Policy for Microsoft.Web 1.1](../../includes/policy/standards/asb/rp-controls/microsoft.web-1-1.md)]

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and network interfaces

**Guidance**: Use Azure Security Center and follow network protection recommendations to help secure network resources and network configurations related to your Azure Functions apps.

If using network security groups with your Azure Functions implementation, enable network security groups flow logs and send logs into an Azure Storage Account for traffic audits. You may also send network security groups flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

- [Understand Network Security provided by Azure Security Center](../security-center/security-center-network-recommendations.md)

- [How to Enable NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to Enable and use Traffic Analytics](../network-watcher/traffic-analytics.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.3: Protect critical web applications

**Guidance**: To fully secure your Azure Functions endpoints in production, you should consider implementing one of the following function app-level security options:

- Turn on App Service Authentication or Authorization for your function app

- Use Azure API Management (APIM) to authenticate requests

- Deploy your function app to an Azure App Service Environment.

In addition, ensure remote debugging has been disabled for your production Azure Functions. Furthermore, Cross-Origin Resource Sharing (CORS) should not allow all domains to access your function app in Azure. Allow only required domains to interact with your function app.

Consider deploying Azure Web Application Firewall (WAF) as part of the networking configuration for additional inspection of incoming traffic. Enable Diagnostic Setting for WAF and ingest logs into a Storage Account, Event Hub, or Log Analytics Workspace. 

- [How to secure Azure Functions endpoints in production](./functions-bindings-http-webhook-trigger.md?tabs=csharp#secure-an-http-endpoint-in-production)

- [How to deploy Azure WAF](../web-application-firewall/ag/create-waf-policy-ag.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Web**:

[!INCLUDE [Resource Policy for Microsoft.Web 1.3](../../includes/policy/standards/asb/rp-controls/microsoft.web-1-3.md)]

### 1.4: Deny communications with known-malicious IP addresses

**Guidance**: Enable DDoS Protection Standard on the Virtual Networks associated with your function apps to guard against DDoS attacks. Use Threat Intelligence features in Azure Security Center Integrated to deny communications with known malicious or unused public IP addresses.

In addition, configure a front-end gateway, such as Azure Web Application Firewall, to authenticate all incoming requests and filter out malicious traffic. Azure Web Application Firewall can help secure your function app by inspecting inbound web traffic to block SQL injections, Cross-Site Scripting, malware uploads, and DDoS attacks. Introduction of a Web Application Firewall requires either an App Service Environment or use of Private Endpoints. You can use Private Endpoints for your functions hosted in the Premium and App Service plans.

- [Azure Functions networking options](functions-networking-options.md)

- [How to configure DDoS protection](../ddos-protection/manage-ddos-protection.md)

- [Understand Azure Security Center Integrated Threat Intelligence](../security-center/azure-defender.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.5: Record network packets

**Guidance**: If using network security group with your Azure Functions implementation, enable network security group flow logs and send logs into a storage account for traffic audit. You may also send flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

- [How to Enable network security group flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to Enable and use Traffic Analytics](../network-watcher/traffic-analytics.md)

- [How to enable Network Watcher](../network-watcher/network-watcher-create.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Configure a front-end gateway such as Azure Web Application Firewall to authenticate all incoming requests and filter out malicious traffic. Azure Web Application Firewall can help secure your function apps by inspecting inbound web traffic to block SQL injections, Cross-Site Scripting, malware uploads, and DDoS attacks. Introduction of a Web Application Firewall requires either an App Service Environment or use of Private Endpoints. You can use Private Endpoints for your functions hosted in the Premium and App Service plans.

Alternatively, there are multiple marketplace options like the Barracuda Web Application Firewall for Azure that are available on the Azure Marketplace which include Intrusion detection or prevention features.

- [Azure Functions networking options](functions-networking-options.md)

- [Azure Functions Premium Plan](functions-premium-plan.md)

- [Introduction to the App Service Environments](../app-service/environment/intro.md)

- [Networking considerations for an App Service Environment](../app-service/environment/network-info.md) 

- [Understand Azure Web Application Firewall](../web-application-firewall/overview.md)

- [Using Private Endpoints for Azure Functions](../app-service/networking/private-endpoint.md)

- [Understand Barracuda WAF Cloud Service](../app-service/environment/app-service-app-service-environment-web-application-firewall.md#configuring-your-barracuda-waf-cloud-service)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.7: Manage traffic to web applications

**Guidance**: Configure a front-end gateway for your network such as Azure Web Application Firewall with end-to-end TLS encryption. Introduction of a Web Application Firewall requires either an App Service Environment or use of Private Endpoints. You can use Private Endpoints for your functions hosted in the Premium and App Service plans.

- [Azure Functions networking options](functions-networking-options.md)

- [Azure Functions Premium Plan](functions-premium-plan.md)

- [Introduction to the App Service Environments](../app-service/environment/intro.md)

- [Networking considerations for an App Service Environment](../app-service/environment/network-info.md) 

- [Understand Azure Web Application Firewall](../web-application-firewall/overview.md)

- [How to configure end-to-end TLS by using Application Gateway with the portal](../application-gateway/end-to-end-ssl-portal.md)

- [Using Private Endpoints for Azure Functions](../app-service/networking/private-endpoint.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: Use Virtual Network service tags to define network access controls on network security group or Azure Firewall. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., AzureAppService) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

- [For more information about using service tags](../virtual-network/service-tags-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement standard security configurations for network settings related to your Azure Functions. Use Azure Policy aliases in the "Microsoft.Web" and "Microsoft.Network" namespaces to create custom policies to audit or enforce the network configuration of your Azure Functions. You may also make use of built-in policy definitions for Azure Functions, such as:

- CORS should not allow every resource to access your function apps

- Function app should only be accessible over HTTPS

- Latest TLS version should be used in your function app

You may also use Azure Blueprints to simplify large-scale Azure deployments by packaging key environment artifacts, such as Azure Resource Manager templates, Azure role-based access control (Azure RBAC), and policies in a single blueprint definition. You can easily apply the blueprint to new subscriptions, environments, and fine-tune control and management through versioning.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to create an Azure Blueprint](../governance/blueprints/create-blueprint-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.10: Document traffic configuration rules

**Guidance**: If using network security group with your Azure Functions implementation, use tags for the NSGs and other resources related to network security and traffic flow. For individual network security group rules, use the "Description" field to specify business need and/or duration and so on, for any rules that allow traffic to/from a network.

Use any of the built-in Azure policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with tags and to notify you of existing untagged resources.

You may use Azure PowerShell or Azure CLI to look-up or perform actions on resources based on their tags.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network settings and resources related to your Azure Functions deployments. Create alerts within Azure Monitor that will trigger when changes to critical network settings or resources takes place. 

- [How to view and retrieve Azure Activity Log events](../azure-monitor/essentials/activity-log.md#view-the-activity-log)

- [How to create alerts in Azure Monitor](../azure-monitor/alerts/alerts-activity-log.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Logging and Monitoring

*For more information, see the [Azure Security Benchmark: Logging and Monitoring](../security/benchmarks/security-control-logging-monitoring.md).*

### 2.2: Configure central security log management

**Guidance**: For control plane audit logging, enable Azure Activity Log diagnostic settings and send the logs to a Log Analytics workspace, Azure event hub, or Azure storage account for archive. Using Azure Activity Log data, you can determine the "what, who, and when" for any write operations (PUT, POST, DELETE) performed at the control plane level for your Azure resources.

Azure Functions also offers built-in integration with Azure Application Insights to monitor functions. Application Insights collects log, performance, and error data. It automatically detects performance anomalies and includes powerful analytics tools to help you diagnose issues and to understand how your functions are used.

If you have built-in custom security/audit logging within your function app, enable the diagnostics setting "FunctionAppLogs" and send the logs to a Log Analytics workspace, Azure event hub, or Azure storage account for archive. 

Optionally, you may enable and on-board data to Azure Sentinel or a third-party system information and event management solution. 

- [How to enable Diagnostic Settings for Azure Activity Log](../azure-monitor/essentials/activity-log.md)

- [How to set up Azure Functions with Azure Application Insights](functions-monitoring.md)

- [How to enable Diagnostic Settings (user-generated logs) for Azure Functions](functions-monitor-log-analytics.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.3: Enable audit logging for Azure resources

**Guidance**: For control plane audit logging, enable Azure Activity Log diagnostic settings and send the logs to a Log Analytics workspace, Azure event hub, or Azure storage account for archive. Using Azure Activity Log data, you can determine the "what, who, and when" for any write operations (PUT, POST, DELETE) performed at the control plane level for your Azure resources.

If you have built-in custom security/audit logging within your function app, enable the diagnostics setting "FunctionAppLogs" and send the logs to a Log Analytics workspace, Azure event hub, or Azure storage account for archive. 

- [How to enable Diagnostic Settings for Azure Activity Log](../azure-monitor/essentials/activity-log.md)

- [How to enable Diagnostic Settings (user-generated logs) for Azure Functions](functions-monitor-log-analytics.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Web**:

[!INCLUDE [Resource Policy for Microsoft.Web 2.3](../../includes/policy/standards/asb/rp-controls/microsoft.web-2-3.md)]

### 2.4: Collect security logs from operating systems

**Guidance**: Not applicable; this guideline is intended for IaaS compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.5: Configure security log storage retention

**Guidance**: In Azure Monitor, set log retention period for Log Analytics workspaces associated with your function apps according to your organization's compliance regulations.

- [How to set log retention parameters](../azure-monitor/logs/manage-cost-storage.md#change-the-data-retention-period)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.6: Monitor and review logs

**Guidance**: Enable Azure Activity Log diagnostic settings as well as the diagnostic settings for your function app and send the logs to a Log Analytics workspace. Perform queries in Log Analytics to search terms, identify trends, analyze patterns, and provide many other insights based on the collected data.

Enable Application Insights for your function apps to collect log, performance, and error data. You can view the telemetry data collected by Application Insights within the Azure portal.

If you have built-in custom security/audit logging within your function app, enable the diagnostics setting "FunctionAppLogs" and send the logs to a Log Analytics workspace, Azure event hub, or Azure storage account for archive. 

Optionally, you may enable and on-board data to Azure Sentinel or a third-party system information and event management solution.

- [How to enable diagnostic settings for Azure Activity Log](../azure-monitor/essentials/activity-log.md)

- [How to enable diagnostic settings for Azure Functions](functions-monitor-log-analytics.md)

- [How to set up Azure Functions with Azure Application Insights and view the telemetry data](functions-monitoring.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.7: Enable alerts for anomalous activities

**Guidance**: Enable Azure Activity Log diagnostic settings as well as the diagnostic settings for your function app and send the logs to a Log Analytics workspace. Perform queries in Log Analytics to search terms, identify trends, analyze patterns, and provide many other insights based on the collected data. You can create alerts based on your Log Analytics workspace queries.

Enable Application Insights for your function apps to collect log, performance, and error data. You can view the telemetry data collected by Application Insights and create alerts within the Azure portal.

Optionally, you may enable and on-board data to Azure Sentinel or a third-party system information and event management solution.

- [How to enable diagnostic settings for Azure Activity Log](../azure-monitor/essentials/activity-log.md)

- [How to enable diagnostic settings for Azure Functions](functions-monitor-log-analytics.md)

- [How to enable Application Insights for Azure Functions](./configure-monitoring.md#enable-application-insights-integration)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Azure Active Directory (Azure AD) has built-in roles that must be explicitly assigned and are queryable. Use the Azure AD PowerShell module to perform ad hoc queries to discover accounts that are members of administrative groups.

- [How to get a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrole?preserve-view=true&view=azureadps-2.0)

- [How to get members of a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrolemember?preserve-view=true&view=azureadps-2.0)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.2: Change default passwords where applicable

**Guidance**: Control plane access to Azure Functions is controlled through Azure Active Directory (Azure AD). Azure AD does not have the concept of default passwords.

Data plane access can be controlled through several means, including authorization keys, network restrictions, and validating an Azure AD identity. Authorization keys are used by the clients connecting to your Azure Functions HTTP endpoints and can be regenerated at any time. These keys are generated for new HTTP endpoints by default.

Multiple deployment methods are available to function apps, some of which may leverage a set of generated credentials. Review the deployment methods that will be used for your application.

- [Secure an HTTP endpoint](./functions-bindings-http-webhook-trigger.md?tabs=csharp#secure-an-http-endpoint-in-production)

- [How to obtain and regenerate authorization keys](./functions-bindings-http-webhook-trigger.md?tabs=csharp#obtaining-keys)

- [Deployment technologies in Azure Functions](functions-deployment-technologies.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.3: Use dedicated administrative accounts

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts. Use Azure Security Center Identity and Access Management to monitor the number of administrative accounts.

Additionally, to help you keep track of dedicated administrative accounts, you may use recommendations from Azure Security Center or built-in Azure Policies, such as:

- There should be more than one owner assigned to your subscription

- Deprecated accounts with owner permissions should be removed from your subscription

- External accounts with owner permissions should be removed from your subscription

Additional information is available at the referenced links.

- [How to use Azure Security Center to monitor identity and access ](../security-center/security-center-identity-access.md)

- [How to use Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.4: Use Azure Active Directory single sign-on (SSO)

**Guidance**: Wherever possible, use Azure Active Directory (Azure AD) SSO instead than configuring individual stand-alone credentials for data access to your function app. Use Azure Security Center Identity and Access Management recommendations. Implement single sign-on for your functions apps using the App Service Authentication / Authorization feature.

- [Understand authentication and authorization in Azure Functions](../app-service/overview-authentication-authorization.md#identity-providers)

- [Understand SSO with Azure AD](../active-directory/manage-apps/what-is-single-sign-on.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.5: Use multi-factor authentication for all Azure Active Directory-based access

**Guidance**: Enable Azure Active Directory (Azure AD) multifactor authentication and follow Azure Security Center Identity and Access Management recommendations.

- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

- [How to monitor identity and access within Azure Security Center](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

**Guidance**: Use privileged access workstations (PAW) with multifactor authentication configured to log into and configure Azure resources. 

- [Learn about Privileged Access Workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/)

- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.7: Log and alert on suspicious activities from administrative accounts

**Guidance**: Use Azure Active Directory (Azure AD) Privileged Identity Management (PIM) for generation of logs and alerts when suspicious or unsafe activity occurs in the environment.

In addition, use Azure AD risk detections to view alerts and reports on risky user behavior.

- [How to deploy Privileged Identity Management (PIM)](../active-directory/privileged-identity-management/pim-deployment-plan.md)

- [Understand Azure AD risk detections](../active-directory/identity-protection/overview-identity-protection.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.8: Manage Azure resources from only approved locations

**Guidance**: Use Conditional Access Named Locations to allow access to the Azure portal from only specific logical groupings of IP address ranges or countries/regions.

- [How to configure Named Locations in Azure](../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system for your function apps. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.

- [How to configure your function app to use Azure AD login](../app-service/configure-authentication-provider-aad.md)

- [How to create and configure an Azure AD instance](../active-directory/fundamentals/active-directory-access-create-new-tenant.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.10: Regularly review and reconcile user access

**Guidance**: Azure Active Directory (Azure AD) provides logs to help you discover stale accounts. In addition, use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access can be reviewed on a regular basis to make sure only the right Users have continued access.

- [Understand Azure AD reporting](../active-directory/reports-monitoring/index.yml)

- [How to use Azure Identity Access Reviews](../active-directory/governance/access-reviews-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.11: Monitor attempts to access deactivated credentials

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system for your function apps. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.

You have access to Azure AD sign-in activity, audit and risk event log sources, which allow you to integrate with Azure Sentinel or a third-party SIEM.

You can streamline this process by creating diagnostic settings for Azure AD user accounts and sending the audit logs and sign-in logs to a Log Analytics workspace. You can configure desired log alerts within Log Analytics.

- [How to configure your function app to use Azure AD login](../app-service/configure-authentication-provider-aad.md)

- [How to integrate Azure Activity Logs into Azure Monitor](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)

- [How to on-board Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.12: Alert on account sign-in behavior deviation

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system for your function apps. For account login behavior deviation on the control plane (the Azure portal), use Azure AD Identity Protection and risk detection features to configure automated responses to detected suspicious actions related to user identities. You can also ingest data into Azure Sentinel for further investigation.

- [How to view Azure AD risky sign-ins](../active-directory/identity-protection/overview-identity-protection.md)

- [How to configure and enable Identity Protection risk policies](../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](../security/benchmarks/security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags to assist in tracking Azure resources that store or process sensitive information.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. Function apps should be separated by virtual network (VNet)/subnet and tagged appropriately.

You may also use Private Endpoints to perform network isolation. An Azure Private Endpoint is a network interface that connects you privately and securely to a service (for example: function app HTTPs endpoint) powered by Azure Private Link. Private Endpoint uses a private IP address from your VNet, effectively bringing the service into your VNet. You can use Private Endpoints for your functions hosted in the Premium and App Service plans.

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create Management Groups](../governance/management-groups/create-management-group-portal.md)

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

- [Azure Functions networking options](functions-networking-options.md)

- [Azure Functions Premium Plan](functions-premium-plan.md)

- [Understand Private Endpoint](../private-link/private-endpoint-overview.md)

- [Using Private Endpoints for Azure Functions](../app-service/networking/private-endpoint.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.4: Encrypt all sensitive information in transit

**Guidance**: In the Azure portal for your function apps, under "Platform Features:  Networking: SSL", enable the "HTTPs Only" setting and set the minimum TLS version to 1.2.

- [Require HTTPS on function apps](./security-concepts.md#require-https)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Web**:

[!INCLUDE [Resource Policy for Microsoft.Web 4.4](../../includes/policy/standards/asb/rp-controls/microsoft.web-4-4.md)]

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Not currently available; data identification, classification, and loss prevention features are not currently available for Azure Functions. Tag Function apps that may be processing sensitive information as such and implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.6: Use Role-based access control to control access to resources

**Guidance**: Use Azure role-based access control (Azure RBAC) to manage access to the function app control plane (the Azure portal).

- [How to configure Azure RBAC](../role-based-access-control/role-assignments-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.7: Use host-based data loss prevention to enforce access control

**Guidance**: Not applicable; this recommendation is intended for IaaS compute resources.

Microsoft manages the underlying infrastructure for Azure Functions and has implemented strict controls to prevent the loss or exposure of customer data.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.8: Encrypt sensitive information at rest

**Guidance**: When creating a function app, you must create or link to a general-purpose Azure Storage account that supports Blob, Queue, and Table storage. This is because Functions relies on Azure Storage for operations such as managing triggers and logging function executions. Azure Storage encrypts all data in a storage account at rest. By default, data is encrypted with Microsoft-managed keys. For additional control over encryption keys, you can supply customer-managed keys for encryption of blob and file data. These keys must be present in Azure Key Vault for the function app to be able to access the storage account.

- [Understand storage considerations for Azure Functions](storage-considerations.md)

- [Understand Azure storage encryption for data at rest](../storage/common/storage-service-encryption.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with the Azure Activity log to create alerts for when changes take place to production function apps as well as other critical or related resources.

- [How to create alerts for Azure Activity Log events](../azure-monitor/alerts/alerts-activity-log.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Vulnerability Management

*For more information, see the [Azure Security Benchmark: Vulnerability Management](../security/benchmarks/security-control-vulnerability-management.md).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: Adopt a DevSecOps practice to ensure your function apps are secure and remain as secure as possible throughout the duration of their life-cycle. DevSecOps incorporates your organization's security team and their capabilities into your DevOps practices making security a responsibility of everyone on the team.

In addition, follow recommendations from Azure Security Center to help secure your function apps.

- [How to add continuous security validation to your CI/CD pipeline](/azure/devops/migrate/security-validation-cicd-pipeline?preserve-view=true&view=azure-devops)

- [How to implement Azure Security Center vulnerability assessment recommendations](../security-center/deploy-vulnerability-assessment-vm.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

**Guidance**: Microsoft performs vulnerability management on the underlying systems that support Azure Functions, however you may use the severity of the recommendations within Azure Security Center as well as the Secure Score to measure risk within your environment. Your Secure Score is based on how many Security Center recommendations you have mitigated. To prioritize the recommendations to resolve first, consider the severity of each.

- [Security recommendations reference guide](../security-center/recommendations-reference.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Inventory and Asset Management

*For more information, see the [Azure Security Benchmark: Inventory and Asset Management](../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

**Guidance**: Use Azure Resource Graph to query/discover all resources (such as compute, storage, network, ports, and protocols etc.) within your subscription(s). Ensure appropriate (read) permissions in your tenant and enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use Azure Resource Manager resources going forward.

- [How to create queries with Azure Resource Graph](../governance/resource-graph/first-query-portal.md)

- [How to view your Azure Subscriptions](/powershell/module/az.accounts/get-azsubscription?preserve-view=true&view=azps-4.8.0)

- [Understand Azure RBAC](../role-based-access-control/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track Azure resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

In addition, use Azure policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

Additional information is available at the referenced links.

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create Management Groups](../governance/management-groups/create-management-group-portal.md)

- [How to create and use Tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.4: Define and maintain inventory of approved Azure resources

**Guidance**: Define approved Azure resources and approved software for compute resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in your subscription(s). 

Use Azure Resource Graph to query/discover resources within their subscription(s).  Ensure that all Azure resources present in the environment are approved. 

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md) 

- [How to create queries with Azure Graph](../governance/resource-graph/first-query-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.9: Use only approved Azure services

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

Additional information is available at the referenced links.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to deny a specific resource type with Azure Policy](../governance/policy/samples/built-in-policies.md#general)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.11: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Configure Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resource Manager](../role-based-access-control/conditional-access-azure-management.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Secure Configuration

*For more information, see the [Azure Security Benchmark: Secure Configuration](../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Define and implement standard security configurations for your function app with Azure Policy. Use Azure Policy aliases in the "Microsoft.Web" namespace to create custom policies to audit or enforce the configuration of your functions apps. You may also make use of built-in policy definitions such as:

- Managed identity should be used in your function app

- Remote debugging should be turned off for function apps

- function app should only be accessible over HTTPS

Additional information is available at the referenced links.

- [How to view available Azure Policy Aliases](/powershell/module/az.resources/get-azpolicyalias?preserve-view=true&view=azps-4.8.0)

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Understand Azure Policy Effects](../governance/policy/concepts/effects.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.5: Securely store configuration of Azure resources

**Guidance**: Store and manage ARM templates and custom Azure policy definitions securely in source control.

- [What is infrastructure as code](/azure/devops/learn/what-is-infrastructure-as-code)

- [Design policy as code workflows](../governance/policy/concepts/policy-as-code.md)

- [How to store code in Azure DevOps](/azure/devops/repos/git/gitworkflow?preserve-view=true&view=azure-devops)

- [Azure Repos Documentation](/azure/devops/repos/?preserve-view=true&view=azure-devops)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Use built-in Azure Policy definitions as well as Azure Policy aliases in the "Microsoft.Web" namespace to create custom policies to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Use built-in Azure Policy definitions as well as Azure Policy aliases in the "Microsoft.Web" namespace to create custom policies to alert, audit, and enforce system configurations. Use Azure policy [audit], [deny], and [deploy if not exist] to automatically enforce configurations for your Azure resources.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.11: Manage Azure secrets securely

**Guidance**: Use Managed Identities in conjunction with Azure Key Vault to simplify and secure secret management for your cloud applications. Managed Identities allows your function app to authenticate to any service that supports Azure Active Directory (Azure AD) authentication, including Key Vault, without any credentials in your code.

- [How to create a Key Vault](../key-vault/secrets/quick-create-portal.md)

- [How to use managed identities for App Service and Azure Functions](../app-service/overview-managed-identity.md)

- [How to authenticate to Key Vault](../key-vault/general/authentication.md)

- [How to assign a Key Vault access policy](../key-vault/general/assign-access-policy-portal.md)

- [Use Key Vault references for App Service and Azure Functions](../app-service/app-service-key-vault-references.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.12: Manage identities securely and automatically

**Guidance**: Use Managed Identities to provide your function app with an automatically managed identity in Azure Active Directory (Azure AD). Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code.

- [How to use managed identities for App Service and Azure Functions](../app-service/overview-managed-identity.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Web**:

[!INCLUDE [Resource Policy for Microsoft.Web 7.12](../../includes/policy/standards/asb/rp-controls/microsoft.web-7-12.md)]

### 7.13: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault. 

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Recovery

*For more information, see the [Azure Security Benchmark: Data Recovery](../security/benchmarks/security-control-data-recovery.md).*

### 9.1: Ensure regular automated back-ups

**Guidance**: Use the Backup and Restore feature to schedule regular backups of your app. Function apps running in the Premium plan have the same hosting capabilities as web apps in Azure App Service, which includes the "Backup and Restore" feature.

Also make use of a source control solution such as Azure Repos and Azure DevOps to securely store and manage your code. Azure DevOps Services leverages many of the Azure storage features to ensure data availability in the case of hardware failure, service disruption, or region disaster. Additionally, the Azure DevOps team follows procedures to protect data from accidental or malicious deletion.

- [Back up your app in Azure](../app-service/manage-backup.md)

- [Understand data availability in Azure DevOps](/azure/devops/organizations/security/data-protection?preserve-view=true&view=azure-devops#data-availability)

- [How to store code in Azure DevOps](/azure/devops/repos/git/gitworkflow?preserve-view=true&view=azure-devops)

- [Azure Repos Documentation](/azure/devops/repos/?preserve-view=true&view=azure-devops)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.2: Perform complete system backups and backup any customer-managed keys

**Guidance**: Use the Backup and Restore feature to schedule regular backups of your app. Function apps running in the Premium plan have the same hosting capabilities as web apps in Azure App Service, which includes the "Backup and Restore" feature. Backup customer-managed keys within Azure Key Vault.

Also make use of a source control solution such as Azure Repos and Azure DevOps to securely store and manage your code. Azure DevOps Services leverages many of the Azure storage features to ensure data availability in the case of hardware failure, service disruption, or region disaster. Additionally, the Azure DevOps team follows procedures to protect data from accidental or malicious deletion.

- [Back up your app in Azure](../app-service/manage-backup.md)

- [How to backup key vault keys in Azure](/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey)

- [Understand data availability in Azure DevOps](/azure/devops/organizations/security/data-protection?preserve-view=true&view=azure-devops#data-availability)

- [How to store code in Azure DevOps](/azure/devops/repos/git/gitworkflow?preserve-view=true&view=azure-devops)

- [Azure Repos Documentation](/azure/devops/repos/?preserve-view=true&view=azure-devops)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.3: Validate all backups including customer-managed keys

**Guidance**: Ensure ability to periodically perform restoration from the Backup and Restore feature. If using another offline location to backup your code, periodically ensure ability to perform complete restorations. Test restoration of backed up customer-managed keys.

- [Restore an app in Azure from a backup](../app-service/web-sites-restore.md)

- [Restore an app in Azure from a snapshot](../app-service/app-service-web-restore-snapshots.md)

- [How to restore key vault keys in Azure](/powershell/module/az.keyvault/restore-azkeyvaultkey?preserve-view=true&view=azps-4.8.0)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.4: Ensure protection of backups and customer-managed keys

**Guidance**: Backups from the Backup and Restore feature use an Azure Storage account in your subscription. Azure Storage encrypts all data in a storage account at rest. By default, data is encrypted with Microsoft-managed keys. For additional control over encryption keys, you can supply customer-managed keys for encryption of storage data.

If you are using customer-managed-keys, ensure Soft-Delete in Key Vault is enabled to protect keys against accidental or malicious deletion.

- [Azure Storage encryption at rest](../storage/common/storage-service-encryption.md)

- [How to enable Soft-Delete in Key Vault](../storage/blobs/soft-delete-blob-overview.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.

- [How to configure Workflow Automations within Azure Security Center](../security-center/security-center-planning-and-operations-guide.md)

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [NIST's Computer Security Incident Handling Guide](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, clearly mark subscriptions (for ex. production, non-prod) and create a naming system to clearly identify and categorize Azure resources.

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

- [Refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that the customer's data has been accessed by an unlawful or unauthorized party.  Review incidents after the fact to ensure that issues are resolved.

- [How to set the Azure Security Center Security Contact](../security-center/security-center-provide-security-contact-details.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts to Azure Sentinel.

- [How to configure continuous export](../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../sentinel/connect-azure-security-center.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.6: Automate the response to security alerts

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses to security alerts and recommendations with Logic Apps.

- [How to configure Workflow Automation and Logic Apps](../security-center/workflow-automation.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Penetration Tests and Red Team Exercises

*For more information, see the [Azure Security Benchmark: Penetration Tests and Red Team Exercises](../security/benchmarks/security-control-penetration-tests-red-team-exercises.md).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

**Guidance**: Follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies. Use Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1)

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Next steps

- See the [Azure Security Benchmark V2 overview](../security/benchmarks/overview.md)
- Learn more about [Azure security baselines](../security/benchmarks/security-baselines-overview.md)
