---
title: Run multiple actions from an Azure IoT Central rule | Microsoft Docs
description: Run multiple actions from a single IoT Central rule and create reusable groups of actions that you can run from multiple rules.
services: iot-central
author: dominicbetts
ms.author: dobett
ms.date: 12/06/2019
ms.topic: how-to
ms.service: iot-central
manager: philmea
---

# Group multiple actions to run from one or more rules

*This article applies to builders and administrators.*

In Azure IoT Central, you create rules to run actions when a condition is met. Rules are based on device telemetry or events. For example, you can notify an operator when the temperature of a device exceeds a threshold. This article describes how to use [Azure Monitor](../../azure-monitor/overview.md) *action groups* to attach multiple actions to an IoT Central rule. You can attach an action group to multiple rules. An [action group](../../azure-monitor/platform/action-groups.md) is a collection of notification preferences defined by the owner of an Azure subscription.

## Prerequisites

- An application created using a standard pricing plan
- An Azure account and subscription to create and manage Azure Monitor action groups

## Create action groups

You can [create and manage action groups in the Azure portal](../../azure-monitor/platform/action-groups.md) or with an [Azure Resource Manager template](../../azure-monitor/platform/action-groups-create-resource-manager-template.md).

An action group can:

- Send notifications such as an email, an SMS, or make a voice call.
- Run an action such as calling a webhook.

The following screenshot shows an action group that sends email and SMS notifications and calls a webhook:

![Action group](media/howto-use-action-groups/actiongroup.png)

To use an action group in an IoT Central rule, the action group must be in the same Azure subscription as the IoT Central application.

## Use an action group

To use an action group in your IoT Central application, first create a rule. When you add an action to the rule, select **Azure Monitor Action Groups**:

![Choose action](media/howto-use-action-groups/chooseaction.png)

Choose an action group from your Azure subscription:

![Choose action group](media/howto-use-action-groups/chooseactiongroup.png)

Select **Save**. The action group now appears in the list of actions to run when the rule is triggered:

![Saved action group](media/howto-use-action-groups/savedactiongroup.png)

The following table summarizes the information sent to the supported action types:

| Action type | Output format |
| ----------- | -------------- |
| Email       | Standard IoT Central email template |
| SMS         | Azure IoT Central alert: ${applicationName} - "${ruleName}" triggered on "${deviceName}" at ${triggerDate} ${triggerTime} |
| Voice       | Azure I.O.T Central alert: rule "${ruleName}" triggered on device "${deviceName}" at ${triggerDate} ${triggerTime}, in application ${applicationName} |
| Webhook     | { "schemaId" : "AzureIoTCentralRuleWebhook", "data": {[regular webhook payload](howto-create-webhooks.md#payload)}} |

The following text is an example SMS message from an action group:

`iotcentral: Azure IoT Central alert: Contoso - "Low pressure alert" triggered on "Motion sensor 2" at March 20, 2019 10:12 UTC`

## Next steps

Now that you've learned how to use action groups with rules, the suggested next step is to learn how to [manage your devices](howto-manage-devices.md).
