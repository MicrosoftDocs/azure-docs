---
title: Stream Azure monitoring data to Event Hubs | Microsoft Docs
description: Learn how to stream all of your Azure monitoring data to an event hub to get the data into a partner SIEM or analytics tool.
author: johnkemnetz
manager: robb
editor: ''
services: monitoring-and-diagnostics
documentationcenter: monitoring-and-diagnostics

ms.service: monitoring-and-diagnostics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/20/2017
ms.author: johnkem

---
# Stream Azure monitoring data to an event hub for consumption by an external tool

Azure Monitor provides a single pipeline for getting access to all of the monitoring data from your Azure environment, enabling you to easily set up partner SIEM and monitoring tools to consume that data. This article walks through setting up different tiers of data from your Azure environment to be sent to a single Event Hubs namespace or event hub, where it can be collected by an external tool.

## What data can I send into an event hub? 

Within your Azure environment, there are several 'tiers' of monitoring data, and the method of accessing data from each tier varies slightly. Typically, these tiers can be described as:

- **Application monitoring data:** Data about the performance and functionality of the code you have written and are running on Azure. Examples of application monitoring data include performance traces, application logs, and user telemetry. Application monitoring data is usually collected in one of the following ways:
  - By instrumenting your code with an SDK such as the [Application Insights SDK](../application-insights/app-insights-overview.md).
  - By running a monitoring agent that listens for new application logs on the machine running your application, such as the [Windows Azure Diagnostic Agent](./azure-diagnostics.md) or [Linux Azure Diagnostic Agent](../virtual-machines/linux/diagnostic-extension.md).
