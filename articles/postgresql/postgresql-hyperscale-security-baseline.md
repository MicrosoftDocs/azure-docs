---
title: Azure security baseline for Azure Database for PostgreSQL - Hyperscale
description: Azure security baseline for Azure Database for PostgreSQL - Hyperscale
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 06/16/2020
ms.author: mbaldwin
ms.custom: security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Database for PostgreSQL - Hyperscale

The Azure Security Baseline for Azure Database for PostgreSQL - Hyperscale contains recommendations that will help you improve the security posture of your deployment.

The baseline for this service is drawn from the [Azure Security Benchmark version 1.0](https://docs.microsoft.com/azure/security/benchmarks/overview), which provides recommendations on how you can secure your cloud solutions on Azure with our best practices guidance.

For more information, see the [Azure security baselines overview](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network security

*For more information, see [Security control: Network security](https://docs.microsoft.com/azure/security/benchmarks/security-control-network-security).*

### 1.1: Protect Azure resources within virtual networks

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22452).

**Guidance**: Azure Database for PostgreSQL server firewall prevents all access to your Hyperscale (Citus) coordinator node until you specify which computers have permission. The firewall grants access to the server based on the originating IP address of each request. To configure your firewall, you create firewall rules that specify ranges of acceptable IP addresses. You can create firewall rules at the server level.

How to configure Firewall rules in Azure Database for PostgreSQL - Hyperscale (Citus): https://docs.microsoft.com/azure/postgresql/concepts-hyperscale-firewall-rules

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and NICs


>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22453).

**Guidance**: Not applicable; Azure Database for PostgreSQL - Hyperscale (Citus) cannot be associated with a virtual network, subnet, or network security group.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.3: Protect critical web applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22454).

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.4: Deny communications with known malicious IP addresses

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22455).

**Guidance**: [For service owner review.] The endpoints used by Azure Azure Database for PostgreSQL - Hyperscale (Citus) are all managed by Microsoft. You are responsible for any additional controls you wish to deploy to your on-premises systems.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.5: Record network packets

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22456).

**Guidance**: Not applicable; Azure Database for PostgreSQL - Hyperscale (Citus) cannot be associated with a virtual network, subnet, or network security group.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.6: Deploy network based intrusion detection/intrusion prevention systems (IDS/IPS)

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22457).

**Guidance**: Not applicable; [For service owner review]

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.7: Manage traffic to web applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22458).

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.8: Minimize complexity and administrative overhead of network security rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22459).

**Guidance**: Not applicable; Azure Database for PostgreSQL - Hyperscale (Citus) cannot be associated with a virtual network, subnet, or network security group and therefore virtual network service tags cannot be used.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.9: Maintain standard security configurations for network devices

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22460).

**Guidance**: Define and implement standard security configurations for network settings and network resources associated with your Azure Database for PostgreSQL instances with Azure Policy. Use Azure Policy aliases in the "Microsoft.DBforPostgreSQL" and "Microsoft.Network" namespaces to create custom policies to audit or enforce the network configuration of your Azure Database for PostgreSQL instances. You may also make use of built-in policy definitions related to networking or your Azure Database for PostgreSQL instances, such as:

[For service owner review, not sure if all PostgreSQL definitions apply to Hyper Scale]

- Enforce SSL connection should be enabled for PostgreSQL database servers
- Log connections should be enabled for PostgreSQL database servers

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

Azure Policy samples for networking: https://docs.microsoft.com/azure/governance/policy/samples/#network

How to create an Azure Blueprint: https://docs.microsoft.com/azure/governance/blueprints/create-blueprint-portal

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.10: Document traffic configuration rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22461).

**Guidance**: Use tags for resources related to network security and traffic flow for your Hyperscale (Citus) instances to provide metadata and logical organization. [Is this N/A? I can't identify anything related to traffic flow?]

Use any of the built-in Azure policy definitions related to tagging, such as, "Require tag and its value," to ensure that all resources are created with tags and to notify you of existing untagged resources.

You may use Azure PowerShell or Azure CLI to look-up or perform actions on resources based on their tags.

How to create and use tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.11: Use automated tools to monitor network resource configurations and detect changes

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22462).

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network resources related to your Hyperscale (Citus) instances. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place.

