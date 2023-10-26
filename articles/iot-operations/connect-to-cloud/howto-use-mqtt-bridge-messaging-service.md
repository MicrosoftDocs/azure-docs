---
title: Use MQTT bridge to connect to Azure Messaging Services
# titleSuffix: Azure IoT MQ
description: Configure Azure IoT MQ for bi-directional communication with Azure Messaging Services.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.date: 10/18/2023

#CustomerIntent: As an operator, I want to understand how to configure Azure IoT MQ so that I can have bi-directional communication between clients and Azure Messaging Services.
---


# Use MQTT bridge to connect to Azure Messaging Services

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

## Prerequisites

- This exercise assumes you've completed the steps from *deploy workloads*.
- You'll also need an Azure subscription to deploy cloud resources for testing.

## Deploy cloud resources

After ensuring the environment variables in the previous exercise are set in your terminal instance, deploy cloud resources to create a bi-directional cloud/edge messaging pipeline by executing the following command:


```bash
/workspaces/e4k-playground/quickstart/createCloudResAndAssignRoles.sh
```

This script deploys the following resources to your Azure subscription:

- Two Event Hubs - one for device-to-cloud (D2C) messages and another for cloud-to-device (C2D) messages.
- One Azure Container App that processes incoming messages on the D2C Event Hubs, unpacks each message, stamps as processed, and sends it to the C2D Event Hubs.
- Supporting Event Hubs Consumer Group and Storage resources

Code in the Container App is triggered on incoming device-to-cloud messages and results in generation of cloud-to-device messages.

Review the Bicep file for details:
[Review resource deployment Bicep template](https://github.com/microsoft/e4k-playground/blob/main/quickstart/createCloudResources.bicep)


## Azure RBAC roles for the Arc extension

A key benefit of Azure Arc integration is that Azure IoT MQ's Kakfa connector can use a **system-assigned managed identity** to connect to the Azure Event Hubs Namespace resources. No keys or manual credential management is necessary.

The helper script assigns the required RBAC roles to the Azure IoT MQ extension. Review the Bicep file for details:


[Review role assignment Bicep template](https://github.com/microsoft/e4k-playground/blob/bicep/quickstart/assignRolesWithAzureRBAC.bicep)

After successfully running the script, copy the command to manually set the Event Hubs name environment variable. Run the command in the terminal window.

## Deploy the Kafka connector and observe data flow

The following custom resources configure the Kafka connector to connect to the Event Hubs that were previously created and define the mapping between MQTT and Kafka topics.

```yaml
apiVersion: az-edge.com/v1alpha4
kind: KafkaConnector
metadata:
  name: my-eh-connector
  namespace: alice-springs
spec:
  image:
    pullPolicy: IfNotPresent
    repository: alicesprings.azurecr.io/kafka-2
    tag: 0.6.0
  instances: 2
  clientIdPrefix: my-prefix
  kafkaConnection:
    # Port 9093 is Event Hub's Kakfa endpoint
    # Supports bootstrap server syntax
    endpoint: ${EVENTHUB_NAMESPACE_NAME}.servicebus.windows.net:9093
    tls:
      tlsEnabled: true
    authentication:
      enabled: true
      authType:
        systemAssignedManagedIdentity:
          audience: https://${EVENTHUB_NAMESPACE_NAME}.servicebus.windows.net
---
apiVersion: az-edge.com/v1alpha4
kind: KafkaConnectorTopicMap
metadata:
  name: my-eh-topic-map
  namespace: alice-springs
spec:
  kafkaConnectorRef: my-eh-connector
  batching:
    enabled: false
  compression: none
  partitionStrategy: default
  routes:
    - mqttToKafka:
        name: "toCloud"
        mqttTopic: odd-numbered-orders
        kafkaTopic: e4k-d2c
        kafkaAcks: one
        qos: 1
        sharedSubscription:
          groupName: group1
          groupMinimumShareNumber: 3
    - kafkaToMqtt:
        name: "fromCloud"
        consumerGroupId: e4kconnector
        kafkaTopic: e4k-c2d
        mqttTopic: cloud-updates
        qos: 0
```

Create the custom resources with the following command, ensuring the environment variable used in the following command is set correctly:

```bash
[[ -n "$EVENTHUB_NAMESPACE_NAME" ]] && \
envsubst < /workspaces/e4k-playground/quickstart/kafka-connector-template.yaml | \
kubectl apply -f - || \
echo "Error: EVENTHUB_NAMESPACE_NAME is not defined"
```

Switch to the terminal that was publishing test messages from the earlier step and use Ctrl+C to stop it. Restart the test message generation on the `orders` topic using the same command you previously used:

```bash
while read -r line; do echo "$line"; sleep 2; done < quickstart/test_msgs \
| mosquitto_pub -h localhost -t "orders" -l -d -q 1 -i "publisher1" -u client1 -P password
```

`mqttui` is subscribed to all topics
Switch to the terminal running the `mqttui` tool that was subscribed to all topics. If that window isn't available, restart it using the following command in a new terminal:

```bash
mqttui -b mqtt://localhost:1883
```

```console
$ kubectl rollout status deployment/dapr-workload -w
deployment "dapr-workload" successfully rolled out  
```

After the Connector is successfully deployed, observe messages from a new topic called `cloud-updates` being received in terminal running `mqttui`

The messages being received on the `cloud-updates` topic are cloud-to-device messages. They're created in the cloud by the Container App (noted in the `processed-by` field) in response to incoming messages from the edge (on the `odd-numbered-orders` topic).

## Related content

- [Publish and subscribe MQTT messages using Azure IoT MQ](../manage-mqtt-connectivity/overview-iot-mq.md)