- **Guest OS monitoring data:** Data about the operating system on which your application is running. Examples of guest OS monitoring data would be Linux syslog or Windows system events. To collect this type of data, you need to install an agent such as the [Windows Azure Diagnostic Agent](./azure-diagnostics.md) or [Linux Azure Diagnostic Agent](../virtual-machines/linux/diagnostic-extension.md).
- **Azure resource monitoring data:** Data about the operation of an Azure resource. For some Azure resource types, such as virtual machines, there is a guest OS and application(s) to monitor inside of that Azure service. For other Azure resources, such as Network Security Groups, the resource monitoring data is the highest tier of data available (since there is no guest OS or application running in those resources). This data can be collected using [resource diagnostic settings](./monitoring-overview-of-diagnostic-logs.md#resource-diagnostic-settings).
- **Azure platform monitoring data:** Data about the operation and management of an Azure subscription or tenant, as well as data about the health and operation of Azure itself. The [activity log](./monitoring-overview-activity-logs.md), including service health data, and Active Directory audits are examples of platform monitoring data. This data can be collected using diagnostic settings as well.

Data from any tier can be sent into an event hub, where it can be pulled into a partner tool. The next sections describe how you can configure data from each tier to be streamed to an event hub. The steps assume that you already have assets at that tier to be monitored.

Before you begin, you need to [create an Event Hubs namespace and event hub](../event-hubs/event-hubs-create.md). This namespace and event hub is the destination for all of your monitoring data.

## How do I set up Azure platform monitoring data to be streamed to an event hub?

Azure platform monitoring data comes from two main sources:
1. The [Azure activity log](./monitoring-overview-activity-logs.md), which contains the create, update, and delete operations from Resource Manager, the changes in [Azure service health](../service-health/service-health-overview.md) that may impact resources in your subscription, the [resource health](../service-health/resource-health-overview.md) state transitions, and several other types of subscription-level events. [This article details all categories of events that appear in the Azure activity log](./monitoring-activity-log-schema.md).
2. [Azure Active Directory reporting](../active-directory/active-directory-reporting-azure-portal.md), which contains the history of sign-in activity and audit trail of changes made within a particular tenant. It is not yet possible to stream Azure Active Directory data into an event hub.

### Stream Azure activity log data into an event hub

To send data from the Azure activity log into an Event Hubs namespace, you set up a Log Profile on your subscription. [Follow this guide](./monitoring-stream-activity-logs-event-hubs.md) to set up a Log Profile on your subscription. Do this once per subscription you want to monitor.

> [!TIP]
> A Log Profile currently only allows you to select an Event Hubs namespace, in which an event hub is created with the name 'insights-operational-logs.' It is not yet possible to specify your own event hub name in a Log Profile.

## How do I set up Azure resource monitoring data to be streamed to an event hub?

Azure resources emit two types of monitoring data:
1. [Resource diagnostic logs](./monitoring-overview-of-diagnostic-logs.md)
2. [Metrics](monitoring-overview-metrics.md)

Both types of data are sent to an event hub using a resource diagnostic setting. [Follow this guide](./monitoring-stream-diagnostic-logs-to-event-hubs.md) to set up a resource diagnostic setting on a particular resource. Set a resource diagnostic setting on each resource from which you want to collect logs.

> [!TIP]
> You can use Azure Policy to ensure that every resource within a certain scope is always set up with a diagnostic setting [by using the DeployIfNotExists effect in the policy rule](../azure-policy/policy-definition.md#policy-rule). Today DeployIfNotExists is only supported on built-in policies.

## How do I set up guest OS monitoring data to be streamed to an event hub?

You need to install an agent to send guest OS monitoring data into an event hub. For either Windows or Linux, you specify the data you want to be sent to the event hub as well as the event hub to which the data should be sent in a configuration file and pass that configuration file to the agent running on the VM.

### Stream Linux data to an event hub

The [Linux Azure Diagnostic agent](../virtual-machines/linux/diagnostic-extension.md) can be used to send monitoring data from a Linux machine to an event hub. Do this by adding the event hub as a sink in your LAD configuration file protected settings JSON. [See this article to learn more about adding the event hub sink to your Linux Azure Diagnostic agent](../virtual-machines/linux/diagnostic-extension.md#protected-settings).

> [!NOTE]
> You cannot set up streaming of guest OS monitoring data to an event hub in the portal. Instead, you must manually edit the configuration file.

### Stream Windows data to an event hub

The [Windows Azure Diagnostic agent](./azure-diagnostics.md) can be used to send monitoring data from a Windows machine to an event hub. Do this by adding the event hub as a sink in your privateConfig section of the WAD configuration file. [See this article to learn more about adding the event hub sink to your Windows Azure Diagnostic agent](./azure-diagnostics-streaming-event-hubs.md).

> [!NOTE]
> You cannot set up streaming of guest OS monitoring data to an event hub in the portal. Instead, you must manually edit the configuration file.

## How do I set up application monitoring data to be streamed to event hub?

Application monitoring data requires that your code is instrumented with an SDK, so there isn't a general-purpose solution to routing application monitoring data to an event hub in Azure. However, [Azure Application Insights](../application-insights/app-insights-overview.md) is one service that can be used to collect Azure application-level data. If you are using Application Insights, you can stream monitoring data to an event hub by doing the following:

1. [Set up continuous export](../application-insights/app-insights-export-telemetry.md) of the Application Insights data to a storage account.

2. Set up a timer-triggered Logic App that [pulls data from blob storage](../connectors/connectors-create-api-azureblobstorage.md#use-an-action) and [pushes it as a message to the event hub](../connectors/connectors-create-api-azure-event-hubs.md#send-events-to-your-event-hub-from-your-logic-app).

## What can I do with the monitoring data being sent to my event hub?

Routing your monitoring data to an event hub with Azure Monitor enables you to easily integrate with partner SIEM and monitoring tools. Most tools require the event hub connection string and certain permissions to your Azure subscription to read data from the event hub. Here is a non-exhaustive list of tools with Azure Monitor integration:

* **IBM QRadar** - The QRadar ...
* **Splunk** - The Azure Monitor Add-On for Splunk is available in Splunkbase. Documentation is here.
* **Alert Logic** - ...
* **SumoLogic** - ...

## Next Steps
* [Archive the Activity Log to a storage account](monitoring-archive-activity-log.md)
* [Read the overview of the Azure Activity Log](monitoring-overview-activity-logs.md)
* [Set up an alert based on an Activity Log event](insights-auditlog-to-webhook-email.md)

