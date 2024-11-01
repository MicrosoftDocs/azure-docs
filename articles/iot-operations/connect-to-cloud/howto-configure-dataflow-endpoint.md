---
title: Configure dataflow endpoints in Azure IoT Operations
description: Configure dataflow endpoints to create connection points for data sources.
author: PatAltimore
ms.author: patricka
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 10/30/2024

#CustomerIntent: As an operator, I want to understand how to configure source and destination endpoints so that I can create a dataflow.
---

# Configure dataflow endpoints

To get started with dataflows, first create dataflow endpoints. A dataflow endpoint is the connection point for the dataflow. You can use an endpoint as a source or destination for the dataflow. Some endpoint types can be used as both sources and destinations, while others are for destinations only. A dataflow needs at least one source endpoint and one destination endpoint.

Use the following table to choose the endpoint type to configure:

| Endpoint type | Description | Can be used as a source | Can be used as a destination |
|---------------|-------------|-------------------------|------------------------------|
| [MQTT](howto-configure-mqtt-endpoint.md) | For bi-directional messaging with MQTT brokers, including the one built-in to Azure IoT Operations and Event Grid. | Yes | Yes |
| [Kafka](howto-configure-kafka-endpoint.md) | For bi-directional messaging with Kafka brokers, including Azure Event Hubs. | Yes | Yes |
| [Data Lake](howto-configure-adlsv2-endpoint.md) | For uploading data to Azure Data Lake Gen2 storage accounts. | No | Yes |
| [Microsoft Fabric OneLake](howto-configure-fabric-endpoint.md) | For uploading data to Microsoft Fabric OneLake lakehouses. | No | Yes |
| [Local storage](howto-configure-local-storage-endpoint.md) | For sending data to a locally available persistent volume, through which you can upload data via Azure Container Storage enabled by Azure Arc edge volumes. | No | Yes |

## Reuse endpoints

Think of each dataflow endpoint as a bundle of configuration settings that contains where the data should come from or go to (the `host` value), how to authenticate with the endpoint, and other settings like TLS configuration or batching preference. So you just need to create it once and then you can reuse it in multiple dataflows where these settings would be the same.

To make it easier to reuse endpoints, the MQTT or Kafka topic filter isn't part of the endpoint configuration. Instead, you specify the topic filter in the dataflow configuration. This means you can use the same endpoint for multiple dataflows that use different topic filters. 

For example, you can use the default MQTT broker dataflow endpoint. You can use it for both the source and destination with different topic filters:

# [Portal](#tab/portal)

:::image type="content" source="media/howto-configure-dataflow-endpoint/create-dataflow-mq-mq.png" alt-text="Screenshot using operations experience to create a dataflow from MQTT to MQTT.":::

# [Bicep](#tab/bicep)

```bicep
resource dataflow 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflows@2024-09-15-preview' = {
  parent: <DEFAULT_PROFILE_RESOURCE>
  name: 'broker-to-broker'
  extendedLocation: {
    name: <CUSTOM_LOCATION_RESOURCE>.id
    type: 'CustomLocation'
  }
  properties: {
    mode: 'Enabled'
    operations: [
      {
        operationType: 'Source'
        sourceSettings: {
          endpointRef: 'default'
          dataSources: [
            'example/topic/1'
          ]
        }
      }
      {
        operationType: 'Destination'
        destinationSettings: {
          endpointRef: 'default'
          dataDestination: 'example/topic/2'
        }
      }
    ]
  }
}
```

# [Kubernetes](#tab/kubernetes)

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: Dataflow
metadata:
  name: broker-to-broker
  namespace: azure-iot-operations
spec:
  profileRef: default
  operations:
    - operationType: Source
      sourceSettings:
        endpointRef: default
        dataSources:
        - example/topic/1
    - operationType: Destination
      destinationSettings:
        endpointRef: default
        dataDestination: example/topic/2
```

---

Similarly, you can create multiple dataflows that use the same MQTT endpoint for other endpoints and topics. For example, you can use the same MQTT endpoint for a dataflow that sends data to an Event Hub endpoint.

# [Portal](#tab/portal)

:::image type="content" source="media/howto-configure-dataflow-endpoint/create-dataflow-mq-kafka.png" alt-text="Screenshot using operations experience to create a dataflow from MQTT to Kafka.":::

# [Bicep](#tab/bicep)

```bicep
resource dataflow 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflows@2024-09-15-preview' = {
  parent: <DEFAULT_PROFILE_RESOURCE>
  name: 'broker-to-eh'
  extendedLocation: {
    name: <CUSTOM_LOCATION_RESOURCE>.id
    type: 'CustomLocation'
  }
  properties: {
    mode: 'Enabled'
    operations: [
      {
        operationType: 'Source'
        sourceSettings: {
          endpointRef: 'default'
          dataSources: [
            'example/topic/3'
          ]
        }
      }
      {
        operationType: 'Destination'
        destinationSettings: {
          // The endpoint needs to be created before you can reference it here
          endpointRef: 'example-event-hub-endpoint'
          dataDestination: 'example/topic/4'
        }
      }
    ]
  }
}
```

# [Kubernetes](#tab/kubernetes)

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: Dataflow
metadata:
  name: broker-to-eh
  namespace: azure-iot-operations
spec:
  profileRef: default
  operations:
    - operationType: Source
      sourceSettings:
        endpointRef: default
        dataSources:
        - example/topic/3
    - operationType: Destination
      destinationSettings:
        # The endpoint needs to be created before you can reference it here
        endpointRef: example-event-hub-endpoint
        dataDestination: example/topic/4
```

---

Similar to the MQTT example, you can create multiple dataflows that use the same Kafka endpoint for different topics, or the same Data Lake endpoint for different tables.

## Next steps

Create a dataflow endpoint: 

- [MQTT or Event Grid](howto-configure-mqtt-endpoint.md)
- [Kafka or Event Hubs](howto-configure-kafka-endpoint.md)
- [Data Lake](howto-configure-adlsv2-endpoint.md)
- [Microsoft Fabric OneLake](howto-configure-fabric-endpoint.md)
- [Local storage](howto-configure-local-storage-endpoint.md)