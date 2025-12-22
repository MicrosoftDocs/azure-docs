---
title: How to use the connector for HTTP/REST
description: Use the operations experience web UI or the Azure CLI to configure assets and devices for connections to HTTP endpoints.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 12/10/2025

#CustomerIntent: As an industrial edge IT or operations user, I want configure my Azure IoT Operations environment so that I can access data from HTTP/REST endpoints.
---

# Configure the connector for HTTP/REST

In Azure IoT Operations, the connector for HTTP/REST enables access to data from REST endpoints exposed by HTTP services.

[!INCLUDE [iot-operations-asset-definition](../includes/iot-operations-asset-definition.md)]

[!INCLUDE [iot-operations-device-definition](../includes/iot-operations-device-definition.md)]

The connector for HTTP/REST supports the following features:

- Automatic retries when sampling failures occur. Reports a failed status for errors that can't be retried.
- Integration with OpenTelemetry.
- Use of _device endpoints_ and _assets_.
- Optionally transform incoming data using WASM modules.
- Device endpoint and asset definition validation for REST compatibility.
- Multiple authentication methods:
  - Username/password basic HTTP authentication
  - x509 client certificates
  - Anonymous access for testing purposes
- To establish a TLS connection to the HTTP endpoint, you can configure a certificate trust list for the connector.

For each configured dataset, the connector for HTTP/REST:

- Performs a GET request to the address specified in the device endpoint and appends the dataset's data source from the asset.
- Generates a message schema for each dataset based on the data it receives, and registers it with Schema Registry and Azure Device Registry.
- Forwards the data to the specified destination.

This article explains how to use the connector for HTTP/REST to perform tasks such as:

- Define the devices that connect HTTP sources to your Azure IoT Operations instance.
- Add assets, and define the data points to enable the data flow from the HTTP source to the MQTT broker or [broker state store](../develop-edge-apps/overview-state-store.md).

## Prerequisites

To configure devices and assets, you need a running instance of Azure IoT Operations.

[!INCLUDE [iot-operations-entra-id-setup](../includes/iot-operations-entra-id-setup.md)]

Your IT administrator must configure the connector for HTTP/REST template for your Azure IoT Operations instance in the Azure portal.

You need any credentials required to access the HTTP source. If the HTTP source requires authentication, you need to create a Kubernetes secret that contains the username and password for the HTTP source.

## Deploy the connector for HTTP/REST

[!INCLUDE [deploy-connectors-simple](../includes/deploy-connectors-simple.md)]

## Create a device

To configure the connector for HTTP/REST, first create a device that defines the connection to the HTTP source. The device includes the URL of the HTTP source and any credentials you need to access the HTTP source:

# [Operations experience](#tab/portal)

1. In the operations experience web UI, select **Devices** in the left navigation pane. Then select **Create new**.

1. Enter a name for your device, such as `http-connector`. To add the endpoint for the connector for HTTP/REST, select **New** on the **Microsoft.Http** tile.

1. Add the details of the endpoint for the connector for HTTP/REST including any authentication credentials:

    :::image type="content" source="media/howto-use-http-connector/add-http-connector-endpoint.png" alt-text="Screenshot that shows how to add a connector for HTTP/REST endpoint." lightbox="media/howto-use-http-connector/add-http-connector-endpoint.png":::

    Select **Apply** to save the endpoint.

1. On the **Device details** page, select **Next** to continue.

1. On the **Add custom property** page, add any other properties you want to associate with the device. For example, you might add a property to indicate the manufacturer of the camera. Then select **Next** to continue.

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

# [Bicep](#tab/bicep)