How to view and retrieve Azure Activity Log events: https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view

How to create alerts in Azure Monitor: https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Logging and monitoring

*For more information, see [Security control: Logging and monitoring](https://docs.microsoft.com/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.1: Use approved time synchronization sources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22463).

**Guidance**: Microsoft maintains the time source used for Azure resources, such as Azure Database for PostgreSQL - Hyperscale (Citus) for timestamps in the logs.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 2.2: Configure central security log management

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22464).

**Guidance**: For control plane audit logging, enable Azure Activity Log diagnostic settings and send the logs to a Log Analytics workspace, Azure event hub, or Azure storage account for archive. Using Azure Activity Log data, you can determine the "what, who, and when" for any write operations (PUT, POST, DELETE) performed at the control plane level for your Azure resources.

Also, ingest logs via Azure Monitor to aggregate security data generated by Hyperscale (Citus). Within the Azure Monitor, use Log Analytics workspace(s) to query and perform analytics, and use storage accounts for long-term/archival storage. Alternatively, you may enable, and on-board data to Azure Sentinel or a third-party Security Incident and Event Management (SIEM). 

How to enable Diagnostic Settings for Azure Activity Log: https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings-legacy [Are metrics applicable? Should I wordsmith this in?]

Metrics in Hyperscale (Citus): https://docs.microsoft.com/azure/postgresql/concepts-hyperscale-monitoring

How to onboard Azure Sentinel: https://docs.microsoft.com/azure/sentinel/quickstart-onboard

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22465).

**Guidance**: For control plane audit logging, enable Azure Activity Log diagnostic settings and send the logs to a Log Analytics workspace, Azure event hub, or Azure storage account for archive. Using Azure Activity Log data, you can determine the "what, who, and when" for any write operations (PUT, POST, DELETE) performed at the control plane level for your Azure resources.

Also, ingest logs via Azure Monitor to aggregate security data generated by Hyperscale (Citus). Within the Azure Monitor, use Log Analytics workspace(s) to query and perform analytics, and use storage accounts for long-term/archival storage. Alternatively, you may enable, and on-board data to Azure Sentinel or a third-party Security Incident and Event Management (SIEM). 

How to enable Diagnostic Settings for Azure Activity Log: https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings-legacy [Are metrics applicable? Should I wordsmith this in?]

Metrics in Hyperscale (Citus): https://docs.microsoft.com/azure/postgresql/concepts-hyperscale-monitoring

How to onboard Azure Sentinel: https://docs.microsoft.com/azure/sentinel/quickstart-onboard

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.4: Collect security logs from operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22466).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.5: Configure security log storage retention

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22467).

**Guidance**: Within Azure Monitor, for the Log Analytics workspace being used to hold your Hyperscale (Citus) logs, set the retention period according to your organization's compliance regulations. Use Azure Storage Accounts for long-term/archival storage.

How to set log retention parameters for Log Analytics Workspaces: https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period

Storing resource logs in an Azure Storage Account: https://docs.microsoft.com/azure/azure-monitor/platform/resource-logs-collect-storage

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.6: Monitor and review Logs

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22468).

**Guidance**: Analyze and monitor logs from your Hyperscale (Citus) instances for anomalous behavior. Use Azure Monitor's Log Analytics to review logs and perform queries on log data. Alternatively, you may enable and on-board data to Azure Sentinel or a third party SIEM.

How to onboard Azure Sentinel: https://docs.microsoft.com/azure/sentinel/quickstart-onboard

For more information about the Log Analytics: https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-portal

How to perform custom queries in Azure Monitor: https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-queries

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22469).

**Guidance**: You may enable diagnostic settings for Hyperscale (Citus) and send logs to a Log Analytics workspace  You can configure and receive an alert based on monitoring metrics for your Azure services. Use Azure Monitor's Log Analytics to review logs and perform queries on log data. Alternatively, you may enable and on-board data to Azure Sentinel or a third party SIEM.

