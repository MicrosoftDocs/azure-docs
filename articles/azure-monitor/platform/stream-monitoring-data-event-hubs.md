---
title: Stream Azure monitoring data to event hub
description: Learn how to stream your Azure monitoring data to an event hub to get the data into a partner SIEM or analytics tool.
author: bwren
services: azure-monitor

ms.topic: conceptual
ms.date: 11/15/2019
ms.author: bwren
ms.subservice: ""
---
# Stream Azure monitoring data to an event hub
Azure Monitor provides a complete full stack monitoring solution for applications and services in Azure, in other clouds, and on-premises. In addition to using Azure Monitor for analyzing that data and leveraging it for different monitoring scenarios, you may need to send it to other monitoring tools in your environment. The most effective method to stream monitoring data to external tools in most cases is using [Azure Event Hubs](/azure/event-hubs/). This article provides a brief description for how you can stream monitoring data from different sources to an event hub and links to detailed guidance.


## Create an Event Hubs namespace

Before you configure streaming for any data source, you need to [create an Event Hubs namespace and event hub](../../event-hubs/event-hubs-create.md). This namespace and event hub is the destination for all of your monitoring data. An Event Hubs namespace is a logical grouping of event hubs that share the same access policy, much like a storage account has individual blobs within that storage account. Consider the following details about the event hubs namespace and event hubs that you use for streaming monitoring data:

* The number of throughput units allows you to increase throughput scale for your event hubs. Only one throughput unit is typically necessary. If you need to scale up as your log usage increases, you can manually increase the number of throughput units for the namespace or enable auto inflation.
* The number of partitions allows you to parallelize consumption across many consumers. A single partition can support up to 20MBps or approximately 20,000 messages per second. Depending on the tool consuming the data, it may or may not support consuming from multiple partitions. Four partitions is reasonable to start with if you're not sure about the number of partitions to set.
* You set message retention on your event hub to at least 7 days. If your consuming tool goes down for more than a day, this ensures that the tool can pick up where it left off for events up to 7 days old.
* You should use the default consumer group for your event hub. There is no need to create other consumer groups or use a separate consumer group unless you plan to have two different tools consume the same data from the same event hub.
* For the Azure Activity log, you pick an Event Hubs namespace, and Azure Monitor creates an event hub within that namespace called _insights-logs-operational-logs_. For other log types, you can either choose an existing event hub or have Azure Monitor create an event hub per log category.
* Outbound port 5671 and 5672 must typically be opened on the computer or VNET consuming data from the event hub.

## Monitoring data available
[Sources of monitoring data for Azure Monitor](data-sources.md) describes the different tiers of data for Azure applications and the kinds of monitoring data available for each. The following table lists each of these tiers and a description of how that data can be streamed to an event hub. Follow the links provided for further detail.

