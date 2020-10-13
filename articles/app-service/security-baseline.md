---
title: Azure security baseline for App Service
description: The App Service security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: app-service
ms.topic: conceptual
ms.date: 01/01/2000
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for App Service

The Azure Security Baseline for App Service contains recommendations that will help you improve the security posture of your deployment. The baseline for this service is drawn from the [Azure Security Benchmark version 1.0](../security/benchmarks/overview-v1.md), which provides recommendations on how you can secure your cloud solutions on Azure with our best practices guidance. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to App Service. **Controls** not applicable to App Service have been excluded.

To see how App Service completely maps to the Azure Security Benchmark, see the [full App Service security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network security

*For more information, see the [Azure Security Benchmark: Network security](../security/benchmarks/security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4437).

**Guidance**: 
An App Service Environment (ASE) refers to a deployment of Microsoft Azure App Service into a subnet within an Azure Virtual Network. Network security groups are used to secure an ASE by blocking inbound and outbound traffic to resources in the virtual network, or to restrict access to apps on an ASE. 

Any allow rules need to be built, as network security groups include an implicit deny rule at the lowest priority to deny everything at the Azure portal. No access is available to the Virtual Machines being used to host the ASE as they're in a Microsoft-managed subscription.

ASEs can additionally be protected with an Azure Application Gateway enabled Web Application Firewall (WAF) which operates at Layer 7 with OWASP Top 10 vulnerabilities protection.  

In the multi-tenant App Service, network security groups are used to block outbound traffic. Virtual Network Integration feature enables your apps to access resources in or through a Virtual Network. Traffic can be blocked to public addresses from the application by using regional Virtual Network Integration. Virtual Network Integration cannot be used to provide inbound access to an app.  

Secure Inbound traffic to your app with:

- Access Restrictions - a series of allow or deny rules that control inbound access

- Service Endpoints - enable you to secure traffic to originating from a set of virtual networks or subnets

- Private Endpoints - expose your app on an address in your Virtual Network. With these enabled on your app, it is no longer internet accessible

Use network security groups and route tables with user defined routes, when using Virtual Network integration with virtual networks in the same region. User-defined routes can be placed on the integration subnet to send outbound traffic where intended.  

Implement an Azure Firewall to centrally create, enforce, and log application and network connectivity policies across your subscriptions and virtual networks. Azure Firewall uses a static public IP address for virtual network resources, which allows outside firewalls to identify traffic originating from your virtual network. 

- [Locking down an App Service Environment](environment/firewall-integration.md)

- [Network security groups](/azure/virtual-network/security-overview)

- [Networking considerations for an App Service Environment](environment/network-info.md)

- [How to create an external ASE](environment/create-external-ase.md)

- [How to create an internal ASE](environment/create-ilb-ase.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and network interfaces

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4438).

**Guidance**: Implement Security Center's network protection recommendations to secure network resources and configurations related to your App Service Web Apps and APIs.

Use Azure Firewall to send traffic and centrally create, enforce, and log application and network connectivity policies across subscriptions and virtual networks. 

Azure Firewall uses a static public IP address for your virtual network resources allowing outside firewalls to identify traffic originating from your virtual network. The service is fully integrated with Azure Monitor for logging and analytics.

- [Azure Firewall Overview](../firewall/overview.md)

- [Understand Network Security provided by Azure Security Center](../security-center/security-center-network-recommendations.md)

- [How to Enable Monitoring and Protection of App Service](/azure/security-center/security-center-app-services)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.3: Protect critical web applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4439).

**Guidance**: Secure an internet accessible app in an App Service Environment (ASE) by:
- Deploying a Web Application Firewall (WAF) with Azure Application Gateway in front of your internet facing apps

- Use Access Restrictions to secure inbound traffic to the Application Gateway 

- Secure applications with Azure Active Directory (Azure AD) to ensure authentication

- Disable TLS 1.2 on the app

- Set the app to HTTPS only 

- Drive all application traffic outbound through an Azure Firewall device and monitor the logs. 

Follow recommendations in the Locking down an App Service Environment document.

To secure an internet accessible app in the multi-tenant App Service:

- Deploy a WAF enabled device in front of your apps

- Use Access Restrictions or service endpoints to secure inbound traffic to the WAF device

- Secure applications with Azure AD to ensure authentication

- Disable TLS 1.2 on the app

- Set the app to HTTPS only 

- Use Virtual network Integration and the app setting WEBSITE_VIRTUAL NETWORK_ROUTE_ALL to make all outbound traffic subject to network security groups and user defined routes on the integration subnet.

- Drive all application traffic outbound through an Azure Firewall device and monitor the logs

- [Azure Web application firewall on Azure Application Gateway](../web-application-firewall/ag/ag-overview.md)

- [Azure App Service Access Restrictions](app-service-ip-restrictions.md)

- [Track WAF alerts and easily monitor trends with Azure Monitor ](../azure-monitor/overview.md)

- [Locking down an App Service Environment](environment/firewall-integration.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.4: Deny communications with known-malicious IP addresses

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4440).

**Guidance**: Secure the App Service Environment (ASE) as described in Locking down an App Service Environment.

