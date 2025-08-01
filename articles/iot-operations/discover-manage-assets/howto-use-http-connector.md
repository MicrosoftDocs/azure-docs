---
title: How to use the connector for REST/HTTP (preview)
description: Use the operations experience web UI or the Azure CLI to configure assets and devices for connections to HTTP endpoints.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 07/23/2025

#CustomerIntent: As an industrial edge IT or operations user, I want configure my Azure IoT Operations environment so that I can access data from HTTP/REST endpoints.
---

# Configure the connector for REST/HTTP (preview)

In Azure IoT Operations, the connector for REST/HTTP (preview) enables access to data from REST endpoints exposed by HTTP services.

[!INCLUDE [iot-operations-asset-definition](../includes/iot-operations-asset-definition.md)]

[!INCLUDE [iot-operations-device-definition](../includes/iot-operations-device-definition.md)]

This article explains how to use the connector for REST/HTTP to perform tasks such as:

- Define the devices that connect HTTP sources to your Azure IoT Operations instance.
- Add assets, and define the data points to enable the data flow from the HTTP source to the MQTT broker.

## Prerequisites

To configure devices and assets, you need a running preview instance of Azure IoT Operations.

[!INCLUDE [iot-operations-entra-id-setup](../includes/iot-operations-entra-id-setup.md)]

Your IT administrator must have configured the connector for REST/HTTP template for your Azure IoT Operations instance in the Azure portal.

You need any credentials required to access the HTTP source. If the HTTP source requires authentication, you need to create a Kubernetes secret that contains the username and password for the HTTP source.

## Deploy the connector for REST/HTTP

[!INCLUDE [deploy-preview-http-connectors](../includes/deploy-preview-media-connectors.md)]

> [!IMPORTANT]
> If you don't enable preview features, you see the following error message in the `aio-supervisor-...` pod logs when you try to use the HTTP, media, or ONVIF connectors: `No connector configuration present for AssetEndpointProfile: <AssetEndpointProfileName>`.

## Create a device

To configure the connector for REST/HTTP, first create a device that defines the connection to the HTTP source. The device includes the URL of the HTTP source and any credentials you need to access the HTTP source.

1. In the operations experience web UI, select **Devices** in the left navigation pane. Then select **Create new**.

1. Enter a name for your device, such as `http-connector`. To add the endpoint for the connector for REST/HTTP, select **New** on the **Microsoft.Http** tile.

1. Add the details of the endpoint for the connector for REST/HTTP including any authentication credentials:

    :::image type="content" source="media/howto-use-http-connector/add-http-connector-endpoint.png" alt-text="Screenshot that shows how to add a connector for REST/HTTP endpoint." lightbox="media/howto-use-http-connector/add-http-connector-endpoint.png":::

    Select **Apply** to save the endpoint.

1. On the **Device details** page, select **Next** to continue.

1. On the **Add custom property** page, you can add any other properties you want to associate with the device. For example, you might add a property to indicate the manufacturer of the camera. Then select **Next** to continue

1. On the **Summary** page, review the details of the device and select **Create** to create the asset.

1. After the device is created, you can view it in the **Devices** list:

    :::image type="content" source="media/howto-use-http-connector/http-connector-device-created.png" alt-text="Screenshot that shows the list of devices." lightbox="media/howto-use-http-connector/http-connector-device-created.png":::

## Create a namespace asset

To define a namespace asset that publishes data points from the HTTP endpoint, follow these steps:

1. In the operations experience web UI, select **Assets** in the left navigation pane. Then select **Create namespace asset**.

1. Select the inbound endpoint for the connector for REST/HTTP that you created in the previous section.

1. Enter a name for your asset, such as `my-http-source`.

1. Add any custom properties you want to associate with the asset. For example, you might add a property to indicate the manufacturer of the camera. Select **Next** to continue.

1. On the **Data points** page, select **Add data point** to add a data point for the asset. For example:

    :::image type="content" source="media/howto-use-http-connector/add-data-point.png" alt-text="Screenshot that shows how to add a data point for HTTP source." lightbox="media/howto-use-http-connector/add-data-point.png":::

    Add details for each data point to publish to the MQTT broker. Then select **Next** to continue.

1. On the **Review** page, review the details of the asset and select **Create** to create the asset. After a few minutes, the asset is listed on the **Assets** page:

    :::image type="content" source="media/howto-use-http-connector/http-asset-created.png" alt-text="Screenshot that shows the list of assets." lightbox="media/howto-use-http-connector/http-asset-created.png":::
