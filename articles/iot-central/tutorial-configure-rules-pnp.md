---
title: Configure rules and actions in Azure IoT Central | Microsoft Docs
description: This tutorial shows you, as a builder, how to configure telemetry-based rules and actions in your Azure IoT Central application.
author: ankitscribbles
ms.author: ankitgup
ms.date: 06/09/2019
ms.topic: tutorial
ms.service: iot-central
services: iot-central
ms.custom: mvc
manager: peterpr
---

# Tutorial: Configure rules and actions for your device in Azure IoT Central (Plug and Play)

*This article applies to operators, builders, and administrators.*

[!INCLUDE [iot-central-pnp-original](../../includes/iot-central-pnp-original-note.md)]

In this tutorial, you create a rule that sends an email when the temperature in a connected air conditioner device exceeds 90&deg; F.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a telemetry-based rule
> * Add an action

## Prerequisites

Before you begin, you should complete the [Define a new device type in your application](tutorial-define-device-type-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json) tutorial to create the **Connected Air Conditioner** device template to work with.

## Create a telemetry-based rule

1. To add a new telemetry-based rule to your application, in the left navigation menu, select **Rules**.
1. To create a new rule, select **+ New**. Then choose **Telemetry**.
1. Enter **Environmental temperature** as the rule name.
1. In the Scope section, select the **Environment Sensor** as the device template. Scope is what devices should this rule be applied on. Filter further using **+ Filter**.
1. In the Condition section, to define what your rule will trigger on, use the information below.

    | Field                                        | Value                             |
    | -------------------------------------------- | ------------------------------    |
    | Measurement                                  | Temperature                       |
    | Operator                                     | is greater than                   |
    | Value                                        | 90                                |

 To add more, select **+ Condition**.

1. To add an action that runs when the rule is triggered, select **+ Action**, and choose **Email**.
1. To define your action use the information in the following table.

    | Setting   | Value                                             |
    | --------- | ------------------------------------------------- |
    | To        | Your email address                                |
    | Notes     | Environmental temperature exceeded the threshold. |

    > [!NOTE]
    > To receive an email notification, the email address must be a [user ID in the application](howto-administer.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json), and that user must have signed in to the application at least once.

1. Select **Save**. Your rule is listed on the **Rules** page.

## Test the rule

Shortly after you save the rule, it becomes live. When the conditions defined in the rule are met, your application sends a message to the email address you specified in the action.

> [!NOTE]
> After your testing is complete, turn off the rule to stop receiving alerts in your inbox.

## Next steps

In this tutorial, you learned how to:

<!-- Repeat task list from intro -->
> [!div class="nextstepaction"]
> * Create a telemetry-based rule
> * Add an action

Now that you've defined a threshold-based rule the suggested next step is to [Customize the operator's views](tutorial-customize-operator-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json).

To learn more about different types of rules in Azure IoT Central and how to parameterize the rule definition, see:
* [Create a telemetry rule and set up notifications](howto-create-telemetry-rules-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json).
* [Create an event rule and set up notifications](howto-create-event-rules-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json).

<!-- Next tutorials in the sequence -->