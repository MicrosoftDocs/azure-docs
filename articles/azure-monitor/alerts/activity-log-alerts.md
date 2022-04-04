---
title: Activity log alerts in Azure Monitor
description: Be notified via SMS, webhook, SMS, email and more, when certain events occur in the activity log.
ms.topic: conceptual
ms.date: 04/04/2022

---

# Alerts on activity log

## Overview

Activity log alerts allow you to be notified on events and operations that are logged in [Azure Activity Log](https://docs.microsoft.com/en-us/azure/azure-monitor/essentials/activity-log). An alert is fired when a new [activity log event](../essentials/activity-log-schema.md) occurs that matches the conditions specified in the alert rule. Activity log alert rules are Azure resources, so they can be created by using an Azure Resource Manager template. They also can be created, updated, or deleted in the Azure portal. This article introduces the concepts behind activity log alerts. For more information on creating or usage of activity log alert rules, see [Create and manage activity log alerts](alerts-activity-log.md).

## Alerts on activity log event categories:

You can create activity log alerts to receive notifications on one of the following activity log event categories  :

* **Administrative events** - you can be notified when a create, update, delete, or action operation occur on resources in your Azure subscription, resource group, or on a specific resource. For example, you might want to be notified when any virtual machine in myProductionResourceGroup is deleted. Or, you might want to be notified if any new roles are assigned to a user in your subscription.
* **Service Health events** - you can be notified on Azure incidents, such as an outage or a maintenance event,  occured in a specific Azure region and may impact services in your subscription. \
*  **Resource health events** - you can be notified when the health of a specific Azure resource you are using is degraded, or if the resource becomes unavailable.  
You can configure an activity log alert based on any top-level property in the JSON object for an activity log event. For more information, see [Categories in the Activity Log](../essentials/activity-log.md#view-the-activity-log). To learn more about service health events, see [Receive activity log alerts on service notifications](../../service-health/alerts-activity-log-service-notifications-portal.md). 

An alternative simple way for creating conditions for activity log alerts is to explore or filter events via [Activity log in Azure portal](../essentials/activity-log.md#view-the-activity-log). In Azure Monitor - Activity log, one can filter and locate a required event and then create an alert to notify on similar by using the **New alert rule** button.

> [!NOTE]
> An activity log alert rule monitors only for events in the subscription in which the alert rule is created.



Activity log alerts have a few common options:

- **Category**: Administrative, Service Health, Autoscale, Security, Policy, and Recommendation. 
- **Scope**: The individual resource or set of resource(s) for which the alert on activity log is defined. Scope for an activity log alert can be defined at various levels:
    - Resource Level: For example, for a specific virtual machine
    - Resource Group Level: For example, all virtual machines in a specific resource group
    - Subscription Level: For example, all virtual machines in a subscription (or) all resources in a subscription
- **Resource group**: By default, the alert rule is saved in the same resource group as that of the target defined in Scope. The user can also define the Resource Group where the alert rule should be stored.
- **Resource type**: Resource Manager defined namespace for the target of the alert.
- **Operation name**: The [Azure resource provider operation](../../role-based-access-control/resource-provider-operations.md) name utilized for Azure role-based access control . Operations not registered with Azure Resource Manager can not be used in an activity log alert rule.
- **Level**: The severity level of the event (Informational, Warning, Error, or Critical).
- **Status**: The status of the event, typically Started, Failed, or Succeeded.
- **Event initiated by**: Also known as the "caller." The email address or Azure Active Directory identifier of the user (or application) who performed the operation.

> [!NOTE]
> In a subscription up to 100 alert rules can be created for an activity of scope at either: a single resource, all resources in resource group (or) entire subscription level.

When an activity log alert is activated, it uses an action group to generate actions or notifications. An action group is a reusable set of notification receivers, such as email addresses, webhook URLs, or SMS phone numbers. The receivers can be referenced from multiple alerts to centralize and group your notification channels. When you define your activity log alert, you have two options. You can:

* Use an existing action group in your activity log alert.
* Create a new action group.

To learn more about action groups, see [Create and manage action groups in the Azure portal](./action-groups.md).


## Next steps

- Get an [overview of alerts](./alerts-overview.md).
- Learn about [create and modify activity log alerts](alerts-activity-log.md).
- Review the [activity log alert webhook schema](../alerts/activity-log-alerts-webhook.md).
- Learn about [service health notifications](../../service-health/service-notifications.md).
