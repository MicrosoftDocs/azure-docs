---
title: Activity log alerts in Azure Monitor
description: Be notified via SMS, webhook, SMS, email and more, when certain events occur in the activity log.
author: msvijayn
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 09/17/2018
ms.author: vinagara
ms.component: alerts
---
# Alerts on activity log 

## Overview
Activity log alerts are alerts that activate when a new activity log event occurs that matches the conditions specified in the alert. They are Azure resources, so they can be created by using an Azure Resource Manager template. They also can be created, updated, or deleted in the Azure portal. This article introduces the concepts behind activity log alerts. It then shows you how to use the Azure portal to set up an alert on activity log events. For more information on usage, see [Create and manage activity log alerts](alert-activity-log.md).

> [!NOTE]
> Alerts **can not** be created for events in Alert category of activity log

Typically, you create activity log alerts to receive notifications when:

* Specific operations occur on resources in your Azure subscription, often scoped to particular resource groups or resources. For example, you might want to be notified when any virtual machine in myProductionResourceGroup is deleted. Or, you might want to be notified if any new roles are assigned to a user in your subscription.
* A service health event occurs. Service health events include notification of incidents and maintenance events that apply to resources in your subscription.

A simple analogy for understanding conditions on which alert rules can be created on activity log, is to explore or filter events via [Activity Log in Azure Portal](monitoring-overview-activity-logs.md#query-the-activity-log-in-the-azure-portal). In Azure Monitor - Activity Log, one can filter or find necessary event and then create an alert by using the **Add activity log alert** button.

In either case, an activity log alert monitors only for events in the subscription in which the alert is created.

You can configure an activity log alert based on any top-level property in the JSON object for an activity log event. For more information, see [Overview of the Azure activity log](./monitoring-overview-activity-logs.md#categories-in-the-activity-log). To learn more about service health events, see [Receive activity log alerts on service notifications](./monitoring-activity-log-alerts-on-service-notifications.md). 

Activity log alerts have a few common options:

- **Category**: Administrative, Service Health, Autoscale, Security, Policy, and Recommendation. 
- **Scope**: The individual resource or set of resource(s) for which the alert on activity log is defined. Scope for an activity log alert can be defined at various levels:
    - Resource Level: For example, for a specific virtual machine
    - Resource Group Level: For example, all virtual machines in a specific resource group
    - Subscription Level: For example, all virtual machines in a subscription (or) all resources in a subscription
- **Resource group**: By default, the alert rule is saved in the same resource group as that of the target defined in Scope. The user can also define the Resource Group where the alert rule should be stored.
- **Resource type**: Resource Manager defined namespace for the target of the alert.

- **Operation name**: The Resource Manager Role-Based Access Control operation name.
- **Level**: The severity level of the event (Verbose, Informational, Warning, Error, or Critical).
- **Status**: The status of the event, typically Started, Failed, or Succeeded.
- **Event initiated by**: Also known as the "caller." The email address or Azure Active Directory identifier of the user who performed the operation.

> [!NOTE]
> In a subscription up to 100 alert rules for activity of scope at either:a single resource, all resources in resource group (or) entire subscription level.

When an activity log alert is activated, it uses an action group to generate actions or notifications. An action group is a reusable set of notification receivers, such as email addresses, webhook URLs, or SMS phone numbers. The receivers can be referenced from multiple alerts to centralize and group your notification channels. When you define your activity log alert, you have two options. You can:

* Use an existing action group in your activity log alert.
* Create a new action group.

To learn more about action groups, see [Create and manage action groups in the Azure portal](monitoring-action-groups.md).


## Next steps
- Get an [overview of alerts](monitoring-overview-alerts.md).
- Learn about [create and modify activity log alerts](alert-activity-log.md).
- Review the [activity log alert webhook schema](monitoring-activity-log-alerts-webhook.md).
- Learn about [service health notifications](monitoring-service-notifications.md).

