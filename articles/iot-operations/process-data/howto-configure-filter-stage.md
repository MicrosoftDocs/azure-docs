---
title: Filter data in a pipeline
description: Configure a filter pipeline stage to remove messages that aren't needed for further processing and to avoid sending unnecessary data to cloud services.
author: dominicbetts
ms.author: dobett
ms.subservice: data-processor
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 10/03/2023

#CustomerIntent: As an operator, I want filter data in a pipeline so that I can remove messages that I don't need from the data processing pipeline.
---

# Filter data in a pipeline

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Use a _filter_ stage to filter out messages that you don't need for further processing in the pipeline. The stage emits the original message to the filter stage unchanged if the filter criteria is met, otherwise the stage drops the message from the pipeline.

- Each pipeline partition filters out messages independently of other partitions.
- The output of the filter stage is the original message if the stage doesn't filter it out.

## Prerequisites

To configure and use a filter pipeline stage, you need a deployed instance of Azure IoT Data Processor (preview).

## Configure the stage

The filter stage JSON configuration defines the details of the stage. To author the stage, you can either interact with the form-based UI, or provide the JSON configuration on the **Advanced** tab:

| Name | Value | Required | Default | Example |
| --- | --- | --- | --- | --- |
| Display name  | A name to show in the Data Processor UI.  | Yes | -  | `Filter1` |
| Description | A user-friendly description of what the filter stage does.  | No | -  | `Filter out anomalies` |
| Query | The [jq expression](#jq-expression)  | Yes | - | `.payload.temperature > 0 and .payload.pressure < 50` |

### jq expression

Filter queries in Data Processor use the [jq](concept-jq.md) language to define the filter condition:

- The jq provided in the query must be syntactically valid.
- The result of the filter query must be a boolean value.
- Messages that evaluate to `true` are emitted unchanged from the filter stage to subsequent stages for further processing. Messages that evaluate to `false` are dropped from the pipeline.
- All messages for which the filter doesn't return a boolean result are treated as an error case and dropped from the pipeline.
- The filter stage adheres to the same restriction on jq usage as defined in the [jq expression](concept-jq-expression.md) guide.

When you create a filter query to use in the filter stage:

- Test your filter query with your messages to make sure a boolean result is returned.
- Configure the filter query based on how the message arrives at the filter stage.  
- To learn more about building your filter expressions, see the[jq expressions](concept-jq-expression.md) guide.

## Sample configuration

The following JSON example shows a complete filter stage configuration:

```json
{ 
    "displayName": "Filter name", 
    "description": "Filter description", 
    "query": "(.properties.responseTopic | contains(\"bar\")) or (.properties.responseTopic | contains(\"baz\")) and (.payload | has(\"temperature\")) and (.payload.temperature > 0)"
}
```

This filter checks for messages where `.properties.responseTopic` contains `bar` or `baz` and the message payload has a property called `temperature` with a value greater than `0`.

## Related content

- [Aggregate data in a pipeline](howto-configure-aggregate-stage.md)
- [Enrich data in a pipeline](howto-configure-enrich-stage.md)
- [Call out to a gRPC endpoint from a pipeline](howto-configure-grpc-callout-stage.md)
- [Call out to an HTTP endpoint from a pipeline](howto-configure-http-callout-stage.md)
- [Use last known values in a pipeline](howto-configure-lkv-stage.md)
- [Transform data in a pipeline](howto-configure-transform-stage.md)
