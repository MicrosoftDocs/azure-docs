---
title: Azure security baseline for App Service
description: The App Service security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: app-service
ms.topic: conceptual
ms.date: 02/17/2021
ms.author: mbaldwin
ms.custom: subject-security-benchmark, devx-track-azurepowershell

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for App Service

The Azure Security Baseline for App Service contains recommendations that will help you improve the security posture of your deployment. The baseline for this service is drawn from the [Azure Security Benchmark version 1.0](../security/benchmarks/overview-v1.md), which provides recommendations on how you can secure your cloud solutions on Azure with our best practices guidance. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to App Service. **Controls** not applicable to App Service have been excluded.

To see how App Service completely maps to the Azure Security Benchmark, see the [full App Service security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](../security/benchmarks/security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

**Guidance**: When using App Service in the Isolated pricing tier, also called an App Service Environment (ASE) you can deploy directly into a subnet within your Azure Virtual Network. Use network security groups to secure your Azure App Service Environment by blocking inbound and outbound traffic to resources in your virtual network, or to restrict access to apps in an App Service Environment.

By default, network security groups include an implicit deny rule at the lowest priority, and requires you to add explicit allow rules. Add allow rules for your network security group based on a least privileged networking approach. The underlying virtual machines that are used to host the App Service Environment are not directly accessible because they are in a Microsoft-managed subscription.

Protect an App Service Environment by routing traffic through a Web Application Firewall (WAF) enabled Azure Application Gateway. Use service endpoints in conjunction with the Application Gateway to secure inbound publishing traffic to your app.  

In the multi-tenant App Service (an app not in Isolated tier), use network security groups to block outbound traffic from your app. Enable your apps to access resources in or through a Virtual Network, with the Virtual Network Integration feature. This feature can also be used to block outbound traffic to public addresses from the app. Virtual Network Integration cannot be used to provide inbound access to an app.  

Secure inbound traffic to your app with:
- Access Restrictions - a series of allow or deny rules that control inbound access
- Service Endpoints - can deny inbound traffic from outside of specified virtual networks or subnets
- Private Endpoints - expose your app to your Virtual Network with a private IP address. With the Private Endpoints enabled on your app, it is no longer internet-accessible

When using Virtual Network Integration feature with virtual networks in the same region, use network security groups and route tables with user-defined routes. User-defined routes can be placed on the integration subnet to send outbound traffic as intended.  

Consider implementing an Azure Firewall to centrally create, enforce, and log application and network connectivity policies across your subscriptions and virtual networks. Azure Firewall uses a static public IP address for virtual network resources, which allows outside firewalls to identify traffic that originates from your virtual network. 

- [Locking down an App Service Environment](environment/firewall-integration.md)

- [Open Web Application Security Project (OWASP) Top 10 vulnerabilities protection](https://owasp.org/www-project-top-ten/)

- [Network security groups](../virtual-network/network-security-groups-overview.md)

- [Integrate your app with an Azure virtual network](web-sites-integrate-with-vnet.md)

- [Networking considerations for an App Service Environment](environment/network-info.md)

- [How to create an external ASE](environment/create-external-ase.md)

- [How to create an internal ASE](environment/create-ilb-ase.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Network**:

[!INCLUDE [Resource Policy for Microsoft.Network 1.1](../../includes/policy/standards/asb/rp-controls/microsoft.network-1-1.md)]

**Azure Policy built-in definitions - Microsoft.Web**:

[!INCLUDE [Resource Policy for Microsoft.Web 1.1](../../includes/policy/standards/asb/rp-controls/microsoft.web-1-1.md)]

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and network interfaces

**Guidance**: Implement network protection recommendations from Azure Security Center to secure network resources and configurations related to your App Service apps and APIs.

Use Azure Firewall to send traffic and centrally create, enforce, and log application and network connectivity policies across subscriptions and virtual networks. Azure Firewall uses a static public IP address for your virtual network resources, which allows outside firewalls to identify traffic that originates from your Virtual Network. The Azure Firewall service is also fully integrated with Azure Monitor for logging and analytics.

- [Azure Firewall Overview](../firewall/overview.md)

- [Understand Network Security provided by Azure Security Center](../security-center/security-center-network-recommendations.md)

- [How to Enable Monitoring and Protection of App Service](../security-center/defender-for-app-service-introduction.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Network**:

[!INCLUDE [Resource Policy for Microsoft.Network 1.2](../../includes/policy/standards/asb/rp-controls/microsoft.network-1-2.md)]

### 1.3: Protect critical web applications

**Guidance**: Secure an internet accessible app in an App Service Environment (ASE) by:
- Deploying a Web Application Firewall (WAF) with Azure Application Gateway in front of an internet facing app
- Use Access Restrictions to secure inbound traffic to the Application Gateway
- Secure the app with Azure Active Directory (Azure AD) to ensure authentication
- Set the minimum TLS version to 1.2
- Set the app to HTTPS only

Drive all application traffic outbound through an Azure Firewall device and monitor the logs. 

To secure an internet accessible app in the multi-tenant App Service, (such as, not in the isolated tier)
- Deploy a Web Application Firewall-enabled device in front of an app
- Use Access Restrictions or service endpoints to secure inbound traffic to the Web Application Firewall (WAF) device
- Secure the app with Azure AD to ensure authentication
- Set the minimum TLS version to 1.2
- Set the app to HTTPS only
- Use Virtual network Integration and the app setting WEBSITE_VIRTUAL NETWORK_ROUTE_ALL to make all outbound traffic subject to network security groups and user-defined routes on the integration subnet.

Similar to the Application Service Environment app, drive all application traffic outbound through an Azure Firewall device and monitor the logs in the app.

Additionally, review and follow recommendations in the Locking down an App Service Environment document.

- [Locking down an App Service Environment](environment/firewall-integration.md)

- [Azure Web application firewall on Azure Application Gateway](../web-application-firewall/ag/ag-overview.md)

- [Azure App Service Access Restrictions](app-service-ip-restrictions.md)

- [Track WAF alerts and easily monitor trends with Azure Monitor ](../azure-monitor/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Web**:

[!INCLUDE [Resource Policy for Microsoft.Web 1.3](../../includes/policy/standards/asb/rp-controls/microsoft.web-1-3.md)]

### 1.4: Deny communications with known-malicious IP addresses

**Guidance**: Secure the App Service Environment as described in the Locking down an App Service Environment documentation. Apply the Integrated Threat Intelligence functionality in Azure Security Center to deny communications with known-malicious or unused public IP addresses. Use Access Restrictions to secure inbound traffic to the Application Gateway. 

Secure the multi-tenant App Service (an app not in an Isolated tier), with a public internet facing endpoint. It allows traffic only from a specific subnet within your Virtual Network and blocks everything else. Use Access Restrictions to configure network Access Control Lists (IP Restrictions) to lock down allowed inbound traffic.

Define priority among the ordered allow or deny list to manage network access to your app. This list can include IP addresses or Virtual Network subnets. An implicit "deny all" rule exists at the end of the list when it contains one or more entries. This capability works with all App Service hosted work loads including, Web Apps, API Apps, Linux apps, Linux container apps, and Functions. 

Use service endpoints to restrict access to your web app from an Azure Virtual Network. Limit access to a multi-tenant App Service (an app not in an Isolated tier), from selected subnets with service endpoints. 

- [Azure App Service Static IP Restrictions](app-service-ip-restrictions.md)

- [Azure Web application firewall on Azure Application Gateway](../web-application-firewall/ag/ag-overview.md)

- [How to configure a Web Application Firewall (WAF) for App Service Environment](environment/app-service-app-service-environment-web-application-firewall.md)

- [Secure the ASE as described in Locking down an App Service Environment](environment/firewall-integration.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Network**:

[!INCLUDE [Resource Policy for Microsoft.Network 1.4](../../includes/policy/standards/asb/rp-controls/microsoft.network-1-4.md)]

### 1.5: Record network packets

**Guidance**: Monitors requests and responses that are sent to and from App Service apps with Security Center. Attacks against a web application can be monitored by using a real-time Application Gateway that has Web Application Firewall, enabled with integrated logging from Azure Monitor to track Web Application Firewall alerts and easily monitor trends.

- [Azure Web Application Firewall on Azure Application Gateway](../web-application-firewall/ag/ag-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Network**:

[!INCLUDE [Resource Policy for Microsoft.Network 1.5](../../includes/policy/standards/asb/rp-controls/microsoft.network-1-5.md)]

### 1.7: Manage traffic to web applications

**Guidance**: Manage traffic for an app in an App Service Environment:

- Secure the App Service Environment as described in Locking down an App Service Environment
- Deploy an Application Gateway that has an Azure Web Application Firewall in front of your internet facing apps
- Set the app to only be accessible over HTTPS

Manage traffic for an internet accessible app in the multi-tenant App Service (not in the isolated tier): 

- Deploy an Application Gateway  that has Azure Web Application Firewall enabled in front of your internet facing apps
- Use access restrictions or service endpoints to secure inbound traffic to the Web Application Firewall. The access restrictions capability works with all App Service hosted work loads including Web Apps, API Apps, Linux apps, Linux container apps, and Functions.

- Set the app to be accessible only over HTTPS
- Limit access to your App Service app with static IP restrictions so that it only receives traffic from the VIP on an application gateway as the only address with access.

Review the referenced links for additional information.

- [Azure App Service Static IP Restrictions](app-service-ip-restrictions.md)

- [Azure Web application firewall on Azure Application Gateway](../web-application-firewall/ag/ag-overview.md)

- [How to configure end-to-end TLS by using Application Gateway with the portal](../application-gateway/end-to-end-ssl-portal.md)

- [Secure the ASE as described in Locking down an App Service](/azure/app-service/environment/firewall-integration)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: App Service has a number of endpoints that are used to manage the service. These endpoint addresses are also included in the AppServiceManagement IP service tag. The AppServiceManagement tag is only used with an App Service Environment to allow such traffic. 

You can allow or deny the traffic for the corresponding service by specifying the service tag name in the appropriate source or destination field of a rule. App Service inbound addresses are tracked in the AppService IP service tag. There is no IP service tag that contains the outbound addresses used by App Service.

Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

- [Virtual network service tags](../virtual-network/service-tags-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement standard security configurations for network settings related to your App Service apps. 

Maintain security configurations using Azure Policy aliases in the "Microsoft.Web" and "Microsoft.Network" namespaces. Create custom policies to audit or enforce the network configuration of your App Service apps. 

Use built-in policy definitions for App Service, such as:
- The app should use a virtual network service endpoint
- The app should only be accessible over HTTPS
- Set the minimum TLS version to the current version

Review the referenced links for additional information.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to configure end-to-end TLS by using Application Gateway with the portal](../application-gateway/end-to-end-ssl-portal.md)

- [Secure the ASE as described in Locking down an App Service](/azure/app-service/environment/firewall-integration)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.10: Document traffic configuration rules

**Guidance**: Use tags for network security groups and other related resources, including traffic flow in App Service.

Specify business need, duration, and so on, with the "Description" field for any rules, which allow traffic to or from a network for individual network security groups rules.

Apply any of the built-in Azure Policy definitions related to tagging effects, such as "Require tag and its value", to ensure that all resources are created with tags and to notify you of any existing untagged resources. Use Azure PowerShell or Azure CLI to look up or perform actions on resources based on their tags.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

- [Azure App Service Access Restrictions](/azure/app-service/app-service-ip-restrictions)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Activity log to monitor network resource configurations, and detect changes to network settings and to any resources related to App Service. 

Apply one of the several Azure Policy built-in definitions for App Service, such as a policy that audits apps for the use of virtual network endpoint service. Create alerts within Azure Monitor to trigger when changes to critical network settings or resources take place. 

Review detailed security alerts and recommendations in Security Center, at the portal or through programmatic tools. Export this information or send it to other monitoring tools in your environment. Tools are available to export alerts and recommendations either manually or in an ongoing and continuous fashion. With these tools, you can:
 
- Continuously export to a Log Analytics workspace
- Continuously export to Azure Event Hubs (for integrations with third-party SIEMs)
- Export to a CSV file (one time)

It is recommended that you create a process with automated tools to monitor network resource configurations and quickly detect changes.

- [How to view and retrieve Azure Activity Log events](../azure-monitor/essentials/activity-log.md#view-the-activity-log)

- [How to create alerts in Azure Monitor](../azure-monitor/alerts/alerts-activity-log.md)

- [Export security alerts and recommendations](../security-center/continuous-export.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Logging and Monitoring

*For more information, see the [Azure Security Benchmark: Logging and Monitoring](../security/benchmarks/security-control-logging-monitoring.md).*

### 2.2: Configure central security log management

**Guidance**: Integrate your App Service Environment (ASE) with Azure Monitor to send logs to Azure Storage, Azure Event Hubs, or Log Analytics. 
Enable Azure Activity log diagnostic settings for control plane audit logging. Security alerts from Security Center are published to the Azure Activity log. Audit Azure Activity log data, which let’s you determine the "what, who, and when" for any write operations (PUT, POST, DELETE) performed at the control plane level for Azure App Service and other Azure resources. Save your queries for future use, pin query results to Azure Dashboards, and create log alerts. Also, use the Data Access REST API in Application Insights to access your telemetry programmatically.

Use Microsoft Azure Sentinel, a scalable, cloud-native, security information event management (SIEM) available to connect to various data sources and connectors, based on your business requirements. You can also enable and on-board data to a third-party security information event management (SIEM) system, such as Barracuda in Azure Marketplace.

- [Logging ASE Activity](./environment/using-an-ase.md#logging)

- [How to enable Diagnostic Settings for Azure App Service](troubleshoot-diagnostic-logs.md)

- [How to enable Application Insights](../azure-monitor/app/app-insights-overview.md)

- [Export telemetry from Application Insights](../azure-monitor/app/export-telemetry.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.3: Enable audit logging for Azure resources

**Guidance**: Enable Azure Activity log diagnostic settings for control plane audit logging of App Service. Send the logs to a Log Analytics workspace, Azure Event Hub, or an Azure Storage account.

The "what, who, and when" for any write operations (PUT, POST, DELETE) performed at the control plane level can be determined using Azure Activity log data for App Service and other Azure resources.

Additionally, Azure Key Vault provides centralized secret management with access policies and audit history. 

- [How to enable Diagnostic Settings for Azure Activity Log](../azure-monitor/essentials/activity-log.md)

- [How to enable Diagnostic Settings for Azure App Service](troubleshoot-diagnostic-logs.md)

- [Resource Manager Operations](../role-based-access-control/resource-provider-operations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Web**:

[!INCLUDE [Resource Policy for Microsoft.Web 2.3](../../includes/policy/standards/asb/rp-controls/microsoft.web-2-3.md)]

### 2.5: Configure security log storage retention

**Guidance**: In Azure Monitor, set the log retention period for the Log Analytics workspaces associated with your App Service resources according to your organization's compliance regulations.
- [How to set log retention parameters](../azure-monitor/logs/manage-cost-storage.md#change-the-data-retention-period)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.6: Monitor and review logs

**Guidance**: Review the Azure Activity log diagnostic settings in your App Service resources with the logs being sent to a Log Analytics workspace. Perform queries in Log Analytics to search terms, identify trends, analyze patterns, and provide many other insights based on the collected data.

Use Application Insights for your App Service apps and to collect log, performance, and error data. View the telemetry data collected by Application Insights within the Azure portal.

If you have deployed a Web Application Firewall (WAF), you can monitor attacks against your App Service apps by using a real-time Web Application Firewall log. The log is integrated with Azure Monitor to track Web Application Firewall alerts and easily monitor trends.

Use Azure Sentinel, a scalable and cloud-native security information event management (SIEM), to integrate with various data sources and connectors, as per requirements. Optionally, enable and on-board data to a third-party  security information event management solution in the Azure Marketplace.

- [How to enable diagnostic settings for Azure Activity Log](../azure-monitor/essentials/activity-log.md)

- [How to enable Application Insights](../azure-monitor/app/app-insights-overview.md)

- [How to integrate your App Service Environment with the Azure Application Gateway (WAF)](environment/integrate-with-application-gateway.md)

- [How to on-board Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.7: Enable alerts for anomalous activities

**Guidance**: Configure Security Center in your Azure subscription and review the generated alerts. Use Azure Monitor to get your Activity log data to an Event Hub where it can be read by a security information event management (SIEM) solution, such as Azure Sentinel. 

Monitor attacks against your App Service apps by using a real-time Web Application Firewall log with a deployed Azure Web Application Firewall (WAF). The log is integrated with Azure Monitor to track Web Application Firewall (WAF) alerts and easily monitor trends.

- [How to integrate your App Service Environment with the Azure Application Gateway (WAF)](environment/integrate-with-application-gateway.md)

- [Export security alerts and recommendations](../security-center/continuous-export.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Azure Active Directory (Azure AD) has built-in roles that must be explicitly assigned and query-able. Use the Azure AD PowerShell module to perform ad hoc queries to discover accounts that are members of administrative groups.

- [How to get members of a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrolemember?preserve-view=true&view=azureadps-2.0)

- [How to use managed identities for App Service and Azure Functions](./overview-managed-identity.md?tabs=dotnet&context=azure%2factive-directory%2fmanaged-identities-azure-resources%2fcontext%2fmsi-context)

- [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.2: Change default passwords where applicable

**Guidance**: Azure Active Directory (Azure AD) does not have the concept of default passwords. It provides control plane access to App Service.

Generally, avoid implementing default passwords for user access when building your own apps. Use one of the identity providers available by default for App Service, such as Azure AD, Microsoft Account, Facebook, Google, or Twitter.

Disable anonymous access, unless you need to support it. 

- [Identity providers available by default in Azure App Service](./overview-authentication-authorization.md#identity-providers)

- [Authentication and authorization in Azure App Service and Azure Functions](overview-authentication-authorization.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.3: Use dedicated administrative accounts

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts. Use the Identity and Access Management features in Security Center to monitor and track the number of administrative accounts. 

Use recommendations from Security Center or built-in Azure policies, such as:

- There should be more than one owner assigned to your subscription. 
- Deprecated accounts with owner permissions should be removed from your subscription
- External accounts with owner permissions should be removed from your subscription

Create a process to monitor network resource configurations, and detect changes to administrative accounts.

- [How to use Azure Security Center to monitor identity and access](../security-center/security-center-identity-access.md)

- [How to use Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Learn more about granting users access to applications](../role-based-access-control/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.4: Use Azure Active Directory single sign-on (SSO)

**Guidance**: Authenticate App Service through Azure Active Directory (Azure AD). It provides an OAuth 2.0 service for your identity provider and enables authorized access to mobile and web applications. 

App Service apps use federated identity, in which a third-party identity provider manages the user identities and authentication flow for you. These identity providers are available by default:

- Azure AD
- Microsoft Account

- Facebook

- Google

- Twitter

When you enable authentication and authorization with one of these providers, its sign-in endpoint is available for user authentication and for validation of authentication tokens from the provider.

- [Understand authentication and authorization in Azure App Service](./overview-authentication-authorization.md#identity-providers)

- [Learn about Authentication and Authorization in Azure App Service](overview-authentication-authorization.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.5: Use multi-factor authentication for all Azure Active Directory-based access

**Guidance**: Enable the multifactor authentication feature in Azure Active Directory (Azure AD) and follow Identity and Access Management recommendations in Security Center.

Implement multifactor authentication for Azure AD. Administrators need to ensure that the subscription accounts in the portal are protected. The subscription is vulnerable to attacks because it manages the resources that you created. 

- [Azure Security multifactor authentication](/previous-versions/azure/security/develop/secure-aad-app)

- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

- [How to monitor identity and access within Azure Security Center](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.6: Use secure, Azure-managed workstations for administrative tasks

**Guidance**: Use Privileged Access Workstations (PAW) with multifactor authentication configured to log into and configure Azure resources. 

- [Learn about Privileged Access Workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/)

- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.7: Log and alert on suspicious activities from administrative accounts

**Guidance**: Use Privileged Identity Management (PIM) in Azure Active Directory (Azure AD) for generation of logs and alerts when suspicious or unsafe activities occur in the environment.

In addition, use Azure AD risk detections to view alerts and reports on risky user behavior.

Threat protection in Security Center provides comprehensive defenses for your environment, which includes threat protection for Azure compute resources such as Windows machines, Linux machines, App Service, and Azure containers.

- [How to deploy Privileged Identity Management (PIM)](../active-directory/privileged-identity-management/pim-deployment-plan.md)

- [Understand Azure AD risk detections](../active-directory/identity-protection/overview-identity-protection.md)

- [Threat protection for Azure compute resources](../security-center/azure-defender.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.8: Manage Azure resources from only approved locations

**Guidance**: Use Conditional Access Named Locations to allow access to the Azure portal from only specific logical groupings of IP address ranges, countries, or regions.

- [How to configure Named Locations in Azure](../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system for your App Service apps. Azure AD protects data by using strong encryption for data at rest and in transit and also salts, hashes, and securely stores user credentials.

- [How to configure your Azure App Service apps to use Azure AD login](configure-authentication-provider-aad.md)

- [How to create and configure an Azure AD instance](../active-directory/fundamentals/active-directory-access-create-new-tenant.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.10: Regularly review and reconcile user access

**Guidance**: Discover stale accounts with the logs provided by Azure Active Directory (Azure AD). Use Azure Identity Access Reviews to efficiently manage group memberships and access to enterprise applications, as well as role assignments. Review user access periodically to make sure only the intended users have continued access. 

- [Understand Azure AD reporting](../active-directory/reports-monitoring/index.yml)

- [How to use Azure Identity Access Reviews](../active-directory/governance/access-reviews-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.11: Monitor attempts to access deactivated credentials

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system for your App Service apps. Azure AD protects data by using strong encryption for data at rest and in-transit, salts, hashes, and securely stores user credentials.

Access to Azure AD sign-in activity, audit, and risk event log sources allow you to integrate with Azure Sentinel or a third-party security information event management (SIEM) solution. Streamline the process by creating diagnostic settings for Azure AD user accounts and sending the audit and sign in logs to a Log Analytics workspace. Desired log alerts can be configured within Log Analytics.

- [How to configure your Azure App Service apps to use Azure AD login](configure-authentication-provider-aad.md)

- [How to integrate Azure Activity Logs into Azure Monitor](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)

- [How to on-board Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.12: Alert on account sign-in behavior deviation

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system for your App Service apps. 

Use Azure AD Identity Protection to configure automated responses to detected suspicious actions related to user identities, such as account login behavior deviation on the control plane with the Azure portal. You can also ingest data into Azure Sentinel for further investigation. 

- [How to configure your Azure App Service app to use Azure AD login](configure-authentication-provider-aad.md)

- [How to view Azure AD risky sign-ins](../active-directory/identity-protection/overview-identity-protection.md)

- [How to configure and enable Identity Protection risk policies](../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

**Guidance**: Not available; Customer Lockbox is not supported for Azure App Service.

- [List of Customer Lockbox-supported services](../security/fundamentals/customer-lockbox-overview.md#supported-services-and-scenarios-in-general-availability)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](../security/benchmarks/security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags to assist in tracking App Service resources that store or process sensitive information.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: For an App Service Environment, implement separate subscriptions, management groups, or both, for development, test, and production environments. You can Isolate apps that process sensitive information from other apps in the same manner. Deploy your App Service app into a Virtual Network. Use network security groups and subnets for further application isolation. 

There are two deployment types for an App Service environment (ASE). Both let you isolate the traffic based on your business requirements.

- External Application Service Environment - Exposes the  App Service Environment hosted apps on an internet-accessible IP address.

-  internal load balancer (ILB) Application Service Environment - Exposes the App Service Environment hosted apps on an IP address inside your Virtual Network. The internal endpoint is an internal load balancer (ILB), which is why it is called an ILB ASE. 

For the multi-tenant App Service (an app not in the Isolated tier), use Virtual Network Integration for your app's access to resources in your Virtual network.  Use private site access to make an app accessible only from a private network, such as one from within an Azure Virtual network. Virtual Network Integration is used only to make outbound calls from your app into your Virtual Network. The Virtual Network Integration feature behaves differently when it is used with a virtual network in the same region and with virtual networks in other regions. 
 
- [Networking considerations for an App Service Environment](environment/network-info.md)

- [How to create an external ASE](environment/create-external-ase.md)

- [How to create an internal ASE](environment/create-ilb-ase.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: While data identification, classification, and loss prevention features are not yet available for App Service, you can reduce the data exfiltration risk from the virtual network by removing all rules where the destination uses a 'tag' for Internet or Azure services. 

Microsoft manages the underlying infrastructure for App Service and has implemented strict controls to prevent the loss or exposure of your data.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.4: Encrypt all sensitive information in transit

**Guidance**: Use the default minimum version of TLS 1.2, configured in TLS/SSL settings, for encrypting all information in transit. Also ensure that all HTTP connection requests are redirected to HTTPS.

- [Understand encryption in transit for Azure App Service web apps](security-recommendations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.Web**:

[!INCLUDE [Resource Policy for Microsoft.Web 4.4](../../includes/policy/standards/asb/rp-controls/microsoft.web-4-4.md)]

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Currently not available. Data identification, classification, and loss prevention features are not yet available for App Service. 

Tag App Service apps that may be processing sensitive information. Implement third-party solution, if necessary for compliance purposes.

Microsoft manages the underlying platform and treats all customer data as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.6: Use Azure RBAC to control access to resources 

**Guidance**: Use Azure role-based access control (Azure RBAC) in Azure Active Directory (Azure AD) to control access to the App Service control plane at the Azure portal.

- [How to configure Azure RBAC](../role-based-access-control/role-assignments-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.8: Encrypt sensitive information at rest

**Guidance**: Web site content in an App Service app, such as files, are stored in Azure Storage, which automatically encrypts the content at rest. Choose to store application secrets in Key Vault and retrieve them at runtime.

Customer supplied secrets are encrypted at rest while stored in App Service configuration databases.

Note that while locally attached disks can be used optionally by websites as temporary storage, (for example, D:\local and %TMP%), they are not encrypted at rest.

- [Understand data protection controls for Azure App Service](./security-recommendations.md#data-protection)

- [Understand Azure Storage encryption at rest](../storage/common/storage-service-encryption.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with Azure Activity log to create alerts upon any changes to production App Service apps and other critical or related resources.

- [How to create alerts for Azure Activity Log events](../azure-monitor/alerts/alerts-activity-log.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Vulnerability Management

*For more information, see the [Azure Security Benchmark: Vulnerability Management](../security/benchmarks/security-control-vulnerability-management.md).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: Adopt a DevSecOps practice to ensure that your App Service apps are secure and remain secured throughout the duration of their lifecycle. DevSecOps incorporates your organization's security team and their capabilities into your DevOps practices making security the responsibility of everyone on the team.

Review and follow recommendations from Security Center for securing your App Service apps.

- [How to add continuous security validation to your CI/CD pipeline](/azure/devops/migrate/security-validation-cicd-pipeline?view=azure-devops&preserve-view=true)

- [How to implement Azure Security Center vulnerability assessment recommendations](../security-center/deploy-vulnerability-assessment-vm.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

**Guidance**: Microsoft performs vulnerability management on the underlying systems that support App Service. However, you can use the severity of the recommendations within Security Center as well as the Secure Score to measure risk within your environment. Your Secure Score is based on how many Security Center recommendations you have mitigated. To prioritize the recommendations to resolve first, consider the severity of each.

- [Security recommendations reference guide](../security-center/recommendations-reference.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Inventory and Asset Management

*For more information, see the [Azure Security Benchmark: Inventory and Asset Management](../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

**Guidance**: Use Azure Resource Graph to query or discover all resources (such as compute, storage, network, ports, protocols, and so on) within your subscriptions. Ensure appropriate permissions are applied to your tenant and you can enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use Azure Resource Manager resources going forward.

- [How to create queries with Azure Resource Graph](../governance/resource-graph/first-query-portal.md)

- [How to view your Azure Subscriptions](/powershell/module/az.accounts/get-azsubscription?view=azps-4.8.0&preserve-view=true)

- [Understand Azure RBAC](../role-based-access-control/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources using metadata to logically organize them into a taxonomy.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions as appropriate, to organize and track Azure resources. Reconcile inventory on a regular basis and ensure unauthorized resources are removed from your subscriptions as part of this process.

Choose Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions, by using the following built-in policy definitions:

- Not allowed resource types
- Allowed resource types

Review the referenced links for additional information.

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create Management Groups](../governance/management-groups/create-management-group-portal.md)

- [How to create and use Tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.4: Define and maintain inventory of approved Azure resources

**Guidance**: Create an inventory of approved Azure resources and approved software for compute resources based on your organizational needs.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in your subscriptions.

Use Azure Resource Graph to query or discover resources within their subscriptions.  Ensure that all Azure resources present in the environment are approved. 

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md) 

- [How to create queries with Azure Graph](../governance/resource-graph/first-query-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.6: Monitor for unapproved software applications within compute resources

**Guidance**: Use Azure Resource
Graph to query or discover resources within your subscriptions and ensure that the discovered Azure resources are approved based on your organizational policies.

Use WebJobs in App Service to Monitor for unapproved software applications that are deployed within compute resources. Use WebJobs to run a program or script in the same instance as a web app, API app, or mobile app. Define WebJob configurations and monitoring with logs. In the WebJob Run Details page, select Toggle Output to see the text of the log contents. Note that WebJobs are not yet supported for App Service on Linux.

- [Run background tasks with WebJobs in Azure App Service](webjobs-create.md)

- [Tutorial - Create and manage policies to enforce compliance](../governance/policy/tutorials/create-and-manage.md)

- [Quickstart - Run your first Resource Graph query using Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.7: Remove unapproved Azure resources and software applications

**Guidance**: Ensure that all Azure resources present in the environment are approved. Use Azure Policy to put restrictions on the type of resources that can be created in your subscriptions. Remove any deployed software applications that have not been approved per your organizational policies.

- [Run background tasks with WebJobs in Azure App Service](webjobs-create.md)

- [Tutorial - Create and manage policies to enforce compliance](../governance/policy/tutorials/create-and-manage.md)

- [Quickstart - Run your first Resource Graph query using Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.8: Use only approved applications

**Guidance**: Ensure that all Azure resources present in the environment are approved. Use Azure Policy to put restrictions on the type of resources that can be created in your subscriptions. Remove any deployed software applications that have not been approved per your organizational policies. 

- [Run background tasks with WebJobs in Azure App Service](webjobs-create.md)

- [Tutorial - Create and manage policies to enforce compliance](../governance/policy/tutorials/create-and-manage.md)

- [Quickstart - Run your first Resource Graph query using Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.9: Use only approved Azure services

**Guidance**: Create a process to review unauthorized Azure services on a periodic basis to ensure only authorized Azure services are used in your subscriptions.

Use Azure Resource Graph, within this process, to query or discover resources within their subscriptions. Ensure that all Azure resources present in the environment are approved.

Configure Azure Policy to put restrictions on the type of resources that can be created in your subscriptions by using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

Use WebJobs in App Service to monitor for unapproved software applications deployed within computer resources. Use WebJobs to run a program or script in the same instance as a web app, API app, or mobile app. Define WebJob configurations and monitoring with logs. In the WebJob Run Details page, select Toggle Output to see the text of the log contents. Note that WebJobs are not yet supported for App Service on Linux.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to deny a specific resource type with Azure Policy](../governance/policy/samples/built-in-policies.md#general)

- [Run background tasks with WebJobs in Azure App Service](webjobs-create.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.10: Maintain an inventory of approved software titles

**Guidance**: Implement a process to inventory and review software titles in your subscriptions on a periodic basis to ensure only authorized Azure services are used in your subscriptions.

Use Azure Resource Graph, within this process, to query or discover resources within your subscriptions. Ensure that all Azure resources discovered in the environment are approved.

Configure Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

Similarly, use WebJobs in App Service to inventory unapproved software applications deployed within computer resources. Define their configuration and monitoring with logs. In the WebJob Run Details page, select Toggle Output to see the text of the log contents. Note that WebJobs are not yet supported for App Service on Linux.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to deny a specific resource type with Azure Policy](../governance/policy/samples/built-in-policies.md#general)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.11: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Configure Azure Conditional Access to limit the ability of users to interact with Azure Resource Manager, by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resource Manager](../role-based-access-control/conditional-access-azure-management.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.12: Limit users' ability to execute scripts within compute resources

**Guidance**: WebJobs in App Service enable customers to run a program or script in the same instance as a web app, API app, or mobile app. You are responsible for defining your configuration to restrict or limit any scripts, which are not allowed by the organization. App Service does not provide a mechanism to limit script execution natively. Note that WebJobs are not yet supported for App Service on Linux.

- [Run background tasks with WebJobs in Azure App Service](webjobs-create.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.13: Physically or logically segregate high risk applications

**Guidance**: Implement separate subscriptions or management groups to provide isolation for high risk App Service apps. Deploy a higher risk app into its own Virtual Network, since perimeter security in App Service is achieved through the usage of virtual networks. The App Service Environment is a deployment of App Service into a subnet in your Azure Virtual Network. 

There are two types of Application Service Environment, External Application Service Environment, and ILB (Internal Load Balancer) Application Service Environment. Choose the best architecture based on your requirements.

- [Networking considerations for an App Service Environment](environment/network-info.md)

- [Create an External App Service environment](environment/create-external-ase.md)

- [Create and use an Internal Load Balancer App Service Environment](environment/create-ilb-ase.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Secure Configuration

*For more information, see the [Azure Security Benchmark: Secure Configuration](../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Define and implement standard security configurations for your App Service deployed apps with Azure Policy.

Use Azure Policy aliases in the "Microsoft.Web" namespace to create custom policies to audit or enforce the configuration of your App Service Web Apps.

Apply built-in policy definitions such as:

- App Service should use a virtual network service endpoint

- Web Applications should only be accessible over HTTPS

- Use the latest TLS version in your apps

It is recommended that you document the process to apply the built-in policy definitions for standardized usage.   

- [How to view available Azure Policy Aliases](/powershell/module/az.resources/get-azpolicyalias?view=azps-4.8.0&preserve-view=true)

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] effects to enforce secure settings across your Azure App Service apps.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Understand Azure Policy Effects](../governance/policy/concepts/effects.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.5: Securely store configuration of Azure resources

**Guidance**: Choose Azure DevOps or Azure Repos to securely store and manage your code when using custom Azure Policy definitions.

Use your existing Continuous Integration (CI) and Continuous Delivery (CD) pipeline to deploy a known-secure configuration.

- [How to store code in Azure DevOps](/azure/devops/repos/git/gitworkflow?view=azure-devops&preserve-view=true)

- [Azure Repos Documentation](/azure/devops/repos/?view=azure-devops&preserve-view=true)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Use built-in Azure Policy definitions as well as Azure Policy aliases in the "Microsoft.Web" namespace to create custom policies to alert, audit, and enforce system configurations. Develop a process and pipeline for managing policy exceptions.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Use built-in Azure Policy definitions as well as Azure Policy aliases in the "Microsoft.Web" namespace to create custom policies to alert, audit, and enforce system configurations. 

Apply Azure Policy [audit], [deny], and [deploy if not exist], effects to automatically enforce configurations for your Azure resources.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.11: Manage Azure secrets securely

**Guidance**: Use Managed Identities to provide your App Service apps with an automatically managed identity in Azure Active Directory (Azure AD). Managed Identities enable your apps to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code. Ensure soft delete is enabled in Azure Key Vault.

- [How to enable soft delete in Azure Key Vault](../key-vault/general/key-vault-recovery.md)

- [How to use managed identities for App Service](overview-managed-identity.md)

- [How to provide Key Vault authentication with a managed identity](../key-vault/general/assign-access-policy-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.12: Manage identities securely and automatically

**Guidance**: Use Managed Identities to provide your App Service-deployed apps with an automatically managed identity in Azure Active Directory (Azure AD). Managed Identities enables your apps to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code.

- [How to use managed identities for App Service](overview-managed-identity.md)

- [How to provide Key Vault authentication with a managed identity](../key-vault/general/assign-access-policy-portal.md)

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

**Guidance**: The Backup and Restore feature in App Service lets you easily create app backups manually or on a schedule. You can configure the backups to be retained up to an indefinite amount of time. You can restore the app to a snapshot of a previous state by overwriting the existing app or restoring to another app.

App Service can back up the following information to an Azure storage account and container, which you have configured your app to use:
- App configuration
- File content
- Database connected to your app

Ensure that regular and automated back-ups are occurring at a frequency as defined by your organizational policies.

- [Understand Azure App Service backup capability](manage-backup.md)

- [Customer-managed keys for Azure Storage encryption](../storage/common/customer-managed-keys-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.2: Perform complete system backups and backup any customer-managed keys

**Guidance**: Use the backup and restore feature of App Service to back up your applications. The backup features require an Azure Storage Account to store your application's backup information.

- Azure Storage provides encryption at rest - Use system-provided keys or your own, customer-managed keys. This is where your application data is stored when it is not running in a web app in Azure.
- Running from a deployment package is a deployment feature of App Service. It allows you to deploy your site content from an Azure Storage Account using a Shared Access Signature (SAS) URL.

- Key Vault references are a security feature of App Service. It allows you to import secrets at runtime as application settings. Use this to encrypt the SAS URL of your Azure Storage Account.

More information is available at the referenced links.

- [Back up your app in Azure](manage-backup.md)

- [Restore an app running in Azure App Service](web-sites-restore.md)

- [Understand encryption at rest in Azure](../security/fundamentals/encryption-atrest.md#encryption-at-rest-in-microsoft-cloud-services) 

- [Encryption Model and key management table](../security/fundamentals/encryption-atrest.md)

- [Encryption at rest using customer-managed keys](configure-encrypt-at-rest-using-cmk.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.3: Validate all backups including customer-managed keys

**Guidance**: Periodically test the restore process for any backups of your App Service applications.

- [Back up your app in Azure](manage-backup.md)

- [How to restore an Azure App Service web app](web-sites-restore.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.4: Ensure protection of backups and customer-managed keys

**Guidance**: App Service backups are stored within an Azure Storage account. Data in Azure Storage is encrypted and decrypted transparently using 256-bit AES encryption, one of the strongest block ciphers available, and is FIPS 140-2 compliant. Azure Storage encryption is similar to BitLocker encryption on Windows.

Azure Storage encryption is enabled for all storage accounts, including both Resource Manager and classic storage accounts. Azure Storage encryption cannot be disabled. Because your data is secured by default, you don't need to modify your code or applications to take advantage of Azure Storage encryption.

By default, data in a storage account is encrypted with Microsoft-managed keys. You can rely on Microsoft-managed keys for the encryption of your data, or you can manage encryption with your own keys. Ensure soft delete is enabled in Azure Key Vault.

- [Understand Azure Storage encryption for data at rest](../storage/common/storage-service-encryption.md)

- [How to enable soft delete in Azure Key Vault](../key-vault/general/key-vault-recovery.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.

- [How to configure Workflow Automations within Azure Security Center](../security-center/security-center-planning-and-operations-guide.md)

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Customer may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytics used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, clearly mark subscriptions (for example, production, non-production) and create a naming system to clearly identify and categorize Azure resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your system's incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

- [Refer to NIST's publication - Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that the customer's data has been accessed by an unlawful or unauthorized party.  Review incidents after the fact to ensure that issues are resolved.

- [How to set the Azure Security Center Security Contact](../security-center/security-center-provide-security-contact-details.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. Use the Security Center data connector to stream the alerts to Azure Sentinel as per business needs.

- [How to configure continuous export](../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../sentinel/connect-azure-security-center.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.6: Automate the response to security alerts

**Guidance**: Use the Workflow Automation feature in Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.

- [How to configure Workflow Automation and Logic Apps](../security-center/workflow-automation.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Penetration Tests and Red Team Exercises

*For more information, see the [Azure Security Benchmark: Penetration Tests and Red Team Exercises](../security/benchmarks/security-control-penetration-tests-red-team-exercises.md).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

**Guidance**: Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications. 

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1) 

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Next steps

- See the [Azure Security Benchmark V2 overview](../security/benchmarks/overview.md)
- Learn more about [Azure security baselines](../security/benchmarks/security-baselines-overview.md)
