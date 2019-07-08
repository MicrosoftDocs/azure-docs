---
title: Stream Azure monitoring data to Event Hubs
description: Learn how to stream your Azure monitoring data to an event hub to get the data into a partner SIEM or analytics tool.
author: nkiest
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 11/01/2018
ms.author: nikiest
ms.subservice: ""
---
# Stream Azure monitoring data to an event hub for consumption by an external tool

This article walks through setting up different tiers of data from your Azure environment to be sent to a single Event Hubs namespace or event hub, where it can be collected by an external tool.

> [!VIDEO https://www.youtube.com/embed/SPHxCgbcvSw]

## What data can I send into an event hub?

Within your Azure environment, there are several 'tiers' of monitoring data, and the method of accessing data from each tier varies slightly. Typically, these tiers can be described as:

- **Application monitoring data:** Data about the performance and functionality of the code you have written and are running on Azure. Examples of application monitoring data include performance traces, application logs, and user telemetry. Application monitoring data is usually collected in one of the following ways:
  - By instrumenting your code with an SDK such as the [Application Insights SDK](../../azure-monitor/app/app-insights-overview.md).
  - By running a monitoring agent that listens for new application logs on the machine running your application, such as the [Windows Azure Diagnostic Agent](./../../azure-monitor/platform/diagnostics-extension-overview.md) or [Linux Azure Diagnostic Agent](../../virtual-machines/extensions/diagnostics-linux.md).
- **Guest OS monitoring data:** Data about the operating system on which your application is running. Examples of guest OS monitoring data would be Linux syslog or Windows system events. To collect this type of data, you need to install an agent such as the [Windows Azure Diagnostic Agent](./../../azure-monitor/platform/diagnostics-extension-overview.md) or [Linux Azure Diagnostic Agent](../../virtual-machines/extensions/diagnostics-linux.md).
- **Azure resource monitoring data:** Data about the operation of an Azure resource. For some Azure resource types, such as virtual machines, there is a guest OS and application(s) to monitor inside of that Azure service. For other Azure resources, such as Network Security Groups, the resource monitoring data is the highest tier of data available (since there is no guest OS or application running in those resources). This data can be collected using [resource diagnostic settings](./../../azure-monitor/platform/diagnostic-logs-overview.md#diagnostic-settings).
- **Azure subscription monitoring data:** Data about the operation and management of an Azure subscription, as well as data about the health and operation of Azure itself. The [activity log](./../../azure-monitor/platform/activity-logs-overview.md) contains most subscription monitoring data, such as service health incidents and Azure Resource Manager audits. You can collect this data using a Log Profile.
- **Azure tenant monitoring data:** Data about the operation of tenant-level Azure services, such as Azure Active Directory. The Azure Active Directory audits and sign-ins are examples of tenant monitoring data. This data can be collected using a tenant diagnostic setting.

Data from any tier can be sent into an event hub, where it can be pulled into a partner tool. Some sources can be configured to send data directly to an event hub while another process such as a Logic App may be required to retrieve the required data. The next sections describe how you can configure data from each tier to be streamed to an event hub. The steps assume that you already have assets at that tier to be monitored.

## Set up an Event Hubs namespace

Before you begin, you need to [create an Event Hubs namespace and event hub](../../event-hubs/event-hubs-create.md). This namespace and event hub is the destination for all of your monitoring data. An Event Hubs namespace is a logical grouping of event hubs that share the same access policy, much like a storage account has individual blobs within that storage account. Please note a few details about the event hubs namespace and event hubs that you create:
* We recommend using a Standard Event Hubs namespace.
* Typically, only one throughput unit is necessary. If you need to scale up as your log usage increases, you can always manually increase the number of throughput units for the namespace later or enable auto inflation.
* The number of throughput units allows you to increase throughput scale for your event hubs. The number of partitions allows you to parallelize consumption across many consumers. A single partition can do up to 20MBps, or approximately 20,000 messages per second. Depending on the tool consuming the data, it may or may not support consuming from multiple partitions. If you're not sure about the number of partitions to set, we recommend starting with four partitions.
* We recommend that you set message retention on your event hub to 7 days. If your consuming tool goes down for more than a day, this ensures that the tool can pick up where it left off (for events up to 7 days old).
* We recommend using the default consumer group for your event hub. There is no need to create other consumer groups or use a separate consumer group unless you plan to have two different tools consume the same data from the same event hub.
* For the Azure Activity log, you pick an Event Hubs namespace and Azure Monitor creates an event hub within that namespace called 'insights-logs-operational-logs.' For other log types, you can either choose an existing event hub (allowing you to reuse the same insights-logs-operational-logs event hub) or have Azure Monitor create an event hub per log category.
* Typically, outbound port 5671 and 5672 must be opened on the machine or VNET consuming data from the event hub.

Please also see the [Azure Event Hubs FAQ](../../event-hubs/event-hubs-faq.md).

## Azure tenant monitoring data

Azure tenant monitoring data is currently only available for Azure Active Directory. You can use the data from [Azure Active Directory reporting](../../active-directory/reports-monitoring/overview-reports.md), which contains the history of sign-in activity and audit trail of changes made within a particular tenant.

### Azure Active Directory data

To send data from the Azure Active Directory log into an Event Hubs namespace, you set up a tenant diagnostic setting on your AAD tenant. [Follow this guide](../../active-directory/reports-monitoring/tutorial-azure-monitor-stream-logs-to-event-hub.md) to set up a tenant diagnostic setting.

## Azure subscription monitoring data

Azure subscription monitoring data is available in the [Azure activity log](./../../azure-monitor/platform/activity-logs-overview.md). This contains the create, update, and delete operations from Resource Manager, the changes in [Azure service health](../../service-health/service-health-overview.md) that may impact resources in your subscription, the [resource health](../../service-health/resource-health-overview.md) state transitions, and several other types of subscription-level events. [This article details all categories of events that appear in the Azure activity log](./../../azure-monitor/platform/activity-log-schema.md).

### Activity log data

To send data from the Azure activity log into an Event Hubs namespace, you set up a Log Profile on your subscription. [Follow this guide](./activity-logs-stream-event-hubs.md) to set up a Log Profile on your subscription. Do this once per subscription you want to monitor.

> [!TIP]
> A Log Profile currently only allows you to select an Event Hubs namespace, in which an event hub is created with the name 'insights-operational-logs.' It is not yet possible to specify your own event hub name in a Log Profile.

## Azure resource metrics and diagnostics logs

Azure resources emit two types of monitoring data:
1. [Resource diagnostic logs](diagnostic-logs-overview.md)
2. [Metrics](data-platform.md)

Both types of data are sent to an event hub using a resource diagnostic setting. [Follow this guide](diagnostic-logs-stream-event-hubs.md) to set up a resource diagnostic setting on a particular resource. Set a resource diagnostic setting on each resource from which you want to collect logs.

> [!TIP]
> You can use Azure Policy to ensure that every resource within a certain scope is always set up with a diagnostic setting [by using the DeployIfNotExists effect in the policy rule](../../governance/policy/concepts/definition-structure.md#policy-rule).

## Guest OS data

You need to install an agent to send guest OS monitoring data into an event hub. For either Windows or Linux, you specify the data you want to be sent to the event hub as well as the event hub to which the data should be sent in a configuration file and pass that configuration file to the agent running on the VM.

### Linux data

The [Linux Azure Diagnostic agent](../../virtual-machines/extensions/diagnostics-linux.md) can be used to send monitoring data from a Linux machine to an event hub. Do this by adding the event hub as a sink in your LAD configuration file protected settings JSON. [See this article to learn more about adding the event hub sink to your Linux Azure Diagnostic agent](../../virtual-machines/extensions/diagnostics-linux.md#protected-settings).

> [!NOTE]
> You cannot set up streaming of guest OS monitoring data to an event hub in the portal. Instead, you must manually edit the configuration file.

### Windows data

The [Windows Azure Diagnostic agent](./../../azure-monitor/platform/diagnostics-extension-overview.md) can be used to send monitoring data from a Windows machine to an event hub. Do this by adding the event hub as a sink in your privateConfig section of the WAD configuration file. [See this article to learn more about adding the event hub sink to your Windows Azure Diagnostic agent](./../../azure-monitor/platform/diagnostics-extension-stream-event-hubs.md).

> [!NOTE]
> You cannot set up streaming of guest OS monitoring data to an event hub in the portal. Instead, you must manually edit the configuration file.

## Application monitoring data

Application monitoring data requires that your code is instrumented with an SDK, so there isn't a general-purpose solution to routing application monitoring data to an event hub in Azure. However, [Azure Application Insights](../../azure-monitor/app/app-insights-overview.md) is one service that can be used to collect Azure application-level data. If you are using Application Insights, you can stream monitoring data to an event hub by doing the following:

1. [Set up continuous export](../../azure-monitor/app/export-telemetry.md) of the Application Insights data to a storage account.

2. Set up a timer-triggered Logic App that [pulls data from blob storage](../../connectors/connectors-create-api-azureblobstorage.md#add-action) and [pushes it as a message to the event hub](../../connectors/connectors-create-api-azure-event-hubs.md#add-action).

## What can I do with the monitoring data being sent to my event hub?

Routing your monitoring data to an event hub with Azure Monitor enables you to easily integrate with partner SIEM and monitoring tools. Most tools require the event hub connection string and certain permissions to your Azure subscription to read data from the event hub. Here is a non-exhaustive list of tools with Azure Monitor integration:

* **IBM QRadar** - The Microsoft Azure DSM and Microsoft Azure Event Hub Protocol are available for download from [the IBM support website](https://www.ibm.com/support). You can [learn more about the integration with Azure here](https://www.ibm.com/support/knowledgecenter/SS42VS_DSM/c_dsm_guide_microsoft_azure_overview.html?cp=SS42VS_7.3.0).
* **Splunk** - Depending on your Splunk setup, there are two approaches:
    1. [The Azure Monitor Add-On for Splunk](https://splunkbase.splunk.com/app/3534/) is available in Splunkbase and an open source project. [Documentation is here](https://github.com/Microsoft/AzureMonitorAddonForSplunk/wiki/Azure-Monitor-Addon-For-Splunk).
    2. If you cannot install an add-on in your Splunk instance (eg. if using a proxy or running on Splunk Cloud), you can forward these events to the Splunk HTTP Event Collector using [this Function which is triggered by new messages in the event hub](https://github.com/Microsoft/AzureFunctionforSplunkVS).
* **SumoLogic** - Instructions for setting up SumoLogic to consume data from an event hub are [available here](https://help.sumologic.com/Send-Data/Applications-and-Other-Data-Sources/Azure-Audit/02Collect-Logs-for-Azure-Audit-from-Event-Hub)
* **ArcSight** - The ArcSight Azure Event Hub smart connector is available as part of [the ArcSight smart connector collection here](https://community.softwaregrp.com/t5/Discussions/Announcing-General-Availability-of-ArcSight-Smart-Connectors-7/m-p/1671852).
* **Syslog server** - If you want to stream Azure Monitor data directly to a syslog server, you can check out [this GitHub repo](https://github.com/miguelangelopereira/azuremonitor2syslog/).

## Next Steps
* [Archive the Activity log to a storage account](../../azure-monitor/platform/archive-activity-log.md)
* [Read the overview of the Azure Activity log](../../azure-monitor/platform/activity-logs-overview.md)
* [Set up an alert based on an Activity log event](../../azure-monitor/platform/alerts-log-webhook.md)