- Use Security Center's Integrated Threat Intelligence to deny communications with known malicious or unused public IP addresses. 

- Deploy a Web Application Firewall (WAF) enabled application gateway in front of your internet facing apps

- Use Access Restrictions to secure inbound traffic to the application gateway

For the Multi-tenant App Service:

- Use a public internet facing endpoint to allow traffic only from a specific subnet within an Azure Virtual Network and block everything else. 

- Use Access Restrictions to configure network ACLs (IP Restrictions) to lock down allowed inbound traffic. 

- Define priority among the ordered allow/deny list to control network access to your app. This list can include IP addresses or Virtual Network subnets. An implicit "deny all" rule exists at the end of the list when it contains one or more entries. This capability works with all App Service hosted work loads including, Web Apps, API apps, Linux apps, Linux container apps, and Functions. 

- Use service endpoints. The ability to restrict access to your web app from an Azure Virtual Network is called service endpoint. Restrict access to a multi-tenant App Service from selected subnets with service endpoints. It must be enabled on both the networking side as well as the service that it is being enabled. 

Note that this does not work to restrict traffic to apps that are hosted in an ASE. If you are in an ASE, you can control access to your app with IP address rules.

- [Azure App Service Static IP Restrictions](app-service-ip-restrictions.md)

- [Azure Web application firewall on Azure Application Gateway](../web-application-firewall/ag/ag-overview.md)

- [How to configure a Web Application Firewall (WAF) for App Service Environment](environment/app-service-app-service-environment-web-application-firewall.md)

- [Secure the ASE as described in Locking down an App Service Environment](environment/firewall-integration.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.5: Record network packets

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4441).

**Guidance**: Security Center monitors requests and responses sent to and from apps running in App Service. Attacks against a web application can be monitored by using a real-time Web Application Firewall (WAF) enabled Application Gateway providing integrated logging with Azure Monitor to track WAF alerts and easily monitor trends.

Use Microsoft Azure Sentinel to access the built-in Azure WAF firewall events workbook to get an overview of the security events on your WAF. This includes events, matched and blocked rules, and everything else that gets logged in the firewall logs.

- [Azure Web Application Firewall on Azure Application Gateway](../web-application-firewall/ag/ag-overview.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4442).

**Guidance**: Not applicable to App Service. This capability is not built into the platform directly. 
Prevent access to a multi-tenant App Service from selected subnets with service endpoints. Service endpoints must be enabled on both the networking side as well as the service that it is being enabled. Note that this does not work to restrict traffic to apps that are hosted in an Application Service Environment (ASE). If you are in an ASE, you can control access to your app with IP address rules.

Use a third-party application in the Azure Marketplace offering a complete IDS or IPS capabilities.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Not applicable

### 1.7: Manage traffic to web applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4443).

**Guidance**: For an app in an App Service Environment (ASE):

- Secure the ASE as described in Locking down an App Service Environment 

- Deploy an Azure Web Application Firewall (WAF) enabled Application Gateway in front of your internet facing apps

- Use Access Restrictions to secure inbound traffic to the Application Gateway 

- Set the app to HTTPS only 

- Drive all application-traffic outbound through an Azure Firewall device and monitor the logs

If you want to secure an internet accessible app in the multi-tenant App Service:

- Deploy a WAF enabled device in front of your apps

- Use Access Restrictions or service endpoints to secure inbound traffic to the WAF device

- Set the app to HTTPS only 

- Use Virtual Network Integration and the app setting WEBSITE_VIRTUAL NETWORK_ROUTE_ALL to make all outbound traffic subject to NSGs and UDRs on the integration subnet.

- Drive all application-traffic outbound through an Azure Firewall device and monitor the logs

- Restrict access to your Web Apps with App Service’s static IP restrictions so that it only receives traffic from the VIP on an application gateway as the only address with access.

- Define a priority ordered allow/deny list that controls network access to your app with Access restrictions. The list can include IP addresses or Azure Virtual Network subnets. When there are one or more entries, there is then an implicit "deny all" that exists at the end of the list. The access restrictions capability works with all App Service hosted work loads including Web Apps, API apps, Linux apps, Linux container apps, and Functions.

- [Azure App Service Static IP Restrictions](app-service-ip-restrictions.md)

- [Azure Web application firewall on Azure Application Gateway](../web-application-firewall/ag/ag-overview.md)

- [How to configure end-to-end TLS by using Application Gateway with the portal](../application-gateway/end-to-end-ssl-portal.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.8: Minimize complexity and administrative overhead of network security rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4444).

**Guidance**: App Service has a number of endpoints which are used to manage the service. These addresses are also in the AppServiceManagement IP service tag. The AppServiceManagement tag is only used with an App Service Environment (ASE) to allow such traffic. 

App Service inbound addresses are tracked in the AppService IP service tag. There is no IP service tag that contains the outbound addresses used by App Service.

You can allow or deny the traffic for the corresponding service by specifying the service tag name in the appropriate source or destination field of a rule. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

- [For more information about using service tags](../virtual-network/service-tags-overview.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.9: Maintain standard security configurations for network devices

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4445).

**Guidance**: Define and implement standard security configurations for network settings related to your App Service Web Apps. 

