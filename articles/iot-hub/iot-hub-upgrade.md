---
title: Upgrade Azure IoT Hub
description: Change the pricing and scale tier for IoT Hub to get more messaging and device management capabilities. 
author: kgremban

ms.service: iot-hub
ms.topic: upgrade-and-migration-article
ms.date: 02/07/2023
ms.author: kgremban
---

# How to upgrade your IoT hub

As your IoT solution grows, Azure IoT Hub is ready to help you scale. Azure IoT Hub offers two tiers, basic (B) and standard (S), to accommodate customers that want to use different features. Within each tier are three sizes (1, 2, and 3) that determine the number of messages that can be sent each day.

When you have more devices and need more capabilities, there are three ways to adjust your IoT hub to suit your needs:

* Add units within the IoT hub to increase the daily message limit for that hub. For example, each extra unit in a B1 IoT hub allows for an extra 400,000 messages per day.

* Change the size of the IoT hub. For example, migrate a hub from the B1 tier to the B2 tier to increase the number of messages that each unit can support per day from 400,000 to 6 million. Both these changes can occur without interrupting existing operations.

* Upgrade to a higher tier. For example, upgrade a hub from the B1 tier to the S1 tier for access to advanced features with the same messaging capacity.
   > [!Warning]
   > You cannot upgrade from a Free Hub to a Paid Hub through our upgrade function.  You must create a Paid hub and migrate the configurations and devices from the Free hub to the Paid hub. This process is documented at [How to migrate an IoT hub](./migrate-hub-state-cli.md).
   > [!Tip]
   > When you are upgrading your IoT Hub to a higher tier, some messages may be received out of order for a short period of time. If your business logic relies on the order of messages, we recommend upgrading during non-business hours.

If you want to downgrade your IoT hub, you can remove units and reduce the size of the IoT hub but you can't downgrade to a lower tier. For example, you can move from the S2 tier to the S1 tier, but not from the S2 tier to the B1 tier. Only one type of [IoT Hub edition](https://azure.microsoft.com/pricing/details/iot-hub/) within a tier can be chosen per IoT hub. For example, you can create an IoT hub with multiple units of S1. However, you can't create an IoT hub with a mix of units from different editions, such as S1 and B3 or S1 and S2.

These examples are meant to help you understand how to adjust your IoT hub as your solution changes. For specific information about each tier's capabilities, you should always refer to [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/).

## Upgrade your existing IoT hub

If you want to upgrade an existing IoT hub, you can do so from the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com/) and navigate to your IoT hub.

1. Select **Pricing and scale** from the navigation menu.

   :::image type="content" source="./media/iot-hub-upgrade/pricing-scale.png" alt-text="Screenshot that shows the pricing and scale page for an IoT hub.":::

1. To upgrade the tier for your hub, select **Upgrade** on the tier tile. You can only upgrade from the basic tier to the standard tier. You can't change the tier of a free or standard hub.

1. To change the size or units for your hub, select **Adjust** on the daily message limit tile.

   On the **Message and pricing options** page, choose the new daily message limit that you want for your IoT hub. Or, if you prefer to choose the specific tier and units combination, select **Advanced options**. For more information, see [Choose the right IoT Hub for your solution](iot-hub-scaling.md).

   :::image type="content" source="./media/iot-hub-upgrade/message-pricing-advanced-options.png" alt-text="Screenshot that shows how to upgrade the size or units of your IoT hub.":::

The maximum limit of device-to-cloud partitions for basic tier and standard tier IoT hubs is 32. Most IoT hubs only need four partitions. You choose the number of partitions when you create the IoT hub. The number of partitions relates the device-to-cloud messages to the number of simultaneous readers of these messages. The number of partitions remains unchanged when you migrate from the basic tier to the standard tier.

## Next steps

Get more details about [How to choose the right IoT Hub tier](iot-hub-scaling.md).