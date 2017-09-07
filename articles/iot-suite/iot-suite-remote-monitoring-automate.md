---
title: Detect device issues on Azure IoT Suite remote monitoring | Microsoft Docs
description: This tutorial shows you how to use rules and actions to automatically detect threshold-based device issues in the remote monitoring solution.
services: ''
suite: iot-suite
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-suite
ms.date: 09/06/2017
ms.topic: article
ms.devlang: NA
ms.tgt_pltfrm: NA
ms.workload: NA
---

# Detect issues using threshold-based rules

Contoso has a rule that generates a critical alert when the pressure reported by a **Chiller** device exceeds 250 PSI. As an operator, you want to identify **Chiller** devices that may have problematic sensors by looking for initial pressure spikes. To identify these devices, you create a rule to generate a warning when the pressure exceeds 150 PSI.

In this tutorial, you learn how to:

>[!div class="checklist"]
> * View the rules in your solution
> * Create a new rule
> * Edit an existing rule
> * Delete a rule

## Prerequisites

To follow this tutorial, you need a deployed instance of the remote monitoring solution in your Azure subscription.

If you haven't deployed the remote monitoring solution yet, you should complete the [Deploy the remote monitoring preconfigured solution](iot-suite-remote-monitoring-deploy.md) tutorial.

## View the rules in your solution

The **Rules & Actions** page in the solution displays a list of all the current rules:

<!-- TODO insert screenshot -->

To view only the rules that apply to **Chiller** devices, apply a filter:

<!-- TODO insert screenshot -->

You can view more information about a rule when you select it in the list:

<!-- TODO insert screenshot -->

To edit, disable, enable, or delete one or more rules, select multiple rules in the list:

<!-- TODO insert screenshot -->

## Create a new rule

To add a new rule that generates a warning when the pressure in a **Chiller** device exceeds 150 PSI, choose **New rule**:

<!-- TODO insert screenshot -->

Use the following values to create the rule:

| Setting          | Value                                 |
| ---------------- | ------------------------------------- |
| Name             | Chiller warning                       |
| Source           | **Chiller** device group              |
| Trigger field    | Pressure                              |
| Trigger operator | Greater than                          |
| Trigger value    | 150                                   |
| Severity level   | Warning                               |
| Alarm event text | Chiller pressure has exceeded 150 PSI |

To save the new rule, choose **Apply**:

<!-- TODO insert screenshot -->

You can view when the rule is triggered on the **Rules & Actions** page or on the **Dashboard** page.

## Edit an existing rule

To make a change to an existing rule, select it in the list of rules. Then, in the **Rule DetaiL** panel choose **Edit mode**.

<!-- TODO choose an existing rule to update -->

## Delete a rule

To temporarily switch off a rule, you can disable it in the list of rules. Choose the rule to disable, and then choose **Disable**. The **Status** of the rule in the list changes to indicate the rule is now disabled. You can re-enable a rule that you previously disabled using the same procedure.

<!-- TODO insert screenshot -->

To permanently delete a rule, choose the rule in the list of rules and then choose **Delete**.

You can enable, disable, and delete multiple rules at the same time if you select multiple rules in the list.

## Next steps

This tutorial showed you how to:

<!-- Repeat task list from intro -->
>[!div class="checklist"]
> * View the rules in your solution
> * Create a new rule
> * Edit an existing rule
> * Delete a rule

Now that you have learned how to detect issues using threshold-based rules, the suggested next steps are to learn how to:

* [Manage and configure your devices](./iot-suite-remote-monitoring-manage.md).
* [Troubleshoot and remediate device issues](./iot-suite-remote-monitoring-maintain.md).
* [Test your solution with simulated devices](iot-suite-remote-monitoring-test.md).

<!-- Next tutorials in the sequence -->