Onboard your Log Analytics workspace to Azure Sentinel as it provides a security orchestration automated response (SOAR) solution. This allows for playbooks (automated solutions) to be created and used to remediate security issues.

Metrics in Hyperscale (Citus): https://docs.microsoft.com/azure/postgresql/howto-hyperscale-alert-on-metric

How to configure Diagnostic Settings for the Azure Activity Log: https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-settings-legacy

How to onboard Azure Sentinel: https://docs.microsoft.com/azure/sentinel/quickstart-onboard

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.8: Centralize anti-malware logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22470).

**Guidance**: Not applicable; Azure Database for PostgreSQL - Hyperscale (Citus) does not process or produce anti-malware related logs.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.9: Enable DNS query logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22471).

**Guidance**: Not applicable; Azure Database for PostgreSQL does not process or produce DNS related logs.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.10: Enable command-line audit logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22472).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Identity and access control

*For more information, see [Security control: Identity and access control](https://docs.microsoft.com/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain an inventory of administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22473).

**Guidance**: Maintain an inventory of the user accounts that have administrative access to the control plane (e.g. Azure portal) of your Hyperscale (Citus) instances. In addition, maintain an inventory of the administrative accounts that have access to the data plane (within the database itself) of your Hyperscale (Citus) instances.

Hyperscale (Citus) does not support built-in role-based access control, but you can create custom roles based on specific resource provider operations.

Additionally, The PostgreSQL engine uses roles to control access to database objects, and a newly created Hyperscale (Citus) server group comes with several roles pre-defined.

Understand custom roles for Azure subscription: https://docs.microsoft.com/azure/role-based-access-control/custom-roles 

[Understand Azure Database for PostgreSQL resource provider operations: https://docs.microsoft.com/azure/role-based-access-control/resource-provider-operations#microsoftdbforpostgresql 

Understand access management for Azure Database for PostgreSQL: https://docs.microsoft.com/azure/postgresql/concepts-security#access-management]

How to create users in Azure Database for PostgreSQL - Hyperscale (Citus): https://docs.microsoft.com/azure/postgresql/howto-hyperscale-create-users

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.2: Change default passwords where applicable

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22474).

**Guidance**: Azure AD does not have the concept of default passwords. Other Azure resources requiring a password forces a password to be created with complexity requirements and a minimum password length, which differs depending on the service. You are responsible for third-party applications and marketplace services that may use default passwords.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.3: Use dedicated administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22475).

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts that have access to your Hyperscale (Citus) instances. Use Azure Security Center Identity and access management to monitor the number of administrative accounts. 

Understand Azure Security Center Identity and Access: https://docs.microsoft.com/azure/security-center/security-center-identity-access 

How to create users in Azure Database for PostgreSQL - Hyperscale (Citus): https://docs.microsoft.com/azure/postgresql/howto-hyperscale-create-users

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.4: Use single sign-on (SSO) with Azure Active Directory

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22476).

**Guidance**: Signing into Azure Database for PostgreSQL - Hyperscale (Citus) is supported both using username/password configured directly in the database, as well as using an Azure Active Directory (AD) identity and utilizing an Azure AD token to connect. When using an Azure AD token, different methods are supported, such as an Azure AD user, an Azure AD group, or an Azure AD application connecting to the database.

Separately, control plane access for PostgreSQL is available via REST API and supports SSO. To authenticate, set the Authorization header for your requests to a JSON Web Token that you obtain from Azure Active Directory.

Use Azure Active Directory for authenticating with Azure Database for PostgreSQL: https://docs.microsoft.com/azure/postgresql/howto-configure-sign-in-aad-authentication

Understand Azure Database for PostgreSQL REST API: https://docs.microsoft.com/rest/api/postgresql/

Understand SSO with Azure AD: https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22477).

