---
title: IoT Hub - IP Filter | Microsoft Docs
description: This tutorial show you to blacklist or whitelist certain IP addresses for Azure IoT Hub.
services: iot-hub
documentationcenter: ''
author: BeatriceOltean
manager: timlt
editor: ''

ms.assetid: f833eac3-5b5f-46a7-a47b-f4f6fc927f3f
ms.service: iot-hub
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/14/2016
ms.author: boltean

---

# IP Filter

Security is an important aspect of any IoT solution based on Azure IoT Hub. Sometimes you need to blacklist or whitelist certain IP addresses as part of your security configuration. The _IP filter_ feature enables you to configure rules for rejecting or accepting traffic from specific IPv4 addresses.

## When to use

There are two specific use-cases when it is useful to block the IoT Hub endpoints for certain IP addresses:

- When your IoT hub should receive traffic only from a specified range of IP addresses and reject everything else. For example, when you are using your IoT hub with [Azure Express Route] to create private connections between an IoT hub and your on-premises infrastructure.
- When you need to reject traffic from IP addresses that have been identified as suspicious by the IoT hub administrator.

## How filter rules are applied

The IP filter rules are applied at the IoT Hub service level. Therefore the IP filter rules apply to all connections from devices and back-end applications using any supported protocol.

Any connection attempt from an IP address that matches a rejecting IP rule in your IoT hub receives an unauthorized 401 status code and description. The response message does not mention the IP rule.

## Default setting
By default, the **IP Filter** grid in the portal for an IoT hub is empty. This default setting means that your hub accepts connections any IP address. This default setting is equivalent to a rule that accepts the 0.0.0.0/0 IP address range.

![][img-ip-filter-default]

## Add or edit an IP filter rule

When you add an IP filter rule, you are prompted for the following values:

- An **IP filter rule name** that must be a unique, case-insensitive, alphanumeric string up to 128 characters long. Only the ASCII 7-bit alphanumeric characters plus `{'-', ':', '/', '\', '.', '+', '%', '_', '#', '*', '?', '!', '(', ')', ',', '=', '@', ';', '''}` are accepted.
- Select a **reject** or **accept** as the **action** for the IP filter rule.
- Provide a single IPv4 address or a block of IP addesses in CIDR notation. For example, in CIDR notation 192.168.100.0/22 represents the 1024 IPv4 addresses from 192.168.100.0 to 192.168.103.255.

![][img-ip-filter-add-rule]

After you save the rule, you see an alert notifying you that the update is in progress.

![][img-ip-filter-save-new-rule]

The **Add** option is disabled when you reach the maximum of ten IP filter rules.

You can edit an existing rule by double-clicking the row that contains the rule.

## Delete an IP filter rule

To delete an IP filter rule, select one or more rules in the grid and click **Delete**.

![][img-ip-filter-delete-rule]

## IP filter rule evaluation

IP filter rules are applied in order and the first rule that matches the IP address determines the accept or reject action.

For example, if you want to accept addresses in the range 192.168.100.0/22 and reject everything else, the first rule in the grid should accept the address range 192.168.100.0/22. The next rule should reject all addresses by using the range 0.0.0.0/0. If you add a last rule that rejects the range 0.0.0.0/0, you change the default behavior to whitelisting.

You can change the order of your IP filter rules in the grid by clicking on the three vertical dots at the start of a row and using drag and drop.

To save your new IP filter rule order, click **Save**.

![][img-ip-filter-rule-order]


<!-- Images -->
[img-ip-filter-default]: ./media/iot-hub-ip-filtering/ip-filter-default.png
[img-ip-filter-add-rule]: ./media/iot-hub-ip-filtering/ip-filter-add-rule.png
[img-ip-filter-save-new-rule]: ./media/iot-hub-ip-filtering/ip-filter-save-new-rule.png
[img-ip-filter-delete-rule]: ./media/iot-hub-ip-filtering/ip-filter-delete-rule.png
[img-ip-filter-rule-order]: ./media/iot-hub-ip-filtering/ip-filter-rule-order.png


<!-- Links -->

[IoT Hub Developer Guide]: iot-hub-devguide.md
[Azure Express Route]:  https://azure.microsoft.com/en-us/documentation/articles/expressroute-faqs/#supported-services
