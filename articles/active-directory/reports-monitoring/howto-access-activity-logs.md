---
title: Access activity logs in Azure AD
description: Learn how to choose the right method for accessing the activity logs in Azure AD.
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.subservice: report-monitor
ms.date: 04/27/2023
ms.author: sarahlipsey
ms.reviewer: besiler

ms.collection: M365-identity-device-management
---

# How To: Access activity logs in Azure AD

The data in your Azure Active Directory (Azure AD) logs enables you to assess many aspects of your Azure AD tenant. To cover a broad range of scenarios, Azure AD provides you with various options to access your activity log data. As an IT administrator, you need to understand the intended uses cases for these options, so that you can select the right access method for your scenario.  

You can access Azure AD activity logs and reports using the following methods:

- [Stream activity logs to an **event hub** to integrate with other tools](#stream-logs-to-an-event-hub-to-integrate-with-siem-tools)
- [Access activity logs through the **Microsoft Graph API**](#access-logs-with-microsoft-graph-api)
- [Integrate logs with **Azure Monitor logs**](#integrate-logs-with-azure-monitor-logs)
- [Monitor activity in real-time with **Microsoft Sentinel**](#monitor-events-with-microsoft-sentinel)
- [View activity logs and reports in the **Azure portal**](#view-logs-through-the-portal)
- [Export activity logs for **storage and queries**](#export-logs-for-storage-and-queries)

Each of these methods provides you with capabilities that may align with certain scenarios. This article describes those scenarios, including recommendations and details about related reports that use the data in the activity logs. Explore the options in this article to learn about those scenarios so you can choose the right method.
## Prerequisites

The required roles and licenses may vary based on the report. Global Administrator can access all reports, but we recommend using a role with least privilege access to align with the [Zero Trust guidance](/security/zero-trust/zero-trust-overview).

| Log / Report | Roles | Licenses |
|--|--|--|
| Audit | Report Reader<br>Security Reader<br>Security Administrator<br>Global Reader | All editions of Azure AD |
| Sign-ins | Report Reader<br>Security Reader<br>Security Administrator<br>Global Reader | All editions of Azure AD |
| Provisioning | Same as audit and sign-ins, plus<br>Security Operator<br>Application Administrator<br>Cloud App Administrator<br>A custom role with `provisioningLogs` permission | Premium P1/P2 |
| Usage and insights | Security Reader<br>Reports Reader<br> Security Administrator | Premium P1/P2 |
| Identity Protection* | Security Administrator<br>Security Operator<br>Security Reader<br>Global Reader | Azure AD Free/Microsoft 365 Apps<br>Azure AD Premium P1/P2 |

*The level of access and capabilities for Identity Protection varies with the role and license. For more information, see the [license requirements for Identity Protection](../identity-protection/overview-identity-protection.md#license-requirements).

Activity reports are available for features that you've licensed. To access the sign-ins activity logs, your tenant must have an Azure AD Premium license associated with it.
## Stream logs to an event hub to integrate with SIEM tools

Streaming your activity logs to an event hub is required to integrate your activity logs with Security Information and Event Management (SIEM) tools, such as Splunk and SumoLogic. Before you can stream logs to an event hub, you need to [set up an Event Hubs namespace and an event hub](../../event-hubs/event-hubs-create.md) in your Azure subscription. 

### Recommended uses

The SIEM tools you can integrate with your event hub can provide analysis and monitoring capabilities. If you're already using these tools to ingest data from other sources, you can stream your identity data for more comprehensive analysis and monitoring. We recommend streaming your activity logs to an event hub for the following types of scenarios:

- If you need a big data streaming platform and event ingestion service to receive and process millions of events per second.
- If you're looking to transform and store data by using a real-time analytics provider or batching/storage adapters.

### Quick steps

1. Navigate to the [Azure portal](https://portal.azure.com) using one of the required roles.
1. Create an Event Hub namespace and event hub.
1. Go to **Azure AD** > **Diagnostic settings**.
1. Choose the logs you want to stream, select the **Stream to an event hub** option, and complete the fields.
    - [Set up an Event Hubs namespace and an event hub](../../event-hubs/event-hubs-create.md)
    - [Learn more about streaming activity logs to an event hub](tutorial-azure-monitor-stream-logs-to-event-hub.md)

 Your independent security vendor should provide you with instructions on how to ingest data from Azure Event Hubs into their tool.

## Access logs with Microsoft Graph API

The Microsoft Graph API provides a RESTful way to query sign-in data from Azure AD in Azure AD Premium tenants It doesn't require an administrator or developer to set up additional infrastructure to support your script or app. The Microsoft Graph API is **not** designed for pulling large amounts of activity data. Pulling large amounts of activity data using the API leads to issues with pagination and performance. 

### Recommended uses

The Microsoft Graph API provides a unified programmability model that you can use to access data for your tenant. Using Microsoft Graph explorer, you can run queries to help you with the following types of scenarios:

- View tenant activities such as who made a change to a group and when
- Mark an Azure AD sign-in event as safe or confirmed compromised
- Retrieve a list of application sign-ins for the last 30 days

### Quick steps

1. Configure the prerequisites. 
1. Sign in to [Graph Explorer](https://aka.ms/ge).
1. Select **GET** as the HTTP method from the dropdown.
1. Set the API version to **beta** or **v1.0**, depending on the query.
1. Add a query then select the **Run query** button.
    - [Familiarize yourself with the Microsoft Graph properties for directory audits](/graph/api/resources/directoryaudit)
    - [Complete the MS Graph Quickstart guide](quickstart-access-log-with-graph-api.md)
 
## Integrate logs with Azure Monitor logs

With the Azure Monitor logs integration you can enable rich visualizations, monitoring, and alerting on the connected data. Log Analytics provides enhanced query and analysis capabilities for Azure AD activity logs. To integrate Azure AD activity logs with Azure Monitor logs, you need a Log Analytics workspace. From there you can run queries through Log Analytics.

### Recommended uses

Integrating Azure AD logs with Azure Monitor logs provides a centralized location for querying logs. We recommend integrating logs with Azure Monitor logs for the following types of scenarios:

- Compare Azure AD sign-in logs with logs published by other Azure services
- Correlate sign-in logs against Azure Application insights
- Query logs using several specific search parameters
 
### Quick steps

1. Navigate to the [Azure portal](https://portal.azure.com) using one of the required roles.
1. Create a Log Analytics workspace.
1. Go to **Azure AD** > **Diagnostic settings**.
1. Choose the logs you want to stream, select the **Send to Log Analytics workspace** option, and complete the fields.
    - [Create a Log Analytics workspace](../../azure-monitor/learn/quick-create-workspace.md)
    - [Integrate Azure AD logs with Azure Monitor logs](howto-integrate-activity-logs-with-log-analytics.md)
1. Go to **Azure AD** > **Log Analytics** and begin querying the data.
    - [Learn how to query Azure AD logs](howto-analyze-activity-logs-log-analytics.md)
## Monitor events with Microsoft Sentinel

Sending sign-in and audit data to Microsoft Sentinel provides your security operations center with near real-time security detection and threat hunting. The term *threat hunting* refers to a proactive approach to improve the security posture of your environment. As opposed to classic protection, thread hunting tries to proactively identify potential threats that might harm your system. Your activity log data might be part of your threat hunting solution.

### Recommended uses

We recommend using the real-time security detection capabilities of Microsoft Sentinel if your organization needs security analytics and thread intelligence. Use Microsoft Sentinel if you need to:

- Collect security data across your enterprise
- Detect threats with vast threat intelligence
- Investigate critical incidents guided by AI
- Respond rapidly and automate protection

### Quick steps

1. Learn about the [prerequisites](../../sentinel/prerequisites.md), [roles and permissions](../../sentinel/roles.md).
1. [Estimate potential costs](../../sentinel/billing.md).
1. [Onboard to Microsoft Sentinel](../../sentinel/quickstart-onboard.md).
1. [Collect Azure AD data](../../sentinel/connect-azure-active-directory.md).
1. [Begin hunting for threats](../../sentinel/hunting.md).


## View logs through the Portal

For one-off investigations with a limited scope, the [Azure portal](https://portal.azure.com) is often the easiest way to find the data you need. The user interface for each of these reports provides you with filter options enabling you to find the entries you need to solve your scenario. 

The data captured in the Azure AD activity logs are used in many reports and services. You can review the sign-in, audit, and provisioning logs for one-off scenarios or use reports to look at patterns and trends. The data from the activity logs help populate the Identity Protection reports, which provide information security related risk detections that Azure AD can detect and report on. Azure AD activity logs also populate Usage and insights reports, which provide usage details for your tenant's applications. 

### Recommended uses

The reports available in the Azure portal provide a wide range of capabilities to monitor activities and usage in your tenant. The following list of uses and scenarios is not exhaustive, so explore the reports for your needs.

- Sign-in logs are helpful when researching a user's sign-in activity or to track an application's usage. 
- With audit logs you can review details around group name changes, device registration, password resets, and more.
- Use the Identity Protection reports to monitor at risk users, risky workload identities, and risky sign-ins.
- To ensure that your users can access the applications in use in your tenant, you can review the sign-in success rate in the Azure AD application activity (preview) report from Usage and insights.
- Compare the different authentication methods your users prefer with the Authentication methods report from Usage and insights.

### Quick steps

Use the following basic steps to access the reports in the Azure portal. 
#### Azure AD activity logs

1. Go to **Azure AD** and select **Audit logs**, **Sign-in logs**, or **Provisioning logs** from the **Monitoring** menu.
1. Adjust the filter according to your needs.
    - [Learn how to filter activity logs](quickstart-filter-audit-log.md)
    - [Explore the Azure AD audit log categories and activities](reference-audit-activities.md). 
    - [Learn about basic info in the Azure AD sign-in logs](reference-basic-info-sign-in-logs.md).

#### Azure AD Identity Protection reports

1. Go to **Azure AD** > **Security** > **Identity Protection**.
1. Explore the available reports.
    - [Learn more about Identity Protection](../identity-protection/overview-identity-protection.md)
    - [Learn how to investigate risk](../identity-protection/howto-identity-protection-investigate-risk.md)

#### Usage and insights reports

1. Go to **Azure AD** and select **Usage and insights** from the **Monitoring** menu.
1. Explore the available reports.
    - [Learn more about the Usage and insights report](concept-usage-insights-report.md)

## Export logs for storage and queries

The right solution for your long-term storage depends on your budget and what you plan on doing with the data. You've got three options:
  
- Archive logs to Azure Storage
- Download logs for manual storage
- Integrate logs with Azure Monitor logs
  
[Azure Storage](../../storage/common/storage-introduction.md) is the right solution if you aren't planning on querying your data often. For more information, see [Archive directory logs to a storage account](quickstart-azure-monitor-route-logs-to-storage-account.md).

If you plan to query the logs often to run reports or perform analysis on the stored logs, you should integrate your data with Azure Monitor. Azure Monitor provides you with built-in reporting and alerting capabilities. To utilize this integration, you need to set up a Log Analytics workspace. Once you have the integration set up, you can use Log Analytics to query your logs. 

If your budget is tight, and you need a cheap method to create a long-term backup of your activity logs, you can [manually download your logs](howto-download-logs.md). The user interface of the activity logs in the portal provides you with an option to download the data as **JSON** or **CSV**. One trade off of the manual download is that it requires a lot of manual interaction. If you are looking for a more professional solution, use either Azure Storage or Azure Monitor.

### Recommended uses

We recommend setting up a storage account to archive your activity logs for those governance and compliance scenarios where long-term storage is required. 

If you want to long-term storage *and* you want to run queries against the data, we recommend integrating your activity logs with Azure Monitor Logs

We recommend manually downloading and storing your activity logs if you have budgetary constraints.

### Quick steps

Use the following basic steps to archive or download your activity logs.

### Archive activity logs to a storage account

1. Navigate to the [Azure portal](https://portal.azure.com) using one of the required roles.
1. Create an storage account.
1. Go to **Azure AD** > **Diagnostic settings**.
1. Choose the logs you want to stream, select the **Archive to a storage account** option, and complete the fields.
    - [Review the data retention policies](reference-reports-data-retention.md)

#### Manually download activity logs

1. Navigate to the [Azure portal](https://portal.azure.com) using one of the required roles.
1. Go to **Azure AD** and select **Audit logs**, **Sign-in logs**, or **Provisioning logs** from the **Monitoring** menu.
1. Select **Download**.
    - [Learn more about how to download logs](howto-download-logs.md).

## Help me choose the right method

To help choose the right method for accessing Azure AD activity logs, think about the overall task you're trying to accomplish. We've grouped the tasks and options into three main categories:

- Troubleshooting
- Long-term storage
- Monitoring, insights, and integrations

### Troubleshooting

If you're performing troubleshooting tasks but you don't need to retain the logs for more than 30 days, we recommend using the Azure Portal or Microsoft Graph to access activity logs. You can filter the logs for your scenario and export or download them as needed.

If you're performing troubleshooting tasks *and* you need to retain the logs for more than 30 days, take a look at the long-term storage options.

### Long-term storage

If you're performing troubleshooting tasks *and* you need to retain the logs for more than 30 days, you can export your logs to an Azure storage account. This option is ideal of you don't plan on querying that data often.

If you need to query the data that you're retaining for more than 30 days, take a look at the monitoring, insights, and integrations options.

### Monitoring, insights, and integrations

If your scenario requires that you retain data for more than 30 days *and* you plan on querying that data on a regular basis, you've got a few options to integrate your data with SIEM tools for analysis and monitoring.

If you have a 3rd party SIEM tool, we recommend setting up an Event Hub namespace and event hub that you can stream your data through. With an event hub, you can stream logs to one of the supported SIEM tools.

If you don't plan on using a third-party SIEM tool, we recommend sending your Azure AD activity logs to Azure Monitor logs. With this integration, you can query your activity logs with Log Analytics. If you decide to integrate with SIEM tools later, you can stream your Azure AD activity logs along with your other Azure data through an event hub. 

## Next steps

* [Get data using the Azure Active Directory reporting API with certificates](tutorial-access-api-with-certificates.md)
* [Audit API reference](/graph/api/resources/directoryaudit) 
* [Sign-in activity report API reference](/graph/api/resources/signin)

