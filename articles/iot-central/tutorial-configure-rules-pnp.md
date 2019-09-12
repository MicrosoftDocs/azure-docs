---
title: Configure rules and actions in Azure IoT Central | Microsoft Docs
description: This tutorial shows you, as a builder, how to configure telemetry-based rules and actions in your Azure IoT Central application.
author: dominicbetts
ms.author: dobett
ms.date: 08/06/2019
ms.topic: tutorial
ms.service: iot-central
services: iot-central
ms.custom: mvc
manager: philmea
---

# Tutorial: Configure rules and actions for your device in Azure IoT Central (preview features)

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

1. In the **Scope** section, select the **Environment Sensor** as the device template. The scope which devices this rule applies to. You can add more filter criteria using **+ Filter**.

1. In the **Condition** section, you define what triggers your rule. Use the following information to define a condition based on temperature telemetry:

    | Field                                        | Value                             |
    | -------------------------------------------- | ------------------------------    |
    | Measurement                                  | Temperature                       |
    | Operator                                     | is greater than                   |
    | Value                                        | 90                                |

    To add more conditions, select **+ Condition**.

    ![Create rule condition](./media/tutorial-configure-rules-pnp/condition.png)

1. To add an action to run when the rule triggers, select **+ Action**, and choose **Email**.

1. Use the information in the following table to define your action:

    | Setting   | Value                                             |
    | --------- | ------------------------------------------------- |
    | To        | Your email address                                |
    | Notes     | Environmental temperature exceeded the threshold. |

    > [!NOTE]
    > To receive an email notification, the email address must be a [user ID in the application](howto-administer-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json), and that user must have signed in to the application at least once.

    ![Create rule action](./media/tutorial-configure-rules-pnp/action.png)

1. Select **Save**. Your rule is listed on the **Rules** page.

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
