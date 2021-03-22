---
title: Azure security baseline for Azure Database for PostgreSQL - Single Server
description: The Azure Database for PostgreSQL - Single Server security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: postgresql
ms.topic: conceptual
ms.date: 01/01/2000
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Database for PostgreSQL - Single Server

This security baseline applies guidance from the [Azure Security Benchmark version1.0](../security/benchmarks/overview-v1.md) to Azure Database for PostgreSQL - Single Server. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure.The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Database for PostgreSQL - Single Server. **Controls** not applicable to Azure Database for PostgreSQL - Single Server, or for which the responsibility is Microsoft's, have been excluded.

To see how Azure Database for PostgreSQL - Single Server completely maps to the Azure Security Benchmark, see the [full Azure Database for PostgreSQL - Single Serversecurity baseline mappingfile](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](../security/benchmarks/security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3801).

**Guidance**: Configure Private Link for Azure Database for PostgreSQL with Private Endpoints. Private Link allows you to connect to various PaaS services in Azure via a private endpoint. Azure Private Link essentially brings Azure services inside your private Virtual Network (VNet). Traffic between your virtual network and PostgreSQL instance travels the Microsoft backbone network.

Alternatively, you may use Virtual Network Service Endpoints to protect and limit network access to your Azure Database for PostgreSQL implementations. Virtual network rules are one firewall security feature that controls whether your Azure Database for PostgreSQL server accepts communications that are sent from particular subnets in virtual networks.

You may also secure your Azure Database for PostgreSQL server with firewall rules. The server firewall prevents all access to your database server until you specify which computers have permission. To configure your firewall, you create firewall rules that specify ranges of acceptable IP addresses. You can create firewall rules at the server level.

- [How to configure Private Link for Azure Database for PostgreSQL](howto-configure-privatelink-portal.md)

- [How to create and manage VNet service endpoints and VNet rules in Azure Database for PostgreSQL](howto-manage-vnet-using-portal.md)

- [How to configure Azure Database for PostgreSQL firewall rules](howto-manage-firewall-using-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.DBforPostgreSQL**:

[!INCLUDE [Resource Policy for Microsoft.DBforPostgreSQL 1.1](../../includes/policy/standards/asb/rp-controls/microsoft.dbforpostgresql-1-1.md)]

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and network interfaces

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3802).

**Guidance**: When your Azure Database for PostgreSQL instance is secured to a private endpoint, you can deploy virtual machines in the same virtual network. You can use a network security group (NSG) to reduce the risk of data exfiltration. Enable NSG flow logs and send logs into a Storage Account for traffic audit. You may also send NSG flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

- [How to configure Private Link for Azure Database for PostgreSQL](howto-configure-privatelink-portal.md)

- [How to Enable NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to Enable and use Traffic Analytics](../network-watcher/traffic-analytics.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.3: Protect critical web applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3803).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 1.4: Deny communications with known-malicious IP addresses

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3804).

**Guidance**: Use Advanced Threat Protection for Azure Database for PostgreSQL. Advanced Threat Protection detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases.

Enable DDoS Protection Standard on the virtual networks associated with your Azure Database for PostgreSQL instances to guard against DDoS attacks. Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious or unused Internet IP addresses.

- [How to configure Advanced Threat Protection for Azure Database for PostgreSQL](howto-database-threat-protection-portal.md)

- [How to configure DDoS protection](../ddos-protection/manage-ddos-protection.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.5: Record network packets

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3805).

**Guidance**: When your Azure Database for PostgreSQL instance is secured to a private endpoint, you can deploy virtual machines in the same virtual network. You can then configure a network security group (NSG) to reduce the risk of data exfiltration. Enable NSG flow logs and send logs into a Storage Account for traffic audit. You may also send NSG flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

- [How to Enable NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to Enable and use Traffic Analytics](../network-watcher/traffic-analytics.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3806).

**Guidance**: Use Advanced Threat Protection for Azure Database for PostgreSQL. Advanced Threat Protection detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases.

- [How to configure Advanced Threat Protection for Azure Database for PostgreSQL](howto-database-threat-protection-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.7: Manage traffic to web applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3807).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 1.8: Minimize complexity and administrative overhead of network security rules

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3808).

