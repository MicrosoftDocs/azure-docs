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

## Azure reporting and monitoring deployment project

Use the following sections to define the users who consume and monitor reports, and your Azure AD monitoring architecture.

### Engage stakeholders

Successful projects align expectations, outcomes, and responsibilities. See, [Azure Active Directory deployment plans](../fundamentals/active-directory-deployment-plans.md). Document and communicate stakeholder roles that require input and accountability.

### Communications plan

Tell your users how and when the experience will change. Provide contact information for support.

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

With Azure AD monitoring, you can route Azure AD activity logs and retain them for long-term reporting and analysis to gain insights into your environment, and integrate it with SIEM tools.

Decision flow chart![An image showing what is described in subsequent sections](media/reporting-deployment-plan/deploy-reporting-flow-diagram.png)

#### Archive logs in a storage account

By routing logs to an Azure storage account, you can keep them for longer than the default retention period outlined in our [retention policies](./reference-reports-data-retention.md). Use this method if you need to archive your logs, but don't need to integrate them with an SIEM system, and don't need ongoing queries and analysis. You can still do on-demand searches.

Learn how to [route data to your storage account](./quickstart-azure-monitor-route-logs-to-storage-account.md).

#### Send logs to Azure Monitor logs

[Azure Monitor logs](../../azure-monitor/logs/log-query-overview.md) consolidate monitoring data from different sources. It also provides a query language and analytics engine that gives you insights into the operation of your applications and use of resources. By sending Azure AD activity logs to Azure Monitor logs, you can quickly retrieve, monitor, and alert on collected data. Use this method when you don't have an existing SIEM solution that you want to send your data to directly but do want queries and analysis. Once your data is in Azure Monitor logs, you can then send it to event hub, and from there to a SIEM if you want to.

Learn how to [send data to Azure Monitor logs](./howto-integrate-activity-logs-with-log-analytics.md).

You can also install the pre-built views for Azure AD activity logs to monitor common scenarios involving sign-in and audit events.

Learn how to [install and use log analytics views for Azure AD activity logs](./howto-install-use-log-analytics-views.md).

#### Stream logs to your Azure event hub

Routing logs to an Azure event hub enables integration with third-party SIEM tools. This integration allows you to combine Azure AD activity log data with other data managed by your SIEM, to provide richer insights into your environment. 

Learn how to [stream logs to an event hub](./tutorial-azure-monitor-stream-logs-to-event-hub.md).

## Plan Operations and Security for Azure AD reporting and monitoring

Stakeholders need to access Azure AD logs to gain operational insights. Likely users include security team members, internal or external auditors, and the identity and access management operations team.

Azure AD roles enable you to delegate the ability to configure and view Azure AD Reports based on your role. Identify who in your organization needs permission to read Azure AD reports and what role would be appropriate for them. 

The following roles can read Azure AD reports:

* Global Admin

* Security Admin

* Security Reader

* Reports Reader

Learn More About [Azure AD Administrative Roles](../roles/permissions-reference.md).

*Always apply the concept of least privileges to reduce the risk of an account compromise*. Consider implementing [Privileged Identity Management](../privileged-identity-management/pim-configure.md) to further secure your organization.


## Deploy Azure AD reporting and monitoring

Depending on the decisions you have made earlier using the design guidance above, this section will guide you to the documentation on the different deployment options.

### Consume and archive Azure AD logs

[Find activity reports in the Azure portal](./howto-find-activity-reports.md)

[Archive Azure AD logs to an Azure Storage account](./quickstart-azure-monitor-route-logs-to-storage-account.md)

### Implement monitoring and analytics

[Send logs to Azure Monitor](./howto-integrate-activity-logs-with-log-analytics.md)

[Install and use the log analytics views for Azure Active Directory](./howto-install-use-log-analytics-views.md)

[Analyze Azure AD activity logs with Azure Monitor logs](./howto-analyze-activity-logs-log-analytics.md)

* [Interpret audit logs schema in Azure Monitor](./overview-reports.md)

* [Interpret sign in logs schema in Azure Monitor](./reference-azure-monitor-sign-ins-log-schema.md)

 * [Stream Azure AD logs to an Azure event hub](./tutorial-azure-monitor-stream-logs-to-event-hub.md)

* [Integrate Azure AD logs with Splunk by using Azure Monitor](./howto-integrate-activity-logs-with-splunk.md)

* [Integrate Azure AD logs with SumoLogic by using Azure Monitor](./howto-integrate-activity-logs-with-sumologic.md)

 

 

## Next steps

Consider implementing [Privileged Identity Management](../privileged-identity-management/pim-configure.md) 

Consider implementing [Azure role-based access control](../../role-based-access-control/overview.md)