**Guidance**: Enable Azure Active Directory Multi-Factor Authentication (MFA) and follow Azure Security Center Identity and Access Management recommendations. When utilizing Azure AD tokens for signing into your database, this allows you to require multi-factor authentication for database sign-ins.

How to enable MFA in Azure: https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted

Use Azure Active Directory for authenticating with Azure Database for PostgreSQL: https://docs.microsoft.com/azure/postgresql/howto-configure-sign-in-aad-authentication

How to monitor identity and access within Azure Security Center: https://docs.microsoft.com/azure/security-center/security-center-identity-access

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22478).

**Guidance**: Use Privileged Access Workstations (PAWs) with Multi-Factor Authentication (MFA) configured to log into and configure Azure resources.

Learn about Privileged Access Workstations: https://docs.microsoft.com/windows-server/identity/securing-privileged-access/privileged-access-workstations

How to enable MFA in Azure: https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.7: Log and alert on suspicious activities from administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22479).

**Guidance**: Use Azure Active Directory (AD) Privileged Identity Management (PIM) for generation of logs and alerts when suspicious or unsafe activity occurs in the environment.

Use Azure AD Risk Detections to view alerts and reports on risky user behavior.

How to deploy Privileged Identity Management (PIM): https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-deployment-plan

Understand Azure AD risk detections: https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risk-events

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.8: Manage Azure resources from only approved locations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22480).

**Guidance**: Use Conditional Access Named Locations to allow portal and Azure Resource Manager access from only specific logical groupings of IP address ranges or countries/regions.

How to configure Named Locations in Azure: https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.9: Use Azure Active Directory

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22481).

**Guidance**: Use Azure Active Directory (AD) as the central authentication and authorization system. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.

For signing into Azure Database for PostgreSQL, it is recommended to use Azure AD and use an Azure AD token to connect. When using an Azure AD token, different methods are supported, such as an Azure AD user, an Azure AD group, or an Azure AD application connecting to the database.

Azure AD credentials may also be used for administration at the management plane level (e.g. the Azure portal) to control PostgreSQL admin accounts.

Use Azure Active Directory for authenticating with Azure Database for PostgreSQL: https://docs.microsoft.com/azure/postgresql/howto-configure-sign-in-aad-authentication

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.10: Regularly review and reconcile user access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22482).

**Guidance**: Review the Azure Active Directory logs to help discover stale accounts which can include those with Hyperscale (Citus) administrative roles. In addition, use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications that may be used to access Hyperscale (Citus), and role assignments. User access should be reviewed on a regular basis such as every 90 days to make sure only the right Users have continued access.

Understand Azure AD Reporting: https://docs.microsoft.com/azure/active-directory/reports-monitoring/

How to use Azure Identity Access Reviews: https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview

Review PostgreSQL users and assigned roles: https://www.postgresql.org/docs/current/database-roles.html

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.11: Monitor attempts to access deactivated credentials

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22483).

**Guidance**: Enable Diagnostic Settings for Azure Database for PostgreSQL and Azure Active Directory, sending all logs to a Log Analytics workspace. Configure desired alerts (such as failed authentication attempts) within Log Analytics.

How to configure and access Server Logs for Azure Database for PostgreSQL: https://docs.microsoft.com/azure/postgresql/howto-configure-server-logs-in-portal

How to configure and access audit logs for Azure Database for PostgreSQL: https://docs.microsoft.com/azure/postgresql/concepts-audit

How to integrate Azure Activity Logs into Azure Monitor: https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.12: Alert on account login behavior deviation

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22484).

**Guidance**: Use Azure Active Directory's Identity Protection and risk detection features to configure automated responses to detected suspicious actions. You may enable automated responses through Azure Sentinel to implement your organization's security responses.

You can also ingest logs into Azure Sentinel for further investigation.

Overview of Azure AD Identity Protection: https://docs.microsoft.com/azure/active-directory/identity-protection/overview-identity-protection

How to view Azure AD risky sign-ins: https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risk-events

How to onboard Azure Sentinel: https://docs.microsoft.com/azure/sentinel/quickstart-onboard

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22485).