**Guidance**: For resources that need access to your Azure Database for PostgreSQL instances, use virtual network service tags to define network access controls on network security groups or Azure Firewall. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., SQL.WestUs) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

Note: Azure Database for PostgreSQL uses the "Microsoft.Sql" service tag.

- [For more information about using service tags](../virtual-network/service-tags-overview.md)

- [Understand service tag usage for Azure Database for PostgreSQL](https://docs.microsoft.com/azure/postgresql/concepts-data-access-and-security-vnet#terminology-and-description)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.9: Maintain standard security configurations for network devices

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3809).

**Guidance**: Define and implement standard security configurations for network settings and network resources associated with your Azure Database for PostgreSQL instances with Azure Policy. Use Azure Policy aliases in the "Microsoft.DBforPostgreSQL" and "Microsoft.Network" namespaces to create custom policies to audit or enforce the network configuration of your Azure Database for PostgreSQL instances. You may also make use of built-in policy definitions related to networking or your Azure Database for PostgreSQL instances, such as:

- DDoS Protection Standard should be enabled

- Enforce TLS connection should be enabled for PostgreSQL database servers

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Azure Policy samples for networking](/azure/governance/policy/samples)

- [How to create an Azure Blueprint](../governance/blueprints/create-blueprint-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.10: Document traffic configuration rules

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3810).

**Guidance**: Use tags for resources related to network security and traffic flow for your Azure Database for PostgreSQL instances to provide metadata and logical organization.

Use any of the built-in Azure Policy definitions related to tagging, such as, "Require tag and its value," to ensure that all resources are created with tags and to notify you of existing untagged resources.

You may use Azure PowerShell or Azure CLI to look-up or perform actions on resources based on their tags.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.11: Use automated tools to monitor network resource configurations and detect changes

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3811).

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network resources related to your Azure Database for PostgreSQL instances. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place.

- [How to view and retrieve Azure Activity Log events](/azure/azure-monitor/platform/activity-log#view-the-activity-log)

- [How to create alerts in Azure Monitor](/azure/azure-monitor/platform/alerts-activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Logging and Monitoring

*For more information, see the [Azure Security Benchmark: Logging and Monitoring](../security/benchmarks/security-control-logging-monitoring.md).*

### 2.1: Use approved time synchronization sources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3812).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Microsoft maintains the time source used for Azure resources, such as Azure Database for PostgreSQL for timestamps in the logs.

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

### 2.2: Configure central security log management

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3813).

**Guidance**: Enable Diagnostic Settings and Server Logs and ingest logs to aggregate security data generated by your Azure Database for PostgreSQL instances. Within Azure Monitor, use Log Analytics Workspace(s) to query and perform analytics, and use Azure Storage Accounts for long-term/archival storage. Alternatively, you may enable and on-board data to Azure Sentinel or a third-party SIEM.

- [How to configure and access Server Logs for Azure Database for PostgreSQL](howto-configure-server-logs-in-portal.md)

- [How to configure and access audit logs for Azure Database for PostgreSQL](concepts-audit.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.3: Enable audit logging for Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3814).

**Guidance**: Enable Diagnostic Settings on your Azure Database for PostgreSQL instances for access to audit, security, and resource logs. Ensure that you specifically enable the PostgreSQL Audit log. Activity logs, which are automatically available, include event source, date, user, timestamp, source addresses, destination addresses, and other useful elements. You may also enable Azure Activity Log Diagnostic Settings and send the logs to the same Log Analytics workspace or Storage Account.

- [How to configure and access Server Logs for Azure Database for PostgreSQL](howto-configure-server-logs-in-portal.md)

- [How to configure and access audit logs for Azure Database for PostgreSQL](concepts-audit.md)

- [How to configure Diagnostic Settings for the Azure Activity Log](/azure/azure-monitor/platform/activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.4: Collect security logs from operating systems

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3815).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 2.5: Configure security log storage retention

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3816).

**Guidance**: Within Azure Monitor, for the Log Analytics Workspace being used to hold your Azure Database for PostgreSQL logs, set the retention period according to your organization's compliance regulations. Use Azure Storage Accounts for long-term/archival storage.

- [How to set log retention parameters for Log Analytics Workspaces](/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period)

- [Storing resource logs in an Azure Storage Account](/azure/azure-monitor/platform/resource-logs#send-to-azure-storage)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.6: Monitor and review logs

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3817).

