---
title: Smart Detection notification change - Azure Application Insights
description: Change to the default notification recipients from Smart Detection. Smart Detection lets you monitor application traces with Azure Application Insights for unusual patterns in trace telemetry.
ms.topic: conceptual
ms.date: 02/14/2021
ms.reviewer: yagil
---
# Smart Detection e-mail notification change

>[!NOTE]
>You can migrate your Application Insight resources to alerts-based smart detection (preview). The migration creates alert rules for the different smart detection modules. Once created, you can manage and configure these rules just like any other Azure Monitor alert rules. You can also configure action groups for these rules, thus enabling multiple methods of taking actions or triggering notification on new detections.
>
> See [Smart Detection Alerts migration](./alerts-smart-detections-migration.md) for more details on the migration process and the behavior of smart detection after the migration.

Based on customer feedback, on April 1, 2019, we’re changing the default roles who receive email notifications from Smart Detection.

## What is changing?

Currently, Smart Detection email notifications are sent by default to the _Subscription Owner_, _Subscription Contributor_, and _Subscription Reader_ roles. These roles often include users who are not actively involved in monitoring, which causes many of these users to receive notifications unnecessarily. To improve this experience, we are making a change so that email notifications only go to the [Monitoring Reader](../../role-based-access-control/built-in-roles.md#monitoring-reader) and [Monitoring Contributor](../../role-based-access-control/built-in-roles.md#monitoring-contributor) roles by default.

## Scope of this change

This change will affect all Smart Detection rules, excluding the following ones:

* Smart Detection rules marked as preview. These Smart Detection rules don’t support email notifications today.

* Failure Anomalies rule.

## How to prepare for this change?

To ensure that email notifications from Smart Detection are sent to relevant users, those users must be assigned to the [Monitoring Reader](../../role-based-access-control/built-in-roles.md#monitoring-reader) or [Monitoring Contributor](../../role-based-access-control/built-in-roles.md#monitoring-contributor) roles of the subscription.

To assign users to the Monitoring Reader or Monitoring Contributor roles via the Azure portal, follow the steps described in the [Assign Azure roles](../../role-based-access-control/role-assignments-portal.md) article. Make sure to select the _Monitoring Reader_ or _Monitoring Contributor_ as the role to which users are assigned.

> [!NOTE]
> Specific recipients of Smart Detection notifications, configured using the _Additional email recipients_ option in the rule settings, will not be affected by this change. These recipients will continue receiving the email notifications.

If you have any questions or concerns about this change, don’t hesitate to [contact us](mailto:smart-alert-feedback@microsoft.com).

## Next steps

Learn more about Smart Detection:

- [Failure anomalies](./proactive-failure-diagnostics.md)
- [Memory Leaks](./proactive-potential-memory-leak.md)
- [Performance anomalies](./smart-detection-performance.md)