| Tier | Data | Method |
|:---|:---|:---|
| [Azure tenant](data-sources.md#azure-tenant) | Azure Active Directory audit logs | Configure a tenant diagnostic setting on your AAD tenant. See  [Tutorial: Stream Azure Active Directory logs to an Azure event hub](../../active-directory/reports-monitoring/tutorial-azure-monitor-stream-logs-to-event-hub.md) for details. |
| [Azure subscription](data-sources.md#azure-subscription) | Azure Activity Log | Create a log profile to export Activity Log events to Event Hubs.  See [Stream Azure platform logs to Azure Event Hubs](resource-logs-stream-event-hubs.md) for details. |
| [Azure resources](data-sources.md#azure-resources) | Platform metrics<br> Resource logs |Both types of data are sent to an event hub using a resource diagnostic setting. See [Stream Azure resource  logs to an event hub](resource-logs-stream-event-hubs.md) for details. |
| [Operating system (guest)](data-sources.md#operating-system-guest) | Azure virtual machines | Install the [Azure Diagnostics Extension](diagnostics-extension-overview.md) on Windows and Linux virtual machines in Azure. See [Streaming Azure Diagnostics data in the hot path by using Event Hubs](diagnostics-extension-stream-event-hubs.md) for details on Windows VMs and [Use Linux Diagnostic Extension to monitor metrics and logs](../../virtual-machines/extensions/diagnostics-linux.md#protected-settings) for details on Linux VMs. |
| [Application code](data-sources.md#application-code) | Application Insights | Application Insights doesn't provide a direct method to stream data to event hubs. You can [set up continuous export](../../azure-monitor/app/export-telemetry.md) of the Application Insights data to a storage account and then use a Logic App to send the data to an event hub as described in [Manual streaming with Logic App](#manual-streaming-with-logic-app). |

## Manual streaming with Logic App
For data that you can't directly stream to an event hub, you can write to Azure storage and then use a time-triggered Logic App that [pulls data from blob storage](../../connectors/connectors-create-api-azureblobstorage.md#add-action) and [pushes it as a message to the event hub](../../connectors/connectors-create-api-azure-event-hubs.md#add-action). 


## Partner tools with Azure Monitor integration

Routing your monitoring data to an event hub with Azure Monitor enables you to easily integrate with external SIEM and monitoring tools. Examples of tools with Azure Monitor integration include the following:

| Tool | Hosted in Azure | Description |
|:---|:---| :---|
|  IBM QRadar | No | The Microsoft Azure DSM and Microsoft Azure Event Hub Protocol are available for download from [the IBM support website](https://www.ibm.com/support). You can learn more about the integration with Azure at [QRadar DSM configuration](https://www.ibm.com/support/knowledgecenter/SS42VS_DSM/c_dsm_guide_microsoft_azure_overview.html?cp=SS42VS_7.3.0). |
| Splunk | No | [The Azure Monitor Add-On for Splunk](https://splunkbase.splunk.com/app/3534/) is an open source project available in Splunkbase. The documentation is available at [Azure Monitor Addon For Splunk](https://github.com/Microsoft/AzureMonitorAddonForSplunk/wiki/Azure-Monitor-Addon-For-Splunk).<br><br> If you cannot install an add-on in your Splunk instance, if for example you're using a proxy or running on Splunk Cloud, you can forward these events to the Splunk HTTP Event Collector using [Azure Function For Splunk](https://github.com/Microsoft/AzureFunctionforSplunkVS), which is triggered by new messages in the event hub. |
| SumoLogic | No | Instructions for setting up SumoLogic to consume data from an event hub are available at [Collect Logs for the Azure Audit App from Event Hub](https://help.sumologic.com/Send-Data/Applications-and-Other-Data-Sources/Azure-Audit/02Collect-Logs-for-Azure-Audit-from-Event-Hub). |
| ArcSight | No | The ArcSight Azure Event Hub smart connector is available as part of [the ArcSight smart connector collection](https://community.softwaregrp.com/t5/Discussions/Announcing-General-Availability-of-ArcSight-Smart-Connectors-7/m-p/1671852). |
| Syslog server | No | If you want to stream Azure Monitor data directly to a syslog server, you can use a [solution based on an Azure function](https://github.com/miguelangelopereira/azuremonitor2syslog/).
| LogRhythm | No| Instructions to set up LogRhythm to collect logs from an event hub are available [here](https://logrhythm.com/six-tips-for-securing-your-azure-cloud-environment/). 
|Logz.io | Yes | For more information, see [Getting started with monitoring and logging using Logz.io for Java apps running on Azure](https://docs.microsoft.com/azure/developer/java/fundamentals/java-get-started-with-logzio)


## Next Steps
* [Archive the Activity log to a storage account](../../azure-monitor/platform/archive-activity-log.md)
* [Read the overview of the Azure Activity log](../../azure-monitor/platform/platform-logs-overview.md)
* [Set up an alert based on an Activity log event](../../azure-monitor/platform/alerts-log-webhook.md)