**Guidance**: Analyze and monitor logs from your Azure Database for PostgreSQL instances for anomalous behavior. Use Azure Monitor's Log Analytics to review logs and perform queries on log data. Alternatively, you may enable and on-board data to Azure Sentinel or a third party SIEM.

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

- [For more information about the Log Analytics](/azure/azure-monitor/log-query/log-analytics-tutorial)

- [How to perform custom queries in Azure Monitor](/azure/azure-monitor/log-query/get-started-queries)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.7: Enable alerts for anomalous activities

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3818).

**Guidance**: Enable Advanced Threat Protection for Azure Database for PostgreSQL. Advanced Threat Protection detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases.

In addition, you may enable Server Logs and Diagnostic Settings for PostgreSQL and send logs to a Log Analytics Workspace. Onboard your Log Analytics Workspace to Azure Sentinel as it provides a security orchestration automated response (SOAR) solution. This allows for playbooks (automated solutions) to be created and used to remediate security issues.

- [How to enable Advanced Threat Protection for Azure Database for PostgreSQL](howto-database-threat-protection-portal.md)

- [How to configure and access Server Logs for Azure Database for PostgreSQL](howto-configure-server-logs-in-portal.md)

- [How to configure and access audit logs for Azure Database for PostgreSQL](concepts-audit.md)

- [How to configure Diagnostic Settings for the Azure Activity Log](/azure/azure-monitor/platform/activity-log)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.8: Centralize anti-malware logging

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3819).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Azure Database for PostgreSQL does not process or produce anti-malware related logs.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 2.9: Enable DNS query logging

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3820).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Azure Database for PostgreSQL does not process or produce DNS related logs.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 2.10: Enable command-line audit logging

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3821).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3822).

**Guidance**: Maintain an inventory of the user accounts that have administrative access to the control plane (e.g. Azure portal) of your Azure Database for PostgreSQL instances. In addition, maintain an inventory of the administrative accounts that have access to the data plane (within the database itself) of your Azure Database for PostgreSQL instances. (When creating the PostgreSQL server, you provide credentials for an administrator user. This administrator can be used to create additional PostgreSQL users.)

Azure Database for PostgreSQL does not support built-in role-based access control, but you can create custom roles based on specific resource provider operations.

- [Understand custom roles for Azure subscription](../role-based-access-control/custom-roles.md) 

