---
title: Overview of Azure Monitor Alerts
description: Learn about Azure Monitor alerts, alert rules, action processing rules, and action groups. You will learn how all of these work together to monitor your system and notify you if something is wrong.
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: overview 
ms.date: 04/26/2022
ms.custom: template-overview 
---
# What are Azure Monitor Alerts?

This article explains Azure Monitor alerts, alert rules, alert processing rules and action groups, and how they work together to monitor your system and notify you if something is wrong. 

Alerts help you detect and address issues before users notice them by proactively notifying you when Azure Monitor data indicates that there may be a problem with your infrastructure or application.

You can alert on any metric or log data source in the Azure Monitor data platform.

This diagram shows you how alerts work:

:::image type="content" source="media/alerts-overview/alerts-flow.svg" alt-text="Graphic explaining Azure Monitor alerts.":::

- An **alert rule** monitors your telemetry and captures a signal that indicates that something is happening on a specified target. After capturing the signal, the alert rule checks to see if the signal meets the criteria of the condition. If the conditions are met, an alert is triggered, which initiates the associated action group and updates the state of the alert. An alert rule is made up of:
     - The resource(s) to be monitored.
     - The signal or telemetry from the resource
     - Conditions
If you are monitoring more than one resource, the condition is evaluated separately for each of the resources and alerts are fired for each resource separately.

    Use these links to learn how to [create a new alert rule](alerts-log.md#create-a-new-log-alert-rule-in-the-azure-portal), or [enable recommended out-of-the-box alert rules in the Azure portal (preview)](alerts-log.md#enable-recommended-out-of-the-box-alert-rules-in-the-azure-portal-preview). 

Once an alert is triggered, the alert is made up of:
 - An **alert processing rule** that allows you to apply processing on fired alerts. Alert processing rules modify the fired alerts as they are being fired. You can use alert processing rules to add or suppress action groups, apply filters or have the rule processed on a pre-defined schedule.
 - An **action group** can trigger notifications or an automated workflow to let users know that an alert has been triggered. Action groups can include:
     - Notification methods such as email, SMS, and push notifications.
     - Automation Runbooks
     - Azure functions
     - ITSM incidents
     - Logic Apps
     - Secure webhooks
     - Webhooks
     - Event hubs
- The **alert condition** is set by the system. When an alert fires, the alert’s monitor condition is set to ‘fired’, and when the underlying condition that caused the alert to fire clears, the monitor condition is set to ‘resolved’.
- The **user response** is set by the user and doesn’t change until the user changes it. 

You can see all fired alerts in the Alerts page in the Azure portal. 
## [Section 1 H2]
<!-- add your content here -->

## [Section 2 H2]
<!-- add your content here -->

## [Section n H2]
<!-- add your content here -->
## Next steps

- [Learn more about Smart Groups](./alerts-smartgroups-overview.md?toc=%2fazure%2fazure-monitor%2ftoc.json)
- [Learn about action groups](../alerts/action-groups.md)
- [Managing your alert instances in Azure](./alerts-managing-alert-instances.md?toc=%2fazure%2fazure-monitor%2ftoc.json)
- [Managing Smart Groups](./alerts-managing-smart-groups.md?toc=%2fazure%2fazure-monitor%2ftoc.json)
- [Learn more about Azure alerts pricing](https://azure.microsoft.com/pricing/details/monitor/)
