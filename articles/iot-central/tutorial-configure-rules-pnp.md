---
title: Configure rules and actions in Azure IoT Central | Microsoft Docs
description: This tutorial shows you, as a builder, how to configure telemetry-based rules and actions in your Azure IoT Central application.
author: dominicbetts
ms.author: dobett
ms.date: 07/10/2019
ms.topic: tutorial
ms.service: iot-central
services: iot-central
ms.custom: mvc
manager: philmea
---

# Tutorial: Configure rules and actions for your device in Azure IoT Central (Plug and Play)

*This article applies to operators, builders, and administrators.*

[!INCLUDE [iot-central-pnp-original](../../includes/iot-central-pnp-original-note.md)]

In this tutorial, you create a rule that sends an email when the temperature in an environmental sensor device exceeds 90&deg; F.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a telemetry-based rule
> * Add an action

## Prerequisites

Before you begin, you should complete the [Define a new device type in your application](tutorial-define-device-type-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json) tutorial to create the **Environment Sensor** device template to work with.

## Create a telemetry-based rule

1. To add a new telemetry-based rule to your application, in the left navigation menu, select **Rules**.

1. To create a new rule, select **+ New**. Then choose **Telemetry**.

1. Enter **Environmental temperature** as the rule name.

1. To add a scope for the rule that specifies the devices the rule is triggered by, select **+ Scope**.

1. To add a scope for the rule that specifies the telemetry values that trigger the rule, select **+ Condition**.

1. To add an action that runs when the rule is triggered, select **+ Action**.

1. Select **Save** to save your rule definition.

## Test the rule

Shortly after you save the rule, it becomes live. When the conditions defined in the rule are met, your application sends a message to the email address you specified in the action.

> [!NOTE]
> After your testing is complete, turn off the rule to stop receiving alerts in your inbox.

## Next steps

In this tutorial, you learned how to:

* Create a telemetry-based rule
* Add an action

Now that you've defined a threshold-based rule the suggested next step is to:

> [!div class="nextstepaction"]
> [Create an event rule and set up notifications](howto-create-event-rules-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json).