- [Understand Azure Database for PostgreSQL resource provider operations](https://docs.microsoft.com/azure/role-based-access-control/resource-provider-operations#microsoftdbforpostgresql) 

- [Understand access management for Azure Database for PostgreSQL](https://docs.microsoft.com/azure/postgresql/concepts-security#access-management)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.2: Change default passwords where applicable

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3823).

**Guidance**: Azure Active Directory (Azure AD) and Azure Database for PostgreSQL do not have the concept of default passwords.

Upon creation of the Azure Database for PostgreSQL resource itself, Azure forces the creation of an administrative user with a strong password. However, once the PostgreSQL instance has been created, you may use the first server admin account you created account to create additional users and grant administrative access to them. When creating these accounts, ensure you configure a different, strong password for each account.

- [How to create additional accounts for Azure Database for PostgreSQL](howto-create-users.md)

- [How to update admin password](https://docs.microsoft.com/azure/postgresql/howto-create-manage-server-portal#update-admin-password)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.3: Use dedicated administrative accounts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3824).

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts that have access to your Azure Database for PostgreSQL instances. Use Azure Security Center Identity and access management to monitor the number of administrative accounts. 

- [Understand Azure Security Center Identity and Access](../security-center/security-center-identity-access.md) 

- [Understand how to create admin users in Azure Database for PostgreSQL](https://docs.microsoft.com/azure/postgresql/howto-create-users#the-server-admin-account)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.4: Use Azure Active Directory single sign-on (SSO)

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3825).

**Guidance**: Signing into Azure Database for PostgreSQL is supported both using username/password configured directly in the database, as well as using an Azure Active Directory (Azure AD) identity and utilizing an Azure AD token to connect. When using an Azure AD token, different methods are supported, such as an Azure AD user, an Azure AD group, or an Azure AD application connecting to the database.

Separately, control plane access for PostgreSQL is available via REST API and supports SSO. To authenticate, set the Authorization header for your requests to a JSON Web Token that you obtain from Azure AD.

- [Use Azure AD for authenticating with Azure Database for PostgreSQL](howto-configure-sign-in-aad-authentication.md)

- [Understand Azure Database for PostgreSQL REST API](/rest/api/postgresql/)

- [Understand SSO with Azure AD](../active-directory/manage-apps/what-is-single-sign-on.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.5: Use multi-factor authentication for all Azure Active Directory-based access

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3826).

**Guidance**: Enable Azure Active Directory (Azure AD) multifactor authentication and follow Azure Security Center Identity and Access Management recommendations. When utilizing Azure AD tokens for signing into your database, this allows you to require multifactor authentication for database sign-ins.

- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

- [Use Azure AD for authenticating with Azure Database for PostgreSQL](howto-configure-sign-in-aad-authentication.md)

- [How to monitor identity and access within Azure Security Center](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.6: Use secure, Azure-managed workstations for administrative tasks

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3827).

**Guidance**: Use Privileged Access Workstations (PAWs) with multifactor authentication configured to log into and configure Azure resources. 

- [Learn about Privileged Access Workstations](/security/compass/privileged-access-devices)
 
- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.7: Log and alert on suspicious activities from administrative accounts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3828).

**Guidance**: Enable Advanced Threat Protection for Azure Database for PostgreSQL to generate alerts for suspicious activity.

In addition, you may use Azure Active Directory (Azure AD) Privileged Identity Management (PIM) for generation of logs and alerts when suspicious or unsafe activity occurs in the environment.

Use Azure AD Risk Detections to view alerts and reports on risky user behavior.

- [How to setup Advanced Threat Protection for Azure Database for PostgreSQL](howto-database-threat-protection-portal.md)

- [How to deploy Privileged Identity Management (PIM)](../active-directory/privileged-identity-management/pim-deployment-plan.md)

- [Understand Azure AD risk detections](../active-directory/identity-protection/overview-identity-protection.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.8: Manage Azure resources from only approved locations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3829).

**Guidance**: Use Conditional Access Named Locations to allow portal and Azure Resource Manager access from only specific logical groupings of IP address ranges or countries/regions.

- [How to configure Named Locations in Azure](../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.9: Use Azure Active Directory

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3830).

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.

For signing into Azure Database for PostgreSQL, it is recommended to use Azure AD and use an Azure AD token to connect. When using an Azure AD token, different methods are supported, such as an Azure AD user, an Azure AD group, or an Azure AD application connecting to the database.

Azure AD credentials may also be used for administration at the management plane level (e.g. the Azure portal) to control PostgreSQL admin accounts.

- [Use Azure AD for authenticating with Azure Database for PostgreSQL](howto-configure-sign-in-aad-authentication.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.10: Regularly review and reconcile user access

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3831).

**Guidance**: Review the Azure Active Directory (Azure AD) logs to help discover stale accounts which can include those with Azure Database for PostgreSQL administrative roles. In addition, use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications that may be used to access Azure Database for PostgreSQL, and role assignments. User access should be reviewed on a regular basis such as every 90 days to make sure only the right Users have continued access.

- [Understand Azure AD Reporting](/azure/active-directory/reports-monitoring/)

- [How to use Azure Identity Access Reviews](../active-directory/governance/access-reviews-overview.md)

- [Review PostgreSQL users and assigned roles](https://www.postgresql.org/docs/current/database-roles.html)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.11: Monitor attempts to access deactivated credentials

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3832).

**Guidance**: Enable Diagnostic Settings for Azure Database for PostgreSQL and Azure Active Directory (Azure AD), sending all logs to a Log Analytics workspace. Configure desired alerts (such as failed authentication attempts) within Log Analytics.

- [How to configure and access Server Logs for Azure Database for PostgreSQL](howto-configure-server-logs-in-portal.md)

- [How to configure and access audit logs for Azure Database for PostgreSQL](concepts-audit.md)

- [How to integrate Azure Activity Logs into Azure Monitor](/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.12: Alert on account sign-in behavior deviation

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3833).

**Guidance**: Enable Advanced Threat Protection for Azure Database for PostgreSQL to generate alerts for suspicious activity.

Use Azure Active Directory (Azure AD)'s Identity Protection and risk detection features to configure automated responses to detected suspicious actions. You may enable automated responses through Azure Sentinel to implement your organization's security responses.

You can also ingest logs into Azure Sentinel for further investigation.

- [How to setup Advanced Threat Protection for Azure Database for PostgreSQL](howto-database-threat-protection-portal.md)

- [Overview of Azure AD Identity Protection](../active-directory/identity-protection/overview-identity-protection.md)

- [How to view Azure AD risky sign-ins](../active-directory/identity-protection/overview-identity-protection.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3834).

**Guidance**: Currently not available; Customer Lockbox is not yet supported for Azure Database for PostgreSQL.

- [List of Customer Lockbox supported services](https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview#supported-services-and-scenarios-in-general-availability)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](../security/benchmarks/security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive Information

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3835).

**Guidance**: Use tags to assist in tracking Azure Database for PostgreSQL instances or related resources that store or process sensitive information.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.2: Isolate systems storing or processing sensitive information

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3836).

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. Use a combination of Private Link, Service Endpoints, and/or firewall rules to isolate and limit network access to your Azure Database for PostgreSQL instances.

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create management groups](../governance/management-groups/create-management-group-portal.md)