Maintain security configurations using Azure Policy aliases in the "Microsoft.Web" and "Microsoft.Network" namespaces. Create custom policies to audit or enforce the network configuration of your App Service Web Apps. 

Use built-in policy definitions for App Service, such as:

- App Service should use a virtual network service endpoint

- Web Application should only be accessible over HTTPS

- Latest TLS version should be used in your Web App

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.10: Document traffic configuration rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4446).

**Guidance**: Use tags for the network security groups and other resources related to network security and traffic flow in App Service Web Apps.

Specify business need, duration, and so on, with the "Description" field or any rules, which allow traffic to or from a network for individual network security groups rules.

Apply any of the built-in Azure Policy definitions related to tagging, such as "Require tag and its value", effects to ensure that all resources are created with tags and to notify you of any existing untagged resources. Use Azure PowerShell or Azure CLI to look-up or perform actions on resources based on their tags.

- [How to create and use tags](/azure/azure-resource-manager/resource-group-using-tags)

- [Azure App Service Access Restrictions](/azure/app-service/app-service-ip-restriction)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.11: Use automated tools to monitor network resource configurations and detect changes

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4447).

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network settings and resources related to App Service resources. 

Use one of the several Azure Policy built-in definitions for App Service. For example, a policy which audits any app not configured to use virtual network endpoint service. Create alerts within Azure Monitor to trigger when changes to critical network settings or resources take place. 

Review Security Center's detailed security alerts and recommendations in the portal or through programmatic tools. Export this information or send it to other monitoring tools in your environment. Tools are available to export alerts and recommendations either manually or in an ongoing, continuous fashion. Using these tools, you can:
- Continuously export to Log Analytics workspaces

- Continuously export to Azure Event Hubs (for integrations with third-party SIEMs)

- Export to CSV (one time)

- [How to view and retrieve Azure Activity Log events](/azure/azure-monitor/platform/activity-log-view)

- [How to create alerts in Azure Monitor](../azure-monitor/platform/alerts-activity-log.md)

- [Export security alerts and recommendations](../security-center/continuous-export.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Logging and monitoring

*For more information, see the [Azure Security Benchmark: Logging and monitoring](../security/benchmarks/security-control-logging-monitoring.md).*

### 2.1: Use approved time synchronization sources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4448).

**Guidance**: Microsoft maintains the time source used for Azure resources such as App Service.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 2.2: Configure central security log management

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4449).

**Guidance**: Integrate your App Service Environment (ASE) with Azure Monitor to send logs about the ASE to Azure Storage, Azure Event Hubs, or Log Analytics which can be forwarded to an SIEM.

Enable Azure Activity Log diagnostic settings for control plane audit logging. Security alerts produced by Security Center are published to the Azure Activity log. Audit Azure Activity Log data which let’s you determine the "what, who, and when" for any write operations (PUT, POST, DELETE) performed at the control plane level for Azure App Service and other Azure resources. Save your queries for future use, pin query results to Azure Dashboards, and create log alerts. Also, use the Data access REST API in Application Insights to access your telemetry programmatically.

Use Microsoft Azure Sentinel, a scalable, cloud-native, security information event management (SIEM) available to connect to various data sources and connectors, as based on business requirements. Optionally, you may enable and on-board data a third-party SIEM like Barracuda in Azure Marketplace.

- [Logging ASE Activity](environment/using-an-ase.md#logging)

- [How to enable Diagnostic Settings for Azure App Service](troubleshoot-diagnostic-logs.md)

- [How to enable Application Insights](../azure-monitor/app/app-insights-overview.md)

- [Export telemetry from Application Insights](../azure-monitor/app/export-telemetry.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4450).

**Guidance**: Enable Azure Activity Log diagnostic settings for control plane audit logging of App Service, and send the logs to a Log Analytics workspace, Azure event hub, or Azure storage account.
The "what, who, and when" for any write operations (PUT, POST, DELETE) performed at the control plane level can be determined using Azure Activity Log data for App Service and other Azure resources.

Additionally, Azure Key Vault provides centralized secret management with access policies and audit history. 

- [How to enable Diagnostic Settings for Azure Activity Log](/azure/azure-monitor/platform/diagnostic-settings-legacy)

- [How to enable Diagnostic Settings for Azure App Service](troubleshoot-diagnostic-logs.md)

- [Resource Manager Operations](../role-based-access-control/resource-provider-operations.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.4: Collect security logs from operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4451).

**Guidance**: Not applicable to App Service. This recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.5: Configure security log storage retention

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4452).

**Guidance**: In Azure Monitor, set log retention period for Log Analytics workspaces associated with your App Service resources according to your organization's compliance regulations.
- [How to set log retention parameters](../azure-monitor/platform/manage-cost-storage.md#change-the-data-retention-period)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.6: Monitor and review logs

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4453).

**Guidance**: Enable Azure Activity Log diagnostic settings as well as the diagnostic settings for your App Service resources and send the logs to a Log Analytics workspace. Perform queries in Log Analytics to search terms, identify trends, analyze patterns, and provide many other insights based on the collected data.

Enable Application Insights for your App Service Web Apps and to collect log, performance, and error data. You can view the telemetry data collected by Application Insights within the Azure portal.

