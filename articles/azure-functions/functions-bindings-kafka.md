---
title: Apache Kafka bindings for Azure Functions
description: Learn to integrate Azure Functions with an Apache Kafka stream.
author: craigshoemaker
ms.topic: reference
ms.date: 06/14/2021
ms.author: cshoe
---

# Apache Kafka bindings for Azure Functions overview

Invoke Azure Functions and write values out to [Apache Kafka](https://kafka.apache.org/) event streams.

> [!IMPORTANT]
> Kafka bindings are only available for Azure Functions on the [Premium Plan](functions-premium-plan.md) an on Kubernetes where scaling is handed by KEDA.

| Action | Type |
|---------|---------|
| Run a function based on a new Kafka event | [Trigger](./functions-bindings-kafka-trigger.md) |
| Write to the Kafka event stream  |[Output binding](./functions-bindings-kafka-output.md) |

----


## Next steps

- [Run a function from an Apache Kafka event stream](./functions-bindings-kafka-trigger.md)
