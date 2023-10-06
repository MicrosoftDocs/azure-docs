---
title: Aggregate data in a pipeline
description: Configure an aggregate pipeline stage to aggregate data in a Data Processor pipeline to enable batching and down-sampling scenarios.
author: dominicbetts
ms.author: dobett
# ms.subservice: data-processor
ms.topic: how-to
ms.date: 10/03/2023

#CustomerIntent: As an operator, I want to aggregate data in a pipeline so that I can down-sample or batch messages.
---

# Aggregate data in a pipeline

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

The _aggregate_ stage is an optional, configurable, intermediate pipeline stage that lets you run down-sampling and batching operations on streaming sensor data over user-defined time [windows](#windows).

Use an aggregate stage to accumulate messages over a defined [window](#windows) and calculate aggregation values from properties in the messages. The stage emits the aggregated values as properties in a single message at the end of each time window.

- Each pipeline partition carries out aggregation independently of each other.
- The output of the stage is a single message that contains all the defined aggregate properties.
- The stage drops all other properties. However, you can use the **Last**, **First**, or **Collect** [functions](#functions) to preserve properties that would otherwise be dropped by the stage during aggregation.
- For the aggregate stage to work, the data source stage in the pipeline should deserialize the incoming message.

## Prerequisites

To configure and use an aggregate pipeline stage, you need a deployed instance of Data Processor Preview.

## Configure the stage

The aggregate stage JSON configuration defines the details of the stage. To author the stage, you can either interact with the form-based UI, or provide the JSON configuration on the **Advanced** tab:

| Field | Type | Description | Required | Default | Example |
| --- | --- | --- | --- | --- | --- |
| Name  | String|  A name to show in the Data Processor UI.  | Yes | -  | `Calculate Aggregate`  |
| Description | String |  A user-friendly description of what the aggregate stage does. |  No |  | `Aggregation over temperature`  |
| [Time window](#windows) | [Duration](concept-configuration-patterns.md#duration) that specifies the period over which the aggregation runs.  | Yes | - | `10s` |
| Properties&nbsp;>&nbsp;Function  | Enum | The aggregate [function](#functions) to use. | Yes | - | `Sum` |
| Properties&nbsp;>&nbsp;InputPath<sup>1</sup> | [Path](concept-configuration-patterns.md#path) | The [Path](concept-configuration-patterns.md#path) to the property in the incoming message to apply the function to.  | Yes | - | `.payload.temperature`  |
| Properties&nbsp;>&nbsp;OutputPath<sup>2</sup> | [Path](concept-configuration-patterns.md#path) | The [Path](concept-configuration-patterns.md#path) to the location in the outgoing message to place the result. | Yes | - | `.payload.temperature.average` |

You can define multiple **Properties** configurations in one aggregate stage. For example, calculate the sum of temperature and calculate the average of pressure.  

Input path<sup>1</sup>:

- The data type of the value of the input path property must be compatible with the type of [function](#functions) defined.
- You can provide the same input path across multiple aggregation configurations to calculate multiple functions over the same input path property. Make sure the output paths are different to avoid overwriting the results.  

Output path<sup>2</sup>:

- Output paths can be the same as or different from the input path. Use different output paths if you're calculating multiple aggregations on the same input path property.
- Configure distinct output paths to avoid overwriting aggregate values.

### Windows

The window is the time interval over which the stage accumulates messages. At the end of the window, the stage applies the configured function to the message properties. The stage then emits a single message.

Currently, the stage only supports _tumbling_ windows.  

Tumbling windows are a series of fixed-size, nonoverlapping, and consecutive time intervals. The window starts and ends at fixed points in time:

:::image type="content" source="media/tumbling-window.png" alt-text="Diagram that shows 10 second tumbling windows in the aggregate stage." border="false":::

The size of the window defines the time interval over which the stage accumulates the messages. You define the window size by using the [Duration](concept-configuration-patterns.md#duration) common pattern.

### Functions

The aggregate stage supports the following functions to calculate aggregate values over the message property defined in the input path:

| Function | Description |
| --- | --- |
| Sum | Calculates the sum of the values of the property in the input messages. |
| Average | Calculates the average of the values of the property in the input messages. |
| Count | Counts the number of times the property appears in the window. |
| Min | Calculates the minimum value of the values of the property in the input messages. |
| Max | Calculates the maximum value of the values of the property in the input messages. |
| Last | Returns the latest value of the values of the property in the input messages. |
| First | Returns the first value of the values of the property in the input messages. |
| Collect | Return all the values of the property in the input messages. |

The following table lists the [message data types](concept-message-structure.md#data-types) supported by each function:

| Function | Integer | Float | String | Datetime | Array | Object | Binary |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Sum | ✅ | ✅ | ❌| ❌ | ❌ | ❌ | ❌|
| Average | ✅ | ✅ | ❌| ❌ | ❌ | ❌ | ❌|
| Count | ✅ | ✅ | ✅| ✅ | ✅ | ✅| ✅|
| Min | ✅ | ✅ | ✅| ✅ | ✅ | ❌| ❌|
| Max | ✅ | ✅ | ✅| ✅ | ✅ | ❌| ❌|
| Last | ✅ | ✅ | ✅| ✅ | ✅ | ✅| ✅|
| First | ✅ | ✅ | ✅| ✅ | ✅ | ✅| ✅|
| Collect | ✅ | ✅ | ✅| ✅ | ✅ | ✅| ✅|

## Sample configuration

The following JSON example shows a complete aggregate stage configuration:

:::code language="json" source="snippets/aggregate-configuration.json":::

The configuration defines an aggregate stage that calculates, over a ten-second window:

- Average temperature
- Sum of temperature
- Sum of pressure

### Example

This example includes two sample input messages and a sample output message generated by using the previous configuration:

Input message 1:

:::code language="json" source="snippets/aggregate-input-message-1.json":::

Input message 2:

:::code language="json" source="snippets/aggregate-input-message-2.json":::

Output message:

:::code language="json" source="snippets/aggregate-output-message.json":::

## Related content

- [Enrich data in a pipeline](howto-configure-enrich-stage.md)
- [Filter data in a pipeline](howto-configure-filter-stage.md)
- [Call out to a gRPC endpoint from a pipeline](howto-configure-grpc-callout-stage.md)
- [Call out to an HTTP endpoint from a pipeline](howto-configure-http-callout-stage.md)
- [Use last known values in a pipeline](howto-configure-lkv-stage.md)
- [Transform data in a pipeline](howto-configure-transform-stage.md)
