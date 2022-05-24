---
title: Activity log alerts in Azure Monitor
description: Be notified via SMS, webhook, SMS, email and more, when certain events occur in the activity log.
ms.topic: conceptual
ms.date: 04/04/2022

---

# Alerts on activity log

## Overview

Activity log alerts allow you to be notified on events and operations that are logged in [Azure Activity Log](../essentials/activity-log.md). An alert is fired when a new [activity log event](../essentials/activity-log-schema.md) occurs that matches the conditions specified in the alert rule.

Activity log alert rules are Azure resources, so they can be created by using an Azure Resource Manager template. They also can be created, updated, or deleted in the Azure portal. This article introduces the concepts behind activity log alerts. For more information on creating or usage of activity log alert rules, see [Create and manage activity log alerts](./alerts-activity-log.md).

## Alerting on activity log event categories

You can create activity log alert rules to receive notifications on one of the following activity log event categories:

| Event Category | Category Description | Example |
|----------------|-------------|---------|
| Administrative | ARM operation (e.g. create, update, delete, or action) was performed on resources in your subscription, resource group, or on a specific Azure resource.| A virtual machine in your resource group is deleted |
| Service health | Service incidents (e.g. an outage or a maintenance event) occurred that may impact services in your subscription on a specific region.|  An outage impacting VMs in your subscription in East US. |
| Resource health | The health of a specific resource is degraded, or the resource becomes unavailable. | A VM in your subscription transitions to a degraded or unavailable state. |
| Autoscale | An Azure Autoscale operation has occurred, resulting in success or failure | An autoscale action on a virtual machine scale set in your subscription failed. |
| Recommendation | A new Azure Advisor recommendation is available for your subscription | A high-impact recommendation for your subscription was received. |
| Security | Events detected by Microsoft Defender for Cloud | A suspicious double extension file executed was detected in your subscription |
| Policy | Operations performed by Azure Policy | Policy Deny event occurred in your subscription. |

> [!NOTE]
> Alert rules **cannot** be created for events in Alert category of activity log.


## Configuring activity log alert rules

You can configure an activity log alert rule based on any top-level property in the JSON object for an activity log event. For more information, see [Categories in the Activity Log](../essentials/activity-log.md#view-the-activity-log).  

An alternative simple way for creating conditions for activity log alert rules is to explore or filter events via [Activity log in Azure portal](../essentials/activity-log.md#view-the-activity-log). In Azure Monitor - Activity log, one can filter and locate a required event and then create an alert rule to notify on similar events by using the **New alert rule** button.

> [!NOTE]
> An activity log alert rule monitors only for events in the subscription in which the alert rule is created.

Activity log events have a few common properties which can be used to define an activity log alert rule condition:

- **Category**: Administrative, Service Health, Resource Health, Autoscale, Security, Policy, or Recommendation. 
- **Scope**: The individual resource or set of resource(s) for which the alert on activity log is defined. Scope for an activity log alert can be defined at various levels:
    - Resource Level: For example, for a specific virtual machine
    - Resource Group Level: For example, all virtual machines in a specific resource group
    - Subscription Level: For example, all virtual machines in a subscription (or) all resources in a subscription
- **Resource group**: By default, the alert rule is saved in the same resource group as that of the target defined in Scope. The user can also define the Resource Group where the alert rule should be stored.
- **Resource type**: Resource Manager defined namespace for the target of the alert rule.
- **Operation name**: The [Azure resource provider operation](../../role-based-access-control/resource-provider-operations.md) name utilized for Azure role-based access control. Operations not registered with Azure Resource Manager cannot be used in an activity log alert rule.
- **Level**: The severity level of the event (Informational, Warning, Error, or Critical).
- **Status**: The status of the event, typically Started, Failed, or Succeeded.
- **Event initiated by**: Also known as the "caller." The email address or Azure Active Directory identifier of the user (or application) who performed the operation.

In addition to these comment properties, different activity log events have category-specific properties that can be used to configure an alert rule for events of each category. For example, when creating a service health alert rule you can configure a condition on the impacted region or service that appear in the event.

## Using action groups 

When an activity log alert is fired, it uses an action group to trigger actions or send notifications. An action group is a reusable set of notification receivers, such as email addresses, webhook URLs, or SMS phone numbers. The receivers can be referenced from multiple alerts rules to centralize and group your notification channels. When you define your activity log alert rule, you have two options. You can:

* Use an existing action group in your activity log alert rule.
* Create a new action group.

To learn more about action groups, see [Create and manage action groups in the Azure portal](./action-groups.md).

## Activity log alert rules limit
You can create up to 100 active activity log alert rules per subscription (including rules for all activity log event categories, such as resource health or service health). This limit can't be increased.
If you are reaching near this limit, there are several guidelines you can follow to optimize the use of activity log alerts rules, so that you can cover more resources and events with the same number of rules:
* A single activity log alert rule can be configured to cover the scope of a single resource, a resource group, or an entire subscription. To reduce the number of rules you're using, consider to replace multiple rules covering a narrow scope with a single rule covering a broad scope. For example, if you have multiple VMs in a subscription, and you want an alert to be triggered whenever one of them is restarted, you can use a single activity log alert rule to cover all the VMs in your subscription. The alert will be triggered whenever any VM in the subscription is restarted.  
* A single service health alert rule can cover all the services and Azure regions used by your subscription. If you're using multiple service health alert rules per subscription, you can replace them with a single rule (or with a small number of rules, if you prefer). 
* A single resource health alert rule can cover multiple resource types and resources in your subscription. If you're using multiple resource health alert rules per subscription, you can replace them with a smaller number of rules (or even a single rule) that covers multiple resource types. 


## Next steps

- Get an [overview of alerts](./alerts-overview.md).
- Learn about [create and modify activity log alerts](alerts-activity-log.md).
- Review the [activity log alert webhook schema](../alerts/activity-log-alerts-webhook.md).
- Learn more about [service health alerts](../../service-health/service-notifications.md).
- Learn more about [Resource health alerts](../../service-health/resource-health-alert-monitor-guide.md).
- Learn more about [Recommendation alerts](../../advisor/advisor-alerts-portal.md).
