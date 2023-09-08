---
title: Best practices for data collection in Microsoft Sentinel
description: Learn about best practices to employ when connecting data sources to Microsoft Sentinel.
author: limwainstein
ms.author: lwainstein
ms.topic: conceptual
ms.date: 01/09/2023
---

#  Data collection best practices

This section reviews best practices for collecting data using Microsoft Sentinel data connectors. For more information, see [Connect data sources](connect-data-sources.md), [Microsoft Sentinel data connectors reference](data-connectors-reference.md), and the [Microsoft Sentinel solutions catalog](sentinel-solutions-catalog.md).

## Prioritize your data connectors

Learn how to [prioritize your data connectors](prioritize-data-connectors.md) as part of the Microsoft Sentinel deployment process.

## Filter your logs before ingestion

You may want to filter the logs collected, or even log content, before the data is ingested into Microsoft Sentinel. For example, you may want to filter out logs that are irrelevant or unimportant to security operations, or you may want to remove unwanted details from log messages. Filtering message content may also be helpful when trying to drive down costs when working with Syslog, CEF, or Windows-based logs that have many irrelevant details.

Filter your logs using one of the following methods:

- **The Azure Monitor Agent**. Supported on both Windows and Linux to ingest [Windows security events](connect-windows-security-events.md). Filter the logs collected by configuring the agent to collect only specified events.

