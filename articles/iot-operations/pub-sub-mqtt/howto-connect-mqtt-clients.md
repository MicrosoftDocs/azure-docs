---
title: Connect standard MQTT clients to Azure IoT MQ
# titleSuffix: Azure IoT MQ
description: Configure standard MQTT clients to connect to Azure IoT MQ to demonstrate how to publish and subscribe to topics.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.date: 10/24/2023

#CustomerIntent: As an architect, I want to understand how to connect standard MQTT clients to Azure IoT MQ.
---

# Connect standard MQTT clients to Azure IoT MQ

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

You can connect standard MQTT clients to Azure IoT MQ distributed MQTT Broker demonstrate how to publish and subscribe to topics.

## Prerequisites

* An Azure IoT Operations instance with the Azure IoT MQ component

## Publish

Azure IoT MQ's distributed MQTT broker is targeted to be MQTT v3.1.1 and v5 standards-compliant. You can test connecting to the MQTT broker using standards-based MQTT tools.

For example, you can use the popular `mosquitto_pub` client to connect to the MQTT broker and publish a series of test messages from a file to a topic named `orders`:

```bash
while read -r line; do echo "$line"; sleep 2; done < quickstart/test_msgs \
| mosquitto_pub -h localhost -t "orders" -l -d -q 1 -i "publisher1" 
```

You should see terminal messages indicating successful publishes every two seconds. In total, 1,000 JSON test messages are published before the command exits. You can use Ctrl+C in the terminal to stop the command at any time, but let it continue publishing test messages for now.

## Subscribe

Subscribe to the `orders` topic from another MQTT client. Create a new terminal while ensuring the current terminal window is continuing to publish test messages.

<!-- ![](new-terminal.png) -->

Monitor the messages received by the subscriber in real-time using a terminal UI tool called [mqttui](https://github.com/EdJoPaTo/mqttui). Use the command below to subscribe to all topics and see messages arriving on the `orders` topic in real-time:

```bash
mqttui -b mqtt://localhost:1883
```

Use down arrow key or *j* key to select the `orders` topic; you can click in the UI to select as well. *q* key quits the UI.

<!-- ![](sub.png) -->

Azure IoT MQ's MQTT Broker is compliant with both MQTT v5 and v3.1.1 standards. This means you can use standard, off-the-shelf, client libraries and tools to interact with Azure IoT MQ's MQTT Broker.

## Related content

- [Publish and subscribe MQTT messages using Azure IoT MQ](overview-iot-mq.md)