---
title: Overview of the Azure Activity Log
description: Learn what the Azure Activity Log is and how you can use it to understand events occurring within your Azure subscription.
author: johnkemnetz
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 05/30/2018
ms.author: johnkem
ms.subservice: logs
---
# Overview of Azure Activity log

The **Azure Activity Log** is a subscription log that provides insight into subscription-level events that have occurred in Azure. This includes a range of data, from Azure Resource Manager operational data to updates on Service Health events. The Activity Log was previously known as “Audit Logs” or “Operational Logs,” since the Administrative category reports control-plane events for your subscriptions. Using the Activity Log, you can determine the ‘what, who, and when’ for any write operations (PUT, POST, DELETE) taken on the resources in your subscription. You can also understand the status of the operation and other relevant properties. The Activity Log does not include read (GET) operations or operations for resources that use the Classic/"RDFE" model.

![Activity Logs vs other types of logs](./media/activity-logs-overview/Activity_Log_vs_other_logs_v5.png)

Figure 1: Activity Logs vs other types of logs

The Activity Log differs from [Diagnostic Logs](diagnostic-logs-overview.md). Activity Logs provide data about the operations on a resource from the outside (the "control plane"). Diagnostics Logs are emitted by a resource and provide information about the operation of that resource (the "data plane").

> [!WARNING]
> The Azure Activity Log is primarily for activities that occur in Azure Resource Manager. It does not track resources using the Classic/RDFE model. Some Classic resource types have a proxy resource provider in Azure Resource Manager (for example, Microsoft.ClassicCompute). If you interact with a Classic resource type through Azure Resource Manager using these proxy resource providers, the operations appear in the Activity Log. If you interact with a Classic resource type outside of the Azure Resource Manager proxies, your actions are only recorded in the Operation Log. The Operation Log can be browsed in a separate section of the portal.
>
>

You can retrieve events from your Activity Log using the Azure portal, CLI, PowerShell cmdlets, and Azure Monitor REST API.

> [!NOTE]
> [The newer alerts](../../azure-monitor/platform/alerts-overview.md) offer an enhanced experience when creating and managing activity log alert rules.  [Learn more](../../azure-monitor/platform/alerts-activity-log.md).

## Categories in the Activity Log
The Activity Log contains several categories of data. For full details on the schemata of these categories, [see this article](../../azure-monitor/platform/activity-log-schema.md). These include:
* **Administrative** - This category contains the record of all create, update, delete, and action operations performed through Resource Manager. Examples of the types of events you would see in this category include "create virtual machine" and "delete network security group" Every action taken by a user or application using Resource Manager is modeled as an operation on a particular resource type. If the operation type is Write, Delete, or Action, the records of both the start and success or fail of that operation are recorded in the Administrative category. The Administrative category also includes any changes to role-based access control in a subscription.
* **Service Health** - This category contains the record of any service health incidents that have occurred in Azure. An example of the type of event you would see in this category is "SQL Azure in East US is experiencing downtime." Service health events come in five varieties: Action Required, Assisted Recovery, Incident, Maintenance, Information, or Security, and only appear if you have a resource in the subscription that would be impacted by the event.
* **Resource Health** - This category contains the record of any resource health events that have occurred to your Azure resources. An example of the type of event you would see in this category is "Virtual Machine health status changed to unavailable." Resource health events can represent one of four health statuses: Available, Unavailable, Degraded, and Unknown. Additionally, resource health events can be categorized as being Platform Initiated or User Initiated.
* **Alert** - This category contains the record of all activations of Azure alerts. An example of the type of event you would see in this category is "CPU % on myVM has been over 80 for the past 5 minutes." A variety of Azure systems have an alerting concept -- you can define a rule of some sort and receive a notification when conditions match that rule. Each time a supported Azure alert type 'activates,' or the conditions are met to generate a notification, a record of the activation is also pushed to this category of the Activity Log.
* **Autoscale** - This category contains the record of any events related to the operation of the autoscale engine based on any autoscale settings you have defined in your subscription. An example of the type of event you would see in this category is "Autoscale scale up action failed." Using autoscale, you can automatically scale out or scale in the number of instances in a supported resource type based on time of day and/or load (metric) data using an autoscale setting. When the conditions are met to scale up or down, the start and succeeded or failed events are recorded in this category.
* **Recommendation** - This category contains recommendation events from Azure Advisor.
* **Security** - This category contains the record of any alerts generated by Azure Security Center. An example of the type of event you would see in this category is "Suspicious double extension file executed."
* **Policy** - This category contains records of all effect action operations performed by Azure Policy. Examples of the types of events you would see in this category include Audit and Deny. Every action taken by Policy is modeled as an operation on a resource.

## Event schema per category

[See this article to understand the Activity Log event schema per category.](../../azure-monitor/platform/activity-log-schema.md)

## What you can do with the Activity Log

Here are some of the things you can do with the Activity Log:

![Azure Activity log](./media/activity-logs-overview/Activity_Log_Overview_v3.png)


* Query and view it in the **Azure portal**.
* [Create an alert on an Activity Log event.](../../azure-monitor/platform/activity-log-alerts.md)
* [Stream it to an **Event Hub**](../../azure-monitor/platform/activity-logs-stream-event-hubs.md) for ingestion by a third-party service or custom analytics solution such as Power BI.
* Analyze it in Power BI using the [**Power BI content pack**](https://powerbi.microsoft.com/documentation/powerbi-content-pack-azure-audit-logs/).
* [Save it to a **Storage Account** for archival or manual inspection](../../azure-monitor/platform/archive-activity-log.md). You can specify the retention time (in days) using the **Log Profile**.
* Query it via PowerShell Cmdlet, CLI, or REST API.

## Query the Activity Log in the Azure portal

Within the Azure portal, you can view your Activity Log in several places:
* The **Activity Log** that you can access by searching for the Activity Log under **All services** in the left-hand navigation pane.
* **Monitor** appears by default in the left-hand navigation pane. The Activity Log is one section of Azure Monitor.
* Most **resources**, for example, the configuration blade for a Virtual Machine. The Activity Log is a section on most resource blades, and clicking on it automatically filters the events to those related to that specific resource.

In the Azure portal, you can filter your Activity Log by these fields:
* Timespan - The start and end time for events.
* Category - The event category as described above.
* Subscription - One or more Azure subscription names.
* Resource group - One or more resource groups within those subscriptions.
* Resource (name) - The name of a specific resource.
* Resource type - The type of resource, for example, Microsoft.Compute/virtualmachines.
* Operation name - The name of an Azure Resource Manager operation, for example, Microsoft.SQL/servers/Write.
* Severity - The severity level of the event (Informational, Warning, Error, Critical).
* Event initiated by - The 'caller,' or user who performed the operation.
* Open search - This is an open text search box that searches for that string across all fields in all events.

Once you have defined a set of filters, you can pin a query to your Azure dashboard to always keep an eye on specific events.

For even more power, you can click the **Logs** icon, which displays your Activity Log data in the [Collect and analyze Activity Logs solution](../../azure-monitor/platform/collect-activity-logs.md). The Activity Log blade offers a basic filter/browse experience on logs, but the Azure Monitor logs feature enables you to pivot, query, and visualize your data in more powerful ways.

## Next Steps

* [Create a log profile to export the Azure Activity Log](activity-logs-export.md)
* [Stream the Azure Activity Log to Event Hubs](activity-logs-stream-event-hubs.md)
* [Archive the Azure Activity Log to storage](archive-activity-log.md)

