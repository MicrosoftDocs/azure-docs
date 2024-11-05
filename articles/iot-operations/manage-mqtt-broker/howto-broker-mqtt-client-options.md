---
title: Configure Azure IoT Operations MQTT client options
description: Learn how to configure advanced client options for the Azure IoT Operations MQTT broker, like session expiry, message expiry, receive maximum, and subscriber queue limit.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.subservice: azure-mqtt-broker
ms.custom:
  - ignite-2023
ms.date: 11/04/2024

#CustomerIntent: 
ms.service: azure-iot-operations
---

# Configure broker MQTT client options

> [!IMPORTANT]
> This setting requires modifying the Broker resource and can only be configured at initial deployment time using the Azure CLI or Azure Portal. A new deployment is required if Broker configuration changes are needed. To learn more, see [Customize default Broker](./overview-broker.md#customize-default-broker).

The broker advanced client options include settings that control the behavior of the broker when interacting with MQTT clients. Most are common MQTT protocol settings that are negotiated between the broker and the client during the connection process, like session expiry, message expiry, receive maximum, and keep alive seconds. The only setting specific to Azure IoT Operations is the [subscriber queue limit](#subscriber-queue-limit).

The complete list of of available settings is found at [ClientConfig](/rest/api/iotoperations/broker/create-or-update#clientconfig) API reference.

In many scenarios, the default client settings are sufficient. To override the default client settings for the broker, edit the `advanced.clients` section in the Broker resource. Currently, this is only supported using the `--broker-config-file` flag when you deploy the Azure IoT Operations using the `az iot ops create` command.

For example, to set the MQTT max session expiry seconds to 282277, max message expiry seconds to 1622, subscriber queue limit to 1000, max receive maximum to 15000, and max keep alive seconds to 300, prepare a Broker config file  in JSON format:


```json
{
  "advanced": {
    "clients": {
      "maxSessionExpirySeconds": 282277,
      "maxMessageExpirySeconds": 1622,
      "subscriberQueueLimit": {
        "length": 1000,
        "strategy": "DropOldest"
      },
      "maxReceiveMaximum": 15000,
      "maxKeepAliveSeconds": 300
    }
  },
  // And other settings like the memory profile, for example
  // "memoryProfile": "<MEMORY_PROFILE>"
}
```

Then, deploy Azure IoT Operations using the `az iot ops create` command with the `--broker-config-file` flag, like the following command (other parameters omitted for brevity):

```azurecli
az iot ops create ... --broker-config-file <FILE>.json
```

To learn more, see [Azure CLI support for advanced MQTT broker configuration](https://aka.ms/aziotops-broker-config) and [Broker examples](/rest/api/iotoperations/broker/create-or-update#examples).

## Subscriber queue limit

The MQTT broker maintains a queue for each subscriber that contains the QoS 1 messages to be delivered to that subscriber. messages are added to this queue when they're received from the publisher, and removed when they are delivered to the subscriber and the subscriber sends a `PUBACK`. If the messages come in faster than the subscriber acknowledges them, or if the subscriber has a persistent session and is currently offline, then it's possible for this queue to become large. The MQTT broker can [buffer these messages of overlong queues to disk to release most of the memory they require](./howto-disk-backed-message-buffer.md), but this is not sufficient by itself. The disk-backed message buffer might not be configured and, even if it's enabled, it's possible for it to be full due to other subscribers. Thus, the subscriber queue limit is a way to prevent the MQTT broker from using too much memory for a single subscriber.

The subscriber queue limit has two settings:

- **Length**: The maximum number of messages that can be queued for a single subscriber. If the queue is full and a new message arrives, the broker drops the message based on the configured strategy.

- **Strategy**: The strategy to use when the queue is full. The two strategies are:

  <!-- TODO: check for accuracy -->
  - **None**: Messages are not dropped [unless they expire](#message-expiry), and the queue can grow indefinitely. This is the default behavior.

  - **DropOldest**: The oldest message in the queue is dropped.

The limit only applies to the subscriber's outgoing queue. This is the queue of messages that haven't yet been assigned packet IDs, since the subscriber's in-flight queue is currently full. The limit is not applied to the in-flight queue.

Because the limit is applied per [backend chain](./howto-configure-availability-scale.md#backend-chain), the broker can't guarantee total number of outgoing messages for a subscriber in the cluster as a whole. For example, setting length to 10000 doesn't means the subscriber receives at most 10000 messages. Rather, it could receive up to `10000 * number of chains * number of backend workers` messages.

### Slow subscribers

A slow subscriber is a subscriber that can't keep up with the rate of messages being sent to it. This can happen for a variety of reasons, such as the subscriber being slow to process messages, the subscriber being disconnected, or the subscriber being offline. The subscriber queue limit is a way to prevent a slow subscriber from using too much memory.

### Message expiry

The subscriber queue limit can be used with the max message expiry setting `maxSessionExpirySeconds` to ensure that messages are not kept in the queue indefinitely. If a message is in the queue for longer than the max message expiry, it's dropped. This can also be useful to prevent a slow subscriber from using too much memory.

## Next steps

- [Configure listeners for the MQTT broker](./howto-configure-brokerlistener.md)
- [Test connectivity to the broker](./howto-test-connection.md)