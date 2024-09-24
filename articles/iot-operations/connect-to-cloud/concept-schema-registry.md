---
title: Understand message schemas
description: Learn how schema registry handles message schemas to work with Azure IoT Operations components including dataflows.
author: kgremban
ms.author: kgremban
ms.topic: conceptual
ms.date: 09/23/2024

#CustomerIntent: As an operator, I want to understand how I can use message schemas to filter and transform messages.
---

# Understand message schemas

Schema registry, a feature provided by Azure Device Registry Preview, is a synchronized repository in the cloud and at the edge. The schema registry stores the definitions of messages coming from edge assets, and then exposes an API to access those schemas at the edge. 

The connector for OPC UA can create message schemas and add them to the schema registry or customers can upload schemas to the operations experience web UI.

Edge services use message schemas to filter and transform messages as they're routed across your industrial edge scenario.

*Schemas* are documents that describe data to enable processing and contextualization. *Message schemas* describe the format of a message and its contents.

## How dataflows use message schemas

Message schemas are used in all three phases of a dataflow: defining the source input, applying data tranformations, and creating the destination output.

### Input schema

Each dataflow source requires a message schema.

Asset sources have a predefined message schema that was created by the connector for OPC UA.

MQTT sources require an uploaded message schema. Azure IoT Operations supports JSON schemas, and the filename is used as the schema name. In the operations experience, you can select an existing schema or upload one while defining an MQTT source:

:::image type="content" source="./media/concept-schema-registry/upload-schema.png" alt-text="Screenshot that shows uploading a message schema in the operations experience portal.":::

### Transformation

The operations experience uses the input schema as a starting point for your data, making it easier to select transformations based on the known input message format.

### Output schema

Schemas are only used for dataflows that select Fabric or ADX as the destination endpoint.

For these dataflows, the operations experience applies any transformations to the input schema then creates a new schema in Delta format. When the dataflow custom resource (CR) is created, it includes a `schemaRef` value that points to the generated schema stored in the schema registry.

Other endpoints don't need reference schemas because they accept messages in JSON format