Deploy the following Bicep template to create a device with an inbound endpoint for the HTTP/REST connector. Replace the placeholders `<AIO_NAMESPACE_NAME>` and `<CUSTOM_LOCATION_NAME>` with your Azure IoT Operations namespace name and custom location name respectively:

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
  name: 'http-connector'
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
        'http-connector-0': {
          endpointType: 'Microsoft.Http'
          address: 'https://rest-http-connector-0'
        }
      }
    }
  }
}
```

This configuration deploys a new `device` resource called `http-connector` to the cluster with an inbound endpoint called `http-connector-0`.

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

To manage the trusted certificates list for the connector for HTTP/REST, see [Manage certificates for external communications](../secure-iot-ops/howto-manage-certificates.md#manage-certificates-for-external-communications).

## Create an asset

To define an asset that publishes data points from the HTTP endpoint, follow these steps:

# [Operations experience](#tab/portal)

1. In the operations experience web UI, select **Assets** in the left navigation pane. Then select **Create asset**.

1. Select the inbound endpoint for the connector for HTTP/REST that you created in the previous section.

1. Enter a name for your asset, such as `my-http-source`.

1. Add any custom properties you want to associate with the asset. For example, you might add a property to indicate the manufacturer of the camera. Select **Next** to continue.

A dataset defines where the connector sends the data it collects from a collection of data points. An HTTP/REST asset can have multiple datasets. To create a dataset:

1. Select **Create dataset**.

1. Enter the details for the dataset such as its name, data source, sampling interval, and destination. For HTTP/REST assets, the data source is the path on the REST endpoint. For HTTP/REST assets, the destination is either an MQTT topic or a [broker state store](../develop-edge-apps/overview-state-store.md) key. For example:

    :::image type="content" source="media/howto-use-http-connector/create-dataset.png" alt-text="Screenshot that shows how to create a dataset in the operations experience." lightbox="media/howto-use-http-connector/create-dataset.png":::

    To transform the incoming data, add the URL of a WebAssembly (WASM) module in the **Transform** field. To learn more, see [Transform incoming data](#transform-incoming-data).

1. Select **Create and next** to create the dataset.

    > [!TIP]
    > Use the **Manage default settings** option to configure default dataset settings such as the sampling interval.

1. On the **Review** page, review the details of the asset and select **Create** to create the asset. After a few minutes, the asset is listed on the **Assets** page:

    :::image type="content" source="media/howto-use-http-connector/http-asset-created.png" alt-text="Screenshot that shows the list of assets." lightbox="media/howto-use-http-connector/http-asset-created.png":::

# [Azure CLI](#tab/cli)

Run the following commands:

```azurecli
az iot ops ns asset rest create --name myrestasset --instance {your instance name} -g {your resource group name} --device rest-http-connector-cli --endpoint rest-http-connector-0

az iot ops ns asset rest dataset add --asset myrestasset --instance {your instance name} -g {your resource group name} --name weatherdata --data-source "/api/weather" --dest topic="azure-iot-operations/data/erp" retain=Never qos=Qos1 ttl=3600 --sampling-int 30000
```

For more information, see [az iot ops ns asset rest](/cli/azure/iot/ops/ns/asset/rest).

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
  name: 'myrestasset'
  parent: namespace
  location: resourceGroup().location
  extendedLocation: {
    type: 'CustomLocation'
    name: customLocation.id
  }
  properties: {
    displayName: 'myrestasset'
    description: 'An example HTTP asset'
    enabled: true

    deviceRef: {
      deviceName: 'http-connector'
      endpointName: 'http-connector-0'
    }

    defaultDatasetsConfiguration: '{}'
    defaultEventsConfiguration: '{}'

    datasets: [
      {
        name: 'weatherdata'
        dataSource: '/api/weather'
        datasetConfiguration: '{"samplingIntervalInMilliseconds":20000}'
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

## Transform incoming data

To transform the incoming data by using a WASM module, complete the following steps:

1. Develop a WASM module to perform the custom transformation. For more information, see [Develop WebAssembly (WASM) modules and graph definitions](../develop-edge-apps/howto-develop-wasm-modules.md).

1. Configure your transformation graph. For more information, see [Configure WebAssembly (WASM) graph definitions](../connect-to-cloud/howto-configure-wasm-graph-definitions.md).

1. Deploy both the module and graph. For more information, see [Use WebAssembly (WASM)](../connect-to-cloud/howto-dataflow-graph-wasm.md).

    > [!NOTE]
    > You need to deploy at least one data flow graph to enable WASM graph processing, but this feature doesn't otherwise use the graph.

1. Configure your dataset with the URL of the deployed WASM graph in the **Transform** field:

    :::image type="content" source="media/howto-use-http-connector/configure-transform.png" alt-text="Screenshot that shows how to add a WASM transform to a dataset." lightbox="media/howto-use-http-connector/configure-transform.png":::

A data transformation in the HTTP/REST connector only requires a [single map operator](../develop-edge-apps/howto-develop-wasm-modules.md#create-a-simple-module), but WASM graphs are fully supported with the following restrictions:

- The graph must have a single `source` node and a single `sink` node.
- The graph must consume and emit the `DataModel::Message` datatype.
- The graph must be stateless. Currently, this restriction means that accumulate operators aren't supported.
