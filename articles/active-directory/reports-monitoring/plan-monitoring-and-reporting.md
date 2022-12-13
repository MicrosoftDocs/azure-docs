---

title: Plan reports & monitoring deployment - Azure AD
description: Describes how to plan and execute implementation of reporting and monitoring.
services: active-directory
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.topic: conceptual
ms.workload: identity
ms.subservice: report-monitor
ms.date: 12/13/2022
ms.author: gasinh
ms.reviewer: plenzke 

# Customer intent: For an Azure AD administrator to monitor logs and report on access 
ms.collection: M365-identity-device-management
---

# Azure Active Directory reporting and monitoring deployment dependencies

Your Azure Active Directory (Azure AD) reporting and monitoring solution depends on legal, security, operational requirements, and your environment's processes. Use the following sections to learn about design options and deployment strategy.

## Benefits of Azure AD reporting and monitoring

Azure AD reporting has a view, and logs, of Azure AD activity in your environment: sign-in and audit events, also changes to your directory.

Use data output to:

* determine how apps and services are used
* detect potential risks affecting environment health
* troubleshoot user issues
* obtain insights from audits of changes to your directory

> [!IMPORTANT]
> Use Azure AD monitoring to route Azure AD reporting logs to target systems. Retain the data, or integrate it with third-party security information and event-management (SIEM) tools for more insights.

With Azure AD monitoring, you can route logs to:

* an Azure storage account for archival
* Azure Monitor logs, where you can analyze data, create dashboards, and build event alerts
* an Azure event hub to integrate with SIEM tools, such as Splunk, Sumologic, or QRadar

> [!NOTE]
> The term Azure Monitor logs has replaced Log Analytics. Log data is stored in a Log Analytics workspace and collected and analyzed by the Log Analytics service. 

Learn more about: 

* [Azure Monitor data platform](../../azure-monitor/data-platform.md)
* [Azure Monitor naming and terminology changes](../../azure-monitor/terminology.md)
* [How long does Azure AD store reporting data?](./reference-reports-data-retention.md)

### Licensing and prerequisites for Azure AD reporting and monitoring

* To access the Azure AD sign-in logs, you'll need an Azure AD premium license
  * [Azure Active Directory plans and pricing](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing)
* Global Administrator or Security Administrator permissions for the Azure AD tenant
* One of the following items:
  * An Azure storage account with ListKeys permissions. We recommend general storage, not Blob. See the [pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=storage).
  * An Azure Event Hubs namespace to integrate with SIEM solutions
  * An Azure Log Analytics workspace to send logs to Azure Monitor logs

## Stakeholders, communications, and documentation

Use the following sections to define the users who consume and monitor reports, and your Azure AD monitoring architecture.

### Engage stakeholders

Successful projects align expectations, outcomes, and responsibilities. See, [Azure Active Directory deployment plans](../fundamentals/active-directory-deployment-plans.md). Document and communicate stakeholder roles that require input and accountability.

### Communications plan

Tell your users when, and how, their experience will change. Provide contact information for support.

### Document current infrastructure and policies

Your current infrastructure and policies affect reporting and monitoring design. Gather and document the following information:

* SIEM tools in use
* Azure infrastructure: storage accounts and monitoring in use
* Organizational log retention policies
  * Include required compliance frameworks

## Retention, analytics, insights, and SIEM integration considerations

Reporting and monitoring help meet business requirements, gain insights into usage patterns, and increases security posture.

Business use cases:

* Required to meet business needs
* Nice to have to meet business needs
* Not applicable

### Considerations

* **Retention** - Log retention: store audit logs and sign in logs of Azure AD longer than 30 days
* **Analytics** - Logs are searchable with analytic tools
* **Operational and security insights** - Provide access to application usage, sign-in errors, self-service usage, trends, etc.
* **SIEM integration** - Integrate and stream Azure AD sign-in logs and audit logs to SIEM systems

### Monitoring solution architecture

With Azure AD monitoring, you can route Azure AD activity logs and retain them for long-term reporting and analysis to gain environment insights, and integrate it with SIEM tools. Use the following decision flow chart to help select an architecture.

![Decision matrix for business-need architecture.](media/reporting-deployment-plan/deploy-reporting-flow-diagram.png)

#### Archive logs in a storage account

You can keep logs longer than the default retention period by routing them to an Azure storage account.

> [!IMPORTANT]
> Use this archival method if there is no need to integrate logs with a SIEM system, or no need for ongoing queries and analysis. You can use on-demand searches.

Learn more:

* [How long does Azure AD store reporting data?](./reference-reports-data-retention.md)
* [Tutorial: Archive Azure AD logs to an Azure storage account](./quickstart-azure-monitor-route-logs-to-storage-account.md)

#### Send logs to Azure Monitor logs

[Azure Monitor logs](../../azure-monitor/logs/log-query-overview.md) consolidate monitoring data from different sources. Use the query language and analytics engine for insights on application operation and resource usage. Retrieve, monitor, and alert on collected data by sending Azure AD activity logs to Azure Monitor logs. 

> [!IMPORTANT]
> Use this logging method if there is no SIEM solution for receiving data. You can conduct queries and analysis. After data is in Azure Monitor logs, you can send it to your event hub, and then to a SIEM.

Learn more:

* [Integrate Azure AD logs with Azure Monitor logs](./howto-integrate-activity-logs-with-log-analytics.md).
* [Analyze Azure AD activity logs with Azure Monitor logs](/MicrosoftDocs/azure-docs/blob/main/articles/active-directory/reports-monitoring/howto-analyze-activity-logs-log-analytics.md).

#### Route logs to your Azure event hub

Routing logs to an Azure event hub enables integration with SIEM tools. For more insights, combine Azure AD activity log data with other data managed by your SIEM. 

Learn more: [Tutorial: Stream Azure Active Directory logs to an Azure event hub](./tutorial-azure-monitor-stream-logs-to-event-hub.md).

## Roles

Stakeholders need access to Azure AD logs. These users likely are the security teams, auditors (internal or external), identity and access management operations teams, etc.

Use Azure AD roles to delegate configuration and permit who views or reads Azure AD Reports. The following roles read Azure AD reports:

* Global Admin
* Security Admin
* Security Reader
* Reports Reader

Learn more: [Azure AD built-in roles](../roles/permissions-reference.md)

> [!NOTE]
>To increase account security, apply the concept of least privileges. 
>Learn more: [What is Azure AD Privileged Identity Management?](../privileged-identity-management/pim-configure.md).

## Deployment options

Use the following guidance to review deployment options.

### Implement monitoring and analytics

* [What are Azure Active Directory reports?](./overview-reports.md)

* [Interpret the Azure AD sign-in logs schema in Azure Monitor](./reference-azure-monitor-sign-ins-log-schema.md)

* [How to: Integrate Azure Active Directory logs with Splunk using Azure Monitor](./howto-integrate-activity-logs-with-splunk.md)

* [Integrate Azure Active Directory logs with SumoLogic using Azure Monitor](./howto-integrate-activity-logs-with-sumologic.md)


## Next steps

[What is Azure AD Privileged Identity Management?](../privileged-identity-management/pim-configure.md) 

[What is Azure role-based access control (Azure RBAC)?](../../role-based-access-control/overview.md)