- **Logstash**. Supports filtering message content, including making changes to the log messages. For more information, see [Connect with Logstash](create-custom-connector.md#connect-with-logstash).

> [!IMPORTANT]
> Using Logstash to filter your message content will cause your logs to be ingested as custom logs, causing any [free-tier logs](billing.md#free-data-sources) to become paid-tier logs.
>
> Custom logs also need to be worked into [analytics rules](automate-incident-handling-with-automation-rules.md), [threat hunting](hunting.md), and [workbooks](get-visibility.md), as they aren't automatically added. Custom logs are also not currently supported for [Machine Learning](bring-your-own-ml.md) capabilities.
>

## Alternative data ingestion requirements

Standard configuration for data collection may not work well for your organization, due to various challenges. The following tables describe common challenges or requirements, and possible solutions and considerations.

> [!NOTE]
> Many solutions listed in the following sections require a custom data connector. For more information, see [Resources for creating Microsoft Sentinel custom connectors](create-custom-connector.md).
>

### On-premises Windows log collection


|Challenge / Requirement  |Possible solutions  |Considerations  |
|---------|---------|---------|
|**Requires log filtering**     | Use Logstash <br><br>Use Azure Functions <br><br> Use LogicApps <br><br> Use custom code (.NET, Python)  |  While filtering can lead to cost savings, and ingests only the required data, some Microsoft Sentinel features aren't supported, such as [UEBA](identify-threats-with-entity-behavior-analytics.md), [entity pages](entity-pages.md), [machine learning](bring-your-own-ml.md), and [fusion](fusion.md). <br><br>When configuring log filtering, make updates in resources such as threat hunting queries and analytics rules     |
|**Agent cannot be installed**     |Use Windows Event Forwarding, supported with the [Azure Monitor Agent](connect-windows-security-events.md#connector-options)       |   Using Windows Event forwarding lowers load-balancing events per second from the Windows Event Collector, from 10,000 events to 500-1000 events.|
|**Servers do not connect to the internet**     | Use the [Log Analytics gateway](../azure-monitor/agents/gateway.md)        | Configuring a proxy to your agent requires extra firewall rules to allow the Gateway to work.        |
|**Requires tagging and enrichment at ingestion**     |Use Logstash to inject a ResourceID <br><br>Use an ARM template to inject the ResourceID into on-premises machines <br><br>Ingest the resource ID into separate workspaces        | Log Analytics doesn't support RBAC for custom tables <br><br>Microsoft Sentinel doesn’t support row-level RBAC <br><br>**Tip**: You may want to adopt cross workspace design and functionality for Microsoft Sentinel.        |
|**Requires splitting operation and security logs**     | Use the [Microsoft Monitor Agent or Azure Monitor Agent](connect-windows-security-events.md) multi-home functionality        |  Multi-home functionality requires more deployment overhead for the agent.       |
|**Requires custom logs**     |   Collect files from specific folder paths <br><br>Use API ingestion <br><br>Use PowerShell <br><br>Use Logstash     |   You may have issues filtering your logs. <br><br>Custom methods aren't supported. <br><br>Custom connectors may require developer skills.       |


### On-premises Linux log collection

|Challenge / Requirement  |Possible solutions  |Considerations  |
|---------|---------|---------|
|**Requires log filtering**     | Use Syslog-NG <br><br>Use Rsyslog <br><br>Use FluentD configuration for the agent <br><br> Use the Azure Monitor Agent/Microsoft Monitoring Agent <br><br> Use Logstash  |  Some Linux distributions might not be supported by the agent. <br> <br>Using Syslog or FluentD requires developer knowledge. <br><br>For more information, see [Connect to Windows servers to collect security events](connect-windows-security-events.md) and [Resources for creating Microsoft Sentinel custom connectors](create-custom-connector.md).      |
|**Agent cannot be installed**     |  Use a Syslog forwarder, such as (syslog-ng or rsyslog.       |         |
|**Servers do not connect to the internet**       | Use the [Log Analytics gateway](../azure-monitor/agents/gateway.md)        | Configuring a proxy to your agent requires extra firewall rules to allow the Gateway to work.          |
|**Requires tagging and enrichment at ingestion**      | Use Logstash for enrichment, or custom methods, such as API or Event Hubs.         | You may have extra effort required for filtering.    |
|**Requires splitting operation and security logs**     |  Use the [Azure Monitor Agent](connect-windows-security-events.md) with the multi-homing configuration.       |         |
|**Requires custom logs**     |    Create a custom collector using the Microsoft Monitoring (Log Analytics) agent.      |      |


### Endpoint solutions

If you need to collect logs from Endpoint solutions, such as EDR, other security events, Sysmon, and so on, use one of the following methods:

- **MTP connector** to collect logs from Microsoft 365 Defender for Endpoint. This option incurs extra costs for the data ingestion.
- **Windows Event Forwarding**.

> [!NOTE]
> Load balancing cuts down on the events per second that can be processed to the workspace.
>

### Office data

If you need to collect Microsoft Office data, outside of the standard connector data, use one of the following solutions:

|Challenge / Requirement  |Possible solutions  |Considerations  |
|---------|---------|---------|
|**Collect raw data from Teams, message trace, phishing data, and so on**     |    Use the built-in [Office 365 connector](./data-connectors/office-365.md) functionality, and then create a custom connector for other raw data.  |  Mapping events to the corresponding recordID may be challenging.  |
|**Requires RBAC for splitting countries/regions, departments, and so on**     | Customize your data collection by adding tags to data and creating dedicated workspaces for each separation needed.|   Custom data collection has extra ingestion costs.     |
|**Requires multiple tenants in a single workspace**     |  Customize your data collection using Azure LightHouse and a unified incident view.|  Custom data collection has extra ingestion costs.  <br><br>For more information, see [Extend Microsoft Sentinel across workspaces and tenants](extend-sentinel-across-workspaces-tenants.md).      |


### Cloud platform data

|Challenge / Requirement  |Possible solutions  |Considerations  |
|---------|---------|---------|
|**Filter logs from other platforms**     | Use Logstash <br><br>Use the Azure Monitor Agent / Microsoft Monitoring (Log Analytics) agent       |    Custom collection has extra ingestion costs. <br><br>You may have a challenge of collecting all Windows events vs only security events.     |
|**Agent cannot be used**     |   Use Windows Event Forwarding      | You may need to load balance efforts across your resources.        |
|**Servers are in air-gapped network**     | Use the [Log Analytics gateway](../azure-monitor/agents/gateway.md)        | Configuring a proxy to your agent requires firewall rules to allow the Gateway to work.        |
|**RBAC, tagging, and enrichment at ingestion**     |    Create custom collection via Logstash or the Log Analytics API.     |  RBAC isn't supported for custom tables <br><br>Row-level RBAC isn't supported for any tables.       |


## Next steps

For more information, see:

- [Pre-deployment activities and prerequisites for deploying Microsoft Sentinel](prerequisites.md)
- [Best practices for Microsoft Sentinel](best-practices.md)
- [Connect data sources](connect-data-sources.md)