**Guidance**: Currently not available; Customer Lockbox is not yet supported for Hyperscale (Citus).

List of Customer Lockbox supported services: https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview#supported-services-and-scenarios-in-general-availability

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Currently not available

## Data protection

*For more information, see [Security control: Data protection](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an inventory of sensitive Information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22486).

**Guidance**: Use tags to assist in tracking Hyperscale (Citus) instances or related resources that store or process sensitive information.

How to create and use tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22487).

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. Use a combination of administrative roles and firewall rules to isolate and limit network access to your Azure Database for PostgreSQL instances.

How to create additional Azure subscriptions: https://docs.microsoft.com/azure/billing/billing-create-subscription

How to create Management Groups: https://docs.microsoft.com/azure/governance/management-groups/create

Understand firewall rules in Azure Database for PostgreSQL - Hyperscale (Citus): https://docs.microsoft.com/azure/postgresql/concepts-hyperscale-firewall-rules

Understand roles in Hyperscale (Citus): https://docs.microsoft.com/azure/postgresql/howto-hyperscale-create-users

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.3: Monitor and block unauthorized transfer of sensitive information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22488).

**Guidance**: When using Azure virtual machines to access Hyperscale (Citus) instances, make use of Private Link, [PostgreSQL network configurations], network security groups, and service tags to mitigate the possibility of data exfiltration.

Microsoft manages the underlying infrastructure for Azure Database for PostgreSQL - Hyperscale (Citus) and has implemented strict controls to prevent the loss or exposure of customer data.

Understand customer data protection in Azure: https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 4.4: Encrypt all sensitive information in transit

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22489).

**Guidance**: Client application connections to the Hyperscale (Citus) coordinator node require Transport Layer Security (TLS), previously known as Secure Sockets Layer (SSL). Enforcing TLS connections between your database server and your client applications helps protect against "man-in-the-middle" attacks by encrypting the data stream between the server and your application.

For all Azure Database for PostgreSQL servers provisioned through the Azure portal, enforcement of TLS connections is enabled by default.

How to configure TLS in Azure Database for PostgreSQL - Hyperscale (Citus): https://docs.microsoft.com/azure/postgresql/concepts-hyperscale-ssl-connection-security

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### 4.5: Use an active discovery tool to identify sensitive data

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22490).

**Guidance**: Data identification, classification, and loss prevention features are not yet available for Hyperscale (Citus). Implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

Understand customer data protection in Azure: https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### 4.6: Use Role-based access control to control access to resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22491).

**Guidance**: Use Azure role-based access control (RBAC) to control access to the Hyperscale (Citus) control plane (e.g. Azure portal). For data plane access (within the database itself), use SQL queries to create users and configure user permissions [?]. RBAC does not affect user permissions within the database.

How to configure RBAC in Azure: https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal

[How to configure user access with SQL for Azure Database for PostgreSQL: https://docs.microsoft.com/azure/postgresql/howto-create-users]

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 4.7: Use host-based data loss prevention to enforce access control

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22492).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

Microsoft manages the underlying infrastructure for Hyperscale (Citus) and has implemented strict controls to prevent the loss or exposure of customer data.

Understand customer data protection in Azure: https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 4.8: Encrypt sensitive information at rest

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22493).

**Guidance**:  The Azure Database for PostgreSQL service uses the FIPS 140-2 validated cryptographic module for storage encryption of data at-rest. Data, including backups, are encrypted on disk, with the exception of temporary files created while running queries. The service uses the AES 256-bit cipher included in Azure storage encryption, and the keys are system managed. Storage encryption is always on and can't be disabled.

[Data encryption with customer-managed keys (CMK) for Azure Database for PostgreSQL - Hyperscale (Citus) enables you to bring your own key (BYOK) for data protection at rest. At this time, you must request access to use this capability. To do so, contact:

AskAzureDBforPostgreSQL@service.microsoft.com.]

Understand encryption at-rest for Azure Database for PostgreSQL: https://docs.microsoft.com/azure/postgresql/concepts-security