- [How to configure Private Link for Azure Database for PostgreSQL](howto-configure-privatelink-portal.md)

- [How to create and manage VNet service endpoints and VNet rules in Azure Database for PostgreSQL](howto-manage-vnet-using-portal.md)

- [How to configure Azure Database for PostgreSQL firewall rules](concepts-firewall-rules.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.3: Monitor and block unauthorized transfer of sensitive information

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3837).

**Guidance**: When using Azure Virtual machines to access Azure Database for PostgreSQL instances, make use of Private Link, PostgreSQL network configurations, network security groups, and service tags to mitigate the possibility of data exfiltration.

Microsoft manages the underlying infrastructure for Azure Database for PostgreSQL and has implemented strict controls to prevent the loss or exposure of customer data.

- [How to mitigate data exfiltration for Azure Database for PostgreSQL](concepts-data-access-and-security-private-link.md)

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.4: Encrypt all sensitive information in transit

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3838).

**Guidance**: Azure Database for PostgreSQL supports connecting your PostgreSQL server to client applications using Transport Layer Security (TLS), previously known as Secure Sockets Layer (SSL). Enforcing TLS connections between your database server and your client applications helps protect against "man in the middle" attacks by encrypting the data stream between the server and your application. In the Azure portal, ensure "Enforce SSL connection" is enabled for all of your Azure Database for PostgreSQL instances by default.

Currently the TLS version supported for Azure Database for PostgreSQL are TLS 1.0, TLS 1.1, TLS 1.2.

- [How to configure encryption in transit for Azure Database for PostgreSQL](concepts-ssl-connection-security.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.DBforPostgreSQL**:

[!INCLUDE [Resource Policy for Microsoft.DBforPostgreSQL 4.4](../../includes/policy/standards/asb/rp-controls/microsoft.dbforpostgresql-4-4.md)]

### 4.5: Use an active discovery tool to identify sensitive data

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3839).

**Guidance**: Data identification, classification, and loss prevention features are not yet available for Azure Database for PostgreSQL. Implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.6: Use Azure RBAC to control access to resources 

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3840).

**Guidance**: Use Azure role-based access control (Azure RBAC) to control access to the Azure Database for PostgreSQL control plane (e.g. Azure portal). For data plane access (within the database itself), use SQL queries to create users and configure user permissions. Azure RBAC does not affect user permissions within the database.

- [How to configure Azure RBAC](../role-based-access-control/role-assignments-portal.md)

- [How to configure user access with SQL for Azure Database for PostgreSQL](howto-create-users.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.7: Use host-based data loss prevention to enforce access control

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3841).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for compute resources.

Microsoft manages the underlying infrastructure for Azure Database for PostgreSQL and has implemented strict controls to prevent the loss or exposure of customer data.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

### 4.8: Encrypt sensitive information at rest

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3842).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: The Azure Database for PostgreSQL service uses the FIPS 140-2 validated cryptographic module for storage encryption of data at-rest. Data, including backups, are encrypted on disk, with the exception of temporary files created while running queries. The service uses the AES 256-bit cipher included in Azure storage encryption, and the keys are system managed. Storage encryption is always on and can't be disabled.

