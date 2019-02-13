---
title: Azure Application Insights Smart Detection – Upcoming change to the default notification recipients | Microsoft Docs
description: Monitor application traces with Azure Application Insights for unusual patterns in trace telemetry.
services: application-insights
author: harelbr                            
manager: carmonm
ms.service: application-insights
ms.topic: conceptual
ms.reviewer: mbullwin
ms.date: 02/12/2019
ms.author: harelbr
---

# Smart Detection e-mail notification change

Based on customer feedback, on April 1, 2019, we’re changing the default roles who receive email notifications from Smart Detection.

## What is changing?

Currently, Smart Detection email notifications are sent by default to the _Subscription Owner_, _Subscription Contributor, and _Subscription Reader_ roles. These roles often include users who are not actively involved in monitoring, which causes many of these users to receive notifications unnecessarily. To improve this experience, we are making a change so that email notifications only go to the [Monitoring Reader](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#monitoring-reader) and [Monitoring Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#monitoring-contributor) roles by default.

## Scope of this change

This change will affect all Smart Detection rules, excluding the following ones:

* Smart Detection rules marked as preview. These Smart Detection rules don’t support email notifications today.

* Failure Anomalies rule. This rule will start targeting the new default roles once it’s migrated from a classic alert to the unified alerts platform (more information is available [here](https://docs.microsoft.com/azure/azure-monitor/platform/monitoring-classic-retirement).

## How to prepare for this change?

To ensure that email notifications from Smart Detection are sent to the relevant users, those users must be assigned to the [Monitoring Reader](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#monitoring-reader) and [Monitoring Contributor]((https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#monitoring-contributor) roles. Assignment should be made at either the subscription level (affecting all Application Insights resources in the subscription), or at the Application Insights resource level (affecting only that specific resource).

To assign users to the Monitoring Reader or Monitoring Contributor roles via the Azure portal, follow the steps described in the [Add a role assignment](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal#add-a-role-assignment) article. Make sure to select the _Monitoring Reader_ or _Monitoring Contributor_ as the role to which users are assigned.

> [!NOTE]
> Specific recipients of Smart Detection notifications, configured using the _Additional email recipients_ option in the rule settings, will not be affected by this change, and will continue receiving the email notifications.

If you have any questions or concerns regarding this change, don’t hesitate to [contact us](mailto:smart-alert-feedback@microsoft.com).
