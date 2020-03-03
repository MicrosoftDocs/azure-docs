---
title: Smart Detection notification change - Azure Application Insights
description: Change to the default notification recipients from Smart Detection. Smart Detection lets you monitor application traces with Azure Application Insights for unusual patterns in trace telemetry.
ms.topic: conceptual
author: harelbr
ms.author: harelbr
ms.date: 03/13/2019

ms.reviewer: mbullwin
---

# Smart Detection e-mail notification change

Based on customer feedback, on April 1, 2019, we’re changing the default roles who receive email notifications from Smart Detection.

## What is changing?

Currently, Smart Detection email notifications are sent by default to the _Subscription Owner_, _Subscription Contributor_, and _Subscription Reader_ roles. These roles often include users who are not actively involved in monitoring, which causes many of these users to receive notifications unnecessarily. To improve this experience, we are making a change so that email notifications only go to the [Monitoring Reader](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#monitoring-reader) and [Monitoring Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#monitoring-contributor) roles by default.

## Scope of this change

This change will affect all Smart Detection rules, excluding the following ones:

* Smart Detection rules marked as preview. These Smart Detection rules don’t support email notifications today.

* Failure Anomalies rule. This rule will start targeting the new default roles once it’s migrated from a classic alert to the unified alerts platform (more information is available [here](https://docs.microsoft.com/azure/azure-monitor/platform/monitoring-classic-retirement).)

## How to prepare for this change?

To ensure that email notifications from Smart Detection are sent to relevant users, those users must be assigned to the [Monitoring Reader](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#monitoring-reader) or [Monitoring Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#monitoring-contributor) roles of the subscription.

To assign users to the Monitoring Reader or Monitoring Contributor roles via the Azure portal, follow the steps described in the [Add a role assignment](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal#add-a-role-assignment) article. Make sure to select the _Monitoring Reader_ or _Monitoring Contributor_ as the role to which users are assigned.

> [!NOTE]
> Specific recipients of Smart Detection notifications, configured using the _Additional email recipients_ option in the rule settings, will not be affected by this change. These recipients will continue receiving the email notifications.

If you have any questions or concerns about this change, don’t hesitate to [contact us](mailto:smart-alert-feedback@microsoft.com).

## Next steps

Learn more about Smart Detection:

- [Failure anomalies](../../azure-monitor/app/proactive-failure-diagnostics.md)
- [Memory Leaks](../../azure-monitor/app/proactive-potential-memory-leak.md)
- [Performance anomalies](../../azure-monitor/app/proactive-performance-diagnostics.md)