Data encryption with customer-managed keys (CMK) for Azure Database for PostgreSQL Single server enables you to bring your own key (BYOK) for data protection at rest. At this time, you must request access to use this capability. To do so, contact:

AskAzureDBforPostgreSQL@service.microsoft.com.

- [Understand encryption at-rest for Azure Database for PostgreSQL](concepts-security.md)

- [Understand encryption at-rest for Azure Database for PostgreSQL using customer-managed keys](concepts-data-encryption-postgresql.md)

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

### 4.9: Log and alert on changes to critical Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3843).

**Guidance**: Use Azure Monitor with the Azure Activity Log to create alerts for when changes take place to production instances of Azure Database for PostgreSQL and other critical or related resources.

- [How to create alerts for Azure Activity Log events](/azure/azure-monitor/platform/alerts-activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Vulnerability Management

*For more information, see the [Azure Security Benchmark: Vulnerability Management](../security/benchmarks/security-control-vulnerability-management.md).*

### 5.1: Run automated vulnerability scanning tools

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3844).

**Guidance**: Follow recommendations from Azure Security Center on securing your Azure Database for PostgreSQL and related resources.

Microsoft performs vulnerability management on the underlying systems that support Azure Database for PostgreSQL.

- [Understand Azure Security Center recommendations](../security-center/recommendations-reference.md)

- [Feature coverage for Azure PaaS services in Azure Security Center](../security-center/features-paas.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 5.2: Deploy automated operating system patch management solution

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3845).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 5.3: Deploy automated patch management solution for third-party software titles

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3846).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 5.4: Compare back-to-back vulnerability scans

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3847).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3848).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Microsoft performs vulnerability management on the underlying systems that support Azure Database for PostgreSQL.

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

## Inventory and Asset Management

*For more information, see the [Azure Security Benchmark: Inventory and Asset Management](../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3849).

**Guidance**: Use Azure Resource Graph to query and discover all resources (including Azure Database for PostgreSQL instances) within your subscriptions. Ensure you have appropriate (read) permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions.

- [How to create queries with Azure Resource Graph](../governance/resource-graph/first-query-portal.md)

- [How to view your Azure Subscriptions](/powershell/module/az.accounts/get-azsubscription)

- [Understand Azure RBAC](../role-based-access-control/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.2: Maintain asset metadata

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3850).

**Guidance**: Apply tags to Azure Database for PostgreSQL instances and other related resources giving metadata to logically organize them into a taxonomy.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.3: Delete unauthorized Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3851).

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track Azure Database for PostgreSQL instances and related resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create management groups](../governance/management-groups/create-management-group-portal.md)

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.4: Define and maintain inventory of approved Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3852).

**Guidance**: Not applicable; this recommendation is intended for compute resources and Azure as a whole.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.5: Monitor for unapproved Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3853).

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

In addition, use the Azure Resource Graph to query/discover resources within the subscription(s).

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to create queries with Azure Graph](../governance/resource-graph/first-query-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.6: Monitor for unapproved software applications within compute resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3854).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 6.7: Remove unapproved Azure resources and software applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3855).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for compute resources and Azure as a whole.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 6.8: Use only approved applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3856).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 6.9: Use only approved Azure services

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3857).

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:
- Not allowed resource types
- Allowed resource types

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to deny a specific resource type with Azure Policy](/azure/governance/policy/samples/built-in-policies#general)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.10: Maintain an inventory of approved software titles

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3858).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 6.11: Limit users' ability to interact with Azure Resource Manager

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3859).

**Guidance**: Use the Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App. This can prevent the creation and changes to resources within a high security environment, such as instances of Azure Database for PostgreSQL containing sensitive information.

