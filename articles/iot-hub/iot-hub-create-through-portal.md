---
title: Use the Azure portal to create an IoT Hub | Microsoft Docs
description: How to create, manage, and delete Azure IoT hubs through the Azure portal. Includes information about pricing tiers, scaling, security, and messaging configuration.
author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 09/06/2018
ms.author: robinsh
---

# Create an IoT hub using the Azure portal

[!INCLUDE [iot-hub-resource-manager-selector](../../includes/iot-hub-resource-manager-selector.md)]

This article describes how to create and manage IoT hubs using the [Azure portal](https://portal.azure.com).

To use the steps in this tutorial, you need an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create an IoT hub

[!INCLUDE [iot-hub-include-create-hub](../../includes/iot-hub-include-create-hub.md)]

## Change the settings of the IoT hub

You can change the settings of an existing IoT hub after it's created from the IoT Hub pane.

![Screenshot showing the settings for the IoT hub](./media/iot-hub-create-through-portal/iot-hub-settings-panel.png)

Here are some of the properties you can set for an IoT hub:

**Pricing and scale**: You can use this property to migrate to a different tier or set the number of IoT Hub units. 

**Operations monitoring**: Turn the different monitoring categories on or off, such as logging for events related to device-to-cloud messages or cloud-to-device messages.

**IP Filter**: Specify a range of IP addresses that will be accepted or rejected by the IoT hub.

**Properties**: Provides the list of properties that you can copy and use elsewhere, such as the resource ID, resource group, location, and so on.

### Shared access policies

You can also view or modify the list of shared access policies by clicking **Shared access policies** in the **Settings** section. These policies define the permissions for devices and services to connect to IoT Hub. 

Click **Add** to open the **Add a shared access policy** blade.  You can enter the new policy name and the permissions that you want to associate with this policy, as shown in the following figure:

![Screenshot showing adding a shared access policy](./media/iot-hub-create-through-portal/iot-hub-add-shared-access-policy.png)

* The **Registry read** and **Registry write** policies grant read and write access rights to the identity registry. These permissions are used by back-end cloud services to manage device identities. Choosing the write option automatically chooses the read option.

* The **Service connect** policy grants permission to access service endpoints. This permission is used by back-end cloud services to send and receive messages from devices as well as to update and read device twin and module twin data.

* The **Device connect** policy grants permissions for sending and receiving messages using the IoT Hub device-side endpoints. This permission is used by devices to send and receive messages from an IoT hub, update and read device twin and module twin data, and perform file uploads.

Click **Create** to add this newly created policy to the existing list.

For more detailed information about the access granted by specific permissions, see [IoT Hub permissions](./iot-hub-devguide-security.md#iot-hub-permissions).

## Message Routing for an IoT hub

Click **Message Routing** under **Messaging** to see the Message Routing pane, where you define routes and custom endpoints for the hub. [Message routing](iot-hub-devguide-messages-d2c.md) enables you to manage how data is sent from your devices to your endpoints. The first step is to add a new route. Then you can add an existing endpoint to the route, or create a new one of the types supported, such as blob storage. 

![Message routing pane](./media/iot-hub-create-through-portal/iot-hub-message-routing.png)

### Routes

Routes is the first tab on the Message Routing pane. To add a new route, click +**Add**. You see the following screen. 

![Screenshot showing adding a new route](./media/iot-hub-create-through-portal/iot-hub-add-route-storage-endpoint.png)

Name your hub. The name must be unique within the list of routes for that hub. 

For **Endpoint**, you can select one from the dropdown list, or add a new one. In this example, a storage account and container are already available. To add them as an endpoint, click +**Add** next to the Endpoint dropdown and select **Blob Storage**. The following screen shows where the storage account and container are specified.

![Screenshot showing adding a storage endpoint for the routing rule](./media/iot-hub-create-through-portal/iot-hub-routing-add-storage-endpoint.png)

Click **Pick a container** to select the storage account and container. When you have selected those fields, it returns to the Endpoint pane. Use the defaults for the rest of the fields and **Create** to create the endpoint for the storage account and add it to the routing rules.

For **Data source**, select Device Telemetry Messages. 

Next, add a routing query. In this example, the messages that have an application property called `level` with a value equal to `critical` are routed to the storage account.

![Screenshot showing saving a new routing rule](./media/iot-hub-create-through-portal/iot-hub-add-route.png)

Click **Save** to save the routing rule. You return to the Message Routing pane, and your new routing rule is displayed.

### Custom endpoints

Click the **Custom endpoints** tab. You see any custom endpoints already created. From here, you can add new endpoints or delete existing endpoints. 

> [!NOTE]
> If you delete a route, it does not delete the endpoints assigned to that route. To delete an endpoint, click the Custom endpoints tab, select the endpoint you want to delete, and click Delete.
>

You can read more about custom endpoints in [Reference - IoT hub endpoints](iot-hub-devguide-endpoints.md).

You can define up to 10 custom endpoints for an IoT hub. 

To see a full example of how to use custom endpoints with routing, see [Message routing with IoT Hub](tutorial-routing.md).

## Find a specific IoT hub

Here are two ways to find a specific IoT hub in your subscription:

1. If you know the resource group to which the IoT hub belongs, click **Resource groups**, then select the resource group from the list. The resource group screen shows all of the resources in that group, including the IoT hubs. Click on the hub for which you're looking.

2. Click **All resources**. On the **All resources** pane, there is a dropdown list that defaults to `All types`. Click on the dropdown list, uncheck `Select all`. Find `IoT Hub` and check it. Click on the dropdown list box to close it, and the entries will be filtered, showing only your IoT hubs.

## Delete the IoT hub

To delete an Iot hub, find the IoT hub you want to delete, then click the **Delete** button below the IoT hub name.

## Next steps

Follow these links to learn more about managing Azure IoT Hub:

* [Message routing with IoT Hub](tutorial-routing.md)
* [IoT Hub metrics](iot-hub-metrics.md)
* [Operations monitoring](iot-hub-operations-monitoring.md)