If you have deployed an Azure Web Application Firewall (WAF), you can monitor attacks against your web applications by using a real-time WAF log. The log is integrated with Azure Monitor to track WAF alerts and easily monitor trends.

Use Microsoft Azure Sentinel, a scalable, cloud-native, security information event management (SIEM) available to connect to various data sources and connectors, as based on business requirements. Optionally, you may enable and on-board data a third-party SIEM like Barracuda in Azure Marketplace

- [How to enable diagnostic settings for Azure Activity Log](/azure/azure-monitor/platform/diagnostic-settings-legacy)

- [How to enable Application Insights](../azure-monitor/app/app-insights-overview.md)

- [How to integrate your App Service Environment with the Azure Application Gateway (WAF)](environment/integrate-with-application-gateway.md)

- [How to on-board Azure Sentinel](../sentinel/quickstart-onboard.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4454).

**Guidance**: Configure Security Center in your Azure subscription and review the alerts produced by Security Center. These alerts are published to the Azure Activity log. Azure Monitor enables you to get your Activity log data to an Event Hub where it can be read by a SIEM like Azure Sentinel. 

If you have deployed an Azure Web Application Firewall (WAF), you can monitor attacks against your web applications by using a real-time WAF log. The log is integrated with Azure Monitor to track WAF alerts and easily monitor trends.

Optionally, you may enable and on-board data to Azure Sentinel or a third-party SIEM.

- [How to integrate your App Service Environment with the Azure Application Gateway (WAF)](environment/integrate-with-application-gateway.md)

- [Export security alerts and recommendations](../security-center/continuous-export.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.8: Centralize anti-malware logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4455).

**Guidance**: Not applicable to App Service. It does not process or produce anti-malware related logs.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.9: Enable DNS query logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4456).

**Guidance**: Not applicable to App Service. It does not process or produce user accessible DNS-related logs.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.10: Enable command-line audit logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4457).

**Guidance**: Not applicable to App Service. This recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Identity and access control

*For more information, see the [Azure Security Benchmark: Identity and access control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4458).

**Guidance**: Azure Active Directory (Azure AD) has built-in roles that must be explicitly assigned and query-able. Use the Azure AD PowerShell module to perform ad hoc queries to discover accounts which are members of administrative groups.

- [How to get members of a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0)

- [How to use managed identities for App Service and Azure Functions](overview-managed-identity.md?context=azure%2Factive-directory%2Fmanaged-identities-azure-resources%2Fcontext%2Fmsi-context&amp;tabs=dotnet)

- [Add or remove Azure role assignments using the Azure portal](../role-based-access-control/role-assignments-portal.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.2: Change default passwords where applicable

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4459).

**Guidance**: Azure Active Directory (Azure AD) does not have the concept of default passwords. Azure AD provides control plane access to App Service.

Generally, avoid implementing default passwords for user access when building your own apps. Use one of the identity providers available by default for App Service, such as Azure AD, Microsoft Account, Facebook, Google, or Twitter.

Disable anonymous access, unless you support anonymous requests. 