Understand encryption at-rest for Azure Database for PostgreSQL using customer-managed keys: https://docs.microsoft.com/azure/postgresql/concepts-data-encryption-postgresql


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 4.9: Log and alert on changes to critical Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22494).

**Guidance**: Use Azure Monitor with the Azure Activity Log to create alerts for when changes take place to production instances of Hyperscale (Citus) and other critical or related resources.

How to create alerts for Azure Activity Log events: https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Vulnerability management

*For more information, see [Security control: Vulnerability management](https://docs.microsoft.com/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.1: Run automated vulnerability scanning tools

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22495).

**Guidance**: Currently not available; Azure Security Center does not yet support vulnerability assessment for Azure Database for PostgreSQL - Hyperscale (Citus).

Feature coverage for Azure PaaS services in Azure Security Center: https://docs.microsoft.com/azure/security-center/features-paas

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Currently not available

### 5.2: Deploy automated operating system patch management solution

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22496).

**Guidance**: Use Azure "Update Management" to ensure the most recent security updates are installed on your Windows and Linux VMs. For Windows VMs, ensure Windows Update has been enabled and set to update automatically. 

How to configure Update Management for virtual machines in Azure: 
https://docs.microsoft.com/azure/automation/automation-update-management 

Understand Azure security policies monitored by Security Center: 
https://docs.microsoft.com/azure/security-center/security-center-policy-definitions

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 5.3: Deploy automated patch management solution for third-party software titles

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22497).

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 5.4: Compare back-to-back vulnerability scans

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22498).

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22499).

**Guidance**: Microsoft performs vulnerability management on the underlying systems that support Azure Database for PostgreSQL - Hyperscale (Citus).

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

## Inventory and asset management

*For more information, see [Security control: Inventory and asset management](https://docs.microsoft.com/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use automated Asset Discovery solution

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22500).

**Guidance**: Use Azure Resource Graph to query and discover all resources (including Hyperscale (Citus) instances) within your subscription(s). Ensure you have appropriate (read) permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions.

How to create queries with Azure Graph: https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal

How to view your Azure Subscriptions: https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0

Understand Azure RBAC: https://docs.microsoft.com/azure/role-based-access-control/overview

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.2: Maintain asset metadata

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22501).

**Guidance**: Apply tags to Hyperscale (Citus) instances and other related resources giving metadata to logically organize them into a taxonomy.

How to create and use tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.3: Delete unauthorized Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22502).

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track Hyperscale (Citus) instances and related resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

How to create additional Azure subscriptions: https://docs.microsoft.com/azure/billing/billing-create-subscription

How to create Management Groups: https://docs.microsoft.com/azure/governance/management-groups/create

How to create and use tags: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.4: Define and Maintain an inventory of approved Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22503).

**Guidance**: Not applicable; this recommendation is intended for compute resources and Azure as a whole.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.5: Monitor for unapproved Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22504).

**Guidance**: Use Azure policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

- Not allowed resource types
- Allowed resource types

In addition, use the Azure Resource Graph to query/discover resources within the subscription(s).

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

How to create queries with Azure Graph: https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.6: Monitor for unapproved software applications within compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22505).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.7: Remove unapproved Azure resources and software applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22506).

**Guidance**: Not applicable; this recommendation is intended for compute resources and Azure as a whole.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.8: Use only approved applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22507).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.9: Use only approved Azure services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22508).

**Guidance**: Use Azure policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

- Not allowed resource types
- Allowed resource types

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

How to deny a specific resource type with Azure Policy: https://docs.microsoft.com/azure/governance/policy/samples/not-allowed-resource-types

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.10: Maintain an inventory of approved software titles

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22509).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.11: Limit users' ability to interact with Azure Resource Manager

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22510).

**Guidance**: Use the Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App. This can prevent the creation and changes to resources within a high security environment, such as instances of Hyperscale (Citus) containing sensitive information.

How to configure Conditional Access to block access to Azure Resource Manager: https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.12: Limit users' ability to execute scripts within compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22511).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.13: Physically or logically segregate high risk applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22512).

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Secure configuration

