---
title: Use the Azure portal to create an IoT Hub | Microsoft Docs
description: How to create, manage, and delete Azure IoT hubs through the Azure portal. Includes information about pricing tiers, scaling, security, and messaging configuration.
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 09/06/2018
ms.author: kgremban
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

**IP Filter**: Specify a range of IP addresses that will be accepted or rejected by the IoT hub.

**Properties**: A list of properties that you can copy and use elsewhere, such as the resource ID, resource group, location, and so on.

For a complete list of options to update an IoT hub, see the [**az iot hub update** commands](/cli/azure/iot/hub#az-iot-hub-update) reference page.

### Shared access policies

You can also view or modify the list of shared access policies by choosing **Shared access policies** in the **Security settings** section. These policies define the permissions for devices and services to connect to IoT Hub.

Select **Add shared access policy** to open the **Add shared access policy** blade.  You can enter the new policy name and the permissions that you want to associate with this policy, as shown in the following screenshot:

:::image type="content" source="./media/iot-hub-create-through-portal/iot-hub-add-shared-access-policy.png" alt-text="Screenshot showing how to add a shared access policy." lightbox="./media/iot-hub-create-through-portal/iot-hub-add-shared-access-policy.png":::

* The **Registry Read** and **Registry Write** policies grant read and write access rights to the identity registry. These permissions are used by back-end cloud services to manage device identities. Choosing the write option automatically includes the read option.

* The **Service Connect** policy grants permission to access service endpoints. This permission is used by back-end cloud services to send and receive messages from devices. It's also used to update and read device twin and module twin data.

* The **Device Connect** policy grants permissions for sending and receiving messages using the IoT Hub device-side endpoints. This permission is used by devices to send and receive messages from an IoT hub or update and read device twin and module twin data. It's also used for file uploads.

Select **Add** to add your newly created policy to the existing list.

For more detailed information about the access granted by specific permissions, see [IoT Hub permissions](./iot-hub-dev-guide-sas.md#access-control-and-permissions).

## Register a new device in the IoT hub

[!INCLUDE [iot-hub-include-create-device](../../includes/iot-hub-include-create-device.md)]

## Message routing for an IoT hub

Select **Message Routing** under **Messaging** to see the Message Routing pane, where you define routes and custom endpoints for the hub. [Message routing](iot-hub-devguide-messages-d2c.md) enables you to manage how data is sent from your devices to your endpoints. The first step is to add a new route. Then you can add an existing endpoint to the route, or create a new one of the types supported, such as blob storage.

### Routes

**Routes** is the first tab on the **Message Routing** pane. To add a new route, select **+ Add**. 

![Screenshot showing the 'Message Routing' pane with the '+ Add' button.](./media/iot-hub-create-through-portal/iot-hub-message-routing.png)

You see the following screen.

:::image type="content" source="./media/iot-hub-create-through-portal/iot-hub-add-route-storage-endpoint.png" alt-text="Screenshot showing how to add an endpoint to a route." lightbox="./media/iot-hub-create-through-portal/iot-hub-add-route-storage-endpoint.png":::

Name your route. The route name must be unique within the list of routes for that hub.

For **Endpoint**, select one from the dropdown list or add a new one. In this example, a storage account and container are already available. To add them as an endpoint, choose **+ Add** next to the Endpoint dropdown and select **Blob Storage**. 

The following screen shows where the storage account and container are specified.

![Screenshot showing how to add a storage endpoint for the routing rule.](./media/iot-hub-create-through-portal/iot-hub-routing-add-storage-endpoint.png)

Add an endpoint name in **Endpoint name** if needed. Select **Pick a container** to select the storage account and container. When you've chosen a container then **Select**, the page returns to the **Add a storage endpoint** pane. Use the defaults for the rest of the fields and **Create** to create the endpoint for the storage account and add it to the routing rules. 

You return to the **Add a route** page. For **Data source**, select Device Telemetry Messages.

Next, add a routing query. In this example, the messages that have an application property called `level` with a value equal to `critical` are routed to the storage account.

![Screenshot showing how to save a new routing rule.](./media/iot-hub-create-through-portal/iot-hub-add-route.png)

Select **Save** to save the routing rule. You return to the **Message routing** pane, and your new routing rule is displayed.

### Custom endpoints

If you have a custom endpoint to add, select the **Custom endpoints** tab. You see custom endpoints if they were previously created. From here, you can add new endpoints or delete existing endpoints.

> [!NOTE]
> If you delete a route, it does not delete the endpoints assigned to that route. To delete an endpoint, select the **Custom endpoints** tab, select the endpoint you want to delete, then choose **Delete**.

You can read more about custom endpoints in [Reference - IoT hub endpoints](iot-hub-devguide-endpoints.md).

You can define up to 10 custom endpoints for an IoT hub.

To see a full example of how to use custom endpoints with routing, see [Message routing with IoT Hub](tutorial-routing.md).

## Find a specific IoT hub

Here a few ways to find a specific IoT hub in your subscription:

1. From the Azure homepage, select the IoT Hub icon. Find and select your IoT hub from the list.

:::image type="content" source="./media/iot-hub-create-through-portal/select-iot-hub.png" alt-text="Screenshot showing how to find your IoT hub.":::

1. If you know the resource group to which the IoT hub belongs, choose **Resource groups**, then select the resource group from the list. The resource group screen shows all of the resources in that group, including IoT hubs. Select your hub.

2. Choose **All resources**. On the **All resources** pane, there's a dropdown list that defaults to `All types`. Select the dropdown list, uncheck `Select all`. Find `IoT Hub` and check it. Select the dropdown list box to close it, and the entries will be filtered, showing only your IoT hubs.

## Delete the IoT hub

To delete an IoT hub, open your IoT hub in the Azure portal, then choose **Delete**.

:::image type="content" source="./media/iot-hub-create-through-portal/delete-iot-hub.png" alt-text="Screenshot showing where to find the delete button for an IoT hub in the Azure portal." lightbox="./media/iot-hub-create-through-portal/delete-iot-hub.png":::

## Next steps

Learn more about managing Azure IoT Hub:

* [Message routing with IoT Hub](tutorial-routing.md)
* [Monitor your IoT hub](monitor-iot-hub.md)