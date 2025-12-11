---
title: How to use the connector for SSE
description: Use the operations experience web UI or the Azure CLI to configure assets and devices for connections to server-sent event (SSE) endpoints.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 09/23/2025

#CustomerIntent: As an industrial edge IT or operations user, I want configure my Azure IoT Operations environment so that I can access data from SSE endpoints.
---

# Configure the connector for SSE

In Azure IoT Operations, the connector for server-sent events (SSE) enables access to data from SSE endpoints exposed by HTTP services.

[!INCLUDE [iot-operations-asset-definition](../includes/iot-operations-asset-definition.md)]

[!INCLUDE [iot-operations-device-definition](../includes/iot-operations-device-definition.md)]

The connector for SSE supports the following features:

- Automatic retries when sampling failures occur. Reports a failed status for errors that can't be retried.
- Integration with OpenTelemetry.
- Use of _device endpoints_ and _assets_.
- Inferring a schema from the JSON payload.
- Multiple authentication methods:
  - Username/password basic HTTP authentication
  - x509 client certificates
  - Certificate trust list
  - Anonymous access for testing purposes

For each configured dataset, the connector for SSE:

- Samples SSE events from the specified SSE endpoint.
- Generates a message schema for each dataset based on the data it receives, and registers it with Schema Registry and Azure Device Registry.
- Forwards the event data to the specified destination.

This article explains how to use the connector for SSE to perform tasks such as:

- Define the devices that connect SSE sources to your Azure IoT Operations instance.
- Add assets, and define the events to enable the data flow from the SSE source to the MQTT broker or [broker state store](../develop-edge-apps/overview-state-store.md).

## Prerequisites

To configure devices and assets, you need a running instance of Azure IoT Operations.

[!INCLUDE [iot-operations-entra-id-setup](../includes/iot-operations-entra-id-setup.md)]

Your IT administrator must configure the connector for SSE template for your Azure IoT Operations instance in the Azure portal.

You need any credentials required to access the SSE source. If the SSE source requires authentication, you need to create a Kubernetes secret that contains the username and password for the SSE source.

## Deploy the connector for SSE

[!INCLUDE [deploy-connectors-simple](../includes/deploy-connectors-simple.md)]

## Create a device

To configure the connector for SSE, first create a device that defines the connection to the SSE source. The device includes the URL of the SSE source and any credentials you need to access the SSE source:

# [Operations experience](#tab/portal)

1. In the operations experience web UI, select **Devices** in the left navigation pane. Then select **Create new**.

1. Enter a name for your device, such as `sse-connector`. To add the endpoint for the connector for SSE, select **New** on the **Microsoft.SSEHttp** tile.

1. Add the details of the endpoint for the connector for SSE including any authentication credentials:

    :::image type="content" source="media/howto-use-sse-connector/add-sse-connector-endpoint.png" alt-text="Screenshot that shows how to add a connector for SSE endpoint." lightbox="media/howto-use-sse-connector/add-sse-connector-endpoint.png":::

    Select **Apply** to save the endpoint.

1. On the **Device details** page, select **Next** to continue.

1. On the **Add custom property** page, add any other properties you want to associate with the device. For example, you might add a property to indicate the manufacturer of the camera. Then select **Next** to continue.

1. On the **Summary** page, review the details of the device and select **Create** to create the asset.

1. After the device is created, you can view it in the **Devices** list:

    :::image type="content" source="media/howto-use-sse-connector/sse-connector-device-created.png" alt-text="Screenshot that shows the list of devices." lightbox="media/howto-use-sse-connector/sse-connector-device-created.png":::

# [Azure CLI](#tab/cli)

Run the following commands:

```azurecli
az iot ops ns device create -n sse-connector-cli -g {your resource group name} --instance {your instance name} 

az iot ops ns device endpoint inbound add sse --device sse-connector-cli -g {your resource group name} -i {your instance name}  --name sse-connector-0 --endpoint-address "https://sse-connector-0:443/base-path"
```

To learn more, see [az iot ops ns device](/cli/azure/iot/ops/ns/device).

# [Bicep](#tab/bicep)

Deploy the following Bicep template to create a device with an inbound endpoint for the SSE connector. Replace the placeholders `<AIO_NAMESPACE_NAME>` and `<CUSTOM_LOCATION_NAME>` with your Azure IoT Operations namespace name and custom location name respectively:

