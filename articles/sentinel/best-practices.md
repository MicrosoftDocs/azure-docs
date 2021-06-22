---
title: Best practices for Azure Sentinel
description: Learn about best practices to employ when managing your Azure Sentinel workspace.
services: sentinel
author: batamig
ms.author: bagol
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: conceptual
ms.date: 06/21/2021
---

# Best practices for Azure Sentinel

This article collects best practices and guidance to use when deploying, managing, and using Azure Sentinel, including links to additional articles for more information.

## Architectural best practices

- Before deploying Azure Sentinel, review and complete pre-deployment activities and prerequisites, and review best practices for creating your Azure Sentinel instance. 

    For more information, see [Pre-deployment activities and prerequisites for deploying Azure Sentinel](prerequisites.md).

- When structuring your Azure Sentinel instance, consider Azure Sentinel's cost and billing structure. For more information, see:

    - [Azure Sentinel costs and billing](azure-sentinel-billing.md)
    - [Azure Sentinel pricing](https://azure.microsoft.com/en-us/pricing/details/azure-sentinel/)
    - [Log Analytics pricing](https://azure.microsoft.com/en-us/pricing/details/monitor/)
    - [Logic apps (playbooks) pricing](https://azure.microsoft.com/en-us/pricing/details/logic-apps/)
    - [Integrating Azure Data Explorer for long-term log retention](store-logs-in-azure-data-explorer.md)

## Data collection best practices

<!--move this entire section to data collection topics post PR -->
### Prioritizing your data connectors

If it's unclear to you which data connectors will best serve your environment, start by enabling all [free data connectors](azure-sentinel-billing.md#free-data-sources) to start getting value from Azure Sentinel as soon as possible, while you continue to plan other data connectors and budgets.

For your [partner] and [custom](create-custom-connector.md) data connectors, start by setting up your [Syslog](connect-syslog.md) and [CEF](connect-common-event-format.md) connectors with the highest priority first, as well as any Linux-based devices. If your data ingestion becomes too expensive too quickly, stop or filter the logs forwarded using the [Azure Monitor Agent](/azure/azure-monitor/agents/azure-monitor-agent-overview).

> [!TIP]
> Custom data connectors enable you to ingest data into Azure Sentinel from data sources not currently supported by built-in functionality, such as via agent, Logstash, or API. For more information, see [Resources for creating Azure Sentinel custom connectors](create-custom-connector.md).
>

### Filter your logs before ingestion

You may want to filter logs collected, or log content, before the data is ingested into Azure Sentinel. For example, you may want to filter out logs that are irrelevant or unimportant to security operations, or you may want to removed unwanted details from log messages. Filtering message content may be specifically helpful when trying to drive down costs when working with Syslog, CEF, or Windows-based logs that have a lot of irrelevant details.

Filter your logs using one of the following methods:

- **The Azure Monitor Agent**. Supported on both Windows and Linux to ingest [Windows security events](connect-windows-security-events.md). Filter the logs collected by configuring the agent to collect only specified events.

- **Logstash**. Supports filtering message content, including making changes to the log messages. For more information, see [Connect with Logstash](create-custom-connector.md#connect-with-logstash).

> [!NOTE]
> Using Logstash to filter your message content will cause your logs to be ingested as custom logs, causing any [free-tier logs](azure-sentinel-billing.md#free-data-sources) to become paid-tier logs.
>
> Custom logs also need to be worked into [analytics rules](automate-incident-handling-with-automation-rules.md), [threat hunting](hunting.md), and [workbooks](quickstart-get-visibility.md), as they aren't automatically added. Custom logs are also not currently supported for [Machine Learning](bring-your-own-ml.md) capabilities.
>

### Alternative data ingestion requirements

Standard configuration for data collection may not work well for your organization, due to a variety of challenges.

The following table describes common challenges or requirements, and possible solutions and considerations.

> [!NOTE]
> Many solutions listed below require a custom data connector. For more information, see [Resources for creating Azure Sentinel custom connectors](create-custom-connector.md).
>
#### On-premises Windows log collection

|Challenge / Requirement  |Possible solutions  |Considerations  |
|---------|---------|---------|
|**Requires log filtering**     | Logstash <br>Azure Function <br> LogicApp <br> Custom code (.NET, Python)  |  While filtering can lead to cost savings, and ingests only the required data, some Azure Sentinel features are not supported, such as [UEBA](identify-threats-with-entity-behavior-analytics.md), [entity pages](identify-threats-with-entity-behavior-analytics.md#entity-pages), [machine learning](bring-your-own-ml.md), and [fusion](fusion.md). <br><br>When configuring log filtering, you'll need to make updates in resources such as threat hunting queries and analytics rules.     |
|**Agent cannot be installed**     |Use Windows Event Forwarding, supported with the [Azure Monitor Agent](connect-windows-security-events.md#azure-monitor-agent-new).         |   Using Windows Event forwarding lowers load balancing events per second from the Windows Event Collector from 10,000 events to 500-1000 events.|
|**Servers do not connect to the internet**     | Use the [Log Analytics gateway](/azure/azure-monitor/agents/gateway)        | Configuring a proxy to your agent requires firewall rules to allow the Gateway to work.        |
|**Requires tagging and enrichment at ingestion**     |- Use Logstash to inject a ResourceID <br>- Use an ARM template to inject the ResourceID into on-premises machines <br>- Ingest the resource ID into separate workspaces        | <br>- Log Analytics doesn't support RBAC for custom tables <br>-  Azure Sentinel doesn’t support row-level RBAC <br><br>**Tip**: You may want to adopt cross workspace design and functionality for Azure Sentinel.        |
|**Requires splitting operation and security logs**     | Use the [Microsoft Monitor Agent or Azure Monitor Agent](connect-windows-security-events.md) multi-home functionality.        |  Multi-home functionality requires more deployment overhead for the agent.       |
|**Requires custom logs**     |   - Collect files from specific folder paths <br>- Use API ingestion <br>- Use PowerShell <br>- Use Logstash     |   - You may have issues filtering your logs. <br>- Custom methods are not supported. <br>- Custom connectors may require developer skills.       |
| | | |

#### On-premises Linux log collection

|Challenge / Requirement  |Possible solutions  |Considerations  |
|---------|---------|---------|
|**Requires log filtering**     | - Syslog-NG <br>- Rsyslog <br>- FluentD configuration for the agent <br>- Azure Monitor Agent/Microsoft Monitoring Agent <br>- Logstash  |  - Some Linux distributions are not supported by the agent. <!--where can we link to what's supported and what's not?--> <br>- Using Syslog or FluentD requires developer knowledge. <br><br>For more information, see [Connect to Windows servers to collect security events](connect-windows-security-events.md) and [Resources for creating Azure Sentinel custom connectors](create-custom-connector.md).      |
|**Agent cannot be installed**     |  Use a Syslog forwarder, such as (syslog-ng or rsyslog.       |         |
|**Servers do not connect to the internet**       | Use the [Log Analytics gateway](/azure/azure-monitor/agents/gateway)        | Configuring a proxy to your agent requires firewall rules to allow the Gateway to work.          |
|**Requires tagging and enrichment at ingestion**      | Use Logstash for enrichment, or custom methods, such as API or EventHubs.         | You may have extra effort required for filtering.    |
|**Requires splitting operation and security logs**     |  Use the [Azure Monitor Agent](connect-windows-security-events.md) with the multi-homing configuration.       |         |
|**Requires custom logs**     |    Create a custom collector using the Microsoft Monitoring (Log Analytics) agent.      |      |
| | | |

#### Endpoint solutions

If you need to collect logs from Endpoint solutions, such as EDR, other security events, Sysmon, and so on, use one of the following methods:

- **MTP connector** to collect logs from Microsoft 365 Defender for Endpoint. This option incurs extra costs for the data ingestion.
- **Windows Event Forwarding**.

> [!NOTE]
> Load balancing cuts down on the events per second that can be processed to the workspace.
>

#### Office data

If you need to collect Microsoft Office data, outside of the standard connector data, use one of the following solutions:

|Challenge / Requirement  |Possible solutions  |Considerations  |
|---------|---------|---------|
|**Collect raw data from Teams, message trace, phishing data, and so on**     |    Use the built-in [Office 365 connector](connect-office-365.md) functionality, and then create a custom connector for additional ral data.  |  Mapping events to the corresponding recordID may be challenging.  |
|**Requires RBAC for splitting countries, departments, and so on**     | Customize your data collection by adding tags to data and creating dedicated workspaces for each separation needed.|   Custom data collection has extra ingestion costs.     |
|**Requires multiple tenants in a single workspace**     |  Customize your data collection using Azure LightHouse and a unified incident view.|  Custom data collection has extra ingestion costs.  <br><br>For more information, see [Extend Azure Sentinel across workspaces and tenants](extend-sentinel-across-workspaces-tenants.md).      |
| | | |

#### Cloud platform data

|Challenge / Requirement  |Possible solutions  |Considerations  |
|---------|---------|---------|
|**Filter logs from other platforms**     | - Use Logstash <br>- Use the Azure Monitor Agent / Microsoft Monitoring (Log Analytics) agent       |    Custom collection has extra ingestion costs. <br>- You may have a challenge of collecting all Windows events vs only security events.     |
|**Agent cannot be used**     |   Use Windows Event Forwarding      | You may need to load balance efforts across your resources.        |
|**Servers are in air-gapped network**     | Use the [Log Analytics gateway](/azure/azure-monitor/agents/gateway)        | Configuring a proxy to your agent requires firewall rules to allow the Gateway to work.        |
|**RBAC, tagging, and enrichment at ingestion**     |    Create custom collection via Logstash or the Log Analytics API.     |  - RBAC is not supported for custom tables <br>- Row-level RBAC is not supported for any tables.       |
|     |         |         |


## Next steps

> [!div class="nextstepaction"]
>[On-board Azure Sentinel](quickstart-onboard.md)

> [!div class="nextstepaction"]
>[Get visibility into alerts](quickstart-get-visibility.md)
