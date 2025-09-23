---
title: How to use the connector for HTTP/REST (preview)
description: Use the operations experience web UI or the Azure CLI to configure assets and devices for connections to HTTP endpoints.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 07/23/2025

#CustomerIntent: As an industrial edge IT or operations user, I want configure my Azure IoT Operations environment so that I can access data from HTTP/REST endpoints.
---

# Configure the connector for HTTP/REST (preview)

In Azure IoT Operations, the connector for HTTP/REST (preview) enables access to data from REST endpoints exposed by HTTP services.

[!INCLUDE [iot-operations-asset-definition](../includes/iot-operations-asset-definition.md)]

[!INCLUDE [iot-operations-device-definition](../includes/iot-operations-device-definition.md)]

The connector for HTTP/REST supports the following features:

- Automatic retries when sampling failures occur. Reports a failed status for errors that can't be retried.
- Integration with OpenTelemetry.
- Use of _device endpoints_ and _namespace assets_.
- Device endpoint and asset definition validation for REST compatibility.
- Multiple authentication methods:
  - Username/password basic HTTP authentication
  - x509 client certificates
  - Anonymous access for testing purposes
  - Certificate trust bundle to specify additional certificate authorities

For each configured dataset, the connector for HTTP/REST:

- Performs a GET request to the address specified in the device endpoint and appends the dataset's data source from the namespace asset.
- Generates a message schema for each dataset based on the data it receives, and registers it with Schema Registry and Azure Device Registry.
- Forwards the data to the specified destination.

This article explains how to use the connector for HTTP/REST to perform tasks such as:

- Define the devices that connect HTTP sources to your Azure IoT Operations instance.
- Add assets, and define the data points to enable the data flow from the HTTP source to the MQTT broker or [broker state store](../develop-edge-apps/overview-state-store.md).

## Prerequisites

To configure devices and assets, you need a running preview instance of Azure IoT Operations.

[!INCLUDE [iot-operations-entra-id-setup](../includes/iot-operations-entra-id-setup.md)]

Your IT administrator must have configured the connector for HTTP/REST template for your Azure IoT Operations instance in the Azure portal.

You need any credentials required to access the HTTP source. If the HTTP source requires authentication, you need to create a Kubernetes secret that contains the username and password for the HTTP source.

## Deploy the connector for HTTP/REST

[!INCLUDE [deploy-preview-media-connectors-simple](../includes/deploy-preview-media-connectors-simple.md)]

## Create a device

To configure the connector for HTTP/REST, first create a device that defines the connection to the HTTP source. The device includes the URL of the HTTP source and any credentials you need to access the HTTP source:

# [Operations experience](#tab/portal)

1. In the operations experience web UI, select **Devices** in the left navigation pane. Then select **Create new**.

1. Enter a name for your device, such as `http-connector`. To add the endpoint for the connector for HTTP/REST, select **New** on the **Microsoft.Http** tile.

1. Add the details of the endpoint for the connector for HTTP/REST including any authentication credentials:

    :::image type="content" source="media/howto-use-http-connector/add-http-connector-endpoint.png" alt-text="Screenshot that shows how to add a connector for HTTP/REST endpoint." lightbox="media/howto-use-http-connector/add-http-connector-endpoint.png":::

    Select **Apply** to save the endpoint.

1. On the **Device details** page, select **Next** to continue.

1. On the **Add custom property** page, you can add any other properties you want to associate with the device. For example, you might add a property to indicate the manufacturer of the camera. Then select **Next** to continue

1. On the **Summary** page, review the details of the device and select **Create** to create the asset.

1. After the device is created, you can view it in the **Devices** list:

    :::image type="content" source="media/howto-use-http-connector/http-connector-device-created.png" alt-text="Screenshot that shows the list of devices." lightbox="media/howto-use-http-connector/http-connector-device-created.png":::

# [Azure CLI](#tab/cli)

Run the following commands:

```azurecli
az iot ops ns device create -n rest-http-connector-cli -g {your resource group name} --instance {your instance name} 

az iot ops ns device endpoint inbound add rest --device rest-http-connector-cli -g {your resource group name} -i {your instance name}  --name rest-http-connector-0 --endpoint-address "https://rest-http-connector-0"
```

To learn more, see [az iot ops ns device](/cli/azure/iot/ops/ns/device).

---

## Create a namespace asset

To define a namespace asset that publishes data points from the HTTP endpoint, follow these steps:

# [Operations experience](#tab/portal)

1. In the operations experience web UI, select **Assets** in the left navigation pane. Then select **Create namespace asset**.

1. Select the inbound endpoint for the connector for HTTP/REST that you created in the previous section.

1. Enter a name for your asset, such as `my-http-source`.

1. Add any custom properties you want to associate with the asset. For example, you might add a property to indicate the manufacturer of the camera. Select **Next** to continue.

1. On the **Data points** page, select **Add data point** to add a data point for the asset. For example:

    :::image type="content" source="media/howto-use-http-connector/add-data-point.png" alt-text="Screenshot that shows how to add a data point for HTTP source." lightbox="media/howto-use-http-connector/add-data-point.png":::

    Add details for each data point to publish to the MQTT broker.

1. To configure the destination for the data, select **Manage default dataset**. Choose either **MQTT broker** or **Broker state store** as the destination. If you choose **MQTT broker**, you can enter the name of the topic to publish to. If you choose **Broker state store**, you can enter the key of the entry in the state store to use.

    :::image type="content" source="media/howto-use-http-connector/configure-dataset.png" alt-text="Screenshot that shows how to configure the dataset for HTTP source." lightbox="media/howto-use-http-connector/configure-dataset.png":::

    Select **Next** to continue.

1. On the **Review** page, review the details of the asset and select **Create** to create the asset. After a few minutes, the asset is listed on the **Assets** page:

    :::image type="content" source="media/howto-use-http-connector/http-asset-created.png" alt-text="Screenshot that shows the list of assets." lightbox="media/howto-use-http-connector/http-asset-created.png":::

# [Azure CLI](#tab/cli)

Run the following command:

```azurecli
az iot ops ns asset rest create --name myrestasset --instance {your instance name} -g {your resource group name} --device rest-http-connector-cli --endpoint rest-http-connector-0 --dataset-dest topic="azure-iot-operations/data/erp" retain=Never qos=Qos1 ttl=3600
```

To learn more, see [az iot ops ns asset rest](/cli/azure/iot/ops/ns/asset/rest).

---