- [Identity providers available by default in Azure App Service](overview-authentication-authorization.md#identity-providers)

- [Authentication and authorization in Azure App Service and Azure Functions](overview-authentication-authorization.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.3: Use dedicated administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4460).

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts. Use Security Center's Identity and Access Management features to monitor the number of administrative accounts.

Keep track of dedicated administrative accounts. Use recommendations from Security Center or built-in Azure policies, such as:
- There should be more than one owner assigned to your subscription. Deprecated accounts with owner permissions should be removed from your subscription

- External accounts with owner permissions should be removed from your subscription

- [How to use Azure Security Center to monitor identity and access](../security-center/security-center-identity-access.md)

- [How to use Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Learn more about granting users access to applications](../role-based-access-control/overview.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.4: Use Azure Active Directory single sign-on (SSO)

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4461).

**Guidance**: Authenticate App Service through Azure Active Directory (Azure AD). Azure AD provides an OAuth 2.0 service for your identity provider and enables authorized access to mobile and web applications. 

App Service apps use federated identity, in which a third-party identity provider manages the user identities and authentication flow for you. These identity providers are available by default:
- Azure Active Directory (Azure AD)

- Microsoft Account

- Facebook

- Google

- Twitter

When you enable authentication and authorization with one of these providers, its sign-in endpoint is available for user authentication and for validation of authentication tokens from the provider.

- [Understand authentication and authorization in Azure App Service](overview-authentication-authorization.md#identity-providers)

- [Learn about Authentication and Authorization in Azure App Service](overview-authentication-authorization.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.5: Use multi-factor authentication for all Azure Active Directory-based access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4462).

**Guidance**: Enable Azure Active Directory's (Azure AD) Multi-Factor Authentication (MFA) and follow Security Center's Identity and Access Management recommendations.

Implement MFA for Azure AD. Administrators need to ensure that the subscription accounts in the portal are protected. The subscription is vulnerable to attacks because it manages the resources that you created. 

- [Azure Security MFA](/azure/security/develop/secure-aad-app)

- [How to enable MFA in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

- [How to monitor identity and access within Azure Security Center](../security-center/security-center-identity-access.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.6: Use secure, Azure-managed workstations for administrative tasks

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4463).

**Guidance**: Use Privileged Access Workstations (PAW) with Multi-Factor Authentication (MFA) configured to log into and configure Azure resources.

- [Learn about Privileged Access Workstations](/windows-server/identity/securing-privileged-access/privileged-access-workstations)

- [How to enable MFA in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.7: Log and alert on suspicious activities from administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4464).

**Guidance**: Use Azure Active Directory's (Azure AD) Privileged Identity Management (PIM) for generation of logs and alerts when suspicious or unsafe activity occurs in the environment.

In addition, use Azure AD risk detections to view alerts and reports on risky user behavior.

Security Center's threat protection provides comprehensive defenses for your environment which includes Threat protection for Azure compute resources such as Windows machines, Linux machines, App Service, and Azure containers

- [How to deploy Privileged Identity Management (PIM)](../active-directory/privileged-identity-management/pim-deployment-plan.md)

- [Understand Azure AD risk detections](/azure/active-directory/reports-monitoring/concept-risk-events)

- [Threat protection for Azure compute resources](/azure/security-center/threat-protection)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.8: Manage Azure resources from only approved locations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4465).

**Guidance**: Use Conditional Access Named Locations to allow access to the Azure portal from only specific logical groupings of IP address ranges or countries/regions.

- [How to configure Named Locations in Azure](../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.9: Use Azure Active Directory

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4466).

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system for your App Service apps. Azure AD protects data by using strong encryption for data at rest and in transit and also salts, hashes, and securely stores user credentials.

- [How to configure your Azure App Service apps to use Azure AD login](configure-authentication-provider-aad.md)

- [How to create and configure an AAD instance](../active-directory/fundamentals/active-directory-access-create-new-tenant.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.10: Regularly review and reconcile user access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4467).

**Guidance**: Azure Active Directory (Azure AD) provides logs to help you discover stale accounts. In addition, use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access can be reviewed on a regular basis to make sure only the right Users have continued access. 

- [Understand Azure AD reporting](/azure/active-directory/reports-monitoring/)

- [How to use Azure Identity Access Reviews](../active-directory/governance/access-reviews-overview.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.11: Monitor attempts to access deactivated credentials

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4468).

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system for your App Service apps. Azure AD protects data by using strong encryption for data at rest and in-transit and also salts, hashes, and securely stores user credentials.

Access to Azure AD sign-in activity, audit and risk event log sources allow you to integrate with Azure Sentinel or a third-party SIEM.

Streamline this process by creating diagnostic settings for Azure AD user accounts and sending the audit logs and sign-in logs to a Log Analytics workspace. Desired log alerts can be configured within Log Analytics.

- [How to configure your Azure App Service apps to use Azure AD login](configure-authentication-provider-aad.md)

- [How to integrate Azure Activity Logs into Azure Monitor](/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)

- [How to on-board Azure Sentinel](../sentinel/quickstart-onboard.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.12: Alert on account sign-in behavior deviation

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4469).

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system for your App Service Web Apps. 

Use Azure AD's Identity's Protection and risk detection features to configure automated responses to detected suspicious actions related to user identities, such as account login behavior deviation on the control plane (the Azure portal). You can also ingest data into Azure Sentinel for further investigation. 

- [How to configure your Azure App Service app to use Azure AD login](configure-authentication-provider-aad.md)

- [How to view Azure AD risky sign-ins](/azure/active-directory/reports-monitoring/concept-risky-sign-ins)

- [How to configure and enable Identity Protection risk policies](../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4470).

**Guidance**: Not available for App Service. Customer Lockbox is not supported for Azure App Service.

- [List of Customer Lockbox-supported services](../security/fundamentals/customer-lockbox-overview.md#supported-services-and-scenarios-in-general-availability)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Data protection

*For more information, see the [Azure Security Benchmark: Data protection](../security/benchmarks/security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive Information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4471).

**Guidance**: Use tags to assist in tracking App Service resources which store or process sensitive information.

- [How to create and use tags](/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4472).

**Guidance**: Implement separate subscriptions and management groups for development, test, and production. Deploy your App Service web app into a Virtual Network.

For the multi-tenant App Service, Virtual Network Integration gives your app access to resources in your Virtual network. It does not grant inbound private access to your app from the Virtual network. Private site access refers to making an app accessible only from a private network, such as from within an Azure Virtual network. 

Virtual Network Integration is used only to make outbound calls from your app into your Virtual Network. The Virtual Network. Integration feature behaves differently when it's used with Virtual network in the same region and with Virtual network  in other regions. The Virtual network. Integration feature has two variations:
- Regional Virtual Network Integration: When you connect to Azure Resource Manager virtual networks in the same region, you must have a dedicated subnet in the Virtual network you are integrating with.

- Gateway-required Virtual Network. Integration: When you connect to Virtual Network in other regions or to a classic virtual network in the same region, you need an Azure Virtual Network Gateway provisioned in the target Virtual Network.

- [Networking considerations for an App Service Environment](environment/network-info.md)

- [How to create an external ASE](environment/create-external-ase.md)

- [How to create an internal ASE](environment/create-ilb-ase.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.3: Monitor and block unauthorized transfer of sensitive information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4473).

**Guidance**: While data identification, classification, and loss prevention features are not yet available for App Service, you can reduce the data exfiltration risk from the virtual network by removing all rules where destination is tag Internet or Azure services. 

Microsoft manages the underlying infrastructure for App Service and has implemented strict controls to prevent the loss or exposure of customer data.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### 4.4: Encrypt all sensitive information in transit

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4474).

**Guidance**: Use the default minimum version for HTTPS and TLS 1.2, configured in TLS/SSL settings used for encrypting all information in transit. 

Ensure that redirects occur from HTTP connection requests to HTTPS.

- [Understand encryption in transit for Azure App Service web apps](security-recommendations.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 4.5: Use an active discovery tool to identify sensitive data

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4475).

**Guidance**: Currently not available. Data identification, classification, and loss prevention features are not yet available for App Service. 

Tag App Service apps that may be processing sensitive information. Implement third-party solution if required for compliance purposes.

Microsoft manages the underlying platform and treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### 4.6: Use Role-based access control to control access to resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4476).

**Guidance**: Use Azure Active Directory's (Azure AD) role-based access control (Azure RBAC) to control access to the App Service control plane (the Azure portal).

- [How to configure RBAC in Azure](../role-based-access-control/role-assignments-portal.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.7: Use host-based data loss prevention to enforce access control

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4477).

**Guidance**: Not applicable to App Service. This recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 4.8: Encrypt sensitive information at rest

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4478).

**Guidance**: Web site file content is stored in Azure Storage, which automatically encrypts the content at rest. You may choose to store application secrets in Key Vault and retrieve them at runtime.

Customer supplied secrets are encrypted at rest. The secrets are encrypted at rest while stored in App Service configuration databases.

Locally attached disks can optionally be used as temporary storage by websites, (for example, D:\local and %TMP%) but are not encrypted at rest.

- [Understand data protection controls for Azure App Service](app-service-security-controls.md)

- [Understand Azure Storage encryption at rest](../storage/common/storage-service-encryption.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.9: Log and alert on changes to critical Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4479).

**Guidance**: Use Azure Monitor with the Azure Activity log to create alerts for when changes take place to production App Service Web Apps as well as other critical or related resources.

- [How to create alerts for Azure Activity Log events](../azure-monitor/platform/alerts-activity-log.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Vulnerability management

*For more information, see the [Azure Security Benchmark: Vulnerability management](../security/benchmarks/security-control-vulnerability-management.md).*

### 5.1: Run automated vulnerability scanning tools

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4480).

**Guidance**: Adopt a DevSecOps practice to ensure your App Service Web Apps are secure and remain secured throughout the duration of their lifecycle. DevSecOps incorporates your organization's security team and their capabilities into your DevOps practices making security a responsibility of everyone on the team.

Follow recommendations from Security Center to secure your App Service apps.

- [How to add continuous security validation to your CI/CD pipeline](https://docs.microsoft.com/azure/devops/migrate/security-validation-cicd-pipeline?view=azure-devops)

- [How to implement Azure Security Center vulnerability assessment recommendations](/azure/security-center/security-center-vulnerability-assessment-recommendations)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 5.2: Deploy automated operating system patch management solution

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4481).

**Guidance**: Not applicable to App Service. This recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 5.3: Deploy automated patch management solution for third-party software titles

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4482).

