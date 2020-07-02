---
title: Azure security baseline for Logic Apps
description: Azure security baseline for Logic Apps
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 06/22/2020
ms.author: mbaldwin
ms.custom: security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Logic Apps

The Azure Security Baseline for Logic Apps contains recommendations that will help you improve the security posture of your deployment.

The baseline for this service is drawn from the [Azure Security Benchmark version 1.0](https://docs.microsoft.com/azure/security/benchmarks/overview), which provides recommendations on how you can secure your cloud solutions on Azure with our best practices guidance.

For more information, see the [Azure security baselines overview](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview).

## Network security

*For more information, see [Security control: Network security](https://docs.microsoft.com/azure/security/benchmarks/security-control-network-security).*

### 1.1: Protect Azure resources within virtual networks

**Guidance**: Connectors that run in the "global," multi-tenant Logic Apps service are deployed and managed by Microsoft. These connectors provide triggers and actions for accessing cloud services, on-premises systems, or both, including Office 365, Azure Blob Storage, SQL Server, Dynamics, Salesforce, SharePoint, and more. You can use the AzureConnectors service tag when specifying rules on your network security group or Azure Firewall to allow access to related resources.

For logic apps that need direct access to resources in an Azure virtual network, you can create an integration service environment (ISE) where you can build, deploy, and run your logic apps on dedicated resources. Some Azure virtual networks use private endpoints (Azure Private Link) for providing access to Azure PaaS services, such as Azure Storage, Azure Cosmos DB, Azure SQL Database, partner services, or customer services that are hosted on Azure. If your logic apps need access to virtual networks that use private endpoints, you must create, deploy, and run those logic apps inside an ISE.

When you create your ISE, you can choose to use either internal or external access endpoints. Your selection determines whether request or webhook triggers on logic apps in your ISE can receive calls from outside your virtual network. Internal and external access endpoints also affect whether you can view your logic app's run history, including the inputs and outputs for a run, from inside or outside your virtual network.

Make sure that all virtual network subnet deployments related to your ISE have a network security group applied with network access controls specific to your application's trusted ports and sources. When you deploy your logic apps in an ISE, use Private Link. Azure Private Link enables you to access Azure PaaS Services and Azure hosted customer-owned/partner services over a private endpoint in your virtual network. Alternatively, if you have a specific use case, you can meet this requirement by implementing Azure Firewall. To help reduce complexity when you set up security rules, use service tags that represent groups of IP address prefixes for a specific Azure service.

* [Understand connectors for Logic Apps](https://docs.microsoft.com/azure/connectors/apis-list)

* [Understand service tags in Azure](https://docs.microsoft.com/azure/virtual-network/service-tags-overview)

* [Understand access to Azure Virtual Network resources from Azure Logic Apps by using integration service environments (ISEs)](https://docs.microsoft.com/azure/logic-apps/connect-virtual-network-vnet-isolated-environment-overview)

* [Understand Virtual Network Service Endpoints](https://docs.microsoft.com/azure/virtual-network/virtual-network-service-endpoints-overview)

* [Understand Azure Private Link](https://docs.microsoft.com/azure/private-link/private-link-overview)

* [Understand ISE endpoint access](https://docs.microsoft.com/azure/logic-apps/connect-virtual-network-vnet-isolated-environment-overview#ise-endpoint-access)

* [How to create a Virtual Network](https://docs.microsoft.com/azure/virtual-network/quick-create-portal)

* [How to create an NSG with a security configuration](https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic)

* [How to deploy and configure Azure Firewall](https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal)

* [How to enable access for ISE](https://docs.microsoft.com/azure/logic-apps/connect-virtual-network-vnet-isolated-environment#enable-access-for-ise)

**Azure Security Center monitoring**: N/A

**Responsibility**: Shared

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and NICs

**Guidance**: If you run logic apps in an integration service environment (ISE) that uses an external access point, you can use a network security group (NSG) to reduce the risk of data exfiltration. Enable NSG flow logs and send logs to an Azure Storage Account for traffic audit. You can also send NSG flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

* [Understand ISE endpoint access](https://docs.microsoft.com/azure/logic-apps/connect-virtual-network-vnet-isolated-environment-overview#ise-endpoint-access)

* [How to Enable NSG Flow Logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal)

* [How to Enable and use Traffic Analytics](https://docs.microsoft.com/azure/network-watcher/traffic-analytics)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 1.3: Protect critical web applications

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: Not applicable

### 1.4: Deny communications with known malicious IP addresses

**Guidance**: If your logic app uses a request-based trigger, which receives incoming calls or requests, such as the Request or Webhook trigger, you can limit access so that only authorized clients can call your logic app.

If you are running logic apps in an integration service environment (ISE), enable DDoS Protection Standard on the virtual network associated with your ISE to guard against DDoS attacks. Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious or unused Internet IP addresses.

Deploy Azure Firewall at each of the organization's network boundaries with Threat Intelligence enabled and configured to "Alert and deny" for malicious network traffic.

Use Azure Security Center Just In Time Network access to configure NSGs to limit exposure of endpoints to approved IP addresses for a limited period.

Use Azure Security Center Adaptive Network Hardening to recommend NSG configurations that limit ports and source IPs based on actual traffic and threat intelligence.

* [How to secure inbound calls to Logic Apps](https://docs.microsoft.com/azure/logic-apps/logic-apps-securing-a-logic-app#access-to-request-based-triggers)

* [How to restrict inbound IP addresses](https://docs.microsoft.com/azure/logic-apps/logic-apps-securing-a-logic-app#restrict-inbound-ip-addresses)

* [How to configure DDoS protection](https://docs.microsoft.com/azure/virtual-network/manage-ddos-protection)

* [How to deploy Azure Firewall](https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal)

* [Understand Azure Security Center Integrated Threat Intelligence](https://docs.microsoft.com/azure/security-center/security-center-alerts-service-layer)

* [Understand Azure Security Center Adaptive Network Hardening](https://docs.microsoft.com/azure/security-center/security-center-adaptive-network-hardening)

* [Understand Azure Security Center Just In Time Network Access Control](https://docs.microsoft.com/azure/security-center/security-center-just-in-time)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 1.5: Record network packets

**Guidance**: If you are run logic apps in an integration service environment (ISE) that uses an external access point, you can use a network security group (NSG) to reduce the risk of data exfiltration. Enable NSG flow logs and send logs to an Azure Storage Account for traffic audit. You can also send NSG flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

To provide further protection and information on network traffic, you can refer to access logs, which are generated only if you've enabled them on each Application Gateway instance. You can use this log to view Application Gateway access patterns and analyze important information. This includes the caller's IP, requested URL, response latency, return code, and bytes in and out.

Otherwise, you can leverage a third-party solution from the marketplace to satisfy this requirement.

* [Understand ISE endpoint access](https://docs.microsoft.com/azure/logic-apps/connect-virtual-network-vnet-isolated-environment-overview#ise-endpoint-access)

* [How to Enable NSG Flow Logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal)

* [How to Enable and use Traffic Analytics](https://docs.microsoft.com/azure/network-watcher/traffic-analytics)

* [How to Integrate API Management in an internal VNET with Application Gateway](https://docs.microsoft.com/azure/api-management/api-management-howto-integrate-internal-vnet-appgateway)

* [How to understand WAF access logs](https://docs.microsoft.com/azure/web-application-firewall/ag/web-application-firewall-logs#access-log)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Select an offer from the Azure Marketplace that supports IDS/IPS functionality with payload inspection capabilities. If intrusion detection and/or prevention based on payload inspection is not a requirement, Azure Firewall with Threat Intelligence can be used. Azure Firewall Threat intelligence-based filtering can alert and deny traffic to and from known malicious IP addresses and domains. The IP addresses and domains are sourced from the Microsoft Threat Intelligence feed.

Deploy the firewall solution of your choice at each of your organization's network boundaries to detect and/or deny malicious traffic.

* [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/?term=Firewall)

* [How to deploy Azure Firewall](https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal)

* [How to configure alerts with Azure Firewall](https://docs.microsoft.com/azure/firewall/threat-intel)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 1.7: Manage traffic to web applications

**Guidance**: If you are running logic apps in an integration service environment (ISE), deploy Azure Application Gateway.

* [How to integrate API Management in an internal VNET with Application Gateway](https://docs.microsoft.com/azure/api-management/api-management-howto-integrate-internal-vnet-appgateway)

* [How to configure Application Gateway to use HTTPS](https://docs.microsoft.com/azure/application-gateway/create-ssl-portal)

* [Understand layer 7 load balancing with Azure web application gateways](https://docs.microsoft.com/azure/application-gateway/overview)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: For resources that need access to your Azure Logic Apps instances, use virtual network service tags to define network access controls on network security groups or Azure Firewall. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., LogicApps, LogicAppsManagement) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

* [For more information about using service tags](https://docs.microsoft.com/azure/virtual-network/service-tags-overview)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement standard security configurations for network resources related to your Azure Logic Apps instances with Azure Policy. Use Azure Policy aliases in the "Microsoft.Logic" and "Microsoft.Network" namespaces to create custom policies to audit or enforce the network configuration of your Azure Logic apps instances. You may also make use of built-in policy definitions such as:

Diagnostic logs in Logic Apps should be enabled

DDoS Protection Standard should be enabled

You may also use Azure Blueprints to simplify large-scale Azure deployments by packaging key environment artifacts, such as Azure Resource Manager templates, role-based access control (RBAC), and policies, in a single blueprint definition. Easily apply the blueprint to new subscriptions and environments, and fine-tune control and management through versioning.

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

* [How to create an Azure Blueprint](https://docs.microsoft.com/azure/governance/blueprints/create-blueprint-portal)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 1.10: Document traffic configuration rules

**Guidance**: For individual NSG rules, use the "Description" field to specify business need and/or duration (etc.) for any rules that allow traffic to/from a network.

Use any of the built-in Azure Policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with Tags and to notify you of existing untagged resources.

You may use Azure PowerShell or Azure CLI to look-up or perform actions on resources based on their Tags.

* [How to create and use Tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

* [How to create a Virtual Network](https://docs.microsoft.com/azure/virtual-network/quick-create-portal)

* [How to create an NSG with a Security Config](https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic)

* [List of Azure Policy definitions for Logic Apps](https://docs.microsoft.com/azure/logic-apps/policy-samples)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use the Azure Activity log to monitor network resource configurations and detect changes for network resources related to your Azure Logic Apps instances. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place.

* [How to view and retrieve Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view)

* [How to create alerts in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

## Logging and monitoring

*For more information, see [Security control: Logging and monitoring](https://docs.microsoft.com/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.1: Use approved time synchronization sources

**Guidance**: Microsoft maintains the time source used for Azure resources such as Azure Logic Apps for timestamps in the logs.

**Azure Security Center monitoring**: N/A

**Responsibility**: Microsoft

### 2.2: Configure central security log management

**Guidance**: To get richer debugging information about your logic apps during runtime, you can set up and use Azure Monitor logs to record and store information about runtime data and events, such as trigger events, run events, and action events in a Log Analytics workspace. Azure Monitor helps you monitor your cloud and on-premises environments so that you can more easily maintain their availability and performance. By using Azure Monitor logs, you can create log queries that help you collect and review this information. You can also use this diagnostics data with other Azure services, such as Azure Storage and Azure Event Hubs.

Alternatively, you may enable and on-board data to Azure Sentinel or a third-party SIEM.

* [How to enable Diagnostic Settings for Azure Activity Log](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings-legacy)

* [How to set up Azure Monitor logs and collect diagnostics data for Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/monitor-logic-apps-log-analytics)

* [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

**Guidance**: To get richer debugging information about your logic apps during runtime, you can set up and use Azure Monitor logs to record and store information about runtime data and events, such as trigger events, run events, and action events in a Log Analytics workspace. Azure Monitor helps you monitor your cloud and on-premises environments so that you can more easily maintain their availability and performance. By using Azure Monitor logs, you can create log queries that help you collect and review this information. You can also use this diagnostics data with other Azure services, such as Azure Storage and Azure Event Hubs.

Alternatively, you may enable and on-board data to Azure Sentinel or a third-party SIEM.

* [How to enable Diagnostic Settings for Azure Activity Log](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings-legacy)

* [How to set up Azure Monitor logs and collect diagnostics data for Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/monitor-logic-apps-log-analytics)

* [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 2.4: Collect security logs from operating systems

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: Not applicable

### 2.5: Configure security log storage retention

**Guidance**: After you create and run a logic app, you can check that logic app's run status, runs history, trigger history, and performance. For real-time event monitoring and richer debugging, set up diagnostics logging for your logic app by using Azure Monitor logs. This Azure service helps you monitor your cloud and on-premises environments so that you can more easily maintain their availability and performance. You can then find and view events, such as trigger events, run events, and action events. By storing this information in Azure Monitor logs, you can create log queries that help you find and analyze this information. You can also use this diagnostic data with other Azure services, such as Azure Storage and Azure Event Hubs.

In Azure Monitor, set log retention period for logs associated with your Azure Logic Apps instances according to your organization's compliance regulations.

* [How to monitor run status, review trigger history, and set up alerts for Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/monitor-logic-apps)

* [How to set log retention parameters](https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 2.6: Monitor and review Logs

**Guidance**: To set up logging for your logic app, you can enable Log Analytics when you create your logic app, or you can install the Logic Apps Management solution in your Log Analytics workspace for existing logic apps. This solution provides aggregated information for your logic app runs and includes specific details such as status, execution time, resubmission status, and correlation IDs. Then, to enable logging and creating queries for this information, set up Azure Monitor logs.

You can also enable Azure Activity Log diagnostic settings and send the logs to a Log Analytics workspace. Perform queries in Log Analytics to search terms, identify trends, analyze patterns, and provide many other insights based on the Activity Log Data that may have been collected for Azure Logic Apps.

Alternatively, you may enable and on-board data to Azure Sentinel or a third-party SIEM.

* [How to set up Azure Monitor logs and collect diagnostics data for Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/monitor-logic-apps-log-analytics)

* [How to enable Diagnostic Settings for Azure Activity Log](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings-legacy)

* [How to collect and analyze Azure activity logs in Log Analytics in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-collect)

* [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activities

**Guidance**: Use Azure Security Center with Log Analytics for monitoring and alerting on anomalous activity found in security logs and events.

Alternatively, you may enable and on-board data to Azure Sentinel.

* [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

* [How to manage alerts in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-managing-and-responding-alerts)

* [How to alert on log analytics log data](https://docs.microsoft.com/azure/azure-monitor/learn/tutorial-response)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 2.8: Centralize anti-malware logging

**Guidance**: Not applicable; Azure Logic Apps does not process or produce anti-malware related logs.

**Azure Security Center monitoring**: N/A

**Responsibility**: Not applicable

### 2.9: Enable DNS query logging

**Guidance**: Not applicable; Azure Logic Apps does not process or produce DNS related logs.

**Azure Security Center monitoring**: N/A

**Responsibility**: Not applicable

### 2.10: Enable command-line audit logging

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: Not applicable

## Identity and access control

*For more information, see [Security control: Identity and access control](https://docs.microsoft.com/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Azure Active Directory (AD) has built-in roles that must be explicitly assigned and are queryable. Use the Azure AD PowerShell module to perform ad hoc queries to discover accounts that are members of administrative groups.

To easily access other resources that are protected by Azure Active Directory (Azure AD) and authenticate your identity without signing in, your logic app can use a managed identity (formerly Managed Service Identity or MSI), rather than credentials or secrets. Azure manages this identity for you and helps secure your credentials because you don't have to provide or rotate secrets.

Every request endpoint on a logic app has a Shared Access Signature (SAS) in the endpoint's URL. If you share the endpoint URL for a request-based trigger with other parties, you can generate callback URLs that use specific keys and have expiration dates. That way, you can seamlessly roll keys or restrict access to triggering your logic app based on a specific timespan.

* [How to get a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0)

* [Authenticate access to Azure resources by using managed identities in Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/create-managed-service-identity)

* [How to get members of a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0)

* [How to secure access and data in Azure Logic Apps using SAS](https://docs.microsoft.com/azure/logic-apps/logic-apps-securing-a-logic-app#access-to-request-based-triggers)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 3.2: Change default passwords where applicable

**Guidance**: Azure Active Directory and Azure Logic Apps do not have the concept of default passwords.

If basic authentication is being used, you will need to specify a username and password. When creating these credentials, ensure that you configure a strong password for authentication.

If you are using Infrastructure as Code, avoid storing passwords in code and instead use Azure Key Vault to store and retrieve credentials.

* [How to secure and access data in Logic Apps](https://docs.microsoft.com/azure/logic-apps/logic-apps-securing-a-logic-app)

* [How to set and retrieve a secret from Azure Key Vault](https://docs.microsoft.com/azure/key-vault/secrets/quick-create-portal)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 3.3: Use dedicated administrative accounts

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts. Use Azure Security Center Identity and Access Management to monitor the number of administrative accounts.

Additionally, to help you keep track of dedicated administrative accounts, you may use recommendations from Azure Security Center or built-in Azure Policies, such as:
- There should be more than one owner assigned to your subscription
- Deprecated accounts with owner permissions should be removed from your subscription
- External accounts with owner permissions should be removed from your subscription

* [How to use Azure Security Center to monitor identity and access (Preview)](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

* [How to use Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 3.4: Use single sign-on (SSO) with Azure Active Directory

**Guidance**: Use an Azure app registration (service principal) to retrieve a token that can be used to interact with your Recovery Services vaults via API calls.

Many connectors also require that you first create a connection to the target service or system and provide authentication credentials or other configuration details before you can use a trigger or action in your logic app. For example, you must authorize a connection to a Twitter account for accessing data or to post on your behalf.]

For connectors that use Azure Active Directory (Azure AD) OAuth, creating a connection means signing into the service, such as Office 365, Salesforce, or GitHub, where your access token is encrypted and securely stored in an Azure secret store. Other connectors, such as FTP and SQL, require a connection that has configuration details, such as the server address, username, and password. These connection configuration details are also encrypted and securely stored.

* [How to call Azure REST APIs](https://docs.microsoft.com/rest/api/azure/#how-to-call-azure-rest-apis-with-postman)

* [How to register your client application (service principal) with Azure AD](https://docs.microsoft.com/rest/api/azure/#register-your-client-application-with-azure-ad)

* [Workflow Triggers API information](https://docs.microsoft.com/rest/api/logic/workflowtriggers)

* [Understand connector configuration](https://docs.microsoft.com/azure/connectors/apis-list])

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

**Guidance**: Enable Azure Active Directory (AD) Multi-Factor Authentication (MFA) and follow Azure Security Center Identity and Access Management recommendations.

* [How to enable MFA in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

* [How to monitor identity and access within Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

**Guidance**: Use privileged access workstations (PAW) with Multi-Factor Authentication (MFA) configured to log into and configure Azure resources.

* [Learn about Privileged Access Workstations](https://docs.microsoft.com/windows-server/identity/securing-privileged-access/privileged-access-workstations)

* [How to enable MFA in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 3.7: Log and alert on suspicious activities from administrative accounts

**Guidance**: Use Azure Active Directory (AD) Privileged Identity Management (PIM) for generation of logs and alerts when suspicious or unsafe activity occurs in the environment.

In addition, use Azure AD risk detections to view alerts and reports on risky user behavior.

* [How to deploy Privileged Identity Management (PIM)](https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-deployment-plan)

* [Understand Azure AD risk detections](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risk-events)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 3.8: Manage Azure resources from only approved locations

**Guidance**: Use Conditional Access Named Locations to allow access to the Azure portal from only specific logical groupings of IP address ranges or countries/regions.

Additionally, every request endpoint on a logic app has a Shared Access Signature (SAS) in the endpoint's URL. You can restrict your logic app to accept requests only from certain IP addresses.

* [How to configure Named Locations in Azure](https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations)

* [Understand how to restrict inbound IP addresses in Logic Apps](https://docs.microsoft.com/azure/logic-apps/logic-apps-securing-a-logic-app#restrict-inbound-ip-addresses)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory (AD) as the central authentication and authorization system for your Azure Logic Apps instances. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.

Where there is support in Logic Apps, use a managed identity to easily access other resources that are protected by Azure Active Directory (Azure AD) and authenticate your identity without signing in, rather than credentials or secrets. Azure manages this identity for you and helps secure your credentials because you don't have to provide or rotate secrets.

Azure Logic Apps supports both system-assigned and user-assigned managed identities. Your logic app can use either the system-assigned identity or a single user-assigned identity, which you can share across a group of logic apps, but not both. Currently, only specific built-in triggers and actions support managed identities, not managed connectors or connections, for example:
- HTTP
- Azure Functions
- Azure API Management
- Azure App Services

* [How to create and configure an Azure AD instance](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-access-create-new-tenant)

* [Authenticate access to Azure resources by using managed identities in Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/create-managed-service-identity)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 3.10: Regularly review and reconcile user access

**Guidance**: Azure Active Directory (AD) provides logs to help you discover stale accounts. In addition, use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access can be reviewed on a regular basis to make sure only the right Users have continued access.

* [Understand Azure AD reporting](https://docs.microsoft.com/azure/active-directory/reports-monitoring/)

* [How to use Azure Identity Access Reviews](https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 3.11: Monitor attempts to access deactivated credentials

**Guidance**: Use Azure Active Directory (AD) as the central authentication and authorization system for your Azure Logic Apps instances. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.

You have access to Azure AD sign-in activity, audit and risk event log sources, which allow you to integrate with Azure Sentinel or a third-party SIEM.

You can streamline this process by creating diagnostic settings for Azure AD user accounts and sending the audit logs and sign-in logs to a Log Analytics workspace. You can configure desired log alerts within Log Analytics.

* [How to integrate Azure Activity Logs into Azure Monitor](https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)

* [How to on-board Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 3.12: Alert on account login behavior deviation

**Guidance**: Use Azure AD Risk and Identity Protection features to configure automated responses to detected suspicious actions related to user identities. You can also ingest data into Azure Sentinel for further investigation.

* [How to view Azure AD risky sign-ins](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risky-sign-ins)

* [How to configure and enable Identity Protection risk policies](https://docs.microsoft.com/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies)

* [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

**Guidance**: Currently not available; Customer Lockbox is not yet supported for Azure Logic Apps.

* [List of Customer Lockbox-supported services](https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview#supported-services-and-scenarios-in-general-availability)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

## Data protection

*For more information, see [Security control: Data protection](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags to assist in tracking Azure resources that store or process sensitive information.

* [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Connectors that run in the "global," multi-tenant Logic Apps service are deployed and managed by Microsoft. These connectors provide triggers and actions for accessing cloud services, on-premises systems, or both, including Office 365, Azure Blob Storage, SQL Server, Dynamics, Salesforce, SharePoint, and more.

For logic apps that need direct access to resources in an Azure virtual network, you can create an integration service environment (ISE) where you can build, deploy, and run your logic apps on dedicated resources. Some Azure virtual networks use private endpoints (Azure Private Link) for providing access to Azure PaaS services, such as Azure Storage, Azure Cosmos DB, or Azure SQL Database, partner services, or customer services that are hosted on Azure. If your logic apps need access to virtual networks that use private endpoints, you must create, deploy, and run those logic apps inside an ISE.

When you create your ISE, you can choose to use either internal or external access endpoints. Your selection determines whether request or webhook triggers on logic apps in your ISE can receive calls from outside your virtual network.

Additionally, implement isolation using separate subscriptions and management groups for individual security domains such as environment type and data sensitivity level. You can restrict the level of access to your Azure resources that your applications and enterprise environments demand. You can control access to Azure resources via Azure role-based access control (Azure RBAC).

* [Understand connectors for Logic Apps](https://docs.microsoft.com/azure/connectors/apis-list)

* [Access to Azure Virtual Network resources from Azure Logic Apps by using integration service environments (ISEs)](https://docs.microsoft.com/azure/logic-apps/connect-virtual-network-vnet-isolated-environment-overview)

* [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/billing/billing-create-subscription)

* [How to create Management Groups](https://docs.microsoft.com/azure/governance/management-groups/create)

* [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: Currently not available; data identification, classification, and loss prevention features are not yet available for Azure Logic Apps.

Leverage a third-party solution from Azure Marketplace on network perimeters that monitors for unauthorized transfer of sensitive information and blocks such transfers while alerting information security professionals.

Microsoft manages the underlying infrastructure for Azure Logic Apps and has implemented strict controls to prevent the loss or exposure of customer data.

* [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

**Azure Security Center monitoring**: N/A

**Responsibility**: Shared

### 4.4: Encrypt all sensitive information in transit

**Guidance**: Encrypt all sensitive information in transit. In Azure Logic Apps, all the data during a logic app run is encrypted during transit by using Transport Layer Security (TLS) and at rest. When you view your logic app's run history, Logic Apps authenticates your access and then provides links to the inputs and outputs for the requests and responses for each run. However, for actions that handle any passwords, secrets, keys, or other sensitive information, you want to prevent others from viewing and accessing that data. For example, if your logic app gets a secret from Azure Key Vault to use when authenticating an HTTP action, you want to hide that secret from view.

The Request trigger supports only Transport Layer Security (TLS) 1.2 for inbound requests. Make sure that any clients connecting to your Azure resources are able to negotiate TLS 1.2 or greater. Outbound calls using the HTTP connector support Transport Layer Security (TLS) 1.0, 1.1, and 1.2.

Follow Azure Security Center recommendations for encryption at rest and encryption in transit, where applicable.

* [Secure access and data in Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/logic-apps-securing-a-logic-app)

* [Receive and respond to inbound HTTPS requests in Azure Logic Apps](https://docs.microsoft.com/azure/connectors/connectors-native-reqres#tls-support)

* [Call service endpoints over HTTP or HTTPS from Azure Logic Apps](https://docs.microsoft.com/azure/connectors/connectors-native-http#tls-support)

* [Understand encryption in transit with Azure](https://docs.microsoft.com/azure/security/fundamentals/encryption-overview#encryption-of-data-in-transit)

* [Understand data encryption-at-rest with Azure](https://docs.microsoft.com/azure/security/fundamentals/encryption-atrest)

* [Set up customer-managed keys to encrypt data at rest for integration service environments (ISEs) in Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/customer-managed-keys-integration-service-environment)

**Azure Security Center monitoring**: N/A

**Responsibility**: Shared

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: In Azure Logic Apps, many triggers and actions have settings that you can enable to secure inputs, outputs, or both by obscuring that data from a logic app's run history.

Microsoft manages the underlying infrastructure for Azure Logic Apps and has implemented strict controls to prevent the loss or exposure of customer data.

* [Secure access to run history data](https://docs.microsoft.com/azure/logic-apps/logic-apps-securing-a-logic-app#access-to-run-history-data)

* [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

**Azure Security Center monitoring**: N/A

**Responsibility**: Shared

### 4.6: Use Role-based access control to control access to resources

**Guidance**: You can permit only specific users or groups to run specific tasks, such as managing, editing, and viewing logic apps. To control their permissions, use Azure Role-Based Access Control (RBAC) so that you can assign customized or built-in roles to the members in your Azure subscription:
- Logic App Contributor: Lets you manage logic apps, but you can't change access to them.
- Logic App Operator: Lets you read, enable, and disable logic apps, but you can't edit or update them.

To prevent others from changing or deleting your logic app, you can use Azure Resource Lock. This capability prevents others from changing or deleting production resources.

* [Secure access to Azure Logic Apps operations](https://docs.microsoft.com/azure/logic-apps/logic-apps-securing-a-logic-app#access-to-logic-app-operations)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 4.7: Use host-based data loss prevention to enforce access control

**Guidance**: Not applicable; this recommendation is intended for compute resources. Microsoft manages the underlying infrastructure for Azure Logic Apps and has implemented strict controls to prevent the loss or exposure of customer data.

* [Azure customer data protection](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

**Azure Security Center monitoring**: N/A

**Responsibility**: Microsoft

### 4.8: Encrypt sensitive information at rest

**Guidance**: Azure Logic Apps relies on Azure Storage to store and automatically encrypt data at rest. This encryption protects your data and helps you meet your organizational security and compliance commitments. By default, Azure Storage uses Microsoft-managed keys to encrypt your data.

When you create an integration service environment (ISE) for hosting your logic apps, and you want more control over the encryption keys used by Azure Storage, you can set up, use, and manage your own key by using Azure Key Vault. This capability is also known as "Bring Your Own Key" (BYOK), and your key is called a "customer-managed key".

* [Encrypt data at rest for integration service environments in Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/customer-managed-keys-integration-service-environment)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with the Azure Activity log to create alerts for when changes take place in Azure Logic Apps as well as other critical or related resources.

* [How to create alerts for Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

## Vulnerability management

*For more information, see [Security control: Vulnerability management](https://docs.microsoft.com/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: [Not applicable; Microsoft performs vulnerability management on the underlying systems that support Azure Logic Apps.]

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 5.2: Deploy automated operating system patch management solution

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 5.3: Deploy automated patch management solution for third-party software titles

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 5.4: Compare back-to-back vulnerability scans

**Guidance**: Not applicable; Microsoft performs vulnerability management on the underlying systems that support Azure Logic Apps.

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

**Guidance**: Not applicable; Microsoft performs vulnerability management on the underlying systems that support Azure Logic Apps.

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

## Inventory and asset management

*For more information, see [Security control: Inventory and asset management](https://docs.microsoft.com/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use automated Asset Discovery solution

**Guidance**: Use Azure Resource Graph to query/discover all resources (such as compute, storage, network, ports, and protocols etc.) within your subscription(s). Ensure appropriate (read) permissions in your tenant and enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Resource Graph, it is highly recommended that you create and use Azure Resource Manager resources going forward.

* [How to create queries with Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

* [How to view your Azure Subscriptions](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0)

* [Understand Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/overview)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

* [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track Azure resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

In addition, use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:
- Not allowed resource types
- Allowed resource types

* [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/billing/billing-create-subscription)

* [How to create Management Groups](https://docs.microsoft.com/azure/governance/management-groups/create)

* [How to create and use Tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 6.4: Define and Maintain an inventory of approved Azure resources

**Guidance**: Create an inventory of approved Azure resources (such as connectors) and approved software for compute resources as per your organizational needs.

Note: Due to Google's data and privacy policies, you can use the Gmail connector only with Google-approved services. This situation is evolving and might affect other Google connectors in the future.

* [List of all Logic Apps connectors](https://docs.microsoft.com/connectors/connector-reference/connector-reference-logicapps-connectors)

* [Understand issues and limitations for Gmail connectors](https://docs.microsoft.com/connectors/gmail/#known-issues-and-limitations)

* [More information on Google's privacy policy](https://docs.microsoft.com/azure/connectors/connectors-google-data-security-privacy-policy)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in your subscription(s).

Use Azure Resource Graph to query/discover resources within their subscription(s). Ensure that all Azure resources present in the environment are approved.

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

* [How to create queries with Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 6.6: Monitor for unapproved software applications within compute resources

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 6.7: Remove unapproved Azure resources and software applications

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 6.8: Use only approved applications

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 6.9: Use only approved Azure services

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:
- Not allowed resource types
- Allowed resource types

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

* [How to deny a specific resource type with Azure Policy](https://docs.microsoft.com/azure/governance/policy/samples/not-allowed-resource-types)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 6.10: Maintain an inventory of approved software titles

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 6.11: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Configure Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

* [How to configure Conditional Access to block access to Azure Resource Manager](https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 6.12: Limit users' ability to execute scripts within compute resources

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 6.13: Physically or logically segregate high risk applications

**Guidance**: Resources related to your Logic Apps that are required for business operations, but may incur higher risk for the organization, should be isolated within its own virtual machine and/or virtual network and sufficiently secured with either an Azure Firewall or Network Security Group.

Logic Apps that are required for business operations, but may incur higher risk for the organization, should be isolated wherever possible via separate resource groups with specific permissions and RBAC boundaries.

* [How to create a virtual network](https://docs.microsoft.com/azure/virtual-network/quick-create-portal)

* [How to create an NSG with a security config](https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic)

* [How to create Management Groups](https://docs.microsoft.com/azure/governance/management-groups/create)

* [How to secure access to Logic Apps via RBAC](https://docs.microsoft.com/azure/logic-apps/logic-apps-securing-a-logic-app#access-to-logic-app-operations)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

## Secure configuration

*For more information, see [Security control: Secure configuration](https://docs.microsoft.com/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Define and implement standard security configurations for your Azure Logic Apps instances with Azure Policy. Use Azure Policy aliases in the "Microsoft.Logic" namespace to create custom policies to audit or enforce the configuration of your Logic Apps instances. For example, you can block others from creating or using connections to resources where you want to restrict access.

Additionally, Azure Resource Manager has the ability to export the template in JavaScript Object Notation (JSON), which should be reviewed to ensure that the configurations meet / exceed the security requirements for your organization.

Also, use secured parameters to protect sensitive data and secrets.

* [How to view available Azure Policy Aliases](https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0)

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

* [Block connections created by connectors in Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/block-connections-connectors)

* [Single and multi-resource export to a template in Azure portal](https://docs.microsoft.com/azure/azure-resource-manager/templates/export-template-portal)

* [How to deploy Azure Resource Manager templates for Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/logic-apps-deploy-azure-resource-manager-templates)

* [Understand secure action parameters](https://docs.microsoft.com/azure/logic-apps/logic-apps-securing-a-logic-app#secure-action-parameters)

* [Security recommendations for parameters](https://docs.microsoft.com/azure/azure-resource-manager/templates/template-best-practices#security-recommendations-for-parameters)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 7.2: Establish secure operating system configurations

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.

Define and implement standard security configurations for your Azure Logic Apps instances with Azure Policy. Use Azure Policy aliases in the "Microsoft.Logic" namespace to create custom policies to audit or enforce the configuration of your Logic Apps instances. For example, you can block others from creating or using connections to resources where you want to restrict access.

Additionally, Azure Resource Manager has the ability to export the template in JavaScript Object Notation (JSON), which should be reviewed to ensure that the configurations meet / exceed the security requirements for your organization.

Also, ensure that you secure data in run history by using obfuscation.

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

* [Understand Azure Policy Effects](https://docs.microsoft.com/azure/governance/policy/concepts/effects)

* [Block connections created by connectors in Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/block-connections-connectors)

* [Single and multi-resource export to a template in Azure portal](https://docs.microsoft.com/azure/azure-resource-manager/templates/export-template-portal)

* [How to deploy Azure Resource Manager templates for Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/logic-apps-deploy-azure-resource-manager-templates)

* [Secure access to run history inputs and outputs](https://docs.microsoft.com/azure/logic-apps/logic-apps-securing-a-logic-app#obfuscate)

* [Secure access to parameter inputs](https://docs.microsoft.com/azure/logic-apps/logic-apps-securing-a-logic-app#secure-action-parameters)

* [Security recommendations for parameters](https://docs.microsoft.com/azure/azure-resource-manager/templates/template-best-practices#security-recommendations-for-parameters)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 7.4: Maintain secure operating system configurations

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: Shared

### 7.5: Securely store configuration of Azure resources

**Guidance**: If using custom Azure Policy definitions, use Azure DevOps or Azure Repos to securely store and manage your code.

Additionally, Azure Resource Manager has the ability to export the template in JavaScript Object Notation (JSON), which should be reviewed to ensure that the configurations meet / exceed the security requirements for your organization.

* [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops)

* [Azure Repos Documentation](https://docs.microsoft.com/azure/devops/repos/index?view=azure-devops)

* [Single and multi-resource export to a template in Azure portal](https://docs.microsoft.com/azure/azure-resource-manager/templates/export-template-portal)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 7.6: Securely store custom operating system images

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Use built-in Azure Policy definitions as well as Azure Policy aliases in the "Microsoft.Logic" namespace to create custom policies to alert, audit, and enforce system configurations. Use Azure Policy aliases to create custom policies to audit or enforce the network configuration of your Azure resources. Additionally, develop a process and pipeline for managing policy exceptions.

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 7.8: Deploy configuration management tools for operating systems

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Use built-in Azure Policy definitions as well as Azure Policy aliases in the "Microsoft.Logic" namespace to create custom policies to alert, audit, and enforce system configurations. Use Azure Policy [audit], [deny], and [deploy if not exist] to automatically enforce configurations for your Azure resources.

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 7.10: Implement automated configuration monitoring for operating systems

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 7.11: Manage Azure secrets securely

**Guidance**: Secure inputs and outputs in logic app run history by using obfuscation. If you deploy across different environments, consider parameterizing the values in your logic app's workflow definition that vary based on those environments. That way, you can avoid hard-coded data by using an Azure Resource Manager template to deploy your logic app, protect sensitive data by defining secured parameters, and pass that data as separate inputs through the template's parameters by using a parameter file. You can use Key Vault to store sensitive data and use secured template parameters that retrieve those values from Key Vault at deployment. You can then reference the key vault and secrets in your parameter file.

When you create an integration service environment (ISE) for hosting your logic apps, and you want more control over the encryption keys used by Azure Storage, you can set up, use, and manage your own key by using Azure Key Vault. This capability is also known as "Bring Your Own Key" (BYOK), and your key is called a "customer-managed key".

* [Secure inputs and outputs in run history in Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/logic-apps-securing-a-logic-app#obfuscate)

* [Security recommendations for parameters](https://docs.microsoft.com/azure/azure-resource-manager/templates/template-best-practices#security-recommendations-for-parameters)

* [Secure access to parameter inputs in Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/logic-apps-securing-a-logic-app#access-to-parameter-inputs)

* [Pass secure parameter values during deployment using Azure Key Vault](https://docs.microsoft.com/azure/azure-resource-manager/templates/key-vault-parameter)

* [Set up customer-managed keys to encrypt data at rest for integration service environments (ISEs) in Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/customer-managed-keys-integration-service-environment)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 7.12: Manage identities securely and automatically

**Guidance**: To easily access other resources that are protected by Azure Active Directory (Azure AD) and authenticate your identity without signing in, your logic app can use a managed identity (formerly Managed Service Identity or MSI), rather than credentials or secrets. Azure manages this identity for you and helps secure your credentials because you don't have to provide or rotate secrets.

Currently, only specific built-in triggers and actions support managed identities, not managed connectors or connections, for example:
- HTTP
- Azure Functions
- Azure API Management
- Azure App Services

* [How to authenticate access to Azure resources by using managed identities in Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/create-managed-service-identity)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 7.13: Eliminate unintended credential exposure

**Guidance**: Secure inputs and outputs in logic app run history by using obfuscation. If you deploy across different environments, consider parameterizing the values in your logic app's workflow definition that vary based on those environments. That way, you can avoid hard-coded data by using an Azure Resource Manager template to deploy your logic app, protect sensitive data by defining secured parameters, and pass that data as separate inputs through the template's parameters by using a parameter file. You can use Key Vault to store sensitive data and use secured template parameters that retrieve those values from Key Vault at deployment. You can then reference the key vault and secrets in your parameter file.

You can also implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

* [Secure inputs and outputs in run history in Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/logic-apps-securing-a-logic-app#obfuscate)

* [Security recommendations for parameters](https://docs.microsoft.com/azure/azure-resource-manager/templates/template-best-practices#security-recommendations-for-parameters)

* [Secure access to parameter inputs in Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/logic-apps-securing-a-logic-app#access-to-parameter-inputs)

* [Pass secure parameter values during deployment using Azure Key Vault](https://docs.microsoft.com/azure/azure-resource-manager/templates/key-vault-parameter)

* [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

## Malware defense

*For more information, see [Security control: Malware defense](https://docs.microsoft.com/azure/security/benchmarks/security-control-malware-defense).*

### 8.1: Use centrally managed anti-malware software

**Guidance**: Not applicable; this recommendation is intended for compute resources. Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure Logic Apps), however it does not run on customer content.

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Microsoft Anti-malware is enabled on the underlying host that supports Azure services (for example, Azure Backup), however it does not run on your content.

Pre-scan any files being uploaded to non-compute Azure resources, such as App Service, Data Lake Storage, Blob Storage, etc.

Use Azure Security Center's Threat detection for data services to detect malware uploaded to storage accounts.

* [Understand Microsoft Anti-malware for Azure Cloud Services and Virtual Machines](https://docs.microsoft.com/azure/security/fundamentals/antimalware)

* [Understand Azure Security Center's Threat detection for data services](https://docs.microsoft.com/azure/security-center/security-center-alerts-data-services)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 8.3: Ensure anti-malware software and signatures are updated

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

## Data recovery

*For more information, see [Security control: Data recovery](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure regular automated back ups

**Guidance**: Implement a disaster recovery (DR) solution in place so that you can protect data, quickly restore the resources that support critical business functions, and keep operations running to maintain business continuity (BC).

This disaster recovery strategy focuses on setting up your primary logic app to failover onto a standby or backup logic app in an alternate location where Azure Logic Apps is also available. That way, if the primary suffers losses, disruptions, or failures, the secondary can take on the work. This strategy requires that your secondary logic app and dependent resources are already deployed and ready in the alternate location.

Additionally, you should expand your logic app's underlying workflow definition into an Azure Resource Manager template. This template defines the infrastructure, resources, parameters, and other information for provisioning and deploying your logic app.

* [Learn more about business continuity and disaster recovery for Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/business-continuity-disaster-recovery-guidance)

* [How to automate deployment for Azure Logic Apps by using Azure Resource Manager templates](https://docs.microsoft.com/azure/logic-apps/logic-apps-azure-resource-manager-templates-overview)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 9.2: Perform complete system backups and backup any customer-managed keys

**Guidance**: Implement a disaster recovery (DR) solution in place so that you can protect data, quickly restore the resources that support critical business functions, and keep operations running to maintain business continuity (BC).

This disaster recovery strategy focuses on setting up your primary logic app to failover onto a standby or backup logic app in an alternate location where Azure Logic Apps is also available. That way, if the primary suffers losses, disruptions, or failures, the secondary can take on the work. This strategy requires that your secondary logic app and dependent resources are already deployed and ready in the alternate location.

Additionally, you should expand your logic app's underlying workflow definition into an Azure Resource Manager template. This template defines the infrastructure, resources, parameters, and other information for provisioning and deploying your logic app.

Every request endpoint on a logic app has a Shared Access Signature (SAS) in the endpoint's URL. If you are using Azure Key Vault to store your secrets, ensure regular automated backups of your keys and URLs.

* [Learn more about business continuity and disaster recovery for Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/business-continuity-disaster-recovery-guidance)

* [How to automate deployment for Azure Logic Apps by using Azure Resource Manager templates](https://docs.microsoft.com/azure/logic-apps/logic-apps-azure-resource-manager-templates-overview)

* [How to secure access and data in Azure Logic Apps using SAS](https://docs.microsoft.com/azure/logic-apps/logic-apps-securing-a-logic-app#access-to-request-based-triggers)

* [How to backup Key Vault Keys](https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 9.3: Validate all backups including customer-managed keys

**Guidance**: Your disaster recovery strategy should focus on setting up your primary logic app to failover onto a standby or backup logic app in an alternate location where Azure Logic Apps is also available. That way, if the primary suffers losses, disruptions, or failures, the secondary can take on the work. This strategy requires that your secondary logic app and dependent resources are already deployed and ready in the alternate location.

Test restoration of backed up customer-managed keys. Note that this applies to Logic Apps running on integration service environments (ISE) only.

* [Learn more about business continuity and disaster recovery for Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/business-continuity-disaster-recovery-guidance)

* [Set up customer-managed keys to encrypt data at rest for integration service environments (ISEs) in Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/customer-managed-keys-integration-service-environment)

* [How to restore key vault keys in Azure](https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultkey?view=azurermps-6.13.0)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 9.4: Ensure protection of backups and customer-managed keys

**Guidance**: Your disaster recovery strategy should focus on setting up your primary logic app to failover onto a standby or backup logic app in an alternate location where Azure Logic Apps is also available. That way, if the primary suffers losses, disruptions, or failures, the secondary can take on the work. This strategy requires that your secondary logic app and dependent resources are already deployed and ready in the alternate location.

Protect backed up customer-managed keys. Note that this applies to Logic Apps running on integration service environments (ISE) only.

Enable Soft-Delete and purge protection in Key Vault to protect keys against accidental or malicious deletion.

* [Learn more about business continuity and disaster recovery for Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/business-continuity-disaster-recovery-guidance)

* [Set up customer-managed keys to encrypt data at rest for integration service environments (ISEs) in Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/customer-managed-keys-integration-service-environment)

* [How to enable Soft-Delete and Purge protection in Key Vault](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete?tabs=azure-portal)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

## Incident response

*For more information, see [Security control: Incident response](https://docs.microsoft.com/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create an incident response guide

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.

* [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

* [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/06/27/inside-the-msrc-anatomy-of-a-ssirp-incident/)

* [Leverage NIST's Computer Security Incident Handling Guide to aid in the creation of your own incident response plan](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, clearly mark subscriptions (for ex. production, non-prod) using tags and create a naming system to clearly identify and categorize Azure resources, especially those processing sensitive data. It is your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

* [Security alerts in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-alerts-overview)

* [Use tags to organize your Azure resources](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence to help protect your Azure resources. Identify weak points and gaps and revise plan as needed.

* [NIST's publication - Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://csrc.nist.gov/publications/detail/sp/800-84/final)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved.

* [How to set the Azure Security Center Security Contact](https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature to help identify risks to Azure resources. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts to Azure Sentinel.

* [How to configure continuous export](https://docs.microsoft.com/azure/security-center/continuous-export)

* [How to stream alerts into Azure Sentinel](https://docs.microsoft.com/azure/sentinel/connect-azure-security-center)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations to protect your Azure resources.

* [How to configure Workflow Automation and Logic Apps](https://docs.microsoft.com/azure/security-center/workflow-automation)

**Azure Security Center monitoring**: N/A

**Responsibility**: Customer

## Penetration tests and red team exercises

*For more information, see [Security control: Penetration tests and red team exercises](https://docs.microsoft.com/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

**Guidance**: Follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies. Use Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.

* [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1)

* [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Azure Security Center monitoring**: N/A

**Responsibility**: Shared

## Next steps

- See the [Azure security benchmark](https://docs.microsoft.com/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview)
