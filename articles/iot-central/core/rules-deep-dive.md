---
title: Configure rules and actions in Azure IoT Central | Microsoft Docs
description: This tutorial shows you, as a builder, how to configure telemetry-based rules and actions in your Azure IoT Central application.
author: vavilla
ms.author: vavilla
ms.date: 11/11/2019
ms.topic: conceptual
ms.service: iot-central
services: iot-central
manager: philmea
---

# Rules: How it works/Deep Dive (Working Title)

*This article applies to operators, builders, and administrators.*

Rules in IoT Central remotely monitor your connected devices. Below will describe how rules are evaluated.

## Target Devices

The purpose of the target devices section is to narrow down the devices on which the rule will act upon. As seen in the example below, a filter has been added to only include devices where the Manufactured State property equals Washington. The filter limits to which devices the rule will be ran on. Note, filters aren't something the rule will trigger on. It's a prerequisite for the rule to even start evaluating if the trigger conditions are true.

![Conditions](media/rules-deep-dive/filters.png)

## Multiple Conditions

Today when adding multiple conditions to a rule, those expressions will be logically AND'd together. All conditions must be met for the rule to be evaluated as true.  

In the example below, the conditions are checking for when the temperature is greater than 90 and humidity is less than 10. When both of the statements are true, rule will be evaluated as true and will be triggered.

![Conditions](media/rules-deep-dive/conditions.png)

## Aggregation Windowing

Rules evaluate the aggregating time windows as tumbling windows. In the example below, the time window is five minutes. Every five minutes, the rule will be evaluated on the last five minutes of data. The data will only be evaluated upon once in the window to which it corresponds to.  

![Tumbling Windows](media/rules-deep-dive/tumbling-window.png)

## Rules on Edge Modules

There is a restriction in rules when being applied on Edge Modules. Rules on telemetries from different modules are not evaluated as valid rules. An example of invalid conditions would be if the first condition of the rule is on a temperature telemetry from Module A and the second condition of the rule is on a humidity telemetry on Module B. The rule will not be valid and will throw an error.