**Guidance**: Not applicable to App Service. This recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 5.4: Compare back-to-back vulnerability scans

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4483).

**Guidance**: Not applicable to App Service. This recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4484).

**Guidance**: Microsoft performs vulnerability management on the underlying systems that support App Service. However you may use the severity of the recommendations within Security Center as well as the Secure Score to measure risk within your environment. Your Secure Score is based on how many Security Center recommendations you have mitigated. To prioritize the recommendations to resolve first, consider the severity of each.

- [Security recommendations reference guide](../security-center/recommendations-reference.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Inventory and asset management

*For more information, see the [Azure Security Benchmark: Inventory and asset management](../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4485).

**Guidance**: Use Azure Resource Graph to query or discover all resources (such as compute, storage, network, ports, protocols, and so on) within your subscriptions.  Ensure appropriate (read) permissions in your tenant and enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use Azure Resource Manager resources going forward.

- [How to create queries with Azure Resource Graph](../governance/resource-graph/first-query-portal.md)

- [How to view your Azure Subscriptions](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0)

- [Understand Azure RBAC](../role-based-access-control/overview.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.2: Maintain asset metadata

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4486).

**Guidance**: Apply tags to Azure resources with metadata to logically organize them into a taxonomy.

- [How to create and use tags](/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.3: Delete unauthorized Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4487).

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate to organize and track Azure resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

In addition, use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

- [How to create additional Azure subscriptions](/azure/billing/billing-create-subscription)

- [How to create Management Groups](/azure/governance/management-groups/create)

- [How to create and use Tags](/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.4: Define and maintain inventory of approved Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4488).

**Guidance**: Define an inventory of approved Azure resources and approved software for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.5: Monitor for unapproved Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4489).

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in your subscriptions.