*For more information, see [Security control: Secure configuration](https://docs.microsoft.com/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish secure configurations for all Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22513).

**Guidance**: Define and implement standard security configurations for your Hyperscale (Citus) instances with Azure Policy. Use Azure Policy aliases in the "Microsoft.DBforPostgreSQL" namespace to create custom policies to audit or enforce the network configuration of your Azure Database for PostgreSQL instances. You may also make use of built-in policy definitions related to your Azure Database for PostgreSQL instances, such as:

- Enforce SSL connection should be enabled for PostgreSQL database servers
- Log connections should be enabled for PostgreSQL database servers

How to view available Azure Policy Aliases: https://docs.microsoft.com/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.2: Establish secure operating system configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22514).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.3: Maintain secure Azure resource configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22515).

**Guidance**: Use Azure policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

Understand Azure Policy Effects: https://docs.microsoft.com/azure/governance/policy/concepts/effects

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.4: Maintain secure operating system configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22516).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.5: Securely store configuration of Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22517).

**Guidance**: If using custom Azure policy definitions for your Hyperscale (Citus) instances and related resources, use Azure Repos to securely store and manage your code.

How to store code in Azure DevOps: https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops

Azure Repos Documentation: https://docs.microsoft.com/azure/devops/repos/index?view=azure-devops

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.6: Securely store custom operating system images

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22518).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.7: Deploy configuration management tools for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22519).

**Guidance**: Use Azure Policy aliases in the "Microsoft.DBforPostgreSQL" namespace to create custom policies to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.8: Deploy configuration management tools for operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22520).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.9: Implement automated configuration monitoring for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22521).

**Guidance**: Use Azure Policy aliases in the "Microsoft.DBforPostgreSQL" namespace to create custom policies to alert, audit, and enforce system configurations. Use Azure policy [audit], [deny], and [deploy if not exist] to automatically enforce configurations for your Azure Database for PostgreSQL instances and related resources.

How to configure and manage Azure Policy: https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.10: Implement automated configuration monitoring for operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22522).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.11: Manage Azure secrets securely

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22523).

**Guidance**: Not applicable; [For service owner review]

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.12: Manage identities securely and automatically

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22524).

**Guidance**: Azure Database for PostgreSQL server supports Azure Active Directory authentication to access databases. While creating the Azure Database for PostgreSQL server, you provide credentials for an administrator user. This administrator can be used to create additional database users.

For Azure Virtual Machines or web applications running on Azure App Service being used to access your Azure Database for PostgreSQL server, use Managed Service Identity in conjunction with Azure Key Vault to store and retrieve credentials for Azure Database for PostgreSQL server. Ensure Key Vault Soft Delete is enabled.

Use Managed Identities to provide Azure services with an automatically managed identity in Azure Active Directory (AD). Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code.

How to configure Managed Identities: https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm

How to integrate with Azure Managed Identities: https://docs.microsoft.com/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Currently not available

### 7.13: Eliminate unintended credential exposure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22525).

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

How to setup Credential Scanner: https://secdevtools.azurewebsites.net/helpcredscan.html

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Malware defense

*For more information, see [Security control: Malware defense](https://docs.microsoft.com/azure/security/benchmarks/security-control-malware-defense).*

### 8.1: Use centrally managed anti-malware software

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22526).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure App Service), however it does not run on customer content.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22527).

**Guidance**: Microsoft anti-malware is enabled on the underlying host that supports Azure services -- for example, Hyperscale (Citus) -- however, it does not run on customer content.

Pre-scan any content being uploaded to non-compute Azure resources, such as App Service, Data Lake Storage, Blob Storage, Azure Database for PostgreSQL, etc. Microsoft cannot access your data in these instances.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 8.3: Ensure anti-malware software and signatures are updated

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22528).

**Guidance**: Not applicable; this recommendation is intended for compute resources.

Microsoft anti-malware is enabled on the underlying host that supports Azure services -- for example, Hyperscale (Citus) -- however, it does not run on customer content.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Data recovery

