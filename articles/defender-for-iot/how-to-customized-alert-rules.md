---
title: Customized alert rules
description: You can add custom alert rules based on information detected by the sensor.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/29/2020
ms.topic: article
ms.service: azure
ms.topic: how-to
---

# Customize alert rules

You can add custom alert rules based on information detected by individual sensors. For example, define a rule that instructs a sensor to trigger an alert based on a Source IP, Destination IP, command (within a protocol). When the sensor detects the traffic defined in the rule, an alert or event is generated.

The alert message indicates that a user-defined rule triggered the alert.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image270.png" alt-text="user defind rule":::

To create a custom alert rule:

1. Select Custom Alerts from the Side menu of a sensor.
1. Select the + sign to create a rule.

 :::image type="content" source="media/how-to-work-with-alerts-sensor/image267.png" alt-text="create rule":::

1. Choose Category/Protocol from the Categories section.
1. Provide rule name.
1. Choose IP or MAC port and/or destination or leave empty to define “Any”.
1. Add a condition. A list of conditions and their properties is unique for each category.
1. It possible to select more than one condition.
1. Indicate if the rules trigger an Alarm or Event.
1. Select Severity.
1. Select if the rule will include a PCAP file.
1. Save.

The rule is added to the Customized Alerts Rules list. where you can review basic rule parameters, the last time the rule was triggered, and more. You can also enable and disable the rule from the list.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image269.png" alt-text="customized alert":::
