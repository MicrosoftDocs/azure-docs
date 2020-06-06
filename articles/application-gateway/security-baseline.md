---
title: Azure security baseline for Azure Application Gateway
description: Azure security baseline for Azure Application Gateway
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 06/05/2020
ms.author: mbaldwin
ms.custom: security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Application Gateway

The Azure Security Baseline for Azure Application Gateway contains recommendations that will help you improve the security posture of your deployment.

The baseline for this service is drawn from the [Azure Security Benchmark version 1.0](https://docs.microsoft.com/azure/security/benchmarks/overview), which provides recommendations on how you can secure your cloud solutions on Azure with our best practices guidance.

For more information, see the [Azure security baselines overview](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview).

## Network security

*For more information, see [Security control: Network security](https://docs.microsoft.com/azure/security/benchmarks/security-control-network-security).*

### 1.1: Protect Azure resources within virtual networks

**Guidance**: Ensure that all Virtual Network Azure Application Gateway subnet deployments have a network security group (NSG) applied with network access controls specific to your application's trusted ports and sources. While network security groups are supported on Azure Application Gateway, there are some restrictions and requirements that must be adhered to in order for your NSG and Azure Application Gateway to function as expected.

* [Understand restrictions and requirements around using NSGs with Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/configuration-overview)

* [How to create an NSG with a security configuration](https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and NICs

**Guidance**: For the network security groups (NSGs) associated with your Azure Application Gateway subnets, enable NSG flow logs and send logs into a Storage Account for traffic audit. You may also send NSG flow logs to a Log Analytics Workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

Note: There are some cases where NSG flow logs associated with your Azure Application Gateway subnets won't show traffic that has been allowed. If your configuration matches following scenario, you won't see allowed traffic in your NSG flow logs:
- You've deployed Application Gateway v2
- You have an NSG on the application gateway subnet
- You've enabled NSG flow logs on that NSG

* [How to Enable NSG Flow Logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal)

* [How to Enable and use Traffic Analytics](https://docs.microsoft.com/azure/network-watcher/traffic-analytics)

* [Understand Network Security provided by Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-network-recommendations)

* [FAQ for diagnostic and Logging for Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/application-gateway-faq#diagnostics-and-logging)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.3: Protect critical web applications

**Guidance**: Deploy Azure Web Application Firewall (WAF) in front of critical web applications for additional inspection of incoming traffic. Web Application Firewall (WAF) is a service (feature of Azure Application Gateway) that provides centralized protection of your web applications from common exploits and vulnerabilities. Azure WAF can help secure your Azure App Service web apps by inspecting inbound web traffic to block attacks such as SQL injections, Cross-Site Scripting, malware uploads, and DDoS attacks. WAF is based on rules from the OWASP (Open Web Application Security Project) core rule sets 3.1 (WAF_v2 only), 3.0, and 2.2.9.

* [Understand Azure Application Gateway features](https://docs.microsoft.com/azure/application-gateway/features)

* [Understand Azure WAF](https://docs.microsoft.com/azure/web-application-firewall/ag/ag-overview)

* [How to deploy Azure WAF](https://docs.microsoft.com/azure/web-application-firewall/ag/create-waf-policy-ag)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.4: Deny communications with known malicious IP addresses

**Guidance**: Enable DDoS Standard protection on your Azure Virtual Networks associated with your production instances of Azure Application Gateway to guard against DDoS attacks. Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious IP addresses.

* [How to configure DDoS protection](https://docs.microsoft.com/azure/virtual-network/manage-ddos-protection)

* [Understand Azure Security Center Integrated Threat Intelligence](https://docs.microsoft.com/azure/security-center/security-center-alerts-service-layer)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.5: Record network packets

**Guidance**: For the network security groups (NSGs) associated with your Azure Application Gateway subnets, enable NSG flow logs and send logs into a Storage Account for traffic audit. You may also send NSG flow logs to a Log Analytics Workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

Note: There are some cases where NSG flow logs associated with your Azure Application Gateway subnets won't show traffic that has been allowed. If your configuration matches following scenario, you won't see allowed traffic in your NSG flow logs:
- You've deployed Application Gateway v2
- You have an NSG on the application gateway subnet
- You've enabled NSG flow logs on that NSG

* [How to Enable NSG Flow Logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal)

* [How to Enable and use Traffic Analytics](https://docs.microsoft.com/azure/network-watcher/traffic-analytics)

* [Understand Network Security provided by Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-network-recommendations)

* [FAQ for diagnostic and Logging for Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/application-gateway-faq#diagnostics-and-logging)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.6: Deploy network based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Deploy Azure Web Application Firewall (WAF) in front of critical web applications for additional inspection of incoming traffic. Web Application Firewall (WAF) is a service (feature of Azure Application Gateway) that provides centralized protection of your web applications from common exploits and vulnerabilities. Azure WAF can help secure your Azure App Service web apps by inspecting inbound web traffic to block attacks such as SQL injections, Cross-Site Scripting, malware uploads, and DDoS attacks. WAF is based on rules from the OWASP (Open Web Application Security Project) core rule sets 3.1 (WAF_v2 only), 3.0, and 2.2.9.

Alternatively, there are multiple marketplace options like the Barracuda WAF for Azure that are available on the Azure Marketplace which include IDS/IPS features.

* [Understand Azure Application Gateway features](https://docs.microsoft.com/azure/application-gateway/features)

* [Understand Azure WAF](https://docs.microsoft.com/azure/web-application-firewall/ag/ag-overview)

* [How to deploy Azure WAF](https://docs.microsoft.com/azure/web-application-firewall/ag/create-waf-policy-ag)

* [Understand Barracuda WAF Cloud Service](https://docs.microsoft.com/azure/app-service/environment/app-service-app-service-environment-web-application-firewall#configuring-your-barracuda-waf-cloud-service)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.7: Manage traffic to web applications

**Guidance**: Deploy Azure Application Gateway for web applications with HTTPS/SSL enabled for trusted certificates.

* [How to deploy Application Gateway](https://docs.microsoft.com/azure/application-gateway/quick-create-portal)

* [How to configure Application Gateway to use HTTPS](https://docs.microsoft.com/azure/application-gateway/create-ssl-portal)

* [Understand layer 7 load balancing with Azure web application gateways](https://docs.microsoft.com/azure/application-gateway/overview)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: Use Virtual Network Service Tags to define network access controls on Network Security Groups or Azure Firewall. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., GatewayManager) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

For the network security groups (NSGs) associated with your Azure Application Gateway subnets, you must allow incoming Internet traffic on TCP ports 65503-65534 for the Application Gateway v1 SKU, and TCP ports 65200-65535 for the v2 SKU with the destination subnet as Any and source as GatewayManager service tag. This port range is required for Azure infrastructure communication. These ports are protected (locked down) by Azure certificates. External entities, including the customers of those gateways, can't communicate on these endpoints.

* [Understand and use Service Tags](https://docs.microsoft.com/azure/virtual-network/service-tags-overview)

* [Azure Application Gateway configuration overview](https://docs.microsoft.com/azure/application-gateway/configuration-overview)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement standard security configurations for network settings related to your Azure Application Gateway deployments. Use Azure Policy aliases in the "Microsoft.Network" namespace to create custom policies to audit or enforce the network configuration of your Azure Application Gateways, Azure Virtual Networks, and network security groups. You may also make use of built-in policy definition.

You may also use Azure Blueprints to simplify large-scale Azure deployments by packaging key environment artifacts, such as Azure Resource Manager templates, role-based access control (RBAC), and policies in a single blueprint definition. You can easily apply the blueprint to new subscriptions, environments, and fine-tune control and management through versioning.

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

* [How to create an Azure Blueprint](https://docs.microsoft.com/azure/governance/blueprints/create-blueprint-portal)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.10: Document traffic configuration rules

**Guidance**: Use Tags for network security groups (NSGs) associated with your Azure Application Gateway subnet as well as any other resources related to network security and traffic flow. For individual NSG rules, use the "Description" field to specify business need and/or duration (etc.) for any rules that allow traffic to/from a network.

Use any of the built-in Azure policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with Tags and to notify you of existing untagged resources.

You may use Azure PowerShell or Azure CLI to look-up or perform actions on resources based on their Tags.

* [How to create and use Tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

* [How to create a Virtual Network](https://docs.microsoft.com/azure/virtual-network/quick-create-portal)

* [How to create an NSG with a Security Config](https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network settings and resources related to your Azure Application Gateway deployments. Create alerts within Azure Monitor that will trigger when changes to critical network settings or resources takes place.

* [How to view and retrieve Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view)

* [How to create alerts in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Logging and monitoring

*For more information, see [Security control: Logging and monitoring](https://docs.microsoft.com/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.1: Use approved time synchronization sources

**Guidance**: Microsoft maintains the time source used for Azure resources such as Azure App Service.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 2.2: Configure central security log management

**Guidance**: For control plane audit logging, enable Azure Activity Log diagnostic settings and send the logs to a Log Analytics workspace, Azure event hub, or Azure storage account. Using Azure Activity Log data, you can determine the "what, who, and when" for any write operations (PUT, POST, DELETE) performed at the control plane level for your Azure Application Gateway and related resources, such as network security groups (NSGs), being used to protect the Azure Application Gateway subnet.

In addition to Activity Logs, you can configure diagnostic settings for your Azure Application Gateway deployments. diagnostic settings are used to configure streaming export of platform logs and metrics for a resource to the destination of your choice (Storage Accounts, Event Hubs and Log Analytics).

Azure Application Gateway also offers built-in integration with Azure Application Insights. Application Insights collects log, performance, and error data. Application Insights automatically detects performance anomalies and includes powerful analytics tools to help you diagnose issues and to understand how your web apps are being used. You may enable continuous export to export telemetry from Application Insights into a centralized location to keep the data for longer than the standard retention period.

* [How to enable diagnostic settings for Azure Activity Log](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings-legacy)

* [How to enable diagnostic settings for Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/application-gateway-diagnostics)

* [How to enable Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview)

* [How to configure continuous export](https://docs.microsoft.com/azure/azure-monitor/app/export-telemetry)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

**Guidance**: For control plane audit logging, enable Azure Activity Log diagnostic settings and send the logs to a Log Analytics workspace, Azure event hub, or Azure storage account. Using Azure Activity Log data, you can determine the "what, who, and when" for any write operations (PUT, POST, DELETE) performed at the control plane level for your Azure Application Gateway and related resources, such as network security groups (NSGs), being used to protect the Azure Application Gateway subnet.

In addition to Activity Logs, you can configure diagnostic settings for your Azure Application Gateway deployments. diagnostic settings are used to configure streaming export of platform logs and metrics for a resource to the destination of your choice (Storage Accounts, Event Hubs and Log Analytics).

Azure Application Gateway also offers built-in integration with Azure Application Insights. Application Insights collects log, performance, and error data. Application Insights automatically detects performance anomalies and includes powerful analytics tools to help you diagnose issues and to understand how your web apps are being used. You may enable continuous export to export telemetry from Application Insights into a centralized location to keep the data for longer than the standard retention period.

* [How to enable diagnostic settings for Azure Activity Log](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings-legacy)

* [How to enable diagnostic settings for Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/application-gateway-diagnostics)

* [How to enable Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview)

* [How to configure continuous export](https://docs.microsoft.com/azure/azure-monitor/app/export-telemetry)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.4: Collect security logs from operating systems

**Guidance**: Not applicable; this recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.5: Configure security log storage retention

**Guidance**: Within Azure Monitor, set your Log Analytics Workspace retention period according to your organization's compliance regulations. Use Azure Storage Accounts for long-term/archival storage.

* [How to set log retention parameters for Log Analytics Workspaces](https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.6: Monitor and review Logs

**Guidance**: Enable Azure Activity Log diagnostic settings as well as the diagnostic settings for your Azure Application Gateway and send the logs to a Log Analytics workspace. Perform queries in Log Analytics to search terms, identify trends, analyze patterns, and provide many other insights based on the collected data.

Use Azure Monitor for Networks for a comprehensive view of health and metrics for all deployed network resources, including your Azure Application Gateways.

Optionally, you may enable and on-board data to Azure Sentinel or a third-party SIEM.

* [How to enable diagnostic settings for Azure Activity Log](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings-legacy)

* [How to enable diagnostic settings for Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/application-gateway-diagnostics)

* [How to use Azure Monitor for Networks](https://docs.microsoft.com/azure/azure-monitor/insights/network-insights-overview)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activities

**Guidance**: Deploy Azure Web Application Firewall (WAF) v2 SKU in front of critical web applications for additional inspection of incoming traffic. Web Application Firewall (WAF) is a service (feature of Azure Application Gateway) that provides centralized protection of your web applications from common exploits and vulnerabilities. Azure WAF can help secure your Azure App Service web apps by inspecting inbound web traffic to block attacks such as SQL injections, Cross-Site Scripting, malware uploads, and DDoS attacks. WAF is based on rules from the OWASP (Open Web Application Security Project) core rule sets 3.1 (WAF_v2 only), 3.0, and 2.2.9.

Enable Azure Activity Log diagnostic settings as well as the diagnostic settings for your Azure WAF and send the logs to a Log Analytics workspace. Perform queries in Log Analytics to search terms, identify trends, analyze patterns, and provide many other insights based on the collected data. You can create alerts based on your Log Analytics workspace queries.

Use Azure Monitor for Networks for a comprehensive view of health and metrics for all deployed network resources, including your Azure Application Gateways. Within the Azure Monitor for Networks console, you can view and create alerts for Azure Application Gateway.

* [How to deploy Azure WAF](https://docs.microsoft.com/azure/web-application-firewall/ag/create-waf-policy-ag)

* [How to enable diagnostic settings for Azure Activity Log](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings-legacy)

* [How to enable diagnostic settings for Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/application-gateway-diagnostics)

* [How to use Azure Monitor for Networks](https://docs.microsoft.com/azure/azure-monitor/insights/network-insights-overview)

* [How to create alerts within Azure](https://docs.microsoft.com/azure/azure-monitor/learn/tutorial-response)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.8: Centralize anti-malware logging

**Guidance**: Deploy Azure Web Application Firewall (WAF) v2 in front of critical web applications for additional inspection of incoming traffic. Web Application Firewall (WAF) is a service (feature of Azure Application Gateway) that provides centralized protection of your web applications from common exploits and vulnerabilities. Azure WAF can help secure your Azure App Service web apps by inspecting inbound web traffic to block attacks such as SQL injections, Cross-Site Scripting, malware uploads, and DDoS attacks.

Configure diagnostic settings for your Azure Application Gateway deployments. diagnostic settings are used to configure streaming export of platform logs and metrics for a resource to the destination of your choice (Storage Accounts, Event Hubs and Log Analytics).

* [How to deploy Azure WAF](https://docs.microsoft.com/azure/web-application-firewall/ag/create-waf-policy-ag)

* [How to configure diagnostic settings for Azure WAF](https://docs.microsoft.com/azure/application-gateway/application-gateway-diagnostics)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.9: Enable DNS query logging

**Guidance**: Not applicable; Azure Application Gateway does not process or produce user accessible DNS-related logs.

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

* [How to get a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0)

* [How to get members of a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.2: Change default passwords where applicable

**Guidance**: Control plane access to Azure Application Gateway is controlled through Azure Active Directory (AD). Azure AD does not have the concept of default passwords.

**Azure Security Center monitoring**: Currently not available

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

**Guidance**: Use an Azure app registration (service principal) to retrieve a token that can be used to interact with your Azure Application Gateways via API calls.

* [How to call Azure REST APIs](https://docs.microsoft.com/rest/api/azure/#how-to-call-azure-rest-apis-with-postman)

* [How to register your client application (service principal) with Azure AD](https://docs.microsoft.com/rest/api/azure/#register-your-client-application-with-azure-ad)

* [Azure Recovery Services API information](https://docs.microsoft.com/rest/api/recoveryservices/)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

**Guidance**: Enable Azure AD MFA and follow Azure Security Center Identity and Access Management recommendations.

* [How to enable MFA in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

* [How to monitor identity and access within Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

**Guidance**: Use PAWs (privileged access workstations) with MFA configured to log into and configure Azure resources.

* [Learn about Privileged Access Workstations](https://docs.microsoft.com/windows-server/identity/securing-privileged-access/privileged-access-workstations)

* [How to enable MFA in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.7: Log and alert on suspicious activities from administrative accounts

**Guidance**: Use Azure Active Directory security reports for generation of logs and alerts when suspicious or unsafe activity occurs in the environment. Use Azure Security Center to monitor identity and access activity.

* [How to identify Azure AD users flagged for risky activity](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-user-at-risk)

* [How to monitor users' identity and access activity in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.8: Manage Azure resources from only approved locations

**Guidance**: Use Conditional Access Named Locations to allow access from only specific logical groupings of IP address ranges or countries/regions.

* [How to configure Named Locations in Azure](https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory (AAD) as the central authentication and authorization system. AAD protects data by using strong encryption for data at rest and in transit. AAD also salts, hashes, and securely stores user credentials.

* [How to create and configure an AAD instance](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-access-create-new-tenant)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.10: Regularly review and reconcile user access

**Guidance**: Azure AD provides logs to help discover stale accounts. In addition, use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access can be reviewed on a regular basis to make sure only the right Users have continued access.

* [Understand Azure AD reporting](https://docs.microsoft.com/azure/active-directory/reports-monitoring/)

* [How to use Azure Identity Access Reviews](https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.11: Monitor attempts to access deactivated credentials

**Guidance**: You have access to Azure AD Sign-in Activity, Audit and Risk Event log sources, which allow you to integrate with any SIEM/Monitoring tool.

You can streamline this process by creating diagnostic settings for Azure Active Directory user accounts and sending the audit logs and sign-in logs to a Log Analytics Workspace. You can configure desired Alerts within Log Analytics Workspace.

* [How to integrate Azure Activity Logs into Azure Monitor](https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.12: Alert on account login behavior deviation

**Guidance**: Use Azure AD Identity Protection and risk detection features to configure automated responses to detected suspicious actions related to user identities. You can also ingest data into Azure Sentinel for further investigation.

* [How to view Azure AD risky sign-ins](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risky-sign-ins)

* [How to configure and enable Identity Protection risk policies](https://docs.microsoft.com/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies)

* [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

**Guidance**: Not applicable; Customer Lockbox is not applicable to Azure Application Gateway.

* [List of Customer Lockbox-supported services](https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview#supported-services-and-scenarios-in-general-availability)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Not applicable

## Data protection

*For more information, see [Security control: Data protection](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use Tags to assist in tracking Azure resources that store or process sensitive information.

* [How to create and use Tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. Ensure that all Virtual Network Azure Application Gateway subnet deployments have a network security group (NSG) applied with network access controls specific to your application's trusted ports and sources. While network security groups are supported on Azure Application Gateway, there are some restrictions and requirements that must be adhered to in order for your NSG and Azure Application Gateway to function as expected.

* [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/billing/billing-create-subscription)

* [How to create Management Groups](https://docs.microsoft.com/azure/governance/management-groups/create)

* [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

* [Understand restrictions and requirements around using NSGs with Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/configuration-overview)

* [How to create an NSG with a security configuration](https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: Ensure that all Virtual Network Azure Application Gateway subnet deployments have a network security group (NSG) applied with network access controls specific to your application's trusted ports and sources. Restrict outbound traffic to only trusted locations to help mitigate the threat of data exfiltration. While network security groups are supported on Azure Application Gateway, there are some restrictions and requirements that must be adhered to in order for your NSG and Azure Application Gateway to function as expected.

* [Understand restrictions and requirements around using NSGs with Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/configuration-overview)

* [How to create an NSG with a security configuration](https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### 4.4: Encrypt all sensitive information in transit

**Guidance**: Configure end-to-end encryption with TLS for your Azure Application Gateways.

* [How to configure end-to-end TLS by using Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/end-to-end-ssl-portal)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Not applicable, Azure Application Gateway does not store customer data at rest.

Microsoft manages the underlying infrastructure for Azure Application Gateway and has implemented strict controls to prevent the loss or exposure of customer data.

* [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 4.6: Use Role-based access control to control access to resources

**Guidance**: Use Azure Active Directory (AD) role-based access control (RBAC) to control access to the Azure Application Gateway control plane (the Azure portal).

* [How to configure RBAC in Azure](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.7: Use host-based data loss prevention to enforce access control

**Guidance**: Not applicable; this recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 4.8: Encrypt sensitive information at rest

**Guidance**: Not applicable; Azure Application Gateway does not store customer data.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with the Azure Activity log to create alerts for when changes take place to production Azure Application Gateway instances as well as other critical or related resources.

* [How to create alerts for Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Vulnerability management

*For more information, see [Security control: Vulnerability management](https://docs.microsoft.com/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: Currently not available; vulnerability assessment in Azure Security Center is not yet available for Azure Application Gateway.

Underlying platform scanned and patched by Microsoft. Review security controls available for Azure Application Gateway to reduce service configuration related vulnerabilities.

* [Feature coverage (including vulnerability assessment) for Azure PaaS Services](https://docs.microsoft.com/azure/security-center/features-paas)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 5.2: Deploy automated operating system patch management solution

**Guidance**: Not applicable; this recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 5.3: Deploy automated patch management solution for third-party software titles

**Guidance**: Not applicable; this recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 5.4: Compare back-to-back vulnerability scans

**Guidance**: Not yet available; vulnerability assessment in Azure Security Center is not yet available for Azure Application Gateway.

Underlying platform scanned and patched by Microsoft. Review security controls available for Azure Application Gateway to reduce service configuration related vulnerabilities.

* [Feature coverage (including vulnerability assessment) for Azure PaaS Services](https://docs.microsoft.com/azure/security-center/features-paas)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

**Guidance**: Not yet available; vulnerability assessment in Azure Security Center is not yet available for Azure Application Gateway.

Underlying platform scanned and patched by Microsoft. Review security controls available for Azure Application Gateway to reduce service configuration related vulnerabilities.

* [Feature coverage (including vulnerability assessment) for Azure PaaS Services](https://docs.microsoft.com/azure/security-center/features-paas)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Inventory and asset management

*For more information, see [Security control: Inventory and asset management](https://docs.microsoft.com/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use automated Asset Discovery solution

**Guidance**: Use Azure Resource Graph to query/discover all resources (such as compute, storage, network, ports, and protocols etc.) within your subscription(s). Ensure appropriate (read) permissions in your tenant and enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use Azure Resource Manager resources going forward.

* [How to create queries with Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

* [How to view your Azure Subscriptions](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0)

* [Understand Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/overview)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

* [How to create and use Tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

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

### 6.4: Define and Maintain an inventory of approved Azure resources

**Guidance**: Define approved Azure resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in your subscription(s).

Use Azure Resource Graph to query/discover resources within their subscription(s). Ensure that all Azure resources present in the environment are approved.

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

* [How to create queries with Azure Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

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
- Not allowed resource types
- Allowed resource types

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

* [How to deny a specific resource type with Azure Policy](https://docs.microsoft.com/azure/governance/policy/samples/not-allowed-resource-types)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.10: Maintain an inventory of approved software titles

**Guidance**: Not applicable; this recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.11: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Configure Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

* [How to configure Conditional Access to block access to Azure Resource Manager](https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.12: Limit users' ability to execute scripts within compute resources

**Guidance**: Not applicable; this recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.13: Physically or logically segregate high risk applications

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. Ensure that all Virtual Network Azure Application Gateway subnet deployments have a network security group (NSG) applied with network access controls specific to your application's trusted ports and sources. While network security groups are supported on Azure Application Gateway, there are some restrictions and requirements that must be adhered to in order for your NSG and Azure Application Gateway to function as expected.

* [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/billing/billing-create-subscription)

* [How to create Management Groups](https://docs.microsoft.com/azure/governance/management-groups/create)

* [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

* [Understand restrictions and requirements around using NSGs with Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/configuration-overview)

* [How to create an NSG with a security configuration](https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Secure configuration

*For more information, see [Security control: Secure configuration](https://docs.microsoft.com/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Define and implement standard security configurations for network settings related to your Azure Application Gateway deployments. Use Azure Policy aliases in the "Microsoft.Network" namespace to create custom policies to audit or enforce the network configuration of your Azure Application Gateways, Azure Virtual Networks, and network security groups. You may also make use of built-in policy definition.

* [How to view available Azure Policy Aliases](https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0)

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.2: Establish secure operating system configurations

**Guidance**: Not applicable; this recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

* [Understand Azure Policy Effects](https://docs.microsoft.com/azure/governance/policy/concepts/effects)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.4: Maintain secure operating system configurations

**Guidance**: Not applicable; this recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.5: Securely store configuration of Azure resources

**Guidance**: If using custom Azure policy definitions, use Azure DevOps or Azure Repos to securely store and manage your code.

* [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops)

* [Azure Repos Documentation](https://docs.microsoft.com/azure/devops/repos/index?view=azure-devops)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.6: Securely store custom operating system images

**Guidance**: Not applicable; this recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Use built-in Azure Policy definitions as well as Azure Policy aliases in the "Microsoft.Network" namespace to create custom policies to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.8: Deploy configuration management tools for operating systems

**Guidance**: Not applicable; this recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Use built-in Azure Policy definitions as well as Azure Policy aliases in the "Microsoft.Network" namespace to create custom policies to alert, audit, and enforce system configurations. Use Azure policy [audit], [deny], and [deploy if not exist] to automatically enforce configurations for your Azure resources.

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.10: Implement automated configuration monitoring for operating systems

**Guidance**: Not applicable; this recommendation is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.11: Manage Azure secrets securely

**Guidance**: Use Managed Identities to provide your Azure Application Gateway with an automatically managed identity in Azure Active Directory (AD). Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code.

Use Azure Key Vault to securely store certificates. Azure Key Vault is a platform-managed secret store that you can use to safeguard secrets, keys, and SSL certificates. Azure Application Gateway supports integration with Key Vault for server certificates that are attached to HTTPS-enabled listeners. This support is limited to the Application Gateway v2 SKU.

* [How to configure SSL termination with Key Vault certificates by using Azure PowerShell](https://docs.microsoft.com/azure/application-gateway/configure-keyvault-ps)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.12: Manage identities securely and automatically

**Guidance**: Use Managed Identities to provide your Azure Application Gateway with an automatically managed identity in Azure Active Directory (AD). Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code.

Use Azure Key Vault to securely store certificates. Azure Key Vault is a platform-managed secret store that you can use to safeguard secrets, keys, and SSL certificates. Azure Application Gateway supports integration with Key Vault for server certificates that are attached to HTTPS-enabled listeners. This support is limited to the Application Gateway v2 SKU.

* [How to configure SSL termination with Key Vault certificates by using Azure PowerShell](https://docs.microsoft.com/azure/application-gateway/configure-keyvault-ps)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.13: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

* [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Malware defense

*For more information, see [Security control: Malware defense](https://docs.microsoft.com/azure/security/benchmarks/security-control-malware-defense).*

### 8.1: Use centrally managed anti-malware software

**Guidance**: Deploy Azure Web Application Firewall (WAF) v2 in front of critical web applications for additional inspection of incoming traffic. Web Application Firewall (WAF) is a service (feature of Azure Application Gateway) that provides centralized protection of your web applications from common exploits and vulnerabilities. Azure WAF can help secure your Azure App Service web apps by inspecting inbound web traffic to block attacks such as SQL injections, Cross-Site Scripting, malware uploads, and DDoS attacks.

Configure diagnostic settings for your Azure Application Gateway deployments. diagnostic settings are used to configure streaming export of platform logs and metrics for a resource to the destination of your choice (Storage Accounts, Event Hubs and Log Analytics).

* [How to deploy Azure WAF](https://docs.microsoft.com/azure/web-application-firewall/ag/create-waf-policy-ag)

* [How to configure diagnostic settings for Azure WAF](https://docs.microsoft.com/azure/application-gateway/application-gateway-diagnostics)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Not applicable; Azure Application Gateway does not store customer data.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 8.3: Ensure anti-malware software and signatures are updated

**Guidance**: When using Azure Web Application Firewall (WAF), you can configure WAF policies. A WAF policy consists of two types of security rules: custom rules that are authored by the customer, and managed rule sets that are a collection of Azure-managed pre-configured set of rules. Azure-managed rule sets provide an easy way to deploy protection against a common set of security threats. Since such rulesets are managed by Azure, the rules are updated as needed to protect against new attack signatures.

* [Understand Azure-managed WAF rule sets](https://docs.microsoft.com/azure/web-application-firewall/ag/ag-overview#waf-policy)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

## Data recovery

*For more information, see [Security control: Data recovery](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure regular automated back ups

**Guidance**: Azure Application Gateway does not store customer data. However, if using custom Azure policy definitions, use Azure DevOps or Azure Repos to securely store and manage your code.

Azure DevOps Services leverages many of the Azure storage features to ensure data availability in the case of hardware failure, service disruption, or region disaster. Additionally, the Azure DevOps team follows procedures to protect data from accidental or malicious deletion.

* [Understand data availability in Azure DevOps](https://docs.microsoft.com/azure/devops/organizations/security/data-protection?view=azure-devops#data-availability)

* [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops)

* [Azure Repos Documentation](https://docs.microsoft.com/azure/devops/repos/index?view=azure-devops)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.2: Perform complete system backups and backup any customer managed keys

**Guidance**: Backup customer managed certificates within Azure Key Vault.

* [How to backup key vault certificates in Azure](https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultcertificate)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.3: Validate all backups including customer managed keys

**Guidance**: Test restoration of backed up customer managed certificates.

* [How to restore key vault certificates](https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultcertificate)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.4: Ensure protection of backups and customer managed keys

**Guidance**: Ensure that soft delete is enabled for Azure Key Vault. Soft delete allows recovery of deleted key vaults and vault objects such as keys, secrets, and certificates.

* [How to use Azure Key Vault's Soft Delete](https://docs.microsoft.com/azure/key-vault/key-vault-soft-delete-powershell)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Incident response

*For more information, see [Security control: Incident response](https://docs.microsoft.com/azure/security/benchmarks/security-control-incident-response).*

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

*For more information, see [Security control: Penetration tests and red team exercises](https://docs.microsoft.com/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

**Guidance**: 

* [Follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1)

* [You can find more information on Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications, here](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Next steps

- See the [Azure security benchmark](https://docs.microsoft.com/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview)