- [How to configure Conditional Access to block access to Azure Resource Manager](../role-based-access-control/conditional-access-azure-management.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.12: Limit users' ability to execute scripts within compute resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3860).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 6.13: Physically or logically segregate high risk applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3861).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

## Secure Configuration

*For more information, see the [Azure Security Benchmark: Secure Configuration](../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3862).

**Guidance**: Define and implement standard security configurations for your Azure Database for PostgreSQL instances with Azure Policy. Use Azure Policy aliases in the "Microsoft.DBforPostgreSQL" namespace to create custom policies to audit or enforce the network configuration of your Azure Database for PostgreSQL instances. You may also make use of built-in policy definitions related to your Azure Database for PostgreSQL instances, such as:
- Enforce TLS connection should be enabled for PostgreSQL database servers
- Log connections should be enabled for PostgreSQL database servers

- [How to view available Azure Policy aliases](/powershell/module/az.resources/get-azpolicyalias)

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.2: Establish secure operating system configurations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3863).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.3: Maintain secure Azure resource configurations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3864).

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Understand Azure Policy Effects](../governance/policy/concepts/effects.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.4: Maintain secure operating system configurations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3865).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.5: Securely store configuration of Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3866).

**Guidance**: If using custom Azure Policy definitions for your Azure Database for PostgreSQL instances and related resources, use Azure Repos to securely store and manage your code.

- [How to store code in Azure DevOps](/azure/devops/repos/git/gitworkflow)

- [Azure Repos Documentation](/azure/devops/repos/)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.6: Securely store custom operating system images

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3867).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.7: Deploy configuration management tools for Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3868).

**Guidance**: Use Azure Policy aliases in the "Microsoft.DBforPostgreSQL" namespace to create custom policies to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.8: Deploy configuration management tools for operating systems

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3869).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.9: Implement automated configuration monitoring for Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3870).

**Guidance**: Use Azure Policy aliases in the "Microsoft.DBforPostgreSQL" namespace to create custom policies to alert, audit, and enforce system configurations. Use Azure Policy [audit], [deny], and [deploy if not exist] to automatically enforce configurations for your Azure Database for PostgreSQL instances and related resources.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.10: Implement automated configuration monitoring for operating systems

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3871).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Responsibility**: Not applicable

**Azure Security Center monitoring**: None

### 7.11: Manage Azure secrets securely

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3872).

**Guidance**: For Azure Virtual Machines or web applications running on Azure App Service being used to access your Azure Database for PostgreSQL instances, use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure Azure Database for PostgreSQL secret management. Ensure Key Vault Soft Delete is enabled.

- [How to integrate with Azure Managed Identities](../azure-app-configuration/howto-integrate-azure-managed-service-identity.md)

- [How to create a Key Vault](../key-vault/general/quick-create-portal.md)

- [How to authenticate to Key Vault](../key-vault/general/authentication.md)

- [How to assign a Key Vault access policy](../key-vault/general/assign-access-policy-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.12: Manage identities securely and automatically

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3873).

**Guidance**: Azure Database for PostgreSQL server supports Azure Active Directory (Azure AD) authentication to access databases. While creating the Azure Database for PostgreSQL server, you provide credentials for an administrator user. This administrator can be used to create additional database users.

For Azure Virtual Machines or web applications running on Azure App Service being used to access your Azure Database for PostgreSQL server, use Managed Service Identity in conjunction with Azure Key Vault to store and retrieve credentials for Azure Database for PostgreSQL server. Ensure Key Vault Soft Delete is enabled.

Use Managed Identities to provide Azure services with an automatically managed identity in Azure AD. Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code.

- [How to configure Managed Identities](../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md)

- [How to integrate with Azure Managed Identities](../azure-app-configuration/howto-integrate-azure-managed-service-identity.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.13: Eliminate unintended credential exposure

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3874).

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Malware Defense

*For more information, see the [Azure Security Benchmark: Malware Defense](../security/benchmarks/security-control-malware-defense.md).*

### 8.1: Use centrally-managed anti-malware software

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3875).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for compute resources.

Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure App Service), however it does not run on customer content.

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3876).

**Guidance**: Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure Database for PostgreSQL), however it does not run on customer content.

Pre-scan any content being uploaded to non-compute Azure resources, such as App Service, Data Lake Storage, Blob Storage, Azure Database for PostgreSQL, etc. Microsoft cannot access your data in these instances.

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 8.3: Ensure anti-malware software and signatures are updated

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3877).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for compute resources.

Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure Database for PostgreSQL), however it does not run on customer content.

**Responsibility**: Microsoft

**Azure Security Center monitoring**: None

## Data Recovery

*For more information, see the [Azure Security Benchmark: Data Recovery](../security/benchmarks/security-control-data-recovery.md).*

### 9.1: Ensure regular automated back-ups

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3878).

