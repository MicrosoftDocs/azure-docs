---
title: Azure IoT Hub IP connection filters | Microsoft Docs
description: How to use IP filtering to block connections from specific IP addresses for to your Azure IoT hub. You can block connections from individual or ranges of IP addresses.
author: rezasherafat
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 05/23/2017
ms.author: rezas
---


# Use IP filters

Security is an important aspect of any IoT solution based on Azure IoT Hub. Sometimes you need to explicitly specify the IP addresses from which devices can connect as part of your security configuration. The _IP filter_ feature enables you to configure rules for rejecting or accepting traffic from specific IPv4 addresses.

## When to use

There are two specific use-cases when it is useful to block the IoT Hub endpoints for certain IP addresses:

- Your IoT hub should receive traffic only from a specified range of IP addresses and reject everything else. For example, you are using your IoT hub with [Azure Express Route] to create private connections between an IoT hub and your on-premises infrastructure.
- You need to reject traffic from IP addresses that have been identified as suspicious by the IoT hub administrator.

## How filter rules are applied

The IP filter rules are applied at the IoT Hub service level. Therefore the IP filter rules apply to all connections from devices and back-end apps using any supported protocol.

Any connection attempt from an IP address that matches a rejecting IP rule in your IoT hub receives an unauthorized 401 status code and description. The response message does not mention the IP rule.

## Default setting

By default, the **IP Filter** grid in the portal for an IoT hub is empty. This default setting means that your hub accepts connections any IP address. This default setting is equivalent to a rule that accepts the 0.0.0.0/0 IP address range.

![IoT Hub default IP filter settings][img-ip-filter-default]

## Add or edit an IP filter rule

When you add an IP filter rule, you are prompted for the following values:

- An **IP filter rule name** that must be a unique, case-insensitive, alphanumeric string up to 128 characters long. Only the ASCII 7-bit alphanumeric characters plus `{'-', ':', '/', '\', '.', '+', '%', '_', '#', '*', '?', '!', '(', ')', ',', '=', '@', ';', '''}` are accepted.
- Select a **reject** or **accept** as the **action** for the IP filter rule.
- Provide a single IPv4 address or a block of IP addresses in CIDR notation. For example, in CIDR notation 192.168.100.0/22 represents the 1024 IPv4 addresses from 192.168.100.0 to 192.168.103.255.

![Add an IP filter rule to an IoT hub][img-ip-filter-add-rule]

After you save the rule, you see an alert notifying you that the update is in progress.

![Notification about saving an IP filter rule][img-ip-filter-save-new-rule]

The **Add** option is disabled when you reach the maximum of 10 IP filter rules.

You can edit an existing rule by double-clicking the row that contains the rule.

> [!NOTE]
> Rejecting IP addresses can prevent other Azure Services (such as Azure Stream Analytics, Azure Virtual Machines, or the Device Explorer in the portal) from interacting with the IoT hub.

> [!WARNING]
> If you use Azure Stream Analytics (ASA) to read messages from an IoT hub with IP filtering enabled, use the Event Hub-compatible name and endpoint of your IoT Hub in the ASA connection string.

## Delete an IP filter rule

To delete an IP filter rule, select one or more rules in the grid and click **Delete**.

![Delete an IoT Hub IP filter rule][img-ip-filter-delete-rule]

## IP filter rule evaluation

IP filter rules are applied in order and the first rule that matches the IP address determines the accept or reject action.

For example, if you want to accept addresses in the range 192.168.100.0/22 and reject everything else, the first rule in the grid should accept the address range 192.168.100.0/22. The next rule should reject all addresses by using the range 0.0.0.0/0.

You can change the order of your IP filter rules in the grid by clicking the three vertical dots at the start of a row and using drag and drop.

To save your new IP filter rule order, click **Save**.

![Change the order of your IoT Hub IP filter rules][img-ip-filter-rule-order]

## Next steps

To further explore the capabilities of IoT Hub, see:

- [Operations monitoring][lnk-monitor]
- [IoT Hub metrics][lnk-metrics]

<!-- Images -->
[img-ip-filter-default]: ./media/iot-hub-ip-filtering/ip-filter-default.png
[img-ip-filter-add-rule]: ./media/iot-hub-ip-filtering/ip-filter-add-rule.png
[img-ip-filter-save-new-rule]: ./media/iot-hub-ip-filtering/ip-filter-save-new-rule.png
[img-ip-filter-delete-rule]: ./media/iot-hub-ip-filtering/ip-filter-delete-rule.png
[img-ip-filter-rule-order]: ./media/iot-hub-ip-filtering/ip-filter-rule-order.png


<!-- Links -->

[IoT Hub developer guide]: iot-hub-devguide.md
[Azure Express Route]:  https://azure.microsoft.com/documentation/articles/expressroute-faqs/#supported-services

[lnk-monitor]: iot-hub-operations-monitoring.md
[lnk-metrics]: iot-hub-metrics.md