```bicep
param aioNamespaceName string = '<AIO_NAMESPACE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'

resource namespace 'Microsoft.DeviceRegistry/namespaces@2025-10-01' existing = {
  name: aioNamespaceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource device 'Microsoft.DeviceRegistry/namespaces/devices@2025-10-01' = {
  name: 'sse-connector'
  parent: namespace
  location: resourceGroup().location
  extendedLocation: {
    type: 'CustomLocation'
    name: customLocation.id
  }
  properties: {
    endpoints: {
      outbound: {
        assigned: {}
      }
      inbound: {
        'sse-connector-0': {
          endpointType: 'Microsoft.SSEHttp'
          address: 'https://sse-connector-0:443/base-path'
        }
      }
    }
  }
}
```

---

### Configure a device to use a username and password

The previous example uses the `Anonymous` authentication mode. This mode doesn't require a username or password.

To use the `Username password` authentication mode, complete the following steps:

# [Operations experience](#tab/portal)

[!INCLUDE [connector-username-password-portal](../includes/connector-username-password-portal.md)]

# [Azure CLI](#tab/cli)

[!INCLUDE [connector-username-password-cli](../includes/connector-username-password-cli.md)]

# [Bicep](#tab/bicep)

[!INCLUDE [connector-username-password-bicep](../includes/connector-username-password-bicep.md)]

---

### Configure a device to use an X.509 certificate

[!INCLUDE [connector-certificate](../includes/connector-certificate.md)]

### Configure a certificate trust list for a device to use

To manage the trusted certificates list for the connector for SSE, see [Manage certificates for external communications](../secure-iot-ops/howto-manage-certificates.md#manage-certificates-for-external-communications).

## Create an asset

To define an asset that publishes events from the SSE endpoint, follow these steps:

# [Operations experience](#tab/portal)

1. In the operations experience web UI, select **Assets** in the left navigation pane. Then select **Create asset**.

1. Select the inbound endpoint for the connector for SSE that you created in the previous section.

1. Enter a name for your asset, such as `my-sse-source`.

1. Add any custom properties you want to associate with the asset. For example, you might add a property to indicate the manufacturer of the camera. Select **Next** to continue.

1. On the **Datasets** page, create any datasets required and define the data points.

1. On the **Event groups** page, create an event group to define the events to publish to the MQTT broker.

1. In the event group, select **Add event** to add an event for the asset. For example:

    :::image type="content" source="media/howto-use-sse-connector/add-event.png" alt-text="Screenshot that shows how to add an event for SSE source." lightbox="media/howto-use-sse-connector/add-event.png":::

    Add details for each event to publish to the MQTT broker.

    Select **Next** to continue.

1. On the **Review** page, review the details of the asset and select **Create** to create the asset. After a few minutes, the asset is listed on the **Assets** page:

    :::image type="content" source="media/howto-use-sse-connector/sse-asset-created.png" alt-text="Screenshot that shows the list of assets." lightbox="media/howto-use-sse-connector/sse-asset-created.png":::

# [Azure CLI](#tab/cli)

Run the following command:

```azurecli
az iot ops ns asset sse create --name mysseasset --instance {your instance name} -g {your resource group name} --device sse-connector-cli --endpoint sse-connector-0

az iot ops ns asset sse dataset add --asset mysseasset --instance {your instance name} -g {your resource group name} --name weatherdata --data-source "/api/weather" --dest topic="azure-iot-operations/data/erp" retain=Never qos=Qos1 ttl=3600
```

To learn more, see [az iot ops ns asset sse](/cli/azure/iot/ops/ns/asset/sse).

# [Bicep](#tab/bicep)

Deploy the following Bicep template to create an asset that publishes messages from the device shown previously to an MQTT topic. The data source of the dataset defines the path on the REST endpoint to query. Replace the placeholders `<AIO_NAMESPACE_NAME>` and `<CUSTOM_LOCATION_NAME>` with your Azure IoT Operations namespace name and custom location name respectively:

```bicep
param aioNamespaceName string = '<AIO_NAMESPACE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'

resource namespace 'Microsoft.DeviceRegistry/namespaces@2025-10-01' existing = {
  name: aioNamespaceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource asset 'Microsoft.DeviceRegistry/namespaces/assets@2025-10-01' = {
  name: 'mysseasset'
  parent: namespace
  location: resourceGroup().location
  extendedLocation: {
    type: 'CustomLocation'
    name: customLocation.id
  }
  properties: {
    displayName: 'mysseasset'
    description: 'An example SSE asset'
    enabled: true

    deviceRef: {
      deviceName: 'sse-connector'
      endpointName: 'sse-connector-0'
    }

    defaultDatasetsConfiguration: '{}'
    defaultEventsConfiguration: '{}'

    datasets: [
      {
        name: 'weatherdata'
        dataSource: '/api/weather'
        destinations: [
          {
            target: 'Mqtt'
            configuration: {
              topic: 'azure-iot-operations/data/erp'
              qos: 'Qos1'
              retain: 'Never'
              ttl: 3600
            }
          }
        ]
      }
    ]
  }
}
```

---