Use Azure Resource Graph to query or discover resources within their subscriptions.  Ensure that all Azure resources present in the environment are approved. 

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md) 

- [How to create queries with Azure Graph](../governance/resource-graph/first-query-portal.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.6: Monitor for unapproved software applications within compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4490).

**Guidance**: Not applicable to App Service. This recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.7: Remove unapproved Azure resources and software applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4491).

**Guidance**: Not applicable to App Service. This recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.8: Use only approved applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4492).

**Guidance**: Not applicable to App Service. This recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.9: Use only approved Azure services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4493).

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to deny a specific resource type with Azure Policy](/azure/governance/policy/samples/not-allowed-resource-types)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.10: Maintain an inventory of approved software titles

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4494).

**Guidance**: Not applicable to App Service. This recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.11: Limit users' ability to interact with Azure Resource Manager

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4495).

**Guidance**: Configure Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resource Manager](../role-based-access-control/conditional-access-azure-management.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.12: Limit users' ability to execute scripts within compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4496).

**Guidance**: Not applicable to App Service. This recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.13: Physically or logically segregate high risk applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4497).

**Guidance**: For sensitive or high risk App Service Web Apps, implement separate subscriptions or management groups to provide isolation.

Deploy a higher risk App Service Web Apps into its own Virtual Network. Perimeter security in App Service is achieved through Virtual Networks. The App Service Environment (ASE) is a deployment of App Service into a subnet in your Azure Virtual Network.  There are two types of ASEs, External ASE and ILB (Internal Load Balancer) ASE. Choose the best architecture for your use case.

- [Networking considerations for an App Service Environment](environment/network-info.md) 

- [How to create an external ASE](environment/create-external-ase.md)

- [How to create an internal ASE](environment/create-ilb-ase.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Secure configuration

*For more information, see the [Azure Security Benchmark: Secure configuration](../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4498).

**Guidance**: Define and implement standard security configurations for your App Service Web Apps with Azure Policy. 

Use Azure Policy aliases in the "Microsoft.Web" namespace to create custom policies to audit or enforce the configuration of your App Service Web Apps. 

Apply built-in policy definitions such as:
- App Service should use a virtual network service endpoint

- Web Application should only be accessible over HTTPS

- Latest TLS version should be used in your Web Apps

- [How to view available Azure Policy Aliases](https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0)

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.2: Establish secure operating system configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4499).

**Guidance**: Not applicable to App Service. This recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.3: Maintain secure Azure resource configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4500).

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] effects to enforce secure settings across your Azure App Service Web Apps.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Understand Azure Policy Effects](../governance/policy/concepts/effects.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.4: Maintain secure operating system configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4501).

**Guidance**: Not applicable to App Service. This recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.5: Securely store configuration of Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4502).

**Guidance**: Choose Azure DevOps or Azure Repos to securely store and manage your code when using custom Azure Policy definitions. 

Use your existing Continuous Integration (CI) and Continuous Delivery (CD) pipeline to deploy a known-secure configuration. 

- [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops)

- [Azure Repos Documentation](https://docs.microsoft.com/azure/devops/repos/index?view=azure-devops)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.6: Securely store custom operating system images

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4503).

**Guidance**: Not applicable to App Service. This recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.7: Deploy configuration management tools for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4504).

**Guidance**: Use built-in Azure Policy definitions as well as Azure Policy aliases in the "Microsoft.Web" namespace to create custom policies to alert, audit, and enforce system configurations. Develop a process and pipeline for managing policy exceptions.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.8: Deploy configuration management tools for operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4505).

**Guidance**: Not applicable to App Service. This recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.9: Implement automated configuration monitoring for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4506).

**Guidance**: Use built-in Azure Policy definitions as well as Azure Policy aliases in the "Microsoft.Web" namespace to create custom policies to alert, audit, and enforce system configurations. 

Apply Azure Policy [audit], [deny], and [deploy if not exist], effects to automatically enforce configurations for your Azure resources.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.10: Implement automated configuration monitoring for operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4507).

**Guidance**: Not applicable to App Service. This recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.11: Manage Azure secrets securely

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4508).

**Guidance**: Use Managed Identities to provide your App Service Web Apps with an automatically managed identity in Azure Active Directory (Azure AD). Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code. Ensure soft delete is enabled in Azure Key Vault.

- [How to enable soft delete in Azure Key Vault](/azure/key-vault/key-vault-soft-delete-powershell)

- [How to use managed identities for App Service](overview-managed-identity.md)

- [How to provide Key Vault authentication with a managed identity](/azure/key-vault/managed-identity)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.12: Manage identities securely and automatically

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4509).

**Guidance**: Use Managed Identities to provide your App Service Web Apps with an automatically managed identity in Azure Active Directory (Azure AD). Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code.

- [How to use managed identities for App Service](overview-managed-identity.md)

- [How to provide Key Vault authentication with a managed identity](/azure/key-vault/managed-identity)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.13: Eliminate unintended credential exposure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4510).

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Malware defense

*For more information, see the [Azure Security Benchmark: Malware defense](../security/benchmarks/security-control-malware-defense.md).*

