---
title: What is pipeline partitioning?
description: Understand how to use partitioning in pipelines to enable parallelism. Partitioning can improve throughput and reduce latency
author: dominicbetts
ms.author: dobett
# ms.subservice: data-processor
ms.topic: concept-article
ms.date: 09/28/2023

#CustomerIntent: As an operator, I want understand how I can partition my data into multiple pipeline instances so that I can improve throughput and reduce latency.
---

# What is partitioning?

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In a Data Processor Preview pipeline, partitioning divides incoming data into separate partitions to enable data parallelism. Data parallelism improves throughput and reduces latency. Partitioning also affects how pipeline stages, such as the last known value (LKV) and aggregate stages, process data.

<!-- TODO: Add links to pipeline stages in previous paragraph -->

## Partitioning concepts

Data Processor uses two partitioning concepts:

- Physical partitions that correspond to actual data streams within the system.
- Logical partitions that correspond to conceptual data streams that are processed together.

A Data Processor pipeline exposes partitions as logical partitions to the user. The underlying system maps these logical partitions onto physical partitions.

To specify a partitioning strategy for a pipeline, you provide two pieces of information:

- The number of physical partitions for your pipeline.
- A partitioning strategy that includes the partitioning type and an expression to compute the logical partition for each incoming message.

It's important to choose the right partition counts and partition expressions for your scenario. The data processor preserves the order of data within the same logical partition, and messages in the same logical partition can be combined in pipeline stages such as the LKV and aggregate stages. The physical partition count can't be changed and determines pipeline scale limits.

<!-- TODO: Add links to pipeline stages in previous paragraph -->

:::image type="content" source="media/pipeline-partitioning.png" alt-text="A diagram that shows the effect of partitioning a pipeline." border="false":::

## Partitioning configuration

Partitioning within a pipeline is configured at the input stage of the pipeline. The input stage calculates the partitioning key from the incoming message. However, partitioning does affect other stages in a pipeline.

Partitioning configuration includes:

| Field | Description | Required | Default | Example |
| ----- | ----------- | -------- | ------- | ------- |
| Partition count | The number of physical partitions in a data processor pipeline. | Yes | N/A | 3 |
| Type | The type of logical partitioning to be used: Partition `id` or Partition `key`. | Yes | `key` | `key` |
| Expression | The jq expression to execute against the incoming message to compute Partition `id` or Partition `key`. | Yes | N/A | `.topic` |

You provide a [jq expression](concept-jq-expression.md) that applies to the entire message that arrives in the data processor pipeline to generate the partition key or partition ID. The output of this query mustn't exceed 128 characters.

## Partitioning types

There are two partitioning types you can configure:

### Partition key

Specify a jq expression that dynamically computes a logical partition key string for each message:

- The partition manager automatically assigns partition keys to physical partitions by the partition manager.
- All correlated data, such as LKVs and aggregates, is scoped to a logical partition.
- The order of data in each logical partition is guaranteed.

This type of partitioning is most useful when you have dozens or more logical groupings of data.

### Partition ID

Specify a jq expression that dynamically computes a numeric physical partition ID for each message for example `.topic.assetNumber % 8`.

- Messages are placed in the physical partition that you specify.
- All correlated data is scoped to a physical partition.

This type of partitioning is best suited when you have small numbers of logical groupings of data or want precise control over scaling and work distribution. The number of partition IDs produced should be an integer and must not exceed the value of `'partitionCount' – 1`.

## Considerations

When you're choosing a partitioning strategy for your pipeline:

- Data ordering is preserved within a logical partition as it's received from the MQTT broker topics.
- Choose a partitioning strategy based on the nature of incoming data and desired outcomes. For example, the LKV stage and the aggregate stage perform operations on each logical partition.
- Select a partition key that evenly distributes data across all partitions.
- Increasing the partition count can improve performance but also consumes more resources. Balance this trade-off based on your requirements and constraints.

## Related content

- [Data processor messages](concept-message-structure.md)
- [Supported formats](concept-supported-formats.md)
- [What are configuration patterns?](concept-configuration-patterns.md)