**Guidance**: Azure Database for PostgreSQL takes backups of the data files and the transaction log. Depending on the supported maximum storage size, we either take full and differential backups (4 TB max storage servers) or snapshot backups (up to 16 TB max storage servers). These backups allow you to restore a server to any point-in-time within your configured backup retention period. The default backup retention period is seven days. You can optionally configure it up to 35 days. All backups are encrypted using AES 256-bit encryption.

- [How to backup a server in Azure Database for PostgreSQL](howto-restore-server-portal.md)

- [Understand Azure Database for PostgreSQL initial configuration](tutorial-design-database-using-azure-portal.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.DBforPostgreSQL**:

[!INCLUDE [Resource Policy for Microsoft.DBforPostgreSQL 9.1](../../includes/policy/standards/asb/rp-controls/microsoft.dbforpostgresql-9-1.md)]

### 9.2: Perform complete system backups and backup any customer-managed keys

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3879).

**Guidance**: Azure Database for PostgreSQL automatically creates server backups and stores them in either locally-redundant or geo-redundant storage, according to the user's choice. Backups can be used to restore your server to a point-in-time. Backup and restore are an essential part of any business continuity strategy because they protect your data from accidental corruption or deletion.

If using Azure Key Vault to store credentials for your Azure Database for PostgreSQL instances, ensure regular automated backups of your keys.

- [How to backup a server in Azure Database for PostgreSQL](howto-restore-server-portal.md)

- [How to backup Key Vault Keys](/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey)

**Responsibility**: Shared

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.DBforPostgreSQL**:

[!INCLUDE [Resource Policy for Microsoft.DBforPostgreSQL 9.2](../../includes/policy/standards/asb/rp-controls/microsoft.dbforpostgresql-9-2.md)]

### 9.3: Validate all backups including customer-managed keys

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3880).

**Guidance**: In Azure Database for PostgreSQL, performing a restore creates a new server from the original server's backups. There are two types of restore available: Point-in-time restore and Geo-restore. Point-in-time restore is available with either backup redundancy option and creates a new server in the same region as your original server. Geo-restore is available only if you configured your server for geo-redundant storage and it allows you to restore your server to a different region.

The estimated time of recovery depends on several factors including the database sizes, the transaction log size, the network bandwidth, and the total number of databases recovering in the same region at the same time. The recovery time is usually less than 12 hours.

Periodically test restoration of your Azure Database for PostgreSQL instances.

- [How to backup a server in Azure Database for PostgreSQL](howto-restore-server-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.4: Ensure protection of backups and customer-managed keys

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3881).

**Guidance**: Azure Database for PostgreSQL takes full, differential, and transaction log backups. These backups allow you to restore a server to any point-in-time within your configured backup retention period. The default backup retention period is seven days. You can optionally configure it up to 35 days. All backups are encrypted using AES 256-bit encryption.

- [Understand backup and restore in Azure Database for PostgreSQL](concepts-backup.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3882).

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.

- [How to configure Workflow Automations within Azure Security Center](../security-center/security-center-planning-and-operations-guide.md)

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Customer may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.2: Create an incident scoring and prioritization procedure

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3883).

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, clearly mark subscriptions (for ex. production, non-prod) and create a naming system to clearly identify and categorize Azure resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.3: Test security response procedures

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3884).

**Guidance**: Conduct exercises to test your systems' incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

- [Refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3885).

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that the customer's data has been accessed by an unlawful or unauthorized party.  Review incidents after the fact to ensure that issues are resolved.

- [How to set the Azure Security Center Security Contact](../security-center/security-center-provide-security-contact-details.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.5: Incorporate security alerts into your incident response system

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3886).

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts Sentinel.

- [How to configure continuous export](../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../sentinel/connect-azure-security-center.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.6: Automate the response to security alerts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3887).

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.

- [How to configure Workflow Automation and Logic Apps](../security-center/workflow-automation.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Penetration Tests and Red Team Exercises

*For more information, see the [Azure Security Benchmark: Penetration Tests and Red Team Exercises](../security/benchmarks/security-control-penetration-tests-red-team-exercises.md).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/3888).

**Guidance**: Follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies:

https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1

- [You can find more information on Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications, here](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Next steps

- See the [Azure Security Benchmark V2 overview](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
