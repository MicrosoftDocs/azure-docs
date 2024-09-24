---
title: Create message schemas
description: Learn how to install schema registry on your cluster and create message schemas to use with dataflows.
author: kgremban
ms.author: kgremban
ms.topic: how-to
ms.date: 09/23/2024

#CustomerIntent: As an operator, I want to understand how I can use message schemas to filter and transform messages.
---

# Create message schemas

Use schema registry to store and synchronize message schemas across the cloud and edge. Dataflows and other edge services use message schemas to filter and transform messages as they're routed across your industrial edge scenario.

Schemas are documents that describe data to enable processing and contextualization.

Message schemas describe the format of a message and its contents.

## Prerequisites

* An Azure IoT Operations instance deployed to a cluster along with a schema registry. For more information, see [Deployment details](../deploy-iot-ops/overview-deploy.md).

## Upload message schemas in the operations experience

The operations experience uses schemas when you define dataflow endpoints.

1. Save your message schema locally as a JSON file.

1. In the [operations experience](https://iotoperations.azure.com), select your site and Azure IoT Operations instance.

1. Select **Dataflows** > **Create dataflow**.

1. Select **Source** > **MQTT**.

1. Select **Upload**.

   :::image type="content" source="./media/howto-schema-registry/upload-schema.png" alt-text="Screenshot that shows uploading a message schema in the operations experience portal.":::

1. Browse to your message schema JSON file and select **Open**.

