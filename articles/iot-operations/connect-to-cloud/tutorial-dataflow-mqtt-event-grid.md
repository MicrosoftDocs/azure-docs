---
title: Tutorial - Create a bi-directional MQTT bridge to Azure Event Grid
description: Tutorial on how to set up a bi-directional MQTT bridge between an MQTT broker and Azure Event Grid.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-mqtt-broker
ms.topic: tutorial
ms.date: 07/23/2024

#CustomerIntent: As an operator, I want to understand how to I can use Dataflows to .
---




# Create bi-directional MQTT bridge to Azure Event Grid using dataflows

In this tutorial, you will set up a bi-directional MQTT bridge between an MQTT broker and Azure Event Grid using dataflows. To expedite the process, you will use the default settings for the MQTT broker and Azure Event Grid endpoints, and no transformation will be applied.

1. Create an MQTT broker endpoint.

   ```yaml
   apiVersion: connectivity.iotoperations.azure.com/v1beta1
   kind: DataflowEndpoint
   metadata:
     name: mq
   spec:
     endpointType: mqtt
     mqttSettings: {}
   ```

1. Create an Azure Event Grid endpoint.

   ```yaml
   apiVersion: connectivity.iotoperations.azure.com/v1beta1
   kind: DataflowEndpoint
   metadata:
     name: eventgrid
   spec:
     endpointType: mqtt
     authentication:
       method: systemAssignedManagedIdentity
       systemAssignedManagedIdentitySettings: {}
     mqttSettings:
       host: example.westeurope-1.ts.eventgrid.azure.net:8883
       tls:
         mode: enabled
   ```

1. Give AIO permission to send messages to the Azure Event Grid endpoint.

   ```bash
   az role assignment create --role "EventGrid TopicSpaces Publisher" --assignee <AIO identity> --scope <Azure Event Grid endpoint resource ID>
   ```

   ```bash
   az role assignment create --role "EventGrid TopicSpaces Subscriber" --assignee <AIO identity> --scope <Azure Event Grid endpoint resource ID>
   ```

   You can find the AIO managed identity in the Azure IoT Operations portal or use `az k8s-extension show` , under `identity` .

1. Create two dataflows with the MQTT broker endpoint as the source and the Azure Event Grid endpoint as the destination, and vice versa. No need to configure transformation.

   ```yaml
   apiVersion: connectivity.iotoperations.azure.com/v1beta1
   kind: Dataflow
   metadata:
     name: my-dataflow
   spec:
     operations:
     - operationType: source
       name: source1
       sourceSettings:
         endpointRef: mq
         dataSources:
           - thermostats/+/telemetry/temperature/#
     - operationType: destination 
        name: destination1
       destinationSettings:
         endpointRef: eventgrid
         dataDestination: factory/$topic.2
   ---
    apiVersion: connectivity.iotoperations.azure.com/v1beta1
    kind: Dataflow
    metadata:
      name: my-dataflow-reverse
    spec:
      operations:
      - operationType: source
        name: source1
        sourceSettings:
          endpointRef: eventgrid
          dataSources:
            - commands/+/#
      - operationType: destination
        name: destination1
        destinationSettings:
          endpointRef: mq
          dataDestination: factory/$topic
   ```

1. Send test data to the dataflow.
1. View messages in Azure Event Grid.
1. Send test data to Azure Event Grid.
1. View messages in MQTT broker.

