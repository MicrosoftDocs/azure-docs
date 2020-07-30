---
title: Azure security baseline for App Service
description: The App Service security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: app-service
ms.topic: conceptual
ms.date: 07/30/2020
ms.author: mbaldwin
ms.custom: security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for App Service

The Azure Security Baseline for App Service contains recommendations that will help you improve the security posture of your deployment.

The baseline for this service is drawn from the [Azure Security Benchmark version 1.0](https://docs.microsoft.com/azure/security/benchmarks/overview), which provides recommendations on how you can secure your cloud solutions on Azure with our best practices guidance.

For more information, see [Azure Security Baselines overview](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview).

## Network security

*For more information, see [Security control: Network security](/azure/security/benchmarks/security-control-network-security).*

### 1.1: Protect Azure resources within virtual networks

**Guidance**: Perimeter security in App Service is achieved through Virtual Networks. The App Service Environment (ASE) is a deployment of Azure App Service into a subnet in your Azure virtual network (VNet). There are two types of ASE, External ASE and ILB (Internal Load Balancer) ASE.

ASE (App Service Environment) are deployed directly into virtual networks and hence can be secured with NSGs (Network Security Groups) to block inbound and outbound traffic to resources in a VNet.

NSGs provide the ability to control network access within a VNet. There's an implicit deny rule at the lowest priority to deny everything at the Azure portal, and any allow rules are required to be built. NSGs can be applied on the ASE subnet in order to restrict access to the apps on the ASE. It is recommended to pay careful attention to the ASE dependencies as the ASE will stop working If any dependencies are blocked.

An NSG that's applied to an integration subnet is in effect regardless of any routes applied to the integration subnet. After your NSGs are defined, assign them to the subnet that your ASE is on.

• In an ASE, there is no access to the VMs being used to host the ASE as they're in a Microsoft-managed subscription.

• An Application Gateway with a Web Application Firewall could be configured for an ASE

In the Multi-tenant App Service, NSGs can be used to block outbound traffic. To block traffic to public addresses, the application must be using regional VNet Integration and have the app setting WEBSITE_VNET_ROUTE_ALL must be set to 1. The inbound rules in an NSG don't apply to an app because VNet Integration affects only outbound traffic from your app.

The VNet Integration feature is used in multitenant apps. VNet Integration is used only to make outbound calls from an app into its VNet. When using VNet Integration with VNets in the same region, NSGs and Route tables (UDRs) can be used:

• The inbound rules don't apply because VNet Integration can't be used to provide inbound access to an app.

• Route tables (UDRs) can be placed on the integration subnet to send outbound traffic where intended.

When WEBSITE_VNET_ROUTE_ALL is set to 1 then, an NSG that's applied to an integration subnet is in effect regardless of any routes applied to the same integration subnet. If WEBSITE_VNET_ROUTE_ALL is set to 1 and there aren’t any routes that affect public address traffic on the integration subnet, all the outbound traffic will still be subject to NSGs assigned to the integration subnet. If WEBSITE_VNET_ROUTE_ALL isn't set, NSGs are only applied to RFC1918 traffic.

Inbound traffic to your app can be secured with:

• Access Restrictions – a series of allow/deny rules that control inbound access

• Service Endpoints –enable you to secure traffic to originating from a set of VNet/subnets

• Private Endpoints –exposes your app on an address in your VNet. When this is enabled on your app, your app is no longer internet accessible.

You can combine Access Restrictions and Service Endpoints. You cannot use Private Endpoints in conjunction with the other two features.

Access Restrictions can be used with apps in an ASE but you cannot use Service Endpoints and Private Endpoints with apps in an ASE.

* [Network Security Groups](https://docs.microsoft.com/azure/virtual-network/security-overview)

* [Networking considerations for an App Service Environment](https://docs.microsoft.com/azure/app-service/environment/network-info)

* [How to create an external ASE](https://docs.microsoft.com/azure/app-service/environment/create-external-ase)

* [How to create an internal ASE](https://docs.microsoft.com/azure/app-service/environment/create-ilb-ase)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and network interfaces

**Guidance**: Use Azure Security Center and follow network protection recommendations to help secure network resources and network configurations related to your Azure App Service web apps and APIs.

Send the traffic through to an Azure Firewall – montitor the traffic (add content)

(add content)

* [Understand Network Security provided by Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-network-recommendations)

* [How to Enable Monitoring and Protection of App Service](https://docs.microsoft.com/azure/security-center/security-center-app-services)

* [How to Enable NSG Flow Logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal)

* [How to Enable and use Traffic Analytics](https://docs.microsoft.com/azure/network-watcher/traffic-analytics)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.3: Protect critical web applications

**Guidance**: For an App Service Environment, if you want to secure an internet accessible app:

• Secure the ASE as described in Locking down an App Service Environment

• Deploy a WAF enabled application gateway in front of your internet facing apps

• Use access restrictions to secure inbound traffic to the application gateway

• Secure applications with AAD to ensure authentication

• Disable TLS 1.2 on the app

• Set the app to HTTPS only

• Drive all application outbound through an Azure Firewall device and monitor the logs

If you want to secure an internet accessible app in the multi-tenant service:

• Deploy a WAF enabled device in front of your apps

• Use access restrictions or service endpoints to secure inbound traffic to the WAF device

• Secure applications with AAD to ensure authentication

• Disable TLS 1.2 on the app

• Set the app to HTTPS only

• Use VNet Integration and the app setting WEBSITE_VNET_ROUTE_ALL to make all outbound traffic subject to NSGs and UDRs on the integration subnet.

• Drive all application outbound through an Azure Firewall device and monitor the logs

* [Azure Web application firewall on Azure Application Gateway](https://docs.microsoft.com/azure/web-application-firewall/ag/ag-overview)

* [Azure App Service Access Restrictions](https://docs.microsoft.com/azure/app-service/app-service-ip-restrictions)

* [Track WAF alerts and easily monitor trends with Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/overview)

* [Locking down an App Service Environment](https://docs.microsoft.com/azure/app-service/environment/firewall-integration)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.4: Deny communications with known-malicious IP addresses

**Guidance**: Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious or unused public IP addresses.

• Secure the ASE as described in Locking down an App Service Environment

• Deploy a WAF enabled application gateway in front of your internet facing apps

• Use access restrictions to secure inbound traffic to the application gateway

Use the virtual network integration feature to restrict incoming source IP addresses through network security groups (NSGs). This allows placing many Azure resources in a non-internet, routable network access restrictions and controls.

Additionally the &lt;dynamicIpSecurity&gt; element provides a dynamic means of blocking malicious Web requests by configuring the web.config

APP Service Multi-tenant has a public internet facing endpoint and service endpoints can be used to allow traffic only from a specific subnet within an Azure Virtual Network and block everything else.

Also with Access Restrictions, customers can configure network ACLs (IP Restrictions) to lock down allowed inbound traffic.

* [How to configure a Web Application Firewall (WAF) for App Service Environment](https://docs.microsoft.com/azure/app-service/environment/app-service-app-service-environment-web-application-firewall)

* [Overview of Dynamic IP Security](https://docs.microsoft.com/iis/configuration/system.webserver/security/dynamicipsecurity/)

* [Azure App Service Access Restrictions](https://docs.microsoft.com/azure/app-service/app-service-ip-restrictions)

* [Secure the ASE as described in Locking down an App Service Environment](https://docs.microsoft.com/azure/app-service/environment/firewall-integration)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.5: Record network packets

**Guidance**: For an ASE, Azure security Center monitors requests and responses sent to and from your apps running in App Service. Attacks can be monitored against a web application by using a real-time WAF log. The log is integrated with Azure Monitor to track WAF alerts and easily monitor trends.

&lt;add the block content – feature&gt;

For Multi-Tenant App Service, due to the nature of how regional VNet Integration operates, the traffic that's used with VNet Integration doesn't show up in Azure Network Watcher or NSG flow logs. (add content – what are we really viewing here)?

* [How to control inbound traffic to an App Service environment](https://docs.microsoft.com/azure/app-service/environment/app-service-app-service-environment-control-inbound-traffic)

* [Integrate your apps in an ASE with an Application Gateway](https://docs.microsoft.com/azure/app-service/environment/integrate-with-application-gateway)

* [How to Enable and use Traffic Analytics](https://docs.microsoft.com/azure/network-watcher/traffic-analytics)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Not applicable. Not built into the platform directly.

(set this up using a third party solution)

Using service endpoints, (review this scenario)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.7: Manage traffic to web applications

**Guidance**: For an app in App Service Environment:

• Secure the ASE as described in Locking down an App Service Environment

• Deploy a WAF enabled application gateway in front of your internet facing apps

• Use access restrictions to secure inbound traffic to the application gateway

• Set the app to HTTPS only

• Drive all application outbound through an Azure Firewall device and monitor the logs

If you want to secure an internet accessible app in the multi-tenant service:

• Deploy a WAF enabled device in front of your apps

• Use access restrictions or service endpoints to secure inbound traffic to the WAF device

• Set the app to HTTPS only

• Use VNet Integration and the app setting WEBSITE_VNET_ROUTE_ALL to make all outbound traffic subject to NSGs and UDRs on the integration subnet.

• Drive all application outbound through an Azure Firewall device and monitor the logs

A way to restrict access to your web apps is to use Azure App Service static IP restrictions (with well defined endpoints).

For example, you can restrict the web app so that it only receives traffic from the application gateway. Use the app service IP restriction feature to list the application gateway VIP as the only address with access.

(rewrite the above)

* [Azure Web application firewall on Azure Application Gateway](https://docs.microsoft.com/azure/web-application-firewall/ag/ag-overview)

* [Azure App Service Access Restrictions](https://docs.microsoft.com/azure/app-service/app-service-ip-restrictions)

* [Track WAF alerts and easily monitor trends with Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/overview)

* [Understand Azure Web Application Firewall](https://docs.microsoft.com/azure/application-gateway/overview#web-application-firewall)

* [How to configure end-to-end TLS by using Application Gateway with the portal](https://docs.microsoft.com/azure/application-gateway/end-to-end-ssl-portal)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: ASE: App service MGMT

Reference the (locking down doc)

Virtual Network service tags can be used to define network access controls on Network Security Groups or Azure Firewall with Azure App Service web apps.

By specifying the service tag name in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

(review/edit: Tags on outbound traffic)

* [For more information about using service tags](https://docs.microsoft.com/azure/virtual-network/service-tags-overview)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement standard security configurations for network settings related to your Azure App Service web apps.

(maintain config using policy) Use Azure Policy aliases in the "Microsoft.Web" and "Microsoft.Network" namespaces to create custom policies to audit or enforce the network configuration of your Azure App Service web apps. You may also make use of built-in policy definitions for Azure App Service, such as:

• App Service should use a virtual network service endpoint

• Web Application should only be accessible over HTTPS

• Latest TLS version should be used in your Web App

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.10: Document traffic configuration rules

**Guidance**: If using Network Security groups (NSGs) with your Azure App Service web apps, use tags for the NSGs and other resources related to network security and traffic flow.

For individual NSG rules, use the "Description" field to specify business need and/or duration (etc.) for any rules that allow traffic to/from a network.

(description field for access restrictions – review and add)

Use any of the built-in Azure policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with tags and to notify you of existing untagged resources. You may use Azure PowerShell or Azure CLI to look-up or perform actions on resources based on their tags.

Access Restrictions feature can be used to control inbound traffic to your app. An NSG that's applied to your integration subnet is in effect regardless of any routes applied to your integration subnet. After your NSGs are defined, assign them to the subnet that your ASE is on.

* [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

* [Azure App Service Access Restrictions](https://docs.microsoft.com/azure/app-service/app-service-ip-restrictions)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network settings and resources related to your Azure App Service resources.

Create alerts within Azure Monitor that will trigger when changes to critical network settings or resources takes place.

Diagnostic Settings (preview) can be used to to send logs to Storage Accounts,

Event Hubs and Log Analytics. (grep for preview/GA)

Azure Security Center generates detailed security alerts and recommendations. You can view them in the portal or through programmatic tools.

You may also need to export this information or send it to other monitoring tools in your environment. Tools are available to export alerts and recommendations either manually or in an ongoing, continuous fashion. Using these tools you can:

• Continuously export to Log Analytics workspaces

• Continuously export to Azure Event Hubs (for integrations with third-party SIEMs)

• Export to CSV (one time)

(add policy to monitor – policy will front)

* [How to view and retrieve Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view)

* [How to create alerts in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

* [Export security alerts and recommendations](https://docs.microsoft.com/azure/security-center/continuous-export)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Logging and monitoring

*For more information, see [Security control: Logging and monitoring](/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.1: Use approved time synchronization sources

**Guidance**: Microsoft maintains the time source used for Azure resources such as Azure App Service.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 2.2: Configure central security log management

**Guidance**: For App Service, central security log management can be performed with Azure Sentinel or a SIEM available in the Azure marketplace. There are various log sources noted below for central management.

Security alerts produced by Azure Security Center are published to the Azure Activity log. Azure Monitor enables you to get your Activity log data to an Event Hub where it can be read by a SIEM. Security Center must be configured in your Azure subscription before starting.

For control plane audit logging, enable Azure Activity Log diagnostic settings and send the logs to a Log Analytics workspace, Azure event hub, or Azure storage account.

Azure Activity Log data let’s you determine the "what, who, and when" for any write operations (PUT, POST, DELETE) performed at the control plane level for Azure App Service and other Azure resources.

You can integrate your App Service Environment (ASE) with Azure Monitor to send logs about the ASE to Azure Storage, Azure Event Hubs, or Log Analytics.

You can save your queries for future use, pin query results to Azure Dashboards, and create log alerts.

Additionally, the Data access REST API in Application Insights lets you access your telemetry programmatically.

* [Logging ASE Activity](https://docs.microsoft.com/azure/app-service/environment/using-an-ase#logging)

* [How to enable Diagnostic Settings for Azure Activity Log](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings-legacy)

* [How to enable Diagnostic Settings for Azure App Service](https://docs.microsoft.com/azure/app-service/troubleshoot-diagnostic-logs)

* [How to enable Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview)

* [Export security alerts and recommendations](https://docs.microsoft.com/azure/security-center/continuous-export)

* [Export telemetry from Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/export-telemetry)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

**Guidance**: For control plane audit logging for App Service, enable Azure Activity Log diagnostic settings and send the logs to a Log Analytics workspace, Azure event hub, or Azure storage account.

The "what, who, and when" for any write operations (PUT, POST, DELETE) performed at the control plane level can be determined using Azure Activity Log data for Azure App Service and other Azure resources.

Additionally, Azure Key Vault provides centralized secret management with access policies and audit history.

* [How to enable Diagnostic Settings for Azure Activity Log](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings-legacy)

* [How to enable Diagnostic Settings for Azure App Service](https://docs.microsoft.com/azure/app-service/troubleshoot-diagnostic-logs)

* [Resource Manager Operations](https://docs.microsoft.com/azure/role-based-access-control/resource-provider-operations)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.4: Collect security logs from operating systems

**Guidance**: Not applicable; this recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: Not applicable

### 2.5: Configure security log storage retention

**Guidance**: In Azure Monitor, set log retention period for Log Analytics workspaces associated with your Azure App Service resources according to your organization's compliance regulations.

* [How to set log retention parameters](https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.6: Monitor and review logs

**Guidance**: Enable Azure Activity Log diagnostic settings as well as the diagnostic settings for your Azure App Service resources and send the logs to a Log Analytics workspace.

Perform queries in Log Analytics to search terms, identify trends, analyze patterns, and provide many other insights based on the collected data.

Enable Application Insights for your Azure App Service web apps and to collect log, performance, and error data. You can view the telemetry data collected by Application Insights within the Azure portal.

If you have deployed Azure Web Application Firewall (WAF), you can monitor attacks against your web applications by using a real-time WAF log. The log is integrated with Azure Monitor to track WAF alerts and easily monitor trends.

Microsoft Azure Sentinel is a scalable, cloud-native, security information event management (SIEM) and security orchestration automated response (SOAR) solution. It is available to connect to various data sources and connectors, as based on business requirements.

Optionally, you may enable and on-board data a third-party SIEM like Barracuda in Azure Marketplace

* [How to enable diagnostic settings for Azure Activity Log](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings-legacy)

* [How to enable Diagnostic Settings for Azure App Service](https://docs.microsoft.com/azure/app-service/troubleshoot-diagnostic-logs)

* [How to enable Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview)

* [How to integrate your App Service Environment with the Azure Application Gateway (WAF)](https://docs.microsoft.com/azure/app-service/environment/integrate-with-application-gateway)

* [Azure Sentinel documentation](https://docs.microsoft.com/azure/sentinel/)

* [How to on-board Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activities

**Guidance**: Security alerts produced by Azure Security Center are published to the Azure Activity log. Azure Monitor enables you to get your Activity log data to an Event Hub where it can be read by a SIEM like Azure Sentinel. Azure Security Center must be configured in your Azure subscription before starting.

If you have deployed Azure Web Application Firewall (WAF), you can monitor attacks against your web applications by using a real-time WAF log. The log is integrated with Azure Monitor to track WAF alerts and easily monitor trends.

Optionally, you may enable and on-board data to Azure Sentinel or a third-party SIEM.

* [How to integrate your App Service Environment with the Azure Application Gateway (WAF)](https://docs.microsoft.com/azure/app-service/environment/integrate-with-application-gateway)

* [Export security alerts and recommendations](https://docs.microsoft.com/azure/security-center/continuous-export)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.8: Centralize anti-malware logging

**Guidance**: Not applicable; Azure App Service does not process or produce anti-malware related logs.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.9: Enable DNS query logging

**Guidance**: Not applicable; Azure App Service does not process or produce user accessible DNS-related logs.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.10: Enable command-line audit logging

**Guidance**: Not applicable; this guideline is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Identity and access control

*For more information, see [Security control: Identity and access control](/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Azure Active Directory (AD) has built-in roles that must be explicitly assigned and are queryable. Use the Azure AD PowerShell module to perform ad hoc queries to discover accounts that are members of administrative groups.

* [How to get a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0)

* [How to get members of a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0)

* [How to use managed identities for App Service and Azure Functions](https://docs.microsoft.com/azure/app-service/overview-managed-identity?context=azure%2Factive-directory%2Fmanaged-identities-azure-resources%2Fcontext%2Fmsi-context&amp;tabs=dotnet)

* [Add or remove Azure role assignments using the Azure portal](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.2: Change default passwords where applicable

**Guidance**: Control plane access to Azure App Service is controlled through Azure Active Directory (AD). Azure AD does not have the concept of default passwords.

When building your own apps, avoid implementing default passwords for user access. Instead, use one of the identity providers available by default for Azure App Service, such as Azure Activity Directory, Microsoft Account, Facebook, Google, or Twitter.

Additionally, unless anonymous requests are supported, disable anonymous access. For more information on Azure App Service authentication options link.

* [Identity providers available by default in Azure App Service](https://docs.microsoft.com/azure/app-service/overview-authentication-authorization#identity-providers)

* [Authentication and authorization in Azure App Service and Azure Functions](https://docs.microsoft.com/azure/app-service/overview-authentication-authorization)

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

* [Learn more about granting users access to applications](https://docs.microsoft.com/azure/role-based-access-control/overview)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.4: Use Azure Active Directory single sign-on (SSO)

**Guidance**: Authenticate through Azure Active Directory (AD). App Service provides an OAuth 2.0 service for your identity provider. OAuth 2.0 focuses on client developer simplicity while providing specific authorization flows for web applications, desktop applications, and mobile phones. Azure AD uses OAuth 2.0 to enable you to authorize access to mobile and web applications.

Implement single sign-on for your Azure App Service apps using a built-in identity provider. Azure App Service apps uses federated identity, in which a third-party identity provider manages the user identities and authentication flow for you. Five identity providers are available by default:

• Azure Active Directory

• Microsoft Account

• Facebook

• Google

• Twitter

When you enable authentication and authorization with one of these providers, its sign-in endpoint is available for user authentication and for validation of authentication tokens from the provider.

* [Understand authentication and authorization in Azure App Service](https://docs.microsoft.com/azure/app-service/overview-authentication-authorization#identity-providers)

* [Learn about Authentication and Authorization in Azure App Service](https://docs.microsoft.com/azure/app-service/overview-authentication-authorization)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.5: Use multi-factor authentication for all Azure Active Directory-based access

**Guidance**: Enable Azure Active Directory (AD) Multi-Factor Authentication (MFA) and follow Azure Security Center Identity and Access Management recommendations.

Implement Multi-Factor Authentication for Azure Active Directory: Administrators need to ensure that the subscription accounts in the portal are protected. The subscription is vulnerable to attacks because it manages the resources that you created.

To protect the subscription, enable Multi-Factor Authentication on the Azure Active Directory tab of the subscription.

* [Azure Security MFA](https://docs.microsoft.com/azure/security/develop/secure-aad-app)

* [How to enable MFA in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

* [How to monitor identity and access within Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.6: Use secure, Azure-managed workstations for administrative tasks

**Guidance**: Use privileged access workstations (PAW) with Multi-Factor Authentication (MFA) configured to log into and configure Azure resources.

* [Learn about Privileged Access Workstations](https://docs.microsoft.com/windows-server/identity/securing-privileged-access/privileged-access-workstations)

* [How to enable MFA in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.7: Log and alert on suspicious activities from administrative accounts

**Guidance**: Use Azure Active Directory (AD) Privileged Identity Management (PIM) for generation of logs and alerts when suspicious or unsafe activity occurs in the environment.

In addition, use Azure AD risk detections to view alerts and reports on risky user behavior.

Azure Security Center's threat protection provides comprehensive defenses for your environment which includes Threat protection for Azure compute resources such as Windows machines, Linux machines, Azure App Service, and Azure containers

* [How to deploy Privileged Identity Management (PIM)](https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-deployment-plan)

* [Understand Azure AD risk detections](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risk-events)

- [Threat protection for Azure compute resources](https://docs.microsoft.com/azure/security-center/threat-protection)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.8: Manage Azure resources from only approved locations

**Guidance**: Use Conditional Access Named Locations to allow access to the Azure portal from only specific logical groupings of IP address ranges or countries/regions.

* [How to configure Named Locations in Azure](https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory (AD) as the central authentication and authorization system for your Azure Apps Service apps. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.

* [How to configure your Azure App Service apps to use Azure AD login](https://docs.microsoft.com/azure/app-service/configure-authentication-provider-aad)

* [How to create and configure an AAD instance](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-access-create-new-tenant)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.10: Regularly review and reconcile user access

**Guidance**: Azure Active Directory (AD) provides logs to help you discover stale accounts. In addition, use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access can be reviewed on a regular basis to make sure only the right Users have continued access.

* [Understand Azure AD reporting](https://docs.microsoft.com/azure/active-directory/reports-monitoring/)

* [How to use Azure Identity Access Reviews](https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.11: Monitor attempts to access deactivated credentials

**Guidance**: Use Azure Active Directory (AD) as the central authentication and authorization system for your Azure App Service apps. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.

You have access to Azure AD sign-in activity, audit and risk event log sources, which allow you to integrate with Azure Sentinel or a third-party SIEM.

You can streamline this process by creating diagnostic settings for Azure AD user accounts and sending the audit logs and sign-in logs to a Log Analytics workspace. You can configure desired log alerts within Log Analytics.

* [How to configure your Azure App Service apps to use Azure AD login](https://docs.microsoft.com/azure/app-service/configure-authentication-provider-aad)

* [How to integrate Azure Activity Logs into Azure Monitor](https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)

* [How to on-board Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.12: Alert on account sign-in behavior deviation

**Guidance**: Use Azure Active Directory (AD) as the central authentication and authorization system for your Azure App Service web apps. For account login behavior deviation on the control plane (the Azure portal), use Azure Active Directory (AD) Identity Protection and risk detection features to configure automated responses to detected suspicious actions related to user identities. You can also ingest data into Azure Sentinel for further investigation.

* [How to configure your Azure App Service app to use Azure AD login](https://docs.microsoft.com/azure/app-service/configure-authentication-provider-aad)

* [How to view Azure AD risky sign-ins](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risky-sign-ins)

* [How to configure and enable Identity Protection risk policies](https://docs.microsoft.com/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies)

* [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

**Guidance**: Not yet available; Customer Lockbox is not yet supported for Azure App Service.

* [List of Customer Lockbox-supported services](https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview#supported-services-and-scenarios-in-general-availability)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Data protection

*For more information, see [Security control: Data protection](/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags to assist in tracking Azure App Service resources that store or process sensitive information.

* [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production.

Deploy your Azure App Service web app into a Virtual Network (VNet). Perimeter security in App Service is achieved through VNets.

The App Service Environment (ASE) is a deployment of Azure App Service into a subnet in your Azure (VNet). There are two types of ASE, External ASE and ILB (Internal Load Balancer) ASE.

For Multi-tenant App Service, VNet Integration gives your app access to resources in your VNet, but it doesn't grant inbound private access to your app from the VNet. Private site access refers to making an app accessible only from a private network, such as from within an Azure virtual network. VNet Integration is used only to make outbound calls from your app into your VNet. The VNet Integration feature behaves differently when it's used with VNet in the same region and with VNet in other regions. The VNet Integration feature has two variations:

• Regional VNet Integration: When you connect to Azure Resource Manager virtual networks in the same region, you must have a dedicated subnet in the VNet you're integrating with.

• Gateway-required VNet Integration: When you connect to VNet in other regions or to a classic virtual network in the same region, you need an Azure Virtual Network gateway provisioned in the target VNet.

* [Networking considerations for an App Service Environment](https://docs.microsoft.com/azure/app-service/environment/network-info)

* [How to create an external ASE](https://docs.microsoft.com/azure/app-service/environment/create-external-ase)

* [How to create an internal ASE](https://docs.microsoft.com/azure/app-service/environment/create-ilb-ase)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: While data identification, classification, and loss prevention features are not yet available for Azure App Service, you can reduce the data exfiltration risk from the virtual network by removing all NSG rules where destination is tag Internet or Azure services.

Microsoft manages the underlying infrastructure for Azure App Service and has implemented strict controls to prevent the loss or exposure of customer data.

* [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### 4.4: Encrypt all sensitive information in transit

**Guidance**: HTTPS and TLS 1.2 is the default minimum version configured in TLS/SSL settings used for encrypting all information in transit. Redirect HTTP connection requests to HTTPS.

* [Understand encryption in transit for Azure App Service web apps](https://docs.microsoft.com/azure/app-service/security-recommendations)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Currently not available; data identification, classification, and loss prevention features are not yet available for Azure App Service. Tag App Service apps that may be processing sensitive information as such and implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

* [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### 4.6: Use Role-based access control to control access to resources

**Guidance**: Use Azure Active Directory (AD) role-based access control (RBAC) to control access to the Azure App Service control plane (the Azure portal).

* [How to configure RBAC in Azure](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.7: Use host-based data loss prevention to enforce access control

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 4.8: Encrypt sensitive information at rest

**Guidance**: Web site file content is stored in Azure Storage, which automatically encrypts the content at rest. You may choose to store application secrets in Key Vault and retrieve them at runtime.

Customer supplied secrets are encrypted at rest. The secrets are encrypted at rest while stored in App Service configuration databases.

Locally attached disks can optionally be used as temporary storage by websites (D:\local and %TMP%). Locally attached disks are not encrypted at rest.

* [Understand data protection controls for Azure App Service](https://docs.microsoft.com/azure/app-service/app-service-security-controls)

* [Understand Azure Storage encryption at rest](https://docs.microsoft.com/azure/storage/common/storage-service-encryption)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with the Azure Activity log to create alerts for when changes take place to production Azure App Service web apps as well as other critical or related resources.

* [How to create alerts for Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Vulnerability management

*For more information, see [Security control: Vulnerability management](/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: Adopt a DevSecOps practice to ensure your Azure App Service web apps are secure and remain as secure as possible throughout the duration of their life-cycle. DevSecOps incorporates your organization's security team and their capabilities into your DevOps practices making security a responsibility of everyone on the team.

In addition, follow recommendations from Azure Security Center to help secure your Azure App Service apps.

* [How to add continuous security validation to your CI/CD pipeline](https://docs.microsoft.com/azure/devops/migrate/security-validation-cicd-pipeline?view=azure-devops)

* [How to implement Azure Security Center vulnerability assessment recommendations](https://docs.microsoft.com/azure/security-center/security-center-vulnerability-assessment-recommendations)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 5.2: Deploy automated operating system patch management solution

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 5.3: Deploy automated patch management solution for third-party software titles

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 5.4: Compare back-to-back vulnerability scans

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

**Guidance**: Microsoft performs vulnerability management on the underlying systems that support Azure App Service, however you may use the severity of the recommendations within Azure Security Center as well as the Secure Score to measure risk within your environment. Your Secure Score is based on how many Security Center recommendations you have mitigated. To prioritize the recommendations to resolve first, consider the severity of each.

* [Security recommendations reference guide](https://docs.microsoft.com/azure/security-center/recommendations-reference)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Inventory and asset management

*For more information, see [Security control: Inventory and asset management](/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use automated asset discovery solution

**Guidance**: Use Azure Resource Graph to query/discover all resources (such as compute, storage, network, ports, and protocols etc.) within your subscription(s). Ensure appropriate (read) permissions in your tenant and enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use Azure Resource Manager resources going forward.

* [How to create queries with Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

* [How to view your Azure Subscriptions](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0)

* [Understand Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/overview)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

* [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

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

### 6.4: Define and maintain inventory of approved Azure resources

**Guidance**: Define approved Azure resources and approved software for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in your subscription(s).

Use Azure Resource Graph to query/discover resources within their subscription(s). Ensure that all Azure resources present in the environment are approved.

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

* [How to create queries with Azure Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.6: Monitor for unapproved software applications within compute resources

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.7: Remove unapproved Azure resources and software applications

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.8: Use only approved applications

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.9: Use only approved Azure services

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:
- Not allowed resource types
- Allowed resource types

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

* [How to deny a specific resource type with Azure Policy](https://docs.microsoft.com/azure/governance/policy/samples/not-allowed-resource-types)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.10: Maintain an inventory of approved software titles

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.11: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Configure Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

* [How to configure Conditional Access to block access to Azure Resource Manager](https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.12: Limit users' ability to execute scripts within compute resources

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.13: Physically or logically segregate high risk applications

**Guidance**: For sensitive or high risk Azure App Service web apps, implement separate subscriptions and/or management groups to provide isolation.

Deploy the high risk Azure App Service web app into its own Virtual Network (VNet). Perimeter security in App Service is achieved through VNets. The App Service Environment (ASE) is a deployment of Azure App Service into a subnet in your Azure (VNet). There are two types of ASE, External ASE and ILB (Internal Load Balancer) ASE; choose the best architecture for your use case.

* [Networking considerations for an App Service Environment](https://docs.microsoft.com/azure/app-service/environment/network-info)

* [How to create an external ASE](https://docs.microsoft.com/azure/app-service/environment/create-external-ase)

* [How to create an internal ASE](https://docs.microsoft.com/azure/app-service/environment/create-ilb-ase)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Secure configuration

*For more information, see [Security control: Secure configuration](/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Define and implement standard security configurations for your Azure App Service web apps with Azure Policy. Use Azure Policy aliases in the "Microsoft.Web" namespace to create custom policies to audit or enforce the configuration of your Azure App Service web apps. You may also make use of the many built-in policy definitions such as:
- App Service should use a virtual network service endpoint
- Web Application should only be accessible over HTTPS
- Latest TLS version should be used in your Web App

* [How to view available Azure Policy Aliases](https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0)

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.2: Establish secure operating system configurations

**Guidance**: Not applicable; this guideline is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure policy [deny] and [deploy if not exist] to enforce secure settings across your Azure App Service web apps.

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

* [Understand Azure Policy Effects](https://docs.microsoft.com/azure/governance/policy/concepts/effects)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.4: Maintain secure operating system configurations

**Guidance**: Not applicable; this guideline is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.5: Securely store configuration of Azure resources

**Guidance**: If using custom Azure policy definitions, use Azure DevOps or Azure Repos to securely store and manage your code.

* [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops)

* [Azure Repos Documentation](https://docs.microsoft.com/azure/devops/repos/index?view=azure-devops)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.6: Securely store custom operating system images

**Guidance**: Not applicable; this guideline is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Use built-in Azure Policy definitions as well as Azure Policy aliases in the "Microsoft.Web" namespace to create custom policies to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.8: Deploy configuration management tools for operating systems

**Guidance**: Not applicable; this guideline is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Use built-in Azure Policy definitions as well as Azure Policy aliases in the "Microsoft.Web" namespace to create custom policies to alert, audit, and enforce system configurations. Use Azure policy [audit], [deny], and [deploy if not exist] to automatically enforce configurations for your Azure resources.

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.10: Implement automated configuration monitoring for operating systems

**Guidance**: Not applicable; this guideline is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.11: Manage Azure secrets securely

**Guidance**: Use Managed Identities to provide your Azure App Service web apps with an automatically managed identity in Azure AD. Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code. Ensure soft delete is enabled in Azure Key Vault.

* [How to create a Key Vault](https://docs.microsoft.com/azure/key-vault/quick-create-portal)

* [How to enable soft delete in Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-soft-delete-powershell)

* [How to use managed identities for App Service](https://docs.microsoft.com/azure/app-service/overview-managed-identity)

* [How to provide Key Vault authentication with a managed identity](https://docs.microsoft.com/azure/key-vault/managed-identity)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.12: Manage identities securely and automatically

**Guidance**: Use Managed Identities to provide your Azure App Service web apps with an automatically managed identity in Azure AD. Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code.

* [How to use managed identities for App Service](https://docs.microsoft.com/azure/app-service/overview-managed-identity)

* [How to provide Key Vault authentication with a managed identity](https://docs.microsoft.com/azure/key-vault/managed-identity)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.13: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

* [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Malware defense

*For more information, see [Security control: Malware defense](/azure/security/benchmarks/security-control-malware-defense).*

### 8.1: Use centrally-managed anti-malware software

**Guidance**: Not applicable; this recommendation is intended for compute resources.

The platform components of App Service, including Azure VMs, storage, network connections, web frameworks, management and integration features, are actively secured and hardened. App Service goes through vigorous compliance checks on a continuous basis to make sure that 24-hour threat management protects the infrastructure and platform against malware, distributed denial-of-service (DDoS), man-in-the-middle (MITM), and other threats.

Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure Functions), however it does not run on customer content.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Not applicable; this recommendation is intended for compute resources.

The platform components of App Service, including Azure VMs, storage, network connections, web frameworks, management and integration features, are actively secured and hardened. App Service goes through vigorous compliance checks on a continuous basis to make sure that 24-hour threat management protects the infrastructure and platform against malware, distributed denial-of-service (DDoS), man-in-the-middle (MITM), and other threats.

Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure App Service), however it does not run on customer content.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 8.3: Ensure anti-malware software and signatures are updated

**Guidance**: Not applicable; this recommendation is intended for compute resources.

The platform components of App Service, including Azure VMs, storage, network connections, web frameworks, management and integration features, are actively secured and hardened. App Service goes through vigorous compliance checks on a continuous basis to make sure that 24-hour threat management protects the infrastructure and platform against malware, distributed denial-of-service (DDoS), man-in-the-middle (MITM), and other threats.

Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure App Service), however it does not run on customer content.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Data recovery

*For more information, see [Security control: Data recovery](/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure regular automated back-ups

**Guidance**: The Backup and Restore feature in Azure App Service lets you easily create app backups manually or on a schedule. You can configure the backups to be retained up to an indefinite amount of time. You can restore the app to a snapshot of a previous state by overwriting the existing app or restoring to another app.

App Service can back up the following information to an Azure storage account and container that you have configured your app to use:
- App configuration
- File content
- Database connected to your app

The following database solutions are supported with the backup feature:
- SQL Database
- Azure Database for MySQL
- Azure Database for PostgreSQL
- MySQL in-app

* [Understand Azure App Service backup capability](https://docs.microsoft.com/azure/app-service/manage-backup)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.2: Perform complete system backups and backup any customer-managed keys

**Guidance**: Use the backup feature within Azure App Service to backup your web apps. Backup customer managed keys within Azure Key Vault.

* [How to perform backups for Azure App Service](https://docs.microsoft.com/azure/app-service/manage-backup)

* [How to backup key vault keys in Azure](https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.3: Validate all backups including customer-managed keys

**Guidance**: Periodically test the restoration process for your Azure App Service web apps and backed up customer managed keys.

* [How to restore an Azure App Service web app](https://docs.microsoft.com/azure/app-service/web-sites-restore)

* [How to restore key vault keys in Azure](https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultkey?view=azurermps-6.13.0)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.4: Ensure protection of backups and customer-managed keys

**Guidance**: Azure App Service backups are stored within an Azure Storage account. Data in Azure Storage is encrypted and decrypted transparently using 256-bit AES encryption, one of the strongest block ciphers available, and is FIPS 140-2 compliant. Azure Storage encryption is similar to BitLocker encryption on Windows.

Azure Storage encryption is enabled for all storage accounts, including both Resource Manager and classic storage accounts. Azure Storage encryption cannot be disabled. Because your data is secured by default, you don't need to modify your code or applications to take advantage of Azure Storage encryption.

By default, data in a storage account is encrypted with Microsoft-managed keys. You can rely on Microsoft-managed keys for the encryption of your data, or you can manage encryption with your own keys. Ensure soft delete is enabled in Azure Key Vault.

* [Understand Azure Storage encryption for data at rest](https://docs.microsoft.com/azure/storage/common/storage-service-encryption)

* [How to enable soft delete in Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-soft-delete-powershell)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Incident response

*For more information, see [Security control: Incident response](/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create an incident response guide

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.

* [How to configure Workflow Automations within Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-planning-and-operations-guide)

* [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

* [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

* [Customer may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, clearly mark subscriptions (for ex. production, non-prod) and create a naming system to clearly identify and categorize Azure resources.

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

* [Refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that the customer's data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved.

* [How to set the Azure Security Center Security Contact](https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts Sentinel.

* [How to configure continuous export](https://docs.microsoft.com/azure/security-center/continuous-export)

* [How to stream alerts into Azure Sentinel](https://docs.microsoft.com/azure/sentinel/connect-azure-security-center)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.

* [How to configure Workflow Automation and Logic Apps](https://docs.microsoft.com/azure/security-center/workflow-automation)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Penetration tests and red team exercises

*For more information, see [Security control: Penetration tests and red team exercises](/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

**Guidance**: * [Follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1)

* [You can find more information on Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications, here](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Next steps

- See the [Azure security benchmark](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
