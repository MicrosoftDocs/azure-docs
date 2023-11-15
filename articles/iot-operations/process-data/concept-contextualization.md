---
title: Understand message contextualization
description: Understand how you can use message contextualization in Azure IoT Data Processor to enrich messages in a pipeline.
author: dominicbetts
ms.author: dobett
# ms.subservice: data-processor
ms.topic: concept-article
ms.custom:
  - ignite-2023
ms.date: 09/28/2023

#CustomerIntent: As an operator, I want understand what contextualization is so that I can enrich messages in my pipelines using reference or lookup data.
---

# What is contextualization?

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Contextualization adds information to messages in a pipeline. Contextualization can:

- Enhance the value, meaning, and insights derived from the data flowing through the pipeline.
- Enrich your source data to make it more understandable and meaningful.
- Make it easier to interpret your data and facilitates more accurate and effective decision making.

For example, the temperature sensor in your factory sends a data point that reads 250 &deg;F. Without contextualization, it's hard to derive any meaning from this data. However, if you add context such as "The temperature of the _oven_ asset during the _morning_ shift was 250 &deg;F," the value of the data increases significantly as you can now derive useful insights from it.

:::image type="content" source="media/pipeline-contextualization.png" alt-text="A diagram that shows how contextualization works in a pipeline." border="false":::

Contextualized data provides a more comprehensive picture of the operations, helping you make more informed decisions. The contextual information enriches the data making data analysis easier. It helps you optimize processes, enhance efficiency, and reduce downtime.

## Message enrichment

An Azure IoT Data Processor (preview) pipeline contextualizes data by enriching the messages that flow through the pipeline with previously stored reference data. Contextualization uses the built-in [reference data store](howto-configure-reference.md). You can break the process of using the reference data store within a pipeline into three steps:

1. Create and configure a dataset. This step creates and configures your datasets within the [reference data store](howto-configure-reference.md). The configuration includes the keys to use for joins and the reference data expiration policies.

1. Ingest your reference data. After you configure your datasets, the next step is to ingest data into the reference data store. Use the output stage of the reference data pipeline to feed data into your datasets.  

1. Enrich your data. In an enrich stage, use the data stored in the reference data store to enrich the data passing through the Data Processor pipeline. This process enhances the value and relevance of the data, providing you with richer insights and improved data analysis capabilities.

## Related content

- [Configure a reference dataset](howto-configure-reference.md)
- [Send data to the reference data store](howto-configure-destination-reference-store.md)
- [Enrich data in a pipeline](howto-configure-enrich-stage.md)
- [Use last known values in a pipeline](howto-configure-lkv-stage.md)
