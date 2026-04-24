---
title: Deployment planning - Advanced MQTT options
description: Plan advanced MQTT client options for your Azure IoT Operations MQTT broker before deployment.
author: huguesbouvier
ms.author: hubouvie
ms.topic: conceptual
ms.service: azure-iot-operations
ms.date: 04/21/2026
#CustomerIntent: As an IT administrator, I want to understand advanced MQTT client options so I can decide whether to customize them before deploying Azure IoT Operations.
---

# Deployment planning - Advanced MQTT options

Decide before deployment whether you need to customize MQTT client options for the broker.

> [!IMPORTANT]
> This setting requires that you modify the Broker resource. It's configured only at initial deployment by using the Azure CLI or the Azure portal. A new deployment is required if Broker configuration changes are needed. To learn more, see [Customize default Broker](../manage-mqtt-broker/overview-broker.md#customize-default-broker).

The MQTT broker advanced client options control how the broker interacts with MQTT clients. These settings, negotiated between the broker and the client during connection, include session expiry, message expiry, receive maximum, and keep alive. The only setting specific to Azure IoT Operations is the [subscriber queue limit](#subscriber-queue-limit).

In many scenarios, the default client settings are sufficient. To override the default client settings for the MQTT broker, edit the `advanced.clients` section in the Broker resource. Currently, this override is supported only by using the `--broker-config-file` flag when you deploy IoT Operations by using the `az iot ops create` command. For more information, see [Azure CLI support for advanced MQTT broker configuration](https://aka.ms/aziotops-broker-config).

For the complete list of available settings, see the [ClientConfig](/rest/api/iotoperations/broker/create-or-update#clientconfig) API reference.

To get started, prepare a Broker configuration file in JSON format, like the following example:

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
  }
}
```

Then, deploy IoT Operations by using the `az iot ops create` command with the `--broker-config-file` flag, like the following command. (Other parameters are omitted for brevity.)

```azurecli
az iot ops create ... --broker-config-file <FILE>.json
```

## Subscriber queue limit

The MQTT broker keeps a queue for each subscriber with QoS 1 messages waiting to be delivered. Messages are added to this queue when they're received from the publisher. They're removed after they're delivered and acknowledged by the subscriber with a PUBACK message. If messages arrive faster than the subscriber can acknowledge them, or if the subscriber is offline with a persistent session, the queue can grow large.

The MQTT broker can [buffer these messages to disk](deployment-planning-disk-buffer.md) to save memory, but this tactic might not always be enough. The disk buffer might not be set up, or it could be full because of other subscribers. Therefore, the subscriber queue limit helps prevent the broker from using too much memory for a single subscriber.

The subscriber queue limit has two settings:

- **Length**: The maximum number of messages that can be queued for a single subscriber. If the queue is full and a new message arrives, the broker drops the message based on the configured strategy.
- **Strategy**: The strategy to use when the queue is full. The two strategies are:

  - **None**: Messages aren't dropped unless the session expires, and the queue can grow indefinitely. This behavior is the default.
  - **DropOldest**: The oldest message in the queue is dropped.

## Slow subscribers

A slow subscriber is one that can't keep up with the incoming message rate. This problem can occur if the subscriber processes messages slowly, is disconnected, or is offline. The subscriber queue limit helps prevent a slow subscriber from consuming too much memory.

## Message expiry

The `maxMessageExpirySeconds` setting controls how long a message can stay in the queue before it expires. If a message stays in the queue longer than the maximum expiry time, it's marked as expired. However, expired messages are discarded only when they reach the beginning of the queue. This passive expiry mechanism helps manage memory usage by ensuring that old messages are eventually removed.

## Session expiry

The `maxSessionExpirySeconds` setting works with the subscriber queue limit to ensure that messages aren't kept in the queue indefinitely. If a session expires, all messages in the queue for that session are dropped. This practice helps prevent offline subscribers from using too much memory by eventually clearing the entire queue.

Both message expiry and session expiry are important for managing slow and offline subscribers and ensuring efficient memory usage.

## Max message expiry and retained messages

In MQTT 5, retained messages respect the message expiry interval specified in the `PUBLISH` packet. If an expiry interval is set, the retained message is removed once the interval elapses. If no interval is provided, the message remains available indefinitely.

The `maxMessageExpirySeconds` setting defines a global upper limit for message expiry, applying to all messages, including retained ones. For example, if `maxMessageExpirySeconds` is set to `1000` seconds and a retained message specifies an expiry interval of `2000` seconds, the message is still removed after `1000` seconds.

By default, `maxMessageExpirySeconds` is not set. In this case, retained messages do not expire unless an expiry interval is explicitly defined in the message.

## Next steps

- [Review internal traffic encryption options](deployment-planning-encryption.md)
- [Review certificate management options](deployment-planning-certificates.md)
- [Review disk-backed message buffer settings](deployment-planning-disk-buffer.md)
- [Prepare your cluster](howto-prepare-cluster.md)
