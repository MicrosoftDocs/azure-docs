---
title: Create an IoT hub using the Azure portal
description: How to create, manage, and delete Azure IoT hubs through the Azure portal. Includes information about pricing tiers, scaling, security, and messaging configuration.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.topic: how-to
ms.date: 12/20/2022
ms.custom: ['Role: Cloud Development']
---

# Create an IoT hub using the Azure portal

[!INCLUDE [iot-hub-resource-manager-selector](../../includes/iot-hub-resource-manager-selector.md)]

This article describes how to create and manage an IoT hub, using the [Azure portal](https://portal.azure.com).

## Create an IoT hub

[!INCLUDE [iot-hub-include-create-hub](../../includes/iot-hub-include-create-hub.md)]

## Update the IoT hub

You can change the settings of an existing IoT hub after it's created from the IoT Hub pane. Here are some properties you can set for an IoT hub:

**Pricing and scale**: Migrate to a different tier or set the number of IoT Hub units.

**IP Filter**: Specify a range of IP addresses for the IoT hub to accept or reject.

**Properties**: A list of properties that you can copy and use elsewhere, such as the resource ID, resource group, location, and so on.

For a complete list of options to update an IoT hub, see the [**az iot hub update** commands](/cli/azure/iot/hub#az-iot-hub-update) reference page.

### Shared access policies

You can also view or modify the list of shared access policies by choosing **Shared access policies** in the **Security settings** section. These policies define the permissions for devices and services to connect to IoT Hub.

Select **Add shared access policy** to open the **Add shared access policy** page.  You can enter the new policy name and the permissions that you want to associate with this policy, as shown in the following screenshot:

:::image type="content" source="./media/iot-hub-create-through-portal/iot-hub-add-shared-access-policy.png" alt-text="Screen capture showing how to add a shared access policy." lightbox="./media/iot-hub-create-through-portal/iot-hub-add-shared-access-policy.png":::

* The **Registry Read** and **Registry Write** policies grant read and write access rights to the identity registry. These permissions are used by back-end cloud services to manage device identities. Choosing the write option automatically includes the read option.

* The **Service Connect** policy grants permission to access service endpoints. This permission is used by back-end cloud services to send and receive messages from devices. It's also used to update and read device twin and module twin data.

* The **Device Connect** policy grants permissions for sending and receiving messages using the IoT Hub device-side endpoints. This permission is used by devices to send and receive messages from an IoT hub or update and read device twin and module twin data. It's also used for file uploads.

Select **Add** to add your newly created policy to the existing list.

For more detailed information about the access granted by specific permissions, see [IoT Hub permissions](./iot-hub-dev-guide-sas.md#access-control-and-permissions).

## Register a new device in the IoT hub

[!INCLUDE [iot-hub-include-create-device](../../includes/iot-hub-include-create-device.md)]

## Disable or delete a device in an IoT hub

If you want to keep a device in your IoT hub's identity registry, but want to prevent it from connecting then you can change its status to *disabled.*

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT hub.

1. Select **Devices** from the navigation menu.

1. Select the name of the device that you want to disable to view its device details page.

1. On the device details page, set the **Enable connection to IoT Hub** parameter to **Disable**.

   :::image type="content" source="./media/iot-hub-create-through-portal/disable-device.png" alt-text="Screenshot that shows disabling a device connection.":::

If you want to remove a device from your IoT hub's identity registry, you can delete its registration.

1. From the **Devices** page of your IoT hub, select the checkbox next to the device that you want to delete.

1. Select **Delete** to remove the device registration.

   :::image type="content" source="./media/iot-hub-create-through-portal/delete-device.png" alt-text="Screenshot that shows deleting a device."::: 

## Delete an IoT hub

To delete an IoT hub, open your IoT hub in the Azure portal, then choose **Delete**.

:::image type="content" source="./media/iot-hub-create-through-portal/delete-iot-hub.png" alt-text="Screenshot showing where to find the delete button for an IoT hub in the Azure portal." lightbox="./media/iot-hub-create-through-portal/delete-iot-hub.png":::

## Next steps

Learn more about managing Azure IoT Hub:

* [Message routing with IoT Hub](how-to-routing-portal.md)
* [Monitor your IoT hub](monitor-iot-hub.md)