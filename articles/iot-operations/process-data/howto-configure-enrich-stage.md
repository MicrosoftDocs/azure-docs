---
title: Enrich data in a pipeline
description: Configure an enrich pipeline stage to enrich data in a Data Processor pipeline with contextual or reference data.
author: dominicbetts
ms.author: dobett
# ms.subservice: data-processor
ms.topic: how-to
ms.date: 10/03/2023

#CustomerIntent: As an operator, I want enrich data in a pipeline so that I can contextualize data from disparate data sources to make data more meaningful and actionable.
---

# Enrich data in a pipeline

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

The _enrich_ stage is an optional, intermediate pipeline stage that lets you enrich the pipeline's data with contextual and reference information from [Reference data store](concept-contextualization.md) datasets. The enrich stage helps you to contextualize data from disparate data sources, to make the data in th pipeline more meaningful and actionable.

You can join the pipeline's data to a reference dataset's data by using common tags, IDs, or timestamps.

## Prerequisites

To configure and use an enrich pipeline stage, you need a deployed instance of Data Processor Preview.

## Configure the stage

The enrich stage JSON configuration defines the details of the stage. To author the stage, you can either interact with the form-based UI, or provide the JSON configuration on the **Advanced** tab:

| Field | Description | Required | Options | Example |
|---|---|---|---|---|
| Name | A name to show in the Data Processor UI.  | Yes | - | `ERP Context` |
| Description | A user-friendly description of what the enrich stage does. | No | - |  `Enrich with vendor data set` |
| Dataset | Select the dataset with the reference data for the enrichment. | Yes | - |  `Vendor data set` |
| Output path | [Path](concept-configuration-patterns.md#path) to the location in the outgoing message to place the reference data. | Yes | - |  `.payload.erp` |
| Enrich as array | If true, the enriched entry is always an array. | No | `No`/`Yes` |  `Yes` |
| Limit | Limit the number entries returned from the reference dataset. This setting controls the number of records that get enriched in the message. | No | - |  `100` |
| Conditions&nbsp;>&nbsp;Operator | The join [condition operator](#condition-operators) for data enrichment.| No | `keyMatch`/ `pastNearest`/`futureNearest` | `keyMatch` |
| Conditions&nbsp;>&nbsp;Input path | [Path](concept-configuration-patterns.md#path) to the key to use to match against each condition. | No | - | `.payload.asset` |
| Conditions&nbsp;>&nbsp;Property | Property name or timestamp path for the join condition provided at the selected data set configuration | No | [Path](concept-configuration-patterns.md#path) to `Property name` or `Timestamp` | `equipmentName` |

### Condition operators

| Join condition | Description |
|---|---|
| `keyMatch` | An ID-based join that joins the data for which there's an exact match between the key or property's name specified in the enrich stage and the reference data store. |
| `pastNearest` | A timestamp-based join that joins the reference data with closest past timestamp in the reference data store in relation to the message timestamp provided in the enrich stage. |
| `futureNearest` | A timestamp-based join that joins the reference data with closest future timestamp in the reference data store in the relation to the message timestamp provided in the enrich stage. |

Notes:

- If you don't provide a condition, all the reference data from the data set is enriched.
- If the input path references a timestamp, the timestamps must be in RFC3339 format.
- `keyMatch` is case sensitive.
- Each enrich stage can have up to 10 conditions.
- Each enrich stage can only have one time-based join condition: `pastNearest` or `futureNearest`.
- If a `keyMatch` ID-based join is combined with `pastNearest` or `futureNearest` timestamp-based join conditions, then the `keyMatch` is applied first to filter the returned entries before `pastNearest` or `futureNearest` is applied.
- You can apply multiple `keyMatch` conditions to the returned entries. A logical `AND` operation is performed between multiple `keyMatch` conditions.

If the pod for the pipeline unexpectedly goes down, there's a possibility that the join with the backlogged event data pipeline is using invalid or future values from the reference data store dataset. This situation can lead to undesired data enrichment. To address this issue and filter out such data, use the `pastNearest` condition.

By using the `pastNearest` condition in the enrich stage, only past values from the reference data are considered for enrichment. This approach ensures that the data being joined doesn't include any future values from the reference data store data set. The `pastNearest` condition filters out future values, enabling more accurate and reliable data enrichment.

## Sample configuration

In the configuration for the enrich stage, you define the following properties:

| Field | Example |
|---|---|
| Name | enrichment |
| Description | enrich with equipment data |
| Dataset | `equipment` |
| Output path | `.payload` |
| Enrich as array | Yes |
| Condition&nbsp;>&nbsp;Operator | `keyMatch` |
| Condition&nbsp;>&nbsp;Input path | `.payload.assetid` |
| Condition&nbsp;>&nbsp;Property | `equipment name` |

The join uses a condition that matches the `assetid` value in the incoming message with the `equipment name` field in the reference data set. This configuration enriches the message with the relevant data from the data set.

### Example

This example builds on the [reference data sets](howto-configure-reference.md) example. You want to enrich the time-series data that a pipeline receives data from a manufacturing facility with reference data by using the enrich stage. This example uses an incoming payload that looks like the following JSON:

```json
payload: {
      { 
        "assetid": "Oven", 
        "timestamp": "T05:15:00.000Z", 
        "temperature": 120, 
        "humidity": 99 
    }, 
      { 
        "assetid": "Oven", 
        "timestamp": "T05:16:00.000Z", 
        "temperature": 127, 
        "humidity": 98 
    }, 
      { 
        "AssetID": "Mixer", 
        "timestamp": "T05:17:00.000Z", 
        "temperature": 89, 
        "humidity": 95 
    }, 
      { 
        "AssetID": "Slicer", 
        "timestamp": "T05:19:00.000Z", 
        "temperature": 56, 
        "humidity": 30 
    } 
} 
```

When the enrich stage applies the join condition, it adds the contextual data from the reference dataset to the message as it flows through the pipeline.

The following JSON shows an example of an enriched output message based on the previous configuration:

```json
payload: {
      { 
        "assetid": "Oven", 
        "timestamp": "2023-05-25T05:15:00.000Z", 
        "temperature": 120, 
        "humidity": 99, 
        "location": "Seattle", 
        "installationDate": "2002-03-05T00:00:00Z",  
        "isSpare": false  
    }, 
      { 
        "assetid": "Oven", 
        "timestamp": "2023-05-25T05:16:00.000Z", 
        "temperature": 127, 
        "humidity": 98, 
        "location": "Seattle", 
        "installationDate": "2002-03-05T00:00:00Z",  
        "isSpare": false  
    }, 
      { 
        "assetid": "Mixer", 
        "timestamp": "2023-05-25T05:17:00.000Z", 
        "temperature": 89, 
        "humidity": 95, 
        "location": "Tacoma",  
        "installationDate": "2005-11-15T00:00:00Z",  
        "isSpare": false  
    }, 
      { 
        "assetid": "Slicer", 
        "Timestamp": "2023-05-25T05:19:00.000Z", 
        "Temperature": 56, 
        "humidity": 30, 
        "location": "Seattle",  
        "installationDate": "2021-04-25T00:00:00Z",  
        "isSpare": true  
    } 
} 
```

## Related content

- [What is contextualization?](concept-contextualization.md)
- [Configure a reference dataset](howto-configure-reference.md)
- [Send data to the reference data store](howto-configure-destination-reference-store.md)
- [Use last known values in a pipeline](howto-configure-lkv-stage.md)
