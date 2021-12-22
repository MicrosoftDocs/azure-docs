---
title: Configure a micro agent twin
description: In this tutorial, you will learn how to configure a micro agent twin.
author: ElazarK
ms.author: v-ekrieg
ms.topic: tutorial
ms.date: 12/22/2021
ms.custom: template-tutorial
---

# Tutorial: Configure a micro agent twin

This tutorial will help you learn how to configure a micro agent twin.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Configure a micro agent twin

## Prerequisites

- An Azure account. If you do not already have an Azure account, you can [create your Azure free account today](https://azure.microsoft.com/free/).

- A Defender for IoT subscription.

- An existing IoT Hub with:

    - [A connected device](quickstart-standalone-agent-binary-installation.md).

    - [A micro agent module twin](quickstart-create-micro-agent-module-twin.md).

## Micro agent configuration

To view and update the micro agent twin configuration:

1. Navigate to the [Azure portal](https://ms.portal.azure.com).

1. Search for, and select **IoT Hub**.

    :::image type="content" source="media/tutorial-micro-agent-configuration/iot-hub.png" alt-text="Screenshot of searching for the IoT hub in the searchbar.":::

1. Select your IoT Hub from the list.

1. Under the Device management section, select **Devices**.

    :::image type="content" source="media/tutorial-micro-agent-configuration/devices.png" alt-text="Screenshot of the device management section of the IoT hub.":::

1. Select your device from the list.

1. Select the module ID.

    :::image type="content" source="media/tutorial-micro-agent-configuration/module-id.png" alt-text="Screenshot of the device's module ID selection screen.":::

1. In the Module Identity Details screen select **Module Identity Twin**.

    :::image type="content" source="media/tutorial-micro-agent-configuration/module-identity-twin.png" alt-text="Screenshot of the Module Identity Details screen.":::

1. Change the value of any field by adding the field to the `"desired"` section with the new value.

    :::image type="content" source="media/tutorial-micro-agent-configuration/desired.png" alt-text="Screenshot of the sample output of the module identity twin.":::

    The agent successfully set the new configuration if the value of `"latest_state"`, under the `"reported"` section will show `"success"`.

    :::image type="content" source="media/tutorial-micro-agent-configuration/reported-success.png" alt-text="Screenshot of a successful configuration change.":::

    If the agent fails to set the new configuration, the value of `"latest_state"`, under the `"reported"` section will show `"failed"`. If this occurs, the `"latest_invalid_fields"` will contain a list of the fields that are invalid.

## Clean up resources

There are no resources to clean up.

## Next steps

In this tutorial, you learned how to configure a micro agent twin. Continue on to learn about additional [Micro agent configurations (Preview)](concept-micro-agent-configuration.md).