### 8.1: Use centrally-managed anti-malware software

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4511).

**Guidance**: Not applicable to App Service. This recommendation is intended for IaaS compute resources.

The platform components of App Service, including Azure VMs, storage, network connections, web frameworks, management and integration features, are actively secured and hardened. App Service goes through vigorous compliance checks on a continuous basis to make sure that 24-hour threat management protects the infrastructure and platform against malware, distributed denial-of-service (DDoS), man-in-the-middle (MITM), and other threats.

Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure Functions), however it does not run on customer content.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4512).

**Guidance**: Not applicable to App Service. This recommendation is intended for IaaS compute resources.

The platform components of App Service, including Azure VMs, storage, network connections, web frameworks, management and integration features, are actively secured and hardened. App Service goes through vigorous compliance checks on a continuous basis to make sure that 24-hour threat management protects the infrastructure and platform against malware, distributed denial-of-service (DDoS), man-in-the-middle (MITM), and other threats.

Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure App Service), however it does not run on customer content.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 8.3: Ensure anti-malware software and signatures are updated

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4513).

**Guidance**: Not applicable to App Service. This recommendation is intended for IaaS compute resources.

The platform components of App Service, including Azure VMs, storage, network connections, web frameworks, management and integration features, are actively secured and hardened. App Service goes through vigorous compliance checks on a continuous basis to make sure that 24-hour threat management protects the infrastructure and platform against malware, distributed denial-of-service (DDoS), man-in-the-middle (MITM), and other threats.

Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, App Service), however it does not run on customer content.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Data recovery

*For more information, see the [Azure Security Benchmark: Data recovery](../security/benchmarks/security-control-data-recovery.md).*

### 9.1: Ensure regular automated back-ups

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4514).

**Guidance**: The Backup and Restore feature in App Service lets you easily create app backups manually or on a schedule. You can configure the backups to be retained up to an indefinite amount of time. You can restore the app to a snapshot of a previous state by overwriting the existing app or restoring to another app.

App Service can back up the following information to an Azure storage account and container that you have configured your app to use:

- App configuration

- File content

- Database connected to your app

The following database solutions are supported with the backup feature:

- SQL Database

- Azure Database for MySQL

- Azure Database for PostgreSQL

- MySQL in-app

- [Understand Azure App Service backup capability](manage-backup.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.2: Perform complete system backups and backup any customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4515).

**Guidance**: Use the backup feature within App Service to backup your web apps. Backup customer-managed keys within Azure Key Vault.

- [How to perform backups for Azure App Service](manage-backup.md)

- [How to backup key vault keys in Azure](/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.3: Validate all backups including customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4516).

**Guidance**: Periodically test the restoration process for your App Service Web Apps and backed up customer-managed keys.

- [How to restore an Azure App Service web app](web-sites-restore.md)

- [How to restore key vault keys in Azure](https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultkey?view=azurermps-6.13.0)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.4: Ensure protection of backups and customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4517).

**Guidance**: App Service backups are stored within an Azure Storage account. Data in Azure Storage is encrypted and decrypted transparently using 256-bit AES encryption, one of the strongest block ciphers available, and is FIPS 140-2 compliant. Azure Storage encryption is similar to BitLocker encryption on Windows.

Azure Storage encryption is enabled for all storage accounts, including both Resource Manager and classic storage accounts. Azure Storage encryption cannot be disabled. Because your data is secured by default, you don't need to modify your code or applications to take advantage of Azure Storage encryption.

By default, data in a storage account is encrypted with Microsoft-managed keys. You can rely on Microsoft-managed keys for the encryption of your data, or you can manage encryption with your own keys. Ensure soft delete is enabled in Azure Key Vault.

- [Understand Azure Storage encryption for data at rest](../storage/common/storage-service-encryption.md)

- [How to enable soft delete in Azure Key Vault](/azure/key-vault/key-vault-soft-delete-powershell)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Incident response

*For more information, see the [Azure Security Benchmark: Incident response](../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4518).

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.

- [How to configure Workflow Automations within Azure Security Center](../security-center/security-center-planning-and-operations-guide.md)

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Customer may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4519).

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, clearly mark subscriptions (for ex. production, non-prod) and create a naming system to clearly identify and categorize Azure resources.

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.3: Test security response procedures

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4524).

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

- [Refer to NIST's publication - Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4520).

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that the customer's data has been accessed by an unlawful or unauthorized party.  Review incidents after the fact to ensure that issues are resolved.

- [How to set the Azure Security Center Security Contact](../security-center/security-center-provide-security-contact-details.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4521).

**Guidance**: Export your Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Security Center data connector to stream the alerts Sentinel.

- [How to configure continuous export](../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../sentinel/connect-azure-security-center.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4522).

**Guidance**: Use the Workflow Automation feature in Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.

- [How to configure Workflow Automation and Logic Apps](../security-center/workflow-automation.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Penetration tests and red team exercises

*For more information, see the [Azure Security Benchmark: Penetration tests and red team exercises](../security/benchmarks/security-control-penetration-tests-red-team-exercises.md).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/4523).

**Guidance**: Follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies: https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1

You can find more information on Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Next steps

- See the [Azure security benchmark](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
