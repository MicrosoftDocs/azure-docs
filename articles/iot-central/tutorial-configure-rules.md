---
title: Configure rules and actions in Azure IoT Central | Microsoft Docs
description: This tutorial shows you, as a builder, how to configure telemetry-based rules and actions in your Azure IoT Central application.
author: ankitgupta
ms.author: ankitgup
ms.date: 04/16/2018
ms.topic: tutorial
ms.service: iot-central
services: iot-central
ms.custom: mvc
manager: peterpr
---

# Tutorial: Configure rules and actions for your device in Azure IoT Central

*This article applies to operators, builders, and administrators.*

In this tutorial, you create a rule that sends an email when the temperature in a connected air conditioner device exceeds 90&deg; F.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a telemetry-based rule
> * Add an action

## Prerequisites

Before you begin, you should complete the [Define a new device type in your application](tutorial-define-device-type.md) tutorial to create the **Connected Air Conditioner** device template to work with.

## Create a telemetry-based rule

1. To add a new telemetry-based rule to your application, in the left navigation menu, choose **Device Explorer**:

    ![Device Explorer page](media/tutorial-configure-rules/explorerpage1.png)

    You see the **Connected Air Conditioner (1.0.0)** device template and the **Connected Air Conditioner-1** device you created in the previous tutorial.

2. To start customizing your connected air conditioner device, choose the device you created in the previous tutorial:

    ![Connected air conditioner page](media/tutorial-configure-rules/builderdevicelist1.png)

3. To start adding a rule in the **Rules** view, choose **Rules** and then click **Edit Template**:

    ![Rules view](media/tutorial-configure-rules/builderedittemplate.png)

4. To create a threshold-based telemetry rule, click **New Rule**, and then **Telemetry**.

    ![Edit Template](media/tutorial-configure-rules/buildernewrule.png)

5. To define your rule, use the information in the following table:

    | Setting                                      | Value                             |
    | -------------------------------------------- | ------------------------------    |
    | Name                                         | Air conditioner temperature alert |
    | Enable rule for all devices of this template | On                                |
    | Enable rule on this device                   | On                                |
    | Condition                                    | Temperature is greater than 90    |
    | Aggregation                                  | None                              |

    ![Temperature rule condition](media/tutorial-configure-rules/buildertemperaturerule1.png)

## Add an action

When you define a rule, you also define an action to run when the rule conditions are met. In this tutorial, you add an action to send an email as a notification that the rule triggered.

1. To add an **Action**, first **Save** the rule and then scroll down on the **Configure Telemetry Rule** panel and choose the **+** next to **Actions**, then choose **Email**:

    ![Temperature rule action](media/tutorial-configure-rules/builderaddaction1.png)

2. To define your action, use the information in the following table:

    | Setting   | Value                          |
    | --------- | ------------------------------ |
    | To        | Your email address             |
    | Notes     | Air conditioner temperature exceeded the threshold. |

    > [!NOTE]
    > To receive an email notification, the email address must be a [user ID in the application](howto-administer.md), and that user must have signed in to the application at least once.

    ![Application Builder Temperature action](media/tutorial-configure-rules/buildertemperatureaction.png)

3. Choose **Save**. Your rule is listed on the **Rules** page:

    ![Application Builder rules](media/tutorial-configure-rules/builderrules1.png)

4. Choose **Done** to exit the **Edit Template** mode.
 

## Test the rule

Shortly after you save the rule, it becomes live. When the conditions defined in the rule are met, your application sends a message to the email address you specified in the action.

![Email action](media/tutorial-configure-rules/email.png)

> [!NOTE]
> After your testing is complete, turn off the rule to stop receiving alerts in your Inbox. 

## Next steps

In this tutorial, you learned how to:

<!-- Repeat task list from intro -->
> [!div class="nextstepaction"]
> * Create a telemetry-based rule
> * Add an action

Now that you have defined a threshold-based rule the suggested next step is to [Customize the operator's views](tutorial-customize-operator.md).

To learn more about different types of rules in Azure IoT Central and how to parameterize the rule definition, see:
* [Create a telemetry rule and set up notifications](howto-create-telemetry-rules.md).
* [Create an event rule and set up notifications](howto-create-event-rules.md).

<!-- Next tutorials in the sequence -->
