---
title: Send data to the reference data store from a pipeline
description: Configure a pipeline destination stage to send the pipeline output to the reference data store to use to contextualize messages in other pipelines.
author: dominicbetts
ms.author: dobett
ms.subservice: data-processor
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 10/09/2023

#CustomerIntent: As an operator, I want to send data from a pipeline to the reference data store so that I can use the reference data to contextualize and enrich messages in other pipelines.
---

# Send data to the reference data store

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Use the _Reference datasets_ destination to write data to the internal reference data store. You use the data stored in reference datasets is used to enrich data streams with [contextual information](concept-contextualization.md).

## Prerequisites

To configure and use an Azure Data Explorer destination pipeline stage, you need a deployed instance of Azure IoT Data Processor (preview).

## Configure the destination stage

The reference datasets destination stage JSON configuration defines the details of the stage. To author the stage, you can either interact with the form-based UI, or provide the JSON configuration on the **Advanced** tab:

| Field | Type | Description | Required | Default | Example |
| --- | --- | --- | --- | --- | --- |
| Dataset  | String | The reference dataset to write to.  | Yes | -  | `equipmentData` |

You must [create the dataset](howto-configure-reference.md) before you can write to it.

## Related content

- [What is contextualization?](concept-contextualization.md)
- [Configure a reference dataset](howto-configure-reference.md)
- [Enrich data in a pipeline](howto-configure-enrich-stage.md)
- [Use last known values in a pipeline](howto-configure-lkv-stage.md)