*For more information, see [Security control: Data recovery](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure regular automated back ups

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22529).

**Guidance**: Azure Database for PostgreSQL – Hyperscale (Citus) automatically creates backups of each node and stores them in locally redundant storage. Backups can be used to restore your Hyperscale (Citus) cluster to a specified time.

How to backup and restore in Azure Database for PostgreSQL - Hyperscale (Citus): https://docs.microsoft.com/azure/postgresql/concepts-hyperscale-backup

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 9.2: Perform complete system backups and backup any customer managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22530).

**Guidance**: At least once a day, Azure Database for PostgreSQL takes snapshot backups of data files and the database transaction log. The backups allow you to restore a server to any point in time within the retention period. (The retention period is currently 35 days for all clusters.) All backups are encrypted using AES 256-bit encryption.

In Azure regions that support availability zones, backup snapshots are stored in three availability zones. As long as at least one availability zone is online, the Hyperscale (Citus) cluster is restorable.

How to backup and restore in Azure Database for PostgreSQL - Hyperscale (Citus): https://docs.microsoft.com/azure/postgresql/concepts-hyperscale-backup

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 9.3: Validate all backups including customer managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22531).

**Guidance**: In Azure Database for PostgreSQL, restoring a Hyperscale (Citus) cluster creates a new cluster from the original nodes' backups. You can restore a cluster to any point in time within the last 35 days. The restore process creates a new cluster in the same Azure region, subscription, and resource group as the original. The cluster has the original's configuration: the same number of nodes, number of vCores, storage size, user roles, PostgreSQL version, and version of the Citus extension.

Firewall settings and PostgreSQL server parameters are not preserved from the original server group, they are reset to default values. The firewall will prevent all connections. You will need to manually adjust these settings after restore.

How to backup and restore in Azure Database for PostgreSQL - Hyperscale (Citus): https://docs.microsoft.com/azure/postgresql/concepts-hyperscale-backup

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 9.4: Ensure protection of backups and customer managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22532).

**Guidance**: Deleted Hyperscale (Citus) clusters can't be restored. If you delete the cluster, all nodes that belong to the cluster are deleted and can't be recovered. To protect cluster resources, post deployment, from accidental deletion or unexpected changes, administrators can leverage management locks.

How to backup and restore in Azure Database for PostgreSQL - Hyperscale (Citus): https://docs.microsoft.com/azure/postgresql/concepts-hyperscale-backup

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Incident response

*For more information, see [Security control: Incident response](https://docs.microsoft.com/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create an incident response guide

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22533).

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review. 

How to configure Workflow Automations within Azure Security Center: 
https://docs.microsoft.com/azure/security-center/security-center-planning-and-operations-guide 

Guidance on building your own security incident response process: 
https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/ 

Microsoft Security Response Center's Anatomy of an Incident: 
https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/ 

Customer may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan: 
https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22534).

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert. 

Additionally, clearly mark subscriptions (for ex. production, non-prod) and create a naming system to clearly identify and categorize Azure resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.3: Test security response procedures

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22539).

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed. 

Refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities: 
https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22535).

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that the customer's data has been accessed by an unlawful or unauthorized party.  Review incidents after the fact to ensure that issues are resolved. 

How to set the Azure Security Center Security Contact: 
https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22536).

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts Sentinel. 

How to configure continuous export: 
https://docs.microsoft.com/azure/security-center/continuous-export 

How to stream alerts into Azure Sentinel: 
https://docs.microsoft.com/azure/sentinel/connect-azure-security-center

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22537).

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations. 

How to configure Workflow Automation and Logic Apps: 
https://docs.microsoft.com/azure/security-center/workflow-automation

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Penetration tests and red team exercises

*For more information, see [Security control: Penetration tests and red team exercises](https://docs.microsoft.com/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/22538).

**Guidance**: Follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies: 
https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1 

You can find more information on Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications, here: 
https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Next steps

- See the [Azure security benchmark](https://docs.microsoft.com/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview)
